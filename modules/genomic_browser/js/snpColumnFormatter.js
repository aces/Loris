
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
            case 'RsID':
                var url = "http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs=" + cell;
                reactElement = React.createElement(
                    "td",
                    null,
                    React.createElement(
                        "a",
                        { href: url, target: '_blank' },
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
