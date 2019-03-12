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
    };
    this.setForm = this.setForm.bind(this);
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
   * Handle form submission
   *
   * @param {object} e - Form submission event
   */
  handleSubmit(e) {
    let form = document.getElementById('form');
    form.submit();
  }
  render() {
    const reset = (
      <div>
        <FormElement
          name={'reset'}
          action={''}
          id={'form'}
          fileUpload={'false'}
          onSubmit={this.handleSubmit}
        >
          <StaticElement
            text={'Please enter your username below, and a new password will be sent to you.'}
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
        <a onClick={()=>this.props.setMode('login')}
           style={{cursor: 'pointer'}}>Back to login page</a>
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
