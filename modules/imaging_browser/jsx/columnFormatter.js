function formatColumn(column, cell, rowData) {
    switch (column) {
        case 'SessionID':
            // hide this column
            return null;
            break;
        case 'New Data':
            if(cell === 'new') {
                return <td className="newdata">NEW</td>
            }
            return <td></td>;
            break;
        case 'Links':
            var cellTypes = cell.split(",");
            var cellLinks = []
            for(var i = 0; i < cellTypes.length; i += 1) {
                cellLinks.push(<a href={loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + rowData[11] + "&outputType=" + cellTypes[i] + "&backURL=" + loris.BaseURL + "/imaging_browser/"}>{cellTypes[i]}</a>);
                cellLinks.push(" | ");
            }
            cellLinks.push(<a href={loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + rowData[11] + "&selectedOnly=1" + "&backURL=" + loris.BaseURL + "/imaging_browser/"}>selected</a> );
            cellLinks.push(" | ");
            cellLinks.push(<a href={loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + rowData[11] + "&backURL=" + loris.BaseURL + "/imaging_browser/" }>all types</a> );
            return (
                    <td>
                        {cellLinks}
                    </td>
            );
            break;
        default:
            return <td>{cell}</td>;
            break;
    }
}
