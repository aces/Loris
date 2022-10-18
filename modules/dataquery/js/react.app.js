window["lorisjs"] = window["lorisjs"] || {}; window["lorisjs"]["dataquery"] = window["lorisjs"]["dataquery"] || {}; window["lorisjs"]["dataquery"]["react.app"] =
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
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(10);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_7__);






function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default()(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4___default()(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 *  The following file contains the base component for the data query react app.
 *  It also contains the component for the saved queries dropdown.
 *
 *  @author   Jordan Stirling <jstirling91@gmail.com>
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://github.com/aces/Loris
 */




/**
 * Saved Queries List component
 *
 * The following component is for saved queries dropdown which appears in the
 * tab bar of the base component.
 */
var SavedQueriesList = /*#__PURE__*/function (_Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default()(SavedQueriesList, _Component);
  var _super = _createSuper(SavedQueriesList);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function SavedQueriesList(props) {
    var _this;
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, SavedQueriesList);
    _this = _super.call(this, props);
    _this.state = {};
    _this.loadQuery = _this.loadQuery.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2___default()(_this));
    return _this;
  }

  /**
   * Loads in the selected query
   * @param {string} queryName
   */
  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(SavedQueriesList, [{
    key: "loadQuery",
    value: function loadQuery(queryName) {
      this.props.onSelectQuery(this.props.queryDetails[queryName].Fields, this.props.queryDetails[queryName].Conditions);
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var userSaved = [];
      var globalSaved = [];
      var queryName;
      var curQuery;
      if (this.props.queriesLoaded === false) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", null);
      }
      // Build the list for the user queries
      for (var i = 0; i < this.props.userQueries.length; i += 1) {
        curQuery = this.props.queryDetails[this.props.userQueries[i]];
        if (curQuery.Meta && curQuery.Meta.name) {
          queryName = curQuery.Meta.name;
        } else {
          queryName = this.props.userQueries[i];
        }
        userSaved.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("li", {
          key: this.props.userQueries[i]
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("a", {
          href: "#",
          onClick: this.loadQuery.bind(this, this.props.userQueries[i])
        }, queryName)));
      }
      // Build the list for the global queries
      for (var _i = 0; _i < this.props.globalQueries.length; _i += 1) {
        curQuery = this.props.queryDetails[this.props.globalQueries[_i]];
        if (curQuery.Meta && curQuery.Meta.name) {
          queryName = curQuery.Meta.name;
        } else {
          queryName = this.props.globalQueries[_i];
        }
        globalSaved.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("li", {
          key: this.props.globalQueries[_i]
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("a", {
          href: "#",
          onClick: this.loadQuery.bind(this, this.props.globalQueries[_i])
        }, queryName)));
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("ul", {
        className: "nav nav-tabs navbar-right"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("li", {
        className: "dropdown"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("a", {
        href: "#",
        className: "dropdown-toggle",
        "data-toggle": "dropdown",
        role: "button",
        "aria-expanded": "false"
      }, "Load Saved Query ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("span", {
        className: "caret"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("ul", {
        className: "dropdown-menu",
        role: "menu"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("li", {
        role: "presentation",
        className: "dropdown-header"
      }, "User Saved Queries"), userSaved, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("li", {
        role: "presentation",
        className: "dropdown-header"
      }, "Shared Saved Queries"), globalSaved)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("li", {
        role: "presentation",
        id: "presentationMSQ"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("a", {
        href: "#SavedQueriesTab",
        "data-toggle": "tab"
      }, "Manage Saved Queries")));
    }
  }]);
  return SavedQueriesList;
}(react__WEBPACK_IMPORTED_MODULE_6__["Component"]);
SavedQueriesList.propTypes = {
  queryDetails: prop_types__WEBPACK_IMPORTED_MODULE_7___default.a.object,
  queriesLoaded: prop_types__WEBPACK_IMPORTED_MODULE_7___default.a.bool
};
SavedQueriesList.defaultProps = {
  queryDetails: {},
  queriesLoaded: false
};

/**
 * DataQuery App component
 *
 * The following component is the data queries base element. It controls which tab is currently
 * shown, along with keeping the state of the current query being built and running the query.
 */
var DataQueryApp = /*#__PURE__*/function (_Component2) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default()(DataQueryApp, _Component2);
  var _super2 = _createSuper(DataQueryApp);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function DataQueryApp(props) {
    var _this2;
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, DataQueryApp);
    _this2 = _super2.call(this, props);
    _this2.state = {
      displayType: 'Cross-sectional',
      fields: [],
      criteria: {},
      sessiondata: {},
      grouplevel: 0,
      queryIDs: _this2.props.SavedQueries,
      savedQueries: {},
      queriesLoaded: false,
      alertLoaded: false,
      alertSaved: false,
      alertConflict: {
        show: false
      },
      ActiveTab: 'Info',
      rowData: {},
      filter: {
        type: 'group',
        activeOperator: 0,
        children: [{
          type: 'rule'
        }],
        session: _this2.props.AllSessions
      },
      selectedFields: {},
      downloadableFields: {},
      loading: false
    };
    _this2.saveFilterRule = _this2.saveFilterRule.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2___default()(_this2));
    _this2.saveFilterGroup = _this2.saveFilterGroup.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2___default()(_this2));
    _this2.saveCurrentQuery = _this2.saveCurrentQuery.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2___default()(_this2));
    _this2.overrideQuery = _this2.overrideQuery.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2___default()(_this2));
    _this2.loadFilterRule = _this2.loadFilterRule.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2___default()(_this2));
    _this2.loadFilterGroup = _this2.loadFilterGroup.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2___default()(_this2));
    _this2.loadSavedQuery = _this2.loadSavedQuery.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2___default()(_this2));
    _this2.fieldVisitSelect = _this2.fieldVisitSelect.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2___default()(_this2));
    _this2.fieldChange = _this2.fieldChange.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2___default()(_this2));
    _this2.getSessions = _this2.getSessions.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2___default()(_this2));
    _this2.runQuery = _this2.runQuery.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2___default()(_this2));
    _this2.getRowData = _this2.getRowData.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2___default()(_this2));
    _this2.dismissAlert = _this2.dismissAlert.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2___default()(_this2));
    _this2.resetQuery = _this2.resetQuery.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2___default()(_this2));
    _this2.changeDataDisplay = _this2.changeDataDisplay.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2___default()(_this2));
    _this2.updateFilter = _this2.updateFilter.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2___default()(_this2));
    return _this2;
  }

  /**
   * On Tab Change Handler
   * @param {object} e = Event
   */
  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(DataQueryApp, [{
    key: "onTabChangeHandler",
    value: function onTabChangeHandler(e) {
      if (e.target.innerHTML !== 'Manage Saved Queries') {
        document.getElementById('presentationMSQ').classList.remove('active');
      }
    }

    /**
     * Called by React when the component has been rendered on the page.
     */
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;
      // Before the dataquery is loaded into the window, this function is called to gather
      // any data that was not passed in the initial load.

      // The left and right menu items are part of the same menu, but bootstrap considers
      // them two separate ones, so we need to make sure that only one is selected by removing
      // "active" from all the tab classes and only adding it to the really active one
      var domNode = this;
      $(domNode).find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $(domNode).find('li').removeClass('active');
        if (e.target) {
          e.target.classList.add('active');
          // Both the <li> tag and the <a> tag should be active
          if (e.target.parentNode) {
            e.target.parentNode.classList.add('active');
          }
        }
      });

      // Load the save queries' details
      var promises = [];
      for (var key in this.state.queryIDs) {
        if (this.state.queryIDs.hasOwnProperty(key)) {
          for (var i = 0; i < this.state.queryIDs[key].length; i += 1) {
            var curRequest = void 0;
            curRequest = Promise.resolve($.ajax(loris.BaseURL + '/AjaxHelper.php?Module=dataquery&script=GetDoc.php&DocID=' + encodeURIComponent(this.state.queryIDs[key][i])), {
              data: {
                DocID: this.state.queryIDs[key][i]
              },
              dataType: 'json'
            }).then(function (value) {
              var queries = _this3.state.savedQueries;
              queries[value._id] = value;
              _this3.setState({
                savedQueries: queries
              });
            });
            promises.push(curRequest);
          }
        }
      }
      Promise.all(promises).then(function (value) {
        _this3.setState({
          'queriesLoaded': true
        });
      });
      $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        _this3.setState({
          ActiveTab: e.target.getAttribute('href').substr(1)
        });
      });
    }

    /**
     * Save filter rule
     * @param {object} rule - sets the filter rule
     * @return {object}
     */
  }, {
    key: "saveFilterRule",
    value: function saveFilterRule(rule) {
      // Used to build a filter rule for saving query
      var savedRule = {
        field: rule.field,
        operator: rule.operator,
        value: rule.value,
        instrument: rule.instrument,
        visit: rule.visit
      };
      return savedRule;
    }

    /**
     * Save filter group
     * @param {object} group - sets the filter group for saving query.
     * @return {object}
     */
  }, {
    key: "saveFilterGroup",
    value: function saveFilterGroup(group) {
      // Used to build a filter group for saving query
      var savedFilter = {
        activeOperator: group.activeOperator,
        children: []
      };
      // Recursively build the filter groups children
      for (var i = 0; i < group.children.length; i++) {
        if (group.children[i].type === 'rule') {
          savedFilter.children.push(this.saveFilterRule(group.children[i]));
        } else if (group.children[i].type === 'group') {
          savedFilter.children.push(this.saveFilterGroup(group.children[i]));
        }
      }
      return savedFilter;
    }

    /**
     * Save current query
     * @param {string} name
     * @param {string} shared
     * @param {boolean} override
     */
  }, {
    key: "saveCurrentQuery",
    value: function saveCurrentQuery(name, shared, override) {
      var _this4 = this;
      // Used to save the current query
      var filter = this.saveFilterGroup(this.state.filter);
      $.post(loris.BaseURL + '/AjaxHelper.php?Module=dataquery&script=saveQuery.php', {
        Fields: this.state.selectedFields,
        Filters: filter,
        QueryName: name,
        SharedQuery: shared,
        OverwriteQuery: override
      }, function (data) {
        // Once saved, add the query to the list of saved queries
        var id = JSON.parse(data).id;
        var queryIDs = _this4.state.queryIDs;
        if (!override) {
          if (shared === true) {
            queryIDs.Shared.push(id);
          } else {
            queryIDs.User.push(id);
          }
        }
        $.get(loris.BaseURL + '/AjaxHelper.php?Module=dataquery&script=GetDoc.php&DocID=' + id, function (value) {
          var queries = _this4.state.savedQueries;
          queries[value._id] = value;
          _this4.setState({
            savedQueries: queries,
            queryIDs: queryIDs,
            alertLoaded: false,
            alertSaved: true,
            alertConflict: {
              show: false
            }
          });
        });
      }).fail(function (data) {
        if (data.status === 409) {
          _this4.setState({
            alertConflict: {
              show: true,
              QueryName: name,
              SharedQuery: shared
            }
          });
        }
      });
    }

    /**
     * override query
     */
  }, {
    key: "overrideQuery",
    value: function overrideQuery() {
      this.saveCurrentQuery(this.state.alertConflict.QueryName, this.state.alertConflict.SharedQuery, true);
    }

    /**
     * Used to load in a filter rule
     * @param {object} rule
     * @return {object} rule
     */
  }, {
    key: "loadFilterRule",
    value: function loadFilterRule(rule) {
      var script;
      if (!rule.type) {
        rule.type = 'rule';
      }

      // Get given fields of the instrument for the rule.
      // This call is made synchronously
      $.ajax({
        url: loris.BaseURL + '/AjaxHelper.php' + '?Module=dataquery&script=datadictionary.php',
        success: function success(data) {
          rule.fields = data;
        },
        async: false,
        data: {
          category: rule.instrument
        },
        dataType: 'json'
      });

      // Find the rules selected field's data type
      for (var i = 0; i < rule.fields.length; i++) {
        if (rule.fields[i].key[1] === rule.field) {
          rule.fieldType = rule.fields[i].value.Type;
          break;
        }
      }

      // Get the sessions which meet the rules criterias.
      // TODO:    Build the sessions in the new format
      switch (rule.operator) {
        case 'equal':
        case 'isNull':
          script = 'queryEqual.php';
          break;
        case 'notEqual':
        case 'isNotNull':
          script = 'queryNotEqual.php';
          break;
        case 'lessThanEqual':
          script = 'queryLessThanEqual.php';
          break;
        case 'greaterThanEqual':
          script = 'queryGreaterThanEqual.php';
          break;
        case 'startsWith':
          script = 'queryStartsWith.php';
          break;
        case 'contains':
          script = 'queryContains.php';
          break;
        default:
          break;
      }
      $.ajax({
        url: loris.BaseURL + '/AjaxHelper.php?Module=dataquery&script=' + script,
        success: function success(data) {
          var i;
          var allSessions = {};
          var allCandiates = {};
          // Loop through data and divide into individual visits with unique PSCIDs
          // storing a master list of unique PSCIDs
          for (i = 0; i < data.length; i++) {
            if (!allSessions[data[i][1]]) {
              allSessions[data[i][1]] = [];
            }
            allSessions[data[i][1]].push(data[i][0]);
            if (!allCandiates[data[i][0]]) {
              allCandiates[data[i][0]] = [];
            }
            allCandiates[data[i][0]].push(data[i][1]);
          }
          rule.candidates = {
            allCandiates: allCandiates,
            allSessions: allSessions
          };
          if (rule.visit === 'All') {
            rule.session = Object.keys(allCandiates);
          } else {
            if (allSessions[rule.visit]) {
              rule.session = allSessions[rule.visit];
            } else {
              rule.session = [];
            }
          }
        },
        async: false,
        data: {
          category: rule.instrument,
          field: rule.field,
          value: rule.value
        },
        dataType: 'json'
      });
      return rule;
    }

    /**
     * Used to load in a filter group
     * @param {object} group
     * @return {object} group
     */
  }, {
    key: "loadFilterGroup",
    value: function loadFilterGroup(group) {
      // Recursively load the children on the group
      for (var i = 0; i < group.children.length; i++) {
        if (group.children[i].activeOperator) {
          if (!group.children[i].type) {
            group.children[i].type = 'group';
          }
          group.children[i] = this.loadFilterGroup(group.children[i]);
        } else {
          group.children[i] = this.loadFilterRule(group.children[i]);
        }
      }
      group.session = getSessions(group);
      return group;
    }

    /**
     * Used to load a saved query
     * Query can be saved in 2 formats:
     * params can be arrays or objects
     *
     * @param {string[]|object} fields
     * @param {object[]|object} criteria
     */
  }, {
    key: "loadSavedQuery",
    value: function loadSavedQuery(fields, criteria) {
      var _this5 = this;
      var filterState = {};
      var selectedFields = {};
      var fieldsList = [];
      this.setState({
        loading: true
      });
      if (Array.isArray(criteria)) {
        // This is used to load a query that is saved in the old format
        // so translate it into the new format, grouping the given critiras
        // into a filter group

        filterState = {
          type: 'group',
          activeOperator: 0,
          children: []
        };
        filterState.children = criteria.map(function (item) {
          var fieldInfo = item.Field.split(',');
          var rule = {
            instrument: fieldInfo[0],
            field: fieldInfo[1],
            value: item.Value,
            type: 'rule',
            visit: 'All'
          };
          switch (item.Operator) {
            case '=':
              rule.operator = 'equal';
              break;
            case '!=':
              rule.operator = 'notEqual';
              break;
            case '<=':
              rule.operator = 'lessThanEqual';
              break;
            case '>=':
              rule.operator = 'greaterThanEqual';
              break;
            default:
              rule.operator = item.Operator;
              break;
          }
          return rule;
        });
        var fieldSplit;
        fieldsList = fields;
        for (var i = 0; i < fields.length; i++) {
          fieldSplit = fields[i].split(',');
          if (!selectedFields[fieldSplit[0]]) {
            selectedFields[fieldSplit[0]] = {};
            selectedFields[fieldSplit[0]][fieldSplit[1]] = {};
            selectedFields[fieldSplit[0]].allVisits = {};
            for (var key in this.props.Visits) {
              if (this.props.Visits.hasOwnProperty(key)) {
                selectedFields[fieldSplit[0]].allVisits[key] = 1;
                selectedFields[fieldSplit[0]][fieldSplit[1]][key] = [key];
              }
            }
          } else {
            selectedFields[fieldSplit[0]][fieldSplit[1]] = {};
            for (var _key in this.props.Visits) {
              if (this.props.Visits.hasOwnProperty(_key)) {
                selectedFields[fieldSplit[0]].allVisits[_key]++;
                selectedFields[fieldSplit[0]][fieldSplit[1]][_key] = [_key];
              }
            }
          }
        }
      } else {
        // Query was saved in the new format
        filterState = criteria;
        selectedFields = fields ? fields : {};
        for (var instrument in fields) {
          if (fields.hasOwnProperty(instrument)) {
            for (var field in fields[instrument]) {
              if (field !== 'allVisits') {
                fieldsList.push(instrument + ',' + field);
              }
            }
          }
        }
      }
      if (filterState.children && filterState.children.length > 0) {
        filterState = this.loadFilterGroup(filterState);
      } else {
        filterState.children = [{
          type: 'rule'
        }];
        filterState.session = this.props.AllSessions;
      }
      this.setState({
        fields: fieldsList,
        selectedFields: selectedFields,
        filter: filterState,
        alertLoaded: true,
        alertSaved: false,
        loading: false
      });
      for (var _i2 = 0; _i2 < fieldsList.length; _i2++) {
        $.ajax({
          url: loris.BaseURL + '/dataquery/ajax/datadictionary.php',
          success: function success(data) {
            if (data[0].value.IsFile) {
              var _key2 = data[0].key[0] + ',' + data[0].key[1];
              var downloadable = _this5.state.downloadableFields;
              downloadable[_key2] = true;
              _this5.setState({
                downloadableFields: downloadable
              });
            }
          },
          data: {
            key: fieldsList[_i2]
          },
          dataType: 'json'
        });
      }
    }

    /**
     * Used to select visits for a given field
     *
     * @param {string} action
     * @param {string} visit
     * @param {object} field
     */
  }, {
    key: "fieldVisitSelect",
    value: function fieldVisitSelect(action, visit, field) {
      // Used to select visits for a given field
      this.setState(function (state) {
        var temp = state.selectedFields[field.instrument];
        if (action === 'check') {
          // Adding a new visit for field, add visit to field and
          // increase count of visit in allVisits
          temp[field.field][visit] = visit;
          if (temp.allVisits[visit]) {
            temp.allVisits[visit]++;
          } else {
            temp.allVisits[visit] = 1;
          }
        } else {
          // Removing visit, delete visit from field
          delete temp[field.field][visit];
          if (temp.allVisits[visit] === 1) {
            // If visit count in allVisits is 1 delete visit from
            // allVisits
            delete temp.allVisits[visit];
          } else {
            // Else decrement count of visit in allVisists
            temp.allVisits[visit]--;
          }
        }
        return temp;
      });
    }

    /**
     * Used to add and remove fields from the current query being built
     * @param {object} fieldName
     * @param {object} category
     * @param {object} downloadable
     */
  }, {
    key: "fieldChange",
    value: function fieldChange(fieldName, category, downloadable) {
      var _this6 = this;
      this.setState(function (state) {
        var selectedFields = state.selectedFields;
        var fields = state.fields.slice(0);
        if (!selectedFields[category]) {
          // The given category has no selected fields, add the category to the selectedFields
          selectedFields[category] = {};
          // Add all visits to the given field for the given category
          selectedFields[category][fieldName] = JSON.parse(JSON.stringify(_this6.props.Visits));
          // Add all visits to the given category, initializing their counts to 1
          selectedFields[category].allVisits = {};
          for (var key in _this6.props.Visits) {
            if (_this6.props.Visits.hasOwnProperty(key)) {
              selectedFields[category].allVisits[key] = 1;
            }
          }

          // Add field to the field list
          fields.push(category + ',' + fieldName);
          if (downloadable) {
            // If the field is downloadable add to the list of downloadable fields
            state.downloadableFields[category + ',' + fieldName] = true;
          }
        } else if (selectedFields[category][fieldName]) {
          // Remove the field from the selectedFields
          for (var _key3 in selectedFields[category][fieldName]) {
            // Decrement the count of field's visits, delete visit if count is 1
            if (selectedFields[category].allVisits[_key3] === 1) {
              delete selectedFields[category].allVisits[_key3];
            } else {
              selectedFields[category].allVisits[_key3]--;
            }
          }
          delete selectedFields[category][fieldName];

          // Find the given field in the fields list and remove it
          var idx = fields.indexOf(category + ',' + fieldName);
          fields.splice(idx, 1);
          if (Object.keys(selectedFields[category]).length === 1) {
            // If no more fields left for category, delete category from
            // selectedFields
            delete selectedFields[category];
          }
          if (downloadable) {
            // If the field was downloadable, delete it from the downloadable list
            delete state.downloadableFields[category + ',' + fieldName];
          }
        } else {
          // The category already has fields but not the desired one, add it
          if (!selectedFields[category][fieldName]) {
            selectedFields[category][fieldName] = {};
          }

          // Increment the visit count for the visit, setting it to 1 if doesn't exist
          for (var _key4 in selectedFields[category].allVisits) {
            if (_key4 === 'allVisits') {
              continue;
            }
            selectedFields[category].allVisits[_key4]++;
            selectedFields[category][fieldName][_key4] = _key4;
          }
          fields.push(category + ',' + fieldName);
          if (downloadable) {
            // If the field is downloadable add to the list of downloadable fields
            state.downloadableFields[category + ',' + fieldName] = true;
          }
        }
        return {
          selectedFields: selectedFields,
          fields: fields
        };
      });
    }

    /**
     * Get the sessions to be selected
     * @return {[]}
     */
  }, {
    key: "getSessions",
    value: function getSessions() {
      if (this.state.filter.children.length > 0) {
        // If filter exists return filter sessions
        return this.state.filter.session;
      } else {
        // Else return all sessions
        return this.props.AllSessions;
      }
    }

    /**
     * Run the current query
     * @param {string[]} fields
     */
  }, {
    key: "runQuery",
    value: function runQuery(fields) {
      var _this7 = this;
      var DocTypes = [];
      var semaphore = 0;
      var sectionedSessions;
      var ajaxComplete = function ajaxComplete() {
        // Wait until all ajax calls have completed before computing the rowdata
        if (semaphore == 0) {
          var rowdata = _this7.getRowData(_this7.state.grouplevel);
          _this7.setState({
            rowData: rowdata,
            loading: false
          });
        }
      };

      // Reset the rowData and sessiondata
      this.setState({
        rowData: {},
        sessiondata: {},
        loading: true
      });

      // Get list of DocTypes to be retrieved
      for (var i = 0; i < fields.length; i += 1) {
        var fieldSplit = fields[i].split(',');
        var category = fieldSplit[0];

        // Check if the current category has already been queried, if so skip
        if (DocTypes.indexOf(category) === -1) {
          var sessionInfo = [];

          // Build the session data to be queried for the given category
          for (var j = 0; j < this.state.filter.session.length; j++) {
            if (Array.isArray(this.state.filter.session[j])) {
              if (this.state.selectedFields[category].allVisits[this.state.filter.session[j][1]]) {
                sessionInfo.push(this.state.filter.session[j]);
              }
            } else {
              for (var key in this.state.selectedFields[category].allVisits) {
                if (this.state.selectedFields[category].allVisits.hasOwnProperty(key)) {
                  var temp = [];
                  temp.push(this.state.filter.session[j]);
                  // Add the visit to the temp variable then add to the sessions to be queried
                  temp.push(key);
                  sessionInfo.push(temp);
                }
              }
            }
          }
          DocTypes.push(category);
          // keep track of the number of requests waiting for a response
          semaphore++;
          sectionedSessions = JSON.stringify(sessionInfo);
          $.ajax({
            type: 'POST',
            url: loris.BaseURL + '/AjaxHelper.php' + '?Module=dataquery&script=retrieveCategoryDocs.php',
            data: {
              DocType: category,
              Sessions: sectionedSessions
            },
            dataType: 'text',
            success: function success(data) {
              if (data) {
                var _i3;
                var row;
                var rows;
                var identifier;
                var sessiondata = _this7.state.sessiondata;
                data = JSON.parse(data);
                rows = data.rows;
                for (_i3 = 0; _i3 < rows.length; _i3 += 1) {
                  /*
                   * each row is a JSON object of the
                   * form:
                   * {
                   *  "key" : [category, pscid, vl],
                   *  "value" : [pscid, vl],
                   *  "doc": {
                   *      Meta: { stuff }
                   *      data: { "FieldName" : "Value", .. }
                   * }
                   */
                  row = rows[_i3];
                  identifier = row.value;
                  if (!sessiondata.hasOwnProperty(identifier)) {
                    sessiondata[identifier] = {};
                  }
                  sessiondata[identifier][row.key[0]] = row.doc;
                }
                _this7.setState({
                  'sessiondata': sessiondata
                });
              }
              semaphore--;
              ajaxComplete();
            }
          });
        }
      }
    }

    /**
     * Build the queried data to be displayed in the data table
     * @param {number} displayID
     * @return {object}
     */
  }, {
    key: "getRowData",
    value: function getRowData(displayID) {
      var sessiondata = this.state.sessiondata;
      var fields = this.state.fields.sort();
      var downloadableFields = this.state.downloadableFields;
      var i;
      var rowdata = [];
      var currow = [];
      var Identifiers = [];
      var RowHeaders = [];
      var fileData = [];
      var href;
      if (displayID === 0) {
        // Displaying the data in the cross-sectional way

        // Add the fields as the tables headers
        for (i = 0; fields && i < fields.length; i += 1) {
          RowHeaders.push(fields[i]);
        }

        // Build the table rows, using the session data as the row identifier
        for (var session in sessiondata) {
          if (sessiondata.hasOwnProperty(session)) {
            currow = [];
            for (i = 0; fields && i < fields.length; i += 1) {
              var fieldSplit = fields[i].split(',');
              currow[i] = '.';
              var sd = sessiondata[session];
              if (sd[fieldSplit[0]] && sd[fieldSplit[0]].data[fieldSplit[1]] && downloadableFields[fields[i]]) {
                // If the current field has data and is downloadable, create a download link
                href = loris.BaseURL + '/mri/jiv/get_file.php?file=' + sd[fieldSplit[0]].data[fieldSplit[1]];
                currow[i] = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("a", {
                  href: href
                }, sd[fieldSplit[0]].data[fieldSplit[1]]);
                fileData.push('file/' + sd[fieldSplit[0]]._id + '/' + encodeURIComponent(sd[fieldSplit[0]].data[fieldSplit[1]]));
              } else if (sd[fieldSplit[0]]) {
                // else if field is not null add data and string
                currow[i] = sd[fieldSplit[0]].data[fieldSplit[1]];
              }
            }
            rowdata.push(currow);
            Identifiers.push(session);
          }
        }
      } else {
        // Displaying the data in the longitudinal way

        var Visits = {};
        var visit;
        var identifier;
        var temp;
        var colHeader;
        var index;
        var instrument;
        var _fieldSplit;

        // Loop trough session data building the row identifiers and desired visits
        for (var _session in sessiondata) {
          if (sessiondata.hasOwnProperty(_session)) {
            temp = _session.split(',');
            visit = temp[1];
            if (!Visits[visit]) {
              Visits[visit] = true;
            }
            identifier = temp[0];
            if (Identifiers.indexOf(identifier) === -1) {
              Identifiers.push(identifier);
            }
          }
        }

        // Loop through the desired fields, adding a row header for each visit if it
        // has been selected in the build phase
        for (i = 0; fields && i < fields.length; i += 1) {
          for (visit in Visits) {
            if (Visits.hasOwnProperty(visit)) {
              temp = fields[i].split(',');
              instrument = this.state.selectedFields[temp[0]];
              if (instrument && instrument[temp[1]] && instrument[temp[1]][visit]) {
                RowHeaders.push(visit + ' ' + fields[i]);
              }
            }
          }
        }

        // Build the row data for the giving identifiers and headers
        for (identifier in Identifiers) {
          if (Identifiers.hasOwnProperty(identifier)) {
            currow = [];
            for (colHeader in RowHeaders) {
              if (RowHeaders.hasOwnProperty(colHeader)) {
                temp = Identifiers[identifier] + ',' + RowHeaders[colHeader].split(' ')[0];
                index = sessiondata[temp];
                if (!index) {
                  currow.push('.');
                } else {
                  temp = index[RowHeaders[colHeader].split(',')[0].split(' ')[1]];
                  _fieldSplit = RowHeaders[colHeader].split(' ')[1].split(',');
                  if (temp) {
                    if (temp.data[RowHeaders[colHeader].split(',')[1]] && downloadableFields[_fieldSplit[0] + ',' + _fieldSplit[1]]) {
                      // Add a downloadable link if the field is set and downloadable
                      href = loris.BaseURL + '/mri/jiv/get_file.php?file=' + temp.data[RowHeaders[colHeader].split(',')[1]];
                      temp = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("a", {
                        href: href
                      }, temp.data[RowHeaders[colHeader].split(',')[1]]);
                    } else {
                      temp = temp.data[RowHeaders[colHeader].split(',')[1]];
                    }
                  } else {
                    temp = '.';
                  }
                  currow.push(temp);
                }
              }
            }
            rowdata.push(currow);
          }
        }
      }
      return {
        rowdata: rowdata,
        Identifiers: Identifiers,
        RowHeaders: RowHeaders,
        fileData: fileData
      };
    }

    /**
     * Used to dismiss alerts
     */
  }, {
    key: "dismissAlert",
    value: function dismissAlert() {
      this.setState({
        alertLoaded: false,
        alertSaved: false,
        alertConflict: {
          show: false
        }
      });
    }

    /**
     * Used to reset the current query
     */
  }, {
    key: "resetQuery",
    value: function resetQuery() {
      this.setState({
        fields: [],
        criteria: {},
        selectedFields: {}
      });
    }

    /**
     * Change the display format of the data table
     * @param {number} displayID
     */
  }, {
    key: "changeDataDisplay",
    value: function changeDataDisplay(displayID) {
      var rowdata = this.getRowData(displayID);
      this.setState({
        grouplevel: displayID,
        rowData: rowdata
      });
    }

    /**
     * Update the filter
     * @param {object} filter
     */
  }, {
    key: "updateFilter",
    value: function updateFilter(filter) {
      if (filter.children.length === 0) {
        filter.session = this.props.AllSessions;
      }
      this.setState({
        filter: filter
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
      var tabs = [];
      var alert = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", null);

      // Add the info tab
      tabs.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(InfoTabPane, {
        key: "Info",
        TabId: "Info",
        UpdatedTime: this.props.UpdatedTime,
        Loading: this.state.loading,
        Active: this.state.ActiveTab == 'Info'
      }));

      // Add the field select tab
      tabs.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(FieldSelectTabPane, {
        key: "DefineFields",
        TabId: "DefineFields",
        categories: this.props.categories,
        onFieldChange: this.fieldChange,
        selectedFields: this.state.selectedFields,
        Visits: this.props.Visits,
        fieldVisitSelect: this.fieldVisitSelect,
        Loading: this.state.loading,
        Active: this.state.ActiveTab == 'DefineFields'
      }));

      // Add the filter builder tab
      tabs.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(FilterSelectTabPane, {
        key: "DefineFilters",
        TabId: "DefineFilters",
        categories: this.props.categories,
        filter: this.state.filter,
        updateFilter: this.updateFilter,
        Visits: this.props.Visits,
        Loading: this.state.loading,
        Active: this.state.ActiveTab == 'DefineFilters'
      }));

      // Define the data displayed type and add the view data tab
      var displayType = this.state.grouplevel === 0 ? 'Cross-sectional' : 'Longitudinal';
      tabs.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(ViewDataTabPane, {
        key: "ViewData",
        TabId: "ViewData",
        Active: this.state.ActiveTab == 'ViewData',
        Fields: this.state.fields,
        Criteria: this.state.criteria,
        Sessions: this.getSessions(),
        Data: this.state.rowData.rowdata,
        RowInfo: this.state.rowData.Identifiers,
        RowHeaders: this.state.rowData.RowHeaders,
        FileData: this.state.rowData.fileData,
        onRunQueryClicked: this.runQuery,
        displayType: displayType,
        changeDataDisplay: this.changeDataDisplay,
        Loading: this.state.loading,
        runQuery: this.runQuery
      }));

      // Add the stats tab
      tabs.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(StatsVisualizationTabPane, {
        key: "Statistics",
        TabId: "Statistics",
        Active: this.state.ActiveTab == 'Statistics',
        Fields: this.state.rowData.RowHeaders,
        Data: this.state.rowData.rowdata,
        Loading: this.state.loading
      }));

      // Add the manage saved queries tab
      tabs.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(ManageSavedQueriesTabPane, {
        key: "SavedQueriesTab",
        TabId: "SavedQueriesTab",
        userQueries: this.state.queryIDs.User,
        globalQueries: this.state.queryIDs.Shared,
        onSaveQuery: this.saveCurrentQuery,
        queryDetails: this.state.savedQueries,
        queriesLoaded: this.state.queriesLoaded,
        Loading: this.state.loading
      }));

      // Display load alert if alert is present
      if (this.state.alertLoaded) {
        alert = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
          className: "alert alert-success",
          role: "alert"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("button", {
          type: "button",
          className: "close",
          "aria-label": "Close",
          onClick: this.dismissAlert
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("span", {
          "aria-hidden": "true"
        }, "\xD7")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("strong", null, "Success"), " Query Loaded.");
      }

      // Display save alert if alert is present
      if (this.state.alertSaved) {
        alert = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
          className: "alert alert-success",
          role: "alert"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("button", {
          type: "button",
          className: "close",
          "aria-label": "Close",
          onClick: this.dismissAlert
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("span", {
          "aria-hidden": "true"
        }, "\xD7")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("strong", null, "Success"), " Query Saved.");
      }

      // Display Conflict Query alert
      if (this.state.alertConflict.show) {
        alert = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
          className: "alert alert-warning",
          role: "alert"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("button", {
          type: "button",
          className: "close",
          "aria-label": "Close",
          onClick: this.dismissAlert
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("span", {
          "aria-hidden": "true"
        }, "\xD7")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("button", {
          type: "button",
          className: "close",
          "aria-label": "Close",
          onClick: this.dismissAlert
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("span", {
          "aria-hidden": "true"
        }, "Override")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("strong", null, "Error"), " Query with the same name already exists.", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("a", {
          href: "#",
          "class": "alert-link",
          onClick: this.overrideQuery
        }, "Click here to override"));
      }
      var widthClass = 'col-md-12';
      var sideBar = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", null);

      // Display the field sidebar for certain tabs
      if (this.state.fields.length > 0 && this.state.ActiveTab !== 'ViewData' && this.state.ActiveTab !== 'Statistics' && this.state.ActiveTab !== 'Info') {
        widthClass = 'col-md-10';
        sideBar = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
          className: "col-md-2"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(FieldsSidebar, {
          Fields: this.state.fields,
          Criteria: this.state.criteria,
          resetQuery: this.resetQuery
        }));
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", null, alert, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: widthClass
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("nav", {
        className: "nav nav-tabs"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("ul", {
        className: "nav nav-tabs navbar-left",
        "data-tabs": "tabs"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("li", {
        role: "presentation",
        onClick: this.onTabChangeHandler,
        className: "active"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("a", {
        href: "#Info",
        "data-toggle": "tab"
      }, "Info")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("li", {
        role: "presentation",
        onClick: this.onTabChangeHandler
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("a", {
        href: "#DefineFields",
        "data-toggle": "tab"
      }, "Define Fields")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("li", {
        role: "presentation",
        onClick: this.onTabChangeHandler
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("a", {
        href: "#DefineFilters",
        "data-toggle": "tab"
      }, "Define Filters")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("li", {
        role: "presentation",
        onClick: this.onTabChangeHandler
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("a", {
        href: "#ViewData",
        "data-toggle": "tab"
      }, "View Data")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("li", {
        role: "presentation",
        onClick: this.onTabChangeHandler
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("a", {
        href: "#Statistics",
        "data-toggle": "tab"
      }, "Statistical Analysis"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(SavedQueriesList, {
        userQueries: this.state.queryIDs.User,
        globalQueries: this.state.queryIDs.Shared,
        queryDetails: this.state.savedQueries,
        queriesLoaded: this.state.queriesLoaded,
        onSelectQuery: this.loadSavedQuery,
        loadedQuery: this.state.loadedQuery
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "tab-content"
      }, tabs)), sideBar);
    }
  }]);
  return DataQueryApp;
}(react__WEBPACK_IMPORTED_MODULE_6__["Component"]);
DataQueryApp.propTypes = {
  SavedQueries: prop_types__WEBPACK_IMPORTED_MODULE_7___default.a.object,
  AllSessions: prop_types__WEBPACK_IMPORTED_MODULE_7___default.a.array
};
DataQueryApp.defaultProps = {
  SavedQueries: {},
  AllSessions: []
};
window.SavedQueriesList = SavedQueriesList;
window.DataQueryApp = DataQueryApp;
window.RDataQueryApp = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createFactory(DataQueryApp);
/* harmony default export */ __webpack_exports__["default"] = (DataQueryApp);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 2 */
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
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(5);
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
  if (superClass) setPrototypeOf(subClass, superClass);
}
module.exports = _inherits, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _setPrototypeOf(o, p);
}
module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(7)["default"];
var assertThisInitialized = __webpack_require__(3);
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return assertThisInitialized(self);
}
module.exports = _possibleConstructorReturn, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

function _typeof(obj) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _getPrototypeOf(o);
}
module.exports = _getPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

(function() { module.exports = window["React"]; }());

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var ReactIs = __webpack_require__(11);

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(13)(ReactIs.isElement, throwOnDirectAccess);
} else {}


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(12);
}


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactIs = __webpack_require__(11);
var assign = __webpack_require__(14);

var ReactPropTypesSecret = __webpack_require__(15);
var has = __webpack_require__(16);
var checkPropTypes = __webpack_require__(17);

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
       true ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : undefined;
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

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
/* 16 */
/***/ (function(module, exports) {

module.exports = Function.call.bind(Object.prototype.hasOwnProperty);


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (true) {
  var ReactPropTypesSecret = __webpack_require__(15);
  var loggedTypeFailures = {};
  var has = __webpack_require__(16);

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


/***/ })
/******/ ]);
//# sourceMappingURL=react.app.js.map