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
  if (loris.hiddenHeaders.indexOf(column) > -1) {
    return null;
  }

  // Create the mapping between rowHeaders and rowData in a row object.
  var row = {};
  rowHeaders.forEach(function(header, index) {
    row[header] = rowData[index];
  }, this);
  var value1;
  var value2;
  var hash;

  if (column === 'Correct Answer') {
    value1 = row.Value1;
    value2 = row.Value2;
    hash = row.Hash;
    return <td>
                <select name={hash} className="form-control input-sm" >
                     <option value="none" >Unresolved</option>
                     <option value="1" >{value1}</option>
                     <option value="2" >{value2}</option>
                </select>
             </td>;
  }
  return <td>{cell}</td>;
}
