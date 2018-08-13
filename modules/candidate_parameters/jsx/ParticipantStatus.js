var ParticipantStatus = React.createClass(
  {
    getInitialState: function() {
      return {
        Data: [],
        formData: {},
        updateResult: null,
        errorMessage: null,
        isLoaded: false,
        loadedData: 0
      };
    },
    componentDidMount: function() {
      this.fetchData();
    },
    fetchData: function() {
      var that = this;
      $.ajax(
                this.props.dataURL,
        {
          dataType: 'json',
          xhr: function() {
            var xhr = new window.XMLHttpRequest();
            xhr.addEventListener(
                            "progress",
                            function(evt) {
                              that.setState(
                                {
                                  loadedData: evt.loaded
                                }
                                );
                            }
                        );
            return xhr;
          },
          success: function(data) {
            let formData = {};
            formData.participantStatus = data.participantStatus;
            formData.participantSuboptions = data.participantSuboptions;
            formData.reasonSpecify = data.reasonSpecify;

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
      var required = this.state.Data.required;
      if (formElement === "participantStatus" && required.indexOf(value) < 0) {
        formData.participantSuboptions = "";
      }
      formData[formElement] = value;
      this.setState(
        {
          formData: formData
        }
            );
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
              <span className ="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
          </button>
        );
      }

      var disabled = true;
      var updateButton = null;
      if (loris.userHasPermission('candidate_parameter_edit')) {
        disabled = false;
        updateButton = <ButtonElement label ="Update" />;
      }

      var required = this.state.Data.required;
      var subOptions = {};
      var suboptionsRequired = false;
      var participantStatus = (
        this.state.formData.participantStatus ?
          this.state.formData.participantStatus :
          this.state.Data.participantStatus
      );

      if (participantStatus && required.indexOf(participantStatus) > -1) {
        subOptions = this.state.Data.parentIDs[participantStatus];
        suboptionsRequired = true;
      }

      var formattedHistory = [];
      for (var statusKey in this.state.Data.history) {
        if (this.state.Data.history.hasOwnProperty(statusKey)) {
          var line = "";
          for (var field in this.state.Data.history[statusKey]) {
            if (this.state.Data.history[statusKey].hasOwnProperty(field)) {
              var current = this.state.Data.history[statusKey][field];
              if (current !== null) {
                switch (field) {
                  case 'data_entry_date':
                    line += "[";
                    line += current;
                    line += "] ";
                    break;
                  case 'entry_staff':
                    line += current;
                    line += " ";
                    break;
                  case 'status':
                    line += " Status: ";
                    line += current;
                    line += " ";
                    break;
                  case 'suboption':
                    line += "Details: ";
                    line += current;
                    line += " ";
                    break;
                  case 'reason_specify':
                    line += "Comments: ";
                    line += current;
                    line += " ";
                    break;
                  default:
                }
              }
            }
          }
          formattedHistory.push(<p key={statusKey}>{line}</p>);
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
            name="participantStatus"
            onSubmit={this.handleSubmit}
            ref="form"
            class="col-md-6"
          >
            <StaticElement label="PSCID" text={this.state.Data.pscid} />
            <StaticElement label="DCCID" text={this.state.Data.candID} />
            <SelectElement
              label="Participant Status"
              name="participantStatus"
              options={this.state.Data.statusOptions}
              value={this.state.formData.participantStatus}
              onUserInput={this.setFormData}
              ref="participantStatus"
              disabled={disabled}
              required={true}
            />
            <SelectElement
              label="Specify Reason"
              name="participantSuboptions"
              options={subOptions}
              value={this.state.formData.participantSuboptions}
              onUserInput={this.setFormData}
              ref="participantSuboptions"
              disabled={!suboptionsRequired}
              required={suboptionsRequired}
            />
            <TextareaElement
              label="Comments"
              name="reasonSpecify"
              value={this.state.formData.reasonSpecify}
              onUserInput={this.setFormData}
              ref="reasonSpecify"
              disabled={disabled}
              required={false}
            />
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
      var self = this;
      var formData = new FormData();
      for (var key in myFormData) {
        if (myFormData.hasOwnProperty(key) &&
          myFormData[key] !== "" &&
          myFormData[key] !== null &&
          myFormData[key] !== undefined
        ) {
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
            self.fetchData();
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

export default ParticipantStatus;
