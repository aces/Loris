import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import Modal from 'Modal';
import swal from 'sweetalert2';

import BatteryManagerForm from './batteryManagerForm';

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
      show: {testForm: false, editForm: false},
      error: false,
      isLoaded: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.postData = this.postData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.addTest = this.addTest.bind(this);
    this.setTest = this.setTest.bind(this);
    this.clearTest = this.clearTest.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.activateTest = this.activateTest.bind(this);
    this.deactivateTest = this.deactivateTest.bind(this);
    this.updateTest = this.updateTest.bind(this);
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
   *
   * @return {object} promise
   *
   * XXX: This should eventually be moved to a library function
   */
  fetchData(url, method, state) {
    return new Promise((resolve, reject) => {
      return fetch(url, {credentials: 'same-origin', method: method})
      .then((resp) => resp.json())
      .then((data) => this.setState({[state]: data}, resolve()))
      .catch((error) => {
        this.setState({error: true}, reject());
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
   *
   * @return {object} promise
   *
   * XXX: This should eventually be moved to a library function
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
        const status = response.ok ? 'success' : 'error';
        const message = response.ok ? body.message : body.error;
        swal.fire(message, '', status);
        response.ok ? resolve() : reject();
      })
      .catch(() => reject()));
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
    let result = <td>{cell}</td>;
    const testId = row['ID'];
    switch (column) {
      case 'Instrument':
        result = <td>{this.state.options.instruments[cell]}</td>;
        break;
      case 'Subproject':
        result = <td>{this.state.options.subprojects[cell]}</td>;
        break;
      case 'Site':
        result = <td>{this.state.options.sites[cell]}</td>;
        break;
      case 'Change Status':
        if (row.Active === 'Y') {
          // Pass ID of row to deactivate function
          result = <td><CTA label='Deactivate' onUserInput={() => {
            this.deactivateTest(testId);
          }}/></td>;
        } else if (row.Active === 'N') {
          // Pass ID of row to activate function
          result = <td><CTA label='Activate' onUserInput={() => {
            this.activateTest(testId);
          }}/></td>;
        }
        break;
      case 'Edit Metadata':
        const editButton = <CTA label='Edit' onUserInput={() => {
          this.loadTest(testId);
          this.show('editForm');
        }}/>;
        result = <td>{editButton}</td>;
        break;
    }

    return result;
  }

  /**
   * Show a given form based on the passed 'state'
   *
   * @param {string} item - the item to be shown
   */
  show(item) {
    let show = this.state.show;
    show[item] = true;
    this.setState({show});
  }

  /**
   * Hige a given form based on the passed 'state'
   *
   * @param {string} item - the item to be hidden
   */
  hide(item) {
    let show = this.state.show;
    show[item] = false;
    this.setState({show});
  }

  /**
   * Set the form data based on state values of child elements/components
   *
   * @param {string} name - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setTest(name, value) {
    const test = this.state.test;
    test[name] = value;
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
   * Clear the state of the current test
   */
  clearTest() {
    const test = {};
    this.setState({test});
  }

  /**
   * Close the Form
   */
  closeForm() {
    this.hide('testForm');
    this.hide('editForm');
    this.clearTest();
  }

  /**
   * Display popup so user can confirm activation of row
   * Refresh page if entry in Test Battery is successfully activated
   *
   * @param {int} testId
   *
   * @return {object}
   */
  activateTest(testId) {
    return new Promise((resolve, reject) => {
      const test = this.state.tests.find((test) => test.id === testId);
      test.active = 'Y';
      this.updateTest(test)
      .then(() => resolve())
      .then(() => reject());
    });
  }

  /**
   * Display popup so user can confirm deactivation of row
   * Refresh page if entry in Test Battery is successfully deactivated
   *
   * @param {int} testId
   *
   * @return {object}
   */
  deactivateTest(testId) {
    return new Promise((resolve, reject) => {
      const test = this.state.tests.find((test) => test.id === testId);
      test.active = 'N';
      this.updateTest(test)
      .then(() => resolve())
      .catch(() => reject());
    });
  }

  /**
   * Updates a previously existing Test with an updated Test.
   *
   * @param {object} test
   *
   * @return {object} promise
   */
  updateTest(test) {
    return new Promise((resolve, reject) => {
      this.postData(this.props.testEndpoint+test.id, test, 'PATCH')
      .then(() => {
        const index = this.state.tests
          .findIndex((element) => element.id === test.id);
        const tests = this.state.tests;
        tests[index] = test;
        this.setState({tests}, resolve());
      })
      .catch(() => reject());
    });
  }

  /**
   * save test to database
   *
   * @return {object} promise
   */
  addTest() {
    return new Promise((resolve, reject) => {
      const test = this.state.test;
      this.checkDuplicate(test)
      .then(() => this.postData(this.props.testEndpoint, test, 'POST'))
      .then(() => this.fetchData(this.props.testEndpoint, 'GET', 'tests'))
      .then(() => test.id && this.deactivateTest(test.id))
      .then(() => this.closeForm())
      .then(() => resolve())
      .catch(() => reject());
    });
  }

  /**
   * Checks whether the Test is a duplicate of an existing Test.
   *
   * @param {object} test
   *
   * @return {object} promise
   */
  checkDuplicate(test) {
    return new Promise((resolve, reject) => {
      let duplicate;
      this.state.tests.forEach((testCheck) => {
        if (
          test.testName === testCheck.testName &&
          test.ageMinDays === testCheck.ageMinDays &&
          test.ageMaxDays === testCheck.ageMaxDays &&
          test.stage === testCheck.stage &&
          test.subproject === testCheck.subproject &&
          test.visitLabel === testCheck.visitLabel &&
          test.centerId === testCheck.centerId &&
          test.firstVisit === testCheck.firstVisit &&
          test.instrumentOrder === testCheck.instrumentOrder
        ) {
          duplicate = testCheck;
        }
      });

      if (duplicate) {
        if (duplicate.active === 'N') {
          swal.fire({
            title: 'Test Duplicate',
            text: 'Would you to like activate this test?',
            type: 'warning',
            confirmButtonText: 'Activate',
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
            'Test Duplicate', 'You cannot duplicate an active test', 'error'
          );
        }
        reject();
      } else {
        resolve();
      }
    });
  }

  /**
   * Render Method
   *
   * @return {*}
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

    /**
     * XXX: Currently, the order of these fields MUST match the order of the
     * queried columns in _setupVariables() in batter_manager.class.inc
     */
    const {options, test, tests, show} = this.state;
    const {hasPermission} = this.props;
    const fields = [
      {label: 'ID', show: false},
      {label: 'Instrument', show: true, filter: {
          name: 'testName',
          type: 'select',
          options: options.instruments,
        }},
      {label: 'Minimum Age', show: true, filter: {
          name: 'minimumAge',
          type: 'text',
        }},
      {label: 'Maximum Age', show: true, filter: {
          name: 'maximumAge',
          type: 'text',
        }},
      {label: 'Stage', show: true, filter: {
          name: 'stage',
          type: 'select',
          options: options.stages,
        }},
      {label: 'Subproject', show: true, filter: {
          name: 'subproject',
          type: 'select',
          options: options.subprojects,
        }},
      {label: 'Visit Label', show: true, filter: {
          name: 'visitLabel',
          type: 'select',
          options: options.visits,
        }},
      {label: 'Site', show: true, filter: {
          name: 'site',
          type: 'select',
          options: options.sites,
        }},
      {label: 'First Visit', show: true, filter: {
          name: 'firstVisit',
          type: 'select',
          options: options.firstVisit,
        }},
      {label: 'Instrument Order', show: true, filter: {
          name: 'instrumentOrder',
          type: 'text',
        }},
      {label: 'Active', show: true, filter: {
          name: 'active',
          type: 'select',
          options: options.active,
        }},
      {label: 'Change Status', show: hasPermission('batter_manager_edit')},
      {label: 'Edit Metadata', show: hasPermission('batter_manager_edit')},
    ];

    const testForm = (
      <Modal
        title="Add New Test"
        show={show.testForm || show.editForm}
        onClose={this.closeForm}
        onSubmit={this.addTest}
        throwWarning={Object.keys(test).length !== 0}
      >
        <BatteryManagerForm
          test={test}
          setTest={this.setTest}
          options={options}
          add={show.testForm}
        />
      </Modal>
    );

    const actions = [
      {
        label: 'New Test',
        action: () => this.show('testForm'),
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
        test.subproject,
        test.visitLabel,
        test.centerId,
        test.firstVisit,
        test.instrumentOrder,
        test.active,
      ];
    });

    return (
      <div>
        {testForm}
        <FilterableDataTable
          name="battery_manager"
          data={testsArray}
          fields={fields}
          actions={actions}
          getFormattedCell={this.formatColumn}
        />
      </div>
    );
  }
}

BatteryManagerIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <BatteryManagerIndex
      testEndpoint={`${loris.BaseURL}/battery_manager/testendpoint/`}
      optionEndpoint={`${loris.BaseURL}/battery_manager/testoptionsendpoint`}
      hasPermission={loris.userHasPermission}
    />,
    document.getElementById('lorisworkspace')
  );
});
