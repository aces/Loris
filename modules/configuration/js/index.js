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
exports["default"] = exports.TimeElement = exports.TextboxElement = exports.TextareaElement = exports.TagsElement = exports.StaticElement = exports.SliderElement = exports.SelectElement = exports.SearchableDropdown = exports.RadioElement = exports.PasswordElement = exports.NumericElement = exports.LorisElement = exports.LinkElement = exports.HeaderElement = exports.FormElement = exports.FileElement = exports.FieldsetElement = exports.EmailElement = exports.DateTimeElement = exports.DateElement = exports.CheckboxElement = exports.CTA = exports.ButtonElement = void 0;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js"));
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js"));
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
        optionList = Object.keys(newOptions).sort().map(function (option) {
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
  label: _propTypes["default"].string,
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
      // eslint-disable-next-line react/prop-types
      var onUserBlur = this.props.onUserBlur;
      if (typeof onUserBlur === 'function') {
        onUserBlur(this.props.name, e.target.value);
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
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "row form-group"
      }, /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label,
        required: this.props.required
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-9"
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
  label: _propTypes["default"].string,
  value: _propTypes["default"].string,
  placeholder: _propTypes["default"].string,
  id: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  required: _propTypes["default"].bool,
  rows: _propTypes["default"].number,
  cols: _propTypes["default"].number,
  onUserInput: _propTypes["default"].func
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
      var elementClass = 'row form-group';

      // Add error message
      if (this.props.errorMessage) {
        errorMessage = /*#__PURE__*/_react["default"].createElement("span", null, this.props.errorMessage);
        elementClass = 'row form-group has-error';
      }

      // Label prop needs to be provided to render label
      // (including empty label i.e. <TextboxElement label='' />)
      // and retain formatting. If label prop is not provided at all, the input
      // element will take up the whole row.
      var inputClass = this.props["class"];
      if (this.props.label || this.props.label == '') {
        inputClass = "col-sm-".concat(this.props.labelPlacementTop ? '12' : '9');
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: elementClass,
        style: this.props.labelPlacementTop ? {
          display: 'flex',
          flexDirection: 'column'
        } : {}
      }, (this.props.label || this.props.label == '') && /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label,
        required: this.props.required,
        fullWidth: this.props.labelPlacementTop
      }), /*#__PURE__*/_react["default"].createElement("div", {
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
  label: _propTypes["default"].string,
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
      var elementClass = 'row form-group';

      // Add error message
      if (this.props.errorMessage) {
        errorMessage = /*#__PURE__*/_react["default"].createElement("span", null, this.props.errorMessage);
        elementClass = 'row form-group has-error';
      }

      // Label prop needs to be provided to render label
      // (including empty label i.e. <TextboxElement label='' />)
      // and retain formatting. If label prop is not provided at all, the input
      // element will take up the whole row.
      var inputClass = this.props["class"];
      if (this.props.label || this.props.label == '') {
        inputClass = 'col-sm-9';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: elementClass
      }, (this.props.label || this.props.label == '') && /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label,
        required: this.props.required
      }), /*#__PURE__*/_react["default"].createElement("div", {
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
  label: _propTypes["default"].string,
  value: _propTypes["default"].string,
  id: _propTypes["default"].string,
  "class": _propTypes["default"].string,
  placeholder: _propTypes["default"].string,
  autoComplete: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  required: _propTypes["default"].bool,
  errorMessage: _propTypes["default"].string,
  onUserInput: _propTypes["default"].func,
  onUserBlur: _propTypes["default"].func
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
  onUserBlur: function onUserBlur() {}
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
 * Time Component
 * React wrapper for a <input type="time"> element.
 */
var TimeElement = exports.TimeElement = /*#__PURE__*/function (_Component1) {
  (0, _inherits2["default"])(TimeElement, _Component1);
  var _super1 = _createSuper(TimeElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function TimeElement(props) {
    var _this10;
    (0, _classCallCheck2["default"])(this, TimeElement);
    _this10 = _super1.call(this, props);
    _this10.handleChange = _this10.handleChange.bind((0, _assertThisInitialized2["default"])(_this10));
    return _this10;
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
var DateTimeElement = exports.DateTimeElement = /*#__PURE__*/function (_Component10) {
  (0, _inherits2["default"])(DateTimeElement, _Component10);
  var _super10 = _createSuper(DateTimeElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function DateTimeElement(props) {
    var _this11;
    (0, _classCallCheck2["default"])(this, DateTimeElement);
    _this11 = _super10.call(this, props);
    _this11.handleChange = _this11.handleChange.bind((0, _assertThisInitialized2["default"])(_this11));
    return _this11;
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
var NumericElement = exports.NumericElement = /*#__PURE__*/function (_Component11) {
  (0, _inherits2["default"])(NumericElement, _Component11);
  var _super11 = _createSuper(NumericElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function NumericElement(props) {
    var _this12;
    (0, _classCallCheck2["default"])(this, NumericElement);
    _this12 = _super11.call(this, props);
    _this12.handleChange = _this12.handleChange.bind((0, _assertThisInitialized2["default"])(_this12));
    return _this12;
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
 * File Component
 * React wrapper for a simple or 'multiple' <input type="file"> element.
 */
var FileElement = /*#__PURE__*/function (_Component12) {
  (0, _inherits2["default"])(FileElement, _Component12);
  var _super12 = _createSuper(FileElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function FileElement(props) {
    var _this13;
    (0, _classCallCheck2["default"])(this, FileElement);
    _this13 = _super12.call(this, props);
    _this13.handleChange = _this13.handleChange.bind((0, _assertThisInitialized2["default"])(_this13));
    return _this13;
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
var StaticElement = exports.StaticElement = /*#__PURE__*/function (_Component13) {
  (0, _inherits2["default"])(StaticElement, _Component13);
  var _super13 = _createSuper(StaticElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function StaticElement(props) {
    (0, _classCallCheck2["default"])(this, StaticElement);
    return _super13.call(this, props);
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
var HeaderElement = exports.HeaderElement = /*#__PURE__*/function (_Component14) {
  (0, _inherits2["default"])(HeaderElement, _Component14);
  var _super14 = _createSuper(HeaderElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function HeaderElement(props) {
    (0, _classCallCheck2["default"])(this, HeaderElement);
    return _super14.call(this, props);
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
var LinkElement = exports.LinkElement = /*#__PURE__*/function (_Component15) {
  (0, _inherits2["default"])(LinkElement, _Component15);
  var _super15 = _createSuper(LinkElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function LinkElement(props) {
    (0, _classCallCheck2["default"])(this, LinkElement);
    return _super15.call(this, props);
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
  var _super16 = _createSuper(CheckboxElement);
  /**
   * @constructor
   */
  function CheckboxElement() {
    var _this14;
    (0, _classCallCheck2["default"])(this, CheckboxElement);
    _this14 = _super16.call(this);
    _this14.handleChange = _this14.handleChange.bind((0, _assertThisInitialized2["default"])(_this14));
    return _this14;
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
var ButtonElement = exports.ButtonElement = /*#__PURE__*/function (_Component16) {
  (0, _inherits2["default"])(ButtonElement, _Component16);
  var _super17 = _createSuper(ButtonElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function ButtonElement(props) {
    var _this15;
    (0, _classCallCheck2["default"])(this, ButtonElement);
    _this15 = _super17.call(this, props);
    _this15.handleClick = _this15.handleClick.bind((0, _assertThisInitialized2["default"])(_this15));
    return _this15;
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
var CTA = exports.CTA = /*#__PURE__*/function (_Component17) {
  (0, _inherits2["default"])(CTA, _Component17);
  var _super18 = _createSuper(CTA);
  function CTA() {
    (0, _classCallCheck2["default"])(this, CTA);
    return _super18.apply(this, arguments);
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
var LorisElement = exports.LorisElement = /*#__PURE__*/function (_Component18) {
  (0, _inherits2["default"])(LorisElement, _Component18);
  var _super19 = _createSuper(LorisElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function LorisElement(props) {
    (0, _classCallCheck2["default"])(this, LorisElement);
    return _super19.call(this, props);
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
        case 'time':
          elementHtml = /*#__PURE__*/_react["default"].createElement(TimeElement, elementProps);
          break;
        case 'numeric':
          elementHtml = /*#__PURE__*/_react["default"].createElement(NumericElement, elementProps);
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
  var _super20 = _createSuper(RadioElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function RadioElement(props) {
    var _this16;
    (0, _classCallCheck2["default"])(this, RadioElement);
    _this16 = _super20.call(this, props);
    _this16.handleChange = _this16.handleChange.bind((0, _assertThisInitialized2["default"])(_this16));
    _this16.generateLayout = _this16.generateLayout.bind((0, _assertThisInitialized2["default"])(_this16));
    return _this16;
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
      var elementClass = this.props.elementClass;
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
        elementClass = this.props.elementClass + ' has-error';
      }
      // Generate layout
      var layout = this.generateLayout();
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: elementClass
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: 'col-sm-3 control-label'
      }, this.props.label, errorMessage, requiredHTML), /*#__PURE__*/_react["default"].createElement("div", {
        className: 'col-sm-9'
      }, layout));
    }
  }]);
  return RadioElement;
}(_react["default"].Component);
RadioElement.propTypes = {
  name: _propTypes["default"].string.isRequired,
  label: _propTypes["default"].string,
  options: _propTypes["default"].object.isRequired,
  disabled: _propTypes["default"].bool,
  required: _propTypes["default"].bool,
  vertical: _propTypes["default"].bool,
  checked: _propTypes["default"].string.isRequired,
  errorMessage: _propTypes["default"].string,
  elementClass: _propTypes["default"].string,
  onUserInput: _propTypes["default"].func
};
RadioElement.defaultProps = {
  disabled: false,
  required: false,
  vertical: false,
  errorMessage: null,
  elementClass: 'row form-group',
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
  var _super21 = _createSuper(SliderElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function SliderElement(props) {
    var _this17;
    (0, _classCallCheck2["default"])(this, SliderElement);
    _this17 = _super21.call(this, props);
    _this17.handleChange = _this17.handleChange.bind((0, _assertThisInitialized2["default"])(_this17));
    return _this17;
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
  TimeElement: TimeElement,
  DateTimeElement: DateTimeElement,
  NumericElement: NumericElement,
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
 * @returns The corresponding React element
 */
var InputLabel = function InputLabel(_a) {
  var label = _a.label,
    required = _a.required,
    fullWidth = _a.fullWidth;
  return /*#__PURE__*/React.createElement("label", {
    className: "col-sm-".concat(fullWidth ? '12' : '3', " control-label"),
    htmlFor: label,
    style: fullWidth ? {
      textAlign: 'left'
    } : {}
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*"));
};
exports["default"] = InputLabel;

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

/***/ "./node_modules/sweetalert2/dist/sweetalert2.all.js"
/*!**********************************************************!*\
  !*** ./node_modules/sweetalert2/dist/sweetalert2.all.js ***!
  \**********************************************************/
(module) {

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
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!*********************************************!*\
  !*** ./modules/configuration/jsx/index.tsx ***!
  \*********************************************/


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
var sweetalert2_1 = __importDefault(__webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js"));
var Form_1 = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");
var DATA_TYPE_OPTIONS = {
  date_format: 'dateFormat',
  instrument: 'instruments',
  log_level: 'logLevels',
  lookup_center: 'lookupCenter',
  scan_type: 'scanTypes'
};
/**
 * Intro text for the configuration page.
 *
 * @param {BaseURLProps} props React props
 * @return {JSX}
 */
function IntroText(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Please enter the various configuration variables into the fields below. For information on how to configure LORIS, please refer to the Help section and/or the Developer's guide."), /*#__PURE__*/React.createElement("p", null, "To configure study cohorts\xA0", /*#__PURE__*/React.createElement("a", {
    href: "".concat(props.baseURL, "/configuration/cohort/")
  }, "click here"), ". \xA0To configure study projects\xA0", /*#__PURE__*/React.createElement("a", {
    href: "".concat(props.baseURL, "/configuration/project/")
  }, "click here"), "."), /*#__PURE__*/React.createElement("p", null, "To configure the diagnosis trajectory of the study\xA0", /*#__PURE__*/React.createElement("a", {
    href: "".concat(props.baseURL, "/configuration/diagnosis_evolution/")
  }, "click here"), "."));
}
/**
 * Category navigation.
 *
 * @param {CategorySelectionProps} props React props
 * @return {JSX}
 */
function CategorySelection(props) {
  var categories = props.categories.map(function (item) {
    return /*#__PURE__*/React.createElement("li", {
      key: item.Name,
      className: item.Name === props.active ? 'active' : ''
    }, /*#__PURE__*/React.createElement("a", {
      href: "#".concat(item.Name),
      onClick: function onClick(e) {
        e.preventDefault();
        props.setActive(item.Name);
      }
    }, item.Label));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "nav nav-pills nav-stacked",
    role: "tablist"
  }, categories));
}
/**
 * Render the development-only config name.
 *
 * @param {DevNameProps} props React props
 * @return {?JSX}
 */
function DevName(props) {
  if (!props.enabled) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "config-dev-name pull-right"
  }, /*#__PURE__*/React.createElement("i", null, props.name));
}
/**
 * Category body.
 *
 * @param {CategoryDisplayProps} props React props
 * @return {JSX}
 */
function CategoryDisplay(props) {
  var rows = props.items.map(function (item) {
    return /*#__PURE__*/React.createElement(ItemDisplay, {
      key: item.ID,
      baseURL: props.baseURL,
      item: item,
      options: props.options,
      reloadCategory: props.reloadCategory
    });
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "col-md-9"
  }, rows);
}
/**
 * Single configuration setting.
 *
 * @param {ItemDisplayProps} props React props
 * @return {JSX}
 */
function ItemDisplay(props) {
  var item = props.item;
  if (item.AllowMultiple) {
    return /*#__PURE__*/React.createElement(MultiValueInput, {
      baseURL: props.baseURL,
      item: item,
      options: props.options,
      reloadCategory: props.reloadCategory
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    title: item.Description
  }, /*#__PURE__*/React.createElement(SingleValueInput, {
    baseURL: props.baseURL,
    item: item,
    options: props.options,
    reloadCategory: props.reloadCategory
  }), /*#__PURE__*/React.createElement(DevName, {
    enabled: props.options.sandbox,
    name: item.Name
  }));
}
/**
 * Single-value configuration input.
 *
 * @param {ItemDisplayProps} props React props
 * @return {JSX}
 */
function SingleValueInput(props) {
  var _a = __read((0, react_1.useState)(props.item.Value), 2),
    value = _a[0],
    setValue = _a[1];
  (0, react_1.useEffect)(function () {
    setValue(props.item.Value);
  }, [props.item.Value]);
  /**
   * Persist a changed setting value.
   *
   * @param {string} newValue New setting value
   */
  var saveChange = function saveChange(newValue) {
    if (newValue === props.item.Value) {
      return;
    }
    saveSetting(props.baseURL, props.item.Name, {
      value: newValue
    }).then(function () {
      return props.reloadCategory();
    })["catch"](showSaveError);
  };
  return renderInput({
    dataType: props.item.DataType,
    disabled: props.item.Disabled,
    label: props.item.Label,
    name: props.item.Name,
    onChange: setValue,
    onCommit: saveChange,
    options: props.options,
    value: value
  });
}
/**
 * Multi-value configuration input.
 *
 * @param {ItemDisplayProps} props React props
 * @return {JSX}
 */
function MultiValueInput(props) {
  var values = Array.isArray(props.item.Value) ? props.item.Value.map(String) : [];
  var _a = __read((0, react_1.useState)(false), 2),
    isAdding = _a[0],
    setIsAdding = _a[1];
  /**
   * Persist the full list of values for a multi-value setting.
   *
   * @param {string[]} newValues New setting values
   */
  var saveValues = function saveValues(newValues) {
    saveSetting(props.baseURL, props.item.Name, {
      values: newValues
    }).then(function () {
      setIsAdding(false);
      props.reloadCategory();
    })["catch"](showSaveError);
  };
  var rows = values.map(function (value, idx) {
    return /*#__PURE__*/React.createElement(MultiValueRow, {
      dataType: props.item.DataType,
      disabled: props.item.Disabled,
      key: "".concat(props.item.Name, "-").concat(idx),
      name: props.item.Name,
      onRemove: function onRemove() {
        return saveValues(values.filter(function (_el, i) {
          return i !== idx;
        }));
      },
      onSave: function onSave(newValue) {
        var newValues = __spreadArray([], __read(values), false);
        newValues[idx] = newValue;
        saveValues(newValues);
      },
      options: props.options,
      value: value
    });
  });
  if (isAdding) {
    rows.push(/*#__PURE__*/React.createElement(MultiValueRow, {
      dataType: props.item.DataType,
      disabled: props.item.Disabled,
      key: "".concat(props.item.Name, "-new"),
      name: props.item.Name,
      onRemove: function onRemove() {
        return setIsAdding(false);
      },
      onSave: function onSave(newValue) {
        return saveValues(__spreadArray(__spreadArray([], __read(values), false), [newValue], false));
      },
      options: props.options,
      value: ""
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    title: props.item.Description
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-sm-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "col-sm-12 control-label config-name"
  }, props.item.Label), /*#__PURE__*/React.createElement(DevName, {
    enabled: props.options.sandbox,
    name: props.item.Name
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-sm-9"
  }, rows, !isAdding && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-success add",
    disabled: props.item.Disabled,
    onClick: function onClick() {
      return setIsAdding(true);
    },
    type: "button"
  }, /*#__PURE__*/React.createElement("span", {
    className: "glyphicon glyphicon-plus"
  }), " Add field")));
}
/**
 * One row in a multi-value input.
 *
 * @param {MultiValueRowProps} props React props
 * @return {JSX}
 */
function MultiValueRow(_a) {
  var dataType = _a.dataType,
    disabled = _a.disabled,
    name = _a.name,
    onRemove = _a.onRemove,
    onSave = _a.onSave,
    options = _a.options,
    _b = _a.value,
    initialValue = _b === void 0 ? '' : _b;
  var _c = __read((0, react_1.useState)(initialValue), 2),
    value = _c[0],
    setValue = _c[1];
  (0, react_1.useEffect)(function () {
    setValue(initialValue);
  }, [initialValue]);
  return /*#__PURE__*/React.createElement("div", {
    className: "input-group entry"
  }, renderInput({
    dataType: dataType,
    disabled: disabled,
    label: '',
    name: name,
    onChange: setValue,
    onCommit: onSave,
    options: options,
    value: value
  }), /*#__PURE__*/React.createElement("div", {
    className: "input-group-btn"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger btn-remove",
    disabled: disabled,
    onClick: onRemove,
    type: "button"
  }, /*#__PURE__*/React.createElement("span", {
    className: "glyphicon glyphicon-remove"
  }), "\xA0")));
}
/**
 * Render the proper form element for a config data type.
 *
 * @param {RenderInputConfig} config Render config
 * @return {JSX}
 */
function renderInput(config) {
  var _a;
  var value = String((_a = config.value) !== null && _a !== void 0 ? _a : '');
  switch (config.dataType) {
    case 'boolean':
      return /*#__PURE__*/React.createElement(Form_1.RadioElement, {
        checked: booleanRadioValue(config.value),
        disabled: config.disabled,
        label: config.label,
        name: config.name,
        onUserInput: function onUserInput(_name, inputValue) {
          config.onCommit(inputValue);
        },
        options: booleanRadioOptions(config.value)
      });
    case 'date_format':
    case 'instrument':
    case 'log_level':
    case 'lookup_center':
    case 'scan_type':
      return /*#__PURE__*/React.createElement(Form_1.SelectElement, {
        disabled: config.disabled,
        label: config.label,
        name: config.name,
        onUserInput: function onUserInput(_name, inputValue) {
          config.onCommit(inputValue);
        },
        options: config.options[DATA_TYPE_OPTIONS[config.dataType]],
        value: value
      });
    case 'email':
      return /*#__PURE__*/React.createElement(Form_1.EmailElement, {
        disabled: config.disabled,
        label: config.label,
        name: config.name,
        onUserBlur: function onUserBlur(_name, inputValue) {
          config.onCommit(inputValue);
        },
        onUserInput: function onUserInput(_name, inputValue) {
          config.onChange(inputValue);
        },
        value: value
      });
    case 'textarea':
      return /*#__PURE__*/React.createElement(Form_1.TextareaElement, {
        disabled: config.disabled,
        label: config.label,
        name: config.name,
        onUserBlur: function onUserBlur(_name, inputValue) {
          config.onCommit(inputValue);
        },
        onUserInput: function onUserInput(_name, inputValue) {
          config.onChange(inputValue);
        },
        value: value
      });
    case 'path':
    case 'text':
    case 'web_path':
      return /*#__PURE__*/React.createElement(Form_1.TextboxElement, {
        disabled: config.disabled,
        label: config.label,
        name: config.name,
        onUserBlur: function onUserBlur(_name, inputValue) {
          config.onCommit(inputValue);
        },
        onUserInput: function onUserInput(_name, inputValue) {
          config.onChange(inputValue);
        },
        value: value
      });
    default:
      return /*#__PURE__*/React.createElement("div", {
        className: "text-danger"
      }, "Unsupported type ", config.dataType);
  }
}
/**
 * Return the radio value matching the stored boolean representation.
 *
 * @param {ConfigValue} value Stored boolean value
 * @return {string}
 */
function booleanRadioValue(value) {
  if (value === '1' || value === 1) {
    return '1';
  }
  if (value === '0' || value === 0) {
    return '0';
  }
  if (value === true || value === 'true') {
    return 'true';
  }
  return 'false';
}
/**
 * Preserve legacy 1/0 boolean storage when a setting already uses it.
 *
 * @param {ConfigValue} value Stored boolean value
 * @return {object}
 */
function booleanRadioOptions(value) {
  if (value === '1' || value === '0' || value === 1 || value === 0) {
    return {
      '1': 'Yes',
      '0': 'No'
    };
  }
  return {
    'true': 'Yes',
    'false': 'No'
  };
}
/**
 * Save a configuration setting.
 *
 * @param {string} baseURL LORIS base URL
 * @param {string} setting Setting name
 * @param {object} payload JSON payload
 * @return {Promise<void>}
 */
function saveSetting(baseURL, setting, payload) {
  return fetch("".concat(baseURL, "/configuration/setting/").concat(setting), {
    body: JSON.stringify(__assign({
      setting: setting
    }, payload)),
    credentials: 'same-origin',
    method: 'PUT'
  }).then(function (resp) {
    if (!resp.ok) {
      throw new Error("Could not save ".concat(setting));
    }
    return resp.json();
  }).then(function () {
    void sweetalert2_1["default"].fire('Success!', "Successfully saved ".concat(setting), 'success');
  });
}
/**
 * Show save errors consistently.
 *
 * @param {Error} error Error object
 * @return {void}
 */
function showSaveError(error) {
  void sweetalert2_1["default"].fire('Error', error.toString(), 'error');
}
/**
 * Entrypoint for the configuration module.
 *
 * @param {BaseURLProps} props React props
 * @return {JSX}
 */
function ConfigurationIndex(props) {
  var _a = __read((0, react_1.useState)(''), 2),
    activeCategory = _a[0],
    setActiveCategory = _a[1];
  var _b = __read((0, react_1.useState)([]), 2),
    categories = _b[0],
    setCategories = _b[1];
  var _c = __read((0, react_1.useState)([]), 2),
    categoryItems = _c[0],
    setCategoryItems = _c[1];
  var _d = __read((0, react_1.useState)({
      dateFormat: {},
      instruments: {},
      logLevels: {},
      lookupCenter: {},
      sandbox: false,
      scanTypes: {}
    }), 2),
    options = _d[0],
    setOptions = _d[1];
  var _e = __read((0, react_1.useState)(0), 2),
    reloadKey = _e[0],
    setReloadKey = _e[1];
  (0, react_1.useEffect)(function () {
    fetch("".concat(props.baseURL, "/configuration/categories"), {
      credentials: 'same-origin'
    }).then(function (resp) {
      if (!resp.ok) {
        throw new Error('Could not retrieve configuration categories');
      }
      return resp.json();
    }).then(function (data) {
      setCategories(data.categories);
      setOptions({
        dateFormat: data.dateFormat,
        instruments: data.instruments,
        logLevels: data.logLevels,
        lookupCenter: data.lookupCenter,
        sandbox: data.sandbox,
        scanTypes: data.scanTypes
      });
      if (data.categories.length > 0) {
        setActiveCategory(data.categories[0].Name);
      }
    })["catch"](function (error) {
      showSaveError(error);
    });
  }, [props.baseURL]);
  (0, react_1.useEffect)(function () {
    if (activeCategory === '') {
      return;
    }
    fetch("".concat(props.baseURL, "/configuration/categories/").concat(activeCategory), {
      credentials: 'same-origin'
    }).then(function (resp) {
      if (!resp.ok) {
        throw new Error("Could not retrieve category ".concat(activeCategory));
      }
      return resp.json();
    }).then(function (data) {
      setCategoryItems(data.category);
    })["catch"](function (error) {
      showSaveError(error);
    });
  }, [activeCategory, props.baseURL, reloadKey]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(IntroText, {
    baseURL: props.baseURL
  }), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement(CategorySelection, {
    active: activeCategory,
    categories: categories,
    setActive: setActiveCategory
  }), /*#__PURE__*/React.createElement(CategoryDisplay, {
    baseURL: props.baseURL,
    items: categoryItems,
    options: options,
    reloadCategory: function reloadCategory() {
      return setReloadKey(function (current) {
        return current + 1;
      });
    }
  })));
}
window.addEventListener('load', function () {
  var workspace = document.getElementById('lorisworkspace');
  if (workspace === null) {
    throw new Error('Could not find lorisworkspace root');
  }
  var root = (0, client_1.createRoot)(workspace);
  root.render(/*#__PURE__*/React.createElement(ConfigurationIndex, {
    baseURL: loris.BaseURL
  }));
});
})();

((window.lorisjs = window.lorisjs || {}).configuration = window.lorisjs.configuration || {}).index = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map