import './app.scss';

import React, {
  ReactElement,
  useState,
} from 'react';

import Fab from '@material-ui/core/Fab';

import { initInfosProps } from '../interface';
import jiraHelper from '../jiraHelper';
import EditModal from './EditModal';
import InfoModal from './InfoModal';
import LoginModal from './LoginModal';

export default function App({ initInfos } : { initInfos: initInfosProps }) {
  const [open, setOpen] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [componentsList, setComponentsList] = useState([]);
  const [infoOpen, setInfoOpen] = useState(false);
  const [message, setMessage] = useState();


  const handleOpen = async () => {
    setButtonDisabled(true);
    const list = await jiraHelper.getComponents();
    if (list) {
      setComponentsList(list);
      setOpen(true);
    }
    setButtonDisabled(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const closeInfoModal = () => {
    setInfoOpen(false);
  }

  const openInfo = (message: string | ReactElement) => {
    setMessage(message);
    setInfoOpen(true);
  }

  return (
    <div className='levitate-box'>
      <Fab color="secondary" aria-label="add" onClick={handleOpen} disabled={buttonDisabled}>
        <span>Jira</span>
      </Fab>
      <EditModal initInfos={initInfos} onClose={handleClose} open={open} componentsList={componentsList} openInfo={openInfo}/>
      <LoginModal />
      <InfoModal open={infoOpen} onClose={closeInfoModal} message={message}/>
    </div>
  );
}
