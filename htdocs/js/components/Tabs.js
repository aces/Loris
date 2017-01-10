"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* exported Tabs, TabPane */

/**
 * This file contains React components for Tabs component.
 *
 * @author Loris Team
 * @version 1.1.0
 *
 */

/**
 * Tabs Component.
 * React wrapper for Bootstrap tabs. Allows to dynamically render tabs
 * and corresponding tab panes.
 *
 * ================================================
 * Usage:
 *
 * 1. Define an array of tabs with IDs and labels
 *
 * `let tabList = [{id: "tab1", label: "This is tab title"}];`
 *
 * 2. Pass tabList as <Tab> property and <TabPane> as child
 *  ```
 * <Tabs tabs={tabList} defaultTab="tab1">
 *   <TabPane TabId={tabList[0].id}>
 *     // Tab content goes here
 *   </TabPane>
 * </Tabs>
 * ```
 * =================================================
 *
 */
var Tabs = function (_React$Component) {
  _inherits(Tabs, _React$Component);

  function Tabs(props) {
    _classCallCheck(this, Tabs);

    var _this = _possibleConstructorReturn(this, (Tabs.__proto__ || Object.getPrototypeOf(Tabs)).call(this, props));

    var activeTab = "";
    if (_this.props.defaultTab) {
      activeTab = _this.props.defaultTab;
    } else if (_this.props.tabs.length > 0) {
      activeTab = _this.props.tabs[0].id;
    }

    _this.state = {
      activeTab: activeTab
    };

    _this.handleClick = _this.handleClick.bind(_this);
    _this.getTabs = _this.getTabs.bind(_this);
    _this.getTabPanes = _this.getTabPanes.bind(_this);
    return _this;
  }

  _createClass(Tabs, [{
    key: "handleClick",
    value: function handleClick(tabId) {
      this.setState({ activeTab: tabId });
      this.props.onTabChange(tabId);
    }
  }, {
    key: "getTabs",
    value: function getTabs() {
      var tabs = this.props.tabs.map(function (tab) {
        var tabClass = this.state.activeTab === tab.id ? 'active' : null;
        var href = "#" + tab.id;
        var tabID = "tab-" + tab.id;
        return React.createElement(
          "li",
          {
            role: "presentation",
            className: tabClass,
            onClick: this.handleClick.bind(null, tab.id),
            key: tab.id
          },
          React.createElement(
            "a",
            { id: tabID, href: href, role: "tab", "data-toggle": "tab" },
            tab.label
          )
        );
      }.bind(this));

      return tabs;
    }
  }, {
    key: "getTabPanes",
    value: function getTabPanes() {
      var tabPanes = React.Children.map(this.props.children, function (child, key) {
        return React.cloneElement(child, {
          activeTab: this.state.activeTab,
          key: key
        });
      }.bind(this));

      return tabPanes;
    }
  }, {
    key: "render",
    value: function render() {
      var tabs = this.getTabs();
      var tabPanes = this.getTabPanes();
      var tabStyle = {
        marginLeft: 0,
        marginBottom: '5px'
      };

      return React.createElement(
        "div",
        null,
        React.createElement(
          "ul",
          { className: "nav nav-tabs", role: "tablist", style: tabStyle },
          tabs
        ),
        React.createElement(
          "div",
          { className: "tab-content" },
          tabPanes
        )
      );
    }
  }]);

  return Tabs;
}(React.Component);

Tabs.propTypes = {
  tabs: React.PropTypes.array.isRequired,
  defaultTab: React.PropTypes.string
};
Tabs.defaultProps = {
  onTabChange: function onTabChange() {}
};

/*
 * TabPane component.
 * Used to wrap content for every tab.
 */

var TabPane = function (_React$Component2) {
  _inherits(TabPane, _React$Component2);

  function TabPane() {
    _classCallCheck(this, TabPane);

    return _possibleConstructorReturn(this, (TabPane.__proto__ || Object.getPrototypeOf(TabPane)).apply(this, arguments));
  }

  _createClass(TabPane, [{
    key: "render",
    value: function render() {
      var classList = "tab-pane";
      var title = void 0;

      if (this.props.TabId === this.props.activeTab) {
        classList += " active";
      }
      if (this.props.Title) {
        title = React.createElement(
          "h1",
          null,
          this.props.Title
        );
      }

      return React.createElement(
        "div",
        { role: "tabpanel", className: classList, id: this.props.TabId },
        title,
        this.props.children
      );
    }
  }]);

  return TabPane;
}(React.Component);

TabPane.propTypes = {
  TabId: React.PropTypes.string.isRequired,
  Title: React.PropTypes.string,
  activeTab: React.PropTypes.string
};