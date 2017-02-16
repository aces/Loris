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

  switch (column) {

    case 'Examiner':
      var url = loris.BaseURL + "/examiner/editExaminer/?identifier=" +
                row.ID;
      return (
             <td>
                <a href ={url}>{cell}</a>
             </td>
             );

    case 'Radiologist':
      var radiologist = 'No';
      if (row.Radiologist === '1') {
        radiologist = 'Yes';
      }

      return (<td>
                 {radiologist}
              </td>
              );

    case 'Certification':
      if (row.Certification === null) {
        return (
                     <td>
                        None
                     </td>
                    );
      }
      return (
                   <td>
                      {cell}
                   </td>
                   );

    default:
      return (
                   <td>
                      {cell}
                   </td>
                   );

  }
}

