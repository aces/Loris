import {Tabs, TabPane} from 'Tabs';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
// import TriggerableModal from 'TriggerableModal';
import React, {useEffect, useState} from 'react';

import {formatColumnUnresolved, unresolvedFilters}
    from './unresolvedViolations.js';
import {formatColumnResolved, resolvedFilters}
    from './resolvedViolations.js';


/**
 * Entry point for the MRI Violatons module.
 *
 * @param {object} props - React Component properties
 *
 * @return {ReactDOM}
 */
function MRIViolationsIndex(props) {
  const tabs = [
    {id: 'notresolved', label: 'Not Resolved'},
    {id: 'resolved', label: 'Resolved'},
  ];

  return <Tabs tabs={tabs} defaultTab="notresolved" updateURL={true}>
      <TabPane TabId={tabs[0].id}>
        <ViolationsTable
          URL={props.unresolvedURL}
          name="notresolved"
          formatter={formatColumnUnresolved}
          fields={unresolvedFilters()}
        />
      </TabPane>
      <TabPane TabId={tabs[1].id}>
        <ViolationsTable
          URL={props.resolvedURL}
          name="resolved"
          formatter={formatColumnResolved}
          fields={resolvedFilters()}
        />
      </TabPane>
    </Tabs>;
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
        />;
}

window.addEventListener('load', () => {
  ReactDOM.render(
    <MRIViolationsIndex
      unresolvedURL={`${loris.BaseURL}/mri_violations/?format=json`}
      resolvedURL={
        `${loris.BaseURL}/mri_violations/resolved_violations?format=json`
      }
    />,
    document.getElementById('lorisworkspace')
  );
});
