'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* exported DicomArchive */
/* global LorisPage, formatColumn */

var defaultProps = {
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

var DicomArchive = function (_LorisPage) {
  _inherits(DicomArchive, _LorisPage);

  function DicomArchive(props) {
    _classCallCheck(this, DicomArchive);

    var _this = _possibleConstructorReturn(this, (DicomArchive.__proto__ || Object.getPrototypeOf(DicomArchive)).call(this, props));

    _this.state = {
      Sites: {}
    };

    // Bind component instance to custom methods
    _this.setFilter = _this.setFilter.bind(_this);
    _this.loadData = _this.loadData.bind(_this);
    _this.showSpinner = _this.showSpinner.bind(_this);
    return _this;
  }

  _createClass(DicomArchive, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      _get(DicomArchive.prototype.__proto__ || Object.getPrototypeOf(DicomArchive.prototype), 'componentDidMount', this).call(this);
      if (this.props.DataURL) {
        this.loadData(this.props.DataURL, null, null);
      }
    }
  }, {
    key: 'setFilter',
    value: function setFilter(fieldName, fieldValue) {
      // Special treatment for site, to explicitly set it as an integer value
      if (fieldName === "site") {
        var number = Number.parseInt(fieldValue, 10);
        if (Number.isInteger(number)) {
          fieldValue = number;
        }
      }
      _get(DicomArchive.prototype.__proto__ || Object.getPrototypeOf(DicomArchive.prototype), 'setFilter', this).call(this, fieldName, fieldValue);
    }
  }, {
    key: 'render',
    value: function render() {
      // Waiting for async data to load
      if (!this.state.isLoaded) {
        return _get(DicomArchive.prototype.__proto__ || Object.getPrototypeOf(DicomArchive.prototype), 'showSpinner', this).call(this);
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

      return React.createElement(
        'div',
        null,
        React.createElement(
          FilterTable,
          { Module: 'dicom_archive' },
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'div',
              { className: 'col-md-6' },
              React.createElement(TextboxElement, {
                name: patientID,
                label: 'Patient ID',
                onUserInput: this.setFilter,
                value: this.state.Filter.patientID,
                ref: patientID
              })
            ),
            React.createElement(
              'div',
              { className: 'col-md-6' },
              React.createElement(TextboxElement, {
                name: patientName,
                label: 'Patient Name',
                onUserInput: this.setFilter,
                value: this.state.Filter.patientName,
                ref: patientName
              })
            )
          ),
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'div',
              { className: 'col-md-6' },
              React.createElement(SelectElement, {
                name: site,
                label: 'Sites',
                options: this.state.Data.Sites,
                onUserInput: this.setFilter,
                value: this.state.Filter.site,
                ref: site
              })
            ),
            React.createElement(
              'div',
              { className: 'col-md-6' },
              React.createElement(SelectElement, {
                name: gender,
                label: 'Gender',
                options: this.props.Gender,
                onUserInput: this.setFilter,
                value: this.state.Filter.gender,
                ref: gender
              })
            )
          ),
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'div',
              { className: 'col-md-6' },
              React.createElement(DateElement, {
                name: dateOfBirth,
                label: 'Date of Birth',
                onUserInput: this.setFilter,
                value: this.state.Filter.dateOfBirth,
                ref: dateOfBirth
              })
            ),
            React.createElement(
              'div',
              { className: 'col-md-6' },
              React.createElement(DateElement, {
                name: acquisition,
                label: 'Acquisition Date',
                onUserInput: this.setFilter,
                value: this.state.Filter.acquisition,
                ref: acquisition
              })
            )
          ),
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'div',
              { className: 'col-md-6' },
              React.createElement(TextboxElement, {
                name: archiveLocation,
                label: 'Archive Location',
                onUserInput: this.setFilter,
                value: this.state.Filter.archiveLocation,
                ref: archiveLocation
              })
            ),
            React.createElement(
              'div',
              { className: 'col-md-6' },
              React.createElement(TextboxElement, {
                name: seriesUID,
                label: 'Series UID',
                onUserInput: this.setFilter,
                value: this.state.Filter.seriesuid,
                ref: seriesUID
              })
            )
          ),
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'div',
              { className: 'col-md-6' },
              React.createElement(ButtonElement, {
                label: 'Clear Filters',
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
  }]);

  return DicomArchive;
}(LorisPage);

DicomArchive.defaultProps = defaultProps;

window.onload = function () {
  var dataURL = loris.BaseURL + "/dicom_archive/?format=json";
  var dicomArchive = React.createElement(DicomArchive, {
    Module: 'dicom_archive',
    DataURL: dataURL,
    getFormattedCell: formatColumn
  });
  React.render(dicomArchive, document.getElementById("page-dicom-archive"));
};