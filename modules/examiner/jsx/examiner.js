import FilterForm from 'FilterForm';
import Loader from 'Loader';
import Panel from 'Panel';

/**
 * Examiner Module Page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders Examiner main page consisting of FilterForm, FormElement and
 * StaticDataTable components.
 *
 * @author Victoria Foing, Zaliqa Rosli
 * @version 1.0.0
 *
 */
class Examiner extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      data: {},
      formData: {
        addName: null,
        addRadiologist: null,
        addSite: null
      },
      filter: {}
    };

    /**
     * Set filter to the element's ref for filtering
     */
    this.filter = null;
    this.setFilterRef = element => {
      this.filter = element;
    };

    /**
     * Bind component instance to custom methods
     */
    this.fetchData = this.fetchData.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrieve data from the provided URL and save it in state
   */
  fetchData() {
    const self = this;
    $.ajax(this.props.DataURL, {
      method: 'GET',
      dataType: 'json',
      success: data => {
        // FIXME: Remove the following line of code as soon as hiddenHeaders is
        // accepted as a prop by the StaticDataTable component.
        loris.hiddenHeaders = data.hiddenHeaders ? data.hiddenHeaders : [];
        self.setState({
          data: data,
          isLoaded: true
        });
      },
      error: error => {
        console.error(error);
      }
    });
  }

  /**
   * Store the value of the element in this.state.formData
   *
   * @param {string} formElement - name of the form element
   * @param {string} value - value of the form element
   */
  setFormData(formElement, value) {
    let formData = this.state.formData;
    formData[formElement] = value;
    this.setState({
      formData: formData
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

  /**
   * Reset the filter elements with filter refs to empty values
   */
  resetFilters() {
    this.filter.clearFilter();
  }

  /**
   * Handles the submission of the Add Examiner form
   *
   * @param {event} e - event of the form
   */
  handleSubmit(e) {
    let formData = this.state.formData;
    let formObject = new FormData();
    for (let key in formData) {
      if (formData[key] !== '') {
        formObject.append(key, formData[key]);
      }
    }
    formObject.append('fire_away', 'Add');
    $.ajax({
      type: 'POST',
      url: loris.BaseURL + '/examiner/',
      data: formObject,
      cache: false,
      contentType: false,
      processData: false,
      success: data => {
        swal('Success!', 'Examiner added.', 'success');
        this.fetchData();
      },
      error: error => {
        console.error(error);
        let message = error.responseText;
        swal('Error!', message, 'error');
      }
    });
  }

  /**
   * Modify behaviour of specified column cells in the Static Data Table component
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
    rowHeaders.forEach((header, index) => {
      row[header] = rowData[index];
    });

    switch (column) {
      case 'Examiner': {
        let url = loris.BaseURL + '/examiner/editExaminer/?identifier=' +
                  row.ID;
        return (
          <td>
            <a href ={url}>{cell}</a>
          </td>
        );
      }
      case 'Radiologist': {
        let radiologist = 'No';
        if (row.Radiologist === '1') {
          radiologist = 'Yes';
        }
        return (
          <td>
            {radiologist}
          </td>
        );
      }
      case 'Certification':
        if (row.Certification === null) {
          return (
            <td>
              None
            </td>
          );
        }
        return (
          <td>
            {cell}
          </td>
        );
      default:
        return (
          <td>
            {cell}
          </td>
        );
    }
  }

  render() {
    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return (
        <Loader/>
      );
    }

    return (
      <div>
        <div id="forms" className="row">
          <div id="filter-examiner" className="col-sm-12 col-md-7">
            <FilterForm
              Module="examiner"
              name="examiner_filter"
              id="examiner_filter_form"
              ref={this.setFilterRef}
              columns={2}
              formElements={this.state.data.form}
              onUpdate={this.updateFilter}
              filter={this.state.filter}
            >
                <div className="col-md-6 col-md-offset-6 col-sm-6">
                    <ButtonElement
                      name="reset"
                      label="Clear Filters"
                      type="reset"
                      buttonClass="btn btn-sm btn-primary col-xs-12"
                      onUserInput={this.resetFilters}
                    />
                </div>
            </FilterForm>
          </div>
          <div id="add-examiner" className="col-sm-12 col-md-5">
            <Panel
              id="add-examiner"
              title={
                <span>
                  <span className="glyphicon glyphicon-plus"/> Add Examiner
                </span>
              }
            >
              <FormElement
                Module="examiner"
                name="add_examiner"
                id="add_examiner"
                onSubmit={this.handleSubmit}
                method="POST"
                columns={2}
              >
                <TextboxElement
                  name="addName"
                  label="Name"
                  value={this.state.formData.addName}
                  required={true}
                  onUserInput={this.setFormData}
                />
                <CheckboxElement
                  name="addRadiologist"
                  label="Radiologist"
                  id="checkRadiologist"
                  value={this.state.formData.addRadiologist}
                  onUserInput={this.setFormData}
                />
                <SelectElement
                  name="addSite"
                  options={this.state.data.form.site.options}
                  label="Site"
                  value={this.state.formData.addSite}
                  required={true}
                  onUserInput={this.setFormData}
                />
                <div className="col-xs-12 col-sm-12 col-md-12">
                  <ButtonElement
                    name="fire_away"
                    label={
                      <div>
                        <span className="glyphicon glyphicon-plus"/> Add
                      </div>
                    }
                    type="submit"
                    buttonClass="btn btn-sm btn-success pull-right"
                  />
                </div>
              </FormElement>
            </Panel>
          </div>
        </div>
        <div id="datatable">
          <StaticDataTable
            Data={this.state.data.Data}
            Headers={this.state.data.Headers}
            Filter={this.state.filter}
            getFormattedCell={this.formatColumn}
          />
        </div>
      </div>
    );
  }
}

Examiner.propTypes = {
  Module: React.PropTypes.string.isRequired,
  DataURL: React.PropTypes.string.isRequired
};

/**
 * Render examiner on page load
 */
window.onload = () => {
  let examiner = (
    <div id="page-examiner">
      <Examiner
        Module="examiner"
        DataURL={`${loris.BaseURL}/examiner/?format=json`}
      />
    </div>
  );

  ReactDOM.render(examiner, document.getElementById('lorisworkspace'));
};
