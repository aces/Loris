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
      'Data': [],
      'formData': {},
      'uploadResult': null,
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

        var formData = {
          'idMediaFile': data.mediaData.id,
          'for_site': data.mediaData.for_site,
          'date_taken': data.mediaData.date_taken,
          'comments': data.mediaData.comments,
          'hide_file': data.mediaData.hide_file
        };

        that.setState({
          'Data': data,
          'isLoaded': true,
          'mediaData': data.mediaData,
          'formData': formData
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

    var alertMessage = "";
    var alertClass = "alert text-center hide";

    if (this.state.uploadResult) {
      if (this.state.uploadResult == "success") {
        alertClass = "alert alert-success text-center";
        alertMessage = "Update Successful!";
      } else if (this.state.uploadResult == "error") {
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
      this.state.uploadResult == "success" ? React.createElement(
        'a',
        { className: 'btn btn-primary', href: '/media/' },
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
          name: 'visit_label',
          label: 'Visit Label',
          options: this.state.Data.visits,
          onUserInput: this.setFormData,
          ref: 'visit_label',
          required: true,
          disabled: true,
          value: this.state.mediaData.visit_label
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
        React.createElement(SelectElement, {
          name: 'for_site',
          label: 'For Site',
          options: this.state.Data.sites,
          onUserInput: this.setFormData,
          ref: 'for_site',
          value: this.state.mediaData.for_site
        }),
        React.createElement(DateElement, {
          name: 'date_taken',
          label: 'Date of Administration',
          minYear: '2000',
          maxYear: '2017',
          onUserInput: this.setFormData,
          ref: 'date_taken',
          value: this.state.mediaData.date_taken
        }),
        React.createElement(TextareaElement, {
          name: 'comments',
          label: 'Comments',
          onUserInput: this.setFormData,
          ref: 'comments',
          value: this.state.mediaData.comments
        }),
        React.createElement(FileElement, {
          id: 'mediaEditEl',
          onUserInput: this.setFormData,
          required: true,
          disabled: true,
          ref: 'file',
          label: 'Uploaded file',
          value: this.state.mediaData.file_name
        }),
        React.createElement(SelectElement, {
          name: 'hide_file',
          label: 'Hide File',
          emptyOption: false,
          options: ["No", "Yes"],
          onUserInput: this.setFormData,
          ref: 'hide_file',
          value: this.state.mediaData.hide_file
        }),
        React.createElement(ButtonElement, { label: 'Update File' })
      )
    );
  },

  /**
   * Handles form submission
   * @param e
   */
  handleSubmit: function (e) {
    e.preventDefault();

    var self = this;
    var myFormData = this.state.formData;
    var formRefs = this.refs;
    var formData = new FormData();
    var hasErrors = false;

    for (var key in myFormData) {
      if (myFormData[key] != "") {
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
   * Sets the form data based on state values of child elements/componenets
   *
   * @param formElement
   * @param value
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

RMediaEditForm = React.createFactory(MediaEditForm);
