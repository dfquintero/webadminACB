import { PageLayout } from '@/shared/components/organisms/PageLayout';
import { AsignacionForm } from '../components/AsignacionForm';
import { useAsignaciones } from '../hooks/useAsignaciones';
import { useEstudiantes } from '@/features/estudiantes/hooks/useEstudiantes';
import { useGuias } from '@/features/guias/hooks/useGuias';
import { useRutas } from '@/features/rutas/hooks/useRutas';
import { useFormDialog } from '@/shared/hooks/useFormDialog';
import { useFilteredData } from '@/shared/hooks/useFilteredData';
import { asignacionesColumns } from '@/shared/config/columns/asignaciones';
import { CircularProgress } from '@mui/material';

export const AsignacionesPage = () => {
  const { asignaciones, isLoading, create, update, remove } = useAsignaciones();
  const { estudiantes } = useEstudiantes();
  const { guias } = useGuias();
  const { rutas } = useRutas();
  const { term, setTerm, filtered } = useFilteredData(asignaciones || [], []);
  const { open, editingItem, handleOpen, handleClose } = useFormDialog();
  
  const submit = (data) => editingItem?.id ? update.mutate({ id: editingItem.id, data }) : create.mutate(data);
  
  if (isLoading) return <CircularProgress />;
  
  return (
    <>
      <PageLayout title="Asignaciones" data={filtered} columns={asignacionesColumns} searchTerm={term} onSearchChange={setTerm} onAdd={() => handleOpen()} onEdit={handleOpen} onDelete={remove.mutate} />
      <AsignacionForm open={open} onClose={handleClose} onSubmit={submit} initialData={editingItem} rutas={rutas || []} guias={guias || []} estudiantes={estudiantes || []} />
    </>
  );
}
