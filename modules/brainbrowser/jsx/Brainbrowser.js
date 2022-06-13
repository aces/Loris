/* exported RBrainBrowser */

import React, {Component} from 'react';

/**
 * Brainbrowser Page.
 *
 * Renders Brainbrowser main page
 *
 * @author Alex Ilea
 * @version 1.0.0
 *
 */
class BrainBrowser extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      defaultPanelSize: 300,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    // Retrieve module preferences
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

    // Make prefs accessible within component
    this.modulePrefs = modulePrefs;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  handleChange(e) {
    const panelSize = e.target.value || this.state.defaultPanelSize;

    // Save panelSize in localStorage
    this.modulePrefs[loris.TestName].panelSize = panelSize;
    localStorage.setItem('modulePrefs', JSON.stringify(this.modulePrefs));

    this.setState({panelSize});
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let options = {
      100: '100 Pixels',
      200: '200 Pixels',
      256: '256 Pixels',
      300: '300 Pixels (Default)',
      400: '400 Pixels',
      500: '500 Pixels',
      600: '600 Pixels',
      700: '700 Pixels',
      800: '800 Pixels',
      900: '900 Pixels',
      1000: '1000 Pixels',
    };

    return (
      <div>
        <div id='brainbrowser-wrapper' className='brainbrowser-wrapper'>
          <div id='global-controls' className='global-controls'>
            <button id='sync-volumes' className='control'>Sync Volumes</button>
            <button id='reset-view' className='control'>Reset View</button>
            <select id='panel-size'
                    className='control'
                    value={this.state.panelSize}
                    onChange={this.handleChange}>
              <option value='-1'>Auto</option>
              {Object.keys(options).map(function(option) {
                return (
                  <option value={option} key={option}>{options[option]}</option>
                );
              })}
            </select>
          </div>
        </div>
        <div id='brainbrowser' className='brainbrowser'/>
        <div id='loading' className='loading-message'>Loading...</div>
      </div>
    );
  }
}

let RBrainBrowser = React.createFactory(BrainBrowser);

window.BrainBrowser = BrainBrowser;
window.RBrainBrowser = RBrainBrowser;

export default BrainBrowser;
