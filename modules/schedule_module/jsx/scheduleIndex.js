/* eslint-disable */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import Modal from 'Modal';
import swal from 'sweetalert2';
import {Tabs, TabPane} from 'Tabs';
import FilterableDataTable from 'jsx/FilterableDataTable';
import {
    FormElement,
    SelectElement,
    StaticElement,
    ButtonElement,
    DateElement,
	TimeElement,
	TextboxElement
} from 'jsx/Form';
/**
 * Schedule Module
 *
 * Main module component rendering the data release module
 *
 * @author Shen Wang
 */
class ScheduleIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      error: false,
      isLoaded: false,
      formData: {
        AppointmentID: null,
        StartsAt: null,
        DCCID: null,
        PSCID: null,
        Session: null,
        AppointmentDate: null,
        AppointmentTime: '00:00',
        AppointmentType: {},
        SessionFieldOptions: {},
      },
      filters: {},
      tabledatapast: {},
      tabledatanext: {},
      tabledatatoday: {},
      showModal: false,
      editModal: false,
    };
    this.updateFilter = this.updateFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.mapColumn = this.mapColumn.bind(this);
    this.renderScheduleForm = this.renderScheduleForm.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.fetchDataForm = this.fetchDataForm.bind(this);
    this.edit = this.edit.bind(this);
    this.renderScheduleFormButton = this.renderScheduleFormButton.bind(this);
    this.deleteid = this.deleteid.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrieve data from the provided URL and save it in state
   *
   * @return {object}
   */
    fetchData() {
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
      .then((resp) => {
         if (resp.ok) {
          resp.json().then((data) => {
            this.setState({data});
            const today = data.fieldOptions.today;
            const next = data.fieldOptions.next30days;
            const list = data.Data;
            this.setState({tabledatapast: list.filter((e)=>e[7]<today)});
            this.setState({tabledatanext: list.filter((e)=>{
            return e[7]>today && e[7]<=next;
             })});
            this.setState({tabledatatoday: list.filter((e)=>e[7]==today)});
            this.setState({isLoaded: true});
          });
      }})
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
	window.location.reload();
      });
  }

  fetchDataForm(type, value) {
    return fetch(this.props.formURL+'/'+type+'/'+value, {
      method: 'GET',
      cache: 'no-cache',
      credentials: 'same-origin',
      })
      .then((resp) => resp.json())
      .then((data) => {
       if (type === 'DCCID' ) {
         this.setState({formData: {...this.state.formData, PSCID: data['PSCID']}});
      } 
       if (type === 'PSCID' ) {
         this.setState({formData: {...this.state.formData, DCCID: data['DCCID']}});
      }
         this.setState({formData: {...this.state.formData, SessionFieldOptions: data['Session']}});
      })
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }
  /**
   * Updates filter state
   *
   * @param {object} filter passed from FilterForm
   */
  updateFilter(filter) {
    this.setState({filter});
  }

  /**
   * Sets Filter to empty object
   */
  clearFilter() {
    this.updateFilter({});
    history.replaceState({}, '', '?');
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
    if (formElement === 'DCCID') {
    formData['PSCID'] = null;
    this.fetchDataForm('DCCID', formData['DCCID']);
    }
    if (formElement === 'PSCID') {
    formData['DCCID'] = null;
    this.fetchDataForm('PSCID', formData['PSCID']);
    }
    this.setState({
      formData: formData,
    });
  }
  /**
   * Handles the submission of the Add Schedule form
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
    formObject.append('edit', this.state.editModal);

    fetch(this.props.submitURL, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      body: formObject,
    })
    .then((resp) => {
      if (resp.ok && resp.status === 200) {
        const msg = this.state.editModal ? 'Appointment modified.' : 'Appointment added.';
        swal.fire('Success!', msg, 'success').then((result) => {
          if (result.value) {
            this.fetchData();
            this.closeModal();
          }
        });
      } else {
        resp.json().then((message) => {
          swal.fire('No changes were made!', message.error, 'error');
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
    mapColumn(column, cell) {
          return cell;
  }
  /**
   * Handles the delete a Schedule
   *
   * @param {string} id - appointment id
   */

 deleteConfirm(id) {
   swal.fire({
  title: 'Are you sure?',
  text: 'You won\'t be able to revert this!',
  type: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'No, cancel it!',
}).then((result) => {
  if (result.value) {
    swal.fire(
      'Deleted!',
      'Your appointment has been deleted.',
      'success',
    );
    this.deleteid(id);
   }
   });
   }

 deleteid(id) {
    let deleteurl = loris.BaseURL + '/schedule_module/appointment/' + id;
    fetch(deleteurl, {
      method: 'DELETE',
      cache: 'no-cache',
      credentials: 'same-origin',
    })
    .then((resp) => {
      if (resp.ok) {
	      if (this.state.data.Data.length == 1) {
                 window.location.reload();
	      }
            this.fetchData();
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
   * Handles the edit a Schedule
   *
   * @param {string} row - appointment row
   */
 edit(row) {
   this.openModal();
   this.setState({editModal: true});
   const sessionID = row['Edit'];
   const visit = row['Visit Label'];
   const sessionObj = {[sessionID]: visit};
   const rowObj = {
        AppointmentID: row.Delete,
        StartsAt: row['Starts At'],
        DCCID: row.DCCID,
        PSCID: row.PSCID,
        Session: sessionID,
        AppointmentDate: row.Date,
        AppointmentTime: row.Time,
        AppointmentType: row['Appointment Type'],
        SessionFieldOptions: sessionObj,
   };
   this.setState({formData: rowObj});
 // ready setup edit form
}
  openModal() {
    this.setState({showModal: true});
  }
  closeModal() {
    this.setState({
      formData: {},
      showModal: false,
      editModal: false,
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
    switch (column) {
    case 'PSCID':
      let url = loris.BaseURL + '/' + row['DCCID'] + '/';
      result = <td><a href ={url}>{cell}</a></td>;
      break;
    case 'Visit Label':
      let visit = loris.BaseURL + '/instrument_list/?candID=' + row['DCCID'] + '&sessionID=' + row['Edit'];
      result = <td><a href ={visit}>{cell}</a></td>;
      break;
    case 'Edit':
      result = <td><button className="btn btn-default" onClick={() => this.edit(row)}><span className="glyphicon glyphicon-edit"></span> Edit</button></td>;
      break;
    case 'Delete':
      result = <td><button className="btn btn-default" onClick={() => this.deleteConfirm(row['Delete'])}><span className="glyphicon glyphicon-trash"></span> Delete</button></td>;
      break;
    case 'Data Entry Status':
      let css='label label-default';
      if (cell==='Complete' ) {
        css='label label-success';
       }
      if (cell==='No Data Found' ) {
        css='label label-danger';
       }
      if (cell==='In Progress' || cell==='Not Started') {
        css='label label-warning';
       }
      result = <td><span className={css}>{cell}</span></td>;
      break;
    case 'Appointment Type':
      result = <td>{row['AppointmentTypeName']}</td>;
      break;
    }
    return result;
}
  renderScheduleFormButton() {
   if (this.state.editModal) {
     return (<ButtonElement
            name="edit"
            label="Edit Appointment"
            type="submit"
            buttonClass="btn btn-sm btn-success"
           />
     );
    } else {
        return (<ButtonElement
            name="create"
            label="Create Appointment"
            type="submit"
            buttonClass="btn btn-sm btn-success"
           />
         );
    }
  }
  renderScheduleForm() {
  let year = new Date();
  let minYear = year.getFullYear();
    const title = this.state.editModal ? 'Edit Appointment' : 'Add Appointment';
    return (
      <Modal
        title= {title}
        onClose={this.closeModal}
        show={this.state.showModal}
      >
        <FormElement
          Module="schedule"
          name="addSchedule"
          id="addScheduleForm"
          onSubmit={this.handleSubmit}
          method="POST"
        >
          <TextboxElement
            name="DCCID"
            label="DCCID"
            value={this.state.formData.DCCID}
            required={true}
            onUserInput={this.setFormData}
            disabled={this.state.editModal}
          />
          <TextboxElement
            name="PSCID"
            label="PSCID"
            value={this.state.formData.PSCID}
            required={true}
            onUserInput={this.setFormData}
            disabled={this.state.editModal}
          />
          <SelectElement
            name="Session"
            options={this.state.formData.SessionFieldOptions}
            label="Visit"
            value={this.state.formData.Session}
            required={true}
            onUserInput={this.setFormData}
            disabled={this.state.editModal}
          />
          <DateElement
            name = "AppointmentDate"
            label = "Appointment Date"
            onUserInput = {this.setFormData}
            value = {this.state.formData.AppointmentDate}
            minYear = {minYear}
            required = {true}
          />
          <TimeElement
            name = "AppointmentTime"
            label = "Appointment Time"
            onUserInput = {this.setFormData}
            value = {this.state.formData.AppointmentTime}
            required = {false}
          />
          <SelectElement
            name="AppointmentType"
            label = "Appointment Type"
            options={this.state.data.fieldOptions.AppointmentType}
            value={this.state.formData.AppointmentType}
            required={true}
            onUserInput={this.setFormData}
          />
        {this.renderScheduleFormButton()}
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
      {label: 'DCCID', show: true, filter: {
        name: 'DCCID',
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
        name: 'VisitLabel',
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
        options: options.AppointmentType,
      }},
      {label: 'Date', show: false, filter: {
        name: 'Date',
        type: 'date',
      }},
      {label: 'Time', show: false, filter: {
        name: 'Time',
        type: 'time',
      }},
      {label: 'Starts At', show: true},
      {label: 'Edit', show: true,
       name: 'edit',
      },
      {label: 'Delete', show: true, name: 'delete',
      },
      {label: 'AppointmentTypeName', show: false,
        name: 'AppointmentTypeName',
      },
    ];
    const actions = [
      {name: 'addSchedule', label: 'Add Appointment', action: this.openModal},
    ];
    let tabList = [
      {
        id: 'all',
        label: 'All',
      },
      {
        id: 'past',
        label: 'Past',
      },
      {
        id: 'next',
        label: 'Next 30 Days',
      },
      {
        id: 'today',
        label: 'Today',
      },
    ];

    return (
    <div>
      {this.renderScheduleForm()}
      <div className="panel-body">
      <Tabs tabs={tabList} defaultTab="all">
        <TabPane TabId={tabList[0].id}>
          <FilterableDataTable
            name="schedule_module"
            data={this.state.data.Data}
            fields={fields}
            getFormattedCell={this.formatColumn}
            actions={actions}
            filters={this.state.filters}
          />
        </TabPane>
        <TabPane TabId={tabList[1].id}>
          <FilterableDataTable
            name="schedule_module"
            data={this.state.tabledatapast}
            fields={fields}
            getFormattedCell={this.formatColumn}
            actions={actions}
            filters={this.state.filters}
          />
        </TabPane>
        <TabPane TabId={tabList[2].id}>
          <FilterableDataTable
            name="schedule_module"
            data={this.state.tabledatanext}
            fields={fields}
            getFormattedCell={this.formatColumn}
            actions={actions}
            filters={this.state.filters}
          />
        </TabPane>
        <TabPane TabId={tabList[3].id}>
          <FilterableDataTable
            name="schedule_module"
            data={this.state.tabledatatoday}
            fields={fields}
            getFormattedCell={this.formatColumn}
            actions={actions}
            filters={this.state.filters}
          />
        </TabPane>
      </Tabs>	    
       </div>
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
      formURL={`${loris.BaseURL}/schedule_module/appointment`}
      BaseURL={loris.BaseURL}
      submitURL={`${loris.BaseURL}/schedule_module/appointment`}
      hasEditPermission={loris.userHasPermission('schedule_module')}
    />,
    document.getElementById('lorisworkspace')
  );
});
/* eslint-enable */
