import { endpoints } from './endpoints';
import { createCrudApi } from './createCrudApi';
import { asignacionResponse } from './types';
import { asignacionSchema } from '../config/schemas/asignacion';

export const asignacionApi = createCrudApi(endpoints.asignaciones, asignacionResponse, asignacionSchema);
