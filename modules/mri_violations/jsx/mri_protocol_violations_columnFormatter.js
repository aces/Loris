/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {array} rowData - array of cell contents for a specific row
 * @param {array} rowHeaders - array of table headers (column names)
 * @return {*} a formated table cell for a given column
 */
function formatColumn(column, cell, rowData, rowHeaders) {
  let url;
  if (loris.hiddenHeaders.indexOf(column) > -1) {
    return null;
  }
  // Create the mapping between rowHeaders and rowData in a row object.
  let row = {};
  rowHeaders.forEach(function(header, index) {
    row[header] = rowData[index];
  }, this);

  if (column === 'PatientName') {
    url = loris.BaseURL + '/dicom_archive/viewDetails/?tarchiveID=' +
       row.TarchiveID;
    return <td>
                <a href ={url}>{cell}</a>
             </td>;
  }

  return <td>{cell}</td>;
}

window.formatColumn = formatColumn;

export default formatColumn;

