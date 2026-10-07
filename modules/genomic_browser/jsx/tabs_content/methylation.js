import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FilterableDataTable from 'jsx/FilterableDataTable';
import Loader from 'jsx/Loader';
import {withTranslation} from 'react-i18next';

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
        show: false,
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
        label: t('Sample', {ns: 'genomic_browser'}),
        show: true,
      },
      {
        label: t('CPG Name', {ns: 'genomic_browser'}),
        show: false,
        filter: {
          name: 'File',
          type: 'text',
        },
      },
      {
        label: t('Beta value', {ns: 'genomic_browser'}),
        show: false,
      },
      {
        label: t('Chromosome', {ns: 'genomic_browser'}),
        show: false,
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
        label: t('Probe Loc A', {ns: 'genomic_browser'}),
        show: false,
      },
      {
        label: t('Probe Seq A', {ns: 'genomic_browser'}),
        show: true,
      },
      {
        label: t('Probe Loc B', {ns: 'genomic_browser'}),
        show: true,
      },
      {
        label: t('Probe Seq B', {ns: 'genomic_browser'}),
        show: true,
      },
      {
        label: t('Infinium design', {ns: 'genomic_browser'}),
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
        label: t('Color', {ns: 'genomic_browser'}),
        show: true,
        filter: {
          name: 'Color',
          type: 'select',
          options: {
            Grn: t('Green', {ns: 'genomic_browser'}),
            Red: t('Red', {ns: 'genomic_browser'}),
          },
        },
      },
      {
        label: t('Build', {ns: 'genomic_browser'}),
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
        label: t('SNP', {ns: 'genomic_browser'}),
        show: false,
        filter: {
          name: 'SNP',
          type: 'select',
          options: {
            'NULL': t('No', 'loris'),
            '_': t('Yes', 'loris'),
          },
        },
      },
      {
        label: t('Gene', {ns: 'genomic_browser'}),
        show: true,
      },
      {
        label: t('Accession number', {ns: 'genomic_browser'}),
        show: true,
      },
      {
        label: t('Position', {ns: 'genomic_browser'}),
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
        label: t('Island Loc', {ns: 'genomic_browser'}),
        show: false,
      },
      {
        label: t('Context', {ns: 'genomic_browser'}),
        show: false,
      },
      {
        label: t('Promoter', {ns: 'genomic_browser'}),
        show: false,
      },
      {
        label: t('DMR', {ns: 'genomic_browser'}),
        show: true,
      },
      {
        label: t('Enhancer', {ns: 'genomic_browser'}),
        show: false,
        filter: {
          name: 'Enhancer',
          type: 'select',
          options: {
            1: t('Yes', {ns: 'loris'}),
          },
        },
      },
      {
        label: t('HMM Island', {ns: 'genomic_browser'}),
        show: false,
      },
      {
        label: t('Reg Feature Loc', {ns: 'genomic_browser'}),
        show: false,
      },
      {
        label: t('Regulatory feat.:', {ns: 'genomic_browser'}),
        show: false,
        filter: {
          name: 'Regulatory feat.:',
          type: 'select',
          options: options.Reg_Feature_Grp,
        },
      },
      {
        label: t('DHS', {ns: 'genomic_browser'}),
        show: true,
      },
      {
        label: t('Platform', {ns: 'genomic_browser'}),
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
  t: PropTypes.func.isRequired,
};

export default withTranslation(['genomic_browser', 'loris'])(Methylation);
