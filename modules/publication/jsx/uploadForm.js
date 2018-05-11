import ProgressBar from 'ProgressBar';
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
      toNotify: [],
    };

    this.setFormData = this.setFormData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addListItem = this.addListItem.bind(this);
    this.removeListItem = this.removeListItem.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.setFileData = this.setFileData.bind(this);
    this.createFileFields = this.createFileFields.bind(this);
    this.toggleEmailNotify = this.toggleEmailNotify.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData() {
    let self = this;
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      success: function(data) {
        console.log(data);
        self.setState({
          Data: data,
          isLoaded: true
        });
      },
      error: function(data, errorCode, errorMsg) {
        console.error(data, errorCode, errorMsg);
        self.setState({
          loadError: 'An error occurred when loading the form!'
        });
      }
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  setFileData(formElement, value) {
    let numFiles = this.state.numFiles;
    if(!this.state.formData[formElement]) {
        numFiles += 1;
        this.setState({numFiles: numFiles});
    }
    this.setFormData(formElement, value);
  }

  createFileFields() {
    let fileFields = [];
    for(let i =0; i <= this.state.numFiles; i++){
      let fileName = "file_" + i;
      fileFields.push(
        <FileElement
          name={fileName}
          id="publicationUploadEl"
          onUserInput={this.setFileData}
          label="File to upload"
          value={this.state.formData[fileName]}
        />
      );
      if(this.state.formData[fileName]){
        let publicationType = "publicationType_" + i;
        let publicationCitation = "publicationCitation_" + i;
        let publicationVersion = "publicationVersion_" + i;
        fileFields.push (
          <div>
            <SelectElement
              name={publicationType}
              label="Publication Type"
              id="publicationTypeEl"
              onUserInput={this.setFormData}
              value={this.state.formData[publicationType]}
              options={this.state.Data.uploadTypes}
              required={true}
            />
            <TextboxElement
              name={publicationCitation}
              label="Citation"
              onUserInput={this.setFormData}
              value={this.state.formData[publicationCitation]}
            />
            <TextboxElement
              name={publicationVersion}
              label="Publication Version"
              onUserInput={this.setFormData}
              value={this.state.formData[publicationVersion]}
            />
          </div>
        );
      }
    }

    return fileFields;
  }

  setFormData(formElement, value) {
    let formData = this.state.formData;
    formData[formElement] = value;
    this.setState({
      formData: formData
    });
  }

  addListItem(formElement, value, pendingValKey) {
    let formData = this.state.formData;
    let listItems = formData[formElement] || [];
    listItems.push(value);
    formData[formElement] = listItems;
    formData[pendingValKey] = null;
    this.setState({
      formData: formData
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
        formData: formData
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    let formData = this.state.formData;
    // make sure title is unique
    let existingTitles = this.state.Data.existingTitles;
    if (existingTitles.indexOf(formData.title) > -1) {
      swal("Publication title already exists!", "", "error");
      return;
    }

    let formObj = new FormData();
    for (let key in formData) {
      if (formData[key] !== "") {
        let formVal;
        if (Array.isArray(formData[key])) {
          formVal = JSON.stringify(formData[key]);
        } else {
          formVal = formData[key];
        }
        formObj.append(key, formVal);
      }
    }
    formObj.append('toNotify', JSON.stringify(this.state.toNotify));

    $.ajax({
      type: 'POST',
      url: this.props.action,
      data: formObj,
      cache: false,
      contentType: false,
      processData: false,
      xhr: function() {
        let xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            let percentage = Math.round((evt.loaded / evt.total) * 100);
            this.setState({uploadProgress: percentage});
          }
        }.bind(this), false);
        return xhr;
      }.bind(this),
      success: function() {
        // reset form data
        this.setState({
          formData: {},
          numFiles: 0,
          uploadProgress: -1
        });
        swal("Submission Successful!", "", "success");

      }.bind(this),
      error: function(jqXHR, textStatus, errorThrown) {
        console.error(textStatus);
        swal("Something went wrong!", jqXHR.responseText, "error");
      }
    });
  }

  validateEmail(field, email) {
    let formErrors = this.state.formErrors;

    // don't supply error if email is blank
    if (email === '' || email === null || email === undefined) {
      delete formErrors[field];

      // if email is invalid, set error, else nullify error
    } else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
      formErrors[field] = 'Invalid email';
    } else {
      delete formErrors[field];
    }
    this.setState({formErrors});
  }

  toggleEmailNotify(e) {
    let toNotify = this.state.toNotify;
    let i = toNotify.indexOf(e.target.value);
    // if box is checked and toNotify does not include addressee, add them
    if (e.target.checked && i < 0) {
      toNotify.push(e.target.value);
      // otherwise delete them
    } else if (!e.target.checked && i >= 0) {
      toNotify.splice(i, 1);
    }
    this.setState({toNotify: toNotify})
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

    // generate optional email input fields for collaborators
    let collabEmails = [];
    if (this.state.formData.collaborators) {
      this.state.formData.collaborators.forEach(
        function (c) {
          let name = 'collabEmail' + c;
          collabEmails.push(
            <EmailElement
              name={name}
              label={c + (c.slice(-1) !== 's' ? "'s" : "'") + " Email"}
              onUserInput={this.setFormData}
              onUserBlur={this.validateEmail}
              toggleEmailNotify={this.toggleEmailNotify}
              errorMessage={this.state.formErrors[name]}
              required={false}
              value={this.state.formData[name]}
              addressee={c}
            />
          );
        }, this);
    }
    let createElements;
    let formClass = "col-md-12 col-lg-12";
    if (!this.props.editMode) {
      createElements = [
        <h3 className="col-md-offset-3 col-lg-offset-3">Propose a new project</h3>,
        <TextboxElement
          name="title"
          label="Title"
          onUserInput={this.setFormData}
          required={true}
          value={this.state.formData.title}
        />
      ];
      // if in edit mode, max out form size to better match
      // creation display
      formClass = "col-md-8 col-lg-7";
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
              Data={this.state.Data}
              formData={this.state.formData}
              formErrors={this.state.formErrors}
              numFiles={this.state.numFiles}
              setFormData={this.setFormData}
              setFileData={this.setFileData}
              addListItem={this.addListItem}
              removeListItem={this.removeListItem}
              validateEmail={this.validateEmail}
              toggleEmailNotify={this.toggleEmailNotify}
              editMode={false}
            />
          </FormElement>
        </div>
      </div>
    );
  }
}

export default PublicationUploadForm;
