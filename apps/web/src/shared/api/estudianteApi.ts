import { pagedSchema } from '@acb/contracts';
import { apiClient } from './client';
import { endpoints } from './endpoints';
import { estudianteResponse, type Estudiante, type EstudianteFormData } from './types';
import { FeatureUnavailableError } from '../hooks/useCapabilities';
import { estudianteSchema } from '../config/schemas/estudiante';

export const estudianteApi = {
  getAll: async (signal?: AbortSignal): Promise<Estudiante[]> => {
    const { data } = await apiClient.get<unknown>(endpoints.estudiantes, { params: { page: 0, size: 100 }, signal });
    return pagedSchema(estudianteResponse).parse(data).content;
  },
  getById: async (id: string): Promise<Estudiante> => {
    const { data } = await apiClient.get<unknown>(`${endpoints.estudiantes}/${encodeURIComponent(id)}`);
    return estudianteResponse.parse(data);
  },
  create: async (values: EstudianteFormData): Promise<void> => {
    const v = estudianteSchema.parse(values);
    await apiClient.post(endpoints.estudiantes, {
      user: { documentType: v.documentType, documentNumber: v.documentNumber, name: v.name, address: v.address || undefined, phone: v.phone || undefined },
      student: { grade: v.grade, schoolShift: v.schoolShift, section: v.section, schoolId: v.schoolId },
    });
  },
  update: async (id: string, values: EstudianteFormData): Promise<void> => {
    const v = estudianteSchema.parse(values);
    await apiClient.put(`${endpoints.estudiantes}/${encodeURIComponent(id)}`, {
      grade: v.grade, schoolShift: v.schoolShift, section: v.section, schoolId: v.schoolId,
    });
  },
  delete: async (): Promise<void> => {
    throw new FeatureUnavailableError();
  },
};
