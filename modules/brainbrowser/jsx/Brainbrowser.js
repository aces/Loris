/* exported RBrainBrowser */
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import i18n from 'I18nSetup';
import hiStrings from '../locale/hi/LC_MESSAGES/brainbrowser.json';
import jaStrings from '../locale/ja/LC_MESSAGES/brainbrowser.json';

/**
 * Brainbrowser Page.
 *
 * Renders Brainbrowser main page
 *
 * @author Alex Ilea
 * @version 1.0.0
 */
class BrainBrowser extends Component {
  /**
   * React PropTypes validation.
   * Ensures that the translation function `t` is passed
   * into this component as a required prop.
   */
  static propTypes = {
    t: PropTypes.func.isRequired,
  }
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      defaultPanelSize: 300,
      panelSize: 300,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    let modulePrefs = JSON.parse(localStorage.getItem('modulePrefs'));
    if (!modulePrefs) {
      modulePrefs = {};
    }
    if (!modulePrefs[loris.TestName]) {
      modulePrefs[loris.TestName] = {};
      modulePrefs[loris.TestName].panelSize = this.state.defaultPanelSize;
    }
    const panelSize = modulePrefs[loris.TestName].panelSize;
    this.setState({panelSize});
    this.modulePrefs = modulePrefs;
  }
  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  handleChange(e) {
    const panelSize = e.target.value || this.state.defaultPanelSize;
    this.modulePrefs[loris.TestName].panelSize = panelSize;
    localStorage.setItem('modulePrefs', JSON.stringify(this.modulePrefs));
    this.setState({panelSize});
  }

  /**
   * Renders the React component.
   * Uses t() for all displayed strings.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    const ns = 'brainbrowser';

    // Generic pixel options
    const pixelOptions = [100, 200, 256, 400, 500, 600, 700, 800, 900, 1000];
    const options = {};

    pixelOptions.forEach((count) => {
      options[count] = t('{{count}} Pixels', {ns, count});
    });

    // Special case
    options[300] = t('300 Pixels (Default)', {ns});


    return (
      <div>
        <div id='brainbrowser-wrapper' className='brainbrowser-wrapper'>
          <div id='global-controls' className='global-controls'>
            <button id='sync-volumes' className='control'>
              {t('Sync Volumes', {ns})}
            </button>
            <button id='reset-view' className='control'>
              {t('Reset View', {ns})}
            </button>
            <select
              id='panel-size'
              className='control'
              value={this.state.panelSize}
              onChange={this.handleChange}
            >
              <option value='-1'>{t('Auto', {ns})}</option>
              {Object.keys(options).map((option) => (
                <option value={option} key={option}>
                  {options[option]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div id='brainbrowser' className='brainbrowser' />
        <div id='loading' className='loading-message'>
          {t('Loading...', {ns: 'loris'})}
        </div>
      </div>
    );
  }
}

// i18next Configuration and Export
if (typeof i18n !== 'undefined') {
  i18n.addResourceBundle('hi', 'brainbrowser', hiStrings);
  i18n.addResourceBundle('ja', 'brainbrowser', jaStrings);
}

const strings = {
  hi: hiStrings,
  ja: jaStrings,
};
const activeLang = (loris?.user?.langpref || 'en').slice(0, 2);
const t = strings[activeLang] || strings['en'];

const TranslatedBrainBrowser = withTranslation(
  ['brainbrowser', 'loris']
)(BrainBrowser);

let RBrainBrowser = React.createFactory(TranslatedBrainBrowser);

window.BrainBrowser = TranslatedBrainBrowser;
window.RBrainBrowser = RBrainBrowser;
window.tStrings = t;

export default TranslatedBrainBrowser;
