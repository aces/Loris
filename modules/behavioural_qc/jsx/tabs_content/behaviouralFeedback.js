import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'jsx/Loader';
import FilterableDataTable from 'jsx/FilterableDataTable';
import {withTranslation} from 'react-i18next'; 

/**
 * Behavioural Feedback Component.
 *
 * @description Behavioural Quality Control 'Behavioural Feedback' tab.
 * @author Alizée Wickenheiser
 * @version 1.0.0
 */
class BehaviouralFeedback extends Component {
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
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrieve data for the form and save it in state.
   */
  fetchData() {
    fetch(`${this.props.baseURL}/behavioural_qc/Behavioural`,
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
    let reactElement;
    switch (column) {
    case 'PSCID':
      reactElement = (
        <td>
          <a href={this.props.baseURL +
            '/' +
            rowData['DCCID']
          }>
            {rowData['PSCID']}
          </a>
        </td>
      );
      break;
    case 'DCCID':
      reactElement = (
        <td>
          <a href={this.props.baseURL +
            '/' +
            rowData['DCCID']
          }>
            {rowData['DCCID']}
          </a>
        </td>
      );
      break;
    case 'Feedback Level':
      let bvlLink = '';
      let bvlLevel = '';
      if (rowData['Instrument']) {
        bvlLink = this.props.baseURL +
                     '/instruments/' +
                     rowData['Test Name'] +
                     '/?candID=' +
                     rowData['DCCID'] +
                     '&sessionID=' +
                     rowData['sessionID'] +
                     '&commentID=' +
                     rowData['commentID'];
        // Open feedback panel
        bvlLink += '&showFeedback=true';
        bvlLevel ='Instrument : ' + rowData['Instrument'];
      } else if (rowData['Visit']) {
        bvlLink = this.props.baseURL +
                     '/instrument_list/' +
                     '?candID=' +
                     rowData['DCCID'] +
                     '&sessionID=' +
                     rowData['sessionID'];
        // Open feedback panel
        bvlLink += '&showFeedback=true';
        bvlLevel ='Visit : ' + rowData['Visit'];
      } else {
        bvlLink = this.props.baseURL +
                     '/' + rowData['DCCID'];
        // Open feedback panel
        bvlLink += '/?showFeedback=true';
        bvlLevel ='Profile : ' + rowData['PSCID'];
      }
      reactElement = (
        <td>
          <a href={bvlLink}>{bvlLevel}</a>
        </td>
      );
      break;
    default:
      reactElement = (
        <td>{cell}</td>
      );
    }
    return reactElement;
  }

  /**
   * @return {JSX} the feedback form to render.
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
        label: t('Instrument', {ns: 'loris'}),
        show: false,
        filter: {
          name: 'Instrument',
          type: 'select',
          options: Object.assign({}, ...Object.entries(
            {...Object.values(options.instruments)})
            .map(([, b]) => ({[b]: b}))
          ),
        },
      },
      {
        label: t('DCCID', {ns: 'loris'}),
        show: true,
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
        label: t('Visit', {ns: 'loris'}),
        show: false,
        filter: {
          name: 'Visit',
          type: 'select',
          options: options.visits,
        },
      },
      {
        label: t('Project', {ns: 'loris'}),
        show: false,
        filter: {
          name: 'Project',
          type: 'select',
          options: options.projects,
        },
      },
      {
        label: t('Cohort', {ns: 'loris'}),
        show: false,
        filter: {
          name: 'Cohort',
          type: 'select',
          options: options.cohorts,
        },
      },
      {
        label: t('Site', {ns: 'loris'}),
        show: false,
        filter: {
          name: 'Site',
          type: 'select',
          options: options.sites,
        },
      },
      {
        label: 'feedbackID',
        show: false,
      },
      {
        label: 'sessionID',
        show: false,
      },
      {
        label: 'commentID',
        show: false,
      },
      {
        label: t('Feedback Level', {ns: 'behavioural_qc'}),
        show: true,
      },
      {
        label: t('Test Name', {ns: 'behavioural_qc'}),
        show: false,
      },
      {
        label: t('Field Name', {ns: 'behavioural_qc'}),
        show: false,
      },
      {
        label: t('Feedback Status', {ns: 'behavioural_qc'}),
        show: true,
      },
    ];

    return (
      <div>
        <FilterableDataTable
          name={'filterableDataTableBehaviouralFeedback'}
          data={this.state.data.Data}
          fields={fields}
          getFormattedCell={this.formatColumn}
        />
      </div>
    );
  }
}
BehaviouralFeedback.defaultProps = {
  display: false,
  data: null,
};
BehaviouralFeedback.propTypes = {
  display: PropTypes.bool,
  data: PropTypes.object,
  baseURL: PropTypes.string.isRequired,
  t: PropTypes.func, 
};

export default withTranslation(['behavioural_qc', 'loris'])(BehaviouralFeedback);
