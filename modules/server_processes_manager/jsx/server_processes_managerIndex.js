import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

class ServerProcessesManagerIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
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
   * Retrieve data from the provided URL and save it in state
   * Additionally add hiddenHeaders to global loris variable
   * for easy access by columnFormatter.
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
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, row) {
    // Set class to 'bg-danger' if file is hidden.
    return (<td>{cell}</td>);
  }

  render() {
    // If error occurs, return a message.
    // XXX: Replace this with a UI component for 500 errors.
    if (this.state.error) {
      return <h3>An error occured while loading the page.</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

   /**
    * XXX: Currently, the order of these fields MUST match the order of the
    * queried columns in _setupVariables() in server_processes_manager.class.inc
    */
    const fields = [
      {label: 'PID', show: true, filter: {
        name: 'pid',
        type: 'text',
      }},
      {label: 'Type', show: true, filter: {
        name: 'type',
        type: 'text',
      }},
      {label: 'stdout_file', show: true},
      {label: 'stderr_file', show: true},
      {label: 'exit_code_file', show: true},
      {label: 'exit_code', show: true},
      {label: 'UserId', show: true, filter: {
        name: 'userid',
        type: 'text',
      }},
      {label: 'start_time', show: true},
      {label: 'end_time', show: true},
      {label: 'exit_text', show: true},
    ];

    return (
          <FilterableDataTable
            name="server_processes_manager"
            data={this.state.data.Data}
            fields={fields}
            getFormattedCell={this.formatColumn}
          />
    );
  }
}

ServerProcessesManagerIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <ServerProcessesManagerIndex
      dataURL={`${loris.BaseURL}/server_processes_manager/?format=json`}
      hasPermission={loris.userHasPermission}
    />,
    document.getElementById('lorisworkspace')
  );
});
