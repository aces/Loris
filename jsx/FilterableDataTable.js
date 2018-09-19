import React, {Component} from 'react';

import DynamicDataTable from 'jsx/DynamicDataTable';
import FilterForm from 'jsx/FilterForm';

class FilterableDataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {}
    };
    this.updateFilter = this.updateFilter.bind(this);
  }

  updateFilter(filter) {
    this.setState({filters: filter});
  }

  render() {
    return (
      <div>
        <FilterForm
          name={this.props.name + '_filter'}
          id={this.props.name + '_filter_form'}
          ref={this.props.name + 'Filter'}
          columns={3}
          formElements={this.props.FilterForm}
          onUpdate={this.updateFilter}
        />
        <DynamicDataTable {...this.props}
          Filter={this.state.filters}
        />
      </div>);
  }
}

export default FilterableDataTable;
