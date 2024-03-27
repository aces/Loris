import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Panel from 'jsx/Panel';
import DataTable from 'jsx/DataTable';
import Filter from 'jsx/Filter';

/**
 * FilterableDataTable component.
 * A wrapper for all datatables that handles filtering.
 *
 * Handles the updating and clearing of the filter state based on changes sent
 * from the FitlerForm.
 *
 * Passes the Filter to the Datatable.
 *
 * Deprecates Filter Form.
 */
class FilterableDataTable extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      filters: {},
    };
    this.updateFilters = this.updateFilters.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.validFilters = this.validFilters.bind(this);
    this.addFilter = this.addFilter.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
  }

  /**
   * Updates filter state
   *
   * @param {object} filters
   */
  updateFilters(filters) {
    this.updateQueryParams(filters);
    this.setState({filters});
    if (this.props.updateFilterCallback) {
      this.props.updateFilterCallback(filters);
    }
  }

  /**
   * Updates URL Query Params
   *
   * @param {object} filters
   */
  updateQueryParams(filters) {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([name, filter]) => {
      if (filter.value.constructor === Array) {
        filter.value.forEach((v) => searchParams.append(name, v));
      } else {
        searchParams.set(name, filter.value);
      }
    });

    history.replaceState({}, '', `?${searchParams.toString()}`);
  }

  /**
   * Add new filter to the filter object
   *
   * @param {string} name
   * @param {*}      value
   * @param {boolean}   exactMatch
   */
  addFilter(name, value, exactMatch) {
    const filters = this.state.filters;
    filters[name] = {value, exactMatch};
    this.updateFilters(filters);
  }

  /**
   * Remove filter from the filter object
   *
   * @param {string} name
   */
  removeFilter(name) {
    const filters = this.state.filters;
    delete filters[name];
    this.updateFilters(filters);
  }

  /**
   * Sets Filter to empty object
   */
  clearFilters() {
    this.updateFilters({});
  }

  /**
   * Returns the filter state, with filters that are
   * set to an invalid option removed from the returned
   * filters
   *
   * @return {object}
   */
  validFilters() {
      let filters = {};
      this.props.fields.forEach((field) => {
        if (!field.filter) {
            return;
        }
        const filtername = field.filter.name;
        const filterval = this.state.filters[filtername];
        if (!filterval) {
            return;
        }

        if (field.filter.type !== 'select') {
            filters[filtername] = filterval;
            return;
        }

        if (!(filterval.value in field.filter.options)) {
            return;
        }
        filters[filtername] = filterval;
      });
      return filters;
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const filters = this.validFilters();
    const filter = (
      <Filter
        name={this.props.name + '_filter'}
        id={this.props.name + '_filter'}
        columns={this.props.columns}
        filters={filters}
        filterPresets={this.props.filterPresets}
        fields={this.props.fields}
        addFilter={this.addFilter}
        updateFilters={this.updateFilters}
        removeFilter={this.removeFilter}
        clearFilters={this.clearFilters}
      />
    );

    const dataTable = (
      <DataTable
        data={this.props.data}
        fields={this.props.fields}
        filters={filters}
        actions={this.props.actions}
        loading={this.props.loading}
        getFormattedCell={this.props.getFormattedCell}
        getMappedCell={this.props.getMappedCell}
        folder={this.props.folder}
        nullTableShow={this.props.nullTableShow}
        noDynamicTable={this.props.noDynamicTable}
      />
    );

    return (
      <Panel title={this.props.title}>
        {filter}
        {this.props.children}
        {dataTable}
      </Panel>
    );
  }
}

FilterableDataTable.defaultProps = {
  columns: 3,
  noDynamicTable: false,
};

FilterableDataTable.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  data: PropTypes.array.isRequired,
  filterPresets: PropTypes.object,
  fields: PropTypes.array.isRequired,
  columns: PropTypes.number,
  getFormattedCell: PropTypes.func,
  actions: PropTypes.array,
  updateFilterCallback: PropTypes.func,
  noDynamicTable: PropTypes.bool,
  loading: PropTypes.element,
  getMappedCell: PropTypes.func,
  folder: PropTypes.element,
  nullTableShow: PropTypes.element,
  children: PropTypes.node,
};

export default FilterableDataTable;
