import {createRoot} from 'react-dom/client';
import React from 'react';
import NewProfileForm from './NewProfileForm';

window.addEventListener('load', () => {
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <NewProfileForm
      dataURL = {`${loris.BaseURL}/new_profile/?format=json`}
      hasPermission = {loris.userHasPermission}
    />
  );
});
