import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FilterForm from 'FilterForm';
import {Tabs, TabPane} from 'Tabs';
import Loader from 'Loader';
import {withTranslation} from 'react-i18next';
import LogPanel from './LogPanel';
import UploadForm from './UploadForm';
import {TextboxElement, SelectElement, ButtonElement} from 'jsx/Form';
import DataTable from 'jsx/DataTable';

/**
 * Imaging uploader component
 */
class ImagingUploader extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    loris.hiddenHeaders = ['PatientName', 'SessionID'];

    this.state = {
      isLoaded: false,
      filter: {},
    };

    /**
     * Set filter to the element's ref for filtering
     */
    this.filter = null;
    this.setFilterRef = (element) => {
      this.filter = element;
    };

    /**
     * Bind component instance to custom methods
     */
    this.fetchData = this.fetchData.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrive data from the provided URL and save it in state
   * Additionaly add hiddenHeaders to global loris vairable
   * for easy access by columnFormatter.
   */
  fetchData() {
    fetch(this.props.DataURL, {
      method: 'GET',
    }).then((response) => {
      if (!response.ok) {
        console.error(response.status + ': ' + response.statusText);
        return;
      }

      response.json().then((data) => {
        this.setState({
          data: data,
          isLoaded: true,
        });
      });
    }).catch((error) => {
      console.error(error);
    });
  }

  /**
   * Set this.state.filter to the input filter object
   *
   * @param {object} filter = the filter object
   */
  updateFilter(filter) {
    this.setState({filter});
  }

  // TODO: deprecate clearing filters via refs in future refactoring.
  /**
   * Reset the filter elements with textInput refs to empty values
   */
  resetFilters() {
    this.filter.clearFilter();
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {array} rowData - array of cell contents for a specific row
   * @param {array} rowHeaders - array of table headers (column names)
   * @return {*} a formatted table cell for a given column
   */
  formatColumn(column, cell, rowData, rowHeaders) {
    // If a column if set as hidden, don't display it
    if (loris.hiddenHeaders.indexOf(column) > -1) {
      return null;
    }

    // Create the mapping between rowHeaders and rowData in a row object.
    let row = {};
    rowHeaders.forEach((header, index) => {
      row[header] = rowData[index];
    }, this);

    // Default cell style
    const cellStyle = {whiteSpace: 'nowrap'};
    const {t} = this.props;
    const progressKey = t('Progress', {ns: 'loris'});
    const filesCreatedKey = t('Number Of Files Created',
      {ns: 'imaging_uploader'});
    const filesInsertedKey = t('Number Of Files Inserted',
      {ns: 'imaging_uploader'});
    const tarchiveInfoKey = t('Tarchive Info', {ns: 'imaging_uploader'});
    const failureText = t('Failure', {ns: 'loris'});
    const inProgressText = t('In Progress', {ns: 'loris'}) + '...';
    const successText = t('Success', {ns: 'loris'});
    const notStartedText = t('Not Started', {ns: 'loris'});

    if (column === progressKey) {
      if (cell === 'Failure') {
        cellStyle.color = '#fff';
        return (
          <td className="label-danger" style={cellStyle}>
            {failureText}
          </td>
        );
      }

      if (cell === 'In Progress...') {
        cellStyle.color = '#fff';
        return (
          <td className="label-warning" style={cellStyle}>
            {inProgressText}
          </td>
        );
      }

      if (cell === 'Success') {
        const created = row[filesCreatedKey];
        const inserted = row[filesInsertedKey];
        return (
          <td style={cellStyle}>
            {t('{{successText}} ({{inserted}} out of {{created}})',
              {
                ns: 'imaging_uploader',
                successText: successText,
                inserted: inserted,
                created: created,
              }
            )}
          </td>
        );
      }

      // cell == 'Not started'
      return (
        <td style={cellStyle}>{notStartedText}</td>
      );
    }

    if (column === tarchiveInfoKey) {
      if (!cell || cell === '0') {
        return (<td></td>);
      }
      const url = loris.BaseURL
                  + '/dicom_archive/viewDetails/?tarchiveID='
                  + cell;
      return (
        <td style={cellStyle}>
          <a href={url}>{t('View details', {ns: 'loris'})}</a>
        </td>
      );
    }

    if (column === filesInsertedKey) {
      if (cell > 0) {
        const url = loris.BaseURL
                    + '/imaging_browser/viewSession/?sessionID='
                    + row.SessionID;
        return (
          <td style={cellStyle}>
            <a href={url}>{cell}</a>
          </td>
        );
      }
    }

    if (column === filesCreatedKey) {
      let violatedScans;
      if (
        row[filesCreatedKey] - row[filesInsertedKey] > 0
      ) {
        let numViolatedScans =
             row[filesCreatedKey] - row[filesInsertedKey];

        const violUrl = loris.BaseURL +
                         '/mri_violations/?patientName=' + row.PatientName;
        violatedScans = <a href={violUrl}>
          {this.props.t('{{numViolatedScans}} violated scans',
            {ns: 'imaging_uploader', numViolatedScans: numViolatedScans}
          )}
        </a>;
      }

      return (
        <td style={cellStyle}>
          {cell}
          &nbsp;
          {violatedScans}
        </td>
      );
    }

    return (<td style={cellStyle}>{cell}</td>);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    const tabList = [
      {id: 'browse', label: t('Browse', {ns: 'loris'})},
      {id: 'upload', label: t('Upload', {ns: 'loris'})},
    ];

    return (
      <Tabs tabs={tabList} defaultTab='browse' updateURL={true}>
        <TabPane TabId={tabList[0].id}>
          <div className='row'>
            <div className='col-md-5'>
              <FilterForm
                Module='imaging_uploader'
                name='imaging_filter'
                id='imaging_filter'
                ref={this.setFilterRef}
                onUpdate={this.updateFilter}
                filter={this.state.filter}
              >
                <TextboxElement
                  {... this.state.data.form.candID}
                  label={t(this.state.data.form.candID.label, {ns: 'loris'})}
                />
                <TextboxElement
                  {... this.state.data.form.pSCID}
                  label={t(this.state.data.form.pSCID.label, {ns: 'loris'})}
                />
                <SelectElement
                  {... this.state.data.form.visitLabel}
                  label={t(this.state.data.form.visitLabel.label,
                    {ns: 'loris'})}
                />
                <ButtonElement
                  type='reset'
                  label={t('Clear Filters', {ns: 'loris'})}
                  onUserInput={this.resetFilters}
                />
              </FilterForm>
            </div>
            <div className='col-md-7'>
              <LogPanel t={t}/>
            </div>
          </div>
          <div id='mri_upload_table'>
            <DataTable
              data={this.state.data.Data}
              fields={this.state.data.Headers.map(
                (header, index) => {
                  let filter = {};
                  if (header === 'DCCID') {
                    filter = {name: 'candID'};
                  } else if (header === 'PSCID') {
                    filter = {name: 'pSCID'};
                  } else if (header === 'Visit Label') {
                    filter = {name: 'visitLabel'};
                  }
                  return {
                    label: t(header, {ns: ['imaging_uploader', 'loris']}),
                    show: true,
                    filter: filter,
                  };
                }
              )}
              getFormattedCell={this.formatColumn}
              filters={this.state.filter}
              hiddenHeaders={this.state.hiddenHeaders}
            />
          </div>
        </TabPane>
        <TabPane TabId={tabList[1].id}>
          <UploadForm
            form={this.state.data.form}
            mriList={this.state.data.mriList}
            maxUploadSize={this.state.data.maxUploadSize}
            imagingUploaderAutoLaunch={
              this.state.data.imagingUploaderAutoLaunch
            }
            t={t}
          />
        </TabPane>
      </Tabs>
    );
  }
}

ImagingUploader.propTypes = {
  DataURL: PropTypes.string.isRequired,
  t: PropTypes.func,
};

export default withTranslation(['imaging_uploader', 'loris'])(ImagingUploader);
