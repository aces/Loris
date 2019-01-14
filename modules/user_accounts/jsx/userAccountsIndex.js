import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

class UserAccountsIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      error: false,
      isLoaded: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.addUser = this.addUser.bind(this);
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
      .then((data) => {
        // Convert concatenated string of sites to array
        data.Data = data.Data.map((row) => {
          row[0] = row[0].split('; ');
          return row;
        });
        this.setState({data});
      })
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
    let url;
    let result = <td>{cell}</td>;
    switch (column) {
      case 'Site':
        // If user has multiple sites, join array of sites into string
        result = <td>{cell.join('; ')}</td>;
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

  addUser() {
    location.href='/user_accounts/edit_user/';
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
    * queried columns in _setupVariables() in userAccounts.class.inc
    */
    const options = this.state.data.fieldOptions;
    const fields = [
      {label: 'Site', show: true, filter: {
        name: 'site',
        type: 'select',
        options: options.sites,
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
  ReactDOM.render(
    <UserAccountsIndex
      dataURL={`${loris.BaseURL}/user_accounts/?format=json`}
      hasPermission={loris.userHasPermission}
    />,
    document.getElementById('lorisworkspace')
  );
});
