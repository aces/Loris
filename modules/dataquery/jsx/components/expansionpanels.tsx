import React, {useState} from 'react';

/**
 * Component to render a single panel
 *
 * @param {object} props - The React Props
 * @param {boolean} props.defaultOpen - Whether the default should default open
 * @param {boolean} props.alwaysOpen - Whether the panel can not be collapsed
 * @param {string} props.title - The panel title
 * @param {React.ReactElement} props.content - The panel body
 * @returns {React.ReactElement} - The rendered panel
 */
const Panel = (props: {
    defaultOpen: boolean,
    alwaysOpen: boolean,
    title: string,
    content: React.ReactElement,
}) => {
  const [active, setActive] = useState(props.defaultOpen);

  const styles = {
    accordion: {
      default: {
        width: '100%',
        padding: '18px',
        outline: 'none',
        color: '#246EB6',
        fontSize: '15px',
        cursor: props.alwaysOpen ? 'default' : 'pointer',
        textAlign: 'center' as const,
        backgroundColor: '#fff',
        border: '1px solid #246EB6',
        transition: '0.4s',
      },
      active: {
        color: '#fff',
        textAlign: 'left' as const,
        backgroundColor: '#246EB6',
      },
    },
    panel: {
      default: {
        display: 'none',
        padding: '20px 18px',
        backgroundColor: '#fff',
        border: '1px solid #246EB6',
        overflow: 'hidden',
      },
      active: {
        display: 'block',
        margin: '0 0 10px 0',
      },
    },
  };

  /**
   * Handle clicking on the header
   *
   * @returns {void}
   */
  const handleExpansionClick = () => {
    if (props.alwaysOpen) return;
    setActive((active) => !active);
  };

  const styleAccordion: React.CSSProperties = {
    ...styles.accordion.default,
    ...(active ? styles.accordion.active : {}),
  };

  const stylePanel: React.CSSProperties = {
    ...styles.panel.default,
    ...(active ? styles.panel.active : {}),
  };

  return (
    <div>
      <button onClick={() => handleExpansionClick()}
              style={styleAccordion}>
        {props.title}
      </button>
      <div style={stylePanel}>
        {props.content}
      </div>
    </div>
  );
};

/**
 * Render a series of expansion panels
 *
 * @param {object} props - React props
 * @param {boolean?} props.alwaysOpen - If true, panels can not be toggled
 * @param {object} props.panels - Array of individual panels
 * @returns {React.ReactElement} - The panels
 */
const ExpansionPanels = (props: {
    alwaysOpen?: boolean,
    panels: {
        title: string,
        content: React.ReactElement,
        defaultOpen?: boolean,
        alwaysOpen: boolean,
    }[]
}) => {
  return (
    <div className={'container-fluid'}
         style={{margin: '0 auto', maxWidth: '900px'}}>
      { props.panels.map((panel, index) => (
        <Panel
          key={index}
          title={panel.title}
          content={panel.content}
          alwaysOpen={panel.alwaysOpen}
          defaultOpen={panel.defaultOpen || props.alwaysOpen || true}
        />
      ))}
    </div>
  );
};

export default ExpansionPanels;
