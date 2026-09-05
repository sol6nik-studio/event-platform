import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { jwtVerify } from 'jose';
import { IS_PUBLIC } from './public.decorator.js';
import { apiEnvironment } from '../config.js';

export interface AuthenticatedRequest {
  headers: { authorization?: string };
  user?: { id: string; roles: string[] };
}

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
        context.getHandler(),
        context.getClass(),
      ])
    )
      return true;
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!token) throw new UnauthorizedException('Access token is required');
    try {
      const secret = new TextEncoder().encode(apiEnvironment.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret, {
        algorithms: ['HS256'],
        issuer: apiEnvironment.JWT_ISSUER,
        audience: apiEnvironment.JWT_AUDIENCE,
      });
      if (typeof payload.sub !== 'string') throw new Error('Missing subject');
      request.user = {
        id: payload.sub,
        roles: Array.isArray(payload.roles)
          ? payload.roles.filter((role): role is string => typeof role === 'string')
          : [],
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
