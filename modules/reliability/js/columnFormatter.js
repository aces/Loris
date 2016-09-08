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
    if (row["Manual Swap"] === "yes") {
      return React.createElement(
        "td",
        null,
        cell,
        " ",
        React.createElement(
          "span",
          { className: "error" },
          "(Manual)"
        ),
        " "
      );
    }
    if (row["Invalid"] === 'yes') {
      var url = loris.BaseURL + "/aosi_reliability?identifier=" + row['CommentID'] + "&reliability_center_id=" + row['Reliability Center Id'];
      return React.createElement(
        "td",
        null,
        cell,
        " ",
        React.createElement(
          "span",
          { className: "error" },
          "(Invalid)"
        ),
        " "
      );
    }
    var url = loris.BaseURL + "/aosi_reliability?identifier=" + row['CommentID'] + "&reliability_center_id=" + row['Reliability Center Id'];
    return React.createElement(
      "td",
      null,
      React.createElement(
        "a",
        { href: url },
        cell
      )
    );
  }
  if (column === 'Cohort') {
    if (row['Cohort'] == 1) {
      var sixMonth = "6 month";
      return React.createElement(
        "td",
        null,
        sixMonth
      );
    }
    if (row['Cohort'] == 2) {
      var tweleveMonth = "12 month";
      return React.createElement(
        "td",
        null,
        tweleveMonth
      );
    }
  }

  var reliableStyle = {
    backgroundColor: '#86BC78'
  };
  if (column === 'Reliable') {
    if (row['Reliable'] > 0) {
      return React.createElement(
        "td",
        { style: reliableStyle },
        "Yes"
      );
    }
  }

  return React.createElement(
    "td",
    null,
    cell
  );
}