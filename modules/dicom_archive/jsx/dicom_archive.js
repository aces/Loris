var QueryStringMixin = {

  componentDidMount: function() {
    var queryString = window.location.search.substring(1).split("&");
    var formRefs = this.refs;
    var self = this;

    queryString.forEach(function(param) {
      var key = param.split("=")[0];
      var value = param.split("=")[1];
      if (key !== "" && value !== "") {
        // Set filter from query string
        self.state.Filter[key] = value;
        // Populate input fields from query string
        formRefs[key].state.value = value;
      }
    });
  },
  setQueryString: function(fieldName, fieldValue) {

    // Clear querystring if invalid parameter is passed
    var formRefs = this.refs;
    if (!formRefs.hasOwnProperty(fieldName)) {
      this.clearQueryString();
      return;
    }

    var queryString = "?"; // always start with '?'
    var queryStringObj = this.state.Filter; // object representation of querys

    // Add/Delete to/from query string object
    if (fieldValue === "") {
      delete queryStringObj[fieldName];
    } else {
      queryStringObj[fieldName] = fieldValue;
    }

    // Build query string
    Object.keys(queryStringObj).map(function(key, count) {
      queryString += key + "=" + queryStringObj[key];
      if (count !== Object.keys(queryStringObj).length - 1) {
        queryString += "&";
      }
    });

    window.history.replaceState({}, "", queryString);

  },

  clearQueryString: function() {
    window.history.replaceState({}, "", "/" + this.props.Module + "/");
  }

};


DicomArchive = React.createClass({

    propTypes: {
      'Module' : React.PropTypes.string.isRequired,
    },

    mixins: [
      React.addons.PureRenderMixin,
      QueryStringMixin
    ],

    getInitialState: function() {
        return {
            Filter: {}
        }
    },

    getDefaultProps: function() {
        return {
            Gender: {
                M: 'Male',
                F: 'Female',
                O: 'N/A'
            }
        }
    },

    setFilter: function(fieldName, fieldValue) {
      // Create deep copy of a current filter
      var Filter = JSON.parse(JSON.stringify(this.state.Filter));

      if (fieldValue === "") {
        delete Filter[fieldName];
      } else {
        Filter[fieldName] = fieldValue;
      }

      this.setQueryString(fieldName, fieldValue);
      this.setState({Filter: Filter});
    },

    clearFilter: function() {
      this.clearQueryString();
      this.setState({
        Filter: {}
      });

      // Reset state of child components of FilterTable
      var formRefs = this.refs;
      Object.keys(formRefs).map(function(ref) {
        if (formRefs[ref].state && formRefs[ref].state.value) {
          formRefs[ref].state.value = "";
        }
      });
    },

    render: function() {
        return (
          <div>
            <FilterTable Module="dicom_archive">
              <div className="row">
                <div className="col-md-6">
                  <TextboxElement
                    name="patientID"
                    label="Patient ID"
                    onUserInput={this.setFilter}
                    value={this.state.Filter.patientID}
                    ref="patientID"
                  />
                </div>
                <div className="col-md-6">
                  <TextboxElement
                    name="patientName"
                    label="Patient Name"
                    onUserInput={this.setFilter}
                    value={this.state.Filter.patientName}
                    ref="patientName"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <SelectElement
                    name="sites"
                    label="Sites"
                    options={this.props.Sites}
                    onUserInput={this.setFilter}
                    value={this.state.Filter.sites}
                    ref="sites"
                  />
                </div>
                <div className="col-md-6">
                  <SelectElement
                    name="gender"
                    label="Gender"
                    options={this.props.Gender}
                    onUserInput={this.setFilter}
                    value={this.state.Filter.gender}
                    ref="gender"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <DateElement
                    name="dateOfBirth"
                    label="Date of Birth"
                    onUserInput={this.setFilter}
                    value={this.state.Filter.dateOfBirth}
                    ref="dateOfBirth"
                  />
                </div>
                <div className="col-md-6">
                  <DateElement
                    name="acquisition"
                    label="Acquisition Date"
                    onUserInput={this.setFilter}
                    value={this.state.Filter.acquisition}
                    ref="acquisitionDate"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <TextboxElement
                    name="archiveLocation"
                    label="Archive Location"
                    onUserInput={this.setFilter}
                    value={this.state.Filter.archiveLocation}
                    ref="archiveLocation"
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


RDicomArchive = React.createFactory(DicomArchive);
