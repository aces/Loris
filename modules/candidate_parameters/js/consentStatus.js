"use strict";

/* exported RConsentStatus */

var ConsentStatus = React.createClass({
  displayName: "ConsentStatus",

  getInitialState: function getInitialState() {
    return {
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
  },
  componentDidMount: function componentDidMount() {
    var that = this;
    $.ajax(this.props.dataURL, {
      dataType: 'json',
      xhr: function xhr() {
        var xhr = new window.XMLHttpRequest();
        xhr.addEventListener("progress", function (evt) {
          that.setState({
            loadedData: evt.loaded
          });
        });
        return xhr;
      },
      success: function success(data) {

        var formData = {};
        var consents = data.consents;
        for (var consentStatus in consents) {
          if (consents.hasOwnProperty(consentStatus)) {
            var consentDate = consentStatus + "_date";
            var consentDate2 = consentStatus + "_date2";
            var consentWithdrawal = consentStatus + "_withdrawal";
            var consentWithdrawal2 = consentStatus + "_withdrawal2";
            formData[consentStatus] = data.consentStatuses[consentStatus];
            formData[consentDate] = data.consentDates[consentStatus];
            formData[consentDate2] = data.consentDates[consentStatus];
            formData[consentWithdrawal] = data.withdrawals[consentStatus];
            formData[consentWithdrawal2] = data.withdrawals[consentStatus];
          }
        }

        that.setState({
          Data: data,
          formData: formData,
          isLoaded: true
        });
      },
      error: function error(data, errorCode, errorMsg) {
        that.setState({
          error: 'An error occurred when loading the form!'
        });
      }
    });
  },
  setFormData: function setFormData(formElement, value) {
    var formData = this.state.formData;
    formData[formElement] = value;
    this.setState({
      formData: formData
    });
  },
  onSubmit: function onSubmit(e) {
    e.preventDefault();
  },
  render: function render() {
    if (!this.state.isLoaded) {
      if (this.state.error !== undefined) {
        return React.createElement(
          "div",
          { className: "alert alert-danger text-center" },
          React.createElement(
            "strong",
            null,
            this.state.error
          )
        );
      }

      return React.createElement(
        "button",
        { className: "btn-info has-spinner" },
        "Loading",
        React.createElement("span", {
          className: "glyphicon glyphicon-refresh glyphicon-refresh-animate"
        })
      );
    }

    var disabled = true;
    var updateButton = null;
    if (loris.userHasPermission('candidate_parameter_edit')) {
      disabled = false;
      updateButton = React.createElement(ButtonElement, { label: "Update" });
    }
    var dateRequired = [];
    var withdrawalRequired = [];
    var i = 0;
    for (var consent in this.state.Data.consents) {
      if (this.state.Data.consents.hasOwnProperty(consent)) {
        var withdrawal = consent + "_withdrawal";

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

    var consents = [];
    i = 0;
    for (var consentStatus in this.state.Data.consents) {
      if (this.state.Data.consents.hasOwnProperty(consentStatus)) {
        var label = this.state.Data.consents[consentStatus];
        var consentDate = consentStatus + "_date";
        var consentDate2 = consentStatus + "_date2";
        var consentDateLabel = "Date of " + label;
        var consentDateConfirmationLabel = "Confirmation Date of " + label;
        var consentWithdrawal = consentStatus + "_withdrawal";
        var consentWithdrawal2 = consentStatus + "_withdrawal2";
        var consentWithdrawalLabel = "Date of Withdrawal of " + label;
        var consentWithdrawalConfirmationLabel = "Confirmation Date of Withdrawal of " + label;

        consents.push(React.createElement(SelectElement, {
          label: label,
          name: consentStatus,
          options: this.state.consentOptions,
          value: this.state.Data.consentStatuses[consentStatus],
          onUserInput: this.setFormData,
          ref: consentStatus,
          disabled: disabled,
          required: false
        }));
        consents.push(React.createElement(DateElement, {
          label: consentDateLabel,
          name: consentDate,
          value: this.state.Data.consentDates[consentStatus],
          onUserInput: this.setFormData,
          ref: consentDate,
          disabled: disabled,
          required: dateRequired[i]
        }));
        consents.push(React.createElement(DateElement, {
          label: consentDateConfirmationLabel,
          name: consentDate2,
          value: this.state.Data.consentDates[consentStatus],
          onUserInput: this.setFormData,
          ref: consentDate2,
          disabled: disabled,
          required: dateRequired[i]
        }));
        consents.push(React.createElement(DateElement, {
          label: consentWithdrawalLabel,
          name: consentWithdrawal,
          value: this.state.Data.withdrawals[consentStatus],
          onUserInput: this.setFormData,
          ref: consentWithdrawal,
          disabled: disabled,
          required: false
        }));
        consents.push(React.createElement(DateElement, {
          label: consentWithdrawalConfirmationLabel,
          name: consentWithdrawal2,
          value: this.state.Data.withdrawals[consentStatus],
          onUserInput: this.setFormData,
          ref: consentWithdrawal2,
          disabled: disabled,
          required: withdrawalRequired[i]
        }));
        consents.push(React.createElement("hr", null));

        i++;
      }
    }

    var formattedHistory = [];
    for (var consentKey in this.state.Data.history) {
      if (this.state.Data.history.hasOwnProperty(consentKey)) {
        var consentLabel = this.state.Data.history[consentKey].label;
        var consentType = this.state.Data.history[consentKey].consentType;
        for (var field in this.state.Data.history[consentKey]) {
          if (this.state.Data.history[consentKey].hasOwnProperty(field)) {
            var line = "";
            var historyConsent = this.state.Data.history[consentKey][field];
            for (var field2 in historyConsent) {
              if (historyConsent.hasOwnProperty(field2)) {
                var current = historyConsent[field2];
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
            formattedHistory.push(React.createElement(
              "p",
              null,
              line
            ));
          }
        }
      }
    }

    var alertMessage = "";
    var alertClass = "alert text-center hide";
    if (this.state.updateResult) {
      if (this.state.updateResult === "success") {
        alertClass = "alert alert-success text-center";
        alertMessage = "Update Successful!";
      } else if (this.state.updateResult === "error") {
        var errorMessage = this.state.errorMessage;
        alertClass = "alert alert-danger text-center";
        alertMessage = errorMessage ? errorMessage : "Failed to update!";
      }
    }

    return React.createElement(
      "div",
      { "class": "row" },
      React.createElement(
        "div",
        { className: alertClass, role: "alert", ref: "alert-message" },
        alertMessage
      ),
      React.createElement(
        FormElement,
        {
          name: "consentStatus",
          onSubmit: this.handleSubmit,
          ref: "form",
          "class": "col-md-6"
        },
        React.createElement(StaticElement, {
          label: "PSCID",
          text: this.state.Data.pscid
        }),
        React.createElement(StaticElement, {
          label: "DCCID",
          text: this.state.Data.candID
        }),
        consents,
        updateButton,
        formattedHistory
      )
    );
  },
  /**
  * Handles form submission
  *
  * @param {event} e - Form submission event
  */
  handleSubmit: function handleSubmit(e) {
    e.preventDefault();
    var myFormData = this.state.formData;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; // January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;
    for (var consentStatus in this.state.Data.consents) {
      if (this.state.Data.consents.hasOwnProperty(consentStatus)) {
        var label = this.state.Data.consents[consentStatus];

        var consentDate = consentStatus + "_date";
        var consentDate2 = consentStatus + "_date2";

        var date1 = myFormData[consentDate] ? myFormData[consentDate] : null;
        var date2 = myFormData[consentDate2] ? myFormData[consentDate2] : null;

        if (date1 !== date2) {
          alert(label + " dates do not match!");
          return;
        }
        if (date1 > today) {
          alert(label + " date cannot be later than today!");
          return;
        }

        var consentWithdrawal = consentStatus + "_withdrawal";
        var consentWithdrawal2 = consentStatus + "_withdrawal2";

        date1 = myFormData[consentWithdrawal] ? myFormData[consentWithdrawal] : null;
        date2 = myFormData[consentWithdrawal2] ? myFormData[consentWithdrawal2] : null;

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
    var self = this;
    var formData = new FormData();
    for (var key in myFormData) {
      if (myFormData[key] !== "") {
        formData.append(key, myFormData[key]);
      }
    }

    formData.append('tab', this.props.tabName);
    formData.append('candID', this.state.Data.candID);
    $.ajax({
      type: 'POST',
      url: self.props.action,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function success(data) {
        self.setState({
          updateResult: "success"
        });
        self.showAlertMessage();
      },
      error: function error(err) {
        if (err.responseText !== "") {
          var errorMessage = JSON.parse(err.responseText).message;
          self.setState({
            updateResult: "error",
            errorMessage: errorMessage
          });
          self.showAlertMessage();
        }
      }

    });
  },
  /**
  * Display a success/error alert message after form submission
  */
  showAlertMessage: function showAlertMessage() {
    var self = this;
    if (this.refs["alert-message"] === null) {
      return;
    }

    var alertMsg = this.refs["alert-message"];
    $(alertMsg).fadeTo(2000, 500).delay(3000).slideUp(500, function () {
      self.setState({
        updateResult: null
      });
    });
  }

});

var RConsentStatus = React.createFactory(ConsentStatus);