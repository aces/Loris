import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'Panel';
import swal from 'sweetalert2';
import {
  FormElement,
  StaticElement,
  SelectElement,
  TextboxElement,
  EmailElement,
  CheckboxElement,
  ButtonElement,
} from 'jsx/Form';
import {PolicyButton} from 'jsx/PolicyButton';
import {withTranslation} from 'react-i18next';

/**
 * Request account form.
 *
 * @description form for request account.
 * @author Alizée Wickenheiser
 * @version 1.0.0
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
          firstname: this.props.defaultFirstName || '',
          lastname: this.props.defaultLastName || '',
          email: this.props.defaultEmail || '',
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
        viewedPolicy: false,
      },
      request: false,
      policy: this.props.data.policy || null,
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
    if (this.props.data.policy && !this.state.form.viewedPolicy) {
      let title = this.props.data.policy.SwalTitle;
      swal.fire({
        title: title + ' not accepted',
        text: 'You must accept the ' + title + ' before requesting an account.',
        icon: 'error',
      });
      e.stopPropagation();
      return;
    }
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
              if (data.error === 'Please provide a valid email address!') {
                swal.fire('Error!', data.error, 'error');
              } else {
                this.setState({request: true});
              }
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
     *
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
    const policy = this.state.policy ? (
      <PolicyButton
        onClickPolicy={this.state.policy}
        popUpPolicy={this.state.policy}
        buttonStyle={{marginTop: '10px'}}
        buttonText={'View ' + this.state.policy.HeaderButtonText}
        anon={true}
        callback={() => {
          this.setState({
            form: {
              ...this.state.form,
              viewedPolicy: true,
            },
          });
        }}
      />
    ) : null;
    const request = !this.state.request ? (
      <div>
        <FormElement
          name={'requestAccount'}
          action={''}
          id={'form'}
          fileUpload={false}
          onSubmit={this.handleSubmit}
        >
          <StaticElement
            text={this.props.t('Please fill in the form below to request a LORIS account. ' +
            'We will contact you once your account has been approved.', {ns: 'login'})}
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
            placeholder={this.props.t('First name', {ns: 'loris'})}
          />
          <TextboxElement
            name={'lastname'}
            value={this.state.form.value.lastname}
            onUserInput={this.setForm}
            class={'col-sm-12'}
            required={true}
            type={'text'}
            placeholder={this.props.t('Last name', {ns: 'loris'})}
          />
          <EmailElement
            name={'email'}
            value={this.state.form.value.email}
            onUserInput={this.setForm}
            class={'col-sm-12'}
            required={true}
            type={'text'}
            placeholder={this.props.t('Email address', {ns: 'loris'})}
          />
          <SelectElement
            name={'site'}
            options={this.props.data.site}
            value={this.state.form.value.site}
            onUserInput={this.setForm}
            emptyOption={false}
            required={true}
            placeholder={this.props.t('Choose your site:', {ns: 'login'})}
          />
          <SelectElement
            name={'project'}
            options={this.props.data.project}
            value={this.state.form.value.project}
            onUserInput={this.setForm}
            emptyOption={false}
            required={true}
            placeholder={this.props.t('Choose your project:', {ns: 'login'})}
          />
          <CheckboxElement
            name={'examiner'}
            label={this.props.t('Examiner role', {ns: 'login'})}
            class={'row form-group'}
            value={this.state.form.value.examiner}
            onUserInput={this.setForm}
          />
          <CheckboxElement
            name={'radiologist'}
            label={this.props.t('Radiologist', {ns: 'login'})}
            class={'row form-group'}
            value={this.state.form.value.radiologist}
            onUserInput={this.setForm}
            offset={'col-sm-offset-2'}
          />
          {policy}
          {captcha}
          <ButtonElement
            label={this.props.t('Request Account', {ns: 'login'})}
            type={'submit'}
            columnSize={'col-sm-12'}
            buttonClass={'btn btn-primary btn-block'}
          />
        </FormElement>
        <a onClick={() => this.props.setMode('login')}
          style={{cursor: 'pointer'}}>{this.props.t('Back to login page', {ns: 'login'})}</a>
      </div>
    ) : (
      <div className={'success-message'}>
        <h1>{this.props.t('Thank you!', {ns: 'login'})}</h1>
        <p>{this.props.t('Your request for an account has been received successfully.', {ns: 'login'})}</p>
        <p>{this.props.t('Please contact your project administrator to activate this account.', {ns: 'login'})}</p>
        <a onClick={() => window.location.href = window.location.origin}
          style={{cursor: 'pointer'}}>{this.props.t('Return to Login Page', {ns: 'login'})}</a>
      </div>
    );
    return (
      <div className={'container'}>
        <Panel
          title={this.props.t('Request Account', {ns: 'login'})}
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

  defaultFirstName: PropTypes.string,
  defaultLastName: PropTypes.string,
  defaultEmail: PropTypes.string,
};

export default withTranslation(['login', 'loris'])(RequestAccount);
