import FilterForm from 'FilterForm';
import formatColumn from './columnFormatter';

/**
 * Help Editor Archive Page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders Help Editor main page consisting of FilterTable and
 * DataTable components.
 *
 * @author Alex Ilea
 * @version 1.0.0
 *
 * */
class HelpEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      filter: {},
      data: {}
    };

    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrive data from the provided URL and save it in state
   * Additionaly add hiddenHeaders to global loris vairable
   * for easy access by columnFormatter.
   */
  fetchData() {
    $.ajax(this.props.DataURL, {
      method: "GET",
      dataType: 'json',
      success: function(data) {
        loris.hiddenHeaders = data.hiddenHeaders ? data.hiddenHeaders : [];
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
    this.refs.helpFilter.clearFilter();
  }

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

    const filterRef = function(f) {
      this.filter = f;
    }.bind(this);

    return (
      <div>
        <FilterForm
          Module="help_editor"
          name="help_filter"
          id="help_filter"
          ref={filterRef}
          columns={2}
          formElements={this.state.Data.form}
          onUpdate={this.updateFilter}
          filter={this.state.filter}
        >
          <ButtonElement
            label="Clear Filters"
            type="reset"
            onUserInput={this.resetFilters}
          />
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

HelpEditor.propTypes = {
  Module: React.PropTypes.string.isRequired,
  DataURL: React.PropTypes.string.isRequired
};

/**
 * Render dicom_page on page load
 */
window.onload = function() {
  var dataURL = loris.BaseURL + "/help_editor/?format=json";
  var helpEditor = (
    <HelpEditor
      Module="help_editor"
      DataURL={dataURL}
    />
  );

  // Create a wrapper div in which react component will be loaded
  const helpEditorDOM = document.createElement('div');
  helpEditorDOM.id = 'page-help-editor';

  // Append wrapper div to page content
  const rootDOM = document.getElementById("lorisworkspace");
  rootDOM.appendChild(helpEditorDOM);

  ReactDOM.render(helpEditor, document.getElementById("page-help-editor"));
};
