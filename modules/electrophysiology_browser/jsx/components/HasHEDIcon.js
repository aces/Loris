import {Component} from 'react';

/**
 * HED Icon for data table column
 *
 */
class HasHEDIcon extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the React component.
   *
   * @return {React.ReactNode} - React markup for the component
   */
  render() {
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
        title={'HED tags in recording metadata (click for info)'}
        className={'browser-index-css-tooltip'}
      >
        <i className='glyphicon glyphicon-info-sign'/>
        <span className='browser-index-tooltip-text'>
          HED tags in recording metadata (click for info)
        </span>
      </a>
    </>;
  }
}

export default HasHEDIcon;
