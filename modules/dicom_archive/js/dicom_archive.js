"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
var DicomArchive = function (_React$Component) {
  _inherits(DicomArchive, _React$Component);

  function DicomArchive(props) {
    _classCallCheck(this, DicomArchive);

    var _this = _possibleConstructorReturn(this, (DicomArchive.__proto__ || Object.getPrototypeOf(DicomArchive)).call(this, props));

    _this.state = {
      isLoaded: false,
      Filter: QueryString.get()
    };

    // Bind component instance to custom methods
    _this.fetchData = _this.fetchData.bind(_this);
    _this.setFilter = _this.setFilter.bind(_this);
    _this.clearFilter = _this.clearFilter.bind(_this);
    return _this;
  }

  _createClass(DicomArchive, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetchData();
    }

    /**
     * Retrive data from the provided URL and save it in state
     * Additionaly add hiddenHeaders to global loris vairable
     * for easy access by columnFormatter.
     */

  }, {
    key: "fetchData",
    value: function fetchData() {
      $.ajax(this.props.DataURL, {
        method: "GET",
        dataType: 'json',
        success: function (data) {
          loris.hiddenHeaders = data.hiddenHeaders ? data.hiddenHeaders : [];
          this.setState({
            Data: data,
            isLoaded: true
          });
        }.bind(this),
        error: function error(_error) {
          console.error(_error);
        }
      });
    }

    /**
     * Clear the Filter object, querystring and input fields
     */

  }, {
    key: "clearFilter",
    value: function clearFilter() {
      var Filter = QueryString.clear(this.props.Module);
      this.setState({ Filter: Filter });
    }

    /**
     * Sets Filter object and querystring to reflect values of input fields
     *
     * @param {string} fieldName - the name of the form element
     * @param {string} fieldValue - the value of the form element
     */

  }, {
    key: "setFilter",
    value: function setFilter(fieldName, fieldValue) {
      // Special treatment for site, to explicitly set it as an integer value
      if (fieldName === "site") {
        var number = Number.parseInt(fieldValue, 10);
        if (Number.isInteger(number)) {
          fieldValue = number;
        }
      }

      var Filter = QueryString.set(this.state.Filter, fieldName, fieldValue);
      this.setState({ Filter: Filter });
    }
  }, {
    key: "render",
    value: function render() {
      // Waiting for async data to load
      if (!this.state.isLoaded) {
        return React.createElement(
          "button",
          { className: "btn-info has-spinner" },
          "Loading",
          React.createElement("span", {
            className: "glyphicon glyphicon-refresh glyphicon-refresh-animate" })
        );
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

      var genderList = {
        M: 'Male',
        F: 'Female',
        O: 'N/A'
      };

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
                name: patientID,
                label: "Patient ID",
                onUserInput: this.setFilter,
                value: this.state.Filter.patientID,
                ref: patientID
              })
            ),
            React.createElement(
              "div",
              { className: "col-md-6" },
              React.createElement(TextboxElement, {
                name: patientName,
                label: "Patient Name",
                onUserInput: this.setFilter,
                value: this.state.Filter.patientName,
                ref: patientName
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
                name: site,
                label: "Sites",
                options: this.state.Data.Sites,
                onUserInput: this.setFilter,
                value: this.state.Filter.site,
                ref: site
              })
            ),
            React.createElement(
              "div",
              { className: "col-md-6" },
              React.createElement(SelectElement, {
                name: gender,
                label: "Gender",
                options: genderList,
                onUserInput: this.setFilter,
                value: this.state.Filter.gender,
                ref: gender
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
                name: dateOfBirth,
                label: "Date of Birth",
                onUserInput: this.setFilter,
                value: this.state.Filter.dateOfBirth,
                ref: dateOfBirth
              })
            ),
            React.createElement(
              "div",
              { className: "col-md-6" },
              React.createElement(DateElement, {
                name: acquisition,
                label: "Acquisition Date",
                onUserInput: this.setFilter,
                value: this.state.Filter.acquisition,
                ref: acquisition
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
                name: archiveLocation,
                label: "Archive Location",
                onUserInput: this.setFilter,
                value: this.state.Filter.archiveLocation,
                ref: archiveLocation
              })
            ),
            React.createElement(
              "div",
              { className: "col-md-6" },
              React.createElement(TextboxElement, {
                name: seriesUID,
                label: "Series UID",
                onUserInput: this.setFilter,
                value: this.state.Filter.seriesuid,
                ref: seriesUID
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
        React.createElement(StaticDataTable, {
          Data: this.state.Data.Data,
          Headers: this.state.Data.Headers,
          Filter: this.state.Filter,
          getFormattedCell: formatColumn
        })
      );
    }
  }]);

  return DicomArchive;
}(React.Component);

DicomArchive.propTypes = {
  Module: React.PropTypes.string.isRequired,
  DataURL: React.PropTypes.string.isRequired
};

/**
 * Render dicom_page on page load
 */
window.onload = function () {
  var dataURL = loris.BaseURL + "/dicom_archive/?format=json";
  var dicomArchive = React.createElement(DicomArchive, {
    Module: "dicom_archive",
    DataURL: dataURL
  });

  // Create a wrapper div in which react component will be loaded
  var dicomArchiveDOM = document.createElement('div');
  dicomArchiveDOM.id = 'page-dicom-archive';

  // Append wrapper div to page content
  var rootDOM = document.getElementById("lorisworkspace");
  rootDOM.appendChild(dicomArchiveDOM);

  ReactDOM.render(dicomArchive, document.getElementById("page-dicom-archive"));
};