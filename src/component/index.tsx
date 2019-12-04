import React from 'react';
import { render } from 'react-dom';
import App from './App';


export default (infos: any) => {
  const app = document.createElement('div');
  app.id = "my-extension-root";
  document.body.appendChild(app);
  
  render(
    <App initInfos={infos}/>,
    app,
  );
}

