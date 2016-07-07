function formatColumn(column, cell, rowData) {

  // hasWritePermission is defined in menu_media.tpl
  if (column === 'File Name' && hasWritePermission == true) {
    var url = loris.BaseURL + "/media/ajax/FileDownload.php?File=" + rowData[0];
    return React.createElement(
      "td",
      null,
      React.createElement(
        "a",
        { href: url, target: "_blank" },
        cell
      )
    );
  }

  if (column === 'Visit Label') {
    var index = rowData.length - 1;
    if (rowData[index - 1] != null && rowData[index] != null) {
      var url = loris.BaseURL + "/instrument_list/?candID=" + rowData[index - 1] + "&sessionID=" + rowData[index];
      return React.createElement(
        "td",
        null,
        React.createElement(
          "a",
          { href: url },
          cell
        )
      );
    }
  }

  if (column === 'Edit Metadata') {
    var index = rowData.length - 3;
    var url = loris.BaseURL + "/media/edit/?id=" + rowData[index];
    return React.createElement(
      "td",
      null,
      React.createElement(
        "a",
        { href: url },
        "Edit"
      )
    );
  }

  return React.createElement(
    "td",
    null,
    cell
  );
}