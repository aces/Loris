import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'Panel';

/**
 * Request account form.
 *
 * @description form for request account.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class RequestAccount extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      form: {
        value: {
          firstname: '',
          lastname: '',
          email: '',
          site: this.props.data.site
            ? Object.keys(this.props.data.site)['']
            : '',
          project: this.props.data.project
            ? Object.keys(this.props.data.project)['']
            : '',
          examiner: false,
          radiologist: false,
        },
        captcha: this.props.data.captcha
          ? this.props.data.captcha
          : '',
        error: '',
      },
      request: false,
    };
    this.setForm = this.setForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // Use LORIS captcha service if configured.
    if (this.props.data.captcha) {
      this.loadGoogleCaptcha();
    }
  }

  /**
   * Set the form data based on state values of child elements/components
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setForm(formElement, value) {
    const state = JSON.parse(JSON.stringify(this.state));
    state.form.value[formElement] = value;
    this.setState(state);
  }

  /**
   * Handle form submission
   *
   * @param {object} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();

    const state = JSON.parse(JSON.stringify(this.state));
    fetch(
      window.location.origin + '/login/Signup', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: 'request',
          firstname: state.form.value.firstname,
          lastname: state.form.value.lastname,
          email: state.form.value.email,
          site: state.form.value.site,
          project: state.form.value.project,
          examiner: state.form.value.examiner,
          radiologist: state.form.value.radiologist,
        }),
      })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            this.setState({request: true});
          });
        } else {
          response.json().then((data) => {
            if (data.error) {
              console.error(data.error);
              this.setState({request: true});
            }
          });
        }
      })
      .catch((error) => {
        console.error(error);
        this.setState({request: true});
      });
  }

  /**
   * Used for including Google ReCaptcha.
   */
  loadGoogleCaptcha() {
    /**
     * Dynamically load a script if necessary.
     * @param {string} url - script to load.
     */
    function loadScript(url) {
      // Adding the script tag to the head as suggested before
      let head = document.getElementsByTagName('head')[0];
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;

      // Start the loading...
      head.appendChild(script);
    }

    // Include Google ReCaptcha.
    loadScript('https://www.google.com/recaptcha/api.js');
  }

  /**
   * @return {DOMRect}
   */
  render() {
    const captcha = this.state.form.captcha ? (
      <div className='form-group'>
        <div className='g-recaptcha'
             data-sitekey={this.state.form.captcha}/>
        <span id='helpBlock' className='help-block'>
          <b className='text-danger'>Please complete the reCaptcha!</b>
        </span>
      </div>
    ) : null;
    const request = !this.state.request ? (
      <div>
        <FormElement
          name={'requestAccount'}
          action={''}
          id={'form'}
          fileUpload={'false'}
          onSubmit={this.handleSubmit}
        >
          <StaticElement
            text={'Please fill in the form below to request a LORIS account. ' +
            'We will contact you once your account has been approved.'}
            class={'col-sm-12'}
            textClass={'text-center'}
          />
          <TextboxElement
            name={'firstname'}
            value={this.state.form.value.firstname}
            onUserInput={this.setForm}
            class={'col-sm-12'}
            required={true}
            type={'text'}
            placeholder={'First name'}
          />
          <TextboxElement
            name={'lastname'}
            value={this.state.form.value.lastname}
            onUserInput={this.setForm}
            class={'col-sm-12'}
            required={true}
            type={'text'}
            placeholder={'Last name'}
          />
          <TextboxElement
            name={'email'}
            value={this.state.form.value.email}
            onUserInput={this.setForm}
            class={'col-sm-12'}
            required={true}
            type={'text'}
            placeholder={'Email address'}
          />
          <SelectElement
            name={'site'}
            options={this.props.data.site}
            value={this.state.form.value.site}
            onUserInput={this.setForm}
            emptyOption={false}
            required={true}
          />
          <SelectElement
            name={'project'}
            options={this.props.data.project}
            value={this.state.form.value.project}
            onUserInput={this.setForm}
            emptyOption={false}
            required={true}
          />
          <CheckboxElement
            name={'examiner'}
            label={'Examiner role'}
            class={'row form-group'}
            value={this.state.form.value.examiner}
            onUserInput={this.setForm}
          />
          <CheckboxElement
            name={'radiologist'}
            label={'Radiologist'}
            class={'row form-group'}
            value={this.state.form.value.radiologist}
            onUserInput={this.setForm}
            offset={'col-sm-offset-2'}
          />
          {captcha}
          <ButtonElement
            label={'Request Account'}
            type={'submit'}
            columnSize={'col-sm-12'}
            buttonClass={'btn btn-primary btn-block'}
          />
        </FormElement>
        <a onClick={() => this.props.setMode('login')}
           style={{cursor: 'pointer'}}>Back to login page</a>
      </div>
    ) : (
      <div className={'success-message'}>
        <h1>Thank you!</h1>
        <p>Your request for an account has been received successfully.</p>
        <p>Please contact your project administrator to activate
          this account.</p>
        <a onClick={() => window.location.href = window.location.origin}
           style={{cursor: 'pointer'}}>Return to Login Page</a>
      </div>
    );
    return (
      <div className={'container'}>
        <Panel
          title={'Request Account'}
          class={'panel-default panel-center'}
          collapsing={false}
        >
          {request}
        </Panel>
      </div>
    );
  }
}

RequestAccount.propTypes = {
  module: PropTypes.string,
  setMode: PropTypes.func,
  data: PropTypes.object,
};

export default RequestAccount;
