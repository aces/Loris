import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'ProgressBar';
import swal from 'sweetalert2';
import {
  FormElement,
  StaticElement,
  FileElement,
  TextboxElement,
  ButtonElement,
} from 'jsx/Form';

/**
 * Upload File Form
 *
 * Module component rendering the upload file form modal window
 */
class UploadFileForm extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      formData: {},
      uploadResult: null,
      errorMessage: {},
      hasError: {},
      isLoaded: false,
      uploadProgress: -1,
    };

    this.updateFormElement = this.updateFormElement.bind(this);
    this.validateAndSubmit = this.validateAndSubmit.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    // Data loading error
    if (this.state.error !== undefined) {
      return (
        <div className='alert alert-danger text-center'>
          <strong>
            {this.state.error}
          </strong>
        </div>
      );
    }

    return (
      <FormElement
        name='uploadfile'
        fileUpload={true}
        onSubmit={this.validateAndSubmit}
      >
        <StaticElement
          label='Note'
          text='Version names will be saved as lowercase.'
        />
        <FileElement
          name='file'
          label='File to upload'
          onUserInput={this.updateFormElement}
          required={true}
          value={this.state.formData.file}
        />
        <TextboxElement
          name='version'
          label='Version'
          onUserInput={this.updateFormElement}
          required={false}
          value={this.state.formData.version}
        />
        <ButtonElement label='Upload File'/>
        <div className='row'>
          <div className='col-sm-9 col-sm-offset-3'>
            <ProgressBar value={this.state.uploadProgress}/>
          </div>
        </div>
      </FormElement>
    );
  }

  /**
   * Update a form Element
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding element
   */
  updateFormElement(formElement, value) {
    let formData = this.state.formData;

    if (value === '') {
      formData[formElement] = null;
    } else {
      formData[formElement] = value;
    }

    this.setState({formData: formData});
  }

  /**
   * Validate and submit the upload
   */
  validateAndSubmit() {
    let formData = this.state.formData;

    let errorMessage = {
      Filename: undefined,
      Filesize: undefined,
    };

    let hasError = {
      Filename: undefined,
      Filesize: undefined,
    };

    if (!formData.file) {
      errorMessage.Filename = 'You must select a file to upload';
      hasError.Filename = true;
      this.setState({errorMessage, hasError});
      return;
    }

    // Check that the size of the file is not bigger than the allowed size
    let fileSize = formData.file ? Math.round((formData.file.size/1024)) : null;
    const maxSizeAllowed = this.state.data.maxUploadSize;
    if (parseInt(fileSize, 10) > parseInt(maxSizeAllowed, 10)*1024) {
      let msg = 'File size exceeds the maximum allowed ('
                + maxSizeAllowed
                + ')';
      errorMessage['Filesize'] = msg;
      hasError['Filesize'] = true;
      swal.fire({
        title: 'Error',
        text: msg,
        type: 'error',
        showCancelButton: true,
      });
      this.setState({errorMessage, hasError});
      return;
    }

    this.uploadFile();
  }

  /**
   * Upload the file to the server
   *
   * @param {boolean} overwrite
   */
  uploadFile(overwrite) {
    let formData = this.state.formData;
    let formObj = new FormData();
    for (let key in formData) {
      if (formData[key] !== '') {
        formObj.append(key, formData[key]);
      }
    }

    // fetch API to upload the file
    const url = overwrite ? this.props.action + '?overwrite=true'
      : this.props.action;
    fetch(url, {
      method: 'post',
      body: formObj,
      cache: 'no-cache',
    }).then(async (response) => {
      if (response.status === 409) {
          swal.fire({
            title: 'Are you sure?',
            text: 'A file with this name already exists!\n '
                  + 'Would you like to overwrite existing file?\n '
                  + 'Note that the version associated with '
                  + 'the file will also be overwritten.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, I am sure!',
            cancelButtonText: 'No, cancel it!',
          }).then((isConfirm) => {
            if (isConfirm && isConfirm.value) {
              this.uploadFile(true);
            }
          });
      } else if (!response.ok) {
        const body = await response.json();
        let msg;
        if (body && body.error) {
            msg = body.error;
        } else if (response.statusText) {
            msg = response.statusText;
        } else {
            msg = 'Upload error!';
        }
        this.setState({
          errorMessage: msg,
          uploadProgress: -1,
        });
        swal.fire(msg, '', 'error');
        console.error(msg);
      } else {
          swal.fire({
            text: 'Upload Successful!',
            title: '',
            type: 'success',
          }).then(function() {
            window.location.assign('/data_release');
          });
      }
    }).catch( (error) => {
      let msg = error.message ? error.message : 'Upload error!';
      this.setState({
        errorMessage: msg,
        uploadProgress: -1,
      });
      swal.fire(msg, '', 'error');
      console.error(error);
    });
  }
}

UploadFileForm.propTypes = {
  DataURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
};

export default UploadFileForm;
