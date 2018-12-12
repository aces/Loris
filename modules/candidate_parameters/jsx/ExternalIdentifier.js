/* exported RExternalIdentifier */

var ExternalIdentifier = React.createClass({
  getInitialState: function() {
    return {
      Data: [],
      formData: {},
      existingStudies: [],
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
              that.setState({
                loadedData: evt.loaded
              });
            });
          return xhr;
        },
        success: function(data) {
          that.setState({
            Data: data,
            isLoaded: true,
            existingStudies: data.existingStudies
          });
        },
        error: function(data, errorCode, errorMsg) {
          that.setState({
            error: 'An error occurred when loading the form!'
          });
        }
      }
    );
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
            className="glyphicon glyphicon-refresh
                        glyphicon-refresh-animate"
          >
                    </span>
        </button>
      );
    }

    var studyOptions = this.state.Data.allStudies;

    var disabled = true;
    var addButton = null;
    if (loris.userHasPermission('candidate_parameter_edit')) {
      disabled = false;
      addButton = <ButtonElement label="Add"/>;
    }

    var existingStudies = this.state.existingStudies;
    var existingStudiesHTML = [];

    for (var key in existingStudies) {
      if (existingStudies.hasOwnProperty(key)) {
        var PName = studyOptions[existingStudies[key].ProjectID];
        var PID = existingStudies[key].ProjectID;
        var ESID = existingStudies[key].ExtStudyID;

        existingStudiesHTML.push(
          <div>
            <StaticElement
              label="Study"
              text ={PName}
            />
            <StaticElement
              label="External Study Identifier"
              text ={ESID}
            />
            <ButtonElement
              label="Delete"
              type="button"
              onUserInput={
                this.deleteExternalIdentifier.bind(
                  null,
                  PID,
                  key
                )
              }
            />
            <hr />
          </div>
        );
      }
    }

    var IDRequired = false;
    if (this.state.formData.ProjectID) {
      IDRequired = true;
    }

    var ProjectRequired = true;

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
        <FormElement
          name="externalIdentifier"
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
          <hr />
          {existingStudiesHTML}
          <div className={alertClass} role="alert" ref="alert-message">
            {alertMessage}
          </div>
          <SelectElement
            label="Study"
            name="ProjectID"
            options={studyOptions}
            onUserInput={this.setFormData}
            ref="ProjectID"
            disabled={disabled}
            required={ProjectRequired}
            value={this.state.formData.ProjectID}
          />
          <TextboxElement
            label="External Study Identifier"
            name="ExtStudyID"
            onUserInput={this.setFormData}
            ref="ExtStudyID"
            disabled={disabled}
            required={IDRequired}
            value={this.state.formData.ExtStudyID}
          />
          {addButton}
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
    var formRefs = this.refs;

    var existingStudies = this.state.existingStudies;
    var existingStudy = {};

    for (var key in myFormData) {
      if (myFormData.hasOwnProperty(key)) {
        if (myFormData[key] !== "") {
          existingStudy[key] = myFormData[key];
          formData.append(key, myFormData[key]);
        }
      }
    }

    formData.append('tab', this.props.tabName);
    formData.append('candID', this.state.Data.candID);

    existingStudies.push(existingStudy);

    this.setState({
      existingStudies: existingStudies
    });

    $.ajax({
      type: 'POST',
      url: self.props.action,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: data => {
        self.setState({
          updateResult: "success",
          formData: {}
        });
        self.showAlertMessage();
        self.fetchData();
        // Iterates through child components and resets state
        // to initial state in order to clear the form
        Object.keys(formRefs).map(function(ref) {
          if (formRefs[ref].state && formRefs[ref].state.value) {
            formRefs[ref].state.value = "";
          }
        });
        // rerender components
        self.forceUpdate();
      },
      error: error => {
        let errorMessage = "";
        if (error.responseText === "") {
          errorMessage = 'ERROR: Contact Administrator';
        } else {
          errorMessage = JSON.parse(error.responseText).message;
        }
        this.setState(
          {
            updateResult: "error",
            errorMessage: errorMessage
          });
        this.showAlertMessage();
      }
    });
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
      });
  },
  deleteExternalIdentifier: function(PID, key) {
    var existingStudies = this.state.existingStudies;
    delete existingStudies[key];

    this.setState({
      existingStudies: existingStudies
    });

    var myFormData = this.state.formData;
    var self = this;
    var formData = new FormData();
    for (let key in myFormData) {
      if (myFormData.hasOwnProperty(key)) {
        if (myFormData[key] !== "" && myFormData[key]) {
          formData.append(key, myFormData[key]);
        }
      }
    }

    formData.append('tab', 'deleteExternalIdentifier');
    formData.append('candID', this.state.Data.candID);
    formData.append('project', PID);

    $.ajax({
      type: 'POST',
      url: self.props.action,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: data => {
        self.setState(
          {
            updateResult: "success"
          });
        self.showAlertMessage();
      },
      error: error => {
        let errorMessage = "";
        if (error.responseText === "") {
          errorMessage = 'ERROR: Contact Administrator';
        } else {
          errorMessage = JSON.parse(error.responseText).message;
        }
        this.setState(
          {
            updateResult: "error",
            errorMessage: errorMessage
          });
        this.showAlertMessage();
      }
    });
  }

});

var RExternalIdentifier = React.createFactory(ExternalIdentifier);

window.ExternalIdentifier = ExternalIdentifier;
window.RExternalIdentifier = RExternalIdentifier;

export default ExternalIdentifier;
