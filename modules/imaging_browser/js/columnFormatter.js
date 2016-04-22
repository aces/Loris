function formatColumn(column, cell, rowData) {
    switch (column) {
        case 'SessionID':
            // hide this column
            return null;
            break;
        case 'New Data':
            if (cell === 'new') {
                return React.createElement(
                    'td',
                    { className: 'newdata' },
                    'NEW'
                );
            }
            return React.createElement('td', null);
            break;
        case 'Links':
            var cellTypes = cell.split(",");
            var cellLinks = [];
            for (var i = 0; i < cellTypes.length; i += 1) {
                cellLinks.push(React.createElement(
                    'a',
                    { href: loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + rowData[11] + "&outputType=" + cellTypes[i] + "&backURL=" + loris.BaseURL + "/imaging_browser/" },
                    cellTypes[i]
                ));
                cellLinks.push(" | ");
            }
            cellLinks.push(React.createElement(
                'a',
                { href: loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + rowData[11] + "&selectedOnly=1" + "&backURL=" + loris.BaseURL + "/imaging_browser/" },
                'selected'
            ));
            cellLinks.push(" | ");
            cellLinks.push(React.createElement(
                'a',
                { href: loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + rowData[11] + "&backURL=" + loris.BaseURL + "/imaging_browser/" },
                'all types'
            ));
            return React.createElement(
                'td',
                null,
                cellLinks
            );
            break;
        default:
            return React.createElement(
                'td',
                null,
                cell
            );
            break;
    }
}