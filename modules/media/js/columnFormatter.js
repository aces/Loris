function formatColumn(column, cell, rowData, rowHeaders) {

  // If a column if set as hidden, don't display it
  if (loris.hiddenHeaders.indexOf(column) > -1) {
    return null;
  }

  // Create the mapping between rowHeaders and rowData in a row object.
  var row = {};
  rowHeaders.forEach(function (header, index) {
    row[header] = rowData[index];
  }, this);

  // hasWritePermission is defined in menu_media.tpl
  if (column === 'File Name' && hasWritePermission == true) {
    var url = loris.BaseURL + "/media/ajax/FileDownload.php?File=" + row['File Name'];
    return React.createElement(
      'td',
      null,
      React.createElement(
        'a',
        { href: url, target: '_blank' },
        cell
      )
    );
  }

  if (column === 'Visit Label') {
    if (row["Cand ID"] != null && row["Session ID"]) {
      var url = loris.BaseURL + "/instrument_list/?candID=" + row["Cand ID"] + "&sessionID=" + row["Session ID"];
      return React.createElement(
        'td',
        null,
        React.createElement(
          'a',
          { href: url },
          cell
        )
      );
    }
  }

  if (column === 'Edit Metadata') {
    var url = loris.BaseURL + "/media/edit/?id=" + row['Edit Metadata'];
    return React.createElement(
      'td',
      null,
      React.createElement(
        'a',
        { href: url },
        'Edit'
      )
    );
  }

  return React.createElement(
    'td',
    null,
    cell
  );
}