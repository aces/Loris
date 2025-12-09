import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

import frStrings from '../locale/fr/LC_MESSAGES/electrophysiology_browser.json';
import jaStrings from '../locale/ja/LC_MESSAGES/electrophysiology_browser.json';

/**
 * Electrophysiology Browser page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders Electrophysiology Browser main page consisting of FilterTable and
 * DataTable components.
 *
 * @author Cecile Madjar
 * @version 1.0.0
 */
class ElectrophysiologyBrowserIndex extends Component {
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

    // Bind component instance to custom methods
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
   * Retrieve data from the provided URL and save it in state.
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
   * @return {*} a formatted table cell for a given column
   */
  formatColumn(column, cell, row) {
    const style = '';
    let result = <td className={style}>{cell}</td>;
    const {t} = this.props;
    switch (column) {
    case t('Links', {ns: 'electrophysiology_browser'}):
      let cellTypes = cell.split(',');
      let cellLinks = [];
      cellTypes.reverse();
      for (let i = 0; i < cellTypes.length; i += 1) {
        cellLinks.push(<a key={i} href={loris.BaseURL +
              '/electrophysiology_browser/sessions/' +
              row.SessionID + '?outputType=' +
              cellTypes[i]}>
          {cellTypes[i]}
        </a>);

        if (cellTypes.length > 1) {
          cellLinks.push(' | ');
        }
      }
      if (cellTypes.length > 1) {
        cellLinks.push(<a key="all" href={loris.BaseURL +
            '/electrophysiology_browser/sessions/' +
            row.SessionID}>
          {t('all types', {ns: 'electrophysiology_browser'})}
        </a>);
      }
      result = (<td>{cellLinks}</td>);
      break;
    case t('Has HED Tags', {ns: 'electrophysiology_browser'}):
      result = <td className={style}>{t(cell, {ns: 'loris'})}</td>;
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
    // If error occurs, return a message
    if (this.state.error) {
      return <h3>{t('An error occured while loading the page.',
        {ns: 'loris'})}</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    /**
     * Currently, the order of these fields MUST match the order of the
     * queried columns in _setupVariables() in electrophysiology_browser.class.inc
     */
    const options = this.state.data.fieldOptions;
    const fields = [
      {label: t('Site', {ns: 'loris', count: 1}), show: true, filter: {
        name: 'site',
        type: 'select',
        options: options.sites,
      }},
      {label: t('PSCID', {ns: 'loris'}), show: true, filter: {
        name: 'PSCID',
        type: 'text',
      }},
      {label: t('DCCID', {ns: 'loris'}), show: true, filter: {
        name: 'DCCID',
        type: 'text',
      }},
      {label: t('Project', {ns: 'loris', count: 1}), show: true, filter: {
        name: 'project',
        type: 'select',
        options: options.projects,
      }},
      {label: t('Visit Label', {ns: 'loris'}), show: true, filter: {
        name: 'visitLabel',
        type: 'text',
      }},
      {label: t('Has HED Tags', {ns: 'electrophysiology_browser'}),
        show: true, filter: {
          name: 'HasHEDTags',
          type: 'select',
          hide: false,
          options: {
            'yes': t('Yes', {ns: 'loris'}),
            'no': t('No', {ns: 'loris'}),
          },
        }},
      {label: t('Acquisition Time', {ns: 'electrophysiology_browser'}),
        show: true},
      {label: t('Insertion Time', {ns: 'electrophysiology_browser'}),
        show: true},
      {label: t('Links', {ns: 'electrophysiology_browser'}),
        show: true},
      {label: t('Output Type', {ns: 'electrophysiology_browser'}),
        show: false, filter: {
          name: 'type',
          type: 'multiselect',
          options: options.types,
        }},
      {label: t('SessionID', {ns: 'electrophysiology_browser'}), show: false},
    ];

    return (
      <FilterableDataTable
        name='electrophysiology_filter'
        data={this.state.data.Data}
        fields={fields}
        getFormattedCell={this.formatColumn}
      />
    );
  }
}

ElectrophysiologyBrowserIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  t: PropTypes.func,
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('ja', 'electrophysiology_browser', jaStrings);
  i18n.addResourceBundle('fr', 'electrophysiology_browser', frStrings);
  const Index = withTranslation(
    ['electrophysiology_browser', 'loris']
  )(ElectrophysiologyBrowserIndex);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <Index
      dataURL={`${loris.BaseURL}/electrophysiology_browser/?format=json`}
    />
  );
});
