/* exported formatColumn */

/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {array} rowData - array of cell contents for a specific row
 * @param {array} rowHeaders - array of table headers (column names)
 * @return {*} a formated table cell for a given column
 */
function formatColumn(column, cell, rowData, rowHeaders) {
  if (loris.hiddenHeaders.indexOf(column) > -1) {
    return null;
  }
  // Create the mapping between rowHeaders and rowData in a row object.
  const row = {};
  rowHeaders.forEach(function(header, index) {
    row[header] = rowData[index];
  }, this);
  let resolutionStatusStyle;
  let resolutionStatus;
  const fontColor = {color: '#FFFFFF'};
  const patientname = row.PatientName;
  const uid = row.SeriesUID;

  if (column === 'Resolution Status') {
    switch (row['Resolution Status']) {
      case 'unresolved':
        resolutionStatusStyle = 'label-danger';
        resolutionStatus = 'Unresolved';
        break;

      case 'reran':
        resolutionStatusStyle = 'label-success';
        resolutionStatus = 'Reran';
        break;

      case 'emailed':
        resolutionStatusStyle = 'label-info';
        resolutionStatus = 'Emailed site/pending';
        break;

      case 'rejected':
        resolutionStatusStyle = 'label-danger';
        resolutionStatus = 'Rejected';
        break;

      case 'inserted':
        resolutionStatusStyle = 'label-warning';
        resolutionStatus = 'Inserted';
        break;

      case 'other':
        resolutionStatusStyle = 'label-primary';
        resolutionStatus = 'Other';
        break;

      case 'inserted_flag':
        resolutionStatusStyle = 'label-default';
        resolutionStatus = 'Inserted with flag';
        break;

           /* no default */
    }

    return (
      <td className= {resolutionStatusStyle} style={fontColor}>
        {resolutionStatus}
      </td>
    );
  }
  if (column === 'Problem' && row.Problem === 'Protocol Violation') {
    return (
      <td>
        <a href= "#"
          onClick={loris.loadFilteredMenuClickHandler(
              'mri_violations/mri_protocol_check_violations',
              {PatientName: patientname,
                SeriesUID: uid}
          )}>Protocol Violation</a>
      </td>
    );
  }
  if (column === 'Problem' && row.Problem === 'Could not identify scan type') {
    return (
      <td>
        <a href= "#"
          onClick={loris.loadFilteredMenuClickHandler(
              'mri_violations/mri_protocol_violations',
              {PatientName: patientname,
                SeriesUID: uid}
          )}>Could not identify scan type</a>
      </td>
    );
  }
  return (<td>{cell}</td>);
}

window.formatColumn = formatColumn;

export default formatColumn;
