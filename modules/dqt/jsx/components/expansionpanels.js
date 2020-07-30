import React, {useState} from 'react';
import PropTypes from 'prop-types';

const Panel = (props) => {

  const [active, setActive] = useState(props.alwaysOpen);

  const styles = {
    accordion: {
      default: {
        width: '100%',
        padding: '18px',
        outline: 'none',
        color: '#246EB6',
        fontSize: '15px',
        cursor: props.alwaysOpen ? 'default' : 'pointer',
        textAlign: 'center',
        backgroundColor: '#fff',
        border: '1px solid #246EB6',
        transition: '0.4s',
      },
      active: {
        color: '#fff',
        textAlign: 'left',
        backgroundColor: '#246EB6'
      }
    },
    panel: {
      default: {
        display: 'none',
        padding: '20px 18px',
        backgroundColor: '#fff',
        border: '1px solid #246EB6',
        overflow: 'hidden'
      },
      active: {
        display: 'block',
        margin: '0 0 10px 0'
      }
    }
  };

  const handleExpansionClick = () => {
    if (props.alwaysOpen) return;
    setActive((active) => !active);
  };

  const styleAccordion = {
    ...styles.accordion.default,
    ...(active ? styles.accordion.active : {})
  };

  const stylePanel = {
    ...styles.panel.default,
    ...(active ? styles.panel.active : {})
  };

  return (
    <>
      <button onClick={() => handleExpansionClick()}
              style={styleAccordion}>
        {props.title}
      </button>
      <div style={stylePanel}>
        {props.content}
      </div>
    </>
  )
};

const ExpansionPanels = (props) => {

  return (
    <div className={'container-fluid'}
         style={{margin: '0 auto', maxWidth: '900px'}}>
      { props.panels.map((panel, index) => (
        <Panel
          key={index}
          index={index}
          title={panel.title}
          content={panel.content}
          alwaysOpen={panel.alwaysOpen}
        />
      ))}
    </div>
  )
};
ExpansionPanels.defaultProps = {
  alwaysOpen: false,
};
ExpansionPanels.propTypes = {
  panels: PropTypes.array,
};

export default ExpansionPanels;
