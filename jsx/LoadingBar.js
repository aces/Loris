import React from 'react';

/**
 * React component to display a loading bar with progress
 *
 * @param {object} props - React props
 *
 * @return {JSX}
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
