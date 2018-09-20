/**
 * This file contains the React component for Loader
 *
 * @author Henri Rabalais
 * @version 1.0.0
 *
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * Loader component
 */
class Loader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className='loader'
        style={{width: parseInt(this.props.size), height: parseInt(this.props.size)}}
      />
    );
  }
}

Loader.propTypes = {size: PropTypes.string};
Loader.defaultProps = {size: '120'};

export default Loader;
