import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'Panel';
import {
  FormElement,
  StaticElement,
  TextboxElement,
  ButtonElement,
} from 'jsx/Form';
import {withTranslation} from 'react-i18next';

/**
 * Reset password form.
 *
 * @description form for reset password.
 * @author Alizée Wickenheiser
 * @version 1.0.0
 */
class ResetPassword extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      form: {
        value: {
          username: '',
        },
        error: '',
      },
      reset: false,
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
      window.location.origin + '/login/Reset', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: 'reset',
          username: state.form.value.username,
        }),
      })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            this.setState({reset: true});
          });
        } else {
          response.json().then((data) => {
            if (data.error) {
              this.setState({reset: true});
            }
          });
        }
      })
      .catch((error) => {
        console.error(error);
        this.setState({reset: true});
      });
  }

  /**
   * @return {DOMRect}
   */
  render() {
    const reset = !this.state.reset ? (
      <div>
        <FormElement
          name={'resetPassword'}
          action={''}
          id={'form'}
          fileUpload={false}
          onSubmit={this.handleSubmit}
        >
          <StaticElement
            text={this.props.t('Please enter your username below, '
            + 'and a new password will be sent to you.', {ns: 'login'})}
            class={'col-sm-12'}
            textClass={'text-center'}
          />
          <TextboxElement
            name={'username'}
            value={this.state.form.value.username}
            onUserInput={this.setForm}
	    placeholder={this.props.t('Username', {ns: 'loris'})}
            class={'col-sm-12'}
            required={true}
            type={'text'}
          />
          <ButtonElement
            label={this.props.t('Reset', {ns: 'loris'})}
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
        <p>{this.props.t('Password reset. You should receive an email within a few minutes.', {ns: 'login'})}</p>
        <a onClick={() => window.location.href = window.location.origin}
          style={{cursor: 'pointer'}}>{this.props.t('Return to Login Page', {ns: 'login'})}</a>
      </div>
    );
    return (
      <div className={'container'}>
        <Panel
          title={this.props.t('Reset Password', {ns: 'login'})}
          class={'panel-default panel-center'}
          collapsing={false}
        >
          {reset}
        </Panel>
      </div>
    );
  }
}

ResetPassword.propTypes = {
  module: PropTypes.string,
  setMode: PropTypes.func,
};

export default withTranslation(['login', 'loris'])(ResetPassword);
