function formatColumn(column, cell, rowData) {
    if (column === 'Metadata') {
        var url = loris.BaseURL + "/dicom_archive/viewDetails/?tarchiveID=" + rowData[8];
        return React.createElement(
            'td',
            null,
            React.createElement(
                'a',
                { href: url },
                cell
            )
        );
    }
    if (column === 'MRI Browser') {
        if (rowData[9] === null || rowData[9] === '') {
            return React.createElement(
                'td',
                null,
                ' '
            );
        }
        var url = loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + rowData[9];
        return React.createElement(
            'td',
            null,
            React.createElement(
                'a',
                { href: url },
                cell
            )
        );
    }
    if (cell === "INVALID - HIDDEN") {
        return React.createElement(
            'td',
            { className: 'error' },
            cell
        );
    }
    return React.createElement(
        'td',
        null,
        cell
    );
}
