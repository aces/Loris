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
  var url;
  rowHeaders.forEach(function (header, index) {
    row[header] = rowData[index];
  }, this);

  if (column === 'Topic') {
    url = loris.BaseURL + "/help_editor/edit_help_content/?helpID=" + row.HelpID + "&parentID=" + row.ParentID;
    return React.createElement(
      "td",
      null,
      React.createElement(
        "a",
        { href: url },
        cell
      )
    );
  }
  if (column === 'Parent Topic') {
    url = loris.BaseURL + "/help_editor/edit_help_content/?helpID=" + row.ParentID + "&parentID=" + row.ParentTopicID;
    return React.createElement(
      "td",
      null,
      React.createElement(
        "a",
        { href: url },
        cell
      )
    );
  }

  return React.createElement(
    "td",
    null,
    cell
  );
}
