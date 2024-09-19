import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { rolesTypeEnum } from 'src/utils/misc/enums';

/**
 * Guard for agent role, if there is need to check for roles it will perform a check
 * else it will ignore and execution will continue.
 */
@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    return req.user.userType == rolesTypeEnum.admin;
  }
}
