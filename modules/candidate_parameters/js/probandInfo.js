/* exported RProbandInfo */

var ProbandInfo = React.createClass({
  displayName: "ProbandInfo",

  getInitialState: function () {
    return {
      genderOptions: {
        Male: "Male",
        Female: "Female"
      },
      Data: [],
      formData: {},
      updateResult: null,
      errorMessage: null,
      isLoaded: false,
      loadedData: 0
    };
  },
  componentDidMount: function () {
    var that = this;
    $.ajax(this.props.dataURL, {
      dataType: 'json',
      xhr: function () {
        var xhr = new window.XMLHttpRequest();
        xhr.addEventListener("progress", function (evt) {
          that.setState({
            loadedData: evt.loaded
          });
        });
        return xhr;
      },
      success: function (data) {
        that.setState({
          Data: data,
          isLoaded: true
        });
      },
      error: function (data, errorCode, errorMsg) {
        that.setState({
          error: 'An error occurred when loading the form!'
        });
      }
    });
  },
  setFormData: function (formElement, value) {
    var formData = this.state.formData;
    formData[formElement] = value;
    this.setState({
      formData: formData
    });
  },
  onSubmit: function (e) {
    e.preventDefault();
  },
  render: function () {
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

    var dobRequired = false;
    var dob2Required = false;
    if (this.state.formData.ProbandGender !== null) {
      dobRequired = true;
    }
    var dob = this.state.formData.ProbandDoB;
    var ageDifference = this.state.Data.ageDifference;
    if (dob) {
      dob2Required = true;

      var candidateDOB = this.state.Data.candidateDOB;

      var temp = this.calculateAgeDifference(dob, candidateDOB);
      if (temp) {
        ageDifference = temp;
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
          text: ageDifference
        }),
        updateButton
      )
    );
  },
  /**
  * Handles form submission
  *
  * @param {event} e - Form submission event
  */
  handleSubmit: function (e) {
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
      success: function (data) {
        self.setState({
          updateResult: "success"
        });
      },
      error: function (err) {
        if (err.responseText !== "") {
          var errorMessage = JSON.parse(err.responseText).message;
          self.setState({
            updateResult: "error",
            errorMessage: errorMessage
          });
        }
      }
    });
  },
  /**
  * Display a success/error alert message after form submission
  */
  showAlertMessage: function () {
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
  },

  /**
   * Calculates the age difference between the candidate and proband
   */
  calculateAgeDifference: function (dob, candidateDOB) {
    if (dob && candidateDOB) {
      var splitDOB = dob.split("-");
      var splitCandidateDOB = candidateDOB.split("-");

      if (splitCandidateDOB[2] < splitDOB[2]) {
        splitCandidateDOB[2] = +splitCandidateDOB[2] + 30;
        splitCandidateDOB[1]--;
      }
      if (splitCandidateDOB[1] < splitDOB[1]) {
        splitCandidateDOB[1] = +splitCandidateDOB[1] + 12;
        splitCandidateDOB[0]--;
      }

      var age = [splitCandidateDOB[0] - splitDOB[0], splitCandidateDOB[1] - splitDOB[1], splitCandidateDOB[2] - splitDOB[2]];
      if (age !== null) {
        return age[0] * 12 + age[1] + Math.round(age[2] / 30) / 100;
      }
    }
    return null;
  }

});

var RProbandInfo = React.createFactory(ProbandInfo);