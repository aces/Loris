import React, {useState} from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'ProgressBar';
import swal from 'sweetalert2';
import {
  FormElement,
  FileElement,
  TextboxElement,
  StaticElement,
  ButtonElement,
} from 'jsx/Form';

/**
 * UploadForm
 *
 * @param {array} props
 * @return {JSX}
 */
export default function UploadForm(props) {
  const {t} = props;
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [uploadProgress, setuploadProgress] = useState(-1);

  /**
   * Reset form
   */
  const resetForm = () => {
    setFormData({});
    setErrorMessage({});
    setuploadProgress(-1);
  };

  /**
   * Updates values in formData
   *
   * @param {string} field
   * @param {*} value
   */
  const onFormChange = (field, value) => {
    if (!field) return;

    const newFormData = {...formData, [field]: value};
    if (field === 'eegFile' && value.name) {
      const patientName = value.name.replace(/\.[a-z]+\.?[a-z]+?$/i, '');
      const ids = patientName.split('_');
      newFormData.pscid = ids[0];
      newFormData.candID = ids[1];
      newFormData.visit = ids[2];

      // Clear possible error messages from previous file selection
      setErrorMessage({
        eegFile: null,
        candID: null,
        pscid: null,
        visit: null,
      });
    }

    setFormData(newFormData);
  };

  /**
   * Submit form
   */
  const submitForm = () => {
    // Validate required fields
    const data = formData;

    if (!data.eegFile) {
      return;
    }

    const fileName = data.eegFile.name;
    // Make sure file is of type .tar.gz format
    const properExt = new RegExp('\.(tar.gz)$');
    const pNameElements = [data.pscid, data.candID, data.visit, 'bids'];
    const fileNameConvention = pNameElements.join('_') + '.tar.gz';
    if (!fileName.match(properExt)) {
      swal.fire({
        title: t('Invalid extension for the uploaded file!',
          {ns: 'electrophysiology_uploader'}),
        text: t('Filename extension does not match .tar.gz ',
          {ns: 'electrophysiology_uploader'}),
        type: 'error',
        confirmButtonText: t('OK', {ns: 'electrophysiology_uploader'}),
      });

      setErrorMessage({
        eegFile: t('The file', {ns: 'electrophysiology_uploader'}) +
         ' ' + fileName + ' ' + t('must be of type .tar.gz.',
          {ns: 'electrophysiology_uploader'}),
        candID: null,
        pscid: null,
        visit: null,
      });

      return;
    }

    if (fileName !== fileNameConvention) {
      swal.fire({
        title: t('Invalid filename!', {ns: 'electrophysiology_uploader'}),
        text: t('Filename should be of the form',
          {ns: 'electrophysiology_uploader'}) +
           ' [PSCID]_[CandID]_[VisitLabel]_bids.tar.gz',
        type: 'error',
        confirmButtonText: t('OK', {ns: 'electrophysiology_uploader'}),
      });

      setErrorMessage({
        eegFile: t('The file does not respect name convention',
          {ns: 'electrophysiology_uploader'}),
        candID: null,
        pscid: null,
        visit: null,
      });

      return;
    }

    uploadFile();
  };

  /**
   * Uploads file to the server, listening to the progress
   * in order to get the percentage uploaded as value for the progress bar
   */
  const uploadFile = () => {
    let formObj = new FormData();
    for (let key in formData) {
      if (formData[key] !== '') {
        formObj.append(key, formData[key]);
      }
    }
    formObj.append('fire_away', 'Upload');

    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (evt) => {
      if (evt.lengthComputable) {
        const percentage = Math.round((evt.loaded / evt.total) * 100);
        setuploadProgress(percentage);
      }
    }, false);

    xhr.addEventListener('load', () => {
      if (xhr.status < 400) {
        // Upon successful upload:
        // - Resets errorMessage so no errors are displayed on form
        // - Displays pop up window with success message
        // - Returns to Browse tab
        setErrorMessage({
          eegFile: null,
          candID: null,
          pscid: null,
          visit: null,
        });

        let text = '';
        if (props.autoLaunch === 'true' || props.autoLaunch === '1') {
          text = t('Processing of this file by the EEG pipeline has started',
            {ns: 'electrophysiology_uploader'});
        }
        swal.fire({
          title: t('Upload Successful!',
            {ns: 'electrophysiology_uploader'}),
          text: text,
          type: 'success',
        }).then((result) => {
          if (result.value) {
            props.refreshPage();
          }
        });

        resetForm();
      } else {
        processError(xhr);
      }
    }, false);

    xhr.addEventListener('error', () => {
      processError(xhr);
    }, false);

    xhr.open('POST', props.uploadURL);
    xhr.send(formObj);
  };

  /**
   * Process XMLHttpRequest errors
   *
   * @param {XMLHttpRequest} xhr - XMLHttpRequest
   */
  const processError = (xhr) => {
    // Upon errors in upload:
    // - Displays pop up window with submission error message
    // - Updates errorMessage so relevant errors are displayed on form
    // - Returns to Upload tab

    console.error(xhr.status + ': ' + xhr.statusText);

    let error = null;
    if (xhr.response) {
      const resp = JSON.parse(xhr.response);
      if (resp.error) {
        error = resp.error;
      }
    } else if (xhr.status == 0) {
      error = t('Upload failed: a network error occured',
        {ns: 'electrophysiology_uploader'});
    } else if (xhr.status == 413) {
      error = t('Please make sure files are not larger than',
        {ns: 'electrophysiology_uploader'})
          + ' ' + props.maxUploadSize;
    } else {
      error = t('Upload failed: received HTTP response code',
        {ns: 'electrophysiology_uploader'})
          + ' ' + xhr.status;
    }

    swal.fire({
      title: t('Submission error!', {ns: 'electrophysiology_uploader'}),
      text: error,
      type: 'error',
    });

    setuploadProgress(-1);
  };

  return (
    <div className='row'>
      <div className='col-md-7'>
        <h3>{t('Upload an electrophysiology recording session',
          {ns: 'electrophysiology_uploader'})}</h3>
        <br/>
        <FormElement
          name='upload_form'
          fileUpload={true}
        >
          <FileElement
            name='eegFile'
            label={t('File to Upload',
              {ns: 'electrophysiology_uploader'})}
            onUserInput={onFormChange}
            required={true}
            errorMessage={errorMessage.eegFile}
            value={formData.eegFile}
          />
          <TextboxElement
            name='candID'
            label={t('DCCID', {ns: 'loris'})}
            disabled={true}
            required={false}
            errorMessage={errorMessage.candID}
            value={formData.candID}
          />
          <TextboxElement
            name='pscid'
            label={t('PSCID', {ns: 'loris'})}
            disabled={true}
            required={false}
            errorMessage={errorMessage.pscid}
            value={formData.pscid}
          />
          <TextboxElement
            name='visit'
            label={t('Visit Label', {ns: 'loris'})}
            disabled={true}
            required={false}
            errorMessage={errorMessage.visit}
            value={formData.visit}
          />
          <StaticElement
            label={t('Notes', {ns: 'electrophysiology_uploader'})}
            text={
              <span>
                {props.maxUploadSize &&
                  t('File cannot exceed',
                    {ns: 'electrophysiology_uploader'}) +
                  ` ${props.maxUploadSize}<br/>x`
                }
                {t('File name must match the following convention:',
                  {ns: 'electrophysiology_uploader'})}<br/>
                <b>[PSCID]_[DCCID]_[Visit Label]_bids.tar.gz</b>
              </span>
            }
          />
          <div className='row'>
            <div className='col-sm-9 col-sm-offset-3'>
              <ProgressBar value={uploadProgress}/>
            </div>
          </div>
          <ButtonElement
            onUserInput={submitForm}
            buttonClass={
              'btn btn-primary' + (uploadProgress > -1 ? ' hide' : '')
            }
          />
        </FormElement>
      </div>
    </div>
  );
}

UploadForm.propTypes = {
  autoLaunch: PropTypes.string,
  uploadURL: PropTypes.string.isRequired,
  maxUploadSize: PropTypes.number,
  refreshPage: PropTypes.func,
  t: PropTypes.func,
};