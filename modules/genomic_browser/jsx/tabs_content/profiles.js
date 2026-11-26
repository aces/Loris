import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'jsx/Loader';
import FilterableDataTable from 'jsx/FilterableDataTable';
import {withTranslation} from 'react-i18next';

/**
 * Profiles Component.
 *
 * @description Genomic Browser Profiles tab.
 * @author Alizée Wickenheiser
 * @version 1.0.0
 */
class Profiles extends Component {
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
      `${this.props.baseURL}/genomic_browser/Profiles`,
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
    case 'PSCID': {
      const url = `${this.props.baseURL}/${rowData.DCCID}/`;
      reactElement = <td><a href={url}>{rowData.PSCID}</a></td>;
      break;
    }
    case 'File':
      if (cell === 'Y') {
        reactElement = <td>
          <a href="#" onClick={loris.loadFilteredMenuClickHandler(
            'genomic_browser/viewGenomicFile/',
            {candID: rowData[1]}
          )}>{cell}</a>
        </td>;
      } else {
        reactElement = <td>{cell}</td>;
      }
      break;
    case 'CNV':
    case 'CPG':
    case 'SNP':
      if (cell === 'Y') {
        reactElement = <td>
          <span
            style={{cursor: 'pointer'}}
            onClick={loris.loadFilteredMenuClickHandler(
              'genomic_browser/' + column.toLowerCase() + '_browser/',
              {DCCID: rowData[1]}
            )}
          >
            {cell}
          </span>
        </td>;
      } else {
        reactElement = <td>{cell}</td>;
      }
      break;
    default:
      reactElement = <td>{cell}</td>;
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
        label: t('External ID', {ns: 'genomic_browser'}),
        show: false,
        filter: {
          name: 'External ID',
          type: 'text',
        },
      },
      {
        label: t('File', {ns: 'genomic_browser', count: 1}),
        show: true,
        filter: {
          name: 'File',
          type: 'select',
          options: {
            Y: t('Yes', {ns: 'loris'}),
            N: t('No', {ns: 'loris'}),
          },
        },
      },
      {
        label: t('SNPs found', {ns: 'genomic_browser'}),
        show: true,
        filter: {
          name: 'SNPs found',
          type: 'select',
          options: {
            Y: t('Yes', {ns: 'loris'}),
            N: t('No', {ns: 'loris'}),
          },
        },
      },
      {
        label: t('CNVs found', {ns: 'genomic_browser'}),
        show: true,
        filter: {
          name: 'CNVs found',
          type: 'select',
          options: {
            Y: t('Yes', {ns: 'loris'}),
            N: t('No', {ns: 'loris'}),
          },
        },
      },
      {
        label: t('CPGs found', {ns: 'genomic_browser'}),
        show: true,
        filter: {
          name: 'CPGs found',
          type: 'select',
          options: {
            Y: t('Yes', {ns: 'loris'}),
            N: t('No', {ns: 'loris'}),
          },
        },
      },
    ];

    return (
      <FilterableDataTable
        name={'filterableDataTableProfiles'}
        data={this.state.data.Data}
        fields={fields}
        getFormattedCell={this.formatColumn}
      />
    );
  }
}
Profiles.defaultProps = {
  display: false,
  data: null,
};

Profiles.propTypes = {
  display: PropTypes.bool,
  data: PropTypes.object,
  baseURL: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation(['genomic_browser', 'loris'])(Profiles);
