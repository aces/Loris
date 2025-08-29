import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import Modal from 'Modal';
import swal from 'sweetalert2';
import {CTA} from 'jsx/Form';

import BatteryManagerForm from './batteryManagerForm';

class BatteryManagerIndex extends Component {
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

  componentDidMount() {
    this.fetchData(this.props.testEndpoint, 'GET', 'tests')
      .then(() => this.fetchData(this.props.optionEndpoint, 'GET', 'options'))
      .then(() => this.setState({isLoaded: true}));
  }

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
              swal.fire('Submission successful!', body.message, 'success')
                .then((result) => {
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

  mapColumn(column, value) {
    switch (column) {
    case 'First Visit':
      return value === 'Y' ? 'Yes' : value === 'N' ? 'No' : value;
    case 'Active':
      return value === 'Y' ? 'Yes' : value === 'N' ? 'No' : value;
    case 'Change Status':
    case 'Edit Metadata':
      return '';
    default:
      return value;
    }
  }

  formatColumn(column, cell, row) {
    cell = this.mapColumn(column, cell);
    let result = <td>{cell}</td>;
    const testId = row['ID'];
    switch (column) {
    case 'Instrument':
      result = <td>{this.state.options.instruments[cell]}</td>;
      break;
    case 'Cohort':
      result = <td>{this.state.options.cohorts[cell]}</td>;
      break;
    case 'Site':
      result = <td>{this.state.options.sites[cell]}</td>;
      break;
    case 'Change Status':
      if (row.Active === 'Y') {
        result = <td><CTA label='Deactivate' onUserInput={() => {
          this.deactivateTest(testId);
        }}/></td>;
      } else if (row.Active === 'N') {
        result = <td><CTA label='Activate' onUserInput={() => {
          this.activateTest(testId);
        }}/></td>;
      }
      break;
    case 'Edit Metadata':
      const editButton = <CTA label='Edit' onUserInput={() => {
        this.loadTest(testId);
        this.setState({edit: true});
      }}/>;
      result = <td>{editButton}</td>;
      break;
    }

    return result;
  }

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

  loadTest(testId) {
    const test = JSON.parse(JSON.stringify(this.state.tests
      .find((test) => test.id === testId)));
    this.setState({test});
  }

  closeForm() {
    this.setState({add: false, edit: false, test: {}, errors: {}});
  }

  activateTest(id) {
    const test = this.state.tests.find((test) => test.id === id);
    test.active = 'Y';
    this.saveTest(test, 'PUT');
  }

  deactivateTest(id) {
    const test = this.state.tests.find((test) => test.id === id);
    test.active = 'N';
    this.saveTest(test, 'PUT');
  }

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

      if (duplicate && duplicate.id !== test.id) {
        if (duplicate.active === 'N') {
          const edit = test.id ? 'This will deactivate the current test.' : '';
          swal.fire({
            title: 'Test Duplicate',
            text: 'The information provided corresponds with a deactivated '+
            'test that already exists in the system. Would you to like '+
            'activate that test? '+edit,
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
        resolve(test);
      }
    });
  }

  validateTest(test) {
    return new Promise((resolve, reject) => {
      const errors = {};
      if (test.testName == null) {
        errors.testName = 'This field is required';
      }
      if (test.ageMinDays == null) {
        errors.ageMinDays = 'This field is required';
      } else if (test.ageMinDays < 0) {
        errors.ageMinDays = 'This field must be 0 or greater';
      }
      if (test.ageMaxDays == null) {
        errors.ageMaxDays = 'This field is required';
      } else if (test.ageMaxDays < 0) {
        errors.ageMaxDays = 'This field must be 0 or greater';
      }
      if (Number(test.ageMinDays) > Number(test.ageMaxDays)) {
        errors.ageMinDays = 'Minimum age must be lesser than maximum age.';
        errors.ageMaxDays = 'Maximum age must be greater than minimum age.';
      }
      if (test.stage == null) {
        errors.stage = 'This field is required';
      }

      if (Object.entries(errors).length === 0) {
        this.setState({errors}, () => resolve(test));
      } else {
        this.setState({errors}, () => reject(errors));
      }
    });
  }

  render() {
    if (this.state.error) {
      return <h3>An error occured while loading the page.</h3>;
    }
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    const {options, test, tests, errors, add, edit} = this.state;
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
        type: 'numeric',
      }},
      {label: 'Maximum Age', show: true, filter: {
        name: 'maximumAge',
        type: 'numeric',
      }},
      {label: 'Stage', show: true, filter: {
        name: 'stage',
        type: 'select',
        options: options.stages,
      }},
      {label: 'Cohort', show: true, filter: {
        name: 'cohort',
        type: 'select',
        options: options.cohorts,
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
      {label: 'Double Data Entry Enabled', show: true, filter: {
        name: 'DoubleDataEntryEnabled',
        type: 'select',
        options: options.DoubleDataEntryEnabled,
      }},
      {label: 'Active', show: true, filter: {
        name: 'active',
        type: 'select',
        options: options.active,
      }},
      {label: 'Change Status', show: hasPermission('battery_manager_edit')},
      {label: 'Edit Metadata', show: hasPermission('battery_manager_edit')},
    ];

    const actions = [
      {
        label: 'New Test',
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

    const modalTitle = edit ? 'Edit Test' : 'Add New Test';
    const request = edit ? 'PUT' : 'POST';
    const handleSubmit = () => this.saveTest(test, request);

    return (
      <div>
        <FilterableDataTable
          name="battery_manager"
          data={testsArray}
          fields={fields}
          actions={actions}
          getFormattedCell={this.formatColumn}
          getMappedCell={this.mapColumn}
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
}

BatteryManagerIndex.propTypes = {
  testEndpoint: PropTypes.string.isRequired,
  optionEndpoint: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <BatteryManagerIndex
      testEndpoint={`${loris.BaseURL}/battery_manager/testendpoint/`}
      optionEndpoint={`${loris.BaseURL}/battery_manager/testoptionsendpoint`}
      hasPermission={loris.userHasPermission}
    />
  );
});

export default BatteryManagerIndex;

