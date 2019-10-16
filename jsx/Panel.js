/**
 * This file contains React component for Panel
 *
 * @author Alex I.
 * @version 1.0.0
 *
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * Panel component
 * Wraps children in a collapsible bootstrap panel
 */
class Panel extends Component {
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
        'glyphicon pull-right glyphicon-chevron-down' :
        'glyphicon pull-right glyphicon-chevron-up'
    );

    const title = this.props.bold ? (
      <h3 className={'panel-title'}>
        {this.props.title}
      </h3>
    ) : this.props.title;

    const collapse = this.props.collapsing ? 'collapse' : null;

    // Add panel header, if title is set
    const panelHeading = this.props.title ? (
      <div
        className="panel-heading"
        onClick={this.toggleCollapsed}
        data-toggle={collapse}
        data-target={'#' + this.props.id}
        style={this.props.collapsing ?
          {cursor: 'pointer'} : {cursor: 'default'}
        }
      >
        {title}
        {this.props.collapsing ? <span className={glyphClass}/> : ''}
      </div>
    ) : '';

    return (
      <div className={'panel ' + this.props.class}>
        {panelHeading}
        <div id={this.props.id} className={this.panelClass} role='tabpanel'>
          <div className="panel-body" style={{height: this.props.height}}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Panel.propTypes = {
  id: PropTypes.string,
  height: PropTypes.string,
  title: PropTypes.string,
  class: PropTypes.string,
  collapsing: PropTypes.bool,
  bold: PropTypes.bool,
};
Panel.defaultProps = {
  initCollapsed: false,
  id: 'default-panel',
  height: '100%',
  class: 'panel-primary',
  collapsing: true,
  bold: false,
};

export default Panel;
