import PropTypes from 'prop-types';
/**
 * Media Upload Form
 *
 * Fetches data from Loris backend and displays a form allowing
 * to upload a document file
 *
 * @author Shen Wang
 * @version 1.0.0
 *
 * */
class DocUploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Data: {},
      formData: {},
      uploadResult: null,
      errorMessage: null,
      isLoaded: false,
      loadedData: 0,
      uploadProgress: -1,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.isValidForm = this.isValidForm.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }
 fetchData() {
    return fetch(this.props.DataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({Data: data, isLoaded: true}))
      .catch((error) => {
        this.setState({error: 'An error occurred when loading the form!'});
        console.error(error);
      });
}
  componentDidMount() {
    this.fetchData();
  }
  componentWillReceiveProps(nextProps) {
    // Any time props.email changes, update state.
    if (nextProps.category) {
        this.fetchData();
      }
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

    return (
      <div className="row">
        <div className="col-md-8 col-lg-7">
          <FormElement
            name="docUpload"
            fileUpload={true}
            onSubmit={this.handleSubmit}
            ref="form"
          >
            <h3>Upload a file</h3><br/>
            <SelectElement
              name="category"
              label="Category"
              options={this.state.Data.categories}
              onUserInput={this.setFormData}
              ref="category"
              hasError={false}
              required={true}
              value={this.state.formData.category}
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
            <TextboxElement
              name="pscid"
              label="PSCID"
              onUserInput={this.setFormData}
              ref="pscid"
              value={this.state.formData.pscid}
            />
            <TextboxElement
              name="visitLabel"
              label="Visit Label"
              onUserInput={this.setFormData}
              ref="visitLabel"
              value={this.state.formData.visitLabel}
            />
            <TextboxElement
              name="version"
              label="Version"
              onUserInput={this.setFormData}
              ref="version"
              value={this.state.formData.version}
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
              id="docUploadEl"
              onUserInput={this.setFormData}
              ref="file"
              label="File to upload"
              required={true}
              value={this.state.formData.file}
            />
            <ButtonElement label="Upload File"/>
          </FormElement>
        </div>
      </div>
    );
  }

/** *******************************************************************************
 *                      ******     Helper methods     *******
 *********************************************************************************/


  /**
   * Handle form submission
   * @param {object} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();

    let formData = this.state.formData;
    let formRefs = this.refs;
    // let docFiles = this.state.Data.docFiles ? this.state.Data.docFiles : [];

    // Validate the form
    if (!this.isValidForm(formRefs, formData)) {
      return;
    }
      this.uploadFile();
  }
  /*
   * Uploads the file to the server
   */
  uploadFile() {
    // Set form data and upload the media file
    let formData = this.state.formData;
    let formObj = new FormData();
    for (let key in formData) {
      if (formData[key] !== '') {
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
        xhr.upload.addEventListener('progress', function(evt) {
          if (evt.lengthComputable) {
            let percentage = Math.round((evt.loaded / evt.total) * 100);
            this.setState({uploadProgress: percentage});
          }
        }.bind(this), false);
        return xhr;
      }.bind(this),
      success: function() {
        // Trigger an update event to update all observers (i.e DataTable)
        let event = new CustomEvent('update-datatable');
        window.dispatchEvent(event);
        this.props.refreshPage();
        this.setState({
//          docFiles: docFiles,
          formData: {}, // reset form data after successful file upload
          uploadProgress: -1,
        });
        swal('Upload Successful!', '', 'success');
      }.bind(this),
      error: function(err) {
        console.error(err);
        let msg = err.responseJSON ? err.responseJSON.message : 'Upload error!';
        this.setState({
          errorMessage: msg,
          uploadProgress: -1,
        });
        swal(msg, '', 'error');
      }.bind(this),
    });
  }

  /**
   * Validate the form
   *
   * @param {object} formRefs - Object containing references to React form elements
   * @param {object} formData - Object containing form data inputed by user
   * @return {boolean} - true if all required fields are filled, false otherwise
   */
  isValidForm(formRefs, formData) {
    let isValidForm = true;

    let requiredFields = {
      category: null,
      site: null,
      file: null,
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
    let formData = this.state.formData;
    formData[formElement] = value;

    this.setState({
      formData: formData,
    });
  }
}

DocUploadForm.propTypes = {
  DataURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
};

export default DocUploadForm;
