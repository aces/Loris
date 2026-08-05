import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FilterableDataTable from 'jsx/FilterableDataTable';
import Loader from 'jsx/Loader';
import {withTranslation} from 'react-i18next';

/**
 * GWAS Component.
 *
 * @description Genomic Browser GWAS tab.
 * @author Alizée Wickenheiser
 * @version 1.0.0
 */
class GWAS extends Component {
  /**
   * Constructor of component
   *
   * @param {object} props - the component properties.
   */
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      error: false,
      isLoaded: false,
    };
    this.fetchData = this.fetchData.bind(this);
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
    fetch(`${this.props.baseURL}/genomic_browser/GwasBrowser`,
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
            Data: json.data.map((e) => Object.values(e)),
            cohorts: json.cohorts,
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
    const hiddenHeaders = [
      'PSC',
      'DCCID',
      'externalID',
    ];
    let reactElement;
    if (-1 === hiddenHeaders.indexOf(column)) {
      switch (column) {
      case 'PSCID':
        const url = `${this.props.baseURL}/${cell}/`;
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
    const {t} = this.props;
    // Waiting for async data to load.
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    // The fields configured for display/hide.
    let fields = [
      {
        label: t('SNP ID', {ns: 'genomic_browser'}),
        show: false,
        filter: {
          name: 'SNP ID',
          type: 'text',
        },
      },
      {
        label: t('Chromosome', {ns: 'genomic_browser'}),
        show: false,
        filter: {
          name: 'Chromosome',
          type: 'text',
        },
      },
      {
        label: t('BP Position', {ns: 'genomic_browser'}),
        show: true,
        filter: {
          name: 'BP Position',
          type: 'text',
        },
      },
      {
        label: t('Major Allele', {ns: 'genomic_browser'}),
        show: true,
        filter: {
          name: 'Major Allele',
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
        label: t('MAF', {ns: 'genomic_browser'}),
        show: true,
        filter: {
          name: 'MAF',
          type: 'text',
        },
      },
      {
        label: t('Estimate', {ns: 'genomic_browser'}),
        show: true,
        filter: {
          name: 'Estimate',
          type: 'text',
        },
      },
      {
        label: t('Std Err', {ns: 'genomic_browser'}),
        show: true,
        filter: {
          name: 'Std Err',
          type: 'text',
        },
      },
      {
        label: t('P-value', {ns: 'genomic_browser'}),
        show: true,
        filter: {
          name: 'P-value',
          type: 'text',
        },
      },
    ];

    return (
      <FilterableDataTable
        name={'filterableDataTableGWAS'}
        data={this.state.data.Data}
        fields={fields}
        getFormattedCell={this.formatColumn}
      />
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
  baseURL: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation(['genomic_browser', 'loris'])(GWAS);
