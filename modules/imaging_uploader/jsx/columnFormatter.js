/* exported formatColumn */

loris.hiddenHeaders = ['PatientName'];

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

  // Default cell style
  const cellStyle = {
    whiteSpace: 'nowrap'
  };

  if (column === 'Progress') {
    if (cell === 'Failure') {
      cellStyle.color = '#fff';
      return (
        <td className="label-danger" style={cellStyle}>
          {cell}
        </td>
      );
    }

    if (cell === 'In Progress...') {
      cellStyle.color = '#fff';
      return (
        <td className="label-warning" style={cellStyle}>
          {cell}
        </td>
      );
    }

    const created = row['Number Of MincCreated'];
    const inserted = row['Number Of MincInserted'];
    return (
      <td style={cellStyle}>
        {cell} ({inserted} out of {created})
      </td>
    );
  }

  if (column === 'Tarchive Info') {
    if (!cell || cell === "0") {
      return (<td></td>);
    }

    const url = loris.BaseURL + '/dicom_archive/viewDetails/?tarchiveID=' + cell;
    return (
      <td style={cellStyle}>
        <a href={url}>View Details</a>
      </td>
    );
  }

  if (column === 'Number Of MincInserted') {
    if (cell > 0) {
      return (
        <td style={cellStyle}>
          <a onClick={handleClick.bind(null, row.CandID)}>{cell}</a>
        </td>
      );
    }
  }

  if (column === 'Number Of MincCreated') {
    let violatedScans;
    if (row['Number Of MincCreated'] - row['Number Of MincInserted'] > 0) {
      let numViolatedScans =
           row['Number Of MincCreated'] - row['Number Of MincInserted'];

      let patientName = row.PatientName;
      violatedScans = <a onClick={openViolatedScans.bind(null, patientName)}>
         ({numViolatedScans} violated scans)
       </a>;
    }

    return (
         <td style={cellStyle}>
             {cell}
             &nbsp;
             {violatedScans}
         </td>
    );
  }

  /**
   * Handles clicks on 'Number Of MincInserted' cells
   *
   * @param {string} dccid - dccid
   * @param {object} e - event info
   */
  function handleClick(dccid, e) {
    loris.loadFilteredMenuClickHandler('imaging_browser/', {
      DCCID: dccid
    })(e);
  }

    /**
     * Opens MRI Violations for when there are violated scans
     *
     * @param {string} patientName - Patient name of the form PSCID_DCCID_VisitLabel
     * @param {object} e - event info
     */
  function openViolatedScans(patientName, e) {
    loris.loadFilteredMenuClickHandler('mri_violations/', {
      PatientName: patientName
    })(e);
  }

  return (<td style={cellStyle}>{cell}</td>);
}

export default formatColumn;
