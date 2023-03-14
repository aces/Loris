/**
 * Return a list of filter objects for the violation module.
 *
 * @param {object} fieldoptions - The dynamic field options
 * @return {array}
 */
export function violationFilters(fieldoptions) {
  let problemtypes = {};
  if (fieldoptions.problemtypes) {
      for (const ptype of fieldoptions.problemtypes) {
          problemtypes[ptype] = ptype;
      }
  }
  return [
    {
      label: 'Patient Name', show: true, filter: {
        name: 'patientName',
        type: 'text',
      },
    },
    {
      label: 'Project', show: true, filter: {
        name: 'project',
        type: 'select',
        options: fieldoptions.projects,
     },
    },
    {
      label: 'Cohort', show: true, filter: {
        name: 'cohort',
        type: 'select',
        options: fieldoptions.cohorts,
     },
    },
    {
      label: 'Site', show: true, filter: {
        name: 'site',
        type: 'select',
        options: fieldoptions.sites,
     },
    },
    {
      label: 'Time Run', show: true, filter: {
        name: 'timeRun',
        type: 'date',
      },
    },
    {
      label: 'Image File', show: true, filter: {
        name: 'mincFile',
        type: 'text',
      },
    },
    {
      label: 'Series Description or Scan Type', show: true, filter: {
        name: 'seriesOrType',
        type: 'text',
      },
    },
    {
      label: 'Type of Problem', show: true, filter: {
        name: 'typeOfProblem',
        type: 'select',
        options: problemtypes,
     },
    },
    {
      label: 'Resolution Status', show: true, filter: {
        name: 'resolutionStatus',
        type: 'select',
        options: {
          'unresolved': 'Unresolved',
          'reran': 'Reran',
          'emailed': 'emailed site/pending',
          'inserted': 'Inserted',
          'rejected': 'Rejected',
          'inserted_flag': 'Inserted with flag',
          'other': 'Other',
        },
      },
    },
    {
      label: 'Series UID', show: false, filter: {
        name: 'seriesUID',
        type: 'text',
      },
    },
    {label: 'hash', show: false},
    {label: 'JoinID', show: false},
    {label: 'TarchiveID', show: false},
    {label: 'CandID', show: false},
    {label: 'PSCID', show: false},

    // Add fake column for resolution dropdown
    {label: 'Select Resolution', show: true},
  ];
}

/**
 * Returns a formatter to handle the violations
 *
 * @param {function} mapper - a data mapper to map from ID to display
 * @param {function} setPage - a callback to set the current page
 * @param {string} resolvePostURL - the URL to send a post request to when
 *                                  a resolution status is selected
 * @return {function} a formatter callback which uses mapper for data mapping
 */
export function formatColumn(mapper, setPage, resolvePostURL) {
    const Mapper = function(column, cell, rowData, rowHeaders) {
        cell = mapper(column, cell);
        // Create the mapping between rowHeaders and rowData in a row object.
        let fontColor = {color: '#FFFFFF'};
        let resolutionStatusStyle;
        let resolutionStatus;

        if (column === 'Type of Problem' && cell === 'Protocol Violation') {
            return (
                    <td>
                    <a href="#" onClick={
                        () => setPage({
                              ViolationType: 'protocolcheck',
                              PatientName: rowData['Patient Name'],
                              SeriesUID: rowData['Series UID'],
                              TarchiveID: rowData['TarchiveID'],
                              CandID: rowData.CandId,
                          })
                    }>Protocol Violation</a>
                    </td>
                   );
        }
        if (
            column === 'Type of Problem' &&
            cell === 'Could not identify scan type'
            ) {
            const seriesDescription
              = rowData['Series Description or Scan Type'];
            return (
                    <td>
                    <a href= "#"
                        onClick={() => setPage({
                              ViolationType: 'protocolviolation',
                              PatientName: rowData['Patient Name'],
                              SeriesUID: rowData['Series UID'],
                              TarchiveID: rowData['TarchiveId'],
                              CandID: rowData.CandID,
                              PSCID: rowData.PSCID,
                              TimeRun: rowData['Time Run'],
                              SeriesDescription: seriesDescription,
                            })}>Could not identify scan type</a>
                    </td>
                   );
        }
        if (column === 'Resolution Status') {
          switch (rowData['Resolution Status']) {
            case 'unresolved':
              fontColor = {color: '#000000'};
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
          }
          return (
            <td className= {resolutionStatusStyle} style={fontColor}>
              {resolutionStatus}
            </td>
          );
        }
        if (column === 'Select Resolution') {
            const hashName = rowData.hash;
            return (
                    <td>
                    <select
                        name={hashName}
                        className="form-control input-sm"
                        id="select-resolution"
                        style={{width: '13em'}}
                        onChange={(e) => {
                            const value = e.target.value;

                            fetch(resolvePostURL,
                            {
                                method: 'POST',
                                mode: 'same-origin',
                                cache: 'no-cache',
                                body: JSON.stringify({
                                    value: value,
                                    hash: hashName,
                                }),
                            });
                          }
                        }
                      >
                      <option value=""> </option>
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
        if (column === 'Image File') {
            let log;
            if (rowData['Type of Problem'] === 'Could not identify scan type') {
                log = 1;
            } else if (rowData['Type of Problem'] === 'Protocol Violation') {
                log = 2;
            } else {
                log = 3;
            }

            let url = loris.BaseURL +
                '/brainbrowser/?minc_id=' + log + 'l' + rowData.JoinID;
            return (
                    <td>
                    <a href={url} target="_blank" >
                    {cell}
                    </a>
                    </td>
                   );
        }
        return (<td>{cell}</td>);
    };
    return Mapper;
}
