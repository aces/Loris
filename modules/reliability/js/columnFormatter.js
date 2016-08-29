'use strict';

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

  if (column === 'PSCID') {
    if (row["Manual Swap"] === 'yes') {
      var url = loris.BaseURL + "/aosi_reliability?identifier=" + row['Visit Label'] + "&reliability_center_id=" + row['Reliability Center Id'];
      return React.createElement(
        'td',
        null,
        cell,
        '',
        React.createElement(
          'span',
          { className: 'error' },
          ' manual'
        ),
        ' '
      );
    }
    if (row["Invalid"] === "yes") {
      return React.createElement(
        'td',
        null,
        cell,
        '',
        React.createElement(
          'span',
          { className: 'error' },
          '  invalid'
        ),
        ' '
      );
    }
    var url = loris.BaseURL + "/aosi_reliability?identifier=" + row['Visit Label'] + "&reliability_center_id=" + row['Reliability Center Id'];
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

  return React.createElement(
    'td',
    null,
    cell
  );
}
