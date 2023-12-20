import React, {Component} from 'react';
import PropTypes from 'prop-types';

import swal from 'sweetalert2';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import TriggerableModal from 'TriggerableModal';
import AddConsentForm from './consent_index_forms/addConsent';
import AddEConsentForm from './consent_index_forms/addEConsent';
import ShareConsentForm from './consent_index_forms/shareConsent';
import ExpireConsentForm from './consent_index_forms/expireConsent';
import ConsentStatus from './../../candidate_parameters/jsx/ConsentStatus';
/**
 * Consent Module Page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders Consent main page consisting of FilterableDataTable and FormElement.
 *
 * @author Camille beaudoin
 *
 */
class ConsentIndex extends Component {
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
      openAddConsent: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.renderAddConsentForm = this.renderAddConsentForm.bind(this);
    this.openAddForm = this.openAddForm.bind(this);
    this.closeAddForm = this.closeAddForm.bind(this);
    this.submitData = this.submitData.bind(this);
    this.eConsentCompatible = this.eConsentCompatible.bind(this);
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
   * @return {*} a formatted table cell for a given column
   */
  formatColumn(column, cell, row) {
    if (column === 'PSCID') {
      // Link to candidate
      let url = this.props.BaseURL + '/' + row['DCCID'] + '/';
      return <td><a href ={url}>{cell}</a></td>;
    } else if (
      column === 'Consent Form' &&
      this.props.hasPermission('consent_edit')
    ) {
      // Link to eConsent
      let url;
      if (row['OneTimeKey'] !== 'NA') {
        url = this.props.BaseURL
          + '/consent/consent_page/?key='
          + row['OneTimeKey'];
        return <td><a href={url}>{cell}</a></td>;
      }
    } else if (
      (column === 'Request Status' ||
      column === 'Consent Status' ) &&
      cell
    ) {
      // Format casing

      let text = cell.charAt(0).toUpperCase() + cell.slice(1);
      return <td>{text}</td>;
    } else if (column === 'Actions') {
      // Set up action buttons in action column
      let editActionURL = this.props.BaseURL
        + '/candidate_parameters/ajax/formHandler.php';
      let editDataURL = this.props.BaseURL
        + '/candidate_parameters/ajax/getData.php?candID='
        + row['DCCID']+'&data=consentStatus&consent='+row['consentID'];

      // Add edit button for all rows
      const editButton = (
        <TriggerableModal
          title="Edit Consent"
          label=<span className="glyphicon glyphicon-edit"/>
        >
          <ConsentStatus
            action={editActionURL}
            dataURL={editDataURL}
            tabName='consentStatus'
            adjustCol={true}
          />
        </TriggerableModal>
      );

      // Add Send button if eConsent created
      if (row['OneTimeKey'] !== 'NA') {
        const shareButton = (
          <TriggerableModal
            title="Send Consent"
            label=<span className="glyphicon glyphicon-share"/>
          >
            <ShareConsentForm
              submitData={this.submitData}
              data={row}
              BaseURL={this.props.BaseURL}
            />
          </TriggerableModal>
        );
        if (
          row['Request Status'] != 'expired' &&
          this.props.hasPermission('candidate_parameter_edit')
        ) {
          const expireButton = (
            <TriggerableModal
              title="Expire Consent"
              label=<span className="glyphicon glyphicon-remove-circle"/>
            >
              <ExpireConsentForm
                submitData={this.submitData}
                data={row}
                BaseURL={this.props.BaseURL}
              />
            </TriggerableModal>
          );
          return (
            <div class="action-cell">
              <td>{editButton}</td>
              <td>{shareButton}</td>
              <td>{expireButton}</td>
            </div>
          );
        } else {
          return (
            <div class="action-cell">
              <td>{editButton}</td>
              <td>{shareButton}</td>
              <td>{expireButton}</td>
            </div>
          );
        }
      } else if (
        this.eConsentCompatible(row['consent_group_name'], row['DCCID']) &&
        row['OneTimeKey'] === 'NA'
      ) {
        // Button to add as eConsent if eConsent compatible & not yet added
        const addEConsentButton = (
          <TriggerableModal
            title="Add eConsent"
            label=<span className="glyphicon glyphicon-globe"/>
          >
            <AddEConsentForm
              submitData={this.submitData}
              data={row}
              BaseURL={this.props.BaseURL}
            />
          </TriggerableModal>
        );
        return (
          <div class="action-cell">
            <td>{editButton}</td>
            <td>{addEConsentButton}</td>
          </div>
        );
      } else {
        // Add only editButton if not eConsent compatible
        return (
          <div class="action-cell">
            <td>{editButton}</td>
          </div>
        );
      }
    }
    return <td>{cell}</td>;
  }

  /**
   * Render form to add consent row
   * @return {JSX} - React markup for the component
   */
  renderAddConsentForm() {
    return (
      <AddConsentForm
        data={this.state.data}
        closeAddForm={this.closeAddForm}
        openAddConsent={this.state.openAddConsent}
        submitData={this.submitData}
        eConsentCompatible={this.eConsentCompatible}
      />
    );
  }

  /**
   * open add consent form
   */
  openAddForm() {
    this.setState({openAddConsent: true});
  }

  /**
   * close add conent form
   */
  closeAddForm() {
    this.setState({
      openAddConsent: false,
    });
  }

  /**
   * Submit formData to add / update consent rows in DB
   * This submit function functions with all forms accessible from
   * consent index.
   * @param {array} values - Values to be submitted
   * @param {string} action - Action to take
   * @param {string} successMessage - message to display upon submission
   * @param {function} successFn - additional function for successs
   *
   */
  submitData(values, action, successMessage, successFn = null) {
    // create formObject for submit values
    let formObject = new FormData();
    for (let key in values) {
      if (values[key] !== '') {
        formObject.append(key, values[key]);
      }
    }
    formObject.append('action', action);

    // POST data
    fetch(this.props.submitURL, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      body: formObject,
    })
    .then((resp) => {
      // give success message if successful
      if (resp.ok && resp.status === 200) {
        swal.fire('Success!', successMessage, 'success').then((result) => {
          if (result.value) {
            this.closeAddForm();
            this.fetchData();
            this.render();
          }
        });
        // call on success function if given
        if (successFn !== null) {
          successFn();
        }
      } else {
        // give error if unsuccessful
        resp.text().then((message) => {
          swal.fire('Error!', message, 'error');
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  /**
   * Checks if consent form is eConsent compatible
   * @param {array} consentGroupName
   * @param {string} CandID
   *
   * @return {bool} - true if compatible
   */
  eConsentCompatible(consentGroupName, CandID) {
    // Get Candidate CenterID
    let CenterID = this.state.data.fieldOptions.centerIDs[CandID];

    let eConsentForms = this.state.data.fieldOptions.eConsentForms;
    // eConsent compatible if centerID exists in rel table for
    // consent form, or null centerID (default) exists in rel table
    for (let i = 0; i < eConsentForms.length; i++) {
      if (
        eConsentForms[i].Name == consentGroupName &&
        (eConsentForms[i].CenterID == CenterID || !eConsentForms[i].CenterID)
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    // If error occurs, return a message.
    if (this.state.error) {
      return <h3>An error occured while loading the page.</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    const options = this.state.data.fieldOptions;
    let fields = [
      {label: 'PSCID', show: true, filter: {
        name: 'PSCID',
        type: 'text',
      }},
      {label: 'DCCID', show: true, filter: {
        name: 'DCCID',
        type: 'text',
      }},
      {label: 'Consent Form', show: true, filter: {
        name: 'Consent_group',
        type: 'select',
        options: options.consentGroupLabels,
      }},
      {label: 'Consent Code', show: true, filter: {
        name: 'Consent_form',
        type: 'select',
        options: options.consentLabels,
      }},
      {label: 'Request Status', show: true, filter: {
        name: 'RequestStatus',
        type: 'select',
        options: options.requestStatus,
      }},
      {label: 'Consent Status', show: true, filter: {
        name: 'ConsentStatus',
        type: 'select',
        options: options.consentStatus,
      }},
      {label: 'Date Given', show: true, filter: {
        name: 'DateGiven',
        type: 'date',
      }},
      {label: 'Date Withdrawn', show: true, filter: {
        name: 'DateWithdrawn',
        type: 'date',
      }},
      {label: 'Date Sent', show: true, filter: {
        name: 'Date_sent',
        type: 'date',
      }},
      {label: 'Actions', show: this.props.hasPermission('consent_edit')},
      {label: 'consent_group_name', show: false},
      {label: 'OneTimeKey', show: false},
      {label: 'consentID', show: false},
    ];

    // Add edit consent action
    const actions = this.props.hasPermission('consent_edit') ?
      [{name: 'addConsent', label: 'Add Consent', action: this.openAddForm}]
      : null;

    return (
      <div>
        {this.renderAddConsentForm()}
        <FilterableDataTable
          name="consent"
          title='Consent'
          data={this.state.data.Data}
          fields={fields}
          getFormattedCell={this.formatColumn}
          actions={actions}
        />
      </div>
    );
  }
}

ConsentIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <ConsentIndex
      dataURL={`${loris.BaseURL}/consent/?format=json`}
      submitURL={`${loris.BaseURL}/consent/consentdatahandler`}
      BaseURL={loris.BaseURL}
      hasPermission={loris.userHasPermission}
    />,
    document.getElementById('lorisworkspace')
  );
});
