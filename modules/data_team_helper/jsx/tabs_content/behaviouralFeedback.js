import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'jsx/Loader';
import FilterableDataTable from 'jsx/FilterableDataTable';

/**
 * Behavioural Feedback Component.
 *
 * @description Data Team Helper 'Behavioural Feedback' tab.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class BehaviouralFeedback extends Component {
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
    this.formatColumn = this.formatColumn.bind(this);
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
    return fetch(window.location.origin + '/data_team_helper/Behavioural',
      {credentials: 'same-origin'}
    )
      .then((resp) => resp.json())
      .then((json) => {
        // console.dir(json);
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
    let reactElement = null;
    switch (column) {
      case 'PSCID': {
        const url = window.location.origin + '/' + cell + '/';
        reactElement = (
          <td><a href={url}>{rowData.PSCID}</a></td>
        );
        break;
      }
      case 'Subproject':
        reactElement = (
          <td>{this.state.data.subprojects[parseInt(cell)]}</td>
        );
        break;
      case 'File':
        if (cell === 'Y') {
          reactElement = (
            <td>
              <a href="#" onClick={loris.loadFilteredMenuClickHandler(
                'genomic_browser/viewGenomicFile/',
                {candID: rowData[1]}
              )}>{cell}</a>
            </td>
          );
        } else {
          reactElement = (
            <td>{cell}</td>
          );
        }
        break;
      case 'CNV':
      case 'CPG':
      case 'SNP':
        if (cell === 'Y') {
          reactElement = (
            <td>
            <span
              style={{cursor: 'pointer'}}
              onClick={loris.loadFilteredMenuClickHandler(
                'genomic_browser/' + column.toLowerCase() + '_browser/',
                {DCCID: rowData[1]}
              )}
            >
              {cell}
            </span>
            </td>
          );
        } else {
          reactElement = (
            <td>{cell}</td>
          );
        }
        break;
      default:
        reactElement = (
          <td>{cell}</td>
        );
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
    let fieldOptions = this.state.data.fieldOptions;
    let fields = [];
    for (let field in fieldOptions) {
      if (fieldOptions.hasOwnProperty(field)) {
        console.log(fieldOptions[field].name);
        if (fieldOptions[field].name === 'FeedbackID' ||
          fieldOptions[field].name === 'SessionID' ||
          fieldOptions[field].name === 'commentid' ||
          fieldOptions[field].name === 'Feedback_level' ||
          fieldOptions[field].name === 'Test_name' ||
          fieldOptions[field].name === 'FieldName' ||
          fieldOptions[field].name === 'Full_name') {
          continue;
        }
        fields.push({
          label: fieldOptions[field].label,
          show: fieldOptions[field].hidden,
          filter: {
            name: fieldOptions[field].name,
            type: fieldOptions[field].type,
            options: fieldOptions[field].options,
          },
        });
      }
    }

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
};

export default BehaviouralFeedback;
