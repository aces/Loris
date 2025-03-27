import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

/**
 * Panel - a collapsible panel component with optional multiple views.
 *
 * @author  Alex I.
 * @version 2.0.0
 * @param   {object} props
 * @return  {JSX.Element}
 */
const Panel = (props) => {
    const [collapsed, setCollapsed] = useState(false);
    const activeView = props.activeView ?? 0;

    /**
     * Similar to componentDidMount and componentDidUpdate.
     */
    useEffect(
        () => {
        setCollapsed(props.initCollapsed);
        },
        []
    );

  /**
   * Toggle whether panel is displayed as collapsed
   */
  const toggleCollapsed = () => {
        if (props.collapsing) {
            setCollapsed(!collapsed);
        }
    };

    // Toggle filters for QueryChartForm
    const toggleFilters   = () => {
        const currentView = props.views?.[activeView];

        if (currentView?.onToggleFilters) {
            // If current view supports filters, toggle them
            currentView.onToggleFilters();
        } else if (props.views?.[1]?.onToggleFilters) {
            // If not, fall back to view index 1
            props.views[1].onToggleFilters();
            if (props.onChangeView) {
                props.onChangeView(1);
            }
        }
    };

    /**
     * User clicked a view to display.
     *
     * @param {number} index
     */
    const viewClicked = (index) => {
        if (props.onChangeView) {
            props.onChangeView(index);
        }
    };

    // Panel Views (START)
    let views   = [];
    let content = [];
    let panelViews;
    if (props.views) {
        for (const [index, view] of props.views.entries()) {
            views.push(
                <li key        ={index}
                onClick        ={() => viewClicked(index)}
                className      ={index === activeView ? 'active' : null}>
                <a data-target ={`${index}_panel_content`}>
                {view['title']}
                </a>
                </li>
            );
            content.push(
                <div key  ={index}
                id        ={`${index}_panel_content_${props.id}`}
                className ={index === activeView ?
                    `${index}_panel_content` : `${index}_panel_content hidden`}>
                {view['content']}
                </div>
            );
        }
        panelViews     = (
        <div className ='btn-group views' style={{ display: 'inline-flex', gap: '5px' }}>
        <div className ='btn-group'>
        <button type   ='button'
          className    ='btn btn-default btn-xs dropdown-toggle'
          data-toggle  ='dropdown'>
          Views<span className ='caret'/>
        </button>
        <ul className          ='dropdown-menu pull-right'
          role    ='menu'>
          {views}
        </ul>
        </div>
        <button
        type      ='button'
        className ='btn btn-default btn-xs'
        onClick   ={toggleFilters}
        >
        Filters
        </button>
        </div>
        );
    }
    // Panel Views (END)

    // Add panel header, if title is set
    const panelHeading = props.title || props.views ? (
    <div className     ='panel-heading'
      data-parent      ={props.parentId
            ? `#${props.parentId}`
            : null}>
      <h3 className    ='panel-title'>
        {props.views && props.views[activeView]['title']
            ? props.views[activeView]['title']
            : props.title}
      </h3>
      {panelViews}
      {props.collapsing
            ? <span className ={collapsed ?
                'glyphicon glyphicon-chevron-down' :
                'glyphicon glyphicon-chevron-up'}
            onClick           ={toggleCollapsed}
            data-toggle       ='collapse'
            data-target       ={`#${props.id}`}
            style ={{cursor: 'pointer'}}/>
            : null}
    </div>
  ) : '';

  /**
   * Renders the React component.
   *
   * @return {JSX.Element} - React markup for component.
   */
  return (
    <div className     ={`panel ${props.class}`}
      style            ={{height: props.panelSize}}>
      {panelHeading}
      <div id          ={props.id}
        className      ={props.collapsed ?
            'panel-collapse collapse' :
            'panel-collapse collapse in'}
        role           ='tabpanel'
        style          ={{height: 'calc(100% - 3em)'}}>
        <div className ='panel-body'
          style        ={{...props.style, height: props.height}}>
          {content.length > 0 ? content : props.children}
        </div>
      </div>
    </div>
  );
};
Panel.propTypes    = {
    initCollapsed: PropTypes.bool,
    collapsed: PropTypes.bool,
    parentId: PropTypes.string,
    id: PropTypes.string,
    height: PropTypes.string,
    title: PropTypes.string,
    class: PropTypes.string,
    children: PropTypes.node,
    views: PropTypes.array,
    onChangeView: PropTypes.func,
    collapsing: PropTypes.bool,
    bold: PropTypes.bool,
    panelSize: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    activeView: PropTypes.number,
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
