import {Tabs, TabPane} from 'Tabs';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
// import TriggerableModal from 'TriggerableModal';
import React, {useEffect, useState} from 'react';

import {formatColumnUnresolved, unresolvedFilters}
    from './unresolvedViolations.js';
import {formatColumnResolved, resolvedFilters}
    from './resolvedViolations.js';

import ProtocolModal from './protocolModal.js';


/**
 * Entry point for the MRI Violatons module.
 *
 * @param {object} props - React Component properties
 *
 * @return {ReactDOM}
 */
function MRIViolationsIndex(props) {
  const [fieldOptions, setFieldOptions] = useState({});
  const [violationModal, setViolationModal] = useState(false);
  const tabs = [
    {id: 'notresolved', label: 'Not Resolved'},
    {id: 'resolved', label: 'Resolved'},
  ];

  const mapper = columnMapper(fieldOptions);

  const violationsModal = (violationModal !== false) ?
      <ProtocolModal onClose={() => setViolationModal(false)}
        URL={props.ModuleURL}
        SeriesUID={violationModal.SeriesUID}
        Type={violationModal.ViolationType} /> : null;

  return <div>
      {violationsModal}
      <Tabs tabs={tabs} defaultTab="notresolved" updateURL={true}>
      <TabPane TabId={tabs[0].id}>
        <ViolationsTable
          URL={props.unresolvedURL}
          name="notresolved"
          mapper={mapper}
          formatter={formatColumnUnresolved(
            mapper,
            setViolationModal,
            props.ModuleURL + '/resolve'
         )}
          fields={unresolvedFilters(fieldOptions)}
          setFieldOptions={setFieldOptions}
        />
      </TabPane>
      <TabPane TabId={tabs[1].id}>
        <ViolationsTable
          URL={props.resolvedURL}
          name="resolved"
          formatter={formatColumnResolved(mapper)}
          fields={resolvedFilters(fieldOptions)}
          mapper={mapper}
        />
      </TabPane>
    </Tabs></div>;
}

/**
 * Load a data table and render it
 *
 * @param {object} props - React Component properties
 *
 * @return {ReactDOM}
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
    return <h3>An error occured while loading the page.</h3>;
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
 *
 * @return {callable}
 */
function columnMapper(fieldOptions) {
    return (column, value) => {
        switch (column) {
        case 'Project':
            if (fieldOptions.projects) {
                return fieldOptions.projects[value];
            }
        case 'Subproject':
            if (fieldOptions.subprojects) {
                return fieldOptions.subprojects[value];
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
  ReactDOM.render(
    <MRIViolationsIndex
      ModuleURL={`${loris.BaseURL}/mri_violations/`}
      unresolvedURL={`${loris.BaseURL}/mri_violations/?format=json`}
      resolvedURL={
        `${loris.BaseURL}/mri_violations/resolved_violations?format=json`
      }
    />,
    document.getElementById('lorisworkspace')
  );
});

