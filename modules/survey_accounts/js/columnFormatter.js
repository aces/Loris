"use strict";

function formatColumn(column, cell, rowData, rowHeaders) {
    if (loris.hiddenHeaders.indexOf(column) > -1) {
        return null;
    }

    // Create the mapping between rowHeaders and rowData in a row object.
    var row = {};
    rowHeaders.forEach(function (header, index) {
        row[header] = rowData[index];
    }, this);
    if (column === 'URL') {
        var url = loris.BaseURL + "/survey.php?key=" + row["URL"];
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
