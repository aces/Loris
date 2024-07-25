import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FilterableDataTable from 'jsx/FilterableDataTable';
import Loader from 'jsx/Loader';

/**
 * CNV Component.
 *
 * @description Genomic Browser CNV tab.
 * @author Alizée Wickenheiser
 * @version 1.0.0
 */
class CNV extends Component {
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
   * Fetch data when component mounts.
   */
  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrieve data from the provided URL and save it in state.
   */
  fetchData() {
    fetch(`${this.props.baseURL}/genomic_browser/CnvBrowser`,
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
    let reactElement;
    switch (column) {
      case 'PSCID':
        const url = `${this.props.baseURL}/${rowData.DCCID}/`;
        reactElement = <td><a href={url}>{rowData.PSCID}</a></td>;
        break;
      default:
        reactElement = <td>{cell}</td>;
        break;
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

    // The filter options
    const options = this.state.data.fieldOptions;

    // The fields configured for display/hide.
    let fields = [
      {
        label: 'Site',
        show: false,
        filter: {
          name: 'Site',
          type: 'select',
          options: options.Sites,
        },
      },
      {
        label: 'DCCID',
        show: false,
        filter: {
          name: 'DCCID',
          type: 'text',
        },
      },
      {
        label: 'PSCID',
        show: true,
        filter: {
          name: 'PSCID',
          type: 'text',
        },
      },
      {
        label: 'Sex',
        show: true,
        filter: {
          name: 'Sex',
          type: 'select',
          options: options.Sex,
        },
      },
      {
        label: 'Cohort',
        show: true,
        filter: {
          name: 'Cohort',
          type: 'select',
          options: options.Cohorts,
        },
      },
      {
        label: 'Date of Birth',
        show: false,
      },
      {
        label: 'External ID',
        show: false,
        filter: {
          name: 'External ID',
          type: 'text',
        },
      },
      {
        label: 'Build',
        show: false,
        filter: {
          name: 'File',
          type: 'select',
          options: options.Chromosome,
        },
      },
      {
        label: 'Strand',
        show: false,
        filter: {
          name: 'Strand',
          type: 'select',
          options: {
            F: 'Forward',
            R: 'Reverse',
          },
        },
      },
      {
        label: 'Start Loc',
        show: false,
      },
      {
        label: 'End Loc',
        show: false,
      },
      {
        label: 'Location',
        show: true,
      },
      {
        label: 'Gene',
        show: false,
      },
      {
        label: 'Gene Name',
        show: false,
      },
      {
        label: 'Description',
        show: false,
        filter: {
          name: 'Description',
          type: 'text',
        },
      },
      {
        label: 'Type',
        show: true,
        filter: {
          name: 'Type',
          type: 'select',
          options: {
            gain: 'gain',
            loss: 'loss',
            unknown: 'Unknown',
          },
        },
      },
      {
        label: 'Copy Number Change',
        show: false,
        filter: {
          name: 'Copy Number Change',
          type: 'text',
        },
      },
      {
        label: 'Event Name',
        show: false,
        filter: {
          name: 'Event Name',
          type: 'text',
        },
      },
      {
        label: 'Common',
        show: true,
        filter: {
          name: 'Common',
          type: 'select',
          options: {
            Y: 'Yes',
            N: 'No',
          },
        },
      },
      {
        label: 'Characteristics',
        show: true,
        filter: {
          name: 'Characteristics',
          type: 'select',
          options: {
            Benign: 'Benign',
            Pathogenic: 'Pathogenic',
            Unknown: 'Unknown',
          },
        },
      },
      {
        label: 'Inheritance',
        show: true,
        filter: {
          name: 'Inheritance',
          type: 'select',
          options: {
            'de novo': 'de novo',
            'maternal': 'maternal',
            'paternal': 'paternal',
            'unclassified': 'unclassified',
            'unknown': 'unknown',
            'NA': 'NA',
          },
        },
      },
      {
        label: 'Array Report',
        show: false,
      },
      {
        label: 'Markers',
        show: false,
      },
      {
        label: 'Validation Method',
        show: false,
      },
      {
        label: 'Validation Method',
        show: false,
      },
      {
        label: 'Platform',
        show: true,
      },
    ];

    return (
      <FilterableDataTable
        name={'filterableDataTableCNV'}
        data={this.state.data.Data}
        fields={fields}
        getFormattedCell={this.formatColumn}
      />
    );
  }
}
CNV.defaultProps = {
  display: false,
  data: null,
};

CNV.propTypes = {
  display: PropTypes.bool,
  data: PropTypes.object,
  baseURL: PropTypes.string.isRequired,
};

export default CNV;
