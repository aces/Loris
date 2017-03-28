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

  if (column === 'Correct Answer') {
    var correctAnswer = '';
    var newValue = row['New Value'];
    var oldValue1 = row['Correct Answer'];
    var oldValue2 = row.OldValue2;

    if (newValue === '1' && oldValue1 !== null) {
      correctAnswer = oldValue1;
    }

    if (newValue === '2' && oldValue2 !== null) {
      correctAnswer = oldValue2;
    }

    return <td>{correctAnswer}</td>;
  }

  return <td>{cell}</td>;
}

window.formatColumn = formatColumn;

export default formatColumn;
