import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Panel from './Panel';
import DataTable from './DataTable';
import Filter from './Filter';

/**
 * FilterableDataTable component.
 * A wrapper for all datatables that handles filtering.
 *
 * Handles the updating and clearing of the filter state based on changes sent
 * from the FilterForm.
 *
 * Passes the Filter to the Datatable.
 *
 * Deprecates Filter Form.
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
      <Panel
        title={this.props.title}
      >
        <Filter
          name={this.props.name + '_filter'}
          id={this.props.name + '_filter'}
          title='Selection Filter'
          columns={this.props.columns}
          filter={this.state.filter}
          fields={this.props.fields}
          updateFilter={this.updateFilter}
          clearFilter={this.clearFilter}
        />
        <DataTable
          data={this.props.data}
          fields={this.props.fields}
          filter={this.state.filter}
          getFormattedCell={this.props.getFormattedCell}
          actions={this.props.actions}
        />
      </Panel>
    );
  }
}

FilterableDataTable.defaultProps = {
  columns: 3,
};

FilterableDataTable.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  data: PropTypes.object.isRequired,
  filter: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  columns: PropTypes.number,
  getFormattedCell: PropTypes.func,
  actions: PropTypes.object,
};

export default FilterableDataTable;
