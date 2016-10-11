'use strict';

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
  // Create the mapping between rowHeaders and rowData in a row object.
  var row = {};
  rowHeaders.forEach(function (header, index) {
    row[header] = rowData[index];
  }, this);

  if (column === 'Title') {
    var cellLinks = [];
    cellLinks.push(React.createElement(
      'a',
      { href: loris.BaseURL + "/issue_tracker/edit/?issueID=" + row['Issue ID'] + "&backURL=/issue_tracker/" },
      row.Title
    ));
    return React.createElement(
      'td',
      null,
      cellLinks
    );
  }

  if (column === 'Issue ID') {
    var _cellLinks = [];
    _cellLinks.push(React.createElement(
      'a',
      { href: loris.BaseURL + "/issue_tracker/edit/?issueID=" + row['Issue ID'] + "&backURL=/issue_tracker/" },
      cell
    ));
    return React.createElement(
      'td',
      null,
      _cellLinks
    );
  }

  if (column === 'Priority') {
    switch (cell) {
      case "normal":
        return React.createElement(
          'td',
          { style: { background: "#CCFFCC" } },
          'Normal'
        );
      case "high":
        return React.createElement(
          'td',
          { style: { background: "#EEEEAA" } },
          'High'
        );
      case "urgent":
        return React.createElement(
          'td',
          { style: { background: "#CC6600" } },
          'Urgent'
        );
      case "immediate":
        return React.createElement(
          'td',
          { style: { background: "#E4A09E" } },
          'Immediate'
        );
      case "low":
        return React.createElement(
          'td',
          { style: { background: "#99CCFF" } },
          'Low'
        );
      default:
        return React.createElement(
          'td',
          null,
          'None'
        );
    }
  }
  return React.createElement(
    'td',
    null,
    cell
  );
}