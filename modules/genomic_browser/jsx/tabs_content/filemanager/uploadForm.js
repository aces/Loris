import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'ProgressBar';
import Loader from 'jsx/Loader';

/**
 * Genomic Upload Form
 *
 * Displays a form allowing for uploading
 * files in the genomic browser.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 * */
class GenomicUploadForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        fileTypes: {
          'Methylation beta-values': 'Methylation beta-values',
          'Other': 'Other',
        },
      },
      formData: {
        file: '',
        fileType: '',
        fileDescription: '',
        pscidColumn: false,
      },
      uploadResult: null,
      errorMessage: null,
      isLoaded: false,
      loadedData: 0,
      uploadProgress: -1,
    };
    this.uploadFile = this.uploadFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFileUploadFormData = this.setFileUploadFormData.bind(this);
  }
  componentDidMount() {
    this.setState({isLoaded: true});
  }
  /**
   * Store the value of the element in this.state.upload.formData
   *
   * @param {string} formElement - name of the form element
   * @param {string} value - value of the form element
   */
  setFileUploadFormData(formElement, value) {
    const state = Object.assign({}, this.state);
    if (formElement === 'fileType') {
      if (value === 'Other' || value === '') {
        state.formData.pscidColumn = false;
      }
    }
    state.formData[formElement] = value;
    this.setState(state);
  }

  render() {
    // Waiting for data to load
    if (!this.state.isLoaded) {
      return (
        <Loader/>
      );
    }
    // User permissions for uploading files.
    if (!this.props.permissions.upload_allowed) {
      return (
        <div className='alert alert-danger text-center'>
          <strong>
            Privileges insufficient for uploading files.
          </strong>
        </div>
      );
    }
    const checkbox = (
      this.state.formData.fileType === 'Methylation beta-values'
    ) ? (
        <CheckboxElement
          name='pscidColumn'
          label='Use PSCID in column headers'
          id='pscidColumn'
          value={this.state.pscidColumn}
          onUserInput={this.setFileUploadFormData}
        />
      ) : null;

    const formElements = (
      this.state.formData.fileType !== ''
    ) ? (
      <React.Fragment>
        <FileElement
          name='file'
          id='mediaUploadEl'
          onUserInput={this.setFileUploadFormData}
          ref='file'
          label='File to upload'
          required={true}
          value={this.state.formData.file}
        />
        <TextareaElement
          name='fileDescription'
          label='Description'
          value={this.state.formData.fileDescription}
          required={false}
          onUserInput={this.setFileUploadFormData}
        />
        {checkbox}
        <div className='row'>
          <div className='col-sm-9 col-sm-offset-3'>
            <ProgressBar value={this.state.uploadProgress}/>
          </div>
        </div>
        <ButtonElement label='Upload File'/>
      </React.Fragment>
    ) : null;

    return (
      <div className='row'>
        <div className='col-md-8 col-lg-7'>
          <FormElement
            name='genomicUpload'
            fileUpload={true}
            onSubmit={this.handleSubmit}
            ref='form'
          >
            <SelectElement
              name='fileType'
              label='File type'
              options={this.state.options.fileTypes}
              onUserInput={this.setFileUploadFormData}
              ref='fileType'
              hasError={false}
              required={true}
              value={this.state.formData.fileType}
            />
            {formElements}
          </FormElement>
        </div>
      </div>
    );
  }
  /**
   * Handle form submission
   * @param {object} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();
    this.uploadFile();
  }
  /*
   * Uploads the file to the server
   */
  uploadFile() {
    // Set form data and upload the media file
    const state = Object.assign({}, this.state);
    let formObj = new FormData();
    for (let key in state.formData) {
      if (state.formData.hasOwnProperty(key)) {
        formObj.append(key, state.formData[key]);
      }
    }
    fetch(window.location.origin + '/genomic_browser/FileManager',
      {
        credentials: 'same-origin',
        method: 'POST',
        body: formObj,
      }).then((resp) => resp.json())
      .then((data) => {
          console.log(data);
          this.setState({
            formData: {
              file: '',
              fileType: '',
              fileDescription: '',
              pscidColumn: false,
            }, // reset form data after successful file upload
            uploadProgress: -1,
          });
          swal('Upload Successful!', '', 'success');
        }
      ).catch((error) => {
        console.error(error);
        const msg = error.responseJSON ?
          error.responseJSON.message
          : 'Upload error!';
        this.setState({
          errorMessage: msg,
          uploadProgress: -1,
        });
        swal(msg, '', 'error');
      });
  }
}
GenomicUploadForm.propTypes = {
  action: PropTypes.string.isRequired,
  permissions: PropTypes.object,
};

export default GenomicUploadForm;
