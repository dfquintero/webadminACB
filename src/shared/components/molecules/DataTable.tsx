import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { ActionButtons } from './ActionButtons';

export const DataTable = ({ data = [], columns = [], onEdit, onDelete, emptyMessage = 'Sin datos' }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((col) => <TableCell key={String(col.key)}>{col.label}</TableCell>)}
          {(onEdit || onDelete) && <TableCell>Acciones</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.length === 0 ? (
          <TableRow><TableCell colSpan={columns.length + 1} align="center"><Box py={4}><Typography color="textSecondary">{emptyMessage}</Typography></Box></TableCell></TableRow>
        ) : data.map((row, i) => (
          <TableRow key={row.id ?? i} hover>
            {columns.map((col) => (
              <TableCell key={String(col.key)}>{col.render ? col.render(row[col.key], row) : row[col.key]}</TableCell>
            ))}
            {(onEdit || onDelete) && (
              <TableCell><ActionButtons onEdit={onEdit ? () => onEdit(row) : undefined} onDelete={onDelete ? () => onDelete(row.id) : undefined} /></TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
