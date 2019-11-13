/* global c3 */
/* exported GraphicsPanel, BehaviouralFeedbackTab, IncompleteCandidatesPanel,
 InstrumentConflictsPanel
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import PaginationLinks from 'jsx/PaginationLinks';

class PagedRowHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <thead>
      <tr className='info'>
        {this.props.headerRow.map(function(headerColumn, key) {
          return (<th key={key}>{headerColumn}</th>);
        })}
      </tr>
      </thead>
    );
  }
}
PagedRowHeader.propType = {
  headerRow: PropTypes.array.isRequired,
};

class PagedTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      currentPage: 1,
    };

    this.getPage = this.getPage.bind(this);
    this.getNumPages = this.getNumPages.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentPage: 1,
    });
  }

  getPage() {
    let start = this.state.pageSize * (this.state.currentPage - 1);
    let end = start + this.state.pageSize;

    return {
      currentPage: this.state.currentPage,
      tableRows: this.props.tableRows.slice(start, end),
      numPages: this.getNumPages(),
      handleClick: this.handlePageChange,
    };
  }

  getNumPages() {
    let numPages = Math.floor(
      this.props.tableRows.length / this.state.pageSize
    );
    if (this.props.tableRows.length % this.state.pageSize > 0) {
      numPages++;
    }
    return numPages;
  }
  handlePageChange(pageNum) {
    this.setState({currentPage: pageNum});
  }

  changePage(pageNo) {
    this.setState({
      PageNumber: pageNo,
    });
  }

  render() {
    let tableContents = 'There is no data to display';
    let page = this.getPage();
    let rowsToMap = page.tableRows;
    let childrenToMap = this.props.children;

    let currentPageRows = rowsToMap.map(function(row) {
      let mapped = React.Children.map(childrenToMap, function(child) {
        return React.cloneElement(child, {
          row: row,
        });
      });
      return mapped;
    });

    if (currentPageRows.length) {
      tableContents = (
        <table className='table table-hover table-bordered colm-freeze'>
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
        <nav>
          <PaginationLinks
            Total={page.numPages}
            onChangePage={page.handleClick}
            RowsPerPage={10}
            Active={this.state.currentPage}
          />
        </nav>
      </div>
    );
  }
}
PagedTable.propTypes = {
  tableHeaders: PropTypes.array,
  tableRows: PropTypes.array,
};

class IncompleteCandidatesRow extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    let link = this.refs.incomplete;
    window.open(link, 'Incomplete Candidate');
  }

  render() {
    let row = this.props.row;
    return (
      <tr key={row.id} >
        <td>
          <a href={this.props.BaseURL + '/instrument_list/?candID=' +
              row.candid +
              '&sessionID=' + row.SessionID}
          >
            {row.visit_label}
          </a>
        </td>
        <td>
          <a href={this.props.BaseURL + '/' + row.candid + '/'}>
            {row.candid}
          </a>
        </td>
          <td>
              <a href={this.props.BaseURL + '/' + row.candid + '/'}>
                  {row.PSCID}
              </a>
          </td>
        <td>
          <a href={this.props.BaseURL + '/instruments/' + row.test_name +
              '/?candID=' + row.candid +
              '&sessionID=' + row.SessionID +
              '&commentID=' + row.commentid} ref='incomplete'
              onClick={this.handleClick} >
            {row.Full_name}
          </a>
        </td>
      </tr>
    );
  }
}
IncompleteCandidatesRow.propTypes = {
  row: PropTypes.object.isRequired,
  BaseURL: PropTypes.string.isRequired,
};

class InstrumentConflictsRow extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    let row = this.props.row;
    let baseURL = this.props.BaseURL;
    return (
      <tr
        key={row.CandID + row.visit_label + row.test_name_display +
        row.FieldName}
        onClick={this.handleClick}
      >
        <td>{row.visit_label}</td>
        <td>
          <a href={baseURL + '/' + row.CandID + '/'}>{row.CandID}</a>
        </td>
          <td>
              <a href={baseURL + '/' + row.CandID + '/'}>{row.PSCID}</a>
          </td>
        <td>
          <a href="#" onClick={loris.loadFilteredMenuClickHandler(
                 'conflict_resolver/',
                  {CandID: row.CandID,
                  Instrument: row.TableName,
                  Question: row.FieldName}
          )}>{row.test_name_display}</a>
        </td>
        <td>{row.FieldName}</td>
      </tr>
    );
  }
}
InstrumentConflictsRow.proptypes = {
  row: PropTypes.object.isRequired,
  BaseURL: PropTypes.string.isRequired,
};

class BehaviouralFeedbackRow extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    let link = this.refs.feedback.href;
    window.open(link, 'Behavioural Feedback');
  }

  render() {
    let row = this.props.row;
    let bvlLink;
    let bvlLevel;

    if (row.Feedback_level === 'visit') {
      bvlLink = this.props.BaseURL + '/instrument_list/?candID=' + row.CandID +
            '&sessionID=' + row.SessionID;
      bvlLevel = 'Visit : ' + row.Visit_label;
    }

    if (row.Feedback_level === 'instrument') {
      bvlLink = this.props.BaseURL + '/instruments/' + row.Test_name +
            '/?candID=' + row.CandID +
            '&sessionID=' + row.SessionID +
            '&commentID=' + row.CommentID;
      bvlLevel = 'Instrument : ' + row.Full_name;
    }

    if (row.Feedback_level === 'profile') {
      bvlLink = this.props.BaseURl + '/' + row.CandID + '/';
      bvlLevel = 'Profile';
    }

    return (
      <tr key={row.FeedbackID} >
        <td>
          <a href={this.props.BaseURL + '/' + row.CandID + '/'}>
            {row.CandID}
          </a>
        </td>
          <td>
              <a href={this.props.BaseURL + '/' + row.CandID + '/'}>
                  {row.PSCID}
              </a>
          </td>
        <td>
          <a href={bvlLink} onClick={this.handleClick} ref='feedback'>
            {bvlLevel}
          </a>
        </td>
        <td>
          {row.FieldName}
        </td>
      </tr>
    );
  }
}
BehaviouralFeedbackRow.propTypes = {
  row: PropTypes.object.isRequired,
  BaseURL: PropTypes.string.isRequired,
};

class DefaultPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: 'CandidatesPanelTable',
    };
  }

  render() {
    return (
      <div className='panel panel-primary'>
        <div className='panel-heading'>{this.props.title}</div>
        <div className='panel-body'>
          {this.props.children}
        </div>
      </div>
    );
  }
}
DefaultPanel.propTypes = {
  title: PropTypes.string,
  children: PropTypes.string,
};

class IncompleteCandidates extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    // The actual row is passed as a child inside PagedTable
    let row = {};
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
}
IncompleteCandidates.propTypes = {
  title: PropTypes.string,
  incomplete_candidates: PropTypes.array,
  header: PropTypes.array,
  BaseURL: PropTypes.string,
};


class InstrumentConflicts extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    // The actual row is passed as a child inside PagedTable
    let row = {};
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
}
InstrumentConflicts.propTypes = {
  title: PropTypes.string,
  conflicts: PropTypes.array,
  header: PropTypes.array,
  BaseURL: PropTypes.string,
};

class BehaviouralFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    // The actual row is passed as a child inside PagedTable
    let row = {};
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
}
BehaviouralFeedback.propTypes = {
  title: PropTypes.string,
  feedback: PropTypes.array,
  header: PropTypes.array,
  BaseURL: PropTypes.string,
};

class BeahaviouralQCGraphics extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    c3.generate({
      bindto: '#completedChart',
      data: {
        columns: [
          ['data', this.props.percentCompleted],
        ],
        type: 'gauge',
      },
      color: {
        // the three color levels for the percentage values.
        pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'],
        threshold: {
          // unit: 'value', // percentage is default
          // max: 200, // 100 is default
          values: [30, 60, 90, 100],
        },
      },
    });
  }
  render() {
    let pscidStatus = (
      this.props.pscid ? ('Candidate ' + this.props.pscid) : 'All Candidates'
    );
    let visitStatus = (
      this.props.visit ? ('On ' + this.props.visit) : 'Across All Visits'
    );
    let instrumentStatus = (
      this.props.instrument ? ('On Instrument ' + this.props.instrument) :
        'Across All Instruments'
    );
    let siteStatus = (
      this.props.site ? (this.props.site) :
        'Across All Sites'
      );
    let projectStatus = (
      this.props.project ? (this.props.project) :
        'Across All Projects'
      );

    return (
      <div className='col-sm-12 col-md-5'>
        <div className='panel panel-primary'>
          <div className='panel-heading'>
            At A Glance: {pscidStatus} - {visitStatus} - {instrumentStatus} - {siteStatus} -{projectStatus}
          </div>
          <div className='panel-body'>
            <div id='completedChart'/>
          </div>
        </div>
      </div>
    );
  }
}
BeahaviouralQCGraphics.propTypes = {
  percentCompleted: PropTypes.string,
  pscid: PropTypes.string,
  visit: PropTypes.string,
  instrument: PropTypes.string,
  site: PropTypes.string,
  project: PropTypes.string,
};


let GraphicsPanel = React.createFactory(BeahaviouralQCGraphics);
let BehaviouralFeedbackTab = React.createFactory(BehaviouralFeedback);
let IncompleteCandidatesPanel = React.createFactory(IncompleteCandidates);
let InstrumentConflictsPanel = React.createFactory(InstrumentConflicts);

window.GraphicsPanel = GraphicsPanel;
window.BehaviouralFeedbackTab = BehaviouralFeedbackTab;
window.IncompleteCandidatesPanel = IncompleteCandidatesPanel;
window.InstrumentConflictsPanel = InstrumentConflictsPanel;

export default {
  GraphicsPanel,
  BehaviouralFeedbackTab,
  IncompleteCandidatesPanel,
  InstrumentConflictsPanel,
};

