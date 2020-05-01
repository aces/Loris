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
    fetch(this.props.DataURL, {credentials: 'same-origin'})
      .then( (resp) => resp.json())
      .then( (data) => self.setState({data: data, isLoaded: true}))
      .catch( (error) => {
        self.setState({error: 'An error occurred when loading the form!'});
        console.error(error);
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
    let files = this.state.data.files ? this.state.data.files : [];
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
      let msg = 'File size exceeds the maximum allowed (' + maxSizeAllowed + ')';
      errorMessage['Filesize'] = msg;
      hasError['Filesize'] = true;
      swal({
        title: 'Error',
        text: msg,
        type: 'error',
        showCancelButton: true,
      });
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
        closeOnConfirm: false,
      }, function(isConfirm) {
        if (isConfirm) {
          this.uploadFile();
        } else {
          swal('Cancelled', 'Your file is safe :)', 'error');
        }
      }.bind(this));
    } else {
      this.uploadFile();
    }
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
    const url = overwrite ? this.props.action + '&overwrite=true'
      : this.props.action;
    fetch(url, {
      method: 'post',
      body: formObj,
      cache: 'no-cache',
    }).then( (response) => {
      if (!response.ok) {
        let msg = response.statusText ? response.statusText : 'Upload error!';
        this.setState({
          errorMessage: msg,
          uploadProgress: -1,
        });
        swal(msg, '', 'error');
        console.error(msg);
      } else {
        const responseUrl = new URL(response.url);
        if (responseUrl.searchParams.has('duplicate')) {
          swal({
            title: 'Are you sure?',
            text: 'A file with this name already exists!\n Would you like to overwrite existing file?\n Note that the version associated with the file will also be overwritten.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, I am sure!',
            cancelButtonText: 'No, cancel it!',
          }, (isConfirm) => {
            if (isConfirm) {
              this.uploadFile(true);
            }
          });
        } else {
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
          swal({
            text: 'Upload Successful!',
            title: '',
            type: 'success',
          }, function() {
            window.location.assign('/data_release');
          });
          this.props.fetchData();
        }
      }
    }).catch( (error) => {
      let msg = error.message ? error.message : 'Upload error!';
      this.setState({
        errorMessage: msg,
        uploadProgress: -1,
      });
      swal(msg, '', 'error');
      console.error(error);
    });
  }
}

UploadFileForm.propTypes = {
  DataURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
};

export default UploadFileForm;
