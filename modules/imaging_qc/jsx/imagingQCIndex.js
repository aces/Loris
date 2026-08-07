import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import frStrings from '../locale/fr/LC_MESSAGES/imaging_qc.json';

/**
 * Imaging Quality Control React Component
 */
class ImagingQCIndex extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      ImgData: {},
      isLoadedImg: false,
      imgFilter: {},
      error: '',
    };
    this.fetchData = this.fetchData.bind(this);
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
    let result = <td>{cell}</td>;
    switch (column) {
    case 'Scan Done in MRI Parameter Form':
      if (cell == 'Yes') {
        let mpfURL = loris.BaseURL
                       + '/instruments/mri_parameter_form/?commentID='
                       + row.CommentID
                       + '&sessionID='
                       + row['Session ID']
                       + '&candID='
                       + row.DCCID;
        result = <td><a href={mpfURL}>{cell}</a></td>;
      }
      break;
    case 'Scan Location':
      if (cell == 'In Imaging Browser') {
        let imgURL = loris.BaseURL
                       + '/imaging_browser/viewSession/?sessionID='
                       + row['Session ID'];
        result = <td><a href={imgURL}>{cell}</a></td>;
      }
      break;
    case 'Tarchive':
      if (cell == 'In DICOM') {
        let tarchiveURL = loris.BaseURL +
              '/dicom_archive/viewDetails/?tarchiveID=' + row.TarchiveID;
        result = <td><a href = {tarchiveURL}>{cell}</a></td>;
      }
    }
    return result;
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData(this.props.ImgDataURL, 'ImgData')
      .then(() => this.setState({isLoadedImg: true}));
  }

  /**
   * Retrive data from the provided URL and save it in state
   *
   * @param {string} url
   * @param {object} state - The React state object
   * @return {object}
   */
  fetchData(url, state) {
    return fetch(url, {credentials: 'same-origin'})
      .then((resp) => {
        return resp.text();
      })
      .then((data) => {
        if (data === 'MRI Parameter Form table does not exist') {
          this.setState({error: data});
        } else {
          this.setState({[state]: JSON.parse(data)});
        }
      })
      .catch((error) => {
        this.setState({error: error});
      });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    if (!this.state.isLoadedImg) {
      return <Loader/>;
    }
    if (Object.keys(this.state.ImgData).length > 0) {
      const ImgOptions = this.state.ImgData.fieldOptions;

      const ImgFields = [
        {
          label: t('PSCID', {ns: 'loris'}), show: true, filter: {
            name: 'pSCID',
            type: 'text',
          },
        },
        {label: t('SessionID', {ns: 'loris'}), show: true},
        {
          label: t('DCCID', {ns: 'loris'}), show: true, filter: {
            name: 'candId',
            type: 'text',
          },
        },
        {
          label: t('Site', {ns: 'loris', count: 1}), show: true, filter: {
            name: 'site',
            type: 'select',
            options: ImgOptions.site,
          },
        },
        {
          label: t('Project', {ns: 'loris', count: 1}), show: true, filter: {
            name: 'project',
            type: 'select',
            options: ImgOptions.project,
          },
        },
        {
          label: t('Cohort', {ns: 'loris', count: 1}), show: true, filter: {
            name: 'cohort',
            type: 'select',
            options: ImgOptions.cohort,
          },
        },
        {
          label: t('Visit Label', {ns: 'loris'}), show: true, filter: {
            name: 'visitLabel',
            type: 'select',
            options: ImgOptions.visitLabel,
          },
        },
        {
          label: t('Scan Type', {ns: 'loris'}), show: true, filter: {
            name: 'scanType',
            type: 'select',
            options: ImgOptions.scanType,
          },
        },
        {
          label: t('MRI Parameter Form', {ns: 'imaging_qc'}), show: true,
          filter: {
            name: 'mRIParameterForm',
            type: 'select',
            options: ImgOptions.mRIParameterForm,
          },
        },
        {
          label: t('Scan Done in MRI Parameter Form', {ns: 'imaging_qc'}),
          show: true,
          filter: {
            name: 'scanDoneInMRIParameterForm',
            type: 'select',
            options: ImgOptions.scanDoneInMRIParameterForm,
          },
        },
        {
          label: t('Tarchive', {ns: 'imaging_qc'}), show: true, filter: {
            name: 'tarchive',
            type: 'select',
            options: ImgOptions.tarchive,
          },
        },
        {
          label: t('Scan Location', {ns: 'imaging_qc'}), show: true, filter: {
            name: 'scanLocation',
            type: 'select',
            options: ImgOptions.scanLocation,
          },
        },
        {
          label: t('QC Status', {ns: 'loris'}), show: true, filter: {
            name: 'qCStatus',
            type: 'select',
            options: ImgOptions.qCStatus,
          },
        },
        {
          label: t('Uploaded By', {ns: 'loris'}), show: true, filter: {
            name: 'uploadedBy',
            type: 'select',
            options: ImgOptions.uploadedBy,
          },
        },
        {
          label: t('Selected', {ns: 'loris'}), show: true, filter: {
            name: 'selected',
            type: 'select',
            options: ImgOptions.selected,
          },
        },
        {label: t('CommentID', {ns: 'imaging_qc'}), show: false},
        {label: t('TarchiveID', {ns: 'loris'}), show: false},
      ];

      const datatable = (
        <FilterableDataTable
          name="imaging_qc"
          data={this.state.ImgData.Data}
          fields={ImgFields}
          getFormattedCell={this.formatColumn}
        />
      );
      return (
        <div>
          {datatable}
        </div>
      );
    } else {
      return (
        <div>
          {this.state.error === 'MRI Parameter Form table does not exist' ?
            <>
              <h3>
                  The MRI parameter form instrument must be
                  installed in-order to use this module.
              </h3>
              <p>
                  Please contact your administrator
                  if you require this functionality.
              </p>
            </> :
            <h3>
                An error occurred while loading the page.
            </h3>
          }
        </div>
      );
    }
  }
}

ImagingQCIndex.propTypes = {
  ImgDataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('fr', 'imaging_qc', frStrings);
  const TranslatedImagingQCIndex = withTranslation(
    ['imaging_qc', 'loris']
  )(ImagingQCIndex);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <TranslatedImagingQCIndex
      ImgDataURL={`${loris.BaseURL}/imaging_qc/?format=json`}
      hasPermission={loris.userHasPermission}
    />
  );
});
