import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FilterableDataTable from 'jsx/FilterableDataTable';
import Loader from 'jsx/Loader';

/**
 * Methylation Component.
 *
 * @description Genomic Browser Methylation tab.
 * @author Alizée Wickenheiser
 * @version 1.0.0
 */
class Methylation extends Component {
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
      `${this.props.baseURL}/genomic_browser/Methylation`,
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
        show: false,
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
        label: 'Sample',
        show: true,
      },
      {
        label: 'CPG Name',
        show: false,
        filter: {
          name: 'File',
          type: 'text',
        },
      },
      {
        label: 'Beta value',
        show: false,
      },
      {
        label: 'Chromosome',
        show: false,
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
        label: 'Probe Loc A',
        show: false,
      },
      {
        label: 'Probe Seq A',
        show: true,
      },
      {
        label: 'Probe Loc B',
        show: true,
      },
      {
        label: 'Probe Seq B',
        show: true,
      },
      {
        label: 'Infinium design',
        show: true,
        filter: {
          name: 'Infinium design',
          type: 'select',
          options: {
            I: 'I',
            II: 'II',
          },
        },
      },
      {
        label: 'Color',
        show: true,
        filter: {
          name: 'Color',
          type: 'select',
          options: {
            Grn: 'Green',
            Red: 'Red',
          },
        },
      },
      {
        label: 'Build',
        show: false,
        filter: {
          name: 'Build',
          type: 'select',
          options: {
            37: 'GRCh37',
          },
        },
      },
      {
        label: 'SNP',
        show: false,
        filter: {
          name: 'SNP',
          type: 'select',
          options: {
            'NULL': 'No',
            '_': 'Yes',
          },
        },
      },
      {
        label: 'Gene',
        show: true,
      },
      {
        label: 'Accession number',
        show: true,
      },
      {
        label: 'Position',
        show: true,
        filter: {
          name: 'Position',
          type: 'select',
          options: {
            '1stExon': '1st Exon',
            '3`UTR': '3`UTR',
            '5`UTR': '5`UTR',
            'Body': 'Body',
            'TSS1500': 'TSS1500',
            'TSS200': 'TSS200',
          },
        },
      },
      {
        label: 'Island Loc',
        show: false,
      },
      {
        label: 'Context',
        show: false,
      },
      {
        label: 'Promoter',
        show: false,
      },
      {
        label: 'DMR',
        show: true,
      },
      {
        label: 'Enhancer',
        show: false,
        filter: {
          name: 'Enhancer',
          type: 'select',
          options: {
            1: 'Yes',
          },
        },
      },
      {
        label: 'HMM Island',
        show: false,
      },
      {
        label: 'Reg Feature Loc',
        show: false,
      },
      {
        label: 'Regulatory feat.:',
        show: false,
        filter: {
          name: 'Regulatory feat.:',
          type: 'select',
          options: options.Reg_Feature_Grp,
        },
      },
      {
        label: 'DHS',
        show: true,
      },
      {
        label: 'Platform',
        show: false,
      },
    ];

    return (
      <FilterableDataTable
        name={'filterableDataTableMethylation'}
        data={this.state.data.Data}
        fields={fields}
        getFormattedCell={this.formatColumn}
      />
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
  baseURL: PropTypes.string.isRequired,
};

export default Methylation;
