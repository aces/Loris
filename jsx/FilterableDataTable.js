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
   * Parse filter to remove filter properties when opposite is set to true
   *
   * @param {object} filter passed from FilterForm
   * @return {object} filter
   */
  parseFilter(filter) {
    const parsedFilter = {};
    for (const [filterId, filterProps] of Object.entries(filter)) {
      if (filterProps.opposite === undefined || !filterProps.opposite) parsedFilter[filterId] = filterProps;
    }
    return parsedFilter;
  }

  /**
   * Sets Filter to empty object
   */
  clearFilter() {
    this.updateFilter({});
    history.replaceState({}, '', '?');
  }

  render() {
    const filter = (
      <Filter
        name={this.props.name + '_filter'}
        id={this.props.name + '_filter'}
        columns={this.props.columns}
        filter={this.parseFilter(this.state.filter)}
        fields={this.props.fields}
        updateFilter={this.updateFilter}
        clearFilter={this.clearFilter}
      />
    );

    const dataTable = (
      <DataTable
        data={this.props.data}
        fields={this.props.fields}
        filter={this.state.filter}
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
};

export default FilterableDataTable;
