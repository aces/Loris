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

  var fontColor = {color: "#FFFFFF",}
  if (column === 'Resolution Status') {
        switch (row["Resolution Status"]) {
     case "unresolved":
        resolution_status_Style = "label-danger";
        resolution_status ='Unresolved';
        break;
     case "reran":
        resolution_status_Style = "label-success";
        resolution_status ='Reran';
        break;
     case "emailed":
        resolution_status_Style = "label-info";
        resolution_status ='Emailed site/pending';
        break;
     case "rejected":
        resolution_status_Style = "label-danger";
        resolution_status ='Rejected';
        break;
     case "inserted":
        resolution_status_Style = "label-warning";
        resolution_status ='Inserted';
        break;
     case "other":
        resolution_status_Style = "label-primary";
        resolution_status ='Other';
        break;
     case "inserted_flag":
        resolution_status_Style = "label-default";
        resolution_status ='Inserted with flag';
        break;
        }

      return <td className= {resolution_status_Style} style={fontColor}>
                {resolution_status}
             </td>;
  }
   if (column === "Problem" &&  row["Problem"] === "Protocol Violation" ) {
  var patientname = row["PatientName"];
  var uid = row["SeriesUID"];
  var url = loris.BaseURL +
            "/mri_violations/?submenu=mri_protocol_check_violations&PatientName="
            + patientname + "&SeriesUID=" + uid;
     return <td>
            <a href= {url}
            className="mri_violations"
            id="mri_protocol_check_violations" 
            data-patientname= {patientname} 
            data-seriesuid={uid}
            >Protocol Violation</a>
           </td>;      
  }
   if (column === "Problem" &&  row["Problem"] === "Could not identify scan type" ) {
  var patientname = row["PatientName"];
  var uid = row["SeriesUID"];
  var url = loris.BaseURL +
            "/mri_violations/?submenu=mri_protocol_violations&PatientName="
            + patientname + "&SeriesUID=" + uid;
     return <td>
            <a href= {url}
            className="mri_violations"
            id="mri_protocol_violations"
            data-patientname= {patientname}
            data-seriesuid={uid}
            >Could not identify scan type</a>
           </td>;
  } 
 return <td>{cell}</td>;

}
