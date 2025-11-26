/* exported RBrainBrowser */

import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import i18n from 'I18nSetup'; 
import hiStrings from '../locale/hi/LC_MESSAGES/brainbrowser.json'; 

/**
 * Brainbrowser Page.
 *
 * Renders Brainbrowser main page
 *
 * @author Alex Ilea
 * @version 1.0.0
 */
class BrainBrowser extends Component {
  // ... (Constructor and ComponentDidMount remain the same) ...
  constructor(props) {
    super(props);
    this.state = {
      defaultPanelSize: 300,
      panelSize: 300,
    };
    this.handleChange = this.handleChange.bind(this);
  }

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
  
  handleChange(e) {
    const panelSize = e.target.value || this.state.defaultPanelSize;
    this.modulePrefs[loris.TestName].panelSize = panelSize;
    localStorage.setItem('modulePrefs', JSON.stringify(this.modulePrefs));
    this.setState({panelSize});
  }
  // ... (End of unchanged methods) ...

  /**
   * Renders the React component.
   * Uses t() for all displayed strings.
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props; 
    const ns = 'brainbrowser'; 

    let options = {
      100: t('100 Pixels', {ns}),
      200: t('200 Pixels', {ns}),
      256: t('256 Pixels', {ns}),
      300: t('300 Pixels (Default)', {ns}),
      400: t('400 Pixels', {ns}),
      500: t('500 Pixels', {ns}),
      600: t('600 Pixels', {ns}),
      700: t('700 Pixels', {ns}),
      800: t('800 Pixels', {ns}),
      900: t('900 Pixels', {ns}),
      1000: t('1000 Pixels', {ns}),
    };

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
            <select id='panel-size'
              className='control'
              value={this.state.panelSize}
              onChange={this.handleChange}>
              <option value='-1'>
                {t('Auto', {ns})}
              </option>
              {Object.keys(options).map(function(option) {
                return (
                  <option value={option} key={option}>{options[option]}</option>
                );
              })}
            </select>
          </div>
        </div>
        <div id='brainbrowser' className='brainbrowser'/>
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
}

const TranslatedBrainBrowser = withTranslation(['brainbrowser', 'loris'])(BrainBrowser);

let RBrainBrowser = React.createFactory(TranslatedBrainBrowser);

window.BrainBrowser = TranslatedBrainBrowser;
window.RBrainBrowser = RBrainBrowser;
window.hiStrings = hiStrings;

export default TranslatedBrainBrowser;
