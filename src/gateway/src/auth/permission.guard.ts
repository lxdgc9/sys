import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './decorators/permissions.decorator';
import { Permission } from './permission.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    console.log('debug:', requiredPermissions);

    if (!requiredPermissions) {
      return true;
    }

    // const { user } = context.switchToHttp().getRequest();
    // return requiredPermissions.some((permissions) => user.roles?.includes(role));
    return true;
  }
}
