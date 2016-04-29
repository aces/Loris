function formatColumn(column, cell, rowData) {
    if(column === 'Metadata') {
        var url = loris.BaseURL + "/dicom_archive/viewDetails/?tarchiveID=" + rowData[8];
        return <td><a href={url}>{cell}</a></td>;
    }
    if (column === 'MRI Browser') {
        if (rowData[9] === null || rowData[9] === '') {
            return <td>&nbsp;</td>
        }
        var url = loris.BaseURL + "/imaging_browser/viewSession/?sessionID=" + rowData[9];
        return <td><a href={url}>{cell}</a></td>;
    }
    if (cell === "INVALID - HIDDEN") {
        return <td className="error">{cell}</td>;
    }
    return <td>{cell}</td>;
}
