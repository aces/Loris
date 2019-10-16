import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'Panel';

/**
 * Password expired form.
 *
 * @description form for password expired.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class PasswordExpired extends Component {
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
    const state = Object.assign({}, this.state);
    state.form.value[formElement] = value;
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
   * Handle form submission
   *
   * @param {object} e - Form submission event
   */
  handleSubmit(e) {
    const state = Object.assign({}, this.state);
    const url = window.location.origin + '/login/AjaxLogin';
    const send = this.urlSearchParams({
      command: 'expired',
      login: true,
      username: state.form.value.username,
      password: state.form.value.password,
      confirm: state.form.value.confirm,
    });
    fetch(
      url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: send,
      }
    ).then((response) => response.json())
      .then((data) => {
        if (data.error) {
          // error - message.
          const state = Object.assign({}, this.state);
          state.form.error.toggle = true;
          state.form.error.message = data.error;
          this.setState(state);
        } else {
          // success - refresh page and user is logged in.
          window.location.href = window.location.origin;
        }
      }).catch((error) => {
      // no error should happen.
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
          <p><b>Password Strength Rules</b></p>
          <ul>
            <li>The password must be at least 8 characters long</li>
            <li>The password must contain at least 1 letter, 1 number and 1 character from !@#$%^*()</li>
            <li>The password and the user name must not be the same</li>
            <li>The password and the email address must not be the same</li>
          </ul>
        </div>
        <FormElement
          name={'form1'}
          action={''}
          id={'form'}
          fileUpload={'false'}
          onSubmit={this.handleSubmit}
        >
          <TextboxElement
            name={'password'}
            value={this.state.form.value.password}
            onUserInput={this.setForm}
            class={'col-sm-12'}
            required={true}
            type={'password'}
            placeholder={'New Password'}
          />
          <TextboxElement
            name={'confirm'}
            value={this.state.form.value.confirm}
            onUserInput={this.setForm}
            class={'col-sm-12'}
            required={true}
            type={'password'}
            placeholder={'Confirm Password'}
          />
          {error}
          <ButtonElement
            label={'Save'}
            type={'submit'}
            columnSize={'col-sm-12'}
            buttonClass={'btn btn-primary btn-block'}
          />
        </FormElement>
        <a onClick={() => window.location.href = window.location.origin}
           style={{cursor: 'pointer'}}>Back to login page</a>
      </div>
    ) : (
      <div className={'success-message'}>
        <h1>Thank you!</h1>
        <p>Your request for an account has been received successfully.</p>
        <p>Please contact your project administrator to activate this account.</p>
        <a onClick={() => window.location.href = window.location.origin}
           style={{cursor: 'pointer'}}>Return to Login Page</a>
      </div>
    );
    return (
      <div className={'container'}>
        <Panel
          title={'Update Password'}
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
};

export default PasswordExpired;
