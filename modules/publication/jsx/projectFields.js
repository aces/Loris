import React from 'react';
import swal from 'sweetalert2';
import PropTypes from 'prop-types';
import {
  StaticElement,
  TagsElement,
  FileElement,
  ButtonElement,
  TextareaElement,
  TextboxElement,
  SelectElement,
  DateElement,
} from 'jsx/Form';

/**
 * Email element component
 */
class EmailElement extends React.Component {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  /**
   * Handle change
   *
   * @param {object} e - Event object
   */
  handleChange(e) {
    this.props.onUserInput(this.props.name, e.target.value);
  }

  /**
   * Handle blur
   *
   * @param {object} e - Event object
   */
  handleBlur(e) {
    this.props.onUserBlur(this.props.name, e.target.value);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
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
            type="email"
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
EmailElement.propTypes = {
  onUserInput: PropTypes.func,
  onUserBlur: PropTypes.func,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  required: PropTypes.bool,
  errorMessage: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  toggleEmailNotify: PropTypes.func,
  addressee: PropTypes.string,
};
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

/**
 * Project form fields component
 * This class combines the common form elements between
 * Edit mode and initial Project Proposal/Creation mode
 */
class ProjectFormFields extends React.Component {
  /**
   * @constructor
   */
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

  /**
   * Delete upload
   *
   * @param {number} uploadID
   */
  deleteUpload(uploadID) {
    swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this file?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, I am sure!',
      cancelButtonText: 'No, cancel it!',
    }).then((result) => {
        if (result.value) {
          let url = loris.BaseURL
                    + '/publication/ajax/FileDelete.php?uploadID='
                    + uploadID;

          fetch(url, {
            method: 'DELETE',
          }).then((response) => {
            if (!response.ok) {
              console.error(response.status);
              return;
            }

            this.props.fetchData();
          }).catch((error) => {
            console.error(error);
          });
        }
      });
  }

  /**
   * Create file fields
   *
   * @return {React.ReactElement[]} - Array of React markup for the component
   */
  createFileFields() {
    let fileFields = [];
    // Create download link & edit fields for existing files
    if (this.props.files) {
      this.props.files.forEach(function(f) {
        let downloadURL = loris.BaseURL
                          + '/publication/files/'
                          + encodeURIComponent(f.Filename);
        let link = (
          <span>
            <a href={downloadURL}>{f.Filename}</a>
            &nbsp;&nbsp;
            <span
              className="glyphicon glyphicon-remove"
              style={{cursor: 'pointer'}}
              onClick={() => this.deleteUpload(f.PublicationUploadID)}
            />
          </span>
        );
        let existFileFlag = 'existingUpload_';
        let pubType = existFileFlag
                      + 'publicationType_'
                      + f.PublicationUploadID;
        let pubCit = existFileFlag
                     + 'publicationCitation_'
                     + f.PublicationUploadID;
        let pubVer = existFileFlag
                     + 'publicationVersion_'
                     + f.PublicationUploadID;
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
        <div key={'file_element_' + i}>
          <FileElement
            name={fileName}
            id={'publicationUploadEl_' + i}
            onUserInput={this.props.setFileData}
            label="File to upload"
            value={this.props.formData[fileName]}
          />
        </div>
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

  /**
   * Create collab email fields
   *
   * @return {JSX} - React markup for the component
   */
  createCollabEmailFields() {
    let collabEmails = [];
    if (this.props.formData.collaborators) {
      this.props.formData.collaborators.forEach(
        function(c, i) {
          let name = 'collabEmail_' + c.name;
          collabEmails.push(
            <EmailElement
              name={name}
              label={c.name + (c.name.slice(-1) === 's' ?
                '\'' :
                '\'s') + ' Email'}
              onUserInput={this.setCollaboratorEmail}
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

  /**
   * Add collaborator
   *
   * @param {*} formElement
   * @param {string} value
   * @param {*} pendingValKey
   */
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

  /**
   * Remove collaborator
   *
   * @param {*} formElement
   * @param {*} value
   */
  removeCollaborator(formElement, value) {
    let collaborators = this.props.formData.collaborators || [];
    collaborators = collaborators.filter((c) => c.name !== value);
    this.props.setFormData('collaborators', collaborators);
  }

  /**
   * Set collaborator email
   *
   * @param {string} formElement
   * @param {string} value
   */
  setCollaboratorEmail(formElement, value) {
    let collabName = formElement.split('_')[1];
    let collaborators = this.props.formData.collaborators;
    let i = collaborators.findIndex((c) => c.name === collabName);
    collaborators[i].email = value;
    this.props.setFormData('collaborators', collaborators);
  }

  /**
   * Toggle email notify
   *
   * @param {object} e - Event object
   */
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

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let collabEmails = this.createCollabEmailFields();
    let fileFields = this.createFileFields();

    let voiHelp = (
      <span>
        For help finding variables of interest, consult
      the <a href={loris.BaseURL + '/datadict/'}>Data Dictionary</a>
      </span>
    );
    let collabNames = [];
    if (this.props.formData.collaborators) {
      collabNames = this.props.formData.collaborators.map((c) => c.name);
    }

    let voiTypeOptions = {
      All: 'All',
      Behavioural: 'Behavioural',
      Imaging: 'Imaging',
    };

    const publishingStatusOptions = {
      'In Progress': 'In progress',
      'Published': 'Published',
    };

    const allVOIs = this.props.allVOIs;
    let voiOptions = {};
    let type = this.props.formData.voiType;
    if (type && type !== 'All') {
      voiOptions = this.props.allVOIs[type];
    } else {
      // maintain behavioural VoIs by creating an object copy
      const bvlCopy = Object.assign({}, allVOIs.Behavioural);
      voiOptions = Object.assign(bvlCopy, allVOIs.Imaging);
    }

    const published = this.props.formData.publishingStatus==='Published';

    return (
      <div>
        <TextareaElement
          name="description"
          label="Description"
          onUserInput={this.props.setFormData}
          required={true}
          value={this.props.formData.description}
        />
        <SelectElement
          name="project"
          label="Project"
          options={this.props.projectOptions}
          onUserInput={this.props.setFormData}
          required={true}
          value={this.props.formData.project}
          emptyOption={true}
        />
        <SelectElement
          name="publishingStatus"
          label="Publishing status"
          options={publishingStatusOptions}
          onUserInput={this.props.setFormData}
          required={true}
          value={this.props.formData.publishingStatus}
          emptyOption={true}
        />
        <DateElement
          name="datePublication"
          label="Date published"
          onUserInput={this.props.setFormData}
          required={published}
          value={this.props.formData.datePublication}
          disabled={!published}
        />
        <TextboxElement
          name="journal"
          label="Journal"
          onUserInput={this.props.setFormData}
          required={published}
          value={this.props.formData.journal}
          disabled={!published}
        />
        <TextboxElement
          name="doi"
          label="DOI"
          onUserInput={this.props.setFormData}
          required={false}
          value={this.props.formData.doi}
          disabled={!published}
        />
        <TextboxElement
          name="link"
          label="Link"
          onUserInput={this.props.setFormData}
          required={published}
          value={this.props.formData.link}
          disabled={!published}
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
        <ButtonElement label={this.props.editMode ?
          'Submit' :
          'Propose Project'}
        />
      </div>
    );
  }
}
ProjectFormFields.propTypes = {
  fetchData: PropTypes.func,
  files: PropTypes.array,
  numFiles: PropTypes.number,
  setFormData: PropTypes.func,
  formData: PropTypes.object,
  uploadTypes: PropTypes.array,
  setFileData: PropTypes.func,
  formErrors: PropTypes.array,
  allVOIs: PropTypes.object,
  users: PropTypes.object,
  addListItem: PropTypes.func,
  removeListItem: PropTypes.func,
  allCollabs: PropTypes.object,
  allKWs: PropTypes.object,
  editMode: PropTypes.string,
  projectOptions: PropTypes.object,
};
export default ProjectFormFields;
