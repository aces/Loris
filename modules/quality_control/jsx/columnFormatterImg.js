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

  var errors = {
                        1 : "(T1) MRI PF incomplete, Tarchive exists, QC pass",
                        2 : "(T1) MRI PF Completed = No Scan, scan inserted in browser, QC pass",
                        3 : "(T2) MRI PF incomplete, Tarchive exists, QC pass",
                        4 : "(T2) MRI PF Completed = No Scan, scan inserted in browser, QC pass",
  };

  // Create the mapping between rowHeaders and rowData in a row object.
  var row = {};
  rowHeaders.forEach(function(header, index) {
    row[header] = rowData[index];
  }, this)

  console.log(row);

  if (column === "Action"){
    if (row['Error Message'] === errors[1] || row['Error Message'] === errors[3]){
      var mpfURL = loris.BaseURL+'/mri_parameter_form/?commentID=' + row['CommentID'] +
        '&sessionID=' + row['Session ID'] + '&candID=' + row['DCCID'];
      return <td> <a href={mpfURL}>MRI Parameter Form</a> </td>;
    }
  }

  return <td>{cell}</td>;
}
export default formatColumn;

