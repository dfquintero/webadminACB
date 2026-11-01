import type { ReactNode } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { ActionButtons } from './ActionButtons';

export type Column<T> = { key: string; label: string; render?: (value: unknown, row: T) => ReactNode };
export type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (id: string) => void;
  emptyMessage?: string;
};

export const DataTable = <T extends { id: string },>({ data, columns, onEdit, onDelete, emptyMessage = 'Sin datos' }: DataTableProps<T>) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead><TableRow>
        {columns.map(col => <TableCell key={col.key}>{col.label}</TableCell>)}
        {(onEdit || onDelete) && <TableCell>Acciones</TableCell>}
      </TableRow></TableHead>
      <TableBody>
        {data.length === 0 ? <TableRow><TableCell colSpan={columns.length + Number(!!(onEdit || onDelete))} align="center">
          <Box sx={{ py: 4 }}><Typography color="text.secondary">{emptyMessage}</Typography></Box>
        </TableCell></TableRow> : data.map(row => <TableRow key={row.id} hover>
          {columns.map(col => {
            const value = row[col.key as keyof T];
            return <TableCell key={col.key}>{col.render ? col.render(value, row) : String(value ?? '—')}</TableCell>;
          })}
          {(onEdit || onDelete) && <TableCell><ActionButtons onEdit={onEdit ? () => onEdit(row) : undefined} onDelete={onDelete ? () => onDelete(row.id) : undefined} /></TableCell>}
        </TableRow>)}
      </TableBody>
    </Table>
  </TableContainer>
);
