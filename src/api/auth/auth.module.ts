import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { ResponseService } from '../../utils/response/response.service';
import { ConfigService } from 'src/config/config.service';
import { AccountModule } from '../account/account.module';
import { DatabaseModule } from 'src/database/database.module';
import { JwtStrategy } from './guard/jwt.strategy';
import { AccountService } from '../account/service/account.service';

const configService = new ConfigService();
dotenv.config();

@Module({
  imports: [
    forwardRef(() => AccountModule),
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_TOKEN,
      signOptions: {
        expiresIn: configService.JWT_EXPIRY_TIME,
      },
    }),
  ],
  providers: [AuthService, ResponseService, JwtStrategy, AccountService],
  exports: [
    AuthService,
    JwtModule.register({
      secret: process.env.JWT_TOKEN,
      signOptions: { expiresIn: configService.JWT_EXPIRY_TIME },
    }),
  ],
})
export class AuthModule {}
