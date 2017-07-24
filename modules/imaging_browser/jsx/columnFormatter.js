/* exported formatColumn */

/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {array} rowData - array of cell contents for a specific row
 * @param {array} rowHeaders - array of table headers (column names)
 * @param {int} sortColumn - index of column sorted by (unique to imaging_browser)
 * @param {string} sortOrder - determines whether ASC or DESC (unique to imaging_browser)
 * @return {*} a formated table cell for a given column
 */
function formatColumn(column, cell, rowData, rowHeaders, sortedIDs) {
  // If a column if set as hidden, don't display it
  if (loris.hiddenHeaders.indexOf(column) > -1) {
    return null;
  }

   // Create the mapping between rowHeaders and rowData in a row object.
  var row = {};
  rowHeaders.forEach(function(header, index) {
    row[header] = rowData[index];
  }, this);

  if (column === 'New Data') {
    if (cell === 'new') {
      return <td className="newdata">NEW</td>;
    }
    return <td></td>;
  }

  if (column === 'Links') {
    var cellTypes = cell.split(",");
    var cellLinks = [];
    for (var i = 0; i < cellTypes.length; i += 1) {
      cellLinks.push(<a href={loris.BaseURL +
        "/imaging_browser/viewSession/?sessionID=" +
        row.SessionID + "&outputType=" +
        cellTypes[i] + "&backURL=/imaging_browser/" +
        "&sorted=" + sortedIDs
      }>
          {cellTypes[i]}
        </a>);
      cellLinks.push(" | ");
    }
    cellLinks.push(<a href={loris.BaseURL +
        "/imaging_browser/viewSession/?sessionID=" +
        row.SessionID +
        "&selectedOnly=1&backURL=/imaging_browser/" +
        "&sorted=" + sortedIDs
    }>
          selected
      </a>);

    cellLinks.push(" | ");
    cellLinks.push(<a href={loris.BaseURL +
        "/imaging_browser/viewSession/?sessionID=" +
        row.SessionID +
        "&backURL=/imaging_browser/" +
        "&sorted=" + sortedIDs
        }>
          all types
        </a>);
    return (<td>{cellLinks}</td>);
  }

  return <td>{cell}</td>;
}


window.formatColumn = formatColumn;

export default formatColumn;
