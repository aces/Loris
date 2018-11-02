import React, {Component} from 'react';
import DataTable from 'jsx/DataTable';
import Filter from 'jsx/Filter';
import PropTypes from 'prop-types';

/**
 * FilterableDataTable component.
 * A wrapper for all datatables that handles filtering.
 *
 * Handles the updating and clearing of the filter state based on changes sent
 * from the FitlerForm.
 *
 * Passes the Filter to the Datatable.
 */
class FilterableDataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {},
    };
    this.updateFilter = this.updateFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
  }

  /**
   * Updates filter state
   *
   * @param {object} filter passed from FilterForm
   */
  updateFilter(filter) {
    this.setState({filter});
  }

  /**
   * Sets Filter to empty object
   */
  clearFilter() {
    this.updateFilter({});
  }

  render() {
    return (
      <div>
        <Filter
          name={this.props.name + '_filter'}
          id={this.props.name + '_filter'}
          columns={this.props.columns}
          filter={this.state.filter}
          updateFilter={this.updateFilter}
          clearFilter={this.clearFilter}
        >
          {this.props.children}
        </Filter>
        <DataTable
          Data={this.props.data}
          Headers={this.props.headers.all}
          hiddenHeaders={this.props.headers.hidden}
          Filter={this.state.filter}
          getFormattedCell={this.props.getFormattedCell}
          freezeColumn="File Name"
        />
      </div>);
  }
}

FilterableDataTable.defaultProps = {
  columns: 3,
};

FilterableDataTable.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  data: PropTypes.object.isRequired,
  headers: PropTypes.object.isRequired,
  columns: PropTypes.number,
  getFormattedCell: PropTypes.func,
};

export default FilterableDataTable;
