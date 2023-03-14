import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import React, {useEffect, useState} from 'react';

import {formatColumn, violationFilters} from './violations.js';

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
  const [modifiedColumns, setModifiedColumns] = useState({});

  const mapper = columnMapper(fieldOptions);

  const violationsModal = (violationModal !== false) ?
      <ProtocolModal onClose={() => setViolationModal(false)}
        URL={props.ModuleURL}
        SeriesUID={violationModal.SeriesUID}
        Type={violationModal.ViolationType} /> : null;

  return <div>
      {violationsModal}
      <ViolationsTable
        URL={props.dataURL}
        name="violations"
        mapper={mapper}
        formatter={formatColumn(
          mapper,
          setViolationModal,
          props.ModuleURL + '/resolve',
          (hashname) => {
              let newColumns = {...modifiedColumns};
              newColumns[hashname] = true;
              setModifiedColumns(newColumns);
          },
          modifiedColumns,
        )}
        fields={violationFilters(fieldOptions)}
        setFieldOptions={setFieldOptions}
      />
  </div>;
}

/**
 * Load a data table and render it
 *
 * @param {object} props - React Component properties
 * @return {JSX}
 */
function ViolationsTable(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(props.URL)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setData(result.Data);
          if (props.setFieldOptions) {
              props.setFieldOptions(result.fieldOptions);
          }
        },
        (error) => {
           setIsError(true);
        }
      );
  }, [props.name]);

  if (isError) {
    return <h3>An error occurred while loading the page.</h3>;
  }

  if (!isLoaded) {
    return <Loader/>;
  }
  return <FilterableDataTable
          name={props.name}
          data={data}
          fields={props.fields}
          getFormattedCell={props.formatter}
          getMappedCell={props.mapper}
        />;
}

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
        case 'Cohort':
            if (fieldOptions.cohorts) {
                return fieldOptions.cohorts[value];
            }
        case 'Site':
            if (fieldOptions.sites) {
                return fieldOptions.sites[value];
            }
        }
        return value;
    };
}

window.addEventListener('load', () => {
  const root = ReactDOM.createRoot(document.getElementById('lorisworkspace'));
  root.render(
    <MRIViolationsIndex
      ModuleURL={`${loris.BaseURL}/mri_violations/`}
      dataURL={`${loris.BaseURL}/mri_violations/?format=json`}
    />,
  );
});

