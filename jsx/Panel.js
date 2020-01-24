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
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
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

  /**
   * Toggle whether this Panel is displayed as collapsed
   */
  toggleCollapsed() {
    this.setState({collapsed: !this.state.collapsed});
  }

  /**
   * Render the React component
   *
   * @return {object}
   */
  render() {
    // Change arrow direction based on collapse status
    let glyphClass = (
      this.state.collapsed ?
        'glyphicon pull-right glyphicon-chevron-down' :
        'glyphicon pull-right glyphicon-chevron-up'
    );

    // Add panel header, if title is set
    const panelHeading = this.props.title ? (
      <div
        className="panel-heading"
        onClick={this.toggleCollapsed}
        data-toggle="collapse"
        data-target={'#' + this.props.id}
        style={{cursor: 'pointer', height: '3em'}}
      >
        <b>{this.props.title}</b>
        <span className={glyphClass}></span>
      </div>
    ) : '';

    return (
      <div
        className="panel panel-primary"
        style={{height: this.props.panelSize}}
      >
        {panelHeading}
        <div
          id={this.props.id}
          className={this.panelClass}
          role="tabpanel"
          style={{height: 'calc(100% - 3em)', overflowX: 'auto'}}
        >
          <div className="panel-body"
               style={{...this.props.style, height: this.props.height}}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Panel.propTypes = {
  initCollapsed: PropTypes.bool,
  id: PropTypes.string,
  height: PropTypes.string,
  title: PropTypes.string,
};
Panel.defaultProps = {
  initCollapsed: false,
  id: 'default-panel',
  height: '100%',
  title: '',
};

export default Panel;
