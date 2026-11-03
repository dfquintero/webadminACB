import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { apiClient } from './client';
import { createCrudApi } from './createCrudApi';

vi.mock('./client', () => ({ apiClient: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() } }));
const input = z.object({ nombre: z.string().min(1) });
const response = input.extend({ id: z.string() });
const api = createCrudApi('/items', response, input);

beforeEach(() => vi.resetAllMocks());

describe('createCrudApi', () => {
  it('returns validated data instead of the Axios envelope and propagates cancellation', async () => {
    const items = [{ id: '1', nombre: 'Ruta de prueba' }];
    vi.mocked(apiClient.get).mockResolvedValue({ data: items });
    const signal = new AbortController().signal;
    expect(await api.getAll(signal)).toEqual(items);
    expect(apiClient.get).toHaveBeenCalledWith('/items', { signal });
  });

  it('rejects malformed responses instead of treating them as empty lists', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [{ nombre: 'Sin ID' }] });
    await expect(api.getAll()).rejects.toBeInstanceOf(z.ZodError);
  });

  it('propagates transport failures', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Offline'));
    await expect(api.getAll()).rejects.toThrow('Offline');
  });

  it('allows a successful mutation with no response body', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ status: 204 });
    await expect(api.create({ nombre: 'Ruta' })).resolves.toBeUndefined();
    expect(apiClient.post).toHaveBeenCalledOnce();
  });

  it('validates outgoing values before writing', async () => {
    await expect(api.create({ nombre: '' })).rejects.toBeInstanceOf(z.ZodError);
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it('encodes identifiers when building resource paths', async () => {
    await api.delete('a/b');
    expect(apiClient.delete).toHaveBeenCalledWith('/items/a%2Fb');
  });
});
