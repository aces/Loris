"use strict";

/* global formatColumn*/
$(document).ready(function () {
  ReactDOM.render(React.createElement(DynamicDataTable, {
    DataURL: loris.BaseURL + '/server_processes_manager/?format=json',
    getFormattedCell: formatColumn
  }), document.getElementById("datatable"));
});