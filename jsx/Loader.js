import PropTypes from 'prop-types';

/**
 * Loader is a React component which shows a spinner wheel while
 * something is loading.
 *
 * @param {array} props - The React props
 *
 * @return {DOMObject} - Loader React component
 */
function Loader(props) {
    return (
      <div
        className='loader'
        style={{width: parseInt(props.size), height: parseInt(props.size)}}
\
      />
    );
}

Loader.propTypes = {size: PropTypes.string};
Loader.defaultProps = {size: '120'};

export default Loader;
