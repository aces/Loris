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
import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';
import hiStrings from '../locale/hi/LC_MESSAGES/media.json';
import jaStrings from '../locale/ja/LC_MESSAGES/media.json';
import frStrings from '../locale/fr/LC_MESSAGES/media.json';
import esStrings from '../locale/es/LC_MESSAGES/media.json';
i18n.addResourceBundle('hi', 'media', hiStrings);
i18n.addResourceBundle('ja', 'media', jaStrings);
i18n.addResourceBundle('fr', 'media', frStrings);
i18n.addResourceBundle('es', 'media', esStrings);

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
          error: this.props.t('An error occurred when loading the form!',
            {ns: 'media'}),
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
        error: this.props.t('An error occurred when loading the form!',
          {ns: 'media'}),
      });
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;

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
        {t('File name must begin with', {ns: 'media'})}
        <b>[{t('PSCID', {ns: 'loris'})}]_[{t('Visit Label', {ns: 'loris'})}]_[
          {t('Instrument', {ns: 'loris', count: 1})}]</b><br/>
        {t('For example, for candidate', {ns: 'media'})}
        <i>ABC123</i>, {t('visit', {ns: 'media'})} <i>V1</i>
        {t('for', {ns: 'media'})}
        <i>Body Mass Index</i>
        {t('the file name should be prefixed by', {ns: 'media'})}:
        <b> ABC123_V1_bmi</b><br/>
        {t('File cannot exceed', {ns: 'media'})} {this.props.maxUploadSize}
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
      t('No visits available for this candidate', {ns: 'media'}) :
      '';
    const instErrMsg = instruments && instruments.length === 0 ?
      t('No instruments available for this visit', {ns: 'media'}) :
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
              text={t('Upload a media file', {ns: 'media'})}
            />
            <StaticElement
              label={t('Note', {ns: 'media'})}
              text={helpText}
            />
            <SelectElement
              name='pscid'
              label={t('PSCID', {ns: 'loris'})}
              options={this.state.Data.candidates}
              onUserInput={this.setFormData}
              ref='pscid'
              required={true}
              value={this.state.formData.pscid}
            />
            <SelectElement
              name='visitLabel'
              label={t('Visit Label', {ns: 'loris'})}
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
              label={t('Instrument', {ns: 'loris', count: 1})}
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
              label={t('Date of Administration', {ns: 'media'})}
              minYear={this.state.Data.startYear}
              maxYear={this.state.Data.endYear}
              onUserInput={this.setFormData}
              ref='dateTaken'
              value={this.state.formData.dateTaken}
            />
            <TextareaElement
              name='comments'
              label={t('Comments', {ns: 'media'})}
              onUserInput={this.setFormData}
              ref='comments'
              value={this.state.formData.comments}
            />
            <SelectElement
              name='language'
              label={t('Document\'s Language', {ns: 'media'})}
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
              label={t('File to upload', {ns: 'loris'})}
              required={true}
              value={this.state.formData.file}
            />
            <ButtonElement label={t('Upload File', {ns: 'media'})}/>
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
        'Your file\'s base name should be: <code>'
        + requiredFileName +'</code>'
        + '<br>followed by the file extension.',
        'error'
      );
      return;
    }

    // Check for duplicate file names
    let isDuplicate = mediaFiles.indexOf(fileName);
    if (isDuplicate >= 0) {
      swal.fire({
        title: 'Are you sure?',
        text: 'A file with this name already exists!' + '\n'
              + 'Would you like to overwrite the existing file?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: this.props.t('Yes, I am sure!', {ns: 'loris'}),
        cancelButtonText: this.props.t('No, cancel it!', {ns: 'loris'}),
      }).then(function(isConfirm) {
        if (isConfirm) {
          this.uploadFile();
        } else {
          swal.fire('Cancelled', 'Your file was not overwritten', 'error');
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
          this.props.t('Success!', {ns: 'media'}),
          this.props.t('Upload of media file completed.', {ns: 'media'}),
          'success'
        ).then((result) => {
          if (result.value) {
            window.location.href = loris.BaseURL + '/media/';
          }
        });
      } else {
        console.error(xhr.status + ': ' + xhr.statusText);
        let msg = this.props.t('Upload error!', {ns: 'media'});
        if (xhr.response) {
          if (xhr.statusText) {
            msg = JSON.parse(xhr.response).message;
          }
        }
        if (xhr.status === 413) {
          msg = this.props.t('File too large!', {ns: 'media'});
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
        : this.props.t('Upload error!', {ns: 'media'});
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
    const {t} = this.props;
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
        formRefs[field].props.errorMessage = t
          ? t('This field is required.', {ns: 'media'})
          : 'This field is required.';
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
  t: PropTypes.func,
};

export default withTranslation(['media', 'loris'])(MediaUploadForm);
