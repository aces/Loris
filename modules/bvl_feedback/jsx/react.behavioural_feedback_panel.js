/* exported RBehaviouralFeedbackPanel */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import '../css/bvl_feedback_panel.css';

/**
 * Slider panel component
 */
class SliderPanel extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <div className='panel-group' id='bvl_feedback_menu'>
        <div className='breadcrumb-panel'>
          <a className='info'>
            Feedback for PSCID: {this.props.pscid}
          </a>
        </div>
        {this.props.children}
      </div>
    );
  }
}
SliderPanel.propTypes = {
  pscid: PropTypes.string,
  children: PropTypes.node,
};


/**
 * Feedback panel content component
 */
class FeedbackPanelContent extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      currentEntryToggled: null,
    };
    this.markCommentToggle = this.markCommentToggle.bind(this);
    this.openThread = this.openThread.bind(this);
    this.closeThread = this.closeThread.bind(this);
  }

  /**
   * Mark comment toggle
   *
   * @param {number} index
   */
  markCommentToggle(index) {
    if (index === this.state.currentEntryToggled) {
      this.setState({
        currentEntryToggled: null,
      });
    } else {
      this.setState({
        currentEntryToggled: index,
      });
    }
  }

  /**
   * Open thread
   *
   * @param {number} index
   */
  openThread(index) {
    this.props.open_thread(index);
  }

  /**
   * Close thread
   *
   * @param {number} index
   */
  closeThread(index) {
    this.props.close_thread(index);
    this.setState({
      currentEntryToggled: null,
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let headers = ['Type', 'Author', 'Status'];

    if (this.props.feedbackLevel === 'instrument') {
      headers[0] = 'Fieldname';
    }

    let tableHeaders = (
      <tr className='info'>
        {headers.map(function(header, key) {
          return (<td key={key}>{header}</td>);
        })}
      </tr>
    );

    if (this.props.threads.length) {
      let currentEntryToggled = this.state.currentEntryToggled;
      let feedbackRows = this.props.threads.map(function(row, index) {
        let thisRowCommentToggled = (currentEntryToggled === index);
        return (
          <FeedbackPanelRow
            key={row.FeedbackID}
            commentToggled={thisRowCommentToggled}
            feedbackID={row.FeedbackID}
            sessionID={this.props.sessionID}
            type={row.Type}
            commentID={this.props.commentID}
            candID={this.props.candID}
            status={row.QCStatus}
            date={row.Date}
            commentToggle={this.markCommentToggle.bind(null, index)}
            fieldname={row.FieldName}
            author={row.User}
            onClickClose={this.closeThread.bind(null, index)}
            onClickOpen={this.props.open_thread.bind(null, index)}
          />
        );
      }.bind(this));

      let table = (
        <table
          id="current_thread_table"
          className="table table-hover table-bordered dynamictable"
        >
          <thead id="current_thread_table_header">
            {tableHeaders}
          </thead>
          {feedbackRows}
        </table>
      );

      return (
        <div className="panel-collapse collapse in">
          <div className="panel-body">
            {table}
          </div>
        </div>
      );
    }

    return (
      <div className='panel-body'>There are no threads for this user!</div>
    );
  }
}
FeedbackPanelContent.propTypes = {
  feedbackLevel: PropTypes.string,
  threads: PropTypes.array,
  open_thread: PropTypes.func,
  close_thread: PropTypes.func,
  candID: PropTypes.string,
  commentID: PropTypes.string,
  sessionID: PropTypes.string,
  commentToggled: PropTypes.bool,
};


/**
 * Feedback panel row component
 */
class FeedbackPanelRow extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      threadEntriesToggled: this.props.status === 'opened' ? true : false,
      threadEntriesLoaded: [],
    };
    this.loadServerState = this.loadServerState.bind(this);
    this.toggleEntries = this.toggleEntries.bind(this);
    this.newThreadEntry = this.newThreadEntry.bind(this);
    this.updateThreadEntry = this.updateThreadEntry.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.loadServerState();
  }

  /**
   * Load server state
   */
  loadServerState() {
    let url = new URL(
      loris.BaseURL
      + '/bvl_feedback/ajax/get_thread_entry_data.php'
    );
    const params = {feedbackID: this.props.feedbackID};
    Object.keys(params).forEach(
      (key) => url.searchParams.append(key, params[key])
    );

    fetch(url, {
      method: 'GET',
    }).then((response) => {
      if (!response.ok) {
        console.error(response.status + ': ' + response.statusText);
        return;
      }

      response.json().then((data) =>
        this.setState({threadEntriesLoaded: data})
      );
    }).catch((error) => {
      console.error(error);
    });
  }

  /**
   * Toggle entries
   *
   * @param {boolean} result
   */
  toggleEntries(result) {
    let toggle = false;
    if (result) {
      toggle = true;
    } else {
      toggle = !this.state.threadEntriesToggled;
    }
    this.setState({threadEntriesToggled: toggle});
  }

  /**
   * New thread entry
   *
   * @param {string} comment
   */
  newThreadEntry(comment) {
    const formData = new FormData();
    formData.append('candID', this.props.candID);
    formData.append('feedbackID', this.props.feedbackID);
    formData.append('comment', comment);

    fetch(
      loris.BaseURL
      + '/bvl_feedback/ajax/thread_comment_bvl_feedback.php',
      {
        method: 'POST',
        body: formData,
      }
    ).then((response) => {
      if (!response.ok) {
        console.error(response.status + ': ' + response.statusText);
        return;
      }

      response.json().then(() =>
        this.loadServerState()
      );
    }).catch((error) => {
      console.error(error);
    });
  }

  updateThreadEntry(entryID, newComment, date) {
    const formData = new FormData();
    formData.append('entryID', entryID);
    formData.append('newComment', newComment);
    formData.append('date', date);
    fetch(
      loris.BaseURL +
      '/bvl_feedback/ajax/update_thread_comment_bvl_feedback.php',
      {
        method: 'POST',
        body: formData,
      }
    ).then(() => {
      this.loadServerState();
    }).catch((error) => {
      console.error(error);
    });
  }

  deleteThreadEntry(entryID) {
    const formData = new FormData();
    formData.append('entryID', entryID);
    fetch(
      loris.BaseURL +
      '/bvl_feedback/ajax/delete_thread_comment_bvl_feedback.php',
      {
        method: 'POST',
        body: formData,
      }
    ).then(() => {
      this.loadServerState();
    }).catch((error) => {
      console.error(error);
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let arrow = 'glyphicon glyphicon-chevron-right glyphs';
    let threadEntries = [];

    let buttonText = 'closed';
    let buttonClass = 'btn btn-success dropdown-toggle btn-sm';
    let dropdown = (<li><a onClick={this.props.onClickOpen}>Open</a></li>);
    let commentButton;

    if (this.state.threadEntriesToggled) {
      arrow = 'glyphicon glyphicon-chevron-down glyphs';
      threadEntries = this.state.threadEntriesLoaded.map((entry, key) => {
        let toggleEditComment = () => {
          let tempThreadEntriesLoaded = [...this.state.threadEntriesLoaded];
          tempThreadEntriesLoaded.forEach((threadEntry, index) => {
            if (index == key) {
              threadEntry.editComment = !threadEntry.editComment;
            } else {
              threadEntry.editComment = false;
            }
          });
          this.setState({threadEntriesLoaded: tempThreadEntriesLoaded});
        };
        return (
          <React.Fragment key={key}>
            <tr className='thread_entry'>
              <td colSpan='70%'>
                <span id='comment_author'>
                  {entry.Date} {entry.UserID}:{' '}
                </span>
                {entry.Comment}
                <span>
                  {entry.UserID === entry.current_user && <>
                    {' '}<a
                      onClick={() => {
                        toggleEditComment();
                      }}
                    >
                      <span className='glyphicon glyphicon-pencil' />
                    </a>{' '}
                    <a onClick={() => {
                      this.deleteThreadEntry(entry.EntryID);
                    }}>
                      <span className='glyphicon glyphicon-trash' />
                    </a>
                  </>}
                </span>
              </td>
            </tr>
            {entry.editComment ?
              <CommentEntryForm
                entryID={entry.EntryID}
                onCommentSend={this.updateThreadEntry}
                toggleThisThread={toggleEditComment}
                value={entry.Comment}
                date={entry.Date}
              />
            : null}
          </React.Fragment>
        );
      });
    }

    if (this.props.status === 'opened') {
      buttonText = 'opened';
      buttonClass = 'btn btn-danger dropdown-toggle btn-sm';
      dropdown = (<li><a onClick={this.props.onClickClose}>Close</a></li>);
      commentButton = (
        <span
        className='glyphicon glyphicon-comment'
        onClick={this.props.commentToggle}
      />
      );
    }

    return (
      <tbody>
        <tr>
          {this.props.fieldname ?
            <td>{this.props.fieldname}<br/>{this.props.type}</td> :
            <td>{this.props.type}</td>}
          <td>{this.props.author} on:<br/>{this.props.date}</td>
          <td>
            <div className='btn-group'>
              <button name='thread_button' type='button' className={buttonClass}
                data-toggle='dropdown' aria-haspopup='true'
                aria-expanded='false'>
                {buttonText}
                <span className='caret'></span>
              </button>
              <ul className='dropdown-menu'>
                {dropdown}
              </ul>
            </div>
            <span className={arrow}
              onClick={this.toggleEntries.bind(this, false)}></span>
            {commentButton}
          </td>
        </tr>

        {threadEntries}
        {this.props.commentToggled ?
          (<CommentEntryForm
            user={this.props.user}
            onCommentSend={this.newThreadEntry}
            toggleThisThread={this.toggleEntries.bind(this, true)}
          />) :
          null
        }
      </tbody>
    );
  }
}

FeedbackPanelRow.propTypes = {
  fieldname: PropTypes.string,
  type: PropTypes.string,
  author: PropTypes.string,
  date: PropTypes.string,
  feedbackID: PropTypes.string,
  candID: PropTypes.string,
  onClickOpen: PropTypes.func,
  status: PropTypes.string,
  onClickClose: PropTypes.func,
  commentToggle: PropTypes.func,
  user: PropTypes.string,
  commentToggled: PropTypes.bool,
};

/**
 * Comment entry form component
 */
class CommentEntryForm extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      value: props.value ? props.value : '',
      entryID: -1,
      date: '',
    };
    this.sendComment = this.sendComment.bind(this);
    this.handleChange = this.handleChange.bind(this);
    if (props.entryID) {
      this.state.entryID = props.entryID;
      this.state.date = props.date;
    }
  }

  /**
   * Send comment
   */
  sendComment() {
    if (this.state.entryID < 0) {
      this.props.onCommentSend(this.state.value);
    } else {
      this.props.onCommentSend(
        this.state.entryID,
        this.state.value,
        this.state.date
      );
    }
    this.setState({
      value: '',
      message: 'Comment added!',
    });
    this.props.toggleThisThread();
  }

  /**
   * Handle change
   *
   * @param {object} event
   */
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <tr>
        <td colSpan='100%'>
          {
            this.state.entryID < 0 ?
            <span> Add a comment: </span> :
            <span> Update comment: </span>
          }
          <div className='input-group' style={{width: '100%'}}>
            <textarea
              className='form-control'
              value={this.state.value}
              style={{resize: 'none'}}
              rows='2'
              ref='threadEntry'
              onChange={this.handleChange}>
            </textarea>
            <span
              className='input-group-addon btn btn-primary'
              onClick={this.sendComment}
            >
              Submit
            </span>
          </div>
          {this.state.message}
        </td>
      </tr>
    );
  }
}
CommentEntryForm.propTypes = {
  onCommentSend: PropTypes.func,
  toggleThisThread: PropTypes.func,
  updateThreadEntry: PropTypes.func,
  value: PropTypes.string,
  entryID: PropTypes.int,
  date: PropTypes.string,
};

/**
 * Accordion panel component
 */
class AccordionPanel extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      toggled: false,
    };
    this.toggleChange = this.toggleChange.bind(this);
  }

  /**
   * Toggle change
   */
  toggleChange() {
    this.setState({
      toggled: !(this.state.toggled),
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let panelBodyClass = 'panel-collapse collapse in';
    let arrowClass;

    if (this.state.toggled) {
      panelBodyClass = 'panel-collapse collapse';
      arrowClass = 'collapsed';
    }

    return (
      <div className='panel-group' id='accordion'>
        <div className='panel panel-default'>
          <div className='panel-heading'>
            <h4 className='panel-title'>
              <a className={arrowClass} onClick={this.toggleChange}>
                {this.props.title}
              </a>
            </h4>
          </div>
          <div className={panelBodyClass}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
AccordionPanel.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};


/**
 * New thread panel component
 */
class NewThreadPanel extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      textValue: '',
      message: '',
      selectValue: 'Across All Fields',
      inputValue: Object.keys(this.props.feedbackTypes)[0],
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.createNewThread = this.createNewThread.bind(this);
  }

  /**
   * Handle select change
   *
   * @param {object} event
   */
  handleSelectChange(event) {
    this.setState({selectValue: event.target.value});
  }

  /**
   * Handle text change
   *
   * @param {object} event
   */
  handleTextChange(event) {
    this.setState({textValue: event.target.value});
  }

  /**
   * Handle input change
   *
   * @param {object} event
   */
  handleInputChange(event) {
    this.setState({inputValue: event.target.value});
  }

  /**
   * Create new thread
   */
  createNewThread() {
    if (this.state.textValue.length) {
      const formData = new FormData();
      formData.append('candID', this.props.candID);
      formData.append('inputType', this.state.inputValue);
      formData.append('fieldName', this.state.selectValue);
      formData.append('comment', this.state.textValue);
      formData.append('sessionID', this.props.sessionID);
      formData.append('commentID', this.props.commentID);

      fetch(loris.BaseURL + '/bvl_feedback/ajax/new_bvl_feedback.php', {
        method: 'POST',
        body: formData,
      }).then((response) => {
        if (!response.ok) {
          console.error(response.status + ': ' + response.statusText);
          return;
        }

        response.json().then((data) => {
          this.setState({
            message: 'The new thread has been submitted!',
            textValue: '',
          });
          this.props.addThread(data);
          this.props.updateSummaryThread();
        });
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let fieldnameSelect;
    let options = [];
    for (let key in this.props.selectOptions) {
      if (this.props.selectOptions.hasOwnProperty(key)) {
        options.push(
          <option key={key} value={key}>{this.props.selectOptions[key]}</option>
        );
      }
    }

    if (this.props.feedbackLevel === 'instrument') {
      fieldnameSelect = (
        <div className='form-group'>
          <div className='row'>
            <label className='col-xs-4'>Field Name</label>
            <div className='col-xs-8'>
              <select
                className='form-control'
                name='inputType'
                selected={this.state.selectValue}
                onChange={this.handleSelectChange}
              >
                {options}
              </select>
            </div>
          </div>
        </div>
      );
    }

    let feedbackTypes = this.props.feedbackTypes;
    let input = [];
    for (let key in feedbackTypes) {
      if (feedbackTypes.hasOwnProperty(key)) {
        input.push(
          <option key={key} value={feedbackTypes[key].Type}>
            {feedbackTypes[key].Label}
          </option>
        );
      }
    }

    return (
      <div className='panel-body' id='new_feedback'>
        <div className='form-group'>
          <textarea
            className='form-control'
            rows='4'
            id='comment'
            value={this.state.textValue}
            onChange={this.handleTextChange}>
          </textarea>
        </div>
        {fieldnameSelect}
        <div className='form-group'>
          <div className='row'>
            <label className='col-xs-4'>Feedback Type</label>
            <div className='col-xs-8'>
              <select
                name='input'
                selected={this.state.inputValue}
                onChange={this.handleInputChange}
                className='form-control'
              >
                {input}
              </select>
            </div>
          </div>
        </div>
        <div className='form-group'>
          {this.state.message}
          <button
            id='save_data'
            onClick={this.createNewThread}
            className='btn btn-default pull-right btn-sm'
          >
            Create thread
          </button>
        </div>
      </div>
    );
  }
}
NewThreadPanel.propTypes = {
  selectOptions: PropTypes.object,
  feedbackLevel: PropTypes.string,
  feedbackTypes: PropTypes.object,
  addThread: PropTypes.func,
  updateSummaryThread: PropTypes.func,
  inputType: PropTypes.string,
  fieldName: PropTypes.string,
  comment: PropTypes.string,
  candID: PropTypes.string,
  sessionID: PropTypes.string,
  commentID: PropTypes.string,
  user: PropTypes.string,
};


/**
 * Feedback summary panel component
 */
class FeedbackSummaryPanel extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      summary: null,
    };
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let summaryRows = [];

    if (this.props.summary_data) {
      summaryRows = this.props.summary_data.map(function(row, key) {
        return (
          <tr key={key}>
            <td>{row.QC_Class}</td>
            <td>
              <a href={loris.BaseURL
                      + '/instruments/' + row.Instrument
                      + '/?candID=' + row.CandID
                      + '&sessionID=' + row.SessionID
                      + '&commentID=' + row.CommentID}
              >
                {row.Instrument}
              </a>
            </td>
            <td>
              <a href={loris.BaseURL + '/instrument_list/?candID=' +
              row.CandID + '&sessionID=' + row.SessionID}
              >
                {row.Visit}
              </a>
            </td>
            <td>{row.No_Threads}</td>
          </tr>
        );
      });
    }

    if (summaryRows === undefined || summaryRows.length === 0) {
      return (
        <div className='panel-body'>
          This candidate has no behavioural feedback.
        </div>
      );
    }

    return (
      <div className='panel-body'>
        <table
          className='table table-hover table-bordered dynamictable'>
          <thead>
            <tr className='info' key='info'>
              <th>QC Class</th>
              <th>Instrument</th>
              <th>Visit</th>
              <th># Threads</th>
            </tr>
          </thead>
          <tbody>
            {summaryRows}
          </tbody>
        </table>
      </div>
    );
  }
}
FeedbackSummaryPanel.propTypes = {
  summary_data: PropTypes.array,
};


/**
 * Feedback panel component
 */
class FeedbackPanel extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      threads: [],
      summary: null,
    };
    this.loadSummaryServerData = this.loadSummaryServerData.bind(this);
    this.loadThreadServerState = this.loadThreadServerState.bind(this);
    this.addThread = this.addThread.bind(this);
    this.markThreadClosed = this.markThreadClosed.bind(this);
    this.markThreadOpened = this.markThreadOpened.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.loadThreadServerState();
  }

  /**
   * Load summary server data
   */
  loadSummaryServerData() {
    const formData = new FormData();
    formData.append('candID', this.props.candID);
    formData.append('sessionID', this.props.sessionID);
    formData.append('commentID', this.props.commentID);

    fetch(loris.BaseURL + '/bvl_feedback/ajax/get_bvl_feedback_summary.php', {
      method: 'POST',
      body: formData,
    }).then((response) => {
      if (!response.ok) {
        console.error(response.status + ': ' + response.statusText);
        return;
      }

      response.json().then((data) =>
        this.setState({summary: data})
      );
    }).catch((error) => {
      console.error(error);
    });
  }

  /**
   * Load thread server state
   */
  loadThreadServerState() {
    const formData = new FormData();
    formData.append('candID', this.props.candID);
    formData.append('sessionID', this.props.sessionID);
    formData.append('commentID', this.props.commentID);

    fetch(loris.BaseURL + '/bvl_feedback/ajax/react_get_bvl_threads.php', {
      method: 'POST',
      body: formData,
    }).then((response) => {
      if (!response.ok) {
        console.error(response.status + ': ' + response.statusText);
        return;
      }

      response.json().then((data) => {
        this.setState({threads: data});
        this.loadSummaryServerData();
      });
    }).catch((error) => {
      console.error(error);
    });
  }

  /**
   * Add thread
   *
   * @param {*} data - Unused
   */
  addThread(data) {
    this.loadThreadServerState();
  }

  /**
   * Mark thread closed
   *
   * @param {number} index
   */
  markThreadClosed(index) {
    let threads = this.state.threads;
    let entry = this.state.threads[index];
    threads.splice(index, 1);
    let feedbackID = entry.FeedbackID;
    entry.QCStatus = 'closed';

    threads.push(entry);

    const formData = new FormData();
    formData.append('candID', this.props.candID);
    formData.append('feedbackID', feedbackID);

    fetch(loris.BaseURL + '/bvl_feedback/ajax/close_bvl_feedback_thread.php', {
      method: 'POST',
      body: formData,
    }).then((response) => {
      if (!response.ok) {
        console.error(response.status + ': ' + response.statusText);
        return;
      }
      this.setState({threads: threads});
      this.loadSummaryServerData();
      this.loadThreadServerState();
    }).catch((error) => {
      console.error(error);
    });
  }

  /**
   * Mark thread opened
   *
   * @param {number} index
   */
  markThreadOpened(index) {
    let threads = this.state.threads;
    let entry = this.state.threads[index];
    let feedbackID = entry.FeedbackID;

    entry.QCStatus = 'opened';
    threads.splice(index, 1);
    threads.unshift(entry);

    const formData = new FormData();
    formData.append('candID', this.props.candID);
    formData.append('feedbackID', feedbackID);

    fetch(loris.BaseURL + '/bvl_feedback/ajax/open_bvl_feedback_thread.php', {
      method: 'POST',
      body: formData,
    }).then((response) => {
      if (!response.ok) {
        console.error(response.status + ': ' + response.statusText);
        return;
      }
      this.setState({threads: threads});
      this.loadSummaryServerData();
      this.loadThreadServerState();
    }).catch((error) => {
      console.error(error);
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let title = 'New ' + this.props.feedbackLevel + ' level feedback';
    return (
      <SliderPanel pscid={this.props.pscid}>
        <AccordionPanel title='Open Thread Summary'>
          <FeedbackSummaryPanel summary_data={this.state.summary} />
        </AccordionPanel>
        <AccordionPanel title={title}>
          <NewThreadPanel
            selectOptions={this.props.selectOptions}
            feedbackLevel={this.props.feedbackLevel}
            candID={this.props.candID}
            sessionID={this.props.sessionID}
            commentID={this.props.commentID} addThread={this.addThread}
            updateSummaryThread={this.loadSummaryServerData}
            feedbackTypes={this.props.feedbackTypes}
          />
        </AccordionPanel>
        <AccordionPanel title='Feedback Threads'>
          <FeedbackPanelContent
            threads={this.state.threads}
            close_thread={this.markThreadClosed}
            open_thread={this.markThreadOpened}
            feedbackLevel={this.props.feedbackLevel}
            candID={this.props.candID}
            sessionID={this.props.sessionID}
            commentID={this.props.commentID}
          />
        </AccordionPanel>
      </SliderPanel>
    );
  }
}
FeedbackPanel.propTypes = {
  selectOptions: PropTypes.object,
  feedbackLevel: PropTypes.string,
  candID: PropTypes.string,
  sessionID: PropTypes.string,
  commentID: PropTypes.string,
  pscid: PropTypes.string,
  feedbackTypes: PropTypes.object,
};

let RBehaviouralFeedbackPanel = React.createFactory(FeedbackPanel);

window.FeedbackPanel = FeedbackPanel;
window.RBehaviouralFeedbackPanel = RBehaviouralFeedbackPanel;

export default FeedbackPanel;
