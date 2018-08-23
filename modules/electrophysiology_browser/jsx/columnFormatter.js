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

  // Create the mapping between rowHeaders and rowData in a row object.
  let row = {};
  rowHeaders.forEach(function(header, index) {
    row[header] = rowData[index];
  }, this);

  // Create links for 'all types', 'raw' and 'derivatives' output types
  if (column === 'Links') {
    let cellTypes  = cell.split(",");
    let cellLinks  = [];
    let baseURL = loris.BaseURL + "/electrophysiology_browser/eeg_session/";
    let backURL = "&backURL=/electrophysiology_browser/";

    // display the link for 'all types'
    cellLinks.push(
      <a key='all' href={baseURL + "?sessionID=" + row["Session ID"] + backURL}>
        all types
      </a>
    );

    // display the link for raw and derivatives when they exist
    for (let i = 0; i < cellTypes.length; i++) {
      cellLinks.push(" | ");
      let linkURL = baseURL
        + "?sessionID=" + row["Session ID"]
        + "&outputType=" + cellTypes[i]
        + backURL
      cellLinks.push(<a key={i} href={linkURL}>{cellTypes[i]}</a>);
    }

    return (<td>{cellLinks}</td>);
  }

  return <td>{cell}</td>;
}


export default formatColumn;