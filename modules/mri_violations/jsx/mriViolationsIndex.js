import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import ProtocolModal from './protocolModal.js';

/**
 * Entry point for the MRI Violatons module.
 *
 * @param {object} props - React Component properties
 * @return {JSX}
 */
function MRIViolationsIndex(props) {
  const [fieldOptions, setFieldOptions] = useState({});
  const [violationModal, setViolationModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState([]);
  const mapper = columnMapper(fieldOptions);
  const violationsModal = (violationModal !== false) ?
    <ProtocolModal
      onClose={() => setViolationModal(false)}
      URL={props.ModuleURL}
      SeriesUID={violationModal.SeriesUID}
      Type={violationModal.ViolationType}
    /> : null;

  useEffect(() => {
    fetch(props.dataURL)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setData(result.Data);
          if (setFieldOptions) {
              setFieldOptions(result.fieldOptions);
          }
        },
        (error) => {
           setIsError(true);
        }
      );
  }, []);

 /**
  * onResolutionUpdate
  * Callback executed when the resolution
  * status is updated
  *
  * @param {string} value - New resolution status value
  * @param {string} hashname - The violation hash
  */
  const onResolutionUpdate = (value, hashname) => {
    if (value) {
      fetch(props.ModuleURL + '/resolve', {
        method: 'POST',
        mode: 'same-origin',
        cache: 'no-cache',
        body: JSON.stringify({
          value: value,
          hash: hashname,
        }),
      }).then(() => {
        // Update the Resolution Status
        const filtersData = filters(fieldOptions);
        const resolutionStatusfilterIndex = filtersData
          .findIndex(
            (filter) => filter.label === 'Resolution Status'
          );
        const hashfilterIndex = filtersData
          .findIndex((filter) => filter.label === 'hash');
        const dataIndex = data
          .findIndex((row) => row[hashfilterIndex] === hashname);
        const dataCopy = data.map((row) => row.slice());

        dataCopy[dataIndex][resolutionStatusfilterIndex] = value;
        setData(dataCopy);

        // Add animation on the updated row
        const row = document.getElementById(
          `select-resolution-${hashname}`
        ).closest('tr');
        row.classList.add('highlighted');

        setTimeout(() => {
          row.classList.remove('highlighted');
        }, '3500');
      });
    }
  };

 /**
  * Formatter to handle the violations
  *
  * @param {function} mapper - a data mapper to map from ID to display
  * @param {function} setPage - a callback to set the current page
  * @return {function} a formatter callback which uses mapper for data mapping
  */
  const formatColumn = (
    mapper,
    setPage,
  ) => {
    const Mapper = function(column, cell, rowData) {
        cell = mapper(column, cell);
        const hashname = rowData.hash;

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
          const seriesDescription = rowData[
            'Series Description or Scan Type'
          ];
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
                })}
              >Could not identify scan type</a>
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
            <td className={resolutionStatusStyle} style={fontColor}>
              {resolutionStatus}
            </td>
          );
        }
        if (column === 'Select Resolution') {
          return (
            <td>
              <select
                name={hashname}
                className="form-control input-sm"
                id={`select-resolution-${hashname}`}
                style={{width: '13em'}}
                onChange={(e) => {
                  const value = e.target.value;
                  onResolutionUpdate(value, hashname);
                }}
              >
                <option value=""> </option>
                <option value="unresolved">Unresolved</option>
                <option value="reran">Reran</option>
                <option value="emailed">Emailed site/pending</option>
                <option value="inserted">Inserted</option>
                <option value="rejected">Rejected</option>
                <option value="inserted_flag">Inserted with flag</option>
                <option value="other">Other</option>
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
            '/brainbrowser/?minc_id=' +
            log +
            'l' +
            rowData.JoinID;
          return (
            <td>
              <a href={url} target="_blank">{cell}</a>
            </td>
          );
        }
        return (<td>{cell}</td>);
    };
    return Mapper;
  };

/**
 * List of filter objects
 *
 * @param {object} fieldoptions - The dynamic field options
 * @return {array}
 */
const filters = (fieldoptions) => {
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
          type: 'datetime',
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
  };

  return (
    <div>
      {violationsModal}
      {!isLoaded ?
        <Loader/> :
        isError ?
          <h3>An error occurred while loading the page.</h3> :
        <FilterableDataTable
          name="violations"
          data={data}
          fields={filters(fieldOptions)}
          getFormattedCell={formatColumn(
            mapper,
            setViolationModal
          )}
          getMappedCell={mapper}
        />
      }
    </div>
  );
}

MRIViolationsIndex.propTypes = {
  ModuleURL: PropTypes.string,
  SeriesUID: PropTypes.string,
  dataURL: PropTypes.string,
};

/**
 * A helper to generate a column mapper callback which maps fieldOptions
 * to values.
 *
 * @param {object} fieldOptions - the dynamic field options
 * @return {function}
 */
function columnMapper(fieldOptions) {
  return (column, value) => {
    switch (column) {
    case 'Project':
      if (fieldOptions.projects) {
          return fieldOptions.projects[value];
      }
      break;
    case 'Cohort':
      if (fieldOptions.cohorts) {
          return fieldOptions.cohorts[value];
      }
      break;
    case 'Site':
      if (fieldOptions.sites) {
          return fieldOptions.sites[value];
      }
      break;
    }
    return value;
  };
}

window.addEventListener('load', () => {
  ReactDOM.createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <MRIViolationsIndex
      ModuleURL={`${loris.BaseURL}/mri_violations/`}
      dataURL={`${loris.BaseURL}/mri_violations/?format=json`}
    />,
  );
});

