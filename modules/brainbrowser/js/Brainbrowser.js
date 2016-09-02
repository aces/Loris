'use strict';

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
  displayName: 'BrainBrowser',


  getInitialState: function getInitialState() {
    return {
      defaultPanelSize: 300
    };
  },

  componentDidMount: function componentDidMount() {
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

  handleChange: function handleChange(e) {
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

  render: function render() {
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

    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { id: 'brainbrowser-wrapper', className: 'brainbrowser-wrapper' },
        React.createElement(
          'div',
          { id: 'global-controls', className: 'global-controls' },
          React.createElement(
            'button',
            { id: 'sync-volumes', className: 'control' },
            'Sync Volumes'
          ),
          React.createElement(
            'button',
            { id: 'reset-view', className: 'control' },
            'Reset View'
          ),
          React.createElement(
            'select',
            { id: 'panel-size',
              className: 'control',
              value: this.state.panelSize,
              onChange: this.handleChange },
            React.createElement(
              'option',
              { value: '-1' },
              'Auto'
            ),
            Object.keys(options).map(function (option) {
              return React.createElement(
                'option',
                { value: option, key: option },
                options[option]
              );
            })
          )
        )
      ),
      React.createElement('div', { id: 'brainbrowser', className: 'brainbrowser' }),
      React.createElement(
        'div',
        { id: 'loading', className: 'loading-message' },
        'Loading...'
      )
    );
  }

});

var RBrainBrowser = React.createFactory(BrainBrowser);