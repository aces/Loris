import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'jsx/Loader';
import FilterableDataTable from 'jsx/FilterableDataTable';

/**
 * Profiles Component.
 *
 * @description component for Profiles tab.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class Profiles extends Component {
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
    // this.formatColumn = this.formatColumn.bind(this);
  }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
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
    if (!this.state.isLoaded) {
      return <Loader/>;
    }
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
      files: {
        Y: 'Yes',
        N: 'No',
      },
      cpg: {
        Y: 'Yes',
        N: 'No',
      },
      snp: {
        Y: 'Yes',
        N: 'No',
      },
      cnv: {
        Y: 'Yes',
        N: 'No',
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
      // Genomic Filters.
      {
        label: 'Files', show: true, filter: {
          name: 'files',
          type: 'select',
          options: options.files,
        },
      },
      {
        label: 'CPGs found', show: true, filter: {
          name: 'cpg',
          type: 'select',
          options: options.cpg,
        },
      },
      {
        label: 'SNPs found', show: true, filter: {
          name: 'snp',
          type: 'select',
          options: options.snp,
        },
      },
      {
        label: 'CNVs found', show: true, filter: {
          name: 'cnv',
          type: 'select',
          options: options.cnv,
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
          name={'filterableDataTableProfiles'}
          data={data}
          fields={fields}
          // getFormattedCell={null}
        />
      </div>
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
};

export default Profiles;
