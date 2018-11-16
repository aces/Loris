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
      page: {
        number: 1,
        rows: 20,
      },
      sort: {
        column: 0,
        ascending: true,
      },
    };
    this.updateFilter = this.updateFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.updatePageNumber = this.updatePageNumber.bind(this);
    this.updatePageRows = this.updatePageRows.bind(this);
    this.updateSortColumn = this.updateSortColumn.bind(this);
    this.toggleSortOrder = this.toggleSortOrder.bind(this);
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

  /**
   * Updates page state
   *
   * @param {int} number of page
   */
  updatePageNumber(number) {
    const page = this.state.page;
    page.number = number;
    this.setState({page});
  }

  /**
   * Updates number of rows per page
   *
   * @param {object} e event from which to abstract value
   */
  updatePageRows(e) {
    const page = this.state.page;
    page.rows = e.target.value;
    this.setState({page});
  }

  updateSortColumn(column) {
    const sort = this.state.sort;
    sort.column = column;
    this.setState({sort});
  }

  toggleSortOrder() {
    const sort = this.state.sort;
    sort.ascending = !sort.ascending;
    this.setState({sort});
  }

  render() {
    const filter = (
      <Filter
        name={this.props.name + '_filter'}
        id={this.props.name + '_filter'}
        columns={this.props.columns}
        filter={this.state.filter}
        fields={this.props.fields}
        actions={this.props.actions}
        updateFilter={this.updateFilter}
        clearFilter={this.clearFilter}
      />
    );

    const dataTable = (
      <DataTable
        data={this.props.data}
        fields={this.props.fields}
        filter={this.state.filter}
        page={this.state.page}
        sort={this.state.sort}
        getFormattedCell={this.props.getFormattedCell}
        updatePageNumber={this.updatePageNumber}
        updatePageRows={this.updatePageRows}
        updateSortColumn={this.updateSortColumn}
        toggleSortOrder={this.toggleSortOrder}
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
  data: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  columns: PropTypes.number,
  getFormattedCell: PropTypes.func,
  actions: PropTypes.object,
};

export default FilterableDataTable;
