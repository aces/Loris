/* exported formatColumn */

/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {arrray} rowData - array of cell contents for a specific row
 * @return {*} a formated table cell for a given column
 */
function formatColumn(column, cell, rowData) {
  if (column === 'PSCID') {
    var url = loris.BaseURL + "/" + rowData[1] + "/";
    return <td><a href ={url}>{cell}</a></td>;
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
               onClick={loris.loadFilteredMenuClickHandler('imaging_browser',
                 {pscid: rowData[2]})}
            >
                {cell}
            </a>
        </td>
      );
  }
  return <td>{cell}</td>;
}

window.formatColumn = formatColumn;

export default formatColumn;
