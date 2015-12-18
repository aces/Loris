function formatColumn(column, cell, rowData) {
    if (column === 'Metadata') {
        var url = loris.BaseURL + "/dicom_archive/viewDetails/?tarchiveID=" + rowData[9];
        return React.createElement(
            "td",
            null,
            React.createElement(
                "a",
                { href: url },
                cell
            )
        );
    }
    return React.createElement(
        "td",
        null,
        cell
    );
}