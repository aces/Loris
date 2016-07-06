function formatColumn(column, cell, rowData) {

  if (column === 'File Name') {
    var url = loris.BaseURL + "/media/ajax/FileDownload.php?File=" + rowData[0];
    return <td><a href={url} target="_blank">{cell}</a></td>;
  }

  if (column === 'Edit Metadata') {
    var index = rowData.length - 1;
    var url = loris.BaseURL + "/media/edit/?id=" + rowData[index];
    return <td><a href={url}>Edit</a></td>;
  }

  return <td>{cell}</td>;
}
