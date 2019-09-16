import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'Panel';
import Loader from 'Loader';

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
  constructor(props) {
    super(props);

    this.state = {
      data: {
        pscid: '',
        dccid: '',
        visit: '',
      },
      form: {
        display: {
          subproject: false,
          visit: false,
          psc: false,
        },
        options: {
          subproject: {},
          visit: {},
          psc: {},
          required: {
            subproject: true,
            psc: true,
            visit: true,
          },
        },
        value: {
          subproject: null,
          visit: null,
          psc: null,
        },
      },
      storage: {
        visit: {},
      },
      errors: [],
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
    this.fetchInitializerData();
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
   * Used with sending POST data to the server.
   * @param {object} json - json object converted for POST.
   * @return {string} send in POST to server.
   */
  urlSearchParams(json) {
    return Object.keys(json).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    }).join('&');
  }
  /**
   * Retrieve data from the provided URL and save it in state.
   */
  fetchInitializerData() {
    const state = Object.assign({}, this.state);
    let url = new URL(this.props.dataURL);
    const params = {
      candID: state.url.params.candID,
      identifier: state.url.params.identifier,
    };
    url.search = new URLSearchParams(params).toString();
    fetch(
      url.toString(), {
        method: 'GET',
        mode: 'same-origin',
        credentials: 'include',
        redirect: 'follow',
        headers: {
          'Accept': 'application/json, text/plain, */*',
        },
      }
    ).then((response) => response.json())
      .then(
        (data) => {
          // Populate the form errors.
          if (data.errors) {
            const state = Object.assign({}, this.state);
            state.errors = data.errors;
            this.setState(state);
          }
          // Populate the select options for subproject.
          if (data.hasOwnProperty('subproject')) {
            const state = Object.assign({}, this.state);
            state.form.options.subproject = data.subproject;
            state.form.value.subproject = null;
            state.form.display.subproject = true;
            this.setState(state);
          }
          // Populate the select options for psc.
          if (data.psc) {
            const state = Object.assign({}, this.state);
            state.form.options.psc = data.psc;
            state.form.value.psc = null;
            state.form.display.psc = true;
            this.setState(state);
          }
          // Populate the select options for visit.
          if (data.visit) {
            // Store the (complete) visit selection information.
            const state = Object.assign({}, this.state);
            state.storage.visit = data.visit;
            this.setState(state);
            // Handle visit selection.
            this.handleVisitLabel();
          }
          // Display form to user.
          this.setState({isLoaded: true});
        }).catch((error) => {
          const state = Object.assign({}, this.state);
          state.errors = [{message: error}];
          state.isLoaded = true;
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
    const send = this.urlSearchParams({
      candID: state.url.params.candID,
      identifier: state.url.params.identifier,
      subproject: state.form.value.subproject,
      psc: state.form.value.psc,
      visit: state.form.value.visit,
    });
    fetch(
      this.props.dataURL, {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'include',
        redirect: 'follow',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: send,
      }
    ).then((response) => response.json())
      .then(
        (data) => {
          if (data.status === 'error') {
            if (data.errors) {
              // data for the form errors.
              this.setState({errors: data.errors});
            }
          } else {
            this.setState({success: true});
          }
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
     * Populate the elements of errors to display.
     * @param {array} values (errors) data from server.
     * @return {array} individual errors.
     */
    function renderErrors(values) {
      let errors = [];
      Object.keys(values).forEach(function(key) {
        errors.push(
          <div className='col-xs-12 col-sm-12 col-md-12'>
            <label className='error form-group'>
              {values[key]}
            </label>
          </div>
        );
      });
      return errors;
    }
    // Include form errors.
    const errors = this.state.errors
      ? renderErrors(this.state.errors)
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

    if (!this.state.success) {
      return (
        <div>
          <Panel title='Create Time Point'>
            {errors}
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
              {visit}
              <ButtonElement
                label={'Create Time Point'}
                type={'submit'}
                name={'fire_away'}
              />
            </FormElement>
          </Panel>
        </div>
      );
    } else {
      return (
        <div>
          <h3>New time point successfully registered.</h3>
          <a href={'/' + this.state.url.params.candID}>
            Click here to continue.
          </a>
        </div>
      );
    }
  }
}
CreateTimepoint.propTypes = {
  dataURL: PropTypes.string,
};

/**
 * Render create_timepoint on page load.
 */
window.addEventListener('load', () => {
  ReactDOM.render(
    <CreateTimepoint
      dataURL={`${loris.BaseURL}/create_timepoint/AjaxTimepoint`}
    />,
    document.getElementById('lorisworkspace')
  );
});
