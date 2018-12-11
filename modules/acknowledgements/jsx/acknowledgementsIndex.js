import React, {Component} from 'react';
import PropTypes from 'prop-types';

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
        douglas: "Douglas",
        mcgill: "McGill"
      },
      degreesOptions: {
        bachelors: "Bachelors",
        masters: "Masters",
        phd: "PhD",
        postdoc: "Postdoctoral",
        md: "MD",
        registeredNurse: "Registered Nurse"
      },
      rolesOptions: {
        investigators: "Investigators",
        projectAdministration: "Project Administration",
        databaseManagement: "Database Management",
        interviewDataCollection: "Interview Data Collection",
        dataAnalyses: "Data Analyses",
        mriAcquisition: "MRI Acquisition",
        dataEntry: "Data Entry",
        databaseProgramming: "Database Programming",
        imagingProcessingAndEvaluation: "Imaging Processing and Evaluation",
        geneticAnalysisAndBiochemicalAssays: "Genetic Analysis and Biochemical Assays",
        randomizationAndPharmacyAllocation: "Randomization and Pharmacy Allocation",
        consultants: "Consultants",
        lpCsfCollection: "LP/CSF Collection"
      },
      presentOptions: {
        yes: "Yes",
        no: "No"
      },
    };

    this.fetchData = this.fetchData.bind(this);
    this.pickElements = this.pickElements.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
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
    const formData = this.state.formData;
    formData[formElement] = value;
    this.setState({
      formData: formData
    });
  }

  /**
   * Handles the submission of the Add Acknowledgements form
   *
   * @param {event} e - event of the form
   */
  handleSubmit(e) {
    let formData = this.state.formData;
    let formObject = new FormData();
    for (let key in formData) {
      if (formData[key] !== '') {
        formObject.append(key, formData[key]);
      }
    }
    formObject.append('fire_away', 'Add');
    $.ajax({
      type: 'POST',
      url: loris.BaseURL + '/acknowledgements/',
      data: formObject,
      cache: false,
      contentType: false,
      processData: false,
      success: data => {
        swal('Success!', 'Acknowledgement added.', 'success');
        this.fetchData();
      },
      error: error => {
        console.error(error);
        let message = error.responseText;
        swal('Error!', message, 'error');
      }
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
    return <td>{cell}</td>;
  }

  renderCitationPolicy() {
    return (
      <Panel
        id="citationPolicy"
        title="Citation Policy"
      >
        <div className="col-sm-12 col-md-12">
          <span>{this.state.data.citation_policy}</span>
        </div>
      </Panel>
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
        name: 'startDate',
        type: 'date',
        }},
      {label: 'Present', show: true, filter: {
        name: 'present',
        type: 'select',
        options: this.state.presentOptions,
      }},
    ];

    const addButton = (
      <ButtonElement
        name="addAcknowledgement"
        label="Add Acknowledgement"
        type="button"
        buttonClass="btn btn-sm btn-primary col-xs-12 addCTA"
        columnSize="col-sm-3 col-md-2 col-xs-12 pull-right"
        onUserInput={this.openModalForm}
      />
    );

    return (
      <div id="acknowledgementsIndex">
          <div id="addAcknowledgements">
            {addButton}
          </div>
        <div id="acknowledgementsFilter">
          <FilterableDataTable
            name="acknowledgements"
            data={this.state.data.Data}
            fields={fields}
            getFormattedCell={this.formatColumn}
          />
        </div>
      </div>
    );
  }
}

AcknowledgementsIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <AcknowledgementsIndex
      dataURL={`${loris.BaseURL}/acknowledgements/?format=json`}
      hasPermission={loris.userHasPermission}
    />,
    document.getElementById('lorisworkspace')
  );
});
