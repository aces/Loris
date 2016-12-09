"use strict";

/* global formatColumn*/
$(document).ready(function () {
  ReactDOM.render(React.createElement(DynamicDataTable, {
    DataURL: loris.BaseURL + '/survey_accounts/?format=json',
    getFormattedCell: formatColumn,
    freezeColumn: "PSCID"
  }), document.getElementById("datatable"));
});