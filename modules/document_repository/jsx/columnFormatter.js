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
  loris.hiddenHeaders = ['Category', 'Data Dir'];
  if (loris.hiddenHeaders.indexOf(column) > -1) {
    return null;
  }

  // Create the mapping between rowHeaders and rowData in a row object.
  let row = {};
  rowHeaders.forEach(function(header, index) {
    row[header] = rowData[index];
  }, this);

  // create array of classes to be added to td tag
  let classes = [];
  // convert array to string, with blank space separator
  classes = classes.join(' ');
  if (column === 'File Name') {
    let downloadURL = loris.BaseURL + '/document_repository/ajax/GetFile.php?File=' + encodeURIComponent(row['Data Dir']);
    return (
      <td className= {classes}>
        <a href={downloadURL} target="_blank" download={row['File Name']}>
          {cell}
        </a>
      </td>
    );
  }
  if (column === 'Edit') {
    let editURL = loris.BaseURL + '/document_repository2/edit/?id=' + row['Edit'];
    return <td className={classes}><a href={editURL}>Edit</a></td>;
  }
  if (column === 'Delete') {
    let id = row['Edit'];
  //  let click = 'alert('+id+')';
function click() {
alert(id);
swal({
  title: 'Are you sure?',
  text: 'Your will not be able to recover this file!',
  type: 'warning',
  showCancelButton: true,
  confirmButtonClass: 'btn-danger',
  confirmButtonText: 'Yes, delete it!',
  closeOnConfirm: false,
},
function() {
  swal('Deleted!', 'Your file has been deleted.', 'success');
    $.ajax({
    url: loris.BaseURL + '/document_repository/ajax/documentDelete.php',
    type: 'POST',
    data: {id: id},
    success: function() {
    location.reload();
    },
    error: function(jqXHR, textStatus, errorThrown) {
    },
  });
});
}
    return <td className={classes}><a onClick={click}>Delete</a></td>;
  }
  return <td className={classes}>{cell}</td>;
}
export default formatColumn;
