import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

type Props = { onEdit?: () => void; onDelete?: () => void };

export const ActionButtons = ({ onEdit, onDelete }: Props) => (
  <>
    {onEdit && <IconButton aria-label="Editar" onClick={onEdit} color="primary" size="small"><Edit /></IconButton>}
    {onDelete && <IconButton aria-label="Eliminar" onClick={onDelete} color="error" size="small"><Delete /></IconButton>}
  </>
);
