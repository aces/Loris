
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
            case 'Subproject':
                reactElement = React.createElement(
                    "td",
                    null,
                    loris.subprojectList[cell]
                );
                break;
            case 'Files':
                var url = loris.BaseURL + "/genomic_browser/viewGenomicFile/?candID=" + rowData[1] + "/";
                reactElement = React.createElement(
                    "td",
                    null,
                    React.createElement(
                        "span",
                        {onClick: loris.loadFilteredMenuClickHandler('genomic_browser&submenu=viewGenomicFile', {'candID': rowData[1]}) },
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
