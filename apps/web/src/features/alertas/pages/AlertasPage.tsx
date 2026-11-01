'use client';

import { PageLayout } from '@/shared/components/organisms/PageLayout';
import { AlertaForm } from '../components/AlertaForm';
import { useAlertas } from '../hooks/useAlertas';
import { useEstudiantes } from '@/features/estudiantes/hooks/useEstudiantes';
import { useFormDialog } from '@/shared/hooks/useFormDialog';
import { useFilteredData } from '@/shared/hooks/useFilteredData';
import { alertasColumns } from '@/shared/config/columns/alertas';
import type { AlertaFormData } from '@/shared/api/types';

export const AlertasPage = () => {
  const query = useAlertas();
  const estudiantes = useEstudiantes();
  const { term, setTerm, filtered } = useFilteredData(query.alertas ?? [], ['mensaje', 'tipo', 'canal', 'estado']);
  const { open, handleOpen, handleClose } = useFormDialog();
  const submit = async (data: AlertaFormData) => { await query.create.mutateAsync(data); };
  return <>
    <PageLayout title="Alertas" data={filtered} columns={alertasColumns} searchTerm={term} onSearchChange={setTerm} onAdd={() => handleOpen()}
      isLoading={query.isLoading || estudiantes.isLoading} error={query.error ?? estudiantes.error} />
    <AlertaForm open={open} onClose={handleClose} onSubmit={submit} estudiantes={estudiantes.estudiantes ?? []} />
  </>;
};
