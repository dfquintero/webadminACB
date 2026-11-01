import { Box } from '@mui/material';
import { TableHeader } from './TableHeader';
import { SearchInput } from '../molecules/SearchInput';
import { DataTable } from '../molecules/DataTable';

export const PageLayout = ({ title, data, columns, searchTerm, onSearchChange, onAdd, onEdit, onDelete }) => (
  <Box>
    <TableHeader title={title} onAdd={onAdd} />
    <SearchInput value={searchTerm} onChange={onSearchChange} />
    <DataTable data={data} columns={columns} onEdit={onEdit} onDelete={onDelete} />
  </Box>
);
