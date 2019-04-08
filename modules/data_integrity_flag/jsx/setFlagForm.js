/**
 * Set Flag Form
 *
 * Allows users to update Instrument Status in Data Integrity Flag module
 *
 * @author Alex Ilea
 * @version 1.0.0
 *
 * */
import React, {Component} from 'react';

class SetFlagForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {},
    };

    // Bind component instance to custom methods
    this.setFormData = this.setFormData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Set the form data based on state values of child elements/componenets
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setFormData(formElement, value) {
    const formData = JSON.parse(JSON.stringify(this.state.formData));
    formData[formElement] = value;
    this.setState({formData});
  }

  /**
   * Handles form submission
   * @param {event} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();

    $.ajax({
      type: 'POST',
      url: '/data_integrity_flag/',
      data: JSON.stringify(this.state.formData),
      cache: false,
      contentType: false,
      processData: false,
      success: function(data) {
        swal({
          title: 'Success!',
          type: 'success',
        });
        this.props.updateData();
        this.setState({formData: {}});
      }.bind(this),
      error: function(err) {
        console.error(err);
        swal({
          title: 'Error!',
          type: 'error',
          content: err.statusText,
        });
      },
    });
  }

  render() {
    const {fieldOptions} = this.props;

    return (
      <div className='col-md-8 col-lg-6'>
        <FormElement name='flag_form' onSubmit={this.handleSubmit}>
          <h3 className='text-center'>Update Instrument Status</h3><br />
          <SelectElement
            name='visitLabel'
            label='Visit Label'
            options={fieldOptions.visits}
            onUserInput={this.setFormData}
            value={this.state.formData.visitLabel}
            required={true}
          />
          <SelectElement
            name='instrument'
            label='Instrument'
            options={fieldOptions.instruments}
            onUserInput={this.setFormData}
            value={this.state.formData.instrument}
            required={true}
          />
          <DateElement
            name='date'
            label='Date'
            onUserInput={this.setFormData}
            value={this.state.formData.date}
            required={true}
          />
          <SelectElement
            name='flagStatus'
            label='Flag Status'
            options={fieldOptions.flagStatusList}
            onUserInput={this.setFormData}
            value={this.state.formData.flagStatus}
            required={true}
          />
          <TextareaElement
            name='comment'
            label='Comment'
            onUserInput={this.setFormData}
            value={this.state.formData.comment}/>
          <ButtonElement label='Update'/>
        </FormElement>
      </div>
    );
  }
}

SetFlagForm.propTypes = {};
SetFlagForm.defaultProps = {};

export default SetFlagForm;
