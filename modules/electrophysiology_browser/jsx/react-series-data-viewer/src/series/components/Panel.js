import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

/**
 * Panel - a collapsible panel component with optional multiple views.
 *
 * @author Alex I.
 * @version 2.0.0
 * @param {object} props
 * @return {JSX.Element}
 */
const Panel = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState(0);

  /**
   * Similar to componentDidMount and componentDidUpdate.
   */
  useEffect(() => {
    setCollapsed(props.initCollapsed);
  }, []);

  /**
   * Toggle whether panel is displayed as collapsed
   */
  const toggleCollapsed = () => {
    if (props.collapsing) {
      setCollapsed(!collapsed);
    }
  };

  /**
   * User clicked a view to display.
   *
   * @param {number} index
   */
  const viewClicked = (index) => {
    setActiveView(index);
  };

  // Panel Views (START)
  let views = [];
  let content = [];
  let panelViews;
  if (props.views) {
    for (const [index, view] of props.views.entries()) {
      views.push(
        <li key={index}
            onClick={() => viewClicked(index)}
            className={index === activeView ? 'active' : null}>
          <a data-target={`${index}_panel_content`}>
            {view['title']}
          </a>
        </li>
      );
      content.push(
        <div key={index}
             id={`${index}_panel_content_${props.id}`}
             className={index === activeView ?
               `${index}_panel_content` : `${index}_panel_content hidden`}>
          {view['content']}
        </div>
      );
    }
    panelViews = (
      <div className='btn-group views'>
        <button type='button'
                className='btn btn-default btn-xs dropdown-toggle'
                data-toggle='dropdown'>
          Views<span className='caret'/>
        </button>
        <ul className='dropdown-menu pull-right'
            role='menu'>
          {views}
        </ul>
      </div>
    );
  }
  // Panel Views (END)

  // Add panel header, if title is set
  const panelHeading = props.title || props.views ? (
    <div className='panel-heading'
         data-parent={props.parentId
           ? `#${props.parentId}`
           : null}>
      <h3 className='panel-title'>
        {props.views && props.views[activeView]['title']
          ? props.views[activeView]['title']
          : props.title}
      </h3>
      {panelViews}
      {props.collapsing
        ? <span className={collapsed ?
          'glyphicon glyphicon-chevron-down' :
          'glyphicon glyphicon-chevron-up'}
                onClick={toggleCollapsed}
                data-toggle='collapse'
                data-target={`#${props.id}`}
                style={{cursor: 'pointer'}}/>
        : null}
    </div>
  ) : '';

  /**
   * Renders the React component.
   *
   * @return {JSX.Element} - React markup for component.
   */
  return (
    <div className={`panel ${props.class}`}
         style={{height: props.panelSize}}>
      {panelHeading}
      <div id={props.id}
           className={collapsed ?
             'panel-collapse collapse' :
             'panel-collapse collapse in'}
           role='tabpanel'
           style={{height: 'calc(100% - 3em)'}}>
        <div className='panel-body'
             style={{...props.style, height: props.height}}>
          {content.length > 0 ? content : props.children}
        </div>
      </div>
    </div>
  );
};
Panel.propTypes = {
  initCollapsed: PropTypes.bool,
  collapsed: PropTypes.bool,
  parentId: PropTypes.string,
  id: PropTypes.string,
  height: PropTypes.string,
  title: PropTypes.object,
  class: PropTypes.string,
  children: PropTypes.node,
  views: PropTypes.array,
  collapsing: PropTypes.bool,
  bold: PropTypes.bool,
  panelSize: PropTypes.string,
  style: PropTypes.object,
};
Panel.defaultProps = {
  initCollapsed: false,
  parentId: null,
  id: 'default-panel',
  height: '100%',
  class: 'panel-primary',
  collapsing: true,
};

export default Panel;
