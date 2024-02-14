/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./jsx/Form.js":
/*!*********************!*\
  !*** ./jsx/Form.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ButtonElement": () => (/* binding */ ButtonElement),
/* harmony export */   "CTA": () => (/* binding */ CTA),
/* harmony export */   "CheckboxElement": () => (/* binding */ CheckboxElement),
/* harmony export */   "DateElement": () => (/* binding */ DateElement),
/* harmony export */   "DateTimeElement": () => (/* binding */ DateTimeElement),
/* harmony export */   "EmailElement": () => (/* binding */ EmailElement),
/* harmony export */   "FieldsetElement": () => (/* binding */ FieldsetElement),
/* harmony export */   "FileElement": () => (/* binding */ FileElement),
/* harmony export */   "FormElement": () => (/* binding */ FormElement),
/* harmony export */   "HeaderElement": () => (/* binding */ HeaderElement),
/* harmony export */   "LinkElement": () => (/* binding */ LinkElement),
/* harmony export */   "LorisElement": () => (/* binding */ LorisElement),
/* harmony export */   "NumericElement": () => (/* binding */ NumericElement),
/* harmony export */   "PasswordElement": () => (/* binding */ PasswordElement),
/* harmony export */   "RadioElement": () => (/* binding */ RadioElement),
/* harmony export */   "SearchableDropdown": () => (/* binding */ SearchableDropdown),
/* harmony export */   "SelectElement": () => (/* binding */ SelectElement),
/* harmony export */   "SliderElement": () => (/* binding */ SliderElement),
/* harmony export */   "StaticElement": () => (/* binding */ StaticElement),
/* harmony export */   "TagsElement": () => (/* binding */ TagsElement),
/* harmony export */   "TextareaElement": () => (/* binding */ TextareaElement),
/* harmony export */   "TextboxElement": () => (/* binding */ TextboxElement),
/* harmony export */   "TimeElement": () => (/* binding */ TimeElement),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_9__);








function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * This file contains React components for Loris form elements.
 *
 * @author Loris Team
 * @version 1.0.0
 */




/**
 * Form Component.
 * React wrapper for <form> element that accepts children react components
 *
 * The form elements can be passed in two ways:
 * 1. A `this.props.formElements` JSON object
 * 2. Form components nested directly inside <FormElement></FormElement>
 *
 * Note that if both are passed `this.props.formElements` is displayed first.
 *
 */
var FormElement = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(FormElement, _Component);
  var _super = _createSuper(FormElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function FormElement(props) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, FormElement);
    _this = _super.call(this, props);
    _this.getFormElements = _this.getFormElements.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this));
    _this.handleSubmit = _this.handleSubmit.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this));
    return _this;
  }

  /**
   * Get form elements
   *
   * @return {JSX[]} - An array of element React markup
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(FormElement, [{
    key: "getFormElements",
    value: function getFormElements() {
      var formElementsHTML = [];
      var columns = this.props.columns;
      var maxColumnSize = 12;
      var colSize = Math.floor(maxColumnSize / columns);
      var colClass = 'col-xs-12 col-sm-' + colSize + ' col-md-' + colSize;

      // Render elements from JSON
      var filter = this.props.formElements;
      Object.keys(filter).forEach(function (objKey, index) {
        var userInput = this.props.onUserInput ? this.props.onUserInput : filter[objKey].onUserInput;
        var value = filter[objKey].value ? filter[objKey].value : '';
        formElementsHTML.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
          key: 'el_' + index,
          className: colClass
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement(LorisElement, {
          element: filter[objKey],
          onUserInput: userInput,
          value: value
        })));
      }.bind(this));

      // Render elements from React
      react__WEBPACK_IMPORTED_MODULE_8___default().Children.forEach(this.props.children, function (child, key) {
        // If child is plain HTML, insert it as full size.
        // Useful for inserting <hr> to split form sections
        var elementClass = 'col-xs-12 col-sm-12 col-md-12';

        // If child is form element use appropriate size
        if ( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().isValidElement(child) && typeof child.type === 'function') {
          elementClass = colClass;
        }
        formElementsHTML.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
          key: 'el_child_' + key,
          className: elementClass
        }, child));
      });
      return formElementsHTML;
    }

    /**
     * Execute onSubmit
     *
     * @param {object} e - Event
     */
  }, {
    key: "handleSubmit",
    value: function handleSubmit(e) {
      // Override default submit if property is set
      if (this.props.onSubmit) {
        e.preventDefault();
        this.props.onSubmit(e);
      }
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var encType = this.props.fileUpload ? 'multipart/form-data' : null;

      // Generate form elements
      var formElements = this.getFormElements();

      // Flexbox is set to ensure that columns of different heights
      // are displayed proportionally on the screen
      var rowStyles = {
        display: 'flex',
        flexWrap: 'wrap'
      };
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("form", {
        name: this.props.name,
        id: this.props.id,
        className: this.props["class"],
        method: this.props.method,
        action: this.props.action,
        encType: encType,
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: "row",
        style: rowStyles
      }, formElements));
    }
  }]);
  return FormElement;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);
FormElement.propTypes = {
  name: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  id: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  method: prop_types__WEBPACK_IMPORTED_MODULE_9___default().oneOf(['POST', 'GET']),
  action: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  "class": (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  columns: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().number),
  formElements: prop_types__WEBPACK_IMPORTED_MODULE_9___default().shape({
    elementName: prop_types__WEBPACK_IMPORTED_MODULE_9___default().shape({
      name: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
      type: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string)
    })
  }),
  onSubmit: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func),
  onUserInput: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func),
  children: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().node),
  fileUpload: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool)
};
FormElement.defaultProps = {
  name: null,
  id: null,
  method: 'POST',
  action: undefined,
  "class": 'form-horizontal',
  columns: 1,
  fileUpload: false,
  formElements: {},
  onSubmit: function onSubmit() {
    console.warn('onSubmit() callback is not set!');
  }
};

/**
 * FieldsetElement Component.
 * React wrapper for <fieldset> element that is nested inside <FormElement></FormElement>,
 * and accepts child react components. A fieldset groups related elements in a form.
 *
 * The form elements can be passed by nesting Form components directly inside <FieldsetElement></FieldsetElement>.
 *
 */
var FieldsetElement = /*#__PURE__*/function (_Component2) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(FieldsetElement, _Component2);
  var _super2 = _createSuper(FieldsetElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function FieldsetElement(props) {
    var _this2;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, FieldsetElement);
    _this2 = _super2.call(this, props);
    _this2.getFormElements = _this2.getFormElements.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this2));
    return _this2;
  }

  /**
   * Get form elements
   *
   * @return {JSX[]} - An array of element React markup
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(FieldsetElement, [{
    key: "getFormElements",
    value: function getFormElements() {
      var formElementsHTML = [];
      var columns = this.props.columns;
      var maxColumnSize = 12;
      var colSize = Math.floor(maxColumnSize / columns);
      var colClass = 'col-xs-12 col-sm-' + colSize + ' col-md-' + colSize;

      // Render elements from React
      react__WEBPACK_IMPORTED_MODULE_8___default().Children.forEach(this.props.children, function (child, key) {
        // If child is plain HTML, insert it as full size.
        // Useful for inserting <hr> to split form sections
        var elementClass = 'col-xs-12 col-sm-12 col-md-12';

        // If child is form element use appropriate size
        if ( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().isValidElement(child) && typeof child.type === 'function') {
          elementClass = colClass;
        }
        formElementsHTML.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
          key: 'el_child_' + key,
          className: elementClass
        }, child));
      });
      return formElementsHTML;
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      // Generate form elements
      var formElements = this.getFormElements();
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("fieldset", {
        name: this.props.name
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("legend", null, this.props.legend), formElements);
    }
  }]);
  return FieldsetElement;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);
FieldsetElement.propTypes = {
  columns: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().number),
  name: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  legend: prop_types__WEBPACK_IMPORTED_MODULE_9___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_9___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_9___default().node)]),
  children: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().node)
};
FieldsetElement.defaultProps = {
  columns: 1,
  legend: 'Selection Filter'
};

/**
 * Search Component
 * React wrapper for a searchable dropdown
 */
var SearchableDropdown = /*#__PURE__*/function (_Component3) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(SearchableDropdown, _Component3);
  var _super3 = _createSuper(SearchableDropdown);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function SearchableDropdown(props) {
    var _this3;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, SearchableDropdown);
    _this3 = _super3.call(this, props);
    _this3.state = {
      currentInput: ''
    };
    _this3.getKeyFromValue = _this3.getKeyFromValue.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this3));
    _this3.handleChange = _this3.handleChange.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this3));
    _this3.handleBlur = _this3.handleBlur.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this3));
    return _this3;
  }

  /**
   * Get key from value
   *
   * @param {string} value
   * @return {string}
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(SearchableDropdown, [{
    key: "getKeyFromValue",
    value: function getKeyFromValue(value) {
      var options = this.props.options;
      return Object.keys(options).find(function (o) {
        return options[o] === value;
      });
    }

    /**
     * Handle change
     *
     * @param {object} e - Event
     */
  }, {
    key: "handleChange",
    value: function handleChange(e) {
      var value = this.getKeyFromValue(e.target.value);
      // if not in strict mode and key value is undefined (i.e., not in options prop)
      // set value equal to e.target.value
      if (!this.props.strictSearch && value === undefined) {
        value = e.target.value;
      }
      this.setState({
        currentInput: e.target.value
      });
      this.props.onUserInput(this.props.name, value);
    }

    /**
     * Handle blur
     *
     * @param {object} e - Event
     */
  }, {
    key: "handleBlur",
    value: function handleBlur(e) {
      // null out entry if not present in options in strict mode
      if (this.props.strictSearch) {
        var value = e.target.value;
        var options = this.props.options;
        if (Object.values(options).indexOf(value) === -1) {
          // empty string out both the hidden value as well as the input text
          this.setState({
            currentInput: ''
          });
          this.props.onUserInput(this.props.name, '');
        }
      }
    }

    /**
     * Called by React when the component is updated.
     *
     * @param {object} prevProps - Previous React Component properties
     */
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      // need to clear out currentInput for when props.value gets wiped
      // if the previous value prop contained data and the current one doesn't
      // clear currentInput
      if (prevProps.value && !this.props.value) {
        this.setState({
          currentInput: ''
        });
      }
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var required = this.props.required ? 'required' : null;
      var disabled = this.props.disabled ? 'disabled' : null;
      var sortByValue = this.props.sortByValue;
      var options = this.props.options;
      var strictMessage = 'Entry must be included in provided list of options.';
      var errorMessage = null;
      var requiredHTML = null;
      var elementClass = 'row form-group';

      // Add required asterix
      if (required) {
        requiredHTML = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", {
          className: "text-danger"
        }, "*");
      }

      // Add error message
      if (this.props.errorMessage) {
        errorMessage = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", null, this.props.errorMessage);
        elementClass = 'row form-group has-error';
      } else if (this.props.required && this.props.value === '') {
        var msg = 'This field is required!';
        msg += this.props.strictSearch ? ' ' + strictMessage : '';
        errorMessage = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", null, msg);
        elementClass = 'row form-group has-error';
      } else if (this.props.strictSearch && this.props.value === '') {
        errorMessage = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", null, strictMessage);
        elementClass = 'row form-group has-error';
      }

      // determine value to place into text input
      var value = '';
      // use value in options if valid
      if (this.props.value !== undefined && Object.keys(options).indexOf(this.props.value) > -1) {
        value = options[this.props.value];
        // else, use input text value
      } else if (this.state.currentInput) {
        value = this.state.currentInput;
      }
      var newOptions = {};
      var optionList = [];
      if (sortByValue) {
        for (var key in options) {
          if (options.hasOwnProperty(key)) {
            newOptions[options[key]] = key;
          }
        }
        optionList = Object.keys(newOptions).sort().map(function (option) {
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("option", {
            value: option,
            key: newOptions[option]
          });
        });
      } else {
        optionList = Object.keys(options).map(function (option) {
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("option", {
            value: options[option],
            key: option
          });
        });
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: elementClass
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("label", {
        className: "col-sm-3 control-label",
        htmlFor: this.props.label
      }, this.props.label, requiredHTML), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: "col-sm-9"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("input", {
        type: "text",
        name: this.props.name + '_input',
        value: value,
        id: this.props.id,
        list: this.props.name + '_list',
        className: "form-control",
        disabled: disabled,
        placeholder: this.props.placeHolder,
        onChange: this.handleChange,
        onBlur: this.handleBlur,
        required: required
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("datalist", {
        id: this.props.name + '_list'
      }, optionList), errorMessage));
    }
  }]);
  return SearchableDropdown;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);
SearchableDropdown.propTypes = {
  name: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  options: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().object.isRequired),
  id: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  // strictSearch, if set to true, will require that only options
  // provided in the options prop can be submitted
  strictSearch: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  label: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  value: prop_types__WEBPACK_IMPORTED_MODULE_9___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_9___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_9___default().array)]),
  "class": (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  disabled: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  required: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  errorMessage: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  placeHolder: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  onUserInput: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func),
  sortByValue: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool)
};
SearchableDropdown.defaultProps = {
  name: '',
  options: {},
  strictSearch: true,
  label: '',
  value: undefined,
  id: null,
  "class": '',
  disabled: false,
  required: false,
  sortByValue: true,
  errorMessage: '',
  placeHolder: '',
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  }
};

/**
 * Select Component
 * React wrapper for a simple or 'multiple' <select> element.
 */
var SelectElement = /*#__PURE__*/function (_Component4) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(SelectElement, _Component4);
  var _super4 = _createSuper(SelectElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function SelectElement(props) {
    var _this4;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, SelectElement);
    _this4 = _super4.call(this, props);
    _this4.handleChange = _this4.handleChange.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this4));
    return _this4;
  }

  /**
   * Call onUserInput on component rendered to select only option
   * if autoSelect prop is set to true
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(SelectElement, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var optionsArray = Object.keys(this.props.options);
      if (this.props.autoSelect && optionsArray.length === 1) {
        this.props.onUserInput(this.props.name, optionsArray[0]);
      }
    }

    /**
     * On component update, if number of options dynamically
     * changes to 1, call onUserInput to select only option
     * if autoSelect prop is set to true
     *
     * @param {object} prevProps - component props before component update
     */
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var options = Object.keys(this.props.options);
      var prevOptions = Object.keys(prevProps.options);
      if (options.length !== prevOptions.length || !options.every(function (v, i) {
        return v === prevOptions[i];
      })) {
        if (this.props.autoSelect && options.length === 1) {
          this.props.onUserInput(this.props.name, options[0]);
        }
      }
    }

    /**
     * Handle change
     *
     * @param {object} e - Event
     */
  }, {
    key: "handleChange",
    value: function handleChange(e) {
      var value = null;
      var options = e.target.options;
      var numOfOptions = options.length;

      // Multiple values
      if (this.props.multiple) {
        value = [];
        for (var i = 0, l = numOfOptions; i < l; i++) {
          if (options[i].selected) {
            value.push(options[i].value);
          }
        }
      } else {
        value = e.target.value;
      }
      this.props.onUserInput(this.props.name, value);
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var multiple = this.props.multiple ? 'multiple' : null;
      var required = this.props.required ? 'required' : null;
      var disabled = this.props.disabled ? 'disabled' : null;
      var sortByValue = this.props.sortByValue;
      var options = this.props.options;
      var disabledOptions = this.props.disabledOptions;
      var errorMessage = null;
      var emptyOptionHTML = null;
      var requiredHTML = null;
      var elementClass = this.props.noMargins ? '' : 'row form-group';

      // Add required asterisk
      if (required) {
        requiredHTML = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", {
          className: "text-danger"
        }, "*");
      }

      // Add empty option
      if (this.props.emptyOption) {
        emptyOptionHTML = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("option", null);
      }

      // Add error message
      if (this.props.hasError || this.props.required && this.props.value === '') {
        errorMessage = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", null, this.props.errorMessage);
        elementClass = elementClass + ' has-error';
      }
      var newOptions = {};
      var optionList = [];
      if (sortByValue) {
        for (var key in options) {
          if (options.hasOwnProperty(key)) {
            newOptions[options[key]] = key;
          }
        }
        optionList = Object.keys(newOptions).sort().map(function (option) {
          var isDisabled = (newOptions[option] in disabledOptions);
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("option", {
            value: newOptions[option],
            key: newOptions[option],
            disabled: isDisabled
          }, option);
        });
      } else {
        optionList = Object.keys(options).map(function (option) {
          var isDisabled = (option in disabledOptions);
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("option", {
            value: option,
            key: option,
            disabled: isDisabled
          }, options[option]);
        });
      }
      if (this.props.placeholder !== '') {
        optionList.unshift( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("option", {
          value: ''
        }, this.props.placeholder));
      }

      // Default to empty string for regular select and to empty array for 'multiple' select
      var value = this.props.value || (multiple ? [] : '');

      // Label prop needs to be provided to render label
      // (including empty label i.e. <SelectElement label='' />)
      // and retain formatting. If label prop is not provided at all, the input
      // element will take up the whole row.
      var label = null;
      var inputClass = this.props.noMargins ? '' : 'col-sm-12';
      if (this.props.label && this.props.label != '') {
        label = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("label", {
          className: "col-sm-3 control-label",
          htmlFor: this.props.label
        }, this.props.label, requiredHTML);
        inputClass = 'col-sm-9';
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: elementClass
      }, label, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: inputClass
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("select", {
        name: this.props.name,
        multiple: multiple,
        className: "form-control",
        id: this.props.id,
        value: value,
        onChange: this.handleChange,
        required: required,
        disabled: disabled
      }, emptyOptionHTML, optionList), errorMessage));
    }
  }]);
  return SelectElement;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);
SelectElement.propTypes = {
  name: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  options: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().object.isRequired),
  disabledOptions: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().object),
  label: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  value: prop_types__WEBPACK_IMPORTED_MODULE_9___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_9___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_9___default().array)]),
  id: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  multiple: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  disabled: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  required: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  emptyOption: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  autoSelect: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  hasError: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  errorMessage: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  onUserInput: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func),
  noMargins: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  placeholder: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  sortByValue: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool)
};
SelectElement.defaultProps = {
  name: '',
  options: {},
  disabledOptions: {},
  value: undefined,
  id: null,
  multiple: false,
  disabled: false,
  required: false,
  sortByValue: true,
  emptyOption: true,
  autoSelect: true,
  hasError: false,
  errorMessage: 'The field is required!',
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  },
  noMargins: false,
  placeholder: ''
};

/**
 * Tags Component
 * Allows for multiple values to be entered for a single field
 *
 * Comes in 3 flavors:
 * 1: If options are passed and useSearch = true
 *    input field is rendered as a searchable dropdown
 * 2: If only options are passed, input is rendered as
 *    a normal dropdown select
 * 3: Without options, input is a normal, free text input
 */
var TagsElement = /*#__PURE__*/function (_Component5) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(TagsElement, _Component5);
  var _super5 = _createSuper(TagsElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function TagsElement(props) {
    var _this5;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, TagsElement);
    _this5 = _super5.call(this, props);
    _this5.handleChange = _this5.handleChange.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this5));
    _this5.handleKeyPress = _this5.handleKeyPress.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this5));
    _this5.handleAdd = _this5.handleAdd.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this5));
    _this5.handleRemove = _this5.handleRemove.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this5));
    _this5.getKeyFromValue = _this5.getKeyFromValue.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this5));
    _this5.canAddItem = _this5.canAddItem.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this5));
    return _this5;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(TagsElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      // pendingValKey is the placeholder variable for temporarily storing
      // typed or selected items before adding them to the Tags
      this.props.onUserInput(this.props.pendingValKey, e.target.value);
    }

    /**
     * Handle key press
     *
     * @param {object} e - Event
     */
  }, {
    key: "handleKeyPress",
    value: function handleKeyPress(e) {
      // also add tags if enter key is hit within input field
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        this.handleAdd();
      }
    }

    /**
     * Handle add
     */
  }, {
    key: "handleAdd",
    value: function handleAdd() {
      var options = this.props.options;
      var value = this.props.value;
      // if using a datalist (search), set value to be the key in options
      if (this.props.useSearch && Object.values(options).indexOf(value) > -1) {
        value = this.getKeyFromValue(value);
      }
      if (this.canAddItem(value)) {
        // send pendingValKey as an argument in order to null out entered item
        this.props.onUserAdd(this.props.name, value, this.props.pendingValKey);
      }
    }

    /**
     * Handle remove
     *
     * @param {object} e -  Event
     */
  }, {
    key: "handleRemove",
    value: function handleRemove(e) {
      var value = e.target.getAttribute('data-item');
      this.props.onUserRemove(this.props.name, value);
    }

    /**
     * Get key from value
     *
     * @param {string} value
     * @return {string}
     */
  }, {
    key: "getKeyFromValue",
    value: function getKeyFromValue(value) {
      var options = this.props.options;
      return Object.keys(options).find(function (o) {
        return options[o] === value;
      });
    }

    /**
     * Helper function to detect
     * if item should be added to Tags
     *
     * @param {string} value
     * @return {boolean}
     */
  }, {
    key: "canAddItem",
    value: function canAddItem(value) {
      var result = true;
      // reject empty values
      if (!value) {
        result = false;
        // reject if allowDupl is false and item is already in array
      } else if (!this.props.allowDupl && this.props.items.indexOf(value) > -1) {
        result = false;
        // reject if using a strict datalist and value is not in options
      } else if (this.props.useSearch && this.props.strictSearch && Object.keys(this.props.options).indexOf(value) === -1) {
        result = false;
      }
      return result;
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var disabled = this.props.disabled ? 'disabled' : null;
      var requiredHTML = null;
      var emptyOptionHTML = null;
      var errorMessage = null;
      var elementClass = 'row form-group';
      // Add required asterix
      if (this.props.required) {
        requiredHTML = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", {
          className: "text-danger"
        }, "*");
      }

      // Add empty option
      if (this.props.emptyOption) {
        emptyOptionHTML = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("option", null);
      }
      if (this.props.errorMessage) {
        errorMessage = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", null, this.props.errorMessage);
        elementClass = 'row form-group has-error';
      }
      var input;
      var options = this.props.options;
      // if options are given and useSearch is specified
      if (Object.keys(options).length > 0 && this.props.useSearch) {
        input = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("input", {
          type: "text",
          name: this.props.name,
          id: this.props.id,
          list: this.props.id + '_list',
          className: "form-control",
          value: this.props.value || '',
          disabled: disabled,
          onChange: this.handleChange,
          onKeyPress: this.handleKeyPress
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("datalist", {
          id: this.props.id + '_list'
        }, Object.keys(options).map(function (option) {
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("option", {
            value: options[option],
            key: option
          }, options[option]);
        })));
        // if options are present but useSearch is false, use normal dropdown
      } else if (Object.keys(options).length > 0) {
        input = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("select", {
          name: this.props.name,
          className: "form-control",
          id: this.props.id,
          value: this.props.value,
          disabled: disabled,
          onChange: this.handleChange,
          onKeyPress: this.handleKeyPress
        }, emptyOptionHTML, Object.keys(options).map(function (option) {
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("option", {
            value: option,
            key: option
          }, options[option]);
        }));
        // else, use a text input by default
      } else {
        input = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("input", {
          type: "text",
          name: this.props.name,
          id: this.props.id,
          className: "form-control",
          value: this.props.value || '',
          disabled: disabled,
          onChange: this.handleChange,
          onKeyPress: this.handleKeyPress
        });
      }

      // iterate through added Tags items and render them
      // with deletion button
      var items = this.props.items.map(function (item) {
        var itmTxt;
        // in event that the passed item is a key of options,
        // render option value
        if (Object.keys(options).length > 0 && options[item] !== undefined) {
          itmTxt = options[item];
          // otherwise just render item as is
        } else {
          itmTxt = item;
        }
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("button", {
          className: "btn btn-info btn-inline",
          type: "button",
          onClick: this.handleRemove,
          "data-item": item,
          key: item
        }, itmTxt, "\xA0", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", {
          className: "glyphicon glyphicon-remove",
          "data-item": item
        }));
      }, this);
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: elementClass
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("label", {
        className: "col-sm-3 control-label",
        htmlFor: this.props.id
      }, this.props.label, requiredHTML), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: "col-sm-9"
      }, items, input, errorMessage, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("button", {
        className: "btn btn-success btn-add-tag",
        id: this.props.id + 'Add',
        type: "button",
        onClick: this.handleAdd
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", {
        className: "glyphicon glyphicon-plus"
      }), this.props.btnLabel)));
    }
  }]);
  return TagsElement;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);
TagsElement.propTypes = {
  name: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  id: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  pendingValKey: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  options: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().object),
  items: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().array),
  label: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  value: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  "class": (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  multiple: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  required: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  disabled: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  emptyOption: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  errorMessage: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  btnLabel: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  allowDupl: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  useSearch: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  strictSearch: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  onUserInput: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func),
  onUserAdd: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func),
  onUserRemove: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func)
};
TagsElement.defaultProps = {
  name: '',
  options: {},
  items: [],
  label: '',
  value: undefined,
  id: null,
  "class": '',
  required: false,
  disabled: false,
  emptyOption: true,
  hasError: false,
  allowDupl: false,
  useSearch: false,
  strictSearch: false,
  // only accept items specified in options
  errorMessage: '',
  pendingValKey: '',
  btnLabel: 'Add Tag',
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  },
  onUserAdd: function onUserAdd() {
    console.warn('onUserAdd() callback is not set');
  },
  onUserRemove: function onUserRemove() {
    console.warn('onUserRemove() callback is not set');
  }
};

/**
 * Textarea Component
 * React wrapper for a <textarea> element.
 */
var TextareaElement = /*#__PURE__*/function (_Component6) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(TextareaElement, _Component6);
  var _super6 = _createSuper(TextareaElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function TextareaElement(props) {
    var _this6;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, TextareaElement);
    _this6 = _super6.call(this, props);
    _this6.handleChange = _this6.handleChange.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this6));
    return _this6;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(TextareaElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.props.onUserInput(this.props.name, e.target.value);
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var disabled = this.props.disabled ? 'disabled' : null;
      var required = this.props.required ? 'required' : null;
      var requiredHTML = null;

      // Add required asterix
      if (required) {
        requiredHTML = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", {
          className: "text-danger"
        }, "*");
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: "row form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("label", {
        className: "col-sm-3 control-label",
        htmlFor: this.props.id
      }, this.props.label, requiredHTML), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: "col-sm-9"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("textarea", {
        cols: this.props.cols,
        rows: this.props.rows,
        className: "form-control",
        name: this.props.name,
        id: this.props.id,
        value: this.props.value || '',
        placeholder: this.props.placeholder,
        required: required,
        disabled: disabled,
        onChange: this.handleChange
      })));
    }
  }]);
  return TextareaElement;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);
TextareaElement.propTypes = {
  name: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  label: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  value: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  placeholder: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  id: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  disabled: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  required: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  rows: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().number),
  cols: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().number),
  onUserInput: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func)
};
TextareaElement.defaultProps = {
  name: '',
  label: '',
  value: '',
  placeholder: '',
  id: null,
  disabled: false,
  required: false,
  rows: 4,
  cols: 25,
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  }
};

/**
 * Textbox Component
 * React wrapper for a <input type="text"> element.
 */
var TextboxElement = /*#__PURE__*/function (_Component7) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(TextboxElement, _Component7);
  var _super7 = _createSuper(TextboxElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function TextboxElement(props) {
    var _this7;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, TextboxElement);
    _this7 = _super7.call(this, props);
    _this7.handleChange = _this7.handleChange.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this7));
    _this7.handleBlur = _this7.handleBlur.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this7));
    return _this7;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(TextboxElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.props.onUserInput(this.props.name, e.target.value, e.target.id, 'textbox');
    }

    /**
     * Handle blur
     *
     * @param {object} e - Event
     */
  }, {
    key: "handleBlur",
    value: function handleBlur(e) {
      this.props.onUserBlur(this.props.name, e.target.value);
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var disabled = this.props.disabled ? 'disabled' : null;
      var required = this.props.required ? 'required' : null;
      var errorMessage = null;
      var requiredHTML = null;
      var elementClass = 'row form-group';

      // Add required asterix
      if (required) {
        requiredHTML = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", {
          className: "text-danger"
        }, "*");
      }

      // Add error message
      if (this.props.errorMessage) {
        errorMessage = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", null, this.props.errorMessage);
        elementClass = 'row form-group has-error';
      }

      // Label prop needs to be provided to render label
      // (including empty label i.e. <TextboxElement label='' />)
      // and retain formatting. If label prop is not provided at all, the input
      // element will take up the whole row.
      var label = null;
      var inputClass = this.props["class"];
      if (this.props.label || this.props.label == '') {
        label = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("label", {
          className: "col-sm-3 control-label",
          htmlFor: this.props.id
        }, this.props.label, requiredHTML);
        inputClass = 'col-sm-9';
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: elementClass
      }, label, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: inputClass
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("input", {
        type: "text",
        className: "form-control",
        name: this.props.name,
        id: this.props.id,
        value: this.props.value || '',
        required: required,
        disabled: disabled,
        onChange: this.handleChange,
        onBlur: this.handleBlur,
        autoComplete: this.props.autoComplete,
        placeholder: this.props.placeholder
      }), errorMessage));
    }
  }]);
  return TextboxElement;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);
TextboxElement.propTypes = {
  name: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  label: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  value: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  id: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  "class": (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  placeholder: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  autoComplete: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  disabled: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  required: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  errorMessage: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  onUserInput: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func),
  onUserBlur: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func)
};
TextboxElement.defaultProps = {
  name: '',
  value: '',
  id: null,
  "class": 'col-sm-12',
  placeholder: '',
  autoComplete: null,
  disabled: false,
  required: false,
  errorMessage: '',
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  },
  onUserBlur: function onUserBlur() {}
};

/**
 * EmailElement Component
 * React wrapper for a <input type="email"> element.
 */
var EmailElement = /*#__PURE__*/function (_Component8) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(EmailElement, _Component8);
  var _super8 = _createSuper(EmailElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function EmailElement(props) {
    var _this8;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, EmailElement);
    _this8 = _super8.call(this, props);
    _this8.handleChange = _this8.handleChange.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this8));
    _this8.handleBlur = _this8.handleBlur.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this8));
    return _this8;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(EmailElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.props.onUserInput(this.props.name, e.target.value, e.target.id, 'textbox');
    }

    /**
     * Handle blur
     *
     * @param {object} e - Event
     */
  }, {
    key: "handleBlur",
    value: function handleBlur(e) {
      this.props.onUserBlur(this.props.name, e.target.value);
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var disabled = this.props.disabled ? 'disabled' : null;
      var required = this.props.required ? 'required' : null;
      var errorMessage = null;
      var requiredHTML = null;
      var elementClass = 'row form-group';

      // Add required asterix
      if (required) {
        requiredHTML = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", {
          className: "text-danger"
        }, "*");
      }

      // Add error message
      if (this.props.errorMessage) {
        errorMessage = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", null, this.props.errorMessage);
        elementClass = 'row form-group has-error';
      }

      // Label prop needs to be provided to render label
      // (including empty label i.e. <TextboxElement label='' />)
      // and retain formatting. If label prop is not provided at all, the input
      // element will take up the whole row.
      var label = null;
      var inputClass = this.props["class"];
      if (this.props.label || this.props.label == '') {
        label = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("label", {
          className: "col-sm-3 control-label",
          htmlFor: this.props.id
        }, this.props.label, requiredHTML);
        inputClass = 'col-sm-9';
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: elementClass
      }, label, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: inputClass
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("input", {
        type: "email",
        title: "Please provide a valid email address!",
        className: "form-control",
        name: this.props.name,
        id: this.props.id,
        value: this.props.value || '',
        required: required,
        disabled: disabled,
        onChange: this.handleChange,
        onBlur: this.handleBlur,
        autoComplete: this.props.autoComplete,
        placeholder: this.props.placeholder
      }), errorMessage));
    }
  }]);
  return EmailElement;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);
EmailElement.propTypes = {
  name: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  label: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  value: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  id: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  "class": (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  placeholder: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  autoComplete: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  disabled: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  required: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  errorMessage: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  onUserInput: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func),
  onUserBlur: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func)
};
EmailElement.defaultProps = {
  name: '',
  value: '',
  id: null,
  "class": 'col-sm-12',
  placeholder: '',
  autoComplete: null,
  disabled: false,
  required: false,
  errorMessage: '',
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  },
  onUserBlur: function onUserBlur() {}
};

/**
 * Password Component
 * React wrapper for a <input type="password"> element.
 */
var PasswordElement = /*#__PURE__*/function (_Component9) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(PasswordElement, _Component9);
  var _super9 = _createSuper(PasswordElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function PasswordElement(props) {
    var _this9;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, PasswordElement);
    _this9 = _super9.call(this, props);
    _this9.state = {
      on: {
        // password is visible.
        icon: 'close',
        type: 'text'
      },
      off: {
        // password hidden.
        icon: 'open',
        type: 'password'
      },
      active: false // is password visible.
    };

    _this9.handleChange = _this9.handleChange.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this9));
    _this9.handleBlur = _this9.handleBlur.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this9));
    // callback called to toogle the visibility
    _this9.toggleVisibility = _this9.toggleVisibility.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this9));
    return _this9;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(PasswordElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.props.onUserInput(this.props.name, e.target.value, e.target.id, this.state.active ? this.state.on.type : this.state.off.type);
    }

    /**
     * Handle blur
     *
     * @param {object} e - Event
     */
  }, {
    key: "handleBlur",
    value: function handleBlur(e) {
      this.props.onUserBlur(this.props.name, e.target.value);
    }

    /**
     * Toggle visibility
     *
     */
  }, {
    key: "toggleVisibility",
    value: function toggleVisibility() {
      this.setState({
        active: !this.state.active
      });
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var disabled = this.props.disabled ? 'disabled' : null;
      var required = this.props.required ? 'required' : null;
      var errorMessage = null;
      var requiredHTML = null;
      var elementClass = 'row form-group';

      // Add required asterix
      if (required) {
        requiredHTML = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", {
          className: "text-danger"
        }, "*");
      }

      // Add error message
      if (this.props.errorMessage) {
        errorMessage = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", null, this.props.errorMessage);
        elementClass = 'row form-group has-error';
      }
      var label = null;
      if (this.props.label) {
        label = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("label", {
          className: "col-sm-3 control-label",
          htmlFor: this.props.id
        }, this.props.label, requiredHTML);
      }
      var passwordDisplayType = this.state.active ? this.state.on.type : this.state.off.type;
      var passwordDisplayIcon = this.state.active ? this.state.on.icon : this.state.off.icon;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: elementClass
      }, label, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: this.props["class"]
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("input", {
        type: passwordDisplayType,
        className: "form-control",
        name: this.props.name,
        id: this.props.id,
        value: this.props.value || '',
        required: required,
        disabled: disabled,
        onChange: this.handleChange,
        onBlur: this.handleBlur,
        autoComplete: this.props.autoComplete,
        placeholder: this.props.placeholder
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", {
        className: 'form-control-feedback glyphicon glyphicon-eye-' + passwordDisplayIcon,
        style: {
          marginRight: '15px'
        },
        onClick: this.toggleVisibility
      }), errorMessage));
    }
  }]);
  return PasswordElement;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);
PasswordElement.propTypes = {
  name: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  label: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  value: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  "class": (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  type: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  placeholder: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  id: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  disabled: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  required: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  autoComplete: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  errorMessage: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  onUserInput: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func),
  onUserBlur: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func)
};
PasswordElement.defaultProps = {
  id: null,
  label: '',
  value: '',
  type: 'text',
  "class": 'col-sm-9',
  placeholder: '',
  disabled: false,
  required: false,
  autoComplete: null,
  errorMessage: '',
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  },
  onUserBlur: function onUserBlur() {}
};

/**
 * Date Component
 * React wrapper for a <input type="date"> element.
 */
var DateElement = /*#__PURE__*/function (_Component10) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(DateElement, _Component10);
  var _super10 = _createSuper(DateElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function DateElement(props) {
    var _this10;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, DateElement);
    _this10 = _super10.call(this, props);
    _this10.handleChange = _this10.handleChange.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this10));
    return _this10;
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(DateElement, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Check if props minYear and maxYear are valid values if supplied
      var minYear = this.props.minYear;
      var maxYear = this.props.maxYear;
      if (this.props.minYear === '' || this.props.minYear === null) {
        minYear = '1000';
      }
      if (this.props.maxYear === '' || this.props.maxYear === null) {
        maxYear = '9999';
      }
    }

    /**
     * Handle change
     *
     * @param {object} e - Event
     */
  }, {
    key: "handleChange",
    value: function handleChange(e) {
      this.props.onUserInput(this.props.name, e.target.value, e.target.id, 'date');
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var disabled = this.props.disabled ? 'disabled' : null;
      var required = this.props.required ? 'required' : null;
      var requiredHTML = null;
      var errorMessage = null;
      var elementClass = 'row form-group';

      // Add required asterix
      if (required) {
        requiredHTML = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", {
          className: "text-danger"
        }, "*");
      }

      // Add error message
      if (this.props.hasError || this.props.required && this.props.value === '') {
        errorMessage = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", null, this.props.errorMessage);
        elementClass = elementClass + ' has-error';
      }

      // Check if props minYear and maxYear are valid values if supplied
      var minYear = this.props.minYear;
      var maxYear = this.props.maxYear;
      if (this.props.minYear === '' || this.props.minYear === null) {
        minYear = '1000';
      }
      if (this.props.maxYear === '' || this.props.maxYear === null) {
        maxYear = '9999';
      }
      var currentDate = new Date();
      // The added '0' is needed because getmonth and getdate return
      // values needed to be padded before saving.
      // padStart adds as many possible zeros while keeping the string
      // at a length of 2 for the following code.
      var currentDay = "".concat(currentDate.getDate()).padStart(2, '0');
      var currentMonth = "".concat(currentDate.getMonth() + 1).padStart(2, '0');

      // Handle date format
      var format = this.props.dateFormat;
      var inputType = 'date';
      var minFullDate = minYear + '-01-01';
      var maxFullDate = maxYear + '-' + currentMonth + '-' + currentDay;
      if (!format.match(/d/i)) {
        inputType = 'month';
        minFullDate = minYear + '-01';
        maxFullDate = maxYear + '-' + currentMonth;
      }
      var labelHTML;
      var classSz = 'col-sm-12';
      if (this.props.label) {
        labelHTML = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("label", {
          className: "col-sm-3 control-label",
          htmlFor: this.props.label
        }, this.props.label, requiredHTML);
        classSz = 'col-sm-9';
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: elementClass
      }, labelHTML, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: classSz
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("input", {
        type: inputType,
        className: "form-control",
        name: this.props.name,
        id: this.props.id,
        min: minFullDate,
        max: maxFullDate,
        onChange: this.handleChange,
        value: this.props.value || '',
        required: required,
        disabled: disabled
      }), errorMessage));
    }
  }]);
  return DateElement;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);
DateElement.propTypes = {
  name: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  label: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  value: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  id: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  maxYear: prop_types__WEBPACK_IMPORTED_MODULE_9___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_9___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_9___default().number)]),
  minYear: prop_types__WEBPACK_IMPORTED_MODULE_9___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_9___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_9___default().number)]),
  dateFormat: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  disabled: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  required: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  hasError: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  errorMessage: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  onUserInput: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func)
};
DateElement.defaultProps = {
  name: '',
  label: '',
  value: undefined,
  id: null,
  maxYear: '9999',
  minYear: '1000',
  dateFormat: 'YMd',
  disabled: false,
  required: false,
  hasError: false,
  errorMessage: 'The field is required!',
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  }
};

/**
 * Time Component
 * React wrapper for a <input type="time"> element.
 */
var TimeElement = /*#__PURE__*/function (_Component11) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(TimeElement, _Component11);
  var _super11 = _createSuper(TimeElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function TimeElement(props) {
    var _this11;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, TimeElement);
    _this11 = _super11.call(this, props);
    _this11.handleChange = _this11.handleChange.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this11));
    return _this11;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(TimeElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.props.onUserInput(this.props.name, e.target.value);
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var disabled = this.props.disabled ? 'disabled' : null;
      var required = this.props.required ? 'required' : null;
      var requiredHTML = null;
      var label;
      var classSz;

      // Add required asterix
      if (required) {
        requiredHTML = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", {
          className: "text-danger"
        }, "*");
      }
      if (this.props.label) {
        label = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("label", {
          className: "col-sm-3 control-label",
          htmlFor: this.props.label
        }, this.props.label, requiredHTML);
        classSz = 'col-sm-9';
      } else {
        classSz = 'col-sm-12';
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: "row form-group"
      }, label, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: classSz
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("input", {
        type: "time",
        className: "form-control",
        name: this.props.name,
        id: this.props.id,
        onChange: this.handleChange,
        value: this.props.value || '',
        required: required,
        disabled: disabled,
        pattern: "([0-1][0-9]|2[0-4]|[1-9]):([0-5][0-9])(:([0-5][0-9]))?",
        title: 'Input must be in one of the following formats: ' + 'HH:MM or HH:MM:SS'
      })));
    }
  }]);
  return TimeElement;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);
TimeElement.propTypes = {
  name: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  label: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  value: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  id: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  disabled: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  required: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  onUserInput: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func)
};
TimeElement.defaultProps = {
  name: '',
  label: '',
  value: '',
  id: '',
  disabled: false,
  required: false,
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  }
};

/**
 * DateTime Component
 * React wrapper for a <input type="datetime-local"> element.
 */
var DateTimeElement = /*#__PURE__*/function (_Component12) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(DateTimeElement, _Component12);
  var _super12 = _createSuper(DateTimeElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function DateTimeElement(props) {
    var _this12;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, DateTimeElement);
    _this12 = _super12.call(this, props);
    _this12.handleChange = _this12.handleChange.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this12));
    return _this12;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(DateTimeElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.props.onUserInput(this.props.name, e.target.value);
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var disabled = this.props.disabled ? 'disabled' : null;
      var required = this.props.required ? 'required' : null;
      var requiredHTML = null;
      var label;
      var classSz;

      // Add required asterix
      if (required) {
        requiredHTML = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", {
          className: "text-danger"
        }, "*");
      }
      if (this.props.label) {
        label = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("label", {
          className: "col-sm-3 control-label",
          htmlFor: this.props.label
        }, this.props.label, requiredHTML);
        classSz = 'col-sm-9';
      } else {
        classSz = 'col-sm-12';
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: "row form-group"
      }, label, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: classSz
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("input", {
        type: "datetime-local",
        className: "form-control",
        name: this.props.name,
        id: this.props.id,
        onChange: this.handleChange,
        value: this.props.value || '',
        required: required,
        disabled: disabled,
        pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}(:[0-5][0-9])?",
        title: 'Input must be in one of the following formats: ' + 'YYYY-MM-DDTHH:MM or YYYY-MM-DDTHH:MM:SS'
      })));
    }
  }]);
  return DateTimeElement;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);
DateTimeElement.propTypes = {
  name: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  label: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  value: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  id: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  disabled: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  required: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  onUserInput: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func)
};
DateTimeElement.defaultProps = {
  name: '',
  label: '',
  value: '',
  id: '',
  disabled: false,
  required: false,
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  }
};

/**
 * Numeric Component
 * React wrapper for a <input type="number"> element.
 */
var NumericElement = /*#__PURE__*/function (_Component13) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(NumericElement, _Component13);
  var _super13 = _createSuper(NumericElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function NumericElement(props) {
    var _this13;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, NumericElement);
    _this13 = _super13.call(this, props);
    _this13.handleChange = _this13.handleChange.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this13));
    return _this13;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(NumericElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.props.onUserInput(this.props.name, e.target.value);
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        disabled = _this$props.disabled,
        required = _this$props.required;
      var requiredHTML = required ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", {
        className: "text-danger"
      }, "*") : null;
      var errorMessage = null;
      var elementClass = 'row form-group';

      // Add error message
      if (this.props.errorMessage) {
        errorMessage = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", null, this.props.errorMessage);
        elementClass = 'row form-group has-error';
      }
      var labelHTML;
      var classSz = 'col-sm-12';
      if (this.props.label) {
        labelHTML = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("label", {
          className: "col-sm-3 control-label",
          htmlFor: this.props.label
        }, this.props.label, requiredHTML);
        classSz = 'col-sm-9';
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: elementClass
      }, labelHTML, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: classSz
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("input", {
        type: "number",
        className: "form-control",
        name: this.props.name,
        id: this.props.id,
        min: this.props.min,
        max: this.props.max,
        step: this.props.step,
        value: this.props.value || '',
        disabled: disabled,
        required: required,
        onChange: this.handleChange
      }), errorMessage));
    }
  }]);
  return NumericElement;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);
NumericElement.propTypes = {
  name: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  min: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().number),
  max: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().number),
  step: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  label: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  value: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  id: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  disabled: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  required: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  onUserInput: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func),
  errorMessage: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string)
};
NumericElement.defaultProps = {
  name: '',
  min: null,
  max: null,
  step: '1',
  label: '',
  value: '',
  id: null,
  required: false,
  disabled: false,
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  }
};

/**
 * File Component
 * React wrapper for a simple or 'multiple' <input type="file"> element.
 */
var FileElement = /*#__PURE__*/function (_Component14) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(FileElement, _Component14);
  var _super14 = _createSuper(FileElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function FileElement(props) {
    var _this14;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, FileElement);
    _this14 = _super14.call(this, props);
    _this14.handleChange = _this14.handleChange.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this14));
    return _this14;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(FileElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      // Send current file to parent component
      var files = e.target.files ? this.props.allowMultiple ? e.target.files : e.target.files[0] : '';
      this.props.onUserInput(this.props.name, files);
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var required = this.props.required ? 'required' : null;
      var fileName = undefined;
      if (this.props.value) {
        switch ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1__["default"])(this.props.value)) {
          case 'string':
            fileName = this.props.value;
            break;
          case 'object':
            if (this.props.value instanceof FileList) {
              var files = this.props.value;
              fileName = Array.from(files).map(function (file) {
                return file.name;
              }).join(', ');
            } else {
              fileName = this.props.value.name;
            }
            break;
          default:
            break;
        }
      }
      var requiredHTML = null;
      var errorMessage = '';
      var elementClass = 'row form-group';

      // Add required asterix
      if (required) {
        requiredHTML = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", {
          className: "text-danger"
        }, "*");
      }
      var truncateEllipsis = {
        display: 'table',
        tableLayout: 'fixed',
        width: '100%',
        whiteSpace: 'nowrap'
      };
      var truncateEllipsisChild = {
        display: 'table-cell',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      };

      // Add error message
      if (this.props.hasError) {
        errorMessage = this.props.errorMessage;
        elementClass = 'row form-group has-error';
      }

      // Need to manually reset file value, because HTML API
      // does not allow setting value to anything than empty string.
      // Hence can't use value attribute in the input element.
      var fileHTML = document.querySelector('.fileUpload');
      if (fileHTML && !fileName) {
        fileHTML.value = '';
      }
      if (this.props.disabled) {
        // add padding to align video title on disabled field
        truncateEllipsis.paddingTop = '7px';
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
          className: elementClass
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("label", {
          className: "col-sm-3 control-label"
        }, this.props.label), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
          className: "col-sm-9"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
          style: truncateEllipsis
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", {
          style: truncateEllipsisChild
        }, fileName))));
      }
      var labelHTML;
      var classSz;
      if (this.props.label) {
        labelHTML = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("label", {
          className: "col-sm-3 control-label"
        }, this.props.label, requiredHTML);
        classSz = 'col-sm-9';
      } else {
        classSz = 'col-sm-12';
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: elementClass
      }, labelHTML, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: classSz
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: "input-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        tabIndex: "-1",
        className: "form-control file-caption kv-fileinput-caption"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        style: truncateEllipsis
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", {
        style: truncateEllipsisChild
      }, fileName)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: "file-caption-name",
        id: "video_file"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: "input-group-btn"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: "btn btn-primary btn-file"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("i", {
        className: "glyphicon glyphicon-folder-open"
      }), " Browse", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("input", {
        type: "file",
        className: "fileUpload",
        name: this.props.name,
        onChange: this.handleChange,
        required: required,
        multiple: this.props.allowMultiple
      })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", null, errorMessage)));
    }
  }]);
  return FileElement;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);
FileElement.propTypes = {
  name: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  label: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  value: prop_types__WEBPACK_IMPORTED_MODULE_9___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_9___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_9___default().object)]),
  id: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  disabled: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  required: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  allowMultiple: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  hasError: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  errorMessage: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  onUserInput: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func)
};
FileElement.defaultProps = {
  name: '',
  label: 'File to Upload',
  value: '',
  id: null,
  disabled: false,
  required: false,
  allowMultiple: false,
  hasError: false,
  errorMessage: 'The field is required!',
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  }
};

/**
 * Static element component.
 * Used to displays plain/formatted text as part of a form
 *
 * To pass a formatted text, you need to wrap it in a single parent element.
 * Example usage:
 *
 * ```
 * let myText = (<span>This is my <b>text</b></span>);
 * <StaticElement
 *    text={myText}
 *    label={note}
 * />
 * ```
 */
var StaticElement = /*#__PURE__*/function (_Component15) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(StaticElement, _Component15);
  var _super15 = _createSuper(StaticElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function StaticElement(props) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, StaticElement);
    return _super15.call(this, props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(StaticElement, [{
    key: "render",
    value: function render() {
      var label = null;
      if (this.props.label) {
        label = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("label", {
          className: "col-sm-3 control-label"
        }, this.props.label);
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: "row form-group"
      }, label, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: this.props["class"]
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: this.props.textClass
      }, this.props.text)));
    }
  }]);
  return StaticElement;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);
StaticElement.propTypes = (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({
  label: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  "class": (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  textClass: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  text: prop_types__WEBPACK_IMPORTED_MODULE_9___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_9___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_9___default().element)])
}, "class", (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string));
StaticElement.defaultProps = {
  label: '',
  text: null,
  "class": 'col-sm-9',
  textClass: 'form-control-static'
};

/**
 * Header element component.
 * Used to display a header element with specific level (1-6) as part of a form
 *
 */
var HeaderElement = /*#__PURE__*/function (_Component16) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(HeaderElement, _Component16);
  var _super16 = _createSuper(HeaderElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function HeaderElement(props) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, HeaderElement);
    return _super16.call(this, props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(HeaderElement, [{
    key: "render",
    value: function render() {
      var Tag = 'h' + this.props.headerLevel;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: "row form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement(Tag, {
        className: "col-xs-12"
      }, this.props.text));
    }
  }]);
  return HeaderElement;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);
HeaderElement.propTypes = {
  text: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  headerLevel: prop_types__WEBPACK_IMPORTED_MODULE_9___default().oneOf([1, 2, 3, 4, 5, 6])
};
HeaderElement.defaultProps = {
  headerLevel: 3
};

/**
 * Link element component.
 * Used to link plain/formated text to an href destination as part of a form
 */
var LinkElement = /*#__PURE__*/function (_Component17) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(LinkElement, _Component17);
  var _super17 = _createSuper(LinkElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function LinkElement(props) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, LinkElement);
    return _super17.call(this, props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(LinkElement, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: "row form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("label", {
        className: "col-sm-3 control-label"
      }, this.props.label), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: "col-sm-9"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("p", {
        className: "form-control-static"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("a", {
        href: this.props.href
      }, this.props.text))));
    }
  }]);
  return LinkElement;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);
LinkElement.propTypes = {
  label: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  text: prop_types__WEBPACK_IMPORTED_MODULE_9___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_9___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_9___default().element)]),
  href: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string)
};
LinkElement.defaultProps = {
  label: '',
  text: null,
  href: null
};

/**
 * Checkbox Component
 * React wrapper for a <input type="checkbox"> element.
 */
var CheckboxElement = /*#__PURE__*/function (_React$Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(CheckboxElement, _React$Component);
  var _super18 = _createSuper(CheckboxElement);
  /**
   * @constructor
   */
  function CheckboxElement() {
    var _this15;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, CheckboxElement);
    _this15 = _super18.call(this);
    _this15.handleChange = _this15.handleChange.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this15));
    return _this15;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(CheckboxElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.props.onUserInput(this.props.name, e.target.checked);
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var disabled = this.props.disabled ? 'disabled' : null;
      var required = this.props.required ? 'required' : null;
      var errorMessage = null;
      var requiredHTML = null;
      var elementClass = this.props["class"] + ' ' + this.props.offset;
      var divStyle = this.props["class"] === 'checkbox-inline' ? {
        paddingRight: '5px'
      } : {
        paddingRight: '5px',
        display: 'inline-block'
      };

      // Add required asterix
      if (required) {
        requiredHTML = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", {
          className: "text-danger"
        }, "*");
      }

      // Add error message
      if (this.props.errorMessage) {
        errorMessage = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", null, this.props.errorMessage);
        elementClass = elementClass + ' has-error';
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: elementClass
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: 'col-sm-12'
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("label", {
        htmlFor: this.props.id
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        style: divStyle
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("input", {
        type: "checkbox",
        name: this.props.name,
        id: this.props.id,
        checked: this.props.value,
        required: required,
        disabled: disabled,
        onChange: this.handleChange
      })), errorMessage, this.props.label, requiredHTML)));
    }
  }]);
  return CheckboxElement;
}((react__WEBPACK_IMPORTED_MODULE_8___default().Component));
CheckboxElement.propTypes = {
  name: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  label: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  value: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool.isRequired),
  id: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  "class": (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  offset: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  disabled: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  required: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  errorMessage: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  elementClass: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  onUserInput: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func)
};
CheckboxElement.defaultProps = {
  id: null,
  disabled: false,
  required: false,
  errorMessage: '',
  offset: 'col-sm-offset-3',
  "class": 'checkbox-inline',
  elementClass: 'checkbox-inline col-sm-offset-3',
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  }
};

/**
 * Button component
 * React wrapper for <button> element, typically used to submit forms
 */
var ButtonElement = /*#__PURE__*/function (_Component18) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(ButtonElement, _Component18);
  var _super19 = _createSuper(ButtonElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function ButtonElement(props) {
    var _this16;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, ButtonElement);
    _this16 = _super19.call(this, props);
    _this16.handleClick = _this16.handleClick.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this16));
    return _this16;
  }

  /**
   * Handle click
   *
   * @param {object} e - Event
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(ButtonElement, [{
    key: "handleClick",
    value: function handleClick(e) {
      this.props.onUserInput(e);
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: "row form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: this.props.columnSize
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("button", {
        id: this.props.id,
        name: this.props.name,
        type: this.props.type,
        className: this.props.buttonClass,
        style: this.props.style,
        onClick: this.handleClick,
        disabled: this.props.disabled
      }, this.props.disabled ? 'Uploading...' : this.props.label)));
    }
  }]);
  return ButtonElement;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);
ButtonElement.propTypes = {
  id: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  name: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  label: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  type: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  disabled: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  style: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().object),
  onUserInput: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func),
  columnSize: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  buttonClass: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string)
};
ButtonElement.defaultProps = {
  label: 'Submit',
  type: 'submit',
  disabled: null,
  buttonClass: 'btn btn-primary',
  columnSize: 'col-sm-9 col-sm-offset-3',
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  }
};

/**
 * Call To Action (CTA) component
 * React wrapper for <button> element that is used for Call to Actions, usually
 * outside the context of forms.
 */
var CTA = /*#__PURE__*/function (_Component19) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(CTA, _Component19);
  var _super20 = _createSuper(CTA);
  function CTA() {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, CTA);
    return _super20.apply(this, arguments);
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(CTA, [{
    key: "render",
    value:
    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
    function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("button", {
        className: this.props.buttonClass,
        onClick: this.props.onUserInput
      }, this.props.label);
    }
  }]);
  return CTA;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);
CTA.propTypes = {
  label: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  buttonClass: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  onUserInput: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func)
};
CTA.defaultProps = {
  buttonClass: 'btn btn-primary',
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  }
};

/**
 * Generic form element.
 */
var LorisElement = /*#__PURE__*/function (_Component20) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(LorisElement, _Component20);
  var _super21 = _createSuper(LorisElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function LorisElement(props) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, LorisElement);
    return _super21.call(this, props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(LorisElement, [{
    key: "render",
    value: function render() {
      var elementProps = this.props.element;
      elementProps.ref = elementProps.name;
      elementProps.onUserInput = this.props.onUserInput;
      var elementHtml = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", null);
      switch (elementProps.type) {
        case 'text':
          elementHtml = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement(TextboxElement, elementProps);
          break;
        case 'email':
          elementHtml = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement(EmailElement, elementProps);
          break;
        case 'password':
          elementHtml = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement(PasswordElement, elementProps);
          break;
        case 'tags':
          elementHtml = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement(TagsElement, elementProps);
          break;
        case 'select':
          elementHtml = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement(SelectElement, elementProps);
          break;
        case 'search':
          elementHtml = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement(SearchableDropdown, elementProps);
          break;
        case 'date':
          elementHtml = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement(DateElement, elementProps);
          break;
        case 'time':
          elementHtml = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement(TimeElement, elementProps);
          break;
        case 'numeric':
          elementHtml = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement(NumericElement, elementProps);
          break;
        case 'textarea':
          elementHtml = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement(TextareaElement, elementProps);
          break;
        case 'file':
          elementHtml = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement(FileElement, elementProps);
          break;
        case 'static':
          elementHtml = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement(StaticElement, elementProps);
          break;
        case 'header':
          elementHtml = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement(HeaderElement, elementProps);
          break;
        case 'link':
          elementHtml = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement(LinkElement, elementProps);
          break;
        case 'advcheckbox':
          elementHtml = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement(CheckboxElement, elementProps);
          break;
        default:
          console.warn('Element of type ' + elementProps.type + ' is not currently implemented!');
          break;
      }
      return elementHtml;
    }
  }]);
  return LorisElement;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);
LorisElement.propTypes = {
  element: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().object),
  onUserInput: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string)
};

/**
 * Radio Component
 * React wrapper for a <input type='radio'> element.
 *
 * Example `options` prop:
 *   {
 *     female: 'Female',
 *     male: 'Male',
 *   }
 */
var RadioElement = /*#__PURE__*/function (_React$Component2) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(RadioElement, _React$Component2);
  var _super22 = _createSuper(RadioElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function RadioElement(props) {
    var _this17;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, RadioElement);
    _this17 = _super22.call(this, props);
    _this17.handleChange = _this17.handleChange.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this17));
    _this17.generateLayout = _this17.generateLayout.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this17));
    return _this17;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(RadioElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.props.onUserInput(this.props.name, e.target.value);
    }

    /**
     * Generate layout
     *
     * @return {JSX[]} - An array of element React markup
     */
  }, {
    key: "generateLayout",
    value: function generateLayout() {
      var layout = [];
      var disabled = this.props.disabled ? 'disabled' : null;
      var required = this.props.required ? 'required' : null;
      var styleRow = {
        display: 'flex',
        flexDirection: this.props.vertical ? 'column' : 'row',
        flexWrap: 'wrap',
        width: '100%'
      };
      var styleColumn = {
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'flex-start',
        marginRight: '10px'
      };
      var styleContainer = {
        paddingTop: '7px',
        cursor: 'pointer'
      };
      var styleLabel = {
        margin: 0,
        color: '#064785',
        cursor: 'pointer'
      };
      var styleInput = {
        display: 'inline-block',
        margin: '0 5px 0 5px',
        cursor: 'pointer'
      };
      var content = [];
      for (var key in this.props.options) {
        if (this.props.options.hasOwnProperty(key)) {
          var checked = this.props.checked === key;
          content.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
            key: key,
            style: styleColumn
          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
            style: styleContainer
          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("input", {
            type: "radio",
            name: this.props.name,
            value: key,
            id: key,
            checked: checked,
            required: required,
            disabled: disabled,
            onChange: this.handleChange,
            style: styleInput
          }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("label", {
            htmlFor: key,
            style: styleLabel
          }, this.props.options[key]))));
        }
      }
      layout.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        key: this.props.name + '_key',
        style: styleRow
      }, content));
      return layout;
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var errorMessage = null;
      var requiredHTML = null;
      var elementClass = this.props.elementClass;
      var required = this.props.required ? 'required' : null;

      // Add required asterix
      if (required) {
        requiredHTML = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", {
          className: "text-danger"
        }, "*");
      }
      // Add error message
      if (this.props.errorMessage) {
        errorMessage = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", null, this.props.errorMessage);
        elementClass = this.props.elementClass + ' has-error';
      }
      // Generate layout
      var layout = this.generateLayout();
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: elementClass
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("label", {
        className: 'col-sm-3 control-label'
      }, this.props.label, errorMessage, requiredHTML), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: 'col-sm-9'
      }, layout));
    }
  }]);
  return RadioElement;
}((react__WEBPACK_IMPORTED_MODULE_8___default().Component));
RadioElement.propTypes = {
  name: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  label: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  options: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().object.isRequired),
  disabled: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  required: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  vertical: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  checked: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  errorMessage: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  elementClass: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  onUserInput: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func)
};
RadioElement.defaultProps = {
  disabled: false,
  required: false,
  vertical: false,
  errorMessage: '',
  elementClass: 'row form-group',
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  }
};

/**
 * Slider Component
 * React wrapper for a <input type='range'> element.
 */
var SliderElement = /*#__PURE__*/function (_React$Component3) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(SliderElement, _React$Component3);
  var _super23 = _createSuper(SliderElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function SliderElement(props) {
    var _this18;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, SliderElement);
    _this18 = _super23.call(this, props);
    _this18.handleChange = _this18.handleChange.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this18));
    return _this18;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(SliderElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      // Handles empty, min & max cases.
      var inputValue = e.target.value ? parseFloat(e.target.value) : this.props.minValue;
      var value = inputValue > this.props.maxValue ? this.props.maxValue : inputValue;
      value = value < this.props.minValue ? this.props.minValue : value;
      this.props.onUserInput(this.props.name, value);
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var errorMessage = null;
      var requiredHTML = null;
      var elementClass = this.props.elementClass;
      var disabled = this.props.disabled ? 'disabled' : null;
      var required = this.props.required ? 'required' : null;
      // Add required asterix
      if (required) {
        requiredHTML = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", {
          className: "text-danger"
        }, "*");
      }
      // Add error message
      if (this.props.errorMessage) {
        errorMessage = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("span", null, this.props.errorMessage);
        elementClass = this.props.elementClass + ' has-error';
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: elementClass
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("label", {
        className: 'col-sm-3 control-label',
        htmlFor: this.props.id
      }, this.props.label, errorMessage, requiredHTML), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        className: 'col-sm-9'
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '100%'
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        style: {
          flexGrow: 1000,
          display: 'flex',
          flexDirection: 'column',
          flexBasis: '100%',
          maxWidth: this.props.maxWidth,
          marginRight: '5px',
          flex: 2
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("input", {
        type: "range",
        name: this.props.name,
        id: this.props.id,
        value: this.props.value,
        min: this.props.minValue,
        max: this.props.maxValue,
        required: required,
        disabled: disabled,
        onChange: this.handleChange,
        style: {
          width: '100%'
        }
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          flexBasis: '100%',
          maxWidth: '50px',
          flex: 1
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement("input", {
        type: "number",
        name: 'input_' + this.props.name,
        value: this.props.value,
        min: this.props.minValue,
        max: this.props.maxValue,
        required: required,
        disabled: disabled,
        onChange: this.handleChange,
        style: {
          width: '50px',
          textAlign: 'center'
        }
      })))));
    }
  }]);
  return SliderElement;
}((react__WEBPACK_IMPORTED_MODULE_8___default().Component));
SliderElement.propTypes = {
  id: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  name: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  label: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  value: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().number.isRequired),
  minValue: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().number.isRequired),
  maxValue: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().number.isRequired),
  maxWidth: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  disabled: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  required: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  errorMessage: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  elementClass: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  onUserInput: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func)
};
SliderElement.defaultProps = {
  id: null,
  maxWidth: 'auto',
  disabled: false,
  required: false,
  errorMessage: '',
  elementClass: 'row form-group',
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  FormElement: FormElement,
  FieldsetElement: FieldsetElement,
  SelectElement: SelectElement,
  TagsElement: TagsElement,
  SearchableDropdown: SearchableDropdown,
  TextareaElement: TextareaElement,
  TextboxElement: TextboxElement,
  PasswordElement: PasswordElement,
  DateElement: DateElement,
  TimeElement: TimeElement,
  DateTimeElement: DateTimeElement,
  NumericElement: NumericElement,
  FileElement: FileElement,
  StaticElement: StaticElement,
  HeaderElement: HeaderElement,
  LinkElement: LinkElement,
  CheckboxElement: CheckboxElement,
  RadioElement: RadioElement,
  SliderElement: SliderElement,
  ButtonElement: ButtonElement,
  CTA: CTA,
  LorisElement: LorisElement
});

/***/ }),

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
/***/ ((module) => {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ "./node_modules/prop-types/checkPropTypes.js":
/*!***************************************************!*\
  !*** ./node_modules/prop-types/checkPropTypes.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (true) {
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};
  var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) { /**/ }
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' +
              'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (true) {
    loggedTypeFailures = {};
  }
}

module.exports = checkPropTypes;


/***/ }),

/***/ "./node_modules/prop-types/factoryWithTypeCheckers.js":
/*!************************************************************!*\
  !*** ./node_modules/prop-types/factoryWithTypeCheckers.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/react-is/index.js");
var assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");

var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");
var checkPropTypes = __webpack_require__(/*! ./checkPropTypes */ "./node_modules/prop-types/checkPropTypes.js");

var printWarning = function() {};

if (true) {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bigint: createPrimitiveTypeChecker('bigint'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message, data) {
    this.message = message;
    this.data = data && typeof data === 'object' ? data: {};
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (true) {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if ( true && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError(
          'Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'),
          {expectedType: expectedType}
        );
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!ReactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (true) {
        if (arguments.length > 1) {
          printWarning(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
       true ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      var expectedTypes = [];
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
        if (checkerResult == null) {
          return null;
        }
        if (checkerResult.data && has(checkerResult.data, 'expectedType')) {
          expectedTypes.push(checkerResult.data.expectedType);
        }
      }
      var expectedTypesMessage = (expectedTypes.length > 0) ? ', expected one of type [' + expectedTypes.join(', ') + ']': '';
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`' + expectedTypesMessage + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function invalidValidatorError(componentName, location, propFullName, key, type) {
    return new PropTypeError(
      (componentName || 'React class') + ': ' + location + ' type `' + propFullName + '.' + key + '` is invalid; ' +
      'it must be a function, usually from the `prop-types` package, but received `' + type + '`.'
    );
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (has(shapeTypes, key) && typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ "./node_modules/prop-types/index.js":
/*!******************************************!*\
  !*** ./node_modules/prop-types/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/react-is/index.js");

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(/*! ./factoryWithTypeCheckers */ "./node_modules/prop-types/factoryWithTypeCheckers.js")(ReactIs.isElement, throwOnDirectAccess);
} else {}


/***/ }),

/***/ "./node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!*************************************************************!*\
  !*** ./node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ "./node_modules/prop-types/lib/has.js":
/*!********************************************!*\
  !*** ./node_modules/prop-types/lib/has.js ***!
  \********************************************/
/***/ ((module) => {

module.exports = Function.call.bind(Object.prototype.hasOwnProperty);


/***/ }),

/***/ "./node_modules/react-is/cjs/react-is.development.js":
/*!***********************************************************!*\
  !*** ./node_modules/react-is/cjs/react-is.development.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}


/***/ }),

/***/ "./node_modules/react-is/index.js":
/*!****************************************!*\
  !*** ./node_modules/react-is/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ "./node_modules/react-is/cjs/react-is.development.js");
}


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = window["React"];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _assertThisInitialized)
/* harmony export */ });
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _classCallCheck)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _createClass)
/* harmony export */ });
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _defineProperty)
/* harmony export */ });
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _getPrototypeOf)
/* harmony export */ });
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inherits.js":
/*!*************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inherits.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inherits)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _possibleConstructorReturn)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assertThisInitialized.js */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");


function _possibleConstructorReturn(self, call) {
  if (call && ((0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return (0,_assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__["default"])(self);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _setPrototypeOf)
/* harmony export */ });
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*******************************************************!*\
  !*** ./modules/roles_manager/jsx/rolesManagerForm.js ***!
  \*******************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var jsx_Form__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");





function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }




/**
 * Roles Form
 *
 * Module component rendering `New role` or `Edit` role buttons
 *
 * @author Regis Ongaro-Carcy
 */
var RolesManagerForm = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__["default"])(RolesManagerForm, _Component);
  var _super = _createSuper(RolesManagerForm);
  function RolesManagerForm() {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, RolesManagerForm);
    return _super.apply(this, arguments);
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(RolesManagerForm, [{
    key: "render",
    value:
    /**
     * Render function
     *
     * @return {*}
     */
    function render() {
      var _this$props = this.props,
        role = _this$props.role,
        setRole = _this$props.setRole,
        add = _this$props.add,
        errors = _this$props.errors,
        handleSubmit = _this$props.handleSubmit,
        hasPermission = _this$props.hasPermission;

      // Inform users about duplicate entries
      var renderHelpText = function renderHelpText() {
        if (add) {
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("span", null, "You cannot add a duplicated role (unique \"Code\" value).", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("br", null), "The \"Code\" will be generated based on the \"Name\" you write.", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("br", null));
        } else {
          // edit
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("span", null, "Editing an entry will alter the current entry.", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("br", null), "The \"Code\" will remain the same as the first entered (unique).", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("br", null));
        }
      };
      var renderPermissionsText = function renderPermissionsText() {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("span", null, "Check permissions applicable to this role.", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("br", null));
      };

      // --------------------------------------
      // Render
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_6__.FormElement, {
        name: "roles_form",
        onSubmit: handleSubmit
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_6__.StaticElement, {
        label: "Note",
        text: renderHelpText()
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_6__.StaticElement, {
        name: "Code",
        label: "Code",
        text: role.Code,
        value: role.Code
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_6__.TextboxElement, {
        name: "Name",
        label: "Name",
        placeHolder: "Role name",
        onUserInput: setRole,
        required: true,
        value: role.Name,
        errorMessage: errors.Name,
        hasError: errors.Name
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_6__.TextareaElement, {
        name: "Description",
        label: "Description",
        placeHolder: "Role description",
        onUserInput: setRole,
        required: true,
        value: role.Description,
        errorMessage: errors.Description,
        hasError: errors.Description
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_6__.StaticElement, {
        label: "Permissions",
        text: renderPermissionsText()
      }), role.permissions.map(function (p) {
        // label
        var permissionLabel = '' + (p.moduleName == null ? '' : p.moduleName + ': ') + (p.permissionAction == null ? '' : p.permissionAction + ' - ') + p.permissionDescription;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_6__.CheckboxElement, {
          key: p.permissionCode,
          name: 'permission-' + p.permissionCode,
          label: permissionLabel,
          onUserInput: setRole,
          required: false,
          disabled: !hasPermission('roles_edit'),
          value: p.hasPermission == null ? false : p.hasPermission,
          errorMessage: errors.permissionCode,
          hasError: errors.permissionCode
        });
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_6__.ButtonElement, {
        label: "Submit"
      }));
    }
  }]);
  return RolesManagerForm;
}(react__WEBPACK_IMPORTED_MODULE_5__.Component);
RolesManagerForm.propTypes = {
  role: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().object.isRequired),
  setRole: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().func.isRequired),
  add: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().bool),
  errors: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().object),
  handleSubmit: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().func.isRequired),
  hasPermission: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().func.isRequired)
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RolesManagerForm);
})();

((window.lorisjs = window.lorisjs || {}).roles_manager = window.lorisjs.roles_manager || {}).rolesManagerForm = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=rolesManagerForm.js.map