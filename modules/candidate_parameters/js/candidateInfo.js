"use strict";

var CandidateInfo = React.createClass({
  displayName: "CandidateInfo",


  getInitialState: function getInitialState() {
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
        that.setState({
          Data: data,
          isLoaded: true
        });
      },
      error: function error(data, error_code, error_msg) {
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
        React.createElement("span", { className: "glyphicon glyphicon-refresh glyphicon-refresh-animate" })
      );
    }

    var disabled = true;
    var updateButton = null;
    if (loris.userHasPermission('candidate_parameter_edit')) {
      disabled = false;
      updateButton = React.createElement(ButtonElement, { label: "Update" });
    }
    var reasonSelect = null;
    if (this.state.formData.flagged_caveatemptor === "true" || this.state.Data.flagged_reason !== null) {
      reasonSelect = React.createElement(SelectElement, {
        label: "Reason for Caveat Emptor Flag",
        name: "flagged_reason",
        options: this.state.Data.caveatReasonOptions,
        value: this.state.Data.flagged_reason,
        onUserInput: this.setFormData,
        ref: "flagged_reason",
        disabled: false,
        required: true
      });
    }
    var reasonKey;
    for (var key in this.state.Data.caveatReasonOptions) {
      if (this.state.Data.caveatReasonOptions.hasOwnProperty(key)) {
        if (this.state.Data.caveatReasonOptions[key] === "Other") {
          reasonKey = key;
          break;
        }
      }
    }

    var otherText = null;
    var otherRequired = false;
    if (this.state.formData.flagged_reason === reasonKey || this.state.Data.flagged_other !== null) {
      if (this.state.formData.flagged_reason === reasonKey) {
        otherRequired = true;
      }
      otherText = React.createElement(TextareaElement, {
        label: "If Other, please specify",
        name: "flagged_other",
        value: this.state.Data.flagged_other,
        onUserInput: this.setFormData,
        ref: "flagged_other",
        disabled: false,
        required: otherRequired
      });
    }

    // TODO: SET VALUES

    var extraParameterFields = [];
    var extraParameters = this.state.Data.extra_parameters;

    for (var key2 in extraParameters) {
      if (extraParameters.hasOwnProperty(key2)) {
        var name = 'PTID' + extraParameters[key2].ParameterTypeID;

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

            extraParameterFields.push(React.createElement(SelectElement, {
              label: extraParameters[key2].Description,
              name: name,
              options: selectOptions,
              value: this.state.Data.parameter_values[extraParameters[key2].ParameterTypeID],
              onUserInput: this.setFormData,
              ref: name,
              disabled: disabled
            }));
            break;
          case "dat":
            extraParameterFields.push(React.createElement(DateElement, {
              label: extraParameters[key2].Description,
              name: name,
              value: this.state.Data.parameter_values[extraParameters[key2].ParameterTypeID],
              onUserInput: this.setFormData,
              ref: name,
              disabled: disabled
            }));
            break;
          default:
            extraParameterFields.push(React.createElement(TextareaElement, {
              label: extraParameters[key2]['Description'],
              name: name,
              value: this.state.Data.parameter_values[extraParameters[key2].ParameterTypeID],
              onUserInput: this.setFormData,
              ref: name,
              disabled: disabled
            }));
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
      null,
      React.createElement(
        "div",
        { className: alertClass, role: "alert", ref: "alert-message" },
        alertMessage
      ),
      React.createElement(
        FormElement,
        { name: "candidateInfo", onSubmit: this.handleSubmit, ref: "form", "class": "col-md-6" },
        React.createElement(StaticElement, {
          label: "PSCID",
          text: this.state.Data.pscid
        }),
        React.createElement(StaticElement, {
          label: "DCCID",
          text: this.state.Data.candID
        }),
        React.createElement(SelectElement, {
          label: "Caveat Emptor Flag for Candidate",
          name: "flagged_caveatemptor",
          options: this.state.caveatOptions,
          value: this.state.Data.flagged_caveatemptor,
          onUserInput: this.setFormData,
          ref: "flagged_caveatemptor",
          disabled: disabled,
          required: true
        }),
        reasonSelect,
        otherText,
        extraParameterFields,
        updateButton
      )
    );
  },

  /**
   * Handles form submission
   * @param e
   */
  handleSubmit: function handleSubmit(e) {
    e.preventDefault();

    var myFormData = this.state.formData;
    var formRefs = this.refs;

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
      },
      error: function error(err) {
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
  showAlertMessage: function showAlertMessage() {
    var self = this;

    if (this.refs["alert-message"] === null) {
      return;
    }

    var alertMsg = this.refs["alert-message"].getDOMNode();
    $(alertMsg).fadeTo(2000, 500).delay(3000).slideUp(500, function () {
      self.setState({
        updateResult: null
      });
    });
  }

});

var RCandidateInfo = React.createFactory(CandidateInfo);