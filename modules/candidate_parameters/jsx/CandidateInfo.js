import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import 'I18nSetup';

import {
  FormElement,
  StaticElement,
  SelectElement,
  DateElement,
  ButtonElement,
  TextareaElement,
} from 'jsx/Form';
import CandidateParametersClient from './CandidateParametersClient';
import lorisFetch from 'jslib/lorisFetch';

/**
 * Candiate info component
 */
class CandidateInfo extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    const {t} = this.props;
    this.state = {
      caveatOptions: {
        true: t('True', {ns: 'loris'}),
        false: t('False', {ns: 'loris'}),
      },
      Data: [],
      formData: {},
      updateResult: null,
      errorMessage: null,
      isLoaded: false,
      loadedData: 0,
    };
    this.client = new CandidateParametersClient();
    this.setFormData = this.setFormData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showAlertMessage = this.showAlertMessage.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    const {t} = this.props;
    this.client.getJSON(this.props.dataURL)
      .then((data) => {
        let formData = {
          flaggedCaveatemptor: data.flagged_caveatemptor,
          flaggedOther: data.flagged_other,
          flaggedReason: data.flagged_reason,
        };

        // Add parameter values to formData
        Object.assign(formData, data.parameter_values);

        this.setState({
          Data: data,
          isLoaded: true,
          formData: formData,
        });
      })
      .catch(() => {
        this.setState({
          error: t('An error occured while loading the page.', {ns: 'loris'}),
        });
      });
  }

  /**
   * Set form data
   *
   * @param {string} formElement
   * @param {*} value
   */
  setFormData(formElement, value) {
    let formData = JSON.parse(JSON.stringify(this.state.formData));
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

  /**
   * On Submit
   *
   * @param {object} e - event object
   */
  onSubmit(e) {
    e.preventDefault();
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
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
    }

    let disabled = true;
    let updateButton = null;
    if (loris.userHasPermission('candidate_parameter_edit')) {
      disabled = false;
      updateButton = <ButtonElement label={t('Update', {ns: 'loris'})}/>;
    }
    let reasonDisabled = true;
    let reasonRequired = false;
    if (this.state.formData.flaggedCaveatemptor === 'true'
      && loris.userHasPermission('candidate_parameter_edit')
    ) {
      reasonDisabled = false;
      reasonRequired = true;
    }

    let reasonKey = null;
    let specifyOther = null;
    let otherDisabled = true;
    let otherRequired = false;
    for (let key in this.state.Data.caveatReasonOptions) {
      if (this.state.Data.caveatReasonOptions.hasOwnProperty(key)) {
        if (this.state.Data.caveatReasonOptions[key] === 'Other') {
          reasonKey = key;
          break;
        }
      }
    }

    if (this.state.formData.flaggedReason === reasonKey
      && loris.userHasPermission('candidate_parameter_edit')
    ) {
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
        label={t('If Other, please specify', {ns: 'candidate_parameters'})}
        name="flaggedOther"
        value={this.state.formData.flaggedOther}
        onUserInput={this.setFormData}
        ref="flaggedOther"
        disabled={otherDisabled}
        required={otherRequired}
      />;
    }
    let extraParameterFields = [];
    let extraParameters = this.state.Data.extra_parameters;
    for (let key2 in extraParameters) {
      if (extraParameters.hasOwnProperty(key2)) {
        let paramTypeID = extraParameters[key2].ParameterTypeID;
        let name = paramTypeID;
        let value = this.state.formData[paramTypeID];

        switch (extraParameters[key2].Type.substring(0, 3)) {
        case 'enu':
          let types = extraParameters[key2].Type.substring(5);
          types = types.slice(0, -1);
          types = types.replace(/'/g, '');
          types = types.split(',');
          let selectOptions = {};
          for (let key3 in types) {
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
        alertMessage = t('Update Successful!', {ns: 'loris'});
      } else if (this.state.updateResult === 'error') {
        let errorMessage = this.state.errorMessage;
        alertClass = 'alert alert-danger text-center';
        alertMessage =
          errorMessage ? errorMessage : t('Failed to update!', {ns: 'loris'});
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
            label={t('PSCID', {ns: 'loris'})}
            text={this.state.Data.pscid}
          />
          <StaticElement
            label={t('DCCID', {ns: 'loris'})}
            text={this.state.Data.candID}
          />
          <SelectElement
            label={
              t('Caveat Emptor Flag for Candidate',
                {ns: 'candidate_parameters'})
            }
            name="flaggedCaveatemptor"
            options={this.state.caveatOptions}
            value={this.state.formData.flaggedCaveatemptor}
            onUserInput={this.setFormData}
            ref="flaggedCaveatemptor"
            disabled={disabled}
            required={true}
          />
          <SelectElement
            label={
              t('Reason for Caveat Emptor Flag',
                {ns: 'candidate_parameters'})
            }
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
    let myFormData = this.state.formData;
    // Set form data and upload the media file
    let self = this;
    let formData = new FormData();
    for (let key in myFormData) {
      if (myFormData.hasOwnProperty(key)) {
        if (myFormData[key] !== '') {
          formData.append(key, myFormData[key]);
        }
      }
    }

    formData.append('tab', this.props.tabName);
    formData.append('candID', this.state.Data.candID);
    lorisFetch(self.props.action, {
      method: 'POST',
      body: formData,
    })
      .then(async (response) => {
        if (!response.ok) {
          let errorMessage = '';
          let text = await response.text();
          if (text) {
            try {
              errorMessage = JSON.parse(text).message || '';
            } catch (err) {
              errorMessage = '';
            }
          }
          let error = new Error('request_failed');
          error.lorisMessage = errorMessage;
          throw error;
        }
        self.setState(
          {
            updateResult: 'success',
          }
        );
        self.showAlertMessage();
      })
      .catch((err) => {
        if (err.lorisMessage !== undefined && err.lorisMessage !== '') {
          self.setState(
            {
              updateResult: 'error',
              errorMessage: err.lorisMessage,
            }
          );
          self.showAlertMessage();
        }
      });
  }

  /**
   * Display a success/error alert message after form submission
   */
  showAlertMessage() {
    let self = this;
    if (this.refs['alert-message'] === null) {
      return;
    }

    let alertMsg = this.refs['alert-message'];
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
  t: PropTypes.string.isRequired,
};
export default withTranslation(
  ['candidate_parameters', 'loris']
)(CandidateInfo);
