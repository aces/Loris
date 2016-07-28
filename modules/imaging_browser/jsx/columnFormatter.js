function formatColumn(column, cell, rowData, rowHeaders) {
    if (-1 == loris.hiddenHeaders.indexOf(column)) {    
        // If this column is not a hidden one

        // Create the mapping between rowHeaders and rowData in a row object.
        var row = {};
        rowHeaders.forEach(function (header, index) {
            row[header] = rowData[index];
        }, this);

        if(column === 'New Data') {
            if(cell === 'new') {
                return <td className="newdata">NEW</td>
            }
            return <td></td>;
        }

        if(column === 'Links') {
            var cellTypes = cell.split(",");
            var cellLinks = []
            for(var i = 0; i < cellTypes.length; i += 1) {
                cellLinks.push(<a href={loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + row.SessionID + "&outputType=" + cellTypes[i] + "&backURL=/imaging_browser/"}>{cellTypes[i]}</a>);
                cellLinks.push(" | ");
    
            }
            cellLinks.push(<a href={loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + row.SessionID + "&selectedOnly=1&backURL=/imaging_browser/"}>selected</a> );
            cellLinks.push(" | ");
            cellLinks.push(<a href={loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + row.SessionID + "&backURL=/imaging_browser/"}>all types</a> );
            return (
                    <td>
                        {cellLinks}
                    </td>
                   );
        }

        return <td>{cell}</td>;
    }
    return null;
}
