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

  let hashName;
  const patientname = row.PatientName;
  const uid = row.SeriesUID;
  let url;
  let log;

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
  if (column === 'Resolution Status') {
    hashName = 'resolvable[' + row.Hash + ']';
    return (
      <td>
        <select name= {hashName} className="form-control input-sm" id="resolution-status">
          <option value="unresolved" >Unresolved</option>
          <option value="reran" >Reran</option>
          <option value="emailed" >Emailed site/pending</option>
          <option value="inserted" >Inserted</option>
          <option value="rejected" >Rejected</option>
          <option value="inserted_flag" >Inserted with flag</option>
          <option value="other" >Other</option>
        </select>
      </td>
    );
  }
  if (column === 'MincFile') {
    if (row.Problem === 'Could not identify scan type') {
      log = 1;
    } else if (row.Problem === 'Protocol Violation') {
      log = 2;
    } else {
      log = 3;
    }

    url = loris.BaseURL +
            '/brainbrowser/?minc_id=' + log + 'l' + row.JoinID;
    return (
      <td>
        <a href= {url} target="_blank" >
          {cell}
        </a>
      </td>
    );
  }
  return (<td>{cell}</td>);
}

window.formatColumn = formatColumn;

export default formatColumn;
