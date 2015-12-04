function formatColumn(column, cell, rowData) {
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
            cellLinks.push(<a href={loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + rowData[11] + "&outputType=" + cellTypes[i]}>{cellTypes[i]}</a>);
            cellLinks.push(" | ");

        }
        cellLinks.push(<a href={loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + rowData[11] + "&selectedOnly=1"}>selected</a> );
        cellLinks.push(" | ");
        cellLinks.push(<a href={loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + rowData[11]}>all types</a> );
        return (
                <td>
                    {cellLinks}
                </td>
               );
    }
    return <td>{cell}</td>;
}
