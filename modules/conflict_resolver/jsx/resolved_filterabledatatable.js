import React, {Component} from 'react';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

/**
 * Filterable Datatable for resolved conflicts.
 */
class ResolvedFilterableDataTable extends Component {
  /**
   * Constructor
   *
   * @param {Object} props The provided props.
   */
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      isLoaded: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
  }

  /**
   * Fetch data upon component mount
   */
  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {array} rowData - array of cell contents for a specific row
   * @param {array} rowHeaders - array of table headers (column names)
   *
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, rowData, rowHeaders) {
    return (
        <td>{cell}</td>
    );
  }
  /**
   * Retrieve data from the provided URL and save it in state
   *
   * @return {object}
   */
  fetchData() {
    return fetch(
        loris.BaseURL.concat('/conflict_resolver/resolved'),
        {credentials: 'same-origin'}
      )
      .then((resp) => resp.json())
      .then((json) => {
        if (json.error) {
          throw new Error(json.error);
        }
        const data = {
          fieldOptions: json.fieldOptions,
          data: json.data.map((e) => Object.values(e)),
        };
        this.setState({data});
      })
      .catch((error) => {
        this.setState({error});
      });
  }

  /**
   * Renders the filterable datatable for the conflict resolver module
   *
   * @return {jsx}
   */
  render() {
    // If error occurs, return a message.
    if (this.state.error) {
      return (
        <div className="alert alert-danger" role="alert">
          <h4>An error occured while loading the page.</h4>
          {this.state.error.message}
        </div>
      );
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    const options = this.state.data.fieldOptions;

    const fields = [
      {label: 'Resolved ID', show: false},
      {label: 'Project', show: true, filter: {
        name: 'Project',
        type: 'select',
        options: options.project,
      }},
      {label: 'Site', show: true, filter: {
        name: 'Site',
        type: 'select',
        options: options.site,
      }},
      {label: 'CandID', show: true, filter: {
        name: 'candidateID',
        type: 'text',
        value: '300001',
      }},
      {label: 'PSCID', show: true, filter: {
        name: 'PSCID',
        type: 'text',
      }},
      {label: 'Visit Label', show: true, filter: {
        name: 'visitLabel',
        type: 'select',
        options: options.visitLabel,
      }},
      {label: 'Instrument', show: true, filter: {
        name: 'instrument',
        type: 'select',
        options: options.instrument,
      }},
      {label: 'Question', show: true, filter: {
        name: 'Question',
        type: 'text',
      }},
      {label: 'Value 1', show: true, filter: {
        name: 'Value1',
        type: 'text',
      }},
      {label: 'Value 2', show: true, filter: {
        name: 'Value2',
        type: 'text',
      }},
      {label: 'Correct Answer', show: true, filter: {
        name: 'CorrectAnswer',
        type: 'text',
      }},
      {label: 'User 1', show: true, filter: {
        name: 'User1',
        type: 'text',
      }},
      {label: 'User 2', show: true, filter: {
        name: 'User2',
        type: 'text',
      }},
      {label: 'Resolver', show: true, filter: {
        name: 'Resolver',
        type: 'text',
      }},
      {label: 'Resolution Timestamp', show: true, filter: {
        name: 'ResolutionTimestamp',
        type: 'text',
      }},
    ];

    return (
      <FilterableDataTable
        name="resolved"
        data={this.state.data.data}
        fields={fields}
        getFormattedCell={this.formatColumn}
      />
    );
  }
}

export default ResolvedFilterableDataTable;
