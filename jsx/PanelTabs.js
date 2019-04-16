/**
 * This file contains React component for Panel with Tabs.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * PanelTabs component
 * Wraps children in a collapsible bootstrap panel
 */
class PanelTabs extends Component {
  /**
   * Constructor of component
   * @param {object} props - the component properties.
   */
  constructor(props) {
    super(props);

    this.state = {
      collapsed: this.props.initCollapsed,
      collapseClass: 'panel-collapse collapse in',
    };
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  toggleCollapsed() {
    const state = Object.assign({}, this.state);
    state.collapsed = !this.state.collapsed;
    if (state.collapsed) {
      state.collapseClass = 'panel-collapse collapse';
    } else {
      state.collapseClass = 'panel-collapse collapse in';
    }
    this.setState(state);
  }

  render() {
    // Change arrow direction based on collapse status
    let glyphClass = (
      this.state.collapsed ?
        'pull-right clickable glyphicon glyphicon-chevron-down' :
        'pull-right clickable glyphicon glyphicon-chevron-up'
    );

    let menuOptions = [];

    for (let i=0; i<this.props.menu.length; i++) {
      const elementProps = {
        className: i===0 ? 'active' : null,
      };
      const element = (
        <li {...elementProps} key={
          this.props.title + '_menu_options_' + i
        }>
          <a data-target={this.props.menu[i].dataTarget}>
            {this.props.menu[i].text}
          </a>
        </li>
      );
      menuOptions.push(element);
    }

    // Add panel header, if title is set
    const panelHeading = this.props.title ? (
      <div
        className='panel-heading'
      >
        {this.props.title}
        <span className={glyphClass}
              onClick={this.toggleCollapsed}
              data-toggle='collapse'
              data-target={'#' + this.props.id}/>
        <div className={'pull-right'}>
          <div className={'btn-group views'}>
            <button type={'button'}
                    className={'btn btn-default btn-xs dropdown-toggle'}
                    data-toggle={'dropdown'}
                    aria-expanded={'false'}
                    style={{fontSize: '12px', marginRight: 0}}
                    >
              Views&nbsp;
              <span className={'caret'}/>
            </button>
            <ul className={'dropdown-menu pull-right'}
                role={'menu'}
                >
              {menuOptions}
            </ul>
          </div>
        </div>
      </div>
    ) : '';

    return (
      <div className={'panel panel-primary'}>
        {panelHeading}
        <div className={this.state.collapseClass} role='tabpanel'>
          <div className={'panel-body'}
               style={{display: 'block', height: this.props.height}
          }>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

PanelTabs.propTypes = {
  id: PropTypes.string,
  height: PropTypes.string,
  title: PropTypes.string,
  menu: PropTypes.array,
};
PanelTabs.defaultProps = {
  initCollapsed: false,
  id: 'default-panel',
  height: '100%',
  menu: [],
};

export default PanelTabs;
