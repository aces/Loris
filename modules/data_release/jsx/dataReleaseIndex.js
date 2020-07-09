import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import Modal from 'Modal';

import UploadFileForm from './uploadFileForm';
import AddPermissionForm from './addPermissionForm';
import ManagePermissionsForm from './managePermissionsForm';


/**
 * Data Release
 *
 * Main module component rendering the data release module
 *
 * @author Cécile Madjar
 */
class DataReleaseIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      error: false,
      isLoaded: false,
      show: {
        uploadFileForm: false,
        addPermissionForm: false,
        managePermissionsForm: false,
      },
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
  }

  show(state) {
    let show = this.state.show;
    show[state] = true;
    this.setState({show});
  }

  hide(state) {
    let show = this.state.show;
    show[state] = false;
    this.setState({show});
  }

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
   *
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, row) {
    // Set class to 'bg-danger' if file is hidden.
    let result = <td>{cell}</td>;
    switch (column) {
      case 'File Name':
        if (this.props.hasPermission('superuser')
            || this.props.hasPermission('data_release_view')
            || this.props.hasPermission('data_release_upload')
            || this.props.hasPermission('data_release_edit_file_access')) {
          const downloadURL = loris.BaseURL
            + '/data_release/ajax/GetFile.php?File='
            + encodeURIComponent(row['File Name']);
          result = (
            <td>
              <a
                href = {downloadURL}
                target = "_blank"
                download = {row['File Name']} >
                {cell}
              </a>
            </td>
          );
        }
        break;
      case 'Version':
        result = <td>{cell || 'Unversioned'}</td>;
        break;
    }
    return result;
  }

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
    const fields = [
      {label: 'File Name', show: true, filter: {
        name: 'fileName',
        type: 'text',
      }},
      {label: 'Version', show: true, filter: {
        name: 'version',
        type: 'text',
      }},
      {label: 'Upload Date', show: true, filter: {
        name: 'uploadDate',
        type: 'text',
      }},
    ];

    // Upload File modal window
    const uploadFileForm = (
      <Modal
        title='Upload File'
        label='Upload a New File'
        show={this.state.show.uploadFileForm}
        onClose={() => {
          this.hide('uploadFileForm');
        }}
        onClick={this.uploadFile}
      >
        <UploadFileForm
          DataURL={
            loris.BaseURL
            + '/data_release/ajax/FileUpload.php?action=getData'
          }
          action={
            loris.BaseURL
            + '/data_release/ajax/FileUpload.php?action=upload'
          }
          fetchData={this.fetchData}
        />
      </Modal>
  );

    // Add Permission modal window
    const addPermissionForm = (
      <Modal
        title="Add Permission"
        label="Add Permission"
        show={this.state.show.addPermissionForm}
        onClose={() => {
          this.hide('addPermissionForm');
        }}
        onClick={this.addPermission}
      >
        <AddPermissionForm
          DataURL={
            loris.BaseURL
            + '/data_release/?format=json'
          }
          action={
            loris.BaseURL
            + '/data_release/ajax/AddPermission.php?action=addpermission'
          }
          fetchData={this.fetchData}
        />
      </Modal>
    );

    // Add Manage Permissions modal window
    const managePermissionsForm =
      this.props.hasPermission('data_release_edit_file_access') && (
        <ManagePermissionsForm
          DataURL={
            loris.BaseURL
            + '/data_release/ajax/AddPermission.php?action=getPermissions'
          }
          action={
            loris.BaseURL
            + '/data_release/ajax/AddPermission.php?action=managepermissions'
          }
          options={this.state.data.fieldOptions}
          fetchData={this.fetchData}
          show={this.state.show.managePermissionsForm}
          onClose={() => this.hide('managePermissionsForm')}
        />
    );

    const actions = [
      {
        label: 'Upload File',
        action: () => this.show('uploadFileForm'),
        name: 'uploadFile',
        show: this.props.hasPermission('data_release_upload'),
      },
      {
        label: 'Add Permission',
        action: () => this.show('addPermissionForm'),
        name: 'addPermission',
        show: this.props.hasPermission('data_release_edit_file_access'),
      },
      {
        label: 'Manage Permissions',
        action: () => this.show('managePermissionsForm'),
        name: 'managePermissions',
        show: this.props.hasPermission('data_release_edit_file_access'),
      },
    ];

    return (
      <div>
        {uploadFileForm}
        {addPermissionForm}
        {managePermissionsForm}
        <FilterableDataTable
          name="data_release"
          data={this.state.data.Data}
          fields={fields}
          actions={actions}
          getFormattedCell={this.formatColumn}
        />
      </div>
    );
  }
}

DataReleaseIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <DataReleaseIndex
      dataURL={`${loris.BaseURL}/data_release/?format=json`}
      hasPermission={loris.userHasPermission}
    />,
    document.getElementById('lorisworkspace')
  );
});

