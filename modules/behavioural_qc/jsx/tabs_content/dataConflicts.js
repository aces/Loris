import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'jsx/Loader';
import FilterableDataTable from 'jsx/FilterableDataTable';
import {withTranslation} from 'react-i18next';

/**
 * Data Conflicts Component.
 *
 * @description Behavioural Quality Control 'Data Conflicts' tab.
 * @author Alizée Wickenheiser
 * @version 1.0.0
 */
class DataConflicts extends Component {
  /**
   * Constructor of component
   *
   * @param {object} props - the component properties.
   */
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      fieldOptions: {},
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
   * Retrieve data for the form and save it in state.
   */
  fetchData() {
    fetch(`${this.props.baseURL}/behavioural_qc/Conflicts`,
      {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then((resp) => {
      if (resp.ok) {
        resp.json().then((json) => {
          const data = {
            fieldOptions: json.fieldOptions,
            Data: json.data.map((e) => Object.values(e)),
            cohorts: json.cohorts,
          };
          this.setState({
            data,
            isLoaded: true,
          });
        });
      } else {
        this.setState({error: true});
        console.error(resp.statusText);
      }
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
    let reactElement = null;
    switch (column) {
    case 'Visit':
      reactElement = (
        <td>
          <a href={this.props.baseURL +
            '/instrument_list/?candID=' +
            rowData['DCCID'] +
            '&sessionID=' +
            rowData['sessionID']
          }>
            {rowData['Visit']}
          </a>
        </td>
      );
      break;
    case 'PSCID':
      reactElement = (
        <td>
          <a href={this.props.baseURL +
            '/' +
            rowData['DCCID']
          }>
            {rowData['PSCID']}
          </a>
        </td>
      );
      break;
    case 'DCCID':
      reactElement = (
        <td>
          <a href={this.props.baseURL +
            '/' +
            rowData['DCCID']
          }>
            {rowData['DCCID']}
          </a>
        </td>
      );
      break;
    case 'Instrument':
      reactElement = (
        <td>
          <a href={this.props.baseURL +
            '/instruments/' +
            rowData['testName'] +
            '/?candID=' +
            rowData['DCCID'] +
            '&sessionID=' +
            rowData['sessionID'] +
            '&commentID=' +
            rowData['commentID']
          }>
            {rowData['Instrument']}
          </a>
        </td>
      );
      break;
    default:
      reactElement = (
        <td>{cell}</td>
      );
    }
    return reactElement;
  }

  /**
   * @return {JSX} the data conflicts form to render.
   */
  render() {
    const {t} = this.props;
    // Waiting for async data to load.
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    // The filter options
    const options = this.state.data.fieldOptions;

    // The fields configured for display/hide.
    let fields = [
      {
        label: t('Instrument', {ns: 'loris', count: 1}),
        show: true,
        filter: {
          name: 'Instrument',
          type: 'select',
          options: Object.assign({}, ...Object.entries(
            {...Object.values(options.instruments)})
            .map(([, b]) => ({[b]: b}))
          ),
        },
      },
      {
        label: t('DCCID', {ns: 'loris'}),
        show: true,
        filter: {
          name: 'DCCID',
          type: 'text',
        },
      },
      {
        label: t('PSCID', {ns: 'loris'}),
        show: true,
        filter: {
          name: 'PSCID',
          type: 'text',
        },
      },
      {
        label: t('Visit', {ns: 'loris', count: 1}),
        show: true,
        filter: {
          name: 'Visit',
          type: 'select',
          options: options.visits,
        },
      },
      {
        label: t('Project', {ns: 'loris', count: 1}),
        show: false,
        filter: {
          name: 'Project',
          type: 'select',
          options: options.projects,
        },
      },
      {
        label: t('Cohort', {ns: 'loris', count: 1}),
        show: false,
        filter: {
          name: 'Cohort',
          type: 'select',
          options: options.cohorts,
        },
      },
      {
        label: t('Site', {ns: 'loris', count: 1}),
        show: false,
        filter: {
          name: 'Site',
          type: 'select',
          options: options.sites,
        },
      },
      {
        label: t('Field Name', {ns: 'behavioural_qc'}),
        show: true,
      },
      {
        label: 'testName',
        show: false,
      },
      {
        label: 'test_name_display',
        show: false,
      },
      {
        label: 'sessionID',
        show: false,
      },
      {
        label: 'commentID',
        show: false,
      },
    ];

    return (
      <div>
        <FilterableDataTable
          name={'filterableDataTableDataConflicts'}
          data={this.state.data.Data}
          fields={fields}
          getFormattedCell={this.formatColumn}
        />
      </div>
    );
  }
}
DataConflicts.defaultProps = {
  display: false,
  data: null,
};
DataConflicts.propTypes = {
  display: PropTypes.bool,
  data: PropTypes.object,
  baseURL: PropTypes.string.isRequired,
  t: PropTypes.func,
};

export default withTranslation(['behavioural_qc', 'loris'])(DataConflicts);
