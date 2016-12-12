'use strict';

/* global formatColumn */

$(function () {
  loris.hiddenHeaders = ['HelpID', 'ParentID', 'ParentTopicID'];
  var table = React.createElement(DynamicDataTable, {
    DataURL: loris.BaseURL + '/help_editor/?format=json',
    getFormattedCell: formatColumn,
    freezeColumn: 'PSCID'
  });
  ReactDOM.render(table, document.getElementById("datatable"));
});
