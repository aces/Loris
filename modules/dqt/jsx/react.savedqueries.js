/*
 *  The following component is for saved queries dropdown
 *  which appears in the tab bar of the base component.
 */
import React from 'react';
import PropTypes from 'prop-types';

const SavedQueriesList = (props) => {

  const loadQuery = (queryName) => {
    // Loads in the selected query
    props.onSelectQuery(
      props.queryDetails[queryName].Fields,
      props.queryDetails[queryName].Conditions
    );
  };

  if (props.queriesLoaded === false) {
    return null;
  }

  // Renders the html for the component
  let globalSaved = [];
  let queryName, curQuery;

  // Build the list for the global queries
  for (let i = 0; i < props.globalQueries.length; i += 1) {
    curQuery = props.queryDetails[props.globalQueries[i]];
    queryName = (curQuery.Meta && curQuery.Meta.name)
      ? curQuery.Meta.name
      : props.globalQueries[i];
    globalSaved.push(
      <div key={props.globalQueries[i]}>
        <a href='#' onClick={() => loadQuery(props.globalQueries[i])}>
          {queryName}
        </a>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{
        color: 'rgb(10, 53, 114)',
        textAlign: 'center',
        paddingTop: '0'
      }}>Shared Saved Queries</h2>
      {globalSaved}
    </div>
  );
};
SavedQueriesList.propTypes = {
  queryDetails: PropTypes.object,
  queriesLoaded: PropTypes.bool,
};
SavedQueriesList.defaultProps = {
  queryDetails: {},
  queriesLoaded: false,
};

export default SavedQueriesList;
