import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import formatMessage from 'format-message';
import Link from '@material-ui/core/Link';
import copy from 'copy-to-clipboard'

import { ModalProps } from '../interface';
import jiraHelper from '../jiraHelper';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 6.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const InfoContent = ({ ticketId }: {ticketId: string}) => {
  const [open, setOpen] = React.useState(true);
  const link = `https://jira.ringcentral.com/browse/${ticketId}`;
  return <div className="info-content-box">
    <p>
      <span>Create Succeed!</span>
      <Link  target="_blank" href={link}>{link}</Link>
    </p>
    <Button
      onClick={() => {
        copy(link);
        setOpen(false);
      }}
      size="small" >
        {open ? "Copy Link" : "Copy succeed!"}
    </Button>
  </div>
}

export default function EditModal({open, onClose, initInfos, componentsList, openInfo}: ModalProps){
  const [infos, setInfo] = useState({...initInfos, components: []});
  const [createDisabled, setCreateDisabled] = useState(false);
  const onFieldChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo({
      ...infos,
      [key]: e.target.value
    })
  }

  const onComponentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const components = e.target.value;
    setInfo({...infos, components, subject: formatMessage(
      infos.subject,
      {project: components.map(d => d.name).join(', ')}
    )});
  }

  const onCreate = async () => {
    console.log(infos);
    setCreateDisabled(true);
    const issue = jiraHelper.getIssue(infos);
    // console.log(issue, JSON.stringify(issue));
    const res = await jiraHelper.createJiraIssue(issue);
    if (res && res.error) {
      window.alert('Create error. try again later.');
    } else {
      onClose();
      openInfo(<InfoContent ticketId={res.key} />);
    }
    setCreateDisabled(false);
  }

  return (
    <div className="edit-modal-box" style={{display: open ? '' : 'none'}}>
      <h2>Create corresponding Jira ticket</h2>
      <Divider />
      <Grid container spacing={3}>
        <Grid item xs={9}>
          <FormControl fullWidth>
            <InputLabel id="demo-mutiple-checkbox-label">Component/s</InputLabel>
            <Select
              fullWidth
              labelId="demo-mutiple-checkbox-label"
              value={infos.components}
              onChange={onComponentsChange}
              multiple
              input={<Input />}
              MenuProps={MenuProps}
              renderValue={selected => selected.map(d => d.name).join(', ')}
            >
              {componentsList.map((item) => (
                <MenuItem key={item.id} value={item}>
                  <Checkbox checked={!!infos.components.find(d => d.id === item.id)}/>
                  <ListItemText primary={item.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Summary"
            style={{ margin: 8 }}
            placeholder="Required"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            value={infos.subject}
            onChange={onFieldChange('subject')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            style={{ margin: 8 }}
            placeholder="Required"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            multiline
            rowsMax="12"
            value={infos.description}
            onChange={onFieldChange('description')}
          />
        </Grid>
        <Grid
          item
          container
          direction="row"
          justify="space-between"
          alignItems="center" >
          <Button variant="contained" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={onCreate} disabled={createDisabled}>
            Create
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
