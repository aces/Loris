import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

/**
 * User Accounts Index Component.
 *
 * This Component fetches the user account data from the server and feeds it to
 * the Filterable Datatable component to be formated, filtered and sorted.
 *
 * When clicking on the Add User button or a Username, this component redirects
 * the user to a form that allows them to add or edit a user.
 */
class UserAccountsIndex extends Component {
  /**
   * {@inheritdoc}
   */
  constructor() {
    super();

    this.state = {
      data: {},
      error: false,
      isLoaded: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.addUser = this.addUser.bind(this);
  }

  /**
   * {@inheritdoc}
   */
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
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, row) {
    let url;
    let result = <td>{cell}</td>;
    switch (column) {
      case 'Site':
        // If user has multiple sites, join array of sites into string
        result = (
          <td>{cell
            .map((centerId) => this.state.data.fieldOptions.sites[centerId])
            .join(', ')}
          </td>
        );
        if (cell.length === 0) {
          result = (
            <td>This user has no site affiliations</td>
          );
        }
        break;
      case 'Project':
        // If user has multiple projects, join array of sites into string
        result = (
          <td>{cell.map(
              (projectId) => this.state.data.fieldOptions.projects[projectId]
            ).join(', ')}
          </td>
        );
        if (cell.length === 0) {
          result = (
            <td>This user has no project affiliations</td>
          );
        }
        break;
      case 'Username':
        url = loris.BaseURL + '/user_accounts/edit_user/' + row.Username;
        result = <td><a href ={url}>{cell}</a></td>;
        break;
      case 'Active':
        if (row.Active === 'Y') {
          result = <td>Yes</td>;
        } else if (row.Active === 'N') {
          result = <td>No</td>;
        }
        break;
      case 'Pending Approval':
        if (row['Pending Approval'] === 'Y') {
          result = <td>Yes</td>;
        } else if (row['Pending Approval'] === 'N') {
          result = <td>No</td>;
        }
        break;
    }
    return result;
  }

  /**
   * Changes url to be able to add or edit a User.
   */
  addUser() {
    location.href='/user_accounts/edit_user/';
  }

  /**
   * {@inheritdoc}
   *
   * @return {object}
   */
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
    * queried columns in _setupVariables() in userAccounts.class.inc
    */
    const options = this.state.data.fieldOptions;
    const fields = [
      {label: 'Site', show: true, filter: {
        name: 'site',
        type: 'multiselect',
        options: options.sites,
      }},
      {label: 'Project', show: true, filter: {
        name: 'project',
        type: 'select',
        options: options.projects,
      }},
      {label: 'Username', show: true, filter: {
        name: 'username',
        type: 'text',
      }},
      {label: 'Full Name', show: true, filter: {
        name: 'fullName',
        type: 'text',
      }},
      {label: 'Email', show: true, filter: {
        name: 'email',
        type: 'text',
      }},
      {label: 'Active', show: true, filter: {
        name: 'active',
        type: 'select',
        options: options.actives,
      }},
      {label: 'Pending Approval', show: true, filter: {
        name: 'pendingApproval',
        type: 'select',
        options: options.pendingApprovals,
      }},
      {label: 'Account Request Date', show: true, filter: {
        name: 'accountRequestDate',
        type: 'date',
        hide: true,
      }},
    ];
    const actions = [
      {label: 'Add User', action: this.addUser},
    ];

    return (
      <FilterableDataTable
        name="userAccounts"
        title='User Accounts'
        data={this.state.data.Data}
        fields={fields}
        getFormattedCell={this.formatColumn}
        actions={actions}
      />
    );
  }
}

UserAccountsIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <UserAccountsIndex
      dataURL={`${loris.BaseURL}/user_accounts/?format=json`}
      hasPermission={loris.userHasPermission}
    />
  );
});
