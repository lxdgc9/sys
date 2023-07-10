import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
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

    if (!requiredPermissions) {
      return true;
    }

    const { user } = ctx.switchToHttp().getRequest();
    const hasAccess = requiredPermissions.some((permission) =>
      user.permissions.includes(permission),
    );

    if (hasAccess) {
      return true;
    }

    throw new ForbiddenException('Pemrission denied');
  }
}
