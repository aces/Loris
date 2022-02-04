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
    if (this.props.collapsing) {
      this.setState({collapsed: !this.state.collapsed});
    }
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

    const title = this.props.bold ? (
      <h3 className={'panel-title'}>
        {this.props.title}
      </h3>
    ) : this.props.title;

    // Add panel header, if title is set
    const panelHeading = this.props.title ? (
      <div
        className="panel-heading"
        onClick={this.toggleCollapsed}
        data-toggle={this.props.collapsing ? 'collapse' : null}
        data-target={'#' + this.props.id}
        data-parent={this.props.parentId ?
          '#'+this.props.parentId :
          false
        }
        style={{
          cursor: this.props.collapsing ? 'pointer' : 'default',
          height: '3em',
          fontWeight: 'bold',
        }}
      >
        {title}
        {this.props.collapsing ? <span className={glyphClass}/> : ''}
      </div>
    ) : '';

    return (
      <div className={'panel ' + this.props.class}
           style={{height: this.props.panelSize}}
      >
        {panelHeading}
        <div id={this.props.id}
             className={this.panelClass}
             role='tabpanel'
             style={this.props.collapsing ? {} : {height: 'calc(100% - 3em)'}}
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
  parentId: PropTypes.string,
  id: PropTypes.string,
  height: PropTypes.string,
  title: PropTypes.string,
  class: PropTypes.string,
  collapsing: PropTypes.bool,
  bold: PropTypes.bool,
};
Panel.defaultProps = {
  initCollapsed: false,
  parentId: null,
  id: 'default-panel',
  height: '100%',
  class: 'panel-primary',
  collapsing: true,
  bold: false,
  title: '',
};

export default Panel;
