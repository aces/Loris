/* exported formatColumn */

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

  if (column === 'Metadata') {
    var metadataURL = loris.BaseURL + "/dicom_archive/viewDetails/?tarchiveID=" + row.TarchiveID;
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
    if (row.SessionID === null || row.SessionID === '') {
      return React.createElement(
        'td',
        null,
        '\xA0'
      );
    }
    var mrlURL = loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + row.SessionID;
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
      { className: 'text-danger' },
      cell
    );
  }

  return React.createElement(
    'td',
    null,
    cell
  );
}