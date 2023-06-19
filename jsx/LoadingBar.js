// ########### CBIGR START ###########
import React from 'react';

/**
 * LoadingBar is a React component which shows a loading bar while
 * something is loading.
 *
 * @param {array} props - The React props
 *
 * @return {DOMObject} - Loading Bar React component
 */
function LoadingBar(props) {
  const {progress} = props;

  const wrapperStyle = {
    margin: 50,
  };

  const containerStyles = {
    height: 5,
    backgroundColor: '#e0e0de',
    borderRadius: 50,
  };

  const fillerStyles = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: '#E89A0C',
    borderRadius: 'inherit',
    textAlign: 'right',
    transition: 'width 1s linear',
  };

  const progressBar = progress >= 0 ? (
    <div style={wrapperStyle}>
      <h5 className='animate-flicker'>Loading...</h5>
      <div style={containerStyles}>
        <div style={fillerStyles}/>
      </div>
    </div>
  ) : null;

  return progressBar;
};

export default LoadingBar;
// ###########  CBIGR END  ###########
