function formatColumn(column, cell, rowData) {

  if (column === 'File Name') {
    var url = loris.BaseURL + "/videos/ajax/GetFile.php?File=" + rowData[0];
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
    var url = loris.BaseURL + "/videos/edit_video/?id=" + rowData[index];
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
//# sourceMappingURL=columnFormatter.js.map