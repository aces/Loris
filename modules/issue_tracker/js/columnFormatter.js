function formatColumn(column, cell, rowData, rowHeaders) {
    //if (-1 == loris.hiddenHeaders.indexOf(column)) {
        // If this column is not a hidden one

        console.log("in function formatcolumn");
        console.log(column);
        console.log(rowData);
        console.log(rowHeaders);
        // Create the mapping between rowHeaders and rowData in a row object.
        var row = {};
        rowHeaders.forEach(
            function (header, index) {
                row[header] = rowData[index];
            },
            this
        );

        if (column === 'Issue ID') {
            var cellLinks = [];
            cellLinks.push(
                React.createElement(
                    'a',
                    { href: loris.BaseURL + "/issue_tracker/edit/?issueID=" + row['Issue ID'] + "&backURL=/issue_tracker/" },
                    cell
                )
            );

            return React.createElement(
                'td',
                null,
                cellLinks
            );
        }

        if (column === 'Priority') {
            switch (cell) {
            case "normal":
                    return React.createElement(
                        "td",
                        { style: { background: "#CCFFCC" } },
                        "Normal"
                    );
            case "high":
                    return React.createElement(
                        "td",
                        { style: { background: "#EEEEAA" } },
                        "High"
                    );
            case "urgent":
                    return React.createElement(
                        "td",
                        { style: { background: "#CC6600" } },
                        "Urgent"
                    );
            case "immediate":
                    return React.createElement(
                        "td",
                        { style: { background: "#E4A09E" } },
                        "Immediate"
                    );
            default:
                    return React.createElement(
                        "td",
                        { style: { background: "#99CCFF" } },
                        "Low"
                    );
            }
        }

        return React.createElement(
            'td',
            null,
            cell
        );
        //  }
        return null;
}