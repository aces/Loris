import React from 'react';

interface LoadingBarProps {
  progress: number; // Expect progress to be a number
}

/**
 * LoadingBar is a React component that displays a progress bar to indicate
 * loading status.
 *
 * @param {number} progress - A number representing the loading progress (0 to
 * 100).
 *
 * @returns {JSX.Element|null} - Returns a Loading Bar React component if
 * progress is valid, otherwise null.
 */
const LoadingBar: React.FC<LoadingBarProps> = ({progress}) => {
  const wrapperStyle: React.CSSProperties = {
    margin: '50px 0',
  };

  const containerStyles: React.CSSProperties = {
    height: '5px',
    backgroundColor: '#e0e0de',
    borderRadius: '50px',
    overflow: 'hidden',
  };

  const fillerStyles: React.CSSProperties = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: '#E89A0C',
    borderRadius: 'inherit',
    textAlign: 'right',
    transition: 'width 1s linear',
  };

  const progressBar = progress >= 0 ? (
    <div
      style={wrapperStyle}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <h5 className="animate-flicker" aria-live="polite">Loading...</h5>
      <div style={containerStyles}>
        <div style={fillerStyles} />
      </div>
    </div>
  ) : null;

  return progressBar;
};

export default LoadingBar;
