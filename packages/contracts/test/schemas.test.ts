import { describe, expect, it } from 'vitest';
import { loginInputSchema, sessionResponseSchema } from '../src/index.js';

describe('BFF public contracts', () => {
  it('accepts username rather than the legacy email contract', () => {
    expect(loginInputSchema.safeParse({ username: 'manager', password: 'password' }).success).toBe(true);
    expect(loginInputSchema.safeParse({ email: 'manager@example.test', password: 'password' }).success).toBe(false);
  });

  it('strips tokens and normalizes the public identity', () => {
    const result = sessionResponseSchema.parse({
      user: { id: 1, name: 'Test Manager', role: 'MANAGER', zone: null },
      expiresAt: new Date().toISOString(), token: 'must-not-be-returned',
    });
    expect(result.user.id).toBe('1');
    expect(result).not.toHaveProperty('token');
  });

  it('rejects other roles', () => {
    expect(sessionResponseSchema.safeParse({ user: { id: 1, name: 'Test Guide', role: 'GUIDE', zone: null }, expiresAt: new Date().toISOString() }).success).toBe(false);
  });
});
