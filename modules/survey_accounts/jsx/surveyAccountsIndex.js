import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

import hiStrings from '../locale/hi/LC_MESSAGES/survey_accounts.json';
/**
 * Survey Account React Component
 */
class SurveyAccountsIndex extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
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
  }

  /**
   * Called by React when the component has been rendered on the page.
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
    let result = <td>{cell}</td>;
    switch (column) {
    case t('URL', {ns: 'survey_accounts'}):
      const url = loris.BaseURL + '/survey.php?key=' + row.URL;
      result = <td><a href={url}>{cell}</a></td>;
      break;
    case t('Instrument', {ns: 'loris', count: 1}):
      result = <td>{this.state.data.fieldOptions.instruments[cell]}</td>;
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
    const {t} = this.props;

    // If error occurs, return a message.
    // XXX: Replace this with a UI component for 500 errors.
    if (this.state.error) {
      return <h3>{t('An error occured while loading the page.',
        {ns: 'loris'})}</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    /**
     * XXX: Currently, the order of these fields MUST match the order of the
     * queried columns in _setupVariables() in survey_accounts.class.inc
     */
    const options = this.state.data.fieldOptions;
    const fields = [
      {label: t('PSCID', {ns: 'loris'}), show: true, filter: {
        name: 'pscid',
        type: 'text',
      }},
      {label: t('Visit', {ns: 'loris'}), show: true, filter: {
        name: 'visit',
        type: 'select',
        options: options.visits,
      }},
      {label: t('Instrument', {ns: 'loris', count: 1}), show: true, filter: {
        name: 'instrument',
        type: 'select',
        options: options.instruments,
      }},
      {label: t('URL', {ns: 'survey_accounts'}), show: true},
      {label: t('Status', {ns: 'survey_accounts'}), show: true, filter: {
        name: 'Status',
        type: 'select',
        options: options.statusOptions,
      }},
    ];
    const addSurvey = () => {
      location.href='/survey_accounts/addSurvey/';
    };
    const actions = [
      {label: t('Add Survey', {ns: 'survey_accounts'}), action: addSurvey},
    ];

    return (
      <FilterableDataTable
        name="surveyAccounts"
        title={t('Survey Accounts', {ns: 'survey_accounts'})}
        data={this.state.data.Data}
        fields={fields}
        getFormattedCell={this.formatColumn}
        actions={actions}
      />
    );
  }
}

SurveyAccountsIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
  t: PropTypes.func,
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('hi', 'survey_accounts', hiStrings);
  const Index = withTranslation(
    ['survey_accounts']
  )(SurveyAccountsIndex);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <Index
      dataURL={`${loris.BaseURL}/survey_accounts/?format=json`}
    />
  );
});
