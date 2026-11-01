import { endpoints } from './endpoints';
import { createCrudApi } from './createCrudApi';
import { rutaResponse } from './types';
import { rutaSchema } from '../config/schemas/ruta';

export const rutaApi = createCrudApi(endpoints.rutas, rutaResponse, rutaSchema);
