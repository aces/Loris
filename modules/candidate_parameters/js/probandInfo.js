"use strict";

var ProbandInfo = React.createClass({
  displayName: "ProbandInfo",


  getInitialState: function getInitialState() {
    return {
      genderOptions: {
        "Male": "Male",
        "Female": "Female"
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

    var dobRequired = false;
    var dob2Required = false;
    if (this.state.formData.ProbandGender !== null) {
      dobRequired = true;
    }
    if (this.state.formData.ProbandDoB !== null) {
      dob2Required = true;
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
        {
          name: "probandInfo",
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
        React.createElement(SelectElement, {
          label: "Proband Gender",
          name: "ProbandGender",
          options: this.state.genderOptions,
          value: this.state.Data.ProbandGender,
          onUserInput: this.setFormData,
          ref: "ProbandGender",
          disabled: disabled,
          required: true
        }),
        React.createElement(DateElement, {
          label: "DoB Proband",
          name: "ProbandDoB",
          value: this.state.Data.ProbandDoB,
          onUserInput: this.setFormData,
          ref: "ProbandDoB",
          disabled: disabled,
          required: dobRequired
        }),
        React.createElement(DateElement, {
          label: "Confirm DoB Proband",
          name: "ProbandDoB2",
          value: this.state.Data.ProbandDoB,
          onUserInput: this.setFormData,
          ref: "ProbandDoB2",
          disabled: disabled,
          required: dob2Required
        }),
        React.createElement(StaticElement, {
          label: "Age Difference (months)",
          text: this.state.Data.ageDifference
        }),
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

    var dob1 = myFormData.ProbandDoB ? myFormData.ProbandDoB : null;
    var dob2 = myFormData.ProbandDoB2 ? myFormData.ProbandDoB2 : null;

    if (dob1 !== dob2) {
      alert("DOB do not match!");
      return;
    }

    if (dob1 > today) {
      alert("Consent to study date cannot be later than today!");
      return;
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

var RProbandInfo = React.createFactory(ProbandInfo);