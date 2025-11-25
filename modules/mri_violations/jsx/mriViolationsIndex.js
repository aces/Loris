import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import ProtocolModal from './protocolModal.js';
import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import hiStrings from '../locale/hi/LC_MESSAGES/mri_violations.json';
import jaStrings from '../locale/ja/LC_MESSAGES/mri_violations.json';
import frStrings from '../locale/fr/LC_MESSAGES/mri_violations.json';
import esStrings from '../locale/es/LC_MESSAGES/mri_violations.json';

/**
 * Entry point for the MRI Violatons module.
 *
 * @param  {object} props - React Component properties
 * @return  {JSX}
 */
function MRIViolationsIndex(props) {
  const [fieldOptions, setFieldOptions] = useState({});
  const [violationModal, setViolationModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState([]);
  const mapper = columnMapper(fieldOptions);
  const {t} = props;

  const violationsModal =
    violationModal !== false ? (
      <ProtocolModal
        onClose={() => setViolationModal(false)}
        URL={props.ModuleURL}
        SeriesUID={violationModal.SeriesUID}
        Type={violationModal.ViolationType}
      />
    ) : null;

  useEffect(
    () => {
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
          },
        );
    }, []
  );

  /**
   * OnResolutionUpdate
   * Callback executed when the resolution
   * status is updated
   *
   * @param {string} value - New resolution status value
   * @param {string} hashname - The violation hash
   */
  const onResolutionUpdate = (value, hashname) => {
    if (value) {
      fetch(
        props.ModuleURL + '/resolve', {
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
        const resolutionStatusfilterIndex = filtersData.findIndex(
          (filter) =>
            filter.label === t('Resolution Status', {ns: 'mri_violations'}),
        );
        const hashfilterIndex = filtersData.findIndex(
          (filter) => filter.label === 'hash',
        );
        const dataIndex = data.findIndex(
          (row) => row[hashfilterIndex] === hashname,
        );
        const dataCopy = data.map((row) => row.slice());

        dataCopy[dataIndex][resolutionStatusfilterIndex] = value;
        setData(dataCopy);

        // Add animation on the updated row
        const row = document
          .getElementById(`select-resolution-${hashname}`)
          .closest('tr');
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
  const formatColumn = (mapper, setPage) => {
    const Mapper = function(column, cell, rowData) {
      cell = mapper(column, cell);
      const hashname = rowData.hash;
      const labelTypeOfProblem = t('Type of Problem', {ns: 'mri_violations'});
      const labelProtocolViolation = t('Protocol Violation', {
        ns: 'mri_violations',
      });
      const labelCouldNotIdentifyScanType = t('Could not identify scan type', {
        ns: 'mri_violations',
      });
      const labelResolutionStatus = t('Resolution Status', {
        ns: 'mri_violations',
      });
      const labelSelectResolution = t('Select Resolution', {
        ns: 'mri_violations',
      });
      const labelImageFile = t('Image File', {ns: 'mri_violations'});
      const labelSeriesDescriptionOrScanType = t(
        'Series Description or Scan Type',
        {ns: 'mri_violations'},
      );

      // Create the mapping between rowHeaders and rowData in a row object.
      let fontColor = {color: '#FFFFFF'};
      let resolutionStatusStyle;
      let resolutionStatus;

      if (
        (column === 'Type of Problem' || column === labelTypeOfProblem) &&
        (cell === 'Protocol Violation' || cell === labelProtocolViolation)
      ) {
        return (
          <td>
            <a
              href="#"
              onClick={() =>
                setPage({
                  ViolationType: 'protocolcheck',
                  PatientName: rowData[t('Patient Name', {ns: 'mri_violations'})],
                  SeriesUID: rowData[t('Series UID', {ns: 'mri_violations'})],
                  TarchiveID: rowData[t('TarchiveID', {ns: 'mri_violations'})],
                  CandID: rowData.CandID,
                })
              }
            >
              {labelProtocolViolation}
            </a>
          </td>
        );
      }

      if (
        (column === 'Type of Problem' || column === labelTypeOfProblem) &&
        (cell === 'Could not identify scan type' ||
          cell === labelCouldNotIdentifyScanType)
      ) {
        const seriesDescription = rowData[labelSeriesDescriptionOrScanType];
        return (
          <td>
            <a
              href="#"
              onClick={() =>
                setPage({
                  ViolationType: 'protocolviolation',
                  PatientName: rowData[t('Patient Name', {ns: 'mri_violations'})],
                  SeriesUID: rowData[t('Series UID', {ns: 'mri_violations'})],
                  TarchiveID: rowData[t('TarchiveID', {ns: 'mri_violations'})],
                  CandID: rowData.CandID,
                  PSCID: rowData.PSCID,
                  TimeRun: rowData[t('Time Run', {ns: 'mri_violations'})],
                  SeriesDescription: seriesDescription,
                })
              }
            >
              {labelCouldNotIdentifyScanType}
            </a>
          </td>
        );
      }

      if (column === 'Resolution Status' || column === labelResolutionStatus) {
        switch (rowData[labelResolutionStatus]) {
        case 'unresolved':
          fontColor = {color: '#000000'};
          resolutionStatus = t('Unresolved', {ns: 'mri_violations'});
          break;

        case 'reran':
          resolutionStatusStyle = 'label-success';
          resolutionStatus = t('Reran', {ns: 'mri_violations'});
          break;

        case 'emailed':
          resolutionStatusStyle = 'label-info';
          resolutionStatus = t('Emailed site/pending', {
            ns: 'mri_violations',
          });
          break;

        case 'rejected':
          resolutionStatusStyle = 'label-danger';
          resolutionStatus = t('Rejected', {ns: 'mri_violations'});
          break;

        case 'inserted':
          resolutionStatusStyle = 'label-warning';
          resolutionStatus = t('Inserted', {ns: 'mri_violations'});
          break;

        case 'other':
          resolutionStatusStyle = 'label-primary';
          resolutionStatus = t('Other', {ns: 'mri_violations'});
          break;

        case 'inserted_flag':
          resolutionStatusStyle = 'label-default';
          resolutionStatus = t('Inserted with flag', {
            ns: 'mri_violations',
          });
          break;
        }
        return (
          <td className={resolutionStatusStyle} style={fontColor}>
            {resolutionStatus}
          </td>
        );
      }
      if (column === 'Select Resolution' || column === labelSelectResolution) {
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
              <option value="unresolved">
                {t('Unresolved', {ns: 'mri_violations'})}
              </option>
              <option value="reran">
                {t('Reran', {ns: 'mri_violations'})}
              </option>
              <option value="emailed">
                {t('Emailed site/pending', {ns: 'mri_violations'})}
              </option>
              <option value="inserted">
                {t('Inserted', {ns: 'mri_violations'})}
              </option>
              <option value="rejected">
                {t('Rejected', {ns: 'mri_violations'})}
              </option>
              <option value="inserted_flag">
                {t('Inserted with flag', {ns: 'mri_violations'})}
              </option>
              <option value="other">
                {t('Other', {ns: 'mri_violations'})}
              </option>
            </select>
          </td>
        );
      }
      if (column === 'Image File' || column === labelImageFile) {
        let log;
        if (rowData[labelTypeOfProblem] === 'Could not identify scan type') {
          log = 1;
        } else if (rowData[labelTypeOfProblem] === 'Protocol Violation') {
          log = 2;
        } else {
          log = 3;
        }

        let url =
          loris.BaseURL +
          '/brainbrowser/?minc_id=' +
          log +
          'l' +
          rowData.JoinID;
        return (
          <td>
            <a href={url} target="_blank">
              {cell}
            </a>
          </td>
        );
      }
      return <td>{cell}</td>;
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
        label: t('Patient Name', {ns: 'mri_violations'}),
        show: true,
        filter: {
          name: 'patientName',
          type: 'text',
        },
      },
      {
        label: t('Project', {ns: 'loris', count: 1}),
        show: true,
        filter: {
          name: 'project',
          type: 'select',
          options: fieldoptions.projects,
        },
      },
      {
        label: t('Cohort', {ns: 'loris', count: 1}),
        show: true,
        filter: {
          name: 'cohort',
          type: 'select',
          options: fieldoptions.cohorts,
        },
      },
      {
        label: t('Site', {ns: 'loris', count: 1}),
        show: true,
        filter: {
          name: 'site',
          type: 'select',
          options: fieldoptions.sites,
        },
      },
      {
        label: t('Time Run', {ns: 'mri_violations'}),
        show: true,
        filter: {
          name: 'timeRun',
          type: 'datetime',
        },
      },
      {
        label: t('Image File', {ns: 'mri_violations'}),
        show: true,
        filter: {
          name: 'mincFile',
          type: 'text',
        },
      },
      {
        label: t('Series Description or Scan Type', {ns: 'mri_violations'}),
        show: true,
        filter: {
          name: 'seriesOrType',
          type: 'text',
        },
      },
      {
        label: t('Type of Problem', {ns: 'mri_violations'}),
        show: true,
        filter: {
          name: 'typeOfProblem',
          type: 'select',
          options: problemtypes,
        },
      },
      {
        label: t('Resolution Status', {ns: 'mri_violations'}),
        show: true,
        filter: {
          name: 'resolutionStatus',
          type: 'select',
          options: {
            unresolved: t('Unresolved', {ns: 'mri_violations'}),
            reran: t('Reran', {ns: 'mri_violations'}),
            emailed: t('Emailed site/pending', {ns: 'mri_violations'}),
            inserted: t('Inserted', {ns: 'mri_violations'}),
            rejected: t('Rejected', {ns: 'mri_violations'}),
            inserted_flag: t('Inserted with flag', {ns: 'mri_violations'}),
            other: t('Other', {ns: 'mri_violations'}),
          },
        },
      },
      {
        label: t('Series UID', {ns: 'mri_violations'}),
        show: false,
        filter: {
          name: 'seriesUID',
          type: 'text',
        },
      },
      {label: t('hash', {ns: 'mri_violations'}), show: false},
      {label: t('JoinID', {ns: 'mri_violations'}), show: false},
      {label: t('TarchiveID', {ns: 'mri_violations'}), show: false},
      {label: t('CandID', {ns: 'loris'}), show: false},
      {label: t('PSCID', {ns: 'loris'}), show: false},

      // Add fake column for resolution dropdown
      {label: t('Select Resolution', {ns: 'mri_violations'}), show: true},
    ];
  };

  return (
    <div>
      {violationsModal}
      {!isLoaded ? (
        <Loader />
      ) : isError ? (
        <h3>
          {t('An error occurred while loading the page.', {
            ns: 'mri_violations',
          })}
        </h3>
      ) : (
        <FilterableDataTable
          name="violations"
          data={data}
          fields={filters(fieldOptions)}
          getFormattedCell={formatColumn(mapper, setViolationModal)}
          getMappedCell={mapper}
        />
      )}
    </div>
  );
}

MRIViolationsIndex.propTypes = {
  ModuleURL: PropTypes.string,
  SeriesUID: PropTypes.string,
  dataURL: PropTypes.string,
  t: PropTypes.func,
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
  i18n.addResourceBundle('hi', 'mri_violations', hiStrings);
  i18n.addResourceBundle('ja', 'mri_violations', jaStrings);
  i18n.addResourceBundle('fr', 'mri_violations', frStrings);
  i18n.addResourceBundle('es', 'mri_violations', esStrings);

  const ViolationsIndex = withTranslation(['mri_violations', 'loris'])(
    MRIViolationsIndex,
  );

  ReactDOM.createRoot(document.getElementById('lorisworkspace')).render(
    <ViolationsIndex
      ModuleURL={`${loris.BaseURL}/mri_violations/`}
      dataURL={`${loris.BaseURL}/mri_violations/?format=json`}
    />,
  );
});
