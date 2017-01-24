"use strict";

/* global c3 */
/* exported GraphicsPanel, BehaviouralFeedbackTab, IncompleteCandidatesPanel,
 InstrumentConflictsPanel
 */

var PagedRowHeader = React.createClass({
  displayName: "PagedRowHeader",

  propType: {
    headerRow: React.PropTypes.array.isRequired
  },
  render: function render() {
    return React.createElement(
      "thead",
      null,
      React.createElement(
        "tr",
        { className: "info" },
        this.props.headerRow.map(function (headerColumn, key) {
          return React.createElement(
            "th",
            { key: key },
            headerColumn
          );
        })
      )
    );
  }
});

var PagedTable = React.createClass({
  displayName: "PagedTable",

  propTypes: {
    tableHeaders: React.PropTypes.array,
    tableRows: React.PropTypes.array
  },
  getInitialState: function getInitialState() {
    return {
      pageSize: 10,
      currentPage: 1
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.setState({
      currentPage: 1
    });
  },
  getPage: function getPage() {
    var start = this.state.pageSize * (this.state.currentPage - 1);
    var end = start + this.state.pageSize;

    return {
      currentPage: this.state.currentPage,
      tableRows: this.props.tableRows.slice(start, end),
      numPages: this.getNumPages(),
      handleClick: function (pageNum) {
        return function () {
          this.handlePageChange(pageNum);
        }.bind(this);
      }.bind(this)
    };
  },
  getNumPages: function getNumPages() {
    var numPages = Math.floor(this.props.tableRows.length / this.state.pageSize);
    if (this.props.tableRows.length % this.state.pageSize > 0) {
      numPages++;
    }
    return numPages;
  },
  handlePageChange: function handlePageChange(pageNum) {
    this.setState({ currentPage: pageNum });
  },
  render: function render() {
    var tableContents = "There is no data to display";
    var page = this.getPage();
    var rowsToMap = page.tableRows;
    var childrenToMap = this.props.children;

    var currentPageRows = rowsToMap.map(function (row) {
      var mapped = React.Children.map(childrenToMap, function (child) {
        return React.cloneElement(child, {
          row: row
        });
      });
      return mapped;
    });

    if (currentPageRows.length) {
      tableContents = React.createElement(
        "table",
        { className: "table table-hover table-bordered colm-freeze" },
        React.createElement(PagedRowHeader, { headerRow: this.props.tableHeaders }),
        React.createElement(
          "tbody",
          null,
          currentPageRows
        )
      );
    }

    return React.createElement(
      "div",
      null,
      tableContents,
      React.createElement(
        "nav",
        null,
        React.createElement(BVLPager, { page: page })
      )
    );
  }
});

var IncompleteCandidatesRow = React.createClass({
  displayName: "IncompleteCandidatesRow",

  handleClick: function handleClick(event) {
    event.preventDefault();
    var link = this.refs.incomplete;
    window.open(link, "Incomplete Candidate");
  },
  propTypes: {
    row: React.PropTypes.object.isRequired,
    BaseURL: React.PropTypes.string.isRequired

  },
  render: function render() {
    var row = this.props.row;
    return React.createElement(
      "tr",
      { key: row.id, onClick: this.handleClick },
      React.createElement(
        "td",
        null,
        React.createElement(
          "a",
          { href: this.props.BaseURL + "/" + row.candid + "/" + row.SessionID + "/"
          },
          row.visit_label
        )
      ),
      React.createElement(
        "td",
        null,
        React.createElement(
          "a",
          { href: this.props.BaseURL + "/" + row.candid + "/" },
          row.candid
        )
      ),
      React.createElement(
        "td",
        null,
        React.createElement(
          "a",
          { href: this.props.BaseURL + "/" + row.candid + "/" + row.SessionID + "/" + row.test_name + "/?commentID=" + row.commentid, ref: "incomplete"
          },
          row.Full_name
        )
      )
    );
  }
});

var InstrumentConflictsRow = React.createClass({
  displayName: "InstrumentConflictsRow",

  proptypes: {
    row: React.PropTypes.object.isRequired,
    BaseURL: React.PropTypes.string.isRequired
  },
  render: function render() {
    var row = this.props.row;
    var baseURL = this.props.BaseURL;
    return React.createElement(
      "tr",
      {
        key: row.CandID + row.visit_label + row.test_name_display + row.FieldName,
        onClick: this.handleClick
      },
      React.createElement(
        "td",
        null,
        row.visit_label
      ),
      React.createElement(
        "td",
        null,
        React.createElement(
          "a",
          { href: baseURL + "/" + row.CandID + "/" },
          row.CandID
        )
      ),
      React.createElement(
        "td",
        null,
        React.createElement(
          "a",
          {
            href: baseURL + "/conflict_resolver/?CandID=" + row.CandID,
            className: "conflict_resolver_link", "data-pscid": row.PSCID,
            "data-question": row.FieldName, "data-instrument": row.TableName,
            "data-visits": row.visit_label
          },
          row.test_name_display
        )
      ),
      React.createElement(
        "td",
        null,
        row.FieldName
      )
    );
  }
});

var BehaviouralFeedbackRow = React.createClass({
  displayName: "BehaviouralFeedbackRow",

  handleClick: function handleClick(event) {
    event.preventDefault();
    var link = this.refs.feedback.href;
    window.open(link, "Behavioural Feedback");
  },
  propTypes: {
    row: React.PropTypes.object.isRequired,
    BaseURL: React.PropTypes.string.isRequired
  },
  render: function render() {
    var row = this.props.row;
    var bvlLink;
    var bvlLevel;

    if (row.Feedback_level === 'visit') {
      bvlLink = this.props.BaseURL + "/" + row.CandID + "/" + row.SessionID + "/";
      bvlLevel = "Visit : " + row.Visit_label;
    }

    if (row.Feedback_level === 'instrument') {
      bvlLink = this.props.BaseURL + "/" + row.CandID + "/" + row.SessionID + "/" + row.Test_name + "/?commentID=" + row.CommentID;
      bvlLevel = "Instrument : " + row.Full_name;
    }

    if (row.Feedback_level === 'profile') {
      bvlLink = this.props.BaseURl + "/" + row.CandID + "/";
      bvlLevel = "Profile";
    }

    return React.createElement(
      "tr",
      { key: row.FeedbackID, onClick: this.handleClick },
      React.createElement(
        "td",
        null,
        React.createElement(
          "a",
          { href: this.props.BaseURL + "/" + row.CandID + "/" },
          row.CandID
        )
      ),
      React.createElement(
        "td",
        null,
        React.createElement(
          "a",
          { href: bvlLink, onClick: this.handleClick, ref: "feedback" },
          bvlLevel
        )
      ),
      React.createElement(
        "td",
        null,
        row.FieldName
      )
    );
  }
});

var DefaultPanel = React.createClass({
  displayName: 'CandidatesPanelTable',
  propTypes: {
    title: React.PropTypes.string
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "panel panel-primary" },
      React.createElement(
        "div",
        { className: "panel-heading" },
        this.props.title
      ),
      React.createElement(
        "div",
        { className: "panel-body" },
        this.props.children
      )
    );
  }
});

var IncompleteCandidates = React.createClass({
  displayName: "IncompleteCandidates",

  render: function render() {
    // The actual row is passed as a child inside PagedTable
    var row = {};
    return React.createElement(
      DefaultPanel,
      { title: this.props.title },
      React.createElement(
        PagedTable,
        {
          tableRows: this.props.incomplete_candidates,
          tableHeaders: this.props.header
        },
        React.createElement(IncompleteCandidatesRow, { row: row, BaseURL: this.props.BaseURL })
      )
    );
  }
});

var InstrumentConflicts = React.createClass({
  displayName: "InstrumentConflicts",

  render: function render() {
    // The actual row is passed as a child inside PagedTable
    var row = {};
    return React.createElement(
      DefaultPanel,
      { title: this.props.title },
      React.createElement(
        PagedTable,
        {
          tableRows: this.props.conflicts,
          tableHeaders: this.props.header
        },
        React.createElement(InstrumentConflictsRow, { row: row, BaseURL: this.props.BaseURL })
      )
    );
  }
});

var BehaviouralFeedback = React.createClass({
  displayName: "BehaviouralFeedback",

  render: function render() {
    // The actual row is passed as a child inside PagedTable
    var row = {};
    return React.createElement(
      DefaultPanel,
      { title: this.props.title },
      React.createElement(
        PagedTable,
        {
          tableRows: this.props.feedback,
          tableHeaders: this.props.header
        },
        React.createElement(BehaviouralFeedbackRow, { row: row, BaseURL: this.props.BaseURL })
      )
    );
  }
});

var BVLPager = React.createClass({
  displayName: "BVLPager",

  render: function render() {
    var page = this.props.page;
    var pageLinks = [];

    if (page.currentPage > 1) {
      pageLinks.push(React.createElement(
        "li",
        { key: 1, onClick: page.handleClick(page.currentPage - 1) },
        React.createElement(
          "span",
          null,
          "\u2039"
        )
      ));
      if (page.currentPage > 2) {
        pageLinks.push(React.createElement(
          "li",
          { key: 2, onClick: page.handleClick(1) },
          React.createElement(
            "span",
            null,
            "1"
          )
        ));
        pageLinks.push(React.createElement(
          "li",
          { key: 3 },
          React.createElement(
            "span",
            null,
            "..."
          )
        ));
      }
    }

    if (page.numPages > 1) {
      pageLinks.push(React.createElement(
        "li",
        { key: 4, className: "active" },
        React.createElement(
          "span",
          null,
          page.currentPage
        )
      ));
    }

    if (page.currentPage < page.numPages) {
      pageLinks.push(React.createElement(
        "li",
        { key: 5, onClick: page.handleClick(page.currentPage + 1) },
        React.createElement(
          "span",
          null,
          page.currentPage + 1
        )
      ));

      if (page.currentPage < page.numPages - 1) {
        pageLinks.push(React.createElement(
          "li",
          { key: 6, onClick: page.handleClick(page.currentPage + 2) },
          React.createElement(
            "span",
            null,
            page.currentPage + 2
          )
        ));
      }

      if (page.currentPage < page.numPages - 2) {
        pageLinks.push(React.createElement(
          "li",
          { key: 7, onClick: page.handleClick(page.currentPage + 3) },
          React.createElement(
            "span",
            null,
            page.currentPage + 3
          )
        ));
      }

      if (page.currentPage < page.numPages - 3) {
        pageLinks.push(React.createElement(
          "li",
          { key: 8 },
          React.createElement(
            "span",
            null,
            "..."
          )
        ));
        pageLinks.push(React.createElement(
          "li",
          { key: 9, onClick: page.handleClick(page.numPages) },
          React.createElement(
            "span",
            null,
            page.numPages
          )
        ));
      }

      pageLinks.push(React.createElement(
        "li",
        { key: 10, onClick: page.handleClick(page.currentPage + 1) },
        React.createElement(
          "span",
          { "aria-hidden": "true" },
          "\u203A"
        )
      ));
    }
    return React.createElement(
      "ul",
      { className: "pagination pagination-sm" },
      pageLinks
    );
  }
});

var dataTeamGraphics = React.createClass({
  displayName: "dataTeamGraphics",

  componentDidMount: function componentDidMount() {
    c3.generate({
      bindto: '#completedChart',
      data: {
        columns: [['data', this.props.percentCompleted]],
        type: 'gauge'
      },
      color: {
        // the three color levels for the percentage values.
        pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'],
        threshold: {
          // unit: 'value', // percentage is default
          // max: 200, // 100 is default
          values: [30, 60, 90, 100]
        }
      }
    });
  },
  render: function render() {
    var pscidStatus = this.props.pscid ? "Candidate " + this.props.pscid : "All Candidates";
    var visitStatus = this.props.visit ? "On " + this.props.visit : "Across All Visits";
    var instrumentStatus = this.props.instrument ? "On Instrument " + this.props.instrument : "Across All Instruments";

    return React.createElement(
      "div",
      { className: "col-sm-12 col-md-5" },
      React.createElement(
        "div",
        { className: "panel panel-primary" },
        React.createElement(
          "div",
          { className: "panel-heading" },
          "At A Glance: ",
          pscidStatus,
          " - ",
          visitStatus,
          " - ",
          instrumentStatus
        ),
        React.createElement(
          "div",
          { className: "panel-body" },
          React.createElement("div", { id: "completedChart" })
        )
      )
    );
  }
});

var GraphicsPanel = React.createFactory(dataTeamGraphics);
var BehaviouralFeedbackTab = React.createFactory(BehaviouralFeedback);
var IncompleteCandidatesPanel = React.createFactory(IncompleteCandidates);
var InstrumentConflictsPanel = React.createFactory(InstrumentConflicts);