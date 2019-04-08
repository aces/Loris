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
  if (loris.hiddenHeaders.indexOf(column) > -1) {
    return null;
  }

  // Create the mapping between rowHeaders and rowData in a row object.
  const row = {};
  rowHeaders.forEach(function(header, index) {
    row[header] = rowData[index];
  }, this);
  let value1;
  let value2;
  let hash;

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

window.formatColumn = formatColumn;

export default formatColumn;
