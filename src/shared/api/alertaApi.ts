import { apiClient } from './client';
import { endpoints } from './endpoints';

export const alertaApi = {
  getAll: () => apiClient.get(endpoints.alertas),
  getById: (id: string) => apiClient.get(`${endpoints.alertas}/${id}`),
  create: (data) => apiClient.post(endpoints.alertas, data),
  update: (id: string, data) => apiClient.patch(`${endpoints.alertas}/${id}`, data),
  delete: (id: string) => apiClient.delete(`${endpoints.alertas}/${id}`),
};
