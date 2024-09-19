import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request.body.email, 'request.body.email');
    return this.authService
      .validateEmail(request.body.email, request.body.tx)
      .then((userCheck) => {
        if (userCheck != null) {
          return true;
        }
        return false;
      });
  }
}
