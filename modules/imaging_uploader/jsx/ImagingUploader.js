import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FilterForm from 'FilterForm';
import {Tabs, TabPane} from 'Tabs';
import Loader from 'Loader';

import LogPanel from './LogPanel';
import UploadForm from './UploadForm';
import {TextboxElement, SelectElement, ButtonElement} from 'jsx/Form';
import StaticDataTable from 'jsx/StaticDataTable';

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

    if (column === 'Progress') {
      if (cell === 'Failure') {
        cellStyle.color = '#fff';
        return (
          <td className="label-danger" style={cellStyle}>
            {cell}
          </td>
        );
      }

      if (cell === 'In Progress...') {
        cellStyle.color = '#fff';
        return (
          <td className="label-warning" style={cellStyle}>
            {cell}
          </td>
        );
      }

      if (cell === 'Success') {
        const created = row['Number Of Files Created'];
        const inserted = row['Number Of Files Inserted'];
        return (
          <td style={cellStyle}>
          {cell} ({inserted} out of {created})
          </td>
        );
      }

      // cell == 'Not started'
      return (
          <td style={cellStyle}>{cell}</td>
      );
    }

    if (column === 'Tarchive Info') {
      if (!cell || cell === '0') {
        return (<td></td>);
      }
      const url = loris.BaseURL
                  + '/dicom_archive/viewDetails/?tarchiveID='
                  + cell;
      return (
        <td style={cellStyle}>
          <a href={url}>View details</a>
        </td>
      );
    }

    if (column === 'Number Of Files Inserted') {
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

    if (column === 'Number Of Files Created') {
      let violatedScans;
      if (
        row['Number Of Files Created'] - row['Number Of Files Inserted'] > 0
      ) {
        let numViolatedScans =
             row['Number Of Files Created'] - row['Number Of Files Inserted'];

        const violUrl = loris.BaseURL +
                         '/mri_violations/?patientName=' + row.PatientName;
        violatedScans = <a href={violUrl}>
           ({numViolatedScans} violated scans)
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
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    const tabList = [
      {id: 'browse', label: 'Browse'},
      {id: 'upload', label: 'Upload'},
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
                <TextboxElement {... this.state.data.form.candID} />
                <TextboxElement {... this.state.data.form.pSCID} />
                <SelectElement {... this.state.data.form.visitLabel} />
                <ButtonElement
                  type='reset'
                  label='Clear Filters'
                  onUserInput={this.resetFilters}
                />
              </FilterForm>
            </div>
            <div className='col-md-7'>
              <LogPanel />
            </div>
          </div>
          <div id='mri_upload_table'>
            <StaticDataTable
              Data={this.state.data.Data}
              Headers={this.state.data.Headers}
              getFormattedCell={this.formatColumn}
              Filter={this.state.filter}
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
          />
        </TabPane>
      </Tabs>
    );
  }
}

ImagingUploader.propTypes = {
  DataURL: PropTypes.string.isRequired,
};

export default ImagingUploader;
