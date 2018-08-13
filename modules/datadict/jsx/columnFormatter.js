/* exported formatDataDictColumn */

/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {arrray} rowData - array of cell contents for a specific row
 * @param {arrray} rowHeaders - array of table headers (column names)
 * @return {*} a formated table cell for a given column
 */
function formatDataDictColumn(column, cell, rowData, rowHeaders) {
  if (loris.hiddenHeaders.indexOf(column) > -1) {
    return null;
  }
  const hasEditPermission = loris.userHasPermission('data_dict_edit');
  if (column === 'Description' && hasEditPermission) {
    var updateDict = function(name) {
      return function(e) {
        e.stopPropagation();

        var value = e.target.valueOf().innerText;
        $.post(loris.BaseURL + "/datadict/ajax/UpdateDataDict.php", {
          fieldname: name, description: value
        }, function(data) {
        });
      };
    };
    return (
      <td
        contentEditable="true"
        className="description"
        onBlur={updateDict(rowData[1])}>
          {cell}
      </td>
    );
  }
  return <td>{cell}</td>;
}

window.formatDataDictColumn = formatDataDictColumn;

export default formatDataDictColumn;
