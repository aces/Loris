function formatColumn(column, cell, rowData) {
    if(column === 'PSCID') {
        var url            = loris.BaseURL + "/" + rowData[1] + "/";
        return <td><a href ={url}>{cell}</a></td>;
    }
    if(column ==='Feedback') {
        switch(cell) {
            case "1": return <td style ={{ background : "#E4A09E"}}>opened</td>;
            case "2": return <td style ={{ background: "#EEEEAA" }}>answered</td>;
            case "3": return <td style ={{ background: "#99CC99" }}>closed</td>
            case "4": return <td style ={{ background: "#99CCFF" }}>comment</td>
            default: return <td>None</td>;
        }
    }
    return <td>{cell}</td>;
}
