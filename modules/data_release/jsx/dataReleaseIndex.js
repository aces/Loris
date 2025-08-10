import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import Modal from 'Modal';

import UploadFileForm from './uploadFileForm';
import AddPermissionForm from './addPermissionForm';
import ManagePermissionsForm from './managePermissionsForm';

import hiStrings from '../locale/hi/LC_MESSAGES/data_release.json';

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
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  show(state) {
    let show = {...this.state.show};
    show[state] = true;
    this.setState({show});
  }

  hide(state) {
    let show = {...this.state.show};
    show[state] = false;
    this.setState({show});
  }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  fetchData() {
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({data}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  formatColumn(column, cell, row) {
    const {t} = this.props;
    let result = <td>{cell}</td>;
    switch (column) {
    case t('File Name', {ns: 'data_release'}):
      if (this.props.hasPermission('superuser')
            || this.props.hasPermission('data_release_view')
            || this.props.hasPermission('data_release_upload')
            || this.props.hasPermission('data_release_edit_file_access')) {
        const downloadURL = loris.BaseURL
            + '/data_release/files/'
            + encodeURIComponent(row[t('Data Release ID',
              {ns: 'data_release'})]);
        result = (
          <td>
            <a
              href = {downloadURL}
              target = "_blank"
              download = {row[t('File Name', {ns: 'data_release'})]} >
              {cell}
            </a>
          </td>
        );
      }
      break;
    }
    return result;
  }

  render() {
    const {t} = this.props;

    if (this.state.error) {
      return <h3>{t('An error occured while loading the page.',
        {ns: 'data_release'})}</h3>;
    }

    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    const fields = [
      {label: t('File Name', {ns: 'data_release'}), show: true, filter: {
        name: 'fileName',
        type: 'text',
      }},
      {label: t('Version', {ns: 'data_release'}), show: true, filter: {
        name: 'version',
        type: 'text',
      }},
      {label: t('Upload Date', {ns: 'data_release'}), show: true, filter: {
        name: 'uploadDate',
        type: 'text',
      }},
      {label: t('Project Name', {ns: 'data_release'}), show: true, filter: {
        name: 'Project',
        type: 'select',
        options: this.state.data.fieldOptions.projects,
      }},
      {label: t('Data Release ID', {ns: 'data_release'}), show: false},
    ];

    // Upload File modal window
    const uploadFileForm = (
      <Modal
        title={t('Upload File', {ns: 'data_release'})}
        label={t('Upload a New File', {ns: 'data_release'})}
        show={this.state.show.uploadFileForm}
        onClose={() => {
          this.hide('uploadFileForm');
        }}
        onClick={this.uploadFile}
      >
        <UploadFileForm
          DataURL={
            loris.BaseURL
            + '/data_release/files'
          }
          action={loris.BaseURL + '/data_release/files'}
          projects={this.state.data.fieldOptions.projects}
        />
      </Modal>
    );

    // Add Permission modal window
    const addPermissionForm = (
      <Modal
        title={t('Add Permission', {ns: 'data_release'})}
        label={t('Add Permission', {ns: 'data_release'})}
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
            + '/data_release/permissions?action=add'
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
            + '/data_release/permissions'
          }
          action={
            loris.BaseURL
            + '/data_release/permissions?action=manage'
          }
          options={this.state.data.fieldOptions}
          fetchData={this.fetchData}
          show={this.state.show.managePermissionsForm}
          onClose={() => this.hide('managePermissionsForm')}
        />
      );

    const actions = [
      {
        label: t('Upload File', {ns: 'data_release'}),
        action: () => this.show('uploadFileForm'),
        name: 'uploadFile',
        show: this.props.hasPermission('data_release_upload'),
      },
      {
        label: t('Add Permission', {ns: 'data_release'}),
        action: () => this.show('addPermissionForm'),
        name: 'addPermission',
        show: this.props.hasPermission('data_release_edit_file_access'),
      },
      {
        label: t('Manage Permissions', {ns: 'data_release'}),
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
  t: PropTypes.func,
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('ja', 'data_release', {});
  i18n.addResourceBundle('hi', 'data_release', hiStrings);
  const Index = withTranslation(
    ['data_release', 'loris']
  )(DataReleaseIndex);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <Index
      dataURL={`${loris.BaseURL}/data_release/?format=json`}
      hasPermission={loris.userHasPermission}
    />
  );
});

