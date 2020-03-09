import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * The Loader component displays a spinning blue circle. It is intended to be
 * displayed during communication with the server to indicate to the user that
 * an operation is taking place.
 */
class Loader extends Component {
  /**
   * {@inheritdoc}
   * @return {*} Loader Component
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
