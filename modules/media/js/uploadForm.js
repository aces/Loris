'use strict';

/* exported RMediaUploadForm */

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

  getInitialState: function getInitialState() {
    return {
      Data: {},
      formData: {},
      uploadResult: null,
      errorMessage: null,
      isLoaded: false,
      loadedData: 0
    };
  },

  componentDidMount: function componentDidMount() {
    var self = this;
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      success: function success(data) {
        self.setState({
          Data: data,
          isLoaded: true
        });
      },
      error: function error(data, errorCode, errorMsg) {
        console.error(data, errorCode, errorMsg);
        self.setState({
          error: 'An error occurred when loading the form!'
        });
      }
    });
  },

  render: function render() {
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

    var helpText = ["File name should begin with ", React.createElement(
      'b',
      null,
      '[PSCID]_[Visit Label]_[Instrument]'
    ), React.createElement('br', null), " For example, for candidate ", React.createElement(
      'i',
      null,
      'ABC123'
    ), ", visit ", React.createElement(
      'i',
      null,
      'V1'
    ), " for ", React.createElement(
      'i',
      null,
      'Body Mass Index'
    ), " the file name should be prefixed by: ", React.createElement(
      'b',
      null,
      'ABC123_V1_Body_Mass_Index'
    )];
    var alertMessage = "";
    var alertClass = "alert text-center hide";

    if (this.state.uploadResult) {
      if (this.state.uploadResult === "success") {
        alertClass = "alert alert-success text-center";
        alertMessage = "Upload Successful!";
      } else if (this.state.uploadResult === "error") {
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
          fileUpload: true,
          onSubmit: this.handleSubmit,
          ref: 'form'
        },
        React.createElement(
          'h3',
          null,
          'Upload a media file'
        ),
        React.createElement('br', null),
        React.createElement(StaticElement, {
          label: 'Note',
          text: helpText
        }),
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
          name: 'visitLabel',
          label: 'Visit Label',
          options: this.state.Data.visits,
          onUserInput: this.setFormData,
          ref: 'visitLabel',
          required: true
        }),
        React.createElement(SelectElement, {
          name: 'forSite',
          label: 'Site',
          options: this.state.Data.sites,
          onUserInput: this.setFormData,
          ref: 'forSite',
          required: true
        }),
        React.createElement(SelectElement, {
          name: 'instrument',
          label: 'Instrument',
          options: this.state.Data.instruments,
          onUserInput: this.setFormData,
          ref: 'instrument'
        }),
        React.createElement(DateElement, {
          name: 'dateTaken',
          label: 'Date of Administration',
          minYear: '2000',
          maxYear: '2017',
          onUserInput: this.setFormData,
          ref: 'dateTaken'
        }),
        React.createElement(TextareaElement, {
          name: 'comments',
          label: 'Comments',
          onUserInput: this.setFormData,
          ref: 'comments'
        }),
        React.createElement(FileElement, {
          name: 'file',
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

  /** *******************************************************************************
  *                      ******     Helper methods     *******
  *********************************************************************************/

  /**
   * Returns a valid name for the file to be uploaded
   *
   * @param {string} pscid - PSCID selected from the dropdown
   * @param {string} visitLabel - Visit label selected from the dropdown
   * @param {string} instrument - Instrument selected from the dropdown
   * @return {string} - Generated valid filename for the current selection
   */
  getValidFileName: function getValidFileName(pscid, visitLabel, instrument) {
    var fileName = pscid + "_" + visitLabel;
    if (instrument) fileName += "_" + instrument;

    return fileName;
  },

  /**
   * Handle form submission
   * @param {object} e - Form submission event
   */
  handleSubmit: function handleSubmit(e) {
    e.preventDefault();

    var myFormData = this.state.formData;
    var formRefs = this.refs;
    var mediaFiles = this.state.Data.mediaFiles ? this.state.Data.mediaFiles : [];

    // Validate the form
    if (!this.isValidForm(formRefs, myFormData)) {
      return;
    }

    // Validate uploaded file name
    var instrument = myFormData.instrument ? myFormData.instrument : null;
    var fileName = myFormData.file ? myFormData.file.name : null;
    var requiredFileName = this.getValidFileName(myFormData.pscid, myFormData.visitLabel, instrument);
    if (!this.isValidFileName(requiredFileName, fileName)) {
      alert("File name should begin with: " + requiredFileName);
      return;
    }

    // Check for duplicate file names
    var isDuplicate = mediaFiles.indexOf(myFormData.file.name);
    if (isDuplicate >= 0) {
      var confirmed = confirm("A file with this name already exists!\n" + "Would you like to override existing file?");
      if (!confirmed) return;
    }

    // Set form data and upload the media file
    var self = this;
    var formData = new FormData();
    for (var key in myFormData) {
      if (myFormData[key] !== "") {
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
      xhr: function xhr() {
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
      success: function success(data) {
        $("#file-progress").addClass('hide');

        // Add file to the list of exiting files
        var mediaFiles = self.state.Data.mediaFiles;
        mediaFiles.push(myFormData.file.name);

        self.setState({
          mediaFiles: mediaFiles,
          uploadResult: "success",
          formData: {} // reset form data after successful file upload
        });

        // Trigger an update event to update all observers (i.e DataTable)
        var event = new CustomEvent('update-datatable');
        window.dispatchEvent(event);

        self.showAlertMessage();

        // Iterates through child components and resets state
        // to initial state in order to clear the form
        Object.keys(formRefs).map(function (ref) {
          if (formRefs[ref].state && formRefs[ref].state.value) {
            formRefs[ref].state.value = "";
          }
        });
        // rerender components
        self.forceUpdate();
      },
      error: function error(err) {
        console.error(err);
        var msg = err.responseJSON ? err.responseJSON.message : "Upload error!";
        self.setState({
          uploadResult: "error",
          errorMessage: msg
        });
        self.showAlertMessage();
      }

    });
  },

  /**
   * Checks if the inputted file name is valid
   *
   * @param {string} requiredFileName - Required file name
   * @param {string} fileName - Provided file name
   * @return {boolean} - true if fileName starts with requiredFileName, false otherwise
   */
  isValidFileName: function isValidFileName(requiredFileName, fileName) {
    if (fileName === null || requiredFileName === null) {
      return false;
    }

    return fileName.indexOf(requiredFileName) === 0;
  },

  /**
   * Validate the form
   *
   * @param {object} formRefs - Object containing references to React form elements
   * @param {object} formData - Object containing form data inputed by user
   * @return {boolean} - true if all required fields are filled, false otherwise
   */
  isValidForm: function isValidForm(formRefs, formData) {
    var isValidForm = true;

    var requiredFields = {
      pscid: null,
      visitLabel: null,
      file: null
    };

    Object.keys(requiredFields).map(function (field) {
      if (formData[field]) {
        requiredFields[field] = formData[field];
      } else if (formRefs[field]) {
        formRefs[field].props.hasError = true;
        isValidForm = false;
      }
    });
    this.forceUpdate();

    return isValidForm;
  },

  /**
   * Set the form data based on state values of child elements/componenets
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setFormData: function setFormData(formElement, value) {
    // Only display visits and sites available for the current pscid
    if (formElement === "pscid" && value !== "") {
      this.state.Data.visits = this.state.Data.sessionData[value].visits;
      this.state.Data.sites = this.state.Data.sessionData[value].sites;
    }

    var formData = this.state.formData;
    formData[formElement] = value;

    this.setState({
      formData: formData
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
        uploadResult: null
      });
    });
  }

});

var RMediaUploadForm = React.createFactory(MediaUploadForm);