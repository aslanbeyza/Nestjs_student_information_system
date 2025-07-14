import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../dto/user-role-enum';
import { ROLES_KEY } from '../dto/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user?: { role?: UserRole } }>();
    const user = request.user;

    if (
      typeof user !== 'object' ||
      user === null ||
      typeof user.role !== 'string'
    ) {
      return false;
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
