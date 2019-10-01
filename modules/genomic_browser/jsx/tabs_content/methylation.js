import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FilterableDataTable from 'jsx/FilterableDataTable';
import Loader from 'jsx/Loader';

/**
 * Methylation Component.
 *
 * @description Genomic Browser Methylation tab.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class Methylation extends Component {
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
    // this.fetchData()
    //   .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrieve data from the provided URL and save it in state.
   *
   * @return {object}
   */
  fetchData() {
    return fetch(window.location.origin + '/genomic_browser/Methylation',
      {credentials: 'same-origin'}
    )
      .then((resp) => resp.json())
      .then((json) => {
        console.log(json);
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
    if (true) {
      switch (column) {
        case 'PSCID':
          const url = window.location.origin + '/' + rowData.DCCID + '/';
          reactElement = (
            <td><a href={url}>{rowData.PSCID}</a></td>
          );
          break;
        case 'Subproject':
          reactElement = (
            <td>{this.state.data.subprojects[parseInt(cell)]}</td>
          );
          break;
        default:
          reactElement = (
            <td>{cell}</td>
          );
          break;
      }
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
        fields.push({
          label: fieldOptions[field].label,
          show: true,
          filter: {
            name: fieldOptions[field].name,
            type: fieldOptions[field].type,
            options: fieldOptions[field].options,
          },
        });
      }
    }

    return (
      <div>
         <FilterableDataTable
          name={'filterableDataTableMethylation'}
          data={this.state.data.Data}
          fields={fields}
          getFormattedCell={this.formatColumn}
         />
      </div>
    );
  }
}
Methylation.defaultProps = {
  display: false,
  data: null,
};

Methylation.propTypes = {
  display: PropTypes.bool,
  data: PropTypes.object,
};

export default Methylation;
