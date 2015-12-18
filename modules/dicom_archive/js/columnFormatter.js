function formatColumn(column, cell, rowData) {
    if (column === 'Metadata') {
        var url = loris.BaseURL + "/abc" + rowData[1] + "/";
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