import { z } from 'zod';
import { apiClient } from './client';

export const createCrudApi = <T, Input>(endpoint: string, response: z.ZodType<T>, input: z.ZodType<Input>) => ({
  getAll: async (signal?: AbortSignal): Promise<T[]> => {
    const { data } = await apiClient.get<unknown>(endpoint, { signal });
    return z.array(response).parse(data);
  },
  getById: async (id: string): Promise<T> => {
    const { data } = await apiClient.get<unknown>(`${endpoint}/${encodeURIComponent(id)}`);
    return response.parse(data);
  },
  create: async (values: Input): Promise<void> => {
    await apiClient.post(endpoint, input.parse(values));
  },
  update: async (id: string, values: Input): Promise<void> => {
    await apiClient.patch(`${endpoint}/${encodeURIComponent(id)}`, input.parse(values));
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${endpoint}/${encodeURIComponent(id)}`);
  },
});
