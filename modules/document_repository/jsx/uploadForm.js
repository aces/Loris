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
    if (this.state.error) {
       return <h3>An error occured while loading the page.</h3>;
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
            <h3>Upload files</h3><br/>
            <SelectElement
              name="category"
              label="Category"
              options={this.state.data.fieldOptions.fileCategories}
              onUserInput={this.setFormData}
              hasError={false}
              required={true}
              value={this.state.formData.category}
            />
            <SearchableDropdown
              name="forSite"
              label="Site"
              placeHolder="Search for site"
              options={this.state.data.fieldOptions.sites}
              strictSearch={true}
              onUserInput={this.setFormData}
              required={true}
              value={this.state.formData.forSite}
            />
            <SelectElement
              name="instrument"
              label="Instrument"
              options={this.state.data.fieldOptions.instruments}
              onUserInput={this.setFormData}
              value={this.state.formData.instrument}
            />
            <TextboxElement
              name="pscid"
              label="PSCID"
              onUserInput={this.setFormData}
              value={this.state.formData.pscid}
            />
            <TextboxElement
              name="visitLabel"
              label="Visit Label"
              onUserInput={this.setFormData}
              value={this.state.formData.visitLabel}
            />
            <TextboxElement
              name="version"
              label="Version"
              onUserInput={this.setFormData}
              value={this.state.formData.version}
            />
            <TextareaElement
              name="comments"
              label="Comments"
              onUserInput={this.setFormData}
              value={this.state.formData.comments}
            />
            {
              loris.userHasPermission('document_repository_hidden') ?
                (<SelectElement
                name="hiddenFile"
                label="Restrict access to the file?"
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
              label="File(s) to upload"
              required={true}
              value={this.state.formData.files}
              allowMultiple={true}
            />
            <ButtonElement
              label="Upload File(s)"
              disabled={this.state.uploadInProgress}
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
                swal.fire('Upload Successful!', '', 'success')
                  .then((result) => {
                    if (result.value) {
                      this.setState({formData: {}});
                      this.props.refreshPage();
                    }
                });
              } else {
                console.error(resp);
                swal.fire('Upload Incomplete', data.message, 'warning');
              }
            }).catch((error) => {
              console.error(error);
              swal.fire(
                'Error reading response',
                'Please report the issue or contact your administrator',
                'error'
              );
            });
          } else {
              if (resp.status == 413) {
                swal.fire('File too large', 'Could not upload file', 'error');
              }
              if (resp.status == 403) {
                swal.fire('Permission denied',
                    'Could not upload file',
                    'error'
                );
              }
              if (resp.status == 400) {
                swal.fire('Something went wrong',
                    JSON.parse(resp.response).message,
                    'error'
                );
              }
          }
        }).catch((error) => {
          console.error(error);
          swal.fire(
            'Something went wrong',
            'Please report the issue or contact your administrator',
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
};

export default DocUploadForm;
