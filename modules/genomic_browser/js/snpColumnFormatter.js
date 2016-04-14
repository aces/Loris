
function formatColumn(column, cell, rowData) {
    reactElement = null;
    if (-1 == loris.hiddenHeaders.indexOf(column)) {
        switch (column) {
            case 'PSCID':
                var url = loris.BaseURL + "/" + rowData[1] + "/";
                reactElement = React.createElement(
                    "td",
                    null,
                    React.createElement(
                        "a",
                        { href: url },
                        cell
                    )
                );
                break;
            default:
                reactElement = React.createElement(
                    "td",
                    null,
                    cell
                );
                break;
        }
    }
    return reactElement;
}
