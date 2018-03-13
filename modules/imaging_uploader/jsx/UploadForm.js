import ProgressBar from 'ProgressBar';

/**
 * Imaging Upload Form
 *
 * Form component allowing to upload MRI images to LORIS
 *
 * @author Alex Ilea
 * @version 1.0.0
 * @since 2017/04/01
 *
 */
class UploadForm extends React.Component {

  constructor(props) {
    super(props);

    const form = JSON.parse(JSON.stringify(this.props.form));
    form.IsPhantom.required = true;
    form.candID.required = true;
    form.pSCID.required = true;
    form.visitLabel.required = true;
    form.mri_file.required = true;

    this.state = {
      formData: {},
      form: form,
      uploadProgress: -1
    };

    this.onFormChange = this.onFormChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  componentDidMount() {
    // Disable fields on initial load
    this.onFormChange(this.state.form.IsPhantom.name, null);
  }

  onFormChange(field, value) {
    if (!field) return;

    const form = JSON.parse(JSON.stringify(this.state.form));
    const formData = Object.assign({}, this.state.formData);

    if (field === 'IsPhantom') {
      if (value === 'N') {
        form.candID.disabled = false;
        form.pSCID.disabled = false;
        form.visitLabel.disabled = false;
      } else {
        form.candID.disabled = true;
        form.pSCID.disabled = true;
        form.visitLabel.disabled = true;
        delete formData.candID;
        delete formData.pSCID;
        delete formData.visitLabel;
      }
    }

    formData[field] = value;

    this.setState({
      form: form,
      formData: formData
    });
  }

  submitForm() {
    // Validate required fields
    const data = this.state.formData;
    if (!data.mri_file || !data.IsPhantom) {
      return;
    }

    if (data.IsPhantom === 'N' && (!data.candID || !data.pSCID || !data.visitLabel)) {
      return;
    }

    // Checks if a file with a given fileName has already been uploaded
    const fileName = data.mri_file.name;
    const mriFile = this.props.mriList.find(
      mriFile => mriFile.fileName.indexOf(fileName) > -1
    );

    // New File
    if (!mriFile) {
      this.uploadFile();
      return;
    }

    // File uploaded and completed mri pipeline
    if (mriFile.status === "Success") {
      swal({
        title: "File already exists!",
        text: "A file with this name has already successfully passed the MRI pipeline!\n",
        type: "error",
        confirmButtonText: 'OK'
      });
      return;
    }

    // File in the middle of insertion pipeline
    if (mriFile.status === "In Progress...") {
      swal({
        title: "File is currently processing!",
        text: "A file with this name is currently going through the MRI pipeline!\n",
        type: "error",
        confirmButtonText: 'OK'
      });
      return;
    }

    // File uploaded but failed during mri pipeline
    if (mriFile.status === "Failure") {
      swal({
        title: "Are you sure?",
        text: "A file with this name already exists!\n Would you like to override existing file?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, I am sure!',
        cancelButtonText: "No, cancel it!"
      }, function(isConfirm) {
        if (isConfirm) {
          this.uploadFile(true);
        } else {
          swal("Cancelled", "Your imaginary file is safe :)", "error");
        }
      }.bind(this));
    }

    // Pipeline has not been triggered yet
    if (mriFile.status === "Not Started") {
      swal({
        title: "Are you sure?",
        text: "A file with this name has been uploaded but has not yet started the MRI pipeline." +
          "\n Would you like to override the existing file?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, I am sure!',
        cancelButtonText: 'No, cancel it!'
      }, function(isConfirm) {
        if (isConfirm) {
          this.uploadFile(true);
        } else {
          swal("Cancelled", "Your upload has been cancelled.", "error");
        }
      }.bind(this));
    }

    return;
  }

  /*
   Uploads file to the server, listening to the progress
   in order to get the percentage uploaded as value for the progress bar
   */
  uploadFile(overwriteFile) {
    const formData = this.state.formData;
    let formObj = new FormData();
    for (let key in formData) {
      if (formData[key] !== "") {
        formObj.append(key, formData[key]);
      }
    }
    formObj.append("fire_away", "Upload");
    if (overwriteFile) {
      formObj.append("overwrite", true);
    }

    $.ajax({
      type: 'POST',
      url: loris.BaseURL + "/imaging_uploader/",
      data: formObj,
      cache: false,
      contentType: false,
      processData: false,
      xhr: function() {
        const xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            const percentage = Math.round((evt.loaded / evt.total) * 100);
            this.setState({uploadProgress: percentage});
          }
        }.bind(this), false);
        return xhr;
      }.bind(this),
      success: function(data) {
        swal({
          title: "Upload Successful!",
          type: "success"
        }, function() {
          window.location.assign(loris.BaseURL + "/imaging_uploader/");
        });
      },
      error: function(err) {
        const errMessage = "The following errors occured while " +
          "attempting to display this page:";
        let responseText = err.responseText;
        if (responseText.indexOf(errMessage) > -1) {
          responseText = responseText.replace('history.back()', 'location.reload()');
          document.open();
          document.write(responseText);
          document.close();
        }
        console.error(err);
      }
    });
  }

  render() {
    // Bind form elements to formData
    const form = this.state.form;
    form.IsPhantom.value = this.state.formData.IsPhantom;
    form.candID.value = this.state.formData.candID;
    form.pSCID.value = this.state.formData.pSCID;
    form.visitLabel.value = this.state.formData.visitLabel;
    form.mri_file.value = this.state.formData.mri_file;

    // Hide button when progress bar is shown
    const btnClass = (
      (this.state.uploadProgress > -1) ? "btn btn-primary hide" : undefined
    );

    const notes = "File name must be of type .tgz or tar.gz or .zip. " +
      "Uploads cannot exceed " + this.props.maxUploadSize;
    return (
      <div className="row">
        <div className="col-md-7">
          <h3>Upload an imaging scan</h3>
          <br/>
          <FormElement
            name="upload_form"
            formElements={form}
            fileUpload={true}
            onUserInput={this.onFormChange}
          >
            <StaticElement
              label="Notes"
              text={notes}
            />
            <div className="row">
              <div className="col-sm-9 col-sm-offset-3">
                <ProgressBar value={this.state.uploadProgress}/>
              </div>
            </div>
            <ButtonElement
              onUserInput={this.submitForm}
              buttonClass={btnClass}
            />
          </FormElement>
        </div>
      </div>
    );
  }
}

UploadForm.propTypes = {};
UploadForm.defaultProps = {};

export default UploadForm;
