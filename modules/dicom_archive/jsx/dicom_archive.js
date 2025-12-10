import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

import hiStrings from '../locale/hi/LC_MESSAGES/dicom_archive.json';
import jaStrings from '../locale/ja/LC_MESSAGES/dicom_archive.json';
import frStrings from '../locale/fr/LC_MESSAGES/dicom_archive.json';
/**
 * DICOM Archive Page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders DICOM Archive main page consisting of FilterTable and
 * DataTable components.
 *
 * @author LORIS Team
 * @version 1.0.0
 */
class DicomArchive extends Component {
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
    const {t} = this.props;
    let result = <td>{cell}</td>;
    switch (column) {
    case t('Archive Location', {ns: 'dicom_archive'}): {
      const downloadURL = '/mri/jiv/get_file.php?file=' + cell
            + '&patientName=' + row[t('Patient Name', {ns: 'dicom_archive'})];
      result =
          <td>
            <a href={downloadURL}>
              <span className="glyphicon glyphicon-cloud-download"/>
              &nbsp;
              {cell}
            </a>
          </td>;
      break;
    }
    case t('Metadata', {ns: 'dicom_archive'}): {
      const metaURL = loris.BaseURL
          + '/dicom_archive/viewDetails/?tarchiveID='
          + row[t('TarchiveID', {ns: 'dicom_archive'})];
      result=<td><a href={metaURL}>{t(cell, {ns: 'dicom_archive'})}</a></td>;
      break;
    }
    case t('MRI Browser', {ns: 'dicom_archive'}): {
      const sessionID = row[t('SessionID', {ns: 'dicom_archive'})];
      if (sessionID === null || sessionID === '') {
        result = <td>&nbsp;</td>;
      } else {
        let mrlURL = loris.BaseURL
                       + '/imaging_browser/viewSession/?sessionID='
                       + sessionID;
        result=<td><a href={mrlURL}>{t(cell, {ns: 'dicom_archive'})}</a></td>;
      }
      break;
    }
    }
    if (cell == 'INVALID - HIDDEN') {
      result=<td className="text-danger">{t(cell, {ns: 'dicom_archive'})}</td>;
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
     * queried columns in _setupVariables() in dicom_archive.class.inc
     */
    const options = this.state.data.fieldOptions;
    const fields = [
      {label: t('Patient ID', {ns: 'dicom_archive'}), show: true, filter: {
        name: 'patientID',
        type: 'text',
      }},
      {label: t('Patient Name', {ns: 'dicom_archive'}), show: true, filter: {
        name: 'patientName',
        type: 'text',
      }},
      {label: t('Sex', {ns: 'loris'}), show: true, filter: {
        name: 'sex',
        type: 'select',
        options: {M: 'M', F: 'F', O: 'O'},
      }},
      {label: t('Date of Birth', {ns: 'loris'}), show: true, filter: {
        name: 'dateOfBirth',
        type: 'date',
      }},
      {label: t('Acquisition Date', {ns: 'dicom_archive'}),
        show: true, filter: {
          name: 'acquisitionDate',
          type: 'date',
        }},
      {label: t('Archive Location', {ns: 'dicom_archive'}),
        show: true, filter: {
          name: 'archiveLocation',
          type: 'text',
        }},
      {label: t('Metadata', {ns: 'dicom_archive'}), show: true},
      {label: t('MRI Browser', {ns: 'dicom_archive'}), show: true},
      {label: t('Series UID', {ns: 'dicom_archive'}), show: false, filter: {
        name: 'seriesUID',
        type: 'text',
      }},
      {label: t('Site', {ns: 'loris', count: 1}), show: false, filter: {
        name: 'site',
        type: 'select',
        options: options.sites,
      }},
      {label: t('TarchiveID', {ns: 'dicom_archive'}), show: false},
      {label: t('SessionID', {ns: 'dicom_archive'}), show: false},
      {label: t('CenterID', {ns: 'dicom_archive'}), show: false},
      {label: t('IsPhantom', {ns: 'dicom_archive'}), show: false},
    ];

    return (
      <FilterableDataTable
        name="dicom_filter"
        title={t('DICOM Archive', {ns: 'dicom_archive'})}
        data={this.state.data.Data}
        fields={fields}
        getFormattedCell={this.formatColumn}
      />
    );
  }
}

DicomArchive.propTypes = {
  dataURL: PropTypes.string.isRequired,
  t: PropTypes.func,
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('hi', 'dicom_archive', hiStrings);
  i18n.addResourceBundle('fr', 'dicom_archive', frStrings);
  i18n.addResourceBundle('ja', 'dicom_archive', jaStrings);
  const Index = withTranslation(
    ['dicom_archive', 'loris']
  )(DicomArchive);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <Index dataURL={loris.BaseURL + '/dicom_archive/?format=json'}/>
  );
});
