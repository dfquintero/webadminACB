import { useState } from 'react';

export const useFormDialog = () => {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleOpen = (item = null) => {
    setEditingItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingItem(null);
  };

  return {
    open,
    editingItem,
    handleOpen,
    handleClose,
  };
};
