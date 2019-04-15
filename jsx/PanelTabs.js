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
  constructor(props) {
    super(props);

    this.state = {
      collapsed: this.props.initCollapsed,
    };

    // Initialize panel class based on collapsed status
    this.panelClass = (
      this.props.initCollapsed ?
        'panel-collapse collapse' :
        'panel-collapse collapse in'
    );

    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  toggleCollapsed() {
    this.setState({collapsed: !this.state.collapsed});
  }

  render() {
    // Change arrow direction based on collapse status
    let glyphClass = (
      this.state.collapsed ?
        'pull-right clickable glyphicon glyphicon-chevron-down' :
        'pull-right clickable glyphicon glyphicon-chevron-up'
    );

    // Add panel header, if title is set
    const panelHeading = this.props.title ? (
      <div
        className='panel-heading'
        onClick={this.toggleCollapsed}
        data-toggle='collapse'
        data-target={'#' + this.props.id}
        style={{cursor: 'pointer'}}
      >
        {this.props.title}
        <span className={glyphClass}/>
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
              <li className={'active'}>
                <a data-target={'overall-recruitment'}>
                  View overall recruitment
                </a>
              </li>
              <li>
                <a data-target={'recruitment-site-breakdown'}>
                  View site breakdown
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    ) : '';

    return (
      <div className='panel panel-primary'>
        {panelHeading}
        <div id={this.props.id} className={this.panelClass} role='tabpanel'>
          <div className='panel-body' style={{height: this.props.height}}>
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
};
PanelTabs.defaultProps = {
  initCollapsed: false,
  id: 'default-panel',
  height: '100%',
};

export default PanelTabs;
