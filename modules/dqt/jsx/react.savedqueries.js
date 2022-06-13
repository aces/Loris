/*
 *  The following component is for saved queries dropdown
 *  which appears in the tab bar of the base component.
 */
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

const ManageSavedQueryFilters = (props) => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    let filterItem;
    let filter = props.filterItem;
    if (filter.activeOperator) {
      let children = filter.children.map((element, key) => {
        return <ManageSavedQueryFilters
          filterItem={element}
        />;
      });
      let logicOp = filter.activeOperator === 1
        ? 'OR'
        : 'AND';
      setContent(
        <li>
          <span>{logicOp}</span>
          <ul className='savedQueryTree'>
            {children}
          </ul>
        </li>
      );
    } else {
      filter = props.filterItem;
      if (filter.instrument) {
        let operator;
        switch (filter.operator) {
          case 'equal':
            operator = '=';
            break;
          case 'notEqual':
            operator = '!=';
            break;
          case 'lessThanEqual':
            operator = '<=';
            break;
          case 'greaterThanEqual':
            operator = '>=';
            break;
          default:
            operator = filter.operator;
            break;
        }
        filterItem = (
          <span>{filter.instrument},
            {filter.field} {operator} {filter.value}</span>
        );
      } else {
        filterItem = (
          <span>{filter.Field} {filter.Operator} {filter.Value}</span>
        );
      }
    }
    setContent(
      <li>{filterItem}</li>
    );
  }, []);

  return content;
};

const ManageSavedQueryRow = (props) => {
  const [fieldsVisible, setFields] = useState(null);
  const [filtersVisible, setFilters] = useState(null);

  useEffect(() => {
    let fields = [];
    let filters = [];
    if (props.Query.Fields && Array.isArray(props.Query.Fields)) {
      for (let i = 0; i < props.Query.Fields.length; i += 1) {
        fields.push(<li key={i}>{props.Query.Fields[i]}</li>);
      }
    } else if (props.Query.Fields) {
      for (let instrument in props.Query.Fields) {
        if (props.Query.Fields.hasOwnProperty(instrument)) {
          for (let field in props.Query.Fields[instrument]) {
            if (props.Query.Fields[instrument].hasOwnProperty(field)) {
              if (props.Query.Fields[instrument].hasOwnProperty(field)
                && field !== 'allVisits'
              ) {
                fields.push(
                  <li key={instrument + field + '_shared'}>
                    {instrument},{field}
                  </li>
                );
              }
            }
          }
        }
      }
    }

    if (fields.length === 0) {
      fields.push(<li key={'no_fields_defined'}>No fields defined</li>);
    }

    if (props.Query.Conditions) {
      let operator;
      let filter;
      if (props.Query.Conditions.activeOperator) {
        if (props.Query.Conditions.children) {
          if (props.Query.Conditions.activeOperator === '0') {
            operator = (<span>AND</span>);
          } else {
            operator = (<span>OR</span>);
          }
          filter = props.Query.Conditions.children.map((element, key) => {
            return (
              <ManageSavedQueryFilters
                key={key}
                filterItem={element}
              />
            );
          });
        } else {
          operator = (<span>No filters defined</span>);
        }
      } else {
        if (props.Query.Conditions.length === 0) {
          operator = (<span>No filters defined</span>);
        } else {
          operator = (<span>AND</span>);
          filter = props.Query.Conditions.map((element, key) => {
            return (
              <ManageSavedQueryFilters
                key={key}
                filterItem={element}
              />
            );
          });
        }
      }
      filters = (
        <div className='tree'>
          <ul className='firstUL savedQueryTree'>
            <li>
              {operator}
              <ul className='savedQueryTree'>
                {filter}
              </ul>
            </li>
          </ul>
        </div>
      );
    }
    if (!filters) {
      filters = (<strong>No filters defined</strong>);
    }
    setFilters(filters);
    setFields(fields);
  }, []);

  return (
    <tr>
      <td>
        <div className={'tableNamesCell'}>
          {props.Name}
        </div>
      </td>
      <td>
        <div className={'tableFieldsCell'}>
          <ul>{fieldsVisible}</ul>
        </div>
      </td>
      <td>
        <div className={'tableFiltersCell'}>
          {filtersVisible}
        </div>
      </td>
    </tr>
  );
};

ManageSavedQueryRow.propTypes = {
  Name: PropTypes.object,
  Query: PropTypes.object,
};

ManageSavedQueryRow.defaultProps = {
  Name: null,
  Query: {
    Fields: [],
  },
};

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
  let queryRows = [];
  if (props.queriesLoaded && props.globalQueries) {
    for (let i = 0; i < props.globalQueries.length; i += 1) {
      let query = props.queryDetails[props.globalQueries[i]];
      let name = 'Unnamed Query: ' + props.globalQueries[i];
      if (query.Meta.name) {
        name = query.Meta.name;
      }
      const queryName = (
        <a href='#' onClick={() => loadQuery(props.globalQueries[i])}>
          {name}
        </a>
      );
      queryRows.push(
        <ManageSavedQueryRow key={name}
                             Name={queryName}
                             Query={query}
        />
      );
    }
  } else {
    queryRows.push(
      <tr key='loading'>
        <td colSpan='3'>Loading saved query details</td>
      </tr>
    );
  }

  return (
    <>
      <h2 style={{
        color: 'rgb(10, 53, 114)',
        textAlign: 'center',
        paddingTop: '0',
      }}>Shared Saved Queries</h2>
      <table className='table table-hover table-primary
       table-bordered colm-freeze'>
        <thead>
        <tr key='info' className='info'>
          <th>Query Name</th>
          <th>Fields</th>
          <th>Filters</th>
        </tr>
        </thead>
        <tbody>
        {queryRows}
        </tbody>
      </table>
    </>
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

