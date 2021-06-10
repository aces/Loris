/**
 * Return a list of filter objects shared between tabs
 *
 * @param {object} fieldoptions - the dynamic field options
 *
 * @return {array}
 */
export function resolvedFilters(fieldoptions) {
  return [
    {
      label: 'Resolution Status', show: true, filter: {
        name: 'resolutionStatus',
        type: 'select',
        options: {
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
      label: 'Patient Name', show: true, filter: {
        name: 'patientName',
        type: 'text',
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
      label: 'Problem', show: true, filter: {
        name: 'problem',
        type: 'select',
        options: {
            'CandID and PSCID do not match database': 'Candidate Mismatch',
            'Could not identify scan type': 'Could not identify scan type',
            'Protocol Violation': 'MRI Protocol Check violation',
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
    {label: 'SiteID', show: false},
  ];
}

/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {callback} mapper - A data mapper for dynamic columns
 * @return {callback} a formated table cell formatter
 */
export function formatColumnResolved(mapper) {
    const Mapper = (column, cell, rowData, rowHeaders) => {
        cell = mapper(column, cell);
        // Create the mapping between rowHeaders and rowData in a row object.
        const fontColor = {color: '#FFFFFF'};
        let resolutionStatusStyle;
        let resolutionStatus;

        if (column === 'Resolution Status') {
            switch (rowData['Resolution Status']) {
                case 'unresolved':
                    resolutionStatusStyle = 'label-danger';
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
        return <td>{cell}</td>;
    };
    return Mapper;
}
