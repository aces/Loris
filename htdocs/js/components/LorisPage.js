"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global LorisPage */
/* global QueryString  */

var propTypes = {};
var defaultProps = {};

/**
 * Base class for all Loris pages rendered in react.
 *
 * LorisPage provides basic page functionality, such as loading data from server.
 *
 * @author Alex Ilea <ailea.mcin@gmail.com>
 * @version 1.0.0
 * @since 2016/11/01
 *
 */

var LorisPage = function (_React$Component) {
  _inherits(LorisPage, _React$Component);

  /**
   * Default React lifecycle method.
   *
   * Initializes default properties and state, and bound class function to the
   * component scope.
   *
   * @param {object} props - component properties
   */
  function LorisPage(props) {
    _classCallCheck(this, LorisPage);

    var _this = _possibleConstructorReturn(this, (LorisPage.__proto__ || Object.getPrototypeOf(LorisPage)).call(this, props));

    _this.state = {
      isLoaded: false,
      Filter: {}
    };

    // Bind component instance to custom methods
    _this.clearFilter = _this.clearFilter.bind(_this);
    _this.loadData = _this.loadData.bind(_this);
    _this.setFilter = _this.setFilter.bind(_this);
    _this.showSpinner = _this.showSpinner.bind(_this);
    return _this;
  }

  /**
   * Default React lifecycle method.
   *
   * Populates input fields from query string and loads data from the server.
   */


  _createClass(LorisPage, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var formRefs = this.refs;

      // Populate input fields from query string
      var queryString = new QueryString();
      var queryStringObj = queryString.get();
      Object.keys(queryStringObj).map(function (key) {
        if (queryStringObj[key] && formRefs[key] && formRefs[key].state) {
          formRefs[key].state.value = queryStringObj[key];
        }
      });

      this.QueryString = queryString;

      this.setState({
        Filter: queryStringObj,
        QueryString: queryString
      });
    }

    /**
     * Clear filter object with values from querystring
     */

  }, {
    key: "clearFilter",
    value: function clearFilter() {
      var queryString = this.state.QueryString;
      var formRefs = this.refs;

      // Clear query string
      queryString.clear(this.props.Module);

      // Reset state of child components of FilterTable
      Object.keys(formRefs).map(function (ref) {
        if (formRefs[ref].state && formRefs[ref].state.value) {
          formRefs[ref].state.value = "";
        }
      });

      // Clear filter
      this.setState({ Filter: {} });
    }

    /**
     * Loads the data from specified URL.
     *
     * By default, sets Data, FilterFrom and isLoaded state.
     * Success and error functions can be overriden to customize behaviour.
     *
     * @param {string} url - request URL
     * @param {function} success - callback function executed if request was succesful
     * @param {function} error - callback function executed if request failed
     */

  }, {
    key: "loadData",
    value: function loadData(url, success, error) {
      var successFn = success ? success : function (data) {
        this.setState({
          Data: data,
          FilterForm: data.FilterForm,
          isLoaded: true
        });
      };
      var errorFn = error ? error : function (error) {
        console.error(error);
        // Output custom error message
        var responseText = error.responseText ? error.responseText : "An error occurred when loading the form!";
        this.setState({ error: responseText });
      };

      $.ajax(url, {
        method: "GET",
        dataType: 'json',
        success: successFn.bind(this),
        error: errorFn.bind(this)
      });
    }

    /**
     * Set filter object with values from querystring
     *
     * @param {string} fieldName - querystring key
     * @param {(number|string)} fieldValue - querystring value
     */

  }, {
    key: "setFilter",
    value: function setFilter(fieldName, fieldValue) {
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

      // Set/clear query string value
      if (fieldValue === "") {
        delete Filter[fieldName];
      } else {
        Filter[fieldName] = fieldValue;
      }

      this.setState({ Filter: Filter });
    }

    /**
     * Loading spinner.
     * Displayed while waiting for response on JSON request.
     *
     * @return {HTMLElement} - html of the spinner
     */

  }, {
    key: "showSpinner",
    value: function showSpinner() {
      return React.createElement(
        "button",
        { className: "btn-info has-spinner" },
        "Loading",
        React.createElement("span", {
          className: "glyphicon glyphicon-refresh glyphicon-refresh-animate" })
      );
    }
  }]);

  return LorisPage;
}(React.Component);

LorisPage.propTypes = propTypes;
LorisPage.defaultProps = defaultProps;