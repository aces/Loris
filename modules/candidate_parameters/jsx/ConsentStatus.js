import VerticalTabs from 'Tabs';
import TabPane from 'Tabs';
import Tabs from 'Tabs';

var ConsentStatus = React.createClass(
  {
    getInitialState: function() {
      return {
        consentOptions: {
          yes: "Yes",
          no: "No"
        },
        Data: {},
        formData: {},
        updateResult: null,
        errorMessage: null,
        isLoaded: false,
        loadedData: 0
      };
    },

    componentDidMount: function() {
      var that = this;
      $.ajax(
        this.props.dataURL, {
          dataType: 'json',
          success: function(data) {
            var formData = {};
            var consentTypes = data.consentTypes;
            for (var thisConsent in consentTypes) {
              if (consentTypes.hasOwnProperty(thisConsent)) {
                var consentValue = thisConsent + "_value";
                var consentDate = thisConsent+"_date";
                var consentDate2 = consentDate+"2";
                var consentWithdrawal = thisConsent+"_withdrawal_date";
                var consentWithdrawal2 = consentWithdrawal+"2";
                formData[consentValue] = data.consentStatuses[thisConsent] ? data.consentStatuses[thisConsent] : null;
                formData[consentDate] = data.consentDates[thisConsent] ? data.consentDates[thisConsent] : null;
                formData[consentDate2] = data.consentDates[thisConsent] ? data.consentDates[thisConsent] : null;
                formData[consentWithdrawal] = data.withdrawalDates[thisConsent] ? data.withdrawalDates[thisConsent] : null;
                formData[consentWithdrawal2] = data.withdrawalDates[thisConsent] ? data.withdrawalDates[thisConsent] : null;
              }
            }

            that.setState(
              {
                Data: data,
                formData: formData,
                isLoaded: true
              }
                        );
          },
          error: function(data, errorCode, errorMsg) {
            that.setState(
              {
                error: 'An error occurred when loading the form!'
              }
                        );
          }
        }
            );
    },

    setFormData: function(formElement,
    value) {
      var formData = this.state.formData;
      formData[formElement] = value;
      this.setState(
        {
          formData: formData
        }
      );
    },

    // get consent tabs
    getTabPanes: function(tabList, consents) {
      const tabPanes = Object.keys(tabList).map(function(key) {
        return (
          <div key="test-consent-tab-content">
            <TabPane TabId={tabList[key].id} key={key}>
              {consents[key]}
            </TabPane>
          </div>
        );
      });
      return tabPanes;
    },
    onSubmit: function(e) {
      e.preventDefault();
    },
    render: function() {
      if (!this.state.isLoaded) {
        if (this.state.error !== undefined) {
          return (
            <div className ="alert alert-danger text-center">
                <strong>
                    {this.state.error}
                </strong>
            </div>
          );
        }
        return (
          <button className ="btn-info has-spinner">
              Loading
              <span className ="glyphicon glyphicon-refresh glyphicon-refresh-animate">
              </span>
          </button>
        );
      }

      var disabled = true;
      var updateButton = null;
      if (loris.userHasPermission('candidate_parameter_edit')) {
        disabled = false;
        updateButton = <ButtonElement label ="Update" />;
      }

      // Set which select elements are required
      var dateRequired = [];
      var withdrawalRequired = [];
      var consentTypes = this.state.Data.consentTypes; 
      for (var thisConsent in consentTypes) {
        if (consentTypes.hasOwnProperty(thisConsent)) {
          var value = thisConsent + "_value";
          var withdrawal = thisConsent + "_withdrawal_date";

          if (this.state.formData[value] === "yes") {
            dateRequired[thisConsent] = true;
          }
          if (this.state.formData[withdrawal] || this.state.formData[value] === "no") {
            withdrawalRequired[thisConsent] = true;
          } else {
            withdrawalRequired[thisConsent] = false;
          }
        }
      }
	
      // Render consent tabs content
      var consents  = [];
      var tabList = [];
      for (var thisConsent in consentTypes) {
        if (consentTypes.hasOwnProperty(thisConsent)) {
          var consentLabel = consentTypes[thisConsent];
          var consentValue = thisConsent + "_value";
          var consentDate = thisConsent+"_date";
          var consentDate2 = consentDate + "2";
          var consentDateLabel = "Date of " + consentLabel;
          var consentDateConfirmationLabel = "Confirmation Date of " + consentLabel;
          var consentWithdrawal = thisConsent+"_withdrawal_date";
          var consentWithdrawal2 = consentWithdrawal + "2";
          var consentWithdrawalLabel = "Date of Withdrawal of " + consentLabel;
          var consentWithdrawalConfirmationLabel =
            "Confirmation Date of Withdrawal of " + consentLabel;
          const consent = (
            <div key={thisConsent}>
              <SelectElement
                label="Status"
                name={consentValue}
                options={this.state.consentOptions}
                value={this.state.formData[consentValue]}
                onUserInput={this.setFormData}
                ref={consentValue}
                disabled={disabled}
                required={false}
              />
              <DateElement
                label="Date of Consent"
                name={consentDate}
                value={this.state.formData[consentDate]}
                onUserInput={this.setFormData}
                ref={consentDate}
                disabled={disabled}
                required={dateRequired[thisConsent]}
              />
              <DateElement
                label="Confirm Date of Consent"
                name={consentDate2}
                value={this.state.formData[consentDate2]}
                onUserInput={this.setFormData}
                ref={consentDate2}
                disabled={disabled}
                required={dateRequired[thisConsent]}
              />
              <DateElement
                label="Date of Withdrawal"
                name={consentWithdrawal}
                value={this.state.formData[consentWithdrawal]}
                onUserInput={this.setFormData}
                ref={consentWithdrawal}
                disabled={disabled}
                required={withdrawalRequired[thisConsent]}
              />
              <DateElement
                label="Confirm Date of Withdrawal"
                name={consentWithdrawal2}
                value={this.state.formData[consentWithdrawal2]}
                onUserInput={this.setFormData}
                ref={consentWithdrawal2}
                disabled={disabled}
                required={withdrawalRequired[thisConsent]}
              />
              <hr/>
            </div>
          );
          consents.push(consent);
          tabList.push({id:"study_consent", label:"Consent to Study"});
          
        }
      }

      //Render consent history
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
              formattedHistory.push(<p key={field}>{line}</p>);
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
            <VerticalTabs tabs={tabList} defaultTab={tabList[0].id} updateURL={false}>
              {this.getTabPanes(tabList, consents)}
            </VerticalTabs>
            {updateButton}
            {formattedHistory}
          </FormElement>
        </div>
      );
    },
     
    /**
     * Handles form submission
     *
     * @param {event} e - Form submission event
     */
    handleSubmit: function(e) {
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
      for (var thisConsent in this.state.Data.consentTypes) {
        if (this.state.Data.consentTypes.hasOwnProperty(thisConsent)) {
          var label = this.state.Data.consentTypes[thisConsent];

          var consentDate = thisConsent + "_date";
          var consentDate2 = thisConsent + "_date2";

          var date1 = myFormData[consentDate] ?
                    myFormData[consentDate] : null;
          var date2 = myFormData[consentDate2] ?
                    myFormData[consentDate2] : null;

          if (date1 !== date2) {
            alert(label + " dates do not match!");
            return;
          }
          if (date1 > today) {
            alert(label + " date cannot be later than today!");
            return;
          }

          var consentWithdrawal = thisConsent + "_withdrawal_date";
          var consentWithdrawal2 = thisConsent + "_withdrawal_date2";

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
      
      var self = this;
      var formData = new FormData();
      for (var key in myFormData) {
        if (myFormData[key] !== "") {
          formData.append(key, myFormData[key]);
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
                updateResult: "success"
              }
            );
            self.showAlertMessage();
          },
          error: function(err) {
            if (err.responseText !== "") {
              var errorMessage = JSON.parse(err.responseText).message;
              self.setState(
                {
                  updateResult: "error",
                  errorMessage: errorMessage
                }
              );
              self.showAlertMessage();
            }
          }
        }
      );
    },
     /**
     * Display a success/error alert message after form submission
     */
    showAlertMessage: function() {
      var self = this;
      if (this.refs["alert-message"] === null) {
        return;
      }

      var alertMsg = this.refs["alert-message"];
      $(alertMsg).fadeTo(2000, 500).delay(3000).slideUp(
                500,
                function() {
                  self.setState(
                    {
                      updateResult: null
                    }
                    );
                }
            );
    }

  }
);

export default ConsentStatus;
