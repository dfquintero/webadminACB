import { PageLayout } from '@/shared/components/organisms/PageLayout';
import { AlertaForm } from '../components/AlertaForm';
import { useAlertas } from '../hooks/useAlertas';
import { useEstudiantes } from '@/features/estudiantes/hooks/useEstudiantes';
import { useFormDialog } from '@/shared/hooks/useFormDialog';
import { useFilteredData } from '@/shared/hooks/useFilteredData';
import { alertasColumns } from '@/shared/config/columns/alertas';
import { CircularProgress } from '@mui/material';

export const AlertasPage = () => {
  const { alertas, isLoading, create, update } = useAlertas();
  const { estudiantes } = useEstudiantes();
  const { term, setTerm, filtered } = useFilteredData(alertas || [], []);
  const { open, editingItem, handleOpen, handleClose } = useFormDialog();
  
  const submit = (data) => editingItem?.id ? update.mutate({ id: editingItem.id, data }) : create.mutate(data);
  
  if (isLoading) return <CircularProgress />;
  
  return (
    <>
      <PageLayout title="Alertas" data={filtered} columns={alertasColumns} searchTerm={term} onSearchChange={setTerm} onAdd={() => handleOpen()} onEdit={handleOpen} onDelete={() => {}} />
      <AlertaForm open={open} onClose={handleClose} onSubmit={submit} estudiantes={estudiantes || []} />
    </>
  );
}
