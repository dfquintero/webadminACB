import { apiClient } from './client';
import { endpoints } from './endpoints';

export const asistenciaApi = {
  getAll: () => apiClient.get(endpoints.asistencia),
  getById: (id: string) => apiClient.get(`${endpoints.asistencia}/${id}`),
  create: (data) => apiClient.post(endpoints.asistencia, data),
  update: (id: string, data) => apiClient.patch(`${endpoints.asistencia}/${id}`, data),
  delete: (id: string) => apiClient.delete(`${endpoints.asistencia}/${id}`),
};
