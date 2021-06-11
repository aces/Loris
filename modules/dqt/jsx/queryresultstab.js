import React, {Component} from 'react';

/**
 * Query result tab React Component
 */
class QueryResultsTab extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.downloadCSV = this.downloadCSV.bind(this);
  }

  /**
   * This clicks a link to a blob of the data received from props.
   */
  downloadCSV() {
    const dataarray = [this.props.data.headers].concat(this.props.data.data);
    const csv = dataarray.map((line) => {
      return JSON.stringify(line);
    })
    .join('\n')
    .replace(/(^\[)|(\]$)/mg, '');
    const data = new Blob([csv], {type: 'text/csv'});
    const url = window.URL.createObjectURL(data);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.setAttribute('download', 'data.csv');
    anchor.click();
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    console.info('QueryResultsTab::render');
    if (this.props.data.headers.length == 0) {
      return null;
    }

    const headers = this.props.data.headers.map((header) => {
      return (
        <th>{header}</th>
      );
    });
    const rows = this.props.data.data.map((row) => {
      const cells = row.map((cell) => {
        return (
          <td>{cell}</td>
        );
      });
      return (
        <tr>
          {cells}
        </tr>
      );
    });

    return (
      <div className="container-fluid">
        <table className="table table-condensed table-bordered">
          <caption>
            Showing all of {rows.length} rows
            <button
              className="button"
              onClick={this.downloadCSV}
            >
              Download as csv
            </button>
          </caption>
          <thead>
            <tr>
              {headers}
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
}
QueryResultsTab.defaultProps = {
  data: {
    headers: [],
    data: [],
  },
};

export default QueryResultsTab;
