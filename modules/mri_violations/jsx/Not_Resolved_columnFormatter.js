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

  if (column === 'Resolution Status') {
      var  hashName = "resolvable[" + row["Hash"] +"]";
      return <td>
                <select name= {hashName} className="form-control input-sm" >
                     <option value='unresolved' >Unresolved</option>
                     <option value='reran' >Reran</option>
                     <option value='emailed' >Emailed site/pending</option>
                     <option value='inserted' >Inserted</option>
                     <option value='rejected' >Rejected</option>
                     <option value='inserted_flag' >Inserted with flag</option>
                     <option value='other' >Other</option>
                </select>
             </td>;

  }

  return <td>{cell}</td>;

}
