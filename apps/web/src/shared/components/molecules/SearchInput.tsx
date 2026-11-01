import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

export const SearchInput = ({ value, onChange, placeholder = 'Buscar...' }: { value: string; onChange: (value: string) => void; placeholder?: string }) => (
  <TextField fullWidth placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />
);
