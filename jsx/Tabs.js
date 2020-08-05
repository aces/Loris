/**
 * This file contains React components for Tabs component.
 *
 * @author Loris Team
 * @version 1.1.0
 *
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

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
class Tabs extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    const hash = window.location.hash;
    let activeTab = '';

    /**
     * Determine the initial active tab in this order
     * 1. Try to infer from the URL, otherwise
     * 2. Try to infer from the defaultTab prop, otherwise
     * 3. Set to be the first tab of the list
     */
    if (this.props.updateURL && hash) {
      activeTab = hash.substr(1);
    } else if (this.props.defaultTab) {
      activeTab = this.props.defaultTab;
    } else if (this.props.tabs.length > 0) {
      activeTab = this.props.tabs[0].id;
    }

    this.state = {
      activeTab: activeTab,
    };

    this.handleClick = this.handleClick.bind(this);
    this.getTabs = this.getTabs.bind(this);
    this.getTabPanes = this.getTabPanes.bind(this);
  }

  /**
   * Handle clicks on a tab header to change the active
   * tab. If this.props.updateURL is set, update the window
   * URL and scroll to the top of the page.
   *
   * @param {int} tabId -- The tab clicked on
   * @param {Event} e -- The click event
   */
  handleClick(tabId, e) {
    this.setState({activeTab: tabId});
    this.props.onTabChange(tabId);

    // Add tab href to URL querystring and scroll the page to top
    if (this.props.updateURL) {
      const scrollDistance = $('body').scrollTop() || $('html').scrollTop();
      window.location.hash = e.target.hash;
      $('html,body').scrollTop(scrollDistance);
    }
  }

  /**
   * Return a list of components for the tab links.
   *
   * @return {array} -- An array of JSX components to represent
   *                    the tab's title
   */
  getTabs() {
    let tabs = (this.props.tabs).map(function(tab) {
      let tabClass = this.state.activeTab === tab.id ? 'active' : null;
      let href = '#' + tab.id;
      let tabID = 'tab-' + tab.id;
      return (
        <li
          role="presentation"
          className={tabClass}
          key={tab.id}
        >
          <a id={tabID}
             href={href}
             role="tab"
             data-toggle="tab"
             onClick={this.handleClick.bind(null, tab.id)}
          >
            {tab.label}
          </a>
        </li>
      );
    }.bind(this));

    return tabs;
  }

  /**
   * Return the body of the active tab.
   *
   * @return {object} -- A JSX component of the active tab panel.
   */
  getTabPanes() {
    let tabPanes = React.Children.map(
      this.props.children,
      function(child, key) {
        if (child) {
          return React.cloneElement(child, {
            activeTab: this.state.activeTab,
            key: key,
          });
        }
      }.bind(this));

    return tabPanes;
  }

  /**
   * React lifecycle method
   *
   * @return {object} -- The rendered JSX component
   */
  render() {
    let tabs = this.getTabs();
    let tabPanes = this.getTabPanes();
    let tabStyle = {
      marginLeft: 0,
      marginBottom: '5px',
    };

    return (
      <div>
        <ul className="nav nav-tabs" role="tablist" style={tabStyle}>
          {tabs}
        </ul>
        <div className="tab-content">
          {tabPanes}
        </div>
      </div>
    );
  }
}
Tabs.propTypes = {
  tabs: PropTypes.array.isRequired,
  defaultTab: PropTypes.string,
  updateURL: PropTypes.bool,
};
Tabs.defaultProps = {
  onTabChange: function() {},
  // Set updateURL to default to true but allow for change
  // Nested tabs should set this variable to false
  updateURL: true,
};

/**
 * VerticalTabs is a React component which dynamically renders
 * a set of vertical tabs corresponding to tab panes.
 */
class VerticalTabs extends Component {
  /**
   * Construct the Component
   *
   * @param {array} props - array of React props
   */
  constructor(props) {
    super(props);

    const hash = window.location.hash;
    let activeTab = '';

    /**
     * Determine the initial active tab in this order
     * 1. Try to infer from the URL, otherwise
     * 2. Try to infer from the defaultTab prop, otherwise
     * 3. Set to be the first tab of the list
     */
    if (this.props.updateURL && hash) {
      activeTab = hash.substr(1);
    } else if (this.props.defaultTab) {
      activeTab = this.props.defaultTab;
    } else if (this.props.tabs.length > 0) {
      activeTab = this.props.tabs[0].id;
    }

    this.state = {
      activeTab: activeTab,
    };

    this.handleClick = this.handleClick.bind(this);
    this.getTabs = this.getTabs.bind(this);
    this.getTabPanes = this.getTabPanes.bind(this);
  }

  /**
   * Handle clicks on a tab header to change the active
   * tab. If this.props.updateURL is set, update the window
   * URL and scroll to the top of the page.
   *
   * @param {int} tabId -- The tab clicked on
   * @param {Event} e -- The click event
   */
  handleClick(tabId, e) {
    this.setState({activeTab: tabId});
    this.props.onTabChange(tabId);

    // Add tab href to URL querystring and scroll the page to top
    if (this.props.updateURL) {
      const scrollDistance = $('body').scrollTop() || $('html').scrollTop();
      window.location.hash = e.target.hash;
      $('html,body').scrollTop(scrollDistance);
    }
  }

  /**
   * Return a list of components for the tab links.
   *
   * @return {array} -- An array of JSX components to represent
   *                    the tab's title
   */
  getTabs() {
    let tabs = (this.props.tabs).map(function(tab) {
      let tabClass = this.state.activeTab === tab.id ? 'active' : null;
      let href = '#' + tab.id;
      let tabID = 'tab-' + tab.id;
      return (
        <li
          role="presentation"
          className={tabClass}
          key={tab.id}
        >
          <a id={tabID}
             href={href}
             role="tab"
             data-toggle="tab"
             onClick={this.handleClick.bind(null, tab.id)}
          >
            {tab.label}
          </a>
        </li>
      );
    }.bind(this));

    return tabs;
  }

  /**
   * Return the body of the active tab.
   *
   * @return {object} -- A JSX component of the active tab panel.
   */
  getTabPanes() {
    let tabPanes = React.Children.map(
      this.props.children,
      function(child, key) {
        if (child) {
          return React.cloneElement(child, {
            activeTab: this.state.activeTab,
            key: key,
          });
        }
    }.bind(this));

    return tabPanes;
  }

  /**
   * React lifecycle method
   *
   * @return {object}
   */
  render() {
    let tabs = this.getTabs();
    let tabPanes = this.getTabPanes();
    let tabStyle = {
      marginLeft: 0,
      marginBottom: '5px',
    };

    return (
      <div>
        <div className="tabbable col-md-3 col-sm-3">
          <ul
              className="nav nav-pills nav-stacked"
              role="tablist"
              style={tabStyle}>
            {tabs}
          </ul>
        </div>
        <div className="tab-content col-md-9 col-sm-9">
          {tabPanes}
        </div>
      </div>
    );
  }
}
VerticalTabs.propTypes = {
  tabs: PropTypes.array.isRequired,
  defaultTab: PropTypes.string,
  updateURL: PropTypes.bool,
};
VerticalTabs.defaultProps = {
  onTabChange: function() {},
  // Set updateURL to default to true but allow for change
  // Nested tabs should set this variable to false
  updateURL: true,
};

/**
 * TabPane component.
 * Used to wrap content for every tab.
 */
class TabPane extends Component {
    /**
     * React lifecycle method
     *
     * @return {object}
     */
  render() {
    let classList = 'tab-pane';
    let title;

    if (this.props.TabId === this.props.activeTab) {
      classList += ' active';
    }
    if (this.props.Title) {
      title = <h1>{this.props.Title}</h1>;
    }

    return (
      <div role="tabpanel" className={classList} id={this.props.TabId}>
        {title}
        {this.props.children}
      </div>
    );
  }
}
TabPane.propTypes = {
  TabId: PropTypes.string.isRequired,
  Title: PropTypes.string,
  activeTab: PropTypes.string,
};

export {
  Tabs,
  VerticalTabs,
  TabPane,
};
