import 'reflect-metadata';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import { AppModule } from './app.module.js';
import { apiEnvironment } from './config.js';
import { CorrelationIdInterceptor } from './platform/correlation-id.interceptor.js';
import { HttpErrorFilter } from './platform/http-error.filter.js';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );
  await app.register(cookie);
  await app.register(cors, {
    origin: apiEnvironment.WEB_ORIGIN,
    credentials: true,
  });
  await app.register(rateLimit, { max: 120, timeWindow: '1 minute' });
  app.setGlobalPrefix('api/v1');
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ARENA GRID API')
    .setDescription('Tournament operations API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new CorrelationIdInterceptor());
  app.useGlobalFilters(new HttpErrorFilter());
  await app.listen(apiEnvironment.API_PORT, apiEnvironment.API_HOST);
}

void bootstrap();
