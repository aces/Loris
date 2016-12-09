'use strict';

loris.hiddenHeaders = ['New Value', 'OldValue2', 'CenterID'];

$(function () {
  var table = React.createElement(DynamicDataTable, {
    DataURL: loris.BaseURL + '/conflict_resolver/?submenu=resolved_conflicts&format=json',
    getFormattedCell: formatColumn,
    freezeColumn: 'Instrument'
  });
  ReactDOM.render(table, document.getElementById("datatable"));
});
