import { Redis } from 'ioredis';
import { readConfig } from './config.js';
import { buildApp } from './app.js';
import { createSessionStore } from './plugins/session-store.js';
import { createAuthClient } from './upstreams/auth.js';

const start = async () => {
  const config = readConfig(process.env);
  const redis = new Redis(config.REDIS_URL, { lazyConnect: true, enableOfflineQueue: false, maxRetriesPerRequest: 1, connectTimeout: 5000, retryStrategy: attempt => attempt <= 3 ? 1000 : null });
  redis.on('error', () => {});
  try {
    await redis.connect();
    const app = await buildApp(config, {
      store: createSessionStore(redis, config.SESSION_ENCRYPTION_KEY), authenticate: createAuthClient(config), redis,
      ready: async () => (await redis.ping()) === 'PONG',
      close: async () => { redis.disconnect(); },
    });
    const stop = () => { void app.close().catch(() => { process.exitCode = 1; }); };
    process.once('SIGTERM', stop);
    process.once('SIGINT', stop);
    await app.listen({ host: config.HOST, port: config.PORT });
  } catch (error) {
    redis.disconnect();
    throw error;
  }
};

void start().catch(() => {
  console.error('BFF startup failed. Verify private configuration and infrastructure.');
  process.exitCode = 1;
});
