import React from 'react';
import ProjectFormFields from './projectFields';
import swal from 'sweetalert2';
import PropTypes from 'prop-types';
import {
  FormElement,
  TextboxElement,
} from 'jsx/Form';

/**
 * Publication upload form component
 */
class PublicationUploadForm extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      Data: {},
      formData: {},
      numFiles: 0,
      uploadResult: null,
      loadError: undefined,
      formErrors: {},
      isLoaded: false,
      loadedData: 0,
      uploadProgress: -1,
    };

    this.setFormData = this.setFormData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addListItem = this.addListItem.bind(this);
    this.removeListItem = this.removeListItem.bind(this);
    this.setFileData = this.setFileData.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  /**
   * Fetch data
   */
  fetchData() {
    fetch(this.props.DataURL, {
      method: 'GET',
    }).then((response) => {
      if (!response.ok) {
        console.error(response.status);
        this.setState({
          loadError: 'An error occurred when loading the form!',
        });
        return;
      }

      response.json().then(
        (data) => this.setState({
          Data: data,
          isLoaded: true,
        })
      );
    }).catch((error) => {
      // Network error
      console.error(error);
      this.setState({
        loadError: 'An error occurred when loading the form!',
      });
    });
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData();
  }

  /**
   * Set file data
   *
   * @param {string} formElement
   * @param {*} value
   */
  setFileData(formElement, value) {
    let numFiles = this.state.numFiles;
    if (value) {
      if (!this.state.formData[formElement]) {
        numFiles += 1;
        this.setState({numFiles: numFiles});
      }
    } else {
      // File is being removed
      if (this.state.formData[formElement]) {
        numFiles -= 1;
        this.setState({numFiles: numFiles});
      }
    }
    this.setFormData(formElement, value);
  }

  /**
   * Set form data
   *
   * @param {string} formElement
   * @param {*} value
   */
  setFormData(formElement, value) {
    let formData = this.state.formData;
    formData[formElement] = value;
    this.setState({
      formData: formData,
    });
  }

  /**
   * Add list item
   *
   * @param {string} formElement
   * @param {*} value
   * @param {string} pendingValKey
   */
  addListItem(formElement, value, pendingValKey) {
    let formData = this.state.formData;
    let listItems = formData[formElement] || [];
    listItems.push(value);
    formData[formElement] = listItems;
    formData[pendingValKey] = null;
    this.setState({
      formData: formData,
    });
  }

  /**
   * Remove list item
   *
   * @param {string} formElement
   * @param {*} value
   */
  removeListItem(formElement, value) {
    let formData = this.state.formData;
    let listItems = formData[formElement];
    let index = listItems.indexOf(value);

    if (index > -1) {
      listItems.splice(index, 1);
      formData[formElement] = listItems;
      this.setState({
        formData: formData,
      });
    }
  }

  /**
   * Handle submit
   *
   * @param {object} e - Event object
   */
  handleSubmit(e) {
    e.preventDefault();

    if (Object.keys(this.state.formErrors).length > 0) {
      swal.fire(
        'Please fix any remaining form errors before submission',
        '',
        'error'
      );
      return;
    }
    let formData = {
      ...this.state.formData,
      baseURL: loris.BaseURL,
    };

    let formObj = new FormData();
    for (let key in formData) {
      if (formData.hasOwnProperty(key) && formData[key] !== '') {
        let formVal;
        if (Array.isArray(formData[key])) {
          formVal = JSON.stringify(formData[key]);
        } else {
          formVal = formData[key];
        }
        formObj.append(key, formVal);
      }
    }

    fetch(this.props.action, {
      method: 'POST',
      body: formObj,
    }).then((response) => {
      if (!response.ok) {
        console.error(response.status);
        response.json().then((data) => {
          let message = (data && data.message) || '';
          swal.fire('Something went wrong!', message, 'error');
        });
        return;
      }

      // reset form data
      this.setState({
        formData: {},
        numFiles: 0,
      });

      swal.fire(
        {
          title: 'Submission Successful!',
          type: 'success',
        }).then(function() {
          window.location.replace(loris.BaseURL + '/publication/');
        });
    }).catch((error) => {
      // Network error
      console.error(error);
      swal.fire('Something went wrong!', '', 'error');
    });
   }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    // Data loading error
    if (this.state.loadError !== undefined) {
      return (
        <div className="alert alert-danger text-center">
          <strong>
            {this.state.error}
          </strong>
        </div>
      );
    }

    // Waiting for data to load
    if (!this.state.isLoaded) {
      return (
        <button className="btn-info has-spinner">
          Loading
          <span
            className="glyphicon glyphicon-refresh glyphicon-refresh-animate">
          </span>
        </button>
      );
    }

    let createElements;
    let formClass = 'col-md-12 col-lg-12';
    if (!this.props.editMode) {
      createElements = (
        <div key='propose_new_project'>
          <h3 className="col-md-offset-3 col-lg-offset-3">
            Propose a new project
          </h3>
          <TextboxElement
            name="title"
            label="Title"
            onUserInput={this.setFormData}
            required={true}
            value={this.state.formData.title}
          />
        </div>
    );
      // if not in edit mode, shrink form for consistent display
      formClass = 'col-md-8 col-lg-7';
    }

    return (
      <div className="row">
        <div className={formClass}>
          <FormElement
            name="publicationUpload"
            onSubmit={this.handleSubmit}
            ref="form"
            fileUpload={true}
          >
            {createElements}
            <ProjectFormFields
              formData={this.state.formData}
              formErrors={this.state.formErrors}
              numFiles={this.state.numFiles}
              setFormData={this.setFormData}
              setFileData={this.setFileData}
              addListItem={this.addListItem}
              removeListItem={this.removeListItem}
              toggleEmailNotify={this.toggleEmailNotify}
              uploadTypes={this.state.Data.uploadTypes}
              projectOptions={this.state.Data.projectOptions}
              users={this.state.Data.users}
              allVOIs={this.state.Data.allVOIs}
              allKWs={this.state.Data.allKWs}
              allCollabs={this.state.Data.allCollabs}
              editMode={false}
            />
          </FormElement>
        </div>
      </div>
    );
  }
}
PublicationUploadForm.propTypes = {
  DataURL: PropTypes.string,
  action: PropTypes.string,
  editMode: PropTypes.bool,
};

export default PublicationUploadForm;
