import { useState, type ReactNode } from 'react';
import { Alert, Box, CircularProgress } from '@mui/material';
import { TableHeader } from './TableHeader';
import { SearchInput } from '../molecules/SearchInput';
import { DataTable, type DataTableProps } from '../molecules/DataTable';
import { ConfirmDialog } from './ConfirmDialog';
import { FeatureUnavailableError } from '@/shared/hooks/useCapabilities';

type Props<T> = Omit<DataTableProps<T>, 'onDelete'> & {
  title: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAdd?: () => void;
  action?: { label: string; icon?: ReactNode; onClick: () => void };
  onDelete?: (id: string) => Promise<void>;
  isLoading?: boolean;
  error?: unknown;
};

export const PageLayout = <T extends { id: string },>({ title, data, columns, searchTerm, onSearchChange, onAdd, action, onEdit, onView, onDelete, isLoading, error }: Props<T>) => {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const confirmDelete = async () => {
    if (!onDelete || deleting === null || pending) return;
    setPending(true);
    setDeleteError(false);
    try { await onDelete(deleting); setDeleting(null); }
    catch { setDeleteError(true); }
    finally { setPending(false); }
  };
  return <Box>
    <TableHeader title={title} onAdd={error || isLoading ? undefined : onAdd} action={action} />
    {isLoading ? <CircularProgress aria-label="Cargando registros" /> : error ? <Alert severity={error instanceof FeatureUnavailableError ? 'info' : 'error'}>{error instanceof FeatureUnavailableError ? error.message : 'No se pudieron cargar los registros. Comprueba el BFF e inténtalo de nuevo.'}</Alert> : <>
      <SearchInput value={searchTerm} onChange={onSearchChange} />
      {deleteError && <Alert severity="error">No se pudo eliminar el registro. Inténtalo de nuevo.</Alert>}
      <DataTable data={data} columns={columns} onEdit={onEdit} onView={onView} onDelete={onDelete ? setDeleting : undefined} />
    </>}
    <ConfirmDialog open={deleting !== null} onClose={() => setDeleting(null)} onConfirm={confirmDelete} pending={pending} message="¿Eliminar este registro?" />
  </Box>;
};
