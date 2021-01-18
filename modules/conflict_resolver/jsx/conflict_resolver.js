import React, {Component} from 'react';
import {Tabs, TabPane} from 'Tabs';
import UnresolvedFilterableDataTable from './unresolved_filterabledatatable';
import ResolvedFilterableDataTable from './resolved_filterabledatatable';

/**
 * Conflict Resolver class.
 */
class ConflictResolver extends Component {
  /**
   * Constructor
   *
   * @param {Object} props The props based to the component.
   */
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'unresolved',
    };

    this.onTabChange = this.onTabChange.bind(this);
  }

  /**
   * Update active tab to selected tab.
   *
   * @param {int} tabId The Id of the selected tab.
   */
  onTabChange(tabId) {
    this.setState({activeTab: tabId});
  }

  /**
   * Render tabs for conflict resolve module.
   *
   * @return {jsx}
   */
  render() {
    const tabs = [
      {id: 'unresolved', label: 'Unresolved'},
      {id: 'resolved', label: 'Resolved'},
    ];

    let filtertable;
    switch (this.state.activeTab) {
      case 'unresolved':
        filtertable = (
          <UnresolvedFilterableDataTable />
        );
        break;
      case 'resolved':
        filtertable = (
          <ResolvedFilterableDataTable />
        );
        break;
    }
    return (
      <Tabs
        tabs={tabs}
        defaultTab={this.state.activeTab}
        updateURL={false}
        onTabChange={this.onTabChange}
      >
        <TabPane TabId={this.state.activeTab}>
          {filtertable}
        </TabPane>
      </Tabs>
    );
  }
}

window.addEventListener('load', () => {
  ReactDOM.render(
    <ConflictResolver />,
    document.getElementById('lorisworkspace')
  );
});

