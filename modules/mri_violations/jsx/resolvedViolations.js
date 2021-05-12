/**
 * Return a list of filter objects shared between tabs
 *
 * @return {array}
 */
export function resolvedFilters() {
  return [
    {
      label: 'Resolution Status', show: true, filter: {
        name: 'resolutionStatus',
        type: 'select',
        values: {'fixme': 'fieldoption'},
      },
    },
    {
      label: 'Project', show: true, filter: {
        name: 'project',
        type: 'select',
        values: {'fixme': 'fieldoption'},
     },
    },
    {
      label: 'Subproject', show: true, filter: {
        name: 'subproject',
        type: 'select',
        values: {'fixme': 'fieldoption'},
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
        values: {'fixme': 'fieldoption'},
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
        values: {'fixme': 'test'},
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
    {label: 'SiteID', show: false},
  ];
}

/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {array} rowData - array of cell contents for a specific row
 * @param {array} rowHeaders - array of table headers (column names)
 * @return {*} a formated table cell for a given column
 */
export function formatColumnResolved(column, cell, rowData, rowHeaders) {
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
}
