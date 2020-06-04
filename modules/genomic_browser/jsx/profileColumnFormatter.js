/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {array} rowData - array of cell contents for a specific row
 * @param {array} rowHeaders - array of table headers (column names)
 * @return {*} a formated table cell for a given column
 */
function formatColumn(column, cell, rowData, rowHeaders) {
  // If a column if set as hidden, don't display it
  if (loris.hiddenHeaders.indexOf(column) > -1) {
    return null;
  }

  // Create the mapping between rowHeaders and rowData in a row object.
  let row = {};
  rowHeaders.forEach(function(header, index) {
    row[header] = rowData[index];
  }, this);

  let reactElement = null;
  switch (column) {
    case 'PSCID': {
      const url = loris.BaseURL + '/' + rowData[1] + '/';
      reactElement = (
        <td><a href={url}>{cell}</a></td>
      );
      break;
    }
    case 'Subproject':
      reactElement = (
        <td>{loris.subprojectList[cell]}</td>
      );
      break;
    case 'File':
      if (cell === 'Y') {
        reactElement = (
          <td>
            <a href="#" onClick={loris.loadFilteredMenuClickHandler(
              'genomic_browser/viewGenomicFile/',
              {candID: rowData[1]}
            )}>{cell}</a>
          </td>
        );
      } else {
        reactElement = (
          <td>{cell}</td>
        );
      }
      break;
    case 'CNV':
    case 'CPG':
    case 'SNP':
      if (cell === 'Y') {
        reactElement = (
          <td>
            <span
              style={{cursor: 'pointer'}}
              onClick={loris.loadFilteredMenuClickHandler(
                'genomic_browser/' + column.toLowerCase() + '_browser/', {DCCID: rowData[1]}
              )}
            >
              {cell}
            </span>
          </td>
        );
      } else {
        reactElement = (
          <td>{cell}</td>
        );
      }
      break;
    default:
      reactElement = (
       <td>{cell}</td>
     );
  }
  return reactElement;
}

window.formatColumn = formatColumn;
