import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'jsx/Panel';

/**
 * File Panel
 *
 * This file contains React component for Electrophysiology module.
 *
 * @version 0.0.1
 */
class FilePanel extends Component {
  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <Panel id={this.props.id} title={this.props.title}>
        <div className={'container-fluid'}>
          <div className={'row'}>
            {this.props.children}
          </div>
        </div>
      </Panel>
    );
  }
}

FilePanel.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
};

FilePanel.defaultProps = {
  id: 'file_panel',
};

export {
  FilePanel,
};
