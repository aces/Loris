"use strict";

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

  var hashName;
  var patientname = row.PatientName;
  var uid = row.SeriesUID;
  var url;

  if (column === "Problem" && row.Problem === "Protocol Violation") {
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
  if (column === 'Resolution Status') {
    hashName = "resolvable[" + row.Hash + "]";
    return React.createElement(
      "td",
      null,
      React.createElement(
        "select",
        { name: hashName, className: "form-control input-sm" },
        React.createElement(
          "option",
          { value: "unresolved" },
          "Unresolved"
        ),
        React.createElement(
          "option",
          { value: "reran" },
          "Reran"
        ),
        React.createElement(
          "option",
          { value: "emailed" },
          "Emailed site/pending"
        ),
        React.createElement(
          "option",
          { value: "inserted" },
          "Inserted"
        ),
        React.createElement(
          "option",
          { value: "rejected" },
          "Rejected"
        ),
        React.createElement(
          "option",
          { value: "inserted_flag" },
          "Inserted with flag"
        ),
        React.createElement(
          "option",
          { value: "other" },
          "Other"
        )
      )
    );
  }
  if (column === "MincFileViolated") {
    url = loris.BaseURL + "/brainbrowser/?minc_location=" + row.MincFileViolated;
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
  return React.createElement(
    "td",
    null,
    cell
  );
}