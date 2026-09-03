import { Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';
import { AuthService } from './auth.service.js';
import { Public } from './public.decorator.js';

const credentials = z.object({ email: z.email(), password: z.string().min(10).max(128) });
const registration = credentials.extend({ username: z.string().regex(/^[a-zA-Z0-9_]{3,32}$/) });

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() body: unknown) {
    return this.auth.register(registration.parse(body));
  }

  @Public()
  @Post('login')
  login(@Body() body: unknown) {
    return this.auth.login(credentials.parse(body));
  }
}
