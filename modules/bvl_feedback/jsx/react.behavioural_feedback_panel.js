/* exported RBehaviouralFeedbackPanel */

var SliderPanel = React.createClass({
  render: function() {
    return (
      <div className="panel-group" id="bvl_feedback_menu">
        <div className="breadcrumb-panel">
          <a className="info">
            Feedback for PSCID: {this.props.pscid}
          </a>
        </div>
        {this.props.children}
      </div>
    );
  }
});

var FeedbackPanelContent = React.createClass({
  propTypes: {
    feedbackLevel: React.PropTypes.string.isRequired
  },
  getInitialState: function() {
    return {
      currentEntryToggled: null
    };
  },
  markCommentToggle: function(index) {
    if (index === this.state.currentEntryToggled) {
      this.setState({
        currentEntryToggled: null
      });
    } else {
      this.setState({
        currentEntryToggled: index
      });
    }
  },
  openThread(index) {
    this.props.open_thread(index);
  },
  closeThread(index) {
    this.props.close_thread(index);
    this.setState({
      currentEntryToggled: null
    });
  },
  render: function() {
    var headers = ["Type", "Author", "Status"];

    if (this.props.feedbackLevel === "instrument") {
      headers[0] = "Fieldname";
    }

    var tableHeaders = (
      <tr className="info">
        {headers.map(function(header, key) {
          return (<td key={key}>{header}</td>);
        })}
      </tr>
    );

    if (this.props.threads.length) {
      var currentEntryToggled = this.state.currentEntryToggled;
      var feedbackRows = this.props.threads.map(function(row, index) {
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

      var table = (
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
      <div className="panel-body">There are no threads for this user!</div>
    );
  }
});

var FeedbackPanelRow = React.createClass({
  getInitialState: function() {
    return {
      threadEntriesToggled: false,
      threadEntriesLoaded: []
    };
  },
  componentDidMount: function() {
    this.loadServerState();
  },
  loadServerState: function() {
    var that = this;

    $.ajax({
      type: "GET",
      url: loris.BaseURL + "/bvl_feedback/ajax/get_thread_entry_data.php",
      data: {feedbackID: this.props.feedbackID},
      success: function(data) {
        that.setState({threadEntriesLoaded: data});
      },
      error: function(xhr, desc, err) {
        console.error(xhr);
        console.error("Details: " + desc + "\nError:" + err);
      }
    });
  },
  toggleEntries: function(newComment) {
    var toggle = false;
    if (newComment) {
      toggle = true;
    } else {
      toggle = !this.state.threadEntriesToggled;
    }
    this.setState({threadEntriesToggled: toggle});
  },
  newThreadEntry: function(comment) {
    var feedbackID = this.props.feedbackID;
    var candID = this.props.candID;

    $.ajax({
      type: "POST",
      url: loris.BaseURL + "/bvl_feedback/ajax/thread_comment_bvl_feedback.php",
      data: {
        comment: comment,
        feedbackID: feedbackID,
        candID: candID
      },
      success: function(response) {
        this.loadServerState();
        // end of success function
      }.bind(this),
      error: function(xhr, desc, err) {
        console.error(xhr);
        console.error("Details: " + desc + "\nError:" + err);
      }
    });
  },
  render: function() {
    let arrow = 'glyphicon glyphicon-chevron-right glyphs';
    let threadEntries = [];

    let buttonText = 'closed';
    let buttonClass = 'btn btn-success dropdown-toggle btn-sm';
    let dropdown = (<li><a onClick={this.props.onClickOpen}>Open</a></li>);
    let commentButton;

    if (this.state.threadEntriesToggled) {
      arrow = 'glyphicon glyphicon-chevron-down glyphs';
      threadEntries = this.state.threadEntriesLoaded.map(function(entry, key) {
        return (
          <tr key={key} className="thread_entry">
            <td colSpan="100%">
              {entry.UserID} on {entry.TestDate} commented:<br/>
              {entry.Comment}
            </td>
          </tr>
        );
      });
    }

    if (this.props.status === 'opened') {
      buttonText = 'opened';
      buttonClass = 'btn btn-danger dropdown-toggle btn-sm';
      dropdown = (<li><a onClick={this.props.onClickClose}>Close</a></li>);
      commentButton = (
        <span className="glyphicon glyphicon-pencil"
              onClick={this.props.commentToggle}></span>
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
          <div className="btn-group">
            <button name="thread_button" type="button" className={buttonClass}
                    data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="false">
              {buttonText}
              <span className="caret"></span>
            </button>
            <ul className="dropdown-menu">
              {dropdown}
            </ul>
          </div>
          <span className={arrow}
                onClick={this.toggleEntries.bind(this, false)}></span>
          {commentButton}
        </td>
      </tr>
      {this.props.commentToggled ?
        (<CommentEntryForm
          user={this.props.user}
          onCommentSend={this.newThreadEntry}
          toggleThisThread={this.toggleEntries.bind(this, true)}
        />) :
        null
      }
      {threadEntries}
      </tbody>
    );
  }
});

var CommentEntryForm = React.createClass({
  getInitialState: function() {
    return {
      value: ''
    };
  },
  sendComment: function() {
    this.props.onCommentSend(this.state.value);
    this.setState({
      value: "Comment added!"
    });
    this.props.toggleThisThread();
  },
  handleChange: function(event) {
    this.setState({value: event.target.value});
  },
  render: function() {
    return (
      <tr>
        <td colSpan="100%">Add a thread entry:
          <div className="input-group" style={{width: '100%'}}>
            <textarea
              className="form-control"
              value={this.state.value}
              style={{resize: 'none'}}
              rows="2"
              ref="threadEntry"
              onChange={this.handleChange}>
            </textarea>
            <span
              className="input-group-addon btn btn-primary"
              onClick={this.sendComment}
            >
              Send
            </span>
          </div>
        </td>
      </tr>
    );
  }

});

var AccordionPanel = React.createClass({
  getInitialState: function() {
    return {
      toggled: false
    };
  },
  toggleChange: function() {
    this.setState({
      toggled: !(this.state.toggled)
    });
  },
  render: function() {
    let panelBodyClass = "panel-collapse collapse in";
    let arrowClass;

    if (this.state.toggled) {
      panelBodyClass = "panel-collapse collapse";
      arrowClass = "collapsed";
    }

    return (
      <div className="panel-group" id="accordion">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h4 className="panel-title">
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
});

var NewThreadPanel = React.createClass({
  propTypes: {
    selectOptions: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      textValue: '',
      selectValue: 'Across All Fields',
      inputValue: 1
    };
  },
  handleSelectChange: function(event) {
    this.setState({selectValue: event.target.value});
  },
  handleTextChange: function(event) {
    this.setState({textValue: event.target.value});
  },
  handleInputChange: function(event) {
    this.setState({inputValue: event.target.value});
  },
  createNewThread: function() {
    if (this.state.textValue.length) {
      $.ajax({
        type: "POST",
        url: loris.BaseURL + "/bvl_feedback/ajax/new_bvl_feedback.php",
        data: {
          inputType: this.state.inputValue,
          fieldName: this.state.selectValue,
          comment: this.state.textValue,
          candID: this.props.candID,
          sessionID: this.props.sessionID,
          commentID: this.props.commentID,
          user: this.props.commentID
        },
        success: function(data) {
          this.setState({textValue: "The new thread has been submitted!"});
          this.props.addThread(data);
          this.props.updateSummaryThread();
        }.bind(this),
        error: function(xhr, desc, err) {
          console.error(xhr);
          console.error("Details: " + desc + "\nError:" + err);
        }
      });
    }
  },
  render: function() {
    var fieldnameSelect;
    var options = [];
    for (let key in this.props.selectOptions) {
      if (this.props.selectOptions.hasOwnProperty(key)) {
        options.push(
          <option key={key} value={key}>{this.props.selectOptions[key]}</option>
        );
      }
    }

    if (this.props.feedbackLevel === "instrument") {
      fieldnameSelect = (
        <div className="form-group">
          <div className="row">
            <label className="col-xs-4">Field Name</label>
            <div className="col-xs-8">
              <select
                className="form-control"
                name="inputType"
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

    var feedbackTypes = this.props.feedbackTypes;
    var input = [];
    for (var key in feedbackTypes) {
      if (feedbackTypes.hasOwnProperty(key)) {
        input.push(
          <option key={key} value={feedbackTypes[key].Type}>
            {feedbackTypes[key].Label}
          </option>
        );
      }
    }

    return (
      <div className="panel-body" id="new_feedback">
        <div className="form-group">
          <textarea
            className="form-control"
            rows="4"
            id="comment"
            value={this.state.textValue}
            onChange={this.handleTextChange}>
          </textarea>
        </div>
        {fieldnameSelect}
        <div className="form-group">
          <div className="row">
            <label className="col-xs-4">Feedback Type</label>
            <div className="col-xs-8">
              <select
                name="input"
                selected={this.state.inputValue}
                onChange={this.handleInputChange}
                className="form-control"
              >
                {input}
              </select>
            </div>
          </div>
        </div>
        <div className="form-group">
          <button
            id="save_data"
            onClick={this.createNewThread}
            className="btn btn-default pull-right btn-sm"
          >
            Save data
          </button>
        </div>
      </div>
    );
  }
});

var FeedbackSummaryPanel = React.createClass({
  getInitialState: function() {
    return {
      summary: null
    };
  },
  render: function() {
    let summaryRows = [];

    if (this.props.summary_data) {
      summaryRows = this.props.summary_data.map(function(row, key) {
        return (
          <tr key={key}>
            <td>{row.QC_Class}</td>
            <td>
              <a href={loris.BaseURL + "/" + row.Instrument + "/?candID=" +
                row.CandID + "&sessionID=" + row.SessionID + "&commentID=" +
                row.CommentID}
              >
                {row.Instrument}
              </a>
            </td>
            <td>
              <a href={loris.BaseURL + "/instrument_list/?candID=" +
              row.CandID + "&sessionID=" + row.SessionID}
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
        <div className="panel-body">
          This candidate has no behavioural feedback.
        </div>
      );
    }

    return (
      <div className="panel-body">
        <table
          className="table table-hover table-bordered dynamictable">
          <thead>
            <tr className="info">
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
});

var FeedbackPanel = React.createClass({
  getInitialState: function() {
    return {
      threads: '',
      summary: null
    };
  },
  componentDidMount: function() {
    this.loadThreadServerState();
  },
  loadSummaryServerData: function() {
    $.ajax({
      type: "POST",
      url: loris.BaseURL + "/bvl_feedback/ajax/get_bvl_feedback_summary.php",
      data: {
        candID: this.props.candID,
        sessionID: this.props.sessionID,
        commentID: this.props.commentID
      },
      success: function(data) {
        this.setState({summary: data});
      }.bind(this),
      error: function(xhr, desc, err) {
        console.error(xhr);
        console.error("Details: " + desc + "\nError:" + err);
      }
    });
  },
  loadThreadServerState: function() {
    $.ajax({
      type: "POST",
      url: loris.BaseURL + "/bvl_feedback/ajax/react_get_bvl_threads.php",
      data: {
        candID: this.props.candID,
        sessionID: this.props.sessionID,
        commentID: this.props.commentID,
        user: this.props.commentID
      },
      success: function(data) {
        this.setState({threads: data});
        this.loadSummaryServerData();
      }.bind(this),
      error: function(xhr, desc, err) {
        console.error(xhr);
        console.error("Details: " + desc + "\nError:" + err);
      }
    });
  },
  addThread: function(data) {
    this.loadThreadServerState();
  },
  markThreadClosed: function(index) {
    var threads = this.state.threads;
    var entry = this.state.threads[index];
    threads.splice(index, 1);
    var feedbackID = entry.FeedbackID;
    entry.QCStatus = 'closed';

    threads.push(entry);

    $.ajax({
      type: "POST",
      url: loris.BaseURL + "/bvl_feedback/ajax/close_bvl_feedback_thread.php",
      data: {
        candID: this.props.candID,
        feedbackID: feedbackID
      },
      success: function(data) {
        this.setState({threads: threads});
        this.loadSummaryServerData();
      }.bind(this),
      error: function(xhr, desc, err) {
        console.error(xhr);
        console.error("Details: " + desc + "\nError:" + err);
      }
    });
  },
  markThreadOpened: function(index) {
    var threads = this.state.threads;
    var entry = this.state.threads[index];
    var feedbackID = entry.FeedbackID;

    entry.QCStatus = 'opened';
    threads.splice(index, 1);
    threads.unshift(entry);

    $.ajax({
      type: "POST",
      url: loris.BaseURL + "/bvl_feedback/ajax/open_bvl_feedback_thread.php",
      data: {
        candID: this.props.candID,
        feedbackID: feedbackID
      },
      success: function(data) {
        this.setState({threads: threads});
        this.loadSummaryServerData();
      }.bind(this),
      error: function(xhr, desc, err) {
        console.error(xhr);
        console.error("Details: " + desc + "\nError:" + err);
      }
    });
  },
  render: function() {
    let title = "New " + this.props.feedbackLevel + " level feedback";
    return (
      <SliderPanel pscid={this.props.pscid}>
        <AccordionPanel title="Open Thread Summary">
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
        <AccordionPanel title="Feedback Threads">
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
});

var RBehaviouralFeedbackPanel = React.createFactory(FeedbackPanel);

window.FeedbackPanel = FeedbackPanel;
window.RBehaviouralFeedbackPanel = RBehaviouralFeedbackPanel;

export default FeedbackPanel;
