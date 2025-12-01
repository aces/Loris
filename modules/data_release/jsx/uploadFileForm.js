import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'ProgressBar';
import swal from 'sweetalert2';
import {withTranslation} from 'react-i18next';
import {
  FormElement,
  StaticElement,
  FileElement,
  TextboxElement,
  ButtonElement,
  SelectElement,
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

    return (
      <FormElement
        name='uploadfile'
        fileUpload={true}
        onSubmit={this.validateAndSubmit}
      >
        <StaticElement
          label={t('Note', {ns: 'data_release'})}
          text={t('Version names will be saved as lowercase.',
            {ns: 'data_release'})}
        />
        <FileElement
          name='file'
          label={t('File to upload', {ns: 'data_release'})}
          onUserInput={this.updateFormElement}
          required={true}
          value={this.state.formData.file}
        />
        <TextboxElement
          name='version'
          label={t('Version', {ns: 'data_release'})}
          onUserInput={this.updateFormElement}
          required={false}
          value={this.state.formData.version}
        />
        <SelectElement
          name='project'
          label={t('Project', {ns: 'loris'})}
          onUserInput={this.updateFormElement}
          required={true}
          value={this.state.formData.project}
          options={this.props.projects}
        />
        <ButtonElement label={t('Upload File', {ns: 'data_release'})}/>
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
    const {t} = this.props;
    let formData = this.state.formData;

    let errorMessage = {
      Filename: undefined,
      Filesize: undefined,
    };

    if (!formData.file) {
      errorMessage.Filename = t('You must select a file to upload',
        {ns: 'data_release'});
      this.setState({errorMessage});
      return;
    }

    if (!formData.project) {
      errorMessage.Project = t('You must select a project',
        {ns: 'data_release'});
      this.setState({errorMessage});
      return;
    }

    // Check that the size of the file is not bigger than the allowed size
    let fileSize = formData.file ? Math.round((formData.file.size/1024)) : null;
    const maxSizeAllowed = this.state.data.maxUploadSize;
    if (parseInt(fileSize, 10) > parseInt(maxSizeAllowed, 10)*1024) {
      let msg = t('File size exceeds the maximum allowed',
        {ns: 'data_release'})
                + ' (' + maxSizeAllowed + ')';
      errorMessage['Filesize'] = msg;
      swal.fire({
        title: t('Error', {ns: 'loris'}),
        text: msg,
        type: 'error',
        showCancelButton: true,
      });
      this.setState({errorMessage});
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
    const {t} = this.props;
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
          title: t('Are you sure?', {ns: 'loris'}),
          text: t('A file with this name already exists!',
            {ns: 'data_release'}) + '\n ' +
                t('Would you like to overwrite existing file?',
                  {ns: 'data_release'}) + '\n ' +
                t('Note that the version associated with the' +
                  'file will also be overwritten.',
                {ns: 'data_release'}),
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: t('Yes, I am sure!', {ns: 'loris'}),
          cancelButtonText: t('No, cancel it!', {ns: 'loris'}),
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
          msg = t('Upload error!', {ns: 'data_release'});
        }
        this.setState({
          errorMessage: msg,
          uploadProgress: -1,
        });
        swal.fire(msg, '', 'error');
        console.error(msg);
      } else {
        swal.fire({
          text: t('Upload Successful!', {ns: 'data_release'}),
          title: '',
          type: 'success',
        }).then(function() {
          window.location.assign('/data_release');
        });
      }
    }).catch( (error) => {
      let msg = error.message ? error.message : t('Upload error!',
        {ns: 'data_release'});
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
  projects: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation(['data_release', 'loris'])(UploadFileForm);
