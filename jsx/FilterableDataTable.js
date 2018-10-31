import React, {Component} from 'react';

import StaticDataTable from 'jsx/StaticDataTable';
import FilterForm from 'jsx/FilterForm';

class FilterableDataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {},
    };
    this.updateFilter = this.updateFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
  }

  updateFilter(filter) {
    this.setState({filter});
  }

  clearFilter() {
    this.updateFilter({});
  }

  render() {
    return (
      <div>
        <FilterForm
          name={this.props.name + '_filter'}
          id={this.props.name + '_filter_form'}
          columns={3}
          filter={this.state.filter}
          updateFilter={this.updateFilter}
          clearFilter={this.clearFilter}
        >
          {this.props.formElements}
        </FilterForm>
        <StaticDataTable
          Data={this.props.data}
          Headers={this.props.headers.all}
          hiddenHeaders={this.props.headers.hidden}
          Filter={this.state.filter}
          getFormattedCell={this.props.formatColumn}
          freezeColumn="File Name"
        />
      </div>);
  }
}

export default FilterableDataTable;
