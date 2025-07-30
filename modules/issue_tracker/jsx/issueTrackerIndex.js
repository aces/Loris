import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';
import {Tabs, TabPane} from 'Tabs';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import IssueTrackerBatchMode from './IssueTrackerBatchMode';

import hiStrings from '../locale/hi/LC_MESSAGES/issue_tracker.json';

/**
 * Issue Tracker Index component
 */
class IssueTrackerIndex extends Component {
  /**
   * @constructor
   *
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      error: false,
      isLoaded: false,
      activeTab: 'browse',
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Called by React when the component updates.
   *
   * @param {object} prevProps - Previous props
   * @param {object} prevState - Previous state
   */
  componentDidUpdate(prevProps, prevState) {
    // If the activeTab has changed to 'browse', refetch data
    if (prevState.activeTab !== 'browse' && this.state.activeTab === 'browse') {
      this.setState({isLoaded: false}, () => {
        this.fetchData()
          .then(() => this.setState({isLoaded: true}));
      });
    }
  }

  /**
   * Retrieve data from the provided URL and save it in state
   * Additionally add hiddenHeaders to global loris variable
   * for easy access by columnFormatter.
   *
   * @return {object}
   */
  fetchData() {
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({data}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * Handle tab changes
   *
   * @param {string} newTab - The ID of the newly selected tab
   */
  handleTabChange(newTab) {
    this.setState({activeTab: newTab});
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, row) {
    let result = <td>{cell}</td>;
    let link;
    switch (column) {
    case 'Title':
      link = (
        <a
          href={loris.BaseURL+'/issue_tracker/issue/'+row['Issue ID']}
        >
          {row.Title}
        </a>
      );
      result = <td>{link}</td>;
      break;
    case 'Issue ID':
      link = (
        <a
          href={loris.BaseURL+'/issue_tracker/issue/'+cell}
        >
          {cell}
        </a>
      );
      result = <td>{link}</td>;
      break;
    case 'Priority':
      switch (cell) {
      case 'normal':
        result = <td style={{background: '#CCFFCC'}}>Normal</td>;
        break;
      case 'high':
        result = <td style={{background: '#EEEEAA'}}>High</td>;
        break;
      case 'urgent':
        result = <td style={{background: '#CC6600'}}>Urgent</td>;
        break;
      case 'immediate':
        result = <td style={{background: '#E4A09E'}}>Immediate</td>;
        break;
      case 'low':
        result = <td style={{background: '#99CCFF'}}>Low</td>;
        break;
      default:
        result = <td>None</td>;
      }
      break;
    case 'Site':
      // if cell is an array containing all sites values
      if (
        JSON.stringify(
          Object.keys(this.state.data.centerIDs)) == JSON.stringify(cell)
      ) {
        result = <td>All Sites</td>;
      } else {
        result = <td>
          {cell.map((v) =>
            this.state.data.fieldOptions.sites[v]).filter(
            (v) => v != undefined).join(', ')}
        </td>;
      }
      break;
    case 'PSCID':
      if (row.PSCID !== null) {
        link = (
          <a href={loris.BaseURL+'/'+row.CandID + '/'}>
            {cell}
          </a>
        );
        result = <td>{link}</td>;
      }
      break;
    case 'Visit Label':
      if (row['Visit Label'] !== null) {
        link = (
          <a href={loris.BaseURL + '/instrument_list/?candID=' +
                  row.CandID + '&sessionID=' + row.SessionID }>
            {cell}
          </a>
        );
        result = <td>{link}</td>;
      }
      break;
    }

    return result;
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const { t } = this.props;

    // If error occurs, return a message.
    // XXX: Replace this with a UI component for 500 errors.
    if (this.state.error) {
      return <h3>{t('An error occured while loading the page.', {ns: 'issue_tracker'})}</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    /**
     * XXX: Currently, the order of these fields MUST match the order of the
     * queried columns in _setupVariables() in media.class.inc
     */
    const options = this.state.data.fieldOptions;
    const fields = [
      {label: t('Issue ID', {ns: 'issue_tracker'}), show: true, filter: {
        name: 'issueID',
        type: 'text',
      }},
      {label: t('Title', {ns: 'issue_tracker'}), show: true, filter: {
        name: 'title',
        type: 'text',
      }},
      {label: t('Module', {ns: 'issue_tracker'}), show: true, filter: {
        name: 'module',
        type: 'select',
        options: options.modules,
      }},
      {label: t('Category', {ns: 'issue_tracker'}), show: true, filter: {
        name: 'category',
        type: 'select',
        options: options.categories,
      }},
      {label: t('Reporter', {ns: 'issue_tracker'}), show: true, filter: {
        name: 'reporter',
        type: 'select',
        options: options.reporters,
      }},
      {label: t('Assignee', {ns: 'issue_tracker'}), show: true, filter: {
        name: 'assignee',
        type: 'select',
        options: options.assignees,
      }},
      {label: t('Status', {ns: 'issue_tracker'}), show: true, filter: {
        name: 'status',
        type: 'multiselect',
        options: options.statuses,
      }},
      {label: t('Priority', {ns: 'issue_tracker'}), show: true, filter: {
        name: 'priority',
        type: 'select',
        sortByValue: false,
        options: options.priorities,
      }},
      {label: t('Site', {ns: 'issue_tracker'}), show: true, filter: {
        name: 'site',
        type: 'multiselect',
        options: options.sites,
      }},
      {label: t('PSCID', {ns: 'issue_tracker'}), show: true, filter: {
        name: 'pscid',
        type: 'text',
      }},
      {label: t('Visit Label', {ns: 'issue_tracker'}), show: true, filter: {
        name: 'visitLabel',
        type: 'text',
      }},
      {label: t('Date Created', {ns: 'issue_tracker'}), show: false, filter: {
        name: 'dateCreated',
        type: 'date',
      }},
      {label: t('Last Update', {ns: 'issue_tracker'}), show: true},
      {label: t('SessionID', {ns: 'issue_tracker'}), show: false},
      {label: t('CandID', {ns: 'issue_tracker'}), show: false},
      {label: t('Watching', {ns: 'issue_tracker'}), show: false, filter: {
        name: 'watching',
        type: 'checkbox',
      }},
    ];

    const filterPresets = [
      {label: t('All Issues', {ns: 'issue_tracker'}), filter: {}},
      {label: t('Active Issues', {ns: 'issue_tracker'}), filter: {
        status: {
          value: ['acknowledged', 'assigned', 'feedback', 'new', 'resolved'],
        },
      }},
      {label: t('Closed Issues', {ns: 'issue_tracker'}), filter: {
        status: {value: ['closed'], exactMatch: true},
      }},
    ];

    // Add "My Issues" filter only if user has any issues
    if (this.state.data.userIssueCount > 0) {
      filterPresets.push({
        label: t('My Issues', {ns: 'issue_tracker'}),
        filter: {
          assignee: {
            value: this.state.data.fieldOptions.userID, exactMatch: true,
          },
          status: {
            value: ['acknowledged', 'assigned', 'feedback', 'new', 'resolved'],
          },
        },
      });
    }

    const addIssue = () => {
      window.location.replace(
        loris.BaseURL+'/issue_tracker/issue/new'
      );
    };
    const actions = [
      {label: t('New Issue', {ns: 'issue_tracker'}), action: addIssue},
    ];

    const tabList = [
      {
        id: 'browse',
        label: t('Browse Issues', {ns: 'issue_tracker'}),
      },
    ];

    // Only display the Batch mode tab if user has the required permission
    if (this.props.hasPermission('issue_tracker_all_issue')) {
      tabList.push({
        id: 'batch',
        label: t('Batch Edit', {ns: 'issue_tracker'}),
      });
    }

    return (
      <Tabs
        tabs={tabList}
        defaultTab={this.state.activeTab}
        updateURL={true}
        onTabChange={this.handleTabChange}
      >
        <TabPane TabId="browse">
          <FilterableDataTable
            name="issuesTracker"
            data={this.state.data.data}
            fields={fields}
            filterPresets={filterPresets}
            actions={actions}
            getFormattedCell={this.formatColumn}
          />
        </TabPane>
        <TabPane TabId="batch">
          <IssueTrackerBatchMode
            issues={this.state.data.data}
            options={{
              priorities: this.state.data.fieldOptions.priorities,
              statuses: this.state.data.fieldOptions.statuses,
              categories: this.state.data.fieldOptions.categories,
              sites: this.state.data.fieldOptions.sites,
            }}
          />
        </TabPane>
      </Tabs>
    );
  }
}

IssueTrackerIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
  t: PropTypes.func,
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('hi', 'issue_tracker', hiStrings);

  const IssueTrackerIndexWithTranslation = withTranslation(
    ['issue_tracker', 'loris']
  )(IssueTrackerIndex);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <IssueTrackerIndexWithTranslation
      dataURL={`${loris.BaseURL}/issue_tracker/?format=json`}
      hasPermission={loris.userHasPermission}
    />
  );
});
