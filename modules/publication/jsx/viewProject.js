import ProjectFormFields from './projectFields';
import swal from 'sweetalert2';
import PropTypes from 'prop-types';
import {
  FormElement,
  SelectElement,
  StaticElement,
  TextboxElement,
  ButtonElement,
} from 'jsx/Form';

/**
 * View project component
 */
class ViewProject extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      formData: {},
      formErrors: {},
      numFiles: 0,
      isLoaded: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.setFileData = this.setFileData.bind(this);
    this.createFileDownloadLinks = this.createFileDownloadLinks.bind(this);
    this.createMenuFilterLinks = this.createMenuFilterLinks.bind(this);
    this.createStaticComponents = this.createStaticComponents.bind(this);
    this.createEditableComponents = this.createEditableComponents.bind(this);
    this.addListItem = this.addListItem.bind(this);
    this.removeListItem = this.removeListItem.bind(this);
    this.fetchData = this.fetchData.bind(this);
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
          let message = (data && data.message) || 'Something went wrong!';
          swal.fire('Edit failed!', message, 'error');
        });
        return;
      }

      swal.fire('Edit Successful!', '', 'success');
    }).catch((error) => {
      // Network error
      console.error(error);
      swal.fire('Edit failed!', 'Something went wrong!', 'error');
    });
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
          error: 'An error occurred when loading the form!',
        });
        return;
      }

      response.json().then(
        (data) => {
          let formData = {
            title: data.title,
            description: data.description,
            project: data.project,
            projectName: data.projectName,
            publishingStatus: data.publishingStatus,
            datePublication: data.datePublication,
            journal: data.journal,
            link: data.link,
            leadInvestigator: data.leadInvestigator,
            leadInvestigatorEmail: data.leadInvestigatorEmail,
            notifyLead: false,
            status: data.status,
            voiFields: data.voi,
            keywords: data.keywords,
            collaborators: data.collaborators,
            usersWithEditPerm: data.usersWithEditPerm,
            rejectedReason: data.rejectedReason,
          };
          // set formdata for file meta data
          if (data.files) {
            data.files.forEach(function(f) {
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
              formData[pubType] = f.PublicationUploadTypeID;
              formData[pubCit] = f.Citation;
              formData[pubVer] = f.Version;
            });
          }

          this.setState({
            formData: formData,
            projectOptions: data.projectOptions,
            users: data.users,
            statusOpts: data.statusOpts,
            userCanEdit: data.userCanEdit,
            allVOIs: data.allVOIs,
            allKWs: data.allKWs,
            allCollabs: data.allCollabs,
            uploadTypes: data.uploadTypes,
            files: data.files,
            isLoaded: true,
          });
        });
    }).catch((error) => {
      // Network error
      console.error(error);
      this.setState({
        error: 'An error occurred when loading the form!',
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
   * Create file download links
   *
   * @return {JSX} - React markup for the component
   */
  createFileDownloadLinks() {
    let files = this.state.files;
    let toReturn = [];
    files.forEach(function(f) {
      let download = loris.BaseURL
                     + '/publication/files/'
                     + f.Filename;
      let link = <a href={download}>{f.Filename}</a>;
      let uploadType = this.state.uploadTypes[f.PublicationUploadTypeID];
      toReturn.push(
          <StaticElement
            label={'Download ' + uploadType}
            text={link}
          />
      );
      if (f.Citation) {
        toReturn.push(
          <StaticElement
            label="Citation"
            text={f.Citation}
          />
        );
      }
      if (f.Version) {
        toReturn.push(
          <StaticElement
            label="Version"
            text={f.Version}
          />
        );
      }
    }, this);

    return toReturn;
  }

  /**
   * Create menu filter links
   *
   * @param {string[]} stringArr
   * @param {string} filterVar
   * @return {JSX} - React markup for the component
   */
  createMenuFilterLinks(stringArr, filterVar) {
    let links = [];
    stringArr.forEach(
      function(value) {
        links.push(
          <span>
            <a
              href={loris.BaseURL + '/publication/?' + filterVar + '=' + value}
            >
              {value}
            </a>
            ; &nbsp;
          </span>
        );
      }
    );

    return links;
  }

  /**
   * Create static components
   *
   * @return {JSX} - React markup for the component
   */
  createStaticComponents() {
    let collaborators;
    let keywords;
    let vois;
    let collabLinks;
    let keywordLinks;
    let voiLinks;
    let files;

    if (this.state.formData.collaborators.length > 0) {
      collabLinks = this.createMenuFilterLinks(
        this.state.formData.collaborators.map((c) => c.name),
        'collaborators'
      );
      collaborators = <StaticElement
        name="collaborators"
        label="Collaborators"
        text={collabLinks}
      />;
    }

    if (this.state.formData.keywords.length > 0) {
      keywordLinks = this.createMenuFilterLinks(
        this.state.formData.keywords,
        'keywords'
      );
      keywords = <StaticElement
        name="keywords"
        label="Keywords"
        text={keywordLinks}
      />;
    }

    if (this.state.formData.voiFields.length > 0) {
      voiLinks = this.createMenuFilterLinks(
        this.state.formData.voiFields,
        'voi'
      );
      vois = <StaticElement
        name="variablesOfInterest"
        label="Variables of Interest"
        text={voiLinks}
      />;
    }

    if (this.state.files.length > 0) {
      files = this.createFileDownloadLinks();
    }
    return (
      <div>
        <StaticElement
          name="description"
          label="Description"
          text={this.state.formData.description}
        />
        <StaticElement
          name="project"
          label="Project"
          text={this.state.formData.projectName}
        />
        <StaticElement
          name="publishingStatus"
          label="Publishing status"
          text={this.state.formData.publishingStatus}
        />
        <StaticElement
          name="datePublication"
          label="Date published"
          text={this.state.formData.datePublication}
        />
        <StaticElement
          name="journal"
          label="Journal"
          text={this.state.formData.journal}
        />
        <StaticElement
          name="link"
          label="Link"
          text={this.state.formData.link}
        />
        <StaticElement
          name="leadInvestigator"
          label="Lead Investigator"
          text={this.state.formData.leadInvestigator}
        />
        <StaticElement
          name='leadInvestigatorEmail'
          label='Lead Investigator Email'
          text={this.state.formData.leadInvestigatorEmail}
        />
        {collaborators}
        {keywords}
        {vois}
        {files}
      </div>
   );
  }

  /**
   * Create editable components
   *
   * @return {JSX} - React markup for the component
   */
  createEditableComponents() {
    return (
      <div>
        <ProjectFormFields
          files={this.state.files}
          numFiles={this.state.numFiles}
          formData={this.state.formData}
          formErrors={this.state.formErrors}
          setFormData={this.setFormData}
          setFileData={this.setFileData}
          addListItem={this.addListItem}
          removeListItem={this.removeListItem}
          toggleEmailNotify={this.toggleEmailNotify}
          uploadTypes={this.state.uploadTypes}
          projectOptions={this.state.projectOptions}
          users={this.state.users}
          allVOIs={this.state.allVOIs}
          allKWs={this.state.allKWs}
          allCollabs={this.state.allCollabs}
          editMode={true}
          fetchData={this.fetchData}
        />
      </div>
    );
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
   * Set form data
   *
   * @param {*} formElement
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
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
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
    let statusElement;
    let rejectReason;
    let reviewBtn;
    let statusID = this.state.formData.status;
    let status = this.state.statusOpts[statusID];
    if (loris.userHasPermission('publication_approve')) {
      // if user has publication_approve permission, this means that status
      // in formData reflects the ID, not the description
      statusElement = <SelectElement
        name="status"
        label="Status"
        id="status"
        value={this.state.formData.status}
        onUserInput={this.setFormData}
        required={true}
        options={this.state.statusOpts}
        emptyOption={false}
      />;

      if (status === 'Rejected') {
        rejectReason = <TextboxElement
          name="rejectedReason"
          label="Reason for rejection"
          value={this.state.formData.rejectedReason}
          onUserInput={this.setFormData}
          required={true}
        />;
      }
      // Set review button only if user does not have edit permission
      // to avoid having 2 submit buttons
      reviewBtn = this.state.userCanEdit ?
        undefined :
        <ButtonElement label="Submit" />;
    } else {
      const statClassMap = {
        Pending: 'text-warning',
        Approved: 'text-success',
        Rejected: 'text-danger',
      };
      let statusText = (
        <span className={statClassMap[status]}>
          <strong>{status}</strong>
        </span>
      );
      statusElement = <StaticElement
        label="Status"
        text={statusText}
      />;
      if (status === 'Rejected') {
        rejectReason = <StaticElement
          label="Reason for rejection"
          text={this.state.formData.rejectedReason}
        />;
      }
    }

    let formElements;
    if (this.state.userCanEdit) {
      formElements = this.createEditableComponents();
    } else {
      formElements = this.createStaticComponents();
    }

    // only allow the title to be editable if user has editing access
    // and proposal is still unreviewed
    let title;
    if (this.state.userCanEdit && status === 'Pending') {
      title = (
        <TextboxElement
          name="title"
          label="Title"
          onUserInput={this.setFormData}
          required={true}
          value={this.state.formData.title}
        />
      );
    } else {
      title = (
        <div className="row">
          <div className="col-md-3"/>
          <h3 className="col-md-9">
            {this.state.formData.title}
          </h3>
        </div>
      );
    }

    return (
      <div className="row">
        <div className="col-md-12 col-lg-12">
          <FormElement
            name="viewProject"
            onSubmit={this.handleSubmit}
            ref="form"
          >
            {title}
            {statusElement}
            {rejectReason}
            {formElements}
            {reviewBtn}
          </FormElement>
        </div>
      </div>
    );
  }
}
ViewProject.propTypes = {
  action: PropTypes.string,
  DataURL: PropTypes.string,
};

export default ViewProject;
