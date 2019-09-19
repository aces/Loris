import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FilterableDataTable from 'jsx/FilterableDataTable';

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
        label: 'Subproject', show: true, filter: {
          name: 'SubprojectID',
          type: 'select',
          options: options.subproject,
        },
      },
      {
        label: 'DCCID', show: false, filter: {
          name: 'DCCID',
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
        label: 'External ID', show: false, filter: {
          name: 'External_ID',
          type: 'text',
        },
      },
      {
        label: 'PSCID', show: true, filter: {
          name: 'PSCID',
          type: 'text',
        },
      },
      // Genomic Range Filters
      {
        label: 'Gene', show: true, filter: {
          name: 'Gene_Symbol',
          type: 'text',
        },
      },
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
      // CpG Filters
      {
        label: 'CPG name', show: true, filter: {
          name: 'cpg_name',
          type: 'text',
        },
      },
      {
        label: 'Context', show: true, filter: {
          name: 'Context',
          type: 'select',
          options: options.context,
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
        label: 'Position', show: true, filter: {
          name: 'Position',
          type: 'select',
          options: options.position,
        },
      },
      {
        label: 'Infinium design', show: true, filter: {
          name: 'Design',
          type: 'select',
          options: options.design,
        },
      },
      {
        label: 'Color', show: true, filter: {
          name: 'Color',
          type: 'select',
          options: options.color,
        },
      },
      {
        label: 'Enhancer', show: true, filter: {
          name: 'Enhancer',
          type: 'select',
          options: options.enhancer,
        },
      },
      {
        label: 'SNP', show: true, filter: {
          name: 'SNP_10',
          type: 'select',
          options: options.snp_10,
        },
      },
      {
        label: 'Regulatory feat.', show: true, filter: {
          name: 'Reg_Feature_Grp',
          type: 'select',
          options: options.Reg_Feature_Grp,
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
          name={'filterableDataTableMethylation'}
          data={data}
          fields={fields}
           // getFormattedCell={null}
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
