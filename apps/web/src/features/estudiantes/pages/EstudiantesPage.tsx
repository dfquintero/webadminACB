'use client';

import { PageLayout } from '@/shared/components/organisms/PageLayout';
import { EstudianteForm } from '../components/EstudianteForm';
import { useEstudiantes } from '../hooks/useEstudiantes';
import { useFormDialog } from '@/shared/hooks/useFormDialog';
import { useFilteredData } from '@/shared/hooks/useFilteredData';
import { estudiantesColumns } from '@/shared/config/columns/estudiantes';
import type { Estudiante, EstudianteFormData } from '@/shared/api/types';

export const EstudiantesPage = () => {
  const { estudiantes, isLoading, error, create, update, remove } = useEstudiantes();
  const { term, setTerm, filtered } = useFilteredData(estudiantes ?? [], ['nombre', 'apellido', 'puntoRecogida']);
  const { open, editingItem, handleOpen, handleClose } = useFormDialog<Estudiante>();
  const submit = async (data: EstudianteFormData) => {
    if (editingItem) await update.mutateAsync({ id: editingItem.id, data });
    else await create.mutateAsync(data);
  };
  return <>
    <PageLayout<Estudiante> title="Estudiantes" data={filtered} columns={estudiantesColumns} searchTerm={term} onSearchChange={setTerm} onAdd={() => handleOpen()} onEdit={handleOpen} onDelete={remove.mutateAsync} isLoading={isLoading} error={error} />
    <EstudianteForm open={open} onClose={handleClose} onSubmit={submit} initialData={editingItem} />
  </>;
};
