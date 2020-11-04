// This function is used by the React StaticDataTable component.
function formatColumn(column, cell, rowData) {
    if (column === 'PSCID') {
        var url = loris.BaseURL + "/" + rowData[1] + "/";
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
    if (column == 'FileName') {
        var url = loris.BaseURL + "/genomic_browser/view_genomic_file/?GenomicFileID=" + rowData[0] ;
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
