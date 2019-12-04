import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import jiraHelper from '../jiraHelper'; 

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState({username: '', password: ''});
  const onFieldChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({
      ...userInfo,
      [key]: e.target.value
    })
  }

  jiraHelper.openDialLog = () => {
    setOpen(true);
  }

  const handleClose = () => {
    jiraHelper._authPromise && jiraHelper._authPromise(false);
    setOpen(false);
  };

  const submit = async () => {
    const data = await jiraHelper.authJiraUser(userInfo);
    if (data) {
      setOpen(false);
    } else {
      window.alert('auth error, check you login info or try again later.');
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Auth for Jira</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="username"
          value={userInfo.username}
          onChange={onFieldChange('username')}
          fullWidth
        />
        <TextField
          margin="dense"
          label="password"
          type="password"
          value={userInfo.password}
          onChange={onFieldChange('password')}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={submit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
