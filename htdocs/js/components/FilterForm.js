"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * This file contains React component for FilterForm
 *
 * @author Loris Team
 * @version 1.1.0
 *
 */

/**
 * FilterForm component.
 * A wrapper for form elements inside a selection filter.
 *
 * Adds necessary filter callbacks to all children and passes them to FormElement
 * for proper rendering.
 *
 * Keeps track of filter object and sends it to parent on every update.
 */
var FilterForm = function (_React$Component) {
  _inherits(FilterForm, _React$Component);

  function FilterForm(props) {
    _classCallCheck(this, FilterForm);

    // Bind component instance to custom methods
    var _this = _possibleConstructorReturn(this, (FilterForm.__proto__ || Object.getPrototypeOf(FilterForm)).call(this, props));

    _this.clearFilter = _this.clearFilter.bind(_this);
    _this.getFormElements = _this.getFormElements.bind(_this);
    _this.setFilter = _this.setFilter.bind(_this);
    _this.onElementUpdate = _this.onElementUpdate.bind(_this);

    // Keeps track of querystring values
    // Saved as class variable instead of keeping in state
    _this.queryString = QueryString.get();
    return _this;
  }

  _createClass(FilterForm, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var filter = {};
      var queryString = this.queryString;

      // Initiaze filter using querystring value
      Object.keys(queryString).forEach(function (key) {
        filter[key] = {
          value: queryString[key],
          exactMatch: false
        };
      });

      // Update parent component
      this.props.onUpdate(filter);
    }

    /**
     * Clear the filter object, querystring and input fields
     */

  }, {
    key: "clearFilter",
    value: function clearFilter() {
      this.queryString = QueryString.clear(this.props.Module);
      this.props.onUpdate({});
    }

    /**
     * Itterates through FilterForm children, sets necessary callback functions
     * and initializes filterTable
     *
     * @return {Array} formElements - array of children with necessary props
     */

  }, {
    key: "getFormElements",
    value: function getFormElements() {
      var formElements = [];
      React.Children.forEach(this.props.children, function (child, key) {
        // If child is a React component (i.e not a simple DOM element)
        if (React.isValidElement(child) && typeof child.type === "function" && child.props.onUserInput) {
          var callbackFunc = child.props.onUserInput;
          var callbackName = callbackFunc.name;
          var elementName = child.type.displayName;
          var filterValue = this.queryString[child.props.name];
          // If callback function was not set, set it to onElementUpdate() for form elements
          // and to clearFilter() for <ButtonElement type='reset'/>.
          if (callbackName === "onUserInput") {
            if (elementName === "ButtonElement" && child.props.type === "reset") {
              callbackFunc = this.clearFilter;
            } else {
              callbackFunc = this.onElementUpdate.bind(null, elementName);
            }
          }
          // Pass onUserInput and value props to all children
          formElements.push(React.cloneElement(child, {
            onUserInput: callbackFunc,
            value: filterValue ? filterValue : '',
            key: key
          }));
          // Initialize filter for StaticDataTable
          this.setFilter(elementName, child.props.name, filterValue);
        } else {
          formElements.push(React.cloneElement(child, { key: key }));
        }
      }.bind(this));

      return formElements;
    }

    /**
     * Appends entry to filter object or deletes it if value is
     * empty.
     *
     * Sets exactMatch to true for all SelectElements (i.e dropdowns)
     * in order to force StaticDataTable to do exact comparaison
     *
     * @param {string} type - form element type (i.e component name)
     * @param {string} key - the name of the form element
     * @param {string} value - the value of the form element
     *
     * @return {{}} filter - filterData
     */

  }, {
    key: "setFilter",
    value: function setFilter(type, key, value) {
      var filter = {};
      if (this.props.filter) {
        filter = JSON.parse(JSON.stringify(this.props.filter));
      }

      if (key && value) {
        filter[key] = {};
        filter[key].value = value;
        filter[key].exactMatch = type === "SelectElement";
      } else if (filter && key && value === '') {
        delete filter[key];
      }

      return filter;
    }

    /**
     * Sets filter object and querystring to reflect values of input fields
     *
     * @param {string} type - form element type (i.e component name)
     * @param {string} fieldName - the name of the form element
     * @param {string} fieldValue - the value of the form element
     */

  }, {
    key: "onElementUpdate",
    value: function onElementUpdate(type, fieldName, fieldValue) {
      // Make sure both key/value are string before sending them to querystring
      if (typeof fieldName !== "string" || typeof fieldValue !== "string") {
        return;
      }

      // Update query string
      this.queryString = QueryString.set(this.queryString, fieldName, fieldValue);

      // Update filter and get new filter object
      var filter = this.setFilter(type, fieldName, fieldValue);
      this.props.onUpdate(filter);
    }
  }, {
    key: "render",
    value: function render() {
      // Get formatted children
      var formElements = this.getFormElements();
      return React.createElement(
        Panel,
        { id: "selection-filter", title: "Selection Filter" },
        React.createElement(
          FormElement,
          this.props,
          formElements
        )
      );
    }
  }]);

  return FilterForm;
}(React.Component);

FilterForm.defaultProps = {
  id: 'selection-filter',
  filterClass: "col-md-9",
  onUpdate: function onUpdate() {
    console.warn('onUpdate() callback is not set!');
  }
};
FilterForm.propTypes = {
  Module: React.PropTypes.string.isRequired,
  filter: React.PropTypes.object.isRequired
};