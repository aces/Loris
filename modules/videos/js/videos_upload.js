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
      'formData': {
        'PSCID': '',
        'visitLabel': '',
        'Instrument': '',
        'For_site': '',
        'dateTaken': '',
        'comments': ''
      },
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
        that.setState({
          'Data': data,
          'isLoaded': true
        });
      },
      error: function (data, error_code, error_msg) {
        console.error(error_code + ': ' + error_msg);
        that.setState({ "error": "Error loading data" });
      }
    });
  },

  handleSubmit: function (e) {

    var self = this;

    $('#videoUploadEl').hide();
    $("#file-progress").removeClass('hide');
    e.preventDefault();
    var myFormData = this.state.formData;
    var formData = new FormData();
    for (var key in myFormData) {
      formData.append(key, myFormData[key]);
    }

    $.ajax({
      type: 'POST',
      url: loris.BaseURL + "/videos/ajax/VideoUpload.php?action=upload",
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

    var helpText = "File name should begin with<b> [PSCID]_[CandID]_[Visit Label]_[Instrument]</b><br> For example, for candidate <i>9990000</i>, visit <i>V1</i> for <i>Biosample Collection</i> the file name should be prefixed by: <b>9990000_CandID_V1_Biosample_Collection</b>";
    var submitMessage = "";
    var submitClass = "alert text-center hide";

    if (this.state.uploadResult) {

      if (this.state.uploadResult == "success") {
        submitClass = "alert alert-success text-center";
        submitMessage = "Upload Successful!";
      } else if (this.state.uploadResult == "error") {
        submitClass = "alert alert-danger text-center";
        submitMessage = "Failed to upload";
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
          onSubmit: this.handleSubmit
        },
        React.createElement(
          'h3',
          null,
          'Upload Video'
        ),
        React.createElement('br', null),
        React.createElement(HelpTextElement, { label: 'Note', html: true, text: helpText }),
        React.createElement(SelectElement, {
          name: 'PSCID',
          label: 'PSCID',
          options: this.state.Data.candidates,
          onUserInput: this.setFormData
        }),
        React.createElement(SelectElement, {
          name: 'visitLabel',
          label: 'Visit Label',
          options: this.state.Data.visits,
          onUserInput: this.setFormData
        }),
        React.createElement(SelectElement, {
          name: 'Instrument',
          label: 'Instrument',
          options: this.state.Data.instruments,
          onUserInput: this.setFormData
        }),
        React.createElement(SelectElement, {
          name: 'For_site',
          label: 'For Site',
          options: this.state.Data.sites,
          onUserInput: this.setFormData
        }),
        React.createElement(DateElement, {
          name: 'dateTaken',
          label: 'Date of Administration',
          minYear: '2000',
          maxYear: '2017',
          onUserInput: this.setFormData
        }),
        React.createElement(TextareaElement, {
          name: 'comments',
          label: 'Comments (optional)',
          onUserInput: this.setFormData
        }),
        React.createElement(FileElement, { id: 'videoUploadEl', onUserInput: this.setFormData }),
        React.createElement(ButtonElement, null)
      )
    );
  }
});

RVideoUploadForm = React.createFactory(VideoUploadForm);
//# sourceMappingURL=videos_upload.js.map