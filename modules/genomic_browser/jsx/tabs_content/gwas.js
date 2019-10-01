import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FilterableDataTable from 'jsx/FilterableDataTable';
import Loader from 'jsx/Loader';

/**
 * GWAS Component.
 *
 * @description Genomic Browser GWAS tab.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class GWAS extends Component {
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
    return fetch(window.location.origin + '/genomic_browser/GwasBrowser',
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
    const hiddenHeaders = [
      'PSC',
      'DCCID',
      'externalID',
      'DoB',
    ];

    let reactElement = null;
    if (-1 == hiddenHeaders.indexOf(column)) {
      switch (column) {
        case 'PSCID':
          const url = window.location.origin + '/' + cell + '/';
          reactElement = (
            <td><a href={url}>{rowData.PSCID}</a></td>
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
          name={'filterableDataTableGWAS'}
          data={this.state.data.Data}
          fields={fields}
          getFormattedCell={this.formatColumn}
         />
      </div>
    );
  }
}
GWAS.defaultProps = {
  display: false,
  data: null,
};

GWAS.propTypes = {
  display: PropTypes.bool,
  data: PropTypes.object,
};

export default GWAS;
