import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FilterableDataTable from 'jsx/FilterableDataTable';

/**
 * CNV Component.
 *
 * @description Genomic Browser CNV tab.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class CNV extends Component {
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
      cnv_type: {
        gain: 'gain',
        loss: 'loss',
        unknown: 'unknown',
      },
      characteristics: {
        Benign: 'Benign',
        Pathogenic: 'Pathogenic',
        Unknown: 'Unknown',
      },
      common_cnv: {
        Y: 'Yes',
        N: 'No',
      },
      inheritance: {
        'de nova': 'de nova',
        'maternal': 'maternal',
        'paternal': 'paternal',
        'unclassified': 'unclassified',
        'unknown': 'unknown',
        'NA': 'NA',
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
      // CNV Filters
      {
        label: 'Type', show: true, filter: {
          name: 'CNV_Type',
          type: 'select',
          options: options.cnv_type,
        },
      },
      {
        label: 'Event Name', show: true, filter: {
          name: 'Event_Name',
          type: 'test',
        },
      },
      {
        label: 'Characteristics', show: true, filter: {
          name: 'Characteristics',
          type: 'select',
          options: options.characteristics,
        },
      },
      {
        label: 'Common', show: true, filter: {
          name: 'Common_CNV',
          type: 'select',
          options: options.common_cnv,
        },
      },
      {
        label: 'Copy Number Change', show: true, filter: {
          name: 'Copy_Num_Change',
          type: 'text',
        },
      },
      {
        label: 'Inheritance', show: true, filter: {
          name: 'Inheritance',
          type: 'select',
          options: options.inheritance,
        },
      },
      {
        label: 'Description', show: true, filter: {
          name: 'Description',
          type: 'text',
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
          name={'filterableDataTableCNV'}
          data={data}
          fields={fields}
           // getFormattedCell={null}
         />
      </div>
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
};

export default CNV;
