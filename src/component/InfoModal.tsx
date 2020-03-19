import React, { ReactElement } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog({open, onClose, message}:
  {open: boolean; onClose: () => any; message: string | ReactElement;}) {

  return (
    <Dialog open={open} aria-labelledby="form-dialog-title">
      <DialogTitle >Info</DialogTitle>
      <DialogContent>
        {message}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
