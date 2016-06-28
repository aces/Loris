function formatColumn(column, cell, rowData, rowHeaders) {
    reactElement = null;

    if (-1 == loris.hiddenHeaders.indexOf(column)) {

        var row = {};
        rowHeaders.forEach(function (header, index) {
            row[header] = rowData[index];
        }, this);

        switch (column) {
            case 'New Data':
                if (cell === 'new') {
                    reactElement = React.createElement(
                        'td',
                        { className: 'newdata' },
                        'NEW'
                    );
                } else {
                    reactElement = React.createElement('td', null);
                }
                break;
            case 'Links':
                // 11 = SessionID
                var cellTypes = cell.split(",");
                var cellLinks = cellTypes.map(function (current, index) {
                    return React.createElement(
                        'span',
                        null,
                        React.createElement(
                            'a',
                            { href: loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + row.SessionID + "&outputType=" + current + "&backURL=/imaging_browser/" },
                            current
                        ),
                        ' | '
                    );
                }, this);
                cellLinks.push(React.createElement(
                    'span',
                    null,
                    React.createElement(
                        'a',
                        { href: loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + row.SessionID + "&selectedOnly=1&backURL=/imaging_browser/" },
                        'selected'
                    ),
                    ' | '
                ));
                cellLinks.push(React.createElement(
                    'a',
                    { href: loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + row.SessionID + "&backURL=/imaging_browser/" },
                    'all types'
                ));
                reactElement = React.createElement(
                    'td',
                    null,
                    cellLinks
                );
                console.log(row);
                break;
            default:
                reactElement = React.createElement(
                    'td',
                    null,
                    cell
                );
                break;
        }
    }
    return reactElement;
}