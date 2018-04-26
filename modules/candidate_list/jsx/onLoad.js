/* global formatColumn */
import React from 'react';
import ReactDOM from 'react-dom';
import AccessProfilePanel from './AccessProfilePanel';
import DynamicDataTable from 'jsx/DynamicDataTable';

document.addEventListener("DOMContentLoaded", evt => {
  if (!loris.userHasPermission('access_all_profiles')) {
    ReactDOM.render(
      <AccessProfilePanel />,
      document.getElementById("openprofile")
    );
  }

  ReactDOM.render(
    <DynamicDataTable
      DataURL={`${loris.BaseURL}/candidate_list/?format=json`}
      getFormattedCell={formatColumn}
      freezeColumn="PSCID"
    />,
    document.getElementById("datatable")
  );
});

