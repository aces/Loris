import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Tabs, TabPane} from 'Tabs';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

class IssueTrackerIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      error: false,
      isLoaded: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
  }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
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
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   *
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, row) {
    if (column === 'Title') {
      let cellLinks = [];
      cellLinks.push(
        <a href={loris.BaseURL + '/issue_tracker/issue/?issueID=' +
        row['Issue ID']}>
          {row.Title}
        </a>
      );
      return (
        <td>
          {cellLinks}
        </td>
      );
    }

    if (column === 'Issue ID') {
      let cellLinks = [];
      cellLinks.push(
        <a href={loris.BaseURL + '/issue_tracker/issue/?issueID=' +
        row['Issue ID']}>
          {cell}
        </a>
      );
      return (<td>{cellLinks}</td>);
    }

    if (column === 'Priority') {
      switch (cell) {
        case 'normal':
          return <td style={{background: '#CCFFCC'}}>Normal</td>;
        case 'high':
          return <td style={{background: '#EEEEAA'}}>High</td>;
        case 'urgent':
          return <td style={{background: '#CC6600'}}>Urgent</td>;
        case 'immediate':
          return <td style={{background: '#E4A09E'}}>Immediate</td>;
        case 'low':
          return <td style={{background: '#99CCFF'}}>Low</td>;
        default:
          return <td>None</td>;
      }
    }

    if (column === 'PSCID' && row.PSCID !== null) {
      let cellLinks = [];
      cellLinks.push(
        <a href={loris.BaseURL + '/' +
        row.CandID + '/'}>
          {cell}
        </a>
      );
      return (
        <td>
          {cellLinks}
        </td>
      );
    }

    if (column === 'Visit Label' && row['Visit Label'] !== null) {
      let cellLinks = [];
      cellLinks.push(
        <a href={loris.BaseURL + '/instrument_list/?candID=' +
                row.CandID + '&sessionID=' + row.SessionID }>
          {cell}
        </a>
      );
      return (
        <td>
          {cellLinks}
        </td>
      );
    }

    return <td>{cell}</td>;
  }

  render() {
    // If error occurs, return a message.
    // XXX: Replace this with a UI component for 500 errors.
    if (this.state.error) {
      return <h3>An error occured while loading the page.</h3>;
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
      {label: 'Issue ID', show: true, filter: {
        name: 'issueID',
        type: 'text',
      }},
      {label: 'Title', show: true, filter: {
        name: 'title',
        type: 'text',
      }},
      {label: 'Module', show: true, filter: {
        name: 'module',
        type: 'select',
        options: options.modules,
      }},
      {label: 'Category', show: true, filter: {
        name: 'category',
        type: 'select',
        options: options.categories,
      }},
      {label: 'Reporter', show: true, filter: {
        name: 'reporter',
        type: 'select',
        options: options.reporters,
      }},
      {label: 'Assignee', show: true, filter: {
        name: 'assignee',
        type: 'select',
        options: options.assignees,
      }},
      {label: 'Status', show: true, filter: {
        name: 'status',
        type: 'select',
        options: options.statuses,
        }},
      {label: 'Priority', show: true, filter: {
        name: 'priority',
        type: 'select',
        options: options.priorities,
        }},
      {label: 'Site', show: true, filter: {
        name: 'site',
        type: 'select',
        options: options.sites,
        }},
      {label: 'PSCID', show: true, filter: {
        name: 'pscid',
        type: 'text',
        }},
      {label: 'Visit Label', show: true, filter: {
        name: 'visitLabel',
        type: 'text',
        }},
      {label: 'Last Update', show: true},
      {label: 'SessionID', show: false},
      {label: 'CandID', show: false},
    ];
    const tabs = [
      {id: 'allActiveIssues', label: 'All Active Issues'},
      {id: 'closedIssues', label: 'Closed Issues'},
      {id: 'myIssues', label: 'My Issues'},
    ];

    return (
      <Tabs tabs={tabs} defaultTab="allActiveIssues" updateURL={true}>
        <TabPane TabId={tabs[0].id}>
          <FilterableDataTable
            name="issuesTracker"
            data={this.state.data.Data}
            fields={fields}
            getFormattedCell={this.formatColumn}
          />
        </TabPane>
      </Tabs>
    );
  }
}

IssueTrackerIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <IssueTrackerIndex
      dataURL={`${loris.BaseURL}/issue_tracker/?format=json`}
      hasPermission={loris.userHasPermission}
    />,
    document.getElementById('lorisworkspace')
  );
});
