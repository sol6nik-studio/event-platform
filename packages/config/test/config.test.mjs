import assert from 'node:assert/strict';
import test from 'node:test';

import {
  EnvironmentConfigurationError,
  readApiEnvironment,
  readWorkerEnvironment,
} from '../dist/index.js';

test('development configuration has safe local defaults', () => {
  const environment = readApiEnvironment({ NODE_ENV: 'development' });

  assert.equal(environment.API_PORT, 4000);
  assert.equal(environment.COOKIE_SECURE, false);
});

test('production API configuration rejects placeholders', () => {
  assert.throws(
    () =>
      readApiEnvironment({
        NODE_ENV: 'production',
        DATABASE_URL: 'postgresql://CHANGE_ME@postgres:5432/arena_grid',
        JWT_SECRET: 'CHANGE_ME_GENERATE_AT_LEAST_32_RANDOM_BYTES',
        WEB_ORIGIN: 'https://arena-grid.example.com',
        COOKIE_SECURE: 'false',
      }),
    EnvironmentConfigurationError,
  );
});

test('production API configuration accepts explicit secure values', () => {
  const environment = readApiEnvironment({
    NODE_ENV: 'production',
    DATABASE_URL: 'postgresql://arena_grid:strong-password@postgres:5432/arena_grid',
    JWT_SECRET: '0123456789abcdef0123456789abcdef0123456789abcdef',
    WEB_ORIGIN: 'https://arena-grid.gg',
    COOKIE_SECURE: 'true',
  });

  assert.equal(environment.NODE_ENV, 'production');
  assert.equal(environment.COOKIE_SECURE, true);
});

test('production worker configuration rejects placeholder Redis URLs', () => {
  assert.throws(
    () => readWorkerEnvironment({ NODE_ENV: 'production', REDIS_URL: 'rediss://CHANGE_ME' }),
    EnvironmentConfigurationError,
  );
});
