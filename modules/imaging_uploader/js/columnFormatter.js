'use strict';

/* exported formatColumn */

loris.hiddenHeaders = [];

/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {arrray} rowData - array of cell contents for a specific row
 * @param {arrray} rowHeaders - array of table headers (column names)
 * @return {*} a formated table cell for a given column
 */
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

  // Default cell style
  var cellStyle = {
    whiteSpace: 'nowrap'
  };

  if (column === 'Progress') {
    if (cell === 'Failure') {
      cellStyle.color = '#fff';
      return React.createElement(
        'td',
        { className: 'label-danger', style: cellStyle },
        cell
      );
    }

    if (cell === 'In Progress...') {
      cellStyle.color = '#fff';
      return React.createElement(
        'td',
        { className: 'label-warning', style: cellStyle },
        cell
      );
    }

    var created = row['Number Of MincCreated'];
    var inserted = row['Number Of MincInserted'];
    return React.createElement(
      'td',
      { style: cellStyle },
      cell,
      ' (',
      inserted,
      ' out of ',
      created,
      ')'
    );
  }

  if (column === 'Tarchive Info') {
    var url = loris.BaseURL + '/dicom_archive/viewDetails/?tarchiveID=' + cell;
    return React.createElement(
      'td',
      { style: cellStyle },
      React.createElement(
        'a',
        { href: url },
        'View Details'
      )
    );
  }

  if (column === 'Number Of MincInserted') {
    if (cell > 0) {
      return React.createElement(
        'td',
        { style: cellStyle },
        React.createElement(
          'a',
          { onClick: handleClick.bind(null, row.CandID) },
          cell
        )
      );
    }
  }

  /* Handles clicks on 'Number Of MincInserted' cells */
  function handleClick(dccid, e) {
    loris.loadFilteredMenuClickHandler('imaging_browser', {
      DCCID: dccid
    })(e);
  }

  return React.createElement(
    'td',
    { style: cellStyle },
    cell
  );
}