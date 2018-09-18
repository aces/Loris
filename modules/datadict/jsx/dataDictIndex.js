import FilterForm from 'FilterForm';
import formatDataDictColumn from './columnFormatter';

/**
 * Data Dictionary Page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders Data Dictionary main page consisting of FilterTable and
 * DataTable components.
 *
 * @author Liza Levitis
 * @version 1.0.0
 *
 * */
class DataDictIndex extends React.Component {

  constructor(props) {
    loris.hiddenHeaders = ['DescriptionStatus'];
    super(props);

    this.state = {
      isLoaded: false,
      filter: {}
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
    this.dataDictFilter.clearFilter();
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
      this.dataDictFilter = f;
    }.bind(this);

    return (
        <div>
            <FilterForm
                Module="datadict"
                name="data_dict_filter"
                id="data_dict_filter"
                ref={filterRef}
                columns={2}
                formElements={this.state.Data.form}
                onUpdate={this.updateFilter}
                filter={this.state.filter}>
                <ButtonElement label="Clear Filters" type="reset" onUserInput={this.resetFilters} />
            </FilterForm>
            <StaticDataTable
                Data={this.state.Data.Data}
                Headers={this.state.Data.Headers}
                Filter={this.state.filter}
                getFormattedCell={formatDataDictColumn}
            />
        </div>
    );
  }
}

$(function() {
  const dataDictIndex = (
        <div className="page-datadict">
            <DataDictIndex DataURL={`${loris.BaseURL}/datadict/?format=json`} />
        </div>
    );
  ReactDOM.render(dataDictIndex, document.getElementById("lorisworkspace"));
});

