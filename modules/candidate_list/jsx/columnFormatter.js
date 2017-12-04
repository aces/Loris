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
  // If a column is set as hidden, don't display it
  if (loris.hiddenHeaders.indexOf(column) > -1) {
    return null;
  }

  // Create the mapping between rowheaders and rowData in a row object
  var row = {};
  rowHeaders.forEach(function(header, index) {
    row[header] = rowData[index];
  }, this);

  // create array of classes to be added to td tag
  var classes = [];

  if (row['Consent To Study'] === 'no') {
    classes.push("bg-danger");
  }
  if (column === 'PSCID') {
    var url = loris.BaseURL + "/" + row.DCCID + "/";
    return (
        <td className = {classes}>
          <a href ={url}>
            {cell}
          </a>
        </td>);
  }
  if (column === 'Feedback') {
    switch (cell) {
      case "1": return <td style ={{background: "#E4A09E"}}>opened</td>;
      case "2": return <td style ={{background: "#EEEEAA"}}>answered</td>;
      case "3": return <td style ={{background: "#99CC99"}}>closed</td>;
      case "4": return <td style ={{background: "#99CCFF"}}>comment</td>;
      default: return <td>None</td>;
    }
  }
  if (column === 'Scan Done' && cell === 'Y') {
    return (
        <td className="scanDoneLink">
            <a href="#"
               onClick={loris.loadFilteredMenuClickHandler('imaging_browser/',
                 {pscid: rowData[2]})}
            >
                {cell}
            </a>
        </td>
      );
  }
  // convert array to string, with blank space separator
  classes = classes.join(" ");
  return <td className={classes}>{cell}</td>;
}

window.formatColumn = formatColumn;

export default formatColumn;
