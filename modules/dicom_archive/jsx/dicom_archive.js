/* exported RDicomArchive */
/* global QueryString  */

/**
 * DICOM Archive Page.
 *
 * Renders DICOM Archive main page consisting of FilterTable and
 * DataTable components.
 *
 * @author Alex Ilea
 * @version 1.0.0
 *
 * */
var DicomArchive = React.createClass({
  propTypes: {
    Module: React.PropTypes.string.isRequired
  },
  mixins: [React.addons.PureRenderMixin],
  getInitialState: function() {
    return {
      Filter: {}
    };
  },
  getDefaultProps: function() {
    return {
      Gender: {
        M: 'Male',
        F: 'Female',
        O: 'N/A'
      }
    };
  },
  componentDidMount: function() {
    var formRefs = this.refs;
    var queryString = new QueryString();
    var queryStringObj = queryString.get();

    // Populate input fields from query string
    Object.keys(queryStringObj).map(function(key) {
      if (formRefs[key].state && queryStringObj[key]) {
        formRefs[key].state.value = queryStringObj[key];
      }
    });

    this.setState({
      Filter: queryStringObj,
      QueryString: queryString
    });
  },
  setFilter: function(fieldName, fieldValue) {
    // Create deep copy of a current filter
    var Filter = JSON.parse(JSON.stringify(this.state.Filter));
    var queryString = this.state.QueryString;
    var formRefs = this.refs;

    // If fieldName is part of the form, add to querystring
    if (formRefs.hasOwnProperty(fieldName)) {
      queryString.set(Filter, fieldName, fieldValue);
    } else {
      queryString.clear(this.props.Module);
    }

    // Special treatment for site, to explicitly set it as an integer value
    if (fieldName === "site") {
      var number = Number.parseInt(fieldValue, 10);
      if (Number.isInteger(number)) {
        fieldValue = number;
      }
    }

    if (fieldValue === "") {
      delete Filter[fieldName];
    } else {
      Filter[fieldName] = fieldValue;
    }

    this.setState({Filter: Filter});
  },
  clearFilter: function() {
    var queryString = this.state.QueryString;
    var formRefs = this.refs;

    // Clear query string
    queryString.clear(this.props.Module);

    // Reset state of child components of FilterTable
    Object.keys(formRefs).map(function(ref) {
      if (formRefs[ref].state && formRefs[ref].state.value) {
        formRefs[ref].state.value = "";
      }
    });

    // Clear filter
    this.setState({Filter: {}});
  },
  render: function() {
    // Defining element names here ensures that `name` and `ref`
    // properties of the element are always kept in sync
    var patientID = "patientID";
    var patientName = "patientName";
    var site = "site";
    var gender = "gender";
    var dateOfBirth = "dateOfBirth";
    var acquisition = "acquisition";
    var archiveLocation = "archiveLocation";
    var seriesUID = "seriesuid";

    return (
      <div>
        <FilterTable Module="dicom_archive">
          <div className="row">
            <div className="col-md-6">
              <TextboxElement
                name={patientID}
                label="Patient ID"
                onUserInput={this.setFilter}
                value={this.state.Filter.patientID}
                ref={patientID}
              />
            </div>
            <div className="col-md-6">
              <TextboxElement
                name={patientName}
                label="Patient Name"
                onUserInput={this.setFilter}
                value={this.state.Filter.patientName}
                ref={patientName}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <SelectElement
                name={site}
                label="Sites"
                options={this.props.Sites}
                onUserInput={this.setFilter}
                value={this.state.Filter.sites}
                ref={site}
              />
            </div>
            <div className="col-md-6">
              <SelectElement
                name={gender}
                label="Gender"
                options={this.props.Gender}
                onUserInput={this.setFilter}
                value={this.state.Filter.gender}
                ref={gender}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <DateElement
                name={dateOfBirth}
                label="Date of Birth"
                onUserInput={this.setFilter}
                value={this.state.Filter.dateOfBirth}
                ref={dateOfBirth}
              />
            </div>
            <div className="col-md-6">
              <DateElement
                name={acquisition}
                label="Acquisition Date"
                onUserInput={this.setFilter}
                value={this.state.Filter.acquisition}
                ref={acquisition}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <TextboxElement
                name={archiveLocation}
                label="Archive Location"
                onUserInput={this.setFilter}
                value={this.state.Filter.archiveLocation}
                ref={archiveLocation}
              />
            </div>
            <div className="col-md-6">
              <TextboxElement
                name={seriesUID}
                label="Series UID"
                onUserInput={this.setFilter}
                value={this.state.Filter.seriesUID}
                ref={seriesUID}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <ButtonElement
                label="Clear Filters"
                onUserInput={this.clearFilter}
              />
            </div>
          </div>
        </FilterTable>
        <DynamicDataTable
          DataURL={this.props.DataURL}
          Filter={this.state.Filter}
          getFormattedCell={this.props.getFormattedCell}
        />
      </div>
    );
  }
});

var RDicomArchive = React.createFactory(DicomArchive);
