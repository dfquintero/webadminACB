import { apiClient } from './client';
import { endpoints } from './endpoints';

export const asignacionApi = {
  getAll: () => apiClient.get(endpoints.asignaciones),
  getById: (id: string) => apiClient.get(`${endpoints.asignaciones}/${id}`),
  create: (data) => apiClient.post(endpoints.asignaciones, data),
  update: (id: string, data) => apiClient.patch(`${endpoints.asignaciones}/${id}`, data),
  delete: (id: string) => apiClient.delete(`${endpoints.asignaciones}/${id}`),
};
