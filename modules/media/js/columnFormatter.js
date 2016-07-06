function formatColumn(column, cell, rowData) {

  if (column === 'File Name') {
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

  if (column === 'Edit Metadata') {
    var index = rowData.length - 1;
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