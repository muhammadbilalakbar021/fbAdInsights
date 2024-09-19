import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { ConfigService } from './config/config.service';
import { useContainer } from 'class-validator';
import * as express from 'express';
import { LoggingInterceptor } from './utils/interceptor/logging.interceptor';
import { HttpExceptionFilter } from './utils/filter/exception.filter';

const configService = new ConfigService();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalInterceptors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use('/api/v1/stripe/stripeWebHook', express.raw({ type: '*/*' }));
  app.useGlobalPipes(new ValidationPipe()); // For Enabling DTOs
  app.setGlobalPrefix('api/v1');

  app.use(json({ limit: '1mb' }));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  console.log(
    'App is lising on 127.0.0.0',
    process.env.PORT || configService.PORT,
  );
  await app.listen(process.env.PORT || configService.PORT, '0.0.0.0');
}
bootstrap();
