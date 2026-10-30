import {createRoot} from 'react-dom/client';
import React from 'react';
import NewProfileForm from './NewProfileForm';

window.addEventListener('load', () => {
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <NewProfileForm
      dataURL = {`${loris.BaseURL}/new_profile/?format=json`}
      submitURL = {`${loris.BaseURL}/api/v0.0.4-dev/candidates/`}
      hasPermission = {loris.userHasPermission}
    />
  );
});
