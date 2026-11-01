import { endpoints } from './endpoints';
import { createCrudApi } from './createCrudApi';
import { estudianteResponse } from './types';
import { estudianteSchema } from '../config/schemas/estudiante';

export const estudianteApi = createCrudApi(endpoints.estudiantes, estudianteResponse, estudianteSchema);
