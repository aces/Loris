interface IInfoIcon {
  title: string;
  url: string;
  tooltipText?: string,
}

/** Info icon component. */
export function InfoIcon({title, url, tooltipText}: IInfoIcon) {
  return <a
    href={url}
    target="_blank"
    style={{
      cursor: 'help',
      marginLeft: '5px',
      color: '#A9A9A9',
    }}
    title={tooltipText ? undefined : title}
    className={tooltipText ? 'browser-index-css-tooltip' : ''}
  >
    <i className='glyphicon glyphicon-info-sign'/>
    {
      tooltipText && <span className='browser-index-tooltip-text'>{tooltipText}</span>
    }
  </a>;
}
