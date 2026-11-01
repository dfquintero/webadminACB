import { PageLayout } from '@/shared/components/organisms/PageLayout';
import { GuiaForm } from '../components/GuiaForm';
import { useGuias } from '../hooks/useGuias';
import { useFormDialog } from '@/shared/hooks/useFormDialog';
import { useFilteredData } from '@/shared/hooks/useFilteredData';
import { guiasColumns } from '@/shared/config/columns/guias';
import { CircularProgress } from '@mui/material';

export const GuiasPage = () => {
  const { guias, isLoading, create, update, remove } = useGuias();
  const { term, setTerm, filtered } = useFilteredData(guias || [], ['nombre', 'apellido']);
  const { open, editingItem, handleOpen, handleClose } = useFormDialog();
  
  const submit = (data) => editingItem?.id ? update.mutate({ id: editingItem.id, data }) : create.mutate(data);
  
  if (isLoading) return <CircularProgress />;
  
  return (
    <>
      <PageLayout title="Guías" data={filtered} columns={guiasColumns} searchTerm={term} onSearchChange={setTerm} onAdd={() => handleOpen()} onEdit={handleOpen} onDelete={remove.mutate} />
      <GuiaForm open={open} onClose={handleClose} onSubmit={submit} initialData={editingItem} />
    </>
  );
}
