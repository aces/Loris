import React, {Component} from 'react';
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
    this.renderFilterElements = this.renderFilterElements.bind(this);
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
    return fetch(this.props.getData, {credentials: 'include'})
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
      if (loris.userHasPermission('media_write')) {
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
    default:
      return <td className={style}>{cell}</td>;
    }
  }

  /**
   * Renders all elements for the filter.
   *
   * @return {*} filterFormElements
   */
  renderFilterElements() {
    const options = this.state.data.options;
    const filterFormElements = [
      <TextboxElement name='pSCID' label='PSCID'/>,
      <SelectElement name='visitLabel' label='Visit Label' options={options.visits}/>,
      <SelectElement name='instrument' label='Instrument' options={options.instruments}/>,
      <TextboxElement name='fileName' label='File Name'/>,
      <SelectElement name='site' label='For Site' options={options.sites}/>,
      <SelectElement name='language' label='Language' options={options.languages}/>,
      <SelectElement name='fileType' label='File Type' options={options.fileTypes}/>,
      <TextboxElement name='uploadedBy' label='Uploaded By'/>,
    ];
    if (loris.userHasPermission('superUser')) {
      filterFormElements.push(
        <SelectElement name='hideFile' label='File Visibility' options={options.hidden}/>,
      );
    }
    return filterFormElements;
  }

  /**
   * Returns headers for datatable
   *
   * XXX: Currently, the order of these headers MUST match the order of the
   * queried columns in _setupVariables() in media.class.inc
   *
   * @return {object}
   */
  headers() {
    return {
      all: [
        'File Name',
        'PSCID',
        'Visit Label',
        'Language',
        'Instrument',
        'Site',
        'Uploaded By',
        'Date Taken',
        'Comments',
        'Date Uploaded',
        'File Type',
        'Cand ID',
        'Session ID',
        'Hide File',
        'Edit Metadata',
      ],
      hidden: [
        'File Type',
        'Cand ID',
        'Session ID',
        'Hide File',
      ],
    };
  }

  render() {
    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    const tabList = [{id: 'browse', label: 'Browse'}];
    const uploadTab = () => {
      if (loris.userHasPermission('media_write')) {
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
            headers={this.headers()}
            getFormattedCell={this.formatColumn}
            freezeColumn="File Name"
          >
            {this.renderFilterElements()}
          </FilterableDataTable>
        </TabPane>
        {uploadTab()}
      </Tabs>
    );
  }
}

window.addEventListener('load', () => {
  const mediaIndex = (
    <div className="page-media">
      <MediaIndex getData={`${loris.BaseURL}/media/?format=json`} />
    </div>
  );

  ReactDOM.render(mediaIndex, document.getElementById('lorisworkspace'));
});
