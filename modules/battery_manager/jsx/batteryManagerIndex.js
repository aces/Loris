import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import Modal from 'Modal';
import swal from 'sweetalert2';
import {CTA} from 'jsx/Form';

import BatteryManagerForm from './batteryManagerForm';
import hiStrings from '../locale/hi/LC_MESSAGES/battery_manager.json';

/**
 * Battery Manager
 *
 * Main module component rendering tab pane with Browse and Add tabs
 *
 * @author Victoria Foing
 * @author Henri Rabalais
 */
class BatteryManagerIndex extends Component {
  /**
   * Constructor
   *
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      tests: {},
      test: {},
      add: false,
      edit: false,
      error: false,
      errors: {},
      isLoaded: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.postData = this.postData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.saveTest = this.saveTest.bind(this);
    this.setTest = this.setTest.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.validateTest = this.validateTest.bind(this);
  }

  /**
   * Component did mount lifecycle method.
   */
  componentDidMount() {
    this.fetchData(this.props.testEndpoint, 'GET', 'tests')
      .then(() => this.fetchData(this.props.optionEndpoint, 'GET', 'options'))
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrieve data from the provided URL and store it in state
   *
   * @param {string} url
   * @param {string} method
   * @param {string} state
   * @return {object} promise
   */
  fetchData(url, method, state) {
    return new Promise((resolve, reject) => {
      return fetch(url, {credentials: 'same-origin', method: method})
        .then((resp) => resp.json())
        .then((data) => this.setState({[state]: data}, resolve))
        .catch((error) => {
          this.setState({error: true}, reject);
          console.error(error);
        });
    });
  }
  /**
   * Posts data from the provided URL to the server.
   *
   * @param {string} url
   * @param {object} data
   * @param {string} method
   * @return {object} promise
   */
  postData(url, data, method) {
    return new Promise((resolve, reject) => {
      const dataClone = JSON.parse(JSON.stringify(data));
      return fetch(url, {
        credentials: 'same-origin',
        method: method,
        body: JSON.stringify(dataClone),
      })
        .then((response) => response.text()
          .then((body) => {
            body = JSON.parse(body);
            if (response.ok) {
              swal.fire(
                this.props.t('Submission successful!', {ns: 'battery_manager'}),
                body.message,
                'success'
              ).then((result) => {
                if (result.value) {
                  this.closeForm();
                  resolve(body.message);
                }
              });
            } else {
              swal.fire(body.error, '', 'error');
              reject(body.error);
            }
          })
          .catch((e) => reject(e)));
    });
  }
  /**
   * Modify value of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} value - cell value
   * @return {string} a mapped value for the table cell at a given column
   */
  mapColumn(column, value) {
    const { t } = this.props;
    switch (column) {
    case t('First Visit', {ns: 'battery_manager'}):
      switch (value) {
      case 'Y':
        return t('Yes', {ns: 'battery_manager'});
      case 'N':
        return t('No', {ns: 'battery_manager'});
      default:
        return value;
      }
    case t('Active', {ns: 'battery_manager'}):
      switch (value) {
      case 'Y':
        return t('Yes', {ns: 'battery_manager'});
      case 'N':
        return t('No', {ns: 'battery_manager'});
      default:
        return value;
      }
    case t('Change Status', {ns: 'battery_manager'}):
    case t('Edit Metadata', {ns: 'battery_manager'}):
      return '';
    default:
      return value;
    }
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
    const { t } = this.props;
    cell = this.mapColumn(column, cell);
    let result = <td>{cell}</td>;
    const testId = row['ID'];
    switch (column) {
    case t('Instrument', {ns: 'battery_manager'}):
      result = <td>{this.state.options.instruments[cell]}</td>;
      break;
    case t('Cohort', {ns: 'battery_manager'}):
      result = <td>{this.state.options.cohorts[cell]}</td>;
      break;
    case t('Site', {ns: 'battery_manager'}):
      result = <td>{this.state.options.sites[cell]}</td>;
      break;
    case t('Change Status', {ns: 'battery_manager'}):
      if (row.Active === 'Y') {
        result = <td><CTA label={t('Deactivate', {ns: 'battery_manager'})} onUserInput={() => {
          this.deactivateTest(testId);
        }}/></td>;
      } else if (row.Active === 'N') {
        result = <td><CTA label={t('Activate', {ns: 'battery_manager'})} onUserInput={() => {
          this.activateTest(testId);
        }}/></td>;
      }
      break;
    case t('Edit Metadata', {ns: 'battery_manager'}):
      const editButton = <CTA label={t('Edit', {ns: 'battery_manager'})} onUserInput={() => {
        this.loadTest(testId);
        this.setState({edit: true});
      }}/>;
      result = <td>{editButton}</td>;
      break;
    }

    return result;
  }

  /**
   * Set the form data based on state values of child elements/components
   *
   * @param {string} name - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setTest(name, value) {
    const test = {...this.state.test};
    // Convert numeric fields to number, keep 0
    if (['ageMinDays', 'ageMaxDays', 'instrumentOrder'].includes(name)) {
      test[name] = value !== '' ? Number(value) : null;
    } else {
      test[name] = value;
    }
    this.setState({test});
  }

  /**
   * Loads a test into the current state based on the testId
   *
   * @param {string} testId
   */
  loadTest(testId) {
    const test = JSON.parse(JSON.stringify(this.state.tests
      .find((test) => test.id === testId)));
    this.setState({test});
  }
  /**
   * Close the Form
   */
  closeForm() {
    this.setState({add: false, edit: false, test: {}, errors: {}});
  }

  /**
   * Activate Test
   *
   * @param {number} id
   */
  activateTest(id) {
    const test = this.state.tests.find((test) => test.id === id);
    test.active = 'Y';
    this.saveTest(test, 'PUT');
  }

  /**
   * Deactivate Test
   *
   * @param {number} id
   */
  deactivateTest(id) {
    const test = this.state.tests.find((test) => test.id === id);
    test.active = 'N';
    this.saveTest(test, 'PUT');
  }

  /**
   * Updates a previously existing Test with an updated Test.
   *
   * @param {object} test
   * @param {string} request
   * @return {object} promise
   */
  saveTest(test, request) {
    return new Promise((resolve, reject) => {
      Object.keys(test).forEach((key) => {
        // Only convert empty string to null, keep 0 as-is
        if (test[key] === '') {
          test[key] = null;
        }
      });
      this.checkDuplicate(test)
        .then((test) => this.validateTest(test))
        .then((test) => this.postData(
          this.props.testEndpoint + (test.id || ''),
          test,
          request
        ))
        .then(() => this.fetchData(this.props.testEndpoint, 'GET', 'tests'))
        .then(() => resolve())
        .catch((e) => reject(e));
    });
  }

  // checkDuplicate and validateTest are defined later in the class
  /**
   * Render Method
   *
   * @return {*}
   */
  render() {
    const { t } = this.props;

    // If error occurs, return a message.
    // XXX: Replace this with a UI component for 500 errors.
    if (this.state.error) {
      return <h3>{t('An error occured while loading the page.', {ns: 'battery_manager'})}</h3>;
    }
    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }
    /**
     * XXX: Currently, the order of these fields MUST match the order of the
     * queried columns in _setupVariables() in batter_manager.class.inc
     */
    const {options, test, tests, errors, add, edit} = this.state;
    const {hasPermission} = this.props;

    const fields = [
      {label: 'ID', show: false},
      {label: t('Instrument', {ns: 'battery_manager'}), show: true, filter: {
        name: 'testName',
        type: 'select',
        options: options.instruments,
      }},
      {label: t('Minimum Age', {ns: 'battery_manager'}), show: true, filter: {
        name: 'minimumAge',
        type: 'numeric',
      }},
      {label: t('Maximum Age', {ns: 'battery_manager'}), show: true, filter: {
        name: 'maximumAge',
        type: 'numeric',
      }},
      {label: t('Stage', {ns: 'battery_manager'}), show: true, filter: {
        name: 'stage',
        type: 'select',
        options: options.stages,
      }},
      {label: t('Cohort', {ns: 'battery_manager'}), show: true, filter: {
        name: 'cohort',
        type: 'select',
        options: options.cohorts,
      }},
      {label: t('Visit Label', {ns: 'battery_manager'}), show: true, filter: {
        name: 'visitLabel',
        type: 'select',
        options: options.visits,
      }},
      {label: t('Site', {ns: 'battery_manager'}), show: true, filter: {
        name: 'site',
        type: 'select',
        options: options.sites,
      }},
      {label: t('First Visit', {ns: 'battery_manager'}), show: true, filter: {
        name: 'firstVisit',
        type: 'select',
        options: options.firstVisit,
      }},
      {label: t('Instrument Order', {ns: 'battery_manager'}), show: true, filter: {
        name: 'instrumentOrder',
        type: 'text',
      }},
      {label: t('Double Data Entry Enabled', {ns: 'battery_manager'}), show: true, filter: {
        name: 'DoubleDataEntryEnabled',
        type: 'select',
        options: options.DoubleDataEntryEnabled,
      }},
      {label: t('Active', {ns: 'battery_manager'}), show: true, filter: {
        name: 'active',
        type: 'select',
        options: options.active,
      }},
      {label: t('Change Status', {ns: 'battery_manager'}), show: hasPermission('battery_manager_edit')},
      {label: t('Edit Metadata', {ns: 'battery_manager'}), show: hasPermission('battery_manager_edit')},
    ];

    const actions = [
      {
        label: t('New Test', {ns: 'battery_manager'}),
        action: () => this.setState({add: true}),
        show: hasPermission('battery_manager_edit'),
      },
    ];

    const testsArray = tests.map((test) => {
      return [
        test.id,
        test.testName,
        test.ageMinDays,
        test.ageMaxDays,
        test.stage,
        test.cohort,
        test.visitLabel,
        test.centerId,
        test.firstVisit,
        test.instrumentOrder,
        test.DoubleDataEntryEnabled,
        test.active,
      ];
    });

    const modalTitle = edit ? t('Edit Test', {ns: 'battery_manager'}) : t('Add New Test', {ns: 'battery_manager'});
    const request = edit ? 'PUT' : 'POST';
    const handleSubmit = () => this.saveTest(test, request);

    return (
      <div>
        <FilterableDataTable
          name="battery_manager"
          data={testsArray}
          fields={fields}
          actions={actions}
          getFormattedCell={this.formatColumn.bind(this)}
          getMappedCell={this.mapColumn.bind(this)}
        />
        <Modal
          title={modalTitle}
          show={add || edit}
          onClose={this.closeForm}
          throwWarning={Object.keys(test).length !== 0}
        >
          <BatteryManagerForm
            test={test}
            setTest={this.setTest}
            options={options}
            add={add}
            errors={errors}
            handleSubmit={handleSubmit}
          />
        </Modal>
      </div>
    );
  }

  /**
   * Checks whether the Test is a duplicate of an existing Test.
   *
   * @param {object} test
   * @return {object} promise
   */
  checkDuplicate(test) {
    return new Promise((resolve, reject) => {
      let duplicate;
      this.state.tests.forEach((testCheck) => {
        if (
          test.testName == testCheck.testName &&
          test.ageMinDays == testCheck.ageMinDays &&
          test.ageMaxDays == testCheck.ageMaxDays &&
          test.stage == testCheck.stage &&
          test.cohort == testCheck.cohort &&
          test.visitLabel == testCheck.visitLabel &&
          test.centerId == testCheck.centerId &&
          test.firstVisit == testCheck.firstVisit &&
          test.DoubleDataEntryEnabled == testCheck.DoubleDataEntryEnabled
        ) {
          duplicate = testCheck;
        }
      });

      const { t } = this.props;

      if (duplicate && duplicate.id !== test.id) {
        if (duplicate.active === 'N') {
          const edit = test.id ? t('This will deactivate the current test.', {ns: 'battery_manager'}) : '';
          swal.fire({
            title: t('Test Duplicate', {ns: 'battery_manager'}),
            text: t('The information provided corresponds with a deactivated test that already exists in the system. Would you to like activate that test?', {ns: 'battery_manager'}) + ' ' + edit,
            type: 'warning',
            confirmButtonText: t('Activate', {ns: 'battery_manager'}),
            showCancelButton: true,
          }).then((result) => {
            if (result.value) {
              this.activateTest(duplicate.id);
              if (test.id && (test.id !== duplicate.id)) {
                this.deactivateTest(test.id);
              }
              this.closeForm();
            }
          });
        } else if (duplicate.active === 'Y') {
          swal.fire(
            t('Test Duplicate', {ns: 'battery_manager'}),
            t('You cannot duplicate an active test', {ns: 'battery_manager'}),
            'error'
          );
        }
        reject();
      } else {
        resolve(test);
      }
    });
  }


  /**
   * Checks that test fields are valide
   *
   * @param {object} test
   * @return {object} promise
   */
  validateTest(test) {
    return new Promise((resolve, reject) => {
      const { t } = this.props;
      const errors = {};
      if (test.testName == null) {
        errors.testName = t('This field is required', {ns: 'battery_manager'});
      }
      if (test.ageMinDays == null) {
        errors.ageMinDays = t('This field is required', {ns: 'battery_manager'});
      } else if (test.ageMinDays < 0) {
        errors.ageMinDays = t('This field must be 0 or greater', {ns: 'battery_manager'});
      }
      if (test.ageMaxDays == null) {
        errors.ageMaxDays = t('This field is required', {ns: 'battery_manager'});
      } else if (test.ageMaxDays < 0) {
        errors.ageMaxDays = t('This field must be 0 or greater', {ns: 'battery_manager'});
      }
      if (Number(test.ageMinDays) > Number(test.ageMaxDays)) {
        errors.ageMinDays = t('Minimum age must be lesser than maximum age.', {ns: 'battery_manager'});
        errors.ageMaxDays = t('Maximum age must be greater than minimum age.', {ns: 'battery_manager'});
      }
      if (test.stage == null) {
        errors.stage = t('This field is required', {ns: 'battery_manager'});
      }

      if (Object.entries(errors).length === 0) {
        this.setState({errors}, () => resolve(test));
      } else {
        this.setState({errors}, reject);
      }
    });
  }
}

BatteryManagerIndex.propTypes = {
  testEndpoint: PropTypes.string.isRequired,
  optionEndpoint: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
  t: PropTypes.func,
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('hi', 'battery_manager', hiStrings);
  const Index = withTranslation(
    ['battery_manager', 'loris']
  )(BatteryManagerIndex);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <Index
      testEndpoint={`${loris.BaseURL}/battery_manager/testendpoint/`}
      optionEndpoint={`${loris.BaseURL}/battery_manager/testoptionsendpoint`}
      hasPermission={loris.userHasPermission}
    />
  );
});

export default BatteryManagerIndex;

