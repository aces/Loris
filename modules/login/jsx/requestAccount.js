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
  constructor(props) {
    super(props);
    this.state = {
      form: {
        value: {
          firstname: '',
          lastname: '',
          email: '',
          site: this.props.data.site
            ? Object.keys(this.props.data.site)[0]
            : '',
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
    console.log(state);
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
  /**
   * @return {DOMRect}
   */
  render() {
    const request = (
      <div>
        <FormElement
          name={'form1'}
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
            class={'col-sm-12'}
            emptyOption={false}
            required={true}
          />
          <CheckboxElement
            name={'examiner'}
            label={'Examiner role'}
            class={'row form-group'}
          />
          <CheckboxElement
            name={'radiologist'}
            label={'Radiologist'}
            class={'row form-group'}
          />
          <ButtonElement
            label={'Request Account'}
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
