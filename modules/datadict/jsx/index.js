/* global formatDataDictColumn */

$(function() {
  var table = <DynamicDataTable
    DataURL={`${loris.BaseURL}/datadict/?format=json`}
    getFormattedCell={formatDataDictColumn}
  />;

  ReactDOM.render(table, document.getElementById("datatable"));
});
