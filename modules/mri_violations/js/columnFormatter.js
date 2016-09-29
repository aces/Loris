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
  rowHeaders.forEach(function (header, index) {
    row[header] = rowData[index];
  }, this);
  var resolutionStatusStyle;
  var resolutionStatus;
  var fontColor = { color: "#FFFFFF" };
  var patientname;
  var uid;
  var url;

  if (column === 'Resolution Status') {
    switch (row["Resolution Status"]) {
      case "unresolved":
        resolutionStatusStyle = "label-danger";
        resolutionStatus = 'Unresolved';
        break;

      case "reran":
        resolutionStatusStyle = "label-success";
        resolutionStatus = 'Reran';
        break;

      case "emailed":
        resolutionStatusStyle = "label-info";
        resolutionStatus = 'Emailed site/pending';
        break;

      case "rejected":
        resolutionStatusStyle = "label-danger";
        resolutionStatus = 'Rejected';
        break;

      case "inserted":
        resolutionStatusStyle = "label-warning";
        resolutionStatus = 'Inserted';
        break;

      case "other":
        resolutionStatusStyle = "label-primary";
        resolutionStatus = 'Other';
        break;

      case "inserted_flag":
        resolutionStatusStyle = "label-default";
        resolutionStatus = 'Inserted with flag';
        break;

      /* no default */

    }

    return React.createElement(
      "td",
      { className: resolutionStatusStyle, style: fontColor },
      resolutionStatus
    );
  }
  if (column === "Problem" && row.Problem === "Protocol Violation") {
    patientname = row.PatientName;
    uid = row.SeriesUID;
    url = loris.BaseURL + "/mri_violations/?submenu=mri_protocol_check_violations&PatientName=" + patientname + "&SeriesUID=" + uid;
    return React.createElement(
      "td",
      null,
      React.createElement(
        "a",
        { href: url,
          className: "mri_violations",
          id: "mri_protocol_check_violations",
          "data-patientname": patientname,
          "data-seriesuid": uid
        },
        "Protocol Violation"
      )
    );
  }
  if (column === "Problem" && row.Problem === "Could not identify scan type") {
    patientname = row.PatientName;
    uid = row.SeriesUID;
    url = loris.BaseURL + "/mri_violations/?submenu=mri_protocol_violations&PatientName=" + patientname + "&SeriesUID=" + uid;
    return React.createElement(
      "td",
      null,
      React.createElement(
        "a",
        { href: url,
          className: "mri_violations",
          id: "mri_protocol_violations",
          "data-patientname": patientname,
          "data-seriesuid": uid
        },
        "Could not identify scan type"
      )
    );
  }
  return React.createElement(
    "td",
    null,
    cell
  );
}