function formatColumn(column, cell, rowData) {
    if (column === 'Metadata') {
        var url = loris.BaseURL + "/dicom_archive/viewDetails/?tarchiveID=" + rowData[rowData.length - 2];
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
        if (rowData[rowData.length - 1] === null || rowData[rowData.length - 1] === '') {
            return React.createElement(
                'td',
                null,
                ' '
            );
        }
        var url = loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + rowData[rowData.length - 1];
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