import type {TFunction} from 'i18next';

type HasHEDIconProps = {t: TFunction};

/**
 * HED Icon for data table column
 *
 */
function HasHEDIcon({t}: HasHEDIconProps) {
  return <>
    <img
      src="https://images.loris.ca/HED_logo.png"
      alt="HED"
      style={{width: '36px'}}
    />
    <a
      href={'https://www.hed-resources.org/en/latest/index.html'}
      target="_blank"
      style={{
        cursor: 'help',
        marginLeft: '5px',
        color: '#A9A9A9',
      }}
      title={t(
        'HED tags in recording metadata (click for info)',
        {ns: 'electrophysiology_browser'}
      )}
      className={'browser-index-css-tooltip'}
    >
      <i className='glyphicon glyphicon-info-sign'/>
      <span className='browser-index-tooltip-text'>
        {t(
          'HED tags in recording metadata (click for info)',
          {ns: 'electrophysiology_browser'}
        )}
      </span>
    </a>
  </>;
}

export default HasHEDIcon;
