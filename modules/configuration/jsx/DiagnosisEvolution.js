import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import {TabPane, VerticalTabs} from 'Tabs';
import PropTypes from 'prop-types';
import i18n from 'I18nSetup';
import Loader from 'Loader';
import '../css/configuration.css';
import swal from 'sweetalert2';
import {
  FormElement,
  ButtonElement,
  FieldsetElement,
  TextboxElement,
  SearchableDropdown,
  TagsElement,
  NumericElement,
} from 'jsx/Form';

import frStrings from '../locale/fr/LC_MESSAGES/configuration.json';

/**
 * Candidate diagnosis evolution component
 */
class DiagnosisEvolution extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      formData: {
        new: {
          DxEvolutionID: 'new',
          Name: null,
          ProjectID: null,
          instrumentName: null,
          sourceField: null,
          visitLabel: null,
          pendingSourceField: null,
        },
      },
      errorMessage: {},
      error: false,
      isLoaded: false,
      currentTab: 'new',
    };

    this.fetchData = this.fetchData.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.validate = this.validate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.addSourceField = this.addSourceField.bind(this);
    this.removeSourceField = this.removeSourceField.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Fetch data
   *
   * @return {Promise<void>}
   */
  fetchData() {
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({
        data: data,
        formData: JSON.parse(JSON.stringify({
          ...this.state.formData,
          ...data,
        })),
      }))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * Set form data
   *
   * @param {string} formElement
   * @param {*} value
   */
  setFormData(formElement, value) {
    const tabID = this.state.currentTab;
    let formData = this.state.formData;

    if (tabID == 'new') {
      let tabData = {
        ...formData.new,
        [formElement]: value,
      };
      formData.new = tabData;
    } else {
      let tabData = {
        ...formData.diagnosisTracks[tabID],
        [formElement]: value,
      };
      formData.diagnosisTracks[tabID] = tabData;
    }

    let errorMessage = {};
    errorMessage[tabID] = this.state.errorMessage[tabID] ?
      this.state.errorMessage[tabID] :
      {
        Name: null,
        ProjectID: null,
        visitLabel: null,
        instrumentName: null,
        sourceField: null,
        orderNumber: null,
      };
    if (!!(errorMessage[tabID][formElement])
          && (!!value || value !== '' || !!value.length)
    ) {
      errorMessage[tabID][formElement] = null;
    }

    this.setState({formData, errorMessage});
  }

  /**
   * renders the diagnosis trajectory form
   *
   * @param {number} dxEvolutionID
   * @return {JSX} React markup for the component
   */
  renderDiagnosisForm(dxEvolutionID) {
    const {t} = this.props;
    const id = typeof dxEvolutionID !== 'undefined' ?
      dxEvolutionID : this.state.currentTab;
    const trajectoryData = id == 'new' ?
      this.state.formData.new :
      this.state.formData.diagnosisTracks[id];
    const deleteButton = id !== 'new' ?
      (
        <ButtonElement
          label={t('Delete', {ns: 'configuration'})}
          type='delete'
          onUserInput={this.confirmDelete}
        />
      ) : null;
    const errorMessage = this.state.errorMessage[id] ?
      this.state.errorMessage[id] :
      {
        Name: null,
        ProjectID: null,
        visitLabel: null,
        instrumentName: null,
        sourceField: null,
        orderNumber: null,
      };

    return (
      <TabPane TabId={`${dxEvolutionID}`} key={dxEvolutionID}>
        <div className='row'>
          <h3>{t('Diagnosis Evolution', {ns: 'configuration'})}</h3>
          <br />
          <FormElement
            name='diagnosisEvolution'
            onSubmit={this.handleSubmit}
            ref='form'
          >
            <FieldsetElement
              legend={t('Register Trajectory', {ns: 'configuration'})}
            >
              <TextboxElement
                name='Name'
                label={t('Trajectory Name', {ns: 'configuration'})}
                onUserInput={this.setFormData}
                value={trajectoryData.Name}
                required={true}
                errorMessage={errorMessage.Name}
              />
              <SearchableDropdown
                name='ProjectID'
                label={t('Project', {ns: 'loris', count: 1})}
                options={this.state.formData.projects}
                onUserInput={this.setFormData}
                value={JSON.stringify(trajectoryData.ProjectID)}
                required={true}
                errorMessage={errorMessage.ProjectID}
              />
              <SearchableDropdown
                name='visitLabel'
                label={t('Visit', {ns: 'loris'})}
                options={this.state.formData.visits}
                onUserInput={this.setFormData}
                value={trajectoryData.visitLabel}
                required={true}
                errorMessage={errorMessage.visitLabel}
              />
              <SearchableDropdown
                name='instrumentName'
                label={t('Instrument', {ns: 'loris', count: 1})}
                options={this.state.formData.instruments}
                onUserInput={this.setFormData}
                value={trajectoryData.instrumentName}
                required={true}
                errorMessage={errorMessage.instrumentName}
              />
              <TagsElement
                name='sourceField'
                id={dxEvolutionID}
                label={t('Source Field', {ns: 'configuration'})}
                options={this.state.formData.sourceFields}
                useSearch={true}
                strictSearch={true}
                onUserInput={this.setFormData}
                value={trajectoryData.pendingSourceField ?
                  trajectoryData.pendingSourceField :
                  null}
                items={trajectoryData.sourceField || []}
                required={true}
                btnLabel={t('Add field', {ns: 'configuration'})}
                pendingValKey='pendingSourceField'
                onUserAdd={this.addSourceField}
                onUserRemove={this.removeSourceField}
                errorMessage={errorMessage.sourceField}
              />
              <NumericElement
                name='orderNumber'
                min={1}
                max={100}
                label={t('Order Number', {ns: 'configuration'})}
                onUserInput={this.setFormData}
                value={trajectoryData.orderNumber}
                required={true}
                errorMessage={errorMessage.orderNumber}
              />
              <div className='btn-container'>
                <ButtonElement
                  name='submit'
                  label={t('Save', {ns: 'loris'})}
                  type='submit'
                  onUserInput={this.handleSubmit}
                />
                <ButtonElement
                  label={t('Reset', {ns: 'loris'})}
                  type='reset'
                  onUserInput={this.handleReset}
                />
                {deleteButton}
              </div>
            </FieldsetElement>
          </FormElement>
        </div>
      </TabPane>
    );
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    if (this.state.error) {
      return <h3>{t(
        'An error occurred while loading the page.',
        {ns: 'configuration'}
      )}</h3>;
    }

    if (!this.state.isLoaded) {
      return <Loader />;
    }

    let tabList = [];
    tabList.push({
      id: 'new', label: t(
        'New Diagnosis Trajectory',
        {ns: 'configuration'},
      ),
    });

    let diagnosisTracks = [];
    const trajectories = this.state.data.diagnosisTracks;
    if (trajectories) {
      Object.values(trajectories).map((trajectory) => {
        const dxID = trajectory.DxEvolutionID;
        const dxName = trajectory.Name;
        diagnosisTracks.push(this.renderDiagnosisForm(dxID));
        tabList.push({id: `${dxID}`, label: dxName});
      });
    }

    return (
      <div>
        <p>
          {t(
            'Use this page to manage the configuration of the study\'s'
            + ' diagnosis trajectory.', {ns: 'configuration'})}
        </p>
        <VerticalTabs
          tabs={tabList}
          defaultTab='new'
          updateURL={false}
          onTabChange={(tabId) => this.setState({currentTab: tabId})}
        >
          {this.state.isLoaded && this.renderDiagnosisForm('new')}
          {diagnosisTracks}
        </VerticalTabs>
      </div>
    );
  }

  /**
   * Sets required field errors
   *
   * @param {object} formData - Form data
   * @param {string} tabID - Relevant tab
   * @return {boolean}
   */
  validate(formData, tabID) {
    const {t} = this.props;
    let isValid = true;

    let errorMessage = this.state.errorMessage;
    errorMessage[tabID] = {
      Name: null,
      ProjectID: null,
      visitLabel: null,
      instrumentName: null,
      sourceField: null,
      orderNumber: null,
    };

    if (!formData.Name) {
      errorMessage[tabID]['Name'] = t(
        'This field is required!',
        {ns: 'configuration'}
      );
      isValid = false;
    }
    if (!formData.ProjectID) {
      errorMessage[tabID]['ProjectID'] = t(
        'This field is required!'
        + ' Entry must be included in provided list of options.',
        {ns: 'configuration'}
      );
      isValid = false;
    }
    if (!formData.visitLabel) {
      errorMessage[tabID]['visitLabel'] = t(
        'This field is required!'
        + ' Entry must be included in provided list of options.',
        {ns: 'configuration'}
      );
      isValid = false;
    }
    if (!formData.instrumentName) {
      errorMessage[tabID]['instrumentName'] = t(
        'This field is required!'
        + ' Entry must be included in provided list of options.',
        {ns: 'configuration'}
      );
      isValid = false;
    }
    if (!formData.sourceField || !formData.sourceField.length) {
      errorMessage[tabID]['sourceField'] = t(
        'This field is required! Please click "Add Field" before saving.',
        {ns: 'configuration'}
      );
      isValid = false;
    }
    if (!formData.orderNumber) {
      errorMessage[tabID]['orderNumber'] = t(
        'This field is required!',
        {ns: 'configuration'}
      );
      isValid = false;
    }

    this.setState({errorMessage});
    return isValid;
  }


  /**
   * Handles form submission
   *
   * @param {event} e - Form submission event
   */
  handleSubmit(e) {
    const {t} = this.props;
    e.preventDefault();

    const tabID = this.state.currentTab;
    let formData = tabID == 'new' ?
      this.state.formData.new :
      this.state.formData.diagnosisTracks[tabID];
    let formObject = new FormData();
    for (let key in formData) {
      if (formData[key] !== '') {
        formObject.append(key, formData[key]);
      }
    }
    if (!this.validate(formData, tabID)) {
      return;
    }

    fetch(this.props.submitURL, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      body: formObject,
    }).then((resp) => {
      if (resp.ok) {
        swal.fire({
          title: t('Submission Successful!', {ns: 'loris'}),
          type: 'success',
        });
        window.location.href =
                    `${loris.BaseURL}/configuration/diagnosis_evolution`;
      } else {
        resp.json().then((msg) => {
          let status = resp.status == 409 ?
            'Conflict!' : 'Error!';
          swal.fire({
            title: status,
            text: msg.error,
            type: 'error',
          });
        });
      }
    }).catch((error) => {
      console.warn(error);
    });
  }

  /**
   * Handles form reset
   *
   * @param {event} e - Form submission event
   */
  handleReset(e) {
    e.preventDefault();
    const tabID = this.state.currentTab;
    let formData = this.state.formData;
    if (tabID === 'new') {
      let formDataNew = formData[tabID];
      for (let key in formDataNew) {
        if (key !== 'DxEvolutionID') {
          formDataNew[key] = null;
        }
      }
      formData[tabID] = formDataNew;
    } else {
      formData.diagnosisTracks[tabID]
            = JSON.parse(JSON.stringify(
          this.state.data.diagnosisTracks[tabID]
        ));
    }

    let errorMessage = {};
    errorMessage[tabID] = {
      Name: null,
      ProjectID: null,
      visitLabel: null,
      instrumentName: null,
      sourceField: null,
      orderNumber: null,
    };

    this.setState({formData, errorMessage});
  }

  /**
   * Swal for user to confirm deletion
   *
   * @param {event} e - Form submission event
   */
  confirmDelete(e) {
    const {t} = this.props;
    e.preventDefault();

    swal.fire({
      title: t(
        'Are you sure you want to delete this diagnosis trajectory?',
        {ns: 'configuration'}
      ),
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: t('Delete', {ns: 'configuration'}),
      cancelButtonText: t('Cancel', {ns: 'loris'}),
    }).then((result) => {
      if (result.value) {
        this.handleDelete();
      }
    });
  }

  /**
   * Handles diagnosis delete
   */
  handleDelete() {
    const {t} = this.props;
    const tabID = this.state.currentTab;

    let diagnosisTracks = this.state.formData.diagnosisTracks;
    let ID = diagnosisTracks[tabID]['DxEvolutionID'];

    fetch(this.props.submitURL + '/?ID='+ ID, {
      method: 'DELETE',
      cache: 'no-cache',
      credentials: 'same-origin',
    }).then((resp) => {
      if (resp.ok) {
        swal.fire({
          title: t('Deletion Successful!', {ns: 'configuration'}),
          type: 'success',
        });
        window.location.href =
                    `${loris.BaseURL}/configuration/diagnosis_evolution`;
      } else {
        resp.json().then((msg) => {
          let status = resp.status == 409 ?
            'Conflict!' : 'Error!';
          swal.fire({
            title: status,
            text: msg.error,
            type: 'error',
          });
        });
      }
    }).catch((error) => {
      console.warn(error);
    });
  }

  /**
   * Add source field
   *
   * @param {*} formElement
   * @param {string} value
   * @param {*} pendingValKey
   * @param {*} id
   */
  addSourceField(formElement, value, pendingValKey) {
    const tabID = this.state.currentTab;
    let formData = this.state.formData;

    if (tabID == 'new') {
      let listItems = formData.new[formElement] || [];
      listItems.push(value);
      formData.new[formElement] = listItems;
      formData.new[pendingValKey] = null;
    } else {
      let listItems =
                formData.diagnosisTracks[tabID][formElement] || [];
      listItems.push(value);
      formData.diagnosisTracks[tabID][formElement] = listItems;
      formData.diagnosisTracks[tabID][pendingValKey] = null;
    }

    let errorMessage = {};
    errorMessage[tabID] = this.state.errorMessage[tabID] ?
      this.state.errorMessage[tabID] :
      {
        Name: null,
        ProjectID: null,
        visitLabel: null,
        instrumentName: null,
        sourceField: null,
        orderNumber: null,
      };
    if (!!(errorMessage[tabID][formElement])
          && (!!value || value !== '' || !!value.length)
    ) {
      errorMessage[tabID][formElement] = null;
    }

    this.setState({formData, errorMessage});
  }

  /**
   * Remove source field
   *
   * @param {*} formElement
   * @param {string} value
   * @param {*} pendingValKey
   */
  removeSourceField(formElement, value) {
    const tabID = this.state.currentTab;
    let formData = this.state.formData;

    if (tabID == 'new') {
      let listItems = formData.new[formElement];
      let index = listItems.indexOf(value);
      if (index > -1) {
        listItems.splice(index, 1);
      }
      formData.new[formElement] = listItems;
    } else {
      let listItems =
                formData.diagnosisTracks[tabID][formElement];
      let index = listItems.indexOf(value);
      if (index > -1) {
        listItems.splice(index, 1);
      }
      formData.diagnosisTracks[tabID][formElement] = listItems;
    }
    this.setState({formData: formData});
  }
}

DiagnosisEvolution.propTypes = {
  dataURL: PropTypes.string,
  tabName: PropTypes.string,
  action: PropTypes.string,
  submitURL: PropTypes.string,
  t: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('fr', 'configuration', frStrings);
  const TranslatedDiagnosisEvolution = withTranslation(
    ['configuration', 'loris']
  )(DiagnosisEvolution);
  const root = createRoot(
    document.getElementById('lorisworkspace')
  );
  root.render(
    <TranslatedDiagnosisEvolution
      dataURL={`${loris.BaseURL}/configuration/diagnosis`}
      submitURL={`${loris.BaseURL}/configuration/diagnosis`}
    />
  );
});
