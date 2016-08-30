/* global hasWritePermission */
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

  if (column === 'PSCID') {
    if (row["Manual Swap"] === "yes") {
      return <td>{cell} <span className="error">manual</span> </td>;
    }
    if (row["Invalid"] === 'yes') {
      var url = loris.BaseURL + "/aosi_reliability?identifier=" +
       row['Visit Label'] + "&reliability_center_id=" +
       row['Reliability Center Id'];
      return <td>{cell} <span className="error">invalid</span> </td>;}
    var url = loris.BaseURL + "/aosi_reliability?identifier=" +
       row['Visit Label'] + "&reliability_center_id=" +
       row['Reliability Center Id'];
    return <td><a href={url}>{cell}</a></td>;
  }

  return <td>{cell}</td>;
}
