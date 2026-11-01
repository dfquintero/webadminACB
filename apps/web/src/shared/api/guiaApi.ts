import { endpoints } from './endpoints';
import { createCrudApi } from './createCrudApi';
import { guiaResponse } from './types';
import { guiaSchema } from '../config/schemas/guia';

export const guiaApi = createCrudApi(endpoints.guias, guiaResponse, guiaSchema);
