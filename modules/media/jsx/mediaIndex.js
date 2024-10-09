import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Tabs, TabPane} from 'Tabs';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import TriggerableModal from 'TriggerableModal';

import MediaUploadForm from './uploadForm';
import MediaEditForm from './editForm';

/**
 * Media Index component
 */
class MediaIndex extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      Data: {},
      fieldOptions: {},
      error: false,
      isLoaded: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.mapColumn = this.mapColumn.bind(this);
    this.insertRow = this.insertRow.bind(this);
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
      .then((data) => this.setState({
        data: data.Data,
        fieldOptions: data.fieldOptions,
      }))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * Insert row of data into table after successful
   * file upload and display recent data.
   *
   * @param {object} data - row to add to table
   */
  insertRow(data) {
    let tableData = JSON.parse(JSON.stringify(this.state.data));
    tableData.push(Object.values(data));
    this.setState({
      data: tableData,
    });
  }

  /**
   * Modify value of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} value - cell value
   * @return {string} a mapped value for the table cell at a given column
   */
  mapColumn(column, value) {
    switch (column) {
      case 'Site':
        return this.state.fieldOptions.sites[value];
      default:
        return value;
    }
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   * @return {React.ReactElement|void} a formated table cell for a given column
   */
  formatColumn(column, cell, row) {
    cell = this.mapColumn(column, cell);
    // Set class to 'bg-danger' if file is hidden.
    const style = (row['File Visibility'] === 'hidden') ? 'bg-danger' : '';
    let result = <td className={style}>{cell}</td>;
    switch (column) {
    case 'File Name':
      if (this.props.hasPermission('media_read')) {
        const downloadURL = loris.BaseURL
                            + '/media/files/'
                            + encodeURIComponent(row['File Name']);
        result = (
          <td className={style}>
            <a href={downloadURL} target="_blank" download={row['File Name']}>
              {cell}
            </a>
          </td>
        );
      }
      break;
    case 'Visit Label':
      if (row['CandID'] !== null && row['SessionID']) {
        const sessionURL = loris.BaseURL + '/instrument_list/?candID=' +
          row['CandID'] + '&sessionID=' + row['SessionID'];
        result = <td className={style}><a href={sessionURL}>{cell}</a></td>;
      }
      break;
    case 'Site':
      result = <td className={style}>{cell}</td>;
      break;
    case 'Project':
      result = <td className={style}>
        {this.state.fieldOptions.projects[cell]}
      </td>;
      break;
    case 'Edit Metadata':
      if (!this.props.hasPermission('media_write')) {
          return;
      }
      const editButton = (
            <TriggerableModal title="Edit Media File" label="Edit">
              <MediaEditForm
                DataURL={loris.BaseURL
                        + '/media/ajax/FileUpload.php'
                        + '?action=getData&idMediaFile='
                        + row['Edit Metadata']}
                action={loris.BaseURL
                       + '/media/ajax/FileUpload.php?action=edit'}
                /* this should be passed to onSubmit function
                   upon refactoring editForm.js*/
                fetchData={this.fetchData }
                    />
            </TriggerableModal>
      );
      result = <td className={style}>{editButton}</td>;
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
    * queried columns in _setupVariables() in media.class.inc
    */
    const options = this.state.fieldOptions;
    let fields = [
      {label: 'File Name', show: true, filter: {
        name: 'fileName',
        type: 'text',
      }},
      {label: 'PSCID', show: true, filter: {
        name: 'pscid',
        type: 'text',
      }},
      {label: 'Visit Label', show: true, filter: {
        name: 'visitLabel',
        type: 'select',
        options: options.visits,
      }},
      {label: 'Language', show: true, filter: {
        name: 'language',
        type: 'select',
        options: options.languages,
      }},
      {label: 'Instrument', show: true, filter: {
        name: 'instrument',
        type: 'select',
        options: options.instruments,
      }},
      {label: 'Site', show: true, filter: {
        name: 'site',
        type: 'select',
        options: options.sites,
      }},
      {label: 'Project', show: true, filter: {
        name: 'project',
        type: 'select',
        options: options.projects,
      }},
      {label: 'Uploaded By', show: true, filter: {
        name: 'uploadedBy',
        type: 'text',
        }},
      {label: 'Date Taken', show: true},
      {label: 'Comments', show: true},
      {label: 'Last Modified', show: true},
      {label: 'File Type', show: false, filter: {
        name: 'fileType',
        type: 'select',
        options: options.fileTypes,
      }},
      {label: 'CandID', show: false},
      {label: 'SessionID', show: false},
      {label: 'File Visibility', show: false, filter: {
        name: 'fileVisibility',
        type: 'select',
        options: options.hidden,
        hide: !this.props.hasPermission('superUser'),
      }},
    ];
    if (this.props.hasPermission('media_write')) {
      fields.push({label: 'Edit Metadata', show: true});
    }
    const tabs = [{id: 'browse', label: 'Browse'}];
    const uploadTab = () => {
      if (this.props.hasPermission('media_write')) {
        tabs.push({id: 'upload', label: 'Upload'});
        return (
          <TabPane TabId={tabs[1].id}>
            <MediaUploadForm
              DataURL={loris.BaseURL
                      + '/media/ajax/FileUpload.php?action=getData'}
              action={loris.BaseURL
                     + '/media/ajax/FileUpload.php?action=upload'}
              maxUploadSize={options.maxUploadSize}
              insertRow={this.insertRow}
            />
          </TabPane>
        );
      }
    };

    return (
      <Tabs tabs={tabs} defaultTab="browse" updateURL={true}>
        <TabPane TabId={tabs[0].id}>
          <FilterableDataTable
            name="media"
            data={this.state.data}
            fields={fields}
            getFormattedCell={this.formatColumn}
            getMappedCell={this.mapColumn}
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
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <MediaIndex
      dataURL={`${loris.BaseURL}/media/?format=json`}
      hasPermission={loris.userHasPermission}
    />
  );
});
