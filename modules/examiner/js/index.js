"use strict";

$(function () {
   loris.hiddenHeaders = ['ID'];
   var table = React.createElement(DynamicDataTable, {
      DataURL: loris.BaseURL + "/examiner/?format=json",
      getFormattedCell: formatColumn,
      freezeColumn: "PSCID"
   });

   ReactDOM.render(table, document.getElementById("datatable"));
});
