import React, {Component} from 'react';
import {Tabs, TabPane} from 'Tabs';
import ConflictsFilterableDataTable from './conflicts_filterabledatatable';
import ResolvedFilterableDataTable from './resolved_filterabledatatable';

class ConflictResolver extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'unresolved',
    };

    this.onTabChange = this.onTabChange.bind(this);
  }

  onTabChange(tabId) {
    this.setState({activeTab: tabId});
  }

  render() {
    const tabs = [
      {id: 'unresolved', label: 'Unresolved'},
      {id: 'resolved', label: 'Resolved'},
    ];

    let filtertable;
    switch (this.state.activeTab) {
      case 'unresolved':
        filtertable = (
          <ConflictsFilterableDataTable />
        );
        break;
      case 'resolved':
        filtertable = (
          <ResolvedFilterableDataTable />
        );
        break;
    }
    return (
      <Tabs tabs={tabs} defaultTab={this.state.activeTab} updateURL={false} onTabChange={this.onTabChange}>
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

