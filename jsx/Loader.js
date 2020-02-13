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
  /**
   * Constructor
   */
  constructor(props) {
    super(props);
  }

  /**
   * Render
   */
  render() {
    const style = {
      width: parseInt(this.props.size),
      height: parseInt(this.props.size),
    };
    return (
      <div
        className='loader'
        style={style}
      />
    );
  }
}

Loader.propTypes = {size: PropTypes.string};
Loader.defaultProps = {size: '120'};

export default Loader;
