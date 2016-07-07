function formatColumn(column, cell, rowData) {

  // hasWritePermission is defined in menu_media.tpl
  if (column === 'File Name' && hasWritePermission == true) {
    var url = loris.BaseURL + "/media/ajax/FileDownload.php?File=" + rowData[0];
    return <td><a href={url} target="_blank">{cell}</a></td>;
  }

  if (column === 'Visit Label') {
    var index = rowData.length - 1;
    if (rowData[index - 1] != null && rowData[index] != null) {
      var url = loris.BaseURL + "/instrument_list/?candID=" + rowData[index - 1]  + "&sessionID=" + rowData[index];
      return <td><a href={url}>{cell}</a></td>;
    }
  }

  if (column === 'Edit Metadata') {
    var index = rowData.length - 3;
    var url = loris.BaseURL + "/media/edit/?id=" + rowData[index];
    return <td><a href={url}>Edit</a></td>;
  }

  return <td>{cell}</td>;
}
