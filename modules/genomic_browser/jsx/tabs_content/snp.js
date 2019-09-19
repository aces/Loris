import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FilterableDataTable from 'jsx/FilterableDataTable';

/**
 * SNP Component.
 *
 * @description component for SNP tab.
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
    return fetch(window.location.origin + '/genomic_browser/AjaxGenomicBrowser',
      {credentials: 'same-origin'}
    )
      .then((resp) => resp.json())
      .then((data) => this.setState({data}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * @return {DOMRect}
   */
  render() {
    // Waiting for async data to load.
    // if (!this.state.isLoaded) {
    //   return <Loader/>;
    // }
    const data = this.state.data;
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
        label: 'Site', show: true, filter: {
          name: 'site',
          type: 'select',
          options: options.site,
        },
      },
      {
        label: 'Subproject', show: true, filter: {
          name: 'subproject',
          type: 'select',
          options: options.subproject,
        },
      },
      {
        label: 'DCCID', show: true, filter: {
          name: 'dcid',
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
        label: 'External ID', show: true, filter: {
          name: 'externalID',
          type: 'text',
        },
      },
      {
        label: 'PSCID', show: true, filter: {
          name: 'pscid',
          type: 'text',
        },
      },
      // Genomic Range Filters
      {
        label: 'Build', show: true, filter: {
          name: 'Build',
          type: 'select',
          options: options.build,
        },
      },
      {
        label: 'Strand', show: true, filter: {
          name: 'Strand',
          type: 'select',
          options: options.strand,
        },
      },
      {
        label: 'Genomic Range', show: true, filter: {
          name: 'Genomic_Range',
          type: 'text',
        },
      },
      // SNP Filters
      {
        label: 'rsID', show: true, filter: {
          name: 'rsID',
          type: 'text',
        },
      },
      {
        label: 'Name', show: true, filter: {
          name: 'Name',
          type: 'test',
        },
      },
      {
        label: 'Description', show: true, filter: {
          name: 'Description',
          type: 'test',
        },
      },
      {
        label: 'Allele A', show: true, filter: {
          name: 'Allele_A',
          type: 'select',
          options: options.allele_a,
        },
      },
      {
        label: 'Function Prediction', show: true, filter: {
          name: 'Function_Prediction',
          type: 'select',
          options: options.function_prediction,
        },
      },
      {
        label: 'External Source', show: true, filter: {
          name: 'External_Source',
          type: 'text',
        },
      },
      {
        label: 'Allele B', show: true, filter: {
          name: 'Allele_B',
          type: 'select',
          options: options.allele_b,
        },
      },
      {
        label: 'Exonic Function', show: true, filter: {
          name: 'Exonic_Function',
          type: 'text',
        },
      },
      {
        label: 'Damaging', show: true, filter: {
          name: 'Damaging',
          type: 'select',
          options: options.damaging,
        },
      },
      {
        label: 'Reference Base', show: true, filter: {
          name: 'Reference_Base',
          type: 'select',
          options: options.reference_base,
        },
      },
      {
        label: 'Genotype Quality', show: true, filter: {
          name: 'Genotype_Quality',
          type: 'text',
        },
      },
      {
        label: 'Platform', show: true, filter: {
          name: 'Platform',
          type: 'select',
          options: options.platform,
        },
      },
      {
        label: 'Minor Allele', show: true, filter: {
          name: 'Minor_Allele',
          type: 'select',
          options: options.minor_allele,
        },
      },
      {
        label: 'Validated', show: true, filter: {
          name: 'Validated',
          type: 'select',
          options: options.validated,
        },
      },
      {
        label: 'Display', show: true, filter: {
          name: 'display',
          type: 'select',
          options: options.display,
        },
      },
    ];
    return (
      <div>
         <FilterableDataTable
          name={'filterableDataTableSNP'}
          data={data}
          fields={fields}
           // getFormattedCell={null}
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
