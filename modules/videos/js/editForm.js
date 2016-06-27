/**
 * Video Upload Form
 *
 * Fetches data from Loris backend and display a form allowing
 * to upload a video attached to a specific instrument
 *
 * @author Alex Ilea
 * @version 1.0.0
 *
 * */
var VideoUploadForm = React.createClass({
  displayName: 'VideoUploadForm',


  propTypes: {
    DataURL: React.PropTypes.string.isRequired
  },

  getInitialState: function () {
    return {
      'formData': {},
      'uploadResult': null,
      'Headers': [],
      'Data': [],
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
          'idVideo': data.videoData.record_id
        };

        that.setState({
          'Data': data,
          'isLoaded': true,
          'videoData': data.videoData,
          'formData': formData
        });
      },
      error: function (data, error_code, error_msg) {
        console.error(error_code + ': ' + error_msg);
        that.setState({ "error": "Error loading data" });
      }
    });
  },

  handleSubmit: function (e) {
    e.preventDefault();

    var self = this;
    var myFormData = this.state.formData;
    var formRefs = this.refs;
    var formData = new FormData();
    var hasErrors = false;

    for (var key in myFormData) {
      formData.append(key, myFormData[key]);
    }

    // // Error checking
    // Object.keys(formRefs).map(function(ref) {
    //   if (formRefs[ref].state && formRefs[ref].state.value == "") {
    //     formRefs[ref].state.hasError = true;
    //     hasErrors = true;
    //   }
    // });
    // this.forceUpdate();
    // if (hasErrors) { return; }

    $('#videoUploadEl').hide();
    $("#file-progress").removeClass('hide');

    $.ajax({
      type: 'POST',
      url: loris.BaseURL + "/videos/ajax/VideoUpload.php?action=edit",
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

        // Itterates through child components and resets state
        // to initial state in order to clear the form
        // Object.keys(formRefs).map(function(ref) {
        //   if (formRefs[ref].state && formRefs[ref].state.value) {
        //     formRefs[ref].state.value = "";
        //   }
        // });
        // // rerender components
        // self.forceUpdate();
      },
      error: function (err) {
        console.error(err);
        self.setState({
          uploadResult: "error"
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

  render: function () {

    if (!this.state.isLoaded) {

      if (this.state.error != undefined) {
        return React.createElement(
          'div',
          { className: 'alert alert-danger' },
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
        'Loading ',
        React.createElement('span', {
          className: 'glyphicon glyphicon-refresh glyphicon-refresh-animate' })
      );
    }

    var submitMessage = "";
    var submitClass = "alert text-center hide";

    if (this.state.uploadResult) {

      if (this.state.uploadResult == "success") {
        submitClass = "alert alert-success text-center";
        submitMessage = "Update Successful!";
      } else if (this.state.uploadResult == "error") {
        submitClass = "alert alert-danger text-center";
        submitMessage = "Failed to update the video";
      }
    }

    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: submitClass, role: 'alert' },
        submitMessage
      ),
      React.createElement(
        FormElement,
        {
          name: 'videoUpload',
          action: this.props.action,
          onSubmit: this.handleSubmit,
          ref: 'form'
        },
        React.createElement(
          'h3',
          null,
          'Edit Video'
        ),
        React.createElement('br', null),
        React.createElement(SelectElement, {
          name: 'PSCID',
          label: 'PSCID',
          options: this.state.Data.candidates,
          onUserInput: this.setFormData,
          ref: 'PSCID',
          required: true,
          disabled: true,
          value: this.state.videoData.PSCID
        }),
        React.createElement(SelectElement, {
          name: 'visitLabel',
          label: 'Visit Label',
          options: this.state.Data.visits,
          onUserInput: this.setFormData,
          ref: 'visitLabel',
          required: true,
          disabled: true,
          value: this.state.videoData.visitLabel
        }),
        React.createElement(SelectElement, {
          name: 'Instrument',
          label: 'Instrument',
          options: this.state.Data.instruments,
          onUserInput: this.setFormData,
          ref: 'Instrument',
          disabled: true,
          value: this.state.videoData.Instrument
        }),
        React.createElement(SelectElement, {
          name: 'For_site',
          label: 'For Site',
          options: this.state.Data.sites,
          onUserInput: this.setFormData,
          ref: 'For_site',
          value: this.state.videoData.For_site
        }),
        React.createElement(DateElement, {
          name: 'dateTaken',
          label: 'Date of Administration',
          minYear: '2000',
          maxYear: '2017',
          onUserInput: this.setFormData,
          ref: 'dateTaken',
          value: this.state.videoData.Date_taken
        }),
        React.createElement(TextareaElement, {
          name: 'comments',
          label: 'Comments',
          onUserInput: this.setFormData,
          ref: 'comments',
          value: this.state.videoData.comments
        }),
        React.createElement(FileElement, {
          id: 'videoUploadEl',
          onUserInput: this.setFormData,
          required: true,
          disabled: true,
          ref: 'file',
          value: this.state.videoData.File_name
        }),
        React.createElement(ButtonElement, { label: 'Update Video' })
      )
    );
  }
});

RVideoUploadForm = React.createFactory(VideoUploadForm);
