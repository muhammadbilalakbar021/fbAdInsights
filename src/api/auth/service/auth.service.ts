import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountService } from 'src/api/account/service/account.service';
import { JwtEntity, JwtDocument } from '../entity/jwt.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    @InjectModel(JwtEntity.name)
    private readonly jwtModel: Model<JwtDocument>,
  ) {}
  async validateEmail(username: string, email: string): Promise<any> {
    return this.accountService.verifyAccount(username, email);
  }

  async login(body: any) {
    try {
      const user = await this.accountService.getAccountByEmailPassword(
        body.email,
        body.password,
      );
      if (!user) throw 'User not found';
      const payload = {
        email: user.email,
        username: user.username,
        isValid: true,
        isCreated: user.isCreated,
        createdAt: user.createdAt,
      };

      return this.jwtService.sign(payload);
    } catch (error) {
      return error;
    }
  }

  async addJWT(userId: string, jwt, jwtType: string) {
    try {
      await this.jwtModel.create({
        userId: userId.valueOf(),
        jwt,
        jwtType,
        createdAt: new Date(),
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  verifyJwt(jwt) {
    return this.jwtService.verify(jwt);
  }

  async getJwt(_id: any, jwtType: any, isValid: any) {
    try {
      return await this.jwtModel
        .find({
          userId: _id,
          jwtType: jwtType,
          isValid: isValid,
        })
        .sort({ _id: -1 });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
