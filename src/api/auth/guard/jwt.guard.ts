import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AccountEntity,
  AccountDocument,
} from 'src/api/account/entity/account.entity';
import { requestFromContext } from 'src/utils/request/request-from-context';
import { Reflector } from '@nestjs/core';
import { ExtractJwt } from 'passport-jwt';
import { jwtTypeEnum } from 'src/utils/misc/enums';
import { JwtDocument, JwtEntity } from '../entity/jwt.entity';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private readonly reflector: Reflector,
    @InjectModel(AccountEntity.name)
    private readonly accountModel: Model<AccountDocument>,
    @InjectModel(JwtEntity.name)
    private readonly authModel: Model<JwtDocument>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //Get Request..
    const request = this.getRequest(context);
    if (!request) return true; // websocket upgrade

    //Bypass guard for public routes OR login routes..
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) return true;

    //Check can activate..
    const canActivate = await (super.canActivate(context) as Promise<boolean>);

    const jwt =
      ExtractJwt.fromAuthHeaderAsBearerToken()(request) ||
      ExtractJwt.fromUrlQueryParameter('auth')(request);

    const allUserJwt = await this.authModel
      .find({
        userId: request.user._id,
        jwtType: request.user.jwtType,
        isValid: true,
      })
      .sort({ _id: -1 });

    const jwtType = request.user.jwtType;
    const actualJwts = allUserJwt;

    const verifyJwtAuth = this.verifyJwtAuthentication(
      jwtType,
      jwt,
      actualJwts,
    );
    if (!verifyJwtAuth) throw new UnauthorizedException();

    if (canActivate) {
      const account = await this.verifyAccount(request.user._id);
      if (!account) throw new UnauthorizedException();
      return canActivate;
    }
  }

  async verifyAccount(userId: string): Promise<AccountEntity> {
    try {
      return await this.accountModel
        .findOne({
          _id: userId,
          isBlacklisted: false,
        })
        .lean();
    } catch (error) {
      throw error;
    }
  }

  verifyJwtAuthentication(jwtType, givenJwt, actualJwt) {
    const doesExistInArray = actualJwt.some((e) => e.jwt == givenJwt);
    if (jwtType != jwtTypeEnum.login) return false;
    if (!doesExistInArray) return false;
    if (actualJwt[0]?.jwt !== givenJwt) return false;
    return true;
  }

  getRequest(context: ExecutionContext) {
    return requestFromContext(context);
  }
}
