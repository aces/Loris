import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'Panel';

/**
 * Reset password form.
 *
 * @description form for reset password.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class ResetPassword extends Component {
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
    e.preventDefault();

    const state = Object.assign({}, this.state);
    fetch(
      window.location.origin + '/login/Login', {
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
        return response.ok ? {} : response.json();
      })
      .then((data) => {
        this.setState({reset: true});
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
          name={'reset'}
          action={''}
          id={'form'}
          fileUpload={'false'}
          onSubmit={this.handleSubmit}
        >
          <StaticElement
            text={'Please enter your username below, '
            + 'and a new password will be sent to you.'}
            class={'col-sm-12'}
            textClass={'text-center'}
          />
          <TextboxElement
            name={'username'}
            value={this.state.form.value.username}
            onUserInput={this.setForm}
            class={'col-sm-12'}
            required={true}
            type={'text'}
          />
          <ButtonElement
            label={'Reset'}
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
        <p>Password reset. You should receive an email within a few minutes.</p>
        <a onClick={() => window.location.href = window.location.origin}
           style={{cursor: 'pointer'}}>Return to Login Page</a>
      </div>
    );
    return (
      <div className={'container'}>
        <Panel
          title={'Reset Password'}
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

export default ResetPassword;
