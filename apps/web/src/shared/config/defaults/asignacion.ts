import type { AsignacionFormData } from '../../api/types';

export const asignacionDefault: AsignacionFormData = {
  rutaId: '',
  guia1Id: '',
  guia2Id: '',
  fecha: new Date().toISOString().split('T')[0],
  estudiantesAsignados: [],
  estado: 'pendiente',
};
