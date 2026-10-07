import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FilterableDataTable from 'jsx/FilterableDataTable';
import Loader from 'jsx/Loader';
import {withTranslation} from 'react-i18next';

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
    const {t} = this.props;
    // Waiting for async data to load.
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    // The filter options
    const options = this.state.data.fieldOptions;

    // The fields configured for display/hide.
    let fields = [
      {
        label: t('Site', {ns: 'loris', count: 1}),
        show: false,
        filter: {
          name: 'Site',
          type: 'select',
          options: options.Sites,
        },
      },
      {
        label: t('DCCID', {ns: 'loris'}),
        show: false,
        filter: {
          name: 'DCCID',
          type: 'text',
        },
      },
      {
        label: t('PSCID', {ns: 'loris'}),
        show: true,
        filter: {
          name: 'PSCID',
          type: 'text',
        },
      },
      {
        label: t('Sex', {ns: 'loris'}),
        show: true,
        filter: {
          name: 'Sex',
          type: 'select',
          options: options.Sex,
        },
      },
      {
        label: t('Cohort', {ns: 'loris', count: 1}),
        show: true,
        filter: {
          name: 'Cohort',
          type: 'select',
          options: options.Cohorts,
        },
      },
      {
        label: t('Date of Birth', {ns: 'loris'}),
        show: false,
      },
      {
        label: t('External ID', {ns: 'genomic_browser'}),
        show: false,
        filter: {
          name: 'External ID',
          type: 'text',
        },
      },
      {
        label: t('Build', {ns: 'genomic_browser'}),
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
        label: t('Strand', {ns: 'genomic_browser'}),
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
        label: t('Start Loc', {ns: 'genomic_browser'}),
        show: false,
      },
      {
        label: t('End Loc', {ns: 'genomic_browser'}),
        show: false,
      },
      {
        label: t('Gene', {ns: 'genomic_browser'}),
        show: false,
      },
      {
        label: t('Gene Name', {ns: 'genomic_browser'}),
        show: false,
        filter: {
          name: 'Gene Name',
          type: 'text',
        },
      },
      {
        label: t('Platform', {ns: 'genomic_browser'}),
        show: true,
        filter: {
          name: 'Platform',
          type: 'select',
          options: options.Platform,
        },
      },
      {
        label: t('rsID', {ns: 'genomic_browser'}),
        show: false,
        filter: {
          name: 'rsID',
          type: 'text',
        },
      },
      {
        label: t('SNP Name', {ns: 'genomic_browser'}),
        show: false,
        filter: {
          name: 'SNP Name',
          type: 'text',
        },
      },
      {
        label: t('Description', {ns: 'genomic_browser'}),
        show: false,
        filter: {
          name: 'Description',
          type: 'text',
        },
      },
      {
        label: t('External Source', {ns: 'genomic_browser'}),
        show: false,
        filter: {
          name: 'External Source',
          type: 'text',
        },
      },
      {
        label: t('Allele A', {ns: 'genomic_browser'}),
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
        label: t('Allele B', {ns: 'genomic_browser'}),
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
        label: t('Reference Base', {ns: 'genomic_browser'}),
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
        label: t('Minor Allele', {ns: 'genomic_browser'}),
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
        label: t('Array Report', {ns: 'genomic_browser'}),
        show: false,
        filter: {
          name: 'Array Report',
          type: 'select',
          options: {
            Abnormal: t('Abnormal', {ns: 'genomic_browser'}),
            Normal: t('Normal', {ns: 'genomic_browser'}),
            Pending: t('Pending', {ns: 'loris'}),
            Uncertain: t('Uncertain', {ns: 'genomic_browser'}),
          },
        },
      },
      {
        label: t('Markers', {ns: 'genomic_browser'}),
        show: false,
      },
      {
        label: t('Validation Method', {ns: 'genomic_browser'}),
        show: false,
      },
      {
        label: t('Validated', {ns: 'genomic_browser'}),
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
        label: t('Function Prediction', {ns: 'genomic_browser'}),
        show: true,
        filter: {
          name: 'Function Prediction',
          type: 'select',
          options: {
            exonic: t('exonic', {ns: 'genomic_browser'}),
            ncRNAexonic: t('ncRNAexonic', {ns: 'genomic_browser'}),
            splicing: t('splicing', {ns: 'genomic_browser'}),
            UTR3: t('UTR3', {ns: 'genomic_browser'}),
            UTR5: t('UTR5', {ns: 'genomic_browser'}),
          },
        },
      },
      {
        label: t('Damaging', {ns: 'genomic_browser'}),
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
        label: t('Genotype Quality', {ns: 'genomic_browser'}),
        show: true,
      },
      {
        label: t('Exonic Function', {ns: 'genomic_browser'}),
        show: false,
        filter: {
          name: 'Exonic Function',
          type: 'text',
        },
      },
      {
        label: t('Genomic Range', {ns: 'genomic_browser'}),
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
  t: PropTypes.func.isRequired,
};

export default withTranslation(['genomic_browser', 'loris'])(SNP);
