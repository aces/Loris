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
/******/ 	return __webpack_require__(__webpack_require__.s = "./modules/instrument_manager/jsx/instrumentManagerIndex.js");
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

/***/ "./jsx/Tabs.js":
/*!*********************!*\
  !*** ./jsx/Tabs.js ***!
  \*********************/
/*! exports provided: Tabs, VerticalTabs, TabPane */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Tabs", function() { return Tabs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VerticalTabs", function() { return VerticalTabs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TabPane", function() { return TabPane; });
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
 * This file contains React components for Tabs component.
 *
 * @author Loris Team
 * @version 1.1.0
 *
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

var Tabs =
/*#__PURE__*/
function (_Component) {
  _inherits(Tabs, _Component);

  function Tabs(props) {
    var _this;

    _classCallCheck(this, Tabs);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Tabs).call(this, props));
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
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.getTabs = _this.getTabs.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.getTabPanes = _this.getTabPanes.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Tabs, [{
    key: "handleClick",
    value: function handleClick(tabId, e) {
      this.setState({
        activeTab: tabId
      });
      this.props.onTabChange(tabId); // Add tab href to URL querystring and scroll the page to top

      if (this.props.updateURL) {
        var scrollDistance = $('body').scrollTop() || $('html').scrollTop();
        window.location.hash = e.target.hash;
        $('html,body').scrollTop(scrollDistance);
      }
    }
  }, {
    key: "getTabs",
    value: function getTabs() {
      var tabs = this.props.tabs.map(function (tab) {
        var tabClass = this.state.activeTab === tab.id ? 'active' : null;
        var href = '#' + tab.id;
        var tabID = 'tab-' + tab.id;
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
          role: "presentation",
          className: tabClass,
          key: tab.id
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          id: tabID,
          href: href,
          role: "tab",
          "data-toggle": "tab",
          onClick: this.handleClick.bind(null, tab.id)
        }, tab.label));
      }.bind(this));
      return tabs;
    }
  }, {
    key: "getTabPanes",
    value: function getTabPanes() {
      var tabPanes = react__WEBPACK_IMPORTED_MODULE_0___default.a.Children.map(this.props.children, function (child, key) {
        if (child) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.cloneElement(child, {
            activeTab: this.state.activeTab,
            key: key
          });
        }
      }.bind(this));
      return tabPanes;
    }
  }, {
    key: "render",
    value: function render() {
      var tabs = this.getTabs();
      var tabPanes = this.getTabPanes();
      var tabStyle = {
        marginLeft: 0,
        marginBottom: '5px'
      };
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        className: "nav nav-tabs",
        role: "tablist",
        style: tabStyle
      }, tabs), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-content"
      }, tabPanes));
    }
  }]);

  return Tabs;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

Tabs.propTypes = {
  tabs: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array.isRequired,
  defaultTab: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  updateURL: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool
};
Tabs.defaultProps = {
  onTabChange: function onTabChange() {},
  // Set updateURL to default to true but allow for change
  // Nested tabs should set this variable to false
  updateURL: true
};
/**
 * Allows to dynamically render vertical tabs corresponding to tab panes.
 */

var VerticalTabs =
/*#__PURE__*/
function (_Component2) {
  _inherits(VerticalTabs, _Component2);

  function VerticalTabs(props) {
    var _this2;

    _classCallCheck(this, VerticalTabs);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(VerticalTabs).call(this, props));
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
    _this2.handleClick = _this2.handleClick.bind(_assertThisInitialized(_assertThisInitialized(_this2)));
    _this2.getTabs = _this2.getTabs.bind(_assertThisInitialized(_assertThisInitialized(_this2)));
    _this2.getTabPanes = _this2.getTabPanes.bind(_assertThisInitialized(_assertThisInitialized(_this2)));
    return _this2;
  }

  _createClass(VerticalTabs, [{
    key: "handleClick",
    value: function handleClick(tabId, e) {
      this.setState({
        activeTab: tabId
      });
      this.props.onTabChange(tabId); // Add tab href to URL querystring and scroll the page to top

      if (this.props.updateURL) {
        var scrollDistance = $('body').scrollTop() || $('html').scrollTop();
        window.location.hash = e.target.hash;
        $('html,body').scrollTop(scrollDistance);
      }
    }
  }, {
    key: "getTabs",
    value: function getTabs() {
      var tabs = this.props.tabs.map(function (tab) {
        var tabClass = this.state.activeTab === tab.id ? 'active' : null;
        var href = '#' + tab.id;
        var tabID = 'tab-' + tab.id;
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
          role: "presentation",
          className: tabClass,
          key: tab.id
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          id: tabID,
          href: href,
          role: "tab",
          "data-toggle": "tab",
          onClick: this.handleClick.bind(null, tab.id)
        }, tab.label));
      }.bind(this));
      return tabs;
    }
  }, {
    key: "getTabPanes",
    value: function getTabPanes() {
      var tabPanes = react__WEBPACK_IMPORTED_MODULE_0___default.a.Children.map(this.props.children, function (child, key) {
        if (child) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.cloneElement(child, {
            activeTab: this.state.activeTab,
            key: key
          });
        }
      }.bind(this));
      return tabPanes;
    }
  }, {
    key: "render",
    value: function render() {
      var tabs = this.getTabs();
      var tabPanes = this.getTabPanes();
      var tabStyle = {
        marginLeft: 0,
        marginBottom: '5px'
      };
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tabbable col-md-3 col-sm-3"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        className: "nav nav-pills nav-stacked",
        role: "tablist",
        style: tabStyle
      }, tabs)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-content col-md-9 col-sm-9"
      }, tabPanes));
    }
  }]);

  return VerticalTabs;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

VerticalTabs.propTypes = {
  tabs: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array.isRequired,
  defaultTab: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  updateURL: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool
};
VerticalTabs.defaultProps = {
  onTabChange: function onTabChange() {},
  // Set updateURL to default to true but allow for change
  // Nested tabs should set this variable to false
  updateURL: true
};
/*
 * TabPane component.
 * Used to wrap content for every tab.
 */

var TabPane =
/*#__PURE__*/
function (_Component3) {
  _inherits(TabPane, _Component3);

  function TabPane() {
    _classCallCheck(this, TabPane);

    return _possibleConstructorReturn(this, _getPrototypeOf(TabPane).apply(this, arguments));
  }

  _createClass(TabPane, [{
    key: "render",
    value: function render() {
      var classList = 'tab-pane';
      var title;

      if (this.props.TabId === this.props.activeTab) {
        classList += ' active';
      }

      if (this.props.Title) {
        title = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, this.props.Title);
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        role: "tabpanel",
        className: classList,
        id: this.props.TabId
      }, title, this.props.children);
    }
  }]);

  return TabPane;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

TabPane.propTypes = {
  TabId: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  Title: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  activeTab: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string
};


/***/ }),

/***/ "./modules/instrument_manager/jsx/instrumentManagerIndex.js":
/*!******************************************************************!*\
  !*** ./modules/instrument_manager/jsx/instrumentManagerIndex.js ***!
  \******************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var Tabs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! Tabs */ "./jsx/Tabs.js");
/* harmony import */ var Loader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! Loader */ "./jsx/Loader.js");
/* harmony import */ var FilterableDataTable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! FilterableDataTable */ "./jsx/FilterableDataTable.js");
/* harmony import */ var _uploadForm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./uploadForm */ "./modules/instrument_manager/jsx/uploadForm.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }








var InstrumentManagerIndex =
/*#__PURE__*/
function (_Component) {
  _inherits(InstrumentManagerIndex, _Component);

  function InstrumentManagerIndex(props) {
    var _this;

    _classCallCheck(this, InstrumentManagerIndex);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InstrumentManagerIndex).call(this, props));
    _this.state = {
      data: {},
      error: false,
      isLoaded: false
    };
    _this.fetchData = _this.fetchData.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.formatColumn = _this.formatColumn.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(InstrumentManagerIndex, [{
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
        return _this3.setState({
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
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, cell);
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      // If error occurs, return a message.
      // XXX: Replace this with a UI component for 500 errors.
      if (this.state.error) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, "An error occured while loading the page.");
      } // Waiting for async data to load


      if (!this.state.isLoaded) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Loader__WEBPACK_IMPORTED_MODULE_3__["default"], null);
      }

      var fields = [{
        label: 'Instrument',
        show: true,
        filter: {
          name: 'instrument',
          type: 'text'
        }
      }, {
        label: 'Instrument Type',
        show: true,
        filter: {
          name: 'instrumentType',
          type: 'select',
          options: {
            'Instrument Builder': 'Instrument Builder',
            'PHP': 'PHP',
            'Missing': 'Missing'
          }
        }
      }, {
        label: 'Table Installed',
        show: true,
        filter: {
          name: 'tableInstalled',
          type: 'select',
          options: {
            'Exists': 'Exists',
            'Missing': 'Missing'
          }
        }
      }, {
        label: 'Table Valid',
        show: true,
        filter: {
          name: 'tableValid',
          type: 'text'
        }
      }, {
        label: 'Pages Valid',
        show: true,
        filter: {
          name: 'pagesValid',
          type: 'text'
        }
      }];
      var tabs = [{
        id: 'browse',
        label: 'Browse'
      }, {
        id: 'upload',
        label: 'Upload'
      }];

      var feedback = function feedback() {
        if (!_this4.state.data.caninstall) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
            className: "alert alert-warning"
          }, "Instrument installation is not possible given the current server configuration; the LORIS 'quatUser' is not configured properly. File upload is still possible but instruments will need to be installed manually");
        }
      };

      var uploadTab = function uploadTab() {
        var content = null;

        if (_this4.state.data.writable) {
          var url = loris.BaseURL.concat('/instrument_manager/?format=json');
          content = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_uploadForm__WEBPACK_IMPORTED_MODULE_5__["default"], {
            action: url
          });
        } else {
          content = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
            className: "alert alert-warning"
          }, "Installation is not possible given the current server configuration. Please contact your administrator if you require this functionality");
        }

        return content;
      };

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Tabs__WEBPACK_IMPORTED_MODULE_2__["Tabs"], {
        tabs: tabs,
        defaultTab: "browse",
        updateURL: true
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Tabs__WEBPACK_IMPORTED_MODULE_2__["TabPane"], {
        TabId: tabs[0].id
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FilterableDataTable__WEBPACK_IMPORTED_MODULE_4__["default"], {
        name: "instrument_manager",
        data: this.state.data.Data,
        fields: fields,
        getFormattedCell: this.formatColumn
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Tabs__WEBPACK_IMPORTED_MODULE_2__["TabPane"], {
        TabId: "upload"
      }, feedback(), uploadTab()));
    }
  }]);

  return InstrumentManagerIndex;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

InstrumentManagerIndex.propTypes = {
  dataURL: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  hasPermission: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func.isRequired
};
window.addEventListener('load', function () {
  ReactDOM.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(InstrumentManagerIndex, {
    dataURL: "".concat(loris.BaseURL, "/instrument_manager/?format=json"),
    hasPermission: loris.userHasPermission
  }), document.getElementById('lorisworkspace'));
});

/***/ }),

/***/ "./modules/instrument_manager/jsx/uploadForm.js":
/*!******************************************************!*\
  !*** ./modules/instrument_manager/jsx/uploadForm.js ***!
  \******************************************************/
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




var InstrumentUploadForm =
/*#__PURE__*/
function (_Component) {
  _inherits(InstrumentUploadForm, _Component);

  function InstrumentUploadForm(props) {
    var _this;

    _classCallCheck(this, InstrumentUploadForm);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InstrumentUploadForm).call(this, props));
    _this.state = {
      data: {},
      selectedFile: null
    };
    _this.fileSelected = _this.fileSelected.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.upload = _this.upload.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(InstrumentUploadForm, [{
    key: "fileSelected",
    value: function fileSelected(element, file) {
      this.setState({
        selectedFile: file
      });
    }
  }, {
    key: "upload",
    value: function upload() {
      var _this2 = this;

      var data = new FormData();
      data.append('install_file', this.state.selectedFile);
      fetch(this.props.action, {
        method: 'POST',
        credentials: 'same-origin',
        body: data
      }).then(function (resp) {
        if (resp.status == 201) {
          swal({
            title: 'Installation Successful!',
            type: 'success'
          }, function () {
            window.location.assign(loris.BaseURL + '/instrument_manager/');
          });
        }

        return resp.json();
      }).then(function (data) {
        if (data.message) {
          swal({
            title: 'Upload Successful!',
            type: 'success',
            text: data.message
          }, function () {
            window.location.assign(loris.BaseURL + '/instrument_manager/');
          });
        }

        if (data.error) {
          swal({
            title: 'An error occured',
            type: 'error',
            text: data.error
          });
        }
      }).catch(function (error) {
        _this2.setState({
          error: true
        });

        console.error(error);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var disabled = function disabled() {
        return _this3.state.selectedFile === null;
      };

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-xs-4"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel panel-primary"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-heading"
      }, "Upload Instrument"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-body"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-xs-12"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FileElement, {
        name: "install_file",
        label: "Instrument file",
        onUserInput: this.fileSelected,
        value: this.state.selectedFile
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-default",
        onClick: this.upload,
        disabled: disabled()
      }, "Install"))))));
    }
  }]);

  return InstrumentUploadForm;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

InstrumentUploadForm.propTypes = {
  action: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired
};
/* harmony default export */ __webpack_exports__["default"] = (InstrumentUploadForm);

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
  var has = Function.call.bind(Object.prototype.hasOwnProperty);

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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var checkPropTypes = __webpack_require__(/*! ./checkPropTypes */ "./node_modules/prop-types/checkPropTypes.js");

var has = Function.call.bind(Object.prototype.hasOwnProperty);
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
        if (getPropType(value) === 'symbol') {
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
  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
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

/***/ "./node_modules/react-is/cjs/react-is.development.js":
/*!***********************************************************!*\
  !*** ./node_modules/react-is/cjs/react-is.development.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v16.8.1
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

Object.defineProperty(exports, '__esModule', { value: true });

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
var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' ||
  // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE);
}

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
              case REACT_PROVIDER_TYPE:
                return $$typeofType;
              default:
                return $$typeof;
            }
        }
      case REACT_LAZY_TYPE:
      case REACT_MEMO_TYPE:
      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
}

// AsyncMode is deprecated along with isAsyncMode
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

var hasWarnedAboutDeprecatedIsAsyncMode = false;

// AsyncMode should be deprecated
function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true;
      lowPriorityWarning$1(false, 'The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
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

exports.typeOf = typeOf;
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
exports.isValidElementType = isValidElementType;
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
  })();
}


/***/ }),

/***/ "./node_modules/react-is/index.js":
/*!****************************************!*\
  !*** ./node_modules/react-is/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ "./node_modules/react-is/cjs/react-is.development.js");
}


/***/ }),

/***/ "./node_modules/react/cjs/react.development.js":
/*!*****************************************************!*\
  !*** ./node_modules/react/cjs/react.development.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v16.8.1
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

var ReactVersion = '16.8.1';

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
 * Keeps track of the current dispatcher.
 */
var ReactCurrentDispatcher = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

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
  current: null
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
  ReactCurrentDispatcher: ReactCurrentDispatcher,
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
  var dispatcher = ReactCurrentDispatcher.current;
  !(dispatcher !== null) ? invariant(false, 'Hooks can only be called inside the body of a function component. (https://fb.me/react-invalid-hook-call)') : void 0;
  return dispatcher;
}

function useContext(Context, unstable_observedBits) {
  var dispatcher = resolveDispatcher();
  {
    !(unstable_observedBits === undefined) ? warning$1(false, 'useContext() second argument is reserved for future ' + 'use in React. Passing it is not supported. ' + 'You passed: %s.%s', unstable_observedBits, typeof unstable_observedBits === 'number' && Array.isArray(arguments[2]) ? '\n\nDid you call array.map(useContext)? ' + 'Calling Hooks inside a loop is not supported. ' + 'Learn more at https://fb.me/rules-of-hooks' : '') : void 0;

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
  return dispatcher.useContext(Context, unstable_observedBits);
}

function useState(initialState) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}

function useReducer(reducer, initialArg, init) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
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

function useImperativeHandle(ref, create, inputs) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useImperativeHandle(ref, create, inputs);
}

function useDebugValue(value, formatterFn) {
  {
    var dispatcher = resolveDispatcher();
    return dispatcher.useDebugValue(value, formatterFn);
  }
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
    warning$1(false, 'Each child in a list should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.', currentComponentErrorInfo, childOwner);
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

  useCallback: useCallback,
  useContext: useContext,
  useEffect: useEffect,
  useImperativeHandle: useImperativeHandle,
  useDebugValue: useDebugValue,
  useLayoutEffect: useLayoutEffect,
  useMemo: useMemo,
  useReducer: useReducer,
  useRef: useRef,
  useState: useState,

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vanN4L0RhdGFUYWJsZS5qcyIsIndlYnBhY2s6Ly8vLi9qc3gvRmlsdGVyLmpzIiwid2VicGFjazovLy8uL2pzeC9GaWx0ZXJhYmxlRGF0YVRhYmxlLmpzIiwid2VicGFjazovLy8uL2pzeC9Gb3JtLmpzIiwid2VicGFjazovLy8uL2pzeC9Mb2FkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanN4L1BhZ2luYXRpb25MaW5rcy5qcyIsIndlYnBhY2s6Ly8vLi9qc3gvUGFuZWwuanMiLCJ3ZWJwYWNrOi8vLy4vanN4L1RhYnMuanMiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9pbnN0cnVtZW50X21hbmFnZXIvanN4L2luc3RydW1lbnRNYW5hZ2VySW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9pbnN0cnVtZW50X21hbmFnZXIvanN4L3VwbG9hZEZvcm0uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZianMvbGliL2VtcHR5RnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZianMvbGliL2ludmFyaWFudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZmJqcy9saWIvd2FybmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9jaGVja1Byb3BUeXBlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9mYWN0b3J5V2l0aFR5cGVDaGVja2Vycy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JlYWN0LWFkZG9ucy1jcmVhdGUtZnJhZ21lbnQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JlYWN0LWlzL2Nqcy9yZWFjdC1pcy5kZXZlbG9wbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVhY3QtaXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JlYWN0L2Nqcy9yZWFjdC5kZXZlbG9wbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVhY3QvaW5kZXguanMiXSwibmFtZXMiOlsiRGF0YVRhYmxlIiwicHJvcHMiLCJzdGF0ZSIsIlBhZ2VOdW1iZXIiLCJTb3J0Q29sdW1uIiwiU29ydE9yZGVyIiwiUm93c1BlclBhZ2UiLCJIaWRlIiwiY2hhbmdlUGFnZSIsImJpbmQiLCJzZXRTb3J0Q29sdW1uIiwiY2hhbmdlUm93c1BlclBhZ2UiLCJkb3dubG9hZENTViIsImNvdW50RmlsdGVyZWRSb3dzIiwiZ2V0U29ydGVkUm93cyIsImhhc0ZpbHRlcktleXdvcmQiLCJyZW5kZXJBY3Rpb25zIiwialF1ZXJ5IiwiZm4iLCJEeW5hbWljVGFibGUiLCJmcmVlemVDb2x1bW4iLCIkIiwiZGVmYXVsdENvbHVtbiIsImZpbmQiLCJoaWRlIiwibW9kdWxlUHJlZnMiLCJKU09OIiwicGFyc2UiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwibG9yaXMiLCJUZXN0TmFtZSIsInVuZGVmaW5lZCIsInJvd3NQZXJQYWdlIiwic2V0U3RhdGUiLCJwcmV2UHJvcHMiLCJwcmV2U3RhdGUiLCJvblNvcnQiLCJpbmRleCIsImhlYWRlckxpc3QiLCJmaWVsZHMiLCJtYXAiLCJmaWVsZCIsImxhYmVsIiwiZGF0YSIsInBhZ2VObyIsImNvbE51bWJlciIsImUiLCJ2YWwiLCJ0YXJnZXQiLCJ2YWx1ZSIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJjc3ZEYXRhIiwiY3N2d29ya2VyIiwiV29ya2VyIiwiQmFzZVVSTCIsImFkZEV2ZW50TGlzdGVuZXIiLCJkYXRhVVJMIiwiZGF0YURhdGUiLCJsaW5rIiwiY21kIiwiRGF0ZSIsInRvSVNPU3RyaW5nIiwid2luZG93IiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwibWVzc2FnZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImRvd25sb2FkIiwidHlwZSIsImhyZWYiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjbGljayIsInJlbW92ZUNoaWxkIiwicG9zdE1lc3NhZ2UiLCJoZWFkZXJzIiwiaWRlbnRpZmllcnMiLCJSb3dOYW1lTWFwIiwidXNlS2V5d29yZCIsImZpbHRlck1hdGNoQ291bnQiLCJmaWx0ZXJWYWx1ZXNDb3VudCIsImZpbHRlciIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJ0YWJsZURhdGEiLCJmaWVsZERhdGEiLCJrZXl3b3JkIiwiaSIsImhlYWRlckNvdW50Iiwia2V5d29yZE1hdGNoIiwiaiIsIm5hbWUiLCJoYXNGaWx0ZXJzIiwiaXNTdHJpbmciLCJTdHJpbmciLCJpc051bWJlciIsImlzTmFOIiwiTnVtYmVyIiwidG9Mb3dlckNhc2UiLCJwdXNoIiwiUm93SWR4IiwiVmFsdWUiLCJDb250ZW50Iiwic29ydCIsImEiLCJiIiwiZmlsdGVyRGF0YSIsImV4YWN0TWF0Y2giLCJyZXN1bHQiLCJzZWFyY2hLZXkiLCJzZWFyY2hTdHJpbmciLCJpbnREYXRhIiwicGFyc2VJbnQiLCJzZWFyY2hBcnJheSIsImluY2x1ZGVzIiwiaW5kZXhPZiIsIm1hdGNoIiwiYWN0aW9ucyIsImFjdGlvbiIsImtleSIsIlJvd051bUxhYmVsIiwic2hvdyIsImNvbEluZGV4Iiwicm93cyIsImN1clJvdyIsIm1hdGNoZXNGb3VuZCIsImZpbHRlcmVkUm93cyIsImN1cnJlbnRQYWdlUm93IiwiZmlsdGVyZWREYXRhIiwiZmlsdGVyTGVuZ3RoIiwiZ2V0Rm9ybWF0dGVkQ2VsbCIsInJvdyIsImZvckVhY2giLCJrIiwiY3JlYXRlRnJhZ21lbnQiLCJyb3dJbmRleCIsIlJvd3NQZXJQYWdlRHJvcGRvd24iLCJoZWFkZXIiLCJtYXJnaW5Ub3AiLCJmb290ZXIiLCJtYXJnaW4iLCJDb21wb25lbnQiLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJhcnJheSIsImlzUmVxdWlyZWQiLCJzdHJpbmciLCJmdW5jIiwib2JqZWN0IiwiZGVmYXVsdFByb3BzIiwiRmlsdGVyIiwib25GaWVsZFVwZGF0ZSIsInJlbmRlckZpbHRlckZpZWxkcyIsImlkIiwidXBkYXRlRmlsdGVyIiwicmVkdWNlIiwiZWxlbWVudCIsIm9wdGlvbnMiLCJSZWFjdCIsImNsb25lRWxlbWVudCIsIm9uVXNlcklucHV0IiwiY29sdW1ucyIsInRpdGxlIiwiY2xlYXJGaWx0ZXIiLCJjb25zb2xlIiwid2FybiIsIkZpbHRlcmFibGVEYXRhVGFibGUiLCJudW1iZXIiLCJGb3JtRWxlbWVudCIsImdldEZvcm1FbGVtZW50cyIsImhhbmRsZVN1Ym1pdCIsImZvcm1FbGVtZW50c0hUTUwiLCJtYXhDb2x1bW5TaXplIiwiY29sU2l6ZSIsIk1hdGgiLCJmbG9vciIsImNvbENsYXNzIiwiZm9ybUVsZW1lbnRzIiwib2JqS2V5IiwidXNlcklucHV0IiwiQ2hpbGRyZW4iLCJjaGlsZHJlbiIsImNoaWxkIiwiZWxlbWVudENsYXNzIiwiaXNWYWxpZEVsZW1lbnQiLCJvblN1Ym1pdCIsInByZXZlbnREZWZhdWx0IiwiZW5jVHlwZSIsImZpbGVVcGxvYWQiLCJyb3dTdHlsZXMiLCJkaXNwbGF5IiwiZmxleFdyYXAiLCJjbGFzcyIsIm1ldGhvZCIsIm9uZU9mIiwic2hhcGUiLCJlbGVtZW50TmFtZSIsIkZpZWxkc2V0RWxlbWVudCIsImxlZ2VuZCIsIlNlYXJjaGFibGVEcm9wZG93biIsImdldEtleUZyb21WYWx1ZSIsImhhbmRsZUNoYW5nZSIsImhhbmRsZUJsdXIiLCJnZXRUZXh0SW5wdXRWYWx1ZSIsIm8iLCJzdHJpY3RTZWFyY2giLCJ2YWx1ZXMiLCJxdWVyeVNlbGVjdG9yIiwicmVxdWlyZWQiLCJkaXNhYmxlZCIsInNvcnRCeVZhbHVlIiwic3RyaWN0TWVzc2FnZSIsImVycm9yTWVzc2FnZSIsInJlcXVpcmVkSFRNTCIsIm1zZyIsIm5ld09wdGlvbnMiLCJvcHRpb25MaXN0IiwiaGFzT3duUHJvcGVydHkiLCJvcHRpb24iLCJwbGFjZUhvbGRlciIsImJvb2wiLCJvbmVPZlR5cGUiLCJTZWxlY3RFbGVtZW50IiwibnVtT2ZPcHRpb25zIiwibXVsdGlwbGUiLCJsIiwic2VsZWN0ZWQiLCJlbXB0eU9wdGlvbkhUTUwiLCJlbXB0eU9wdGlvbiIsImhhc0Vycm9yIiwiVGFnc0VsZW1lbnQiLCJoYW5kbGVLZXlQcmVzcyIsImhhbmRsZUFkZCIsImhhbmRsZVJlbW92ZSIsImNhbkFkZEl0ZW0iLCJwZW5kaW5nVmFsS2V5Iiwia2V5Q29kZSIsIndoaWNoIiwidXNlU2VhcmNoIiwib25Vc2VyQWRkIiwiZ2V0QXR0cmlidXRlIiwib25Vc2VyUmVtb3ZlIiwiYWxsb3dEdXBsIiwiaXRlbXMiLCJpbnB1dCIsIml0ZW0iLCJpdG1UeHQiLCJidG5MYWJlbCIsIlRleHRhcmVhRWxlbWVudCIsImNvbHMiLCJUZXh0Ym94RWxlbWVudCIsIm9uVXNlckJsdXIiLCJEYXRlRWxlbWVudCIsIm1pblllYXIiLCJtYXhZZWFyIiwiVGltZUVsZW1lbnQiLCJOdW1lcmljRWxlbWVudCIsIm1pbiIsIm1heCIsIkZpbGVFbGVtZW50IiwiZmlsZSIsImZpbGVzIiwiZmlsZU5hbWUiLCJ0cnVuY2F0ZUVsbGlwc2lzIiwidGFibGVMYXlvdXQiLCJ3aWR0aCIsIndoaXRlU3BhY2UiLCJ0cnVuY2F0ZUVsbGlwc2lzQ2hpbGQiLCJvdmVyZmxvdyIsInRleHRPdmVyZmxvdyIsImZpbGVIVE1MIiwicGFkZGluZ1RvcCIsIlN0YXRpY0VsZW1lbnQiLCJ0ZXh0IiwiTGlua0VsZW1lbnQiLCJDaGVja2JveEVsZW1lbnQiLCJjaGVja2VkIiwiQnV0dG9uRWxlbWVudCIsImhhbmRsZUNsaWNrIiwiY29sdW1uU2l6ZSIsImJ1dHRvbkNsYXNzIiwiQ1RBIiwiTG9yaXNFbGVtZW50IiwiZWxlbWVudFByb3BzIiwicmVmIiwiZWxlbWVudEh0bWwiLCJMb2FkZXIiLCJzaXplIiwiaGVpZ2h0IiwiUGFnaW5hdGlvbkxpbmtzIiwiZXZ0Iiwib25DaGFuZ2VQYWdlIiwicGFnZUxpbmtzIiwiY2xhc3NMaXN0IiwibGFzdFBhZ2UiLCJjZWlsIiwiVG90YWwiLCJzdGFydFBhZ2UiLCJBY3RpdmUiLCJsYXN0U2hvd25QYWdlIiwidG9TdHJpbmciLCJSUGFnaW5hdGlvbkxpbmtzIiwiY3JlYXRlRmFjdG9yeSIsIlBhbmVsIiwiY29sbGFwc2VkIiwiaW5pdENvbGxhcHNlZCIsInBhbmVsQ2xhc3MiLCJ0b2dnbGVDb2xsYXBzZWQiLCJnbHlwaENsYXNzIiwicGFuZWxIZWFkaW5nIiwiY3Vyc29yIiwiVGFicyIsImhhc2giLCJsb2NhdGlvbiIsImFjdGl2ZVRhYiIsInVwZGF0ZVVSTCIsInN1YnN0ciIsImRlZmF1bHRUYWIiLCJ0YWJzIiwiZ2V0VGFicyIsImdldFRhYlBhbmVzIiwidGFiSWQiLCJvblRhYkNoYW5nZSIsInNjcm9sbERpc3RhbmNlIiwic2Nyb2xsVG9wIiwidGFiIiwidGFiQ2xhc3MiLCJ0YWJJRCIsInRhYlBhbmVzIiwidGFiU3R5bGUiLCJtYXJnaW5MZWZ0IiwibWFyZ2luQm90dG9tIiwiVmVydGljYWxUYWJzIiwiVGFiUGFuZSIsIlRhYklkIiwiVGl0bGUiLCJJbnN0cnVtZW50TWFuYWdlckluZGV4IiwiZXJyb3IiLCJpc0xvYWRlZCIsImZldGNoRGF0YSIsImZvcm1hdENvbHVtbiIsInRoZW4iLCJmZXRjaCIsImNyZWRlbnRpYWxzIiwicmVzcCIsImpzb24iLCJjYXRjaCIsImNvbHVtbiIsImNlbGwiLCJmZWVkYmFjayIsImNhbmluc3RhbGwiLCJ1cGxvYWRUYWIiLCJjb250ZW50Iiwid3JpdGFibGUiLCJ1cmwiLCJjb25jYXQiLCJEYXRhIiwiaGFzUGVybWlzc2lvbiIsIlJlYWN0RE9NIiwicmVuZGVyIiwidXNlckhhc1Blcm1pc3Npb24iLCJnZXRFbGVtZW50QnlJZCIsIkluc3RydW1lbnRVcGxvYWRGb3JtIiwic2VsZWN0ZWRGaWxlIiwiZmlsZVNlbGVjdGVkIiwidXBsb2FkIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJzdGF0dXMiLCJzd2FsIiwiYXNzaWduIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBOzs7Ozs7O0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7OztJQUlNQSxTOzs7OztBQUNKLHFCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUE7O0FBQ2pCLG1GQUFNQSxLQUFOO0FBRUEsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGdCQUFVLEVBQUUsQ0FERDtBQUVYQyxnQkFBVSxFQUFFLENBQUMsQ0FGRjtBQUdYQyxlQUFTLEVBQUUsS0FIQTtBQUlYQyxpQkFBVyxFQUFFLEVBSkY7QUFLWEMsVUFBSSxFQUFFLE1BQUtOLEtBQUwsQ0FBV007QUFMTixLQUFiO0FBUUEsVUFBS0MsVUFB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O0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsVUFBVSxLQUFxQztBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixzQkFBc0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVLElBQXFDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLDJCQUEyQjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNLEtBQXFDLDRGQUE0RixTQUFNO0FBQzdJO0FBQ0E7O0FBRUEsbUJBQW1CLGdDQUFnQztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsZ0NBQWdDO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3hrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUksSUFBcUM7QUFDekMsZ0JBQWdCLG1CQUFPLENBQUMsa0RBQVU7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixtQkFBTyxDQUFDLHVGQUEyQjtBQUN0RCxDQUFDLE1BQU0sRUFJTjs7Ozs7Ozs7Ozs7OztBQ2xCRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRWI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRWIsWUFBWSxtQkFBTyxDQUFDLDRDQUFPOztBQUUzQjtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CLG1CQUFPLENBQUMsd0VBQXdCO0FBQ3BELGdCQUFnQixtQkFBTyxDQUFDLGdFQUFvQjtBQUM1QyxjQUFjLG1CQUFPLENBQUMsNERBQWtCOztBQUV4QztBQUNBOztBQUVBOztBQUVBO0FBQ0Esd0NBQXdDOztBQUV4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7O0FBRUE7QUFDQSxtQkFBbUIscUJBQXFCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsVUFBVSxJQUFxQztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsVUFBVSxJQUFxQztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQix5Q0FBeUM7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSyxZQUFZO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9FQUFvRTtBQUNwRTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsUUFBUSxJQUFxQztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7O0FDelZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7Ozs7QUFJYixJQUFJLElBQXFDO0FBQ3pDO0FBQ0E7O0FBRUEsOENBQThDLGNBQWM7O0FBRTVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxzRkFBc0YsYUFBYTtBQUNuRztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Es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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0ZBQXNGLGFBQWE7QUFDbkc7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixXQUFXLEVBQUU7QUFDYixXQUFXLGNBQWM7QUFDekIsV0FBVyxFQUFFO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYjtBQUNBLFdBQVcsRUFBRTtBQUNiLFdBQVcsRUFBRTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxtQkFBbUIsb0JBQW9CO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLHdCQUF3Qjs7QUFFeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLG1CQUFtQixv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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixZQUFZLGFBQWE7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxhQUFhO0FBQ3hCLFdBQVcsRUFBRTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsVUFBVTtBQUNyQixXQUFXLEVBQUU7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsaUJBQWlCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGFBQWE7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLGFBQWE7QUFDeEI7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLGlCQUFpQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsc0JBQXNCO0FBQ3pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLHNCQUFzQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7O0FBR0Esa0RBQWtEOzs7QUFHbEQ7OztBQUdBOzs7QUFHQTtBQUNBOztBQUVBOzs7QUFHQTs7O0FBR0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7Ozs7Ozs7Ozs7Ozs7QUM1MkRhOztBQUViLElBQUksS0FBcUMsRUFBRSxFQUUxQztBQUNELG1CQUFtQixtQkFBTyxDQUFDLGlGQUE0QjtBQUN2RCIsImZpbGUiOiIuL21vZHVsZXMvaW5zdHJ1bWVudF9tYW5hZ2VyL2pzL2luc3RydW1lbnRNYW5hZ2VySW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL21vZHVsZXMvaW5zdHJ1bWVudF9tYW5hZ2VyL2pzeC9pbnN0cnVtZW50TWFuYWdlckluZGV4LmpzXCIpO1xuIiwiLyoqXG4gKiBUaGlzIGZpbGUgY29udGFpbnMgUmVhY3QgY29tcG9uZW50IGZvciBEYXRhIFRhYmxlXG4gKlxuICogQGF1dGhvciBMb3JpcyBUZWFtXG4gKiBAdmVyc2lvbiAxLjAuMFxuICpcbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUGFnaW5hdGlvbkxpbmtzIGZyb20gJy4vUGFnaW5hdGlvbkxpbmtzJztcbmltcG9ydCBjcmVhdGVGcmFnbWVudCBmcm9tICdyZWFjdC1hZGRvbnMtY3JlYXRlLWZyYWdtZW50JztcbmltcG9ydCBDVEEgZnJvbSAnLi9Gb3JtJztcblxuLyoqXG4gKiBEYXRhIFRhYmxlIGNvbXBvbmVudFxuICogRGlzcGxheXMgYSBzZXQgb2YgZGF0YSB0aGF0IGlzIHJlY2VpdmVzIHZpYSBwcm9wcy5cbiAqL1xuY2xhc3MgRGF0YVRhYmxlIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgUGFnZU51bWJlcjogMSxcbiAgICAgIFNvcnRDb2x1bW46IC0xLFxuICAgICAgU29ydE9yZGVyOiAnQVNDJyxcbiAgICAgIFJvd3NQZXJQYWdlOiAyMCxcbiAgICAgIEhpZGU6IHRoaXMucHJvcHMuSGlkZSxcbiAgICB9O1xuXG4gICAgdGhpcy5jaGFuZ2VQYWdlID0gdGhpcy5jaGFuZ2VQYWdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zZXRTb3J0Q29sdW1uID0gdGhpcy5zZXRTb3J0Q29sdW1uLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jaGFuZ2VSb3dzUGVyUGFnZSA9IHRoaXMuY2hhbmdlUm93c1BlclBhZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmRvd25sb2FkQ1NWID0gdGhpcy5kb3dubG9hZENTVi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY291bnRGaWx0ZXJlZFJvd3MgPSB0aGlzLmNvdW50RmlsdGVyZWRSb3dzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRTb3J0ZWRSb3dzID0gdGhpcy5nZXRTb3J0ZWRSb3dzLmJpbmQodGhpcyk7Ly9cbiAgICB0aGlzLmhhc0ZpbHRlcktleXdvcmQgPSB0aGlzLmhhc0ZpbHRlcktleXdvcmQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlbmRlckFjdGlvbnMgPSB0aGlzLnJlbmRlckFjdGlvbnMuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGlmIChqUXVlcnkuZm4uRHluYW1pY1RhYmxlKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5mcmVlemVDb2x1bW4pIHtcbiAgICAgICAgJCgnI2R5bmFtaWN0YWJsZScpLkR5bmFtaWNUYWJsZSh7XG4gICAgICAgICAgZnJlZXplQ29sdW1uOiB0aGlzLnByb3BzLmZyZWV6ZUNvbHVtbixcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKCcjZHluYW1pY3RhYmxlJykuRHluYW1pY1RhYmxlKCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zdGF0ZS5IaWRlLmRlZmF1bHRDb2x1bW4pIHtcbiAgICAgICAgJCgnI2R5bmFtaWN0YWJsZScpLmZpbmQoJ3Rib2R5IHRkOmVxKDApJykuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHJpZXZlIG1vZHVsZSBwcmVmZXJlbmNlc1xuICAgIGxldCBtb2R1bGVQcmVmcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ21vZHVsZVByZWZzJykpO1xuXG4gICAgLy8gSW5pdCBtb2R1bGVQcmVmcyBvYmplY3RcbiAgICBpZiAobW9kdWxlUHJlZnMgPT09IG51bGwpIHtcbiAgICAgIG1vZHVsZVByZWZzID0ge307XG4gICAgfVxuXG4gICAgLy8gSW5pdCBtb2R1bGVQcmVmcyBmb3IgY3VycmVudCBtb2R1bGVcbiAgICBpZiAobW9kdWxlUHJlZnNbbG9yaXMuVGVzdE5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG1vZHVsZVByZWZzW2xvcmlzLlRlc3ROYW1lXSA9IHt9O1xuICAgICAgbW9kdWxlUHJlZnNbbG9yaXMuVGVzdE5hbWVdLnJvd3NQZXJQYWdlID0gdGhpcy5zdGF0ZS5Sb3dzUGVyUGFnZTtcbiAgICB9XG5cbiAgICAvLyBTZXQgcm93cyBwZXIgcGFnZVxuICAgIGNvbnN0IHJvd3NQZXJQYWdlID0gbW9kdWxlUHJlZnNbbG9yaXMuVGVzdE5hbWVdLnJvd3NQZXJQYWdlO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgUm93c1BlclBhZ2U6IHJvd3NQZXJQYWdlLFxuICAgIH0pO1xuXG4gICAgLy8gTWFrZSBwcmVmcyBhY2Nlc2libGUgd2l0aGluIGNvbXBvbmVudFxuICAgIHRoaXMubW9kdWxlUHJlZnMgPSBtb2R1bGVQcmVmcztcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMsIHByZXZTdGF0ZSkge1xuICAgIGlmIChqUXVlcnkuZm4uRHluYW1pY1RhYmxlKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5mcmVlemVDb2x1bW4pIHtcbiAgICAgICAgJCgnI2R5bmFtaWN0YWJsZScpLkR5bmFtaWNUYWJsZSh7XG4gICAgICAgICAgZnJlZXplQ29sdW1uOiB0aGlzLnByb3BzLmZyZWV6ZUNvbHVtbixcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKCcjZHluYW1pY3RhYmxlJykuRHluYW1pY1RhYmxlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnByb3BzLm9uU29ydCAmJlxuICAgICAgKHRoaXMuc3RhdGUuU29ydENvbHVtbiAhPT0gcHJldlN0YXRlLlNvcnRDb2x1bW4gfHxcbiAgICAgICAgdGhpcy5zdGF0ZS5Tb3J0T3JkZXIgIT09IHByZXZTdGF0ZS5Tb3J0T3JkZXIpXG4gICAgKSB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuZ2V0U29ydGVkUm93cygpO1xuICAgICAgY29uc3QgaGVhZGVyTGlzdCA9IHRoaXMucHJvcHMuZmllbGRzLm1hcCgoZmllbGQpID0+IGZpZWxkLmxhYmVsKTtcbiAgICAgIHRoaXMucHJvcHMub25Tb3J0KGluZGV4LCB0aGlzLnByb3BzLmRhdGEsIGhlYWRlckxpc3QpO1xuICAgIH1cbiAgfVxuXG4gIGNoYW5nZVBhZ2UocGFnZU5vKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBQYWdlTnVtYmVyOiBwYWdlTm8sXG4gICAgfSk7XG4gIH1cblxuICBzZXRTb3J0Q29sdW1uKGNvbE51bWJlcikge1xuICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5Tb3J0Q29sdW1uID09PSBjb2xOdW1iZXIpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgU29ydE9yZGVyOiB0aGlzLnN0YXRlLlNvcnRPcmRlciA9PT0gJ0FTQycgPyAnREVTQycgOiAnQVNDJyxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBTb3J0Q29sdW1uOiBjb2xOdW1iZXIsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBjaGFuZ2VSb3dzUGVyUGFnZSh2YWwpIHtcbiAgICBjb25zdCByb3dzUGVyUGFnZSA9IHZhbC50YXJnZXQudmFsdWU7XG4gICAgY29uc3QgbW9kdWxlUHJlZnMgPSB0aGlzLm1vZHVsZVByZWZzO1xuXG4gICAgLy8gU2F2ZSBjdXJyZW50IHNlbGVjdGlvblxuICAgIG1vZHVsZVByZWZzW2xvcmlzLlRlc3ROYW1lXS5yb3dzUGVyUGFnZSA9IHJvd3NQZXJQYWdlO1xuXG4gICAgLy8gVXBkYXRlIGxvY2Fsc3RvcmFnZVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdtb2R1bGVQcmVmcycsIEpTT04uc3RyaW5naWZ5KG1vZHVsZVByZWZzKSk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIFJvd3NQZXJQYWdlOiByb3dzUGVyUGFnZSxcbiAgICAgIFBhZ2VOdW1iZXI6IDEsXG4gICAgfSk7XG4gIH1cblxuICBkb3dubG9hZENTVihjc3ZEYXRhKSB7XG4gICAgY29uc3QgY3N2d29ya2VyID0gbmV3IFdvcmtlcihsb3Jpcy5CYXNlVVJMICsgJy9qcy93b3JrZXJzL3NhdmVjc3YuanMnKTtcblxuICAgIGNzdndvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24oZSkge1xuICAgICAgbGV0IGRhdGFVUkw7XG4gICAgICBsZXQgZGF0YURhdGU7XG4gICAgICBsZXQgbGluaztcbiAgICAgIGlmIChlLmRhdGEuY21kID09PSAnU2F2ZUNTVicpIHtcbiAgICAgICAgZGF0YURhdGUgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIGRhdGFVUkwgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChlLmRhdGEubWVzc2FnZSk7XG4gICAgICAgIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIGxpbmsuZG93bmxvYWQgPSAnZGF0YS0nICsgZGF0YURhdGUgKyAnLmNzdic7XG4gICAgICAgIGxpbmsudHlwZSA9ICd0ZXh0L2Nzdic7XG4gICAgICAgIGxpbmsuaHJlZiA9IGRhdGFVUkw7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICAgICQobGluaylbMF0uY2xpY2soKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBoZWFkZXJMaXN0ID0gdGhpcy5wcm9wcy5maWVsZHMubWFwKChmaWVsZCkgPT4gZmllbGQubGFiZWwpO1xuICAgIGNzdndvcmtlci5wb3N0TWVzc2FnZSh7XG4gICAgICBjbWQ6ICdTYXZlRmlsZScsXG4gICAgICBkYXRhOiBjc3ZEYXRhLFxuICAgICAgaGVhZGVyczogaGVhZGVyTGlzdCxcbiAgICAgIGlkZW50aWZpZXJzOiB0aGlzLnByb3BzLlJvd05hbWVNYXAsXG4gICAgfSk7XG4gIH1cblxuICBjb3VudEZpbHRlcmVkUm93cygpIHtcbiAgICBsZXQgdXNlS2V5d29yZCA9IGZhbHNlO1xuICAgIGxldCBmaWx0ZXJNYXRjaENvdW50ID0gMDtcbiAgICBsZXQgZmlsdGVyVmFsdWVzQ291bnQgPSAodGhpcy5wcm9wcy5maWx0ZXIgP1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnByb3BzLmZpbHRlcikubGVuZ3RoIDpcbiAgICAgICAgMFxuICAgICk7XG4gICAgY29uc3QgdGFibGVEYXRhID0gdGhpcy5wcm9wcy5kYXRhO1xuICAgIGNvbnN0IGZpZWxkRGF0YSA9IHRoaXMucHJvcHMuZmllbGRzO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuZmlsdGVyLmtleXdvcmQpIHtcbiAgICAgIHVzZUtleXdvcmQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICh1c2VLZXl3b3JkKSB7XG4gICAgICBmaWx0ZXJWYWx1ZXNDb3VudCAtPSAxO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgaGVhZGVyQ291bnQgPSAwO1xuICAgICAgbGV0IGtleXdvcmRNYXRjaCA9IDA7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGZpZWxkRGF0YS5sZW5ndGg7IGorKykge1xuICAgICAgICBjb25zdCBkYXRhID0gdGFibGVEYXRhW2ldID8gdGFibGVEYXRhW2ldW2pdIDogbnVsbDtcbiAgICAgICAgaWYgKHRoaXMuaGFzRmlsdGVyS2V5d29yZCgoZmllbGREYXRhW2pdLmZpbHRlciB8fCB7fSkubmFtZSwgZGF0YSkpIHtcbiAgICAgICAgICBoZWFkZXJDb3VudCsrO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1c2VLZXl3b3JkKSB7XG4gICAgICAgICAgaWYgKHRoaXMuaGFzRmlsdGVyS2V5d29yZCgna2V5d29yZCcsIGRhdGEpKSB7XG4gICAgICAgICAgICBrZXl3b3JkTWF0Y2grKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGhlYWRlckNvdW50ID09PSBmaWx0ZXJWYWx1ZXNDb3VudCAmJlxuICAgICAgICAoKHVzZUtleXdvcmQgPT09IHRydWUgJiYga2V5d29yZE1hdGNoID4gMCkgfHxcbiAgICAgICAgICAodXNlS2V5d29yZCA9PT0gZmFsc2UgJiYga2V5d29yZE1hdGNoID09PSAwKSkpIHtcbiAgICAgICAgZmlsdGVyTWF0Y2hDb3VudCsrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGhhc0ZpbHRlcnMgPSAoZmlsdGVyVmFsdWVzQ291bnQgIT09IDApO1xuICAgIGlmIChmaWx0ZXJNYXRjaENvdW50ID09PSAwICYmIGhhc0ZpbHRlcnMpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHJldHVybiAoZmlsdGVyTWF0Y2hDb3VudCA9PT0gMCkgPyB0YWJsZURhdGEubGVuZ3RoIDogZmlsdGVyTWF0Y2hDb3VudDtcbiAgfVxuXG4gIGdldFNvcnRlZFJvd3MoKSB7XG4gICAgY29uc3QgaW5kZXggPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcm9wcy5kYXRhLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBsZXQgdmFsID0gdGhpcy5wcm9wcy5kYXRhW2ldW3RoaXMuc3RhdGUuU29ydENvbHVtbl0gfHwgdW5kZWZpbmVkO1xuICAgICAgLy8gSWYgU29ydENvbHVtbiBpcyBlcXVhbCB0byBkZWZhdWx0IE5vLiBjb2x1bW4sIHNldCB2YWx1ZSB0byBiZVxuICAgICAgLy8gaW5kZXggKyAxXG4gICAgICBpZiAodGhpcy5zdGF0ZS5Tb3J0Q29sdW1uID09PSAtMSkge1xuICAgICAgICB2YWwgPSBpICsgMTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGlzU3RyaW5nID0gKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnIHx8IHZhbCBpbnN0YW5jZW9mIFN0cmluZyk7XG4gICAgICBjb25zdCBpc051bWJlciA9ICFpc05hTih2YWwpICYmIHR5cGVvZiB2YWwgIT09ICdvYmplY3QnO1xuXG4gICAgICBpZiAodmFsID09PSAnLicpIHtcbiAgICAgICAgLy8gaGFjayB0byBoYW5kbGUgbm9uLWV4aXN0ZW50IGl0ZW1zIGluIERRVFxuICAgICAgICB2YWwgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmIChpc051bWJlcikge1xuICAgICAgICAvLyBwZXJmb3JtIHR5cGUgY29udmVyc2lvbiAoZnJvbSBzdHJpbmcgdG8gaW50L2Zsb2F0KVxuICAgICAgICB2YWwgPSBOdW1iZXIodmFsKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNTdHJpbmcpIHtcbiAgICAgICAgLy8gaWYgc3RyaW5nIHdpdGggdGV4dCBjb252ZXJ0IHRvIGxvd2VyY2FzZVxuICAgICAgICB2YWwgPSB2YWwudG9Mb3dlckNhc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbCA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucHJvcHMuUm93TmFtZU1hcCkge1xuICAgICAgICBpbmRleC5wdXNoKHtSb3dJZHg6IGksIFZhbHVlOiB2YWwsIENvbnRlbnQ6IHRoaXMucHJvcHMuUm93TmFtZU1hcFtpXX0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5kZXgucHVzaCh7Um93SWR4OiBpLCBWYWx1ZTogdmFsLCBDb250ZW50OiBpICsgMX0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGluZGV4LnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuU29ydE9yZGVyID09PSAnQVNDJykge1xuICAgICAgICBpZiAoYS5WYWx1ZSA9PT0gYi5WYWx1ZSkge1xuICAgICAgICAgIC8vIElmIGFsbCB2YWx1ZXMgYXJlIGVxdWFsLCBzb3J0IGJ5IHJvd251bVxuICAgICAgICAgIGlmIChhLlJvd0lkeCA8IGIuUm93SWR4KSByZXR1cm4gLTE7XG4gICAgICAgICAgaWYgKGEuUm93SWR4ID4gYi5Sb3dJZHgpIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIC8vIENoZWNrIGlmIG51bGwgdmFsdWVzXG4gICAgICAgIGlmIChhLlZhbHVlID09PSBudWxsIHx8IHR5cGVvZiBhLlZhbHVlID09PSAndW5kZWZpbmVkJykgcmV0dXJuIC0xO1xuICAgICAgICBpZiAoYi5WYWx1ZSA9PT0gbnVsbCB8fCB0eXBlb2YgYi5WYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiAxO1xuXG4gICAgICAgIC8vIFNvcnQgYnkgdmFsdWVcbiAgICAgICAgaWYgKGEuVmFsdWUgPCBiLlZhbHVlKSByZXR1cm4gLTE7XG4gICAgICAgIGlmIChhLlZhbHVlID4gYi5WYWx1ZSkgcmV0dXJuIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoYS5WYWx1ZSA9PT0gYi5WYWx1ZSkge1xuICAgICAgICAgIC8vIElmIGFsbCB2YWx1ZXMgYXJlIGVxdWFsLCBzb3J0IGJ5IHJvd251bVxuICAgICAgICAgIGlmIChhLlJvd0lkeCA8IGIuUm93SWR4KSByZXR1cm4gMTtcbiAgICAgICAgICBpZiAoYS5Sb3dJZHggPiBiLlJvd0lkeCkgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIC8vIENoZWNrIGlmIG51bGwgdmFsdWVzXG4gICAgICAgIGlmIChhLlZhbHVlID09PSBudWxsIHx8IHR5cGVvZiBhLlZhbHVlID09PSAndW5kZWZpbmVkJykgcmV0dXJuIDE7XG4gICAgICAgIGlmIChiLlZhbHVlID09PSBudWxsIHx8IHR5cGVvZiBiLlZhbHVlID09PSAndW5kZWZpbmVkJykgcmV0dXJuIC0xO1xuXG4gICAgICAgIC8vIFNvcnQgYnkgdmFsdWVcbiAgICAgICAgaWYgKGEuVmFsdWUgPCBiLlZhbHVlKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGEuVmFsdWUgPiBiLlZhbHVlKSByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICAvLyBUaGV5J3JlIGVxdWFsLi5cbiAgICAgIHJldHVybiAwO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgcmV0dXJuIGluZGV4O1xuICB9XG5cbiAgLyoqXG4gICAqIFNlYXJjaGVzIGZvciB0aGUgZmlsdGVyIGtleXdvcmQgaW4gdGhlIGNvbHVtbiBjZWxsXG4gICAqXG4gICAqIE5vdGU6IFNlYXJjaCBpcyBjYXNlLWluc2Vuc2l0aXZlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBmaWVsZCBuYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhIHNlYXJjaCBzdHJpbmdcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSwgaWYgZmlsdGVyIHZhbHVlIGlzIGZvdW5kIHRvIGJlIGEgc3Vic3RyaW5nXG4gICAqIG9mIG9uZSBvZiB0aGUgY29sdW1uIHZhbHVlcywgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgaGFzRmlsdGVyS2V5d29yZChuYW1lLCBkYXRhKSB7XG4gICAgbGV0IGZpbHRlckRhdGEgPSBudWxsO1xuICAgIGxldCBleGFjdE1hdGNoID0gZmFsc2U7XG4gICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xuICAgIGxldCBzZWFyY2hLZXkgPSBudWxsO1xuICAgIGxldCBzZWFyY2hTdHJpbmcgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuZmlsdGVyW25hbWVdKSB7XG4gICAgICBmaWx0ZXJEYXRhID0gdGhpcy5wcm9wcy5maWx0ZXJbbmFtZV0udmFsdWU7XG4gICAgICBleGFjdE1hdGNoID0gdGhpcy5wcm9wcy5maWx0ZXJbbmFtZV0uZXhhY3RNYXRjaDtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgbnVsbCBpbnB1dHNcbiAgICBpZiAoZmlsdGVyRGF0YSA9PT0gbnVsbCB8fCBkYXRhID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIG51bWVyaWMgaW5wdXRzXG4gICAgaWYgKHR5cGVvZiBmaWx0ZXJEYXRhID09PSAnbnVtYmVyJykge1xuICAgICAgY29uc3QgaW50RGF0YSA9IE51bWJlci5wYXJzZUludChkYXRhLCAxMCk7XG4gICAgICByZXN1bHQgPSAoZmlsdGVyRGF0YSA9PT0gaW50RGF0YSk7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHN0cmluZyBpbnB1dHNcbiAgICBpZiAodHlwZW9mIGZpbHRlckRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICBzZWFyY2hLZXkgPSBmaWx0ZXJEYXRhLnRvTG93ZXJDYXNlKCk7XG4gICAgICBzd2l0Y2ggKHR5cGVvZiBkYXRhKSB7XG4gICAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgICAgLy8gSGFuZGxlcyB0aGUgY2FzZSB3aGVyZSB0aGUgZGF0YSBpcyBhbiBhcnJheSAodHlwZW9mICdvYmplY3QnKVxuICAgICAgICAgIC8vIGFuZCB5b3Ugd2FudCB0byBzZWFyY2ggdGhyb3VnaCBpdCBmb3JcbiAgICAgICAgICAvLyB0aGUgc3RyaW5nIHlvdSBhcmUgZmlsdGVyaW5nIGJ5XG4gICAgICAgICAgY29uc3Qgc2VhcmNoQXJyYXkgPSBkYXRhLm1hcCgoZSkgPT4gZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICBpZiAoZXhhY3RNYXRjaCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gc2VhcmNoQXJyYXkuaW5jbHVkZXMoc2VhcmNoS2V5KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gKHNlYXJjaEFycmF5LmZpbmQoKGUpID0+IChlLmluZGV4T2Yoc2VhcmNoS2V5KSA+IC0xKSkpICE9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHNlYXJjaFN0cmluZyA9IGRhdGEudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICBpZiAoZXhhY3RNYXRjaCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gKHNlYXJjaFN0cmluZyA9PT0gc2VhcmNoS2V5KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gKHNlYXJjaFN0cmluZy5pbmRleE9mKHNlYXJjaEtleSkgPiAtMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhhbmRsZSBhcnJheSBpbnB1dHMgZm9yIG11bHRpc2VsZWN0c1xuICAgIGlmICh0eXBlb2YgZmlsdGVyRGF0YSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGxldCBtYXRjaCA9IGZhbHNlO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWx0ZXJEYXRhLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIHNlYXJjaEtleSA9IGZpbHRlckRhdGFbaV0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgc2VhcmNoU3RyaW5nID0gZGF0YS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIG1hdGNoID0gKHNlYXJjaFN0cmluZy5pbmRleE9mKHNlYXJjaEtleSkgPiAtMSk7XG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcmVuZGVyQWN0aW9ucygpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5hY3Rpb25zKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5hY3Rpb25zLm1hcCgoYWN0aW9uLCBrZXkpID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8Q1RBXG4gICAgICAgICAgICBrZXk9e2tleX1cbiAgICAgICAgICAgIGxhYmVsPXthY3Rpb24ubGFiZWx9XG4gICAgICAgICAgICBvblVzZXJJbnB1dD17YWN0aW9uLmFjdGlvbn1cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmRhdGEgPT09IG51bGwgfHwgdGhpcy5wcm9wcy5kYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2FsZXJ0IGFsZXJ0LWluZm8gbm8tcmVzdWx0LWZvdW5kLXBhbmVsJz5cbiAgICAgICAgICA8c3Ryb25nPk5vIHJlc3VsdCBmb3VuZC48L3N0cm9uZz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgICBjb25zdCByb3dzUGVyUGFnZSA9IHRoaXMuc3RhdGUuUm93c1BlclBhZ2U7XG4gICAgY29uc3QgaGVhZGVycyA9IHRoaXMuc3RhdGUuSGlkZS5kZWZhdWx0Q29sdW1uID09PSB0cnVlID8gW10gOiBbXG4gICAgICA8dGgga2V5PSd0aF9jb2xfMCcgb25DbGljaz17dGhpcy5zZXRTb3J0Q29sdW1uKC0xKS5iaW5kKHRoaXMpfT5cbiAgICAgICAge3RoaXMucHJvcHMuUm93TnVtTGFiZWx9XG4gICAgICA8L3RoPixcbiAgICBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByb3BzLmZpZWxkcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKHRoaXMucHJvcHMuZmllbGRzW2ldLnNob3cgPT09IHRydWUpIHtcbiAgICAgICAgY29uc3QgY29sSW5kZXggPSBpICsgMTtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuZmllbGRzW2ldLmZyZWV6ZUNvbHVtbiA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGhlYWRlcnMucHVzaChcbiAgICAgICAgICAgICAgPHRoIGtleT17J3RoX2NvbF8nICsgY29sSW5kZXh9IGlkPXt0aGlzLnByb3BzLmZyZWV6ZUNvbHVtbn1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnNldFNvcnRDb2x1bW4oaSkuYmluZCh0aGlzKX0+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuZmllbGRzW2ldLmxhYmVsfVxuICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaGVhZGVycy5wdXNoKFxuICAgICAgICAgICAgICA8dGgga2V5PXsndGhfY29sXycgKyBjb2xJbmRleH0gb25DbGljaz17dGhpcy5zZXRTb3J0Q29sdW1uKGkpLmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmZpZWxkc1tpXS5sYWJlbH1cbiAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJvd3MgPSBbXTtcbiAgICBsZXQgY3VyUm93ID0gW107XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmdldFNvcnRlZFJvd3MoKTtcbiAgICBsZXQgbWF0Y2hlc0ZvdW5kID0gMDsgLy8gS2VlcHMgdHJhY2sgb2YgaG93IG1hbnkgcm93cyB3aGVyZSBkaXNwbGF5ZWQgc28gZmFyIGFjcm9zcyBhbGwgcGFnZXNcbiAgICBjb25zdCBmaWx0ZXJlZFJvd3MgPSB0aGlzLmNvdW50RmlsdGVyZWRSb3dzKCk7XG4gICAgY29uc3QgY3VycmVudFBhZ2VSb3cgPSAocm93c1BlclBhZ2UgKiAodGhpcy5zdGF0ZS5QYWdlTnVtYmVyIC0gMSkpO1xuICAgIGNvbnN0IGZpbHRlcmVkRGF0YSA9IFtdO1xuICAgIGxldCB1c2VLZXl3b3JkID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5maWx0ZXIua2V5d29yZCkge1xuICAgICAgdXNlS2V5d29yZCA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gUHVzaCByb3dzIHRvIGRhdGEgdGFibGVcbiAgICBmb3IgKGxldCBpID0gMDtcbiAgICAgIChpIDwgdGhpcy5wcm9wcy5kYXRhLmxlbmd0aCkgJiYgKHJvd3MubGVuZ3RoIDwgcm93c1BlclBhZ2UpO1xuICAgICAgaSsrXG4gICAgKSB7XG4gICAgICBjdXJSb3cgPSBbXTtcblxuICAgICAgLy8gQ291bnRzIGZpbHRlciBtYXRjaGVzXG4gICAgICBsZXQgZmlsdGVyTWF0Y2hDb3VudCA9IDA7XG4gICAgICBsZXQga2V5d29yZE1hdGNoID0gMDtcbiAgICAgIGxldCBmaWx0ZXJMZW5ndGggPSAwO1xuXG4gICAgICAvLyBJdGVyYXRlcyB0aHJvdWdoIGhlYWRlcnMgdG8gcG9wdWxhdGUgcm93IGNvbHVtbnNcbiAgICAgIC8vIHdpdGggY29ycmVzcG9uZGluZyBkYXRhXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMucHJvcHMuZmllbGRzLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgIGxldCBkYXRhID0gJ1Vua25vd24nO1xuXG4gICAgICAgIC8vIFNldCBjb2x1bW4gZGF0YVxuICAgICAgICBpZiAodGhpcy5wcm9wcy5kYXRhW2luZGV4W2ldLlJvd0lkeF0pIHtcbiAgICAgICAgICBkYXRhID0gdGhpcy5wcm9wcy5kYXRhW2luZGV4W2ldLlJvd0lkeF1bal07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wcm9wcy5maWVsZHNbal0uZmlsdGVyKSB7XG4gICAgICAgICAgaWYgKHRoaXMuaGFzRmlsdGVyS2V5d29yZCh0aGlzLnByb3BzLmZpZWxkc1tqXS5maWx0ZXIubmFtZSwgZGF0YSkpIHtcbiAgICAgICAgICAgIGZpbHRlck1hdGNoQ291bnQrKztcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YS5wdXNoKHRoaXMucHJvcHMuZGF0YVtpbmRleFtpXS5Sb3dJZHhdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXNlS2V5d29yZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGZpbHRlckxlbmd0aCA9IE9iamVjdC5rZXlzKHRoaXMucHJvcHMuZmlsdGVyKS5sZW5ndGggLSAxO1xuICAgICAgICAgIGlmICh0aGlzLmhhc0ZpbHRlcktleXdvcmQoJ2tleXdvcmQnLCBkYXRhKSkge1xuICAgICAgICAgICAga2V5d29yZE1hdGNoKys7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZpbHRlckxlbmd0aCA9IE9iamVjdC5rZXlzKHRoaXMucHJvcHMuZmlsdGVyKS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBrZXkgPSAndGRfY29sXycgKyBqO1xuXG4gICAgICAgIC8vIEdldCBjdXN0b20gY2VsbCBmb3JtYXR0aW5nIGlmIGF2YWlsYWJsZVxuICAgICAgICBpZiAodGhpcy5wcm9wcy5nZXRGb3JtYXR0ZWRDZWxsKSB7XG4gICAgICAgICAgaWYgKHRoaXMucHJvcHMuZmllbGRzW2pdLnNob3cgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBkYXRhID0gbnVsbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gY3JlYXRlIG1hcHBpbmcgYmV0d2VlbiByb3dIZWFkZXJzIGFuZCByb3dEYXRhIGluIGEgcm93IE9iamVjdFxuICAgICAgICAgICAgY29uc3Qgcm93ID0ge307XG4gICAgICAgICAgICB0aGlzLnByb3BzLmZpZWxkcy5mb3JFYWNoKChmaWVsZCwgaykgPT4ge1xuICAgICAgICAgICAgICByb3dbZmllbGQubGFiZWxdID0gdGhpcy5wcm9wcy5kYXRhW2luZGV4W2ldLlJvd0lkeF1ba107XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRhdGEgPSB0aGlzLnByb3BzLmdldEZvcm1hdHRlZENlbGwoXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5maWVsZHNbal0ubGFiZWwsXG4gICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICByb3dcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkYXRhICE9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBOb3RlOiBDYW4ndCBjdXJyZW50bHkgcGFzcyBhIGtleSwgbmVlZCB0byB1cGRhdGUgY29sdW1uRm9ybWF0dGVyXG4gICAgICAgICAgICAvLyB0byBub3QgcmV0dXJuIGEgPHRkPiBub2RlLiBVc2luZyBjcmVhdGVGcmFnbWVudCBpbnN0ZWFkLlxuICAgICAgICAgICAgY3VyUm93LnB1c2goY3JlYXRlRnJhZ21lbnQoe2RhdGF9KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN1clJvdy5wdXNoKDx0ZCBrZXk9e2tleX0+e2RhdGF9PC90ZD4pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIE9ubHkgZGlzcGxheSBhIHJvdyBpZiBhbGwgZmlsdGVyIHZhbHVlcyBoYXZlIGJlZW4gbWF0Y2hlZFxuICAgICAgaWYgKChmaWx0ZXJMZW5ndGggPT09IGZpbHRlck1hdGNoQ291bnQpICYmXG4gICAgICAgICgodXNlS2V5d29yZCA9PT0gdHJ1ZSAmJiBrZXl3b3JkTWF0Y2ggPiAwKSB8fFxuICAgICAgICAgICh1c2VLZXl3b3JkID09PSBmYWxzZSAmJiBrZXl3b3JkTWF0Y2ggPT09IDApKSkge1xuICAgICAgICBtYXRjaGVzRm91bmQrKztcbiAgICAgICAgaWYgKG1hdGNoZXNGb3VuZCA+IGN1cnJlbnRQYWdlUm93KSB7XG4gICAgICAgICAgY29uc3Qgcm93SW5kZXggPSBpbmRleFtpXS5Db250ZW50O1xuICAgICAgICAgIHJvd3MucHVzaChcbiAgICAgICAgICAgICAgPHRyIGtleT17J3RyXycgKyByb3dJbmRleH0gY29sU3Bhbj17aGVhZGVycy5sZW5ndGh9PlxuICAgICAgICAgICAgICAgIDx0ZD57cm93SW5kZXh9PC90ZD5cbiAgICAgICAgICAgICAgICB7Y3VyUm93fVxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBSb3dzUGVyUGFnZURyb3Bkb3duID0gKFxuICAgICAgPHNlbGVjdFxuICAgICAgICBjbGFzc05hbWU9XCJpbnB1dC1zbSBwZXJQYWdlXCJcbiAgICAgICAgb25DaGFuZ2U9e3RoaXMuY2hhbmdlUm93c1BlclBhZ2V9XG4gICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLlJvd3NQZXJQYWdlfVxuICAgICAgPlxuICAgICAgICA8b3B0aW9uPjIwPC9vcHRpb24+XG4gICAgICAgIDxvcHRpb24+NTA8L29wdGlvbj5cbiAgICAgICAgPG9wdGlvbj4xMDA8L29wdGlvbj5cbiAgICAgICAgPG9wdGlvbj4xMDAwPC9vcHRpb24+XG4gICAgICAgIDxvcHRpb24+NTAwMDwvb3B0aW9uPlxuICAgICAgICA8b3B0aW9uPjEwMDAwPC9vcHRpb24+XG4gICAgICA8L3NlbGVjdD5cbiAgICApO1xuXG4gICAgLy8gSW5jbHVkZSBvbmx5IGZpbHRlcmVkIGRhdGEgaWYgZmlsdGVycyB3ZXJlIGFwcGxpZWRcbiAgICBsZXQgY3N2RGF0YSA9IHRoaXMucHJvcHMuZGF0YTtcbiAgICBpZiAodGhpcy5wcm9wcy5maWx0ZXIgJiYgZmlsdGVyZWREYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgIGNzdkRhdGEgPSBmaWx0ZXJlZERhdGE7XG4gICAgfVxuXG4gICAgY29uc3QgaGVhZGVyID0gdGhpcy5zdGF0ZS5IaWRlLnJvd3NQZXJQYWdlID09PSB0cnVlID8gJycgOiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRhYmxlLWhlYWRlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICB7cm93cy5sZW5ndGh9IHJvd3MgZGlzcGxheWVkIG9mIHtmaWx0ZXJlZFJvd3N9LlxuICAgICAgICAgICAgICAoTWF4aW11bSByb3dzIHBlciBwYWdlOiB7Um93c1BlclBhZ2VEcm9wZG93bn0pXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHVsbC1yaWdodFwiIHN0eWxlPXt7bWFyZ2luVG9wOiAnLTQzcHgnfX0+XG4gICAgICAgICAgICAgIHt0aGlzLnJlbmRlckFjdGlvbnMoKX1cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5kb3dubG9hZENTVi5iaW5kKG51bGwsIGNzdkRhdGEpfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgIERvd25sb2FkIFRhYmxlIGFzIENTVlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPFBhZ2luYXRpb25MaW5rc1xuICAgICAgICAgICAgICAgIFRvdGFsPXtmaWx0ZXJlZFJvd3N9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2VQYWdlPXt0aGlzLmNoYW5nZVBhZ2V9XG4gICAgICAgICAgICAgICAgUm93c1BlclBhZ2U9e3Jvd3NQZXJQYWdlfVxuICAgICAgICAgICAgICAgIEFjdGl2ZT17dGhpcy5zdGF0ZS5QYWdlTnVtYmVyfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcblxuICAgIGNvbnN0IGZvb3RlciA9IHRoaXMuc3RhdGUuSGlkZS5kb3dubG9hZENTViA9PT0gdHJ1ZSA/ICcnIDogKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMlwiIHN0eWxlPXt7bWFyZ2luVG9wOiAnMTBweCd9fT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9vdGVyVGV4dFwiPlxuICAgICAgICAgICAgICB7cm93cy5sZW5ndGh9IHJvd3MgZGlzcGxheWVkIG9mIHtmaWx0ZXJlZFJvd3N9LlxuICAgICAgICAgICAgICAoTWF4aW11bSByb3dzIHBlciBwYWdlOiB7Um93c1BlclBhZ2VEcm9wZG93bn0pXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHVsbC1yaWdodFwiIHN0eWxlPXt7bWFyZ2luVG9wOiAnLTIzcHgnfX0+XG4gICAgICAgICAgICAgIDxQYWdpbmF0aW9uTGlua3NcbiAgICAgICAgICAgICAgICBUb3RhbD17ZmlsdGVyZWRSb3dzfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlUGFnZT17dGhpcy5jaGFuZ2VQYWdlfVxuICAgICAgICAgICAgICAgIFJvd3NQZXJQYWdlPXtyb3dzUGVyUGFnZX1cbiAgICAgICAgICAgICAgICBBY3RpdmU9e3RoaXMuc3RhdGUuUGFnZU51bWJlcn1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17e21hcmdpbjogJzE0cHgnfX0+XG4gICAgICAgIHtoZWFkZXJ9XG4gICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ0YWJsZSB0YWJsZS1ob3ZlciB0YWJsZS1wcmltYXJ5IHRhYmxlLWJvcmRlcmVkXCIgaWQ9XCJkeW5hbWljdGFibGVcIj5cbiAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICA8dHIgY2xhc3NOYW1lPVwiaW5mb1wiPntoZWFkZXJzfTwvdHI+XG4gICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICB7cm93c31cbiAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgICB7Zm9vdGVyfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuRGF0YVRhYmxlLnByb3BUeXBlcyA9IHtcbiAgZGF0YTogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIFJvd051bUxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAvLyBGdW5jdGlvbiBvZiB3aGljaCByZXR1cm5zIGEgSlNYIGVsZW1lbnQgZm9yIGEgdGFibGUgY2VsbCwgdGFrZXNcbiAgLy8gcGFyYW1ldGVycyBvZiB0aGUgZm9ybTogZnVuYyhDb2x1bW5OYW1lLCBDZWxsRGF0YSwgRW50aXJlUm93RGF0YSlcbiAgZ2V0Rm9ybWF0dGVkQ2VsbDogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uU29ydDogUHJvcFR5cGVzLmZ1bmMsXG4gIEhpZGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIGFjdGlvbnM6IFByb3BUeXBlcy5vYmplY3QsXG59O1xuRGF0YVRhYmxlLmRlZmF1bHRQcm9wcyA9IHtcbiAgUm93TnVtTGFiZWw6ICdOby4nLFxuICBmaWx0ZXI6IHt9LFxuICBIaWRlOiB7XG4gICAgcm93c1BlclBhZ2U6IGZhbHNlLFxuICAgIGRvd25sb2FkQ1NWOiBmYWxzZSxcbiAgICBkZWZhdWx0Q29sdW1uOiBmYWxzZSxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERhdGFUYWJsZTtcbiIsImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuLyoqXG4gKiBGaWx0ZXIgY29tcG9uZW50LlxuICogQSB3cmFwcGVyIGZvciBmb3JtIGVsZW1lbnRzIGluc2lkZSBhIHNlbGVjdGlvbiBmaWx0ZXIuXG4gKlxuICogQ29uc3RydWN0cyBmaWx0ZXIgZmllbGRzIGJhc2VkIG9uIHRoaXMucHJvcHMuZmllbGRzIGNvbmZpZ3VyYXRpb24gb2JqZWN0XG4gKlxuICogQWx0ZXJzIHRoZSBmaWx0ZXIgb2JqZWN0IGFuZCBzZW5kcyBpdCB0byBwYXJlbnQgb24gZXZlcnkgdXBkYXRlLlxuICpcbiAqL1xuY2xhc3MgRmlsdGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5vbkZpZWxkVXBkYXRlID0gdGhpcy5vbkZpZWxkVXBkYXRlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZW5kZXJGaWx0ZXJGaWVsZHMgPSB0aGlzLnJlbmRlckZpbHRlckZpZWxkcy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZmlsdGVyIG9iamVjdCB0byByZWZsZWN0IHZhbHVlcyBvZiBpbnB1dCBmaWVsZHMuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gZm9ybSBlbGVtZW50IHR5cGUgKGkuZSBjb21wb25lbnQgbmFtZSlcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gdGhlIG5hbWUgb2YgdGhlIGZvcm0gZWxlbWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgLSBpZCBvZiB0aGUgZm9ybSBlbGVtZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0gdHlwZSBvZiB0aGUgZm9ybSBlbGVtZW50XG4gICAqL1xuICBvbkZpZWxkVXBkYXRlKG5hbWUsIHZhbHVlLCBpZCwgdHlwZSkge1xuICAgIGNvbnN0IGZpbHRlciA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5wcm9wcy5maWx0ZXIpKTtcbiAgICBjb25zdCBleGFjdE1hdGNoID0gdHlwZSA9PT0gJ3RleHRib3gnID8gZmFsc2UgOiB0cnVlO1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gJycpIHtcbiAgICAgIGRlbGV0ZSBmaWx0ZXJbbmFtZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbHRlcltuYW1lXSA9IHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBleGFjdE1hdGNoOiBleGFjdE1hdGNoLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICB0aGlzLnByb3BzLnVwZGF0ZUZpbHRlcihmaWx0ZXIpO1xuICB9XG5cbiAgcmVuZGVyRmlsdGVyRmllbGRzKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLmZpZWxkcy5yZWR1Y2UoKHJlc3VsdCwgZmllbGQpID0+IHtcbiAgICAgIGNvbnN0IGZpbHRlciA9IGZpZWxkLmZpbHRlcjtcbiAgICAgIGlmIChmaWx0ZXIgJiYgZmlsdGVyLmhpZGUgIT09IHRydWUpIHtcbiAgICAgICAgbGV0IGVsZW1lbnQ7XG4gICAgICAgIHN3aXRjaCAoZmlsdGVyLnR5cGUpIHtcbiAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgZWxlbWVudCA9IDxUZXh0Ym94RWxlbWVudCBrZXk9e2ZpbHRlci5uYW1lfS8+O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgICAgIGVsZW1lbnQgPSA8U2VsZWN0RWxlbWVudCBrZXk9e2ZpbHRlci5uYW1lfSBvcHRpb25zPXtmaWx0ZXIub3B0aW9uc30vPjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbXVsdGlzZWxlY3QnOlxuICAgICAgICAgIGVsZW1lbnQgPSA8U2VsZWN0RWxlbWVudCBrZXk9e2ZpbHRlci5uYW1lfSBvcHRpb25zPXtmaWx0ZXIub3B0aW9uc30gbXVsdGlwbGU9e3RydWV9Lz47XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICAgIGVsZW1lbnQgPSA8RGF0ZUVsZW1lbnQga2V5PXtmaWx0ZXIubmFtZX0vPjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBlbGVtZW50ID0gPFRleHRib3hFbGVtZW50IGtleT17ZmlsdGVyLm5hbWV9Lz47XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHQucHVzaChSZWFjdC5jbG9uZUVsZW1lbnQoXG4gICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBmaWx0ZXIubmFtZSxcbiAgICAgICAgICAgIGxhYmVsOiBmaWVsZC5sYWJlbCxcbiAgICAgICAgICAgIHZhbHVlOiAodGhpcy5wcm9wcy5maWx0ZXJbZmlsdGVyLm5hbWVdIHx8IHt9KS52YWx1ZSxcbiAgICAgICAgICAgIG9uVXNlcklucHV0OiB0aGlzLm9uRmllbGRVcGRhdGUsXG4gICAgICAgICAgfVxuICAgICAgICApKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LCBbXSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxGb3JtRWxlbWVudFxuICAgICAgICBpZD17dGhpcy5wcm9wcy5pZH1cbiAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgPlxuICAgICAgICA8RmllbGRzZXRFbGVtZW50XG4gICAgICAgICAgY29sdW1ucz17dGhpcy5wcm9wcy5jb2x1bW5zfVxuICAgICAgICAgIGxlZ2VuZD17dGhpcy5wcm9wcy50aXRsZX1cbiAgICAgICAgPlxuICAgICAgICAgIHt0aGlzLnJlbmRlckZpbHRlckZpZWxkcygpfVxuICAgICAgICAgIDxCdXR0b25FbGVtZW50XG4gICAgICAgICAgICBsYWJlbD1cIkNsZWFyIEZpbHRlcnNcIlxuICAgICAgICAgICAgdHlwZT1cInJlc2V0XCJcbiAgICAgICAgICAgIG9uVXNlcklucHV0PXt0aGlzLnByb3BzLmNsZWFyRmlsdGVyfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvRmllbGRzZXRFbGVtZW50PlxuICAgICAgPC9Gb3JtRWxlbWVudD5cbiAgICApO1xuICB9XG59XG5cbkZpbHRlci5kZWZhdWx0UHJvcHMgPSB7XG4gIGlkOiBudWxsLFxuICBjbGVhckZpbHRlcjogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVwZGF0ZSgpIGNhbGxiYWNrIGlzIG5vdCBzZXQhJyk7XG4gIH0sXG4gIGNvbHVtbnM6IDEsXG59O1xuRmlsdGVyLnByb3BUeXBlcyA9IHtcbiAgZmlsdGVyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGNsZWFyRmlsdGVyOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgY29sdW1uczogUHJvcFR5cGVzLnN0cmluZyxcbiAgdGl0bGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGZpZWxkczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgRmlsdGVyO1xuIiwiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgUGFuZWwgZnJvbSAnLi9QYW5lbCc7XG5pbXBvcnQgRGF0YVRhYmxlIGZyb20gJy4vRGF0YVRhYmxlJztcbmltcG9ydCBGaWx0ZXIgZnJvbSAnLi9GaWx0ZXInO1xuXG4vKipcbiAqIEZpbHRlcmFibGVEYXRhVGFibGUgY29tcG9uZW50LlxuICogQSB3cmFwcGVyIGZvciBhbGwgZGF0YXRhYmxlcyB0aGF0IGhhbmRsZXMgZmlsdGVyaW5nLlxuICpcbiAqIEhhbmRsZXMgdGhlIHVwZGF0aW5nIGFuZCBjbGVhcmluZyBvZiB0aGUgZmlsdGVyIHN0YXRlIGJhc2VkIG9uIGNoYW5nZXMgc2VudFxuICogZnJvbSB0aGUgRmlsdGVyRm9ybS5cbiAqXG4gKiBQYXNzZXMgdGhlIEZpbHRlciB0byB0aGUgRGF0YXRhYmxlLlxuICpcbiAqIERlcHJlY2F0ZXMgRmlsdGVyIEZvcm0uXG4gKi9cbmNsYXNzIEZpbHRlcmFibGVEYXRhVGFibGUgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZmlsdGVyOiB7fSxcbiAgICB9O1xuICAgIHRoaXMudXBkYXRlRmlsdGVyID0gdGhpcy51cGRhdGVGaWx0ZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNsZWFyRmlsdGVyID0gdGhpcy5jbGVhckZpbHRlci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgZmlsdGVyIHN0YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBmaWx0ZXIgcGFzc2VkIGZyb20gRmlsdGVyRm9ybVxuICAgKi9cbiAgdXBkYXRlRmlsdGVyKGZpbHRlcikge1xuICAgIHRoaXMuc2V0U3RhdGUoe2ZpbHRlcn0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgRmlsdGVyIHRvIGVtcHR5IG9iamVjdFxuICAgKi9cbiAgY2xlYXJGaWx0ZXIoKSB7XG4gICAgdGhpcy51cGRhdGVGaWx0ZXIoe30pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8UGFuZWxcbiAgICAgICAgdGl0bGU9e3RoaXMucHJvcHMudGl0bGV9XG4gICAgICA+XG4gICAgICAgIDxGaWx0ZXJcbiAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWUgKyAnX2ZpbHRlcid9XG4gICAgICAgICAgaWQ9e3RoaXMucHJvcHMubmFtZSArICdfZmlsdGVyJ31cbiAgICAgICAgICB0aXRsZT0nU2VsZWN0aW9uIEZpbHRlcidcbiAgICAgICAgICBjb2x1bW5zPXt0aGlzLnByb3BzLmNvbHVtbnN9XG4gICAgICAgICAgZmlsdGVyPXt0aGlzLnN0YXRlLmZpbHRlcn1cbiAgICAgICAgICBmaWVsZHM9e3RoaXMucHJvcHMuZmllbGRzfVxuICAgICAgICAgIHVwZGF0ZUZpbHRlcj17dGhpcy51cGRhdGVGaWx0ZXJ9XG4gICAgICAgICAgY2xlYXJGaWx0ZXI9e3RoaXMuY2xlYXJGaWx0ZXJ9XG4gICAgICAgIC8+XG4gICAgICAgIDxEYXRhVGFibGVcbiAgICAgICAgICBkYXRhPXt0aGlzLnByb3BzLmRhdGF9XG4gICAgICAgICAgZmllbGRzPXt0aGlzLnByb3BzLmZpZWxkc31cbiAgICAgICAgICBmaWx0ZXI9e3RoaXMuc3RhdGUuZmlsdGVyfVxuICAgICAgICAgIGdldEZvcm1hdHRlZENlbGw9e3RoaXMucHJvcHMuZ2V0Rm9ybWF0dGVkQ2VsbH1cbiAgICAgICAgICBhY3Rpb25zPXt0aGlzLnByb3BzLmFjdGlvbnN9XG4gICAgICAgIC8+XG4gICAgICA8L1BhbmVsPlxuICAgICk7XG4gIH1cbn1cblxuRmlsdGVyYWJsZURhdGFUYWJsZS5kZWZhdWx0UHJvcHMgPSB7XG4gIGNvbHVtbnM6IDMsXG59O1xuXG5GaWx0ZXJhYmxlRGF0YVRhYmxlLnByb3BUeXBlcyA9IHtcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgZGF0YTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBmaWx0ZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgZmllbGRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGNvbHVtbnM6IFByb3BUeXBlcy5udW1iZXIsXG4gIGdldEZvcm1hdHRlZENlbGw6IFByb3BUeXBlcy5mdW5jLFxuICBhY3Rpb25zOiBQcm9wVHlwZXMub2JqZWN0LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgRmlsdGVyYWJsZURhdGFUYWJsZTtcbiIsIi8qIGV4cG9ydGVkIEZvcm1FbGVtZW50LCBGaWVsZHNldEVsZW1lbnQsIFNlbGVjdEVsZW1lbnQsIFRhZ3NFbGVtZW50LCBTZWFyY2hhYmxlRHJvcGRvd24sIFRleHRhcmVhRWxlbWVudCxcblRleHRib3hFbGVtZW50LCBEYXRlRWxlbWVudCwgTnVtZXJpY0VsZW1lbnQsIEZpbGVFbGVtZW50LCBTdGF0aWNFbGVtZW50LCBMaW5rRWxlbWVudCxcbkNoZWNrYm94RWxlbWVudCwgQnV0dG9uRWxlbWVudCwgTG9yaXNFbGVtZW50XG4qL1xuXG4vKipcbiAqIFRoaXMgZmlsZSBjb250YWlucyBSZWFjdCBjb21wb25lbnRzIGZvciBMb3JpcyBmb3JtIGVsZW1lbnRzLlxuICpcbiAqIEBhdXRob3IgTG9yaXMgVGVhbVxuICogQHZlcnNpb24gMS4wLjBcbiAqXG4gKi9cblxuLyoqXG4gKiBGb3JtIENvbXBvbmVudC5cbiAqIFJlYWN0IHdyYXBwZXIgZm9yIDxmb3JtPiBlbGVtZW50IHRoYXQgYWNjZXB0cyBjaGlsZHJlbiByZWFjdCBjb21wb25lbnRzXG4gKlxuICogVGhlIGZvcm0gZWxlbWVudHMgY2FuIGJlIHBhc3NlZCBpbiB0d28gd2F5czpcbiAqIDEuIEEgYHRoaXMucHJvcHMuZm9ybUVsZW1lbnRzYCBKU09OIG9iamVjdFxuICogMi4gRm9ybSBjb21wb25lbnRzIG5lc3RlZCBkaXJlY3RseSBpbnNpZGUgPEZvcm1FbGVtZW50PjwvRm9ybUVsZW1lbnQ+XG4gKlxuICogTm90ZSB0aGF0IGlmIGJvdGggYXJlIHBhc3NlZCBgdGhpcy5wcm9wcy5mb3JtRWxlbWVudHNgIGlzIGRpc3BsYXllZCBmaXJzdC5cbiAqXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG4vKipcbiAqIEZvcm1FbGVtZW50IENvbXBvbmVudC5cbiAqIFVzZWQgZm9yIGNvbnN0cnVjdGluZyBmb3JtIGVsZW1lbnQuXG4gKi9cbmNsYXNzIEZvcm1FbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5nZXRGb3JtRWxlbWVudHMgPSB0aGlzLmdldEZvcm1FbGVtZW50cy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGdldEZvcm1FbGVtZW50cygpIHtcbiAgICBjb25zdCBmb3JtRWxlbWVudHNIVE1MID0gW107XG4gICAgY29uc3QgY29sdW1ucyA9IHRoaXMucHJvcHMuY29sdW1ucztcbiAgICBjb25zdCBtYXhDb2x1bW5TaXplID0gMTI7XG4gICAgY29uc3QgY29sU2l6ZSA9IE1hdGguZmxvb3IobWF4Q29sdW1uU2l6ZSAvIGNvbHVtbnMpO1xuICAgIGNvbnN0IGNvbENsYXNzID0gJ2NvbC14cy0xMiBjb2wtc20tJyArIGNvbFNpemUgKyAnIGNvbC1tZC0nICsgY29sU2l6ZTtcblxuICAgIC8vIFJlbmRlciBlbGVtZW50cyBmcm9tIEpTT05cbiAgICBjb25zdCBmaWx0ZXIgPSB0aGlzLnByb3BzLmZvcm1FbGVtZW50cztcblxuICAgIE9iamVjdC5rZXlzKGZpbHRlcikuZm9yRWFjaChmdW5jdGlvbihvYmpLZXksIGluZGV4KSB7XG4gICAgICBjb25zdCB1c2VySW5wdXQgPSB0aGlzLnByb3BzLm9uVXNlcklucHV0ID8gdGhpcy5wcm9wcy5vblVzZXJJbnB1dCA6IGZpbHRlcltvYmpLZXldLm9uVXNlcklucHV0O1xuICAgICAgY29uc3QgdmFsdWUgPSBmaWx0ZXJbb2JqS2V5XS52YWx1ZSA/IGZpbHRlcltvYmpLZXldLnZhbHVlIDogJyc7XG4gICAgICBmb3JtRWxlbWVudHNIVE1MLnB1c2goXG4gICAgICAgICAgPGRpdiBrZXk9eydlbF8nICsgaW5kZXh9IGNsYXNzTmFtZT17Y29sQ2xhc3N9PlxuICAgICAgICAgICAgPExvcmlzRWxlbWVudFxuICAgICAgICAgICAgICBlbGVtZW50PXtmaWx0ZXJbb2JqS2V5XX1cbiAgICAgICAgICAgICAgb25Vc2VySW5wdXQ9e3VzZXJJbnB1dH1cbiAgICAgICAgICAgICAgdmFsdWU9e3ZhbHVlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIC8vIFJlbmRlciBlbGVtZW50cyBmcm9tIFJlYWN0XG4gICAgUmVhY3QuQ2hpbGRyZW4uZm9yRWFjaCh0aGlzLnByb3BzLmNoaWxkcmVuLCBmdW5jdGlvbihjaGlsZCwga2V5KSB7XG4gICAgICAvLyBJZiBjaGlsZCBpcyBwbGFpbiBIVE1MLCBpbnNlcnQgaXQgYXMgZnVsbCBzaXplLlxuICAgICAgLy8gVXNlZnVsIGZvciBpbnNlcnRpbmcgPGhyPiB0byBzcGxpdCBmb3JtIHNlY3Rpb25zXG4gICAgICBsZXQgZWxlbWVudENsYXNzID0gJ2NvbC14cy0xMiBjb2wtc20tMTIgY29sLW1kLTEyJztcblxuICAgICAgLy8gSWYgY2hpbGQgaXMgZm9ybSBlbGVtZW50IHVzZSBhcHByb3ByaWF0ZSBzaXplXG4gICAgICBpZiAoUmVhY3QuaXNWYWxpZEVsZW1lbnQoY2hpbGQpICYmIHR5cGVvZiBjaGlsZC50eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGVsZW1lbnRDbGFzcyA9IGNvbENsYXNzO1xuICAgICAgfVxuICAgICAgZm9ybUVsZW1lbnRzSFRNTC5wdXNoKFxuICAgICAgICAgIDxkaXYga2V5PXsnZWxfY2hpbGRfJyArIGtleX0gY2xhc3NOYW1lPXtlbGVtZW50Q2xhc3N9PntjaGlsZH08L2Rpdj5cbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZm9ybUVsZW1lbnRzSFRNTDtcbiAgfVxuXG4gIGhhbmRsZVN1Ym1pdChlKSB7XG4gICAgLy8gT3ZlcnJpZGUgZGVmYXVsdCBzdWJtaXQgaWYgcHJvcGVydHkgaXMgc2V0XG4gICAgaWYgKHRoaXMucHJvcHMub25TdWJtaXQpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMucHJvcHMub25TdWJtaXQoZSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGVuY1R5cGUgPSB0aGlzLnByb3BzLmZpbGVVcGxvYWQgPyAnbXVsdGlwYXJ0L2Zvcm0tZGF0YScgOiBudWxsO1xuXG4gICAgLy8gR2VuZXJhdGUgZm9ybSBlbGVtZW50c1xuICAgIGNvbnN0IGZvcm1FbGVtZW50cyA9IHRoaXMuZ2V0Rm9ybUVsZW1lbnRzKCk7XG5cbiAgICAvLyBGbGV4Ym94IGlzIHNldCB0byBlbnN1cmUgdGhhdCBjb2x1bW5zIG9mIGRpZmZlcmVudCBoZWlnaHRzXG4gICAgLy8gYXJlIGRpc3BsYXllZCBwcm9wb3J0aW9uYWxseSBvbiB0aGUgc2NyZWVuXG4gICAgY29uc3Qgcm93U3R5bGVzID0ge1xuICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgZmxleFdyYXA6ICd3cmFwJyxcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxmb3JtXG4gICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZX1cbiAgICAgICAgaWQ9e3RoaXMucHJvcHMuaWR9XG4gICAgICAgIGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jbGFzc31cbiAgICAgICAgbWV0aG9kPXt0aGlzLnByb3BzLm1ldGhvZH1cbiAgICAgICAgYWN0aW9uPXt0aGlzLnByb3BzLmFjdGlvbn1cbiAgICAgICAgZW5jVHlwZT17ZW5jVHlwZX1cbiAgICAgICAgb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fVxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiIHN0eWxlPXtyb3dTdHlsZXN9PlxuICAgICAgICAgIHtmb3JtRWxlbWVudHN9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9mb3JtPlxuICAgICk7XG4gIH1cbn1cblxuRm9ybUVsZW1lbnQucHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBtZXRob2Q6IFByb3BUeXBlcy5vbmVPZihbJ1BPU1QnLCAnR0VUJ10pLFxuICBhY3Rpb246IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNsYXNzOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjb2x1bW5zOiBQcm9wVHlwZXMubnVtYmVyLFxuICBmb3JtRWxlbWVudHM6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgZWxlbWVudE5hbWU6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgdHlwZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICB9KSxcbiAgfSksXG4gIG9uU3VibWl0OiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Vc2VySW5wdXQ6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuRm9ybUVsZW1lbnQuZGVmYXVsdFByb3BzID0ge1xuICBuYW1lOiBudWxsLFxuICBpZDogbnVsbCxcbiAgbWV0aG9kOiAnUE9TVCcsXG4gIGFjdGlvbjogdW5kZWZpbmVkLFxuICBjbGFzczogJ2Zvcm0taG9yaXpvbnRhbCcsXG4gIGNvbHVtbnM6IDEsXG4gIGZpbGVVcGxvYWQ6IGZhbHNlLFxuICBmb3JtRWxlbWVudHM6IHt9LFxuICBvblN1Ym1pdDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblN1Ym1pdCgpIGNhbGxiYWNrIGlzIG5vdCBzZXQhJyk7XG4gIH0sXG59O1xuXG4vKipcbiAqIEZpZWxkc2V0RWxlbWVudCBDb21wb25lbnQuXG4gKiBSZWFjdCB3cmFwcGVyIGZvciA8ZmllbGRzZXQ+IGVsZW1lbnQgdGhhdCBpcyBuZXN0ZWQgaW5zaWRlIDxGb3JtRWxlbWVudD48L0Zvcm1FbGVtZW50PixcbiAqIGFuZCBhY2NlcHRzIGNoaWxkIHJlYWN0IGNvbXBvbmVudHMuIEEgZmllbGRzZXQgZ3JvdXBzIHJlbGF0ZWQgZWxlbWVudHMgaW4gYSBmb3JtLlxuICpcbiAqIFRoZSBmb3JtIGVsZW1lbnRzIGNhbiBiZSBwYXNzZWQgYnkgbmVzdGluZyBGb3JtIGNvbXBvbmVudHMgZGlyZWN0bHkgaW5zaWRlIDxGaWVsZHNldEVsZW1lbnQ+PC9GaWVsZHNldEVsZW1lbnQ+LlxuICpcbiAqL1xuY2xhc3MgRmllbGRzZXRFbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5nZXRGb3JtRWxlbWVudHMgPSB0aGlzLmdldEZvcm1FbGVtZW50cy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgZ2V0Rm9ybUVsZW1lbnRzKCkge1xuICAgIGNvbnN0IGZvcm1FbGVtZW50c0hUTUwgPSBbXTtcbiAgICBjb25zdCBjb2x1bW5zID0gdGhpcy5wcm9wcy5jb2x1bW5zO1xuICAgIGNvbnN0IG1heENvbHVtblNpemUgPSAxMjtcbiAgICBjb25zdCBjb2xTaXplID0gTWF0aC5mbG9vcihtYXhDb2x1bW5TaXplIC8gY29sdW1ucyk7XG4gICAgY29uc3QgY29sQ2xhc3MgPSAnY29sLXhzLTEyIGNvbC1zbS0nICsgY29sU2l6ZSArICcgY29sLW1kLScgKyBjb2xTaXplO1xuXG4gICAgLy8gUmVuZGVyIGVsZW1lbnRzIGZyb20gUmVhY3RcbiAgICBSZWFjdC5DaGlsZHJlbi5mb3JFYWNoKHRoaXMucHJvcHMuY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkLCBrZXkpIHtcbiAgICAgIC8vIElmIGNoaWxkIGlzIHBsYWluIEhUTUwsIGluc2VydCBpdCBhcyBmdWxsIHNpemUuXG4gICAgICAvLyBVc2VmdWwgZm9yIGluc2VydGluZyA8aHI+IHRvIHNwbGl0IGZvcm0gc2VjdGlvbnNcbiAgICAgIGxldCBlbGVtZW50Q2xhc3MgPSAnY29sLXhzLTEyIGNvbC1zbS0xMiBjb2wtbWQtMTInO1xuXG4gICAgICAvLyBJZiBjaGlsZCBpcyBmb3JtIGVsZW1lbnQgdXNlIGFwcHJvcHJpYXRlIHNpemVcbiAgICAgIGlmIChSZWFjdC5pc1ZhbGlkRWxlbWVudChjaGlsZCkgJiYgdHlwZW9mIGNoaWxkLnR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZWxlbWVudENsYXNzID0gY29sQ2xhc3M7XG4gICAgICB9XG4gICAgICBmb3JtRWxlbWVudHNIVE1MLnB1c2goXG4gICAgICAgICAgPGRpdiBrZXk9eydlbF9jaGlsZF8nICsga2V5fSBjbGFzc05hbWU9e2VsZW1lbnRDbGFzc30+e2NoaWxkfTwvZGl2PlxuICAgICAgKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZm9ybUVsZW1lbnRzSFRNTDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvLyBHZW5lcmF0ZSBmb3JtIGVsZW1lbnRzXG4gICAgY29uc3QgZm9ybUVsZW1lbnRzID0gdGhpcy5nZXRGb3JtRWxlbWVudHMoKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZmllbGRzZXRcbiAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgPlxuICAgICAgICA8bGVnZW5kPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxlZ2VuZH1cbiAgICAgICAgPC9sZWdlbmQ+XG4gICAgICAgIHtmb3JtRWxlbWVudHN9XG4gICAgICA8L2ZpZWxkc2V0PlxuICAgICk7XG4gIH1cbn1cblxuRmllbGRzZXRFbGVtZW50LnByb3BUeXBlcyA9IHtcbiAgY29sdW1uczogUHJvcFR5cGVzLm51bWJlcixcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgbGVnZW5kOiBQcm9wVHlwZXMuc3RyaW5nLFxufTtcblxuRmllbGRzZXRFbGVtZW50LmRlZmF1bHRQcm9wcyA9IHtcbiAgY29sdW1uczogMSxcbiAgbGVnZW5kOiAnU2VsZWN0aW9uIEZpbHRlcicsXG59O1xuXG4vKipcbiAqIFNlYXJjaCBDb21wb25lbnRcbiAqIFJlYWN0IHdyYXBwZXIgZm9yIGEgc2VhcmNoYWJsZSBkcm9wZG93blxuICovXG5jbGFzcyBTZWFyY2hhYmxlRHJvcGRvd24gZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmdldEtleUZyb21WYWx1ZSA9IHRoaXMuZ2V0S2V5RnJvbVZhbHVlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQmx1ciA9IHRoaXMuaGFuZGxlQmx1ci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0VGV4dElucHV0VmFsdWUgPSB0aGlzLmdldFRleHRJbnB1dFZhbHVlLmJpbmQodGhpcyk7XG4gIH1cblxuICBnZXRLZXlGcm9tVmFsdWUodmFsdWUpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5wcm9wcy5vcHRpb25zO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhvcHRpb25zKS5maW5kKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvcHRpb25zW29dID09PSB2YWx1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShlKSB7XG4gICAgbGV0IHZhbHVlID0gdGhpcy5nZXRLZXlGcm9tVmFsdWUoZS50YXJnZXQudmFsdWUpO1xuICAgIC8vIGlmIG5vdCBpbiBzdHJpY3QgbW9kZSBhbmQga2V5IHZhbHVlIGlzIG5vdCBkZWZpbmVkIChpLmUuLCBub3QgaW4gb3B0aW9ucylcbiAgICAvLyBzZXQgdmFsdWUgZXF1YWwgdG8gZS50YXJnZXQudmFsdWVcbiAgICBpZiAoIXRoaXMucHJvcHMuc3RyaWN0U2VhcmNoICYmIHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbHVlID0gZS50YXJnZXQudmFsdWU7XG4gICAgfVxuICAgIHRoaXMucHJvcHMub25Vc2VySW5wdXQodGhpcy5wcm9wcy5uYW1lLCB2YWx1ZSk7XG4gIH1cblxuICBoYW5kbGVCbHVyKGUpIHtcbiAgICAvLyBudWxsIG91dCBlbnRyeSBpZiBub3QgcHJlc2VudCBpbiBvcHRpb25zIGluIHN0cmljdCBtb2RlXG4gICAgaWYgKHRoaXMucHJvcHMuc3RyaWN0U2VhcmNoKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMucHJvcHMub3B0aW9ucztcbiAgICAgIGlmIChPYmplY3QudmFsdWVzKG9wdGlvbnMpLmluZGV4T2YodmFsdWUpID09PSAtMSkge1xuICAgICAgICAvLyBlbXB0eSBzdHJpbmcgb3V0IGJvdGggdGhlIGhpZGRlbiB2YWx1ZSBhcyB3ZWxsIGFzIHRoZSBpbnB1dCB0ZXh0XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGlucHV0W25hbWU9XCIke3RoaXMucHJvcHMubmFtZSArICdfaW5wdXQnfVwiXWApLnZhbHVlID0gJyc7XG4gICAgICAgIHRoaXMucHJvcHMub25Vc2VySW5wdXQodGhpcy5wcm9wcy5uYW1lLCAnJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0VGV4dElucHV0VmFsdWUoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGlucHV0W25hbWU9XCIke3RoaXMucHJvcHMubmFtZSArICdfaW5wdXQnfVwiXWApLnZhbHVlO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJlcXVpcmVkID0gdGhpcy5wcm9wcy5yZXF1aXJlZCA/ICdyZXF1aXJlZCcgOiBudWxsO1xuICAgIGNvbnN0IGRpc2FibGVkID0gdGhpcy5wcm9wcy5kaXNhYmxlZCA/ICdkaXNhYmxlZCcgOiBudWxsO1xuICAgIGNvbnN0IHNvcnRCeVZhbHVlID0gdGhpcy5wcm9wcy5zb3J0QnlWYWx1ZTtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5wcm9wcy5vcHRpb25zO1xuICAgIGNvbnN0IHN0cmljdE1lc3NhZ2UgPSAnRW50cnkgbXVzdCBiZSBpbmNsdWRlZCBpbiBwcm92aWRlZCBsaXN0IG9mIG9wdGlvbnMuJztcbiAgICBsZXQgZXJyb3JNZXNzYWdlID0gbnVsbDtcbiAgICBsZXQgcmVxdWlyZWRIVE1MID0gbnVsbDtcbiAgICBsZXQgZWxlbWVudENsYXNzID0gJ3JvdyBmb3JtLWdyb3VwJztcblxuICAgIC8vIEFkZCByZXF1aXJlZCBhc3Rlcml4XG4gICAgaWYgKHJlcXVpcmVkKSB7XG4gICAgICByZXF1aXJlZEhUTUwgPSA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWRhbmdlclwiPio8L3NwYW4+O1xuICAgIH1cblxuICAgIC8vIEFkZCBlcnJvciBtZXNzYWdlXG4gICAgaWYgKHRoaXMucHJvcHMuZXJyb3JNZXNzYWdlKSB7XG4gICAgICBlcnJvck1lc3NhZ2UgPSA8c3Bhbj57dGhpcy5wcm9wcy5lcnJvck1lc3NhZ2V9PC9zcGFuPjtcbiAgICAgIGVsZW1lbnRDbGFzcyA9ICdyb3cgZm9ybS1ncm91cCBoYXMtZXJyb3InO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5yZXF1aXJlZCAmJiB0aGlzLnByb3BzLnZhbHVlID09PSAnJykge1xuICAgICAgbGV0IG1zZyA9ICdUaGlzIGZpZWxkIGlzIHJlcXVpcmVkISc7XG4gICAgICBtc2cgKz0gKHRoaXMucHJvcHMuc3RyaWN0U2VhcmNoID8gJyAnICsgc3RyaWN0TWVzc2FnZSA6ICcnKTtcbiAgICAgIGVycm9yTWVzc2FnZSA9IDxzcGFuPnttc2d9PC9zcGFuPjtcbiAgICAgIGVsZW1lbnRDbGFzcyA9ICdyb3cgZm9ybS1ncm91cCBoYXMtZXJyb3InO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5zdHJpY3RTZWFyY2ggJiYgdGhpcy5wcm9wcy52YWx1ZSA9PT0gJycpIHtcbiAgICAgIGVycm9yTWVzc2FnZSA9IDxzcGFuPntzdHJpY3RNZXNzYWdlfTwvc3Bhbj47XG4gICAgICBlbGVtZW50Q2xhc3MgPSAncm93IGZvcm0tZ3JvdXAgaGFzLWVycm9yJztcbiAgICB9XG5cbiAgICAvLyBkZXRlcm1pbmUgdmFsdWUgdG8gcGxhY2UgaW50byB0ZXh0IGlucHV0XG4gICAgbGV0IHZhbHVlO1xuICAgIC8vIHVzZSB2YWx1ZSBpbiBvcHRpb25zIGlmIHZhbGlkXG4gICAgaWYgKHRoaXMucHJvcHMudmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKE9iamVjdC5rZXlzKG9wdGlvbnMpLmluZGV4T2YodGhpcy5wcm9wcy52YWx1ZSkgPiAtMSkge1xuICAgICAgICB2YWx1ZSA9IG9wdGlvbnNbdGhpcy5wcm9wcy52YWx1ZV07XG4gICAgICAgIC8vIGVsc2UsIHVzZSBpbnB1dCB0ZXh0IHZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IHRoaXMuZ2V0VGV4dElucHV0VmFsdWUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBuZXdPcHRpb25zID0ge307XG4gICAgbGV0IG9wdGlvbkxpc3QgPSBbXTtcbiAgICBpZiAoc29ydEJ5VmFsdWUpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIG5ld09wdGlvbnNbb3B0aW9uc1trZXldXSA9IGtleTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgb3B0aW9uTGlzdCA9IE9iamVjdC5rZXlzKG5ld09wdGlvbnMpLnNvcnQoKS5tYXAoZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT17b3B0aW9ufSBrZXk9e25ld09wdGlvbnNbb3B0aW9uXX0vPlxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbkxpc3QgPSBPYmplY3Qua2V5cyhvcHRpb25zKS5tYXAoZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT17b3B0aW9uc1tvcHRpb25dfSBrZXk9e29wdGlvbn0vPlxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtlbGVtZW50Q2xhc3N9PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9e3RoaXMucHJvcHMubGFiZWx9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgICAgIHtyZXF1aXJlZEhUTUx9XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTlcIj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZSArICdfaW5wdXQnfVxuICAgICAgICAgICAgdmFsdWU9e3ZhbHVlfVxuICAgICAgICAgICAgaWQ9e3RoaXMucHJvcHMuaWR9XG4gICAgICAgICAgICBsaXN0PXt0aGlzLnByb3BzLm5hbWUgKyAnX2xpc3QnfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0aGlzLnByb3BzLnBsYWNlSG9sZGVyfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgb25CbHVyPXt0aGlzLmhhbmRsZUJsdXJ9XG4gICAgICAgICAgICByZXF1aXJlZD17cmVxdWlyZWR9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8ZGF0YWxpc3QgaWQ9e3RoaXMucHJvcHMubmFtZSArICdfbGlzdCd9PlxuICAgICAgICAgICAge29wdGlvbkxpc3R9XG4gICAgICAgICAgPC9kYXRhbGlzdD5cbiAgICAgICAgICB7ZXJyb3JNZXNzYWdlfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuU2VhcmNoYWJsZURyb3Bkb3duLnByb3BUeXBlcyA9IHtcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBvcHRpb25zOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAvLyBzdHJpY3RTZWFyY2gsIGlmIHNldCB0byB0cnVlLCB3aWxsIHJlcXVpcmUgdGhhdCBvbmx5IG9wdGlvbnNcbiAgLy8gcHJvdmlkZWQgaW4gdGhlIG9wdGlvbnMgcHJvcCBjYW4gYmUgc3VibWl0dGVkXG4gIHN0cmljdFNlYXJjaDogUHJvcFR5cGVzLmJvb2wsXG4gIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB2YWx1ZTogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICBQcm9wVHlwZXMuYXJyYXksXG4gIF0pLFxuICBjbGFzczogUHJvcFR5cGVzLnN0cmluZyxcbiAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICByZXF1aXJlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGVycm9yTWVzc2FnZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgcGxhY2VIb2xkZXI6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG9uVXNlcklucHV0OiBQcm9wVHlwZXMuZnVuYyxcbn07XG5cblNlYXJjaGFibGVEcm9wZG93bi5kZWZhdWx0UHJvcHMgPSB7XG4gIG5hbWU6ICcnLFxuICBvcHRpb25zOiB7fSxcbiAgc3RyaWN0U2VhcmNoOiB0cnVlLFxuICBsYWJlbDogJycsXG4gIHZhbHVlOiB1bmRlZmluZWQsXG4gIGlkOiBudWxsLFxuICBjbGFzczogJycsXG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICBzb3J0QnlWYWx1ZTogdHJ1ZSxcbiAgZXJyb3JNZXNzYWdlOiAnJyxcbiAgcGxhY2VIb2xkZXI6ICcnLFxuICBvblVzZXJJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVzZXJJbnB1dCgpIGNhbGxiYWNrIGlzIG5vdCBzZXQnKTtcbiAgfSxcbn07XG5cbi8qKlxuICogU2VsZWN0IENvbXBvbmVudFxuICogUmVhY3Qgd3JhcHBlciBmb3IgYSBzaW1wbGUgb3IgJ211bHRpcGxlJyA8c2VsZWN0PiBlbGVtZW50LlxuICovXG5jbGFzcyBTZWxlY3RFbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGUpIHtcbiAgICBsZXQgdmFsdWUgPSBlLnRhcmdldC52YWx1ZTtcbiAgICBjb25zdCBvcHRpb25zID0gZS50YXJnZXQub3B0aW9ucztcbiAgICBjb25zdCBudW1PZk9wdGlvbnMgPSBvcHRpb25zLmxlbmd0aDtcblxuICAgIC8vIE11bHRpcGxlIHZhbHVlc1xuICAgIGlmICh0aGlzLnByb3BzLm11bHRpcGxlICYmIG51bU9mT3B0aW9ucyA+IDEpIHtcbiAgICAgIHZhbHVlID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IG51bU9mT3B0aW9uczsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAob3B0aW9uc1tpXS5zZWxlY3RlZCkge1xuICAgICAgICAgIHZhbHVlLnB1c2gob3B0aW9uc1tpXS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnByb3BzLm9uVXNlcklucHV0KHRoaXMucHJvcHMubmFtZSwgdmFsdWUsIGUudGFyZ2V0LmlkLCAnc2VsZWN0Jyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgbXVsdGlwbGUgPSB0aGlzLnByb3BzLm11bHRpcGxlID8gJ211bHRpcGxlJyA6IG51bGw7XG4gICAgY29uc3QgcmVxdWlyZWQgPSB0aGlzLnByb3BzLnJlcXVpcmVkID8gJ3JlcXVpcmVkJyA6IG51bGw7XG4gICAgY29uc3QgZGlzYWJsZWQgPSB0aGlzLnByb3BzLmRpc2FibGVkID8gJ2Rpc2FibGVkJyA6IG51bGw7XG4gICAgY29uc3Qgc29ydEJ5VmFsdWUgPSB0aGlzLnByb3BzLnNvcnRCeVZhbHVlO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLnByb3BzLm9wdGlvbnM7XG4gICAgbGV0IGVycm9yTWVzc2FnZSA9IG51bGw7XG4gICAgbGV0IGVtcHR5T3B0aW9uSFRNTCA9IG51bGw7XG4gICAgbGV0IHJlcXVpcmVkSFRNTCA9IG51bGw7XG4gICAgbGV0IGVsZW1lbnRDbGFzcyA9ICdyb3cgZm9ybS1ncm91cCc7XG5cbiAgICAvLyBBZGQgcmVxdWlyZWQgYXN0ZXJpc2tcbiAgICBpZiAocmVxdWlyZWQpIHtcbiAgICAgIHJlcXVpcmVkSFRNTCA9IDxzcGFuIGNsYXNzTmFtZT1cInRleHQtZGFuZ2VyXCI+Kjwvc3Bhbj47XG4gICAgfVxuXG4gICAgLy8gQWRkIGVtcHR5IG9wdGlvblxuICAgIGlmICh0aGlzLnByb3BzLmVtcHR5T3B0aW9uKSB7XG4gICAgICBlbXB0eU9wdGlvbkhUTUwgPSA8b3B0aW9uPjwvb3B0aW9uPjtcbiAgICB9XG5cbiAgICAvLyBBZGQgZXJyb3IgbWVzc2FnZVxuICAgIGlmICh0aGlzLnByb3BzLmhhc0Vycm9yIHx8ICh0aGlzLnByb3BzLnJlcXVpcmVkICYmIHRoaXMucHJvcHMudmFsdWUgPT09ICcnKSkge1xuICAgICAgZXJyb3JNZXNzYWdlID0gPHNwYW4+e3RoaXMucHJvcHMuZXJyb3JNZXNzYWdlfTwvc3Bhbj47XG4gICAgICBlbGVtZW50Q2xhc3MgPSAncm93IGZvcm0tZ3JvdXAgaGFzLWVycm9yJztcbiAgICB9XG5cbiAgICBjb25zdCBuZXdPcHRpb25zID0ge307XG4gICAgbGV0IG9wdGlvbkxpc3QgPSBbXTtcbiAgICBpZiAoc29ydEJ5VmFsdWUpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIG5ld09wdGlvbnNbb3B0aW9uc1trZXldXSA9IGtleTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgb3B0aW9uTGlzdCA9IE9iamVjdC5rZXlzKG5ld09wdGlvbnMpLnNvcnQoKS5tYXAoZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT17bmV3T3B0aW9uc1tvcHRpb25dfSBrZXk9e25ld09wdGlvbnNbb3B0aW9uXX0+e29wdGlvbn08L29wdGlvbj5cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25MaXN0ID0gT2JqZWN0LmtleXMob3B0aW9ucykubWFwKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9e29wdGlvbn0ga2V5PXtvcHRpb259PntvcHRpb25zW29wdGlvbl19PC9vcHRpb24+XG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBEZWZhdWx0IHRvIGVtcHR5IHN0cmluZyBmb3IgcmVndWxhciBzZWxlY3QgYW5kIHRvIGVtcHR5IGFycmF5IGZvciAnbXVsdGlwbGUnIHNlbGVjdFxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5wcm9wcy52YWx1ZSB8fCAobXVsdGlwbGUgPyBbXSA6ICcnKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17ZWxlbWVudENsYXNzfT5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC1zbS0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPXt0aGlzLnByb3BzLmxhYmVsfT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5sYWJlbH1cbiAgICAgICAgICB7cmVxdWlyZWRIVE1MfVxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS05XCI+XG4gICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICAgICAgbXVsdGlwbGU9e211bHRpcGxlfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgIGlkPXt0aGlzLnByb3BzLmlkfVxuICAgICAgICAgICAgdmFsdWU9e3ZhbHVlfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgcmVxdWlyZWQ9e3JlcXVpcmVkfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtlbXB0eU9wdGlvbkhUTUx9XG4gICAgICAgICAgICB7b3B0aW9uTGlzdH1cbiAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICB7ZXJyb3JNZXNzYWdlfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuU2VsZWN0RWxlbWVudC5wcm9wVHlwZXMgPSB7XG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgb3B0aW9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdmFsdWU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgUHJvcFR5cGVzLmFycmF5LFxuICBdKSxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNsYXNzOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBtdWx0aXBsZTogUHJvcFR5cGVzLmJvb2wsXG4gIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgcmVxdWlyZWQ6IFByb3BUeXBlcy5ib29sLFxuICBlbXB0eU9wdGlvbjogUHJvcFR5cGVzLmJvb2wsXG4gIGhhc0Vycm9yOiBQcm9wVHlwZXMuYm9vbCxcbiAgZXJyb3JNZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBvblVzZXJJbnB1dDogUHJvcFR5cGVzLmZ1bmMsXG59O1xuXG5TZWxlY3RFbGVtZW50LmRlZmF1bHRQcm9wcyA9IHtcbiAgbmFtZTogJycsXG4gIG9wdGlvbnM6IHt9LFxuICBsYWJlbDogJycsXG4gIHZhbHVlOiB1bmRlZmluZWQsXG4gIGlkOiBudWxsLFxuICBjbGFzczogJycsXG4gIG11bHRpcGxlOiBmYWxzZSxcbiAgZGlzYWJsZWQ6IGZhbHNlLFxuICByZXF1aXJlZDogZmFsc2UsXG4gIHNvcnRCeVZhbHVlOiB0cnVlLFxuICBlbXB0eU9wdGlvbjogdHJ1ZSxcbiAgaGFzRXJyb3I6IGZhbHNlLFxuICBlcnJvck1lc3NhZ2U6ICdUaGUgZmllbGQgaXMgcmVxdWlyZWQhJyxcbiAgb25Vc2VySW5wdXQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUud2Fybignb25Vc2VySW5wdXQoKSBjYWxsYmFjayBpcyBub3Qgc2V0Jyk7XG4gIH0sXG59O1xuXG4vKipcbiAqIFRhZ3MgQ29tcG9uZW50XG4gKiBBbGxvd3MgZm9yIG11bHRpcGxlIHZhbHVlcyB0byBiZSBlbnRlcmVkIGZvciBhIHNpbmdsZSBmaWVsZFxuICpcbiAqIENvbWVzIGluIDMgZmxhdm9yczpcbiAqIDE6IElmIG9wdGlvbnMgYXJlIHBhc3NlZCBhbmQgdXNlU2VhcmNoID0gdHJ1ZVxuICogICAgaW5wdXQgZmllbGQgaXMgcmVuZGVyZWQgYXMgYSBzZWFyY2hhYmxlIGRyb3Bkb3duXG4gKiAyOiBJZiBvbmx5IG9wdGlvbnMgYXJlIHBhc3NlZCwgaW5wdXQgaXMgcmVuZGVyZWQgYXNcbiAqICAgIGEgbm9ybWFsIGRyb3Bkb3duIHNlbGVjdFxuICogMzogV2l0aG91dCBvcHRpb25zLCBpbnB1dCBpcyBhIG5vcm1hbCwgZnJlZSB0ZXh0IGlucHV0XG4gKi9cblxuY2xhc3MgVGFnc0VsZW1lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVLZXlQcmVzcyA9IHRoaXMuaGFuZGxlS2V5UHJlc3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUFkZCA9IHRoaXMuaGFuZGxlQWRkLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVSZW1vdmUgPSB0aGlzLmhhbmRsZVJlbW92ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0S2V5RnJvbVZhbHVlID0gdGhpcy5nZXRLZXlGcm9tVmFsdWUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNhbkFkZEl0ZW0gPSB0aGlzLmNhbkFkZEl0ZW0uYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8vIHBlbmRpbmdWYWxLZXkgaXMgdGhlIHBsYWNlaG9sZGVyIHZhcmlhYmxlIGZvciB0ZW1wb3JhcmlseSBzdG9yaW5nXG4gIC8vIHR5cGVkIG9yIHNlbGVjdGVkIGl0ZW1zIGJlZm9yZSBhZGRpbmcgdGhlbSB0byB0aGUgVGFnc1xuICBoYW5kbGVDaGFuZ2UoZSkge1xuICAgIHRoaXMucHJvcHMub25Vc2VySW5wdXQodGhpcy5wcm9wcy5wZW5kaW5nVmFsS2V5LCBlLnRhcmdldC52YWx1ZSk7XG4gIH1cbiAgLy8gYWxzbyBhZGQgdGFncyBpZiBlbnRlciBrZXkgaXMgaGl0IHdpdGhpbiBpbnB1dCBmaWVsZFxuICBoYW5kbGVLZXlQcmVzcyhlKSB7XG4gICAgaWYgKGUua2V5Q29kZSA9PT0gMTMgfHwgZS53aGljaCA9PT0gMTMpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuaGFuZGxlQWRkKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gc2VuZCBwZW5kaW5nVmFsS2V5IGFzIGFuIGFyZ3VtZW50IGluIG9yZGVyIHRvIG51bGwgb3V0IGVudGVyZWQgaXRlbVxuICBoYW5kbGVBZGQoKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMucHJvcHMub3B0aW9ucztcbiAgICBsZXQgdmFsdWUgPSB0aGlzLnByb3BzLnZhbHVlO1xuICAgIC8vIGlmIHVzaW5nIGEgZGF0YWxpc3QgKHNlYXJjaCksIHNldCB2YWx1ZSB0byBiZSB0aGUga2V5IGluIG9wdGlvbnNcbiAgICBpZiAodGhpcy5wcm9wcy51c2VTZWFyY2ggJiYgT2JqZWN0LnZhbHVlcyhvcHRpb25zKS5pbmRleE9mKHZhbHVlKSA+IC0xKSB7XG4gICAgICB2YWx1ZSA9IHRoaXMuZ2V0S2V5RnJvbVZhbHVlKHZhbHVlKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY2FuQWRkSXRlbSh2YWx1ZSkpIHtcbiAgICAgIHRoaXMucHJvcHMub25Vc2VyQWRkKHRoaXMucHJvcHMubmFtZSwgdmFsdWUsIHRoaXMucHJvcHMucGVuZGluZ1ZhbEtleSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlUmVtb3ZlKGUpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pdGVtJyk7XG4gICAgdGhpcy5wcm9wcy5vblVzZXJSZW1vdmUodGhpcy5wcm9wcy5uYW1lLCB2YWx1ZSk7XG4gIH1cblxuICBnZXRLZXlGcm9tVmFsdWUodmFsdWUpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5wcm9wcy5vcHRpb25zO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhvcHRpb25zKS5maW5kKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvcHRpb25zW29dID09PSB2YWx1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIGhlbHBlciBmdW5jdGlvbiB0byBkZXRlY3QgaWYgaXRlbSBzaG91bGQgYmUgYWRkZWQgdG8gVGFnc1xuICBjYW5BZGRJdGVtKHZhbHVlKSB7XG4gICAgbGV0IHJlc3VsdCA9IHRydWU7XG4gICAgLy8gcmVqZWN0IGVtcHR5IHZhbHVlc1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgLy8gcmVqZWN0IGlmIGFsbG93RHVwbCBpcyBmYWxzZSBhbmQgaXRlbSBpcyBhbHJlYWR5IGluIGFycmF5XG4gICAgfSBlbHNlIGlmICghdGhpcy5wcm9wcy5hbGxvd0R1cGwgJiYgdGhpcy5wcm9wcy5pdGVtcy5pbmRleE9mKHZhbHVlKSA+IC0xKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIC8vIHJlamVjdCBpZiB1c2luZyBhIHN0cmljdCBkYXRhbGlzdCBhbmQgdmFsdWUgaXMgbm90IGluIG9wdGlvbnNcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMudXNlU2VhcmNoICYmXG4gICAgICB0aGlzLnByb3BzLnN0cmljdFNlYXJjaCAmJlxuICAgICAgT2JqZWN0LmtleXModGhpcy5wcm9wcy5vcHRpb25zKS5pbmRleE9mKHZhbHVlKSA9PT0gLTFcbiAgICApIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSB0aGlzLnByb3BzLmRpc2FibGVkID8gJ2Rpc2FibGVkJyA6IG51bGw7XG4gICAgbGV0IHJlcXVpcmVkSFRNTCA9IG51bGw7XG4gICAgbGV0IGVtcHR5T3B0aW9uSFRNTCA9IG51bGw7XG4gICAgbGV0IGVycm9yTWVzc2FnZSA9IG51bGw7XG4gICAgbGV0IGVsZW1lbnRDbGFzcyA9ICdyb3cgZm9ybS1ncm91cCc7XG4gICAgLy8gQWRkIHJlcXVpcmVkIGFzdGVyaXhcbiAgICBpZiAodGhpcy5wcm9wcy5yZXF1aXJlZCkge1xuICAgICAgcmVxdWlyZWRIVE1MID0gPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1kYW5nZXJcIj4qPC9zcGFuPjtcbiAgICB9XG5cbiAgICAvLyBBZGQgZW1wdHkgb3B0aW9uXG4gICAgaWYgKHRoaXMucHJvcHMuZW1wdHlPcHRpb24pIHtcbiAgICAgIGVtcHR5T3B0aW9uSFRNTCA9IDxvcHRpb24+PC9vcHRpb24+O1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmVycm9yTWVzc2FnZSkge1xuICAgICAgZXJyb3JNZXNzYWdlID0gPHNwYW4+e3RoaXMucHJvcHMuZXJyb3JNZXNzYWdlfTwvc3Bhbj47XG4gICAgICBlbGVtZW50Q2xhc3MgPSAncm93IGZvcm0tZ3JvdXAgaGFzLWVycm9yJztcbiAgICB9XG5cbiAgICBsZXQgaW5wdXQ7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMucHJvcHMub3B0aW9ucztcbiAgICAvLyBpZiBvcHRpb25zIGFyZSBnaXZlbiBhbmQgdXNlU2VhcmNoIGlzIHNwZWNpZmllZFxuICAgIGlmIChPYmplY3Qua2V5cyhvcHRpb25zKS5sZW5ndGggPiAwICYmIHRoaXMucHJvcHMudXNlU2VhcmNoKSB7XG4gICAgICBpbnB1dCA9IChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZX1cbiAgICAgICAgICAgIGlkPXt0aGlzLnByb3BzLmlkfVxuICAgICAgICAgICAgbGlzdD17dGhpcy5wcm9wcy5pZCArICdfbGlzdCd9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMudmFsdWUgfHwgJyd9XG4gICAgICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICBvbktleVByZXNzPXt0aGlzLmhhbmRsZUtleVByZXNzfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGRhdGFsaXN0IGlkPXt0aGlzLnByb3BzLmlkICsgJ19saXN0J30+XG4gICAgICAgICAgICB7T2JqZWN0LmtleXMob3B0aW9ucykubWFwKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e29wdGlvbnNbb3B0aW9uXX0ga2V5PXtvcHRpb259PlxuICAgICAgICAgICAgICAgICAge29wdGlvbnNbb3B0aW9uXX1cbiAgICAgICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgIDwvZGF0YWxpc3Q+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICAgIC8vIGlmIG9wdGlvbnMgYXJlIHByZXNlbnQgYnV0IHVzZVNlYXJjaCBpcyBmYWxzZSwgdXNlIG5vcm1hbCBkcm9wZG93blxuICAgIH0gZWxzZSBpZiAoT2JqZWN0LmtleXMob3B0aW9ucykubGVuZ3RoID4gMCkge1xuICAgICAgaW5wdXQgPSA8c2VsZWN0XG4gICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZX1cbiAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgaWQ9e3RoaXMucHJvcHMuaWR9XG4gICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnZhbHVlfVxuICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgb25LZXlQcmVzcz17dGhpcy5oYW5kbGVLZXlQcmVzc31cbiAgICAgID5cbiAgICAgICAge2VtcHR5T3B0aW9uSFRNTH1cbiAgICAgICAge09iamVjdC5rZXlzKG9wdGlvbnMpLm1hcChmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17b3B0aW9ufSBrZXk9e29wdGlvbn0+e29wdGlvbnNbb3B0aW9uXX08L29wdGlvbj5cbiAgICAgICAgICApO1xuICAgICAgICB9KX1cbiAgICAgIDwvc2VsZWN0PjtcbiAgICAgIC8vIGVsc2UsIHVzZSBhIHRleHQgaW5wdXQgYnkgZGVmYXVsdFxuICAgIH0gZWxzZSB7XG4gICAgICBpbnB1dCA9IDxpbnB1dFxuICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZX1cbiAgICAgICAgaWQ9e3RoaXMucHJvcHMuaWR9XG4gICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnZhbHVlIHx8ICcnfVxuICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgb25LZXlQcmVzcz17dGhpcy5oYW5kbGVLZXlQcmVzc31cbiAgICAgIC8+O1xuICAgIH1cblxuICAgIC8vIGl0ZXJhdGUgdGhyb3VnaCBhZGRlZCBUYWdzIGl0ZW1zIGFuZCByZW5kZXIgdGhlbVxuICAgIC8vIHdpdGggZGVsZXRpb24gYnV0dG9uXG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLnByb3BzLml0ZW1zLm1hcChmdW5jdGlvbihpdGVtKSB7XG4gICAgICBsZXQgaXRtVHh0O1xuICAgICAgLy8gaW4gZXZlbnQgdGhhdCB0aGUgcGFzc2VkIGl0ZW0gaXMgYSBrZXkgb2Ygb3B0aW9ucyxcbiAgICAgIC8vIHJlbmRlciBvcHRpb24gdmFsdWVcbiAgICAgIGlmIChPYmplY3Qua2V5cyhvcHRpb25zKS5sZW5ndGggPiAwICYmIG9wdGlvbnNbaXRlbV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpdG1UeHQgPSBvcHRpb25zW2l0ZW1dO1xuICAgICAgICAvLyBvdGhlcndpc2UganVzdCByZW5kZXIgaXRlbSBhcyBpc1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXRtVHh0ID0gaXRlbTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLWluZm8gYnRuLWlubGluZVwiXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVSZW1vdmV9XG4gICAgICAgICAgZGF0YS1pdGVtPXtpdGVtfVxuICAgICAgICA+XG4gICAgICAgICAge2l0bVR4dH1cbiAgICAgICAgICAmbmJzcDtcbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1yZW1vdmVcIlxuICAgICAgICAgICAgZGF0YS1pdGVtPXtpdGVtfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgKTtcbiAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2VsZW1lbnRDbGFzc30+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wtc20tMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj17dGhpcy5wcm9wcy5pZH0+XG4gICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgICAge3JlcXVpcmVkSFRNTH1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOVwiPlxuICAgICAgICAgIHtpdGVtc31cbiAgICAgICAgICB7aW5wdXR9XG4gICAgICAgICAge2Vycm9yTWVzc2FnZX1cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXN1Y2Nlc3MgYnRuLWFkZC10YWdcIlxuICAgICAgICAgICAgaWQ9e3RoaXMucHJvcHMuaWQgKyAnQWRkJ31cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVBZGR9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1wbHVzXCIvPlxuICAgICAgICAgICAge3RoaXMucHJvcHMuYnRuTGFiZWx9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5UYWdzRWxlbWVudC5wcm9wVHlwZXMgPSB7XG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgcGVuZGluZ1ZhbEtleTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBvcHRpb25zOiBQcm9wVHlwZXMub2JqZWN0LFxuICBpdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdmFsdWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNsYXNzOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBtdWx0aXBsZTogUHJvcFR5cGVzLmJvb2wsXG4gIHJlcXVpcmVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICBlbXB0eU9wdGlvbjogUHJvcFR5cGVzLmJvb2wsXG4gIGVycm9yTWVzc2FnZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgYnRuTGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGFsbG93RHVwbDogUHJvcFR5cGVzLmJvb2wsXG4gIHVzZVNlYXJjaDogUHJvcFR5cGVzLmJvb2wsXG4gIHN0cmljdFNlYXJjaDogUHJvcFR5cGVzLmJvb2wsXG4gIG9uVXNlcklucHV0OiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Vc2VyQWRkOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Vc2VyUmVtb3ZlOiBQcm9wVHlwZXMuZnVuYyxcbn07XG5cblRhZ3NFbGVtZW50LmRlZmF1bHRQcm9wcyA9IHtcbiAgbmFtZTogJycsXG4gIG9wdGlvbnM6IHt9LFxuICBpdGVtczogW10sXG4gIGxhYmVsOiAnJyxcbiAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgaWQ6IG51bGwsXG4gIGNsYXNzOiAnJyxcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICBkaXNhYmxlZDogZmFsc2UsXG4gIGVtcHR5T3B0aW9uOiB0cnVlLFxuICBoYXNFcnJvcjogZmFsc2UsXG4gIGFsbG93RHVwbDogZmFsc2UsXG4gIHVzZVNlYXJjaDogZmFsc2UsXG4gIHN0cmljdFNlYXJjaDogZmFsc2UsIC8vIG9ubHkgYWNjZXB0IGl0ZW1zIHNwZWNpZmllZCBpbiBvcHRpb25zXG4gIGVycm9yTWVzc2FnZTogJycsXG4gIHBlbmRpbmdWYWxLZXk6ICcnLFxuICBidG5MYWJlbDogJ0FkZCBUYWcnLFxuICBvblVzZXJJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVzZXJJbnB1dCgpIGNhbGxiYWNrIGlzIG5vdCBzZXQnKTtcbiAgfSxcbiAgb25Vc2VyQWRkOiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uVXNlckFkZCgpIGNhbGxiYWNrIGlzIG5vdCBzZXQnKTtcbiAgfSxcbiAgb25Vc2VyUmVtb3ZlOiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uVXNlclJlbW92ZSgpIGNhbGxiYWNrIGlzIG5vdCBzZXQnKTtcbiAgfSxcbn07XG5cbi8qKlxuICogVGV4dGFyZWEgQ29tcG9uZW50XG4gKiBSZWFjdCB3cmFwcGVyIGZvciBhIDx0ZXh0YXJlYT4gZWxlbWVudC5cbiAqL1xuY2xhc3MgVGV4dGFyZWFFbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGUpIHtcbiAgICB0aGlzLnByb3BzLm9uVXNlcklucHV0KHRoaXMucHJvcHMubmFtZSwgZS50YXJnZXQudmFsdWUpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGRpc2FibGVkID0gdGhpcy5wcm9wcy5kaXNhYmxlZCA/ICdkaXNhYmxlZCcgOiBudWxsO1xuICAgIGNvbnN0IHJlcXVpcmVkID0gdGhpcy5wcm9wcy5yZXF1aXJlZCA/ICdyZXF1aXJlZCcgOiBudWxsO1xuICAgIGxldCByZXF1aXJlZEhUTUwgPSBudWxsO1xuXG4gICAgLy8gQWRkIHJlcXVpcmVkIGFzdGVyaXhcbiAgICBpZiAocmVxdWlyZWQpIHtcbiAgICAgIHJlcXVpcmVkSFRNTCA9IDxzcGFuIGNsYXNzTmFtZT1cInRleHQtZGFuZ2VyXCI+Kjwvc3Bhbj47XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGZvcm0tZ3JvdXBcIj5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC1zbS0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPXt0aGlzLnByb3BzLmlkfT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5sYWJlbH1cbiAgICAgICAgICB7cmVxdWlyZWRIVE1MfVxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS05XCI+XG4gICAgICAgICAgPHRleHRhcmVhXG4gICAgICAgICAgICBjb2xzPXt0aGlzLnByb3BzLmNvbHN9XG4gICAgICAgICAgICByb3dzPXt0aGlzLnByb3BzLnJvd3N9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICAgICAgaWQ9e3RoaXMucHJvcHMuaWR9XG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZSB8fCAnJ31cbiAgICAgICAgICAgIHJlcXVpcmVkPXtyZXF1aXJlZH1cbiAgICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICA+XG4gICAgICAgICAgPC90ZXh0YXJlYT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cblRleHRhcmVhRWxlbWVudC5wcm9wVHlwZXMgPSB7XG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICByZXF1aXJlZDogUHJvcFR5cGVzLmJvb2wsXG4gIHJvd3M6IFByb3BUeXBlcy5udW1iZXIsXG4gIGNvbHM6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9uVXNlcklucHV0OiBQcm9wVHlwZXMuZnVuYyxcbn07XG5cblRleHRhcmVhRWxlbWVudC5kZWZhdWx0UHJvcHMgPSB7XG4gIG5hbWU6ICcnLFxuICBsYWJlbDogJycsXG4gIHZhbHVlOiAnJyxcbiAgaWQ6IG51bGwsXG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICByb3dzOiA0LFxuICBjb2xzOiAyNSxcbiAgb25Vc2VySW5wdXQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUud2Fybignb25Vc2VySW5wdXQoKSBjYWxsYmFjayBpcyBub3Qgc2V0Jyk7XG4gIH0sXG59O1xuXG4vKipcbiAqIFRleHRib3ggQ29tcG9uZW50XG4gKiBSZWFjdCB3cmFwcGVyIGZvciBhIDxpbnB1dCB0eXBlPVwidGV4dFwiPiBlbGVtZW50LlxuICovXG5jbGFzcyBUZXh0Ym94RWxlbWVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUJsdXIgPSB0aGlzLmhhbmRsZUJsdXIuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShlKSB7XG4gICAgdGhpcy5wcm9wcy5vblVzZXJJbnB1dCh0aGlzLnByb3BzLm5hbWUsIGUudGFyZ2V0LnZhbHVlLCBlLnRhcmdldC5pZCwgJ3RleHRib3gnKTtcbiAgfVxuXG4gIGhhbmRsZUJsdXIoZSkge1xuICAgIHRoaXMucHJvcHMub25Vc2VyQmx1cih0aGlzLnByb3BzLm5hbWUsIGUudGFyZ2V0LnZhbHVlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IHRoaXMucHJvcHMuZGlzYWJsZWQgPyAnZGlzYWJsZWQnIDogbnVsbDtcbiAgICBjb25zdCByZXF1aXJlZCA9IHRoaXMucHJvcHMucmVxdWlyZWQgPyAncmVxdWlyZWQnIDogbnVsbDtcbiAgICBsZXQgZXJyb3JNZXNzYWdlID0gbnVsbDtcbiAgICBsZXQgcmVxdWlyZWRIVE1MID0gbnVsbDtcbiAgICBsZXQgZWxlbWVudENsYXNzID0gJ3JvdyBmb3JtLWdyb3VwJztcblxuICAgIC8vIEFkZCByZXF1aXJlZCBhc3Rlcml4XG4gICAgaWYgKHJlcXVpcmVkKSB7XG4gICAgICByZXF1aXJlZEhUTUwgPSA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWRhbmdlclwiPio8L3NwYW4+O1xuICAgIH1cblxuICAgIC8vIEFkZCBlcnJvciBtZXNzYWdlXG4gICAgaWYgKHRoaXMucHJvcHMuZXJyb3JNZXNzYWdlKSB7XG4gICAgICBlcnJvck1lc3NhZ2UgPSA8c3Bhbj57dGhpcy5wcm9wcy5lcnJvck1lc3NhZ2V9PC9zcGFuPjtcbiAgICAgIGVsZW1lbnRDbGFzcyA9ICdyb3cgZm9ybS1ncm91cCBoYXMtZXJyb3InO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17ZWxlbWVudENsYXNzfT5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC1zbS0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPXt0aGlzLnByb3BzLmlkfT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5sYWJlbH1cbiAgICAgICAgICB7cmVxdWlyZWRIVE1MfVxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS05XCI+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICAgICAgaWQ9e3RoaXMucHJvcHMuaWR9XG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZSB8fCAnJ31cbiAgICAgICAgICAgIHJlcXVpcmVkPXtyZXF1aXJlZH1cbiAgICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgIG9uQmx1cj17dGhpcy5oYW5kbGVCbHVyfVxuICAgICAgICAgIC8+XG4gICAgICAgICAge2Vycm9yTWVzc2FnZX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cblRleHRib3hFbGVtZW50LnByb3BUeXBlcyA9IHtcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdmFsdWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIHJlcXVpcmVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgZXJyb3JNZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBvblVzZXJJbnB1dDogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uVXNlckJsdXI6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuVGV4dGJveEVsZW1lbnQuZGVmYXVsdFByb3BzID0ge1xuICBuYW1lOiAnJyxcbiAgbGFiZWw6ICcnLFxuICB2YWx1ZTogJycsXG4gIGlkOiBudWxsLFxuICBkaXNhYmxlZDogZmFsc2UsXG4gIHJlcXVpcmVkOiBmYWxzZSxcbiAgZXJyb3JNZXNzYWdlOiAnJyxcbiAgb25Vc2VySW5wdXQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUud2Fybignb25Vc2VySW5wdXQoKSBjYWxsYmFjayBpcyBub3Qgc2V0Jyk7XG4gIH0sXG4gIG9uVXNlckJsdXI6IGZ1bmN0aW9uKCkge1xuICB9LFxufTtcblxuLyoqXG4gKiBEYXRlIENvbXBvbmVudFxuICogUmVhY3Qgd3JhcHBlciBmb3IgYSA8aW5wdXQgdHlwZT1cImRhdGVcIj4gZWxlbWVudC5cbiAqL1xuY2xhc3MgRGF0ZUVsZW1lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZSkge1xuICAgIHRoaXMucHJvcHMub25Vc2VySW5wdXQodGhpcy5wcm9wcy5uYW1lLCBlLnRhcmdldC52YWx1ZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSB0aGlzLnByb3BzLmRpc2FibGVkID8gJ2Rpc2FibGVkJyA6IG51bGw7XG4gICAgY29uc3QgcmVxdWlyZWQgPSB0aGlzLnByb3BzLnJlcXVpcmVkID8gJ3JlcXVpcmVkJyA6IG51bGw7XG4gICAgbGV0IHJlcXVpcmVkSFRNTCA9IG51bGw7XG5cbiAgICAvLyBBZGQgcmVxdWlyZWQgYXN0ZXJpeFxuICAgIGlmIChyZXF1aXJlZCkge1xuICAgICAgcmVxdWlyZWRIVE1MID0gPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1kYW5nZXJcIj4qPC9zcGFuPjtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZm9ybS1ncm91cFwiPlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9e3RoaXMucHJvcHMubGFiZWx9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgICAgIHtyZXF1aXJlZEhUTUx9XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTlcIj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJkYXRlXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgICAgICBpZD17dGhpcy5wcm9wcy5pZH1cbiAgICAgICAgICAgIG1pbj17dGhpcy5wcm9wcy5taW5ZZWFyfVxuICAgICAgICAgICAgbWF4PXt0aGlzLnByb3BzLm1heFllYXJ9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZSB8fCAnJ31cbiAgICAgICAgICAgIHJlcXVpcmVkPXtyZXF1aXJlZH1cbiAgICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuRGF0ZUVsZW1lbnQucHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB2YWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG1heFllYXI6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG1pblllYXI6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgcmVxdWlyZWQ6IFByb3BUeXBlcy5ib29sLFxuICBvblVzZXJJbnB1dDogUHJvcFR5cGVzLmZ1bmMsXG59O1xuXG5EYXRlRWxlbWVudC5kZWZhdWx0UHJvcHMgPSB7XG4gIG5hbWU6ICcnLFxuICBsYWJlbDogJycsXG4gIHZhbHVlOiAnJyxcbiAgaWQ6IG51bGwsXG4gIG1heFllYXI6ICc5OTk5LTEyLTMxJyxcbiAgbWluWWVhcjogJzEwMDAtMDEtMDEnLFxuICBkaXNhYmxlZDogZmFsc2UsXG4gIHJlcXVpcmVkOiBmYWxzZSxcbiAgb25Vc2VySW5wdXQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUud2Fybignb25Vc2VySW5wdXQoKSBjYWxsYmFjayBpcyBub3Qgc2V0Jyk7XG4gIH0sXG59O1xuXG4vKipcbiAqIFRpbWUgQ29tcG9uZW50XG4gKiBSZWFjdCB3cmFwcGVyIGZvciBhIDxpbnB1dCB0eXBlPVwidGltZVwiPiBlbGVtZW50LlxuICovXG5jbGFzcyBUaW1lRWxlbWVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGUpIHtcbiAgICB0aGlzLnByb3BzLm9uVXNlcklucHV0KHRoaXMucHJvcHMubmFtZSwgZS50YXJnZXQudmFsdWUpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGRpc2FibGVkID0gdGhpcy5wcm9wcy5kaXNhYmxlZCA/ICdkaXNhYmxlZCcgOiBudWxsO1xuICAgIGNvbnN0IHJlcXVpcmVkID0gdGhpcy5wcm9wcy5yZXF1aXJlZCA/ICdyZXF1aXJlZCcgOiBudWxsO1xuICAgIGxldCByZXF1aXJlZEhUTUwgPSBudWxsO1xuXG4gICAgLy8gQWRkIHJlcXVpcmVkIGFzdGVyaXhcbiAgICBpZiAocmVxdWlyZWQpIHtcbiAgICAgIHJlcXVpcmVkSFRNTCA9IDxzcGFuIGNsYXNzTmFtZT1cInRleHQtZGFuZ2VyXCI+Kjwvc3Bhbj47XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGZvcm0tZ3JvdXBcIj5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC1zbS0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPXt0aGlzLnByb3BzLmxhYmVsfT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5sYWJlbH1cbiAgICAgICAgICB7cmVxdWlyZWRIVE1MfVxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS05XCI+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0eXBlPVwidGltZVwiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICAgICAgaWQ9e3RoaXMucHJvcHMuaWR9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZSB8fCAnJ31cbiAgICAgICAgICAgIHJlcXVpcmVkPXtyZXF1aXJlZH1cbiAgICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgICAgIHBhdHRlcm49XCIoWzAtMV1bMC05XXwyWzAtNF18WzEtOV0pOihbMC01XVswLTldKSg6KFswLTVdWzAtOV0pKT9cIlxuICAgICAgICAgICAgdGl0bGU9XCJJbnB1dCBtdXN0IGJlIGluIG9uZSBvZiB0aGUgZm9sbG93aW5nIGZvcm1hdHM6IEhIOk1NIG9yIEhIOk1NOlNTXCJcbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuVGltZUVsZW1lbnQucHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB2YWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgcmVxdWlyZWQ6IFByb3BUeXBlcy5ib29sLFxuICBvblVzZXJJbnB1dDogUHJvcFR5cGVzLmZ1bmMsXG59O1xuXG5UaW1lRWxlbWVudC5kZWZhdWx0UHJvcHMgPSB7XG4gIG5hbWU6ICcnLFxuICBsYWJlbDogJycsXG4gIHZhbHVlOiAnJyxcbiAgaWQ6ICcnLFxuICBkaXNhYmxlZDogZmFsc2UsXG4gIHJlcXVpcmVkOiBmYWxzZSxcbiAgb25Vc2VySW5wdXQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUud2Fybignb25Vc2VySW5wdXQoKSBjYWxsYmFjayBpcyBub3Qgc2V0Jyk7XG4gIH0sXG59O1xuXG4vKipcbiAqIE51bWVyaWMgQ29tcG9uZW50XG4gKiBSZWFjdCB3cmFwcGVyIGZvciBhIDxpbnB1dCB0eXBlPVwibnVtYmVyXCI+IGVsZW1lbnQuXG4gKi9cbmNsYXNzIE51bWVyaWNFbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGUpIHtcbiAgICB0aGlzLnByb3BzLm9uVXNlcklucHV0KHRoaXMucHJvcHMubmFtZSwgZS50YXJnZXQudmFsdWUpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGRpc2FibGVkID0gdGhpcy5wcm9wcy5kaXNhYmxlZCA/ICdkaXNhYmxlZCcgOiBudWxsO1xuICAgIGNvbnN0IHJlcXVpcmVkID0gdGhpcy5wcm9wcy5yZXF1aXJlZCA/ICdyZXF1aXJlZCcgOiBudWxsO1xuICAgIGNvbnN0IHJlcXVpcmVkSFRNTCA9IG51bGw7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZm9ybS1ncm91cFwiPlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9e3RoaXMucHJvcHMuaWR9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgICAgIHtyZXF1aXJlZEhUTUx9XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTlcIj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZX1cbiAgICAgICAgICAgIGlkPXt0aGlzLnByb3BzLmlkfVxuICAgICAgICAgICAgbWluPXt0aGlzLnByb3BzLm1pbn1cbiAgICAgICAgICAgIG1heD17dGhpcy5wcm9wcy5tYXh9XG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZX1cbiAgICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgICAgIHJlcXVpcmVkPXtyZXF1aXJlZH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuTnVtZXJpY0VsZW1lbnQucHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIG1pbjogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBtYXg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICByZXF1aXJlZDogUHJvcFR5cGVzLmJvb2wsXG4gIG9uVXNlcklucHV0OiBQcm9wVHlwZXMuZnVuYyxcbn07XG5cbk51bWVyaWNFbGVtZW50LmRlZmF1bHRQcm9wcyA9IHtcbiAgbmFtZTogJycsXG4gIG1pbjogbnVsbCxcbiAgbWF4OiBudWxsLFxuICBsYWJlbDogJycsXG4gIHZhbHVlOiAnJyxcbiAgaWQ6IG51bGwsXG4gIHJlcXVpcmVkOiBmYWxzZSxcbiAgZGlzYWJsZWQ6IGZhbHNlLFxuICBvblVzZXJJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVzZXJJbnB1dCgpIGNhbGxiYWNrIGlzIG5vdCBzZXQnKTtcbiAgfSxcbn07XG5cbi8qKlxuICogRmlsZSBDb21wb25lbnRcbiAqIFJlYWN0IHdyYXBwZXIgZm9yIGEgc2ltcGxlIG9yICdtdWx0aXBsZScgPHNlbGVjdD4gZWxlbWVudC5cbiAqL1xuY2xhc3MgRmlsZUVsZW1lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZSkge1xuICAgIC8vIFNlbmQgY3VycmVudCBmaWxlIHRvIHBhcmVudCBjb21wb25lbnRcbiAgICBjb25zdCBmaWxlID0gZS50YXJnZXQuZmlsZXNbMF0gPyBlLnRhcmdldC5maWxlc1swXSA6ICcnO1xuICAgIHRoaXMucHJvcHMub25Vc2VySW5wdXQodGhpcy5wcm9wcy5uYW1lLCBmaWxlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCByZXF1aXJlZCA9IHRoaXMucHJvcHMucmVxdWlyZWQgPyAncmVxdWlyZWQnIDogbnVsbDtcbiAgICBjb25zdCBmaWxlTmFtZSA9IHRoaXMucHJvcHMudmFsdWUgPyB0aGlzLnByb3BzLnZhbHVlLm5hbWUgOiB1bmRlZmluZWQ7XG4gICAgbGV0IHJlcXVpcmVkSFRNTCA9IG51bGw7XG4gICAgbGV0IGVycm9yTWVzc2FnZSA9ICcnO1xuICAgIGxldCBlbGVtZW50Q2xhc3MgPSAncm93IGZvcm0tZ3JvdXAnO1xuXG4gICAgLy8gQWRkIHJlcXVpcmVkIGFzdGVyaXhcbiAgICBpZiAocmVxdWlyZWQpIHtcbiAgICAgIHJlcXVpcmVkSFRNTCA9IDxzcGFuIGNsYXNzTmFtZT1cInRleHQtZGFuZ2VyXCI+Kjwvc3Bhbj47XG4gICAgfVxuXG4gICAgY29uc3QgdHJ1bmNhdGVFbGxpcHNpcyA9IHtcbiAgICAgIGRpc3BsYXk6ICd0YWJsZScsXG4gICAgICB0YWJsZUxheW91dDogJ2ZpeGVkJyxcbiAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICB3aGl0ZVNwYWNlOiAnbm93cmFwJyxcbiAgICB9O1xuXG4gICAgY29uc3QgdHJ1bmNhdGVFbGxpcHNpc0NoaWxkID0ge1xuICAgICAgZGlzcGxheTogJ3RhYmxlLWNlbGwnLFxuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgdGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnLFxuICAgIH07XG5cbiAgICAvLyBBZGQgZXJyb3IgbWVzc2FnZVxuICAgIGlmICh0aGlzLnByb3BzLmhhc0Vycm9yKSB7XG4gICAgICBlcnJvck1lc3NhZ2UgPSB0aGlzLnByb3BzLmVycm9yTWVzc2FnZTtcbiAgICAgIGVsZW1lbnRDbGFzcyA9ICdyb3cgZm9ybS1ncm91cCBoYXMtZXJyb3InO1xuICAgIH1cblxuICAgIC8vIE5lZWQgdG8gbWFudWFsbHkgcmVzZXQgZmlsZSB2YWx1ZSwgYmVjYXVzZSBIVE1MIEFQSVxuICAgIC8vIGRvZXMgbm90IGFsbG93IHNldHRpbmcgdmFsdWUgdG8gYW55dGhpbmcgdGhhbiBlbXB0eSBzdHJpbmcuXG4gICAgLy8gSGVuY2UgY2FuJ3QgdXNlIHZhbHVlIGF0dHJpYnV0ZSBpbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICBjb25zdCBmaWxlSFRNTCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5maWxlVXBsb2FkJyk7XG4gICAgaWYgKGZpbGVIVE1MICYmICFmaWxlTmFtZSkge1xuICAgICAgZmlsZUhUTUwudmFsdWUgPSAnJztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5kaXNhYmxlZCkge1xuICAgICAgLy8gYWRkIHBhZGRpbmcgdG8gYWxpZ24gdmlkZW8gdGl0bGUgb24gZGlzYWJsZWQgZmllbGRcbiAgICAgIHRydW5jYXRlRWxsaXBzaXMucGFkZGluZ1RvcCA9ICc3cHgnO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2VsZW1lbnRDbGFzc30+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC1zbS0zIGNvbnRyb2wtbGFiZWxcIj5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOVwiPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17dHJ1bmNhdGVFbGxpcHNpc30+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt0cnVuY2F0ZUVsbGlwc2lzQ2hpbGR9PntmaWxlTmFtZX08L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17ZWxlbWVudENsYXNzfT5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC1zbS0zIGNvbnRyb2wtbGFiZWxcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5sYWJlbH1cbiAgICAgICAgICB7cmVxdWlyZWRIVE1MfVxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS05XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1ncm91cFwiPlxuICAgICAgICAgICAgPGRpdiB0YWJJbmRleD1cIi0xXCIgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sIGZpbGUtY2FwdGlvbiBrdi1maWxlaW5wdXQtY2FwdGlvblwiPlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0cnVuY2F0ZUVsbGlwc2lzfT5cbiAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17dHJ1bmNhdGVFbGxpcHNpc0NoaWxkfT57ZmlsZU5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWxlLWNhcHRpb24tbmFtZVwiIGlkPVwidmlkZW9fZmlsZVwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwLWJ0blwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBidG4tZmlsZVwiPlxuICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImdseXBoaWNvbiBnbHlwaGljb24tZm9sZGVyLW9wZW5cIj48L2k+IEJyb3dzZVxuICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmlsZVVwbG9hZFwiXG4gICAgICAgICAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICByZXF1aXJlZD17cmVxdWlyZWR9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8c3Bhbj57ZXJyb3JNZXNzYWdlfTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkZpbGVFbGVtZW50LnByb3BUeXBlcyA9IHtcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdmFsdWU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgUHJvcFR5cGVzLm9iamVjdCxcbiAgXSksXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIHJlcXVpcmVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgaGFzRXJyb3I6IFByb3BUeXBlcy5ib29sLFxuICBlcnJvck1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG9uVXNlcklucHV0OiBQcm9wVHlwZXMuZnVuYyxcbn07XG5cbkZpbGVFbGVtZW50LmRlZmF1bHRQcm9wcyA9IHtcbiAgbmFtZTogJycsXG4gIGxhYmVsOiAnRmlsZSB0byBVcGxvYWQnLFxuICB2YWx1ZTogJycsXG4gIGlkOiBudWxsLFxuICBkaXNhYmxlZDogZmFsc2UsXG4gIHJlcXVpcmVkOiBmYWxzZSxcbiAgaGFzRXJyb3I6IGZhbHNlLFxuICBlcnJvck1lc3NhZ2U6ICdUaGUgZmllbGQgaXMgcmVxdWlyZWQhJyxcbiAgb25Vc2VySW5wdXQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUud2Fybignb25Vc2VySW5wdXQoKSBjYWxsYmFjayBpcyBub3Qgc2V0Jyk7XG4gIH0sXG59O1xuXG4vKipcbiAqIFN0YXRpYyBlbGVtZW50IGNvbXBvbmVudC5cbiAqIFVzZWQgdG8gZGlzcGxheXMgcGxhaW4vZm9ybWF0dGVkIHRleHQgYXMgcGFydCBvZiBhIGZvcm1cbiAqXG4gKiBUbyBwYXNzIGEgZm9ybWF0dGVkIHRleHQsIHlvdSBuZWVkIHRvIHdyYXAgaXQgaW4gYSBzaW5nbGUgcGFyZW50IGVsZW1lbnQuXG4gKiBFeGFtcGxlIHVzYWdlOlxuICpcbiAqIGBgYFxuICogbGV0IG15VGV4dCA9ICg8c3Bhbj5UaGlzIGlzIG15IDxiPnRleHQ8L2I+PC9zcGFuPik7XG4gKiA8U3RhdGljRWxlbWVudFxuICogICAgdGV4dD17bXlUZXh0fVxuICogICAgbGFiZWw9e25vdGV9XG4gKiAvPlxuICogYGBgXG4gKi9cbmNsYXNzIFN0YXRpY0VsZW1lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGZvcm0tZ3JvdXBcIj5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC1zbS0zIGNvbnRyb2wtbGFiZWxcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5sYWJlbH1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOVwiPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbC1zdGF0aWNcIj57dGhpcy5wcm9wcy50ZXh0fTwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cblN0YXRpY0VsZW1lbnQucHJvcFR5cGVzID0ge1xuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdGV4dDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICBQcm9wVHlwZXMuZWxlbWVudCxcbiAgXSksXG59O1xuXG5TdGF0aWNFbGVtZW50LmRlZmF1bHRQcm9wcyA9IHtcbiAgbGFiZWw6ICcnLFxuICB0ZXh0OiBudWxsLFxufTtcblxuLyoqXG4gKiBMaW5rIGVsZW1lbnQgY29tcG9uZW50LlxuICogVXNlZCB0byBsaW5rIHBsYWluL2Zvcm1hdGVkIHRleHQgdG8gYW4gaHJlZiBkZXN0aW5hdGlvbiBhcyBwYXJ0IG9mIGEgZm9ybVxuICovXG5jbGFzcyBMaW5rRWxlbWVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBmb3JtLWdyb3VwXCI+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wtc20tMyBjb250cm9sLWxhYmVsXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTlcIj5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2wtc3RhdGljXCI+XG4gICAgICAgICAgICA8YSBocmVmPXt0aGlzLnByb3BzLmhyZWZ9Pnt0aGlzLnByb3BzLnRleHR9PC9hPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkxpbmtFbGVtZW50LnByb3BUeXBlcyA9IHtcbiAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHRleHQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgUHJvcFR5cGVzLmVsZW1lbnQsXG4gIF0pLFxuICBocmVmOiBQcm9wVHlwZXMuc3RyaW5nLFxufTtcblxuTGlua0VsZW1lbnQuZGVmYXVsdFByb3BzID0ge1xuICBsYWJlbDogJycsXG4gIHRleHQ6IG51bGwsXG4gIGhyZWY6IG51bGwsXG59O1xuXG4vKipcbiAqIENoZWNrYm94IENvbXBvbmVudFxuICogUmVhY3Qgd3JhcHBlciBmb3IgYSA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCI+IGVsZW1lbnQuXG4gKi9cbmNsYXNzIENoZWNrYm94RWxlbWVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGUpIHtcbiAgICB0aGlzLnByb3BzLm9uVXNlcklucHV0KHRoaXMucHJvcHMubmFtZSwgZS50YXJnZXQuY2hlY2tlZCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSB0aGlzLnByb3BzLmRpc2FibGVkID8gJ2Rpc2FibGVkJyA6IG51bGw7XG4gICAgY29uc3QgcmVxdWlyZWQgPSB0aGlzLnByb3BzLnJlcXVpcmVkID8gJ3JlcXVpcmVkJyA6IG51bGw7XG4gICAgbGV0IGVycm9yTWVzc2FnZSA9IG51bGw7XG4gICAgbGV0IHJlcXVpcmVkSFRNTCA9IG51bGw7XG4gICAgbGV0IGVsZW1lbnRDbGFzcyA9ICdjaGVja2JveC1pbmxpbmUgY29sLXNtLW9mZnNldC0zJztcbiAgICBjb25zdCBsYWJlbCA9IG51bGw7XG5cbiAgICAvLyBBZGQgcmVxdWlyZWQgYXN0ZXJpeFxuICAgIGlmIChyZXF1aXJlZCkge1xuICAgICAgcmVxdWlyZWRIVE1MID0gPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1kYW5nZXJcIj4qPC9zcGFuPjtcbiAgICB9XG5cbiAgICAvLyBBZGQgZXJyb3IgbWVzc2FnZVxuICAgIGlmICh0aGlzLnByb3BzLmVycm9yTWVzc2FnZSkge1xuICAgICAgZXJyb3JNZXNzYWdlID0gPHNwYW4+e3RoaXMucHJvcHMuZXJyb3JNZXNzYWdlfTwvc3Bhbj47XG4gICAgICBlbGVtZW50Q2xhc3MgPSAnY2hlY2tib3gtaW5saW5lIGNvbC1zbS1vZmZzZXQtMyBoYXMtZXJyb3InO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17ZWxlbWVudENsYXNzfT5cbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9e3RoaXMucHJvcHMuaWR9PlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZX1cbiAgICAgICAgICAgIGlkPXt0aGlzLnByb3BzLmlkfVxuICAgICAgICAgICAgY2hlY2tlZD17dGhpcy5wcm9wcy52YWx1ZX1cbiAgICAgICAgICAgIHJlcXVpcmVkPXtyZXF1aXJlZH1cbiAgICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHtlcnJvck1lc3NhZ2V9XG4gICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgICAge3JlcXVpcmVkSFRNTH1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuQ2hlY2tib3hFbGVtZW50LnByb3BUeXBlcyA9IHtcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICB2YWx1ZTogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgcmVxdWlyZWQ6IFByb3BUeXBlcy5ib29sLFxuICBlcnJvck1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG9uVXNlcklucHV0OiBQcm9wVHlwZXMuZnVuYyxcbn07XG5cbkNoZWNrYm94RWxlbWVudC5kZWZhdWx0UHJvcHMgPSB7XG4gIGlkOiBudWxsLFxuICBkaXNhYmxlZDogZmFsc2UsXG4gIHJlcXVpcmVkOiBmYWxzZSxcbiAgZXJyb3JNZXNzYWdlOiAnJyxcbiAgb25Vc2VySW5wdXQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUud2Fybignb25Vc2VySW5wdXQoKSBjYWxsYmFjayBpcyBub3Qgc2V0Jyk7XG4gIH0sXG59O1xuXG4vKipcbiAqIEJ1dHRvbiBjb21wb25lbnRcbiAqIFJlYWN0IHdyYXBwZXIgZm9yIDxidXR0b24+IGVsZW1lbnQsIHR5cGljYWxseSB1c2VkIHRvIHN1Ym1pdCBmb3Jtc1xuICovXG5jbGFzcyBCdXR0b25FbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5oYW5kbGVDbGljayA9IHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKGUpIHtcbiAgICB0aGlzLnByb3BzLm9uVXNlcklucHV0KGUpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBmb3JtLWdyb3VwXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmNvbHVtblNpemV9PlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZX1cbiAgICAgICAgICAgIHR5cGU9e3RoaXMucHJvcHMudHlwZX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT17dGhpcy5wcm9wcy5idXR0b25DbGFzc31cbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5CdXR0b25FbGVtZW50LnByb3BUeXBlcyA9IHtcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHR5cGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG9uVXNlcklucHV0OiBQcm9wVHlwZXMuZnVuYyxcbn07XG5cbkJ1dHRvbkVsZW1lbnQuZGVmYXVsdFByb3BzID0ge1xuICBsYWJlbDogJ1N1Ym1pdCcsXG4gIHR5cGU6ICdzdWJtaXQnLFxuICBidXR0b25DbGFzczogJ2J0biBidG4tcHJpbWFyeScsXG4gIGNvbHVtblNpemU6ICdjb2wtc20tOSBjb2wtc20tb2Zmc2V0LTMnLFxuICBvblVzZXJJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVzZXJJbnB1dCgpIGNhbGxiYWNrIGlzIG5vdCBzZXQnKTtcbiAgfSxcbn07XG5cbi8qKlxuICAqIENhbGwgVG8gQWN0aW9uIChDVEEpIGNvbXBvbmVudFxuICAqIFJlYWN0IHdyYXBwZXIgZm9yIDxidXR0b24+IGVsZW1lbnQgdGhhdCBpcyB1c2VkIGZvciBDYWxsIHRvIEFjdGlvbnMsIHVzdWFsbHlcbiAgKiBvdXRzaWRlIHRoZSBjb250ZXh0IG9mIGZvcm1zLlxuICAqL1xuY2xhc3MgQ1RBIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uXG4gICAgICAgIGNsYXNzTmFtZT17dGhpcy5wcm9wcy5idXR0b25DbGFzc31cbiAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5vblVzZXJJbnB1dH1cbiAgICAgID5cbiAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG59XG5cbkNUQS5wcm9wVHlwZXMgPSB7XG4gIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBidXR0b25DbGFzczogUHJvcFR5cGVzLnN0cmluZyxcbiAgb25Vc2VySW5wdXQ6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuQ1RBLmRlZmF1bHRQcm9wcyA9IHtcbiAgYnV0dG9uQ2xhc3M6ICdidG4gYnRuLXByaW1hcnknLFxuICBvblVzZXJJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVzZXJJbnB1dCgpIGNhbGxiYWNrIGlzIG5vdCBzZXQnKTtcbiAgfSxcbn07XG5cbi8qKlxuICogR2VuZXJpYyBmb3JtIGVsZW1lbnQuXG4gKi9cbmNsYXNzIExvcmlzRWxlbWVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBlbGVtZW50UHJvcHMgPSB0aGlzLnByb3BzLmVsZW1lbnQ7XG4gICAgZWxlbWVudFByb3BzLnJlZiA9IGVsZW1lbnRQcm9wcy5uYW1lO1xuICAgIGVsZW1lbnRQcm9wcy5vblVzZXJJbnB1dCA9IHRoaXMucHJvcHMub25Vc2VySW5wdXQ7XG5cbiAgICBsZXQgZWxlbWVudEh0bWwgPSA8ZGl2PjwvZGl2PjtcblxuICAgIHN3aXRjaCAoZWxlbWVudFByb3BzLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICBlbGVtZW50SHRtbCA9ICg8VGV4dGJveEVsZW1lbnQgey4uLmVsZW1lbnRQcm9wc30gLz4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3RhZ3MnOlxuICAgICAgICBlbGVtZW50SHRtbCA9ICg8VGFnc0VsZW1lbnQgey4uLmVsZW1lbnRQcm9wc30gLz4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICAgIGVsZW1lbnRIdG1sID0gKDxTZWxlY3RFbGVtZW50IHsuLi5lbGVtZW50UHJvcHN9IC8+KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzZWFyY2gnOlxuICAgICAgICBlbGVtZW50SHRtbCA9ICg8U2VhcmNoYWJsZURyb3Bkb3duIHsuLi5lbGVtZW50UHJvcHN9Lz4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICBlbGVtZW50SHRtbCA9ICg8RGF0ZUVsZW1lbnQgey4uLmVsZW1lbnRQcm9wc30gLz4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICBlbGVtZW50SHRtbCA9ICg8VGltZUVsZW1lbnQgey4uLmVsZW1lbnRQcm9wc30gLz4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ251bWVyaWMnOlxuICAgICAgICBlbGVtZW50SHRtbCA9ICg8TnVtZXJpY0VsZW1lbnQgey4uLmVsZW1lbnRQcm9wc30gLz4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3RleHRhcmVhJzpcbiAgICAgICAgZWxlbWVudEh0bWwgPSAoPFRleHRhcmVhRWxlbWVudCB7Li4uZWxlbWVudFByb3BzfSAvPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZmlsZSc6XG4gICAgICAgIGVsZW1lbnRIdG1sID0gKDxGaWxlRWxlbWVudCB7Li4uZWxlbWVudFByb3BzfSAvPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3RhdGljJzpcbiAgICAgICAgZWxlbWVudEh0bWwgPSAoPFN0YXRpY0VsZW1lbnQgey4uLmVsZW1lbnRQcm9wc30gLz4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xpbmsnOlxuICAgICAgICBlbGVtZW50SHRtbCA9ICg8TGlua0VsZW1lbnQgey4uLmVsZW1lbnRQcm9wc30gLz4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FkdmNoZWNrYm94JzpcbiAgICAgICAgZWxlbWVudEh0bWwgPSAoPENoZWNrYm94RWxlbWVudCB7Li4uZWxlbWVudFByb3BzfSAvPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgJ0VsZW1lbnQgb2YgdHlwZSAnICsgZWxlbWVudFByb3BzLnR5cGUgKyAnIGlzIG5vdCBjdXJyZW50bHkgaW1wbGVtZW50ZWQhJ1xuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbWVudEh0bWw7XG4gIH1cbn1cblxud2luZG93LkZvcm1FbGVtZW50ID0gRm9ybUVsZW1lbnQ7XG53aW5kb3cuRmllbGRzZXRFbGVtZW50ID0gRmllbGRzZXRFbGVtZW50O1xud2luZG93LlNlbGVjdEVsZW1lbnQgPSBTZWxlY3RFbGVtZW50O1xud2luZG93LlRhZ3NFbGVtZW50ID0gVGFnc0VsZW1lbnQ7XG53aW5kb3cuU2VhcmNoYWJsZURyb3Bkb3duID0gU2VhcmNoYWJsZURyb3Bkb3duO1xud2luZG93LlRleHRhcmVhRWxlbWVudCA9IFRleHRhcmVhRWxlbWVudDtcbndpbmRvdy5UZXh0Ym94RWxlbWVudCA9IFRleHRib3hFbGVtZW50O1xud2luZG93LkRhdGVFbGVtZW50ID0gRGF0ZUVsZW1lbnQ7XG53aW5kb3cuVGltZUVsZW1lbnQgPSBUaW1lRWxlbWVudDtcbndpbmRvdy5OdW1lcmljRWxlbWVudCA9IE51bWVyaWNFbGVtZW50O1xud2luZG93LkZpbGVFbGVtZW50ID0gRmlsZUVsZW1lbnQ7XG53aW5kb3cuU3RhdGljRWxlbWVudCA9IFN0YXRpY0VsZW1lbnQ7XG53aW5kb3cuTGlua0VsZW1lbnQgPSBMaW5rRWxlbWVudDtcbndpbmRvdy5DaGVja2JveEVsZW1lbnQgPSBDaGVja2JveEVsZW1lbnQ7XG53aW5kb3cuQnV0dG9uRWxlbWVudCA9IEJ1dHRvbkVsZW1lbnQ7XG53aW5kb3cuQ1RBID0gQ1RBO1xud2luZG93LkxvcmlzRWxlbWVudCA9IExvcmlzRWxlbWVudDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBGb3JtRWxlbWVudCxcbiAgRmllbGRzZXRFbGVtZW50LFxuICBTZWxlY3RFbGVtZW50LFxuICBUYWdzRWxlbWVudCxcbiAgU2VhcmNoYWJsZURyb3Bkb3duLFxuICBUZXh0YXJlYUVsZW1lbnQsXG4gIFRleHRib3hFbGVtZW50LFxuICBEYXRlRWxlbWVudCxcbiAgVGltZUVsZW1lbnQsXG4gIE51bWVyaWNFbGVtZW50LFxuICBGaWxlRWxlbWVudCxcbiAgU3RhdGljRWxlbWVudCxcbiAgTGlua0VsZW1lbnQsXG4gIENoZWNrYm94RWxlbWVudCxcbiAgQnV0dG9uRWxlbWVudCxcbiAgQ1RBLFxuICBMb3Jpc0VsZW1lbnQsXG59O1xuIiwiLyoqXG4gKiBUaGlzIGZpbGUgY29udGFpbnMgdGhlIFJlYWN0IGNvbXBvbmVudCBmb3IgTG9hZGVyXG4gKlxuICogQGF1dGhvciBIZW5yaSBSYWJhbGFpc1xuICogQHZlcnNpb24gMS4wLjBcbiAqXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG4vKipcbiAqIExvYWRlciBjb21wb25lbnRcbiAqL1xuY2xhc3MgTG9hZGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSdsb2FkZXInXG4gICAgICAgIHN0eWxlPXt7d2lkdGg6IHBhcnNlSW50KHRoaXMucHJvcHMuc2l6ZSksIGhlaWdodDogcGFyc2VJbnQodGhpcy5wcm9wcy5zaXplKX19XG4gICAgICAvPlxuICAgICk7XG4gIH1cbn1cblxuTG9hZGVyLnByb3BUeXBlcyA9IHtzaXplOiBQcm9wVHlwZXMuc3RyaW5nfTtcbkxvYWRlci5kZWZhdWx0UHJvcHMgPSB7c2l6ZTogJzEyMCd9O1xuXG5leHBvcnQgZGVmYXVsdCBMb2FkZXI7XG4iLCIvKiBleHBvcnRlZCBSUGFnaW5hdGlvbkxpbmtzICovXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuY2xhc3MgUGFnaW5hdGlvbkxpbmtzIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuXG4gICAgfTtcbiAgICB0aGlzLmNoYW5nZVBhZ2UgPSB0aGlzLmNoYW5nZVBhZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGNoYW5nZVBhZ2UoaSkge1xuICAgIHJldHVybiBmdW5jdGlvbihldnQpIHtcbiAgICAgIC8vIERvbid0IGp1bXAgdG8gdGhlIHRvcCBvZiB0aGUgcGFnZVxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGlmICh0aGlzLnByb3BzLm9uQ2hhbmdlUGFnZSkge1xuICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlUGFnZShpKTtcbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHJvd3NQZXJQYWdlID0gdGhpcy5wcm9wcy5Sb3dzUGVyUGFnZTtcbiAgICBsZXQgcGFnZUxpbmtzID0gW107XG4gICAgbGV0IGNsYXNzTGlzdDtcbiAgICBsZXQgbGFzdFBhZ2UgPSBNYXRoLmNlaWwodGhpcy5wcm9wcy5Ub3RhbCAvIHJvd3NQZXJQYWdlKTtcbiAgICBsZXQgc3RhcnRQYWdlID0gTWF0aC5tYXgoMSwgdGhpcy5wcm9wcy5BY3RpdmUgLSAzKTtcbiAgICBsZXQgbGFzdFNob3duUGFnZSA9IE1hdGgubWluKHRoaXMucHJvcHMuQWN0aXZlICsgMywgbGFzdFBhZ2UpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuVG90YWwgPT09IDApIHtcbiAgICAgIHJldHVybiA8ZGl2IC8+O1xuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wcy5Ub3RhbCA8IHRoaXMucHJvcHMuUm93c1BlclBhZ2UpIHtcbiAgICAgIHJldHVybiA8ZGl2IC8+O1xuICAgIH1cblxuICAgIGlmICgobGFzdFNob3duUGFnZSAtIHN0YXJ0UGFnZSkgPD0gNykge1xuICAgICAgbGFzdFNob3duUGFnZSA9IHN0YXJ0UGFnZSArIDY7XG4gICAgICBpZiAobGFzdFNob3duUGFnZSA+IGxhc3RQYWdlKSB7XG4gICAgICAgIGxhc3RTaG93blBhZ2UgPSBsYXN0UGFnZTtcbiAgICAgICAgc3RhcnRQYWdlID0gbGFzdFBhZ2UgLSA2O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdGFydFBhZ2UgPiAxKSB7XG4gICAgICBwYWdlTGlua3MucHVzaChcbiAgICAgICAgPGxpIGtleT17J3RhYmxlX3BhZ2VfYmVnaW5uaW5nXycgKyBzdGFydFBhZ2UudG9TdHJpbmcoKX0gb25DbGljaz17dGhpcy5jaGFuZ2VQYWdlKDEpfT48YSBocmVmPScjJz4mbGFxdW87PC9hPjwvbGk+XG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoc3RhcnRQYWdlIDwgMSkge1xuICAgICAgc3RhcnRQYWdlID0gMTtcbiAgICB9XG4gICAgaWYgKGxhc3RTaG93blBhZ2UgPCAxKSB7XG4gICAgICBsYXN0U2hvd25QYWdlID0gMTtcbiAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlcmUgaXMgb25seSAxIHBhZ2UsIGRvbid0IGRpc3BsYXkgcGFnaW5hdGlvbiBsaW5rc1xuICAgIGlmIChzdGFydFBhZ2UgPT09IGxhc3RTaG93blBhZ2UpIHtcbiAgICAgIHJldHVybiA8ZGl2IC8+O1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSBzdGFydFBhZ2U7IGkgPD0gbGFzdFNob3duUGFnZTsgaSArPSAxKSB7XG4gICAgICBjbGFzc0xpc3QgPSAnJztcbiAgICAgIGlmICh0aGlzLnByb3BzLkFjdGl2ZSA9PT0gaSkge1xuICAgICAgICBjbGFzc0xpc3QgPSAnYWN0aXZlJztcbiAgICAgIH1cbiAgICAgIHBhZ2VMaW5rcy5wdXNoKFxuICAgICAgICA8bGkga2V5PXsndGFibGVfcGFnZV8nICsgaS50b1N0cmluZygpfSBvbkNsaWNrPXt0aGlzLmNoYW5nZVBhZ2UoaSl9IGNsYXNzTmFtZT17Y2xhc3NMaXN0fT5cbiAgICAgICAgICA8YSBocmVmPVwiI1wiPntpfTwvYT5cbiAgICAgICAgPC9saT5cbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChsYXN0U2hvd25QYWdlICE9PSBsYXN0UGFnZSkge1xuICAgICAgcGFnZUxpbmtzLnB1c2goXG4gICAgICAgIDxsaSBrZXk9eyd0YWJsZV9wYWdlX21vcmVfJyArIGxhc3RTaG93blBhZ2UudG9TdHJpbmcoKX0gb25DbGljaz17dGhpcy5jaGFuZ2VQYWdlKGxhc3RQYWdlKX0+XG4gICAgICAgICAgPGEgaHJlZj0nIyc+JnJhcXVvOzwvYT5cbiAgICAgICAgPC9saT5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDx1bCBjbGFzc05hbWU9J3BhZ2luYXRpb24gcGFnaW5hdGlvbi10YWJsZSc+XG4gICAgICAgICAge3BhZ2VMaW5rc31cbiAgICAgIDwvdWw+XG4gICAgKTtcbiAgfVxufVxuUGFnaW5hdGlvbkxpbmtzLnByb3BUeXBlcyA9IHtcbiAgb25DaGFuZ2VQYWdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgVG90YWw6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbn07XG5QYWdpbmF0aW9uTGlua3MuZGVmYXVsdFByb3BzID0ge1xuICBSb3dzUGVyUGFnZTogMTAsXG4gIEFjdGl2ZTogMSxcbn07XG5cbmxldCBSUGFnaW5hdGlvbkxpbmtzID0gUmVhY3QuY3JlYXRlRmFjdG9yeShQYWdpbmF0aW9uTGlua3MpO1xuXG53aW5kb3cuUGFnaW5hdGlvbkxpbmtzID0gUGFnaW5hdGlvbkxpbmtzO1xud2luZG93LlJQYWdpbmF0aW9uTGlua3MgPSBSUGFnaW5hdGlvbkxpbmtzO1xuXG5leHBvcnQgZGVmYXVsdCBQYWdpbmF0aW9uTGlua3M7XG4iLCIvKipcbiAqIFRoaXMgZmlsZSBjb250YWlucyBSZWFjdCBjb21wb25lbnQgZm9yIFBhbmVsXG4gKlxuICogQGF1dGhvciBBbGV4IEkuXG4gKiBAdmVyc2lvbiAxLjAuMFxuICpcbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbi8qKlxuICogUGFuZWwgY29tcG9uZW50XG4gKiBXcmFwcyBjaGlsZHJlbiBpbiBhIGNvbGxhcHNpYmxlIGJvb3RzdHJhcCBwYW5lbFxuICovXG5jbGFzcyBQYW5lbCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGNvbGxhcHNlZDogdGhpcy5wcm9wcy5pbml0Q29sbGFwc2VkLFxuICAgIH07XG5cbiAgICAvLyBJbml0aWFsaXplIHBhbmVsIGNsYXNzIGJhc2VkIG9uIGNvbGxhcHNlZCBzdGF0dXNcbiAgICB0aGlzLnBhbmVsQ2xhc3MgPSAoXG4gICAgICB0aGlzLnByb3BzLmluaXRDb2xsYXBzZWQgP1xuICAgICAgICAncGFuZWwtY29sbGFwc2UgY29sbGFwc2UnIDpcbiAgICAgICAgJ3BhbmVsLWNvbGxhcHNlIGNvbGxhcHNlIGluJ1xuICAgICk7XG5cbiAgICB0aGlzLnRvZ2dsZUNvbGxhcHNlZCA9IHRoaXMudG9nZ2xlQ29sbGFwc2VkLmJpbmQodGhpcyk7XG4gIH1cblxuICB0b2dnbGVDb2xsYXBzZWQoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7Y29sbGFwc2VkOiAhdGhpcy5zdGF0ZS5jb2xsYXBzZWR9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvLyBDaGFuZ2UgYXJyb3cgZGlyZWN0aW9uIGJhc2VkIG9uIGNvbGxhcHNlIHN0YXR1c1xuICAgIGxldCBnbHlwaENsYXNzID0gKFxuICAgICAgdGhpcy5zdGF0ZS5jb2xsYXBzZWQgP1xuICAgICAgICAnZ2x5cGhpY29uIHB1bGwtcmlnaHQgZ2x5cGhpY29uLWNoZXZyb24tZG93bicgOlxuICAgICAgICAnZ2x5cGhpY29uIHB1bGwtcmlnaHQgZ2x5cGhpY29uLWNoZXZyb24tdXAnXG4gICAgKTtcblxuICAgIC8vIEFkZCBwYW5lbCBoZWFkZXIsIGlmIHRpdGxlIGlzIHNldFxuICAgIGNvbnN0IHBhbmVsSGVhZGluZyA9IHRoaXMucHJvcHMudGl0bGUgPyAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT1cInBhbmVsLWhlYWRpbmdcIlxuICAgICAgICBvbkNsaWNrPXt0aGlzLnRvZ2dsZUNvbGxhcHNlZH1cbiAgICAgICAgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXG4gICAgICAgIGRhdGEtdGFyZ2V0PXsnIycgKyB0aGlzLnByb3BzLmlkfVxuICAgICAgICBzdHlsZT17e2N1cnNvcjogJ3BvaW50ZXInfX1cbiAgICAgID5cbiAgICAgICAge3RoaXMucHJvcHMudGl0bGV9XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT17Z2x5cGhDbGFzc30+PC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKSA6ICcnO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwgcGFuZWwtcHJpbWFyeVwiPlxuICAgICAgICB7cGFuZWxIZWFkaW5nfVxuICAgICAgICA8ZGl2IGlkPXt0aGlzLnByb3BzLmlkfSBjbGFzc05hbWU9e3RoaXMucGFuZWxDbGFzc30gcm9sZT1cInRhYnBhbmVsXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1ib2R5XCIgc3R5bGU9e3toZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0fX0+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cblBhbmVsLnByb3BUeXBlcyA9IHtcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGhlaWdodDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdGl0bGU6IFByb3BUeXBlcy5zdHJpbmcsXG59O1xuUGFuZWwuZGVmYXVsdFByb3BzID0ge1xuICBpbml0Q29sbGFwc2VkOiBmYWxzZSxcbiAgaWQ6ICdkZWZhdWx0LXBhbmVsJyxcbiAgaGVpZ2h0OiAnMTAwJScsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBQYW5lbDtcbiIsIi8qKlxuICogVGhpcyBmaWxlIGNvbnRhaW5zIFJlYWN0IGNvbXBvbmVudHMgZm9yIFRhYnMgY29tcG9uZW50LlxuICpcbiAqIEBhdXRob3IgTG9yaXMgVGVhbVxuICogQHZlcnNpb24gMS4xLjBcbiAqXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG4vKipcbiAqIFRhYnMgQ29tcG9uZW50LlxuICogUmVhY3Qgd3JhcHBlciBmb3IgQm9vdHN0cmFwIHRhYnMuIEFsbG93cyB0byBkeW5hbWljYWxseSByZW5kZXIgdGFic1xuICogYW5kIGNvcnJlc3BvbmRpbmcgdGFiIHBhbmVzLlxuICpcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogVXNhZ2U6XG4gKlxuICogMS4gRGVmaW5lIGFuIGFycmF5IG9mIHRhYnMgd2l0aCBJRHMgYW5kIGxhYmVsc1xuICpcbiAqIGBsZXQgdGFiTGlzdCA9IFt7aWQ6IFwidGFiMVwiLCBsYWJlbDogXCJUaGlzIGlzIHRhYiB0aXRsZVwifV07YFxuICpcbiAqIDIuIFBhc3MgdGFiTGlzdCBhcyA8VGFiPiBwcm9wZXJ0eSBhbmQgPFRhYlBhbmU+IGFzIGNoaWxkXG4gKiAgYGBgXG4gKiA8VGFicyB0YWJzPXt0YWJMaXN0fSBkZWZhdWx0VGFiPVwidGFiMVwiPlxuICogICA8VGFiUGFuZSBUYWJJZD17dGFiTGlzdFswXS5pZH0+XG4gKiAgICAgLy8gVGFiIGNvbnRlbnQgZ29lcyBoZXJlXG4gKiAgIDwvVGFiUGFuZT5cbiAqIDwvVGFicz5cbiAqIGBgYFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICpcbiAqL1xuY2xhc3MgVGFicyBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgY29uc3QgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuICAgIGxldCBhY3RpdmVUYWIgPSAnJztcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZSB0aGUgaW5pdGlhbCBhY3RpdmUgdGFiIGluIHRoaXMgb3JkZXJcbiAgICAgKiAxLiBUcnkgdG8gaW5mZXIgZnJvbSB0aGUgVVJMLCBvdGhlcndpc2VcbiAgICAgKiAyLiBUcnkgdG8gaW5mZXIgZnJvbSB0aGUgZGVmYXVsdFRhYiBwcm9wLCBvdGhlcndpc2VcbiAgICAgKiAzLiBTZXQgdG8gYmUgdGhlIGZpcnN0IHRhYiBvZiB0aGUgbGlzdFxuICAgICAqL1xuICAgIGlmICh0aGlzLnByb3BzLnVwZGF0ZVVSTCAmJiBoYXNoKSB7XG4gICAgICBhY3RpdmVUYWIgPSBoYXNoLnN1YnN0cigxKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuZGVmYXVsdFRhYikge1xuICAgICAgYWN0aXZlVGFiID0gdGhpcy5wcm9wcy5kZWZhdWx0VGFiO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy50YWJzLmxlbmd0aCA+IDApIHtcbiAgICAgIGFjdGl2ZVRhYiA9IHRoaXMucHJvcHMudGFic1swXS5pZDtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgYWN0aXZlVGFiOiBhY3RpdmVUYWIsXG4gICAgfTtcblxuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRUYWJzID0gdGhpcy5nZXRUYWJzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRUYWJQYW5lcyA9IHRoaXMuZ2V0VGFiUGFuZXMuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKHRhYklkLCBlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlVGFiOiB0YWJJZH0pO1xuICAgIHRoaXMucHJvcHMub25UYWJDaGFuZ2UodGFiSWQpO1xuXG4gICAgLy8gQWRkIHRhYiBocmVmIHRvIFVSTCBxdWVyeXN0cmluZyBhbmQgc2Nyb2xsIHRoZSBwYWdlIHRvIHRvcFxuICAgIGlmICh0aGlzLnByb3BzLnVwZGF0ZVVSTCkge1xuICAgICAgY29uc3Qgc2Nyb2xsRGlzdGFuY2UgPSAkKCdib2R5Jykuc2Nyb2xsVG9wKCkgfHwgJCgnaHRtbCcpLnNjcm9sbFRvcCgpO1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBlLnRhcmdldC5oYXNoO1xuICAgICAgJCgnaHRtbCxib2R5Jykuc2Nyb2xsVG9wKHNjcm9sbERpc3RhbmNlKTtcbiAgICB9XG4gIH1cblxuICBnZXRUYWJzKCkge1xuICAgIGxldCB0YWJzID0gKHRoaXMucHJvcHMudGFicykubWFwKGZ1bmN0aW9uKHRhYikge1xuICAgICAgbGV0IHRhYkNsYXNzID0gdGhpcy5zdGF0ZS5hY3RpdmVUYWIgPT09IHRhYi5pZCA/ICdhY3RpdmUnIDogbnVsbDtcbiAgICAgIGxldCBocmVmID0gJyMnICsgdGFiLmlkO1xuICAgICAgbGV0IHRhYklEID0gJ3RhYi0nICsgdGFiLmlkO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGxpXG4gICAgICAgICAgcm9sZT1cInByZXNlbnRhdGlvblwiXG4gICAgICAgICAgY2xhc3NOYW1lPXt0YWJDbGFzc31cbiAgICAgICAgICBrZXk9e3RhYi5pZH1cbiAgICAgICAgPlxuICAgICAgICAgIDxhIGlkPXt0YWJJRH1cbiAgICAgICAgICAgICBocmVmPXtocmVmfVxuICAgICAgICAgICAgIHJvbGU9XCJ0YWJcIlxuICAgICAgICAgICAgIGRhdGEtdG9nZ2xlPVwidGFiXCJcbiAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrLmJpbmQobnVsbCwgdGFiLmlkKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dGFiLmxhYmVsfVxuICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9saT5cbiAgICAgICk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHJldHVybiB0YWJzO1xuICB9XG5cbiAgZ2V0VGFiUGFuZXMoKSB7XG4gICAgbGV0IHRhYlBhbmVzID0gUmVhY3QuQ2hpbGRyZW4ubWFwKHRoaXMucHJvcHMuY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkLCBrZXkpIHtcbiAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICByZXR1cm4gUmVhY3QuY2xvbmVFbGVtZW50KGNoaWxkLCB7XG4gICAgICAgICAgYWN0aXZlVGFiOiB0aGlzLnN0YXRlLmFjdGl2ZVRhYixcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHJldHVybiB0YWJQYW5lcztcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgdGFicyA9IHRoaXMuZ2V0VGFicygpO1xuICAgIGxldCB0YWJQYW5lcyA9IHRoaXMuZ2V0VGFiUGFuZXMoKTtcbiAgICBsZXQgdGFiU3R5bGUgPSB7XG4gICAgICBtYXJnaW5MZWZ0OiAwLFxuICAgICAgbWFyZ2luQm90dG9tOiAnNXB4JyxcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXYgbmF2LXRhYnNcIiByb2xlPVwidGFibGlzdFwiIHN0eWxlPXt0YWJTdHlsZX0+XG4gICAgICAgICAge3RhYnN9XG4gICAgICAgIDwvdWw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGFiLWNvbnRlbnRcIj5cbiAgICAgICAgICB7dGFiUGFuZXN9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuVGFicy5wcm9wVHlwZXMgPSB7XG4gIHRhYnM6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBkZWZhdWx0VGFiOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB1cGRhdGVVUkw6IFByb3BUeXBlcy5ib29sLFxufTtcblRhYnMuZGVmYXVsdFByb3BzID0ge1xuICBvblRhYkNoYW5nZTogZnVuY3Rpb24oKSB7fSxcbiAgLy8gU2V0IHVwZGF0ZVVSTCB0byBkZWZhdWx0IHRvIHRydWUgYnV0IGFsbG93IGZvciBjaGFuZ2VcbiAgLy8gTmVzdGVkIHRhYnMgc2hvdWxkIHNldCB0aGlzIHZhcmlhYmxlIHRvIGZhbHNlXG4gIHVwZGF0ZVVSTDogdHJ1ZSxcbn07XG5cbi8qKlxuICogQWxsb3dzIHRvIGR5bmFtaWNhbGx5IHJlbmRlciB2ZXJ0aWNhbCB0YWJzIGNvcnJlc3BvbmRpbmcgdG8gdGFiIHBhbmVzLlxuICovXG5cbmNsYXNzIFZlcnRpY2FsVGFicyBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgY29uc3QgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuICAgIGxldCBhY3RpdmVUYWIgPSAnJztcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZSB0aGUgaW5pdGlhbCBhY3RpdmUgdGFiIGluIHRoaXMgb3JkZXJcbiAgICAgKiAxLiBUcnkgdG8gaW5mZXIgZnJvbSB0aGUgVVJMLCBvdGhlcndpc2VcbiAgICAgKiAyLiBUcnkgdG8gaW5mZXIgZnJvbSB0aGUgZGVmYXVsdFRhYiBwcm9wLCBvdGhlcndpc2VcbiAgICAgKiAzLiBTZXQgdG8gYmUgdGhlIGZpcnN0IHRhYiBvZiB0aGUgbGlzdFxuICAgICAqL1xuICAgIGlmICh0aGlzLnByb3BzLnVwZGF0ZVVSTCAmJiBoYXNoKSB7XG4gICAgICBhY3RpdmVUYWIgPSBoYXNoLnN1YnN0cigxKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuZGVmYXVsdFRhYikge1xuICAgICAgYWN0aXZlVGFiID0gdGhpcy5wcm9wcy5kZWZhdWx0VGFiO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy50YWJzLmxlbmd0aCA+IDApIHtcbiAgICAgIGFjdGl2ZVRhYiA9IHRoaXMucHJvcHMudGFic1swXS5pZDtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgYWN0aXZlVGFiOiBhY3RpdmVUYWIsXG4gICAgfTtcblxuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRUYWJzID0gdGhpcy5nZXRUYWJzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRUYWJQYW5lcyA9IHRoaXMuZ2V0VGFiUGFuZXMuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKHRhYklkLCBlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlVGFiOiB0YWJJZH0pO1xuICAgIHRoaXMucHJvcHMub25UYWJDaGFuZ2UodGFiSWQpO1xuXG4gICAgLy8gQWRkIHRhYiBocmVmIHRvIFVSTCBxdWVyeXN0cmluZyBhbmQgc2Nyb2xsIHRoZSBwYWdlIHRvIHRvcFxuICAgIGlmICh0aGlzLnByb3BzLnVwZGF0ZVVSTCkge1xuICAgICAgY29uc3Qgc2Nyb2xsRGlzdGFuY2UgPSAkKCdib2R5Jykuc2Nyb2xsVG9wKCkgfHwgJCgnaHRtbCcpLnNjcm9sbFRvcCgpO1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBlLnRhcmdldC5oYXNoO1xuICAgICAgJCgnaHRtbCxib2R5Jykuc2Nyb2xsVG9wKHNjcm9sbERpc3RhbmNlKTtcbiAgICB9XG4gIH1cblxuICBnZXRUYWJzKCkge1xuICAgIGxldCB0YWJzID0gKHRoaXMucHJvcHMudGFicykubWFwKGZ1bmN0aW9uKHRhYikge1xuICAgICAgbGV0IHRhYkNsYXNzID0gdGhpcy5zdGF0ZS5hY3RpdmVUYWIgPT09IHRhYi5pZCA/ICdhY3RpdmUnIDogbnVsbDtcbiAgICAgIGxldCBocmVmID0gJyMnICsgdGFiLmlkO1xuICAgICAgbGV0IHRhYklEID0gJ3RhYi0nICsgdGFiLmlkO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGxpXG4gICAgICAgICAgcm9sZT1cInByZXNlbnRhdGlvblwiXG4gICAgICAgICAgY2xhc3NOYW1lPXt0YWJDbGFzc31cbiAgICAgICAgICBrZXk9e3RhYi5pZH1cbiAgICAgICAgPlxuICAgICAgICAgIDxhIGlkPXt0YWJJRH1cbiAgICAgICAgICAgICBocmVmPXtocmVmfVxuICAgICAgICAgICAgIHJvbGU9XCJ0YWJcIlxuICAgICAgICAgICAgIGRhdGEtdG9nZ2xlPVwidGFiXCJcbiAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrLmJpbmQobnVsbCwgdGFiLmlkKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dGFiLmxhYmVsfVxuICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9saT5cbiAgICAgICk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHJldHVybiB0YWJzO1xuICB9XG5cbiAgZ2V0VGFiUGFuZXMoKSB7XG4gICAgbGV0IHRhYlBhbmVzID0gUmVhY3QuQ2hpbGRyZW4ubWFwKHRoaXMucHJvcHMuY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkLCBrZXkpIHtcbiAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICByZXR1cm4gUmVhY3QuY2xvbmVFbGVtZW50KGNoaWxkLCB7XG4gICAgICAgICAgYWN0aXZlVGFiOiB0aGlzLnN0YXRlLmFjdGl2ZVRhYixcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHJldHVybiB0YWJQYW5lcztcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgdGFicyA9IHRoaXMuZ2V0VGFicygpO1xuICAgIGxldCB0YWJQYW5lcyA9IHRoaXMuZ2V0VGFiUGFuZXMoKTtcbiAgICBsZXQgdGFiU3R5bGUgPSB7XG4gICAgICBtYXJnaW5MZWZ0OiAwLFxuICAgICAgbWFyZ2luQm90dG9tOiAnNXB4JyxcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGFiYmFibGUgY29sLW1kLTMgY29sLXNtLTNcIj5cbiAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2IG5hdi1waWxscyBuYXYtc3RhY2tlZFwiIHJvbGU9XCJ0YWJsaXN0XCIgc3R5bGU9e3RhYlN0eWxlfT5cbiAgICAgICAgICAgIHt0YWJzfVxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRhYi1jb250ZW50IGNvbC1tZC05IGNvbC1zbS05XCI+XG4gICAgICAgICAge3RhYlBhbmVzfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblZlcnRpY2FsVGFicy5wcm9wVHlwZXMgPSB7XG4gIHRhYnM6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBkZWZhdWx0VGFiOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB1cGRhdGVVUkw6IFByb3BUeXBlcy5ib29sLFxufTtcblZlcnRpY2FsVGFicy5kZWZhdWx0UHJvcHMgPSB7XG4gIG9uVGFiQ2hhbmdlOiBmdW5jdGlvbigpIHt9LFxuICAvLyBTZXQgdXBkYXRlVVJMIHRvIGRlZmF1bHQgdG8gdHJ1ZSBidXQgYWxsb3cgZm9yIGNoYW5nZVxuICAvLyBOZXN0ZWQgdGFicyBzaG91bGQgc2V0IHRoaXMgdmFyaWFibGUgdG8gZmFsc2VcbiAgdXBkYXRlVVJMOiB0cnVlLFxufTtcblxuLypcbiAqIFRhYlBhbmUgY29tcG9uZW50LlxuICogVXNlZCB0byB3cmFwIGNvbnRlbnQgZm9yIGV2ZXJ5IHRhYi5cbiAqL1xuY2xhc3MgVGFiUGFuZSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBsZXQgY2xhc3NMaXN0ID0gJ3RhYi1wYW5lJztcbiAgICBsZXQgdGl0bGU7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5UYWJJZCA9PT0gdGhpcy5wcm9wcy5hY3RpdmVUYWIpIHtcbiAgICAgIGNsYXNzTGlzdCArPSAnIGFjdGl2ZSc7XG4gICAgfVxuICAgIGlmICh0aGlzLnByb3BzLlRpdGxlKSB7XG4gICAgICB0aXRsZSA9IDxoMT57dGhpcy5wcm9wcy5UaXRsZX08L2gxPjtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiByb2xlPVwidGFicGFuZWxcIiBjbGFzc05hbWU9e2NsYXNzTGlzdH0gaWQ9e3RoaXMucHJvcHMuVGFiSWR9PlxuICAgICAgICB7dGl0bGV9XG4gICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuVGFiUGFuZS5wcm9wVHlwZXMgPSB7XG4gIFRhYklkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIFRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBhY3RpdmVUYWI6IFByb3BUeXBlcy5zdHJpbmcsXG59O1xuXG5leHBvcnQge1xuICBUYWJzLFxuICBWZXJ0aWNhbFRhYnMsXG4gIFRhYlBhbmUsXG59O1xuIiwiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQge1RhYnMsIFRhYlBhbmV9IGZyb20gJ1RhYnMnO1xuaW1wb3J0IExvYWRlciBmcm9tICdMb2FkZXInO1xuaW1wb3J0IEZpbHRlcmFibGVEYXRhVGFibGUgZnJvbSAnRmlsdGVyYWJsZURhdGFUYWJsZSc7XG5cbmltcG9ydCBJbnN0cnVtZW50VXBsb2FkRm9ybSBmcm9tICcuL3VwbG9hZEZvcm0nO1xuXG5jbGFzcyBJbnN0cnVtZW50TWFuYWdlckluZGV4IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZGF0YToge30sXG4gICAgICBlcnJvcjogZmFsc2UsXG4gICAgICBpc0xvYWRlZDogZmFsc2UsXG4gICAgfTtcblxuICAgdGhpcy5mZXRjaERhdGEgPSB0aGlzLmZldGNoRGF0YS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZm9ybWF0Q29sdW1uID0gdGhpcy5mb3JtYXRDb2x1bW4uYmluZCh0aGlzKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuZmV0Y2hEYXRhKClcbiAgICAgIC50aGVuKCgpID0+IHRoaXMuc2V0U3RhdGUoe2lzTG9hZGVkOiB0cnVlfSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGRhdGEgZnJvbSB0aGUgcHJvdmlkZWQgVVJMIGFuZCBzYXZlIGl0IGluIHN0YXRlXG4gICAqIEFkZGl0aW9uYWxseSBhZGQgaGlkZGVuSGVhZGVycyB0byBnbG9iYWwgbG9yaXMgdmFyaWFibGVcbiAgICogZm9yIGVhc3kgYWNjZXNzIGJ5IGNvbHVtbkZvcm1hdHRlci5cbiAgICpcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgZmV0Y2hEYXRhKCkge1xuICAgIHJldHVybiBmZXRjaCh0aGlzLnByb3BzLmRhdGFVUkwsIHtjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ30pXG4gICAgICAudGhlbigocmVzcCkgPT4gcmVzcC5qc29uKCkpXG4gICAgICAudGhlbigoZGF0YSkgPT4gdGhpcy5zZXRTdGF0ZSh7ZGF0YX0pKVxuICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtlcnJvcjogdHJ1ZX0pO1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vZGlmeSBiZWhhdmlvdXIgb2Ygc3BlY2lmaWVkIGNvbHVtbiBjZWxscyBpbiB0aGUgRGF0YSBUYWJsZSBjb21wb25lbnRcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbHVtbiAtIGNvbHVtbiBuYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjZWxsIC0gY2VsbCBjb250ZW50XG4gICAqIEBwYXJhbSB7b2JqZWN0fSByb3cgLSByb3cgY29udGVudCBpbmRleGVkIGJ5IGNvbHVtblxuICAgKlxuICAgKiBAcmV0dXJuIHsqfSBhIGZvcm1hdGVkIHRhYmxlIGNlbGwgZm9yIGEgZ2l2ZW4gY29sdW1uXG4gICAqL1xuICBmb3JtYXRDb2x1bW4oY29sdW1uLCBjZWxsLCByb3cpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHRkPntjZWxsfTwvdGQ+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvLyBJZiBlcnJvciBvY2N1cnMsIHJldHVybiBhIG1lc3NhZ2UuXG4gICAgLy8gWFhYOiBSZXBsYWNlIHRoaXMgd2l0aCBhIFVJIGNvbXBvbmVudCBmb3IgNTAwIGVycm9ycy5cbiAgICBpZiAodGhpcy5zdGF0ZS5lcnJvcikge1xuICAgICAgcmV0dXJuIDxoMz5BbiBlcnJvciBvY2N1cmVkIHdoaWxlIGxvYWRpbmcgdGhlIHBhZ2UuPC9oMz47XG4gICAgfVxuXG4gICAgLy8gV2FpdGluZyBmb3IgYXN5bmMgZGF0YSB0byBsb2FkXG4gICAgaWYgKCF0aGlzLnN0YXRlLmlzTG9hZGVkKSB7XG4gICAgICByZXR1cm4gPExvYWRlci8+O1xuICAgIH1cblxuICAgIGNvbnN0IGZpZWxkcyA9IFtcbiAgICAgIHtsYWJlbDogJ0luc3RydW1lbnQnLCBzaG93OiB0cnVlLCBmaWx0ZXI6IHtcbiAgICAgICAgbmFtZTogJ2luc3RydW1lbnQnLFxuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICB9fSxcbiAgICAgIHtsYWJlbDogJ0luc3RydW1lbnQgVHlwZScsIHNob3c6IHRydWUsIGZpbHRlcjoge1xuICAgICAgICBuYW1lOiAnaW5zdHJ1bWVudFR5cGUnLFxuICAgICAgICB0eXBlOiAnc2VsZWN0JyxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICdJbnN0cnVtZW50IEJ1aWxkZXInOiAnSW5zdHJ1bWVudCBCdWlsZGVyJyxcbiAgICAgICAgICAnUEhQJzogJ1BIUCcsXG4gICAgICAgICAgJ01pc3NpbmcnOiAnTWlzc2luZycsXG4gICAgICAgIH0sXG4gICAgICB9fSxcbiAgICAgIHtsYWJlbDogJ1RhYmxlIEluc3RhbGxlZCcsIHNob3c6IHRydWUsIGZpbHRlcjoge1xuICAgICAgICBuYW1lOiAndGFibGVJbnN0YWxsZWQnLFxuICAgICAgICB0eXBlOiAnc2VsZWN0JyxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICdFeGlzdHMnOiAnRXhpc3RzJyxcbiAgICAgICAgICAnTWlzc2luZyc6ICdNaXNzaW5nJyxcbiAgICAgICAgfSxcbiAgICAgIH19LFxuICAgICAge2xhYmVsOiAnVGFibGUgVmFsaWQnLCBzaG93OiB0cnVlLCBmaWx0ZXI6IHtcbiAgICAgICAgbmFtZTogJ3RhYmxlVmFsaWQnLFxuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICB9fSxcbiAgICAgIHtsYWJlbDogJ1BhZ2VzIFZhbGlkJywgc2hvdzogdHJ1ZSwgZmlsdGVyOiB7XG4gICAgICAgIG5hbWU6ICdwYWdlc1ZhbGlkJyxcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgfX0sXG4gICAgXTtcblxuICAgIGNvbnN0IHRhYnMgPSBbXG4gICAgICB7aWQ6ICdicm93c2UnLCBsYWJlbDogJ0Jyb3dzZSd9LFxuICAgICAge2lkOiAndXBsb2FkJywgbGFiZWw6ICdVcGxvYWQnfSxcbiAgICBdO1xuXG4gICAgY29uc3QgZmVlZGJhY2sgPSAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuc3RhdGUuZGF0YS5jYW5pbnN0YWxsKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2FsZXJ0IGFsZXJ0LXdhcm5pbmcnPlxuICAgICAgICAgICAgSW5zdHJ1bWVudCBpbnN0YWxsYXRpb24gaXMgbm90IHBvc3NpYmxlIGdpdmVuIHRoZSBjdXJyZW50IHNlcnZlclxuICAgICAgICAgICAgY29uZmlndXJhdGlvbjsgdGhlIExPUklTICdxdWF0VXNlcicgaXMgbm90IGNvbmZpZ3VyZWQgcHJvcGVybHkuXG4gICAgICAgICAgICBGaWxlIHVwbG9hZCBpcyBzdGlsbCBwb3NzaWJsZSBidXQgaW5zdHJ1bWVudHMgd2lsbCBuZWVkIHRvIGJlXG4gICAgICAgICAgICBpbnN0YWxsZWQgbWFudWFsbHlcbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgdXBsb2FkVGFiID0gKCkgPT4ge1xuICAgICAgbGV0IGNvbnRlbnQgPSBudWxsO1xuICAgICAgaWYgKHRoaXMuc3RhdGUuZGF0YS53cml0YWJsZSkge1xuICAgICAgICBsZXQgdXJsID0gbG9yaXMuQmFzZVVSTC5jb25jYXQoJy9pbnN0cnVtZW50X21hbmFnZXIvP2Zvcm1hdD1qc29uJyk7XG4gICAgICAgIGNvbnRlbnQgPSAoXG4gICAgICAgICAgPEluc3RydW1lbnRVcGxvYWRGb3JtIGFjdGlvbj17dXJsfS8+XG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250ZW50ID0gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdhbGVydCBhbGVydC13YXJuaW5nJz5cbiAgICAgICAgICAgIEluc3RhbGxhdGlvbiBpcyBub3QgcG9zc2libGUgZ2l2ZW4gdGhlIGN1cnJlbnQgc2VydmVyIGNvbmZpZ3VyYXRpb24uXG4gICAgICAgICAgICBQbGVhc2UgY29udGFjdCB5b3VyIGFkbWluaXN0cmF0b3IgaWYgeW91IHJlcXVpcmUgdGhpcyBmdW5jdGlvbmFsaXR5XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxUYWJzIHRhYnM9e3RhYnN9IGRlZmF1bHRUYWI9XCJicm93c2VcIiB1cGRhdGVVUkw9e3RydWV9PlxuICAgICAgICA8VGFiUGFuZSBUYWJJZD17dGFic1swXS5pZH0+XG4gICAgICAgICAgPEZpbHRlcmFibGVEYXRhVGFibGVcbiAgICAgICAgICAgIG5hbWU9XCJpbnN0cnVtZW50X21hbmFnZXJcIlxuICAgICAgICAgICAgZGF0YT17dGhpcy5zdGF0ZS5kYXRhLkRhdGF9XG4gICAgICAgICAgICBmaWVsZHM9e2ZpZWxkc31cbiAgICAgICAgICAgIGdldEZvcm1hdHRlZENlbGw9e3RoaXMuZm9ybWF0Q29sdW1ufVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvVGFiUGFuZT5cbiAgICAgICAgPFRhYlBhbmUgVGFiSWQ9J3VwbG9hZCc+XG4gICAgICAgICAge2ZlZWRiYWNrKCl9XG4gICAgICAgICAge3VwbG9hZFRhYigpfVxuICAgICAgICA8L1RhYlBhbmU+XG4gICAgICA8L1RhYnM+XG4gICAgKTtcbiAgfVxufVxuXG5JbnN0cnVtZW50TWFuYWdlckluZGV4LnByb3BUeXBlcyA9IHtcbiAgZGF0YVVSTDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBoYXNQZXJtaXNzaW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxufTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gIFJlYWN0RE9NLnJlbmRlcihcbiAgICA8SW5zdHJ1bWVudE1hbmFnZXJJbmRleFxuICAgICAgZGF0YVVSTD17YCR7bG9yaXMuQmFzZVVSTH0vaW5zdHJ1bWVudF9tYW5hZ2VyLz9mb3JtYXQ9anNvbmB9XG4gICAgICBoYXNQZXJtaXNzaW9uPXtsb3Jpcy51c2VySGFzUGVybWlzc2lvbn1cbiAgICAvPixcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9yaXN3b3Jrc3BhY2UnKVxuICApO1xufSk7XG4iLCJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmNsYXNzIEluc3RydW1lbnRVcGxvYWRGb3JtIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZGF0YToge30sXG4gICAgICBzZWxlY3RlZEZpbGU6IG51bGwsXG4gICAgfTtcblxuICAgIHRoaXMuZmlsZVNlbGVjdGVkID0gdGhpcy5maWxlU2VsZWN0ZWQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnVwbG9hZCA9IHRoaXMudXBsb2FkLmJpbmQodGhpcyk7XG4gIH1cblxuICBmaWxlU2VsZWN0ZWQoZWxlbWVudCwgZmlsZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWRGaWxlOiBmaWxlLFxuICAgIH0pO1xuICB9XG5cbiAgdXBsb2FkKCkge1xuICAgIGNvbnN0IGRhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICBkYXRhLmFwcGVuZCgnaW5zdGFsbF9maWxlJywgdGhpcy5zdGF0ZS5zZWxlY3RlZEZpbGUpO1xuXG4gICAgZmV0Y2godGhpcy5wcm9wcy5hY3Rpb24sIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICBib2R5OiBkYXRhLFxuICAgIH0pXG4gICAgLnRoZW4oKHJlc3ApID0+IHtcbiAgICAgIGlmIChyZXNwLnN0YXR1cyA9PSAyMDEpIHtcbiAgICAgICAgc3dhbCh7XG4gICAgICAgICAgdGl0bGU6ICdJbnN0YWxsYXRpb24gU3VjY2Vzc2Z1bCEnLFxuICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbihsb3Jpcy5CYXNlVVJMICsgJy9pbnN0cnVtZW50X21hbmFnZXIvJyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3AuanNvbigpO1xuICAgIH0pXG4gICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIGlmIChkYXRhLm1lc3NhZ2UpIHtcbiAgICAgICAgIHN3YWwoe1xuICAgICAgICAgIHRpdGxlOiAnVXBsb2FkIFN1Y2Nlc3NmdWwhJyxcbiAgICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgICAgdGV4dDogZGF0YS5tZXNzYWdlLFxuICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKGxvcmlzLkJhc2VVUkwgKyAnL2luc3RydW1lbnRfbWFuYWdlci8nKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZGF0YS5lcnJvcikge1xuICAgICAgICAgc3dhbCh7XG4gICAgICAgICAgdGl0bGU6ICdBbiBlcnJvciBvY2N1cmVkJyxcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIHRleHQ6IGRhdGEuZXJyb3IsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pXG4gICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZXJyb3I6IHRydWV9KTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGRpc2FibGVkID0gKCkgPT4gdGhpcy5zdGF0ZS5zZWxlY3RlZEZpbGUgPT09IG51bGw7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwgcGFuZWwtcHJpbWFyeVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+VXBsb2FkIEluc3RydW1lbnQ8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMlwiPlxuICAgICAgICAgICAgICAgIDxGaWxlRWxlbWVudFxuICAgICAgICAgICAgICAgICAgbmFtZT0naW5zdGFsbF9maWxlJ1xuICAgICAgICAgICAgICAgICAgbGFiZWw9J0luc3RydW1lbnQgZmlsZSdcbiAgICAgICAgICAgICAgICAgIG9uVXNlcklucHV0PXt0aGlzLmZpbGVTZWxlY3RlZH1cbiAgICAgICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnNlbGVjdGVkRmlsZX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgb25DbGljaz17dGhpcy51cGxvYWR9IGRpc2FibGVkPXtkaXNhYmxlZCgpfT5JbnN0YWxsPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5JbnN0cnVtZW50VXBsb2FkRm9ybS5wcm9wVHlwZXMgPSB7XG4gIGFjdGlvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgSW5zdHJ1bWVudFVwbG9hZEZvcm07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBcbiAqL1xuXG5mdW5jdGlvbiBtYWtlRW1wdHlGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gYXJnO1xuICB9O1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gYWNjZXB0cyBhbmQgZGlzY2FyZHMgaW5wdXRzOyBpdCBoYXMgbm8gc2lkZSBlZmZlY3RzLiBUaGlzIGlzXG4gKiBwcmltYXJpbHkgdXNlZnVsIGlkaW9tYXRpY2FsbHkgZm9yIG92ZXJyaWRhYmxlIGZ1bmN0aW9uIGVuZHBvaW50cyB3aGljaFxuICogYWx3YXlzIG5lZWQgdG8gYmUgY2FsbGFibGUsIHNpbmNlIEpTIGxhY2tzIGEgbnVsbC1jYWxsIGlkaW9tIGFsYSBDb2NvYS5cbiAqL1xudmFyIGVtcHR5RnVuY3Rpb24gPSBmdW5jdGlvbiBlbXB0eUZ1bmN0aW9uKCkge307XG5cbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnMgPSBtYWtlRW1wdHlGdW5jdGlvbjtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNGYWxzZSA9IG1ha2VFbXB0eUZ1bmN0aW9uKGZhbHNlKTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNUcnVlID0gbWFrZUVtcHR5RnVuY3Rpb24odHJ1ZSk7XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbCA9IG1ha2VFbXB0eUZ1bmN0aW9uKG51bGwpO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc1RoaXMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzO1xufTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNBcmd1bWVudCA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgcmV0dXJuIGFyZztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZW1wdHlGdW5jdGlvbjsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbnZhciB2YWxpZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIHZhbGlkYXRlRm9ybWF0KGZvcm1hdCkge307XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhbGlkYXRlRm9ybWF0ID0gZnVuY3Rpb24gdmFsaWRhdGVGb3JtYXQoZm9ybWF0KSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBpbnZhcmlhbnQoY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgdmFsaWRhdGVGb3JtYXQoZm9ybWF0KTtcblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKCdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJyZWQ7IHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCAnICsgJ2ZvciB0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgICAgfSkpO1xuICAgICAgZXJyb3IubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICB9XG5cbiAgICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgaW52YXJpYW50J3Mgb3duIGZyYW1lXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7IiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW1wdHlGdW5jdGlvbiA9IHJlcXVpcmUoJy4vZW1wdHlGdW5jdGlvbicpO1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gaW52YXJpYW50IGJ1dCBvbmx5IGxvZ3MgYSB3YXJuaW5nIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IG1ldC5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbG9nIGlzc3VlcyBpbiBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMgaW4gY3JpdGljYWxcbiAqIHBhdGhzLiBSZW1vdmluZyB0aGUgbG9nZ2luZyBjb2RlIGZvciBwcm9kdWN0aW9uIGVudmlyb25tZW50cyB3aWxsIGtlZXAgdGhlXG4gKiBzYW1lIGxvZ2ljIGFuZCBmb2xsb3cgdGhlIHNhbWUgY29kZSBwYXRocy5cbiAqL1xuXG52YXIgd2FybmluZyA9IGVtcHR5RnVuY3Rpb247XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbiBwcmludFdhcm5pbmcoZm9ybWF0KSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoeCkge31cbiAgfTtcblxuICB3YXJuaW5nID0gZnVuY3Rpb24gd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCwgLi4uYXJncylgIHJlcXVpcmVzIGEgd2FybmluZyAnICsgJ21lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG5cbiAgICBpZiAoZm9ybWF0LmluZGV4T2YoJ0ZhaWxlZCBDb21wb3NpdGUgcHJvcFR5cGU6ICcpID09PSAwKSB7XG4gICAgICByZXR1cm47IC8vIElnbm9yZSBDb21wb3NpdGVDb21wb25lbnQgcHJvcHR5cGUgY2hlY2suXG4gICAgfVxuXG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4yID4gMiA/IF9sZW4yIC0gMiA6IDApLCBfa2V5MiA9IDI7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgYXJnc1tfa2V5MiAtIDJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgIH1cblxuICAgICAgcHJpbnRXYXJuaW5nLmFwcGx5KHVuZGVmaW5lZCwgW2Zvcm1hdF0uY29uY2F0KGFyZ3MpKTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gd2FybmluZzsiLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbigpIHt9O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xuICB2YXIgbG9nZ2VkVHlwZUZhaWx1cmVzID0ge307XG4gIHZhciBoYXMgPSBGdW5jdGlvbi5jYWxsLmJpbmQoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSk7XG5cbiAgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyB0ZXh0O1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyAtLS0gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgLS0tXG4gICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKHgpIHt9XG4gIH07XG59XG5cbi8qKlxuICogQXNzZXJ0IHRoYXQgdGhlIHZhbHVlcyBtYXRjaCB3aXRoIHRoZSB0eXBlIHNwZWNzLlxuICogRXJyb3IgbWVzc2FnZXMgYXJlIG1lbW9yaXplZCBhbmQgd2lsbCBvbmx5IGJlIHNob3duIG9uY2UuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHR5cGVTcGVjcyBNYXAgb2YgbmFtZSB0byBhIFJlYWN0UHJvcFR5cGVcbiAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZXMgUnVudGltZSB2YWx1ZXMgdGhhdCBuZWVkIHRvIGJlIHR5cGUtY2hlY2tlZFxuICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uIGUuZy4gXCJwcm9wXCIsIFwiY29udGV4dFwiLCBcImNoaWxkIGNvbnRleHRcIlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbXBvbmVudE5hbWUgTmFtZSBvZiB0aGUgY29tcG9uZW50IGZvciBlcnJvciBtZXNzYWdlcy5cbiAqIEBwYXJhbSB7P0Z1bmN0aW9ufSBnZXRTdGFjayBSZXR1cm5zIHRoZSBjb21wb25lbnQgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjaGVja1Byb3BUeXBlcyh0eXBlU3BlY3MsIHZhbHVlcywgbG9jYXRpb24sIGNvbXBvbmVudE5hbWUsIGdldFN0YWNrKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgZm9yICh2YXIgdHlwZVNwZWNOYW1lIGluIHR5cGVTcGVjcykge1xuICAgICAgaWYgKGhhcyh0eXBlU3BlY3MsIHR5cGVTcGVjTmFtZSkpIHtcbiAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAvLyBQcm9wIHR5cGUgdmFsaWRhdGlvbiBtYXkgdGhyb3cuIEluIGNhc2UgdGhleSBkbywgd2UgZG9uJ3Qgd2FudCB0b1xuICAgICAgICAvLyBmYWlsIHRoZSByZW5kZXIgcGhhc2Ugd2hlcmUgaXQgZGlkbid0IGZhaWwgYmVmb3JlLiBTbyB3ZSBsb2cgaXQuXG4gICAgICAgIC8vIEFmdGVyIHRoZXNlIGhhdmUgYmVlbiBjbGVhbmVkIHVwLCB3ZSdsbCBsZXQgdGhlbSB0aHJvdy5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBUaGlzIGlzIGludGVudGlvbmFsbHkgYW4gaW52YXJpYW50IHRoYXQgZ2V0cyBjYXVnaHQuIEl0J3MgdGhlIHNhbWVcbiAgICAgICAgICAvLyBiZWhhdmlvciBhcyB3aXRob3V0IHRoaXMgc3RhdGVtZW50IGV4Y2VwdCB3aXRoIGEgYmV0dGVyIG1lc3NhZ2UuXG4gICAgICAgICAgaWYgKHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFyIGVyciA9IEVycm9yKFxuICAgICAgICAgICAgICAoY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnKSArICc6ICcgKyBsb2NhdGlvbiArICcgdHlwZSBgJyArIHR5cGVTcGVjTmFtZSArICdgIGlzIGludmFsaWQ7ICcgK1xuICAgICAgICAgICAgICAnaXQgbXVzdCBiZSBhIGZ1bmN0aW9uLCB1c3VhbGx5IGZyb20gdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLCBidXQgcmVjZWl2ZWQgYCcgKyB0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gKyAnYC4nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZXJyLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVycm9yID0gdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0odmFsdWVzLCB0eXBlU3BlY05hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBudWxsLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgZXJyb3IgPSBleDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3IgJiYgIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkge1xuICAgICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAgIChjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycpICsgJzogdHlwZSBzcGVjaWZpY2F0aW9uIG9mICcgK1xuICAgICAgICAgICAgbG9jYXRpb24gKyAnIGAnICsgdHlwZVNwZWNOYW1lICsgJ2AgaXMgaW52YWxpZDsgdGhlIHR5cGUgY2hlY2tlciAnICtcbiAgICAgICAgICAgICdmdW5jdGlvbiBtdXN0IHJldHVybiBgbnVsbGAgb3IgYW4gYEVycm9yYCBidXQgcmV0dXJuZWQgYSAnICsgdHlwZW9mIGVycm9yICsgJy4gJyArXG4gICAgICAgICAgICAnWW91IG1heSBoYXZlIGZvcmdvdHRlbiB0byBwYXNzIGFuIGFyZ3VtZW50IHRvIHRoZSB0eXBlIGNoZWNrZXIgJyArXG4gICAgICAgICAgICAnY3JlYXRvciAoYXJyYXlPZiwgaW5zdGFuY2VPZiwgb2JqZWN0T2YsIG9uZU9mLCBvbmVPZlR5cGUsIGFuZCAnICtcbiAgICAgICAgICAgICdzaGFwZSBhbGwgcmVxdWlyZSBhbiBhcmd1bWVudCkuJ1xuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgIShlcnJvci5tZXNzYWdlIGluIGxvZ2dlZFR5cGVGYWlsdXJlcykpIHtcbiAgICAgICAgICAvLyBPbmx5IG1vbml0b3IgdGhpcyBmYWlsdXJlIG9uY2UgYmVjYXVzZSB0aGVyZSB0ZW5kcyB0byBiZSBhIGxvdCBvZiB0aGVcbiAgICAgICAgICAvLyBzYW1lIGVycm9yLlxuICAgICAgICAgIGxvZ2dlZFR5cGVGYWlsdXJlc1tlcnJvci5tZXNzYWdlXSA9IHRydWU7XG5cbiAgICAgICAgICB2YXIgc3RhY2sgPSBnZXRTdGFjayA/IGdldFN0YWNrKCkgOiAnJztcblxuICAgICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAgICdGYWlsZWQgJyArIGxvY2F0aW9uICsgJyB0eXBlOiAnICsgZXJyb3IubWVzc2FnZSArIChzdGFjayAhPSBudWxsID8gc3RhY2sgOiAnJylcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmVzZXRzIHdhcm5pbmcgY2FjaGUgd2hlbiB0ZXN0aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmNoZWNrUHJvcFR5cGVzLnJlc2V0V2FybmluZ0NhY2hlID0gZnVuY3Rpb24oKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgbG9nZ2VkVHlwZUZhaWx1cmVzID0ge307XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjaGVja1Byb3BUeXBlcztcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RJcyA9IHJlcXVpcmUoJ3JlYWN0LWlzJyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xudmFyIGNoZWNrUHJvcFR5cGVzID0gcmVxdWlyZSgnLi9jaGVja1Byb3BUeXBlcycpO1xuXG52YXIgaGFzID0gRnVuY3Rpb24uY2FsbC5iaW5kKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkpO1xudmFyIHByaW50V2FybmluZyA9IGZ1bmN0aW9uKCkge307XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHByaW50V2FybmluZyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICsgdGV4dDtcbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9IGNhdGNoICh4KSB7fVxuICB9O1xufVxuXG5mdW5jdGlvbiBlbXB0eUZ1bmN0aW9uVGhhdFJldHVybnNOdWxsKCkge1xuICByZXR1cm4gbnVsbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpc1ZhbGlkRWxlbWVudCwgdGhyb3dPbkRpcmVjdEFjY2Vzcykge1xuICAvKiBnbG9iYWwgU3ltYm9sICovXG4gIHZhciBJVEVSQVRPUl9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5pdGVyYXRvcjtcbiAgdmFyIEZBVVhfSVRFUkFUT1JfU1lNQk9MID0gJ0BAaXRlcmF0b3InOyAvLyBCZWZvcmUgU3ltYm9sIHNwZWMuXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGl0ZXJhdG9yIG1ldGhvZCBmdW5jdGlvbiBjb250YWluZWQgb24gdGhlIGl0ZXJhYmxlIG9iamVjdC5cbiAgICpcbiAgICogQmUgc3VyZSB0byBpbnZva2UgdGhlIGZ1bmN0aW9uIHdpdGggdGhlIGl0ZXJhYmxlIGFzIGNvbnRleHQ6XG4gICAqXG4gICAqICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4obXlJdGVyYWJsZSk7XG4gICAqICAgICBpZiAoaXRlcmF0b3JGbikge1xuICAgKiAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwobXlJdGVyYWJsZSk7XG4gICAqICAgICAgIC4uLlxuICAgKiAgICAgfVxuICAgKlxuICAgKiBAcGFyYW0gez9vYmplY3R9IG1heWJlSXRlcmFibGVcbiAgICogQHJldHVybiB7P2Z1bmN0aW9ufVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0SXRlcmF0b3JGbihtYXliZUl0ZXJhYmxlKSB7XG4gICAgdmFyIGl0ZXJhdG9yRm4gPSBtYXliZUl0ZXJhYmxlICYmIChJVEVSQVRPUl9TWU1CT0wgJiYgbWF5YmVJdGVyYWJsZVtJVEVSQVRPUl9TWU1CT0xdIHx8IG1heWJlSXRlcmFibGVbRkFVWF9JVEVSQVRPUl9TWU1CT0xdKTtcbiAgICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvckZuO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb2xsZWN0aW9uIG9mIG1ldGhvZHMgdGhhdCBhbGxvdyBkZWNsYXJhdGlvbiBhbmQgdmFsaWRhdGlvbiBvZiBwcm9wcyB0aGF0IGFyZVxuICAgKiBzdXBwbGllZCB0byBSZWFjdCBjb21wb25lbnRzLiBFeGFtcGxlIHVzYWdlOlxuICAgKlxuICAgKiAgIHZhciBQcm9wcyA9IHJlcXVpcmUoJ1JlYWN0UHJvcFR5cGVzJyk7XG4gICAqICAgdmFyIE15QXJ0aWNsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICogICAgIHByb3BUeXBlczoge1xuICAgKiAgICAgICAvLyBBbiBvcHRpb25hbCBzdHJpbmcgcHJvcCBuYW1lZCBcImRlc2NyaXB0aW9uXCIuXG4gICAqICAgICAgIGRlc2NyaXB0aW9uOiBQcm9wcy5zdHJpbmcsXG4gICAqXG4gICAqICAgICAgIC8vIEEgcmVxdWlyZWQgZW51bSBwcm9wIG5hbWVkIFwiY2F0ZWdvcnlcIi5cbiAgICogICAgICAgY2F0ZWdvcnk6IFByb3BzLm9uZU9mKFsnTmV3cycsJ1Bob3RvcyddKS5pc1JlcXVpcmVkLFxuICAgKlxuICAgKiAgICAgICAvLyBBIHByb3AgbmFtZWQgXCJkaWFsb2dcIiB0aGF0IHJlcXVpcmVzIGFuIGluc3RhbmNlIG9mIERpYWxvZy5cbiAgICogICAgICAgZGlhbG9nOiBQcm9wcy5pbnN0YW5jZU9mKERpYWxvZykuaXNSZXF1aXJlZFxuICAgKiAgICAgfSxcbiAgICogICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7IC4uLiB9XG4gICAqICAgfSk7XG4gICAqXG4gICAqIEEgbW9yZSBmb3JtYWwgc3BlY2lmaWNhdGlvbiBvZiBob3cgdGhlc2UgbWV0aG9kcyBhcmUgdXNlZDpcbiAgICpcbiAgICogICB0eXBlIDo9IGFycmF5fGJvb2x8ZnVuY3xvYmplY3R8bnVtYmVyfHN0cmluZ3xvbmVPZihbLi4uXSl8aW5zdGFuY2VPZiguLi4pXG4gICAqICAgZGVjbCA6PSBSZWFjdFByb3BUeXBlcy57dHlwZX0oLmlzUmVxdWlyZWQpP1xuICAgKlxuICAgKiBFYWNoIGFuZCBldmVyeSBkZWNsYXJhdGlvbiBwcm9kdWNlcyBhIGZ1bmN0aW9uIHdpdGggdGhlIHNhbWUgc2lnbmF0dXJlLiBUaGlzXG4gICAqIGFsbG93cyB0aGUgY3JlYXRpb24gb2YgY3VzdG9tIHZhbGlkYXRpb24gZnVuY3Rpb25zLiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogIHZhciBNeUxpbmsgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAqICAgIHByb3BUeXBlczoge1xuICAgKiAgICAgIC8vIEFuIG9wdGlvbmFsIHN0cmluZyBvciBVUkkgcHJvcCBuYW1lZCBcImhyZWZcIi5cbiAgICogICAgICBocmVmOiBmdW5jdGlvbihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUpIHtcbiAgICogICAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAqICAgICAgICBpZiAocHJvcFZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHByb3BWYWx1ZSAhPT0gJ3N0cmluZycgJiZcbiAgICogICAgICAgICAgICAhKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFVSSSkpIHtcbiAgICogICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcbiAgICogICAgICAgICAgICAnRXhwZWN0ZWQgYSBzdHJpbmcgb3IgYW4gVVJJIGZvciAnICsgcHJvcE5hbWUgKyAnIGluICcgK1xuICAgKiAgICAgICAgICAgIGNvbXBvbmVudE5hbWVcbiAgICogICAgICAgICAgKTtcbiAgICogICAgICAgIH1cbiAgICogICAgICB9XG4gICAqICAgIH0sXG4gICAqICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7Li4ufVxuICAgKiAgfSk7XG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cblxuICB2YXIgQU5PTllNT1VTID0gJzw8YW5vbnltb3VzPj4nO1xuXG4gIC8vIEltcG9ydGFudCFcbiAgLy8gS2VlcCB0aGlzIGxpc3QgaW4gc3luYyB3aXRoIHByb2R1Y3Rpb24gdmVyc2lvbiBpbiBgLi9mYWN0b3J5V2l0aFRocm93aW5nU2hpbXMuanNgLlxuICB2YXIgUmVhY3RQcm9wVHlwZXMgPSB7XG4gICAgYXJyYXk6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdhcnJheScpLFxuICAgIGJvb2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdib29sZWFuJyksXG4gICAgZnVuYzogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2Z1bmN0aW9uJyksXG4gICAgbnVtYmVyOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignbnVtYmVyJyksXG4gICAgb2JqZWN0OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignb2JqZWN0JyksXG4gICAgc3RyaW5nOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignc3RyaW5nJyksXG4gICAgc3ltYm9sOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignc3ltYm9sJyksXG5cbiAgICBhbnk6IGNyZWF0ZUFueVR5cGVDaGVja2VyKCksXG4gICAgYXJyYXlPZjogY3JlYXRlQXJyYXlPZlR5cGVDaGVja2VyLFxuICAgIGVsZW1lbnQ6IGNyZWF0ZUVsZW1lbnRUeXBlQ2hlY2tlcigpLFxuICAgIGVsZW1lbnRUeXBlOiBjcmVhdGVFbGVtZW50VHlwZVR5cGVDaGVja2VyKCksXG4gICAgaW5zdGFuY2VPZjogY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlcixcbiAgICBub2RlOiBjcmVhdGVOb2RlQ2hlY2tlcigpLFxuICAgIG9iamVjdE9mOiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyLFxuICAgIG9uZU9mOiBjcmVhdGVFbnVtVHlwZUNoZWNrZXIsXG4gICAgb25lT2ZUeXBlOiBjcmVhdGVVbmlvblR5cGVDaGVja2VyLFxuICAgIHNoYXBlOiBjcmVhdGVTaGFwZVR5cGVDaGVja2VyLFxuICAgIGV4YWN0OiBjcmVhdGVTdHJpY3RTaGFwZVR5cGVDaGVja2VyLFxuICB9O1xuXG4gIC8qKlxuICAgKiBpbmxpbmVkIE9iamVjdC5pcyBwb2x5ZmlsbCB0byBhdm9pZCByZXF1aXJpbmcgY29uc3VtZXJzIHNoaXAgdGhlaXIgb3duXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9pc1xuICAgKi9cbiAgLyplc2xpbnQtZGlzYWJsZSBuby1zZWxmLWNvbXBhcmUqL1xuICBmdW5jdGlvbiBpcyh4LCB5KSB7XG4gICAgLy8gU2FtZVZhbHVlIGFsZ29yaXRobVxuICAgIGlmICh4ID09PSB5KSB7XG4gICAgICAvLyBTdGVwcyAxLTUsIDctMTBcbiAgICAgIC8vIFN0ZXBzIDYuYi02LmU6ICswICE9IC0wXG4gICAgICByZXR1cm4geCAhPT0gMCB8fCAxIC8geCA9PT0gMSAvIHk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFN0ZXAgNi5hOiBOYU4gPT0gTmFOXG4gICAgICByZXR1cm4geCAhPT0geCAmJiB5ICE9PSB5O1xuICAgIH1cbiAgfVxuICAvKmVzbGludC1lbmFibGUgbm8tc2VsZi1jb21wYXJlKi9cblxuICAvKipcbiAgICogV2UgdXNlIGFuIEVycm9yLWxpa2Ugb2JqZWN0IGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5IGFzIHBlb3BsZSBtYXkgY2FsbFxuICAgKiBQcm9wVHlwZXMgZGlyZWN0bHkgYW5kIGluc3BlY3QgdGhlaXIgb3V0cHV0LiBIb3dldmVyLCB3ZSBkb24ndCB1c2UgcmVhbFxuICAgKiBFcnJvcnMgYW55bW9yZS4gV2UgZG9uJ3QgaW5zcGVjdCB0aGVpciBzdGFjayBhbnl3YXksIGFuZCBjcmVhdGluZyB0aGVtXG4gICAqIGlzIHByb2hpYml0aXZlbHkgZXhwZW5zaXZlIGlmIHRoZXkgYXJlIGNyZWF0ZWQgdG9vIG9mdGVuLCBzdWNoIGFzIHdoYXRcbiAgICogaGFwcGVucyBpbiBvbmVPZlR5cGUoKSBmb3IgYW55IHR5cGUgYmVmb3JlIHRoZSBvbmUgdGhhdCBtYXRjaGVkLlxuICAgKi9cbiAgZnVuY3Rpb24gUHJvcFR5cGVFcnJvcihtZXNzYWdlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB0aGlzLnN0YWNrID0gJyc7XG4gIH1cbiAgLy8gTWFrZSBgaW5zdGFuY2VvZiBFcnJvcmAgc3RpbGwgd29yayBmb3IgcmV0dXJuZWQgZXJyb3JzLlxuICBQcm9wVHlwZUVycm9yLnByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZTtcblxuICBmdW5jdGlvbiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXIgbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGUgPSB7fTtcbiAgICAgIHZhciBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCA9IDA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNoZWNrVHlwZShpc1JlcXVpcmVkLCBwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudE5hbWUgfHwgQU5PTllNT1VTO1xuICAgICAgcHJvcEZ1bGxOYW1lID0gcHJvcEZ1bGxOYW1lIHx8IHByb3BOYW1lO1xuXG4gICAgICBpZiAoc2VjcmV0ICE9PSBSZWFjdFByb3BUeXBlc1NlY3JldCkge1xuICAgICAgICBpZiAodGhyb3dPbkRpcmVjdEFjY2Vzcykge1xuICAgICAgICAgIC8vIE5ldyBiZWhhdmlvciBvbmx5IGZvciB1c2VycyBvZiBgcHJvcC10eXBlc2AgcGFja2FnZVxuICAgICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoXG4gICAgICAgICAgICAnQ2FsbGluZyBQcm9wVHlwZXMgdmFsaWRhdG9ycyBkaXJlY3RseSBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gJyArXG4gICAgICAgICAgICAnVXNlIGBQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMoKWAgdG8gY2FsbCB0aGVtLiAnICtcbiAgICAgICAgICAgICdSZWFkIG1vcmUgYXQgaHR0cDovL2ZiLm1lL3VzZS1jaGVjay1wcm9wLXR5cGVzJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgZXJyLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgLy8gT2xkIGJlaGF2aW9yIGZvciBwZW9wbGUgdXNpbmcgUmVhY3QuUHJvcFR5cGVzXG4gICAgICAgICAgdmFyIGNhY2hlS2V5ID0gY29tcG9uZW50TmFtZSArICc6JyArIHByb3BOYW1lO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFtYW51YWxQcm9wVHlwZUNhbGxDYWNoZVtjYWNoZUtleV0gJiZcbiAgICAgICAgICAgIC8vIEF2b2lkIHNwYW1taW5nIHRoZSBjb25zb2xlIGJlY2F1c2UgdGhleSBhcmUgb2Z0ZW4gbm90IGFjdGlvbmFibGUgZXhjZXB0IGZvciBsaWIgYXV0aG9yc1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQgPCAzXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBwcmludFdhcm5pbmcoXG4gICAgICAgICAgICAgICdZb3UgYXJlIG1hbnVhbGx5IGNhbGxpbmcgYSBSZWFjdC5Qcm9wVHlwZXMgdmFsaWRhdGlvbiAnICtcbiAgICAgICAgICAgICAgJ2Z1bmN0aW9uIGZvciB0aGUgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBwcm9wIG9uIGAnICsgY29tcG9uZW50TmFtZSAgKyAnYC4gVGhpcyBpcyBkZXByZWNhdGVkICcgK1xuICAgICAgICAgICAgICAnYW5kIHdpbGwgdGhyb3cgaW4gdGhlIHN0YW5kYWxvbmUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgICAgICAgICAnWW91IG1heSBiZSBzZWVpbmcgdGhpcyB3YXJuaW5nIGR1ZSB0byBhIHRoaXJkLXBhcnR5IFByb3BUeXBlcyAnICtcbiAgICAgICAgICAgICAgJ2xpYnJhcnkuIFNlZSBodHRwczovL2ZiLm1lL3JlYWN0LXdhcm5pbmctZG9udC1jYWxsLXByb3B0eXBlcyAnICsgJ2ZvciBkZXRhaWxzLidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZUNhbGxDYWNoZVtjYWNoZUtleV0gPSB0cnVlO1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT0gbnVsbCkge1xuICAgICAgICBpZiAoaXNSZXF1aXJlZCkge1xuICAgICAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignVGhlICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBpcyBtYXJrZWQgYXMgcmVxdWlyZWQgJyArICgnaW4gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGJ1dCBpdHMgdmFsdWUgaXMgYG51bGxgLicpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdUaGUgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGlzIG1hcmtlZCBhcyByZXF1aXJlZCBpbiAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgYnV0IGl0cyB2YWx1ZSBpcyBgdW5kZWZpbmVkYC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY2hhaW5lZENoZWNrVHlwZSA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIGZhbHNlKTtcbiAgICBjaGFpbmVkQ2hlY2tUeXBlLmlzUmVxdWlyZWQgPSBjaGVja1R5cGUuYmluZChudWxsLCB0cnVlKTtcblxuICAgIHJldHVybiBjaGFpbmVkQ2hlY2tUeXBlO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoZXhwZWN0ZWRUeXBlKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSBleHBlY3RlZFR5cGUpIHtcbiAgICAgICAgLy8gYHByb3BWYWx1ZWAgYmVpbmcgaW5zdGFuY2Ugb2YsIHNheSwgZGF0ZS9yZWdleHAsIHBhc3MgdGhlICdvYmplY3QnXG4gICAgICAgIC8vIGNoZWNrLCBidXQgd2UgY2FuIG9mZmVyIGEgbW9yZSBwcmVjaXNlIGVycm9yIG1lc3NhZ2UgaGVyZSByYXRoZXIgdGhhblxuICAgICAgICAvLyAnb2YgdHlwZSBgb2JqZWN0YCcuXG4gICAgICAgIHZhciBwcmVjaXNlVHlwZSA9IGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJlY2lzZVR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2AnICsgZXhwZWN0ZWRUeXBlICsgJ2AuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpIHtcbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIoZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbCk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdQcm9wZXJ0eSBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBoYXMgaW52YWxpZCBQcm9wVHlwZSBub3RhdGlvbiBpbnNpZGUgYXJyYXlPZi4nKTtcbiAgICAgIH1cbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBhcnJheS4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BWYWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnWycgKyBpICsgJ10nLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRUeXBlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIWlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBzaW5nbGUgUmVhY3RFbGVtZW50LicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudFR5cGVUeXBlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIVJlYWN0SXMuaXNWYWxpZEVsZW1lbnRUeXBlKHByb3BWYWx1ZSkpIHtcbiAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBzaW5nbGUgUmVhY3RFbGVtZW50IHR5cGUuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVJbnN0YW5jZVR5cGVDaGVja2VyKGV4cGVjdGVkQ2xhc3MpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICghKHByb3BzW3Byb3BOYW1lXSBpbnN0YW5jZW9mIGV4cGVjdGVkQ2xhc3MpKSB7XG4gICAgICAgIHZhciBleHBlY3RlZENsYXNzTmFtZSA9IGV4cGVjdGVkQ2xhc3MubmFtZSB8fCBBTk9OWU1PVVM7XG4gICAgICAgIHZhciBhY3R1YWxDbGFzc05hbWUgPSBnZXRDbGFzc05hbWUocHJvcHNbcHJvcE5hbWVdKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgYWN0dWFsQ2xhc3NOYW1lICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkICcpICsgKCdpbnN0YW5jZSBvZiBgJyArIGV4cGVjdGVkQ2xhc3NOYW1lICsgJ2AuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbnVtVHlwZUNoZWNrZXIoZXhwZWN0ZWRWYWx1ZXMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZXhwZWN0ZWRWYWx1ZXMpKSB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBwcmludFdhcm5pbmcoXG4gICAgICAgICAgICAnSW52YWxpZCBhcmd1bWVudHMgc3VwcGxpZWQgdG8gb25lT2YsIGV4cGVjdGVkIGFuIGFycmF5LCBnb3QgJyArIGFyZ3VtZW50cy5sZW5ndGggKyAnIGFyZ3VtZW50cy4gJyArXG4gICAgICAgICAgICAnQSBjb21tb24gbWlzdGFrZSBpcyB0byB3cml0ZSBvbmVPZih4LCB5LCB6KSBpbnN0ZWFkIG9mIG9uZU9mKFt4LCB5LCB6XSkuJ1xuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJpbnRXYXJuaW5nKCdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mLCBleHBlY3RlZCBhbiBhcnJheS4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBleHBlY3RlZFZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaXMocHJvcFZhbHVlLCBleHBlY3RlZFZhbHVlc1tpXSkpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgdmFsdWVzU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZXhwZWN0ZWRWYWx1ZXMsIGZ1bmN0aW9uIHJlcGxhY2VyKGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGdldFByb3BUeXBlKHZhbHVlKSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdmFsdWUgYCcgKyBTdHJpbmcocHJvcFZhbHVlKSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBvbmUgb2YgJyArIHZhbHVlc1N0cmluZyArICcuJykpO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlT2JqZWN0T2ZUeXBlQ2hlY2tlcih0eXBlQ2hlY2tlcikge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiB0eXBlQ2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1Byb3BlcnR5IGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgY29tcG9uZW50IGAnICsgY29tcG9uZW50TmFtZSArICdgIGhhcyBpbnZhbGlkIFByb3BUeXBlIG5vdGF0aW9uIGluc2lkZSBvYmplY3RPZi4nKTtcbiAgICAgIH1cbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBvYmplY3QuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIga2V5IGluIHByb3BWYWx1ZSkge1xuICAgICAgICBpZiAoaGFzKHByb3BWYWx1ZSwga2V5KSkge1xuICAgICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwga2V5LCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJy4nICsga2V5LCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlVW5pb25UeXBlQ2hlY2tlcihhcnJheU9mVHlwZUNoZWNrZXJzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5T2ZUeXBlQ2hlY2tlcnMpKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gcHJpbnRXYXJuaW5nKCdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mVHlwZSwgZXhwZWN0ZWQgYW4gaW5zdGFuY2Ugb2YgYXJyYXkuJykgOiB2b2lkIDA7XG4gICAgICByZXR1cm4gZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbDtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5T2ZUeXBlQ2hlY2tlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGVja2VyID0gYXJyYXlPZlR5cGVDaGVja2Vyc1tpXTtcbiAgICAgIGlmICh0eXBlb2YgY2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwcmludFdhcm5pbmcoXG4gICAgICAgICAgJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2ZUeXBlLiBFeHBlY3RlZCBhbiBhcnJheSBvZiBjaGVjayBmdW5jdGlvbnMsIGJ1dCAnICtcbiAgICAgICAgICAncmVjZWl2ZWQgJyArIGdldFBvc3RmaXhGb3JUeXBlV2FybmluZyhjaGVja2VyKSArICcgYXQgaW5kZXggJyArIGkgKyAnLidcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5T2ZUeXBlQ2hlY2tlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBhcnJheU9mVHlwZUNoZWNrZXJzW2ldO1xuICAgICAgICBpZiAoY2hlY2tlcihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KSA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBzdXBwbGllZCB0byAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYC4nKSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVOb2RlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICghaXNOb2RlKHByb3BzW3Byb3BOYW1lXSkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBzdXBwbGllZCB0byAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBSZWFjdE5vZGUuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVTaGFwZVR5cGVDaGVja2VyKHNoYXBlVHlwZXMpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgYCcgKyBwcm9wVHlwZSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBgb2JqZWN0YC4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBrZXkgaW4gc2hhcGVUeXBlcykge1xuICAgICAgICB2YXIgY2hlY2tlciA9IHNoYXBlVHlwZXNba2V5XTtcbiAgICAgICAgaWYgKCFjaGVja2VyKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVycm9yID0gY2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlU3RyaWN0U2hhcGVUeXBlQ2hlY2tlcihzaGFwZVR5cGVzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlIGAnICsgcHJvcFR5cGUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYG9iamVjdGAuJykpO1xuICAgICAgfVxuICAgICAgLy8gV2UgbmVlZCB0byBjaGVjayBhbGwga2V5cyBpbiBjYXNlIHNvbWUgYXJlIHJlcXVpcmVkIGJ1dCBtaXNzaW5nIGZyb21cbiAgICAgIC8vIHByb3BzLlxuICAgICAgdmFyIGFsbEtleXMgPSBhc3NpZ24oe30sIHByb3BzW3Byb3BOYW1lXSwgc2hhcGVUeXBlcyk7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gYWxsS2V5cykge1xuICAgICAgICB2YXIgY2hlY2tlciA9IHNoYXBlVHlwZXNba2V5XTtcbiAgICAgICAgaWYgKCFjaGVja2VyKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKFxuICAgICAgICAgICAgJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGtleSBgJyArIGtleSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLicgK1xuICAgICAgICAgICAgJ1xcbkJhZCBvYmplY3Q6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wc1twcm9wTmFtZV0sIG51bGwsICcgICcpICtcbiAgICAgICAgICAgICdcXG5WYWxpZCBrZXlzOiAnICsgIEpTT04uc3RyaW5naWZ5KE9iamVjdC5rZXlzKHNoYXBlVHlwZXMpLCBudWxsLCAnICAnKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVycm9yID0gY2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc05vZGUocHJvcFZhbHVlKSB7XG4gICAgc3dpdGNoICh0eXBlb2YgcHJvcFZhbHVlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIHJldHVybiAhcHJvcFZhbHVlO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiBwcm9wVmFsdWUuZXZlcnkoaXNOb2RlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcFZhbHVlID09PSBudWxsIHx8IGlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihwcm9wVmFsdWUpO1xuICAgICAgICBpZiAoaXRlcmF0b3JGbikge1xuICAgICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChwcm9wVmFsdWUpO1xuICAgICAgICAgIHZhciBzdGVwO1xuICAgICAgICAgIGlmIChpdGVyYXRvckZuICE9PSBwcm9wVmFsdWUuZW50cmllcykge1xuICAgICAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgICAgICBpZiAoIWlzTm9kZShzdGVwLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJdGVyYXRvciB3aWxsIHByb3ZpZGUgZW50cnkgW2ssdl0gdHVwbGVzIHJhdGhlciB0aGFuIHZhbHVlcy5cbiAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc05vZGUoZW50cnlbMV0pKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpIHtcbiAgICAvLyBOYXRpdmUgU3ltYm9sLlxuICAgIGlmIChwcm9wVHlwZSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ10gPT09ICdTeW1ib2wnXG4gICAgaWYgKHByb3BWYWx1ZVsnQEB0b1N0cmluZ1RhZyddID09PSAnU3ltYm9sJykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gRmFsbGJhY2sgZm9yIG5vbi1zcGVjIGNvbXBsaWFudCBTeW1ib2xzIHdoaWNoIGFyZSBwb2x5ZmlsbGVkLlxuICAgIGlmICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHByb3BWYWx1ZSBpbnN0YW5jZW9mIFN5bWJvbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gRXF1aXZhbGVudCBvZiBgdHlwZW9mYCBidXQgd2l0aCBzcGVjaWFsIGhhbmRsaW5nIGZvciBhcnJheSBhbmQgcmVnZXhwLlxuICBmdW5jdGlvbiBnZXRQcm9wVHlwZShwcm9wVmFsdWUpIHtcbiAgICB2YXIgcHJvcFR5cGUgPSB0eXBlb2YgcHJvcFZhbHVlO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgIHJldHVybiAnYXJyYXknO1xuICAgIH1cbiAgICBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAvLyBPbGQgd2Via2l0cyAoYXQgbGVhc3QgdW50aWwgQW5kcm9pZCA0LjApIHJldHVybiAnZnVuY3Rpb24nIHJhdGhlciB0aGFuXG4gICAgICAvLyAnb2JqZWN0JyBmb3IgdHlwZW9mIGEgUmVnRXhwLiBXZSdsbCBub3JtYWxpemUgdGhpcyBoZXJlIHNvIHRoYXQgL2JsYS9cbiAgICAgIC8vIHBhc3NlcyBQcm9wVHlwZXMub2JqZWN0LlxuICAgICAgcmV0dXJuICdvYmplY3QnO1xuICAgIH1cbiAgICBpZiAoaXNTeW1ib2wocHJvcFR5cGUsIHByb3BWYWx1ZSkpIHtcbiAgICAgIHJldHVybiAnc3ltYm9sJztcbiAgICB9XG4gICAgcmV0dXJuIHByb3BUeXBlO1xuICB9XG5cbiAgLy8gVGhpcyBoYW5kbGVzIG1vcmUgdHlwZXMgdGhhbiBgZ2V0UHJvcFR5cGVgLiBPbmx5IHVzZWQgZm9yIGVycm9yIG1lc3NhZ2VzLlxuICAvLyBTZWUgYGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyYC5cbiAgZnVuY3Rpb24gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiBwcm9wVmFsdWUgPT09ICd1bmRlZmluZWQnIHx8IHByb3BWYWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuICcnICsgcHJvcFZhbHVlO1xuICAgIH1cbiAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgIGlmIChwcm9wVHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIHJldHVybiAnZGF0ZSc7XG4gICAgICB9IGVsc2UgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICByZXR1cm4gJ3JlZ2V4cCc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwcm9wVHlwZTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyBwb3N0Zml4ZWQgdG8gYSB3YXJuaW5nIGFib3V0IGFuIGludmFsaWQgdHlwZS5cbiAgLy8gRm9yIGV4YW1wbGUsIFwidW5kZWZpbmVkXCIgb3IgXCJvZiB0eXBlIGFycmF5XCJcbiAgZnVuY3Rpb24gZ2V0UG9zdGZpeEZvclR5cGVXYXJuaW5nKHZhbHVlKSB7XG4gICAgdmFyIHR5cGUgPSBnZXRQcmVjaXNlVHlwZSh2YWx1ZSk7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdhcnJheSc6XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICByZXR1cm4gJ2FuICcgKyB0eXBlO1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgIGNhc2UgJ3JlZ2V4cCc6XG4gICAgICAgIHJldHVybiAnYSAnICsgdHlwZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB0eXBlO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJldHVybnMgY2xhc3MgbmFtZSBvZiB0aGUgb2JqZWN0LCBpZiBhbnkuXG4gIGZ1bmN0aW9uIGdldENsYXNzTmFtZShwcm9wVmFsdWUpIHtcbiAgICBpZiAoIXByb3BWYWx1ZS5jb25zdHJ1Y3RvciB8fCAhcHJvcFZhbHVlLmNvbnN0cnVjdG9yLm5hbWUpIHtcbiAgICAgIHJldHVybiBBTk9OWU1PVVM7XG4gICAgfVxuICAgIHJldHVybiBwcm9wVmFsdWUuY29uc3RydWN0b3IubmFtZTtcbiAgfVxuXG4gIFJlYWN0UHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzID0gY2hlY2tQcm9wVHlwZXM7XG4gIFJlYWN0UHJvcFR5cGVzLnJlc2V0V2FybmluZ0NhY2hlID0gY2hlY2tQcm9wVHlwZXMucmVzZXRXYXJuaW5nQ2FjaGU7XG4gIFJlYWN0UHJvcFR5cGVzLlByb3BUeXBlcyA9IFJlYWN0UHJvcFR5cGVzO1xuXG4gIHJldHVybiBSZWFjdFByb3BUeXBlcztcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBSZWFjdElzID0gcmVxdWlyZSgncmVhY3QtaXMnKTtcblxuICAvLyBCeSBleHBsaWNpdGx5IHVzaW5nIGBwcm9wLXR5cGVzYCB5b3UgYXJlIG9wdGluZyBpbnRvIG5ldyBkZXZlbG9wbWVudCBiZWhhdmlvci5cbiAgLy8gaHR0cDovL2ZiLm1lL3Byb3AtdHlwZXMtaW4tcHJvZFxuICB2YXIgdGhyb3dPbkRpcmVjdEFjY2VzcyA9IHRydWU7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9mYWN0b3J5V2l0aFR5cGVDaGVja2VycycpKFJlYWN0SXMuaXNFbGVtZW50LCB0aHJvd09uRGlyZWN0QWNjZXNzKTtcbn0gZWxzZSB7XG4gIC8vIEJ5IGV4cGxpY2l0bHkgdXNpbmcgYHByb3AtdHlwZXNgIHlvdSBhcmUgb3B0aW5nIGludG8gbmV3IHByb2R1Y3Rpb24gYmVoYXZpb3IuXG4gIC8vIGh0dHA6Ly9mYi5tZS9wcm9wLXR5cGVzLWluLXByb2RcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcycpKCk7XG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gJ1NFQ1JFVF9ET19OT1RfUEFTU19USElTX09SX1lPVV9XSUxMX0JFX0ZJUkVEJztcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdFByb3BUeXBlc1NlY3JldDtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID1cbiAgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLmZvciAmJiBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykpIHx8XG4gIDB4ZWFjNztcblxudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eUZ1bmN0aW9uJyk7XG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG52YXIgd2FybmluZyA9IHJlcXVpcmUoJ2ZianMvbGliL3dhcm5pbmcnKTtcblxudmFyIFNFUEFSQVRPUiA9ICcuJztcbnZhciBTVUJTRVBBUkFUT1IgPSAnOic7XG5cbnZhciBkaWRXYXJuQWJvdXRNYXBzID0gZmFsc2U7XG5cbnZhciBJVEVSQVRPUl9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5pdGVyYXRvcjtcbnZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9ICdAQGl0ZXJhdG9yJzsgLy8gQmVmb3JlIFN5bWJvbCBzcGVjLlxuXG5mdW5jdGlvbiBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpIHtcbiAgdmFyIGl0ZXJhdG9yRm4gPVxuICAgIG1heWJlSXRlcmFibGUgJiZcbiAgICAoKElURVJBVE9SX1NZTUJPTCAmJiBtYXliZUl0ZXJhYmxlW0lURVJBVE9SX1NZTUJPTF0pIHx8XG4gICAgICBtYXliZUl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXSk7XG4gIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBpdGVyYXRvckZuO1xuICB9XG59XG5cbmZ1bmN0aW9uIGVzY2FwZShrZXkpIHtcbiAgdmFyIGVzY2FwZVJlZ2V4ID0gL1s9Ol0vZztcbiAgdmFyIGVzY2FwZXJMb29rdXAgPSB7XG4gICAgJz0nOiAnPTAnLFxuICAgICc6JzogJz0yJ1xuICB9O1xuICB2YXIgZXNjYXBlZFN0cmluZyA9ICgnJyArIGtleSkucmVwbGFjZShlc2NhcGVSZWdleCwgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICByZXR1cm4gZXNjYXBlckxvb2t1cFttYXRjaF07XG4gIH0pO1xuXG4gIHJldHVybiAnJCcgKyBlc2NhcGVkU3RyaW5nO1xufVxuXG5mdW5jdGlvbiBnZXRDb21wb25lbnRLZXkoY29tcG9uZW50LCBpbmRleCkge1xuICAvLyBEbyBzb21lIHR5cGVjaGVja2luZyBoZXJlIHNpbmNlIHdlIGNhbGwgdGhpcyBibGluZGx5LiBXZSB3YW50IHRvIGVuc3VyZVxuICAvLyB0aGF0IHdlIGRvbid0IGJsb2NrIHBvdGVudGlhbCBmdXR1cmUgRVMgQVBJcy5cbiAgaWYgKGNvbXBvbmVudCAmJiB0eXBlb2YgY29tcG9uZW50ID09PSAnb2JqZWN0JyAmJiBjb21wb25lbnQua2V5ICE9IG51bGwpIHtcbiAgICAvLyBFeHBsaWNpdCBrZXlcbiAgICByZXR1cm4gZXNjYXBlKGNvbXBvbmVudC5rZXkpO1xuICB9XG4gIC8vIEltcGxpY2l0IGtleSBkZXRlcm1pbmVkIGJ5IHRoZSBpbmRleCBpbiB0aGUgc2V0XG4gIHJldHVybiBpbmRleC50b1N0cmluZygzNik7XG59XG5cbmZ1bmN0aW9uIHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKFxuICBjaGlsZHJlbixcbiAgbmFtZVNvRmFyLFxuICBjYWxsYmFjayxcbiAgdHJhdmVyc2VDb250ZXh0XG4pIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgY2hpbGRyZW47XG5cbiAgaWYgKHR5cGUgPT09ICd1bmRlZmluZWQnIHx8IHR5cGUgPT09ICdib29sZWFuJykge1xuICAgIC8vIEFsbCBvZiB0aGUgYWJvdmUgYXJlIHBlcmNlaXZlZCBhcyBudWxsLlxuICAgIGNoaWxkcmVuID0gbnVsbDtcbiAgfVxuXG4gIGlmIChcbiAgICBjaGlsZHJlbiA9PT0gbnVsbCB8fFxuICAgIHR5cGUgPT09ICdzdHJpbmcnIHx8XG4gICAgdHlwZSA9PT0gJ251bWJlcicgfHxcbiAgICAvLyBUaGUgZm9sbG93aW5nIGlzIGlubGluZWQgZnJvbSBSZWFjdEVsZW1lbnQuIFRoaXMgbWVhbnMgd2UgY2FuIG9wdGltaXplXG4gICAgLy8gc29tZSBjaGVja3MuIFJlYWN0IEZpYmVyIGFsc28gaW5saW5lcyB0aGlzIGxvZ2ljIGZvciBzaW1pbGFyIHB1cnBvc2VzLlxuICAgICh0eXBlID09PSAnb2JqZWN0JyAmJiBjaGlsZHJlbi4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFKVxuICApIHtcbiAgICBjYWxsYmFjayhcbiAgICAgIHRyYXZlcnNlQ29udGV4dCxcbiAgICAgIGNoaWxkcmVuLFxuICAgICAgLy8gSWYgaXQncyB0aGUgb25seSBjaGlsZCwgdHJlYXQgdGhlIG5hbWUgYXMgaWYgaXQgd2FzIHdyYXBwZWQgaW4gYW4gYXJyYXlcbiAgICAgIC8vIHNvIHRoYXQgaXQncyBjb25zaXN0ZW50IGlmIHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gZ3Jvd3MuXG4gICAgICBuYW1lU29GYXIgPT09ICcnID8gU0VQQVJBVE9SICsgZ2V0Q29tcG9uZW50S2V5KGNoaWxkcmVuLCAwKSA6IG5hbWVTb0ZhclxuICAgICk7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICB2YXIgY2hpbGQ7XG4gIHZhciBuZXh0TmFtZTtcbiAgdmFyIHN1YnRyZWVDb3VudCA9IDA7IC8vIENvdW50IG9mIGNoaWxkcmVuIGZvdW5kIGluIHRoZSBjdXJyZW50IHN1YnRyZWUuXG4gIHZhciBuZXh0TmFtZVByZWZpeCA9IG5hbWVTb0ZhciA9PT0gJycgPyBTRVBBUkFUT1IgOiBuYW1lU29GYXIgKyBTVUJTRVBBUkFUT1I7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgIG5leHROYW1lID0gbmV4dE5hbWVQcmVmaXggKyBnZXRDb21wb25lbnRLZXkoY2hpbGQsIGkpO1xuICAgICAgc3VidHJlZUNvdW50ICs9IHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKFxuICAgICAgICBjaGlsZCxcbiAgICAgICAgbmV4dE5hbWUsXG4gICAgICAgIGNhbGxiYWNrLFxuICAgICAgICB0cmF2ZXJzZUNvbnRleHRcbiAgICAgICk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihjaGlsZHJlbik7XG4gICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIC8vIFdhcm4gYWJvdXQgdXNpbmcgTWFwcyBhcyBjaGlsZHJlblxuICAgICAgICBpZiAoaXRlcmF0b3JGbiA9PT0gY2hpbGRyZW4uZW50cmllcykge1xuICAgICAgICAgIHdhcm5pbmcoXG4gICAgICAgICAgICBkaWRXYXJuQWJvdXRNYXBzLFxuICAgICAgICAgICAgJ1VzaW5nIE1hcHMgYXMgY2hpbGRyZW4gaXMgdW5zdXBwb3J0ZWQgYW5kIHdpbGwgbGlrZWx5IHlpZWxkICcgK1xuICAgICAgICAgICAgICAndW5leHBlY3RlZCByZXN1bHRzLiBDb252ZXJ0IGl0IHRvIGEgc2VxdWVuY2UvaXRlcmFibGUgb2Yga2V5ZWQgJyArXG4gICAgICAgICAgICAgICdSZWFjdEVsZW1lbnRzIGluc3RlYWQuJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgZGlkV2FybkFib3V0TWFwcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKGNoaWxkcmVuKTtcbiAgICAgIHZhciBzdGVwO1xuICAgICAgdmFyIGlpID0gMDtcbiAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgY2hpbGQgPSBzdGVwLnZhbHVlO1xuICAgICAgICBuZXh0TmFtZSA9IG5leHROYW1lUHJlZml4ICsgZ2V0Q29tcG9uZW50S2V5KGNoaWxkLCBpaSsrKTtcbiAgICAgICAgc3VidHJlZUNvdW50ICs9IHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKFxuICAgICAgICAgIGNoaWxkLFxuICAgICAgICAgIG5leHROYW1lLFxuICAgICAgICAgIGNhbGxiYWNrLFxuICAgICAgICAgIHRyYXZlcnNlQ29udGV4dFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHZhciBhZGRlbmR1bSA9ICcnO1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgYWRkZW5kdW0gPVxuICAgICAgICAgICcgSWYgeW91IG1lYW50IHRvIHJlbmRlciBhIGNvbGxlY3Rpb24gb2YgY2hpbGRyZW4sIHVzZSBhbiBhcnJheSAnICtcbiAgICAgICAgICAnaW5zdGVhZCBvciB3cmFwIHRoZSBvYmplY3QgdXNpbmcgY3JlYXRlRnJhZ21lbnQob2JqZWN0KSBmcm9tIHRoZSAnICtcbiAgICAgICAgICAnUmVhY3QgYWRkLW9ucy4nO1xuICAgICAgfVxuICAgICAgdmFyIGNoaWxkcmVuU3RyaW5nID0gJycgKyBjaGlsZHJlbjtcbiAgICAgIGludmFyaWFudChcbiAgICAgICAgZmFsc2UsXG4gICAgICAgICdPYmplY3RzIGFyZSBub3QgdmFsaWQgYXMgYSBSZWFjdCBjaGlsZCAoZm91bmQ6ICVzKS4lcycsXG4gICAgICAgIGNoaWxkcmVuU3RyaW5nID09PSAnW29iamVjdCBPYmplY3RdJ1xuICAgICAgICAgID8gJ29iamVjdCB3aXRoIGtleXMgeycgKyBPYmplY3Qua2V5cyhjaGlsZHJlbikuam9pbignLCAnKSArICd9J1xuICAgICAgICAgIDogY2hpbGRyZW5TdHJpbmcsXG4gICAgICAgIGFkZGVuZHVtXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzdWJ0cmVlQ291bnQ7XG59XG5cbmZ1bmN0aW9uIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpIHtcbiAgaWYgKGNoaWxkcmVuID09IG51bGwpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHJldHVybiB0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbChjaGlsZHJlbiwgJycsIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpO1xufVxuXG52YXIgdXNlclByb3ZpZGVkS2V5RXNjYXBlUmVnZXggPSAvXFwvKy9nO1xuZnVuY3Rpb24gZXNjYXBlVXNlclByb3ZpZGVkS2V5KHRleHQpIHtcbiAgcmV0dXJuICgnJyArIHRleHQpLnJlcGxhY2UodXNlclByb3ZpZGVkS2V5RXNjYXBlUmVnZXgsICckJi8nKTtcbn1cblxuZnVuY3Rpb24gY2xvbmVBbmRSZXBsYWNlS2V5KG9sZEVsZW1lbnQsIG5ld0tleSkge1xuICByZXR1cm4gUmVhY3QuY2xvbmVFbGVtZW50KFxuICAgIG9sZEVsZW1lbnQsXG4gICAge2tleTogbmV3S2V5fSxcbiAgICBvbGRFbGVtZW50LnByb3BzICE9PSB1bmRlZmluZWQgPyBvbGRFbGVtZW50LnByb3BzLmNoaWxkcmVuIDogdW5kZWZpbmVkXG4gICk7XG59XG5cbnZhciBERUZBVUxUX1BPT0xfU0laRSA9IDEwO1xudmFyIERFRkFVTFRfUE9PTEVSID0gb25lQXJndW1lbnRQb29sZXI7XG5cbnZhciBvbmVBcmd1bWVudFBvb2xlciA9IGZ1bmN0aW9uKGNvcHlGaWVsZHNGcm9tKSB7XG4gIHZhciBLbGFzcyA9IHRoaXM7XG4gIGlmIChLbGFzcy5pbnN0YW5jZVBvb2wubGVuZ3RoKSB7XG4gICAgdmFyIGluc3RhbmNlID0gS2xhc3MuaW5zdGFuY2VQb29sLnBvcCgpO1xuICAgIEtsYXNzLmNhbGwoaW5zdGFuY2UsIGNvcHlGaWVsZHNGcm9tKTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBLbGFzcyhjb3B5RmllbGRzRnJvbSk7XG4gIH1cbn07XG5cbnZhciBhZGRQb29saW5nVG8gPSBmdW5jdGlvbiBhZGRQb29saW5nVG8oQ29weUNvbnN0cnVjdG9yLCBwb29sZXIpIHtcbiAgLy8gQ2FzdGluZyBhcyBhbnkgc28gdGhhdCBmbG93IGlnbm9yZXMgdGhlIGFjdHVhbCBpbXBsZW1lbnRhdGlvbiBhbmQgdHJ1c3RzXG4gIC8vIGl0IHRvIG1hdGNoIHRoZSB0eXBlIHdlIGRlY2xhcmVkXG4gIHZhciBOZXdLbGFzcyA9IENvcHlDb25zdHJ1Y3RvcjtcbiAgTmV3S2xhc3MuaW5zdGFuY2VQb29sID0gW107XG4gIE5ld0tsYXNzLmdldFBvb2xlZCA9IHBvb2xlciB8fCBERUZBVUxUX1BPT0xFUjtcbiAgaWYgKCFOZXdLbGFzcy5wb29sU2l6ZSkge1xuICAgIE5ld0tsYXNzLnBvb2xTaXplID0gREVGQVVMVF9QT09MX1NJWkU7XG4gIH1cbiAgTmV3S2xhc3MucmVsZWFzZSA9IHN0YW5kYXJkUmVsZWFzZXI7XG4gIHJldHVybiBOZXdLbGFzcztcbn07XG5cbnZhciBzdGFuZGFyZFJlbGVhc2VyID0gZnVuY3Rpb24gc3RhbmRhcmRSZWxlYXNlcihpbnN0YW5jZSkge1xuICB2YXIgS2xhc3MgPSB0aGlzO1xuICBpbnZhcmlhbnQoXG4gICAgaW5zdGFuY2UgaW5zdGFuY2VvZiBLbGFzcyxcbiAgICAnVHJ5aW5nIHRvIHJlbGVhc2UgYW4gaW5zdGFuY2UgaW50byBhIHBvb2wgb2YgYSBkaWZmZXJlbnQgdHlwZS4nXG4gICk7XG4gIGluc3RhbmNlLmRlc3RydWN0b3IoKTtcbiAgaWYgKEtsYXNzLmluc3RhbmNlUG9vbC5sZW5ndGggPCBLbGFzcy5wb29sU2l6ZSkge1xuICAgIEtsYXNzLmluc3RhbmNlUG9vbC5wdXNoKGluc3RhbmNlKTtcbiAgfVxufTtcblxudmFyIGZvdXJBcmd1bWVudFBvb2xlciA9IGZ1bmN0aW9uIGZvdXJBcmd1bWVudFBvb2xlcihhMSwgYTIsIGEzLCBhNCkge1xuICB2YXIgS2xhc3MgPSB0aGlzO1xuICBpZiAoS2xhc3MuaW5zdGFuY2VQb29sLmxlbmd0aCkge1xuICAgIHZhciBpbnN0YW5jZSA9IEtsYXNzLmluc3RhbmNlUG9vbC5wb3AoKTtcbiAgICBLbGFzcy5jYWxsKGluc3RhbmNlLCBhMSwgYTIsIGEzLCBhNCk7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgS2xhc3MoYTEsIGEyLCBhMywgYTQpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBNYXBCb29rS2VlcGluZyhtYXBSZXN1bHQsIGtleVByZWZpeCwgbWFwRnVuY3Rpb24sIG1hcENvbnRleHQpIHtcbiAgdGhpcy5yZXN1bHQgPSBtYXBSZXN1bHQ7XG4gIHRoaXMua2V5UHJlZml4ID0ga2V5UHJlZml4O1xuICB0aGlzLmZ1bmMgPSBtYXBGdW5jdGlvbjtcbiAgdGhpcy5jb250ZXh0ID0gbWFwQ29udGV4dDtcbiAgdGhpcy5jb3VudCA9IDA7XG59XG5NYXBCb29rS2VlcGluZy5wcm90b3R5cGUuZGVzdHJ1Y3RvciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnJlc3VsdCA9IG51bGw7XG4gIHRoaXMua2V5UHJlZml4ID0gbnVsbDtcbiAgdGhpcy5mdW5jID0gbnVsbDtcbiAgdGhpcy5jb250ZXh0ID0gbnVsbDtcbiAgdGhpcy5jb3VudCA9IDA7XG59O1xuYWRkUG9vbGluZ1RvKE1hcEJvb2tLZWVwaW5nLCBmb3VyQXJndW1lbnRQb29sZXIpO1xuXG5mdW5jdGlvbiBtYXBTaW5nbGVDaGlsZEludG9Db250ZXh0KGJvb2tLZWVwaW5nLCBjaGlsZCwgY2hpbGRLZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGJvb2tLZWVwaW5nLnJlc3VsdDtcbiAgdmFyIGtleVByZWZpeCA9IGJvb2tLZWVwaW5nLmtleVByZWZpeDtcbiAgdmFyIGZ1bmMgPSBib29rS2VlcGluZy5mdW5jO1xuICB2YXIgY29udGV4dCA9IGJvb2tLZWVwaW5nLmNvbnRleHQ7XG5cbiAgdmFyIG1hcHBlZENoaWxkID0gZnVuYy5jYWxsKGNvbnRleHQsIGNoaWxkLCBib29rS2VlcGluZy5jb3VudCsrKTtcbiAgaWYgKEFycmF5LmlzQXJyYXkobWFwcGVkQ2hpbGQpKSB7XG4gICAgbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChcbiAgICAgIG1hcHBlZENoaWxkLFxuICAgICAgcmVzdWx0LFxuICAgICAgY2hpbGRLZXksXG4gICAgICBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zQXJndW1lbnRcbiAgICApO1xuICB9IGVsc2UgaWYgKG1hcHBlZENoaWxkICE9IG51bGwpIHtcbiAgICBpZiAoUmVhY3QuaXNWYWxpZEVsZW1lbnQobWFwcGVkQ2hpbGQpKSB7XG4gICAgICBtYXBwZWRDaGlsZCA9IGNsb25lQW5kUmVwbGFjZUtleShcbiAgICAgICAgbWFwcGVkQ2hpbGQsXG4gICAgICAgIC8vIEtlZXAgYm90aCB0aGUgKG1hcHBlZCkgYW5kIG9sZCBrZXlzIGlmIHRoZXkgZGlmZmVyLCBqdXN0IGFzXG4gICAgICAgIC8vIHRyYXZlcnNlQWxsQ2hpbGRyZW4gdXNlZCB0byBkbyBmb3Igb2JqZWN0cyBhcyBjaGlsZHJlblxuICAgICAgICBrZXlQcmVmaXggK1xuICAgICAgICAgIChtYXBwZWRDaGlsZC5rZXkgJiYgKCFjaGlsZCB8fCBjaGlsZC5rZXkgIT09IG1hcHBlZENoaWxkLmtleSlcbiAgICAgICAgICAgID8gZXNjYXBlVXNlclByb3ZpZGVkS2V5KG1hcHBlZENoaWxkLmtleSkgKyAnLydcbiAgICAgICAgICAgIDogJycpICtcbiAgICAgICAgICBjaGlsZEtleVxuICAgICAgKTtcbiAgICB9XG4gICAgcmVzdWx0LnB1c2gobWFwcGVkQ2hpbGQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWwoY2hpbGRyZW4sIGFycmF5LCBwcmVmaXgsIGZ1bmMsIGNvbnRleHQpIHtcbiAgdmFyIGVzY2FwZWRQcmVmaXggPSAnJztcbiAgaWYgKHByZWZpeCAhPSBudWxsKSB7XG4gICAgZXNjYXBlZFByZWZpeCA9IGVzY2FwZVVzZXJQcm92aWRlZEtleShwcmVmaXgpICsgJy8nO1xuICB9XG4gIHZhciB0cmF2ZXJzZUNvbnRleHQgPSBNYXBCb29rS2VlcGluZy5nZXRQb29sZWQoXG4gICAgYXJyYXksXG4gICAgZXNjYXBlZFByZWZpeCxcbiAgICBmdW5jLFxuICAgIGNvbnRleHRcbiAgKTtcbiAgdHJhdmVyc2VBbGxDaGlsZHJlbihjaGlsZHJlbiwgbWFwU2luZ2xlQ2hpbGRJbnRvQ29udGV4dCwgdHJhdmVyc2VDb250ZXh0KTtcbiAgTWFwQm9va0tlZXBpbmcucmVsZWFzZSh0cmF2ZXJzZUNvbnRleHQpO1xufVxuXG52YXIgbnVtZXJpY1Byb3BlcnR5UmVnZXggPSAvXlxcZCskLztcblxudmFyIHdhcm5lZEFib3V0TnVtZXJpYyA9IGZhbHNlO1xuXG5mdW5jdGlvbiBjcmVhdGVSZWFjdEZyYWdtZW50KG9iamVjdCkge1xuICBpZiAodHlwZW9mIG9iamVjdCAhPT0gJ29iamVjdCcgfHwgIW9iamVjdCB8fCBBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcbiAgICB3YXJuaW5nKFxuICAgICAgZmFsc2UsXG4gICAgICAnUmVhY3QuYWRkb25zLmNyZWF0ZUZyYWdtZW50IG9ubHkgYWNjZXB0cyBhIHNpbmdsZSBvYmplY3QuIEdvdDogJXMnLFxuICAgICAgb2JqZWN0XG4gICAgKTtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG4gIGlmIChSZWFjdC5pc1ZhbGlkRWxlbWVudChvYmplY3QpKSB7XG4gICAgd2FybmluZyhcbiAgICAgIGZhbHNlLFxuICAgICAgJ1JlYWN0LmFkZG9ucy5jcmVhdGVGcmFnbWVudCBkb2VzIG5vdCBhY2NlcHQgYSBSZWFjdEVsZW1lbnQgJyArXG4gICAgICAgICd3aXRob3V0IGEgd3JhcHBlciBvYmplY3QuJ1xuICAgICk7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIGludmFyaWFudChcbiAgICBvYmplY3Qubm9kZVR5cGUgIT09IDEsXG4gICAgJ1JlYWN0LmFkZG9ucy5jcmVhdGVGcmFnbWVudCguLi4pOiBFbmNvdW50ZXJlZCBhbiBpbnZhbGlkIGNoaWxkOyBET00gJyArXG4gICAgICAnZWxlbWVudHMgYXJlIG5vdCB2YWxpZCBjaGlsZHJlbiBvZiBSZWFjdCBjb21wb25lbnRzLidcbiAgKTtcblxuICB2YXIgcmVzdWx0ID0gW107XG5cbiAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBpZiAoIXdhcm5lZEFib3V0TnVtZXJpYyAmJiBudW1lcmljUHJvcGVydHlSZWdleC50ZXN0KGtleSkpIHtcbiAgICAgICAgd2FybmluZyhcbiAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAnUmVhY3QuYWRkb25zLmNyZWF0ZUZyYWdtZW50KC4uLik6IENoaWxkIG9iamVjdHMgc2hvdWxkIGhhdmUgJyArXG4gICAgICAgICAgICAnbm9uLW51bWVyaWMga2V5cyBzbyBvcmRlcmluZyBpcyBwcmVzZXJ2ZWQuJ1xuICAgICAgICApO1xuICAgICAgICB3YXJuZWRBYm91dE51bWVyaWMgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKFxuICAgICAgb2JqZWN0W2tleV0sXG4gICAgICByZXN1bHQsXG4gICAgICBrZXksXG4gICAgICBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zQXJndW1lbnRcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVSZWFjdEZyYWdtZW50O1xuIiwiLyoqIEBsaWNlbnNlIFJlYWN0IHYxNi44LjFcbiAqIHJlYWN0LWlzLmRldmVsb3BtZW50LmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5cblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbi8vIFRoZSBTeW1ib2wgdXNlZCB0byB0YWcgdGhlIFJlYWN0RWxlbWVudC1saWtlIHR5cGVzLiBJZiB0aGVyZSBpcyBubyBuYXRpdmUgU3ltYm9sXG4vLyBub3IgcG9seWZpbGwsIHRoZW4gYSBwbGFpbiBudW1iZXIgaXMgdXNlZCBmb3IgcGVyZm9ybWFuY2UuXG52YXIgaGFzU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yO1xuXG52YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpIDogMHhlYWM3O1xudmFyIFJFQUNUX1BPUlRBTF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QucG9ydGFsJykgOiAweGVhY2E7XG52YXIgUkVBQ1RfRlJBR01FTlRfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmZyYWdtZW50JykgOiAweGVhY2I7XG52YXIgUkVBQ1RfU1RSSUNUX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnN0cmljdF9tb2RlJykgOiAweGVhY2M7XG52YXIgUkVBQ1RfUFJPRklMRVJfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnByb2ZpbGVyJykgOiAweGVhZDI7XG52YXIgUkVBQ1RfUFJPVklERVJfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnByb3ZpZGVyJykgOiAweGVhY2Q7XG52YXIgUkVBQ1RfQ09OVEVYVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuY29udGV4dCcpIDogMHhlYWNlO1xudmFyIFJFQUNUX0FTWU5DX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmFzeW5jX21vZGUnKSA6IDB4ZWFjZjtcbnZhciBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmNvbmN1cnJlbnRfbW9kZScpIDogMHhlYWNmO1xudmFyIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5mb3J3YXJkX3JlZicpIDogMHhlYWQwO1xudmFyIFJFQUNUX1NVU1BFTlNFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5zdXNwZW5zZScpIDogMHhlYWQxO1xudmFyIFJFQUNUX01FTU9fVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0Lm1lbW8nKSA6IDB4ZWFkMztcbnZhciBSRUFDVF9MQVpZX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5sYXp5JykgOiAweGVhZDQ7XG5cbmZ1bmN0aW9uIGlzVmFsaWRFbGVtZW50VHlwZSh0eXBlKSB7XG4gIHJldHVybiB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicgfHxcbiAgLy8gTm90ZTogaXRzIHR5cGVvZiBtaWdodCBiZSBvdGhlciB0aGFuICdzeW1ib2wnIG9yICdudW1iZXInIGlmIGl0J3MgYSBwb2x5ZmlsbC5cbiAgdHlwZSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9QUk9GSUxFUl9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1VTUEVOU0VfVFlQRSB8fCB0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgJiYgdHlwZSAhPT0gbnVsbCAmJiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTEFaWV9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9QUk9WSURFUl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0NPTlRFWFRfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFKTtcbn1cblxuLyoqXG4gKiBGb3JrZWQgZnJvbSBmYmpzL3dhcm5pbmc6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svZmJqcy9ibG9iL2U2NmJhMjBhZDViZTQzM2ViNTQ0MjNmMmIwOTdkODI5MzI0ZDlkZTYvcGFja2FnZXMvZmJqcy9zcmMvX19mb3Jrc19fL3dhcm5pbmcuanNcbiAqXG4gKiBPbmx5IGNoYW5nZSBpcyB3ZSB1c2UgY29uc29sZS53YXJuIGluc3RlYWQgb2YgY29uc29sZS5lcnJvcixcbiAqIGFuZCBkbyBub3RoaW5nIHdoZW4gJ2NvbnNvbGUnIGlzIG5vdCBzdXBwb3J0ZWQuXG4gKiBUaGlzIHJlYWxseSBzaW1wbGlmaWVzIHRoZSBjb2RlLlxuICogLS0tXG4gKiBTaW1pbGFyIHRvIGludmFyaWFudCBidXQgb25seSBsb2dzIGEgd2FybmluZyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXQuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGxvZyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzIGluIGNyaXRpY2FsXG4gKiBwYXRocy4gUmVtb3ZpbmcgdGhlIGxvZ2dpbmcgY29kZSBmb3IgcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMgd2lsbCBrZWVwIHRoZVxuICogc2FtZSBsb2dpYyBhbmQgZm9sbG93IHRoZSBzYW1lIGNvZGUgcGF0aHMuXG4gKi9cblxudmFyIGxvd1ByaW9yaXR5V2FybmluZyA9IGZ1bmN0aW9uICgpIHt9O1xuXG57XG4gIHZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9IGNhdGNoICh4KSB7fVxuICB9O1xuXG4gIGxvd1ByaW9yaXR5V2FybmluZyA9IGZ1bmN0aW9uIChjb25kaXRpb24sIGZvcm1hdCkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgbG93UHJpb3JpdHlXYXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0LCAuLi5hcmdzKWAgcmVxdWlyZXMgYSB3YXJuaW5nICcgKyAnbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgICBpZiAoIWNvbmRpdGlvbikge1xuICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAyID8gX2xlbjIgLSAyIDogMCksIF9rZXkyID0gMjsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICBhcmdzW19rZXkyIC0gMl0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgfVxuXG4gICAgICBwcmludFdhcm5pbmcuYXBwbHkodW5kZWZpbmVkLCBbZm9ybWF0XS5jb25jYXQoYXJncykpO1xuICAgIH1cbiAgfTtcbn1cblxudmFyIGxvd1ByaW9yaXR5V2FybmluZyQxID0gbG93UHJpb3JpdHlXYXJuaW5nO1xuXG5mdW5jdGlvbiB0eXBlT2Yob2JqZWN0KSB7XG4gIGlmICh0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QgIT09IG51bGwpIHtcbiAgICB2YXIgJCR0eXBlb2YgPSBvYmplY3QuJCR0eXBlb2Y7XG4gICAgc3dpdGNoICgkJHR5cGVvZikge1xuICAgICAgY2FzZSBSRUFDVF9FTEVNRU5UX1RZUEU6XG4gICAgICAgIHZhciB0eXBlID0gb2JqZWN0LnR5cGU7XG5cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgY2FzZSBSRUFDVF9BU1lOQ19NT0RFX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX0ZSQUdNRU5UX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9QUk9GSUxFUl9UWVBFOlxuICAgICAgICAgIGNhc2UgUkVBQ1RfU1RSSUNUX01PREVfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX1RZUEU6XG4gICAgICAgICAgICByZXR1cm4gdHlwZTtcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdmFyICQkdHlwZW9mVHlwZSA9IHR5cGUgJiYgdHlwZS4kJHR5cGVvZjtcblxuICAgICAgICAgICAgc3dpdGNoICgkJHR5cGVvZlR5cGUpIHtcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9DT05URVhUX1RZUEU6XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTpcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9QUk9WSURFUl9UWVBFOlxuICAgICAgICAgICAgICAgIHJldHVybiAkJHR5cGVvZlR5cGU7XG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuICQkdHlwZW9mO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBjYXNlIFJFQUNUX0xBWllfVFlQRTpcbiAgICAgIGNhc2UgUkVBQ1RfTUVNT19UWVBFOlxuICAgICAgY2FzZSBSRUFDVF9QT1JUQUxfVFlQRTpcbiAgICAgICAgcmV0dXJuICQkdHlwZW9mO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8vIEFzeW5jTW9kZSBpcyBkZXByZWNhdGVkIGFsb25nIHdpdGggaXNBc3luY01vZGVcbnZhciBBc3luY01vZGUgPSBSRUFDVF9BU1lOQ19NT0RFX1RZUEU7XG52YXIgQ29uY3VycmVudE1vZGUgPSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRTtcbnZhciBDb250ZXh0Q29uc3VtZXIgPSBSRUFDVF9DT05URVhUX1RZUEU7XG52YXIgQ29udGV4dFByb3ZpZGVyID0gUkVBQ1RfUFJPVklERVJfVFlQRTtcbnZhciBFbGVtZW50ID0gUkVBQ1RfRUxFTUVOVF9UWVBFO1xudmFyIEZvcndhcmRSZWYgPSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFO1xudmFyIEZyYWdtZW50ID0gUkVBQ1RfRlJBR01FTlRfVFlQRTtcbnZhciBMYXp5ID0gUkVBQ1RfTEFaWV9UWVBFO1xudmFyIE1lbW8gPSBSRUFDVF9NRU1PX1RZUEU7XG52YXIgUG9ydGFsID0gUkVBQ1RfUE9SVEFMX1RZUEU7XG52YXIgUHJvZmlsZXIgPSBSRUFDVF9QUk9GSUxFUl9UWVBFO1xudmFyIFN0cmljdE1vZGUgPSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFO1xudmFyIFN1c3BlbnNlID0gUkVBQ1RfU1VTUEVOU0VfVFlQRTtcblxudmFyIGhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlID0gZmFsc2U7XG5cbi8vIEFzeW5jTW9kZSBzaG91bGQgYmUgZGVwcmVjYXRlZFxuZnVuY3Rpb24gaXNBc3luY01vZGUob2JqZWN0KSB7XG4gIHtcbiAgICBpZiAoIWhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlKSB7XG4gICAgICBoYXNXYXJuZWRBYm91dERlcHJlY2F0ZWRJc0FzeW5jTW9kZSA9IHRydWU7XG4gICAgICBsb3dQcmlvcml0eVdhcm5pbmckMShmYWxzZSwgJ1RoZSBSZWFjdElzLmlzQXN5bmNNb2RlKCkgYWxpYXMgaGFzIGJlZW4gZGVwcmVjYXRlZCwgJyArICdhbmQgd2lsbCBiZSByZW1vdmVkIGluIFJlYWN0IDE3Ky4gVXBkYXRlIHlvdXIgY29kZSB0byB1c2UgJyArICdSZWFjdElzLmlzQ29uY3VycmVudE1vZGUoKSBpbnN0ZWFkLiBJdCBoYXMgdGhlIGV4YWN0IHNhbWUgQVBJLicpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gaXNDb25jdXJyZW50TW9kZShvYmplY3QpIHx8IHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9BU1lOQ19NT0RFX1RZUEU7XG59XG5mdW5jdGlvbiBpc0NvbmN1cnJlbnRNb2RlKG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFO1xufVxuZnVuY3Rpb24gaXNDb250ZXh0Q29uc3VtZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfQ09OVEVYVF9UWVBFO1xufVxuZnVuY3Rpb24gaXNDb250ZXh0UHJvdmlkZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUFJPVklERVJfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzRWxlbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdCAhPT0gbnVsbCAmJiBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzRm9yd2FyZFJlZihvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFO1xufVxuZnVuY3Rpb24gaXNGcmFnbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFO1xufVxuZnVuY3Rpb24gaXNMYXp5KG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0xBWllfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzTWVtbyhvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9NRU1PX1RZUEU7XG59XG5mdW5jdGlvbiBpc1BvcnRhbChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9QT1JUQUxfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzUHJvZmlsZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUFJPRklMRVJfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzU3RyaWN0TW9kZShvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFO1xufVxuZnVuY3Rpb24gaXNTdXNwZW5zZShvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFO1xufVxuXG5leHBvcnRzLnR5cGVPZiA9IHR5cGVPZjtcbmV4cG9ydHMuQXN5bmNNb2RlID0gQXN5bmNNb2RlO1xuZXhwb3J0cy5Db25jdXJyZW50TW9kZSA9IENvbmN1cnJlbnRNb2RlO1xuZXhwb3J0cy5Db250ZXh0Q29uc3VtZXIgPSBDb250ZXh0Q29uc3VtZXI7XG5leHBvcnRzLkNvbnRleHRQcm92aWRlciA9IENvbnRleHRQcm92aWRlcjtcbmV4cG9ydHMuRWxlbWVudCA9IEVsZW1lbnQ7XG5leHBvcnRzLkZvcndhcmRSZWYgPSBGb3J3YXJkUmVmO1xuZXhwb3J0cy5GcmFnbWVudCA9IEZyYWdtZW50O1xuZXhwb3J0cy5MYXp5ID0gTGF6eTtcbmV4cG9ydHMuTWVtbyA9IE1lbW87XG5leHBvcnRzLlBvcnRhbCA9IFBvcnRhbDtcbmV4cG9ydHMuUHJvZmlsZXIgPSBQcm9maWxlcjtcbmV4cG9ydHMuU3RyaWN0TW9kZSA9IFN0cmljdE1vZGU7XG5leHBvcnRzLlN1c3BlbnNlID0gU3VzcGVuc2U7XG5leHBvcnRzLmlzVmFsaWRFbGVtZW50VHlwZSA9IGlzVmFsaWRFbGVtZW50VHlwZTtcbmV4cG9ydHMuaXNBc3luY01vZGUgPSBpc0FzeW5jTW9kZTtcbmV4cG9ydHMuaXNDb25jdXJyZW50TW9kZSA9IGlzQ29uY3VycmVudE1vZGU7XG5leHBvcnRzLmlzQ29udGV4dENvbnN1bWVyID0gaXNDb250ZXh0Q29uc3VtZXI7XG5leHBvcnRzLmlzQ29udGV4dFByb3ZpZGVyID0gaXNDb250ZXh0UHJvdmlkZXI7XG5leHBvcnRzLmlzRWxlbWVudCA9IGlzRWxlbWVudDtcbmV4cG9ydHMuaXNGb3J3YXJkUmVmID0gaXNGb3J3YXJkUmVmO1xuZXhwb3J0cy5pc0ZyYWdtZW50ID0gaXNGcmFnbWVudDtcbmV4cG9ydHMuaXNMYXp5ID0gaXNMYXp5O1xuZXhwb3J0cy5pc01lbW8gPSBpc01lbW87XG5leHBvcnRzLmlzUG9ydGFsID0gaXNQb3J0YWw7XG5leHBvcnRzLmlzUHJvZmlsZXIgPSBpc1Byb2ZpbGVyO1xuZXhwb3J0cy5pc1N0cmljdE1vZGUgPSBpc1N0cmljdE1vZGU7XG5leHBvcnRzLmlzU3VzcGVuc2UgPSBpc1N1c3BlbnNlO1xuICB9KSgpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LWlzLnByb2R1Y3Rpb24ubWluLmpzJyk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LWlzLmRldmVsb3BtZW50LmpzJyk7XG59XG4iLCIvKiogQGxpY2Vuc2UgUmVhY3QgdjE2LjguMVxuICogcmVhY3QuZGV2ZWxvcG1lbnQuanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cblxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gIChmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxudmFyIF9hc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG52YXIgY2hlY2tQcm9wVHlwZXMgPSByZXF1aXJlKCdwcm9wLXR5cGVzL2NoZWNrUHJvcFR5cGVzJyk7XG5cbi8vIFRPRE86IHRoaXMgaXMgc3BlY2lhbCBiZWNhdXNlIGl0IGdldHMgaW1wb3J0ZWQgZHVyaW5nIGJ1aWxkLlxuXG52YXIgUmVhY3RWZXJzaW9uID0gJzE2LjguMSc7XG5cbi8vIFRoZSBTeW1ib2wgdXNlZCB0byB0YWcgdGhlIFJlYWN0RWxlbWVudC1saWtlIHR5cGVzLiBJZiB0aGVyZSBpcyBubyBuYXRpdmUgU3ltYm9sXG4vLyBub3IgcG9seWZpbGwsIHRoZW4gYSBwbGFpbiBudW1iZXIgaXMgdXNlZCBmb3IgcGVyZm9ybWFuY2UuXG52YXIgaGFzU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yO1xuXG52YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpIDogMHhlYWM3O1xudmFyIFJFQUNUX1BPUlRBTF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QucG9ydGFsJykgOiAweGVhY2E7XG52YXIgUkVBQ1RfRlJBR01FTlRfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmZyYWdtZW50JykgOiAweGVhY2I7XG52YXIgUkVBQ1RfU1RSSUNUX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnN0cmljdF9tb2RlJykgOiAweGVhY2M7XG52YXIgUkVBQ1RfUFJPRklMRVJfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnByb2ZpbGVyJykgOiAweGVhZDI7XG52YXIgUkVBQ1RfUFJPVklERVJfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnByb3ZpZGVyJykgOiAweGVhY2Q7XG52YXIgUkVBQ1RfQ09OVEVYVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuY29udGV4dCcpIDogMHhlYWNlO1xuXG52YXIgUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5jb25jdXJyZW50X21vZGUnKSA6IDB4ZWFjZjtcbnZhciBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZm9yd2FyZF9yZWYnKSA6IDB4ZWFkMDtcbnZhciBSRUFDVF9TVVNQRU5TRV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3Quc3VzcGVuc2UnKSA6IDB4ZWFkMTtcbnZhciBSRUFDVF9NRU1PX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5tZW1vJykgOiAweGVhZDM7XG52YXIgUkVBQ1RfTEFaWV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QubGF6eScpIDogMHhlYWQ0O1xuXG52YXIgTUFZQkVfSVRFUkFUT1JfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuaXRlcmF0b3I7XG52YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSAnQEBpdGVyYXRvcic7XG5cbmZ1bmN0aW9uIGdldEl0ZXJhdG9yRm4obWF5YmVJdGVyYWJsZSkge1xuICBpZiAobWF5YmVJdGVyYWJsZSA9PT0gbnVsbCB8fCB0eXBlb2YgbWF5YmVJdGVyYWJsZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2YXIgbWF5YmVJdGVyYXRvciA9IE1BWUJFX0lURVJBVE9SX1NZTUJPTCAmJiBtYXliZUl0ZXJhYmxlW01BWUJFX0lURVJBVE9SX1NZTUJPTF0gfHwgbWF5YmVJdGVyYWJsZVtGQVVYX0lURVJBVE9SX1NZTUJPTF07XG4gIGlmICh0eXBlb2YgbWF5YmVJdGVyYXRvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBtYXliZUl0ZXJhdG9yO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG52YXIgdmFsaWRhdGVGb3JtYXQgPSBmdW5jdGlvbiAoKSB7fTtcblxue1xuICB2YWxpZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGludmFyaWFudChjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpO1xuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yID0gdm9pZCAwO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgKyAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KSk7XG4gICAgICBlcnJvci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG4vLyBSZWx5aW5nIG9uIHRoZSBgaW52YXJpYW50KClgIGltcGxlbWVudGF0aW9uIGxldHMgdXNcbi8vIHByZXNlcnZlIHRoZSBmb3JtYXQgYW5kIHBhcmFtcyBpbiB0aGUgd3d3IGJ1aWxkcy5cblxuLyoqXG4gKiBGb3JrZWQgZnJvbSBmYmpzL3dhcm5pbmc6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svZmJqcy9ibG9iL2U2NmJhMjBhZDViZTQzM2ViNTQ0MjNmMmIwOTdkODI5MzI0ZDlkZTYvcGFja2FnZXMvZmJqcy9zcmMvX19mb3Jrc19fL3dhcm5pbmcuanNcbiAqXG4gKiBPbmx5IGNoYW5nZSBpcyB3ZSB1c2UgY29uc29sZS53YXJuIGluc3RlYWQgb2YgY29uc29sZS5lcnJvcixcbiAqIGFuZCBkbyBub3RoaW5nIHdoZW4gJ2NvbnNvbGUnIGlzIG5vdCBzdXBwb3J0ZWQuXG4gKiBUaGlzIHJlYWxseSBzaW1wbGlmaWVzIHRoZSBjb2RlLlxuICogLS0tXG4gKiBTaW1pbGFyIHRvIGludmFyaWFudCBidXQgb25seSBsb2dzIGEgd2FybmluZyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXQuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGxvZyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzIGluIGNyaXRpY2FsXG4gKiBwYXRocy4gUmVtb3ZpbmcgdGhlIGxvZ2dpbmcgY29kZSBmb3IgcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMgd2lsbCBrZWVwIHRoZVxuICogc2FtZSBsb2dpYyBhbmQgZm9sbG93IHRoZSBzYW1lIGNvZGUgcGF0aHMuXG4gKi9cblxudmFyIGxvd1ByaW9yaXR5V2FybmluZyA9IGZ1bmN0aW9uICgpIHt9O1xuXG57XG4gIHZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9IGNhdGNoICh4KSB7fVxuICB9O1xuXG4gIGxvd1ByaW9yaXR5V2FybmluZyA9IGZ1bmN0aW9uIChjb25kaXRpb24sIGZvcm1hdCkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgbG93UHJpb3JpdHlXYXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0LCAuLi5hcmdzKWAgcmVxdWlyZXMgYSB3YXJuaW5nICcgKyAnbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgICBpZiAoIWNvbmRpdGlvbikge1xuICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAyID8gX2xlbjIgLSAyIDogMCksIF9rZXkyID0gMjsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICBhcmdzW19rZXkyIC0gMl0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgfVxuXG4gICAgICBwcmludFdhcm5pbmcuYXBwbHkodW5kZWZpbmVkLCBbZm9ybWF0XS5jb25jYXQoYXJncykpO1xuICAgIH1cbiAgfTtcbn1cblxudmFyIGxvd1ByaW9yaXR5V2FybmluZyQxID0gbG93UHJpb3JpdHlXYXJuaW5nO1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gaW52YXJpYW50IGJ1dCBvbmx5IGxvZ3MgYSB3YXJuaW5nIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IG1ldC5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbG9nIGlzc3VlcyBpbiBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMgaW4gY3JpdGljYWxcbiAqIHBhdGhzLiBSZW1vdmluZyB0aGUgbG9nZ2luZyBjb2RlIGZvciBwcm9kdWN0aW9uIGVudmlyb25tZW50cyB3aWxsIGtlZXAgdGhlXG4gKiBzYW1lIGxvZ2ljIGFuZCBmb2xsb3cgdGhlIHNhbWUgY29kZSBwYXRocy5cbiAqL1xuXG52YXIgd2FybmluZ1dpdGhvdXRTdGFjayA9IGZ1bmN0aW9uICgpIHt9O1xuXG57XG4gIHdhcm5pbmdXaXRob3V0U3RhY2sgPSBmdW5jdGlvbiAoY29uZGl0aW9uLCBmb3JtYXQpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAyID8gX2xlbiAtIDIgOiAwKSwgX2tleSA9IDI7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgd2FybmluZ1dpdGhvdXRTdGFjayhjb25kaXRpb24sIGZvcm1hdCwgLi4uYXJncylgIHJlcXVpcmVzIGEgd2FybmluZyAnICsgJ21lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gICAgaWYgKGFyZ3MubGVuZ3RoID4gOCkge1xuICAgICAgLy8gQ2hlY2sgYmVmb3JlIHRoZSBjb25kaXRpb24gdG8gY2F0Y2ggdmlvbGF0aW9ucyBlYXJseS5cbiAgICAgIHRocm93IG5ldyBFcnJvcignd2FybmluZ1dpdGhvdXRTdGFjaygpIGN1cnJlbnRseSBzdXBwb3J0cyBhdCBtb3N0IDggYXJndW1lbnRzLicpO1xuICAgIH1cbiAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHZhciBhcmdzV2l0aEZvcm1hdCA9IGFyZ3MubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiAnJyArIGl0ZW07XG4gICAgICB9KTtcbiAgICAgIGFyZ3NXaXRoRm9ybWF0LnVuc2hpZnQoJ1dhcm5pbmc6ICcgKyBmb3JtYXQpO1xuXG4gICAgICAvLyBXZSBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBzcHJlYWQgKG9yIC5hcHBseSkgZGlyZWN0bHkgYmVjYXVzZSBpdFxuICAgICAgLy8gYnJlYWtzIElFOTogaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8xMzYxMFxuICAgICAgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZS5lcnJvciwgY29uc29sZSwgYXJnc1dpdGhGb3JtYXQpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICsgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9IGNhdGNoICh4KSB7fVxuICB9O1xufVxuXG52YXIgd2FybmluZ1dpdGhvdXRTdGFjayQxID0gd2FybmluZ1dpdGhvdXRTdGFjaztcblxudmFyIGRpZFdhcm5TdGF0ZVVwZGF0ZUZvclVubW91bnRlZENvbXBvbmVudCA9IHt9O1xuXG5mdW5jdGlvbiB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgY2FsbGVyTmFtZSkge1xuICB7XG4gICAgdmFyIF9jb25zdHJ1Y3RvciA9IHB1YmxpY0luc3RhbmNlLmNvbnN0cnVjdG9yO1xuICAgIHZhciBjb21wb25lbnROYW1lID0gX2NvbnN0cnVjdG9yICYmIChfY29uc3RydWN0b3IuZGlzcGxheU5hbWUgfHwgX2NvbnN0cnVjdG9yLm5hbWUpIHx8ICdSZWFjdENsYXNzJztcbiAgICB2YXIgd2FybmluZ0tleSA9IGNvbXBvbmVudE5hbWUgKyAnLicgKyBjYWxsZXJOYW1lO1xuICAgIGlmIChkaWRXYXJuU3RhdGVVcGRhdGVGb3JVbm1vdW50ZWRDb21wb25lbnRbd2FybmluZ0tleV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCBcIkNhbid0IGNhbGwgJXMgb24gYSBjb21wb25lbnQgdGhhdCBpcyBub3QgeWV0IG1vdW50ZWQuIFwiICsgJ1RoaXMgaXMgYSBuby1vcCwgYnV0IGl0IG1pZ2h0IGluZGljYXRlIGEgYnVnIGluIHlvdXIgYXBwbGljYXRpb24uICcgKyAnSW5zdGVhZCwgYXNzaWduIHRvIGB0aGlzLnN0YXRlYCBkaXJlY3RseSBvciBkZWZpbmUgYSBgc3RhdGUgPSB7fTtgICcgKyAnY2xhc3MgcHJvcGVydHkgd2l0aCB0aGUgZGVzaXJlZCBzdGF0ZSBpbiB0aGUgJXMgY29tcG9uZW50LicsIGNhbGxlck5hbWUsIGNvbXBvbmVudE5hbWUpO1xuICAgIGRpZFdhcm5TdGF0ZVVwZGF0ZUZvclVubW91bnRlZENvbXBvbmVudFt3YXJuaW5nS2V5XSA9IHRydWU7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBhYnN0cmFjdCBBUEkgZm9yIGFuIHVwZGF0ZSBxdWV1ZS5cbiAqL1xudmFyIFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlID0ge1xuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgb3Igbm90IHRoaXMgY29tcG9zaXRlIGNvbXBvbmVudCBpcyBtb3VudGVkLlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB3ZSB3YW50IHRvIHRlc3QuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgbW91bnRlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKiBAcHJvdGVjdGVkXG4gICAqIEBmaW5hbFxuICAgKi9cbiAgaXNNb3VudGVkOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZvcmNlcyBhbiB1cGRhdGUuIFRoaXMgc2hvdWxkIG9ubHkgYmUgaW52b2tlZCB3aGVuIGl0IGlzIGtub3duIHdpdGhcbiAgICogY2VydGFpbnR5IHRoYXQgd2UgYXJlICoqbm90KiogaW4gYSBET00gdHJhbnNhY3Rpb24uXG4gICAqXG4gICAqIFlvdSBtYXkgd2FudCB0byBjYWxsIHRoaXMgd2hlbiB5b3Uga25vdyB0aGF0IHNvbWUgZGVlcGVyIGFzcGVjdCBvZiB0aGVcbiAgICogY29tcG9uZW50J3Mgc3RhdGUgaGFzIGNoYW5nZWQgYnV0IGBzZXRTdGF0ZWAgd2FzIG5vdCBjYWxsZWQuXG4gICAqXG4gICAqIFRoaXMgd2lsbCBub3QgaW52b2tlIGBzaG91bGRDb21wb25lbnRVcGRhdGVgLCBidXQgaXQgd2lsbCBpbnZva2VcbiAgICogYGNvbXBvbmVudFdpbGxVcGRhdGVgIGFuZCBgY29tcG9uZW50RGlkVXBkYXRlYC5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBzaG91bGQgcmVyZW5kZXIuXG4gICAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgY29tcG9uZW50IGlzIHVwZGF0ZWQuXG4gICAqIEBwYXJhbSB7P3N0cmluZ30gY2FsbGVyTmFtZSBuYW1lIG9mIHRoZSBjYWxsaW5nIGZ1bmN0aW9uIGluIHRoZSBwdWJsaWMgQVBJLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGVucXVldWVGb3JjZVVwZGF0ZTogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlLCBjYWxsYmFjaywgY2FsbGVyTmFtZSkge1xuICAgIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCAnZm9yY2VVcGRhdGUnKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVwbGFjZXMgYWxsIG9mIHRoZSBzdGF0ZS4gQWx3YXlzIHVzZSB0aGlzIG9yIGBzZXRTdGF0ZWAgdG8gbXV0YXRlIHN0YXRlLlxuICAgKiBZb3Ugc2hvdWxkIHRyZWF0IGB0aGlzLnN0YXRlYCBhcyBpbW11dGFibGUuXG4gICAqXG4gICAqIFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGB0aGlzLnN0YXRlYCB3aWxsIGJlIGltbWVkaWF0ZWx5IHVwZGF0ZWQsIHNvXG4gICAqIGFjY2Vzc2luZyBgdGhpcy5zdGF0ZWAgYWZ0ZXIgY2FsbGluZyB0aGlzIG1ldGhvZCBtYXkgcmV0dXJuIHRoZSBvbGQgdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHRoYXQgc2hvdWxkIHJlcmVuZGVyLlxuICAgKiBAcGFyYW0ge29iamVjdH0gY29tcGxldGVTdGF0ZSBOZXh0IHN0YXRlLlxuICAgKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIGNvbXBvbmVudCBpcyB1cGRhdGVkLlxuICAgKiBAcGFyYW0gez9zdHJpbmd9IGNhbGxlck5hbWUgbmFtZSBvZiB0aGUgY2FsbGluZyBmdW5jdGlvbiBpbiB0aGUgcHVibGljIEFQSS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBlbnF1ZXVlUmVwbGFjZVN0YXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UsIGNvbXBsZXRlU3RhdGUsIGNhbGxiYWNrLCBjYWxsZXJOYW1lKSB7XG4gICAgd2Fybk5vb3AocHVibGljSW5zdGFuY2UsICdyZXBsYWNlU3RhdGUnKTtcbiAgfSxcblxuICAvKipcbiAgICogU2V0cyBhIHN1YnNldCBvZiB0aGUgc3RhdGUuIFRoaXMgb25seSBleGlzdHMgYmVjYXVzZSBfcGVuZGluZ1N0YXRlIGlzXG4gICAqIGludGVybmFsLiBUaGlzIHByb3ZpZGVzIGEgbWVyZ2luZyBzdHJhdGVneSB0aGF0IGlzIG5vdCBhdmFpbGFibGUgdG8gZGVlcFxuICAgKiBwcm9wZXJ0aWVzIHdoaWNoIGlzIGNvbmZ1c2luZy4gVE9ETzogRXhwb3NlIHBlbmRpbmdTdGF0ZSBvciBkb24ndCB1c2UgaXRcbiAgICogZHVyaW5nIHRoZSBtZXJnZS5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBzaG91bGQgcmVyZW5kZXIuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJ0aWFsU3RhdGUgTmV4dCBwYXJ0aWFsIHN0YXRlIHRvIGJlIG1lcmdlZCB3aXRoIHN0YXRlLlxuICAgKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIGNvbXBvbmVudCBpcyB1cGRhdGVkLlxuICAgKiBAcGFyYW0gez9zdHJpbmd9IE5hbWUgb2YgdGhlIGNhbGxpbmcgZnVuY3Rpb24gaW4gdGhlIHB1YmxpYyBBUEkuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZW5xdWV1ZVNldFN0YXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UsIHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2ssIGNhbGxlck5hbWUpIHtcbiAgICB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgJ3NldFN0YXRlJyk7XG4gIH1cbn07XG5cbnZhciBlbXB0eU9iamVjdCA9IHt9O1xue1xuICBPYmplY3QuZnJlZXplKGVtcHR5T2JqZWN0KTtcbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGhlbHBlcnMgZm9yIHRoZSB1cGRhdGluZyBzdGF0ZSBvZiBhIGNvbXBvbmVudC5cbiAqL1xuZnVuY3Rpb24gQ29tcG9uZW50KHByb3BzLCBjb250ZXh0LCB1cGRhdGVyKSB7XG4gIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgLy8gSWYgYSBjb21wb25lbnQgaGFzIHN0cmluZyByZWZzLCB3ZSB3aWxsIGFzc2lnbiBhIGRpZmZlcmVudCBvYmplY3QgbGF0ZXIuXG4gIHRoaXMucmVmcyA9IGVtcHR5T2JqZWN0O1xuICAvLyBXZSBpbml0aWFsaXplIHRoZSBkZWZhdWx0IHVwZGF0ZXIgYnV0IHRoZSByZWFsIG9uZSBnZXRzIGluamVjdGVkIGJ5IHRoZVxuICAvLyByZW5kZXJlci5cbiAgdGhpcy51cGRhdGVyID0gdXBkYXRlciB8fCBSZWFjdE5vb3BVcGRhdGVRdWV1ZTtcbn1cblxuQ29tcG9uZW50LnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50ID0ge307XG5cbi8qKlxuICogU2V0cyBhIHN1YnNldCBvZiB0aGUgc3RhdGUuIEFsd2F5cyB1c2UgdGhpcyB0byBtdXRhdGVcbiAqIHN0YXRlLiBZb3Ugc2hvdWxkIHRyZWF0IGB0aGlzLnN0YXRlYCBhcyBpbW11dGFibGUuXG4gKlxuICogVGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgYHRoaXMuc3RhdGVgIHdpbGwgYmUgaW1tZWRpYXRlbHkgdXBkYXRlZCwgc29cbiAqIGFjY2Vzc2luZyBgdGhpcy5zdGF0ZWAgYWZ0ZXIgY2FsbGluZyB0aGlzIG1ldGhvZCBtYXkgcmV0dXJuIHRoZSBvbGQgdmFsdWUuXG4gKlxuICogVGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgY2FsbHMgdG8gYHNldFN0YXRlYCB3aWxsIHJ1biBzeW5jaHJvbm91c2x5LFxuICogYXMgdGhleSBtYXkgZXZlbnR1YWxseSBiZSBiYXRjaGVkIHRvZ2V0aGVyLiAgWW91IGNhbiBwcm92aWRlIGFuIG9wdGlvbmFsXG4gKiBjYWxsYmFjayB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgd2hlbiB0aGUgY2FsbCB0byBzZXRTdGF0ZSBpcyBhY3R1YWxseVxuICogY29tcGxldGVkLlxuICpcbiAqIFdoZW4gYSBmdW5jdGlvbiBpcyBwcm92aWRlZCB0byBzZXRTdGF0ZSwgaXQgd2lsbCBiZSBjYWxsZWQgYXQgc29tZSBwb2ludCBpblxuICogdGhlIGZ1dHVyZSAobm90IHN5bmNocm9ub3VzbHkpLiBJdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSB1cCB0byBkYXRlXG4gKiBjb21wb25lbnQgYXJndW1lbnRzIChzdGF0ZSwgcHJvcHMsIGNvbnRleHQpLiBUaGVzZSB2YWx1ZXMgY2FuIGJlIGRpZmZlcmVudFxuICogZnJvbSB0aGlzLiogYmVjYXVzZSB5b3VyIGZ1bmN0aW9uIG1heSBiZSBjYWxsZWQgYWZ0ZXIgcmVjZWl2ZVByb3BzIGJ1dCBiZWZvcmVcbiAqIHNob3VsZENvbXBvbmVudFVwZGF0ZSwgYW5kIHRoaXMgbmV3IHN0YXRlLCBwcm9wcywgYW5kIGNvbnRleHQgd2lsbCBub3QgeWV0IGJlXG4gKiBhc3NpZ25lZCB0byB0aGlzLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fGZ1bmN0aW9ufSBwYXJ0aWFsU3RhdGUgTmV4dCBwYXJ0aWFsIHN0YXRlIG9yIGZ1bmN0aW9uIHRvXG4gKiAgICAgICAgcHJvZHVjZSBuZXh0IHBhcnRpYWwgc3RhdGUgdG8gYmUgbWVyZ2VkIHdpdGggY3VycmVudCBzdGF0ZS5cbiAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgc3RhdGUgaXMgdXBkYXRlZC5cbiAqIEBmaW5hbFxuICogQHByb3RlY3RlZFxuICovXG5Db21wb25lbnQucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24gKHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2spIHtcbiAgISh0eXBlb2YgcGFydGlhbFN0YXRlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgcGFydGlhbFN0YXRlID09PSAnZnVuY3Rpb24nIHx8IHBhcnRpYWxTdGF0ZSA9PSBudWxsKSA/IGludmFyaWFudChmYWxzZSwgJ3NldFN0YXRlKC4uLik6IHRha2VzIGFuIG9iamVjdCBvZiBzdGF0ZSB2YXJpYWJsZXMgdG8gdXBkYXRlIG9yIGEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhbiBvYmplY3Qgb2Ygc3RhdGUgdmFyaWFibGVzLicpIDogdm9pZCAwO1xuICB0aGlzLnVwZGF0ZXIuZW5xdWV1ZVNldFN0YXRlKHRoaXMsIHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2ssICdzZXRTdGF0ZScpO1xufTtcblxuLyoqXG4gKiBGb3JjZXMgYW4gdXBkYXRlLiBUaGlzIHNob3VsZCBvbmx5IGJlIGludm9rZWQgd2hlbiBpdCBpcyBrbm93biB3aXRoXG4gKiBjZXJ0YWludHkgdGhhdCB3ZSBhcmUgKipub3QqKiBpbiBhIERPTSB0cmFuc2FjdGlvbi5cbiAqXG4gKiBZb3UgbWF5IHdhbnQgdG8gY2FsbCB0aGlzIHdoZW4geW91IGtub3cgdGhhdCBzb21lIGRlZXBlciBhc3BlY3Qgb2YgdGhlXG4gKiBjb21wb25lbnQncyBzdGF0ZSBoYXMgY2hhbmdlZCBidXQgYHNldFN0YXRlYCB3YXMgbm90IGNhbGxlZC5cbiAqXG4gKiBUaGlzIHdpbGwgbm90IGludm9rZSBgc2hvdWxkQ29tcG9uZW50VXBkYXRlYCwgYnV0IGl0IHdpbGwgaW52b2tlXG4gKiBgY29tcG9uZW50V2lsbFVwZGF0ZWAgYW5kIGBjb21wb25lbnREaWRVcGRhdGVgLlxuICpcbiAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgdXBkYXRlIGlzIGNvbXBsZXRlLlxuICogQGZpbmFsXG4gKiBAcHJvdGVjdGVkXG4gKi9cbkNvbXBvbmVudC5wcm90b3R5cGUuZm9yY2VVcGRhdGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgdGhpcy51cGRhdGVyLmVucXVldWVGb3JjZVVwZGF0ZSh0aGlzLCBjYWxsYmFjaywgJ2ZvcmNlVXBkYXRlJyk7XG59O1xuXG4vKipcbiAqIERlcHJlY2F0ZWQgQVBJcy4gVGhlc2UgQVBJcyB1c2VkIHRvIGV4aXN0IG9uIGNsYXNzaWMgUmVhY3QgY2xhc3NlcyBidXQgc2luY2VcbiAqIHdlIHdvdWxkIGxpa2UgdG8gZGVwcmVjYXRlIHRoZW0sIHdlJ3JlIG5vdCBnb2luZyB0byBtb3ZlIHRoZW0gb3ZlciB0byB0aGlzXG4gKiBtb2Rlcm4gYmFzZSBjbGFzcy4gSW5zdGVhZCwgd2UgZGVmaW5lIGEgZ2V0dGVyIHRoYXQgd2FybnMgaWYgaXQncyBhY2Nlc3NlZC5cbiAqL1xue1xuICB2YXIgZGVwcmVjYXRlZEFQSXMgPSB7XG4gICAgaXNNb3VudGVkOiBbJ2lzTW91bnRlZCcsICdJbnN0ZWFkLCBtYWtlIHN1cmUgdG8gY2xlYW4gdXAgc3Vic2NyaXB0aW9ucyBhbmQgcGVuZGluZyByZXF1ZXN0cyBpbiAnICsgJ2NvbXBvbmVudFdpbGxVbm1vdW50IHRvIHByZXZlbnQgbWVtb3J5IGxlYWtzLiddLFxuICAgIHJlcGxhY2VTdGF0ZTogWydyZXBsYWNlU3RhdGUnLCAnUmVmYWN0b3IgeW91ciBjb2RlIHRvIHVzZSBzZXRTdGF0ZSBpbnN0ZWFkIChzZWUgJyArICdodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzMyMzYpLiddXG4gIH07XG4gIHZhciBkZWZpbmVEZXByZWNhdGlvbldhcm5pbmcgPSBmdW5jdGlvbiAobWV0aG9kTmFtZSwgaW5mbykge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb21wb25lbnQucHJvdG90eXBlLCBtZXRob2ROYW1lLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbG93UHJpb3JpdHlXYXJuaW5nJDEoZmFsc2UsICclcyguLi4pIGlzIGRlcHJlY2F0ZWQgaW4gcGxhaW4gSmF2YVNjcmlwdCBSZWFjdCBjbGFzc2VzLiAlcycsIGluZm9bMF0sIGluZm9bMV0pO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBmb3IgKHZhciBmbk5hbWUgaW4gZGVwcmVjYXRlZEFQSXMpIHtcbiAgICBpZiAoZGVwcmVjYXRlZEFQSXMuaGFzT3duUHJvcGVydHkoZm5OYW1lKSkge1xuICAgICAgZGVmaW5lRGVwcmVjYXRpb25XYXJuaW5nKGZuTmFtZSwgZGVwcmVjYXRlZEFQSXNbZm5OYW1lXSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIENvbXBvbmVudER1bW15KCkge31cbkNvbXBvbmVudER1bW15LnByb3RvdHlwZSA9IENvbXBvbmVudC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ29udmVuaWVuY2UgY29tcG9uZW50IHdpdGggZGVmYXVsdCBzaGFsbG93IGVxdWFsaXR5IGNoZWNrIGZvciBzQ1UuXG4gKi9cbmZ1bmN0aW9uIFB1cmVDb21wb25lbnQocHJvcHMsIGNvbnRleHQsIHVwZGF0ZXIpIHtcbiAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAvLyBJZiBhIGNvbXBvbmVudCBoYXMgc3RyaW5nIHJlZnMsIHdlIHdpbGwgYXNzaWduIGEgZGlmZmVyZW50IG9iamVjdCBsYXRlci5cbiAgdGhpcy5yZWZzID0gZW1wdHlPYmplY3Q7XG4gIHRoaXMudXBkYXRlciA9IHVwZGF0ZXIgfHwgUmVhY3ROb29wVXBkYXRlUXVldWU7XG59XG5cbnZhciBwdXJlQ29tcG9uZW50UHJvdG90eXBlID0gUHVyZUNvbXBvbmVudC5wcm90b3R5cGUgPSBuZXcgQ29tcG9uZW50RHVtbXkoKTtcbnB1cmVDb21wb25lbnRQcm90b3R5cGUuY29uc3RydWN0b3IgPSBQdXJlQ29tcG9uZW50O1xuLy8gQXZvaWQgYW4gZXh0cmEgcHJvdG90eXBlIGp1bXAgZm9yIHRoZXNlIG1ldGhvZHMuXG5fYXNzaWduKHB1cmVDb21wb25lbnRQcm90b3R5cGUsIENvbXBvbmVudC5wcm90b3R5cGUpO1xucHVyZUNvbXBvbmVudFByb3RvdHlwZS5pc1B1cmVSZWFjdENvbXBvbmVudCA9IHRydWU7XG5cbi8vIGFuIGltbXV0YWJsZSBvYmplY3Qgd2l0aCBhIHNpbmdsZSBtdXRhYmxlIHZhbHVlXG5mdW5jdGlvbiBjcmVhdGVSZWYoKSB7XG4gIHZhciByZWZPYmplY3QgPSB7XG4gICAgY3VycmVudDogbnVsbFxuICB9O1xuICB7XG4gICAgT2JqZWN0LnNlYWwocmVmT2JqZWN0KTtcbiAgfVxuICByZXR1cm4gcmVmT2JqZWN0O1xufVxuXG4vKipcbiAqIEtlZXBzIHRyYWNrIG9mIHRoZSBjdXJyZW50IGRpc3BhdGNoZXIuXG4gKi9cbnZhciBSZWFjdEN1cnJlbnREaXNwYXRjaGVyID0ge1xuICAvKipcbiAgICogQGludGVybmFsXG4gICAqIEB0eXBlIHtSZWFjdENvbXBvbmVudH1cbiAgICovXG4gIGN1cnJlbnQ6IG51bGxcbn07XG5cbi8qKlxuICogS2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnQgb3duZXIuXG4gKlxuICogVGhlIGN1cnJlbnQgb3duZXIgaXMgdGhlIGNvbXBvbmVudCB3aG8gc2hvdWxkIG93biBhbnkgY29tcG9uZW50cyB0aGF0IGFyZVxuICogY3VycmVudGx5IGJlaW5nIGNvbnN0cnVjdGVkLlxuICovXG52YXIgUmVhY3RDdXJyZW50T3duZXIgPSB7XG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQHR5cGUge1JlYWN0Q29tcG9uZW50fVxuICAgKi9cbiAgY3VycmVudDogbnVsbFxufTtcblxudmFyIEJFRk9SRV9TTEFTSF9SRSA9IC9eKC4qKVtcXFxcXFwvXS87XG5cbnZhciBkZXNjcmliZUNvbXBvbmVudEZyYW1lID0gZnVuY3Rpb24gKG5hbWUsIHNvdXJjZSwgb3duZXJOYW1lKSB7XG4gIHZhciBzb3VyY2VJbmZvID0gJyc7XG4gIGlmIChzb3VyY2UpIHtcbiAgICB2YXIgcGF0aCA9IHNvdXJjZS5maWxlTmFtZTtcbiAgICB2YXIgZmlsZU5hbWUgPSBwYXRoLnJlcGxhY2UoQkVGT1JFX1NMQVNIX1JFLCAnJyk7XG4gICAge1xuICAgICAgLy8gSW4gREVWLCBpbmNsdWRlIGNvZGUgZm9yIGEgY29tbW9uIHNwZWNpYWwgY2FzZTpcbiAgICAgIC8vIHByZWZlciBcImZvbGRlci9pbmRleC5qc1wiIGluc3RlYWQgb2YganVzdCBcImluZGV4LmpzXCIuXG4gICAgICBpZiAoL15pbmRleFxcLi8udGVzdChmaWxlTmFtZSkpIHtcbiAgICAgICAgdmFyIG1hdGNoID0gcGF0aC5tYXRjaChCRUZPUkVfU0xBU0hfUkUpO1xuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICB2YXIgcGF0aEJlZm9yZVNsYXNoID0gbWF0Y2hbMV07XG4gICAgICAgICAgaWYgKHBhdGhCZWZvcmVTbGFzaCkge1xuICAgICAgICAgICAgdmFyIGZvbGRlck5hbWUgPSBwYXRoQmVmb3JlU2xhc2gucmVwbGFjZShCRUZPUkVfU0xBU0hfUkUsICcnKTtcbiAgICAgICAgICAgIGZpbGVOYW1lID0gZm9sZGVyTmFtZSArICcvJyArIGZpbGVOYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBzb3VyY2VJbmZvID0gJyAoYXQgJyArIGZpbGVOYW1lICsgJzonICsgc291cmNlLmxpbmVOdW1iZXIgKyAnKSc7XG4gIH0gZWxzZSBpZiAob3duZXJOYW1lKSB7XG4gICAgc291cmNlSW5mbyA9ICcgKGNyZWF0ZWQgYnkgJyArIG93bmVyTmFtZSArICcpJztcbiAgfVxuICByZXR1cm4gJ1xcbiAgICBpbiAnICsgKG5hbWUgfHwgJ1Vua25vd24nKSArIHNvdXJjZUluZm87XG59O1xuXG52YXIgUmVzb2x2ZWQgPSAxO1xuXG5cbmZ1bmN0aW9uIHJlZmluZVJlc29sdmVkTGF6eUNvbXBvbmVudChsYXp5Q29tcG9uZW50KSB7XG4gIHJldHVybiBsYXp5Q29tcG9uZW50Ll9zdGF0dXMgPT09IFJlc29sdmVkID8gbGF6eUNvbXBvbmVudC5fcmVzdWx0IDogbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0V3JhcHBlZE5hbWUob3V0ZXJUeXBlLCBpbm5lclR5cGUsIHdyYXBwZXJOYW1lKSB7XG4gIHZhciBmdW5jdGlvbk5hbWUgPSBpbm5lclR5cGUuZGlzcGxheU5hbWUgfHwgaW5uZXJUeXBlLm5hbWUgfHwgJyc7XG4gIHJldHVybiBvdXRlclR5cGUuZGlzcGxheU5hbWUgfHwgKGZ1bmN0aW9uTmFtZSAhPT0gJycgPyB3cmFwcGVyTmFtZSArICcoJyArIGZ1bmN0aW9uTmFtZSArICcpJyA6IHdyYXBwZXJOYW1lKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50TmFtZSh0eXBlKSB7XG4gIGlmICh0eXBlID09IG51bGwpIHtcbiAgICAvLyBIb3N0IHJvb3QsIHRleHQgbm9kZSBvciBqdXN0IGludmFsaWQgdHlwZS5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB7XG4gICAgaWYgKHR5cGVvZiB0eXBlLnRhZyA9PT0gJ251bWJlcicpIHtcbiAgICAgIHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ1JlY2VpdmVkIGFuIHVuZXhwZWN0ZWQgb2JqZWN0IGluIGdldENvbXBvbmVudE5hbWUoKS4gJyArICdUaGlzIGlzIGxpa2VseSBhIGJ1ZyBpbiBSZWFjdC4gUGxlYXNlIGZpbGUgYW4gaXNzdWUuJyk7XG4gICAgfVxuICB9XG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB0eXBlLmRpc3BsYXlOYW1lIHx8IHR5cGUubmFtZSB8fCBudWxsO1xuICB9XG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdHlwZTtcbiAgfVxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFOlxuICAgICAgcmV0dXJuICdDb25jdXJyZW50TW9kZSc7XG4gICAgY2FzZSBSRUFDVF9GUkFHTUVOVF9UWVBFOlxuICAgICAgcmV0dXJuICdGcmFnbWVudCc7XG4gICAgY2FzZSBSRUFDVF9QT1JUQUxfVFlQRTpcbiAgICAgIHJldHVybiAnUG9ydGFsJztcbiAgICBjYXNlIFJFQUNUX1BST0ZJTEVSX1RZUEU6XG4gICAgICByZXR1cm4gJ1Byb2ZpbGVyJztcbiAgICBjYXNlIFJFQUNUX1NUUklDVF9NT0RFX1RZUEU6XG4gICAgICByZXR1cm4gJ1N0cmljdE1vZGUnO1xuICAgIGNhc2UgUkVBQ1RfU1VTUEVOU0VfVFlQRTpcbiAgICAgIHJldHVybiAnU3VzcGVuc2UnO1xuICB9XG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICBzd2l0Y2ggKHR5cGUuJCR0eXBlb2YpIHtcbiAgICAgIGNhc2UgUkVBQ1RfQ09OVEVYVF9UWVBFOlxuICAgICAgICByZXR1cm4gJ0NvbnRleHQuQ29uc3VtZXInO1xuICAgICAgY2FzZSBSRUFDVF9QUk9WSURFUl9UWVBFOlxuICAgICAgICByZXR1cm4gJ0NvbnRleHQuUHJvdmlkZXInO1xuICAgICAgY2FzZSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFOlxuICAgICAgICByZXR1cm4gZ2V0V3JhcHBlZE5hbWUodHlwZSwgdHlwZS5yZW5kZXIsICdGb3J3YXJkUmVmJyk7XG4gICAgICBjYXNlIFJFQUNUX01FTU9fVFlQRTpcbiAgICAgICAgcmV0dXJuIGdldENvbXBvbmVudE5hbWUodHlwZS50eXBlKTtcbiAgICAgIGNhc2UgUkVBQ1RfTEFaWV9UWVBFOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIHRoZW5hYmxlID0gdHlwZTtcbiAgICAgICAgICB2YXIgcmVzb2x2ZWRUaGVuYWJsZSA9IHJlZmluZVJlc29sdmVkTGF6eUNvbXBvbmVudCh0aGVuYWJsZSk7XG4gICAgICAgICAgaWYgKHJlc29sdmVkVGhlbmFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRDb21wb25lbnROYW1lKHJlc29sdmVkVGhlbmFibGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxudmFyIFJlYWN0RGVidWdDdXJyZW50RnJhbWUgPSB7fTtcblxudmFyIGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50ID0gbnVsbDtcblxuZnVuY3Rpb24gc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQoZWxlbWVudCkge1xuICB7XG4gICAgY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQgPSBlbGVtZW50O1xuICB9XG59XG5cbntcbiAgLy8gU3RhY2sgaW1wbGVtZW50YXRpb24gaW5qZWN0ZWQgYnkgdGhlIGN1cnJlbnQgcmVuZGVyZXIuXG4gIFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0Q3VycmVudFN0YWNrID0gbnVsbDtcblxuICBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldFN0YWNrQWRkZW5kdW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHN0YWNrID0gJyc7XG5cbiAgICAvLyBBZGQgYW4gZXh0cmEgdG9wIGZyYW1lIHdoaWxlIGFuIGVsZW1lbnQgaXMgYmVpbmcgdmFsaWRhdGVkXG4gICAgaWYgKGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KSB7XG4gICAgICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWUoY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQudHlwZSk7XG4gICAgICB2YXIgb3duZXIgPSBjdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudC5fb3duZXI7XG4gICAgICBzdGFjayArPSBkZXNjcmliZUNvbXBvbmVudEZyYW1lKG5hbWUsIGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50Ll9zb3VyY2UsIG93bmVyICYmIGdldENvbXBvbmVudE5hbWUob3duZXIudHlwZSkpO1xuICAgIH1cblxuICAgIC8vIERlbGVnYXRlIHRvIHRoZSBpbmplY3RlZCByZW5kZXJlci1zcGVjaWZpYyBpbXBsZW1lbnRhdGlvblxuICAgIHZhciBpbXBsID0gUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRDdXJyZW50U3RhY2s7XG4gICAgaWYgKGltcGwpIHtcbiAgICAgIHN0YWNrICs9IGltcGwoKSB8fCAnJztcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhY2s7XG4gIH07XG59XG5cbnZhciBSZWFjdFNoYXJlZEludGVybmFscyA9IHtcbiAgUmVhY3RDdXJyZW50RGlzcGF0Y2hlcjogUmVhY3RDdXJyZW50RGlzcGF0Y2hlcixcbiAgUmVhY3RDdXJyZW50T3duZXI6IFJlYWN0Q3VycmVudE93bmVyLFxuICAvLyBVc2VkIGJ5IHJlbmRlcmVycyB0byBhdm9pZCBidW5kbGluZyBvYmplY3QtYXNzaWduIHR3aWNlIGluIFVNRCBidW5kbGVzOlxuICBhc3NpZ246IF9hc3NpZ25cbn07XG5cbntcbiAgX2Fzc2lnbihSZWFjdFNoYXJlZEludGVybmFscywge1xuICAgIC8vIFRoZXNlIHNob3VsZCBub3QgYmUgaW5jbHVkZWQgaW4gcHJvZHVjdGlvbi5cbiAgICBSZWFjdERlYnVnQ3VycmVudEZyYW1lOiBSZWFjdERlYnVnQ3VycmVudEZyYW1lLFxuICAgIC8vIFNoaW0gZm9yIFJlYWN0IERPTSAxNi4wLjAgd2hpY2ggc3RpbGwgZGVzdHJ1Y3R1cmVkIChidXQgbm90IHVzZWQpIHRoaXMuXG4gICAgLy8gVE9ETzogcmVtb3ZlIGluIFJlYWN0IDE3LjAuXG4gICAgUmVhY3RDb21wb25lbnRUcmVlSG9vazoge31cbiAgfSk7XG59XG5cbi8qKlxuICogU2ltaWxhciB0byBpbnZhcmlhbnQgYnV0IG9ubHkgbG9ncyBhIHdhcm5pbmcgaWYgdGhlIGNvbmRpdGlvbiBpcyBub3QgbWV0LlxuICogVGhpcyBjYW4gYmUgdXNlZCB0byBsb2cgaXNzdWVzIGluIGRldmVsb3BtZW50IGVudmlyb25tZW50cyBpbiBjcml0aWNhbFxuICogcGF0aHMuIFJlbW92aW5nIHRoZSBsb2dnaW5nIGNvZGUgZm9yIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRzIHdpbGwga2VlcCB0aGVcbiAqIHNhbWUgbG9naWMgYW5kIGZvbGxvdyB0aGUgc2FtZSBjb2RlIHBhdGhzLlxuICovXG5cbnZhciB3YXJuaW5nID0gd2FybmluZ1dpdGhvdXRTdGFjayQxO1xuXG57XG4gIHdhcm5pbmcgPSBmdW5jdGlvbiAoY29uZGl0aW9uLCBmb3JtYXQpIHtcbiAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBSZWFjdERlYnVnQ3VycmVudEZyYW1lID0gUmVhY3RTaGFyZWRJbnRlcm5hbHMuUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZTtcbiAgICB2YXIgc3RhY2sgPSBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldFN0YWNrQWRkZW5kdW0oKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaW50ZXJuYWwvd2FybmluZy1hbmQtaW52YXJpYW50LWFyZ3NcblxuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5IC0gMl0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgd2FybmluZ1dpdGhvdXRTdGFjayQxLmFwcGx5KHVuZGVmaW5lZCwgW2ZhbHNlLCBmb3JtYXQgKyAnJXMnXS5jb25jYXQoYXJncywgW3N0YWNrXSkpO1xuICB9O1xufVxuXG52YXIgd2FybmluZyQxID0gd2FybmluZztcblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxudmFyIFJFU0VSVkVEX1BST1BTID0ge1xuICBrZXk6IHRydWUsXG4gIHJlZjogdHJ1ZSxcbiAgX19zZWxmOiB0cnVlLFxuICBfX3NvdXJjZTogdHJ1ZVxufTtcblxudmFyIHNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duID0gdm9pZCAwO1xudmFyIHNwZWNpYWxQcm9wUmVmV2FybmluZ1Nob3duID0gdm9pZCAwO1xuXG5mdW5jdGlvbiBoYXNWYWxpZFJlZihjb25maWcpIHtcbiAge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgJ3JlZicpKSB7XG4gICAgICB2YXIgZ2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjb25maWcsICdyZWYnKS5nZXQ7XG4gICAgICBpZiAoZ2V0dGVyICYmIGdldHRlci5pc1JlYWN0V2FybmluZykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBjb25maWcucmVmICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkS2V5KGNvbmZpZykge1xuICB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCAna2V5JykpIHtcbiAgICAgIHZhciBnZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGNvbmZpZywgJ2tleScpLmdldDtcbiAgICAgIGlmIChnZXR0ZXIgJiYgZ2V0dGVyLmlzUmVhY3RXYXJuaW5nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbmZpZy5rZXkgIT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZGVmaW5lS2V5UHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKSB7XG4gIHZhciB3YXJuQWJvdXRBY2Nlc3NpbmdLZXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93bikge1xuICAgICAgc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd24gPSB0cnVlO1xuICAgICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnJXM6IGBrZXlgIGlzIG5vdCBhIHByb3AuIFRyeWluZyB0byBhY2Nlc3MgaXQgd2lsbCByZXN1bHQgJyArICdpbiBgdW5kZWZpbmVkYCBiZWluZyByZXR1cm5lZC4gSWYgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSBzYW1lICcgKyAndmFsdWUgd2l0aGluIHRoZSBjaGlsZCBjb21wb25lbnQsIHlvdSBzaG91bGQgcGFzcyBpdCBhcyBhIGRpZmZlcmVudCAnICsgJ3Byb3AuIChodHRwczovL2ZiLm1lL3JlYWN0LXNwZWNpYWwtcHJvcHMpJywgZGlzcGxheU5hbWUpO1xuICAgIH1cbiAgfTtcbiAgd2FybkFib3V0QWNjZXNzaW5nS2V5LmlzUmVhY3RXYXJuaW5nID0gdHJ1ZTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3BzLCAna2V5Jywge1xuICAgIGdldDogd2FybkFib3V0QWNjZXNzaW5nS2V5LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVmaW5lUmVmUHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKSB7XG4gIHZhciB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFzcGVjaWFsUHJvcFJlZldhcm5pbmdTaG93bikge1xuICAgICAgc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd24gPSB0cnVlO1xuICAgICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnJXM6IGByZWZgIGlzIG5vdCBhIHByb3AuIFRyeWluZyB0byBhY2Nlc3MgaXQgd2lsbCByZXN1bHQgJyArICdpbiBgdW5kZWZpbmVkYCBiZWluZyByZXR1cm5lZC4gSWYgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSBzYW1lICcgKyAndmFsdWUgd2l0aGluIHRoZSBjaGlsZCBjb21wb25lbnQsIHlvdSBzaG91bGQgcGFzcyBpdCBhcyBhIGRpZmZlcmVudCAnICsgJ3Byb3AuIChodHRwczovL2ZiLm1lL3JlYWN0LXNwZWNpYWwtcHJvcHMpJywgZGlzcGxheU5hbWUpO1xuICAgIH1cbiAgfTtcbiAgd2FybkFib3V0QWNjZXNzaW5nUmVmLmlzUmVhY3RXYXJuaW5nID0gdHJ1ZTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3BzLCAncmVmJywge1xuICAgIGdldDogd2FybkFib3V0QWNjZXNzaW5nUmVmLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuLyoqXG4gKiBGYWN0b3J5IG1ldGhvZCB0byBjcmVhdGUgYSBuZXcgUmVhY3QgZWxlbWVudC4gVGhpcyBubyBsb25nZXIgYWRoZXJlcyB0b1xuICogdGhlIGNsYXNzIHBhdHRlcm4sIHNvIGRvIG5vdCB1c2UgbmV3IHRvIGNhbGwgaXQuIEFsc28sIG5vIGluc3RhbmNlb2YgY2hlY2tcbiAqIHdpbGwgd29yay4gSW5zdGVhZCB0ZXN0ICQkdHlwZW9mIGZpZWxkIGFnYWluc3QgU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpIHRvIGNoZWNrXG4gKiBpZiBzb21ldGhpbmcgaXMgYSBSZWFjdCBFbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7Kn0gdHlwZVxuICogQHBhcmFtIHsqfSBrZXlcbiAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gcmVmXG4gKiBAcGFyYW0geyp9IHNlbGYgQSAqdGVtcG9yYXJ5KiBoZWxwZXIgdG8gZGV0ZWN0IHBsYWNlcyB3aGVyZSBgdGhpc2AgaXNcbiAqIGRpZmZlcmVudCBmcm9tIHRoZSBgb3duZXJgIHdoZW4gUmVhY3QuY3JlYXRlRWxlbWVudCBpcyBjYWxsZWQsIHNvIHRoYXQgd2VcbiAqIGNhbiB3YXJuLiBXZSB3YW50IHRvIGdldCByaWQgb2Ygb3duZXIgYW5kIHJlcGxhY2Ugc3RyaW5nIGByZWZgcyB3aXRoIGFycm93XG4gKiBmdW5jdGlvbnMsIGFuZCBhcyBsb25nIGFzIGB0aGlzYCBhbmQgb3duZXIgYXJlIHRoZSBzYW1lLCB0aGVyZSB3aWxsIGJlIG5vXG4gKiBjaGFuZ2UgaW4gYmVoYXZpb3IuXG4gKiBAcGFyYW0geyp9IHNvdXJjZSBBbiBhbm5vdGF0aW9uIG9iamVjdCAoYWRkZWQgYnkgYSB0cmFuc3BpbGVyIG9yIG90aGVyd2lzZSlcbiAqIGluZGljYXRpbmcgZmlsZW5hbWUsIGxpbmUgbnVtYmVyLCBhbmQvb3Igb3RoZXIgaW5mb3JtYXRpb24uXG4gKiBAcGFyYW0geyp9IG93bmVyXG4gKiBAcGFyYW0geyp9IHByb3BzXG4gKiBAaW50ZXJuYWxcbiAqL1xudmFyIFJlYWN0RWxlbWVudCA9IGZ1bmN0aW9uICh0eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBvd25lciwgcHJvcHMpIHtcbiAgdmFyIGVsZW1lbnQgPSB7XG4gICAgLy8gVGhpcyB0YWcgYWxsb3dzIHVzIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IHRoaXMgYXMgYSBSZWFjdCBFbGVtZW50XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0VMRU1FTlRfVFlQRSxcblxuICAgIC8vIEJ1aWx0LWluIHByb3BlcnRpZXMgdGhhdCBiZWxvbmcgb24gdGhlIGVsZW1lbnRcbiAgICB0eXBlOiB0eXBlLFxuICAgIGtleToga2V5LFxuICAgIHJlZjogcmVmLFxuICAgIHByb3BzOiBwcm9wcyxcblxuICAgIC8vIFJlY29yZCB0aGUgY29tcG9uZW50IHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGlzIGVsZW1lbnQuXG4gICAgX293bmVyOiBvd25lclxuICB9O1xuXG4gIHtcbiAgICAvLyBUaGUgdmFsaWRhdGlvbiBmbGFnIGlzIGN1cnJlbnRseSBtdXRhdGl2ZS4gV2UgcHV0IGl0IG9uXG4gICAgLy8gYW4gZXh0ZXJuYWwgYmFja2luZyBzdG9yZSBzbyB0aGF0IHdlIGNhbiBmcmVlemUgdGhlIHdob2xlIG9iamVjdC5cbiAgICAvLyBUaGlzIGNhbiBiZSByZXBsYWNlZCB3aXRoIGEgV2Vha01hcCBvbmNlIHRoZXkgYXJlIGltcGxlbWVudGVkIGluXG4gICAgLy8gY29tbW9ubHkgdXNlZCBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMuXG4gICAgZWxlbWVudC5fc3RvcmUgPSB7fTtcblxuICAgIC8vIFRvIG1ha2UgY29tcGFyaW5nIFJlYWN0RWxlbWVudHMgZWFzaWVyIGZvciB0ZXN0aW5nIHB1cnBvc2VzLCB3ZSBtYWtlXG4gICAgLy8gdGhlIHZhbGlkYXRpb24gZmxhZyBub24tZW51bWVyYWJsZSAod2hlcmUgcG9zc2libGUsIHdoaWNoIHNob3VsZFxuICAgIC8vIGluY2x1ZGUgZXZlcnkgZW52aXJvbm1lbnQgd2UgcnVuIHRlc3RzIGluKSwgc28gdGhlIHRlc3QgZnJhbWV3b3JrXG4gICAgLy8gaWdub3JlcyBpdC5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudC5fc3RvcmUsICd2YWxpZGF0ZWQnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIHZhbHVlOiBmYWxzZVxuICAgIH0pO1xuICAgIC8vIHNlbGYgYW5kIHNvdXJjZSBhcmUgREVWIG9ubHkgcHJvcGVydGllcy5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudCwgJ19zZWxmJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHNlbGZcbiAgICB9KTtcbiAgICAvLyBUd28gZWxlbWVudHMgY3JlYXRlZCBpbiB0d28gZGlmZmVyZW50IHBsYWNlcyBzaG91bGQgYmUgY29uc2lkZXJlZFxuICAgIC8vIGVxdWFsIGZvciB0ZXN0aW5nIHB1cnBvc2VzIGFuZCB0aGVyZWZvcmUgd2UgaGlkZSBpdCBmcm9tIGVudW1lcmF0aW9uLlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50LCAnX3NvdXJjZScsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBzb3VyY2VcbiAgICB9KTtcbiAgICBpZiAoT2JqZWN0LmZyZWV6ZSkge1xuICAgICAgT2JqZWN0LmZyZWV6ZShlbGVtZW50LnByb3BzKTtcbiAgICAgIE9iamVjdC5mcmVlemUoZWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhbmQgcmV0dXJuIGEgbmV3IFJlYWN0RWxlbWVudCBvZiB0aGUgZ2l2ZW4gdHlwZS5cbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjY3JlYXRlZWxlbWVudFxuICovXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50KHR5cGUsIGNvbmZpZywgY2hpbGRyZW4pIHtcbiAgdmFyIHByb3BOYW1lID0gdm9pZCAwO1xuXG4gIC8vIFJlc2VydmVkIG5hbWVzIGFyZSBleHRyYWN0ZWRcbiAgdmFyIHByb3BzID0ge307XG5cbiAgdmFyIGtleSA9IG51bGw7XG4gIHZhciByZWYgPSBudWxsO1xuICB2YXIgc2VsZiA9IG51bGw7XG4gIHZhciBzb3VyY2UgPSBudWxsO1xuXG4gIGlmIChjb25maWcgIT0gbnVsbCkge1xuICAgIGlmIChoYXNWYWxpZFJlZihjb25maWcpKSB7XG4gICAgICByZWYgPSBjb25maWcucmVmO1xuICAgIH1cbiAgICBpZiAoaGFzVmFsaWRLZXkoY29uZmlnKSkge1xuICAgICAga2V5ID0gJycgKyBjb25maWcua2V5O1xuICAgIH1cblxuICAgIHNlbGYgPSBjb25maWcuX19zZWxmID09PSB1bmRlZmluZWQgPyBudWxsIDogY29uZmlnLl9fc2VsZjtcbiAgICBzb3VyY2UgPSBjb25maWcuX19zb3VyY2UgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjb25maWcuX19zb3VyY2U7XG4gICAgLy8gUmVtYWluaW5nIHByb3BlcnRpZXMgYXJlIGFkZGVkIHRvIGEgbmV3IHByb3BzIG9iamVjdFxuICAgIGZvciAocHJvcE5hbWUgaW4gY29uZmlnKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsIHByb3BOYW1lKSAmJiAhUkVTRVJWRURfUFJPUFMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ2hpbGRyZW4gY2FuIGJlIG1vcmUgdGhhbiBvbmUgYXJndW1lbnQsIGFuZCB0aG9zZSBhcmUgdHJhbnNmZXJyZWQgb250b1xuICAvLyB0aGUgbmV3bHkgYWxsb2NhdGVkIHByb3BzIG9iamVjdC5cbiAgdmFyIGNoaWxkcmVuTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCAtIDI7XG4gIGlmIChjaGlsZHJlbkxlbmd0aCA9PT0gMSkge1xuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIH0gZWxzZSBpZiAoY2hpbGRyZW5MZW5ndGggPiAxKSB7XG4gICAgdmFyIGNoaWxkQXJyYXkgPSBBcnJheShjaGlsZHJlbkxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbkxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGlsZEFycmF5W2ldID0gYXJndW1lbnRzW2kgKyAyXTtcbiAgICB9XG4gICAge1xuICAgICAgaWYgKE9iamVjdC5mcmVlemUpIHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZShjaGlsZEFycmF5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZEFycmF5O1xuICB9XG5cbiAgLy8gUmVzb2x2ZSBkZWZhdWx0IHByb3BzXG4gIGlmICh0eXBlICYmIHR5cGUuZGVmYXVsdFByb3BzKSB7XG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHR5cGUuZGVmYXVsdFByb3BzO1xuICAgIGZvciAocHJvcE5hbWUgaW4gZGVmYXVsdFByb3BzKSB7XG4gICAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gZGVmYXVsdFByb3BzW3Byb3BOYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAge1xuICAgIGlmIChrZXkgfHwgcmVmKSB7XG4gICAgICB2YXIgZGlzcGxheU5hbWUgPSB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJyA/IHR5cGUuZGlzcGxheU5hbWUgfHwgdHlwZS5uYW1lIHx8ICdVbmtub3duJyA6IHR5cGU7XG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIGRlZmluZUtleVByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSk7XG4gICAgICB9XG4gICAgICBpZiAocmVmKSB7XG4gICAgICAgIGRlZmluZVJlZlByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBSZWFjdEVsZW1lbnQodHlwZSwga2V5LCByZWYsIHNlbGYsIHNvdXJjZSwgUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCwgcHJvcHMpO1xufVxuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcHJvZHVjZXMgUmVhY3RFbGVtZW50cyBvZiBhIGdpdmVuIHR5cGUuXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI2NyZWF0ZWZhY3RvcnlcbiAqL1xuXG5cbmZ1bmN0aW9uIGNsb25lQW5kUmVwbGFjZUtleShvbGRFbGVtZW50LCBuZXdLZXkpIHtcbiAgdmFyIG5ld0VsZW1lbnQgPSBSZWFjdEVsZW1lbnQob2xkRWxlbWVudC50eXBlLCBuZXdLZXksIG9sZEVsZW1lbnQucmVmLCBvbGRFbGVtZW50Ll9zZWxmLCBvbGRFbGVtZW50Ll9zb3VyY2UsIG9sZEVsZW1lbnQuX293bmVyLCBvbGRFbGVtZW50LnByb3BzKTtcblxuICByZXR1cm4gbmV3RWxlbWVudDtcbn1cblxuLyoqXG4gKiBDbG9uZSBhbmQgcmV0dXJuIGEgbmV3IFJlYWN0RWxlbWVudCB1c2luZyBlbGVtZW50IGFzIHRoZSBzdGFydGluZyBwb2ludC5cbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjY2xvbmVlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIGNsb25lRWxlbWVudChlbGVtZW50LCBjb25maWcsIGNoaWxkcmVuKSB7XG4gICEhKGVsZW1lbnQgPT09IG51bGwgfHwgZWxlbWVudCA9PT0gdW5kZWZpbmVkKSA/IGludmFyaWFudChmYWxzZSwgJ1JlYWN0LmNsb25lRWxlbWVudCguLi4pOiBUaGUgYXJndW1lbnQgbXVzdCBiZSBhIFJlYWN0IGVsZW1lbnQsIGJ1dCB5b3UgcGFzc2VkICVzLicsIGVsZW1lbnQpIDogdm9pZCAwO1xuXG4gIHZhciBwcm9wTmFtZSA9IHZvaWQgMDtcblxuICAvLyBPcmlnaW5hbCBwcm9wcyBhcmUgY29waWVkXG4gIHZhciBwcm9wcyA9IF9hc3NpZ24oe30sIGVsZW1lbnQucHJvcHMpO1xuXG4gIC8vIFJlc2VydmVkIG5hbWVzIGFyZSBleHRyYWN0ZWRcbiAgdmFyIGtleSA9IGVsZW1lbnQua2V5O1xuICB2YXIgcmVmID0gZWxlbWVudC5yZWY7XG4gIC8vIFNlbGYgaXMgcHJlc2VydmVkIHNpbmNlIHRoZSBvd25lciBpcyBwcmVzZXJ2ZWQuXG4gIHZhciBzZWxmID0gZWxlbWVudC5fc2VsZjtcbiAgLy8gU291cmNlIGlzIHByZXNlcnZlZCBzaW5jZSBjbG9uZUVsZW1lbnQgaXMgdW5saWtlbHkgdG8gYmUgdGFyZ2V0ZWQgYnkgYVxuICAvLyB0cmFuc3BpbGVyLCBhbmQgdGhlIG9yaWdpbmFsIHNvdXJjZSBpcyBwcm9iYWJseSBhIGJldHRlciBpbmRpY2F0b3Igb2YgdGhlXG4gIC8vIHRydWUgb3duZXIuXG4gIHZhciBzb3VyY2UgPSBlbGVtZW50Ll9zb3VyY2U7XG5cbiAgLy8gT3duZXIgd2lsbCBiZSBwcmVzZXJ2ZWQsIHVubGVzcyByZWYgaXMgb3ZlcnJpZGRlblxuICB2YXIgb3duZXIgPSBlbGVtZW50Ll9vd25lcjtcblxuICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICBpZiAoaGFzVmFsaWRSZWYoY29uZmlnKSkge1xuICAgICAgLy8gU2lsZW50bHkgc3RlYWwgdGhlIHJlZiBmcm9tIHRoZSBwYXJlbnQuXG4gICAgICByZWYgPSBjb25maWcucmVmO1xuICAgICAgb3duZXIgPSBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50O1xuICAgIH1cbiAgICBpZiAoaGFzVmFsaWRLZXkoY29uZmlnKSkge1xuICAgICAga2V5ID0gJycgKyBjb25maWcua2V5O1xuICAgIH1cblxuICAgIC8vIFJlbWFpbmluZyBwcm9wZXJ0aWVzIG92ZXJyaWRlIGV4aXN0aW5nIHByb3BzXG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHZvaWQgMDtcbiAgICBpZiAoZWxlbWVudC50eXBlICYmIGVsZW1lbnQudHlwZS5kZWZhdWx0UHJvcHMpIHtcbiAgICAgIGRlZmF1bHRQcm9wcyA9IGVsZW1lbnQudHlwZS5kZWZhdWx0UHJvcHM7XG4gICAgfVxuICAgIGZvciAocHJvcE5hbWUgaW4gY29uZmlnKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsIHByb3BOYW1lKSAmJiAhUkVTRVJWRURfUFJPUFMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgIGlmIChjb25maWdbcHJvcE5hbWVdID09PSB1bmRlZmluZWQgJiYgZGVmYXVsdFByb3BzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAvLyBSZXNvbHZlIGRlZmF1bHQgcHJvcHNcbiAgICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBkZWZhdWx0UHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDaGlsZHJlbiBjYW4gYmUgbW9yZSB0aGFuIG9uZSBhcmd1bWVudCwgYW5kIHRob3NlIGFyZSB0cmFuc2ZlcnJlZCBvbnRvXG4gIC8vIHRoZSBuZXdseSBhbGxvY2F0ZWQgcHJvcHMgb2JqZWN0LlxuICB2YXIgY2hpbGRyZW5MZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcbiAgaWYgKGNoaWxkcmVuTGVuZ3RoID09PSAxKSB7XG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgfSBlbHNlIGlmIChjaGlsZHJlbkxlbmd0aCA+IDEpIHtcbiAgICB2YXIgY2hpbGRBcnJheSA9IEFycmF5KGNoaWxkcmVuTGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuTGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkQXJyYXlbaV0gPSBhcmd1bWVudHNbaSArIDJdO1xuICAgIH1cbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkQXJyYXk7XG4gIH1cblxuICByZXR1cm4gUmVhY3RFbGVtZW50KGVsZW1lbnQudHlwZSwga2V5LCByZWYsIHNlbGYsIHNvdXJjZSwgb3duZXIsIHByb3BzKTtcbn1cblxuLyoqXG4gKiBWZXJpZmllcyB0aGUgb2JqZWN0IGlzIGEgUmVhY3RFbGVtZW50LlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNpc3ZhbGlkZWxlbWVudFxuICogQHBhcmFtIHs/b2JqZWN0fSBvYmplY3RcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgYG9iamVjdGAgaXMgYSBSZWFjdEVsZW1lbnQuXG4gKiBAZmluYWxcbiAqL1xuZnVuY3Rpb24gaXNWYWxpZEVsZW1lbnQob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QgIT09IG51bGwgJiYgb2JqZWN0LiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEU7XG59XG5cbnZhciBTRVBBUkFUT1IgPSAnLic7XG52YXIgU1VCU0VQQVJBVE9SID0gJzonO1xuXG4vKipcbiAqIEVzY2FwZSBhbmQgd3JhcCBrZXkgc28gaXQgaXMgc2FmZSB0byB1c2UgYXMgYSByZWFjdGlkXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSB0byBiZSBlc2NhcGVkLlxuICogQHJldHVybiB7c3RyaW5nfSB0aGUgZXNjYXBlZCBrZXkuXG4gKi9cbmZ1bmN0aW9uIGVzY2FwZShrZXkpIHtcbiAgdmFyIGVzY2FwZVJlZ2V4ID0gL1s9Ol0vZztcbiAgdmFyIGVzY2FwZXJMb29rdXAgPSB7XG4gICAgJz0nOiAnPTAnLFxuICAgICc6JzogJz0yJ1xuICB9O1xuICB2YXIgZXNjYXBlZFN0cmluZyA9ICgnJyArIGtleSkucmVwbGFjZShlc2NhcGVSZWdleCwgZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgcmV0dXJuIGVzY2FwZXJMb29rdXBbbWF0Y2hdO1xuICB9KTtcblxuICByZXR1cm4gJyQnICsgZXNjYXBlZFN0cmluZztcbn1cblxuLyoqXG4gKiBUT0RPOiBUZXN0IHRoYXQgYSBzaW5nbGUgY2hpbGQgYW5kIGFuIGFycmF5IHdpdGggb25lIGl0ZW0gaGF2ZSB0aGUgc2FtZSBrZXlcbiAqIHBhdHRlcm4uXG4gKi9cblxudmFyIGRpZFdhcm5BYm91dE1hcHMgPSBmYWxzZTtcblxudmFyIHVzZXJQcm92aWRlZEtleUVzY2FwZVJlZ2V4ID0gL1xcLysvZztcbmZ1bmN0aW9uIGVzY2FwZVVzZXJQcm92aWRlZEtleSh0ZXh0KSB7XG4gIHJldHVybiAoJycgKyB0ZXh0KS5yZXBsYWNlKHVzZXJQcm92aWRlZEtleUVzY2FwZVJlZ2V4LCAnJCYvJyk7XG59XG5cbnZhciBQT09MX1NJWkUgPSAxMDtcbnZhciB0cmF2ZXJzZUNvbnRleHRQb29sID0gW107XG5mdW5jdGlvbiBnZXRQb29sZWRUcmF2ZXJzZUNvbnRleHQobWFwUmVzdWx0LCBrZXlQcmVmaXgsIG1hcEZ1bmN0aW9uLCBtYXBDb250ZXh0KSB7XG4gIGlmICh0cmF2ZXJzZUNvbnRleHRQb29sLmxlbmd0aCkge1xuICAgIHZhciB0cmF2ZXJzZUNvbnRleHQgPSB0cmF2ZXJzZUNvbnRleHRQb29sLnBvcCgpO1xuICAgIHRyYXZlcnNlQ29udGV4dC5yZXN1bHQgPSBtYXBSZXN1bHQ7XG4gICAgdHJhdmVyc2VDb250ZXh0LmtleVByZWZpeCA9IGtleVByZWZpeDtcbiAgICB0cmF2ZXJzZUNvbnRleHQuZnVuYyA9IG1hcEZ1bmN0aW9uO1xuICAgIHRyYXZlcnNlQ29udGV4dC5jb250ZXh0ID0gbWFwQ29udGV4dDtcbiAgICB0cmF2ZXJzZUNvbnRleHQuY291bnQgPSAwO1xuICAgIHJldHVybiB0cmF2ZXJzZUNvbnRleHQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3VsdDogbWFwUmVzdWx0LFxuICAgICAga2V5UHJlZml4OiBrZXlQcmVmaXgsXG4gICAgICBmdW5jOiBtYXBGdW5jdGlvbixcbiAgICAgIGNvbnRleHQ6IG1hcENvbnRleHQsXG4gICAgICBjb3VudDogMFxuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVsZWFzZVRyYXZlcnNlQ29udGV4dCh0cmF2ZXJzZUNvbnRleHQpIHtcbiAgdHJhdmVyc2VDb250ZXh0LnJlc3VsdCA9IG51bGw7XG4gIHRyYXZlcnNlQ29udGV4dC5rZXlQcmVmaXggPSBudWxsO1xuICB0cmF2ZXJzZUNvbnRleHQuZnVuYyA9IG51bGw7XG4gIHRyYXZlcnNlQ29udGV4dC5jb250ZXh0ID0gbnVsbDtcbiAgdHJhdmVyc2VDb250ZXh0LmNvdW50ID0gMDtcbiAgaWYgKHRyYXZlcnNlQ29udGV4dFBvb2wubGVuZ3RoIDwgUE9PTF9TSVpFKSB7XG4gICAgdHJhdmVyc2VDb250ZXh0UG9vbC5wdXNoKHRyYXZlcnNlQ29udGV4dCk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7IXN0cmluZ30gbmFtZVNvRmFyIE5hbWUgb2YgdGhlIGtleSBwYXRoIHNvIGZhci5cbiAqIEBwYXJhbSB7IWZ1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayB0byBpbnZva2Ugd2l0aCBlYWNoIGNoaWxkIGZvdW5kLlxuICogQHBhcmFtIHs/Kn0gdHJhdmVyc2VDb250ZXh0IFVzZWQgdG8gcGFzcyBpbmZvcm1hdGlvbiB0aHJvdWdob3V0IHRoZSB0cmF2ZXJzYWxcbiAqIHByb2Nlc3MuXG4gKiBAcmV0dXJuIHshbnVtYmVyfSBUaGUgbnVtYmVyIG9mIGNoaWxkcmVuIGluIHRoaXMgc3VidHJlZS5cbiAqL1xuZnVuY3Rpb24gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoY2hpbGRyZW4sIG5hbWVTb0ZhciwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiBjaGlsZHJlbjtcblxuICBpZiAodHlwZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgLy8gQWxsIG9mIHRoZSBhYm92ZSBhcmUgcGVyY2VpdmVkIGFzIG51bGwuXG4gICAgY2hpbGRyZW4gPSBudWxsO1xuICB9XG5cbiAgdmFyIGludm9rZUNhbGxiYWNrID0gZmFsc2U7XG5cbiAgaWYgKGNoaWxkcmVuID09PSBudWxsKSB7XG4gICAgaW52b2tlQ2FsbGJhY2sgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGludm9rZUNhbGxiYWNrID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBzd2l0Y2ggKGNoaWxkcmVuLiQkdHlwZW9mKSB7XG4gICAgICAgICAgY2FzZSBSRUFDVF9FTEVNRU5UX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9QT1JUQUxfVFlQRTpcbiAgICAgICAgICAgIGludm9rZUNhbGxiYWNrID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChpbnZva2VDYWxsYmFjaykge1xuICAgIGNhbGxiYWNrKHRyYXZlcnNlQ29udGV4dCwgY2hpbGRyZW4sXG4gICAgLy8gSWYgaXQncyB0aGUgb25seSBjaGlsZCwgdHJlYXQgdGhlIG5hbWUgYXMgaWYgaXQgd2FzIHdyYXBwZWQgaW4gYW4gYXJyYXlcbiAgICAvLyBzbyB0aGF0IGl0J3MgY29uc2lzdGVudCBpZiB0aGUgbnVtYmVyIG9mIGNoaWxkcmVuIGdyb3dzLlxuICAgIG5hbWVTb0ZhciA9PT0gJycgPyBTRVBBUkFUT1IgKyBnZXRDb21wb25lbnRLZXkoY2hpbGRyZW4sIDApIDogbmFtZVNvRmFyKTtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIHZhciBjaGlsZCA9IHZvaWQgMDtcbiAgdmFyIG5leHROYW1lID0gdm9pZCAwO1xuICB2YXIgc3VidHJlZUNvdW50ID0gMDsgLy8gQ291bnQgb2YgY2hpbGRyZW4gZm91bmQgaW4gdGhlIGN1cnJlbnQgc3VidHJlZS5cbiAgdmFyIG5leHROYW1lUHJlZml4ID0gbmFtZVNvRmFyID09PSAnJyA/IFNFUEFSQVRPUiA6IG5hbWVTb0ZhciArIFNVQlNFUEFSQVRPUjtcblxuICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgbmV4dE5hbWUgPSBuZXh0TmFtZVByZWZpeCArIGdldENvbXBvbmVudEtleShjaGlsZCwgaSk7XG4gICAgICBzdWJ0cmVlQ291bnQgKz0gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoY2hpbGQsIG5leHROYW1lLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKGNoaWxkcmVuKTtcbiAgICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHtcbiAgICAgICAgLy8gV2FybiBhYm91dCB1c2luZyBNYXBzIGFzIGNoaWxkcmVuXG4gICAgICAgIGlmIChpdGVyYXRvckZuID09PSBjaGlsZHJlbi5lbnRyaWVzKSB7XG4gICAgICAgICAgIWRpZFdhcm5BYm91dE1hcHMgPyB3YXJuaW5nJDEoZmFsc2UsICdVc2luZyBNYXBzIGFzIGNoaWxkcmVuIGlzIHVuc3VwcG9ydGVkIGFuZCB3aWxsIGxpa2VseSB5aWVsZCAnICsgJ3VuZXhwZWN0ZWQgcmVzdWx0cy4gQ29udmVydCBpdCB0byBhIHNlcXVlbmNlL2l0ZXJhYmxlIG9mIGtleWVkICcgKyAnUmVhY3RFbGVtZW50cyBpbnN0ZWFkLicpIDogdm9pZCAwO1xuICAgICAgICAgIGRpZFdhcm5BYm91dE1hcHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChjaGlsZHJlbik7XG4gICAgICB2YXIgc3RlcCA9IHZvaWQgMDtcbiAgICAgIHZhciBpaSA9IDA7XG4gICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgIGNoaWxkID0gc3RlcC52YWx1ZTtcbiAgICAgICAgbmV4dE5hbWUgPSBuZXh0TmFtZVByZWZpeCArIGdldENvbXBvbmVudEtleShjaGlsZCwgaWkrKyk7XG4gICAgICAgIHN1YnRyZWVDb3VudCArPSB0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbChjaGlsZCwgbmV4dE5hbWUsIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHZhciBhZGRlbmR1bSA9ICcnO1xuICAgICAge1xuICAgICAgICBhZGRlbmR1bSA9ICcgSWYgeW91IG1lYW50IHRvIHJlbmRlciBhIGNvbGxlY3Rpb24gb2YgY2hpbGRyZW4sIHVzZSBhbiBhcnJheSAnICsgJ2luc3RlYWQuJyArIFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0U3RhY2tBZGRlbmR1bSgpO1xuICAgICAgfVxuICAgICAgdmFyIGNoaWxkcmVuU3RyaW5nID0gJycgKyBjaGlsZHJlbjtcbiAgICAgIGludmFyaWFudChmYWxzZSwgJ09iamVjdHMgYXJlIG5vdCB2YWxpZCBhcyBhIFJlYWN0IGNoaWxkIChmb3VuZDogJXMpLiVzJywgY2hpbGRyZW5TdHJpbmcgPT09ICdbb2JqZWN0IE9iamVjdF0nID8gJ29iamVjdCB3aXRoIGtleXMgeycgKyBPYmplY3Qua2V5cyhjaGlsZHJlbikuam9pbignLCAnKSArICd9JyA6IGNoaWxkcmVuU3RyaW5nLCBhZGRlbmR1bSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHN1YnRyZWVDb3VudDtcbn1cblxuLyoqXG4gKiBUcmF2ZXJzZXMgY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhcyBgcHJvcHMuY2hpbGRyZW5gLCBidXRcbiAqIG1pZ2h0IGFsc28gYmUgc3BlY2lmaWVkIHRocm91Z2ggYXR0cmlidXRlczpcbiAqXG4gKiAtIGB0cmF2ZXJzZUFsbENoaWxkcmVuKHRoaXMucHJvcHMuY2hpbGRyZW4sIC4uLilgXG4gKiAtIGB0cmF2ZXJzZUFsbENoaWxkcmVuKHRoaXMucHJvcHMubGVmdFBhbmVsQ2hpbGRyZW4sIC4uLilgXG4gKlxuICogVGhlIGB0cmF2ZXJzZUNvbnRleHRgIGlzIGFuIG9wdGlvbmFsIGFyZ3VtZW50IHRoYXQgaXMgcGFzc2VkIHRocm91Z2ggdGhlXG4gKiBlbnRpcmUgdHJhdmVyc2FsLiBJdCBjYW4gYmUgdXNlZCB0byBzdG9yZSBhY2N1bXVsYXRpb25zIG9yIGFueXRoaW5nIGVsc2UgdGhhdFxuICogdGhlIGNhbGxiYWNrIG1pZ2h0IGZpbmQgcmVsZXZhbnQuXG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBvYmplY3QuXG4gKiBAcGFyYW0geyFmdW5jdGlvbn0gY2FsbGJhY2sgVG8gaW52b2tlIHVwb24gdHJhdmVyc2luZyBlYWNoIGNoaWxkLlxuICogQHBhcmFtIHs/Kn0gdHJhdmVyc2VDb250ZXh0IENvbnRleHQgZm9yIHRyYXZlcnNhbC5cbiAqIEByZXR1cm4geyFudW1iZXJ9IFRoZSBudW1iZXIgb2YgY2hpbGRyZW4gaW4gdGhpcyBzdWJ0cmVlLlxuICovXG5mdW5jdGlvbiB0cmF2ZXJzZUFsbENoaWxkcmVuKGNoaWxkcmVuLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KSB7XG4gIGlmIChjaGlsZHJlbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoY2hpbGRyZW4sICcnLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KTtcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZSBhIGtleSBzdHJpbmcgdGhhdCBpZGVudGlmaWVzIGEgY29tcG9uZW50IHdpdGhpbiBhIHNldC5cbiAqXG4gKiBAcGFyYW0geyp9IGNvbXBvbmVudCBBIGNvbXBvbmVudCB0aGF0IGNvdWxkIGNvbnRhaW4gYSBtYW51YWwga2V5LlxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IEluZGV4IHRoYXQgaXMgdXNlZCBpZiBhIG1hbnVhbCBrZXkgaXMgbm90IHByb3ZpZGVkLlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBnZXRDb21wb25lbnRLZXkoY29tcG9uZW50LCBpbmRleCkge1xuICAvLyBEbyBzb21lIHR5cGVjaGVja2luZyBoZXJlIHNpbmNlIHdlIGNhbGwgdGhpcyBibGluZGx5LiBXZSB3YW50IHRvIGVuc3VyZVxuICAvLyB0aGF0IHdlIGRvbid0IGJsb2NrIHBvdGVudGlhbCBmdXR1cmUgRVMgQVBJcy5cbiAgaWYgKHR5cGVvZiBjb21wb25lbnQgPT09ICdvYmplY3QnICYmIGNvbXBvbmVudCAhPT0gbnVsbCAmJiBjb21wb25lbnQua2V5ICE9IG51bGwpIHtcbiAgICAvLyBFeHBsaWNpdCBrZXlcbiAgICByZXR1cm4gZXNjYXBlKGNvbXBvbmVudC5rZXkpO1xuICB9XG4gIC8vIEltcGxpY2l0IGtleSBkZXRlcm1pbmVkIGJ5IHRoZSBpbmRleCBpbiB0aGUgc2V0XG4gIHJldHVybiBpbmRleC50b1N0cmluZygzNik7XG59XG5cbmZ1bmN0aW9uIGZvckVhY2hTaW5nbGVDaGlsZChib29rS2VlcGluZywgY2hpbGQsIG5hbWUpIHtcbiAgdmFyIGZ1bmMgPSBib29rS2VlcGluZy5mdW5jLFxuICAgICAgY29udGV4dCA9IGJvb2tLZWVwaW5nLmNvbnRleHQ7XG5cbiAgZnVuYy5jYWxsKGNvbnRleHQsIGNoaWxkLCBib29rS2VlcGluZy5jb3VudCsrKTtcbn1cblxuLyoqXG4gKiBJdGVyYXRlcyB0aHJvdWdoIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW5mb3JlYWNoXG4gKlxuICogVGhlIHByb3ZpZGVkIGZvckVhY2hGdW5jKGNoaWxkLCBpbmRleCkgd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2hcbiAqIGxlYWYgY2hpbGQuXG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCosIGludCl9IGZvckVhY2hGdW5jXG4gKiBAcGFyYW0geyp9IGZvckVhY2hDb250ZXh0IENvbnRleHQgZm9yIGZvckVhY2hDb250ZXh0LlxuICovXG5mdW5jdGlvbiBmb3JFYWNoQ2hpbGRyZW4oY2hpbGRyZW4sIGZvckVhY2hGdW5jLCBmb3JFYWNoQ29udGV4dCkge1xuICBpZiAoY2hpbGRyZW4gPT0gbnVsbCkge1xuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuICB2YXIgdHJhdmVyc2VDb250ZXh0ID0gZ2V0UG9vbGVkVHJhdmVyc2VDb250ZXh0KG51bGwsIG51bGwsIGZvckVhY2hGdW5jLCBmb3JFYWNoQ29udGV4dCk7XG4gIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIGZvckVhY2hTaW5nbGVDaGlsZCwgdHJhdmVyc2VDb250ZXh0KTtcbiAgcmVsZWFzZVRyYXZlcnNlQ29udGV4dCh0cmF2ZXJzZUNvbnRleHQpO1xufVxuXG5mdW5jdGlvbiBtYXBTaW5nbGVDaGlsZEludG9Db250ZXh0KGJvb2tLZWVwaW5nLCBjaGlsZCwgY2hpbGRLZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGJvb2tLZWVwaW5nLnJlc3VsdCxcbiAgICAgIGtleVByZWZpeCA9IGJvb2tLZWVwaW5nLmtleVByZWZpeCxcbiAgICAgIGZ1bmMgPSBib29rS2VlcGluZy5mdW5jLFxuICAgICAgY29udGV4dCA9IGJvb2tLZWVwaW5nLmNvbnRleHQ7XG5cblxuICB2YXIgbWFwcGVkQ2hpbGQgPSBmdW5jLmNhbGwoY29udGV4dCwgY2hpbGQsIGJvb2tLZWVwaW5nLmNvdW50KyspO1xuICBpZiAoQXJyYXkuaXNBcnJheShtYXBwZWRDaGlsZCkpIHtcbiAgICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKG1hcHBlZENoaWxkLCByZXN1bHQsIGNoaWxkS2V5LCBmdW5jdGlvbiAoYykge1xuICAgICAgcmV0dXJuIGM7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAobWFwcGVkQ2hpbGQgIT0gbnVsbCkge1xuICAgIGlmIChpc1ZhbGlkRWxlbWVudChtYXBwZWRDaGlsZCkpIHtcbiAgICAgIG1hcHBlZENoaWxkID0gY2xvbmVBbmRSZXBsYWNlS2V5KG1hcHBlZENoaWxkLFxuICAgICAgLy8gS2VlcCBib3RoIHRoZSAobWFwcGVkKSBhbmQgb2xkIGtleXMgaWYgdGhleSBkaWZmZXIsIGp1c3QgYXNcbiAgICAgIC8vIHRyYXZlcnNlQWxsQ2hpbGRyZW4gdXNlZCB0byBkbyBmb3Igb2JqZWN0cyBhcyBjaGlsZHJlblxuICAgICAga2V5UHJlZml4ICsgKG1hcHBlZENoaWxkLmtleSAmJiAoIWNoaWxkIHx8IGNoaWxkLmtleSAhPT0gbWFwcGVkQ2hpbGQua2V5KSA/IGVzY2FwZVVzZXJQcm92aWRlZEtleShtYXBwZWRDaGlsZC5rZXkpICsgJy8nIDogJycpICsgY2hpbGRLZXkpO1xuICAgIH1cbiAgICByZXN1bHQucHVzaChtYXBwZWRDaGlsZCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChjaGlsZHJlbiwgYXJyYXksIHByZWZpeCwgZnVuYywgY29udGV4dCkge1xuICB2YXIgZXNjYXBlZFByZWZpeCA9ICcnO1xuICBpZiAocHJlZml4ICE9IG51bGwpIHtcbiAgICBlc2NhcGVkUHJlZml4ID0gZXNjYXBlVXNlclByb3ZpZGVkS2V5KHByZWZpeCkgKyAnLyc7XG4gIH1cbiAgdmFyIHRyYXZlcnNlQ29udGV4dCA9IGdldFBvb2xlZFRyYXZlcnNlQ29udGV4dChhcnJheSwgZXNjYXBlZFByZWZpeCwgZnVuYywgY29udGV4dCk7XG4gIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIG1hcFNpbmdsZUNoaWxkSW50b0NvbnRleHQsIHRyYXZlcnNlQ29udGV4dCk7XG4gIHJlbGVhc2VUcmF2ZXJzZUNvbnRleHQodHJhdmVyc2VDb250ZXh0KTtcbn1cblxuLyoqXG4gKiBNYXBzIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW5tYXBcbiAqXG4gKiBUaGUgcHJvdmlkZWQgbWFwRnVuY3Rpb24oY2hpbGQsIGtleSwgaW5kZXgpIHdpbGwgYmUgY2FsbGVkIGZvciBlYWNoXG4gKiBsZWFmIGNoaWxkLlxuICpcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgY29udGFpbmVyLlxuICogQHBhcmFtIHtmdW5jdGlvbigqLCBpbnQpfSBmdW5jIFRoZSBtYXAgZnVuY3Rpb24uXG4gKiBAcGFyYW0geyp9IGNvbnRleHQgQ29udGV4dCBmb3IgbWFwRnVuY3Rpb24uXG4gKiBAcmV0dXJuIHtvYmplY3R9IE9iamVjdCBjb250YWluaW5nIHRoZSBvcmRlcmVkIG1hcCBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBtYXBDaGlsZHJlbihjaGlsZHJlbiwgZnVuYywgY29udGV4dCkge1xuICBpZiAoY2hpbGRyZW4gPT0gbnVsbCkge1xuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWwoY2hpbGRyZW4sIHJlc3VsdCwgbnVsbCwgZnVuYywgY29udGV4dCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ291bnQgdGhlIG51bWJlciBvZiBjaGlsZHJlbiB0aGF0IGFyZSB0eXBpY2FsbHkgc3BlY2lmaWVkIGFzXG4gKiBgcHJvcHMuY2hpbGRyZW5gLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbmNvdW50XG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBudW1iZXIgb2YgY2hpbGRyZW4uXG4gKi9cbmZ1bmN0aW9uIGNvdW50Q2hpbGRyZW4oY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSwgbnVsbCk7XG59XG5cbi8qKlxuICogRmxhdHRlbiBhIGNoaWxkcmVuIG9iamVjdCAodHlwaWNhbGx5IHNwZWNpZmllZCBhcyBgcHJvcHMuY2hpbGRyZW5gKSBhbmRcbiAqIHJldHVybiBhbiBhcnJheSB3aXRoIGFwcHJvcHJpYXRlbHkgcmUta2V5ZWQgY2hpbGRyZW4uXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVudG9hcnJheVxuICovXG5mdW5jdGlvbiB0b0FycmF5KGNoaWxkcmVuKSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChjaGlsZHJlbiwgcmVzdWx0LCBudWxsLCBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICByZXR1cm4gY2hpbGQ7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGZpcnN0IGNoaWxkIGluIGEgY29sbGVjdGlvbiBvZiBjaGlsZHJlbiBhbmQgdmVyaWZpZXMgdGhhdCB0aGVyZVxuICogaXMgb25seSBvbmUgY2hpbGQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVub25seVxuICpcbiAqIFRoZSBjdXJyZW50IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgZnVuY3Rpb24gYXNzdW1lcyB0aGF0IGEgc2luZ2xlIGNoaWxkIGdldHNcbiAqIHBhc3NlZCB3aXRob3V0IGEgd3JhcHBlciwgYnV0IHRoZSBwdXJwb3NlIG9mIHRoaXMgaGVscGVyIGZ1bmN0aW9uIGlzIHRvXG4gKiBhYnN0cmFjdCBhd2F5IHRoZSBwYXJ0aWN1bGFyIHN0cnVjdHVyZSBvZiBjaGlsZHJlbi5cbiAqXG4gKiBAcGFyYW0gez9vYmplY3R9IGNoaWxkcmVuIENoaWxkIGNvbGxlY3Rpb24gc3RydWN0dXJlLlxuICogQHJldHVybiB7UmVhY3RFbGVtZW50fSBUaGUgZmlyc3QgYW5kIG9ubHkgYFJlYWN0RWxlbWVudGAgY29udGFpbmVkIGluIHRoZVxuICogc3RydWN0dXJlLlxuICovXG5mdW5jdGlvbiBvbmx5Q2hpbGQoY2hpbGRyZW4pIHtcbiAgIWlzVmFsaWRFbGVtZW50KGNoaWxkcmVuKSA/IGludmFyaWFudChmYWxzZSwgJ1JlYWN0LkNoaWxkcmVuLm9ubHkgZXhwZWN0ZWQgdG8gcmVjZWl2ZSBhIHNpbmdsZSBSZWFjdCBlbGVtZW50IGNoaWxkLicpIDogdm9pZCAwO1xuICByZXR1cm4gY2hpbGRyZW47XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnRleHQoZGVmYXVsdFZhbHVlLCBjYWxjdWxhdGVDaGFuZ2VkQml0cykge1xuICBpZiAoY2FsY3VsYXRlQ2hhbmdlZEJpdHMgPT09IHVuZGVmaW5lZCkge1xuICAgIGNhbGN1bGF0ZUNoYW5nZWRCaXRzID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICB7XG4gICAgICAhKGNhbGN1bGF0ZUNoYW5nZWRCaXRzID09PSBudWxsIHx8IHR5cGVvZiBjYWxjdWxhdGVDaGFuZ2VkQml0cyA9PT0gJ2Z1bmN0aW9uJykgPyB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdjcmVhdGVDb250ZXh0OiBFeHBlY3RlZCB0aGUgb3B0aW9uYWwgc2Vjb25kIGFyZ3VtZW50IHRvIGJlIGEgJyArICdmdW5jdGlvbi4gSW5zdGVhZCByZWNlaXZlZDogJXMnLCBjYWxjdWxhdGVDaGFuZ2VkQml0cykgOiB2b2lkIDA7XG4gICAgfVxuICB9XG5cbiAgdmFyIGNvbnRleHQgPSB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0NPTlRFWFRfVFlQRSxcbiAgICBfY2FsY3VsYXRlQ2hhbmdlZEJpdHM6IGNhbGN1bGF0ZUNoYW5nZWRCaXRzLFxuICAgIC8vIEFzIGEgd29ya2Fyb3VuZCB0byBzdXBwb3J0IG11bHRpcGxlIGNvbmN1cnJlbnQgcmVuZGVyZXJzLCB3ZSBjYXRlZ29yaXplXG4gICAgLy8gc29tZSByZW5kZXJlcnMgYXMgcHJpbWFyeSBhbmQgb3RoZXJzIGFzIHNlY29uZGFyeS4gV2Ugb25seSBleHBlY3RcbiAgICAvLyB0aGVyZSB0byBiZSB0d28gY29uY3VycmVudCByZW5kZXJlcnMgYXQgbW9zdDogUmVhY3QgTmF0aXZlIChwcmltYXJ5KSBhbmRcbiAgICAvLyBGYWJyaWMgKHNlY29uZGFyeSk7IFJlYWN0IERPTSAocHJpbWFyeSkgYW5kIFJlYWN0IEFSVCAoc2Vjb25kYXJ5KS5cbiAgICAvLyBTZWNvbmRhcnkgcmVuZGVyZXJzIHN0b3JlIHRoZWlyIGNvbnRleHQgdmFsdWVzIG9uIHNlcGFyYXRlIGZpZWxkcy5cbiAgICBfY3VycmVudFZhbHVlOiBkZWZhdWx0VmFsdWUsXG4gICAgX2N1cnJlbnRWYWx1ZTI6IGRlZmF1bHRWYWx1ZSxcbiAgICAvLyBVc2VkIHRvIHRyYWNrIGhvdyBtYW55IGNvbmN1cnJlbnQgcmVuZGVyZXJzIHRoaXMgY29udGV4dCBjdXJyZW50bHlcbiAgICAvLyBzdXBwb3J0cyB3aXRoaW4gaW4gYSBzaW5nbGUgcmVuZGVyZXIuIFN1Y2ggYXMgcGFyYWxsZWwgc2VydmVyIHJlbmRlcmluZy5cbiAgICBfdGhyZWFkQ291bnQ6IDAsXG4gICAgLy8gVGhlc2UgYXJlIGNpcmN1bGFyXG4gICAgUHJvdmlkZXI6IG51bGwsXG4gICAgQ29uc3VtZXI6IG51bGxcbiAgfTtcblxuICBjb250ZXh0LlByb3ZpZGVyID0ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9QUk9WSURFUl9UWVBFLFxuICAgIF9jb250ZXh0OiBjb250ZXh0XG4gIH07XG5cbiAgdmFyIGhhc1dhcm5lZEFib3V0VXNpbmdOZXN0ZWRDb250ZXh0Q29uc3VtZXJzID0gZmFsc2U7XG4gIHZhciBoYXNXYXJuZWRBYm91dFVzaW5nQ29uc3VtZXJQcm92aWRlciA9IGZhbHNlO1xuXG4gIHtcbiAgICAvLyBBIHNlcGFyYXRlIG9iamVjdCwgYnV0IHByb3hpZXMgYmFjayB0byB0aGUgb3JpZ2luYWwgY29udGV4dCBvYmplY3QgZm9yXG4gICAgLy8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuIEl0IGhhcyBhIGRpZmZlcmVudCAkJHR5cGVvZiwgc28gd2UgY2FuIHByb3Blcmx5XG4gICAgLy8gd2FybiBmb3IgdGhlIGluY29ycmVjdCB1c2FnZSBvZiBDb250ZXh0IGFzIGEgQ29uc3VtZXIuXG4gICAgdmFyIENvbnN1bWVyID0ge1xuICAgICAgJCR0eXBlb2Y6IFJFQUNUX0NPTlRFWFRfVFlQRSxcbiAgICAgIF9jb250ZXh0OiBjb250ZXh0LFxuICAgICAgX2NhbGN1bGF0ZUNoYW5nZWRCaXRzOiBjb250ZXh0Ll9jYWxjdWxhdGVDaGFuZ2VkQml0c1xuICAgIH07XG4gICAgLy8gJEZsb3dGaXhNZTogRmxvdyBjb21wbGFpbnMgYWJvdXQgbm90IHNldHRpbmcgYSB2YWx1ZSwgd2hpY2ggaXMgaW50ZW50aW9uYWwgaGVyZVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKENvbnN1bWVyLCB7XG4gICAgICBQcm92aWRlcjoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIWhhc1dhcm5lZEFib3V0VXNpbmdDb25zdW1lclByb3ZpZGVyKSB7XG4gICAgICAgICAgICBoYXNXYXJuZWRBYm91dFVzaW5nQ29uc3VtZXJQcm92aWRlciA9IHRydWU7XG4gICAgICAgICAgICB3YXJuaW5nJDEoZmFsc2UsICdSZW5kZXJpbmcgPENvbnRleHQuQ29uc3VtZXIuUHJvdmlkZXI+IGlzIG5vdCBzdXBwb3J0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiAnICsgJ2EgZnV0dXJlIG1ham9yIHJlbGVhc2UuIERpZCB5b3UgbWVhbiB0byByZW5kZXIgPENvbnRleHQuUHJvdmlkZXI+IGluc3RlYWQ/Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjb250ZXh0LlByb3ZpZGVyO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChfUHJvdmlkZXIpIHtcbiAgICAgICAgICBjb250ZXh0LlByb3ZpZGVyID0gX1Byb3ZpZGVyO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX2N1cnJlbnRWYWx1ZToge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY29udGV4dC5fY3VycmVudFZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChfY3VycmVudFZhbHVlKSB7XG4gICAgICAgICAgY29udGV4dC5fY3VycmVudFZhbHVlID0gX2N1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF9jdXJyZW50VmFsdWUyOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0Ll9jdXJyZW50VmFsdWUyO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChfY3VycmVudFZhbHVlMikge1xuICAgICAgICAgIGNvbnRleHQuX2N1cnJlbnRWYWx1ZTIgPSBfY3VycmVudFZhbHVlMjtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF90aHJlYWRDb3VudDoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY29udGV4dC5fdGhyZWFkQ291bnQ7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKF90aHJlYWRDb3VudCkge1xuICAgICAgICAgIGNvbnRleHQuX3RocmVhZENvdW50ID0gX3RocmVhZENvdW50O1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgQ29uc3VtZXI6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFoYXNXYXJuZWRBYm91dFVzaW5nTmVzdGVkQ29udGV4dENvbnN1bWVycykge1xuICAgICAgICAgICAgaGFzV2FybmVkQWJvdXRVc2luZ05lc3RlZENvbnRleHRDb25zdW1lcnMgPSB0cnVlO1xuICAgICAgICAgICAgd2FybmluZyQxKGZhbHNlLCAnUmVuZGVyaW5nIDxDb250ZXh0LkNvbnN1bWVyLkNvbnN1bWVyPiBpcyBub3Qgc3VwcG9ydGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gJyArICdhIGZ1dHVyZSBtYWpvciByZWxlYXNlLiBEaWQgeW91IG1lYW4gdG8gcmVuZGVyIDxDb250ZXh0LkNvbnN1bWVyPiBpbnN0ZWFkPycpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY29udGV4dC5Db25zdW1lcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIC8vICRGbG93Rml4TWU6IEZsb3cgY29tcGxhaW5zIGFib3V0IG1pc3NpbmcgcHJvcGVydGllcyBiZWNhdXNlIGl0IGRvZXNuJ3QgdW5kZXJzdGFuZCBkZWZpbmVQcm9wZXJ0eVxuICAgIGNvbnRleHQuQ29uc3VtZXIgPSBDb25zdW1lcjtcbiAgfVxuXG4gIHtcbiAgICBjb250ZXh0Ll9jdXJyZW50UmVuZGVyZXIgPSBudWxsO1xuICAgIGNvbnRleHQuX2N1cnJlbnRSZW5kZXJlcjIgPSBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5cbmZ1bmN0aW9uIGxhenkoY3Rvcikge1xuICB2YXIgbGF6eVR5cGUgPSB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0xBWllfVFlQRSxcbiAgICBfY3RvcjogY3RvcixcbiAgICAvLyBSZWFjdCB1c2VzIHRoZXNlIGZpZWxkcyB0byBzdG9yZSB0aGUgcmVzdWx0LlxuICAgIF9zdGF0dXM6IC0xLFxuICAgIF9yZXN1bHQ6IG51bGxcbiAgfTtcblxuICB7XG4gICAgLy8gSW4gcHJvZHVjdGlvbiwgdGhpcyB3b3VsZCBqdXN0IHNldCBpdCBvbiB0aGUgb2JqZWN0LlxuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB2b2lkIDA7XG4gICAgdmFyIHByb3BUeXBlcyA9IHZvaWQgMDtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhsYXp5VHlwZSwge1xuICAgICAgZGVmYXVsdFByb3BzOiB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGRlZmF1bHRQcm9wcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmV3RGVmYXVsdFByb3BzKSB7XG4gICAgICAgICAgd2FybmluZyQxKGZhbHNlLCAnUmVhY3QubGF6eSguLi4pOiBJdCBpcyBub3Qgc3VwcG9ydGVkIHRvIGFzc2lnbiBgZGVmYXVsdFByb3BzYCB0byAnICsgJ2EgbGF6eSBjb21wb25lbnQgaW1wb3J0LiBFaXRoZXIgc3BlY2lmeSB0aGVtIHdoZXJlIHRoZSBjb21wb25lbnQgJyArICdpcyBkZWZpbmVkLCBvciBjcmVhdGUgYSB3cmFwcGluZyBjb21wb25lbnQgYXJvdW5kIGl0LicpO1xuICAgICAgICAgIGRlZmF1bHRQcm9wcyA9IG5ld0RlZmF1bHRQcm9wcztcbiAgICAgICAgICAvLyBNYXRjaCBwcm9kdWN0aW9uIGJlaGF2aW9yIG1vcmUgY2xvc2VseTpcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobGF6eVR5cGUsICdkZWZhdWx0UHJvcHMnLCB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcFR5cGVzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdQcm9wVHlwZXMpIHtcbiAgICAgICAgICB3YXJuaW5nJDEoZmFsc2UsICdSZWFjdC5sYXp5KC4uLik6IEl0IGlzIG5vdCBzdXBwb3J0ZWQgdG8gYXNzaWduIGBwcm9wVHlwZXNgIHRvICcgKyAnYSBsYXp5IGNvbXBvbmVudCBpbXBvcnQuIEVpdGhlciBzcGVjaWZ5IHRoZW0gd2hlcmUgdGhlIGNvbXBvbmVudCAnICsgJ2lzIGRlZmluZWQsIG9yIGNyZWF0ZSBhIHdyYXBwaW5nIGNvbXBvbmVudCBhcm91bmQgaXQuJyk7XG4gICAgICAgICAgcHJvcFR5cGVzID0gbmV3UHJvcFR5cGVzO1xuICAgICAgICAgIC8vIE1hdGNoIHByb2R1Y3Rpb24gYmVoYXZpb3IgbW9yZSBjbG9zZWx5OlxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsYXp5VHlwZSwgJ3Byb3BUeXBlcycsIHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGxhenlUeXBlO1xufVxuXG5mdW5jdGlvbiBmb3J3YXJkUmVmKHJlbmRlcikge1xuICB7XG4gICAgaWYgKHJlbmRlciAhPSBudWxsICYmIHJlbmRlci4kJHR5cGVvZiA9PT0gUkVBQ1RfTUVNT19UWVBFKSB7XG4gICAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdmb3J3YXJkUmVmIHJlcXVpcmVzIGEgcmVuZGVyIGZ1bmN0aW9uIGJ1dCByZWNlaXZlZCBhIGBtZW1vYCAnICsgJ2NvbXBvbmVudC4gSW5zdGVhZCBvZiBmb3J3YXJkUmVmKG1lbW8oLi4uKSksIHVzZSAnICsgJ21lbW8oZm9yd2FyZFJlZiguLi4pKS4nKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiByZW5kZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ2ZvcndhcmRSZWYgcmVxdWlyZXMgYSByZW5kZXIgZnVuY3Rpb24gYnV0IHdhcyBnaXZlbiAlcy4nLCByZW5kZXIgPT09IG51bGwgPyAnbnVsbCcgOiB0eXBlb2YgcmVuZGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgIShcbiAgICAgIC8vIERvIG5vdCB3YXJuIGZvciAwIGFyZ3VtZW50cyBiZWNhdXNlIGl0IGNvdWxkIGJlIGR1ZSB0byB1c2FnZSBvZiB0aGUgJ2FyZ3VtZW50cycgb2JqZWN0XG4gICAgICByZW5kZXIubGVuZ3RoID09PSAwIHx8IHJlbmRlci5sZW5ndGggPT09IDIpID8gd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnZm9yd2FyZFJlZiByZW5kZXIgZnVuY3Rpb25zIGFjY2VwdCBleGFjdGx5IHR3byBwYXJhbWV0ZXJzOiBwcm9wcyBhbmQgcmVmLiAlcycsIHJlbmRlci5sZW5ndGggPT09IDEgPyAnRGlkIHlvdSBmb3JnZXQgdG8gdXNlIHRoZSByZWYgcGFyYW1ldGVyPycgOiAnQW55IGFkZGl0aW9uYWwgcGFyYW1ldGVyIHdpbGwgYmUgdW5kZWZpbmVkLicpIDogdm9pZCAwO1xuICAgIH1cblxuICAgIGlmIChyZW5kZXIgIT0gbnVsbCkge1xuICAgICAgIShyZW5kZXIuZGVmYXVsdFByb3BzID09IG51bGwgJiYgcmVuZGVyLnByb3BUeXBlcyA9PSBudWxsKSA/IHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ2ZvcndhcmRSZWYgcmVuZGVyIGZ1bmN0aW9ucyBkbyBub3Qgc3VwcG9ydCBwcm9wVHlwZXMgb3IgZGVmYXVsdFByb3BzLiAnICsgJ0RpZCB5b3UgYWNjaWRlbnRhbGx5IHBhc3MgYSBSZWFjdCBjb21wb25lbnQ/JykgOiB2b2lkIDA7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSxcbiAgICByZW5kZXI6IHJlbmRlclxuICB9O1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSkge1xuICByZXR1cm4gdHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nIHx8XG4gIC8vIE5vdGU6IGl0cyB0eXBlb2YgbWlnaHQgYmUgb3RoZXIgdGhhbiAnc3ltYm9sJyBvciAnbnVtYmVyJyBpZiBpdCdzIGEgcG9seWZpbGwuXG4gIHR5cGUgPT09IFJFQUNUX0ZSQUdNRU5UX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfUFJPRklMRVJfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NVU1BFTlNFX1RZUEUgfHwgdHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmIHR5cGUgIT09IG51bGwgJiYgKHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0xBWllfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfUFJPVklERVJfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9DT05URVhUX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSk7XG59XG5cbmZ1bmN0aW9uIG1lbW8odHlwZSwgY29tcGFyZSkge1xuICB7XG4gICAgaWYgKCFpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSkpIHtcbiAgICAgIHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ21lbW86IFRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgY29tcG9uZW50LiBJbnN0ZWFkICcgKyAncmVjZWl2ZWQ6ICVzJywgdHlwZSA9PT0gbnVsbCA/ICdudWxsJyA6IHR5cGVvZiB0eXBlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfTUVNT19UWVBFLFxuICAgIHR5cGU6IHR5cGUsXG4gICAgY29tcGFyZTogY29tcGFyZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGNvbXBhcmVcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZURpc3BhdGNoZXIoKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gUmVhY3RDdXJyZW50RGlzcGF0Y2hlci5jdXJyZW50O1xuICAhKGRpc3BhdGNoZXIgIT09IG51bGwpID8gaW52YXJpYW50KGZhbHNlLCAnSG9va3MgY2FuIG9ubHkgYmUgY2FsbGVkIGluc2lkZSB0aGUgYm9keSBvZiBhIGZ1bmN0aW9uIGNvbXBvbmVudC4gKGh0dHBzOi8vZmIubWUvcmVhY3QtaW52YWxpZC1ob29rLWNhbGwpJykgOiB2b2lkIDA7XG4gIHJldHVybiBkaXNwYXRjaGVyO1xufVxuXG5mdW5jdGlvbiB1c2VDb250ZXh0KENvbnRleHQsIHVuc3RhYmxlX29ic2VydmVkQml0cykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHtcbiAgICAhKHVuc3RhYmxlX29ic2VydmVkQml0cyA9PT0gdW5kZWZpbmVkKSA/IHdhcm5pbmckMShmYWxzZSwgJ3VzZUNvbnRleHQoKSBzZWNvbmQgYXJndW1lbnQgaXMgcmVzZXJ2ZWQgZm9yIGZ1dHVyZSAnICsgJ3VzZSBpbiBSZWFjdC4gUGFzc2luZyBpdCBpcyBub3Qgc3VwcG9ydGVkLiAnICsgJ1lvdSBwYXNzZWQ6ICVzLiVzJywgdW5zdGFibGVfb2JzZXJ2ZWRCaXRzLCB0eXBlb2YgdW5zdGFibGVfb2JzZXJ2ZWRCaXRzID09PSAnbnVtYmVyJyAmJiBBcnJheS5pc0FycmF5KGFyZ3VtZW50c1syXSkgPyAnXFxuXFxuRGlkIHlvdSBjYWxsIGFycmF5Lm1hcCh1c2VDb250ZXh0KT8gJyArICdDYWxsaW5nIEhvb2tzIGluc2lkZSBhIGxvb3AgaXMgbm90IHN1cHBvcnRlZC4gJyArICdMZWFybiBtb3JlIGF0IGh0dHBzOi8vZmIubWUvcnVsZXMtb2YtaG9va3MnIDogJycpIDogdm9pZCAwO1xuXG4gICAgLy8gVE9ETzogYWRkIGEgbW9yZSBnZW5lcmljIHdhcm5pbmcgZm9yIGludmFsaWQgdmFsdWVzLlxuICAgIGlmIChDb250ZXh0Ll9jb250ZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciByZWFsQ29udGV4dCA9IENvbnRleHQuX2NvbnRleHQ7XG4gICAgICAvLyBEb24ndCBkZWR1cGxpY2F0ZSBiZWNhdXNlIHRoaXMgbGVnaXRpbWF0ZWx5IGNhdXNlcyBidWdzXG4gICAgICAvLyBhbmQgbm9ib2R5IHNob3VsZCBiZSB1c2luZyB0aGlzIGluIGV4aXN0aW5nIGNvZGUuXG4gICAgICBpZiAocmVhbENvbnRleHQuQ29uc3VtZXIgPT09IENvbnRleHQpIHtcbiAgICAgICAgd2FybmluZyQxKGZhbHNlLCAnQ2FsbGluZyB1c2VDb250ZXh0KENvbnRleHQuQ29uc3VtZXIpIGlzIG5vdCBzdXBwb3J0ZWQsIG1heSBjYXVzZSBidWdzLCBhbmQgd2lsbCBiZSAnICsgJ3JlbW92ZWQgaW4gYSBmdXR1cmUgbWFqb3IgcmVsZWFzZS4gRGlkIHlvdSBtZWFuIHRvIGNhbGwgdXNlQ29udGV4dChDb250ZXh0KSBpbnN0ZWFkPycpO1xuICAgICAgfSBlbHNlIGlmIChyZWFsQ29udGV4dC5Qcm92aWRlciA9PT0gQ29udGV4dCkge1xuICAgICAgICB3YXJuaW5nJDEoZmFsc2UsICdDYWxsaW5nIHVzZUNvbnRleHQoQ29udGV4dC5Qcm92aWRlcikgaXMgbm90IHN1cHBvcnRlZC4gJyArICdEaWQgeW91IG1lYW4gdG8gY2FsbCB1c2VDb250ZXh0KENvbnRleHQpIGluc3RlYWQ/Jyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUNvbnRleHQoQ29udGV4dCwgdW5zdGFibGVfb2JzZXJ2ZWRCaXRzKTtcbn1cblxuZnVuY3Rpb24gdXNlU3RhdGUoaW5pdGlhbFN0YXRlKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlU3RhdGUoaW5pdGlhbFN0YXRlKTtcbn1cblxuZnVuY3Rpb24gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsQXJnLCBpbml0KSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsQXJnLCBpbml0KTtcbn1cblxuZnVuY3Rpb24gdXNlUmVmKGluaXRpYWxWYWx1ZSkge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZVJlZihpbml0aWFsVmFsdWUpO1xufVxuXG5mdW5jdGlvbiB1c2VFZmZlY3QoY3JlYXRlLCBpbnB1dHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VFZmZlY3QoY3JlYXRlLCBpbnB1dHMpO1xufVxuXG5mdW5jdGlvbiB1c2VMYXlvdXRFZmZlY3QoY3JlYXRlLCBpbnB1dHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VMYXlvdXRFZmZlY3QoY3JlYXRlLCBpbnB1dHMpO1xufVxuXG5mdW5jdGlvbiB1c2VDYWxsYmFjayhjYWxsYmFjaywgaW5wdXRzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlQ2FsbGJhY2soY2FsbGJhY2ssIGlucHV0cyk7XG59XG5cbmZ1bmN0aW9uIHVzZU1lbW8oY3JlYXRlLCBpbnB1dHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VNZW1vKGNyZWF0ZSwgaW5wdXRzKTtcbn1cblxuZnVuY3Rpb24gdXNlSW1wZXJhdGl2ZUhhbmRsZShyZWYsIGNyZWF0ZSwgaW5wdXRzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlSW1wZXJhdGl2ZUhhbmRsZShyZWYsIGNyZWF0ZSwgaW5wdXRzKTtcbn1cblxuZnVuY3Rpb24gdXNlRGVidWdWYWx1ZSh2YWx1ZSwgZm9ybWF0dGVyRm4pIHtcbiAge1xuICAgIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgICByZXR1cm4gZGlzcGF0Y2hlci51c2VEZWJ1Z1ZhbHVlKHZhbHVlLCBmb3JtYXR0ZXJGbik7XG4gIH1cbn1cblxuLyoqXG4gKiBSZWFjdEVsZW1lbnRWYWxpZGF0b3IgcHJvdmlkZXMgYSB3cmFwcGVyIGFyb3VuZCBhIGVsZW1lbnQgZmFjdG9yeVxuICogd2hpY2ggdmFsaWRhdGVzIHRoZSBwcm9wcyBwYXNzZWQgdG8gdGhlIGVsZW1lbnQuIFRoaXMgaXMgaW50ZW5kZWQgdG8gYmVcbiAqIHVzZWQgb25seSBpbiBERVYgYW5kIGNvdWxkIGJlIHJlcGxhY2VkIGJ5IGEgc3RhdGljIHR5cGUgY2hlY2tlciBmb3IgbGFuZ3VhZ2VzXG4gKiB0aGF0IHN1cHBvcnQgaXQuXG4gKi9cblxudmFyIHByb3BUeXBlc01pc3NwZWxsV2FybmluZ1Nob3duID0gdm9pZCAwO1xuXG57XG4gIHByb3BUeXBlc01pc3NwZWxsV2FybmluZ1Nob3duID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bSgpIHtcbiAgaWYgKFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQpIHtcbiAgICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWUoUmVhY3RDdXJyZW50T3duZXIuY3VycmVudC50eXBlKTtcbiAgICBpZiAobmFtZSkge1xuICAgICAgcmV0dXJuICdcXG5cXG5DaGVjayB0aGUgcmVuZGVyIG1ldGhvZCBvZiBgJyArIG5hbWUgKyAnYC4nO1xuICAgIH1cbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIGdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtKGVsZW1lbnRQcm9wcykge1xuICBpZiAoZWxlbWVudFByb3BzICE9PSBudWxsICYmIGVsZW1lbnRQcm9wcyAhPT0gdW5kZWZpbmVkICYmIGVsZW1lbnRQcm9wcy5fX3NvdXJjZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIHNvdXJjZSA9IGVsZW1lbnRQcm9wcy5fX3NvdXJjZTtcbiAgICB2YXIgZmlsZU5hbWUgPSBzb3VyY2UuZmlsZU5hbWUucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpO1xuICAgIHZhciBsaW5lTnVtYmVyID0gc291cmNlLmxpbmVOdW1iZXI7XG4gICAgcmV0dXJuICdcXG5cXG5DaGVjayB5b3VyIGNvZGUgYXQgJyArIGZpbGVOYW1lICsgJzonICsgbGluZU51bWJlciArICcuJztcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbi8qKlxuICogV2FybiBpZiB0aGVyZSdzIG5vIGtleSBleHBsaWNpdGx5IHNldCBvbiBkeW5hbWljIGFycmF5cyBvZiBjaGlsZHJlbiBvclxuICogb2JqZWN0IGtleXMgYXJlIG5vdCB2YWxpZC4gVGhpcyBhbGxvd3MgdXMgdG8ga2VlcCB0cmFjayBvZiBjaGlsZHJlbiBiZXR3ZWVuXG4gKiB1cGRhdGVzLlxuICovXG52YXIgb3duZXJIYXNLZXlVc2VXYXJuaW5nID0ge307XG5cbmZ1bmN0aW9uIGdldEN1cnJlbnRDb21wb25lbnRFcnJvckluZm8ocGFyZW50VHlwZSkge1xuICB2YXIgaW5mbyA9IGdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bSgpO1xuXG4gIGlmICghaW5mbykge1xuICAgIHZhciBwYXJlbnROYW1lID0gdHlwZW9mIHBhcmVudFR5cGUgPT09ICdzdHJpbmcnID8gcGFyZW50VHlwZSA6IHBhcmVudFR5cGUuZGlzcGxheU5hbWUgfHwgcGFyZW50VHlwZS5uYW1lO1xuICAgIGlmIChwYXJlbnROYW1lKSB7XG4gICAgICBpbmZvID0gJ1xcblxcbkNoZWNrIHRoZSB0b3AtbGV2ZWwgcmVuZGVyIGNhbGwgdXNpbmcgPCcgKyBwYXJlbnROYW1lICsgJz4uJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGluZm87XG59XG5cbi8qKlxuICogV2FybiBpZiB0aGUgZWxlbWVudCBkb2Vzbid0IGhhdmUgYW4gZXhwbGljaXQga2V5IGFzc2lnbmVkIHRvIGl0LlxuICogVGhpcyBlbGVtZW50IGlzIGluIGFuIGFycmF5LiBUaGUgYXJyYXkgY291bGQgZ3JvdyBhbmQgc2hyaW5rIG9yIGJlXG4gKiByZW9yZGVyZWQuIEFsbCBjaGlsZHJlbiB0aGF0IGhhdmVuJ3QgYWxyZWFkeSBiZWVuIHZhbGlkYXRlZCBhcmUgcmVxdWlyZWQgdG9cbiAqIGhhdmUgYSBcImtleVwiIHByb3BlcnR5IGFzc2lnbmVkIHRvIGl0LiBFcnJvciBzdGF0dXNlcyBhcmUgY2FjaGVkIHNvIGEgd2FybmluZ1xuICogd2lsbCBvbmx5IGJlIHNob3duIG9uY2UuXG4gKlxuICogQGludGVybmFsXG4gKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHRoYXQgcmVxdWlyZXMgYSBrZXkuXG4gKiBAcGFyYW0geyp9IHBhcmVudFR5cGUgZWxlbWVudCdzIHBhcmVudCdzIHR5cGUuXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlRXhwbGljaXRLZXkoZWxlbWVudCwgcGFyZW50VHlwZSkge1xuICBpZiAoIWVsZW1lbnQuX3N0b3JlIHx8IGVsZW1lbnQuX3N0b3JlLnZhbGlkYXRlZCB8fCBlbGVtZW50LmtleSAhPSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGVsZW1lbnQuX3N0b3JlLnZhbGlkYXRlZCA9IHRydWU7XG5cbiAgdmFyIGN1cnJlbnRDb21wb25lbnRFcnJvckluZm8gPSBnZXRDdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvKHBhcmVudFR5cGUpO1xuICBpZiAob3duZXJIYXNLZXlVc2VXYXJuaW5nW2N1cnJlbnRDb21wb25lbnRFcnJvckluZm9dKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIG93bmVySGFzS2V5VXNlV2FybmluZ1tjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvXSA9IHRydWU7XG5cbiAgLy8gVXN1YWxseSB0aGUgY3VycmVudCBvd25lciBpcyB0aGUgb2ZmZW5kZXIsIGJ1dCBpZiBpdCBhY2NlcHRzIGNoaWxkcmVuIGFzIGFcbiAgLy8gcHJvcGVydHksIGl0IG1heSBiZSB0aGUgY3JlYXRvciBvZiB0aGUgY2hpbGQgdGhhdCdzIHJlc3BvbnNpYmxlIGZvclxuICAvLyBhc3NpZ25pbmcgaXQgYSBrZXkuXG4gIHZhciBjaGlsZE93bmVyID0gJyc7XG4gIGlmIChlbGVtZW50ICYmIGVsZW1lbnQuX293bmVyICYmIGVsZW1lbnQuX293bmVyICE9PSBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50KSB7XG4gICAgLy8gR2l2ZSB0aGUgY29tcG9uZW50IHRoYXQgb3JpZ2luYWxseSBjcmVhdGVkIHRoaXMgY2hpbGQuXG4gICAgY2hpbGRPd25lciA9ICcgSXQgd2FzIHBhc3NlZCBhIGNoaWxkIGZyb20gJyArIGdldENvbXBvbmVudE5hbWUoZWxlbWVudC5fb3duZXIudHlwZSkgKyAnLic7XG4gIH1cblxuICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChlbGVtZW50KTtcbiAge1xuICAgIHdhcm5pbmckMShmYWxzZSwgJ0VhY2ggY2hpbGQgaW4gYSBsaXN0IHNob3VsZCBoYXZlIGEgdW5pcXVlIFwia2V5XCIgcHJvcC4nICsgJyVzJXMgU2VlIGh0dHBzOi8vZmIubWUvcmVhY3Qtd2FybmluZy1rZXlzIGZvciBtb3JlIGluZm9ybWF0aW9uLicsIGN1cnJlbnRDb21wb25lbnRFcnJvckluZm8sIGNoaWxkT3duZXIpO1xuICB9XG4gIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KG51bGwpO1xufVxuXG4vKipcbiAqIEVuc3VyZSB0aGF0IGV2ZXJ5IGVsZW1lbnQgZWl0aGVyIGlzIHBhc3NlZCBpbiBhIHN0YXRpYyBsb2NhdGlvbiwgaW4gYW5cbiAqIGFycmF5IHdpdGggYW4gZXhwbGljaXQga2V5cyBwcm9wZXJ0eSBkZWZpbmVkLCBvciBpbiBhbiBvYmplY3QgbGl0ZXJhbFxuICogd2l0aCB2YWxpZCBrZXkgcHJvcGVydHkuXG4gKlxuICogQGludGVybmFsXG4gKiBAcGFyYW0ge1JlYWN0Tm9kZX0gbm9kZSBTdGF0aWNhbGx5IHBhc3NlZCBjaGlsZCBvZiBhbnkgdHlwZS5cbiAqIEBwYXJhbSB7Kn0gcGFyZW50VHlwZSBub2RlJ3MgcGFyZW50J3MgdHlwZS5cbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVDaGlsZEtleXMobm9kZSwgcGFyZW50VHlwZSkge1xuICBpZiAodHlwZW9mIG5vZGUgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KG5vZGUpKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hpbGQgPSBub2RlW2ldO1xuICAgICAgaWYgKGlzVmFsaWRFbGVtZW50KGNoaWxkKSkge1xuICAgICAgICB2YWxpZGF0ZUV4cGxpY2l0S2V5KGNoaWxkLCBwYXJlbnRUeXBlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNWYWxpZEVsZW1lbnQobm9kZSkpIHtcbiAgICAvLyBUaGlzIGVsZW1lbnQgd2FzIHBhc3NlZCBpbiBhIHZhbGlkIGxvY2F0aW9uLlxuICAgIGlmIChub2RlLl9zdG9yZSkge1xuICAgICAgbm9kZS5fc3RvcmUudmFsaWRhdGVkID0gdHJ1ZTtcbiAgICB9XG4gIH0gZWxzZSBpZiAobm9kZSkge1xuICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihub2RlKTtcbiAgICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIEVudHJ5IGl0ZXJhdG9ycyB1c2VkIHRvIHByb3ZpZGUgaW1wbGljaXQga2V5cyxcbiAgICAgIC8vIGJ1dCBub3cgd2UgcHJpbnQgYSBzZXBhcmF0ZSB3YXJuaW5nIGZvciB0aGVtIGxhdGVyLlxuICAgICAgaWYgKGl0ZXJhdG9yRm4gIT09IG5vZGUuZW50cmllcykge1xuICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwobm9kZSk7XG4gICAgICAgIHZhciBzdGVwID0gdm9pZCAwO1xuICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgaWYgKGlzVmFsaWRFbGVtZW50KHN0ZXAudmFsdWUpKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZUV4cGxpY2l0S2V5KHN0ZXAudmFsdWUsIHBhcmVudFR5cGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEdpdmVuIGFuIGVsZW1lbnQsIHZhbGlkYXRlIHRoYXQgaXRzIHByb3BzIGZvbGxvdyB0aGUgcHJvcFR5cGVzIGRlZmluaXRpb24sXG4gKiBwcm92aWRlZCBieSB0aGUgdHlwZS5cbiAqXG4gKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gZWxlbWVudFxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZVByb3BUeXBlcyhlbGVtZW50KSB7XG4gIHZhciB0eXBlID0gZWxlbWVudC50eXBlO1xuICBpZiAodHlwZSA9PT0gbnVsbCB8fCB0eXBlID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZSh0eXBlKTtcbiAgdmFyIHByb3BUeXBlcyA9IHZvaWQgMDtcbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcHJvcFR5cGVzID0gdHlwZS5wcm9wVHlwZXM7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmICh0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFIHx8XG4gIC8vIE5vdGU6IE1lbW8gb25seSBjaGVja3Mgb3V0ZXIgcHJvcHMgaGVyZS5cbiAgLy8gSW5uZXIgcHJvcHMgYXJlIGNoZWNrZWQgaW4gdGhlIHJlY29uY2lsZXIuXG4gIHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSkpIHtcbiAgICBwcm9wVHlwZXMgPSB0eXBlLnByb3BUeXBlcztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHByb3BUeXBlcykge1xuICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGVsZW1lbnQpO1xuICAgIGNoZWNrUHJvcFR5cGVzKHByb3BUeXBlcywgZWxlbWVudC5wcm9wcywgJ3Byb3AnLCBuYW1lLCBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldFN0YWNrQWRkZW5kdW0pO1xuICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KG51bGwpO1xuICB9IGVsc2UgaWYgKHR5cGUuUHJvcFR5cGVzICE9PSB1bmRlZmluZWQgJiYgIXByb3BUeXBlc01pc3NwZWxsV2FybmluZ1Nob3duKSB7XG4gICAgcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd24gPSB0cnVlO1xuICAgIHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ0NvbXBvbmVudCAlcyBkZWNsYXJlZCBgUHJvcFR5cGVzYCBpbnN0ZWFkIG9mIGBwcm9wVHlwZXNgLiBEaWQgeW91IG1pc3NwZWxsIHRoZSBwcm9wZXJ0eSBhc3NpZ25tZW50PycsIG5hbWUgfHwgJ1Vua25vd24nKTtcbiAgfVxuICBpZiAodHlwZW9mIHR5cGUuZ2V0RGVmYXVsdFByb3BzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgIXR5cGUuZ2V0RGVmYXVsdFByb3BzLmlzUmVhY3RDbGFzc0FwcHJvdmVkID8gd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnZ2V0RGVmYXVsdFByb3BzIGlzIG9ubHkgdXNlZCBvbiBjbGFzc2ljIFJlYWN0LmNyZWF0ZUNsYXNzICcgKyAnZGVmaW5pdGlvbnMuIFVzZSBhIHN0YXRpYyBwcm9wZXJ0eSBuYW1lZCBgZGVmYXVsdFByb3BzYCBpbnN0ZWFkLicpIDogdm9pZCAwO1xuICB9XG59XG5cbi8qKlxuICogR2l2ZW4gYSBmcmFnbWVudCwgdmFsaWRhdGUgdGhhdCBpdCBjYW4gb25seSBiZSBwcm92aWRlZCB3aXRoIGZyYWdtZW50IHByb3BzXG4gKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gZnJhZ21lbnRcbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVGcmFnbWVudFByb3BzKGZyYWdtZW50KSB7XG4gIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGZyYWdtZW50KTtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGZyYWdtZW50LnByb3BzKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgaWYgKGtleSAhPT0gJ2NoaWxkcmVuJyAmJiBrZXkgIT09ICdrZXknKSB7XG4gICAgICB3YXJuaW5nJDEoZmFsc2UsICdJbnZhbGlkIHByb3AgYCVzYCBzdXBwbGllZCB0byBgUmVhY3QuRnJhZ21lbnRgLiAnICsgJ1JlYWN0LkZyYWdtZW50IGNhbiBvbmx5IGhhdmUgYGtleWAgYW5kIGBjaGlsZHJlbmAgcHJvcHMuJywga2V5KTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChmcmFnbWVudC5yZWYgIT09IG51bGwpIHtcbiAgICB3YXJuaW5nJDEoZmFsc2UsICdJbnZhbGlkIGF0dHJpYnV0ZSBgcmVmYCBzdXBwbGllZCB0byBgUmVhY3QuRnJhZ21lbnRgLicpO1xuICB9XG5cbiAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQobnVsbCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRXaXRoVmFsaWRhdGlvbih0eXBlLCBwcm9wcywgY2hpbGRyZW4pIHtcbiAgdmFyIHZhbGlkVHlwZSA9IGlzVmFsaWRFbGVtZW50VHlwZSh0eXBlKTtcblxuICAvLyBXZSB3YXJuIGluIHRoaXMgY2FzZSBidXQgZG9uJ3QgdGhyb3cuIFdlIGV4cGVjdCB0aGUgZWxlbWVudCBjcmVhdGlvbiB0b1xuICAvLyBzdWNjZWVkIGFuZCB0aGVyZSB3aWxsIGxpa2VseSBiZSBlcnJvcnMgaW4gcmVuZGVyLlxuICBpZiAoIXZhbGlkVHlwZSkge1xuICAgIHZhciBpbmZvID0gJyc7XG4gICAgaWYgKHR5cGUgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgJiYgdHlwZSAhPT0gbnVsbCAmJiBPYmplY3Qua2V5cyh0eXBlKS5sZW5ndGggPT09IDApIHtcbiAgICAgIGluZm8gKz0gJyBZb3UgbGlrZWx5IGZvcmdvdCB0byBleHBvcnQgeW91ciBjb21wb25lbnQgZnJvbSB0aGUgZmlsZSAnICsgXCJpdCdzIGRlZmluZWQgaW4sIG9yIHlvdSBtaWdodCBoYXZlIG1peGVkIHVwIGRlZmF1bHQgYW5kIG5hbWVkIGltcG9ydHMuXCI7XG4gICAgfVxuXG4gICAgdmFyIHNvdXJjZUluZm8gPSBnZXRTb3VyY2VJbmZvRXJyb3JBZGRlbmR1bShwcm9wcyk7XG4gICAgaWYgKHNvdXJjZUluZm8pIHtcbiAgICAgIGluZm8gKz0gc291cmNlSW5mbztcbiAgICB9IGVsc2Uge1xuICAgICAgaW5mbyArPSBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKTtcbiAgICB9XG5cbiAgICB2YXIgdHlwZVN0cmluZyA9IHZvaWQgMDtcbiAgICBpZiAodHlwZSA9PT0gbnVsbCkge1xuICAgICAgdHlwZVN0cmluZyA9ICdudWxsJztcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodHlwZSkpIHtcbiAgICAgIHR5cGVTdHJpbmcgPSAnYXJyYXknO1xuICAgIH0gZWxzZSBpZiAodHlwZSAhPT0gdW5kZWZpbmVkICYmIHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRSkge1xuICAgICAgdHlwZVN0cmluZyA9ICc8JyArIChnZXRDb21wb25lbnROYW1lKHR5cGUudHlwZSkgfHwgJ1Vua25vd24nKSArICcgLz4nO1xuICAgICAgaW5mbyA9ICcgRGlkIHlvdSBhY2NpZGVudGFsbHkgZXhwb3J0IGEgSlNYIGxpdGVyYWwgaW5zdGVhZCBvZiBhIGNvbXBvbmVudD8nO1xuICAgIH0gZWxzZSB7XG4gICAgICB0eXBlU3RyaW5nID0gdHlwZW9mIHR5cGU7XG4gICAgfVxuXG4gICAgd2FybmluZyQxKGZhbHNlLCAnUmVhY3QuY3JlYXRlRWxlbWVudDogdHlwZSBpcyBpbnZhbGlkIC0tIGV4cGVjdGVkIGEgc3RyaW5nIChmb3IgJyArICdidWlsdC1pbiBjb21wb25lbnRzKSBvciBhIGNsYXNzL2Z1bmN0aW9uIChmb3IgY29tcG9zaXRlICcgKyAnY29tcG9uZW50cykgYnV0IGdvdDogJXMuJXMnLCB0eXBlU3RyaW5nLCBpbmZvKTtcbiAgfVxuXG4gIHZhciBlbGVtZW50ID0gY3JlYXRlRWxlbWVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gIC8vIFRoZSByZXN1bHQgY2FuIGJlIG51bGxpc2ggaWYgYSBtb2NrIG9yIGEgY3VzdG9tIGZ1bmN0aW9uIGlzIHVzZWQuXG4gIC8vIFRPRE86IERyb3AgdGhpcyB3aGVuIHRoZXNlIGFyZSBubyBsb25nZXIgYWxsb3dlZCBhcyB0aGUgdHlwZSBhcmd1bWVudC5cbiAgaWYgKGVsZW1lbnQgPT0gbnVsbCkge1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgLy8gU2tpcCBrZXkgd2FybmluZyBpZiB0aGUgdHlwZSBpc24ndCB2YWxpZCBzaW5jZSBvdXIga2V5IHZhbGlkYXRpb24gbG9naWNcbiAgLy8gZG9lc24ndCBleHBlY3QgYSBub24tc3RyaW5nL2Z1bmN0aW9uIHR5cGUgYW5kIGNhbiB0aHJvdyBjb25mdXNpbmcgZXJyb3JzLlxuICAvLyBXZSBkb24ndCB3YW50IGV4Y2VwdGlvbiBiZWhhdmlvciB0byBkaWZmZXIgYmV0d2VlbiBkZXYgYW5kIHByb2QuXG4gIC8vIChSZW5kZXJpbmcgd2lsbCB0aHJvdyB3aXRoIGEgaGVscGZ1bCBtZXNzYWdlIGFuZCBhcyBzb29uIGFzIHRoZSB0eXBlIGlzXG4gIC8vIGZpeGVkLCB0aGUga2V5IHdhcm5pbmdzIHdpbGwgYXBwZWFyLilcbiAgaWYgKHZhbGlkVHlwZSkge1xuICAgIGZvciAodmFyIGkgPSAyOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YWxpZGF0ZUNoaWxkS2V5cyhhcmd1bWVudHNbaV0sIHR5cGUpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFKSB7XG4gICAgdmFsaWRhdGVGcmFnbWVudFByb3BzKGVsZW1lbnQpO1xuICB9IGVsc2Uge1xuICAgIHZhbGlkYXRlUHJvcFR5cGVzKGVsZW1lbnQpO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZhY3RvcnlXaXRoVmFsaWRhdGlvbih0eXBlKSB7XG4gIHZhciB2YWxpZGF0ZWRGYWN0b3J5ID0gY3JlYXRlRWxlbWVudFdpdGhWYWxpZGF0aW9uLmJpbmQobnVsbCwgdHlwZSk7XG4gIHZhbGlkYXRlZEZhY3RvcnkudHlwZSA9IHR5cGU7XG4gIC8vIExlZ2FjeSBob29rOiByZW1vdmUgaXRcbiAge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2YWxpZGF0ZWRGYWN0b3J5LCAndHlwZScsIHtcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxvd1ByaW9yaXR5V2FybmluZyQxKGZhbHNlLCAnRmFjdG9yeS50eXBlIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB0aGUgY2xhc3MgZGlyZWN0bHkgJyArICdiZWZvcmUgcGFzc2luZyBpdCB0byBjcmVhdGVGYWN0b3J5LicpO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3R5cGUnLCB7XG4gICAgICAgICAgdmFsdWU6IHR5cGVcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0eXBlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHZhbGlkYXRlZEZhY3Rvcnk7XG59XG5cbmZ1bmN0aW9uIGNsb25lRWxlbWVudFdpdGhWYWxpZGF0aW9uKGVsZW1lbnQsIHByb3BzLCBjaGlsZHJlbikge1xuICB2YXIgbmV3RWxlbWVudCA9IGNsb25lRWxlbWVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICBmb3IgKHZhciBpID0gMjsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhbGlkYXRlQ2hpbGRLZXlzKGFyZ3VtZW50c1tpXSwgbmV3RWxlbWVudC50eXBlKTtcbiAgfVxuICB2YWxpZGF0ZVByb3BUeXBlcyhuZXdFbGVtZW50KTtcbiAgcmV0dXJuIG5ld0VsZW1lbnQ7XG59XG5cbi8vIEhlbHBzIGlkZW50aWZ5IHNpZGUgZWZmZWN0cyBpbiBiZWdpbi1waGFzZSBsaWZlY3ljbGUgaG9va3MgYW5kIHNldFN0YXRlIHJlZHVjZXJzOlxuXG5cbi8vIEluIHNvbWUgY2FzZXMsIFN0cmljdE1vZGUgc2hvdWxkIGFsc28gZG91YmxlLXJlbmRlciBsaWZlY3ljbGVzLlxuLy8gVGhpcyBjYW4gYmUgY29uZnVzaW5nIGZvciB0ZXN0cyB0aG91Z2gsXG4vLyBBbmQgaXQgY2FuIGJlIGJhZCBmb3IgcGVyZm9ybWFuY2UgaW4gcHJvZHVjdGlvbi5cbi8vIFRoaXMgZmVhdHVyZSBmbGFnIGNhbiBiZSB1c2VkIHRvIGNvbnRyb2wgdGhlIGJlaGF2aW9yOlxuXG5cbi8vIFRvIHByZXNlcnZlIHRoZSBcIlBhdXNlIG9uIGNhdWdodCBleGNlcHRpb25zXCIgYmVoYXZpb3Igb2YgdGhlIGRlYnVnZ2VyLCB3ZVxuLy8gcmVwbGF5IHRoZSBiZWdpbiBwaGFzZSBvZiBhIGZhaWxlZCBjb21wb25lbnQgaW5zaWRlIGludm9rZUd1YXJkZWRDYWxsYmFjay5cblxuXG4vLyBXYXJuIGFib3V0IGRlcHJlY2F0ZWQsIGFzeW5jLXVuc2FmZSBsaWZlY3ljbGVzOyByZWxhdGVzIHRvIFJGQyAjNjpcblxuXG4vLyBHYXRoZXIgYWR2YW5jZWQgdGltaW5nIG1ldHJpY3MgZm9yIFByb2ZpbGVyIHN1YnRyZWVzLlxuXG5cbi8vIFRyYWNlIHdoaWNoIGludGVyYWN0aW9ucyB0cmlnZ2VyIGVhY2ggY29tbWl0LlxuXG5cbi8vIE9ubHkgdXNlZCBpbiB3d3cgYnVpbGRzLlxuIC8vIFRPRE86IHRydWU/IEhlcmUgaXQgbWlnaHQganVzdCBiZSBmYWxzZS5cblxuLy8gT25seSB1c2VkIGluIHd3dyBidWlsZHMuXG5cblxuLy8gT25seSB1c2VkIGluIHd3dyBidWlsZHMuXG5cblxuLy8gUmVhY3QgRmlyZTogcHJldmVudCB0aGUgdmFsdWUgYW5kIGNoZWNrZWQgYXR0cmlidXRlcyBmcm9tIHN5bmNpbmdcbi8vIHdpdGggdGhlaXIgcmVsYXRlZCBET00gcHJvcGVydGllc1xuXG5cbi8vIFRoZXNlIEFQSXMgd2lsbCBubyBsb25nZXIgYmUgXCJ1bnN0YWJsZVwiIGluIHRoZSB1cGNvbWluZyAxNi43IHJlbGVhc2UsXG4vLyBDb250cm9sIHRoaXMgYmVoYXZpb3Igd2l0aCBhIGZsYWcgdG8gc3VwcG9ydCAxNi42IG1pbm9yIHJlbGVhc2VzIGluIHRoZSBtZWFud2hpbGUuXG52YXIgZW5hYmxlU3RhYmxlQ29uY3VycmVudE1vZGVBUElzID0gZmFsc2U7XG5cbnZhciBSZWFjdCA9IHtcbiAgQ2hpbGRyZW46IHtcbiAgICBtYXA6IG1hcENoaWxkcmVuLFxuICAgIGZvckVhY2g6IGZvckVhY2hDaGlsZHJlbixcbiAgICBjb3VudDogY291bnRDaGlsZHJlbixcbiAgICB0b0FycmF5OiB0b0FycmF5LFxuICAgIG9ubHk6IG9ubHlDaGlsZFxuICB9LFxuXG4gIGNyZWF0ZVJlZjogY3JlYXRlUmVmLFxuICBDb21wb25lbnQ6IENvbXBvbmVudCxcbiAgUHVyZUNvbXBvbmVudDogUHVyZUNvbXBvbmVudCxcblxuICBjcmVhdGVDb250ZXh0OiBjcmVhdGVDb250ZXh0LFxuICBmb3J3YXJkUmVmOiBmb3J3YXJkUmVmLFxuICBsYXp5OiBsYXp5LFxuICBtZW1vOiBtZW1vLFxuXG4gIHVzZUNhbGxiYWNrOiB1c2VDYWxsYmFjayxcbiAgdXNlQ29udGV4dDogdXNlQ29udGV4dCxcbiAgdXNlRWZmZWN0OiB1c2VFZmZlY3QsXG4gIHVzZUltcGVyYXRpdmVIYW5kbGU6IHVzZUltcGVyYXRpdmVIYW5kbGUsXG4gIHVzZURlYnVnVmFsdWU6IHVzZURlYnVnVmFsdWUsXG4gIHVzZUxheW91dEVmZmVjdDogdXNlTGF5b3V0RWZmZWN0LFxuICB1c2VNZW1vOiB1c2VNZW1vLFxuICB1c2VSZWR1Y2VyOiB1c2VSZWR1Y2VyLFxuICB1c2VSZWY6IHVzZVJlZixcbiAgdXNlU3RhdGU6IHVzZVN0YXRlLFxuXG4gIEZyYWdtZW50OiBSRUFDVF9GUkFHTUVOVF9UWVBFLFxuICBTdHJpY3RNb2RlOiBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFLFxuICBTdXNwZW5zZTogUkVBQ1RfU1VTUEVOU0VfVFlQRSxcblxuICBjcmVhdGVFbGVtZW50OiBjcmVhdGVFbGVtZW50V2l0aFZhbGlkYXRpb24sXG4gIGNsb25lRWxlbWVudDogY2xvbmVFbGVtZW50V2l0aFZhbGlkYXRpb24sXG4gIGNyZWF0ZUZhY3Rvcnk6IGNyZWF0ZUZhY3RvcnlXaXRoVmFsaWRhdGlvbixcbiAgaXNWYWxpZEVsZW1lbnQ6IGlzVmFsaWRFbGVtZW50LFxuXG4gIHZlcnNpb246IFJlYWN0VmVyc2lvbixcblxuICB1bnN0YWJsZV9Db25jdXJyZW50TW9kZTogUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEUsXG4gIHVuc3RhYmxlX1Byb2ZpbGVyOiBSRUFDVF9QUk9GSUxFUl9UWVBFLFxuXG4gIF9fU0VDUkVUX0lOVEVSTkFMU19ET19OT1RfVVNFX09SX1lPVV9XSUxMX0JFX0ZJUkVEOiBSZWFjdFNoYXJlZEludGVybmFsc1xufTtcblxuLy8gTm90ZTogc29tZSBBUElzIGFyZSBhZGRlZCB3aXRoIGZlYXR1cmUgZmxhZ3MuXG4vLyBNYWtlIHN1cmUgdGhhdCBzdGFibGUgYnVpbGRzIGZvciBvcGVuIHNvdXJjZVxuLy8gZG9uJ3QgbW9kaWZ5IHRoZSBSZWFjdCBvYmplY3QgdG8gYXZvaWQgZGVvcHRzLlxuLy8gQWxzbyBsZXQncyBub3QgZXhwb3NlIHRoZWlyIG5hbWVzIGluIHN0YWJsZSBidWlsZHMuXG5cbmlmIChlbmFibGVTdGFibGVDb25jdXJyZW50TW9kZUFQSXMpIHtcbiAgUmVhY3QuQ29uY3VycmVudE1vZGUgPSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRTtcbiAgUmVhY3QuUHJvZmlsZXIgPSBSRUFDVF9QUk9GSUxFUl9UWVBFO1xuICBSZWFjdC51bnN0YWJsZV9Db25jdXJyZW50TW9kZSA9IHVuZGVmaW5lZDtcbiAgUmVhY3QudW5zdGFibGVfUHJvZmlsZXIgPSB1bmRlZmluZWQ7XG59XG5cblxuXG52YXIgUmVhY3QkMiA9IE9iamVjdC5mcmVlemUoe1xuXHRkZWZhdWx0OiBSZWFjdFxufSk7XG5cbnZhciBSZWFjdCQzID0gKCBSZWFjdCQyICYmIFJlYWN0ICkgfHwgUmVhY3QkMjtcblxuLy8gVE9ETzogZGVjaWRlIG9uIHRoZSB0b3AtbGV2ZWwgZXhwb3J0IGZvcm0uXG4vLyBUaGlzIGlzIGhhY2t5IGJ1dCBtYWtlcyBpdCB3b3JrIHdpdGggYm90aCBSb2xsdXAgYW5kIEplc3QuXG52YXIgcmVhY3QgPSBSZWFjdCQzLmRlZmF1bHQgfHwgUmVhY3QkMztcblxubW9kdWxlLmV4cG9ydHMgPSByZWFjdDtcbiAgfSkoKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC5wcm9kdWN0aW9uLm1pbi5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC5kZXZlbG9wbWVudC5qcycpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==