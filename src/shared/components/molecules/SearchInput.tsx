import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

export const SearchInput = ({ value, onChange, placeholder = 'Buscar...' }) => (
  <TextField fullWidth placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />
);
