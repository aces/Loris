import {Component} from 'react';
import Sidebar from "./Sidebar";
import PropTypes from "prop-types";

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
    const {t} = this.props;
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
}

Sidebar.propTypes = {
  t: PropTypes.func,
}
export default HasHEDIcon;
