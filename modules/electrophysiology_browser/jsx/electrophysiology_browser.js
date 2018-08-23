import FilterForm from 'FilterForm';
import formatColumn from './columnFormatter';


/**
 * Electrophysiology Browser page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders Electrophysiology Browser main page consisting of FilterTable and
 * DataTable components.
 *
 * @author Cecile Madjar
 * @version 1.0.0
 *
 */
class ElectrophysiologyBrowser extends React.Component {

  constructor(props) {
    super(props);

    loris.hiddenHeaders = ['Session ID'];

    this.state = {
      isLoaded: false,
      filter  : {}
    };

    //Bind component instance to custom methods
    this.fetchData    = this.fetchData.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrieve data from the provided URL and save it in state.
   * Additionaly add hiddenHeaders to global LORIS vairiable
   * for easy access by columnFormatter.
   */
  fetchData() {
    $.ajax(this.props.DataURL, {
      method: "GET",
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
  }

  resetFilters() {
    this.electrophysiologyFilter.clearFilter();
  }

  render() {
    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return (
        <button className="btn-info has-spinner">
          Loading
          <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate">
          </span>
        </button>
      );
    }

    const filterRef = function(f) {
      this.electrophysiologyFilter = f;
    }.bind(this);

    return (
      <div>
        <FilterForm
          Module='electrophysiology_browser'
          name='electrophysiology_filter'
          id='electrophysiology_filter_form'
          ref={this.electrophysiologyFilter}
          columns={2}
          formElements={this.state.Data.form}
          onUpdate={this.updateFilter}
          filter={this.state.filter}
        >
          <ButtonElement label='Clear Filters' type='reset' onUserInput = {this.resetFilters}/>
        </FilterForm>
        <StaticDataTable
          Data={this.state.Data.Data}
          Headers={this.state.Data.Headers}
          Filter={this.state.filter}
          getFormattedCell={formatColumn}
        />
      </div>
    );
  }
}


/**
 * Render electrophysiology browser page on load
 */
window.onload = function () {
  let dataURL = loris.BaseURL + '/electrophysiology_browser/?format=json';
  let electrophysiologyBrowser = (
    <ElectrophysiologyBrowser
      Module='electrophysiology_browser'
      DataURL={dataURL}
    />
  );

  // Create a wrapper div in which React component will be loaded
  const browserDOM = document.createElement('div');
  browserDOM.id    = 'page-electrophysiology-browser';

  // Append wrapper div to page content
  const rootDOM = document.getElementById('lorisworkspace');
  rootDOM.appendChild(browserDOM);

  ReactDOM.render(electrophysiologyBrowser, document.getElementById("page-electrophysiology-browser"));
};