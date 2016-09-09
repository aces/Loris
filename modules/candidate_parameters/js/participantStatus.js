'use strict';

var CollapsibleHistory = React.createClass({
  displayName: 'CollapsibleHistory',


  getInitialState: function getInitialState() {
    return { 'collapsed': true };
  },
  toggleCollapsed: function toggleCollapsed() {
    this.setState({ 'collapsed': !this.state.collapsed });
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'row form-group' },
      React.createElement(
        'div',
        { id: 'comment-history' },
        React.createElement(
          'div',
          { className: 'col-sm-12' },
          React.createElement('div', { dangerouslySetInnerHTML: { __html: this.props.text } })
        )
      )
    );
  }
});

var ParticipantStatus = React.createClass({
  displayName: 'ParticipantStatus',


  getInitialState: function getInitialState() {
    return {
      'Data': [],
      'formData': {},
      'updateResult': null,
      'errorMessage': null,
      'isLoaded': false,
      'loadedData': 0
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
            'loadedData': evt.loaded
          });
        });
        return xhr;
      },
      success: function success(data) {
        that.setState({
          'Data': data,
          'isLoaded': true
        });
      },
      error: function error(data, error_code, error_msg) {
        that.setState({
          'error': 'An error occurred when loading the form!'
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
      if (this.state.error != undefined) {
        return React.createElement(
          'div',
          { className: 'alert alert-danger text-center' },
          React.createElement(
            'strong',
            null,
            this.state.error
          )
        );
      }

      return React.createElement(
        'button',
        { className: 'btn-info has-spinner' },
        'Loading',
        React.createElement('span', { className: 'glyphicon glyphicon-refresh glyphicon-refresh-animate' })
      );
    }

    var disabled = true;
    var updateButton = null;
    if (loris.userHasPermission('candidate_parameter_edit')) {
      disabled = false;
      updateButton = React.createElement(ButtonElement, { label: 'Update' });
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
      suboptionsSelect = React.createElement(SelectElement, {
        label: 'Specify Reason',
        name: 'participant_suboptions',
        options: subOptions,
        value: this.state.Data.participant_suboptions,
        onUserInput: this.setFormData,
        ref: 'participant_suboptions',
        disabled: false,
        required: suboptionsRequired
      });
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

    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: alertClass, role: 'alert', ref: 'alert-message' },
        alertMessage
      ),
      React.createElement(
        FormElement,
        { name: 'participantStatus', onSubmit: this.handleSubmit, ref: 'form', 'class': 'col-md-6' },
        React.createElement(StaticElement, {
          label: 'PSCID',
          text: this.state.Data.pscid
        }),
        React.createElement(StaticElement, {
          label: 'DCCID',
          text: this.state.Data.candID
        }),
        React.createElement(SelectElement, {
          label: 'Participant Status',
          name: 'participant_status',
          options: this.state.Data.statusOptions,
          value: this.state.Data.participant_status,
          onUserInput: this.setFormData,
          ref: 'participant_status',
          disabled: disabled,
          required: true
        }),
        suboptionsSelect,
        React.createElement(TextareaElement, {
          label: 'Comments',
          name: 'reason_specify',
          value: this.state.Data.reason_specify,
          onUserInput: this.setFormData,
          ref: 'reason_specify',
          disabled: disabled,
          required: false
        }),
        updateButton,
        React.createElement(
          'div',
          { 'class': 'col-sm-6' },
          React.createElement(
            'div',
            { 'class': 'row' },
            React.createElement(CollapsibleHistory, {
              text: this.state.Data.history
            })
          )
        )
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

    if (this.refs["alert-message"] == null) {
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

var RParticipantStatus = React.createFactory(ParticipantStatus);