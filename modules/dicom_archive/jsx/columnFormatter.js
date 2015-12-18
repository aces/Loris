function formatColumn(column, cell, rowData) {
    if(column === 'Metadata') {
        var url = loris.BaseURL + "/dicom_archive/viewDetails/?tarchiveID=" + rowData[9];
        return <td><a href={url}>{cell}</a></td>;
    }
    return <td>{cell}</td>;
}
