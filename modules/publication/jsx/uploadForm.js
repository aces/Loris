import React from 'react';
import ProjectFormFields from './projectFields';

class PublicationUploadForm extends React.Component {
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

  fetchData() {
    let self = this;
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      success: function(data) {
        self.setState({
          Data: data,
          isLoaded: true,
        });
      },
      error: function(data, errorCode, errorMsg) {
        console.error(data, errorCode, errorMsg);
        self.setState({
          loadError: 'An error occurred when loading the form!',
        });
      },
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  setFileData(formElement, value) {
    let numFiles = this.state.numFiles;
    if (!this.state.formData[formElement]) {
      numFiles += 1;
      this.setState({numFiles: numFiles});
    }
    this.setFormData(formElement, value);
  }

  setFormData(formElement, value) {
    let formData = this.state.formData;
    formData[formElement] = value;
    this.setState({
      formData: formData,
    });
  }

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

  handleSubmit(e) {
    e.preventDefault();

    if (Object.keys(this.state.formErrors).length > 0) {
      swal(
        'Please fix any remaining form errors before submission',
        '',
        'error'
      );
      return;
    }
    let formData = this.state.formData;

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

    $.ajax({
      type: 'POST',
      url: this.props.action,
      data: formObj,
      cache: false,
      contentType: false,
      processData: false,
      success: function() {
        // reset form data
        this.setState({
          formData: {},
          numFiles: 0,
        });
        swal(
          {
            title: 'Submission Successful!',
            type: 'success',
          },
          function() {
            window.location.replace(loris.BaseURL + '/publication/');
          }
        );
      }.bind(this),
      error: function(jqXHR) {
        console.error(jqXHR);
        let resp = '';
        try {
          resp = JSON.parse(jqXHR.responseText).message;
        } catch (e) {
          console.error(e);
        }
        swal('Something went wrong!', resp, 'error');
      },
    });
  }

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

export default PublicationUploadForm;
