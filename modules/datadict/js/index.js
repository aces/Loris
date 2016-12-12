"use strict";

$(function () {
  var table = React.createElement(DynamicDataTable, {
    DataURL: loris.BaseURL + "/datadict/?format=json",
    getFormattedCell: formatDataDictColumn
  });

  ReactDOM.render(table, document.getElementById("datatable"));
});
