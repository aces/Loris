/* global c3 */
/* exported GraphicsPanel, BehaviouralFeedbackTab, IncompleteCandidatesPanel,
 InstrumentConflictsPanel
 */

var PagedRowHeader = React.createClass({
  propType: {
    headerRow: React.PropTypes.array.isRequired
  },
  render: function() {
    return (
      <thead>
      <tr className="info">
        {this.props.headerRow.map(function(headerColumn, key) {
          return (<th key={key}>{headerColumn}</th>);
        })}
      </tr>
      </thead>
    );
  }
});

var PagedTable = React.createClass({
  propTypes: {
    tableHeaders: React.PropTypes.array,
    tableRows: React.PropTypes.array
  },
  getInitialState: function() {
    return {
      pageSize: 10,
      currentPage: 1
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      currentPage: 1
    });
  },
  getPage: function() {
    var start = this.state.pageSize * (this.state.currentPage - 1);
    var end = start + this.state.pageSize;

    return {
      currentPage: this.state.currentPage,
      tableRows: this.props.tableRows.slice(start, end),
      numPages: this.getNumPages(),
      handleClick: function(pageNum) {
        return function() {
          this.handlePageChange(pageNum);
        }.bind(this);
      }.bind(this)
    };
  },
  getNumPages: function() {
    var numPages = Math.floor(
      this.props.tableRows.length / this.state.pageSize
    );
    if (this.props.tableRows.length % this.state.pageSize > 0) {
      numPages++;
    }
    return numPages;
  },
  handlePageChange: function(pageNum) {
    this.setState({currentPage: pageNum});
  },
  render: function() {
    var tableContents = "There is no data to display";
    var page = this.getPage();
    var rowsToMap = page.tableRows;
    var childrenToMap = this.props.children;

    var currentPageRows = rowsToMap.map(function(row) {
      var mapped = React.Children.map(childrenToMap, function(child) {
        return React.cloneElement(child, {
          row: row
        });
      });
      return mapped;
    });

    if (currentPageRows.length) {
      tableContents = (
        <table className="table table-hover table-bordered colm-freeze">
          <PagedRowHeader headerRow={this.props.tableHeaders}/>
          <tbody>
            {currentPageRows}
          </tbody>
        </table>
      );
    }

    return (
      <div>
        {tableContents}
        <nav><BVLPager page={page}/></nav>
      </div>
    );
  }
});

var IncompleteCandidatesRow = React.createClass({
  handleClick: function(event) {
    event.preventDefault();
    var link = this.refs.incomplete;
    window.open(link, "Incomplete Candidate");
  },
  propTypes: {
    row: React.PropTypes.object.isRequired,
    BaseURL: React.PropTypes.string.isRequired

  },
  render: function() {
    var row = this.props.row;
    return (
      <tr key={row.id} onClick={this.handleClick}>
        <td>
          <a href={this.props.BaseURL + "/" + row.candid + "/" +
          row.SessionID + "/"}
          >
            {row.visit_label}
          </a>
        </td>
        <td>
          <a href={this.props.BaseURL + "/" + row.candid + "/"}>
            {row.candid}
          </a>
        </td>
        <td>
          <a href={this.props.BaseURL + "/" + row.candid + "/" + row.SessionID +
          "/" + row.test_name + "/?commentID=" + row.commentid} ref="incomplete"
          >
            {row.Full_name}
          </a>
        </td>
      </tr>
    );
  }
});

var InstrumentConflictsRow = React.createClass({
  proptypes: {
    row: React.PropTypes.object.isRequired,
    BaseURL: React.PropTypes.string.isRequired
  },
  render: function() {
    var row = this.props.row;
    var baseURL = this.props.BaseURL;
    return (
      <tr
        key={row.CandID + row.visit_label + row.test_name_display +
        row.FieldName}
        onClick={this.handleClick}
      >
        <td>{row.visit_label}</td>
        <td>
          <a href={baseURL + "/" + row.CandID + "/"}>{row.CandID}</a>
        </td>
        <td>
          <a
            href={baseURL + "/conflict_resolver/?CandID=" + row.CandID}
            className="conflict_resolver_link" data-pscid={row.PSCID}
            data-question={row.FieldName} data-instrument={row.TableName}
            data-visits={row.visit_label}
          >
            {row.test_name_display}
          </a>
        </td>
        <td>{row.FieldName}</td>
      </tr>
    );
  }
});

var BehaviouralFeedbackRow = React.createClass({
  handleClick: function(event) {
    event.preventDefault();
    var link = this.refs.feedback.href;
    window.open(link, "Behavioural Feedback");
  },
  propTypes: {
    row: React.PropTypes.object.isRequired,
    BaseURL: React.PropTypes.string.isRequired
  },
  render: function() {
    var row = this.props.row;
    var bvlLink;
    var bvlLevel;

    if (row.Feedback_level === 'visit') {
      bvlLink = this.props.BaseURL + "/" + row.CandID + "/" +
        row.SessionID + "/";
      bvlLevel = "Visit : " + row.Visit_label;
    }

    if (row.Feedback_level === 'instrument') {
      bvlLink = this.props.BaseURL + "/" + row.CandID + "/" +
        row.SessionID + "/" + row.Test_name + "/?commentID=" + row.CommentID;
      bvlLevel = "Instrument : " + row.Full_name;
    }

    if (row.Feedback_level === 'profile') {
      bvlLink = this.props.BaseURl + "/" + row.CandID + "/";
      bvlLevel = "Profile";
    }

    return (
      <tr key={row.FeedbackID} onClick={this.handleClick}>
        <td>
          <a href={this.props.BaseURL + "/" + row.CandID + "/"}>
            {row.CandID}
          </a>
        </td>
        <td>
          <a href={bvlLink} onClick={this.handleClick} ref="feedback">
            {bvlLevel}
          </a>
        </td>
        <td>
          {row.FieldName}
        </td>
      </tr>
    );
  }
});

var DefaultPanel = React.createClass({
  displayName: 'CandidatesPanelTable',
  propTypes: {
    title: React.PropTypes.string
  },
  render: function() {
    return (
      <div className="panel panel-primary">
        <div className="panel-heading">{this.props.title}</div>
        <div className="panel-body">
          {this.props.children}
        </div>
      </div>
    );
  }
});

var IncompleteCandidates = React.createClass({
  render: function() {
    // The actual row is passed as a child inside PagedTable
    var row = {};
    return (
      <DefaultPanel title={this.props.title}>
        <PagedTable
          tableRows={this.props.incomplete_candidates}
          tableHeaders={this.props.header}
        >
          <IncompleteCandidatesRow row={row} BaseURL={this.props.BaseURL} />
        </PagedTable>
      </DefaultPanel>
    );
  }
});

var InstrumentConflicts = React.createClass({
  render: function() {
    // The actual row is passed as a child inside PagedTable
    var row = {};
    return (
      <DefaultPanel title={this.props.title}>
        <PagedTable
          tableRows={this.props.conflicts}
          tableHeaders={this.props.header}
        >
          <InstrumentConflictsRow row={row} BaseURL={this.props.BaseURL} />
        </PagedTable>
      </DefaultPanel>
    );
  }
});

var BehaviouralFeedback = React.createClass({
  render: function() {
    // The actual row is passed as a child inside PagedTable
    var row = {};
    return (
      <DefaultPanel title={this.props.title}>
        <PagedTable
          tableRows={this.props.feedback}
          tableHeaders={this.props.header}
        >
          <BehaviouralFeedbackRow row={row} BaseURL={this.props.BaseURL} />
        </PagedTable>
      </DefaultPanel>
    );
  }
});

var BVLPager = React.createClass({
  render: function() {
    var page = this.props.page;
    var pageLinks = [];

    if (page.currentPage > 1) {
      pageLinks.push(
        <li key={1} onClick={page.handleClick(page.currentPage - 1)}>
          <span>‹</span>
        </li>
      );
      if (page.currentPage > 2) {
        pageLinks.push(
          <li key={2} onClick={page.handleClick(1)}>
            <span>1</span>
          </li>
        );
        pageLinks.push(<li key={3}><span>...</span></li>);
      }
    }

    if (page.numPages > 1) {
      pageLinks.push(
        <li key={4} className="active"><span>{page.currentPage}</span></li>
      );
    }

    if (page.currentPage < page.numPages) {
      pageLinks.push(
        <li key={5} onClick={page.handleClick(page.currentPage + 1)}>
          <span>{page.currentPage + 1}</span>
        </li>
      );

      if (page.currentPage < page.numPages - 1) {
        pageLinks.push(
          <li key={6} onClick={page.handleClick(page.currentPage + 2)}>
            <span>{page.currentPage + 2}</span>
          </li>
        );
      }

      if (page.currentPage < page.numPages - 2) {
        pageLinks.push(
          <li key={7} onClick={page.handleClick(page.currentPage + 3)}>
            <span>{page.currentPage + 3}</span>
          </li>
        );
      }

      if (page.currentPage < page.numPages - 3) {
        pageLinks.push(<li key={8}><span>...</span></li>);
        pageLinks.push(
          <li key={9} onClick={page.handleClick(page.numPages)}>
            <span>{page.numPages}</span>
          </li>
        );
      }

      pageLinks.push(
        <li key={10} onClick={page.handleClick(page.currentPage + 1)}>
          <span aria-hidden="true">›</span>
        </li>
      );
    }
    return (
      <ul className="pagination pagination-sm">{pageLinks}</ul>
    );
  }
});

var dataTeamGraphics = React.createClass({
  componentDidMount: function() {
    c3.generate({
      bindto: '#completedChart',
      data: {
        columns: [
          ['data', this.props.percentCompleted]
        ],
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
  render: function() {
    var pscidStatus = (
      this.props.pscid ? ("Candidate " + this.props.pscid) : "All Candidates"
    );
    var visitStatus = (
      this.props.visit ? ("On " + this.props.visit) : "Across All Visits"
    );
    var instrumentStatus = (
      this.props.instrument ? ("On Instrument " + this.props.instrument) :
        "Across All Instruments"
    );

    return (
      <div className="col-sm-12 col-md-5">
        <div className="panel panel-primary">
          <div className="panel-heading">
            At A Glance: {pscidStatus} - {visitStatus} - {instrumentStatus}
          </div>
          <div className="panel-body">
            <div id="completedChart"></div>
          </div>
        </div>
      </div>
    );
  }
});

var GraphicsPanel = React.createFactory(dataTeamGraphics);
var BehaviouralFeedbackTab = React.createFactory(BehaviouralFeedback);
var IncompleteCandidatesPanel = React.createFactory(IncompleteCandidates);
var InstrumentConflictsPanel = React.createFactory(InstrumentConflicts);

window.GraphicsPanel = GraphicsPanel;
window.BehaviouralFeedbackTab = BehaviouralFeedbackTab;
window.IncompleteCandidatesPanel = IncompleteCandidatesPanel;
window.InstrumentConflictsPanel = InstrumentConflictsPanel;

export default {
  GraphicsPanel,
  BehaviouralFeedbackTab,
  IncompleteCandidatesPanel,
  InstrumentConflictsPanel
};

