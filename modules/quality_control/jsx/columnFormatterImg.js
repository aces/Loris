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
  if (loris.hiddenHeadersImg.indexOf(column) > -1) {
    return null;
  }

  // Create the mapping between rowHeaders and rowData in a row object.
  var row = {};
  rowHeaders.forEach(function(header, index) {
    row[header] = rowData[index];
  }, this)

  if (column === "Action"){
    if (row['Message'] === "T1 Scan done NOT Partial or Complete in MRI parameter form"){
      var mpfURL = loris.BaseURL+'/mri_parameter_form/?commentID=' + row['CommentID'];
      return <td> <a href={mpfURL}>MRI Parameter Form</a> </td>;
    }
  }

  return <td>{cell}</td>;
}
export default formatColumn;

