'use client';

import { PageLayout } from '@/shared/components/organisms/PageLayout';
import { GuiaForm } from '../components/GuiaForm';
import { useGuias } from '../hooks/useGuias';
import { useFormDialog } from '@/shared/hooks/useFormDialog';
import { useFilteredData } from '@/shared/hooks/useFilteredData';
import { guiasColumns } from '@/shared/config/columns/guias';
import type { Guia, GuiaFormData } from '@/shared/api/types';

export const GuiasPage = () => {
  const { guias, isLoading, error, create, update, remove } = useGuias();
  const { term, setTerm, filtered } = useFilteredData(guias ?? [], ['name', 'documentNumber', 'contractNumber', 'zone']);
  const { open, editingItem, handleOpen, handleClose } = useFormDialog<Guia>();
  const submit = async (data: GuiaFormData) => {
    if (editingItem) await update.mutateAsync({ id: editingItem.id, data });
    else await create.mutateAsync(data);
  };
  return <>
    <PageLayout<Guia> title="Guías" data={filtered} columns={guiasColumns} searchTerm={term} onSearchChange={setTerm} onAdd={() => handleOpen()} onEdit={handleOpen} onDelete={remove.mutateAsync} isLoading={isLoading} error={error} />
    <GuiaForm open={open} onClose={handleClose} onSubmit={submit} initialData={editingItem} />
  </>;
};
