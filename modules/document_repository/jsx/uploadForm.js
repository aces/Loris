import React, {Component} from 'react';
import PropTypes from 'prop-types';

import swal from 'sweetalert2';
import Loader from 'Loader';
import {
  SearchableDropdown,
  SelectElement,
  FormElement,
  TextboxElement,
  TextareaElement,
  FileElement,
  ButtonElement,
} from 'jsx/Form';
import {withTranslation} from 'react-i18next';
import i18n from 'I18nSetup';
import hiStrings from '../locale/hi/LC_MESSAGES/document_repository.json';
import jaStrings from '../locale/ja/LC_MESSAGES/document_repository.json';

/**
 * Media Upload Form
 *
 * Fetches data from Loris backend and displays a form allowing
 * to upload document files
 *
 * @author Shen Wang
 * @version 1.0.0
 */
class DocUploadForm extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      error: false,
      formData: {},
      uploadResult: null,
      errorMessage: null,
      isLoaded: false,
      uploadInProgress: false,
    };

    this.setFormData = this.setFormData.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Called by React when props are passed to the Component instance
   *
   * @param {object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    // Any time props.category changes, update state.
    if (nextProps.category) {
      this.fetchData();
    }
  }

  /**
   * Fetch data
   *
   * @return {Promise}
   */
  fetchData() {
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({data: data, isLoaded: true}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    // Data loading error
    const {t} = this.props;
    if (this.state.error) {
      return <h3>{t('An error occured while loading the page.',
        {ns: 'loris'})}</h3>;
    }
    // Waiting for data to load
    if (!this.state.isLoaded) {
      return (<Loader/>);
    }
    return (
      <div className="row">
        <div className="col-md-8 col-lg-7">
          <FormElement
            name="docUpload"
            fileUpload={true}
            onSubmit={this.uploadFiles}
            method="POST"
          >
            <h3>{t('Upload files', {ns: 'document_repository'})}</h3><br/>
            <SelectElement
              name="category"
              label={t('Category', {ns: 'document_repository'})}
              options={this.state.data.fieldOptions.fileCategories}
              onUserInput={this.setFormData}
              required={true}
              value={this.state.formData.category}
            />
            <SearchableDropdown
              name="forSite"
              label={t('Site', {ns: 'loris', count: 1})}
              placeHolder={t('Search for site', {ns: 'document_repository'})}
              options={this.state.data.fieldOptions.sites}
              strictSearch={true}
              onUserInput={this.setFormData}
              required={true}
              value={this.state.formData.forSite}
            />
            <SelectElement
              name="instrument"
              label={t('Instrument', {ns: 'loris', count: 1})}
              options={this.state.data.fieldOptions.instruments}
              onUserInput={this.setFormData}
              value={this.state.formData.instrument}
            />
            <TextboxElement
              name="pscid"
              label={t('PSCID', {ns: 'loris'})}
              onUserInput={this.setFormData}
              value={this.state.formData.pscid}
            />
            <TextboxElement
              name="visitLabel"
              label={t('Visit Label', {ns: 'loris'})}
              onUserInput={this.setFormData}
              value={this.state.formData.visitLabel}
            />
            <TextboxElement
              name="version"
              label={t('Version', {ns: 'document_repository'})}
              onUserInput={this.setFormData}
              value={this.state.formData.version}
            />
            <TextareaElement
              name="comments"
              label={t('Comments', {ns: 'document_repository'})}
              onUserInput={this.setFormData}
              value={this.state.formData.comments}
            />
            {
              loris.userHasPermission('document_repository_hidden') ?
                (<SelectElement
                  name="hiddenFile"
                  label={t('Restrict access to the file?',
                    {ns: 'document_repository'})}
                  options={this.state.data.fieldOptions.hiddenFile}
                  sortByValue={false}
                  onUserInput={this.setFormData}
                  value={this.state.formData.hiddenFile}
                />) :
                null
            }
            <FileElement
              name="files"
              id="docUploadEl"
              onUserInput={this.setFormData}
              label={t('File(s) to upload', {ns: 'document_repository'})}
              required={true}
              value={this.state.formData.files}
              allowMultiple={true}
            />
            <ButtonElement
              label={t('Upload File(s)', {ns: 'document_repository'})}
              disabled={this.state.uploadInProgress}
              disabledLabel={t('Uploading...', {ns: 'document_repository'})}
            />
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
   * Upload file(s)
   */
  uploadFiles() {
    // Set form data and upload the media file
    try {
      this.setState({uploadInProgress: true});
      let formData = this.state.formData;
      let formObject = new FormData();
      for (let key in formData) {
        if (formData[key] !== '') {
          if (key === 'files' &&
            document.querySelector('.fileUpload').multiple) {
            Array.from(formData[key]).forEach((file) => {
              formObject.append('files[]', file);
            });
          } else {
            formObject.append(key, formData[key]);
          }
        }
      }

      fetch(this.props.action, {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
        body: formObject,
      })
        .then((resp) => {
          if (resp.ok) {
            resp.json().then((data) => {
              if (data.error_count === 0) {
                swal.fire(
                  this.props.t('Upload Successful!',
                    {ns: 'document_repository'}),
                  '',
                  'success'
                ).then((result) => {
                  if (result.value) {
                    this.setState({formData: {}});
                    this.props.refreshPage();
                  }
                });
              } else {
                console.error(resp);
                swal.fire(
                  this.props.t('Upload Incomplete',
                    {ns: 'document_repository'}),
                  data.message,
                  'warning'
                );
              }
            }).catch((error) => {
              console.error(error);
              swal.fire(
                this.props.t('Error reading response',
                  {ns: 'document_repository'}),
                this.props.t(
                  'Please report the issue or contact your administrator',
                  {ns: 'document_repository'}),
                'error'
              );
            });
          } else {
            if (resp.status == 413) {
              swal.fire(
                this.props.t('File too large', {ns: 'document_repository'}),
                this.props.t('Could not upload file',
                  {ns: 'document_repository'}),
                'error'
              );
            }
            if (resp.status == 403) {
              swal.fire(
                this.props.t('Permission denied', {ns: 'loris'}),
                this.props.t('Could not upload file',
                  {ns: 'document_repository'}),
                'error'
              );
            }
            if (resp.status == 400) {
              swal.fire(
                this.props.t('Something went wrong',
                  {ns: 'document_repository'}),
                JSON.parse(resp.response).message,
                'error'
              );
            }
          }
        }).catch((error) => {
          console.error(error);
          swal.fire(
            this.props.t('Something went wrong',
              {ns: 'document_repository'}),
            this.props.t(
              'Please report the issue or contact your administrator',
              {ns: 'document_repository'}),
            'error'
          );
        }).finally(() => this.setState({uploadInProgress: false}));
    } catch (error) {
      console.error(error);
      this.setState({uploadInProgress: false});
    }
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

    this.setState({formData: formData});
  }
}

DocUploadForm.propTypes = {
  dataURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  refreshPage: PropTypes.func.isRequired,
  category: PropTypes.bool,
  t: PropTypes.func,
};

export default withTranslation(['document_repository', 'loris'])(DocUploadForm);

window.addEventListener('load', () => {
  i18n.addResourceBundle('hi', 'document_repository', hiStrings);
  i18n.addResourceBundle('ja', 'document_repository', jaStrings);

  const element = document.getElementById('lorisworkspace');
  if (!element) {
    throw new Error('Missing lorisworkspace');
  }
});
