import {createRoot} from 'react-dom/client';
import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'Panel';
import Loader from 'Loader';
import swal from 'sweetalert2';
import {
  FormElement,
  SelectElement,
  StaticElement,
  ButtonElement,
} from 'jsx/Form';

/**
 * Create Timepoint.
 *
 * @description form for create timepoint.
 * @author Alizée Wickenheiser
 * @version 1.0.0
 */
class CreateTimepoint extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      data: {
        pscid: '',
        dccid: '',
        visit: '',
        languages: '',
      },
      form: {
        display: {
          cohort: false,
          visit: false,
          psc: false,
          project: false,
          languages: false,
        },
        options: {
          cohort: {},
          visit: {},
          psc: {},
          project: {},
          languages: {},
          required: {
            cohort: true,
            psc: true,
            project: true,
            visit: true,
            languages: true,
          },
        },
        value: {
          cohort: null,
          visit: null,
          psc: null,
          project: null,
          languages: null,
        },
      },
      storage: {
        visit: {},
      },
      messages: [],
      url: {
        params: {
          candID: '',
          identifier: '',
        },
      },
      success: false,
    };

    // Bind component instance to custom methods
    this.fetchInitializerData = this.fetchInitializerData.bind(this);
    this.handleVisitLabel = this.handleVisitLabel.bind(this);
    this.collectParams = this.collectParams.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
  }

  /**
   * Executes after component mounts.
   */
  componentDidMount() {
    this.collectParams().then(() => {
      this.fetchInitializerData().then(() => {
        this.setState({isLoaded: true});
      });
    });
  }

  /**
   * Retrieve params from the browser URL and save it in state.
   */
  async collectParams() {
    const url = new URL(window.location.href);
    const state = JSON.parse(JSON.stringify(this.state));
    state.url.params = {
      candID: url.searchParams.get('candID'),
      identifier: url.searchParams.get('identifier'),
    };
    state.data.dccid = state.url.params.candID;
    await new Promise((resolve) => this.setState(state, resolve));
  }

  /**
   * Retrieve data from the provided URL and save it in state.
   *
   * @return {object}
   */
  fetchInitializerData() {
    const state = JSON.parse(JSON.stringify(this.state));
    return fetch(
      this.props.baseURL +
      '/create_timepoint/Timepoint?candID=' + state.url.params.candID +
      '&identifier=' + state.url.params.identifier,
      {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          const state = Object.assign({}, this.state);
          // Populate the select options for psc.
          if (data.psc) {
            state.form.options.psc = data.psc;
            state.form.display.psc = true;
            if (data.defaultpsc) {
              state.form.value.psc = data.defaultpsc;
            }
          }
          // Populate the select options for project.
          if (data.project) {
            state.form.options.project = data.project;
            state.form.display.project = true;
          }
          // Populate the select options for cohort.
          if (data.hasOwnProperty('cohortGroups')) {
            // Store the (complete) visit selection information.
            state.storage.cohort = data.cohortGroups;
            // Handle cohort selection.
            this.handleCohort();
          }
          // Populate the select options for visit.
          if (data.hasOwnProperty('visitGroups')) {
            // Store the (complete) visit selection information.
            state.storage.visit = data.visitGroups;
            // Handle visit selection.
            this.handleVisitLabel();
          }
          // Populate the select options for languages.
          if (data.languages) {
            state.form.options.languages = data.languages;
            state.form.display.languages = true;
          }
          this.setState(state);
        });
      } else {
        response.json().then((data) => {
          if (data.error) {
            // display conflicts on form.
            this.setState({messages: [data.error]});
          }
        });
        console.error(response.statusText);
      }
    }).catch((error) => {
      const state = Object.assign({}, this.state);
      state.messages = [{message: error}];
      this.setState(state);
    });
  }

  /**
   * Cohort refreshes when Project changes.
   */
  handleCohort() {
    const state = Object.assign({}, this.state);
    if (Array.isArray(state.storage.cohort[state.form.value.project])) {
      // Display error message to user.
      const errorMessage = `No cohorts defined for project: ${
        this.state.form.options.project[
          this.state.form.value.project
        ]}`;
      state.messages = [errorMessage];
      swal.fire(errorMessage, '', 'error');
      state.form.options.cohort = {};
      state.form.options.visit = {};
    } else {
      state.form.options.cohort = state.storage.cohort[
        state.form.value.project
      ];
      state.form.value.cohort = null;
      state.form.value.visit = null;
      // Remove existing error messages.
      state.messages = [];
    }
    state.form.display.cohort = true;
    if (Array.isArray(state.storage.cohort)
      && !state.storage.cohort.length
    ) {
      state.form.display.cohort = false;
    }
    this.setState(state);
  }

  /**
   * Visit Labels refreshes when Cohort changes.
   */
  handleVisitLabel() {
    const state = Object.assign({}, this.state);
    if (state.storage.visit[
      state.form.value.project
    ] !== undefined) {
      if (Array.isArray(state.storage.visit[
        state.form.value.project][state.form.value.cohort])
      ) {
        const errorMessage = `No visit labels defined for
        combination of project: ${
  this.state.form.options.project[
    this.state.form.value.project
  ]
} and cohort: ${
  this.state.form.options.cohort[
    this.state.form.value.cohort
  ]}`;
        state.messages = [errorMessage];
        swal.fire(errorMessage, '', 'error');
        state.form.options.visit = {};
      } else {
        state.form.options.visit = state.storage.visit[
          state.form.value.project
        ][state.form.value.cohort];
        state.form.value.visit = null;
      }
    }
    state.form.display.visit = true;
    if (Array.isArray(state.storage.visit) && !state.storage.visit.length) {
      state.form.display.visit = false;
    }
    this.setState(state);
  }

  /**
   * Set the form data based on state values of child elements/components
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setForm(formElement, value) {
    const state = Object.assign({}, this.state);
    state.form.value[formElement] = value;
    this.setState(state);
    if (formElement === 'project') {
      this.handleCohort();
    } else if (formElement === 'cohort') {
      this.handleVisitLabel();
    }
  }

  /**
   * Handle form submission
   *
   * @param {object} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();
    const state = Object.assign({}, this.state);
    const url = `${this.props.baseURL}/create_timepoint/Timepoint`;
    const send = JSON.stringify({
      candID: state.url.params.candID,
      identifier: state.url.params.identifier,
      cohort: state.form.value.cohort,
      psc: state.form.value.psc,
      project: state.form.value.project,
      visit: state.form.value.visit,
      languages: state.form.value.languages,
    });
    fetch(
      url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: send,
      }
    ).then((response) => {
      if (response.ok) {
        swal.fire('Success!', 'Time Point created.', 'success')
          .then(() => {
            window.location.replace(
              `${this.props.baseURL}/${this.state.url.params.candID}`
            );
          });
      } else {
        response.json().then((data) => {
          if (data.error) {
            // display conflicts on form.
            this.setState({messages: JSON.parse(data.error)});
          }
        });
      }
    }).catch((error) => {
      console.error('Error! ' + error);
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React create timepoint component
   */
  render() {
    // Waiting for async data to load.
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    /**
     * Populate the elements of messages to display.
     *
     * @param {array} values (messages) data from server.
     * @return {array} individual messages.
     */
    const renderErrors = (values) => {
      let messages = [];
      Object.keys(values).forEach(function(key) {
        messages.push(
          <div key={key} className='col-xs-12 col-sm-12 col-md-12'>
            <label className='error form-group'>
              {values[key]}
            </label>
          </div>
        );
      });
      return messages;
    };

    // Include form messages.
    const messages = this.state.messages
      ? renderErrors(this.state.messages)
      : null;
    // Include cohort select.
    const cohort = this.state.form.display.cohort ? (
      <SelectElement
        id={'cohort'}
        name={'cohort'}
        label={'Cohort'}
        value={this.state.form.value.cohort}
        options={this.state.form.options.cohort}
        onUserInput={this.setForm}
        emptyOption={true}
        disabled={false}
        autoSelect={true}
        required={this.state.form.options.required.cohort}
      />
    ) : null;
    // Include psc select.
    const psc = this.state.form.display.psc ? (
      <SelectElement
        id={'psc'}
        name={'psc'}
        label={'Site'}
        value={this.state.form.value.psc}
        options={this.state.form.options.psc}
        onUserInput={this.setForm}
        emptyOption={true}
        disabled={false}
        autoSelect={true}
        required={this.state.form.options.required.psc}
      />
    ) : null;
    // Include project select.
    const project = this.state.form.display.project ? (
      <SelectElement
        id={'project'}
        name={'project'}
        label={'Project'}
        value={this.state.form.value.project}
        options={this.state.form.options.project}
        onUserInput={this.setForm}
        emptyOption={true}
        disabled={false}
        autoSelect={true}
        required={this.state.form.options.required.project}
      />
    ) : null;
    // Include visit select.
    const visit = this.state.form.display.visit ? (
      <SelectElement
        id={'visit'}
        name={'visit'}
        label={'Visit label'}
        value={this.state.form.value.visit}
        options={this.state.form.options.visit}
        onUserInput={this.setForm}
        emptyOption={true}
        disabled={false}
        autoSelect={true}
        required={this.state.form.options.required.visit}
      />
    ) : null;
    // Include languages select.
    const emptyLangOption =
      Object.keys(this.state.form.options.languages).length > 1;
    const languages = this.state.form.display.languages ? (
      <SelectElement
        id={'languageID'}
        name={'languages'}
        label={'Language'}
        value={this.state.form.value.languages}
        options={this.state.form.options.languages}
        onUserInput={this.setForm}
        emptyOption={emptyLangOption}
        disabled={false}
        autoSelect={true}
        required={this.state.form.options.required.languages}
      />
    ) : null;

    return (
      <Panel title='Create Time Point'>
        {messages}
        <FormElement
          name={'timepointInfo'}
          class={'form-group col-sm-12'}
          onSubmit={this.handleSubmit}
        >
          <StaticElement
            label={'DCCID'}
            text={this.state.data.dccid}
          />
          {psc}
          {project}
          {cohort}
          {visit}
          {languages}
          <ButtonElement
            label={'Create Time Point'}
            type={'submit'}
            name={'fire_away'}
          />
        </FormElement>
      </Panel>
    );
  }
}
CreateTimepoint.propTypes = {
  baseURL: PropTypes.string.isRequired,
};

/**
 * Render create_timepoint on page load.
 */
window.addEventListener('load', () => {
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <CreateTimepoint
      baseURL={loris.BaseURL}
    />
  );
});
