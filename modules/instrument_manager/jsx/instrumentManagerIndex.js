import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Tabs, TabPane} from 'Tabs';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

import InstrumentUploadForm from './uploadForm';

import Modal from 'jsx/Modal';
import InfoPanel from 'jsx/InfoPanel';
import TriggerableModal from '../../../jsx/TriggerableModal';

import Select from 'react-select';
import swal from 'sweetalert2';

import InstrumentDataUploadModal from './uploadDataModal';

/**
 * Instrument Manager Index component
 */
class InstrumentManagerIndex extends Component {
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
      modifyPermissions: false,
      selectedDataFile: null,
      action: null,
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.uploadInstrumentData = this.uploadInstrumentData.bind(this);
    this.setSelectedDataFile = this.setSelectedDataFile.bind(this);
    this.setAction = this.setAction.bind(this);
    this.triggerValidityReport = this.triggerValidityReport.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Update selectedDataFile on data file selection
   * @param {string} element - Element name
   * @param {string} file
   */
  dataFileSelected(element, file) {
    this.setState({
      selectedDataFile: file,
    });
  }

  /**
   * setSelectedDataFile
   * @param {string} file
   */
  setSelectedDataFile(file) {
    this.setState({
      selectedDataFile: file,
    });
  }

  /**
   * setAction
   * @param {string} action
   */
  setAction(action) {
    this.setState({
      action: action,
    });
  }

  /**
   * Retrieve data from the provided URL and save it in state
   * Additionally add hiddenHeaders to global loris variable
   * for easy access by columnFormatter.
   * @return {object}
   */
  fetchData() {
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({data}))
      .catch((error) => {
        this.setState({error: true});
      });
  }

  /**
   * Trigger reportValidity() for form elements
   * @return {void}
   */
  triggerValidityReport() {
    document.querySelector('[name="create_participants"]').reportValidity();
    document.querySelector('[name="instrument_data_file"]').reportValidity();
  }


  /**
   * Upload instrument data
   * @param instrument  Instrument name
   */
  uploadInstrumentData(instrument) { // TODO: Move (back) to InstrumentDataUploadModal
    const data = new FormData();
    data.append('instrument', instrument);
    data.append('action', this.state.action);
    data.append('data_file', this.state.selectedDataFile);

    const url = loris.BaseURL.concat('/instrument_manager/instrument_data/');

    return new Promise(
      (resolve, reject) => {
        fetch(url, {
          method: 'POST',
          credentials: 'same-origin',
          body: data,
        }).then((response) => {
          if (!response.ok) {
            console.error(response.status);
            throw new Error('Unexpected error');
          }
          return response.json();
        }).then((data) => {
          if (data.success) {
            let message = data.message;

            if (Object.keys(data).includes('idMapping')) {
              message = '<div style="overflow-y: scroll; max-height: 50vh;">';
              message += data.message;
              message += '<br/><br/>';
              message += JSON.stringify(data.idMapping);
              message += '</div>';
            }

            swal.fire({
              title: 'Upload Successful!',
              type: 'success',
              html: message,
            });
          } else {
            let message = '<div style="overflow-y: scroll; max-height: 50vh;">';
            if (Array.isArray(data.message)) {
              message += `<br/># Errors: ${data.message.length}<br/><br/>`;
              data.message.forEach((error) => {
                message += (JSON.stringify(error) + '<br/>');
              });
            } else {
              message += data.message;
            }
            message += '</div>';
            throw new Error(message);
          }
          resolve();
        }).catch((e) => {
          swal.fire({
            title: 'No data was uploaded',
            type: 'warning',
            html: e.message,
          });
          reject();
        });
      });
  }


  /**
   * Modify behaviour of specified column cells in the Data Table component
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, row) {
    if (column === 'Permission Required') {
      const clickHandler = (row) => {
        return () => {
          this.setState({
            'modifyPermissions': {
              'instrument': row.Instrument,
              'permissions': row['Permission Required'],
            },
          });
        };
      };
      return (
        <td>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {
              cell == null
                ? 'No Permissions enforced.'
                : cell.join(',')
            }
            {
              this.props.hasPermission('instrument_manager_write') && (
                <button
                  className='btn btn-primary'
                  style={{marginTop: '5px'}}
                  onClick={clickHandler(row)}
                >
                  {cell == null ? 'Add Permissions' : 'Modify Permissions'}
                </button>
              )
            }
          </div>
        </td>
      );
    }


    if (column === 'Upload') {
      return (
        <td style={{verticalAlign: 'middle'}}>
          <TriggerableModal
            label={'Upload Data'}
            title={'Upload Instrument Data'}
            onClose={() => {
              this.setState({
                selectedDataFile: null,
              });
            }}
            onSubmit={(e) => {
              if (
                this.state.selectedDataFile === null ||
                this.state.action === null
              ) {
                this.triggerValidityReport();
                e.preventDefault();
                return;
              }
              return this.uploadInstrumentData(row.Instrument);
            }}
          >
            <InstrumentDataUploadModal
              setSelectedDataFile={this.setSelectedDataFile}
              setAction={this.setAction}
              instrumentList={[row.Instrument]}
            />
          </TriggerableModal>
        </td>
      );
    }
    return (
      <td>{cell}</td>
    );
  }

  /**
   * Renders the React component.
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

    const fields = [
      {label: 'Instrument', show: true, filter: {
        name: 'instrument',
        type: 'text',
      }},
      {label: 'Instrument Type', show: true, filter: {
        name: 'instrumentType',
        type: 'select',
        options: {
          'Instrument Builder': 'Instrument Builder',
          'PHP': 'PHP',
          'Missing': 'Missing',
        },
      }},
      {label: 'Table Installed', show: true, filter: {
        name: 'tableInstalled',
        type: 'select',
        options: {
          'Exists': 'Exists',
          'Missing': 'Missing',
        },
      }},
      {label: 'Table Valid', show: true, filter: {
        name: 'tableValid',
        type: 'text',
      }},
      {label: 'Pages Valid', show: true, filter: {
        name: 'pagesValid',
        type: 'text',
      }},
      {label: 'Permission Required', show: true, filter: {
        name: 'permissionsRequired',
        type: 'text',
      }},
      {label: 'Upload', show: true, filter: {}},
    ];

    const tabs = [
      {id: 'browse', label: 'Browse'},
    ];

    let permsModal = null;
    if (this.state.modifyPermissions !== false) {
      const submitPromise = () => {
        return new Promise(
          (resolve, reject) => {
            fetch(
              this.props.BaseURL + '/instrument_manager/permissions',
              {
                method: 'POST',
                body: JSON.stringify(this.state.modifyPermissions),
              }).then((response) => {
              if (!response.ok) {
                console.error(response.status);
                throw new Error('Could not modify permissions');
              }
              return response.json();
            }).then( (data) => {
              resolve();
              this.fetchData();
            }).catch((message) => {
              swal.fire({
                title: 'Oops..',
                text: 'Something went wrong!',
                type: 'error',
              });
              reject();
            });
          });
      };

      permsModal = (<Modal
        title={'Edit Permissions for '
                + this.state.modifyPermissions.instrument}
        show={true}
        onSubmit={submitPromise}
        onClose={
          () => {
            this.setState({'modifyPermissions': false});
          }
        }>
        <p>Select the permissions required for accessing&nbsp;
          {this.state.modifyPermissions.instrument} in the dropdown below.
        </p>
        <p>Any user accessing the instrument (either for viewing the data
               or data entry) must have one of the access permissions selected.
        </p>
        <InfoPanel>
                A user with <em>any</em> of the selected permissions will
                be able to access&nbsp;
          {this.state.modifyPermissions.instrument}.
                If no permissions are selected, the default LORIS permissions
                will be enforced for this instrument.
        </InfoPanel>

        <PermissionSelect
          codes={this.state.data.fieldOptions.allPermissionCodes}
          selected={this.state.modifyPermissions.permissions}
          instrument={this.state.modifyPermissions.instrument}
          modifySelected={(newselected) => {
            let modifyPermissions = {...this.state.modifyPermissions};
            modifyPermissions.permissions = newselected;
            this.setState({modifyPermissions});
          }}
        />
      </Modal>);
    }
    if (this.props.hasPermission('instrument_manager_write')) {
      tabs.push({id: 'upload', label: 'Upload'});
    }

    const feedback = () => {
      if (!this.state.data.fieldOptions.caninstall
        && this.props.hasPermission('instrument_manager_write')) {
        return (
          <div className='alert alert-warning'>
            Instrument installation is not possible given the current server
            configuration; the LORIS 'adminUser' is not configured properly.
            File upload is still possible but instruments will need to be
            installed manually
          </div>
        );
      }
    };

    const uploadTab = () => {
      let content = null;
      if (!this.props.hasPermission('instrument_manager_write')) {
        content = (
          <div className='alert alert-warning'>
            You do not have access to this page.
          </div>
        );
      } else if (this.state.data.fieldOptions.writable) {
        let url = loris.BaseURL.concat('/instrument_manager/');
        content = (
          <InstrumentUploadForm action={url} data={this.state.data} />
        );
      } else {
        content = (
          <div className='alert alert-warning'>
            Installation is not possible given the current server configuration.
            Please contact your administrator if you require this functionality
          </div>
        );
      }
      return content;
    };

    // const openMultiInstrumentDataUpload = () => {
    //   this.setState({showMultiInstrumentUploadModal: true});
    // };
    // const actions = [
    //   // {
    //   //   label: 'Multi Upload',
    //   //   action: openMultiInstrumentDataUpload,
    //   //   show: this.props.hasPermission('instrument_manager_write'),
    //   // },
    // ];


    return (
      <Tabs tabs={tabs} defaultTab="browse" updateURL={true}>
        <TabPane TabId={tabs[0].id}>
          {permsModal}
          <FilterableDataTable
            name="instrument_manager"
            data={this.state.data.Data}
            fields={fields}
            actions={[]}
            getFormattedCell={this.formatColumn}
          />
        </TabPane>
        <TabPane TabId='upload'>
          {feedback()}
          {uploadTab()}
        </TabPane>
      </Tabs>
    );
  }
}

InstrumentManagerIndex.propTypes = {
  BaseURL: PropTypes.string,
  dataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

/**
 * Create a componenet to select permissions from a list of available
 * permissions.
 * @param {object} props - react props
 * @return {JSX}
 */
function PermissionSelect(props) {
  const options = props.codes.map((val) => {
    return {value: val, label: val};
  });
  const values = options.filter((row) => {
    if (props.selected == null) {
      // nothing selected, filter everything
      return false;
    }
    return props.selected.includes(row.value);
  });
  return <Select
    isMulti={true}
    options={options}
    value={values}
    onChange={(newValue) => {
      props.modifySelected(newValue.map((row) => row.value));
    }}
  />;
}

PermissionSelect.propTypes = {
  codes: PropTypes.array,
  selected: PropTypes.array,
  modifySelected: PropTypes.func,
};

window.addEventListener('load', () => {
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <InstrumentManagerIndex
      BaseURL={loris.BaseURL}
      dataURL={`${loris.BaseURL}/instrument_manager/?format=json`}
      hasPermission={loris.userHasPermission}
    />
  );
});
