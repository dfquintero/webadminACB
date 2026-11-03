import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: { main: '#1f4fd1', dark: '#163a9e', light: '#e6ecfb' },
    secondary: { main: '#006f7a' },
    success: { main: '#1a7536' },
    warning: { main: '#8f4c00' },
    error: { main: '#c0161b' },
    background: { default: '#f1f3f6', paper: '#ffffff' },
    text: { primary: '#10151c', secondary: '#46505e' },
    divider: '#d3d9e0',
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Atkinson Hyperlegible", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    h4: { fontSize: '2rem', fontWeight: 700 },
    h5: { fontSize: '1.5rem', fontWeight: 700 },
    h6: { fontSize: '1.125rem', fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { minHeight: 44 } } },
    MuiCard: { defaultProps: { variant: 'outlined' }, styleOverrides: { root: { boxShadow: 'none' } } },
    MuiTableContainer: { styleOverrides: { root: { boxShadow: 'none', border: '1px solid #d3d9e0', borderRadius: 8 } } },
    MuiTableCell: { styleOverrides: { head: { backgroundColor: '#f1f3f6', fontWeight: 700, color: '#46505e' } } },
    MuiOutlinedInput: { styleOverrides: { root: { backgroundColor: '#fff' } } },
    MuiCssBaseline: { styleOverrides: { ':focus-visible': { outline: '3px solid #163a9e', outlineOffset: 2 } } },
  },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </MuiThemeProvider>
);
