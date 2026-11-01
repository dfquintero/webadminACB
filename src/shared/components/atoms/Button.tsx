import { Button as MuiButton } from '@mui/material';

export const Button = ({ children, ...props }) => <MuiButton {...props}>{children}</MuiButton>;
