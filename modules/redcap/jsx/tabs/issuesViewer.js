import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'jsx/Loader';
import FilterableDataTable from 'jsx/FilterableDataTable';

/**
 * Issues viewer component
 */
class IssuesViewer extends Component {
  /**
   * Constructor of component
   *
   * @param {object} props - the component properties.
   */
  constructor(props) {
    super(props);

    this.state = {
      baseURL: props.baseURL,
      moduleURL: props.moduleURL,
      data: {},
      error: false,
      isLoaded: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrieve data and save it in state.
   */
  fetchData() {
    fetch(`${this.state.moduleURL}/issues`,
      {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then((resp) => {
      if (!resp.ok) {
        this.setState({error: true});
        console.error(resp.status + ': ' + resp.statusText);
        return;
      }

      resp.json()
        .then((data) => {
          this.setState({
            data,
            isLoaded: true,
          });
        });
    }).catch((error) => {
      this.setState({error: true});
      console.error(error);
    });
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {array} rowData - array of cell contents for a specific row
   * @param {array} rowHeaders - array of table headers (column names)
   * @return {*} a formatted table cell for a given column
   */
  formatColumn(column, cell, rowData, rowHeaders) {
    let result = (<td>{cell}</td>);

    // background color
    let bgGreen = {textAlign: 'center', backgroundColor: '#EDF7E5'};
    let bgRed = {textAlign: 'center', backgroundColor: '#F7D6E0'};
    let bgYellow = {textAlign: 'center', backgroundColor: '#FFF696'};

    switch (column) {
    case 'Issue ID':
    case 'Title':
      // console.log(rowData);
      let bvlLink = this.props.baseURL
        + '/issue_tracker/issue/'
        + rowData['Issue ID'];
      result = (<td><a href={bvlLink}>{rowData[column]}</a></td>);
      break;
    case 'Status':
      switch (cell) {
      case 'closed':
      case 'resolved':
        result = (<td style={bgGreen}>{cell}</td>);
        break;
      case 'new':
      case 'assigned':
      case 'acknowledged':
      case 'feedback':
        result = (<td style={bgYellow}>{cell}</td>);
        break;
      default:
        result = (<td style={bgRed}>{cell}</td>);
        break;
      }
      break;
    case 'Description':
      let a = cell.replace(/&quot;/g, '"');
      result = (<td>{a}</td>);
      break;
    default:
      result = (<td>{cell}</td>);
      break;
    }
    return result;
  }

  /**
   * @return {JSX} the incomplete form to render.
   */
  render() {
    // Waiting for async data to load.
    if (!this.state.isLoaded) {
      return <Loader />;
    }

    // The fields configured for display/hide.
    let fields = [
      {
        label: 'Issue ID',
        show: false,
        type: 'text',
      },
      {
        label: 'Title',
        show: true,
        type: 'text',
        filter: {
          name: 'Title',
          type: 'text',
        },
      },
      {
        label: 'Status',
        show: true,
        type: 'text',
        filter: {
          name: 'Status',
          type: 'text',
        },
      },
      {
        label: 'Date Created',
        show: true,
        type: 'text',
        filter: {
          name: 'Date Created',
          type: 'text',
        },
      },
      {
        label: 'Description',
        show: true,
        type: 'text',
        filter: {
          name: 'Description',
          type: 'text',
        },
      },
    ];

    return (
      <div>
        {this.state.data == null
          ? (<div className="alert alert-warning" role="alert">
            <strong>Error:</strong> no issues found.
          </div>)
          : <>
            <br />
            <div className="alert alert-warning" role="alert">
              <strong>Note:</strong> Only the last 10.000 issues will be
              displayed. If more are required, please check the issue tracker.
            </div>
            <FilterableDataTable
              name='redcapIssuesTable'
              data={this.state.data}
              fields={fields}
              getFormattedCell={this.formatColumn}
            />
          </>
        }
      </div>
    );
  }
}

IssuesViewer.propTypes = {
  data: PropTypes.object,
  baseURL: PropTypes.string.isRequired,
  moduleURL: PropTypes.string.isRequired,
};

export default IssuesViewer;
