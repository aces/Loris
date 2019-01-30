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

    let pencilGlyph;
    if (this.props.edit) {
      pencilGlyph = (
        <span
          className="glyphicon pull-right glyphicon-pencil"
          style={{marginRight: '10px', cursor: 'pointer'}}
          onClick={this.props.edit}
        />
      );
    }

    let plusGlyph;
    if (this.props.add) {
      plusGlyph = (
        <span
          className="glyphicon pull-right glyphicon-plus"
          style={{marginRight: '10px', cursor: 'pointer'}}
          onClick={this.props.add}
        />
      );
    }

    let removeGlyph;
    if (this.props.cancel) {
      removeGlyph = (
        <span
          className="glyphicon pull-right glyphicon-remove"
          style={{marginRight: '10px', cursor: 'pointer'}}
          onClick={this.props.cancel}
        />
      );
    }

    // Add panel header, if title is set
    const panelHeading = this.props.title ? (
      <div
        className="panel-heading"
      >
        <span
          className={glyphClass}
          onClick={this.toggleCollapsed}
          data-toggle="collapse"
          data-target={'#' + this.props.id}
          style={{cursor: 'pointer'}}
        />
        {pencilGlyph}
        {plusGlyph}
        {removeGlyph}
        {this.props.title}
      </div>
    ) : '';

    return (
      <div className="panel panel-primary">
        {panelHeading}
        <div id={this.props.id} className={this.panelClass} role="tabpanel">
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
};
Panel.defaultProps = {
  initCollapsed: false,
  id: 'default-panel',
  height: '100%',
};

export default Panel;
