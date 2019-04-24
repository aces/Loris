class EmailElement extends React.Component {
  constructor() {
    super();
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
            value={this.props.value || ''}
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
            name={this.props.name + '_notify'}
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
  },
};

// This class combines the common form elements between
// Edit mode and initial Project Proposal/Creation mode
class ProjectFormFields extends React.Component {
  constructor() {
    super();
    this.createCollabEmailFields = this.createCollabEmailFields.bind(this);
    this.deleteUpload = this.deleteUpload.bind(this);
    this.createFileFields = this.createFileFields.bind(this);
    this.addCollaborator = this.addCollaborator.bind(this);
    this.removeCollaborator = this.removeCollaborator.bind(this);
    this.setCollaboratorEmail = this.setCollaboratorEmail.bind(this);
    this.toggleEmailNotify = this.toggleEmailNotify.bind(this);
  }

  deleteUpload(uploadID) {
    let self = this;
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this file?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, I am sure!',
      cancelButtonText: 'No, cancel it!',
    },
      function(willDelete) {
        if (willDelete) {
          let url = loris.BaseURL + '/publication/ajax/FileDelete.php?uploadID=' + uploadID;
          $.ajax(
            url,
            {
              method: 'DELETE',
              success: function() {
                self.props.fetchData();
              },
            });
        }
      });
  }

  createFileFields() {
    let fileFields = [];
    // Create download link & edit fields for existing files
    if (this.props.files) {
      this.props.files.forEach(function(f) {
        let downloadURL = loris.BaseURL + '/publication/ajax/FileDownload.php?File=' + encodeURIComponent(f.URL);
        let link = (
          <span>
            <a href={downloadURL}>{f.URL}</a>
            &nbsp;&nbsp;
            <span
              className="glyphicon glyphicon-remove"
              style={{cursor: 'pointer'}}
              onClick={() => this.deleteUpload(f.PublicationUploadID)}
            />
          </span>
        );
        let existFileFlag = 'existingUpload_';
        let pubType = existFileFlag + 'publicationType_' + f.PublicationUploadID;
        let pubCit = existFileFlag + 'publicationCitation_' + f.PublicationUploadID;
        let pubVer = existFileFlag + 'publicationVersion_' + f.PublicationUploadID;
        let pubTypeStr = this.props.uploadTypes[this.props.formData[pubType]];
        fileFields.push(
          <div>
            <StaticElement
              label={pubTypeStr}
              text={link}
            />
            <TextboxElement
              name={pubCit}
              label="Citation"
              onUserInput={this.props.setFormData}
              value={this.props.formData[pubCit]}
            />
            <TextboxElement
              name={pubVer}
              label="Publication Version"
              onUserInput={this.props.setFormData}
              value={this.props.formData[pubVer]}
            />
          </div>
        );
      }, this);
    }
    // create fields for new files
    for (let i = 0; i <= this.props.numFiles; i++) {
      let fileName = 'file_' + i;
      fileFields.push(
        <FileElement
          name={fileName}
          id={'publicationUploadEl_' + i}
          onUserInput={this.props.setFileData}
          label="File to upload"
          value={this.props.formData[fileName]}
        />
      );
      if (this.props.formData[fileName]) {
        let publicationType = 'publicationType_' + i;
        let publicationCitation = 'publicationCitation_' + i;
        let publicationVersion = 'publicationVersion_' + i;
        fileFields.push(
          <div>
            <SelectElement
              name={publicationType}
              label="Publication Type"
              onUserInput={this.props.setFormData}
              value={this.props.formData[publicationType]}
              options={this.props.uploadTypes}
              required={true}
            />
            <TextboxElement
              name={publicationCitation}
              label="Citation"
              onUserInput={this.props.setFormData}
              value={this.props.formData[publicationCitation]}
            />
            <TextboxElement
              name={publicationVersion}
              label="Publication Version"
              onUserInput={this.props.setFormData}
              value={this.props.formData[publicationVersion]}
            />
          </div>
        );
      }
    }

    return fileFields;
  }

  createCollabEmailFields() {
    let collabEmails = [];
    if (this.props.formData.collaborators) {
      this.props.formData.collaborators.forEach(
        function(c, i) {
          let name = 'collabEmail_' + c.name;
          collabEmails.push(
            <EmailElement
              name={name}
              label={c.name + (c.name.slice(-1) === 's' ? '\'' : '\'s') + ' Email'}
              onUserInput={this.setCollaboratorEmail}
              onUserBlur={this.props.validateEmail}
              toggleEmailNotify={this.toggleEmailNotify}
              errorMessage={this.props.formErrors[name]}
              required={false}
              value={this.props.formData.collaborators[i].email}
              addressee={c.name}
            />
          );
        }, this);
    }
    return collabEmails;
  }

  addCollaborator(formElement, value, pendingValKey) {
    let collaborators = this.props.formData.collaborators || [];
    collaborators.push(
      {
        name: value,
        email: null,
        notify: false,
      }
    );

    this.props.setFormData('collaborators', collaborators);
    this.props.setFormData(pendingValKey, null);
  }

  removeCollaborator(formElement, value) {
    let collaborators = this.props.formData.collaborators || [];
    collaborators = collaborators.filter((c) => c.name !== value);
    this.props.setFormData('collaborators', collaborators);
  }

  setCollaboratorEmail(formElement, value) {
    let collabName = formElement.split('_')[1];
    let collaborators = this.props.formData.collaborators;
    let i = collaborators.findIndex((c) => c.name === collabName);
    collaborators[i].email = value;
    this.props.setFormData('collaborators', collaborators);
  }

  toggleEmailNotify(e) {
    if (e.target.name.indexOf('collabEmail') > -1) {
      let collaborators = this.props.formData.collaborators;
      let collabName = e.target.value;
      let i = collaborators.findIndex((c) => c.name === collabName);
      collaborators[i].notify = !collaborators[i].notify;
      this.props.setFormData('collaborators', collaborators);
    } else if (e.target.name === 'leadInvestigatorEmail_notify') {
      let currNotify = this.props.formData.notifyLead || false;
      this.props.setFormData('notifyLead', !currNotify);
    }
  }

  render() {
    let collabEmails = this.createCollabEmailFields();
    let fileFields = this.createFileFields();

    let voiHelp = (<div>For help finding variables of interest, consult
      the <a href={loris.BaseURL + '/datadict/'}>Data Dictionary</a>
      </div>);
    let collabNames = [];
    if (this.props.formData.collaborators) {
      collabNames = this.props.formData.collaborators.map((c) => c.name);
    }

    let voiTypeOptions = {
      All: 'All',
      Behavioral: 'Behavioral',
      Imaging: 'Imaging',
    };

    const allVOIs = this.props.allVOIs;
    let voiOptions = {};
    let type = this.props.formData.voiType;
    if (type && type !== 'All') {
      voiOptions = this.props.allVOIs[type];
    } else {
      // maintain behavioral VoIs by creating an object copy
      const bvlCopy = Object.assign({}, allVOIs.Behavioral);
      voiOptions = Object.assign(bvlCopy, allVOIs.Imaging);
    }

    return (
      <div>
        <TextareaElement
          name="description"
          label="Description"
          onUserInput={this.props.setFormData}
          required={true}
          value={this.props.formData.description}
        />
        <TextboxElement
          name="leadInvestigator"
          label="Lead Investigator"
          onUserInput={this.props.setFormData}
          required={true}
          value={this.props.formData.leadInvestigator}
        />
        <EmailElement
          name="leadInvestigatorEmail"
          label="Lead Investigator Email"
          onUserInput={this.props.setFormData}
          onUserBlur={this.props.validateEmail}
          toggleEmailNotify={this.toggleEmailNotify}
          errorMessage={this.props.formErrors.leadInvestigatorEmail}
          required={true}
          value={this.props.formData.leadInvestigatorEmail}
          addressee="leadInvestigator"
        />
        <TagsElement
          name="usersWithEditPerm"
          id="usersWithEditPerm"
          label="LORIS Users with Edit Permission"
          options={this.props.users}
          useSearch={true}
          strictSearch={true}
          onUserInput={this.props.setFormData}
          onUserAdd={this.props.addListItem}
          onUserRemove={this.props.removeListItem}
          value={this.props.formData.pendingUWEP}
          pendingValKey="pendingUWEP"
          items={this.props.formData.usersWithEditPerm}
          btnLabel="Add User"
        />
        <TagsElement
          name="collaborators"
          id="collaborators"
          label="Collaborators"
          options={this.props.allCollabs}
          useSearch={true}
          strictSearch={false}
          onUserInput={this.props.setFormData}
          onUserAdd={this.addCollaborator}
          onUserRemove={this.removeCollaborator}
          value={this.props.formData.pendingCollab}
          pendingValKey="pendingCollab"
          items={collabNames}
          btnLabel="Add Collaborator"
        />
        {collabEmails}
        <TagsElement
          name="keywords"
          id="keywords"
          label="Keywords"
          options={this.props.allKWs}
          useSearch={true}
          strictSearch={false}
          onUserInput={this.props.setFormData}
          onUserAdd={this.props.addListItem}
          onUserRemove={this.props.removeListItem}
          value={this.props.formData.pendingKWItem}
          pendingValKey="pendingKWItem"
          items={this.props.formData.keywords}
          btnLabel="Add Keyword"
        />
        <SelectElement
          name="voiType"
          label="Type of Variables of Interest"
          options={voiTypeOptions}
          onUserInput={this.props.setFormData}
          value={this.props.formData.voiType}
          emptyOption={false}
        />
        <TagsElement
          name="voiFields"
          id="voiFields"
          label="Variables of Interest"
          useSearch={true}
          strictSearch={true}
          onUserInput={this.props.setFormData}
          onUserAdd={this.props.addListItem}
          onUserRemove={this.props.removeListItem}
          required={false}
          value={this.props.formData.pendingItemVF}
          options={voiOptions}
          pendingValKey="pendingItemVF"
          items={this.props.formData.voiFields}
          btnLabel="Add Variable of Interest"
        />
        <StaticElement
          text={voiHelp}
        />
        {fileFields}
        <ButtonElement label={this.props.editMode ? 'Submit' : 'Propose Project'}/>
      </div>
    );
  }
}

export default ProjectFormFields;
