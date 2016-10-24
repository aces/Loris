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
  // If a column if set as hidden, don't display it
  if (loris.hiddenHeaders.indexOf(column) > -1) {
    return null;
  }

  // Create the mapping between rowHeaders and rowData in a row object.
  var row = {};
  rowHeaders.forEach(function (header, index) {
    row[header] = rowData[index];
  }, this);

  if (column === 'New Data') {
    if (cell === 'new') {
      return React.createElement(
        'td',
        { className: 'newdata' },
        'NEW'
      );
    }
    return React.createElement('td', null);
  }

  if (column === 'Links') {
    var cellTypes = cell.split(",");
    var cellLinks = [];
    for (var i = 0; i < cellTypes.length; i += 1) {
      cellLinks.push(React.createElement(
        'a',
        { href: loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + row.SessionID + "&outputType=" + cellTypes[i] + "&backURL=/imaging_browser/" },
        cellTypes[i]
      ));
      cellLinks.push(" | ");
    }
    cellLinks.push(React.createElement(
      'a',
      { href: loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + row.SessionID + "&selectedOnly=1&backURL=/imaging_browser/" },
      'selected'
    ));

    cellLinks.push(" | ");
    cellLinks.push(React.createElement(
      'a',
      { href: loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + row.SessionID + "&backURL=/imaging_browser/" },
      'all types'
    ));
    return React.createElement(
      'td',
      null,
      cellLinks
    );
  }

  return React.createElement(
    'td',
    null,
    cell
  );
}