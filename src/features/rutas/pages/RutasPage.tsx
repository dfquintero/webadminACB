import { PageLayout } from '@/shared/components/organisms/PageLayout';
import { RutaForm } from '../components/RutaForm';
import { useRutas } from '../hooks/useRutas';
import { useFormDialog } from '@/shared/hooks/useFormDialog';
import { useFilteredData } from '@/shared/hooks/useFilteredData';
import { rutasColumns } from '@/shared/config/columns/rutas';
import { CircularProgress } from '@mui/material';

export const RutasPage = () => {
  const { rutas, isLoading, create, update, remove } = useRutas();
  const { term, setTerm, filtered } = useFilteredData(rutas || [], ['nombre']);
  const { open, editingItem, handleOpen, handleClose } = useFormDialog();
  
  const submit = (data) => editingItem?.id ? update.mutate({ id: editingItem.id, data }) : create.mutate(data);
  
  if (isLoading) return <CircularProgress />;
  
  return (
    <>
      <PageLayout title="Rutas" data={filtered} columns={rutasColumns} searchTerm={term} onSearchChange={setTerm} onAdd={() => handleOpen()} onEdit={handleOpen} onDelete={remove.mutate} />
      <RutaForm open={open} onClose={handleClose} onSubmit={submit} initialData={editingItem} />
    </>
  );
}
