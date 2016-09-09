var CollapsibleHistory = React.createClass(
  {

    getInitialState: function() {
      return {'collapsed': true};
    },
    toggleCollapsed: function() {
      this.setState({'collapsed': !this.state.collapsed});
    },
    render: function() {
      return (
                <div className="row form-group">
                    <div id="comment-history">
                        <div className="col-sm-12">
                            <div dangerouslySetInnerHTML={{__html: this.props.text}}/>
                        </div>
                    </div>
                </div>

            );
    }
  }
);

var ParticipantStatus = React.createClass({

  getInitialState: function() {
    return {
      'Data': [],
      'formData': {},
      'updateResult': null,
      'errorMessage': null,
      'isLoaded': false,
      'loadedData': 0
    };
  },

  componentDidMount: function() {
    var that = this;
    $.ajax(this.props.dataURL, {
      dataType: 'json',
      xhr: function() {
        var xhr = new window.XMLHttpRequest();
        xhr.addEventListener("progress", function(evt) {
          that.setState({
            'loadedData': evt.loaded
          });
        });
        return xhr;
      },
      success: function(data) {
        that.setState({
          'Data': data,
          'isLoaded': true
        });
      },
      error: function(data, error_code, error_msg) {
        that.setState({
          'error': 'An error occurred when loading the form!'
        });
      }
    });
  },

  setFormData: function(formElement, value) {
    var formData = this.state.formData;
    formData[formElement] = value;

    this.setState({
      formData: formData
    });
  },

  onSubmit: function(e) {
    e.preventDefault();
  },

  render: function() {
    if (!this.state.isLoaded) {
      if (this.state.error != undefined) {
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
                    <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
                </button>
            );
    }

    var disabled = true;
    var updateButton = null;
    if (loris.userHasPermission('candidate_parameter_edit')) {
      disabled = false;
      updateButton = <ButtonElement label="Update" />;
    }

    var required = this.state.Data.required;
    var subOptions = [];
    var suboptionsSelect = null;
    var setSuboptionsSelect = false;
    var suboptionsRequired = false;

    if (this.state.Data.participant_suboptions !== null) {
      setSuboptionsSelect = true;
    }
    for (var key in required) {
      if (required.hasOwnProperty(key)) {
        var participantStatus = this.state.formData.participant_status;
        if (participantStatus === null || participantStatus === undefined) {
          participantStatus = this.state.Data.participant_status;
        }
        if (required[key]["ID"] === participantStatus) {
          subOptions = this.state.Data.parentIDs[participantStatus];
          setSuboptionsSelect = true;
          suboptionsRequired = true;
          break;
        }
      }
    }
    if (setSuboptionsSelect) {
      suboptionsSelect = <SelectElement
                label="Specify Reason"
                name="participant_suboptions"
                options={subOptions}
                value={this.state.Data.participant_suboptions}
                onUserInput={this.setFormData}
                ref="participant_suboptions"
                disabled={false}
                required={suboptionsRequired}
            />;
    }

    var alertMessage = "";
    var alertClass = "alert text-center hide";
    if (this.state.updateResult) {
      if (this.state.updateResult == "success") {
        alertClass = "alert alert-success text-center";
        alertMessage = "Update Successful!";
      } else if (this.state.updateResult == "error") {
        var errorMessage = this.state.errorMessage;
        alertClass = "alert alert-danger text-center";
        alertMessage = errorMessage ? errorMessage : "Failed to update!";
      }
    }

    return (
            <div>
                <div className={alertClass} role="alert" ref="alert-message">
                    {alertMessage}
                </div>
            <FormElement name="participantStatus" onSubmit={this.handleSubmit} ref="form" class="col-md-6">
                <StaticElement
                    label="PSCID"
                    text={this.state.Data.pscid}
                />
                <StaticElement
                    label="DCCID"
                    text={this.state.Data.candID}
                />
                <SelectElement
                    label="Participant Status"
                    name="participant_status"
                    options={this.state.Data.statusOptions}
                    value={this.state.Data.participant_status}
                    onUserInput={this.setFormData}
                    ref="participant_status"
                    disabled={disabled}
                    required={true}
                />
                {suboptionsSelect}
                <TextareaElement
                    label="Comments"
                    name="reason_specify"
                    value={this.state.Data.reason_specify}
                    onUserInput={this.setFormData}
                    ref="reason_specify"
                    disabled={disabled}
                    required={false}
                />
                {updateButton}
                <div class="col-sm-6">
                    <div class="row">
                        <CollapsibleHistory
                            text={this.state.Data.history}
                        />
                    </div>
                </div>
            </FormElement>
                </div>
        );
  },

    /**
     * Handles form submission
     * @param e
     */
  handleSubmit: function(e) {
    e.preventDefault();

    var myFormData = this.state.formData;
    var formRefs = this.refs;

        // Set form data and upload the media file
    var self = this;
    var formData = new FormData();
    for (var key in myFormData) {
      if (myFormData[key] != "") {
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
      success: function(data) {
        self.setState({
          updateResult: "success"
        });
      },
      error: function(err) {
        var errorMessage = JSON.parse(err.responseText).message;
        self.setState({
          updateResult: "error",
          errorMessage: errorMessage
        });
      }

    });
  },

    /**
     * Display a success/error alert message after form submission
     */
  showAlertMessage: function() {
    var self = this;

    if (this.refs["alert-message"] == null) {
      return;
    }

    var alertMsg = this.refs["alert-message"].getDOMNode();
    $(alertMsg).fadeTo(2000, 500).delay(3000).slideUp(500, function() {
      self.setState({
        updateResult: null
      });
    });
  }

});

var RParticipantStatus = React.createFactory(ParticipantStatus);
