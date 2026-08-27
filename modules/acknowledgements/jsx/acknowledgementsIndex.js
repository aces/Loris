import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import swal from 'sweetalert2';
import Modal from 'Modal';
import Panel from 'Panel';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import {
  SelectElement,
  FormElement,
  TextboxElement,
  DateElement,
  ButtonElement,
} from 'jsx/Form';
import {Acknowledgement} from './entities';
import {Query} from 'jslib/http';

import frStrings from '../locale/fr/LC_MESSAGES/acknowledgements.json';

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
 */
class AcknowledgementsIndex extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    const {t} = this.props;

    this.state = {
      data: {},
      formData: {},
      submitting: false, // track if form is being submitted
      error: false,
      isLoaded: false,
      affiliationsOptions: {
        douglas: t('Douglas', {ns: 'acknowledgements'}),
        mcgill: t('McGill', {ns: 'acknowledgements'}),
      },
      degreesOptions: {
        bachelors: t('Bachelors', {ns: 'acknowledgements'}),
        masters: t('Masters', {ns: 'acknowledgements'}),
        phd: t('PhD', {ns: 'acknowledgements'}),
        postdoc: t('Postdoctoral', {ns: 'acknowledgements'}),
        md: t('MD', {ns: 'acknowledgements'}),
        registeredNurse: t('Registered Nurse', {ns: 'acknowledgements'}),
      },
      rolesOptions: {
        investigators: t('Investigators', {ns: 'acknowledgements'}),
        projectAdministration: t('Project Administration',
          {ns: 'acknowledgements'}),
        databaseManagement: t('Database Management', {ns: 'acknowledgements'}),
        interviewDataCollection: t('Interview Data Collection',
          {ns: 'acknowledgements'}),
        dataAnalyses: t('Data Analyses', {ns: 'acknowledgements'}),
        mriAcquisition: t('MRI Acquisition', {ns: 'acknowledgements'}),
        dataEntry: t('Data Entry', {ns: 'loris'}),
        databaseProgramming: t('Database Programming',
          {ns: 'acknowledgements'}),
        imagingProcessingAndEvaluation: t('Imaging Processing and Evaluation',
          {ns: 'acknowledgements'}),
        geneticAnalysisAndBiochemicalAssays: t('Genetic Analysis'
          + ' and Biochemical Assays', {ns: 'acknowledgements'}),
        randomizationAndPharmacyAllocation: t('Randomization'
          + ' and Pharmacy Allocation', {ns: 'acknowledgements'}),
        consultants: t('Consultants', {ns: 'acknowledgements'}),
        lpCsfCollection: t('LP/CSF Collection', {ns: 'acknowledgements'}),
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
  async fetchData() {
    const query = new Query().addParam({field: 'format', value: 'json'});
    const client = new Acknowledgement.Client();
    try {
      const acknowledgements = await client.get(query);
      this.setState({data: {...acknowledgements}});
    } catch (error) {
      this.setState({error: true});
      console.error(error);
    }
  }

  /**
   * Extract key values from the form element
   *
   * @param {string} formElement
   * @param {string[]} keys
   * @return {object} - Object of key => value
   */
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
  async handleSubmit(e) {
    const {t} = this.props;
    e.preventDefault(); // prevent default form submission
    const {formData, submitting} = this.state;

    if (submitting) return; // prevent multiple submits

    this.setState({submitting: true}); // set submitting to true

    try {
      const client = new Acknowledgement.Client()
        .setSubEndpoint('AcknowledgementsProcess');
      await client.create(formData);

      await swal.fire(t('Success!', {ns: 'loris'}),
        t('Acknowledgement added.', {ns: 'acknowledgements'}),
        'success');
      this.closeModalForm();
      this.fetchData();
    } catch (error) {
      const message = error.message || t('An unexpected error occurred.',
        {ns: 'acknowledgements'});
      swal.fire(t('Error!', {ns: 'loris'}), message,
        'error');
      console.error(error);
    } finally {
      this.setState({submitting: false});
    }
  }

  /**
   * Return parsed string without commas.
   *
   * @param {string} data - string with commas
   * @param {string} key - string for state json retrieval.
   * @return {string} formatted string for table cell
   */
  parseMultiple(data, key) {
    let parsed = '';
    if (data && data.includes(',')) {
      data = data.split(',');
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
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
   * @return {*} a formatted table cell for a given column
   */
  formatColumn(column, cell, row) {
    const {t} = this.props;
    let result = <td>{cell}</td>;

    switch (column) {
    case t('Affiliations', {ns: 'loris'}):
      result = <td>{this.parseMultiple(cell, 'affiliationsOptions')}</td>;
      break;
    case t('Degrees', {ns: 'acknowledgements'}):
      result = <td>{this.parseMultiple(cell, 'degreesOptions')}</td>;
      break;

    case t('Roles', {ns: 'acknowledgements'}):
      result = <td>{this.parseMultiple(cell, 'rolesOptions')}</td>;
      break;

    case t('Present', {ns: 'acknowledgements'}):
      result = <td>{t(cell, {ns: 'loris'})}</td>;
      break;
    }
    return result;
  }

  /**
   * Open Modal form
   */
  openModalForm() {
    this.setState({showModal: true});
  }

  /**
   * Close Modal form
   */
  closeModalForm() {
    this.setState({
      formData: {},
      showModal: false,
    });
  }

  /**
   * Renders the 'Citation Policy' React component.
   *
   * @return {JSX} - React markup for the component
   */
  renderCitationPolicy() {
    const {t} = this.props;
    return (
      <Panel
        id='citationPolicy'
        title={t('Citation Policy', {ns: 'acknowledgements'})}
      >
        <div className='col-sm-12 col-md-12'>
          <span>{this.state.data.meta.citation_policy}</span>
        </div>
      </Panel>
    );
  }

  /**
   * Renders the 'Add form' React component.
   *
   * @return {JSX} - React markup for the component
   */
  renderAddForm() {
    const {t} = this.props;
    return (
      <Modal
        title={t('Add Acknowledgement', {ns: 'acknowledgements'})}
        onClose={this.closeModalForm}
        show={this.state.showModal}
        throwWarning={(Object.keys(this.state.formData).length !== 0)}
      >
        <FormElement
          Module='acknowledgements'
          name='addAcknowledgement'
          id='addAcknowledgementForm'
          onSubmit={(e) => this.handleSubmit(e)}
          method='POST'
        >
          <TextboxElement
            name='addOrdering'
            label={t('Ordering', {ns: 'acknowledgements'})}
            value={this.state.formData.addOrdering}
            required={true}
            onUserInput={this.setFormData}
          />
          <TextboxElement
            name='addFullName'
            label={t('Full Name', {ns: 'acknowledgements'})}
            value={this.state.formData.addFullName}
            required={true}
            onUserInput={this.setFormData}
          />
          <TextboxElement
            name='addCitationName'
            label={t('Citation Name', {ns: 'acknowledgements'})}
            value={this.state.formData.addCitationName}
            required={true}
            onUserInput={this.setFormData}
          />
          <SelectElement
            name='addAffiliations'
            options={this.state.affiliationsOptions}
            label={t('Affiliations', {ns: 'loris'})}
            value={this.state.formData.addAffiliations}
            multiple={true}
            emptyOption={true}
            onUserInput={this.setFormData}
          />
          <SelectElement
            name='addDegrees'
            options={this.state.degreesOptions}
            label={t('Degrees', {ns: 'acknowledgements'})}
            value={this.state.formData.addDegrees}
            multiple={true}
            emptyOption={true}
            onUserInput={this.setFormData}
          />
          <SelectElement
            name='addRoles'
            options={this.state.rolesOptions}
            label={t('Roles', {ns: 'acknowledgements'})}
            value={this.state.formData.addRoles}
            multiple={true}
            emptyOption={true}
            onUserInput={this.setFormData}
          />
          <DateElement
            name='addStartDate'
            label={t('Start Date', {ns: 'acknowledgements'})}
            value={this.state.formData.addStartDate}
            maxYear={this.state.formData.addEndDate
              || this.state.data.meta.maxYear}
            minYear={this.state.data.meta.minYear}
            required={true}
            onUserInput={this.setFormData}
          />
          <DateElement
            name='addEndDate'
            label={t('End Date', {ns: 'acknowledgements'})}
            value={this.state.formData.addEndDate}
            maxYear={this.state.data.meta.maxYear}
            minYear={this.state.formData.addStartDate
              || this.state.data.meta.minYear}
            required={false}
            onUserInput={this.setFormData}
          />
          <SelectElement
            name='addPresent'
            options={this.state.data.fieldOptions.presents}
            label={t('Present', {ns: 'acknowledgements'})}
            value={this.state.formData.addPresent}
            emptyOption={true}
            required={true}
            onUserInput={this.setFormData}
          />
          <div>
            <ButtonElement
              name='fire_away'
              label={t('Save', {ns: 'loris'})}
              type='submit'
              buttonClass='btn btn-sm btn-primary'
              disabled={this.state.submitting}
            />
          </div>
        </FormElement>
      </Modal>
    );
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    // If error occurs, return a message.
    // XXX: Replace this with a UI component for 500 errors.
    if (this.state.error) {
      return <h3>{t('An error occured while loading the page.',
        {ns: 'loris'})}</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader />;
    }

    /**
     * XXX: Currently, the order of these fields MUST match the order of the
     * queried columns in _setupVariables() in acknowledgements.class.inc
     */
    const options = this.state.data.fieldOptions;
    const fields = [
      {label: t('Ordering', {ns: 'acknowledgements'}), show: true},
      {
        label: t('Full Name', {ns: 'acknowledgements'}), show: true, filter: {
          name: 'fullName',
          type: 'text',
        },
      },
      {
        label: t('Citation Name', {ns: 'acknowledgements'}), show: true,
        filter: {
          name: 'citationName',
          type: 'text',
        },
      },
      {label: t('Affiliations', {ns: 'loris'}), show: true},
      {label: t('Degrees', {ns: 'acknowledgements'}), show: true},
      {label: t('Roles', {ns: 'acknowledgements'}), show: true},
      {
        label: t('Start Date', {ns: 'acknowledgements'}), show: true, filter: {
          name: 'startDate',
          type: 'date',
        },
      },
      {
        label: t('End Date', {ns: 'acknowledgements'}), show: true, filter: {
          name: 'endDate',
          type: 'date',
        },
      },
      {
        label: t('Present', {ns: 'acknowledgements'}), show: true, filter: {
          name: 'present',
          type: 'select',
          options: options.presents,
        },
      },
    ];
    const actions = [
      {
        name: 'addAcknowledgement',
        label: t('Add Acknowledgement', {ns: 'acknowledgements'}),
        action: this.openModalForm,
        show: this.props.hasPermission('acknowledgements_edit'),
      },
    ];

    return (
      <div>
        {this.renderCitationPolicy()}
        {this.renderAddForm()}
        <FilterableDataTable
          name='acknowledgements'
          title={t('Acknowledgements', {ns: 'acknowledgements'})}
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
  hasPermission: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('ja', 'acknowledgements', {});
  i18n.addResourceBundle('fr', 'acknowledgements', frStrings);
  i18n.addResourceBundle('zh', 'acknowledgements', {});
  const TranslatedAcknowledgementsIndex = withTranslation(
    ['acknowledgements', 'loris']
  )(AcknowledgementsIndex);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <TranslatedAcknowledgementsIndex
      hasPermission={loris.userHasPermission}
    />
  );
});
