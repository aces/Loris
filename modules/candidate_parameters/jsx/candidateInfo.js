/* exported RCandidateInfo */

var CandidateInfo = React.createClass(
  {
    getInitialState: function() {
      return {
        caveatOptions: {
          true: "True",
          false: "False"
        },
        Data: [],
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
            var formData = {
              flaggedCaveatemptor: data.flagged_caveatemptor,
              flaggedOther: data.flagged_other,
              flaggedReason: data.flagged_reason
            };

            // Figure out what is the index of Other option
            that.otherOption = null;
            var caveatReasonOptions = data.caveatReasonOptions;
            if (caveatReasonOptions) {
              for (var reason in caveatReasonOptions) {
                if (caveatReasonOptions[reason] === "Other") {
                  that.otherOption = reason;
                  break;
                }
              }
            }

            that.setState(
              {
                Data: data,
                isLoaded: true,
                formData: formData
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
    setFormData: function(formElement, value) {
      var formData = this.state.formData;
      formData[formElement] = value;

      // Reset 'reason' field
      if (formElement === "flaggedCaveatemptor" && value === "false") {
        formData.flaggedReason = '';
        formData.flaggedOther = '';
        this.refs.flaggedReason.state.value = "";
        this.refs.flaggedReason.state.hasError = false;
        this.refs.flaggedOther.state.value = "";
      }

      // Reset 'other' field
      if (formElement === "flaggedReason" && value !== this.otherOption) {
        formData.flaggedOther = '';
        this.refs.flaggedOther.state.value = "";
      }

      this.setState({
        formData: formData
      });
    },
    onSubmit: function(e) {
      e.preventDefault();
    },
    render: function() {
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

        return (
          <button className="btn-info has-spinner">
            Loading
            <span
              className="glyphicon glyphicon-refresh glyphicon-refresh-animate">
            </span>
          </button>
        );
      }

      var disabled = true;
      var updateButton = null;
      if (loris.userHasPermission('candidate_parameter_edit')) {
        disabled = false;
        updateButton = <ButtonElement label="Update"/>;
      }
      var reasonDisabled = true;
      var reasonRequired = false;
      if (this.state.formData.flaggedCaveatemptor === "true") {
        reasonDisabled = false;
        reasonRequired = true;
      }

      var reasonKey = null;
      var specifyOther = null;
      var otherDisabled = true;
      var otherRequired = false;
      for (var key in this.state.Data.caveatReasonOptions) {
        if (this.state.Data.caveatReasonOptions.hasOwnProperty(key)) {
          if (this.state.Data.caveatReasonOptions[key] === "Other") {
            reasonKey = key;
            break;
          }
        }
      }

      if (this.state.formData.flaggedReason === reasonKey) {
        otherRequired = true;
        otherDisabled = false;
      }

      if (this.state.formData.flaggedCaveatemptor === "false") {
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
      var extraParameterFields = [];
      var extraParameters = this.state.Data.extra_parameters;
      for (var key2 in extraParameters) {
        if (extraParameters.hasOwnProperty(key2)) {
          var paramTypeID = extraParameters[key2].ParameterTypeID;
          var name = 'PTID' + paramTypeID;
          var value = this.state.Data.parameter_values[paramTypeID];

          switch (extraParameters[key2].Type.substring(0, 3)) {
            case "enu":
              var types = extraParameters[key2].Type.substring(5);
              types = types.slice(0, -1);
              types = types.replace(/'/g, '');
              types = types.split(',');
              var selectOptions = [];
              for (var key3 in types) {
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
                />
              );
              break;
            case "dat":
              extraParameterFields.push(
                <DateElement
                  label={extraParameters[key2].Description}
                  name={name}
                  value={value}
                  onUserInput={this.setFormData}
                  ref={name}
                  disabled={disabled}
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
                />
              );
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
        <div class="row">
          <div className={alertClass} role="alert" ref="alert-message">
            {alertMessage}
          </div>
          <FormElement
            name="candidateInfo"
            onSubmit={this.handleSubmit}
            ref="form"
            class="col-md-6"
          >
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
    },
    /**
     * Handles form submission
     *
     * @param {event} e - Form submission event
     */
    handleSubmit: function(e) {
      e.preventDefault();
      var myFormData = this.state.formData;
      // Set form data and upload the media file
      var self = this;
      var formData = new FormData();
      for (var key in myFormData) {
        if (myFormData.hasOwnProperty(key)) {
          if (myFormData[key] !== "") {
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

      var alertMsg = this.refs["alert-message"].getDOMNode();
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

var RCandidateInfo = React.createFactory(CandidateInfo);
