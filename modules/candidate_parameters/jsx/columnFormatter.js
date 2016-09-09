/* global hasWritePermission */
/* exported formatColumn */

/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {array} rowData - array of cell contents for a specific row
 * @param {array} rowHeaders - array of table headers (column names)
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

  // hasWritePermission is defined in menu_media.tpl
  if (column === 'File Name' && hasWritePermission === true) {
    var downloadURL = loris.BaseURL + "/media/ajax/FileDownload.php?File=" +
        row['File Name'];
    return (
        <td>
          <a href={downloadURL} target="_blank" download={row['File Name']}>
            {cell}
          </a>
        </td>
    );
  }

  if (column === 'Visit Label') {
    if (row["Cand ID"] !== null && row["Session ID"]) {
      var sessionURL = loris.BaseURL + "/instrument_list/?candID=" +
          row["Cand ID"] + "&sessionID=" + row["Session ID"];
      return <td><a href={sessionURL}>{cell}</a></td>;
    }
  }

  if (column === 'Edit Metadata') {
    var editURL = loris.BaseURL + "/media/edit/?id=" + row['Edit Metadata'];
    return <td><a href={editURL}>Edit</a></td>;
  }

  return <td>{cell}</td>;
}
