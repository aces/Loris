import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import hiStrings from
  '../locale/hi/LC_MESSAGES/examiner.json';
import jaStrings from
  '../locale/ja/LC_MESSAGES/examiner.json';
import frStrings from
  '../locale/fr/LC_MESSAGES/examiner.json';
import zhStrings from '../locale/zh/LC_MESSAGES/examiner.json';

import swal from 'sweetalert2';
import Modal from 'Modal';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import {
  ButtonElement,
  CheckboxElement,
  SelectElement,
  FormElement,
  TextboxElement,
} from 'jsx/Form';

/**
 * Examiner Module Page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders Examiner main page consisting of FilterableDataTable and FormElement.
 *
 * @author Victoria Foing, Zaliqa Rosli
 * @version 1.0.0
 */
class ExaminerIndex extends Component {
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
      formData: {
        addName: null,
        addRadiologist: false,
        addSite: null,
      },
      showModal: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.filterVisibleRows = this.filterVisibleRows.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.mapCSVCell = this.mapCSVCell.bind(this);
    this.renderAddExaminerForm = this.renderAddExaminerForm.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
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
        console.error(error);
      });
  }

  /**
   * Store the value of the element in this.state.formData
   *
   * @param {string} formElement - name of the form element
   * @param {string} value - value of the form element
   */
  setFormData(formElement, value) {
    let formData = this.state.formData;
    formData[formElement] = value;
    this.setState({
      formData: formData,
    });
  }

  /**
   * Get the subset of site IDs visible to the current user.
   *
   * @return {object}
   */
  getVisibleSites() {
    return this.state.data.fieldOptions?.sites || {};
  }

  /**
   * Keep only site IDs visible to the current user.
   *
   * @param {string[]|number[]} siteIds - examiner site IDs
   * @return {string[]|number[]}
   */
  filterVisibleSiteIds(siteIds) {
    const visibleSites = this.getVisibleSites();
    if (!Array.isArray(siteIds)) {
      return [];
    }
    return siteIds.filter((centerId) => visibleSites[centerId] != null);
  }

  /**
   * Convert visible site IDs into site labels.
   *
   * @param {string[]|number[]} siteIds - examiner site IDs
   * @return {string[]}
   */
  mapVisibleSiteNames(siteIds) {
    const visibleSites = this.getVisibleSites();
    return this.filterVisibleSiteIds(siteIds)
      .map((centerId) => visibleSites[centerId]);
  }

  /**
   * Limit rows to examiners that share at least one visible site.
   *
   * @param {Array[]} rows - examiner data rows
   * @return {Array[]}
   */
  filterVisibleRows(rows) {
    return rows.filter((row) => this.filterVisibleSiteIds(row[2]).length > 0);
  }

  /**
   * Handles the submission of the Add Examiner form
   *
   * @param {event} e - event of the form
   */
  handleSubmit(e) {
    const {t} = this.props;
    let formData = this.state.formData;
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
          swal.fire(
            t('Success!', {ns: 'loris'}),
            t('Examiner added.', {ns: 'examiner'}),
            'success'
          ).then((result) => {
            if (result.value) {
              this.closeModal();
              this.fetchData();
            }
          });
        } else {
          resp.json().then((message) => {
            swal.fire(
              t('Error!', {ns: 'loris'}),
              message.error,
              'error'
            );
          });
        }
      })
      .catch((error) => {
        console.error(error);
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
    const {t} = this.props;
    const labelExaminer = t('Examiner', {ns: 'examiner'});
    const labelCertification = t('Certification', {ns: 'examiner'});
    const labelSite = t('Site', {ns: 'loris', count: 1});
    const labelID = t('ID', {ns: 'examiner'});

    let result = <td>{cell}</td>;

    if (column === 'Examiner' || column === labelExaminer) {
      if (this.state.data.fieldOptions.useCertification) {
        const url = loris.BaseURL + '/examiner/editExaminer/?identifier=' +
                    (row.ID || row[labelID]);
        result = <td><a href={url}>{cell}</a></td>;
      } else {
        result = <td>{cell}</td>;
      }
    } else if (column === 'Certification' || column === labelCertification) {
      const certValue = row.Certification || row[labelCertification];
      if (certValue === null) {
        result = <td>{t('None', {ns: 'loris'})}</td>;
      }
    } else if (column === 'Site' || column === labelSite) {
      const siteNames = this.mapVisibleSiteNames(cell);
      result = (
        <td>{siteNames.join(', ')}</td>
      );
      if (siteNames.length === 0) {
        result = (
          <td>{t(
            'This user has no site affiliations',
            {ns: 'examiner'}
          )}</td>
        );
      }
    }
    return result;
  }

  /**
   * Map raw row values to CSV-safe display values.
   *
   * @param {string} column - column label
   * @param {*} cell - raw cell value
   * @return {*} mapped cell value
   */
  mapCSVCell(column, cell) {
    const {t} = this.props;
    const labelCertification = t('Certification', {ns: 'examiner'});
    const labelSite = t('Site', {ns: 'loris', count: 1});

    if (column === labelSite) {
      return this.mapVisibleSiteNames(cell).join(', ');
    }

    if (column === labelCertification && cell === null) {
      return t('None', {ns: 'loris'});
    }

    return cell;
  }

  /**
   * Executed when modal is opened.
   */
  openModal() {
    this.setState({showModal: true});
  }

  /**
   * Executed when modal is closed.
   */
  closeModal() {
    this.setState({
      formData: {},
      showModal: false,
    });
  }

  /**
   * Render the AddExaminer form.
   *
   * @return {JSX} - React markup for the component
   */
  renderAddExaminerForm() {
    const {t} = this.props;
    return (
      <Modal
        title={t('Add Examiner', {ns: 'examiner'})}
        onClose={this.closeModal}
        show={this.state.showModal}
      >
        <FormElement
          Module="examiner"
          name="addExaminer"
          id="addExaminerForm"
          onSubmit={this.handleSubmit}
          method="POST"
        >
          <TextboxElement
            name="addName"
            label={t('Name', {ns: 'examiner'})}
            value={this.state.formData.addName}
            required={true}
            onUserInput={this.setFormData}
          />
          <SelectElement
            name="addSite"
            options={this.state.data.fieldOptions.sites}
            label={t('Site', {ns: 'loris', count: 1})}
            value={this.state.formData.addSite}
            required={true}
            onUserInput={this.setFormData}
          />
          <CheckboxElement
            name="addRadiologist"
            label={t('Radiologist', {ns: 'examiner'})}
            id="checkRadiologist"
            value={this.state.formData.addRadiologist}
            onUserInput={this.setFormData}
          />
          <ButtonElement
            name="fire_away"
            label={
              <div>
                <span className="glyphicon glyphicon-plus"/>
                {' '}
                {t('Add', {ns: 'examiner'})}
              </div>
            }
            type="submit"
            buttonClass="btn btn-sm btn-success"
          />
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
      return (
        <h3>
          {t('An error occured while loading the page.', {ns: 'loris'})}
        </h3>
      );
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    /**
     * XXX: Currently, the order of these fields MUST match the order of the
     * queried columns in _setupVariables() in examiner.class.inc
     */
    const options = this.state.data.fieldOptions;
    const data = this.filterVisibleRows(this.state.data.Data);
    const fields = [
      {label: t('Examiner', {ns: 'examiner'}), show: true, filter: {
        name: 'examiner',
        type: 'text',
      }},
      {label: t('Email', {ns: 'loris'}), show: true},
      {label: t('Site', {ns: 'loris', count: 1}), show: true, filter: {
        name: 'site',
        type: 'select',
        options: options.sites,
      }},
      {label: t('ID', {ns: 'examiner'}), show: false},
      {label: t('Radiologist', {ns: 'examiner'}), show: true, filter: {
        name: 'radiologist',
        type: 'select',
        options: {
          [t('Yes', {ns: 'loris'})]: t('Yes', {ns: 'loris'}),
          [t('No', {ns: 'loris'})]: t('No', {ns: 'loris'}),
        },
      }},
      {label: t('Certification', {ns: 'examiner'}),
        show: this.state.data.fieldOptions.useCertification},
    ];
    const actions = [
      {
        name: 'addExaminer',
        label: t('Add Examiner', {ns: 'examiner'}),
        action: this.openModal,
      },
    ];

    return (
      <div>
        {this.renderAddExaminerForm()}
        <FilterableDataTable
          name='examiner'
          title={t('Examiner', {ns: 'examiner'})}
          data={data}
          fields={fields}
          getFormattedCell={this.formatColumn}
          getMappedCell={this.mapCSVCell}
          actions={actions}
        />
      </div>
    );
  }
}

ExaminerIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  submitURL: PropTypes.string,
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('hi', 'examiner', hiStrings);
  i18n.addResourceBundle('ja', 'examiner', jaStrings);
  i18n.addResourceBundle('fr', 'examiner', frStrings);
  i18n.addResourceBundle('zh', 'examiner', zhStrings);
  const Index = withTranslation(
    ['examiner', 'loris']
  )(ExaminerIndex);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <Index
      dataURL={`${loris.BaseURL}/examiner/?format=json`}
      submitURL={`${loris.BaseURL}/examiner/addExaminer`}
      hasPermission={loris.userHasPermission}
    />
  );
});
