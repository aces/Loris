/* exported DicomArchive */
/* global formatColumn, ReactDOM */

import formatColumn from './columnFormatter';

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
      filter: {}
    };

    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
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
        <FilterForm
          Module="dicom_archive"
          name="dicom_filter"
          id="dicom_filter"
          columns={2}
          onUpdate={this.updateFilter}
          filter={this.state.filter}
        >
          <TextboxElement
            name={patientID}
            label="Patient ID"
            ref={patientID}
          />
          <TextboxElement
            name={patientName}
            label="Patient Name"
            ref={patientName}
          />
          <SelectElement
            name={site}
            label="Sites"
            options={this.state.Data.Sites}
            ref={site}
          />
          <SelectElement
            name={gender}
            label="Gender"
            options={genderList}
            ref={gender}
          />
          <DateElement
            name={dateOfBirth}
            label="Date of Birth"
            ref={dateOfBirth}
          />
          <DateElement
            name={acquisition}
            label="Acquisition Date"
            ref={acquisition}
          />
          <TextboxElement
            name={archiveLocation}
            label="Archive Location"
            ref={archiveLocation}
          />
          <TextboxElement
            name={seriesUID}
            label="Series UID"
            ref={seriesUID}
          />
          <ButtonElement
            label="Clear Filters"
            type="reset"
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

  ReactDOM.render(dicomArchive, document.getElementById("page-dicom-archive"));
};
