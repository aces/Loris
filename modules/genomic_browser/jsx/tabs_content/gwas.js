import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FilterableDataTable from 'jsx/FilterableDataTable';
// import Loader from 'jsx/Loader';

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
    // this.fetchData()
    //   .then(() => this.setState({isLoaded: true}));
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
      major_allele: {
        A: 'A',
        C: 'C',
        T: 'T',
        G: 'G',
      },
      minor_allele: {
        A: 'A',
        C: 'C',
        T: 'T',
        G: 'G',
      },
      display: {
        brief: 'Summary fields',
        full: 'All fields',
      },
    };
    const fields = [
      // GWAS Filters
      {
        label: 'Chromosome', show: true, filter: {
          name: 'Chromosome',
          type: 'text',
        },
      },
      {
        label: 'SNP ID', show: true, filter: {
          name: 'SNP_ID',
          type: 'text',
        },
      },
      {
        label: 'Major Allele', show: true, filter: {
          name: 'Major_Allele',
          type: 'select',
          options: options.major_allele,
        },
      },
      {
        label: 'BP Position', show: true, filter: {
          name: 'BP_Position',
          type: 'text',
        },
      },
      {
        label: 'MAF', show: true, filter: {
          name: 'MAF',
          type: 'text',
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
        label: 'P-value', show: true, filter: {
          name: 'Pvalue',
          type: 'text',
        },
      },
      {
        label: 'Estimate', show: true, filter: {
          name: 'Estimate',
          type: 'text',
        },
      },
      {
        label: 'Std Err', show: true, filter: {
          name: 'StdErr',
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
          name={'filterableDataTableGWAS'}
          data={data}
          fields={fields}
          // getFormattedCell={null}
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
