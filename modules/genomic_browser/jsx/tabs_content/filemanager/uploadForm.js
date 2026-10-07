import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'ProgressBar';
import Loader from 'jsx/Loader';
import {
  FormElement,
  CheckboxElement,
  FileElement,
  TextareaElement,
  SelectElement,
  ButtonElement,
} from 'jsx/Form';
import swal from 'sweetalert2';
import {withTranslation} from 'react-i18next';

/**
 * Genomic Upload Form
 *
 * Displays a form allowing for uploading
 * files in the genomic browser.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 */
class GenomicUploadForm extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      options: {
        fileTypes: {
          'Methylation beta-values': 'Methylation beta-values',
          'Other': 'Other',
        },
      },
      formData: {
        file: '',
        fileType: '',
        fileDescription: '',
        pscidColumn: false,
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
   * Fetch data when component mounts.
   */
  componentDidMount() {
    this.setState({isLoaded: true});
  }

  /**
   * Store the value of the element in this.state.upload.formData
   *
   * @param {string} formElement - name of the form element
   * @param {string} value - value of the form element
   */
  setFileUploadFormData(formElement, value) {
    const state = Object.assign({}, this.state);
    if (formElement === 'fileType') {
      if (value === 'Other' || value === '') {
        state.formData.pscidColumn = false;
      }
    }
    state.formData[formElement] = value;
    this.setState(state);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    // Waiting for data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }
    // User permissions for uploading files.
    if (!this.props.permissions.upload_allowed) {
      return (
        <div className='alert alert-danger text-center'>
          <strong>
            Privileges insufficient for uploading files.
          </strong>
        </div>
      );
    }
    const checkbox = (
      this.state.formData.fileType === 'Methylation beta-values'
    ) ? (
        <CheckboxElement
          name='pscidColumn'
          label={t('Use PSCID in column headers', {ns: 'genomic_browser'})}
          id='pscidColumn'
          value={this.state.pscidColumn}
          onUserInput={this.setFileUploadFormData}
        />
      ) : null;

    const formElements = (
      this.state.formData.fileType !== ''
    ) ? (
        <React.Fragment>
          <FileElement
            name='file'
            id='mediaUploadEl'
            onUserInput={this.setFileUploadFormData}
            ref='file'
            label={t('File to upload', {ns: 'loris'})}
            required={true}
            value={this.state.formData.file}
          />
          <TextareaElement
            name='fileDescription'
            label={t('Description', {ns: 'genomic_browser'})}
            value={this.state.formData.fileDescription}
            required={false}
            onUserInput={this.setFileUploadFormData}
          />
          {checkbox}
          <div className='row'>
            <div className='col-sm-9 col-sm-offset-3'>
              <ProgressBar value={this.state.uploadProgress}/>
            </div>
          </div>
          <ButtonElement label={t('Upload File', {ns: 'genomic_browser'})}/>
        </React.Fragment>
      ) : null;

    return (
      <div className='row'>
        <div className='col-md-8 col-lg-7'>
          <FormElement
            name='genomicUpload'
            fileUpload={true}
            onSubmit={this.handleSubmit}
            ref='form'
          >
            <SelectElement
              name='fileType'
              label={t('File type', {ns: 'genomic_browser'})}
              options={this.state.options.fileTypes}
              onUserInput={this.setFileUploadFormData}
              ref='fileType'
              required={true}
              value={this.state.formData.fileType}
            />
            {formElements}
          </FormElement>
        </div>
      </div>
    );
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
    const {t} = this.props;
    // Set form data and upload the media file
    const state = Object.assign({}, this.state);
    let formObj = new FormData();
    for (let key in state.formData) {
      if (state.formData.hasOwnProperty(key)) {
        formObj.append(key, state.formData[key]);
      }
    }
    fetch(`${this.props.baseURL}/genomic_browser/FileManager`,
      {
        credentials: 'same-origin',
        method: 'POST',
        body: formObj,
      }).then((resp) => resp.json())
      .then((data) => {
        this.setState({
          formData: {
            file: '',
            fileType: '',
            fileDescription: '',
            pscidColumn: false,
          }, // reset form data after successful file upload
          uploadProgress: -1,
        });
        swal.fire(t('Upload successful!', {ns: 'loris'}), '', 'success');
        this.props.closeFileUploadModal();
      }
      ).catch((error) => {
        console.error(error);
        const msg = error.responseJSON ?
          error.responseJSON.message
          : t('Upload error!', {ns: 'genomic_browser'});
        this.setState({
          errorMessage: msg,
          uploadProgress: -1,
        });
        swal.fire(msg, '', 'error');
      });
  }
}
GenomicUploadForm.propTypes = {
  action: PropTypes.string,
  permissions: PropTypes.object,
  baseURL: PropTypes.string.isRequired,
  closeFileUploadModal: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation('genomic_browser', 'loris')(GenomicUploadForm);
