/* exported DicomArchive */
/* global formatColumn */

/**
 * DICOM Archive Page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders DICOM Archive main page consisting of FilterTable and
 * DataTable components.
 *
 * @author Alex Ilea
 * @version 1.0.0
 *
 * */
class DicomArchive extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      Filter: QueryString.get()
    };

    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
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

  /**
   * Clear the Filter object, querystring and input fields
   */
  clearFilter() {
    var Filter = QueryString.clear(this.props.Module);
    this.setState({Filter});
  }

  /**
   * Sets Filter object and querystring to reflect values of input fields
   *
   * @param {string} fieldName - the name of the form element
   * @param {string} fieldValue - the value of the form element
   */
  setFilter(fieldName, fieldValue) {
    // Special treatment for site, to explicitly set it as an integer value
    if (fieldName === "site") {
      var number = Number.parseInt(fieldValue, 10);
      if (Number.isInteger(number)) {
        fieldValue = number;
      }
    }

    var Filter = QueryString.set(this.state.Filter, fieldName, fieldValue);
    this.setState({Filter});
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

    // Defining element names here ensures that `name` and `ref`
    // properties of the element are always kept in sync
    const patientID = "patientID";
    const patientName = "patientName";
    const site = "site";
    const gender = "gender";
    const dateOfBirth = "dateOfBirth";
    const acquisition = "acquisition";
    const archiveLocation = "archiveLocation";
    const seriesUID = "seriesuid";

    const genderList = {
      M: 'Male',
      F: 'Female',
      O: 'N/A'
    };

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
                options={this.state.Data.Sites}
                onUserInput={this.setFilter}
                value={this.state.Filter.site}
                ref={site}
              />
            </div>
            <div className="col-md-6">
              <SelectElement
                name={gender}
                label="Gender"
                options={genderList}
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
                value={this.state.Filter.seriesuid}
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
        <StaticDataTable
          Data={this.state.Data.Data}
          Headers={this.state.Data.Headers}
          Filter={this.state.Filter}
          getFormattedCell={formatColumn}
        />
      </div>
    );
  }
}

DicomArchive.propTypes = {
  Module: React.PropTypes.string.isRequired,
  DataURL: React.PropTypes.string.isRequired
};

/**
 * Render dicom_page on page load
 */
window.onload = function() {
  var dataURL = loris.BaseURL + "/dicom_archive/?format=json";
  var dicomArchive = (
    <DicomArchive
      Module="dicom_archive"
      DataURL={dataURL}
    />
  );

  // Create a wrapper div in which react component will be loaded
  const dicomArchiveDOM = document.createElement('div');
  dicomArchiveDOM.id = 'page-dicom-archive';

  // Append wrapper div to page content
  const rootDOM = document.getElementById("lorisworkspace");
  rootDOM.appendChild(dicomArchiveDOM);

  React.render(dicomArchive, document.getElementById("page-dicom-archive"));
};
