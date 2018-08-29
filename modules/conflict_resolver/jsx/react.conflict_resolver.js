import {Tabs, TabPane} from 'Tabs';
import FilterForm from 'jsx/FilterForm';
import formatColumn from './columnFormatter';

/**
 *	This file contains the React classes for conflict resolver
 * 	module.
 */

/**
 *	This is the React class for Unresolved Conflicts
 */
class UnresolvedConflictsPane extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      Data: this.props.data
    };
  }

  updateFilterState(filter) {
    this.setState({filter});
  }

  // Render the HTML
  render() {
    return (
      <TabPane Title="" {...this.props}>
        <form method="post"
              action={this.props.url.base + "/conflict_resolver/"}
              name="conflict_resolver" id="conflict_resolver">

          <RDynamicDataTable
            DataURL={this.props.url.data.unresolved}
            Data={this.state.Data.Data}
            Headers={this.state.Data.Headers}
            Filter={this.state.filter}
            getFormattedCell={formatColumn}
          />

          <div className="pull-right">
            <input className="btn btn-sm btn-primary" name="fire_away" value="Save" type="submit"/>
            <input className="btn btn-sm btn-primary" value="Reset" type="reset" style={{marginLeft: 3 + 'px'}}/>
          </div>

        </form>
      </TabPane>
    );
  }
}
UnresolvedConflictsPane.propTypes = {
  url: React.PropTypes.object.isRequired,
  data: React.PropTypes.object.isRequired
};
UnresolvedConflictsPane.defaultProps = {
  module: '',
  url: {
    base: '',
    data: {
      unresolved: '',
      resolved: ''
    }
  },
  data: {}
};

/**
 * This is the React class for the conflict resolver
 */
class ConflictResolverApp extends React.Component {

  constructor(props) {
    super(props);

    loris.hiddenHeaders = [
      'Value1',
      'Value2',
      'Hash',
      'Site'
    ];

    this.state = {
      isLoaded: false,
      filter: {},
      form: {}
    };

    // Bind component instance to custom methods
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
    $.ajax(this.props.url.data.unresolved, {
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        this.setState({
          Data: data,
          isLoaded: true
        });
      }.bind(this),
      error: function(error) {
        console.error(error);
      }
    });
  }

  updateFilter(filter) {
    this.setState({filter});
    if (this.child !== undefined) {
      this.child.updateFilterState(filter);
    }
  }

  resetFilters() {
    this.refs.conflict_resolver_Filter.clearFilter();
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  // Render the HTML
  render() {
    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return (
        <button className="btn-info has-spinner">
          Loading
          <span
            className="glyphicon glyphicon-refresh glyphicon-refresh-animate">
          </span>
        </button>
      );
    }

    let tabs = [];
    tabs.push(
      <UnresolvedConflictsPane
        TabId="UnresolvedConflicts"
        key={1}
        url={this.props.url}
        data={this.state.Data}
        ref={instance => {
          this.child = instance;
        }}
      />
    );
    let tabList = [
      {
        id: "UnresolvedConflicts",
        label: "Unresolved Conflicts"
      },
      {
        id: "ResolvedConflicts",
        label: "Resolved Conflicts"
      }
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
            Module="conflict_resolver"
            name="conflict_resolver_filter"
            id="conflict_resolver_filter"
            ref="conflict_resolver_Filter"
            columns={2}
            formElements={this.state.Data.form}
            onUpdate={this.updateFilter}
            filter={this.state.filter}
            emptyOption={false}
          >
            <ButtonElement
              id="testClearForm1"
              label="Clear Filters"
              type="reset"
              onUserInput={this.resetFilters}
            />
          </FilterForm>
        </div>
        <div>
          <Tabs tabs={tabList} defaultTab="UnresolvedConflicts">
            {tabs}
          </Tabs>
        </div>
      </div>
    );
  }
}
ConflictResolverApp.propTypes = {
  module: React.PropTypes.string.isRequired,
  url: React.PropTypes.object.isRequired
};
ConflictResolverApp.defaultProps = {
  module: '',
  url: {
    base: '',
    data: {
      unresolved: '',
      resolved: ''
    }
  }
};

/**
 * Render conflictResolver on page load
 */
window.onload = function() {
  const conflictResolver = (
    <ConflictResolverApp
      module={'conflictResolver'}
      url={{
        base: loris.BaseURL,
        data: {
          unresolved: loris.BaseURL + '/conflict_resolver/?format=json',
          resolved: loris.BaseURL + '/conflict_resolver/resolved_conflicts/?format=json'
        }
      }}
    />
  );

  // Create a wrapper div in which react component will be loaded
  const ConflictResolverDOM = document.createElement('div');
  ConflictResolverDOM.id = 'conflictResolver';

  // Append wrapper div to page content
  const rootDOM = document.getElementById('lorisworkspace');
  rootDOM.appendChild(ConflictResolverDOM);

  // Render the React Component.
  ReactDOM.render(conflictResolver, document.getElementById('conflictResolver'));

  // Prevent tab switching
  let refresh = setInterval(function() {
    if (document.getElementById('tab-ResolvedConflicts')) {
      $('#tab-ResolvedConflicts').click(function(event) {
        event.preventDefault();
        window.location.href = loris.BaseURL + '/conflict_resolver/resolved_conflicts/';
        return false;
      });
      clearInterval(refresh);
    }
  }, 100);
};
