/* global formatColumn */
import React from 'react';
import ReactDOM from 'react-dom';
import AccessProfilePanel from './AccessProfilePanel';
import DynamicDataTable from 'jsx/DynamicDataTable';

document.addEventListener("DOMContentLoaded", evt => {
  const formatColumn = (column, cell, rowData) => {
    if (column === 'PSCID') {
      var url = loris.BaseURL + "/" + rowData[1] + "/";
      return <td><a href ={url}>{cell}</a></td>;
    }
    if (column === 'Feedback') {
      switch (cell) {
        case "1": return <td style ={{background: "#E4A09E"}}>opened</td>;
        case "2": return <td style ={{background: "#EEEEAA"}}>answered</td>;
        case "3": return <td style ={{background: "#99CC99"}}>closed</td>;
        case "4": return <td style ={{background: "#99CCFF"}}>comment</td>;
        default: return <td>None</td>;
      }
    }
    if (column === 'Scan Done' && cell === 'Y') {
      return (
        <td className="scanDoneLink">
          <a href="#"
            onClick={loris.loadFilteredMenuClickHandler('imaging_browser/',
            {pscid: rowData[2]})}
          >
            {cell}
          </a>
        </td>
      );
    }
    return <td>{cell}</td>;
  };

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

