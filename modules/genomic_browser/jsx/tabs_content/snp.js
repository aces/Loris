import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FilterableDataTable from 'jsx/FilterableDataTable';
import Loader from 'jsx/Loader';

/**
 * SNP Component.
 *
 * @description Genomic Browser SNP tab.
 * @author Alizée Wickenheiser
 * @version 1.0.0
 */
class SNP extends Component {
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
    fetch(
      this.props.baseURL + '/genomic_browser/SnpBrowser',
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
        show: true,
        filter: {
          name: 'Build',
          type: 'select',
          options: {
            37: 'GRCh37',
          },
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
        label: 'Gene',
        show: false,
      },
      {
        label: 'Name',
        show: false,
        filter: {
          name: 'Name',
          type: 'text',
        },
      },
      {
        label: 'Platform',
        show: true,
        filter: {
          name: 'Platform',
          type: 'select',
          options: options.Platform,
        },
      },
      {
        label: 'rsID',
        show: false,
        filter: {
          name: 'rsID',
          type: 'text',
        },
      },
      {
        label: 'Name',
        show: false,
        filter: {
          name: 'Name',
          type: 'text',
        },
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
        label: 'External Source',
        show: false,
        filter: {
          name: 'External Source',
          type: 'text',
        },
      },
      {
        label: 'Allele A',
        show: true,
        filter: {
          name: 'Allele A',
          type: 'select',
          options: {
            A: 'A',
            C: 'C',
            T: 'T',
            G: 'G',
          },
        },
      },
      {
        label: 'Allele B',
        show: true,
        filter: {
          name: 'Allele B',
          type: 'select',
          options: {
            A: 'A',
            C: 'C',
            T: 'T',
            G: 'G',
          },
        },
      },
      {
        label: 'Reference Base',
        show: true,
        filter: {
          name: 'Reference Base',
          type: 'select',
          options: {
            A: 'A',
            C: 'C',
            T: 'T',
            G: 'G',
          },
        },
      },
      {
        label: 'Minor Allele',
        show: true,
        filter: {
          name: 'Minor Allele',
          type: 'select',
          options: {
            A: 'A',
            C: 'C',
            T: 'T',
            G: 'G',
          },
        },
      },
      {
        label: 'Array Report',
        show: false,
        filter: {
          name: 'Array Report',
          type: 'select',
          options: {
            Abnormal: 'Abnormal',
            Normal: 'Normal',
            Pending: 'Pending',
            Uncertain: 'Uncertain',
          },
        },
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
        label: 'Validated',
        show: false,
        filter: {
          name: 'Validated',
          type: 'select',
          options: {
            0: '0',
            1: '1',
          },
        },
      },
      {
        label: 'Function Prediction',
        show: true,
        filter: {
          name: 'Function Prediction',
          type: 'select',
          options: {
            exonic: 'exonic',
            ncRNAexonic: 'ncRNAexonic',
            splicing: 'splicing',
            UTR3: 'UTR3',
            UTR5: 'UTR5',
          },
        },
      },
      {
        label: 'Damaging',
        show: true,
        filter: {
          name: 'Damaging',
          type: 'select',
          options: {
            D: 'D',
            NA: 'NA',
          },
        },
      },
      {
        label: 'Genotype Quality',
        show: true,
      },
      {
        label: 'Exonic Function',
        show: false,
        filter: {
          name: 'Exonic Function',
          type: 'text',
        },
      },
      {
        label: 'Genomic Range',
        show: false,
        filter: {
          name: 'Genomic Range',
          type: 'text',
        },
      },
    ];

    return (
      <FilterableDataTable
        name={'filterableDataTableSNP'}
        data={this.state.data.Data}
        fields={fields}
        getFormattedCell={this.formatColumn}
      />
    );
  }
}
SNP.defaultProps = {
  display: false,
  data: null,
};

SNP.propTypes = {
  display: PropTypes.bool,
  data: PropTypes.object,
  baseURL: PropTypes.string.isRequired,
};

export default SNP;
