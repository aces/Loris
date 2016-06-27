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

  propTypes: {
    DataURL: React.PropTypes.string.isRequired,
  },

  getInitialState: function () {
    return {
      'formData': {},
      'uploadResult': null,
      'errorMessage': null,
      'Headers':    [],
      'Data':       [],
      'isLoaded':   false,
      'loadedData': 0
    };
  },

  componentDidMount: function () {
    var that = this;
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      xhr:      function () {
        var xhr = new window.XMLHttpRequest();
        xhr.addEventListener("progress", function (evt) {
          that.setState({
            'loadedData': evt.loaded
          });
        });
        return xhr;
      },
      success:  function (data) {
        that.setState({
          'Data':     data,
          'isLoaded': true
        });
      },
      error:    function (data, error_code, error_msg) {
        console.error(error_code + ': ' + error_msg);
        that.setState({"error": "Error loading data"});
      }
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var self = this;
    var myFormData = this.state.formData;
    var formRefs = this.refs;
    var formData = new FormData();
    for (var key in myFormData) {
      formData.append(key, myFormData[key]);
    }

    var requiredFileName = myFormData['PSCID'] + "_" + myFormData['visitLabel'];
    var fileName = myFormData['file'].name;
    var isValidFileName = (fileName.indexOf(requiredFileName) > -1)

    if (!isValidFileName) {
      alert("File name should start with: " + requiredFileName);
      return;
    }

    // // Error checking
    //var hasErrors = false;
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

    $.ajax ({
      type: 'POST',
      url: loris.BaseURL + "/videos/ajax/VideoUpload.php?action=upload",
      data: formData,
      cache: false,
      contentType:false,
      processData:false,
      xhr: function() {
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            var progressbar = $("#progressbar");
            var progresslabel = $("#progresslabel");
            var percent = Math.round ((evt.loaded / evt.total) * 100);
            $(progressbar).width (percent + "%");
            $(progresslabel).html (percent + "%");
            progressbar.attr('aria-valuenow', percent);
          }
        }, false);
        return xhr;
      },
      success: function(data) {
        $("#file-progress").addClass('hide');
        self.setState({
          uploadResult: "success"
        });

        // Itterates through child components and resets state
        // to initial state in order to clear the form
        Object.keys(formRefs).map(function(ref) {
          if (formRefs[ref].state && formRefs[ref].state.value) {
            formRefs[ref].state.value = "";
          }
        });
        // rerender components
        self.forceUpdate();
      },
      error: function(err) {
        var errorMessage = JSON.parse(err.responseText).message;
        self.setState({
          uploadResult: "error",
          errorMessage: errorMessage
        });
      }

    });
  },

  setFormData: function(formElement, value) {
    var formData = this.state.formData;
    formData[formElement] = value;

    this.setState({
      formData : formData
    });
  },

  render: function() {

    if (!this.state.isLoaded) {

      if (this.state.error != undefined) {
        return (
          <div className="alert alert-danger">
            <strong>
              {this.state.error}
            </strong>
          </div>
        );
      }

      return (
        <button className="btn-info has-spinner">
          Loading <span
          className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
        </button>
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
        var errorMessage = this.state.errorMessage;
        submitClass = "alert alert-danger text-center";
        submitMessage = errorMessage ? errorMessage : "Failed to upload";
      }
    }

    return (
      <div>
        <div className={submitClass} role="alert">
          {submitMessage}
        </div>
        <FormElement
          name="videoUpload"
          action={this.props.action}
          onSubmit={this.handleSubmit}
          ref="form"
        >
          <h3>Upload Video</h3>
          <br />
          <HelpTextElement label="Note" html={true} text={helpText} />
          <SelectElement
            name="PSCID"
            label="PSCID"
            options={this.state.Data.candidates}
            onUserInput={this.setFormData}
            ref="PSCID"
            required={true}
          />
          <SelectElement
            name="visitLabel"
            label="Visit Label"
            options={this.state.Data.visits}
            onUserInput={this.setFormData}
            ref="visitLabel"
            required={true}
          />
          <SelectElement
            name="Instrument"
            label="Instrument"
            options={this.state.Data.instruments}
            onUserInput={this.setFormData}
            ref="Instrument"
          />
          <SelectElement
            name="For_site"
            label="For Site"
            options={this.state.Data.sites}
            onUserInput={this.setFormData}
            ref="For_site"
          />
          <DateElement
            name="dateTaken"
            label="Date of Administration"
            minYear="2000"
            maxYear="2017"
            onUserInput={this.setFormData}
            ref="dateTaken"
          />
          <TextareaElement
            name="comments"
            label="Comments"
            onUserInput={this.setFormData}
            ref="comments"
          />
          <FileElement
            id="videoUploadEl"
            onUserInput={this.setFormData}
            required={true}
            ref="file"
          />
          <ButtonElement label="Upload Video" />
        </FormElement>
      </div>
    )
  }
});

RVideoUploadForm = React.createFactory(VideoUploadForm);