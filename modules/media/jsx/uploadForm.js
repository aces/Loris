import ProgressBar from 'ProgressBar';

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
class MediaUploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Data: {},
      formData: {},
      uploadResult: null,
      errorMessage: null,
      isLoaded: false,
      loadedData: 0,
      uploadProgress: -1
    };

    this.getValidFileName = this.getValidFileName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isValidFileName = this.isValidFileName.bind(this);
    this.isValidForm = this.isValidForm.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  componentDidMount() {
    var self = this;
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      success: function(data) {
        self.setState({
          Data: data,
          isLoaded: true
        });
      },
      error: function(data, errorCode, errorMsg) {
        console.error(data, errorCode, errorMsg);
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

    var helpText = (
      <span>
        File name must begin with <b>[PSCID]_[Visit Label]_[Instrument]</b><br/>
        For example, for candidate <i>ABC123</i>, visit <i>V1</i> for
        <i>Body Mass Index</i> the file name should be prefixed by:
        <b> ABC123_V1_Body_Mass_Index</b><br/>
        File cannot exceed {this.props.maxUploadSize}
      </span>
    );

    return (
      <div className="row">
        <div className="col-md-8 col-lg-7">
          <FormElement
            name="mediaUpload"
            fileUpload={true}
            onSubmit={this.handleSubmit}
            ref="form"
          >
            <h3>Upload a media file</h3><br/>
            <StaticElement
              label="Note"
              text={helpText}
            />
            <SelectElement
              name="pscid"
              label="PSCID"
              options={this.state.Data.candidates}
              onUserInput={this.setFormData}
              ref="pscid"
              hasError={false}
              required={true}
              value={this.state.formData.pscid}
            />
            <SelectElement
              name="visitLabel"
              label="Visit Label"
              options={this.state.Data.visits}
              onUserInput={this.setFormData}
              ref="visitLabel"
              required={true}
              value={this.state.formData.visitLabel}
            />
            <SearchableDropdown
              name="forSite"
              label="Site"
              placeHolder="Search for site"
              options={this.state.Data.sites}
              strictSearch={true}
              onUserInput={this.setFormData}
              ref="forSite"
              required={true}
              value={this.state.formData.forSite}
            />
            <SelectElement
              name="instrument"
              label="Instrument"
              options={this.state.Data.instruments}
              onUserInput={this.setFormData}
              ref="instrument"
              value={this.state.formData.instrument}
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
            <SelectElement
              name="language"
              label="Document's Language"
              options={this.state.Data.language}
              onUserInput={this.setFormData}
              ref="language"
              required={false}
              value={this.state.formData.language}
            />
            <FileElement
              name="file"
              id="mediaUploadEl"
              onUserInput={this.setFormData}
              ref="file"
              label="File to upload"
              required={true}
              value={this.state.formData.file}
            />
            <ButtonElement label="Upload File"/>
            <div className="row">
              <div className="col-sm-9 col-sm-offset-3">
                <ProgressBar value={this.state.uploadProgress}/>
              </div>
            </div>
          </FormElement>
        </div>
      </div>
    );
  }

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
  getValidFileName(pscid, visitLabel, instrument) {
    var fileName = pscid + "_" + visitLabel;
    if (instrument) fileName += "_" + instrument;

    return fileName;
  }

  /**
   * Handle form submission
   * @param {object} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();

    let formData = this.state.formData;
    let formRefs = this.refs;
    let mediaFiles = this.state.Data.mediaFiles ? this.state.Data.mediaFiles : [];

    // Validate the form
    if (!this.isValidForm(formRefs, formData)) {
      return;
    }

    // Validate uploaded file name
    let instrument = formData.instrument ? formData.instrument : null;
    let fileName = formData.file ? formData.file.name.replace(/\s+/g, '_') : null;
    let requiredFileName = this.getValidFileName(
      formData.pscid, formData.visitLabel, instrument
    );
    if (!this.isValidFileName(requiredFileName, fileName)) {
      swal(
        "Invalid file name!",
        "File name should begin with: " + requiredFileName,
        "error"
      );
      return;
    }

    // Check for duplicate file names
    let isDuplicate = mediaFiles.indexOf(fileName);
    if (isDuplicate >= 0) {
      swal({
        title: "Are you sure?",
        text: "A file with this name already exists!\n Would you like to override existing file?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, I am sure!',
        cancelButtonText: "No, cancel it!"
      }, function(isConfirm) {
        if (isConfirm) {
          this.uploadFile();
        } else {
          swal("Cancelled", "Your imaginary file is safe :)", "error");
        }
      }.bind(this));
    } else {
      this.uploadFile();
    }
  }

  /*
   * Uploads the file to the server
   */
  uploadFile() {
    // Set form data and upload the media file
    let formData = this.state.formData;
    let formObj = new FormData();
    for (let key in formData) {
      if (formData[key] !== "") {
        formObj.append(key, formData[key]);
      }
    }

    $.ajax({
      type: 'POST',
      url: this.props.action,
      data: formObj,
      cache: false,
      contentType: false,
      processData: false,
      xhr: function() {
        let xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            let percentage = Math.round((evt.loaded / evt.total) * 100);
            this.setState({uploadProgress: percentage});
          }
        }.bind(this), false);
        return xhr;
      }.bind(this),
      success: function() {
        // Add git pfile to the list of exiting files
        let mediaFiles = JSON.parse(JSON.stringify(this.state.Data.mediaFiles));
        mediaFiles.push(formData.file.name);

        // Trigger an update event to update all observers (i.e DataTable)
        let event = new CustomEvent('update-datatable');
        window.dispatchEvent(event);

        this.setState({
          mediaFiles: mediaFiles,
          formData: {}, // reset form data after successful file upload
          uploadProgress: -1
        });
        swal("Upload Successful!", "", "success");
      }.bind(this),
      error: function(err) {
        console.error(err);
        let msg = err.responseJSON ? err.responseJSON.message : "Upload error!";
        this.setState({
          errorMessage: msg,
          uploadProgress: -1
        });
        swal(msg, "", "error");
      }.bind(this)
    });
  }

  /**
   * Checks if the inputted file name is valid
   *
   * @param {string} requiredFileName - Required file name
   * @param {string} fileName - Provided file name
   * @return {boolean} - true if fileName starts with requiredFileName, false
   *   otherwise
   */
  isValidFileName(requiredFileName, fileName) {
    if (fileName === null || requiredFileName === null) {
      return false;
    }

    return (fileName.indexOf(requiredFileName) === 0);
  }

  /**
   * Validate the form
   *
   * @param {object} formRefs - Object containing references to React form elements
   * @param {object} formData - Object containing form data inputed by user
   * @return {boolean} - true if all required fields are filled, false otherwise
   */
  isValidForm(formRefs, formData) {
    var isValidForm = true;

    var requiredFields = {
      pscid: null,
      visitLabel: null,
      file: null
    };

    Object.keys(requiredFields).map(function(field) {
      if (formData[field]) {
        requiredFields[field] = formData[field];
      } else if (formRefs[field]) {
        formRefs[field].props.hasError = true;
        isValidForm = false;
      }
    });
    this.forceUpdate();

    return isValidForm;
  }

  /**
   * Set the form data based on state values of child elements/componenets
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setFormData(formElement, value) {
    // Only display visits and sites available for the current pscid
    let visitLabel = this.state.formData.visitLabel;
    let pscid = this.state.formData.pscid;

    if (formElement === "pscid" && value !== "") {
      this.state.Data.visits = this.state.Data.sessionData[value].visits;
      this.state.Data.sites = this.state.Data.sessionData[value].sites;
      if (visitLabel) {
        this.state.Data.instruments =
          this.state.Data.sessionData[value].instruments[visitLabel];
      } else {
        this.state.Data.instruments =
          this.state.Data.sessionData[value].instruments.all;
      }
    }

    if (formElement === "visitLabel" && value !== "" && pscid) {
      this.state.Data.instruments =
        this.state.Data.sessionData[pscid].instruments[value];
    }

    var formData = this.state.formData;
    formData[formElement] = value;

    this.setState({
      formData: formData
    });
  }
}

MediaUploadForm.propTypes = {
  DataURL: React.PropTypes.string.isRequired,
  action: React.PropTypes.string.isRequired
};

export default MediaUploadForm;
