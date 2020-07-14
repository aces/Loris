window["lorisjs"] = window["lorisjs"] || {}; window["lorisjs"]["instruments"] = window["lorisjs"]["instruments"] || {}; window["lorisjs"]["instruments"]["CandidateInstrumentList"] =
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
/* harmony import */ var _VisitInstrumentList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/**
 * A CandidateInstrumentList provides a list of instruments for
 * a candidate and their status in a widget. There is one card
 * for each visit, and clicking on the visit expands to display
 * a list of instruments in that visit.
 *
 * @param {object} props - React props
 *
 * @return {object} - The JSX component
 */

function CandidateInstrumentList(props) {
  var visits = props.Visits.map(function (visit) {
    return /*#__PURE__*/React.createElement(_VisitInstrumentList__WEBPACK_IMPORTED_MODULE_0__["default"], {
      BaseURL: props.BaseURL,
      Candidate: props.Candidate,
      VisitMap: props.VisitMap,
      Visit: visit
    });
  });
  var style = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    padding: 0,
    margin: 0
  };
  return /*#__PURE__*/React.createElement("div", {
    style: style
  }, visits);
}

/* harmony default export */ __webpack_exports__["default"] = (CandidateInstrumentList);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }


/**
 * A VisitInstrumentList is a type of React component which displays
 * a visit. Clicking on the visit expands to display or hide all instruments
 * in that visit and their data entry status.
 *
 * The instruments themselves link to the data entry, and the visit goes
 * to the timepoint_list page.
 */

var VisitInstrumentList = /*#__PURE__*/function (_Component) {
  _inherits(VisitInstrumentList, _Component);

  var _super = _createSuper(VisitInstrumentList);

  /**
   * Construct the VisitInstrumentList
   *
   * @param {object} props - React props
   */
  function VisitInstrumentList(props) {
    var _this;

    _classCallCheck(this, VisitInstrumentList);

    _this = _super.call(this, props);
    _this.state = {
      expanded: false,
      hover: false
    };
    _this.toggleExpanded = _this.toggleExpanded.bind(_assertThisInitialized(_this));
    _this.toggleHover = _this.toggleHover.bind(_assertThisInitialized(_this));
    _this.getInstruments = _this.getInstruments.bind(_assertThisInitialized(_this));
    _this.calcAge = _this.calcAge.bind(_assertThisInitialized(_this));
    return _this;
  }
  /**
   * Toggle determine whether this item is being hovered over.
   * This is used for styling the background.
   */


  _createClass(VisitInstrumentList, [{
    key: "toggleHover",
    value: function toggleHover() {
      this.setState({
        hover: !this.state.hover
      });
    }
    /**
     * Calculate the age at a visit.
     *
     * @param {string} dob - The date of birth as a string
     * @param {string} visit - The visit date as a string
     *
     * @return {string} - A human readable description of the age
     */

  }, {
    key: "calcAge",
    value: function calcAge(dob, visit) {
      var dobdate = new Date(dob);
      var vdate = new Date(visit);
      var years = vdate.getFullYear() - dobdate.getFullYear();
      var months = years * 12 + vdate.getMonth() - dobdate.getMonth();

      if (months <= 36) {
        return months + ' months old';
      }

      return years + ' years old';
    }
    /**
     * Toggle whether instruments are displayed.
     */

  }, {
    key: "toggleExpanded",
    value: function toggleExpanded() {
      // Only get the instruments the first time, otherwise just reuse
      // what the data from state.
      if (!this.state.expanded === true && !this.state.instruments) {
        this.getInstruments();
      }

      this.setState({
        expanded: !this.state.expanded
      });
    }
    /**
     * Get a list of instruments and their data entry completion percentage.
     *
     * The list of instruments will be stored in the component's state.
     */

  }, {
    key: "getInstruments",
    value: function getInstruments() {
      var _this2 = this;

      fetch(this.props.BaseURL + '/instruments/visitsummary?CandID=' + this.props.Candidate.Meta.CandID + '&VisitLabel=' + this.props.Visit.Meta.Visit).then(function (response) {
        return response.json();
      }).then(function (json) {
        _this2.setState({
          instruments: json
        });
      });
    }
    /**
     * React lifecycle method. Render the component
     *
     * @return {object} - The rendered JSX
     */

  }, {
    key: "render",
    value: function render() {
      var _style,
          _this3 = this;

      var style = (_style = {
        marginBottom: '0.5%',
        marginRight: '0.5%',
        textAlign: 'center',
        boxSizing: 'border-box',
        transition: 'flex 0.3s, width 0.3s ease-out, height 0.3s ease-out',
        width: '98%'
      }, _defineProperty(_style, "marginBottom", '1ex'), _defineProperty(_style, "backgroundColor", 'transparent'), _style);
      var vstatus = 'Not Started';
      var bg = '#ea9999';

      if (this.props.Visit.Stages.Approval) {
        vstatus = 'Approval - ' + this.props.Visit.Stages.Approval.Status;
        bg = '#b6d7a8';
      } else if (this.props.Visit.Stages.Visit) {
        vstatus = 'Visit - ' + this.props.Visit.Stages.Visit.Status;
        bg = '#ffe599';
      } else if (this.props.Visit.Stages.Screening) {
        vstatus = 'Screening - ' + this.props.Visit.Stages.Screening.Status;
        bg = '#f9cb9c';
      }

      var clickEnabled = true;

      if (!this.state.expanded) {
        if (vstatus === 'Not Started') {
          style.cursor = 'not-allowed';
          clickEnabled = false;
        } else {
          style.cursor = 'pointer';
        }

        if (this.state.hover) {
          style.backgroundColor = 'rgb(235, 235, 235)';
        }
      }

      var flexcontainer = _defineProperty({
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        width: '100%',
        height: '100%',
        alignItems: 'flex-start',
        border: '1px solid #E4EBF2',
        borderTopRightRadius: '10px',
        borderBottomRightRadius: '10px'
      }, "alignItems", 'center');

      flexcontainer.justifyContent = 'flex-start';
      var center = {
        display: 'flex',
        width: '12%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
      };
      var termstyle = {
        paddingLeft: '2em',
        paddingRight: '2em'
      };
      var instruments = null;

      if (!this.state.instruments) {
        instruments = 'Loading...';
      } else {
        instruments = this.state.instruments.map(function (instrument) {
          var conflicterror = null;

          if (instrument.NumOfConflict != 0) {
            conflicterror = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
              href: _this3.props.BaseURL + '/conflict_resolver/?candidateID=' + _this3.props.Candidate.Meta.CandID + '&instrument=' + instrument.Test_name + '&visitLabel=' + _this3.props.Visit.Meta.Visit
            }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
              style: {
                color: 'red'
              },
              className: "fas fa-exclamation-triangle"
            }));
          }

          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
            key: instrument.Test_name
          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
            style: {
              textAlign: 'left'
            }
          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
            href: _this3.props.BaseURL + '/instruments/' + instrument.Test_name + '?commentID=' + instrument.CommentID
          }, instrument.Test_name)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("progress", {
            value: instrument.Completion,
            max: "100"
          }, instrument.Completion + '%')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, conflicterror));
        });

        if (this.state.instruments.length === 0) {
          instruments = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, 'Visit has no registered instruments in test battery.');
        } else {
          instruments = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h5", null, "Instruments"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
            className: "table table-hover table-bordered",
            style: {
              width: '95%'
            }
          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, "Instrument"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
            style: {
              textAlign: 'center'
            }
          }, "Completion"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
            style: {
              textAlign: 'center'
            }
          }, "Conflicts?"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, instruments)));
        }
      }

      if (!this.state.expanded || vstatus === 'Not Started') {
        instruments = null;
      } // We don't show the visit date of age if it's not possible because
      // the visit wasn't started.


      var vdate = null;
      var vage = null;

      if (this.props.Visit.Stages.Visit) {
        vdate = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          style: termstyle
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("dt", null, "Date Of Visit"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("dd", null, this.props.Visit.Stages.Visit.Date));
        vage = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          style: termstyle
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("dt", null, "Age"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("dd", null, this.calcAge(this.props.Candidate.Meta.DoB, this.props.Visit.Stages.Visit.Date)));
      }

      var defliststyle = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        justifyContent: 'space-between',
        margin: 0,
        padding: '1ex'
      };
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: style,
        onClick: clickEnabled ? this.toggleExpanded : null,
        onMouseEnter: this.toggleHover,
        onMouseLeave: this.toggleHover
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: flexcontainer
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: {
          background: bg,
          width: '1%',
          height: '100%'
        }
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: center
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", {
        style: {
          width: '100%',
          padding: 0,
          margin: 0
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: this.props.BaseURL + '/instrument_list/?candID=' + this.props.Candidate.Meta.CandID + '&sessionID=' + this.props.VisitMap[this.props.Visit.Meta.Visit]
      }, this.props.Visit.Meta.Visit))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("dl", {
        style: defliststyle
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: termstyle
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("dt", null, "Subproject"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("dd", null, this.props.Visit.Meta.Battery)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: termstyle
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("dt", null, "Site"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("dd", null, this.props.Visit.Meta.Site)), vdate, vage, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: termstyle
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("dt", null, "Status"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("dd", null, vstatus))), instruments)));
    }
  }]);

  return VisitInstrumentList;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (VisitInstrumentList);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

(function() { module.exports = window["React"]; }());

/***/ })
/******/ ]);
//# sourceMappingURL=CandidateInstrumentList.js.map