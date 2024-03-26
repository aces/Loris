import React from 'react';
import Panel from 'jsx/Panel';

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
        id: string,
    }[]
}) => {
  return (
    <div className={'container-fluid'}
         style={{margin: '0 auto', maxWidth: '900px'}}>
      { props.panels.map((panel, index) => (
        <Panel
          key={index}
          id={panel.id}
          title={panel.title}
          collapsed={panel.alwaysOpen}
          initCollapsed={panel.defaultOpen || props.alwaysOpen || true}>
          {panel.content}
        </Panel>
      ))}
    </div>
  );
};

export default ExpansionPanels;
