import { PageLayout } from '@/shared/components/organisms/PageLayout';
import { EstudianteForm } from '../components/EstudianteForm';
import { useEstudiantes } from '../hooks/useEstudiantes';
import { useFormDialog } from '@/shared/hooks/useFormDialog';
import { useFilteredData } from '@/shared/hooks/useFilteredData';
import { estudiantesColumns } from '@/shared/config/columns/estudiantes';
import { CircularProgress } from '@mui/material';

export const EstudiantesPage = () => {
  const { estudiantes, isLoading, create, update, remove } = useEstudiantes();
  const { term, setTerm, filtered } = useFilteredData(estudiantes || [], ['nombre', 'apellido', 'puntoRecogida']);
  const { open, editingItem, handleOpen, handleClose } = useFormDialog();
  
  const submit = (data) => editingItem?.id ? update.mutate({ id: editingItem.id, data }) : create.mutate(data);
  
  if (isLoading) return <CircularProgress />;
  
  return (
    <>
      <PageLayout title="Estudiantes" data={filtered} columns={estudiantesColumns} searchTerm={term} onSearchChange={setTerm} onAdd={() => handleOpen()} onEdit={handleOpen} onDelete={remove.mutate} />
      <EstudianteForm open={open} onClose={handleClose} onSubmit={submit} initialData={editingItem} />
    </>
  );
}
