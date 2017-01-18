"use strict";

/* exported RFilterTable */

/**
 * This file contains React component for Filter Table
 *
 * @author Loris Team
 * @version 1.0.0
 *
 */

/**
 * Filter Table component
 * A wrapper for form elements of a selection filter
 */
var FilterTable = React.createClass({
  displayName: "FilterTable",

  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    Module: React.PropTypes.string.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      filterClass: "col-md-9"
    };
  },
  getInitialState: function getInitialState() {
    return { collapsed: false };
  },
  toggleCollapsed: function toggleCollapsed() {
    this.setState({ collapsed: !this.state.collapsed });
  },
  render: function render() {
    // Selection filter open by default
    var glyphClass = "glyphicon pull-right glyphicon-chevron-up";
    var panelClass = "panel-collapse collapse in";

    // Change arrow direction when closed
    if (this.state.collapsed) {
      glyphClass = "glyphicon pull-right glyphicon-chevron-down";
    }

    return React.createElement(
      "div",
      { className: "panel panel-primary" },
      React.createElement(
        "div",
        { className: "panel-heading",
          onClick: this.toggleCollapsed,
          "data-toggle": "collapse",
          "data-target": "#selection-filter"
        },
        "Selection Filter",
        React.createElement("span", { className: glyphClass })
      ),
      React.createElement(
        "div",
        { id: "selection-filter", className: panelClass, role: "tabpanel" },
        React.createElement(
          "div",
          { className: "panel-body" },
          React.createElement(
            "div",
            { className: "row" },
            React.createElement(
              "div",
              { className: this.props.filterClass },
              this.props.children
            )
          )
        )
      )
    );
  }
});

var RFilterTable = React.createFactory(FilterTable);