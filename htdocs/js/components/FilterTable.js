FilterTable = React.createClass({
  displayName: "FilterTable",

  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    'Module': React.PropTypes.string.isRequired
  },
  getDefaultProps: function () {
    return {
      "filterClass": "col-md-9"
    };
  },
  getInitialState: function () {
    return { 'collapsed': false };
  },
  toggleCollapsed: function () {
    this.setState({ 'collapsed': !this.state.collapsed });
  },
  render: function () {
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

RFilterTable = React.createFactory(FilterTable);
