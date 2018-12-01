import FilterForm from 'FilterForm';
import Loader from 'Loader';

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
    super(props);

    this.state = {
      isLoaded: false,
      filter: {},
      hiddenHeaders: [],
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
    this.formatColumn = this.formatColumn.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrive data from the provided URL and save it in state
   * Additionaly add hiddenHeaders to global loris variable
   * for easy access by columnFormatter.
   */
  fetchData() {
    $.ajax(this.props.DataURL, {
      method: 'GET',
      dataType: 'json',
      success: (data) => {
        this.setState({
          data: data,
          isLoaded: true,
        });
      },
      error: (error) => console.error(error),
    });
  }

  /**
   * Set this.state.filter to the input filter object
   *
   * @param {object} filter - the filter object
   */
  updateFilter(filter) {
    this.setState({filter});
  }

  // TODO: deprecate clearing filters via refs in future refactoring.
  /**
   * Reset the filter elements with textInput refs to empty values
   */
  resetFilters() {
    this.filter.clearFilter();
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {array} rowData - array of cell contents for a specific row
   * @param {array} rowHeaders - array of table headers (column names)
   *
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, rowData, rowHeaders) {
    if (this.state.hiddenHeaders.indexOf(column) > -1) {
      return null;
    }
    const hasEditPermission = loris.userHasPermission('data_dict_edit');
    if (column === 'Description' && hasEditPermission) {
      let updateDict = (name) => {
        return (e) => {
          e.stopPropagation();

          let value = e.target.valueOf().innerText;
          $.post(loris.BaseURL + '/datadict/ajax/UpdateDataDict.php', {
            fieldname: name, description: value,
          }, (data) => {});
        };
      };
      return (
        <td
          contentEditable="true"
          className="description"
          onBlur={updateDict(rowData[1])}>
            {cell}
        </td>
      );
    }
    return <td>{cell}</td>;
  }

  render() {
    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    return (
      <div>
        <FilterForm
          Module="datadict"
          name="data_dict_filter"
          id="data_dict_filter"
          ref={this.setFilterRef}
          columns={2}
          formElements={this.state.data.form}
          onUpdate={this.updateFilter}
          filter={this.state.filter}>
          <ButtonElement
            label="Clear Filters"
            type="reset"
            onUserInput={this.resetFilters}
          />
        </FilterForm>
        <StaticDataTable
          Data={this.state.data.Data}
          Headers={this.state.data.Headers}
          Filter={this.state.filter}
          getFormattedCell={this.formatColumn}
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
  ReactDOM.render(dataDictIndex, document.getElementById('lorisworkspace'));
});

