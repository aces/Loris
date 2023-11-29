/* global formatColumn */

import {createRoot} from 'react-dom/client';
import React from 'react';

document.addEventListener('DOMContentLoaded', () => {
  createRoot(
    document.getElementById('datatable')
  ).render(
    <DynamicDataTable
      DataURL={`${loris.BaseURL}/candidate_list/?format=json`}
      getFormattedCell={formatColumn}
      freezeColumn="PSCID"
    />
  );
});
