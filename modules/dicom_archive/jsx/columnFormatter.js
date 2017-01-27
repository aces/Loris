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
  rowHeaders.forEach(function(header, index) {
    row[header] = rowData[index];
  }, this);

  if (column === 'Metadata') {
    var metadataURL = loris.BaseURL +
      "/dicom_archive/viewDetails/?tarchiveID=" + row.TarchiveID;
    return <td><a href={metadataURL}>{cell}</a></td>;
  }

  if (column === 'MRI Browser') {
    if (row.SessionID === null || row.SessionID === '') {
      return <td>&nbsp;</td>;
    }
    var mrlURL = loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" +
      row.SessionID;
    return <td><a href={mrlURL}>{cell}</a></td>;
  }

  if (cell === "INVALID - HIDDEN") {
    return <td className="text-danger">{cell}</td>;
  }

  return <td>{cell}</td>;
}

window.formatColumn = formatColumn;

export default formatColumn;
