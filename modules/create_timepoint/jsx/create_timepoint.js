import React from 'react';
import Loader from 'Loader';
import PropTypes from 'prop-types';

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
          subproject: {
            control: 'control',
            experiment: 'experiment',
          },
          visit: {},
          psc: {},
        },
        value: {
          subproject: 'control',
          visit: '',
          psc: '',
        },
      },
      storage: {
        visit: {},
      },
      errors: false,
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
    this.populateErrors = this.populateErrors.bind(this);
    this.collectParams = this.collectParams.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
  }
  /**
   * Executes after component mounts.
   */
  componentDidMount() {
    console.log('componentDidMount');
    this.collectParams();
    this.fetchInitializerData();
  }
  /**
   * Retrieve params from the browser URL and save it in state.
   */
  collectParams() {
    const url = new URL(window.location.href);
    this.state.url.params = {
      candID: url.searchParams.get('candID'),
      identifier: url.searchParams.get('identifier'),
    };
    this.state.data.dccid = this.state.url.params.candID;
    this.setState(this.state);
  }
  /**
   * Retrieve data from the provided URL and save it in state.
   */
  fetchInitializerData() {
    const send = {
      command: 'initialize',
      candID: this.state.url.params.candID,
      identifier: this.state.url.params.identifier,
      subprojectID: this.state.form.subproject,
    };
    const url = this.props.DataURL + '/create_timepoint/ajax/timepoint.php';
    $.ajax({
      url: url,
      type: 'POST',
      async: true,
      data: send,
      success: function(data) {
        console.log('ajax - success');
        console.log('data is: ' + JSON.stringify(data));
        // Populate the form errors.
        if (data.errors && data.errors.length > 0) {
          this.setState({errors: data.errors});
        }
        // Populate the select options for subproject.
        if (data.subproject) {
          this.state.form.options.subproject = data.subproject;
          this.state.form.value.subproject = Object.keys(data.subproject)[0];
          this.state.form.display.subproject = true;
          this.setState(this.state);
        }
        // Populate the select options for psc.
        if (data.psc) {
          this.state.form.options.psc = data.psc;
          this.state.form.value.psc = Object.keys(data.psc)[0];
          this.state.form.display.psc = true;
          this.setState(this.state);
        }
        // Populate the select options for visit.
        if (data.visit) {
          // Store the (complete) visit selection information.
          this.state.storage.visit = data.visit;
          // Handle visit selection.
          this.handleVisitLabel();
        }
        // Display form to user.
        this.setState({isLoaded: true});
      }.bind(this),
      error: function(e, error) {
        this.populateErrors({message: 'Server error.'});
        this.setState({isLoaded: true});
      }.bind(this),
    });
  }
  /**
   * Visit Labels refreshes when Subproject changes.
   *
   */
  handleVisitLabel() {
    this.state.form.options.visit = this.state.storage.visit[
      this.state.form.value.subproject
    ];
    this.state.form.value.visit = Object.keys(this.state.storage.visit[
      this.state.form.value.subproject
    ])[0];
    this.state.form.display.visit = true;
    this.setState(this.state);
  }
  /**
   * Set the form data based on state values of child elements/components
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setForm(formElement, value) {
    this.state.form.value[formElement] = value;
    this.setState(this.state);
    if (formElement === 'subproject') {
      this.handleVisitLabel();
    }
  }

  /**
   * Populate the elements of errors to display.
   *
   * @param {object} values - for individual form element.
   */
  populateErrors(values) {
    let errors = [];
    Object.keys(values).forEach(function(key) {
      // console.log(key, values[key]);
      errors.push(
        <div className='col-xs-12 col-sm-12 col-md-12'>
          <label className='error form-group'>
            {values[key]}
          </label>
        </div>
      );
    });
    this.setState({errors: errors});
  }

  /**
   * Handle form submission
   * @param {object} e - Form submission event
   */
  handleSubmit(e) {
    console.log('handleSubmit fired.');
    const send = {
      command: 'create',
      candID: this.state.url.params.candID,
      identifier: this.state.url.params.identifier,
      subproject: this.state.form.value.subproject,
      psc: this.state.form.value.psc,
      visit: this.state.form.value.visit,
    };
    const url = this.props.DataURL + '/create_timepoint/ajax/timepoint.php';
    $.ajax(url, {
      method: 'POST',
      dataType: 'json',
      data: send,
      success: function(data) {
        console.log('ajax - success');
        console.log('data is: ' + JSON.stringify(data));
        if (data.status === 'error') {
          // Populate the form errors.
          if (data.errors) {
            this.populateErrors(data.errors);
          }
        } else {
          this.state.success = true;
          this.setState(this.state);
        }
      }.bind(this),
      error: function(error) {
        this.populateErrors({message: 'Server error.'});
      }.bind(this),
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
    // Include form errors.
    const errors = this.state.errors;
    // Include subproject select.
    const subproject = this.state.form.display.subproject ? (
      <SelectElement
        id={'subproject'}
        name={'subproject'}
        ref={'subproject'}
        label={'Subproject'}
        value={this.state.form.value.subproject}
        options={this.state.form.options.subproject}
        onUserInput={this.setForm}
        emptyOption={false}
        disabled={false}
        required={true}
      />
    ) : '';
    // Include psc select.
    const psc = this.state.form.display.psc ? (
      <SelectElement
        id={'psc'}
        name={'psc'}
        ref={'psc'}
        label={'Site'}
        value={this.state.form.value.psc}
        options={this.state.form.options.psc}
        onUserInput={this.setForm}
        emptyOption={false}
        disabled={false}
        required={true}
      />
    ) : '';
    // Include visit select.
    const visit = this.state.form.display.visit ? (
      <SelectElement
        id={'visit'}
        name={'visit'}
        ref={'visit'}
        label={'Visit label'}
        value={this.state.form.value.visit}
        options={this.state.form.options.visit}
        onUserInput={this.setForm}
        emptyOption={false}
        disabled={false}
        required={true}
      />
    ) : '';

    if (!this.state.success) {
      return (
        <div>
          <div>
            <h3>Create Time Point</h3> <br/>
            {errors}
            <FormElement
              name={'timepointInfo'}
              fileUpload={false}
              ref={'form'}
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
              />
            </FormElement>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div>
            <h3>New time point successfully registered.</h3>
            <a href={'/' + this.state.url.params.candID}>
              Click here to continue.
            </a>
          </div>
        </div>
      );
    }
  }
}
CreateTimepoint.propTypes = {
  Module: PropTypes.string,
  DataURL: PropTypes.string,
};

/**
 * Render create_timepoint on page load.
 */
window.onload = function() {
  const createTimepoint = (
    <CreateTimepoint
      Module='create_timepoint'
      DataURL={loris.BaseURL}
    />
  );

  // Create a wrapper div in which React component will be loaded
  const browserDOM = document.createElement('div');
  browserDOM.id = 'page_create_timepoint';

  // Append wrapper div to page content
  const rootDOM = document.getElementById('lorisworkspace');
  rootDOM.appendChild(browserDOM);

  ReactDOM.render(createTimepoint, document.getElementById('page_create_timepoint'));
};
