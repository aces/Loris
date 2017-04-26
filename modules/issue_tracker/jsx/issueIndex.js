/* global ReactDOM */

/**
 * Issue add/edit form
 *
 * Displays a form allowing a user to edit fields.
 * Includes functionality for both adding a new issue
 * and editing an existing issue.
 *
 * @author Caitrin Armstrong
 * */
class IssueForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      Data: [],
      formData: {},
      submissionResult: null,
      errorMessage: null,
      isLoaded: false,
      isNewIssue: false,
      issueID: 0
    };

    // Bind component instance to custom methods
    this.getFormData = this.getFormData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.isValidForm = this.isValidForm.bind(this);
    this.showAlertMessage = this.showAlertMessage.bind(this);
  }

  componentDidMount() {
    this.getFormData();
  }

  render() {
    // Data loading error
    if (this.state.error) {
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

    if (this.state.isNewIssue) {
      headerText = "Create New Issue";
      lastUpdateValue = "Never!";
      lastUpdatedByValue = "No-one!";
      dateCreated = "Sometime Soon!";
      submitButtonValue = "Submit Issue";
      commentLabel = "Description";
    } else {
      headerText = "Edit Issue #" + this.state.issueData.issueID;
      lastUpdateValue = this.state.issueData.lastUpdate;
      lastUpdatedByValue = this.state.issueData.lastUpdatedBy;
      dateCreated = this.state.issueData.dateCreated;
      submitButtonValue = "Update Issue";
      commentLabel = "New Comment";
    }

    const commentHistory = this.state.isNewIssue || (
      <CollapsibleComment commentHistory={this.state.issueData.commentHistory} />
    );

    let header;
    let description;
    if (!this.state.isNewIssue) {
      header = (
        <div className="row">
          <div className="col-md-6">
            <StaticElement
              name="lastUpdate"
              label={"Last Update: "}
              ref="lastUpdate"
              text={lastUpdateValue}
            />
          </div>
          <div className="col-md-6">
            <StaticElement
              name="lastUpdatedBy"
              label={"Last Updated By: "}
              ref="lastUpdatedBy"
              text={lastUpdatedByValue}
            />
          </div>
          <div className="col-md-6">
            <StaticElement
              name="dateCreated"
              label={"Date Created: "}
              ref="dateCreated"
              text={dateCreated}
            />
          </div>
          <div className="col-md-6">
            <StaticElement
              name="reporter"
              label={"Reporter: "}
              ref="reporter"
              text={this.state.issueData.reporter}
            />
          </div>
        </div>
      );

      description = (
        <StaticElement
          name="description"
          label="Description"
          ref="description"
          text={this.state.issueData.desc}
        />
      );
    }

    return (
      <div>
        <FormElement
          name="issueEdit"
          onSubmit={this.handleSubmit}
          ref="form"
        >
          <h3>{headerText}</h3>
          <br />
          {header}
          <br></br>
          <br></br>
          <TextboxElement
            name="title"
            label="Title"
            onUserInput={this.setFormData}
            ref="title"
            value={this.state.formData.title}
            disabled={!hasEditPermission}
            required={true}
          />
          {description}
          <SelectElement
            name="assignee"
            label="Assignee"
            emptyOption={true}
            options={this.state.Data.assignees}
            onUserInput={this.setFormData}
            ref="assignee"
            disabled={!hasEditPermission}
            value={this.state.formData.assignee}
            required={true}
          />
          <SelectElement
            name="centerID"
            label="Site"
            emptyOption={true}
            options={this.state.Data.sites}
            onUserInput={this.setFormData}
            ref="centerID"
            disabled={!hasEditPermission}
            value={this.state.formData.centerID}
          />
          <SelectElement
            name="status"
            label="Status"
            emptyOption={false}
            options={this.state.Data.statuses}
            onUserInput={this.setFormData}
            ref="status"
            disabled={!hasEditPermission}
            value={this.state.formData.status} // todo: edit this so the options are
                                               // different if the user doesn't have
                                               // permission
          />
          <SelectElement
            name="priority"
            label="Priority"
            emptyOption={false}
            options={this.state.Data.priorities}
            onUserInput={this.setFormData}
            ref="priority"
            required={false}
            disabled={!hasEditPermission}
            value={this.state.formData.priority}
          />
          <SelectElement
            name="category"
            label="Category"
            emptyOption={true}
            options={this.state.Data.categories}
            onUserInput={this.setFormData}
            ref="category"
            disabled={!hasEditPermission}
            value={this.state.formData.category}
          />
          <SelectElement
            name="module"
            label="Module"
            emptyOption={true}
            options={this.state.Data.modules}
            onUserInput={this.setFormData}
            ref="module"
            disabled={!hasEditPermission}
            value={this.state.formData.module}
          />
          <TextboxElement
            name="PSCID"
            label="PSCID"
            onUserInput={this.setFormData}
            ref="PSCID"
            disabled={!hasEditPermission}
            value={this.state.formData.PSCID}
          />
          <TextboxElement
            name="visitLabel"
            label="Visit Label"
            onUserInput={this.setFormData}
            ref="visitLabel"
            disabled={!hasEditPermission}
            value={this.state.formData.visitLabel}
          />
          <SelectElement
            name="watching"
            label="Watching?"
            emptyOption={false}
            options={{No: 'No', Yes: 'Yes'}}
            onUserInput={this.setFormData}
            ref="watching"
            value={isWatching}
          />
          <SelectElement
            name="othersWatching"
            label="Add others to watching?"
            emptyOption={true}
            options={this.state.Data.otherWatchers}
            onUserInput={this.setFormData}
            ref="watching"
            multiple={true}
            value={this.state.formData.othersWatching}
          />
          <TextareaElement
            name="comment"
            label={commentLabel}
            onUserInput={this.setFormData}
            ref="comment"
            value={this.state.formData.comment}
          />
          <ButtonElement label={submitButtonValue}/>
        </FormElement>
        {commentHistory}
      </div>
    );
  }

  /**
   * Creates an ajax request and sets the state with the result
   */
  getFormData() {
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      success: function(data) {
        this.setState({
          Data: data,
          isLoaded: true,
          issueData: data.issueData,
          formData: data.issueData,
          isNewIssue: !data.issueData.issueID
        });
      }.bind(this),
      error: function(err) {
        this.setState({
          error: "An error occurred when loading the form!\n Error: " +
          err.status + " (" + err.statusText + ")"
        });
      }.bind(this)
    });
  }

  /**
   * Handles form submission
   *
   * @param {event} e form submit event
   */
  handleSubmit(e) {
    e.preventDefault();

    // Prevent new issue submissions while one is already in progress
    if (this.state.submissionResult && this.state.isNewIssue) return;
    this.setState({submissionResult: "pending"});

    const myFormData = this.state.formData;
    const formRefs = this.refs;
    const formData = new FormData();

    // Validate the form
    if (!this.isValidForm(formRefs, myFormData)) {
      return;
    }

    for (let key in myFormData) {
      if (myFormData[key] !== "") {
        formData.append(key, myFormData[key]);
      }
    }

    $.ajax({
      type: 'POST',
      url: this.props.action,
      data: formData,
      cache: false,
      dataType: 'json',
      contentType: false,
      processData: false,
      success: function(data) {
        let msgType = 'success';
        let message = this.state.isNewIssue ? 'You will be redirected to main page in 2 seconds!' : '';
        this.showAlertMessage(msgType, message);
        this.setState({
          submissionResult: "success",
          issueID: data.issueID
        });
      }.bind(this),
      error: function(err) {
        console.error(err);
        this.setState({submissionResult: "error"});
        let msgType = 'error';
        let message = "Failed to submit issue :(";
        this.showAlertMessage(msgType, message);
      }.bind(this)
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
      formData: formDataUpdate
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
      assignee: null
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

    if (msgType === "success" && this.state.isNewIssue) {
      title = 'Issue created!';
      timer = 2000;
      confirmation = false;
      callback = function() {
        this.setState({
          formData: {},
          submissionResult: null
        });
        window.location.assign('/issue_tracker');
      };
    } else if (msgType === "error") {
      type = 'error';
      title = 'Error!';
    }

    swal({
      title: title,
      type: type,
      text: text,
      timer: timer,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: confirmation
    }, callback.bind(this));
  }
}

IssueForm.propTypes = {
  DataURL: React.PropTypes.string.isRequired,
  action: React.PropTypes.string.isRequired
};

/**
 * React component used to display a button and a collapsible list
 * with comments.
 */
class CollapsibleComment extends React.Component {

  constructor(props) {
    super(props);

    this.state = {collapsed: true};

    // Bind component instance to custom methods
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  toggleCollapsed() {
    this.setState({collapsed: !this.state.collapsed});
  }

  render() {
    const historyText = [];
    const btnCommentsLabel = (this.state.collapsed ?
      "Show Comment History" :
      "Hide Comment History");

    const hrStyle = {
      marginTop: "8px",
      marginBottom: "8px"
    };
    const colStyle = {
      paddingRight: "8px"
    };
    const commentHistory = this.props.commentHistory.clone();
    let curDateAddedF = null;
    let curDateAdded = null;
    let curAddedBy = null;
    let curState = null;
    let fieldUsed = null;
    let fieldChangeArr = null;
    commentHistory.push({
      fieldChanged: "SENTINEL",
      isSentinel: true
    });

    for (let commentID in commentHistory) {
      if (!commentHistory.hasOwnProperty(commentID)) {
        continue;
      }
      let change = commentHistory[commentID];
      let nxtState = (change.fieldChanged === "comment") ?
        "commented" : "updated";
      if (curDateAdded !== change.dateAdded || curAddedBy !== change.addedBy || change.isSentinel) {
        if (fieldChangeArr !== null) {
          fieldChangeArr.reverse();
          historyText.push(
            <div key={"comment_" + commentID}>
              <hr style={hrStyle}/>
              <b> {curAddedBy}</b>
              {curState} <small>@ {curDateAddedF}</small>
              <table>
                <tbody>
                  {fieldChangeArr}
                </tbody>
              </table>
            </div>
          );
        }
        if (change.isSentinel) {
          break;
        }
        curDateAddedF = change.dateAddedFormatted;
        curDateAdded = change.dateAdded;
        curAddedBy = change.addedBy;
        curState = nxtState;
        fieldUsed = {};
        fieldChangeArr = [];
      }
      if (nxtState === "commented") {
        fieldUsed = {};
        fieldChangeArr.push(
          <tr>
            <td>Comment:&nbsp;</td>
            <td colSpan={3}>{change.newValue}</td>
          </tr>
        );
      } else if (!fieldUsed[change.fieldChanged]) {
        fieldUsed[change.fieldChanged] = true;
        fieldChangeArr.push(
          <tr>
            <td>Set&nbsp;</td>
            <td style={colStyle}>
              <em>{change.fieldChanged}</em>
            </td>
            <td>&nbsp;to&nbsp;</td>
            <td>
              <em>{change.newValue}</em>
            </td>
          </tr>
        );
      }
    }
    return (
      <div>
        <div className="btn btn-primary"
             onClick={this.toggleCollapsed}
             data-toggle="collapse"
             data-target="#comment-history"
             style={{margin: '10px 0'}}
        >
          {btnCommentsLabel}
        </div>
        <div id="comment-history" className="collapse">
          {historyText}
        </div>
      </div>
    );
  }
}

/**
 * Render IsseForm on page load
 */
$(function() {
  const args = QueryString.get();
  const issueTracker = (
    <div className="page-issue-tracker">
      <IssueForm
        Module="issue_tracker"
        DataURL={`${loris.BaseURL}/issue_tracker/ajax/EditIssue.php?action=getData&issueID=${args.issueID}`}
        action={`${loris.BaseURL}/issue_tracker/ajax/EditIssue.php?action=edit`}
      />
    </div>
  );

  ReactDOM.render(issueTracker, document.getElementById("lorisworkspace"));
});

