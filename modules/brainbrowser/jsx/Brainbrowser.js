/* exported RBrainBrowser */

/**
 * Brainbrowser Page.
 *
 * Renders Brainbrowser main page
 *
 * @author Alex Ilea
 * @version 1.0.0
 *
 * */
var BrainBrowser = React.createClass({

  getInitialState: function() {
    return {
      defaultPanelSize: 300
    };
  },

  componentDidMount: function() {
    // Retrieve module preferences and set panelSize
    var modulePrefs = JSON.parse(localStorage.getItem('modulePrefs'));
    var panelSize = this.state.defaultPanelSize;

    if (modulePrefs !== null) {
      this.modulePrefs = modulePrefs; // make prefs accesible within component
      if (modulePrefs[loris.TestName].panelSize !== undefined) {
        panelSize = modulePrefs[loris.TestName].panelSize;
      }
    }

    this.setState({
      panelSize: panelSize
    });
  },

  handleChange: function(e) {
    var value = e.target.value;
    var modulePrefs = {};

    if (value === "") {
      value = this.state.defaultPanelSize;
    }

    if (this.modulePrefs) {
      modulePrefs = this.modulePrefs;
    } else {
      modulePrefs[loris.TestName] = {};
    }

    // Save panelSize in localStorage
    modulePrefs[loris.TestName].panelSize = value;
    localStorage.setItem('modulePrefs', JSON.stringify(modulePrefs));
    this.setState({
      panelSize: value
    });
  },

  render: function() {
    var options = {
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
      1000: '1000 Pixels'
    };

    return (
      <div>
        <div id="brainbrowser-wrapper" className="brainbrowser-wrapper">
          <div id="global-controls" className="global-controls">
            <button id="sync-volumes" className="control">Sync Volumes</button>
            <button id="reset-view" className="control">Reset View</button>
            <select id="panel-size"
                    className="control"
                    value={this.state.panelSize}
                    onChange={this.handleChange}>
              <option value="-1">Auto</option>
              {Object.keys(options).map(function(option) {
                return (
                  <option value={option} key={option}>{options[option]}</option>
                );
              })}
            </select>
          </div>
        </div>
        <div id="brainbrowser" className="brainbrowser"></div>
        <div id="loading" className="loading-message">Loading...</div>
      </div>
    );
  }

});

var RBrainBrowser = React.createFactory(BrainBrowser);

window.BrainBrowser = BrainBrowser;
window.RBrainBrowser = RBrainBrowser;

export default BrainBrowser;
