/* exported DicomArchive */
/* global LorisPage, formatColumn */

const defaultProps = {
  Gender: {
    M: 'Male',
    F: 'Female',
    O: 'N/A'
  }
};

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
class DicomArchive extends LorisPage {
  constructor(props) {
    super(props);

    this.state = {
      Sites: {}
    };

    // Bind component instance to custom methods
    this.setFilter = this.setFilter.bind(this);
    this.loadData = this.loadData.bind(this);
    this.showSpinner = this.showSpinner.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.props.DataURL) {
      this.loadData(this.props.DataURL, null, null);
    }
  }

  setFilter(fieldName, fieldValue) {
    // Special treatment for site, to explicitly set it as an integer value
    if (fieldName === "site") {
      var number = Number.parseInt(fieldValue, 10);
      if (Number.isInteger(number)) {
        fieldValue = number;
      }
    }
    super.setFilter(fieldName, fieldValue);
  }

  render() {
    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return super.showSpinner();
    }

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
        <DynamicDataTable
          DataURL={this.props.DataURL}
          Filter={this.state.Filter}
          getFormattedCell={this.props.getFormattedCell}
        />
      </div>
    );
  }
}

DicomArchive.defaultProps = defaultProps;

window.onload = function() {
  var dataURL = loris.BaseURL + "/dicom_archive/?format=json";
  var dicomArchive = (
    <DicomArchive
      Module="dicom_archive"
      DataURL={dataURL}
      getFormattedCell={formatColumn}
    />
  );
  React.render(dicomArchive, document.getElementById("page-dicom-archive"));
};
