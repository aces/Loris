"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* exported DicomArchive */
/* global formatColumn, ReactDOM */

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
      filter: {}
    };

    // Bind component instance to custom methods
    _this.fetchData = _this.fetchData.bind(_this);
    _this.updateFilter = _this.updateFilter.bind(_this);
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
  }, {
    key: "updateFilter",
    value: function updateFilter(filter) {
      this.setState({ filter: filter });
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
          FilterForm,
          {
            Module: "dicom_archive",
            name: "dicom_filter",
            id: "dicom_filter",
            columns: 2,
            onUpdate: this.updateFilter,
            filter: this.state.filter
          },
          React.createElement(TextboxElement, {
            name: patientID,
            label: "Patient ID",
            ref: patientID
          }),
          React.createElement(TextboxElement, {
            name: patientName,
            label: "Patient Name",
            ref: patientName
          }),
          React.createElement(SelectElement, {
            name: site,
            label: "Sites",
            options: this.state.Data.Sites,
            ref: site
          }),
          React.createElement(SelectElement, {
            name: gender,
            label: "Gender",
            options: genderList,
            ref: gender
          }),
          React.createElement(DateElement, {
            name: dateOfBirth,
            label: "Date of Birth",
            ref: dateOfBirth
          }),
          React.createElement(DateElement, {
            name: acquisition,
            label: "Acquisition Date",
            ref: acquisition
          }),
          React.createElement(TextboxElement, {
            name: archiveLocation,
            label: "Archive Location",
            ref: archiveLocation
          }),
          React.createElement(TextboxElement, {
            name: seriesUID,
            label: "Series UID",
            ref: seriesUID
          }),
          React.createElement(ButtonElement, {
            label: "Clear Filters",
            type: "reset"
          })
        ),
        React.createElement(StaticDataTable, {
          Data: this.state.Data.Data,
          Headers: this.state.Data.Headers,
          Filter: this.state.filter,
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