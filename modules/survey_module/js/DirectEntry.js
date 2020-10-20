window["lorisjs"] = window["lorisjs"] || {}; window["lorisjs"]["survey_module"] = window["lorisjs"]["survey_module"] || {}; window["lorisjs"]["survey_module"]["DirectEntry"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(11);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(13);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(15);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _DirectEntryForm__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(16);









function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7___default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7___default()(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6___default()(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/* eslint-disable */

/**
 * This file contains React component for Direct Data Entry
 *
 * @author Jordan Stirling (StiringApps ltd.)
 * @version 0.0.1
 *
 */

/**
 * Panel component
 * Wraps children in a collapsible bootstrap panel
 */


var DirectEntry = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(DirectEntry, _React$Component);

  var _super = _createSuper(DirectEntry);

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(DirectEntry, null, [{
    key: "FindSelects",
    value: function FindSelects(root) {
      var _ref;

      return (_ref = []).concat.apply(_ref, _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1___default()(root)).filter(function (i) {
        return i.Type == 'select' || i.Type == 'ElementGroup';
      }).reduce(function (memo, i) {
        if (i.Type == 'select') {
          memo[i.Name] = i.Options.Values;
        } else {
          Object.assign(memo, DirectEntry.FindSelects(i.Elements));
        }

        return memo;
      }, {});
    }
  }]);

  function DirectEntry(props) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, DirectEntry);

    _this = _super.call(this, props);
    var height = window.innerHeight / 3;
    var style = {
      'margin-top': height
    };
    var page = -1;
    var url = window.location;

    if (!window.location.origin) {
      url.origin = url.protocol + '//' + url.hostname + (url.port ? ':' + url.port : '');
    }

    _this.nextPage = _this.nextPage.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this));
    _this.prevPage = _this.prevPage.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this));
    _this.updateAnswer = _this.updateAnswer.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this));
    _this.setupPageValues = _this.setupPageValues.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this));
    _this.submit = _this.submit.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this));
    _this.state = {
      style: style,
      page: page,
      values: {},
      errors: {},
      InstrumentJSON: {},
      completionStats: {
        total: 0,
        completed: 0
      },
      api_url: url.origin + '/survey_module/ajax/survey_api.php' + url.search,
      submitState: 0 // 0 = not submitted, 1 = successfull submit, 2 = already submitted, 3 = error in form submit

    };
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(DirectEntry, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      $.ajax({
        url: this.state.api_url,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
          var InstrumentJSON = JSON.parse(data.InstrumentJSON);
          var Values = JSON.parse(data.Values);
          var page = -1;

          if (InstrumentJSON.Elements[0].Type === 'ElementGroup' && InstrumentJSON.Elements[0].GroupType === 'Page') {
            // The following Instrument has pages
            page = 0;
          }

          var total = 0;
          var completed = 0;

          for (var key in Values) {
            if (Values[key] != null && Values[key] != '') {
              completed++;
            }

            total++;
          }

          this.setState({
            values: Values,
            InstrumentJSON: InstrumentJSON,
            page: page,
            completionStats: {
              total: total,
              completed: completed
            }
          }, this.setupPageValues.bind(this, page));
        }.bind(this)
      }).fail(function (responseData) {
        // TODO display error to user
        console.log(responseData.status);

        if (responseData.status == '403') {
          _this2.setState({
            submitState: 2
          });
        }
      });
    }
  }, {
    key: "setupPageValues",
    value: function setupPageValues(page) {
      if (page >= this.state.InstrumentJSON.Elements.length) {
        // on review page, dont need to set up page values
        return;
      }

      var pageElements = this.state.InstrumentJSON.Elements[page].Elements;
      var pageValues = {};

      for (var i = 0; i < pageElements.length; i++) {
        var name = this.getElementName(pageElements[i]);

        if (name instanceof Array) {
          for (var j = 0; j < name.length; j++) {
            if (name[j] in this.state.values) {
              pageValues[name[j]] = this.state.values[name[j]];
            }
          }
        } else if (name in this.state.values) {
          pageValues[name] = this.state.values[name];
        }
      }

      this.setState({
        pageValues: pageValues
      });
    }
  }, {
    key: "getElementName",
    value: function getElementName(element) {
      var name;

      if (element.Type === 'ElementGroup') {
        name = [];

        for (var i = 0; i < element.Elements.length; i++) {
          name.push(this.getElementName(element.Elements[i]));
        }
      } else {
        name = element.Name;
      }

      return name;
    }
  }, {
    key: "removeHeaderTags",
    value: function removeHeaderTags(str) {
      if (typeof str == 'string') {
        return str.replace(/<h.>/g, '').replace(/<\/h.>/g, '');
      } else {
        return '';
      }
    }
  }, {
    key: "nextPage",
    value: function nextPage() {
      var _this3 = this;

      var page = 0;
      var finalPage = false;

      if (this.state.page != 0) {
        page = this.state.InstrumentJSON.Elements[this.state.page].Subtest;
      }

      var data = {
        'data': this.state.pageValues,
        'page': page
      };
      var that = this;

      if (this.state.page === this.state.InstrumentJSON.Elements.length - 1) {
        data['FinalPage'] = true;
        finalPage = true;
      }

      $.ajax({
        url: this.state.api_url,
        data: JSON.stringify(data),
        type: 'PUT',
        contentType: 'application/json',
        success: function success(result) {
          var page = that.state.page + 1;
          var InstrumentJSON;
          var reviewPage;

          if (finalPage) {
            InstrumentJSON = that.state.InstrumentJSON;
            reviewPage = JSON.parse(result);
          } else {
            InstrumentJSON = JSON.parse(result);
          }

          if (reviewPage != undefined) {
            var selects = DirectEntry.FindSelects(InstrumentJSON.Elements.map(function (i) {
              return i.Elements;
            }));

            var _iterator = _createForOfIteratorHelper(reviewPage.questions),
                _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var i = _step.value;
                var options = selects[i.SourceField];

                if (options != undefined) {
                  var value = options[i.response];

                  if (value != undefined) {
                    i.response = value;
                  }
                }

                i.question = _this3.removeHeaderTags(i.question);
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          }

          that.setState({
            page: page,
            errors: {},
            InstrumentJSON: InstrumentJSON,
            ReviewData: reviewPage
          });
          that.setupPageValues(page);
          window.scrollTo(0, 0);
        }
      }).fail(function (responseData) {
        if (responseData.status === 400) {
          var response = JSON.parse(responseData.responseText);

          _this3.setState({
            errors: response
          });

          swal({
            title: 'Error',
            text: 'Please resolve page errors before continuing'
          }, function (e) {
            $('html, body').animate({
              scrollTop: $($('.questionError')[0]).offset().top - 100
            }, 100);
          });
        }
      });
    }
  }, {
    key: "prevPage",
    value: function prevPage() {
      var page = this.state.page - 1;
      this.setState({
        page: page,
        errors: {}
      });
      this.setupPageValues(page);
      window.scrollTo(0, 0);
    }
  }, {
    key: "updateAnswer",
    value: function updateAnswer(fieldName, value) {
      var data = {};
      data[fieldName] = value;
      $.ajax({
        url: this.state.api_url,
        data: JSON.stringify(data),
        type: 'PATCH',
        contentType: 'application/json'
      });
      this.setState(function (state) {
        var values = state.values;
        var pageValues = state.pageValues;
        var stats = state.completionStats;

        if (values[fieldName] == null || values[fieldName] == '') {
          stats.completed = stats.completed + 1;
        } else if (value == null || value == '') {
          stats.completed = stats.completed - 1;
        }

        values[fieldName] = value;
        pageValues[fieldName] = value;
        return {
          values: values,
          pageValues: pageValues,
          completionStats: stats
        };
      });
    }
  }, {
    key: "submit",
    value: function submit() {
      var _this4 = this;

      var that = this;
      $.ajax({
        url: this.state.api_url,
        type: 'POST',
        contentType: 'application/json',
        success: function success(result) {
          that.setState({
            submitState: 1
          });
        }
      }).fail(function (responseData) {
        console.log('FAIL');
        console.log(responseData);

        _this4.setState({
          submitState: 3
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.submitState === 2) {
        // The form has already been submitted
        return /*#__PURE__*/React.createElement("div", null, "This form has already been completed");
      } else if (this.state.submitState === 1) {
        // The form has just been successfully submitted
        return /*#__PURE__*/React.createElement("div", null, "Thank you for submitting the data");
      } else if (!this.state.InstrumentJSON.Elements) {
        // Since the Instrument data is set when the component is
        // mounted we want to display nothing until it has been set
        return /*#__PURE__*/React.createElement("div", null);
      }

      var DirectEntryFormElements;
      var buttons;

      if (this.state.page === this.state.InstrumentJSON.Elements.length) {
        DirectEntryFormElements = /*#__PURE__*/React.createElement(ReviewPage, {
          reviewData: this.state.ReviewData,
          submitState: this.state.submitState
        });
      } else if (this.state.page >= 0) {
        DirectEntryFormElements = /*#__PURE__*/React.createElement(_DirectEntryForm__WEBPACK_IMPORTED_MODULE_8__["default"], {
          elements: this.state.InstrumentJSON.Elements[this.state.page].Elements,
          values: this.state.values,
          updateAnswer: this.updateAnswer,
          errors: this.state.errors
        });
      } else {
        DirectEntryFormElements = /*#__PURE__*/React.createElement(_DirectEntryForm__WEBPACK_IMPORTED_MODULE_8__["default"], {
          elements: this.state.InstrumentJSON.Elements,
          values: this.state.values,
          updateAnswer: this.updateAnswer,
          errors: this.state.errors
        });
      }

      if (this.state.page === this.state.InstrumentJSON.Elements.length) {
        buttons = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
          type: "button",
          className: "btn btn-primary btn-lg",
          onClick: this.prevPage
        }, "Prev"), /*#__PURE__*/React.createElement("button", {
          type: "button",
          className: "btn btn-primary btn-lg",
          onClick: this.submit
        }, "Submit"));
      } else if (this.state.page === -1 || this.state.page === 0 && this.state.InstrumentJSON.Elements.length === 1) {
        buttons = /*#__PURE__*/React.createElement("button", {
          type: "button",
          className: "btn btn-primary btn-lg",
          onClick: this.nextPage
        }, "Done");
      } else if (this.state.page === 0) {
        buttons = /*#__PURE__*/React.createElement("button", {
          type: "button",
          className: "btn btn-primary btn-lg",
          onClick: this.nextPage
        }, "Next");
      } else if (this.state.page === this.state.InstrumentJSON.Elements.length - 1) {
        buttons = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
          type: "button",
          className: "btn btn-primary btn-lg",
          onClick: this.prevPage
        }, "Prev"), /*#__PURE__*/React.createElement("button", {
          type: "button",
          className: "btn btn-primary btn-lg",
          onClick: this.nextPage
        }, "Done"));
      } else {
        buttons = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
          type: "button",
          className: "btn btn-primary btn-lg",
          onClick: this.prevPage
        }, "Prev"), /*#__PURE__*/React.createElement("button", {
          type: "button",
          className: "btn btn-primary btn-lg",
          onClick: this.nextPage
        }, "Next"));
      }

      var style = {
        width: this.state.completionStats.completed / this.state.completionStats.total * 100 + '%'
      };
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("nav", {
        className: "navbar navbar-default navbar-fixed-top"
      }, /*#__PURE__*/React.createElement("span", _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()({
        className: "h1"
      }, "className", "navbar-brand"), "LORIS")), /*#__PURE__*/React.createElement("div", {
        id: "page",
        className: "container-fluid"
      }, DirectEntryFormElements, /*#__PURE__*/React.createElement("div", {
        className: "question-container col-xs-12 col-sm-10 col-sm-offset-1"
      }, buttons)), /*#__PURE__*/React.createElement("div", {
        className: "navbar navbar-default navbar-fixed-bottom"
      }, /*#__PURE__*/React.createElement("div", {
        className: "col-xs-5 footer-bar"
      }, this.state.completionStats.completed, " of ", this.state.completionStats.total, " Answered"), /*#__PURE__*/React.createElement("div", {
        className: "col-xs-4 footer-bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "progress"
      }, /*#__PURE__*/React.createElement("div", {
        className: "progress-bar-info progress-bar-striped",
        role: "progressbar",
        "aria-valuenow": "60",
        "aria-valuemin": "0",
        "aria-valuemax": "100",
        style: style
      }, "\xA0")))));
    }
  }]);

  return DirectEntry;
}(React.Component);

var ReviewPage = /*#__PURE__*/function (_React$Component2) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(ReviewPage, _React$Component2);

  var _super2 = _createSuper(ReviewPage);

  function ReviewPage(props) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, ReviewPage);

    return _super2.call(this, props);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(ReviewPage, [{
    key: "render",
    value: function render() {
      var questions = this.props.reviewData.questions.map(function (element) {
        return /*#__PURE__*/React.createElement("tr", {
          className: "reviewPage"
        }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Markdown, {
          content: element.question
        })), /*#__PURE__*/React.createElement("td", null, element.response));
      });
      var error;

      if (this.props.submitState === 3) {
        error = /*#__PURE__*/React.createElement("h5", {
          className: "has-error"
        }, "This form has an error, please fix errors before submitting");
      }

      return /*#__PURE__*/React.createElement("div", {
        className: "question-container col-xs-12 col-sm-10 col-sm-offset-1"
      }, /*#__PURE__*/React.createElement("h3", null, "Review Your Submission"), error, /*#__PURE__*/React.createElement("table", {
        className: "table table-striped table-bordered"
      }, /*#__PURE__*/React.createElement("tbody", null, questions)));
    }
  }]);

  return ReviewPage;
}(React.Component);

window.DirectEntry = DirectEntry;
/* harmony default export */ __webpack_exports__["default"] = (DirectEntry);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

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

module.exports = _defineProperty;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithoutHoles = __webpack_require__(3);

var iterableToArray = __webpack_require__(5);

var unsupportedIterableToArray = __webpack_require__(6);

var nonIterableSpread = __webpack_require__(7);

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(4);

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

module.exports = _arrayWithoutHoles;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

module.exports = _iterableToArray;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(4);

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableSpread;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

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

module.exports = _createClass;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(12);

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
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(14);

var assertThisInitialized = __webpack_require__(9);

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;

/***/ }),
/* 15 */
/***/ (function(module, exports) {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(10);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(13);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(15);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _GroupElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(17);







function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default()(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4___default()(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/* eslint-disable */

/**
 * This file contains React form components for Direct Data Entry
 *
 * @author Jordan Stirling (StiringApps ltd.)
 * @version 0.0.1
 *
 */
 // import Markdown from './Markdown.js';

/**
 * 	THIS ELEMENT IS FOR DEVELOPMENT PURPOSES ONLY
 */

var NotImplement = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default()(NotImplement, _React$Component);

  var _super = _createSuper(NotImplement);

  function NotImplement(props) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, NotImplement);

    return _super.call(this, props);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(NotImplement, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", null, this.props.element.Type, " is not yet implemented");
    }
  }]);

  return NotImplement;
}(React.Component);
/**
 * 	THIS ELEMENT IS FOR DEVELOPMENT PURPOSES ONLY
 */


var NotSupported = /*#__PURE__*/function (_React$Component2) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default()(NotSupported, _React$Component2);

  var _super2 = _createSuper(NotSupported);

  function NotSupported(props) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, NotSupported);

    return _super2.call(this, props);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(NotSupported, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", null, this.props.element.Type, " is not supported by browser");
    }
  }]);

  return NotSupported;
}(React.Component);

var DirectEntryFormElement = /*#__PURE__*/function (_React$Component3) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default()(DirectEntryFormElement, _React$Component3);

  var _super3 = _createSuper(DirectEntryFormElement);

  function DirectEntryFormElement(props) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, DirectEntryFormElement);

    return _super3.call(this, props);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(DirectEntryFormElement, [{
    key: "render",
    value: function render() {
      var element;
      var errorMessage;
      var questionClass = 'question-container col-xs-12 col-sm-10 col-sm-offset-1';
      var group;

      switch (this.props.element.Type) {
        case 'select':
          element = /*#__PURE__*/React.createElement(SelectElement, {
            element: this.props.element,
            value: this.props.values[this.props.element.Name],
            updateAnswer: this.props.updateAnswer,
            error: this.props.errors[this.props.element.Name]
          });
          break;

        case 'text':
          element = /*#__PURE__*/React.createElement(TextElement, {
            element: this.props.element,
            value: this.props.values[this.props.element.Name],
            updateAnswer: this.props.updateAnswer,
            error: this.props.errors[this.props.element.Name]
          });
          break;

        case 'date':
          element = /*#__PURE__*/React.createElement(DateElement, {
            element: this.props.element,
            value: this.props.values[this.props.element.Name],
            updateAnswer: this.props.updateAnswer,
            error: this.props.errors[this.props.element.Name]
          });
          break;

        case 'label':
          element = /*#__PURE__*/React.createElement(LabelElement, {
            element: this.props.element
          });
          break;

        case 'header':
          element = /*#__PURE__*/React.createElement(HeaderElement, {
            element: this.props.element
          });
          break;

        case 'ElementGroup':
          group = 'true';
          element = /*#__PURE__*/React.createElement(_GroupElement_js__WEBPACK_IMPORTED_MODULE_6__["default"], {
            element: this.props.element,
            values: this.props.values,
            updateAnswer: this.props.updateAnswer,
            errors: this.props.errors
          });
          break;

        case 'advcheckbox':
          element = /*#__PURE__*/React.createElement(AdvcheckboxElement, {
            element: this.props.element,
            value: this.props.values[this.props.element.Name],
            updateAnswer: this.props.updateAnswer,
            error: this.props.errors[this.props.element.Name]
          });
          break;

        default:
          element = /*#__PURE__*/React.createElement(NotImplement, {
            element: this.props.element
          });
      }

      ;

      if (this.props.errors[this.props.element.Name]) {
        questionClass += ' questionError';
        errorMessage = /*#__PURE__*/React.createElement("h4", {
          className: "col-xs-12 has-error"
        }, "* ", this.props.errors[this.props.element.Name]);
      }

      var element_name = this.props.element.Name;
      var str = element_name.toLowerCase();

      if (group == 'true' && str.includes('score')) {
        questionClass = 'hidden';
      }

      return /*#__PURE__*/React.createElement("div", {
        className: questionClass
      }, element, errorMessage);
    }
  }]);

  return DirectEntryFormElement;
}(React.Component);

var Page = /*#__PURE__*/function (_React$Component4) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default()(Page, _React$Component4);

  var _super4 = _createSuper(Page);

  function Page(props) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, Page);

    return _super4.call(this, props);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(Page, [{
    key: "render",
    value: function render() {
      var _this = this;

      var DirectEntryFormElements = this.props.elements.map(function (element) {
        return /*#__PURE__*/React.createElement(DirectEntryFormElement, {
          element: element,
          values: _this.props.values,
          updateAnswer: _this.props.updateAnswer,
          errors: _this.props.errors
        });
      });
      return /*#__PURE__*/React.createElement("div", null, DirectEntryFormElements);
    }
  }]);

  return Page;
}(React.Component);

var SelectElement = /*#__PURE__*/function (_React$Component5) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default()(SelectElement, _React$Component5);

  var _super5 = _createSuper(SelectElement);

  function SelectElement(props) {
    var _this2;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, SelectElement);

    _this2 = _super5.call(this, props);
    _this2.state = {
      value: ''
    };
    return _this2;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(SelectElement, [{
    key: "onSelect",
    value: function onSelect(value) {
      // this.setState({'value': value});
      if (this.props.value !== value) {
        this.props.updateAnswer(this.props.element.Name, value);
      } else {
        this.props.updateAnswer(this.props.element.Name, null);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var options = [];
      var optionLabel;

      for (var key in this.props.element.Options.Values) {
        var checked = void 0;

        if (key === '') {
          continue;
        } else if (key === this.props.value) {
          checked = /*#__PURE__*/React.createElement("i", {
            className: "glyphicon glyphicon-ok"
          });
        }

        optionLabel = String(this.props.element.Options.Values[key]);
        options.push( /*#__PURE__*/React.createElement("div", {
          className: "col-xs-12 col-sm-6 select-option",
          onClick: this.onSelect.bind(this, key)
        }, /*#__PURE__*/React.createElement("div", {
          className: "selectBox"
        }, /*#__PURE__*/React.createElement("label", {
          className: "btn btn-default btn-circle"
        }, checked)), /*#__PURE__*/React.createElement("div", {
          className: "selectOption"
        }, /*#__PURE__*/React.createElement(Markdown, {
          content: optionLabel
        }))));
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

      if (!!this.props.element.Description) {
        description = /*#__PURE__*/React.createElement("h3", {
          className: classInfo
        }, /*#__PURE__*/React.createElement(Markdown, {
          content: this.props.element.Description
        }));
      }

      return /*#__PURE__*/React.createElement("div", null, description, element);
    }
  }]);

  return SelectElement;
}(React.Component);

var TextElement = /*#__PURE__*/function (_React$Component6) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default()(TextElement, _React$Component6);

  var _super6 = _createSuper(TextElement);

  function TextElement(props) {
    var _this3;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, TextElement);

    _this3 = _super6.call(this, props);
    _this3.updateText = _this3.updateText.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this3));
    return _this3;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(TextElement, [{
    key: "updateText",
    value: function updateText(e) {
      this.props.updateAnswer(this.props.element.Name, e.target.value);
    }
  }, {
    key: "render",
    value: function render() {
      var type;
      var value = '';

      if (this.props.value) {
        value = this.props.value;
      }

      if (this.props.element.Options.Type === 'small') {
        type = /*#__PURE__*/React.createElement("input", {
          name: this.props.element.Name,
          type: "text",
          className: "form-control",
          onChange: this.updateText,
          value: value
        });
      } else {
        type = /*#__PURE__*/React.createElement("textarea", {
          name: this.props.element.Name,
          className: "form-control",
          onChange: this.updateText,
          value: value
        });
      }

      var classInfo = 'col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4';
      var descClass = 'col-xs-12 field_question';

      if (this.props.error) {
        classInfo += ' has-error';
        descClass += ' has-error';
      }

      var description = '';

      if (!!this.props.element.Description) {
        description = /*#__PURE__*/React.createElement("h3", {
          className: descClass
        }, /*#__PURE__*/React.createElement(Markdown, {
          content: this.props.element.Description
        }));
      }

      return /*#__PURE__*/React.createElement("div", null, description, /*#__PURE__*/React.createElement("div", {
        className: classInfo
      }, type));
    }
  }]);

  return TextElement;
}(React.Component);

var DateElement = /*#__PURE__*/function (_React$Component7) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default()(DateElement, _React$Component7);

  var _super7 = _createSuper(DateElement);

  function DateElement(props) {
    var _this4;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, DateElement);

    _this4 = _super7.call(this, props);
    _this4.updateDate = _this4.updateDate.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this4));
    return _this4;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(DateElement, [{
    key: "updateDate",
    value: function updateDate(e) {
      this.props.updateAnswer(this.props.element.Name, e.target.value);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var that = this;

      if (!checkInput(this.props.element.Type)) {
        $('#' + this.props.element.Name).datepicker({
          'dateFormat': 'yy-mm-dd',
          'minDate': this.props.element.Options.MinDate,
          'maxDate': this.props.element.Options.MaxDate,
          'changeMonth': true,
          'changeYear': true,
          'yearRange': '-100:+15'
        }).on('change', function (e) {
          that.updateDate(e);
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var classInfo = 'col-xs-12 field_question';
      var value = '';

      if (this.props.value) {
        value = this.props.value;
      }

      var input = /*#__PURE__*/React.createElement("input", {
        name: this.props.element.Name,
        type: "date",
        className: "form-control",
        min: this.props.element.Options.MinDate,
        max: this.props.element.Options.MaxDate,
        onChange: this.updateDate,
        value: value
      });

      if (!checkInput(this.props.element.Type)) {
        input = /*#__PURE__*/React.createElement("input", {
          name: this.props.element.Name,
          type: "text",
          className: "form-control",
          value: this.props.value,
          id: this.props.element.Name
        });
      }

      if (this.props.error) {
        classInfo += ' has-error';
      }

      var description = '';

      if (!!this.props.element.Description) {
        description = /*#__PURE__*/React.createElement("h3", {
          className: "col-xs-12 field_question"
        }, /*#__PURE__*/React.createElement(Markdown, {
          content: this.props.element.Description
        }));
      }

      return /*#__PURE__*/React.createElement("div", null, description, /*#__PURE__*/React.createElement("div", {
        className: "col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4"
      }, input));
    }
  }]);

  return DateElement;
}(React.Component);

var LabelElement = /*#__PURE__*/function (_React$Component8) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default()(LabelElement, _React$Component8);

  var _super8 = _createSuper(LabelElement);

  function LabelElement(props) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, LabelElement);

    return _super8.call(this, props);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(LabelElement, [{
    key: "render",
    value: function render() {
      var description = '';

      if (!!this.props.element.Description) {
        description = /*#__PURE__*/React.createElement("h3", {
          className: "col-xs-12 field_question"
        }, /*#__PURE__*/React.createElement(Markdown, {
          content: this.props.element.Description
        }));
      }

      return /*#__PURE__*/React.createElement("div", null, description);
    }
  }]);

  return LabelElement;
}(React.Component);

var HeaderElement = /*#__PURE__*/function (_React$Component9) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default()(HeaderElement, _React$Component9);

  var _super9 = _createSuper(HeaderElement);

  function HeaderElement(props) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, HeaderElement);

    return _super9.call(this, props);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(HeaderElement, [{
    key: "render",
    value: function render() {
      var element;
      var score_header = this.props.element.Description;
      var str = score_header.toLowerCase();

      if (str.includes('score')) {
        element = /*#__PURE__*/React.createElement("h1", null);
      } else {
        element = /*#__PURE__*/React.createElement("h1", null, /*#__PURE__*/React.createElement(Markdown, {
          content: this.props.element.Description
        }));
      }

      return /*#__PURE__*/React.createElement("div", null, element);
    }
  }]);

  return HeaderElement;
}(React.Component);

var AdvcheckboxElement = /*#__PURE__*/function (_React$Component10) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default()(AdvcheckboxElement, _React$Component10);

  var _super10 = _createSuper(AdvcheckboxElement);

  function AdvcheckboxElement(props) {
    var _this5;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, AdvcheckboxElement);

    _this5 = _super10.call(this, props);
    _this5.state = {
      value: ''
    };
    return _this5;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(AdvcheckboxElement, [{
    key: "onSelect",
    value: function onSelect(lNull, value) {
      if (this.props.value !== value) {
        this.props.updateAnswer(this.props.element.Name, value);
      } else {
        this.props.updateAnswer(this.props.element.Name, lNull);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var checkbox = [];
      var value = this.props.value != null ? this.props.value : '';
      var checked = null;

      if (this.props.element.States.length == 2) {
        var lNull = this.props.element.States[0];
        var strValue = String(this.props.element.States[1]);

        if (strValue === value) {
          checked = /*#__PURE__*/React.createElement("i", {
            className: "glyphicon glyphicon-ok"
          });
        }

        var rightTxt = null;

        if (this.props.element.RightTxt !== '') {
          rightTxt = /*#__PURE__*/React.createElement("div", {
            className: "h3title rightTxt"
          }, /*#__PURE__*/React.createElement("span", null, this.props.element.RightTxt));
        }

        checkbox = /*#__PURE__*/React.createElement("div", {
          className: "col-xs-9 col-sm-6 select-option",
          onClick: this.onSelect.bind(this, lNull, strValue)
        }, /*#__PURE__*/React.createElement("div", {
          className: "selectBox"
        }, /*#__PURE__*/React.createElement("label", {
          className: "btn btn-default btn-box"
        }, checked)), rightTxt);
      }

      var classInfo = 'col-xs-3 col-sm-6 h3title field_question';

      if (this.props.error) {
        classInfo += ' has-error';
      }

      var description = '';

      if (!!this.props.element.Description) {
        description = /*#__PURE__*/React.createElement("div", {
          className: classInfo
        }, /*#__PURE__*/React.createElement(Markdown, {
          content: this.props.element.Description
        }));
      }

      return /*#__PURE__*/React.createElement("div", {
        className: "row field_input",
        "data-toggle": "buttons"
      }, description, checkbox);
    }
  }]);

  return AdvcheckboxElement;
}(React.Component);

/* harmony default export */ __webpack_exports__["default"] = (Page);

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(10);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(13);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(15);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__);







function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default()(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4___default()(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/* eslint-disable */
var GroupElement = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default()(GroupElement, _React$Component);

  var _super = _createSuper(GroupElement);

  function GroupElement(props) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, GroupElement);

    return _super.call(this, props);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(GroupElement, [{
    key: "render",
    value: function render() {
      var element;

      switch (this.props.element.GroupType) {
        case 'Element':
          element = /*#__PURE__*/React.createElement(ElementGroup, {
            element: this.props.element,
            values: this.props.values,
            updateAnswer: this.props.updateAnswer,
            errors: this.props.errors
          });
          break;
      }

      return /*#__PURE__*/React.createElement("div", null, element);
    }
  }]);

  return GroupElement;
}(React.Component);

var ElementGroup = /*#__PURE__*/function (_React$Component2) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default()(ElementGroup, _React$Component2);

  var _super2 = _createSuper(ElementGroup);

  function ElementGroup(props) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, ElementGroup);

    return _super2.call(this, props);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(ElementGroup, [{
    key: "render",
    value: function render() {
      var labelClass;
      var elementClass;
      var elements;
      var error;
      var errorMessage;

      switch (this.props.element.Elements.length) {
        case 1:
          labelClass = 'col-xs-12 col-sm-4 field_question';
          elementClass = 'col-xs-12 col-sm-8';
          break;

        case 2:
          labelClass = 'col-xs-12 col-sm-4 field_question';
          elementClass = 'col-xs-12 col-sm-4';
          break;

        case 3:
          labelClass = 'col-xs-12 col-sm-3 field_question';
          elementClass = 'col-xs-12 col-sm-3';
          break;

        case 4:
          labelClass = 'col-xs-12 col-sm-4 field_question';
          elementClass = 'col-xs-12 col-sm-2';
          break;

        case 5:
          labelClass = 'col-xs-12 col-sm-2 field_question';
          elementClass = 'col-xs-12 col-sm-2';
          break;

        case 6:
          labelClass = 'col-xs-12 col-sm-2 field_question';
          elementClass = 'col-xs-10 col-sm-custom';
          break;

        case 7:
          labelClass = 'col-xs-12 col-sm-2 field_question';
          elementClass = 'col-xs-10 col-sm-custom';
          break;

        case 8:
          labelClass = 'col-xs-12 col-sm-2 field_question';
          elementClass = 'col-xs-10 col-sm-custom';
          break;
      }

      if (this.props.errors[this.props.element.Name]) {
        error = true;
        labelClass += ' has-error';
      }

      elements = this.props.element.Elements.map(function (element) {
        if (!error && this.props.errors[element.Name]) {
          error = true;
          errorMessage = this.props.errors[element.Name];
        }

        return /*#__PURE__*/React.createElement(BaseElement, {
          element: element,
          classInfo: elementClass,
          value: this.props.values[element.Name],
          updateAnswer: this.props.updateAnswer,
          error: error,
          errorMessage: errorMessage
        });
      }.bind(this));
      var description = '';

      if (!!this.props.element.Description) {
        description = /*#__PURE__*/React.createElement("h3", {
          className: labelClass
        }, /*#__PURE__*/React.createElement(Markdown, {
          content: this.props.element.Description
        }));
      }

      return /*#__PURE__*/React.createElement("div", {
        className: "col-xs-12"
      }, description, elements);
    }
  }]);

  return ElementGroup;
}(React.Component);

var GroupDateElement = /*#__PURE__*/function (_React$Component3) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default()(GroupDateElement, _React$Component3);

  var _super3 = _createSuper(GroupDateElement);

  function GroupDateElement(props) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, GroupDateElement);

    _this = _super3.call(this, props);
    _this.updateValue = _this.updateValue.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this));
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(GroupDateElement, [{
    key: "updateValue",
    value: function updateValue(e) {
      this.props.updateAnswer(this.props.element.Name, e.target.value);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var that = this;

      if (!checkInput(this.props.element.Type)) {
        $('#' + this.props.element.Name).datepicker({
          'dateFormat': 'yy-mm-dd',
          'minDate': this.props.element.Options.MinDate,
          'maxDate': this.props.element.Options.MaxDate,
          'changeMonth': true,
          'changeYear': true,
          'yearRange': '-100:+15'
        }).on('change', function (e) {
          that.updateValue(e);
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var value = '';

      if (this.props.value) {
        value = this.props.value;
      }

      var input = /*#__PURE__*/React.createElement("input", {
        name: this.props.element.Name,
        type: "date",
        className: "form-control",
        min: this.props.element.Options.MinDate,
        max: this.props.element.Options.MaxDate,
        onChange: this.updateValue,
        value: value
      });

      if (!checkInput(this.props.element.Type)) {
        input = /*#__PURE__*/React.createElement("input", {
          name: this.props.element.Name,
          type: "text",
          className: "form-control",
          value: value,
          id: this.props.element.Name
        });
      }

      return /*#__PURE__*/React.createElement("div", null, input);
    }
  }]);

  return GroupDateElement;
}(React.Component);

var GroupTimeElement = /*#__PURE__*/function (_React$Component4) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default()(GroupTimeElement, _React$Component4);

  var _super4 = _createSuper(GroupTimeElement);

  function GroupTimeElement(props) {
    var _this2;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, GroupTimeElement);

    _this2 = _super4.call(this, props);

    if (!checkInput(_this2.props.element.Type)) {
      var hour = '';
      var min = '';

      if (_this2.props.value) {
        var val = _this2.props.value.split(':');

        hour = val[0];
        min = val[1];
      }

      _this2.state = {
        'hour': hour,
        'min': min
      };
    }

    _this2.updateValue = _this2.updateValue.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this2));
    return _this2;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(GroupTimeElement, [{
    key: "updateValue",
    value: function updateValue(e) {
      if (checkInput(this.props.element.Type)) {
        var val = e.target.value != '' ? e.target.value : null;
        this.props.updateAnswer(this.props.element.Name, val);
      }
    }
  }, {
    key: "updateTime",
    value: function updateTime(unit, e) {
      var val;

      if (unit == 'hour') {
        if (e.target.value == '') {
          val = null;
        } else if (this.state.min != '') {
          val = e.target.value + ':' + this.state.min + ':00';
        }

        this.props.updateAnswer(this.props.element.Name, val);
        this.setState({
          'hour': e.target.value
        });
      } else if (unit == 'min') {
        if (e.target.value == '') {
          val = null;
        } else if (this.state.hour != '') {
          val = this.state.hour + ':' + e.target.value + ':00';
        }

        this.props.updateAnswer(this.props.element.Name, val);
        this.setState({
          'min': e.target.value
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var input = /*#__PURE__*/React.createElement("input", {
        type: "time",
        name: this.props.element.Name,
        className: "form-control",
        onChange: this.updateValue,
        value: this.props.value
      });

      if (!checkInput(this.props.element.Type)) {
        var hourOptions = [];
        var minOptions = [];
        var val;
        var i;
        hourOptions.push( /*#__PURE__*/React.createElement("option", {
          value: ""
        }));
        minOptions.push( /*#__PURE__*/React.createElement("option", {
          value: ""
        }));

        for (i = 0; i < 24; i++) {
          if (i < 10) {
            val = '0' + i;
          } else {
            val = String(i);
          }

          hourOptions.push( /*#__PURE__*/React.createElement("option", {
            value: val
          }, val));
        }

        for (i = 0; i < 60; i++) {
          if (i < 10) {
            val = '0' + i;
          } else {
            val = String(i);
          }

          minOptions.push( /*#__PURE__*/React.createElement("option", {
            value: val
          }, val));
        }

        input = /*#__PURE__*/React.createElement("div", {
          className: "row"
        }, /*#__PURE__*/React.createElement("div", {
          className: "col-xs-4"
        }, /*#__PURE__*/React.createElement("select", {
          className: "form-control",
          onChange: this.updateTime.bind(this, 'hour'),
          value: this.state.hour
        }, hourOptions)), /*#__PURE__*/React.createElement("div", {
          className: "col-xs-4"
        }, /*#__PURE__*/React.createElement("select", {
          className: "form-control",
          onChange: this.updateTime.bind(this, 'min'),
          value: this.state.min
        }, minOptions)));
      }

      return /*#__PURE__*/React.createElement("div", null, input);
    }
  }]);

  return GroupTimeElement;
}(React.Component);

var BaseElement = /*#__PURE__*/function (_React$Component5) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default()(BaseElement, _React$Component5);

  var _super5 = _createSuper(BaseElement);

  function BaseElement(props) {
    var _this3;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, BaseElement);

    _this3 = _super5.call(this, props);
    _this3.updateValue = _this3.updateValue.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this3));
    return _this3;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(BaseElement, [{
    key: "updateValue",
    value: function updateValue(e) {
      this.props.updateAnswer(this.props.element.Name, e.target.value);
    }
  }, {
    key: "onSelect",
    value: function onSelect(lNull, value) {
      if (this.props.value !== value) {
        this.props.updateAnswer(this.props.element.Name, value);
      } else {
        this.props.updateAnswer(this.props.element.Name, lNull);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var element;
      var classInfo = this.props.classInfo;
      var value;
      var errorMessage;

      if (this.props.error) {
        classInfo += ' has-error';
      }

      if (this.props.errorMessage) {
        classInfo += ' questionError';
        errorMessage = /*#__PURE__*/React.createElement("div", null, this.props.errorMessage);
      }

      var rightTxt = null;

      switch (this.props.element.Type) {
        case 'text':
          _value = this.props.value != null ? this.props.value : '';

          if (this.props.element.Options.Type === 'small') {
            element = /*#__PURE__*/React.createElement("input", {
              type: "text",
              name: this.props.element.Name,
              className: "form-control",
              onChange: this.updateValue,
              value: _value
            });
          } else {
            element = /*#__PURE__*/React.createElement("textarea", {
              name: this.props.element.Name,
              className: "form-control",
              onChange: this.updateValue,
              value: _value
            });
          }

          break;

        case 'select':
          var options = [];
          _value = this.props.value != null ? this.props.value : '';

          for (var key in this.props.element.Options.Values) {
            options.push( /*#__PURE__*/React.createElement("option", {
              value: key
            }, this.props.element.Options.Values[key]));
          }

          element = /*#__PURE__*/React.createElement("select", {
            className: "form-control",
            onChange: this.updateValue,
            value: _value
          }, options);
          break;

        case 'advcheckbox':
          var _value = this.props.value != null ? this.props.value : '';

          var checked = null;

          if (this.props.element.States.length == 2) {
            var lNull = this.props.element.States[0];
            var strValue = String(this.props.element.States[1]);

            if (strValue === _value) {
              checked = /*#__PURE__*/React.createElement("i", {
                className: "glyphicon glyphicon-ok"
              });
            }

            if (this.props.element.RightTxt !== '') {
              rightTxt = /*#__PURE__*/React.createElement("div", {
                className: "h3title rightTxt"
              }, /*#__PURE__*/React.createElement("span", null, this.props.element.RightTxt));
            }

            element = /*#__PURE__*/React.createElement("div", {
              className: "selectBox",
              onClick: this.onSelect.bind(this, lNull, strValue)
            }, /*#__PURE__*/React.createElement("label", {
              className: "btn btn-default btn-box"
            }, checked));
          } else {
            element = null;
          }

          break;

        case 'label':
          var content = '';

          if (!!this.props.value) {
            content = this.props.value;
          } else if (!!this.props.element.Description) {
            content = this.props.element.Description;
          }

          element = /*#__PURE__*/React.createElement(Markdown, {
            content: content
          });
          break;

        case 'date':
          element = /*#__PURE__*/React.createElement(GroupDateElement, {
            element: this.props.element,
            value: this.props.value,
            updateAnswer: this.props.updateAnswer
          });
          break;

        case 'time':
          _value = this.props.value != null ? this.props.value : '';
          element = /*#__PURE__*/React.createElement(GroupTimeElement, {
            element: this.props.element,
            value: this.props.value,
            updateAnswer: this.props.updateAnswer
          });
          break;

        default:
          element = /*#__PURE__*/React.createElement("div", null, this.props.element.Type, " is not yet implemented group");
      }

      return /*#__PURE__*/React.createElement("div", {
        className: classInfo
      }, element, rightTxt, errorMessage);
    }
  }]);

  return BaseElement;
}(React.Component);

/* harmony default export */ __webpack_exports__["default"] = (GroupElement);

/***/ })
/******/ ]);
//# sourceMappingURL=DirectEntry.js.map