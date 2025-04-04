import React, {Component} from 'react';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import FixConflictForm from './fix_conflict_form';

/**
 * Filterable database for unresolved conflicts.
 */
class UnresolvedFilterableDataTable extends Component {
  /**
   * Constructor
   *
   * @param {object} props The properties passed to the component.
   */
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      fieldsMeta: {},
      isLoaded: false,
    };

    this.fetchFieldsMeta = this.fetchFieldsMeta.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
  }

  /**
   * Fetches data upon component mount.
   */
  componentDidMount() {
    this.fetchFieldsMeta()
      .then(() => this.fetchData())
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {array} rowData - array of cell contents for a specific row
   * @param {array} rowHeaders - array of table headers (column names)
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, rowData, rowHeaders) {
    switch (column) {
    case 'Correct Answer':
      const options = {
        1: rowData['Value 1'],
        2: rowData['Value 2'],
      };
      return (
        <FixConflictForm
          conflictId={rowData['Conflict ID']}
          options={options}
        />
      );
    }
    return (
      <td>{cell}</td>
    );
  }

  /**
   * Retrieve all the field metadata
   *
   * @return {object}
   */
  fetchFieldsMeta() {
    const url = loris.BaseURL.concat('/dictionary/module/instruments');
    return fetch(url, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((json) => {
        if (json.error) {
          throw new Error(json.error);
        }
        this.setState({fieldsMeta: json});
      })
      .catch((error) => {
        this.setState({error});
      });
  }
  /**
   * Retrieve data from the provided URL and save it in state
   *
   * @return {object}
   */
  fetchData() {
    const url = loris.BaseURL.concat('/conflict_resolver/unresolved');
    return fetch(url, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((json) => {
        if (json.error) {
          throw new Error(json.error);
        }
        const data = {
          fieldOptions: json.fieldOptions,
          data: json.data.map((e) => {
            const fieldInfo = this.state.fieldsMeta[e['Instrument']][
              e['Instrument']
              + '_'
              + e['Question']
            ];
            e['Description'] = fieldInfo ? fieldInfo['description'] : '';
            return Object.values(e);
          }),
        };
        this.setState({data});
      })
      .catch((error) => {
        this.setState({error});
      });
  }

  /**
   * Renders the filterable datatable for the component.
   *
   * @return {JSX}
   */
  render() {
    // If error occurs, return a message.
    if (this.state.error) {
      return (
        <div className="alert alert-danger" role="alert">
          <h4>An error occured while loading the page.</h4>
          {this.state.error.toString()}
        </div>
      );
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    const options = this.state.data.fieldOptions;

    const fields = [
      {label: 'Conflict ID', show: false},
      {label: 'Project', show: true, filter: {
        name: 'Project',
        type: 'select',
        options: options.project,
      }},
      {label: 'Cohort', show: true, filter: {
        name: 'cohort',
        type: 'select',
        options: options.cohort,
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
      {label: 'Description', show: true, filter: {
        name: 'Description',
        type: 'text',
      }},
      {label: 'Value 1', show: false},
      {label: 'Value 2', show: false},
      {label: 'Correct Answer', show: true},
    ];

    return (
      <FilterableDataTable
        name="unresolved"
        data={this.state.data.data}
        fields={fields}
        getFormattedCell={this.formatColumn}
      />
    );
  }
}

export default UnresolvedFilterableDataTable;
