/* exported RTabs, TabPane */

/**
 * This file contains React components for Tabs component.
 *
 * @author Loris Team
 * @version 1.0.0
 *
 */

/**
 * Tabs Component.
 * React wrapper for Bootstrap tabs. Allows to dynamically render tabs
 * and corresponding tab panes.
 */
var Tabs = React.createClass({
  displayName: "Tabs",

  propTypes: {
    tabs: React.PropTypes.array.isRequired,
    defaultTab: React.PropTypes.string
  },
  getInitialState: function () {
    var activeTab = "";
    if (this.props.defaultTab) {
      activeTab = this.props.defaultTab;
    } else if (this.props.tabs.length > 0) {
      activeTab = this.props.tabs[0].id;
    }

    return {
      activeTab: activeTab
    };
  },
  componentDidMount: function () {
    this.setActiveTab(this.state.activeTab);
  },
  setActiveTab: function (tabId) {
    var e = new CustomEvent("tab-changed", {
      detail: {
        activeTab: tabId
      }
    });
    window.dispatchEvent(e);
  },
  handleClick: function (tabId) {
    this.setActiveTab(tabId);
    this.setState({ activeTab: tabId });
  },
  render: function () {
    // Build a list of tabs
    var tabs = this.props.tabs.map(function (tab) {
      var tabClass;
      if (this.state.activeTab === tab.id) {
        tabClass = "active";
      }
      var href = "#" + tab.id;
      var tabID = "tab-" + tab.id;
      return React.createElement(
        "li",
        { role: "presentation",
          className: tabClass,
          onClick: this.handleClick.bind(tab.id)
        },
        React.createElement(
          "a",
          { id: tabID, href: href, role: "tab", "data-toggle": "tab" },
          tab.label
        )
      );
    }, this);

    return React.createElement(
      "div",
      null,
      React.createElement(
        "ul",
        { className: "nav nav-tabs nav-tabs-loris", role: "tablist" },
        tabs
      ),
      React.createElement(
        "div",
        { className: "tab-content" },
        this.props.children
      )
    );
  }
});

var TabPane = React.createClass({
  displayName: "TabPane",

  propTypes: {
    TabId: React.PropTypes.string.isRequired,
    Title: React.PropTypes.string
  },
  getInitialState: function () {
    return {
      isActive: this.props.TabId
    };
  },
  componentWillMount: function () {
    window.addEventListener("tab-changed", function (e) {
      if (e.detail.activeTab === this.props.TabId) {
        this.setState({ isActive: true });
      } else {
        this.setState({ isActive: false });
      }
    }.bind(this), false);
  },
  render: function () {
    var classList = "tab-pane";
    var title;

    if (this.state.isActive) {
      classList += " active";
    }

    if (this.props.Title) {
      title = React.createElement(
        "h1",
        null,
        this.props.Title
      );
    }

    // Render the HTML
    return React.createElement(
      "div",
      { role: "tabpanel", className: classList, id: this.props.TabId },
      title,
      this.props.children
    );
  }
});

var RTabs = React.createFactory(Tabs);
