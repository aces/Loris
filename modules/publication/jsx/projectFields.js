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

// This class combines the common form elements between
// Edit mode and initial Project Proposal/Creation mode
class ProjectFormFields extends React.Component {
  constructor() {
    super();
    this.createCollabEmailFields = this.createCollabEmailFields.bind(this);
    this.createVOIOptions = this.createVOIOptions.bind(this);
  }

  createCollabEmailFields() {
    let collabEmails = [];
    if (this.props.formData.collaborators) {
      this.props.formData.collaborators.forEach(
        function (c) {
          let name = 'collabEmail' + c;
          collabEmails.push(
            <EmailElement
              name={name}
              label={c + (c.slice(-1) !== 's' ? "'s" : "'") + " Email"}
              onUserInput={this.props.setFormData}
              onUserBlur={this.props.validateEmail}
              toggleEmailNotify={this.props.toggleEmailNotify}
              errorMessage={this.props.formErrors[name]}
              required={false}
              value={this.props.formData[name]}
              addressee={c}
            />
          );
        }, this);
    }
    return collabEmails;
  }

  createVOIOptions(){
    let testNames = [];
    let allVOIs = this.props.Data.allVOIs;
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
    let inst = this.props.formData.voiInst;
    if (inst) {
      testFields = [];
      testFields[inst+'_AllFields'] = inst + '_AllFields';
      allVOIs.forEach(function(v){
        if (v.SourceFrom === inst) {
          testFields[v.Name] = v.Name;
        }
      });
    }

    return {
      testNames: testNames,
      testFields: testFields,
    };
  }

  createFileFields() {
    let fileFields = [];
    for(let i =0; i <= this.props.numFiles; i++){
      let fileName = "file_" + i;
      fileFields.push(
        <FileElement
          name={fileName}
          id="publicationUploadEl"
          onUserInput={this.props.setFileData}
          label="File to upload"
          value={this.props.formData[fileName]}
        />
      );
      if(this.props.formData[fileName]){
        let publicationType = "publicationType_" + i;
        let publicationCitation = "publicationCitation_" + i;
        let publicationVersion = "publicationVersion_" + i;
        fileFields.push (
          <div>
            <SelectElement
              name={publicationType}
              label="Publication Type"
              id="publicationTypeEl"
              onUserInput={this.props.setFormData}
              value={this.props.formData[publicationType]}
              options={this.props.Data.uploadTypes}
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

  render() {
    let collabEmails = this.createCollabEmailFields();

    let voiOptions = this.createVOIOptions();

    let fileFields = this.createFileFields();
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
          toggleEmailNotify={this.props.toggleEmailNotify}
          errorMessage={this.props.formErrors.leadInvestigatorEmail}
          required={true}
          value={this.props.formData.leadInvestigatorEmail}
          addressee="leadInvestigator"
        />
        <TagsElement
          name="usersWithEditPerm"
          id="usersWithEditPerm"
          label="Users with Edit Permission"
          options={this.props.Data.users}
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
          onUserInput={this.props.setFormData}
          onUserAdd={this.props.addListItem}
          onUserRemove={this.props.removeListItem}
          value={this.props.formData.pendingCollab}
          pendingValKey="pendingCollab"
          items={this.props.formData.collaborators}
          btnLabel="Add Collaborator"
        />
        {collabEmails}
        <TagsElement
          name="keywords"
          id="keywords"
          label="Keywords"
          onUserInput={this.props.setFormData}
          onUserAdd={this.props.addListItem}
          onUserRemove={this.props.removeListItem}
          value={this.props.formData.pendingKWItem}
          pendingValKey="pendingKWItem"
          items={this.props.formData.keywords}
          btnLabel='Add Keyword'
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
          options={voiOptions.testFields}
          pendingValKey="pendingItemVF"
          items={this.props.formData.voiFields}
          btnLabel="Add Variable of Interest"
        />
        {fileFields}
      </div>
    );
  }
}

export default ProjectFormFields;