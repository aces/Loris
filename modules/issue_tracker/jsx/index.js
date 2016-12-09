/* global React, formatColumn */

$(document).ready(function() {

  let url = loris.BaseURL + '/issue_tracker/?format=json';
  const currentPage = QueryString.get();
  if (currentPage && currentPage.submenu) {
    url += '&submenu=' + currentPage.submenu;
  }

  React.render(
    <DynamicDataTable
      DataURL={url}
      getFormattedCell={formatColumn}
    />,
    document.getElementById("datatable")
  );

});
