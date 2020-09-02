import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'Panel';
import Loader from 'Loader';
import swal from 'sweetalert2';

/**
 * Create Timepoint.
 *
 * @description form for create timepoint.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
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
          subproject: false,
          visit: false,
          psc: false,
          project: false,
          languages: false,
        },
        options: {
          subproject: {},
          visit: {},
          psc: {},
          project: {},
          languages: {},
          required: {
            subproject: true,
            psc: true,
            project: true,
            visit: true,
            languages: true,
          },
        },
        value: {
          subproject: null,
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
    this.collectParams();
    this.fetchInitializerData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrieve params from the browser URL and save it in state.
   */
  collectParams() {
    const url = new URL(window.location.href);
    const state = Object.assign({}, this.state);
    state.url.params = {
      candID: url.searchParams.get('candID'),
      identifier: url.searchParams.get('identifier'),
    };
    state.data.dccid = state.url.params.candID;
    this.setState(state);
  }

  /**
   * Retrieve data from the provided URL and save it in state.
   *
   * @return {object}
   */
  fetchInitializerData() {
    const state = Object.assign({}, this.state);
    return fetch(
      this.props.baseURL +
      '/create_timepoint/Timepoint?candID=' + state.url.params.candID +
      '&identifier=' + state.url.params.identifier,
      {
        credentials: 'same-origin',
      }
    ).then((response) => response.json())
      .then((data) => {
        const state = Object.assign({}, this.state);
        // Populate the form conflicts.
        if (data.conflict) {
          state.messages = data.conflict;
        }
        // Populate the select options for subproject.
        if (data.hasOwnProperty('subproject')) {
          state.form.options.subproject = data.subproject;
          state.form.value.subproject = null;
          state.form.display.subproject = true;
        }
        // Populate the select options for psc.
        if (data.psc) {
          state.form.options.psc = data.psc;
          state.form.value.psc = null;
          state.form.display.psc = true;
        }
        // Populate the select options for project.
        if (data.project) {
          state.form.options.project = data.project;
          state.form.value.project = null;
          state.form.display.project = true;
        }
        // Populate the select options for visit.
        if (data.visit) {
          // Store the (complete) visit selection information.
          state.storage.visit = data.visit;
          // Handle visit selection.
          this.handleVisitLabel();
        }
        // Populate the select options for languages.
        if (data.languages) {
          state.form.options.languages = data.languages;
          state.form.value.languages = null;
          state.form.display.languages = true;
        }
        this.setState(state);
      }).catch((error) => {
        const state = Object.assign({}, this.state);
        state.messages = [{message: error}];
        this.setState(state);
      });
  }

  /**
   * Visit Labels refreshes when Subproject changes.
   */
  handleVisitLabel() {
    const state = Object.assign({}, this.state);
    state.form.options.visit = state.storage.visit[
      state.form.value.subproject
      ];
    if (state.form.value.subproject) {
      state.form.value.visit = Object.keys(state.storage.visit[
        state.form.value.subproject
        ])[0];
    }
    state.form.display.visit = true;
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
    if (formElement === 'subproject') {
      this.handleVisitLabel();
    }
  }

  /**
   * Handle form submission
   * @param {object} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();
    const state = Object.assign({}, this.state);
    const url = `${this.props.baseURL}/create_timepoint/Timepoint`;
    const send = JSON.stringify({
      candID: state.url.params.candID,
      identifier: state.url.params.identifier,
      subproject: state.form.value.subproject,
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
      }).then((response) => {
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
      })
      .catch((error) => {
        console.error('Error! ' + error);
      });
  }

  /**
   * @return {DOMRect}
   */
  render() {
    // Waiting for async data to load.
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    /**
     * Populate the elements of messages to display.
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
    // Include subproject select.
    const subproject = this.state.form.display.subproject ? (
      <SelectElement
        id={'subproject'}
        name={'subproject'}
        label={'Subproject'}
        value={this.state.form.value.subproject}
        options={this.state.form.options.subproject}
        onUserInput={this.setForm}
        emptyOption={true}
        disabled={false}
        required={this.state.form.options.required.subproject}
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
        required={this.state.form.options.required.visit}
      />
    ) : null;
    // Include languages select.
    const languages = this.state.form.display.languages ? (
      <SelectElement
        id={'languageID'}
        name={'languages'}
        label={'Language'}
        value={this.state.form.value.languages}
        options={this.state.form.options.languages}
        onUserInput={this.setForm}
        emptyOption={true}
        disabled={false}
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
          {subproject}
          {psc}
          {project}
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
  dataURL: PropTypes.string.isRequired,
};

/**
 * Render create_timepoint on page load.
 */
window.addEventListener('load', () => {
  ReactDOM.render(
    <CreateTimepoint
      baseURL={loris.BaseURL}
      dataURL={`${loris.BaseURL}/create_timepoint/AjaxTimepoint`}
    />,
    document.getElementById('lorisworkspace')
  );
});
