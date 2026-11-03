import { useState } from 'react';

export const useFormDialog = <T,>() => {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const handleOpen = (item: T | null = null) => {
    setEditingItem(item);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditingItem(null);
  };
  return { open, editingItem, handleOpen, handleClose };
};
