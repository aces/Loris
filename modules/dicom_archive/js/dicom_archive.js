var QueryStringMixin = {

  componentDidMount: function () {
    var queryString = window.location.search.substring(1).split("&");
    var formRefs = this.refs;
    var self = this;

    queryString.forEach(function (param) {
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
  setQueryString: function (fieldName, fieldValue) {

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
    Object.keys(queryStringObj).map(function (key, count) {
      queryString += key + "=" + queryStringObj[key];
      if (count !== Object.keys(queryStringObj).length - 1) {
        queryString += "&";
      }
    });

    window.history.replaceState({}, "", queryString);
  },

  clearQueryString: function () {
    window.history.replaceState({}, "", "/" + this.props.Module + "/");
  }

};

DicomArchive = React.createClass({
  displayName: "DicomArchive",


  propTypes: {
    'Module': React.PropTypes.string.isRequired
  },

  mixins: [React.addons.PureRenderMixin, QueryStringMixin],

  getInitialState: function () {
    return {
      Filter: {}
    };
  },

  getDefaultProps: function () {
    return {
      Gender: {
        M: 'Male',
        F: 'Female',
        O: 'N/A'
      }
    };
  },

  setFilter: function (fieldName, fieldValue) {
    // Create deep copy of a current filter
    var Filter = JSON.parse(JSON.stringify(this.state.Filter));

    if (fieldValue === "") {
      delete Filter[fieldName];
    } else {
      Filter[fieldName] = fieldValue;
    }

    this.setQueryString(fieldName, fieldValue);
    this.setState({ Filter: Filter });
  },

  clearFilter: function () {
    this.clearQueryString();
    this.setState({
      Filter: {}
    });

    // Reset state of child components of FilterTable
    var formRefs = this.refs;
    Object.keys(formRefs).map(function (ref) {
      if (formRefs[ref].state && formRefs[ref].state.value) {
        formRefs[ref].state.value = "";
      }
    });
  },

  render: function () {
    return React.createElement(
      "div",
      null,
      React.createElement(
        FilterTable,
        { Module: "dicom_archive" },
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "div",
            { className: "col-md-6" },
            React.createElement(TextboxElement, {
              name: "patientID",
              label: "Patient ID",
              onUserInput: this.setFilter,
              value: this.state.Filter.patientID,
              ref: "patientID"
            })
          ),
          React.createElement(
            "div",
            { className: "col-md-6" },
            React.createElement(TextboxElement, {
              name: "patientName",
              label: "Patient Name",
              onUserInput: this.setFilter,
              value: this.state.Filter.patientName,
              ref: "patientName"
            })
          )
        ),
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "div",
            { className: "col-md-6" },
            React.createElement(SelectElement, {
              name: "sites",
              label: "Sites",
              options: this.props.Sites,
              onUserInput: this.setFilter,
              value: this.state.Filter.sites,
              ref: "sites"
            })
          ),
          React.createElement(
            "div",
            { className: "col-md-6" },
            React.createElement(SelectElement, {
              name: "gender",
              label: "Gender",
              options: this.props.Gender,
              onUserInput: this.setFilter,
              value: this.state.Filter.gender,
              ref: "gender"
            })
          )
        ),
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "div",
            { className: "col-md-6" },
            React.createElement(DateElement, {
              name: "dateOfBirth",
              label: "Date of Birth",
              onUserInput: this.setFilter,
              value: this.state.Filter.dateOfBirth,
              ref: "dateOfBirth"
            })
          ),
          React.createElement(
            "div",
            { className: "col-md-6" },
            React.createElement(DateElement, {
              name: "acquisition",
              label: "Acquisition Date",
              onUserInput: this.setFilter,
              value: this.state.Filter.acquisition,
              ref: "acquisitionDate"
            })
          )
        ),
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "div",
            { className: "col-md-6" },
            React.createElement(TextboxElement, {
              name: "archiveLocation",
              label: "Archive Location",
              onUserInput: this.setFilter,
              value: this.state.Filter.archiveLocation,
              ref: "archiveLocation"
            })
          )
        ),
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "div",
            { className: "col-md-6" },
            React.createElement(ButtonElement, {
              label: "Clear Filters",
              onUserInput: this.clearFilter
            })
          )
        )
      ),
      React.createElement(DynamicDataTable, {
        DataURL: this.props.DataURL,
        Filter: this.state.Filter,
        getFormattedCell: this.props.getFormattedCell
      })
    );
  }
});

RDicomArchive = React.createFactory(DicomArchive);