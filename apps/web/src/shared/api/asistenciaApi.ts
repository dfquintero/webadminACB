import { endpoints } from './endpoints';
import { createCrudApi } from './createCrudApi';
import { asistenciaResponse, asistenciaSchema } from './types';

export const asistenciaApi = createCrudApi(endpoints.asistencia, asistenciaResponse, asistenciaSchema);
