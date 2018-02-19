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
  let row = {};
  rowHeaders.forEach(function(header, index) {
    row[header] = rowData[index];
  }, this);

  let classes  = [];
  if (column === 'Title') {
    let pubID = row['Publication ID'];
    let viewURL = loris.BaseURL + '/publication/view_project?id=' + pubID;

    // need to decode html entities that get stored in database
    cell = decodeHtml(cell);

    return (
      <td>
        <a href={viewURL}>
          {cell}
        </a>
      </td>
    );
  }
  return <td className={classes}>{cell}</td>;
}

function decodeHtml(html) {
  let txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

export default formatColumn;
