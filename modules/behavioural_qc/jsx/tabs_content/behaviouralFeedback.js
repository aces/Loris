import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'jsx/Loader';
import FilterableDataTable from 'jsx/FilterableDataTable';

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
    // Waiting for async data to load.
    if (!this.state.isLoaded) {
      return <Loader/>;
    }
    // The filter options
    const options = this.state.data.fieldOptions;

    // The fields configured for display/hide.
    let fields = [
      {
        label: 'Instrument',
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
        label: 'DCCID',
        show: true,
        filter: {
          name: 'DCCID',
          type: 'text',
        },
      },
      {
        label: 'PSCID',
        show: true,
        filter: {
          name: 'PSCID',
          type: 'text',
        },
      },
      {
        label: 'Visit',
        show: false,
        filter: {
          name: 'Visit',
          type: 'select',
          options: options.visits,
        },
      },
      {
        label: 'Project',
        show: false,
        filter: {
          name: 'Project',
          type: 'select',
          options: options.projects,
        },
      },
      {
        label: 'Cohort',
        show: false,
        filter: {
          name: 'Cohort',
          type: 'select',
          options: options.cohorts,
        },
      },
      {
        label: 'Site',
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
        label: 'Feedback Level',
        show: true,
      },
      {
        label: 'Test Name',
        show: false,
      },
      {
        label: 'Field Name',
        show: false,
      },
      {
        label: 'Feedback Status',
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
};

export default BehaviouralFeedback;
