import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Loader from 'Loader';

/**
 * Consent Status Component.
 *
 * Renders the contents of the Consent Status tab, consisting of the FormElement component
 */
class ConsentStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consentOptions: {
        yes: 'Yes',
        no: 'No',
      },
      Data: [],
      formData: {},
      error: false,
      isLoaded: false,
      loadedData: 0,
    };

    /**
         * Bind component instance to custom methods
         */
    this.fetchData = this.fetchData.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  /**
     * Retrieve data from the provided URL and save it in state
     */
  fetchData() {
    $.ajax(this.props.dataURL, {
      method: 'GET',
      dataType: 'json',
      success: (data) => {
        const formData = {};
        const consents = data.consents;
        for (const consentStatus in consents) {
          if (consents.hasOwnProperty(consentStatus)) {
            const consentDate = consentStatus + '_date';
            const consentDate2 = consentStatus + '_date2';
            const consentWithdrawal = consentStatus + '_withdrawal';
            const consentWithdrawal2 = consentStatus + '_withdrawal2';
            formData[consentStatus] = data.consentStatuses[consentStatus];
            formData[consentDate] = data.consentDates[consentStatus];
            formData[consentDate2] = data.consentDates[consentStatus];
            formData[consentWithdrawal] = data.withdrawals[consentStatus];
            formData[consentWithdrawal2] = data.withdrawals[consentStatus];
          }
        }
        this.setState({
          Data: data,
          formData: formData,
          isLoaded: true,
        });
      },
      error: (error) => {
        console.error(error);
        this.setState({
          error: true,
        });
      },
    });
  }

  /**
     * Store the value of the element in this.state.formData
     *
     * @param {string} formElement - name of the form element
     * @param {string} value - value of the form element
     */
  setFormData(formElement, value) {
    const formData = this.state.formData;
    formData[formElement] = value;
    for (const consent in this.state.Data.consents) {
      if (this.state.Data.consents.hasOwnProperty(consent)) {
        const oldConsent = this.state.Data.consentStatuses[consent];
        const newConsent = this.state.formData[consent];
        // Clear withdrawal date if consent status changes from no
        // (or empty if uncleaned data) to yes
        if (formElement === consent) {
          if ((newConsent === 'yes' && oldConsent !== 'yes') ||
                        (newConsent === 'no' && oldConsent === null)) {
            formData[consent + '_withdrawal'] = '';
            formData[consent + '_withdrawal2'] = '';
          }
        }
      }
    }
    this.setState({
      formData: formData,
    });
  }

  /**
     * Handles form submission
     *
     * @param {event} e - Form submission event
     */
  handleSubmit(e) {
    e.preventDefault();
    const myFormData = this.state.formData;
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; // January is 0!
    const yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;
    for (const consentStatus in this.state.Data.consents) {
      if (this.state.Data.consents.hasOwnProperty(consentStatus)) {
        const label = this.state.Data.consents[consentStatus];

        const consentDate = consentStatus + '_date';
        const consentDate2 = consentStatus + '_date2';

        let date1 = myFormData[consentDate] ?
                    myFormData[consentDate] : null;
        let date2 = myFormData[consentDate2] ?
                    myFormData[consentDate2] : null;

        if (date1 !== date2) {
          alert(label + ' dates do not match!');
          return;
        }
        if (date1 > today) {
          alert(label + ' date cannot be later than today!');
          return;
        }

        const consentWithdrawal = consentStatus + '_withdrawal';
        const consentWithdrawal2 = consentStatus + '_withdrawal2';

        date1 = myFormData[consentWithdrawal] ?
                    myFormData[consentWithdrawal] : null;
        date2 = myFormData[consentWithdrawal2] ?
                    myFormData[consentWithdrawal2] : null;

        if (date1 !== date2) {
          alert(label + ' withdrawal dates do not match!');
          return;
        }
        if (date1 > today) {
          alert(label + ' withdrawal date cannot be later than today!');
          return;
        }
      }
    }
    // Set form data
    const formData = new FormData();
    for (const key in myFormData) {
      // Does not submit data with empty string
      if (myFormData[key] !== '') {
        formData.append(key, myFormData[key]);
      }
    }
    formData.append('tab', this.props.tabName);
    formData.append('candID', this.state.Data.candID);
    $.ajax({
      type: 'POST',
      url: this.props.action,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: (data) => {
        swal('Success!', 'Update successful.', 'success');
        this.fetchData();
      },
      error: (error) => {
        console.error(error);
        const errorMessage = error.responseText || 'Update failed.';
        swal('Error!', errorMessage, 'error');
      },
    });
  }

  render() {
    // If error occurs, return a message.
    // XXX: Replace this with a UI component for 500 errors.
    if (this.state.error) {
      return <h3>An error occured while loading the page.</h3>;
    }

    if (!this.state.isLoaded) {
      return <Loader />;
    }

    let disabled = true;
    let updateButton = null;
    if (loris.userHasPermission('candidate_parameter_edit')) {
      disabled = false;
      updateButton = <ButtonElement label ='Update' />;
    }
    const emptyOption = [];
    const dateRequired = [];
    const withdrawalRequired = [];
    const withdrawalDisabled = [];
    let i = 0;
    for (const consent in this.state.Data.consents) {
      if (this.state.Data.consents.hasOwnProperty(consent)) {
        const oldConsent = this.state.Data.consentStatuses[consent];
        const newConsent = this.state.formData[consent];
        const withdrawalDate = this.state.Data.withdrawals[consent];
        // Set defaults
        emptyOption[i] = true;
        dateRequired[i] = false;
        withdrawalRequired[i] = false;
        // Let date of withdrawal field be disabled until it is needed
        withdrawalDisabled[i] = true;
        // If answer to consent is 'yes', require date of consent
        if (newConsent === 'yes') {
          dateRequired[i] = true;
        }
        // If answer to consent is 'no', require date of consent
        if (newConsent === 'no') {
          dateRequired[i] = true;
          // If answer was previously 'yes' and consent is now being withdrawn, enable and require withdrawal date
          // If consent was previously withdrawn and stays withdrawn, enable and require withdrawal date
          if (oldConsent === 'yes' || (oldConsent === 'no' && withdrawalDate)) {
            withdrawalDisabled[i] = false;
            withdrawalRequired[i] = true;
          }
        }
        // Disallow clearing a valid consent status by removing empty option
        if (oldConsent === 'no' || oldConsent === 'yes') {
          emptyOption[i] = false;
        }
        i++;
      }
    }

    const consents = [];
    i = 0;
    for (const consentStatus in this.state.Data.consents) {
      if (this.state.Data.consents.hasOwnProperty(consentStatus)) {
        const label = this.state.Data.consents[consentStatus];
        const consentDate = consentStatus + '_date';
        const consentDate2 = consentStatus + '_date2';
        const consentDateLabel = 'Date of ' + label;
        const consentDateConfirmationLabel = 'Confirmation Date of ' + label;
        const consentWithdrawal = consentStatus + '_withdrawal';
        const consentWithdrawal2 = consentStatus + '_withdrawal2';
        const consentWithdrawalLabel = 'Date of Withdrawal of ' + label;
        const consentWithdrawalConfirmationLabel =
                    'Confirmation Date of Withdrawal of ' + label;

        const consent = (
          <div key={i}>
            <SelectElement
              label={label}
              name={consentStatus}
              options={this.state.consentOptions}
              value={this.state.formData[consentStatus]}
              onUserInput={this.setFormData}
              ref={consentStatus}
              disabled={disabled}
              required={false}
              emptyOption={emptyOption[i]}
            />
            <DateElement
              label={consentDateLabel}
              name={consentDate}
              value={this.state.formData[consentDate]}
              onUserInput={this.setFormData}
              ref={consentDate}
              disabled={disabled}
              required={dateRequired[i]}
            />
            <DateElement
              label={consentDateConfirmationLabel}
              name={consentDate2}
              value={this.state.formData[consentDate2]}
              onUserInput={this.setFormData}
              ref={consentDate2}
              disabled={disabled}
              required={dateRequired[i]}
            />
            <DateElement
              label={consentWithdrawalLabel}
              name={consentWithdrawal}
              value={this.state.formData[consentWithdrawal]}
              onUserInput={this.setFormData}
              ref={consentWithdrawal}
              disabled={disabled || withdrawalDisabled[i]}
              required={withdrawalRequired[i]}
            />
            <DateElement
              label={consentWithdrawalConfirmationLabel}
              name={consentWithdrawal2}
              value={this.state.formData[consentWithdrawal2]}
              onUserInput={this.setFormData}
              ref={consentWithdrawal2}
              disabled={disabled || withdrawalDisabled[i]}
              required={withdrawalRequired[i]}
            />
            <hr/>
          </div>
        );
        consents.push(consent);
        i++;
      }
    }

    const formattedHistory = [];
    for (const consentKey in this.state.Data.history) {
      if (this.state.Data.history.hasOwnProperty(consentKey)) {
        const consentLabel = this.state.Data.history[consentKey].label;
        const consentType = this.state.Data.history[consentKey].consentType;
        for (const field in this.state.Data.history[consentKey]) {
          if (this.state.Data.history[consentKey].hasOwnProperty(field)) {
            let line = '';
            const historyConsent = this.state.Data.history[consentKey][field];
            for (const field2 in historyConsent) {
              if (historyConsent.hasOwnProperty(field2)) {
                const current = historyConsent[field2];
                if (current !== null) {
                  switch (field2) {
                    case 'data_entry_date':
                      line += '[';
                      line += current;
                      line += '] ';
                      break;
                    case 'entry_staff':
                      line += current;
                      line += ' ';
                      break;
                    case consentType:
                      line += consentLabel + ' Status: ';
                      line += current;
                      line += ' ';
                      break;
                    case consentType + '_date':
                      line += 'Date of Consent: ';
                      line += current;
                      line += ' ';
                      break;
                    case consentType + '_withdrawal':
                      line += 'Date of Consent Withdrawal: ';
                      line += current;
                      line += ' ';
                      break;
                    default:
                  }
                }
              }
            }
            formattedHistory.push(<p key={field}>{line}</p>);
          }
        }
      }
    }

    return (
      <div className="row">
        <FormElement
          name="consentStatus"
          onSubmit={this.handleSubmit}
          ref="form"
          class="col-md-6"
        >
          <StaticElement label="PSCID" text={this.state.Data.pscid} />
          <StaticElement label="DCCID" text={this.state.Data.candID} />
          {consents}
          {updateButton}
          {formattedHistory}
        </FormElement>
      </div>
    );
  }
}

ConsentStatus.propTypes = {
  dataURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  tabName: PropTypes.string,
};

export default ConsentStatus;
