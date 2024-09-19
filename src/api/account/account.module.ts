import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { ResponseService } from '../../utils/response/response.service';
import { AccountService } from './service/account.service';
import { AccountMiddleware } from './middleware/account.middleware';
import { isAccountExists } from './middleware/isAccount.middleware';
import { ParamMiddleware } from './middleware/param.middleware';
import { AccountController } from './controller/account.controller';
import { isNotAccountExists } from './middleware/isNotAccount.middleware';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { AuthService } from '../auth/service/auth.service';

@Module({
  imports: [forwardRef(() => AuthModule), DatabaseModule],
  providers: [AuthService, ResponseService, AccountService],
  exports: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(BodyMiddleware).forRoutes('account');
    consumer.apply(AccountMiddleware).forRoutes(
      { path: 'account/:id', method: RequestMethod.PATCH },
      // { path: 'account', method: RequestMethod.POST },
    );
    consumer
      .apply(ParamMiddleware)
      .forRoutes(
        { path: 'account/:id', method: RequestMethod.PATCH },
        { path: 'account/:id', method: RequestMethod.GET },
      );
    consumer
      .apply(isAccountExists)
      .forRoutes(
        { path: 'account', method: RequestMethod.POST },
        { path: 'account/activate-account', method: RequestMethod.POST },
      );
    consumer.apply(isNotAccountExists).forRoutes({
      path: 'account/activate-account',
      method: RequestMethod.POST,
    });
  }
}
