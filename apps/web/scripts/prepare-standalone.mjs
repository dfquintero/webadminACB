import { cp } from 'node:fs/promises';

await Promise.all([
  cp(new URL('../public', import.meta.url), new URL('../.next/standalone/apps/web/public', import.meta.url), { recursive: true }),
  cp(new URL('../.next/static', import.meta.url), new URL('../.next/standalone/apps/web/.next/static', import.meta.url), { recursive: true }),
]);
