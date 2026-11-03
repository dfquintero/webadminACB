import { describe, expect, it } from 'vitest';
import { testConfig } from './fixtures.js';

describe('private BFF configuration', () => {
  it('rejects production over plain HTTP', () => {
    expect(() => testConfig({ NODE_ENV: 'production' })).toThrow('PUBLIC_ORIGIN');
  });

  it('does not expose environment values in validation errors', () => {
    expect(() => testConfig({ REDIS_URL: 'private-invalid-value' })).toThrow('REDIS_URL');
    expect(() => testConfig({ REDIS_URL: 'private-invalid-value' })).not.toThrow('private-invalid-value');
  });

  it('rejects a malformed encryption key and short signing secret', () => {
    expect(() => testConfig({ SESSION_ENCRYPTION_KEY: 'invalid' })).toThrow('SESSION_ENCRYPTION_KEY');
    expect(() => testConfig({ SESSION_SIGNING_SECRET: 'short' })).toThrow('SESSION_SIGNING_SECRET');
  });

  it('requires an explicit HTTP origin without credentials or paths', () => {
    expect(() => testConfig({ AUTH_BASE_URL: 'https://user:password@auth.test' })).toThrow('AUTH_BASE_URL');
    expect(() => testConfig({ PUBLIC_ORIGIN: 'https://dashboard.test/some-path' })).toThrow('PUBLIC_ORIGIN');
    expect(() => testConfig({ TRUSTED_PROXY: 'true' })).toThrow('TRUSTED_PROXY');
  });
});
