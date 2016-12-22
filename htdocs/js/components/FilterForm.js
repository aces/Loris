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

    var _this = _possibleConstructorReturn(this, (FilterForm.__proto__ || Object.getPrototypeOf(FilterForm)).call(this, props));

    _this.state = {
      collapsed: false,
      filter: QueryString.get()
    };

    // Bind component instance to custom methods
    _this.clearFilter = _this.clearFilter.bind(_this);
    _this.getFormElements = _this.getFormElements.bind(_this);
    _this.setTableFilter = _this.setTableFilter.bind(_this);
    _this.setFilter = _this.setFilter.bind(_this);
    _this.toggleCollapsed = _this.toggleCollapsed.bind(_this);

    // Used to store filter format accepted by StaticDataTable
    // Saved as class variable instead of keeping in state
    _this.tableFilter = {};
    return _this;
  }

  _createClass(FilterForm, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Pass initial filter values to parent component
      this.props.onUpdate(this.tableFilter);
    }

    /**
     * Clear the filter object, querystring and input fields
     */

  }, {
    key: "clearFilter",
    value: function clearFilter() {
      var filter = QueryString.clear(this.props.Module);
      this.props.onUpdate(filter);
      this.setState({ filter: filter });
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
        if (React.isValidElement(child) && typeof child.type === "function") {
          var callbackFunc = child.props.onUserInput;
          var callbackName = callbackFunc.name;
          var elementName = child.type.displayName;
          var filterValue = this.state.filter[child.ref];
          // If callback function was not set, set it to setFilter() for form elements
          // and to clearFilter() for <ButtonElement type='reset'/>.
          if (callbackName === "onUserInput") {
            if (elementName === "ButtonElement" && child.props.type === "reset") {
              callbackFunc = this.clearFilter;
            } else {
              callbackFunc = this.setFilter.bind(null, elementName);
            }
          }
          // Pass onUserInput and value props to all children
          formElements.push(React.cloneElement(child, {
            onUserInput: callbackFunc,
            value: filterValue ? filterValue : '',
            key: key
          }));
          // Initialize filter for StaticDataTable
          this.setTableFilter(elementName, child.ref, filterValue);
        } else {
          formElements.push(React.cloneElement(child));
        }
      }.bind(this));

      return formElements;
    }

    /**
     * Appends entry to tableFilter object or deletes it if value is
     * empty.
     *
     * Sets exactMatch to true for all SelectElements (i.e dropdowns)
     * in order to force StaticDataTable to do exact comparaison
     *
     * @param {string} type - form element type (i.e component name)
     * @param {string} key - the name of the form element
     * @param {string} value - the value of the form element
     *
     * @return {{}} tableFilter - filterData
     */

  }, {
    key: "setTableFilter",
    value: function setTableFilter(type, key, value) {
      // Deep copy of tableFilter object
      var tableFilter = JSON.parse(JSON.stringify(this.tableFilter));

      if (key && value) {
        tableFilter[key] = {};
        tableFilter[key].value = value;
        tableFilter[key].exactMatch = type === "SelectElement";
      } else if (key && value === '') {
        delete tableFilter[key];
      }

      // Update class variable
      this.tableFilter = tableFilter;

      return tableFilter;
    }

    /**
     * Sets filter object and querystring to reflect values of input fields
     *
     * @param {string} type - form element type (i.e component name)
     * @param {string} fieldName - the name of the form element
     * @param {string} fieldValue - the value of the form element
     */

  }, {
    key: "setFilter",
    value: function setFilter(type, fieldName, fieldValue) {
      // Make sure both key/value are string before sending them to querystring
      if (typeof fieldName !== "string" || typeof fieldValue !== "string") {
        return;
      }

      // Update query string and get new filter object
      var filter = QueryString.set(this.state.filter, fieldName, fieldValue);

      // Update tableFilter and get new tableFilter object
      var tableFilter = this.setTableFilter(type, fieldName, fieldValue);

      this.props.onUpdate(tableFilter);
      this.setState({ filter: filter });
    }
  }, {
    key: "toggleCollapsed",
    value: function toggleCollapsed() {
      this.setState({ collapsed: !this.state.collapsed });
    }
  }, {
    key: "render",
    value: function render() {
      // Selection filter open by default
      var glyphClass = "glyphicon pull-right glyphicon-chevron-up";
      var panelClass = "panel-collapse collapse in";

      // Change arrow direction when closed
      if (this.state.collapsed) {
        glyphClass = "glyphicon pull-right glyphicon-chevron-down";
      }

      // Get formatted children
      var formElements = this.getFormElements();

      return React.createElement(
        "div",
        { className: "panel panel-primary" },
        React.createElement(
          "div",
          { className: "panel-heading",
            onClick: this.toggleCollapsed,
            "data-toggle": "collapse",
            "data-target": "#selection-filter"
          },
          "Selection Filter",
          React.createElement("span", { className: glyphClass })
        ),
        React.createElement(
          "div",
          { id: "selection-filter", className: panelClass, role: "tabpanel" },
          React.createElement(
            "div",
            { className: "panel-body" },
            React.createElement(
              "div",
              { className: "row" },
              React.createElement(
                "div",
                { className: this.props.filterClass },
                React.createElement(
                  FormElement,
                  {
                    name: this.props.name,
                    columns: this.props.columns
                  },
                  formElements
                )
              )
            )
          )
        )
      );
    }
  }]);

  return FilterForm;
}(React.Component);

FilterForm.defaultProps = {
  filterClass: "col-md-9",
  onUpdate: function onUpdate() {
    console.warn('onUpdate() callback is not set!');
  }
};
FilterForm.propTypes = {
  Module: React.PropTypes.string.isRequired
};