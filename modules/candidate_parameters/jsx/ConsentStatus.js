import Loader from 'Loader';
/**
 * Consent Status Component.
 *
 * Renders the contents of the Consent Status tab, consisting of the FormElement component
 */

class ConsentStatus extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      consentOptions: {
        yes: "Yes",
        no: "No"
      },
      Data: [],
      formData: {},
      updateResult: null,
      errorMessage: null,
      isLoaded: false,
      loadedData: 0
    };

    /**
     * Bind component instance to custom methods
     */
    this.fetchData = this.fetchData.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showAlertMessage = this.showAlertMessage.bind(this);
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
      success: data => {
        let formData = {};
        let consents = data.consents;
        for (let consentStatus in consents) {
          if (consents.hasOwnProperty(consentStatus)) {
            let consentDate = consentStatus + "_date";
            let consentDate2 = consentStatus + "_date2";
            let consentWithdrawal = consentStatus + "_withdrawal";
            let consentWithdrawal2 = consentStatus + "_withdrawal2";
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
          isLoaded: true
        });
      },
      error: error => {
        this.setState({
          error: 'An error occurred when loading the form!'
        });
      }
    });
  }

  /**
   * Store the value of the element in this.state.formData
   *
   * @param {string} formElement - name of the form element
   * @param {string} value - value of the form element
   */
  setFormData(formElement, value) {
    let formData = this.state.formData;
    formData[formElement] = value;
    this.setState({
      formData: formData
    });
  }

  /**
   * Handles form submission
   *
   * @param {event} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();
    let myFormData = this.state.formData;
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; // January is 0!
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;
    for (let consentStatus in this.state.Data.consents) {
      if (this.state.Data.consents.hasOwnProperty(consentStatus)) {
        let label = this.state.Data.consents[consentStatus];

        let consentDate = consentStatus + "_date";
        let consentDate2 = consentStatus + "_date2";

        let date1 = myFormData[consentDate] ?
                  myFormData[consentDate] : null;
        let date2 = myFormData[consentDate2] ?
                  myFormData[consentDate2] : null;

        if (date1 !== date2) {
          alert(label + " dates do not match!");
          return;
        }
        if (date1 > today) {
          alert(label + " date cannot be later than today!");
          return;
        }

        let consentWithdrawal = consentStatus + "_withdrawal";
        let consentWithdrawal2 = consentStatus + "_withdrawal2";

        date1 = myFormData[consentWithdrawal] ?
                  myFormData[consentWithdrawal] : null;
        date2 = myFormData[consentWithdrawal2] ?
                  myFormData[consentWithdrawal2] : null;

        if (date1 !== date2) {
          alert(label + " withdrawal dates do not match!");
          return;
        }
        if (date1 > today) {
          alert(label + " withdrawal date cannot be later than today!");
          return;
        }
      }
    }
    // Set form data
    let formData = new FormData();
    for (let key in myFormData) {
      if (myFormData[key] !== "") {
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
      success: data => {
        this.setState({
          updateResult: "success"
        });
        this.showAlertMessage();
        this.fetchData();
      },
      error: error => {
        if (error.responseText !== "") {
          let errorMessage = JSON.parse(error.responseText).message;
          this.setState({
            updateResult: "error",
            errorMessage: errorMessage
          });
          this.showAlertMessage();
        }
      }
    });
  }

  /**
   * Display a success/error alert message after form submission
   */
  showAlertMessage() {
    if (this.refs["alert-message"] === null) {
      return;
    }

    let alertMsg = this.refs["alert-message"];
    $(alertMsg).fadeTo(2000, 500).delay(3000).slideUp(
              500,
              () => {
                this.setState({
                  updateResult: null
                });
              });
  }

  render() {
    if (!this.state.isLoaded) {
      return <Loader />;
    }

    let disabled = true;
    let updateButton = null;
    if (loris.userHasPermission('candidate_parameter_edit')) {
      disabled = false;
      updateButton = <ButtonElement label ="Update" />;
    }
    let dateRequired = [];
    let withdrawalRequired = [];
    let i = 0;
    for (let consent in this.state.Data.consents) {
      if (this.state.Data.consents.hasOwnProperty(consent)) {
        let withdrawal = consent + "_withdrawal";

        if (this.state.formData[consent] === "yes") {
          dateRequired[i] = true;
        }
        if (this.state.formData[withdrawal]) {
          withdrawalRequired[i] = true;
        } else {
          withdrawalRequired[i] = false;
        }
        i++;
      }
    }

    let consents = [];
    i = 0;
    for (let consentStatus in this.state.Data.consents) {
      if (this.state.Data.consents.hasOwnProperty(consentStatus)) {
        let label = this.state.Data.consents[consentStatus];
        let consentDate = consentStatus + "_date";
        let consentDate2 = consentStatus + "_date2";
        let consentDateLabel = "Date of " + label;
        let consentDateConfirmationLabel = "Confirmation Date of " + label;
        let consentWithdrawal = consentStatus + "_withdrawal";
        let consentWithdrawal2 = consentStatus + "_withdrawal2";
        let consentWithdrawalLabel = "Date of Withdrawal of " + label;
        let consentWithdrawalConfirmationLabel =
          "Confirmation Date of Withdrawal of " + label;

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
              disabled={disabled}
              required={false}
            />
            <DateElement
              label={consentWithdrawalConfirmationLabel}
              name={consentWithdrawal2}
              value={this.state.formData[consentWithdrawal2]}
              onUserInput={this.setFormData}
              ref={consentWithdrawal2}
              disabled={disabled}
              required={withdrawalRequired[i]}
            />
            <hr/>
          </div>
        );
        consents.push(consent);
        i++;
      }
    }

    let formattedHistory = [];
    for (let consentKey in this.state.Data.history) {
      if (this.state.Data.history.hasOwnProperty(consentKey)) {
        let consentLabel = this.state.Data.history[consentKey].label;
        let consentType = this.state.Data.history[consentKey].consentType;
        for (let field in this.state.Data.history[consentKey]) {
          if (this.state.Data.history[consentKey].hasOwnProperty(field)) {
            let line = "";
            let historyConsent = this.state.Data.history[consentKey][field];
            for (let field2 in historyConsent) {
              if (historyConsent.hasOwnProperty(field2)) {
                let current = historyConsent[field2];
                if (current !== null) {
                  switch (field2) {
                    case 'data_entry_date':
                      line += "[";
                      line += current;
                      line += "] ";
                      break;
                    case 'entry_staff':
                      line += current;
                      line += " ";
                      break;
                    case consentType:
                      line += consentLabel + " Status: ";
                      line += current;
                      line += " ";
                      break;
                    case consentType + '_date':
                      line += "Date of Consent: ";
                      line += current;
                      line += " ";
                      break;
                    case consentType + '_withdrawal':
                      line += "Date of Consent Withdrawal: ";
                      line += current;
                      line += " ";
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

    let alertMessage = "";
    let alertClass = "alert text-center hide";
    if (this.state.updateResult) {
      if (this.state.updateResult === "success") {
        alertClass = "alert alert-success text-center";
        alertMessage = "Update Successful!";
      } else if (this.state.updateResult === "error") {
        let errorMessage = this.state.errorMessage;
        alertClass = "alert alert-danger text-center";
        alertMessage = errorMessage ? errorMessage : "Failed to update!";
      }
    }

    return (
      <div className="row">
        <div className={alertClass} role="alert" ref="alert-message">
          {alertMessage}
        </div>
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
  dataURL: React.PropTypes.string.isRequired,
  action: React.PropTypes.string.isRequired,
  tabName: React.PropTypes.string
};

export default ConsentStatus;
