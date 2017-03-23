class UploadForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      formData: {},
      form: JSON.parse(JSON.stringify(this.props.form)),
      uploadProgress: -1
    };

    this.onFormChange = this.onFormChange.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  componentDidMount() {
    let form = this.state.form;
    form.IsPhantom.required = true;

    // Disable fields on initial load
    this.onFormChange(form.IsPhantom.name, null);
  }

  onFormChange(field, value) {
    let form = this.state.form;
    let formData = this.state.formData;

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

  /*
   Uploads file to the server, listening to the progress
   in order to get the percentage uploaded as value for the progress bar
   */
  uploadFile() {
    let formData = new FormData(this.state.formData);
    formData.append("fire_away", "Upload");

    $.ajax({
      type: 'POST',
      url: loris.BaseURL + "/imaging_uploader/",
      data: formData,
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
      success: function(data) {
        const errMessage = "The following errors occured while " +
          "attempting to display this page:";
        if (data.indexOf(errMessage) > -1) {
          document.open();
          document.write(data);
          document.close();
        }
      },
      error: function(err) {
        console.error(err);
        this.setState({
          uploadProgress: -1
        });
      }.bind(this)
    });
  }

  render() {
    // Bind form elements to formData
    let form = this.state.form;
    form.IsPhantom.value = this.state.formData.IsPhantom;
    form.candID.value = this.state.formData.candID;
    form.pSCID.value = this.state.formData.pSCID;
    form.visitLabel.value = this.state.formData.visitLabel;
    form.mri_file.value = this.state.formData.mri_file;

    // Hide button when progress bar is shown
    const btnClass = (
      (this.state.uploadProgress > -1) ? "btn btn-primary hide" : undefined
    );

    return (
      <div className="row">
        <div className="col-md-7">
          <h3>Upload an imaging scan</h3>
          <br/>
          <FormElement
            name="upload_form"
            formElements={form}
            onUserInput={this.onFormChange}
          >
            <StaticElement
              label="Notes"
              text="File name should be of type .tgz or tar.gz or .zip"
            />
            <div className="row">
              <div className="col-sm-9 col-sm-offset-3">
                <ProgressBar value={this.state.uploadProgress}/>
              </div>
            </div>
            <ButtonElement
              onUserInput={this.uploadFile}
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
