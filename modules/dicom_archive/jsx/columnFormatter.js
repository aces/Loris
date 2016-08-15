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

  // If a column if set as hidden, don't display it
  if (loris.hiddenHeaders.indexOf(column) > -1) {
    return null;
  }

  if (column === 'Metadata') {
    var metadataURL = loris.BaseURL +
      "/dicom_archive/viewDetails/?tarchiveID=" +
      rowData[rowData.length - 2];
    return <td><a href={metadataURL}>{cell}</a></td>;
  }

  if (column === 'MRI Browser') {
    if (rowData[rowData.length - 1] === null ||
      rowData[rowData.length - 1] === '') {
      return <td>&nbsp;</td>;
    }
    var mrlURL = loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" +
      rowData[rowData.length - 1];
    return <td><a href={mrlURL}>{cell}</a></td>;
  }

  if (cell === "INVALID - HIDDEN") {
    return <td className="text-danger">{cell}</td>;
  }

  return <td>{cell}</td>;
}
