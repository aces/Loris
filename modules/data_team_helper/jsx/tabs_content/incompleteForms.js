import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'jsx/Loader';
import FilterableDataTable from 'jsx/FilterableDataTable';

/**
 * Incomplete Forms Component.
 *
 * @description Data Team Helper 'Incomplete Forms' tab.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class IncompleteForms extends Component {
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
    return fetch(window.location.origin + '/data_team_helper/Incomplete',
      {credentials: 'same-origin'}
    )
      .then((resp) => resp.json())
      .then((json) => {
        console.dir(json);
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
            <a href={window.location.origin +
            '/instruments/' +
            rowData['test_name'] +
            '/?candID=' +
            rowData['DCCID'] +
            '&sessionID=' +
            rowData['SessionID'] +
            '&commentID=' +
            rowData['commentid']
            }>
              {rowData['Full_name']}
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
        if (
          fieldOptions[field].name === 'ID' ||
          fieldOptions[field].name === 'SessionID' ||
          fieldOptions[field].name === 'test_name' ||
          fieldOptions[field].name === 'data_entry' ||
          fieldOptions[field].name === 'commentid' ||
          fieldOptions[field].name === 'Full_name'
        ) {
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
    console.log('fields:');
    console.log(fields);

    return (
      <div>
        <FilterableDataTable
          name={'filterableDataTableIncompleteForms'}
          data={this.state.data.Data}
          fields={fields}
          getFormattedCell={this.formatColumn}
        />
      </div>
    );
  }
}
IncompleteForms.defaultProps = {
  display: false,
  data: null,
};

IncompleteForms.propTypes = {
  display: PropTypes.bool,
  data: PropTypes.object,
};

export default IncompleteForms;
