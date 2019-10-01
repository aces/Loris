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
        F: 'Forward',
        R: 'Reverse',
      },
      context: {
        Any: 'Any',
      },
      platform: {
        'Custom CNV array': 'Custom CNV array',
        'Custom SNP array': 'Custom SNP array',
      },
      design: {
        I: 'I',
        II: 'II',
      },
      color: {
        Grn: 'Green',
        Red: 'Red',
      },
      enhancer: {
        1: 'Yes',
      },
      snp_10: {
        NULL: 'No',
        _: 'Yes',
      },
      Reg_Feature_Grp: {
        Any: 'Any',
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
        label: 'Subproject', show: true, filter: {
          name: 'SubprojectID',
          type: 'select',
          options: options.subproject,
        },
      },
      {
        label: 'Date of birth', show: false, filter: {
          name: 'DoB',
          type: 'text',
        },
      },
      {
        label: 'Sample', show: true, filter: {
          name: 'Sample',
          type: 'select',
          options: options.strand,
        },
      },
      {
        label: 'CPG name', show: true, filter: {
          name: 'cpg_name',
          type: 'text',
        },
      },
      {
        label: 'Beta value', show: true, filter: {
          name: 'Beta_value',
          type: 'text',
        },
      },
      {
        label: 'Chromosome', show: true, filter: {
          name: 'Chromosome',
          type: 'text',
        },
      },
      {
        label: 'Strand', show: true, filter: {
          name: 'Strand',
          type: 'text',
        },
      },
      {
        label: 'StartLoc', show: true, filter: {
          name: 'StartLoc',
          type: 'text',
        },
      },
      {
        label: 'Probe Loc A', show: true, filter: {
          name: 'Probe_Loc_A',
          type: 'text',
        },
      },
      {
        label: 'Probe Seq A', show: true, filter: {
          name: 'Probe_Seq_A',
          type: 'text',
        },
      },
      {
        label: 'Probe Loc B', show: true, filter: {
          name: 'Probe_Loc_B',
          type: 'text',
        },
      },
      {
        label: 'Probe Seq B', show: true, filter: {
          name: 'Probe_Seq_B',
          type: 'text',
        },
      },
      {
        label: 'Design', show: true, filter: {
          name: 'Design',
          type: 'text',
        },
      },
      {
        label: 'Color', show: true, filter: {
          name: 'Color',
          type: 'text',
        },
      },
      {
        label: 'Assembly', show: true, filter: {
          name: 'Assembly',
          type: 'text',
        },
      },
      {
        label: 'SNP 10', show: true, filter: {
          name: 'SNP_10',
          type: 'text',
        },
      },
      {
        label: 'Gene', show: true, filter: {
          name: 'Gene',
          type: 'text',
        },
      },
      {
        label: 'Accession number', show: true, filter: {
          name: 'Accession_number',
          type: 'text',
        },
      },
      {
        label: 'Gene Grp', show: true, filter: {
          name: 'Gene_Grp',
          type: 'text',
        },
      },
      {
        label: 'Island Loc', show: true, filter: {
          name: 'Island_Loc',
          type: 'text',
        },
      },
      {
        label: 'Context', show: true, filter: {
          name: 'Context',
          type: 'text',
        },
      },
      {
        label: 'Fantom Prom', show: true, filter: {
          name: 'Fantom_Prom',
          type: 'text',
        },
      },
      {
        label: 'DMR', show: true, filter: {
          name: 'DMR',
          type: 'text',
        },
      },
      {
        label: 'Enhancer', show: true, filter: {
          name: 'Enhancer',
          type: 'text',
        },
      },
      {
        label: 'HMM Island', show: true, filter: {
          name: 'HMM_Island',
          type: 'text',
        },
      },
      {
        label: 'Reg Feature Loc', show: true, filter: {
          name: 'Reg_Feature_Loc',
          type: 'text',
        },
      },
      {
        label: 'Reg Feature Grp', show: true, filter: {
          name: 'Reg_Feature_Grp',
          type: 'text',
        },
      },
      {
        label: 'DHS', show: false, filter: {
          name: 'DHS',
          type: 'text',
        },
      },
      {
        label: 'Platform', show: true, filter: {
          name: 'Platform',
          type: 'text',
        },
      },
    ];
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
