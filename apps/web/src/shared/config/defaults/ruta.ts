import type { RutaFormData } from '../../api/types';

export const rutaDefault: RutaFormData = {
  nombre: '',
  distancia: 0,
  tiempoEstimado: 0,
  horarioInicio: '06:00',
  horarioFin: '07:00',
  puntosParada: [],
  estado: 'activo',
};
