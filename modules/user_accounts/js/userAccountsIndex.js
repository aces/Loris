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
/******/ 	return __webpack_require__(__webpack_require__.s = "./modules/user_accounts/jsx/userAccountsIndex.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./jsx/DataTable.js":
/*!**************************!*\
  !*** ./jsx/DataTable.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _PaginationLinks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PaginationLinks */ "./jsx/PaginationLinks.js");
/* harmony import */ var react_addons_create_fragment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-addons-create-fragment */ "./node_modules/react-addons-create-fragment/index.js");
/* harmony import */ var react_addons_create_fragment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_addons_create_fragment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _Form__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Form */ "./jsx/Form.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

/**
 * This file contains React component for Data Table
 *
 * @author Loris Team
 * @version 1.0.0
 *
 */





/**
 * Data Table component
 * Displays a set of data that is receives via props.
 */

var DataTable =
/*#__PURE__*/
function (_Component) {
  _inherits(DataTable, _Component);

  function DataTable(props) {
    var _this;

    _classCallCheck(this, DataTable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DataTable).call(this, props));
    _this.state = {
      PageNumber: 1,
      SortColumn: -1,
      SortOrder: 'ASC',
      RowsPerPage: 20,
      Hide: _this.props.Hide
    };
    _this.changePage = _this.changePage.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.setSortColumn = _this.setSortColumn.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.changeRowsPerPage = _this.changeRowsPerPage.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.downloadCSV = _this.downloadCSV.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.countFilteredRows = _this.countFilteredRows.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.getSortedRows = _this.getSortedRows.bind(_assertThisInitialized(_assertThisInitialized(_this))); //

    _this.hasFilterKeyword = _this.hasFilterKeyword.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.renderActions = _this.renderActions.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(DataTable, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (jQuery.fn.DynamicTable) {
        if (this.props.freezeColumn) {
          $('#dynamictable').DynamicTable({
            freezeColumn: this.props.freezeColumn
          });
        } else {
          $('#dynamictable').DynamicTable();
        }

        if (this.state.Hide.defaultColumn) {
          $('#dynamictable').find('tbody td:eq(0)').hide();
        }
      } // Retrieve module preferences


      var modulePrefs = JSON.parse(localStorage.getItem('modulePrefs')); // Init modulePrefs object

      if (modulePrefs === null) {
        modulePrefs = {};
      } // Init modulePrefs for current module


      if (modulePrefs[loris.TestName] === undefined) {
        modulePrefs[loris.TestName] = {};
        modulePrefs[loris.TestName].rowsPerPage = this.state.RowsPerPage;
      } // Set rows per page


      var rowsPerPage = modulePrefs[loris.TestName].rowsPerPage;
      this.setState({
        RowsPerPage: rowsPerPage
      }); // Make prefs accesible within component

      this.modulePrefs = modulePrefs;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (jQuery.fn.DynamicTable) {
        if (this.props.freezeColumn) {
          $('#dynamictable').DynamicTable({
            freezeColumn: this.props.freezeColumn
          });
        } else {
          $('#dynamictable').DynamicTable();
        }
      }

      if (this.props.onSort && (this.state.SortColumn !== prevState.SortColumn || this.state.SortOrder !== prevState.SortOrder)) {
        var index = this.getSortedRows();
        var headerList = this.props.fields.map(function (field) {
          return field.label;
        });
        this.props.onSort(index, this.props.data, headerList);
      }
    }
  }, {
    key: "changePage",
    value: function changePage(pageNo) {
      this.setState({
        PageNumber: pageNo
      });
    }
  }, {
    key: "setSortColumn",
    value: function setSortColumn(colNumber) {
      return function (e) {
        if (this.state.SortColumn === colNumber) {
          this.setState({
            SortOrder: this.state.SortOrder === 'ASC' ? 'DESC' : 'ASC'
          });
        } else {
          this.setState({
            SortColumn: colNumber
          });
        }
      };
    }
  }, {
    key: "changeRowsPerPage",
    value: function changeRowsPerPage(val) {
      var rowsPerPage = val.target.value;
      var modulePrefs = this.modulePrefs; // Save current selection

      modulePrefs[loris.TestName].rowsPerPage = rowsPerPage; // Update localstorage

      localStorage.setItem('modulePrefs', JSON.stringify(modulePrefs));
      this.setState({
        RowsPerPage: rowsPerPage,
        PageNumber: 1
      });
    }
  }, {
    key: "downloadCSV",
    value: function downloadCSV(csvData) {
      var csvworker = new Worker(loris.BaseURL + '/js/workers/savecsv.js');
      csvworker.addEventListener('message', function (e) {
        var dataURL;
        var dataDate;
        var link;

        if (e.data.cmd === 'SaveCSV') {
          dataDate = new Date().toISOString();
          dataURL = window.URL.createObjectURL(e.data.message);
          link = document.createElement('a');
          link.download = 'data-' + dataDate + '.csv';
          link.type = 'text/csv';
          link.href = dataURL;
          document.body.appendChild(link);
          $(link)[0].click();
          document.body.removeChild(link);
        }
      });
      var headerList = this.props.fields.map(function (field) {
        return field.label;
      });
      csvworker.postMessage({
        cmd: 'SaveFile',
        data: csvData,
        headers: headerList,
        identifiers: this.props.RowNameMap
      });
    }
  }, {
    key: "countFilteredRows",
    value: function countFilteredRows() {
      var useKeyword = false;
      var filterMatchCount = 0;
      var filterValuesCount = this.props.filter ? Object.keys(this.props.filter).length : 0;
      var tableData = this.props.data;
      var fieldData = this.props.fields;

      if (this.props.filter.keyword) {
        useKeyword = true;
      }

      if (useKeyword) {
        filterValuesCount -= 1;
      }

      for (var i = 0; i < tableData.length; i++) {
        var headerCount = 0;
        var keywordMatch = 0;

        for (var j = 0; j < fieldData.length; j++) {
          var data = tableData[i] ? tableData[i][j] : null;

          if (this.hasFilterKeyword((fieldData[j].filter || {}).name, data)) {
            headerCount++;
          }

          if (useKeyword) {
            if (this.hasFilterKeyword('keyword', data)) {
              keywordMatch++;
            }
          }
        }

        if (headerCount === filterValuesCount && (useKeyword === true && keywordMatch > 0 || useKeyword === false && keywordMatch === 0)) {
          filterMatchCount++;
        }
      }

      var hasFilters = filterValuesCount !== 0;

      if (filterMatchCount === 0 && hasFilters) {
        return 0;
      }

      return filterMatchCount === 0 ? tableData.length : filterMatchCount;
    }
  }, {
    key: "getSortedRows",
    value: function getSortedRows() {
      var index = [];

      for (var i = 0; i < this.props.data.length; i += 1) {
        var val = this.props.data[i][this.state.SortColumn] || undefined; // If SortColumn is equal to default No. column, set value to be
        // index + 1

        if (this.state.SortColumn === -1) {
          val = i + 1;
        }

        var isString = typeof val === 'string' || val instanceof String;
        var isNumber = !isNaN(val) && _typeof(val) !== 'object';

        if (val === '.') {
          // hack to handle non-existent items in DQT
          val = null;
        } else if (isNumber) {
          // perform type conversion (from string to int/float)
          val = Number(val);
        } else if (isString) {
          // if string with text convert to lowercase
          val = val.toLowerCase();
        } else {
          val = undefined;
        }

        if (this.props.RowNameMap) {
          index.push({
            RowIdx: i,
            Value: val,
            Content: this.props.RowNameMap[i]
          });
        } else {
          index.push({
            RowIdx: i,
            Value: val,
            Content: i + 1
          });
        }
      }

      index.sort(function (a, b) {
        if (this.state.SortOrder === 'ASC') {
          if (a.Value === b.Value) {
            // If all values are equal, sort by rownum
            if (a.RowIdx < b.RowIdx) return -1;
            if (a.RowIdx > b.RowIdx) return 1;
          } // Check if null values


          if (a.Value === null || typeof a.Value === 'undefined') return -1;
          if (b.Value === null || typeof b.Value === 'undefined') return 1; // Sort by value

          if (a.Value < b.Value) return -1;
          if (a.Value > b.Value) return 1;
        } else {
          if (a.Value === b.Value) {
            // If all values are equal, sort by rownum
            if (a.RowIdx < b.RowIdx) return 1;
            if (a.RowIdx > b.RowIdx) return -1;
          } // Check if null values


          if (a.Value === null || typeof a.Value === 'undefined') return 1;
          if (b.Value === null || typeof b.Value === 'undefined') return -1; // Sort by value

          if (a.Value < b.Value) return 1;
          if (a.Value > b.Value) return -1;
        } // They're equal..


        return 0;
      }.bind(this));
      return index;
    }
    /**
     * Searches for the filter keyword in the column cell
     *
     * Note: Search is case-insensitive.
     *
     * @param {string} name field name
     * @param {string} data search string
     * @return {boolean} true, if filter value is found to be a substring
     * of one of the column values, false otherwise.
     */

  }, {
    key: "hasFilterKeyword",
    value: function hasFilterKeyword(name, data) {
      var filterData = null;
      var exactMatch = false;
      var result = false;
      var searchKey = null;
      var searchString = null;

      if (this.props.filter[name]) {
        filterData = this.props.filter[name].value;
        exactMatch = this.props.filter[name].exactMatch;
      } // Handle null inputs


      if (filterData === null || data === null) {
        return false;
      } // Handle numeric inputs


      if (typeof filterData === 'number') {
        var intData = Number.parseInt(data, 10);
        result = filterData === intData;
      } // Handle string inputs


      if (typeof filterData === 'string') {
        searchKey = filterData.toLowerCase();

        switch (_typeof(data)) {
          case 'object':
            // Handles the case where the data is an array (typeof 'object')
            // and you want to search through it for
            // the string you are filtering by
            var searchArray = data.map(function (e) {
              return e.toLowerCase();
            });

            if (exactMatch) {
              result = searchArray.includes(searchKey);
            } else {
              result = searchArray.find(function (e) {
                return e.indexOf(searchKey) > -1;
              }) !== undefined;
            }

            break;

          default:
            searchString = data.toLowerCase();

            if (exactMatch) {
              result = searchString === searchKey;
            } else {
              result = searchString.indexOf(searchKey) > -1;
            }

            break;
        }
      } // Handle array inputs for multiselects


      if (_typeof(filterData) === 'object') {
        var match = false;

        for (var i = 0; i < filterData.length; i += 1) {
          searchKey = filterData[i].toLowerCase();
          searchString = data.toLowerCase();
          match = searchString.indexOf(searchKey) > -1;

          if (match) {
            result = true;
          }
        }
      }

      return result;
    }
  }, {
    key: "renderActions",
    value: function renderActions() {
      if (this.props.actions) {
        return this.props.actions.map(function (action, key) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Form__WEBPACK_IMPORTED_MODULE_4__["default"], {
            key: key,
            label: action.label,
            onUserInput: action.action
          });
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      if (this.props.data === null || this.props.data.length === 0) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "alert alert-info no-result-found-panel"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, "No result found."));
      }

      var rowsPerPage = this.state.RowsPerPage;
      var headers = this.state.Hide.defaultColumn === true ? [] : [react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
        key: "th_col_0",
        onClick: this.setSortColumn(-1).bind(this)
      }, this.props.RowNumLabel)];

      for (var i = 0; i < this.props.fields.length; i += 1) {
        if (this.props.fields[i].show === true) {
          var colIndex = i + 1;

          if (this.props.fields[i].freezeColumn === true) {
            headers.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
              key: 'th_col_' + colIndex,
              id: this.props.freezeColumn,
              onClick: this.setSortColumn(i).bind(this)
            }, this.props.fields[i].label));
          } else {
            headers.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
              key: 'th_col_' + colIndex,
              onClick: this.setSortColumn(i).bind(this)
            }, this.props.fields[i].label));
          }
        }
      }

      var rows = [];
      var curRow = [];
      var index = this.getSortedRows();
      var matchesFound = 0; // Keeps track of how many rows where displayed so far across all pages

      var filteredRows = this.countFilteredRows();
      var currentPageRow = rowsPerPage * (this.state.PageNumber - 1);
      var filteredData = [];
      var useKeyword = false;

      if (this.props.filter.keyword) {
        useKeyword = true;
      } // Push rows to data table


      var _loop = function _loop(_i) {
        curRow = []; // Counts filter matches

        var filterMatchCount = 0;
        var keywordMatch = 0;
        var filterLength = 0; // Iterates through headers to populate row columns
        // with corresponding data

        for (var j = 0; j < _this2.props.fields.length; j += 1) {
          var data = 'Unknown'; // Set column data

          if (_this2.props.data[index[_i].RowIdx]) {
            data = _this2.props.data[index[_i].RowIdx][j];
          }

          if (_this2.props.fields[j].filter) {
            if (_this2.hasFilterKeyword(_this2.props.fields[j].filter.name, data)) {
              filterMatchCount++;
              filteredData.push(_this2.props.data[index[_i].RowIdx]);
            }
          }

          if (useKeyword === true) {
            filterLength = Object.keys(_this2.props.filter).length - 1;

            if (_this2.hasFilterKeyword('keyword', data)) {
              keywordMatch++;
            }
          } else {
            filterLength = Object.keys(_this2.props.filter).length;
          }

          var key = 'td_col_' + j; // Get custom cell formatting if available

          if (_this2.props.getFormattedCell) {
            if (_this2.props.fields[j].show === false) {
              data = null;
            } else {
              (function () {
                // create mapping between rowHeaders and rowData in a row Object
                var row = {};

                _this2.props.fields.forEach(function (field, k) {
                  row[field.label] = _this2.props.data[index[_i].RowIdx][k];
                });

                data = _this2.props.getFormattedCell(_this2.props.fields[j].label, data, row);
              })();
            }

            if (data !== null) {
              // Note: Can't currently pass a key, need to update columnFormatter
              // to not return a <td> node. Using createFragment instead.
              curRow.push(react_addons_create_fragment__WEBPACK_IMPORTED_MODULE_3___default()({
                data: data
              }));
            }
          } else {
            curRow.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
              key: key
            }, data));
          }
        } // Only display a row if all filter values have been matched


        if (filterLength === filterMatchCount && (useKeyword === true && keywordMatch > 0 || useKeyword === false && keywordMatch === 0)) {
          matchesFound++;

          if (matchesFound > currentPageRow) {
            var rowIndex = index[_i].Content;
            rows.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
              key: 'tr_' + rowIndex,
              colSpan: headers.length
            }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, rowIndex), curRow));
          }
        }
      };

      for (var _i = 0; _i < this.props.data.length && rows.length < rowsPerPage; _i++) {
        _loop(_i);
      }

      var RowsPerPageDropdown = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("select", {
        className: "input-sm perPage",
        onChange: this.changeRowsPerPage,
        value: this.state.RowsPerPage
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", null, "20"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", null, "50"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", null, "100"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", null, "1000"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", null, "5000"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", null, "10000")); // Include only filtered data if filters were applied

      var csvData = this.props.data;

      if (this.props.filter && filteredData.length > 0) {
        csvData = filteredData;
      }

      var header = this.state.Hide.rowsPerPage === true ? '' : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "table-header"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-xs-12"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, rows.length, " rows displayed of ", filteredRows, ". (Maximum rows per page: ", RowsPerPageDropdown, ")"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "pull-right",
        style: {
          marginTop: '-43px'
        }
      }, this.renderActions(), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        onClick: this.downloadCSV.bind(null, csvData)
      }, "Download Table as CSV"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_PaginationLinks__WEBPACK_IMPORTED_MODULE_2__["default"], {
        Total: filteredRows,
        onChangePage: this.changePage,
        RowsPerPage: rowsPerPage,
        Active: this.state.PageNumber
      })))));
      var footer = this.state.Hide.downloadCSV === true ? '' : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-xs-12",
        style: {
          marginTop: '10px'
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "footerText"
      }, rows.length, " rows displayed of ", filteredRows, ". (Maximum rows per page: ", RowsPerPageDropdown, ")"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "pull-right",
        style: {
          marginTop: '-23px'
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_PaginationLinks__WEBPACK_IMPORTED_MODULE_2__["default"], {
        Total: filteredRows,
        onChangePage: this.changePage,
        RowsPerPage: rowsPerPage,
        Active: this.state.PageNumber
      })))));
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: {
          margin: '14px'
        }
      }, header, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
        className: "table table-hover table-primary table-bordered",
        id: "dynamictable"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
        className: "info"
      }, headers)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, rows)), footer);
    }
  }]);

  return DataTable;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

DataTable.propTypes = {
  data: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array.isRequired,
  RowNumLabel: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  // Function of which returns a JSX element for a table cell, takes
  // parameters of the form: func(ColumnName, CellData, EntireRowData)
  getFormattedCell: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  onSort: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  Hide: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object,
  actions: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object
};
DataTable.defaultProps = {
  RowNumLabel: 'No.',
  filter: {},
  Hide: {
    rowsPerPage: false,
    downloadCSV: false,
    defaultColumn: false
  }
};
/* harmony default export */ __webpack_exports__["default"] = (DataTable);

/***/ }),

/***/ "./jsx/Filter.js":
/*!***********************!*\
  !*** ./jsx/Filter.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }



/**
 * Filter component.
 * A wrapper for form elements inside a selection filter.
 *
 * Constructs filter fields based on this.props.fields configuration object
 *
 * Alters the filter object and sends it to parent on every update.
 *
 */

var Filter =
/*#__PURE__*/
function (_Component) {
  _inherits(Filter, _Component);

  function Filter(props) {
    var _this;

    _classCallCheck(this, Filter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Filter).call(this, props));
    _this.onFieldUpdate = _this.onFieldUpdate.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.renderFilterFields = _this.renderFilterFields.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }
  /**
   * Sets filter object to reflect values of input fields.
   *
   * @param {string} name - form element type (i.e component name)
   * @param {string} value - the name of the form element
   * @param {string} id - id of the form element
   * @param {string} type - type of the form element
   */


  _createClass(Filter, [{
    key: "onFieldUpdate",
    value: function onFieldUpdate(name, value, id, type) {
      var filter = JSON.parse(JSON.stringify(this.props.filter));
      var exactMatch = type === 'textbox' ? false : true;

      if (value === null || value === '') {
        delete filter[name];
      } else {
        filter[name] = {
          value: value,
          exactMatch: exactMatch
        };
      }

      this.props.updateFilter(filter);
    }
  }, {
    key: "renderFilterFields",
    value: function renderFilterFields() {
      var _this2 = this;

      return this.props.fields.reduce(function (result, field) {
        var filter = field.filter;

        if (filter && filter.hide !== true) {
          var element;

          switch (filter.type) {
            case 'text':
              element = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TextboxElement, {
                key: filter.name
              });
              break;

            case 'select':
              element = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SelectElement, {
                key: filter.name,
                options: filter.options
              });
              break;

            case 'multiselect':
              element = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SelectElement, {
                key: filter.name,
                options: filter.options,
                multiple: true
              });
              break;

            case 'date':
              element = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(DateElement, {
                key: filter.name
              });
              break;

            default:
              element = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TextboxElement, {
                key: filter.name
              });
          }

          result.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.cloneElement(element, {
            name: filter.name,
            label: field.label,
            value: (_this2.props.filter[filter.name] || {}).value,
            onUserInput: _this2.onFieldUpdate
          }));
        }

        return result;
      }, []);
    }
  }, {
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FormElement, {
        id: this.props.id,
        name: this.props.name
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FieldsetElement, {
        columns: this.props.columns,
        legend: this.props.title
      }, this.renderFilterFields(), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ButtonElement, {
        label: "Clear Filters",
        type: "reset",
        onUserInput: this.props.clearFilter
      })));
    }
  }]);

  return Filter;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

Filter.defaultProps = {
  id: null,
  clearFilter: function clearFilter() {
    console.warn('onUpdate() callback is not set!');
  },
  columns: 1
};
Filter.propTypes = {
  filter: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object.isRequired,
  clearFilter: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func.isRequired,
  id: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  name: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  columns: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  title: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  fields: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object.isRequired
};
/* harmony default export */ __webpack_exports__["default"] = (Filter);

/***/ }),

/***/ "./jsx/FilterableDataTable.js":
/*!************************************!*\
  !*** ./jsx/FilterableDataTable.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Panel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Panel */ "./jsx/Panel.js");
/* harmony import */ var _DataTable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DataTable */ "./jsx/DataTable.js");
/* harmony import */ var _Filter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Filter */ "./jsx/Filter.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }






/**
 * FilterableDataTable component.
 * A wrapper for all datatables that handles filtering.
 *
 * Handles the updating and clearing of the filter state based on changes sent
 * from the FilterForm.
 *
 * Passes the Filter to the Datatable.
 *
 * Deprecates Filter Form.
 */

var FilterableDataTable =
/*#__PURE__*/
function (_Component) {
  _inherits(FilterableDataTable, _Component);

  function FilterableDataTable(props) {
    var _this;

    _classCallCheck(this, FilterableDataTable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterableDataTable).call(this, props));
    _this.state = {
      filter: {}
    };
    _this.updateFilter = _this.updateFilter.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.clearFilter = _this.clearFilter.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }
  /**
   * Updates filter state
   *
   * @param {object} filter passed from FilterForm
   */


  _createClass(FilterableDataTable, [{
    key: "updateFilter",
    value: function updateFilter(filter) {
      this.setState({
        filter: filter
      });
    }
    /**
     * Sets Filter to empty object
     */

  }, {
    key: "clearFilter",
    value: function clearFilter() {
      this.updateFilter({});
    }
  }, {
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Panel__WEBPACK_IMPORTED_MODULE_2__["default"], {
        title: this.props.title
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Filter__WEBPACK_IMPORTED_MODULE_4__["default"], {
        name: this.props.name + '_filter',
        id: this.props.name + '_filter',
        title: "Selection Filter",
        columns: this.props.columns,
        filter: this.state.filter,
        fields: this.props.fields,
        updateFilter: this.updateFilter,
        clearFilter: this.clearFilter
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_DataTable__WEBPACK_IMPORTED_MODULE_3__["default"], {
        data: this.props.data,
        fields: this.props.fields,
        filter: this.state.filter,
        getFormattedCell: this.props.getFormattedCell,
        actions: this.props.actions
      }));
    }
  }]);

  return FilterableDataTable;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

FilterableDataTable.defaultProps = {
  columns: 3
};
FilterableDataTable.propTypes = {
  name: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  title: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  data: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object.isRequired,
  filter: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object.isRequired,
  fields: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object.isRequired,
  columns: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  getFormattedCell: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  actions: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object
};
/* harmony default export */ __webpack_exports__["default"] = (FilterableDataTable);

/***/ }),

/***/ "./jsx/Form.js":
/*!*********************!*\
  !*** ./jsx/Form.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

/* exported FormElement, FieldsetElement, SelectElement, TagsElement, SearchableDropdown, TextareaElement,
TextboxElement, DateElement, NumericElement, FileElement, StaticElement, LinkElement,
CheckboxElement, ButtonElement, LorisElement
*/

/**
 * This file contains React components for Loris form elements.
 *
 * @author Loris Team
 * @version 1.0.0
 *
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


/**
 * FormElement Component.
 * Used for constructing form element.
 */

var FormElement =
/*#__PURE__*/
function (_Component) {
  _inherits(FormElement, _Component);

  function FormElement(props) {
    var _this;

    _classCallCheck(this, FormElement);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FormElement).call(this, props));
    _this.getFormElements = _this.getFormElements.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(FormElement, [{
    key: "getFormElements",
    value: function getFormElements() {
      var formElementsHTML = [];
      var columns = this.props.columns;
      var maxColumnSize = 12;
      var colSize = Math.floor(maxColumnSize / columns);
      var colClass = 'col-xs-12 col-sm-' + colSize + ' col-md-' + colSize; // Render elements from JSON

      var filter = this.props.formElements;
      Object.keys(filter).forEach(function (objKey, index) {
        var userInput = this.props.onUserInput ? this.props.onUserInput : filter[objKey].onUserInput;
        var value = filter[objKey].value ? filter[objKey].value : '';
        formElementsHTML.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          key: 'el_' + index,
          className: colClass
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LorisElement, {
          element: filter[objKey],
          onUserInput: userInput,
          value: value
        })));
      }.bind(this)); // Render elements from React

      react__WEBPACK_IMPORTED_MODULE_0___default.a.Children.forEach(this.props.children, function (child, key) {
        // If child is plain HTML, insert it as full size.
        // Useful for inserting <hr> to split form sections
        var elementClass = 'col-xs-12 col-sm-12 col-md-12'; // If child is form element use appropriate size

        if (react__WEBPACK_IMPORTED_MODULE_0___default.a.isValidElement(child) && typeof child.type === 'function') {
          elementClass = colClass;
        }

        formElementsHTML.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          key: 'el_child_' + key,
          className: elementClass
        }, child));
      });
      return formElementsHTML;
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(e) {
      // Override default submit if property is set
      if (this.props.onSubmit) {
        e.preventDefault();
        this.props.onSubmit(e);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var encType = this.props.fileUpload ? 'multipart/form-data' : null; // Generate form elements

      var formElements = this.getFormElements(); // Flexbox is set to ensure that columns of different heights
      // are displayed proportionally on the screen

      var rowStyles = {
        display: 'flex',
        flexWrap: 'wrap'
      };
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        name: this.props.name,
        id: this.props.id,
        className: this.props.class,
        method: this.props.method,
        action: this.props.action,
        encType: encType,
        onSubmit: this.handleSubmit
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row",
        style: rowStyles
      }, formElements));
    }
  }]);

  return FormElement;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

FormElement.propTypes = {
  name: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  id: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  method: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOf(['POST', 'GET']),
  action: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  class: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  columns: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  formElements: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.shape({
    elementName: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.shape({
      name: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
      type: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string
    })
  }),
  onSubmit: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  onUserInput: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func
};
FormElement.defaultProps = {
  name: null,
  id: null,
  method: 'POST',
  action: undefined,
  class: 'form-horizontal',
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

var FieldsetElement =
/*#__PURE__*/
function (_Component2) {
  _inherits(FieldsetElement, _Component2);

  function FieldsetElement(props) {
    var _this2;

    _classCallCheck(this, FieldsetElement);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(FieldsetElement).call(this, props));
    _this2.getFormElements = _this2.getFormElements.bind(_assertThisInitialized(_assertThisInitialized(_this2)));
    return _this2;
  }

  _createClass(FieldsetElement, [{
    key: "getFormElements",
    value: function getFormElements() {
      var formElementsHTML = [];
      var columns = this.props.columns;
      var maxColumnSize = 12;
      var colSize = Math.floor(maxColumnSize / columns);
      var colClass = 'col-xs-12 col-sm-' + colSize + ' col-md-' + colSize; // Render elements from React

      react__WEBPACK_IMPORTED_MODULE_0___default.a.Children.forEach(this.props.children, function (child, key) {
        // If child is plain HTML, insert it as full size.
        // Useful for inserting <hr> to split form sections
        var elementClass = 'col-xs-12 col-sm-12 col-md-12'; // If child is form element use appropriate size

        if (react__WEBPACK_IMPORTED_MODULE_0___default.a.isValidElement(child) && typeof child.type === 'function') {
          elementClass = colClass;
        }

        formElementsHTML.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          key: 'el_child_' + key,
          className: elementClass
        }, child));
      });
      return formElementsHTML;
    }
  }, {
    key: "render",
    value: function render() {
      // Generate form elements
      var formElements = this.getFormElements();
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("fieldset", {
        name: this.props.name
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("legend", null, this.props.legend), formElements);
    }
  }]);

  return FieldsetElement;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

FieldsetElement.propTypes = {
  columns: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  name: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  legend: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string
};
FieldsetElement.defaultProps = {
  columns: 1,
  legend: 'Selection Filter'
};
/**
 * Search Component
 * React wrapper for a searchable dropdown
 */

var SearchableDropdown =
/*#__PURE__*/
function (_Component3) {
  _inherits(SearchableDropdown, _Component3);

  function SearchableDropdown(props) {
    var _this3;

    _classCallCheck(this, SearchableDropdown);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(SearchableDropdown).call(this, props));
    _this3.getKeyFromValue = _this3.getKeyFromValue.bind(_assertThisInitialized(_assertThisInitialized(_this3)));
    _this3.handleChange = _this3.handleChange.bind(_assertThisInitialized(_assertThisInitialized(_this3)));
    _this3.handleBlur = _this3.handleBlur.bind(_assertThisInitialized(_assertThisInitialized(_this3)));
    _this3.getTextInputValue = _this3.getTextInputValue.bind(_assertThisInitialized(_assertThisInitialized(_this3)));
    return _this3;
  }

  _createClass(SearchableDropdown, [{
    key: "getKeyFromValue",
    value: function getKeyFromValue(value) {
      var options = this.props.options;
      return Object.keys(options).find(function (o) {
        return options[o] === value;
      });
    }
  }, {
    key: "handleChange",
    value: function handleChange(e) {
      var value = this.getKeyFromValue(e.target.value); // if not in strict mode and key value is not defined (i.e., not in options)
      // set value equal to e.target.value

      if (!this.props.strictSearch && value === undefined) {
        value = e.target.value;
      }

      this.props.onUserInput(this.props.name, value);
    }
  }, {
    key: "handleBlur",
    value: function handleBlur(e) {
      // null out entry if not present in options in strict mode
      if (this.props.strictSearch) {
        var value = e.target.value;
        var options = this.props.options;

        if (Object.values(options).indexOf(value) === -1) {
          // empty string out both the hidden value as well as the input text
          document.querySelector("input[name=\"".concat(this.props.name + '_input', "\"]")).value = '';
          this.props.onUserInput(this.props.name, '');
        }
      }
    }
  }, {
    key: "getTextInputValue",
    value: function getTextInputValue() {
      return document.querySelector("input[name=\"".concat(this.props.name + '_input', "\"]")).value;
    }
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
      var elementClass = 'row form-group'; // Add required asterix

      if (required) {
        requiredHTML = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "text-danger"
        }, "*");
      } // Add error message


      if (this.props.errorMessage) {
        errorMessage = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, this.props.errorMessage);
        elementClass = 'row form-group has-error';
      } else if (this.props.required && this.props.value === '') {
        var msg = 'This field is required!';
        msg += this.props.strictSearch ? ' ' + strictMessage : '';
        errorMessage = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, msg);
        elementClass = 'row form-group has-error';
      } else if (this.props.strictSearch && this.props.value === '') {
        errorMessage = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, strictMessage);
        elementClass = 'row form-group has-error';
      } // determine value to place into text input


      var value; // use value in options if valid

      if (this.props.value !== undefined) {
        if (Object.keys(options).indexOf(this.props.value) > -1) {
          value = options[this.props.value]; // else, use input text value
        } else {
          value = this.getTextInputValue();
        }
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
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
            value: option,
            key: newOptions[option]
          });
        });
      } else {
        optionList = Object.keys(options).map(function (option) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
            value: options[option],
            key: option
          });
        });
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: elementClass
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "col-sm-3 control-label",
        htmlFor: this.props.label
      }, this.props.label, requiredHTML), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-sm-9"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
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
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("datalist", {
        id: this.props.name + '_list'
      }, optionList), errorMessage));
    }
  }]);

  return SearchableDropdown;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

SearchableDropdown.propTypes = {
  name: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  options: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object.isRequired,
  id: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  // strictSearch, if set to true, will require that only options
  // provided in the options prop can be submitted
  strictSearch: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  label: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  value: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array]),
  class: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  disabled: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  required: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  errorMessage: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  placeHolder: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  onUserInput: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func
};
SearchableDropdown.defaultProps = {
  name: '',
  options: {},
  strictSearch: true,
  label: '',
  value: undefined,
  id: null,
  class: '',
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

var SelectElement =
/*#__PURE__*/
function (_Component4) {
  _inherits(SelectElement, _Component4);

  function SelectElement(props) {
    var _this4;

    _classCallCheck(this, SelectElement);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(SelectElement).call(this, props));
    _this4.handleChange = _this4.handleChange.bind(_assertThisInitialized(_assertThisInitialized(_this4)));
    return _this4;
  }

  _createClass(SelectElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      var value = e.target.value;
      var options = e.target.options;
      var numOfOptions = options.length; // Multiple values

      if (this.props.multiple && numOfOptions > 1) {
        value = [];

        for (var i = 0, l = numOfOptions; i < l; i++) {
          if (options[i].selected) {
            value.push(options[i].value);
          }
        }
      }

      this.props.onUserInput(this.props.name, value, e.target.id, 'select');
    }
  }, {
    key: "render",
    value: function render() {
      var multiple = this.props.multiple ? 'multiple' : null;
      var required = this.props.required ? 'required' : null;
      var disabled = this.props.disabled ? 'disabled' : null;
      var sortByValue = this.props.sortByValue;
      var options = this.props.options;
      var errorMessage = null;
      var emptyOptionHTML = null;
      var requiredHTML = null;
      var elementClass = 'row form-group'; // Add required asterisk

      if (required) {
        requiredHTML = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "text-danger"
        }, "*");
      } // Add empty option


      if (this.props.emptyOption) {
        emptyOptionHTML = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", null);
      } // Add error message


      if (this.props.hasError || this.props.required && this.props.value === '') {
        errorMessage = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, this.props.errorMessage);
        elementClass = 'row form-group has-error';
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
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
            value: newOptions[option],
            key: newOptions[option]
          }, option);
        });
      } else {
        optionList = Object.keys(options).map(function (option) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
            value: option,
            key: option
          }, options[option]);
        });
      } // Default to empty string for regular select and to empty array for 'multiple' select


      var value = this.props.value || (multiple ? [] : '');
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: elementClass
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "col-sm-3 control-label",
        htmlFor: this.props.label
      }, this.props.label, requiredHTML), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-sm-9"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("select", {
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
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

SelectElement.propTypes = {
  name: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  options: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object.isRequired,
  label: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  value: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array]),
  id: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  class: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  multiple: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  disabled: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  required: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  emptyOption: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  hasError: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  errorMessage: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  onUserInput: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func
};
SelectElement.defaultProps = {
  name: '',
  options: {},
  label: '',
  value: undefined,
  id: null,
  class: '',
  multiple: false,
  disabled: false,
  required: false,
  sortByValue: true,
  emptyOption: true,
  hasError: false,
  errorMessage: 'The field is required!',
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  }
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

var TagsElement =
/*#__PURE__*/
function (_Component5) {
  _inherits(TagsElement, _Component5);

  function TagsElement(props) {
    var _this5;

    _classCallCheck(this, TagsElement);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(TagsElement).call(this, props));
    _this5.handleChange = _this5.handleChange.bind(_assertThisInitialized(_assertThisInitialized(_this5)));
    _this5.handleKeyPress = _this5.handleKeyPress.bind(_assertThisInitialized(_assertThisInitialized(_this5)));
    _this5.handleAdd = _this5.handleAdd.bind(_assertThisInitialized(_assertThisInitialized(_this5)));
    _this5.handleRemove = _this5.handleRemove.bind(_assertThisInitialized(_assertThisInitialized(_this5)));
    _this5.getKeyFromValue = _this5.getKeyFromValue.bind(_assertThisInitialized(_assertThisInitialized(_this5)));
    _this5.canAddItem = _this5.canAddItem.bind(_assertThisInitialized(_assertThisInitialized(_this5)));
    return _this5;
  } // pendingValKey is the placeholder variable for temporarily storing
  // typed or selected items before adding them to the Tags


  _createClass(TagsElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.props.onUserInput(this.props.pendingValKey, e.target.value);
    } // also add tags if enter key is hit within input field

  }, {
    key: "handleKeyPress",
    value: function handleKeyPress(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        this.handleAdd();
      }
    } // send pendingValKey as an argument in order to null out entered item

  }, {
    key: "handleAdd",
    value: function handleAdd() {
      var options = this.props.options;
      var value = this.props.value; // if using a datalist (search), set value to be the key in options

      if (this.props.useSearch && Object.values(options).indexOf(value) > -1) {
        value = this.getKeyFromValue(value);
      }

      if (this.canAddItem(value)) {
        this.props.onUserAdd(this.props.name, value, this.props.pendingValKey);
      }
    }
  }, {
    key: "handleRemove",
    value: function handleRemove(e) {
      var value = e.target.getAttribute('data-item');
      this.props.onUserRemove(this.props.name, value);
    }
  }, {
    key: "getKeyFromValue",
    value: function getKeyFromValue(value) {
      var options = this.props.options;
      return Object.keys(options).find(function (o) {
        return options[o] === value;
      });
    } // helper function to detect if item should be added to Tags

  }, {
    key: "canAddItem",
    value: function canAddItem(value) {
      var result = true; // reject empty values

      if (!value) {
        result = false; // reject if allowDupl is false and item is already in array
      } else if (!this.props.allowDupl && this.props.items.indexOf(value) > -1) {
        result = false; // reject if using a strict datalist and value is not in options
      } else if (this.props.useSearch && this.props.strictSearch && Object.keys(this.props.options).indexOf(value) === -1) {
        result = false;
      }

      return result;
    }
  }, {
    key: "render",
    value: function render() {
      var disabled = this.props.disabled ? 'disabled' : null;
      var requiredHTML = null;
      var emptyOptionHTML = null;
      var errorMessage = null;
      var elementClass = 'row form-group'; // Add required asterix

      if (this.props.required) {
        requiredHTML = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "text-danger"
        }, "*");
      } // Add empty option


      if (this.props.emptyOption) {
        emptyOptionHTML = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", null);
      }

      if (this.props.errorMessage) {
        errorMessage = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, this.props.errorMessage);
        elementClass = 'row form-group has-error';
      }

      var input;
      var options = this.props.options; // if options are given and useSearch is specified

      if (Object.keys(options).length > 0 && this.props.useSearch) {
        input = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "text",
          name: this.props.name,
          id: this.props.id,
          list: this.props.id + '_list',
          className: "form-control",
          value: this.props.value || '',
          disabled: disabled,
          onChange: this.handleChange,
          onKeyPress: this.handleKeyPress
        }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("datalist", {
          id: this.props.id + '_list'
        }, Object.keys(options).map(function (option) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
            value: options[option],
            key: option
          }, options[option]);
        }))); // if options are present but useSearch is false, use normal dropdown
      } else if (Object.keys(options).length > 0) {
        input = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("select", {
          name: this.props.name,
          className: "form-control",
          id: this.props.id,
          value: this.props.value,
          disabled: disabled,
          onChange: this.handleChange,
          onKeyPress: this.handleKeyPress
        }, emptyOptionHTML, Object.keys(options).map(function (option) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
            value: option,
            key: option
          }, options[option]);
        })); // else, use a text input by default
      } else {
        input = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "text",
          name: this.props.name,
          id: this.props.id,
          className: "form-control",
          value: this.props.value || '',
          disabled: disabled,
          onChange: this.handleChange,
          onKeyPress: this.handleKeyPress
        });
      } // iterate through added Tags items and render them
      // with deletion button


      var items = this.props.items.map(function (item) {
        var itmTxt; // in event that the passed item is a key of options,
        // render option value

        if (Object.keys(options).length > 0 && options[item] !== undefined) {
          itmTxt = options[item]; // otherwise just render item as is
        } else {
          itmTxt = item;
        }

        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
          className: "btn btn-info btn-inline",
          type: "button",
          onClick: this.handleRemove,
          "data-item": item
        }, itmTxt, "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "glyphicon glyphicon-remove",
          "data-item": item
        }));
      }, this);
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: elementClass
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "col-sm-3 control-label",
        htmlFor: this.props.id
      }, this.props.label, requiredHTML), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-sm-9"
      }, items, input, errorMessage, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-success btn-add-tag",
        id: this.props.id + 'Add',
        type: "button",
        onClick: this.handleAdd
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "glyphicon glyphicon-plus"
      }), this.props.btnLabel)));
    }
  }]);

  return TagsElement;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

TagsElement.propTypes = {
  name: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  id: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  pendingValKey: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  options: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object,
  items: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array,
  label: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  value: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  class: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  multiple: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  required: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  disabled: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  emptyOption: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  errorMessage: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  btnLabel: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  allowDupl: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  useSearch: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  strictSearch: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  onUserInput: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  onUserAdd: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  onUserRemove: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func
};
TagsElement.defaultProps = {
  name: '',
  options: {},
  items: [],
  label: '',
  value: undefined,
  id: null,
  class: '',
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

var TextareaElement =
/*#__PURE__*/
function (_Component6) {
  _inherits(TextareaElement, _Component6);

  function TextareaElement(props) {
    var _this6;

    _classCallCheck(this, TextareaElement);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(TextareaElement).call(this, props));
    _this6.handleChange = _this6.handleChange.bind(_assertThisInitialized(_assertThisInitialized(_this6)));
    return _this6;
  }

  _createClass(TextareaElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.props.onUserInput(this.props.name, e.target.value);
    }
  }, {
    key: "render",
    value: function render() {
      var disabled = this.props.disabled ? 'disabled' : null;
      var required = this.props.required ? 'required' : null;
      var requiredHTML = null; // Add required asterix

      if (required) {
        requiredHTML = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "text-danger"
        }, "*");
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "col-sm-3 control-label",
        htmlFor: this.props.id
      }, this.props.label, requiredHTML), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-sm-9"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("textarea", {
        cols: this.props.cols,
        rows: this.props.rows,
        className: "form-control",
        name: this.props.name,
        id: this.props.id,
        value: this.props.value || '',
        required: required,
        disabled: disabled,
        onChange: this.handleChange
      })));
    }
  }]);

  return TextareaElement;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

TextareaElement.propTypes = {
  name: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  label: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  value: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  id: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  disabled: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  required: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  rows: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  cols: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  onUserInput: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func
};
TextareaElement.defaultProps = {
  name: '',
  label: '',
  value: '',
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

var TextboxElement =
/*#__PURE__*/
function (_Component7) {
  _inherits(TextboxElement, _Component7);

  function TextboxElement(props) {
    var _this7;

    _classCallCheck(this, TextboxElement);

    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(TextboxElement).call(this, props));
    _this7.handleChange = _this7.handleChange.bind(_assertThisInitialized(_assertThisInitialized(_this7)));
    _this7.handleBlur = _this7.handleBlur.bind(_assertThisInitialized(_assertThisInitialized(_this7)));
    return _this7;
  }

  _createClass(TextboxElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.props.onUserInput(this.props.name, e.target.value, e.target.id, 'textbox');
    }
  }, {
    key: "handleBlur",
    value: function handleBlur(e) {
      this.props.onUserBlur(this.props.name, e.target.value);
    }
  }, {
    key: "render",
    value: function render() {
      var disabled = this.props.disabled ? 'disabled' : null;
      var required = this.props.required ? 'required' : null;
      var errorMessage = null;
      var requiredHTML = null;
      var elementClass = 'row form-group'; // Add required asterix

      if (required) {
        requiredHTML = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "text-danger"
        }, "*");
      } // Add error message


      if (this.props.errorMessage) {
        errorMessage = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, this.props.errorMessage);
        elementClass = 'row form-group has-error';
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: elementClass
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "col-sm-3 control-label",
        htmlFor: this.props.id
      }, this.props.label, requiredHTML), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-sm-9"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "text",
        className: "form-control",
        name: this.props.name,
        id: this.props.id,
        value: this.props.value || '',
        required: required,
        disabled: disabled,
        onChange: this.handleChange,
        onBlur: this.handleBlur
      }), errorMessage));
    }
  }]);

  return TextboxElement;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

TextboxElement.propTypes = {
  name: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  label: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  value: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  id: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  disabled: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  required: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  errorMessage: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  onUserInput: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  onUserBlur: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func
};
TextboxElement.defaultProps = {
  name: '',
  label: '',
  value: '',
  id: null,
  disabled: false,
  required: false,
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

var DateElement =
/*#__PURE__*/
function (_Component8) {
  _inherits(DateElement, _Component8);

  function DateElement(props) {
    var _this8;

    _classCallCheck(this, DateElement);

    _this8 = _possibleConstructorReturn(this, _getPrototypeOf(DateElement).call(this, props));
    _this8.handleChange = _this8.handleChange.bind(_assertThisInitialized(_assertThisInitialized(_this8)));
    return _this8;
  }

  _createClass(DateElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.props.onUserInput(this.props.name, e.target.value);
    }
  }, {
    key: "render",
    value: function render() {
      var disabled = this.props.disabled ? 'disabled' : null;
      var required = this.props.required ? 'required' : null;
      var requiredHTML = null; // Add required asterix

      if (required) {
        requiredHTML = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "text-danger"
        }, "*");
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "col-sm-3 control-label",
        htmlFor: this.props.label
      }, this.props.label, requiredHTML), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-sm-9"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "date",
        className: "form-control",
        name: this.props.name,
        id: this.props.id,
        min: this.props.minYear,
        max: this.props.maxYear,
        onChange: this.handleChange,
        value: this.props.value || '',
        required: required,
        disabled: disabled
      })));
    }
  }]);

  return DateElement;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

DateElement.propTypes = {
  name: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  label: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  value: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  id: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  maxYear: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  minYear: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  disabled: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  required: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  onUserInput: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func
};
DateElement.defaultProps = {
  name: '',
  label: '',
  value: '',
  id: null,
  maxYear: '9999-12-31',
  minYear: '1000-01-01',
  disabled: false,
  required: false,
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  }
};
/**
 * Time Component
 * React wrapper for a <input type="time"> element.
 */

var TimeElement =
/*#__PURE__*/
function (_Component9) {
  _inherits(TimeElement, _Component9);

  function TimeElement(props) {
    var _this9;

    _classCallCheck(this, TimeElement);

    _this9 = _possibleConstructorReturn(this, _getPrototypeOf(TimeElement).call(this, props));
    _this9.handleChange = _this9.handleChange.bind(_assertThisInitialized(_assertThisInitialized(_this9)));
    return _this9;
  }

  _createClass(TimeElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.props.onUserInput(this.props.name, e.target.value);
    }
  }, {
    key: "render",
    value: function render() {
      var disabled = this.props.disabled ? 'disabled' : null;
      var required = this.props.required ? 'required' : null;
      var requiredHTML = null; // Add required asterix

      if (required) {
        requiredHTML = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "text-danger"
        }, "*");
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "col-sm-3 control-label",
        htmlFor: this.props.label
      }, this.props.label, requiredHTML), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-sm-9"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "time",
        className: "form-control",
        name: this.props.name,
        id: this.props.id,
        onChange: this.handleChange,
        value: this.props.value || '',
        required: required,
        disabled: disabled,
        pattern: "([0-1][0-9]|2[0-4]|[1-9]):([0-5][0-9])(:([0-5][0-9]))?",
        title: "Input must be in one of the following formats: HH:MM or HH:MM:SS"
      })));
    }
  }]);

  return TimeElement;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

TimeElement.propTypes = {
  name: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  label: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  value: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  id: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  disabled: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  required: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  onUserInput: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func
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
 * Numeric Component
 * React wrapper for a <input type="number"> element.
 */

var NumericElement =
/*#__PURE__*/
function (_Component10) {
  _inherits(NumericElement, _Component10);

  function NumericElement(props) {
    var _this10;

    _classCallCheck(this, NumericElement);

    _this10 = _possibleConstructorReturn(this, _getPrototypeOf(NumericElement).call(this, props));
    _this10.handleChange = _this10.handleChange.bind(_assertThisInitialized(_assertThisInitialized(_this10)));
    return _this10;
  }

  _createClass(NumericElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.props.onUserInput(this.props.name, e.target.value);
    }
  }, {
    key: "render",
    value: function render() {
      var disabled = this.props.disabled ? 'disabled' : null;
      var required = this.props.required ? 'required' : null;
      var requiredHTML = null;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "col-sm-3 control-label",
        htmlFor: this.props.id
      }, this.props.label, requiredHTML), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-sm-9"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "number",
        className: "form-control",
        name: this.props.name,
        id: this.props.id,
        min: this.props.min,
        max: this.props.max,
        value: this.props.value,
        disabled: disabled,
        required: required,
        onChange: this.handleChange
      })));
    }
  }]);

  return NumericElement;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

NumericElement.propTypes = {
  name: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  min: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number.isRequired,
  max: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number.isRequired,
  label: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  value: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  id: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  disabled: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  required: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  onUserInput: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func
};
NumericElement.defaultProps = {
  name: '',
  min: null,
  max: null,
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
 * React wrapper for a simple or 'multiple' <select> element.
 */

var FileElement =
/*#__PURE__*/
function (_Component11) {
  _inherits(FileElement, _Component11);

  function FileElement(props) {
    var _this11;

    _classCallCheck(this, FileElement);

    _this11 = _possibleConstructorReturn(this, _getPrototypeOf(FileElement).call(this, props));
    _this11.handleChange = _this11.handleChange.bind(_assertThisInitialized(_assertThisInitialized(_this11)));
    return _this11;
  }

  _createClass(FileElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      // Send current file to parent component
      var file = e.target.files[0] ? e.target.files[0] : '';
      this.props.onUserInput(this.props.name, file);
    }
  }, {
    key: "render",
    value: function render() {
      var required = this.props.required ? 'required' : null;
      var fileName = this.props.value ? this.props.value.name : undefined;
      var requiredHTML = null;
      var errorMessage = '';
      var elementClass = 'row form-group'; // Add required asterix

      if (required) {
        requiredHTML = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
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
      }; // Add error message

      if (this.props.hasError) {
        errorMessage = this.props.errorMessage;
        elementClass = 'row form-group has-error';
      } // Need to manually reset file value, because HTML API
      // does not allow setting value to anything than empty string.
      // Hence can't use value attribute in the input element.


      var fileHTML = document.querySelector('.fileUpload');

      if (fileHTML && !fileName) {
        fileHTML.value = '';
      }

      if (this.props.disabled) {
        // add padding to align video title on disabled field
        truncateEllipsis.paddingTop = '7px';
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: elementClass
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
          className: "col-sm-3 control-label"
        }, this.props.label), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "col-sm-9"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          style: truncateEllipsis
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          style: truncateEllipsisChild
        }, fileName))));
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: elementClass
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "col-sm-3 control-label"
      }, this.props.label, requiredHTML), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-sm-9"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "input-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        tabIndex: "-1",
        className: "form-control file-caption kv-fileinput-caption"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: truncateEllipsis
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        style: truncateEllipsisChild
      }, fileName)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "file-caption-name",
        id: "video_file"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "input-group-btn"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "btn btn-primary btn-file"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "glyphicon glyphicon-folder-open"
      }), " Browse", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "file",
        className: "fileUpload",
        name: this.props.name,
        onChange: this.handleChange,
        required: required
      })))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, errorMessage)));
    }
  }]);

  return FileElement;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

FileElement.propTypes = {
  name: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  label: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  value: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object]),
  id: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  disabled: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  required: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  hasError: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  errorMessage: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  onUserInput: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func
};
FileElement.defaultProps = {
  name: '',
  label: 'File to Upload',
  value: '',
  id: null,
  disabled: false,
  required: false,
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

var StaticElement =
/*#__PURE__*/
function (_Component12) {
  _inherits(StaticElement, _Component12);

  function StaticElement(props) {
    _classCallCheck(this, StaticElement);

    return _possibleConstructorReturn(this, _getPrototypeOf(StaticElement).call(this, props));
  }

  _createClass(StaticElement, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "col-sm-3 control-label"
      }, this.props.label), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-sm-9"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
        className: "form-control-static"
      }, this.props.text)));
    }
  }]);

  return StaticElement;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

StaticElement.propTypes = {
  label: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  text: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.element])
};
StaticElement.defaultProps = {
  label: '',
  text: null
};
/**
 * Link element component.
 * Used to link plain/formated text to an href destination as part of a form
 */

var LinkElement =
/*#__PURE__*/
function (_Component13) {
  _inherits(LinkElement, _Component13);

  function LinkElement(props) {
    _classCallCheck(this, LinkElement);

    return _possibleConstructorReturn(this, _getPrototypeOf(LinkElement).call(this, props));
  }

  _createClass(LinkElement, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "col-sm-3 control-label"
      }, this.props.label), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-sm-9"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
        className: "form-control-static"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: this.props.href
      }, this.props.text))));
    }
  }]);

  return LinkElement;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

LinkElement.propTypes = {
  label: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  text: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.element]),
  href: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string
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

var CheckboxElement =
/*#__PURE__*/
function (_React$Component) {
  _inherits(CheckboxElement, _React$Component);

  function CheckboxElement() {
    var _this12;

    _classCallCheck(this, CheckboxElement);

    _this12 = _possibleConstructorReturn(this, _getPrototypeOf(CheckboxElement).call(this));
    _this12.handleChange = _this12.handleChange.bind(_assertThisInitialized(_assertThisInitialized(_this12)));
    return _this12;
  }

  _createClass(CheckboxElement, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.props.onUserInput(this.props.name, e.target.checked);
    }
  }, {
    key: "render",
    value: function render() {
      var disabled = this.props.disabled ? 'disabled' : null;
      var required = this.props.required ? 'required' : null;
      var errorMessage = null;
      var requiredHTML = null;
      var elementClass = 'checkbox-inline col-sm-offset-3';
      var label = null; // Add required asterix

      if (required) {
        requiredHTML = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "text-danger"
        }, "*");
      } // Add error message


      if (this.props.errorMessage) {
        errorMessage = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, this.props.errorMessage);
        elementClass = 'checkbox-inline col-sm-offset-3 has-error';
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: elementClass
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: this.props.id
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "checkbox",
        name: this.props.name,
        id: this.props.id,
        checked: this.props.value,
        required: required,
        disabled: disabled,
        onChange: this.handleChange
      }), errorMessage, this.props.label, requiredHTML));
    }
  }]);

  return CheckboxElement;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

CheckboxElement.propTypes = {
  name: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  label: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  value: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool.isRequired,
  id: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  disabled: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  required: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  errorMessage: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  onUserInput: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func
};
CheckboxElement.defaultProps = {
  id: null,
  disabled: false,
  required: false,
  errorMessage: '',
  onUserInput: function onUserInput() {
    console.warn('onUserInput() callback is not set');
  }
};
/**
 * Button component
 * React wrapper for <button> element, typically used to submit forms
 */

var ButtonElement =
/*#__PURE__*/
function (_Component14) {
  _inherits(ButtonElement, _Component14);

  function ButtonElement(props) {
    var _this13;

    _classCallCheck(this, ButtonElement);

    _this13 = _possibleConstructorReturn(this, _getPrototypeOf(ButtonElement).call(this, props));
    _this13.handleClick = _this13.handleClick.bind(_assertThisInitialized(_assertThisInitialized(_this13)));
    return _this13;
  }

  _createClass(ButtonElement, [{
    key: "handleClick",
    value: function handleClick(e) {
      this.props.onUserInput(e);
    }
  }, {
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: this.props.columnSize
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        name: this.props.name,
        type: this.props.type,
        className: this.props.buttonClass,
        onClick: this.handleClick
      }, this.props.label)));
    }
  }]);

  return ButtonElement;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

ButtonElement.propTypes = {
  name: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  label: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  type: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  onUserInput: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func
};
ButtonElement.defaultProps = {
  label: 'Submit',
  type: 'submit',
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

var CTA =
/*#__PURE__*/
function (_Component15) {
  _inherits(CTA, _Component15);

  function CTA() {
    _classCallCheck(this, CTA);

    return _possibleConstructorReturn(this, _getPrototypeOf(CTA).apply(this, arguments));
  }

  _createClass(CTA, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: this.props.buttonClass,
        onClick: this.props.onUserInput
      }, this.props.label);
    }
  }]);

  return CTA;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

CTA.propTypes = {
  label: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  buttonClass: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  onUserInput: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func
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

var LorisElement =
/*#__PURE__*/
function (_Component16) {
  _inherits(LorisElement, _Component16);

  function LorisElement(props) {
    _classCallCheck(this, LorisElement);

    return _possibleConstructorReturn(this, _getPrototypeOf(LorisElement).call(this, props));
  }

  _createClass(LorisElement, [{
    key: "render",
    value: function render() {
      var elementProps = this.props.element;
      elementProps.ref = elementProps.name;
      elementProps.onUserInput = this.props.onUserInput;
      var elementHtml = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null);

      switch (elementProps.type) {
        case 'text':
          elementHtml = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TextboxElement, elementProps);
          break;

        case 'tags':
          elementHtml = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TagsElement, elementProps);
          break;

        case 'select':
          elementHtml = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SelectElement, elementProps);
          break;

        case 'search':
          elementHtml = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SearchableDropdown, elementProps);
          break;

        case 'date':
          elementHtml = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(DateElement, elementProps);
          break;

        case 'time':
          elementHtml = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TimeElement, elementProps);
          break;

        case 'numeric':
          elementHtml = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(NumericElement, elementProps);
          break;

        case 'textarea':
          elementHtml = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TextareaElement, elementProps);
          break;

        case 'file':
          elementHtml = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FileElement, elementProps);
          break;

        case 'static':
          elementHtml = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(StaticElement, elementProps);
          break;

        case 'link':
          elementHtml = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LinkElement, elementProps);
          break;

        case 'advcheckbox':
          elementHtml = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CheckboxElement, elementProps);
          break;

        default:
          console.warn('Element of type ' + elementProps.type + ' is not currently implemented!');
          break;
      }

      return elementHtml;
    }
  }]);

  return LorisElement;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

window.FormElement = FormElement;
window.FieldsetElement = FieldsetElement;
window.SelectElement = SelectElement;
window.TagsElement = TagsElement;
window.SearchableDropdown = SearchableDropdown;
window.TextareaElement = TextareaElement;
window.TextboxElement = TextboxElement;
window.DateElement = DateElement;
window.TimeElement = TimeElement;
window.NumericElement = NumericElement;
window.FileElement = FileElement;
window.StaticElement = StaticElement;
window.LinkElement = LinkElement;
window.CheckboxElement = CheckboxElement;
window.ButtonElement = ButtonElement;
window.CTA = CTA;
window.LorisElement = LorisElement;
/* harmony default export */ __webpack_exports__["default"] = ({
  FormElement: FormElement,
  FieldsetElement: FieldsetElement,
  SelectElement: SelectElement,
  TagsElement: TagsElement,
  SearchableDropdown: SearchableDropdown,
  TextareaElement: TextareaElement,
  TextboxElement: TextboxElement,
  DateElement: DateElement,
  TimeElement: TimeElement,
  NumericElement: NumericElement,
  FileElement: FileElement,
  StaticElement: StaticElement,
  LinkElement: LinkElement,
  CheckboxElement: CheckboxElement,
  ButtonElement: ButtonElement,
  CTA: CTA,
  LorisElement: LorisElement
});

/***/ }),

/***/ "./jsx/Loader.js":
/*!***********************!*\
  !*** ./jsx/Loader.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * This file contains the React component for Loader
 *
 * @author Henri Rabalais
 * @version 1.0.0
 *
 */


/**
 * Loader component
 */

var Loader =
/*#__PURE__*/
function (_Component) {
  _inherits(Loader, _Component);

  function Loader(props) {
    _classCallCheck(this, Loader);

    return _possibleConstructorReturn(this, _getPrototypeOf(Loader).call(this, props));
  }

  _createClass(Loader, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "loader",
        style: {
          width: parseInt(this.props.size),
          height: parseInt(this.props.size)
        }
      });
    }
  }]);

  return Loader;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

Loader.propTypes = {
  size: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string
};
Loader.defaultProps = {
  size: '120'
};
/* harmony default export */ __webpack_exports__["default"] = (Loader);

/***/ }),

/***/ "./jsx/PaginationLinks.js":
/*!********************************!*\
  !*** ./jsx/PaginationLinks.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

/* exported RPaginationLinks */



var PaginationLinks =
/*#__PURE__*/
function (_Component) {
  _inherits(PaginationLinks, _Component);

  function PaginationLinks(props) {
    var _this;

    _classCallCheck(this, PaginationLinks);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PaginationLinks).call(this, props));
    _this.state = {};
    _this.changePage = _this.changePage.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(PaginationLinks, [{
    key: "changePage",
    value: function changePage(i) {
      return function (evt) {
        // Don't jump to the top of the page
        evt.preventDefault();

        if (this.props.onChangePage) {
          this.props.onChangePage(i);
        }
      }.bind(this);
    }
  }, {
    key: "render",
    value: function render() {
      var rowsPerPage = this.props.RowsPerPage;
      var pageLinks = [];
      var classList;
      var lastPage = Math.ceil(this.props.Total / rowsPerPage);
      var startPage = Math.max(1, this.props.Active - 3);
      var lastShownPage = Math.min(this.props.Active + 3, lastPage);

      if (this.props.Total === 0) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null);
      }

      if (this.props.Total < this.props.RowsPerPage) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null);
      }

      if (lastShownPage - startPage <= 7) {
        lastShownPage = startPage + 6;

        if (lastShownPage > lastPage) {
          lastShownPage = lastPage;
          startPage = lastPage - 6;
        }
      }

      if (startPage > 1) {
        pageLinks.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
          key: 'table_page_beginning_' + startPage.toString(),
          onClick: this.changePage(1)
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "#"
        }, "\xAB")));
      }

      if (startPage < 1) {
        startPage = 1;
      }

      if (lastShownPage < 1) {
        lastShownPage = 1;
      } // If there is only 1 page, don't display pagination links


      if (startPage === lastShownPage) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null);
      }

      for (var i = startPage; i <= lastShownPage; i += 1) {
        classList = '';

        if (this.props.Active === i) {
          classList = 'active';
        }

        pageLinks.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
          key: 'table_page_' + i.toString(),
          onClick: this.changePage(i),
          className: classList
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "#"
        }, i)));
      }

      if (lastShownPage !== lastPage) {
        pageLinks.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
          key: 'table_page_more_' + lastShownPage.toString(),
          onClick: this.changePage(lastPage)
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "#"
        }, "\xBB")));
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        className: "pagination pagination-table"
      }, pageLinks);
    }
  }]);

  return PaginationLinks;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

PaginationLinks.propTypes = {
  onChangePage: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  Total: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number.isRequired
};
PaginationLinks.defaultProps = {
  RowsPerPage: 10,
  Active: 1
};
var RPaginationLinks = react__WEBPACK_IMPORTED_MODULE_0___default.a.createFactory(PaginationLinks);
window.PaginationLinks = PaginationLinks;
window.RPaginationLinks = RPaginationLinks;
/* harmony default export */ __webpack_exports__["default"] = (PaginationLinks);

/***/ }),

/***/ "./jsx/Panel.js":
/*!**********************!*\
  !*** ./jsx/Panel.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

/**
 * This file contains React component for Panel
 *
 * @author Alex I.
 * @version 1.0.0
 *
 */


/**
 * Panel component
 * Wraps children in a collapsible bootstrap panel
 */

var Panel =
/*#__PURE__*/
function (_Component) {
  _inherits(Panel, _Component);

  function Panel(props) {
    var _this;

    _classCallCheck(this, Panel);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Panel).call(this, props));
    _this.state = {
      collapsed: _this.props.initCollapsed
    }; // Initialize panel class based on collapsed status

    _this.panelClass = _this.props.initCollapsed ? 'panel-collapse collapse' : 'panel-collapse collapse in';
    _this.toggleCollapsed = _this.toggleCollapsed.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Panel, [{
    key: "toggleCollapsed",
    value: function toggleCollapsed() {
      this.setState({
        collapsed: !this.state.collapsed
      });
    }
  }, {
    key: "render",
    value: function render() {
      // Change arrow direction based on collapse status
      var glyphClass = this.state.collapsed ? 'glyphicon pull-right glyphicon-chevron-down' : 'glyphicon pull-right glyphicon-chevron-up'; // Add panel header, if title is set

      var panelHeading = this.props.title ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-heading",
        onClick: this.toggleCollapsed,
        "data-toggle": "collapse",
        "data-target": '#' + this.props.id,
        style: {
          cursor: 'pointer'
        }
      }, this.props.title, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: glyphClass
      })) : '';
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel panel-primary"
      }, panelHeading, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: this.props.id,
        className: this.panelClass,
        role: "tabpanel"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-body",
        style: {
          height: this.props.height
        }
      }, this.props.children)));
    }
  }]);

  return Panel;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

Panel.propTypes = {
  id: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  height: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  title: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string
};
Panel.defaultProps = {
  initCollapsed: false,
  id: 'default-panel',
  height: '100%'
};
/* harmony default export */ __webpack_exports__["default"] = (Panel);

/***/ }),

/***/ "./modules/user_accounts/jsx/userAccountsIndex.js":
/*!********************************************************!*\
  !*** ./modules/user_accounts/jsx/userAccountsIndex.js ***!
  \********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var Loader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! Loader */ "./jsx/Loader.js");
/* harmony import */ var FilterableDataTable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! FilterableDataTable */ "./jsx/FilterableDataTable.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }






var UserAccountsIndex =
/*#__PURE__*/
function (_Component) {
  _inherits(UserAccountsIndex, _Component);

  function UserAccountsIndex(props) {
    var _this;

    _classCallCheck(this, UserAccountsIndex);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UserAccountsIndex).call(this, props));
    _this.state = {
      data: {},
      error: false,
      isLoaded: false
    };
    _this.fetchData = _this.fetchData.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.formatColumn = _this.formatColumn.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.addUser = _this.addUser.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(UserAccountsIndex, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.fetchData().then(function () {
        return _this2.setState({
          isLoaded: true
        });
      });
    }
    /**
     * Retrieve data from the provided URL and save it in state
     * Additionally add hiddenHeaders to global loris variable
     * for easy access by columnFormatter.
     *
     * @return {object}
     */

  }, {
    key: "fetchData",
    value: function fetchData() {
      var _this3 = this;

      return fetch(this.props.dataURL, {
        credentials: 'same-origin'
      }).then(function (resp) {
        return resp.json();
      }).then(function (data) {
        // Convert concatenated string of sites to array
        data.Data = data.Data.map(function (row) {
          row[0] = row[0].split('; ');
          return row;
        });

        _this3.setState({
          data: data
        });
      }).catch(function (error) {
        _this3.setState({
          error: true
        });

        console.error(error);
      });
    }
    /**
     * Modify behaviour of specified column cells in the Data Table component
     *
     * @param {string} column - column name
     * @param {string} cell - cell content
     * @param {object} row - row content indexed by column
     *
     * @return {*} a formated table cell for a given column
     */

  }, {
    key: "formatColumn",
    value: function formatColumn(column, cell, row) {
      var url;
      var result = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, cell);

      switch (column) {
        case 'Site':
          // If user has multiple sites, join array of sites into string
          result = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, cell.join('; '));
          break;

        case 'Username':
          url = loris.BaseURL + '/user_accounts/edit_user/' + row.Username;
          result = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
            href: url
          }, cell));
          break;

        case 'Active':
          if (row.Active === 'Y') {
            result = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, "Yes");
          } else if (row.Active === 'N') {
            result = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, "No");
          }

          break;

        case 'Pending Approval':
          if (row['Pending Approval'] === 'Y') {
            result = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, "Yes");
          } else if (row['Pending Approval'] === 'N') {
            result = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, "No");
          }

          break;
      }

      return result;
    }
  }, {
    key: "addUser",
    value: function addUser() {
      location.href = '/user_accounts/edit_user/';
    }
  }, {
    key: "render",
    value: function render() {
      // If error occurs, return a message.
      // XXX: Replace this with a UI component for 500 errors.
      if (this.state.error) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, "An error occured while loading the page.");
      } // Waiting for async data to load


      if (!this.state.isLoaded) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Loader__WEBPACK_IMPORTED_MODULE_2__["default"], null);
      }
      /**
       * XXX: Currently, the order of these fields MUST match the order of the
       * queried columns in _setupVariables() in userAccounts.class.inc
       */


      var options = this.state.data.fieldOptions;
      var fields = [{
        label: 'Site',
        show: true,
        filter: {
          name: 'site',
          type: 'select',
          options: options.sites
        }
      }, {
        label: 'Username',
        show: true,
        filter: {
          name: 'username',
          type: 'text'
        }
      }, {
        label: 'Full Name',
        show: true,
        filter: {
          name: 'fullName',
          type: 'text'
        }
      }, {
        label: 'Email',
        show: true,
        filter: {
          name: 'email',
          type: 'text'
        }
      }, {
        label: 'Active',
        show: true,
        filter: {
          name: 'active',
          type: 'select',
          options: options.actives
        }
      }, {
        label: 'Pending Approval',
        show: true,
        filter: {
          name: 'pendingApproval',
          type: 'select',
          options: options.pendingApprovals
        }
      }];
      var actions = [{
        label: 'Add User',
        action: this.addUser
      }];
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FilterableDataTable__WEBPACK_IMPORTED_MODULE_3__["default"], {
        name: "userAccounts",
        title: "User Accounts",
        data: this.state.data.Data,
        fields: fields,
        getFormattedCell: this.formatColumn,
        actions: actions
      });
    }
  }]);

  return UserAccountsIndex;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

UserAccountsIndex.propTypes = {
  dataURL: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  hasPermission: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func.isRequired
};
window.addEventListener('load', function () {
  ReactDOM.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(UserAccountsIndex, {
    dataURL: "".concat(loris.BaseURL, "/user_accounts/?format=json"),
    hasPermission: loris.userHasPermission
  }), document.getElementById('lorisworkspace'));
});

/***/ }),

/***/ "./node_modules/fbjs/lib/emptyFunction.js":
/*!************************************************!*\
  !*** ./node_modules/fbjs/lib/emptyFunction.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),

/***/ "./node_modules/fbjs/lib/invariant.js":
/*!********************************************!*\
  !*** ./node_modules/fbjs/lib/invariant.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (true) {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;

/***/ }),

/***/ "./node_modules/fbjs/lib/warning.js":
/*!******************************************!*\
  !*** ./node_modules/fbjs/lib/warning.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var emptyFunction = __webpack_require__(/*! ./emptyFunction */ "./node_modules/fbjs/lib/emptyFunction.js");

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (true) {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
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

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;

/***/ }),

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
/*! no static exports found */
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

/***/ "./node_modules/prop-types/checkPropTypes.js":
/*!***************************************************!*\
  !*** ./node_modules/prop-types/checkPropTypes.js ***!
  \***************************************************/
/*! no static exports found */
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
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};

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
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
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
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
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
          )

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

module.exports = checkPropTypes;


/***/ }),

/***/ "./node_modules/prop-types/factoryWithTypeCheckers.js":
/*!************************************************************!*\
  !*** ./node_modules/prop-types/factoryWithTypeCheckers.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");

var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
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
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
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
  function PropTypeError(message) {
    this.message = message;
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
              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
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

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
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
       true ? printWarning('Invalid argument supplied to oneOf, expected an instance of array.') : undefined;
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
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
        if (propValue.hasOwnProperty(key)) {
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
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
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

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
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
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
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
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ "./node_modules/prop-types/index.js":
/*!******************************************!*\
  !*** ./node_modules/prop-types/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(/*! ./factoryWithTypeCheckers */ "./node_modules/prop-types/factoryWithTypeCheckers.js")(isValidElement, throwOnDirectAccess);
} else {}


/***/ }),

/***/ "./node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!*************************************************************!*\
  !*** ./node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \*************************************************************/
/*! no static exports found */
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

/***/ "./node_modules/react-addons-create-fragment/index.js":
/*!************************************************************!*\
  !*** ./node_modules/react-addons-create-fragment/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var REACT_ELEMENT_TYPE =
  (typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element')) ||
  0xeac7;

var emptyFunction = __webpack_require__(/*! fbjs/lib/emptyFunction */ "./node_modules/fbjs/lib/emptyFunction.js");
var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");
var warning = __webpack_require__(/*! fbjs/lib/warning */ "./node_modules/fbjs/lib/warning.js");

var SEPARATOR = '.';
var SUBSEPARATOR = ':';

var didWarnAboutMaps = false;

var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

function getIteratorFn(maybeIterable) {
  var iteratorFn =
    maybeIterable &&
    ((ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL]) ||
      maybeIterable[FAUX_ITERATOR_SYMBOL]);
  if (typeof iteratorFn === 'function') {
    return iteratorFn;
  }
}

function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function(match) {
    return escaperLookup[match];
  });

  return '$' + escapedString;
}

function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (component && typeof component === 'object' && component.key != null) {
    // Explicit key
    return escape(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

function traverseAllChildrenImpl(
  children,
  nameSoFar,
  callback,
  traverseContext
) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  if (
    children === null ||
    type === 'string' ||
    type === 'number' ||
    // The following is inlined from ReactElement. This means we can optimize
    // some checks. React Fiber also inlines this logic for similar purposes.
    (type === 'object' && children.$$typeof === REACT_ELEMENT_TYPE)
  ) {
    callback(
      traverseContext,
      children,
      // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows.
      nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar
    );
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(
        child,
        nextName,
        callback,
        traverseContext
      );
    }
  } else {
    var iteratorFn = getIteratorFn(children);
    if (iteratorFn) {
      if (true) {
        // Warn about using Maps as children
        if (iteratorFn === children.entries) {
          warning(
            didWarnAboutMaps,
            'Using Maps as children is unsupported and will likely yield ' +
              'unexpected results. Convert it to a sequence/iterable of keyed ' +
              'ReactElements instead.'
          );
          didWarnAboutMaps = true;
        }
      }

      var iterator = iteratorFn.call(children);
      var step;
      var ii = 0;
      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getComponentKey(child, ii++);
        subtreeCount += traverseAllChildrenImpl(
          child,
          nextName,
          callback,
          traverseContext
        );
      }
    } else if (type === 'object') {
      var addendum = '';
      if (true) {
        addendum =
          ' If you meant to render a collection of children, use an array ' +
          'instead or wrap the object using createFragment(object) from the ' +
          'React add-ons.';
      }
      var childrenString = '' + children;
      invariant(
        false,
        'Objects are not valid as a React child (found: %s).%s',
        childrenString === '[object Object]'
          ? 'object with keys {' + Object.keys(children).join(', ') + '}'
          : childrenString,
        addendum
      );
    }
  }

  return subtreeCount;
}

function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

var userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}

function cloneAndReplaceKey(oldElement, newKey) {
  return React.cloneElement(
    oldElement,
    {key: newKey},
    oldElement.props !== undefined ? oldElement.props.children : undefined
  );
}

var DEFAULT_POOL_SIZE = 10;
var DEFAULT_POOLER = oneArgumentPooler;

var oneArgumentPooler = function(copyFieldsFrom) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, copyFieldsFrom);
    return instance;
  } else {
    return new Klass(copyFieldsFrom);
  }
};

var addPoolingTo = function addPoolingTo(CopyConstructor, pooler) {
  // Casting as any so that flow ignores the actual implementation and trusts
  // it to match the type we declared
  var NewKlass = CopyConstructor;
  NewKlass.instancePool = [];
  NewKlass.getPooled = pooler || DEFAULT_POOLER;
  if (!NewKlass.poolSize) {
    NewKlass.poolSize = DEFAULT_POOL_SIZE;
  }
  NewKlass.release = standardReleaser;
  return NewKlass;
};

var standardReleaser = function standardReleaser(instance) {
  var Klass = this;
  invariant(
    instance instanceof Klass,
    'Trying to release an instance into a pool of a different type.'
  );
  instance.destructor();
  if (Klass.instancePool.length < Klass.poolSize) {
    Klass.instancePool.push(instance);
  }
};

var fourArgumentPooler = function fourArgumentPooler(a1, a2, a3, a4) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3, a4);
    return instance;
  } else {
    return new Klass(a1, a2, a3, a4);
  }
};

function MapBookKeeping(mapResult, keyPrefix, mapFunction, mapContext) {
  this.result = mapResult;
  this.keyPrefix = keyPrefix;
  this.func = mapFunction;
  this.context = mapContext;
  this.count = 0;
}
MapBookKeeping.prototype.destructor = function() {
  this.result = null;
  this.keyPrefix = null;
  this.func = null;
  this.context = null;
  this.count = 0;
};
addPoolingTo(MapBookKeeping, fourArgumentPooler);

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result;
  var keyPrefix = bookKeeping.keyPrefix;
  var func = bookKeeping.func;
  var context = bookKeeping.context;

  var mappedChild = func.call(context, child, bookKeeping.count++);
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(
      mappedChild,
      result,
      childKey,
      emptyFunction.thatReturnsArgument
    );
  } else if (mappedChild != null) {
    if (React.isValidElement(mappedChild)) {
      mappedChild = cloneAndReplaceKey(
        mappedChild,
        // Keep both the (mapped) and old keys if they differ, just as
        // traverseAllChildren used to do for objects as children
        keyPrefix +
          (mappedChild.key && (!child || child.key !== mappedChild.key)
            ? escapeUserProvidedKey(mappedChild.key) + '/'
            : '') +
          childKey
      );
    }
    result.push(mappedChild);
  }
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  var traverseContext = MapBookKeeping.getPooled(
    array,
    escapedPrefix,
    func,
    context
  );
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  MapBookKeeping.release(traverseContext);
}

var numericPropertyRegex = /^\d+$/;

var warnedAboutNumeric = false;

function createReactFragment(object) {
  if (typeof object !== 'object' || !object || Array.isArray(object)) {
    warning(
      false,
      'React.addons.createFragment only accepts a single object. Got: %s',
      object
    );
    return object;
  }
  if (React.isValidElement(object)) {
    warning(
      false,
      'React.addons.createFragment does not accept a ReactElement ' +
        'without a wrapper object.'
    );
    return object;
  }

  invariant(
    object.nodeType !== 1,
    'React.addons.createFragment(...): Encountered an invalid child; DOM ' +
      'elements are not valid children of React components.'
  );

  var result = [];

  for (var key in object) {
    if (true) {
      if (!warnedAboutNumeric && numericPropertyRegex.test(key)) {
        warning(
          false,
          'React.addons.createFragment(...): Child objects should have ' +
            'non-numeric keys so ordering is preserved.'
        );
        warnedAboutNumeric = true;
      }
    }
    mapIntoWithKeyPrefixInternal(
      object[key],
      result,
      key,
      emptyFunction.thatReturnsArgument
    );
  }

  return result;
}

module.exports = createReactFragment;


/***/ }),

/***/ "./node_modules/react/cjs/react.development.js":
/*!*****************************************************!*\
  !*** ./node_modules/react/cjs/react.development.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v16.7.0
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

var _assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");
var checkPropTypes = __webpack_require__(/*! prop-types/checkPropTypes */ "./node_modules/prop-types/checkPropTypes.js");

// TODO: this is special because it gets imported during build.

var ReactVersion = '16.7.0';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;

var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;

var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;

var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';

function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable !== 'object') {
    return null;
  }
  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }
  return null;
}

var enableHooks = false;
// Helps identify side effects in begin-phase lifecycle hooks and setState reducers:


// In some cases, StrictMode should also double-render lifecycles.
// This can be confusing for tests though,
// And it can be bad for performance in production.
// This feature flag can be used to control the behavior:


// To preserve the "Pause on caught exceptions" behavior of the debugger, we
// replay the begin phase of a failed component inside invokeGuardedCallback.


// Warn about deprecated, async-unsafe lifecycles; relates to RFC #6:


// Gather advanced timing metrics for Profiler subtrees.


// Trace which interactions trigger each commit.


// Only used in www builds.
 // TODO: true? Here it might just be false.

// Only used in www builds.


// Only used in www builds.


// React Fire: prevent the value and checked attributes from syncing
// with their related DOM properties


// These APIs will no longer be "unstable" in the upcoming 16.7 release,
// Control this behavior with a flag to support 16.6 minor releases in the meanwhile.
var enableStableConcurrentModeAPIs = false;

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function () {};

{
  validateFormat = function (format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error = void 0;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

// Relying on the `invariant()` implementation lets us
// preserve the format and params in the www builds.

/**
 * Forked from fbjs/warning:
 * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
 *
 * Only change is we use console.warn instead of console.error,
 * and do nothing when 'console' is not supported.
 * This really simplifies the code.
 * ---
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var lowPriorityWarning = function () {};

{
  var printWarning = function (format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.warn(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  lowPriorityWarning = function (condition, format) {
    if (format === undefined) {
      throw new Error('`lowPriorityWarning(condition, format, ...args)` requires a warning ' + 'message argument');
    }
    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

var lowPriorityWarning$1 = lowPriorityWarning;

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warningWithoutStack = function () {};

{
  warningWithoutStack = function (condition, format) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    if (format === undefined) {
      throw new Error('`warningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
    }
    if (args.length > 8) {
      // Check before the condition to catch violations early.
      throw new Error('warningWithoutStack() currently supports at most 8 arguments.');
    }
    if (condition) {
      return;
    }
    if (typeof console !== 'undefined') {
      var argsWithFormat = args.map(function (item) {
        return '' + item;
      });
      argsWithFormat.unshift('Warning: ' + format);

      // We intentionally don't use spread (or .apply) directly because it
      // breaks IE9: https://github.com/facebook/react/issues/13610
      Function.prototype.apply.call(console.error, console, argsWithFormat);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });
      throw new Error(message);
    } catch (x) {}
  };
}

var warningWithoutStack$1 = warningWithoutStack;

var didWarnStateUpdateForUnmountedComponent = {};

function warnNoop(publicInstance, callerName) {
  {
    var _constructor = publicInstance.constructor;
    var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
    var warningKey = componentName + '.' + callerName;
    if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
      return;
    }
    warningWithoutStack$1(false, "Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);
    didWarnStateUpdateForUnmountedComponent[warningKey] = true;
  }
}

/**
 * This is the abstract API for an update queue.
 */
var ReactNoopUpdateQueue = {
  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function (publicInstance) {
    return false;
  },

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueForceUpdate: function (publicInstance, callback, callerName) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} Name of the calling function in the public API.
   * @internal
   */
  enqueueSetState: function (publicInstance, partialState, callback, callerName) {
    warnNoop(publicInstance, 'setState');
  }
};

var emptyObject = {};
{
  Object.freeze(emptyObject);
}

/**
 * Base class helpers for the updating state of a component.
 */
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};

/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */
Component.prototype.setState = function (partialState, callback) {
  !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : void 0;
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */
Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};

/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */
{
  var deprecatedAPIs = {
    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
  };
  var defineDeprecationWarning = function (methodName, info) {
    Object.defineProperty(Component.prototype, methodName, {
      get: function () {
        lowPriorityWarning$1(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
        return undefined;
      }
    });
  };
  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;

/**
 * Convenience component with default shallow equality check for sCU.
 */
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
pureComponentPrototype.constructor = PureComponent;
// Avoid an extra prototype jump for these methods.
_assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;

// an immutable object with a single mutable value
function createRef() {
  var refObject = {
    current: null
  };
  {
    Object.seal(refObject);
  }
  return refObject;
}

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */
var ReactCurrentOwner = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null,
  currentDispatcher: null
};

var BEFORE_SLASH_RE = /^(.*)[\\\/]/;

var describeComponentFrame = function (name, source, ownerName) {
  var sourceInfo = '';
  if (source) {
    var path = source.fileName;
    var fileName = path.replace(BEFORE_SLASH_RE, '');
    {
      // In DEV, include code for a common special case:
      // prefer "folder/index.js" instead of just "index.js".
      if (/^index\./.test(fileName)) {
        var match = path.match(BEFORE_SLASH_RE);
        if (match) {
          var pathBeforeSlash = match[1];
          if (pathBeforeSlash) {
            var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, '');
            fileName = folderName + '/' + fileName;
          }
        }
      }
    }
    sourceInfo = ' (at ' + fileName + ':' + source.lineNumber + ')';
  } else if (ownerName) {
    sourceInfo = ' (created by ' + ownerName + ')';
  }
  return '\n    in ' + (name || 'Unknown') + sourceInfo;
};

var Resolved = 1;


function refineResolvedLazyComponent(lazyComponent) {
  return lazyComponent._status === Resolved ? lazyComponent._result : null;
}

function getWrappedName(outerType, innerType, wrapperName) {
  var functionName = innerType.displayName || innerType.name || '';
  return outerType.displayName || (functionName !== '' ? wrapperName + '(' + functionName + ')' : wrapperName);
}

function getComponentName(type) {
  if (type == null) {
    // Host root, text node or just invalid type.
    return null;
  }
  {
    if (typeof type.tag === 'number') {
      warningWithoutStack$1(false, 'Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
    }
  }
  if (typeof type === 'function') {
    return type.displayName || type.name || null;
  }
  if (typeof type === 'string') {
    return type;
  }
  switch (type) {
    case REACT_CONCURRENT_MODE_TYPE:
      return 'ConcurrentMode';
    case REACT_FRAGMENT_TYPE:
      return 'Fragment';
    case REACT_PORTAL_TYPE:
      return 'Portal';
    case REACT_PROFILER_TYPE:
      return 'Profiler';
    case REACT_STRICT_MODE_TYPE:
      return 'StrictMode';
    case REACT_SUSPENSE_TYPE:
      return 'Suspense';
  }
  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_CONTEXT_TYPE:
        return 'Context.Consumer';
      case REACT_PROVIDER_TYPE:
        return 'Context.Provider';
      case REACT_FORWARD_REF_TYPE:
        return getWrappedName(type, type.render, 'ForwardRef');
      case REACT_MEMO_TYPE:
        return getComponentName(type.type);
      case REACT_LAZY_TYPE:
        {
          var thenable = type;
          var resolvedThenable = refineResolvedLazyComponent(thenable);
          if (resolvedThenable) {
            return getComponentName(resolvedThenable);
          }
        }
    }
  }
  return null;
}

var ReactDebugCurrentFrame = {};

var currentlyValidatingElement = null;

function setCurrentlyValidatingElement(element) {
  {
    currentlyValidatingElement = element;
  }
}

{
  // Stack implementation injected by the current renderer.
  ReactDebugCurrentFrame.getCurrentStack = null;

  ReactDebugCurrentFrame.getStackAddendum = function () {
    var stack = '';

    // Add an extra top frame while an element is being validated
    if (currentlyValidatingElement) {
      var name = getComponentName(currentlyValidatingElement.type);
      var owner = currentlyValidatingElement._owner;
      stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner.type));
    }

    // Delegate to the injected renderer-specific implementation
    var impl = ReactDebugCurrentFrame.getCurrentStack;
    if (impl) {
      stack += impl() || '';
    }

    return stack;
  };
}

var ReactSharedInternals = {
  ReactCurrentOwner: ReactCurrentOwner,
  // Used by renderers to avoid bundling object-assign twice in UMD bundles:
  assign: _assign
};

{
  _assign(ReactSharedInternals, {
    // These should not be included in production.
    ReactDebugCurrentFrame: ReactDebugCurrentFrame,
    // Shim for React DOM 16.0.0 which still destructured (but not used) this.
    // TODO: remove in React 17.0.
    ReactComponentTreeHook: {}
  });
}

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = warningWithoutStack$1;

{
  warning = function (condition, format) {
    if (condition) {
      return;
    }
    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
    var stack = ReactDebugCurrentFrame.getStackAddendum();
    // eslint-disable-next-line react-internal/warning-and-invariant-args

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    warningWithoutStack$1.apply(undefined, [false, format + '%s'].concat(args, [stack]));
  };
}

var warning$1 = warning;

var hasOwnProperty = Object.prototype.hasOwnProperty;

var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};

var specialPropKeyWarningShown = void 0;
var specialPropRefWarningShown = void 0;

function hasValidRef(config) {
  {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.ref !== undefined;
}

function hasValidKey(config) {
  {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.key !== undefined;
}

function defineKeyPropWarningGetter(props, displayName) {
  var warnAboutAccessingKey = function () {
    if (!specialPropKeyWarningShown) {
      specialPropKeyWarningShown = true;
      warningWithoutStack$1(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
    }
  };
  warnAboutAccessingKey.isReactWarning = true;
  Object.defineProperty(props, 'key', {
    get: warnAboutAccessingKey,
    configurable: true
  });
}

function defineRefPropWarningGetter(props, displayName) {
  var warnAboutAccessingRef = function () {
    if (!specialPropRefWarningShown) {
      specialPropRefWarningShown = true;
      warningWithoutStack$1(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
    }
  };
  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true
  });
}

/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, no instanceof check
 * will work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} key
 * @param {string|object} ref
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @param {*} owner
 * @param {*} props
 * @internal
 */
var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner
  };

  {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {};

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    });
    // self and source are DEV only properties.
    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self
    });
    // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.
    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source
    });
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};

/**
 * Create and return a new ReactElement of the given type.
 * See https://reactjs.org/docs/react-api.html#createelement
 */
function createElement(type, config, children) {
  var propName = void 0;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  {
    if (key || ref) {
      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }
      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}

/**
 * Return a function that produces ReactElements of a given type.
 * See https://reactjs.org/docs/react-api.html#createfactory
 */


function cloneAndReplaceKey(oldElement, newKey) {
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

  return newElement;
}

/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://reactjs.org/docs/react-api.html#cloneelement
 */
function cloneElement(element, config, children) {
  !!(element === null || element === undefined) ? invariant(false, 'React.cloneElement(...): The argument must be a React element, but you passed %s.', element) : void 0;

  var propName = void 0;

  // Original props are copied
  var props = _assign({}, element.props);

  // Reserved names are extracted
  var key = element.key;
  var ref = element.ref;
  // Self is preserved since the owner is preserved.
  var self = element._self;
  // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.
  var source = element._source;

  // Owner will be preserved, unless ref is overridden
  var owner = element._owner;

  if (config != null) {
    if (hasValidRef(config)) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    // Remaining properties override existing props
    var defaultProps = void 0;
    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config[propName];
        }
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
}

/**
 * Verifies the object is a ReactElement.
 * See https://reactjs.org/docs/react-api.html#isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a ReactElement.
 * @final
 */
function isValidElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}

var SEPARATOR = '.';
var SUBSEPARATOR = ':';

/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */
function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });

  return '$' + escapedString;
}

/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */

var didWarnAboutMaps = false;

var userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}

var POOL_SIZE = 10;
var traverseContextPool = [];
function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
  if (traverseContextPool.length) {
    var traverseContext = traverseContextPool.pop();
    traverseContext.result = mapResult;
    traverseContext.keyPrefix = keyPrefix;
    traverseContext.func = mapFunction;
    traverseContext.context = mapContext;
    traverseContext.count = 0;
    return traverseContext;
  } else {
    return {
      result: mapResult,
      keyPrefix: keyPrefix,
      func: mapFunction,
      context: mapContext,
      count: 0
    };
  }
}

function releaseTraverseContext(traverseContext) {
  traverseContext.result = null;
  traverseContext.keyPrefix = null;
  traverseContext.func = null;
  traverseContext.context = null;
  traverseContext.count = 0;
  if (traverseContextPool.length < POOL_SIZE) {
    traverseContextPool.push(traverseContext);
  }
}

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  var invokeCallback = false;

  if (children === null) {
    invokeCallback = true;
  } else {
    switch (type) {
      case 'string':
      case 'number':
        invokeCallback = true;
        break;
      case 'object':
        switch (children.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = true;
        }
    }
  }

  if (invokeCallback) {
    callback(traverseContext, children,
    // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.
    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child = void 0;
  var nextName = void 0;
  var subtreeCount = 0; // Count of children found in the current subtree.
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = getIteratorFn(children);
    if (typeof iteratorFn === 'function') {
      {
        // Warn about using Maps as children
        if (iteratorFn === children.entries) {
          !didWarnAboutMaps ? warning$1(false, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.') : void 0;
          didWarnAboutMaps = true;
        }
      }

      var iterator = iteratorFn.call(children);
      var step = void 0;
      var ii = 0;
      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getComponentKey(child, ii++);
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    } else if (type === 'object') {
      var addendum = '';
      {
        addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + ReactDebugCurrentFrame.getStackAddendum();
      }
      var childrenString = '' + children;
      invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum);
    }
  }

  return subtreeCount;
}

/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (typeof component === 'object' && component !== null && component.key != null) {
    // Explicit key
    return escape(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

function forEachSingleChild(bookKeeping, child, name) {
  var func = bookKeeping.func,
      context = bookKeeping.context;

  func.call(context, child, bookKeeping.count++);
}

/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }
  var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  releaseTraverseContext(traverseContext);
}

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result,
      keyPrefix = bookKeeping.keyPrefix,
      func = bookKeeping.func,
      context = bookKeeping.context;


  var mappedChild = func.call(context, child, bookKeeping.count++);
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, function (c) {
      return c;
    });
  } else if (mappedChild != null) {
    if (isValidElement(mappedChild)) {
      mappedChild = cloneAndReplaceKey(mappedChild,
      // Keep both the (mapped) and old keys if they differ, just as
      // traverseAllChildren used to do for objects as children
      keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
    }
    result.push(mappedChild);
  }
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  releaseTraverseContext(traverseContext);
}

/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenmap
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}

/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrencount
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */
function countChildren(children) {
  return traverseAllChildren(children, function () {
    return null;
  }, null);
}

/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
 */
function toArray(children) {
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, function (child) {
    return child;
  });
  return result;
}

/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenonly
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */
function onlyChild(children) {
  !isValidElement(children) ? invariant(false, 'React.Children.only expected to receive a single React element child.') : void 0;
  return children;
}

function createContext(defaultValue, calculateChangedBits) {
  if (calculateChangedBits === undefined) {
    calculateChangedBits = null;
  } else {
    {
      !(calculateChangedBits === null || typeof calculateChangedBits === 'function') ? warningWithoutStack$1(false, 'createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits) : void 0;
    }
  }

  var context = {
    $$typeof: REACT_CONTEXT_TYPE,
    _calculateChangedBits: calculateChangedBits,
    // As a workaround to support multiple concurrent renderers, we categorize
    // some renderers as primary and others as secondary. We only expect
    // there to be two concurrent renderers at most: React Native (primary) and
    // Fabric (secondary); React DOM (primary) and React ART (secondary).
    // Secondary renderers store their context values on separate fields.
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    // Used to track how many concurrent renderers this context currently
    // supports within in a single renderer. Such as parallel server rendering.
    _threadCount: 0,
    // These are circular
    Provider: null,
    Consumer: null
  };

  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context
  };

  var hasWarnedAboutUsingNestedContextConsumers = false;
  var hasWarnedAboutUsingConsumerProvider = false;

  {
    // A separate object, but proxies back to the original context object for
    // backwards compatibility. It has a different $$typeof, so we can properly
    // warn for the incorrect usage of Context as a Consumer.
    var Consumer = {
      $$typeof: REACT_CONTEXT_TYPE,
      _context: context,
      _calculateChangedBits: context._calculateChangedBits
    };
    // $FlowFixMe: Flow complains about not setting a value, which is intentional here
    Object.defineProperties(Consumer, {
      Provider: {
        get: function () {
          if (!hasWarnedAboutUsingConsumerProvider) {
            hasWarnedAboutUsingConsumerProvider = true;
            warning$1(false, 'Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
          }
          return context.Provider;
        },
        set: function (_Provider) {
          context.Provider = _Provider;
        }
      },
      _currentValue: {
        get: function () {
          return context._currentValue;
        },
        set: function (_currentValue) {
          context._currentValue = _currentValue;
        }
      },
      _currentValue2: {
        get: function () {
          return context._currentValue2;
        },
        set: function (_currentValue2) {
          context._currentValue2 = _currentValue2;
        }
      },
      _threadCount: {
        get: function () {
          return context._threadCount;
        },
        set: function (_threadCount) {
          context._threadCount = _threadCount;
        }
      },
      Consumer: {
        get: function () {
          if (!hasWarnedAboutUsingNestedContextConsumers) {
            hasWarnedAboutUsingNestedContextConsumers = true;
            warning$1(false, 'Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
          }
          return context.Consumer;
        }
      }
    });
    // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty
    context.Consumer = Consumer;
  }

  {
    context._currentRenderer = null;
    context._currentRenderer2 = null;
  }

  return context;
}

function lazy(ctor) {
  var lazyType = {
    $$typeof: REACT_LAZY_TYPE,
    _ctor: ctor,
    // React uses these fields to store the result.
    _status: -1,
    _result: null
  };

  {
    // In production, this would just set it on the object.
    var defaultProps = void 0;
    var propTypes = void 0;
    Object.defineProperties(lazyType, {
      defaultProps: {
        configurable: true,
        get: function () {
          return defaultProps;
        },
        set: function (newDefaultProps) {
          warning$1(false, 'React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
          defaultProps = newDefaultProps;
          // Match production behavior more closely:
          Object.defineProperty(lazyType, 'defaultProps', {
            enumerable: true
          });
        }
      },
      propTypes: {
        configurable: true,
        get: function () {
          return propTypes;
        },
        set: function (newPropTypes) {
          warning$1(false, 'React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
          propTypes = newPropTypes;
          // Match production behavior more closely:
          Object.defineProperty(lazyType, 'propTypes', {
            enumerable: true
          });
        }
      }
    });
  }

  return lazyType;
}

function forwardRef(render) {
  {
    if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
      warningWithoutStack$1(false, 'forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
    } else if (typeof render !== 'function') {
      warningWithoutStack$1(false, 'forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
    } else {
      !(
      // Do not warn for 0 arguments because it could be due to usage of the 'arguments' object
      render.length === 0 || render.length === 2) ? warningWithoutStack$1(false, 'forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.') : void 0;
    }

    if (render != null) {
      !(render.defaultProps == null && render.propTypes == null) ? warningWithoutStack$1(false, 'forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?') : void 0;
    }
  }

  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render: render
  };
}

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' ||
  // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE);
}

function memo(type, compare) {
  {
    if (!isValidElementType(type)) {
      warningWithoutStack$1(false, 'memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
    }
  }
  return {
    $$typeof: REACT_MEMO_TYPE,
    type: type,
    compare: compare === undefined ? null : compare
  };
}

function resolveDispatcher() {
  var dispatcher = ReactCurrentOwner.currentDispatcher;
  !(dispatcher !== null) ? invariant(false, 'Hooks can only be called inside the body of a function component.') : void 0;
  return dispatcher;
}

function useContext(Context, observedBits) {
  var dispatcher = resolveDispatcher();
  {
    // TODO: add a more generic warning for invalid values.
    if (Context._context !== undefined) {
      var realContext = Context._context;
      // Don't deduplicate because this legitimately causes bugs
      // and nobody should be using this in existing code.
      if (realContext.Consumer === Context) {
        warning$1(false, 'Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
      } else if (realContext.Provider === Context) {
        warning$1(false, 'Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
      }
    }
  }
  return dispatcher.useContext(Context, observedBits);
}

function useState(initialState) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}

function useReducer(reducer, initialState, initialAction) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialState, initialAction);
}

function useRef(initialValue) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useRef(initialValue);
}

function useEffect(create, inputs) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, inputs);
}

function useLayoutEffect(create, inputs) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useLayoutEffect(create, inputs);
}

function useCallback(callback, inputs) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useCallback(callback, inputs);
}

function useMemo(create, inputs) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useMemo(create, inputs);
}

function useImperativeMethods(ref, create, inputs) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useImperativeMethods(ref, create, inputs);
}

/**
 * ReactElementValidator provides a wrapper around a element factory
 * which validates the props passed to the element. This is intended to be
 * used only in DEV and could be replaced by a static type checker for languages
 * that support it.
 */

var propTypesMisspellWarningShown = void 0;

{
  propTypesMisspellWarningShown = false;
}

function getDeclarationErrorAddendum() {
  if (ReactCurrentOwner.current) {
    var name = getComponentName(ReactCurrentOwner.current.type);
    if (name) {
      return '\n\nCheck the render method of `' + name + '`.';
    }
  }
  return '';
}

function getSourceInfoErrorAddendum(elementProps) {
  if (elementProps !== null && elementProps !== undefined && elementProps.__source !== undefined) {
    var source = elementProps.__source;
    var fileName = source.fileName.replace(/^.*[\\\/]/, '');
    var lineNumber = source.lineNumber;
    return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
  }
  return '';
}

/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */
var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  var info = getDeclarationErrorAddendum();

  if (!info) {
    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
    if (parentName) {
      info = '\n\nCheck the top-level render call using <' + parentName + '>.';
    }
  }
  return info;
}

/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */
function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }
  element._store.validated = true;

  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
  if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
    return;
  }
  ownerHasKeyUseWarning[currentComponentErrorInfo] = true;

  // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.
  var childOwner = '';
  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
    // Give the component that originally created this child.
    childOwner = ' It was passed a child from ' + getComponentName(element._owner.type) + '.';
  }

  setCurrentlyValidatingElement(element);
  {
    warning$1(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.', currentComponentErrorInfo, childOwner);
  }
  setCurrentlyValidatingElement(null);
}

/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */
function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }
  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var child = node[i];
      if (isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (isValidElement(node)) {
    // This element was passed in a valid location.
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    var iteratorFn = getIteratorFn(node);
    if (typeof iteratorFn === 'function') {
      // Entry iterators used to provide implicit keys,
      // but now we print a separate warning for them later.
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step = void 0;
        while (!(step = iterator.next()).done) {
          if (isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}

/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */
function validatePropTypes(element) {
  var type = element.type;
  if (type === null || type === undefined || typeof type === 'string') {
    return;
  }
  var name = getComponentName(type);
  var propTypes = void 0;
  if (typeof type === 'function') {
    propTypes = type.propTypes;
  } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE ||
  // Note: Memo only checks outer props here.
  // Inner props are checked in the reconciler.
  type.$$typeof === REACT_MEMO_TYPE)) {
    propTypes = type.propTypes;
  } else {
    return;
  }
  if (propTypes) {
    setCurrentlyValidatingElement(element);
    checkPropTypes(propTypes, element.props, 'prop', name, ReactDebugCurrentFrame.getStackAddendum);
    setCurrentlyValidatingElement(null);
  } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
    propTypesMisspellWarningShown = true;
    warningWithoutStack$1(false, 'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
  }
  if (typeof type.getDefaultProps === 'function') {
    !type.getDefaultProps.isReactClassApproved ? warningWithoutStack$1(false, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
  }
}

/**
 * Given a fragment, validate that it can only be provided with fragment props
 * @param {ReactElement} fragment
 */
function validateFragmentProps(fragment) {
  setCurrentlyValidatingElement(fragment);

  var keys = Object.keys(fragment.props);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (key !== 'children' && key !== 'key') {
      warning$1(false, 'Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);
      break;
    }
  }

  if (fragment.ref !== null) {
    warning$1(false, 'Invalid attribute `ref` supplied to `React.Fragment`.');
  }

  setCurrentlyValidatingElement(null);
}

function createElementWithValidation(type, props, children) {
  var validType = isValidElementType(type);

  // We warn in this case but don't throw. We expect the element creation to
  // succeed and there will likely be errors in render.
  if (!validType) {
    var info = '';
    if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
      info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
    }

    var sourceInfo = getSourceInfoErrorAddendum(props);
    if (sourceInfo) {
      info += sourceInfo;
    } else {
      info += getDeclarationErrorAddendum();
    }

    var typeString = void 0;
    if (type === null) {
      typeString = 'null';
    } else if (Array.isArray(type)) {
      typeString = 'array';
    } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
      typeString = '<' + (getComponentName(type.type) || 'Unknown') + ' />';
      info = ' Did you accidentally export a JSX literal instead of a component?';
    } else {
      typeString = typeof type;
    }

    warning$1(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
  }

  var element = createElement.apply(this, arguments);

  // The result can be nullish if a mock or a custom function is used.
  // TODO: Drop this when these are no longer allowed as the type argument.
  if (element == null) {
    return element;
  }

  // Skip key warning if the type isn't valid since our key validation logic
  // doesn't expect a non-string/function type and can throw confusing errors.
  // We don't want exception behavior to differ between dev and prod.
  // (Rendering will throw with a helpful message and as soon as the type is
  // fixed, the key warnings will appear.)
  if (validType) {
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], type);
    }
  }

  if (type === REACT_FRAGMENT_TYPE) {
    validateFragmentProps(element);
  } else {
    validatePropTypes(element);
  }

  return element;
}

function createFactoryWithValidation(type) {
  var validatedFactory = createElementWithValidation.bind(null, type);
  validatedFactory.type = type;
  // Legacy hook: remove it
  {
    Object.defineProperty(validatedFactory, 'type', {
      enumerable: false,
      get: function () {
        lowPriorityWarning$1(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
        Object.defineProperty(this, 'type', {
          value: type
        });
        return type;
      }
    });
  }

  return validatedFactory;
}

function cloneElementWithValidation(element, props, children) {
  var newElement = cloneElement.apply(this, arguments);
  for (var i = 2; i < arguments.length; i++) {
    validateChildKeys(arguments[i], newElement.type);
  }
  validatePropTypes(newElement);
  return newElement;
}

var React = {
  Children: {
    map: mapChildren,
    forEach: forEachChildren,
    count: countChildren,
    toArray: toArray,
    only: onlyChild
  },

  createRef: createRef,
  Component: Component,
  PureComponent: PureComponent,

  createContext: createContext,
  forwardRef: forwardRef,
  lazy: lazy,
  memo: memo,

  Fragment: REACT_FRAGMENT_TYPE,
  StrictMode: REACT_STRICT_MODE_TYPE,
  Suspense: REACT_SUSPENSE_TYPE,

  createElement: createElementWithValidation,
  cloneElement: cloneElementWithValidation,
  createFactory: createFactoryWithValidation,
  isValidElement: isValidElement,

  version: ReactVersion,

  unstable_ConcurrentMode: REACT_CONCURRENT_MODE_TYPE,
  unstable_Profiler: REACT_PROFILER_TYPE,

  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals
};

// Note: some APIs are added with feature flags.
// Make sure that stable builds for open source
// don't modify the React object to avoid deopts.
// Also let's not expose their names in stable builds.

if (enableStableConcurrentModeAPIs) {
  React.ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
  React.Profiler = REACT_PROFILER_TYPE;
  React.unstable_ConcurrentMode = undefined;
  React.unstable_Profiler = undefined;
}

if (enableHooks) {
  React.useCallback = useCallback;
  React.useContext = useContext;
  React.useEffect = useEffect;
  React.useImperativeMethods = useImperativeMethods;
  React.useLayoutEffect = useLayoutEffect;
  React.useMemo = useMemo;
  React.useReducer = useReducer;
  React.useRef = useRef;
  React.useState = useState;
}



var React$2 = Object.freeze({
	default: React
});

var React$3 = ( React$2 && React ) || React$2;

// TODO: decide on the top-level export form.
// This is hacky but makes it work with both Rollup and Jest.
var react = React$3.default || React$3;

module.exports = react;
  })();
}


/***/ }),

/***/ "./node_modules/react/index.js":
/*!*************************************!*\
  !*** ./node_modules/react/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react.development.js */ "./node_modules/react/cjs/react.development.js");
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vanN4L0RhdGFUYWJsZS5qcyIsIndlYnBhY2s6Ly8vLi9qc3gvRmlsdGVyLmpzIiwid2VicGFjazovLy8uL2pzeC9GaWx0ZXJhYmxlRGF0YVRhYmxlLmpzIiwid2VicGFjazovLy8uL2pzeC9Gb3JtLmpzIiwid2VicGFjazovLy8uL2pzeC9Mb2FkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanN4L1BhZ2luYXRpb25MaW5rcy5qcyIsIndlYnBhY2s6Ly8vLi9qc3gvUGFuZWwuanMiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy91c2VyX2FjY291bnRzL2pzeC91c2VyQWNjb3VudHNJbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZmJqcy9saWIvZW1wdHlGdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZmJqcy9saWIvaW52YXJpYW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9mYmpzL2xpYi93YXJuaW5nLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2NoZWNrUHJvcFR5cGVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVhY3QtYWRkb25zLWNyZWF0ZS1mcmFnbWVudC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVhY3QvY2pzL3JlYWN0LmRldmVsb3BtZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZWFjdC9pbmRleC5qcyJdLCJuYW1lcyI6WyJEYXRhVGFibGUiLCJwcm9wcyIsInN0YXRlIiwiUGFnZU51bWJlciIsIlNvcnRDb2x1bW4iLCJTb3J0T3JkZXIiLCJSb3dzUGVyUGFnZSIsIkhpZGUiLCJjaGFuZ2VQYWdlIiwiYmluZCIsInNldFNvcnRDb2x1bW4iLCJjaGFuZ2VSb3dzUGVyUGFnZSIsImRvd25sb2FkQ1NWIiwiY291bnRGaWx0ZXJlZFJvd3MiLCJnZXRTb3J0ZWRSb3dzIiwiaGFzRmlsdGVyS2V5d29yZCIsInJlbmRlckFjdGlvbnMiLCJqUXVlcnkiLCJmbiIsIkR5bmFtaWNUYWJsZSIsImZyZWV6ZUNvbHVtbiIsIiQiLCJkZWZhdWx0Q29sdW1uIiwiZmluZCIsImhpZGUiLCJtb2R1bGVQcmVmcyIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJsb3JpcyIsIlRlc3ROYW1lIiwidW5kZWZpbmVkIiwicm93c1BlclBhZ2UiLCJzZXRTdGF0ZSIsInByZXZQcm9wcyIsInByZXZTdGF0ZSIsIm9uU29ydCIsImluZGV4IiwiaGVhZGVyTGlzdCIsImZpZWxkcyIsIm1hcCIsImZpZWxkIiwibGFiZWwiLCJkYXRhIiwicGFnZU5vIiwiY29sTnVtYmVyIiwiZSIsInZhbCIsInRhcmdldCIsInZhbHVlIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsImNzdkRhdGEiLCJjc3Z3b3JrZXIiLCJXb3JrZXIiLCJCYXNlVVJMIiwiYWRkRXZlbnRMaXN0ZW5lciIsImRhdGFVUkwiLCJkYXRhRGF0ZSIsImxpbmsiLCJjbWQiLCJEYXRlIiwidG9JU09TdHJpbmciLCJ3aW5kb3ciLCJVUkwiLCJjcmVhdGVPYmplY3RVUkwiLCJtZXNzYWdlIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZG93bmxvYWQiLCJ0eXBlIiwiaHJlZiIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImNsaWNrIiwicmVtb3ZlQ2hpbGQiLCJwb3N0TWVzc2FnZSIsImhlYWRlcnMiLCJpZGVudGlmaWVycyIsIlJvd05hbWVNYXAiLCJ1c2VLZXl3b3JkIiwiZmlsdGVyTWF0Y2hDb3VudCIsImZpbHRlclZhbHVlc0NvdW50IiwiZmlsdGVyIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsInRhYmxlRGF0YSIsImZpZWxkRGF0YSIsImtleXdvcmQiLCJpIiwiaGVhZGVyQ291bnQiLCJrZXl3b3JkTWF0Y2giLCJqIiwibmFtZSIsImhhc0ZpbHRlcnMiLCJpc1N0cmluZyIsIlN0cmluZyIsImlzTnVtYmVyIiwiaXNOYU4iLCJOdW1iZXIiLCJ0b0xvd2VyQ2FzZSIsInB1c2giLCJSb3dJZHgiLCJWYWx1ZSIsIkNvbnRlbnQiLCJzb3J0IiwiYSIsImIiLCJmaWx0ZXJEYXRhIiwiZXhhY3RNYXRjaCIsInJlc3VsdCIsInNlYXJjaEtleSIsInNlYXJjaFN0cmluZyIsImludERhdGEiLCJwYXJzZUludCIsInNlYXJjaEFycmF5IiwiaW5jbHVkZXMiLCJpbmRleE9mIiwibWF0Y2giLCJhY3Rpb25zIiwiYWN0aW9uIiwia2V5IiwiUm93TnVtTGFiZWwiLCJzaG93IiwiY29sSW5kZXgiLCJyb3dzIiwiY3VyUm93IiwibWF0Y2hlc0ZvdW5kIiwiZmlsdGVyZWRSb3dzIiwiY3VycmVudFBhZ2VSb3ciLCJmaWx0ZXJlZERhdGEiLCJmaWx0ZXJMZW5ndGgiLCJnZXRGb3JtYXR0ZWRDZWxsIiwicm93IiwiZm9yRWFjaCIsImsiLCJjcmVhdGVGcmFnbWVudCIsInJvd0luZGV4IiwiUm93c1BlclBhZ2VEcm9wZG93biIsImhlYWRlciIsIm1hcmdpblRvcCIsImZvb3RlciIsIm1hcmdpbiIsIkNvbXBvbmVudCIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsImFycmF5IiwiaXNSZXF1aXJlZCIsInN0cmluZyIsImZ1bmMiLCJvYmplY3QiLCJkZWZhdWx0UHJvcHMiLCJGaWx0ZXIiLCJvbkZpZWxkVXBkYXRlIiwicmVuZGVyRmlsdGVyRmllbGRzIiwiaWQiLCJ1cGRhdGVGaWx0ZXIiLCJyZWR1Y2UiLCJlbGVtZW50Iiwib3B0aW9ucyIsIlJlYWN0IiwiY2xvbmVFbGVtZW50Iiwib25Vc2VySW5wdXQiLCJjb2x1bW5zIiwidGl0bGUiLCJjbGVhckZpbHRlciIsImNvbnNvbGUiLCJ3YXJuIiwiRmlsdGVyYWJsZURhdGFUYWJsZSIsIm51bWJlciIsIkZvcm1FbGVtZW50IiwiZ2V0Rm9ybUVsZW1lbnRzIiwiaGFuZGxlU3VibWl0IiwiZm9ybUVsZW1lbnRzSFRNTCIsIm1heENvbHVtblNpemUiLCJjb2xTaXplIiwiTWF0aCIsImZsb29yIiwiY29sQ2xhc3MiLCJmb3JtRWxlbWVudHMiLCJvYmpLZXkiLCJ1c2VySW5wdXQiLCJDaGlsZHJlbiIsImNoaWxkcmVuIiwiY2hpbGQiLCJlbGVtZW50Q2xhc3MiLCJpc1ZhbGlkRWxlbWVudCIsIm9uU3VibWl0IiwicHJldmVudERlZmF1bHQiLCJlbmNUeXBlIiwiZmlsZVVwbG9hZCIsInJvd1N0eWxlcyIsImRpc3BsYXkiLCJmbGV4V3JhcCIsImNsYXNzIiwibWV0aG9kIiwib25lT2YiLCJzaGFwZSIsImVsZW1lbnROYW1lIiwiRmllbGRzZXRFbGVtZW50IiwibGVnZW5kIiwiU2VhcmNoYWJsZURyb3Bkb3duIiwiZ2V0S2V5RnJvbVZhbHVlIiwiaGFuZGxlQ2hhbmdlIiwiaGFuZGxlQmx1ciIsImdldFRleHRJbnB1dFZhbHVlIiwibyIsInN0cmljdFNlYXJjaCIsInZhbHVlcyIsInF1ZXJ5U2VsZWN0b3IiLCJyZXF1aXJlZCIsImRpc2FibGVkIiwic29ydEJ5VmFsdWUiLCJzdHJpY3RNZXNzYWdlIiwiZXJyb3JNZXNzYWdlIiwicmVxdWlyZWRIVE1MIiwibXNnIiwibmV3T3B0aW9ucyIsIm9wdGlvbkxpc3QiLCJoYXNPd25Qcm9wZXJ0eSIsIm9wdGlvbiIsInBsYWNlSG9sZGVyIiwiYm9vbCIsIm9uZU9mVHlwZSIsIlNlbGVjdEVsZW1lbnQiLCJudW1PZk9wdGlvbnMiLCJtdWx0aXBsZSIsImwiLCJzZWxlY3RlZCIsImVtcHR5T3B0aW9uSFRNTCIsImVtcHR5T3B0aW9uIiwiaGFzRXJyb3IiLCJUYWdzRWxlbWVudCIsImhhbmRsZUtleVByZXNzIiwiaGFuZGxlQWRkIiwiaGFuZGxlUmVtb3ZlIiwiY2FuQWRkSXRlbSIsInBlbmRpbmdWYWxLZXkiLCJrZXlDb2RlIiwid2hpY2giLCJ1c2VTZWFyY2giLCJvblVzZXJBZGQiLCJnZXRBdHRyaWJ1dGUiLCJvblVzZXJSZW1vdmUiLCJhbGxvd0R1cGwiLCJpdGVtcyIsImlucHV0IiwiaXRlbSIsIml0bVR4dCIsImJ0bkxhYmVsIiwiVGV4dGFyZWFFbGVtZW50IiwiY29scyIsIlRleHRib3hFbGVtZW50Iiwib25Vc2VyQmx1ciIsIkRhdGVFbGVtZW50IiwibWluWWVhciIsIm1heFllYXIiLCJUaW1lRWxlbWVudCIsIk51bWVyaWNFbGVtZW50IiwibWluIiwibWF4IiwiRmlsZUVsZW1lbnQiLCJmaWxlIiwiZmlsZXMiLCJmaWxlTmFtZSIsInRydW5jYXRlRWxsaXBzaXMiLCJ0YWJsZUxheW91dCIsIndpZHRoIiwid2hpdGVTcGFjZSIsInRydW5jYXRlRWxsaXBzaXNDaGlsZCIsIm92ZXJmbG93IiwidGV4dE92ZXJmbG93IiwiZmlsZUhUTUwiLCJwYWRkaW5nVG9wIiwiU3RhdGljRWxlbWVudCIsInRleHQiLCJMaW5rRWxlbWVudCIsIkNoZWNrYm94RWxlbWVudCIsImNoZWNrZWQiLCJCdXR0b25FbGVtZW50IiwiaGFuZGxlQ2xpY2siLCJjb2x1bW5TaXplIiwiYnV0dG9uQ2xhc3MiLCJDVEEiLCJMb3Jpc0VsZW1lbnQiLCJlbGVtZW50UHJvcHMiLCJyZWYiLCJlbGVtZW50SHRtbCIsIkxvYWRlciIsInNpemUiLCJoZWlnaHQiLCJQYWdpbmF0aW9uTGlua3MiLCJldnQiLCJvbkNoYW5nZVBhZ2UiLCJwYWdlTGlua3MiLCJjbGFzc0xpc3QiLCJsYXN0UGFnZSIsImNlaWwiLCJUb3RhbCIsInN0YXJ0UGFnZSIsIkFjdGl2ZSIsImxhc3RTaG93blBhZ2UiLCJ0b1N0cmluZyIsIlJQYWdpbmF0aW9uTGlua3MiLCJjcmVhdGVGYWN0b3J5IiwiUGFuZWwiLCJjb2xsYXBzZWQiLCJpbml0Q29sbGFwc2VkIiwicGFuZWxDbGFzcyIsInRvZ2dsZUNvbGxhcHNlZCIsImdseXBoQ2xhc3MiLCJwYW5lbEhlYWRpbmciLCJjdXJzb3IiLCJVc2VyQWNjb3VudHNJbmRleCIsImVycm9yIiwiaXNMb2FkZWQiLCJmZXRjaERhdGEiLCJmb3JtYXRDb2x1bW4iLCJhZGRVc2VyIiwidGhlbiIsImZldGNoIiwiY3JlZGVudGlhbHMiLCJyZXNwIiwianNvbiIsIkRhdGEiLCJzcGxpdCIsImNhdGNoIiwiY29sdW1uIiwiY2VsbCIsInVybCIsImpvaW4iLCJVc2VybmFtZSIsImxvY2F0aW9uIiwiZmllbGRPcHRpb25zIiwic2l0ZXMiLCJhY3RpdmVzIiwicGVuZGluZ0FwcHJvdmFscyIsImhhc1Blcm1pc3Npb24iLCJSZWFjdERPTSIsInJlbmRlciIsInVzZXJIYXNQZXJtaXNzaW9uIiwiZ2V0RWxlbWVudEJ5SWQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCw0QkFBNEI7QUFDNUIsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEsSUFBcUM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxVQUFVLEtBQXFDO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHNCQUFzQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9FQUFvRTtBQUNwRTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsUUFBUSxJQUFxQztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7O0FDelZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7Ozs7QUFJYixJQUFJLElBQXFDO0FBQ3pDO0FBQ0E7O0FBRUEsY0FBYyxtQkFBTyxDQUFDLDREQUFlO0FBQ3JD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Q0EsV0FBVyxnQkFBZ0I7QUFDM0I7QUFDQSxXQUFXLFVBQVU7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFVBQVU7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0ZBQXNGLGFBQWE7QUFDbkc7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixXQUFXLEVBQUU7QUFDYixXQUFXLGNBQWM7QUFDekIsV0FBVyxFQUFFO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYjtBQUNBLFdBQVcsRUFBRTtBQUNiLFdBQVcsRUFBRTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxtQkFBbUIsb0JBQW9CO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLHdCQUF3Qjs7QUFFeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFD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QUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixZQUFZLGFBQWE7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGFBQWE7QUFDeEIsV0FBVyxFQUFFO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsRUFBRTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixpQkFBaUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsYUFBYTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsYUFBYTtBQUN4QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsaUJBQWlCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixzQkFBc0I7QUFDekM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsc0JBQXNCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIOzs7Ozs7Ozs7Ozs7O0FDMTFEYTs7QUFFYixJQUFJLEtBQXFDLEVBQUUsRUFFMUM7QUFDRCxtQkFBbUIsbUJBQU8sQ0FBQyxpRkFBNEI7QUFDdkQiLCJmaWxlIjoiLi9tb2R1bGVzL3VzZXJfYWNjb3VudHMvanMvdXNlckFjY291bnRzSW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL21vZHVsZXMvdXNlcl9hY2NvdW50cy9qc3gvdXNlckFjY291bnRzSW5kZXguanNcIik7XG4iLCIvKipcbiAqIFRoaXMgZmlsZSBjb250YWlucyBSZWFjdCBjb21wb25lbnQgZm9yIERhdGEgVGFibGVcbiAqXG4gKiBAYXV0aG9yIExvcmlzIFRlYW1cbiAqIEB2ZXJzaW9uIDEuMC4wXG4gKlxuICovXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBQYWdpbmF0aW9uTGlua3MgZnJvbSAnLi9QYWdpbmF0aW9uTGlua3MnO1xuaW1wb3J0IGNyZWF0ZUZyYWdtZW50IGZyb20gJ3JlYWN0LWFkZG9ucy1jcmVhdGUtZnJhZ21lbnQnO1xuaW1wb3J0IENUQSBmcm9tICcuL0Zvcm0nO1xuXG4vKipcbiAqIERhdGEgVGFibGUgY29tcG9uZW50XG4gKiBEaXNwbGF5cyBhIHNldCBvZiBkYXRhIHRoYXQgaXMgcmVjZWl2ZXMgdmlhIHByb3BzLlxuICovXG5jbGFzcyBEYXRhVGFibGUgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBQYWdlTnVtYmVyOiAxLFxuICAgICAgU29ydENvbHVtbjogLTEsXG4gICAgICBTb3J0T3JkZXI6ICdBU0MnLFxuICAgICAgUm93c1BlclBhZ2U6IDIwLFxuICAgICAgSGlkZTogdGhpcy5wcm9wcy5IaWRlLFxuICAgIH07XG5cbiAgICB0aGlzLmNoYW5nZVBhZ2UgPSB0aGlzLmNoYW5nZVBhZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNldFNvcnRDb2x1bW4gPSB0aGlzLnNldFNvcnRDb2x1bW4uYmluZCh0aGlzKTtcbiAgICB0aGlzLmNoYW5nZVJvd3NQZXJQYWdlID0gdGhpcy5jaGFuZ2VSb3dzUGVyUGFnZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZG93bmxvYWRDU1YgPSB0aGlzLmRvd25sb2FkQ1NWLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jb3VudEZpbHRlcmVkUm93cyA9IHRoaXMuY291bnRGaWx0ZXJlZFJvd3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldFNvcnRlZFJvd3MgPSB0aGlzLmdldFNvcnRlZFJvd3MuYmluZCh0aGlzKTsvL1xuICAgIHRoaXMuaGFzRmlsdGVyS2V5d29yZCA9IHRoaXMuaGFzRmlsdGVyS2V5d29yZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVuZGVyQWN0aW9ucyA9IHRoaXMucmVuZGVyQWN0aW9ucy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgaWYgKGpRdWVyeS5mbi5EeW5hbWljVGFibGUpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLmZyZWV6ZUNvbHVtbikge1xuICAgICAgICAkKCcjZHluYW1pY3RhYmxlJykuRHluYW1pY1RhYmxlKHtcbiAgICAgICAgICBmcmVlemVDb2x1bW46IHRoaXMucHJvcHMuZnJlZXplQ29sdW1uLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoJyNkeW5hbWljdGFibGUnKS5EeW5hbWljVGFibGUoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnN0YXRlLkhpZGUuZGVmYXVsdENvbHVtbikge1xuICAgICAgICAkKCcjZHluYW1pY3RhYmxlJykuZmluZCgndGJvZHkgdGQ6ZXEoMCknKS5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0cmlldmUgbW9kdWxlIHByZWZlcmVuY2VzXG4gICAgbGV0IG1vZHVsZVByZWZzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbW9kdWxlUHJlZnMnKSk7XG5cbiAgICAvLyBJbml0IG1vZHVsZVByZWZzIG9iamVjdFxuICAgIGlmIChtb2R1bGVQcmVmcyA9PT0gbnVsbCkge1xuICAgICAgbW9kdWxlUHJlZnMgPSB7fTtcbiAgICB9XG5cbiAgICAvLyBJbml0IG1vZHVsZVByZWZzIGZvciBjdXJyZW50IG1vZHVsZVxuICAgIGlmIChtb2R1bGVQcmVmc1tsb3Jpcy5UZXN0TmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgbW9kdWxlUHJlZnNbbG9yaXMuVGVzdE5hbWVdID0ge307XG4gICAgICBtb2R1bGVQcmVmc1tsb3Jpcy5UZXN0TmFtZV0ucm93c1BlclBhZ2UgPSB0aGlzLnN0YXRlLlJvd3NQZXJQYWdlO1xuICAgIH1cblxuICAgIC8vIFNldCByb3dzIHBlciBwYWdlXG4gICAgY29uc3Qgcm93c1BlclBhZ2UgPSBtb2R1bGVQcmVmc1tsb3Jpcy5UZXN0TmFtZV0ucm93c1BlclBhZ2U7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBSb3dzUGVyUGFnZTogcm93c1BlclBhZ2UsXG4gICAgfSk7XG5cbiAgICAvLyBNYWtlIHByZWZzIGFjY2VzaWJsZSB3aXRoaW4gY29tcG9uZW50XG4gICAgdGhpcy5tb2R1bGVQcmVmcyA9IG1vZHVsZVByZWZzO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgaWYgKGpRdWVyeS5mbi5EeW5hbWljVGFibGUpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLmZyZWV6ZUNvbHVtbikge1xuICAgICAgICAkKCcjZHluYW1pY3RhYmxlJykuRHluYW1pY1RhYmxlKHtcbiAgICAgICAgICBmcmVlemVDb2x1bW46IHRoaXMucHJvcHMuZnJlZXplQ29sdW1uLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoJyNkeW5hbWljdGFibGUnKS5EeW5hbWljVGFibGUoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMucHJvcHMub25Tb3J0ICYmXG4gICAgICAodGhpcy5zdGF0ZS5Tb3J0Q29sdW1uICE9PSBwcmV2U3RhdGUuU29ydENvbHVtbiB8fFxuICAgICAgICB0aGlzLnN0YXRlLlNvcnRPcmRlciAhPT0gcHJldlN0YXRlLlNvcnRPcmRlcilcbiAgICApIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5nZXRTb3J0ZWRSb3dzKCk7XG4gICAgICBjb25zdCBoZWFkZXJMaXN0ID0gdGhpcy5wcm9wcy5maWVsZHMubWFwKChmaWVsZCkgPT4gZmllbGQubGFiZWwpO1xuICAgICAgdGhpcy5wcm9wcy5vblNvcnQoaW5kZXgsIHRoaXMucHJvcHMuZGF0YSwgaGVhZGVyTGlzdCk7XG4gICAgfVxuICB9XG5cbiAgY2hhbmdlUGFnZShwYWdlTm8pIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIFBhZ2VOdW1iZXI6IHBhZ2VObyxcbiAgICB9KTtcbiAgfVxuXG4gIHNldFNvcnRDb2x1bW4oY29sTnVtYmVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLlNvcnRDb2x1bW4gPT09IGNvbE51bWJlcikge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBTb3J0T3JkZXI6IHRoaXMuc3RhdGUuU29ydE9yZGVyID09PSAnQVNDJyA/ICdERVNDJyA6ICdBU0MnLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIFNvcnRDb2x1bW46IGNvbE51bWJlcixcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGNoYW5nZVJvd3NQZXJQYWdlKHZhbCkge1xuICAgIGNvbnN0IHJvd3NQZXJQYWdlID0gdmFsLnRhcmdldC52YWx1ZTtcbiAgICBjb25zdCBtb2R1bGVQcmVmcyA9IHRoaXMubW9kdWxlUHJlZnM7XG5cbiAgICAvLyBTYXZlIGN1cnJlbnQgc2VsZWN0aW9uXG4gICAgbW9kdWxlUHJlZnNbbG9yaXMuVGVzdE5hbWVdLnJvd3NQZXJQYWdlID0gcm93c1BlclBhZ2U7XG5cbiAgICAvLyBVcGRhdGUgbG9jYWxzdG9yYWdlXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ21vZHVsZVByZWZzJywgSlNPTi5zdHJpbmdpZnkobW9kdWxlUHJlZnMpKTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgUm93c1BlclBhZ2U6IHJvd3NQZXJQYWdlLFxuICAgICAgUGFnZU51bWJlcjogMSxcbiAgICB9KTtcbiAgfVxuXG4gIGRvd25sb2FkQ1NWKGNzdkRhdGEpIHtcbiAgICBjb25zdCBjc3Z3b3JrZXIgPSBuZXcgV29ya2VyKGxvcmlzLkJhc2VVUkwgKyAnL2pzL3dvcmtlcnMvc2F2ZWNzdi5qcycpO1xuXG4gICAgY3N2d29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgICBsZXQgZGF0YVVSTDtcbiAgICAgIGxldCBkYXRhRGF0ZTtcbiAgICAgIGxldCBsaW5rO1xuICAgICAgaWYgKGUuZGF0YS5jbWQgPT09ICdTYXZlQ1NWJykge1xuICAgICAgICBkYXRhRGF0ZSA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICAgICAgZGF0YVVSTCA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGUuZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgbGluay5kb3dubG9hZCA9ICdkYXRhLScgKyBkYXRhRGF0ZSArICcuY3N2JztcbiAgICAgICAgbGluay50eXBlID0gJ3RleHQvY3N2JztcbiAgICAgICAgbGluay5ocmVmID0gZGF0YVVSTDtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgICAgJChsaW5rKVswXS5jbGljaygpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGhlYWRlckxpc3QgPSB0aGlzLnByb3BzLmZpZWxkcy5tYXAoKGZpZWxkKSA9PiBmaWVsZC5sYWJlbCk7XG4gICAgY3N2d29ya2VyLnBvc3RNZXNzYWdlKHtcbiAgICAgIGNtZDogJ1NhdmVGaWxlJyxcbiAgICAgIGRhdGE6IGNzdkRhdGEsXG4gICAgICBoZWFkZXJzOiBoZWFkZXJMaXN0LFxuICAgICAgaWRlbnRpZmllcnM6IHRoaXMucHJvcHMuUm93TmFtZU1hcCxcbiAgICB9KTtcbiAgfVxuXG4gIGNvdW50RmlsdGVyZWRSb3dzKCkge1xuICAgIGxldCB1c2VLZXl3b3JkID0gZmFsc2U7XG4gICAgbGV0IGZpbHRlck1hdGNoQ291bnQgPSAwO1xuICAgIGxldCBmaWx0ZXJWYWx1ZXNDb3VudCA9ICh0aGlzLnByb3BzLmZpbHRlciA/XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMucHJvcHMuZmlsdGVyKS5sZW5ndGggOlxuICAgICAgICAwXG4gICAgKTtcbiAgICBjb25zdCB0YWJsZURhdGEgPSB0aGlzLnByb3BzLmRhdGE7XG4gICAgY29uc3QgZmllbGREYXRhID0gdGhpcy5wcm9wcy5maWVsZHM7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5maWx0ZXIua2V5d29yZCkge1xuICAgICAgdXNlS2V5d29yZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHVzZUtleXdvcmQpIHtcbiAgICAgIGZpbHRlclZhbHVlc0NvdW50IC09IDE7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJsZURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBoZWFkZXJDb3VudCA9IDA7XG4gICAgICBsZXQga2V5d29yZE1hdGNoID0gMDtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZmllbGREYXRhLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0YWJsZURhdGFbaV0gPyB0YWJsZURhdGFbaV1bal0gOiBudWxsO1xuICAgICAgICBpZiAodGhpcy5oYXNGaWx0ZXJLZXl3b3JkKChmaWVsZERhdGFbal0uZmlsdGVyIHx8IHt9KS5uYW1lLCBkYXRhKSkge1xuICAgICAgICAgIGhlYWRlckNvdW50Kys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVzZUtleXdvcmQpIHtcbiAgICAgICAgICBpZiAodGhpcy5oYXNGaWx0ZXJLZXl3b3JkKCdrZXl3b3JkJywgZGF0YSkpIHtcbiAgICAgICAgICAgIGtleXdvcmRNYXRjaCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoaGVhZGVyQ291bnQgPT09IGZpbHRlclZhbHVlc0NvdW50ICYmXG4gICAgICAgICgodXNlS2V5d29yZCA9PT0gdHJ1ZSAmJiBrZXl3b3JkTWF0Y2ggPiAwKSB8fFxuICAgICAgICAgICh1c2VLZXl3b3JkID09PSBmYWxzZSAmJiBrZXl3b3JkTWF0Y2ggPT09IDApKSkge1xuICAgICAgICBmaWx0ZXJNYXRjaENvdW50Kys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaGFzRmlsdGVycyA9IChmaWx0ZXJWYWx1ZXNDb3VudCAhPT0gMCk7XG4gICAgaWYgKGZpbHRlck1hdGNoQ291bnQgPT09IDAgJiYgaGFzRmlsdGVycykge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIChmaWx0ZXJNYXRjaENvdW50ID09PSAwKSA/IHRhYmxlRGF0YS5sZW5ndGggOiBmaWx0ZXJNYXRjaENvdW50O1xuICB9XG5cbiAgZ2V0U29ydGVkUm93cygpIHtcbiAgICBjb25zdCBpbmRleCA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByb3BzLmRhdGEubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGxldCB2YWwgPSB0aGlzLnByb3BzLmRhdGFbaV1bdGhpcy5zdGF0ZS5Tb3J0Q29sdW1uXSB8fCB1bmRlZmluZWQ7XG4gICAgICAvLyBJZiBTb3J0Q29sdW1uIGlzIGVxdWFsIHRvIGRlZmF1bHQgTm8uIGNvbHVtbiwgc2V0IHZhbHVlIHRvIGJlXG4gICAgICAvLyBpbmRleCArIDFcbiAgICAgIGlmICh0aGlzLnN0YXRlLlNvcnRDb2x1bW4gPT09IC0xKSB7XG4gICAgICAgIHZhbCA9IGkgKyAxO1xuICAgICAgfVxuICAgICAgY29uc3QgaXNTdHJpbmcgPSAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgfHwgdmFsIGluc3RhbmNlb2YgU3RyaW5nKTtcbiAgICAgIGNvbnN0IGlzTnVtYmVyID0gIWlzTmFOKHZhbCkgJiYgdHlwZW9mIHZhbCAhPT0gJ29iamVjdCc7XG5cbiAgICAgIGlmICh2YWwgPT09ICcuJykge1xuICAgICAgICAvLyBoYWNrIHRvIGhhbmRsZSBub24tZXhpc3RlbnQgaXRlbXMgaW4gRFFUXG4gICAgICAgIHZhbCA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKGlzTnVtYmVyKSB7XG4gICAgICAgIC8vIHBlcmZvcm0gdHlwZSBjb252ZXJzaW9uIChmcm9tIHN0cmluZyB0byBpbnQvZmxvYXQpXG4gICAgICAgIHZhbCA9IE51bWJlcih2YWwpO1xuICAgICAgfSBlbHNlIGlmIChpc1N0cmluZykge1xuICAgICAgICAvLyBpZiBzdHJpbmcgd2l0aCB0ZXh0IGNvbnZlcnQgdG8gbG93ZXJjYXNlXG4gICAgICAgIHZhbCA9IHZhbC50b0xvd2VyQ2FzZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5wcm9wcy5Sb3dOYW1lTWFwKSB7XG4gICAgICAgIGluZGV4LnB1c2goe1Jvd0lkeDogaSwgVmFsdWU6IHZhbCwgQ29udGVudDogdGhpcy5wcm9wcy5Sb3dOYW1lTWFwW2ldfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmRleC5wdXNoKHtSb3dJZHg6IGksIFZhbHVlOiB2YWwsIENvbnRlbnQ6IGkgKyAxfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW5kZXguc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5Tb3J0T3JkZXIgPT09ICdBU0MnKSB7XG4gICAgICAgIGlmIChhLlZhbHVlID09PSBiLlZhbHVlKSB7XG4gICAgICAgICAgLy8gSWYgYWxsIHZhbHVlcyBhcmUgZXF1YWwsIHNvcnQgYnkgcm93bnVtXG4gICAgICAgICAgaWYgKGEuUm93SWR4IDwgYi5Sb3dJZHgpIHJldHVybiAtMTtcbiAgICAgICAgICBpZiAoYS5Sb3dJZHggPiBiLlJvd0lkeCkgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2hlY2sgaWYgbnVsbCB2YWx1ZXNcbiAgICAgICAgaWYgKGEuVmFsdWUgPT09IG51bGwgfHwgdHlwZW9mIGEuVmFsdWUgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gLTE7XG4gICAgICAgIGlmIChiLlZhbHVlID09PSBudWxsIHx8IHR5cGVvZiBiLlZhbHVlID09PSAndW5kZWZpbmVkJykgcmV0dXJuIDE7XG5cbiAgICAgICAgLy8gU29ydCBieSB2YWx1ZVxuICAgICAgICBpZiAoYS5WYWx1ZSA8IGIuVmFsdWUpIHJldHVybiAtMTtcbiAgICAgICAgaWYgKGEuVmFsdWUgPiBiLlZhbHVlKSByZXR1cm4gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChhLlZhbHVlID09PSBiLlZhbHVlKSB7XG4gICAgICAgICAgLy8gSWYgYWxsIHZhbHVlcyBhcmUgZXF1YWwsIHNvcnQgYnkgcm93bnVtXG4gICAgICAgICAgaWYgKGEuUm93SWR4IDwgYi5Sb3dJZHgpIHJldHVybiAxO1xuICAgICAgICAgIGlmIChhLlJvd0lkeCA+IGIuUm93SWR4KSByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2hlY2sgaWYgbnVsbCB2YWx1ZXNcbiAgICAgICAgaWYgKGEuVmFsdWUgPT09IG51bGwgfHwgdHlwZW9mIGEuVmFsdWUgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGIuVmFsdWUgPT09IG51bGwgfHwgdHlwZW9mIGIuVmFsdWUgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gLTE7XG5cbiAgICAgICAgLy8gU29ydCBieSB2YWx1ZVxuICAgICAgICBpZiAoYS5WYWx1ZSA8IGIuVmFsdWUpIHJldHVybiAxO1xuICAgICAgICBpZiAoYS5WYWx1ZSA+IGIuVmFsdWUpIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIC8vIFRoZXkncmUgZXF1YWwuLlxuICAgICAgcmV0dXJuIDA7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICByZXR1cm4gaW5kZXg7XG4gIH1cblxuICAvKipcbiAgICogU2VhcmNoZXMgZm9yIHRoZSBmaWx0ZXIga2V5d29yZCBpbiB0aGUgY29sdW1uIGNlbGxcbiAgICpcbiAgICogTm90ZTogU2VhcmNoIGlzIGNhc2UtaW5zZW5zaXRpdmUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIGZpZWxkIG5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRhdGEgc2VhcmNoIHN0cmluZ1xuICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlLCBpZiBmaWx0ZXIgdmFsdWUgaXMgZm91bmQgdG8gYmUgYSBzdWJzdHJpbmdcbiAgICogb2Ygb25lIG9mIHRoZSBjb2x1bW4gdmFsdWVzLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBoYXNGaWx0ZXJLZXl3b3JkKG5hbWUsIGRhdGEpIHtcbiAgICBsZXQgZmlsdGVyRGF0YSA9IG51bGw7XG4gICAgbGV0IGV4YWN0TWF0Y2ggPSBmYWxzZTtcbiAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XG4gICAgbGV0IHNlYXJjaEtleSA9IG51bGw7XG4gICAgbGV0IHNlYXJjaFN0cmluZyA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5maWx0ZXJbbmFtZV0pIHtcbiAgICAgIGZpbHRlckRhdGEgPSB0aGlzLnByb3BzLmZpbHRlcltuYW1lXS52YWx1ZTtcbiAgICAgIGV4YWN0TWF0Y2ggPSB0aGlzLnByb3BzLmZpbHRlcltuYW1lXS5leGFjdE1hdGNoO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBudWxsIGlucHV0c1xuICAgIGlmIChmaWx0ZXJEYXRhID09PSBudWxsIHx8IGRhdGEgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgbnVtZXJpYyBpbnB1dHNcbiAgICBpZiAodHlwZW9mIGZpbHRlckRhdGEgPT09ICdudW1iZXInKSB7XG4gICAgICBjb25zdCBpbnREYXRhID0gTnVtYmVyLnBhcnNlSW50KGRhdGEsIDEwKTtcbiAgICAgIHJlc3VsdCA9IChmaWx0ZXJEYXRhID09PSBpbnREYXRhKTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgc3RyaW5nIGlucHV0c1xuICAgIGlmICh0eXBlb2YgZmlsdGVyRGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHNlYXJjaEtleSA9IGZpbHRlckRhdGEudG9Mb3dlckNhc2UoKTtcbiAgICAgIHN3aXRjaCAodHlwZW9mIGRhdGEpIHtcbiAgICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgICAvLyBIYW5kbGVzIHRoZSBjYXNlIHdoZXJlIHRoZSBkYXRhIGlzIGFuIGFycmF5ICh0eXBlb2YgJ29iamVjdCcpXG4gICAgICAgICAgLy8gYW5kIHlvdSB3YW50IHRvIHNlYXJjaCB0aHJvdWdoIGl0IGZvclxuICAgICAgICAgIC8vIHRoZSBzdHJpbmcgeW91IGFyZSBmaWx0ZXJpbmcgYnlcbiAgICAgICAgICBjb25zdCBzZWFyY2hBcnJheSA9IGRhdGEubWFwKChlKSA9PiBlLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgIGlmIChleGFjdE1hdGNoKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBzZWFyY2hBcnJheS5pbmNsdWRlcyhzZWFyY2hLZXkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSAoc2VhcmNoQXJyYXkuZmluZCgoZSkgPT4gKGUuaW5kZXhPZihzZWFyY2hLZXkpID4gLTEpKSkgIT09IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgc2VhcmNoU3RyaW5nID0gZGF0YS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgIGlmIChleGFjdE1hdGNoKSB7XG4gICAgICAgICAgICByZXN1bHQgPSAoc2VhcmNoU3RyaW5nID09PSBzZWFyY2hLZXkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSAoc2VhcmNoU3RyaW5nLmluZGV4T2Yoc2VhcmNoS2V5KSA+IC0xKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIGFycmF5IGlucHV0cyBmb3IgbXVsdGlzZWxlY3RzXG4gICAgaWYgKHR5cGVvZiBmaWx0ZXJEYXRhID09PSAnb2JqZWN0Jykge1xuICAgICAgbGV0IG1hdGNoID0gZmFsc2U7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbHRlckRhdGEubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgc2VhcmNoS2V5ID0gZmlsdGVyRGF0YVtpXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBzZWFyY2hTdHJpbmcgPSBkYXRhLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgbWF0Y2ggPSAoc2VhcmNoU3RyaW5nLmluZGV4T2Yoc2VhcmNoS2V5KSA+IC0xKTtcbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICByZW5kZXJBY3Rpb25zKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmFjdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmFjdGlvbnMubWFwKChhY3Rpb24sIGtleSkgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxDVEFcbiAgICAgICAgICAgIGtleT17a2V5fVxuICAgICAgICAgICAgbGFiZWw9e2FjdGlvbi5sYWJlbH1cbiAgICAgICAgICAgIG9uVXNlcklucHV0PXthY3Rpb24uYWN0aW9ufVxuICAgICAgICAgIC8+XG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuZGF0YSA9PT0gbnVsbCB8fCB0aGlzLnByb3BzLmRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYWxlcnQgYWxlcnQtaW5mbyBuby1yZXN1bHQtZm91bmQtcGFuZWwnPlxuICAgICAgICAgIDxzdHJvbmc+Tm8gcmVzdWx0IGZvdW5kLjwvc3Ryb25nPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICAgIGNvbnN0IHJvd3NQZXJQYWdlID0gdGhpcy5zdGF0ZS5Sb3dzUGVyUGFnZTtcbiAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5zdGF0ZS5IaWRlLmRlZmF1bHRDb2x1bW4gPT09IHRydWUgPyBbXSA6IFtcbiAgICAgIDx0aCBrZXk9J3RoX2NvbF8wJyBvbkNsaWNrPXt0aGlzLnNldFNvcnRDb2x1bW4oLTEpLmJpbmQodGhpcyl9PlxuICAgICAgICB7dGhpcy5wcm9wcy5Sb3dOdW1MYWJlbH1cbiAgICAgIDwvdGg+LFxuICAgIF07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJvcHMuZmllbGRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5maWVsZHNbaV0uc2hvdyA9PT0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBjb2xJbmRleCA9IGkgKyAxO1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5maWVsZHNbaV0uZnJlZXplQ29sdW1uID09PSB0cnVlKSB7XG4gICAgICAgICAgaGVhZGVycy5wdXNoKFxuICAgICAgICAgICAgICA8dGgga2V5PXsndGhfY29sXycgKyBjb2xJbmRleH0gaWQ9e3RoaXMucHJvcHMuZnJlZXplQ29sdW1ufVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuc2V0U29ydENvbHVtbihpKS5iaW5kKHRoaXMpfT5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5maWVsZHNbaV0ubGFiZWx9XG4gICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBoZWFkZXJzLnB1c2goXG4gICAgICAgICAgICAgIDx0aCBrZXk9eyd0aF9jb2xfJyArIGNvbEluZGV4fSBvbkNsaWNrPXt0aGlzLnNldFNvcnRDb2x1bW4oaSkuYmluZCh0aGlzKX0+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuZmllbGRzW2ldLmxhYmVsfVxuICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3Qgcm93cyA9IFtdO1xuICAgIGxldCBjdXJSb3cgPSBbXTtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuZ2V0U29ydGVkUm93cygpO1xuICAgIGxldCBtYXRjaGVzRm91bmQgPSAwOyAvLyBLZWVwcyB0cmFjayBvZiBob3cgbWFueSByb3dzIHdoZXJlIGRpc3BsYXllZCBzbyBmYXIgYWNyb3NzIGFsbCBwYWdlc1xuICAgIGNvbnN0IGZpbHRlcmVkUm93cyA9IHRoaXMuY291bnRGaWx0ZXJlZFJvd3MoKTtcbiAgICBjb25zdCBjdXJyZW50UGFnZVJvdyA9IChyb3dzUGVyUGFnZSAqICh0aGlzLnN0YXRlLlBhZ2VOdW1iZXIgLSAxKSk7XG4gICAgY29uc3QgZmlsdGVyZWREYXRhID0gW107XG4gICAgbGV0IHVzZUtleXdvcmQgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLnByb3BzLmZpbHRlci5rZXl3b3JkKSB7XG4gICAgICB1c2VLZXl3b3JkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBQdXNoIHJvd3MgdG8gZGF0YSB0YWJsZVxuICAgIGZvciAobGV0IGkgPSAwO1xuICAgICAgKGkgPCB0aGlzLnByb3BzLmRhdGEubGVuZ3RoKSAmJiAocm93cy5sZW5ndGggPCByb3dzUGVyUGFnZSk7XG4gICAgICBpKytcbiAgICApIHtcbiAgICAgIGN1clJvdyA9IFtdO1xuXG4gICAgICAvLyBDb3VudHMgZmlsdGVyIG1hdGNoZXNcbiAgICAgIGxldCBmaWx0ZXJNYXRjaENvdW50ID0gMDtcbiAgICAgIGxldCBrZXl3b3JkTWF0Y2ggPSAwO1xuICAgICAgbGV0IGZpbHRlckxlbmd0aCA9IDA7XG5cbiAgICAgIC8vIEl0ZXJhdGVzIHRocm91Z2ggaGVhZGVycyB0byBwb3B1bGF0ZSByb3cgY29sdW1uc1xuICAgICAgLy8gd2l0aCBjb3JyZXNwb25kaW5nIGRhdGFcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5wcm9wcy5maWVsZHMubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgbGV0IGRhdGEgPSAnVW5rbm93bic7XG5cbiAgICAgICAgLy8gU2V0IGNvbHVtbiBkYXRhXG4gICAgICAgIGlmICh0aGlzLnByb3BzLmRhdGFbaW5kZXhbaV0uUm93SWR4XSkge1xuICAgICAgICAgIGRhdGEgPSB0aGlzLnByb3BzLmRhdGFbaW5kZXhbaV0uUm93SWR4XVtqXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnByb3BzLmZpZWxkc1tqXS5maWx0ZXIpIHtcbiAgICAgICAgICBpZiAodGhpcy5oYXNGaWx0ZXJLZXl3b3JkKHRoaXMucHJvcHMuZmllbGRzW2pdLmZpbHRlci5uYW1lLCBkYXRhKSkge1xuICAgICAgICAgICAgZmlsdGVyTWF0Y2hDb3VudCsrO1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhLnB1c2godGhpcy5wcm9wcy5kYXRhW2luZGV4W2ldLlJvd0lkeF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1c2VLZXl3b3JkID09PSB0cnVlKSB7XG4gICAgICAgICAgZmlsdGVyTGVuZ3RoID0gT2JqZWN0LmtleXModGhpcy5wcm9wcy5maWx0ZXIpLmxlbmd0aCAtIDE7XG4gICAgICAgICAgaWYgKHRoaXMuaGFzRmlsdGVyS2V5d29yZCgna2V5d29yZCcsIGRhdGEpKSB7XG4gICAgICAgICAgICBrZXl3b3JkTWF0Y2grKztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmlsdGVyTGVuZ3RoID0gT2JqZWN0LmtleXModGhpcy5wcm9wcy5maWx0ZXIpLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGtleSA9ICd0ZF9jb2xfJyArIGo7XG5cbiAgICAgICAgLy8gR2V0IGN1c3RvbSBjZWxsIGZvcm1hdHRpbmcgaWYgYXZhaWxhYmxlXG4gICAgICAgIGlmICh0aGlzLnByb3BzLmdldEZvcm1hdHRlZENlbGwpIHtcbiAgICAgICAgICBpZiAodGhpcy5wcm9wcy5maWVsZHNbal0uc2hvdyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGRhdGEgPSBudWxsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjcmVhdGUgbWFwcGluZyBiZXR3ZWVuIHJvd0hlYWRlcnMgYW5kIHJvd0RhdGEgaW4gYSByb3cgT2JqZWN0XG4gICAgICAgICAgICBjb25zdCByb3cgPSB7fTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuZmllbGRzLmZvckVhY2goKGZpZWxkLCBrKSA9PiB7XG4gICAgICAgICAgICAgIHJvd1tmaWVsZC5sYWJlbF0gPSB0aGlzLnByb3BzLmRhdGFbaW5kZXhbaV0uUm93SWR4XVtrXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZGF0YSA9IHRoaXMucHJvcHMuZ2V0Rm9ybWF0dGVkQ2VsbChcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmZpZWxkc1tqXS5sYWJlbCxcbiAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgIHJvd1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGRhdGEgIT09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIE5vdGU6IENhbid0IGN1cnJlbnRseSBwYXNzIGEga2V5LCBuZWVkIHRvIHVwZGF0ZSBjb2x1bW5Gb3JtYXR0ZXJcbiAgICAgICAgICAgIC8vIHRvIG5vdCByZXR1cm4gYSA8dGQ+IG5vZGUuIFVzaW5nIGNyZWF0ZUZyYWdtZW50IGluc3RlYWQuXG4gICAgICAgICAgICBjdXJSb3cucHVzaChjcmVhdGVGcmFnbWVudCh7ZGF0YX0pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3VyUm93LnB1c2goPHRkIGtleT17a2V5fT57ZGF0YX08L3RkPik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gT25seSBkaXNwbGF5IGEgcm93IGlmIGFsbCBmaWx0ZXIgdmFsdWVzIGhhdmUgYmVlbiBtYXRjaGVkXG4gICAgICBpZiAoKGZpbHRlckxlbmd0aCA9PT0gZmlsdGVyTWF0Y2hDb3VudCkgJiZcbiAgICAgICAgKCh1c2VLZXl3b3JkID09PSB0cnVlICYmIGtleXdvcmRNYXRjaCA+IDApIHx8XG4gICAgICAgICAgKHVzZUtleXdvcmQgPT09IGZhbHNlICYmIGtleXdvcmRNYXRjaCA9PT0gMCkpKSB7XG4gICAgICAgIG1hdGNoZXNGb3VuZCsrO1xuICAgICAgICBpZiAobWF0Y2hlc0ZvdW5kID4gY3VycmVudFBhZ2VSb3cpIHtcbiAgICAgICAgICBjb25zdCByb3dJbmRleCA9IGluZGV4W2ldLkNvbnRlbnQ7XG4gICAgICAgICAgcm93cy5wdXNoKFxuICAgICAgICAgICAgICA8dHIga2V5PXsndHJfJyArIHJvd0luZGV4fSBjb2xTcGFuPXtoZWFkZXJzLmxlbmd0aH0+XG4gICAgICAgICAgICAgICAgPHRkPntyb3dJbmRleH08L3RkPlxuICAgICAgICAgICAgICAgIHtjdXJSb3d9XG4gICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IFJvd3NQZXJQYWdlRHJvcGRvd24gPSAoXG4gICAgICA8c2VsZWN0XG4gICAgICAgIGNsYXNzTmFtZT1cImlucHV0LXNtIHBlclBhZ2VcIlxuICAgICAgICBvbkNoYW5nZT17dGhpcy5jaGFuZ2VSb3dzUGVyUGFnZX1cbiAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuUm93c1BlclBhZ2V9XG4gICAgICA+XG4gICAgICAgIDxvcHRpb24+MjA8L29wdGlvbj5cbiAgICAgICAgPG9wdGlvbj41MDwvb3B0aW9uPlxuICAgICAgICA8b3B0aW9uPjEwMDwvb3B0aW9uPlxuICAgICAgICA8b3B0aW9uPjEwMDA8L29wdGlvbj5cbiAgICAgICAgPG9wdGlvbj41MDAwPC9vcHRpb24+XG4gICAgICAgIDxvcHRpb24+MTAwMDA8L29wdGlvbj5cbiAgICAgIDwvc2VsZWN0PlxuICAgICk7XG5cbiAgICAvLyBJbmNsdWRlIG9ubHkgZmlsdGVyZWQgZGF0YSBpZiBmaWx0ZXJzIHdlcmUgYXBwbGllZFxuICAgIGxldCBjc3ZEYXRhID0gdGhpcy5wcm9wcy5kYXRhO1xuICAgIGlmICh0aGlzLnByb3BzLmZpbHRlciAmJiBmaWx0ZXJlZERhdGEubGVuZ3RoID4gMCkge1xuICAgICAgY3N2RGF0YSA9IGZpbHRlcmVkRGF0YTtcbiAgICB9XG5cbiAgICBjb25zdCBoZWFkZXIgPSB0aGlzLnN0YXRlLkhpZGUucm93c1BlclBhZ2UgPT09IHRydWUgPyAnJyA6IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGFibGUtaGVhZGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTJcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIHtyb3dzLmxlbmd0aH0gcm93cyBkaXNwbGF5ZWQgb2Yge2ZpbHRlcmVkUm93c30uXG4gICAgICAgICAgICAgIChNYXhpbXVtIHJvd3MgcGVyIHBhZ2U6IHtSb3dzUGVyUGFnZURyb3Bkb3dufSlcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0XCIgc3R5bGU9e3ttYXJnaW5Ub3A6ICctNDNweCd9fT5cbiAgICAgICAgICAgICAge3RoaXMucmVuZGVyQWN0aW9ucygpfVxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmRvd25sb2FkQ1NWLmJpbmQobnVsbCwgY3N2RGF0YSl9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgRG93bmxvYWQgVGFibGUgYXMgQ1NWXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8UGFnaW5hdGlvbkxpbmtzXG4gICAgICAgICAgICAgICAgVG90YWw9e2ZpbHRlcmVkUm93c31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZVBhZ2U9e3RoaXMuY2hhbmdlUGFnZX1cbiAgICAgICAgICAgICAgICBSb3dzUGVyUGFnZT17cm93c1BlclBhZ2V9XG4gICAgICAgICAgICAgICAgQWN0aXZlPXt0aGlzLnN0YXRlLlBhZ2VOdW1iZXJ9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuXG4gICAgY29uc3QgZm9vdGVyID0gdGhpcy5zdGF0ZS5IaWRlLmRvd25sb2FkQ1NWID09PSB0cnVlID8gJycgOiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCIgc3R5bGU9e3ttYXJnaW5Ub3A6ICcxMHB4J319PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb290ZXJUZXh0XCI+XG4gICAgICAgICAgICAgIHtyb3dzLmxlbmd0aH0gcm93cyBkaXNwbGF5ZWQgb2Yge2ZpbHRlcmVkUm93c30uXG4gICAgICAgICAgICAgIChNYXhpbXVtIHJvd3MgcGVyIHBhZ2U6IHtSb3dzUGVyUGFnZURyb3Bkb3dufSlcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0XCIgc3R5bGU9e3ttYXJnaW5Ub3A6ICctMjNweCd9fT5cbiAgICAgICAgICAgICAgPFBhZ2luYXRpb25MaW5rc1xuICAgICAgICAgICAgICAgIFRvdGFsPXtmaWx0ZXJlZFJvd3N9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2VQYWdlPXt0aGlzLmNoYW5nZVBhZ2V9XG4gICAgICAgICAgICAgICAgUm93c1BlclBhZ2U9e3Jvd3NQZXJQYWdlfVxuICAgICAgICAgICAgICAgIEFjdGl2ZT17dGhpcy5zdGF0ZS5QYWdlTnVtYmVyfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luOiAnMTRweCd9fT5cbiAgICAgICAge2hlYWRlcn1cbiAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInRhYmxlIHRhYmxlLWhvdmVyIHRhYmxlLXByaW1hcnkgdGFibGUtYm9yZGVyZWRcIiBpZD1cImR5bmFtaWN0YWJsZVwiPlxuICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgIDx0ciBjbGFzc05hbWU9XCJpbmZvXCI+e2hlYWRlcnN9PC90cj5cbiAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgIHtyb3dzfVxuICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgIDwvdGFibGU+XG4gICAgICAgIHtmb290ZXJ9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5EYXRhVGFibGUucHJvcFR5cGVzID0ge1xuICBkYXRhOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgUm93TnVtTGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIC8vIEZ1bmN0aW9uIG9mIHdoaWNoIHJldHVybnMgYSBKU1ggZWxlbWVudCBmb3IgYSB0YWJsZSBjZWxsLCB0YWtlc1xuICAvLyBwYXJhbWV0ZXJzIG9mIHRoZSBmb3JtOiBmdW5jKENvbHVtbk5hbWUsIENlbGxEYXRhLCBFbnRpcmVSb3dEYXRhKVxuICBnZXRGb3JtYXR0ZWRDZWxsOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Tb3J0OiBQcm9wVHlwZXMuZnVuYyxcbiAgSGlkZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgYWN0aW9uczogUHJvcFR5cGVzLm9iamVjdCxcbn07XG5EYXRhVGFibGUuZGVmYXVsdFByb3BzID0ge1xuICBSb3dOdW1MYWJlbDogJ05vLicsXG4gIGZpbHRlcjoge30sXG4gIEhpZGU6IHtcbiAgICByb3dzUGVyUGFnZTogZmFsc2UsXG4gICAgZG93bmxvYWRDU1Y6IGZhbHNlLFxuICAgIGRlZmF1bHRDb2x1bW46IGZhbHNlLFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgRGF0YVRhYmxlO1xuIiwiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG4vKipcbiAqIEZpbHRlciBjb21wb25lbnQuXG4gKiBBIHdyYXBwZXIgZm9yIGZvcm0gZWxlbWVudHMgaW5zaWRlIGEgc2VsZWN0aW9uIGZpbHRlci5cbiAqXG4gKiBDb25zdHJ1Y3RzIGZpbHRlciBmaWVsZHMgYmFzZWQgb24gdGhpcy5wcm9wcy5maWVsZHMgY29uZmlndXJhdGlvbiBvYmplY3RcbiAqXG4gKiBBbHRlcnMgdGhlIGZpbHRlciBvYmplY3QgYW5kIHNlbmRzIGl0IHRvIHBhcmVudCBvbiBldmVyeSB1cGRhdGUuXG4gKlxuICovXG5jbGFzcyBGaWx0ZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLm9uRmllbGRVcGRhdGUgPSB0aGlzLm9uRmllbGRVcGRhdGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlbmRlckZpbHRlckZpZWxkcyA9IHRoaXMucmVuZGVyRmlsdGVyRmllbGRzLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBmaWx0ZXIgb2JqZWN0IHRvIHJlZmxlY3QgdmFsdWVzIG9mIGlucHV0IGZpZWxkcy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBmb3JtIGVsZW1lbnQgdHlwZSAoaS5lIGNvbXBvbmVudCBuYW1lKVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB0aGUgbmFtZSBvZiB0aGUgZm9ybSBlbGVtZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIGlkIG9mIHRoZSBmb3JtIGVsZW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSB0eXBlIG9mIHRoZSBmb3JtIGVsZW1lbnRcbiAgICovXG4gIG9uRmllbGRVcGRhdGUobmFtZSwgdmFsdWUsIGlkLCB0eXBlKSB7XG4gICAgY29uc3QgZmlsdGVyID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLnByb3BzLmZpbHRlcikpO1xuICAgIGNvbnN0IGV4YWN0TWF0Y2ggPSB0eXBlID09PSAndGV4dGJveCcgPyBmYWxzZSA6IHRydWU7XG4gICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSAnJykge1xuICAgICAgZGVsZXRlIGZpbHRlcltuYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsdGVyW25hbWVdID0ge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGV4YWN0TWF0Y2g6IGV4YWN0TWF0Y2gsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHRoaXMucHJvcHMudXBkYXRlRmlsdGVyKGZpbHRlcik7XG4gIH1cblxuICByZW5kZXJGaWx0ZXJGaWVsZHMoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuZmllbGRzLnJlZHVjZSgocmVzdWx0LCBmaWVsZCkgPT4ge1xuICAgICAgY29uc3QgZmlsdGVyID0gZmllbGQuZmlsdGVyO1xuICAgICAgaWYgKGZpbHRlciAmJiBmaWx0ZXIuaGlkZSAhPT0gdHJ1ZSkge1xuICAgICAgICBsZXQgZWxlbWVudDtcbiAgICAgICAgc3dpdGNoIChmaWx0ZXIudHlwZSkge1xuICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICBlbGVtZW50ID0gPFRleHRib3hFbGVtZW50IGtleT17ZmlsdGVyLm5hbWV9Lz47XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICAgICAgZWxlbWVudCA9IDxTZWxlY3RFbGVtZW50IGtleT17ZmlsdGVyLm5hbWV9IG9wdGlvbnM9e2ZpbHRlci5vcHRpb25zfS8+O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdtdWx0aXNlbGVjdCc6XG4gICAgICAgICAgZWxlbWVudCA9IDxTZWxlY3RFbGVtZW50IGtleT17ZmlsdGVyLm5hbWV9IG9wdGlvbnM9e2ZpbHRlci5vcHRpb25zfSBtdWx0aXBsZT17dHJ1ZX0vPjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgICAgZWxlbWVudCA9IDxEYXRlRWxlbWVudCBrZXk9e2ZpbHRlci5uYW1lfS8+O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGVsZW1lbnQgPSA8VGV4dGJveEVsZW1lbnQga2V5PXtmaWx0ZXIubmFtZX0vPjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdC5wdXNoKFJlYWN0LmNsb25lRWxlbWVudChcbiAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IGZpbHRlci5uYW1lLFxuICAgICAgICAgICAgbGFiZWw6IGZpZWxkLmxhYmVsLFxuICAgICAgICAgICAgdmFsdWU6ICh0aGlzLnByb3BzLmZpbHRlcltmaWx0ZXIubmFtZV0gfHwge30pLnZhbHVlLFxuICAgICAgICAgICAgb25Vc2VySW5wdXQ6IHRoaXMub25GaWVsZFVwZGF0ZSxcbiAgICAgICAgICB9XG4gICAgICAgICkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sIFtdKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEZvcm1FbGVtZW50XG4gICAgICAgIGlkPXt0aGlzLnByb3BzLmlkfVxuICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICA+XG4gICAgICAgIDxGaWVsZHNldEVsZW1lbnRcbiAgICAgICAgICBjb2x1bW5zPXt0aGlzLnByb3BzLmNvbHVtbnN9XG4gICAgICAgICAgbGVnZW5kPXt0aGlzLnByb3BzLnRpdGxlfVxuICAgICAgICA+XG4gICAgICAgICAge3RoaXMucmVuZGVyRmlsdGVyRmllbGRzKCl9XG4gICAgICAgICAgPEJ1dHRvbkVsZW1lbnRcbiAgICAgICAgICAgIGxhYmVsPVwiQ2xlYXIgRmlsdGVyc1wiXG4gICAgICAgICAgICB0eXBlPVwicmVzZXRcIlxuICAgICAgICAgICAgb25Vc2VySW5wdXQ9e3RoaXMucHJvcHMuY2xlYXJGaWx0ZXJ9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9GaWVsZHNldEVsZW1lbnQ+XG4gICAgICA8L0Zvcm1FbGVtZW50PlxuICAgICk7XG4gIH1cbn1cblxuRmlsdGVyLmRlZmF1bHRQcm9wcyA9IHtcbiAgaWQ6IG51bGwsXG4gIGNsZWFyRmlsdGVyOiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uVXBkYXRlKCkgY2FsbGJhY2sgaXMgbm90IHNldCEnKTtcbiAgfSxcbiAgY29sdW1uczogMSxcbn07XG5GaWx0ZXIucHJvcFR5cGVzID0ge1xuICBmaWx0ZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgY2xlYXJGaWx0ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjb2x1bW5zOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgZmllbGRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBGaWx0ZXI7XG4iLCJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBQYW5lbCBmcm9tICcuL1BhbmVsJztcbmltcG9ydCBEYXRhVGFibGUgZnJvbSAnLi9EYXRhVGFibGUnO1xuaW1wb3J0IEZpbHRlciBmcm9tICcuL0ZpbHRlcic7XG5cbi8qKlxuICogRmlsdGVyYWJsZURhdGFUYWJsZSBjb21wb25lbnQuXG4gKiBBIHdyYXBwZXIgZm9yIGFsbCBkYXRhdGFibGVzIHRoYXQgaGFuZGxlcyBmaWx0ZXJpbmcuXG4gKlxuICogSGFuZGxlcyB0aGUgdXBkYXRpbmcgYW5kIGNsZWFyaW5nIG9mIHRoZSBmaWx0ZXIgc3RhdGUgYmFzZWQgb24gY2hhbmdlcyBzZW50XG4gKiBmcm9tIHRoZSBGaWx0ZXJGb3JtLlxuICpcbiAqIFBhc3NlcyB0aGUgRmlsdGVyIHRvIHRoZSBEYXRhdGFibGUuXG4gKlxuICogRGVwcmVjYXRlcyBGaWx0ZXIgRm9ybS5cbiAqL1xuY2xhc3MgRmlsdGVyYWJsZURhdGFUYWJsZSBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBmaWx0ZXI6IHt9LFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVGaWx0ZXIgPSB0aGlzLnVwZGF0ZUZpbHRlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2xlYXJGaWx0ZXIgPSB0aGlzLmNsZWFyRmlsdGVyLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBmaWx0ZXIgc3RhdGVcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGZpbHRlciBwYXNzZWQgZnJvbSBGaWx0ZXJGb3JtXG4gICAqL1xuICB1cGRhdGVGaWx0ZXIoZmlsdGVyKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7ZmlsdGVyfSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBGaWx0ZXIgdG8gZW1wdHkgb2JqZWN0XG4gICAqL1xuICBjbGVhckZpbHRlcigpIHtcbiAgICB0aGlzLnVwZGF0ZUZpbHRlcih7fSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxQYW5lbFxuICAgICAgICB0aXRsZT17dGhpcy5wcm9wcy50aXRsZX1cbiAgICAgID5cbiAgICAgICAgPEZpbHRlclxuICAgICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZSArICdfZmlsdGVyJ31cbiAgICAgICAgICBpZD17dGhpcy5wcm9wcy5uYW1lICsgJ19maWx0ZXInfVxuICAgICAgICAgIHRpdGxlPSdTZWxlY3Rpb24gRmlsdGVyJ1xuICAgICAgICAgIGNvbHVtbnM9e3RoaXMucHJvcHMuY29sdW1uc31cbiAgICAgICAgICBmaWx0ZXI9e3RoaXMuc3RhdGUuZmlsdGVyfVxuICAgICAgICAgIGZpZWxkcz17dGhpcy5wcm9wcy5maWVsZHN9XG4gICAgICAgICAgdXBkYXRlRmlsdGVyPXt0aGlzLnVwZGF0ZUZpbHRlcn1cbiAgICAgICAgICBjbGVhckZpbHRlcj17dGhpcy5jbGVhckZpbHRlcn1cbiAgICAgICAgLz5cbiAgICAgICAgPERhdGFUYWJsZVxuICAgICAgICAgIGRhdGE9e3RoaXMucHJvcHMuZGF0YX1cbiAgICAgICAgICBmaWVsZHM9e3RoaXMucHJvcHMuZmllbGRzfVxuICAgICAgICAgIGZpbHRlcj17dGhpcy5zdGF0ZS5maWx0ZXJ9XG4gICAgICAgICAgZ2V0Rm9ybWF0dGVkQ2VsbD17dGhpcy5wcm9wcy5nZXRGb3JtYXR0ZWRDZWxsfVxuICAgICAgICAgIGFjdGlvbnM9e3RoaXMucHJvcHMuYWN0aW9uc31cbiAgICAgICAgLz5cbiAgICAgIDwvUGFuZWw+XG4gICAgKTtcbiAgfVxufVxuXG5GaWx0ZXJhYmxlRGF0YVRhYmxlLmRlZmF1bHRQcm9wcyA9IHtcbiAgY29sdW1uczogMyxcbn07XG5cbkZpbHRlcmFibGVEYXRhVGFibGUucHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBkYXRhOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGZpbHRlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBmaWVsZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgY29sdW1uczogUHJvcFR5cGVzLm51bWJlcixcbiAgZ2V0Rm9ybWF0dGVkQ2VsbDogUHJvcFR5cGVzLmZ1bmMsXG4gIGFjdGlvbnM6IFByb3BUeXBlcy5vYmplY3QsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBGaWx0ZXJhYmxlRGF0YVRhYmxlO1xuIiwiLyogZXhwb3J0ZWQgRm9ybUVsZW1lbnQsIEZpZWxkc2V0RWxlbWVudCwgU2VsZWN0RWxlbWVudCwgVGFnc0VsZW1lbnQsIFNlYXJjaGFibGVEcm9wZG93biwgVGV4dGFyZWFFbGVtZW50LFxuVGV4dGJveEVsZW1lbnQsIERhdGVFbGVtZW50LCBOdW1lcmljRWxlbWVudCwgRmlsZUVsZW1lbnQsIFN0YXRpY0VsZW1lbnQsIExpbmtFbGVtZW50LFxuQ2hlY2tib3hFbGVtZW50LCBCdXR0b25FbGVtZW50LCBMb3Jpc0VsZW1lbnRcbiovXG5cbi8qKlxuICogVGhpcyBmaWxlIGNvbnRhaW5zIFJlYWN0IGNvbXBvbmVudHMgZm9yIExvcmlzIGZvcm0gZWxlbWVudHMuXG4gKlxuICogQGF1dGhvciBMb3JpcyBUZWFtXG4gKiBAdmVyc2lvbiAxLjAuMFxuICpcbiAqL1xuXG4vKipcbiAqIEZvcm0gQ29tcG9uZW50LlxuICogUmVhY3Qgd3JhcHBlciBmb3IgPGZvcm0+IGVsZW1lbnQgdGhhdCBhY2NlcHRzIGNoaWxkcmVuIHJlYWN0IGNvbXBvbmVudHNcbiAqXG4gKiBUaGUgZm9ybSBlbGVtZW50cyBjYW4gYmUgcGFzc2VkIGluIHR3byB3YXlzOlxuICogMS4gQSBgdGhpcy5wcm9wcy5mb3JtRWxlbWVudHNgIEpTT04gb2JqZWN0XG4gKiAyLiBGb3JtIGNvbXBvbmVudHMgbmVzdGVkIGRpcmVjdGx5IGluc2lkZSA8Rm9ybUVsZW1lbnQ+PC9Gb3JtRWxlbWVudD5cbiAqXG4gKiBOb3RlIHRoYXQgaWYgYm90aCBhcmUgcGFzc2VkIGB0aGlzLnByb3BzLmZvcm1FbGVtZW50c2AgaXMgZGlzcGxheWVkIGZpcnN0LlxuICpcbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbi8qKlxuICogRm9ybUVsZW1lbnQgQ29tcG9uZW50LlxuICogVXNlZCBmb3IgY29uc3RydWN0aW5nIGZvcm0gZWxlbWVudC5cbiAqL1xuY2xhc3MgRm9ybUVsZW1lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmdldEZvcm1FbGVtZW50cyA9IHRoaXMuZ2V0Rm9ybUVsZW1lbnRzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgZ2V0Rm9ybUVsZW1lbnRzKCkge1xuICAgIGNvbnN0IGZvcm1FbGVtZW50c0hUTUwgPSBbXTtcbiAgICBjb25zdCBjb2x1bW5zID0gdGhpcy5wcm9wcy5jb2x1bW5zO1xuICAgIGNvbnN0IG1heENvbHVtblNpemUgPSAxMjtcbiAgICBjb25zdCBjb2xTaXplID0gTWF0aC5mbG9vcihtYXhDb2x1bW5TaXplIC8gY29sdW1ucyk7XG4gICAgY29uc3QgY29sQ2xhc3MgPSAnY29sLXhzLTEyIGNvbC1zbS0nICsgY29sU2l6ZSArICcgY29sLW1kLScgKyBjb2xTaXplO1xuXG4gICAgLy8gUmVuZGVyIGVsZW1lbnRzIGZyb20gSlNPTlxuICAgIGNvbnN0IGZpbHRlciA9IHRoaXMucHJvcHMuZm9ybUVsZW1lbnRzO1xuXG4gICAgT2JqZWN0LmtleXMoZmlsdGVyKS5mb3JFYWNoKGZ1bmN0aW9uKG9iaktleSwgaW5kZXgpIHtcbiAgICAgIGNvbnN0IHVzZXJJbnB1dCA9IHRoaXMucHJvcHMub25Vc2VySW5wdXQgPyB0aGlzLnByb3BzLm9uVXNlcklucHV0IDogZmlsdGVyW29iaktleV0ub25Vc2VySW5wdXQ7XG4gICAgICBjb25zdCB2YWx1ZSA9IGZpbHRlcltvYmpLZXldLnZhbHVlID8gZmlsdGVyW29iaktleV0udmFsdWUgOiAnJztcbiAgICAgIGZvcm1FbGVtZW50c0hUTUwucHVzaChcbiAgICAgICAgICA8ZGl2IGtleT17J2VsXycgKyBpbmRleH0gY2xhc3NOYW1lPXtjb2xDbGFzc30+XG4gICAgICAgICAgICA8TG9yaXNFbGVtZW50XG4gICAgICAgICAgICAgIGVsZW1lbnQ9e2ZpbHRlcltvYmpLZXldfVxuICAgICAgICAgICAgICBvblVzZXJJbnB1dD17dXNlcklucHV0fVxuICAgICAgICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgLy8gUmVuZGVyIGVsZW1lbnRzIGZyb20gUmVhY3RcbiAgICBSZWFjdC5DaGlsZHJlbi5mb3JFYWNoKHRoaXMucHJvcHMuY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkLCBrZXkpIHtcbiAgICAgIC8vIElmIGNoaWxkIGlzIHBsYWluIEhUTUwsIGluc2VydCBpdCBhcyBmdWxsIHNpemUuXG4gICAgICAvLyBVc2VmdWwgZm9yIGluc2VydGluZyA8aHI+IHRvIHNwbGl0IGZvcm0gc2VjdGlvbnNcbiAgICAgIGxldCBlbGVtZW50Q2xhc3MgPSAnY29sLXhzLTEyIGNvbC1zbS0xMiBjb2wtbWQtMTInO1xuXG4gICAgICAvLyBJZiBjaGlsZCBpcyBmb3JtIGVsZW1lbnQgdXNlIGFwcHJvcHJpYXRlIHNpemVcbiAgICAgIGlmIChSZWFjdC5pc1ZhbGlkRWxlbWVudChjaGlsZCkgJiYgdHlwZW9mIGNoaWxkLnR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZWxlbWVudENsYXNzID0gY29sQ2xhc3M7XG4gICAgICB9XG4gICAgICBmb3JtRWxlbWVudHNIVE1MLnB1c2goXG4gICAgICAgICAgPGRpdiBrZXk9eydlbF9jaGlsZF8nICsga2V5fSBjbGFzc05hbWU9e2VsZW1lbnRDbGFzc30+e2NoaWxkfTwvZGl2PlxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBmb3JtRWxlbWVudHNIVE1MO1xuICB9XG5cbiAgaGFuZGxlU3VibWl0KGUpIHtcbiAgICAvLyBPdmVycmlkZSBkZWZhdWx0IHN1Ym1pdCBpZiBwcm9wZXJ0eSBpcyBzZXRcbiAgICBpZiAodGhpcy5wcm9wcy5vblN1Ym1pdCkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5wcm9wcy5vblN1Ym1pdChlKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZW5jVHlwZSA9IHRoaXMucHJvcHMuZmlsZVVwbG9hZCA/ICdtdWx0aXBhcnQvZm9ybS1kYXRhJyA6IG51bGw7XG5cbiAgICAvLyBHZW5lcmF0ZSBmb3JtIGVsZW1lbnRzXG4gICAgY29uc3QgZm9ybUVsZW1lbnRzID0gdGhpcy5nZXRGb3JtRWxlbWVudHMoKTtcblxuICAgIC8vIEZsZXhib3ggaXMgc2V0IHRvIGVuc3VyZSB0aGF0IGNvbHVtbnMgb2YgZGlmZmVyZW50IGhlaWdodHNcbiAgICAvLyBhcmUgZGlzcGxheWVkIHByb3BvcnRpb25hbGx5IG9uIHRoZSBzY3JlZW5cbiAgICBjb25zdCByb3dTdHlsZXMgPSB7XG4gICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICBmbGV4V3JhcDogJ3dyYXAnLFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGZvcm1cbiAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICBpZD17dGhpcy5wcm9wcy5pZH1cbiAgICAgICAgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmNsYXNzfVxuICAgICAgICBtZXRob2Q9e3RoaXMucHJvcHMubWV0aG9kfVxuICAgICAgICBhY3Rpb249e3RoaXMucHJvcHMuYWN0aW9ufVxuICAgICAgICBlbmNUeXBlPXtlbmNUeXBlfVxuICAgICAgICBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9XG4gICAgICA+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgc3R5bGU9e3Jvd1N0eWxlc30+XG4gICAgICAgICAge2Zvcm1FbGVtZW50c31cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Zvcm0+XG4gICAgKTtcbiAgfVxufVxuXG5Gb3JtRWxlbWVudC5wcm9wVHlwZXMgPSB7XG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG1ldGhvZDogUHJvcFR5cGVzLm9uZU9mKFsnUE9TVCcsICdHRVQnXSksXG4gIGFjdGlvbjogUHJvcFR5cGVzLnN0cmluZyxcbiAgY2xhc3M6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNvbHVtbnM6IFByb3BUeXBlcy5udW1iZXIsXG4gIGZvcm1FbGVtZW50czogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICBlbGVtZW50TmFtZTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICB0eXBlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIH0pLFxuICB9KSxcbiAgb25TdWJtaXQ6IFByb3BUeXBlcy5mdW5jLFxuICBvblVzZXJJbnB1dDogUHJvcFR5cGVzLmZ1bmMsXG59O1xuXG5Gb3JtRWxlbWVudC5kZWZhdWx0UHJvcHMgPSB7XG4gIG5hbWU6IG51bGwsXG4gIGlkOiBudWxsLFxuICBtZXRob2Q6ICdQT1NUJyxcbiAgYWN0aW9uOiB1bmRlZmluZWQsXG4gIGNsYXNzOiAnZm9ybS1ob3Jpem9udGFsJyxcbiAgY29sdW1uczogMSxcbiAgZmlsZVVwbG9hZDogZmFsc2UsXG4gIGZvcm1FbGVtZW50czoge30sXG4gIG9uU3VibWl0OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uU3VibWl0KCkgY2FsbGJhY2sgaXMgbm90IHNldCEnKTtcbiAgfSxcbn07XG5cbi8qKlxuICogRmllbGRzZXRFbGVtZW50IENvbXBvbmVudC5cbiAqIFJlYWN0IHdyYXBwZXIgZm9yIDxmaWVsZHNldD4gZWxlbWVudCB0aGF0IGlzIG5lc3RlZCBpbnNpZGUgPEZvcm1FbGVtZW50PjwvRm9ybUVsZW1lbnQ+LFxuICogYW5kIGFjY2VwdHMgY2hpbGQgcmVhY3QgY29tcG9uZW50cy4gQSBmaWVsZHNldCBncm91cHMgcmVsYXRlZCBlbGVtZW50cyBpbiBhIGZvcm0uXG4gKlxuICogVGhlIGZvcm0gZWxlbWVudHMgY2FuIGJlIHBhc3NlZCBieSBuZXN0aW5nIEZvcm0gY29tcG9uZW50cyBkaXJlY3RseSBpbnNpZGUgPEZpZWxkc2V0RWxlbWVudD48L0ZpZWxkc2V0RWxlbWVudD4uXG4gKlxuICovXG5jbGFzcyBGaWVsZHNldEVsZW1lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmdldEZvcm1FbGVtZW50cyA9IHRoaXMuZ2V0Rm9ybUVsZW1lbnRzLmJpbmQodGhpcyk7XG4gIH1cblxuICBnZXRGb3JtRWxlbWVudHMoKSB7XG4gICAgY29uc3QgZm9ybUVsZW1lbnRzSFRNTCA9IFtdO1xuICAgIGNvbnN0IGNvbHVtbnMgPSB0aGlzLnByb3BzLmNvbHVtbnM7XG4gICAgY29uc3QgbWF4Q29sdW1uU2l6ZSA9IDEyO1xuICAgIGNvbnN0IGNvbFNpemUgPSBNYXRoLmZsb29yKG1heENvbHVtblNpemUgLyBjb2x1bW5zKTtcbiAgICBjb25zdCBjb2xDbGFzcyA9ICdjb2wteHMtMTIgY29sLXNtLScgKyBjb2xTaXplICsgJyBjb2wtbWQtJyArIGNvbFNpemU7XG5cbiAgICAvLyBSZW5kZXIgZWxlbWVudHMgZnJvbSBSZWFjdFxuICAgIFJlYWN0LkNoaWxkcmVuLmZvckVhY2godGhpcy5wcm9wcy5jaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQsIGtleSkge1xuICAgICAgLy8gSWYgY2hpbGQgaXMgcGxhaW4gSFRNTCwgaW5zZXJ0IGl0IGFzIGZ1bGwgc2l6ZS5cbiAgICAgIC8vIFVzZWZ1bCBmb3IgaW5zZXJ0aW5nIDxocj4gdG8gc3BsaXQgZm9ybSBzZWN0aW9uc1xuICAgICAgbGV0IGVsZW1lbnRDbGFzcyA9ICdjb2wteHMtMTIgY29sLXNtLTEyIGNvbC1tZC0xMic7XG5cbiAgICAgIC8vIElmIGNoaWxkIGlzIGZvcm0gZWxlbWVudCB1c2UgYXBwcm9wcmlhdGUgc2l6ZVxuICAgICAgaWYgKFJlYWN0LmlzVmFsaWRFbGVtZW50KGNoaWxkKSAmJiB0eXBlb2YgY2hpbGQudHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBlbGVtZW50Q2xhc3MgPSBjb2xDbGFzcztcbiAgICAgIH1cbiAgICAgIGZvcm1FbGVtZW50c0hUTUwucHVzaChcbiAgICAgICAgICA8ZGl2IGtleT17J2VsX2NoaWxkXycgKyBrZXl9IGNsYXNzTmFtZT17ZWxlbWVudENsYXNzfT57Y2hpbGR9PC9kaXY+XG4gICAgICApO1xuICAgIH0pO1xuICAgIHJldHVybiBmb3JtRWxlbWVudHNIVE1MO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIC8vIEdlbmVyYXRlIGZvcm0gZWxlbWVudHNcbiAgICBjb25zdCBmb3JtRWxlbWVudHMgPSB0aGlzLmdldEZvcm1FbGVtZW50cygpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxmaWVsZHNldFxuICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICA+XG4gICAgICAgIDxsZWdlbmQ+XG4gICAgICAgICAge3RoaXMucHJvcHMubGVnZW5kfVxuICAgICAgICA8L2xlZ2VuZD5cbiAgICAgICAge2Zvcm1FbGVtZW50c31cbiAgICAgIDwvZmllbGRzZXQ+XG4gICAgKTtcbiAgfVxufVxuXG5GaWVsZHNldEVsZW1lbnQucHJvcFR5cGVzID0ge1xuICBjb2x1bW5zOiBQcm9wVHlwZXMubnVtYmVyLFxuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBsZWdlbmQ6IFByb3BUeXBlcy5zdHJpbmcsXG59O1xuXG5GaWVsZHNldEVsZW1lbnQuZGVmYXVsdFByb3BzID0ge1xuICBjb2x1bW5zOiAxLFxuICBsZWdlbmQ6ICdTZWxlY3Rpb24gRmlsdGVyJyxcbn07XG5cbi8qKlxuICogU2VhcmNoIENvbXBvbmVudFxuICogUmVhY3Qgd3JhcHBlciBmb3IgYSBzZWFyY2hhYmxlIGRyb3Bkb3duXG4gKi9cbmNsYXNzIFNlYXJjaGFibGVEcm9wZG93biBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuZ2V0S2V5RnJvbVZhbHVlID0gdGhpcy5nZXRLZXlGcm9tVmFsdWUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVCbHVyID0gdGhpcy5oYW5kbGVCbHVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRUZXh0SW5wdXRWYWx1ZSA9IHRoaXMuZ2V0VGV4dElucHV0VmFsdWUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGdldEtleUZyb21WYWx1ZSh2YWx1ZSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLnByb3BzLm9wdGlvbnM7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9wdGlvbnMpLmZpbmQoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG9wdGlvbnNbb10gPT09IHZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGUpIHtcbiAgICBsZXQgdmFsdWUgPSB0aGlzLmdldEtleUZyb21WYWx1ZShlLnRhcmdldC52YWx1ZSk7XG4gICAgLy8gaWYgbm90IGluIHN0cmljdCBtb2RlIGFuZCBrZXkgdmFsdWUgaXMgbm90IGRlZmluZWQgKGkuZS4sIG5vdCBpbiBvcHRpb25zKVxuICAgIC8vIHNldCB2YWx1ZSBlcXVhbCB0byBlLnRhcmdldC52YWx1ZVxuICAgIGlmICghdGhpcy5wcm9wcy5zdHJpY3RTZWFyY2ggJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsdWUgPSBlLnRhcmdldC52YWx1ZTtcbiAgICB9XG4gICAgdGhpcy5wcm9wcy5vblVzZXJJbnB1dCh0aGlzLnByb3BzLm5hbWUsIHZhbHVlKTtcbiAgfVxuXG4gIGhhbmRsZUJsdXIoZSkge1xuICAgIC8vIG51bGwgb3V0IGVudHJ5IGlmIG5vdCBwcmVzZW50IGluIG9wdGlvbnMgaW4gc3RyaWN0IG1vZGVcbiAgICBpZiAodGhpcy5wcm9wcy5zdHJpY3RTZWFyY2gpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gZS50YXJnZXQudmFsdWU7XG4gICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5wcm9wcy5vcHRpb25zO1xuICAgICAgaWYgKE9iamVjdC52YWx1ZXMob3B0aW9ucykuaW5kZXhPZih2YWx1ZSkgPT09IC0xKSB7XG4gICAgICAgIC8vIGVtcHR5IHN0cmluZyBvdXQgYm90aCB0aGUgaGlkZGVuIHZhbHVlIGFzIHdlbGwgYXMgdGhlIGlucHV0IHRleHRcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgaW5wdXRbbmFtZT1cIiR7dGhpcy5wcm9wcy5uYW1lICsgJ19pbnB1dCd9XCJdYCkudmFsdWUgPSAnJztcbiAgICAgICAgdGhpcy5wcm9wcy5vblVzZXJJbnB1dCh0aGlzLnByb3BzLm5hbWUsICcnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRUZXh0SW5wdXRWYWx1ZSgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgaW5wdXRbbmFtZT1cIiR7dGhpcy5wcm9wcy5uYW1lICsgJ19pbnB1dCd9XCJdYCkudmFsdWU7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgcmVxdWlyZWQgPSB0aGlzLnByb3BzLnJlcXVpcmVkID8gJ3JlcXVpcmVkJyA6IG51bGw7XG4gICAgY29uc3QgZGlzYWJsZWQgPSB0aGlzLnByb3BzLmRpc2FibGVkID8gJ2Rpc2FibGVkJyA6IG51bGw7XG4gICAgY29uc3Qgc29ydEJ5VmFsdWUgPSB0aGlzLnByb3BzLnNvcnRCeVZhbHVlO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLnByb3BzLm9wdGlvbnM7XG4gICAgY29uc3Qgc3RyaWN0TWVzc2FnZSA9ICdFbnRyeSBtdXN0IGJlIGluY2x1ZGVkIGluIHByb3ZpZGVkIGxpc3Qgb2Ygb3B0aW9ucy4nO1xuICAgIGxldCBlcnJvck1lc3NhZ2UgPSBudWxsO1xuICAgIGxldCByZXF1aXJlZEhUTUwgPSBudWxsO1xuICAgIGxldCBlbGVtZW50Q2xhc3MgPSAncm93IGZvcm0tZ3JvdXAnO1xuXG4gICAgLy8gQWRkIHJlcXVpcmVkIGFzdGVyaXhcbiAgICBpZiAocmVxdWlyZWQpIHtcbiAgICAgIHJlcXVpcmVkSFRNTCA9IDxzcGFuIGNsYXNzTmFtZT1cInRleHQtZGFuZ2VyXCI+Kjwvc3Bhbj47XG4gICAgfVxuXG4gICAgLy8gQWRkIGVycm9yIG1lc3NhZ2VcbiAgICBpZiAodGhpcy5wcm9wcy5lcnJvck1lc3NhZ2UpIHtcbiAgICAgIGVycm9yTWVzc2FnZSA9IDxzcGFuPnt0aGlzLnByb3BzLmVycm9yTWVzc2FnZX08L3NwYW4+O1xuICAgICAgZWxlbWVudENsYXNzID0gJ3JvdyBmb3JtLWdyb3VwIGhhcy1lcnJvcic7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnJlcXVpcmVkICYmIHRoaXMucHJvcHMudmFsdWUgPT09ICcnKSB7XG4gICAgICBsZXQgbXNnID0gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQhJztcbiAgICAgIG1zZyArPSAodGhpcy5wcm9wcy5zdHJpY3RTZWFyY2ggPyAnICcgKyBzdHJpY3RNZXNzYWdlIDogJycpO1xuICAgICAgZXJyb3JNZXNzYWdlID0gPHNwYW4+e21zZ308L3NwYW4+O1xuICAgICAgZWxlbWVudENsYXNzID0gJ3JvdyBmb3JtLWdyb3VwIGhhcy1lcnJvcic7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnN0cmljdFNlYXJjaCAmJiB0aGlzLnByb3BzLnZhbHVlID09PSAnJykge1xuICAgICAgZXJyb3JNZXNzYWdlID0gPHNwYW4+e3N0cmljdE1lc3NhZ2V9PC9zcGFuPjtcbiAgICAgIGVsZW1lbnRDbGFzcyA9ICdyb3cgZm9ybS1ncm91cCBoYXMtZXJyb3InO1xuICAgIH1cblxuICAgIC8vIGRldGVybWluZSB2YWx1ZSB0byBwbGFjZSBpbnRvIHRleHQgaW5wdXRcbiAgICBsZXQgdmFsdWU7XG4gICAgLy8gdXNlIHZhbHVlIGluIG9wdGlvbnMgaWYgdmFsaWRcbiAgICBpZiAodGhpcy5wcm9wcy52YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoT2JqZWN0LmtleXMob3B0aW9ucykuaW5kZXhPZih0aGlzLnByb3BzLnZhbHVlKSA+IC0xKSB7XG4gICAgICAgIHZhbHVlID0gb3B0aW9uc1t0aGlzLnByb3BzLnZhbHVlXTtcbiAgICAgICAgLy8gZWxzZSwgdXNlIGlucHV0IHRleHQgdmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gdGhpcy5nZXRUZXh0SW5wdXRWYWx1ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG5ld09wdGlvbnMgPSB7fTtcbiAgICBsZXQgb3B0aW9uTGlzdCA9IFtdO1xuICAgIGlmIChzb3J0QnlWYWx1ZSkge1xuICAgICAgZm9yIChjb25zdCBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgbmV3T3B0aW9uc1tvcHRpb25zW2tleV1dID0ga2V5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBvcHRpb25MaXN0ID0gT2JqZWN0LmtleXMobmV3T3B0aW9ucykuc29ydCgpLm1hcChmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtvcHRpb259IGtleT17bmV3T3B0aW9uc1tvcHRpb25dfS8+XG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9uTGlzdCA9IE9iamVjdC5rZXlzKG9wdGlvbnMpLm1hcChmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtvcHRpb25zW29wdGlvbl19IGtleT17b3B0aW9ufS8+XG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2VsZW1lbnRDbGFzc30+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wtc20tMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj17dGhpcy5wcm9wcy5sYWJlbH0+XG4gICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgICAge3JlcXVpcmVkSFRNTH1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOVwiPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lICsgJ19pbnB1dCd9XG4gICAgICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgICBpZD17dGhpcy5wcm9wcy5pZH1cbiAgICAgICAgICAgIGxpc3Q9e3RoaXMucHJvcHMubmFtZSArICdfbGlzdCd9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3RoaXMucHJvcHMucGxhY2VIb2xkZXJ9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICBvbkJsdXI9e3RoaXMuaGFuZGxlQmx1cn1cbiAgICAgICAgICAgIHJlcXVpcmVkPXtyZXF1aXJlZH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxkYXRhbGlzdCBpZD17dGhpcy5wcm9wcy5uYW1lICsgJ19saXN0J30+XG4gICAgICAgICAgICB7b3B0aW9uTGlzdH1cbiAgICAgICAgICA8L2RhdGFsaXN0PlxuICAgICAgICAgIHtlcnJvck1lc3NhZ2V9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5TZWFyY2hhYmxlRHJvcGRvd24ucHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIG9wdGlvbnM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIC8vIHN0cmljdFNlYXJjaCwgaWYgc2V0IHRvIHRydWUsIHdpbGwgcmVxdWlyZSB0aGF0IG9ubHkgb3B0aW9uc1xuICAvLyBwcm92aWRlZCBpbiB0aGUgb3B0aW9ucyBwcm9wIGNhbiBiZSBzdWJtaXR0ZWRcbiAgc3RyaWN0U2VhcmNoOiBQcm9wVHlwZXMuYm9vbCxcbiAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHZhbHVlOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIFByb3BUeXBlcy5hcnJheSxcbiAgXSksXG4gIGNsYXNzOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIHJlcXVpcmVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgZXJyb3JNZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBwbGFjZUhvbGRlcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgb25Vc2VySW5wdXQ6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuU2VhcmNoYWJsZURyb3Bkb3duLmRlZmF1bHRQcm9wcyA9IHtcbiAgbmFtZTogJycsXG4gIG9wdGlvbnM6IHt9LFxuICBzdHJpY3RTZWFyY2g6IHRydWUsXG4gIGxhYmVsOiAnJyxcbiAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgaWQ6IG51bGwsXG4gIGNsYXNzOiAnJyxcbiAgZGlzYWJsZWQ6IGZhbHNlLFxuICByZXF1aXJlZDogZmFsc2UsXG4gIHNvcnRCeVZhbHVlOiB0cnVlLFxuICBlcnJvck1lc3NhZ2U6ICcnLFxuICBwbGFjZUhvbGRlcjogJycsXG4gIG9uVXNlcklucHV0OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uVXNlcklucHV0KCkgY2FsbGJhY2sgaXMgbm90IHNldCcpO1xuICB9LFxufTtcblxuLyoqXG4gKiBTZWxlY3QgQ29tcG9uZW50XG4gKiBSZWFjdCB3cmFwcGVyIGZvciBhIHNpbXBsZSBvciAnbXVsdGlwbGUnIDxzZWxlY3Q+IGVsZW1lbnQuXG4gKi9cbmNsYXNzIFNlbGVjdEVsZW1lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZSkge1xuICAgIGxldCB2YWx1ZSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnN0IG9wdGlvbnMgPSBlLnRhcmdldC5vcHRpb25zO1xuICAgIGNvbnN0IG51bU9mT3B0aW9ucyA9IG9wdGlvbnMubGVuZ3RoO1xuXG4gICAgLy8gTXVsdGlwbGUgdmFsdWVzXG4gICAgaWYgKHRoaXMucHJvcHMubXVsdGlwbGUgJiYgbnVtT2ZPcHRpb25zID4gMSkge1xuICAgICAgdmFsdWUgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gbnVtT2ZPcHRpb25zOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChvcHRpb25zW2ldLnNlbGVjdGVkKSB7XG4gICAgICAgICAgdmFsdWUucHVzaChvcHRpb25zW2ldLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucHJvcHMub25Vc2VySW5wdXQodGhpcy5wcm9wcy5uYW1lLCB2YWx1ZSwgZS50YXJnZXQuaWQsICdzZWxlY3QnKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBtdWx0aXBsZSA9IHRoaXMucHJvcHMubXVsdGlwbGUgPyAnbXVsdGlwbGUnIDogbnVsbDtcbiAgICBjb25zdCByZXF1aXJlZCA9IHRoaXMucHJvcHMucmVxdWlyZWQgPyAncmVxdWlyZWQnIDogbnVsbDtcbiAgICBjb25zdCBkaXNhYmxlZCA9IHRoaXMucHJvcHMuZGlzYWJsZWQgPyAnZGlzYWJsZWQnIDogbnVsbDtcbiAgICBjb25zdCBzb3J0QnlWYWx1ZSA9IHRoaXMucHJvcHMuc29ydEJ5VmFsdWU7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMucHJvcHMub3B0aW9ucztcbiAgICBsZXQgZXJyb3JNZXNzYWdlID0gbnVsbDtcbiAgICBsZXQgZW1wdHlPcHRpb25IVE1MID0gbnVsbDtcbiAgICBsZXQgcmVxdWlyZWRIVE1MID0gbnVsbDtcbiAgICBsZXQgZWxlbWVudENsYXNzID0gJ3JvdyBmb3JtLWdyb3VwJztcblxuICAgIC8vIEFkZCByZXF1aXJlZCBhc3Rlcmlza1xuICAgIGlmIChyZXF1aXJlZCkge1xuICAgICAgcmVxdWlyZWRIVE1MID0gPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1kYW5nZXJcIj4qPC9zcGFuPjtcbiAgICB9XG5cbiAgICAvLyBBZGQgZW1wdHkgb3B0aW9uXG4gICAgaWYgKHRoaXMucHJvcHMuZW1wdHlPcHRpb24pIHtcbiAgICAgIGVtcHR5T3B0aW9uSFRNTCA9IDxvcHRpb24+PC9vcHRpb24+O1xuICAgIH1cblxuICAgIC8vIEFkZCBlcnJvciBtZXNzYWdlXG4gICAgaWYgKHRoaXMucHJvcHMuaGFzRXJyb3IgfHwgKHRoaXMucHJvcHMucmVxdWlyZWQgJiYgdGhpcy5wcm9wcy52YWx1ZSA9PT0gJycpKSB7XG4gICAgICBlcnJvck1lc3NhZ2UgPSA8c3Bhbj57dGhpcy5wcm9wcy5lcnJvck1lc3NhZ2V9PC9zcGFuPjtcbiAgICAgIGVsZW1lbnRDbGFzcyA9ICdyb3cgZm9ybS1ncm91cCBoYXMtZXJyb3InO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld09wdGlvbnMgPSB7fTtcbiAgICBsZXQgb3B0aW9uTGlzdCA9IFtdO1xuICAgIGlmIChzb3J0QnlWYWx1ZSkge1xuICAgICAgZm9yIChjb25zdCBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgbmV3T3B0aW9uc1tvcHRpb25zW2tleV1dID0ga2V5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBvcHRpb25MaXN0ID0gT2JqZWN0LmtleXMobmV3T3B0aW9ucykuc29ydCgpLm1hcChmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtuZXdPcHRpb25zW29wdGlvbl19IGtleT17bmV3T3B0aW9uc1tvcHRpb25dfT57b3B0aW9ufTwvb3B0aW9uPlxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbkxpc3QgPSBPYmplY3Qua2V5cyhvcHRpb25zKS5tYXAoZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT17b3B0aW9ufSBrZXk9e29wdGlvbn0+e29wdGlvbnNbb3B0aW9uXX08L29wdGlvbj5cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIERlZmF1bHQgdG8gZW1wdHkgc3RyaW5nIGZvciByZWd1bGFyIHNlbGVjdCBhbmQgdG8gZW1wdHkgYXJyYXkgZm9yICdtdWx0aXBsZScgc2VsZWN0XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnByb3BzLnZhbHVlIHx8IChtdWx0aXBsZSA/IFtdIDogJycpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtlbGVtZW50Q2xhc3N9PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9e3RoaXMucHJvcHMubGFiZWx9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgICAgIHtyZXF1aXJlZEhUTUx9XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTlcIj5cbiAgICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgICAgICBtdWx0aXBsZT17bXVsdGlwbGV9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgaWQ9e3RoaXMucHJvcHMuaWR9XG4gICAgICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICByZXF1aXJlZD17cmVxdWlyZWR9XG4gICAgICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2VtcHR5T3B0aW9uSFRNTH1cbiAgICAgICAgICAgIHtvcHRpb25MaXN0fVxuICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgIHtlcnJvck1lc3NhZ2V9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5TZWxlY3RFbGVtZW50LnByb3BUeXBlcyA9IHtcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBvcHRpb25zOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB2YWx1ZTogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICBQcm9wVHlwZXMuYXJyYXksXG4gIF0pLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgY2xhc3M6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG11bHRpcGxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICByZXF1aXJlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGVtcHR5T3B0aW9uOiBQcm9wVHlwZXMuYm9vbCxcbiAgaGFzRXJyb3I6IFByb3BUeXBlcy5ib29sLFxuICBlcnJvck1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG9uVXNlcklucHV0OiBQcm9wVHlwZXMuZnVuYyxcbn07XG5cblNlbGVjdEVsZW1lbnQuZGVmYXVsdFByb3BzID0ge1xuICBuYW1lOiAnJyxcbiAgb3B0aW9uczoge30sXG4gIGxhYmVsOiAnJyxcbiAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgaWQ6IG51bGwsXG4gIGNsYXNzOiAnJyxcbiAgbXVsdGlwbGU6IGZhbHNlLFxuICBkaXNhYmxlZDogZmFsc2UsXG4gIHJlcXVpcmVkOiBmYWxzZSxcbiAgc29ydEJ5VmFsdWU6IHRydWUsXG4gIGVtcHR5T3B0aW9uOiB0cnVlLFxuICBoYXNFcnJvcjogZmFsc2UsXG4gIGVycm9yTWVzc2FnZTogJ1RoZSBmaWVsZCBpcyByZXF1aXJlZCEnLFxuICBvblVzZXJJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVzZXJJbnB1dCgpIGNhbGxiYWNrIGlzIG5vdCBzZXQnKTtcbiAgfSxcbn07XG5cbi8qKlxuICogVGFncyBDb21wb25lbnRcbiAqIEFsbG93cyBmb3IgbXVsdGlwbGUgdmFsdWVzIHRvIGJlIGVudGVyZWQgZm9yIGEgc2luZ2xlIGZpZWxkXG4gKlxuICogQ29tZXMgaW4gMyBmbGF2b3JzOlxuICogMTogSWYgb3B0aW9ucyBhcmUgcGFzc2VkIGFuZCB1c2VTZWFyY2ggPSB0cnVlXG4gKiAgICBpbnB1dCBmaWVsZCBpcyByZW5kZXJlZCBhcyBhIHNlYXJjaGFibGUgZHJvcGRvd25cbiAqIDI6IElmIG9ubHkgb3B0aW9ucyBhcmUgcGFzc2VkLCBpbnB1dCBpcyByZW5kZXJlZCBhc1xuICogICAgYSBub3JtYWwgZHJvcGRvd24gc2VsZWN0XG4gKiAzOiBXaXRob3V0IG9wdGlvbnMsIGlucHV0IGlzIGEgbm9ybWFsLCBmcmVlIHRleHQgaW5wdXRcbiAqL1xuXG5jbGFzcyBUYWdzRWxlbWVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUtleVByZXNzID0gdGhpcy5oYW5kbGVLZXlQcmVzcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQWRkID0gdGhpcy5oYW5kbGVBZGQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVJlbW92ZSA9IHRoaXMuaGFuZGxlUmVtb3ZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRLZXlGcm9tVmFsdWUgPSB0aGlzLmdldEtleUZyb21WYWx1ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2FuQWRkSXRlbSA9IHRoaXMuY2FuQWRkSXRlbS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLy8gcGVuZGluZ1ZhbEtleSBpcyB0aGUgcGxhY2Vob2xkZXIgdmFyaWFibGUgZm9yIHRlbXBvcmFyaWx5IHN0b3JpbmdcbiAgLy8gdHlwZWQgb3Igc2VsZWN0ZWQgaXRlbXMgYmVmb3JlIGFkZGluZyB0aGVtIHRvIHRoZSBUYWdzXG4gIGhhbmRsZUNoYW5nZShlKSB7XG4gICAgdGhpcy5wcm9wcy5vblVzZXJJbnB1dCh0aGlzLnByb3BzLnBlbmRpbmdWYWxLZXksIGUudGFyZ2V0LnZhbHVlKTtcbiAgfVxuICAvLyBhbHNvIGFkZCB0YWdzIGlmIGVudGVyIGtleSBpcyBoaXQgd2l0aGluIGlucHV0IGZpZWxkXG4gIGhhbmRsZUtleVByZXNzKGUpIHtcbiAgICBpZiAoZS5rZXlDb2RlID09PSAxMyB8fCBlLndoaWNoID09PSAxMykge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5oYW5kbGVBZGQoKTtcbiAgICB9XG4gIH1cblxuICAvLyBzZW5kIHBlbmRpbmdWYWxLZXkgYXMgYW4gYXJndW1lbnQgaW4gb3JkZXIgdG8gbnVsbCBvdXQgZW50ZXJlZCBpdGVtXG4gIGhhbmRsZUFkZCgpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5wcm9wcy5vcHRpb25zO1xuICAgIGxldCB2YWx1ZSA9IHRoaXMucHJvcHMudmFsdWU7XG4gICAgLy8gaWYgdXNpbmcgYSBkYXRhbGlzdCAoc2VhcmNoKSwgc2V0IHZhbHVlIHRvIGJlIHRoZSBrZXkgaW4gb3B0aW9uc1xuICAgIGlmICh0aGlzLnByb3BzLnVzZVNlYXJjaCAmJiBPYmplY3QudmFsdWVzKG9wdGlvbnMpLmluZGV4T2YodmFsdWUpID4gLTEpIHtcbiAgICAgIHZhbHVlID0gdGhpcy5nZXRLZXlGcm9tVmFsdWUodmFsdWUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jYW5BZGRJdGVtKHZhbHVlKSkge1xuICAgICAgdGhpcy5wcm9wcy5vblVzZXJBZGQodGhpcy5wcm9wcy5uYW1lLCB2YWx1ZSwgdGhpcy5wcm9wcy5wZW5kaW5nVmFsS2V5KTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVSZW1vdmUoZSkge1xuICAgIGNvbnN0IHZhbHVlID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWl0ZW0nKTtcbiAgICB0aGlzLnByb3BzLm9uVXNlclJlbW92ZSh0aGlzLnByb3BzLm5hbWUsIHZhbHVlKTtcbiAgfVxuXG4gIGdldEtleUZyb21WYWx1ZSh2YWx1ZSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLnByb3BzLm9wdGlvbnM7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9wdGlvbnMpLmZpbmQoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG9wdGlvbnNbb10gPT09IHZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gaGVscGVyIGZ1bmN0aW9uIHRvIGRldGVjdCBpZiBpdGVtIHNob3VsZCBiZSBhZGRlZCB0byBUYWdzXG4gIGNhbkFkZEl0ZW0odmFsdWUpIHtcbiAgICBsZXQgcmVzdWx0ID0gdHJ1ZTtcbiAgICAvLyByZWplY3QgZW1wdHkgdmFsdWVzXG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAvLyByZWplY3QgaWYgYWxsb3dEdXBsIGlzIGZhbHNlIGFuZCBpdGVtIGlzIGFscmVhZHkgaW4gYXJyYXlcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnByb3BzLmFsbG93RHVwbCAmJiB0aGlzLnByb3BzLml0ZW1zLmluZGV4T2YodmFsdWUpID4gLTEpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgLy8gcmVqZWN0IGlmIHVzaW5nIGEgc3RyaWN0IGRhdGFsaXN0IGFuZCB2YWx1ZSBpcyBub3QgaW4gb3B0aW9uc1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy51c2VTZWFyY2ggJiZcbiAgICAgIHRoaXMucHJvcHMuc3RyaWN0U2VhcmNoICYmXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLnByb3BzLm9wdGlvbnMpLmluZGV4T2YodmFsdWUpID09PSAtMVxuICAgICkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IHRoaXMucHJvcHMuZGlzYWJsZWQgPyAnZGlzYWJsZWQnIDogbnVsbDtcbiAgICBsZXQgcmVxdWlyZWRIVE1MID0gbnVsbDtcbiAgICBsZXQgZW1wdHlPcHRpb25IVE1MID0gbnVsbDtcbiAgICBsZXQgZXJyb3JNZXNzYWdlID0gbnVsbDtcbiAgICBsZXQgZWxlbWVudENsYXNzID0gJ3JvdyBmb3JtLWdyb3VwJztcbiAgICAvLyBBZGQgcmVxdWlyZWQgYXN0ZXJpeFxuICAgIGlmICh0aGlzLnByb3BzLnJlcXVpcmVkKSB7XG4gICAgICByZXF1aXJlZEhUTUwgPSA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWRhbmdlclwiPio8L3NwYW4+O1xuICAgIH1cblxuICAgIC8vIEFkZCBlbXB0eSBvcHRpb25cbiAgICBpZiAodGhpcy5wcm9wcy5lbXB0eU9wdGlvbikge1xuICAgICAgZW1wdHlPcHRpb25IVE1MID0gPG9wdGlvbj48L29wdGlvbj47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuZXJyb3JNZXNzYWdlKSB7XG4gICAgICBlcnJvck1lc3NhZ2UgPSA8c3Bhbj57dGhpcy5wcm9wcy5lcnJvck1lc3NhZ2V9PC9zcGFuPjtcbiAgICAgIGVsZW1lbnRDbGFzcyA9ICdyb3cgZm9ybS1ncm91cCBoYXMtZXJyb3InO1xuICAgIH1cblxuICAgIGxldCBpbnB1dDtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5wcm9wcy5vcHRpb25zO1xuICAgIC8vIGlmIG9wdGlvbnMgYXJlIGdpdmVuIGFuZCB1c2VTZWFyY2ggaXMgc3BlY2lmaWVkXG4gICAgaWYgKE9iamVjdC5rZXlzKG9wdGlvbnMpLmxlbmd0aCA+IDAgJiYgdGhpcy5wcm9wcy51c2VTZWFyY2gpIHtcbiAgICAgIGlucHV0ID0gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICAgICAgaWQ9e3RoaXMucHJvcHMuaWR9XG4gICAgICAgICAgICBsaXN0PXt0aGlzLnByb3BzLmlkICsgJ19saXN0J31cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZSB8fCAnJ31cbiAgICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgIG9uS2V5UHJlc3M9e3RoaXMuaGFuZGxlS2V5UHJlc3N9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8ZGF0YWxpc3QgaWQ9e3RoaXMucHJvcHMuaWQgKyAnX2xpc3QnfT5cbiAgICAgICAgICAgIHtPYmplY3Qua2V5cyhvcHRpb25zKS5tYXAoZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17b3B0aW9uc1tvcHRpb25dfSBrZXk9e29wdGlvbn0+XG4gICAgICAgICAgICAgICAgICB7b3B0aW9uc1tvcHRpb25dfVxuICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPC9kYXRhbGlzdD5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgICAgLy8gaWYgb3B0aW9ucyBhcmUgcHJlc2VudCBidXQgdXNlU2VhcmNoIGlzIGZhbHNlLCB1c2Ugbm9ybWFsIGRyb3Bkb3duXG4gICAgfSBlbHNlIGlmIChPYmplY3Qua2V5cyhvcHRpb25zKS5sZW5ndGggPiAwKSB7XG4gICAgICBpbnB1dCA9IDxzZWxlY3RcbiAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICBpZD17dGhpcy5wcm9wcy5pZH1cbiAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMudmFsdWV9XG4gICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICBvbktleVByZXNzPXt0aGlzLmhhbmRsZUtleVByZXNzfVxuICAgICAgPlxuICAgICAgICB7ZW1wdHlPcHRpb25IVE1MfVxuICAgICAgICB7T2JqZWN0LmtleXMob3B0aW9ucykubWFwKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtvcHRpb259IGtleT17b3B0aW9ufT57b3B0aW9uc1tvcHRpb25dfTwvb3B0aW9uPlxuICAgICAgICAgICk7XG4gICAgICAgIH0pfVxuICAgICAgPC9zZWxlY3Q+O1xuICAgICAgLy8gZWxzZSwgdXNlIGEgdGV4dCBpbnB1dCBieSBkZWZhdWx0XG4gICAgfSBlbHNlIHtcbiAgICAgIGlucHV0ID0gPGlucHV0XG4gICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICBpZD17dGhpcy5wcm9wcy5pZH1cbiAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMudmFsdWUgfHwgJyd9XG4gICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICBvbktleVByZXNzPXt0aGlzLmhhbmRsZUtleVByZXNzfVxuICAgICAgLz47XG4gICAgfVxuXG4gICAgLy8gaXRlcmF0ZSB0aHJvdWdoIGFkZGVkIFRhZ3MgaXRlbXMgYW5kIHJlbmRlciB0aGVtXG4gICAgLy8gd2l0aCBkZWxldGlvbiBidXR0b25cbiAgICBjb25zdCBpdGVtcyA9IHRoaXMucHJvcHMuaXRlbXMubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIGxldCBpdG1UeHQ7XG4gICAgICAvLyBpbiBldmVudCB0aGF0IHRoZSBwYXNzZWQgaXRlbSBpcyBhIGtleSBvZiBvcHRpb25zLFxuICAgICAgLy8gcmVuZGVyIG9wdGlvbiB2YWx1ZVxuICAgICAgaWYgKE9iamVjdC5rZXlzKG9wdGlvbnMpLmxlbmd0aCA+IDAgJiYgb3B0aW9uc1tpdGVtXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGl0bVR4dCA9IG9wdGlvbnNbaXRlbV07XG4gICAgICAgIC8vIG90aGVyd2lzZSBqdXN0IHJlbmRlciBpdGVtIGFzIGlzXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpdG1UeHQgPSBpdGVtO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4taW5mbyBidG4taW5saW5lXCJcbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlbW92ZX1cbiAgICAgICAgICBkYXRhLWl0ZW09e2l0ZW19XG4gICAgICAgID5cbiAgICAgICAgICB7aXRtVHh0fVxuICAgICAgICAgICZuYnNwO1xuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZVwiXG4gICAgICAgICAgICBkYXRhLWl0ZW09e2l0ZW19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICApO1xuICAgIH0sIHRoaXMpO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17ZWxlbWVudENsYXNzfT5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC1zbS0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPXt0aGlzLnByb3BzLmlkfT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5sYWJlbH1cbiAgICAgICAgICB7cmVxdWlyZWRIVE1MfVxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS05XCI+XG4gICAgICAgICAge2l0ZW1zfVxuICAgICAgICAgIHtpbnB1dH1cbiAgICAgICAgICB7ZXJyb3JNZXNzYWdlfVxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tc3VjY2VzcyBidG4tYWRkLXRhZ1wiXG4gICAgICAgICAgICBpZD17dGhpcy5wcm9wcy5pZCArICdBZGQnfVxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUFkZH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLXBsdXNcIi8+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5idG5MYWJlbH1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cblRhZ3NFbGVtZW50LnByb3BUeXBlcyA9IHtcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBwZW5kaW5nVmFsS2V5OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIG9wdGlvbnM6IFByb3BUeXBlcy5vYmplY3QsXG4gIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB2YWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgY2xhc3M6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG11bHRpcGxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgcmVxdWlyZWQ6IFByb3BUeXBlcy5ib29sLFxuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGVtcHR5T3B0aW9uOiBQcm9wVHlwZXMuYm9vbCxcbiAgZXJyb3JNZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBidG5MYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgYWxsb3dEdXBsOiBQcm9wVHlwZXMuYm9vbCxcbiAgdXNlU2VhcmNoOiBQcm9wVHlwZXMuYm9vbCxcbiAgc3RyaWN0U2VhcmNoOiBQcm9wVHlwZXMuYm9vbCxcbiAgb25Vc2VySW5wdXQ6IFByb3BUeXBlcy5mdW5jLFxuICBvblVzZXJBZGQ6IFByb3BUeXBlcy5mdW5jLFxuICBvblVzZXJSZW1vdmU6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuVGFnc0VsZW1lbnQuZGVmYXVsdFByb3BzID0ge1xuICBuYW1lOiAnJyxcbiAgb3B0aW9uczoge30sXG4gIGl0ZW1zOiBbXSxcbiAgbGFiZWw6ICcnLFxuICB2YWx1ZTogdW5kZWZpbmVkLFxuICBpZDogbnVsbCxcbiAgY2xhc3M6ICcnLFxuICByZXF1aXJlZDogZmFsc2UsXG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgZW1wdHlPcHRpb246IHRydWUsXG4gIGhhc0Vycm9yOiBmYWxzZSxcbiAgYWxsb3dEdXBsOiBmYWxzZSxcbiAgdXNlU2VhcmNoOiBmYWxzZSxcbiAgc3RyaWN0U2VhcmNoOiBmYWxzZSwgLy8gb25seSBhY2NlcHQgaXRlbXMgc3BlY2lmaWVkIGluIG9wdGlvbnNcbiAgZXJyb3JNZXNzYWdlOiAnJyxcbiAgcGVuZGluZ1ZhbEtleTogJycsXG4gIGJ0bkxhYmVsOiAnQWRkIFRhZycsXG4gIG9uVXNlcklucHV0OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uVXNlcklucHV0KCkgY2FsbGJhY2sgaXMgbm90IHNldCcpO1xuICB9LFxuICBvblVzZXJBZGQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUud2Fybignb25Vc2VyQWRkKCkgY2FsbGJhY2sgaXMgbm90IHNldCcpO1xuICB9LFxuICBvblVzZXJSZW1vdmU6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUud2Fybignb25Vc2VyUmVtb3ZlKCkgY2FsbGJhY2sgaXMgbm90IHNldCcpO1xuICB9LFxufTtcblxuLyoqXG4gKiBUZXh0YXJlYSBDb21wb25lbnRcbiAqIFJlYWN0IHdyYXBwZXIgZm9yIGEgPHRleHRhcmVhPiBlbGVtZW50LlxuICovXG5jbGFzcyBUZXh0YXJlYUVsZW1lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZSkge1xuICAgIHRoaXMucHJvcHMub25Vc2VySW5wdXQodGhpcy5wcm9wcy5uYW1lLCBlLnRhcmdldC52YWx1ZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSB0aGlzLnByb3BzLmRpc2FibGVkID8gJ2Rpc2FibGVkJyA6IG51bGw7XG4gICAgY29uc3QgcmVxdWlyZWQgPSB0aGlzLnByb3BzLnJlcXVpcmVkID8gJ3JlcXVpcmVkJyA6IG51bGw7XG4gICAgbGV0IHJlcXVpcmVkSFRNTCA9IG51bGw7XG5cbiAgICAvLyBBZGQgcmVxdWlyZWQgYXN0ZXJpeFxuICAgIGlmIChyZXF1aXJlZCkge1xuICAgICAgcmVxdWlyZWRIVE1MID0gPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1kYW5nZXJcIj4qPC9zcGFuPjtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZm9ybS1ncm91cFwiPlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9e3RoaXMucHJvcHMuaWR9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgICAgIHtyZXF1aXJlZEhUTUx9XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTlcIj5cbiAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgIGNvbHM9e3RoaXMucHJvcHMuY29sc31cbiAgICAgICAgICAgIHJvd3M9e3RoaXMucHJvcHMucm93c31cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgICAgICBpZD17dGhpcy5wcm9wcy5pZH1cbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnZhbHVlIHx8ICcnfVxuICAgICAgICAgICAgcmVxdWlyZWQ9e3JlcXVpcmVkfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgID5cbiAgICAgICAgICA8L3RleHRhcmVhPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuVGV4dGFyZWFFbGVtZW50LnByb3BUeXBlcyA9IHtcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdmFsdWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIHJlcXVpcmVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgcm93czogUHJvcFR5cGVzLm51bWJlcixcbiAgY29sczogUHJvcFR5cGVzLm51bWJlcixcbiAgb25Vc2VySW5wdXQ6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuVGV4dGFyZWFFbGVtZW50LmRlZmF1bHRQcm9wcyA9IHtcbiAgbmFtZTogJycsXG4gIGxhYmVsOiAnJyxcbiAgdmFsdWU6ICcnLFxuICBpZDogbnVsbCxcbiAgZGlzYWJsZWQ6IGZhbHNlLFxuICByZXF1aXJlZDogZmFsc2UsXG4gIHJvd3M6IDQsXG4gIGNvbHM6IDI1LFxuICBvblVzZXJJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVzZXJJbnB1dCgpIGNhbGxiYWNrIGlzIG5vdCBzZXQnKTtcbiAgfSxcbn07XG5cbi8qKlxuICogVGV4dGJveCBDb21wb25lbnRcbiAqIFJlYWN0IHdyYXBwZXIgZm9yIGEgPGlucHV0IHR5cGU9XCJ0ZXh0XCI+IGVsZW1lbnQuXG4gKi9cbmNsYXNzIFRleHRib3hFbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQmx1ciA9IHRoaXMuaGFuZGxlQmx1ci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGUpIHtcbiAgICB0aGlzLnByb3BzLm9uVXNlcklucHV0KHRoaXMucHJvcHMubmFtZSwgZS50YXJnZXQudmFsdWUsIGUudGFyZ2V0LmlkLCAndGV4dGJveCcpO1xuICB9XG5cbiAgaGFuZGxlQmx1cihlKSB7XG4gICAgdGhpcy5wcm9wcy5vblVzZXJCbHVyKHRoaXMucHJvcHMubmFtZSwgZS50YXJnZXQudmFsdWUpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGRpc2FibGVkID0gdGhpcy5wcm9wcy5kaXNhYmxlZCA/ICdkaXNhYmxlZCcgOiBudWxsO1xuICAgIGNvbnN0IHJlcXVpcmVkID0gdGhpcy5wcm9wcy5yZXF1aXJlZCA/ICdyZXF1aXJlZCcgOiBudWxsO1xuICAgIGxldCBlcnJvck1lc3NhZ2UgPSBudWxsO1xuICAgIGxldCByZXF1aXJlZEhUTUwgPSBudWxsO1xuICAgIGxldCBlbGVtZW50Q2xhc3MgPSAncm93IGZvcm0tZ3JvdXAnO1xuXG4gICAgLy8gQWRkIHJlcXVpcmVkIGFzdGVyaXhcbiAgICBpZiAocmVxdWlyZWQpIHtcbiAgICAgIHJlcXVpcmVkSFRNTCA9IDxzcGFuIGNsYXNzTmFtZT1cInRleHQtZGFuZ2VyXCI+Kjwvc3Bhbj47XG4gICAgfVxuXG4gICAgLy8gQWRkIGVycm9yIG1lc3NhZ2VcbiAgICBpZiAodGhpcy5wcm9wcy5lcnJvck1lc3NhZ2UpIHtcbiAgICAgIGVycm9yTWVzc2FnZSA9IDxzcGFuPnt0aGlzLnByb3BzLmVycm9yTWVzc2FnZX08L3NwYW4+O1xuICAgICAgZWxlbWVudENsYXNzID0gJ3JvdyBmb3JtLWdyb3VwIGhhcy1lcnJvcic7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtlbGVtZW50Q2xhc3N9PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9e3RoaXMucHJvcHMuaWR9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgICAgIHtyZXF1aXJlZEhUTUx9XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTlcIj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgICAgICBpZD17dGhpcy5wcm9wcy5pZH1cbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnZhbHVlIHx8ICcnfVxuICAgICAgICAgICAgcmVxdWlyZWQ9e3JlcXVpcmVkfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgb25CbHVyPXt0aGlzLmhhbmRsZUJsdXJ9XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7ZXJyb3JNZXNzYWdlfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuVGV4dGJveEVsZW1lbnQucHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB2YWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgcmVxdWlyZWQ6IFByb3BUeXBlcy5ib29sLFxuICBlcnJvck1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG9uVXNlcklucHV0OiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Vc2VyQmx1cjogUHJvcFR5cGVzLmZ1bmMsXG59O1xuXG5UZXh0Ym94RWxlbWVudC5kZWZhdWx0UHJvcHMgPSB7XG4gIG5hbWU6ICcnLFxuICBsYWJlbDogJycsXG4gIHZhbHVlOiAnJyxcbiAgaWQ6IG51bGwsXG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICBlcnJvck1lc3NhZ2U6ICcnLFxuICBvblVzZXJJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVzZXJJbnB1dCgpIGNhbGxiYWNrIGlzIG5vdCBzZXQnKTtcbiAgfSxcbiAgb25Vc2VyQmx1cjogZnVuY3Rpb24oKSB7XG4gIH0sXG59O1xuXG4vKipcbiAqIERhdGUgQ29tcG9uZW50XG4gKiBSZWFjdCB3cmFwcGVyIGZvciBhIDxpbnB1dCB0eXBlPVwiZGF0ZVwiPiBlbGVtZW50LlxuICovXG5jbGFzcyBEYXRlRWxlbWVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShlKSB7XG4gICAgdGhpcy5wcm9wcy5vblVzZXJJbnB1dCh0aGlzLnByb3BzLm5hbWUsIGUudGFyZ2V0LnZhbHVlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IHRoaXMucHJvcHMuZGlzYWJsZWQgPyAnZGlzYWJsZWQnIDogbnVsbDtcbiAgICBjb25zdCByZXF1aXJlZCA9IHRoaXMucHJvcHMucmVxdWlyZWQgPyAncmVxdWlyZWQnIDogbnVsbDtcbiAgICBsZXQgcmVxdWlyZWRIVE1MID0gbnVsbDtcblxuICAgIC8vIEFkZCByZXF1aXJlZCBhc3Rlcml4XG4gICAgaWYgKHJlcXVpcmVkKSB7XG4gICAgICByZXF1aXJlZEhUTUwgPSA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWRhbmdlclwiPio8L3NwYW4+O1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBmb3JtLWdyb3VwXCI+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wtc20tMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj17dGhpcy5wcm9wcy5sYWJlbH0+XG4gICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgICAge3JlcXVpcmVkSFRNTH1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOVwiPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cImRhdGVcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZX1cbiAgICAgICAgICAgIGlkPXt0aGlzLnByb3BzLmlkfVxuICAgICAgICAgICAgbWluPXt0aGlzLnByb3BzLm1pblllYXJ9XG4gICAgICAgICAgICBtYXg9e3RoaXMucHJvcHMubWF4WWVhcn1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnZhbHVlIHx8ICcnfVxuICAgICAgICAgICAgcmVxdWlyZWQ9e3JlcXVpcmVkfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5EYXRlRWxlbWVudC5wcm9wVHlwZXMgPSB7XG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgbWF4WWVhcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgbWluWWVhcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICByZXF1aXJlZDogUHJvcFR5cGVzLmJvb2wsXG4gIG9uVXNlcklucHV0OiBQcm9wVHlwZXMuZnVuYyxcbn07XG5cbkRhdGVFbGVtZW50LmRlZmF1bHRQcm9wcyA9IHtcbiAgbmFtZTogJycsXG4gIGxhYmVsOiAnJyxcbiAgdmFsdWU6ICcnLFxuICBpZDogbnVsbCxcbiAgbWF4WWVhcjogJzk5OTktMTItMzEnLFxuICBtaW5ZZWFyOiAnMTAwMC0wMS0wMScsXG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICBvblVzZXJJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVzZXJJbnB1dCgpIGNhbGxiYWNrIGlzIG5vdCBzZXQnKTtcbiAgfSxcbn07XG5cbi8qKlxuICogVGltZSBDb21wb25lbnRcbiAqIFJlYWN0IHdyYXBwZXIgZm9yIGEgPGlucHV0IHR5cGU9XCJ0aW1lXCI+IGVsZW1lbnQuXG4gKi9cbmNsYXNzIFRpbWVFbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZSkge1xuICAgIHRoaXMucHJvcHMub25Vc2VySW5wdXQodGhpcy5wcm9wcy5uYW1lLCBlLnRhcmdldC52YWx1ZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSB0aGlzLnByb3BzLmRpc2FibGVkID8gJ2Rpc2FibGVkJyA6IG51bGw7XG4gICAgY29uc3QgcmVxdWlyZWQgPSB0aGlzLnByb3BzLnJlcXVpcmVkID8gJ3JlcXVpcmVkJyA6IG51bGw7XG4gICAgbGV0IHJlcXVpcmVkSFRNTCA9IG51bGw7XG5cbiAgICAvLyBBZGQgcmVxdWlyZWQgYXN0ZXJpeFxuICAgIGlmIChyZXF1aXJlZCkge1xuICAgICAgcmVxdWlyZWRIVE1MID0gPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1kYW5nZXJcIj4qPC9zcGFuPjtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZm9ybS1ncm91cFwiPlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9e3RoaXMucHJvcHMubGFiZWx9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgICAgIHtyZXF1aXJlZEhUTUx9XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTlcIj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJ0aW1lXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgICAgICBpZD17dGhpcy5wcm9wcy5pZH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnZhbHVlIHx8ICcnfVxuICAgICAgICAgICAgcmVxdWlyZWQ9e3JlcXVpcmVkfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgICAgcGF0dGVybj1cIihbMC0xXVswLTldfDJbMC00XXxbMS05XSk6KFswLTVdWzAtOV0pKDooWzAtNV1bMC05XSkpP1wiXG4gICAgICAgICAgICB0aXRsZT1cIklucHV0IG11c3QgYmUgaW4gb25lIG9mIHRoZSBmb2xsb3dpbmcgZm9ybWF0czogSEg6TU0gb3IgSEg6TU06U1NcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5UaW1lRWxlbWVudC5wcm9wVHlwZXMgPSB7XG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICByZXF1aXJlZDogUHJvcFR5cGVzLmJvb2wsXG4gIG9uVXNlcklucHV0OiBQcm9wVHlwZXMuZnVuYyxcbn07XG5cblRpbWVFbGVtZW50LmRlZmF1bHRQcm9wcyA9IHtcbiAgbmFtZTogJycsXG4gIGxhYmVsOiAnJyxcbiAgdmFsdWU6ICcnLFxuICBpZDogJycsXG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICBvblVzZXJJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVzZXJJbnB1dCgpIGNhbGxiYWNrIGlzIG5vdCBzZXQnKTtcbiAgfSxcbn07XG5cbi8qKlxuICogTnVtZXJpYyBDb21wb25lbnRcbiAqIFJlYWN0IHdyYXBwZXIgZm9yIGEgPGlucHV0IHR5cGU9XCJudW1iZXJcIj4gZWxlbWVudC5cbiAqL1xuY2xhc3MgTnVtZXJpY0VsZW1lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZSkge1xuICAgIHRoaXMucHJvcHMub25Vc2VySW5wdXQodGhpcy5wcm9wcy5uYW1lLCBlLnRhcmdldC52YWx1ZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSB0aGlzLnByb3BzLmRpc2FibGVkID8gJ2Rpc2FibGVkJyA6IG51bGw7XG4gICAgY29uc3QgcmVxdWlyZWQgPSB0aGlzLnByb3BzLnJlcXVpcmVkID8gJ3JlcXVpcmVkJyA6IG51bGw7XG4gICAgY29uc3QgcmVxdWlyZWRIVE1MID0gbnVsbDtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBmb3JtLWdyb3VwXCI+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wtc20tMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj17dGhpcy5wcm9wcy5pZH0+XG4gICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgICAge3JlcXVpcmVkSFRNTH1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOVwiPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICAgICAgaWQ9e3RoaXMucHJvcHMuaWR9XG4gICAgICAgICAgICBtaW49e3RoaXMucHJvcHMubWlufVxuICAgICAgICAgICAgbWF4PXt0aGlzLnByb3BzLm1heH1cbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnZhbHVlfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgICAgcmVxdWlyZWQ9e3JlcXVpcmVkfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5OdW1lcmljRWxlbWVudC5wcm9wVHlwZXMgPSB7XG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgbWluOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIG1heDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdmFsdWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIHJlcXVpcmVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgb25Vc2VySW5wdXQ6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuTnVtZXJpY0VsZW1lbnQuZGVmYXVsdFByb3BzID0ge1xuICBuYW1lOiAnJyxcbiAgbWluOiBudWxsLFxuICBtYXg6IG51bGwsXG4gIGxhYmVsOiAnJyxcbiAgdmFsdWU6ICcnLFxuICBpZDogbnVsbCxcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICBkaXNhYmxlZDogZmFsc2UsXG4gIG9uVXNlcklucHV0OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uVXNlcklucHV0KCkgY2FsbGJhY2sgaXMgbm90IHNldCcpO1xuICB9LFxufTtcblxuLyoqXG4gKiBGaWxlIENvbXBvbmVudFxuICogUmVhY3Qgd3JhcHBlciBmb3IgYSBzaW1wbGUgb3IgJ211bHRpcGxlJyA8c2VsZWN0PiBlbGVtZW50LlxuICovXG5jbGFzcyBGaWxlRWxlbWVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShlKSB7XG4gICAgLy8gU2VuZCBjdXJyZW50IGZpbGUgdG8gcGFyZW50IGNvbXBvbmVudFxuICAgIGNvbnN0IGZpbGUgPSBlLnRhcmdldC5maWxlc1swXSA/IGUudGFyZ2V0LmZpbGVzWzBdIDogJyc7XG4gICAgdGhpcy5wcm9wcy5vblVzZXJJbnB1dCh0aGlzLnByb3BzLm5hbWUsIGZpbGUpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJlcXVpcmVkID0gdGhpcy5wcm9wcy5yZXF1aXJlZCA/ICdyZXF1aXJlZCcgOiBudWxsO1xuICAgIGNvbnN0IGZpbGVOYW1lID0gdGhpcy5wcm9wcy52YWx1ZSA/IHRoaXMucHJvcHMudmFsdWUubmFtZSA6IHVuZGVmaW5lZDtcbiAgICBsZXQgcmVxdWlyZWRIVE1MID0gbnVsbDtcbiAgICBsZXQgZXJyb3JNZXNzYWdlID0gJyc7XG4gICAgbGV0IGVsZW1lbnRDbGFzcyA9ICdyb3cgZm9ybS1ncm91cCc7XG5cbiAgICAvLyBBZGQgcmVxdWlyZWQgYXN0ZXJpeFxuICAgIGlmIChyZXF1aXJlZCkge1xuICAgICAgcmVxdWlyZWRIVE1MID0gPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1kYW5nZXJcIj4qPC9zcGFuPjtcbiAgICB9XG5cbiAgICBjb25zdCB0cnVuY2F0ZUVsbGlwc2lzID0ge1xuICAgICAgZGlzcGxheTogJ3RhYmxlJyxcbiAgICAgIHRhYmxlTGF5b3V0OiAnZml4ZWQnLFxuICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgIH07XG5cbiAgICBjb25zdCB0cnVuY2F0ZUVsbGlwc2lzQ2hpbGQgPSB7XG4gICAgICBkaXNwbGF5OiAndGFibGUtY2VsbCcsXG4gICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICB0ZXh0T3ZlcmZsb3c6ICdlbGxpcHNpcycsXG4gICAgfTtcblxuICAgIC8vIEFkZCBlcnJvciBtZXNzYWdlXG4gICAgaWYgKHRoaXMucHJvcHMuaGFzRXJyb3IpIHtcbiAgICAgIGVycm9yTWVzc2FnZSA9IHRoaXMucHJvcHMuZXJyb3JNZXNzYWdlO1xuICAgICAgZWxlbWVudENsYXNzID0gJ3JvdyBmb3JtLWdyb3VwIGhhcy1lcnJvcic7XG4gICAgfVxuXG4gICAgLy8gTmVlZCB0byBtYW51YWxseSByZXNldCBmaWxlIHZhbHVlLCBiZWNhdXNlIEhUTUwgQVBJXG4gICAgLy8gZG9lcyBub3QgYWxsb3cgc2V0dGluZyB2YWx1ZSB0byBhbnl0aGluZyB0aGFuIGVtcHR5IHN0cmluZy5cbiAgICAvLyBIZW5jZSBjYW4ndCB1c2UgdmFsdWUgYXR0cmlidXRlIGluIHRoZSBpbnB1dCBlbGVtZW50LlxuICAgIGNvbnN0IGZpbGVIVE1MID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZpbGVVcGxvYWQnKTtcbiAgICBpZiAoZmlsZUhUTUwgJiYgIWZpbGVOYW1lKSB7XG4gICAgICBmaWxlSFRNTC52YWx1ZSA9ICcnO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmRpc2FibGVkKSB7XG4gICAgICAvLyBhZGQgcGFkZGluZyB0byBhbGlnbiB2aWRlbyB0aXRsZSBvbiBkaXNhYmxlZCBmaWVsZFxuICAgICAgdHJ1bmNhdGVFbGxpcHNpcy5wYWRkaW5nVG9wID0gJzdweCc7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17ZWxlbWVudENsYXNzfT5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTMgY29udHJvbC1sYWJlbFwiPlxuICAgICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS05XCI+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt0cnVuY2F0ZUVsbGlwc2lzfT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3RydW5jYXRlRWxsaXBzaXNDaGlsZH0+e2ZpbGVOYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtlbGVtZW50Q2xhc3N9PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTMgY29udHJvbC1sYWJlbFwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgICAgIHtyZXF1aXJlZEhUTUx9XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTlcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwXCI+XG4gICAgICAgICAgICA8ZGl2IHRhYkluZGV4PVwiLTFcIiBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2wgZmlsZS1jYXB0aW9uIGt2LWZpbGVpbnB1dC1jYXB0aW9uXCI+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RydW5jYXRlRWxsaXBzaXN9PlxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt0cnVuY2F0ZUVsbGlwc2lzQ2hpbGR9PntmaWxlTmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbGUtY2FwdGlvbi1uYW1lXCIgaWQ9XCJ2aWRlb19maWxlXCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAtYnRuXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1maWxlXCI+XG4gICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1mb2xkZXItb3BlblwiPjwvaT4gQnJvd3NlXG4gICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmaWxlVXBsb2FkXCJcbiAgICAgICAgICAgICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZX1cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgICAgICAgIHJlcXVpcmVkPXtyZXF1aXJlZH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxzcGFuPntlcnJvck1lc3NhZ2V9PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuRmlsZUVsZW1lbnQucHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB2YWx1ZTogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICBQcm9wVHlwZXMub2JqZWN0LFxuICBdKSxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgcmVxdWlyZWQ6IFByb3BUeXBlcy5ib29sLFxuICBoYXNFcnJvcjogUHJvcFR5cGVzLmJvb2wsXG4gIGVycm9yTWVzc2FnZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgb25Vc2VySW5wdXQ6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuRmlsZUVsZW1lbnQuZGVmYXVsdFByb3BzID0ge1xuICBuYW1lOiAnJyxcbiAgbGFiZWw6ICdGaWxlIHRvIFVwbG9hZCcsXG4gIHZhbHVlOiAnJyxcbiAgaWQ6IG51bGwsXG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICBoYXNFcnJvcjogZmFsc2UsXG4gIGVycm9yTWVzc2FnZTogJ1RoZSBmaWVsZCBpcyByZXF1aXJlZCEnLFxuICBvblVzZXJJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVzZXJJbnB1dCgpIGNhbGxiYWNrIGlzIG5vdCBzZXQnKTtcbiAgfSxcbn07XG5cbi8qKlxuICogU3RhdGljIGVsZW1lbnQgY29tcG9uZW50LlxuICogVXNlZCB0byBkaXNwbGF5cyBwbGFpbi9mb3JtYXR0ZWQgdGV4dCBhcyBwYXJ0IG9mIGEgZm9ybVxuICpcbiAqIFRvIHBhc3MgYSBmb3JtYXR0ZWQgdGV4dCwgeW91IG5lZWQgdG8gd3JhcCBpdCBpbiBhIHNpbmdsZSBwYXJlbnQgZWxlbWVudC5cbiAqIEV4YW1wbGUgdXNhZ2U6XG4gKlxuICogYGBgXG4gKiBsZXQgbXlUZXh0ID0gKDxzcGFuPlRoaXMgaXMgbXkgPGI+dGV4dDwvYj48L3NwYW4+KTtcbiAqIDxTdGF0aWNFbGVtZW50XG4gKiAgICB0ZXh0PXtteVRleHR9XG4gKiAgICBsYWJlbD17bm90ZX1cbiAqIC8+XG4gKiBgYGBcbiAqL1xuY2xhc3MgU3RhdGljRWxlbWVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZm9ybS1ncm91cFwiPlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTMgY29udHJvbC1sYWJlbFwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS05XCI+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sLXN0YXRpY1wiPnt0aGlzLnByb3BzLnRleHR9PC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuU3RhdGljRWxlbWVudC5wcm9wVHlwZXMgPSB7XG4gIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB0ZXh0OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIFByb3BUeXBlcy5lbGVtZW50LFxuICBdKSxcbn07XG5cblN0YXRpY0VsZW1lbnQuZGVmYXVsdFByb3BzID0ge1xuICBsYWJlbDogJycsXG4gIHRleHQ6IG51bGwsXG59O1xuXG4vKipcbiAqIExpbmsgZWxlbWVudCBjb21wb25lbnQuXG4gKiBVc2VkIHRvIGxpbmsgcGxhaW4vZm9ybWF0ZWQgdGV4dCB0byBhbiBocmVmIGRlc3RpbmF0aW9uIGFzIHBhcnQgb2YgYSBmb3JtXG4gKi9cbmNsYXNzIExpbmtFbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGZvcm0tZ3JvdXBcIj5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC1zbS0zIGNvbnRyb2wtbGFiZWxcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5sYWJlbH1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOVwiPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbC1zdGF0aWNcIj5cbiAgICAgICAgICAgIDxhIGhyZWY9e3RoaXMucHJvcHMuaHJlZn0+e3RoaXMucHJvcHMudGV4dH08L2E+XG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuTGlua0VsZW1lbnQucHJvcFR5cGVzID0ge1xuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdGV4dDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICBQcm9wVHlwZXMuZWxlbWVudCxcbiAgXSksXG4gIGhyZWY6IFByb3BUeXBlcy5zdHJpbmcsXG59O1xuXG5MaW5rRWxlbWVudC5kZWZhdWx0UHJvcHMgPSB7XG4gIGxhYmVsOiAnJyxcbiAgdGV4dDogbnVsbCxcbiAgaHJlZjogbnVsbCxcbn07XG5cbi8qKlxuICogQ2hlY2tib3ggQ29tcG9uZW50XG4gKiBSZWFjdCB3cmFwcGVyIGZvciBhIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIj4gZWxlbWVudC5cbiAqL1xuY2xhc3MgQ2hlY2tib3hFbGVtZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZSkge1xuICAgIHRoaXMucHJvcHMub25Vc2VySW5wdXQodGhpcy5wcm9wcy5uYW1lLCBlLnRhcmdldC5jaGVja2VkKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IHRoaXMucHJvcHMuZGlzYWJsZWQgPyAnZGlzYWJsZWQnIDogbnVsbDtcbiAgICBjb25zdCByZXF1aXJlZCA9IHRoaXMucHJvcHMucmVxdWlyZWQgPyAncmVxdWlyZWQnIDogbnVsbDtcbiAgICBsZXQgZXJyb3JNZXNzYWdlID0gbnVsbDtcbiAgICBsZXQgcmVxdWlyZWRIVE1MID0gbnVsbDtcbiAgICBsZXQgZWxlbWVudENsYXNzID0gJ2NoZWNrYm94LWlubGluZSBjb2wtc20tb2Zmc2V0LTMnO1xuICAgIGNvbnN0IGxhYmVsID0gbnVsbDtcblxuICAgIC8vIEFkZCByZXF1aXJlZCBhc3Rlcml4XG4gICAgaWYgKHJlcXVpcmVkKSB7XG4gICAgICByZXF1aXJlZEhUTUwgPSA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWRhbmdlclwiPio8L3NwYW4+O1xuICAgIH1cblxuICAgIC8vIEFkZCBlcnJvciBtZXNzYWdlXG4gICAgaWYgKHRoaXMucHJvcHMuZXJyb3JNZXNzYWdlKSB7XG4gICAgICBlcnJvck1lc3NhZ2UgPSA8c3Bhbj57dGhpcy5wcm9wcy5lcnJvck1lc3NhZ2V9PC9zcGFuPjtcbiAgICAgIGVsZW1lbnRDbGFzcyA9ICdjaGVja2JveC1pbmxpbmUgY29sLXNtLW9mZnNldC0zIGhhcy1lcnJvcic7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtlbGVtZW50Q2xhc3N9PlxuICAgICAgICA8bGFiZWwgaHRtbEZvcj17dGhpcy5wcm9wcy5pZH0+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICAgICAgaWQ9e3RoaXMucHJvcHMuaWR9XG4gICAgICAgICAgICBjaGVja2VkPXt0aGlzLnByb3BzLnZhbHVlfVxuICAgICAgICAgICAgcmVxdWlyZWQ9e3JlcXVpcmVkfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgIC8+XG4gICAgICAgICAge2Vycm9yTWVzc2FnZX1cbiAgICAgICAgICB7dGhpcy5wcm9wcy5sYWJlbH1cbiAgICAgICAgICB7cmVxdWlyZWRIVE1MfVxuICAgICAgICA8L2xhYmVsPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5DaGVja2JveEVsZW1lbnQucHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHZhbHVlOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICByZXF1aXJlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGVycm9yTWVzc2FnZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgb25Vc2VySW5wdXQ6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuQ2hlY2tib3hFbGVtZW50LmRlZmF1bHRQcm9wcyA9IHtcbiAgaWQ6IG51bGwsXG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICBlcnJvck1lc3NhZ2U6ICcnLFxuICBvblVzZXJJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVzZXJJbnB1dCgpIGNhbGxiYWNrIGlzIG5vdCBzZXQnKTtcbiAgfSxcbn07XG5cbi8qKlxuICogQnV0dG9uIGNvbXBvbmVudFxuICogUmVhY3Qgd3JhcHBlciBmb3IgPGJ1dHRvbj4gZWxlbWVudCwgdHlwaWNhbGx5IHVzZWQgdG8gc3VibWl0IGZvcm1zXG4gKi9cbmNsYXNzIEJ1dHRvbkVsZW1lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soZSkge1xuICAgIHRoaXMucHJvcHMub25Vc2VySW5wdXQoZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGZvcm0tZ3JvdXBcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e3RoaXMucHJvcHMuY29sdW1uU2l6ZX0+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICAgICAgdHlwZT17dGhpcy5wcm9wcy50eXBlfVxuICAgICAgICAgICAgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmJ1dHRvbkNsYXNzfVxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja31cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5sYWJlbH1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkJ1dHRvbkVsZW1lbnQucHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdHlwZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgb25Vc2VySW5wdXQ6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuQnV0dG9uRWxlbWVudC5kZWZhdWx0UHJvcHMgPSB7XG4gIGxhYmVsOiAnU3VibWl0JyxcbiAgdHlwZTogJ3N1Ym1pdCcsXG4gIGJ1dHRvbkNsYXNzOiAnYnRuIGJ0bi1wcmltYXJ5JyxcbiAgY29sdW1uU2l6ZTogJ2NvbC1zbS05IGNvbC1zbS1vZmZzZXQtMycsXG4gIG9uVXNlcklucHV0OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uVXNlcklucHV0KCkgY2FsbGJhY2sgaXMgbm90IHNldCcpO1xuICB9LFxufTtcblxuLyoqXG4gICogQ2FsbCBUbyBBY3Rpb24gKENUQSkgY29tcG9uZW50XG4gICogUmVhY3Qgd3JhcHBlciBmb3IgPGJ1dHRvbj4gZWxlbWVudCB0aGF0IGlzIHVzZWQgZm9yIENhbGwgdG8gQWN0aW9ucywgdXN1YWxseVxuICAqIG91dHNpZGUgdGhlIGNvbnRleHQgb2YgZm9ybXMuXG4gICovXG5jbGFzcyBDVEEgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b25cbiAgICAgICAgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmJ1dHRvbkNsYXNzfVxuICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLm9uVXNlcklucHV0fVxuICAgICAgPlxuICAgICAgICB7dGhpcy5wcm9wcy5sYWJlbH1cbiAgICAgIDwvYnV0dG9uPlxuICAgICk7XG4gIH1cbn1cblxuQ1RBLnByb3BUeXBlcyA9IHtcbiAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGJ1dHRvbkNsYXNzOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBvblVzZXJJbnB1dDogUHJvcFR5cGVzLmZ1bmMsXG59O1xuXG5DVEEuZGVmYXVsdFByb3BzID0ge1xuICBidXR0b25DbGFzczogJ2J0biBidG4tcHJpbWFyeScsXG4gIG9uVXNlcklucHV0OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uVXNlcklucHV0KCkgY2FsbGJhY2sgaXMgbm90IHNldCcpO1xuICB9LFxufTtcblxuLyoqXG4gKiBHZW5lcmljIGZvcm0gZWxlbWVudC5cbiAqL1xuY2xhc3MgTG9yaXNFbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGVsZW1lbnRQcm9wcyA9IHRoaXMucHJvcHMuZWxlbWVudDtcbiAgICBlbGVtZW50UHJvcHMucmVmID0gZWxlbWVudFByb3BzLm5hbWU7XG4gICAgZWxlbWVudFByb3BzLm9uVXNlcklucHV0ID0gdGhpcy5wcm9wcy5vblVzZXJJbnB1dDtcblxuICAgIGxldCBlbGVtZW50SHRtbCA9IDxkaXY+PC9kaXY+O1xuXG4gICAgc3dpdGNoIChlbGVtZW50UHJvcHMudHlwZSkge1xuICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgIGVsZW1lbnRIdG1sID0gKDxUZXh0Ym94RWxlbWVudCB7Li4uZWxlbWVudFByb3BzfSAvPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGFncyc6XG4gICAgICAgIGVsZW1lbnRIdG1sID0gKDxUYWdzRWxlbWVudCB7Li4uZWxlbWVudFByb3BzfSAvPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgICAgZWxlbWVudEh0bWwgPSAoPFNlbGVjdEVsZW1lbnQgey4uLmVsZW1lbnRQcm9wc30gLz4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NlYXJjaCc6XG4gICAgICAgIGVsZW1lbnRIdG1sID0gKDxTZWFyY2hhYmxlRHJvcGRvd24gey4uLmVsZW1lbnRQcm9wc30vPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgIGVsZW1lbnRIdG1sID0gKDxEYXRlRWxlbWVudCB7Li4uZWxlbWVudFByb3BzfSAvPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgIGVsZW1lbnRIdG1sID0gKDxUaW1lRWxlbWVudCB7Li4uZWxlbWVudFByb3BzfSAvPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnVtZXJpYyc6XG4gICAgICAgIGVsZW1lbnRIdG1sID0gKDxOdW1lcmljRWxlbWVudCB7Li4uZWxlbWVudFByb3BzfSAvPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGV4dGFyZWEnOlxuICAgICAgICBlbGVtZW50SHRtbCA9ICg8VGV4dGFyZWFFbGVtZW50IHsuLi5lbGVtZW50UHJvcHN9IC8+KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdmaWxlJzpcbiAgICAgICAgZWxlbWVudEh0bWwgPSAoPEZpbGVFbGVtZW50IHsuLi5lbGVtZW50UHJvcHN9IC8+KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdGF0aWMnOlxuICAgICAgICBlbGVtZW50SHRtbCA9ICg8U3RhdGljRWxlbWVudCB7Li4uZWxlbWVudFByb3BzfSAvPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGluayc6XG4gICAgICAgIGVsZW1lbnRIdG1sID0gKDxMaW5rRWxlbWVudCB7Li4uZWxlbWVudFByb3BzfSAvPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYWR2Y2hlY2tib3gnOlxuICAgICAgICBlbGVtZW50SHRtbCA9ICg8Q2hlY2tib3hFbGVtZW50IHsuLi5lbGVtZW50UHJvcHN9IC8+KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAnRWxlbWVudCBvZiB0eXBlICcgKyBlbGVtZW50UHJvcHMudHlwZSArICcgaXMgbm90IGN1cnJlbnRseSBpbXBsZW1lbnRlZCEnXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50SHRtbDtcbiAgfVxufVxuXG53aW5kb3cuRm9ybUVsZW1lbnQgPSBGb3JtRWxlbWVudDtcbndpbmRvdy5GaWVsZHNldEVsZW1lbnQgPSBGaWVsZHNldEVsZW1lbnQ7XG53aW5kb3cuU2VsZWN0RWxlbWVudCA9IFNlbGVjdEVsZW1lbnQ7XG53aW5kb3cuVGFnc0VsZW1lbnQgPSBUYWdzRWxlbWVudDtcbndpbmRvdy5TZWFyY2hhYmxlRHJvcGRvd24gPSBTZWFyY2hhYmxlRHJvcGRvd247XG53aW5kb3cuVGV4dGFyZWFFbGVtZW50ID0gVGV4dGFyZWFFbGVtZW50O1xud2luZG93LlRleHRib3hFbGVtZW50ID0gVGV4dGJveEVsZW1lbnQ7XG53aW5kb3cuRGF0ZUVsZW1lbnQgPSBEYXRlRWxlbWVudDtcbndpbmRvdy5UaW1lRWxlbWVudCA9IFRpbWVFbGVtZW50O1xud2luZG93Lk51bWVyaWNFbGVtZW50ID0gTnVtZXJpY0VsZW1lbnQ7XG53aW5kb3cuRmlsZUVsZW1lbnQgPSBGaWxlRWxlbWVudDtcbndpbmRvdy5TdGF0aWNFbGVtZW50ID0gU3RhdGljRWxlbWVudDtcbndpbmRvdy5MaW5rRWxlbWVudCA9IExpbmtFbGVtZW50O1xud2luZG93LkNoZWNrYm94RWxlbWVudCA9IENoZWNrYm94RWxlbWVudDtcbndpbmRvdy5CdXR0b25FbGVtZW50ID0gQnV0dG9uRWxlbWVudDtcbndpbmRvdy5DVEEgPSBDVEE7XG53aW5kb3cuTG9yaXNFbGVtZW50ID0gTG9yaXNFbGVtZW50O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIEZvcm1FbGVtZW50LFxuICBGaWVsZHNldEVsZW1lbnQsXG4gIFNlbGVjdEVsZW1lbnQsXG4gIFRhZ3NFbGVtZW50LFxuICBTZWFyY2hhYmxlRHJvcGRvd24sXG4gIFRleHRhcmVhRWxlbWVudCxcbiAgVGV4dGJveEVsZW1lbnQsXG4gIERhdGVFbGVtZW50LFxuICBUaW1lRWxlbWVudCxcbiAgTnVtZXJpY0VsZW1lbnQsXG4gIEZpbGVFbGVtZW50LFxuICBTdGF0aWNFbGVtZW50LFxuICBMaW5rRWxlbWVudCxcbiAgQ2hlY2tib3hFbGVtZW50LFxuICBCdXR0b25FbGVtZW50LFxuICBDVEEsXG4gIExvcmlzRWxlbWVudCxcbn07XG4iLCIvKipcbiAqIFRoaXMgZmlsZSBjb250YWlucyB0aGUgUmVhY3QgY29tcG9uZW50IGZvciBMb2FkZXJcbiAqXG4gKiBAYXV0aG9yIEhlbnJpIFJhYmFsYWlzXG4gKiBAdmVyc2lvbiAxLjAuMFxuICpcbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbi8qKlxuICogTG9hZGVyIGNvbXBvbmVudFxuICovXG5jbGFzcyBMb2FkZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J2xvYWRlcidcbiAgICAgICAgc3R5bGU9e3t3aWR0aDogcGFyc2VJbnQodGhpcy5wcm9wcy5zaXplKSwgaGVpZ2h0OiBwYXJzZUludCh0aGlzLnByb3BzLnNpemUpfX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxufVxuXG5Mb2FkZXIucHJvcFR5cGVzID0ge3NpemU6IFByb3BUeXBlcy5zdHJpbmd9O1xuTG9hZGVyLmRlZmF1bHRQcm9wcyA9IHtzaXplOiAnMTIwJ307XG5cbmV4cG9ydCBkZWZhdWx0IExvYWRlcjtcbiIsIi8qIGV4cG9ydGVkIFJQYWdpbmF0aW9uTGlua3MgKi9cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5jbGFzcyBQYWdpbmF0aW9uTGlua3MgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG5cbiAgICB9O1xuICAgIHRoaXMuY2hhbmdlUGFnZSA9IHRoaXMuY2hhbmdlUGFnZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY2hhbmdlUGFnZShpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgLy8gRG9uJ3QganVtcCB0byB0aGUgdG9wIG9mIHRoZSBwYWdlXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgaWYgKHRoaXMucHJvcHMub25DaGFuZ2VQYWdlKSB7XG4gICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2VQYWdlKGkpO1xuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgcm93c1BlclBhZ2UgPSB0aGlzLnByb3BzLlJvd3NQZXJQYWdlO1xuICAgIGxldCBwYWdlTGlua3MgPSBbXTtcbiAgICBsZXQgY2xhc3NMaXN0O1xuICAgIGxldCBsYXN0UGFnZSA9IE1hdGguY2VpbCh0aGlzLnByb3BzLlRvdGFsIC8gcm93c1BlclBhZ2UpO1xuICAgIGxldCBzdGFydFBhZ2UgPSBNYXRoLm1heCgxLCB0aGlzLnByb3BzLkFjdGl2ZSAtIDMpO1xuICAgIGxldCBsYXN0U2hvd25QYWdlID0gTWF0aC5taW4odGhpcy5wcm9wcy5BY3RpdmUgKyAzLCBsYXN0UGFnZSk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5Ub3RhbCA9PT0gMCkge1xuICAgICAgcmV0dXJuIDxkaXYgLz47XG4gICAgfVxuICAgIGlmICh0aGlzLnByb3BzLlRvdGFsIDwgdGhpcy5wcm9wcy5Sb3dzUGVyUGFnZSkge1xuICAgICAgcmV0dXJuIDxkaXYgLz47XG4gICAgfVxuXG4gICAgaWYgKChsYXN0U2hvd25QYWdlIC0gc3RhcnRQYWdlKSA8PSA3KSB7XG4gICAgICBsYXN0U2hvd25QYWdlID0gc3RhcnRQYWdlICsgNjtcbiAgICAgIGlmIChsYXN0U2hvd25QYWdlID4gbGFzdFBhZ2UpIHtcbiAgICAgICAgbGFzdFNob3duUGFnZSA9IGxhc3RQYWdlO1xuICAgICAgICBzdGFydFBhZ2UgPSBsYXN0UGFnZSAtIDY7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0UGFnZSA+IDEpIHtcbiAgICAgIHBhZ2VMaW5rcy5wdXNoKFxuICAgICAgICA8bGkga2V5PXsndGFibGVfcGFnZV9iZWdpbm5pbmdfJyArIHN0YXJ0UGFnZS50b1N0cmluZygpfSBvbkNsaWNrPXt0aGlzLmNoYW5nZVBhZ2UoMSl9PjxhIGhyZWY9JyMnPiZsYXF1bzs8L2E+PC9saT5cbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChzdGFydFBhZ2UgPCAxKSB7XG4gICAgICBzdGFydFBhZ2UgPSAxO1xuICAgIH1cbiAgICBpZiAobGFzdFNob3duUGFnZSA8IDEpIHtcbiAgICAgIGxhc3RTaG93blBhZ2UgPSAxO1xuICAgIH1cblxuICAgICAgICAvLyBJZiB0aGVyZSBpcyBvbmx5IDEgcGFnZSwgZG9uJ3QgZGlzcGxheSBwYWdpbmF0aW9uIGxpbmtzXG4gICAgaWYgKHN0YXJ0UGFnZSA9PT0gbGFzdFNob3duUGFnZSkge1xuICAgICAgcmV0dXJuIDxkaXYgLz47XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0UGFnZTsgaSA8PSBsYXN0U2hvd25QYWdlOyBpICs9IDEpIHtcbiAgICAgIGNsYXNzTGlzdCA9ICcnO1xuICAgICAgaWYgKHRoaXMucHJvcHMuQWN0aXZlID09PSBpKSB7XG4gICAgICAgIGNsYXNzTGlzdCA9ICdhY3RpdmUnO1xuICAgICAgfVxuICAgICAgcGFnZUxpbmtzLnB1c2goXG4gICAgICAgIDxsaSBrZXk9eyd0YWJsZV9wYWdlXycgKyBpLnRvU3RyaW5nKCl9IG9uQ2xpY2s9e3RoaXMuY2hhbmdlUGFnZShpKX0gY2xhc3NOYW1lPXtjbGFzc0xpc3R9PlxuICAgICAgICAgIDxhIGhyZWY9XCIjXCI+e2l9PC9hPlxuICAgICAgICA8L2xpPlxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKGxhc3RTaG93blBhZ2UgIT09IGxhc3RQYWdlKSB7XG4gICAgICBwYWdlTGlua3MucHVzaChcbiAgICAgICAgPGxpIGtleT17J3RhYmxlX3BhZ2VfbW9yZV8nICsgbGFzdFNob3duUGFnZS50b1N0cmluZygpfSBvbkNsaWNrPXt0aGlzLmNoYW5nZVBhZ2UobGFzdFBhZ2UpfT5cbiAgICAgICAgICA8YSBocmVmPScjJz4mcmFxdW87PC9hPlxuICAgICAgICA8L2xpPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHVsIGNsYXNzTmFtZT0ncGFnaW5hdGlvbiBwYWdpbmF0aW9uLXRhYmxlJz5cbiAgICAgICAgICB7cGFnZUxpbmtzfVxuICAgICAgPC91bD5cbiAgICApO1xuICB9XG59XG5QYWdpbmF0aW9uTGlua3MucHJvcFR5cGVzID0ge1xuICBvbkNoYW5nZVBhZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBUb3RhbDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxufTtcblBhZ2luYXRpb25MaW5rcy5kZWZhdWx0UHJvcHMgPSB7XG4gIFJvd3NQZXJQYWdlOiAxMCxcbiAgQWN0aXZlOiAxLFxufTtcblxubGV0IFJQYWdpbmF0aW9uTGlua3MgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KFBhZ2luYXRpb25MaW5rcyk7XG5cbndpbmRvdy5QYWdpbmF0aW9uTGlua3MgPSBQYWdpbmF0aW9uTGlua3M7XG53aW5kb3cuUlBhZ2luYXRpb25MaW5rcyA9IFJQYWdpbmF0aW9uTGlua3M7XG5cbmV4cG9ydCBkZWZhdWx0IFBhZ2luYXRpb25MaW5rcztcbiIsIi8qKlxuICogVGhpcyBmaWxlIGNvbnRhaW5zIFJlYWN0IGNvbXBvbmVudCBmb3IgUGFuZWxcbiAqXG4gKiBAYXV0aG9yIEFsZXggSS5cbiAqIEB2ZXJzaW9uIDEuMC4wXG4gKlxuICovXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuLyoqXG4gKiBQYW5lbCBjb21wb25lbnRcbiAqIFdyYXBzIGNoaWxkcmVuIGluIGEgY29sbGFwc2libGUgYm9vdHN0cmFwIHBhbmVsXG4gKi9cbmNsYXNzIFBhbmVsIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgY29sbGFwc2VkOiB0aGlzLnByb3BzLmluaXRDb2xsYXBzZWQsXG4gICAgfTtcblxuICAgIC8vIEluaXRpYWxpemUgcGFuZWwgY2xhc3MgYmFzZWQgb24gY29sbGFwc2VkIHN0YXR1c1xuICAgIHRoaXMucGFuZWxDbGFzcyA9IChcbiAgICAgIHRoaXMucHJvcHMuaW5pdENvbGxhcHNlZCA/XG4gICAgICAgICdwYW5lbC1jb2xsYXBzZSBjb2xsYXBzZScgOlxuICAgICAgICAncGFuZWwtY29sbGFwc2UgY29sbGFwc2UgaW4nXG4gICAgKTtcblxuICAgIHRoaXMudG9nZ2xlQ29sbGFwc2VkID0gdGhpcy50b2dnbGVDb2xsYXBzZWQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHRvZ2dsZUNvbGxhcHNlZCgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtjb2xsYXBzZWQ6ICF0aGlzLnN0YXRlLmNvbGxhcHNlZH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIC8vIENoYW5nZSBhcnJvdyBkaXJlY3Rpb24gYmFzZWQgb24gY29sbGFwc2Ugc3RhdHVzXG4gICAgbGV0IGdseXBoQ2xhc3MgPSAoXG4gICAgICB0aGlzLnN0YXRlLmNvbGxhcHNlZCA/XG4gICAgICAgICdnbHlwaGljb24gcHVsbC1yaWdodCBnbHlwaGljb24tY2hldnJvbi1kb3duJyA6XG4gICAgICAgICdnbHlwaGljb24gcHVsbC1yaWdodCBnbHlwaGljb24tY2hldnJvbi11cCdcbiAgICApO1xuXG4gICAgLy8gQWRkIHBhbmVsIGhlYWRlciwgaWYgdGl0bGUgaXMgc2V0XG4gICAgY29uc3QgcGFuZWxIZWFkaW5nID0gdGhpcy5wcm9wcy50aXRsZSA/IChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPVwicGFuZWwtaGVhZGluZ1wiXG4gICAgICAgIG9uQ2xpY2s9e3RoaXMudG9nZ2xlQ29sbGFwc2VkfVxuICAgICAgICBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJcbiAgICAgICAgZGF0YS10YXJnZXQ9eycjJyArIHRoaXMucHJvcHMuaWR9XG4gICAgICAgIHN0eWxlPXt7Y3Vyc29yOiAncG9pbnRlcid9fVxuICAgICAgPlxuICAgICAgICB7dGhpcy5wcm9wcy50aXRsZX1cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtnbHlwaENsYXNzfT48L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICApIDogJyc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbCBwYW5lbC1wcmltYXJ5XCI+XG4gICAgICAgIHtwYW5lbEhlYWRpbmd9XG4gICAgICAgIDxkaXYgaWQ9e3RoaXMucHJvcHMuaWR9IGNsYXNzTmFtZT17dGhpcy5wYW5lbENsYXNzfSByb2xlPVwidGFicGFuZWxcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWJvZHlcIiBzdHlsZT17e2hlaWdodDogdGhpcy5wcm9wcy5oZWlnaHR9fT5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuUGFuZWwucHJvcFR5cGVzID0ge1xuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZyxcbn07XG5QYW5lbC5kZWZhdWx0UHJvcHMgPSB7XG4gIGluaXRDb2xsYXBzZWQ6IGZhbHNlLFxuICBpZDogJ2RlZmF1bHQtcGFuZWwnLFxuICBoZWlnaHQ6ICcxMDAlJyxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBhbmVsO1xuIiwiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgTG9hZGVyIGZyb20gJ0xvYWRlcic7XG5pbXBvcnQgRmlsdGVyYWJsZURhdGFUYWJsZSBmcm9tICdGaWx0ZXJhYmxlRGF0YVRhYmxlJztcblxuY2xhc3MgVXNlckFjY291bnRzSW5kZXggZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBkYXRhOiB7fSxcbiAgICAgIGVycm9yOiBmYWxzZSxcbiAgICAgIGlzTG9hZGVkOiBmYWxzZSxcbiAgICB9O1xuXG4gICAgdGhpcy5mZXRjaERhdGEgPSB0aGlzLmZldGNoRGF0YS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZm9ybWF0Q29sdW1uID0gdGhpcy5mb3JtYXRDb2x1bW4uYmluZCh0aGlzKTtcbiAgICB0aGlzLmFkZFVzZXIgPSB0aGlzLmFkZFVzZXIuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuZmV0Y2hEYXRhKClcbiAgICAgIC50aGVuKCgpID0+IHRoaXMuc2V0U3RhdGUoe2lzTG9hZGVkOiB0cnVlfSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGRhdGEgZnJvbSB0aGUgcHJvdmlkZWQgVVJMIGFuZCBzYXZlIGl0IGluIHN0YXRlXG4gICAqIEFkZGl0aW9uYWxseSBhZGQgaGlkZGVuSGVhZGVycyB0byBnbG9iYWwgbG9yaXMgdmFyaWFibGVcbiAgICogZm9yIGVhc3kgYWNjZXNzIGJ5IGNvbHVtbkZvcm1hdHRlci5cbiAgICpcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgZmV0Y2hEYXRhKCkge1xuICAgIHJldHVybiBmZXRjaCh0aGlzLnByb3BzLmRhdGFVUkwsIHtjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ30pXG4gICAgICAudGhlbigocmVzcCkgPT4gcmVzcC5qc29uKCkpXG4gICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAvLyBDb252ZXJ0IGNvbmNhdGVuYXRlZCBzdHJpbmcgb2Ygc2l0ZXMgdG8gYXJyYXlcbiAgICAgICAgZGF0YS5EYXRhID0gZGF0YS5EYXRhLm1hcCgocm93KSA9PiB7XG4gICAgICAgICAgcm93WzBdID0gcm93WzBdLnNwbGl0KCc7ICcpO1xuICAgICAgICAgIHJldHVybiByb3c7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtkYXRhfSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtlcnJvcjogdHJ1ZX0pO1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vZGlmeSBiZWhhdmlvdXIgb2Ygc3BlY2lmaWVkIGNvbHVtbiBjZWxscyBpbiB0aGUgRGF0YSBUYWJsZSBjb21wb25lbnRcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbHVtbiAtIGNvbHVtbiBuYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjZWxsIC0gY2VsbCBjb250ZW50XG4gICAqIEBwYXJhbSB7b2JqZWN0fSByb3cgLSByb3cgY29udGVudCBpbmRleGVkIGJ5IGNvbHVtblxuICAgKlxuICAgKiBAcmV0dXJuIHsqfSBhIGZvcm1hdGVkIHRhYmxlIGNlbGwgZm9yIGEgZ2l2ZW4gY29sdW1uXG4gICAqL1xuICBmb3JtYXRDb2x1bW4oY29sdW1uLCBjZWxsLCByb3cpIHtcbiAgICBsZXQgdXJsO1xuICAgIGxldCByZXN1bHQgPSA8dGQ+e2NlbGx9PC90ZD47XG4gICAgc3dpdGNoIChjb2x1bW4pIHtcbiAgICAgIGNhc2UgJ1NpdGUnOlxuICAgICAgICAvLyBJZiB1c2VyIGhhcyBtdWx0aXBsZSBzaXRlcywgam9pbiBhcnJheSBvZiBzaXRlcyBpbnRvIHN0cmluZ1xuICAgICAgICByZXN1bHQgPSA8dGQ+e2NlbGwuam9pbignOyAnKX08L3RkPjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdVc2VybmFtZSc6XG4gICAgICAgIHVybCA9IGxvcmlzLkJhc2VVUkwgKyAnL3VzZXJfYWNjb3VudHMvZWRpdF91c2VyLycgKyByb3cuVXNlcm5hbWU7XG4gICAgICAgIHJlc3VsdCA9IDx0ZD48YSBocmVmID17dXJsfT57Y2VsbH08L2E+PC90ZD47XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnQWN0aXZlJzpcbiAgICAgICAgaWYgKHJvdy5BY3RpdmUgPT09ICdZJykge1xuICAgICAgICAgIHJlc3VsdCA9IDx0ZD5ZZXM8L3RkPjtcbiAgICAgICAgfSBlbHNlIGlmIChyb3cuQWN0aXZlID09PSAnTicpIHtcbiAgICAgICAgICByZXN1bHQgPSA8dGQ+Tm88L3RkPjtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ1BlbmRpbmcgQXBwcm92YWwnOlxuICAgICAgICBpZiAocm93WydQZW5kaW5nIEFwcHJvdmFsJ10gPT09ICdZJykge1xuICAgICAgICAgIHJlc3VsdCA9IDx0ZD5ZZXM8L3RkPjtcbiAgICAgICAgfSBlbHNlIGlmIChyb3dbJ1BlbmRpbmcgQXBwcm92YWwnXSA9PT0gJ04nKSB7XG4gICAgICAgICAgcmVzdWx0ID0gPHRkPk5vPC90ZD47XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBhZGRVc2VyKCkge1xuICAgIGxvY2F0aW9uLmhyZWY9Jy91c2VyX2FjY291bnRzL2VkaXRfdXNlci8nO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIC8vIElmIGVycm9yIG9jY3VycywgcmV0dXJuIGEgbWVzc2FnZS5cbiAgICAvLyBYWFg6IFJlcGxhY2UgdGhpcyB3aXRoIGEgVUkgY29tcG9uZW50IGZvciA1MDAgZXJyb3JzLlxuICAgIGlmICh0aGlzLnN0YXRlLmVycm9yKSB7XG4gICAgICByZXR1cm4gPGgzPkFuIGVycm9yIG9jY3VyZWQgd2hpbGUgbG9hZGluZyB0aGUgcGFnZS48L2gzPjtcbiAgICB9XG5cbiAgICAvLyBXYWl0aW5nIGZvciBhc3luYyBkYXRhIHRvIGxvYWRcbiAgICBpZiAoIXRoaXMuc3RhdGUuaXNMb2FkZWQpIHtcbiAgICAgIHJldHVybiA8TG9hZGVyLz47XG4gICAgfVxuXG4gICAvKipcbiAgICAqIFhYWDogQ3VycmVudGx5LCB0aGUgb3JkZXIgb2YgdGhlc2UgZmllbGRzIE1VU1QgbWF0Y2ggdGhlIG9yZGVyIG9mIHRoZVxuICAgICogcXVlcmllZCBjb2x1bW5zIGluIF9zZXR1cFZhcmlhYmxlcygpIGluIHVzZXJBY2NvdW50cy5jbGFzcy5pbmNcbiAgICAqL1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLnN0YXRlLmRhdGEuZmllbGRPcHRpb25zO1xuICAgIGNvbnN0IGZpZWxkcyA9IFtcbiAgICAgIHtsYWJlbDogJ1NpdGUnLCBzaG93OiB0cnVlLCBmaWx0ZXI6IHtcbiAgICAgICAgbmFtZTogJ3NpdGUnLFxuICAgICAgICB0eXBlOiAnc2VsZWN0JyxcbiAgICAgICAgb3B0aW9uczogb3B0aW9ucy5zaXRlcyxcbiAgICAgIH19LFxuICAgICAge2xhYmVsOiAnVXNlcm5hbWUnLCBzaG93OiB0cnVlLCBmaWx0ZXI6IHtcbiAgICAgICAgbmFtZTogJ3VzZXJuYW1lJyxcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgfX0sXG4gICAgICB7bGFiZWw6ICdGdWxsIE5hbWUnLCBzaG93OiB0cnVlLCBmaWx0ZXI6IHtcbiAgICAgICAgbmFtZTogJ2Z1bGxOYW1lJyxcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgfX0sXG4gICAgICB7bGFiZWw6ICdFbWFpbCcsIHNob3c6IHRydWUsIGZpbHRlcjoge1xuICAgICAgICBuYW1lOiAnZW1haWwnLFxuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICB9fSxcbiAgICAgIHtsYWJlbDogJ0FjdGl2ZScsIHNob3c6IHRydWUsIGZpbHRlcjoge1xuICAgICAgICBuYW1lOiAnYWN0aXZlJyxcbiAgICAgICAgdHlwZTogJ3NlbGVjdCcsXG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnMuYWN0aXZlcyxcbiAgICAgIH19LFxuICAgICAge2xhYmVsOiAnUGVuZGluZyBBcHByb3ZhbCcsIHNob3c6IHRydWUsIGZpbHRlcjoge1xuICAgICAgICBuYW1lOiAncGVuZGluZ0FwcHJvdmFsJyxcbiAgICAgICAgdHlwZTogJ3NlbGVjdCcsXG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnMucGVuZGluZ0FwcHJvdmFscyxcbiAgICAgIH19LFxuICAgIF07XG4gICAgY29uc3QgYWN0aW9ucyA9IFtcbiAgICAgIHtsYWJlbDogJ0FkZCBVc2VyJywgYWN0aW9uOiB0aGlzLmFkZFVzZXJ9LFxuICAgIF07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZpbHRlcmFibGVEYXRhVGFibGVcbiAgICAgICAgbmFtZT1cInVzZXJBY2NvdW50c1wiXG4gICAgICAgIHRpdGxlPSdVc2VyIEFjY291bnRzJ1xuICAgICAgICBkYXRhPXt0aGlzLnN0YXRlLmRhdGEuRGF0YX1cbiAgICAgICAgZmllbGRzPXtmaWVsZHN9XG4gICAgICAgIGdldEZvcm1hdHRlZENlbGw9e3RoaXMuZm9ybWF0Q29sdW1ufVxuICAgICAgICBhY3Rpb25zPXthY3Rpb25zfVxuICAgICAgLz5cbiAgICApO1xuICB9XG59XG5cblVzZXJBY2NvdW50c0luZGV4LnByb3BUeXBlcyA9IHtcbiAgZGF0YVVSTDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBoYXNQZXJtaXNzaW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxufTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gIFJlYWN0RE9NLnJlbmRlcihcbiAgICA8VXNlckFjY291bnRzSW5kZXhcbiAgICAgIGRhdGFVUkw9e2Ake2xvcmlzLkJhc2VVUkx9L3VzZXJfYWNjb3VudHMvP2Zvcm1hdD1qc29uYH1cbiAgICAgIGhhc1Blcm1pc3Npb249e2xvcmlzLnVzZXJIYXNQZXJtaXNzaW9ufVxuICAgIC8+LFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb3Jpc3dvcmtzcGFjZScpXG4gICk7XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIFxuICovXG5cbmZ1bmN0aW9uIG1ha2VFbXB0eUZ1bmN0aW9uKGFyZykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBhcmc7XG4gIH07XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBhY2NlcHRzIGFuZCBkaXNjYXJkcyBpbnB1dHM7IGl0IGhhcyBubyBzaWRlIGVmZmVjdHMuIFRoaXMgaXNcbiAqIHByaW1hcmlseSB1c2VmdWwgaWRpb21hdGljYWxseSBmb3Igb3ZlcnJpZGFibGUgZnVuY3Rpb24gZW5kcG9pbnRzIHdoaWNoXG4gKiBhbHdheXMgbmVlZCB0byBiZSBjYWxsYWJsZSwgc2luY2UgSlMgbGFja3MgYSBudWxsLWNhbGwgaWRpb20gYWxhIENvY29hLlxuICovXG52YXIgZW1wdHlGdW5jdGlvbiA9IGZ1bmN0aW9uIGVtcHR5RnVuY3Rpb24oKSB7fTtcblxuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJucyA9IG1ha2VFbXB0eUZ1bmN0aW9uO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc0ZhbHNlID0gbWFrZUVtcHR5RnVuY3Rpb24oZmFsc2UpO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc1RydWUgPSBtYWtlRW1wdHlGdW5jdGlvbih0cnVlKTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsID0gbWFrZUVtcHR5RnVuY3Rpb24obnVsbCk7XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zVGhpcyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXM7XG59O1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc0FyZ3VtZW50ID0gZnVuY3Rpb24gKGFyZykge1xuICByZXR1cm4gYXJnO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBlbXB0eUZ1bmN0aW9uOyIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIHZhbGlkYXRlRm9ybWF0ID0gZnVuY3Rpb24gdmFsaWRhdGVGb3JtYXQoZm9ybWF0KSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFsaWRhdGVGb3JtYXQgPSBmdW5jdGlvbiB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGludmFyaWFudChjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpO1xuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgKyAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KSk7XG4gICAgICBlcnJvci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9lbXB0eUZ1bmN0aW9uJyk7XG5cbi8qKlxuICogU2ltaWxhciB0byBpbnZhcmlhbnQgYnV0IG9ubHkgbG9ncyBhIHdhcm5pbmcgaWYgdGhlIGNvbmRpdGlvbiBpcyBub3QgbWV0LlxuICogVGhpcyBjYW4gYmUgdXNlZCB0byBsb2cgaXNzdWVzIGluIGRldmVsb3BtZW50IGVudmlyb25tZW50cyBpbiBjcml0aWNhbFxuICogcGF0aHMuIFJlbW92aW5nIHRoZSBsb2dnaW5nIGNvZGUgZm9yIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRzIHdpbGwga2VlcCB0aGVcbiAqIHNhbWUgbG9naWMgYW5kIGZvbGxvdyB0aGUgc2FtZSBjb2RlIHBhdGhzLlxuICovXG5cbnZhciB3YXJuaW5nID0gZW1wdHlGdW5jdGlvbjtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIHByaW50V2FybmluZyA9IGZ1bmN0aW9uIHByaW50V2FybmluZyhmb3JtYXQpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgdmFyIG1lc3NhZ2UgPSAnV2FybmluZzogJyArIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gYXJnc1thcmdJbmRleCsrXTtcbiAgICB9KTtcbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9IGNhdGNoICh4KSB7fVxuICB9O1xuXG4gIHdhcm5pbmcgPSBmdW5jdGlvbiB3YXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0KSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2B3YXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0LCAuLi5hcmdzKWAgcmVxdWlyZXMgYSB3YXJuaW5nICcgKyAnbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cblxuICAgIGlmIChmb3JtYXQuaW5kZXhPZignRmFpbGVkIENvbXBvc2l0ZSBwcm9wVHlwZTogJykgPT09IDApIHtcbiAgICAgIHJldHVybjsgLy8gSWdub3JlIENvbXBvc2l0ZUNvbXBvbmVudCBwcm9wdHlwZSBjaGVjay5cbiAgICB9XG5cbiAgICBpZiAoIWNvbmRpdGlvbikge1xuICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAyID8gX2xlbjIgLSAyIDogMCksIF9rZXkyID0gMjsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICBhcmdzW19rZXkyIC0gMl0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgfVxuXG4gICAgICBwcmludFdhcm5pbmcuYXBwbHkodW5kZWZpbmVkLCBbZm9ybWF0XS5jb25jYXQoYXJncykpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3YXJuaW5nOyIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHByaW50V2FybmluZyA9IGZ1bmN0aW9uKCkge307XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG4gIHZhciBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcblxuICBwcmludFdhcm5pbmcgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgdmFyIG1lc3NhZ2UgPSAnV2FybmluZzogJyArIHRleHQ7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoeCkge31cbiAgfTtcbn1cblxuLyoqXG4gKiBBc3NlcnQgdGhhdCB0aGUgdmFsdWVzIG1hdGNoIHdpdGggdGhlIHR5cGUgc3BlY3MuXG4gKiBFcnJvciBtZXNzYWdlcyBhcmUgbWVtb3JpemVkIGFuZCB3aWxsIG9ubHkgYmUgc2hvd24gb25jZS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gdHlwZVNwZWNzIE1hcCBvZiBuYW1lIHRvIGEgUmVhY3RQcm9wVHlwZVxuICogQHBhcmFtIHtvYmplY3R9IHZhbHVlcyBSdW50aW1lIHZhbHVlcyB0aGF0IG5lZWQgdG8gYmUgdHlwZS1jaGVja2VkXG4gKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gZS5nLiBcInByb3BcIiwgXCJjb250ZXh0XCIsIFwiY2hpbGQgY29udGV4dFwiXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tcG9uZW50TmFtZSBOYW1lIG9mIHRoZSBjb21wb25lbnQgZm9yIGVycm9yIG1lc3NhZ2VzLlxuICogQHBhcmFtIHs/RnVuY3Rpb259IGdldFN0YWNrIFJldHVybnMgdGhlIGNvbXBvbmVudCBzdGFjay5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGNoZWNrUHJvcFR5cGVzKHR5cGVTcGVjcywgdmFsdWVzLCBsb2NhdGlvbiwgY29tcG9uZW50TmFtZSwgZ2V0U3RhY2spIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBmb3IgKHZhciB0eXBlU3BlY05hbWUgaW4gdHlwZVNwZWNzKSB7XG4gICAgICBpZiAodHlwZVNwZWNzLmhhc093blByb3BlcnR5KHR5cGVTcGVjTmFtZSkpIHtcbiAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAvLyBQcm9wIHR5cGUgdmFsaWRhdGlvbiBtYXkgdGhyb3cuIEluIGNhc2UgdGhleSBkbywgd2UgZG9uJ3Qgd2FudCB0b1xuICAgICAgICAvLyBmYWlsIHRoZSByZW5kZXIgcGhhc2Ugd2hlcmUgaXQgZGlkbid0IGZhaWwgYmVmb3JlLiBTbyB3ZSBsb2cgaXQuXG4gICAgICAgIC8vIEFmdGVyIHRoZXNlIGhhdmUgYmVlbiBjbGVhbmVkIHVwLCB3ZSdsbCBsZXQgdGhlbSB0aHJvdy5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBUaGlzIGlzIGludGVudGlvbmFsbHkgYW4gaW52YXJpYW50IHRoYXQgZ2V0cyBjYXVnaHQuIEl0J3MgdGhlIHNhbWVcbiAgICAgICAgICAvLyBiZWhhdmlvciBhcyB3aXRob3V0IHRoaXMgc3RhdGVtZW50IGV4Y2VwdCB3aXRoIGEgYmV0dGVyIG1lc3NhZ2UuXG4gICAgICAgICAgaWYgKHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFyIGVyciA9IEVycm9yKFxuICAgICAgICAgICAgICAoY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnKSArICc6ICcgKyBsb2NhdGlvbiArICcgdHlwZSBgJyArIHR5cGVTcGVjTmFtZSArICdgIGlzIGludmFsaWQ7ICcgK1xuICAgICAgICAgICAgICAnaXQgbXVzdCBiZSBhIGZ1bmN0aW9uLCB1c3VhbGx5IGZyb20gdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLCBidXQgcmVjZWl2ZWQgYCcgKyB0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gKyAnYC4nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZXJyLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVycm9yID0gdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0odmFsdWVzLCB0eXBlU3BlY05hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBudWxsLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgZXJyb3IgPSBleDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3IgJiYgIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkge1xuICAgICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAgIChjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycpICsgJzogdHlwZSBzcGVjaWZpY2F0aW9uIG9mICcgK1xuICAgICAgICAgICAgbG9jYXRpb24gKyAnIGAnICsgdHlwZVNwZWNOYW1lICsgJ2AgaXMgaW52YWxpZDsgdGhlIHR5cGUgY2hlY2tlciAnICtcbiAgICAgICAgICAgICdmdW5jdGlvbiBtdXN0IHJldHVybiBgbnVsbGAgb3IgYW4gYEVycm9yYCBidXQgcmV0dXJuZWQgYSAnICsgdHlwZW9mIGVycm9yICsgJy4gJyArXG4gICAgICAgICAgICAnWW91IG1heSBoYXZlIGZvcmdvdHRlbiB0byBwYXNzIGFuIGFyZ3VtZW50IHRvIHRoZSB0eXBlIGNoZWNrZXIgJyArXG4gICAgICAgICAgICAnY3JlYXRvciAoYXJyYXlPZiwgaW5zdGFuY2VPZiwgb2JqZWN0T2YsIG9uZU9mLCBvbmVPZlR5cGUsIGFuZCAnICtcbiAgICAgICAgICAgICdzaGFwZSBhbGwgcmVxdWlyZSBhbiBhcmd1bWVudCkuJ1xuICAgICAgICAgIClcblxuICAgICAgICB9XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yICYmICEoZXJyb3IubWVzc2FnZSBpbiBsb2dnZWRUeXBlRmFpbHVyZXMpKSB7XG4gICAgICAgICAgLy8gT25seSBtb25pdG9yIHRoaXMgZmFpbHVyZSBvbmNlIGJlY2F1c2UgdGhlcmUgdGVuZHMgdG8gYmUgYSBsb3Qgb2YgdGhlXG4gICAgICAgICAgLy8gc2FtZSBlcnJvci5cbiAgICAgICAgICBsb2dnZWRUeXBlRmFpbHVyZXNbZXJyb3IubWVzc2FnZV0gPSB0cnVlO1xuXG4gICAgICAgICAgdmFyIHN0YWNrID0gZ2V0U3RhY2sgPyBnZXRTdGFjaygpIDogJyc7XG5cbiAgICAgICAgICBwcmludFdhcm5pbmcoXG4gICAgICAgICAgICAnRmFpbGVkICcgKyBsb2NhdGlvbiArICcgdHlwZTogJyArIGVycm9yLm1lc3NhZ2UgKyAoc3RhY2sgIT0gbnVsbCA/IHN0YWNrIDogJycpXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNoZWNrUHJvcFR5cGVzO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5cbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG52YXIgY2hlY2tQcm9wVHlwZXMgPSByZXF1aXJlKCcuL2NoZWNrUHJvcFR5cGVzJyk7XG5cbnZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbigpIHt9O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBwcmludFdhcm5pbmcgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgdmFyIG1lc3NhZ2UgPSAnV2FybmluZzogJyArIHRleHQ7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoeCkge31cbiAgfTtcbn1cblxuZnVuY3Rpb24gZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbCgpIHtcbiAgcmV0dXJuIG51bGw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXNWYWxpZEVsZW1lbnQsIHRocm93T25EaXJlY3RBY2Nlc3MpIHtcbiAgLyogZ2xvYmFsIFN5bWJvbCAqL1xuICB2YXIgSVRFUkFUT1JfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuaXRlcmF0b3I7XG4gIHZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9ICdAQGl0ZXJhdG9yJzsgLy8gQmVmb3JlIFN5bWJvbCBzcGVjLlxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpdGVyYXRvciBtZXRob2QgZnVuY3Rpb24gY29udGFpbmVkIG9uIHRoZSBpdGVyYWJsZSBvYmplY3QuXG4gICAqXG4gICAqIEJlIHN1cmUgdG8gaW52b2tlIHRoZSBmdW5jdGlvbiB3aXRoIHRoZSBpdGVyYWJsZSBhcyBjb250ZXh0OlxuICAgKlxuICAgKiAgICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKG15SXRlcmFibGUpO1xuICAgKiAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICogICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKG15SXRlcmFibGUpO1xuICAgKiAgICAgICAuLi5cbiAgICogICAgIH1cbiAgICpcbiAgICogQHBhcmFtIHs/b2JqZWN0fSBtYXliZUl0ZXJhYmxlXG4gICAqIEByZXR1cm4gez9mdW5jdGlvbn1cbiAgICovXG4gIGZ1bmN0aW9uIGdldEl0ZXJhdG9yRm4obWF5YmVJdGVyYWJsZSkge1xuICAgIHZhciBpdGVyYXRvckZuID0gbWF5YmVJdGVyYWJsZSAmJiAoSVRFUkFUT1JfU1lNQk9MICYmIG1heWJlSXRlcmFibGVbSVRFUkFUT1JfU1lNQk9MXSB8fCBtYXliZUl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXSk7XG4gICAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3JGbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29sbGVjdGlvbiBvZiBtZXRob2RzIHRoYXQgYWxsb3cgZGVjbGFyYXRpb24gYW5kIHZhbGlkYXRpb24gb2YgcHJvcHMgdGhhdCBhcmVcbiAgICogc3VwcGxpZWQgdG8gUmVhY3QgY29tcG9uZW50cy4gRXhhbXBsZSB1c2FnZTpcbiAgICpcbiAgICogICB2YXIgUHJvcHMgPSByZXF1aXJlKCdSZWFjdFByb3BUeXBlcycpO1xuICAgKiAgIHZhciBNeUFydGljbGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAqICAgICBwcm9wVHlwZXM6IHtcbiAgICogICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIHByb3AgbmFtZWQgXCJkZXNjcmlwdGlvblwiLlxuICAgKiAgICAgICBkZXNjcmlwdGlvbjogUHJvcHMuc3RyaW5nLFxuICAgKlxuICAgKiAgICAgICAvLyBBIHJlcXVpcmVkIGVudW0gcHJvcCBuYW1lZCBcImNhdGVnb3J5XCIuXG4gICAqICAgICAgIGNhdGVnb3J5OiBQcm9wcy5vbmVPZihbJ05ld3MnLCdQaG90b3MnXSkuaXNSZXF1aXJlZCxcbiAgICpcbiAgICogICAgICAgLy8gQSBwcm9wIG5hbWVkIFwiZGlhbG9nXCIgdGhhdCByZXF1aXJlcyBhbiBpbnN0YW5jZSBvZiBEaWFsb2cuXG4gICAqICAgICAgIGRpYWxvZzogUHJvcHMuaW5zdGFuY2VPZihEaWFsb2cpLmlzUmVxdWlyZWRcbiAgICogICAgIH0sXG4gICAqICAgICByZW5kZXI6IGZ1bmN0aW9uKCkgeyAuLi4gfVxuICAgKiAgIH0pO1xuICAgKlxuICAgKiBBIG1vcmUgZm9ybWFsIHNwZWNpZmljYXRpb24gb2YgaG93IHRoZXNlIG1ldGhvZHMgYXJlIHVzZWQ6XG4gICAqXG4gICAqICAgdHlwZSA6PSBhcnJheXxib29sfGZ1bmN8b2JqZWN0fG51bWJlcnxzdHJpbmd8b25lT2YoWy4uLl0pfGluc3RhbmNlT2YoLi4uKVxuICAgKiAgIGRlY2wgOj0gUmVhY3RQcm9wVHlwZXMue3R5cGV9KC5pc1JlcXVpcmVkKT9cbiAgICpcbiAgICogRWFjaCBhbmQgZXZlcnkgZGVjbGFyYXRpb24gcHJvZHVjZXMgYSBmdW5jdGlvbiB3aXRoIHRoZSBzYW1lIHNpZ25hdHVyZS4gVGhpc1xuICAgKiBhbGxvd3MgdGhlIGNyZWF0aW9uIG9mIGN1c3RvbSB2YWxpZGF0aW9uIGZ1bmN0aW9ucy4gRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqICB2YXIgTXlMaW5rID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgKiAgICBwcm9wVHlwZXM6IHtcbiAgICogICAgICAvLyBBbiBvcHRpb25hbCBzdHJpbmcgb3IgVVJJIHByb3AgbmFtZWQgXCJocmVmXCIuXG4gICAqICAgICAgaHJlZjogZnVuY3Rpb24ocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lKSB7XG4gICAqICAgICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgKiAgICAgICAgaWYgKHByb3BWYWx1ZSAhPSBudWxsICYmIHR5cGVvZiBwcm9wVmFsdWUgIT09ICdzdHJpbmcnICYmXG4gICAqICAgICAgICAgICAgIShwcm9wVmFsdWUgaW5zdGFuY2VvZiBVUkkpKSB7XG4gICAqICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXG4gICAqICAgICAgICAgICAgJ0V4cGVjdGVkIGEgc3RyaW5nIG9yIGFuIFVSSSBmb3IgJyArIHByb3BOYW1lICsgJyBpbiAnICtcbiAgICogICAgICAgICAgICBjb21wb25lbnROYW1lXG4gICAqICAgICAgICAgICk7XG4gICAqICAgICAgICB9XG4gICAqICAgICAgfVxuICAgKiAgICB9LFxuICAgKiAgICByZW5kZXI6IGZ1bmN0aW9uKCkgey4uLn1cbiAgICogIH0pO1xuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG5cbiAgdmFyIEFOT05ZTU9VUyA9ICc8PGFub255bW91cz4+JztcblxuICAvLyBJbXBvcnRhbnQhXG4gIC8vIEtlZXAgdGhpcyBsaXN0IGluIHN5bmMgd2l0aCBwcm9kdWN0aW9uIHZlcnNpb24gaW4gYC4vZmFjdG9yeVdpdGhUaHJvd2luZ1NoaW1zLmpzYC5cbiAgdmFyIFJlYWN0UHJvcFR5cGVzID0ge1xuICAgIGFycmF5OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignYXJyYXknKSxcbiAgICBib29sOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignYm9vbGVhbicpLFxuICAgIGZ1bmM6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdmdW5jdGlvbicpLFxuICAgIG51bWJlcjogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ251bWJlcicpLFxuICAgIG9iamVjdDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ29iamVjdCcpLFxuICAgIHN0cmluZzogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ3N0cmluZycpLFxuICAgIHN5bWJvbDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ3N5bWJvbCcpLFxuXG4gICAgYW55OiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpLFxuICAgIGFycmF5T2Y6IGNyZWF0ZUFycmF5T2ZUeXBlQ2hlY2tlcixcbiAgICBlbGVtZW50OiBjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIoKSxcbiAgICBpbnN0YW5jZU9mOiBjcmVhdGVJbnN0YW5jZVR5cGVDaGVja2VyLFxuICAgIG5vZGU6IGNyZWF0ZU5vZGVDaGVja2VyKCksXG4gICAgb2JqZWN0T2Y6IGNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIsXG4gICAgb25lT2Y6IGNyZWF0ZUVudW1UeXBlQ2hlY2tlcixcbiAgICBvbmVPZlR5cGU6IGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIsXG4gICAgc2hhcGU6IGNyZWF0ZVNoYXBlVHlwZUNoZWNrZXIsXG4gICAgZXhhY3Q6IGNyZWF0ZVN0cmljdFNoYXBlVHlwZUNoZWNrZXIsXG4gIH07XG5cbiAgLyoqXG4gICAqIGlubGluZWQgT2JqZWN0LmlzIHBvbHlmaWxsIHRvIGF2b2lkIHJlcXVpcmluZyBjb25zdW1lcnMgc2hpcCB0aGVpciBvd25cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2lzXG4gICAqL1xuICAvKmVzbGludC1kaXNhYmxlIG5vLXNlbGYtY29tcGFyZSovXG4gIGZ1bmN0aW9uIGlzKHgsIHkpIHtcbiAgICAvLyBTYW1lVmFsdWUgYWxnb3JpdGhtXG4gICAgaWYgKHggPT09IHkpIHtcbiAgICAgIC8vIFN0ZXBzIDEtNSwgNy0xMFxuICAgICAgLy8gU3RlcHMgNi5iLTYuZTogKzAgIT0gLTBcbiAgICAgIHJldHVybiB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU3RlcCA2LmE6IE5hTiA9PSBOYU5cbiAgICAgIHJldHVybiB4ICE9PSB4ICYmIHkgIT09IHk7XG4gICAgfVxuICB9XG4gIC8qZXNsaW50LWVuYWJsZSBuby1zZWxmLWNvbXBhcmUqL1xuXG4gIC8qKlxuICAgKiBXZSB1c2UgYW4gRXJyb3ItbGlrZSBvYmplY3QgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgYXMgcGVvcGxlIG1heSBjYWxsXG4gICAqIFByb3BUeXBlcyBkaXJlY3RseSBhbmQgaW5zcGVjdCB0aGVpciBvdXRwdXQuIEhvd2V2ZXIsIHdlIGRvbid0IHVzZSByZWFsXG4gICAqIEVycm9ycyBhbnltb3JlLiBXZSBkb24ndCBpbnNwZWN0IHRoZWlyIHN0YWNrIGFueXdheSwgYW5kIGNyZWF0aW5nIHRoZW1cbiAgICogaXMgcHJvaGliaXRpdmVseSBleHBlbnNpdmUgaWYgdGhleSBhcmUgY3JlYXRlZCB0b28gb2Z0ZW4sIHN1Y2ggYXMgd2hhdFxuICAgKiBoYXBwZW5zIGluIG9uZU9mVHlwZSgpIGZvciBhbnkgdHlwZSBiZWZvcmUgdGhlIG9uZSB0aGF0IG1hdGNoZWQuXG4gICAqL1xuICBmdW5jdGlvbiBQcm9wVHlwZUVycm9yKG1lc3NhZ2UpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHRoaXMuc3RhY2sgPSAnJztcbiAgfVxuICAvLyBNYWtlIGBpbnN0YW5jZW9mIEVycm9yYCBzdGlsbCB3b3JrIGZvciByZXR1cm5lZCBlcnJvcnMuXG4gIFByb3BUeXBlRXJyb3IucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHZhciBtYW51YWxQcm9wVHlwZUNhbGxDYWNoZSA9IHt9O1xuICAgICAgdmFyIG1hbnVhbFByb3BUeXBlV2FybmluZ0NvdW50ID0gMDtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2hlY2tUeXBlKGlzUmVxdWlyZWQsIHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgc2VjcmV0KSB7XG4gICAgICBjb21wb25lbnROYW1lID0gY29tcG9uZW50TmFtZSB8fCBBTk9OWU1PVVM7XG4gICAgICBwcm9wRnVsbE5hbWUgPSBwcm9wRnVsbE5hbWUgfHwgcHJvcE5hbWU7XG5cbiAgICAgIGlmIChzZWNyZXQgIT09IFJlYWN0UHJvcFR5cGVzU2VjcmV0KSB7XG4gICAgICAgIGlmICh0aHJvd09uRGlyZWN0QWNjZXNzKSB7XG4gICAgICAgICAgLy8gTmV3IGJlaGF2aW9yIG9ubHkgZm9yIHVzZXJzIG9mIGBwcm9wLXR5cGVzYCBwYWNrYWdlXG4gICAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcihcbiAgICAgICAgICAgICdDYWxsaW5nIFByb3BUeXBlcyB2YWxpZGF0b3JzIGRpcmVjdGx5IGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLiAnICtcbiAgICAgICAgICAgICdVc2UgYFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcygpYCB0byBjYWxsIHRoZW0uICcgK1xuICAgICAgICAgICAgJ1JlYWQgbW9yZSBhdCBodHRwOi8vZmIubWUvdXNlLWNoZWNrLXByb3AtdHlwZXMnXG4gICAgICAgICAgKTtcbiAgICAgICAgICBlcnIubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAvLyBPbGQgYmVoYXZpb3IgZm9yIHBlb3BsZSB1c2luZyBSZWFjdC5Qcm9wVHlwZXNcbiAgICAgICAgICB2YXIgY2FjaGVLZXkgPSBjb21wb25lbnROYW1lICsgJzonICsgcHJvcE5hbWU7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIW1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSAmJlxuICAgICAgICAgICAgLy8gQXZvaWQgc3BhbW1pbmcgdGhlIGNvbnNvbGUgYmVjYXVzZSB0aGV5IGFyZSBvZnRlbiBub3QgYWN0aW9uYWJsZSBleGNlcHQgZm9yIGxpYiBhdXRob3JzXG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCA8IDNcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAgICAgJ1lvdSBhcmUgbWFudWFsbHkgY2FsbGluZyBhIFJlYWN0LlByb3BUeXBlcyB2YWxpZGF0aW9uICcgK1xuICAgICAgICAgICAgICAnZnVuY3Rpb24gZm9yIHRoZSBgJyArIHByb3BGdWxsTmFtZSArICdgIHByb3Agb24gYCcgKyBjb21wb25lbnROYW1lICArICdgLiBUaGlzIGlzIGRlcHJlY2F0ZWQgJyArXG4gICAgICAgICAgICAgICdhbmQgd2lsbCB0aHJvdyBpbiB0aGUgc3RhbmRhbG9uZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gJyArXG4gICAgICAgICAgICAgICdZb3UgbWF5IGJlIHNlZWluZyB0aGlzIHdhcm5pbmcgZHVlIHRvIGEgdGhpcmQtcGFydHkgUHJvcFR5cGVzICcgK1xuICAgICAgICAgICAgICAnbGlicmFyeS4gU2VlIGh0dHBzOi8vZmIubWUvcmVhY3Qtd2FybmluZy1kb250LWNhbGwtcHJvcHR5cGVzICcgKyAnZm9yIGRldGFpbHMuJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSA9IHRydWU7XG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PSBudWxsKSB7XG4gICAgICAgIGlmIChpc1JlcXVpcmVkKSB7XG4gICAgICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdUaGUgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGlzIG1hcmtlZCBhcyByZXF1aXJlZCAnICsgKCdpbiBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgYnV0IGl0cyB2YWx1ZSBpcyBgbnVsbGAuJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1RoZSAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2AgaXMgbWFya2VkIGFzIHJlcXVpcmVkIGluICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLCBidXQgaXRzIHZhbHVlIGlzIGB1bmRlZmluZWRgLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjaGFpbmVkQ2hlY2tUeXBlID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgZmFsc2UpO1xuICAgIGNoYWluZWRDaGVja1R5cGUuaXNSZXF1aXJlZCA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIHRydWUpO1xuXG4gICAgcmV0dXJuIGNoYWluZWRDaGVja1R5cGU7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcihleHBlY3RlZFR5cGUpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09IGV4cGVjdGVkVHlwZSkge1xuICAgICAgICAvLyBgcHJvcFZhbHVlYCBiZWluZyBpbnN0YW5jZSBvZiwgc2F5LCBkYXRlL3JlZ2V4cCwgcGFzcyB0aGUgJ29iamVjdCdcbiAgICAgICAgLy8gY2hlY2ssIGJ1dCB3ZSBjYW4gb2ZmZXIgYSBtb3JlIHByZWNpc2UgZXJyb3IgbWVzc2FnZSBoZXJlIHJhdGhlciB0aGFuXG4gICAgICAgIC8vICdvZiB0eXBlIGBvYmplY3RgJy5cbiAgICAgICAgdmFyIHByZWNpc2VUeXBlID0gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcmVjaXNlVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnYCcgKyBleHBlY3RlZFR5cGUgKyAnYC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFueVR5cGVDaGVja2VyKCkge1xuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcihlbXB0eUZ1bmN0aW9uVGhhdFJldHVybnNOdWxsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFycmF5T2ZUeXBlQ2hlY2tlcih0eXBlQ2hlY2tlcikge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiB0eXBlQ2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1Byb3BlcnR5IGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgY29tcG9uZW50IGAnICsgY29tcG9uZW50TmFtZSArICdgIGhhcyBpbnZhbGlkIFByb3BUeXBlIG5vdGF0aW9uIGluc2lkZSBhcnJheU9mLicpO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIGFycmF5LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcFZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwgaSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICdbJyArIGkgKyAnXScsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIHNpbmdsZSBSZWFjdEVsZW1lbnQuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVJbnN0YW5jZVR5cGVDaGVja2VyKGV4cGVjdGVkQ2xhc3MpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICghKHByb3BzW3Byb3BOYW1lXSBpbnN0YW5jZW9mIGV4cGVjdGVkQ2xhc3MpKSB7XG4gICAgICAgIHZhciBleHBlY3RlZENsYXNzTmFtZSA9IGV4cGVjdGVkQ2xhc3MubmFtZSB8fCBBTk9OWU1PVVM7XG4gICAgICAgIHZhciBhY3R1YWxDbGFzc05hbWUgPSBnZXRDbGFzc05hbWUocHJvcHNbcHJvcE5hbWVdKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgYWN0dWFsQ2xhc3NOYW1lICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkICcpICsgKCdpbnN0YW5jZSBvZiBgJyArIGV4cGVjdGVkQ2xhc3NOYW1lICsgJ2AuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbnVtVHlwZUNoZWNrZXIoZXhwZWN0ZWRWYWx1ZXMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZXhwZWN0ZWRWYWx1ZXMpKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gcHJpbnRXYXJuaW5nKCdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKSA6IHZvaWQgMDtcbiAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uVGhhdFJldHVybnNOdWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXhwZWN0ZWRWYWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGlzKHByb3BWYWx1ZSwgZXhwZWN0ZWRWYWx1ZXNbaV0pKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIHZhbHVlc1N0cmluZyA9IEpTT04uc3RyaW5naWZ5KGV4cGVjdGVkVmFsdWVzKTtcbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdmFsdWUgYCcgKyBwcm9wVmFsdWUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgb25lIG9mICcgKyB2YWx1ZXNTdHJpbmcgKyAnLicpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdQcm9wZXJ0eSBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBoYXMgaW52YWxpZCBQcm9wVHlwZSBub3RhdGlvbiBpbnNpZGUgb2JqZWN0T2YuJyk7XG4gICAgICB9XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYW4gb2JqZWN0LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wVmFsdWUpIHtcbiAgICAgICAgaWYgKHByb3BWYWx1ZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgdmFyIGVycm9yID0gdHlwZUNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVVbmlvblR5cGVDaGVja2VyKGFycmF5T2ZUeXBlQ2hlY2tlcnMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyYXlPZlR5cGVDaGVja2VycykpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBwcmludFdhcm5pbmcoJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2ZUeXBlLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKSA6IHZvaWQgMDtcbiAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uVGhhdFJldHVybnNOdWxsO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlPZlR5cGVDaGVja2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoZWNrZXIgPSBhcnJheU9mVHlwZUNoZWNrZXJzW2ldO1xuICAgICAgaWYgKHR5cGVvZiBjaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAnSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZlR5cGUuIEV4cGVjdGVkIGFuIGFycmF5IG9mIGNoZWNrIGZ1bmN0aW9ucywgYnV0ICcgK1xuICAgICAgICAgICdyZWNlaXZlZCAnICsgZ2V0UG9zdGZpeEZvclR5cGVXYXJuaW5nKGNoZWNrZXIpICsgJyBhdCBpbmRleCAnICsgaSArICcuJ1xuICAgICAgICApO1xuICAgICAgICByZXR1cm4gZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlPZlR5cGVDaGVja2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hlY2tlciA9IGFycmF5T2ZUeXBlQ2hlY2tlcnNbaV07XG4gICAgICAgIGlmIChjaGVja2VyKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHN1cHBsaWVkIHRvICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLicpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU5vZGVDaGVja2VyKCkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKCFpc05vZGUocHJvcHNbcHJvcE5hbWVdKSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHN1cHBsaWVkIHRvICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIFJlYWN0Tm9kZS4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVNoYXBlVHlwZUNoZWNrZXIoc2hhcGVUeXBlcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSBgJyArIHByb3BUeXBlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGBvYmplY3RgLicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGtleSBpbiBzaGFwZVR5cGVzKSB7XG4gICAgICAgIHZhciBjaGVja2VyID0gc2hhcGVUeXBlc1trZXldO1xuICAgICAgICBpZiAoIWNoZWNrZXIpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZXJyb3IgPSBjaGVja2VyKHByb3BWYWx1ZSwga2V5LCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJy4nICsga2V5LCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVTdHJpY3RTaGFwZVR5cGVDaGVja2VyKHNoYXBlVHlwZXMpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgYCcgKyBwcm9wVHlwZSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBgb2JqZWN0YC4nKSk7XG4gICAgICB9XG4gICAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIGFsbCBrZXlzIGluIGNhc2Ugc29tZSBhcmUgcmVxdWlyZWQgYnV0IG1pc3NpbmcgZnJvbVxuICAgICAgLy8gcHJvcHMuXG4gICAgICB2YXIgYWxsS2V5cyA9IGFzc2lnbih7fSwgcHJvcHNbcHJvcE5hbWVdLCBzaGFwZVR5cGVzKTtcbiAgICAgIGZvciAodmFyIGtleSBpbiBhbGxLZXlzKSB7XG4gICAgICAgIHZhciBjaGVja2VyID0gc2hhcGVUeXBlc1trZXldO1xuICAgICAgICBpZiAoIWNoZWNrZXIpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoXG4gICAgICAgICAgICAnSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Aga2V5IGAnICsga2V5ICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AuJyArXG4gICAgICAgICAgICAnXFxuQmFkIG9iamVjdDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BzW3Byb3BOYW1lXSwgbnVsbCwgJyAgJykgK1xuICAgICAgICAgICAgJ1xcblZhbGlkIGtleXM6ICcgKyAgSlNPTi5zdHJpbmdpZnkoT2JqZWN0LmtleXMoc2hhcGVUeXBlcyksIG51bGwsICcgICcpXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZXJyb3IgPSBjaGVja2VyKHByb3BWYWx1ZSwga2V5LCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJy4nICsga2V5LCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzTm9kZShwcm9wVmFsdWUpIHtcbiAgICBzd2l0Y2ggKHR5cGVvZiBwcm9wVmFsdWUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgcmV0dXJuICFwcm9wVmFsdWU7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHByb3BWYWx1ZS5ldmVyeShpc05vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9wVmFsdWUgPT09IG51bGwgfHwgaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKHByb3BWYWx1ZSk7XG4gICAgICAgIGlmIChpdGVyYXRvckZuKSB7XG4gICAgICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKHByb3BWYWx1ZSk7XG4gICAgICAgICAgdmFyIHN0ZXA7XG4gICAgICAgICAgaWYgKGl0ZXJhdG9yRm4gIT09IHByb3BWYWx1ZS5lbnRyaWVzKSB7XG4gICAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICAgIGlmICghaXNOb2RlKHN0ZXAudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEl0ZXJhdG9yIHdpbGwgcHJvdmlkZSBlbnRyeSBbayx2XSB0dXBsZXMgcmF0aGVyIHRoYW4gdmFsdWVzLlxuICAgICAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgICAgICB2YXIgZW50cnkgPSBzdGVwLnZhbHVlO1xuICAgICAgICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzTm9kZShlbnRyeVsxXSkpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNTeW1ib2wocHJvcFR5cGUsIHByb3BWYWx1ZSkge1xuICAgIC8vIE5hdGl2ZSBTeW1ib2wuXG4gICAgaWYgKHByb3BUeXBlID09PSAnc3ltYm9sJykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gMTkuNC4zLjUgU3ltYm9sLnByb3RvdHlwZVtAQHRvU3RyaW5nVGFnXSA9PT0gJ1N5bWJvbCdcbiAgICBpZiAocHJvcFZhbHVlWydAQHRvU3RyaW5nVGFnJ10gPT09ICdTeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBGYWxsYmFjayBmb3Igbm9uLXNwZWMgY29tcGxpYW50IFN5bWJvbHMgd2hpY2ggYXJlIHBvbHlmaWxsZWQuXG4gICAgaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgcHJvcFZhbHVlIGluc3RhbmNlb2YgU3ltYm9sKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBFcXVpdmFsZW50IG9mIGB0eXBlb2ZgIGJ1dCB3aXRoIHNwZWNpYWwgaGFuZGxpbmcgZm9yIGFycmF5IGFuZCByZWdleHAuXG4gIGZ1bmN0aW9uIGdldFByb3BUeXBlKHByb3BWYWx1ZSkge1xuICAgIHZhciBwcm9wVHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgcmV0dXJuICdhcnJheSc7XG4gICAgfVxuICAgIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgIC8vIE9sZCB3ZWJraXRzIChhdCBsZWFzdCB1bnRpbCBBbmRyb2lkIDQuMCkgcmV0dXJuICdmdW5jdGlvbicgcmF0aGVyIHRoYW5cbiAgICAgIC8vICdvYmplY3QnIGZvciB0eXBlb2YgYSBSZWdFeHAuIFdlJ2xsIG5vcm1hbGl6ZSB0aGlzIGhlcmUgc28gdGhhdCAvYmxhL1xuICAgICAgLy8gcGFzc2VzIFByb3BUeXBlcy5vYmplY3QuXG4gICAgICByZXR1cm4gJ29iamVjdCc7XG4gICAgfVxuICAgIGlmIChpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSkge1xuICAgICAgcmV0dXJuICdzeW1ib2wnO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcFR5cGU7XG4gIH1cblxuICAvLyBUaGlzIGhhbmRsZXMgbW9yZSB0eXBlcyB0aGFuIGBnZXRQcm9wVHlwZWAuIE9ubHkgdXNlZCBmb3IgZXJyb3IgbWVzc2FnZXMuXG4gIC8vIFNlZSBgY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXJgLlxuICBmdW5jdGlvbiBnZXRQcmVjaXNlVHlwZShwcm9wVmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHByb3BWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgcHJvcFZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gJycgKyBwcm9wVmFsdWU7XG4gICAgfVxuICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgaWYgKHByb3BUeXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgcmV0dXJuICdkYXRlJztcbiAgICAgIH0gZWxzZSBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgIHJldHVybiAncmVnZXhwJztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb3BUeXBlO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHBvc3RmaXhlZCB0byBhIHdhcm5pbmcgYWJvdXQgYW4gaW52YWxpZCB0eXBlLlxuICAvLyBGb3IgZXhhbXBsZSwgXCJ1bmRlZmluZWRcIiBvciBcIm9mIHR5cGUgYXJyYXlcIlxuICBmdW5jdGlvbiBnZXRQb3N0Zml4Rm9yVHlwZVdhcm5pbmcodmFsdWUpIHtcbiAgICB2YXIgdHlwZSA9IGdldFByZWNpc2VUeXBlKHZhbHVlKTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIHJldHVybiAnYW4gJyArIHR5cGU7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgY2FzZSAncmVnZXhwJzpcbiAgICAgICAgcmV0dXJuICdhICcgKyB0eXBlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0dXJucyBjbGFzcyBuYW1lIG9mIHRoZSBvYmplY3QsIGlmIGFueS5cbiAgZnVuY3Rpb24gZ2V0Q2xhc3NOYW1lKHByb3BWYWx1ZSkge1xuICAgIGlmICghcHJvcFZhbHVlLmNvbnN0cnVjdG9yIHx8ICFwcm9wVmFsdWUuY29uc3RydWN0b3IubmFtZSkge1xuICAgICAgcmV0dXJuIEFOT05ZTU9VUztcbiAgICB9XG4gICAgcmV0dXJuIHByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lO1xuICB9XG5cbiAgUmVhY3RQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMgPSBjaGVja1Byb3BUeXBlcztcbiAgUmVhY3RQcm9wVHlwZXMuUHJvcFR5cGVzID0gUmVhY3RQcm9wVHlwZXM7XG5cbiAgcmV0dXJuIFJlYWN0UHJvcFR5cGVzO1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9ICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmXG4gICAgU3ltYm9sLmZvciAmJlxuICAgIFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSkgfHxcbiAgICAweGVhYzc7XG5cbiAgdmFyIGlzVmFsaWRFbGVtZW50ID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICBvYmplY3QgIT09IG51bGwgJiZcbiAgICAgIG9iamVjdC4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFO1xuICB9O1xuXG4gIC8vIEJ5IGV4cGxpY2l0bHkgdXNpbmcgYHByb3AtdHlwZXNgIHlvdSBhcmUgb3B0aW5nIGludG8gbmV3IGRldmVsb3BtZW50IGJlaGF2aW9yLlxuICAvLyBodHRwOi8vZmIubWUvcHJvcC10eXBlcy1pbi1wcm9kXG4gIHZhciB0aHJvd09uRGlyZWN0QWNjZXNzID0gdHJ1ZTtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzJykoaXNWYWxpZEVsZW1lbnQsIHRocm93T25EaXJlY3RBY2Nlc3MpO1xufSBlbHNlIHtcbiAgLy8gQnkgZXhwbGljaXRseSB1c2luZyBgcHJvcC10eXBlc2AgeW91IGFyZSBvcHRpbmcgaW50byBuZXcgcHJvZHVjdGlvbiBiZWhhdmlvci5cbiAgLy8gaHR0cDovL2ZiLm1lL3Byb3AtdHlwZXMtaW4tcHJvZFxuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZmFjdG9yeVdpdGhUaHJvd2luZ1NoaW1zJykoKTtcbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSAnU0VDUkVUX0RPX05PVF9QQVNTX1RISVNfT1JfWU9VX1dJTExfQkVfRklSRUQnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0UHJvcFR5cGVzU2VjcmV0O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPVxuICAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yICYmIFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSkgfHxcbiAgMHhlYWM3O1xuXG52YXIgZW1wdHlGdW5jdGlvbiA9IHJlcXVpcmUoJ2ZianMvbGliL2VtcHR5RnVuY3Rpb24nKTtcbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcbnZhciB3YXJuaW5nID0gcmVxdWlyZSgnZmJqcy9saWIvd2FybmluZycpO1xuXG52YXIgU0VQQVJBVE9SID0gJy4nO1xudmFyIFNVQlNFUEFSQVRPUiA9ICc6JztcblxudmFyIGRpZFdhcm5BYm91dE1hcHMgPSBmYWxzZTtcblxudmFyIElURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xudmFyIEZBVVhfSVRFUkFUT1JfU1lNQk9MID0gJ0BAaXRlcmF0b3InOyAvLyBCZWZvcmUgU3ltYm9sIHNwZWMuXG5cbmZ1bmN0aW9uIGdldEl0ZXJhdG9yRm4obWF5YmVJdGVyYWJsZSkge1xuICB2YXIgaXRlcmF0b3JGbiA9XG4gICAgbWF5YmVJdGVyYWJsZSAmJlxuICAgICgoSVRFUkFUT1JfU1lNQk9MICYmIG1heWJlSXRlcmFibGVbSVRFUkFUT1JfU1lNQk9MXSkgfHxcbiAgICAgIG1heWJlSXRlcmFibGVbRkFVWF9JVEVSQVRPUl9TWU1CT0xdKTtcbiAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGl0ZXJhdG9yRm47XG4gIH1cbn1cblxuZnVuY3Rpb24gZXNjYXBlKGtleSkge1xuICB2YXIgZXNjYXBlUmVnZXggPSAvWz06XS9nO1xuICB2YXIgZXNjYXBlckxvb2t1cCA9IHtcbiAgICAnPSc6ICc9MCcsXG4gICAgJzonOiAnPTInXG4gIH07XG4gIHZhciBlc2NhcGVkU3RyaW5nID0gKCcnICsga2V5KS5yZXBsYWNlKGVzY2FwZVJlZ2V4LCBmdW5jdGlvbihtYXRjaCkge1xuICAgIHJldHVybiBlc2NhcGVyTG9va3VwW21hdGNoXTtcbiAgfSk7XG5cbiAgcmV0dXJuICckJyArIGVzY2FwZWRTdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGdldENvbXBvbmVudEtleShjb21wb25lbnQsIGluZGV4KSB7XG4gIC8vIERvIHNvbWUgdHlwZWNoZWNraW5nIGhlcmUgc2luY2Ugd2UgY2FsbCB0aGlzIGJsaW5kbHkuIFdlIHdhbnQgdG8gZW5zdXJlXG4gIC8vIHRoYXQgd2UgZG9uJ3QgYmxvY2sgcG90ZW50aWFsIGZ1dHVyZSBFUyBBUElzLlxuICBpZiAoY29tcG9uZW50ICYmIHR5cGVvZiBjb21wb25lbnQgPT09ICdvYmplY3QnICYmIGNvbXBvbmVudC5rZXkgIT0gbnVsbCkge1xuICAgIC8vIEV4cGxpY2l0IGtleVxuICAgIHJldHVybiBlc2NhcGUoY29tcG9uZW50LmtleSk7XG4gIH1cbiAgLy8gSW1wbGljaXQga2V5IGRldGVybWluZWQgYnkgdGhlIGluZGV4IGluIHRoZSBzZXRcbiAgcmV0dXJuIGluZGV4LnRvU3RyaW5nKDM2KTtcbn1cblxuZnVuY3Rpb24gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoXG4gIGNoaWxkcmVuLFxuICBuYW1lU29GYXIsXG4gIGNhbGxiYWNrLFxuICB0cmF2ZXJzZUNvbnRleHRcbikge1xuICB2YXIgdHlwZSA9IHR5cGVvZiBjaGlsZHJlbjtcblxuICBpZiAodHlwZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgLy8gQWxsIG9mIHRoZSBhYm92ZSBhcmUgcGVyY2VpdmVkIGFzIG51bGwuXG4gICAgY2hpbGRyZW4gPSBudWxsO1xuICB9XG5cbiAgaWYgKFxuICAgIGNoaWxkcmVuID09PSBudWxsIHx8XG4gICAgdHlwZSA9PT0gJ3N0cmluZycgfHxcbiAgICB0eXBlID09PSAnbnVtYmVyJyB8fFxuICAgIC8vIFRoZSBmb2xsb3dpbmcgaXMgaW5saW5lZCBmcm9tIFJlYWN0RWxlbWVudC4gVGhpcyBtZWFucyB3ZSBjYW4gb3B0aW1pemVcbiAgICAvLyBzb21lIGNoZWNrcy4gUmVhY3QgRmliZXIgYWxzbyBpbmxpbmVzIHRoaXMgbG9naWMgZm9yIHNpbWlsYXIgcHVycG9zZXMuXG4gICAgKHR5cGUgPT09ICdvYmplY3QnICYmIGNoaWxkcmVuLiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEUpXG4gICkge1xuICAgIGNhbGxiYWNrKFxuICAgICAgdHJhdmVyc2VDb250ZXh0LFxuICAgICAgY2hpbGRyZW4sXG4gICAgICAvLyBJZiBpdCdzIHRoZSBvbmx5IGNoaWxkLCB0cmVhdCB0aGUgbmFtZSBhcyBpZiBpdCB3YXMgd3JhcHBlZCBpbiBhbiBhcnJheVxuICAgICAgLy8gc28gdGhhdCBpdCdzIGNvbnNpc3RlbnQgaWYgdGhlIG51bWJlciBvZiBjaGlsZHJlbiBncm93cy5cbiAgICAgIG5hbWVTb0ZhciA9PT0gJycgPyBTRVBBUkFUT1IgKyBnZXRDb21wb25lbnRLZXkoY2hpbGRyZW4sIDApIDogbmFtZVNvRmFyXG4gICAgKTtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIHZhciBjaGlsZDtcbiAgdmFyIG5leHROYW1lO1xuICB2YXIgc3VidHJlZUNvdW50ID0gMDsgLy8gQ291bnQgb2YgY2hpbGRyZW4gZm91bmQgaW4gdGhlIGN1cnJlbnQgc3VidHJlZS5cbiAgdmFyIG5leHROYW1lUHJlZml4ID0gbmFtZVNvRmFyID09PSAnJyA/IFNFUEFSQVRPUiA6IG5hbWVTb0ZhciArIFNVQlNFUEFSQVRPUjtcblxuICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgbmV4dE5hbWUgPSBuZXh0TmFtZVByZWZpeCArIGdldENvbXBvbmVudEtleShjaGlsZCwgaSk7XG4gICAgICBzdWJ0cmVlQ291bnQgKz0gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoXG4gICAgICAgIGNoaWxkLFxuICAgICAgICBuZXh0TmFtZSxcbiAgICAgICAgY2FsbGJhY2ssXG4gICAgICAgIHRyYXZlcnNlQ29udGV4dFxuICAgICAgKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKGNoaWxkcmVuKTtcbiAgICBpZiAoaXRlcmF0b3JGbikge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgLy8gV2FybiBhYm91dCB1c2luZyBNYXBzIGFzIGNoaWxkcmVuXG4gICAgICAgIGlmIChpdGVyYXRvckZuID09PSBjaGlsZHJlbi5lbnRyaWVzKSB7XG4gICAgICAgICAgd2FybmluZyhcbiAgICAgICAgICAgIGRpZFdhcm5BYm91dE1hcHMsXG4gICAgICAgICAgICAnVXNpbmcgTWFwcyBhcyBjaGlsZHJlbiBpcyB1bnN1cHBvcnRlZCBhbmQgd2lsbCBsaWtlbHkgeWllbGQgJyArXG4gICAgICAgICAgICAgICd1bmV4cGVjdGVkIHJlc3VsdHMuIENvbnZlcnQgaXQgdG8gYSBzZXF1ZW5jZS9pdGVyYWJsZSBvZiBrZXllZCAnICtcbiAgICAgICAgICAgICAgJ1JlYWN0RWxlbWVudHMgaW5zdGVhZC4nXG4gICAgICAgICAgKTtcbiAgICAgICAgICBkaWRXYXJuQWJvdXRNYXBzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwoY2hpbGRyZW4pO1xuICAgICAgdmFyIHN0ZXA7XG4gICAgICB2YXIgaWkgPSAwO1xuICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICBjaGlsZCA9IHN0ZXAudmFsdWU7XG4gICAgICAgIG5leHROYW1lID0gbmV4dE5hbWVQcmVmaXggKyBnZXRDb21wb25lbnRLZXkoY2hpbGQsIGlpKyspO1xuICAgICAgICBzdWJ0cmVlQ291bnQgKz0gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoXG4gICAgICAgICAgY2hpbGQsXG4gICAgICAgICAgbmV4dE5hbWUsXG4gICAgICAgICAgY2FsbGJhY2ssXG4gICAgICAgICAgdHJhdmVyc2VDb250ZXh0XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgdmFyIGFkZGVuZHVtID0gJyc7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICBhZGRlbmR1bSA9XG4gICAgICAgICAgJyBJZiB5b3UgbWVhbnQgdG8gcmVuZGVyIGEgY29sbGVjdGlvbiBvZiBjaGlsZHJlbiwgdXNlIGFuIGFycmF5ICcgK1xuICAgICAgICAgICdpbnN0ZWFkIG9yIHdyYXAgdGhlIG9iamVjdCB1c2luZyBjcmVhdGVGcmFnbWVudChvYmplY3QpIGZyb20gdGhlICcgK1xuICAgICAgICAgICdSZWFjdCBhZGQtb25zLic7XG4gICAgICB9XG4gICAgICB2YXIgY2hpbGRyZW5TdHJpbmcgPSAnJyArIGNoaWxkcmVuO1xuICAgICAgaW52YXJpYW50KFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgJ09iamVjdHMgYXJlIG5vdCB2YWxpZCBhcyBhIFJlYWN0IGNoaWxkIChmb3VuZDogJXMpLiVzJyxcbiAgICAgICAgY2hpbGRyZW5TdHJpbmcgPT09ICdbb2JqZWN0IE9iamVjdF0nXG4gICAgICAgICAgPyAnb2JqZWN0IHdpdGgga2V5cyB7JyArIE9iamVjdC5rZXlzKGNoaWxkcmVuKS5qb2luKCcsICcpICsgJ30nXG4gICAgICAgICAgOiBjaGlsZHJlblN0cmluZyxcbiAgICAgICAgYWRkZW5kdW1cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHN1YnRyZWVDb3VudDtcbn1cblxuZnVuY3Rpb24gdHJhdmVyc2VBbGxDaGlsZHJlbihjaGlsZHJlbiwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCkge1xuICBpZiAoY2hpbGRyZW4gPT0gbnVsbCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkcmVuLCAnJywgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG59XG5cbnZhciB1c2VyUHJvdmlkZWRLZXlFc2NhcGVSZWdleCA9IC9cXC8rL2c7XG5mdW5jdGlvbiBlc2NhcGVVc2VyUHJvdmlkZWRLZXkodGV4dCkge1xuICByZXR1cm4gKCcnICsgdGV4dCkucmVwbGFjZSh1c2VyUHJvdmlkZWRLZXlFc2NhcGVSZWdleCwgJyQmLycpO1xufVxuXG5mdW5jdGlvbiBjbG9uZUFuZFJlcGxhY2VLZXkob2xkRWxlbWVudCwgbmV3S2V5KSB7XG4gIHJldHVybiBSZWFjdC5jbG9uZUVsZW1lbnQoXG4gICAgb2xkRWxlbWVudCxcbiAgICB7a2V5OiBuZXdLZXl9LFxuICAgIG9sZEVsZW1lbnQucHJvcHMgIT09IHVuZGVmaW5lZCA/IG9sZEVsZW1lbnQucHJvcHMuY2hpbGRyZW4gOiB1bmRlZmluZWRcbiAgKTtcbn1cblxudmFyIERFRkFVTFRfUE9PTF9TSVpFID0gMTA7XG52YXIgREVGQVVMVF9QT09MRVIgPSBvbmVBcmd1bWVudFBvb2xlcjtcblxudmFyIG9uZUFyZ3VtZW50UG9vbGVyID0gZnVuY3Rpb24oY29weUZpZWxkc0Zyb20pIHtcbiAgdmFyIEtsYXNzID0gdGhpcztcbiAgaWYgKEtsYXNzLmluc3RhbmNlUG9vbC5sZW5ndGgpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBLbGFzcy5pbnN0YW5jZVBvb2wucG9wKCk7XG4gICAgS2xhc3MuY2FsbChpbnN0YW5jZSwgY29weUZpZWxkc0Zyb20pO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IEtsYXNzKGNvcHlGaWVsZHNGcm9tKTtcbiAgfVxufTtcblxudmFyIGFkZFBvb2xpbmdUbyA9IGZ1bmN0aW9uIGFkZFBvb2xpbmdUbyhDb3B5Q29uc3RydWN0b3IsIHBvb2xlcikge1xuICAvLyBDYXN0aW5nIGFzIGFueSBzbyB0aGF0IGZsb3cgaWdub3JlcyB0aGUgYWN0dWFsIGltcGxlbWVudGF0aW9uIGFuZCB0cnVzdHNcbiAgLy8gaXQgdG8gbWF0Y2ggdGhlIHR5cGUgd2UgZGVjbGFyZWRcbiAgdmFyIE5ld0tsYXNzID0gQ29weUNvbnN0cnVjdG9yO1xuICBOZXdLbGFzcy5pbnN0YW5jZVBvb2wgPSBbXTtcbiAgTmV3S2xhc3MuZ2V0UG9vbGVkID0gcG9vbGVyIHx8IERFRkFVTFRfUE9PTEVSO1xuICBpZiAoIU5ld0tsYXNzLnBvb2xTaXplKSB7XG4gICAgTmV3S2xhc3MucG9vbFNpemUgPSBERUZBVUxUX1BPT0xfU0laRTtcbiAgfVxuICBOZXdLbGFzcy5yZWxlYXNlID0gc3RhbmRhcmRSZWxlYXNlcjtcbiAgcmV0dXJuIE5ld0tsYXNzO1xufTtcblxudmFyIHN0YW5kYXJkUmVsZWFzZXIgPSBmdW5jdGlvbiBzdGFuZGFyZFJlbGVhc2VyKGluc3RhbmNlKSB7XG4gIHZhciBLbGFzcyA9IHRoaXM7XG4gIGludmFyaWFudChcbiAgICBpbnN0YW5jZSBpbnN0YW5jZW9mIEtsYXNzLFxuICAgICdUcnlpbmcgdG8gcmVsZWFzZSBhbiBpbnN0YW5jZSBpbnRvIGEgcG9vbCBvZiBhIGRpZmZlcmVudCB0eXBlLidcbiAgKTtcbiAgaW5zdGFuY2UuZGVzdHJ1Y3RvcigpO1xuICBpZiAoS2xhc3MuaW5zdGFuY2VQb29sLmxlbmd0aCA8IEtsYXNzLnBvb2xTaXplKSB7XG4gICAgS2xhc3MuaW5zdGFuY2VQb29sLnB1c2goaW5zdGFuY2UpO1xuICB9XG59O1xuXG52YXIgZm91ckFyZ3VtZW50UG9vbGVyID0gZnVuY3Rpb24gZm91ckFyZ3VtZW50UG9vbGVyKGExLCBhMiwgYTMsIGE0KSB7XG4gIHZhciBLbGFzcyA9IHRoaXM7XG4gIGlmIChLbGFzcy5pbnN0YW5jZVBvb2wubGVuZ3RoKSB7XG4gICAgdmFyIGluc3RhbmNlID0gS2xhc3MuaW5zdGFuY2VQb29sLnBvcCgpO1xuICAgIEtsYXNzLmNhbGwoaW5zdGFuY2UsIGExLCBhMiwgYTMsIGE0KTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBLbGFzcyhhMSwgYTIsIGEzLCBhNCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIE1hcEJvb2tLZWVwaW5nKG1hcFJlc3VsdCwga2V5UHJlZml4LCBtYXBGdW5jdGlvbiwgbWFwQ29udGV4dCkge1xuICB0aGlzLnJlc3VsdCA9IG1hcFJlc3VsdDtcbiAgdGhpcy5rZXlQcmVmaXggPSBrZXlQcmVmaXg7XG4gIHRoaXMuZnVuYyA9IG1hcEZ1bmN0aW9uO1xuICB0aGlzLmNvbnRleHQgPSBtYXBDb250ZXh0O1xuICB0aGlzLmNvdW50ID0gMDtcbn1cbk1hcEJvb2tLZWVwaW5nLnByb3RvdHlwZS5kZXN0cnVjdG9yID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucmVzdWx0ID0gbnVsbDtcbiAgdGhpcy5rZXlQcmVmaXggPSBudWxsO1xuICB0aGlzLmZ1bmMgPSBudWxsO1xuICB0aGlzLmNvbnRleHQgPSBudWxsO1xuICB0aGlzLmNvdW50ID0gMDtcbn07XG5hZGRQb29saW5nVG8oTWFwQm9va0tlZXBpbmcsIGZvdXJBcmd1bWVudFBvb2xlcik7XG5cbmZ1bmN0aW9uIG1hcFNpbmdsZUNoaWxkSW50b0NvbnRleHQoYm9va0tlZXBpbmcsIGNoaWxkLCBjaGlsZEtleSkge1xuICB2YXIgcmVzdWx0ID0gYm9va0tlZXBpbmcucmVzdWx0O1xuICB2YXIga2V5UHJlZml4ID0gYm9va0tlZXBpbmcua2V5UHJlZml4O1xuICB2YXIgZnVuYyA9IGJvb2tLZWVwaW5nLmZ1bmM7XG4gIHZhciBjb250ZXh0ID0gYm9va0tlZXBpbmcuY29udGV4dDtcblxuICB2YXIgbWFwcGVkQ2hpbGQgPSBmdW5jLmNhbGwoY29udGV4dCwgY2hpbGQsIGJvb2tLZWVwaW5nLmNvdW50KyspO1xuICBpZiAoQXJyYXkuaXNBcnJheShtYXBwZWRDaGlsZCkpIHtcbiAgICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKFxuICAgICAgbWFwcGVkQ2hpbGQsXG4gICAgICByZXN1bHQsXG4gICAgICBjaGlsZEtleSxcbiAgICAgIGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNBcmd1bWVudFxuICAgICk7XG4gIH0gZWxzZSBpZiAobWFwcGVkQ2hpbGQgIT0gbnVsbCkge1xuICAgIGlmIChSZWFjdC5pc1ZhbGlkRWxlbWVudChtYXBwZWRDaGlsZCkpIHtcbiAgICAgIG1hcHBlZENoaWxkID0gY2xvbmVBbmRSZXBsYWNlS2V5KFxuICAgICAgICBtYXBwZWRDaGlsZCxcbiAgICAgICAgLy8gS2VlcCBib3RoIHRoZSAobWFwcGVkKSBhbmQgb2xkIGtleXMgaWYgdGhleSBkaWZmZXIsIGp1c3QgYXNcbiAgICAgICAgLy8gdHJhdmVyc2VBbGxDaGlsZHJlbiB1c2VkIHRvIGRvIGZvciBvYmplY3RzIGFzIGNoaWxkcmVuXG4gICAgICAgIGtleVByZWZpeCArXG4gICAgICAgICAgKG1hcHBlZENoaWxkLmtleSAmJiAoIWNoaWxkIHx8IGNoaWxkLmtleSAhPT0gbWFwcGVkQ2hpbGQua2V5KVxuICAgICAgICAgICAgPyBlc2NhcGVVc2VyUHJvdmlkZWRLZXkobWFwcGVkQ2hpbGQua2V5KSArICcvJ1xuICAgICAgICAgICAgOiAnJykgK1xuICAgICAgICAgIGNoaWxkS2V5XG4gICAgICApO1xuICAgIH1cbiAgICByZXN1bHQucHVzaChtYXBwZWRDaGlsZCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChjaGlsZHJlbiwgYXJyYXksIHByZWZpeCwgZnVuYywgY29udGV4dCkge1xuICB2YXIgZXNjYXBlZFByZWZpeCA9ICcnO1xuICBpZiAocHJlZml4ICE9IG51bGwpIHtcbiAgICBlc2NhcGVkUHJlZml4ID0gZXNjYXBlVXNlclByb3ZpZGVkS2V5KHByZWZpeCkgKyAnLyc7XG4gIH1cbiAgdmFyIHRyYXZlcnNlQ29udGV4dCA9IE1hcEJvb2tLZWVwaW5nLmdldFBvb2xlZChcbiAgICBhcnJheSxcbiAgICBlc2NhcGVkUHJlZml4LFxuICAgIGZ1bmMsXG4gICAgY29udGV4dFxuICApO1xuICB0cmF2ZXJzZUFsbENoaWxkcmVuKGNoaWxkcmVuLCBtYXBTaW5nbGVDaGlsZEludG9Db250ZXh0LCB0cmF2ZXJzZUNvbnRleHQpO1xuICBNYXBCb29rS2VlcGluZy5yZWxlYXNlKHRyYXZlcnNlQ29udGV4dCk7XG59XG5cbnZhciBudW1lcmljUHJvcGVydHlSZWdleCA9IC9eXFxkKyQvO1xuXG52YXIgd2FybmVkQWJvdXROdW1lcmljID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGNyZWF0ZVJlYWN0RnJhZ21lbnQob2JqZWN0KSB7XG4gIGlmICh0eXBlb2Ygb2JqZWN0ICE9PSAnb2JqZWN0JyB8fCAhb2JqZWN0IHx8IEFycmF5LmlzQXJyYXkob2JqZWN0KSkge1xuICAgIHdhcm5pbmcoXG4gICAgICBmYWxzZSxcbiAgICAgICdSZWFjdC5hZGRvbnMuY3JlYXRlRnJhZ21lbnQgb25seSBhY2NlcHRzIGEgc2luZ2xlIG9iamVjdC4gR290OiAlcycsXG4gICAgICBvYmplY3RcbiAgICApO1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgaWYgKFJlYWN0LmlzVmFsaWRFbGVtZW50KG9iamVjdCkpIHtcbiAgICB3YXJuaW5nKFxuICAgICAgZmFsc2UsXG4gICAgICAnUmVhY3QuYWRkb25zLmNyZWF0ZUZyYWdtZW50IGRvZXMgbm90IGFjY2VwdCBhIFJlYWN0RWxlbWVudCAnICtcbiAgICAgICAgJ3dpdGhvdXQgYSB3cmFwcGVyIG9iamVjdC4nXG4gICAgKTtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgaW52YXJpYW50KFxuICAgIG9iamVjdC5ub2RlVHlwZSAhPT0gMSxcbiAgICAnUmVhY3QuYWRkb25zLmNyZWF0ZUZyYWdtZW50KC4uLik6IEVuY291bnRlcmVkIGFuIGludmFsaWQgY2hpbGQ7IERPTSAnICtcbiAgICAgICdlbGVtZW50cyBhcmUgbm90IHZhbGlkIGNoaWxkcmVuIG9mIFJlYWN0IGNvbXBvbmVudHMuJ1xuICApO1xuXG4gIHZhciByZXN1bHQgPSBbXTtcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIGlmICghd2FybmVkQWJvdXROdW1lcmljICYmIG51bWVyaWNQcm9wZXJ0eVJlZ2V4LnRlc3Qoa2V5KSkge1xuICAgICAgICB3YXJuaW5nKFxuICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICdSZWFjdC5hZGRvbnMuY3JlYXRlRnJhZ21lbnQoLi4uKTogQ2hpbGQgb2JqZWN0cyBzaG91bGQgaGF2ZSAnICtcbiAgICAgICAgICAgICdub24tbnVtZXJpYyBrZXlzIHNvIG9yZGVyaW5nIGlzIHByZXNlcnZlZC4nXG4gICAgICAgICk7XG4gICAgICAgIHdhcm5lZEFib3V0TnVtZXJpYyA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWwoXG4gICAgICBvYmplY3Rba2V5XSxcbiAgICAgIHJlc3VsdCxcbiAgICAgIGtleSxcbiAgICAgIGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNBcmd1bWVudFxuICAgICk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVJlYWN0RnJhZ21lbnQ7XG4iLCIvKiogQGxpY2Vuc2UgUmVhY3QgdjE2LjcuMFxuICogcmVhY3QuZGV2ZWxvcG1lbnQuanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cblxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gIChmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxudmFyIF9hc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG52YXIgY2hlY2tQcm9wVHlwZXMgPSByZXF1aXJlKCdwcm9wLXR5cGVzL2NoZWNrUHJvcFR5cGVzJyk7XG5cbi8vIFRPRE86IHRoaXMgaXMgc3BlY2lhbCBiZWNhdXNlIGl0IGdldHMgaW1wb3J0ZWQgZHVyaW5nIGJ1aWxkLlxuXG52YXIgUmVhY3RWZXJzaW9uID0gJzE2LjcuMCc7XG5cbi8vIFRoZSBTeW1ib2wgdXNlZCB0byB0YWcgdGhlIFJlYWN0RWxlbWVudC1saWtlIHR5cGVzLiBJZiB0aGVyZSBpcyBubyBuYXRpdmUgU3ltYm9sXG4vLyBub3IgcG9seWZpbGwsIHRoZW4gYSBwbGFpbiBudW1iZXIgaXMgdXNlZCBmb3IgcGVyZm9ybWFuY2UuXG52YXIgaGFzU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yO1xuXG52YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpIDogMHhlYWM3O1xudmFyIFJFQUNUX1BPUlRBTF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QucG9ydGFsJykgOiAweGVhY2E7XG52YXIgUkVBQ1RfRlJBR01FTlRfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmZyYWdtZW50JykgOiAweGVhY2I7XG52YXIgUkVBQ1RfU1RSSUNUX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnN0cmljdF9tb2RlJykgOiAweGVhY2M7XG52YXIgUkVBQ1RfUFJPRklMRVJfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnByb2ZpbGVyJykgOiAweGVhZDI7XG52YXIgUkVBQ1RfUFJPVklERVJfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnByb3ZpZGVyJykgOiAweGVhY2Q7XG52YXIgUkVBQ1RfQ09OVEVYVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuY29udGV4dCcpIDogMHhlYWNlO1xuXG52YXIgUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5jb25jdXJyZW50X21vZGUnKSA6IDB4ZWFjZjtcbnZhciBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZm9yd2FyZF9yZWYnKSA6IDB4ZWFkMDtcbnZhciBSRUFDVF9TVVNQRU5TRV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3Quc3VzcGVuc2UnKSA6IDB4ZWFkMTtcbnZhciBSRUFDVF9NRU1PX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5tZW1vJykgOiAweGVhZDM7XG52YXIgUkVBQ1RfTEFaWV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QubGF6eScpIDogMHhlYWQ0O1xuXG52YXIgTUFZQkVfSVRFUkFUT1JfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuaXRlcmF0b3I7XG52YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSAnQEBpdGVyYXRvcic7XG5cbmZ1bmN0aW9uIGdldEl0ZXJhdG9yRm4obWF5YmVJdGVyYWJsZSkge1xuICBpZiAobWF5YmVJdGVyYWJsZSA9PT0gbnVsbCB8fCB0eXBlb2YgbWF5YmVJdGVyYWJsZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2YXIgbWF5YmVJdGVyYXRvciA9IE1BWUJFX0lURVJBVE9SX1NZTUJPTCAmJiBtYXliZUl0ZXJhYmxlW01BWUJFX0lURVJBVE9SX1NZTUJPTF0gfHwgbWF5YmVJdGVyYWJsZVtGQVVYX0lURVJBVE9SX1NZTUJPTF07XG4gIGlmICh0eXBlb2YgbWF5YmVJdGVyYXRvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBtYXliZUl0ZXJhdG9yO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG52YXIgZW5hYmxlSG9va3MgPSBmYWxzZTtcbi8vIEhlbHBzIGlkZW50aWZ5IHNpZGUgZWZmZWN0cyBpbiBiZWdpbi1waGFzZSBsaWZlY3ljbGUgaG9va3MgYW5kIHNldFN0YXRlIHJlZHVjZXJzOlxuXG5cbi8vIEluIHNvbWUgY2FzZXMsIFN0cmljdE1vZGUgc2hvdWxkIGFsc28gZG91YmxlLXJlbmRlciBsaWZlY3ljbGVzLlxuLy8gVGhpcyBjYW4gYmUgY29uZnVzaW5nIGZvciB0ZXN0cyB0aG91Z2gsXG4vLyBBbmQgaXQgY2FuIGJlIGJhZCBmb3IgcGVyZm9ybWFuY2UgaW4gcHJvZHVjdGlvbi5cbi8vIFRoaXMgZmVhdHVyZSBmbGFnIGNhbiBiZSB1c2VkIHRvIGNvbnRyb2wgdGhlIGJlaGF2aW9yOlxuXG5cbi8vIFRvIHByZXNlcnZlIHRoZSBcIlBhdXNlIG9uIGNhdWdodCBleGNlcHRpb25zXCIgYmVoYXZpb3Igb2YgdGhlIGRlYnVnZ2VyLCB3ZVxuLy8gcmVwbGF5IHRoZSBiZWdpbiBwaGFzZSBvZiBhIGZhaWxlZCBjb21wb25lbnQgaW5zaWRlIGludm9rZUd1YXJkZWRDYWxsYmFjay5cblxuXG4vLyBXYXJuIGFib3V0IGRlcHJlY2F0ZWQsIGFzeW5jLXVuc2FmZSBsaWZlY3ljbGVzOyByZWxhdGVzIHRvIFJGQyAjNjpcblxuXG4vLyBHYXRoZXIgYWR2YW5jZWQgdGltaW5nIG1ldHJpY3MgZm9yIFByb2ZpbGVyIHN1YnRyZWVzLlxuXG5cbi8vIFRyYWNlIHdoaWNoIGludGVyYWN0aW9ucyB0cmlnZ2VyIGVhY2ggY29tbWl0LlxuXG5cbi8vIE9ubHkgdXNlZCBpbiB3d3cgYnVpbGRzLlxuIC8vIFRPRE86IHRydWU/IEhlcmUgaXQgbWlnaHQganVzdCBiZSBmYWxzZS5cblxuLy8gT25seSB1c2VkIGluIHd3dyBidWlsZHMuXG5cblxuLy8gT25seSB1c2VkIGluIHd3dyBidWlsZHMuXG5cblxuLy8gUmVhY3QgRmlyZTogcHJldmVudCB0aGUgdmFsdWUgYW5kIGNoZWNrZWQgYXR0cmlidXRlcyBmcm9tIHN5bmNpbmdcbi8vIHdpdGggdGhlaXIgcmVsYXRlZCBET00gcHJvcGVydGllc1xuXG5cbi8vIFRoZXNlIEFQSXMgd2lsbCBubyBsb25nZXIgYmUgXCJ1bnN0YWJsZVwiIGluIHRoZSB1cGNvbWluZyAxNi43IHJlbGVhc2UsXG4vLyBDb250cm9sIHRoaXMgYmVoYXZpb3Igd2l0aCBhIGZsYWcgdG8gc3VwcG9ydCAxNi42IG1pbm9yIHJlbGVhc2VzIGluIHRoZSBtZWFud2hpbGUuXG52YXIgZW5hYmxlU3RhYmxlQ29uY3VycmVudE1vZGVBUElzID0gZmFsc2U7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbnZhciB2YWxpZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uICgpIHt9O1xuXG57XG4gIHZhbGlkYXRlRm9ybWF0ID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhcmlhbnQgcmVxdWlyZXMgYW4gZXJyb3IgbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gaW52YXJpYW50KGNvbmRpdGlvbiwgZm9ybWF0LCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIHZhbGlkYXRlRm9ybWF0KGZvcm1hdCk7XG5cbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB2YXIgZXJyb3IgPSB2b2lkIDA7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcignTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYXJncyA9IFthLCBiLCBjLCBkLCBlLCBmXTtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gYXJnc1thcmdJbmRleCsrXTtcbiAgICAgIH0pKTtcbiAgICAgIGVycm9yLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gICAgfVxuXG4gICAgZXJyb3IuZnJhbWVzVG9Qb3AgPSAxOyAvLyB3ZSBkb24ndCBjYXJlIGFib3V0IGludmFyaWFudCdzIG93biBmcmFtZVxuICAgIHRocm93IGVycm9yO1xuICB9XG59XG5cbi8vIFJlbHlpbmcgb24gdGhlIGBpbnZhcmlhbnQoKWAgaW1wbGVtZW50YXRpb24gbGV0cyB1c1xuLy8gcHJlc2VydmUgdGhlIGZvcm1hdCBhbmQgcGFyYW1zIGluIHRoZSB3d3cgYnVpbGRzLlxuXG4vKipcbiAqIEZvcmtlZCBmcm9tIGZianMvd2FybmluZzpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9mYmpzL2Jsb2IvZTY2YmEyMGFkNWJlNDMzZWI1NDQyM2YyYjA5N2Q4MjkzMjRkOWRlNi9wYWNrYWdlcy9mYmpzL3NyYy9fX2ZvcmtzX18vd2FybmluZy5qc1xuICpcbiAqIE9ubHkgY2hhbmdlIGlzIHdlIHVzZSBjb25zb2xlLndhcm4gaW5zdGVhZCBvZiBjb25zb2xlLmVycm9yLFxuICogYW5kIGRvIG5vdGhpbmcgd2hlbiAnY29uc29sZScgaXMgbm90IHN1cHBvcnRlZC5cbiAqIFRoaXMgcmVhbGx5IHNpbXBsaWZpZXMgdGhlIGNvZGUuXG4gKiAtLS1cbiAqIFNpbWlsYXIgdG8gaW52YXJpYW50IGJ1dCBvbmx5IGxvZ3MgYSB3YXJuaW5nIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IG1ldC5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbG9nIGlzc3VlcyBpbiBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMgaW4gY3JpdGljYWxcbiAqIHBhdGhzLiBSZW1vdmluZyB0aGUgbG9nZ2luZyBjb2RlIGZvciBwcm9kdWN0aW9uIGVudmlyb25tZW50cyB3aWxsIGtlZXAgdGhlXG4gKiBzYW1lIGxvZ2ljIGFuZCBmb2xsb3cgdGhlIHNhbWUgY29kZSBwYXRocy5cbiAqL1xuXG52YXIgbG93UHJpb3JpdHlXYXJuaW5nID0gZnVuY3Rpb24gKCkge307XG5cbntcbiAgdmFyIHByaW50V2FybmluZyA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgdmFyIG1lc3NhZ2UgPSAnV2FybmluZzogJyArIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gYXJnc1thcmdJbmRleCsrXTtcbiAgICB9KTtcbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zb2xlLndhcm4obWVzc2FnZSk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyAtLS0gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgLS0tXG4gICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKHgpIHt9XG4gIH07XG5cbiAgbG93UHJpb3JpdHlXYXJuaW5nID0gZnVuY3Rpb24gKGNvbmRpdGlvbiwgZm9ybWF0KSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Bsb3dQcmlvcml0eVdhcm5pbmcoY29uZGl0aW9uLCBmb3JtYXQsIC4uLmFyZ3MpYCByZXF1aXJlcyBhIHdhcm5pbmcgJyArICdtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICAgIGlmICghY29uZGl0aW9uKSB7XG4gICAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMiA+IDIgPyBfbGVuMiAtIDIgOiAwKSwgX2tleTIgPSAyOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICAgIGFyZ3NbX2tleTIgLSAyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgICB9XG5cbiAgICAgIHByaW50V2FybmluZy5hcHBseSh1bmRlZmluZWQsIFtmb3JtYXRdLmNvbmNhdChhcmdzKSk7XG4gICAgfVxuICB9O1xufVxuXG52YXIgbG93UHJpb3JpdHlXYXJuaW5nJDEgPSBsb3dQcmlvcml0eVdhcm5pbmc7XG5cbi8qKlxuICogU2ltaWxhciB0byBpbnZhcmlhbnQgYnV0IG9ubHkgbG9ncyBhIHdhcm5pbmcgaWYgdGhlIGNvbmRpdGlvbiBpcyBub3QgbWV0LlxuICogVGhpcyBjYW4gYmUgdXNlZCB0byBsb2cgaXNzdWVzIGluIGRldmVsb3BtZW50IGVudmlyb25tZW50cyBpbiBjcml0aWNhbFxuICogcGF0aHMuIFJlbW92aW5nIHRoZSBsb2dnaW5nIGNvZGUgZm9yIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRzIHdpbGwga2VlcCB0aGVcbiAqIHNhbWUgbG9naWMgYW5kIGZvbGxvdyB0aGUgc2FtZSBjb2RlIHBhdGhzLlxuICovXG5cbnZhciB3YXJuaW5nV2l0aG91dFN0YWNrID0gZnVuY3Rpb24gKCkge307XG5cbntcbiAgd2FybmluZ1dpdGhvdXRTdGFjayA9IGZ1bmN0aW9uIChjb25kaXRpb24sIGZvcm1hdCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5IC0gMl0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2B3YXJuaW5nV2l0aG91dFN0YWNrKGNvbmRpdGlvbiwgZm9ybWF0LCAuLi5hcmdzKWAgcmVxdWlyZXMgYSB3YXJuaW5nICcgKyAnbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgICBpZiAoYXJncy5sZW5ndGggPiA4KSB7XG4gICAgICAvLyBDaGVjayBiZWZvcmUgdGhlIGNvbmRpdGlvbiB0byBjYXRjaCB2aW9sYXRpb25zIGVhcmx5LlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCd3YXJuaW5nV2l0aG91dFN0YWNrKCkgY3VycmVudGx5IHN1cHBvcnRzIGF0IG1vc3QgOCBhcmd1bWVudHMuJyk7XG4gICAgfVxuICAgIGlmIChjb25kaXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdmFyIGFyZ3NXaXRoRm9ybWF0ID0gYXJncy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuICcnICsgaXRlbTtcbiAgICAgIH0pO1xuICAgICAgYXJnc1dpdGhGb3JtYXQudW5zaGlmdCgnV2FybmluZzogJyArIGZvcm1hdCk7XG5cbiAgICAgIC8vIFdlIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIHNwcmVhZCAob3IgLmFwcGx5KSBkaXJlY3RseSBiZWNhdXNlIGl0XG4gICAgICAvLyBicmVha3MgSUU5OiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzEzNjEwXG4gICAgICBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbChjb25zb2xlLmVycm9yLCBjb25zb2xlLCBhcmdzV2l0aEZvcm1hdCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyAtLS0gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgLS0tXG4gICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gYXJnc1thcmdJbmRleCsrXTtcbiAgICAgIH0pO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKHgpIHt9XG4gIH07XG59XG5cbnZhciB3YXJuaW5nV2l0aG91dFN0YWNrJDEgPSB3YXJuaW5nV2l0aG91dFN0YWNrO1xuXG52YXIgZGlkV2FyblN0YXRlVXBkYXRlRm9yVW5tb3VudGVkQ29tcG9uZW50ID0ge307XG5cbmZ1bmN0aW9uIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCBjYWxsZXJOYW1lKSB7XG4gIHtcbiAgICB2YXIgX2NvbnN0cnVjdG9yID0gcHVibGljSW5zdGFuY2UuY29uc3RydWN0b3I7XG4gICAgdmFyIGNvbXBvbmVudE5hbWUgPSBfY29uc3RydWN0b3IgJiYgKF9jb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZSB8fCBfY29uc3RydWN0b3IubmFtZSkgfHwgJ1JlYWN0Q2xhc3MnO1xuICAgIHZhciB3YXJuaW5nS2V5ID0gY29tcG9uZW50TmFtZSArICcuJyArIGNhbGxlck5hbWU7XG4gICAgaWYgKGRpZFdhcm5TdGF0ZVVwZGF0ZUZvclVubW91bnRlZENvbXBvbmVudFt3YXJuaW5nS2V5XSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsIFwiQ2FuJ3QgY2FsbCAlcyBvbiBhIGNvbXBvbmVudCB0aGF0IGlzIG5vdCB5ZXQgbW91bnRlZC4gXCIgKyAnVGhpcyBpcyBhIG5vLW9wLCBidXQgaXQgbWlnaHQgaW5kaWNhdGUgYSBidWcgaW4geW91ciBhcHBsaWNhdGlvbi4gJyArICdJbnN0ZWFkLCBhc3NpZ24gdG8gYHRoaXMuc3RhdGVgIGRpcmVjdGx5IG9yIGRlZmluZSBhIGBzdGF0ZSA9IHt9O2AgJyArICdjbGFzcyBwcm9wZXJ0eSB3aXRoIHRoZSBkZXNpcmVkIHN0YXRlIGluIHRoZSAlcyBjb21wb25lbnQuJywgY2FsbGVyTmFtZSwgY29tcG9uZW50TmFtZSk7XG4gICAgZGlkV2FyblN0YXRlVXBkYXRlRm9yVW5tb3VudGVkQ29tcG9uZW50W3dhcm5pbmdLZXldID0gdHJ1ZTtcbiAgfVxufVxuXG4vKipcbiAqIFRoaXMgaXMgdGhlIGFic3RyYWN0IEFQSSBmb3IgYW4gdXBkYXRlIHF1ZXVlLlxuICovXG52YXIgUmVhY3ROb29wVXBkYXRlUXVldWUgPSB7XG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciBvciBub3QgdGhpcyBjb21wb3NpdGUgY29tcG9uZW50IGlzIG1vdW50ZWQuXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHdlIHdhbnQgdG8gdGVzdC5cbiAgICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiBtb3VudGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqIEBwcm90ZWN0ZWRcbiAgICogQGZpbmFsXG4gICAqL1xuICBpc01vdW50ZWQ6IGZ1bmN0aW9uIChwdWJsaWNJbnN0YW5jZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICAvKipcbiAgICogRm9yY2VzIGFuIHVwZGF0ZS4gVGhpcyBzaG91bGQgb25seSBiZSBpbnZva2VkIHdoZW4gaXQgaXMga25vd24gd2l0aFxuICAgKiBjZXJ0YWludHkgdGhhdCB3ZSBhcmUgKipub3QqKiBpbiBhIERPTSB0cmFuc2FjdGlvbi5cbiAgICpcbiAgICogWW91IG1heSB3YW50IHRvIGNhbGwgdGhpcyB3aGVuIHlvdSBrbm93IHRoYXQgc29tZSBkZWVwZXIgYXNwZWN0IG9mIHRoZVxuICAgKiBjb21wb25lbnQncyBzdGF0ZSBoYXMgY2hhbmdlZCBidXQgYHNldFN0YXRlYCB3YXMgbm90IGNhbGxlZC5cbiAgICpcbiAgICogVGhpcyB3aWxsIG5vdCBpbnZva2UgYHNob3VsZENvbXBvbmVudFVwZGF0ZWAsIGJ1dCBpdCB3aWxsIGludm9rZVxuICAgKiBgY29tcG9uZW50V2lsbFVwZGF0ZWAgYW5kIGBjb21wb25lbnREaWRVcGRhdGVgLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB0aGF0IHNob3VsZCByZXJlbmRlci5cbiAgICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciBjb21wb25lbnQgaXMgdXBkYXRlZC5cbiAgICogQHBhcmFtIHs/c3RyaW5nfSBjYWxsZXJOYW1lIG5hbWUgb2YgdGhlIGNhbGxpbmcgZnVuY3Rpb24gaW4gdGhlIHB1YmxpYyBBUEkuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZW5xdWV1ZUZvcmNlVXBkYXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UsIGNhbGxiYWNrLCBjYWxsZXJOYW1lKSB7XG4gICAgd2Fybk5vb3AocHVibGljSW5zdGFuY2UsICdmb3JjZVVwZGF0ZScpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXBsYWNlcyBhbGwgb2YgdGhlIHN0YXRlLiBBbHdheXMgdXNlIHRoaXMgb3IgYHNldFN0YXRlYCB0byBtdXRhdGUgc3RhdGUuXG4gICAqIFlvdSBzaG91bGQgdHJlYXQgYHRoaXMuc3RhdGVgIGFzIGltbXV0YWJsZS5cbiAgICpcbiAgICogVGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgYHRoaXMuc3RhdGVgIHdpbGwgYmUgaW1tZWRpYXRlbHkgdXBkYXRlZCwgc29cbiAgICogYWNjZXNzaW5nIGB0aGlzLnN0YXRlYCBhZnRlciBjYWxsaW5nIHRoaXMgbWV0aG9kIG1heSByZXR1cm4gdGhlIG9sZCB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBzaG91bGQgcmVyZW5kZXIuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBjb21wbGV0ZVN0YXRlIE5leHQgc3RhdGUuXG4gICAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgY29tcG9uZW50IGlzIHVwZGF0ZWQuXG4gICAqIEBwYXJhbSB7P3N0cmluZ30gY2FsbGVyTmFtZSBuYW1lIG9mIHRoZSBjYWxsaW5nIGZ1bmN0aW9uIGluIHRoZSBwdWJsaWMgQVBJLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGVucXVldWVSZXBsYWNlU3RhdGU6IGZ1bmN0aW9uIChwdWJsaWNJbnN0YW5jZSwgY29tcGxldGVTdGF0ZSwgY2FsbGJhY2ssIGNhbGxlck5hbWUpIHtcbiAgICB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgJ3JlcGxhY2VTdGF0ZScpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZXRzIGEgc3Vic2V0IG9mIHRoZSBzdGF0ZS4gVGhpcyBvbmx5IGV4aXN0cyBiZWNhdXNlIF9wZW5kaW5nU3RhdGUgaXNcbiAgICogaW50ZXJuYWwuIFRoaXMgcHJvdmlkZXMgYSBtZXJnaW5nIHN0cmF0ZWd5IHRoYXQgaXMgbm90IGF2YWlsYWJsZSB0byBkZWVwXG4gICAqIHByb3BlcnRpZXMgd2hpY2ggaXMgY29uZnVzaW5nLiBUT0RPOiBFeHBvc2UgcGVuZGluZ1N0YXRlIG9yIGRvbid0IHVzZSBpdFxuICAgKiBkdXJpbmcgdGhlIG1lcmdlLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB0aGF0IHNob3VsZCByZXJlbmRlci5cbiAgICogQHBhcmFtIHtvYmplY3R9IHBhcnRpYWxTdGF0ZSBOZXh0IHBhcnRpYWwgc3RhdGUgdG8gYmUgbWVyZ2VkIHdpdGggc3RhdGUuXG4gICAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgY29tcG9uZW50IGlzIHVwZGF0ZWQuXG4gICAqIEBwYXJhbSB7P3N0cmluZ30gTmFtZSBvZiB0aGUgY2FsbGluZyBmdW5jdGlvbiBpbiB0aGUgcHVibGljIEFQSS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBlbnF1ZXVlU2V0U3RhdGU6IGZ1bmN0aW9uIChwdWJsaWNJbnN0YW5jZSwgcGFydGlhbFN0YXRlLCBjYWxsYmFjaywgY2FsbGVyTmFtZSkge1xuICAgIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCAnc2V0U3RhdGUnKTtcbiAgfVxufTtcblxudmFyIGVtcHR5T2JqZWN0ID0ge307XG57XG4gIE9iamVjdC5mcmVlemUoZW1wdHlPYmplY3QpO1xufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgaGVscGVycyBmb3IgdGhlIHVwZGF0aW5nIHN0YXRlIG9mIGEgY29tcG9uZW50LlxuICovXG5mdW5jdGlvbiBDb21wb25lbnQocHJvcHMsIGNvbnRleHQsIHVwZGF0ZXIpIHtcbiAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAvLyBJZiBhIGNvbXBvbmVudCBoYXMgc3RyaW5nIHJlZnMsIHdlIHdpbGwgYXNzaWduIGEgZGlmZmVyZW50IG9iamVjdCBsYXRlci5cbiAgdGhpcy5yZWZzID0gZW1wdHlPYmplY3Q7XG4gIC8vIFdlIGluaXRpYWxpemUgdGhlIGRlZmF1bHQgdXBkYXRlciBidXQgdGhlIHJlYWwgb25lIGdldHMgaW5qZWN0ZWQgYnkgdGhlXG4gIC8vIHJlbmRlcmVyLlxuICB0aGlzLnVwZGF0ZXIgPSB1cGRhdGVyIHx8IFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlO1xufVxuXG5Db21wb25lbnQucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQgPSB7fTtcblxuLyoqXG4gKiBTZXRzIGEgc3Vic2V0IG9mIHRoZSBzdGF0ZS4gQWx3YXlzIHVzZSB0aGlzIHRvIG11dGF0ZVxuICogc3RhdGUuIFlvdSBzaG91bGQgdHJlYXQgYHRoaXMuc3RhdGVgIGFzIGltbXV0YWJsZS5cbiAqXG4gKiBUaGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCBgdGhpcy5zdGF0ZWAgd2lsbCBiZSBpbW1lZGlhdGVseSB1cGRhdGVkLCBzb1xuICogYWNjZXNzaW5nIGB0aGlzLnN0YXRlYCBhZnRlciBjYWxsaW5nIHRoaXMgbWV0aG9kIG1heSByZXR1cm4gdGhlIG9sZCB2YWx1ZS5cbiAqXG4gKiBUaGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCBjYWxscyB0byBgc2V0U3RhdGVgIHdpbGwgcnVuIHN5bmNocm9ub3VzbHksXG4gKiBhcyB0aGV5IG1heSBldmVudHVhbGx5IGJlIGJhdGNoZWQgdG9nZXRoZXIuICBZb3UgY2FuIHByb3ZpZGUgYW4gb3B0aW9uYWxcbiAqIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBleGVjdXRlZCB3aGVuIHRoZSBjYWxsIHRvIHNldFN0YXRlIGlzIGFjdHVhbGx5XG4gKiBjb21wbGV0ZWQuXG4gKlxuICogV2hlbiBhIGZ1bmN0aW9uIGlzIHByb3ZpZGVkIHRvIHNldFN0YXRlLCBpdCB3aWxsIGJlIGNhbGxlZCBhdCBzb21lIHBvaW50IGluXG4gKiB0aGUgZnV0dXJlIChub3Qgc3luY2hyb25vdXNseSkuIEl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIHVwIHRvIGRhdGVcbiAqIGNvbXBvbmVudCBhcmd1bWVudHMgKHN0YXRlLCBwcm9wcywgY29udGV4dCkuIFRoZXNlIHZhbHVlcyBjYW4gYmUgZGlmZmVyZW50XG4gKiBmcm9tIHRoaXMuKiBiZWNhdXNlIHlvdXIgZnVuY3Rpb24gbWF5IGJlIGNhbGxlZCBhZnRlciByZWNlaXZlUHJvcHMgYnV0IGJlZm9yZVxuICogc2hvdWxkQ29tcG9uZW50VXBkYXRlLCBhbmQgdGhpcyBuZXcgc3RhdGUsIHByb3BzLCBhbmQgY29udGV4dCB3aWxsIG5vdCB5ZXQgYmVcbiAqIGFzc2lnbmVkIHRvIHRoaXMuXG4gKlxuICogQHBhcmFtIHtvYmplY3R8ZnVuY3Rpb259IHBhcnRpYWxTdGF0ZSBOZXh0IHBhcnRpYWwgc3RhdGUgb3IgZnVuY3Rpb24gdG9cbiAqICAgICAgICBwcm9kdWNlIG5leHQgcGFydGlhbCBzdGF0ZSB0byBiZSBtZXJnZWQgd2l0aCBjdXJyZW50IHN0YXRlLlxuICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciBzdGF0ZSBpcyB1cGRhdGVkLlxuICogQGZpbmFsXG4gKiBAcHJvdGVjdGVkXG4gKi9cbkNvbXBvbmVudC5wcm90b3R5cGUuc2V0U3RhdGUgPSBmdW5jdGlvbiAocGFydGlhbFN0YXRlLCBjYWxsYmFjaykge1xuICAhKHR5cGVvZiBwYXJ0aWFsU3RhdGUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBwYXJ0aWFsU3RhdGUgPT09ICdmdW5jdGlvbicgfHwgcGFydGlhbFN0YXRlID09IG51bGwpID8gaW52YXJpYW50KGZhbHNlLCAnc2V0U3RhdGUoLi4uKTogdGFrZXMgYW4gb2JqZWN0IG9mIHN0YXRlIHZhcmlhYmxlcyB0byB1cGRhdGUgb3IgYSBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGFuIG9iamVjdCBvZiBzdGF0ZSB2YXJpYWJsZXMuJykgOiB2b2lkIDA7XG4gIHRoaXMudXBkYXRlci5lbnF1ZXVlU2V0U3RhdGUodGhpcywgcGFydGlhbFN0YXRlLCBjYWxsYmFjaywgJ3NldFN0YXRlJyk7XG59O1xuXG4vKipcbiAqIEZvcmNlcyBhbiB1cGRhdGUuIFRoaXMgc2hvdWxkIG9ubHkgYmUgaW52b2tlZCB3aGVuIGl0IGlzIGtub3duIHdpdGhcbiAqIGNlcnRhaW50eSB0aGF0IHdlIGFyZSAqKm5vdCoqIGluIGEgRE9NIHRyYW5zYWN0aW9uLlxuICpcbiAqIFlvdSBtYXkgd2FudCB0byBjYWxsIHRoaXMgd2hlbiB5b3Uga25vdyB0aGF0IHNvbWUgZGVlcGVyIGFzcGVjdCBvZiB0aGVcbiAqIGNvbXBvbmVudCdzIHN0YXRlIGhhcyBjaGFuZ2VkIGJ1dCBgc2V0U3RhdGVgIHdhcyBub3QgY2FsbGVkLlxuICpcbiAqIFRoaXMgd2lsbCBub3QgaW52b2tlIGBzaG91bGRDb21wb25lbnRVcGRhdGVgLCBidXQgaXQgd2lsbCBpbnZva2VcbiAqIGBjb21wb25lbnRXaWxsVXBkYXRlYCBhbmQgYGNvbXBvbmVudERpZFVwZGF0ZWAuXG4gKlxuICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciB1cGRhdGUgaXMgY29tcGxldGUuXG4gKiBAZmluYWxcbiAqIEBwcm90ZWN0ZWRcbiAqL1xuQ29tcG9uZW50LnByb3RvdHlwZS5mb3JjZVVwZGF0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICB0aGlzLnVwZGF0ZXIuZW5xdWV1ZUZvcmNlVXBkYXRlKHRoaXMsIGNhbGxiYWNrLCAnZm9yY2VVcGRhdGUnKTtcbn07XG5cbi8qKlxuICogRGVwcmVjYXRlZCBBUElzLiBUaGVzZSBBUElzIHVzZWQgdG8gZXhpc3Qgb24gY2xhc3NpYyBSZWFjdCBjbGFzc2VzIGJ1dCBzaW5jZVxuICogd2Ugd291bGQgbGlrZSB0byBkZXByZWNhdGUgdGhlbSwgd2UncmUgbm90IGdvaW5nIHRvIG1vdmUgdGhlbSBvdmVyIHRvIHRoaXNcbiAqIG1vZGVybiBiYXNlIGNsYXNzLiBJbnN0ZWFkLCB3ZSBkZWZpbmUgYSBnZXR0ZXIgdGhhdCB3YXJucyBpZiBpdCdzIGFjY2Vzc2VkLlxuICovXG57XG4gIHZhciBkZXByZWNhdGVkQVBJcyA9IHtcbiAgICBpc01vdW50ZWQ6IFsnaXNNb3VudGVkJywgJ0luc3RlYWQsIG1ha2Ugc3VyZSB0byBjbGVhbiB1cCBzdWJzY3JpcHRpb25zIGFuZCBwZW5kaW5nIHJlcXVlc3RzIGluICcgKyAnY29tcG9uZW50V2lsbFVubW91bnQgdG8gcHJldmVudCBtZW1vcnkgbGVha3MuJ10sXG4gICAgcmVwbGFjZVN0YXRlOiBbJ3JlcGxhY2VTdGF0ZScsICdSZWZhY3RvciB5b3VyIGNvZGUgdG8gdXNlIHNldFN0YXRlIGluc3RlYWQgKHNlZSAnICsgJ2h0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9pc3N1ZXMvMzIzNikuJ11cbiAgfTtcbiAgdmFyIGRlZmluZURlcHJlY2F0aW9uV2FybmluZyA9IGZ1bmN0aW9uIChtZXRob2ROYW1lLCBpbmZvKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbXBvbmVudC5wcm90b3R5cGUsIG1ldGhvZE5hbWUsIHtcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICBsb3dQcmlvcml0eVdhcm5pbmckMShmYWxzZSwgJyVzKC4uLikgaXMgZGVwcmVjYXRlZCBpbiBwbGFpbiBKYXZhU2NyaXB0IFJlYWN0IGNsYXNzZXMuICVzJywgaW5mb1swXSwgaW5mb1sxXSk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIGZvciAodmFyIGZuTmFtZSBpbiBkZXByZWNhdGVkQVBJcykge1xuICAgIGlmIChkZXByZWNhdGVkQVBJcy5oYXNPd25Qcm9wZXJ0eShmbk5hbWUpKSB7XG4gICAgICBkZWZpbmVEZXByZWNhdGlvbldhcm5pbmcoZm5OYW1lLCBkZXByZWNhdGVkQVBJc1tmbk5hbWVdKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gQ29tcG9uZW50RHVtbXkoKSB7fVxuQ29tcG9uZW50RHVtbXkucHJvdG90eXBlID0gQ29tcG9uZW50LnByb3RvdHlwZTtcblxuLyoqXG4gKiBDb252ZW5pZW5jZSBjb21wb25lbnQgd2l0aCBkZWZhdWx0IHNoYWxsb3cgZXF1YWxpdHkgY2hlY2sgZm9yIHNDVS5cbiAqL1xuZnVuY3Rpb24gUHVyZUNvbXBvbmVudChwcm9wcywgY29udGV4dCwgdXBkYXRlcikge1xuICB0aGlzLnByb3BzID0gcHJvcHM7XG4gIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIC8vIElmIGEgY29tcG9uZW50IGhhcyBzdHJpbmcgcmVmcywgd2Ugd2lsbCBhc3NpZ24gYSBkaWZmZXJlbnQgb2JqZWN0IGxhdGVyLlxuICB0aGlzLnJlZnMgPSBlbXB0eU9iamVjdDtcbiAgdGhpcy51cGRhdGVyID0gdXBkYXRlciB8fCBSZWFjdE5vb3BVcGRhdGVRdWV1ZTtcbn1cblxudmFyIHB1cmVDb21wb25lbnRQcm90b3R5cGUgPSBQdXJlQ29tcG9uZW50LnByb3RvdHlwZSA9IG5ldyBDb21wb25lbnREdW1teSgpO1xucHVyZUNvbXBvbmVudFByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFB1cmVDb21wb25lbnQ7XG4vLyBBdm9pZCBhbiBleHRyYSBwcm90b3R5cGUganVtcCBmb3IgdGhlc2UgbWV0aG9kcy5cbl9hc3NpZ24ocHVyZUNvbXBvbmVudFByb3RvdHlwZSwgQ29tcG9uZW50LnByb3RvdHlwZSk7XG5wdXJlQ29tcG9uZW50UHJvdG90eXBlLmlzUHVyZVJlYWN0Q29tcG9uZW50ID0gdHJ1ZTtcblxuLy8gYW4gaW1tdXRhYmxlIG9iamVjdCB3aXRoIGEgc2luZ2xlIG11dGFibGUgdmFsdWVcbmZ1bmN0aW9uIGNyZWF0ZVJlZigpIHtcbiAgdmFyIHJlZk9iamVjdCA9IHtcbiAgICBjdXJyZW50OiBudWxsXG4gIH07XG4gIHtcbiAgICBPYmplY3Quc2VhbChyZWZPYmplY3QpO1xuICB9XG4gIHJldHVybiByZWZPYmplY3Q7XG59XG5cbi8qKlxuICogS2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnQgb3duZXIuXG4gKlxuICogVGhlIGN1cnJlbnQgb3duZXIgaXMgdGhlIGNvbXBvbmVudCB3aG8gc2hvdWxkIG93biBhbnkgY29tcG9uZW50cyB0aGF0IGFyZVxuICogY3VycmVudGx5IGJlaW5nIGNvbnN0cnVjdGVkLlxuICovXG52YXIgUmVhY3RDdXJyZW50T3duZXIgPSB7XG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQHR5cGUge1JlYWN0Q29tcG9uZW50fVxuICAgKi9cbiAgY3VycmVudDogbnVsbCxcbiAgY3VycmVudERpc3BhdGNoZXI6IG51bGxcbn07XG5cbnZhciBCRUZPUkVfU0xBU0hfUkUgPSAvXiguKilbXFxcXFxcL10vO1xuXG52YXIgZGVzY3JpYmVDb21wb25lbnRGcmFtZSA9IGZ1bmN0aW9uIChuYW1lLCBzb3VyY2UsIG93bmVyTmFtZSkge1xuICB2YXIgc291cmNlSW5mbyA9ICcnO1xuICBpZiAoc291cmNlKSB7XG4gICAgdmFyIHBhdGggPSBzb3VyY2UuZmlsZU5hbWU7XG4gICAgdmFyIGZpbGVOYW1lID0gcGF0aC5yZXBsYWNlKEJFRk9SRV9TTEFTSF9SRSwgJycpO1xuICAgIHtcbiAgICAgIC8vIEluIERFViwgaW5jbHVkZSBjb2RlIGZvciBhIGNvbW1vbiBzcGVjaWFsIGNhc2U6XG4gICAgICAvLyBwcmVmZXIgXCJmb2xkZXIvaW5kZXguanNcIiBpbnN0ZWFkIG9mIGp1c3QgXCJpbmRleC5qc1wiLlxuICAgICAgaWYgKC9eaW5kZXhcXC4vLnRlc3QoZmlsZU5hbWUpKSB7XG4gICAgICAgIHZhciBtYXRjaCA9IHBhdGgubWF0Y2goQkVGT1JFX1NMQVNIX1JFKTtcbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgdmFyIHBhdGhCZWZvcmVTbGFzaCA9IG1hdGNoWzFdO1xuICAgICAgICAgIGlmIChwYXRoQmVmb3JlU2xhc2gpIHtcbiAgICAgICAgICAgIHZhciBmb2xkZXJOYW1lID0gcGF0aEJlZm9yZVNsYXNoLnJlcGxhY2UoQkVGT1JFX1NMQVNIX1JFLCAnJyk7XG4gICAgICAgICAgICBmaWxlTmFtZSA9IGZvbGRlck5hbWUgKyAnLycgKyBmaWxlTmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgc291cmNlSW5mbyA9ICcgKGF0ICcgKyBmaWxlTmFtZSArICc6JyArIHNvdXJjZS5saW5lTnVtYmVyICsgJyknO1xuICB9IGVsc2UgaWYgKG93bmVyTmFtZSkge1xuICAgIHNvdXJjZUluZm8gPSAnIChjcmVhdGVkIGJ5ICcgKyBvd25lck5hbWUgKyAnKSc7XG4gIH1cbiAgcmV0dXJuICdcXG4gICAgaW4gJyArIChuYW1lIHx8ICdVbmtub3duJykgKyBzb3VyY2VJbmZvO1xufTtcblxudmFyIFJlc29sdmVkID0gMTtcblxuXG5mdW5jdGlvbiByZWZpbmVSZXNvbHZlZExhenlDb21wb25lbnQobGF6eUNvbXBvbmVudCkge1xuICByZXR1cm4gbGF6eUNvbXBvbmVudC5fc3RhdHVzID09PSBSZXNvbHZlZCA/IGxhenlDb21wb25lbnQuX3Jlc3VsdCA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGdldFdyYXBwZWROYW1lKG91dGVyVHlwZSwgaW5uZXJUeXBlLCB3cmFwcGVyTmFtZSkge1xuICB2YXIgZnVuY3Rpb25OYW1lID0gaW5uZXJUeXBlLmRpc3BsYXlOYW1lIHx8IGlubmVyVHlwZS5uYW1lIHx8ICcnO1xuICByZXR1cm4gb3V0ZXJUeXBlLmRpc3BsYXlOYW1lIHx8IChmdW5jdGlvbk5hbWUgIT09ICcnID8gd3JhcHBlck5hbWUgKyAnKCcgKyBmdW5jdGlvbk5hbWUgKyAnKScgOiB3cmFwcGVyTmFtZSk7XG59XG5cbmZ1bmN0aW9uIGdldENvbXBvbmVudE5hbWUodHlwZSkge1xuICBpZiAodHlwZSA9PSBudWxsKSB7XG4gICAgLy8gSG9zdCByb290LCB0ZXh0IG5vZGUgb3IganVzdCBpbnZhbGlkIHR5cGUuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAge1xuICAgIGlmICh0eXBlb2YgdHlwZS50YWcgPT09ICdudW1iZXInKSB7XG4gICAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdSZWNlaXZlZCBhbiB1bmV4cGVjdGVkIG9iamVjdCBpbiBnZXRDb21wb25lbnROYW1lKCkuICcgKyAnVGhpcyBpcyBsaWtlbHkgYSBidWcgaW4gUmVhY3QuIFBsZWFzZSBmaWxlIGFuIGlzc3VlLicpO1xuICAgIH1cbiAgfVxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdHlwZS5kaXNwbGF5TmFtZSB8fCB0eXBlLm5hbWUgfHwgbnVsbDtcbiAgfVxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHR5cGU7XG4gIH1cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRTpcbiAgICAgIHJldHVybiAnQ29uY3VycmVudE1vZGUnO1xuICAgIGNhc2UgUkVBQ1RfRlJBR01FTlRfVFlQRTpcbiAgICAgIHJldHVybiAnRnJhZ21lbnQnO1xuICAgIGNhc2UgUkVBQ1RfUE9SVEFMX1RZUEU6XG4gICAgICByZXR1cm4gJ1BvcnRhbCc7XG4gICAgY2FzZSBSRUFDVF9QUk9GSUxFUl9UWVBFOlxuICAgICAgcmV0dXJuICdQcm9maWxlcic7XG4gICAgY2FzZSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFOlxuICAgICAgcmV0dXJuICdTdHJpY3RNb2RlJztcbiAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX1RZUEU6XG4gICAgICByZXR1cm4gJ1N1c3BlbnNlJztcbiAgfVxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgc3dpdGNoICh0eXBlLiQkdHlwZW9mKSB7XG4gICAgICBjYXNlIFJFQUNUX0NPTlRFWFRfVFlQRTpcbiAgICAgICAgcmV0dXJuICdDb250ZXh0LkNvbnN1bWVyJztcbiAgICAgIGNhc2UgUkVBQ1RfUFJPVklERVJfVFlQRTpcbiAgICAgICAgcmV0dXJuICdDb250ZXh0LlByb3ZpZGVyJztcbiAgICAgIGNhc2UgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTpcbiAgICAgICAgcmV0dXJuIGdldFdyYXBwZWROYW1lKHR5cGUsIHR5cGUucmVuZGVyLCAnRm9yd2FyZFJlZicpO1xuICAgICAgY2FzZSBSRUFDVF9NRU1PX1RZUEU6XG4gICAgICAgIHJldHVybiBnZXRDb21wb25lbnROYW1lKHR5cGUudHlwZSk7XG4gICAgICBjYXNlIFJFQUNUX0xBWllfVFlQRTpcbiAgICAgICAge1xuICAgICAgICAgIHZhciB0aGVuYWJsZSA9IHR5cGU7XG4gICAgICAgICAgdmFyIHJlc29sdmVkVGhlbmFibGUgPSByZWZpbmVSZXNvbHZlZExhenlDb21wb25lbnQodGhlbmFibGUpO1xuICAgICAgICAgIGlmIChyZXNvbHZlZFRoZW5hYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0Q29tcG9uZW50TmFtZShyZXNvbHZlZFRoZW5hYmxlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbnZhciBSZWFjdERlYnVnQ3VycmVudEZyYW1lID0ge307XG5cbnZhciBjdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCA9IG51bGw7XG5cbmZ1bmN0aW9uIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGVsZW1lbnQpIHtcbiAge1xuICAgIGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50ID0gZWxlbWVudDtcbiAgfVxufVxuXG57XG4gIC8vIFN0YWNrIGltcGxlbWVudGF0aW9uIGluamVjdGVkIGJ5IHRoZSBjdXJyZW50IHJlbmRlcmVyLlxuICBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldEN1cnJlbnRTdGFjayA9IG51bGw7XG5cbiAgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRTdGFja0FkZGVuZHVtID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdGFjayA9ICcnO1xuXG4gICAgLy8gQWRkIGFuIGV4dHJhIHRvcCBmcmFtZSB3aGlsZSBhbiBlbGVtZW50IGlzIGJlaW5nIHZhbGlkYXRlZFxuICAgIGlmIChjdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCkge1xuICAgICAgdmFyIG5hbWUgPSBnZXRDb21wb25lbnROYW1lKGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50LnR5cGUpO1xuICAgICAgdmFyIG93bmVyID0gY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQuX293bmVyO1xuICAgICAgc3RhY2sgKz0gZGVzY3JpYmVDb21wb25lbnRGcmFtZShuYW1lLCBjdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudC5fc291cmNlLCBvd25lciAmJiBnZXRDb21wb25lbnROYW1lKG93bmVyLnR5cGUpKTtcbiAgICB9XG5cbiAgICAvLyBEZWxlZ2F0ZSB0byB0aGUgaW5qZWN0ZWQgcmVuZGVyZXItc3BlY2lmaWMgaW1wbGVtZW50YXRpb25cbiAgICB2YXIgaW1wbCA9IFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0Q3VycmVudFN0YWNrO1xuICAgIGlmIChpbXBsKSB7XG4gICAgICBzdGFjayArPSBpbXBsKCkgfHwgJyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YWNrO1xuICB9O1xufVxuXG52YXIgUmVhY3RTaGFyZWRJbnRlcm5hbHMgPSB7XG4gIFJlYWN0Q3VycmVudE93bmVyOiBSZWFjdEN1cnJlbnRPd25lcixcbiAgLy8gVXNlZCBieSByZW5kZXJlcnMgdG8gYXZvaWQgYnVuZGxpbmcgb2JqZWN0LWFzc2lnbiB0d2ljZSBpbiBVTUQgYnVuZGxlczpcbiAgYXNzaWduOiBfYXNzaWduXG59O1xuXG57XG4gIF9hc3NpZ24oUmVhY3RTaGFyZWRJbnRlcm5hbHMsIHtcbiAgICAvLyBUaGVzZSBzaG91bGQgbm90IGJlIGluY2x1ZGVkIGluIHByb2R1Y3Rpb24uXG4gICAgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZTogUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSxcbiAgICAvLyBTaGltIGZvciBSZWFjdCBET00gMTYuMC4wIHdoaWNoIHN0aWxsIGRlc3RydWN0dXJlZCAoYnV0IG5vdCB1c2VkKSB0aGlzLlxuICAgIC8vIFRPRE86IHJlbW92ZSBpbiBSZWFjdCAxNy4wLlxuICAgIFJlYWN0Q29tcG9uZW50VHJlZUhvb2s6IHt9XG4gIH0pO1xufVxuXG4vKipcbiAqIFNpbWlsYXIgdG8gaW52YXJpYW50IGJ1dCBvbmx5IGxvZ3MgYSB3YXJuaW5nIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IG1ldC5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbG9nIGlzc3VlcyBpbiBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMgaW4gY3JpdGljYWxcbiAqIHBhdGhzLiBSZW1vdmluZyB0aGUgbG9nZ2luZyBjb2RlIGZvciBwcm9kdWN0aW9uIGVudmlyb25tZW50cyB3aWxsIGtlZXAgdGhlXG4gKiBzYW1lIGxvZ2ljIGFuZCBmb2xsb3cgdGhlIHNhbWUgY29kZSBwYXRocy5cbiAqL1xuXG52YXIgd2FybmluZyA9IHdhcm5pbmdXaXRob3V0U3RhY2skMTtcblxue1xuICB3YXJuaW5nID0gZnVuY3Rpb24gKGNvbmRpdGlvbiwgZm9ybWF0KSB7XG4gICAgaWYgKGNvbmRpdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLlJlYWN0RGVidWdDdXJyZW50RnJhbWU7XG4gICAgdmFyIHN0YWNrID0gUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRTdGFja0FkZGVuZHVtKCk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWludGVybmFsL3dhcm5pbmctYW5kLWludmFyaWFudC1hcmdzXG5cbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAyID8gX2xlbiAtIDIgOiAwKSwgX2tleSA9IDI7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHdhcm5pbmdXaXRob3V0U3RhY2skMS5hcHBseSh1bmRlZmluZWQsIFtmYWxzZSwgZm9ybWF0ICsgJyVzJ10uY29uY2F0KGFyZ3MsIFtzdGFja10pKTtcbiAgfTtcbn1cblxudmFyIHdhcm5pbmckMSA9IHdhcm5pbmc7XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbnZhciBSRVNFUlZFRF9QUk9QUyA9IHtcbiAga2V5OiB0cnVlLFxuICByZWY6IHRydWUsXG4gIF9fc2VsZjogdHJ1ZSxcbiAgX19zb3VyY2U6IHRydWVcbn07XG5cbnZhciBzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93biA9IHZvaWQgMDtcbnZhciBzcGVjaWFsUHJvcFJlZldhcm5pbmdTaG93biA9IHZvaWQgMDtcblxuZnVuY3Rpb24gaGFzVmFsaWRSZWYoY29uZmlnKSB7XG4gIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsICdyZWYnKSkge1xuICAgICAgdmFyIGdldHRlciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY29uZmlnLCAncmVmJykuZ2V0O1xuICAgICAgaWYgKGdldHRlciAmJiBnZXR0ZXIuaXNSZWFjdFdhcm5pbmcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY29uZmlnLnJlZiAhPT0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBoYXNWYWxpZEtleShjb25maWcpIHtcbiAge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgJ2tleScpKSB7XG4gICAgICB2YXIgZ2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjb25maWcsICdrZXknKS5nZXQ7XG4gICAgICBpZiAoZ2V0dGVyICYmIGdldHRlci5pc1JlYWN0V2FybmluZykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBjb25maWcua2V5ICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGRlZmluZUtleVByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSkge1xuICB2YXIgd2FybkFib3V0QWNjZXNzaW5nS2V5ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd24pIHtcbiAgICAgIHNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duID0gdHJ1ZTtcbiAgICAgIHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJyVzOiBga2V5YCBpcyBub3QgYSBwcm9wLiBUcnlpbmcgdG8gYWNjZXNzIGl0IHdpbGwgcmVzdWx0ICcgKyAnaW4gYHVuZGVmaW5lZGAgYmVpbmcgcmV0dXJuZWQuIElmIHlvdSBuZWVkIHRvIGFjY2VzcyB0aGUgc2FtZSAnICsgJ3ZhbHVlIHdpdGhpbiB0aGUgY2hpbGQgY29tcG9uZW50LCB5b3Ugc2hvdWxkIHBhc3MgaXQgYXMgYSBkaWZmZXJlbnQgJyArICdwcm9wLiAoaHR0cHM6Ly9mYi5tZS9yZWFjdC1zcGVjaWFsLXByb3BzKScsIGRpc3BsYXlOYW1lKTtcbiAgICB9XG4gIH07XG4gIHdhcm5BYm91dEFjY2Vzc2luZ0tleS5pc1JlYWN0V2FybmluZyA9IHRydWU7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm9wcywgJ2tleScsIHtcbiAgICBnZXQ6IHdhcm5BYm91dEFjY2Vzc2luZ0tleSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRlZmluZVJlZlByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSkge1xuICB2YXIgd2FybkFib3V0QWNjZXNzaW5nUmVmID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd24pIHtcbiAgICAgIHNwZWNpYWxQcm9wUmVmV2FybmluZ1Nob3duID0gdHJ1ZTtcbiAgICAgIHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJyVzOiBgcmVmYCBpcyBub3QgYSBwcm9wLiBUcnlpbmcgdG8gYWNjZXNzIGl0IHdpbGwgcmVzdWx0ICcgKyAnaW4gYHVuZGVmaW5lZGAgYmVpbmcgcmV0dXJuZWQuIElmIHlvdSBuZWVkIHRvIGFjY2VzcyB0aGUgc2FtZSAnICsgJ3ZhbHVlIHdpdGhpbiB0aGUgY2hpbGQgY29tcG9uZW50LCB5b3Ugc2hvdWxkIHBhc3MgaXQgYXMgYSBkaWZmZXJlbnQgJyArICdwcm9wLiAoaHR0cHM6Ly9mYi5tZS9yZWFjdC1zcGVjaWFsLXByb3BzKScsIGRpc3BsYXlOYW1lKTtcbiAgICB9XG4gIH07XG4gIHdhcm5BYm91dEFjY2Vzc2luZ1JlZi5pc1JlYWN0V2FybmluZyA9IHRydWU7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm9wcywgJ3JlZicsIHtcbiAgICBnZXQ6IHdhcm5BYm91dEFjY2Vzc2luZ1JlZixcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbi8qKlxuICogRmFjdG9yeSBtZXRob2QgdG8gY3JlYXRlIGEgbmV3IFJlYWN0IGVsZW1lbnQuIFRoaXMgbm8gbG9uZ2VyIGFkaGVyZXMgdG9cbiAqIHRoZSBjbGFzcyBwYXR0ZXJuLCBzbyBkbyBub3QgdXNlIG5ldyB0byBjYWxsIGl0LiBBbHNvLCBubyBpbnN0YW5jZW9mIGNoZWNrXG4gKiB3aWxsIHdvcmsuIEluc3RlYWQgdGVzdCAkJHR5cGVvZiBmaWVsZCBhZ2FpbnN0IFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSB0byBjaGVja1xuICogaWYgc29tZXRoaW5nIGlzIGEgUmVhY3QgRWxlbWVudC5cbiAqXG4gKiBAcGFyYW0geyp9IHR5cGVcbiAqIEBwYXJhbSB7Kn0ga2V5XG4gKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IHJlZlxuICogQHBhcmFtIHsqfSBzZWxmIEEgKnRlbXBvcmFyeSogaGVscGVyIHRvIGRldGVjdCBwbGFjZXMgd2hlcmUgYHRoaXNgIGlzXG4gKiBkaWZmZXJlbnQgZnJvbSB0aGUgYG93bmVyYCB3aGVuIFJlYWN0LmNyZWF0ZUVsZW1lbnQgaXMgY2FsbGVkLCBzbyB0aGF0IHdlXG4gKiBjYW4gd2Fybi4gV2Ugd2FudCB0byBnZXQgcmlkIG9mIG93bmVyIGFuZCByZXBsYWNlIHN0cmluZyBgcmVmYHMgd2l0aCBhcnJvd1xuICogZnVuY3Rpb25zLCBhbmQgYXMgbG9uZyBhcyBgdGhpc2AgYW5kIG93bmVyIGFyZSB0aGUgc2FtZSwgdGhlcmUgd2lsbCBiZSBub1xuICogY2hhbmdlIGluIGJlaGF2aW9yLlxuICogQHBhcmFtIHsqfSBzb3VyY2UgQW4gYW5ub3RhdGlvbiBvYmplY3QgKGFkZGVkIGJ5IGEgdHJhbnNwaWxlciBvciBvdGhlcndpc2UpXG4gKiBpbmRpY2F0aW5nIGZpbGVuYW1lLCBsaW5lIG51bWJlciwgYW5kL29yIG90aGVyIGluZm9ybWF0aW9uLlxuICogQHBhcmFtIHsqfSBvd25lclxuICogQHBhcmFtIHsqfSBwcm9wc1xuICogQGludGVybmFsXG4gKi9cbnZhciBSZWFjdEVsZW1lbnQgPSBmdW5jdGlvbiAodHlwZSwga2V5LCByZWYsIHNlbGYsIHNvdXJjZSwgb3duZXIsIHByb3BzKSB7XG4gIHZhciBlbGVtZW50ID0ge1xuICAgIC8vIFRoaXMgdGFnIGFsbG93cyB1cyB0byB1bmlxdWVseSBpZGVudGlmeSB0aGlzIGFzIGEgUmVhY3QgRWxlbWVudFxuICAgICQkdHlwZW9mOiBSRUFDVF9FTEVNRU5UX1RZUEUsXG5cbiAgICAvLyBCdWlsdC1pbiBwcm9wZXJ0aWVzIHRoYXQgYmVsb25nIG9uIHRoZSBlbGVtZW50XG4gICAgdHlwZTogdHlwZSxcbiAgICBrZXk6IGtleSxcbiAgICByZWY6IHJlZixcbiAgICBwcm9wczogcHJvcHMsXG5cbiAgICAvLyBSZWNvcmQgdGhlIGNvbXBvbmVudCByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhpcyBlbGVtZW50LlxuICAgIF9vd25lcjogb3duZXJcbiAgfTtcblxuICB7XG4gICAgLy8gVGhlIHZhbGlkYXRpb24gZmxhZyBpcyBjdXJyZW50bHkgbXV0YXRpdmUuIFdlIHB1dCBpdCBvblxuICAgIC8vIGFuIGV4dGVybmFsIGJhY2tpbmcgc3RvcmUgc28gdGhhdCB3ZSBjYW4gZnJlZXplIHRoZSB3aG9sZSBvYmplY3QuXG4gICAgLy8gVGhpcyBjYW4gYmUgcmVwbGFjZWQgd2l0aCBhIFdlYWtNYXAgb25jZSB0aGV5IGFyZSBpbXBsZW1lbnRlZCBpblxuICAgIC8vIGNvbW1vbmx5IHVzZWQgZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzLlxuICAgIGVsZW1lbnQuX3N0b3JlID0ge307XG5cbiAgICAvLyBUbyBtYWtlIGNvbXBhcmluZyBSZWFjdEVsZW1lbnRzIGVhc2llciBmb3IgdGVzdGluZyBwdXJwb3Nlcywgd2UgbWFrZVxuICAgIC8vIHRoZSB2YWxpZGF0aW9uIGZsYWcgbm9uLWVudW1lcmFibGUgKHdoZXJlIHBvc3NpYmxlLCB3aGljaCBzaG91bGRcbiAgICAvLyBpbmNsdWRlIGV2ZXJ5IGVudmlyb25tZW50IHdlIHJ1biB0ZXN0cyBpbiksIHNvIHRoZSB0ZXN0IGZyYW1ld29ya1xuICAgIC8vIGlnbm9yZXMgaXQuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQuX3N0b3JlLCAndmFsaWRhdGVkJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICB2YWx1ZTogZmFsc2VcbiAgICB9KTtcbiAgICAvLyBzZWxmIGFuZCBzb3VyY2UgYXJlIERFViBvbmx5IHByb3BlcnRpZXMuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQsICdfc2VsZicsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBzZWxmXG4gICAgfSk7XG4gICAgLy8gVHdvIGVsZW1lbnRzIGNyZWF0ZWQgaW4gdHdvIGRpZmZlcmVudCBwbGFjZXMgc2hvdWxkIGJlIGNvbnNpZGVyZWRcbiAgICAvLyBlcXVhbCBmb3IgdGVzdGluZyBwdXJwb3NlcyBhbmQgdGhlcmVmb3JlIHdlIGhpZGUgaXQgZnJvbSBlbnVtZXJhdGlvbi5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudCwgJ19zb3VyY2UnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogc291cmNlXG4gICAgfSk7XG4gICAgaWYgKE9iamVjdC5mcmVlemUpIHtcbiAgICAgIE9iamVjdC5mcmVlemUoZWxlbWVudC5wcm9wcyk7XG4gICAgICBPYmplY3QuZnJlZXplKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYW5kIHJldHVybiBhIG5ldyBSZWFjdEVsZW1lbnQgb2YgdGhlIGdpdmVuIHR5cGUuXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI2NyZWF0ZWVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0eXBlLCBjb25maWcsIGNoaWxkcmVuKSB7XG4gIHZhciBwcm9wTmFtZSA9IHZvaWQgMDtcblxuICAvLyBSZXNlcnZlZCBuYW1lcyBhcmUgZXh0cmFjdGVkXG4gIHZhciBwcm9wcyA9IHt9O1xuXG4gIHZhciBrZXkgPSBudWxsO1xuICB2YXIgcmVmID0gbnVsbDtcbiAgdmFyIHNlbGYgPSBudWxsO1xuICB2YXIgc291cmNlID0gbnVsbDtcblxuICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICBpZiAoaGFzVmFsaWRSZWYoY29uZmlnKSkge1xuICAgICAgcmVmID0gY29uZmlnLnJlZjtcbiAgICB9XG4gICAgaWYgKGhhc1ZhbGlkS2V5KGNvbmZpZykpIHtcbiAgICAgIGtleSA9ICcnICsgY29uZmlnLmtleTtcbiAgICB9XG5cbiAgICBzZWxmID0gY29uZmlnLl9fc2VsZiA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGNvbmZpZy5fX3NlbGY7XG4gICAgc291cmNlID0gY29uZmlnLl9fc291cmNlID09PSB1bmRlZmluZWQgPyBudWxsIDogY29uZmlnLl9fc291cmNlO1xuICAgIC8vIFJlbWFpbmluZyBwcm9wZXJ0aWVzIGFyZSBhZGRlZCB0byBhIG5ldyBwcm9wcyBvYmplY3RcbiAgICBmb3IgKHByb3BOYW1lIGluIGNvbmZpZykge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCBwcm9wTmFtZSkgJiYgIVJFU0VSVkVEX1BST1BTLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBjb25maWdbcHJvcE5hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENoaWxkcmVuIGNhbiBiZSBtb3JlIHRoYW4gb25lIGFyZ3VtZW50LCBhbmQgdGhvc2UgYXJlIHRyYW5zZmVycmVkIG9udG9cbiAgLy8gdGhlIG5ld2x5IGFsbG9jYXRlZCBwcm9wcyBvYmplY3QuXG4gIHZhciBjaGlsZHJlbkxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGggLSAyO1xuICBpZiAoY2hpbGRyZW5MZW5ndGggPT09IDEpIHtcbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICB9IGVsc2UgaWYgKGNoaWxkcmVuTGVuZ3RoID4gMSkge1xuICAgIHZhciBjaGlsZEFycmF5ID0gQXJyYXkoY2hpbGRyZW5MZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW5MZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGRBcnJheVtpXSA9IGFyZ3VtZW50c1tpICsgMl07XG4gICAgfVxuICAgIHtcbiAgICAgIGlmIChPYmplY3QuZnJlZXplKSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUoY2hpbGRBcnJheSk7XG4gICAgICB9XG4gICAgfVxuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRBcnJheTtcbiAgfVxuXG4gIC8vIFJlc29sdmUgZGVmYXVsdCBwcm9wc1xuICBpZiAodHlwZSAmJiB0eXBlLmRlZmF1bHRQcm9wcykge1xuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB0eXBlLmRlZmF1bHRQcm9wcztcbiAgICBmb3IgKHByb3BOYW1lIGluIGRlZmF1bHRQcm9wcykge1xuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGRlZmF1bHRQcm9wc1twcm9wTmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHtcbiAgICBpZiAoa2V5IHx8IHJlZikge1xuICAgICAgdmFyIGRpc3BsYXlOYW1lID0gdHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicgPyB0eXBlLmRpc3BsYXlOYW1lIHx8IHR5cGUubmFtZSB8fCAnVW5rbm93bicgOiB0eXBlO1xuICAgICAgaWYgKGtleSkge1xuICAgICAgICBkZWZpbmVLZXlQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpO1xuICAgICAgfVxuICAgICAgaWYgKHJlZikge1xuICAgICAgICBkZWZpbmVSZWZQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gUmVhY3RFbGVtZW50KHR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQsIHByb3BzKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBmdW5jdGlvbiB0aGF0IHByb2R1Y2VzIFJlYWN0RWxlbWVudHMgb2YgYSBnaXZlbiB0eXBlLlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNjcmVhdGVmYWN0b3J5XG4gKi9cblxuXG5mdW5jdGlvbiBjbG9uZUFuZFJlcGxhY2VLZXkob2xkRWxlbWVudCwgbmV3S2V5KSB7XG4gIHZhciBuZXdFbGVtZW50ID0gUmVhY3RFbGVtZW50KG9sZEVsZW1lbnQudHlwZSwgbmV3S2V5LCBvbGRFbGVtZW50LnJlZiwgb2xkRWxlbWVudC5fc2VsZiwgb2xkRWxlbWVudC5fc291cmNlLCBvbGRFbGVtZW50Ll9vd25lciwgb2xkRWxlbWVudC5wcm9wcyk7XG5cbiAgcmV0dXJuIG5ld0VsZW1lbnQ7XG59XG5cbi8qKlxuICogQ2xvbmUgYW5kIHJldHVybiBhIG5ldyBSZWFjdEVsZW1lbnQgdXNpbmcgZWxlbWVudCBhcyB0aGUgc3RhcnRpbmcgcG9pbnQuXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI2Nsb25lZWxlbWVudFxuICovXG5mdW5jdGlvbiBjbG9uZUVsZW1lbnQoZWxlbWVudCwgY29uZmlnLCBjaGlsZHJlbikge1xuICAhIShlbGVtZW50ID09PSBudWxsIHx8IGVsZW1lbnQgPT09IHVuZGVmaW5lZCkgPyBpbnZhcmlhbnQoZmFsc2UsICdSZWFjdC5jbG9uZUVsZW1lbnQoLi4uKTogVGhlIGFyZ3VtZW50IG11c3QgYmUgYSBSZWFjdCBlbGVtZW50LCBidXQgeW91IHBhc3NlZCAlcy4nLCBlbGVtZW50KSA6IHZvaWQgMDtcblxuICB2YXIgcHJvcE5hbWUgPSB2b2lkIDA7XG5cbiAgLy8gT3JpZ2luYWwgcHJvcHMgYXJlIGNvcGllZFxuICB2YXIgcHJvcHMgPSBfYXNzaWduKHt9LCBlbGVtZW50LnByb3BzKTtcblxuICAvLyBSZXNlcnZlZCBuYW1lcyBhcmUgZXh0cmFjdGVkXG4gIHZhciBrZXkgPSBlbGVtZW50LmtleTtcbiAgdmFyIHJlZiA9IGVsZW1lbnQucmVmO1xuICAvLyBTZWxmIGlzIHByZXNlcnZlZCBzaW5jZSB0aGUgb3duZXIgaXMgcHJlc2VydmVkLlxuICB2YXIgc2VsZiA9IGVsZW1lbnQuX3NlbGY7XG4gIC8vIFNvdXJjZSBpcyBwcmVzZXJ2ZWQgc2luY2UgY2xvbmVFbGVtZW50IGlzIHVubGlrZWx5IHRvIGJlIHRhcmdldGVkIGJ5IGFcbiAgLy8gdHJhbnNwaWxlciwgYW5kIHRoZSBvcmlnaW5hbCBzb3VyY2UgaXMgcHJvYmFibHkgYSBiZXR0ZXIgaW5kaWNhdG9yIG9mIHRoZVxuICAvLyB0cnVlIG93bmVyLlxuICB2YXIgc291cmNlID0gZWxlbWVudC5fc291cmNlO1xuXG4gIC8vIE93bmVyIHdpbGwgYmUgcHJlc2VydmVkLCB1bmxlc3MgcmVmIGlzIG92ZXJyaWRkZW5cbiAgdmFyIG93bmVyID0gZWxlbWVudC5fb3duZXI7XG5cbiAgaWYgKGNvbmZpZyAhPSBudWxsKSB7XG4gICAgaWYgKGhhc1ZhbGlkUmVmKGNvbmZpZykpIHtcbiAgICAgIC8vIFNpbGVudGx5IHN0ZWFsIHRoZSByZWYgZnJvbSB0aGUgcGFyZW50LlxuICAgICAgcmVmID0gY29uZmlnLnJlZjtcbiAgICAgIG93bmVyID0gUmVhY3RDdXJyZW50T3duZXIuY3VycmVudDtcbiAgICB9XG4gICAgaWYgKGhhc1ZhbGlkS2V5KGNvbmZpZykpIHtcbiAgICAgIGtleSA9ICcnICsgY29uZmlnLmtleTtcbiAgICB9XG5cbiAgICAvLyBSZW1haW5pbmcgcHJvcGVydGllcyBvdmVycmlkZSBleGlzdGluZyBwcm9wc1xuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB2b2lkIDA7XG4gICAgaWYgKGVsZW1lbnQudHlwZSAmJiBlbGVtZW50LnR5cGUuZGVmYXVsdFByb3BzKSB7XG4gICAgICBkZWZhdWx0UHJvcHMgPSBlbGVtZW50LnR5cGUuZGVmYXVsdFByb3BzO1xuICAgIH1cbiAgICBmb3IgKHByb3BOYW1lIGluIGNvbmZpZykge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCBwcm9wTmFtZSkgJiYgIVJFU0VSVkVEX1BST1BTLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgICBpZiAoY29uZmlnW3Byb3BOYW1lXSA9PT0gdW5kZWZpbmVkICYmIGRlZmF1bHRQcm9wcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgLy8gUmVzb2x2ZSBkZWZhdWx0IHByb3BzXG4gICAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gZGVmYXVsdFByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBjb25maWdbcHJvcE5hbWVdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ2hpbGRyZW4gY2FuIGJlIG1vcmUgdGhhbiBvbmUgYXJndW1lbnQsIGFuZCB0aG9zZSBhcmUgdHJhbnNmZXJyZWQgb250b1xuICAvLyB0aGUgbmV3bHkgYWxsb2NhdGVkIHByb3BzIG9iamVjdC5cbiAgdmFyIGNoaWxkcmVuTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCAtIDI7XG4gIGlmIChjaGlsZHJlbkxlbmd0aCA9PT0gMSkge1xuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIH0gZWxzZSBpZiAoY2hpbGRyZW5MZW5ndGggPiAxKSB7XG4gICAgdmFyIGNoaWxkQXJyYXkgPSBBcnJheShjaGlsZHJlbkxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbkxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGlsZEFycmF5W2ldID0gYXJndW1lbnRzW2kgKyAyXTtcbiAgICB9XG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZEFycmF5O1xuICB9XG5cbiAgcmV0dXJuIFJlYWN0RWxlbWVudChlbGVtZW50LnR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIG93bmVyLCBwcm9wcyk7XG59XG5cbi8qKlxuICogVmVyaWZpZXMgdGhlIG9iamVjdCBpcyBhIFJlYWN0RWxlbWVudC5cbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjaXN2YWxpZGVsZW1lbnRcbiAqIEBwYXJhbSB7P29iamVjdH0gb2JqZWN0XG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIGBvYmplY3RgIGlzIGEgUmVhY3RFbGVtZW50LlxuICogQGZpbmFsXG4gKi9cbmZ1bmN0aW9uIGlzVmFsaWRFbGVtZW50KG9iamVjdCkge1xuICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0ICE9PSBudWxsICYmIG9iamVjdC4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFO1xufVxuXG52YXIgU0VQQVJBVE9SID0gJy4nO1xudmFyIFNVQlNFUEFSQVRPUiA9ICc6JztcblxuLyoqXG4gKiBFc2NhcGUgYW5kIHdyYXAga2V5IHNvIGl0IGlzIHNhZmUgdG8gdXNlIGFzIGEgcmVhY3RpZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgdG8gYmUgZXNjYXBlZC5cbiAqIEByZXR1cm4ge3N0cmluZ30gdGhlIGVzY2FwZWQga2V5LlxuICovXG5mdW5jdGlvbiBlc2NhcGUoa2V5KSB7XG4gIHZhciBlc2NhcGVSZWdleCA9IC9bPTpdL2c7XG4gIHZhciBlc2NhcGVyTG9va3VwID0ge1xuICAgICc9JzogJz0wJyxcbiAgICAnOic6ICc9MidcbiAgfTtcbiAgdmFyIGVzY2FwZWRTdHJpbmcgPSAoJycgKyBrZXkpLnJlcGxhY2UoZXNjYXBlUmVnZXgsIGZ1bmN0aW9uIChtYXRjaCkge1xuICAgIHJldHVybiBlc2NhcGVyTG9va3VwW21hdGNoXTtcbiAgfSk7XG5cbiAgcmV0dXJuICckJyArIGVzY2FwZWRTdHJpbmc7XG59XG5cbi8qKlxuICogVE9ETzogVGVzdCB0aGF0IGEgc2luZ2xlIGNoaWxkIGFuZCBhbiBhcnJheSB3aXRoIG9uZSBpdGVtIGhhdmUgdGhlIHNhbWUga2V5XG4gKiBwYXR0ZXJuLlxuICovXG5cbnZhciBkaWRXYXJuQWJvdXRNYXBzID0gZmFsc2U7XG5cbnZhciB1c2VyUHJvdmlkZWRLZXlFc2NhcGVSZWdleCA9IC9cXC8rL2c7XG5mdW5jdGlvbiBlc2NhcGVVc2VyUHJvdmlkZWRLZXkodGV4dCkge1xuICByZXR1cm4gKCcnICsgdGV4dCkucmVwbGFjZSh1c2VyUHJvdmlkZWRLZXlFc2NhcGVSZWdleCwgJyQmLycpO1xufVxuXG52YXIgUE9PTF9TSVpFID0gMTA7XG52YXIgdHJhdmVyc2VDb250ZXh0UG9vbCA9IFtdO1xuZnVuY3Rpb24gZ2V0UG9vbGVkVHJhdmVyc2VDb250ZXh0KG1hcFJlc3VsdCwga2V5UHJlZml4LCBtYXBGdW5jdGlvbiwgbWFwQ29udGV4dCkge1xuICBpZiAodHJhdmVyc2VDb250ZXh0UG9vbC5sZW5ndGgpIHtcbiAgICB2YXIgdHJhdmVyc2VDb250ZXh0ID0gdHJhdmVyc2VDb250ZXh0UG9vbC5wb3AoKTtcbiAgICB0cmF2ZXJzZUNvbnRleHQucmVzdWx0ID0gbWFwUmVzdWx0O1xuICAgIHRyYXZlcnNlQ29udGV4dC5rZXlQcmVmaXggPSBrZXlQcmVmaXg7XG4gICAgdHJhdmVyc2VDb250ZXh0LmZ1bmMgPSBtYXBGdW5jdGlvbjtcbiAgICB0cmF2ZXJzZUNvbnRleHQuY29udGV4dCA9IG1hcENvbnRleHQ7XG4gICAgdHJhdmVyc2VDb250ZXh0LmNvdW50ID0gMDtcbiAgICByZXR1cm4gdHJhdmVyc2VDb250ZXh0O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICByZXN1bHQ6IG1hcFJlc3VsdCxcbiAgICAgIGtleVByZWZpeDoga2V5UHJlZml4LFxuICAgICAgZnVuYzogbWFwRnVuY3Rpb24sXG4gICAgICBjb250ZXh0OiBtYXBDb250ZXh0LFxuICAgICAgY291bnQ6IDBcbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbGVhc2VUcmF2ZXJzZUNvbnRleHQodHJhdmVyc2VDb250ZXh0KSB7XG4gIHRyYXZlcnNlQ29udGV4dC5yZXN1bHQgPSBudWxsO1xuICB0cmF2ZXJzZUNvbnRleHQua2V5UHJlZml4ID0gbnVsbDtcbiAgdHJhdmVyc2VDb250ZXh0LmZ1bmMgPSBudWxsO1xuICB0cmF2ZXJzZUNvbnRleHQuY29udGV4dCA9IG51bGw7XG4gIHRyYXZlcnNlQ29udGV4dC5jb3VudCA9IDA7XG4gIGlmICh0cmF2ZXJzZUNvbnRleHRQb29sLmxlbmd0aCA8IFBPT0xfU0laRSkge1xuICAgIHRyYXZlcnNlQ29udGV4dFBvb2wucHVzaCh0cmF2ZXJzZUNvbnRleHQpO1xuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcGFyYW0geyFzdHJpbmd9IG5hbWVTb0ZhciBOYW1lIG9mIHRoZSBrZXkgcGF0aCBzbyBmYXIuXG4gKiBAcGFyYW0geyFmdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2sgdG8gaW52b2tlIHdpdGggZWFjaCBjaGlsZCBmb3VuZC5cbiAqIEBwYXJhbSB7Pyp9IHRyYXZlcnNlQ29udGV4dCBVc2VkIHRvIHBhc3MgaW5mb3JtYXRpb24gdGhyb3VnaG91dCB0aGUgdHJhdmVyc2FsXG4gKiBwcm9jZXNzLlxuICogQHJldHVybiB7IW51bWJlcn0gVGhlIG51bWJlciBvZiBjaGlsZHJlbiBpbiB0aGlzIHN1YnRyZWUuXG4gKi9cbmZ1bmN0aW9uIHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkcmVuLCBuYW1lU29GYXIsIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgY2hpbGRyZW47XG5cbiAgaWYgKHR5cGUgPT09ICd1bmRlZmluZWQnIHx8IHR5cGUgPT09ICdib29sZWFuJykge1xuICAgIC8vIEFsbCBvZiB0aGUgYWJvdmUgYXJlIHBlcmNlaXZlZCBhcyBudWxsLlxuICAgIGNoaWxkcmVuID0gbnVsbDtcbiAgfVxuXG4gIHZhciBpbnZva2VDYWxsYmFjayA9IGZhbHNlO1xuXG4gIGlmIChjaGlsZHJlbiA9PT0gbnVsbCkge1xuICAgIGludm9rZUNhbGxiYWNrID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBpbnZva2VDYWxsYmFjayA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgc3dpdGNoIChjaGlsZHJlbi4kJHR5cGVvZikge1xuICAgICAgICAgIGNhc2UgUkVBQ1RfRUxFTUVOVF9UWVBFOlxuICAgICAgICAgIGNhc2UgUkVBQ1RfUE9SVEFMX1RZUEU6XG4gICAgICAgICAgICBpbnZva2VDYWxsYmFjayA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoaW52b2tlQ2FsbGJhY2spIHtcbiAgICBjYWxsYmFjayh0cmF2ZXJzZUNvbnRleHQsIGNoaWxkcmVuLFxuICAgIC8vIElmIGl0J3MgdGhlIG9ubHkgY2hpbGQsIHRyZWF0IHRoZSBuYW1lIGFzIGlmIGl0IHdhcyB3cmFwcGVkIGluIGFuIGFycmF5XG4gICAgLy8gc28gdGhhdCBpdCdzIGNvbnNpc3RlbnQgaWYgdGhlIG51bWJlciBvZiBjaGlsZHJlbiBncm93cy5cbiAgICBuYW1lU29GYXIgPT09ICcnID8gU0VQQVJBVE9SICsgZ2V0Q29tcG9uZW50S2V5KGNoaWxkcmVuLCAwKSA6IG5hbWVTb0Zhcik7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICB2YXIgY2hpbGQgPSB2b2lkIDA7XG4gIHZhciBuZXh0TmFtZSA9IHZvaWQgMDtcbiAgdmFyIHN1YnRyZWVDb3VudCA9IDA7IC8vIENvdW50IG9mIGNoaWxkcmVuIGZvdW5kIGluIHRoZSBjdXJyZW50IHN1YnRyZWUuXG4gIHZhciBuZXh0TmFtZVByZWZpeCA9IG5hbWVTb0ZhciA9PT0gJycgPyBTRVBBUkFUT1IgOiBuYW1lU29GYXIgKyBTVUJTRVBBUkFUT1I7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgIG5leHROYW1lID0gbmV4dE5hbWVQcmVmaXggKyBnZXRDb21wb25lbnRLZXkoY2hpbGQsIGkpO1xuICAgICAgc3VidHJlZUNvdW50ICs9IHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkLCBuZXh0TmFtZSwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihjaGlsZHJlbik7XG4gICAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB7XG4gICAgICAgIC8vIFdhcm4gYWJvdXQgdXNpbmcgTWFwcyBhcyBjaGlsZHJlblxuICAgICAgICBpZiAoaXRlcmF0b3JGbiA9PT0gY2hpbGRyZW4uZW50cmllcykge1xuICAgICAgICAgICFkaWRXYXJuQWJvdXRNYXBzID8gd2FybmluZyQxKGZhbHNlLCAnVXNpbmcgTWFwcyBhcyBjaGlsZHJlbiBpcyB1bnN1cHBvcnRlZCBhbmQgd2lsbCBsaWtlbHkgeWllbGQgJyArICd1bmV4cGVjdGVkIHJlc3VsdHMuIENvbnZlcnQgaXQgdG8gYSBzZXF1ZW5jZS9pdGVyYWJsZSBvZiBrZXllZCAnICsgJ1JlYWN0RWxlbWVudHMgaW5zdGVhZC4nKSA6IHZvaWQgMDtcbiAgICAgICAgICBkaWRXYXJuQWJvdXRNYXBzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwoY2hpbGRyZW4pO1xuICAgICAgdmFyIHN0ZXAgPSB2b2lkIDA7XG4gICAgICB2YXIgaWkgPSAwO1xuICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICBjaGlsZCA9IHN0ZXAudmFsdWU7XG4gICAgICAgIG5leHROYW1lID0gbmV4dE5hbWVQcmVmaXggKyBnZXRDb21wb25lbnRLZXkoY2hpbGQsIGlpKyspO1xuICAgICAgICBzdWJ0cmVlQ291bnQgKz0gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoY2hpbGQsIG5leHROYW1lLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICB2YXIgYWRkZW5kdW0gPSAnJztcbiAgICAgIHtcbiAgICAgICAgYWRkZW5kdW0gPSAnIElmIHlvdSBtZWFudCB0byByZW5kZXIgYSBjb2xsZWN0aW9uIG9mIGNoaWxkcmVuLCB1c2UgYW4gYXJyYXkgJyArICdpbnN0ZWFkLicgKyBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldFN0YWNrQWRkZW5kdW0oKTtcbiAgICAgIH1cbiAgICAgIHZhciBjaGlsZHJlblN0cmluZyA9ICcnICsgY2hpbGRyZW47XG4gICAgICBpbnZhcmlhbnQoZmFsc2UsICdPYmplY3RzIGFyZSBub3QgdmFsaWQgYXMgYSBSZWFjdCBjaGlsZCAoZm91bmQ6ICVzKS4lcycsIGNoaWxkcmVuU3RyaW5nID09PSAnW29iamVjdCBPYmplY3RdJyA/ICdvYmplY3Qgd2l0aCBrZXlzIHsnICsgT2JqZWN0LmtleXMoY2hpbGRyZW4pLmpvaW4oJywgJykgKyAnfScgOiBjaGlsZHJlblN0cmluZywgYWRkZW5kdW0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzdWJ0cmVlQ291bnQ7XG59XG5cbi8qKlxuICogVHJhdmVyc2VzIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYCwgYnV0XG4gKiBtaWdodCBhbHNvIGJlIHNwZWNpZmllZCB0aHJvdWdoIGF0dHJpYnV0ZXM6XG4gKlxuICogLSBgdHJhdmVyc2VBbGxDaGlsZHJlbih0aGlzLnByb3BzLmNoaWxkcmVuLCAuLi4pYFxuICogLSBgdHJhdmVyc2VBbGxDaGlsZHJlbih0aGlzLnByb3BzLmxlZnRQYW5lbENoaWxkcmVuLCAuLi4pYFxuICpcbiAqIFRoZSBgdHJhdmVyc2VDb250ZXh0YCBpcyBhbiBvcHRpb25hbCBhcmd1bWVudCB0aGF0IGlzIHBhc3NlZCB0aHJvdWdoIHRoZVxuICogZW50aXJlIHRyYXZlcnNhbC4gSXQgY2FuIGJlIHVzZWQgdG8gc3RvcmUgYWNjdW11bGF0aW9ucyBvciBhbnl0aGluZyBlbHNlIHRoYXRcbiAqIHRoZSBjYWxsYmFjayBtaWdodCBmaW5kIHJlbGV2YW50LlxuICpcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgb2JqZWN0LlxuICogQHBhcmFtIHshZnVuY3Rpb259IGNhbGxiYWNrIFRvIGludm9rZSB1cG9uIHRyYXZlcnNpbmcgZWFjaCBjaGlsZC5cbiAqIEBwYXJhbSB7Pyp9IHRyYXZlcnNlQ29udGV4dCBDb250ZXh0IGZvciB0cmF2ZXJzYWwuXG4gKiBAcmV0dXJuIHshbnVtYmVyfSBUaGUgbnVtYmVyIG9mIGNoaWxkcmVuIGluIHRoaXMgc3VidHJlZS5cbiAqL1xuZnVuY3Rpb24gdHJhdmVyc2VBbGxDaGlsZHJlbihjaGlsZHJlbiwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCkge1xuICBpZiAoY2hpbGRyZW4gPT0gbnVsbCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkcmVuLCAnJywgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG59XG5cbi8qKlxuICogR2VuZXJhdGUgYSBrZXkgc3RyaW5nIHRoYXQgaWRlbnRpZmllcyBhIGNvbXBvbmVudCB3aXRoaW4gYSBzZXQuXG4gKlxuICogQHBhcmFtIHsqfSBjb21wb25lbnQgQSBjb21wb25lbnQgdGhhdCBjb3VsZCBjb250YWluIGEgbWFudWFsIGtleS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBJbmRleCB0aGF0IGlzIHVzZWQgaWYgYSBtYW51YWwga2V5IGlzIG5vdCBwcm92aWRlZC5cbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZ2V0Q29tcG9uZW50S2V5KGNvbXBvbmVudCwgaW5kZXgpIHtcbiAgLy8gRG8gc29tZSB0eXBlY2hlY2tpbmcgaGVyZSBzaW5jZSB3ZSBjYWxsIHRoaXMgYmxpbmRseS4gV2Ugd2FudCB0byBlbnN1cmVcbiAgLy8gdGhhdCB3ZSBkb24ndCBibG9jayBwb3RlbnRpYWwgZnV0dXJlIEVTIEFQSXMuXG4gIGlmICh0eXBlb2YgY29tcG9uZW50ID09PSAnb2JqZWN0JyAmJiBjb21wb25lbnQgIT09IG51bGwgJiYgY29tcG9uZW50LmtleSAhPSBudWxsKSB7XG4gICAgLy8gRXhwbGljaXQga2V5XG4gICAgcmV0dXJuIGVzY2FwZShjb21wb25lbnQua2V5KTtcbiAgfVxuICAvLyBJbXBsaWNpdCBrZXkgZGV0ZXJtaW5lZCBieSB0aGUgaW5kZXggaW4gdGhlIHNldFxuICByZXR1cm4gaW5kZXgudG9TdHJpbmcoMzYpO1xufVxuXG5mdW5jdGlvbiBmb3JFYWNoU2luZ2xlQ2hpbGQoYm9va0tlZXBpbmcsIGNoaWxkLCBuYW1lKSB7XG4gIHZhciBmdW5jID0gYm9va0tlZXBpbmcuZnVuYyxcbiAgICAgIGNvbnRleHQgPSBib29rS2VlcGluZy5jb250ZXh0O1xuXG4gIGZ1bmMuY2FsbChjb250ZXh0LCBjaGlsZCwgYm9va0tlZXBpbmcuY291bnQrKyk7XG59XG5cbi8qKlxuICogSXRlcmF0ZXMgdGhyb3VnaCBjaGlsZHJlbiB0aGF0IGFyZSB0eXBpY2FsbHkgc3BlY2lmaWVkIGFzIGBwcm9wcy5jaGlsZHJlbmAuXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVuZm9yZWFjaFxuICpcbiAqIFRoZSBwcm92aWRlZCBmb3JFYWNoRnVuYyhjaGlsZCwgaW5kZXgpIHdpbGwgYmUgY2FsbGVkIGZvciBlYWNoXG4gKiBsZWFmIGNoaWxkLlxuICpcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgY29udGFpbmVyLlxuICogQHBhcmFtIHtmdW5jdGlvbigqLCBpbnQpfSBmb3JFYWNoRnVuY1xuICogQHBhcmFtIHsqfSBmb3JFYWNoQ29udGV4dCBDb250ZXh0IGZvciBmb3JFYWNoQ29udGV4dC5cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaENoaWxkcmVuKGNoaWxkcmVuLCBmb3JFYWNoRnVuYywgZm9yRWFjaENvbnRleHQpIHtcbiAgaWYgKGNoaWxkcmVuID09IG51bGwpIHtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cbiAgdmFyIHRyYXZlcnNlQ29udGV4dCA9IGdldFBvb2xlZFRyYXZlcnNlQ29udGV4dChudWxsLCBudWxsLCBmb3JFYWNoRnVuYywgZm9yRWFjaENvbnRleHQpO1xuICB0cmF2ZXJzZUFsbENoaWxkcmVuKGNoaWxkcmVuLCBmb3JFYWNoU2luZ2xlQ2hpbGQsIHRyYXZlcnNlQ29udGV4dCk7XG4gIHJlbGVhc2VUcmF2ZXJzZUNvbnRleHQodHJhdmVyc2VDb250ZXh0KTtcbn1cblxuZnVuY3Rpb24gbWFwU2luZ2xlQ2hpbGRJbnRvQ29udGV4dChib29rS2VlcGluZywgY2hpbGQsIGNoaWxkS2V5KSB7XG4gIHZhciByZXN1bHQgPSBib29rS2VlcGluZy5yZXN1bHQsXG4gICAgICBrZXlQcmVmaXggPSBib29rS2VlcGluZy5rZXlQcmVmaXgsXG4gICAgICBmdW5jID0gYm9va0tlZXBpbmcuZnVuYyxcbiAgICAgIGNvbnRleHQgPSBib29rS2VlcGluZy5jb250ZXh0O1xuXG5cbiAgdmFyIG1hcHBlZENoaWxkID0gZnVuYy5jYWxsKGNvbnRleHQsIGNoaWxkLCBib29rS2VlcGluZy5jb3VudCsrKTtcbiAgaWYgKEFycmF5LmlzQXJyYXkobWFwcGVkQ2hpbGQpKSB7XG4gICAgbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChtYXBwZWRDaGlsZCwgcmVzdWx0LCBjaGlsZEtleSwgZnVuY3Rpb24gKGMpIHtcbiAgICAgIHJldHVybiBjO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKG1hcHBlZENoaWxkICE9IG51bGwpIHtcbiAgICBpZiAoaXNWYWxpZEVsZW1lbnQobWFwcGVkQ2hpbGQpKSB7XG4gICAgICBtYXBwZWRDaGlsZCA9IGNsb25lQW5kUmVwbGFjZUtleShtYXBwZWRDaGlsZCxcbiAgICAgIC8vIEtlZXAgYm90aCB0aGUgKG1hcHBlZCkgYW5kIG9sZCBrZXlzIGlmIHRoZXkgZGlmZmVyLCBqdXN0IGFzXG4gICAgICAvLyB0cmF2ZXJzZUFsbENoaWxkcmVuIHVzZWQgdG8gZG8gZm9yIG9iamVjdHMgYXMgY2hpbGRyZW5cbiAgICAgIGtleVByZWZpeCArIChtYXBwZWRDaGlsZC5rZXkgJiYgKCFjaGlsZCB8fCBjaGlsZC5rZXkgIT09IG1hcHBlZENoaWxkLmtleSkgPyBlc2NhcGVVc2VyUHJvdmlkZWRLZXkobWFwcGVkQ2hpbGQua2V5KSArICcvJyA6ICcnKSArIGNoaWxkS2V5KTtcbiAgICB9XG4gICAgcmVzdWx0LnB1c2gobWFwcGVkQ2hpbGQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWwoY2hpbGRyZW4sIGFycmF5LCBwcmVmaXgsIGZ1bmMsIGNvbnRleHQpIHtcbiAgdmFyIGVzY2FwZWRQcmVmaXggPSAnJztcbiAgaWYgKHByZWZpeCAhPSBudWxsKSB7XG4gICAgZXNjYXBlZFByZWZpeCA9IGVzY2FwZVVzZXJQcm92aWRlZEtleShwcmVmaXgpICsgJy8nO1xuICB9XG4gIHZhciB0cmF2ZXJzZUNvbnRleHQgPSBnZXRQb29sZWRUcmF2ZXJzZUNvbnRleHQoYXJyYXksIGVzY2FwZWRQcmVmaXgsIGZ1bmMsIGNvbnRleHQpO1xuICB0cmF2ZXJzZUFsbENoaWxkcmVuKGNoaWxkcmVuLCBtYXBTaW5nbGVDaGlsZEludG9Db250ZXh0LCB0cmF2ZXJzZUNvbnRleHQpO1xuICByZWxlYXNlVHJhdmVyc2VDb250ZXh0KHRyYXZlcnNlQ29udGV4dCk7XG59XG5cbi8qKlxuICogTWFwcyBjaGlsZHJlbiB0aGF0IGFyZSB0eXBpY2FsbHkgc3BlY2lmaWVkIGFzIGBwcm9wcy5jaGlsZHJlbmAuXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVubWFwXG4gKlxuICogVGhlIHByb3ZpZGVkIG1hcEZ1bmN0aW9uKGNoaWxkLCBrZXksIGluZGV4KSB3aWxsIGJlIGNhbGxlZCBmb3IgZWFjaFxuICogbGVhZiBjaGlsZC5cbiAqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKiwgaW50KX0gZnVuYyBUaGUgbWFwIGZ1bmN0aW9uLlxuICogQHBhcmFtIHsqfSBjb250ZXh0IENvbnRleHQgZm9yIG1hcEZ1bmN0aW9uLlxuICogQHJldHVybiB7b2JqZWN0fSBPYmplY3QgY29udGFpbmluZyB0aGUgb3JkZXJlZCBtYXAgb2YgcmVzdWx0cy5cbiAqL1xuZnVuY3Rpb24gbWFwQ2hpbGRyZW4oY2hpbGRyZW4sIGZ1bmMsIGNvbnRleHQpIHtcbiAgaWYgKGNoaWxkcmVuID09IG51bGwpIHtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKGNoaWxkcmVuLCByZXN1bHQsIG51bGwsIGZ1bmMsIGNvbnRleHQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENvdW50IHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhc1xuICogYHByb3BzLmNoaWxkcmVuYC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW5jb3VudFxuICpcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgY29udGFpbmVyLlxuICogQHJldHVybiB7bnVtYmVyfSBUaGUgbnVtYmVyIG9mIGNoaWxkcmVuLlxuICovXG5mdW5jdGlvbiBjb3VudENoaWxkcmVuKGNoaWxkcmVuKSB7XG4gIHJldHVybiB0cmF2ZXJzZUFsbENoaWxkcmVuKGNoaWxkcmVuLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sIG51bGwpO1xufVxuXG4vKipcbiAqIEZsYXR0ZW4gYSBjaGlsZHJlbiBvYmplY3QgKHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYCkgYW5kXG4gKiByZXR1cm4gYW4gYXJyYXkgd2l0aCBhcHByb3ByaWF0ZWx5IHJlLWtleWVkIGNoaWxkcmVuLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbnRvYXJyYXlcbiAqL1xuZnVuY3Rpb24gdG9BcnJheShjaGlsZHJlbikge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWwoY2hpbGRyZW4sIHJlc3VsdCwgbnVsbCwgZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgcmV0dXJuIGNoaWxkO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBmaXJzdCBjaGlsZCBpbiBhIGNvbGxlY3Rpb24gb2YgY2hpbGRyZW4gYW5kIHZlcmlmaWVzIHRoYXQgdGhlcmVcbiAqIGlzIG9ubHkgb25lIGNoaWxkIGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbm9ubHlcbiAqXG4gKiBUaGUgY3VycmVudCBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIGZ1bmN0aW9uIGFzc3VtZXMgdGhhdCBhIHNpbmdsZSBjaGlsZCBnZXRzXG4gKiBwYXNzZWQgd2l0aG91dCBhIHdyYXBwZXIsIGJ1dCB0aGUgcHVycG9zZSBvZiB0aGlzIGhlbHBlciBmdW5jdGlvbiBpcyB0b1xuICogYWJzdHJhY3QgYXdheSB0aGUgcGFydGljdWxhciBzdHJ1Y3R1cmUgb2YgY2hpbGRyZW4uXG4gKlxuICogQHBhcmFtIHs/b2JqZWN0fSBjaGlsZHJlbiBDaGlsZCBjb2xsZWN0aW9uIHN0cnVjdHVyZS5cbiAqIEByZXR1cm4ge1JlYWN0RWxlbWVudH0gVGhlIGZpcnN0IGFuZCBvbmx5IGBSZWFjdEVsZW1lbnRgIGNvbnRhaW5lZCBpbiB0aGVcbiAqIHN0cnVjdHVyZS5cbiAqL1xuZnVuY3Rpb24gb25seUNoaWxkKGNoaWxkcmVuKSB7XG4gICFpc1ZhbGlkRWxlbWVudChjaGlsZHJlbikgPyBpbnZhcmlhbnQoZmFsc2UsICdSZWFjdC5DaGlsZHJlbi5vbmx5IGV4cGVjdGVkIHRvIHJlY2VpdmUgYSBzaW5nbGUgUmVhY3QgZWxlbWVudCBjaGlsZC4nKSA6IHZvaWQgMDtcbiAgcmV0dXJuIGNoaWxkcmVuO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb250ZXh0KGRlZmF1bHRWYWx1ZSwgY2FsY3VsYXRlQ2hhbmdlZEJpdHMpIHtcbiAgaWYgKGNhbGN1bGF0ZUNoYW5nZWRCaXRzID09PSB1bmRlZmluZWQpIHtcbiAgICBjYWxjdWxhdGVDaGFuZ2VkQml0cyA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAge1xuICAgICAgIShjYWxjdWxhdGVDaGFuZ2VkQml0cyA9PT0gbnVsbCB8fCB0eXBlb2YgY2FsY3VsYXRlQ2hhbmdlZEJpdHMgPT09ICdmdW5jdGlvbicpID8gd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnY3JlYXRlQ29udGV4dDogRXhwZWN0ZWQgdGhlIG9wdGlvbmFsIHNlY29uZCBhcmd1bWVudCB0byBiZSBhICcgKyAnZnVuY3Rpb24uIEluc3RlYWQgcmVjZWl2ZWQ6ICVzJywgY2FsY3VsYXRlQ2hhbmdlZEJpdHMpIDogdm9pZCAwO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjb250ZXh0ID0ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9DT05URVhUX1RZUEUsXG4gICAgX2NhbGN1bGF0ZUNoYW5nZWRCaXRzOiBjYWxjdWxhdGVDaGFuZ2VkQml0cyxcbiAgICAvLyBBcyBhIHdvcmthcm91bmQgdG8gc3VwcG9ydCBtdWx0aXBsZSBjb25jdXJyZW50IHJlbmRlcmVycywgd2UgY2F0ZWdvcml6ZVxuICAgIC8vIHNvbWUgcmVuZGVyZXJzIGFzIHByaW1hcnkgYW5kIG90aGVycyBhcyBzZWNvbmRhcnkuIFdlIG9ubHkgZXhwZWN0XG4gICAgLy8gdGhlcmUgdG8gYmUgdHdvIGNvbmN1cnJlbnQgcmVuZGVyZXJzIGF0IG1vc3Q6IFJlYWN0IE5hdGl2ZSAocHJpbWFyeSkgYW5kXG4gICAgLy8gRmFicmljIChzZWNvbmRhcnkpOyBSZWFjdCBET00gKHByaW1hcnkpIGFuZCBSZWFjdCBBUlQgKHNlY29uZGFyeSkuXG4gICAgLy8gU2Vjb25kYXJ5IHJlbmRlcmVycyBzdG9yZSB0aGVpciBjb250ZXh0IHZhbHVlcyBvbiBzZXBhcmF0ZSBmaWVsZHMuXG4gICAgX2N1cnJlbnRWYWx1ZTogZGVmYXVsdFZhbHVlLFxuICAgIF9jdXJyZW50VmFsdWUyOiBkZWZhdWx0VmFsdWUsXG4gICAgLy8gVXNlZCB0byB0cmFjayBob3cgbWFueSBjb25jdXJyZW50IHJlbmRlcmVycyB0aGlzIGNvbnRleHQgY3VycmVudGx5XG4gICAgLy8gc3VwcG9ydHMgd2l0aGluIGluIGEgc2luZ2xlIHJlbmRlcmVyLiBTdWNoIGFzIHBhcmFsbGVsIHNlcnZlciByZW5kZXJpbmcuXG4gICAgX3RocmVhZENvdW50OiAwLFxuICAgIC8vIFRoZXNlIGFyZSBjaXJjdWxhclxuICAgIFByb3ZpZGVyOiBudWxsLFxuICAgIENvbnN1bWVyOiBudWxsXG4gIH07XG5cbiAgY29udGV4dC5Qcm92aWRlciA9IHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfUFJPVklERVJfVFlQRSxcbiAgICBfY29udGV4dDogY29udGV4dFxuICB9O1xuXG4gIHZhciBoYXNXYXJuZWRBYm91dFVzaW5nTmVzdGVkQ29udGV4dENvbnN1bWVycyA9IGZhbHNlO1xuICB2YXIgaGFzV2FybmVkQWJvdXRVc2luZ0NvbnN1bWVyUHJvdmlkZXIgPSBmYWxzZTtcblxuICB7XG4gICAgLy8gQSBzZXBhcmF0ZSBvYmplY3QsIGJ1dCBwcm94aWVzIGJhY2sgdG8gdGhlIG9yaWdpbmFsIGNvbnRleHQgb2JqZWN0IGZvclxuICAgIC8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LiBJdCBoYXMgYSBkaWZmZXJlbnQgJCR0eXBlb2YsIHNvIHdlIGNhbiBwcm9wZXJseVxuICAgIC8vIHdhcm4gZm9yIHRoZSBpbmNvcnJlY3QgdXNhZ2Ugb2YgQ29udGV4dCBhcyBhIENvbnN1bWVyLlxuICAgIHZhciBDb25zdW1lciA9IHtcbiAgICAgICQkdHlwZW9mOiBSRUFDVF9DT05URVhUX1RZUEUsXG4gICAgICBfY29udGV4dDogY29udGV4dCxcbiAgICAgIF9jYWxjdWxhdGVDaGFuZ2VkQml0czogY29udGV4dC5fY2FsY3VsYXRlQ2hhbmdlZEJpdHNcbiAgICB9O1xuICAgIC8vICRGbG93Rml4TWU6IEZsb3cgY29tcGxhaW5zIGFib3V0IG5vdCBzZXR0aW5nIGEgdmFsdWUsIHdoaWNoIGlzIGludGVudGlvbmFsIGhlcmVcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhDb25zdW1lciwge1xuICAgICAgUHJvdmlkZXI6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFoYXNXYXJuZWRBYm91dFVzaW5nQ29uc3VtZXJQcm92aWRlcikge1xuICAgICAgICAgICAgaGFzV2FybmVkQWJvdXRVc2luZ0NvbnN1bWVyUHJvdmlkZXIgPSB0cnVlO1xuICAgICAgICAgICAgd2FybmluZyQxKGZhbHNlLCAnUmVuZGVyaW5nIDxDb250ZXh0LkNvbnN1bWVyLlByb3ZpZGVyPiBpcyBub3Qgc3VwcG9ydGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gJyArICdhIGZ1dHVyZSBtYWpvciByZWxlYXNlLiBEaWQgeW91IG1lYW4gdG8gcmVuZGVyIDxDb250ZXh0LlByb3ZpZGVyPiBpbnN0ZWFkPycpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY29udGV4dC5Qcm92aWRlcjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoX1Byb3ZpZGVyKSB7XG4gICAgICAgICAgY29udGV4dC5Qcm92aWRlciA9IF9Qcm92aWRlcjtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF9jdXJyZW50VmFsdWU6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuX2N1cnJlbnRWYWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoX2N1cnJlbnRWYWx1ZSkge1xuICAgICAgICAgIGNvbnRleHQuX2N1cnJlbnRWYWx1ZSA9IF9jdXJyZW50VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBfY3VycmVudFZhbHVlMjoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY29udGV4dC5fY3VycmVudFZhbHVlMjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoX2N1cnJlbnRWYWx1ZTIpIHtcbiAgICAgICAgICBjb250ZXh0Ll9jdXJyZW50VmFsdWUyID0gX2N1cnJlbnRWYWx1ZTI7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBfdGhyZWFkQ291bnQ6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuX3RocmVhZENvdW50O1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChfdGhyZWFkQ291bnQpIHtcbiAgICAgICAgICBjb250ZXh0Ll90aHJlYWRDb3VudCA9IF90aHJlYWRDb3VudDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIENvbnN1bWVyOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghaGFzV2FybmVkQWJvdXRVc2luZ05lc3RlZENvbnRleHRDb25zdW1lcnMpIHtcbiAgICAgICAgICAgIGhhc1dhcm5lZEFib3V0VXNpbmdOZXN0ZWRDb250ZXh0Q29uc3VtZXJzID0gdHJ1ZTtcbiAgICAgICAgICAgIHdhcm5pbmckMShmYWxzZSwgJ1JlbmRlcmluZyA8Q29udGV4dC5Db25zdW1lci5Db25zdW1lcj4gaXMgbm90IHN1cHBvcnRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluICcgKyAnYSBmdXR1cmUgbWFqb3IgcmVsZWFzZS4gRGlkIHlvdSBtZWFuIHRvIHJlbmRlciA8Q29udGV4dC5Db25zdW1lcj4gaW5zdGVhZD8nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuQ29uc3VtZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyAkRmxvd0ZpeE1lOiBGbG93IGNvbXBsYWlucyBhYm91dCBtaXNzaW5nIHByb3BlcnRpZXMgYmVjYXVzZSBpdCBkb2Vzbid0IHVuZGVyc3RhbmQgZGVmaW5lUHJvcGVydHlcbiAgICBjb250ZXh0LkNvbnN1bWVyID0gQ29uc3VtZXI7XG4gIH1cblxuICB7XG4gICAgY29udGV4dC5fY3VycmVudFJlbmRlcmVyID0gbnVsbDtcbiAgICBjb250ZXh0Ll9jdXJyZW50UmVuZGVyZXIyID0gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBjb250ZXh0O1xufVxuXG5mdW5jdGlvbiBsYXp5KGN0b3IpIHtcbiAgdmFyIGxhenlUeXBlID0ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9MQVpZX1RZUEUsXG4gICAgX2N0b3I6IGN0b3IsXG4gICAgLy8gUmVhY3QgdXNlcyB0aGVzZSBmaWVsZHMgdG8gc3RvcmUgdGhlIHJlc3VsdC5cbiAgICBfc3RhdHVzOiAtMSxcbiAgICBfcmVzdWx0OiBudWxsXG4gIH07XG5cbiAge1xuICAgIC8vIEluIHByb2R1Y3Rpb24sIHRoaXMgd291bGQganVzdCBzZXQgaXQgb24gdGhlIG9iamVjdC5cbiAgICB2YXIgZGVmYXVsdFByb3BzID0gdm9pZCAwO1xuICAgIHZhciBwcm9wVHlwZXMgPSB2b2lkIDA7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobGF6eVR5cGUsIHtcbiAgICAgIGRlZmF1bHRQcm9wczoge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBkZWZhdWx0UHJvcHM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKG5ld0RlZmF1bHRQcm9wcykge1xuICAgICAgICAgIHdhcm5pbmckMShmYWxzZSwgJ1JlYWN0LmxhenkoLi4uKTogSXQgaXMgbm90IHN1cHBvcnRlZCB0byBhc3NpZ24gYGRlZmF1bHRQcm9wc2AgdG8gJyArICdhIGxhenkgY29tcG9uZW50IGltcG9ydC4gRWl0aGVyIHNwZWNpZnkgdGhlbSB3aGVyZSB0aGUgY29tcG9uZW50ICcgKyAnaXMgZGVmaW5lZCwgb3IgY3JlYXRlIGEgd3JhcHBpbmcgY29tcG9uZW50IGFyb3VuZCBpdC4nKTtcbiAgICAgICAgICBkZWZhdWx0UHJvcHMgPSBuZXdEZWZhdWx0UHJvcHM7XG4gICAgICAgICAgLy8gTWF0Y2ggcHJvZHVjdGlvbiBiZWhhdmlvciBtb3JlIGNsb3NlbHk6XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGxhenlUeXBlLCAnZGVmYXVsdFByb3BzJywge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHByb3BUeXBlcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmV3UHJvcFR5cGVzKSB7XG4gICAgICAgICAgd2FybmluZyQxKGZhbHNlLCAnUmVhY3QubGF6eSguLi4pOiBJdCBpcyBub3Qgc3VwcG9ydGVkIHRvIGFzc2lnbiBgcHJvcFR5cGVzYCB0byAnICsgJ2EgbGF6eSBjb21wb25lbnQgaW1wb3J0LiBFaXRoZXIgc3BlY2lmeSB0aGVtIHdoZXJlIHRoZSBjb21wb25lbnQgJyArICdpcyBkZWZpbmVkLCBvciBjcmVhdGUgYSB3cmFwcGluZyBjb21wb25lbnQgYXJvdW5kIGl0LicpO1xuICAgICAgICAgIHByb3BUeXBlcyA9IG5ld1Byb3BUeXBlcztcbiAgICAgICAgICAvLyBNYXRjaCBwcm9kdWN0aW9uIGJlaGF2aW9yIG1vcmUgY2xvc2VseTpcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobGF6eVR5cGUsICdwcm9wVHlwZXMnLCB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBsYXp5VHlwZTtcbn1cblxuZnVuY3Rpb24gZm9yd2FyZFJlZihyZW5kZXIpIHtcbiAge1xuICAgIGlmIChyZW5kZXIgIT0gbnVsbCAmJiByZW5kZXIuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSkge1xuICAgICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnZm9yd2FyZFJlZiByZXF1aXJlcyBhIHJlbmRlciBmdW5jdGlvbiBidXQgcmVjZWl2ZWQgYSBgbWVtb2AgJyArICdjb21wb25lbnQuIEluc3RlYWQgb2YgZm9yd2FyZFJlZihtZW1vKC4uLikpLCB1c2UgJyArICdtZW1vKGZvcndhcmRSZWYoLi4uKSkuJyk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcmVuZGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdmb3J3YXJkUmVmIHJlcXVpcmVzIGEgcmVuZGVyIGZ1bmN0aW9uIGJ1dCB3YXMgZ2l2ZW4gJXMuJywgcmVuZGVyID09PSBudWxsID8gJ251bGwnIDogdHlwZW9mIHJlbmRlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgICEoXG4gICAgICAvLyBEbyBub3Qgd2FybiBmb3IgMCBhcmd1bWVudHMgYmVjYXVzZSBpdCBjb3VsZCBiZSBkdWUgdG8gdXNhZ2Ugb2YgdGhlICdhcmd1bWVudHMnIG9iamVjdFxuICAgICAgcmVuZGVyLmxlbmd0aCA9PT0gMCB8fCByZW5kZXIubGVuZ3RoID09PSAyKSA/IHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ2ZvcndhcmRSZWYgcmVuZGVyIGZ1bmN0aW9ucyBhY2NlcHQgZXhhY3RseSB0d28gcGFyYW1ldGVyczogcHJvcHMgYW5kIHJlZi4gJXMnLCByZW5kZXIubGVuZ3RoID09PSAxID8gJ0RpZCB5b3UgZm9yZ2V0IHRvIHVzZSB0aGUgcmVmIHBhcmFtZXRlcj8nIDogJ0FueSBhZGRpdGlvbmFsIHBhcmFtZXRlciB3aWxsIGJlIHVuZGVmaW5lZC4nKSA6IHZvaWQgMDtcbiAgICB9XG5cbiAgICBpZiAocmVuZGVyICE9IG51bGwpIHtcbiAgICAgICEocmVuZGVyLmRlZmF1bHRQcm9wcyA9PSBudWxsICYmIHJlbmRlci5wcm9wVHlwZXMgPT0gbnVsbCkgPyB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdmb3J3YXJkUmVmIHJlbmRlciBmdW5jdGlvbnMgZG8gbm90IHN1cHBvcnQgcHJvcFR5cGVzIG9yIGRlZmF1bHRQcm9wcy4gJyArICdEaWQgeW91IGFjY2lkZW50YWxseSBwYXNzIGEgUmVhY3QgY29tcG9uZW50PycpIDogdm9pZCAwO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUsXG4gICAgcmVuZGVyOiByZW5kZXJcbiAgfTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZEVsZW1lbnRUeXBlKHR5cGUpIHtcbiAgcmV0dXJuIHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fFxuICAvLyBOb3RlOiBpdHMgdHlwZW9mIG1pZ2h0IGJlIG90aGVyIHRoYW4gJ3N5bWJvbCcgb3IgJ251bWJlcicgaWYgaXQncyBhIHBvbHlmaWxsLlxuICB0eXBlID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1BST0ZJTEVSX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFIHx8IHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiB0eXBlICE9PSBudWxsICYmICh0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9MQVpZX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTUVNT19UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX1BST1ZJREVSX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfQ09OVEVYVF9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUpO1xufVxuXG5mdW5jdGlvbiBtZW1vKHR5cGUsIGNvbXBhcmUpIHtcbiAge1xuICAgIGlmICghaXNWYWxpZEVsZW1lbnRUeXBlKHR5cGUpKSB7XG4gICAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdtZW1vOiBUaGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIGNvbXBvbmVudC4gSW5zdGVhZCAnICsgJ3JlY2VpdmVkOiAlcycsIHR5cGUgPT09IG51bGwgPyAnbnVsbCcgOiB0eXBlb2YgdHlwZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX01FTU9fVFlQRSxcbiAgICB0eXBlOiB0eXBlLFxuICAgIGNvbXBhcmU6IGNvbXBhcmUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjb21wYXJlXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVEaXNwYXRjaGVyKCkge1xuICB2YXIgZGlzcGF0Y2hlciA9IFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnREaXNwYXRjaGVyO1xuICAhKGRpc3BhdGNoZXIgIT09IG51bGwpID8gaW52YXJpYW50KGZhbHNlLCAnSG9va3MgY2FuIG9ubHkgYmUgY2FsbGVkIGluc2lkZSB0aGUgYm9keSBvZiBhIGZ1bmN0aW9uIGNvbXBvbmVudC4nKSA6IHZvaWQgMDtcbiAgcmV0dXJuIGRpc3BhdGNoZXI7XG59XG5cbmZ1bmN0aW9uIHVzZUNvbnRleHQoQ29udGV4dCwgb2JzZXJ2ZWRCaXRzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAge1xuICAgIC8vIFRPRE86IGFkZCBhIG1vcmUgZ2VuZXJpYyB3YXJuaW5nIGZvciBpbnZhbGlkIHZhbHVlcy5cbiAgICBpZiAoQ29udGV4dC5fY29udGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgcmVhbENvbnRleHQgPSBDb250ZXh0Ll9jb250ZXh0O1xuICAgICAgLy8gRG9uJ3QgZGVkdXBsaWNhdGUgYmVjYXVzZSB0aGlzIGxlZ2l0aW1hdGVseSBjYXVzZXMgYnVnc1xuICAgICAgLy8gYW5kIG5vYm9keSBzaG91bGQgYmUgdXNpbmcgdGhpcyBpbiBleGlzdGluZyBjb2RlLlxuICAgICAgaWYgKHJlYWxDb250ZXh0LkNvbnN1bWVyID09PSBDb250ZXh0KSB7XG4gICAgICAgIHdhcm5pbmckMShmYWxzZSwgJ0NhbGxpbmcgdXNlQ29udGV4dChDb250ZXh0LkNvbnN1bWVyKSBpcyBub3Qgc3VwcG9ydGVkLCBtYXkgY2F1c2UgYnVncywgYW5kIHdpbGwgYmUgJyArICdyZW1vdmVkIGluIGEgZnV0dXJlIG1ham9yIHJlbGVhc2UuIERpZCB5b3UgbWVhbiB0byBjYWxsIHVzZUNvbnRleHQoQ29udGV4dCkgaW5zdGVhZD8nKTtcbiAgICAgIH0gZWxzZSBpZiAocmVhbENvbnRleHQuUHJvdmlkZXIgPT09IENvbnRleHQpIHtcbiAgICAgICAgd2FybmluZyQxKGZhbHNlLCAnQ2FsbGluZyB1c2VDb250ZXh0KENvbnRleHQuUHJvdmlkZXIpIGlzIG5vdCBzdXBwb3J0ZWQuICcgKyAnRGlkIHlvdSBtZWFuIHRvIGNhbGwgdXNlQ29udGV4dChDb250ZXh0KSBpbnN0ZWFkPycpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZGlzcGF0Y2hlci51c2VDb250ZXh0KENvbnRleHQsIG9ic2VydmVkQml0cyk7XG59XG5cbmZ1bmN0aW9uIHVzZVN0YXRlKGluaXRpYWxTdGF0ZSkge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZVN0YXRlKGluaXRpYWxTdGF0ZSk7XG59XG5cbmZ1bmN0aW9uIHVzZVJlZHVjZXIocmVkdWNlciwgaW5pdGlhbFN0YXRlLCBpbml0aWFsQWN0aW9uKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsU3RhdGUsIGluaXRpYWxBY3Rpb24pO1xufVxuXG5mdW5jdGlvbiB1c2VSZWYoaW5pdGlhbFZhbHVlKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlUmVmKGluaXRpYWxWYWx1ZSk7XG59XG5cbmZ1bmN0aW9uIHVzZUVmZmVjdChjcmVhdGUsIGlucHV0cykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUVmZmVjdChjcmVhdGUsIGlucHV0cyk7XG59XG5cbmZ1bmN0aW9uIHVzZUxheW91dEVmZmVjdChjcmVhdGUsIGlucHV0cykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUxheW91dEVmZmVjdChjcmVhdGUsIGlucHV0cyk7XG59XG5cbmZ1bmN0aW9uIHVzZUNhbGxiYWNrKGNhbGxiYWNrLCBpbnB1dHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VDYWxsYmFjayhjYWxsYmFjaywgaW5wdXRzKTtcbn1cblxuZnVuY3Rpb24gdXNlTWVtbyhjcmVhdGUsIGlucHV0cykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZU1lbW8oY3JlYXRlLCBpbnB1dHMpO1xufVxuXG5mdW5jdGlvbiB1c2VJbXBlcmF0aXZlTWV0aG9kcyhyZWYsIGNyZWF0ZSwgaW5wdXRzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlSW1wZXJhdGl2ZU1ldGhvZHMocmVmLCBjcmVhdGUsIGlucHV0cyk7XG59XG5cbi8qKlxuICogUmVhY3RFbGVtZW50VmFsaWRhdG9yIHByb3ZpZGVzIGEgd3JhcHBlciBhcm91bmQgYSBlbGVtZW50IGZhY3RvcnlcbiAqIHdoaWNoIHZhbGlkYXRlcyB0aGUgcHJvcHMgcGFzc2VkIHRvIHRoZSBlbGVtZW50LiBUaGlzIGlzIGludGVuZGVkIHRvIGJlXG4gKiB1c2VkIG9ubHkgaW4gREVWIGFuZCBjb3VsZCBiZSByZXBsYWNlZCBieSBhIHN0YXRpYyB0eXBlIGNoZWNrZXIgZm9yIGxhbmd1YWdlc1xuICogdGhhdCBzdXBwb3J0IGl0LlxuICovXG5cbnZhciBwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93biA9IHZvaWQgMDtcblxue1xuICBwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93biA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKSB7XG4gIGlmIChSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50KSB7XG4gICAgdmFyIG5hbWUgPSBnZXRDb21wb25lbnROYW1lKFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQudHlwZSk7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIHJldHVybiAnXFxuXFxuQ2hlY2sgdGhlIHJlbmRlciBtZXRob2Qgb2YgYCcgKyBuYW1lICsgJ2AuJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiBnZXRTb3VyY2VJbmZvRXJyb3JBZGRlbmR1bShlbGVtZW50UHJvcHMpIHtcbiAgaWYgKGVsZW1lbnRQcm9wcyAhPT0gbnVsbCAmJiBlbGVtZW50UHJvcHMgIT09IHVuZGVmaW5lZCAmJiBlbGVtZW50UHJvcHMuX19zb3VyY2UgIT09IHVuZGVmaW5lZCkge1xuICAgIHZhciBzb3VyY2UgPSBlbGVtZW50UHJvcHMuX19zb3VyY2U7XG4gICAgdmFyIGZpbGVOYW1lID0gc291cmNlLmZpbGVOYW1lLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKTtcbiAgICB2YXIgbGluZU51bWJlciA9IHNvdXJjZS5saW5lTnVtYmVyO1xuICAgIHJldHVybiAnXFxuXFxuQ2hlY2sgeW91ciBjb2RlIGF0ICcgKyBmaWxlTmFtZSArICc6JyArIGxpbmVOdW1iZXIgKyAnLic7XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG4vKipcbiAqIFdhcm4gaWYgdGhlcmUncyBubyBrZXkgZXhwbGljaXRseSBzZXQgb24gZHluYW1pYyBhcnJheXMgb2YgY2hpbGRyZW4gb3JcbiAqIG9iamVjdCBrZXlzIGFyZSBub3QgdmFsaWQuIFRoaXMgYWxsb3dzIHVzIHRvIGtlZXAgdHJhY2sgb2YgY2hpbGRyZW4gYmV0d2VlblxuICogdXBkYXRlcy5cbiAqL1xudmFyIG93bmVySGFzS2V5VXNlV2FybmluZyA9IHt9O1xuXG5mdW5jdGlvbiBnZXRDdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvKHBhcmVudFR5cGUpIHtcbiAgdmFyIGluZm8gPSBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKTtcblxuICBpZiAoIWluZm8pIHtcbiAgICB2YXIgcGFyZW50TmFtZSA9IHR5cGVvZiBwYXJlbnRUeXBlID09PSAnc3RyaW5nJyA/IHBhcmVudFR5cGUgOiBwYXJlbnRUeXBlLmRpc3BsYXlOYW1lIHx8IHBhcmVudFR5cGUubmFtZTtcbiAgICBpZiAocGFyZW50TmFtZSkge1xuICAgICAgaW5mbyA9ICdcXG5cXG5DaGVjayB0aGUgdG9wLWxldmVsIHJlbmRlciBjYWxsIHVzaW5nIDwnICsgcGFyZW50TmFtZSArICc+Lic7XG4gICAgfVxuICB9XG4gIHJldHVybiBpbmZvO1xufVxuXG4vKipcbiAqIFdhcm4gaWYgdGhlIGVsZW1lbnQgZG9lc24ndCBoYXZlIGFuIGV4cGxpY2l0IGtleSBhc3NpZ25lZCB0byBpdC5cbiAqIFRoaXMgZWxlbWVudCBpcyBpbiBhbiBhcnJheS4gVGhlIGFycmF5IGNvdWxkIGdyb3cgYW5kIHNocmluayBvciBiZVxuICogcmVvcmRlcmVkLiBBbGwgY2hpbGRyZW4gdGhhdCBoYXZlbid0IGFscmVhZHkgYmVlbiB2YWxpZGF0ZWQgYXJlIHJlcXVpcmVkIHRvXG4gKiBoYXZlIGEgXCJrZXlcIiBwcm9wZXJ0eSBhc3NpZ25lZCB0byBpdC4gRXJyb3Igc3RhdHVzZXMgYXJlIGNhY2hlZCBzbyBhIHdhcm5pbmdcbiAqIHdpbGwgb25seSBiZSBzaG93biBvbmNlLlxuICpcbiAqIEBpbnRlcm5hbFxuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB0aGF0IHJlcXVpcmVzIGEga2V5LlxuICogQHBhcmFtIHsqfSBwYXJlbnRUeXBlIGVsZW1lbnQncyBwYXJlbnQncyB0eXBlLlxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZUV4cGxpY2l0S2V5KGVsZW1lbnQsIHBhcmVudFR5cGUpIHtcbiAgaWYgKCFlbGVtZW50Ll9zdG9yZSB8fCBlbGVtZW50Ll9zdG9yZS52YWxpZGF0ZWQgfHwgZWxlbWVudC5rZXkgIT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuICBlbGVtZW50Ll9zdG9yZS52YWxpZGF0ZWQgPSB0cnVlO1xuXG4gIHZhciBjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvID0gZ2V0Q3VycmVudENvbXBvbmVudEVycm9ySW5mbyhwYXJlbnRUeXBlKTtcbiAgaWYgKG93bmVySGFzS2V5VXNlV2FybmluZ1tjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvXSkge1xuICAgIHJldHVybjtcbiAgfVxuICBvd25lckhhc0tleVVzZVdhcm5pbmdbY3VycmVudENvbXBvbmVudEVycm9ySW5mb10gPSB0cnVlO1xuXG4gIC8vIFVzdWFsbHkgdGhlIGN1cnJlbnQgb3duZXIgaXMgdGhlIG9mZmVuZGVyLCBidXQgaWYgaXQgYWNjZXB0cyBjaGlsZHJlbiBhcyBhXG4gIC8vIHByb3BlcnR5LCBpdCBtYXkgYmUgdGhlIGNyZWF0b3Igb2YgdGhlIGNoaWxkIHRoYXQncyByZXNwb25zaWJsZSBmb3JcbiAgLy8gYXNzaWduaW5nIGl0IGEga2V5LlxuICB2YXIgY2hpbGRPd25lciA9ICcnO1xuICBpZiAoZWxlbWVudCAmJiBlbGVtZW50Ll9vd25lciAmJiBlbGVtZW50Ll9vd25lciAhPT0gUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCkge1xuICAgIC8vIEdpdmUgdGhlIGNvbXBvbmVudCB0aGF0IG9yaWdpbmFsbHkgY3JlYXRlZCB0aGlzIGNoaWxkLlxuICAgIGNoaWxkT3duZXIgPSAnIEl0IHdhcyBwYXNzZWQgYSBjaGlsZCBmcm9tICcgKyBnZXRDb21wb25lbnROYW1lKGVsZW1lbnQuX293bmVyLnR5cGUpICsgJy4nO1xuICB9XG5cbiAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQoZWxlbWVudCk7XG4gIHtcbiAgICB3YXJuaW5nJDEoZmFsc2UsICdFYWNoIGNoaWxkIGluIGFuIGFycmF5IG9yIGl0ZXJhdG9yIHNob3VsZCBoYXZlIGEgdW5pcXVlIFwia2V5XCIgcHJvcC4nICsgJyVzJXMgU2VlIGh0dHBzOi8vZmIubWUvcmVhY3Qtd2FybmluZy1rZXlzIGZvciBtb3JlIGluZm9ybWF0aW9uLicsIGN1cnJlbnRDb21wb25lbnRFcnJvckluZm8sIGNoaWxkT3duZXIpO1xuICB9XG4gIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KG51bGwpO1xufVxuXG4vKipcbiAqIEVuc3VyZSB0aGF0IGV2ZXJ5IGVsZW1lbnQgZWl0aGVyIGlzIHBhc3NlZCBpbiBhIHN0YXRpYyBsb2NhdGlvbiwgaW4gYW5cbiAqIGFycmF5IHdpdGggYW4gZXhwbGljaXQga2V5cyBwcm9wZXJ0eSBkZWZpbmVkLCBvciBpbiBhbiBvYmplY3QgbGl0ZXJhbFxuICogd2l0aCB2YWxpZCBrZXkgcHJvcGVydHkuXG4gKlxuICogQGludGVybmFsXG4gKiBAcGFyYW0ge1JlYWN0Tm9kZX0gbm9kZSBTdGF0aWNhbGx5IHBhc3NlZCBjaGlsZCBvZiBhbnkgdHlwZS5cbiAqIEBwYXJhbSB7Kn0gcGFyZW50VHlwZSBub2RlJ3MgcGFyZW50J3MgdHlwZS5cbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVDaGlsZEtleXMobm9kZSwgcGFyZW50VHlwZSkge1xuICBpZiAodHlwZW9mIG5vZGUgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KG5vZGUpKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hpbGQgPSBub2RlW2ldO1xuICAgICAgaWYgKGlzVmFsaWRFbGVtZW50KGNoaWxkKSkge1xuICAgICAgICB2YWxpZGF0ZUV4cGxpY2l0S2V5KGNoaWxkLCBwYXJlbnRUeXBlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNWYWxpZEVsZW1lbnQobm9kZSkpIHtcbiAgICAvLyBUaGlzIGVsZW1lbnQgd2FzIHBhc3NlZCBpbiBhIHZhbGlkIGxvY2F0aW9uLlxuICAgIGlmIChub2RlLl9zdG9yZSkge1xuICAgICAgbm9kZS5fc3RvcmUudmFsaWRhdGVkID0gdHJ1ZTtcbiAgICB9XG4gIH0gZWxzZSBpZiAobm9kZSkge1xuICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihub2RlKTtcbiAgICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIEVudHJ5IGl0ZXJhdG9ycyB1c2VkIHRvIHByb3ZpZGUgaW1wbGljaXQga2V5cyxcbiAgICAgIC8vIGJ1dCBub3cgd2UgcHJpbnQgYSBzZXBhcmF0ZSB3YXJuaW5nIGZvciB0aGVtIGxhdGVyLlxuICAgICAgaWYgKGl0ZXJhdG9yRm4gIT09IG5vZGUuZW50cmllcykge1xuICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwobm9kZSk7XG4gICAgICAgIHZhciBzdGVwID0gdm9pZCAwO1xuICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgaWYgKGlzVmFsaWRFbGVtZW50KHN0ZXAudmFsdWUpKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZUV4cGxpY2l0S2V5KHN0ZXAudmFsdWUsIHBhcmVudFR5cGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEdpdmVuIGFuIGVsZW1lbnQsIHZhbGlkYXRlIHRoYXQgaXRzIHByb3BzIGZvbGxvdyB0aGUgcHJvcFR5cGVzIGRlZmluaXRpb24sXG4gKiBwcm92aWRlZCBieSB0aGUgdHlwZS5cbiAqXG4gKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gZWxlbWVudFxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZVByb3BUeXBlcyhlbGVtZW50KSB7XG4gIHZhciB0eXBlID0gZWxlbWVudC50eXBlO1xuICBpZiAodHlwZSA9PT0gbnVsbCB8fCB0eXBlID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZSh0eXBlKTtcbiAgdmFyIHByb3BUeXBlcyA9IHZvaWQgMDtcbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcHJvcFR5cGVzID0gdHlwZS5wcm9wVHlwZXM7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmICh0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFIHx8XG4gIC8vIE5vdGU6IE1lbW8gb25seSBjaGVja3Mgb3V0ZXIgcHJvcHMgaGVyZS5cbiAgLy8gSW5uZXIgcHJvcHMgYXJlIGNoZWNrZWQgaW4gdGhlIHJlY29uY2lsZXIuXG4gIHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSkpIHtcbiAgICBwcm9wVHlwZXMgPSB0eXBlLnByb3BUeXBlcztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHByb3BUeXBlcykge1xuICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGVsZW1lbnQpO1xuICAgIGNoZWNrUHJvcFR5cGVzKHByb3BUeXBlcywgZWxlbWVudC5wcm9wcywgJ3Byb3AnLCBuYW1lLCBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldFN0YWNrQWRkZW5kdW0pO1xuICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KG51bGwpO1xuICB9IGVsc2UgaWYgKHR5cGUuUHJvcFR5cGVzICE9PSB1bmRlZmluZWQgJiYgIXByb3BUeXBlc01pc3NwZWxsV2FybmluZ1Nob3duKSB7XG4gICAgcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd24gPSB0cnVlO1xuICAgIHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ0NvbXBvbmVudCAlcyBkZWNsYXJlZCBgUHJvcFR5cGVzYCBpbnN0ZWFkIG9mIGBwcm9wVHlwZXNgLiBEaWQgeW91IG1pc3NwZWxsIHRoZSBwcm9wZXJ0eSBhc3NpZ25tZW50PycsIG5hbWUgfHwgJ1Vua25vd24nKTtcbiAgfVxuICBpZiAodHlwZW9mIHR5cGUuZ2V0RGVmYXVsdFByb3BzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgIXR5cGUuZ2V0RGVmYXVsdFByb3BzLmlzUmVhY3RDbGFzc0FwcHJvdmVkID8gd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnZ2V0RGVmYXVsdFByb3BzIGlzIG9ubHkgdXNlZCBvbiBjbGFzc2ljIFJlYWN0LmNyZWF0ZUNsYXNzICcgKyAnZGVmaW5pdGlvbnMuIFVzZSBhIHN0YXRpYyBwcm9wZXJ0eSBuYW1lZCBgZGVmYXVsdFByb3BzYCBpbnN0ZWFkLicpIDogdm9pZCAwO1xuICB9XG59XG5cbi8qKlxuICogR2l2ZW4gYSBmcmFnbWVudCwgdmFsaWRhdGUgdGhhdCBpdCBjYW4gb25seSBiZSBwcm92aWRlZCB3aXRoIGZyYWdtZW50IHByb3BzXG4gKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gZnJhZ21lbnRcbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVGcmFnbWVudFByb3BzKGZyYWdtZW50KSB7XG4gIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGZyYWdtZW50KTtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGZyYWdtZW50LnByb3BzKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgaWYgKGtleSAhPT0gJ2NoaWxkcmVuJyAmJiBrZXkgIT09ICdrZXknKSB7XG4gICAgICB3YXJuaW5nJDEoZmFsc2UsICdJbnZhbGlkIHByb3AgYCVzYCBzdXBwbGllZCB0byBgUmVhY3QuRnJhZ21lbnRgLiAnICsgJ1JlYWN0LkZyYWdtZW50IGNhbiBvbmx5IGhhdmUgYGtleWAgYW5kIGBjaGlsZHJlbmAgcHJvcHMuJywga2V5KTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChmcmFnbWVudC5yZWYgIT09IG51bGwpIHtcbiAgICB3YXJuaW5nJDEoZmFsc2UsICdJbnZhbGlkIGF0dHJpYnV0ZSBgcmVmYCBzdXBwbGllZCB0byBgUmVhY3QuRnJhZ21lbnRgLicpO1xuICB9XG5cbiAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQobnVsbCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRXaXRoVmFsaWRhdGlvbih0eXBlLCBwcm9wcywgY2hpbGRyZW4pIHtcbiAgdmFyIHZhbGlkVHlwZSA9IGlzVmFsaWRFbGVtZW50VHlwZSh0eXBlKTtcblxuICAvLyBXZSB3YXJuIGluIHRoaXMgY2FzZSBidXQgZG9uJ3QgdGhyb3cuIFdlIGV4cGVjdCB0aGUgZWxlbWVudCBjcmVhdGlvbiB0b1xuICAvLyBzdWNjZWVkIGFuZCB0aGVyZSB3aWxsIGxpa2VseSBiZSBlcnJvcnMgaW4gcmVuZGVyLlxuICBpZiAoIXZhbGlkVHlwZSkge1xuICAgIHZhciBpbmZvID0gJyc7XG4gICAgaWYgKHR5cGUgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgJiYgdHlwZSAhPT0gbnVsbCAmJiBPYmplY3Qua2V5cyh0eXBlKS5sZW5ndGggPT09IDApIHtcbiAgICAgIGluZm8gKz0gJyBZb3UgbGlrZWx5IGZvcmdvdCB0byBleHBvcnQgeW91ciBjb21wb25lbnQgZnJvbSB0aGUgZmlsZSAnICsgXCJpdCdzIGRlZmluZWQgaW4sIG9yIHlvdSBtaWdodCBoYXZlIG1peGVkIHVwIGRlZmF1bHQgYW5kIG5hbWVkIGltcG9ydHMuXCI7XG4gICAgfVxuXG4gICAgdmFyIHNvdXJjZUluZm8gPSBnZXRTb3VyY2VJbmZvRXJyb3JBZGRlbmR1bShwcm9wcyk7XG4gICAgaWYgKHNvdXJjZUluZm8pIHtcbiAgICAgIGluZm8gKz0gc291cmNlSW5mbztcbiAgICB9IGVsc2Uge1xuICAgICAgaW5mbyArPSBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKTtcbiAgICB9XG5cbiAgICB2YXIgdHlwZVN0cmluZyA9IHZvaWQgMDtcbiAgICBpZiAodHlwZSA9PT0gbnVsbCkge1xuICAgICAgdHlwZVN0cmluZyA9ICdudWxsJztcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodHlwZSkpIHtcbiAgICAgIHR5cGVTdHJpbmcgPSAnYXJyYXknO1xuICAgIH0gZWxzZSBpZiAodHlwZSAhPT0gdW5kZWZpbmVkICYmIHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRSkge1xuICAgICAgdHlwZVN0cmluZyA9ICc8JyArIChnZXRDb21wb25lbnROYW1lKHR5cGUudHlwZSkgfHwgJ1Vua25vd24nKSArICcgLz4nO1xuICAgICAgaW5mbyA9ICcgRGlkIHlvdSBhY2NpZGVudGFsbHkgZXhwb3J0IGEgSlNYIGxpdGVyYWwgaW5zdGVhZCBvZiBhIGNvbXBvbmVudD8nO1xuICAgIH0gZWxzZSB7XG4gICAgICB0eXBlU3RyaW5nID0gdHlwZW9mIHR5cGU7XG4gICAgfVxuXG4gICAgd2FybmluZyQxKGZhbHNlLCAnUmVhY3QuY3JlYXRlRWxlbWVudDogdHlwZSBpcyBpbnZhbGlkIC0tIGV4cGVjdGVkIGEgc3RyaW5nIChmb3IgJyArICdidWlsdC1pbiBjb21wb25lbnRzKSBvciBhIGNsYXNzL2Z1bmN0aW9uIChmb3IgY29tcG9zaXRlICcgKyAnY29tcG9uZW50cykgYnV0IGdvdDogJXMuJXMnLCB0eXBlU3RyaW5nLCBpbmZvKTtcbiAgfVxuXG4gIHZhciBlbGVtZW50ID0gY3JlYXRlRWxlbWVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gIC8vIFRoZSByZXN1bHQgY2FuIGJlIG51bGxpc2ggaWYgYSBtb2NrIG9yIGEgY3VzdG9tIGZ1bmN0aW9uIGlzIHVzZWQuXG4gIC8vIFRPRE86IERyb3AgdGhpcyB3aGVuIHRoZXNlIGFyZSBubyBsb25nZXIgYWxsb3dlZCBhcyB0aGUgdHlwZSBhcmd1bWVudC5cbiAgaWYgKGVsZW1lbnQgPT0gbnVsbCkge1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgLy8gU2tpcCBrZXkgd2FybmluZyBpZiB0aGUgdHlwZSBpc24ndCB2YWxpZCBzaW5jZSBvdXIga2V5IHZhbGlkYXRpb24gbG9naWNcbiAgLy8gZG9lc24ndCBleHBlY3QgYSBub24tc3RyaW5nL2Z1bmN0aW9uIHR5cGUgYW5kIGNhbiB0aHJvdyBjb25mdXNpbmcgZXJyb3JzLlxuICAvLyBXZSBkb24ndCB3YW50IGV4Y2VwdGlvbiBiZWhhdmlvciB0byBkaWZmZXIgYmV0d2VlbiBkZXYgYW5kIHByb2QuXG4gIC8vIChSZW5kZXJpbmcgd2lsbCB0aHJvdyB3aXRoIGEgaGVscGZ1bCBtZXNzYWdlIGFuZCBhcyBzb29uIGFzIHRoZSB0eXBlIGlzXG4gIC8vIGZpeGVkLCB0aGUga2V5IHdhcm5pbmdzIHdpbGwgYXBwZWFyLilcbiAgaWYgKHZhbGlkVHlwZSkge1xuICAgIGZvciAodmFyIGkgPSAyOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YWxpZGF0ZUNoaWxkS2V5cyhhcmd1bWVudHNbaV0sIHR5cGUpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFKSB7XG4gICAgdmFsaWRhdGVGcmFnbWVudFByb3BzKGVsZW1lbnQpO1xuICB9IGVsc2Uge1xuICAgIHZhbGlkYXRlUHJvcFR5cGVzKGVsZW1lbnQpO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZhY3RvcnlXaXRoVmFsaWRhdGlvbih0eXBlKSB7XG4gIHZhciB2YWxpZGF0ZWRGYWN0b3J5ID0gY3JlYXRlRWxlbWVudFdpdGhWYWxpZGF0aW9uLmJpbmQobnVsbCwgdHlwZSk7XG4gIHZhbGlkYXRlZEZhY3RvcnkudHlwZSA9IHR5cGU7XG4gIC8vIExlZ2FjeSBob29rOiByZW1vdmUgaXRcbiAge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2YWxpZGF0ZWRGYWN0b3J5LCAndHlwZScsIHtcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxvd1ByaW9yaXR5V2FybmluZyQxKGZhbHNlLCAnRmFjdG9yeS50eXBlIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB0aGUgY2xhc3MgZGlyZWN0bHkgJyArICdiZWZvcmUgcGFzc2luZyBpdCB0byBjcmVhdGVGYWN0b3J5LicpO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3R5cGUnLCB7XG4gICAgICAgICAgdmFsdWU6IHR5cGVcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0eXBlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHZhbGlkYXRlZEZhY3Rvcnk7XG59XG5cbmZ1bmN0aW9uIGNsb25lRWxlbWVudFdpdGhWYWxpZGF0aW9uKGVsZW1lbnQsIHByb3BzLCBjaGlsZHJlbikge1xuICB2YXIgbmV3RWxlbWVudCA9IGNsb25lRWxlbWVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICBmb3IgKHZhciBpID0gMjsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhbGlkYXRlQ2hpbGRLZXlzKGFyZ3VtZW50c1tpXSwgbmV3RWxlbWVudC50eXBlKTtcbiAgfVxuICB2YWxpZGF0ZVByb3BUeXBlcyhuZXdFbGVtZW50KTtcbiAgcmV0dXJuIG5ld0VsZW1lbnQ7XG59XG5cbnZhciBSZWFjdCA9IHtcbiAgQ2hpbGRyZW46IHtcbiAgICBtYXA6IG1hcENoaWxkcmVuLFxuICAgIGZvckVhY2g6IGZvckVhY2hDaGlsZHJlbixcbiAgICBjb3VudDogY291bnRDaGlsZHJlbixcbiAgICB0b0FycmF5OiB0b0FycmF5LFxuICAgIG9ubHk6IG9ubHlDaGlsZFxuICB9LFxuXG4gIGNyZWF0ZVJlZjogY3JlYXRlUmVmLFxuICBDb21wb25lbnQ6IENvbXBvbmVudCxcbiAgUHVyZUNvbXBvbmVudDogUHVyZUNvbXBvbmVudCxcblxuICBjcmVhdGVDb250ZXh0OiBjcmVhdGVDb250ZXh0LFxuICBmb3J3YXJkUmVmOiBmb3J3YXJkUmVmLFxuICBsYXp5OiBsYXp5LFxuICBtZW1vOiBtZW1vLFxuXG4gIEZyYWdtZW50OiBSRUFDVF9GUkFHTUVOVF9UWVBFLFxuICBTdHJpY3RNb2RlOiBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFLFxuICBTdXNwZW5zZTogUkVBQ1RfU1VTUEVOU0VfVFlQRSxcblxuICBjcmVhdGVFbGVtZW50OiBjcmVhdGVFbGVtZW50V2l0aFZhbGlkYXRpb24sXG4gIGNsb25lRWxlbWVudDogY2xvbmVFbGVtZW50V2l0aFZhbGlkYXRpb24sXG4gIGNyZWF0ZUZhY3Rvcnk6IGNyZWF0ZUZhY3RvcnlXaXRoVmFsaWRhdGlvbixcbiAgaXNWYWxpZEVsZW1lbnQ6IGlzVmFsaWRFbGVtZW50LFxuXG4gIHZlcnNpb246IFJlYWN0VmVyc2lvbixcblxuICB1bnN0YWJsZV9Db25jdXJyZW50TW9kZTogUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEUsXG4gIHVuc3RhYmxlX1Byb2ZpbGVyOiBSRUFDVF9QUk9GSUxFUl9UWVBFLFxuXG4gIF9fU0VDUkVUX0lOVEVSTkFMU19ET19OT1RfVVNFX09SX1lPVV9XSUxMX0JFX0ZJUkVEOiBSZWFjdFNoYXJlZEludGVybmFsc1xufTtcblxuLy8gTm90ZTogc29tZSBBUElzIGFyZSBhZGRlZCB3aXRoIGZlYXR1cmUgZmxhZ3MuXG4vLyBNYWtlIHN1cmUgdGhhdCBzdGFibGUgYnVpbGRzIGZvciBvcGVuIHNvdXJjZVxuLy8gZG9uJ3QgbW9kaWZ5IHRoZSBSZWFjdCBvYmplY3QgdG8gYXZvaWQgZGVvcHRzLlxuLy8gQWxzbyBsZXQncyBub3QgZXhwb3NlIHRoZWlyIG5hbWVzIGluIHN0YWJsZSBidWlsZHMuXG5cbmlmIChlbmFibGVTdGFibGVDb25jdXJyZW50TW9kZUFQSXMpIHtcbiAgUmVhY3QuQ29uY3VycmVudE1vZGUgPSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRTtcbiAgUmVhY3QuUHJvZmlsZXIgPSBSRUFDVF9QUk9GSUxFUl9UWVBFO1xuICBSZWFjdC51bnN0YWJsZV9Db25jdXJyZW50TW9kZSA9IHVuZGVmaW5lZDtcbiAgUmVhY3QudW5zdGFibGVfUHJvZmlsZXIgPSB1bmRlZmluZWQ7XG59XG5cbmlmIChlbmFibGVIb29rcykge1xuICBSZWFjdC51c2VDYWxsYmFjayA9IHVzZUNhbGxiYWNrO1xuICBSZWFjdC51c2VDb250ZXh0ID0gdXNlQ29udGV4dDtcbiAgUmVhY3QudXNlRWZmZWN0ID0gdXNlRWZmZWN0O1xuICBSZWFjdC51c2VJbXBlcmF0aXZlTWV0aG9kcyA9IHVzZUltcGVyYXRpdmVNZXRob2RzO1xuICBSZWFjdC51c2VMYXlvdXRFZmZlY3QgPSB1c2VMYXlvdXRFZmZlY3Q7XG4gIFJlYWN0LnVzZU1lbW8gPSB1c2VNZW1vO1xuICBSZWFjdC51c2VSZWR1Y2VyID0gdXNlUmVkdWNlcjtcbiAgUmVhY3QudXNlUmVmID0gdXNlUmVmO1xuICBSZWFjdC51c2VTdGF0ZSA9IHVzZVN0YXRlO1xufVxuXG5cblxudmFyIFJlYWN0JDIgPSBPYmplY3QuZnJlZXplKHtcblx0ZGVmYXVsdDogUmVhY3Rcbn0pO1xuXG52YXIgUmVhY3QkMyA9ICggUmVhY3QkMiAmJiBSZWFjdCApIHx8IFJlYWN0JDI7XG5cbi8vIFRPRE86IGRlY2lkZSBvbiB0aGUgdG9wLWxldmVsIGV4cG9ydCBmb3JtLlxuLy8gVGhpcyBpcyBoYWNreSBidXQgbWFrZXMgaXQgd29yayB3aXRoIGJvdGggUm9sbHVwIGFuZCBKZXN0LlxudmFyIHJlYWN0ID0gUmVhY3QkMy5kZWZhdWx0IHx8IFJlYWN0JDM7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVhY3Q7XG4gIH0pKCk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QucHJvZHVjdGlvbi5taW4uanMnKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QuZGV2ZWxvcG1lbnQuanMnKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=