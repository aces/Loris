import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import PropTypes from 'prop-types';

/**
 * Filterable Datatable for resolved conflicts.
 */
class ResolvedFilterableDataTable extends Component {
  /**
   * Constructor
   *
   * @param {object} props The provided props.
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
   * Fetch data upon component mount
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
   * Renders the filterable datatable for the conflict resolver module
   *
   * @return {JSX}
   */
  render() {
    const {t} = this.props;
    // If error occurs, return a message.
    if (this.state.error) {
      return (
        <div className="alert alert-danger" role="alert">
          <h4>{t('An error occured while loading the page.',
            {ns: 'loris'})}</h4>
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
      {label: t('Resolved ID',
        {ns: 'conflict_resolver'}), show: false},
      {label: t('Project', {ns: 'loris', count: 1}), show: true, filter: {
        name: 'Project',
        type: 'select',
        options: options.project,
      }},
      {label: t('Cohort',
        {ns: 'loris', count: 1}), show: true, filter: {
        name: 'Cohort',
        type: 'select',
        options: options.cohort,
      }},
      {label: t('Site', {ns: 'loris', count: 1}), show: true, filter: {
        name: 'Site',
        type: 'select',
        options: options.site,
      }},
      {label: t('DCCID', {ns: 'loris'}), show: true, filter: {
        name: 'candidateID',
        type: 'text',
        value: '300001',
      }},
      {label: t('PSCID', {ns: 'loris'}), show: true, filter: {
        name: 'PSCID',
        type: 'text',
      }},
      {label: t('Visit Label', {ns: 'loris'}), show: true, filter: {
        name: 'visitLabel',
        type: 'select',
        options: options.visitLabel,
      }},
      {label: t('Instrument', {ns: 'loris', count: 1}), show: true, filter: {
        name: 'instrument',
        type: 'select',
        options: options.instrument,
      }},
      {label: t('Question',
        {ns: 'conflict_resolver'}), show: true, filter: {
        name: 'Question',
        type: 'text',
      }},
      {label: t('Description',
        {ns: 'conflict_resolver'}), show: true, filter: {
        name: 'Description',
        type: 'text',
      }},
      {label: t('Incorrect Answer',
        {ns: 'conflict_resolver'}), show: true, filter: {
        name: 'OldValue',
        type: 'text',
      }},
      {label: t('Correct Answer',
        {ns: 'conflict_resolver'}), show: true, filter: {
        name: 'CorrectAnswer',
        type: 'text',
      }},
      {label: t('Resolver',
        {ns: 'conflict_resolver'}), show: true, filter: {
        name: 'Resolver',
        type: 'text',
      }},
      {label: t('Resolution Timestamp',
        {ns: 'conflict_resolver'}), show: true, filter: {
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

ResolvedFilterableDataTable.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation(
  ['conflict_resolver', 'loris']
)(ResolvedFilterableDataTable);
