import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FilterableDataTable from 'jsx/FilterableDataTable';
import Loader from 'jsx/Loader';

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
    return fetch(window.location.origin + '/genomic_browser/CvnBrowser',
      {credentials: 'same-origin'}
    )
      .then((resp) => resp.json())
      .then((json) => {
        console.log(json);
        const data = {
          fieldOptions: json.fieldOptions,
          Data: json.data.map((e) => Object.values(e)),
          subprojects: json.subprojects,
        };
        this.setState({data});
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
   *
   * @return {*} a formatted table cell for a given column
   */
  formatColumn(column, cell, rowData, rowHeaders) {
    // console.log('column');
    // console.log(column);
    // console.log('cell');
    // console.log(cell);
    // console.log('rowData');
    // console.log(rowData);

    let reactElement = null;
    if (true) {
      switch (column) {
        case 'PSCID':
          const url = window.location.origin + '/' + rowData.DCCID + '/';
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
    // Waiting for async data to load.
    if (!this.state.isLoaded) {
      return <Loader/>;
    }
    // const data = this.state.data;
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
        label: 'DCCID', show: false, filter: {
          name: 'DCCID',
          type: 'text',
        },
      },
      {
        label: 'PSCID', show: true, filter: {
          name: 'PSCID',
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
        label: 'Subproject', show: true, filter: {
          name: 'SubprojectID',
          type: 'select',
          options: options.subproject,
        },
      },
      {
        label: 'Date of birth', show: false, filter: {
          name: 'DoB',
          type: 'text',
        },
      },
      {
        label: 'External ID', show: false, filter: {
          name: 'External_ID',
          type: 'text',
        },
      },
      {
        label: 'Chromosome', show: false, filter: {
          name: 'Chromosome',
          type: 'text',
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
        label: 'StartLoc', show: false, filter: {
          name: 'StartLoc',
          type: 'select',
          options: options.strand,
        },
      },
      {
        label: 'EndLoc', show: false, filter: {
          name: 'EndLoc',
          type: 'select',
          options: options.strand,
        },
      },
      {
        label: 'Location', show: true, filter: {
          name: 'Location',
          type: 'select',
          options: options.strand,
        },
      },
      {
        label: 'Gene Symbol', show: true, filter: {
          name: 'Gene_Symbol',
          type: 'select',
          options: options.strand,
        },
      },
      {
        label: 'Gene Name', show: true, filter: {
          name: 'Gene_Name',
          type: 'select',
          options: options.strand,
        },
      },
      {
        label: 'CNV Description', show: true, filter: {
          name: 'CNV_Description',
          type: 'select',
          options: options.strand,
        },
      },
      {
        label: 'CNV Type', show: true, filter: {
          name: 'CNV_Type',
          type: 'select',
          options: options.strand,
        },
      },
      {
        label: 'Copy Num Change', show: false, filter: {
          name: 'Copy_Num_Change',
          type: 'select',
          options: options.strand,
        },
      },
      {
        label: 'Event Name', show: false, filter: {
          name: 'Event_Name',
          type: 'test',
        },
      },
      {
        label: 'Common CNV', show: false, filter: {
          name: 'Common_CNV',
          type: 'test',
        },
      },
      {
        label: 'Characteristics', show: true, filter: {
          name: 'Characteristics',
          type: 'test',
        },
      },
      {
        label: 'Inheritance', show: true, filter: {
          name: 'Inheritance',
          type: 'test',
        },
      },
      {
        label: 'Array Report', show: false, filter: {
          name: 'Array_Report',
          type: 'test',
        },
      },
      {
        label: 'Markers', show: true, filter: {
          name: 'Markers',
          type: 'test',
        },
      },
      {
        label: 'Validation Method', show: true, filter: {
          name: 'Validation_Method',
          type: 'test',
        },
      },
      {
        label: 'Platform', show: true, filter: {
          name: 'Platform',
          type: 'test',
        },
      },
    ];
    return (
      <div>
         <FilterableDataTable
          name={'filterableDataTableCNV'}
          data={this.state.data.Data}
          fields={fields}
          getFormattedCell={this.formatColumn}
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
