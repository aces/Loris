import ProgressBar from 'ProgressBar';

class EmailElement extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleChange(e) {
    this.props.onUserInput(this.props.name, e.target.value);
  }

  handleBlur(e) {
    this.props.onUserBlur(this.props.name, e.target.value);
  }

  render() {
  let disabled = this.props.disabled ? 'disabled' : null;
  let required = this.props.required ? 'required' : null;
  let errorMessage = null;
  let requiredHTML = null;
  let elementClass = 'row form-group';

  // Add required asterix
  if (required) {
    requiredHTML = <span className="text-danger">*</span>;
  }

  // Add error message
  if (this.props.errorMessage) {
    errorMessage = <span>{this.props.errorMessage}</span>;
    elementClass = 'row form-group has-error';
  }

  return (
    <div className={elementClass}>
      <label className="col-sm-3 control-label" htmlFor={this.props.id}>
        {this.props.label}
        {requiredHTML}
      </label>
      <div className="col-sm-7">
        <input
          type="text"
          className="form-control"
          name={this.props.name}
          id={this.props.id}
          value={this.props.value || ""}
          required={required}
          disabled={disabled}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
        {errorMessage}
      </div>
      <div className="col-sm-2">
        <span>
          <input
            type="checkbox"
            onChange={this.props.toggleEmailNotify}
            value={this.props.addressee}
          />
          <span>Send email notification?</span>
        </span>
      </div>
    </div>
  );
}
}

EmailElement.defaultProps = {
  name: '',
  label: '',
  value: '',
  addressee: '',
  id: null,
  disabled: false,
  required: false,
  errorMessage: '',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
  onUserBlur: function() {
  }
};

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
      toNotify: {},
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
    if (!this.props.editMode) {
      this.fetchData();
    }
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
          uploadProgress: -1
        });
        swal("Submission Successful!", "", "success");
      }.bind(this),
      error: function(jqXHR, textStatus, errorThrown) {
        console.error(textStatus);
        swal("Something went wrong!", errorThrown, "error");
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
    toNotify[e.target.value] = e.target.checked;
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

    // build testNames array
    let testNames = [];
    let allVOIs = this.state.Data.allVOIs;
    allVOIs.forEach(
      function (v) {
        if (testNames[v.SourceFrom]) {
          return;
        }
        testNames[v.SourceFrom] = v.SourceFrom;
      }
    );
    testNames.sort();

    // Set test fields to all fields by default
    let testFields = allVOIs.map(v => v.Name);
    testFields.sort();
    
    // if an instrument has been selected, then populate the fields
    // selection with fields only relevant to the selected instrument
    let inst = this.state.formData.voiInst;
    if (inst) {
      testFields = [];
      testFields[inst+'_AllFields'] = inst + '_AllFields';
      allVOIs.forEach(function(v){
        if (v.SourceFrom === inst) {
          testFields[v.Name] = v.Name;
        }
      });
    }

    let fileFields = this.createFileFields();

    let createElements;
    if (this.props.editMode) {
      createElements = [
        <h3>Propose a new project</h3>,
        <TextboxElement
          name="title"
          label="Title"
          onUserInput={this.setFormData}
          required={true}
          value={this.state.formData.title}
        />
      ];
    }

    return (
      <div className="row">
        <div className="col-md-8 col-lg-7">
          <FormElement
            name="publicationUpload"
            onSubmit={this.handleSubmit}
            ref="form"
            fileUpload={true}
          >
            {createElements}
            <TextareaElement
              name="description"
              label="Description"
              onUserInput={this.setFormData}
              required={true}
              value={this.state.formData.description}
            />
            <TextboxElement
              name="leadInvestigator"
              label="Lead Investigator"
              onUserInput={this.setFormData}
              required={true}
              value={this.state.formData.leadInvestigator}
            />
            <EmailElement
              name="leadInvestigatorEmail"
              label="Lead Investigator Email"
              onUserInput={this.setFormData}
              onUserBlur={this.validateEmail}
              toggleEmailNotify={this.toggleEmailNotify}
              errorMessage={this.state.formErrors.leadInvestigatorEmail}
              required={true}
              value={this.state.formData.leadInvestigatorEmail}
              addressee="leadInvestigator"
            />
            <TagsElement
              name="usersWithEditPerm"
              id="usersWithEditPerm"
              label="Users with Edit Permission"
              options={this.state.Data.users}
              onUserInput={this.setFormData}
              onUserAdd={this.addListItem}
              onUserRemove={this.removeListItem}
              value={this.state.formData.pendingUWEP}
              pendingValKey="pendingUWEP"
              items={this.state.formData.usersWithEditPerm}
              btnLabel="Add User"
            />
            <TagsElement
              name="collaborators"
              id="collaborators"
              label="Collaborators"
              onUserInput={this.setFormData}
              onUserAdd={this.addListItem}
              onUserRemove={this.removeListItem}
              value={this.state.formData.pendingCollab}
              pendingValKey="pendingCollab"
              items={this.state.formData.collaborators}
              btnLabel="Add Collaborator"
            />
            {collabEmails}
            <TagsElement
              name="keywords"
              id="keywords"
              label="Keywords"
              onUserInput={this.setFormData}
              onUserAdd={this.addListItem}
              onUserRemove={this.removeListItem}
              value={this.state.formData.pendingKWItem}
              pendingValKey="pendingKWItem"
              items={this.state.formData.keywords}
              btnLabel='Add Keyword'
            />
            <div className="row form-group">
              <label className="col-sm-3 control-label"/>
              <div className="col-sm-9">
                <p className="form-control-static">
                  <strong>
                    Variables of Interest
                  </strong>
                </p>
              </div>
            </div>
            <SelectElement
              name="voiInst"
              label="Instrument"
              id="voiInst"
              onUserInput={this.setFormData}
              required={false}
              value={this.state.formData.voiInst}
              options={testNames}
            />
            <TagsElement
              name="voiFields"
              id="voiFields"
              label="Instrument Fields"
              onUserInput={this.setFormData}
              onUserAdd={this.addListItem}
              onUserRemove={this.removeListItem}
              required={false}
              value={this.state.formData.pendingItemVF}
              options={testFields}
              pendingValKey="pendingItemVF"
              items={this.state.formData.voiFields}
              btnLabel="Add Variable of Interest"
            />
            {fileFields}
            <ButtonElement label="Propose Project"/>
            <div className="row">
              <div className="col-sm-9 col-sm-offset-3">
                <ProgressBar value={this.state.uploadProgress}/>
              </div>
            </div>
          </FormElement>
        </div>
      </div>
    );
  }
}

export default PublicationUploadForm;