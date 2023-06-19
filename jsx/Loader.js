/**
 * This file contains the React component for Loader
 *
 * @author Henri Rabalais
 * @version 1.0.0
 *
 */
import PropTypes from 'prop-types';
// ########### CBIGR START ###########
import LoadingBar from 'jsx/LoadingBar';
// ###########  CBIGR END  ###########

/**
 * Loader is a React component which shows a spinner wheel while
 * something is loading.
 *
 * @param {array} props - The React props
 *
 * @return {DOMObject} - Loader React component
 */
function Loader(props) {
  // ########### CBIGR START ###########
  const loaderStyle = {
    width: parseInt(props.size),
    height: parseInt(props.size),
    borderWidth: parseInt(props.size)/15,
  };
  const progressBar = props.progress && (
    <LoadingBar progress={props.progress}/>
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
  // ###########  CBIGR END  ###########
}

Loader.propTypes = {size: PropTypes.string};
Loader.defaultProps = {size: '120'};

export default Loader;
