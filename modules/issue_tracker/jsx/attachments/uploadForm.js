import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ProgressBar from 'ProgressBar';
import swal from 'sweetalert2';
import {
  FormElement,
  ButtonElement,
  TextareaElement,
  FileElement,
} from 'jsx/Form';
import {withTranslation} from 'react-i18next';

/**
 * Issue Upload Attachment Form
 *
 * Displays a form allowing for uploading
 * attachment in the issue_tracker.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 */
class IssueUploadAttachmentForm extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
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
   *
   * @param {object} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();
    this.uploadFile();
  }

  /**
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
          swal.fire(
            this.props.t('Upload Successful!',
              {ns: 'issue_tracker'}),
            '',
            'success'
          );
          window.location.href = this.props.baseURL +
            '/issue_tracker/issue/' +
            this.props.issue;
        } else if (data.error) {
          swal.fire(data.error, '', 'error');
        } else {
          swal.fire(
            this.props.t('Permission denied', {ns: 'loris'}),
            '',
            'error'
          );
        }
      }).catch((error) => {
        console.error(error);
        const msg = error.responseJSON ?
          error.responseJSON.message
          : this.props.t('Upload error!', {ns: 'issue_tracker'});
        this.setState({
          errorMessage: msg,
          uploadProgress: -1,
        });
        swal.fire(msg, '', 'error');
      });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
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
              label={t('File to upload', {ns: 'loris'})}
              value={this.state.formData.file}
              onUserInput={this.setFileUploadFormData}
              required={true}
            />
            <TextareaElement
              name='fileDescription'
              label={t('Description',
                {ns: 'issue_tracker'})}
              value={this.state.formData.fileDescription}
              onUserInput={this.setFileUploadFormData}
              required={false}
            />
            <div className='row'>
              <div className='col-sm-9 col-sm-offset-3'>
                <ProgressBar value={this.state.uploadProgress}/>
              </div>
            </div>
            <ButtonElement
              label={t('Submit Attachment', {ns: 'issue_tracker'})}
            />
          </FormElement>
        </div>
      </div>
    );
  }
}

IssueUploadAttachmentForm.propTypes = {
  issue: PropTypes.string.isRequired,
  baseURL: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(IssueUploadAttachmentForm);
