import React, {useState} from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'ProgressBar';
import swal from 'sweetalert2';

/**
 * UploadForm
 *
 * @param {array} props
 * @return {JSX}
 */
export default function UploadForm(props) {
  const [formData, setFormData] = useState({});
  const [hasError, setHasError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [uploadProgress, setuploadProgress] = useState(-1);

  /**
   * Reset form
   */
  const resetForm = () => {
    setFormData({});
    setErrorMessage({});
    setHasError({});
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
    const fileNameConvention = pNameElements.join('_');
    if (!fileName.match(properExt)) {
      swal.fire({
        title: 'Invalid extension for the uploaded file!',
        text: 'Filename extension does not match .tar.gz ',
        type: 'error',
        confirmButtonText: 'OK',
      });

      setErrorMessage({
        eegFile: 'The file ' + fileName + ' must be of type .tar.gz.',
        candID: null,
        pscid: null,
        visit: null,
      });

      setHasError({
        eegFile: true,
        candID: false,
        pscid: false,
        visit: false,
      });

      return;
    }

    if (!fileName.match(fileNameConvention)) {
      swal.fire({
        title: 'Invalid filename!',
        text: 'Filename should be of the form '
              + '[PSCID]_[CandID]_[VisitLabel]_bids',
        type: 'error',
        confirmButtonText: 'OK',
      });

      setErrorMessage({
        eegFile: 'The file ' + fileName + ' does not respect name convention ',
        candID: null,
        pscid: null,
        visit: null,
      });

      setHasError({
        eegFile: true,
        candID: false,
        pscid: false,
        visit: false,
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
        // - Resets errorMessage and hasError so no errors are displayed on form
        // - Displays pop up window with success message
        // - Returns to Browse tab
        setErrorMessage({
          eegFile: null,
          candID: null,
          pscid: null,
          visit: null,
        });
        setHasError({
          eegFile: false,
          candID: false,
          pscid: false,
          visit: false,
        });

        let text = '';
        if (props.autoLaunch === 'true' || props.autoLaunch === '1') {
          text = 'Processing of this file by the EEG pipeline has started';
        }
        swal.fire({
          title: 'Upload Successful!',
          text: text,
          type: 'success',
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
    // - Updates errorMessage and hasError so relevant errors are displayed on form
    // - Returns to Upload tab

    console.error(xhr.status + ': ' + xhr.statusText);

    let error = null;
    if (xhr.response) {
      const resp = JSON.parse(xhr.response);
      if (resp.error) {
        error = resp.error;
      }
    } else if (xhr.status == 0) {
      error = 'Upload failed: a network error occured';
    } else if (xhr.status == 413) {
      error = 'Please make sure files are not larger than '
          + props.maxUploadSize;
    } else {
      error = 'Upload failed: received HTTP response code '
          + xhr.status;
    }

    swal.fire({
      title: 'Submission error!',
      text: error,
      type: 'error',
    });

    setuploadProgress(-1);
  };

  return (
    <div className='row'>
      <div className='col-md-7'>
        <h3>Upload an electrophysiology recording session</h3>
        <br/>
        <FormElement
          name='upload_form'
          fileUpload={true}
        >
          <FileElement
            name='eegFile'
            label='File to Upload'
            onUserInput={onFormChange}
            required={true}
            hasError={hasError.eegFile}
            errorMessage={errorMessage.eegFile}
            value={formData.eegFile}
          />
          <TextboxElement
            name='candID'
            label='CandID'
            disabled={true}
            required={false}
            hasError={hasError.candID}
            errorMessage={errorMessage.candID}
            value={formData.candID}
          />
          <TextboxElement
            name='pscid'
            label='PSCID'
            disabled={true}
            required={false}
            hasError={hasError.pscid}
            errorMessage={errorMessage.pscid}
            value={formData.pscid}
          />
          <TextboxElement
            name='visit'
            label='Visit Label'
            disabled={true}
            required={false}
            hasError={hasError.visit}
            errorMessage={errorMessage.visit}
            value={formData.visit}
          />
          <StaticElement
            label='Notes'
            text={
              <span>
                {props.maxUploadSize &&
                  `File cannot exceed ${props.maxUploadSize}<br/>x`
                }
                File name must match the following convention:<br/>
                <b>[PSCID]_[CandID]_[Visit Label]_bids.tar.gz</b>
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
};
