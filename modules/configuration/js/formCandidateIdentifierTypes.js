/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./jsx/Form.js"
/*!*********************!*\
  !*** ./jsx/Form.js ***!
  \*********************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof3 = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.TimeElement = exports.TextboxElement = exports.TextareaElement = exports.TagsElement = exports.StaticElement = exports.SliderElement = exports.SelectElement = exports.SearchableDropdown = exports.RadioElement = exports.PasswordElement = exports.NumericRangeElement = exports.NumericElement = exports.LorisElement = exports.LinkElement = exports.HeaderElement = exports.FormElement = exports.FileElement = exports.FieldsetElement = exports.EmailElement = exports.DateTimeElement = exports.DateRangeElement = exports.DateElement = exports.CheckboxElement = exports.CTA = exports.ButtonElement = void 0;
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js"));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js"));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _InputLabel = _interopRequireDefault(__webpack_require__(/*! jsx/form/InputLabel */ "./jsx/form/InputLabel.tsx"));
var _reactI18next = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/index.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof3(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) { if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } } return n["default"] = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _createSuper(t) { var r = _isNativeReflectConstruct(); return function () { var e, o = (0, _getPrototypeOf2["default"])(t); if (r) { var s = (0, _getPrototypeOf2["default"])(this).constructor; e = Reflect.construct(o, arguments, s); } else e = o.apply(this, arguments); return (0, _possibleConstructorReturn2["default"])(this, e); }; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); } /**
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
var FormElement = exports.FormElement = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(FormElement, _Component);
  var _super = _createSuper(FormElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function FormElement(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, FormElement);
    _this = _super.call(this, props);
    _this.getFormElements = _this.getFormElements.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleSubmit = _this.handleSubmit.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  /**
   * Get form elements
   *
   * @return {JSX[]} - An array of element React markup
   */
  (0, _createClass2["default"])(FormElement, [{
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
        formElementsHTML.push(/*#__PURE__*/_react["default"].createElement("div", {
          key: 'el_' + index,
          className: colClass
        }, /*#__PURE__*/_react["default"].createElement(LorisElement, {
          element: filter[objKey],
          onUserInput: userInput,
          value: value
        })));
      }.bind(this));

      // Render elements from React
      _react["default"].Children.forEach(this.props.children, function (child, key) {
        // If child is plain HTML, insert it as full size.
        // Useful for inserting <hr> to split form sections
        var elementClass = 'col-xs-12 col-sm-12 col-md-12';

        // If child is form element use appropriate size
        if (/*#__PURE__*/_react["default"].isValidElement(child) && typeof child.type === 'function') {
          elementClass = colClass;
        }
        formElementsHTML.push(/*#__PURE__*/_react["default"].createElement("div", {
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
      return /*#__PURE__*/_react["default"].createElement("form", {
        name: this.props.name,
        id: this.props.id,
        className: this.props["class"],
        method: this.props.method,
        action: this.props.action,
        encType: encType,
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "row",
        style: rowStyles
      }, formElements));
    }
  }]);
  return FormElement;
}(_react.Component);
FormElement.propTypes = {
  name: _propTypes["default"].string.isRequired,
  id: _propTypes["default"].string,
  method: _propTypes["default"].oneOf(['POST', 'GET']),
  action: _propTypes["default"].string,
  "class": _propTypes["default"].string,
  columns: _propTypes["default"].number,
  formElements: _propTypes["default"].shape({
    elementName: _propTypes["default"].shape({
      name: _propTypes["default"].string,
      type: _propTypes["default"].string
    })
  }),
  onSubmit: _propTypes["default"].func,
  onUserInput: _propTypes["default"].func,
  children: _propTypes["default"].node,
  fileUpload: _propTypes["default"].bool
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
var FieldsetElement = exports.FieldsetElement = /*#__PURE__*/function (_Component2) {
  (0, _inherits2["default"])(FieldsetElement, _Component2);
  var _super2 = _createSuper(FieldsetElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function FieldsetElement(props) {
    var _this2;
    (0, _classCallCheck2["default"])(this, FieldsetElement);
    _this2 = _super2.call(this, props);
    _this2.getFormElements = _this2.getFormElements.bind((0, _assertThisInitialized2["default"])(_this2));
    return _this2;
  }

  /**
   * Get form elements
   *
   * @return {JSX[]} - An array of element React markup
   */
  (0, _createClass2["default"])(FieldsetElement, [{
    key: "getFormElements",
    value: function getFormElements() {
      var formElementsHTML = [];
      var columns = this.props.columns;
      var maxColumnSize = 12;
      var colSize = Math.floor(maxColumnSize / columns);
      var colClass = 'col-xs-12 col-sm-' + colSize + ' col-md-' + colSize;

      // Render elements from React
      _react["default"].Children.forEach(this.props.children, function (child, key) {
        // If child is plain HTML, insert it as full size.
        // Useful for inserting <hr> to split form sections
        var elementClass = 'col-xs-12 col-sm-12 col-md-12';

        // If child is form element use appropriate size
        if (/*#__PURE__*/_react["default"].isValidElement(child) && typeof child.type === 'function') {
          elementClass = colClass;
        }
        formElementsHTML.push(/*#__PURE__*/_react["default"].createElement("div", {
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
      return /*#__PURE__*/_react["default"].createElement("fieldset", {
        name: this.props.name
      }, /*#__PURE__*/_react["default"].createElement("legend", null, this.props.legend), formElements);
    }
  }]);
  return FieldsetElement;
}(_react.Component);
FieldsetElement.propTypes = {
  columns: _propTypes["default"].number,
  name: _propTypes["default"].string,
  legend: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].node]),
  children: _propTypes["default"].node
};
FieldsetElement.defaultProps = {
  columns: 1,
  legend: 'Selection Filter'
};

/**
 * Search Component
 * React wrapper for a searchable dropdown
 */
var SearchableDropdown = exports.SearchableDropdown = /*#__PURE__*/function (_Component3) {
  (0, _inherits2["default"])(SearchableDropdown, _Component3);
  var _super3 = _createSuper(SearchableDropdown);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function SearchableDropdown(props) {
    var _this3;
    (0, _classCallCheck2["default"])(this, SearchableDropdown);
    _this3 = _super3.call(this, props);
    _this3.state = {
      currentInput: ''
    };
    _this3.getKeyFromValue = _this3.getKeyFromValue.bind((0, _assertThisInitialized2["default"])(_this3));
    _this3.handleChange = _this3.handleChange.bind((0, _assertThisInitialized2["default"])(_this3));
    _this3.handleBlur = _this3.handleBlur.bind((0, _assertThisInitialized2["default"])(_this3));
    return _this3;
  }

  /**
   * Get key from value
   *
   * @param {string} value
   * @return {string}
   */
  (0, _createClass2["default"])(SearchableDropdown, [{
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
      var sortByValue = this.props.sortByValue;
      var options = this.props.options;
      var strictMessage = 'Entry must be included in provided list of options.';
      var errorMessage = null;
      var elementClass = 'row form-group';

      // Add error message
      if (this.props.errorMessage) {
        errorMessage = /*#__PURE__*/_react["default"].createElement("span", null, this.props.errorMessage);
        elementClass = 'row form-group has-error';
      } else if (this.props.required && this.props.value === '') {
        var msg = 'This field is required!';
        msg += this.props.strictSearch ? ' ' + strictMessage : '';
        errorMessage = /*#__PURE__*/_react["default"].createElement("span", null, msg);
        elementClass = 'row form-group has-error';
      } else if (this.props.strictSearch && this.props.value === '') {
        errorMessage = /*#__PURE__*/_react["default"].createElement("span", null, strictMessage);
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
          return /*#__PURE__*/_react["default"].createElement("option", {
            value: option,
            key: newOptions[option]
          });
        });
      } else {
        optionList = Object.keys(options).map(function (option) {
          return /*#__PURE__*/_react["default"].createElement("option", {
            value: options[option],
            key: option
          });
        });
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: elementClass
      }, /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label,
        required: this.props.required
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-9"
      }, /*#__PURE__*/_react["default"].createElement("input", {
        type: "text",
        name: this.props.name + '_input',
        value: value,
        id: this.props.id,
        list: this.props.name + '_list',
        className: "form-control",
        placeholder: this.props.placeHolder,
        onChange: this.handleChange,
        onBlur: this.handleBlur,
        disabled: this.props.disabled,
        required: this.props.required
      }), /*#__PURE__*/_react["default"].createElement("datalist", {
        id: this.props.name + '_list'
      }, optionList), errorMessage));
    }
  }]);
  return SearchableDropdown;
}(_react.Component);
SearchableDropdown.propTypes = {
  name: _propTypes["default"].string.isRequired,
  options: _propTypes["default"].object.isRequired,
  id: _propTypes["default"].string,
  // strictSearch, if set to true, will require that only options
  // provided in the options prop can be submitted
  strictSearch: _propTypes["default"].bool,
  label: _propTypes["default"].string,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].array]),
  "class": _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  required: _propTypes["default"].bool,
  errorMessage: _propTypes["default"].string,
  placeHolder: _propTypes["default"].string,
  onUserInput: _propTypes["default"].func,
  sortByValue: _propTypes["default"].bool
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
  errorMessage: null,
  placeHolder: '',
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  }
};

/**
 * Select Component
 * React wrapper for a simple or 'multiple' <select> element.
 */
var SelectElement = exports.SelectElement = /*#__PURE__*/function (_Component4) {
  (0, _inherits2["default"])(SelectElement, _Component4);
  var _super4 = _createSuper(SelectElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function SelectElement(props) {
    var _this4;
    (0, _classCallCheck2["default"])(this, SelectElement);
    _this4 = _super4.call(this, props);
    _this4.handleChange = _this4.handleChange.bind((0, _assertThisInitialized2["default"])(_this4));
    return _this4;
  }

  /**
   * Call onUserInput on component rendered to select only option
   * if autoSelect prop is set to true
   */
  (0, _createClass2["default"])(SelectElement, [{
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
      var sortByValue = this.props.sortByValue;
      var options = this.props.options;
      var disabledOptions = this.props.disabledOptions;
      var errorMessage = null;
      var emptyOptionHTML = null;
      var elementClass = this.props.noMargins ? '' : 'row form-group';

      // Add empty option
      if (this.props.emptyOption) {
        emptyOptionHTML = /*#__PURE__*/_react["default"].createElement("option", null);
      }

      // Add error message
      if (this.props.errorMessage || this.props.required && this.props.value === '') {
        errorMessage = /*#__PURE__*/_react["default"].createElement("span", null, this.props.errorMessage);
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
        var sortedOptions = Object.keys(newOptions).sort();
        if (this.props.pinnedOption && options.hasOwnProperty(this.props.pinnedOption)) {
          var pinnedValue = options[this.props.pinnedOption];
          sortedOptions = sortedOptions.filter(function (option) {
            return option !== pinnedValue;
          });
          sortedOptions.unshift(pinnedValue);
        }
        optionList = sortedOptions.map(function (option) {
          var isDisabled = newOptions[option] in disabledOptions;
          return /*#__PURE__*/_react["default"].createElement("option", {
            value: newOptions[option],
            key: newOptions[option],
            disabled: isDisabled,
            title: option
          }, option);
        });
      } else {
        optionList = Object.keys(options).map(function (option) {
          var isDisabled = option in disabledOptions;
          return /*#__PURE__*/_react["default"].createElement("option", {
            value: option,
            key: option,
            disabled: isDisabled,
            title: options[option]
          }, options[option]);
        });
      }
      if (this.props.placeholder !== '') {
        optionList.unshift(/*#__PURE__*/_react["default"].createElement("option", {
          value: ''
        }, this.props.placeholder));
      }

      // Default to empty string for regular select and to empty array for 'multiple' select
      var value = this.props.value || (this.props.multiple ? [] : '');

      // Label prop needs to be provided to render label
      // (including empty label i.e. <SelectElement label='' />)
      // and retain formatting. If label prop is not provided at all, the input
      // element will take up the whole row.
      var inputClass = this.props.noMargins ? '' : 'col-sm-12';
      if (this.props.label) {
        inputClass = "col-sm-".concat(this.props.labelPlacementTop ? '12' : '9');
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: elementClass,
        style: this.props.labelPlacementTop ? {
          display: 'flex',
          flexDirection: 'column'
        } : {}
      }, this.props.label && /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label,
        required: this.props.required,
        fullWidth: this.props.labelPlacementTop
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: inputClass
      }, /*#__PURE__*/_react["default"].createElement("select", {
        name: this.props.name,
        multiple: this.props.multiple,
        className: "form-control",
        id: this.props.id,
        value: value,
        onChange: this.handleChange,
        required: this.props.required,
        disabled: this.props.disabled,
        style: {
          overflow: 'auto'
        }
      }, emptyOptionHTML, optionList), errorMessage));
    }
  }]);
  return SelectElement;
}(_react.Component);
SelectElement.propTypes = {
  name: _propTypes["default"].string.isRequired,
  options: _propTypes["default"].object.isRequired,
  disabledOptions: _propTypes["default"].object,
  label: _propTypes["default"].node,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].array]),
  id: _propTypes["default"].string,
  multiple: _propTypes["default"].bool,
  disabled: _propTypes["default"].bool,
  required: _propTypes["default"].bool,
  emptyOption: _propTypes["default"].bool,
  autoSelect: _propTypes["default"].bool,
  errorMessage: _propTypes["default"].string,
  onUserInput: _propTypes["default"].func,
  noMargins: _propTypes["default"].bool,
  placeholder: _propTypes["default"].string,
  sortByValue: _propTypes["default"].bool,
  pinnedOption: _propTypes["default"].string,
  labelPlacementTop: _propTypes["default"].bool
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
  errorMessage: null,
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  },
  noMargins: false,
  placeholder: '',
  pinnedOption: null,
  labelPlacementTop: false
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
var TagsElement = exports.TagsElement = /*#__PURE__*/function (_Component5) {
  (0, _inherits2["default"])(TagsElement, _Component5);
  var _super5 = _createSuper(TagsElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function TagsElement(props) {
    var _this5;
    (0, _classCallCheck2["default"])(this, TagsElement);
    _this5 = _super5.call(this, props);
    _this5.handleChange = _this5.handleChange.bind((0, _assertThisInitialized2["default"])(_this5));
    _this5.handleKeyPress = _this5.handleKeyPress.bind((0, _assertThisInitialized2["default"])(_this5));
    _this5.handleAdd = _this5.handleAdd.bind((0, _assertThisInitialized2["default"])(_this5));
    _this5.handleRemove = _this5.handleRemove.bind((0, _assertThisInitialized2["default"])(_this5));
    _this5.getKeyFromValue = _this5.getKeyFromValue.bind((0, _assertThisInitialized2["default"])(_this5));
    _this5.canAddItem = _this5.canAddItem.bind((0, _assertThisInitialized2["default"])(_this5));
    return _this5;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0, _createClass2["default"])(TagsElement, [{
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
      var _this6 = this;
      var emptyOptionHTML = null;
      var errorMessage = null;
      var elementClass = 'row form-group';

      // Add empty option
      if (this.props.emptyOption) {
        emptyOptionHTML = /*#__PURE__*/_react["default"].createElement("option", null);
      }
      if (this.props.errorMessage) {
        errorMessage = /*#__PURE__*/_react["default"].createElement("span", null, this.props.errorMessage);
        elementClass = 'row form-group has-error';
      }
      var input;
      var options = this.props.options;
      // if options are given and useSearch is specified
      if (Object.keys(options).length > 0 && this.props.useSearch) {
        input = /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("input", {
          type: "text",
          name: this.props.name,
          id: this.props.id,
          list: this.props.id + '_list',
          className: "form-control",
          value: this.props.value || '',
          disabled: this.props.disabled,
          onChange: this.handleChange,
          onKeyPress: this.handleKeyPress
        }), /*#__PURE__*/_react["default"].createElement("datalist", {
          id: this.props.id + '_list'
        }, Object.keys(options).map(function (option) {
          return /*#__PURE__*/_react["default"].createElement("option", {
            value: options[option],
            key: option
          }, options[option]);
        })));
        // if options are present but useSearch is false, use normal dropdown
      } else if (Object.keys(options).length > 0) {
        input = /*#__PURE__*/_react["default"].createElement("select", {
          name: this.props.name,
          className: "form-control",
          id: this.props.id,
          value: this.props.value,
          disabled: this.props.disabled,
          onChange: this.handleChange,
          onKeyPress: this.handleKeyPress
        }, emptyOptionHTML, Object.keys(options).map(function (option) {
          return /*#__PURE__*/_react["default"].createElement("option", {
            value: option,
            key: option
          }, options[option]);
        }));
        // else, use a text input by default
      } else {
        input = /*#__PURE__*/_react["default"].createElement("input", {
          type: "text",
          name: this.props.name,
          id: this.props.id,
          className: "form-control",
          value: this.props.value || '',
          disabled: this.props.disabled,
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
        return /*#__PURE__*/_react["default"].createElement("button", {
          className: "btn btn-info btn-inline",
          type: "button",
          onClick: _this6.handleRemove,
          "data-item": item,
          key: item
        }, itmTxt, "\xA0", /*#__PURE__*/_react["default"].createElement("span", {
          className: "glyphicon glyphicon-remove",
          "data-item": item
        }));
      });
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: elementClass
      }, /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label,
        required: this.props.required
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-9"
      }, items, input, errorMessage, /*#__PURE__*/_react["default"].createElement("button", {
        className: "btn btn-success btn-add-tag",
        id: this.props.id + 'Add',
        type: "button",
        onClick: this.handleAdd
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "glyphicon glyphicon-plus"
      }), this.props.btnLabel)));
    }
  }]);
  return TagsElement;
}(_react.Component);
TagsElement.propTypes = {
  name: _propTypes["default"].string.isRequired,
  id: _propTypes["default"].string.isRequired,
  pendingValKey: _propTypes["default"].string.isRequired,
  options: _propTypes["default"].object,
  items: _propTypes["default"].array,
  label: _propTypes["default"].string,
  value: _propTypes["default"].string,
  "class": _propTypes["default"].string,
  multiple: _propTypes["default"].bool,
  required: _propTypes["default"].bool,
  disabled: _propTypes["default"].bool,
  emptyOption: _propTypes["default"].bool,
  errorMessage: _propTypes["default"].string,
  btnLabel: _propTypes["default"].string,
  allowDupl: _propTypes["default"].bool,
  useSearch: _propTypes["default"].bool,
  strictSearch: _propTypes["default"].bool,
  onUserInput: _propTypes["default"].func,
  onUserAdd: _propTypes["default"].func,
  onUserRemove: _propTypes["default"].func
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
  allowDupl: false,
  useSearch: false,
  strictSearch: false,
  // only accept items specified in options
  errorMessage: null,
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
var TextareaElement = exports.TextareaElement = /*#__PURE__*/function (_Component6) {
  (0, _inherits2["default"])(TextareaElement, _Component6);
  var _super6 = _createSuper(TextareaElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function TextareaElement(props) {
    var _this7;
    (0, _classCallCheck2["default"])(this, TextareaElement);
    _this7 = _super6.call(this, props);
    _this7.handleChange = _this7.handleChange.bind((0, _assertThisInitialized2["default"])(_this7));
    _this7.handleBlur = _this7.handleBlur.bind((0, _assertThisInitialized2["default"])(_this7));
    return _this7;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0, _createClass2["default"])(TextareaElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.props.onUserInput(this.props.name, e.target.value);
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
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.noMargins ? '' : 'row form-group'
      }, !this.props.noMargins && /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label,
        required: this.props.required
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.noMargins ? '' : 'col-sm-9'
      }, /*#__PURE__*/_react["default"].createElement("textarea", {
        cols: this.props.cols,
        rows: this.props.rows,
        className: "form-control",
        name: this.props.name,
        id: this.props.id,
        value: this.props.value || '',
        placeholder: this.props.placeholder,
        required: this.props.required,
        disabled: this.props.disabled,
        onChange: this.handleChange,
        onBlur: this.handleBlur
      })));
    }
  }]);
  return TextareaElement;
}(_react.Component);
TextareaElement.propTypes = {
  name: _propTypes["default"].string.isRequired,
  label: _propTypes["default"].node,
  value: _propTypes["default"].string,
  placeholder: _propTypes["default"].string,
  id: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  required: _propTypes["default"].bool,
  rows: _propTypes["default"].number,
  cols: _propTypes["default"].number,
  noMargins: _propTypes["default"].bool,
  onUserInput: _propTypes["default"].func,
  onUserBlur: _propTypes["default"].func
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
  noMargins: false,
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  },
  onUserBlur: function onUserBlur() {}
};

/**
 * Textbox Component
 * React wrapper for a <input type="text"> element.
 */
var TextboxElement = exports.TextboxElement = /*#__PURE__*/function (_Component7) {
  (0, _inherits2["default"])(TextboxElement, _Component7);
  var _super7 = _createSuper(TextboxElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function TextboxElement(props) {
    var _this8;
    (0, _classCallCheck2["default"])(this, TextboxElement);
    _this8 = _super7.call(this, props);
    _this8.handleChange = _this8.handleChange.bind((0, _assertThisInitialized2["default"])(_this8));
    _this8.handleBlur = _this8.handleBlur.bind((0, _assertThisInitialized2["default"])(_this8));
    return _this8;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0, _createClass2["default"])(TextboxElement, [{
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
      var errorMessage = null;
      var elementClass = this.props.noMargins ? '' : 'row form-group';

      // Add error message
      if (this.props.errorMessage) {
        errorMessage = /*#__PURE__*/_react["default"].createElement("span", null, this.props.errorMessage);
        elementClass = this.props.noMargins ? 'has-error' : 'row form-group has-error';
      }

      // Label prop needs to be provided to render label
      // (including empty label i.e. <TextboxElement label='' />)
      // and retain formatting. If label prop is not provided at all, the input
      // element will take up the whole row.
      var inputClass = this.props.noMargins ? '' : this.props["class"];
      if (!this.props.noMargins && (this.props.label || this.props.label == '')) {
        inputClass = "col-sm-".concat(this.props.labelPlacementTop ? '12' : '9');
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: elementClass,
        style: this.props.labelPlacementTop ? {
          display: 'flex',
          flexDirection: 'column'
        } : {}
      }, !this.props.noMargins && (this.props.label || this.props.label == '') ? /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label,
        required: this.props.required,
        fullWidth: this.props.labelPlacementTop
      }) : null, /*#__PURE__*/_react["default"].createElement("div", {
        className: inputClass
      }, /*#__PURE__*/_react["default"].createElement("input", {
        type: "text",
        className: "form-control",
        name: this.props.name,
        id: this.props.id,
        value: this.props.value || '',
        required: this.props.required,
        disabled: this.props.disabled,
        onChange: this.handleChange,
        onBlur: this.handleBlur,
        autoComplete: this.props.autoComplete,
        placeholder: this.props.placeholder
      }), errorMessage));
    }
  }]);
  return TextboxElement;
}(_react.Component);
TextboxElement.propTypes = {
  name: _propTypes["default"].string.isRequired,
  label: _propTypes["default"].node,
  value: _propTypes["default"].string,
  id: _propTypes["default"].string,
  "class": _propTypes["default"].string,
  placeholder: _propTypes["default"].string,
  autoComplete: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  required: _propTypes["default"].bool,
  errorMessage: _propTypes["default"].string,
  onUserInput: _propTypes["default"].func,
  onUserBlur: _propTypes["default"].func,
  noMargins: _propTypes["default"].bool,
  labelPlacementTop: _propTypes["default"].bool
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
  errorMessage: null,
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  },
  onUserBlur: function onUserBlur() {},
  noMargins: false,
  labelPlacementTop: false
};

/**
 * EmailElement Component
 * React wrapper for a <input type="email"> element.
 */
var EmailElement = exports.EmailElement = /*#__PURE__*/function (_Component8) {
  (0, _inherits2["default"])(EmailElement, _Component8);
  var _super8 = _createSuper(EmailElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function EmailElement(props) {
    var _this9;
    (0, _classCallCheck2["default"])(this, EmailElement);
    _this9 = _super8.call(this, props);
    _this9.handleChange = _this9.handleChange.bind((0, _assertThisInitialized2["default"])(_this9));
    _this9.handleBlur = _this9.handleBlur.bind((0, _assertThisInitialized2["default"])(_this9));
    return _this9;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0, _createClass2["default"])(EmailElement, [{
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
      var errorMessage = null;
      var elementClass = this.props.noMargins ? '' : 'row form-group';

      // Add error message
      if (this.props.errorMessage) {
        errorMessage = /*#__PURE__*/_react["default"].createElement("span", null, this.props.errorMessage);
        elementClass = this.props.noMargins ? 'has-error' : 'row form-group has-error';
      }

      // Label prop needs to be provided to render label
      // (including empty label i.e. <TextboxElement label='' />)
      // and retain formatting. If label prop is not provided at all, the input
      // element will take up the whole row.
      var inputClass = this.props.noMargins ? '' : this.props["class"];
      if (!this.props.noMargins && (this.props.label || this.props.label == '')) {
        inputClass = 'col-sm-9';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: elementClass
      }, !this.props.noMargins && (this.props.label || this.props.label == '') ? /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label,
        required: this.props.required
      }) : null, /*#__PURE__*/_react["default"].createElement("div", {
        className: inputClass
      }, /*#__PURE__*/_react["default"].createElement("input", {
        type: "email",
        title: "Please provide a valid email address!",
        className: "form-control",
        name: this.props.name,
        id: this.props.id,
        value: this.props.value || '',
        required: this.props.required,
        disabled: this.props.disabled,
        onChange: this.handleChange,
        onBlur: this.handleBlur,
        autoComplete: this.props.autoComplete,
        placeholder: this.props.placeholder
      }), errorMessage));
    }
  }]);
  return EmailElement;
}(_react.Component);
EmailElement.propTypes = {
  name: _propTypes["default"].string.isRequired,
  label: _propTypes["default"].node,
  value: _propTypes["default"].string,
  id: _propTypes["default"].string,
  "class": _propTypes["default"].string,
  placeholder: _propTypes["default"].string,
  autoComplete: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  required: _propTypes["default"].bool,
  errorMessage: _propTypes["default"].string,
  onUserInput: _propTypes["default"].func,
  onUserBlur: _propTypes["default"].func,
  noMargins: _propTypes["default"].bool
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
  errorMessage: null,
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  },
  onUserBlur: function onUserBlur() {},
  noMargins: false
};

/**
 * Password Component
 * React wrapper for a <input type="password"> element.
 */
var PasswordElement = exports.PasswordElement = /*#__PURE__*/function (_Component9) {
  (0, _inherits2["default"])(PasswordElement, _Component9);
  var _super9 = _createSuper(PasswordElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function PasswordElement(props) {
    var _this0;
    (0, _classCallCheck2["default"])(this, PasswordElement);
    _this0 = _super9.call(this, props);
    _this0.state = {
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
    _this0.handleChange = _this0.handleChange.bind((0, _assertThisInitialized2["default"])(_this0));
    _this0.handleBlur = _this0.handleBlur.bind((0, _assertThisInitialized2["default"])(_this0));
    // callback called to toogle the visibility
    _this0.toggleVisibility = _this0.toggleVisibility.bind((0, _assertThisInitialized2["default"])(_this0));
    return _this0;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0, _createClass2["default"])(PasswordElement, [{
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
      var errorMessage = null;
      var elementClass = 'row form-group';

      // Add error message
      if (this.props.errorMessage) {
        errorMessage = /*#__PURE__*/_react["default"].createElement("span", null, this.props.errorMessage);
        elementClass = 'row form-group has-error';
      }
      var passwordDisplayType = this.state.active ? this.state.on.type : this.state.off.type;
      var passwordDisplayIcon = this.state.active ? this.state.on.icon : this.state.off.icon;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: elementClass
      }, this.props.label && /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label,
        required: this.props.required
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props["class"]
      }, /*#__PURE__*/_react["default"].createElement("input", {
        type: passwordDisplayType,
        className: "form-control",
        name: this.props.name,
        id: this.props.id,
        value: this.props.value || '',
        required: this.props.required,
        disabled: this.props.disabled,
        onChange: this.handleChange,
        onBlur: this.handleBlur,
        autoComplete: this.props.autoComplete,
        placeholder: this.props.placeholder
      }), /*#__PURE__*/_react["default"].createElement("span", {
        className: 'form-control-feedback glyphicon glyphicon-eye-' + passwordDisplayIcon,
        style: {
          marginRight: '15px'
        },
        onClick: this.toggleVisibility
      }), errorMessage));
    }
  }]);
  return PasswordElement;
}(_react.Component);
PasswordElement.propTypes = {
  name: _propTypes["default"].string.isRequired,
  label: _propTypes["default"].string,
  value: _propTypes["default"].string,
  "class": _propTypes["default"].string,
  type: _propTypes["default"].string,
  placeholder: _propTypes["default"].string,
  id: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  required: _propTypes["default"].bool,
  autoComplete: _propTypes["default"].string,
  errorMessage: _propTypes["default"].string,
  onUserInput: _propTypes["default"].func,
  onUserBlur: _propTypes["default"].func
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
  errorMessage: null,
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  },
  onUserBlur: function onUserBlur() {}
};

/**
 * Date Component
 * React wrapper for a <input type="date"> element.
 */
var DateElement = exports.DateElement = /*#__PURE__*/function (_Component0) {
  (0, _inherits2["default"])(DateElement, _Component0);
  var _super0 = _createSuper(DateElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function DateElement(props) {
    var _this1;
    (0, _classCallCheck2["default"])(this, DateElement);
    _this1 = _super0.call(this, props);
    _this1.handleChange = _this1.handleChange.bind((0, _assertThisInitialized2["default"])(_this1));
    return _this1;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0, _createClass2["default"])(DateElement, [{
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
      var errorMessage = null;
      var elementClass = 'row form-group';

      // Add error message
      if (this.props.errorMessage || this.props.required && this.props.value === '') {
        errorMessage = /*#__PURE__*/_react["default"].createElement("span", null, this.props.errorMessage);
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
      var wrapperClass = this.props.label && !this.props.labelPlacementTop ? 'col-sm-9' : 'col-sm-12';
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: elementClass,
        style: this.props.labelPlacementTop ? {
          display: 'flex',
          flexDirection: 'column'
        } : {}
      }, this.props.label && /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label,
        required: this.props.required,
        fullWidth: this.props.labelPlacementTop
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: wrapperClass
      }, /*#__PURE__*/_react["default"].createElement("input", {
        type: inputType,
        className: "form-control",
        name: this.props.name,
        id: this.props.id,
        min: minFullDate,
        max: maxFullDate,
        onChange: this.handleChange,
        value: this.props.value || '',
        required: this.props.required,
        disabled: this.props.disabled
      }), errorMessage));
    }
  }]);
  return DateElement;
}(_react.Component);
DateElement.propTypes = {
  name: _propTypes["default"].string.isRequired,
  label: _propTypes["default"].string,
  value: _propTypes["default"].string,
  id: _propTypes["default"].string,
  maxYear: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  minYear: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  dateFormat: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  required: _propTypes["default"].bool,
  errorMessage: _propTypes["default"].string,
  onUserInput: _propTypes["default"].func,
  labelPlacementTop: _propTypes["default"].bool
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
  errorMessage: null,
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  },
  labelPlacementTop: false
};

/**
 * Date range component.
 * React wrapper for filtering date values between two bounds.
 */
var DateRangeElementBase = /*#__PURE__*/function (_Component1) {
  (0, _inherits2["default"])(DateRangeElementBase, _Component1);
  var _super1 = _createSuper(DateRangeElementBase);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function DateRangeElementBase(props) {
    var _this10;
    (0, _classCallCheck2["default"])(this, DateRangeElementBase);
    _this10 = _super1.call(this, props);
    _this10.handleChange = _this10.handleChange.bind((0, _assertThisInitialized2["default"])(_this10));
    return _this10;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0, _createClass2["default"])(DateRangeElementBase, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.props.onUserInput(this.props.name, _objectSpread(_objectSpread({}, this.props.value), {}, (0, _defineProperty2["default"])({}, e.target.dataset.rangeBound, e.target.value)));
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var value = this.props.value || {};
      var minID = "".concat(this.props.id || this.props.name, "_min");
      var maxID = "".concat(this.props.id || this.props.name, "_max");
      var minRangeLabel = this.props.minLabel ? this.props.minLabel : this.props.t('Minimum', {
        ns: 'loris'
      });
      var maxRangeLabel = this.props.maxLabel ? this.props.maxLabel : this.props.t('Maximum', {
        ns: 'loris'
      });
      var minLabel = this.props.labelPlacementTop && this.props.label ? this.props.t('{{label}} Minimum', {
        ns: 'loris',
        label: this.props.label
      }) : minRangeLabel;
      var maxLabel = this.props.labelPlacementTop && this.props.label ? this.props.t('{{label}} Maximum', {
        ns: 'loris',
        label: this.props.label
      }) : maxRangeLabel;
      var wrapperClass = this.props.label && !this.props.labelPlacementTop ? 'col-sm-9' : 'col-sm-12';
      var minYear = this.props.minYear;
      var maxYear = this.props.maxYear;
      if (this.props.minYear === '' || this.props.minYear === null) {
        minYear = '1000';
      }
      if (this.props.maxYear === '' || this.props.maxYear === null) {
        maxYear = '9999';
      }
      var currentDate = new Date();
      var currentDay = "".concat(currentDate.getDate()).padStart(2, '0');
      var currentMonth = "".concat(currentDate.getMonth() + 1).padStart(2, '0');
      var inputType = 'date';
      var minFullDate = minYear + '-01-01';
      var maxFullDate = maxYear + '-' + currentMonth + '-' + currentDay;
      if (!this.props.dateFormat.match(/d/i)) {
        inputType = 'month';
        minFullDate = minYear + '-01';
        maxFullDate = maxYear + '-' + currentMonth;
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "row form-group",
        style: this.props.labelPlacementTop ? {
          display: 'flex',
          flexDirection: 'column'
        } : {}
      }, this.props.label && !this.props.labelPlacementTop && /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label,
        required: this.props.required,
        fullWidth: this.props.labelPlacementTop
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: wrapperClass
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          display: 'flex',
          gap: '8px'
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/_react["default"].createElement("label", {
        htmlFor: minID
      }, minLabel), /*#__PURE__*/_react["default"].createElement("input", {
        type: inputType,
        className: "form-control",
        name: "".concat(this.props.name, "Min"),
        "data-range-bound": "min",
        id: minID,
        min: minFullDate,
        max: maxFullDate,
        value: value.min || '',
        placeholder: minLabel,
        required: this.props.required,
        disabled: this.props.disabled,
        onChange: this.handleChange
      })), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/_react["default"].createElement("label", {
        htmlFor: maxID
      }, maxLabel), /*#__PURE__*/_react["default"].createElement("input", {
        type: inputType,
        className: "form-control",
        name: "".concat(this.props.name, "Max"),
        "data-range-bound": "max",
        id: maxID,
        min: minFullDate,
        max: maxFullDate,
        value: value.max || '',
        placeholder: maxLabel,
        required: this.props.required,
        disabled: this.props.disabled,
        onChange: this.handleChange
      })))));
    }
  }]);
  return DateRangeElementBase;
}(_react.Component);
DateRangeElementBase.propTypes = {
  name: _propTypes["default"].string.isRequired,
  label: _propTypes["default"].string,
  value: _propTypes["default"].shape({
    min: _propTypes["default"].string,
    max: _propTypes["default"].string
  }),
  id: _propTypes["default"].string,
  maxYear: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  minYear: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  dateFormat: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  required: _propTypes["default"].bool,
  onUserInput: _propTypes["default"].func,
  labelPlacementTop: _propTypes["default"].bool,
  minLabel: _propTypes["default"].string,
  maxLabel: _propTypes["default"].string,
  t: _propTypes["default"].func
};
DateRangeElementBase.defaultProps = {
  name: '',
  label: '',
  value: {},
  id: null,
  maxYear: '9999',
  minYear: '1000',
  dateFormat: 'YMd',
  disabled: false,
  required: false,
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  },
  t: function t(text) {
    return text;
  },
  labelPlacementTop: false,
  minLabel: '',
  maxLabel: ''
};
var DateRangeElement = exports.DateRangeElement = (0, _reactI18next.withTranslation)('loris')(DateRangeElementBase);

/**
 * Time Component
 * React wrapper for a <input type="time"> element.
 */
var TimeElement = exports.TimeElement = /*#__PURE__*/function (_Component10) {
  (0, _inherits2["default"])(TimeElement, _Component10);
  var _super10 = _createSuper(TimeElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function TimeElement(props) {
    var _this11;
    (0, _classCallCheck2["default"])(this, TimeElement);
    _this11 = _super10.call(this, props);
    _this11.handleChange = _this11.handleChange.bind((0, _assertThisInitialized2["default"])(_this11));
    return _this11;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0, _createClass2["default"])(TimeElement, [{
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
      var wrapperClass = this.props.label && !this.props.labelPlacementTop ? 'col-sm-9' : 'col-sm-12';
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "row form-group",
        style: this.props.labelPlacementTop ? {
          display: 'flex',
          flexDirection: 'column'
        } : {}
      }, this.props.label && /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label,
        required: this.props.required,
        fullWidth: this.props.labelPlacementTop
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: wrapperClass
      }, /*#__PURE__*/_react["default"].createElement("input", {
        type: "time",
        className: "form-control",
        name: this.props.name,
        id: this.props.id,
        onChange: this.handleChange,
        value: this.props.value || '',
        required: this.props.required,
        disabled: this.props.disabled,
        pattern: "([0-1][0-9]|2[0-4]|[1-9]):([0-5][0-9])(:([0-5][0-9]))?",
        title: 'Input must be in one of the following formats: ' + 'HH:MM or HH:MM:SS'
      })));
    }
  }]);
  return TimeElement;
}(_react.Component);
TimeElement.propTypes = {
  name: _propTypes["default"].string.isRequired,
  label: _propTypes["default"].string,
  value: _propTypes["default"].string,
  id: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  required: _propTypes["default"].bool,
  onUserInput: _propTypes["default"].func,
  labelPlacementTop: _propTypes["default"].bool
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
  },
  labelPlacementTop: false
};

/**
 * DateTime Component
 * React wrapper for a <input type="datetime-local"> element.
 */
var DateTimeElement = exports.DateTimeElement = /*#__PURE__*/function (_Component11) {
  (0, _inherits2["default"])(DateTimeElement, _Component11);
  var _super11 = _createSuper(DateTimeElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function DateTimeElement(props) {
    var _this12;
    (0, _classCallCheck2["default"])(this, DateTimeElement);
    _this12 = _super11.call(this, props);
    _this12.handleChange = _this12.handleChange.bind((0, _assertThisInitialized2["default"])(_this12));
    return _this12;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0, _createClass2["default"])(DateTimeElement, [{
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
      var wrapperClass = this.props.label ? 'col-sm-9' : 'col-sm-12';
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "row form-group"
      }, this.props.label && /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label,
        required: this.props.required
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: wrapperClass
      }, /*#__PURE__*/_react["default"].createElement("input", {
        type: "datetime-local",
        className: "form-control",
        name: this.props.name,
        id: this.props.id,
        onChange: this.handleChange,
        value: this.props.value || '',
        required: this.props.required,
        disabled: this.props.disabled,
        pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}(:[0-5][0-9])?",
        title: 'Input must be in one of the following formats: ' + 'YYYY-MM-DDTHH:MM or YYYY-MM-DDTHH:MM:SS'
      })));
    }
  }]);
  return DateTimeElement;
}(_react.Component);
DateTimeElement.propTypes = {
  name: _propTypes["default"].string.isRequired,
  label: _propTypes["default"].string,
  value: _propTypes["default"].string,
  id: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  required: _propTypes["default"].bool,
  onUserInput: _propTypes["default"].func
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
var NumericElement = exports.NumericElement = /*#__PURE__*/function (_Component12) {
  (0, _inherits2["default"])(NumericElement, _Component12);
  var _super12 = _createSuper(NumericElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function NumericElement(props) {
    var _this13;
    (0, _classCallCheck2["default"])(this, NumericElement);
    _this13 = _super12.call(this, props);
    _this13.handleChange = _this13.handleChange.bind((0, _assertThisInitialized2["default"])(_this13));
    return _this13;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0, _createClass2["default"])(NumericElement, [{
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
      var errorMessage = null;
      var elementClass = 'row form-group';
      var wrapperClass = this.props.label && !this.props.labelPlacementTop ? 'col-sm-9' : 'col-sm-12';

      // Add error message
      if (this.props.errorMessage) {
        errorMessage = /*#__PURE__*/_react["default"].createElement("span", null, this.props.errorMessage);
        elementClass = 'row form-group has-error';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: elementClass,
        style: this.props.labelPlacementTop ? {
          display: 'flex',
          flexDirection: 'column'
        } : {}
      }, this.props.label && /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label,
        required: this.props.required,
        fullWidth: this.props.labelPlacementTop
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: wrapperClass
      }, /*#__PURE__*/_react["default"].createElement("input", {
        type: "number",
        className: "form-control",
        name: this.props.name,
        id: this.props.id,
        min: this.props.min,
        max: this.props.max,
        step: this.props.step,
        value: this.props.value || '',
        disabled: this.props.disabled,
        required: this.props.required,
        onChange: this.handleChange
      }), errorMessage));
    }
  }]);
  return NumericElement;
}(_react.Component);
NumericElement.propTypes = {
  name: _propTypes["default"].string.isRequired,
  min: _propTypes["default"].number,
  max: _propTypes["default"].number,
  step: _propTypes["default"].string,
  label: _propTypes["default"].string,
  value: _propTypes["default"].string,
  id: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  required: _propTypes["default"].bool,
  onUserInput: _propTypes["default"].func,
  errorMessage: _propTypes["default"].string,
  labelPlacementTop: _propTypes["default"].bool
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
  },
  labelPlacementTop: false
};

/**
 * Numeric range component.
 * React wrapper for filtering a numeric value between two bounds.
 */
var NumericRangeElementBase = /*#__PURE__*/function (_Component13) {
  (0, _inherits2["default"])(NumericRangeElementBase, _Component13);
  var _super13 = _createSuper(NumericRangeElementBase);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function NumericRangeElementBase(props) {
    var _this14;
    (0, _classCallCheck2["default"])(this, NumericRangeElementBase);
    _this14 = _super13.call(this, props);
    _this14.handleChange = _this14.handleChange.bind((0, _assertThisInitialized2["default"])(_this14));
    return _this14;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0, _createClass2["default"])(NumericRangeElementBase, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.props.onUserInput(this.props.name, _objectSpread(_objectSpread({}, this.props.value), {}, (0, _defineProperty2["default"])({}, e.target.dataset.rangeBound, e.target.value)));
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var value = this.props.value || {};
      var minID = "".concat(this.props.id || this.props.name, "_min");
      var maxID = "".concat(this.props.id || this.props.name, "_max");
      var minLabel = this.props.minLabel ? this.props.minLabel : this.props.t('Minimum', {
        ns: 'loris'
      });
      var maxLabel = this.props.maxLabel ? this.props.maxLabel : this.props.t('Maximum', {
        ns: 'loris'
      });
      var wrapperClass = this.props.label && !this.props.labelPlacementTop ? 'col-sm-9' : 'col-sm-12';
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "row form-group",
        style: this.props.labelPlacementTop ? {
          display: 'flex',
          flexDirection: 'column'
        } : {}
      }, this.props.label && /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label,
        required: this.props.required,
        fullWidth: this.props.labelPlacementTop
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: wrapperClass
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          display: 'flex',
          gap: '8px'
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "sr-only",
        htmlFor: minID
      }, minLabel), /*#__PURE__*/_react["default"].createElement("input", {
        type: "number",
        className: "form-control",
        name: "".concat(this.props.name, "Min"),
        "data-range-bound": "min",
        id: minID,
        min: this.props.min,
        max: this.props.max,
        step: this.props.step,
        value: value.min || '',
        placeholder: minLabel,
        disabled: this.props.disabled,
        onChange: this.handleChange
      })), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "sr-only",
        htmlFor: maxID
      }, maxLabel), /*#__PURE__*/_react["default"].createElement("input", {
        type: "number",
        className: "form-control",
        name: "".concat(this.props.name, "Max"),
        "data-range-bound": "max",
        id: maxID,
        min: this.props.min,
        max: this.props.max,
        step: this.props.step,
        value: value.max || '',
        placeholder: maxLabel,
        disabled: this.props.disabled,
        onChange: this.handleChange
      })))));
    }
  }]);
  return NumericRangeElementBase;
}(_react.Component);
NumericRangeElementBase.propTypes = {
  name: _propTypes["default"].string.isRequired,
  min: _propTypes["default"].number,
  max: _propTypes["default"].number,
  step: _propTypes["default"].string,
  label: _propTypes["default"].string,
  value: _propTypes["default"].shape({
    min: _propTypes["default"].string,
    max: _propTypes["default"].string
  }),
  id: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  required: _propTypes["default"].bool,
  onUserInput: _propTypes["default"].func,
  labelPlacementTop: _propTypes["default"].bool,
  minLabel: _propTypes["default"].string,
  maxLabel: _propTypes["default"].string,
  t: _propTypes["default"].func
};
NumericRangeElementBase.defaultProps = {
  name: '',
  min: null,
  max: null,
  step: '1',
  label: '',
  value: {},
  id: null,
  required: false,
  disabled: false,
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  },
  t: function t(text) {
    return text;
  },
  labelPlacementTop: false,
  minLabel: '',
  maxLabel: ''
};
var NumericRangeElement = exports.NumericRangeElement = (0, _reactI18next.withTranslation)('loris')(NumericRangeElementBase);

/**
 * File Component
 * React wrapper for a simple or 'multiple' <input type="file"> element.
 */
var FileElement = /*#__PURE__*/function (_Component14) {
  (0, _inherits2["default"])(FileElement, _Component14);
  var _super14 = _createSuper(FileElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function FileElement(props) {
    var _this15;
    (0, _classCallCheck2["default"])(this, FileElement);
    _this15 = _super14.call(this, props);
    _this15.handleChange = _this15.handleChange.bind((0, _assertThisInitialized2["default"])(_this15));
    return _this15;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0, _createClass2["default"])(FileElement, [{
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
      var fileName = undefined;
      if (this.props.value) {
        switch ((0, _typeof2["default"])(this.props.value)) {
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
      var errorMessage = '';
      var elementClass = 'row form-group';
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
      if (this.props.errorMessage) {
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
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: elementClass
        }, /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
          label: this.props.label
        }), /*#__PURE__*/_react["default"].createElement("div", {
          className: "col-sm-9"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          style: truncateEllipsis
        }, /*#__PURE__*/_react["default"].createElement("span", {
          style: truncateEllipsisChild
        }, fileName))));
      }
      var wrapperClass = this.props.label ? 'col-sm-9' : 'col-sm-12';
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: elementClass
      }, this.props.label && /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label,
        required: this.props.required
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: wrapperClass
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "input-group"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        tabIndex: "-1",
        className: "form-control file-caption kv-fileinput-caption"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: truncateEllipsis
      }, /*#__PURE__*/_react["default"].createElement("span", {
        style: truncateEllipsisChild
      }, fileName)), /*#__PURE__*/_react["default"].createElement("div", {
        className: "file-caption-name",
        id: "video_file"
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "input-group-btn"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "btn btn-primary btn-file"
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "glyphicon glyphicon-folder-open"
      }), ' ' + this.props.t('Browse', {
        ns: 'loris'
      }), /*#__PURE__*/_react["default"].createElement("input", {
        type: "file",
        className: "fileUpload",
        name: this.props.name,
        onChange: this.handleChange,
        required: this.props.required,
        multiple: this.props.allowMultiple
      })))), /*#__PURE__*/_react["default"].createElement("span", null, errorMessage)));
    }
  }]);
  return FileElement;
}(_react.Component);
FileElement.propTypes = {
  name: _propTypes["default"].string.isRequired,
  label: _propTypes["default"].string,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object]),
  id: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  required: _propTypes["default"].bool,
  allowMultiple: _propTypes["default"].bool,
  errorMessage: _propTypes["default"].string,
  onUserInput: _propTypes["default"].func,
  // Provided by withTranslation HOC
  t: _propTypes["default"].func
};
FileElement.defaultProps = {
  name: '',
  label: 'File to Upload',
  value: '',
  id: null,
  disabled: false,
  required: false,
  allowMultiple: false,
  errorMessage: null,
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  }
};

// Wrap FileElement with translation HOC
var FileElementWithTranslation = exports.FileElement = (0, _reactI18next.withTranslation)('loris')(FileElement);
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
var StaticElement = exports.StaticElement = /*#__PURE__*/function (_Component15) {
  (0, _inherits2["default"])(StaticElement, _Component15);
  var _super15 = _createSuper(StaticElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function StaticElement(props) {
    (0, _classCallCheck2["default"])(this, StaticElement);
    return _super15.call(this, props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  (0, _createClass2["default"])(StaticElement, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "row form-group"
      }, this.props.label && /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props["class"]
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.textClass
      }, this.props.text)));
    }
  }]);
  return StaticElement;
}(_react.Component);
StaticElement.propTypes = (0, _defineProperty2["default"])({
  label: _propTypes["default"].string,
  "class": _propTypes["default"].string,
  textClass: _propTypes["default"].string,
  text: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].element])
}, "class", _propTypes["default"].string);
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
var HeaderElement = exports.HeaderElement = /*#__PURE__*/function (_Component16) {
  (0, _inherits2["default"])(HeaderElement, _Component16);
  var _super16 = _createSuper(HeaderElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function HeaderElement(props) {
    (0, _classCallCheck2["default"])(this, HeaderElement);
    return _super16.call(this, props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  (0, _createClass2["default"])(HeaderElement, [{
    key: "render",
    value: function render() {
      var Tag = 'h' + this.props.headerLevel;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "row form-group"
      }, /*#__PURE__*/_react["default"].createElement(Tag, {
        className: "col-xs-12"
      }, this.props.text));
    }
  }]);
  return HeaderElement;
}(_react.Component);
HeaderElement.propTypes = {
  text: _propTypes["default"].string.isRequired,
  headerLevel: _propTypes["default"].oneOf([1, 2, 3, 4, 5, 6])
};
HeaderElement.defaultProps = {
  headerLevel: 3
};

/**
 * Link element component.
 * Used to link plain/formated text to an href destination as part of a form
 */
var LinkElement = exports.LinkElement = /*#__PURE__*/function (_Component17) {
  (0, _inherits2["default"])(LinkElement, _Component17);
  var _super17 = _createSuper(LinkElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function LinkElement(props) {
    (0, _classCallCheck2["default"])(this, LinkElement);
    return _super17.call(this, props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  (0, _createClass2["default"])(LinkElement, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "row form-group"
      }, /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-9"
      }, /*#__PURE__*/_react["default"].createElement("p", {
        className: "form-control-static"
      }, /*#__PURE__*/_react["default"].createElement("a", {
        href: this.props.href
      }, this.props.text))));
    }
  }]);
  return LinkElement;
}(_react.Component);
LinkElement.propTypes = {
  label: _propTypes["default"].string,
  text: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].element]),
  href: _propTypes["default"].string
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
var CheckboxElement = exports.CheckboxElement = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(CheckboxElement, _React$Component);
  var _super18 = _createSuper(CheckboxElement);
  /**
   * @constructor
   */
  function CheckboxElement() {
    var _this16;
    (0, _classCallCheck2["default"])(this, CheckboxElement);
    _this16 = _super18.call(this);
    _this16.handleChange = _this16.handleChange.bind((0, _assertThisInitialized2["default"])(_this16));
    return _this16;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0, _createClass2["default"])(CheckboxElement, [{
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
      if (this.props.required) {
        requiredHTML = /*#__PURE__*/_react["default"].createElement("span", {
          className: "text-danger"
        }, "*");
      }

      // Add error message
      if (this.props.errorMessage) {
        errorMessage = /*#__PURE__*/_react["default"].createElement("span", null, this.props.errorMessage);
        elementClass = elementClass + ' has-error';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: elementClass
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-12"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        htmlFor: this.props.id
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: divStyle
      }, /*#__PURE__*/_react["default"].createElement("input", {
        type: "checkbox",
        name: this.props.name,
        id: this.props.id,
        checked: this.props.value,
        required: this.props.required,
        disabled: this.props.disabled,
        onChange: this.handleChange
      })), errorMessage, this.props.label, requiredHTML)));
    }
  }]);
  return CheckboxElement;
}(_react["default"].Component);
CheckboxElement.propTypes = {
  name: _propTypes["default"].string.isRequired,
  label: _propTypes["default"].string.isRequired,
  value: _propTypes["default"].bool.isRequired,
  id: _propTypes["default"].string,
  "class": _propTypes["default"].string,
  offset: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  required: _propTypes["default"].bool,
  errorMessage: _propTypes["default"].string,
  elementClass: _propTypes["default"].string,
  onUserInput: _propTypes["default"].func
};
CheckboxElement.defaultProps = {
  id: null,
  disabled: false,
  required: false,
  errorMessage: null,
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
var ButtonElement = exports.ButtonElement = /*#__PURE__*/function (_Component18) {
  (0, _inherits2["default"])(ButtonElement, _Component18);
  var _super19 = _createSuper(ButtonElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function ButtonElement(props) {
    var _this17;
    (0, _classCallCheck2["default"])(this, ButtonElement);
    _this17 = _super19.call(this, props);
    _this17.handleClick = _this17.handleClick.bind((0, _assertThisInitialized2["default"])(_this17));
    return _this17;
  }

  /**
   * Handle click
   *
   * @param {object} e - Event
   */
  (0, _createClass2["default"])(ButtonElement, [{
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
      var _this$props$disabledL;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "row form-group"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.columnSize
      }, /*#__PURE__*/_react["default"].createElement("button", {
        id: this.props.id,
        name: this.props.name,
        type: this.props.type,
        className: this.props.buttonClass,
        style: this.props.style,
        onClick: this.handleClick,
        disabled: this.props.disabled
      }, this.props.disabled ? (_this$props$disabledL = this.props.disabledLabel) !== null && _this$props$disabledL !== void 0 ? _this$props$disabledL : this.props.label : this.props.label)));
    }
  }]);
  return ButtonElement;
}(_react.Component);
ButtonElement.propTypes = {
  id: _propTypes["default"].string,
  name: _propTypes["default"].string,
  label: _propTypes["default"].string,
  type: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  disabledLabel: _propTypes["default"].string,
  style: _propTypes["default"].object,
  onUserInput: _propTypes["default"].func,
  columnSize: _propTypes["default"].string,
  buttonClass: _propTypes["default"].string
};
ButtonElement.defaultProps = {
  label: 'Submit',
  type: 'submit',
  disabled: null,
  disabledLabel: null,
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
var CTA = exports.CTA = /*#__PURE__*/function (_Component19) {
  (0, _inherits2["default"])(CTA, _Component19);
  var _super20 = _createSuper(CTA);
  function CTA() {
    (0, _classCallCheck2["default"])(this, CTA);
    return _super20.apply(this, arguments);
  }
  (0, _createClass2["default"])(CTA, [{
    key: "render",
    value:
    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
    function render() {
      return /*#__PURE__*/_react["default"].createElement("button", {
        className: this.props.buttonClass,
        onClick: this.props.onUserInput
      }, this.props.label);
    }
  }]);
  return CTA;
}(_react.Component);
CTA.propTypes = {
  label: _propTypes["default"].string,
  buttonClass: _propTypes["default"].string,
  onUserInput: _propTypes["default"].func
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
var LorisElement = exports.LorisElement = /*#__PURE__*/function (_Component20) {
  (0, _inherits2["default"])(LorisElement, _Component20);
  var _super21 = _createSuper(LorisElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function LorisElement(props) {
    (0, _classCallCheck2["default"])(this, LorisElement);
    return _super21.call(this, props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  (0, _createClass2["default"])(LorisElement, [{
    key: "render",
    value: function render() {
      var elementProps = this.props.element;
      elementProps.ref = elementProps.name;
      elementProps.onUserInput = this.props.onUserInput;
      var elementHtml = /*#__PURE__*/_react["default"].createElement("div", null);
      switch (elementProps.type) {
        case 'text':
          elementHtml = /*#__PURE__*/_react["default"].createElement(TextboxElement, elementProps);
          break;
        case 'email':
          elementHtml = /*#__PURE__*/_react["default"].createElement(EmailElement, elementProps);
          break;
        case 'password':
          elementHtml = /*#__PURE__*/_react["default"].createElement(PasswordElement, elementProps);
          break;
        case 'tags':
          elementHtml = /*#__PURE__*/_react["default"].createElement(TagsElement, elementProps);
          break;
        case 'select':
          elementHtml = /*#__PURE__*/_react["default"].createElement(SelectElement, elementProps);
          break;
        case 'search':
          elementHtml = /*#__PURE__*/_react["default"].createElement(SearchableDropdown, elementProps);
          break;
        case 'date':
          elementHtml = /*#__PURE__*/_react["default"].createElement(DateElement, elementProps);
          break;
        case 'date-range':
          elementHtml = /*#__PURE__*/_react["default"].createElement(DateRangeElement, elementProps);
          break;
        case 'time':
          elementHtml = /*#__PURE__*/_react["default"].createElement(TimeElement, elementProps);
          break;
        case 'numeric':
          elementHtml = /*#__PURE__*/_react["default"].createElement(NumericElement, elementProps);
          break;
        case 'number-range':
          elementHtml = /*#__PURE__*/_react["default"].createElement(NumericRangeElement, elementProps);
          break;
        case 'textarea':
          elementHtml = /*#__PURE__*/_react["default"].createElement(TextareaElement, elementProps);
          break;
        case 'file':
          elementHtml = /*#__PURE__*/_react["default"].createElement(FileElement, elementProps);
          break;
        case 'static':
          elementHtml = /*#__PURE__*/_react["default"].createElement(StaticElement, elementProps);
          break;
        case 'header':
          elementHtml = /*#__PURE__*/_react["default"].createElement(HeaderElement, elementProps);
          break;
        case 'link':
          elementHtml = /*#__PURE__*/_react["default"].createElement(LinkElement, elementProps);
          break;
        case 'advcheckbox':
          elementHtml = /*#__PURE__*/_react["default"].createElement(CheckboxElement, elementProps);
          break;
        default:
          console.warn('Element of type ' + elementProps.type + ' is not currently implemented!');
          break;
      }
      return elementHtml;
    }
  }]);
  return LorisElement;
}(_react.Component);
LorisElement.propTypes = {
  element: _propTypes["default"].object,
  onUserInput: _propTypes["default"].string
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
var RadioElement = exports.RadioElement = /*#__PURE__*/function (_React$Component2) {
  (0, _inherits2["default"])(RadioElement, _React$Component2);
  var _super22 = _createSuper(RadioElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function RadioElement(props) {
    var _this18;
    (0, _classCallCheck2["default"])(this, RadioElement);
    _this18 = _super22.call(this, props);
    _this18.handleChange = _this18.handleChange.bind((0, _assertThisInitialized2["default"])(_this18));
    _this18.generateLayout = _this18.generateLayout.bind((0, _assertThisInitialized2["default"])(_this18));
    return _this18;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0, _createClass2["default"])(RadioElement, [{
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
          content.push(/*#__PURE__*/_react["default"].createElement("div", {
            key: key,
            style: styleColumn
          }, /*#__PURE__*/_react["default"].createElement("div", {
            style: styleContainer
          }, /*#__PURE__*/_react["default"].createElement("input", {
            type: "radio",
            name: this.props.name,
            value: key,
            id: key,
            checked: checked,
            required: this.props.required,
            disabled: this.props.disabled,
            onChange: this.handleChange,
            style: styleInput
          }), /*#__PURE__*/_react["default"].createElement("label", {
            htmlFor: key,
            style: styleLabel
          }, this.props.options[key]))));
        }
      }
      layout.push(/*#__PURE__*/_react["default"].createElement("div", {
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
      var elementClass = this.props.noMargins ? '' : this.props.elementClass;
      var required = this.props.required ? 'required' : null;

      // Add required asterix
      if (required) {
        requiredHTML = /*#__PURE__*/_react["default"].createElement("span", {
          className: "text-danger"
        }, "*");
      }
      // Add error message
      if (this.props.errorMessage) {
        errorMessage = /*#__PURE__*/_react["default"].createElement("span", null, this.props.errorMessage);
        elementClass = this.props.noMargins ? 'has-error' : this.props.elementClass + ' has-error';
      }
      // Generate layout
      var layout = this.generateLayout();
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: elementClass
      }, !this.props.noMargins && /*#__PURE__*/_react["default"].createElement("label", {
        className: 'col-sm-3 control-label'
      }, this.props.label, errorMessage, requiredHTML), /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.noMargins ? '' : 'col-sm-9'
      }, layout));
    }
  }]);
  return RadioElement;
}(_react["default"].Component);
RadioElement.propTypes = {
  name: _propTypes["default"].string.isRequired,
  label: _propTypes["default"].node,
  options: _propTypes["default"].object.isRequired,
  disabled: _propTypes["default"].bool,
  required: _propTypes["default"].bool,
  vertical: _propTypes["default"].bool,
  checked: _propTypes["default"].string.isRequired,
  errorMessage: _propTypes["default"].string,
  elementClass: _propTypes["default"].string,
  noMargins: _propTypes["default"].bool,
  onUserInput: _propTypes["default"].func
};
RadioElement.defaultProps = {
  disabled: false,
  required: false,
  vertical: false,
  errorMessage: null,
  elementClass: 'row form-group',
  noMargins: false,
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  }
};

/**
 * Slider Component
 * React wrapper for a <input type='range'> element.
 */
var SliderElement = exports.SliderElement = /*#__PURE__*/function (_React$Component3) {
  (0, _inherits2["default"])(SliderElement, _React$Component3);
  var _super23 = _createSuper(SliderElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function SliderElement(props) {
    var _this19;
    (0, _classCallCheck2["default"])(this, SliderElement);
    _this19 = _super23.call(this, props);
    _this19.handleChange = _this19.handleChange.bind((0, _assertThisInitialized2["default"])(_this19));
    return _this19;
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  (0, _createClass2["default"])(SliderElement, [{
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
      // Add required asterix
      if (this.props.required) {
        requiredHTML = /*#__PURE__*/_react["default"].createElement("span", {
          className: "text-danger"
        }, "*");
      }
      // Add error message
      if (this.props.errorMessage) {
        errorMessage = /*#__PURE__*/_react["default"].createElement("span", null, this.props.errorMessage);
        elementClass = this.props.elementClass + ' has-error';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: elementClass
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: 'col-sm-3 control-label',
        htmlFor: this.props.id
      }, this.props.label, errorMessage, requiredHTML), /*#__PURE__*/_react["default"].createElement("div", {
        className: 'col-sm-9'
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '100%'
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          flexGrow: 1000,
          display: 'flex',
          flexDirection: 'column',
          flexBasis: '100%',
          maxWidth: this.props.maxWidth,
          marginRight: '5px',
          flex: 2
        }
      }, /*#__PURE__*/_react["default"].createElement("input", {
        type: "range",
        name: this.props.name,
        id: this.props.id,
        value: this.props.value,
        min: this.props.minValue,
        max: this.props.maxValue,
        required: this.props.required,
        disabled: this.props.disabled,
        onChange: this.handleChange,
        style: {
          width: '100%'
        }
      })), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          flexBasis: '100%',
          maxWidth: '50px',
          flex: 1
        }
      }, /*#__PURE__*/_react["default"].createElement("input", {
        type: "number",
        name: 'input_' + this.props.name,
        value: this.props.value,
        min: this.props.minValue,
        max: this.props.maxValue,
        required: this.props.required,
        disabled: this.props.disabled,
        onChange: this.handleChange,
        style: {
          width: '50px',
          textAlign: 'center'
        }
      })))));
    }
  }]);
  return SliderElement;
}(_react["default"].Component);
SliderElement.propTypes = {
  id: _propTypes["default"].string,
  name: _propTypes["default"].string.isRequired,
  label: _propTypes["default"].string.isRequired,
  value: _propTypes["default"].number.isRequired,
  minValue: _propTypes["default"].number.isRequired,
  maxValue: _propTypes["default"].number.isRequired,
  maxWidth: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  required: _propTypes["default"].bool,
  errorMessage: _propTypes["default"].string,
  elementClass: _propTypes["default"].string,
  onUserInput: _propTypes["default"].func
};
SliderElement.defaultProps = {
  id: null,
  maxWidth: 'auto',
  disabled: false,
  required: false,
  errorMessage: null,
  elementClass: 'row form-group',
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  }
};
var _default = exports["default"] = {
  FormElement: FormElement,
  FieldsetElement: FieldsetElement,
  SelectElement: SelectElement,
  TagsElement: TagsElement,
  SearchableDropdown: SearchableDropdown,
  TextareaElement: TextareaElement,
  TextboxElement: TextboxElement,
  PasswordElement: PasswordElement,
  DateElement: DateElement,
  DateRangeElement: DateRangeElement,
  TimeElement: TimeElement,
  DateTimeElement: DateTimeElement,
  NumericElement: NumericElement,
  NumericRangeElement: NumericRangeElement,
  FileElement: FileElementWithTranslation,
  StaticElement: StaticElement,
  HeaderElement: HeaderElement,
  LinkElement: LinkElement,
  CheckboxElement: CheckboxElement,
  RadioElement: RadioElement,
  SliderElement: SliderElement,
  ButtonElement: ButtonElement,
  CTA: CTA,
  LorisElement: LorisElement
};

/***/ },

/***/ "./jsx/Tabs.js"
/*!*********************!*\
  !*** ./jsx/Tabs.js ***!
  \*********************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VerticalTabs = exports.Tabs = exports.TabPane = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) { if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } } return n["default"] = e, t && t.set(e, n), n; }
function _createSuper(t) { var r = _isNativeReflectConstruct(); return function () { var e, o = (0, _getPrototypeOf2["default"])(t); if (r) { var s = (0, _getPrototypeOf2["default"])(this).constructor; e = Reflect.construct(o, arguments, s); } else e = o.apply(this, arguments); return (0, _possibleConstructorReturn2["default"])(this, e); }; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); } /**
 * This file contains React components for Tabs component.
 *
 * @author Loris Team
 * @version 1.1.0
 */
/**
 * Tabs Component.
 * React wrapper for Bootstrap tabs. Allows to dynamically render tabs
 * and corresponding tab panes.
 *
 * ================================================
 * Usage:
 *
 * 1. Define an array of tabs with IDs and labels
 *
 * `let tabList = [{id: "tab1", label: "This is tab title"}];`
 *
 * 2. Pass tabList as <Tab> property and <TabPane> as child
 *  ```
 * <Tabs tabs={tabList} defaultTab="tab1">
 *   <TabPane TabId={tabList[0].id}>
 *     // Tab content goes here
 *   </TabPane>
 * </Tabs>
 * ```
 * =================================================
 *
 */
var Tabs = exports.Tabs = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Tabs, _Component);
  var _super = _createSuper(Tabs);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function Tabs(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, Tabs);
    _this = _super.call(this, props);
    var hash = window.location.hash;
    var activeTab = '';

    /**
     * Determine the initial active tab in this order
     * 1. Try to infer from the URL, otherwise
     * 2. Try to infer from the defaultTab prop, otherwise
     * 3. Set to be the first tab of the list
     */
    if (_this.props.updateURL && hash) {
      activeTab = hash.substr(1);
    } else if (_this.props.defaultTab) {
      activeTab = _this.props.defaultTab;
    } else if (_this.props.tabs.length > 0) {
      activeTab = _this.props.tabs[0].id;
    }
    _this.state = {
      activeTab: activeTab
    };
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getTabs = _this.getTabs.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getTabPanes = _this.getTabPanes.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  /**
   * Handle clicks on a tab header to change the active
   * tab. If this.props.updateURL is set, update the window
   * URL and scroll to the top of the page.
   *
   * @param {number} tabId -- The tab clicked on
   * @param {Event} e -- The click event
   */
  (0, _createClass2["default"])(Tabs, [{
    key: "handleClick",
    value: function handleClick(tabId, e) {
      this.setState({
        activeTab: tabId
      });
      this.props.onTabChange(tabId);

      // Add tab href to URL querystring and scroll the page to top
      if (this.props.updateURL) {
        var scrollDistance = $('body').scrollTop() || $('html').scrollTop();
        window.location.hash = e.target.hash;
        $('html,body').scrollTop(scrollDistance);
      }
    }

    /**
     * Return a list of components for the tab links.
     *
     * @return {array} -- An array of JSX components to represent
     *                    the tab's title
     */
  }, {
    key: "getTabs",
    value: function getTabs() {
      var tabs = this.props.tabs.map(function (tab) {
        var tabClass = this.state.activeTab === tab.id ? 'active' : null;
        var href = '#' + tab.id;
        var tabID = 'tab-' + tab.id;
        return /*#__PURE__*/_react["default"].createElement("li", {
          role: "presentation",
          className: tabClass,
          key: tab.id
        }, /*#__PURE__*/_react["default"].createElement("a", {
          id: tabID,
          href: href,
          role: "tab",
          "data-toggle": "tab",
          onClick: this.handleClick.bind(null, tab.id)
        }, tab.label));
      }.bind(this));
      return tabs;
    }

    /**
     * Return the body of the active tab.
     *
     * @return {object} -- A JSX component of the active tab panel.
     */
  }, {
    key: "getTabPanes",
    value: function getTabPanes() {
      var tabPanes = _react["default"].Children.map(this.props.children, function (child, key) {
        if (child) {
          return /*#__PURE__*/_react["default"].cloneElement(child, {
            activeTab: this.state.activeTab,
            key: key
          });
        }
      }.bind(this));
      return tabPanes;
    }

    /**
     * React lifecycle method
     *
     * @return {object} -- The rendered JSX component
     */
  }, {
    key: "render",
    value: function render() {
      var tabs = this.getTabs();
      var tabPanes = this.getTabPanes();
      var tabStyle = {
        marginLeft: 0,
        marginBottom: '5px'
      };
      return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("ul", {
        className: "nav nav-tabs",
        role: "tablist",
        style: tabStyle
      }, tabs), /*#__PURE__*/_react["default"].createElement("div", {
        className: "tab-content"
      }, tabPanes));
    }
  }]);
  return Tabs;
}(_react.Component);
Tabs.propTypes = {
  tabs: _propTypes["default"].array.isRequired,
  defaultTab: _propTypes["default"].string,
  updateURL: _propTypes["default"].bool,
  onTabChange: _propTypes["default"].func,
  children: _propTypes["default"].node
};
Tabs.defaultProps = {
  onTabChange: function onTabChange() {},
  // Set updateURL to default to true but allow for change
  // Nested tabs should set this variable to false
  updateURL: true
};

/**
 * VerticalTabs is a React component which dynamically renders
 * a set of vertical tabs corresponding to tab panes.
 */
var VerticalTabs = exports.VerticalTabs = /*#__PURE__*/function (_Component2) {
  (0, _inherits2["default"])(VerticalTabs, _Component2);
  var _super2 = _createSuper(VerticalTabs);
  /**
   * Construct the Component
   *
   * @param {array} props - array of React props
   */
  function VerticalTabs(props) {
    var _this2;
    (0, _classCallCheck2["default"])(this, VerticalTabs);
    _this2 = _super2.call(this, props);
    var hash = window.location.hash;
    var activeTab = '';

    /**
     * Determine the initial active tab in this order
     * 1. Try to infer from the URL, otherwise
     * 2. Try to infer from the defaultTab prop, otherwise
     * 3. Set to be the first tab of the list
     */
    if (_this2.props.updateURL && hash) {
      activeTab = hash.substr(1);
    } else if (_this2.props.defaultTab) {
      activeTab = _this2.props.defaultTab;
    } else if (_this2.props.tabs.length > 0) {
      activeTab = _this2.props.tabs[0].id;
    }
    _this2.state = {
      activeTab: activeTab
    };
    _this2.handleClick = _this2.handleClick.bind((0, _assertThisInitialized2["default"])(_this2));
    _this2.getTabs = _this2.getTabs.bind((0, _assertThisInitialized2["default"])(_this2));
    _this2.getTabPanes = _this2.getTabPanes.bind((0, _assertThisInitialized2["default"])(_this2));
    return _this2;
  }

  /**
   * Handle clicks on a tab header to change the active
   * tab. If this.props.updateURL is set, update the window
   * URL and scroll to the top of the page.
   *
   * @param {number} tabId -- The tab clicked on
   * @param {Event} e -- The click event
   */
  (0, _createClass2["default"])(VerticalTabs, [{
    key: "handleClick",
    value: function handleClick(tabId, e) {
      this.setState({
        activeTab: tabId
      });
      this.props.onTabChange(tabId);

      // Add tab href to URL querystring and scroll the page to top
      if (this.props.updateURL) {
        var scrollDistance = $('body').scrollTop() || $('html').scrollTop();
        window.location.hash = e.target.hash;
        $('html,body').scrollTop(scrollDistance);
      }
    }

    /**
     * Return a list of components for the tab links.
     *
     * @return {array} -- An array of JSX components to represent
     *                    the tab's title
     */
  }, {
    key: "getTabs",
    value: function getTabs() {
      var tabs = this.props.tabs.map(function (tab) {
        var tabClass = this.state.activeTab === tab.id ? 'active' : null;
        var href = '#' + tab.id;
        var tabID = 'tab-' + tab.id;
        return /*#__PURE__*/_react["default"].createElement("li", {
          role: "presentation",
          className: tabClass,
          key: tab.id
        }, /*#__PURE__*/_react["default"].createElement("a", {
          id: tabID,
          href: href,
          role: "tab",
          "data-toggle": "tab",
          onClick: this.handleClick.bind(null, tab.id)
        }, tab.label));
      }.bind(this));
      return tabs;
    }

    /**
     * Return the body of the active tab.
     *
     * @return {object} -- A JSX component of the active tab panel.
     */
  }, {
    key: "getTabPanes",
    value: function getTabPanes() {
      var tabPanes = _react["default"].Children.map(this.props.children, function (child, key) {
        if (child) {
          return /*#__PURE__*/_react["default"].cloneElement(child, {
            activeTab: this.state.activeTab,
            key: key
          });
        }
      }.bind(this));
      return tabPanes;
    }

    /**
     * React lifecycle method
     *
     * @return {object}
     */
  }, {
    key: "render",
    value: function render() {
      var tabs = this.getTabs();
      var tabPanes = this.getTabPanes();
      var tabStyle = {
        marginLeft: 0,
        marginBottom: '5px'
      };
      return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "tabbable col-md-3 col-sm-3"
      }, /*#__PURE__*/_react["default"].createElement("ul", {
        className: "nav nav-pills nav-stacked",
        role: "tablist",
        style: tabStyle
      }, tabs)), /*#__PURE__*/_react["default"].createElement("div", {
        className: "tab-content col-md-9 col-sm-9"
      }, tabPanes));
    }
  }]);
  return VerticalTabs;
}(_react.Component);
VerticalTabs.propTypes = {
  tabs: _propTypes["default"].array.isRequired,
  defaultTab: _propTypes["default"].string,
  updateURL: _propTypes["default"].bool,
  onTabChange: _propTypes["default"].func,
  children: _propTypes["default"].node
};
VerticalTabs.defaultProps = {
  onTabChange: function onTabChange() {},
  // Set updateURL to default to true but allow for change
  // Nested tabs should set this variable to false
  updateURL: true
};

/**
 * TabPane component.
 * Used to wrap content for every tab.
 */
var TabPane = exports.TabPane = /*#__PURE__*/function (_Component3) {
  (0, _inherits2["default"])(TabPane, _Component3);
  var _super3 = _createSuper(TabPane);
  function TabPane() {
    (0, _classCallCheck2["default"])(this, TabPane);
    return _super3.apply(this, arguments);
  }
  (0, _createClass2["default"])(TabPane, [{
    key: "render",
    value:
    /**
     * React lifecycle method
     *
     * @return {object}
     */
    function render() {
      var classList = 'tab-pane';
      var title;
      if (this.props.TabId === this.props.activeTab) {
        classList += ' active';
      }
      if (this.props.Title) {
        title = /*#__PURE__*/_react["default"].createElement("h1", null, this.props.Title);
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        role: "tabpanel",
        className: classList,
        id: this.props.TabId
      }, title, this.props.children);
    }
  }]);
  return TabPane;
}(_react.Component);
TabPane.propTypes = {
  TabId: _propTypes["default"].string.isRequired,
  Title: _propTypes["default"].string,
  activeTab: _propTypes["default"].string,
  children: _propTypes["default"].node
};

/***/ },

/***/ "./jslib/errors/ApiNetworkError.ts"
/*!*****************************************!*\
  !*** ./jslib/errors/ApiNetworkError.ts ***!
  \*****************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };
    return _extendStatics(d, b);
  };
  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    _extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ApiNetworkError = void 0;
var HttpError_1 = __webpack_require__(/*! ./HttpError */ "./jslib/errors/HttpError.ts");
/**
 * Error thrown for network-level issues (e.g., no internet connection, DNS failure).
 */
var ApiNetworkError = /** @class */function (_super) {
  __extends(ApiNetworkError, _super);
  /**
   * @param request The Request object that generated the error.
   * @param message The error message.
   */
  function ApiNetworkError(request, message) {
    var _this = _super.call(this, request, undefined, message || 'Network error occurred during API call.') || this;
    _this.name = 'APINetworkError';
    return _this;
  }
  return ApiNetworkError;
}(HttpError_1.HttpError);
exports.ApiNetworkError = ApiNetworkError;

/***/ },

/***/ "./jslib/errors/ApiResponseError.ts"
/*!******************************************!*\
  !*** ./jslib/errors/ApiResponseError.ts ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };
    return _extendStatics(d, b);
  };
  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    _extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ApiResponseError = void 0;
var HttpError_1 = __webpack_require__(/*! ./HttpError */ "./jslib/errors/HttpError.ts");
/**
 * Error thrown for non-2xx HTTP responses from the API.
 * It includes the raw Response object for additional context.
 */
var ApiResponseError = /** @class */function (_super) {
  __extends(ApiResponseError, _super);
  /**
   *
   * @param request  The Request object that generated the error.
   * @param response The raw HTTP Response object.
   * @param message  The error message.
   */
  function ApiResponseError(request, response, message) {
    var _this = _super.call(this, request, response, message || "Request to ".concat(request.url, " failed with status code ").concat(response.status, ".")) || this;
    _this.name = 'ApiResponseError';
    return _this;
  }
  return ApiResponseError;
}(HttpError_1.HttpError);
exports.ApiResponseError = ApiResponseError;

/***/ },

/***/ "./jslib/errors/BaseError.ts"
/*!***********************************!*\
  !*** ./jslib/errors/BaseError.ts ***!
  \***********************************/
(__unused_webpack_module, exports) {

"use strict";


var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };
    return _extendStatics(d, b);
  };
  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    _extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BaseError = void 0;
/**
 * Base class for all custom API-related errors.
 */
var BaseError = /** @class */function (_super) {
  __extends(BaseError, _super);
  /**
   *
   * @param message The error message.
   */
  function BaseError(message) {
    var _newTarget = this.constructor;
    var _this = _super.call(this, message) || this;
    _this.name = 'BaseError';
    Object.setPrototypeOf(_this, _newTarget.prototype);
    return _this;
  }
  return BaseError;
}(Error);
exports.BaseError = BaseError;

/***/ },

/***/ "./jslib/errors/HttpError.ts"
/*!***********************************!*\
  !*** ./jslib/errors/HttpError.ts ***!
  \***********************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };
    return _extendStatics(d, b);
  };
  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    _extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.HttpError = void 0;
var BaseError_1 = __webpack_require__(/*! ./BaseError */ "./jslib/errors/BaseError.ts");
/**
 * Base class for HTTP-related errors.
 */
var HttpError = /** @class */function (_super) {
  __extends(HttpError, _super);
  /**
   * @param request The Request object that generated the error.
   * @param response The raw HTTP Response object (guaranteed to be 2xx, e.g., 204).
   * @param message The error message.
   */
  function HttpError(request, response, message) {
    var _this = _super.call(this, message) || this;
    _this.request = request;
    _this.response = response;
    _this.name = 'HttpError';
    return _this;
  }
  return HttpError;
}(BaseError_1.BaseError);
exports.HttpError = HttpError;

/***/ },

/***/ "./jslib/errors/JsonParseError.ts"
/*!****************************************!*\
  !*** ./jslib/errors/JsonParseError.ts ***!
  \****************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };
    return _extendStatics(d, b);
  };
  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    _extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.JsonParseError = void 0;
var HttpError_1 = __webpack_require__(/*! ./HttpError */ "./jslib/errors/HttpError.ts");
/**
 * Error thrown when a JSON response from the server cannot be parsed.
 */
var JsonParseError = /** @class */function (_super) {
  __extends(JsonParseError, _super);
  /**
   * @param request The Request object that generated the error.
   * @param message The error message.
   */
  function JsonParseError(request, message) {
    var _this = _super.call(this, request, undefined, message || 'The server returned an invalid JSON response.') || this;
    _this.name = 'JsonParseError';
    return _this;
  }
  return JsonParseError;
}(HttpError_1.HttpError);
exports.JsonParseError = JsonParseError;

/***/ },

/***/ "./jslib/errors/NoContentError.ts"
/*!****************************************!*\
  !*** ./jslib/errors/NoContentError.ts ***!
  \****************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };
    return _extendStatics(d, b);
  };
  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    _extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.NoContentError = void 0;
var HttpError_1 = __webpack_require__(/*! ./HttpError */ "./jslib/errors/HttpError.ts");
/**
 * Error thrown when a request succeeds (i.e., status 2xx)
 * but the response body contains no content or is not the expected JSON format.
 * This typically corresponds to a 204 No Content status when content was expected.
 */
var NoContentError = /** @class */function (_super) {
  __extends(NoContentError, _super);
  /**
   * @param request The Request object that was sent.
   * @param response The Response object from the fetch call.
   * @param message The error message.
   */
  function NoContentError(request, response, message) {
    var _this = _super.call(this, request, response, message || 'Operation succeeded but server returned no content.') || this;
    _this.name = 'NoContentError';
    return _this;
  }
  return NoContentError;
}(HttpError_1.HttpError);
exports.NoContentError = NoContentError;

/***/ },

/***/ "./jslib/errors/ValidationError.ts"
/*!*****************************************!*\
  !*** ./jslib/errors/ValidationError.ts ***!
  \*****************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };
    return _extendStatics(d, b);
  };
  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    _extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ValidationError = void 0;
var BaseError_1 = __webpack_require__(/*! ./BaseError */ "./jslib/errors/BaseError.ts");
/**
 * Error thrown when data validation fails.
 */
var ValidationError = /** @class */function (_super) {
  __extends(ValidationError, _super);
  /**
   *
   * @param message The error message.
   */
  function ValidationError(message) {
    var _newTarget = this.constructor;
    var _this = _super.call(this, message) || this;
    _this.name = 'ValidationError';
    Object.setPrototypeOf(_this, _newTarget.prototype);
    return _this;
  }
  return ValidationError;
}(BaseError_1.BaseError);
exports.ValidationError = ValidationError;

/***/ },

/***/ "./jslib/errors/index.ts"
/*!*******************************!*\
  !*** ./jslib/errors/index.ts ***!
  \*******************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.NoContent = exports.JsonParse = exports.ApiResponse = exports.ApiNetwork = exports.Validation = exports.Http = exports.Base = void 0;
var BaseError_1 = __webpack_require__(/*! ./BaseError */ "./jslib/errors/BaseError.ts");
Object.defineProperty(exports, "Base", ({
  enumerable: true,
  get: function get() {
    return BaseError_1.BaseError;
  }
}));
var HttpError_1 = __webpack_require__(/*! ./HttpError */ "./jslib/errors/HttpError.ts");
Object.defineProperty(exports, "Http", ({
  enumerable: true,
  get: function get() {
    return HttpError_1.HttpError;
  }
}));
var ValidationError_1 = __webpack_require__(/*! ./ValidationError */ "./jslib/errors/ValidationError.ts");
Object.defineProperty(exports, "Validation", ({
  enumerable: true,
  get: function get() {
    return ValidationError_1.ValidationError;
  }
}));
var ApiNetworkError_1 = __webpack_require__(/*! ./ApiNetworkError */ "./jslib/errors/ApiNetworkError.ts");
Object.defineProperty(exports, "ApiNetwork", ({
  enumerable: true,
  get: function get() {
    return ApiNetworkError_1.ApiNetworkError;
  }
}));
var ApiResponseError_1 = __webpack_require__(/*! ./ApiResponseError */ "./jslib/errors/ApiResponseError.ts");
Object.defineProperty(exports, "ApiResponse", ({
  enumerable: true,
  get: function get() {
    return ApiResponseError_1.ApiResponseError;
  }
}));
var JsonParseError_1 = __webpack_require__(/*! ./JsonParseError */ "./jslib/errors/JsonParseError.ts");
Object.defineProperty(exports, "JsonParse", ({
  enumerable: true,
  get: function get() {
    return JsonParseError_1.JsonParseError;
  }
}));
var NoContentError_1 = __webpack_require__(/*! ./NoContentError */ "./jslib/errors/NoContentError.ts");
Object.defineProperty(exports, "NoContent", ({
  enumerable: true,
  get: function get() {
    return NoContentError_1.NoContentError;
  }
}));

/***/ },

/***/ "./jslib/http/Client.ts"
/*!******************************!*\
  !*** ./jslib/http/Client.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function sent() {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Client = void 0;
var Query_1 = __webpack_require__(/*! ./Query */ "./jslib/http/Query.ts");
var __1 = __webpack_require__(/*! ../ */ "./jslib/index.ts");
/**
 * A basic client for making HTTP requests to a REST API endpoint.
 */
var Client = /** @class */function () {
  /**
   * Creates a new API client instance.
   *
   * @param baseURL The base URL for the API requests.
   */
  function Client(baseURL) {
    /**
     * Function to retrieve a custom error message for a given error context.
     */
    this.getErrorMessage = function () {
      return undefined;
    };
    var origin = window.location.origin; // always https://...
    var full = "".concat(origin, "/").concat(baseURL, "/");
    this.baseURL = new URL(full);
  }
  /**
   * Sets an optional sub-endpoint path.
   *
   * @param subEndpoint An optional endpoint segment to append to the baseURL.
   */
  Client.prototype.setSubEndpoint = function (subEndpoint) {
    this.subEndpoint = subEndpoint;
    return this;
  };
  /**
   * Fetches a collection of resources.
   *
   * @param query A Query object to build the URL query string.
   */
  Client.prototype.get = function (query) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2 /*return*/, this.fetchJSON(this.buildURL('', query), {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        })];
      });
    });
  };
  /**
   * Fetches a list of unique labels for the resource type based on query parameters.
   *
   * @param {...QueryParam} params One or more QueryParam objects to filter the labels.
   */
  Client.prototype.getLabels = function () {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      params[_i] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
      var query;
      return __generator(this, function (_a) {
        query = new Query_1.Query();
        params.forEach(function (param) {
          return query.addParam(param);
        });
        return [2 /*return*/, this.get(query.addField('label'))];
      });
    });
  };
  /**
   * Fetches a single resource by its ID.
   *
   * @param id The unique identifier of the resource to fetch.
   */
  Client.prototype.getById = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2 /*return*/, this.fetchJSON(this.buildURL(id), {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        })];
      });
    });
  };
  /**
   * Creates a new resource on the server.
   *
   * @param data   The resource data to be created.
   * @param mapper An optional function to map the input data before sending.
   */
  Client.prototype.create = function (data, mapper) {
    return __awaiter(this, void 0, void 0, function () {
      var payload;
      return __generator(this, function (_a) {
        payload = mapper ? mapper(data) : data;
        return [2 /*return*/, this.fetchJSON(this.buildURL(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })];
      });
    });
  };
  /**
   * Updates an existing resource on the server.
   *
   * @param id The unique identifier of the resource to update.
   * @param data The new resource data.
   */
  Client.prototype.update = function (id, data) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2 /*return*/, this.fetchJSON(this.buildURL(id), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })];
      });
    });
  };
  /**
   * Handles the actual fetching and JSON parsing, including error handling.
   *
   * @param url     The URL to which the request will be made.
   * @param options The Fetch API request initialization options.
   */
  Client.prototype.fetchJSON = function (url, options) {
    return __awaiter(this, void 0, void 0, function () {
      var request, response, contentType, data, e_1, message, error_1, message;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            request = new Request(url, options);
            _a.label = 1;
          case 1:
            _a.trys.push([1, 7,, 8]);
            return [4 /*yield*/, fetch(request)];
          case 2:
            response = _a.sent();
            // 1. Handle HTTP status errors (e.g., 404, 500)
            if (!response.ok) {
              throw new __1.Errors.ApiResponse(request, response, this.getErrorMessage('ApiResponseError', request, response));
            }
            // 2. Handle HTTP 204 No Content (Success, but nothing to parse)
            if (response.status === 204) {
              return [2 /*return*/, {}];
            }
            contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new __1.Errors.NoContent(request, response, this.getErrorMessage('NoContentError', request, response));
            }
            _a.label = 3;
          case 3:
            _a.trys.push([3, 5,, 6]);
            return [4 /*yield*/, response.json()];
          case 4:
            data = _a.sent();
            return [2 /*return*/, data];
          case 5:
            e_1 = _a.sent();
            message = this.getErrorMessage('JsonParseError', request);
            throw new __1.Errors.JsonParse(request, message);
          case 6:
            return [3 /*break*/, 8];
          case 7:
            error_1 = _a.sent();
            // 5. Re-throw custom errors; wrap native network errors
            if (error_1 instanceof __1.Errors.Http || error_1 instanceof __1.Errors.ApiResponse) {
              throw error_1; // Re-throw our custom errors
            }
            message = this.getErrorMessage('ApiNetworkError', request);
            throw new __1.Errors.ApiNetwork(request, message);
          case 8:
            return [2 /*return*/];
        }
      });
    });
  };
  /**
   * Constructs a full URL by combining the base URL, sub-endpoint,
   * and an optional path or resource ID, then appends query parameters.
   *
   * @param path  - An optional sub-path or resource ID (e.g., '123' or 'details').
   * Defaults to an empty string.
   * @param query - An optional Query object used to build the URL's search parameters.
   * @returns A fully constructed URL object.
   */
  Client.prototype.buildURL = function (path, query) {
    if (path === void 0) {
      path = '';
    }
    // 1. Resolve segments (this.baseURL + subEndpoint + id/path)
    var segments = [this.subEndpoint, path].filter(Boolean).join('/');
    var url = new URL(segments, this.baseURL);
    // 2. Append the pre-built query string
    if (query) {
      url.search = query.build();
    }
    return url;
  };
  return Client;
}();
exports.Client = Client;

/***/ },

/***/ "./jslib/http/Query.ts"
/*!*****************************!*\
  !*** ./jslib/http/Query.ts ***!
  \*****************************/
(__unused_webpack_module, exports) {

"use strict";


var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Query = exports.Operator = void 0;
var Operator;
(function (Operator) {
  Operator["Equals"] = "";
  Operator["NotEquals"] = "!=";
  Operator["LessThan"] = "<";
  Operator["GreaterThan"] = ">";
  Operator["LessThanOrEqual"] = "<=";
  Operator["GreaterThanOrEqual"] = ">=";
  Operator["Like"] = "_like";
  Operator["Includes"] = "_in";
})(Operator || (exports.Operator = Operator = {}));
/**
 * Utility class to build URL query strings for API requests.
 */
var Query = /** @class */function () {
  function Query() {
    this.params = {};
    this.selectedFields = [];
  }
  /**
   * Adds a filter parameter to the query string.
   * TODO: Add support for multiple values for same field
   *
   * @param root0          The destructured QueryParam object.
   * @param root0.field    The field to filter on.
   * @param root0.value    The value to filter against.
   * @param root0.operator The comparison operator to use.
   */
  Query.prototype.addParam = function (_a) {
    var field = _a.field,
      value = _a.value,
      _b = _a.operator,
      operator = _b === void 0 ? Operator.Equals : _b;
    this.params["".concat(field).concat(operator)] = value;
    return this;
  };
  /**
   * Adds a field to the 'fields' selection parameter.
   *
   * @param field The field to include in the response payload.
   */
  Query.prototype.addField = function (field) {
    if (!this.selectedFields.includes(field)) {
      this.selectedFields.push(field);
    }
    return this;
  };
  /**
   * Sets the maximum number of results to return.
   *
   * @param limit The maximum number of results to return.
   */
  Query.prototype.addLimit = function (limit) {
    this.params['limit'] = limit.toString();
    return this;
  };
  /**
   * Sets the offset for pagination.
   *
   * @param offset The number of results to skip for pagination.
   */
  Query.prototype.addOffset = function (offset) {
    this.params['offset'] = offset.toString();
    return this;
  };
  /**
   * Sets the sorting field and direction.
   *
   * @param field The field to sort the results by.
   * @param direction The sort direction.
   */
  Query.prototype.addSort = function (field, direction) {
    this.params['sort'] = "".concat(field, ":").concat(direction);
    return this;
  };
  /**
   * Builds and returns the final URL search string.
   */
  Query.prototype.build = function () {
    var finalParams = __assign({}, this.params);
    if (this.selectedFields.length > 0) {
      finalParams['fields'] = this.selectedFields.join(',');
    }
    return new URLSearchParams(finalParams).toString();
  };
  return Query;
}();
exports.Query = Query;

/***/ },

/***/ "./jslib/http/index.ts"
/*!*****************************!*\
  !*** ./jslib/http/index.ts ***!
  \*****************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Query = exports.Client = void 0;
var Client_1 = __webpack_require__(/*! ./Client */ "./jslib/http/Client.ts");
Object.defineProperty(exports, "Client", ({
  enumerable: true,
  get: function get() {
    return Client_1.Client;
  }
}));
var Query_1 = __webpack_require__(/*! ./Query */ "./jslib/http/Query.ts");
Object.defineProperty(exports, "Query", ({
  enumerable: true,
  get: function get() {
    return Query_1.Query;
  }
}));

/***/ },

/***/ "./jslib/index.ts"
/*!************************!*\
  !*** ./jslib/index.ts ***!
  \************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = void 0 && (void 0).__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function get() {
        return m[k];
      }
    };
  }
  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault = void 0 && (void 0).__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});
var __importStar = void 0 && (void 0).__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }
  __setModuleDefault(result, mod);
  return result;
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Http = exports.Errors = void 0;
exports.Errors = __importStar(__webpack_require__(/*! ./errors */ "./jslib/errors/index.ts"));
exports.Http = __importStar(__webpack_require__(/*! ./http */ "./jslib/http/index.ts"));

/***/ },

/***/ "./jsx/I18nSetup.ts"
/*!**************************!*\
  !*** ./jsx/I18nSetup.ts ***!
  \**************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var i18next_1 = __importDefault(__webpack_require__(/*! i18next */ "./node_modules/i18next/dist/cjs/i18next.js"));
var react_i18next_1 = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/index.js");
var loris_json_1 = __importDefault(__webpack_require__(/*! ../locale/ja/LC_MESSAGES/loris.json */ "./locale/ja/LC_MESSAGES/loris.json"));
var loris_json_2 = __importDefault(__webpack_require__(/*! ../locale/hi/LC_MESSAGES/loris.json */ "./locale/hi/LC_MESSAGES/loris.json"));
var loris_json_3 = __importDefault(__webpack_require__(/*! ../locale/es/LC_MESSAGES/loris.json */ "./locale/es/LC_MESSAGES/loris.json"));
var loris_json_4 = __importDefault(__webpack_require__(/*! ../locale/en/LC_MESSAGES/loris.json */ "./locale/en/LC_MESSAGES/loris.json"));
var loris_json_5 = __importDefault(__webpack_require__(/*! ../locale/fr/LC_MESSAGES/loris.json */ "./locale/fr/LC_MESSAGES/loris.json"));
var loris_json_6 = __importDefault(__webpack_require__(/*! ../locale/zh/LC_MESSAGES/loris.json */ "./locale/zh/LC_MESSAGES/loris.json"));
var resources = {
  ja: {
    loris: loris_json_1["default"]
  },
  hi: {
    loris: loris_json_2["default"]
  },
  es: {
    loris: loris_json_3["default"]
  },
  en: {
    loris: loris_json_4["default"]
  },
  fr: {
    loris: loris_json_5["default"]
  },
  zh: {
    loris: loris_json_6["default"]
  }
};
/**
 * Get language from cookie, session, or default
 *
 * @return {string} language code
 */
var getLanguagePreference = function getLanguagePreference() {
  var _a;
  // Check for language cookie first (persists across session regeneration)
  var cookieMatch = document.cookie.match(/(?:^|; )loris_language=([^;]*)/);
  if (cookieMatch) {
    return cookieMatch[1];
  }
  // Fall back to langpref from PHP
  return (_a = loris.user.langpref) !== null && _a !== void 0 ? _a : 'en';
};
i18next_1["default"].use(react_i18next_1.initReactI18next) // passes i18n down to react-i18next
.init({
  resources: resources,
  // debug: true,
  partialBundledLanguages: true,
  lng: getLanguagePreference(),
  interpolation: {
    escapeValue: false // react already safes from xss
  },
  // Modules add to this with addResourceBundle
  ns: ['loris'],
  defaultNS: 'loris',
  fallbackNS: []
});
exports["default"] = i18next_1["default"];

/***/ },

/***/ "./jsx/Loader.tsx"
/*!************************!*\
  !*** ./jsx/Loader.tsx ***!
  \************************/
(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
/**
 * Loader component renders a spinner wheel of a specified size.
 *
 * @param {LoaderProps} props - The properties for the Loader component
 * @returns {JSX.Element} A div representing the loading spinner
 */
var Loader = function Loader(_a) {
  var _b = _a.size,
    size = _b === void 0 ? 120 : _b;
  var loaderStyle = {
    width: size,
    height: size,
    borderWidth: size / 15
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "loader",
    style: loaderStyle
  });
};
exports["default"] = Loader;

/***/ },

/***/ "./jsx/form/InputLabel.tsx"
/*!*********************************!*\
  !*** ./jsx/form/InputLabel.tsx ***!
  \*********************************/
(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
/**
 * Input label React component
 *
 * @param props The props of the component
 * @param props.label The label content
 * @param props.required Whether the input is required
 * @param props.fullWidth Whether the label should span the full row
 * @returns The corresponding React element
 */
var InputLabel = function InputLabel(_a) {
  var label = _a.label,
    required = _a.required,
    fullWidth = _a.fullWidth;
  return /*#__PURE__*/React.createElement("label", {
    className: "col-sm-".concat(fullWidth ? '12' : '3', " control-label"),
    htmlFor: typeof label === 'string' ? label : undefined,
    style: fullWidth ? {
      textAlign: 'left'
    } : {}
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*"));
};
exports["default"] = InputLabel;

/***/ },

/***/ "./modules/configuration/jsx/StudyEntitiesClient.ts"
/*!**********************************************************!*\
  !*** ./modules/configuration/jsx/StudyEntitiesClient.ts ***!
  \**********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };
    return _extendStatics(d, b);
  };
  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    _extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function sent() {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var jslib_1 = __webpack_require__(/*! jslib */ "./jslib/index.ts");
var http_1 = __webpack_require__(/*! jslib/http */ "./jslib/http/index.ts");
/**
 * HTTP client for the cohort and project forms.
 */
var StudyEntitiesClient = /** @class */function (_super) {
  __extends(StudyEntitiesClient, _super);
  function StudyEntitiesClient() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Submit form values to the existing guarded endpoint.
   *
   * @param url Save endpoint
   * @param body Form values
   * @return Parsed save response
   */
  StudyEntitiesClient.prototype.save = function (url, body) {
    return __awaiter(this, void 0, void 0, function () {
      var error_1, responseData;
      var _a, _b;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            _c.trys.push([0, 2,, 5]);
            return [4 /*yield*/, this.fetchJSON(new URL(url, window.location.origin), {
              body: body,
              credentials: 'same-origin',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
              },
              method: 'POST'
            })];
          case 1:
            return [2 /*return*/, _c.sent()];
          case 2:
            error_1 = _c.sent();
            if (!(error_1 instanceof jslib_1.Errors.ApiResponse && ((_b = (_a = error_1.response) === null || _a === void 0 ? void 0 : _a.headers.get('Content-Type')) === null || _b === void 0 ? void 0 : _b.includes('application/json')))) return [3 /*break*/, 4];
            return [4 /*yield*/, error_1.response.json()];
          case 3:
            responseData = _c.sent();
            if (responseData.error) {
              error_1.message = responseData.error;
            }
            _c.label = 4;
          case 4:
            throw error_1;
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  return StudyEntitiesClient;
}(http_1.Client);
exports["default"] = StudyEntitiesClient;

/***/ },

/***/ "./node_modules/html-parse-stringify/dist/html-parse-stringify.module.js"
/*!*******************************************************************************!*\
  !*** ./node_modules/html-parse-stringify/dist/html-parse-stringify.module.js ***!
  \*******************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var void_elements__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! void-elements */ "./node_modules/void-elements/index.js");
/* harmony import */ var void_elements__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(void_elements__WEBPACK_IMPORTED_MODULE_0__);
var t=/\s([^'"/\s><]+?)[\s/>]|([^\s=]+)=\s?(".*?"|'.*?')/g;function n(n){var r={type:"tag",name:"",voidElement:!1,attrs:{},children:[]},i=n.match(/<\/?([^\s]+?)[/\s>]/);if(i&&(r.name=i[1],((void_elements__WEBPACK_IMPORTED_MODULE_0___default())[i[1]]||"/"===n.charAt(n.length-2))&&(r.voidElement=!0),r.name.startsWith("!--"))){var s=n.indexOf("--\x3e");return{type:"comment",comment:-1!==s?n.slice(4,s):""}}for(var a=new RegExp(t),c=null;null!==(c=a.exec(n));)if(c[0].trim())if(c[1]){var o=c[1].trim(),l=[o,""];o.indexOf("=")>-1&&(l=o.split("=")),r.attrs[l[0]]=l[1],a.lastIndex--}else c[2]&&(r.attrs[c[2]]=c[3].trim().substring(1,c[3].length-1));return r}var r=/<[a-zA-Z0-9\-\!\/](?:"[^"]*"|'[^']*'|[^'">])*>/g,i=/^\s*$/,s=Object.create(null);function a(e,t){switch(t.type){case"text":return e+t.content;case"tag":return e+="<"+t.name+(t.attrs?function(e){var t=[];for(var n in e)t.push(n+'="'+e[n]+'"');return t.length?" "+t.join(" "):""}(t.attrs):"")+(t.voidElement?"/>":">"),t.voidElement?e:e+t.children.reduce(a,"")+"</"+t.name+">";case"comment":return e+"\x3c!--"+t.comment+"--\x3e"}}var c={parse:function(e,t){t||(t={}),t.components||(t.components=s);var a,c=[],o=[],l=-1,m=!1;if(0!==e.indexOf("<")){var u=e.indexOf("<");c.push({type:"text",content:-1===u?e:e.substring(0,u)})}return e.replace(r,function(r,s){if(m){if(r!=="</"+a.name+">")return;m=!1}var u,f="/"!==r.charAt(1),h=r.startsWith("\x3c!--"),p=s+r.length,d=e.charAt(p);if(h){var v=n(r);return l<0?(c.push(v),c):((u=o[l]).children.push(v),c)}if(f&&(l++,"tag"===(a=n(r)).type&&t.components[a.name]&&(a.type="component",m=!0),a.voidElement||m||!d||"<"===d||a.children.push({type:"text",content:e.slice(p,e.indexOf("<",p))}),0===l&&c.push(a),(u=o[l-1])&&u.children.push(a),o[l]=a),(!f||a.voidElement)&&(l>-1&&(a.voidElement||a.name===r.slice(2,-1))&&(l--,a=-1===l?c:o[l]),!m&&"<"!==d&&d)){u=-1===l?c:o[l].children;var x=e.indexOf("<",p),g=e.slice(p,-1===x?void 0:x);i.test(g)&&(g=" "),(x>-1&&l+u.length>=0||" "!==g)&&u.push({type:"text",content:g})}}),c},stringify:function(e){return e.reduce(function(e,t){return e+a("",t)},"")}};/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (c);
//# sourceMappingURL=html-parse-stringify.module.js.map


/***/ },

/***/ "./node_modules/i18next/dist/cjs/i18next.js"
/*!**************************************************!*\
  !*** ./node_modules/i18next/dist/cjs/i18next.js ***!
  \**************************************************/
(module) {

"use strict";


const isString = obj => typeof obj === 'string';
const defer = () => {
  let res;
  let rej;
  const promise = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });
  promise.resolve = res;
  promise.reject = rej;
  return promise;
};
const makeString = object => {
  if (object == null) return '';
  return '' + object;
};
const copy = (a, s, t) => {
  a.forEach(m => {
    if (s[m]) t[m] = s[m];
  });
};
const lastOfPathSeparatorRegExp = /###/g;
const cleanKey = key => key && key.indexOf('###') > -1 ? key.replace(lastOfPathSeparatorRegExp, '.') : key;
const canNotTraverseDeeper = object => !object || isString(object);
const getLastOfPath = (object, path, Empty) => {
  const stack = !isString(path) ? path : path.split('.');
  let stackIndex = 0;
  while (stackIndex < stack.length - 1) {
    if (canNotTraverseDeeper(object)) return {};
    const key = cleanKey(stack[stackIndex]);
    if (!object[key] && Empty) object[key] = new Empty();
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      object = object[key];
    } else {
      object = {};
    }
    ++stackIndex;
  }
  if (canNotTraverseDeeper(object)) return {};
  return {
    obj: object,
    k: cleanKey(stack[stackIndex])
  };
};
const setPath = (object, path, newValue) => {
  const {
    obj,
    k
  } = getLastOfPath(object, path, Object);
  if (obj !== undefined || path.length === 1) {
    obj[k] = newValue;
    return;
  }
  let e = path[path.length - 1];
  let p = path.slice(0, path.length - 1);
  let last = getLastOfPath(object, p, Object);
  while (last.obj === undefined && p.length) {
    e = `${p[p.length - 1]}.${e}`;
    p = p.slice(0, p.length - 1);
    last = getLastOfPath(object, p, Object);
    if (last?.obj && typeof last.obj[`${last.k}.${e}`] !== 'undefined') {
      last.obj = undefined;
    }
  }
  last.obj[`${last.k}.${e}`] = newValue;
};
const pushPath = (object, path, newValue, concat) => {
  const {
    obj,
    k
  } = getLastOfPath(object, path, Object);
  obj[k] = obj[k] || [];
  obj[k].push(newValue);
};
const getPath = (object, path) => {
  const {
    obj,
    k
  } = getLastOfPath(object, path);
  if (!obj) return undefined;
  if (!Object.prototype.hasOwnProperty.call(obj, k)) return undefined;
  return obj[k];
};
const getPathWithDefaults = (data, defaultData, key) => {
  const value = getPath(data, key);
  if (value !== undefined) {
    return value;
  }
  return getPath(defaultData, key);
};
const deepExtend = (target, source, overwrite) => {
  for (const prop in source) {
    if (prop !== '__proto__' && prop !== 'constructor') {
      if (prop in target) {
        if (isString(target[prop]) || target[prop] instanceof String || isString(source[prop]) || source[prop] instanceof String) {
          if (overwrite) target[prop] = source[prop];
        } else {
          deepExtend(target[prop], source[prop], overwrite);
        }
      } else {
        target[prop] = source[prop];
      }
    }
  }
  return target;
};
const regexEscape = str => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
var _entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};
const escape = data => {
  if (isString(data)) {
    return data.replace(/[&<>"'\/]/g, s => _entityMap[s]);
  }
  return data;
};
class RegExpCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.regExpMap = new Map();
    this.regExpQueue = [];
  }
  getRegExp(pattern) {
    const regExpFromCache = this.regExpMap.get(pattern);
    if (regExpFromCache !== undefined) {
      return regExpFromCache;
    }
    const regExpNew = new RegExp(pattern);
    if (this.regExpQueue.length === this.capacity) {
      this.regExpMap.delete(this.regExpQueue.shift());
    }
    this.regExpMap.set(pattern, regExpNew);
    this.regExpQueue.push(pattern);
    return regExpNew;
  }
}
const chars = [' ', ',', '?', '!', ';'];
const looksLikeObjectPathRegExpCache = new RegExpCache(20);
const looksLikeObjectPath = (key, nsSeparator, keySeparator) => {
  nsSeparator = nsSeparator || '';
  keySeparator = keySeparator || '';
  const possibleChars = chars.filter(c => nsSeparator.indexOf(c) < 0 && keySeparator.indexOf(c) < 0);
  if (possibleChars.length === 0) return true;
  const r = looksLikeObjectPathRegExpCache.getRegExp(`(${possibleChars.map(c => c === '?' ? '\\?' : c).join('|')})`);
  let matched = !r.test(key);
  if (!matched) {
    const ki = key.indexOf(keySeparator);
    if (ki > 0 && !r.test(key.substring(0, ki))) {
      matched = true;
    }
  }
  return matched;
};
const deepFind = function (obj, path) {
  let keySeparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';
  if (!obj) return undefined;
  if (obj[path]) {
    if (!Object.prototype.hasOwnProperty.call(obj, path)) return undefined;
    return obj[path];
  }
  const tokens = path.split(keySeparator);
  let current = obj;
  for (let i = 0; i < tokens.length;) {
    if (!current || typeof current !== 'object') {
      return undefined;
    }
    let next;
    let nextPath = '';
    for (let j = i; j < tokens.length; ++j) {
      if (j !== i) {
        nextPath += keySeparator;
      }
      nextPath += tokens[j];
      next = current[nextPath];
      if (next !== undefined) {
        if (['string', 'number', 'boolean'].indexOf(typeof next) > -1 && j < tokens.length - 1) {
          continue;
        }
        i += j - i + 1;
        break;
      }
    }
    current = next;
  }
  return current;
};
const getCleanedCode = code => code?.replace('_', '-');

const consoleLogger = {
  type: 'logger',
  log(args) {
    this.output('log', args);
  },
  warn(args) {
    this.output('warn', args);
  },
  error(args) {
    this.output('error', args);
  },
  output(type, args) {
    console?.[type]?.apply?.(console, args);
  }
};
class Logger {
  constructor(concreteLogger) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this.init(concreteLogger, options);
  }
  init(concreteLogger) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this.prefix = options.prefix || 'i18next:';
    this.logger = concreteLogger || consoleLogger;
    this.options = options;
    this.debug = options.debug;
  }
  log() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return this.forward(args, 'log', '', true);
  }
  warn() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return this.forward(args, 'warn', '', true);
  }
  error() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    return this.forward(args, 'error', '');
  }
  deprecate() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return this.forward(args, 'warn', 'WARNING DEPRECATED: ', true);
  }
  forward(args, lvl, prefix, debugOnly) {
    if (debugOnly && !this.debug) return null;
    if (isString(args[0])) args[0] = `${prefix}${this.prefix} ${args[0]}`;
    return this.logger[lvl](args);
  }
  create(moduleName) {
    return new Logger(this.logger, {
      ...{
        prefix: `${this.prefix}:${moduleName}:`
      },
      ...this.options
    });
  }
  clone(options) {
    options = options || this.options;
    options.prefix = options.prefix || this.prefix;
    return new Logger(this.logger, options);
  }
}
var baseLogger = new Logger();

class EventEmitter {
  constructor() {
    this.observers = {};
  }
  on(events, listener) {
    events.split(' ').forEach(event => {
      if (!this.observers[event]) this.observers[event] = new Map();
      const numListeners = this.observers[event].get(listener) || 0;
      this.observers[event].set(listener, numListeners + 1);
    });
    return this;
  }
  off(event, listener) {
    if (!this.observers[event]) return;
    if (!listener) {
      delete this.observers[event];
      return;
    }
    this.observers[event].delete(listener);
  }
  emit(event) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    if (this.observers[event]) {
      const cloned = Array.from(this.observers[event].entries());
      cloned.forEach(_ref => {
        let [observer, numTimesAdded] = _ref;
        for (let i = 0; i < numTimesAdded; i++) {
          observer(...args);
        }
      });
    }
    if (this.observers['*']) {
      const cloned = Array.from(this.observers['*'].entries());
      cloned.forEach(_ref2 => {
        let [observer, numTimesAdded] = _ref2;
        for (let i = 0; i < numTimesAdded; i++) {
          observer.apply(observer, [event, ...args]);
        }
      });
    }
  }
}

class ResourceStore extends EventEmitter {
  constructor(data) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      ns: ['translation'],
      defaultNS: 'translation'
    };
    super();
    this.data = data || {};
    this.options = options;
    if (this.options.keySeparator === undefined) {
      this.options.keySeparator = '.';
    }
    if (this.options.ignoreJSONStructure === undefined) {
      this.options.ignoreJSONStructure = true;
    }
  }
  addNamespaces(ns) {
    if (this.options.ns.indexOf(ns) < 0) {
      this.options.ns.push(ns);
    }
  }
  removeNamespaces(ns) {
    const index = this.options.ns.indexOf(ns);
    if (index > -1) {
      this.options.ns.splice(index, 1);
    }
  }
  getResource(lng, ns, key) {
    let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    const keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
    const ignoreJSONStructure = options.ignoreJSONStructure !== undefined ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let path;
    if (lng.indexOf('.') > -1) {
      path = lng.split('.');
    } else {
      path = [lng, ns];
      if (key) {
        if (Array.isArray(key)) {
          path.push(...key);
        } else if (isString(key) && keySeparator) {
          path.push(...key.split(keySeparator));
        } else {
          path.push(key);
        }
      }
    }
    const result = getPath(this.data, path);
    if (!result && !ns && !key && lng.indexOf('.') > -1) {
      lng = path[0];
      ns = path[1];
      key = path.slice(2).join('.');
    }
    if (result || !ignoreJSONStructure || !isString(key)) return result;
    return deepFind(this.data?.[lng]?.[ns], key, keySeparator);
  }
  addResource(lng, ns, key, value) {
    let options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
      silent: false
    };
    const keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
    let path = [lng, ns];
    if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);
    if (lng.indexOf('.') > -1) {
      path = lng.split('.');
      value = ns;
      ns = path[1];
    }
    this.addNamespaces(ns);
    setPath(this.data, path, value);
    if (!options.silent) this.emit('added', lng, ns, key, value);
  }
  addResources(lng, ns, resources) {
    let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
      silent: false
    };
    for (const m in resources) {
      if (isString(resources[m]) || Array.isArray(resources[m])) this.addResource(lng, ns, m, resources[m], {
        silent: true
      });
    }
    if (!options.silent) this.emit('added', lng, ns, resources);
  }
  addResourceBundle(lng, ns, resources, deep, overwrite) {
    let options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {
      silent: false,
      skipCopy: false
    };
    let path = [lng, ns];
    if (lng.indexOf('.') > -1) {
      path = lng.split('.');
      deep = resources;
      resources = ns;
      ns = path[1];
    }
    this.addNamespaces(ns);
    let pack = getPath(this.data, path) || {};
    if (!options.skipCopy) resources = JSON.parse(JSON.stringify(resources));
    if (deep) {
      deepExtend(pack, resources, overwrite);
    } else {
      pack = {
        ...pack,
        ...resources
      };
    }
    setPath(this.data, path, pack);
    if (!options.silent) this.emit('added', lng, ns, resources);
  }
  removeResourceBundle(lng, ns) {
    if (this.hasResourceBundle(lng, ns)) {
      delete this.data[lng][ns];
    }
    this.removeNamespaces(ns);
    this.emit('removed', lng, ns);
  }
  hasResourceBundle(lng, ns) {
    return this.getResource(lng, ns) !== undefined;
  }
  getResourceBundle(lng, ns) {
    if (!ns) ns = this.options.defaultNS;
    return this.getResource(lng, ns);
  }
  getDataByLanguage(lng) {
    return this.data[lng];
  }
  hasLanguageSomeTranslations(lng) {
    const data = this.getDataByLanguage(lng);
    const n = data && Object.keys(data) || [];
    return !!n.find(v => data[v] && Object.keys(data[v]).length > 0);
  }
  toJSON() {
    return this.data;
  }
}

var postProcessor = {
  processors: {},
  addPostProcessor(module) {
    this.processors[module.name] = module;
  },
  handle(processors, value, key, options, translator) {
    processors.forEach(processor => {
      value = this.processors[processor]?.process(value, key, options, translator) ?? value;
    });
    return value;
  }
};

const checkedLoadedFor = {};
const shouldHandleAsObject = res => !isString(res) && typeof res !== 'boolean' && typeof res !== 'number';
class Translator extends EventEmitter {
  constructor(services) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super();
    copy(['resourceStore', 'languageUtils', 'pluralResolver', 'interpolator', 'backendConnector', 'i18nFormat', 'utils'], services, this);
    this.options = options;
    if (this.options.keySeparator === undefined) {
      this.options.keySeparator = '.';
    }
    this.logger = baseLogger.create('translator');
  }
  changeLanguage(lng) {
    if (lng) this.language = lng;
  }
  exists(key) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      interpolation: {}
    };
    if (key == null) {
      return false;
    }
    const resolved = this.resolve(key, options);
    return resolved?.res !== undefined;
  }
  extractFromKey(key, opt) {
    let nsSeparator = opt.nsSeparator !== undefined ? opt.nsSeparator : this.options.nsSeparator;
    if (nsSeparator === undefined) nsSeparator = ':';
    const keySeparator = opt.keySeparator !== undefined ? opt.keySeparator : this.options.keySeparator;
    let namespaces = opt.ns || this.options.defaultNS || [];
    const wouldCheckForNsInKey = nsSeparator && key.indexOf(nsSeparator) > -1;
    const seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !opt.keySeparator && !this.options.userDefinedNsSeparator && !opt.nsSeparator && !looksLikeObjectPath(key, nsSeparator, keySeparator);
    if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
      const m = key.match(this.interpolator.nestingRegexp);
      if (m && m.length > 0) {
        return {
          key,
          namespaces: isString(namespaces) ? [namespaces] : namespaces
        };
      }
      const parts = key.split(nsSeparator);
      if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
      key = parts.join(keySeparator);
    }
    return {
      key,
      namespaces: isString(namespaces) ? [namespaces] : namespaces
    };
  }
  translate(keys, opt, lastKey) {
    if (typeof opt !== 'object' && this.options.overloadTranslationOptionHandler) {
      opt = this.options.overloadTranslationOptionHandler(arguments);
    }
    if (typeof options === 'object') opt = {
      ...opt
    };
    if (!opt) opt = {};
    if (keys == null) return '';
    if (!Array.isArray(keys)) keys = [String(keys)];
    const returnDetails = opt.returnDetails !== undefined ? opt.returnDetails : this.options.returnDetails;
    const keySeparator = opt.keySeparator !== undefined ? opt.keySeparator : this.options.keySeparator;
    const {
      key,
      namespaces
    } = this.extractFromKey(keys[keys.length - 1], opt);
    const namespace = namespaces[namespaces.length - 1];
    const lng = opt.lng || this.language;
    const appendNamespaceToCIMode = opt.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if (lng?.toLowerCase() === 'cimode') {
      if (appendNamespaceToCIMode) {
        const nsSeparator = opt.nsSeparator || this.options.nsSeparator;
        if (returnDetails) {
          return {
            res: `${namespace}${nsSeparator}${key}`,
            usedKey: key,
            exactUsedKey: key,
            usedLng: lng,
            usedNS: namespace,
            usedParams: this.getUsedParamsDetails(opt)
          };
        }
        return `${namespace}${nsSeparator}${key}`;
      }
      if (returnDetails) {
        return {
          res: key,
          usedKey: key,
          exactUsedKey: key,
          usedLng: lng,
          usedNS: namespace,
          usedParams: this.getUsedParamsDetails(opt)
        };
      }
      return key;
    }
    const resolved = this.resolve(keys, opt);
    let res = resolved?.res;
    const resUsedKey = resolved?.usedKey || key;
    const resExactUsedKey = resolved?.exactUsedKey || key;
    const noObject = ['[object Number]', '[object Function]', '[object RegExp]'];
    const joinArrays = opt.joinArrays !== undefined ? opt.joinArrays : this.options.joinArrays;
    const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
    const needsPluralHandling = opt.count !== undefined && !isString(opt.count);
    const hasDefaultValue = Translator.hasDefaultValue(opt);
    const defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, opt.count, opt) : '';
    const defaultValueSuffixOrdinalFallback = opt.ordinal && needsPluralHandling ? this.pluralResolver.getSuffix(lng, opt.count, {
      ordinal: false
    }) : '';
    const needsZeroSuffixLookup = needsPluralHandling && !opt.ordinal && opt.count === 0;
    const defaultValue = needsZeroSuffixLookup && opt[`defaultValue${this.options.pluralSeparator}zero`] || opt[`defaultValue${defaultValueSuffix}`] || opt[`defaultValue${defaultValueSuffixOrdinalFallback}`] || opt.defaultValue;
    let resForObjHndl = res;
    if (handleAsObjectInI18nFormat && !res && hasDefaultValue) {
      resForObjHndl = defaultValue;
    }
    const handleAsObject = shouldHandleAsObject(resForObjHndl);
    const resType = Object.prototype.toString.apply(resForObjHndl);
    if (handleAsObjectInI18nFormat && resForObjHndl && handleAsObject && noObject.indexOf(resType) < 0 && !(isString(joinArrays) && Array.isArray(resForObjHndl))) {
      if (!opt.returnObjects && !this.options.returnObjects) {
        if (!this.options.returnedObjectHandler) {
          this.logger.warn('accessing an object - but returnObjects options is not enabled!');
        }
        const r = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, resForObjHndl, {
          ...opt,
          ns: namespaces
        }) : `key '${key} (${this.language})' returned an object instead of string.`;
        if (returnDetails) {
          resolved.res = r;
          resolved.usedParams = this.getUsedParamsDetails(opt);
          return resolved;
        }
        return r;
      }
      if (keySeparator) {
        const resTypeIsArray = Array.isArray(resForObjHndl);
        const copy = resTypeIsArray ? [] : {};
        const newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
        for (const m in resForObjHndl) {
          if (Object.prototype.hasOwnProperty.call(resForObjHndl, m)) {
            const deepKey = `${newKeyToUse}${keySeparator}${m}`;
            if (hasDefaultValue && !res) {
              copy[m] = this.translate(deepKey, {
                ...opt,
                defaultValue: shouldHandleAsObject(defaultValue) ? defaultValue[m] : undefined,
                ...{
                  joinArrays: false,
                  ns: namespaces
                }
              });
            } else {
              copy[m] = this.translate(deepKey, {
                ...opt,
                ...{
                  joinArrays: false,
                  ns: namespaces
                }
              });
            }
            if (copy[m] === deepKey) copy[m] = resForObjHndl[m];
          }
        }
        res = copy;
      }
    } else if (handleAsObjectInI18nFormat && isString(joinArrays) && Array.isArray(res)) {
      res = res.join(joinArrays);
      if (res) res = this.extendTranslation(res, keys, opt, lastKey);
    } else {
      let usedDefault = false;
      let usedKey = false;
      if (!this.isValidLookup(res) && hasDefaultValue) {
        usedDefault = true;
        res = defaultValue;
      }
      if (!this.isValidLookup(res)) {
        usedKey = true;
        res = key;
      }
      const missingKeyNoValueFallbackToKey = opt.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey;
      const resForMissing = missingKeyNoValueFallbackToKey && usedKey ? undefined : res;
      const updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;
      if (usedKey || usedDefault || updateMissing) {
        this.logger.log(updateMissing ? 'updateKey' : 'missingKey', lng, namespace, key, updateMissing ? defaultValue : res);
        if (keySeparator) {
          const fk = this.resolve(key, {
            ...opt,
            keySeparator: false
          });
          if (fk && fk.res) this.logger.warn('Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.');
        }
        let lngs = [];
        const fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, opt.lng || this.language);
        if (this.options.saveMissingTo === 'fallback' && fallbackLngs && fallbackLngs[0]) {
          for (let i = 0; i < fallbackLngs.length; i++) {
            lngs.push(fallbackLngs[i]);
          }
        } else if (this.options.saveMissingTo === 'all') {
          lngs = this.languageUtils.toResolveHierarchy(opt.lng || this.language);
        } else {
          lngs.push(opt.lng || this.language);
        }
        const send = (l, k, specificDefaultValue) => {
          const defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
          if (this.options.missingKeyHandler) {
            this.options.missingKeyHandler(l, namespace, k, defaultForMissing, updateMissing, opt);
          } else if (this.backendConnector?.saveMissing) {
            this.backendConnector.saveMissing(l, namespace, k, defaultForMissing, updateMissing, opt);
          }
          this.emit('missingKey', l, namespace, k, res);
        };
        if (this.options.saveMissing) {
          if (this.options.saveMissingPlurals && needsPluralHandling) {
            lngs.forEach(language => {
              const suffixes = this.pluralResolver.getSuffixes(language, opt);
              if (needsZeroSuffixLookup && opt[`defaultValue${this.options.pluralSeparator}zero`] && suffixes.indexOf(`${this.options.pluralSeparator}zero`) < 0) {
                suffixes.push(`${this.options.pluralSeparator}zero`);
              }
              suffixes.forEach(suffix => {
                send([language], key + suffix, opt[`defaultValue${suffix}`] || defaultValue);
              });
            });
          } else {
            send(lngs, key, defaultValue);
          }
        }
      }
      res = this.extendTranslation(res, keys, opt, resolved, lastKey);
      if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = `${namespace}:${key}`;
      if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) {
        res = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${namespace}:${key}` : key, usedDefault ? res : undefined);
      }
    }
    if (returnDetails) {
      resolved.res = res;
      resolved.usedParams = this.getUsedParamsDetails(opt);
      return resolved;
    }
    return res;
  }
  extendTranslation(res, key, opt, resolved, lastKey) {
    var _this = this;
    if (this.i18nFormat?.parse) {
      res = this.i18nFormat.parse(res, {
        ...this.options.interpolation.defaultVariables,
        ...opt
      }, opt.lng || this.language || resolved.usedLng, resolved.usedNS, resolved.usedKey, {
        resolved
      });
    } else if (!opt.skipInterpolation) {
      if (opt.interpolation) this.interpolator.init({
        ...opt,
        ...{
          interpolation: {
            ...this.options.interpolation,
            ...opt.interpolation
          }
        }
      });
      const skipOnVariables = isString(res) && (opt?.interpolation?.skipOnVariables !== undefined ? opt.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
      let nestBef;
      if (skipOnVariables) {
        const nb = res.match(this.interpolator.nestingRegexp);
        nestBef = nb && nb.length;
      }
      let data = opt.replace && !isString(opt.replace) ? opt.replace : opt;
      if (this.options.interpolation.defaultVariables) data = {
        ...this.options.interpolation.defaultVariables,
        ...data
      };
      res = this.interpolator.interpolate(res, data, opt.lng || this.language || resolved.usedLng, opt);
      if (skipOnVariables) {
        const na = res.match(this.interpolator.nestingRegexp);
        const nestAft = na && na.length;
        if (nestBef < nestAft) opt.nest = false;
      }
      if (!opt.lng && resolved && resolved.res) opt.lng = this.language || resolved.usedLng;
      if (opt.nest !== false) res = this.interpolator.nest(res, function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        if (lastKey?.[0] === args[0] && !opt.context) {
          _this.logger.warn(`It seems you are nesting recursively key: ${args[0]} in key: ${key[0]}`);
          return null;
        }
        return _this.translate(...args, key);
      }, opt);
      if (opt.interpolation) this.interpolator.reset();
    }
    const postProcess = opt.postProcess || this.options.postProcess;
    const postProcessorNames = isString(postProcess) ? [postProcess] : postProcess;
    if (res != null && postProcessorNames?.length && opt.applyPostProcessor !== false) {
      res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? {
        i18nResolved: {
          ...resolved,
          usedParams: this.getUsedParamsDetails(opt)
        },
        ...opt
      } : opt, this);
    }
    return res;
  }
  resolve(keys) {
    let opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let found;
    let usedKey;
    let exactUsedKey;
    let usedLng;
    let usedNS;
    if (isString(keys)) keys = [keys];
    keys.forEach(k => {
      if (this.isValidLookup(found)) return;
      const extracted = this.extractFromKey(k, opt);
      const key = extracted.key;
      usedKey = key;
      let namespaces = extracted.namespaces;
      if (this.options.fallbackNS) namespaces = namespaces.concat(this.options.fallbackNS);
      const needsPluralHandling = opt.count !== undefined && !isString(opt.count);
      const needsZeroSuffixLookup = needsPluralHandling && !opt.ordinal && opt.count === 0;
      const needsContextHandling = opt.context !== undefined && (isString(opt.context) || typeof opt.context === 'number') && opt.context !== '';
      const codes = opt.lngs ? opt.lngs : this.languageUtils.toResolveHierarchy(opt.lng || this.language, opt.fallbackLng);
      namespaces.forEach(ns => {
        if (this.isValidLookup(found)) return;
        usedNS = ns;
        if (!checkedLoadedFor[`${codes[0]}-${ns}`] && this.utils?.hasLoadedNamespace && !this.utils?.hasLoadedNamespace(usedNS)) {
          checkedLoadedFor[`${codes[0]}-${ns}`] = true;
          this.logger.warn(`key "${usedKey}" for languages "${codes.join(', ')}" won't get resolved as namespace "${usedNS}" was not yet loaded`, 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!');
        }
        codes.forEach(code => {
          if (this.isValidLookup(found)) return;
          usedLng = code;
          const finalKeys = [key];
          if (this.i18nFormat?.addLookupKeys) {
            this.i18nFormat.addLookupKeys(finalKeys, key, code, ns, opt);
          } else {
            let pluralSuffix;
            if (needsPluralHandling) pluralSuffix = this.pluralResolver.getSuffix(code, opt.count, opt);
            const zeroSuffix = `${this.options.pluralSeparator}zero`;
            const ordinalPrefix = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
            if (needsPluralHandling) {
              finalKeys.push(key + pluralSuffix);
              if (opt.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                finalKeys.push(key + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
              }
              if (needsZeroSuffixLookup) {
                finalKeys.push(key + zeroSuffix);
              }
            }
            if (needsContextHandling) {
              const contextKey = `${key}${this.options.contextSeparator}${opt.context}`;
              finalKeys.push(contextKey);
              if (needsPluralHandling) {
                finalKeys.push(contextKey + pluralSuffix);
                if (opt.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                  finalKeys.push(contextKey + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
                }
                if (needsZeroSuffixLookup) {
                  finalKeys.push(contextKey + zeroSuffix);
                }
              }
            }
          }
          let possibleKey;
          while (possibleKey = finalKeys.pop()) {
            if (!this.isValidLookup(found)) {
              exactUsedKey = possibleKey;
              found = this.getResource(code, ns, possibleKey, opt);
            }
          }
        });
      });
    });
    return {
      res: found,
      usedKey,
      exactUsedKey,
      usedLng,
      usedNS
    };
  }
  isValidLookup(res) {
    return res !== undefined && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === '');
  }
  getResource(code, ns, key) {
    let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    if (this.i18nFormat?.getResource) return this.i18nFormat.getResource(code, ns, key, options);
    return this.resourceStore.getResource(code, ns, key, options);
  }
  getUsedParamsDetails() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const optionsKeys = ['defaultValue', 'ordinal', 'context', 'replace', 'lng', 'lngs', 'fallbackLng', 'ns', 'keySeparator', 'nsSeparator', 'returnObjects', 'returnDetails', 'joinArrays', 'postProcess', 'interpolation'];
    const useOptionsReplaceForData = options.replace && !isString(options.replace);
    let data = useOptionsReplaceForData ? options.replace : options;
    if (useOptionsReplaceForData && typeof options.count !== 'undefined') {
      data.count = options.count;
    }
    if (this.options.interpolation.defaultVariables) {
      data = {
        ...this.options.interpolation.defaultVariables,
        ...data
      };
    }
    if (!useOptionsReplaceForData) {
      data = {
        ...data
      };
      for (const key of optionsKeys) {
        delete data[key];
      }
    }
    return data;
  }
  static hasDefaultValue(options) {
    const prefix = 'defaultValue';
    for (const option in options) {
      if (Object.prototype.hasOwnProperty.call(options, option) && prefix === option.substring(0, prefix.length) && undefined !== options[option]) {
        return true;
      }
    }
    return false;
  }
}

class LanguageUtil {
  constructor(options) {
    this.options = options;
    this.supportedLngs = this.options.supportedLngs || false;
    this.logger = baseLogger.create('languageUtils');
  }
  getScriptPartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || code.indexOf('-') < 0) return null;
    const p = code.split('-');
    if (p.length === 2) return null;
    p.pop();
    if (p[p.length - 1].toLowerCase() === 'x') return null;
    return this.formatLanguageCode(p.join('-'));
  }
  getLanguagePartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || code.indexOf('-') < 0) return code;
    const p = code.split('-');
    return this.formatLanguageCode(p[0]);
  }
  formatLanguageCode(code) {
    if (isString(code) && code.indexOf('-') > -1) {
      let formattedCode;
      try {
        formattedCode = Intl.getCanonicalLocales(code)[0];
      } catch (e) {}
      if (formattedCode && this.options.lowerCaseLng) {
        formattedCode = formattedCode.toLowerCase();
      }
      if (formattedCode) return formattedCode;
      if (this.options.lowerCaseLng) {
        return code.toLowerCase();
      }
      return code;
    }
    return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
  }
  isSupportedCode(code) {
    if (this.options.load === 'languageOnly' || this.options.nonExplicitSupportedLngs) {
      code = this.getLanguagePartFromCode(code);
    }
    return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code) > -1;
  }
  getBestMatchFromCodes(codes) {
    if (!codes) return null;
    let found;
    codes.forEach(code => {
      if (found) return;
      const cleanedLng = this.formatLanguageCode(code);
      if (!this.options.supportedLngs || this.isSupportedCode(cleanedLng)) found = cleanedLng;
    });
    if (!found && this.options.supportedLngs) {
      codes.forEach(code => {
        if (found) return;
        const lngScOnly = this.getScriptPartFromCode(code);
        if (this.isSupportedCode(lngScOnly)) return found = lngScOnly;
        const lngOnly = this.getLanguagePartFromCode(code);
        if (this.isSupportedCode(lngOnly)) return found = lngOnly;
        found = this.options.supportedLngs.find(supportedLng => {
          if (supportedLng === lngOnly) return supportedLng;
          if (supportedLng.indexOf('-') < 0 && lngOnly.indexOf('-') < 0) return;
          if (supportedLng.indexOf('-') > 0 && lngOnly.indexOf('-') < 0 && supportedLng.substring(0, supportedLng.indexOf('-')) === lngOnly) return supportedLng;
          if (supportedLng.indexOf(lngOnly) === 0 && lngOnly.length > 1) return supportedLng;
        });
      });
    }
    if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
    return found;
  }
  getFallbackCodes(fallbacks, code) {
    if (!fallbacks) return [];
    if (typeof fallbacks === 'function') fallbacks = fallbacks(code);
    if (isString(fallbacks)) fallbacks = [fallbacks];
    if (Array.isArray(fallbacks)) return fallbacks;
    if (!code) return fallbacks.default || [];
    let found = fallbacks[code];
    if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
    if (!found) found = fallbacks[this.formatLanguageCode(code)];
    if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
    if (!found) found = fallbacks.default;
    return found || [];
  }
  toResolveHierarchy(code, fallbackCode) {
    const fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code);
    const codes = [];
    const addCode = c => {
      if (!c) return;
      if (this.isSupportedCode(c)) {
        codes.push(c);
      } else {
        this.logger.warn(`rejecting language code not found in supportedLngs: ${c}`);
      }
    };
    if (isString(code) && (code.indexOf('-') > -1 || code.indexOf('_') > -1)) {
      if (this.options.load !== 'languageOnly') addCode(this.formatLanguageCode(code));
      if (this.options.load !== 'languageOnly' && this.options.load !== 'currentOnly') addCode(this.getScriptPartFromCode(code));
      if (this.options.load !== 'currentOnly') addCode(this.getLanguagePartFromCode(code));
    } else if (isString(code)) {
      addCode(this.formatLanguageCode(code));
    }
    fallbackCodes.forEach(fc => {
      if (codes.indexOf(fc) < 0) addCode(this.formatLanguageCode(fc));
    });
    return codes;
  }
}

const suffixesOrder = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
};
const dummyRule = {
  select: count => count === 1 ? 'one' : 'other',
  resolvedOptions: () => ({
    pluralCategories: ['one', 'other']
  })
};
class PluralResolver {
  constructor(languageUtils) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this.languageUtils = languageUtils;
    this.options = options;
    this.logger = baseLogger.create('pluralResolver');
    this.pluralRulesCache = {};
  }
  addRule(lng, obj) {
    this.rules[lng] = obj;
  }
  clearCache() {
    this.pluralRulesCache = {};
  }
  getRule(code) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const cleanedCode = getCleanedCode(code === 'dev' ? 'en' : code);
    const type = options.ordinal ? 'ordinal' : 'cardinal';
    const cacheKey = JSON.stringify({
      cleanedCode,
      type
    });
    if (cacheKey in this.pluralRulesCache) {
      return this.pluralRulesCache[cacheKey];
    }
    let rule;
    try {
      rule = new Intl.PluralRules(cleanedCode, {
        type
      });
    } catch (err) {
      if (!Intl) {
        this.logger.error('No Intl support, please use an Intl polyfill!');
        return dummyRule;
      }
      if (!code.match(/-|_/)) return dummyRule;
      const lngPart = this.languageUtils.getLanguagePartFromCode(code);
      rule = this.getRule(lngPart, options);
    }
    this.pluralRulesCache[cacheKey] = rule;
    return rule;
  }
  needsPlural(code) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let rule = this.getRule(code, options);
    if (!rule) rule = this.getRule('dev', options);
    return rule?.resolvedOptions().pluralCategories.length > 1;
  }
  getPluralFormsOfKey(code, key) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return this.getSuffixes(code, options).map(suffix => `${key}${suffix}`);
  }
  getSuffixes(code) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let rule = this.getRule(code, options);
    if (!rule) rule = this.getRule('dev', options);
    if (!rule) return [];
    return rule.resolvedOptions().pluralCategories.sort((pluralCategory1, pluralCategory2) => suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2]).map(pluralCategory => `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ''}${pluralCategory}`);
  }
  getSuffix(code, count) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const rule = this.getRule(code, options);
    if (rule) {
      return `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ''}${rule.select(count)}`;
    }
    this.logger.warn(`no plural rule found for: ${code}`);
    return this.getSuffix('dev', count, options);
  }
}

const deepFindWithDefaults = function (data, defaultData, key) {
  let keySeparator = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '.';
  let ignoreJSONStructure = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  let path = getPathWithDefaults(data, defaultData, key);
  if (!path && ignoreJSONStructure && isString(key)) {
    path = deepFind(data, key, keySeparator);
    if (path === undefined) path = deepFind(defaultData, key, keySeparator);
  }
  return path;
};
const regexSafe = val => val.replace(/\$/g, '$$$$');
class Interpolator {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.logger = baseLogger.create('interpolator');
    this.options = options;
    this.format = options?.interpolation?.format || (value => value);
    this.init(options);
  }
  init() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (!options.interpolation) options.interpolation = {
      escapeValue: true
    };
    const {
      escape: escape$1,
      escapeValue,
      useRawValueToEscape,
      prefix,
      prefixEscaped,
      suffix,
      suffixEscaped,
      formatSeparator,
      unescapeSuffix,
      unescapePrefix,
      nestingPrefix,
      nestingPrefixEscaped,
      nestingSuffix,
      nestingSuffixEscaped,
      nestingOptionsSeparator,
      maxReplaces,
      alwaysFormat
    } = options.interpolation;
    this.escape = escape$1 !== undefined ? escape$1 : escape;
    this.escapeValue = escapeValue !== undefined ? escapeValue : true;
    this.useRawValueToEscape = useRawValueToEscape !== undefined ? useRawValueToEscape : false;
    this.prefix = prefix ? regexEscape(prefix) : prefixEscaped || '{{';
    this.suffix = suffix ? regexEscape(suffix) : suffixEscaped || '}}';
    this.formatSeparator = formatSeparator || ',';
    this.unescapePrefix = unescapeSuffix ? '' : unescapePrefix || '-';
    this.unescapeSuffix = this.unescapePrefix ? '' : unescapeSuffix || '';
    this.nestingPrefix = nestingPrefix ? regexEscape(nestingPrefix) : nestingPrefixEscaped || regexEscape('$t(');
    this.nestingSuffix = nestingSuffix ? regexEscape(nestingSuffix) : nestingSuffixEscaped || regexEscape(')');
    this.nestingOptionsSeparator = nestingOptionsSeparator || ',';
    this.maxReplaces = maxReplaces || 1000;
    this.alwaysFormat = alwaysFormat !== undefined ? alwaysFormat : false;
    this.resetRegExp();
  }
  reset() {
    if (this.options) this.init(this.options);
  }
  resetRegExp() {
    const getOrResetRegExp = (existingRegExp, pattern) => {
      if (existingRegExp?.source === pattern) {
        existingRegExp.lastIndex = 0;
        return existingRegExp;
      }
      return new RegExp(pattern, 'g');
    };
    this.regexp = getOrResetRegExp(this.regexp, `${this.prefix}(.+?)${this.suffix}`);
    this.regexpUnescape = getOrResetRegExp(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`);
    this.nestingRegexp = getOrResetRegExp(this.nestingRegexp, `${this.nestingPrefix}(.+?)${this.nestingSuffix}`);
  }
  interpolate(str, data, lng, options) {
    let match;
    let value;
    let replaces;
    const defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
    const handleFormat = key => {
      if (key.indexOf(this.formatSeparator) < 0) {
        const path = deepFindWithDefaults(data, defaultData, key, this.options.keySeparator, this.options.ignoreJSONStructure);
        return this.alwaysFormat ? this.format(path, undefined, lng, {
          ...options,
          ...data,
          interpolationkey: key
        }) : path;
      }
      const p = key.split(this.formatSeparator);
      const k = p.shift().trim();
      const f = p.join(this.formatSeparator).trim();
      return this.format(deepFindWithDefaults(data, defaultData, k, this.options.keySeparator, this.options.ignoreJSONStructure), f, lng, {
        ...options,
        ...data,
        interpolationkey: k
      });
    };
    this.resetRegExp();
    const missingInterpolationHandler = options?.missingInterpolationHandler || this.options.missingInterpolationHandler;
    const skipOnVariables = options?.interpolation?.skipOnVariables !== undefined ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
    const todos = [{
      regex: this.regexpUnescape,
      safeValue: val => regexSafe(val)
    }, {
      regex: this.regexp,
      safeValue: val => this.escapeValue ? regexSafe(this.escape(val)) : regexSafe(val)
    }];
    todos.forEach(todo => {
      replaces = 0;
      while (match = todo.regex.exec(str)) {
        const matchedVar = match[1].trim();
        value = handleFormat(matchedVar);
        if (value === undefined) {
          if (typeof missingInterpolationHandler === 'function') {
            const temp = missingInterpolationHandler(str, match, options);
            value = isString(temp) ? temp : '';
          } else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar)) {
            value = '';
          } else if (skipOnVariables) {
            value = match[0];
            continue;
          } else {
            this.logger.warn(`missed to pass in variable ${matchedVar} for interpolating ${str}`);
            value = '';
          }
        } else if (!isString(value) && !this.useRawValueToEscape) {
          value = makeString(value);
        }
        const safeValue = todo.safeValue(value);
        str = str.replace(match[0], safeValue);
        if (skipOnVariables) {
          todo.regex.lastIndex += value.length;
          todo.regex.lastIndex -= match[0].length;
        } else {
          todo.regex.lastIndex = 0;
        }
        replaces++;
        if (replaces >= this.maxReplaces) {
          break;
        }
      }
    });
    return str;
  }
  nest(str, fc) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    let match;
    let value;
    let clonedOptions;
    const handleHasOptions = (key, inheritedOptions) => {
      const sep = this.nestingOptionsSeparator;
      if (key.indexOf(sep) < 0) return key;
      const c = key.split(new RegExp(`${sep}[ ]*{`));
      let optionsString = `{${c[1]}`;
      key = c[0];
      optionsString = this.interpolate(optionsString, clonedOptions);
      const matchedSingleQuotes = optionsString.match(/'/g);
      const matchedDoubleQuotes = optionsString.match(/"/g);
      if ((matchedSingleQuotes?.length ?? 0) % 2 === 0 && !matchedDoubleQuotes || matchedDoubleQuotes.length % 2 !== 0) {
        optionsString = optionsString.replace(/'/g, '"');
      }
      try {
        clonedOptions = JSON.parse(optionsString);
        if (inheritedOptions) clonedOptions = {
          ...inheritedOptions,
          ...clonedOptions
        };
      } catch (e) {
        this.logger.warn(`failed parsing options string in nesting for key ${key}`, e);
        return `${key}${sep}${optionsString}`;
      }
      if (clonedOptions.defaultValue && clonedOptions.defaultValue.indexOf(this.prefix) > -1) delete clonedOptions.defaultValue;
      return key;
    };
    while (match = this.nestingRegexp.exec(str)) {
      let formatters = [];
      clonedOptions = {
        ...options
      };
      clonedOptions = clonedOptions.replace && !isString(clonedOptions.replace) ? clonedOptions.replace : clonedOptions;
      clonedOptions.applyPostProcessor = false;
      delete clonedOptions.defaultValue;
      let doReduce = false;
      if (match[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(match[1])) {
        const r = match[1].split(this.formatSeparator).map(elem => elem.trim());
        match[1] = r.shift();
        formatters = r;
        doReduce = true;
      }
      value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
      if (value && match[0] === str && !isString(value)) return value;
      if (!isString(value)) value = makeString(value);
      if (!value) {
        this.logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
        value = '';
      }
      if (doReduce) {
        value = formatters.reduce((v, f) => this.format(v, f, options.lng, {
          ...options,
          interpolationkey: match[1].trim()
        }), value.trim());
      }
      str = str.replace(match[0], value);
      this.regexp.lastIndex = 0;
    }
    return str;
  }
}

const parseFormatStr = formatStr => {
  let formatName = formatStr.toLowerCase().trim();
  const formatOptions = {};
  if (formatStr.indexOf('(') > -1) {
    const p = formatStr.split('(');
    formatName = p[0].toLowerCase().trim();
    const optStr = p[1].substring(0, p[1].length - 1);
    if (formatName === 'currency' && optStr.indexOf(':') < 0) {
      if (!formatOptions.currency) formatOptions.currency = optStr.trim();
    } else if (formatName === 'relativetime' && optStr.indexOf(':') < 0) {
      if (!formatOptions.range) formatOptions.range = optStr.trim();
    } else {
      const opts = optStr.split(';');
      opts.forEach(opt => {
        if (opt) {
          const [key, ...rest] = opt.split(':');
          const val = rest.join(':').trim().replace(/^'+|'+$/g, '');
          const trimmedKey = key.trim();
          if (!formatOptions[trimmedKey]) formatOptions[trimmedKey] = val;
          if (val === 'false') formatOptions[trimmedKey] = false;
          if (val === 'true') formatOptions[trimmedKey] = true;
          if (!isNaN(val)) formatOptions[trimmedKey] = parseInt(val, 10);
        }
      });
    }
  }
  return {
    formatName,
    formatOptions
  };
};
const createCachedFormatter = fn => {
  const cache = {};
  return (val, lng, options) => {
    let optForCache = options;
    if (options && options.interpolationkey && options.formatParams && options.formatParams[options.interpolationkey] && options[options.interpolationkey]) {
      optForCache = {
        ...optForCache,
        [options.interpolationkey]: undefined
      };
    }
    const key = lng + JSON.stringify(optForCache);
    let formatter = cache[key];
    if (!formatter) {
      formatter = fn(getCleanedCode(lng), options);
      cache[key] = formatter;
    }
    return formatter(val);
  };
};
class Formatter {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.logger = baseLogger.create('formatter');
    this.options = options;
    this.formats = {
      number: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt
        });
        return val => formatter.format(val);
      }),
      currency: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt,
          style: 'currency'
        });
        return val => formatter.format(val);
      }),
      datetime: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.DateTimeFormat(lng, {
          ...opt
        });
        return val => formatter.format(val);
      }),
      relativetime: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.RelativeTimeFormat(lng, {
          ...opt
        });
        return val => formatter.format(val, opt.range || 'day');
      }),
      list: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.ListFormat(lng, {
          ...opt
        });
        return val => formatter.format(val);
      })
    };
    this.init(options);
  }
  init(services) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      interpolation: {}
    };
    this.formatSeparator = options.interpolation.formatSeparator || ',';
  }
  add(name, fc) {
    this.formats[name.toLowerCase().trim()] = fc;
  }
  addCached(name, fc) {
    this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc);
  }
  format(value, format, lng) {
    let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    const formats = format.split(this.formatSeparator);
    if (formats.length > 1 && formats[0].indexOf('(') > 1 && formats[0].indexOf(')') < 0 && formats.find(f => f.indexOf(')') > -1)) {
      const lastIndex = formats.findIndex(f => f.indexOf(')') > -1);
      formats[0] = [formats[0], ...formats.splice(1, lastIndex)].join(this.formatSeparator);
    }
    const result = formats.reduce((mem, f) => {
      const {
        formatName,
        formatOptions
      } = parseFormatStr(f);
      if (this.formats[formatName]) {
        let formatted = mem;
        try {
          const valOptions = options?.formatParams?.[options.interpolationkey] || {};
          const l = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
          formatted = this.formats[formatName](mem, l, {
            ...formatOptions,
            ...options,
            ...valOptions
          });
        } catch (error) {
          this.logger.warn(error);
        }
        return formatted;
      } else {
        this.logger.warn(`there was no format function for ${formatName}`);
      }
      return mem;
    }, value);
    return result;
  }
}

const removePending = (q, name) => {
  if (q.pending[name] !== undefined) {
    delete q.pending[name];
    q.pendingCount--;
  }
};
class Connector extends EventEmitter {
  constructor(backend, store, services) {
    let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    super();
    this.backend = backend;
    this.store = store;
    this.services = services;
    this.languageUtils = services.languageUtils;
    this.options = options;
    this.logger = baseLogger.create('backendConnector');
    this.waitingReads = [];
    this.maxParallelReads = options.maxParallelReads || 10;
    this.readingCalls = 0;
    this.maxRetries = options.maxRetries >= 0 ? options.maxRetries : 5;
    this.retryTimeout = options.retryTimeout >= 1 ? options.retryTimeout : 350;
    this.state = {};
    this.queue = [];
    this.backend?.init?.(services, options.backend, options);
  }
  queueLoad(languages, namespaces, options, callback) {
    const toLoad = {};
    const pending = {};
    const toLoadLanguages = {};
    const toLoadNamespaces = {};
    languages.forEach(lng => {
      let hasAllNamespaces = true;
      namespaces.forEach(ns => {
        const name = `${lng}|${ns}`;
        if (!options.reload && this.store.hasResourceBundle(lng, ns)) {
          this.state[name] = 2;
        } else if (this.state[name] < 0) ; else if (this.state[name] === 1) {
          if (pending[name] === undefined) pending[name] = true;
        } else {
          this.state[name] = 1;
          hasAllNamespaces = false;
          if (pending[name] === undefined) pending[name] = true;
          if (toLoad[name] === undefined) toLoad[name] = true;
          if (toLoadNamespaces[ns] === undefined) toLoadNamespaces[ns] = true;
        }
      });
      if (!hasAllNamespaces) toLoadLanguages[lng] = true;
    });
    if (Object.keys(toLoad).length || Object.keys(pending).length) {
      this.queue.push({
        pending,
        pendingCount: Object.keys(pending).length,
        loaded: {},
        errors: [],
        callback
      });
    }
    return {
      toLoad: Object.keys(toLoad),
      pending: Object.keys(pending),
      toLoadLanguages: Object.keys(toLoadLanguages),
      toLoadNamespaces: Object.keys(toLoadNamespaces)
    };
  }
  loaded(name, err, data) {
    const s = name.split('|');
    const lng = s[0];
    const ns = s[1];
    if (err) this.emit('failedLoading', lng, ns, err);
    if (!err && data) {
      this.store.addResourceBundle(lng, ns, data, undefined, undefined, {
        skipCopy: true
      });
    }
    this.state[name] = err ? -1 : 2;
    if (err && data) this.state[name] = 0;
    const loaded = {};
    this.queue.forEach(q => {
      pushPath(q.loaded, [lng], ns);
      removePending(q, name);
      if (err) q.errors.push(err);
      if (q.pendingCount === 0 && !q.done) {
        Object.keys(q.loaded).forEach(l => {
          if (!loaded[l]) loaded[l] = {};
          const loadedKeys = q.loaded[l];
          if (loadedKeys.length) {
            loadedKeys.forEach(n => {
              if (loaded[l][n] === undefined) loaded[l][n] = true;
            });
          }
        });
        q.done = true;
        if (q.errors.length) {
          q.callback(q.errors);
        } else {
          q.callback();
        }
      }
    });
    this.emit('loaded', loaded);
    this.queue = this.queue.filter(q => !q.done);
  }
  read(lng, ns, fcName) {
    let tried = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    let wait = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : this.retryTimeout;
    let callback = arguments.length > 5 ? arguments[5] : undefined;
    if (!lng.length) return callback(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng,
        ns,
        fcName,
        tried,
        wait,
        callback
      });
      return;
    }
    this.readingCalls++;
    const resolver = (err, data) => {
      this.readingCalls--;
      if (this.waitingReads.length > 0) {
        const next = this.waitingReads.shift();
        this.read(next.lng, next.ns, next.fcName, next.tried, next.wait, next.callback);
      }
      if (err && data && tried < this.maxRetries) {
        setTimeout(() => {
          this.read.call(this, lng, ns, fcName, tried + 1, wait * 2, callback);
        }, wait);
        return;
      }
      callback(err, data);
    };
    const fc = this.backend[fcName].bind(this.backend);
    if (fc.length === 2) {
      try {
        const r = fc(lng, ns);
        if (r && typeof r.then === 'function') {
          r.then(data => resolver(null, data)).catch(resolver);
        } else {
          resolver(null, r);
        }
      } catch (err) {
        resolver(err);
      }
      return;
    }
    return fc(lng, ns, resolver);
  }
  prepareLoading(languages, namespaces) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    let callback = arguments.length > 3 ? arguments[3] : undefined;
    if (!this.backend) {
      this.logger.warn('No backend was added via i18next.use. Will not load resources.');
      return callback && callback();
    }
    if (isString(languages)) languages = this.languageUtils.toResolveHierarchy(languages);
    if (isString(namespaces)) namespaces = [namespaces];
    const toLoad = this.queueLoad(languages, namespaces, options, callback);
    if (!toLoad.toLoad.length) {
      if (!toLoad.pending.length) callback();
      return null;
    }
    toLoad.toLoad.forEach(name => {
      this.loadOne(name);
    });
  }
  load(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {}, callback);
  }
  reload(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {
      reload: true
    }, callback);
  }
  loadOne(name) {
    let prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    const s = name.split('|');
    const lng = s[0];
    const ns = s[1];
    this.read(lng, ns, 'read', undefined, undefined, (err, data) => {
      if (err) this.logger.warn(`${prefix}loading namespace ${ns} for language ${lng} failed`, err);
      if (!err && data) this.logger.log(`${prefix}loaded namespace ${ns} for language ${lng}`, data);
      this.loaded(name, err, data);
    });
  }
  saveMissing(languages, namespace, key, fallbackValue, isUpdate) {
    let options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
    let clb = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : () => {};
    if (this.services?.utils?.hasLoadedNamespace && !this.services?.utils?.hasLoadedNamespace(namespace)) {
      this.logger.warn(`did not save key "${key}" as the namespace "${namespace}" was not yet loaded`, 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!');
      return;
    }
    if (key === undefined || key === null || key === '') return;
    if (this.backend?.create) {
      const opts = {
        ...options,
        isUpdate
      };
      const fc = this.backend.create.bind(this.backend);
      if (fc.length < 6) {
        try {
          let r;
          if (fc.length === 5) {
            r = fc(languages, namespace, key, fallbackValue, opts);
          } else {
            r = fc(languages, namespace, key, fallbackValue);
          }
          if (r && typeof r.then === 'function') {
            r.then(data => clb(null, data)).catch(clb);
          } else {
            clb(null, r);
          }
        } catch (err) {
          clb(err);
        }
      } else {
        fc(languages, namespace, key, fallbackValue, clb, opts);
      }
    }
    if (!languages || !languages[0]) return;
    this.store.addResource(languages[0], namespace, key, fallbackValue);
  }
}

const get = () => ({
  debug: false,
  initAsync: true,
  ns: ['translation'],
  defaultNS: ['translation'],
  fallbackLng: ['dev'],
  fallbackNS: false,
  supportedLngs: false,
  nonExplicitSupportedLngs: false,
  load: 'all',
  preload: false,
  simplifyPluralSuffix: true,
  keySeparator: '.',
  nsSeparator: ':',
  pluralSeparator: '_',
  contextSeparator: '_',
  partialBundledLanguages: false,
  saveMissing: false,
  updateMissing: false,
  saveMissingTo: 'fallback',
  saveMissingPlurals: true,
  missingKeyHandler: false,
  missingInterpolationHandler: false,
  postProcess: false,
  postProcessPassResolved: false,
  returnNull: false,
  returnEmptyString: true,
  returnObjects: false,
  joinArrays: false,
  returnedObjectHandler: false,
  parseMissingKeyHandler: false,
  appendNamespaceToMissingKey: false,
  appendNamespaceToCIMode: false,
  overloadTranslationOptionHandler: args => {
    let ret = {};
    if (typeof args[1] === 'object') ret = args[1];
    if (isString(args[1])) ret.defaultValue = args[1];
    if (isString(args[2])) ret.tDescription = args[2];
    if (typeof args[2] === 'object' || typeof args[3] === 'object') {
      const options = args[3] || args[2];
      Object.keys(options).forEach(key => {
        ret[key] = options[key];
      });
    }
    return ret;
  },
  interpolation: {
    escapeValue: true,
    format: value => value,
    prefix: '{{',
    suffix: '}}',
    formatSeparator: ',',
    unescapePrefix: '-',
    nestingPrefix: '$t(',
    nestingSuffix: ')',
    nestingOptionsSeparator: ',',
    maxReplaces: 1000,
    skipOnVariables: true
  }
});
const transformOptions = options => {
  if (isString(options.ns)) options.ns = [options.ns];
  if (isString(options.fallbackLng)) options.fallbackLng = [options.fallbackLng];
  if (isString(options.fallbackNS)) options.fallbackNS = [options.fallbackNS];
  if (options.supportedLngs?.indexOf?.('cimode') < 0) {
    options.supportedLngs = options.supportedLngs.concat(['cimode']);
  }
  if (typeof options.initImmediate === 'boolean') options.initAsync = options.initImmediate;
  return options;
};

const noop = () => {};
const bindMemberFunctions = inst => {
  const mems = Object.getOwnPropertyNames(Object.getPrototypeOf(inst));
  mems.forEach(mem => {
    if (typeof inst[mem] === 'function') {
      inst[mem] = inst[mem].bind(inst);
    }
  });
};
class I18n extends EventEmitter {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let callback = arguments.length > 1 ? arguments[1] : undefined;
    super();
    this.options = transformOptions(options);
    this.services = {};
    this.logger = baseLogger;
    this.modules = {
      external: []
    };
    bindMemberFunctions(this);
    if (callback && !this.isInitialized && !options.isClone) {
      if (!this.options.initAsync) {
        this.init(options, callback);
        return this;
      }
      setTimeout(() => {
        this.init(options, callback);
      }, 0);
    }
  }
  init() {
    var _this = this;
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let callback = arguments.length > 1 ? arguments[1] : undefined;
    this.isInitializing = true;
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    if (options.defaultNS == null && options.ns) {
      if (isString(options.ns)) {
        options.defaultNS = options.ns;
      } else if (options.ns.indexOf('translation') < 0) {
        options.defaultNS = options.ns[0];
      }
    }
    const defOpts = get();
    this.options = {
      ...defOpts,
      ...this.options,
      ...transformOptions(options)
    };
    this.options.interpolation = {
      ...defOpts.interpolation,
      ...this.options.interpolation
    };
    if (options.keySeparator !== undefined) {
      this.options.userDefinedKeySeparator = options.keySeparator;
    }
    if (options.nsSeparator !== undefined) {
      this.options.userDefinedNsSeparator = options.nsSeparator;
    }
    const createClassOnDemand = ClassOrObject => {
      if (!ClassOrObject) return null;
      if (typeof ClassOrObject === 'function') return new ClassOrObject();
      return ClassOrObject;
    };
    if (!this.options.isClone) {
      if (this.modules.logger) {
        baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
      } else {
        baseLogger.init(null, this.options);
      }
      let formatter;
      if (this.modules.formatter) {
        formatter = this.modules.formatter;
      } else {
        formatter = Formatter;
      }
      const lu = new LanguageUtil(this.options);
      this.store = new ResourceStore(this.options.resources, this.options);
      const s = this.services;
      s.logger = baseLogger;
      s.resourceStore = this.store;
      s.languageUtils = lu;
      s.pluralResolver = new PluralResolver(lu, {
        prepend: this.options.pluralSeparator,
        simplifyPluralSuffix: this.options.simplifyPluralSuffix
      });
      if (formatter && (!this.options.interpolation.format || this.options.interpolation.format === defOpts.interpolation.format)) {
        s.formatter = createClassOnDemand(formatter);
        s.formatter.init(s, this.options);
        this.options.interpolation.format = s.formatter.format.bind(s.formatter);
      }
      s.interpolator = new Interpolator(this.options);
      s.utils = {
        hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
      };
      s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
      s.backendConnector.on('*', function (event) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        _this.emit(event, ...args);
      });
      if (this.modules.languageDetector) {
        s.languageDetector = createClassOnDemand(this.modules.languageDetector);
        if (s.languageDetector.init) s.languageDetector.init(s, this.options.detection, this.options);
      }
      if (this.modules.i18nFormat) {
        s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
        if (s.i18nFormat.init) s.i18nFormat.init(this);
      }
      this.translator = new Translator(this.services, this.options);
      this.translator.on('*', function (event) {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }
        _this.emit(event, ...args);
      });
      this.modules.external.forEach(m => {
        if (m.init) m.init(this);
      });
    }
    this.format = this.options.interpolation.format;
    if (!callback) callback = noop;
    if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      if (codes.length > 0 && codes[0] !== 'dev') this.options.lng = codes[0];
    }
    if (!this.services.languageDetector && !this.options.lng) {
      this.logger.warn('init: no languageDetector is used and no lng is defined');
    }
    const storeApi = ['getResource', 'hasResourceBundle', 'getResourceBundle', 'getDataByLanguage'];
    storeApi.forEach(fcName => {
      this[fcName] = function () {
        return _this.store[fcName](...arguments);
      };
    });
    const storeApiChained = ['addResource', 'addResources', 'addResourceBundle', 'removeResourceBundle'];
    storeApiChained.forEach(fcName => {
      this[fcName] = function () {
        _this.store[fcName](...arguments);
        return _this;
      };
    });
    const deferred = defer();
    const load = () => {
      const finish = (err, t) => {
        this.isInitializing = false;
        if (this.isInitialized && !this.initializedStoreOnce) this.logger.warn('init: i18next is already initialized. You should call init just once!');
        this.isInitialized = true;
        if (!this.options.isClone) this.logger.log('initialized', this.options);
        this.emit('initialized', this.options);
        deferred.resolve(t);
        callback(err, t);
      };
      if (this.languages && !this.isInitialized) return finish(null, this.t.bind(this));
      this.changeLanguage(this.options.lng, finish);
    };
    if (this.options.resources || !this.options.initAsync) {
      load();
    } else {
      setTimeout(load, 0);
    }
    return deferred;
  }
  loadResources(language) {
    let callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
    let usedCallback = callback;
    const usedLng = isString(language) ? language : this.language;
    if (typeof language === 'function') usedCallback = language;
    if (!this.options.resources || this.options.partialBundledLanguages) {
      if (usedLng?.toLowerCase() === 'cimode' && (!this.options.preload || this.options.preload.length === 0)) return usedCallback();
      const toLoad = [];
      const append = lng => {
        if (!lng) return;
        if (lng === 'cimode') return;
        const lngs = this.services.languageUtils.toResolveHierarchy(lng);
        lngs.forEach(l => {
          if (l === 'cimode') return;
          if (toLoad.indexOf(l) < 0) toLoad.push(l);
        });
      };
      if (!usedLng) {
        const fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
        fallbacks.forEach(l => append(l));
      } else {
        append(usedLng);
      }
      this.options.preload?.forEach?.(l => append(l));
      this.services.backendConnector.load(toLoad, this.options.ns, e => {
        if (!e && !this.resolvedLanguage && this.language) this.setResolvedLanguage(this.language);
        usedCallback(e);
      });
    } else {
      usedCallback(null);
    }
  }
  reloadResources(lngs, ns, callback) {
    const deferred = defer();
    if (typeof lngs === 'function') {
      callback = lngs;
      lngs = undefined;
    }
    if (typeof ns === 'function') {
      callback = ns;
      ns = undefined;
    }
    if (!lngs) lngs = this.languages;
    if (!ns) ns = this.options.ns;
    if (!callback) callback = noop;
    this.services.backendConnector.reload(lngs, ns, err => {
      deferred.resolve();
      callback(err);
    });
    return deferred;
  }
  use(module) {
    if (!module) throw new Error('You are passing an undefined module! Please check the object you are passing to i18next.use()');
    if (!module.type) throw new Error('You are passing a wrong module! Please check the object you are passing to i18next.use()');
    if (module.type === 'backend') {
      this.modules.backend = module;
    }
    if (module.type === 'logger' || module.log && module.warn && module.error) {
      this.modules.logger = module;
    }
    if (module.type === 'languageDetector') {
      this.modules.languageDetector = module;
    }
    if (module.type === 'i18nFormat') {
      this.modules.i18nFormat = module;
    }
    if (module.type === 'postProcessor') {
      postProcessor.addPostProcessor(module);
    }
    if (module.type === 'formatter') {
      this.modules.formatter = module;
    }
    if (module.type === '3rdParty') {
      this.modules.external.push(module);
    }
    return this;
  }
  setResolvedLanguage(l) {
    if (!l || !this.languages) return;
    if (['cimode', 'dev'].indexOf(l) > -1) return;
    for (let li = 0; li < this.languages.length; li++) {
      const lngInLngs = this.languages[li];
      if (['cimode', 'dev'].indexOf(lngInLngs) > -1) continue;
      if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
        this.resolvedLanguage = lngInLngs;
        break;
      }
    }
  }
  changeLanguage(lng, callback) {
    var _this2 = this;
    this.isLanguageChangingTo = lng;
    const deferred = defer();
    this.emit('languageChanging', lng);
    const setLngProps = l => {
      this.language = l;
      this.languages = this.services.languageUtils.toResolveHierarchy(l);
      this.resolvedLanguage = undefined;
      this.setResolvedLanguage(l);
    };
    const done = (err, l) => {
      if (l) {
        if (this.isLanguageChangingTo === lng) {
          setLngProps(l);
          this.translator.changeLanguage(l);
          this.isLanguageChangingTo = undefined;
          this.emit('languageChanged', l);
          this.logger.log('languageChanged', l);
        }
      } else {
        this.isLanguageChangingTo = undefined;
      }
      deferred.resolve(function () {
        return _this2.t(...arguments);
      });
      if (callback) callback(err, function () {
        return _this2.t(...arguments);
      });
    };
    const setLng = lngs => {
      if (!lng && !lngs && this.services.languageDetector) lngs = [];
      const l = this.services.languageUtils.getBestMatchFromCodes(isString(lngs) ? [lngs] : lngs);
      if (l) {
        if (!this.language) {
          setLngProps(l);
        }
        if (!this.translator.language) this.translator.changeLanguage(l);
        this.services.languageDetector?.cacheUserLanguage?.(l);
      }
      this.loadResources(l, err => {
        done(err, l);
      });
    };
    if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
      setLng(this.services.languageDetector.detect());
    } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
      if (this.services.languageDetector.detect.length === 0) {
        this.services.languageDetector.detect().then(setLng);
      } else {
        this.services.languageDetector.detect(setLng);
      }
    } else {
      setLng(lng);
    }
    return deferred;
  }
  getFixedT(lng, ns, keyPrefix) {
    var _this3 = this;
    const fixedT = function (key, opts) {
      let o;
      if (typeof opts !== 'object') {
        for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
          rest[_key3 - 2] = arguments[_key3];
        }
        o = _this3.options.overloadTranslationOptionHandler([key, opts].concat(rest));
      } else {
        o = {
          ...opts
        };
      }
      o.lng = o.lng || fixedT.lng;
      o.lngs = o.lngs || fixedT.lngs;
      o.ns = o.ns || fixedT.ns;
      if (o.keyPrefix !== '') o.keyPrefix = o.keyPrefix || keyPrefix || fixedT.keyPrefix;
      const keySeparator = _this3.options.keySeparator || '.';
      let resultKey;
      if (o.keyPrefix && Array.isArray(key)) {
        resultKey = key.map(k => `${o.keyPrefix}${keySeparator}${k}`);
      } else {
        resultKey = o.keyPrefix ? `${o.keyPrefix}${keySeparator}${key}` : key;
      }
      return _this3.t(resultKey, o);
    };
    if (isString(lng)) {
      fixedT.lng = lng;
    } else {
      fixedT.lngs = lng;
    }
    fixedT.ns = ns;
    fixedT.keyPrefix = keyPrefix;
    return fixedT;
  }
  t() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return this.translator?.translate(...args);
  }
  exists() {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }
    return this.translator?.exists(...args);
  }
  setDefaultNamespace(ns) {
    this.options.defaultNS = ns;
  }
  hasLoadedNamespace(ns) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!this.isInitialized) {
      this.logger.warn('hasLoadedNamespace: i18next was not initialized', this.languages);
      return false;
    }
    if (!this.languages || !this.languages.length) {
      this.logger.warn('hasLoadedNamespace: i18n.languages were undefined or empty', this.languages);
      return false;
    }
    const lng = options.lng || this.resolvedLanguage || this.languages[0];
    const fallbackLng = this.options ? this.options.fallbackLng : false;
    const lastLng = this.languages[this.languages.length - 1];
    if (lng.toLowerCase() === 'cimode') return true;
    const loadNotPending = (l, n) => {
      const loadState = this.services.backendConnector.state[`${l}|${n}`];
      return loadState === -1 || loadState === 0 || loadState === 2;
    };
    if (options.precheck) {
      const preResult = options.precheck(this, loadNotPending);
      if (preResult !== undefined) return preResult;
    }
    if (this.hasResourceBundle(lng, ns)) return true;
    if (!this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages) return true;
    if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
    return false;
  }
  loadNamespaces(ns, callback) {
    const deferred = defer();
    if (!this.options.ns) {
      if (callback) callback();
      return Promise.resolve();
    }
    if (isString(ns)) ns = [ns];
    ns.forEach(n => {
      if (this.options.ns.indexOf(n) < 0) this.options.ns.push(n);
    });
    this.loadResources(err => {
      deferred.resolve();
      if (callback) callback(err);
    });
    return deferred;
  }
  loadLanguages(lngs, callback) {
    const deferred = defer();
    if (isString(lngs)) lngs = [lngs];
    const preloaded = this.options.preload || [];
    const newLngs = lngs.filter(lng => preloaded.indexOf(lng) < 0 && this.services.languageUtils.isSupportedCode(lng));
    if (!newLngs.length) {
      if (callback) callback();
      return Promise.resolve();
    }
    this.options.preload = preloaded.concat(newLngs);
    this.loadResources(err => {
      deferred.resolve();
      if (callback) callback(err);
    });
    return deferred;
  }
  dir(lng) {
    if (!lng) lng = this.resolvedLanguage || (this.languages?.length > 0 ? this.languages[0] : this.language);
    if (!lng) return 'rtl';
    const rtlLngs = ['ar', 'shu', 'sqr', 'ssh', 'xaa', 'yhd', 'yud', 'aao', 'abh', 'abv', 'acm', 'acq', 'acw', 'acx', 'acy', 'adf', 'ads', 'aeb', 'aec', 'afb', 'ajp', 'apc', 'apd', 'arb', 'arq', 'ars', 'ary', 'arz', 'auz', 'avl', 'ayh', 'ayl', 'ayn', 'ayp', 'bbz', 'pga', 'he', 'iw', 'ps', 'pbt', 'pbu', 'pst', 'prp', 'prd', 'ug', 'ur', 'ydd', 'yds', 'yih', 'ji', 'yi', 'hbo', 'men', 'xmn', 'fa', 'jpr', 'peo', 'pes', 'prs', 'dv', 'sam', 'ckb'];
    const languageUtils = this.services?.languageUtils || new LanguageUtil(get());
    return rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) > -1 || lng.toLowerCase().indexOf('-arab') > 1 ? 'rtl' : 'ltr';
  }
  static createInstance() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let callback = arguments.length > 1 ? arguments[1] : undefined;
    return new I18n(options, callback);
  }
  cloneInstance() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
    const forkResourceStore = options.forkResourceStore;
    if (forkResourceStore) delete options.forkResourceStore;
    const mergedOptions = {
      ...this.options,
      ...options,
      ...{
        isClone: true
      }
    };
    const clone = new I18n(mergedOptions);
    if (options.debug !== undefined || options.prefix !== undefined) {
      clone.logger = clone.logger.clone(options);
    }
    const membersToCopy = ['store', 'services', 'language'];
    membersToCopy.forEach(m => {
      clone[m] = this[m];
    });
    clone.services = {
      ...this.services
    };
    clone.services.utils = {
      hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
    };
    if (forkResourceStore) {
      const clonedData = Object.keys(this.store.data).reduce((prev, l) => {
        prev[l] = {
          ...this.store.data[l]
        };
        return Object.keys(prev[l]).reduce((acc, n) => {
          acc[n] = {
            ...prev[l][n]
          };
          return acc;
        }, {});
      }, {});
      clone.store = new ResourceStore(clonedData, mergedOptions);
      clone.services.resourceStore = clone.store;
    }
    clone.translator = new Translator(clone.services, mergedOptions);
    clone.translator.on('*', function (event) {
      for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        args[_key6 - 1] = arguments[_key6];
      }
      clone.emit(event, ...args);
    });
    clone.init(mergedOptions, callback);
    clone.translator.options = mergedOptions;
    clone.translator.backendConnector.services.utils = {
      hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
    };
    return clone;
  }
  toJSON() {
    return {
      options: this.options,
      store: this.store,
      language: this.language,
      languages: this.languages,
      resolvedLanguage: this.resolvedLanguage
    };
  }
}
const instance = I18n.createInstance();
instance.createInstance = I18n.createInstance;

module.exports = instance;


/***/ },

/***/ "./node_modules/object-assign/index.js"
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
(module) {

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


/***/ },

/***/ "./node_modules/prop-types/checkPropTypes.js"
/*!***************************************************!*\
  !*** ./node_modules/prop-types/checkPropTypes.js ***!
  \***************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

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


/***/ },

/***/ "./node_modules/prop-types/factoryWithTypeCheckers.js"
/*!************************************************************!*\
  !*** ./node_modules/prop-types/factoryWithTypeCheckers.js ***!
  \************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

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


/***/ },

/***/ "./node_modules/prop-types/index.js"
/*!******************************************!*\
  !*** ./node_modules/prop-types/index.js ***!
  \******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

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
} else // removed by dead control flow
{}


/***/ },

/***/ "./node_modules/prop-types/lib/ReactPropTypesSecret.js"
/*!*************************************************************!*\
  !*** ./node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \*************************************************************/
(module) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ },

/***/ "./node_modules/prop-types/lib/has.js"
/*!********************************************!*\
  !*** ./node_modules/prop-types/lib/has.js ***!
  \********************************************/
(module) {

module.exports = Function.call.bind(Object.prototype.hasOwnProperty);


/***/ },

/***/ "./node_modules/react-dom/client.js"
/*!******************************************!*\
  !*** ./node_modules/react-dom/client.js ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) // removed by dead control flow
{} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ },

/***/ "./node_modules/react-is/cjs/react-is.development.js"
/*!***********************************************************!*\
  !*** ./node_modules/react-is/cjs/react-is.development.js ***!
  \***********************************************************/
(__unused_webpack_module, exports) {

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


/***/ },

/***/ "./node_modules/react-is/index.js"
/*!****************************************!*\
  !*** ./node_modules/react-is/index.js ***!
  \****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


if (false) // removed by dead control flow
{} else {
  module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ "./node_modules/react-is/cjs/react-is.development.js");
}


/***/ },

/***/ "./node_modules/void-elements/index.js"
/*!*********************************************!*\
  !*** ./node_modules/void-elements/index.js ***!
  \*********************************************/
(module) {

/**
 * This file automatically generated from `pre-publish.js`.
 * Do not manually edit.
 */

module.exports = {
  "area": true,
  "base": true,
  "br": true,
  "col": true,
  "embed": true,
  "hr": true,
  "img": true,
  "input": true,
  "link": true,
  "meta": true,
  "param": true,
  "source": true,
  "track": true,
  "wbr": true
};


/***/ },

/***/ "react"
/*!************************!*\
  !*** external "React" ***!
  \************************/
(module) {

"use strict";
module.exports = window["React"];

/***/ },

/***/ "react-dom"
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
(module) {

"use strict";
module.exports = window["ReactDOM"];

/***/ },

/***/ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js"
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/assertThisInitialized.js ***!
  \**********************************************************************/
(module) {

function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ },

/***/ "./node_modules/@babel/runtime/helpers/classCallCheck.js"
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/classCallCheck.js ***!
  \***************************************************************/
(module) {

function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ },

/***/ "./node_modules/@babel/runtime/helpers/createClass.js"
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/createClass.js ***!
  \************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var toPropertyKey = __webpack_require__(/*! ./toPropertyKey.js */ "./node_modules/@babel/runtime/helpers/toPropertyKey.js");
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ },

/***/ "./node_modules/@babel/runtime/helpers/defineProperty.js"
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var toPropertyKey = __webpack_require__(/*! ./toPropertyKey.js */ "./node_modules/@babel/runtime/helpers/toPropertyKey.js");
function _defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ },

/***/ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/getPrototypeOf.js ***!
  \***************************************************************/
(module) {

function _getPrototypeOf(t) {
  return module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _getPrototypeOf(t);
}
module.exports = _getPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ },

/***/ "./node_modules/@babel/runtime/helpers/inherits.js"
/*!*********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/inherits.js ***!
  \*********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/setPrototypeOf.js");
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: !0,
      configurable: !0
    }
  }), Object.defineProperty(t, "prototype", {
    writable: !1
  }), e && setPrototypeOf(t, e);
}
module.exports = _inherits, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ },

/***/ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js"
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \**********************************************************************/
(module) {

function _interopRequireDefault(e) {
  return e && e.__esModule ? e : {
    "default": e
  };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ },

/***/ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js ***!
  \**************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var _typeof = (__webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/typeof.js")["default"]);
var assertThisInitialized = __webpack_require__(/*! ./assertThisInitialized.js */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js");
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == _typeof(e) || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return assertThisInitialized(t);
}
module.exports = _possibleConstructorReturn, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ },

/***/ "./node_modules/@babel/runtime/helpers/setPrototypeOf.js"
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/setPrototypeOf.js ***!
  \***************************************************************/
(module) {

function _setPrototypeOf(t, e) {
  return module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _setPrototypeOf(t, e);
}
module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ },

/***/ "./node_modules/@babel/runtime/helpers/toPrimitive.js"
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toPrimitive.js ***!
  \************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var _typeof = (__webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/typeof.js")["default"]);
function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
module.exports = toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ },

/***/ "./node_modules/@babel/runtime/helpers/toPropertyKey.js"
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toPropertyKey.js ***!
  \**************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var _typeof = (__webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/typeof.js")["default"]);
var toPrimitive = __webpack_require__(/*! ./toPrimitive.js */ "./node_modules/@babel/runtime/helpers/toPrimitive.js");
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
module.exports = toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ },

/***/ "./node_modules/@babel/runtime/helpers/typeof.js"
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
(module) {

function _typeof(o) {
  "@babel/helpers - typeof";

  return module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ },

/***/ "./node_modules/react-i18next/dist/es/I18nextProvider.js"
/*!***************************************************************!*\
  !*** ./node_modules/react-i18next/dist/es/I18nextProvider.js ***!
  \***************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   I18nextProvider: () => (/* binding */ I18nextProvider)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _context_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./context.js */ "./node_modules/react-i18next/dist/es/context.js");


function I18nextProvider({
  i18n,
  defaultNS,
  children
}) {
  const value = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    i18n,
    defaultNS
  }), [i18n, defaultNS]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_context_js__WEBPACK_IMPORTED_MODULE_1__.I18nContext.Provider, {
    value
  }, children);
}

/***/ },

/***/ "./node_modules/react-i18next/dist/es/Trans.js"
/*!*****************************************************!*\
  !*** ./node_modules/react-i18next/dist/es/Trans.js ***!
  \*****************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Trans: () => (/* binding */ Trans),
/* harmony export */   nodesToString: () => (/* reexport safe */ _TransWithoutContext_js__WEBPACK_IMPORTED_MODULE_1__.nodesToString)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _TransWithoutContext_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TransWithoutContext.js */ "./node_modules/react-i18next/dist/es/TransWithoutContext.js");
/* harmony import */ var _context_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./context.js */ "./node_modules/react-i18next/dist/es/context.js");




function Trans({
  children,
  count,
  parent,
  i18nKey,
  context,
  tOptions = {},
  values,
  defaults,
  components,
  ns,
  i18n: i18nFromProps,
  t: tFromProps,
  shouldUnescape,
  ...additionalProps
}) {
  const {
    i18n: i18nFromContext,
    defaultNS: defaultNSFromContext
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_context_js__WEBPACK_IMPORTED_MODULE_2__.I18nContext) || {};
  const i18n = i18nFromProps || i18nFromContext || (0,_context_js__WEBPACK_IMPORTED_MODULE_2__.getI18n)();
  const t = tFromProps || i18n?.t.bind(i18n);
  return (0,_TransWithoutContext_js__WEBPACK_IMPORTED_MODULE_1__.Trans)({
    children,
    count,
    parent,
    i18nKey,
    context,
    tOptions,
    values,
    defaults,
    components,
    ns: ns || t?.ns || defaultNSFromContext || i18n?.options?.defaultNS,
    i18n,
    t: tFromProps,
    shouldUnescape,
    ...additionalProps
  });
}

/***/ },

/***/ "./node_modules/react-i18next/dist/es/TransWithoutContext.js"
/*!*******************************************************************!*\
  !*** ./node_modules/react-i18next/dist/es/TransWithoutContext.js ***!
  \*******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Trans: () => (/* binding */ Trans),
/* harmony export */   nodesToString: () => (/* binding */ nodesToString)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var html_parse_stringify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! html-parse-stringify */ "./node_modules/html-parse-stringify/dist/html-parse-stringify.module.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./node_modules/react-i18next/dist/es/utils.js");
/* harmony import */ var _defaults_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./defaults.js */ "./node_modules/react-i18next/dist/es/defaults.js");
/* harmony import */ var _i18nInstance_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./i18nInstance.js */ "./node_modules/react-i18next/dist/es/i18nInstance.js");





const hasChildren = (node, checkLength) => {
  if (!node) return false;
  const base = node.props?.children ?? node.children;
  if (checkLength) return base.length > 0;
  return !!base;
};
const getChildren = node => {
  if (!node) return [];
  const children = node.props?.children ?? node.children;
  return node.props?.i18nIsDynamicList ? getAsArray(children) : children;
};
const hasValidReactChildren = children => Array.isArray(children) && children.every(react__WEBPACK_IMPORTED_MODULE_0__.isValidElement);
const getAsArray = data => Array.isArray(data) ? data : [data];
const mergeProps = (source, target) => {
  const newTarget = {
    ...target
  };
  newTarget.props = Object.assign(source.props, target.props);
  return newTarget;
};
const nodesToString = (children, i18nOptions, i18n, i18nKey) => {
  if (!children) return '';
  let stringNode = '';
  const childrenArray = getAsArray(children);
  const keepArray = i18nOptions?.transSupportBasicHtmlNodes ? i18nOptions.transKeepBasicHtmlNodesFor ?? [] : [];
  childrenArray.forEach((child, childIndex) => {
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isString)(child)) {
      stringNode += `${child}`;
      return;
    }
    if ((0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(child)) {
      const {
        props,
        type
      } = child;
      const childPropsCount = Object.keys(props).length;
      const shouldKeepChild = keepArray.indexOf(type) > -1;
      const childChildren = props.children;
      if (!childChildren && shouldKeepChild && !childPropsCount) {
        stringNode += `<${type}/>`;
        return;
      }
      if (!childChildren && (!shouldKeepChild || childPropsCount) || props.i18nIsDynamicList) {
        stringNode += `<${childIndex}></${childIndex}>`;
        return;
      }
      if (shouldKeepChild && childPropsCount === 1 && (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isString)(childChildren)) {
        stringNode += `<${type}>${childChildren}</${type}>`;
        return;
      }
      const content = nodesToString(childChildren, i18nOptions, i18n, i18nKey);
      stringNode += `<${childIndex}>${content}</${childIndex}>`;
      return;
    }
    if (child === null) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.warn)(i18n, 'TRANS_NULL_VALUE', `Passed in a null value as child`, {
        i18nKey
      });
      return;
    }
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isObject)(child)) {
      const {
        format,
        ...clone
      } = child;
      const keys = Object.keys(clone);
      if (keys.length === 1) {
        const value = format ? `${keys[0]}, ${format}` : keys[0];
        stringNode += `{{${value}}}`;
        return;
      }
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.warn)(i18n, 'TRANS_INVALID_OBJ', `Invalid child - Object should only have keys {{ value, format }} (format is optional).`, {
        i18nKey,
        child
      });
      return;
    }
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.warn)(i18n, 'TRANS_INVALID_VAR', `Passed in a variable like {number} - pass variables for interpolation as full objects like {{number}}.`, {
      i18nKey,
      child
    });
  });
  return stringNode;
};
const renderNodes = (children, targetString, i18n, i18nOptions, combinedTOpts, shouldUnescape) => {
  if (targetString === '') return [];
  const keepArray = i18nOptions.transKeepBasicHtmlNodesFor || [];
  const emptyChildrenButNeedsHandling = targetString && new RegExp(keepArray.map(keep => `<${keep}`).join('|')).test(targetString);
  if (!children && !emptyChildrenButNeedsHandling && !shouldUnescape) return [targetString];
  const data = {};
  const getData = childs => {
    const childrenArray = getAsArray(childs);
    childrenArray.forEach(child => {
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isString)(child)) return;
      if (hasChildren(child)) getData(getChildren(child));else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isObject)(child) && !(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(child)) Object.assign(data, child);
    });
  };
  getData(children);
  const ast = html_parse_stringify__WEBPACK_IMPORTED_MODULE_1__["default"].parse(`<0>${targetString}</0>`);
  const opts = {
    ...data,
    ...combinedTOpts
  };
  const renderInner = (child, node, rootReactNode) => {
    const childs = getChildren(child);
    const mappedChildren = mapAST(childs, node.children, rootReactNode);
    return hasValidReactChildren(childs) && mappedChildren.length === 0 || child.props?.i18nIsDynamicList ? childs : mappedChildren;
  };
  const pushTranslatedJSX = (child, inner, mem, i, isVoid) => {
    if (child.dummy) {
      child.children = inner;
      mem.push((0,react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(child, {
        key: i
      }, isVoid ? undefined : inner));
    } else {
      mem.push(...react__WEBPACK_IMPORTED_MODULE_0__.Children.map([child], c => {
        const props = {
          ...c.props
        };
        delete props.i18nIsDynamicList;
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(c.type, {
          ...props,
          key: i,
          ref: c.ref
        }, isVoid ? null : inner);
      }));
    }
  };
  const mapAST = (reactNode, astNode, rootReactNode) => {
    const reactNodes = getAsArray(reactNode);
    const astNodes = getAsArray(astNode);
    return astNodes.reduce((mem, node, i) => {
      const translationContent = node.children?.[0]?.content && i18n.services.interpolator.interpolate(node.children[0].content, opts, i18n.language);
      if (node.type === 'tag') {
        let tmp = reactNodes[parseInt(node.name, 10)];
        if (rootReactNode.length === 1 && !tmp) tmp = rootReactNode[0][node.name];
        if (!tmp) tmp = {};
        const child = Object.keys(node.attrs).length !== 0 ? mergeProps({
          props: node.attrs
        }, tmp) : tmp;
        const isElement = (0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(child);
        const isValidTranslationWithChildren = isElement && hasChildren(node, true) && !node.voidElement;
        const isEmptyTransWithHTML = emptyChildrenButNeedsHandling && (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isObject)(child) && child.dummy && !isElement;
        const isKnownComponent = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isObject)(children) && Object.hasOwnProperty.call(children, node.name);
        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isString)(child)) {
          const value = i18n.services.interpolator.interpolate(child, opts, i18n.language);
          mem.push(value);
        } else if (hasChildren(child) || isValidTranslationWithChildren) {
          const inner = renderInner(child, node, rootReactNode);
          pushTranslatedJSX(child, inner, mem, i);
        } else if (isEmptyTransWithHTML) {
          const inner = mapAST(reactNodes, node.children, rootReactNode);
          pushTranslatedJSX(child, inner, mem, i);
        } else if (Number.isNaN(parseFloat(node.name))) {
          if (isKnownComponent) {
            const inner = renderInner(child, node, rootReactNode);
            pushTranslatedJSX(child, inner, mem, i, node.voidElement);
          } else if (i18nOptions.transSupportBasicHtmlNodes && keepArray.indexOf(node.name) > -1) {
            if (node.voidElement) {
              mem.push((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(node.name, {
                key: `${node.name}-${i}`
              }));
            } else {
              const inner = mapAST(reactNodes, node.children, rootReactNode);
              mem.push((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(node.name, {
                key: `${node.name}-${i}`
              }, inner));
            }
          } else if (node.voidElement) {
            mem.push(`<${node.name} />`);
          } else {
            const inner = mapAST(reactNodes, node.children, rootReactNode);
            mem.push(`<${node.name}>${inner}</${node.name}>`);
          }
        } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isObject)(child) && !isElement) {
          const content = node.children[0] ? translationContent : null;
          if (content) mem.push(content);
        } else {
          pushTranslatedJSX(child, translationContent, mem, i, node.children.length !== 1 || !translationContent);
        }
      } else if (node.type === 'text') {
        const wrapTextNodes = i18nOptions.transWrapTextNodes;
        const content = shouldUnescape ? i18nOptions.unescape(i18n.services.interpolator.interpolate(node.content, opts, i18n.language)) : i18n.services.interpolator.interpolate(node.content, opts, i18n.language);
        if (wrapTextNodes) {
          mem.push((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(wrapTextNodes, {
            key: `${node.name}-${i}`
          }, content));
        } else {
          mem.push(content);
        }
      }
      return mem;
    }, []);
  };
  const result = mapAST([{
    dummy: true,
    children: children || []
  }], ast, getAsArray(children || []));
  return getChildren(result[0]);
};
const fixComponentProps = (component, index, translation) => {
  const componentKey = component.key || index;
  const comp = (0,react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(component, {
    key: componentKey
  });
  if (!comp.props || !comp.props.children || translation.indexOf(`${index}/>`) < 0 && translation.indexOf(`${index} />`) < 0) {
    return comp;
  }
  function Componentized() {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, comp);
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Componentized, {
    key: componentKey
  });
};
const generateArrayComponents = (components, translation) => components.map((c, index) => fixComponentProps(c, index, translation));
const generateObjectComponents = (components, translation) => {
  const componentMap = {};
  Object.keys(components).forEach(c => {
    Object.assign(componentMap, {
      [c]: fixComponentProps(components[c], c, translation)
    });
  });
  return componentMap;
};
const generateComponents = (components, translation, i18n, i18nKey) => {
  if (!components) return null;
  if (Array.isArray(components)) {
    return generateArrayComponents(components, translation);
  }
  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isObject)(components)) {
    return generateObjectComponents(components, translation);
  }
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.warnOnce)(i18n, 'TRANS_INVALID_COMPONENTS', `<Trans /> "components" prop expects an object or array`, {
    i18nKey
  });
  return null;
};
function Trans({
  children,
  count,
  parent,
  i18nKey,
  context,
  tOptions = {},
  values,
  defaults,
  components,
  ns,
  i18n: i18nFromProps,
  t: tFromProps,
  shouldUnescape,
  ...additionalProps
}) {
  const i18n = i18nFromProps || (0,_i18nInstance_js__WEBPACK_IMPORTED_MODULE_4__.getI18n)();
  if (!i18n) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.warnOnce)(i18n, 'NO_I18NEXT_INSTANCE', `Trans: You need to pass in an i18next instance using i18nextReactModule`, {
      i18nKey
    });
    return children;
  }
  const t = tFromProps || i18n.t.bind(i18n) || (k => k);
  const reactI18nextOptions = {
    ...(0,_defaults_js__WEBPACK_IMPORTED_MODULE_3__.getDefaults)(),
    ...i18n.options?.react
  };
  let namespaces = ns || t.ns || i18n.options?.defaultNS;
  namespaces = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isString)(namespaces) ? [namespaces] : namespaces || ['translation'];
  const nodeAsString = nodesToString(children, reactI18nextOptions, i18n, i18nKey);
  const defaultValue = defaults || nodeAsString || reactI18nextOptions.transEmptyNodeValue || i18nKey;
  const {
    hashTransKey
  } = reactI18nextOptions;
  const key = i18nKey || (hashTransKey ? hashTransKey(nodeAsString || defaultValue) : nodeAsString || defaultValue);
  if (i18n.options?.interpolation?.defaultVariables) {
    values = values && Object.keys(values).length > 0 ? {
      ...values,
      ...i18n.options.interpolation.defaultVariables
    } : {
      ...i18n.options.interpolation.defaultVariables
    };
  }
  const interpolationOverride = values || count !== undefined && !i18n.options?.interpolation?.alwaysFormat || !children ? tOptions.interpolation : {
    interpolation: {
      ...tOptions.interpolation,
      prefix: '#$?',
      suffix: '?$#'
    }
  };
  const combinedTOpts = {
    ...tOptions,
    context: context || tOptions.context,
    count,
    ...values,
    ...interpolationOverride,
    defaultValue,
    ns: namespaces
  };
  const translation = key ? t(key, combinedTOpts) : defaultValue;
  const generatedComponents = generateComponents(components, translation, i18n, i18nKey);
  const content = renderNodes(generatedComponents || children, translation, i18n, reactI18nextOptions, combinedTOpts, shouldUnescape);
  const useAsParent = parent ?? reactI18nextOptions.defaultTransParent;
  return useAsParent ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(useAsParent, additionalProps, content) : content;
}

/***/ },

/***/ "./node_modules/react-i18next/dist/es/Translation.js"
/*!***********************************************************!*\
  !*** ./node_modules/react-i18next/dist/es/Translation.js ***!
  \***********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Translation: () => (/* binding */ Translation)
/* harmony export */ });
/* harmony import */ var _useTranslation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./useTranslation.js */ "./node_modules/react-i18next/dist/es/useTranslation.js");

const Translation = ({
  ns,
  children,
  ...options
}) => {
  const [t, i18n, ready] = (0,_useTranslation_js__WEBPACK_IMPORTED_MODULE_0__.useTranslation)(ns, options);
  return children(t, {
    i18n,
    lng: i18n.language
  }, ready);
};

/***/ },

/***/ "./node_modules/react-i18next/dist/es/context.js"
/*!*******************************************************!*\
  !*** ./node_modules/react-i18next/dist/es/context.js ***!
  \*******************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   I18nContext: () => (/* binding */ I18nContext),
/* harmony export */   ReportNamespaces: () => (/* binding */ ReportNamespaces),
/* harmony export */   composeInitialProps: () => (/* binding */ composeInitialProps),
/* harmony export */   getDefaults: () => (/* reexport safe */ _defaults_js__WEBPACK_IMPORTED_MODULE_1__.getDefaults),
/* harmony export */   getI18n: () => (/* reexport safe */ _i18nInstance_js__WEBPACK_IMPORTED_MODULE_2__.getI18n),
/* harmony export */   getInitialProps: () => (/* binding */ getInitialProps),
/* harmony export */   initReactI18next: () => (/* reexport safe */ _initReactI18next_js__WEBPACK_IMPORTED_MODULE_3__.initReactI18next),
/* harmony export */   setDefaults: () => (/* reexport safe */ _defaults_js__WEBPACK_IMPORTED_MODULE_1__.setDefaults),
/* harmony export */   setI18n: () => (/* reexport safe */ _i18nInstance_js__WEBPACK_IMPORTED_MODULE_2__.setI18n)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _defaults_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./defaults.js */ "./node_modules/react-i18next/dist/es/defaults.js");
/* harmony import */ var _i18nInstance_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./i18nInstance.js */ "./node_modules/react-i18next/dist/es/i18nInstance.js");
/* harmony import */ var _initReactI18next_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./initReactI18next.js */ "./node_modules/react-i18next/dist/es/initReactI18next.js");





const I18nContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)();
class ReportNamespaces {
  constructor() {
    this.usedNamespaces = {};
  }
  addUsedNamespaces(namespaces) {
    namespaces.forEach(ns => {
      if (!this.usedNamespaces[ns]) this.usedNamespaces[ns] = true;
    });
  }
  getUsedNamespaces() {
    return Object.keys(this.usedNamespaces);
  }
}
const composeInitialProps = ForComponent => async ctx => {
  const componentsInitialProps = (await ForComponent.getInitialProps?.(ctx)) ?? {};
  const i18nInitialProps = getInitialProps();
  return {
    ...componentsInitialProps,
    ...i18nInitialProps
  };
};
const getInitialProps = () => {
  const i18n = (0,_i18nInstance_js__WEBPACK_IMPORTED_MODULE_2__.getI18n)();
  const namespaces = i18n.reportNamespaces?.getUsedNamespaces() ?? [];
  const ret = {};
  const initialI18nStore = {};
  i18n.languages.forEach(l => {
    initialI18nStore[l] = {};
    namespaces.forEach(ns => {
      initialI18nStore[l][ns] = i18n.getResourceBundle(l, ns) || {};
    });
  });
  ret.initialI18nStore = initialI18nStore;
  ret.initialLanguage = i18n.language;
  return ret;
};

/***/ },

/***/ "./node_modules/react-i18next/dist/es/defaults.js"
/*!********************************************************!*\
  !*** ./node_modules/react-i18next/dist/es/defaults.js ***!
  \********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDefaults: () => (/* binding */ getDefaults),
/* harmony export */   setDefaults: () => (/* binding */ setDefaults)
/* harmony export */ });
/* harmony import */ var _unescape_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./unescape.js */ "./node_modules/react-i18next/dist/es/unescape.js");

let defaultOptions = {
  bindI18n: 'languageChanged',
  bindI18nStore: '',
  transEmptyNodeValue: '',
  transSupportBasicHtmlNodes: true,
  transWrapTextNodes: '',
  transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
  useSuspense: true,
  unescape: _unescape_js__WEBPACK_IMPORTED_MODULE_0__.unescape
};
const setDefaults = (options = {}) => {
  defaultOptions = {
    ...defaultOptions,
    ...options
  };
};
const getDefaults = () => defaultOptions;

/***/ },

/***/ "./node_modules/react-i18next/dist/es/i18nInstance.js"
/*!************************************************************!*\
  !*** ./node_modules/react-i18next/dist/es/i18nInstance.js ***!
  \************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getI18n: () => (/* binding */ getI18n),
/* harmony export */   setI18n: () => (/* binding */ setI18n)
/* harmony export */ });
let i18nInstance;
const setI18n = instance => {
  i18nInstance = instance;
};
const getI18n = () => i18nInstance;

/***/ },

/***/ "./node_modules/react-i18next/dist/es/index.js"
/*!*****************************************************!*\
  !*** ./node_modules/react-i18next/dist/es/index.js ***!
  \*****************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   I18nContext: () => (/* reexport safe */ _context_js__WEBPACK_IMPORTED_MODULE_11__.I18nContext),
/* harmony export */   I18nextProvider: () => (/* reexport safe */ _I18nextProvider_js__WEBPACK_IMPORTED_MODULE_5__.I18nextProvider),
/* harmony export */   Trans: () => (/* reexport safe */ _Trans_js__WEBPACK_IMPORTED_MODULE_0__.Trans),
/* harmony export */   TransWithoutContext: () => (/* reexport safe */ _TransWithoutContext_js__WEBPACK_IMPORTED_MODULE_1__.Trans),
/* harmony export */   Translation: () => (/* reexport safe */ _Translation_js__WEBPACK_IMPORTED_MODULE_4__.Translation),
/* harmony export */   composeInitialProps: () => (/* reexport safe */ _context_js__WEBPACK_IMPORTED_MODULE_11__.composeInitialProps),
/* harmony export */   date: () => (/* binding */ date),
/* harmony export */   getDefaults: () => (/* reexport safe */ _defaults_js__WEBPACK_IMPORTED_MODULE_9__.getDefaults),
/* harmony export */   getI18n: () => (/* reexport safe */ _i18nInstance_js__WEBPACK_IMPORTED_MODULE_10__.getI18n),
/* harmony export */   getInitialProps: () => (/* reexport safe */ _context_js__WEBPACK_IMPORTED_MODULE_11__.getInitialProps),
/* harmony export */   initReactI18next: () => (/* reexport safe */ _initReactI18next_js__WEBPACK_IMPORTED_MODULE_8__.initReactI18next),
/* harmony export */   number: () => (/* binding */ number),
/* harmony export */   plural: () => (/* binding */ plural),
/* harmony export */   select: () => (/* binding */ select),
/* harmony export */   selectOrdinal: () => (/* binding */ selectOrdinal),
/* harmony export */   setDefaults: () => (/* reexport safe */ _defaults_js__WEBPACK_IMPORTED_MODULE_9__.setDefaults),
/* harmony export */   setI18n: () => (/* reexport safe */ _i18nInstance_js__WEBPACK_IMPORTED_MODULE_10__.setI18n),
/* harmony export */   time: () => (/* binding */ time),
/* harmony export */   useSSR: () => (/* reexport safe */ _useSSR_js__WEBPACK_IMPORTED_MODULE_7__.useSSR),
/* harmony export */   useTranslation: () => (/* reexport safe */ _useTranslation_js__WEBPACK_IMPORTED_MODULE_2__.useTranslation),
/* harmony export */   withSSR: () => (/* reexport safe */ _withSSR_js__WEBPACK_IMPORTED_MODULE_6__.withSSR),
/* harmony export */   withTranslation: () => (/* reexport safe */ _withTranslation_js__WEBPACK_IMPORTED_MODULE_3__.withTranslation)
/* harmony export */ });
/* harmony import */ var _Trans_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Trans.js */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _TransWithoutContext_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TransWithoutContext.js */ "./node_modules/react-i18next/dist/es/TransWithoutContext.js");
/* harmony import */ var _useTranslation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./useTranslation.js */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _withTranslation_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./withTranslation.js */ "./node_modules/react-i18next/dist/es/withTranslation.js");
/* harmony import */ var _Translation_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Translation.js */ "./node_modules/react-i18next/dist/es/Translation.js");
/* harmony import */ var _I18nextProvider_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./I18nextProvider.js */ "./node_modules/react-i18next/dist/es/I18nextProvider.js");
/* harmony import */ var _withSSR_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./withSSR.js */ "./node_modules/react-i18next/dist/es/withSSR.js");
/* harmony import */ var _useSSR_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./useSSR.js */ "./node_modules/react-i18next/dist/es/useSSR.js");
/* harmony import */ var _initReactI18next_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./initReactI18next.js */ "./node_modules/react-i18next/dist/es/initReactI18next.js");
/* harmony import */ var _defaults_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./defaults.js */ "./node_modules/react-i18next/dist/es/defaults.js");
/* harmony import */ var _i18nInstance_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./i18nInstance.js */ "./node_modules/react-i18next/dist/es/i18nInstance.js");
/* harmony import */ var _context_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./context.js */ "./node_modules/react-i18next/dist/es/context.js");












const date = () => '';
const time = () => '';
const number = () => '';
const select = () => '';
const plural = () => '';
const selectOrdinal = () => '';

/***/ },

/***/ "./node_modules/react-i18next/dist/es/initReactI18next.js"
/*!****************************************************************!*\
  !*** ./node_modules/react-i18next/dist/es/initReactI18next.js ***!
  \****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initReactI18next: () => (/* binding */ initReactI18next)
/* harmony export */ });
/* harmony import */ var _defaults_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defaults.js */ "./node_modules/react-i18next/dist/es/defaults.js");
/* harmony import */ var _i18nInstance_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./i18nInstance.js */ "./node_modules/react-i18next/dist/es/i18nInstance.js");


const initReactI18next = {
  type: '3rdParty',
  init(instance) {
    (0,_defaults_js__WEBPACK_IMPORTED_MODULE_0__.setDefaults)(instance.options.react);
    (0,_i18nInstance_js__WEBPACK_IMPORTED_MODULE_1__.setI18n)(instance);
  }
};

/***/ },

/***/ "./node_modules/react-i18next/dist/es/unescape.js"
/*!********************************************************!*\
  !*** ./node_modules/react-i18next/dist/es/unescape.js ***!
  \********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   unescape: () => (/* binding */ unescape)
/* harmony export */ });
const matchHtmlEntity = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g;
const htmlEntities = {
  '&amp;': '&',
  '&#38;': '&',
  '&lt;': '<',
  '&#60;': '<',
  '&gt;': '>',
  '&#62;': '>',
  '&apos;': "'",
  '&#39;': "'",
  '&quot;': '"',
  '&#34;': '"',
  '&nbsp;': ' ',
  '&#160;': ' ',
  '&copy;': '©',
  '&#169;': '©',
  '&reg;': '®',
  '&#174;': '®',
  '&hellip;': '…',
  '&#8230;': '…',
  '&#x2F;': '/',
  '&#47;': '/'
};
const unescapeHtmlEntity = m => htmlEntities[m];
const unescape = text => text.replace(matchHtmlEntity, unescapeHtmlEntity);

/***/ },

/***/ "./node_modules/react-i18next/dist/es/useSSR.js"
/*!******************************************************!*\
  !*** ./node_modules/react-i18next/dist/es/useSSR.js ***!
  \******************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useSSR: () => (/* binding */ useSSR)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _context_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./context.js */ "./node_modules/react-i18next/dist/es/context.js");


const useSSR = (initialI18nStore, initialLanguage, props = {}) => {
  const {
    i18n: i18nFromProps
  } = props;
  const {
    i18n: i18nFromContext
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_context_js__WEBPACK_IMPORTED_MODULE_1__.I18nContext) || {};
  const i18n = i18nFromProps || i18nFromContext || (0,_context_js__WEBPACK_IMPORTED_MODULE_1__.getI18n)();
  if (i18n.options?.isClone) return;
  if (initialI18nStore && !i18n.initializedStoreOnce) {
    i18n.services.resourceStore.data = initialI18nStore;
    i18n.options.ns = Object.values(initialI18nStore).reduce((mem, lngResources) => {
      Object.keys(lngResources).forEach(ns => {
        if (mem.indexOf(ns) < 0) mem.push(ns);
      });
      return mem;
    }, i18n.options.ns);
    i18n.initializedStoreOnce = true;
    i18n.isInitialized = true;
  }
  if (initialLanguage && !i18n.initializedLanguageOnce) {
    i18n.changeLanguage(initialLanguage);
    i18n.initializedLanguageOnce = true;
  }
};

/***/ },

/***/ "./node_modules/react-i18next/dist/es/useTranslation.js"
/*!**************************************************************!*\
  !*** ./node_modules/react-i18next/dist/es/useTranslation.js ***!
  \**************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useTranslation: () => (/* binding */ useTranslation)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _context_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./context.js */ "./node_modules/react-i18next/dist/es/context.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./node_modules/react-i18next/dist/es/utils.js");



const usePrevious = (value, ignore) => {
  const ref = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    ref.current = ignore ? ref.current : value;
  }, [value, ignore]);
  return ref.current;
};
const alwaysNewT = (i18n, language, namespace, keyPrefix) => i18n.getFixedT(language, namespace, keyPrefix);
const useMemoizedT = (i18n, language, namespace, keyPrefix) => (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(alwaysNewT(i18n, language, namespace, keyPrefix), [i18n, language, namespace, keyPrefix]);
const useTranslation = (ns, props = {}) => {
  const {
    i18n: i18nFromProps
  } = props;
  const {
    i18n: i18nFromContext,
    defaultNS: defaultNSFromContext
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_context_js__WEBPACK_IMPORTED_MODULE_1__.I18nContext) || {};
  const i18n = i18nFromProps || i18nFromContext || (0,_context_js__WEBPACK_IMPORTED_MODULE_1__.getI18n)();
  if (i18n && !i18n.reportNamespaces) i18n.reportNamespaces = new _context_js__WEBPACK_IMPORTED_MODULE_1__.ReportNamespaces();
  if (!i18n) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.warnOnce)(i18n, 'NO_I18NEXT_INSTANCE', 'useTranslation: You will need to pass in an i18next instance by using initReactI18next');
    const notReadyT = (k, optsOrDefaultValue) => {
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isString)(optsOrDefaultValue)) return optsOrDefaultValue;
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isObject)(optsOrDefaultValue) && (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isString)(optsOrDefaultValue.defaultValue)) return optsOrDefaultValue.defaultValue;
      return Array.isArray(k) ? k[k.length - 1] : k;
    };
    const retNotReady = [notReadyT, {}, false];
    retNotReady.t = notReadyT;
    retNotReady.i18n = {};
    retNotReady.ready = false;
    return retNotReady;
  }
  if (i18n.options.react?.wait) (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.warnOnce)(i18n, 'DEPRECATED_OPTION', 'useTranslation: It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour.');
  const i18nOptions = {
    ...(0,_context_js__WEBPACK_IMPORTED_MODULE_1__.getDefaults)(),
    ...i18n.options.react,
    ...props
  };
  const {
    useSuspense,
    keyPrefix
  } = i18nOptions;
  let namespaces = ns || defaultNSFromContext || i18n.options?.defaultNS;
  namespaces = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isString)(namespaces) ? [namespaces] : namespaces || ['translation'];
  i18n.reportNamespaces.addUsedNamespaces?.(namespaces);
  const ready = (i18n.isInitialized || i18n.initializedStoreOnce) && namespaces.every(n => (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.hasLoadedNamespace)(n, i18n, i18nOptions));
  const memoGetT = useMemoizedT(i18n, props.lng || null, i18nOptions.nsMode === 'fallback' ? namespaces : namespaces[0], keyPrefix);
  const getT = () => memoGetT;
  const getNewT = () => alwaysNewT(i18n, props.lng || null, i18nOptions.nsMode === 'fallback' ? namespaces : namespaces[0], keyPrefix);
  const [t, setT] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(getT);
  let joinedNS = namespaces.join();
  if (props.lng) joinedNS = `${props.lng}${joinedNS}`;
  const previousJoinedNS = usePrevious(joinedNS);
  const isMounted = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(true);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const {
      bindI18n,
      bindI18nStore
    } = i18nOptions;
    isMounted.current = true;
    if (!ready && !useSuspense) {
      if (props.lng) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.loadLanguages)(i18n, props.lng, namespaces, () => {
          if (isMounted.current) setT(getNewT);
        });
      } else {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.loadNamespaces)(i18n, namespaces, () => {
          if (isMounted.current) setT(getNewT);
        });
      }
    }
    if (ready && previousJoinedNS && previousJoinedNS !== joinedNS && isMounted.current) {
      setT(getNewT);
    }
    const boundReset = () => {
      if (isMounted.current) setT(getNewT);
    };
    if (bindI18n) i18n?.on(bindI18n, boundReset);
    if (bindI18nStore) i18n?.store.on(bindI18nStore, boundReset);
    return () => {
      isMounted.current = false;
      if (i18n) bindI18n?.split(' ').forEach(e => i18n.off(e, boundReset));
      if (bindI18nStore && i18n) bindI18nStore.split(' ').forEach(e => i18n.store.off(e, boundReset));
    };
  }, [i18n, joinedNS]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isMounted.current && ready) {
      setT(getT);
    }
  }, [i18n, keyPrefix, ready]);
  const ret = [t, i18n, ready];
  ret.t = t;
  ret.i18n = i18n;
  ret.ready = ready;
  if (ready) return ret;
  if (!ready && !useSuspense) return ret;
  throw new Promise(resolve => {
    if (props.lng) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.loadLanguages)(i18n, props.lng, namespaces, () => resolve());
    } else {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.loadNamespaces)(i18n, namespaces, () => resolve());
    }
  });
};

/***/ },

/***/ "./node_modules/react-i18next/dist/es/utils.js"
/*!*****************************************************!*\
  !*** ./node_modules/react-i18next/dist/es/utils.js ***!
  \*****************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDisplayName: () => (/* binding */ getDisplayName),
/* harmony export */   hasLoadedNamespace: () => (/* binding */ hasLoadedNamespace),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   isString: () => (/* binding */ isString),
/* harmony export */   loadLanguages: () => (/* binding */ loadLanguages),
/* harmony export */   loadNamespaces: () => (/* binding */ loadNamespaces),
/* harmony export */   warn: () => (/* binding */ warn),
/* harmony export */   warnOnce: () => (/* binding */ warnOnce)
/* harmony export */ });
const warn = (i18n, code, msg, rest) => {
  const args = [msg, {
    code,
    ...(rest || {})
  }];
  if (i18n?.services?.logger?.forward) {
    return i18n.services.logger.forward(args, 'warn', 'react-i18next::', true);
  }
  if (isString(args[0])) args[0] = `react-i18next:: ${args[0]}`;
  if (i18n?.services?.logger?.warn) {
    i18n.services.logger.warn(...args);
  } else if (console?.warn) {
    console.warn(...args);
  }
};
const alreadyWarned = {};
const warnOnce = (i18n, code, msg, rest) => {
  if (isString(msg) && alreadyWarned[msg]) return;
  if (isString(msg)) alreadyWarned[msg] = new Date();
  warn(i18n, code, msg, rest);
};
const loadedClb = (i18n, cb) => () => {
  if (i18n.isInitialized) {
    cb();
  } else {
    const initialized = () => {
      setTimeout(() => {
        i18n.off('initialized', initialized);
      }, 0);
      cb();
    };
    i18n.on('initialized', initialized);
  }
};
const loadNamespaces = (i18n, ns, cb) => {
  i18n.loadNamespaces(ns, loadedClb(i18n, cb));
};
const loadLanguages = (i18n, lng, ns, cb) => {
  if (isString(ns)) ns = [ns];
  if (i18n.options.preload && i18n.options.preload.indexOf(lng) > -1) return loadNamespaces(i18n, ns, cb);
  ns.forEach(n => {
    if (i18n.options.ns.indexOf(n) < 0) i18n.options.ns.push(n);
  });
  i18n.loadLanguages(lng, loadedClb(i18n, cb));
};
const hasLoadedNamespace = (ns, i18n, options = {}) => {
  if (!i18n.languages || !i18n.languages.length) {
    warnOnce(i18n, 'NO_LANGUAGES', 'i18n.languages were undefined or empty', {
      languages: i18n.languages
    });
    return true;
  }
  return i18n.hasLoadedNamespace(ns, {
    lng: options.lng,
    precheck: (i18nInstance, loadNotPending) => {
      if (options.bindI18n?.indexOf('languageChanging') > -1 && i18nInstance.services.backendConnector.backend && i18nInstance.isLanguageChangingTo && !loadNotPending(i18nInstance.isLanguageChangingTo, ns)) return false;
    }
  });
};
const getDisplayName = Component => Component.displayName || Component.name || (isString(Component) && Component.length > 0 ? Component : 'Unknown');
const isString = obj => typeof obj === 'string';
const isObject = obj => typeof obj === 'object' && obj !== null;

/***/ },

/***/ "./node_modules/react-i18next/dist/es/withSSR.js"
/*!*******************************************************!*\
  !*** ./node_modules/react-i18next/dist/es/withSSR.js ***!
  \*******************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   withSSR: () => (/* binding */ withSSR)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _useSSR_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useSSR.js */ "./node_modules/react-i18next/dist/es/useSSR.js");
/* harmony import */ var _context_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./context.js */ "./node_modules/react-i18next/dist/es/context.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./node_modules/react-i18next/dist/es/utils.js");




const withSSR = () => function Extend(WrappedComponent) {
  function I18nextWithSSR({
    initialI18nStore,
    initialLanguage,
    ...rest
  }) {
    (0,_useSSR_js__WEBPACK_IMPORTED_MODULE_1__.useSSR)(initialI18nStore, initialLanguage);
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(WrappedComponent, {
      ...rest
    });
  }
  I18nextWithSSR.getInitialProps = (0,_context_js__WEBPACK_IMPORTED_MODULE_2__.composeInitialProps)(WrappedComponent);
  I18nextWithSSR.displayName = `withI18nextSSR(${(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.getDisplayName)(WrappedComponent)})`;
  I18nextWithSSR.WrappedComponent = WrappedComponent;
  return I18nextWithSSR;
};

/***/ },

/***/ "./node_modules/react-i18next/dist/es/withTranslation.js"
/*!***************************************************************!*\
  !*** ./node_modules/react-i18next/dist/es/withTranslation.js ***!
  \***************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   withTranslation: () => (/* binding */ withTranslation)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _useTranslation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useTranslation.js */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./node_modules/react-i18next/dist/es/utils.js");



const withTranslation = (ns, options = {}) => function Extend(WrappedComponent) {
  function I18nextWithTranslation({
    forwardedRef,
    ...rest
  }) {
    const [t, i18n, ready] = (0,_useTranslation_js__WEBPACK_IMPORTED_MODULE_1__.useTranslation)(ns, {
      ...rest,
      keyPrefix: options.keyPrefix
    });
    const passDownProps = {
      ...rest,
      t,
      i18n,
      tReady: ready
    };
    if (options.withRef && forwardedRef) {
      passDownProps.ref = forwardedRef;
    } else if (!options.withRef && forwardedRef) {
      passDownProps.forwardedRef = forwardedRef;
    }
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(WrappedComponent, passDownProps);
  }
  I18nextWithTranslation.displayName = `withI18nextTranslation(${(0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.getDisplayName)(WrappedComponent)})`;
  I18nextWithTranslation.WrappedComponent = WrappedComponent;
  const forwardRef = (props, ref) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(I18nextWithTranslation, Object.assign({}, props, {
    forwardedRef: ref
  }));
  return options.withRef ? (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(forwardRef) : I18nextWithTranslation;
};

/***/ },

/***/ "./locale/en/LC_MESSAGES/loris.json"
/*!******************************************!*\
  !*** ./locale/en/LC_MESSAGES/loris.json ***!
  \******************************************/
(module) {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"LORIS":"LORIS","DEV":"DEV","Affiliations":"Affiliations","Site Affiliation":"Site Affiliation","Site Affiliations":"Site Affiliations","Project Affiliation":"Project Affiliation","Project Affiliations":"Project Affiliations","Log Out":"Log Out","My Preferences":"My Preferences","Admin":"Admin","Data Dictionary":"Data Dictionary","Tools":"Tools","Clinical":"Clinical","Imaging":"Imaging","Candidate":"Candidate","Genomics":"Genomics","Electrophysiology":"Electrophysiology","Reports":"Reports","TimePoint":"TimePoint","Yes":"Yes","No":"No","Cancel":"Cancel","Clear":"Clear","Submit":"Submit","Proceed":"Proceed","PSCID":"PSCID","DCCID":"DCCID","Visit Label":"Visit Label","Site":"Site","Module":"Module","Project_one":"Project","Project_other":"Projects","Cohort_one":"Cohort","Cohort_other":"Cohorts","Session":"Session","Date of registration":"Date of registration","Participant Status":"Participant Status","DoB":"DoB","Sex":"Sex","Feedback":"Feedback","Scans":"Scans","Stage":"Stage","Sent To DCC":"Sent To DCC","Date of Birth":"Date of Birth","Visits":"Visits","An error occurred while loading the page.":"An error occurred while loading the page.","Entity Type":"Entity Type","Scan Done":"Scan Done","Show Advanced Filters":"Show Advanced Fitlers","Hide Advanced Filters":"Hide Advanced Filters","{{pageCount}} rows displayed of {{totalCount}}.":"{{pageCount}} rows displayed of {{totalCount}}.","Maximum rows per page:":"Maximum rows per page:","Download Data as CSV":"Download Data as CSV","Views":"Views","NEW":"NEW","Updated":"Updated","Uploaded":"Uploaded","Total":"Total","Not Started":"Not Started","Screening":"Screening","Visit":"Visit","Approval":"Approval","Subject":"Subject","Recycling Bin":"Recycling Bin","Pass":"Pass","Failure":"Failure","Withdrawal":"Withdrawal","In Progress":"In Progress"}');

/***/ },

/***/ "./locale/es/LC_MESSAGES/loris.json"
/*!******************************************!*\
  !*** ./locale/es/LC_MESSAGES/loris.json ***!
  \******************************************/
(module) {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"LORIS":"","DEV":"","Affiliations":"","Site Affiliation":"","Site Affiliations":"","Project Affiliation":"","Project Affiliations":"","Log Out":"","My Preferences":"","Admin":"","Data Dictionary":"","Tools":"","Clinical":"","Imaging":"Imágenes","Candidate":"","Genomics":"","Electrophysiology":"","Reports":"","TimePoint":"Punto en el tiempo","TimePoint %s Details":"Detalles del Punto en el Tiempo %s","Yes":"Sí","True":"Cierto","No":"No","False":"Falso","Create":"Crear","N/A":"N/A","Selection Filter":"Selección de Filtros","Show Filters":"Mostrar Filtros","Hide Filters":"Ocultar Filtros","Clear Filters":"Limpiar Filtros","Show Advanced Filters":"Mostras filtros avanzados","Hide Advanced Filters":"Ocultar filtros avanzados","OK":"Aceptar","Cancel":"Cancelar","Success!":"Exitoso!","PSCID":"SCPID","DCCID":"CCDID","Visit Label":"Etiqueta de Visita","Site":"Sitio","Module":"","Project":"Proyecto","Candidate Registration Project":"Proyecto donde se registró al Candidato","Timepoint Project":"Punto en el tiempo del Proyecto","Cohort_one":"Cohorte","Cohort_other":"Cohortes","Session":"","Date of registration":"Fecha de inscripción","Participant Status":"","DoB":"Fecha de nacimiento","DoD":"Fecha de defunción","Sex":"Sexo","Feedback":"Retroalimentación","Scans":"","Date":"Fecha","Time":"Hora","Stage":"Etapa","Send To DCC":"Enviar a CCD","Sent To DCC":"Enviado a CCD","Reverse Send To DCC":"Revertir Enviar al CCD","Date of Birth":"Fecha de Nacimiento","Visits":"Visitas","An error occurred while loading the page.":"Un error ocurrió minstras cargaba la página","Entity Type":"Tipo de Entidad","Scan Done":"Scan hecho","Language":"Lenguaje","Access denied":"Acceso denegado","No.":"número","Are you sure?":"Estás seguro?","Yes, I am sure!":"¡Sí, estoy seguro!","No, cancel it!":"¡No, cancélalo!","{{pageCount}} rows displayed of {{totalCount}}.":"{{pageCount}} filas mostradas de {{totalCount}}.","Maximum rows per page:":"Máximo de filasa por página","Download Data as CSV":"Descargar Datos como CSV","Views":"Vistas","NEW":"Nuevo","Updated":"Actualizado","Uploaded":"Subido","Total":"Total","Error!":"Error!","Not Started":"No Iniciado","Screening":"Cribado","Visit":"Visita","Approval":"Aprobación","Subject":"Sujeto","Recycling Bin":"Papelera de Reciclage","Pass":"Aprobado","Failure":"Fallido","Withdrawal":"Retirado","In Progress":"En Progreso","Complete":"Completo","Instrument_one":"Instrumento","Instrument_other":"Instrumentos","None":"Ninguna","Partial":"Parcial","All":"Completa","Data Entry":"Entrada de datos","Administration":"Administración","Double Data Entry Form":"Formulario de entrada de datos duplicado","Double Data Entry Status":"Estado del formulario de entrada de datos duplicado","Double Data Entry":"Entrada de datos duplicada","Age":"Edad","{{months}} months old":"{{months}} meses","{{years}} years old":"{{years}} años","%d y / %d m":"%d a / %d m","Loading...":"","Permission denied":"","Unauthorized":"","File to upload":"Archivo para subir","Please make sure files are not larger than {{maxFileSize}}":"","Submit":"","Clear":"","Add":"","Update":"Actualizar","Dataset":"","No options":"","Scan Type":"Tipo de escaneo","SessionID":"ID de sesión","Uploaded By":"Subido por","TarchiveID":"ID de archivo","Type":"Tipo","Upload directory is not a directory":"El directorio de carga no es un directorio válido","Upload directory is not writable":"No se puede escribir en el directorio de carga","Path traversal not allowed":"No se permite la navegación por rutas","This file has already been uploaded.":"Este archivo ya ha sido cargado.","File type not allowed":"Tipo de archivo no permitido","Could not upload file":"No se pudo cargar el archivo"}');

/***/ },

/***/ "./locale/fr/LC_MESSAGES/loris.json"
/*!******************************************!*\
  !*** ./locale/fr/LC_MESSAGES/loris.json ***!
  \******************************************/
(module) {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"LORIS":"LORIS","DEV":"DEV","Affiliations":"Affiliations","Site Affiliation":"Affiliation du site","Site Affiliations":"Affiliations du site","Project Affiliation":"Affiliation du projet","Project Affiliations":"Affiliations du projet","Log Out":"Se déconnecter","My Preferences":"Mes préférences","Admin":"Admin","Data Dictionary":"Dictionnaire des données","Tools":"Outils","Clinical":"Clinique","Imaging":"Imagerie","Candidate_one":"Candidat","Candidate_other":"Candidats","Genomics":"Génomique","Biobank":"Biobanque","Electrophysiology":"Électrophysiologie","Reports":"Rapports","TimePoint":"Temps d\'acquisition","TimePoint %s Details":"Temps d\'acquisition %s Détails","Yes":"Oui","No":"Non","Browse":"Parcourir","Upload":"Téléverser","N/A":"N/A","Back":"Retour","Create":"Créer","Selection Filter":"Filtre de sélection","Filters":"Filtres","Show Filters":"Afficher les filtres","Hide Filters":"Masquer les filtres","Clear Filters":"Effacer les filtres","Load Filter Preset":"Préréglage du filtre de charge","Show Advanced Filters":"Afficher les filtres avancés","Hide Advanced Filters":"Masquer les filtres avancés","Pass":"Approuvé","Fail":"Echec","True":"Vrai","False":"Faux","Selected":"Sélectionné","selected":"sélectionné","OK":"OK","Cancel":"Annuler","Success!":"Réussi!","Close":"Fermer","PSCID":"PSCID","DCCID":"DCCID","Visit Label":"Libellé de visite","Email":"Adresse courriel","Site_one":"Site","Site_other":"Sites","Module":"Module","Project_one":"Projet","Project_other":"Projets","Candidate Registration Project":"Projet d\'inscription des candidats","Timepoint Project":"Moment du projet","Cohort_one":"Cohorte","Cohort_other":"Cohortes","Session":"Session","Date of registration":"Date d\'inscription","Date Of Visit":"Date de la visite","Participant Status":"Statut du participant","DoB":"Date de naissance","DoD":"Date de décès","Sex":"Sexe","Feedback":"Commentaires","Scans":"Scans","Date":"Date","Time":"Heure","Stage":"Stade","Send To DCC":"Envoyer au CCD","Sent To DCC":"Envoyé au CCD","Reverse Send To DCC":"Envoi inversé vers CCD","Date of Birth":"Date de naissance","Visits":"Visites","An error occurred while loading the page.":"Une erreur s\'est produite lors du chargement de la page.","Active":"Actif","Pending":"En attente","Entity Type":"Type d’entité","Scan Done":"Scan d’imagerie complété","Language":"Langage","Access denied":"Accès refusé","No.":"N°","Ethnicity":"Ethnicité","Are You Sure?":"Êtes-vous sûr?","Are you sure?":"Êtes-vous sûr?","Yes, I am sure!":"Oui, j\'en suis sûr!","No, cancel it!":"Non, Annuler le","Leaving the form will result in the loss of any information entered.":"Quitter le formulaire causera la perte de toutes les informations saisies.","Proceed":"Procéder","Previous":"Précédent","Next":"La prochaine étape a commencé.","Save":"Sauvegarder","Saving":"Sauvegarde en cours","Reset":"Réinitialiser","Minimum":"Minimum","Maximum":"Maximum","{{label}} Minimum":"{{label}} minimum","{{label}} Maximum":"{{label}} maximum","Note":"Note","View details":"Voir les détails","No result found.":"Aucun résultat trouvé.","{{pageCount}} rows displayed of {{totalCount}}.":"{{pageCount}} lignes affichées sur {{totalCount}}.","Maximum rows per page:":"Nombre maximal de lignes par page:","Download Data as CSV":"Télécharger les données au format CSV","Views":"Vues","The password is too short":"Le mot de passe est trop court","The password is not complex enough.":"Le mot de passe n\'est pas assez complexe.","This password is known to be exposed in online data breaches.":"Ce mot de passe est connu pour avoir été exposé lors de violations de données en ligne.","Data Supervisors to Email":"Superviseurs des données à contacter par e-mail","Invalid email address":"Adresse courriel non valide","NEW":"Nouveau","New":"Nouveau","Updated":"Mis à jour","Uploaded":"Téléversé","Password Rules":"Règles de mot de passe","Username":"Nom d\'utilisateur","First name":"Prénom","First name is required and should not exceed 120 characters":"Le prénom est obligatoire et ne doit pas dépasser 120 caractères.","Last name":"Nom","Last name is required and should not exceed 120 characters":"Le nom de famille est obligatoire et ne doit pas dépasser 120 caractères.","Email address":"Adresse courriel","New Password":"Nouveau mot de passe","Password":"Mot de passe","Confirm Password":"Confirmer le mot de passe","Email address is required":"Une adresse e-mail est nécessaire","Email address cannot contain any of the following characters: <, >, &, and \\"":"L\'adresse e-mail ne peut contenir aucun des caractères suivants : <, >, & et \\"","The password must be at least 8 characters long.":"Le mot de passe doit comporter au moins 8 caractères.","The password cannot be your username or email address.":"Le mot de passe ne peut pas être votre nom d\'utilisateur ou votre adresse e-mail.","Please choose a unique password.":"Veuillez choisir un mot de passe unique.","No special characters are required but your password must be sufficiently complex to be accepted.":"Aucun caractère spécial n\'est requis, mais votre mot de passe doit être suffisamment complexe pour être accepté.","We suggest using a password manager to generate one for you.":"Nous vous suggérons d\'utiliser un gestionnaire de mots de passe pour en générer un pour vous.","Total":"Total","Error!":"Erreur!","Status":"Statut","Incorrect username or password.":"Identifiant ou mot de passe incorrect.","Not Started":"Non commencé","Screening":"Dépistage","Visit":"Visite","Approval":"Approbation","Subject":"Sujet","Recycling Bin":"Corbeille","Failure":"Échec","Withdrawal":"Retrait","Withdrawn":"Retiré","Created":"Créé","Sent":"Envoyé","In Progress":"En cours","Progress":"Progression","Success":"Succès","Complete":"Complète","Instrument_one":"Instrument","Instrument_other":"Instruments","None":"Aucun","Partial":"Partielle","All":"Tout","Data Entry":"Entrée de données","Administration":"Administration","Double Data Entry Form":"Formulaire de double entrée de données","Double Data Entry Status":"Statut de double entrée des données","Double Data Entry":"Double entrée de données","Age":"Âge","{{months}} months old":"{{months}} mois","{{years}} years old":"{{years}} ans","%d y / %d m":"%d a / %d m","Loading...":"Chargement en cours...","Permission denied":"Permission refusée","Unauthorized":"Non autorisé","File to upload":"Fichier à téléverser","Please make sure files are not larger than {{maxFileSize}}":"Veuillez vous assurer que les fichiers ne dépassent pas la taille de {{maxFileSize}}","Submit":"Soumettre","Clear":"Effacer","Add":"Ajouter","Update":"Actualiser","Dataset":"Ensemble de données","GB":"Go","Month":"Mois","No options":"Aucune option","Submission Successful!":"Soumission réussie!","Scan Type":"Type de scan","SessionID":"Identifiant de session","Uploaded By":"Téléversé par","QC Status":"État du contrôle qualité","TarchiveID":"Identifiant de tarchive","Upload successful!":"Téléversement réussi!","unknown":"inconnu","Type":"Type","Upload directory is not a directory":"Le répertoire de téléversement n\'est pas un répertoire valide","Upload directory is not writable":"Le répertoire de téléversement n\'est pas modifiable","Path traversal not allowed":"La traversée de répertoires n\'est pas autorisée","This file has already been uploaded.":"Ce fichier a déjà été téléversé.","File type not allowed":"Type de fichier non autorisé","Could not upload file":"Impossible de téléverser le fichier","Registration Cohort":"Cohorte d’inscription"}');

/***/ },

/***/ "./locale/hi/LC_MESSAGES/loris.json"
/*!******************************************!*\
  !*** ./locale/hi/LC_MESSAGES/loris.json ***!
  \******************************************/
(module) {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"LORIS":"लोरिस","DEV":"डेव","Affiliations":"अफिलिएशन्स","Site Affiliation":"साइट अफिलिएशन","Site Affiliations":"साइट अफिलिएशन्स","Project Affiliation":"प्रोजेक्ट अफिलिएशन","Project Affiliations":"प्रोजेक्ट अफिलिएशन्स","Log Out":"लॉग आउट","OK":"ठीक है","My Preferences":"मेरी पसंद","Admin":"प्रशासन","Data Dictionary":"डेटा शब्दकोश","Tools":"उपकरण","Clinical":"नैदानिक","Imaging":"इमेजिंग","Candidate_one":"उम्मीदवार","Candidate_other":"उम्मीदवारों","Genomics":"जीनोमिक्स","Electrophysiology":"इलेक्ट्रोफिजियोलॉजी","Reports":"रिपोर्ट्स","TimePoint":"टाइमपॉइंट","Module":"मॉड्यूल","Yes":"हाँ","No":"नहीं","Browse":"ब्राउज़ करें","Submit":"सबमिट करें","Upload":"अपलोड करें","N/A":"लागू नहीं","Save":"सहेजें","Reset":"रीसेट करें","Minimum":"न्यूनतम","Maximum":"अधिकतम","{{label}} Minimum":"{{label}} न्यूनतम","{{label}} Maximum":"{{label}} अधिकतम","Note":"नोट","Back":"वापस","None":"कोई नहीं","Create":"बनाएँ","Selection Filter":"चयन फ़िल्टर","Filters":"फ़िल्टर","Show Filters":"फ़िल्टर दिखाएँ","Hide Filters":"फ़िल्टर छिपाएँ","Clear Filters":"फ़िल्टर साफ़ करें","Load Filter Preset":"फ़िल्टर प्रीसेट लोड करें","Show Advanced Filters":"उन्नत फ़िल्टर दिखाएँ","Hide Advanced Filters":"उन्नत फ़िल्टर छिपाएँ","Pass":"पास","Fail":"फेल","True":"सत्य","False":"असत्य","Selected":"चयनित","selected":"चयनित","Cancel":"रद्द करें","Clear":"हटाना","Proceed":"आगे बढ़ना","Success!":"सफलता!","Close":"बंद करें","Saving":"सहेजा जा रहा है","Leaving the form will result in the loss of any information entered.":"फॉर्म छोड़ने पर दर्ज की गई सभी जानकारी खो जाएगी।","PSCID":"पीएससीआईडी","DCCID":"डीसीसीआईडी","Visit Label":"भेंट लेबल","Status":"स्थिति","No.":"संख्या","Email":"ईमेल","Site_one":"साइट","Site_other":"साइट्स","Project_one":"परियोजना","Project_other":"प्रोजेक्ट्","Candidate Registration Project":"उम्मीदवार पंजीकरण परियोजना","Timepoint Project":"समय बिंदु परियोजना","Cohort_one":"समूह","Cohort_other":"समूह","Session_one":"सत्र","Session_other":"सत्र","Date of registration":"पंजीकरण की तिथि","Participant Status":"प्रतिभागी की स्थिति","DoB":"जन्म तिथि","Sex":"लिंग","Feedback":"प्रतिक्रिया","Scans":"स्कैन","Stage":"चरण","Send To DCC":"डीसीसी को भेजें","Sent To DCC":"डीसीसी को भेजा गया","Reverse Send To DCC":"डीसीसी को भेजना रद्द करें","Date of Birth":"जन्म तिथि","Visits":"भ्रमण","Visit":"भेंट","Created":"बनाया गया","Sent":"भेजा गया","In Progress":"प्रगति पर","Complete":"पूर्ण","An error occurred while loading the page.":"पृष्ठ लोड करते समय एक त्रुटि हुई।","Active":"सक्रिय","Pending":"लंबित","Entity Type":"इकाई प्रकार","Scan Done":"स्कैन पूरा हुआ","Language":"भाषा","View details":"विवरण देखें","Ethnicity":"जातीयता","Access denied":"पहुँच अस्वीकृत","Previous":"पिछला","Next":"अगला","{{pageCount}} rows displayed of {{totalCount}}.":"{{totalCount}} में से {{pageCount}} पंक्तियाँ प्रदर्शित","Maximum rows per page:":"प्रति पृष्ठ अधिकतम पंक्तियाँ:","Download Data as CSV":"तालिका को CSV के रूप में डाउनलोड करें","The password is too short":"पासवर्ड बहुत छोटा है","The password is not complex enough.":"पासवर्ड पर्याप्त जटिल नहीं है।","This password is known to be exposed in online data breaches.":"यह पासवर्ड ऑनलाइन डेटा उल्लंघनों में उजागर होने के लिए जाना जाता है।","Data Supervisors to Email":"ईमेल करने के लिए डेटा पर्यवेक्षक","Invalid email address":"अमान्य ईमेल पता","Views":"दृश्य","NEW":"नया","New":"नया","Updated":"अद्यतन किया गया","Uploaded":"अपलोड किया गया","Password Rules":"पासवर्ड नियम","Username":"उपयोगकर्ता नाम","First name":"पहला नाम","First name is required and should not exceed 120 characters":"पहला नाम आवश्यक है और 120 अक्षरों से अधिक नहीं होना चाहिए।","Last name":"अंतिम नाम","Last name is required and should not exceed 120 characters":"अंतिम नाम आवश्यक है और 120 अक्षरों से अधिक नहीं होना चाहिए।","Email address":"ईमेल पता","New Password":"नया पासवर्ड","Password":"पासवर्ड","Confirm Password":"पासवर्ड की पुष्टि करें","Email address is required":"ईमेल पता आवश्यक है","Email address cannot contain any of the following characters: <, >, &, and \\"":"ईमेल पता निम्नलिखित किसी भी वर्ण को नहीं शामिल कर सकता: <, >, &, और \\"","The password must be at least 8 characters long.":"पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।","The password cannot be your username or email address.":"पासवर्ड आपका उपयोगकर्ता नाम या ईमेल पता नहीं हो सकता।","Please choose a unique password.":"कृपया एक अद्वितीय पासवर्ड चुनें।","No special characters are required but your password must be sufficiently complex to be accepted.":"कोई विशेष अक्षर आवश्यक नहीं हैं, लेकिन पासवर्ड पर्याप्त जटिल होना चाहिए ताकि उसे स्वीकार किया जा सके।","We suggest using a password manager to generate one for you.":"हम सुझाव देते हैं कि आपके लिए पासवर्ड बनाने हेतु पासवर्ड मैनेजर का उपयोग करें।","Error!":"त्रुटि!","Date":"दिनांक","Not Started":"शुरू नहीं हुआ","Total":"कुल","Screening":"जांच","Approval":"स्वीकृति","Subject":"विषय","Recycling Bin":"रिसाइक्लिंग बिन","Failure":"विफलता","Withdrawal":"निकासी","Progress":"प्रगति","Success":"सफलता","Instrument_one":"उपकरण","Instrument_other":"उपकरण","Partial":"आंशिक","All":"सभी","Data Entry":"डेटा प्रविष्टि","Administration":"प्रशासन","Double Data Entry Form":"दोहरी डेटा प्रविष्टि फ़ॉर्म","Double Data Entry Status":"दोहरी डेटा प्रविष्टि स्थिति","Double Data Entry":"दोहरी डेटा प्रविष्टि","Age":"आयु","{{months}} months old":"{{months}} महीने का/की","{{years}} years old":"{{years}} वर्ष का","%d y / %d m":"%d व / %d म","Loading...":"लोड हो रहा है...","Permission denied":"अनुमति अस्वीकृत","File to upload":"अपलोड करने के लिए फ़ाइल","Please make sure files are not larger than {{maxFileSize}}":"कृपया सुनिश्चित करें कि फ़ाइलें {{maxFileSize}} से बड़ी न हों","Are You Sure?":"क्या आप सुनिश्चित हैं?","Are you sure?":"क्या आप सुनिश्चित हैं?","Yes, I am sure!":"हाँ, मैं सुनिश्चित हूँ!","No, cancel it!":"नहीं, रद्द करें!","Add":"जोड़ें","Update":"अद्यतन","Dataset":"डेटासेट","GB":"जीबी","Month":"महीना","No options":"कोई विकल्प नहीं","Submission Successful!":"सबमिशन सफल रहा!","Scan Type":"स्कैन प्रकार","SessionID":"सत्र आईडी","Uploaded By":"द्वारा अपलोड किया गया","QC Status":"QC स्थिति","TarchiveID":"टीआर्काइवआईडी","Upload successful!":"अपलोड सफल!","unknown":"अज्ञात","Type":"प्रकार","Upload directory is not a directory":"अपलोड निर्देशिका एक मान्य निर्देशिका नहीं है","Upload directory is not writable":"अपलोड निर्देशिका में लिखा नहीं जा सकता","Path traversal not allowed":"पाथ ट्रैवर्सल की अनुमति नहीं है","This file has already been uploaded.":"यह फ़ाइल पहले ही अपलोड की जा चुकी है।","File type not allowed":"इस फ़ाइल प्रकार की अनुमति नहीं है","Could not upload file":"फ़ाइल अपलोड नहीं हो सकी"}');

/***/ },

/***/ "./locale/ja/LC_MESSAGES/loris.json"
/*!******************************************!*\
  !*** ./locale/ja/LC_MESSAGES/loris.json ***!
  \******************************************/
(module) {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"LORIS":"ロリス","DEV":"開発環境","Affiliations":"所属","Site Affiliation":"サイトの所属","Site Affiliations":"サイトの所属","Project Affiliation":"プロジェクトの所属","Project Affiliations":"プロジェクトの所属","Log Out":"ログアウト","My Preferences":"私の好み","Admin":"行政上の","Data Dictionary":"データ辞書","Tools":"ツール","Clinical":"臨床的","Imaging":"イメージング","Candidate_other":"為り手","Genomics":"ゲノミクス","Biobank":"バイオバンク","Electrophysiology":"電気生理学","Reports":"レポート","TimePoint":"タイムポイント","TimePoint %s Details":"タイムポイント%s の詳細","Yes":"はい","No":"いいえ","Browse":"ブラウズ","Upload":"アップロード","N/A":"適用できない","Back":"戻る","Create":"作成する","Selection Filter":"\'選択フィルター","Filters":"フィルター","Show Filters":"フィルターを表示","Hide Filters":"フィルターを非表示","Clear Filters":"フィルターをクリア","Load Filter Preset":"フィルタープリセットを読み込む","Show Advanced Filters":"詳細フィルターを表示","Hide Advanced Filters":"詳細フィルターを非表示","Pass":"合格","Fail":"失敗","True":"真実","False":"間違い","Selected":"選択済み","selected":"選択済み","OK":"わかりました","Cancel":"取り消す","Success!":"成功！","Close":"近い","PSCID":"プロジェクト識別子","DCCID":"候補者識別子","Visit Label":"ラベルを訪問","Email":"メール","Site_other":"サイト","Module":"モジュール","Project_other":"プロジェクト","Candidate Registration Project":"候補者登録プロジェクト","Timepoint Project":"タイムポイントプロジェクト","Cohort_other":"コホート","Session_other":"セッション","Date of registration":"入学日","Date Of Visit":"訪問日","Participant Status":"参加者ステータス","DoB":"生年月日","DoD":"死亡日","Sex":"性別","Feedback":"フィードバック","Scans":"スキャン","Date":"日付","Time":"時間","Stage":"ステージ","Send To DCC":"DCCに送信","Sent To DCC":"DCCに送信","Reverse Send To DCC":"DCCへの逆送信","Date of Birth":"生年月日","Visits":"訪問","An error occurred while loading the page.":"このページの読み込み中にエラーが発生しました","Active":"アクティブ","Pending":"保留中","Entity Type":"エンティティタイプ","Scan Done":"スキャン完了","Language":"言語","Access denied":"アクセスが拒否されました","No.":"番号","Ethnicity":"民族","Are You Sure?":"本気ですか？","Are you sure?":"本気ですか？","Yes, I am sure!":"はい、間違いないです！","No, cancel it!":"いや、キャンセルしろ！","Leaving the form will result in the loss of any information entered.":"フォームを離れると、入力した情報はすべて失われます。","Proceed":"進む","Previous":"前の","Next":"次","Save":"保存","Saving":"節約","Reset":"リセット","Note":"注記","View details":"詳細を表示","No result found.":"結果が見つかりませんでした。","{{pageCount}} rows displayed of {{totalCount}}.":"{{totalCount}}行中{{pageCount}}行を表示","Maximum rows per page:":"ページあたりの最大行数:","Download Data as CSV":"データをCSVとしてダウンロード","Views":"ビュー","The password is too short":"パスワードが短すぎます","The password is not complex enough.":"パスワードが十分に複雑ではありません。","This password is known to be exposed in online data breaches.":"このパスワードは、オンラインデータ侵害で漏洩されることが知られています。","Data Supervisors to Email":"データ管理者に電子メールで連絡","Invalid email address":"無効なメールアドレス","NEW":"新しい","New":"新しい","Updated":"更新","Uploaded":"アップロード済み","Password Rules":"パスワードルール","Username":"ユーザー名","First name":"ファーストネーム","First name is required and should not exceed 120 characters":"名は必須で、120文字以内で入力してください。","Last name":"苗字","Last name is required and should not exceed 120 characters":"姓は必須で、120文字以内で入力してください。","Email address":"電子メールアドレス","New Password":"新しいパスワード","Password":"パスワード","Confirm Password":"パスワードを認証する","Email address is required":"メールアドレスは必須です","Email address cannot contain any of the following characters: <, >, &, and \\"":"メールアドレスには、<、>、&、\\" の文字を含めることはできません。","The password must be at least 8 characters long.":"パスワードは8文字以上である必要があります","The password cannot be your username or email address.":"パスワードにはユーザー名やメールアドレスは使用できません。","Please choose a unique password.":"固有のパスワードを選択してください。","No special characters are required but your password must be sufficiently complex to be accepted.":"特殊文字は必要ありませんが、パスワードは受け入れられるほど複雑である必要があります。","We suggest using a password manager to generate one for you.":"パスワード マネージャーを使用してパスワードを生成することをお勧めします。","Total":"合計","Error!":"エラー！","Status":"状態","Incorrect username or password.":"ユーザー名またはパスワードが正しくありません。","Not Started":"開始されていません","Screening":"スクリーニング","Visit":"訪問","Created":"作成済み","Sent":"送信済み","Approval":"承認","Subject":"候補者","Recycling Bin":"リサイクルビン","Failure":"失敗","Withdrawal":"撤退","Withdrawn":"撤退","In Progress":"進行中","Progress":"進捗","Success":"成功","Complete":"完了","Instrument_other":"楽器","None":"なし","Partial":"部分的","All":"全て","Data Entry":"データ入力","Administration":"管理","Double Data Entry Form":"二重データ入力フォーム","Double Data Entry Status":"二重データ入力ステータス","Double Data Entry":"二重データ入力","Age":"年","{{months}} months old":"{{months}}ヶ月","{{years}} years old":"{{years}}歳","%d y / %d m":"%d年%dヶ月","Loading...":"読み込み中...","Permission denied":"許可が拒否されました","Unauthorized":"不正な","File to upload":"アップロードするファイル","Please make sure files are not larger than {{maxFileSize}}":"ファイルが {{maxFileSize}} を超えていないことを確認してください","Submit":"提出する","Clear":"クリア","Add":"追加","Update":"修正","Dataset":"データセット","GB":"GB","Month":"月","No options":"オプションなし","Submission Successful!":"送信成功しました!","Scan Type":"スキャンタイプ","SessionID":"SessionID","Uploaded By":"アップロード者","QC Status":"品質管理状況","TarchiveID":"TarchiveID","Upload successful!":"アップロード成功しました!","unknown":"不明","Type":"タイプ","Upload directory is not a directory":"アップロードディレクトリが有効なディレクトリではありません","Upload directory is not writable":"アップロードディレクトリに書き込めません","Path traversal not allowed":"パストラバーサルは許可されていません","This file has already been uploaded.":"このファイルはすでにアップロードされています。","File type not allowed":"許可されていないファイル形式です","Could not upload file":"ファイルをアップロードできませんでした"}');

/***/ },

/***/ "./locale/zh/LC_MESSAGES/loris.json"
/*!******************************************!*\
  !*** ./locale/zh/LC_MESSAGES/loris.json ***!
  \******************************************/
(module) {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"LORIS":"LORIS","DEV":"DEV","Affiliations":"所属关系","Site Affiliation":"所属中心","Site Affiliations":"所属中心","Project Affiliation":"所属项目","Project Affiliations":"所属项目","Log Out":"退出","My Preferences":"个人设置","Admin":"管理","Data Dictionary":"数据字典","Tools":"工具","Clinical":"临床","Imaging":"影像学","Candidate_other":"受试者","Genomics":"基因组学","Biobank":"生物样本库","Electrophysiology":"电生理学","Reports":"报告","TimePoint":"时间点","TimePoint %s Details":"时间点 %s 详细信息","Yes":"是","No":"否","Browse":"浏览","Upload":"上传","N/A":"不适用","Back":"返回","Create":"创建","Selection Filter":"选择过滤器","Filters":"过滤器","Show Filters":"显示过滤器","Hide Filters":"隐藏过滤器","Clear Filters":"清除过滤器","Load Filter Preset":"加载过滤器预设","Show Advanced Filters":"显示高级过滤器","Hide Advanced Filters":"隐藏高级过滤器","Pass":"经过","Fail":"失败","True":"是","False":"否","Selected":"已选择","selected":"已选择","OK":"好的","Cancel":"取消","Success!":"成功！","Close":"关闭","PSCID":"PSCID","DCCID":"DCCID","Visit Label":"访视标签","Email":"邮箱","Site_other":"中心","Module":"模块","Project_other":"项目","Candidate Registration Project":"候选人报名项目","Timepoint Project":"时间点项目","Cohort_other":"队列","Session_other":"会话","Date of registration":"注册日期","Date Of Visit":"访问日期","Participant Status":"受试者状态","DoB":"出生日期","Sex":"性别","Feedback":"反馈","Scans":"扫描数据","Date":"日期","Time":"时间","Stage":"阶段","Send To DCC":"发送至 DCC","Sent To DCC":"发送至 DCC","Reverse Send To DCC":"反向发送至 DCC","Date of Birth":"出生日期","Visits":"随访/访视","An error occurred while loading the page.":"加载页面时发生错误。","Active":"启用","Pending":"待处理","Entity Type":"实体类型","Scan Done":"扫描完成","Language":"语言","Access denied":"拒绝访问","No.":"不。","Ethnicity":"种族/民族","Are You Sure?":"你确定吗？","Are you sure?":"你确定吗？","Yes, I am sure!":"是的，我确定！","No, cancel it!":"不行，取消吧！","Leaving the form will result in the loss of any information entered.":"离开表格将导致输入的所有信息丢失。","Proceed":"继续","Previous":"上一步","Next":"下一步","Save":"保存","Saving":"保存中","Reset":"重置","Note":"笔记","View details":"查看详情","Created":"已创建","DoD":"死亡日期","GB":"GB","Month":"月","Sent":"已发送","Update":"更新","No result found.":"没有找到结果。","{{pageCount}} rows displayed of {{totalCount}}.":"显示 {{totalCount}} 的 {{pageCount}} 行。","Maximum rows per page:":"每页最大行数：","Download Data as CSV":"将数据下载为 CSV","Views":"视图","The password is too short":"密码太短","The password is not complex enough.":"密码不够复杂。","This password is known to be exposed in online data breaches.":"众所周知，该密码会在在线数据泄露中暴露。","Data Supervisors to Email":"数据主管发送电子邮件","Invalid email address":"电子邮件地址无效","NEW":"新的","New":"新的","Updated":"已更新","Uploaded":"已上传","Password Rules":"密码规则","Username":"用户名","First name":"名","First name is required and should not exceed 120 characters":"名字为必填项，且不得超过 120 个字符","Last name":"姓","Last name is required and should not exceed 120 characters":"姓氏为必填项，且不得超过 120 个字符","Email address":"电子邮件","New Password":"新密码","Password":"密码","Confirm Password":"确认密码","Email address is required":"电子邮件地址为必填项","Email address cannot contain any of the following characters: <, >, &, and \\"":"电子邮件地址不能包含以下任何字符：<、>、&、 \\" 和 ","The password must be at least 8 characters long.":"密码长度必须至少为 8 个字符。","The password cannot be your username or email address.":"密码不能是您的用户名或电子邮件地址。","Please choose a unique password.":"请选择一个唯一的密码。","No special characters are required but your password must be sufficiently complex to be accepted.":"不需要特殊字符，但您的密码必须足够复杂才能被接受。","We suggest using a password manager to generate one for you.":"我们建议使用密码管理器为您生成一个。","Total":"全部的","Error!":"错误！","Status":"状态","Incorrect username or password.":"用户名或密码不正确。","Not Started":"未开始","Screening":"筛查","Visit":"访视","Approval":"赞同","Subject":"受试者","Recycling Bin":"回收箱","Failure":"失败","Withdrawal":"退出研究","Withdrawn":"已退出","In Progress":"进行中","Progress":"进步","Success":"成功","Complete":"已完成","Instrument_other":"量表/评估工具","None":"无","Partial":"部分","All":"全部","Data Entry":"数据录入","Administration":"行政","Double Data Entry Form":"双重数据输入表","Double Data Entry Status":"双重数据输入状态","Double Data Entry":"双人录入","Age":"年龄","{{months}} months old":"{{months}} 月龄","{{years}} years old":"{{years}} 岁","%d y / %d m":"%d年%d月","Loading...":"加载中...","Permission denied":"无权限","Unauthorized":"未授权","File to upload":"要上传的文件","Please make sure files are not larger than {{maxFileSize}}":"请确保文件不大于 {{maxFileSize}}","Submit":"提交","Clear":"清除","Add":"添加","Dataset":"数据集","No options":"无可选项","Submission Successful!":"提交成功！","Scan Type":"扫描类型","SessionID":"会话ID","Uploaded By":"上传者","QC Status":"质量控制状态","TarchiveID":"档案ID","Upload successful!":"上传成功！","unknown":"未知","Type":"类型","Upload directory is not a directory":"上传目录不是有效的目录","Upload directory is not writable":"上传目录不可写","Path traversal not allowed":"不允许路径遍历","This file has already been uploaded.":"此文件已上传。","File type not allowed":"不允许的文件类型","Could not upload file":"无法上传文件"}');

/***/ },

/***/ "./modules/configuration/locale/fr/LC_MESSAGES/configuration.json"
/*!************************************************************************!*\
  !*** ./modules/configuration/locale/fr/LC_MESSAGES/configuration.json ***!
  \************************************************************************/
(module) {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"Configuration":"Configuration","Related Cohorts":"Cohortes associées","Diagnosis Evolution":"Évolution du diagnostic","An error occurred while loading the page.":"Une erreur est survenue lors du chargement de la page.","Submitted":"Soumis","Use this page to manage the configuration of existing cohorts, or to add a new one.":"Utilisez cette page pour gérer la configuration des cohortes existantes ou pour en ajouter une nouvelle.","New CohortID":"Nouvel identifiant de cohorte","Cohort Name":"Nom de la cohorte","Use EDC":"Utiliser l\'EDC","Calculate Window Difference For Instruments Based On":"Calculer la différence de fenêtre des instruments en fonction de","Recruitment Target":"Objectif de recrutement","New Cohort":"Nouvelle cohorte","After adding a new cohort, Visit labels for this cohort can only be created by editing the configuration file, \\"config.xml\\". Please contact your administrator if you need more information.":"Après l\'ajout d\'une nouvelle cohorte, les libellés de visite de cette cohorte ne peuvent être créés qu\'en modifiant le fichier de configuration « config.xml ». Veuillez communiquer avec votre administrateur si vous avez besoin de plus d\'informations.","Please enter the various configuration variables into the fields below. For information on how to configure LORIS, please refer to the Help section and/or the Developer\'s guide.":"Veuillez saisir les différentes variables de configuration dans les champs ci-dessous. Pour savoir comment configurer LORIS, consultez la section Aide et/ou le guide du développeur.","click here":"cliquez ici","To configure study cohorts <0>click here</0>.":"Pour configurer les cohortes de l\'étude, <0>cliquez ici</0>.","To configure study projects <0>click here</0>.":"Pour configurer les projets de l\'étude, <0>cliquez ici</0>.","To configure candidate identifier types <0>click here</0>.":"Pour configurer les types d\'identifiants de candidats, <0>cliquez ici</0>.","To configure the diagnosis trajectory of the study <0>click here</0>.":"Pour configurer la trajectoire diagnostique de l\'étude, <0>cliquez ici</0>.","Use this page to manage the configuration of existing projects, or to add a new one.":"Utilisez cette page pour gérer la configuration des projets existants ou pour en ajouter un nouveau.","New ProjectID":"Nouvel identifiant de projet","Project Name":"Nom du projet","Alias":"Alias","Affiliated Cohorts":"Cohortes affiliées","New Project":"Nouveau projet","Delete":"Supprimer","Trajectory Name":"Nom de la trajectoire","Source Field":"Champ source","Order Number":"Numéro d\'ordre","Please add a recruitment target here":"Veuillez saisir un objectif de recrutement.","Please add a cohort title here":"Veuillez saisir un titre de cohorte.","Please add a project title here":"Veuillez saisir un titre de projet.","Please add an alias here":"Veuillez saisir un alias.","New Diagnosis Trajectory":"Nouvelle trajectoire diagnostique","Are you sure you want to delete this diagnosis trajectory?":"Êtes-vous certain de vouloir supprimer cette trajectoire diagnostique ?","Deletion Successful!":"Suppression réussie !","Please confirm you want to delete the option \\"{{option}}\\" of the field \\"{{field}}\\".":"Veuillez confirmer que vous souhaitez supprimer l\'option « {{option}} » du champ « {{field}} ».","Confirm":"Confirmer","Please fill out all fields!":"Veuillez remplir tous les champs !","Visit is not defined for selected Project.":"La visite n\'est pas définie pour le projet sélectionné.","Instrument does not exist in selected visit.":"L\'instrument n\'existe pas pour la visite sélectionnée.","Source Field does not exist in instrument.":"Le champ source n\'existe pas dans l\'instrument.","Order Number not unique for this Project! Already used in Trajectory: %s":"Le numéro d\'ordre n\'est pas unique pour ce projet ! Il est déjà utilisé dans la trajectoire : %s","Trajectory Name already exists.":"Le nom de la trajectoire existe déjà.","Recruitment Target must be an integer greater than zero":"L\'objectif de recrutement doit être un entier supérieur à zéro.","Table must be \\"Config\\" or \\"ConfigSettings\\"":"La table doit être « Config » ou « ConfigSettings ».","Add field":"Ajouter un champ","Register Trajectory":"Créer une trajectoire","Use this page to manage the configuration of the study\'s diagnosis trajectory.":"Utilisez cette page pour gérer la configuration de la trajectoire diagnostique de l\'étude.","Ymd (EX: 2015-12-28)":"Ymd (p. ex. 2015-12-28)","Ym (EX: 2015-12)":"Ym (p. ex. 2015-12)","Debug":"Débogage","Info":"Information","Notice":"Avis","Warning":"Avertissement","Error":"Erreur","Critical":"Critique","Alert":"Alerte","Emergency":"Urgence","PatientID":"Identifiant du patient","PatientName":"Nom du patient","Closest Test Battery":"Batterie de tests la plus proche","Optimal Visit Window for Visit Label":"Fenêtre de visite optimale pour le libellé de visite","This field is required!":"Ce champ est obligatoire !","This field is required! Entry must be included in provided list of options.":"Ce champ est obligatoire ! La valeur saisie doit faire partie de la liste des options proposées.","This field is required! Please click \\"Add Field\\" before saving.":"Ce champ est obligatoire ! Veuillez cliquer sur « Ajouter un champ » avant d\'enregistrer.","Value":"Valeur","Mapped value":"Valeur correspondante","Use this page to manage the configuration of existing candidate identifier types, or to add a new one.":"Utilisez cette page pour gérer la configuration des types d’identifiants de candidats existants ou pour en ajouter un nouveau.","New Identifier Type":"Nouveau type d\'identifiant","Name":"Nom","Format":"Format","Required":"Obligatoire","Unique":"Unique","Auto Generate":"Génération automatique","Allow Multiple":"Autoriser plusieurs valeurs","Identifier name, e.g. PSCID or ExternalID":"Nom de l\'identifiant, p. ex. PSCID ou ExternalID","Template used to generate or validate identifier values.":"Modèle utilisé pour générer ou valider les valeurs des identifiants.","Whether candidates using this identifier type must have at least one value":"Indique si les candidats utilisant ce type d\'identifiant doivent avoir au moins une valeur","Whether identifier values must be unique across candidates":"Indique si les valeurs des identifiants doivent être uniques parmi les candidats","Whether LORIS generates the value automatically from the format":"Indique si LORIS génère automatiquement la valeur à partir du format","Whether a candidate can have more than one value of this type":"Indique si un candidat peut avoir plusieurs valeurs de ce type","Projects in which this identifier type can be used. An identifier type can be associated with multiple projects.":"Projets dans lesquels ce type d\'identifiant peut être utilisé. Un type d\'identifiant peut être associé à plusieurs projets."}');

/***/ },

/***/ "./modules/configuration/locale/ja/LC_MESSAGES/configuration.json"
/*!************************************************************************!*\
  !*** ./modules/configuration/locale/ja/LC_MESSAGES/configuration.json ***!
  \************************************************************************/
(module) {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"Configuration":"構成","To configure study cohorts <0>click here</0>.":"","To configure study projects <0>click here</0>.":"","To configure the diagnosis trajectory of the study <0>click here</0>.":"","Value":"値","Mapped value":"対応する値"}');

/***/ },

/***/ "./modules/configuration/locale/zh/LC_MESSAGES/configuration.json"
/*!************************************************************************!*\
  !*** ./modules/configuration/locale/zh/LC_MESSAGES/configuration.json ***!
  \************************************************************************/
(module) {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"Configuration":"配置","To configure study cohorts <0>click here</0>.":"","To configure study projects <0>click here</0>.":"","To configure the diagnosis trajectory of the study <0>click here</0>.":"","Value":"值","Mapped value":"映射值"}');

/***/ }

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
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
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
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!********************************************************************!*\
  !*** ./modules/configuration/jsx/formCandidateIdentifierTypes.tsx ***!
  \********************************************************************/


var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function sent() {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
var __read = void 0 && (void 0).__read || function (o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
    r,
    ar = [],
    e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
      ar.push(r.value);
    }
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray = void 0 && (void 0).__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var react_1 = __webpack_require__(/*! react */ "react");
var client_1 = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
var react_i18next_1 = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/index.js");
var I18nSetup_1 = __importDefault(__webpack_require__(/*! I18nSetup */ "./jsx/I18nSetup.ts"));
var Loader_1 = __importDefault(__webpack_require__(/*! Loader */ "./jsx/Loader.tsx"));
var Tabs_1 = __webpack_require__(/*! Tabs */ "./jsx/Tabs.js");
var Form_1 = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");
var StudyEntitiesClient_1 = __importDefault(__webpack_require__(/*! ./StudyEntitiesClient */ "./modules/configuration/jsx/StudyEntitiesClient.ts"));
var configuration_json_1 = __importDefault(__webpack_require__(/*! ../locale/ja/LC_MESSAGES/configuration.json */ "./modules/configuration/locale/ja/LC_MESSAGES/configuration.json"));
var configuration_json_2 = __importDefault(__webpack_require__(/*! ../locale/fr/LC_MESSAGES/configuration.json */ "./modules/configuration/locale/fr/LC_MESSAGES/configuration.json"));
var configuration_json_3 = __importDefault(__webpack_require__(/*! ../locale/zh/LC_MESSAGES/configuration.json */ "./modules/configuration/locale/zh/LC_MESSAGES/configuration.json"));
var EMPTY_IDENTIFIER_TYPE = {
  candidateIdentifierTypeID: 0,
  name: '',
  format: '',
  isRequired: false,
  isUnique: false,
  autoGenerate: false,
  allowMultiple: false,
  projectIDs: []
};
/**
 * Convert server data into controlled form values.
 *
 * @param {IdentifierType} identifierType Identifier type
 * @return {IdentifierTypeValues}
 */
function formValues(identifierType) {
  return {
    name: identifierType.name,
    format: identifierType.format,
    isRequired: identifierType.isRequired,
    isUnique: identifierType.isUnique,
    autoGenerate: identifierType.autoGenerate,
    allowMultiple: identifierType.allowMultiple,
    projectIDs: identifierType.projectIDs.map(String)
  };
}
/**
 * Create or edit one candidate identifier type.
 *
 * @param {IdentifierTypeFormProps} props Form properties
 * @return {React.ReactElement}
 */
function IdentifierTypeForm(props) {
  var _this = this;
  var _a = __read((0, react_1.useState)(function () {
      return formValues(props.identifierType);
    }), 2),
    defaults = _a[0],
    setDefaults = _a[1];
  var _b = __read((0, react_1.useState)(defaults), 2),
    values = _b[0],
    setValues = _b[1];
  var _c = __read((0, react_1.useState)(null), 2),
    status = _c[0],
    setStatus = _c[1];
  var _d = __read((0, react_1.useState)(false), 2),
    saving = _d[0],
    setSaving = _d[1];
  /**
   * Update one controlled form field.
   *
   * @param {string} name Field name
   * @param {string|string[]|boolean} value New value
   */
  var updateValue = function updateValue(name, value) {
    setValues(function (current) {
      var _a;
      return __assign(__assign({}, current), (_a = {}, _a[name] = value, _a));
    });
    setStatus(null);
  };
  /**
   * Validate required fields.
   *
   * @return {string|null} Error message or null
   */
  var validationError = function validationError() {
    if (!values.name.trim()) {
      return props.t('Failed to save, must enter an identifier type name!', {
        ns: 'configuration'
      });
    }
    if (!values.format.trim()) {
      return props.t('Failed to save, must enter an identifier format!', {
        ns: 'configuration'
      });
    }
    return null;
  };
  /**
   * Submit the form to the existing AJAX endpoint.
   *
   * @param {React.SyntheticEvent} event Submit event
   */
  var submit = function submit(event) {
    return __awaiter(_this, void 0, void 0, function () {
      var error, body, error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            event.preventDefault();
            error = validationError();
            if (error !== null) {
              setStatus({
                message: error,
                type: 'error'
              });
              return [2 /*return*/];
            }
            setSaving(true);
            setStatus(null);
            body = new URLSearchParams({
              CandidateIdentifierTypeID: props.identifierTypeID,
              Name: values.name.trim(),
              Format: values.format.trim(),
              IsRequired: values.isRequired ? '1' : '0',
              IsUnique: values.isUnique ? '1' : '0',
              AutoGenerate: values.autoGenerate ? '1' : '0',
              AllowMultiple: values.allowMultiple ? '1' : '0'
            });
            values.projectIDs.forEach(function (projectID) {
              body.append('ProjectIDs[]', projectID);
            });
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, 4, 5]);
            return [4 /*yield*/, new StudyEntitiesClient_1["default"]('configuration').save("".concat(loris.BaseURL, "/configuration/ajax/updateCandidateIdentifierType.php"), body)];
          case 2:
            _a.sent();
            setDefaults(__assign({}, values));
            setStatus({
              message: props.t('Successfully saved', {
                ns: 'configuration'
              }),
              type: 'success'
            });
            if (props.isNew) {
              window.setTimeout(function () {
                return window.location.reload();
              }, 1000);
            } else {
              props.onSaved(props.identifierTypeID, values);
            }
            return [3 /*break*/, 5];
          case 3:
            error_1 = _a.sent();
            setStatus({
              message: error_1 instanceof Error ? error_1.message : props.t('Failed to save candidate identifier type.', {
                ns: 'configuration'
              }),
              type: 'error'
            });
            return [3 /*break*/, 5];
          case 4:
            setSaving(false);
            return [7 /*endfinally*/];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  var fieldPrefix = props.isNew ? 'new-identifier-type' : "identifier-type-".concat(props.identifierTypeID);
  return /*#__PURE__*/React.createElement(Form_1.FormElement, {
    name: fieldPrefix,
    id: "form-".concat(fieldPrefix),
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("fieldset", null, /*#__PURE__*/React.createElement("input", {
    name: "CandidateIdentifierTypeID",
    type: "hidden",
    value: props.identifierTypeID
  }), /*#__PURE__*/React.createElement("div", {
    title: props.t('Identifier name, e.g. PSCID or ExternalID', {
      ns: 'configuration'
    })
  }, /*#__PURE__*/React.createElement(Form_1.TextboxElement, {
    label: props.t('Name', {
      ns: 'configuration'
    }),
    id: "".concat(fieldPrefix, "-name"),
    name: "name",
    value: values.name,
    onUserInput: updateValue
  })), /*#__PURE__*/React.createElement("div", {
    title: props.t('Template used to generate or validate identifier values.', {
      ns: 'configuration'
    })
  }, /*#__PURE__*/React.createElement(Form_1.TextboxElement, {
    label: props.t('Format', {
      ns: 'configuration'
    }),
    id: "".concat(fieldPrefix, "-format"),
    name: "format",
    value: values.format,
    onUserInput: updateValue
  })), /*#__PURE__*/React.createElement("div", {
    title: props.t('Whether candidates using this identifier type must have at least' + ' one value', {
      ns: 'configuration'
    })
  }, /*#__PURE__*/React.createElement(Form_1.CheckboxElement, {
    label: props.t('Required', {
      ns: 'configuration'
    }),
    id: "".concat(fieldPrefix, "-required"),
    name: "isRequired",
    value: values.isRequired,
    onUserInput: updateValue
  })), /*#__PURE__*/React.createElement("div", {
    title: props.t('Whether identifier values must be unique across candidates', {
      ns: 'configuration'
    })
  }, /*#__PURE__*/React.createElement(Form_1.CheckboxElement, {
    label: props.t('Unique', {
      ns: 'configuration'
    }),
    id: "".concat(fieldPrefix, "-unique"),
    name: "isUnique",
    value: values.isUnique,
    onUserInput: updateValue
  })), /*#__PURE__*/React.createElement("div", {
    title: props.t('Whether LORIS generates the value automatically from the format', {
      ns: 'configuration'
    })
  }, /*#__PURE__*/React.createElement(Form_1.CheckboxElement, {
    label: props.t('Auto Generate', {
      ns: 'configuration'
    }),
    id: "".concat(fieldPrefix, "-auto-generate"),
    name: "autoGenerate",
    value: values.autoGenerate,
    onUserInput: updateValue
  })), /*#__PURE__*/React.createElement("div", {
    title: props.t('Whether a candidate can have more than one value of this type', {
      ns: 'configuration'
    })
  }, /*#__PURE__*/React.createElement(Form_1.CheckboxElement, {
    label: props.t('Allow Multiple', {
      ns: 'configuration'
    }),
    id: "".concat(fieldPrefix, "-allow-multiple"),
    name: "allowMultiple",
    value: values.allowMultiple,
    onUserInput: updateValue
  })), /*#__PURE__*/React.createElement("div", {
    title: props.t('Projects in which this identifier type can be used. An identifier' + ' type can be associated with multiple projects.', {
      ns: 'configuration'
    })
  }, /*#__PURE__*/React.createElement(Form_1.SelectElement, {
    label: props.t('Projects', {
      ns: 'configuration'
    }),
    id: "".concat(fieldPrefix, "-projects"),
    name: "projectIDs",
    multiple: true,
    value: values.projectIDs,
    onUserInput: updateValue,
    options: props.projects,
    emptyOption: false,
    autoSelect: false,
    sortByValue: false
  })), /*#__PURE__*/React.createElement(Form_1.ButtonElement, {
    label: props.t('Save', {
      ns: 'loris'
    }),
    disabled: saving,
    id: "save-identifier-type-".concat(props.identifierTypeID),
    type: "submit",
    onUserInput: submit
  }), /*#__PURE__*/React.createElement(Form_1.ButtonElement, {
    label: props.t('Reset', {
      ns: 'loris'
    }),
    buttonClass: "btn btn-default",
    type: "button",
    onUserInput: function onUserInput() {
      setValues(__assign({}, defaults));
      setStatus(null);
    }
  }), status && /*#__PURE__*/React.createElement("div", {
    className: "col-sm-offset-3 col-sm-9"
  }, /*#__PURE__*/React.createElement("label", {
    className: status.type === 'success' ? 'text-success' : 'text-danger'
  }, status.message))));
}
/**
 * React candidate identifier type manager.
 *
 * @param {IdentifierTypeManagerProps} props Page properties
 * @return {React.ReactElement}
 */
function IdentifierTypeManager(props) {
  var _a = __read((0, react_1.useState)(props.data.identifierTypes), 2),
    identifierTypes = _a[0],
    setIdentifierTypes = _a[1];
  /**
   * Update the displayed name after saving.
   *
   * @param {string} id Identifier type ID
   * @param {IdentifierTypeValues} values Updated form values
   */
  var updateIdentifierType = function updateIdentifierType(id, values) {
    setIdentifierTypes(function (current) {
      var _a;
      return __assign(__assign({}, current), (_a = {}, _a[id] = __assign(__assign({}, current[id]), values), _a));
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, props.t('Use this page to manage the configuration of existing candidate' + ' identifier types, or to add a new one.', {
    ns: 'configuration'
  })), /*#__PURE__*/React.createElement(Tabs_1.VerticalTabs, {
    tabs: __spreadArray([{
      id: 'identifier-type-new',
      label: props.t('New Identifier Type', {
        ns: 'configuration'
      })
    }], __read(Object.entries(identifierTypes).map(function (_a) {
      var _b = __read(_a, 2),
        id = _b[0],
        identifierType = _b[1];
      return {
        id: "identifier-type-".concat(id),
        label: identifierType.name
      };
    })), false),
    defaultTab: "identifier-type-new",
    updateURL: false
  }, Object.entries(identifierTypes).map(function (_a) {
    var _b = __read(_a, 2),
      id = _b[0],
      identifierType = _b[1];
    return /*#__PURE__*/React.createElement(Tabs_1.TabPane, {
      TabId: "identifier-type-".concat(id),
      key: id
    }, /*#__PURE__*/React.createElement("h2", null, identifierType.name, " (ID: ", id, ")"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(IdentifierTypeForm, {
      identifierType: identifierType,
      identifierTypeID: id,
      isNew: false,
      projects: props.data.projects,
      onSaved: updateIdentifierType,
      t: props.t
    }));
  }), /*#__PURE__*/React.createElement(Tabs_1.TabPane, {
    TabId: "identifier-type-new"
  }, /*#__PURE__*/React.createElement("h2", null, props.t('New Identifier Type', {
    ns: 'configuration'
  })), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(IdentifierTypeForm, {
    identifierType: EMPTY_IDENTIFIER_TYPE,
    identifierTypeID: "new",
    isNew: true,
    projects: props.data.projects,
    onSaved: function onSaved() {
      return undefined;
    },
    t: props.t
  }))));
}
/**
 * Load identifier type data and render the manager.
 *
 * @param {WithTranslation} props Translation properties
 * @return {React.ReactElement}
 */
function IdentifierTypePage(props) {
  var _a = __read((0, react_1.useState)(null), 2),
    data = _a[0],
    setData = _a[1];
  var _b = __read((0, react_1.useState)(false), 2),
    error = _b[0],
    setError = _b[1];
  (0, react_1.useEffect)(function () {
    var dataURL = new URL(window.location.href);
    dataURL.searchParams.set('format', 'json');
    new StudyEntitiesClient_1["default"]('configuration').getById(dataURL.toString()).then(function (responseData) {
      setData(responseData);
    })["catch"](function () {
      return setError(true);
    });
  }, []);
  if (error) {
    return /*#__PURE__*/React.createElement("h3", null, props.t('An error occurred while loading the page.', {
      ns: 'loris'
    }));
  }
  if (data === null) {
    return /*#__PURE__*/React.createElement(Loader_1["default"], null);
  }
  return /*#__PURE__*/React.createElement(IdentifierTypeManager, {
    data: data,
    t: props.t
  });
}
window.addEventListener('load', function () {
  I18nSetup_1["default"].addResourceBundle('ja', 'configuration', configuration_json_1["default"]);
  I18nSetup_1["default"].addResourceBundle('fr', 'configuration', configuration_json_2["default"]);
  I18nSetup_1["default"].addResourceBundle('zh', 'configuration', configuration_json_3["default"]);
  var workspace = document.getElementById('lorisworkspace');
  if (workspace === null) {
    throw new Error('Could not find lorisworkspace root');
  }
  var Page = (0, react_i18next_1.withTranslation)(['configuration', 'loris'])(IdentifierTypePage);
  (0, client_1.createRoot)(workspace).render(/*#__PURE__*/React.createElement(Page, null));
});
exports["default"] = (0, react_i18next_1.withTranslation)(['configuration', 'loris'])(IdentifierTypePage);
})();

((window.lorisjs = window.lorisjs || {}).configuration = window.lorisjs.configuration || {}).formCandidateIdentifierTypes = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=formCandidateIdentifierTypes.js.map