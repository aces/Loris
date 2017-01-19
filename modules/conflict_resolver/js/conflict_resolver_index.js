'use strict';

/* global formatColumn */

$(function () {
  loris.hiddenHeaders = ['Value1', 'Value2', 'Hash'];

  var table = React.createElement(DynamicDataTable, {
    DataURL: loris.BaseURL + '/conflict_resolver/?format=json',
    getFormattedCell: formatColumn,
    freezeColumn: 'Instrument'
  });
  ReactDOM.render(table, document.getElementById("datatable"));
});
