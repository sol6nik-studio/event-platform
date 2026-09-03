import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import argon2 from 'argon2';
import { SignJWT } from 'jose';
import type { PrismaClient } from '@arena-grid/database';
import { PlatformRole, UserStatus } from '@arena-grid/database';
import { DATABASE } from '../platform/database.token.js';
import { apiEnvironment } from '../config.js';

const secret = () => new TextEncoder().encode(apiEnvironment.JWT_SECRET);

@Injectable()
export class AuthService {
  constructor(@Inject(DATABASE) private readonly db: PrismaClient) {}

  async register(input: { email: string; username: string; password: string }) {
    const exists = await this.db.user.findFirst({
      where: { OR: [{ email: input.email }, { username: input.username }] },
    });
    if (exists) throw new ConflictException('Email or username already exists');
    const user = await this.db.user.create({
      data: {
        email: input.email.toLowerCase(),
        username: input.username,
        passwordHash: await argon2.hash(input.password),
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
        roles: { create: [{ role: PlatformRole.PLAYER }] },
      },
      include: { roles: true },
    });
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        roles: user.roles.map((role) => role.role),
      },
      accessToken: await this.token(
        user.id,
        user.roles.map((role) => role.role),
      ),
    };
  }

  async login(input: { email: string; password: string }) {
    const user = await this.db.user.findFirst({
      where: { email: input.email.toLowerCase(), status: { not: UserStatus.DELETED } },
      include: { roles: true },
    });
    if (!user?.passwordHash || !(await argon2.verify(user.passwordHash, input.password)))
      throw new UnauthorizedException('Invalid credentials');
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        roles: user.roles.map((role) => role.role),
      },
      accessToken: await this.token(
        user.id,
        user.roles.map((role) => role.role),
      ),
    };
  }

  private token(subject: string, roles: PlatformRole[]) {
    return new SignJWT({ roles })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setSubject(subject)
      .setIssuedAt()
      .setExpirationTime(apiEnvironment.JWT_ACCESS_TTL)
      .setIssuer(apiEnvironment.JWT_ISSUER)
      .setAudience(apiEnvironment.JWT_AUDIENCE)
      .sign(secret());
  }
}
