import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import 'I18nSetup';

import {
  FormElement,
  StaticElement,
  SelectElement,
  TextareaElement,
  ButtonElement,
} from 'jsx/Form';
import lorisFetch from 'jslib/lorisFetch';

/**
 * Participant status component
 */
class ParticipantStatus extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      Data: [],
      formData: {},
      updateResult: null,
      errorMessage: null,
      isLoaded: false,
      loadedData: 0,
    };
    this.fetchData = this.fetchData.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showAlertMessage = this.showAlertMessage.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData();
  }

  /**
   * Fetch data
   */
  fetchData() {
    const {t} = this.props;
    lorisFetch(this.props.dataURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('request_failed');
        }
        return response.json();
      })
      .then((data) => {
        let formData = {};
        formData.participantStatus = data.participantStatus;
        formData.participantSuboptions = data.participantSuboptions;
        formData.reasonSpecify = data.reasonSpecify;

        this.setState(
          {
            Data: data,
            formData: formData,
            isLoaded: true,
          }
        );
      })
      .catch(() => {
        this.setState(
          {
            error: t('An error occured while loading the page.',
              {ns: 'loris'}
            ),
          }
        );
      });
  }

  /**
   * Set form data
   *
   * @param {string} formElement
   * @param {*} value
   */
  setFormData(formElement, value) {
    let formData = this.state.formData;
    formData[formElement] = value;
    this.setState(
      {
        formData: formData,
      }
    );
  }

  /**
   * On submit
   *
   * @param {object} e - Event object
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
            <strong>{this.state.error}</strong>
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

    let required = this.state.Data.required;
    let subOptions = {};
    let suboptionsRequired = false;
    let participantStatus = (
      this.state.formData.participantStatus ?
        this.state.formData.participantStatus :
        this.state.Data.participantStatus
    );
    if (participantStatus && required.includes(Number(participantStatus))) {
      subOptions = this.state.Data.parentIDs[participantStatus];
      suboptionsRequired = true;
    }

    let statusOpts = this.state.Data.statusOptions;
    let commentsRequired = statusOpts &&
          statusOpts[participantStatus] !== 'Active' &&
          statusOpts[participantStatus] !== 'Complete';

    let formattedHistory = [];
    for (let statusKey in this.state.Data.history) {
      if (this.state.Data.history.hasOwnProperty(statusKey)) {
        let line = '';
        for (let field in this.state.Data.history[statusKey]) {
          if (this.state.Data.history[statusKey]
            .hasOwnProperty(field)
          ) {
            let current = this.state.Data.history[statusKey][field];
            if (current !== null) {
              switch (field) {
              case 'data_entry_date':
                line += '[';
                line += current;
                line += '] ';
                break;
              case 'entry_staff':
                line += current;
                line += ' ';
                break;
              case 'status':
                line += t(' Status: ', {ns: 'candidate_parameters'});
                line += current;
                line += ' ';
                break;
              case 'suboption':
                line += t('Details: ', {ns: 'candidate_parameters'});
                line += current;
                line += ' ';
                break;
              case 'reason_specify':
                line += t('Comments: ', {ns: 'candidate_parameters'});
                line += current;
                line += ' ';
                break;
              default:
              }
            }
          }
        }
        formattedHistory.push(<p key={statusKey}>{line}</p>);
      }
    }

    let alertMessage = '';
    let alertClass = 'alert text-center hide';
    if (this.state.updateResult) {
      if (this.state.updateResult === 'success') {
        alertClass = 'alert alert-success text-center';
        alertMessage = t('Update Successful!', {ns: 'candidate_parameters'});
      } else if (this.state.updateResult === 'error') {
        let errorMessage = this.state.errorMessage;
        alertClass = 'alert alert-danger text-center';
        alertMessage = errorMessage ?
          errorMessage :
          t('Failed to update!', {ns: 'candidate_parameters'});
      }
    }

    return (
      <div className="row">
        <div className={alertClass} role="alert" ref="alert-message">
          {alertMessage}
        </div>
        <FormElement
          name="participantStatus"
          onSubmit={this.handleSubmit}
          ref="form"
          class="col-md-6"
        >
          <StaticElement
            label={t('PSCID', {ns: 'loris'})}
            text={this.state.Data.pscid}
          />
          <StaticElement
            label={t('DCCID', {ns: 'loris'})}
            text={this.state.Data.candID}
          />
          <SelectElement
            label={t('Participant Status', {ns: 'candidate_parameters'})}
            name="participantStatus"
            options={this.state.Data.statusOptions}
            value={this.state.formData.participantStatus}
            onUserInput={this.setFormData}
            ref="participantStatus"
            disabled={disabled}
            required={true}
          />
          <SelectElement
            label={t('Specify Reason', {ns: 'candidate_parameters'})}
            name="participantSuboptions"
            options={subOptions}
            value={this.state.formData.participantSuboptions}
            onUserInput={this.setFormData}
            ref="participantSuboptions"
            disabled={!suboptionsRequired}
            required={suboptionsRequired}
          />
          <TextareaElement
            label={t('Comments', {ns: 'candidate_parameters'})}
            name="reasonSpecify"
            value={this.state.formData.reasonSpecify}
            onUserInput={this.setFormData}
            ref="reasonSpecify"
            disabled={disabled}
            required={commentsRequired}
          />
          {updateButton}
          {formattedHistory}
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
    let self = this;
    let formData = new FormData();
    for (let key in myFormData) {
      if (myFormData.hasOwnProperty(key) &&
        myFormData[key] !== '' &&
        myFormData[key] !== null &&
        myFormData[key] !== undefined
      ) {
        formData.append(key, myFormData[key]);
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
        self.fetchData();
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
    alertMsg.style.display = 'block';
    alertMsg.style.opacity = '1';
    alertMsg.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
      alertMsg.style.opacity = '0';
      setTimeout(() => {
        alertMsg.style.display = 'none';
        self.setState(
          {
            updateResult: null,
          }
        );
      }, 500);
    }, 3000);
  }
}
ParticipantStatus.propTypes = {
  dataURL: PropTypes.string,
  tabName: PropTypes.string,
  action: PropTypes.string,
  t: PropTypes.string.isRequired,
};

export default withTranslation(
  ['candidate_parameters', 'loris']
)(ParticipantStatus);
