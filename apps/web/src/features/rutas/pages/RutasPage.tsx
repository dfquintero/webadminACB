'use client';

import { PageLayout } from '@/shared/components/organisms/PageLayout';
import { RutaForm } from '../components/RutaForm';
import { useRutas } from '../hooks/useRutas';
import { useFormDialog } from '@/shared/hooks/useFormDialog';
import { useFilteredData } from '@/shared/hooks/useFilteredData';
import { rutasColumns } from '@/shared/config/columns/rutas';
import type { Ruta, RutaFormData } from '@/shared/api/types';

export const RutasPage = () => {
  const { rutas, isLoading, error, create, update, remove } = useRutas();
  const { term, setTerm, filtered } = useFilteredData(rutas ?? [], ['nombre']);
  const { open, editingItem, handleOpen, handleClose } = useFormDialog<Ruta>();
  const submit = async (data: RutaFormData) => {
    if (editingItem) await update.mutateAsync({ id: editingItem.id, data });
    else await create.mutateAsync(data);
  };
  return <>
    <PageLayout<Ruta> title="Rutas" data={filtered} columns={rutasColumns} searchTerm={term} onSearchChange={setTerm} onAdd={() => handleOpen()} onEdit={handleOpen} onDelete={remove.mutateAsync} isLoading={isLoading} error={error} />
    <RutaForm open={open} onClose={handleClose} onSubmit={submit} initialData={editingItem} />
  </>;
};
