function formatColumn(column, cell, rowData) {
    if(column === 'Metadata') {
        var url = loris.BaseURL + "/abc" + rowData[1] + "/";
        return <td><a href={url}>{cell}</a></td>;
    }
    return <td>{cell}</td>;
}
