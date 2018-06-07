import FilterForm from 'FilterForm';
import formatColumn from './columnFormatter';
import Loader from 'Loader';
import Panel from 'Panel';
/**
 * Examiner Module Page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders Examiner main page consisting of FilterTable and
 * DataTable components.
 *
 * @author Victoria Foing, Zaliqa Rosli
 * @version 1.0.0
 *
 * */
class Examiner extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      Data: {},
      formData: {},
      filter: {},
      updateResult: null,
      errorMessage: null,
    };

    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);
    this.pickElements = this.pickElements.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showAlertMessage = this.showAlertMessage.bind(this);
    this.setFormData = this.setFormData.bind(this);
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
    const self=this;
    $.ajax(this.props.DataURL, {
      method: "GET",
      dataType: 'json',
      success: function(data) {
        loris.hiddenHeaders = data.hiddenHeaders ? data.hiddenHeaders : [];
        self.setState({
          Data: data,
          isLoaded: true
        });
      },
      error: function(error) {
        console.error(error);
      }
    });
  }

  pickElements(json, keys) {
    var subset = {}
    keys.forEach(function (key) {
      if (json.hasOwnProperty(key)) {
        subset[key] = json[key];
      }
    });
    return subset;
  }

  setFormData(formElement, value) {
    let formData = {
      addName: "",
      addRadiologist: "",
      addSite: "",
    };
    formData[formElement] = value;
    this.setState({
      formData: formData
    });
  }

  updateFilter(filter) {
    this.setState({filter});
  }

  resetFilters() {
    this.refs.examinerFilter.clearFilter();
  }

  handleSubmit(e) {
    e.preventDefault();
    let formData = this.state.Data.form;
    let formObject = new FormData();
    for (let key in formData) {
      if (formData[key] !== "") {
        formObject.append(key, formData[key]);
      }
    }
    $.ajax({
      type: 'POST',
      url: `${loris.BaseURL}/examiner/php/examiner.php`,
      data: formObject,
      cache: false,
      contentType: false,
      processData: false,
      success: data => {
        this.setState({
          updateResult: "success",
        });
        this.showAlertMessage();
        this.fetchData();
      },
      error: error => {
        console.error(error);
      },
    });
  }

  showAlertMessage() {
    const self = this;
    if (this.refs["alert-message"] === null) {
      return;
    }
    let alertMsg = this.refs["alert-message"];
    $(alertMsg).fadeTo(2000,500).delay(3000).slideUp(
      500,
      function() {
        self.setState({
          updateResult: null
        });
      }
    );
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
              ref="examinerFilter"
              columns={2}
              formElements={this.pickElements(this.state.Data.form,['examiner','site','radiologist'])}
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
                  <span className="glyphicon glyphicon-plus"></span> Add Examiner
                </span>
              }
            >
              <FormElement
                Module="examiner"
                name="add_examiner"
                id="add_examiner"
                ref="add_examiner"
                columns={2}
                formElements={this.pickElements(this.state.Data.form,['addName','addRadiologist','addSite'])}
                onUserInput={this.setFormData}
              >
                  <div className="col-md-12">
                    <ButtonElement
                      name="fire_away"
                      label={
                        <div>
                          <span className="glyphicon glyphicon-plus"></span> Add
                        </div>
                      }
                      type="submit"
                      buttonClass="btn btn-sm btn-success pull-right"
                      onUserInput = {this.handleSubmit}
                    />
                  </div>
              </FormElement>
            </Panel>
          </div>
        </div>
        <div id="datatable">
          <StaticDataTable
            Data={this.state.Data.Data}
            Headers={this.state.Data.Headers}
            Filter={this.state.filter}
            getFormattedCell={formatColumn}
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
window.onload = function() {
  var examiner = (
    <div id="page-examiner">
      <Examiner
        Module="examiner"
        DataURL={`${loris.BaseURL}/examiner/?format=json`}
      />
    </div>
  );

  ReactDOM.render(examiner, document.getElementById("lorisworkspace"));
};
