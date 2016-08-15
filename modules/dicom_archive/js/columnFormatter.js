'use strict';

/* exported formatColumn */

/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {arrray} rowData - array of cell contents for a specific row
 * @param {arrray} rowHeaders - array of table headers (column names)
 * @return {*} a formated table cell for a given column
 */
function formatColumn(column, cell, rowData) {
  if (column === 'Metadata') {
    var metadataURL = loris.BaseURL + "/dicom_archive/viewDetails/?tarchiveID=" + rowData[rowData.length - 2];
    return React.createElement(
      'td',
      null,
      React.createElement(
        'a',
        { href: metadataURL },
        cell
      )
    );
  }
  if (column === 'MRI Browser') {
    if (rowData[rowData.length - 1] === null || rowData[rowData.length - 1] === '') {
      return React.createElement(
        'td',
        null,
        ' '
      );
    }
    var mrlURL = loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + rowData[rowData.length - 1];
    return React.createElement(
      'td',
      null,
      React.createElement(
        'a',
        { href: mrlURL },
        cell
      )
    );
  }
  if (cell === "INVALID - HIDDEN") {
    return React.createElement(
      'td',
      { className: 'error' },
      cell
    );
  }
  return React.createElement(
    'td',
    null,
    cell
  );
}