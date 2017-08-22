/* exported formatColumn */

/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {arrray} rowData - array of cell contents for a specific row
 * @param {arrray} rowHeaders - array of table headers (column names)
 * @return {*} a formated table cell for a given column
 */
function formatColumn(column, cell, rowData, rowHeaders) {
  if (loris.hiddenHeaders.indexOf(column) > -1) {
    return null;
  }
  // Create the mapping between rowHeaders and rowData in a row object.
  var row = {};
  rowHeaders.forEach(function(header, index) {
    row[header] = rowData[index];
  }, this);

  var hashName;
  var patientname = row.PatientName;
  var uid = row.SeriesUID;
  var url;
  var log;

  if (column === "Problem" && row.Problem === "Protocol Violation") {
    url = loris.BaseURL +
        "/mri_violations/?submenu=mri_protocol_check_violations&PatientName=" +
             patientname + "&SeriesUID=" + uid;
    return (
           <td>
            <a href= {url}
            className="mri_violations"
            id="mri_protocol_check_violations"
            data-patientname= {patientname}
            data-seriesuid={uid}
            >Protocol Violation</a>
           </td>
           );
  }
  if (column === "Problem" && row.Problem === "Could not identify scan type") {
    url = loris.BaseURL +
            "/mri_violations/?submenu=mri_protocol_violations&PatientName=" +
            patientname + "&SeriesUID=" + uid;
    return (
           <td>
            <a href= {url}
            className="mri_violations"
            id="mri_protocol_violations"
            data-patientname= {patientname}
            data-seriesuid={uid}
            >Could not identify scan type</a>
           </td>
           );
  }
  if (column === 'Resolution Status') {
    hashName = "resolvable[" + row.Hash + "]";
    return (
             <td>
                <select name= {hashName} className="form-control input-sm" >
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
  if (column === "MincFile") {
    if (row.Problem === "Could not identify scan type") {
      log = 1;
    } else if (row.Problem === "Protocol Violation") {
      log = 2;
    } else {
      log = 3;
    }

    url = loris.BaseURL +
            "/brainbrowser/?minc_id=" + log + "l" + row.JoinID;
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
