import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

/**
 * Electrophysiology Browser page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders Electrophysiology Browser main page consisting of FilterTable and
 * DataTable components.
 *
 * @author Cecile Madjar
 * @version 1.0.0
 *
 */
class ElectrophysiologyBrowserIndex extends Component {
  constructor(props) {
    super(props);

    // loris.hiddenHeaders = ['Session ID'];

    this.state = {
      data: {},
      error: false,
      isLoaded: false,
    };

    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);
    // this.updateFilter = this.updateFilter.bind(this);
    // this.resetFilters = this.resetFilters.bind(this);
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
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({data}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   *
   * @return {*} a formatted table cell for a given column
   */
  formatColumn(column, cell, row) {
    const style = '';
    let result = <td className={style}>{cell}</td>;
    switch (column) {
      case 'Links':
        let cellTypes = cell.split(',');
        let cellLinks = [];
        for (let i = 0; i < cellTypes.length; i += 1) {
          cellLinks.push(<a key={i} href={loris.BaseURL +
            '/electrophysiology_browser/sessions/' +
            row.SessionID + '?outputType=' +
            cellTypes[i]}>
              {cellTypes[i]}
            </a>);
            cellLinks.push(' | ');
        }

        cellLinks.push(<a key="all" href={loris.BaseURL +
        '/electrophysiology_browser/sessions/' +
        row.SessionID}>
          all types
        </a>);
        result = (<td>{cellLinks}</td>);
        break;
    }

    return result;
  }

  render() {
    // If error occurs, return a message
    if (this.state.error) {
      return <h3>An error occured while loading the page.</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    /**
     * Currently, the order of these fields MUST match the order of the
     * queried columns in _setupVariables() in electrophysiology_browser.class.inc
     */
    const options = this.state.data.fieldOptions;
    const fields = [
      {label: 'Site', show: true, filter: {
        name: 'site',
        type: 'select',
        options: options.sites,
      }},
      {label: 'PSCID', show: true, filter: {
        name: 'PSCID',
        type: 'text',
      }},
      {label: 'DCCID', show: true, filter: {
        name: 'DCCID',
        type: 'text',
      }},
      {label: 'Project', show: true, filter: {
        name: 'project',
        type: 'select',
        options: options.projects,
      }},
      {label: 'Vist Label', show: true, filter: {
        name: 'visitLabel',
        type: 'text',
      }},
      {label: 'Acquisition Time', show: true},
      {label: 'Insertion Time', show: true},
      {label: 'Links', show: true},
      {label: 'SessionID', show: false},
    ];

    return (
      <FilterableDataTable
        name='electrophysiology_filter'
        data={this.state.data.Data}
        fields={fields}
        getFormattedCell={this.formatColumn}
      />
    );
  }
}

ElectrophysiologyBrowserIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <ElectrophysiologyBrowserIndex
      dataURL={`${loris.BaseURL}/electrophysiology_browser/?format=json`}
    />,
    document.getElementById('lorisworkspace')
  );
});
