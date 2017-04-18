function formatColumn(column, cell, rowData) {
    if (column === 'URL') {
        var url = loris.BaseURL + "/survey.php?key=" + rowData.URL;
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
