var SliderPanel = React.createClass({
  displayName: "SliderPanel",

  render: function () {
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
    feedback_level: React.PropTypes.string.isRequired,
    feedback_values: React.PropTypes.array
  },
  getInitialState: function () {
    return {
      currentEntryToggled: null
    };
  },
  markCommentToggle: function (index) {
    if (index == this.state.currentEntryToggled) {
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
  render: function () {

    var headers = ["Type", "Author", "Status"];

    if (this.props.feedback_level === "instrument") {
      headers[0] = "Fieldname";
    }

    var table_headers = React.createElement(
      "tr",
      { className: "info" },
      headers.map(function (header) {
        return React.createElement(
          "td",
          null,
          header
        );
      })
    );

    if (this.props.threads.length) {
      var currentEntryToggled = this.state.currentEntryToggled;

      var that = this;
      var feedbackRows = this.props.threads.map(function (row, index) {
        if (currentEntryToggled == index) {
          var thisRowCommentToggled = true;
        } else {
          var thisRowCommentToggled = false;
        }
        return React.createElement(FeedbackPanelRow, { key: row.FeedbackID,
          commentToggled: thisRowCommentToggled,
          feedbackID: row.FeedbackID,
          sessionID: that.props.sessionID,
          type: row.Type,
          commentID: that.props.commentID,
          candID: that.props.candID,
          status: row.QC_status,
          date: row.Date,
          commentToggle: that.markCommentToggle.bind(this, index),
          fieldname: row.FieldName,
          author: row.User,
          onClickClose: this.closeThread.bind(this, index),
          onClickOpen: that.props.open_thread.bind(this, index)
        });
      }.bind(this));

      var table = React.createElement(
        "table",
        { id: "current_thread_table", className: "table table-hover table-primary table-bordered dynamictable" },
        React.createElement(
          "thead",
          { id: "current_thread_table_header" },
          table_headers
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
    } else {
      return React.createElement(
        "div",
        { className: "panel-body" },
        "There are no threads for this user!"
      );
    }
  }
});

var FeedbackPanelRow = React.createClass({
  displayName: "FeedbackPanelRow",

  getInitialState: function () {
    return {
      thread_entries_toggled: false,
      thread_entries_loaded: [],
      thread_comment_toggled: false
    };
  },
  componentDidMount: function () {
    this.loadServerState();
  },
  loadServerState: function () {
    var that = this;

    request = $.ajax({
      type: "GET",
      url: loris.BaseURL + "/bvl_feedback/ajax/get_thread_entry_data.php",
      data: {
        "feedbackID": this.props.feedbackID
      },
      success: function (data) {
        that.setState({ thread_entries_loaded: data });
      },
      error: function (xhr, desc, err) {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
      }
    });
  },
  toggle_entries: function (newComment) {
    var toggle = false;
    if (newComment) {
      toggle = true;
    } else {
      toggle = !this.state.thread_entries_toggled;
    }
    this.setState({ thread_entries_toggled: toggle });
  },
  toggle_thread_comment: function () {

    this.setState({ thread_comment_toggled: !this.state.thread_comment_toggled });
  },
  new_thread_entry: function (comment) {

    var that = this;
    var feedbackID = this.props.feedbackID;
    var sessionID = this.props.sessionID;
    var candID = this.props.candID;

    request = $.ajax({
      type: "POST",
      url: loris.BaseURL + "/bvl_feedback/ajax/thread_comment_bvl_feedback.php",
      data: { "comment": comment,
        "feedbackID": feedbackID,
        "candID": candID },
      success: function (response) {
        that.loadServerState();
      }, //end of success function
      error: function (xhr, desc, err) {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
      }
    });
  },
  render: function () {
    var d = new Date();
    var feedbackID = this.props.feedbackID;
    if (this.state.thread_entries_toggled) {
      var arrow = 'glyphicon glyphicon-chevron-down glyphs';
      var threadEntries = this.state.thread_entries_loaded.map(function (entry) {
        return React.createElement(
          "tr",
          { className: "thread_entry" },
          React.createElement(
            "td",
            { colSpan: "100%" },
            entry.UserID,
            " on ",
            entry.TestDate,
            " commented:",
            React.createElement("br", null),
            " ",
            entry.Comment
          )
        );
      });
    } else {
      var arrow = 'glyphicon glyphicon-chevron-right glyphs';
    }

    if (this.props.status == 'closed') {
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
      var commentButton = null;
    } else if (this.props.status == 'opened') {
      var buttonText = 'opened';
      var buttonClass = 'btn btn-danger dropdown-toggle btn-sm';
      var dropdown = React.createElement(
        "li",
        null,
        React.createElement(
          "a",
          { onClick: this.props.onClickClose },
          "Close"
        )
      );
      var commentButton = React.createElement("span", { className: "glyphicon glyphicon-pencil", onClick: this.props.commentToggle });
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
              { name: "thread_button", type: "button", className: buttonClass, "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "false" },
              buttonText,
              React.createElement("span", { className: "caret" })
            ),
            React.createElement(
              "ul",
              { className: "dropdown-menu" },
              dropdown
            )
          ),
          React.createElement("span", { className: arrow, onClick: this.toggle_entries.bind(this, false) }),
          commentButton
        )
      ),
      this.props.commentToggled ? React.createElement(CommentEntryForm, { user: this.props.user, onCommentSend: this.new_thread_entry, toggleThisThread: this.toggle_entries.bind(this, true) }) : null,
      threadEntries
    );
  }
});

var CommentEntryForm = React.createClass({
  displayName: "CommentEntryForm",

  getInitialState: function () {
    return {
      value: null
    };
  },
  sendComment: function () {
    this.props.onCommentSend(this.state.value);
    this.setState({
      value: "Comment added!"
    });
    this.props.toggleThisThread();
  },
  handleChange: function (event) {
    this.setState({ value: event.target.value });
  },
  render: function () {
    var value = this.state.value;
    return React.createElement(
      "tr",
      null,
      React.createElement(
        "td",
        { colSpan: "100%" },
        "Add a thread entry :",
        React.createElement(
          "div",
          { className: "input-group", style: { width: '100%' } },
          React.createElement("textarea", { className: "form-control", value: value, style: { resize: 'none' }, rows: "2", ref: "threadEntry", onChange: this.handleChange }),
          React.createElement(
            "span",
            { className: "input-group-addon btn btn-primary", onClick: this.sendComment },
            "Send"
          )
        )
      )
    );
  }

});

var AccordionPanel = React.createClass({
  displayName: "AccordionPanel",

  getInitialState: function () {
    return {
      toggled: false
    };
  },
  toggleChange: function () {
    this.setState({
      toggled: !this.state.toggled
    });
  },
  render: function () {
    if (this.state.toggled) {
      var panel_body_class = "panel-collapse collapse";
      var arrow_class = "collapsed";
    } else {
      var panel_body_class = "panel-collapse collapse in";
      var arrow_class = null;
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
              { className: arrow_class, onClick: this.toggleChange },
              this.props.title
            )
          )
        ),
        React.createElement(
          "div",
          { className: panel_body_class },
          this.props.children
        )
      )
    );
  }
});

var NewThreadPanel = React.createClass({
  displayName: "NewThreadPanel",

  propTypes: {
    select_options: React.PropTypes.array
  },
  getInitialState: function () {
    return {
      text_value: '',
      select_value: 'Across All Fields',
      input_value: 1
    };
  },
  handleSelectChange: function (event) {
    this.setState({ select_value: event.target.value });
  },
  handleTextChange: function (event) {
    this.setState({ text_value: event.target.value });
  },
  handleInputChange: function (event) {
    this.setState({ input_value: event.target.value });
  },
  createNewThread: function () {

    var that = this;
    if (this.state.text_value.length) {
      request = $.ajax({
        type: "POST",
        url: loris.BaseURL + "/bvl_feedback/ajax/new_bvl_feedback.php",
        data: {
          "input_type": this.state.input_value,
          "field_name": this.state.select_value,
          "comment": this.state.text_value,
          "candID": this.props.candID,
          "sessionID": this.props.sessionID,
          "commentID": this.props.commentID,
          "user": this.props.commentID
        },
        success: function (data) {
          that.setState({
            text_value: "The new thread has been submitted!"
          });

          that.props.addThread(data);
          that.props.updateSummaryThread();
        },
        error: function (xhr, desc, err) {
          console.log(xhr);
          console.log("Details: " + desc + "\nError:" + err);
        }
      });
    }
  },
  render: function () {
    var options = [];
    for (var key in this.props.select_options) {
      if (this.props.select_options.hasOwnProperty(key)) {
        options.push(React.createElement(
          "option",
          { value: key },
          this.props.select_options[key]
        ));
      }
    }

    if (this.props.feedback_level == "instrument") {
      var fieldname_select = React.createElement(
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
              { className: "form-control input-sm", name: "input_type", selected: this.state.select_value, onChange: this.handleSelectChange, className: "form-control" },
              options
            )
          )
        )
      );
    }

    var feedback_types = this.props.feedback_types;
    var input = [];
    for (var key in feedback_types) {
      if (feedback_types.hasOwnProperty(key)) {
        input.push(React.createElement(
          "option",
          { value: feedback_types[key].Type },
          feedback_types[key].Label
        ));
      }
    }

    return React.createElement(
      "div",
      { className: "panel-body", id: "new_feedback" },
      React.createElement(
        "div",
        { className: "form-group" },
        React.createElement("textarea", { className: "form-control", rows: "4", id: "comment", value: this.state.text_value, onChange: this.handleTextChange })
      ),
      fieldname_select,
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
              { className: "form-control input-sm", name: "input", selected: this.state.input_value, onChange: this.handleInputChange, className: "form-control" },
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
          { id: "save_data", onClick: this.createNewThread, className: "btn btn-default pull-right btn-sm" },
          "Save data"
        )
      )
    );
  }
});

var FeedbackSummaryPanel = React.createClass({
  displayName: "FeedbackSummaryPanel",

  getInitialState: function () {
    return {
      summary: null
    };
  },
  render: function () {
    if (this.props.summary_data) {
      var summary_rows = this.props.summary_data.map(function (row) {
        return React.createElement(
          "tr",
          null,
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
              { href: loris.BaseURL + "/" + row.Instrument + "/?candID=" + row.CandID + "&sessionID=" + row.SessionID + "&commentID=" + row.CommentID },
              row.Instrument
            )
          ),
          React.createElement(
            "td",
            null,
            React.createElement(
              "a",
              { href: loris.BaseURL + "/instrument_list/?candID=" + row.CandID + "&sessionID=" + row.SessionID },
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

    if (!(summary_rows === undefined || summary_rows.length == 0)) {
      return React.createElement(
        "div",
        { className: "panel-body" },
        React.createElement(
          "table",
          { className: "table table-hover table-primary table-bordered dynamictable" },
          React.createElement(
            "thead",
            null,
            React.createElement(
              "tr",
              { className: "info" },
              React.createElement(
                "th",
                { nowrap: "nowrap" },
                "QC Class"
              ),
              React.createElement(
                "th",
                { nowrap: "nowrap" },
                "Instrument"
              ),
              React.createElement(
                "th",
                { nowrap: "nowrap" },
                "Visit"
              ),
              React.createElement(
                "th",
                { nowrap: "nowrap" },
                "# Threads"
              )
            )
          ),
          React.createElement(
            "tbody",
            null,
            summary_rows
          )
        )
      );
    } else {
      return React.createElement(
        "div",
        { className: "panel-body" },
        "This candidate has no behavioural feedback."
      );
    }
  }
});

var FeedbackPanel = React.createClass({
  displayName: "FeedbackPanel",

  getInitialState: function () {
    return {
      threads: '',
      summary: null
    };
  },
  componentDidMount: function () {
    this.loadSummaryServerData();

    var that = this;
    request = $.ajax({
      type: "POST",
      url: loris.BaseURL + "/bvl_feedback/ajax/react_get_bvl_threads.php",
      data: {
        "candID": this.props.candID,
        "sessionID": this.props.sessionID,
        "commentID": this.props.commentID,
        "user": this.props.commentID
      },
      success: function (data) {
        state = data;
        that.setState({
          threads: state
        });
      },
      error: function (xhr, desc, err) {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
      }
    });
  },
  loadSummaryServerData: function () {
    var that = this;

    request = $.ajax({
      type: "POST",
      url: loris.BaseURL + "/bvl_feedback/ajax/get_bvl_feedback_summary.php",
      data: {
        "candID": this.props.candID,
        "sessionID": this.props.sessionID,
        "commentID": this.props.commentID
      },
      success: function (data) {
        that.setState({
          summary: data
        });
      },
      error: function (xhr, desc, err) {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
      }
    });
  },
  loadThreadServerState: function () {
    var that = this;
    request = $.ajax({
      type: "POST",
      url: loris.BaseURL + "/bvl_feedback/ajax/react_get_bvl_threads.php",
      data: {
        "candID": this.props.candID,
        "sessionID": this.props.sessionID,
        "commentID": this.props.commentID,
        "user": this.props.commentID
      },
      success: function (data) {
        state = data;
        that.setState({
          threads: state
        });
        that.loadSummaryServerData();
      },
      error: function (xhr, desc, err) {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
      }
    });
  },
  addThread: function (data) {
    this.loadThreadServerState();
  },
  markThreadClosed: function (index) {
    var threads = this.state.threads;
    var entry = this.state.threads[index];
    threads.splice(index, 1);
    var feedbackID = entry.FeedbackID;
    entry.QC_status = 'closed';

    threads.push(entry);

    var that = this;

    request = $.ajax({
      type: "POST",
      url: loris.BaseURL + "/bvl_feedback/ajax/close_bvl_feedback_thread.php",
      data: {
        "candID": this.props.candID,
        "feedbackID": feedbackID
      },
      success: function (data) {
        that.setState({
          threads: threads
        });
        that.loadSummaryServerData();
      },
      error: function (xhr, desc, err) {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
      }
    });
  },
  markThreadOpened: function (index) {
    var threads = this.state.threads;
    var entry = this.state.threads[index];
    threads.splice(index, 1);
    var feedbackID = entry.FeedbackID;

    entry.QC_status = 'opened';

    threads.unshift(entry);

    var that = this;

    request = $.ajax({
      type: "POST",
      url: loris.BaseURL + "/bvl_feedback/ajax/open_bvl_feedback_thread.php",
      data: {
        "candID": this.props.candID,
        "feedbackID": feedbackID
      },
      success: function (data) {
        that.setState({
          threads: threads
        });
        that.loadSummaryServerData();
      },
      error: function (xhr, desc, err) {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
      }
    });
  },
  render: function () {
    title = "New " + this.props.feedback_level + " level feedback";
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
        React.createElement(NewThreadPanel, { select_options: this.props.select_options, feedback_level: this.props.feedback_level,
          candID: this.props.candID,
          sessionID: this.props.sessionID, commentID: this.props.commentID, addThread: this.addThread,
          updateSummaryThread: this.loadSummaryServerData, feedback_types: this.props.feedback_types })
      ),
      React.createElement(
        AccordionPanel,
        { title: "Feedback Threads" },
        React.createElement(FeedbackPanelContent, { threads: this.state.threads, close_thread: this.markThreadClosed, open_thread: this.markThreadOpened, feedback_level: this.props.feedback_level,
          candID: this.props.candID, sessionID: this.props.sessionID, commentID: this.props.commentID })
      )
    );
  }
});

RBehaviouralFeedbackPanel = React.createFactory(FeedbackPanel);