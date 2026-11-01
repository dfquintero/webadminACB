import { endpoints } from './endpoints';
import { createCrudApi } from './createCrudApi';
import { alertaResponse } from './types';
import { alertaSchema } from '../config/schemas/alerta';

export const alertaApi = createCrudApi(endpoints.alertas, alertaResponse, alertaSchema);
