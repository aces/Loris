import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Tabs, TabPane} from 'Tabs';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

import InstrumentUploadForm from './uploadForm';

import Modal from 'jsx/Modal';
import InfoPanel from 'jsx/InfoPanel';

import Select from 'react-select';
import swal from 'sweetalert2';

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
      modifyDDE: false,
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
    if (
      column === 'Permission Required'
      || column === 'Double Data Entry Visits'
    ) {
      const clickHandler = (row) => {
        return () => {
          if (column === 'Permission Required') {
            this.setState({
              'modifyPermissions': {
                'instrument': row.Instrument,
                'permissions': row['Permission Required'],
              },
            });
          } else {
            this.setState({
              'modifyDDE': {
                'instrument': row.Instrument,
                'visits': row['Double Data Entry Visits'],
              },
            });
          }
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
              column === 'Permission Required' ?
                (cell == null
                ? 'No Permissions enforced.'
                : cell.join(',')) :
                (cell == null
                  ? 'DDE not enabled for any visits.'
                  : cell.join(','))
            }
            {
              this.props.hasPermission('instrument_manager_write')&& (
                <button
                  className='btn btn-primary'
                  style={{marginTop: '5px'}}
                  onClick={clickHandler(row)}
                >
                  {
                    column === 'Permission Required' ?
                      (cell == null
                      ? 'Add Permissions'
                      : 'Modify Permissions') :
                      (cell == null
                        ? 'Add DDE Visits'
                        : 'Modify DDE Visits')
                  }
                </button>
              )
            }
          </div>
        </td>
      );
    }
    return (
      <td>{cell}</td>
    );
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
      {label: 'Double Data Entry Visits', show: true, filter: {
        name: 'ddeVisits',
        type: 'text',
      }},
    ];

    const tabs = [
      {id: 'browse', label: 'Browse'},
    ];

    const submitPromise = () => {
      return new Promise(
        (resolve, reject) => {
          fetch(
            (this.state.modifyPermissions
              ? this.props.BaseURL + '/instrument_manager/permissions'
              : this.props.BaseURL + '/instrument_manager/modifydde'),
            {
              method: 'POST',
              body: JSON.stringify(
                this.state.modifyPermissions
                ? this.state.modifyPermissions
                : this.state.modifyDDE),
            }).then((response) => {
              if (!response.ok) {
                console.error(response.status);
                throw new Error('Could not modify');
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

    let permsModal = null;
    if (this.state.modifyPermissions !== false) {
        permsModal = (<Modal
          title={'Edit Permissions for '
              + this.state.modifyPermissions.instrument}
          show={true}
          onSubmit={submitPromise}
          onClose={
              () => {
                  this.setState({'modifyPermissions': false});
              }
          }
          style={{
            overflow: 'scroll',
          }}
          >
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

          <ModalSelect
            codes={this.state.data.fieldOptions.allPermissionCodes}
            selected={this.state.modifyPermissions.permissions}
            instrument={this.state.modifyPermissions.instrument}
            modifySelected={(newselected) => {
                let modifyPermissions = {...this.state.modifyPermissions};
                modifyPermissions.permissions = newselected;
                this.setState({modifyPermissions});
            }}
          />
          <div style={{height: '200px'}}></div>
        </Modal>);
    }
    let ddeModal = null;
    if (this.state.modifyDDE !== false) {
        ddeModal = (<Modal
            title={'Edit Double Data Entry Visits for '
                + this.state.modifyDDE.instrument}
            show={true}
            onSubmit={submitPromise}
            onClose={
                () => {
                    this.setState({'modifyDDE': false});
                }
            }>
            <div
              style={{
                paddingBottom: '100px',
                marginBottom: '100px',
              }}
            >
              <p>Select the visits that should have Double Data Entry for&nbsp;
              {this.state.modifyDDE.instrument} in the dropdown below.
              </p>
              <ModalSelect
                codes={
                  this.state.data.fieldOptions.visitLabels[
                    this.state.modifyDDE.instrument
                  ]
                }
                selected={this.state.modifyDDE.visits}
                instrument={this.state.modifyDDE.instrument}
                modifySelected={(newselected) => {
                    this.setState({
                      modifyDDE: {...this.state.modifyDDE, visits: newselected},
                    });
                }}
            />
            </div>
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
          <InstrumentUploadForm action={url}/>
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

    return (
      <Tabs tabs={tabs} defaultTab="browse" updateURL={true}>
        <TabPane TabId={tabs[0].id}>
          {permsModal}
          {ddeModal}
          <FilterableDataTable
            name="instrument_manager"
            data={this.state.data.Data}
            fields={fields}
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
 * Create a component to select items from a list
 *
 * @param {object} props - react props
 * @return {JSX}
 */
function ModalSelect(props) {
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

ModalSelect.propTypes = {
    codes: PropTypes.array,
    formElement: PropTypes.string,
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
