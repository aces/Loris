function formatColumn(column, cell, rowData) {
    if(column === 'URL') {
        var url = loris.BaseURL + "/survey.php?key=" + rowData.URL;
        return <td><a href={url}>{cell}</a></td>;
    }
    return <td>{cell}</td>;
}
