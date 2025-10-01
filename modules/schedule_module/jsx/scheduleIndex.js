import React, {Component} from 'react';
import {createRoot} from 'react-dom/client';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import Modal from 'Modal';
import swal from 'sweetalert2';
import {Tabs, TabPane} from 'Tabs';
import FilterableDataTable from 'jsx/FilterableDataTable';
import {
  FormElement,
  SelectElement,
  ButtonElement,
  DateElement,
  TimeElement,
  TextboxElement,
} from 'jsx/Form';

import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import hiStrings from '../locale/hi/LC_MESSAGES/schedule_module.json';

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
        }
      })
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
          this.setState({formData: {...this.state.formData,
            PSCID: data['PSCID']}});
        }
        if (type === 'PSCID' ) {
          this.setState({formData: {...this.state.formData,
            DCCID: data['DCCID']}});
        }
        this.setState({formData: {...this.state.formData,
          SessionFieldOptions: data['Session']}});
      })
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  updateFilter(filter) {
    this.setState({filter});
  }

  clearFilter() {
    this.updateFilter({});
    history.replaceState({}, '', '?');
  }

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

  handleSubmit(e) {
    const {t} = this.props;
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
          const msg = this.state.editModal ? t('Appointment modified.',
            {ns: 'schedule_module'}) : t('Appointment added.',
            {ns: 'schedule_module'});
          swal.fire(t('Success!',
            {ns: 'schedule_module'}), msg, 'success').then((result) => {
            if (result.value) {
              this.fetchData();
              this.closeModal();
            }
          });
        } else {
          resp.json().then((message) => {
            swal.fire(t('No changes were made!',
              {ns: 'schedule_module'}), message.error, 'error');
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

  deleteConfirm(id) {
    const {t} = this.props;
    swal.fire({
      title: t('Are you sure?', {ns: 'schedule_module'}),
      text: t('You won\'t be able to revert this!',
        {ns: 'schedule_module'}),
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: t('Yes, delete it!',
        {ns: 'schedule_module'}),
      cancelButtonText: t('No, cancel it!',
        {ns: 'schedule_module'}),
    }).then((result) => {
      if (result.value) {
        swal.fire(
          t('Deleted!', {ns: 'schedule_module'}),
          t('Your appointment has been deleted.',
            {ns: 'schedule_module'}),
          'success',
        );
        this.deleteid(id);
      }
    });
  }

  deleteid(id) {
    let deleteurl = loris.BaseURL +
        '/schedule_module/appointment/' + id;
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

  formatColumn(column, cell, row) {
    const {t} = this.props;
    let result = <td>{cell}</td>;
    switch (column) {
    case t('PSCID', {ns: 'loris'}):
      let url = loris.BaseURL + '/' + row['DCCID'] + '/';
      result = <td><a href ={url}>{cell}</a></td>;
      break;
    case t('Visit Label', {ns: 'loris'}):
      let visit = loris.BaseURL + '/instrument_list/?candID=' +
                   row['DCCID'] + '&sessionID=' + row['Edit'];
      result = <td><a href ={visit}>{cell}</a></td>;
      break;
    case t('Edit', {ns: 'schedule_module'}):
      result = <td><button className="btn btn-default"
        onClick={() => this.edit(row)}>
        <span className="glyphicon glyphicon-edit"></span>
        {t('Edit', {ns: 'schedule_module'})}</button></td>;
      break;
    case t('Delete', {ns: 'schedule_module'}):
      result = <td><button className="btn btn-default"
        onClick={() => this.deleteConfirm(row['Delete'])}>
        <span className="glyphicon glyphicon-trash"></span>
        {t('Delete', {ns: 'schedule_module'})}</button></td>;
      break;
    case t('Data Entry Status', {ns: 'schedule_module'}):
      let css='label label-default';
      if (cell===t('Complete', {ns: 'schedule_module'})) {
        css='label label-success';
      }
      if (cell===t('No Data Found', {ns: 'schedule_module'})) {
        css='label label-danger';
      }
      if (cell===t('In Progress', {ns: 'schedule_module'}) ||
        cell===t('Not Started', {ns: 'schedule_module'})) {
        css='label label-warning';
      }
      result = <td><span className={css}>{cell}</span></td>;
      break;
    case t('Appointment Type', {ns: 'schedule_module'}):
      result = <td>{row['AppointmentTypeName']}</td>;
      break;
    }
    return result;
  }

  renderScheduleFormButton() {
    const {t} = this.props;
    if (this.state.editModal) {
      return (<ButtonElement
        name="edit"
        label={t('Edit Appointment', {ns: 'schedule_module'})}
        type="submit"
        buttonClass="btn btn-sm btn-success"
      />);
    } else {
      return (<ButtonElement
        name="create"
        label={t('Create Appointment', {ns: 'schedule_module'})}
        type="submit"
        buttonClass="btn btn-sm btn-success"
      />);
    }
  }

  renderScheduleForm() {
    const {t} = this.props;
    let year = new Date();
    let minYear = year.getFullYear();
    const title = this.state.editModal ?
      t('Edit Appointment', {ns: 'schedule_module'}) :
      t('Add Appointment', {ns: 'schedule_module'});
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
            label={t('DCCID', {ns: 'loris'})}
            value={this.state.formData.DCCID}
            required={true}
            onUserInput={this.setFormData}
            disabled={this.state.editModal}
          />
          <TextboxElement
            name="PSCID"
            label={t('PSCID', {ns: 'loris'})}
            value={this.state.formData.PSCID}
            required={true}
            onUserInput={this.setFormData}
            disabled={this.state.editModal}
          />
          <SelectElement
            name="Session"
            options={this.state.formData.SessionFieldOptions}
            label={t('Visit', {ns: 'loris'})}
            value={this.state.formData.Session}
            required={true}
            onUserInput={this.setFormData}
            disabled={this.state.editModal}
          />
          <DateElement
            name = "AppointmentDate"
            label = {t('Appointment Date', {ns: 'schedule_module'})}
            onUserInput = {this.setFormData}
            value = {this.state.formData.AppointmentDate}
            minYear = {minYear}
            required = {true}
          />
          <TimeElement
            name = "AppointmentTime"
            label = {t('Appointment Time', {ns: 'schedule_module'})}
            onUserInput = {this.setFormData}
            value = {this.state.formData.AppointmentTime}
            required = {false}
          />
          <SelectElement
            name="AppointmentType"
            label = {t('Appointment Type', {ns: 'schedule_module'})}
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
    const {t} = this.props;
    if (this.state.error) {
      return <h3>{t('An error occured while loading the page.',
        {ns: 'loris'})}</h3>;
    }

    if (!this.state.isLoaded) {
      return <Loader/>;
    }
    const options = this.state.data.fieldOptions;
    const fields = [
      {label: t('DCCID', {ns: 'loris'}), show: true, filter: {
        name: 'DCCID',
        type: 'text',
      }},
      {label: t('PSCID', {ns: 'loris'}), show: true, filter: {
        name: 'PSCID',
        type: 'text',
      }},
      {label: t('Site', {ns: 'loris'}), show: true, filter: {
        name: 'Site',
        type: 'select',
        options: options.site,
      }},
      {label: t('Visit Label', {ns: 'loris'}), show: true, filter: {
        name: 'VisitLabel',
        type: 'select',
        options: options.visitLabel,
      }},
      {label: t('Project', {ns: 'loris'}), show: true, filter: {
        name: 'Project',
        type: 'multiselect',
        options: options.project,
      }},
      {label: t('Cohort', {ns: 'loris'}), show: true, filter: {
        name: 'Cohort',
        type: 'multiselect',
        options: options.subproject,
      }},
      {label: t('Appointment Type',
        {ns: 'schedule_module'}), show: true, filter: {
        name: 'Appointment Type',
        type: 'select',
        options: options.AppointmentType,
      }},
      {label: t('Date', {ns: 'loris'}), show: false, filter: {
        name: 'Date',
        type: 'date',
      }},
      {label: t('Time', {ns: 'loris'}), show: false, filter: {
        name: 'Time',
        type: 'time',
      }},
      {label: t('Starts At', {ns: 'schedule_module'}), show: true},
      {label: t('Edit',
        {ns: 'schedule_module'}), show: true, name: 'edit'},
      {label: t('Delete',
        {ns: 'schedule_module'}), show: true, name: 'delete'},
      {label: t('AppointmentTypeName',
        {ns: 'schedule_module'}), show: false, name: 'AppointmentTypeName'},
    ];
    const actions = [
      {name: 'addSchedule', label: t('Add Appointment',
        {ns: 'schedule_module'}), action: this.openModal},
    ];
    let tabList = [
      {id: 'all', label: t('All', {ns: 'schedule_module'})},
      {id: 'past', label: t('Past', {ns: 'schedule_module'})},
      {id: 'next', label: t('Next 30 Days', {ns: 'schedule_module'})},
      {id: 'today', label: t('Today', {ns: 'schedule_module'})},
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
  formURL: PropTypes.string.isRequired,
  submitURL: PropTypes.string.isRequired,
  t: PropTypes.func,
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('hi', 'schedule_module', hiStrings);
  const Index = withTranslation(
    ['schedule_module', 'loris']
  )(ScheduleIndex);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <Index
      dataURL={`${loris.BaseURL}/schedule_module/?format=json`}
      formURL={`${loris.BaseURL}/schedule_module/appointment`}
      BaseURL={loris.BaseURL}
      submitURL={`${loris.BaseURL}/schedule_module/appointment`}
      hasEditPermission={loris.userHasPermission('schedule_module')}
    />
  );
});

