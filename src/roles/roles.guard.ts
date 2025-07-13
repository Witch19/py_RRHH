import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('➡️ user in canActivate', user);

    if (!requiredRoles) return true;
    if (!user?.role) return false;
    console.log('🛡 user:', user);
    console.log('🛡 requiredRoles:', requiredRoles);

    return requiredRoles.includes(user.role);
  }
}