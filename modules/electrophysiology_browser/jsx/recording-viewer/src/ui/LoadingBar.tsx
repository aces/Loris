import React from 'react';
import type {TFunction} from 'i18next';

type LoadingBarProps = {
  progress: number;
  t: TFunction;
};

/** Display signal-loading progress. */
function LoadingBar(props: LoadingBarProps) {
  const {progress, t} = props;

  const containerStyles: React.CSSProperties = {
    height: 5,
    backgroundColor: '#e0e0de',
    borderRadius: 50,
  };

  const fillerStyles: React.CSSProperties = {
    height: '100%',
    width: `${Math.min(progress, 100)}%`,
    maxWidth: '100%',
    backgroundColor: '#E89A0C',
    borderRadius: 'inherit',
    textAlign: 'right',
    transition: 'width 1s linear',
  };

  return (
    <div>
      <h5 className='animate-flicker'>
        {t('Loading...', {ns: 'loris'})}
      </h5>
      <div style={containerStyles}>
        <div style={fillerStyles} />
      </div>
    </div>
  );
}
export default LoadingBar;
