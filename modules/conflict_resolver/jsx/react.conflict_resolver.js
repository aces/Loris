import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import {Tabs, TabPane} from 'Tabs';
import FilterForm from 'jsx/FilterForm';
import DynamicDataTable from 'jsx/DynamicDataTable';
/**
 * This file contains the React classes for conflict resolver
 * module.
 */

/**
 * This is the React class for Unresolved Conflicts
 */
class UnresolvedConflictsPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: this.props.data,
    };
    this.formatColumn = this.formatColumn.bind(this);
  }

  updateFilterState(filter) {
    this.setState({filter});
  }

  formatColumn(column, cell, rowData, rowHeaders) {
    if (loris.hiddenHeaders.indexOf(column) > -1) {
      return null;
    }
    // Create the mapping between rowHeaders and rowData in a row object.
    let row = {};

    rowHeaders.forEach(function(header, index) {
      row[header] = rowData[index];
    });

    if (column === 'Correct Answer') {
      const value1 = row.Value1;
      const value2 = row.Value2;
      const hash = row.Hash;
      return <td>
        <select name={hash} className='form-control input-sm'>
          <option value='none'>Unresolved</option>
          <option value='1'>{value1}</option>
          <option value='2'>{value2}</option>
        </select>
      </td>;
    }
    return <td>{cell}</td>;
  }
  // Render the HTML
  render() {
    return (
      <TabPane Title='' {...this.props}>
        <form method='post'
              action={this.props.url.base + '/conflict_resolver/'}
              name='conflict_resolver' id='conflict_resolver'>

          <DynamicDataTable
            DataURL={this.props.url.data.unresolved}
            Data={this.state.Data.Data}
            Headers={this.state.Data.Headers}
            Filter={this.state.filter}
            getFormattedCell={this.formatColumn}
            hiddenHeaders={loris.hiddenHeaders}
          />

          <div className='pull-right'>
            <input className='btn btn-sm btn-primary' name='fire_away' value='Save' type='submit'/>
            <input className='btn btn-sm btn-primary' value='Reset' type='reset' style={{marginLeft: 3 + 'px'}}/>
          </div>

        </form>
      </TabPane>
    );
  }
}
UnresolvedConflictsPane.propTypes = {
  url: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};
UnresolvedConflictsPane.defaultProps = {
  module: '',
  url: {
    base: '',
    data: {
      unresolved: '',
      resolved: '',
    },
  },
  data: {},
};

/**
 * This is the React class for the conflict resolver
 */
class ConflictResolverApp extends Component {
  constructor(props) {
    super(props);

    loris.hiddenHeaders = [
      'Value1',
      'Value2',
      'Hash',
      'Site',
    ];

    this.state = {
      isLoaded: false,
      filter: {},
      form: {},
    };
    /**
     * Set filter to the element's ref for filtering
     */
    this.filter = null;
    this.setFilterRef = (element) => {
      this.filter = element;
    };
    /**
     * Bind component instance to custom methods
     */
    this.fetchData = this.fetchData.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrieve data from the provided URL and save it in state
   * Additionally add hiddenHeaders to global loris variable
   * for easy access by columnFormatter.
   */
  fetchData() {
    const url = this.props.url.data.unresolved;
    fetch(
      url, {
        method: 'GET',
        mode: 'same-origin',
        credentials: 'include',
        redirect: 'follow',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    ).then((response) => response.json())
      .then(
        (data) => {
          this.setState({
            Data: data,
            isLoaded: true,
          });
          console.log(data);
        }).catch((error) => {
          // console.log('error: ' + error);
    });
  }

  updateFilter(filter) {
    this.setState({filter});
    if (this.child !== undefined) {
      this.child.updateFilterState(filter);
    }
  }

  resetFilters() {
    this.filter.clearFilter();
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  // Render the HTML
  render() {
    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    const tabs = [];
    tabs.push(
      <UnresolvedConflictsPane
        TabId='UnresolvedConflicts'
        key={1}
        url={this.props.url}
        data={this.state.Data}
        ref={(instance) => {
          this.child = instance;
        }}
      />
    );
    const tabList = [
      {
        id: 'UnresolvedConflicts',
        label: 'Unresolved Conflicts',
      },
      {
        id: 'ResolvedConflicts',
        label: 'Resolved Conflicts',
      },
    ];

    // Hide empty options for Select Elements
    if (this.state.Data) {
      if (this.state.Data.form.site) {
        this.state.Data.form.site.emptyOption = false;
      }
      if (this.state.Data.form.instrument) {
        this.state.Data.form.instrument.emptyOption = false;
      }
      if (this.state.Data.form.visitLabel) {
        this.state.Data.form.visitLabel.emptyOption = false;
      }
    }

    return (
      <div>
        <div>
          <FilterForm
            Module='conflict_resolver'
            id='conflict_resolver_filter'
            name='conflict_resolver_filter'
            columns={2}
            ref={this.setFilterRef}
            formElements={this.state.Data.form}
            onUpdate={this.updateFilter}
            filter={this.state.filter}
          >
            <ButtonElement
              id='testClearForm1'
              label='Clear Filters'
              type='reset'
              onUserInput={this.resetFilters}
            />
          </FilterForm>
        </div>
        <div>
          <Tabs tabs={tabList} defaultTab='UnresolvedConflicts'>
            {tabs}
          </Tabs>
        </div>
      </div>
    );
  }
}
ConflictResolverApp.propTypes = {
  url: PropTypes.object.isRequired,
};
ConflictResolverApp.defaultProps = {
  url: {
    base: '',
    data: {
      unresolved: '',
      resolved: '',
    },
  },
};

/**
 * Render conflictResolver on page load
 */
window.addEventListener('load', () => {
  ReactDOM.render(
    <ConflictResolverApp
      url={{
        base: loris.BaseURL,
        data: {
          unresolved: loris.BaseURL + '/conflict_resolver/?format=json',
          resolved: loris.BaseURL + '/conflict_resolver/resolved_conflicts/?format=json',
        },
      }}
    />,
    document.getElementById('lorisworkspace')
  );
  // Prevent tab switching
  const refresh = setInterval(function() {
    if (document.getElementById('tab-ResolvedConflicts')) {
      $('#tab-ResolvedConflicts').click(function(event) {
        event.preventDefault();
        window.location.href = loris.BaseURL + '/conflict_resolver/resolved_conflicts/';
        return false;
      });
      clearInterval(refresh);
    }
  }, 100);
});
