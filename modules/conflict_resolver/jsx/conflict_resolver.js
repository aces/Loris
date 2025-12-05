import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import {Tabs, TabPane} from 'Tabs';
import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';
import PropTypes from 'prop-types';

import UnresolvedFilterableDataTable from './unresolved_filterabledatatable';
import ResolvedFilterableDataTable from './resolved_filterabledatatable';

import hiStrings from '../locale/hi/LC_MESSAGES/conflict_resolver.json';
import jaStrings from '../locale/ja/LC_MESSAGES/conflict_resolver.json';

/**
 * Conflict Resolver class.
 */
class ConflictResolver extends Component {
  /**
   * Constructor
   *
   * @param {object} props The props based to the component.
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
   * @param {number} tabId The Id of the selected tab.
   */
  onTabChange(tabId) {
    this.setState({activeTab: tabId});
  }

  /**
   * Render tabs for conflict resolve module.
   *
   * @return {JSX}
   */
  render() {
    const {t} = this.props;
    const tabs = [
      {id: 'unresolved', label: t('Unresolved', {ns: 'conflict_resolver'})},
      {id: 'resolved', label: t('Resolved', {ns: 'conflict_resolver'})},
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
  i18n.addResourceBundle('ja', 'conflict_resolver', jaStrings);
  i18n.addResourceBundle('hi', 'conflict_resolver', hiStrings);
  const Index = withTranslation(
    ['conflict_resolver', 'loris']
  )(ConflictResolver);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(<Index />);
});

ConflictResolver.propTypes = {
  t: PropTypes.func,
};

export default withTranslation(
  ['conflict_resolver', 'loris'])(ConflictResolver);

