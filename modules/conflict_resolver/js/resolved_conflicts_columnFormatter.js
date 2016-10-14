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

  var correctAnswer;

  rowHeaders.forEach(function (header, index) {
    row[header] = rowData[index];
  }, this);
  // If OldValue1 == null, then send OldValue2's value to correctAnswer
  if (column == 'Correct Answer') {

    correctAnswer = row['Correct Answer'];

    if (correctAnswer == null) {

      correctAnswer = row['OldValue2'];
    }

    return React.createElement(
      'td',
      null,
      correctAnswer
    );
  }

  return React.createElement(
    'td',
    null,
    cell
  );
}