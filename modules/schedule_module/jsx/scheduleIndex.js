import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import Modal from 'Modal';
import swal from 'sweetalert2';

class ScheduleIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      error: false,
      isLoaded: false,
      formData: {
        DCCID: null,
        PSCID: null,
        Session: null,
        AppointmentDate: null,
        AppointmentTime: null,
        AppointmentType: null,
        SessionFieldOptions: null,
      },
      showModal: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.mapColumn = this.mapColumn.bind(this);
    this.renderAddScheduleForm = this.renderAddScheduleForm.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.fetchDataForDccid = this.fetchDataForDccid.bind(this);
  }

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

  fetchDataForDccid(value) {
    return fetch(this.props.dccidCheck+'/'+value, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => {
       console.log(data['pscid']);
      this.setState({formData: {...this.state.formData, PSCID: data['pscid']}});
      })
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
    console.log(formData['DCCID']);
     this.fetchDataForDccid();
// {this.state.formData.PSCID} set pscid baseon dccid
// {this.state.formData.DcCID} set pscid baseon DCCid
// {{this.state.formData.type} set session baseon DCCid and pscid}

    this.setState({
      formData: formData,
    });
  }
  /**
   * Handles the submission of the Add Examiner form
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

    fetch(this.props.submitURL, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      body: formObject,
    })
    .then((resp) => {
      if (resp.ok && resp.status === 200) {
        swal.fire('Success!', 'Examiner added.', 'success').then((result) => {
          if (result.value) {
            this.closeModal();
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
    mapColumn(column, cell) {
      switch (column) {
      case 'Active':
              if (cell === 'Y') {
                  return 'Yes';
              } else if (cell === 'N') {
                  return 'No';
              }
              // This shouldn't happen, it's a non-nullable
              // enum in the backend.
              return '?';
          default: return cell;
      }
  }
  openModal() {
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({
      formData: {},
      showModal: false,
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
    cell = this.mapColumn(column, cell);
    return <td>{cell}</td>;
  }
  renderAddScheduleForm() {
    return (
      <Modal
        title='Add Appointment'
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
            name="DCCID"
            label="DCCID"
            value={this.state.formData.DCCID}
            required={true}
            onUserInput={this.setFormData}
          />
          <TextboxElement
            name="PSCID"
            label="PSCID"
            value={this.state.formData.PSCID}
            required={true}
            onUserInput={this.setFormData}
          />
          <SelectElement
            name="Session"
            options={this.state.data.fieldOptions.session}
            label="Session"
            value={this.state.formData.Session}
            required={true}
            onUserInput={this.setFormData}
          />
          <ButtonElement
            name="fire_away"
            label={
              <div>
                <span className="glyphicon glyphicon-plus"/> Create An Appointment
              </div>
            }
            type="submit"
            buttonClass="btn btn-sm btn-success"
          />
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
    const options = this.state.data.fieldOptions;
    const fields = [
      {label: 'CandID', show: true, filter: {
        name: 'CandID',
        type: 'text',
      }},
      {label: 'PSCID', show: true, filter: {
        name: 'PSCID',
        type: 'text',
      }},
      {label: 'Site', show: true, filter: {
        name: 'Site',
        type: 'select',
        options: options.site,
      }},
      {label: 'Visit Label', show: true, filter: {
        name: 'Visit_label',
        type: 'select',
        options: options.visitLabel,
      }},
      {label: 'Project', show: true, filter: {
        name: 'Project',
        type: 'multiselect',
        options: options.project,
      }},
      {label: 'Subproject', show: true, filter: {
        name: 'Subproject',
        type: 'multiselect',
        options: options.subproject,
      }},
      {label: 'Appointment Type', show: true, filter: {
        name: 'Appointment Type',
        type: 'select',
        options: options.AppointmentTypeName,
      }},
      {label: 'Date', show: true, filter: {
        name: 'Date',
        type: 'date',
      }},
      {label: 'Time', show: true, filter: {
        name: 'Time',
        type: 'time',
      }},
      {label: 'Earliset Date >=', show: false, filter: {
        name: 'earlyDate',
        type: 'date',
        comparison: 'greaterthanorequal',
      }},
      {label: 'Latest Date <=', show: false, filter: {
        name: 'lateDate',
        type: 'date',
        comparison: 'smallerthanorequal',
      }},
    ];
    const actions = [
      {name: 'addExaminer', label: 'Add Examiner', action: this.openModal},
    ];
    return (
    <div>
      {this.renderAddScheduleForm()}
      <FilterableDataTable
        name="schedule_module"
        data={this.state.data.Data}
        fields={fields}
        getFormattedCell={this.formatColumn}
        actions={actions}
      />
    </div>
    );
  }
}

ScheduleIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <ScheduleIndex
      dataURL={`${loris.BaseURL}/schedule_module/?format=json`}
      dccidCheck={`${loris.BaseURL}/schedule_module/appointment`}
      BaseURL={loris.BaseURL}
      submitURL={`${loris.BaseURL}/examiner/`}
      hasEditPermission={loris.userHasPermission('schedule_module')}
    />,
    document.getElementById('lorisworkspace')
  );
});
