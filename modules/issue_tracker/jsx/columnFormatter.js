function formatColumn(column, cell, rowData, rowHeaders) {
    // Create the mapping between rowHeaders and rowData in a row object.
  var row = {};
  rowHeaders.forEach(
        function(header, index) {
          row[header] = rowData[index];
        },
        this
    );

  if (column === 'Issue ID') {
    var cellLinks = [];
    cellLinks.push(<a
            href={loris.BaseURL + "/issue_tracker/edit/?issueID=" + row['Issue ID'] + "&backURL=/issue_tracker/"}>{cell}</a>);
    return (
            <td>
                {cellLinks}
            </td>
        );
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
