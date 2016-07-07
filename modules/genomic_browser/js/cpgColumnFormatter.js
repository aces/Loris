
function getClassColor(methylationLevel) {
    var className = '';
    var level = parseFloat(methylationLevel);
    // Color coding of cpg link follow display convention of the wgEncodeHaibMethyl450 track
    // at the UCSC Genome-Browser
    switch (true) {
       case ( methylationLevel >= 0.6):
           className = 'cpgOrange';
           break;
       case ( methylationLevel > 0.2):
           className = 'cpgPurple';
           break;
       case ( methylationLevel > 0):
           className = 'cpgBlue';
           break;
       default:
           className = 'cpgBlack';
           break;
    }
    return className;
}

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
            case 'Cpg Name':
                var chr = rowData[9];
                var genomicLocation = rowData[11];
                var startLoc = parseInt(genomicLocation) - 1000,
                    endLoc   = parseInt(genomicLocation) + 1000;
                
                var className = getClassColor(rowData[8]);

                var url = "http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg19&position=" + chr + ":" + startLoc + "-" + endLoc;
                reactElement = React.createElement(
                    "td",
                    {className: className},
                    React.createElement(
                        "a",
                        { href: url , target: '_blank'},
                        cell
                    )
                );
                break;
            case 'Beta Value':
                var className = getClassColor(rowData[8]);
                reactElement = React.createElement(
                    "td",
                    {className: className},
                    cell
                );
                break;
            case 'Gene':
            case 'Accession Number':
            case 'Island Loc':
                if( cell != null) {
                    links = cell.split(';').map( function (e) {
                        var url = "http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg19&position=" + e;
                        return React.createElement(
                            "a",
                            { href: url , target: '_blank'},
                            e + " " 
                        )
                    });
                } else {
                    links = React.createElement(
                        "a",
                        null,
                        " "
                    );
                }
                reactElement = React.createElement(
                    "td",
                    null,
                    links
                );
                break;
            case 'DHS':
            case 'Enhancer':
                cell = (cell == '1') ? 'Yes' : null;
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
