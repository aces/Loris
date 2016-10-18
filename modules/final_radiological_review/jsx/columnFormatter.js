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
  var url;
  var reviewDone;
  var finalizedvar;
  var sas;
  var pvs;
  if (column === 'PSCID') {
    url = loris.BaseURL +
      "/final_radiological_review/final_radiological_review/?identifier=" +
      row.CommentID;
    return <td>
                <a href ={url}>{cell}</a>
             </td>;
  }
  if (column === 'Review Done') {
    reviewDone = " ";

    if (row.ReviewDone === '1') {
      reviewDone = 'Yes';
    }

    if (row.ReviewDone === '0') {
      reviewDone = 'No';
    }
    return <td>{reviewDone}</td>;
  }

  if (column === 'SAS') {
    switch (row.SAS) {
      case "0":
        sas = "None";
        break;
      case "1":
        sas = "Minimal";
        break;
      case "2":
        sas = "Mild";
        break;
      case "3":
        sas = "Moderate";
        break;
      case "4":
        sas = "Marked";
        break;
      default:
        sas = "Not Answered";

    }

    return <td>{sas}</td>;
  }

  if (column === 'PVS') {
    switch (row.PVS) {
      case "0":
        pvs = "None";
        break;
      case "1":
        pvs = "Minimal";
        break;
      case "2":
        pvs = "Mild";
        break;
      case "3":
        pvs = "Moderate";
        break;
      case "4":
        pvs = "Marked";
        break;
      default:
        pvs = "Not Answered";

    }
    return <td>{pvs}</td>;
  }
  if (column === 'Finalized') {
    if (row.Finalized === '1') {
      finalizedvar = "Yes";
    }

    if (row.Finalized === '0') {
      finalizedvar = "No";
    }
    return <td>{finalizedvar}</td>;
  }

  return <td>{cell}</td>;
}

