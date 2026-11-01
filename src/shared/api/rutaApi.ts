import { apiClient } from './client';
import { endpoints } from './endpoints';

export const rutaApi = {
  getAll: () => apiClient.get(endpoints.rutas),
  getById: (id: string) => apiClient.get(`${endpoints.rutas}/${id}`),
  create: (data) => apiClient.post(endpoints.rutas, data),
  update: (id: string, data) => apiClient.patch(`${endpoints.rutas}/${id}`, data),
  delete: (id: string) => apiClient.delete(`${endpoints.rutas}/${id}`),
};
