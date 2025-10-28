import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

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
    }

    return result;
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    // If error occurs, return a message
    if (this.state.error) {
      return <h3>{t('An error occured while loading the page.',
        {ns: 'electrophysiology_browser'})}</h3>;
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
      {label: t('Site', {ns: 'electrophysiology_browser'}),
        show: true, filter: {
          name: 'site',
          type: 'select',
          options: options.sites,
        }},
      {label: t('PSCID', {ns: 'electrophysiology_browser'}),
        show: true, filter: {
          name: 'PSCID',
          type: 'text',
        }},
      {label: t('DCCID', {ns: 'electrophysiology_browser'}),
        show: true, filter: {
          name: 'DCCID',
          type: 'text',
        }},
      {label: t('Project', {ns: 'electrophysiology_browser'}),
        show: true, filter: {
          name: 'project',
          type: 'select',
          options: options.projects,
        }},
      {label: t('Visit Label', {ns: 'electrophysiology_browser'}),
        show: true, filter: {
          name: 'visitLabel',
          type: 'text',
        }},
      {label: t('Acquisition Time',
        {ns: 'electrophysiology_browser'}), show: true},
      {label: t('Insertion Time',
        {ns: 'electrophysiology_browser'}), show: true},
      {label: t('Links',
        {ns: 'electrophysiology_browser'}), show: true},
      {label: t('Type',
        {ns: 'electrophysiology_browser'}), show: false, filter: {
        name: 'type',
        type: 'multiselect',
        options: options.types,
      }},
      {label: t('SessionID',
        {ns: 'electrophysiology_browser'}), show: false},
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
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('ja', 'electrophysiology_browser', {});
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

export default withTranslation(
  ['electrophysiology_browser', 'loris'])(ElectrophysiologyBrowserIndex);
