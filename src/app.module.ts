import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from './config/config.service';
import { RequestLog } from './utils/log/requestlog.service';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './utils/interceptor/logging.interceptor';
import { JwtGuard } from './api/auth/guard/jwt.guard';
import { InsightsModule } from './api/insights/insights.module';
import { AuthModule } from './api/auth/auth.module';
import { AccountModule } from './api/account/account.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    CacheModule.register({
      ttl: 5000, // seconds
      max: 10, // maximum number of items in cache
      isGlobal: true,
    }),
    AuthModule,
    AccountModule,
    InsightsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RequestLog,
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_GUARD, useClass: JwtGuard },
  ],
})
export class AppModule {}
