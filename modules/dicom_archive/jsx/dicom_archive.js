DicomArchive = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    getInitialState: function() {
        return {
            Filter: {},
            QueryString: {}
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
    componentDidMount: function() {


      var queryString = window.location.search.substring(1).split("&");
      var formRefs = this.refs;
      var self = this;
      var Filter = {};

      queryString.forEach(function(param) {
        var key = param.split("=")[0];
        var value = param.split("=")[1];
        if (key !== "" && value !== "") {
          self.state.QueryString[key] = value;
          formRefs[key].state.value = value;
          Filter[key] = value;
        }
      });

      this.setState({Filter : Filter});

    },
    setFilterValues: function(fieldName, fieldValue) {

        // Create deep copy of a current filter
        var Filter = JSON.parse(JSON.stringify(this.state.Filter));

        if (fieldValue === "") {
            delete Filter[fieldName];
        } else {
            Filter[fieldName] = fieldValue;
        }

        this.setState({Filter: Filter});

        if (this.refs.hasOwnProperty(fieldName) && fieldValue !== "") {

          this.state.QueryString[fieldName] = fieldValue;

          var queryParams = "?";
          var queryObj = this.state.QueryString;
          Object.keys(queryObj).map(function(key, count) {
            queryParams += key + "=" + queryObj[key];
            if (count !== Object.keys(queryObj).length - 1) {
              queryParams += "&";
            }
          });

          window.history.replaceState({}, "", queryParams);
        } else {
          window.history.replaceState({}, "", "/dicom_archive/");
        }


    },
    clearFilter: function() {
      this.setState({
        Filter: {},
        QueryString: {}
      });

      // Reset state of child components of FilterTable
      var formRefs = this.refs;
      Object.keys(formRefs).map(function(ref) {
        if (formRefs[ref].state && formRefs[ref].state.value) {
          formRefs[ref].state.value = "";
        }
      });

      window.history.replaceState({}, "", "/dicom_archive/");

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
                                onUserInput={this.setFilterValues}
                                value={this.state.Filter['Patient ID']}
                                ref="patientID"
                            />
                        </div>
                        <div className="col-md-6">
                            <TextboxElement
                                name="patientName"
                                label="Patient Name"
                                onUserInput={this.setFilterValues}
                                value={this.state.Filter['Patient Name']}
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
                                onUserInput={this.setFilterValues}
                                value={this.state.Filter['Sites']}
                                ref="sites"
                            />
                        </div>
                        <div className="col-md-6">
                            <SelectElement
                                name="gender"
                                label="Gender"
                                options={this.props.Gender}
                                onUserInput={this.setFilterValues}
                                value={this.state.Filter['Gender']}
                                ref="gender"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <DateElement
                                name="birthDate"
                                label="Date of Birth"
                                onUserInput={this.setFilterValues}
                                value={this.state.Filter['Date of Birth']}
                                ref="birthDate"
                            />
                        </div>
                        <div className="col-md-6">
                            <DateElement
                                name="acquisitionDate"
                                label="Acquisition Date"
                                onUserInput={this.setFilterValues}
                                value={this.state.Filter['Acquisition']}
                                ref="acquisitionDate"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <TextboxElement
                                name="archiveLocation"
                                label="Archive Location"
                                onUserInput={this.setFilterValues}
                                value={this.state.Filter['Archive Location']}
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
