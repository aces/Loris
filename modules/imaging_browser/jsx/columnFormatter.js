function formatColumn(column, cell, rowData, rowHeaders) {
    reactElement = null;

    if (-1 == loris.hiddenHeaders.indexOf(column)) {

        var row = {};
        rowHeaders.forEach(function(header, index) {
            row[header] = rowData[index];
        }, this);

        switch (column) {
            case 'New Data':
                if(cell === 'new') {
                     reactElement = <td className="newdata">NEW</td>;
                } else {
                     reactElement = <td></td>;
                }
                break;
            case 'Links':
                // 11 = SessionID 
                var cellTypes = cell.split(",");
                var cellLinks = cellTypes.map(function (current, index) {
                    return <span><a href={loris.BaseURL + "imaging_browser/viewSession/?sessionID=" + row.SessionID + "&outputType=" + current + "&backURL=/imaging_browser/"}>{current}</a> | </span>;
                }, this);
                cellLinks.push(<span><a href={loris.BaseURL + "imaging_browser/viewSession/?sessionID=" + row.SessionID + "&selectedOnly=1&backURL=/imaging_browser/"}>selected</a> | </span>);
                cellLinks.push(<a href={loris.BaseURL + "imaging_browser/viewSession/?sessionID=" + row.SessionID + "&backURL=/imaging_browser/"}>all types</a>);
                reactElement = <td>{cellLinks}</td>;
console.log(row);
                break;
            default:
                reactElement = <td>{cell}</td>;
                break;
        }
    }
    return reactElement;
}
