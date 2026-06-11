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
import {withTranslation} from 'react-i18next';

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
    const {t} = this.props;

    if (Object.keys(this.state.formErrors).length > 0) {
      swal.fire(
        t('Please fix any remaining form errors before submission',
          {ns: 'publication'}),
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
          let message = (data && data.message) || t('Something went wrong!',
            {ns: 'publication'});
          swal.fire(t('Edit failed!', {ns: 'publication'}), message, 'error');
        });
        return;
      }

      swal.fire(t('Edit Successful!',
        {ns: 'publication'}), '', 'success').then(() => {
        window.location.replace(loris.BaseURL + '/publication/');
      });
    }).catch((error) => {
      // Network error
      console.error(error);
      swal.fire(t('Edit failed!', {ns: 'publication'}),
        t('Something went wrong!',
          {ns: 'publication'}), 'error');
    });
  }

  /**
   * Fetch data
   */
  fetchData() {
    const {t} = this.props;
    fetch(this.props.DataURL, {
      method: 'GET',
    }).then((response) => {
      if (!response.ok) {
        console.error(response.status);
        this.setState({
          error: t('An error occured while loading the page.', {ns: 'loris'}),
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
            uploadTypes: data.uploadTypes,
            files: data.files,
            isLoaded: true,
          });
        });
    }).catch((error) => {
      // Network error
      console.error(error);
      this.setState({
        error: t('An error occured while loading the page.', {ns: 'loris'}),
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
        label={this.props.t('Collaborators', {ns: 'publication'})}
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
        label={this.props.t('Keywords', {ns: 'publication'})}
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
        label={this.props.t('Variables Of Interest', {ns: 'publication'})}
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
          label={this.props.t('Description', {ns: 'publication'})}
          text={this.state.formData.description}
        />
        <StaticElement
          name="project"
          label={this.props.t('Project', {ns: 'loris', count: 1})}
          text={this.state.formData.projectName}
        />
        <StaticElement
          name="publishingStatus"
          label={this.props.t('Publishing Status', {ns: 'publication'})}
          text={this.state.formData.publishingStatus}
        />
        <StaticElement
          name="datePublication"
          label={this.props.t('Date Published', {ns: 'publication'})}
          text={this.state.formData.datePublication}
        />
        <StaticElement
          name="journal"
          label={this.props.t('Journal', {ns: 'publication'})}
          text={this.state.formData.journal}
        />
        <StaticElement
          name="link"
          label={this.props.t('Link', {ns: 'publication'})}
          text={this.state.formData.link}
        />
        <StaticElement
          name="leadInvestigator"
          label={this.props.t('Lead Investigator', {ns: 'publication'})}
          text={this.state.formData.leadInvestigator}
        />
        <StaticElement
          name='leadInvestigatorEmail'
          label={this.props.t('Lead Investigator Email', {ns: 'publication'})}
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
    const {t} = this.props;
    if (!this.state.isLoaded) {
      return (
        <button className="btn-info has-spinner">
          {t('Loading...', {ns: 'loris'})}
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
        label={t('Status', {ns: 'publication'})}
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
          label={t('Reason for rejection', {ns: 'publication'})}
          value={this.state.formData.rejectedReason}
          onUserInput={this.setFormData}
          required={true}
        />;
      }
      // Set review button only if user does not have edit permission
      // to avoid having 2 submit buttons
      reviewBtn = this.state.userCanEdit ?
        undefined :
        <ButtonElement label={t('Submit', {ns: 'loris'})} />;
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
        label={t('Status', {ns: 'loris'})}
        text={statusText}
      />;
      if (status === 'Rejected') {
        rejectReason = <StaticElement
          label={t('Reason for rejection', {ns: 'publication'})}
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
          label={t('Title', {ns: 'publication'})}
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
  t: PropTypes.func,
};

export default withTranslation(
  ['publication', 'loris'])(ViewProject);
