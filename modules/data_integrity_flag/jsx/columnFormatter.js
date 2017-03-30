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
  const row = {};
  rowHeaders.forEach(function(header, index) {
    row[header] = rowData[index];
  }, this);

  if (column === 'Instrument') {
    const url = loris.BaseURL + '/data_team_helper/?visit_label=' +
      row['Visit Label'] + '&instrument=' + row.Instrument;
    return (<td><a href={url}>{cell}</a></td>);
  }

  if (column === 'Flag Status') {
    const statusList = loris.flagStatusList;
    if (Object.keys(statusList).length > 0 && statusList[cell]) {
      return (<td>{statusList[cell]}</td>);
    }
    return (<td>{cell}</td>);
  }

  return (<td>{cell}</td>);
}

export default formatColumn;
