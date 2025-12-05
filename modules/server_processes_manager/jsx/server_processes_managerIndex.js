import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

import jaStrings
  from '../locale/ja/LC_MESSAGES/server_processes_manager.json';
import hiStrings
  from '../locale/hi/LC_MESSAGES/server_processes_manager.json';

/**
 * ServerProcessesManagerIndex is the main entry point of the
 * server_processes_manager module. It contains a filterable
 * menu table of the existing processes.
 */
class ServerProcessesManagerIndex extends Component {
  /**
   * Construct the React component
   *
   * @param {array} props - The React props
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
   * React lifecycle method. Loads the data for the module.
   */
  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrieve data from the provided URL and save it in state
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
    return (<td>{cell}</td>);
  }

  /**
   * React lifecycle method
   *
   * @return {object} - Rendered React component
   */
  render() {
    const {t} = this.props;
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
     * queried columns in _setupVariables() in server_processes_manager.class.inc
     */
    const fields = [
      {label: t('PID', {ns: 'server_processes_manager'}), show: true, filter: {
        name: 'pid',
        type: 'text',
      }},
      {label: t('Type', {ns: 'server_processes_manager'}), show: true, filter: {
        name: 'type',
        type: 'text',
      }},
      {label: t('Stdout File', {ns: 'server_processes_manager'}), show: true},
      {label: t('Stderr File', {ns: 'server_processes_manager'}), show: true},
      {label: t('Exit Code File', {ns: 'server_processes_manager'}), show: true},
      {label: t('Exit Code', {ns: 'server_processes_manager'}), show: true},
      {label: t('User ID', {ns: 'server_processes_manager'}), show: true, filter: {
        name: 'userid',
        type: 'text',
      }},
      {label: t('Start Time', {ns: 'server_processes_manager'}), show: true},
      {label: t('End Time', {ns: 'server_processes_manager'}), show: true},
      {label: t('Exit Text', {ns: 'server_processes_manager'}), show: true},
    ];

    return (
      <FilterableDataTable
        name="server_processes_manager"
        data={this.state.data.Data}
        fields={fields}
        getFormattedCell={this.formatColumn}
      />
    );
  }
}

ServerProcessesManagerIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('ja', 'server_processes_manager', jaStrings);
  i18n.addResourceBundle('hi', 'server_processes_manager', hiStrings);
  const SPMIndex = withTranslation(
    ['server_processes_manager', 'loris']
  )(ServerProcessesManagerIndex);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <SPMIndex
      dataURL={`${loris.BaseURL}/server_processes_manager/?format=json`}
    />
  );
});
