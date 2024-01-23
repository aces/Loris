import Loader from 'Loader';
import Modal from 'jsx/Modal';
import CommentList from './CommentList';
import IssueUploadAttachmentForm from './attachments/uploadForm';
import AttachmentsList from './attachments/attachmentsList';
import swal from 'sweetalert2';
import Markdown from 'jsx/Markdown';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  SelectElement,
  StaticElement,
  FormElement,
  TextboxElement,
  ButtonElement,
  TextareaElement,
} from 'jsx/Form';

/**
 * Issue add/edit form
 *
 * Displays a form allowing a user to edit fields.
 * Includes functionality for both adding a new issue
 * and editing an existing issue.
 *
 * @author Caitrin Armstrong
 */
class IssueForm extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      Data: {},
      formData: {},
      submissionResult: null,
      errorMessage: null,
      isLoaded: false,
      isNewIssue: false,
      issueID: 0,
      showAttachmentUploadModal: false,
    };

    // Bind component instance to custom methods
    this.getFormData = this.getFormData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.isValidForm = this.isValidForm.bind(this);
    this.showAlertMessage = this.showAlertMessage.bind(this);
    this.closeAttachmentUploadModal = this.closeAttachmentUploadModal
                                      .bind(this);
    this.openAttachmentUploadModal = this.openAttachmentUploadModal.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.getFormData();
  }

  /**
   * Open 'Attachment Upload' Modal
   *
   * @param {object} e - Event object
   */
  openAttachmentUploadModal(e) {
    e.preventDefault();
    this.setState({showAttachmentUploadModal: true});
  }

  /**
   * Close 'Attachment Upload' Modal
   */
  closeAttachmentUploadModal() {
    this.setState({
      upload: {
        formData: {
          fileType: '',
          fileDescription: '',
        },
      },
      showAttachmentUploadModal: false,
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    // If error occurs, return a message.
    // XXX: Replace this with a UI component for 500 errors.
    if (this.state.error) {
      return <h3>An error occurred while loading the page.</h3>;
    }

    // Waiting for data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    const hasEditPermission = (
      this.state.Data.hasEditPermission ||
      this.state.Data.isOwnIssue ||
      this.state.isNewIssue
    );

    let headerText;
    let lastUpdateValue;
    let lastUpdatedByValue;
    let dateCreated;
    let submitButtonValue;
    let commentLabel;
    let isWatching = this.state.issueData.watching;
    let attachmentUploadBtn = null;
    let attachmentFileElement = null;

    const siteOptions = this.state.Data.sites;
    // Add an 'All Sites' options in the Site dropdown
    // to allow NULL value
    siteOptions['all'] = 'All Sites';

    if (this.state.isNewIssue) {
      headerText = 'Create New Issue';
      lastUpdateValue = 'Never!';
      lastUpdatedByValue = 'No-one!';
      dateCreated = 'Sometime Soon!';
      submitButtonValue = 'Submit Issue';
      commentLabel = 'Description';
      attachmentFileElement = (
        <FileElement
          name='file'
          label='Attachment for issue'
          onUserInput={this.setFormData}
          errorMessage={this.state.errorMessage}
          value={this.state.formData.file}
        />
      );
    } else {
      headerText = 'Edit Issue #' + this.state.issueData.issueID;
      lastUpdateValue = this.state.issueData.lastUpdate;
      lastUpdatedByValue = this.state.issueData.lastUpdatedBy;
      dateCreated = this.state.issueData.dateCreated;
      submitButtonValue = 'Update Issue';
      commentLabel = 'New Comment';
      attachmentUploadBtn = (
        <ButtonElement
          onUserInput={this.openAttachmentUploadModal}
          label={'Add Attachment'}
        />
      );
    }

    const fileCollection = this.state.isNewIssue || (
      <AttachmentsList issue={this.props.issue}
                       baseURL={this.props.baseURL}
                       attachments={this.state.issueData['attachments']}
                       userHasPermission={this.props.userHasPermission}
                       whoami={this.state.issueData.whoami}
      />
    );

    const commentHistory = this.state.isNewIssue || (
      <CommentList commentHistory={this.state.issueData.commentHistory} />
    );

    let header;
    let description;
    if (!this.state.isNewIssue) {
      header = (
        <div className='row'>
          <div className='col-md-6'>
            <StaticElement
              name='lastUpdate'
              label={'Last Update: '}
              ref='lastUpdate'
              text={lastUpdateValue}
            />
          </div>
          <div className='col-md-6'>
            <StaticElement
              name='lastUpdatedBy'
              label={'Last Updated By: '}
              ref='lastUpdatedBy'
              text={lastUpdatedByValue}
            />
          </div>
          <div className='col-md-6'>
            <StaticElement
              name='dateCreated'
              label={'Date Created: '}
              ref='dateCreated'
              text={dateCreated}
            />
          </div>
          <div className='col-md-6'>
            <StaticElement
              name='reporter'
              label={'Reporter: '}
              ref='reporter'
              text={this.state.issueData.reporter}
            />
          </div>
        </div>
      );

      const descr = <Markdown content={this.state.issueData.desc} />;
      description = (
        <StaticElement
          name='description'
          label='Description'
          ref='description'
          text={descr}
        />
      );
    }

    return (
      <div>
        <Modal
          title='Attachment for Issue'
          onClose={this.closeAttachmentUploadModal}
          show={this.state.showAttachmentUploadModal}
        >
          <IssueUploadAttachmentForm
            issue={this.props.issue}
            baseURL={this.props.baseURL}
          />
        </Modal>
        <FormElement
          name='issueEdit'
          onSubmit={this.handleSubmit}
        >
          <h3>{headerText}</h3>
          {header}
          <TextboxElement
            name='title'
            label='Title'
            onUserInput={this.setFormData}
            value={this.state.formData.title}
            disabled={!hasEditPermission}
            required={true}
          />
          {description}
          <SelectElement
            name='assignee'
            label='Assignee'
            emptyOption={true}
            options={this.state.Data.assignees}
            disabledOptions={this.state.Data.inactiveUsers}
            onUserInput={this.setFormData}
            disabled={!hasEditPermission}
            value={this.state.formData.assignee}
            required={false}
          />
          <SelectElement
            name='centerID'
            label='Site'
            emptyOption={true}
            options={siteOptions}
            onUserInput={this.setFormData}
            disabled={!hasEditPermission}
            value={this.state.formData.centerID}
            required={true}
          />
          <SelectElement
            name='status'
            label='Status'
            emptyOption={false}
            options={this.state.Data.statuses}
            onUserInput={this.setFormData}
            disabled={!hasEditPermission}
            value={this.state.formData.status} // todo: edit this so the options are
                                               // different if the user doesn't have
                                               // permission
          />
          <SelectElement
            name='priority'
            label='Priority'
            emptyOption={false}
            options={this.state.Data.priorities}
            onUserInput={this.setFormData}
            required={false}
            disabled={!hasEditPermission}
            value={this.state.formData.priority}
            sortByValue={false}
          />
          <SelectElement
            name='category'
            label='Category'
            emptyOption={true}
            options={this.state.Data.categories}
            onUserInput={this.setFormData}
            disabled={!hasEditPermission}
            value={this.state.formData.category}
          />
          <SelectElement
            name='module'
            label='Module'
            emptyOption={true}
            options={this.state.Data.modules}
            onUserInput={this.setFormData}
            disabled={!hasEditPermission}
            value={this.state.formData.module}
          />
          <TextboxElement
            name='PSCID'
            label='PSCID'
            onUserInput={this.setFormData}
            disabled={!hasEditPermission}
            value={this.state.formData.PSCID}
          />
          <TextboxElement
            name='visitLabel'
            label='Visit Label'
            onUserInput={this.setFormData}
            disabled={!hasEditPermission}
            value={this.state.formData.visitLabel}
          />
          <SelectElement
            name='watching'
            label='Watching?'
            emptyOption={false}
            options={{No: 'No', Yes: 'Yes'}}
            onUserInput={this.setFormData}
            value={isWatching}
          />
          <SelectElement
            name='othersWatching'
            label='Add others to watching?'
            emptyOption={true}
            autoSelect={false}
            options={this.state.Data.otherWatchers}
            onUserInput={this.setFormData}
            multiple={true}
            value={this.state.formData.othersWatching}
          />
          <TextareaElement
            name='comment'
            label={commentLabel}
            onUserInput={this.setFormData}
            value={this.state.formData.comment}
          />
          {attachmentFileElement}
          <ButtonElement label={submitButtonValue}/>
          {attachmentUploadBtn}
        </FormElement>
        {fileCollection}
        {commentHistory}
      </div>
    );
  }

  /**
   * Creates an ajax request and sets the state with the result
   */
  getFormData() {
    fetch(this.props.DataURL, {
      method: 'GET',
    }).then((response) => {
      if (!response.ok) {
        console.error(response.status);
        this.setState({
          error: 'An error occurred when loading the form!\n Error: ' +
          response.status + ' (' + response.statusText + ')',
        });
        return;
      }

      response.json().then(
        (data) => {
          let newIssue = !data.issueData.issueID;
          let formData = data.issueData;
          // ensure that if the user is at multiple sites and
          // its a new issue, the centerID (which is a dropdown)
          // is set to the empty option instead of an array of
          // the user's sites.
          if (newIssue) {
            formData.centerID = null;
            Object.keys(data.inactiveUsers).map((user) => {
              delete data.assignees[user];
            });
            data.inactiveUsers = {};
          } else {
            // if we edit an issue
            // a NULL centerID (= All Sites) is converted to the ALL Sites option
            if (formData.centerID == null) {
              formData.centerID = 'all';
            }
          }

          this.setState({
            Data: data,
            isLoaded: true,
            issueData: data.issueData,
            formData: formData,
            isNewIssue: !data.issueData.issueID,
          });
        }
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
   * Handles form submission for new issue being created
   *
   * @param {event} e form submit event
   */
  handleSubmit(e) {
    e.preventDefault();

    const state = Object.assign({}, this.state);
    // issue submissions already in progress
    if (state.submissionResult && state.isNewIssue) {
      return;
    }
    const myFormData = state.formData;
    const formRefs = this.refs;
    const formData = new FormData();

    // Validate the form
    if (!this.isValidForm(formRefs, myFormData)) {
      return;
    }

    // Prevent multiple submissions
    this.setState({submissionResult: 'pending'});

    for (let key in myFormData) {
      if (myFormData[key] !== '') {
        // All Sites selected - Ignore value to store NULL in DB
        if (myFormData['centerID'] == 'all') {
          myFormData['centerID'] = null;
        }
        formData.append(key, myFormData[key]);
      }
    }

    fetch(this.props.action, {
      method: 'POST',
      body: formData,
    }).then((response) => {
      if (!response.ok) {
        console.error(response.status);
        response.json().then((data) => {
          this.setState({submissionResult: 'error'});
          let msgType = 'error';
          const message = data.error ?? data.message;
          this.showAlertMessage(msgType, message);
        });
        return;
      }

      response.json().then((data) => {
        let msgType = 'success';
        let message = this.state.isNewIssue ?
          'You will be redirected to main page in 2 seconds!' :
          '';
        this.showAlertMessage(msgType, message);
        this.setState({
          submissionResult: 'success',
          issueID: data.issueID,
        });
      });
    }).catch((error) => {
      // Network error
      console.error(error);
      this.setState({submissionResult: 'error'});
      let msgType = 'error';
      let message = 'Failed to submit issue :(';
      this.showAlertMessage(msgType, message);
    });
  }

  /**
   * Set the form data based on state values of child elements/componenets
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setFormData(formElement, value) {
    // todo: only give valid inputs for fields given previous input to other fields
    const formDataUpdate = this.state.formData;
    formDataUpdate[formElement] = value;

    this.setState({
      formData: formDataUpdate,
    });
  }

  /**
   * Validates the form.
   * Except not entirely because PSCID and visitLabel are not validated.
   *
   * @param {object} formRefs - Object containing references to React form elements
   * @param {object} formDataToCheck - Object containing form data inputed by user
   * @return {boolean} - true if all required fields are filled, false otherwise
   */
  isValidForm(formRefs, formDataToCheck) {
    let isValidForm = true;
    const requiredFields = {
      title: null,
      assignee: null,
    };

    Object.keys(requiredFields).map(function(field) {
      if (formDataToCheck[field]) {
        requiredFields[field] = formDataToCheck[field];
      } else if (formRefs[field]) {
        formRefs[field].props.hasError = true;
        isValidForm = false;
      }
    });

    this.forceUpdate();
    return isValidForm;
  }

  /**
   * Display a success/error alert message after form submission
   *
   * @param {string} msgType - error/success message
   * @param {string} message - message content
   */
  showAlertMessage(msgType, message) {
    let type = 'success';
    let title = 'Issue updated!';
    let text = message || '';
    let timer = null;
    let confirmation = true;
    let callback = function() {
      this.setState({submissionResult: null});
    };

    if (msgType === 'success' && this.state.isNewIssue) {
      title = 'Issue created!';
      timer = 2000;
      confirmation = false;
      callback = function() {
        this.setState({
          formData: {},
          submissionResult: null,
        });
        window.location.assign('/issue_tracker');
      };
    } else if (msgType === 'error') {
      type = 'error';
      title = 'Error!';
    } else if (msgType === 'success' && !this.state.isNewIssue) {
      callback = function() {
        this.setState({submissionResult: null});
        this.getFormData();
      };
    }

    swal.fire({
      title: title,
      type: type,
      text: text,
      timer: timer,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: confirmation,
    }).then(callback.bind(this));
  }
}

IssueForm.propTypes = {
  DataURL: PropTypes.string.isRequired,
  baseURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  issue: PropTypes.string.isRequired,
  userHasPermission: PropTypes.bool,
};

export default IssueForm;

