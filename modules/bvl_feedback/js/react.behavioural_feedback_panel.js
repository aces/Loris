"use strict";

/* exported RBehaviouralFeedbackPanel */

var SliderPanel = React.createClass({
  displayName: "SliderPanel",

  render: function render() {
    return React.createElement(
      "div",
      { className: "panel-group", id: "bvl_feedback_menu" },
      React.createElement(
        "div",
        { className: "breadcrumb-panel" },
        React.createElement(
          "a",
          { className: "info" },
          "Feedback for PSCID: ",
          this.props.pscid
        )
      ),
      this.props.children
    );
  }
});

var FeedbackPanelContent = React.createClass({
  displayName: "FeedbackPanelContent",

  propTypes: {
    feedbackLevel: React.PropTypes.string.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      currentEntryToggled: null
    };
  },
  markCommentToggle: function markCommentToggle(index) {
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
  openThread: function openThread(index) {
    this.props.open_thread(index);
  },
  closeThread: function closeThread(index) {
    this.props.close_thread(index);
    this.setState({
      currentEntryToggled: null
    });
  },

  render: function render() {
    var headers = ["Type", "Author", "Status"];

    if (this.props.feedbackLevel === "instrument") {
      headers[0] = "Fieldname";
    }

    var tableHeaders = React.createElement(
      "tr",
      { className: "info" },
      headers.map(function (header, key) {
        return React.createElement(
          "td",
          { key: key },
          header
        );
      })
    );

    if (this.props.threads.length) {
      var currentEntryToggled = this.state.currentEntryToggled;
      var feedbackRows = this.props.threads.map(function (row, index) {
        var thisRowCommentToggled = currentEntryToggled === index;
        return React.createElement(FeedbackPanelRow, {
          key: row.FeedbackID,
          commentToggled: thisRowCommentToggled,
          feedbackID: row.FeedbackID,
          sessionID: this.props.sessionID,
          type: row.Type,
          commentID: this.props.commentID,
          candID: this.props.candID,
          status: row.QCStatus,
          date: row.Date,
          commentToggle: this.markCommentToggle.bind(null, index),
          fieldname: row.FieldName,
          author: row.User,
          onClickClose: this.closeThread.bind(null, index),
          onClickOpen: this.props.open_thread.bind(null, index)
        });
      }.bind(this));

      var table = React.createElement(
        "table",
        {
          id: "current_thread_table",
          className: "table table-hover table-bordered dynamictable"
        },
        React.createElement(
          "thead",
          { id: "current_thread_table_header" },
          tableHeaders
        ),
        feedbackRows
      );

      return React.createElement(
        "div",
        { className: "panel-collapse collapse in" },
        React.createElement(
          "div",
          { className: "panel-body" },
          table
        )
      );
    }

    return React.createElement(
      "div",
      { className: "panel-body" },
      "There are no threads for this user!"
    );
  }
});

var FeedbackPanelRow = React.createClass({
  displayName: "FeedbackPanelRow",

  getInitialState: function getInitialState() {
    return {
      threadEntriesToggled: false,
      threadEntriesLoaded: []
    };
  },
  componentDidMount: function componentDidMount() {
    this.loadServerState();
  },
  loadServerState: function loadServerState() {
    var that = this;

    $.ajax({
      type: "GET",
      url: loris.BaseURL + "/bvl_feedback/ajax/get_thread_entry_data.php",
      data: { feedbackID: this.props.feedbackID },
      success: function success(data) {
        that.setState({ threadEntriesLoaded: data });
      },
      error: function error(xhr, desc, err) {
        console.error(xhr);
        console.error("Details: " + desc + "\nError:" + err);
      }
    });
  },
  toggleEntries: function toggleEntries(newComment) {
    var toggle = false;
    if (newComment) {
      toggle = true;
    } else {
      toggle = !this.state.threadEntriesToggled;
    }
    this.setState({ threadEntriesToggled: toggle });
  },
  newThreadEntry: function newThreadEntry(comment) {
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
      success: function (response) {
        this.loadServerState();
        // end of success function
      }.bind(this),
      error: function error(xhr, desc, err) {
        console.error(xhr);
        console.error("Details: " + desc + "\nError:" + err);
      }
    });
  },
  render: function render() {
    var arrow = 'glyphicon glyphicon-chevron-right glyphs';
    var threadEntries = [];

    var buttonText = 'closed';
    var buttonClass = 'btn btn-success dropdown-toggle btn-sm';
    var dropdown = React.createElement(
      "li",
      null,
      React.createElement(
        "a",
        { onClick: this.props.onClickOpen },
        "Open"
      )
    );
    var commentButton = void 0;

    if (this.state.threadEntriesToggled) {
      arrow = 'glyphicon glyphicon-chevron-down glyphs';
      threadEntries = this.state.threadEntriesLoaded.map(function (entry, key) {
        return React.createElement(
          "tr",
          { key: key, className: "thread_entry" },
          React.createElement(
            "td",
            { colSpan: "100%" },
            entry.UserID,
            " on ",
            entry.TestDate,
            " commented:",
            React.createElement("br", null),
            entry.Comment
          )
        );
      });
    }

    if (this.props.status === 'opened') {
      buttonText = 'opened';
      buttonClass = 'btn btn-danger dropdown-toggle btn-sm';
      dropdown = React.createElement(
        "li",
        null,
        React.createElement(
          "a",
          { onClick: this.props.onClickClose },
          "Close"
        )
      );
      commentButton = React.createElement("span", { className: "glyphicon glyphicon-pencil",
        onClick: this.props.commentToggle });
    }

    return React.createElement(
      "tbody",
      null,
      React.createElement(
        "tr",
        null,
        this.props.fieldname ? React.createElement(
          "td",
          null,
          this.props.fieldname,
          React.createElement("br", null),
          this.props.type
        ) : React.createElement(
          "td",
          null,
          this.props.type
        ),
        React.createElement(
          "td",
          null,
          this.props.author,
          " on:",
          React.createElement("br", null),
          this.props.date
        ),
        React.createElement(
          "td",
          null,
          React.createElement(
            "div",
            { className: "btn-group" },
            React.createElement(
              "button",
              { name: "thread_button", type: "button", className: buttonClass,
                "data-toggle": "dropdown", "aria-haspopup": "true",
                "aria-expanded": "false" },
              buttonText,
              React.createElement("span", { className: "caret" })
            ),
            React.createElement(
              "ul",
              { className: "dropdown-menu" },
              dropdown
            )
          ),
          React.createElement("span", { className: arrow,
            onClick: this.toggleEntries.bind(this, false) }),
          commentButton
        )
      ),
      this.props.commentToggled ? React.createElement(CommentEntryForm, {
        user: this.props.user,
        onCommentSend: this.newThreadEntry,
        toggleThisThread: this.toggleEntries.bind(this, true)
      }) : null,
      threadEntries
    );
  }
});

var CommentEntryForm = React.createClass({
  displayName: "CommentEntryForm",

  getInitialState: function getInitialState() {
    return {
      value: ''
    };
  },
  sendComment: function sendComment() {
    this.props.onCommentSend(this.state.value);
    this.setState({
      value: "Comment added!"
    });
    this.props.toggleThisThread();
  },
  handleChange: function handleChange(event) {
    this.setState({ value: event.target.value });
  },
  render: function render() {
    return React.createElement(
      "tr",
      null,
      React.createElement(
        "td",
        { colSpan: "100%" },
        "Add a thread entry:",
        React.createElement(
          "div",
          { className: "input-group", style: { width: '100%' } },
          React.createElement("textarea", {
            className: "form-control",
            value: this.state.value,
            style: { resize: 'none' },
            rows: "2",
            ref: "threadEntry",
            onChange: this.handleChange }),
          React.createElement(
            "span",
            {
              className: "input-group-addon btn btn-primary",
              onClick: this.sendComment
            },
            "Send"
          )
        )
      )
    );
  }

});

var AccordionPanel = React.createClass({
  displayName: "AccordionPanel",

  getInitialState: function getInitialState() {
    return {
      toggled: false
    };
  },
  toggleChange: function toggleChange() {
    this.setState({
      toggled: !this.state.toggled
    });
  },
  render: function render() {
    var panelBodyClass = "panel-collapse collapse in";
    var arrowClass = void 0;

    if (this.state.toggled) {
      panelBodyClass = "panel-collapse collapse";
      arrowClass = "collapsed";
    }

    return React.createElement(
      "div",
      { className: "panel-group", id: "accordion" },
      React.createElement(
        "div",
        { className: "panel panel-default" },
        React.createElement(
          "div",
          { className: "panel-heading" },
          React.createElement(
            "h4",
            { className: "panel-title" },
            React.createElement(
              "a",
              { className: arrowClass, onClick: this.toggleChange },
              this.props.title
            )
          )
        ),
        React.createElement(
          "div",
          { className: panelBodyClass },
          this.props.children
        )
      )
    );
  }
});

var NewThreadPanel = React.createClass({
  displayName: "NewThreadPanel",

  propTypes: {
    selectOptions: React.PropTypes.object
  },
  getInitialState: function getInitialState() {
    return {
      textValue: '',
      selectValue: 'Across All Fields',
      inputValue: 1
    };
  },
  handleSelectChange: function handleSelectChange(event) {
    this.setState({ selectValue: event.target.value });
  },
  handleTextChange: function handleTextChange(event) {
    this.setState({ textValue: event.target.value });
  },
  handleInputChange: function handleInputChange(event) {
    this.setState({ inputValue: event.target.value });
  },
  createNewThread: function createNewThread() {
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
        success: function (data) {
          this.setState({ textValue: "The new thread has been submitted!" });
          this.props.addThread(data);
          this.props.updateSummaryThread();
        }.bind(this),
        error: function error(xhr, desc, err) {
          console.error(xhr);
          console.error("Details: " + desc + "\nError:" + err);
        }
      });
    }
  },
  render: function render() {
    var fieldnameSelect;
    var options = [];
    for (var _key in this.props.selectOptions) {
      if (this.props.selectOptions.hasOwnProperty(_key)) {
        options.push(React.createElement(
          "option",
          { key: _key, value: _key },
          this.props.selectOptions[_key]
        ));
      }
    }

    if (this.props.feedbackLevel === "instrument") {
      fieldnameSelect = React.createElement(
        "div",
        { className: "form-group" },
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "label",
            { className: "col-xs-4" },
            "Field Name"
          ),
          React.createElement(
            "div",
            { className: "col-xs-8" },
            React.createElement(
              "select",
              {
                className: "form-control",
                name: "inputType",
                selected: this.state.selectValue,
                onChange: this.handleSelectChange
              },
              options
            )
          )
        )
      );
    }

    var feedbackTypes = this.props.feedbackTypes;
    var input = [];
    for (var key in feedbackTypes) {
      if (feedbackTypes.hasOwnProperty(key)) {
        input.push(React.createElement(
          "option",
          { key: key, value: feedbackTypes[key].Type },
          feedbackTypes[key].Label
        ));
      }
    }

    return React.createElement(
      "div",
      { className: "panel-body", id: "new_feedback" },
      React.createElement(
        "div",
        { className: "form-group" },
        React.createElement("textarea", {
          className: "form-control",
          rows: "4",
          id: "comment",
          value: this.state.textValue,
          onChange: this.handleTextChange })
      ),
      fieldnameSelect,
      React.createElement(
        "div",
        { className: "form-group" },
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "label",
            { className: "col-xs-4" },
            "Feedback Type"
          ),
          React.createElement(
            "div",
            { className: "col-xs-8" },
            React.createElement(
              "select",
              {
                name: "input",
                selected: this.state.inputValue,
                onChange: this.handleInputChange,
                className: "form-control"
              },
              input
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "form-group" },
        React.createElement(
          "button",
          {
            id: "save_data",
            onClick: this.createNewThread,
            className: "btn btn-default pull-right btn-sm"
          },
          "Save data"
        )
      )
    );
  }
});

var FeedbackSummaryPanel = React.createClass({
  displayName: "FeedbackSummaryPanel",

  getInitialState: function getInitialState() {
    return {
      summary: null
    };
  },
  render: function render() {
    var summaryRows = [];

    if (this.props.summary_data) {
      summaryRows = this.props.summary_data.map(function (row, key) {
        return React.createElement(
          "tr",
          { key: key },
          React.createElement(
            "td",
            null,
            row.QC_Class
          ),
          React.createElement(
            "td",
            null,
            React.createElement(
              "a",
              { href: loris.BaseURL + "/" + row.Instrument + "/?candID=" + row.CandID + "&sessionID=" + row.SessionID + "&commentID=" + row.CommentID
              },
              row.Instrument
            )
          ),
          React.createElement(
            "td",
            null,
            React.createElement(
              "a",
              { href: loris.BaseURL + "/instrument_list/?candID=" + row.CandID + "&sessionID=" + row.SessionID
              },
              row.Visit
            )
          ),
          React.createElement(
            "td",
            null,
            row.No_Threads
          )
        );
      });
    }

    if (summaryRows === undefined || summaryRows.length === 0) {
      return React.createElement(
        "div",
        { className: "panel-body" },
        "This candidate has no behavioural feedback."
      );
    }

    return React.createElement(
      "div",
      { className: "panel-body" },
      React.createElement(
        "table",
        {
          className: "table table-hover table-bordered dynamictable" },
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            { className: "info" },
            React.createElement(
              "th",
              null,
              "QC Class"
            ),
            React.createElement(
              "th",
              null,
              "Instrument"
            ),
            React.createElement(
              "th",
              null,
              "Visit"
            ),
            React.createElement(
              "th",
              null,
              "# Threads"
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          summaryRows
        )
      )
    );
  }
});

var FeedbackPanel = React.createClass({
  displayName: "FeedbackPanel",

  getInitialState: function getInitialState() {
    return {
      threads: '',
      summary: null
    };
  },
  componentDidMount: function componentDidMount() {
    this.loadThreadServerState();
  },
  loadSummaryServerData: function loadSummaryServerData() {
    $.ajax({
      type: "POST",
      url: loris.BaseURL + "/bvl_feedback/ajax/get_bvl_feedback_summary.php",
      data: {
        candID: this.props.candID,
        sessionID: this.props.sessionID,
        commentID: this.props.commentID
      },
      success: function (data) {
        this.setState({ summary: data });
      }.bind(this),
      error: function error(xhr, desc, err) {
        console.error(xhr);
        console.error("Details: " + desc + "\nError:" + err);
      }
    });
  },
  loadThreadServerState: function loadThreadServerState() {
    $.ajax({
      type: "POST",
      url: loris.BaseURL + "/bvl_feedback/ajax/react_get_bvl_threads.php",
      data: {
        candID: this.props.candID,
        sessionID: this.props.sessionID,
        commentID: this.props.commentID,
        user: this.props.commentID
      },
      success: function (data) {
        this.setState({ threads: data });
        this.loadSummaryServerData();
      }.bind(this),
      error: function error(xhr, desc, err) {
        console.error(xhr);
        console.error("Details: " + desc + "\nError:" + err);
      }
    });
  },
  addThread: function addThread(data) {
    this.loadThreadServerState();
  },
  markThreadClosed: function markThreadClosed(index) {
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
      success: function (data) {
        this.setState({ threads: threads });
        this.loadSummaryServerData();
      }.bind(this),
      error: function error(xhr, desc, err) {
        console.error(xhr);
        console.error("Details: " + desc + "\nError:" + err);
      }
    });
  },
  markThreadOpened: function markThreadOpened(index) {
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
      success: function (data) {
        this.setState({ threads: threads });
        this.loadSummaryServerData();
      }.bind(this),
      error: function error(xhr, desc, err) {
        console.error(xhr);
        console.error("Details: " + desc + "\nError:" + err);
      }
    });
  },
  render: function render() {
    var title = "New " + this.props.feedbackLevel + " level feedback";
    return React.createElement(
      SliderPanel,
      { pscid: this.props.pscid },
      React.createElement(
        AccordionPanel,
        { title: "Open Thread Summary" },
        React.createElement(FeedbackSummaryPanel, { summary_data: this.state.summary })
      ),
      React.createElement(
        AccordionPanel,
        { title: title },
        React.createElement(NewThreadPanel, {
          selectOptions: this.props.selectOptions,
          feedbackLevel: this.props.feedbackLevel,
          candID: this.props.candID,
          sessionID: this.props.sessionID,
          commentID: this.props.commentID, addThread: this.addThread,
          updateSummaryThread: this.loadSummaryServerData,
          feedbackTypes: this.props.feedbackTypes
        })
      ),
      React.createElement(
        AccordionPanel,
        { title: "Feedback Threads" },
        React.createElement(FeedbackPanelContent, {
          threads: this.state.threads,
          close_thread: this.markThreadClosed,
          open_thread: this.markThreadOpened,
          feedbackLevel: this.props.feedbackLevel,
          candID: this.props.candID,
          sessionID: this.props.sessionID,
          commentID: this.props.commentID
        })
      )
    );
  }
});

var RBehaviouralFeedbackPanel = React.createFactory(FeedbackPanel);