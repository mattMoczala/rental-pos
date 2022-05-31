import * as React from 'react';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';

export interface State extends SnackbarOrigin {
  open: boolean;
}
export interface Props {
  message: string;
  open: boolean;
}

export default function PositionedSnackbar(props: Props) {
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={props.open}
        // onClose={props.handleClose}
        message={props.message}
      />
    </div>
  );
}
