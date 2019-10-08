import React, {Component} from 'react';
import PropTypes from 'prop-types';

import swal from 'sweetalert2';
import Modal from 'Modal';
import Panel from 'Panel';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

/**
 * Acknowledgements Module page.
 *
 * Serves as an entry-point to the module, rendering the whole React
 * component page on load.
 *
 * Renders main page consisting of FilterableDataTable, CitationPolicy
 * and addAcknowledgement.
 *
 * @author Zaliqa Rosli
 * @version 1.0.0
 *
 */
class AcknowledgementsIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      formData: {},
      error: false,
      isLoaded: false,
      affiliationsOptions: {
        douglas: 'Douglas',
        mcgill: 'McGill',
      },
      degreesOptions: {
        bachelors: 'Bachelors',
        masters: 'Masters',
        phd: 'PhD',
        postdoc: 'Postdoctoral',
        md: 'MD',
        registeredNurse: 'Registered Nurse',
      },
      rolesOptions: {
        investigators: 'Investigators',
        projectAdministration: 'Project Administration',
        databaseManagement: 'Database Management',
        interviewDataCollection: 'Interview Data Collection',
        dataAnalyses: 'Data Analyses',
        mriAcquisition: 'MRI Acquisition',
        dataEntry: 'Data Entry',
        databaseProgramming: 'Database Programming',
        imagingProcessingAndEvaluation: 'Imaging Processing and Evaluation',
        geneticAnalysisAndBiochemicalAssays: 'Genetic Analysis and Biochemical Assays',
        randomizationAndPharmacyAllocation: 'Randomization and Pharmacy Allocation',
        consultants: 'Consultants',
        lpCsfCollection: 'LP/CSF Collection',
      },
      showModal: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.pickElements = this.pickElements.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.openModalForm = this.openModalForm.bind(this);
    this.closeModalForm = this.closeModalForm.bind(this);
    this.renderCitationPolicy = this.renderCitationPolicy.bind(this);
    this.renderAddForm = this.renderAddForm.bind(this);
    this.parseMultiple = this.parseMultiple.bind(this);
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

  pickElements(formElement, keys) {
    let subset = {};
    keys.forEach((key) => {
      if (formElement.hasOwnProperty(key)) {
        subset[key] = formElement[key];
      }
    });
    return subset;
  }

  /**
   * Store the value of the element in this.state.formData
   *
   * @param {string} formElement - name of the form element
   * @param {string} value - value of the form element
   */
  setFormData(formElement, value) {
    const formData = Object.assign({}, this.state.formData);
    formData[formElement] = value;
    this.setState({
      formData: formData,
    });
  }

  /**
   * Handles the submission of the Add Acknowledgements form
   *
   * @param {event} e - event of the form
   */
  handleSubmit(e) {
    const formData = Object.assign({}, this.state.formData);
    let formObject = new FormData();
    for (let key in formData) {
      if (formData[key] !== '') {
        formObject.append(key, formData[key]);
      }
    }
    formObject.append('fire_away', 'Add');

    fetch(this.props.submitURL, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      body: formObject,
    })
    .then((resp) => {
      if (resp.ok && resp.status === 200) {
        swal.fire('Success!', 'Acknowledgement added.', 'success').then((result) => {
          if (result.value) {
            this.closeModalForm();
            this.fetchData();
          }
        });
      } else {
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
   * Return parsed string without commas.
   *
   * @param {string} data - string with commas
   * @param {string} key - string for state json retrieval.
   *
   * @return {string} formatted string for table cell
   */
  parseMultiple(data, key) {
    let parsed = '';
    if (data && data.includes(',')) {
      data = data.split(',');
      for (let i=0; i<data.length; i++) {
        if (i===0) {
          parsed = this.state[key][data[i]];
        } else {
          parsed = parsed + ', ' + this.state[key][data[i]];
        }
      }
    } else {
      parsed = this.state[key][data];
    }
    return parsed;
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
    let result = <td>{cell}</td>;

    switch (column) {
      case 'Affiliations':
        result = <td>{this.parseMultiple(cell, 'affiliationsOptions')}</td>;
        break;
      case 'Degrees':
        result = <td>{this.parseMultiple(cell, 'degreesOptions')}</td>;
        break;

      case 'Roles':
        result = <td>{this.parseMultiple(cell, 'rolesOptions')}</td>;
        break;
    }
    return result;
  }

  openModalForm() {
    this.setState({showModal: true});
  }

  closeModalForm() {
    this.setState({
      formData: {},
      showModal: false,
    });
  }

  renderCitationPolicy() {
    return (
      <Panel
        id='citationPolicy'
        title='Citation Policy'
      >
        <div className='col-sm-12 col-md-12'>
          <span>{this.state.data.citation_policy}</span>
        </div>
      </Panel>
    );
  }

  renderAddForm() {
    const requireEndDate = (this.state.formData.addPresent === 'No') || false;
    const disableEndDate = (this.state.formData.addPresent === 'Yes') || false;
    return (
      <Modal
        title='Add Acknowledgement'
        onClose={this.closeModalForm}
        show={this.state.showModal}
        throwWarning={(Object.keys(this.state.formData).length !== 0)}
      >
        <FormElement
          Module='acknowledgements'
          name='addAcknowledgement'
          id='addAcknowledgementForm'
          onSubmit={this.handleSubmit}
          method='POST'
        >
          <TextboxElement
            name='addOrdering'
            label='Ordering'
            value={this.state.formData.addOrdering}
            required={true}
            onUserInput={this.setFormData}
          />
          <TextboxElement
            name='addFullName'
            label='Full Name'
            value={this.state.formData.addFullName}
            required={true}
            onUserInput={this.setFormData}
          />
          <TextboxElement
            name='addCitationName'
            label='Citation Name'
            value={this.state.formData.addCitationName}
            required={true}
            onUserInput={this.setFormData}
          />
          <SelectElement
            name='addAffiliations'
            options={this.state.affiliationsOptions}
            label='Affiliations'
            value={this.state.formData.addAffiliations}
            multiple={true}
            emptyOption={true}
            onUserInput={this.setFormData}
          />
          <SelectElement
            name='addDegrees'
            options={this.state.degreesOptions}
            label='Degrees'
            value={this.state.formData.addDegrees}
            multiple={true}
            emptyOption={true}
            onUserInput={this.setFormData}
          />
          <SelectElement
            name='addRoles'
            options={this.state.rolesOptions}
            label='Roles'
            value={this.state.formData.addRoles}
            multiple={true}
            emptyOption={true}
            onUserInput={this.setFormData}
          />
          <DateElement
            name='addStartDate'
            label='Start date'
            value={this.state.formData.addStartDate}
            maxYear={this.state.formData.addEndDate || this.state.data.maxYear}
            minYear={this.state.data.minYear}
            required={true}
            onUserInput={this.setFormData}
          />
          <DateElement
            name='addEndDate'
            label='End date'
            value={this.state.formData.addEndDate}
            maxYear={this.state.data.maxYear}
            minYear={this.state.formData.addStartDate || this.state.data.minYear}
            disabled={disableEndDate}
            required={requireEndDate}
            onUserInput={this.setFormData}
          />
          <SelectElement
            name='addPresent'
            options={this.state.data.fieldOptions.presents}
            label='Present'
            value={this.state.formData.addPresent}
            emptyOption={true}
            required={true}
            onUserInput={this.setFormData}
          />
          <div>
            <ButtonElement
              name='fire_away'
              label='Save'
              type='submit'
              buttonClass='btn btn-sm btn-primary'
            />
          </div>
        </FormElement>
      </Modal>
    );
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
    * queried columns in _setupVariables() in acknowledgements.class.inc
    */
    const options = this.state.data.fieldOptions;
    const fields = [
      {label: 'Ordering', show: true},
      {label: 'Full Name', show: true, filter: {
        name: 'fullName',
        type: 'text',
      }},
      {label: 'Citation Name', show: true, filter: {
        name: 'citationName',
        type: 'text',
      }},
      {label: 'Affiliations', show: true},
      {label: 'Degrees', show: true},
      {label: 'Roles', show: true},
      {label: 'Start Date', show: true, filter: {
        name: 'startDate',
        type: 'date',
      }},
      {label: 'End Date', show: true, filter: {
        name: 'endDate',
        type: 'date',
      }},
      {label: 'Present', show: true, filter: {
        name: 'present',
        type: 'select',
        options: options.presents,
      }},
    ];
    const actions = [
      {name: 'addAcknowledgement', label: 'Add Acknowledgement', action: this.openModalForm},
    ];

    return (
      <div>
        {this.renderCitationPolicy()}
        {this.renderAddForm()}
        <FilterableDataTable
          name='acknowledgements'
          title='Acknowledgements'
          data={this.state.data.Data}
          fields={fields}
          getFormattedCell={this.formatColumn}
          actions={actions}
        />
      </div>
    );
  }
}

AcknowledgementsIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  submitURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <AcknowledgementsIndex
      dataURL={`${loris.BaseURL}/acknowledgements/?format=json`}
      submitURL={`${loris.BaseURL}/acknowledgements/`}
      hasPermission={loris.userHasPermission}
    />,
    document.getElementById('lorisworkspace')
  );
});
