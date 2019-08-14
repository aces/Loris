import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'ProgressBar';


/**
 * Upload File Form
 *
 * Module component rendering the upload file form modal window
 */
class UploadFileForm extends Component {
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

  componentDidMount() {
    let self = this;
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      success: function(data) {
        self.setState({
          data: data,
          isLoaded: true,
        });
      },
      error: function(data, errorCode, errorMsg) {
        self.setState({
          error: 'An error occurred when loading the form!',
        });
      },
    });
  }

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
        onSubmit={this.validateAndSubmit}>
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
    let files = this.state.data.files ? this.state.data.files : [];
    let formData = this.state.formData;

    let errorMessage = {
      Filename: undefined,
    };

    let hasError = {
      Filename: undefined,
    };

    if (!formData.file) {
      errorMessage.Filename = 'You must select a file to upload';
      hasError.Filename = true;
      this.setState({errorMessage, hasError});
      return;
    }

    // Grep the uploaded file name
    let fileName = formData.file ? formData.file.name.replace(/\s+/g, '_') : null;

    // Check for duplicate file names
    let isDuplicate = files.indexOf(fileName);
    if (isDuplicate >= 0) {
      swal({
        title: 'Are you sure?',
        text: 'A file with this name already exists!\n Would you like to override existing file?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, I am sure!',
        cancelButtonText: 'No, cancel it!',
      }, function(isConfirm) {
        if (isConfirm) {
          this.uploadFile();
        } else {
          swal('Cancelled', 'Your imaginary file is safe :)', 'error');
        }
      }.bind(this));
    } else {
      this.uploadFile();
    }
  }

  /**
   * Upload the file to the server
   */
  uploadFile() {
    let formData = this.state.formData;
    let formObj = new FormData();
    for (let key in formData) {
      if (formData[key] !== '') {
        formObj.append(key, formData[key]);
      }
    }

    // ajax call to upload the file
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
        // Add file to the list of existing files
        let files = JSON.parse(JSON.stringify(this.state.data.files));
        files.push(formData.file.name);

         // Trigger an update event to update all observers (i.e. DataTable)
          let event = new CustomEvent('update-datatable');
          window.dispatchEvent(event);
          this.setState({
            files: files,
            formData: {}, // reset form data after successful file upload
            uploadProgress: -1,
          });
          swal('Upload Successful!', '', 'success');
          this.props.fetchData();
        }.bind(this),
        error: function(err) {
          let msg = err.responseJSON ? err.responseJSON.message : 'Upload error!';
          this.setState({
            errorMessage: msg,
            uploadProgress: -1,
          });
         swal(msg, '', 'error');
          console.error(err);
       }.bind(this),
    });
  }
}

UploadFileForm.propTypes = {
  DataURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
};

export default UploadFileForm;
