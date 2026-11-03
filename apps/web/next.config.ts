import type { NextConfig } from 'next';
import { fileURLToPath } from 'node:url';

export default (): NextConfig => ({
  output: 'standalone',
  outputFileTracingRoot: fileURLToPath(new URL('../..', import.meta.url)),
  transpilePackages: ['@acb/contracts'],
  poweredByHeader: false,
  experimental: { proxyClientMaxBodySize: '21mb' },
  async rewrites() {
    const target = process.env.BFF_INTERNAL_URL ?? 'http://127.0.0.1:3001';
    if (!URL.canParse(target)) throw new Error('Invalid BFF_INTERNAL_URL');
    const origin = new URL(target);
    if (!['http:', 'https:'].includes(origin.protocol) || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash) throw new Error('Invalid BFF_INTERNAL_URL');
    return [{ source: '/bff/:path*', destination: `${origin.origin}/bff/:path*` }];
  },
});
