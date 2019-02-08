import FilterForm from 'FilterForm';
import Loader from 'Loader';

/**
 * Help Editor Archive Page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders Help Editor main page consisting of FilterForm and
 * StaticDataTable components.
 *
 * @author LORIS Team
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

    // TODO: refs should be deprecated in future refactoring.
    /**
     * Set filter to the element's ref for filtering
     */
    this.filter = null;
    this.setFilterRef = element => {
      this.filter = element;
    };

    /*
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
   * Retrieve data from the provided URL and save it in state
   */
  fetchData() {
    $.ajax(this.props.DataURL, {
      method: 'GET',
      dataType: 'json',
      success: data => {
        // FIXME: Remove the following line of code as soon as hiddenHeaders is
        // accepted as a prop by the StaticDataTable Component.
        loris.hiddenHeaders = data.hiddenHeaders || [];
        this.setState({
          data: data,
          isLoaded: true
        });
      },
      error: error => console.error(error)
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

  // TODO: Clearing filters via refs should be deprecated in future refactoring.
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
   * @return {*} a formatted table cell for a given column
   */
  formatColumn(column, cell, rowData, rowHeaders) {
    if (this.state.data.hiddenHeaders.indexOf(column) > -1) {
      return null;
    }

    // Create the mapping between rowHeaders and rowData in a row object.
    let row = {};
    let url;
    rowHeaders.forEach((header, index) => {
      row[header] = rowData[index];
    });

    if (column === 'Topic') {
      url = loris.BaseURL + '/help_editor/edit_help_content/?helpID=' +
             row.HelpID + '&parentID=' + row.ParentID;
      return <td><a href ={url}>{cell}</a></td>;
    }
    if (column === 'Parent Topic') {
      url = loris.BaseURL + '/help_editor/edit_help_content/?helpID=' +
             row.ParentID + '&parentID=' + row.ParentTopicID;
      return <td><a href ={url}>{cell}</a></td>;
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
          Module="help_editor"
          name="help_filter"
          id="help_filter"
          ref={this.setFilterRef}
          columns={2}
          formElements={this.state.data.form}
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
          Data={this.state.data.Data}
          Headers={this.state.data.Headers}
          Filter={this.state.filter}
          getFormattedCell={this.formatColumn}
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
 * Render help_editor on page load
 */
window.onload = () => {
  let dataURL = loris.BaseURL + '/help_editor/?format=json';
  let helpEditor = (
    <HelpEditor
      Module="help_editor"
      DataURL={dataURL}
    />
  );

  ReactDOM.render(helpEditor, document.getElementById('lorisworkspace'));
};
