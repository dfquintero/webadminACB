import { apiClient } from './client';
import { endpoints } from './endpoints';

export const guiaApi = {
  getAll: () => apiClient.get(endpoints.guias),
  getById: (id: string) => apiClient.get(`${endpoints.guias}/${id}`),
  create: (data) => apiClient.post(endpoints.guias, data),
  update: (id: string, data) => apiClient.patch(`${endpoints.guias}/${id}`, data),
  delete: (id: string) => apiClient.delete(`${endpoints.guias}/${id}`),
};
