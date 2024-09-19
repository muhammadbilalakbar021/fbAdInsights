import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadGatewayException,
  UseFilters,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpExceptionFilter } from '../filter/exception.filter';
import { RequestLog } from '../log/requestlog.service';
import { RequestEntity } from 'src/database/models/request.entity';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly requestLog: RequestLog) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const { body, statusText } = ctx.getResponse<Response>();

    const now = Date.now();
    console.log('Request Received...');
    console.log('Method...', request.method);
    console.log('Url...', request.url);

    return next.handle().pipe(
      tap((data) => {
        this.requestLog.add({
          method: request.method,
          url: request.url,
        });
      }),
    );
  }
}
