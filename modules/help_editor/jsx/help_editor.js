import FilterForm from 'FilterForm';

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
    this.filter.clearFilter();
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

/* exported formatColumn */

/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {arrray} rowData - array of cell contents for a specific row
 * @param {arrray} rowHeaders - array of table headers (column names)
 * @return {*} a formated table cell for a given column
 */
function formatColumn(column, cell, rowData, rowHeaders) {
  if (loris.hiddenHeaders.indexOf(column) > -1) {
    return null;
  }
  // Create the mapping between rowHeaders and rowData in a row object.
  var row = {};
  var url;
  rowHeaders.forEach(function(header, index) {
    row[header] = rowData[index];
  }, this);

  if (column === 'Topic') {
    url = loris.BaseURL + "/help_editor/edit_help_content/?helpID=" +
           row.HelpID + "&parentID=" + row.ParentID;
    return <td>
                <a href ={url}>{cell}</a>
             </td>;
  }
  if (column === 'Parent Topic') {
    url = loris.BaseURL + "/help_editor/edit_help_content/?helpID=" +
           row.ParentID + "&parentID=" + row.ParentTopicID;
    return <td>
                <a href ={url}>{cell}</a>
             </td>;
  }

  return <td>{cell}</td>;
}

window.formatColumn = formatColumn;

export default formatColumn;

/**
 * Render help_editor on page load
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
