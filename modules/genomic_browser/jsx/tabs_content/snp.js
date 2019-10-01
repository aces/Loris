import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FilterableDataTable from 'jsx/FilterableDataTable';
import Loader from 'jsx/Loader';

/**
 * SNP Component.
 *
 * @description Genomic Browser SNP tab.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class SNP extends Component {
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
    // this.fetchData()
    //   .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrieve data from the provided URL and save it in state.
   *
   * @return {object}
   */
  fetchData() {
    return fetch(window.location.origin + '/genomic_browser/SnpBrowser',
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
    // console.log('column');
    // console.log(column);
    // console.log('cell');
    // console.log(cell);
    // console.log('rowData');
    // console.log(rowData);

    let reactElement = null;
    if (true) {
      switch (column) {
        case 'PSCID':
          const url = window.location.origin + '/' + rowData.DCCID + '/';
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
    // const data = this.state.data;
    // const options = this.state.data.fieldOptions;
    const options = {
      site: {
        1: 'Data Coordinating Center',
        2: 'Montreal',
        3: 'Ottawa',
        4: 'Rome',
      },
      subproject: {
        1: 'Stale',
        2: 'Fresh',
        3: 'Low Yeast',
        4: 'High Yeast',
      },
      sex: {
        Male: 'Male',
        Female: 'Female',
      },
      build: {
        37: 'GRCh37',
      },
      strand: {
        'F': 'Forward',
        'R': 'Reverse',
      },
      allele_a: {
        'A': 'A',
        'C': 'C',
        'T': 'T',
        'G': 'G',
      },
      function_prediction: {
        'exonic': 'exonic',
        'ncRNAexonic': 'ncRNAexonic',
        'splicing': 'splicing',
        'UTR3': 'UTR3',
        'UTR5': 'UTR5',
      },
      allele_b: {
        'A': 'A',
        'C': 'C',
        'T': 'T',
        'G': 'G',
      },
      damaging: {
        'D': 'D',
        'NA': 'NA',
      },
      reference_base: {
        'A': 'A',
        'C': 'C',
        'T': 'T',
        'G': 'G',
      },
      platforms: {
        'Custom CNV array': 'Custom CNV array',
        'Custom SNP array': 'Custom SNP array',
      },
      minor_allele: {
        'A': 'A',
        'C': 'C',
        'T': 'T',
        'G': 'G',
      },
      validated: {
        0: 0,
        1: 1,
      },
      display: {
        brief: 'Summary fields',
        full: 'All fields',
      },
    };
    const fields = [
      // Candidate Filters
      {
        label: 'Site', show: false, filter: {
          name: 'centerID',
          type: 'select',
          options: options.site,
        },
      },
      {
        label: 'DCCID', show: false, filter: {
          name: 'DCCID',
          type: 'text',
        },
      },
      {
        label: 'PSCID', show: true, filter: {
          name: 'PSCID',
          type: 'text',
        },
      },
      {
        label: 'Sex', show: true, filter: {
          name: 'sex',
          type: 'select',
          options: options.sex,
        },
      },
      {
        label: 'Subproject', show: false, filter: {
          name: 'SubprojectID',
          type: 'select',
          options: options.subproject,
        },
      },
      {
        label: 'DoB', show: false, filter: {
          name: 'Date of Birth',
          type: 'select',
          options: options.subproject,
        },
      },
      {
        label: 'External ID', show: false, filter: {
          name: 'External_ID',
          type: 'text',
        },
      },
      {
        label: 'Chromosome', show: false, filter: {
          name: 'Chromosome',
          type: 'text',
        },
      },
      {
        label: 'Strand', show: false, filter: {
          name: 'Strand',
          type: 'select',
          options: options.strand,
        },
      },
      {
        label: 'StartLoc', show: false, filter: {
          name: 'StartLoc',
          type: 'select',
          options: options.strand,
        },
      },
      {
        label: 'EndLoc', show: false, filter: {
          name: 'EndLoc',
          type: 'select',
          options: options.strand,
        },
      },
      {
        label: 'Gene Symbol', show: false, filter: {
          name: 'Gene_Symbol',
          type: 'select',
          options: options.strand,
        },
      },
      {
        label: 'Gene Name', show: false, filter: {
          name: 'Gene_Name',
          type: 'select',
          options: options.strand,
        },
      },
      {
        label: 'Platform', show: false, filter: {
          name: 'Platform',
          type: 'select',
          options: options.platform,
        },
      },
      {
        label: 'RsID', show: true, filter: {
          name: 'RsID',
          type: 'text',
        },
      },
      {
        label: 'SNP Name', show: false, filter: {
          name: 'SNP_Name',
          type: 'text',
        },
      },
      {
        label: 'SNP Description', show: false, filter: {
          name: 'SNP_Description',
          type: 'text',
        },
      },
      {
        label: 'External Source', show: false, filter: {
          name: 'SNP_Description',
          type: 'text',
        },
      },
      {
        label: 'Allele A', show: true, filter: {
          name: 'Allele_A',
          type: 'text',
        },
      },
      {
        label: 'Allele B', show: true, filter: {
          name: 'Allele_B',
          type: 'text',
        },
      },
      {
        label: 'Reference Base', show: true, filter: {
          name: 'Reference_Base',
          type: 'text',
        },
      },
      {
        label: 'Minor Allele', show: true, filter: {
          name: 'Minor_Allele',
          type: 'text',
        },
      },
      {
        label: 'Array Report', show: false, filter: {
          name: 'Array_Report',
          type: 'text',
        },
      },
      {
        label: 'Markers', show: false, filter: {
          name: 'Markers',
          type: 'text',
        },
      },
      {
        label: 'Validation Method', show: false, filter: {
          name: 'Validation_Method',
          type: 'text',
        },
      },
      {
        label: 'Validated', show: false, filter: {
          name: 'Validated',
          type: 'text',
        },
      },
      {
        label: 'Function Prediction', show: true, filter: {
          name: 'Function_Prediction',
          type: 'text',
        },
      },
      {
        label: 'Damaging', show: true, filter: {
          name: 'Damaging',
          type: 'text',
        },
      },
      {
        label: 'Genotype Quality', show: false, filter: {
          name: 'Genotype_Quality',
          type: 'text',
        },
      },
      {
        label: 'Exonic Function', show: true, filter: {
          name: 'Exonic_Function',
          type: 'text',
        },
      },
    ];
    return (
      <div>
         <FilterableDataTable
          name={'filterableDataTableSNP'}
          data={this.state.data.Data}
          fields={fields}
          getFormattedCell={this.formatColumn}
         />
      </div>
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
};

export default SNP;
