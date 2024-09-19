import { AuthService } from './../../auth/service/auth.service';
import {
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AccountEntity, AccountDocument } from '../entity/account.entity';
import { Account } from '../interface/user';
import { AccountDto } from '../dto/account.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtTypeEnum } from 'src/utils/misc/enums';

@Injectable()
export class AccountService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectModel(AccountEntity.name)
    private readonly accountModel: Model<AccountDocument>,
    @InjectConnection() private readonly connection: Connection,
    private jwtService: JwtService,
  ) {}

  async insertAccount(account: any): Promise<any> {
    try {
      const user = await this.accountModel.create(account);
      const jwt = await this.login(account.email, account.password);
      if (jwt == undefined) throw jwt;

      return {
        jwt: jwt,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllAccounts(): Promise<AccountEntity[]> {
    try {
      return (await this.accountModel.find({ isDeleted: false }).lean()).map(
        (item) => {
          return new AccountDto(item);
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async getAccountByEmailPassword(
    email: any,
    password: any,
  ): Promise<AccountEntity> {
    try {
      const user = new AccountDto(
        await this.accountModel
          .findOne({
            email,
            isBlacklisted: false,
          })
          .lean(),
      );
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      console.log(isPasswordCorrect);

      if (user && isPasswordCorrect) {
        return user;
      }
      throw new Error('Wrong Password');
    } catch (error) {
      throw error.message;
    }
  }

  async getSingleAccount(accountId: any): Promise<AccountEntity> {
    try {
      return new AccountDto(
        await this.accountModel
          .findOne({
            _id: accountId,
            isBlacklisted: false,
          })
          .lean(),
      );
    } catch (error) {
      throw error;
    }
  }

  async verifyAccount(username: string, email: string): Promise<AccountEntity> {
    try {
      return await this.accountModel
        .findOne({
          username: username,
          email: email,
          isBlacklisted: false,
        })
        .lean();
    } catch (error) {
      throw error;
    }
  }

  async updateSingleAccount(account: Account) {
    // Starting Session for Transaction
    const session = await this.connection.startSession();
    try {
      // Starting Transaction
      session.startTransaction();

      if ((await this.getSingleAccount(account.id)) != null) {
        // eslint-disable-next-line no-var
        const updateAccount = await this.accountModel
          .findByIdAndUpdate(
            {
              _id: account.id,
            },
            account,
          )
          .select('isBlacklisted')
          .lean();

        // After succesfully completion commit the transaction
        await session.commitTransaction();
        // Must close the session
        session.endSession();
        return updateAccount;
      } else {
        // Must close the session
        session.endSession();
        return null;
      }
    } catch (error) {
      // Roll Back Transaction
      await session.abortTransaction();
      // Must close the session
      session.endSession();
      throw error;
    }
  }

  async deleteAccount(userId: string): Promise<AccountEntity> {
    try {
      return await this.accountModel
        .findByIdAndUpdate(
          {
            _id: userId,
          },
          {
            isDeleted: true,
          },
        )
        .select('username')
        .lean();
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.getAccountByEmailPassword(email, password);
      if (!user) throw 'User not found';
      const toPay = this.isExactlyThreeDaysAgo(user.createdAt);

      const payload = {
        _id: user._id,
        isValid: true,
        toPay: toPay,
        createdAt: user.createdAt,
        jwtType: jwtTypeEnum.login,
      };

      console.log(payload);
      const jwt = this.jwtService.sign(payload);
      await this.authService.addJWT(user._id, jwt, jwtTypeEnum.login);
      return jwt;
    } catch (error) {
      return error;
    }
  }

  isMoreThanAMonthAgo(dateString: any): boolean {
    const date = new Date(dateString);
    const now = new Date();
    const monthsDifference =
      now.getFullYear() * 12 +
      now.getMonth() -
      (date.getFullYear() * 12 + date.getMonth());
    return (
      monthsDifference > 1 ||
      (monthsDifference === 1 && now.getDate() >= date.getDate())
    );
  }

  isExactlyThreeDaysAgo(dateString: any): boolean {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const daysDifference = diff / (1000 * 3600 * 24);
    return Math.floor(daysDifference) === 3;
  }
}
