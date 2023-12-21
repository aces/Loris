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
  legend: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
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
          value: '',
          selected: true
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

/***/ "./jsx/Loader.js":
/*!***********************!*\
  !*** ./jsx/Loader.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_0__);
/**
 * This file contains the React component for Loader
 *
 * @author Henri Rabalais
 * @version 1.0.0
 */


/**
 * Loader is a React component which shows a spinner wheel while
 * something is loading.
 *
 * @param {array} props - The React props
 * @return {HTMLElement} - Loader React component
 */
function Loader(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "loader",
    style: {
      width: parseInt(props.size),
      height: parseInt(props.size)
    }
  });
}
Loader.propTypes = {
  size: (prop_types__WEBPACK_IMPORTED_MODULE_0___default().string)
};
Loader.defaultProps = {
  size: '120'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Loader);

/***/ }),

/***/ "./jsx/Modal.js":
/*!**********************!*\
  !*** ./jsx/Modal.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var jsx_Form__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");






function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * This file contains the React Component for a Modal Window.
 *
 * @author Henri Rabalais
 * @version 1.1.0
 */





/**
 * Modal Component.
 * React wrapper for a Modal Window. Allows to dynamically toggle a Modal
 * window.
 *
 * ================================================
 * Usage:
 * - Wrap the contents to be displayed by the Modal Window by the
 *   Modal Component.
 * - Use the 'title' prop to set a title for the Modal Component.
 * - Use the 'onSubmit' prop to set a submission *promise* object for the
 *   Modal's contents.
 * - Use the 'onClose' prop to set a function that triggers upon Modal closure.
 * - Use the 'throwWarning' prop to throw a warning upon closure of the
 *   Modal Window.
 * =================================================
 *
 */
var Modal = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__["default"])(Modal, _Component);
  var _super = _createSuper(Modal);
  /**
   * @constructor
   */
  function Modal() {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Modal);
    _this = _super.call(this);
    _this.handleClose = _this.handleClose.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    return _this;
  }

  /**
   * Display a warning message on close
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Modal, [{
    key: "handleClose",
    value: function handleClose() {
      var _this2 = this;
      if (this.props.throwWarning) {
        sweetalert2__WEBPACK_IMPORTED_MODULE_7___default().fire({
          title: 'Are You Sure?',
          text: 'Leaving the form will result in the loss of any information ' + 'entered.',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Proceed',
          cancelButtonText: 'Cancel'
        }).then(function (result) {
          return result.value && _this2.props.onClose();
        });
      } else {
        this.props.onClose();
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
      var _this3 = this;
      var _this$props = this.props,
        show = _this$props.show,
        children = _this$props.children,
        onSubmit = _this$props.onSubmit,
        title = _this$props.title,
        width = _this$props.width;
      var headerStyle = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '40px',
        borderTopRightRadius: '10',
        fontSize: 24,
        padding: 35,
        borderBottom: '1px solid #DDDDDD'
      };
      var glyphStyle = {
        marginLeft: 'auto',
        cursor: 'pointer'
      };
      var bodyStyle = {
        padding: 15,
        maxHeight: '75vh',
        overflowY: 'scroll'
      };
      var modalContainer = {
        display: 'block',
        position: 'fixed',
        zIndex: 9999,
        paddingTop: '65px',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: 'rgba(0,0,0,0.7)',
        visibility: show ? 'visible' : 'hidden'
      };
      var modalContent = {
        opacity: show ? 1 : 0,
        top: show ? 0 : '-300px',
        position: 'relative',
        backgroundColor: '#fefefe',
        borderRadius: '7px',
        margin: 'auto',
        padding: 0,
        border: '1px solid #888',
        width: width || '700px',
        boxShadow: '0 4px 8px 0 rbga(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)',
        transition: 'top 0.4s, opacity 0.4s'
      };
      var renderChildren = function renderChildren() {
        return show && children;
      };
      var footerStyle = {
        borderTop: '1px solid #DDDDDD',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '40px',
        padding: '35px 35px 20px 35px'
      };
      var submitStyle = {
        marginLeft: 'auto',
        marginRight: '20px'
      };
      var submitButton = function submitButton() {
        if (onSubmit) {
          var submit = function submit() {
            return onSubmit().then(function () {
              return _this3.props.onClose();
            })["catch"](function () {});
          };
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", {
            style: submitStyle
          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_8__.ButtonElement, {
            label: "Submit",
            onUserInput: submit
          }));
        }
      };
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", {
        style: modalContainer,
        onClick: this.handleClose
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", {
        style: modalContent,
        onClick: function onClick(e) {
          return e.stopPropagation();
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", {
        style: headerStyle
      }, title, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("span", {
        style: glyphStyle,
        onClick: this.handleClose
      }, "\xD7")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", {
        style: bodyStyle
      }, renderChildren()), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", {
        style: footerStyle
      }, submitButton())));
    }
  }]);
  return Modal;
}(react__WEBPACK_IMPORTED_MODULE_6__.Component);
Modal.propTypes = {
  title: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
  onSubmit: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func),
  onClose: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func.isRequired),
  show: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool.isRequired),
  throwWarning: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  children: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().node),
  width: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string)
};
Modal.defaultProps = {
  throwWarning: false
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Modal);

/***/ }),

/***/ "./modules/consent/jsx/e_consent/basicConsentForm.js":
/*!***********************************************************!*\
  !*** ./modules/consent/jsx/e_consent/basicConsentForm.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _directConsentForm__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./directConsentForm */ "./modules/consent/jsx/e_consent/directConsentForm.js");
/* harmony import */ var Loader__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! Loader */ "./jsx/Loader.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _sendConfirmation__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./sendConfirmation */ "./modules/consent/jsx/e_consent/sendConfirmation.js");






function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * This file sets up a basic eConsent form without training
 *
 * @author Camille Beaudoin
 *
 */





/**
 * Basic Page
 *
 * Component for simple version of eConsent form
 *
 * @author Camille Beaudoin
 */
var BasicPage = /*#__PURE__*/function (_React$Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__["default"])(BasicPage, _React$Component);
  var _super = _createSuper(BasicPage);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function BasicPage(props) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, BasicPage);
    _this = _super.call(this, props);
    _this.state = {
      isLoaded: false,
      formData: [],
      errors: [],
      openSendConfirmation: false
    };
    _this.submitConsent = _this.submitConsent.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.setFormData = _this.setFormData.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.renderSendConfirmation = _this.renderSendConfirmation.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.openSendConfirmation = _this.openSendConfirmation.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    return _this;
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(BasicPage, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        isLoaded: true
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
      if (!this.state.isLoaded) {
        return /*#__PURE__*/React.createElement(Loader__WEBPACK_IMPORTED_MODULE_7__["default"], null);
      }
      var page;

      // create z-json eConsent structure out of basic eConsent display elements
      page = {
        'schema': {
          'elements': {
            'consentPage': {
              'type': 'section',
              'description': {
                'EN': ''
              },
              'options': {
                'order': ['title', 'media', 'description'],
                'showDesc': false
              }
            },
            'title': {
              'type': 'text',
              'description': {
                'EN': this.props.consentData.Title
              }
            },
            'media': {
              'type': 'image',
              'description': {
                'EN': ''
              },
              'src': {
                'EN': this.props.consentData.Media
              },
              'options': {
                'isDisplayedAsText': false,
                'ifDisplayed': 'render'
              }
            },
            'description': {
              'type': 'text',
              'description': {
                'EN': this.props.consentData.Description
              }
            }
          },
          'setup': [{
            'name': 'consentPage',
            'order': ['consentPage']
          }]
        },
        'ui': {
          'title': {
            'type': 'header',
            'options': {
              'level': 1
            }
          },
          'media': {
            'type': 'image',
            'options': {
              'percentage': '70'
            }
          },
          'description': {
            'type': 'label'
          }
        }
      };
      var consents = this.props.consentData.consents;
      var button;
      if (this.props.requestStatus !== 'complete') {
        // Add question for each consent code in consent group
        // If not already complete
        for (var property in consents) {
          if (consents.hasOwnProperty(property)) {
            // Create elements for each consent code
            page.schema.elements.consentPage.options.order.push(property);
            page.schema.elements[property] = {
              'type': 'enum',
              'description': {
                'EN': consents[property].Label
              },
              'options': {
                'values': [{
                  'description': {
                    'EN': 'I agree'
                  },
                  'value': 'yes'
                }, {
                  'description': {
                    'EN': 'I disagree'
                  },
                  'value': 'no'
                }],
                'isSavable': true
              }
            };
            page.ui[property] = {
              'type': 'select'
            };
          }
        }
        // Add submit button
        button = /*#__PURE__*/React.createElement("div", {
          className: 'flex-row-container',
          style: {
            padding: '20px 0 0 0'
          }
        }, /*#__PURE__*/React.createElement("button", {
          type: "submit",
          className: "btn btn-primary btn-lg",
          onClick: this.submitConsent
        }, "Submit"));
      } else {
        // Add notice that form is complete
        page.schema.elements.consentPage.options.order.push('notice');
        page.schema.elements['notice'] = {
          'type': 'text',
          'description': {
            'EN': 'This form has already been completed. Thank you!'
          }
        };
        page.ui['notice'] = {
          'type': 'label'
        };
      }

      // Render page elements
      var elements = /*#__PURE__*/React.createElement(_directConsentForm__WEBPACK_IMPORTED_MODULE_6__["default"], {
        elements: page,
        consentAnswers: this.state.formData,
        updateConsentAnswer: this.setFormData,
        errors: this.state.errors,
        page: "consentPage"
      });
      if (this.state.openSendConfirmation) {
        return /*#__PURE__*/React.createElement("div", null, this.renderSendConfirmation(), /*#__PURE__*/React.createElement("div", {
          id: "consent"
        }, /*#__PURE__*/React.createElement("div", {
          className: 'container'
        }, elements), /*#__PURE__*/React.createElement("div", {
          className: 'container'
        }, button)));
      } else {
        return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
          id: "consent"
        }, this.renderSendConfirmation(), /*#__PURE__*/React.createElement("div", {
          className: 'container'
        }, elements), /*#__PURE__*/React.createElement("div", {
          className: 'container'
        }, button)));
      }
    }

    /**
     * Submit consent to update database
     */
  }, {
    key: "submitConsent",
    value: function submitConsent() {
      var _this2 = this;
      var consents = this.props.consentData.consents;
      var errors = [];

      // Give error if no answer selected
      for (var property in consents) {
        if (this.state.formData[property] == null) {
          errors[property] = 'Answer required';
        }
      }
      var customSwal = function (pageFn) {
        return function () {
          sweetalert2__WEBPACK_IMPORTED_MODULE_8___default().fire({
            type: 'success',
            title: 'Success!',
            text: 'Thank you for completing the eConsent Form! ' + 'Please click "Send Confirmation" below to receive ' + 'a confirmation email',
            showCancelButton: true,
            confirmButtonText: 'Send Confirmation'
          }).then(function (result) {
            if (result['value']) {
              pageFn();
            }
          });
        };
      }(function () {
        return _this2.openSendConfirmation();
      });

      // Submit if no errors
      if (Object.keys(errors).length == 0) {
        this.props.submit(this.state.formData, customSwal);
      }
      this.setState({
        errors: errors
      });
    }

    /**
     * Store the value of the element in this.state.formData
     *
     * @param {string} formElement - name of the form element
     * @param {string} value - value of the form element
     */
  }, {
    key: "setFormData",
    value: function setFormData(formElement, value) {
      var formData = this.state.formData;
      formData[formElement] = value;
      this.setState({
        formData: formData
      });
    }

    /**
     * open send confirmation page
     */
  }, {
    key: "openSendConfirmation",
    value: function openSendConfirmation() {
      this.setState({
        openSendConfirmation: true
      });
      this.forceUpdate();
    }

    /**
     * Render form to send consent confirmation
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "renderSendConfirmation",
    value: function renderSendConfirmation() {
      return /*#__PURE__*/React.createElement(_sendConfirmation__WEBPACK_IMPORTED_MODULE_9__["default"], {
        data_url: this.props.data_url,
        openSendConfirmation: this.state.openSendConfirmation
      });
    }
  }]);
  return BasicPage;
}(React.Component);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BasicPage);

/***/ }),

/***/ "./modules/consent/jsx/e_consent/directConsentForm.js":
/*!************************************************************!*\
  !*** ./modules/consent/jsx/e_consent/directConsentForm.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var dompurify__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! dompurify */ "./node_modules/dompurify/dist/purify.js");
/* harmony import */ var dompurify__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(dompurify__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var Modal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! Modal */ "./jsx/Modal.js");
/* harmony import */ var jsx_Form__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");







function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * This file contains React form components for eConsents
 *
 * @author Camille Beaudoin
 *
 */




/**
 *  THIS ELEMENT IS FOR DEVELOPMENT PURPOSES ONLY
 */
var NotImplement = /*#__PURE__*/function (_React$Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(NotImplement, _React$Component);
  var _super = _createSuper(NotImplement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function NotImplement(props) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, NotImplement);
    return _super.call(this, props);
  }

  /**
   * Render component
   * @return {JSX} - React markup for the component
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(NotImplement, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", null, this.props.type, " is not yet implemented");
    }
  }]);
  return NotImplement;
}(React.Component);
/**
 * Set up Page
 */
var Page = /*#__PURE__*/function (_React$Component2) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Page, _React$Component2);
  var _super2 = _createSuper(Page);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function Page(props) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Page);
    return _super2.call(this, props);
  }

  /**
   * Render component
   * @return {JSX} - React markup for the component
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(Page, [{
    key: "render",
    value: function render() {
      var pageElements = this.props.elements.schema.elements[this.props.page].options.order;
      var DirectEntryFormElements = [];
      // Go through form elements to render each one
      for (var i = 0; i < pageElements.length; i++) {
        DirectEntryFormElements.push( /*#__PURE__*/React.createElement(DirectEntryFormElement, {
          name: pageElements[i],
          element: this.props.elements.schema.elements[pageElements[i]],
          ui: this.props.elements.ui[pageElements[i]],
          values: _objectSpread(_objectSpread({}, this.props.values), this.props.consentAnswers),
          updateAnswer: this.props.updateAnswer,
          updateConsentAnswer: this.props.updateConsentAnswer,
          errors: this.props.errors
        }));
      }
      return /*#__PURE__*/React.createElement("div", null, DirectEntryFormElements);
    }
  }]);
  return Page;
}(React.Component);
/**
 * Render form element
 */
var DirectEntryFormElement = /*#__PURE__*/function (_React$Component3) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(DirectEntryFormElement, _React$Component3);
  var _super3 = _createSuper(DirectEntryFormElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function DirectEntryFormElement(props) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, DirectEntryFormElement);
    return _super3.call(this, props);
  }

  /**
   * Render component
   * @return {JSX} - React markup for the component
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(DirectEntryFormElement, [{
    key: "render",
    value: function render() {
      var element;
      var errorMessage;
      var questionClass = 'question-container col-xs-12 col-sm-10 col-sm-offset-1';
      switch (this.props.ui.type) {
        case 'select':
          element = /*#__PURE__*/React.createElement(SelectElement, {
            name: this.props.name,
            element: this.props.element,
            value: this.props.values[this.props.name],
            updateAnswer: this.props.updateAnswer,
            updateConsentAnswer: this.props.updateConsentAnswer,
            error: this.props.errors[this.props.name]
          });
          break;
        case 'label':
          element = /*#__PURE__*/React.createElement(LabelElement, {
            element: this.props.element
          });
          break;
        case 'header':
          element = /*#__PURE__*/React.createElement(HeaderElement, {
            element: this.props.element,
            level: this.props.ui.options.level
          });
          break;
        case 'image':
          // Check if modal image element or image element
          if (this.props.element.options.isDisplayedAsText && this.props.element.options.ifDisplayed === 'modal') {
            element = /*#__PURE__*/React.createElement(ModalImageElement, {
              element: this.props.element,
              percentage: this.props.ui.options.percentage
            });
          } else {
            element = /*#__PURE__*/React.createElement(ImageElement, {
              element: this.props.element,
              percentage: this.props.ui.options.percentage
            });
          }
          break;
        case 'link':
          element = /*#__PURE__*/React.createElement(LinkElement, {
            element: this.props.element,
            downloadable: this.props.ui.options.isDownloadable,
            href: this.props.ui.options.href
          });
          break;
        case 'checkbox':
          element = /*#__PURE__*/React.createElement("div", {
            className: "checkboxText"
          }, /*#__PURE__*/React.createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_9__.CheckboxElement, {
            name: this.props.name,
            label: this.props.element.description.EN,
            value: this.props.values[this.props.name],
            onUserInput: this.props.updateAnswer,
            disabled: this.props.element.options.disabled,
            elementClass: 'checkbox-inline'
          }));
          break;
        default:
          element = /*#__PURE__*/React.createElement(NotImplement, {
            element: this.props.element
          });
      }
      ;

      // Set error display if needed
      if (this.props.errors[this.props.name]) {
        questionClass += ' questionError';
        errorMessage = /*#__PURE__*/React.createElement("h4", {
          className: "col-xs-12 has-error"
        }, "* ", this.props.errors[this.props.name]);
      }
      return /*#__PURE__*/React.createElement("div", {
        id: this.props.name,
        className: questionClass
      }, element, errorMessage);
    }
  }]);
  return DirectEntryFormElement;
}(React.Component);
/**
 * Render select element
 */
var SelectElement = /*#__PURE__*/function (_React$Component4) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(SelectElement, _React$Component4);
  var _super4 = _createSuper(SelectElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function SelectElement(props) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, SelectElement);
    _this = _super4.call(this, props);
    _this.state = {
      value: ''
    };
    return _this;
  }

  /**
   * Call update answer when selected
   * @param {string} value
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(SelectElement, [{
    key: "onSelect",
    value: function onSelect(value) {
      var updateAnswer;
      if (this.props.element.options.isSavable) {
        updateAnswer = this.props.updateConsentAnswer;
      } else {
        updateAnswer = this.props.updateAnswer;
      }
      if (this.props.value !== value) {
        updateAnswer(this.props.name, value);
      } else {
        updateAnswer(this.props.name, null);
      }
    }

    /**
     * Render component
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var options = [];
      var optionLabel;
      var optionVals = this.props.element.options.values;

      // render each option in the select element
      for (var i = 0; i < optionVals.length; i++) {
        var checked = void 0;
        if (optionVals[i].value === '') {
          continue;
        } else if (optionVals[i].value === this.props.value) {
          checked = /*#__PURE__*/React.createElement("i", {
            className: "glyphicon glyphicon-ok"
          });
        }
        optionLabel = optionVals[i].description.EN;
        var _description = /*#__PURE__*/React.createElement("div", {
          dangerouslySetInnerHTML: {
            __html: dompurify__WEBPACK_IMPORTED_MODULE_7___default().sanitize(optionLabel)
          }
        });

        // Render as disabled if needed
        if (this.props.element.options.disabled) {
          options.push( /*#__PURE__*/React.createElement("div", {
            key: optionVals[i].value,
            className: "col-xs-12"
          }, /*#__PURE__*/React.createElement("div", {
            className: "col-xs-offset-1 selectBox"
          }, /*#__PURE__*/React.createElement("label", {
            className: "btn btn-default btn-circle disabled"
          }, checked)), /*#__PURE__*/React.createElement("div", {
            className: "selectOption"
          }, _description)));
        } else {
          options.push( /*#__PURE__*/React.createElement("div", {
            key: optionVals[i].value,
            className: "col-xs-12 select-option",
            onClick: this.onSelect.bind(this, optionVals[i].value)
          }, /*#__PURE__*/React.createElement("div", {
            className: "col-xs-offset-1 selectBox"
          }, /*#__PURE__*/React.createElement("label", {
            className: "btn btn-default btn-circle"
          }, checked)), /*#__PURE__*/React.createElement("div", {
            className: "selectOption"
          }, _description)));
        }
      }
      var element = /*#__PURE__*/React.createElement("div", {
        className: "row field_input",
        "data-toggle": "buttons"
      }, options);
      var classInfo = 'col-xs-12 field_question';
      if (this.props.error) {
        classInfo += ' has-error';
      }
      var description = '';
      if (this.props.element.description.EN) {
        var label = /*#__PURE__*/React.createElement("div", {
          dangerouslySetInnerHTML: {
            __html: dompurify__WEBPACK_IMPORTED_MODULE_7___default().sanitize(this.props.element.description.EN)
          }
        });
        description = /*#__PURE__*/React.createElement("h3", {
          className: classInfo
        }, label);
      }
      return /*#__PURE__*/React.createElement("div", null, description, element);
    }
  }]);
  return SelectElement;
}(React.Component);
/**
 * Render label element
 */
var LabelElement = /*#__PURE__*/function (_React$Component5) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(LabelElement, _React$Component5);
  var _super5 = _createSuper(LabelElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function LabelElement(props) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, LabelElement);
    return _super5.call(this, props);
  }

  /**
   * Render component
   * @return {JSX} - React markup for the component
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(LabelElement, [{
    key: "render",
    value: function render() {
      var label = this.props.element.description.EN;
      var description = /*#__PURE__*/React.createElement("div", {
        dangerouslySetInnerHTML: {
          __html: dompurify__WEBPACK_IMPORTED_MODULE_7___default().sanitize(label)
        }
      });
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
        className: "labelText"
      }, description));
    }
  }]);
  return LabelElement;
}(React.Component);
/**
 * Render header element
 */
var HeaderElement = /*#__PURE__*/function (_React$Component6) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(HeaderElement, _React$Component6);
  var _super6 = _createSuper(HeaderElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function HeaderElement(props) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, HeaderElement);
    return _super6.call(this, props);
  }

  /**
   * Render component
   * @return {JSX} - React markup for the component
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(HeaderElement, [{
    key: "render",
    value: function render() {
      var label = this.props.element.description.EN;
      if (this.props.level == 2) {
        var description = /*#__PURE__*/React.createElement("h3", {
          className: "col-xs-12 field_question"
        }, /*#__PURE__*/React.createElement("div", {
          dangerouslySetInnerHTML: {
            __html: dompurify__WEBPACK_IMPORTED_MODULE_7___default().sanitize(label)
          }
        }));
        return /*#__PURE__*/React.createElement("div", null, description);
      } else {
        var element = /*#__PURE__*/React.createElement("h1", null, /*#__PURE__*/React.createElement("div", {
          dangerouslySetInnerHTML: {
            __html: dompurify__WEBPACK_IMPORTED_MODULE_7___default().sanitize(label)
          }
        }));
        return /*#__PURE__*/React.createElement("div", null, element);
      }
    }
  }]);
  return HeaderElement;
}(React.Component);
/**
 * Render link element
 */
var LinkElement = /*#__PURE__*/function (_React$Component7) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(LinkElement, _React$Component7);
  var _super7 = _createSuper(LinkElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function LinkElement(props) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, LinkElement);
    return _super7.call(this, props);
  }

  /**
   * Render component
   * @return {JSX} - React markup for the component
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(LinkElement, [{
    key: "render",
    value: function render() {
      var label = this.props.element.description.EN;
      var description = /*#__PURE__*/React.createElement("div", {
        dangerouslySetInnerHTML: {
          __html: dompurify__WEBPACK_IMPORTED_MODULE_7___default().sanitize(label)
        }
      });
      if (this.props.downloadable) {
        return /*#__PURE__*/React.createElement("div", {
          id: "linkElement"
        }, /*#__PURE__*/React.createElement("a", {
          href: this.props.href,
          download: true
        }, /*#__PURE__*/React.createElement("p", {
          className: "downloadText"
        }, description)));
      } else {
        return /*#__PURE__*/React.createElement("div", {
          className: "linkElement"
        }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("a", {
          href: this.props.href,
          target: "_blank"
        }, description)));
      }
    }
  }]);
  return LinkElement;
}(React.Component);
/**
 * Image element
 */
var ImageElement = /*#__PURE__*/function (_React$Component8) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(ImageElement, _React$Component8);
  var _super8 = _createSuper(ImageElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function ImageElement(props) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, ImageElement);
    return _super8.call(this, props);
  }

  /**
   * Render component
   * @return {JSX} - React markup for the component
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(ImageElement, [{
    key: "render",
    value: function render() {
      var width = this.props.percentage + '%';
      return /*#__PURE__*/React.createElement("div", {
        id: "Media"
      }, /*#__PURE__*/React.createElement("img", {
        src: this.props.element.src.EN,
        width: width
      }));
    }
  }]);
  return ImageElement;
}(React.Component);
/**
 * Image element in modal window
 */
var ModalImageElement = /*#__PURE__*/function (_React$Component9) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(ModalImageElement, _React$Component9);
  var _super9 = _createSuper(ModalImageElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function ModalImageElement(props) {
    var _this2;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, ModalImageElement);
    _this2 = _super9.call(this, props);
    _this2.state = {
      isOpen: false
    };
    _this2.openModal = _this2.openModal.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__["default"])(_this2));
    _this2.closeModal = _this2.closeModal.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__["default"])(_this2));
    _this2.renderModalWindow = _this2.renderModalWindow.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__["default"])(_this2));
    return _this2;
  }
  /**
   * Render component
   * @return {JSX} - React markup for the component
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(ModalImageElement, [{
    key: "render",
    value: function render() {
      var label = this.props.element.description.EN;
      var description = /*#__PURE__*/React.createElement("div", {
        dangerouslySetInnerHTML: {
          __html: dompurify__WEBPACK_IMPORTED_MODULE_7___default().sanitize(label)
        }
      });
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
        href: "#",
        onClick: this.openModal
      }, /*#__PURE__*/React.createElement("p", {
        className: "downloadText"
      }, description)), this.renderModalWindow());
    }
    /**
     * Open window
     */
  }, {
    key: "openModal",
    value: function openModal() {
      this.setState({
        isOpen: true
      });
    }
    /**
     * Close window
     */
  }, {
    key: "closeModal",
    value: function closeModal() {
      this.setState({
        isOpen: false
      });
    }
    /**
     * Render modal window
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "renderModalWindow",
    value: function renderModalWindow() {
      var width = this.props.percentage + '%';
      return /*#__PURE__*/React.createElement(Modal__WEBPACK_IMPORTED_MODULE_8__["default"], {
        onClose: this.closeModal,
        show: this.state.isOpen
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
        "class": "modal-image",
        src: this.props.element.src.EN,
        width: width
      })));
    }
  }]);
  return ModalImageElement;
}(React.Component);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Page);

/***/ }),

/***/ "./modules/consent/jsx/e_consent/sendConfirmation.js":
/*!***********************************************************!*\
  !*** ./modules/consent/jsx/e_consent/sendConfirmation.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var Modal__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! Modal */ "./jsx/Modal.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var jsx_Form__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");






function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * Add Consent form
 * Renders form to add a consent row
 *
 * @author Camille Beaudoin
 *
 * */





/**
 * Add Consent Form
 *
 * Component for form adding consent to DB
 *
 * @author Camille Beaudoin
 */
var sendConfirmation = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__["default"])(sendConfirmation, _Component);
  var _super = _createSuper(sendConfirmation);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function sendConfirmation(props) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, sendConfirmation);
    _this = _super.call(this, props);
    _this.state = {
      isLoaded: false,
      data_url: '',
      isOpen: false,
      formData: {
        email1: null,
        email2: null
      }
    };
    _this.close = _this.close.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.setFormData = _this.setFormData.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.sendConfirmation = _this.sendConfirmation.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    return _this;
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(sendConfirmation, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        isLoaded: true,
        data_url: this.props.data_url,
        isOpen: this.props.openSendConfirmation,
        formData: {
          email1: null,
          email2: null
        }
      });
    }

    /**
     * Close window
     */
  }, {
    key: "close",
    value: function close() {
      this.setState({
        isOpen: false
      });
    }

    /**
     * Store the value of the element in this.state.formData
     *
     * @param {string} formElement - name of the form element
     * @param {string} value - value of the form element
     */
  }, {
    key: "setFormData",
    value: function setFormData(formElement, value) {
      var formData = this.state.formData;
      formData[formElement] = value;
      this.setState({
        formData: formData
      });
    }

    /**
     * Submit the formdata to add consent row and send
     *
     * @return {object} promise
     */
  }, {
    key: "sendConfirmation",
    value: function sendConfirmation() {
      // create formObject for submit values
      var formObject = new FormData();
      for (var key in this.state.formData) {
        if (this.state.formData[key] !== '') {
          formObject.append(key, this.state.formData[key]);
        }
      }
      formObject.append('action', 'send');
      // Post data
      var actionUrl = this.state.data_url + '&action=send';
      return fetch(actionUrl, {
        method: 'POST',
        body: formObject,
        cache: 'no-cache'
      }).then(function (response) {
        if (response.ok) {
          // Give success message in swal
          // Customizeable for specific swal message / buttons
          sweetalert2__WEBPACK_IMPORTED_MODULE_8___default().fire('Success!', 'Confirmation sent', 'success');
          return Promise.resolve();
        } else {
          // If errors, give error message
          response.text().then(function (message) {
            var msg = JSON.parse(message);
            sweetalert2__WEBPACK_IMPORTED_MODULE_8___default().fire('Error!', msg.error, 'error');
          });
          return Promise.reject();
        }
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
      // Waiting for data to load
      if (!this.state.isLoaded) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("button", {
          className: "btn-info has-spinner"
        }, "Loading", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("span", {
          className: "glyphicon glyphicon-refresh glyphicon-refresh-animate"
        }));
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(Modal__WEBPACK_IMPORTED_MODULE_7__["default"], {
        title: "Send Confirmation",
        onClose: this.close,
        show: this.state.isOpen
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_9__.FormElement, {
        Module: "consent",
        name: "sendConfirmation",
        id: "sendConfirmation",
        method: "POST"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_9__.TextboxElement, {
        name: "email1",
        label: "Enter email",
        value: this.state.formData.email1,
        required: false,
        onUserInput: this.setFormData
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_9__.TextboxElement, {
        name: "email2",
        label: "Confirm email",
        value: this.state.formData.email2,
        required: false,
        onUserInput: this.setFormData
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_9__.ButtonElement, {
        name: "fire_away",
        label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("span", {
          className: "glyphicon glyphicon-envelope"
        }), " Send Confirmation"),
        type: "submit",
        buttonClass: "btn btn-sm btn-success",
        onUserInput: this.sendConfirmation
      })));
    }
  }]);
  return sendConfirmation;
}(react__WEBPACK_IMPORTED_MODULE_6__.Component);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sendConfirmation);

/***/ }),

/***/ "./modules/consent/jsx/e_consent/trainingConsentForm.js":
/*!**************************************************************!*\
  !*** ./modules/consent/jsx/e_consent/trainingConsentForm.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _directConsentForm__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./directConsentForm */ "./modules/consent/jsx/e_consent/directConsentForm.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var Loader__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! Loader */ "./jsx/Loader.js");
/* harmony import */ var _sendConfirmation__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./sendConfirmation */ "./modules/consent/jsx/e_consent/sendConfirmation.js");







function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * This file contains React form components for Training Consent page
 *
 * @author Camille Beaudoin
 *
 */





/**
 * Basic Page
 *
 * Component for complex training version of eConsent form
 *
 * @author Camille Beaudoin
 */
var TrainingPage = /*#__PURE__*/function (_React$Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(TrainingPage, _React$Component);
  var _super = _createSuper(TrainingPage);
  /**
    * @constructor
    * @param {object} props - React Component properties
    */
  function TrainingPage(props) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, TrainingPage);
    _this = _super.call(this, props);
    _this.state = {
      currentPage: 'index',
      isLoaded: false,
      pageVals: [],
      answers: [],
      consentPageAnswers: [],
      errors: [],
      trainingProgress: [],
      consentVals: [],
      openSendConfirmation: false
    };
    _this.acknowledgementNeeded = _this.acknowledgementNeeded.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.sectionHasConsent = _this.sectionHasConsent.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.pageHasConsent = _this.pageHasConsent.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.trainingComplete = _this.trainingComplete.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.sectionDone = _this.sectionDone.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.pageDone = _this.pageDone.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.pageQuestions = _this.pageQuestions.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.changePage = _this.changePage.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.getValues = _this.getValues.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.setDisabled = _this.setDisabled.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.updatePageAnswer = _this.updatePageAnswer.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.updateConsentAnswer = _this.updateConsentAnswer.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.determineButtons = _this.determineButtons.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.getNextPage = _this.getNextPage.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.getPrevPage = _this.getPrevPage.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.submitConsent = _this.submitConsent.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.submitPageAnswer = _this.submitPageAnswer.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.renderSendConfirmation = _this.renderSendConfirmation.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.openSendConfirmation = _this.openSendConfirmation.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    return _this;
  }

  /**
    * Called by React when the component has been rendered on the page.
    */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(TrainingPage, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _JSON$parse;
      // set state values
      var consentVals = {};
      var consents = this.props.consentData.consents;
      for (var property in consents) {
        if (consents.hasOwnProperty(property)) {
          consentVals[property] = consents[property].Status;
        }
      }
      this.setState({
        isLoaded: true,
        pageVals: JSON.parse(this.props.consentData.training),
        trainingProgress: (_JSON$parse = JSON.parse(this.props.consentData.trainingProgress)) !== null && _JSON$parse !== void 0 ? _JSON$parse : [],
        consentVals: consentVals
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
      var _this2 = this;
      if (!this.state.isLoaded) {
        return /*#__PURE__*/React.createElement(Loader__WEBPACK_IMPORTED_MODULE_9__["default"], null);
      }
      if (this.state.currentPage === 'index') {
        // If in the index page, set up the eConsent training doors
        var pageVals = this.state.pageVals;
        var setup = pageVals.schema.setup;
        var sections = [];

        // Loop through each section from setup to render clickable door
        var _loop = function _loop(i) {
          var section = setup[i];
          var m = 'Please complete eConsent training before accessing this page';
          if (_this2.sectionHasConsent(i) && !_this2.trainingComplete()) {
            // Consent section disabled if training is not complete
            sections.push( /*#__PURE__*/React.createElement("div", {
              key: section.name,
              className: 'flex-row-item disabled',
              onClick: function onClick() {
                return sweetalert2__WEBPACK_IMPORTED_MODULE_8___default().fire('Unavailable', m, 'error');
              }
            }, /*#__PURE__*/React.createElement("span", {
              id: "door-text"
            }, section.description.EN), /*#__PURE__*/React.createElement("div", {
              id: "Media"
            }, /*#__PURE__*/React.createElement("img", {
              src: section.image,
              id: "door-icon"
            }))));
          } else {
            // Non-disabled doors have link to first page in the section
            sections.push( /*#__PURE__*/React.createElement("div", {
              key: section.name,
              className: 'flex-row-item',
              onClick: function onClick() {
                return _this2.changePage(section.order[0]);
              },
              disabled: true
            }, /*#__PURE__*/React.createElement("span", {
              id: "door-text"
            }, section.description.EN), /*#__PURE__*/React.createElement("div", {
              id: "Media"
            }, /*#__PURE__*/React.createElement("img", {
              src: section.image,
              id: "door-icon"
            })), _this2.sectionDone(i) ? /*#__PURE__*/React.createElement("p", {
              className: 'checkmark'
            }, "\u2714\uFE0F") : null));
          }
        };
        for (var i = 0; i < setup.length; i++) {
          _loop(i);
        }

        // Add title, description, training boxes
        return /*#__PURE__*/React.createElement("div", null, this.renderSendConfirmation(), /*#__PURE__*/React.createElement("div", {
          className: 'container'
        }, /*#__PURE__*/React.createElement("div", {
          id: "title",
          className: "question-container"
        }, /*#__PURE__*/React.createElement("h3", null, this.props.consentData.Title)), /*#__PURE__*/React.createElement("div", {
          id: "description",
          className: "question-container"
        }, /*#__PURE__*/React.createElement("h4", null, this.props.consentData.Description))), /*#__PURE__*/React.createElement("div", {
          className: 'container'
        }, /*#__PURE__*/React.createElement("div", {
          className: 'flex-row-container',
          style: {
            padding: '20px 0 0 0'
          }
        }, sections)));
      } else {
        // If page selected, render page
        var page = this.state.currentPage;
        var prevAnswered = this.getValues();
        var values = _objectSpread(_objectSpread({}, prevAnswered), this.state.answers);
        var consentValues = _objectSpread(_objectSpread({}, this.state.consentVals), this.state.consentPageAnswers);

        // Disable questions as needed
        this.setDisabled();

        // render page elements
        var elements = /*#__PURE__*/React.createElement(_directConsentForm__WEBPACK_IMPORTED_MODULE_7__["default"], {
          elements: this.state.pageVals,
          values: values,
          consentAnswers: consentValues,
          updateAnswer: this.updatePageAnswer,
          updateConsentAnswer: this.updateConsentAnswer,
          errors: this.state.errors,
          page: page
        });
        // set buttons needed for page
        var buttons = this.determineButtons();
        return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
          id: "consent"
        }, /*#__PURE__*/React.createElement("div", {
          className: 'container'
        }, elements), buttons));
      }
    }

    /**
     * Determines whether non-consent questions in the
     * consent section need to be answered before consent
     *
     * @return {boolean}
     */
  }, {
    key: "acknowledgementNeeded",
    value: function acknowledgementNeeded() {
      var acknowledgementComplete = true;
      var acknowledgementRequired = false;
      var setup = this.state.pageVals.schema.setup;

      // go through doors
      for (var i = 0; i < setup.length; i++) {
        // check consent sections
        if (this.sectionHasConsent(i)) {
          var doors = this.state.pageVals.schema.setup;
          var pages = doors[i].order;
          for (var j = 0; j < pages.length; j++) {
            if (this.pageQuestions(pages[j]).length > 0 && !this.pageHasConsent(pages[j])) {
              // if there are non-consent questions, acknowledgement is required
              acknowledgementRequired = true;
              if (!this.state.trainingProgress.includes(pages[j])) {
                // if non-consent questions not answered,
                // acknowledgement is not complete
                acknowledgementComplete = false;
              }
            }
          }
        }
      }
      // Acknowledgement needed if required & incomplete
      return acknowledgementRequired && !acknowledgementComplete;
    }

    /**
     * Determines whether given section has consent questions
     *
     * @param {int} sectionIndex
     * @return {boolean}
     */
  }, {
    key: "sectionHasConsent",
    value: function sectionHasConsent(sectionIndex) {
      var pages = this.state.pageVals.schema.setup[sectionIndex].order;
      var hasConsent = false;

      // If any pages from the section have consent, return true
      for (var i = 0; i < pages.length; i++) {
        if (this.pageHasConsent(pages[i])) {
          hasConsent = true;
        }
      }
      return hasConsent;
    }

    /**
     * Determines whether given page has consent questions
     *
     * @param {string} page
     * @return {boolean}
     */
  }, {
    key: "pageHasConsent",
    value: function pageHasConsent(page) {
      var elements = this.state.pageVals.schema.elements;
      var pageElements = elements[page].options.order;
      for (var i = 0; i < pageElements.length; i++) {
        if (elements[pageElements[i]].type == 'enum') {
          return elements[pageElements[i]].options.isSavable;
        }
      }
      return false;
    }

    /**
     * Determines every non-consent section has been completed
     *
     * @return {boolean}
     */
  }, {
    key: "trainingComplete",
    value: function trainingComplete() {
      var setup = this.state.pageVals.schema.setup;
      // go through doors
      for (var i = 0; i < setup.length; i++) {
        // check whether section has been completed
        if (!this.sectionDone(i) && !this.sectionHasConsent(i)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Determines whether a section has all pages complete
     *
     * @param {int} sectionIndex
     * @return {boolean}
     */
  }, {
    key: "sectionDone",
    value: function sectionDone(sectionIndex) {
      if (this.state.trainingProgress == [] || !this.state.isLoaded) {
        return false;
      }
      var done = true;
      var doors = this.state.pageVals.schema.setup;
      var pages = doors[sectionIndex].order;
      // if a a page has questions and is not complete, return false
      for (var j = 0; j < pages.length; j++) {
        if (this.pageQuestions(pages[j]).length > 0) {
          if (!this.pageDone(pages[j])) {
            return false;
          }
        }
      }
      return done;
    }

    /**
     * Determine if page has questions / if the questions have been answered
     *
     * @param {string} page
     * @return {boolean}
     */
  }, {
    key: "pageDone",
    value: function pageDone(page) {
      if (this.pageHasConsent(page)) {
        // if consent page, page done all page questions are answered
        var questions = this.pageQuestions(page);
        for (var i = 0; i < questions.length; i++) {
          if (this.state.consentVals[questions[i]] == null) {
            return false;
          }
        }
        return true;
      } else {
        // if not consent page, done if set in trainingProgress
        return this.state.trainingProgress.includes(page);
      }
    }

    /**
     * Get array of questions for a page
     *
     * @param {string} page
     * @return {array} questions
     */
  }, {
    key: "pageQuestions",
    value: function pageQuestions(page) {
      var elements = this.state.pageVals.schema.elements;
      var pageElements = elements[page].options.order;
      var questions = [];
      for (var i = 0; i < pageElements.length; i++) {
        if (elements[pageElements[i]].type == 'enum' || elements[pageElements[i]].type == 'boolean') {
          questions.push(pageElements[i]);
        }
      }
      return questions;
    }

    /**
     * Update state to given page
     *
     * @param {string} p - page to change to
     */
  }, {
    key: "changePage",
    value: function changePage(p) {
      this.setState({
        currentPage: p,
        answers: [],
        consentPageAnswers: []
      });
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    /**
     * Get object of questions and values that have been answered
     *
     * @return {object} values
     */
  }, {
    key: "getValues",
    value: function getValues() {
      var values = {};
      var sections = this.state.pageVals.schema.setup;
      var elements = this.state.pageVals.schema.elements;
      // Go through each section & pages
      for (var i = 0; i < sections.length; i++) {
        var pages = sections[i].order;
        for (var j = 0; j < pages.length; j++) {
          // if the page is done, return questions & their values
          if (this.pageDone(pages[j])) {
            var questions = this.pageQuestions(pages[j]);
            for (var h = 0; h < questions.length; h++) {
              values[questions[h]] = elements[questions[h]].options.correctResponse;
            }
          }
        }
      }
      return values;
    }

    /**
     * Set disabled questions if needed
     */
  }, {
    key: "setDisabled",
    value: function setDisabled() {
      var trainingProgress = this.state.trainingProgress;
      var elements = this.state.pageVals.schema.elements;
      // disable questions from answered pages
      for (var i = 0; i < trainingProgress.length; i++) {
        var pageQuestions = this.pageQuestions(trainingProgress[i]);
        for (var j = 0; j < pageQuestions.length; j++) {
          elements[pageQuestions[j]].options.disabled = true;
        }
      }
      // disable consent questions if answered
      // or if acknowledgement is needed
      var consentVals = this.state.consentVals;
      for (var property in consentVals) {
        if (consentVals.hasOwnProperty(property)) {
          if (consentVals[property] != null || this.acknowledgementNeeded()) {
            elements[property].options.disabled = true;
          } else {
            elements[property].options.disabled = false;
          }
        }
      }
    }

    /**
     * Update page answer in state
     *
     * @param {string} fieldName
     * @param {string} value
     */
  }, {
    key: "updatePageAnswer",
    value: function updatePageAnswer(fieldName, value) {
      var answers = this.state.answers;
      answers[fieldName] = value;
      this.setState({
        answers: answers
      });
    }

    /**
     * Update consent answer in state
     *
     * @param {string} consent (name of consent code)
     * @param {string} value (participants answer to consent)
     */
  }, {
    key: "updateConsentAnswer",
    value: function updateConsentAnswer(consent, value) {
      var answers = this.state.consentPageAnswers;
      answers[consent] = value;
      this.setState({
        consentPageAnswers: answers
      });
    }

    /**
      * Get buttons needed on page
      *
      * @return {object}
      */
  }, {
    key: "determineButtons",
    value: function determineButtons() {
      var _this3 = this;
      var buttons = [];
      var submitButton = [];
      var page = this.state.currentPage;
      var hasConsent = this.pageHasConsent(this.state.currentPage);
      var hasQuestion = this.pageQuestions(this.state.currentPage).length > 0;
      var complete = this.pageDone(page);
      var className = 'btn btn-primary btn-lg submit-button';

      // No buttons needed in index page
      if (page !== 'index') {
        // All pages need "return to main page"
        buttons.push( /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
          type: "submit",
          className: className,
          onClick: function onClick() {
            return _this3.changePage('index');
          },
          disabled: false
        }, "Return to Main Page")));

        // add "Previous" page if not first page
        if (this.getPrevPage()) {
          buttons.push( /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
            type: "submit",
            className: className,
            onClick: function onClick() {
              return _this3.changePage(_this3.getPrevPage());
            },
            disabled: false
          }, "Previous")));
        }
        var _page = this.state.currentPage;
        // Next page not enabled if they have not answered
        // the current page questions
        var disableNextPage = false;
        var questions = this.pageQuestions(_page);
        if (questions.length > 0 && !this.pageDone(_page)) {
          disableNextPage = true;
        }
        // Add "Next" page if next page accessible
        if (this.getNextPage()) {
          buttons.push( /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
            type: "submit",
            className: className,
            onClick: function onClick() {
              return _this3.changePage(_this3.getNextPage());
            },
            disabled: disableNextPage,
            title: "Please complete question(s) to go to next page"
          }, "Next")));
        }

        // Add "submit consent" if consent page and unanswered
        if (hasConsent && !complete) {
          submitButton = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
            type: "submit",
            className: className,
            onClick: this.submitConsent,
            disabled: false
          }, "Submit consent"));
        } else if (hasQuestion && !hasConsent && !complete) {
          // Add "submit " if not page has questions, not consent page & unanswered
          submitButton = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
            type: "submit",
            className: className,
            onClick: this.submitPageAnswer,
            disabled: false
          }, "Submit"));
        }
      }
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: 'container'
      }, /*#__PURE__*/React.createElement("div", {
        className: 'flex-row-container',
        style: {
          padding: '20px 0 0 0'
        }
      }, submitButton)), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", {
        className: 'container'
      }, /*#__PURE__*/React.createElement("div", {
        className: 'flex-row-container',
        style: {
          padding: '20px 0 0 0'
        }
      }, buttons)));
    }

    /**
      * Get next page if available
      *
      * @return {string}
      */
  }, {
    key: "getNextPage",
    value: function getNextPage() {
      var setup = this.state.pageVals.schema.setup;
      var page = this.state.currentPage;
      var nextPageIndex;
      var setupIndex;

      // If last page in section, return null
      for (var i = 0; i < setup.length; i++) {
        for (var j = 0; j < setup[i].order.length; j++) {
          if (setup[i].order[j] == page) {
            // if last page in section, return null
            // Otherwise, go to next page
            if (j === setup[i].order.length - 1) {
              return null;
            } else {
              setupIndex = i;
              nextPageIndex = j + 1;
            }
          }
        }
      }
      return setup[setupIndex].order[nextPageIndex];
    }

    /**
      * Get previous page if available
      *
      * @return {string}
      */
  }, {
    key: "getPrevPage",
    value: function getPrevPage() {
      var setup = this.state.pageVals.schema.setup;
      var page = this.state.currentPage;
      var pageIndex;
      var setupIndex;
      for (var i = 0; i < setup.length; i++) {
        for (var j = 0; j < setup[i].order.length; j++) {
          if (setup[i].order[j] == page) {
            // if first page in section, go to last page
            // of previous section. Otherwise, go to previous page
            if (j === 0) {
              return null;
            } else {
              setupIndex = i;
              pageIndex = j - 1;
            }
          }
        }
      }
      return setup[setupIndex].order[pageIndex];
    }

    /**
      * Submit consent values
      */
  }, {
    key: "submitConsent",
    value: function submitConsent() {
      var _this4 = this;
      var questions = this.pageQuestions(this.state.currentPage);
      var errors = [];

      // Give error if answer not selected
      for (var i = 0; i < questions.length; i++) {
        if (this.state.consentPageAnswers[questions[i]] == null) {
          errors[questions[i]] = 'Must enter consent answer before submitting';
        }
      }
      if (errors.length == 0 && Object.keys(this.state.consentPageAnswers).length > 0) {
        // Anonymous function for a custom swal including "next page" button
        var customSwal = null;
        if (this.getNextPage()) {
          customSwal = function (pageFn) {
            return function () {
              sweetalert2__WEBPACK_IMPORTED_MODULE_8___default().fire({
                type: 'success',
                title: 'Success!',
                text: 'Thank you for completing this step!',
                showCancelButton: true,
                cancelButtonText: 'OK',
                confirmButtonText: 'Next Page'
              }).then(function (result) {
                if (result['value']) {
                  pageFn();
                }
              });
            };
          }(function () {
            return _this4.changePage(_this4.getNextPage());
          });
        } else {
          customSwal = function (pageFn) {
            return function () {
              sweetalert2__WEBPACK_IMPORTED_MODULE_8___default().fire({
                type: 'success',
                title: 'Success!',
                text: 'Thank you for completing the eConsent Form! Please click "Send Confirmation" below to receive a confirmation email.',
                showCancelButton: true,
                confirmButtonText: 'Send Confirmation'
              }).then(function (result) {
                if (result['value']) {
                  pageFn();
                }
              });
            };
          }(function () {
            return _this4.openSendConfirmation();
          });
        }
        // submit consent through props function
        this.props.submit(this.state.consentPageAnswers, customSwal);
        this.setState({
          consentVals: _objectSpread(_objectSpread({}, this.state.consentVals), this.state.consentPageAnswers)
        });
      }
      this.setState({
        errors: errors
      });
    }

    /**
     * open send confirmation page
     */
  }, {
    key: "openSendConfirmation",
    value: function openSendConfirmation() {
      this.setState({
        openSendConfirmation: true
      });
      this.changePage('index');
    }

    /**
     * Render form to send consent confirmation
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "renderSendConfirmation",
    value: function renderSendConfirmation() {
      return /*#__PURE__*/React.createElement(_sendConfirmation__WEBPACK_IMPORTED_MODULE_10__["default"], {
        data_url: this.props.data_url,
        openSendConfirmation: this.state.openSendConfirmation
      });
    }

    /**
      * Submit non-consent values
      *
      * @return {object} promise
      */
  }, {
    key: "submitPageAnswer",
    value: function submitPageAnswer() {
      var _this5 = this;
      var answers = this.state.answers;
      var errors = [];
      var questions = this.pageQuestions(this.state.currentPage);
      for (var i = 0; i < questions.length; i++) {
        var question = questions[i];
        // Check that question was answered
        // Don't check for other errors if not answered
        if (!(question in answers)) {
          errors[question] = 'Please select answer before submitting';
          break;
        }
        var options = this.state.pageVals.schema.elements[question].options;
        // Check that answer is correct
        var correctResponse = options.correctResponse;
        if (answers[question] !== correctResponse) {
          errors[question] = 'Incorrect! Please review and try again.';
        }
      }
      if (Object.keys(errors).length === 0) {
        // Add page to training progress
        var trainingProgress = this.state.trainingProgress;
        trainingProgress.push(this.state.currentPage);
        var progress = JSON.stringify(trainingProgress);

        // submit progress
        var formObj = new FormData();
        formObj.append('progress', progress);
        var actionUrl = this.props.data_url + '&action=progress';
        return fetch(actionUrl, {
          method: 'POST',
          body: formObj,
          cache: 'no-cache'
        }).then(function (response) {
          if (response.ok) {
            // if successful, set state & disabled questions
            _this5.setState({
              trainingProgress: trainingProgress,
              errors: []
            });
            _this5.setDisabled();
            // Give swal with next page option if relevant
            if (_this5.getNextPage()) {
              sweetalert2__WEBPACK_IMPORTED_MODULE_8___default().fire({
                type: 'success',
                title: 'Success!',
                text: 'Thank you! You may continue to the next step.',
                showCancelButton: true,
                cancelButtonText: 'OK',
                confirmButtonText: 'Next page'
              }).then(function (result) {
                if (result['value']) {
                  _this5.changePage(_this5.getNextPage());
                }
              });
            } else {
              // otherwise, give swal with return to main page option
              sweetalert2__WEBPACK_IMPORTED_MODULE_8___default().fire({
                type: 'success',
                title: 'Success!',
                text: 'Thank you! You may continue to the next step.',
                showCancelButton: true,
                cancelButtonText: 'OK',
                confirmButtonText: 'Return to Main Page'
              }).then(function (result) {
                if (result['value']) {
                  _this5.changePage('index');
                }
              });
            }
            return Promise.resolve();
          } else {
            // Display error if could not update progress
            var msg = response.statusText ? response.statusText : 'Submission Error!';
            sweetalert2__WEBPACK_IMPORTED_MODULE_8___default().fire(msg, '', 'error');
            console.error(msg);
            return Promise.reject();
          }
        });
      }
      this.setState({
        errors: errors
      });
    }
  }]);
  return TrainingPage;
}(React.Component);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TrainingPage);

/***/ }),

/***/ "./node_modules/dompurify/dist/purify.js":
/*!***********************************************!*\
  !*** ./node_modules/dompurify/dist/purify.js ***!
  \***********************************************/
/***/ (function(module) {

/*! @license DOMPurify 2.4.1 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/2.4.1/LICENSE */

(function (global, factory) {
   true ? module.exports = factory() :
  0;
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var hasOwnProperty = Object.hasOwnProperty,
      setPrototypeOf = Object.setPrototypeOf,
      isFrozen = Object.isFrozen,
      getPrototypeOf = Object.getPrototypeOf,
      getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var freeze = Object.freeze,
      seal = Object.seal,
      create = Object.create; // eslint-disable-line import/no-mutable-exports

  var _ref = typeof Reflect !== 'undefined' && Reflect,
      apply = _ref.apply,
      construct = _ref.construct;

  if (!apply) {
    apply = function apply(fun, thisValue, args) {
      return fun.apply(thisValue, args);
    };
  }

  if (!freeze) {
    freeze = function freeze(x) {
      return x;
    };
  }

  if (!seal) {
    seal = function seal(x) {
      return x;
    };
  }

  if (!construct) {
    construct = function construct(Func, args) {
      return _construct(Func, _toConsumableArray(args));
    };
  }

  var arrayForEach = unapply(Array.prototype.forEach);
  var arrayPop = unapply(Array.prototype.pop);
  var arrayPush = unapply(Array.prototype.push);
  var stringToLowerCase = unapply(String.prototype.toLowerCase);
  var stringToString = unapply(String.prototype.toString);
  var stringMatch = unapply(String.prototype.match);
  var stringReplace = unapply(String.prototype.replace);
  var stringIndexOf = unapply(String.prototype.indexOf);
  var stringTrim = unapply(String.prototype.trim);
  var regExpTest = unapply(RegExp.prototype.test);
  var typeErrorCreate = unconstruct(TypeError);
  function unapply(func) {
    return function (thisArg) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return apply(func, thisArg, args);
    };
  }
  function unconstruct(func) {
    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return construct(func, args);
    };
  }
  /* Add properties to a lookup table */

  function addToSet(set, array, transformCaseFunc) {
    transformCaseFunc = transformCaseFunc ? transformCaseFunc : stringToLowerCase;

    if (setPrototypeOf) {
      // Make 'in' and truthy checks like Boolean(set.constructor)
      // independent of any properties defined on Object.prototype.
      // Prevent prototype setters from intercepting set as a this value.
      setPrototypeOf(set, null);
    }

    var l = array.length;

    while (l--) {
      var element = array[l];

      if (typeof element === 'string') {
        var lcElement = transformCaseFunc(element);

        if (lcElement !== element) {
          // Config presets (e.g. tags.js, attrs.js) are immutable.
          if (!isFrozen(array)) {
            array[l] = lcElement;
          }

          element = lcElement;
        }
      }

      set[element] = true;
    }

    return set;
  }
  /* Shallow clone an object */

  function clone(object) {
    var newObject = create(null);
    var property;

    for (property in object) {
      if (apply(hasOwnProperty, object, [property])) {
        newObject[property] = object[property];
      }
    }

    return newObject;
  }
  /* IE10 doesn't support __lookupGetter__ so lets'
   * simulate it. It also automatically checks
   * if the prop is function or getter and behaves
   * accordingly. */

  function lookupGetter(object, prop) {
    while (object !== null) {
      var desc = getOwnPropertyDescriptor(object, prop);

      if (desc) {
        if (desc.get) {
          return unapply(desc.get);
        }

        if (typeof desc.value === 'function') {
          return unapply(desc.value);
        }
      }

      object = getPrototypeOf(object);
    }

    function fallbackValue(element) {
      console.warn('fallback value for', element);
      return null;
    }

    return fallbackValue;
  }

  var html$1 = freeze(['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'shadow', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']); // SVG

  var svg$1 = freeze(['svg', 'a', 'altglyph', 'altglyphdef', 'altglyphitem', 'animatecolor', 'animatemotion', 'animatetransform', 'circle', 'clippath', 'defs', 'desc', 'ellipse', 'filter', 'font', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'stop', 'style', 'switch', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'view', 'vkern']);
  var svgFilters = freeze(['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence']); // List of SVG elements that are disallowed by default.
  // We still need to know them so that we can do namespace
  // checks properly in case one wants to add them to
  // allow-list.

  var svgDisallowed = freeze(['animate', 'color-profile', 'cursor', 'discard', 'fedropshadow', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignobject', 'hatch', 'hatchpath', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'missing-glyph', 'script', 'set', 'solidcolor', 'unknown', 'use']);
  var mathMl$1 = freeze(['math', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover']); // Similarly to SVG, we want to know all MathML elements,
  // even those that we disallow by default.

  var mathMlDisallowed = freeze(['maction', 'maligngroup', 'malignmark', 'mlongdiv', 'mscarries', 'mscarry', 'msgroup', 'mstack', 'msline', 'msrow', 'semantics', 'annotation', 'annotation-xml', 'mprescripts', 'none']);
  var text = freeze(['#text']);

  var html = freeze(['accept', 'action', 'align', 'alt', 'autocapitalize', 'autocomplete', 'autopictureinpicture', 'autoplay', 'background', 'bgcolor', 'border', 'capture', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'controls', 'controlslist', 'coords', 'crossorigin', 'datetime', 'decoding', 'default', 'dir', 'disabled', 'disablepictureinpicture', 'disableremoteplayback', 'download', 'draggable', 'enctype', 'enterkeyhint', 'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'id', 'inputmode', 'integrity', 'ismap', 'kind', 'label', 'lang', 'list', 'loading', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'minlength', 'multiple', 'muted', 'name', 'nonce', 'noshade', 'novalidate', 'nowrap', 'open', 'optimum', 'pattern', 'placeholder', 'playsinline', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'rev', 'reversed', 'role', 'rows', 'rowspan', 'spellcheck', 'scope', 'selected', 'shape', 'size', 'sizes', 'span', 'srclang', 'start', 'src', 'srcset', 'step', 'style', 'summary', 'tabindex', 'title', 'translate', 'type', 'usemap', 'valign', 'value', 'width', 'xmlns', 'slot']);
  var svg = freeze(['accent-height', 'accumulate', 'additive', 'alignment-baseline', 'ascent', 'attributename', 'attributetype', 'azimuth', 'basefrequency', 'baseline-shift', 'begin', 'bias', 'by', 'class', 'clip', 'clippathunits', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cx', 'cy', 'd', 'dx', 'dy', 'diffuseconstant', 'direction', 'display', 'divisor', 'dur', 'edgemode', 'elevation', 'end', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'filterunits', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'fx', 'fy', 'g1', 'g2', 'glyph-name', 'glyphref', 'gradientunits', 'gradienttransform', 'height', 'href', 'id', 'image-rendering', 'in', 'in2', 'k', 'k1', 'k2', 'k3', 'k4', 'kerning', 'keypoints', 'keysplines', 'keytimes', 'lang', 'lengthadjust', 'letter-spacing', 'kernelmatrix', 'kernelunitlength', 'lighting-color', 'local', 'marker-end', 'marker-mid', 'marker-start', 'markerheight', 'markerunits', 'markerwidth', 'maskcontentunits', 'maskunits', 'max', 'mask', 'media', 'method', 'mode', 'min', 'name', 'numoctaves', 'offset', 'operator', 'opacity', 'order', 'orient', 'orientation', 'origin', 'overflow', 'paint-order', 'path', 'pathlength', 'patterncontentunits', 'patterntransform', 'patternunits', 'points', 'preservealpha', 'preserveaspectratio', 'primitiveunits', 'r', 'rx', 'ry', 'radius', 'refx', 'refy', 'repeatcount', 'repeatdur', 'restart', 'result', 'rotate', 'scale', 'seed', 'shape-rendering', 'specularconstant', 'specularexponent', 'spreadmethod', 'startoffset', 'stddeviation', 'stitchtiles', 'stop-color', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke', 'stroke-width', 'style', 'surfacescale', 'systemlanguage', 'tabindex', 'targetx', 'targety', 'transform', 'transform-origin', 'text-anchor', 'text-decoration', 'text-rendering', 'textlength', 'type', 'u1', 'u2', 'unicode', 'values', 'viewbox', 'visibility', 'version', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'width', 'word-spacing', 'wrap', 'writing-mode', 'xchannelselector', 'ychannelselector', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2', 'z', 'zoomandpan']);
  var mathMl = freeze(['accent', 'accentunder', 'align', 'bevelled', 'close', 'columnsalign', 'columnlines', 'columnspan', 'denomalign', 'depth', 'dir', 'display', 'displaystyle', 'encoding', 'fence', 'frame', 'height', 'href', 'id', 'largeop', 'length', 'linethickness', 'lspace', 'lquote', 'mathbackground', 'mathcolor', 'mathsize', 'mathvariant', 'maxsize', 'minsize', 'movablelimits', 'notation', 'numalign', 'open', 'rowalign', 'rowlines', 'rowspacing', 'rowspan', 'rspace', 'rquote', 'scriptlevel', 'scriptminsize', 'scriptsizemultiplier', 'selection', 'separator', 'separators', 'stretchy', 'subscriptshift', 'supscriptshift', 'symmetric', 'voffset', 'width', 'xmlns']);
  var xml = freeze(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);

  var MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm); // Specify template detection regex for SAFE_FOR_TEMPLATES mode

  var ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
  var TMPLIT_EXPR = seal(/\${[\w\W]*}/gm);
  var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/); // eslint-disable-line no-useless-escape

  var ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape

  var IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
  );
  var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
  var ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g // eslint-disable-line no-control-regex
  );
  var DOCTYPE_NAME = seal(/^html$/i);

  var getGlobal = function getGlobal() {
    return typeof window === 'undefined' ? null : window;
  };
  /**
   * Creates a no-op policy for internal use only.
   * Don't export this function outside this module!
   * @param {?TrustedTypePolicyFactory} trustedTypes The policy factory.
   * @param {Document} document The document object (to determine policy name suffix)
   * @return {?TrustedTypePolicy} The policy created (or null, if Trusted Types
   * are not supported).
   */


  var _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, document) {
    if (_typeof(trustedTypes) !== 'object' || typeof trustedTypes.createPolicy !== 'function') {
      return null;
    } // Allow the callers to control the unique policy name
    // by adding a data-tt-policy-suffix to the script element with the DOMPurify.
    // Policy creation with duplicate names throws in Trusted Types.


    var suffix = null;
    var ATTR_NAME = 'data-tt-policy-suffix';

    if (document.currentScript && document.currentScript.hasAttribute(ATTR_NAME)) {
      suffix = document.currentScript.getAttribute(ATTR_NAME);
    }

    var policyName = 'dompurify' + (suffix ? '#' + suffix : '');

    try {
      return trustedTypes.createPolicy(policyName, {
        createHTML: function createHTML(html) {
          return html;
        },
        createScriptURL: function createScriptURL(scriptUrl) {
          return scriptUrl;
        }
      });
    } catch (_) {
      // Policy creation failed (most likely another DOMPurify script has
      // already run). Skip creating the policy, as this will only cause errors
      // if TT are enforced.
      console.warn('TrustedTypes policy ' + policyName + ' could not be created.');
      return null;
    }
  };

  function createDOMPurify() {
    var window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getGlobal();

    var DOMPurify = function DOMPurify(root) {
      return createDOMPurify(root);
    };
    /**
     * Version label, exposed for easier checks
     * if DOMPurify is up to date or not
     */


    DOMPurify.version = '2.4.1';
    /**
     * Array of elements that DOMPurify removed during sanitation.
     * Empty if nothing was removed.
     */

    DOMPurify.removed = [];

    if (!window || !window.document || window.document.nodeType !== 9) {
      // Not running in a browser, provide a factory function
      // so that you can pass your own Window
      DOMPurify.isSupported = false;
      return DOMPurify;
    }

    var originalDocument = window.document;
    var document = window.document;
    var DocumentFragment = window.DocumentFragment,
        HTMLTemplateElement = window.HTMLTemplateElement,
        Node = window.Node,
        Element = window.Element,
        NodeFilter = window.NodeFilter,
        _window$NamedNodeMap = window.NamedNodeMap,
        NamedNodeMap = _window$NamedNodeMap === void 0 ? window.NamedNodeMap || window.MozNamedAttrMap : _window$NamedNodeMap,
        HTMLFormElement = window.HTMLFormElement,
        DOMParser = window.DOMParser,
        trustedTypes = window.trustedTypes;
    var ElementPrototype = Element.prototype;
    var cloneNode = lookupGetter(ElementPrototype, 'cloneNode');
    var getNextSibling = lookupGetter(ElementPrototype, 'nextSibling');
    var getChildNodes = lookupGetter(ElementPrototype, 'childNodes');
    var getParentNode = lookupGetter(ElementPrototype, 'parentNode'); // As per issue #47, the web-components registry is inherited by a
    // new document created via createHTMLDocument. As per the spec
    // (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
    // a new empty registry is used when creating a template contents owner
    // document, so we use that as our parent document to ensure nothing
    // is inherited.

    if (typeof HTMLTemplateElement === 'function') {
      var template = document.createElement('template');

      if (template.content && template.content.ownerDocument) {
        document = template.content.ownerDocument;
      }
    }

    var trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, originalDocument);

    var emptyHTML = trustedTypesPolicy ? trustedTypesPolicy.createHTML('') : '';
    var _document = document,
        implementation = _document.implementation,
        createNodeIterator = _document.createNodeIterator,
        createDocumentFragment = _document.createDocumentFragment,
        getElementsByTagName = _document.getElementsByTagName;
    var importNode = originalDocument.importNode;
    var documentMode = {};

    try {
      documentMode = clone(document).documentMode ? document.documentMode : {};
    } catch (_) {}

    var hooks = {};
    /**
     * Expose whether this browser supports running the full DOMPurify.
     */

    DOMPurify.isSupported = typeof getParentNode === 'function' && implementation && typeof implementation.createHTMLDocument !== 'undefined' && documentMode !== 9;
    var MUSTACHE_EXPR$1 = MUSTACHE_EXPR,
        ERB_EXPR$1 = ERB_EXPR,
        TMPLIT_EXPR$1 = TMPLIT_EXPR,
        DATA_ATTR$1 = DATA_ATTR,
        ARIA_ATTR$1 = ARIA_ATTR,
        IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA,
        ATTR_WHITESPACE$1 = ATTR_WHITESPACE;
    var IS_ALLOWED_URI$1 = IS_ALLOWED_URI;
    /**
     * We consider the elements and attributes below to be safe. Ideally
     * don't add any new ones but feel free to remove unwanted ones.
     */

    /* allowed element names */

    var ALLOWED_TAGS = null;
    var DEFAULT_ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray(html$1), _toConsumableArray(svg$1), _toConsumableArray(svgFilters), _toConsumableArray(mathMl$1), _toConsumableArray(text)));
    /* Allowed attribute names */

    var ALLOWED_ATTR = null;
    var DEFAULT_ALLOWED_ATTR = addToSet({}, [].concat(_toConsumableArray(html), _toConsumableArray(svg), _toConsumableArray(mathMl), _toConsumableArray(xml)));
    /*
     * Configure how DOMPUrify should handle custom elements and their attributes as well as customized built-in elements.
     * @property {RegExp|Function|null} tagNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any custom elements)
     * @property {RegExp|Function|null} attributeNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any attributes not on the allow list)
     * @property {boolean} allowCustomizedBuiltInElements allow custom elements derived from built-ins if they pass CUSTOM_ELEMENT_HANDLING.tagNameCheck. Default: `false`.
     */

    var CUSTOM_ELEMENT_HANDLING = Object.seal(Object.create(null, {
      tagNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      allowCustomizedBuiltInElements: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: false
      }
    }));
    /* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */

    var FORBID_TAGS = null;
    /* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */

    var FORBID_ATTR = null;
    /* Decide if ARIA attributes are okay */

    var ALLOW_ARIA_ATTR = true;
    /* Decide if custom data attributes are okay */

    var ALLOW_DATA_ATTR = true;
    /* Decide if unknown protocols are okay */

    var ALLOW_UNKNOWN_PROTOCOLS = false;
    /* Output should be safe for common template engines.
     * This means, DOMPurify removes data attributes, mustaches and ERB
     */

    var SAFE_FOR_TEMPLATES = false;
    /* Decide if document with <html>... should be returned */

    var WHOLE_DOCUMENT = false;
    /* Track whether config is already set on this instance of DOMPurify. */

    var SET_CONFIG = false;
    /* Decide if all elements (e.g. style, script) must be children of
     * document.body. By default, browsers might move them to document.head */

    var FORCE_BODY = false;
    /* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
     * string (or a TrustedHTML object if Trusted Types are supported).
     * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
     */

    var RETURN_DOM = false;
    /* Decide if a DOM `DocumentFragment` should be returned, instead of a html
     * string  (or a TrustedHTML object if Trusted Types are supported) */

    var RETURN_DOM_FRAGMENT = false;
    /* Try to return a Trusted Type object instead of a string, return a string in
     * case Trusted Types are not supported  */

    var RETURN_TRUSTED_TYPE = false;
    /* Output should be free from DOM clobbering attacks?
     * This sanitizes markups named with colliding, clobberable built-in DOM APIs.
     */

    var SANITIZE_DOM = true;
    /* Achieve full DOM Clobbering protection by isolating the namespace of named
     * properties and JS variables, mitigating attacks that abuse the HTML/DOM spec rules.
     *
     * HTML/DOM spec rules that enable DOM Clobbering:
     *   - Named Access on Window (§7.3.3)
     *   - DOM Tree Accessors (§3.1.5)
     *   - Form Element Parent-Child Relations (§4.10.3)
     *   - Iframe srcdoc / Nested WindowProxies (§4.8.5)
     *   - HTMLCollection (§4.2.10.2)
     *
     * Namespace isolation is implemented by prefixing `id` and `name` attributes
     * with a constant string, i.e., `user-content-`
     */

    var SANITIZE_NAMED_PROPS = false;
    var SANITIZE_NAMED_PROPS_PREFIX = 'user-content-';
    /* Keep element content when removing element? */

    var KEEP_CONTENT = true;
    /* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
     * of importing it into a new Document and returning a sanitized copy */

    var IN_PLACE = false;
    /* Allow usage of profiles like html, svg and mathMl */

    var USE_PROFILES = {};
    /* Tags to ignore content of when KEEP_CONTENT is true */

    var FORBID_CONTENTS = null;
    var DEFAULT_FORBID_CONTENTS = addToSet({}, ['annotation-xml', 'audio', 'colgroup', 'desc', 'foreignobject', 'head', 'iframe', 'math', 'mi', 'mn', 'mo', 'ms', 'mtext', 'noembed', 'noframes', 'noscript', 'plaintext', 'script', 'style', 'svg', 'template', 'thead', 'title', 'video', 'xmp']);
    /* Tags that are safe for data: URIs */

    var DATA_URI_TAGS = null;
    var DEFAULT_DATA_URI_TAGS = addToSet({}, ['audio', 'video', 'img', 'source', 'image', 'track']);
    /* Attributes safe for values like "javascript:" */

    var URI_SAFE_ATTRIBUTES = null;
    var DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ['alt', 'class', 'for', 'id', 'label', 'name', 'pattern', 'placeholder', 'role', 'summary', 'title', 'value', 'style', 'xmlns']);
    var MATHML_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
    var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    var HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
    /* Document namespace */

    var NAMESPACE = HTML_NAMESPACE;
    var IS_EMPTY_INPUT = false;
    /* Allowed XHTML+XML namespaces */

    var ALLOWED_NAMESPACES = null;
    var DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
    /* Parsing of strict XHTML documents */

    var PARSER_MEDIA_TYPE;
    var SUPPORTED_PARSER_MEDIA_TYPES = ['application/xhtml+xml', 'text/html'];
    var DEFAULT_PARSER_MEDIA_TYPE = 'text/html';
    var transformCaseFunc;
    /* Keep a reference to config to pass to hooks */

    var CONFIG = null;
    /* Ideally, do not touch anything below this line */

    /* ______________________________________________ */

    var formElement = document.createElement('form');

    var isRegexOrFunction = function isRegexOrFunction(testValue) {
      return testValue instanceof RegExp || testValue instanceof Function;
    };
    /**
     * _parseConfig
     *
     * @param  {Object} cfg optional config literal
     */
    // eslint-disable-next-line complexity


    var _parseConfig = function _parseConfig(cfg) {
      if (CONFIG && CONFIG === cfg) {
        return;
      }
      /* Shield configuration object from tampering */


      if (!cfg || _typeof(cfg) !== 'object') {
        cfg = {};
      }
      /* Shield configuration object from prototype pollution */


      cfg = clone(cfg);
      PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
      SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? PARSER_MEDIA_TYPE = DEFAULT_PARSER_MEDIA_TYPE : PARSER_MEDIA_TYPE = cfg.PARSER_MEDIA_TYPE; // HTML tags and attributes are not case-sensitive, converting to lowercase. Keeping XHTML as is.

      transformCaseFunc = PARSER_MEDIA_TYPE === 'application/xhtml+xml' ? stringToString : stringToLowerCase;
      /* Set configuration parameters */

      ALLOWED_TAGS = 'ALLOWED_TAGS' in cfg ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
      ALLOWED_ATTR = 'ALLOWED_ATTR' in cfg ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
      ALLOWED_NAMESPACES = 'ALLOWED_NAMESPACES' in cfg ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
      URI_SAFE_ATTRIBUTES = 'ADD_URI_SAFE_ATTR' in cfg ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), // eslint-disable-line indent
      cfg.ADD_URI_SAFE_ATTR, // eslint-disable-line indent
      transformCaseFunc // eslint-disable-line indent
      ) // eslint-disable-line indent
      : DEFAULT_URI_SAFE_ATTRIBUTES;
      DATA_URI_TAGS = 'ADD_DATA_URI_TAGS' in cfg ? addToSet(clone(DEFAULT_DATA_URI_TAGS), // eslint-disable-line indent
      cfg.ADD_DATA_URI_TAGS, // eslint-disable-line indent
      transformCaseFunc // eslint-disable-line indent
      ) // eslint-disable-line indent
      : DEFAULT_DATA_URI_TAGS;
      FORBID_CONTENTS = 'FORBID_CONTENTS' in cfg ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
      FORBID_TAGS = 'FORBID_TAGS' in cfg ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : {};
      FORBID_ATTR = 'FORBID_ATTR' in cfg ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : {};
      USE_PROFILES = 'USE_PROFILES' in cfg ? cfg.USE_PROFILES : false;
      ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true

      ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true

      ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false

      SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false

      WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false

      RETURN_DOM = cfg.RETURN_DOM || false; // Default false

      RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false

      RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false

      FORCE_BODY = cfg.FORCE_BODY || false; // Default false

      SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true

      SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false; // Default false

      KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true

      IN_PLACE = cfg.IN_PLACE || false; // Default false

      IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI$1;
      NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;

      if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
      }

      if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
      }

      if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === 'boolean') {
        CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
      }

      if (SAFE_FOR_TEMPLATES) {
        ALLOW_DATA_ATTR = false;
      }

      if (RETURN_DOM_FRAGMENT) {
        RETURN_DOM = true;
      }
      /* Parse profile info */


      if (USE_PROFILES) {
        ALLOWED_TAGS = addToSet({}, _toConsumableArray(text));
        ALLOWED_ATTR = [];

        if (USE_PROFILES.html === true) {
          addToSet(ALLOWED_TAGS, html$1);
          addToSet(ALLOWED_ATTR, html);
        }

        if (USE_PROFILES.svg === true) {
          addToSet(ALLOWED_TAGS, svg$1);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }

        if (USE_PROFILES.svgFilters === true) {
          addToSet(ALLOWED_TAGS, svgFilters);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }

        if (USE_PROFILES.mathMl === true) {
          addToSet(ALLOWED_TAGS, mathMl$1);
          addToSet(ALLOWED_ATTR, mathMl);
          addToSet(ALLOWED_ATTR, xml);
        }
      }
      /* Merge configuration parameters */


      if (cfg.ADD_TAGS) {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }

        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
      }

      if (cfg.ADD_ATTR) {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }

        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
      }

      if (cfg.ADD_URI_SAFE_ATTR) {
        addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
      }

      if (cfg.FORBID_CONTENTS) {
        if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
          FORBID_CONTENTS = clone(FORBID_CONTENTS);
        }

        addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
      }
      /* Add #text in case KEEP_CONTENT is set to true */


      if (KEEP_CONTENT) {
        ALLOWED_TAGS['#text'] = true;
      }
      /* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */


      if (WHOLE_DOCUMENT) {
        addToSet(ALLOWED_TAGS, ['html', 'head', 'body']);
      }
      /* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */


      if (ALLOWED_TAGS.table) {
        addToSet(ALLOWED_TAGS, ['tbody']);
        delete FORBID_TAGS.tbody;
      } // Prevent further manipulation of configuration.
      // Not available in IE8, Safari 5, etc.


      if (freeze) {
        freeze(cfg);
      }

      CONFIG = cfg;
    };

    var MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ['mi', 'mo', 'mn', 'ms', 'mtext']);
    var HTML_INTEGRATION_POINTS = addToSet({}, ['foreignobject', 'desc', 'title', 'annotation-xml']); // Certain elements are allowed in both SVG and HTML
    // namespace. We need to specify them explicitly
    // so that they don't get erroneously deleted from
    // HTML namespace.

    var COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ['title', 'style', 'font', 'a', 'script']);
    /* Keep track of all possible SVG and MathML tags
     * so that we can perform the namespace checks
     * correctly. */

    var ALL_SVG_TAGS = addToSet({}, svg$1);
    addToSet(ALL_SVG_TAGS, svgFilters);
    addToSet(ALL_SVG_TAGS, svgDisallowed);
    var ALL_MATHML_TAGS = addToSet({}, mathMl$1);
    addToSet(ALL_MATHML_TAGS, mathMlDisallowed);
    /**
     *
     *
     * @param  {Element} element a DOM element whose namespace is being checked
     * @returns {boolean} Return false if the element has a
     *  namespace that a spec-compliant parser would never
     *  return. Return true otherwise.
     */

    var _checkValidNamespace = function _checkValidNamespace(element) {
      var parent = getParentNode(element); // In JSDOM, if we're inside shadow DOM, then parentNode
      // can be null. We just simulate parent in this case.

      if (!parent || !parent.tagName) {
        parent = {
          namespaceURI: NAMESPACE,
          tagName: 'template'
        };
      }

      var tagName = stringToLowerCase(element.tagName);
      var parentTagName = stringToLowerCase(parent.tagName);

      if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
        return false;
      }

      if (element.namespaceURI === SVG_NAMESPACE) {
        // The only way to switch from HTML namespace to SVG
        // is via <svg>. If it happens via any other tag, then
        // it should be killed.
        if (parent.namespaceURI === HTML_NAMESPACE) {
          return tagName === 'svg';
        } // The only way to switch from MathML to SVG is via`
        // svg if parent is either <annotation-xml> or MathML
        // text integration points.


        if (parent.namespaceURI === MATHML_NAMESPACE) {
          return tagName === 'svg' && (parentTagName === 'annotation-xml' || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
        } // We only allow elements that are defined in SVG
        // spec. All others are disallowed in SVG namespace.


        return Boolean(ALL_SVG_TAGS[tagName]);
      }

      if (element.namespaceURI === MATHML_NAMESPACE) {
        // The only way to switch from HTML namespace to MathML
        // is via <math>. If it happens via any other tag, then
        // it should be killed.
        if (parent.namespaceURI === HTML_NAMESPACE) {
          return tagName === 'math';
        } // The only way to switch from SVG to MathML is via
        // <math> and HTML integration points


        if (parent.namespaceURI === SVG_NAMESPACE) {
          return tagName === 'math' && HTML_INTEGRATION_POINTS[parentTagName];
        } // We only allow elements that are defined in MathML
        // spec. All others are disallowed in MathML namespace.


        return Boolean(ALL_MATHML_TAGS[tagName]);
      }

      if (element.namespaceURI === HTML_NAMESPACE) {
        // The only way to switch from SVG to HTML is via
        // HTML integration points, and from MathML to HTML
        // is via MathML text integration points
        if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
          return false;
        }

        if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
          return false;
        } // We disallow tags that are specific for MathML
        // or SVG and should never appear in HTML namespace


        return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
      } // For XHTML and XML documents that support custom namespaces


      if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && ALLOWED_NAMESPACES[element.namespaceURI]) {
        return true;
      } // The code should never reach this place (this means
      // that the element somehow got namespace that is not
      // HTML, SVG, MathML or allowed via ALLOWED_NAMESPACES).
      // Return false just in case.


      return false;
    };
    /**
     * _forceRemove
     *
     * @param  {Node} node a DOM node
     */


    var _forceRemove = function _forceRemove(node) {
      arrayPush(DOMPurify.removed, {
        element: node
      });

      try {
        // eslint-disable-next-line unicorn/prefer-dom-node-remove
        node.parentNode.removeChild(node);
      } catch (_) {
        try {
          node.outerHTML = emptyHTML;
        } catch (_) {
          node.remove();
        }
      }
    };
    /**
     * _removeAttribute
     *
     * @param  {String} name an Attribute name
     * @param  {Node} node a DOM node
     */


    var _removeAttribute = function _removeAttribute(name, node) {
      try {
        arrayPush(DOMPurify.removed, {
          attribute: node.getAttributeNode(name),
          from: node
        });
      } catch (_) {
        arrayPush(DOMPurify.removed, {
          attribute: null,
          from: node
        });
      }

      node.removeAttribute(name); // We void attribute values for unremovable "is"" attributes

      if (name === 'is' && !ALLOWED_ATTR[name]) {
        if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
          try {
            _forceRemove(node);
          } catch (_) {}
        } else {
          try {
            node.setAttribute(name, '');
          } catch (_) {}
        }
      }
    };
    /**
     * _initDocument
     *
     * @param  {String} dirty a string of dirty markup
     * @return {Document} a DOM, filled with the dirty markup
     */


    var _initDocument = function _initDocument(dirty) {
      /* Create a HTML document */
      var doc;
      var leadingWhitespace;

      if (FORCE_BODY) {
        dirty = '<remove></remove>' + dirty;
      } else {
        /* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
        var matches = stringMatch(dirty, /^[\r\n\t ]+/);
        leadingWhitespace = matches && matches[0];
      }

      if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && NAMESPACE === HTML_NAMESPACE) {
        // Root of XHTML doc must contain xmlns declaration (see https://www.w3.org/TR/xhtml1/normative.html#strict)
        dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + '</body></html>';
      }

      var dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
      /*
       * Use the DOMParser API by default, fallback later if needs be
       * DOMParser not work for svg when has multiple root element.
       */

      if (NAMESPACE === HTML_NAMESPACE) {
        try {
          doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
        } catch (_) {}
      }
      /* Use createHTMLDocument in case DOMParser is not available */


      if (!doc || !doc.documentElement) {
        doc = implementation.createDocument(NAMESPACE, 'template', null);

        try {
          doc.documentElement.innerHTML = IS_EMPTY_INPUT ? '' : dirtyPayload;
        } catch (_) {// Syntax error if dirtyPayload is invalid xml
        }
      }

      var body = doc.body || doc.documentElement;

      if (dirty && leadingWhitespace) {
        body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
      }
      /* Work on whole document or just its body */


      if (NAMESPACE === HTML_NAMESPACE) {
        return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
      }

      return WHOLE_DOCUMENT ? doc.documentElement : body;
    };
    /**
     * _createIterator
     *
     * @param  {Document} root document/fragment to create iterator for
     * @return {Iterator} iterator instance
     */


    var _createIterator = function _createIterator(root) {
      return createNodeIterator.call(root.ownerDocument || root, root, // eslint-disable-next-line no-bitwise
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT, null, false);
    };
    /**
     * _isClobbered
     *
     * @param  {Node} elm element to check for clobbering attacks
     * @return {Boolean} true if clobbered, false if safe
     */


    var _isClobbered = function _isClobbered(elm) {
      return elm instanceof HTMLFormElement && (typeof elm.nodeName !== 'string' || typeof elm.textContent !== 'string' || typeof elm.removeChild !== 'function' || !(elm.attributes instanceof NamedNodeMap) || typeof elm.removeAttribute !== 'function' || typeof elm.setAttribute !== 'function' || typeof elm.namespaceURI !== 'string' || typeof elm.insertBefore !== 'function' || typeof elm.hasChildNodes !== 'function');
    };
    /**
     * _isNode
     *
     * @param  {Node} obj object to check whether it's a DOM node
     * @return {Boolean} true is object is a DOM node
     */


    var _isNode = function _isNode(object) {
      return _typeof(Node) === 'object' ? object instanceof Node : object && _typeof(object) === 'object' && typeof object.nodeType === 'number' && typeof object.nodeName === 'string';
    };
    /**
     * _executeHook
     * Execute user configurable hooks
     *
     * @param  {String} entryPoint  Name of the hook's entry point
     * @param  {Node} currentNode node to work on with the hook
     * @param  {Object} data additional hook parameters
     */


    var _executeHook = function _executeHook(entryPoint, currentNode, data) {
      if (!hooks[entryPoint]) {
        return;
      }

      arrayForEach(hooks[entryPoint], function (hook) {
        hook.call(DOMPurify, currentNode, data, CONFIG);
      });
    };
    /**
     * _sanitizeElements
     *
     * @protect nodeName
     * @protect textContent
     * @protect removeChild
     *
     * @param   {Node} currentNode to check for permission to exist
     * @return  {Boolean} true if node was killed, false if left alive
     */


    var _sanitizeElements = function _sanitizeElements(currentNode) {
      var content;
      /* Execute a hook if present */

      _executeHook('beforeSanitizeElements', currentNode, null);
      /* Check if element is clobbered or can clobber */


      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);

        return true;
      }
      /* Check if tagname contains Unicode */


      if (regExpTest(/[\u0080-\uFFFF]/, currentNode.nodeName)) {
        _forceRemove(currentNode);

        return true;
      }
      /* Now let's check the element's type and name */


      var tagName = transformCaseFunc(currentNode.nodeName);
      /* Execute a hook if present */

      _executeHook('uponSanitizeElement', currentNode, {
        tagName: tagName,
        allowedTags: ALLOWED_TAGS
      });
      /* Detect mXSS attempts abusing namespace confusion */


      if (currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && (!_isNode(currentNode.content) || !_isNode(currentNode.content.firstElementChild)) && regExpTest(/<[/\w]/g, currentNode.innerHTML) && regExpTest(/<[/\w]/g, currentNode.textContent)) {
        _forceRemove(currentNode);

        return true;
      }
      /* Mitigate a problem with templates inside select */


      if (tagName === 'select' && regExpTest(/<template/i, currentNode.innerHTML)) {
        _forceRemove(currentNode);

        return true;
      }
      /* Remove element if anything forbids its presence */


      if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
        /* Check if we have a custom element to handle */
        if (!FORBID_TAGS[tagName] && _basicCustomElementTest(tagName)) {
          if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) return false;
          if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) return false;
        }
        /* Keep content except for bad-listed elements */


        if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
          var parentNode = getParentNode(currentNode) || currentNode.parentNode;
          var childNodes = getChildNodes(currentNode) || currentNode.childNodes;

          if (childNodes && parentNode) {
            var childCount = childNodes.length;

            for (var i = childCount - 1; i >= 0; --i) {
              parentNode.insertBefore(cloneNode(childNodes[i], true), getNextSibling(currentNode));
            }
          }
        }

        _forceRemove(currentNode);

        return true;
      }
      /* Check whether element has a valid namespace */


      if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
        _forceRemove(currentNode);

        return true;
      }

      if ((tagName === 'noscript' || tagName === 'noembed') && regExpTest(/<\/no(script|embed)/i, currentNode.innerHTML)) {
        _forceRemove(currentNode);

        return true;
      }
      /* Sanitize element content to be template-safe */


      if (SAFE_FOR_TEMPLATES && currentNode.nodeType === 3) {
        /* Get the element's text content */
        content = currentNode.textContent;
        content = stringReplace(content, MUSTACHE_EXPR$1, ' ');
        content = stringReplace(content, ERB_EXPR$1, ' ');
        content = stringReplace(content, TMPLIT_EXPR$1, ' ');

        if (currentNode.textContent !== content) {
          arrayPush(DOMPurify.removed, {
            element: currentNode.cloneNode()
          });
          currentNode.textContent = content;
        }
      }
      /* Execute a hook if present */


      _executeHook('afterSanitizeElements', currentNode, null);

      return false;
    };
    /**
     * _isValidAttribute
     *
     * @param  {string} lcTag Lowercase tag name of containing element.
     * @param  {string} lcName Lowercase attribute name.
     * @param  {string} value Attribute value.
     * @return {Boolean} Returns true if `value` is valid, otherwise false.
     */
    // eslint-disable-next-line complexity


    var _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
      /* Make sure attribute cannot clobber */
      if (SANITIZE_DOM && (lcName === 'id' || lcName === 'name') && (value in document || value in formElement)) {
        return false;
      }
      /* Allow valid data-* attributes: At least one character after "-"
          (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
          XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
          We don't need to check the value; it's always URI safe. */


      if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR$1, lcName)) ; else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName)) ; else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
        if ( // First condition does a very basic check if a) it's basically a valid custom element tagname AND
        // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
        _basicCustomElementTest(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName)) || // Alternative, second condition checks if it's an `is`-attribute, AND
        // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        lcName === 'is' && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))) ; else {
          return false;
        }
        /* Check value is safe. First, is attr inert? If so, is safe */

      } else if (URI_SAFE_ATTRIBUTES[lcName]) ; else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE$1, ''))) ; else if ((lcName === 'src' || lcName === 'xlink:href' || lcName === 'href') && lcTag !== 'script' && stringIndexOf(value, 'data:') === 0 && DATA_URI_TAGS[lcTag]) ; else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, stringReplace(value, ATTR_WHITESPACE$1, ''))) ; else if (!value) ; else {
        return false;
      }

      return true;
    };
    /**
     * _basicCustomElementCheck
     * checks if at least one dash is included in tagName, and it's not the first char
     * for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
     * @param {string} tagName name of the tag of the node to sanitize
     */


    var _basicCustomElementTest = function _basicCustomElementTest(tagName) {
      return tagName.indexOf('-') > 0;
    };
    /**
     * _sanitizeAttributes
     *
     * @protect attributes
     * @protect nodeName
     * @protect removeAttribute
     * @protect setAttribute
     *
     * @param  {Node} currentNode to sanitize
     */


    var _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
      var attr;
      var value;
      var lcName;
      var l;
      /* Execute a hook if present */

      _executeHook('beforeSanitizeAttributes', currentNode, null);

      var attributes = currentNode.attributes;
      /* Check if we have attributes; if not we might have a text node */

      if (!attributes) {
        return;
      }

      var hookEvent = {
        attrName: '',
        attrValue: '',
        keepAttr: true,
        allowedAttributes: ALLOWED_ATTR
      };
      l = attributes.length;
      /* Go backwards over all attributes; safely remove bad ones */

      while (l--) {
        attr = attributes[l];
        var _attr = attr,
            name = _attr.name,
            namespaceURI = _attr.namespaceURI;
        value = name === 'value' ? attr.value : stringTrim(attr.value);
        lcName = transformCaseFunc(name);
        /* Execute a hook if present */

        hookEvent.attrName = lcName;
        hookEvent.attrValue = value;
        hookEvent.keepAttr = true;
        hookEvent.forceKeepAttr = undefined; // Allows developers to see this is a property they can set

        _executeHook('uponSanitizeAttribute', currentNode, hookEvent);

        value = hookEvent.attrValue;
        /* Did the hooks approve of the attribute? */

        if (hookEvent.forceKeepAttr) {
          continue;
        }
        /* Remove attribute */


        _removeAttribute(name, currentNode);
        /* Did the hooks approve of the attribute? */


        if (!hookEvent.keepAttr) {
          continue;
        }
        /* Work around a security issue in jQuery 3.0 */


        if (regExpTest(/\/>/i, value)) {
          _removeAttribute(name, currentNode);

          continue;
        }
        /* Sanitize attribute content to be template-safe */


        if (SAFE_FOR_TEMPLATES) {
          value = stringReplace(value, MUSTACHE_EXPR$1, ' ');
          value = stringReplace(value, ERB_EXPR$1, ' ');
          value = stringReplace(value, TMPLIT_EXPR$1, ' ');
        }
        /* Is `value` valid for this attribute? */


        var lcTag = transformCaseFunc(currentNode.nodeName);

        if (!_isValidAttribute(lcTag, lcName, value)) {
          continue;
        }
        /* Full DOM Clobbering protection via namespace isolation,
         * Prefix id and name attributes with `user-content-`
         */


        if (SANITIZE_NAMED_PROPS && (lcName === 'id' || lcName === 'name')) {
          // Remove the attribute with this value
          _removeAttribute(name, currentNode); // Prefix the value and later re-create the attribute with the sanitized value


          value = SANITIZE_NAMED_PROPS_PREFIX + value;
        }
        /* Handle attributes that require Trusted Types */


        if (trustedTypesPolicy && _typeof(trustedTypes) === 'object' && typeof trustedTypes.getAttributeType === 'function') {
          if (namespaceURI) ; else {
            switch (trustedTypes.getAttributeType(lcTag, lcName)) {
              case 'TrustedHTML':
                value = trustedTypesPolicy.createHTML(value);
                break;

              case 'TrustedScriptURL':
                value = trustedTypesPolicy.createScriptURL(value);
                break;
            }
          }
        }
        /* Handle invalid data-* attribute set by try-catching it */


        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            /* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
            currentNode.setAttribute(name, value);
          }

          arrayPop(DOMPurify.removed);
        } catch (_) {}
      }
      /* Execute a hook if present */


      _executeHook('afterSanitizeAttributes', currentNode, null);
    };
    /**
     * _sanitizeShadowDOM
     *
     * @param  {DocumentFragment} fragment to iterate over recursively
     */


    var _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
      var shadowNode;

      var shadowIterator = _createIterator(fragment);
      /* Execute a hook if present */


      _executeHook('beforeSanitizeShadowDOM', fragment, null);

      while (shadowNode = shadowIterator.nextNode()) {
        /* Execute a hook if present */
        _executeHook('uponSanitizeShadowNode', shadowNode, null);
        /* Sanitize tags and elements */


        if (_sanitizeElements(shadowNode)) {
          continue;
        }
        /* Deep shadow DOM detected */


        if (shadowNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM(shadowNode.content);
        }
        /* Check attributes, sanitize if necessary */


        _sanitizeAttributes(shadowNode);
      }
      /* Execute a hook if present */


      _executeHook('afterSanitizeShadowDOM', fragment, null);
    };
    /**
     * Sanitize
     * Public method providing core sanitation functionality
     *
     * @param {String|Node} dirty string or DOM node
     * @param {Object} configuration object
     */
    // eslint-disable-next-line complexity


    DOMPurify.sanitize = function (dirty) {
      var cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var body;
      var importedNode;
      var currentNode;
      var oldNode;
      var returnNode;
      /* Make sure we have a string to sanitize.
        DO NOT return early, as this will return the wrong type if
        the user has requested a DOM object rather than a string */

      IS_EMPTY_INPUT = !dirty;

      if (IS_EMPTY_INPUT) {
        dirty = '<!-->';
      }
      /* Stringify, in case dirty is an object */


      if (typeof dirty !== 'string' && !_isNode(dirty)) {
        // eslint-disable-next-line no-negated-condition
        if (typeof dirty.toString !== 'function') {
          throw typeErrorCreate('toString is not a function');
        } else {
          dirty = dirty.toString();

          if (typeof dirty !== 'string') {
            throw typeErrorCreate('dirty is not a string, aborting');
          }
        }
      }
      /* Check we can run. Otherwise fall back or ignore */


      if (!DOMPurify.isSupported) {
        if (_typeof(window.toStaticHTML) === 'object' || typeof window.toStaticHTML === 'function') {
          if (typeof dirty === 'string') {
            return window.toStaticHTML(dirty);
          }

          if (_isNode(dirty)) {
            return window.toStaticHTML(dirty.outerHTML);
          }
        }

        return dirty;
      }
      /* Assign config vars */


      if (!SET_CONFIG) {
        _parseConfig(cfg);
      }
      /* Clean up removed elements */


      DOMPurify.removed = [];
      /* Check if dirty is correctly typed for IN_PLACE */

      if (typeof dirty === 'string') {
        IN_PLACE = false;
      }

      if (IN_PLACE) {
        /* Do some early pre-sanitization to avoid unsafe root nodes */
        if (dirty.nodeName) {
          var tagName = transformCaseFunc(dirty.nodeName);

          if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
            throw typeErrorCreate('root node is forbidden and cannot be sanitized in-place');
          }
        }
      } else if (dirty instanceof Node) {
        /* If dirty is a DOM element, append to an empty document to avoid
           elements being stripped by the parser */
        body = _initDocument('<!---->');
        importedNode = body.ownerDocument.importNode(dirty, true);

        if (importedNode.nodeType === 1 && importedNode.nodeName === 'BODY') {
          /* Node is already a body, use as is */
          body = importedNode;
        } else if (importedNode.nodeName === 'HTML') {
          body = importedNode;
        } else {
          // eslint-disable-next-line unicorn/prefer-dom-node-append
          body.appendChild(importedNode);
        }
      } else {
        /* Exit directly if we have nothing to do */
        if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
        dirty.indexOf('<') === -1) {
          return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
        }
        /* Initialize the document to work on */


        body = _initDocument(dirty);
        /* Check we have a DOM node from the data */

        if (!body) {
          return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : '';
        }
      }
      /* Remove first element node (ours) if FORCE_BODY is set */


      if (body && FORCE_BODY) {
        _forceRemove(body.firstChild);
      }
      /* Get node iterator */


      var nodeIterator = _createIterator(IN_PLACE ? dirty : body);
      /* Now start iterating over the created document */


      while (currentNode = nodeIterator.nextNode()) {
        /* Fix IE's strange behavior with manipulated textNodes #89 */
        if (currentNode.nodeType === 3 && currentNode === oldNode) {
          continue;
        }
        /* Sanitize tags and elements */


        if (_sanitizeElements(currentNode)) {
          continue;
        }
        /* Shadow DOM detected, sanitize it */


        if (currentNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM(currentNode.content);
        }
        /* Check attributes, sanitize if necessary */


        _sanitizeAttributes(currentNode);

        oldNode = currentNode;
      }

      oldNode = null;
      /* If we sanitized `dirty` in-place, return it. */

      if (IN_PLACE) {
        return dirty;
      }
      /* Return sanitized string or DOM */


      if (RETURN_DOM) {
        if (RETURN_DOM_FRAGMENT) {
          returnNode = createDocumentFragment.call(body.ownerDocument);

          while (body.firstChild) {
            // eslint-disable-next-line unicorn/prefer-dom-node-append
            returnNode.appendChild(body.firstChild);
          }
        } else {
          returnNode = body;
        }

        if (ALLOWED_ATTR.shadowroot) {
          /*
            AdoptNode() is not used because internal state is not reset
            (e.g. the past names map of a HTMLFormElement), this is safe
            in theory but we would rather not risk another attack vector.
            The state that is cloned by importNode() is explicitly defined
            by the specs.
          */
          returnNode = importNode.call(originalDocument, returnNode, true);
        }

        return returnNode;
      }

      var serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
      /* Serialize doctype if allowed */

      if (WHOLE_DOCUMENT && ALLOWED_TAGS['!doctype'] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
        serializedHTML = '<!DOCTYPE ' + body.ownerDocument.doctype.name + '>\n' + serializedHTML;
      }
      /* Sanitize final string template-safe */


      if (SAFE_FOR_TEMPLATES) {
        serializedHTML = stringReplace(serializedHTML, MUSTACHE_EXPR$1, ' ');
        serializedHTML = stringReplace(serializedHTML, ERB_EXPR$1, ' ');
        serializedHTML = stringReplace(serializedHTML, TMPLIT_EXPR$1, ' ');
      }

      return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
    };
    /**
     * Public method to set the configuration once
     * setConfig
     *
     * @param {Object} cfg configuration object
     */


    DOMPurify.setConfig = function (cfg) {
      _parseConfig(cfg);

      SET_CONFIG = true;
    };
    /**
     * Public method to remove the configuration
     * clearConfig
     *
     */


    DOMPurify.clearConfig = function () {
      CONFIG = null;
      SET_CONFIG = false;
    };
    /**
     * Public method to check if an attribute value is valid.
     * Uses last set config, if any. Otherwise, uses config defaults.
     * isValidAttribute
     *
     * @param  {string} tag Tag name of containing element.
     * @param  {string} attr Attribute name.
     * @param  {string} value Attribute value.
     * @return {Boolean} Returns true if `value` is valid. Otherwise, returns false.
     */


    DOMPurify.isValidAttribute = function (tag, attr, value) {
      /* Initialize shared config vars if necessary. */
      if (!CONFIG) {
        _parseConfig({});
      }

      var lcTag = transformCaseFunc(tag);
      var lcName = transformCaseFunc(attr);
      return _isValidAttribute(lcTag, lcName, value);
    };
    /**
     * AddHook
     * Public method to add DOMPurify hooks
     *
     * @param {String} entryPoint entry point for the hook to add
     * @param {Function} hookFunction function to execute
     */


    DOMPurify.addHook = function (entryPoint, hookFunction) {
      if (typeof hookFunction !== 'function') {
        return;
      }

      hooks[entryPoint] = hooks[entryPoint] || [];
      arrayPush(hooks[entryPoint], hookFunction);
    };
    /**
     * RemoveHook
     * Public method to remove a DOMPurify hook at a given entryPoint
     * (pops it from the stack of hooks if more are present)
     *
     * @param {String} entryPoint entry point for the hook to remove
     * @return {Function} removed(popped) hook
     */


    DOMPurify.removeHook = function (entryPoint) {
      if (hooks[entryPoint]) {
        return arrayPop(hooks[entryPoint]);
      }
    };
    /**
     * RemoveHooks
     * Public method to remove all DOMPurify hooks at a given entryPoint
     *
     * @param  {String} entryPoint entry point for the hooks to remove
     */


    DOMPurify.removeHooks = function (entryPoint) {
      if (hooks[entryPoint]) {
        hooks[entryPoint] = [];
      }
    };
    /**
     * RemoveAllHooks
     * Public method to remove all DOMPurify hooks
     *
     */


    DOMPurify.removeAllHooks = function () {
      hooks = {};
    };

    return DOMPurify;
  }

  var purify = createDOMPurify();

  return purify;

}));
//# sourceMappingURL=purify.js.map


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

/***/ "./node_modules/sweetalert2/dist/sweetalert2.all.js":
/*!**********************************************************!*\
  !*** ./node_modules/sweetalert2/dist/sweetalert2.all.js ***!
  \**********************************************************/
/***/ (function(module) {

/*!
* sweetalert2 v8.19.0
* Released under the MIT License.
*/
(function (global, factory) {
	 true ? module.exports = factory() :
	0;
}(this, (function () { 'use strict';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

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
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

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
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

var consolePrefix = 'SweetAlert2:';
/**
 * Filter the unique values into a new array
 * @param arr
 */

var uniqueArray = function uniqueArray(arr) {
  var result = [];

  for (var i = 0; i < arr.length; i++) {
    if (result.indexOf(arr[i]) === -1) {
      result.push(arr[i]);
    }
  }

  return result;
};
/**
 * Returns the array ob object values (Object.values isn't supported in IE11)
 * @param obj
 */

var objectValues = function objectValues(obj) {
  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
};
/**
 * Convert NodeList to Array
 * @param nodeList
 */

var toArray = function toArray(nodeList) {
  return Array.prototype.slice.call(nodeList);
};
/**
 * Standardise console warnings
 * @param message
 */

var warn = function warn(message) {
  console.warn("".concat(consolePrefix, " ").concat(message));
};
/**
 * Standardise console errors
 * @param message
 */

var error = function error(message) {
  console.error("".concat(consolePrefix, " ").concat(message));
};
/**
 * Private global state for `warnOnce`
 * @type {Array}
 * @private
 */

var previousWarnOnceMessages = [];
/**
 * Show a console warning, but only if it hasn't already been shown
 * @param message
 */

var warnOnce = function warnOnce(message) {
  if (!(previousWarnOnceMessages.indexOf(message) !== -1)) {
    previousWarnOnceMessages.push(message);
    warn(message);
  }
};
/**
 * Show a one-time console warning about deprecated params/methods
 */

var warnAboutDepreation = function warnAboutDepreation(deprecatedParam, useInstead) {
  warnOnce("\"".concat(deprecatedParam, "\" is deprecated and will be removed in the next major release. Please use \"").concat(useInstead, "\" instead."));
};
/**
 * If `arg` is a function, call it (with no arguments or context) and return the result.
 * Otherwise, just pass the value through
 * @param arg
 */

var callIfFunction = function callIfFunction(arg) {
  return typeof arg === 'function' ? arg() : arg;
};
var isPromise = function isPromise(arg) {
  return arg && Promise.resolve(arg) === arg;
};

var DismissReason = Object.freeze({
  cancel: 'cancel',
  backdrop: 'backdrop',
  close: 'close',
  esc: 'esc',
  timer: 'timer'
});

var argsToParams = function argsToParams(args) {
  var params = {};

  switch (_typeof(args[0])) {
    case 'object':
      _extends(params, args[0]);

      break;

    default:
      ['title', 'html', 'type'].forEach(function (name, index) {
        switch (_typeof(args[index])) {
          case 'string':
            params[name] = args[index];
            break;

          case 'undefined':
            break;

          default:
            error("Unexpected type of ".concat(name, "! Expected \"string\", got ").concat(_typeof(args[index])));
        }
      });
  }

  return params;
};

var swalPrefix = 'swal2-';
var prefix = function prefix(items) {
  var result = {};

  for (var i in items) {
    result[items[i]] = swalPrefix + items[i];
  }

  return result;
};
var swalClasses = prefix(['container', 'shown', 'height-auto', 'iosfix', 'popup', 'modal', 'no-backdrop', 'toast', 'toast-shown', 'toast-column', 'show', 'hide', 'noanimation', 'close', 'title', 'header', 'content', 'actions', 'confirm', 'cancel', 'footer', 'icon', 'image', 'input', 'file', 'range', 'select', 'radio', 'checkbox', 'label', 'textarea', 'inputerror', 'validation-message', 'progress-steps', 'active-progress-step', 'progress-step', 'progress-step-line', 'loading', 'styled', 'top', 'top-start', 'top-end', 'top-left', 'top-right', 'center', 'center-start', 'center-end', 'center-left', 'center-right', 'bottom', 'bottom-start', 'bottom-end', 'bottom-left', 'bottom-right', 'grow-row', 'grow-column', 'grow-fullscreen', 'rtl']);
var iconTypes = prefix(['success', 'warning', 'info', 'question', 'error']);

var states = {
  previousBodyPadding: null
};
var hasClass = function hasClass(elem, className) {
  return elem.classList.contains(className);
};

var removeCustomClasses = function removeCustomClasses(elem) {
  toArray(elem.classList).forEach(function (className) {
    if (!(objectValues(swalClasses).indexOf(className) !== -1) && !(objectValues(iconTypes).indexOf(className) !== -1)) {
      elem.classList.remove(className);
    }
  });
};

var applyCustomClass = function applyCustomClass(elem, customClass, className) {
  removeCustomClasses(elem);

  if (customClass && customClass[className]) {
    if (typeof customClass[className] !== 'string' && !customClass[className].forEach) {
      return warn("Invalid type of customClass.".concat(className, "! Expected string or iterable object, got \"").concat(_typeof(customClass[className]), "\""));
    }

    addClass(elem, customClass[className]);
  }
};
function getInput(content, inputType) {
  if (!inputType) {
    return null;
  }

  switch (inputType) {
    case 'select':
    case 'textarea':
    case 'file':
      return getChildByClass(content, swalClasses[inputType]);

    case 'checkbox':
      return content.querySelector(".".concat(swalClasses.checkbox, " input"));

    case 'radio':
      return content.querySelector(".".concat(swalClasses.radio, " input:checked")) || content.querySelector(".".concat(swalClasses.radio, " input:first-child"));

    case 'range':
      return content.querySelector(".".concat(swalClasses.range, " input"));

    default:
      return getChildByClass(content, swalClasses.input);
  }
}
var focusInput = function focusInput(input) {
  input.focus(); // place cursor at end of text in text input

  if (input.type !== 'file') {
    // http://stackoverflow.com/a/2345915
    var val = input.value;
    input.value = '';
    input.value = val;
  }
};
var toggleClass = function toggleClass(target, classList, condition) {
  if (!target || !classList) {
    return;
  }

  if (typeof classList === 'string') {
    classList = classList.split(/\s+/).filter(Boolean);
  }

  classList.forEach(function (className) {
    if (target.forEach) {
      target.forEach(function (elem) {
        condition ? elem.classList.add(className) : elem.classList.remove(className);
      });
    } else {
      condition ? target.classList.add(className) : target.classList.remove(className);
    }
  });
};
var addClass = function addClass(target, classList) {
  toggleClass(target, classList, true);
};
var removeClass = function removeClass(target, classList) {
  toggleClass(target, classList, false);
};
var getChildByClass = function getChildByClass(elem, className) {
  for (var i = 0; i < elem.childNodes.length; i++) {
    if (hasClass(elem.childNodes[i], className)) {
      return elem.childNodes[i];
    }
  }
};
var applyNumericalStyle = function applyNumericalStyle(elem, property, value) {
  if (value || parseInt(value) === 0) {
    elem.style[property] = typeof value === 'number' ? value + 'px' : value;
  } else {
    elem.style.removeProperty(property);
  }
};
var show = function show(elem) {
  var display = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'flex';
  elem.style.opacity = '';
  elem.style.display = display;
};
var hide = function hide(elem) {
  elem.style.opacity = '';
  elem.style.display = 'none';
};
var toggle = function toggle(elem, condition, display) {
  condition ? show(elem, display) : hide(elem);
}; // borrowed from jquery $(elem).is(':visible') implementation

var isVisible = function isVisible(elem) {
  return !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
};
var isScrollable = function isScrollable(elem) {
  return !!(elem.scrollHeight > elem.clientHeight);
}; // borrowed from https://stackoverflow.com/a/46352119

var hasCssAnimation = function hasCssAnimation(elem) {
  var style = window.getComputedStyle(elem);
  var animDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');
  var transDuration = parseFloat(style.getPropertyValue('transition-duration') || '0');
  return animDuration > 0 || transDuration > 0;
};
var contains = function contains(haystack, needle) {
  if (typeof haystack.contains === 'function') {
    return haystack.contains(needle);
  }
};

var getContainer = function getContainer() {
  return document.body.querySelector('.' + swalClasses.container);
};
var elementBySelector = function elementBySelector(selectorString) {
  var container = getContainer();
  return container ? container.querySelector(selectorString) : null;
};

var elementByClass = function elementByClass(className) {
  return elementBySelector('.' + className);
};

var getPopup = function getPopup() {
  return elementByClass(swalClasses.popup);
};
var getIcons = function getIcons() {
  var popup = getPopup();
  return toArray(popup.querySelectorAll('.' + swalClasses.icon));
};
var getIcon = function getIcon() {
  var visibleIcon = getIcons().filter(function (icon) {
    return isVisible(icon);
  });
  return visibleIcon.length ? visibleIcon[0] : null;
};
var getTitle = function getTitle() {
  return elementByClass(swalClasses.title);
};
var getContent = function getContent() {
  return elementByClass(swalClasses.content);
};
var getImage = function getImage() {
  return elementByClass(swalClasses.image);
};
var getProgressSteps = function getProgressSteps() {
  return elementByClass(swalClasses['progress-steps']);
};
var getValidationMessage = function getValidationMessage() {
  return elementByClass(swalClasses['validation-message']);
};
var getConfirmButton = function getConfirmButton() {
  return elementBySelector('.' + swalClasses.actions + ' .' + swalClasses.confirm);
};
var getCancelButton = function getCancelButton() {
  return elementBySelector('.' + swalClasses.actions + ' .' + swalClasses.cancel);
};
var getActions = function getActions() {
  return elementByClass(swalClasses.actions);
};
var getHeader = function getHeader() {
  return elementByClass(swalClasses.header);
};
var getFooter = function getFooter() {
  return elementByClass(swalClasses.footer);
};
var getCloseButton = function getCloseButton() {
  return elementByClass(swalClasses.close);
}; // https://github.com/jkup/focusable/blob/master/index.js

var focusable = "\n  a[href],\n  area[href],\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled]),\n  button:not([disabled]),\n  iframe,\n  object,\n  embed,\n  [tabindex=\"0\"],\n  [contenteditable],\n  audio[controls],\n  video[controls],\n  summary\n";
var getFocusableElements = function getFocusableElements() {
  var focusableElementsWithTabindex = toArray(getPopup().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')) // sort according to tabindex
  .sort(function (a, b) {
    a = parseInt(a.getAttribute('tabindex'));
    b = parseInt(b.getAttribute('tabindex'));

    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    }

    return 0;
  });
  var otherFocusableElements = toArray(getPopup().querySelectorAll(focusable)).filter(function (el) {
    return el.getAttribute('tabindex') !== '-1';
  });
  return uniqueArray(focusableElementsWithTabindex.concat(otherFocusableElements)).filter(function (el) {
    return isVisible(el);
  });
};
var isModal = function isModal() {
  return !isToast() && !document.body.classList.contains(swalClasses['no-backdrop']);
};
var isToast = function isToast() {
  return document.body.classList.contains(swalClasses['toast-shown']);
};
var isLoading = function isLoading() {
  return getPopup().hasAttribute('data-loading');
};

// Detect Node env
var isNodeEnv = function isNodeEnv() {
  return typeof window === 'undefined' || typeof document === 'undefined';
};

var sweetHTML = "\n <div aria-labelledby=\"".concat(swalClasses.title, "\" aria-describedby=\"").concat(swalClasses.content, "\" class=\"").concat(swalClasses.popup, "\" tabindex=\"-1\">\n   <div class=\"").concat(swalClasses.header, "\">\n     <ul class=\"").concat(swalClasses['progress-steps'], "\"></ul>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.error, "\">\n       <span class=\"swal2-x-mark\"><span class=\"swal2-x-mark-line-left\"></span><span class=\"swal2-x-mark-line-right\"></span></span>\n     </div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.question, "\"></div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.warning, "\"></div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.info, "\"></div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.success, "\">\n       <div class=\"swal2-success-circular-line-left\"></div>\n       <span class=\"swal2-success-line-tip\"></span> <span class=\"swal2-success-line-long\"></span>\n       <div class=\"swal2-success-ring\"></div> <div class=\"swal2-success-fix\"></div>\n       <div class=\"swal2-success-circular-line-right\"></div>\n     </div>\n     <img class=\"").concat(swalClasses.image, "\" />\n     <h2 class=\"").concat(swalClasses.title, "\" id=\"").concat(swalClasses.title, "\"></h2>\n     <button type=\"button\" class=\"").concat(swalClasses.close, "\"></button>\n   </div>\n   <div class=\"").concat(swalClasses.content, "\">\n     <div id=\"").concat(swalClasses.content, "\"></div>\n     <input class=\"").concat(swalClasses.input, "\" />\n     <input type=\"file\" class=\"").concat(swalClasses.file, "\" />\n     <div class=\"").concat(swalClasses.range, "\">\n       <input type=\"range\" />\n       <output></output>\n     </div>\n     <select class=\"").concat(swalClasses.select, "\"></select>\n     <div class=\"").concat(swalClasses.radio, "\"></div>\n     <label for=\"").concat(swalClasses.checkbox, "\" class=\"").concat(swalClasses.checkbox, "\">\n       <input type=\"checkbox\" />\n       <span class=\"").concat(swalClasses.label, "\"></span>\n     </label>\n     <textarea class=\"").concat(swalClasses.textarea, "\"></textarea>\n     <div class=\"").concat(swalClasses['validation-message'], "\" id=\"").concat(swalClasses['validation-message'], "\"></div>\n   </div>\n   <div class=\"").concat(swalClasses.actions, "\">\n     <button type=\"button\" class=\"").concat(swalClasses.confirm, "\">OK</button>\n     <button type=\"button\" class=\"").concat(swalClasses.cancel, "\">Cancel</button>\n   </div>\n   <div class=\"").concat(swalClasses.footer, "\">\n   </div>\n </div>\n").replace(/(^|\n)\s*/g, '');

var resetOldContainer = function resetOldContainer() {
  var oldContainer = getContainer();

  if (!oldContainer) {
    return;
  }

  oldContainer.parentNode.removeChild(oldContainer);
  removeClass([document.documentElement, document.body], [swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['has-column']]);
};

var oldInputVal; // IE11 workaround, see #1109 for details

var resetValidationMessage = function resetValidationMessage(e) {
  if (Swal.isVisible() && oldInputVal !== e.target.value) {
    Swal.resetValidationMessage();
  }

  oldInputVal = e.target.value;
};

var addInputChangeListeners = function addInputChangeListeners() {
  var content = getContent();
  var input = getChildByClass(content, swalClasses.input);
  var file = getChildByClass(content, swalClasses.file);
  var range = content.querySelector(".".concat(swalClasses.range, " input"));
  var rangeOutput = content.querySelector(".".concat(swalClasses.range, " output"));
  var select = getChildByClass(content, swalClasses.select);
  var checkbox = content.querySelector(".".concat(swalClasses.checkbox, " input"));
  var textarea = getChildByClass(content, swalClasses.textarea);
  input.oninput = resetValidationMessage;
  file.onchange = resetValidationMessage;
  select.onchange = resetValidationMessage;
  checkbox.onchange = resetValidationMessage;
  textarea.oninput = resetValidationMessage;

  range.oninput = function (e) {
    resetValidationMessage(e);
    rangeOutput.value = range.value;
  };

  range.onchange = function (e) {
    resetValidationMessage(e);
    range.nextSibling.value = range.value;
  };
};

var getTarget = function getTarget(target) {
  return typeof target === 'string' ? document.querySelector(target) : target;
};

var setupAccessibility = function setupAccessibility(params) {
  var popup = getPopup();
  popup.setAttribute('role', params.toast ? 'alert' : 'dialog');
  popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive');

  if (!params.toast) {
    popup.setAttribute('aria-modal', 'true');
  }
};

var setupRTL = function setupRTL(targetElement) {
  if (window.getComputedStyle(targetElement).direction === 'rtl') {
    addClass(getContainer(), swalClasses.rtl);
  }
};
/*
 * Add modal + backdrop to DOM
 */


var init = function init(params) {
  // Clean up the old popup container if it exists
  resetOldContainer();
  /* istanbul ignore if */

  if (isNodeEnv()) {
    error('SweetAlert2 requires document to initialize');
    return;
  }

  var container = document.createElement('div');
  container.className = swalClasses.container;
  container.innerHTML = sweetHTML;
  var targetElement = getTarget(params.target);
  targetElement.appendChild(container);
  setupAccessibility(params);
  setupRTL(targetElement);
  addInputChangeListeners();
};

var parseHtmlToContainer = function parseHtmlToContainer(param, target) {
  // DOM element
  if (param instanceof HTMLElement) {
    target.appendChild(param); // JQuery element(s)
  } else if (_typeof(param) === 'object') {
    handleJqueryElem(target, param); // Plain string
  } else if (param) {
    target.innerHTML = param;
  }
};

var handleJqueryElem = function handleJqueryElem(target, elem) {
  target.innerHTML = '';

  if (0 in elem) {
    for (var i = 0; i in elem; i++) {
      target.appendChild(elem[i].cloneNode(true));
    }
  } else {
    target.appendChild(elem.cloneNode(true));
  }
};

var animationEndEvent = function () {
  // Prevent run in Node env

  /* istanbul ignore if */
  if (isNodeEnv()) {
    return false;
  }

  var testEl = document.createElement('div');
  var transEndEventNames = {
    WebkitAnimation: 'webkitAnimationEnd',
    OAnimation: 'oAnimationEnd oanimationend',
    animation: 'animationend'
  };

  for (var i in transEndEventNames) {
    if (Object.prototype.hasOwnProperty.call(transEndEventNames, i) && typeof testEl.style[i] !== 'undefined') {
      return transEndEventNames[i];
    }
  }

  return false;
}();

// Measure width of scrollbar
// https://github.com/twbs/bootstrap/blob/master/js/modal.js#L279-L286
var measureScrollbar = function measureScrollbar() {
  var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

  if (supportsTouch) {
    return 0;
  }

  var scrollDiv = document.createElement('div');
  scrollDiv.style.width = '50px';
  scrollDiv.style.height = '50px';
  scrollDiv.style.overflow = 'scroll';
  document.body.appendChild(scrollDiv);
  var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
};

var renderActions = function renderActions(instance, params) {
  var actions = getActions();
  var confirmButton = getConfirmButton();
  var cancelButton = getCancelButton(); // Actions (buttons) wrapper

  if (!params.showConfirmButton && !params.showCancelButton) {
    hide(actions);
  } // Custom class


  applyCustomClass(actions, params.customClass, 'actions'); // Render confirm button

  renderButton(confirmButton, 'confirm', params); // render Cancel Button

  renderButton(cancelButton, 'cancel', params);

  if (params.buttonsStyling) {
    handleButtonsStyling(confirmButton, cancelButton, params);
  } else {
    removeClass([confirmButton, cancelButton], swalClasses.styled);
    confirmButton.style.backgroundColor = confirmButton.style.borderLeftColor = confirmButton.style.borderRightColor = '';
    cancelButton.style.backgroundColor = cancelButton.style.borderLeftColor = cancelButton.style.borderRightColor = '';
  }

  if (params.reverseButtons) {
    confirmButton.parentNode.insertBefore(cancelButton, confirmButton);
  }
};

function handleButtonsStyling(confirmButton, cancelButton, params) {
  addClass([confirmButton, cancelButton], swalClasses.styled); // Buttons background colors

  if (params.confirmButtonColor) {
    confirmButton.style.backgroundColor = params.confirmButtonColor;
  }

  if (params.cancelButtonColor) {
    cancelButton.style.backgroundColor = params.cancelButtonColor;
  } // Loading state


  var confirmButtonBackgroundColor = window.getComputedStyle(confirmButton).getPropertyValue('background-color');
  confirmButton.style.borderLeftColor = confirmButtonBackgroundColor;
  confirmButton.style.borderRightColor = confirmButtonBackgroundColor;
}

function renderButton(button, buttonType, params) {
  toggle(button, params['showC' + buttonType.substring(1) + 'Button'], 'inline-block');
  button.innerHTML = params[buttonType + 'ButtonText']; // Set caption text

  button.setAttribute('aria-label', params[buttonType + 'ButtonAriaLabel']); // ARIA label
  // Add buttons custom classes

  button.className = swalClasses[buttonType];
  applyCustomClass(button, params.customClass, buttonType + 'Button');
  addClass(button, params[buttonType + 'ButtonClass']);
}

function handleBackdropParam(container, backdrop) {
  if (typeof backdrop === 'string') {
    container.style.background = backdrop;
  } else if (!backdrop) {
    addClass([document.documentElement, document.body], swalClasses['no-backdrop']);
  }
}

function handlePositionParam(container, position) {
  if (position in swalClasses) {
    addClass(container, swalClasses[position]);
  } else {
    warn('The "position" parameter is not valid, defaulting to "center"');
    addClass(container, swalClasses.center);
  }
}

function handleGrowParam(container, grow) {
  if (grow && typeof grow === 'string') {
    var growClass = 'grow-' + grow;

    if (growClass in swalClasses) {
      addClass(container, swalClasses[growClass]);
    }
  }
}

var renderContainer = function renderContainer(instance, params) {
  var container = getContainer();

  if (!container) {
    return;
  }

  handleBackdropParam(container, params.backdrop);

  if (!params.backdrop && params.allowOutsideClick) {
    warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
  }

  handlePositionParam(container, params.position);
  handleGrowParam(container, params.grow); // Custom class

  applyCustomClass(container, params.customClass, 'container');

  if (params.customContainerClass) {
    // @deprecated
    addClass(container, params.customContainerClass);
  }
};

/**
 * This module containts `WeakMap`s for each effectively-"private  property" that a `Swal` has.
 * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
 * This is the approach that Babel will probably take to implement private methods/fields
 *   https://github.com/tc39/proposal-private-methods
 *   https://github.com/babel/babel/pull/7555
 * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
 *   then we can use that language feature.
 */
var privateProps = {
  promise: new WeakMap(),
  innerParams: new WeakMap(),
  domCache: new WeakMap()
};

var inputTypes = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea'];
var renderInput = function renderInput(instance, params) {
  var content = getContent();
  var innerParams = privateProps.innerParams.get(instance);
  var rerender = !innerParams || params.input !== innerParams.input;
  inputTypes.forEach(function (inputType) {
    var inputClass = swalClasses[inputType];
    var inputContainer = getChildByClass(content, inputClass); // set attributes

    setAttributes(inputType, params.inputAttributes); // set class

    inputContainer.className = inputClass;

    if (rerender) {
      hide(inputContainer);
    }
  });

  if (params.input) {
    if (rerender) {
      showInput(params);
    } // set custom class


    setCustomClass(params);
  }
};

var showInput = function showInput(params) {
  if (!renderInputType[params.input]) {
    return error("Unexpected type of input! Expected \"text\", \"email\", \"password\", \"number\", \"tel\", \"select\", \"radio\", \"checkbox\", \"textarea\", \"file\" or \"url\", got \"".concat(params.input, "\""));
  }

  var inputContainer = getInputContainer(params.input);
  var input = renderInputType[params.input](inputContainer, params);
  show(input); // input autofocus

  setTimeout(function () {
    focusInput(input);
  });
};

var removeAttributes = function removeAttributes(input) {
  for (var i = 0; i < input.attributes.length; i++) {
    var attrName = input.attributes[i].name;

    if (!(['type', 'value', 'style'].indexOf(attrName) !== -1)) {
      input.removeAttribute(attrName);
    }
  }
};

var setAttributes = function setAttributes(inputType, inputAttributes) {
  var input = getInput(getContent(), inputType);

  if (!input) {
    return;
  }

  removeAttributes(input);

  for (var attr in inputAttributes) {
    // Do not set a placeholder for <input type="range">
    // it'll crash Edge, #1298
    if (inputType === 'range' && attr === 'placeholder') {
      continue;
    }

    input.setAttribute(attr, inputAttributes[attr]);
  }
};

var setCustomClass = function setCustomClass(params) {
  var inputContainer = getInputContainer(params.input);

  if (params.inputClass) {
    addClass(inputContainer, params.inputClass);
  }

  if (params.customClass) {
    addClass(inputContainer, params.customClass.input);
  }
};

var setInputPlaceholder = function setInputPlaceholder(input, params) {
  if (!input.placeholder || params.inputPlaceholder) {
    input.placeholder = params.inputPlaceholder;
  }
};

var getInputContainer = function getInputContainer(inputType) {
  var inputClass = swalClasses[inputType] ? swalClasses[inputType] : swalClasses.input;
  return getChildByClass(getContent(), inputClass);
};

var renderInputType = {};

renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = function (input, params) {
  if (typeof params.inputValue === 'string' || typeof params.inputValue === 'number') {
    input.value = params.inputValue;
  } else if (!isPromise(params.inputValue)) {
    warn("Unexpected type of inputValue! Expected \"string\", \"number\" or \"Promise\", got \"".concat(_typeof(params.inputValue), "\""));
  }

  setInputPlaceholder(input, params);
  input.type = params.input;
  return input;
};

renderInputType.file = function (input, params) {
  setInputPlaceholder(input, params);
  return input;
};

renderInputType.range = function (range, params) {
  var rangeInput = range.querySelector('input');
  var rangeOutput = range.querySelector('output');
  rangeInput.value = params.inputValue;
  rangeInput.type = params.input;
  rangeOutput.value = params.inputValue;
  return range;
};

renderInputType.select = function (select, params) {
  select.innerHTML = '';

  if (params.inputPlaceholder) {
    var placeholder = document.createElement('option');
    placeholder.innerHTML = params.inputPlaceholder;
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);
  }

  return select;
};

renderInputType.radio = function (radio) {
  radio.innerHTML = '';
  return radio;
};

renderInputType.checkbox = function (checkboxContainer, params) {
  var checkbox = getInput(getContent(), 'checkbox');
  checkbox.value = 1;
  checkbox.id = swalClasses.checkbox;
  checkbox.checked = Boolean(params.inputValue);
  var label = checkboxContainer.querySelector('span');
  label.innerHTML = params.inputPlaceholder;
  return checkboxContainer;
};

renderInputType.textarea = function (textarea, params) {
  textarea.value = params.inputValue;
  setInputPlaceholder(textarea, params);

  if ('MutationObserver' in window) {
    // #1699
    var initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);
    var popupPadding = parseInt(window.getComputedStyle(getPopup()).paddingLeft) + parseInt(window.getComputedStyle(getPopup()).paddingRight);

    var outputsize = function outputsize() {
      var contentWidth = textarea.offsetWidth + popupPadding;

      if (contentWidth > initialPopupWidth) {
        getPopup().style.width = contentWidth + 'px';
      } else {
        getPopup().style.width = null;
      }
    };

    new MutationObserver(outputsize).observe(textarea, {
      attributes: true,
      attributeFilter: ['style']
    });
  }

  return textarea;
};

var renderContent = function renderContent(instance, params) {
  var content = getContent().querySelector('#' + swalClasses.content); // Content as HTML

  if (params.html) {
    parseHtmlToContainer(params.html, content);
    show(content, 'block'); // Content as plain text
  } else if (params.text) {
    content.textContent = params.text;
    show(content, 'block'); // No content
  } else {
    hide(content);
  }

  renderInput(instance, params); // Custom class

  applyCustomClass(getContent(), params.customClass, 'content');
};

var renderFooter = function renderFooter(instance, params) {
  var footer = getFooter();
  toggle(footer, params.footer);

  if (params.footer) {
    parseHtmlToContainer(params.footer, footer);
  } // Custom class


  applyCustomClass(footer, params.customClass, 'footer');
};

var renderCloseButton = function renderCloseButton(instance, params) {
  var closeButton = getCloseButton();
  closeButton.innerHTML = params.closeButtonHtml; // Custom class

  applyCustomClass(closeButton, params.customClass, 'closeButton');
  toggle(closeButton, params.showCloseButton);
  closeButton.setAttribute('aria-label', params.closeButtonAriaLabel);
};

var renderIcon = function renderIcon(instance, params) {
  var innerParams = privateProps.innerParams.get(instance); // if the icon with the given type already rendered,
  // apply the custom class without re-rendering the icon

  if (innerParams && params.type === innerParams.type && getIcon()) {
    applyCustomClass(getIcon(), params.customClass, 'icon');
    return;
  }

  hideAllIcons();

  if (!params.type) {
    return;
  }

  adjustSuccessIconBackgoundColor();

  if (Object.keys(iconTypes).indexOf(params.type) !== -1) {
    var icon = elementBySelector(".".concat(swalClasses.icon, ".").concat(iconTypes[params.type]));
    show(icon); // Custom class

    applyCustomClass(icon, params.customClass, 'icon'); // Animate icon

    toggleClass(icon, "swal2-animate-".concat(params.type, "-icon"), params.animation);
  } else {
    error("Unknown type! Expected \"success\", \"error\", \"warning\", \"info\" or \"question\", got \"".concat(params.type, "\""));
  }
};

var hideAllIcons = function hideAllIcons() {
  var icons = getIcons();

  for (var i = 0; i < icons.length; i++) {
    hide(icons[i]);
  }
}; // Adjust success icon background color to match the popup background color


var adjustSuccessIconBackgoundColor = function adjustSuccessIconBackgoundColor() {
  var popup = getPopup();
  var popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue('background-color');
  var successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix');

  for (var i = 0; i < successIconParts.length; i++) {
    successIconParts[i].style.backgroundColor = popupBackgroundColor;
  }
};

var renderImage = function renderImage(instance, params) {
  var image = getImage();

  if (!params.imageUrl) {
    return hide(image);
  }

  show(image); // Src, alt

  image.setAttribute('src', params.imageUrl);
  image.setAttribute('alt', params.imageAlt); // Width, height

  applyNumericalStyle(image, 'width', params.imageWidth);
  applyNumericalStyle(image, 'height', params.imageHeight); // Class

  image.className = swalClasses.image;
  applyCustomClass(image, params.customClass, 'image');

  if (params.imageClass) {
    addClass(image, params.imageClass);
  }
};

var createStepElement = function createStepElement(step) {
  var stepEl = document.createElement('li');
  addClass(stepEl, swalClasses['progress-step']);
  stepEl.innerHTML = step;
  return stepEl;
};

var createLineElement = function createLineElement(params) {
  var lineEl = document.createElement('li');
  addClass(lineEl, swalClasses['progress-step-line']);

  if (params.progressStepsDistance) {
    lineEl.style.width = params.progressStepsDistance;
  }

  return lineEl;
};

var renderProgressSteps = function renderProgressSteps(instance, params) {
  var progressStepsContainer = getProgressSteps();

  if (!params.progressSteps || params.progressSteps.length === 0) {
    return hide(progressStepsContainer);
  }

  show(progressStepsContainer);
  progressStepsContainer.innerHTML = '';
  var currentProgressStep = parseInt(params.currentProgressStep === null ? Swal.getQueueStep() : params.currentProgressStep);

  if (currentProgressStep >= params.progressSteps.length) {
    warn('Invalid currentProgressStep parameter, it should be less than progressSteps.length ' + '(currentProgressStep like JS arrays starts from 0)');
  }

  params.progressSteps.forEach(function (step, index) {
    var stepEl = createStepElement(step);
    progressStepsContainer.appendChild(stepEl);

    if (index === currentProgressStep) {
      addClass(stepEl, swalClasses['active-progress-step']);
    }

    if (index !== params.progressSteps.length - 1) {
      var lineEl = createLineElement(step);
      progressStepsContainer.appendChild(lineEl);
    }
  });
};

var renderTitle = function renderTitle(instance, params) {
  var title = getTitle();
  toggle(title, params.title || params.titleText);

  if (params.title) {
    parseHtmlToContainer(params.title, title);
  }

  if (params.titleText) {
    title.innerText = params.titleText;
  } // Custom class


  applyCustomClass(title, params.customClass, 'title');
};

var renderHeader = function renderHeader(instance, params) {
  var header = getHeader(); // Custom class

  applyCustomClass(header, params.customClass, 'header'); // Progress steps

  renderProgressSteps(instance, params); // Icon

  renderIcon(instance, params); // Image

  renderImage(instance, params); // Title

  renderTitle(instance, params); // Close button

  renderCloseButton(instance, params);
};

var renderPopup = function renderPopup(instance, params) {
  var popup = getPopup(); // Width

  applyNumericalStyle(popup, 'width', params.width); // Padding

  applyNumericalStyle(popup, 'padding', params.padding); // Background

  if (params.background) {
    popup.style.background = params.background;
  } // Default Class


  popup.className = swalClasses.popup;

  if (params.toast) {
    addClass([document.documentElement, document.body], swalClasses['toast-shown']);
    addClass(popup, swalClasses.toast);
  } else {
    addClass(popup, swalClasses.modal);
  } // Custom class


  applyCustomClass(popup, params.customClass, 'popup');

  if (typeof params.customClass === 'string') {
    addClass(popup, params.customClass);
  } // CSS animation


  toggleClass(popup, swalClasses.noanimation, !params.animation);
};

var render = function render(instance, params) {
  renderPopup(instance, params);
  renderContainer(instance, params);
  renderHeader(instance, params);
  renderContent(instance, params);
  renderActions(instance, params);
  renderFooter(instance, params);

  if (typeof params.onRender === 'function') {
    params.onRender(getPopup());
  }
};

/*
 * Global function to determine if SweetAlert2 popup is shown
 */

var isVisible$1 = function isVisible$$1() {
  return isVisible(getPopup());
};
/*
 * Global function to click 'Confirm' button
 */

var clickConfirm = function clickConfirm() {
  return getConfirmButton() && getConfirmButton().click();
};
/*
 * Global function to click 'Cancel' button
 */

var clickCancel = function clickCancel() {
  return getCancelButton() && getCancelButton().click();
};

function fire() {
  var Swal = this;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _construct(Swal, args);
}

/**
 * Returns an extended version of `Swal` containing `params` as defaults.
 * Useful for reusing Swal configuration.
 *
 * For example:
 *
 * Before:
 * const textPromptOptions = { input: 'text', showCancelButton: true }
 * const {value: firstName} = await Swal.fire({ ...textPromptOptions, title: 'What is your first name?' })
 * const {value: lastName} = await Swal.fire({ ...textPromptOptions, title: 'What is your last name?' })
 *
 * After:
 * const TextPrompt = Swal.mixin({ input: 'text', showCancelButton: true })
 * const {value: firstName} = await TextPrompt('What is your first name?')
 * const {value: lastName} = await TextPrompt('What is your last name?')
 *
 * @param mixinParams
 */
function mixin(mixinParams) {
  var MixinSwal =
  /*#__PURE__*/
  function (_this) {
    _inherits(MixinSwal, _this);

    function MixinSwal() {
      _classCallCheck(this, MixinSwal);

      return _possibleConstructorReturn(this, _getPrototypeOf(MixinSwal).apply(this, arguments));
    }

    _createClass(MixinSwal, [{
      key: "_main",
      value: function _main(params) {
        return _get(_getPrototypeOf(MixinSwal.prototype), "_main", this).call(this, _extends({}, mixinParams, params));
      }
    }]);

    return MixinSwal;
  }(this);

  return MixinSwal;
}

// private global state for the queue feature
var currentSteps = [];
/*
 * Global function for chaining sweetAlert popups
 */

var queue = function queue(steps) {
  var Swal = this;
  currentSteps = steps;

  var resetAndResolve = function resetAndResolve(resolve, value) {
    currentSteps = [];
    document.body.removeAttribute('data-swal2-queue-step');
    resolve(value);
  };

  var queueResult = [];
  return new Promise(function (resolve) {
    (function step(i, callback) {
      if (i < currentSteps.length) {
        document.body.setAttribute('data-swal2-queue-step', i);
        Swal.fire(currentSteps[i]).then(function (result) {
          if (typeof result.value !== 'undefined') {
            queueResult.push(result.value);
            step(i + 1, callback);
          } else {
            resetAndResolve(resolve, {
              dismiss: result.dismiss
            });
          }
        });
      } else {
        resetAndResolve(resolve, {
          value: queueResult
        });
      }
    })(0);
  });
};
/*
 * Global function for getting the index of current popup in queue
 */

var getQueueStep = function getQueueStep() {
  return document.body.getAttribute('data-swal2-queue-step');
};
/*
 * Global function for inserting a popup to the queue
 */

var insertQueueStep = function insertQueueStep(step, index) {
  if (index && index < currentSteps.length) {
    return currentSteps.splice(index, 0, step);
  }

  return currentSteps.push(step);
};
/*
 * Global function for deleting a popup from the queue
 */

var deleteQueueStep = function deleteQueueStep(index) {
  if (typeof currentSteps[index] !== 'undefined') {
    currentSteps.splice(index, 1);
  }
};

/**
 * Show spinner instead of Confirm button and disable Cancel button
 */

var showLoading = function showLoading() {
  var popup = getPopup();

  if (!popup) {
    Swal.fire('');
  }

  popup = getPopup();
  var actions = getActions();
  var confirmButton = getConfirmButton();
  var cancelButton = getCancelButton();
  show(actions);
  show(confirmButton);
  addClass([popup, actions], swalClasses.loading);
  confirmButton.disabled = true;
  cancelButton.disabled = true;
  popup.setAttribute('data-loading', true);
  popup.setAttribute('aria-busy', true);
  popup.focus();
};

var RESTORE_FOCUS_TIMEOUT = 100;

var globalState = {};
var focusPreviousActiveElement = function focusPreviousActiveElement() {
  if (globalState.previousActiveElement && globalState.previousActiveElement.focus) {
    globalState.previousActiveElement.focus();
    globalState.previousActiveElement = null;
  } else if (document.body) {
    document.body.focus();
  }
}; // Restore previous active (focused) element


var restoreActiveElement = function restoreActiveElement() {
  return new Promise(function (resolve) {
    var x = window.scrollX;
    var y = window.scrollY;
    globalState.restoreFocusTimeout = setTimeout(function () {
      focusPreviousActiveElement();
      resolve();
    }, RESTORE_FOCUS_TIMEOUT); // issues/900

    if (typeof x !== 'undefined' && typeof y !== 'undefined') {
      // IE doesn't have scrollX/scrollY support
      window.scrollTo(x, y);
    }
  });
};

/**
 * If `timer` parameter is set, returns number of milliseconds of timer remained.
 * Otherwise, returns undefined.
 */

var getTimerLeft = function getTimerLeft() {
  return globalState.timeout && globalState.timeout.getTimerLeft();
};
/**
 * Stop timer. Returns number of milliseconds of timer remained.
 * If `timer` parameter isn't set, returns undefined.
 */

var stopTimer = function stopTimer() {
  return globalState.timeout && globalState.timeout.stop();
};
/**
 * Resume timer. Returns number of milliseconds of timer remained.
 * If `timer` parameter isn't set, returns undefined.
 */

var resumeTimer = function resumeTimer() {
  return globalState.timeout && globalState.timeout.start();
};
/**
 * Resume timer. Returns number of milliseconds of timer remained.
 * If `timer` parameter isn't set, returns undefined.
 */

var toggleTimer = function toggleTimer() {
  var timer = globalState.timeout;
  return timer && (timer.running ? timer.stop() : timer.start());
};
/**
 * Increase timer. Returns number of milliseconds of an updated timer.
 * If `timer` parameter isn't set, returns undefined.
 */

var increaseTimer = function increaseTimer(n) {
  return globalState.timeout && globalState.timeout.increase(n);
};
/**
 * Check if timer is running. Returns true if timer is running
 * or false if timer is paused or stopped.
 * If `timer` parameter isn't set, returns undefined
 */

var isTimerRunning = function isTimerRunning() {
  return globalState.timeout && globalState.timeout.isRunning();
};

var defaultParams = {
  title: '',
  titleText: '',
  text: '',
  html: '',
  footer: '',
  type: null,
  toast: false,
  customClass: '',
  customContainerClass: '',
  target: 'body',
  backdrop: true,
  animation: true,
  heightAuto: true,
  allowOutsideClick: true,
  allowEscapeKey: true,
  allowEnterKey: true,
  stopKeydownPropagation: true,
  keydownListenerCapture: false,
  showConfirmButton: true,
  showCancelButton: false,
  preConfirm: null,
  confirmButtonText: 'OK',
  confirmButtonAriaLabel: '',
  confirmButtonColor: null,
  confirmButtonClass: '',
  cancelButtonText: 'Cancel',
  cancelButtonAriaLabel: '',
  cancelButtonColor: null,
  cancelButtonClass: '',
  buttonsStyling: true,
  reverseButtons: false,
  focusConfirm: true,
  focusCancel: false,
  showCloseButton: false,
  closeButtonHtml: '&times;',
  closeButtonAriaLabel: 'Close this dialog',
  showLoaderOnConfirm: false,
  imageUrl: null,
  imageWidth: null,
  imageHeight: null,
  imageAlt: '',
  imageClass: '',
  timer: null,
  width: null,
  padding: null,
  background: null,
  input: null,
  inputPlaceholder: '',
  inputValue: '',
  inputOptions: {},
  inputAutoTrim: true,
  inputClass: '',
  inputAttributes: {},
  inputValidator: null,
  validationMessage: null,
  grow: false,
  position: 'center',
  progressSteps: [],
  currentProgressStep: null,
  progressStepsDistance: null,
  onBeforeOpen: null,
  onOpen: null,
  onRender: null,
  onClose: null,
  onAfterClose: null,
  scrollbarPadding: true
};
var updatableParams = ['title', 'titleText', 'text', 'html', 'type', 'customClass', 'showConfirmButton', 'showCancelButton', 'confirmButtonText', 'confirmButtonAriaLabel', 'confirmButtonColor', 'confirmButtonClass', 'cancelButtonText', 'cancelButtonAriaLabel', 'cancelButtonColor', 'cancelButtonClass', 'buttonsStyling', 'reverseButtons', 'imageUrl', 'imageWidth', 'imageHeigth', 'imageAlt', 'imageClass', 'progressSteps', 'currentProgressStep'];
var deprecatedParams = {
  customContainerClass: 'customClass',
  confirmButtonClass: 'customClass',
  cancelButtonClass: 'customClass',
  imageClass: 'customClass',
  inputClass: 'customClass'
};
var toastIncompatibleParams = ['allowOutsideClick', 'allowEnterKey', 'backdrop', 'focusConfirm', 'focusCancel', 'heightAuto', 'keydownListenerCapture'];
/**
 * Is valid parameter
 * @param {String} paramName
 */

var isValidParameter = function isValidParameter(paramName) {
  return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
};
/**
 * Is valid parameter for Swal.update() method
 * @param {String} paramName
 */

var isUpdatableParameter = function isUpdatableParameter(paramName) {
  return updatableParams.indexOf(paramName) !== -1;
};
/**
 * Is deprecated parameter
 * @param {String} paramName
 */

var isDeprecatedParameter = function isDeprecatedParameter(paramName) {
  return deprecatedParams[paramName];
};

var checkIfParamIsValid = function checkIfParamIsValid(param) {
  if (!isValidParameter(param)) {
    warn("Unknown parameter \"".concat(param, "\""));
  }
};

var checkIfToastParamIsValid = function checkIfToastParamIsValid(param) {
  if (toastIncompatibleParams.indexOf(param) !== -1) {
    warn("The parameter \"".concat(param, "\" is incompatible with toasts"));
  }
};

var checkIfParamIsDeprecated = function checkIfParamIsDeprecated(param) {
  if (isDeprecatedParameter(param)) {
    warnAboutDepreation(param, isDeprecatedParameter(param));
  }
};
/**
 * Show relevant warnings for given params
 *
 * @param params
 */


var showWarningsForParams = function showWarningsForParams(params) {
  for (var param in params) {
    checkIfParamIsValid(param);

    if (params.toast) {
      checkIfToastParamIsValid(param);
    }

    checkIfParamIsDeprecated();
  }
};



var staticMethods = Object.freeze({
	isValidParameter: isValidParameter,
	isUpdatableParameter: isUpdatableParameter,
	isDeprecatedParameter: isDeprecatedParameter,
	argsToParams: argsToParams,
	isVisible: isVisible$1,
	clickConfirm: clickConfirm,
	clickCancel: clickCancel,
	getContainer: getContainer,
	getPopup: getPopup,
	getTitle: getTitle,
	getContent: getContent,
	getImage: getImage,
	getIcon: getIcon,
	getIcons: getIcons,
	getCloseButton: getCloseButton,
	getActions: getActions,
	getConfirmButton: getConfirmButton,
	getCancelButton: getCancelButton,
	getHeader: getHeader,
	getFooter: getFooter,
	getFocusableElements: getFocusableElements,
	getValidationMessage: getValidationMessage,
	isLoading: isLoading,
	fire: fire,
	mixin: mixin,
	queue: queue,
	getQueueStep: getQueueStep,
	insertQueueStep: insertQueueStep,
	deleteQueueStep: deleteQueueStep,
	showLoading: showLoading,
	enableLoading: showLoading,
	getTimerLeft: getTimerLeft,
	stopTimer: stopTimer,
	resumeTimer: resumeTimer,
	toggleTimer: toggleTimer,
	increaseTimer: increaseTimer,
	isTimerRunning: isTimerRunning
});

/**
 * Enables buttons and hide loader.
 */

function hideLoading() {
  var innerParams = privateProps.innerParams.get(this);
  var domCache = privateProps.domCache.get(this);

  if (!innerParams.showConfirmButton) {
    hide(domCache.confirmButton);

    if (!innerParams.showCancelButton) {
      hide(domCache.actions);
    }
  }

  removeClass([domCache.popup, domCache.actions], swalClasses.loading);
  domCache.popup.removeAttribute('aria-busy');
  domCache.popup.removeAttribute('data-loading');
  domCache.confirmButton.disabled = false;
  domCache.cancelButton.disabled = false;
}

function getInput$1(instance) {
  var innerParams = privateProps.innerParams.get(instance || this);
  var domCache = privateProps.domCache.get(instance || this);

  if (!domCache) {
    return null;
  }

  return getInput(domCache.content, innerParams.input);
}

var fixScrollbar = function fixScrollbar() {
  // for queues, do not do this more than once
  if (states.previousBodyPadding !== null) {
    return;
  } // if the body has overflow


  if (document.body.scrollHeight > window.innerHeight) {
    // add padding so the content doesn't shift after removal of scrollbar
    states.previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'));
    document.body.style.paddingRight = states.previousBodyPadding + measureScrollbar() + 'px';
  }
};
var undoScrollbar = function undoScrollbar() {
  if (states.previousBodyPadding !== null) {
    document.body.style.paddingRight = states.previousBodyPadding + 'px';
    states.previousBodyPadding = null;
  }
};

/* istanbul ignore next */

var iOSfix = function iOSfix() {
  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

  if (iOS && !hasClass(document.body, swalClasses.iosfix)) {
    var offset = document.body.scrollTop;
    document.body.style.top = offset * -1 + 'px';
    addClass(document.body, swalClasses.iosfix);
    lockBodyScroll();
  }
};

var lockBodyScroll = function lockBodyScroll() {
  // #1246
  var container = getContainer();
  var preventTouchMove;

  container.ontouchstart = function (e) {
    preventTouchMove = e.target === container || !isScrollable(container) && e.target.tagName !== 'INPUT' // #1603
    ;
  };

  container.ontouchmove = function (e) {
    if (preventTouchMove) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
};
/* istanbul ignore next */


var undoIOSfix = function undoIOSfix() {
  if (hasClass(document.body, swalClasses.iosfix)) {
    var offset = parseInt(document.body.style.top, 10);
    removeClass(document.body, swalClasses.iosfix);
    document.body.style.top = '';
    document.body.scrollTop = offset * -1;
  }
};

var isIE11 = function isIE11() {
  return !!window.MSInputMethodContext && !!document.documentMode;
}; // Fix IE11 centering sweetalert2/issues/933

/* istanbul ignore next */


var fixVerticalPositionIE = function fixVerticalPositionIE() {
  var container = getContainer();
  var popup = getPopup();
  container.style.removeProperty('align-items');

  if (popup.offsetTop < 0) {
    container.style.alignItems = 'flex-start';
  }
};
/* istanbul ignore next */


var IEfix = function IEfix() {
  if (typeof window !== 'undefined' && isIE11()) {
    fixVerticalPositionIE();
    window.addEventListener('resize', fixVerticalPositionIE);
  }
};
/* istanbul ignore next */

var undoIEfix = function undoIEfix() {
  if (typeof window !== 'undefined' && isIE11()) {
    window.removeEventListener('resize', fixVerticalPositionIE);
  }
};

// Adding aria-hidden="true" to elements outside of the active modal dialog ensures that
// elements not within the active modal dialog will not be surfaced if a user opens a screen
// reader’s list of elements (headings, form controls, landmarks, etc.) in the document.

var setAriaHidden = function setAriaHidden() {
  var bodyChildren = toArray(document.body.children);
  bodyChildren.forEach(function (el) {
    if (el === getContainer() || contains(el, getContainer())) {
      return;
    }

    if (el.hasAttribute('aria-hidden')) {
      el.setAttribute('data-previous-aria-hidden', el.getAttribute('aria-hidden'));
    }

    el.setAttribute('aria-hidden', 'true');
  });
};
var unsetAriaHidden = function unsetAriaHidden() {
  var bodyChildren = toArray(document.body.children);
  bodyChildren.forEach(function (el) {
    if (el.hasAttribute('data-previous-aria-hidden')) {
      el.setAttribute('aria-hidden', el.getAttribute('data-previous-aria-hidden'));
      el.removeAttribute('data-previous-aria-hidden');
    } else {
      el.removeAttribute('aria-hidden');
    }
  });
};

/**
 * This module containts `WeakMap`s for each effectively-"private  property" that a `Swal` has.
 * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
 * This is the approach that Babel will probably take to implement private methods/fields
 *   https://github.com/tc39/proposal-private-methods
 *   https://github.com/babel/babel/pull/7555
 * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
 *   then we can use that language feature.
 */
var privateMethods = {
  swalPromiseResolve: new WeakMap()
};

/*
 * Instance method to close sweetAlert
 */

function removePopupAndResetState(instance, container, isToast, onAfterClose) {
  if (isToast) {
    triggerOnAfterCloseAndDispose(instance, onAfterClose);
  } else {
    restoreActiveElement().then(function () {
      return triggerOnAfterCloseAndDispose(instance, onAfterClose);
    });
    globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
      capture: globalState.keydownListenerCapture
    });
    globalState.keydownHandlerAdded = false;
  }

  if (container.parentNode) {
    container.parentNode.removeChild(container);
  }

  if (isModal()) {
    undoScrollbar();
    undoIOSfix();
    undoIEfix();
    unsetAriaHidden();
  }

  removeBodyClasses();
}

function removeBodyClasses() {
  removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses['height-auto'], swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['toast-column']]);
}

function disposeSwal(instance) {
  // Unset this.params so GC will dispose it (#1569)
  delete instance.params; // Unset globalState props so GC will dispose globalState (#1569)

  delete globalState.keydownHandler;
  delete globalState.keydownTarget; // Unset WeakMaps so GC will be able to dispose them (#1569)

  unsetWeakMaps(privateProps);
  unsetWeakMaps(privateMethods);
}

function close(resolveValue) {
  var popup = getPopup();

  if (!popup || hasClass(popup, swalClasses.hide)) {
    return;
  }

  var innerParams = privateProps.innerParams.get(this);

  if (!innerParams) {
    return;
  }

  var swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
  removeClass(popup, swalClasses.show);
  addClass(popup, swalClasses.hide);
  handlePopupAnimation(this, popup, innerParams); // Resolve Swal promise

  swalPromiseResolve(resolveValue || {});
}

var handlePopupAnimation = function handlePopupAnimation(instance, popup, innerParams) {
  var container = getContainer(); // If animation is supported, animate

  var animationIsSupported = animationEndEvent && hasCssAnimation(popup);
  var onClose = innerParams.onClose,
      onAfterClose = innerParams.onAfterClose;

  if (onClose !== null && typeof onClose === 'function') {
    onClose(popup);
  }

  if (animationIsSupported) {
    animatePopup(instance, popup, container, onAfterClose);
  } else {
    // Otherwise, remove immediately
    removePopupAndResetState(instance, container, isToast(), onAfterClose);
  }
};

var animatePopup = function animatePopup(instance, popup, container, onAfterClose) {
  globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, isToast(), onAfterClose);
  popup.addEventListener(animationEndEvent, function (e) {
    if (e.target === popup) {
      globalState.swalCloseEventFinishedCallback();
      delete globalState.swalCloseEventFinishedCallback;
    }
  });
};

var unsetWeakMaps = function unsetWeakMaps(obj) {
  for (var i in obj) {
    obj[i] = new WeakMap();
  }
};

var triggerOnAfterCloseAndDispose = function triggerOnAfterCloseAndDispose(instance, onAfterClose) {
  setTimeout(function () {
    if (onAfterClose !== null && typeof onAfterClose === 'function') {
      onAfterClose();
    }

    if (!getPopup()) {
      disposeSwal(instance);
    }
  });
};

function setButtonsDisabled(instance, buttons, disabled) {
  var domCache = privateProps.domCache.get(instance);
  buttons.forEach(function (button) {
    domCache[button].disabled = disabled;
  });
}

function setInputDisabled(input, disabled) {
  if (!input) {
    return false;
  }

  if (input.type === 'radio') {
    var radiosContainer = input.parentNode.parentNode;
    var radios = radiosContainer.querySelectorAll('input');

    for (var i = 0; i < radios.length; i++) {
      radios[i].disabled = disabled;
    }
  } else {
    input.disabled = disabled;
  }
}

function enableButtons() {
  setButtonsDisabled(this, ['confirmButton', 'cancelButton'], false);
}
function disableButtons() {
  setButtonsDisabled(this, ['confirmButton', 'cancelButton'], true);
} // @deprecated

function enableConfirmButton() {
  warnAboutDepreation('Swal.enableConfirmButton()', "Swal.getConfirmButton().removeAttribute('disabled')");
  setButtonsDisabled(this, ['confirmButton'], false);
} // @deprecated

function disableConfirmButton() {
  warnAboutDepreation('Swal.disableConfirmButton()', "Swal.getConfirmButton().setAttribute('disabled', '')");
  setButtonsDisabled(this, ['confirmButton'], true);
}
function enableInput() {
  return setInputDisabled(this.getInput(), false);
}
function disableInput() {
  return setInputDisabled(this.getInput(), true);
}

function showValidationMessage(error) {
  var domCache = privateProps.domCache.get(this);
  domCache.validationMessage.innerHTML = error;
  var popupComputedStyle = window.getComputedStyle(domCache.popup);
  domCache.validationMessage.style.marginLeft = "-".concat(popupComputedStyle.getPropertyValue('padding-left'));
  domCache.validationMessage.style.marginRight = "-".concat(popupComputedStyle.getPropertyValue('padding-right'));
  show(domCache.validationMessage);
  var input = this.getInput();

  if (input) {
    input.setAttribute('aria-invalid', true);
    input.setAttribute('aria-describedBy', swalClasses['validation-message']);
    focusInput(input);
    addClass(input, swalClasses.inputerror);
  }
} // Hide block with validation message

function resetValidationMessage$1() {
  var domCache = privateProps.domCache.get(this);

  if (domCache.validationMessage) {
    hide(domCache.validationMessage);
  }

  var input = this.getInput();

  if (input) {
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedBy');
    removeClass(input, swalClasses.inputerror);
  }
}

function getProgressSteps$1() {
  warnAboutDepreation('Swal.getProgressSteps()', "const swalInstance = Swal.fire({progressSteps: ['1', '2', '3']}); const progressSteps = swalInstance.params.progressSteps");
  var innerParams = privateProps.innerParams.get(this);
  return innerParams.progressSteps;
}
function setProgressSteps(progressSteps) {
  warnAboutDepreation('Swal.setProgressSteps()', 'Swal.update()');
  var innerParams = privateProps.innerParams.get(this);

  var updatedParams = _extends({}, innerParams, {
    progressSteps: progressSteps
  });

  renderProgressSteps(this, updatedParams);
  privateProps.innerParams.set(this, updatedParams);
}
function showProgressSteps() {
  var domCache = privateProps.domCache.get(this);
  show(domCache.progressSteps);
}
function hideProgressSteps() {
  var domCache = privateProps.domCache.get(this);
  hide(domCache.progressSteps);
}

var Timer =
/*#__PURE__*/
function () {
  function Timer(callback, delay) {
    _classCallCheck(this, Timer);

    this.callback = callback;
    this.remaining = delay;
    this.running = false;
    this.start();
  }

  _createClass(Timer, [{
    key: "start",
    value: function start() {
      if (!this.running) {
        this.running = true;
        this.started = new Date();
        this.id = setTimeout(this.callback, this.remaining);
      }

      return this.remaining;
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.running) {
        this.running = false;
        clearTimeout(this.id);
        this.remaining -= new Date() - this.started;
      }

      return this.remaining;
    }
  }, {
    key: "increase",
    value: function increase(n) {
      var running = this.running;

      if (running) {
        this.stop();
      }

      this.remaining += n;

      if (running) {
        this.start();
      }

      return this.remaining;
    }
  }, {
    key: "getTimerLeft",
    value: function getTimerLeft() {
      if (this.running) {
        this.stop();
        this.start();
      }

      return this.remaining;
    }
  }, {
    key: "isRunning",
    value: function isRunning() {
      return this.running;
    }
  }]);

  return Timer;
}();

var defaultInputValidators = {
  email: function email(string, validationMessage) {
    return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid email address');
  },
  url: function url(string, validationMessage) {
    // taken from https://stackoverflow.com/a/3809435 with a small change from #1306
    return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid URL');
  }
};

function setDefaultInputValidators(params) {
  // Use default `inputValidator` for supported input types if not provided
  if (!params.inputValidator) {
    Object.keys(defaultInputValidators).forEach(function (key) {
      if (params.input === key) {
        params.inputValidator = defaultInputValidators[key];
      }
    });
  }
}

function validateCustomTargetElement(params) {
  // Determine if the custom target element is valid
  if (!params.target || typeof params.target === 'string' && !document.querySelector(params.target) || typeof params.target !== 'string' && !params.target.appendChild) {
    warn('Target parameter is not valid, defaulting to "body"');
    params.target = 'body';
  }
}
/**
 * Set type, text and actions on popup
 *
 * @param params
 * @returns {boolean}
 */


function setParameters(params) {
  setDefaultInputValidators(params); // showLoaderOnConfirm && preConfirm

  if (params.showLoaderOnConfirm && !params.preConfirm) {
    warn('showLoaderOnConfirm is set to true, but preConfirm is not defined.\n' + 'showLoaderOnConfirm should be used together with preConfirm, see usage example:\n' + 'https://sweetalert2.github.io/#ajax-request');
  } // params.animation will be actually used in renderPopup.js
  // but in case when params.animation is a function, we need to call that function
  // before popup (re)initialization, so it'll be possible to check Swal.isVisible()
  // inside the params.animation function


  params.animation = callIfFunction(params.animation);
  validateCustomTargetElement(params); // Replace newlines with <br> in title

  if (typeof params.title === 'string') {
    params.title = params.title.split('\n').join('<br />');
  }

  init(params);
}

function swalOpenAnimationFinished(popup, container) {
  popup.removeEventListener(animationEndEvent, swalOpenAnimationFinished);
  container.style.overflowY = 'auto';
}
/**
 * Open popup, add necessary classes and styles, fix scrollbar
 *
 * @param {Array} params
 */


var openPopup = function openPopup(params) {
  var container = getContainer();
  var popup = getPopup();

  if (typeof params.onBeforeOpen === 'function') {
    params.onBeforeOpen(popup);
  }

  addClasses(container, popup, params); // scrolling is 'hidden' until animation is done, after that 'auto'

  setScrollingVisibility(container, popup);

  if (isModal()) {
    fixScrollContainer(container, params.scrollbarPadding);
  }

  if (!isToast() && !globalState.previousActiveElement) {
    globalState.previousActiveElement = document.activeElement;
  }

  if (typeof params.onOpen === 'function') {
    setTimeout(function () {
      return params.onOpen(popup);
    });
  }
};

var setScrollingVisibility = function setScrollingVisibility(container, popup) {
  if (animationEndEvent && hasCssAnimation(popup)) {
    container.style.overflowY = 'hidden';
    popup.addEventListener(animationEndEvent, swalOpenAnimationFinished.bind(null, popup, container));
  } else {
    container.style.overflowY = 'auto';
  }
};

var fixScrollContainer = function fixScrollContainer(container, scrollbarPadding) {
  iOSfix();
  IEfix();
  setAriaHidden();

  if (scrollbarPadding) {
    fixScrollbar();
  } // sweetalert2/issues/1247


  setTimeout(function () {
    container.scrollTop = 0;
  });
};

var addClasses = function addClasses(container, popup, params) {
  if (params.animation) {
    addClass(popup, swalClasses.show);
  }

  show(popup);
  addClass([document.documentElement, document.body, container], swalClasses.shown);

  if (params.heightAuto && params.backdrop && !params.toast) {
    addClass([document.documentElement, document.body], swalClasses['height-auto']);
  }
};

var handleInputOptionsAndValue = function handleInputOptionsAndValue(instance, params) {
  if (params.input === 'select' || params.input === 'radio') {
    handleInputOptions(instance, params);
  } else if (['text', 'email', 'number', 'tel', 'textarea'].indexOf(params.input) !== -1 && isPromise(params.inputValue)) {
    handleInputValue(instance, params);
  }
};
var getInputValue = function getInputValue(instance, innerParams) {
  var input = instance.getInput();

  if (!input) {
    return null;
  }

  switch (innerParams.input) {
    case 'checkbox':
      return getCheckboxValue(input);

    case 'radio':
      return getRadioValue(input);

    case 'file':
      return getFileValue(input);

    default:
      return innerParams.inputAutoTrim ? input.value.trim() : input.value;
  }
};

var getCheckboxValue = function getCheckboxValue(input) {
  return input.checked ? 1 : 0;
};

var getRadioValue = function getRadioValue(input) {
  return input.checked ? input.value : null;
};

var getFileValue = function getFileValue(input) {
  return input.files.length ? input.getAttribute('multiple') !== null ? input.files : input.files[0] : null;
};

var handleInputOptions = function handleInputOptions(instance, params) {
  var content = getContent();

  var processInputOptions = function processInputOptions(inputOptions) {
    return populateInputOptions[params.input](content, formatInputOptions(inputOptions), params);
  };

  if (isPromise(params.inputOptions)) {
    showLoading();
    params.inputOptions.then(function (inputOptions) {
      instance.hideLoading();
      processInputOptions(inputOptions);
    });
  } else if (_typeof(params.inputOptions) === 'object') {
    processInputOptions(params.inputOptions);
  } else {
    error("Unexpected type of inputOptions! Expected object, Map or Promise, got ".concat(_typeof(params.inputOptions)));
  }
};

var handleInputValue = function handleInputValue(instance, params) {
  var input = instance.getInput();
  hide(input);
  params.inputValue.then(function (inputValue) {
    input.value = params.input === 'number' ? parseFloat(inputValue) || 0 : inputValue + '';
    show(input);
    input.focus();
    instance.hideLoading();
  })["catch"](function (err) {
    error('Error in inputValue promise: ' + err);
    input.value = '';
    show(input);
    input.focus();
    instance.hideLoading();
  });
};

var populateInputOptions = {
  select: function select(content, inputOptions, params) {
    var select = getChildByClass(content, swalClasses.select);
    inputOptions.forEach(function (inputOption) {
      var optionValue = inputOption[0];
      var optionLabel = inputOption[1];
      var option = document.createElement('option');
      option.value = optionValue;
      option.innerHTML = optionLabel;

      if (params.inputValue.toString() === optionValue.toString()) {
        option.selected = true;
      }

      select.appendChild(option);
    });
    select.focus();
  },
  radio: function radio(content, inputOptions, params) {
    var radio = getChildByClass(content, swalClasses.radio);
    inputOptions.forEach(function (inputOption) {
      var radioValue = inputOption[0];
      var radioLabel = inputOption[1];
      var radioInput = document.createElement('input');
      var radioLabelElement = document.createElement('label');
      radioInput.type = 'radio';
      radioInput.name = swalClasses.radio;
      radioInput.value = radioValue;

      if (params.inputValue.toString() === radioValue.toString()) {
        radioInput.checked = true;
      }

      var label = document.createElement('span');
      label.innerHTML = radioLabel;
      label.className = swalClasses.label;
      radioLabelElement.appendChild(radioInput);
      radioLabelElement.appendChild(label);
      radio.appendChild(radioLabelElement);
    });
    var radios = radio.querySelectorAll('input');

    if (radios.length) {
      radios[0].focus();
    }
  }
};
/**
 * Converts `inputOptions` into an array of `[value, label]`s
 * @param inputOptions
 */

var formatInputOptions = function formatInputOptions(inputOptions) {
  var result = [];

  if (typeof Map !== 'undefined' && inputOptions instanceof Map) {
    inputOptions.forEach(function (value, key) {
      result.push([key, value]);
    });
  } else {
    Object.keys(inputOptions).forEach(function (key) {
      result.push([key, inputOptions[key]]);
    });
  }

  return result;
};

var handleConfirmButtonClick = function handleConfirmButtonClick(instance, innerParams) {
  instance.disableButtons();

  if (innerParams.input) {
    handleConfirmWithInput(instance, innerParams);
  } else {
    confirm(instance, innerParams, true);
  }
};
var handleCancelButtonClick = function handleCancelButtonClick(instance, dismissWith) {
  instance.disableButtons();
  dismissWith(DismissReason.cancel);
};

var handleConfirmWithInput = function handleConfirmWithInput(instance, innerParams) {
  var inputValue = getInputValue(instance, innerParams);

  if (innerParams.inputValidator) {
    instance.disableInput();
    var validationPromise = Promise.resolve().then(function () {
      return innerParams.inputValidator(inputValue, innerParams.validationMessage);
    });
    validationPromise.then(function (validationMessage) {
      instance.enableButtons();
      instance.enableInput();

      if (validationMessage) {
        instance.showValidationMessage(validationMessage);
      } else {
        confirm(instance, innerParams, inputValue);
      }
    });
  } else if (!instance.getInput().checkValidity()) {
    instance.enableButtons();
    instance.showValidationMessage(innerParams.validationMessage);
  } else {
    confirm(instance, innerParams, inputValue);
  }
};

var succeedWith = function succeedWith(instance, value) {
  instance.closePopup({
    value: value
  });
};

var confirm = function confirm(instance, innerParams, value) {
  if (innerParams.showLoaderOnConfirm) {
    showLoading(); // TODO: make showLoading an *instance* method
  }

  if (innerParams.preConfirm) {
    instance.resetValidationMessage();
    var preConfirmPromise = Promise.resolve().then(function () {
      return innerParams.preConfirm(value, innerParams.validationMessage);
    });
    preConfirmPromise.then(function (preConfirmValue) {
      if (isVisible(getValidationMessage()) || preConfirmValue === false) {
        instance.hideLoading();
      } else {
        succeedWith(instance, typeof preConfirmValue === 'undefined' ? value : preConfirmValue);
      }
    });
  } else {
    succeedWith(instance, value);
  }
};

var addKeydownHandler = function addKeydownHandler(instance, globalState, innerParams, dismissWith) {
  if (globalState.keydownTarget && globalState.keydownHandlerAdded) {
    globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
      capture: globalState.keydownListenerCapture
    });
    globalState.keydownHandlerAdded = false;
  }

  if (!innerParams.toast) {
    globalState.keydownHandler = function (e) {
      return keydownHandler(instance, e, innerParams, dismissWith);
    };

    globalState.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup();
    globalState.keydownListenerCapture = innerParams.keydownListenerCapture;
    globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, {
      capture: globalState.keydownListenerCapture
    });
    globalState.keydownHandlerAdded = true;
  }
}; // Focus handling

var setFocus = function setFocus(innerParams, index, increment) {
  var focusableElements = getFocusableElements(); // search for visible elements and select the next possible match

  for (var i = 0; i < focusableElements.length; i++) {
    index = index + increment; // rollover to first item

    if (index === focusableElements.length) {
      index = 0; // go to last item
    } else if (index === -1) {
      index = focusableElements.length - 1;
    }

    return focusableElements[index].focus();
  } // no visible focusable elements, focus the popup


  getPopup().focus();
};
var arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Left', 'Right', 'Up', 'Down' // IE11
];
var escKeys = ['Escape', 'Esc' // IE11
];

var keydownHandler = function keydownHandler(instance, e, innerParams, dismissWith) {
  if (innerParams.stopKeydownPropagation) {
    e.stopPropagation();
  } // ENTER


  if (e.key === 'Enter') {
    handleEnter(instance, e, innerParams); // TAB
  } else if (e.key === 'Tab') {
    handleTab(e, innerParams); // ARROWS - switch focus between buttons
  } else if (arrowKeys.indexOf(e.key) !== -1) {
    handleArrows(); // ESC
  } else if (escKeys.indexOf(e.key) !== -1) {
    handleEsc(e, innerParams, dismissWith);
  }
};

var handleEnter = function handleEnter(instance, e, innerParams) {
  // #720 #721
  if (e.isComposing) {
    return;
  }

  if (e.target && instance.getInput() && e.target.outerHTML === instance.getInput().outerHTML) {
    if (['textarea', 'file'].indexOf(innerParams.input) !== -1) {
      return; // do not submit
    }

    clickConfirm();
    e.preventDefault();
  }
};

var handleTab = function handleTab(e, innerParams) {
  var targetElement = e.target;
  var focusableElements = getFocusableElements();
  var btnIndex = -1;

  for (var i = 0; i < focusableElements.length; i++) {
    if (targetElement === focusableElements[i]) {
      btnIndex = i;
      break;
    }
  }

  if (!e.shiftKey) {
    // Cycle to the next button
    setFocus(innerParams, btnIndex, 1);
  } else {
    // Cycle to the prev button
    setFocus(innerParams, btnIndex, -1);
  }

  e.stopPropagation();
  e.preventDefault();
};

var handleArrows = function handleArrows() {
  var confirmButton = getConfirmButton();
  var cancelButton = getCancelButton(); // focus Cancel button if Confirm button is currently focused

  if (document.activeElement === confirmButton && isVisible(cancelButton)) {
    cancelButton.focus(); // and vice versa
  } else if (document.activeElement === cancelButton && isVisible(confirmButton)) {
    confirmButton.focus();
  }
};

var handleEsc = function handleEsc(e, innerParams, dismissWith) {
  if (callIfFunction(innerParams.allowEscapeKey)) {
    e.preventDefault();
    dismissWith(DismissReason.esc);
  }
};

var handlePopupClick = function handlePopupClick(domCache, innerParams, dismissWith) {
  if (innerParams.toast) {
    handleToastClick(domCache, innerParams, dismissWith);
  } else {
    // Ignore click events that had mousedown on the popup but mouseup on the container
    // This can happen when the user drags a slider
    handleModalMousedown(domCache); // Ignore click events that had mousedown on the container but mouseup on the popup

    handleContainerMousedown(domCache);
    handleModalClick(domCache, innerParams, dismissWith);
  }
};

var handleToastClick = function handleToastClick(domCache, innerParams, dismissWith) {
  // Closing toast by internal click
  domCache.popup.onclick = function () {
    if (innerParams.showConfirmButton || innerParams.showCancelButton || innerParams.showCloseButton || innerParams.input) {
      return;
    }

    dismissWith(DismissReason.close);
  };
};

var ignoreOutsideClick = false;

var handleModalMousedown = function handleModalMousedown(domCache) {
  domCache.popup.onmousedown = function () {
    domCache.container.onmouseup = function (e) {
      domCache.container.onmouseup = undefined; // We only check if the mouseup target is the container because usually it doesn't
      // have any other direct children aside of the popup

      if (e.target === domCache.container) {
        ignoreOutsideClick = true;
      }
    };
  };
};

var handleContainerMousedown = function handleContainerMousedown(domCache) {
  domCache.container.onmousedown = function () {
    domCache.popup.onmouseup = function (e) {
      domCache.popup.onmouseup = undefined; // We also need to check if the mouseup target is a child of the popup

      if (e.target === domCache.popup || domCache.popup.contains(e.target)) {
        ignoreOutsideClick = true;
      }
    };
  };
};

var handleModalClick = function handleModalClick(domCache, innerParams, dismissWith) {
  domCache.container.onclick = function (e) {
    if (ignoreOutsideClick) {
      ignoreOutsideClick = false;
      return;
    }

    if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
      dismissWith(DismissReason.backdrop);
    }
  };
};

function _main(userParams) {
  showWarningsForParams(userParams); // Check if there is another Swal closing

  if (getPopup() && globalState.swalCloseEventFinishedCallback) {
    globalState.swalCloseEventFinishedCallback();
    delete globalState.swalCloseEventFinishedCallback;
  } // Check if there is a swal disposal defer timer


  if (globalState.deferDisposalTimer) {
    clearTimeout(globalState.deferDisposalTimer);
    delete globalState.deferDisposalTimer;
  }

  var innerParams = _extends({}, defaultParams, userParams);

  setParameters(innerParams);
  Object.freeze(innerParams); // clear the previous timer

  if (globalState.timeout) {
    globalState.timeout.stop();
    delete globalState.timeout;
  } // clear the restore focus timeout


  clearTimeout(globalState.restoreFocusTimeout);
  var domCache = populateDomCache(this);
  render(this, innerParams);
  privateProps.innerParams.set(this, innerParams);
  return swalPromise(this, domCache, innerParams);
}

var swalPromise = function swalPromise(instance, domCache, innerParams) {
  return new Promise(function (resolve) {
    // functions to handle all closings/dismissals
    var dismissWith = function dismissWith(dismiss) {
      instance.closePopup({
        dismiss: dismiss
      });
    };

    privateMethods.swalPromiseResolve.set(instance, resolve);
    setupTimer(globalState, innerParams, dismissWith);

    domCache.confirmButton.onclick = function () {
      return handleConfirmButtonClick(instance, innerParams);
    };

    domCache.cancelButton.onclick = function () {
      return handleCancelButtonClick(instance, dismissWith);
    };

    domCache.closeButton.onclick = function () {
      return dismissWith(DismissReason.close);
    };

    handlePopupClick(domCache, innerParams, dismissWith);
    addKeydownHandler(instance, globalState, innerParams, dismissWith);

    if (innerParams.toast && (innerParams.input || innerParams.footer || innerParams.showCloseButton)) {
      addClass(document.body, swalClasses['toast-column']);
    } else {
      removeClass(document.body, swalClasses['toast-column']);
    }

    handleInputOptionsAndValue(instance, innerParams);
    openPopup(innerParams);
    initFocus(domCache, innerParams); // Scroll container to top on open (#1247)

    domCache.container.scrollTop = 0;
  });
};

var populateDomCache = function populateDomCache(instance) {
  var domCache = {
    popup: getPopup(),
    container: getContainer(),
    content: getContent(),
    actions: getActions(),
    confirmButton: getConfirmButton(),
    cancelButton: getCancelButton(),
    closeButton: getCloseButton(),
    validationMessage: getValidationMessage(),
    progressSteps: getProgressSteps()
  };
  privateProps.domCache.set(instance, domCache);
  return domCache;
};

var setupTimer = function setupTimer(globalState$$1, innerParams, dismissWith) {
  if (innerParams.timer) {
    globalState$$1.timeout = new Timer(function () {
      dismissWith('timer');
      delete globalState$$1.timeout;
    }, innerParams.timer);
  }
};

var initFocus = function initFocus(domCache, innerParams) {
  if (innerParams.toast) {
    return;
  }

  if (!callIfFunction(innerParams.allowEnterKey)) {
    return blurActiveElement();
  }

  if (innerParams.focusCancel && isVisible(domCache.cancelButton)) {
    return domCache.cancelButton.focus();
  }

  if (innerParams.focusConfirm && isVisible(domCache.confirmButton)) {
    return domCache.confirmButton.focus();
  }

  setFocus(innerParams, -1, 1);
};

var blurActiveElement = function blurActiveElement() {
  if (document.activeElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur();
  }
};

/**
 * Updates popup parameters.
 */

function update(params) {
  var popup = getPopup();

  if (!popup || hasClass(popup, swalClasses.hide)) {
    return warn("You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.");
  }

  var validUpdatableParams = {}; // assign valid params from `params` to `defaults`

  Object.keys(params).forEach(function (param) {
    if (Swal.isUpdatableParameter(param)) {
      validUpdatableParams[param] = params[param];
    } else {
      warn("Invalid parameter to update: \"".concat(param, "\". Updatable params are listed here: https://github.com/sweetalert2/sweetalert2/blob/master/src/utils/params.js"));
    }
  });
  var innerParams = privateProps.innerParams.get(this);

  var updatedParams = _extends({}, innerParams, validUpdatableParams);

  render(this, updatedParams);
  privateProps.innerParams.set(this, updatedParams);
  Object.defineProperties(this, {
    params: {
      value: _extends({}, this.params, params),
      writable: false,
      enumerable: true
    }
  });
}



var instanceMethods = Object.freeze({
	hideLoading: hideLoading,
	disableLoading: hideLoading,
	getInput: getInput$1,
	close: close,
	closePopup: close,
	closeModal: close,
	closeToast: close,
	enableButtons: enableButtons,
	disableButtons: disableButtons,
	enableConfirmButton: enableConfirmButton,
	disableConfirmButton: disableConfirmButton,
	enableInput: enableInput,
	disableInput: disableInput,
	showValidationMessage: showValidationMessage,
	resetValidationMessage: resetValidationMessage$1,
	getProgressSteps: getProgressSteps$1,
	setProgressSteps: setProgressSteps,
	showProgressSteps: showProgressSteps,
	hideProgressSteps: hideProgressSteps,
	_main: _main,
	update: update
});

var currentInstance; // SweetAlert constructor

function SweetAlert() {
  // Prevent run in Node env

  /* istanbul ignore if */
  if (typeof window === 'undefined') {
    return;
  } // Check for the existence of Promise

  /* istanbul ignore if */


  if (typeof Promise === 'undefined') {
    error('This package requires a Promise library, please include a shim to enable it in this browser (See: https://github.com/sweetalert2/sweetalert2/wiki/Migration-from-SweetAlert-to-SweetAlert2#1-ie-support)');
  }

  currentInstance = this;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var outerParams = Object.freeze(this.constructor.argsToParams(args));
  Object.defineProperties(this, {
    params: {
      value: outerParams,
      writable: false,
      enumerable: true,
      configurable: true
    }
  });

  var promise = this._main(this.params);

  privateProps.promise.set(this, promise);
} // `catch` cannot be the name of a module export, so we define our thenable methods here instead


SweetAlert.prototype.then = function (onFulfilled) {
  var promise = privateProps.promise.get(this);
  return promise.then(onFulfilled);
};

SweetAlert.prototype["finally"] = function (onFinally) {
  var promise = privateProps.promise.get(this);
  return promise["finally"](onFinally);
}; // Assign instance methods from src/instanceMethods/*.js to prototype


_extends(SweetAlert.prototype, instanceMethods); // Assign static methods from src/staticMethods/*.js to constructor


_extends(SweetAlert, staticMethods); // Proxy to instance methods to constructor, for now, for backwards compatibility


Object.keys(instanceMethods).forEach(function (key) {
  SweetAlert[key] = function () {
    if (currentInstance) {
      var _currentInstance;

      return (_currentInstance = currentInstance)[key].apply(_currentInstance, arguments);
    }
  };
});
SweetAlert.DismissReason = DismissReason;
SweetAlert.version = '8.19.0';

var Swal = SweetAlert;
Swal["default"] = Swal;

return Swal;

})));
if (typeof this !== 'undefined' && this.Sweetalert2){  this.swal = this.sweetAlert = this.Swal = this.SweetAlert = this.Sweetalert2}

"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t}catch(e){n.innerText=t}}(document,"@charset \"UTF-8\";.swal2-popup.swal2-toast{flex-direction:row;align-items:center;width:auto;padding:.625em;overflow-y:hidden;box-shadow:0 0 .625em #d9d9d9}.swal2-popup.swal2-toast .swal2-header{flex-direction:row}.swal2-popup.swal2-toast .swal2-title{flex-grow:1;justify-content:flex-start;margin:0 .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{position:static;width:.8em;height:.8em;line-height:.8}.swal2-popup.swal2-toast .swal2-content{justify-content:flex-start;font-size:1em}.swal2-popup.swal2-toast .swal2-icon{width:2em;min-width:2em;height:2em;margin:0}.swal2-popup.swal2-toast .swal2-icon::before{display:flex;align-items:center;font-size:2em;font-weight:700}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-popup.swal2-toast .swal2-icon::before{font-size:.25em}}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{flex-basis:auto!important;width:auto;height:auto;margin:0 .3125em}.swal2-popup.swal2-toast .swal2-styled{margin:0 .3125em;padding:.3125em .625em;font-size:1em}.swal2-popup.swal2-toast .swal2-styled:focus{box-shadow:0 0 0 .0625em #fff,0 0 0 .125em rgba(50,100,150,.4)}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.8em;left:-.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast.swal2-show{-webkit-animation:swal2-toast-show .5s;animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{-webkit-animation:swal2-toast-hide .1s forwards;animation:swal2-toast-hide .1s forwards}.swal2-popup.swal2-toast .swal2-animate-success-icon .swal2-success-line-tip{-webkit-animation:swal2-toast-animate-success-line-tip .75s;animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-animate-success-icon .swal2-success-line-long{-webkit-animation:swal2-toast-animate-success-line-long .75s;animation:swal2-toast-animate-success-line-long .75s}.swal2-container{display:flex;position:fixed;z-index:1060;top:0;right:0;bottom:0;left:0;flex-direction:row;align-items:center;justify-content:center;padding:.625em;overflow-x:hidden;transition:background-color .1s;background-color:transparent;-webkit-overflow-scrolling:touch}.swal2-container.swal2-top{align-items:flex-start}.swal2-container.swal2-top-left,.swal2-container.swal2-top-start{align-items:flex-start;justify-content:flex-start}.swal2-container.swal2-top-end,.swal2-container.swal2-top-right{align-items:flex-start;justify-content:flex-end}.swal2-container.swal2-center{align-items:center}.swal2-container.swal2-center-left,.swal2-container.swal2-center-start{align-items:center;justify-content:flex-start}.swal2-container.swal2-center-end,.swal2-container.swal2-center-right{align-items:center;justify-content:flex-end}.swal2-container.swal2-bottom{align-items:flex-end}.swal2-container.swal2-bottom-left,.swal2-container.swal2-bottom-start{align-items:flex-end;justify-content:flex-start}.swal2-container.swal2-bottom-end,.swal2-container.swal2-bottom-right{align-items:flex-end;justify-content:flex-end}.swal2-container.swal2-bottom-end>:first-child,.swal2-container.swal2-bottom-left>:first-child,.swal2-container.swal2-bottom-right>:first-child,.swal2-container.swal2-bottom-start>:first-child,.swal2-container.swal2-bottom>:first-child{margin-top:auto}.swal2-container.swal2-grow-fullscreen>.swal2-modal{display:flex!important;flex:1;align-self:stretch;justify-content:center}.swal2-container.swal2-grow-row>.swal2-modal{display:flex!important;flex:1;align-content:center;justify-content:center}.swal2-container.swal2-grow-column{flex:1;flex-direction:column}.swal2-container.swal2-grow-column.swal2-bottom,.swal2-container.swal2-grow-column.swal2-center,.swal2-container.swal2-grow-column.swal2-top{align-items:center}.swal2-container.swal2-grow-column.swal2-bottom-left,.swal2-container.swal2-grow-column.swal2-bottom-start,.swal2-container.swal2-grow-column.swal2-center-left,.swal2-container.swal2-grow-column.swal2-center-start,.swal2-container.swal2-grow-column.swal2-top-left,.swal2-container.swal2-grow-column.swal2-top-start{align-items:flex-start}.swal2-container.swal2-grow-column.swal2-bottom-end,.swal2-container.swal2-grow-column.swal2-bottom-right,.swal2-container.swal2-grow-column.swal2-center-end,.swal2-container.swal2-grow-column.swal2-center-right,.swal2-container.swal2-grow-column.swal2-top-end,.swal2-container.swal2-grow-column.swal2-top-right{align-items:flex-end}.swal2-container.swal2-grow-column>.swal2-modal{display:flex!important;flex:1;align-content:center;justify-content:center}.swal2-container:not(.swal2-top):not(.swal2-top-start):not(.swal2-top-end):not(.swal2-top-left):not(.swal2-top-right):not(.swal2-center-start):not(.swal2-center-end):not(.swal2-center-left):not(.swal2-center-right):not(.swal2-bottom):not(.swal2-bottom-start):not(.swal2-bottom-end):not(.swal2-bottom-left):not(.swal2-bottom-right):not(.swal2-grow-fullscreen)>.swal2-modal{margin:auto}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-container .swal2-modal{margin:0!important}}.swal2-container.swal2-shown{background-color:rgba(0,0,0,.4)}.swal2-popup{display:none;position:relative;box-sizing:border-box;flex-direction:column;justify-content:center;width:32em;max-width:100%;padding:1.25em;border:none;border-radius:.3125em;background:#fff;font-family:inherit;font-size:1rem}.swal2-popup:focus{outline:0}.swal2-popup.swal2-loading{overflow-y:hidden}.swal2-header{display:flex;flex-direction:column;align-items:center}.swal2-title{position:relative;max-width:100%;margin:0 0 .4em;padding:0;color:#595959;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}.swal2-actions{display:flex;z-index:1;flex-wrap:wrap;align-items:center;justify-content:center;width:100%;margin:1.25em auto 0}.swal2-actions:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}.swal2-actions:not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1))}.swal2-actions:not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))}.swal2-actions.swal2-loading .swal2-styled.swal2-confirm{box-sizing:border-box;width:2.5em;height:2.5em;margin:.46875em;padding:0;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border:.25em solid transparent;border-radius:100%;border-color:transparent;background-color:transparent!important;color:transparent;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-actions.swal2-loading .swal2-styled.swal2-cancel{margin-right:30px;margin-left:30px}.swal2-actions.swal2-loading :not(.swal2-styled).swal2-confirm::after{content:\"\";display:inline-block;width:15px;height:15px;margin-left:5px;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border:3px solid #999;border-radius:50%;border-right-color:transparent;box-shadow:1px 1px 1px #fff}.swal2-styled{margin:.3125em;padding:.625em 2em;box-shadow:none;font-weight:500}.swal2-styled:not([disabled]){cursor:pointer}.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#3085d6;color:#fff;font-size:1.0625em}.swal2-styled.swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#aaa;color:#fff;font-size:1.0625em}.swal2-styled:focus{outline:0;box-shadow:0 0 0 2px #fff,0 0 0 4px rgba(50,100,150,.4)}.swal2-styled::-moz-focus-inner{border:0}.swal2-footer{justify-content:center;margin:1.25em 0 0;padding:1em 0 0;border-top:1px solid #eee;color:#545454;font-size:1em}.swal2-image{max-width:100%;margin:1.25em auto}.swal2-close{position:absolute;z-index:2;top:0;right:0;justify-content:center;width:1.2em;height:1.2em;padding:0;overflow:hidden;transition:color .1s ease-out;border:none;border-radius:0;outline:initial;background:0 0;color:#ccc;font-family:serif;font-size:2.5em;line-height:1.2;cursor:pointer}.swal2-close:hover{transform:none;background:0 0;color:#f27474}.swal2-content{z-index:1;justify-content:center;margin:0;padding:0;color:#545454;font-size:1.125em;font-weight:400;line-height:normal;text-align:center;word-wrap:break-word}.swal2-checkbox,.swal2-file,.swal2-input,.swal2-radio,.swal2-select,.swal2-textarea{margin:1em auto}.swal2-file,.swal2-input,.swal2-textarea{box-sizing:border-box;width:100%;transition:border-color .3s,box-shadow .3s;border:1px solid #d9d9d9;border-radius:.1875em;background:inherit;box-shadow:inset 0 1px 1px rgba(0,0,0,.06);color:inherit;font-size:1.125em}.swal2-file.swal2-inputerror,.swal2-input.swal2-inputerror,.swal2-textarea.swal2-inputerror{border-color:#f27474!important;box-shadow:0 0 2px #f27474!important}.swal2-file:focus,.swal2-input:focus,.swal2-textarea:focus{border:1px solid #b4dbed;outline:0;box-shadow:0 0 3px #c4e6f5}.swal2-file::-webkit-input-placeholder,.swal2-input::-webkit-input-placeholder,.swal2-textarea::-webkit-input-placeholder{color:#ccc}.swal2-file::-moz-placeholder,.swal2-input::-moz-placeholder,.swal2-textarea::-moz-placeholder{color:#ccc}.swal2-file:-ms-input-placeholder,.swal2-input:-ms-input-placeholder,.swal2-textarea:-ms-input-placeholder{color:#ccc}.swal2-file::-ms-input-placeholder,.swal2-input::-ms-input-placeholder,.swal2-textarea::-ms-input-placeholder{color:#ccc}.swal2-file::placeholder,.swal2-input::placeholder,.swal2-textarea::placeholder{color:#ccc}.swal2-range{margin:1em auto;background:inherit}.swal2-range input{width:80%}.swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}.swal2-range input,.swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}.swal2-input{height:2.625em;padding:0 .75em}.swal2-input[type=number]{max-width:10em}.swal2-file{background:inherit;font-size:1.125em}.swal2-textarea{height:6.75em;padding:.75em}.swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:inherit;color:inherit;font-size:1.125em}.swal2-checkbox,.swal2-radio{align-items:center;justify-content:center;background:inherit;color:inherit}.swal2-checkbox label,.swal2-radio label{margin:0 .6em;font-size:1.125em}.swal2-checkbox input,.swal2-radio input{margin:0 .4em}.swal2-validation-message{display:none;align-items:center;justify-content:center;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}.swal2-validation-message::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}.swal2-icon{position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:1.25em auto 1.875em;border:.25em solid transparent;border-radius:50%;font-family:inherit;line-height:5em;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-icon::before{display:flex;align-items:center;height:92%;font-size:3.75em}.swal2-icon.swal2-error{border-color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;flex-grow:1}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}.swal2-icon.swal2-warning{border-color:#facea8;color:#f8bb86}.swal2-icon.swal2-warning::before{content:\"!\"}.swal2-icon.swal2-info{border-color:#9de0f6;color:#3fc3ee}.swal2-icon.swal2-info::before{content:\"i\"}.swal2-icon.swal2-question{border-color:#c9dae1;color:#87adbd}.swal2-icon.swal2-question::before{content:\"?\"}.swal2-icon.swal2-question.swal2-arabic-question-mark::before{content:\"؟\"}.swal2-icon.swal2-success{border-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}.swal2-icon.swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-.25em;left:-.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}.swal2-icon.swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}.swal2-icon.swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.875em;width:1.5625em;transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}.swal2-progress-steps{align-items:center;margin:0 0 1.25em;padding:0;background:inherit;font-weight:600}.swal2-progress-steps li{display:inline-block;position:relative}.swal2-progress-steps .swal2-progress-step{z-index:20;width:2em;height:2em;border-radius:2em;background:#3085d6;color:#fff;line-height:2em;text-align:center}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#3085d6}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}.swal2-progress-steps .swal2-progress-step-line{z-index:10;width:2.5em;height:.4em;margin:0 -1px;background:#3085d6}[class^=swal2]{-webkit-tap-highlight-color:transparent}.swal2-show{-webkit-animation:swal2-show .3s;animation:swal2-show .3s}.swal2-show.swal2-noanimation{-webkit-animation:none;animation:none}.swal2-hide{-webkit-animation:swal2-hide .15s forwards;animation:swal2-hide .15s forwards}.swal2-hide.swal2-noanimation{-webkit-animation:none;animation:none}.swal2-rtl .swal2-close{right:auto;left:0}.swal2-animate-success-icon .swal2-success-line-tip{-webkit-animation:swal2-animate-success-line-tip .75s;animation:swal2-animate-success-line-tip .75s}.swal2-animate-success-icon .swal2-success-line-long{-webkit-animation:swal2-animate-success-line-long .75s;animation:swal2-animate-success-line-long .75s}.swal2-animate-success-icon .swal2-success-circular-line-right{-webkit-animation:swal2-rotate-success-circular-line 4.25s ease-in;animation:swal2-rotate-success-circular-line 4.25s ease-in}.swal2-animate-error-icon{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-animate-error-icon .swal2-x-mark{-webkit-animation:swal2-animate-error-x-mark .5s;animation:swal2-animate-error-x-mark .5s}@supports (-ms-accelerator:true){.swal2-range input{width:100%!important}.swal2-range output{display:none}}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-range input{width:100%!important}.swal2-range output{display:none}}@-moz-document url-prefix(){.swal2-close:focus{outline:2px solid rgba(50,100,150,.4)}}@-webkit-keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@-webkit-keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@-webkit-keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@-webkit-keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@-webkit-keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@-webkit-keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@-webkit-keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.875em;width:1.5625em}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.875em;width:1.5625em}}@-webkit-keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@-webkit-keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@-webkit-keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@-webkit-keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@-webkit-keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto!important}body.swal2-no-backdrop .swal2-shown{top:auto;right:auto;bottom:auto;left:auto;max-width:calc(100% - .625em * 2);background-color:transparent}body.swal2-no-backdrop .swal2-shown>.swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}body.swal2-no-backdrop .swal2-shown.swal2-top{top:0;left:50%;transform:translateX(-50%)}body.swal2-no-backdrop .swal2-shown.swal2-top-left,body.swal2-no-backdrop .swal2-shown.swal2-top-start{top:0;left:0}body.swal2-no-backdrop .swal2-shown.swal2-top-end,body.swal2-no-backdrop .swal2-shown.swal2-top-right{top:0;right:0}body.swal2-no-backdrop .swal2-shown.swal2-center{top:50%;left:50%;transform:translate(-50%,-50%)}body.swal2-no-backdrop .swal2-shown.swal2-center-left,body.swal2-no-backdrop .swal2-shown.swal2-center-start{top:50%;left:0;transform:translateY(-50%)}body.swal2-no-backdrop .swal2-shown.swal2-center-end,body.swal2-no-backdrop .swal2-shown.swal2-center-right{top:50%;right:0;transform:translateY(-50%)}body.swal2-no-backdrop .swal2-shown.swal2-bottom{bottom:0;left:50%;transform:translateX(-50%)}body.swal2-no-backdrop .swal2-shown.swal2-bottom-left,body.swal2-no-backdrop .swal2-shown.swal2-bottom-start{bottom:0;left:0}body.swal2-no-backdrop .swal2-shown.swal2-bottom-end,body.swal2-no-backdrop .swal2-shown.swal2-bottom-right{right:0;bottom:0}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll!important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static!important}}body.swal2-toast-shown .swal2-container{background-color:transparent}body.swal2-toast-shown .swal2-container.swal2-shown{background-color:transparent}body.swal2-toast-shown .swal2-container.swal2-top{top:0;right:auto;bottom:auto;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{top:0;right:0;bottom:auto;left:auto}body.swal2-toast-shown .swal2-container.swal2-top-left,body.swal2-toast-shown .swal2-container.swal2-top-start{top:0;right:auto;bottom:auto;left:0}body.swal2-toast-shown .swal2-container.swal2-center-left,body.swal2-toast-shown .swal2-container.swal2-center-start{top:50%;right:auto;bottom:auto;left:0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{top:50%;right:auto;bottom:auto;left:50%;transform:translate(-50%,-50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{top:50%;right:0;bottom:auto;left:auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-left,body.swal2-toast-shown .swal2-container.swal2-bottom-start{top:auto;right:auto;bottom:0;left:0}body.swal2-toast-shown .swal2-container.swal2-bottom{top:auto;right:auto;bottom:0;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{top:auto;right:0;bottom:0;left:auto}body.swal2-toast-column .swal2-toast{flex-direction:column;align-items:stretch}body.swal2-toast-column .swal2-toast .swal2-actions{flex:1;align-self:stretch;height:2.2em;margin-top:.3125em}body.swal2-toast-column .swal2-toast .swal2-loading{justify-content:center}body.swal2-toast-column .swal2-toast .swal2-input{height:2em;margin:.3125em auto;font-size:1em}body.swal2-toast-column .swal2-toast .swal2-validation-message{font-size:1em}");

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/*!*********************************************!*\
  !*** ./modules/consent/jsx/consentEntry.js ***!
  \*********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _e_consent_basicConsentForm__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./e_consent/basicConsentForm */ "./modules/consent/jsx/e_consent/basicConsentForm.js");
/* harmony import */ var _e_consent_trainingConsentForm__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./e_consent/trainingConsentForm */ "./modules/consent/jsx/e_consent/trainingConsentForm.js");
/* harmony import */ var Loader__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! Loader */ "./jsx/Loader.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_10__);






function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * This file contains React component for EConsent entry
 *
 * @author Camille Beaudoin
 *
 */






/**
 * Consent Entry
 *
 * Mdule component of eConsent entry
 *
 * @author Camille Beaudoin
 */
var ConsentEntry = /*#__PURE__*/function (_React$Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__["default"])(ConsentEntry, _React$Component);
  var _super = _createSuper(ConsentEntry);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function ConsentEntry(props) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, ConsentEntry);
    _this = _super.call(this, props);

    // set up state values
    var url = window.location;
    if (!window.location.origin) {
      url.origin = url.protocol + '//' + url.hostname + (url.port ? ':' + url.port : '');
    }
    _this.state = {
      consentData: {},
      requestStatus: '',
      isLoaded: false,
      not_found: false,
      data_url: url.origin + '/consent/direct_consent' + url.search
    };
    _this.fetchData = _this.fetchData.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.submit = _this.submit.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    return _this;
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(ConsentEntry, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetchData();
      this.setState({
        isLoaded: true
      });
    }

    /**
     * Retrieve data from the provided URL and save it in state
     *
     * @return {object}
     */
  }, {
    key: "fetchData",
    value: function fetchData() {
      var _this2 = this;
      return fetch(this.state.data_url, {
        credentials: 'same-origin'
      }).then(function (resp) {
        return resp.json();
      }).then(function (data) {
        return _this2.setState({
          consentData: data.consentData,
          requestStatus: data.requestStatus,
          not_found: data.not_found
        });
      })["catch"](function (error) {
        _this2.setState({
          error: true
        });
        console.error(error);
      });
    }

    /**
     * Submit consent to update database
     *
     * @param {array} consentAnswers - Consent answer per consent code
     * @param {object} customSwal - Customized swal object for success
     * @return {object} promise
     */
  }, {
    key: "submit",
    value: function submit(consentAnswers) {
      var _this3 = this;
      var customSwal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      // Add each consent answer to form object
      var formObj = new FormData();
      for (var property in consentAnswers) {
        if (consentAnswers.hasOwnProperty(property)) {
          formObj.append(property, consentAnswers[property]);
        }
      }

      // Post data
      var actionUrl = this.state.data_url + '&action=submit';
      return fetch(actionUrl, {
        method: 'POST',
        body: formObj,
        cache: 'no-cache'
      }).then(function (response) {
        if (response.ok) {
          // Give success message in swal
          // Customizeable for specific swal message / buttons
          if (customSwal === null) {
            sweetalert2__WEBPACK_IMPORTED_MODULE_10___default().fire('Success!', 'Thank you for completing this section of the eConsent form', 'success');
          } else {
            customSwal();
          }
          _this3.fetchData();
          _this3.render();
          return Promise.resolve();
        } else {
          // If errors, give error message
          var msg = response.statusText ? response.statusText : 'Submission Error!';
          sweetalert2__WEBPACK_IMPORTED_MODULE_10___default().fire(msg, '', 'error');
          console.error(msg);
          return Promise.reject();
        }
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
      // Render basic eConsent page or eConsent training page,
      // not found page, or loading page
      if (this.state.not_found) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("h3", null, "Sorry, we could not find the form you are looking for"));
      } else if (Object.keys(this.state.consentData).length === 0 || !this.state.isLoaded) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(Loader__WEBPACK_IMPORTED_MODULE_9__["default"], null);
      } else if (this.state.consentData.training) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(_e_consent_trainingConsentForm__WEBPACK_IMPORTED_MODULE_8__["default"], {
          consentData: this.state.consentData,
          submit: this.submit,
          data_url: this.state.data_url
        });
      } else {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(_e_consent_basicConsentForm__WEBPACK_IMPORTED_MODULE_7__["default"], {
          consentData: this.state.consentData,
          requestStatus: this.state.requestStatus,
          submit: this.submit,
          data_url: this.state.data_url
        });
      }
    }
  }]);
  return ConsentEntry;
}((react__WEBPACK_IMPORTED_MODULE_6___default().Component));
window.addEventListener('load', function () {
  ReactDOM.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", {
    id: "lorisworkspace",
    style: {
      margin: 'auto'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(ConsentEntry, null)), document.getElementById('lorisworkspace'));
});
})();

((window.lorisjs = window.lorisjs || {}).consent = window.lorisjs.consent || {}).consentEntry = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=consentEntry.js.map