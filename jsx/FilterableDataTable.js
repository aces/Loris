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
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      filter: {},
    };
    this.updateFilter = this.updateFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.validFilters = this.validFilters.bind(this);
  }

  /**
   * Updates filter state
   *
   * @param {object} filter passed from FilterForm
   */
  updateFilter(filter) {
    this.setState({filter});
    if (this.props.updateFilterCallback) {
        this.props.updateFilterCallback(filter);
    }
  }

  /**
   * Sets Filter to empty object
   */
  clearFilter() {
    this.updateFilter({});
    history.replaceState({}, '', '?');
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
        const filtername = field.filter.name;
        const filterval = this.state.filter[filtername];
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
        filter={filters}
        fields={this.props.fields}
        updateFilter={this.updateFilter}
        clearFilter={this.clearFilter}
      />
    );

    const dataTable = (
      <DataTable
        data={this.props.data}
        fields={this.props.fields}
        filter={filters}
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
            this.updateFilter(active.filter);
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
  updateFilterCallback: PropTypes.func,
};

export default FilterableDataTable;
