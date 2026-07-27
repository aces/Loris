import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FilterableDataTable from 'jsx/FilterableDataTable';
import Loader from 'jsx/Loader';
import {withTranslation} from 'react-i18next';

/**
 * CNV Component.
 *
 * @description Genomic Browser CNV tab.
 * @author Alizée Wickenheiser
 * @version 1.0.0
 */
class CNV extends Component {
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
    fetch(`${this.props.baseURL}/genomic_browser/CnvBrowser`,
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
        show: false,
        filter: {
          name: 'File',
          type: 'select',
          options: options.Chromosome,
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
        label: t('Location', {ns: 'genomic_browser'}),
        show: true,
      },
      {
        label: t('Gene', {ns: 'genomic_browser'}),
        show: false,
      },
      {
        label: t('Gene Name', {ns: 'genomic_browser'}),
        show: false,
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
        label: t('Type', {ns: 'loris'}),
        show: true,
        filter: {
          name: 'Type',
          type: 'select',
          options: {
            gain: t('gain', {ns: 'genomic_browser'}),
            loss: t('loss', {ns: 'genomic_browser'}),
            unknown: t('unknown', {ns: 'loris'}),
          },
        },
      },
      {
        label: t('Copy Number Change', {ns: 'genomic_browser'}),
        show: false,
        filter: {
          name: 'Copy Number Change',
          type: 'text',
        },
      },
      {
        label: t('Event Name', {ns: 'genomic_browser'}),
        show: false,
        filter: {
          name: 'Event Name',
          type: 'text',
        },
      },
      {
        label: t('Common', {ns: 'genomic_browser'}),
        show: true,
        filter: {
          name: 'Common',
          type: 'select',
          options: {
            Y: t('Yes', {ns: 'loris'}),
            N: t('No', {ns: 'loris'}),
          },
        },
      },
      {
        label: t('Characteristics', {ns: 'genomic_browser'}),
        show: true,
        filter: {
          name: 'Characteristics',
          type: 'select',
          options: {
            Benign: t('Benign', {ns: 'genomic_browser'}),
            Pathogenic: t('Pathogenic', {ns: 'genomic_browser'}),
            Unknown: t('Unknown', {ns: 'genomic_browser'}),
          },
        },
      },
      {
        label: t('Inheritance', {ns: 'genomic_browser'}),
        show: true,
        filter: {
          name: 'Inheritance',
          type: 'select',
          options: {
            'de novo': t('de novo', {ns: 'genomic_browser'}),
            'maternal': t('maternal', {ns: 'genomic_browser'}),
            'paternal': t('paternal', {ns: 'genomic_browser'}),
            'unclassified': t('unclassified', {ns: 'genomic_browser'}),
            'unknown': t('unknown', {ns: 'loris'}),
            'NA': 'NA',
          },
        },
      },
      {
        label: t('Array Report', {ns: 'genomic_browser'}),
        show: false,
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
        label: t('Validation Method', {ns: 'genomic_browser'}),
        show: false,
      },
      {
        label: t('Platform', {ns: 'genomic_browser'}),
        show: true,
      },
    ];

    return (
      <FilterableDataTable
        name={'filterableDataTableCNV'}
        data={this.state.data.Data}
        fields={fields}
        getFormattedCell={this.formatColumn}
      />
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
  baseURL: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation(['genomic_browser', 'loris'])(CNV);
