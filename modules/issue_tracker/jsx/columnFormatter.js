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
  rowHeaders.forEach(
    function(header, index) {
      row[header] = rowData[index];
    },
    this
  );

  if (column === 'Title') {
    let cellLinks = [];
    cellLinks.push(
      <a href={loris.BaseURL + "/issue_tracker/edit/?issueID=" +
      row['Issue ID'] + "&backURL=/issue_tracker/"}>
        {row.Title}
      </a>
    );
    return (
      <td>
        {cellLinks}
      </td>
    );
  }

  if (column === 'Issue ID') {
    let cellLinks = [];
    cellLinks.push(
      <a href={loris.BaseURL + "/issue_tracker/edit/?issueID=" +
      row['Issue ID'] + "&backURL=/issue_tracker/"}>
        {cell}
      </a>
    );
    return (<td>{cellLinks}</td>);
  }

  if (column === 'Priority') {
    switch (cell) {
      case "normal":
        return <td style={{background: "#CCFFCC"}}>Normal</td>;
      case "high":
        return <td style={{background: "#EEEEAA"}}>High</td>;
      case "urgent":
        return <td style={{background: "#CC6600"}}>Urgent</td>;
      case "immediate":
        return <td style={{background: "#E4A09E"}}>Immediate</td>;
      case "low":
        return <td style={{background: "#99CCFF"}}>Low</td>;
      default:
        return <td>None</td>;
    }
  }
  return <td>{cell}</td>;
}
