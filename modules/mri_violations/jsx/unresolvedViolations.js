/**
 * Return a list of filter objects shared between tabs
 *
 * @param {object} fieldoptions - The dynamic field options

 * @return {array}
 */
export function unresolvedFilters(fieldoptions) {
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
      label: 'Subproject', show: true, filter: {
        name: 'subproject',
        type: 'select',
        options: fieldoptions.subprojects,
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
      label: 'Minc File', show: true, filter: {
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
      label: 'Series UID', show: false, filter: {
        name: 'seriesUID',
        type: 'text',
      },
    },
    {label: 'hash ', show: false},
    {label: 'JoinID', show: false},
    {label: 'Resolution Status', show: false},
    {label: 'TarchiveID', show: false},
    {label: 'CandID', show: false},
    {label: 'PSCID', show: false},

    // Add fake column for dropdown
    {label: 'Resolution Status', show: true},
  ];
}

/**
 * Returns a formatter to handle the unresolved violations
 * @param {callback} mapper - a data mapper to map from ID to display

 * @return {*} a formatter callback which uses mapper for data mapping
 */
export function formatColumnUnresolved(mapper) {
    const Mapper = function(column, cell, rowData, rowHeaders) {
        cell = mapper(column, cell);
        // Create the mapping between rowHeaders and rowData in a row object.
        if (column === 'Type of Problem' && cell === 'Protocol Violation') {
            return (
                    <td>
                    <a href= "#"
                    onClick={loris.loadFilteredMenuClickHandler(
                            'mri_violations/mri_protocol_check_violations',
                            {PatientName: rowData['Patient Name'],
SeriesUID: rowData['Series UID'],
TarchiveID: rowData['TarchiveID'],
CandID: rowData.CandId}
)}>Protocol Violation</a>
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
                    onClick={loris.loadFilteredMenuClickHandler(
                            'mri_violations/mri_protocol_violations',
                            {PatientName: rowData['Patient Name'],
SeriesUID: rowData['Series UID'],
TarchiveID: rowData['TarchiveId'],
CandID: rowData.CandID,
PSCID: rowData.PSCID,
TimeRun: rowData['Time Run'],
SeriesDescription: seriesDescription}
)}>Could not identify scan type</a>
                    </td>
                   );
        }
        if (column === 'Resolution Status') {
            const hashName = 'resolvable[' + rowData.hash + ']';
            return (
                    <td>
                    <select
                    name= {hashName}
                    className="form-control input-sm"
                    id="resolution-status"
                    >
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
        if (column === 'Minc File') {
            let log;
            if (cell === 'Could not identify scan type') {
                log = 1;
            } else if (cell === 'Protocol Violation') {
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
