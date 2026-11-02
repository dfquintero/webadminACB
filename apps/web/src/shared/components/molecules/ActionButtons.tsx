import { IconButton } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';

type Props = { onEdit?: () => void; onDelete?: () => void; onView?: () => void };

export const ActionButtons = ({ onEdit, onDelete, onView }: Props) => (
  <>
    {onView && <IconButton aria-label="Ver detalle" onClick={onView} color="info" size="small"><Visibility /></IconButton>}
    {onEdit && <IconButton aria-label="Editar" onClick={onEdit} color="primary" size="small"><Edit /></IconButton>}
    {onDelete && <IconButton aria-label="Eliminar" onClick={onDelete} color="error" size="small"><Delete /></IconButton>}
  </>
);
