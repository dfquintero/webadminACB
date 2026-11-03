import { z } from 'zod';
import { guideDtoSchema, studentDtoSchema, type DocumentType } from '@acb/contracts';
import { apiClient } from './client';

const resultSchema = z.union([
  studentDtoSchema.extend({ grade: z.string() }).transform(dto => ({ kind: 'Estudiante' as const, dto })),
  guideDtoSchema.transform(dto => ({ kind: 'Guía' as const, dto })),
]);

export type SearchResult = z.infer<typeof resultSchema>;

export const searchApi = {
  byDocument: async (type: DocumentType, number: string): Promise<SearchResult> => {
    const { data } = await apiClient.get<unknown>('/search', { params: { type, number } });
    return resultSchema.parse(data);
  },
};
