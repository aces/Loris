import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

class ModuleManagerIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      error: false,
      isLoaded: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.mapColumn = this.mapColumn.bind(this);
  }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrieve data from the provided URL and save it in state
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

    mapColumn(column, cell) {
      switch (column) {
      case 'Active':
              if (cell === 'Y') {
                  return 'Yes';
              } else if (cell === 'N') {
                  return 'No';
              }
              // This shouldn't happen, it's a non-nullable
              // enum in the backend.
              return '?';
          default: return cell;
      }
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
    if (column == 'Active') {
        return <td><SelectElement
              name='active'
              label=''
              emptyOption={false}
              options={{'Y': 'Yes', 'N': 'No'}}
              value={cell}
            /></td>;
    }
    cell = this.mapColumn(column, cell);

    return <td>{cell}</td>;
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

    const fields = [
      {label: 'Name', show: true, filter: {
        name: 'Name',
        type: 'text',
      }},
      {label: 'Full Name', show: true, filter: {
        name: 'Full Name',
        type: 'text',
      }},
      {label: 'Active', show: true, filter: {
        name: 'Active',
        type: 'select',
        options: {
            'Y': 'Yes',
            'N': 'No',
        },
      }},
    ];
    return (
      <FilterableDataTable
        name="module_manager"
        data={this.state.data.Data}
        fields={fields}
        getFormattedCell={this.formatColumn}
      />

    );
  }
}

ModuleManagerIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <ModuleManagerIndex
      dataURL={`${loris.BaseURL}/module_manager/?format=json`}
    />,
    document.getElementById('lorisworkspace')
  );
});
