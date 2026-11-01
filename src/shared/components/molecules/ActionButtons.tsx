import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export const ActionButtons = ({ onEdit, onDelete }) => (
  <>
    <IconButton onClick={onEdit} color="primary" size="small"><Edit /></IconButton>
    <IconButton onClick={onDelete} color="error" size="small"><Delete /></IconButton>
  </>
);
