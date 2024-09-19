import { Request } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AccountDocument, AccountEntity } from '../entity/account.entity';
import { ResponseService } from 'src/utils/response/response.service';

@Injectable()
export class isAccountExists implements NestMiddleware {
  constructor(
    @InjectModel(AccountEntity.name)
    private readonly accountModel: Model<AccountDocument>,
    private responseService: ResponseService,
  ) {}
  async use(req: any, res: any, next: () => void) {
    try {
      const doubleCheckAccount = await this.accountModel.find({
        email: req.body.email,
      });

      if (!req.body.email)
        return this.responseService.dbError('Account is not valid.  ', res);

      if (doubleCheckAccount.length != 0) {
        return this.responseService.dbError('Account Already Exists', res);
      }
    } catch (error) {
      this.responseService.serverFailureResponse(error.message, res);
    }
    next();
  }
}
