import React from 'react';

function LoadingBar(props) {
  const {progress, onTransitionEnd} = props;

  const wrapperStyle = props.wrapperStyle ?? {
    margin: 50,
  };

  const containerStyles = {
    height: 5,
    backgroundColor: '#e0e0de',
    borderRadius: 50,
  };

  const fillerStyles = {
    height: '100%',
    width: `${Math.min(progress, 100)}%`,
    maxWidth: '100%',
    backgroundColor: '#E89A0C',
    borderRadius: 'inherit',
    textAlign: 'right',
    transition: 'width 1s linear',
  };

  return (
    <div style={wrapperStyle}>
      <h5 className='animate-flicker'>Loading...</h5>
      <div style={containerStyles}>
        <div
          id='chunk-progress-bar'
          style={fillerStyles}
          onTransitionEnd={onTransitionEnd}
        />
      </div>
    </div>
  );
}

export default LoadingBar;
