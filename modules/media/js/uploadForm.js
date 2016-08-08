/**
 * Media Upload Form
 *
 * Fetches data from Loris backend and displays a form allowing
 * to upload a media file attached to a specific instrument
 *
 * @author Alex Ilea
 * @version 1.0.0
 *
 * */
var MediaUploadForm = React.createClass({
  displayName: 'MediaUploadForm',


  propTypes: {
    DataURL: React.PropTypes.string.isRequired,
    action: React.PropTypes.string.isRequired
  },

  getInitialState: function () {
    return {
      'Data': [],
      'formData': {},
      'uploadResult': null,
      'errorMessage': null,
      'isLoaded': false,
      'loadedData': 0
    };
  },

  componentDidMount: function () {
    var that = this;
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      xhr: function () {
        var xhr = new window.XMLHttpRequest();
        xhr.addEventListener("progress", function (evt) {
          that.setState({
            'loadedData': evt.loaded
          });
        });
        return xhr;
      },
      success: function (data) {
        that.setState({
          'Data': data,
          'isLoaded': true
        });
      },
      error: function (data, error_code, error_msg) {
        that.setState({
          'error': 'An error occured when loading the form!'
        });
      }
    });
  },

  render: function () {

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

    var helpText = "File name should begin with<b> [PSCID]_[Visit Label]_[Instrument]</b><br> For example, for candidate <i>ABC123</i>, visit <i>V1</i> for <i>Body Mass Index</i> the file name should be prefixed by: <b>ABC123_V1_Body_Mass_Index</b>";
    var alertMessage = "";
    var alertClass = "alert text-center hide";

    if (this.state.uploadResult) {
      if (this.state.uploadResult == "success") {
        alertClass = "alert alert-success text-center";
        alertMessage = "Upload Successful!";
      } else if (this.state.uploadResult == "error") {
        var errorMessage = this.state.errorMessage;
        alertClass = "alert alert-danger text-center";
        alertMessage = errorMessage ? errorMessage : "Failed to upload!";
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
        {
          name: 'mediaUpload',
          onSubmit: this.handleSubmit,
          ref: 'form'
        },
        React.createElement(
          'h3',
          null,
          'Upload a media file'
        ),
        React.createElement('br', null),
        React.createElement(HelpTextElement, { label: 'Note', html: true, text: helpText }),
        React.createElement(SelectElement, {
          name: 'pscid',
          label: 'PSCID',
          options: this.state.Data.candidates,
          onUserInput: this.setFormData,
          ref: 'pscid',
          hasError: false,
          required: true
        }),
        React.createElement(SelectElement, {
          name: 'visit_label',
          label: 'Visit Label',
          options: this.state.Data.visits,
          onUserInput: this.setFormData,
          ref: 'visit_label',
          required: true
        }),
        React.createElement(SelectElement, {
<<<<<<< HEAD
          name: 'instrument',
          label: 'Instrument',
          options: this.state.Data.instruments,
          onUserInput: this.setFormData,
          ref: 'instrument',
          required: true
        }),
        React.createElement(SelectElement, {
          name: 'for_site',
          label: 'For Site',
          options: this.state.Data.sites,
          onUserInput: this.setFormData,
          ref: 'for_site'
=======
          name: 'for_site',
          label: 'Site',
          options: this.state.Data.sites,
          onUserInput: this.setFormData,
          ref: 'for_site',
          required: true
        }),
        React.createElement(SelectElement, {
          name: 'instrument',
          label: 'Instrument',
          options: this.state.Data.instruments,
          onUserInput: this.setFormData,
          ref: 'instrument'
>>>>>>> aces/17.0-dev
        }),
        React.createElement(DateElement, {
          name: 'date_taken',
          label: 'Date of Administration',
          minYear: '2000',
          maxYear: '2017',
          onUserInput: this.setFormData,
          ref: 'date_taken'
        }),
        React.createElement(TextareaElement, {
          name: 'comments',
          label: 'Comments',
          onUserInput: this.setFormData,
          ref: 'comments'
        }),
        React.createElement(FileElement, {
          id: 'mediaUploadEl',
          onUserInput: this.setFormData,
          ref: 'file',
          label: 'File to upload',
          required: true
        }),
        React.createElement(ButtonElement, { label: 'Upload File' })
      )
    );
  },

  /*********************************************************************************
  *                      ******     Helper methods     *******
  *********************************************************************************/

  /**
   * Returns a valid name for the file to be uploaded
   *
   * @param pscid
   * @param visitLabel
   * @param instrument
   * @returns {string}
   */
  getValidFileName: function (pscid, visitLabel, instrument) {
    var fileName = pscid + "_" + visitLabel;
    if (instrument) fileName += "_" + instrument;

    return fileName;
  },

  /**
   * Handles form submission
   * @param e
   */
  handleSubmit: function (e) {
    e.preventDefault();

    var myFormData = this.state.formData;
    var formRefs = this.refs;

    // Validate the form
    if (!this.isValidForm(formRefs, myFormData)) {
      return;
    }

    // Validate uploaded file name
    var instrument = myFormData['instrument'] ? myFormData['instrument'] : null;
    var fileName = myFormData['file'] ? myFormData['file'].name : null;
    var requiredFileName = this.getValidFileName(myFormData['pscid'], myFormData['visit_label'], instrument);

    if (!this.isValidFileName(requiredFileName, fileName)) {
      alert("File name should start with: " + requiredFileName);
      return;
    }

    // Set form data and upload the media file
    var self = this;
    var formData = new FormData();
    for (var key in myFormData) {
      if (myFormData[key] != "") {
        formData.append(key, myFormData[key]);
      }
    }

    $('#mediaUploadEl').hide();
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
<<<<<<< HEAD
          uploadResult: "success"
=======
          uploadResult: "success",
          formData: {} // reset form data after successful file upload
>>>>>>> aces/17.0-dev
        });

        // Trigger an update event to update all observers (i.e DataTable)
        $(document).trigger('update');

        self.showAlertMessage();

        // Itterates through child components and resets state
        // to initial state in order to clear the form
        Object.keys(formRefs).map(function (ref) {
          if (formRefs[ref].state && formRefs[ref].state.value) {
            formRefs[ref].state.value = "";
          }
        });
        // rerender components
        self.forceUpdate();
      },
      error: function (err) {
        var errorMessage = JSON.parse(err.responseText).message;
        self.setState({
          uploadResult: "error",
          errorMessage: errorMessage
        });
        self.showAlertMessage();
      }

    });
  },

  /**
   * Checks if the inputted file name is valid
   *
   * @param requiredFileName
   * @param fileName
   * @returns {boolean}
   */
  isValidFileName: function (requiredFileName, fileName) {
    if (fileName == null || requiredFileName == null) {
      return false;
    }

    return fileName.indexOf(requiredFileName) > -1;
  },

  /**
   * Validates the form
   *
   * @param formRefs
   * @param formData
   * @returns {boolean}
   */
  isValidForm: function (formRefs, formData) {

    var isValidForm = true;
    var requiredFields = {
      'pscid': null,
      'visit_label': null,
      'file': null
    };

    Object.keys(requiredFields).map(function (field) {
      if (formData[field]) {
        requiredFields[field] = formData[field];
      } else {
        if (formRefs[field]) {
          formRefs[field].props.hasError = true;
          isValidForm = false;
        }
      }
    });
    this.forceUpdate();

    return isValidForm;
  },

  /**
   * Sets the form data based on state values of child elements/componenets
   *
   * @param formElement
   * @param value
   */
  setFormData: function (formElement, value) {
<<<<<<< HEAD
=======

    // Only display visits and sites available for the current pscid
    if (formElement === "pscid") {
      this.state.Data.visits = this.state.Data.sessionData[value].visits;
      this.state.Data.sites = this.state.Data.sessionData[value].sites;
    }

>>>>>>> aces/17.0-dev
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

    if (this.refs["alert-message"] == null) {
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

<<<<<<< HEAD
RMediaUploadForm = React.createFactory(MediaUploadForm);
=======
RMediaUploadForm = React.createFactory(MediaUploadForm);
>>>>>>> aces/17.0-dev
