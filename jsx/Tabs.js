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
class Tabs extends React.Component {

  constructor(props) {
    super(props);

    let activeTab = "";
    if (this.props.defaultTab) {
      activeTab = this.props.defaultTab;
    } else if (this.props.tabs.length > 0) {
      activeTab = this.props.tabs[0].id;
    }

    this.state = {
      activeTab: activeTab
    };

    this.handleClick = this.handleClick.bind(this);
    this.getTabs = this.getTabs.bind(this);
    this.getTabPanes = this.getTabPanes.bind(this);
  }

  handleClick(tabId) {
    this.setState({activeTab: tabId});
    this.props.onTabChange(tabId);
  }

  getTabs() {
    let tabs = (this.props.tabs).map(function(tab) {
      let tabClass = this.state.activeTab === tab.id ? 'active' : null;
      let href = "#" + tab.id;
      let tabID = "tab-" + tab.id;
      return (
        <li
          role="presentation"
          className={tabClass}
          onClick={this.handleClick.bind(null, tab.id)}
          key={tab.id}
        >
          <a id={tabID} href={href} role="tab" data-toggle="tab">
            {tab.label}
          </a>
        </li>
      );
    }.bind(this));

    return tabs;
  }

  getTabPanes() {
    let tabPanes = React.Children.map(this.props.children, function(child, key) {
      return React.cloneElement(child, {
        activeTab: this.state.activeTab,
        key: key
      });
    }.bind(this));

    return tabPanes;
  }

  render() {
    let tabs = this.getTabs();
    let tabPanes = this.getTabPanes();
    let tabStyle = {
      marginLeft: 0,
      marginBottom: '5px'
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
  tabs: React.PropTypes.array.isRequired,
  defaultTab: React.PropTypes.string
};
Tabs.defaultProps = {
  onTabChange: function() {}
};

/*
 * TabPane component.
 * Used to wrap content for every tab.
 */
class TabPane extends React.Component {
  render() {
    let classList = "tab-pane";
    let title;

    if (this.props.TabId === this.props.activeTab) {
      classList += " active";
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
  TabId: React.PropTypes.string.isRequired,
  Title: React.PropTypes.string,
  activeTab: React.PropTypes.string
};

window.Tabs = Tabs;
window.TabPane = TabPane;

export default {
  Tabs,
  TabPane
};
