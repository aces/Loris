/* global formatColumn*/
$(document).ready(function() {
  ReactDOM.render(
    <DynamicDataTable
      DataURL={loris.BaseURL + '/server_processes_manager/?format=json'}
      getFormattedCell={formatColumn}
    />,
    document.getElementById("datatable")
  );
});
