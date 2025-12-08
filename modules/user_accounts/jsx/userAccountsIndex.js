import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';
import hiStrings from '../locale/hi/LC_MESSAGES/user_accounts.json';
import jaStrings from '../locale/ja/LC_MESSAGES/user_accounts.json';
import frStrings from '../locale/fr/LC_MESSAGES/user_accounts.json';

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
 *
 * @param {object} props - React component properties
 */
class UserAccountsIndex extends Component {
  /**
   * {@inheritdoc}
   *
   * @param props
   */
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
    const {t} = this.props;
    let url;
    let result = <td>{cell}</td>;
    switch (column) {
    case t('Site', {ns: 'loris', count: 1}):
      result = (
        <td>
          {cell
            .map((centerId) => this.state.data.fieldOptions.sites[centerId])
            .join(', ')}
        </td>
      );
      if (cell.length === 0) {
        result = (
          <td>
            {t('This user has no site affiliations', {ns: 'user_accounts'})}
          </td>
        );
      }
      break;
    case t('Project', {ns: 'loris', count: 1}):
      result = (
        <td>
          {cell.map(
            (projectId) => this.state.data.fieldOptions.projects[projectId]
          ).join(', ')}
        </td>
      );
      if (cell.length === 0) {
        result = (
          <td>
            {t('This user has no project affiliations', {ns: 'user_accounts'})}
          </td>
        );
      }
      break;
    case t('Username', {ns: 'loris'}):
      const username = row[t('Username', {ns: 'loris'})];
      url = loris.BaseURL + '/user_accounts/edit_user/' + username;
      result = <td><a href={url}>{cell}</a></td>;
      break;
    case t('Active', {ns: 'loris'}):
      const activeKey = t('Active', {ns: 'loris'});
      if (row[activeKey] === 'Y') {
        result = <td>{t('Yes', {ns: 'loris'})}</td>;
      } else if (row[activeKey] === 'N') {
        result = <td>{t('No', {ns: 'loris'})}</td>;
      }
      break;
    case t('Pending Approval', {ns: 'user_accounts'}):
      const pendingKey = t('Pending Approval', {ns: 'user_accounts'});
      if (row[pendingKey] === 'Y') {
        result = <td>{t('Yes', {ns: 'loris'})}</td>;
      } else if (row[pendingKey] === 'N') {
        result = <td>{t('No', {ns: 'loris'})}</td>;
      }
      break;
    }
    return result;
  }

  /**
   * Changes url to be able to add or edit a User.
   */
  addUser() {
    location.href = '/user_accounts/edit_user/';
  }

  /**
   * {@inheritdoc}
   *
   * @return {object}
   */
  render() {
    const {t} = this.props;
    // If error occurs, return a message.
    // XXX: Replace this with a UI component for 500 errors.
    if (this.state.error) {
      return (
        <h3>
          {t('An error occured while loading the page.', {ns: 'loris'})}
        </h3>
      );
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
      {
        label: t('Site', {ns: 'loris', count: 1}),
        show: true,
        filter: {
          name: 'site',
          type: 'multiselect',
          options: options.sites,
        },
      },
      {
        label: t('Project', {ns: 'loris', count: 1}),
        show: true,
        filter: {
          name: 'project',
          type: 'select',
          options: options.projects,
        },
      },
      {
        label: t('Username', {ns: 'loris'}),
        show: true,
        filter: {
          name: 'username',
          type: 'text',
        },
      },
      {
        label: t('Full Name', {ns: 'user_accounts'}),
        show: true,
        filter: {
          name: 'fullName',
          type: 'text',
        },
      },
      {
        label: t('Email', {ns: 'loris'}),
        show: true,
        filter: {
          name: 'email',
          type: 'text',
        },
      },
      {
        label: t('Active', {ns: 'loris'}),
        show: true,
        filter: {
          name: 'active',
          type: 'select',
          options: options.actives,
        },
      },
      {
        label: t('Pending Approval', {ns: 'user_accounts'}),
        show: true,
        filter: {
          name: 'pendingApproval',
          type: 'select',
          options: options.pendingApprovals,
        },
      },
      {
        label: t('Account Request Date', {ns: 'user_accounts'}),
        show: true,
        filter: {
          name: 'accountRequestDate',
          type: 'date',
          hide: true,
        },
      },
    ];
    const actions = [
      {
        label: t('Add User', {ns: 'user_accounts'}),
        action: this.addUser,
      },
    ];

    return (
      <FilterableDataTable
        name="userAccounts"
        title={t('User Accounts', {ns: 'user_accounts'})}
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
  t: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('ja', 'user_accounts', jaStrings);
  i18n.addResourceBundle('hi', 'user_accounts', hiStrings);
  i18n.addResourceBundle('fr', 'user_accounts', frStrings);
  const Index = withTranslation(
    ['user_accounts', 'loris']
  )(UserAccountsIndex);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <Index
      dataURL={`${loris.BaseURL}/user_accounts/?format=json`}
      hasPermission={loris.userHasPermission}
    />
  );
});

export default withTranslation(['user_accounts', 'loris'])(UserAccountsIndex);
