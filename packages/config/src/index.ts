import { z } from 'zod';

const environmentName = z.enum(['development', 'test', 'production']).default('development');
const logLevel = z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info');
const port = z.coerce.number().int().min(1).max(65_535);
const booleanString = z.enum(['true', 'false']).transform((value) => value === 'true');

const apiEnvironmentSchema = z.object({
  NODE_ENV: environmentName,
  LOG_LEVEL: logLevel,
  API_HOST: z.string().min(1).default('0.0.0.0'),
  API_PORT: port.default(4_000),
  WEB_ORIGIN: z.url().default('http://localhost:3000'),
  DATABASE_URL: z
    .url()
    .default(
      'postgresql://arena_grid:arena_grid_local_only@localhost:5432/arena_grid?schema=public',
    ),
  JWT_ISSUER: z.string().min(1).default('arena-grid-api'),
  JWT_AUDIENCE: z.string().min(1).default('arena-grid-web'),
  JWT_ACCESS_TTL: z
    .string()
    .regex(/^\d+[smhd]$/u)
    .default('10m'),
  JWT_SECRET: z.string().min(32).default('local_only_do_not_use_in_production'),
  COOKIE_SECURE: booleanString.default(false),
});

const workerEnvironmentSchema = z.object({
  NODE_ENV: environmentName,
  LOG_LEVEL: logLevel,
  REDIS_URL: z.url().default('redis://localhost:6379'),
});

export type ApiEnvironment = z.output<typeof apiEnvironmentSchema>;
export type WorkerEnvironment = z.output<typeof workerEnvironmentSchema>;

export class EnvironmentConfigurationError extends Error {
  constructor(issues: string[]) {
    super(`Invalid environment configuration:\n- ${issues.join('\n- ')}`);
    this.name = 'EnvironmentConfigurationError';
  }
}

function parseEnvironment<T>(schema: z.ZodType<T>, source: NodeJS.ProcessEnv): T {
  const result = schema.safeParse(source);
  if (result.success) return result.data;

  throw new EnvironmentConfigurationError(
    result.error.issues.map(
      (issue) => `${issue.path.join('.') || 'environment'}: ${issue.message}`,
    ),
  );
}

function containsUnsafeMarker(value: string): boolean {
  const normalized = value.toLowerCase();
  return ['change_me', 'changeme', 'replace_me', 'dev-only', 'local_only'].some((marker) =>
    normalized.includes(marker),
  );
}

function isPlaceholderOrigin(value: string): boolean {
  const hostname = new URL(value).hostname.toLowerCase();
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname === 'example.com' ||
    hostname.endsWith('.example.com')
  );
}

function validateProductionApiEnvironment(
  environment: ApiEnvironment,
  source: NodeJS.ProcessEnv,
): void {
  if (environment.NODE_ENV !== 'production') return;

  const issues: string[] = [];
  for (const name of ['DATABASE_URL', 'JWT_SECRET', 'WEB_ORIGIN'] as const) {
    if (!source[name]) issues.push(`${name} must be explicitly set in production`);
  }
  if (containsUnsafeMarker(environment.DATABASE_URL)) {
    issues.push('DATABASE_URL still contains a placeholder or development credential');
  }
  if (containsUnsafeMarker(environment.JWT_SECRET)) {
    issues.push('JWT_SECRET still contains a placeholder or development credential');
  }
  if (isPlaceholderOrigin(environment.WEB_ORIGIN)) {
    issues.push('WEB_ORIGIN must be the deployed HTTPS origin, not localhost or example.com');
  }
  if (!environment.WEB_ORIGIN.startsWith('https://')) {
    issues.push('WEB_ORIGIN must use HTTPS in production');
  }
  if (!environment.COOKIE_SECURE) {
    issues.push('COOKIE_SECURE must be true in production');
  }

  if (issues.length > 0) throw new EnvironmentConfigurationError(issues);
}

function validateProductionWorkerEnvironment(environment: WorkerEnvironment): void {
  if (environment.NODE_ENV !== 'production') return;

  if (containsUnsafeMarker(environment.REDIS_URL)) {
    throw new EnvironmentConfigurationError([
      'REDIS_URL still contains a placeholder or development credential',
    ]);
  }
}

export function readApiEnvironment(source: NodeJS.ProcessEnv = process.env): ApiEnvironment {
  const environment = parseEnvironment(apiEnvironmentSchema, source);
  validateProductionApiEnvironment(environment, source);
  return environment;
}

export function readWorkerEnvironment(source: NodeJS.ProcessEnv = process.env): WorkerEnvironment {
  const environment = parseEnvironment(workerEnvironmentSchema, source);
  validateProductionWorkerEnvironment(environment);
  return environment;
}
