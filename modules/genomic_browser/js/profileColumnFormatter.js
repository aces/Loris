"use strict";

/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {arrray} rowData - array of cell contents for a specific row
 * @param {arrray} rowHeaders - array of table headers (column names)
 * @return {*} a formated table cell for a given column
 */
function formatColumn(column, cell, rowData, rowHeaders) {
  // If a column if set as hidden, don't display it
  if (loris.hiddenHeaders.indexOf(column) > -1) {
    return null;
  }

  // Create the mapping between rowHeaders and rowData in a row object.
  var row = {};
  rowHeaders.forEach(function (header, index) {
    row[header] = rowData[index];
  }, this);

  var reactElement = null;
  switch (column) {
    case 'PSCID':
      var url = loris.BaseURL + "/" + rowData[1] + "/";
      reactElement = React.createElement(
        "td",
        null,
        React.createElement(
          "a",
          { href: url },
          cell
        )
      );
      break;
    case 'Subproject':
      reactElement = React.createElement(
        "td",
        null,
        loris.subprojectList[cell]
      );
      break;
    case 'File':
      if (cell === 'Y') {
        reactElement = React.createElement(
          "td",
          null,
          React.createElement(
            "a",
            { href: "#", onClick: loris.loadFilteredMenuClickHandler('genomic_browser&submenu=viewGenomicFile', { 'candID': rowData[1] }) },
            cell
          )
        );
      } else {
        reactElement = React.createElement(
          "td",
          null,
          cell
        );
      }
      break;
    case 'CNV':
    case 'CPG':
    case 'SNP':
      if (cell === 'Y') {
        reactElement = React.createElement(
          "td",
          null,
          React.createElement(
            "a",
            { href: "#", onClick: loris.loadFilteredMenuClickHandler('genomic_browser&submenu=' + column.toLowerCase() + '_browser', { 'candID': rowData[1] }) },
            cell
          )
        );
      } else {
        reactElement = React.createElement(
          "td",
          null,
          cell
        );
      }
      break;
    default:
      reactElement = React.createElement(
        "td",
        null,
        cell
      );
  }
  return reactElement;
}

window.formatColumn = formatColumn;