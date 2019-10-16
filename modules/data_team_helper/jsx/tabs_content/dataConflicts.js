import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'jsx/Loader';
import FilterableDataTable from 'jsx/FilterableDataTable';

/**
 * Data Conflicts Component.
 *
 * @description Data Team Helper 'Data Conflicts' tab.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class DataConflicts extends Component {
  /**
   * Constructor of component
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

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrieve data from the provided URL and save it in state.
   *
   * @return {object}
   */
  fetchData() {
    return fetch(window.location.origin + '/data_team_helper/Conflicts',
      {credentials: 'same-origin'}
    )
      .then((resp) => resp.json())
      .then((json) => {
        // console.dir(json);
        const data = {
          fieldOptions: json.fieldOptions,
          Data: json.data.map((e) => Object.values(e)),
          subprojects: json.subprojects,
        };
        this.setState({data});
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
   *
   * @return {*} a formatted table cell for a given column
   */
  formatColumn(column, cell, rowData, rowHeaders) {
    let reactElement = null;
    switch (column) {
      case 'ID': {
        break;
      }
      case 'Visit': {
        console.log(this.state);
        console.log(cell);
        console.log(rowData);
        reactElement = (
          <td>
            <a href={window.location.origin +
            '/instruments_list/?candID=' +
            rowData['DCCID'] +
            '&sessionID=' +
            rowData['SessionID']
            }>
              {rowData['Visit']}
            </a>
          </td>
        );
        break;
      }
      case 'PSCID': {
        reactElement = (
          <td>
            <a href={window.location.origin +
            '/' +
            rowData['DCCID']
            }>
              {rowData['PSCID']}
            </a>
          </td>
        );
        break;
      }
      case 'DCCID': {
        reactElement = (
          <td>
            <a href={window.location.origin +
            '/' +
            rowData['DCCID']
            }>
              {rowData['DCCID']}
            </a>
          </td>
        );
        break;
      }
      case 'Instrument': {
        reactElement = (
          <td>
            <a href='#'>
              {rowData['test_name_display']}
            </a>
          </td>
        );
        break;
      }
      default:
        reactElement = (
          <td>{cell}</td>
        );
    }
    return reactElement;
  }

  /**
   * @return {DOMRect}
   */
  render() {
    // Waiting for async data to load.
    if (!this.state.isLoaded) {
      return <Loader/>;
    }
    let fieldOptions = this.state.data.fieldOptions;
    let fields = [];
    for (let field in fieldOptions) {
      if (fieldOptions.hasOwnProperty(field)) {
        console.log(fieldOptions[field].name);
        if (fieldOptions[field].name === 'TableName' ||
          fieldOptions[field].name === 'SessionID' ||
          fieldOptions[field].name === 'test_name_display' ||
          fieldOptions[field].name === 'Full_name' ||
          fieldOptions[field].name === 'FieldName') {
          fields.push({
            label: fieldOptions[field].label,
            show: fieldOptions[field].hidden,
          });
        } else {
          fields.push({
            label: fieldOptions[field].label,
            show: fieldOptions[field].hidden,
            filter: {
              name: fieldOptions[field].name,
              type: fieldOptions[field].type,
              options: fieldOptions[field].options,
            },
          });
        }
      }
    }

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
};

export default DataConflicts;
