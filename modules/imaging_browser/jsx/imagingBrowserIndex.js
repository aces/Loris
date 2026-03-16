import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';

import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import PropTypes from 'prop-types';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

import hiStrings from '../locale/hi/LC_MESSAGES/imaging_browser.json';
import jaStrings from '../locale/ja/LC_MESSAGES/imaging_browser.json';
import frStrings from '../locale/fr/LC_MESSAGES/imaging_browser.json';

/**
 * Imaging browser index component
 */
class ImagingBrowserIndex extends Component {
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
    // Set class to 'bg-danger' if file is hidden.
    const style = '';
    let result = <td className={style}>{cell}</td>;
    const {t} = this.props;
    const sessionIDKey = t('SessionID', {ns: 'imaging_browser'});
    const sessionID = row[sessionIDKey];
    switch (column) {
    case t('New Data', {ns: 'imaging_browser'}):
      if (cell === 'new') {
        result = (
          <td className="newdata">{t('NEW', {ns: 'loris'})}</td>
        );
      }
      break;
    case t('Links', {ns: 'imaging_browser'}):
      let cellTypes = cell.split(',');
      let cellLinks = [];
      for (let i = 0; i < cellTypes.length; i += 1) {
        cellLinks.push(<a key={i} href={loris.BaseURL +
          '/imaging_browser/viewSession/?sessionID=' +
          sessionID + '&outputType=' +
          cellTypes[i] + '&backURL=/imaging_browser/'}>
          {cellTypes[i]}
        </a>);
        cellLinks.push(' | ');
      }
      cellLinks.push(<a key="selected" href={loris.BaseURL +
        '/imaging_browser/viewSession/?sessionID=' +
        sessionID +
        '&selectedOnly=1&backURL=/imaging_browser/'}>
        {t('selected', {ns: 'loris'})}
      </a>);

      cellLinks.push(' | ');
      cellLinks.push(<a key="all" href={loris.BaseURL +
        '/imaging_browser/viewSession/?sessionID=' +
        sessionID +
        '&backURL=/imaging_browser/'}>
        {t('all types', {ns: 'imaging_browser'})}
      </a>);
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
     * Currently, the order of these fields MUST match the order of the
     * queried columns in _setupVariables() in imaging_browser.class.inc
     */
    const options = this.state.data.fieldOptions;
    const configLabels = options.configLabels;
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
      {label: t('Visit QC Status', {ns: 'imaging_browser'}),
        show: true, filter: {
          name: 'visitQCStatus',
          type: 'select',
          options: options.visitQCStatus,
        }},
      {label: t('First Acquisition', {ns: 'imaging_browser'}), show: true},
      {label: t('First Insertion', {ns: 'imaging_browser'}), show: true},
      {label: t('Last QC', {ns: 'imaging_browser'}), show: true},
      {label: t('New Data', {ns: 'imaging_browser'}), show: true},
      {label: t('Links', {ns: 'imaging_browser'}), show: true},
      {label: t('SessionID', {ns: 'imaging_browser'}), show: false},
      {label: t('Sequence Type', {ns: 'imaging_browser'}),
        show: false, filter: {
          name: 'sequenceType',
          type: 'multiselect',
          options: options.sequenceTypes,
        }},
      {label: t('Pending New', {ns: 'imaging_browser'}),
        show: false, filter: {
          name: 'pendingNew',
          type: 'multiselect',
          options: options.pendingNew,
        }},
      {label: t('Entity Type', {ns: 'loris'}),
        show: false, filter: {
          name: 'entityType',
          type: 'multiselect',
          options: options.entityType,
        }},
    ];
    /**
     * Adding columns based on the Imaging Browser Tabulated Scan Types
     * configured and stored in database
     */
    Object.values(configLabels).forEach((label)=> {
      fields.push({label: label + ' ' + t('QC Status', {ns: 'imaging_browser'}),
        show: true}
      );
    });

    return (
      <FilterableDataTable
        name="imaging_browser"
        data={this.state.data.Data}
        fields={fields}
        getFormattedCell={this.formatColumn}
      />

    );
  }
}

ImagingBrowserIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  t: PropTypes.func,
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('ja', 'imaging_browser', jaStrings);
  i18n.addResourceBundle('hi', 'imaging_browser', hiStrings);
  i18n.addResourceBundle('fr', 'imaging_browser', frStrings);
  const Index = withTranslation(
    ['imaging_browser', 'loris']
  )(ImagingBrowserIndex);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <Index
      dataURL={`${loris.BaseURL}/imaging_browser/?format=json`}
    />
  );
});
