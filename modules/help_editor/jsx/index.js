/* global formatColumn */

$(function() {
  loris.hiddenHeaders = ['HelpID', 'ParentID', 'ParentTopicID'];
  var table = <DynamicDataTable
    DataURL={`${loris.BaseURL}/help_editor/?format=json`}
    getFormattedCell={formatColumn}
    freezeColumn="PSCID"
  />;
  ReactDOM.render(table, document.getElementById("datatable"));
});
