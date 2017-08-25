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
  }, this)

  if (column === "MRI Parameter Form"){
      var mpfURL = loris.BaseURL + '/mri_parameter_form/?commentID=' + row['CommentID'] +
        '&sessionID=' + row['Session ID'] + '&candID=' + row['DCCID'];
      return <td> <a href={mpfURL}>{cell}</a> </td>;

  }
  else if (column === "Scan" && cell==="In Imaging Browser"){
    var imgURL = loris.BaseURL + '/imaging_browser/viewSession/?sessionID='+row['Session ID'];
    return <td><a href={imgURL}>{cell}</a></td>;
  }

  else if (column === "Tarchive"){
    if (cell ==="In DICOM" ){
      var tarchiveURL = loris.BaseURL + '/dicom_archive/viewDetails/?tarchiveID='+row['TarchiveID'];
      return <td><a href = {tarchiveURL}>{cell}</a></td>;
  } else{
      return <td>Missing</td>;
    } 
  }

  return <td>{cell}</td>;
}

function inObject(key, object){
  for (var i = 0; i<Object.keys(object).length; i++){
    if (key === object[i]){
      return true;
    }
  }
  return false;
}
export default formatColumn;

