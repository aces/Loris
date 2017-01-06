"use strict";

/* exported RBreadcrumbs */

/**
 * This file contains React component for Breadcrumbs.
 *
 * @author Loris Team
 * @version 1.0.0
 *
 */

/**
 * Breadcrumbs Component.
 * Used for navigation on all Loris pages.
 */
var Breadcrumbs = React.createClass({
  displayName: "Breadcrumbs",

  render: function render() {
    var baseurl = this.props.baseURL;
    var breadcrumbs = this.props.breadcrumbs.map(function (element, i) {
      var url = baseurl + element.query;
      var crumb = React.createElement(
        "a",
        { key: 'crumb_' + i, href: url, className: "btn btn-primary" },
        React.createElement(
          "div",
          null,
          element.text
        )
      );
      return crumb;
    });
    return React.createElement(
      "div",
      { className: "row" },
      React.createElement(
        "div",
        { className: "col-xs-12" },
        React.createElement(
          "div",
          { id: "bc2", className: "btn-group btn-breadcrumb" },
          React.createElement(
            "a",
            { href: baseurl, className: "btn btn-primary" },
            React.createElement("span", { className: "glyphicon glyphicon-home", "aria-hidden": "true" })
          ),
          breadcrumbs
        )
      )
    );
  }
});

var RBreadcrumbs = React.createFactory(Breadcrumbs);