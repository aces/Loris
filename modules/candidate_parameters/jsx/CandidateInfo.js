import React, {Component} from 'react';
import PropTypes from 'prop-types';

class CandidateInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      caveatOptions: {
        true: 'True',
        false: 'False',
      },
      Data: [],
      formData: {},
      updateResult: null,
      errorMessage: null,
      isLoaded: false,
      loadedData: 0,
    };
    this.setFormData = this.setFormData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showAlertMessage = this.showAlertMessage.bind(this);
  }

  componentDidMount() {
    const that = this;
    $.ajax(
        this.props.dataURL,
        {
          dataType: 'json',
          success: function(data) {
            const formData = {
              flaggedCaveatemptor: data.flagged_caveatemptor,
              flaggedOther: data.flagged_other,
              flaggedReason: data.flagged_reason,
            };

            // Add parameter values to formData
            Object.assign(formData, data.parameter_values);

            that.setState({
              Data: data,
              isLoaded: true,
              formData: formData,
            });
          },
          error: function(data, errorCode, errorMsg) {
            that.setState({
              error: 'An error occurred when loading the form!',
            });
          },
        }
    );
  }

  setFormData(formElement, value) {
    const formData = JSON.parse(JSON.stringify(this.state.formData));
    formData[formElement] = value;

    // Reset 'reason' and 'other' fields
    if (formElement === 'flaggedCaveatemptor' && value === 'false') {
      formData.flaggedReason = '';
      formData.flaggedOther = '';
    }

    // Reset 'other' field
    if (formElement === 'flaggedReason' &&
      this.state.Data.caveatReasonOptions[value] !== 'Other') {
      formData.flaggedOther = '';
    }

    this.setState({
      formData: formData,
    });
  }

  onSubmit(e) {
    e.preventDefault();
  }

  render() {
    if (!this.state.isLoaded) {
      if (this.state.error !== undefined) {
        return (
          <div className="alert alert-danger text-center">
            <strong>
              {this.state.error}
            </strong>
          </div>
        );
      }
    };

    let disabled = true;
    let updateButton = null;
    if (loris.userHasPermission('candidate_parameter_edit')) {
      disabled = false;
      updateButton = <ButtonElement label="Update"/>;
    }
    let reasonDisabled = true;
    let reasonRequired = false;
    if (this.state.formData.flaggedCaveatemptor === 'true') {
      reasonDisabled = false;
      reasonRequired = true;
    }

    let reasonKey = null;
    let specifyOther = null;
    let otherDisabled = true;
    let otherRequired = false;
    for (const key in this.state.Data.caveatReasonOptions) {
      if (this.state.Data.caveatReasonOptions.hasOwnProperty(key)) {
        if (this.state.Data.caveatReasonOptions[key] === 'Other') {
          reasonKey = key;
          break;
        }
      }
    }

    if (this.state.formData.flaggedReason === reasonKey) {
      otherRequired = true;
      otherDisabled = false;
    }

    if (this.state.formData.flaggedCaveatemptor === 'false') {
      reasonDisabled = true;
      reasonRequired = false;
      otherDisabled = true;
      otherRequired = false;
    }

    if (reasonKey !== null) {
      specifyOther = <TextareaElement
        label="If Other, please specify"
        name="flaggedOther"
        value={this.state.formData.flaggedOther}
        onUserInput={this.setFormData}
        ref="flaggedOther"
        disabled={otherDisabled}
        required={otherRequired}
      />;
    }
    const extraParameterFields = [];
    const extraParameters = this.state.Data.extra_parameters;
    for (const key2 in extraParameters) {
      if (extraParameters.hasOwnProperty(key2)) {
        const paramTypeID = extraParameters[key2].ParameterTypeID;
        const name = paramTypeID;
        const value = this.state.formData[paramTypeID];

        switch (extraParameters[key2].Type.substring(0, 3)) {
          case 'enu':
            let types = extraParameters[key2].Type.substring(5);
            types = types.slice(0, -1);
            types = types.replace(/'/g, '');
            types = types.split(',');
            const selectOptions = {};
            for (const key3 in types) {
              if (types.hasOwnProperty(key3)) {
                selectOptions[types[key3]] = types[key3];
              }
            }

            extraParameterFields.push(
                <SelectElement
                  label={extraParameters[key2].Description}
                  name={name}
                  options={selectOptions}
                  value={value}
                  onUserInput={this.setFormData}
                  ref={name}
                  disabled={disabled}
                  key={key2}
                />
            );
            break;
          case 'dat':
            extraParameterFields.push(
                <DateElement
                  label={extraParameters[key2].Description}
                  name={name}
                  value={value}
                  onUserInput={this.setFormData}
                  ref={name}
                  disabled={disabled}
                  key={key2}
                />
            );
            break;
          default:
            extraParameterFields.push(
                <TextareaElement
                  label={extraParameters[key2].Description}
                  name={name}
                  value={value}
                  onUserInput={this.setFormData}
                  ref={name}
                  disabled={disabled}
                  key={key2}
                />
            );
        }
      }
    }

    let alertMessage = '';
    let alertClass = 'alert text-center hide';
    if (this.state.updateResult) {
      if (this.state.updateResult === 'success') {
        alertClass = 'alert alert-success text-center';
        alertMessage = 'Update Successful!';
      } else if (this.state.updateResult === 'error') {
        const errorMessage = this.state.errorMessage;
        alertClass = 'alert alert-danger text-center';
        alertMessage = errorMessage ? errorMessage : 'Failed to update!';
      }
    }

    return (
      <div className="row">
        <div className={alertClass} role="alert" ref="alert-message">
          {alertMessage}
        </div>
        <FormElement
          name="candidateInfo"
          onSubmit={this.handleSubmit}
          ref="form"
          class="col-md-6">
          <StaticElement
            label="PSCID"
            text={this.state.Data.pscid}
          />
          <StaticElement
            label="DCCID"
            text={this.state.Data.candID}
          />
          <SelectElement
            label="Caveat Emptor Flag for Candidate"
            name="flaggedCaveatemptor"
            options={this.state.caveatOptions}
            value={this.state.formData.flaggedCaveatemptor}
            onUserInput={this.setFormData}
            ref="flaggedCaveatemptor"
            disabled={disabled}
            required={true}
          />
          <SelectElement
            label="Reason for Caveat Emptor Flag"
            name="flaggedReason"
            options={this.state.Data.caveatReasonOptions}
            value={this.state.formData.flaggedReason}
            onUserInput={this.setFormData}
            ref="flaggedReason"
            disabled={reasonDisabled}
            required={reasonRequired}
          />
          {specifyOther}
          {extraParameterFields}
          {updateButton}
        </FormElement>
      </div>
    );
  }

  /**
   * Handles form submission
   *
   * @param {event} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();
    const myFormData = this.state.formData;
    // Set form data and upload the media file
    const self = this;
    const formData = new FormData();
    for (const key in myFormData) {
      if (myFormData.hasOwnProperty(key)) {
        if (myFormData[key] !== '') {
          formData.append(key, myFormData[key]);
        }
      }
    }

    formData.append('tab', this.props.tabName);
    formData.append('candID', this.state.Data.candID);
    $.ajax(
        {
          type: 'POST',
          url: self.props.action,
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          success: function(data) {
            self.setState(
                {
                  updateResult: 'success',
                }
            );
            self.showAlertMessage();
          },
          error: function(err) {
            if (err.responseText !== '') {
              const errorMessage = JSON.parse(err.responseText).message;
              self.setState(
                  {
                    updateResult: 'error',
                    errorMessage: errorMessage,
                  }
              );
              self.showAlertMessage();
            }
          },

        }
    );
  }

  /**
   * Display a success/error alert message after form submission
   */
  showAlertMessage() {
    const self = this;
    if (this.refs['alert-message'] === null) {
      return;
    }

    const alertMsg = this.refs['alert-message'];
    $(alertMsg).fadeTo(2000, 500).delay(3000).slideUp(
        500,
        function() {
          self.setState(
              {
                updateResult: null,
              }
          );
        }
    );
  }
}
CandidateInfo.propTypes = {
  dataURL: PropTypes.string,
  tabName: PropTypes.string,
  action: PropTypes.string,
};


export default CandidateInfo;
