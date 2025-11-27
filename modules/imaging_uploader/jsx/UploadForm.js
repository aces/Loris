import ProgressBar from 'ProgressBar';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';
import {withTranslation, Trans} from 'react-i18next';
import {
  FormElement,
  SelectElement,
  TextboxElement,
  StaticElement,
  FileElement,
  ButtonElement,
} from 'jsx/Form';

/**
 * Imaging Upload Form
 * Form component allowing to upload MRI images to LORIS
 *
 * @author Alex Ilea
 * @author Victoria Foing
 * @version 1.0.0
 */
class UploadForm extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    const form = JSON.parse(JSON.stringify(this.props.form));

    this.state = {
      formData: {},
      form: form,
      errorMessage: {},
      uploadProgress: -1,
    };

    this.onFormChange = this.onFormChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.processError = this.processError.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    // Disable fields on initial load
    this.onFormChange(this.state.form.IsPhantom.name, null);
  }

  /**
   * Updates values in formData
   * Deletes CandID, PSCID, and VisitLabel values if Phantom Scans is set to No
   *
   * @param {string} field
   * @param {*} value
   */
  onFormChange(field, value) {
    if (!field) return;

    const form = JSON.parse(JSON.stringify(this.state.form));
    const formData = Object.assign({}, this.state.formData);

    if (field === 'IsPhantom') {
      if (value !== 'N') {
        delete formData.candID;
        delete formData.pSCID;
        delete formData.visitLabel;
      } else if (typeof formData.mriFile !== 'undefined') {
        let patientName = formData.mriFile.name
          .replace(/\.[a-z]+\.?[a-z]+?$/i, '');
        let ids = patientName.split('_');
        formData.candID = ids[1];
        formData.pSCID = ids[0];
        // visitLabel can contain underscores, filename can have suffix appended to PSCID_CandID_VisitLabel
        // join the remaining elements of patientName and pattern match
        // against each visit label. Use as visitLabel the best (longest) match
        ids.splice(0, 2);
        const suffix = ids.join('_');
        const visitLabels = Object.keys(form.visitLabel.options);
        let bestMatch = '';
        visitLabels.map((visitLabel) => {
          if (suffix.match(visitLabel) !== null) {
            // consider the first match only
            if (suffix.match(visitLabel)[0].length > bestMatch.length) {
              bestMatch = suffix.match(visitLabel)[0];
            }
          }
        });
        formData.visitLabel = bestMatch;
      }
    }

    formData[field] = value;

    if (field === 'mriFile') {
      if (value.name && formData.IsPhantom === 'N') {
        let patientName = value.name.replace(/\.[a-z]+\.?[a-z]+?$/i, '');
        let ids = patientName.split('_');
        formData.candID = ids[1];
        formData.pSCID = ids[0];
        // visitLabel can contain underscores,  filename can have suffix appended to PSCID_CandID_VisitLabel
        // join the remaining elements of patientName and pattern match
        // against each visit label. Use as visitLabel the best (longest) match
        ids.splice(0, 2);
        const suffix = ids.join('_');
        const visitLabels = Object.keys(form.visitLabel.options);
        let bestMatch = '';
        visitLabels.map((visitLabel) => {
          if (suffix.match(visitLabel) !== null) {
            // consider the first match only
            if (suffix.match(visitLabel)[0].length > bestMatch.length) {
              bestMatch = suffix.match(visitLabel)[0];
            }
          }
        });
        formData.visitLabel = bestMatch;
      }
    }

    this.setState({
      form: form,
      formData: formData,
    });
  }

  /**
   * Submit form
   */
  submitForm() {
    const {t} = this.props;
    // Validate required fields
    const data = this.state.formData;

    if (!data.mriFile || !data.IsPhantom) {
      return;
    }

    const fileName = data.mriFile.name;
    // Make sure file is of type .zip|.tgz|.tar.gz format
    const properExt = new RegExp('\.(zip|tgz|tar\.gz)$');
    if (!fileName.match(properExt)) {
      swal.fire({
        title: t('Invalid extension for the uploaded file!',
          {ns: 'imaging_uploader'}),
        text: t('Filename extension does not match .zip, .tgz or .tar.gz ',
          {ns: 'imaging_uploader'}),
        type: 'error',
        confirmButtonText: t('OK', {ns: 'loris'}),
      });

      let errorMessage = {
        mriFile: t(
          'The file {{fileName}} must be of type .tgz, .tar.gz or .zip.',
          {ns: 'imaging_uploader', fileName: fileName}
        ),
        candID: undefined,
        pSCID: undefined,
        visitLabel: undefined,
      };

      this.setState({errorMessage});
      return;
    }

    if (data.IsPhantom === 'N') {
      if (!data.candID || !data.pSCID || !data.visitLabel) {
        swal.fire({
          title: t('Incorrect file name!', {ns: 'imaging_uploader'}),
          text: t('Could not determine PSCID, DCCID and Visit Label'
            +' based on the filename!', {ns: 'imaging_uploader'}),
          type: 'error',
          confirmButtonText: t('OK', {ns: 'loris'}),
        });
        return;
      }
    }

    // Checks if a file with a given fileName has already been uploaded
    const mriFile = this.props.mriList.find(
      (mriFile) => mriFile.fileName.indexOf(fileName) > -1
    );

    // New File
    if (!mriFile) {
      this.uploadFile();
      return;
    }

    // File uploaded and completed mri pipeline
    if (mriFile.status === 'Success') {
      swal.fire({
        title: t('File already exists!', {ns: 'imaging_uploader'}),
        text: t('A file with this name has already successfully'
          +' passed the MRI pipeline!',
        {ns: 'imaging_uploader'}),
        type: 'error',
        confirmButtonText: t('OK', {ns: 'loris'}),
      });
      return;
    }

    // File in the middle of insertion pipeline
    if (mriFile.status === 'In Progress...') {
      swal.fire({
        title: t('File is currently processing!', {ns: 'imaging_uploader'}),
        text: t('A file with this name is currently going'
          +' through the MRI pipeline!',
        {ns: 'imaging_uploader'}),
        type: 'error',
        confirmButtonText: t('OK', {ns: 'loris'}),
      });
      return;
    }

    // File uploaded but failed during mri pipeline
    if (mriFile.status === 'Failure') {
      swal.fire({
        title: t('Are you sure?', {ns: 'imaging_uploader'}),
        text: t('A file with this name already exists! '
          + 'Would you like to overwrite the existing file?',
        {ns: 'imaging_uploader'}),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: t('Yes, I am sure!',
          {ns: 'imaging_uploader'}),
        cancelButtonText: t('No, cancel it!',
          {ns: 'imaging_uploader'}),
      }).then((result) => {
        if (result.value) {
          this.uploadFile(true);
        } else {
          swal.fire(
            t('Cancelled', {ns: 'imaging_uploader'}),
            t('Your upload has been cancelled.',
              {ns: 'imaging_uploader'}),
            'error'
          );
        }
      });
    }

    // Pipeline has not been triggered yet
    if (mriFile.status === 'Not Started') {
      swal.fire({
        title: t('Are you sure?', {ns: 'imaging_uploader'}),
        text: t('A file with this name has been uploaded but has'+
          ' not yet been processed by the MRI pipeline.' +
          ' Would you like to overwrite the existing file?',
        {ns: 'imaging_uploader'}),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: t('Yes, I am sure!',
          {ns: 'imaging_uploader'}),
        cancelButtonText: t('No, cancel it!',
          {ns: 'imaging_uploader'}),
      }).then((result) => {
        if (result.value) {
          this.uploadFile(true);
        } else {
          swal.fire(
            t('Cancelled', {ns: 'imaging_uploader'}),
            t('Your upload has been cancelled.',
              {ns: 'imaging_uploader'}),
            'error'
          );
        }
      });
    }

    return;
  }

  /**
   * Uploads file to the server, listening to the progress
   * in order to get the percentage uploaded as value for the progress bar
   *
   * @param {boolean} overwriteFile
   */
  uploadFile(overwriteFile) {
    const {t} = this.props;
    const formData = this.state.formData;
    let formObj = new FormData();
    for (let key in formData) {
      if (formData[key] !== '') {
        formObj.append(key, formData[key]);
      }
    }
    formObj.append('fire_away', 'Upload');
    if (overwriteFile) {
      formObj.append('overwrite', true);
    }

    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (evt) => {
      if (evt.lengthComputable) {
        const percentage = Math.round((evt.loaded / evt.total) * 100);
        this.setState({uploadProgress: percentage});
      }
    }, false);

    xhr.addEventListener('load', () => {
      if (xhr.status < 400) {
        // Upon successful upload:
        // - Resets errorMessage so no errors are displayed on form
        // - Displays pop up window with success message
        // - Returns to Browse tab
        const errorMessage = this.state.errorMessage;
        for (let i in errorMessage) {
          if (errorMessage.hasOwnProperty(i)) {
            errorMessage[i] = null;
          }
        }
        this.setState({errorMessage: errorMessage});
        let text = '';
        if (this.props.imagingUploaderAutoLaunch === 'true' ||
            this.props.imagingUploaderAutoLaunch === '1'
        ) {
          text =
          t('Processing of this file by the MRI pipeline has started',
            {ns: 'imaging_uploader'}) + '\n'
                + t('Select this upload in the result table'+
                  ' to view the processing progress',
                {ns: 'imaging_uploader'});
        }
        swal.fire({
          title: t('Upload Successful!', {ns: 'imaging_uploader'}),
          text: text,
          type: 'success',
          confirmButtonText: t('OK', {ns: 'loris'}),
        }).then((result) => {
          window.location.assign(loris.BaseURL + '/imaging_uploader/');
        });
      } else {
        this.processError(xhr);
      }
    }, false);

    xhr.addEventListener('error', () => {
      this.processError(xhr);
    }, false);

    xhr.open('POST', loris.BaseURL + '/imaging_uploader/');
    xhr.send(formObj);
  }

  /**
   * Process XMLHttpRequest errors
   *
   * @param {XMLHttpRequest} xhr - XMLHttpRequest
   */
  processError(xhr) {
    const {t} = this.props;
    // Upon errors in upload:
    // - Displays pop up window with submission error message
    // - Updates errorMessage so relevant errors are displayed on form
    // - Returns to Upload tab

    console.error(xhr.status + ': ' + xhr.statusText);

    let errorMessage = Object.assign({}, this.state.errorMessage);
    let messageToPrint = '';
    if (xhr.response) {
      const resp = JSON.parse(xhr.response);
      if (resp.errors) {
        errorMessage = resp.errors;
      }
    } else if (xhr.status == 0) {
      errorMessage = {
        'mriFile': [t('Upload failed: a network error occured',
          {ns: 'imaging_uploader'})],
      };
    } else if (xhr.status == 413) {
      errorMessage = {
        'mriFile': [
          t(
            'Please make sure files are not larger than {{maxFileSize}}',
            {ns: 'imaging_uploader', maxFileSize: this.props.maxUploadSize}
          ),
        ],
      };
    } else {
      errorMessage = {
        'mriFile': [
          t('Upload failed: received HTTP response code {{code}}',
            {ns: 'imaging_uploader', code: xhr.status}),
        ],
      };
    }
    for (const [key, error] of Object.entries(errorMessage)) {
      if (error.length) {
        errorMessage[key] = error.toString();
        messageToPrint += error + '\n';
      } else {
        errorMessage[key] = null;
      }
    }
    swal.fire({
      title: t('Submission error!', {ns: 'imaging_uploader'}),
      text: messageToPrint,
      type: 'error',
    });
    this.setState({
      uploadProgress: -1,
      errorMessage: errorMessage,
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    // Bind form elements to formData
    const form = this.state.form;
    form.IsPhantom.value = this.state.formData.IsPhantom;
    form.candID.value = this.state.formData.candID;
    form.pSCID.value = this.state.formData.pSCID;
    form.visitLabel.value = this.state.formData.visitLabel;
    form.mriFile.value = this.state.formData.mriFile;

    // Hide button when progress bar is shown
    const btnClass = (
      (this.state.uploadProgress > -1) ? 'btn btn-primary hide' : undefined
    );

    const notes = (
      <span>
        {t('File cannot exceed {{maxUploadSize}}',
          {ns: 'imaging_uploader', maxUploadSize: this.props.maxUploadSize}
        )}<br/>
        {t('File must be of type .tgz or tar.gz or .zip',
          {ns: 'imaging_uploader'})}<br/>
	    <Trans
	    ns="imaging_uploader"
	    defaults="For files that are not Phantom Scans, file name must begin with <0>{{prefix}}</0>"
	    components={[<b/>]}
	    values={{prefix:'[PSCID]_[CandID]_[Visit Label]'  }}
	    /><br/>
	    {t(
          `For example, for DCCID {{dccid}}, PSCID {{pscid}}, ` +
          `and Visit Label {{visitLabel}} ` +
          `the file name should be prefixed by: {{prefix}}`,
          {
            ns: 'imaging_uploader',
            dccid: '100000',
            pscid: 'ABC123',
            visitLabel: 'V1',
            prefix: 'ABC123_100000_V1',
          }
        )}<br/>
      </span>
    );

    // Returns individual form elements
    // For CandID, PSCID, and Visit Label, disabled and required
    // are updated depending on Phantom Scan value
    // For all elements, errorMessage
    // is updated depending on what values are submitted
    return (
      <div className='row'>
        <div className='col-md-7'>
          <h3>{t('Upload an imaging scan', {ns: 'imaging_uploader'})}</h3>
          <br/>
          <FormElement
            name='upload_form'
            fileUpload={true}
          >
            <SelectElement
              name='IsPhantom'
              label={t('Phantom Scans', {ns: 'imaging_uploader'})}
              options={this.props.form.IsPhantom.options}
              onUserInput={this.onFormChange}
              required={true}
              errorMessage={this.state.errorMessage.IsPhantom}
              value={this.state.formData.IsPhantom}
            />
            <TextboxElement
              name='candID'
              label={t('DCCID', {ns: 'loris'})}
              disabled={true}
              required={false}
              errorMessage={this.state.errorMessage.candID}
              value={this.state.formData.candID}
            />
            <TextboxElement
              name='pSCID'
              label={t('PSCID', {ns: 'loris'})}
              disabled={true}
              required={false}
              errorMessage={this.state.errorMessage.pSCID}
              value={this.state.formData.pSCID}
            />
            <TextboxElement
              name='visitLabel'
              label={t('Visit Label', {ns: 'loris'})}
              disabled={true}
              required={false}
              errorMessage={this.state.errorMessage.visitLabel}
              value={this.state.formData.visitLabel}
            />
            <FileElement
              name='mriFile'
              label={t('File to Upload', {ns: 'imaging_uploader'})}
              onUserInput={this.onFormChange}
              required={true}
              errorMessage={this.state.errorMessage.mriFile}
              value={this.state.formData.mriFile}
            />
            <StaticElement
              label={t('Notes', {ns: 'imaging_uploader'})}
              text={notes}
            />
            <div className='row'>
              <div className='col-sm-9 col-sm-offset-3'>
                <ProgressBar value={this.state.uploadProgress}/>
              </div>
            </div>
            <ButtonElement
              onUserInput={this.submitForm}
              buttonClass={btnClass}
              label={t('Submit', {ns: 'loris'})}
            />
          </FormElement>
        </div>
      </div>
    );
  }
}
UploadForm.propTypes = {
  form: PropTypes.object,
  mriList: PropTypes.array,
  imagingUploaderAutoLaunch: PropTypes.string,
  maxUploadSize: PropTypes.string,
  t: PropTypes.func,
};

export default withTranslation(['imaging_uploader', 'loris'])(UploadForm);
