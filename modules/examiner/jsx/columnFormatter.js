/* exported formatColumn */

/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {array} rowData - array of cell contents for a specific row
 * @param {array} rowHeaders - array of table headers (column names)
 * @return {*} a formatted table cell for a given column
 */
function formatColumn(column, cell, rowData, rowHeaders) {
  if (loris.hiddenHeaders.indexOf(column) > -1) {
    return null;
  }
  // Create the mapping between rowHeaders and rowData in a row object.
  let row = {};
  rowHeaders.forEach(function(header, index) {
    row[header] = rowData[index];
  }, this);

  switch (column) {
    case 'Examiner':
      const url = loris.BaseURL + '/examiner/editExaminer/?identifier=' + row.ID;
      return (
        <td>
          <a href ={url}>{cell}</a>
        </td>
      );

    case 'Radiologist':
      let radiologist = 'No';
      if (row.Radiologist === '1') {
        radiologist = 'Yes';
      }

      return (
        <td>
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

window.formatColumn = formatColumn;

export default formatColumn;
