'use strict';

/* global React, formatColumn */

$(document).ready(function () {

  var url = loris.BaseURL + '/issue_tracker/?format=json';
  var currentPage = QueryString.get();
  if (currentPage && currentPage.submenu) {
    url += '&submenu=' + currentPage.submenu;
  }

  React.render(React.createElement(DynamicDataTable, {
    DataURL: url,
    getFormattedCell: formatColumn
  }), document.getElementById("datatable"));
});