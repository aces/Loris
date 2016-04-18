function formatColumn(column, cell, rowData) {
    if (column === 'New Data') {
        if (cell === 'new') {
            return React.createElement(
                'td',
                { className: 'newdata' },
                'NEW'
            );
        }
        return React.createElement('td', null);
    }
    if (column === 'Links') {
        var cellTypes = cell.split(",");
        var cellLinks = [];
        for (var i = 0; i < cellTypes.length; i += 1) {
            cellLinks.push(React.createElement(
                'a',
                { href: loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + rowData[11] + "&outputType=" + cellTypes[i] },
                cellTypes[i]
            ));
            cellLinks.push(" | ");
        }
        cellLinks.push(React.createElement(
            'a',
            { href: loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + rowData[11] + "&selectedOnly=1" },
            'selected'
        ));
        cellLinks.push(" | ");
        cellLinks.push(React.createElement(
            'a',
            { href: loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + rowData[11] },
            'all types'
        ));
        return React.createElement(
            'td',
            null,
            cellLinks
        );
    }
    return React.createElement(
        'td',
        null,
        cell
    );
}