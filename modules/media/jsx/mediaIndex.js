import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import {Tabs, TabPane} from 'Tabs';

import MediaUploadForm from './uploadForm';

class MediaIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      isLoaded: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
  }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}))
      .catch((error) => console.error(error));
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
      .then((data) => this.setState({data}));
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row
   *
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, row) {
    // Set class to 'bg-danger' if file is hidden.
    const style = (row['Hide File'] === '1') ? 'bg-danger' : '';

    switch (column) {
    case 'File Name':
      if (this.props.hasPermission('media_write')) {
        const downloadURL = loris.BaseURL + '/media/ajax/FileDownload.php?File=' +
          encodeURIComponent(row['File Name']);
        return (
          <td className={style}>
            <a href={downloadURL} target="_blank" download={row['File Name']}>
              {cell}
            </a>
          </td>
        );
      }
      break;
    case 'Visit Label':
      if (row['Cand ID'] !== null && row['Session ID']) {
        const sessionURL = loris.BaseURL + '/instrument_list/?candID=' +
          row['Cand ID'] + '&sessionID=' + row['Session ID'];
        return <td className={style}><a href={sessionURL}>{cell}</a></td>;
      }
      break;
    case 'Edit Metadata':
      const editURL = loris.BaseURL + '/media/edit/?id=' + row['Edit Metadata'];
      return <td className={style}><a href={editURL}>Edit</a></td>;
      break;
    }

    return <td className={style}>{cell}</td>;
  }

  render() {
    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    const options = this.state.data.fieldOptions;
    const fields = [
      {name: 'pSCID', label: 'PSCID', type: 'text'},
      {name: 'visitLabel', label: 'Visit Label', type: 'select', options: options.visits},
      {name: 'instrument', label: 'Instrument', type: 'select', options: options.instruments},
      {name: 'fileName', label: 'File Name', type: 'text'},
      {name: 'site', label: 'For Site', type: 'select', options: options.sites},
      {name: 'language', label: 'Language', type: 'select', options: options.languages},
      {name: 'fileType', label: 'File Type', type: 'select', options: options.fileTypes},
      {name: 'uploadedBy', label: 'Uploaded By', type: 'text'},
      {name: 'hideFile', label: 'File Visibility', type: 'select', options: options.hidden, hide: this.props.hasPermission('superUser')},
    ];

   /**
    * XXX: Currently, the order of these headers MUST match the order of the
    * queried columns in _setupVariables() in media.class.inc
    */
    const headers = [
     {label: 'File Name', display: true},
     {label: 'PSCID', display: true},
     {label: 'Visit Label', display: true},
     {label: 'Language', display: true},
     {label: 'Instrument', display: true},
     {label: 'Site', display: true},
     {label: 'Uploaded By', display: true},
     {label: 'Date Taken', display: true},
     {label: 'Comments', display: true},
     {label: 'Date Uploaded', display: true},
     {label: 'File Type', display: false},
     {label: 'Cand ID', display: false},
     {label: 'Session ID', display: false},
     {label: 'Hide File', display: false},
     {label: 'Edit Metadata', display: true},
    ];
    const tabList = [{id: 'browse', label: 'Browse'}];
    const uploadTab = () => {
      if (this.props.hasPermission('media_write')) {
        tabList.push({id: 'upload', label: 'Upload'});
        return (
          <TabPane TabId={tabList[1].id}>
            <MediaUploadForm
              DataURL={`${loris.BaseURL}/media/ajax/FileUpload.php?action=getData`}
              action={`${loris.BaseURL}/media/ajax/FileUpload.php?action=upload`}
              maxUploadSize={this.state.data.maxUploadSize}
            />
          </TabPane>
        );
      }
    };

    return (
      <Tabs tabs={tabList} defaultTab="browse" updateURL={true}>
        <TabPane TabId={tabList[0].id}>
          <FilterableDataTable
            name="media"
            data={this.state.data.Data}
            headers={headers}
            fields={fields}
            getFormattedCell={this.formatColumn}
          />
        </TabPane>
        {uploadTab()}
      </Tabs>
    );
  }
}

MediaIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <MediaIndex
      dataURL={`${loris.BaseURL}/media/?format=json`}
      hasPermission={loris.userHasPermission}
    />,
    document.getElementById('lorisworkspace')
  );
});
