/* global ReactDOM, formatColumn */
/* exported hideSwap */

$(document).ready(function() {
  $('table#swapcandidates th').click(_swapWrapper);
  $('table#addcandidate th').click(_addWrapper);
  // Hide the tab by default
  toggleTable('swapcandidates');
  toggleTable('addcandidate');

  ReactDOM.render(
    <DynamicDataTable
      DataURL={loris.BaseURL + '/reliability/?format=json'}
      getFormattedCell={formatColumn}
      freezeColumn="PSCID"
    />,
    document.getElementById("datatable")
  );
});

/**
 * Toggles display of the swap panel contents
 */
function hideSwap() {
  $("#swap-body").toggle();
  $("#swapDown").toggle();
  $("#swapUp").toggle();
}

function _swapWrapper() {
  return toggleTable('swapcandidates');
}

function _addWrapper() {
  return toggleTable('addcandidate');
}

function toggleTable(tableID) {
  if (tableID) {
    let table = $('table#' + tableID);
    let body = table.children('tbody');
    body.toggle();

    if (body.css("display") === 'none') {
      table.css("border", "none");
    } else {
      table.css("border", "2px solid #08245B");
    }
  }
}
