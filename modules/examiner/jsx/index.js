/* global formatColumn */

$(function() {
  loris.hiddenHeaders = ['ID'];
  var table = <DynamicDataTable
     DataURL={`${loris.BaseURL}/examiner/?format=json`}
     getFormattedCell={formatColumn}
     freezeColumn="PSCID"
  />;

  ReactDOM.render(table, document.getElementById("datatable"));
});
