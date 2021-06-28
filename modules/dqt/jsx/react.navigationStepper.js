import React from 'react';
import PropTypes from 'prop-types';

import {Stepper} from './components/stepper';

const NavigationStepper = (props) => {
  const mySteps = ['Info', 'DefineFields', 'DefineFilters', 'ViewData'];
  const steps = [
    {
      title: 'Create or Load',
      onClick: (e) => {
        e.preventDefault();
        props.stepperClicked('Info', 0);
      },
    },
    {
      title: 'Define Fields',
      onClick: (e) => {
        e.preventDefault();
        props.stepperClicked('DefineFields', 1);
      },
    },
    {
      title: 'Define Filters (Optional)',
      onClick: (e) => {
        e.preventDefault();
        props.stepperClicked('DefineFilters', 2);
      },
    },
    {
      title: 'Run Query',
      onClick: (e) => {
        e.preventDefault();
        props.stepperClicked('ViewData', 3);
      },
    },
  ];
  return (
    <Stepper
      steps={steps}
      activeStep={mySteps.indexOf(props.setIndex)}
      highlightSteps={true}
    />
  );
};

const NavigationWithSave = (props) => {
  // const myStepsDetails = [
  //   {prev: '', next: 'Define Fields'},
  //   {prev: 'Create or Load', next: 'Define Filters'},
  //   {prev: 'Define Fields', next: 'Run Query'},
  //   {prev: 'Define Filters', next: ''},
  // ];

  const getTextDescriptionPrevious = (index) => {
    switch (index) {
      case 0:
        return '';
      case 1:
        return 'Create or Load';
      case 2:
        return 'Define Fields';
      case 3:
        return 'Define Filters';
      case 4:
        return 'Run Query';
      default:
        break;
    }
    return '';
  };

  const getTextDescriptionNext = (index) => {
    switch (index) {
      case 0:
        return 'Define Fields';
      case 1:
        return 'Define Filters';
      case 2:
        return 'Run Query';
      case 3:
        return '';
      case 4:
        return '';
      default:
        break;
    }
    return '';
  };

  return (
    <div style={{
      padding: '0',
      width: '100%',
      minHeight: '0',
      /* The proceeding pushes to bottom */
      // position: 'fixed',
      // bottom: '100px',
      // left: 0,
      // zIndex: 10,
    }}>
      <div style={{
        zIndex: 10,
        width: '350px',
        height: '80px',
        marginRight: '30px',
        marginLeft: 'auto',
        position: 'relative',
      }}>
        <button onClick={() => props.onClickHandler('previous')}
                className={props.disable.previous
                  ? 'navigation-button disabled'
                  : 'navigation-button'}
                style={{
                  display: 'inline-block',
                  marginRight: '10px',
                }}
                disabled={props.disable.previous}>
          <span className='glyphicon glyphicon-chevron-left'/>
          {getTextDescriptionPrevious(props.index)}
        </button>
        <button onClick={() => props.onClickHandler('save')}
                className={'save-button'}
                style={{
                  display: 'inline-block',
                  marginRight: '10px',
                }}
                disabled={props.disable.save}>
          Save
        </button>
        <button onClick={() => props.onClickHandler('next')}
                className={props.disable.next
                  ? 'navigation-button disabled'
                  : 'navigation-button'}
                style={{display: 'inline-block'}}
                disabled={props.disable.next}>
          {getTextDescriptionNext(props.index)}
          <span className='glyphicon glyphicon-chevron-right'/>
        </button>
      </div>
    </div>
  );
};
NavigationWithSave.defaultProps = {
  disable: {
    previous: false,
    save: false,
    next: false,
  },
};
NavigationWithSave.propTypes = {
  onClickHandler: PropTypes.func,
  disable: PropTypes.object,
};

export {
  NavigationStepper,
  NavigationWithSave,
};
