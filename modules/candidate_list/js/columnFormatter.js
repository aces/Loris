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
    
    // For those candidates who had their scans done
    // make the 'Scan Done' value in the column a link
    // to the imaging browser with the filter's PSCID
    // set to the PSCID of the candidate
    if (column === 'Scan Done' && cell === 'Y') {
        return React.createElement(
            "td",
            { className: "scanDoneLink" },
            React.createElement(
                "a",
                { 
                  onClick: function(e) {
                      loris.loadFilteredMenuClickHandler(
                          'imaging_browser', {"pscid" : rowData[2]}
                      )(e);
                  }
                },
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