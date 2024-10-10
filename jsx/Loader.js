/**
 * This file contains the React component for Loader
 *
 * @author Henri Rabalais
 * @version 1.0.0
 */
import PropTypes from 'prop-types';

/**
 * Loader is a React component which shows a spinner wheel while
 * something is loading.
 *
 * @param {array} props - The React props
 * @return {HTMLElement} - Loader React component
 */
function Loader(props) {
  const loaderStyle = {
    width: parseInt(props.size),
    height: parseInt(props.size),
    borderWidth: parseInt(props.size)/15,
  };

  return (
    <div
      className='loader'
      style={loaderStyle}
    />
  );
}

Loader.propTypes = {size: PropTypes.string};
Loader.defaultProps = {size: '120'};

export default Loader;
