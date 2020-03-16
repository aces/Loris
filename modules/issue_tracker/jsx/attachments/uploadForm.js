import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ProgressBar from 'ProgressBar';

/**
 * Issue Upload Attachment Form
 *
 * Displays a form allowing for uploading
 * attachment in the issue_tracker.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 * */
class IssueUploadAttachmentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        file: '',
        fileDescription: '',
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

  /**
   * Store the value of the element in this.state.upload.formData
   *
   * @param {string} formElement - name of the form element
   * @param {string} value - value of the form element
   */
  setFileUploadFormData(formElement, value) {
    const state = Object.assign({}, this.state);
    state.formData[formElement] = value;
    this.setState(state);
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
    formObj.append('issueID', this.props.issue);
    const url = this.props.baseURL +
      '/issue_tracker/Attachment' +
      '?issueID=' + this.props.issue +
      '&fileDescription=' + state.formData.fileDescription;
    fetch(url,
      {
        credentials: 'same-origin',
        method: 'POST',
        body: formObj,
      }).then((resp) => {
      return resp.json();
    })
      .then((data) => {
        // reset form data after successful file upload
        if (data.success) {
          this.setState({
            formData: {
              file: '',
              fileDescription: '',
            },
            uploadProgress: -1,
          });
          swal('Upload Successful!', '', 'success');
          window.location.href = this.props.baseURL
            + '/issue_tracker/issue/'
            + this.props.issue;
        } else if (data.error) {
          swal(data.error, '', 'error');
        } else {
          swal('Permission denied', '', 'error');
        }
      }).catch((error) => {
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

  render() {
    return (
      <div className='row'>
        <div className='col-md-8 col-lg-7'>
          <FormElement
            name='attachmentUpload'
            fileUpload={true}
            onSubmit={this.handleSubmit}
          >
            <FileElement
              name='file'
              label='File to upload'
              value={this.state.formData.file}
              onUserInput={this.setFileUploadFormData}
              required={true}
            />
            <TextareaElement
              name='fileDescription'
              label='Description'
              value={this.state.formData.fileDescription}
              onUserInput={this.setFileUploadFormData}
              required={false}
            />
            <div className='row'>
              <div className='col-sm-9 col-sm-offset-3'>
                <ProgressBar value={this.state.uploadProgress}/>
              </div>
            </div>
            <ButtonElement label='Submit Attachment'/>
          </FormElement>
        </div>
      </div>
    );
  }
}

IssueUploadAttachmentForm.propTypes = {
  issue: PropTypes.string.isRequired,
  baseURL: PropTypes.string.isRequired,
};

export default IssueUploadAttachmentForm;
