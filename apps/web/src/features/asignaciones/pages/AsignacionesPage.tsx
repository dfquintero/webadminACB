'use client';

import { PageLayout } from '@/shared/components/organisms/PageLayout';
import { AsignacionForm } from '../components/AsignacionForm';
import { useAsignaciones } from '../hooks/useAsignaciones';
import { useEstudiantes } from '@/features/estudiantes/hooks/useEstudiantes';
import { useGuias } from '@/features/guias/hooks/useGuias';
import { useRutas } from '@/features/rutas/hooks/useRutas';
import { useFormDialog } from '@/shared/hooks/useFormDialog';
import { useFilteredData } from '@/shared/hooks/useFilteredData';
import { asignacionesColumns } from '@/shared/config/columns/asignaciones';
import type { Asignacion, AsignacionFormData } from '@/shared/api/types';

export const AsignacionesPage = () => {
  const query = useAsignaciones();
  const estudiantes = useEstudiantes();
  const guias = useGuias();
  const rutas = useRutas();
  const queries = [query, estudiantes, guias, rutas];
  const { term, setTerm, filtered } = useFilteredData(query.asignaciones ?? [], ['rutaId', 'fecha', 'estado']);
  const { open, editingItem, handleOpen, handleClose } = useFormDialog<Asignacion>();
  const submit = async (data: AsignacionFormData) => {
    if (editingItem) await query.update.mutateAsync({ id: editingItem.id, data });
    else await query.create.mutateAsync(data);
  };
  return <>
    <PageLayout<Asignacion> title="Asignaciones" data={filtered} columns={asignacionesColumns} searchTerm={term} onSearchChange={setTerm} onAdd={() => handleOpen()} onEdit={handleOpen} onDelete={query.remove.mutateAsync}
      isLoading={queries.some(item => item.isLoading)} error={queries.find(item => item.error)?.error} />
    <AsignacionForm open={open} onClose={handleClose} onSubmit={submit} initialData={editingItem} rutas={rutas.rutas ?? []} guias={guias.guias ?? []} estudiantes={estudiantes.estudiantes ?? []} />
  </>;
};
