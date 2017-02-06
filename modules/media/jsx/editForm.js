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
class MediaEditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Data: {},
      formData: {},
      uploadResult: null,
      isLoaded: false,
      loadedData: 0
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.showAlertMessage = this.showAlertMessage.bind(this);
  }

  componentDidMount() {
    var self = this;
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      success: function(data) {
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
      error: function(error, errorCode, errorMsg) {
        console.error(error, errorCode, errorMsg);
        self.setState({
          error: 'An error occurred when loading the form!'
        });
      }
    });
  }

  render() {
    // Data loading error
    if (this.state.error !== undefined) {
      return (
        <div className="alert alert-danger text-center">
          <strong>
            {this.state.error}
          </strong>
        </div>
      );
    }

    // Waiting for data to load
    if (!this.state.isLoaded) {
      return (
        <button className="btn-info has-spinner">
          Loading
          <span
            className="glyphicon glyphicon-refresh glyphicon-refresh-animate">
          </span>
        </button>
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

    return (
      <div>
        <div className={alertClass} role="alert" ref="alert-message">
          {alertMessage}
        </div>
        {
          this.state.uploadResult === "success" ?
          <a className="btn btn-primary" href={backURL}>Back to media</a> :
          null
        }
        <FormElement
          name="mediaEdit"
          onSubmit={this.handleSubmit}
          ref="form"
        >
          <h3>Edit Media File</h3>
          <br />
          <SelectElement
            name="pscid"
            label="PSCID"
            options={this.state.Data.candidates}
            onUserInput={this.setFormData}
            ref="pscid"
            required={true}
            disabled={true}
            value={this.state.mediaData.pscid}
          />
          <SelectElement
            name="visitLabel"
            label="Visit Label"
            options={this.state.Data.visits}
            onUserInput={this.setFormData}
            ref="visitLabel"
            required={true}
            disabled={true}
            value={this.state.mediaData.visitLabel}
          />
          <SelectElement
            name="forSite"
            label="Site"
            options={this.state.Data.sites}
            onUserInput={this.setFormData}
            ref="forSite"
            disabled={true}
            value={this.state.mediaData.forSite}
          />
          <SelectElement
            name="instrument"
            label="Instrument"
            options={this.state.Data.instruments}
            onUserInput={this.setFormData}
            ref="instrument"
            disabled={true}
            value={this.state.mediaData.instrument}
          />
          <DateElement
            name="dateTaken"
            label="Date of Administration"
            minYear="2000"
            maxYear="2017"
            onUserInput={this.setFormData}
            ref="dateTaken"
            value={this.state.formData.dateTaken}
          />
          <TextareaElement
            name="comments"
            label="Comments"
            onUserInput={this.setFormData}
            ref="comments"
            value={this.state.formData.comments}
          />
          <FileElement
            name="file"
            id="mediaEditEl"
            onUserInput={this.setFormData}
            required={true}
            disabled={true}
            ref="file"
            label="Uploaded file"
            value={this.state.mediaData.fileName}
          />
          <SelectElement
            name="hideFile"
            label="Hide File"
            emptyOption={false}
            options={["No", "Yes"]}
            onUserInput={this.setFormData}
            ref="hideFile"
            value={this.state.formData.hideFile}
          />
          <ButtonElement label="Update File"/>
        </FormElement>
      </div>
    );
  }

  /**
   * Handles form submission
   * @param {event} e - Form submition event
   */
  handleSubmit(e) {
    e.preventDefault();

    var self = this;
    var myFormData = this.state.formData;

    $('#mediaEditEl').hide();
    $("#file-progress").removeClass('hide');

    $.ajax({
      type: 'POST',
      url: self.props.action,
      data: JSON.stringify(myFormData),
      cache: false,
      contentType: false,
      processData: false,
      xhr: function() {
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            var progressbar = $("#progressbar");
            var progresslabel = $("#progresslabel");
            var percent = Math.round((evt.loaded / evt.total) * 100);
            $(progressbar).width(percent + "%");
            $(progresslabel).html(percent + "%");
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
        self.showAlertMessage();
      },
      error: function(err) {
        console.error(err);
        self.setState({
          uploadResult: "error"
        });
        self.showAlertMessage();
      }

    });
  }

  /**
   * Set the form data based on state values of child elements/componenets
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setFormData(formElement, value) {
    var formData = this.state.formData;

    if (value === "") {
      formData[formElement] = null;
    } else {
      formData[formElement] = value;
    }

    this.setState({
      formData: formData
    });
  }

  /**
   * Display a success/error alert message after form submission
   */
  showAlertMessage() {
    var self = this;

    if (this.refs["alert-message"] === null) {
      return;
    }

    var alertMsg = this.refs["alert-message"];
    $(alertMsg).fadeTo(2000, 500).delay(3000).slideUp(500, function() {
      self.setState({
        uploadResult: null
      });
    });
  }

}

MediaEditForm.propTypes = {
  DataURL: React.PropTypes.string.isRequired,
  action: React.PropTypes.string.isRequired
};

var RMediaEditForm = React.createFactory(MediaEditForm);

window.MediaEditForm = MediaEditForm;
window.RMediaEditForm = RMediaEditForm;

export default MediaEditForm;
