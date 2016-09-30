/* exported RMediaEditForm */

/**
 * Media Edit Form
 *
 * Fetches data corresponding to a given file from Loris backend and
 * displays a form allowing meta information of the media file
 *
 * @author Alex Ilea
 * @version 1.0.0
 *
 * */
var MediaEditForm = React.createClass({
  displayName: 'MediaEditForm',


  propTypes: {
    DataURL: React.PropTypes.string.isRequired,
    action: React.PropTypes.string.isRequired
  },

  getInitialState: function () {
    return {
      Data: {},
      formData: {},
      uploadResult: null,
      isLoaded: false,
      loadedData: 0
    };
  },

  componentDidMount: function () {
    var self = this;
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      success: function (data) {
        var formData = {
          idMediaFile: data.mediaData.id,
          forSite: data.mediaData.forSite,
          dateTaken: data.mediaData.dateTaken,
          comments: data.mediaData.comments,
          hideFile: data.mediaData.hideFile
        };

        self.setState({
          Data: data,
          isLoaded: true,
          mediaData: data.mediaData,
          formData: formData
        });
      },
      error: function (error, errorCode, errorMsg) {
        console.error(error, errorCode, errorMsg);
        self.setState({
          error: 'An error occurred when loading the form!'
        });
      }
    });
  },

  render: function () {
    // Data loading error
    if (this.state.error !== undefined) {
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

    // Waiting for data to load
    if (!this.state.isLoaded) {
      return React.createElement(
        'button',
        { className: 'btn-info has-spinner' },
        'Loading',
        React.createElement('span', {
          className: 'glyphicon glyphicon-refresh glyphicon-refresh-animate' })
      );
    }

    var alertMessage = "";
    var alertClass = "alert text-center hide";
    var backURL = loris.BaseURL.concat('/media/');

    if (this.state.uploadResult) {
      if (this.state.uploadResult === "success") {
        alertClass = "alert alert-success text-center";
        alertMessage = "Update Successful!";
      } else if (this.state.uploadResult === "error") {
        alertClass = "alert alert-danger text-center";
        alertMessage = "Failed to update the file";
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
      this.state.uploadResult === "success" ? React.createElement(
        'a',
        { className: 'btn btn-primary', href: backURL },
        'Back to media'
      ) : null,
      React.createElement(
        FormElement,
        {
          name: 'mediaEdit',
          onSubmit: this.handleSubmit,
          ref: 'form'
        },
        React.createElement(
          'h3',
          null,
          'Edit Media File'
        ),
        React.createElement('br', null),
        React.createElement(SelectElement, {
          name: 'pscid',
          label: 'PSCID',
          options: this.state.Data.candidates,
          onUserInput: this.setFormData,
          ref: 'pscid',
          required: true,
          disabled: true,
          value: this.state.mediaData.pscid
        }),
        React.createElement(SelectElement, {
          name: 'visitLabel',
          label: 'Visit Label',
          options: this.state.Data.visits,
          onUserInput: this.setFormData,
          ref: 'visitLabel',
          required: true,
          disabled: true,
          value: this.state.mediaData.visitLabel
        }),
        React.createElement(SelectElement, {
          name: 'forSite',
          label: 'Site',
          options: this.state.Data.sites,
          onUserInput: this.setFormData,
          ref: 'forSite',
          disabled: true,
          value: this.state.mediaData.forSite
        }),
        React.createElement(SelectElement, {
          name: 'instrument',
          label: 'Instrument',
          options: this.state.Data.instruments,
          onUserInput: this.setFormData,
          ref: 'instrument',
          disabled: true,
          value: this.state.mediaData.instrument
        }),
        React.createElement(DateElement, {
          name: 'dateTaken',
          label: 'Date of Administration',
          minYear: '2000',
          maxYear: '2017',
          onUserInput: this.setFormData,
          ref: 'dateTaken',
          value: this.state.mediaData.dateTaken
        }),
        React.createElement(TextareaElement, {
          name: 'comments',
          label: 'Comments',
          onUserInput: this.setFormData,
          ref: 'comments',
          value: this.state.mediaData.comments
        }),
        React.createElement(FileElement, {
          name: 'file',
          id: 'mediaEditEl',
          onUserInput: this.setFormData,
          required: true,
          disabled: true,
          ref: 'file',
          label: 'Uploaded file',
          value: this.state.mediaData.fileName
        }),
        React.createElement(SelectElement, {
          name: 'hideFile',
          label: 'Hide File',
          emptyOption: false,
          options: ["No", "Yes"],
          onUserInput: this.setFormData,
          ref: 'hideFile',
          value: this.state.mediaData.hideFile
        }),
        React.createElement(ButtonElement, { label: 'Update File' })
      )
    );
  },

  /**
   * Handles form submission
   * @param {event} e - Form submition event
   */
  handleSubmit: function (e) {
    e.preventDefault();

    var self = this;
    var myFormData = this.state.formData;
    var formData = new FormData();

    for (var key in myFormData) {
      if (myFormData[key] !== "") {
        formData.append(key, myFormData[key]);
      }
    }

    $('#mediaEditEl').hide();
    $("#file-progress").removeClass('hide');

    $.ajax({
      type: 'POST',
      url: self.props.action,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      xhr: function () {
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function (evt) {
          if (evt.lengthComputable) {
            var progressbar = $("#progressbar");
            var progresslabel = $("#progresslabel");
            var percent = Math.round(evt.loaded / evt.total * 100);
            $(progressbar).width(percent + "%");
            $(progresslabel).html(percent + "%");
            progressbar.attr('aria-valuenow', percent);
          }
        }, false);
        return xhr;
      },
      success: function (data) {
        $("#file-progress").addClass('hide');
        self.setState({
          uploadResult: "success"
        });
        self.showAlertMessage();
      },
      error: function (err) {
        console.error(err);
        self.setState({
          uploadResult: "error"
        });
        self.showAlertMessage();
      }

    });
  },

  /**
   * Set the form data based on state values of child elements/componenets
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setFormData: function (formElement, value) {
    var formData = this.state.formData;
    formData[formElement] = value;

    this.setState({
      formData: formData
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
        uploadResult: null
      });
    });
  }

});

var RMediaEditForm = React.createFactory(MediaEditForm);