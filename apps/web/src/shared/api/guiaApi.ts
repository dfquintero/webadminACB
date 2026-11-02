import { pagedSchema } from '@acb/contracts';
import { apiClient } from './client';
import { endpoints } from './endpoints';
import { guiaResponse, type Guia, type GuiaFormData } from './types';
import { guiaSchema } from '../config/schemas/guia';

export const guiaApi = {
  getAll: async (signal?: AbortSignal): Promise<Guia[]> => {
    const { data } = await apiClient.get<unknown>(endpoints.guias, { params: { page: 0, size: 100 }, signal });
    return pagedSchema(guiaResponse).parse(data).content;
  },
  getById: async (id: string): Promise<Guia> => {
    const { data } = await apiClient.get<unknown>(`${endpoints.guias}/${encodeURIComponent(id)}`);
    return guiaResponse.parse(data);
  },
  create: async (values: GuiaFormData): Promise<void> => {
    const v = guiaSchema.parse(values);
    await apiClient.post(endpoints.guias, {
      user: { documentType: v.documentType, documentNumber: v.documentNumber, name: v.name, address: v.address || undefined, phone: v.phone || undefined },
      guide: { contractNumber: v.contractNumber, email: v.email, zone: v.zone },
    });
  },
  update: async (id: string, values: GuiaFormData): Promise<void> => {
    const v = guiaSchema.parse(values);
    await apiClient.put(`${endpoints.guias}/${encodeURIComponent(id)}`, {
      name: v.name, address: v.address || undefined, phone: v.phone || undefined,
      contractNumber: v.contractNumber, email: v.email, zone: v.zone,
    });
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${endpoints.guias}/${encodeURIComponent(id)}`);
  },
};
