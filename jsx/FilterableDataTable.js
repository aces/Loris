import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Panel from 'jsx/Panel';
import {Tabs, TabPane} from 'jsx/Tabs';
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
  constructor(props) {
    super(props);
    this.state = {
      filters: {},
    };
    this.updateFilters = this.updateFilters.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
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
   * @param {bool}   exactMatch
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

  render() {
    const filter = (
      <Filter
        name={this.props.name + '_filter'}
        id={this.props.name + '_filter'}
        columns={this.props.columns}
        filters={this.state.filters}
        fields={this.props.fields}
        addFilter={this.addFilter}
        removeFilter={this.removeFilter}
        clearFilters={this.clearFilters}
      />
    );

    const dataTable = (
      <DataTable
        data={this.props.data}
        fields={this.props.fields}
        filters={this.state.filters}
        actions={this.props.actions}
        getFormattedCell={this.props.getFormattedCell}
        getMappedCell={this.props.getMappedCell}
        folder={this.props.folder}
        nullTableShow={this.props.nullTableShow}
      />
    );

    const filterPresets = () => {
      if (this.props.filterPresets) {
        const tabPanes = this.props.filterPresets.map((preset) => {
          return <TabPane TabId={preset.label} key={preset.label}/>;
        });
        const tabs = this.props.filterPresets.map((preset) => {
          return {id: preset.label, label: preset.label};
        });

        return (
          <Tabs tabs={tabs} updateURL={true} onTabChange={(tabId) => {
            const active = this.props.filterPresets.find((preset) => {
              return preset.label === tabId;
            });
            this.updateFilters(active.filter);
          }}>
            {tabPanes}
          </Tabs>
        );
      };
    };

    return (
      <Panel title={this.props.title}>
        {filter}
        {this.props.children}
        {filterPresets()}
        {dataTable}
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
  data: PropTypes.array.isRequired,
  filterPresets: PropTypes.object,
  fields: PropTypes.array.isRequired,
  columns: PropTypes.number,
  getFormattedCell: PropTypes.func,
  actions: PropTypes.array,
};

export default FilterableDataTable;
