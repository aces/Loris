import React, {useState} from 'react';
import {APIQueryField} from './types';
import {ButtonElement} from 'jsx/Form';
import {QueryGroup} from './querydef';

/**
 * Next steps options for query navigation
 *
 * @param {object} props - React props
 * @param {APIQueryField[]} props.fields - The fields selected
 * @param {QueryGroup} props.filters - The filters selected
 * @param {string} props.page - The current page name
 * @param {function} props.changePage - A function to change the current page
 * @returns {React.ReactElement} - The "Next Steps" menu
 */
function NextSteps(props: {
    fields: APIQueryField[]
    filters: QueryGroup,
    page: string,
    changePage: (newpage: string) => void,
}) {
  const [expanded, setExpanded] = useState(true);
  const steps: React.ReactElement[] = [];


  const canRun = (props.fields && props.fields.length > 0);
  const fieldLabel = (props.fields && props.fields.length > 0)
    ? 'Modify Fields'
    : 'Choose Fields';
  const filterLabel = (props.filters && props.filters.group.length > 0)
    ? 'Modify Filters'
    : 'Add Filters';
  switch (props.page) {
  case 'Info':
    if (canRun) {
      // A previous query was loaded, it can be either
      // modified or run
      steps.push(<ButtonElement
        label={fieldLabel}
        columnSize='col-sm-12'
        key='fields'
        onUserInput={() => props.changePage('DefineFields')}
      />);
      steps.push(<ButtonElement
        label={filterLabel}
        columnSize='col-sm-12'
        key='filters'
        onUserInput={() => props.changePage('DefineFilters')}
      />);
      steps.push(<ButtonElement
        label='Run Query'
        columnSize='col-sm-12'
        key='runquery'
        onUserInput={() => props.changePage('ViewData')}
      />);
    } else {
      // No query loaded, must define fields
      steps.push(<ButtonElement
        label={fieldLabel}
        columnSize='col-sm-12'
        key='fields'
        onUserInput={() => props.changePage('DefineFields')}
      />);
    }
    break;
  case 'DefineFields':
    steps.push(<ButtonElement
      label={filterLabel}
      columnSize='col-sm-12'
      key='filters'
      onUserInput={() => props.changePage('DefineFilters')}
    />);
    if (canRun) {
      steps.push(<ButtonElement
        label='Run Query'
        columnSize='col-sm-12'
        key='runquery'
        onUserInput={() => props.changePage('ViewData')}
      />);
    }
    break;
  case 'DefineFilters':
    if (canRun) {
      steps.push(<ButtonElement
        label='Run Query'
        key='runquery'
        columnSize='col-sm-12'
        onUserInput={() => props.changePage('ViewData')}
      />);
    }
    steps.push(<ButtonElement
      label={fieldLabel}
      key='fields'
      columnSize='col-sm-12'
      onUserInput={() => props.changePage('DefineFields')}
    />);
    break;
  case 'ViewData':
    steps.push(<ButtonElement
      label={fieldLabel}
      key='fields'
      columnSize='col-sm-12'
      onUserInput={() => props.changePage('DefineFields')}
    />);
    steps.push(<ButtonElement
      label={filterLabel}
      key='filters'
      columnSize='col-sm-12'
      onUserInput={() => props.changePage('DefineFilters')}
    />);
    break;
  }

  const expandIcon = <i
    style={{
      fontSize: '2em',
      rotate: expanded ? '270deg' : '90deg',
      color: '#064785',
    }}
    className='fas fa-chevron-left'
  ></i>;
  const style = expanded ? {
    background: 'white',
    padding: '1rem 2rem',
    width: '100%',
  } : {
    display: 'hidden',
    padding: '0rem 2rem',
    height: '0px',
    width: '100%',
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      right: 0,
      borderWidth: 'thin',
      borderStyle: 'solid',
      borderColor: 'black',
      // Fix the height size so it doesn't move when
      // expanded or collapsed
      // Make sure we're on top of the footer
      zIndex: 300,
    }}>
      <div
        style={{display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: expanded ? '16px 3rem 8px' : '16px 3rem',
          cursor: 'pointer',
          backgroundColor: '#fff',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <h3 style={{margin: '0'}}>Next Steps</h3>
        {expandIcon}</div>
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        backgroundColor: '#fff',
      }}>
        <div style={style}>
          <div style={{display: 'flex', justifyContent: 'center', gap: '1rem'}}>
            {steps}
          </div>
        </div>

      </div>
    </div>
  );
}

export default NextSteps;
