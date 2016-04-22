function formatColumn(column, cell, rowData) {
    if (column === 'PSCID') {
        if (loris.userHasPermission('access_all_profiles')) {
            var url = loris.BaseURL + "/" + rowData[1] + "/";
            return React.createElement(
                "td",
                null,

                    React.createElement(
                        "a",
                        {href: url},
                        cell
                    )
            );
        }
        else
        {
            return React.createElement(
                "td",
                null,
                cell
            );
        }

    }
    if (column === 'Feedback') {
        switch (cell) {
            case "1":
                return React.createElement(
                    "td",
                    { style: { background: "#E4A09E" } },
                    "opened"
                );
            case "2":
                return React.createElement(
                    "td",
                    { style: { background: "#EEEEAA" } },
                    "answered"
                );
            case "3":
                return React.createElement(
                    "td",
                    { style: { background: "#99CC99" } },
                    "closed"
                );
            case "4":
                return React.createElement(
                    "td",
                    { style: { background: "#99CCFF" } },
                    "comment"
                );
            default:
                return React.createElement(
                    "td",
                    null,
                    "None"
                );
        }
    }
    return React.createElement(
        "td",
        null,
        cell
    );
}