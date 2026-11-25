import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'Panel';
import {
  StaticElement,
  FormElement,
  PasswordElement,
  ButtonElement,
} from 'jsx/Form';
import {withTranslation} from 'react-i18next';


/**
 * Password expired form.
 *
 * @description form for password expired.
 * @author Alizée Wickenheiser
 * @version 1.0.0
 */
class PasswordExpired extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      form: {
        value: {
          username: this.props.data.username,
          password: '',
          confirm: '',
        },
        error: {
          toggle: false,
          message: '',
        },
      },
      success: false,
    };
    this.setForm = this.setForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    if (state.form.error.toggle) {
      state.form.error.message = '';
      state.form.error.toggle = false;
    }
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
    if (state.form.value.confirm !== state.form.value.password) {
      state.form.error.message = this.props.t(
        'New Password mismatch!',
        {ns: 'login'}
      );
      state.form.error.toggle = true;
      this.setState(state);
      return;
    }
    fetch(
      window.location.origin + '/login/Expired', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: 'expired',
          login: true,
          username: state.form.value.username,
          password: state.form.value.password,
          confirm: state.form.value.confirm,
        }),
      })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            // success - refresh page and user is logged in.
            window.location.href = window.location.origin;
          });
        } else {
          response.json().then((data) => {
            if (data.error) {
              // error - message.
              const state = JSON.parse(JSON.stringify(this.state));
              state.form.error.toggle = true;
              state.form.error.message = data.error;
              this.setState(state);
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
    const error = this.state.form.error.toggle ? (
      <StaticElement
        text={this.state.form.error.message}
        class={'col-xs-12 col-sm-12 col-md-12 text-danger'}
      />
    ) : null;
    const success = !this.state.request ? (
      <div>
        <div>
          <p><b>{this.props.t(
            'Password Strength Rules',
            {ns: 'login'}
          )}</b></p>
          <ul>
            <li>{this.props.t(
              'The password must be at least 8 characters long.',
              {ns: 'login'}
            )}</li>
            <li>{this.props.t(
              'The password and the email address must not be the same.',
              {ns: 'login'}
            )}</li>
            <li>{this.props.t(
              'No special characters are required but your password must be ' +
              'sufficiently complex to be accepted.',
              {ns: 'login'}
            )}</li>
          </ul>
          <p><b>{this.props.t(
            'Please choose a unique password.',
            {ns: 'login'}
          )}</b></p>
          <p>{this.props.t(
            'We suggest using a password manager to generate one for you.',
            {ns: 'login'}
          )}</p>
        </div>
        <FormElement
          name={'passwordExpiry'}
          action={''}
          id={'form'}
          fileUpload={false}
          onSubmit={this.handleSubmit}
        >
          <PasswordElement
            name={'password'}
            value={this.state.form.value.password}
            onUserInput={this.setForm}
            class={'col-sm-12'}
            required={true}
            placeholder={this.props.t('New Password', {ns: 'loris'})}
          />
          <PasswordElement
            name={'confirm'}
            value={this.state.form.value.confirm}
            onUserInput={this.setForm}
            class={'col-sm-12'}
            required={true}
            placeholder={this.props.t('Confirm Password', {ns: 'loris'})}
          />
          {error}
          <ButtonElement
            label={this.props.t('Save', {ns: 'loris'})}
            type={'submit'}
            columnSize={'col-sm-12'}
            buttonClass={'btn btn-primary btn-block'}
          />
        </FormElement>
        <a onClick={() => window.location.href = window.location.origin}
          style={{cursor: 'pointer'}}>{this.props.t(
            'Back to login page',
            {ns: 'login'}
          )}</a>
      </div>
    ) : (
      <div className={'success-message'}>
        <h1>{this.props.t('Thank you!', {ns: 'login'})}</h1>
        <p>{this.props.t(
          'Your request for an account has been received successfully.',
          {ns: 'login'}
        )}</p>
        <p>{this.props.t(
          'Please contact your project administrator to activate this account.',
          {ns: 'login'}
        )}</p>
        <a onClick={() => window.location.href = window.location.origin}
          style={{cursor: 'pointer'}}>{this.props.t(
            'Return to Login Page',
            {ns: 'login'}
          )}</a>
      </div>
    );
    return (
      <div className={'container'}>
        <Panel
          title={this.props.t('Update Password', {ns: 'login'})}
          class={'panel-default panel-center'}
          collapsing={false}
        >
          {success}
        </Panel>
      </div>
    );
  }
}

PasswordExpired.propTypes = {
  module: PropTypes.string,
  setMode: PropTypes.func,
  data: PropTypes.object,

  t: PropTypes.func, /* from withTranslation HoC */
};

export default withTranslation(['login', 'loris'])(PasswordExpired);
