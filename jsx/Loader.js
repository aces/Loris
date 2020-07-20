/**
 * This file contains the React component for Loader
 *
 * @author Henri Rabalais
 * @version 1.0.0
 *
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import LoadingBar from 'jsx/LoadingBar';

/**
 * Loader component
 */
class Loader extends Component {
  render() {
    const loaderStyle = {
      width: parseInt(this.props.size),
      height: parseInt(this.props.size),
      borderWidth: parseInt(this.props.size)/15,
    };
    const progressBar = this.props.progress && (
      <LoadingBar progress={this.props.progress}/>
    );
    return (
      <div>
        <div
          className='loader'
          style={loaderStyle}
        />
        {progressBar}
      </div>
    );
  }
}

Loader.propTypes = {size: PropTypes.string};
Loader.defaultProps = {size: '120'};

export default Loader;
