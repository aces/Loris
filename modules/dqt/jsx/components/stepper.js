import React from 'react';
import PropTypes from 'prop-types';

/**
 * Step component used in Stepper.
 *
 * @description the text & circular key for a step.
 * @param {object} props - React Component properties
 * @return {JSX} - React markup for the component
 */
const Step = (props) => {
  const styles = {
    step: {
      width: props.width,
      padding: '0 0 2px 0',
      position: 'relative',
      display: 'table-cell',
      WebkitUserSelect: 'none',
      userSelect: 'none',
    },
    circle: {
      default: {
        width: 32,
        height: 32,
        color: '#fff',
        padding: '2px',
        margin: '0 auto',
        display: 'block',
        cursor: 'pointer',
        textAlign: 'center',
        borderRadius: '50%',
        backgroundColor: '#E0E0E0',
      },
      active: {
        color: '#fff',
        backgroundColor: '#4e8fde',
      },
    },
    title: {
      default: {
        fontSize: 16,
        color: 'black',
        display: 'block',
        fontWeight: '300',
        cursor: 'pointer',
        margin: '8px 0 0 0',
        textAlign: 'center',
      },
      active: {
        color: 'black',
      },
    },
    stepline: {
      left: props.index === 0 ? {} : {
        left: '0',
        top: '16px',
        right: '50%',
        height: '1px',
        zIndex: '-1',
        position: 'absolute',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: '#c6c6c6',
      },
      right: props.index === props.length - 1 ? {} : {
        right: '0',
        left: '50%',
        top: '16px',
        zIndex: '-1',
        height: '1px',
        marginLeft: '20px',
        position: 'absolute',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: '#c6c6c6',
      },
      active: {
        borderTopColor: '#4e8fde',
      },
    },
  };
  const styleCircle = {
    ...styles.circle.default,
    ...(props.active ? styles.circle.active : {}),
    ...(props.highlightSteps && props.index <= props.activeIndex
      ? styles.circle.active
      : {}),
  };
  const styleTitleText = {
    ...styles.title.default,
    ...(props.active
      ? styles.title.active
      : {}),
  };
  const contentStepCircle = (
    <span style={{lineHeight: '30px', color: '#fff'}}>
      {props.index + 1}
    </span>
  );
  const styleLineLeft = {
    ...styles.stepline.left,
    ...(props.highlightSteps && props.index <= props.activeIndex
      ? styles.stepline.active
      : {}),
  };
  const styleLineRight = {
    ...styles.stepline.right,
    ...(props.highlightSteps && props.index < props.activeIndex
      ? styles.stepline.active
      : {}),
  };

  return (
    <div style={styles.step}>
      <div style={styleCircle}
           onClick={props.onClick}>
        {contentStepCircle}
        <div style={styleLineLeft}/>
        <div style={styleLineRight}/>
      </div>
      <div style={styleTitleText}
           onClick={props.onClick}>
        {props.title}
      </div>
    </div>
  );
};
Step.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  optional: PropTypes.bool,
  onClick: PropTypes.func,
  active: PropTypes.bool,
  highlightSteps: PropTypes.bool,
};

/**
 * Stepper component.
 *
 * @description guides the user with steps to complete a task.
 *
 * @param {object} props - React Component properties
 * @return {JSX} - React markup for the component
 */
const Stepper = (props) => {
  const styles = {
    root: {
      padding: 0,
      minHeight: 0,
      width: '100%',
    },
    stepper: {
      width: '100%',
      margin: '0 auto',
      display: 'table',
    },
  };
  return (
    <div style={styles.root}>
      <div style={styles.stepper}>
        { props.steps.map((step, index) => (
          <Step
            key={index}
            index={index}
            length={props.steps.length}
            width={100 / props.steps.length}
            title={step.title}
            onClick={step.onClick}
            active={index === props.activeStep}
            activeIndex={props.activeStep}
            highlightSteps={props.highlightSteps}
          />
        ))}
      </div>
    </div>
  );
};
Stepper.defaultProps = {
  activeStep: 0,
  highlightSteps: false,
};
Stepper.propTypes = {
  steps: PropTypes.array,
  activeStep: PropTypes.number,
  highlightSteps: PropTypes.bool,
};

const StepperPanel = (props) => {
  return (
    <div id={props.TabId}
         className={props.active ? 'tab-pane active' : 'tab-pane'}>
      {props.content}
    </div>
  );
};

export {
  Stepper,
  StepperPanel,
};
