'use strict';

/* global ReactDOM, formatColumn */

$(document).ready(function () {
  var url = loris.BaseURL + '/issue_tracker/?format=json';
  var currentPage = QueryString.get();
  if (currentPage && currentPage.submenu) {
    url += '&submenu=' + currentPage.submenu;
  }

  ReactDOM.render(React.createElement(DynamicDataTable, {
    DataURL: url,
    getFormattedCell: formatColumn
  }), document.getElementById("datatable"));
});