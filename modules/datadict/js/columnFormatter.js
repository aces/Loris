/* exported formatDataDictColumn */

/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {arrray} rowData - array of cell contents for a specific row
 * @return {*} a formated table cell for a given column
 */
function formatDataDictColumn(column, cell, rowData) {
  if (column === 'Description') {
    var updateDict = function (name) {
      return function (e) {
        e.stopPropagation();

        var value = e.target.valueOf().innerText;
        $.post(loris.BaseURL + "/datadict/ajax/UpdateDataDict.php", {
          fieldname: name, description: value
        }, function (data) {});
      };
    };
    return React.createElement(
      "td",
      {
        contentEditable: "true",
        className: "description",
        onBlur: updateDict(rowData[1]) },
      cell
    );
  }
  return React.createElement(
    "td",
    null,
    cell
  );
}
