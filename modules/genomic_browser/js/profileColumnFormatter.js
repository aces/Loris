
function formatColumn(column, cell, rowData) {
    reactElement = null;
    if (-1 == loris.hiddenHeaders.indexOf(column)) {
        var params = [];
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

            // Links columns. They all use the loris.loadFilteredMenuClickHandler
            // but with distinctive parameters.
            case 'Files':
		if (0 == params.length) {
                    params = ['genomic_browser&submenu=viewGenomicFile', {'candID': rowData[1]}];
                }
            case 'SNPs':
		if (0 == params.length) {
                    params = ['genomic_browser&submenu=snp_browser', {'DCCID': rowData[1], 'filter': "Show Data"}];
                }
            case 'CNVs':
		if (0 == params.length) {
                    params = ['genomic_browser&submenu=cnv_browser', {'DCCID': rowData[1], 'filter': "Show Data"}];
                }
            case 'CPGs':
		if (0 == params.length) {
                    params = ['genomic_browser&submenu=cpg_browser', {'DCCID': rowData[1], 'filter': "Show Data"}];
                }
                reactElement = React.createElement(
                    "td",
                    null,
                    React.createElement(
                        "a",
                        {onClick: loris.loadFilteredMenuClickHandler(params[0], params[1]) },
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
