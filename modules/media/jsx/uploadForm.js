import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'ProgressBar';
import Loader from 'jsx/Loader';
import swal from 'sweetalert2';
import {
    FormElement,
    HeaderElement,
    StaticElement,
    SelectElement,
    DateElement,
    TextareaElement,
    FileElement,
    ButtonElement,
} from 'jsx/Form';

/**
 * Media Upload Form
 *
 * Fetches data from Loris backend and displays a form allowing
 * to upload a media file attached to a specific instrument
 *
 * @author Alex Ilea
 * @version 1.0.0
 */
class MediaUploadForm extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
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

    this.getValidFileName = this.getValidFileName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isValidFileName = this.isValidFileName.bind(this);
    this.isValidForm = this.isValidForm.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    fetch(this.props.DataURL, {
      method: 'GET',
    }).then((response) => {
      if (!response.ok) {
        console.error(response.status + ': ' + response.statusText);
        this.setState({
          error: 'An error occurred when loading the form!',
        });
        return;
      }

      response.json().then((data) => {
        this.setState({
          Data: data,
          isLoaded: true,
        });
      });
    }).catch((error) => {
      console.error(error);
      this.setState({
        error: 'An error occurred when loading the form!',
      });
    });
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

    // Waiting for data to load
    if (!this.state.isLoaded) {
      return (
        <Loader/>
      );
    }

    let helpText = (
      <span>
        File name must begin with <b>[PSCID]_[Visit Label]_[Instrument]</b><br/>
        For example, for candidate <i>ABC123</i>, visit <i>V1</i> for
        <i>Body Mass Index</i> the file name should be prefixed by:
        <b> ABC123_V1_bmi</b><br/>
        File cannot exceed {this.props.maxUploadSize}
      </span>
    );

    const visits = this.state.formData.pscid ?
      this.state.Data.sessionData[this.state.formData.pscid].visits :
      {};
    const instruments = this.state.formData.pscid
                        && this.state.formData.visitLabel ?
      this.state.Data.sessionData[this.state.formData.pscid]
        .instruments[this.state.formData.visitLabel] :
          {};
    const visitErrMsg = visits && visits.length === 0 ?
      'No visits available for this candidate' :
      '';
    const instErrMsg = instruments && instruments.length === 0 ?
      'No instruments available for this visit' :
      '';
    return (
      <div className='row'>
        <div className='col-md-8 col-lg-7'>
          <FormElement
            name='mediaUpload'
            fileUpload={true}
            onSubmit={this.handleSubmit}
            ref='form'
          >
            <HeaderElement
              text='Upload a media file'
            />
            <StaticElement
              label='Note'
              text={helpText}
            />
            <SelectElement
              name='pscid'
              label='PSCID'
              options={this.state.Data.candidates}
              onUserInput={this.setFormData}
              ref='pscid'
              hasError={false}
              required={true}
              value={this.state.formData.pscid}
            />
            <SelectElement
              name='visitLabel'
              label='Visit Label'
              options={visits}
              placeholder={visitErrMsg}
              onUserInput={this.setFormData}
              ref='visitLabel'
              required={true}
              value={this.state.formData.visitLabel}
              disabled={this.state.formData.pscid == null}
            />
            <SelectElement
              name='instrument'
              label='Instrument'
              options={instruments}
              placeholder={instErrMsg}
              onUserInput={this.setFormData}
              ref='instrument'
              required={false}
              value={this.state.formData.instrument}
              autoSelect={false}
              disabled={this.state.formData.pscid == null}
            />
            <DateElement
              name='dateTaken'
              label='Date of Administration'
              minYear={this.state.Data.startYear}
              maxYear={this.state.Data.endYear}
              onUserInput={this.setFormData}
              ref='dateTaken'
              value={this.state.formData.dateTaken}
            />
            <TextareaElement
              name='comments'
              label='Comments'
              onUserInput={this.setFormData}
              ref='comments'
              value={this.state.formData.comments}
            />
            <SelectElement
              name='language'
              label={'Document\'s Language'}
              options={this.state.Data.language}
              onUserInput={this.setFormData}
              ref='language'
              required={false}
              value={this.state.formData.language}
            />
            <FileElement
              name='file'
              id='mediaUploadEl'
              onUserInput={this.setFormData}
              ref='file'
              label='File to upload'
              required={true}
              value={this.state.formData.file}
            />
            <ButtonElement label='Upload File'/>
            <div className='row'>
              <div className='col-sm-9 col-sm-offset-3'>
                <ProgressBar value={this.state.uploadProgress}/>
              </div>
            </div>
          </FormElement>
        </div>
      </div>
    );
  }

/**
 * *******************************************************************************
 *                      ******     Helper methods     *******
 ********************************************************************************
 */

  /**
   * Returns a valid name for the file to be uploaded
   *
   * @param {string} pscid - PSCID selected from the dropdown
   * @param {string} visitLabel - Visit label selected from the dropdown
   * @param {string} instrument - Instrument selected from the dropdown
   * @return {string} - Generated valid filename for the current selection
   */
  getValidFileName(pscid, visitLabel, instrument) {
    let fileName = pscid + '_' + visitLabel;
    if (instrument) fileName += '_' + instrument;

    return fileName;
  }

  /**
   * Handle form submission
   *
   * @param {object} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();

    let formData = this.state.formData;
    let formRefs = this.refs;
    let mediaFiles = this.state.Data.mediaFiles ?
      this.state.Data.mediaFiles :
      [];

    // Validate the form
    if (!this.isValidForm(formRefs, formData)) {
      return;
    }

    // Validate uploaded file name
    let instrument = formData.instrument ? formData.instrument : null;
    let fileName = formData.file ?
      formData.file.name.replace(/\s+/g, '_') :
      null;
    let requiredFileName = this.getValidFileName(
      formData.pscid, formData.visitLabel, instrument
    );
    if (!this.isValidFileName(requiredFileName, fileName)) {
      swal.fire(
        'Invalid file name!',
        'File name should begin with: ' + requiredFileName,
        'error'
      );
      return;
    }

    // Check for duplicate file names
    let isDuplicate = mediaFiles.indexOf(fileName);
    if (isDuplicate >= 0) {
      swal.fire({
        title: 'Are you sure?',
        text: 'A file with this name already exists!\n '
              + 'Would you like to override existing file?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, I am sure!',
        cancelButtonText: 'No, cancel it!',
      }).then(function(isConfirm) {
        if (isConfirm) {
          this.uploadFile();
        } else {
          swal.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
        }
      }.bind(this));
    } else {
      this.uploadFile();
    }
  }

  /**
   * Uploads the file to the server
   */
  uploadFile() {
    // Set form data and upload the media file
    let formData = this.state.formData;
    let formObject = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      if (formData[key] !== '') {
        formObject.append(key, value);
      }
    }

    let xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (evt) => {
      if (evt.lengthComputable) {
        let percent = Math.round((evt.loaded / evt.total) * 100);
        this.setState({uploadProgress: percent});
      }
    }, false);

    xhr.addEventListener('load', () => {
      if (xhr.status < 400) {
        // Update data "row" into table
        this.props.insertRow(JSON.parse(xhr.response));
        // Add git pfile to the list of exiting files
        let mediaFiles = JSON.parse(JSON.stringify(this.state.Data.mediaFiles));
        mediaFiles.push(formData.file.name);

        // Trigger an update event to update all observers (i.e DataTable)
        let event = new CustomEvent('update-datatable');
        window.dispatchEvent(event);

        this.setState({
          mediaFiles: mediaFiles,
          formData: {}, // reset form data after successful file upload
          uploadProgress: -1,
        });
        swal.fire(
          'Success!',
          'Upload of media file completed.',
          'success'
        ).then((result) => {
          if (result.value) {
            window.location.href = loris.BaseURL + '/media/';
          }
        });
      } else {
        console.error(xhr.status + ': ' + xhr.statusText);
        let msg = 'Upload error!';
        if (xhr.response) {
          if (xhr.statusText) {
            msg = JSON.parse(xhr.response).message;
          }
        }
        if (xhr.status === 413) {
           msg = JSON.stringify('File too large!');
        }

        this.setState({
          errorMessage: msg,
          uploadProgress: -1,
        });
        swal.fire(msg, '', 'error');
      }
    }, false);

    xhr.addEventListener('error', () => {
      console.error(xhr.status + ': ' + xhr.statusText);
      let msg = xhr.response && JSON.parse(xhr.response).message
        ? JSON.parse(xhr.response).message
        : 'Upload error!';
      this.setState({
        errorMessage: msg,
        uploadProgress: -1,
      });
      swal.fire(msg, '', 'error');
    }, false);
    xhr.open('POST', this.props.action);
    xhr.send(formObject);
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
    let isValidForm = true;

    let requiredFields = {
      pscid: null,
      visitLabel: null,
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

MediaUploadForm.propTypes = {
  DataURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  insertRow: PropTypes.func.isRequired,
  maxUploadSize: PropTypes.string,
};

export default MediaUploadForm;
