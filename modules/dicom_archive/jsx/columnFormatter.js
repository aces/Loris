function formatColumn(column, cell, rowData) {
    if(column === 'Metadata') {
        var url = loris.BaseURL + "/dicom_archive/viewDetails/?tarchiveID=" + rowData[rowData.length-2];
        return <td><a href={url}>{cell}</a></td>;
    }
    if (column === 'MRI Browser') {
        if (rowData[rowData.length-1] === null || rowData[rowData.length-1] === '') {
            return <td>&nbsp;</td>
        }
        var url = loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + rowData[rowData.length-1];
        return <td><a href={url}>{cell}</a></td>;
    }
    if (cell === "INVALID - HIDDEN") {
        return <td className="error">{cell}</td>;
    }
    return <td>{cell}</td>;
}
