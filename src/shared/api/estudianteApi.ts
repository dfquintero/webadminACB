import { apiClient } from './client';
import { endpoints } from './endpoints';

export const estudianteApi = {
  getAll: () => apiClient.get(endpoints.estudiantes),
  getById: (id: string) => apiClient.get(`${endpoints.estudiantes}/${id}`),
  create: (data) => apiClient.post(endpoints.estudiantes, data),
  update: (id: string, data) => apiClient.patch(`${endpoints.estudiantes}/${id}`, data),
  delete: (id: string) => apiClient.delete(`${endpoints.estudiantes}/${id}`),
};
