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
/******/ 	return __webpack_require__(__webpack_require__.s = "./modules/imaging_browser/jsx/imagingBrowserIndex.js");
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

/***/ "./modules/imaging_browser/jsx/imagingBrowserIndex.js":
/*!************************************************************!*\
  !*** ./modules/imaging_browser/jsx/imagingBrowserIndex.js ***!
  \************************************************************/
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






var ImagingBrowserIndex =
/*#__PURE__*/
function (_Component) {
  _inherits(ImagingBrowserIndex, _Component);

  function ImagingBrowserIndex(props) {
    var _this;

    _classCallCheck(this, ImagingBrowserIndex);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ImagingBrowserIndex).call(this, props));
    _this.state = {
      data: {},
      error: false,
      isLoaded: false
    };
    _this.fetchData = _this.fetchData.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(ImagingBrowserIndex, [{
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
      // Set class to 'bg-danger' if file is hidden.
      var style = '';
      var result = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
        className: style
      }, cell);

      switch (column) {
        case 'New Data':
          if (cell === 'new') {
            result = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
              className: "newdata"
            }, "NEW");
          }

          break;

        case 'Links':
          var cellTypes = cell.split(',');
          var cellLinks = [];

          for (var i = 0; i < cellTypes.length; i += 1) {
            cellLinks.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
              key: i,
              href: loris.BaseURL + '/imaging_browser/viewSession/?sessionID=' + row.SessionID + '&outputType=' + cellTypes[i] + '&backURL=/imaging_browser/'
            }, cellTypes[i]));
            cellLinks.push(' | ');
          }

          cellLinks.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
            key: "selected",
            href: loris.BaseURL + '/imaging_browser/viewSession/?sessionID=' + row.SessionID + '&selectedOnly=1&backURL=/imaging_browser/'
          }, "selected"));
          cellLinks.push(' | ');
          cellLinks.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
            key: "all",
            href: loris.BaseURL + '/imaging_browser/viewSession/?sessionID=' + row.SessionID + '&backURL=/imaging_browser/'
          }, "all types"));
          result = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, cellLinks);
          break;
      }

      return result;
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
       * Currently, the order of these fields MUST match the order of the
       * queried columns in _setupVariables() in imaging_browser.class.inc
       */


      var options = this.state.data.fieldOptions;
      var configLabels = options.configLabels;
      var fields = [{
        label: 'Site',
        show: true,
        filter: {
          name: 'site',
          type: 'select',
          options: options.sites
        }
      }, {
        label: 'PSCID',
        show: true,
        filter: {
          name: 'PSCID',
          type: 'text'
        }
      }, {
        label: 'DCCID',
        show: true,
        filter: {
          name: 'DCCID',
          type: 'text'
        }
      }, {
        label: 'Project',
        show: true,
        filter: {
          name: 'project',
          type: 'select',
          options: options.projects
        }
      }, {
        label: 'Vist Label',
        show: true,
        filter: {
          name: 'visitLabel',
          type: 'text'
        }
      }, {
        label: 'Visit QC Status',
        show: true,
        filter: {
          name: 'visitQCStatus',
          type: 'select',
          options: options.visitQCStatus
        }
      }, {
        label: 'First Acquisition',
        show: true
      }, {
        label: 'First Insertion',
        show: true
      }, {
        label: 'Last QC',
        show: true
      }, {
        label: 'New Data',
        show: true
      }, {
        label: 'Links',
        show: true
      }, {
        label: 'SessionID',
        show: false
      }, {
        label: 'Sequence Type',
        show: false,
        filter: {
          name: 'sequenceType',
          type: 'multiselect',
          options: options.sequenceTypes
        }
      }, {
        label: 'Pending New',
        show: false,
        filter: {
          name: 'pendingNew',
          type: 'multiselect',
          options: options.pendingNew
        }
      }];
      /**
       * Adding columns based on the Imaging Browser Tabulated Scan Types
       * configured and stored in database
       */

      Object.values(configLabels).forEach(function (label) {
        fields.push({
          label: label + ' QC Status',
          show: true
        });
      });
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FilterableDataTable__WEBPACK_IMPORTED_MODULE_3__["default"], {
        name: "imaging_browser",
        data: this.state.data.Data,
        fields: fields,
        getFormattedCell: this.formatColumn
      });
    }
  }]);

  return ImagingBrowserIndex;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

ImagingBrowserIndex.propTypes = {
  dataURL: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired
};
window.addEventListener('load', function () {
  ReactDOM.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ImagingBrowserIndex, {
    dataURL: "".concat(loris.BaseURL, "/imaging_browser/?format=json")
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vanN4L0RhdGFUYWJsZS5qcyIsIndlYnBhY2s6Ly8vLi9qc3gvRmlsdGVyLmpzIiwid2VicGFjazovLy8uL2pzeC9GaWx0ZXJhYmxlRGF0YVRhYmxlLmpzIiwid2VicGFjazovLy8uL2pzeC9Gb3JtLmpzIiwid2VicGFjazovLy8uL2pzeC9Mb2FkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanN4L1BhZ2luYXRpb25MaW5rcy5qcyIsIndlYnBhY2s6Ly8vLi9qc3gvUGFuZWwuanMiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9pbWFnaW5nX2Jyb3dzZXIvanN4L2ltYWdpbmdCcm93c2VySW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZianMvbGliL2VtcHR5RnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZianMvbGliL2ludmFyaWFudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZmJqcy9saWIvd2FybmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9jaGVja1Byb3BUeXBlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9mYWN0b3J5V2l0aFR5cGVDaGVja2Vycy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JlYWN0LWFkZG9ucy1jcmVhdGUtZnJhZ21lbnQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JlYWN0L2Nqcy9yZWFjdC5kZXZlbG9wbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVhY3QvaW5kZXguanMiXSwibmFtZXMiOlsiRGF0YVRhYmxlIiwicHJvcHMiLCJzdGF0ZSIsIlBhZ2VOdW1iZXIiLCJTb3J0Q29sdW1uIiwiU29ydE9yZGVyIiwiUm93c1BlclBhZ2UiLCJIaWRlIiwiY2hhbmdlUGFnZSIsImJpbmQiLCJzZXRTb3J0Q29sdW1uIiwiY2hhbmdlUm93c1BlclBhZ2UiLCJkb3dubG9hZENTViIsImNvdW50RmlsdGVyZWRSb3dzIiwiZ2V0U29ydGVkUm93cyIsImhhc0ZpbHRlcktleXdvcmQiLCJyZW5kZXJBY3Rpb25zIiwialF1ZXJ5IiwiZm4iLCJEeW5hbWljVGFibGUiLCJmcmVlemVDb2x1bW4iLCIkIiwiZGVmYXVsdENvbHVtbiIsImZpbmQiLCJoaWRlIiwibW9kdWxlUHJlZnMiLCJKU09OIiwicGFyc2UiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwibG9yaXMiLCJUZXN0TmFtZSIsInVuZGVmaW5lZCIsInJvd3NQZXJQYWdlIiwic2V0U3RhdGUiLCJwcmV2UHJvcHMiLCJwcmV2U3RhdGUiLCJvblNvcnQiLCJpbmRleCIsImhlYWRlckxpc3QiLCJmaWVsZHMiLCJtYXAiLCJmaWVsZCIsImxhYmVsIiwiZGF0YSIsInBhZ2VObyIsImNvbE51bWJlciIsImUiLCJ2YWwiLCJ0YXJnZXQiLCJ2YWx1ZSIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJjc3ZEYXRhIiwiY3N2d29ya2VyIiwiV29ya2VyIiwiQmFzZVVSTCIsImFkZEV2ZW50TGlzdGVuZXIiLCJkYXRhVVJMIiwiZGF0YURhdGUiLCJsaW5rIiwiY21kIiwiRGF0ZSIsInRvSVNPU3RyaW5nIiwid2luZG93IiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwibWVzc2FnZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImRvd25sb2FkIiwidHlwZSIsImhyZWYiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjbGljayIsInJlbW92ZUNoaWxkIiwicG9zdE1lc3NhZ2UiLCJoZWFkZXJzIiwiaWRlbnRpZmllcnMiLCJSb3dOYW1lTWFwIiwidXNlS2V5d29yZCIsImZpbHRlck1hdGNoQ291bnQiLCJmaWx0ZXJWYWx1ZXNDb3VudCIsImZpbHRlciIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJ0YWJsZURhdGEiLCJmaWVsZERhdGEiLCJrZXl3b3JkIiwiaSIsImhlYWRlckNvdW50Iiwia2V5d29yZE1hdGNoIiwiaiIsIm5hbWUiLCJoYXNGaWx0ZXJzIiwiaXNTdHJpbmciLCJTdHJpbmciLCJpc051bWJlciIsImlzTmFOIiwiTnVtYmVyIiwidG9Mb3dlckNhc2UiLCJwdXNoIiwiUm93SWR4IiwiVmFsdWUiLCJDb250ZW50Iiwic29ydCIsImEiLCJiIiwiZmlsdGVyRGF0YSIsImV4YWN0TWF0Y2giLCJyZXN1bHQiLCJzZWFyY2hLZXkiLCJzZWFyY2hTdHJpbmciLCJpbnREYXRhIiwicGFyc2VJbnQiLCJzZWFyY2hBcnJheSIsImluY2x1ZGVzIiwiaW5kZXhPZiIsIm1hdGNoIiwiYWN0aW9ucyIsImFjdGlvbiIsImtleSIsIlJvd051bUxhYmVsIiwic2hvdyIsImNvbEluZGV4Iiwicm93cyIsImN1clJvdyIsIm1hdGNoZXNGb3VuZCIsImZpbHRlcmVkUm93cyIsImN1cnJlbnRQYWdlUm93IiwiZmlsdGVyZWREYXRhIiwiZmlsdGVyTGVuZ3RoIiwiZ2V0Rm9ybWF0dGVkQ2VsbCIsInJvdyIsImZvckVhY2giLCJrIiwiY3JlYXRlRnJhZ21lbnQiLCJyb3dJbmRleCIsIlJvd3NQZXJQYWdlRHJvcGRvd24iLCJoZWFkZXIiLCJtYXJnaW5Ub3AiLCJmb290ZXIiLCJtYXJnaW4iLCJDb21wb25lbnQiLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJhcnJheSIsImlzUmVxdWlyZWQiLCJzdHJpbmciLCJmdW5jIiwib2JqZWN0IiwiZGVmYXVsdFByb3BzIiwiRmlsdGVyIiwib25GaWVsZFVwZGF0ZSIsInJlbmRlckZpbHRlckZpZWxkcyIsImlkIiwidXBkYXRlRmlsdGVyIiwicmVkdWNlIiwiZWxlbWVudCIsIm9wdGlvbnMiLCJSZWFjdCIsImNsb25lRWxlbWVudCIsIm9uVXNlcklucHV0IiwiY29sdW1ucyIsInRpdGxlIiwiY2xlYXJGaWx0ZXIiLCJjb25zb2xlIiwid2FybiIsIkZpbHRlcmFibGVEYXRhVGFibGUiLCJudW1iZXIiLCJGb3JtRWxlbWVudCIsImdldEZvcm1FbGVtZW50cyIsImhhbmRsZVN1Ym1pdCIsImZvcm1FbGVtZW50c0hUTUwiLCJtYXhDb2x1bW5TaXplIiwiY29sU2l6ZSIsIk1hdGgiLCJmbG9vciIsImNvbENsYXNzIiwiZm9ybUVsZW1lbnRzIiwib2JqS2V5IiwidXNlcklucHV0IiwiQ2hpbGRyZW4iLCJjaGlsZHJlbiIsImNoaWxkIiwiZWxlbWVudENsYXNzIiwiaXNWYWxpZEVsZW1lbnQiLCJvblN1Ym1pdCIsInByZXZlbnREZWZhdWx0IiwiZW5jVHlwZSIsImZpbGVVcGxvYWQiLCJyb3dTdHlsZXMiLCJkaXNwbGF5IiwiZmxleFdyYXAiLCJjbGFzcyIsIm1ldGhvZCIsIm9uZU9mIiwic2hhcGUiLCJlbGVtZW50TmFtZSIsIkZpZWxkc2V0RWxlbWVudCIsImxlZ2VuZCIsIlNlYXJjaGFibGVEcm9wZG93biIsImdldEtleUZyb21WYWx1ZSIsImhhbmRsZUNoYW5nZSIsImhhbmRsZUJsdXIiLCJnZXRUZXh0SW5wdXRWYWx1ZSIsIm8iLCJzdHJpY3RTZWFyY2giLCJ2YWx1ZXMiLCJxdWVyeVNlbGVjdG9yIiwicmVxdWlyZWQiLCJkaXNhYmxlZCIsInNvcnRCeVZhbHVlIiwic3RyaWN0TWVzc2FnZSIsImVycm9yTWVzc2FnZSIsInJlcXVpcmVkSFRNTCIsIm1zZyIsIm5ld09wdGlvbnMiLCJvcHRpb25MaXN0IiwiaGFzT3duUHJvcGVydHkiLCJvcHRpb24iLCJwbGFjZUhvbGRlciIsImJvb2wiLCJvbmVPZlR5cGUiLCJTZWxlY3RFbGVtZW50IiwibnVtT2ZPcHRpb25zIiwibXVsdGlwbGUiLCJsIiwic2VsZWN0ZWQiLCJlbXB0eU9wdGlvbkhUTUwiLCJlbXB0eU9wdGlvbiIsImhhc0Vycm9yIiwiVGFnc0VsZW1lbnQiLCJoYW5kbGVLZXlQcmVzcyIsImhhbmRsZUFkZCIsImhhbmRsZVJlbW92ZSIsImNhbkFkZEl0ZW0iLCJwZW5kaW5nVmFsS2V5Iiwia2V5Q29kZSIsIndoaWNoIiwidXNlU2VhcmNoIiwib25Vc2VyQWRkIiwiZ2V0QXR0cmlidXRlIiwib25Vc2VyUmVtb3ZlIiwiYWxsb3dEdXBsIiwiaXRlbXMiLCJpbnB1dCIsIml0ZW0iLCJpdG1UeHQiLCJidG5MYWJlbCIsIlRleHRhcmVhRWxlbWVudCIsImNvbHMiLCJUZXh0Ym94RWxlbWVudCIsIm9uVXNlckJsdXIiLCJEYXRlRWxlbWVudCIsIm1pblllYXIiLCJtYXhZZWFyIiwiVGltZUVsZW1lbnQiLCJOdW1lcmljRWxlbWVudCIsIm1pbiIsIm1heCIsIkZpbGVFbGVtZW50IiwiZmlsZSIsImZpbGVzIiwiZmlsZU5hbWUiLCJ0cnVuY2F0ZUVsbGlwc2lzIiwidGFibGVMYXlvdXQiLCJ3aWR0aCIsIndoaXRlU3BhY2UiLCJ0cnVuY2F0ZUVsbGlwc2lzQ2hpbGQiLCJvdmVyZmxvdyIsInRleHRPdmVyZmxvdyIsImZpbGVIVE1MIiwicGFkZGluZ1RvcCIsIlN0YXRpY0VsZW1lbnQiLCJ0ZXh0IiwiTGlua0VsZW1lbnQiLCJDaGVja2JveEVsZW1lbnQiLCJjaGVja2VkIiwiQnV0dG9uRWxlbWVudCIsImhhbmRsZUNsaWNrIiwiY29sdW1uU2l6ZSIsImJ1dHRvbkNsYXNzIiwiQ1RBIiwiTG9yaXNFbGVtZW50IiwiZWxlbWVudFByb3BzIiwicmVmIiwiZWxlbWVudEh0bWwiLCJMb2FkZXIiLCJzaXplIiwiaGVpZ2h0IiwiUGFnaW5hdGlvbkxpbmtzIiwiZXZ0Iiwib25DaGFuZ2VQYWdlIiwicGFnZUxpbmtzIiwiY2xhc3NMaXN0IiwibGFzdFBhZ2UiLCJjZWlsIiwiVG90YWwiLCJzdGFydFBhZ2UiLCJBY3RpdmUiLCJsYXN0U2hvd25QYWdlIiwidG9TdHJpbmciLCJSUGFnaW5hdGlvbkxpbmtzIiwiY3JlYXRlRmFjdG9yeSIsIlBhbmVsIiwiY29sbGFwc2VkIiwiaW5pdENvbGxhcHNlZCIsInBhbmVsQ2xhc3MiLCJ0b2dnbGVDb2xsYXBzZWQiLCJnbHlwaENsYXNzIiwicGFuZWxIZWFkaW5nIiwiY3Vyc29yIiwiSW1hZ2luZ0Jyb3dzZXJJbmRleCIsImVycm9yIiwiaXNMb2FkZWQiLCJmZXRjaERhdGEiLCJ0aGVuIiwiZmV0Y2giLCJjcmVkZW50aWFscyIsInJlc3AiLCJqc29uIiwiY2F0Y2giLCJjb2x1bW4iLCJjZWxsIiwic3R5bGUiLCJjZWxsVHlwZXMiLCJzcGxpdCIsImNlbGxMaW5rcyIsIlNlc3Npb25JRCIsImZpZWxkT3B0aW9ucyIsImNvbmZpZ0xhYmVscyIsInNpdGVzIiwicHJvamVjdHMiLCJ2aXNpdFFDU3RhdHVzIiwic2VxdWVuY2VUeXBlcyIsInBlbmRpbmdOZXciLCJEYXRhIiwiZm9ybWF0Q29sdW1uIiwiUmVhY3RET00iLCJyZW5kZXIiLCJnZXRFbGVtZW50QnlJZCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEsSUFBcUM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxVQUFVLEtBQXFDO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHNCQUFzQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNLEtBQXFDLHdGQUF3RixTQUFNO0FBQ3pJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQiwyQkFBMkI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTSxLQUFxQyw0RkFBNEYsU0FBTTtBQUM3STtBQUNBOztBQUVBLG1CQUFtQixnQ0FBZ0M7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLGdDQUFnQztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0ZBQXNGLGFBQWE7QUFDbkc7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixXQUFXLEVBQUU7QUFDYixXQUFXLGNBQWM7QUFDekIsV0FBVyxFQUFFO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYjtBQUNBLFdBQVcsRUFBRTtBQUNiLFdBQVcsRUFBRTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7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QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGFBQWE7QUFDeEIsV0FBVyxFQUFFO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsRUFBRTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixpQkFBaUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsYUFBYTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsYUFBYTtBQUN4QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsaUJBQWlCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixzQkFBc0I7QUFDekM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsc0JBQXNCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIOzs7Ozs7Ozs7Ozs7O0FDMTFEYTs7QUFFYixJQUFJLEtBQXFDLEVBQUUsRUFFMUM7QUFDRCxtQkFBbUIsbUJBQU8sQ0FBQyxpRkFBNEI7QUFDdkQiLCJmaWxlIjoiLi9tb2R1bGVzL2ltYWdpbmdfYnJvd3Nlci9qcy9pbWFnaW5nQnJvd3NlckluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9tb2R1bGVzL2ltYWdpbmdfYnJvd3Nlci9qc3gvaW1hZ2luZ0Jyb3dzZXJJbmRleC5qc1wiKTtcbiIsIi8qKlxuICogVGhpcyBmaWxlIGNvbnRhaW5zIFJlYWN0IGNvbXBvbmVudCBmb3IgRGF0YSBUYWJsZVxuICpcbiAqIEBhdXRob3IgTG9yaXMgVGVhbVxuICogQHZlcnNpb24gMS4wLjBcbiAqXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFBhZ2luYXRpb25MaW5rcyBmcm9tICcuL1BhZ2luYXRpb25MaW5rcyc7XG5pbXBvcnQgY3JlYXRlRnJhZ21lbnQgZnJvbSAncmVhY3QtYWRkb25zLWNyZWF0ZS1mcmFnbWVudCc7XG5pbXBvcnQgQ1RBIGZyb20gJy4vRm9ybSc7XG5cbi8qKlxuICogRGF0YSBUYWJsZSBjb21wb25lbnRcbiAqIERpc3BsYXlzIGEgc2V0IG9mIGRhdGEgdGhhdCBpcyByZWNlaXZlcyB2aWEgcHJvcHMuXG4gKi9cbmNsYXNzIERhdGFUYWJsZSBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIFBhZ2VOdW1iZXI6IDEsXG4gICAgICBTb3J0Q29sdW1uOiAtMSxcbiAgICAgIFNvcnRPcmRlcjogJ0FTQycsXG4gICAgICBSb3dzUGVyUGFnZTogMjAsXG4gICAgICBIaWRlOiB0aGlzLnByb3BzLkhpZGUsXG4gICAgfTtcblxuICAgIHRoaXMuY2hhbmdlUGFnZSA9IHRoaXMuY2hhbmdlUGFnZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2V0U29ydENvbHVtbiA9IHRoaXMuc2V0U29ydENvbHVtbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2hhbmdlUm93c1BlclBhZ2UgPSB0aGlzLmNoYW5nZVJvd3NQZXJQYWdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5kb3dubG9hZENTViA9IHRoaXMuZG93bmxvYWRDU1YuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNvdW50RmlsdGVyZWRSb3dzID0gdGhpcy5jb3VudEZpbHRlcmVkUm93cy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0U29ydGVkUm93cyA9IHRoaXMuZ2V0U29ydGVkUm93cy5iaW5kKHRoaXMpOy8vXG4gICAgdGhpcy5oYXNGaWx0ZXJLZXl3b3JkID0gdGhpcy5oYXNGaWx0ZXJLZXl3b3JkLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZW5kZXJBY3Rpb25zID0gdGhpcy5yZW5kZXJBY3Rpb25zLmJpbmQodGhpcyk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBpZiAoalF1ZXJ5LmZuLkR5bmFtaWNUYWJsZSkge1xuICAgICAgaWYgKHRoaXMucHJvcHMuZnJlZXplQ29sdW1uKSB7XG4gICAgICAgICQoJyNkeW5hbWljdGFibGUnKS5EeW5hbWljVGFibGUoe1xuICAgICAgICAgIGZyZWV6ZUNvbHVtbjogdGhpcy5wcm9wcy5mcmVlemVDb2x1bW4sXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJCgnI2R5bmFtaWN0YWJsZScpLkR5bmFtaWNUYWJsZSgpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc3RhdGUuSGlkZS5kZWZhdWx0Q29sdW1uKSB7XG4gICAgICAgICQoJyNkeW5hbWljdGFibGUnKS5maW5kKCd0Ym9keSB0ZDplcSgwKScpLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXRyaWV2ZSBtb2R1bGUgcHJlZmVyZW5jZXNcbiAgICBsZXQgbW9kdWxlUHJlZnMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdtb2R1bGVQcmVmcycpKTtcblxuICAgIC8vIEluaXQgbW9kdWxlUHJlZnMgb2JqZWN0XG4gICAgaWYgKG1vZHVsZVByZWZzID09PSBudWxsKSB7XG4gICAgICBtb2R1bGVQcmVmcyA9IHt9O1xuICAgIH1cblxuICAgIC8vIEluaXQgbW9kdWxlUHJlZnMgZm9yIGN1cnJlbnQgbW9kdWxlXG4gICAgaWYgKG1vZHVsZVByZWZzW2xvcmlzLlRlc3ROYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBtb2R1bGVQcmVmc1tsb3Jpcy5UZXN0TmFtZV0gPSB7fTtcbiAgICAgIG1vZHVsZVByZWZzW2xvcmlzLlRlc3ROYW1lXS5yb3dzUGVyUGFnZSA9IHRoaXMuc3RhdGUuUm93c1BlclBhZ2U7XG4gICAgfVxuXG4gICAgLy8gU2V0IHJvd3MgcGVyIHBhZ2VcbiAgICBjb25zdCByb3dzUGVyUGFnZSA9IG1vZHVsZVByZWZzW2xvcmlzLlRlc3ROYW1lXS5yb3dzUGVyUGFnZTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIFJvd3NQZXJQYWdlOiByb3dzUGVyUGFnZSxcbiAgICB9KTtcblxuICAgIC8vIE1ha2UgcHJlZnMgYWNjZXNpYmxlIHdpdGhpbiBjb21wb25lbnRcbiAgICB0aGlzLm1vZHVsZVByZWZzID0gbW9kdWxlUHJlZnM7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcbiAgICBpZiAoalF1ZXJ5LmZuLkR5bmFtaWNUYWJsZSkge1xuICAgICAgaWYgKHRoaXMucHJvcHMuZnJlZXplQ29sdW1uKSB7XG4gICAgICAgICQoJyNkeW5hbWljdGFibGUnKS5EeW5hbWljVGFibGUoe1xuICAgICAgICAgIGZyZWV6ZUNvbHVtbjogdGhpcy5wcm9wcy5mcmVlemVDb2x1bW4sXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJCgnI2R5bmFtaWN0YWJsZScpLkR5bmFtaWNUYWJsZSgpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wcy5vblNvcnQgJiZcbiAgICAgICh0aGlzLnN0YXRlLlNvcnRDb2x1bW4gIT09IHByZXZTdGF0ZS5Tb3J0Q29sdW1uIHx8XG4gICAgICAgIHRoaXMuc3RhdGUuU29ydE9yZGVyICE9PSBwcmV2U3RhdGUuU29ydE9yZGVyKVxuICAgICkge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmdldFNvcnRlZFJvd3MoKTtcbiAgICAgIGNvbnN0IGhlYWRlckxpc3QgPSB0aGlzLnByb3BzLmZpZWxkcy5tYXAoKGZpZWxkKSA9PiBmaWVsZC5sYWJlbCk7XG4gICAgICB0aGlzLnByb3BzLm9uU29ydChpbmRleCwgdGhpcy5wcm9wcy5kYXRhLCBoZWFkZXJMaXN0KTtcbiAgICB9XG4gIH1cblxuICBjaGFuZ2VQYWdlKHBhZ2VObykge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgUGFnZU51bWJlcjogcGFnZU5vLFxuICAgIH0pO1xuICB9XG5cbiAgc2V0U29ydENvbHVtbihjb2xOdW1iZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuU29ydENvbHVtbiA9PT0gY29sTnVtYmVyKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIFNvcnRPcmRlcjogdGhpcy5zdGF0ZS5Tb3J0T3JkZXIgPT09ICdBU0MnID8gJ0RFU0MnIDogJ0FTQycsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgU29ydENvbHVtbjogY29sTnVtYmVyLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgY2hhbmdlUm93c1BlclBhZ2UodmFsKSB7XG4gICAgY29uc3Qgcm93c1BlclBhZ2UgPSB2YWwudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnN0IG1vZHVsZVByZWZzID0gdGhpcy5tb2R1bGVQcmVmcztcblxuICAgIC8vIFNhdmUgY3VycmVudCBzZWxlY3Rpb25cbiAgICBtb2R1bGVQcmVmc1tsb3Jpcy5UZXN0TmFtZV0ucm93c1BlclBhZ2UgPSByb3dzUGVyUGFnZTtcblxuICAgIC8vIFVwZGF0ZSBsb2NhbHN0b3JhZ2VcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbW9kdWxlUHJlZnMnLCBKU09OLnN0cmluZ2lmeShtb2R1bGVQcmVmcykpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBSb3dzUGVyUGFnZTogcm93c1BlclBhZ2UsXG4gICAgICBQYWdlTnVtYmVyOiAxLFxuICAgIH0pO1xuICB9XG5cbiAgZG93bmxvYWRDU1YoY3N2RGF0YSkge1xuICAgIGNvbnN0IGNzdndvcmtlciA9IG5ldyBXb3JrZXIobG9yaXMuQmFzZVVSTCArICcvanMvd29ya2Vycy9zYXZlY3N2LmpzJyk7XG5cbiAgICBjc3Z3b3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGxldCBkYXRhVVJMO1xuICAgICAgbGV0IGRhdGFEYXRlO1xuICAgICAgbGV0IGxpbms7XG4gICAgICBpZiAoZS5kYXRhLmNtZCA9PT0gJ1NhdmVDU1YnKSB7XG4gICAgICAgIGRhdGFEYXRlID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICAgICAgICBkYXRhVVJMID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoZS5kYXRhLm1lc3NhZ2UpO1xuICAgICAgICBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICBsaW5rLmRvd25sb2FkID0gJ2RhdGEtJyArIGRhdGFEYXRlICsgJy5jc3YnO1xuICAgICAgICBsaW5rLnR5cGUgPSAndGV4dC9jc3YnO1xuICAgICAgICBsaW5rLmhyZWYgPSBkYXRhVVJMO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICAkKGxpbmspWzBdLmNsaWNrKCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgaGVhZGVyTGlzdCA9IHRoaXMucHJvcHMuZmllbGRzLm1hcCgoZmllbGQpID0+IGZpZWxkLmxhYmVsKTtcbiAgICBjc3Z3b3JrZXIucG9zdE1lc3NhZ2Uoe1xuICAgICAgY21kOiAnU2F2ZUZpbGUnLFxuICAgICAgZGF0YTogY3N2RGF0YSxcbiAgICAgIGhlYWRlcnM6IGhlYWRlckxpc3QsXG4gICAgICBpZGVudGlmaWVyczogdGhpcy5wcm9wcy5Sb3dOYW1lTWFwLFxuICAgIH0pO1xuICB9XG5cbiAgY291bnRGaWx0ZXJlZFJvd3MoKSB7XG4gICAgbGV0IHVzZUtleXdvcmQgPSBmYWxzZTtcbiAgICBsZXQgZmlsdGVyTWF0Y2hDb3VudCA9IDA7XG4gICAgbGV0IGZpbHRlclZhbHVlc0NvdW50ID0gKHRoaXMucHJvcHMuZmlsdGVyID9cbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5wcm9wcy5maWx0ZXIpLmxlbmd0aCA6XG4gICAgICAgIDBcbiAgICApO1xuICAgIGNvbnN0IHRhYmxlRGF0YSA9IHRoaXMucHJvcHMuZGF0YTtcbiAgICBjb25zdCBmaWVsZERhdGEgPSB0aGlzLnByb3BzLmZpZWxkcztcblxuICAgIGlmICh0aGlzLnByb3BzLmZpbHRlci5rZXl3b3JkKSB7XG4gICAgICB1c2VLZXl3b3JkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodXNlS2V5d29yZCkge1xuICAgICAgZmlsdGVyVmFsdWVzQ291bnQgLT0gMTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhYmxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGhlYWRlckNvdW50ID0gMDtcbiAgICAgIGxldCBrZXl3b3JkTWF0Y2ggPSAwO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBmaWVsZERhdGEubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRhYmxlRGF0YVtpXSA/IHRhYmxlRGF0YVtpXVtqXSA6IG51bGw7XG4gICAgICAgIGlmICh0aGlzLmhhc0ZpbHRlcktleXdvcmQoKGZpZWxkRGF0YVtqXS5maWx0ZXIgfHwge30pLm5hbWUsIGRhdGEpKSB7XG4gICAgICAgICAgaGVhZGVyQ291bnQrKztcbiAgICAgICAgfVxuICAgICAgICBpZiAodXNlS2V5d29yZCkge1xuICAgICAgICAgIGlmICh0aGlzLmhhc0ZpbHRlcktleXdvcmQoJ2tleXdvcmQnLCBkYXRhKSkge1xuICAgICAgICAgICAga2V5d29yZE1hdGNoKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChoZWFkZXJDb3VudCA9PT0gZmlsdGVyVmFsdWVzQ291bnQgJiZcbiAgICAgICAgKCh1c2VLZXl3b3JkID09PSB0cnVlICYmIGtleXdvcmRNYXRjaCA+IDApIHx8XG4gICAgICAgICAgKHVzZUtleXdvcmQgPT09IGZhbHNlICYmIGtleXdvcmRNYXRjaCA9PT0gMCkpKSB7XG4gICAgICAgIGZpbHRlck1hdGNoQ291bnQrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBoYXNGaWx0ZXJzID0gKGZpbHRlclZhbHVlc0NvdW50ICE9PSAwKTtcbiAgICBpZiAoZmlsdGVyTWF0Y2hDb3VudCA9PT0gMCAmJiBoYXNGaWx0ZXJzKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gKGZpbHRlck1hdGNoQ291bnQgPT09IDApID8gdGFibGVEYXRhLmxlbmd0aCA6IGZpbHRlck1hdGNoQ291bnQ7XG4gIH1cblxuICBnZXRTb3J0ZWRSb3dzKCkge1xuICAgIGNvbnN0IGluZGV4ID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJvcHMuZGF0YS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgbGV0IHZhbCA9IHRoaXMucHJvcHMuZGF0YVtpXVt0aGlzLnN0YXRlLlNvcnRDb2x1bW5dIHx8IHVuZGVmaW5lZDtcbiAgICAgIC8vIElmIFNvcnRDb2x1bW4gaXMgZXF1YWwgdG8gZGVmYXVsdCBOby4gY29sdW1uLCBzZXQgdmFsdWUgdG8gYmVcbiAgICAgIC8vIGluZGV4ICsgMVxuICAgICAgaWYgKHRoaXMuc3RhdGUuU29ydENvbHVtbiA9PT0gLTEpIHtcbiAgICAgICAgdmFsID0gaSArIDE7XG4gICAgICB9XG4gICAgICBjb25zdCBpc1N0cmluZyA9ICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJyB8fCB2YWwgaW5zdGFuY2VvZiBTdHJpbmcpO1xuICAgICAgY29uc3QgaXNOdW1iZXIgPSAhaXNOYU4odmFsKSAmJiB0eXBlb2YgdmFsICE9PSAnb2JqZWN0JztcblxuICAgICAgaWYgKHZhbCA9PT0gJy4nKSB7XG4gICAgICAgIC8vIGhhY2sgdG8gaGFuZGxlIG5vbi1leGlzdGVudCBpdGVtcyBpbiBEUVRcbiAgICAgICAgdmFsID0gbnVsbDtcbiAgICAgIH0gZWxzZSBpZiAoaXNOdW1iZXIpIHtcbiAgICAgICAgLy8gcGVyZm9ybSB0eXBlIGNvbnZlcnNpb24gKGZyb20gc3RyaW5nIHRvIGludC9mbG9hdClcbiAgICAgICAgdmFsID0gTnVtYmVyKHZhbCk7XG4gICAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKSB7XG4gICAgICAgIC8vIGlmIHN0cmluZyB3aXRoIHRleHQgY29udmVydCB0byBsb3dlcmNhc2VcbiAgICAgICAgdmFsID0gdmFsLnRvTG93ZXJDYXNlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWwgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnByb3BzLlJvd05hbWVNYXApIHtcbiAgICAgICAgaW5kZXgucHVzaCh7Um93SWR4OiBpLCBWYWx1ZTogdmFsLCBDb250ZW50OiB0aGlzLnByb3BzLlJvd05hbWVNYXBbaV19KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZGV4LnB1c2goe1Jvd0lkeDogaSwgVmFsdWU6IHZhbCwgQ29udGVudDogaSArIDF9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpbmRleC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLlNvcnRPcmRlciA9PT0gJ0FTQycpIHtcbiAgICAgICAgaWYgKGEuVmFsdWUgPT09IGIuVmFsdWUpIHtcbiAgICAgICAgICAvLyBJZiBhbGwgdmFsdWVzIGFyZSBlcXVhbCwgc29ydCBieSByb3dudW1cbiAgICAgICAgICBpZiAoYS5Sb3dJZHggPCBiLlJvd0lkeCkgcmV0dXJuIC0xO1xuICAgICAgICAgIGlmIChhLlJvd0lkeCA+IGIuUm93SWR4KSByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayBpZiBudWxsIHZhbHVlc1xuICAgICAgICBpZiAoYS5WYWx1ZSA9PT0gbnVsbCB8fCB0eXBlb2YgYS5WYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiAtMTtcbiAgICAgICAgaWYgKGIuVmFsdWUgPT09IG51bGwgfHwgdHlwZW9mIGIuVmFsdWUgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gMTtcblxuICAgICAgICAvLyBTb3J0IGJ5IHZhbHVlXG4gICAgICAgIGlmIChhLlZhbHVlIDwgYi5WYWx1ZSkgcmV0dXJuIC0xO1xuICAgICAgICBpZiAoYS5WYWx1ZSA+IGIuVmFsdWUpIHJldHVybiAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGEuVmFsdWUgPT09IGIuVmFsdWUpIHtcbiAgICAgICAgICAvLyBJZiBhbGwgdmFsdWVzIGFyZSBlcXVhbCwgc29ydCBieSByb3dudW1cbiAgICAgICAgICBpZiAoYS5Sb3dJZHggPCBiLlJvd0lkeCkgcmV0dXJuIDE7XG4gICAgICAgICAgaWYgKGEuUm93SWR4ID4gYi5Sb3dJZHgpIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayBpZiBudWxsIHZhbHVlc1xuICAgICAgICBpZiAoYS5WYWx1ZSA9PT0gbnVsbCB8fCB0eXBlb2YgYS5WYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiAxO1xuICAgICAgICBpZiAoYi5WYWx1ZSA9PT0gbnVsbCB8fCB0eXBlb2YgYi5WYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiAtMTtcblxuICAgICAgICAvLyBTb3J0IGJ5IHZhbHVlXG4gICAgICAgIGlmIChhLlZhbHVlIDwgYi5WYWx1ZSkgcmV0dXJuIDE7XG4gICAgICAgIGlmIChhLlZhbHVlID4gYi5WYWx1ZSkgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgLy8gVGhleSdyZSBlcXVhbC4uXG4gICAgICByZXR1cm4gMDtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIHJldHVybiBpbmRleDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWFyY2hlcyBmb3IgdGhlIGZpbHRlciBrZXl3b3JkIGluIHRoZSBjb2x1bW4gY2VsbFxuICAgKlxuICAgKiBOb3RlOiBTZWFyY2ggaXMgY2FzZS1pbnNlbnNpdGl2ZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgZmllbGQgbmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGF0YSBzZWFyY2ggc3RyaW5nXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUsIGlmIGZpbHRlciB2YWx1ZSBpcyBmb3VuZCB0byBiZSBhIHN1YnN0cmluZ1xuICAgKiBvZiBvbmUgb2YgdGhlIGNvbHVtbiB2YWx1ZXMsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGhhc0ZpbHRlcktleXdvcmQobmFtZSwgZGF0YSkge1xuICAgIGxldCBmaWx0ZXJEYXRhID0gbnVsbDtcbiAgICBsZXQgZXhhY3RNYXRjaCA9IGZhbHNlO1xuICAgIGxldCByZXN1bHQgPSBmYWxzZTtcbiAgICBsZXQgc2VhcmNoS2V5ID0gbnVsbDtcbiAgICBsZXQgc2VhcmNoU3RyaW5nID0gbnVsbDtcblxuICAgIGlmICh0aGlzLnByb3BzLmZpbHRlcltuYW1lXSkge1xuICAgICAgZmlsdGVyRGF0YSA9IHRoaXMucHJvcHMuZmlsdGVyW25hbWVdLnZhbHVlO1xuICAgICAgZXhhY3RNYXRjaCA9IHRoaXMucHJvcHMuZmlsdGVyW25hbWVdLmV4YWN0TWF0Y2g7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIG51bGwgaW5wdXRzXG4gICAgaWYgKGZpbHRlckRhdGEgPT09IG51bGwgfHwgZGF0YSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBudW1lcmljIGlucHV0c1xuICAgIGlmICh0eXBlb2YgZmlsdGVyRGF0YSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGNvbnN0IGludERhdGEgPSBOdW1iZXIucGFyc2VJbnQoZGF0YSwgMTApO1xuICAgICAgcmVzdWx0ID0gKGZpbHRlckRhdGEgPT09IGludERhdGEpO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBzdHJpbmcgaW5wdXRzXG4gICAgaWYgKHR5cGVvZiBmaWx0ZXJEYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgc2VhcmNoS2V5ID0gZmlsdGVyRGF0YS50b0xvd2VyQ2FzZSgpO1xuICAgICAgc3dpdGNoICh0eXBlb2YgZGF0YSkge1xuICAgICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICAgIC8vIEhhbmRsZXMgdGhlIGNhc2Ugd2hlcmUgdGhlIGRhdGEgaXMgYW4gYXJyYXkgKHR5cGVvZiAnb2JqZWN0JylcbiAgICAgICAgICAvLyBhbmQgeW91IHdhbnQgdG8gc2VhcmNoIHRocm91Z2ggaXQgZm9yXG4gICAgICAgICAgLy8gdGhlIHN0cmluZyB5b3UgYXJlIGZpbHRlcmluZyBieVxuICAgICAgICAgIGNvbnN0IHNlYXJjaEFycmF5ID0gZGF0YS5tYXAoKGUpID0+IGUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgaWYgKGV4YWN0TWF0Y2gpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHNlYXJjaEFycmF5LmluY2x1ZGVzKHNlYXJjaEtleSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IChzZWFyY2hBcnJheS5maW5kKChlKSA9PiAoZS5pbmRleE9mKHNlYXJjaEtleSkgPiAtMSkpKSAhPT0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBzZWFyY2hTdHJpbmcgPSBkYXRhLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgaWYgKGV4YWN0TWF0Y2gpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IChzZWFyY2hTdHJpbmcgPT09IHNlYXJjaEtleSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IChzZWFyY2hTdHJpbmcuaW5kZXhPZihzZWFyY2hLZXkpID4gLTEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgYXJyYXkgaW5wdXRzIGZvciBtdWx0aXNlbGVjdHNcbiAgICBpZiAodHlwZW9mIGZpbHRlckRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICBsZXQgbWF0Y2ggPSBmYWxzZTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsdGVyRGF0YS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBzZWFyY2hLZXkgPSBmaWx0ZXJEYXRhW2ldLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHNlYXJjaFN0cmluZyA9IGRhdGEudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICBtYXRjaCA9IChzZWFyY2hTdHJpbmcuaW5kZXhPZihzZWFyY2hLZXkpID4gLTEpO1xuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHJlbmRlckFjdGlvbnMoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuYWN0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuYWN0aW9ucy5tYXAoKGFjdGlvbiwga2V5KSA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPENUQVxuICAgICAgICAgICAga2V5PXtrZXl9XG4gICAgICAgICAgICBsYWJlbD17YWN0aW9uLmxhYmVsfVxuICAgICAgICAgICAgb25Vc2VySW5wdXQ9e2FjdGlvbi5hY3Rpb259XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5kYXRhID09PSBudWxsIHx8IHRoaXMucHJvcHMuZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdhbGVydCBhbGVydC1pbmZvIG5vLXJlc3VsdC1mb3VuZC1wYW5lbCc+XG4gICAgICAgICAgPHN0cm9uZz5ObyByZXN1bHQgZm91bmQuPC9zdHJvbmc+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gICAgY29uc3Qgcm93c1BlclBhZ2UgPSB0aGlzLnN0YXRlLlJvd3NQZXJQYWdlO1xuICAgIGNvbnN0IGhlYWRlcnMgPSB0aGlzLnN0YXRlLkhpZGUuZGVmYXVsdENvbHVtbiA9PT0gdHJ1ZSA/IFtdIDogW1xuICAgICAgPHRoIGtleT0ndGhfY29sXzAnIG9uQ2xpY2s9e3RoaXMuc2V0U29ydENvbHVtbigtMSkuYmluZCh0aGlzKX0+XG4gICAgICAgIHt0aGlzLnByb3BzLlJvd051bUxhYmVsfVxuICAgICAgPC90aD4sXG4gICAgXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcm9wcy5maWVsZHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLmZpZWxkc1tpXS5zaG93ID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IGNvbEluZGV4ID0gaSArIDE7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmZpZWxkc1tpXS5mcmVlemVDb2x1bW4gPT09IHRydWUpIHtcbiAgICAgICAgICBoZWFkZXJzLnB1c2goXG4gICAgICAgICAgICAgIDx0aCBrZXk9eyd0aF9jb2xfJyArIGNvbEluZGV4fSBpZD17dGhpcy5wcm9wcy5mcmVlemVDb2x1bW59XG4gICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5zZXRTb3J0Q29sdW1uKGkpLmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmZpZWxkc1tpXS5sYWJlbH1cbiAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGhlYWRlcnMucHVzaChcbiAgICAgICAgICAgICAgPHRoIGtleT17J3RoX2NvbF8nICsgY29sSW5kZXh9IG9uQ2xpY2s9e3RoaXMuc2V0U29ydENvbHVtbihpKS5iaW5kKHRoaXMpfT5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5maWVsZHNbaV0ubGFiZWx9XG4gICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByb3dzID0gW107XG4gICAgbGV0IGN1clJvdyA9IFtdO1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5nZXRTb3J0ZWRSb3dzKCk7XG4gICAgbGV0IG1hdGNoZXNGb3VuZCA9IDA7IC8vIEtlZXBzIHRyYWNrIG9mIGhvdyBtYW55IHJvd3Mgd2hlcmUgZGlzcGxheWVkIHNvIGZhciBhY3Jvc3MgYWxsIHBhZ2VzXG4gICAgY29uc3QgZmlsdGVyZWRSb3dzID0gdGhpcy5jb3VudEZpbHRlcmVkUm93cygpO1xuICAgIGNvbnN0IGN1cnJlbnRQYWdlUm93ID0gKHJvd3NQZXJQYWdlICogKHRoaXMuc3RhdGUuUGFnZU51bWJlciAtIDEpKTtcbiAgICBjb25zdCBmaWx0ZXJlZERhdGEgPSBbXTtcbiAgICBsZXQgdXNlS2V5d29yZCA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuZmlsdGVyLmtleXdvcmQpIHtcbiAgICAgIHVzZUtleXdvcmQgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIFB1c2ggcm93cyB0byBkYXRhIHRhYmxlXG4gICAgZm9yIChsZXQgaSA9IDA7XG4gICAgICAoaSA8IHRoaXMucHJvcHMuZGF0YS5sZW5ndGgpICYmIChyb3dzLmxlbmd0aCA8IHJvd3NQZXJQYWdlKTtcbiAgICAgIGkrK1xuICAgICkge1xuICAgICAgY3VyUm93ID0gW107XG5cbiAgICAgIC8vIENvdW50cyBmaWx0ZXIgbWF0Y2hlc1xuICAgICAgbGV0IGZpbHRlck1hdGNoQ291bnQgPSAwO1xuICAgICAgbGV0IGtleXdvcmRNYXRjaCA9IDA7XG4gICAgICBsZXQgZmlsdGVyTGVuZ3RoID0gMDtcblxuICAgICAgLy8gSXRlcmF0ZXMgdGhyb3VnaCBoZWFkZXJzIHRvIHBvcHVsYXRlIHJvdyBjb2x1bW5zXG4gICAgICAvLyB3aXRoIGNvcnJlc3BvbmRpbmcgZGF0YVxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLnByb3BzLmZpZWxkcy5sZW5ndGg7IGogKz0gMSkge1xuICAgICAgICBsZXQgZGF0YSA9ICdVbmtub3duJztcblxuICAgICAgICAvLyBTZXQgY29sdW1uIGRhdGFcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuZGF0YVtpbmRleFtpXS5Sb3dJZHhdKSB7XG4gICAgICAgICAgZGF0YSA9IHRoaXMucHJvcHMuZGF0YVtpbmRleFtpXS5Sb3dJZHhdW2pdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucHJvcHMuZmllbGRzW2pdLmZpbHRlcikge1xuICAgICAgICAgIGlmICh0aGlzLmhhc0ZpbHRlcktleXdvcmQodGhpcy5wcm9wcy5maWVsZHNbal0uZmlsdGVyLm5hbWUsIGRhdGEpKSB7XG4gICAgICAgICAgICBmaWx0ZXJNYXRjaENvdW50Kys7XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEucHVzaCh0aGlzLnByb3BzLmRhdGFbaW5kZXhbaV0uUm93SWR4XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVzZUtleXdvcmQgPT09IHRydWUpIHtcbiAgICAgICAgICBmaWx0ZXJMZW5ndGggPSBPYmplY3Qua2V5cyh0aGlzLnByb3BzLmZpbHRlcikubGVuZ3RoIC0gMTtcbiAgICAgICAgICBpZiAodGhpcy5oYXNGaWx0ZXJLZXl3b3JkKCdrZXl3b3JkJywgZGF0YSkpIHtcbiAgICAgICAgICAgIGtleXdvcmRNYXRjaCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWx0ZXJMZW5ndGggPSBPYmplY3Qua2V5cyh0aGlzLnByb3BzLmZpbHRlcikubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qga2V5ID0gJ3RkX2NvbF8nICsgajtcblxuICAgICAgICAvLyBHZXQgY3VzdG9tIGNlbGwgZm9ybWF0dGluZyBpZiBhdmFpbGFibGVcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuZ2V0Rm9ybWF0dGVkQ2VsbCkge1xuICAgICAgICAgIGlmICh0aGlzLnByb3BzLmZpZWxkc1tqXS5zaG93ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgZGF0YSA9IG51bGw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBtYXBwaW5nIGJldHdlZW4gcm93SGVhZGVycyBhbmQgcm93RGF0YSBpbiBhIHJvdyBPYmplY3RcbiAgICAgICAgICAgIGNvbnN0IHJvdyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5maWVsZHMuZm9yRWFjaCgoZmllbGQsIGspID0+IHtcbiAgICAgICAgICAgICAgcm93W2ZpZWxkLmxhYmVsXSA9IHRoaXMucHJvcHMuZGF0YVtpbmRleFtpXS5Sb3dJZHhdW2tdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkYXRhID0gdGhpcy5wcm9wcy5nZXRGb3JtYXR0ZWRDZWxsKFxuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuZmllbGRzW2pdLmxhYmVsLFxuICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgICAgcm93XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZGF0YSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gTm90ZTogQ2FuJ3QgY3VycmVudGx5IHBhc3MgYSBrZXksIG5lZWQgdG8gdXBkYXRlIGNvbHVtbkZvcm1hdHRlclxuICAgICAgICAgICAgLy8gdG8gbm90IHJldHVybiBhIDx0ZD4gbm9kZS4gVXNpbmcgY3JlYXRlRnJhZ21lbnQgaW5zdGVhZC5cbiAgICAgICAgICAgIGN1clJvdy5wdXNoKGNyZWF0ZUZyYWdtZW50KHtkYXRhfSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdXJSb3cucHVzaCg8dGQga2V5PXtrZXl9PntkYXRhfTwvdGQ+KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBPbmx5IGRpc3BsYXkgYSByb3cgaWYgYWxsIGZpbHRlciB2YWx1ZXMgaGF2ZSBiZWVuIG1hdGNoZWRcbiAgICAgIGlmICgoZmlsdGVyTGVuZ3RoID09PSBmaWx0ZXJNYXRjaENvdW50KSAmJlxuICAgICAgICAoKHVzZUtleXdvcmQgPT09IHRydWUgJiYga2V5d29yZE1hdGNoID4gMCkgfHxcbiAgICAgICAgICAodXNlS2V5d29yZCA9PT0gZmFsc2UgJiYga2V5d29yZE1hdGNoID09PSAwKSkpIHtcbiAgICAgICAgbWF0Y2hlc0ZvdW5kKys7XG4gICAgICAgIGlmIChtYXRjaGVzRm91bmQgPiBjdXJyZW50UGFnZVJvdykge1xuICAgICAgICAgIGNvbnN0IHJvd0luZGV4ID0gaW5kZXhbaV0uQ29udGVudDtcbiAgICAgICAgICByb3dzLnB1c2goXG4gICAgICAgICAgICAgIDx0ciBrZXk9eyd0cl8nICsgcm93SW5kZXh9IGNvbFNwYW49e2hlYWRlcnMubGVuZ3RofT5cbiAgICAgICAgICAgICAgICA8dGQ+e3Jvd0luZGV4fTwvdGQ+XG4gICAgICAgICAgICAgICAge2N1clJvd31cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgUm93c1BlclBhZ2VEcm9wZG93biA9IChcbiAgICAgIDxzZWxlY3RcbiAgICAgICAgY2xhc3NOYW1lPVwiaW5wdXQtc20gcGVyUGFnZVwiXG4gICAgICAgIG9uQ2hhbmdlPXt0aGlzLmNoYW5nZVJvd3NQZXJQYWdlfVxuICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5Sb3dzUGVyUGFnZX1cbiAgICAgID5cbiAgICAgICAgPG9wdGlvbj4yMDwvb3B0aW9uPlxuICAgICAgICA8b3B0aW9uPjUwPC9vcHRpb24+XG4gICAgICAgIDxvcHRpb24+MTAwPC9vcHRpb24+XG4gICAgICAgIDxvcHRpb24+MTAwMDwvb3B0aW9uPlxuICAgICAgICA8b3B0aW9uPjUwMDA8L29wdGlvbj5cbiAgICAgICAgPG9wdGlvbj4xMDAwMDwvb3B0aW9uPlxuICAgICAgPC9zZWxlY3Q+XG4gICAgKTtcblxuICAgIC8vIEluY2x1ZGUgb25seSBmaWx0ZXJlZCBkYXRhIGlmIGZpbHRlcnMgd2VyZSBhcHBsaWVkXG4gICAgbGV0IGNzdkRhdGEgPSB0aGlzLnByb3BzLmRhdGE7XG4gICAgaWYgKHRoaXMucHJvcHMuZmlsdGVyICYmIGZpbHRlcmVkRGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICBjc3ZEYXRhID0gZmlsdGVyZWREYXRhO1xuICAgIH1cblxuICAgIGNvbnN0IGhlYWRlciA9IHRoaXMuc3RhdGUuSGlkZS5yb3dzUGVyUGFnZSA9PT0gdHJ1ZSA/ICcnIDogKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0YWJsZS1oZWFkZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMlwiPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAge3Jvd3MubGVuZ3RofSByb3dzIGRpc3BsYXllZCBvZiB7ZmlsdGVyZWRSb3dzfS5cbiAgICAgICAgICAgICAgKE1heGltdW0gcm93cyBwZXIgcGFnZToge1Jvd3NQZXJQYWdlRHJvcGRvd259KVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIiBzdHlsZT17e21hcmdpblRvcDogJy00M3B4J319PlxuICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJBY3Rpb25zKCl9XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuZG93bmxvYWRDU1YuYmluZChudWxsLCBjc3ZEYXRhKX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBEb3dubG9hZCBUYWJsZSBhcyBDU1ZcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDxQYWdpbmF0aW9uTGlua3NcbiAgICAgICAgICAgICAgICBUb3RhbD17ZmlsdGVyZWRSb3dzfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlUGFnZT17dGhpcy5jaGFuZ2VQYWdlfVxuICAgICAgICAgICAgICAgIFJvd3NQZXJQYWdlPXtyb3dzUGVyUGFnZX1cbiAgICAgICAgICAgICAgICBBY3RpdmU9e3RoaXMuc3RhdGUuUGFnZU51bWJlcn1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG5cbiAgICBjb25zdCBmb290ZXIgPSB0aGlzLnN0YXRlLkhpZGUuZG93bmxvYWRDU1YgPT09IHRydWUgPyAnJyA6IChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTJcIiBzdHlsZT17e21hcmdpblRvcDogJzEwcHgnfX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvb3RlclRleHRcIj5cbiAgICAgICAgICAgICAge3Jvd3MubGVuZ3RofSByb3dzIGRpc3BsYXllZCBvZiB7ZmlsdGVyZWRSb3dzfS5cbiAgICAgICAgICAgICAgKE1heGltdW0gcm93cyBwZXIgcGFnZToge1Jvd3NQZXJQYWdlRHJvcGRvd259KVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIiBzdHlsZT17e21hcmdpblRvcDogJy0yM3B4J319PlxuICAgICAgICAgICAgICA8UGFnaW5hdGlvbkxpbmtzXG4gICAgICAgICAgICAgICAgVG90YWw9e2ZpbHRlcmVkUm93c31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZVBhZ2U9e3RoaXMuY2hhbmdlUGFnZX1cbiAgICAgICAgICAgICAgICBSb3dzUGVyUGFnZT17cm93c1BlclBhZ2V9XG4gICAgICAgICAgICAgICAgQWN0aXZlPXt0aGlzLnN0YXRlLlBhZ2VOdW1iZXJ9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW46ICcxNHB4J319PlxuICAgICAgICB7aGVhZGVyfVxuICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidGFibGUgdGFibGUtaG92ZXIgdGFibGUtcHJpbWFyeSB0YWJsZS1ib3JkZXJlZFwiIGlkPVwiZHluYW1pY3RhYmxlXCI+XG4gICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgPHRyIGNsYXNzTmFtZT1cImluZm9cIj57aGVhZGVyc308L3RyPlxuICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAge3Jvd3N9XG4gICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgPC90YWJsZT5cbiAgICAgICAge2Zvb3Rlcn1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbkRhdGFUYWJsZS5wcm9wVHlwZXMgPSB7XG4gIGRhdGE6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBSb3dOdW1MYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgLy8gRnVuY3Rpb24gb2Ygd2hpY2ggcmV0dXJucyBhIEpTWCBlbGVtZW50IGZvciBhIHRhYmxlIGNlbGwsIHRha2VzXG4gIC8vIHBhcmFtZXRlcnMgb2YgdGhlIGZvcm06IGZ1bmMoQ29sdW1uTmFtZSwgQ2VsbERhdGEsIEVudGlyZVJvd0RhdGEpXG4gIGdldEZvcm1hdHRlZENlbGw6IFByb3BUeXBlcy5mdW5jLFxuICBvblNvcnQ6IFByb3BUeXBlcy5mdW5jLFxuICBIaWRlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBhY3Rpb25zOiBQcm9wVHlwZXMub2JqZWN0LFxufTtcbkRhdGFUYWJsZS5kZWZhdWx0UHJvcHMgPSB7XG4gIFJvd051bUxhYmVsOiAnTm8uJyxcbiAgZmlsdGVyOiB7fSxcbiAgSGlkZToge1xuICAgIHJvd3NQZXJQYWdlOiBmYWxzZSxcbiAgICBkb3dubG9hZENTVjogZmFsc2UsXG4gICAgZGVmYXVsdENvbHVtbjogZmFsc2UsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBEYXRhVGFibGU7XG4iLCJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbi8qKlxuICogRmlsdGVyIGNvbXBvbmVudC5cbiAqIEEgd3JhcHBlciBmb3IgZm9ybSBlbGVtZW50cyBpbnNpZGUgYSBzZWxlY3Rpb24gZmlsdGVyLlxuICpcbiAqIENvbnN0cnVjdHMgZmlsdGVyIGZpZWxkcyBiYXNlZCBvbiB0aGlzLnByb3BzLmZpZWxkcyBjb25maWd1cmF0aW9uIG9iamVjdFxuICpcbiAqIEFsdGVycyB0aGUgZmlsdGVyIG9iamVjdCBhbmQgc2VuZHMgaXQgdG8gcGFyZW50IG9uIGV2ZXJ5IHVwZGF0ZS5cbiAqXG4gKi9cbmNsYXNzIEZpbHRlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMub25GaWVsZFVwZGF0ZSA9IHRoaXMub25GaWVsZFVwZGF0ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVuZGVyRmlsdGVyRmllbGRzID0gdGhpcy5yZW5kZXJGaWx0ZXJGaWVsZHMuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGZpbHRlciBvYmplY3QgdG8gcmVmbGVjdCB2YWx1ZXMgb2YgaW5wdXQgZmllbGRzLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIGZvcm0gZWxlbWVudCB0eXBlIChpLmUgY29tcG9uZW50IG5hbWUpXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHRoZSBuYW1lIG9mIHRoZSBmb3JtIGVsZW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIC0gaWQgb2YgdGhlIGZvcm0gZWxlbWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIHR5cGUgb2YgdGhlIGZvcm0gZWxlbWVudFxuICAgKi9cbiAgb25GaWVsZFVwZGF0ZShuYW1lLCB2YWx1ZSwgaWQsIHR5cGUpIHtcbiAgICBjb25zdCBmaWx0ZXIgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMucHJvcHMuZmlsdGVyKSk7XG4gICAgY29uc3QgZXhhY3RNYXRjaCA9IHR5cGUgPT09ICd0ZXh0Ym94JyA/IGZhbHNlIDogdHJ1ZTtcbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09ICcnKSB7XG4gICAgICBkZWxldGUgZmlsdGVyW25hbWVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaWx0ZXJbbmFtZV0gPSB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgZXhhY3RNYXRjaDogZXhhY3RNYXRjaCxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy5wcm9wcy51cGRhdGVGaWx0ZXIoZmlsdGVyKTtcbiAgfVxuXG4gIHJlbmRlckZpbHRlckZpZWxkcygpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5maWVsZHMucmVkdWNlKChyZXN1bHQsIGZpZWxkKSA9PiB7XG4gICAgICBjb25zdCBmaWx0ZXIgPSBmaWVsZC5maWx0ZXI7XG4gICAgICBpZiAoZmlsdGVyICYmIGZpbHRlci5oaWRlICE9PSB0cnVlKSB7XG4gICAgICAgIGxldCBlbGVtZW50O1xuICAgICAgICBzd2l0Y2ggKGZpbHRlci50eXBlKSB7XG4gICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgIGVsZW1lbnQgPSA8VGV4dGJveEVsZW1lbnQga2V5PXtmaWx0ZXIubmFtZX0vPjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgICAgICBlbGVtZW50ID0gPFNlbGVjdEVsZW1lbnQga2V5PXtmaWx0ZXIubmFtZX0gb3B0aW9ucz17ZmlsdGVyLm9wdGlvbnN9Lz47XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ211bHRpc2VsZWN0JzpcbiAgICAgICAgICBlbGVtZW50ID0gPFNlbGVjdEVsZW1lbnQga2V5PXtmaWx0ZXIubmFtZX0gb3B0aW9ucz17ZmlsdGVyLm9wdGlvbnN9IG11bHRpcGxlPXt0cnVlfS8+O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgICBlbGVtZW50ID0gPERhdGVFbGVtZW50IGtleT17ZmlsdGVyLm5hbWV9Lz47XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgZWxlbWVudCA9IDxUZXh0Ym94RWxlbWVudCBrZXk9e2ZpbHRlci5uYW1lfS8+O1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0LnB1c2goUmVhY3QuY2xvbmVFbGVtZW50KFxuICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogZmlsdGVyLm5hbWUsXG4gICAgICAgICAgICBsYWJlbDogZmllbGQubGFiZWwsXG4gICAgICAgICAgICB2YWx1ZTogKHRoaXMucHJvcHMuZmlsdGVyW2ZpbHRlci5uYW1lXSB8fCB7fSkudmFsdWUsXG4gICAgICAgICAgICBvblVzZXJJbnB1dDogdGhpcy5vbkZpZWxkVXBkYXRlLFxuICAgICAgICAgIH1cbiAgICAgICAgKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSwgW10pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8Rm9ybUVsZW1lbnRcbiAgICAgICAgaWQ9e3RoaXMucHJvcHMuaWR9XG4gICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZX1cbiAgICAgID5cbiAgICAgICAgPEZpZWxkc2V0RWxlbWVudFxuICAgICAgICAgIGNvbHVtbnM9e3RoaXMucHJvcHMuY29sdW1uc31cbiAgICAgICAgICBsZWdlbmQ9e3RoaXMucHJvcHMudGl0bGV9XG4gICAgICAgID5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJGaWx0ZXJGaWVsZHMoKX1cbiAgICAgICAgICA8QnV0dG9uRWxlbWVudFxuICAgICAgICAgICAgbGFiZWw9XCJDbGVhciBGaWx0ZXJzXCJcbiAgICAgICAgICAgIHR5cGU9XCJyZXNldFwiXG4gICAgICAgICAgICBvblVzZXJJbnB1dD17dGhpcy5wcm9wcy5jbGVhckZpbHRlcn1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0ZpZWxkc2V0RWxlbWVudD5cbiAgICAgIDwvRm9ybUVsZW1lbnQ+XG4gICAgKTtcbiAgfVxufVxuXG5GaWx0ZXIuZGVmYXVsdFByb3BzID0ge1xuICBpZDogbnVsbCxcbiAgY2xlYXJGaWx0ZXI6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUud2Fybignb25VcGRhdGUoKSBjYWxsYmFjayBpcyBub3Qgc2V0IScpO1xuICB9LFxuICBjb2x1bW5zOiAxLFxufTtcbkZpbHRlci5wcm9wVHlwZXMgPSB7XG4gIGZpbHRlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBjbGVhckZpbHRlcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNvbHVtbnM6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBmaWVsZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEZpbHRlcjtcbiIsImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IFBhbmVsIGZyb20gJy4vUGFuZWwnO1xuaW1wb3J0IERhdGFUYWJsZSBmcm9tICcuL0RhdGFUYWJsZSc7XG5pbXBvcnQgRmlsdGVyIGZyb20gJy4vRmlsdGVyJztcblxuLyoqXG4gKiBGaWx0ZXJhYmxlRGF0YVRhYmxlIGNvbXBvbmVudC5cbiAqIEEgd3JhcHBlciBmb3IgYWxsIGRhdGF0YWJsZXMgdGhhdCBoYW5kbGVzIGZpbHRlcmluZy5cbiAqXG4gKiBIYW5kbGVzIHRoZSB1cGRhdGluZyBhbmQgY2xlYXJpbmcgb2YgdGhlIGZpbHRlciBzdGF0ZSBiYXNlZCBvbiBjaGFuZ2VzIHNlbnRcbiAqIGZyb20gdGhlIEZpbHRlckZvcm0uXG4gKlxuICogUGFzc2VzIHRoZSBGaWx0ZXIgdG8gdGhlIERhdGF0YWJsZS5cbiAqXG4gKiBEZXByZWNhdGVzIEZpbHRlciBGb3JtLlxuICovXG5jbGFzcyBGaWx0ZXJhYmxlRGF0YVRhYmxlIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGZpbHRlcjoge30sXG4gICAgfTtcbiAgICB0aGlzLnVwZGF0ZUZpbHRlciA9IHRoaXMudXBkYXRlRmlsdGVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbGVhckZpbHRlciA9IHRoaXMuY2xlYXJGaWx0ZXIuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGZpbHRlciBzdGF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gZmlsdGVyIHBhc3NlZCBmcm9tIEZpbHRlckZvcm1cbiAgICovXG4gIHVwZGF0ZUZpbHRlcihmaWx0ZXIpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtmaWx0ZXJ9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIEZpbHRlciB0byBlbXB0eSBvYmplY3RcbiAgICovXG4gIGNsZWFyRmlsdGVyKCkge1xuICAgIHRoaXMudXBkYXRlRmlsdGVyKHt9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFBhbmVsXG4gICAgICAgIHRpdGxlPXt0aGlzLnByb3BzLnRpdGxlfVxuICAgICAgPlxuICAgICAgICA8RmlsdGVyXG4gICAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lICsgJ19maWx0ZXInfVxuICAgICAgICAgIGlkPXt0aGlzLnByb3BzLm5hbWUgKyAnX2ZpbHRlcid9XG4gICAgICAgICAgdGl0bGU9J1NlbGVjdGlvbiBGaWx0ZXInXG4gICAgICAgICAgY29sdW1ucz17dGhpcy5wcm9wcy5jb2x1bW5zfVxuICAgICAgICAgIGZpbHRlcj17dGhpcy5zdGF0ZS5maWx0ZXJ9XG4gICAgICAgICAgZmllbGRzPXt0aGlzLnByb3BzLmZpZWxkc31cbiAgICAgICAgICB1cGRhdGVGaWx0ZXI9e3RoaXMudXBkYXRlRmlsdGVyfVxuICAgICAgICAgIGNsZWFyRmlsdGVyPXt0aGlzLmNsZWFyRmlsdGVyfVxuICAgICAgICAvPlxuICAgICAgICA8RGF0YVRhYmxlXG4gICAgICAgICAgZGF0YT17dGhpcy5wcm9wcy5kYXRhfVxuICAgICAgICAgIGZpZWxkcz17dGhpcy5wcm9wcy5maWVsZHN9XG4gICAgICAgICAgZmlsdGVyPXt0aGlzLnN0YXRlLmZpbHRlcn1cbiAgICAgICAgICBnZXRGb3JtYXR0ZWRDZWxsPXt0aGlzLnByb3BzLmdldEZvcm1hdHRlZENlbGx9XG4gICAgICAgICAgYWN0aW9ucz17dGhpcy5wcm9wcy5hY3Rpb25zfVxuICAgICAgICAvPlxuICAgICAgPC9QYW5lbD5cbiAgICApO1xuICB9XG59XG5cbkZpbHRlcmFibGVEYXRhVGFibGUuZGVmYXVsdFByb3BzID0ge1xuICBjb2x1bW5zOiAzLFxufTtcblxuRmlsdGVyYWJsZURhdGFUYWJsZS5wcm9wVHlwZXMgPSB7XG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgdGl0bGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGRhdGE6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgZmlsdGVyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGZpZWxkczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBjb2x1bW5zOiBQcm9wVHlwZXMubnVtYmVyLFxuICBnZXRGb3JtYXR0ZWRDZWxsOiBQcm9wVHlwZXMuZnVuYyxcbiAgYWN0aW9uczogUHJvcFR5cGVzLm9iamVjdCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEZpbHRlcmFibGVEYXRhVGFibGU7XG4iLCIvKiBleHBvcnRlZCBGb3JtRWxlbWVudCwgRmllbGRzZXRFbGVtZW50LCBTZWxlY3RFbGVtZW50LCBUYWdzRWxlbWVudCwgU2VhcmNoYWJsZURyb3Bkb3duLCBUZXh0YXJlYUVsZW1lbnQsXG5UZXh0Ym94RWxlbWVudCwgRGF0ZUVsZW1lbnQsIE51bWVyaWNFbGVtZW50LCBGaWxlRWxlbWVudCwgU3RhdGljRWxlbWVudCwgTGlua0VsZW1lbnQsXG5DaGVja2JveEVsZW1lbnQsIEJ1dHRvbkVsZW1lbnQsIExvcmlzRWxlbWVudFxuKi9cblxuLyoqXG4gKiBUaGlzIGZpbGUgY29udGFpbnMgUmVhY3QgY29tcG9uZW50cyBmb3IgTG9yaXMgZm9ybSBlbGVtZW50cy5cbiAqXG4gKiBAYXV0aG9yIExvcmlzIFRlYW1cbiAqIEB2ZXJzaW9uIDEuMC4wXG4gKlxuICovXG5cbi8qKlxuICogRm9ybSBDb21wb25lbnQuXG4gKiBSZWFjdCB3cmFwcGVyIGZvciA8Zm9ybT4gZWxlbWVudCB0aGF0IGFjY2VwdHMgY2hpbGRyZW4gcmVhY3QgY29tcG9uZW50c1xuICpcbiAqIFRoZSBmb3JtIGVsZW1lbnRzIGNhbiBiZSBwYXNzZWQgaW4gdHdvIHdheXM6XG4gKiAxLiBBIGB0aGlzLnByb3BzLmZvcm1FbGVtZW50c2AgSlNPTiBvYmplY3RcbiAqIDIuIEZvcm0gY29tcG9uZW50cyBuZXN0ZWQgZGlyZWN0bHkgaW5zaWRlIDxGb3JtRWxlbWVudD48L0Zvcm1FbGVtZW50PlxuICpcbiAqIE5vdGUgdGhhdCBpZiBib3RoIGFyZSBwYXNzZWQgYHRoaXMucHJvcHMuZm9ybUVsZW1lbnRzYCBpcyBkaXNwbGF5ZWQgZmlyc3QuXG4gKlxuICovXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuLyoqXG4gKiBGb3JtRWxlbWVudCBDb21wb25lbnQuXG4gKiBVc2VkIGZvciBjb25zdHJ1Y3RpbmcgZm9ybSBlbGVtZW50LlxuICovXG5jbGFzcyBGb3JtRWxlbWVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuZ2V0Rm9ybUVsZW1lbnRzID0gdGhpcy5nZXRGb3JtRWxlbWVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVN1Ym1pdCA9IHRoaXMuaGFuZGxlU3VibWl0LmJpbmQodGhpcyk7XG4gIH1cblxuICBnZXRGb3JtRWxlbWVudHMoKSB7XG4gICAgY29uc3QgZm9ybUVsZW1lbnRzSFRNTCA9IFtdO1xuICAgIGNvbnN0IGNvbHVtbnMgPSB0aGlzLnByb3BzLmNvbHVtbnM7XG4gICAgY29uc3QgbWF4Q29sdW1uU2l6ZSA9IDEyO1xuICAgIGNvbnN0IGNvbFNpemUgPSBNYXRoLmZsb29yKG1heENvbHVtblNpemUgLyBjb2x1bW5zKTtcbiAgICBjb25zdCBjb2xDbGFzcyA9ICdjb2wteHMtMTIgY29sLXNtLScgKyBjb2xTaXplICsgJyBjb2wtbWQtJyArIGNvbFNpemU7XG5cbiAgICAvLyBSZW5kZXIgZWxlbWVudHMgZnJvbSBKU09OXG4gICAgY29uc3QgZmlsdGVyID0gdGhpcy5wcm9wcy5mb3JtRWxlbWVudHM7XG5cbiAgICBPYmplY3Qua2V5cyhmaWx0ZXIpLmZvckVhY2goZnVuY3Rpb24ob2JqS2V5LCBpbmRleCkge1xuICAgICAgY29uc3QgdXNlcklucHV0ID0gdGhpcy5wcm9wcy5vblVzZXJJbnB1dCA/IHRoaXMucHJvcHMub25Vc2VySW5wdXQgOiBmaWx0ZXJbb2JqS2V5XS5vblVzZXJJbnB1dDtcbiAgICAgIGNvbnN0IHZhbHVlID0gZmlsdGVyW29iaktleV0udmFsdWUgPyBmaWx0ZXJbb2JqS2V5XS52YWx1ZSA6ICcnO1xuICAgICAgZm9ybUVsZW1lbnRzSFRNTC5wdXNoKFxuICAgICAgICAgIDxkaXYga2V5PXsnZWxfJyArIGluZGV4fSBjbGFzc05hbWU9e2NvbENsYXNzfT5cbiAgICAgICAgICAgIDxMb3Jpc0VsZW1lbnRcbiAgICAgICAgICAgICAgZWxlbWVudD17ZmlsdGVyW29iaktleV19XG4gICAgICAgICAgICAgIG9uVXNlcklucHV0PXt1c2VySW5wdXR9XG4gICAgICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAvLyBSZW5kZXIgZWxlbWVudHMgZnJvbSBSZWFjdFxuICAgIFJlYWN0LkNoaWxkcmVuLmZvckVhY2godGhpcy5wcm9wcy5jaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQsIGtleSkge1xuICAgICAgLy8gSWYgY2hpbGQgaXMgcGxhaW4gSFRNTCwgaW5zZXJ0IGl0IGFzIGZ1bGwgc2l6ZS5cbiAgICAgIC8vIFVzZWZ1bCBmb3IgaW5zZXJ0aW5nIDxocj4gdG8gc3BsaXQgZm9ybSBzZWN0aW9uc1xuICAgICAgbGV0IGVsZW1lbnRDbGFzcyA9ICdjb2wteHMtMTIgY29sLXNtLTEyIGNvbC1tZC0xMic7XG5cbiAgICAgIC8vIElmIGNoaWxkIGlzIGZvcm0gZWxlbWVudCB1c2UgYXBwcm9wcmlhdGUgc2l6ZVxuICAgICAgaWYgKFJlYWN0LmlzVmFsaWRFbGVtZW50KGNoaWxkKSAmJiB0eXBlb2YgY2hpbGQudHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBlbGVtZW50Q2xhc3MgPSBjb2xDbGFzcztcbiAgICAgIH1cbiAgICAgIGZvcm1FbGVtZW50c0hUTUwucHVzaChcbiAgICAgICAgICA8ZGl2IGtleT17J2VsX2NoaWxkXycgKyBrZXl9IGNsYXNzTmFtZT17ZWxlbWVudENsYXNzfT57Y2hpbGR9PC9kaXY+XG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZvcm1FbGVtZW50c0hUTUw7XG4gIH1cblxuICBoYW5kbGVTdWJtaXQoZSkge1xuICAgIC8vIE92ZXJyaWRlIGRlZmF1bHQgc3VibWl0IGlmIHByb3BlcnR5IGlzIHNldFxuICAgIGlmICh0aGlzLnByb3BzLm9uU3VibWl0KSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLnByb3BzLm9uU3VibWl0KGUpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBlbmNUeXBlID0gdGhpcy5wcm9wcy5maWxlVXBsb2FkID8gJ211bHRpcGFydC9mb3JtLWRhdGEnIDogbnVsbDtcblxuICAgIC8vIEdlbmVyYXRlIGZvcm0gZWxlbWVudHNcbiAgICBjb25zdCBmb3JtRWxlbWVudHMgPSB0aGlzLmdldEZvcm1FbGVtZW50cygpO1xuXG4gICAgLy8gRmxleGJveCBpcyBzZXQgdG8gZW5zdXJlIHRoYXQgY29sdW1ucyBvZiBkaWZmZXJlbnQgaGVpZ2h0c1xuICAgIC8vIGFyZSBkaXNwbGF5ZWQgcHJvcG9ydGlvbmFsbHkgb24gdGhlIHNjcmVlblxuICAgIGNvbnN0IHJvd1N0eWxlcyA9IHtcbiAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgIGZsZXhXcmFwOiAnd3JhcCcsXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8Zm9ybVxuICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgIGlkPXt0aGlzLnByb3BzLmlkfVxuICAgICAgICBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3N9XG4gICAgICAgIG1ldGhvZD17dGhpcy5wcm9wcy5tZXRob2R9XG4gICAgICAgIGFjdGlvbj17dGhpcy5wcm9wcy5hY3Rpb259XG4gICAgICAgIGVuY1R5cGU9e2VuY1R5cGV9XG4gICAgICAgIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH1cbiAgICAgID5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiBzdHlsZT17cm93U3R5bGVzfT5cbiAgICAgICAgICB7Zm9ybUVsZW1lbnRzfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZm9ybT5cbiAgICApO1xuICB9XG59XG5cbkZvcm1FbGVtZW50LnByb3BUeXBlcyA9IHtcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgbWV0aG9kOiBQcm9wVHlwZXMub25lT2YoWydQT1NUJywgJ0dFVCddKSxcbiAgYWN0aW9uOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjbGFzczogUHJvcFR5cGVzLnN0cmluZyxcbiAgY29sdW1uczogUHJvcFR5cGVzLm51bWJlcixcbiAgZm9ybUVsZW1lbnRzOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgIGVsZW1lbnROYW1lOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIHR5cGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgfSksXG4gIH0pLFxuICBvblN1Ym1pdDogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uVXNlcklucHV0OiBQcm9wVHlwZXMuZnVuYyxcbn07XG5cbkZvcm1FbGVtZW50LmRlZmF1bHRQcm9wcyA9IHtcbiAgbmFtZTogbnVsbCxcbiAgaWQ6IG51bGwsXG4gIG1ldGhvZDogJ1BPU1QnLFxuICBhY3Rpb246IHVuZGVmaW5lZCxcbiAgY2xhc3M6ICdmb3JtLWhvcml6b250YWwnLFxuICBjb2x1bW5zOiAxLFxuICBmaWxlVXBsb2FkOiBmYWxzZSxcbiAgZm9ybUVsZW1lbnRzOiB7fSxcbiAgb25TdWJtaXQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUud2Fybignb25TdWJtaXQoKSBjYWxsYmFjayBpcyBub3Qgc2V0IScpO1xuICB9LFxufTtcblxuLyoqXG4gKiBGaWVsZHNldEVsZW1lbnQgQ29tcG9uZW50LlxuICogUmVhY3Qgd3JhcHBlciBmb3IgPGZpZWxkc2V0PiBlbGVtZW50IHRoYXQgaXMgbmVzdGVkIGluc2lkZSA8Rm9ybUVsZW1lbnQ+PC9Gb3JtRWxlbWVudD4sXG4gKiBhbmQgYWNjZXB0cyBjaGlsZCByZWFjdCBjb21wb25lbnRzLiBBIGZpZWxkc2V0IGdyb3VwcyByZWxhdGVkIGVsZW1lbnRzIGluIGEgZm9ybS5cbiAqXG4gKiBUaGUgZm9ybSBlbGVtZW50cyBjYW4gYmUgcGFzc2VkIGJ5IG5lc3RpbmcgRm9ybSBjb21wb25lbnRzIGRpcmVjdGx5IGluc2lkZSA8RmllbGRzZXRFbGVtZW50PjwvRmllbGRzZXRFbGVtZW50Pi5cbiAqXG4gKi9cbmNsYXNzIEZpZWxkc2V0RWxlbWVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuZ2V0Rm9ybUVsZW1lbnRzID0gdGhpcy5nZXRGb3JtRWxlbWVudHMuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGdldEZvcm1FbGVtZW50cygpIHtcbiAgICBjb25zdCBmb3JtRWxlbWVudHNIVE1MID0gW107XG4gICAgY29uc3QgY29sdW1ucyA9IHRoaXMucHJvcHMuY29sdW1ucztcbiAgICBjb25zdCBtYXhDb2x1bW5TaXplID0gMTI7XG4gICAgY29uc3QgY29sU2l6ZSA9IE1hdGguZmxvb3IobWF4Q29sdW1uU2l6ZSAvIGNvbHVtbnMpO1xuICAgIGNvbnN0IGNvbENsYXNzID0gJ2NvbC14cy0xMiBjb2wtc20tJyArIGNvbFNpemUgKyAnIGNvbC1tZC0nICsgY29sU2l6ZTtcblxuICAgIC8vIFJlbmRlciBlbGVtZW50cyBmcm9tIFJlYWN0XG4gICAgUmVhY3QuQ2hpbGRyZW4uZm9yRWFjaCh0aGlzLnByb3BzLmNoaWxkcmVuLCBmdW5jdGlvbihjaGlsZCwga2V5KSB7XG4gICAgICAvLyBJZiBjaGlsZCBpcyBwbGFpbiBIVE1MLCBpbnNlcnQgaXQgYXMgZnVsbCBzaXplLlxuICAgICAgLy8gVXNlZnVsIGZvciBpbnNlcnRpbmcgPGhyPiB0byBzcGxpdCBmb3JtIHNlY3Rpb25zXG4gICAgICBsZXQgZWxlbWVudENsYXNzID0gJ2NvbC14cy0xMiBjb2wtc20tMTIgY29sLW1kLTEyJztcblxuICAgICAgLy8gSWYgY2hpbGQgaXMgZm9ybSBlbGVtZW50IHVzZSBhcHByb3ByaWF0ZSBzaXplXG4gICAgICBpZiAoUmVhY3QuaXNWYWxpZEVsZW1lbnQoY2hpbGQpICYmIHR5cGVvZiBjaGlsZC50eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGVsZW1lbnRDbGFzcyA9IGNvbENsYXNzO1xuICAgICAgfVxuICAgICAgZm9ybUVsZW1lbnRzSFRNTC5wdXNoKFxuICAgICAgICAgIDxkaXYga2V5PXsnZWxfY2hpbGRfJyArIGtleX0gY2xhc3NOYW1lPXtlbGVtZW50Q2xhc3N9PntjaGlsZH08L2Rpdj5cbiAgICAgICk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGZvcm1FbGVtZW50c0hUTUw7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgLy8gR2VuZXJhdGUgZm9ybSBlbGVtZW50c1xuICAgIGNvbnN0IGZvcm1FbGVtZW50cyA9IHRoaXMuZ2V0Rm9ybUVsZW1lbnRzKCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGZpZWxkc2V0XG4gICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZX1cbiAgICAgID5cbiAgICAgICAgPGxlZ2VuZD5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5sZWdlbmR9XG4gICAgICAgIDwvbGVnZW5kPlxuICAgICAgICB7Zm9ybUVsZW1lbnRzfVxuICAgICAgPC9maWVsZHNldD5cbiAgICApO1xuICB9XG59XG5cbkZpZWxkc2V0RWxlbWVudC5wcm9wVHlwZXMgPSB7XG4gIGNvbHVtbnM6IFByb3BUeXBlcy5udW1iZXIsXG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGxlZ2VuZDogUHJvcFR5cGVzLnN0cmluZyxcbn07XG5cbkZpZWxkc2V0RWxlbWVudC5kZWZhdWx0UHJvcHMgPSB7XG4gIGNvbHVtbnM6IDEsXG4gIGxlZ2VuZDogJ1NlbGVjdGlvbiBGaWx0ZXInLFxufTtcblxuLyoqXG4gKiBTZWFyY2ggQ29tcG9uZW50XG4gKiBSZWFjdCB3cmFwcGVyIGZvciBhIHNlYXJjaGFibGUgZHJvcGRvd25cbiAqL1xuY2xhc3MgU2VhcmNoYWJsZURyb3Bkb3duIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5nZXRLZXlGcm9tVmFsdWUgPSB0aGlzLmdldEtleUZyb21WYWx1ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUJsdXIgPSB0aGlzLmhhbmRsZUJsdXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldFRleHRJbnB1dFZhbHVlID0gdGhpcy5nZXRUZXh0SW5wdXRWYWx1ZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgZ2V0S2V5RnJvbVZhbHVlKHZhbHVlKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMucHJvcHMub3B0aW9ucztcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob3B0aW9ucykuZmluZChmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gb3B0aW9uc1tvXSA9PT0gdmFsdWU7XG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZSkge1xuICAgIGxldCB2YWx1ZSA9IHRoaXMuZ2V0S2V5RnJvbVZhbHVlKGUudGFyZ2V0LnZhbHVlKTtcbiAgICAvLyBpZiBub3QgaW4gc3RyaWN0IG1vZGUgYW5kIGtleSB2YWx1ZSBpcyBub3QgZGVmaW5lZCAoaS5lLiwgbm90IGluIG9wdGlvbnMpXG4gICAgLy8gc2V0IHZhbHVlIGVxdWFsIHRvIGUudGFyZ2V0LnZhbHVlXG4gICAgaWYgKCF0aGlzLnByb3BzLnN0cmljdFNlYXJjaCAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWx1ZSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgIH1cbiAgICB0aGlzLnByb3BzLm9uVXNlcklucHV0KHRoaXMucHJvcHMubmFtZSwgdmFsdWUpO1xuICB9XG5cbiAgaGFuZGxlQmx1cihlKSB7XG4gICAgLy8gbnVsbCBvdXQgZW50cnkgaWYgbm90IHByZXNlbnQgaW4gb3B0aW9ucyBpbiBzdHJpY3QgbW9kZVxuICAgIGlmICh0aGlzLnByb3BzLnN0cmljdFNlYXJjaCkge1xuICAgICAgY29uc3QgdmFsdWUgPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLnByb3BzLm9wdGlvbnM7XG4gICAgICBpZiAoT2JqZWN0LnZhbHVlcyhvcHRpb25zKS5pbmRleE9mKHZhbHVlKSA9PT0gLTEpIHtcbiAgICAgICAgLy8gZW1wdHkgc3RyaW5nIG91dCBib3RoIHRoZSBoaWRkZW4gdmFsdWUgYXMgd2VsbCBhcyB0aGUgaW5wdXQgdGV4dFxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBpbnB1dFtuYW1lPVwiJHt0aGlzLnByb3BzLm5hbWUgKyAnX2lucHV0J31cIl1gKS52YWx1ZSA9ICcnO1xuICAgICAgICB0aGlzLnByb3BzLm9uVXNlcklucHV0KHRoaXMucHJvcHMubmFtZSwgJycpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldFRleHRJbnB1dFZhbHVlKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBpbnB1dFtuYW1lPVwiJHt0aGlzLnByb3BzLm5hbWUgKyAnX2lucHV0J31cIl1gKS52YWx1ZTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCByZXF1aXJlZCA9IHRoaXMucHJvcHMucmVxdWlyZWQgPyAncmVxdWlyZWQnIDogbnVsbDtcbiAgICBjb25zdCBkaXNhYmxlZCA9IHRoaXMucHJvcHMuZGlzYWJsZWQgPyAnZGlzYWJsZWQnIDogbnVsbDtcbiAgICBjb25zdCBzb3J0QnlWYWx1ZSA9IHRoaXMucHJvcHMuc29ydEJ5VmFsdWU7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMucHJvcHMub3B0aW9ucztcbiAgICBjb25zdCBzdHJpY3RNZXNzYWdlID0gJ0VudHJ5IG11c3QgYmUgaW5jbHVkZWQgaW4gcHJvdmlkZWQgbGlzdCBvZiBvcHRpb25zLic7XG4gICAgbGV0IGVycm9yTWVzc2FnZSA9IG51bGw7XG4gICAgbGV0IHJlcXVpcmVkSFRNTCA9IG51bGw7XG4gICAgbGV0IGVsZW1lbnRDbGFzcyA9ICdyb3cgZm9ybS1ncm91cCc7XG5cbiAgICAvLyBBZGQgcmVxdWlyZWQgYXN0ZXJpeFxuICAgIGlmIChyZXF1aXJlZCkge1xuICAgICAgcmVxdWlyZWRIVE1MID0gPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1kYW5nZXJcIj4qPC9zcGFuPjtcbiAgICB9XG5cbiAgICAvLyBBZGQgZXJyb3IgbWVzc2FnZVxuICAgIGlmICh0aGlzLnByb3BzLmVycm9yTWVzc2FnZSkge1xuICAgICAgZXJyb3JNZXNzYWdlID0gPHNwYW4+e3RoaXMucHJvcHMuZXJyb3JNZXNzYWdlfTwvc3Bhbj47XG4gICAgICBlbGVtZW50Q2xhc3MgPSAncm93IGZvcm0tZ3JvdXAgaGFzLWVycm9yJztcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMucmVxdWlyZWQgJiYgdGhpcy5wcm9wcy52YWx1ZSA9PT0gJycpIHtcbiAgICAgIGxldCBtc2cgPSAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZCEnO1xuICAgICAgbXNnICs9ICh0aGlzLnByb3BzLnN0cmljdFNlYXJjaCA/ICcgJyArIHN0cmljdE1lc3NhZ2UgOiAnJyk7XG4gICAgICBlcnJvck1lc3NhZ2UgPSA8c3Bhbj57bXNnfTwvc3Bhbj47XG4gICAgICBlbGVtZW50Q2xhc3MgPSAncm93IGZvcm0tZ3JvdXAgaGFzLWVycm9yJztcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuc3RyaWN0U2VhcmNoICYmIHRoaXMucHJvcHMudmFsdWUgPT09ICcnKSB7XG4gICAgICBlcnJvck1lc3NhZ2UgPSA8c3Bhbj57c3RyaWN0TWVzc2FnZX08L3NwYW4+O1xuICAgICAgZWxlbWVudENsYXNzID0gJ3JvdyBmb3JtLWdyb3VwIGhhcy1lcnJvcic7XG4gICAgfVxuXG4gICAgLy8gZGV0ZXJtaW5lIHZhbHVlIHRvIHBsYWNlIGludG8gdGV4dCBpbnB1dFxuICAgIGxldCB2YWx1ZTtcbiAgICAvLyB1c2UgdmFsdWUgaW4gb3B0aW9ucyBpZiB2YWxpZFxuICAgIGlmICh0aGlzLnByb3BzLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChPYmplY3Qua2V5cyhvcHRpb25zKS5pbmRleE9mKHRoaXMucHJvcHMudmFsdWUpID4gLTEpIHtcbiAgICAgICAgdmFsdWUgPSBvcHRpb25zW3RoaXMucHJvcHMudmFsdWVdO1xuICAgICAgICAvLyBlbHNlLCB1c2UgaW5wdXQgdGV4dCB2YWx1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSB0aGlzLmdldFRleHRJbnB1dFZhbHVlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbmV3T3B0aW9ucyA9IHt9O1xuICAgIGxldCBvcHRpb25MaXN0ID0gW107XG4gICAgaWYgKHNvcnRCeVZhbHVlKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBuZXdPcHRpb25zW29wdGlvbnNba2V5XV0gPSBrZXk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG9wdGlvbkxpc3QgPSBPYmplY3Qua2V5cyhuZXdPcHRpb25zKS5zb3J0KCkubWFwKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9e29wdGlvbn0ga2V5PXtuZXdPcHRpb25zW29wdGlvbl19Lz5cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25MaXN0ID0gT2JqZWN0LmtleXMob3B0aW9ucykubWFwKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9e29wdGlvbnNbb3B0aW9uXX0ga2V5PXtvcHRpb259Lz5cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17ZWxlbWVudENsYXNzfT5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC1zbS0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPXt0aGlzLnByb3BzLmxhYmVsfT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5sYWJlbH1cbiAgICAgICAgICB7cmVxdWlyZWRIVE1MfVxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS05XCI+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWUgKyAnX2lucHV0J31cbiAgICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgICAgIGlkPXt0aGlzLnByb3BzLmlkfVxuICAgICAgICAgICAgbGlzdD17dGhpcy5wcm9wcy5uYW1lICsgJ19saXN0J31cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj17dGhpcy5wcm9wcy5wbGFjZUhvbGRlcn1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgIG9uQmx1cj17dGhpcy5oYW5kbGVCbHVyfVxuICAgICAgICAgICAgcmVxdWlyZWQ9e3JlcXVpcmVkfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGRhdGFsaXN0IGlkPXt0aGlzLnByb3BzLm5hbWUgKyAnX2xpc3QnfT5cbiAgICAgICAgICAgIHtvcHRpb25MaXN0fVxuICAgICAgICAgIDwvZGF0YWxpc3Q+XG4gICAgICAgICAge2Vycm9yTWVzc2FnZX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cblNlYXJjaGFibGVEcm9wZG93bi5wcm9wVHlwZXMgPSB7XG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgb3B0aW9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgLy8gc3RyaWN0U2VhcmNoLCBpZiBzZXQgdG8gdHJ1ZSwgd2lsbCByZXF1aXJlIHRoYXQgb25seSBvcHRpb25zXG4gIC8vIHByb3ZpZGVkIGluIHRoZSBvcHRpb25zIHByb3AgY2FuIGJlIHN1Ym1pdHRlZFxuICBzdHJpY3RTZWFyY2g6IFByb3BUeXBlcy5ib29sLFxuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdmFsdWU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgUHJvcFR5cGVzLmFycmF5LFxuICBdKSxcbiAgY2xhc3M6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgcmVxdWlyZWQ6IFByb3BUeXBlcy5ib29sLFxuICBlcnJvck1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHBsYWNlSG9sZGVyOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBvblVzZXJJbnB1dDogUHJvcFR5cGVzLmZ1bmMsXG59O1xuXG5TZWFyY2hhYmxlRHJvcGRvd24uZGVmYXVsdFByb3BzID0ge1xuICBuYW1lOiAnJyxcbiAgb3B0aW9uczoge30sXG4gIHN0cmljdFNlYXJjaDogdHJ1ZSxcbiAgbGFiZWw6ICcnLFxuICB2YWx1ZTogdW5kZWZpbmVkLFxuICBpZDogbnVsbCxcbiAgY2xhc3M6ICcnLFxuICBkaXNhYmxlZDogZmFsc2UsXG4gIHJlcXVpcmVkOiBmYWxzZSxcbiAgc29ydEJ5VmFsdWU6IHRydWUsXG4gIGVycm9yTWVzc2FnZTogJycsXG4gIHBsYWNlSG9sZGVyOiAnJyxcbiAgb25Vc2VySW5wdXQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUud2Fybignb25Vc2VySW5wdXQoKSBjYWxsYmFjayBpcyBub3Qgc2V0Jyk7XG4gIH0sXG59O1xuXG4vKipcbiAqIFNlbGVjdCBDb21wb25lbnRcbiAqIFJlYWN0IHdyYXBwZXIgZm9yIGEgc2ltcGxlIG9yICdtdWx0aXBsZScgPHNlbGVjdD4gZWxlbWVudC5cbiAqL1xuY2xhc3MgU2VsZWN0RWxlbWVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShlKSB7XG4gICAgbGV0IHZhbHVlID0gZS50YXJnZXQudmFsdWU7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGUudGFyZ2V0Lm9wdGlvbnM7XG4gICAgY29uc3QgbnVtT2ZPcHRpb25zID0gb3B0aW9ucy5sZW5ndGg7XG5cbiAgICAvLyBNdWx0aXBsZSB2YWx1ZXNcbiAgICBpZiAodGhpcy5wcm9wcy5tdWx0aXBsZSAmJiBudW1PZk9wdGlvbnMgPiAxKSB7XG4gICAgICB2YWx1ZSA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBudW1PZk9wdGlvbnM7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKG9wdGlvbnNbaV0uc2VsZWN0ZWQpIHtcbiAgICAgICAgICB2YWx1ZS5wdXNoKG9wdGlvbnNbaV0udmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wcm9wcy5vblVzZXJJbnB1dCh0aGlzLnByb3BzLm5hbWUsIHZhbHVlLCBlLnRhcmdldC5pZCwgJ3NlbGVjdCcpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IG11bHRpcGxlID0gdGhpcy5wcm9wcy5tdWx0aXBsZSA/ICdtdWx0aXBsZScgOiBudWxsO1xuICAgIGNvbnN0IHJlcXVpcmVkID0gdGhpcy5wcm9wcy5yZXF1aXJlZCA/ICdyZXF1aXJlZCcgOiBudWxsO1xuICAgIGNvbnN0IGRpc2FibGVkID0gdGhpcy5wcm9wcy5kaXNhYmxlZCA/ICdkaXNhYmxlZCcgOiBudWxsO1xuICAgIGNvbnN0IHNvcnRCeVZhbHVlID0gdGhpcy5wcm9wcy5zb3J0QnlWYWx1ZTtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5wcm9wcy5vcHRpb25zO1xuICAgIGxldCBlcnJvck1lc3NhZ2UgPSBudWxsO1xuICAgIGxldCBlbXB0eU9wdGlvbkhUTUwgPSBudWxsO1xuICAgIGxldCByZXF1aXJlZEhUTUwgPSBudWxsO1xuICAgIGxldCBlbGVtZW50Q2xhc3MgPSAncm93IGZvcm0tZ3JvdXAnO1xuXG4gICAgLy8gQWRkIHJlcXVpcmVkIGFzdGVyaXNrXG4gICAgaWYgKHJlcXVpcmVkKSB7XG4gICAgICByZXF1aXJlZEhUTUwgPSA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWRhbmdlclwiPio8L3NwYW4+O1xuICAgIH1cblxuICAgIC8vIEFkZCBlbXB0eSBvcHRpb25cbiAgICBpZiAodGhpcy5wcm9wcy5lbXB0eU9wdGlvbikge1xuICAgICAgZW1wdHlPcHRpb25IVE1MID0gPG9wdGlvbj48L29wdGlvbj47XG4gICAgfVxuXG4gICAgLy8gQWRkIGVycm9yIG1lc3NhZ2VcbiAgICBpZiAodGhpcy5wcm9wcy5oYXNFcnJvciB8fCAodGhpcy5wcm9wcy5yZXF1aXJlZCAmJiB0aGlzLnByb3BzLnZhbHVlID09PSAnJykpIHtcbiAgICAgIGVycm9yTWVzc2FnZSA9IDxzcGFuPnt0aGlzLnByb3BzLmVycm9yTWVzc2FnZX08L3NwYW4+O1xuICAgICAgZWxlbWVudENsYXNzID0gJ3JvdyBmb3JtLWdyb3VwIGhhcy1lcnJvcic7XG4gICAgfVxuXG4gICAgY29uc3QgbmV3T3B0aW9ucyA9IHt9O1xuICAgIGxldCBvcHRpb25MaXN0ID0gW107XG4gICAgaWYgKHNvcnRCeVZhbHVlKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBuZXdPcHRpb25zW29wdGlvbnNba2V5XV0gPSBrZXk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG9wdGlvbkxpc3QgPSBPYmplY3Qua2V5cyhuZXdPcHRpb25zKS5zb3J0KCkubWFwKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9e25ld09wdGlvbnNbb3B0aW9uXX0ga2V5PXtuZXdPcHRpb25zW29wdGlvbl19PntvcHRpb259PC9vcHRpb24+XG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9uTGlzdCA9IE9iamVjdC5rZXlzKG9wdGlvbnMpLm1hcChmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtvcHRpb259IGtleT17b3B0aW9ufT57b3B0aW9uc1tvcHRpb25dfTwvb3B0aW9uPlxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gRGVmYXVsdCB0byBlbXB0eSBzdHJpbmcgZm9yIHJlZ3VsYXIgc2VsZWN0IGFuZCB0byBlbXB0eSBhcnJheSBmb3IgJ211bHRpcGxlJyBzZWxlY3RcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMucHJvcHMudmFsdWUgfHwgKG11bHRpcGxlID8gW10gOiAnJyk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2VsZW1lbnRDbGFzc30+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wtc20tMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj17dGhpcy5wcm9wcy5sYWJlbH0+XG4gICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgICAge3JlcXVpcmVkSFRNTH1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOVwiPlxuICAgICAgICAgIDxzZWxlY3RcbiAgICAgICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZX1cbiAgICAgICAgICAgIG11bHRpcGxlPXttdWx0aXBsZX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICBpZD17dGhpcy5wcm9wcy5pZH1cbiAgICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgIHJlcXVpcmVkPXtyZXF1aXJlZH1cbiAgICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7ZW1wdHlPcHRpb25IVE1MfVxuICAgICAgICAgICAge29wdGlvbkxpc3R9XG4gICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAge2Vycm9yTWVzc2FnZX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cblNlbGVjdEVsZW1lbnQucHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIG9wdGlvbnM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHZhbHVlOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIFByb3BUeXBlcy5hcnJheSxcbiAgXSksXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjbGFzczogUHJvcFR5cGVzLnN0cmluZyxcbiAgbXVsdGlwbGU6IFByb3BUeXBlcy5ib29sLFxuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIHJlcXVpcmVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgZW1wdHlPcHRpb246IFByb3BUeXBlcy5ib29sLFxuICBoYXNFcnJvcjogUHJvcFR5cGVzLmJvb2wsXG4gIGVycm9yTWVzc2FnZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgb25Vc2VySW5wdXQ6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuU2VsZWN0RWxlbWVudC5kZWZhdWx0UHJvcHMgPSB7XG4gIG5hbWU6ICcnLFxuICBvcHRpb25zOiB7fSxcbiAgbGFiZWw6ICcnLFxuICB2YWx1ZTogdW5kZWZpbmVkLFxuICBpZDogbnVsbCxcbiAgY2xhc3M6ICcnLFxuICBtdWx0aXBsZTogZmFsc2UsXG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICBzb3J0QnlWYWx1ZTogdHJ1ZSxcbiAgZW1wdHlPcHRpb246IHRydWUsXG4gIGhhc0Vycm9yOiBmYWxzZSxcbiAgZXJyb3JNZXNzYWdlOiAnVGhlIGZpZWxkIGlzIHJlcXVpcmVkIScsXG4gIG9uVXNlcklucHV0OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uVXNlcklucHV0KCkgY2FsbGJhY2sgaXMgbm90IHNldCcpO1xuICB9LFxufTtcblxuLyoqXG4gKiBUYWdzIENvbXBvbmVudFxuICogQWxsb3dzIGZvciBtdWx0aXBsZSB2YWx1ZXMgdG8gYmUgZW50ZXJlZCBmb3IgYSBzaW5nbGUgZmllbGRcbiAqXG4gKiBDb21lcyBpbiAzIGZsYXZvcnM6XG4gKiAxOiBJZiBvcHRpb25zIGFyZSBwYXNzZWQgYW5kIHVzZVNlYXJjaCA9IHRydWVcbiAqICAgIGlucHV0IGZpZWxkIGlzIHJlbmRlcmVkIGFzIGEgc2VhcmNoYWJsZSBkcm9wZG93blxuICogMjogSWYgb25seSBvcHRpb25zIGFyZSBwYXNzZWQsIGlucHV0IGlzIHJlbmRlcmVkIGFzXG4gKiAgICBhIG5vcm1hbCBkcm9wZG93biBzZWxlY3RcbiAqIDM6IFdpdGhvdXQgb3B0aW9ucywgaW5wdXQgaXMgYSBub3JtYWwsIGZyZWUgdGV4dCBpbnB1dFxuICovXG5cbmNsYXNzIFRhZ3NFbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlS2V5UHJlc3MgPSB0aGlzLmhhbmRsZUtleVByZXNzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVBZGQgPSB0aGlzLmhhbmRsZUFkZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlUmVtb3ZlID0gdGhpcy5oYW5kbGVSZW1vdmUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldEtleUZyb21WYWx1ZSA9IHRoaXMuZ2V0S2V5RnJvbVZhbHVlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jYW5BZGRJdGVtID0gdGhpcy5jYW5BZGRJdGVtLmJpbmQodGhpcyk7XG4gIH1cblxuICAvLyBwZW5kaW5nVmFsS2V5IGlzIHRoZSBwbGFjZWhvbGRlciB2YXJpYWJsZSBmb3IgdGVtcG9yYXJpbHkgc3RvcmluZ1xuICAvLyB0eXBlZCBvciBzZWxlY3RlZCBpdGVtcyBiZWZvcmUgYWRkaW5nIHRoZW0gdG8gdGhlIFRhZ3NcbiAgaGFuZGxlQ2hhbmdlKGUpIHtcbiAgICB0aGlzLnByb3BzLm9uVXNlcklucHV0KHRoaXMucHJvcHMucGVuZGluZ1ZhbEtleSwgZS50YXJnZXQudmFsdWUpO1xuICB9XG4gIC8vIGFsc28gYWRkIHRhZ3MgaWYgZW50ZXIga2V5IGlzIGhpdCB3aXRoaW4gaW5wdXQgZmllbGRcbiAgaGFuZGxlS2V5UHJlc3MoZSkge1xuICAgIGlmIChlLmtleUNvZGUgPT09IDEzIHx8IGUud2hpY2ggPT09IDEzKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLmhhbmRsZUFkZCgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHNlbmQgcGVuZGluZ1ZhbEtleSBhcyBhbiBhcmd1bWVudCBpbiBvcmRlciB0byBudWxsIG91dCBlbnRlcmVkIGl0ZW1cbiAgaGFuZGxlQWRkKCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLnByb3BzLm9wdGlvbnM7XG4gICAgbGV0IHZhbHVlID0gdGhpcy5wcm9wcy52YWx1ZTtcbiAgICAvLyBpZiB1c2luZyBhIGRhdGFsaXN0IChzZWFyY2gpLCBzZXQgdmFsdWUgdG8gYmUgdGhlIGtleSBpbiBvcHRpb25zXG4gICAgaWYgKHRoaXMucHJvcHMudXNlU2VhcmNoICYmIE9iamVjdC52YWx1ZXMob3B0aW9ucykuaW5kZXhPZih2YWx1ZSkgPiAtMSkge1xuICAgICAgdmFsdWUgPSB0aGlzLmdldEtleUZyb21WYWx1ZSh2YWx1ZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNhbkFkZEl0ZW0odmFsdWUpKSB7XG4gICAgICB0aGlzLnByb3BzLm9uVXNlckFkZCh0aGlzLnByb3BzLm5hbWUsIHZhbHVlLCB0aGlzLnByb3BzLnBlbmRpbmdWYWxLZXkpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVJlbW92ZShlKSB7XG4gICAgY29uc3QgdmFsdWUgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaXRlbScpO1xuICAgIHRoaXMucHJvcHMub25Vc2VyUmVtb3ZlKHRoaXMucHJvcHMubmFtZSwgdmFsdWUpO1xuICB9XG5cbiAgZ2V0S2V5RnJvbVZhbHVlKHZhbHVlKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMucHJvcHMub3B0aW9ucztcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob3B0aW9ucykuZmluZChmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gb3B0aW9uc1tvXSA9PT0gdmFsdWU7XG4gICAgfSk7XG4gIH1cblxuICAvLyBoZWxwZXIgZnVuY3Rpb24gdG8gZGV0ZWN0IGlmIGl0ZW0gc2hvdWxkIGJlIGFkZGVkIHRvIFRhZ3NcbiAgY2FuQWRkSXRlbSh2YWx1ZSkge1xuICAgIGxldCByZXN1bHQgPSB0cnVlO1xuICAgIC8vIHJlamVjdCBlbXB0eSB2YWx1ZXNcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIC8vIHJlamVjdCBpZiBhbGxvd0R1cGwgaXMgZmFsc2UgYW5kIGl0ZW0gaXMgYWxyZWFkeSBpbiBhcnJheVxuICAgIH0gZWxzZSBpZiAoIXRoaXMucHJvcHMuYWxsb3dEdXBsICYmIHRoaXMucHJvcHMuaXRlbXMuaW5kZXhPZih2YWx1ZSkgPiAtMSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAvLyByZWplY3QgaWYgdXNpbmcgYSBzdHJpY3QgZGF0YWxpc3QgYW5kIHZhbHVlIGlzIG5vdCBpbiBvcHRpb25zXG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnVzZVNlYXJjaCAmJlxuICAgICAgdGhpcy5wcm9wcy5zdHJpY3RTZWFyY2ggJiZcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMucHJvcHMub3B0aW9ucykuaW5kZXhPZih2YWx1ZSkgPT09IC0xXG4gICAgKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGRpc2FibGVkID0gdGhpcy5wcm9wcy5kaXNhYmxlZCA/ICdkaXNhYmxlZCcgOiBudWxsO1xuICAgIGxldCByZXF1aXJlZEhUTUwgPSBudWxsO1xuICAgIGxldCBlbXB0eU9wdGlvbkhUTUwgPSBudWxsO1xuICAgIGxldCBlcnJvck1lc3NhZ2UgPSBudWxsO1xuICAgIGxldCBlbGVtZW50Q2xhc3MgPSAncm93IGZvcm0tZ3JvdXAnO1xuICAgIC8vIEFkZCByZXF1aXJlZCBhc3Rlcml4XG4gICAgaWYgKHRoaXMucHJvcHMucmVxdWlyZWQpIHtcbiAgICAgIHJlcXVpcmVkSFRNTCA9IDxzcGFuIGNsYXNzTmFtZT1cInRleHQtZGFuZ2VyXCI+Kjwvc3Bhbj47XG4gICAgfVxuXG4gICAgLy8gQWRkIGVtcHR5IG9wdGlvblxuICAgIGlmICh0aGlzLnByb3BzLmVtcHR5T3B0aW9uKSB7XG4gICAgICBlbXB0eU9wdGlvbkhUTUwgPSA8b3B0aW9uPjwvb3B0aW9uPjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5lcnJvck1lc3NhZ2UpIHtcbiAgICAgIGVycm9yTWVzc2FnZSA9IDxzcGFuPnt0aGlzLnByb3BzLmVycm9yTWVzc2FnZX08L3NwYW4+O1xuICAgICAgZWxlbWVudENsYXNzID0gJ3JvdyBmb3JtLWdyb3VwIGhhcy1lcnJvcic7XG4gICAgfVxuXG4gICAgbGV0IGlucHV0O1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLnByb3BzLm9wdGlvbnM7XG4gICAgLy8gaWYgb3B0aW9ucyBhcmUgZ2l2ZW4gYW5kIHVzZVNlYXJjaCBpcyBzcGVjaWZpZWRcbiAgICBpZiAoT2JqZWN0LmtleXMob3B0aW9ucykubGVuZ3RoID4gMCAmJiB0aGlzLnByb3BzLnVzZVNlYXJjaCkge1xuICAgICAgaW5wdXQgPSAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgICAgICBpZD17dGhpcy5wcm9wcy5pZH1cbiAgICAgICAgICAgIGxpc3Q9e3RoaXMucHJvcHMuaWQgKyAnX2xpc3QnfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnZhbHVlIHx8ICcnfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgb25LZXlQcmVzcz17dGhpcy5oYW5kbGVLZXlQcmVzc31cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxkYXRhbGlzdCBpZD17dGhpcy5wcm9wcy5pZCArICdfbGlzdCd9PlxuICAgICAgICAgICAge09iamVjdC5rZXlzKG9wdGlvbnMpLm1hcChmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtvcHRpb25zW29wdGlvbl19IGtleT17b3B0aW9ufT5cbiAgICAgICAgICAgICAgICAgIHtvcHRpb25zW29wdGlvbl19XG4gICAgICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L2RhdGFsaXN0PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgICAvLyBpZiBvcHRpb25zIGFyZSBwcmVzZW50IGJ1dCB1c2VTZWFyY2ggaXMgZmFsc2UsIHVzZSBub3JtYWwgZHJvcGRvd25cbiAgICB9IGVsc2UgaWYgKE9iamVjdC5rZXlzKG9wdGlvbnMpLmxlbmd0aCA+IDApIHtcbiAgICAgIGlucHV0ID0gPHNlbGVjdFxuICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgIGlkPXt0aGlzLnByb3BzLmlkfVxuICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZX1cbiAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgIG9uS2V5UHJlc3M9e3RoaXMuaGFuZGxlS2V5UHJlc3N9XG4gICAgICA+XG4gICAgICAgIHtlbXB0eU9wdGlvbkhUTUx9XG4gICAgICAgIHtPYmplY3Qua2V5cyhvcHRpb25zKS5tYXAoZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e29wdGlvbn0ga2V5PXtvcHRpb259PntvcHRpb25zW29wdGlvbl19PC9vcHRpb24+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgICA8L3NlbGVjdD47XG4gICAgICAvLyBlbHNlLCB1c2UgYSB0ZXh0IGlucHV0IGJ5IGRlZmF1bHRcbiAgICB9IGVsc2Uge1xuICAgICAgaW5wdXQgPSA8aW5wdXRcbiAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgIGlkPXt0aGlzLnByb3BzLmlkfVxuICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZSB8fCAnJ31cbiAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgIG9uS2V5UHJlc3M9e3RoaXMuaGFuZGxlS2V5UHJlc3N9XG4gICAgICAvPjtcbiAgICB9XG5cbiAgICAvLyBpdGVyYXRlIHRocm91Z2ggYWRkZWQgVGFncyBpdGVtcyBhbmQgcmVuZGVyIHRoZW1cbiAgICAvLyB3aXRoIGRlbGV0aW9uIGJ1dHRvblxuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5wcm9wcy5pdGVtcy5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgbGV0IGl0bVR4dDtcbiAgICAgIC8vIGluIGV2ZW50IHRoYXQgdGhlIHBhc3NlZCBpdGVtIGlzIGEga2V5IG9mIG9wdGlvbnMsXG4gICAgICAvLyByZW5kZXIgb3B0aW9uIHZhbHVlXG4gICAgICBpZiAoT2JqZWN0LmtleXMob3B0aW9ucykubGVuZ3RoID4gMCAmJiBvcHRpb25zW2l0ZW1dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaXRtVHh0ID0gb3B0aW9uc1tpdGVtXTtcbiAgICAgICAgLy8gb3RoZXJ3aXNlIGp1c3QgcmVuZGVyIGl0ZW0gYXMgaXNcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl0bVR4dCA9IGl0ZW07XG4gICAgICB9XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1pbmZvIGJ0bi1pbmxpbmVcIlxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlUmVtb3ZlfVxuICAgICAgICAgIGRhdGEtaXRlbT17aXRlbX1cbiAgICAgICAgPlxuICAgICAgICAgIHtpdG1UeHR9XG4gICAgICAgICAgJm5ic3A7XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImdseXBoaWNvbiBnbHlwaGljb24tcmVtb3ZlXCJcbiAgICAgICAgICAgIGRhdGEtaXRlbT17aXRlbX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICk7XG4gICAgfSwgdGhpcyk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtlbGVtZW50Q2xhc3N9PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9e3RoaXMucHJvcHMuaWR9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgICAgIHtyZXF1aXJlZEhUTUx9XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTlcIj5cbiAgICAgICAgICB7aXRlbXN9XG4gICAgICAgICAge2lucHV0fVxuICAgICAgICAgIHtlcnJvck1lc3NhZ2V9XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zdWNjZXNzIGJ0bi1hZGQtdGFnXCJcbiAgICAgICAgICAgIGlkPXt0aGlzLnByb3BzLmlkICsgJ0FkZCd9XG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQWRkfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdseXBoaWNvbiBnbHlwaGljb24tcGx1c1wiLz5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmJ0bkxhYmVsfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuVGFnc0VsZW1lbnQucHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHBlbmRpbmdWYWxLZXk6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgb3B0aW9uczogUHJvcFR5cGVzLm9iamVjdCxcbiAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjbGFzczogUHJvcFR5cGVzLnN0cmluZyxcbiAgbXVsdGlwbGU6IFByb3BUeXBlcy5ib29sLFxuICByZXF1aXJlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgZW1wdHlPcHRpb246IFByb3BUeXBlcy5ib29sLFxuICBlcnJvck1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGJ0bkxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBhbGxvd0R1cGw6IFByb3BUeXBlcy5ib29sLFxuICB1c2VTZWFyY2g6IFByb3BUeXBlcy5ib29sLFxuICBzdHJpY3RTZWFyY2g6IFByb3BUeXBlcy5ib29sLFxuICBvblVzZXJJbnB1dDogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uVXNlckFkZDogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uVXNlclJlbW92ZTogUHJvcFR5cGVzLmZ1bmMsXG59O1xuXG5UYWdzRWxlbWVudC5kZWZhdWx0UHJvcHMgPSB7XG4gIG5hbWU6ICcnLFxuICBvcHRpb25zOiB7fSxcbiAgaXRlbXM6IFtdLFxuICBsYWJlbDogJycsXG4gIHZhbHVlOiB1bmRlZmluZWQsXG4gIGlkOiBudWxsLFxuICBjbGFzczogJycsXG4gIHJlcXVpcmVkOiBmYWxzZSxcbiAgZGlzYWJsZWQ6IGZhbHNlLFxuICBlbXB0eU9wdGlvbjogdHJ1ZSxcbiAgaGFzRXJyb3I6IGZhbHNlLFxuICBhbGxvd0R1cGw6IGZhbHNlLFxuICB1c2VTZWFyY2g6IGZhbHNlLFxuICBzdHJpY3RTZWFyY2g6IGZhbHNlLCAvLyBvbmx5IGFjY2VwdCBpdGVtcyBzcGVjaWZpZWQgaW4gb3B0aW9uc1xuICBlcnJvck1lc3NhZ2U6ICcnLFxuICBwZW5kaW5nVmFsS2V5OiAnJyxcbiAgYnRuTGFiZWw6ICdBZGQgVGFnJyxcbiAgb25Vc2VySW5wdXQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUud2Fybignb25Vc2VySW5wdXQoKSBjYWxsYmFjayBpcyBub3Qgc2V0Jyk7XG4gIH0sXG4gIG9uVXNlckFkZDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVzZXJBZGQoKSBjYWxsYmFjayBpcyBub3Qgc2V0Jyk7XG4gIH0sXG4gIG9uVXNlclJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVzZXJSZW1vdmUoKSBjYWxsYmFjayBpcyBub3Qgc2V0Jyk7XG4gIH0sXG59O1xuXG4vKipcbiAqIFRleHRhcmVhIENvbXBvbmVudFxuICogUmVhY3Qgd3JhcHBlciBmb3IgYSA8dGV4dGFyZWE+IGVsZW1lbnQuXG4gKi9cbmNsYXNzIFRleHRhcmVhRWxlbWVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShlKSB7XG4gICAgdGhpcy5wcm9wcy5vblVzZXJJbnB1dCh0aGlzLnByb3BzLm5hbWUsIGUudGFyZ2V0LnZhbHVlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IHRoaXMucHJvcHMuZGlzYWJsZWQgPyAnZGlzYWJsZWQnIDogbnVsbDtcbiAgICBjb25zdCByZXF1aXJlZCA9IHRoaXMucHJvcHMucmVxdWlyZWQgPyAncmVxdWlyZWQnIDogbnVsbDtcbiAgICBsZXQgcmVxdWlyZWRIVE1MID0gbnVsbDtcblxuICAgIC8vIEFkZCByZXF1aXJlZCBhc3Rlcml4XG4gICAgaWYgKHJlcXVpcmVkKSB7XG4gICAgICByZXF1aXJlZEhUTUwgPSA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWRhbmdlclwiPio8L3NwYW4+O1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBmb3JtLWdyb3VwXCI+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wtc20tMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj17dGhpcy5wcm9wcy5pZH0+XG4gICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgICAge3JlcXVpcmVkSFRNTH1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOVwiPlxuICAgICAgICAgIDx0ZXh0YXJlYVxuICAgICAgICAgICAgY29scz17dGhpcy5wcm9wcy5jb2xzfVxuICAgICAgICAgICAgcm93cz17dGhpcy5wcm9wcy5yb3dzfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZX1cbiAgICAgICAgICAgIGlkPXt0aGlzLnByb3BzLmlkfVxuICAgICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMudmFsdWUgfHwgJyd9XG4gICAgICAgICAgICByZXF1aXJlZD17cmVxdWlyZWR9XG4gICAgICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgPlxuICAgICAgICAgIDwvdGV4dGFyZWE+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5UZXh0YXJlYUVsZW1lbnQucHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB2YWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgcmVxdWlyZWQ6IFByb3BUeXBlcy5ib29sLFxuICByb3dzOiBQcm9wVHlwZXMubnVtYmVyLFxuICBjb2xzOiBQcm9wVHlwZXMubnVtYmVyLFxuICBvblVzZXJJbnB1dDogUHJvcFR5cGVzLmZ1bmMsXG59O1xuXG5UZXh0YXJlYUVsZW1lbnQuZGVmYXVsdFByb3BzID0ge1xuICBuYW1lOiAnJyxcbiAgbGFiZWw6ICcnLFxuICB2YWx1ZTogJycsXG4gIGlkOiBudWxsLFxuICBkaXNhYmxlZDogZmFsc2UsXG4gIHJlcXVpcmVkOiBmYWxzZSxcbiAgcm93czogNCxcbiAgY29sczogMjUsXG4gIG9uVXNlcklucHV0OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uVXNlcklucHV0KCkgY2FsbGJhY2sgaXMgbm90IHNldCcpO1xuICB9LFxufTtcblxuLyoqXG4gKiBUZXh0Ym94IENvbXBvbmVudFxuICogUmVhY3Qgd3JhcHBlciBmb3IgYSA8aW5wdXQgdHlwZT1cInRleHRcIj4gZWxlbWVudC5cbiAqL1xuY2xhc3MgVGV4dGJveEVsZW1lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVCbHVyID0gdGhpcy5oYW5kbGVCbHVyLmJpbmQodGhpcyk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZSkge1xuICAgIHRoaXMucHJvcHMub25Vc2VySW5wdXQodGhpcy5wcm9wcy5uYW1lLCBlLnRhcmdldC52YWx1ZSwgZS50YXJnZXQuaWQsICd0ZXh0Ym94Jyk7XG4gIH1cblxuICBoYW5kbGVCbHVyKGUpIHtcbiAgICB0aGlzLnByb3BzLm9uVXNlckJsdXIodGhpcy5wcm9wcy5uYW1lLCBlLnRhcmdldC52YWx1ZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSB0aGlzLnByb3BzLmRpc2FibGVkID8gJ2Rpc2FibGVkJyA6IG51bGw7XG4gICAgY29uc3QgcmVxdWlyZWQgPSB0aGlzLnByb3BzLnJlcXVpcmVkID8gJ3JlcXVpcmVkJyA6IG51bGw7XG4gICAgbGV0IGVycm9yTWVzc2FnZSA9IG51bGw7XG4gICAgbGV0IHJlcXVpcmVkSFRNTCA9IG51bGw7XG4gICAgbGV0IGVsZW1lbnRDbGFzcyA9ICdyb3cgZm9ybS1ncm91cCc7XG5cbiAgICAvLyBBZGQgcmVxdWlyZWQgYXN0ZXJpeFxuICAgIGlmIChyZXF1aXJlZCkge1xuICAgICAgcmVxdWlyZWRIVE1MID0gPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1kYW5nZXJcIj4qPC9zcGFuPjtcbiAgICB9XG5cbiAgICAvLyBBZGQgZXJyb3IgbWVzc2FnZVxuICAgIGlmICh0aGlzLnByb3BzLmVycm9yTWVzc2FnZSkge1xuICAgICAgZXJyb3JNZXNzYWdlID0gPHNwYW4+e3RoaXMucHJvcHMuZXJyb3JNZXNzYWdlfTwvc3Bhbj47XG4gICAgICBlbGVtZW50Q2xhc3MgPSAncm93IGZvcm0tZ3JvdXAgaGFzLWVycm9yJztcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2VsZW1lbnRDbGFzc30+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wtc20tMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj17dGhpcy5wcm9wcy5pZH0+XG4gICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgICAge3JlcXVpcmVkSFRNTH1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOVwiPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZX1cbiAgICAgICAgICAgIGlkPXt0aGlzLnByb3BzLmlkfVxuICAgICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMudmFsdWUgfHwgJyd9XG4gICAgICAgICAgICByZXF1aXJlZD17cmVxdWlyZWR9XG4gICAgICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICBvbkJsdXI9e3RoaXMuaGFuZGxlQmx1cn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHtlcnJvck1lc3NhZ2V9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5UZXh0Ym94RWxlbWVudC5wcm9wVHlwZXMgPSB7XG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICByZXF1aXJlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGVycm9yTWVzc2FnZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgb25Vc2VySW5wdXQ6IFByb3BUeXBlcy5mdW5jLFxuICBvblVzZXJCbHVyOiBQcm9wVHlwZXMuZnVuYyxcbn07XG5cblRleHRib3hFbGVtZW50LmRlZmF1bHRQcm9wcyA9IHtcbiAgbmFtZTogJycsXG4gIGxhYmVsOiAnJyxcbiAgdmFsdWU6ICcnLFxuICBpZDogbnVsbCxcbiAgZGlzYWJsZWQ6IGZhbHNlLFxuICByZXF1aXJlZDogZmFsc2UsXG4gIGVycm9yTWVzc2FnZTogJycsXG4gIG9uVXNlcklucHV0OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uVXNlcklucHV0KCkgY2FsbGJhY2sgaXMgbm90IHNldCcpO1xuICB9LFxuICBvblVzZXJCbHVyOiBmdW5jdGlvbigpIHtcbiAgfSxcbn07XG5cbi8qKlxuICogRGF0ZSBDb21wb25lbnRcbiAqIFJlYWN0IHdyYXBwZXIgZm9yIGEgPGlucHV0IHR5cGU9XCJkYXRlXCI+IGVsZW1lbnQuXG4gKi9cbmNsYXNzIERhdGVFbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGUpIHtcbiAgICB0aGlzLnByb3BzLm9uVXNlcklucHV0KHRoaXMucHJvcHMubmFtZSwgZS50YXJnZXQudmFsdWUpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGRpc2FibGVkID0gdGhpcy5wcm9wcy5kaXNhYmxlZCA/ICdkaXNhYmxlZCcgOiBudWxsO1xuICAgIGNvbnN0IHJlcXVpcmVkID0gdGhpcy5wcm9wcy5yZXF1aXJlZCA/ICdyZXF1aXJlZCcgOiBudWxsO1xuICAgIGxldCByZXF1aXJlZEhUTUwgPSBudWxsO1xuXG4gICAgLy8gQWRkIHJlcXVpcmVkIGFzdGVyaXhcbiAgICBpZiAocmVxdWlyZWQpIHtcbiAgICAgIHJlcXVpcmVkSFRNTCA9IDxzcGFuIGNsYXNzTmFtZT1cInRleHQtZGFuZ2VyXCI+Kjwvc3Bhbj47XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGZvcm0tZ3JvdXBcIj5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC1zbS0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPXt0aGlzLnByb3BzLmxhYmVsfT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5sYWJlbH1cbiAgICAgICAgICB7cmVxdWlyZWRIVE1MfVxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS05XCI+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0eXBlPVwiZGF0ZVwiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICAgICAgaWQ9e3RoaXMucHJvcHMuaWR9XG4gICAgICAgICAgICBtaW49e3RoaXMucHJvcHMubWluWWVhcn1cbiAgICAgICAgICAgIG1heD17dGhpcy5wcm9wcy5tYXhZZWFyfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMudmFsdWUgfHwgJyd9XG4gICAgICAgICAgICByZXF1aXJlZD17cmVxdWlyZWR9XG4gICAgICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkRhdGVFbGVtZW50LnByb3BUeXBlcyA9IHtcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdmFsdWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBtYXhZZWFyOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBtaW5ZZWFyOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIHJlcXVpcmVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgb25Vc2VySW5wdXQ6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuRGF0ZUVsZW1lbnQuZGVmYXVsdFByb3BzID0ge1xuICBuYW1lOiAnJyxcbiAgbGFiZWw6ICcnLFxuICB2YWx1ZTogJycsXG4gIGlkOiBudWxsLFxuICBtYXhZZWFyOiAnOTk5OS0xMi0zMScsXG4gIG1pblllYXI6ICcxMDAwLTAxLTAxJyxcbiAgZGlzYWJsZWQ6IGZhbHNlLFxuICByZXF1aXJlZDogZmFsc2UsXG4gIG9uVXNlcklucHV0OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uVXNlcklucHV0KCkgY2FsbGJhY2sgaXMgbm90IHNldCcpO1xuICB9LFxufTtcblxuLyoqXG4gKiBUaW1lIENvbXBvbmVudFxuICogUmVhY3Qgd3JhcHBlciBmb3IgYSA8aW5wdXQgdHlwZT1cInRpbWVcIj4gZWxlbWVudC5cbiAqL1xuY2xhc3MgVGltZUVsZW1lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShlKSB7XG4gICAgdGhpcy5wcm9wcy5vblVzZXJJbnB1dCh0aGlzLnByb3BzLm5hbWUsIGUudGFyZ2V0LnZhbHVlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IHRoaXMucHJvcHMuZGlzYWJsZWQgPyAnZGlzYWJsZWQnIDogbnVsbDtcbiAgICBjb25zdCByZXF1aXJlZCA9IHRoaXMucHJvcHMucmVxdWlyZWQgPyAncmVxdWlyZWQnIDogbnVsbDtcbiAgICBsZXQgcmVxdWlyZWRIVE1MID0gbnVsbDtcblxuICAgIC8vIEFkZCByZXF1aXJlZCBhc3Rlcml4XG4gICAgaWYgKHJlcXVpcmVkKSB7XG4gICAgICByZXF1aXJlZEhUTUwgPSA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWRhbmdlclwiPio8L3NwYW4+O1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBmb3JtLWdyb3VwXCI+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wtc20tMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj17dGhpcy5wcm9wcy5sYWJlbH0+XG4gICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgICAge3JlcXVpcmVkSFRNTH1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOVwiPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cInRpbWVcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZX1cbiAgICAgICAgICAgIGlkPXt0aGlzLnByb3BzLmlkfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMudmFsdWUgfHwgJyd9XG4gICAgICAgICAgICByZXF1aXJlZD17cmVxdWlyZWR9XG4gICAgICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgICAgICBwYXR0ZXJuPVwiKFswLTFdWzAtOV18MlswLTRdfFsxLTldKTooWzAtNV1bMC05XSkoOihbMC01XVswLTldKSk/XCJcbiAgICAgICAgICAgIHRpdGxlPVwiSW5wdXQgbXVzdCBiZSBpbiBvbmUgb2YgdGhlIGZvbGxvd2luZyBmb3JtYXRzOiBISDpNTSBvciBISDpNTTpTU1wiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cblRpbWVFbGVtZW50LnByb3BUeXBlcyA9IHtcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdmFsdWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIHJlcXVpcmVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgb25Vc2VySW5wdXQ6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuVGltZUVsZW1lbnQuZGVmYXVsdFByb3BzID0ge1xuICBuYW1lOiAnJyxcbiAgbGFiZWw6ICcnLFxuICB2YWx1ZTogJycsXG4gIGlkOiAnJyxcbiAgZGlzYWJsZWQ6IGZhbHNlLFxuICByZXF1aXJlZDogZmFsc2UsXG4gIG9uVXNlcklucHV0OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uVXNlcklucHV0KCkgY2FsbGJhY2sgaXMgbm90IHNldCcpO1xuICB9LFxufTtcblxuLyoqXG4gKiBOdW1lcmljIENvbXBvbmVudFxuICogUmVhY3Qgd3JhcHBlciBmb3IgYSA8aW5wdXQgdHlwZT1cIm51bWJlclwiPiBlbGVtZW50LlxuICovXG5jbGFzcyBOdW1lcmljRWxlbWVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShlKSB7XG4gICAgdGhpcy5wcm9wcy5vblVzZXJJbnB1dCh0aGlzLnByb3BzLm5hbWUsIGUudGFyZ2V0LnZhbHVlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IHRoaXMucHJvcHMuZGlzYWJsZWQgPyAnZGlzYWJsZWQnIDogbnVsbDtcbiAgICBjb25zdCByZXF1aXJlZCA9IHRoaXMucHJvcHMucmVxdWlyZWQgPyAncmVxdWlyZWQnIDogbnVsbDtcbiAgICBjb25zdCByZXF1aXJlZEhUTUwgPSBudWxsO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGZvcm0tZ3JvdXBcIj5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC1zbS0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPXt0aGlzLnByb3BzLmlkfT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5sYWJlbH1cbiAgICAgICAgICB7cmVxdWlyZWRIVE1MfVxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS05XCI+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgICAgICBpZD17dGhpcy5wcm9wcy5pZH1cbiAgICAgICAgICAgIG1pbj17dGhpcy5wcm9wcy5taW59XG4gICAgICAgICAgICBtYXg9e3RoaXMucHJvcHMubWF4fVxuICAgICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMudmFsdWV9XG4gICAgICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgICAgICByZXF1aXJlZD17cmVxdWlyZWR9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbk51bWVyaWNFbGVtZW50LnByb3BUeXBlcyA9IHtcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBtaW46IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgbWF4OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB2YWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgcmVxdWlyZWQ6IFByb3BUeXBlcy5ib29sLFxuICBvblVzZXJJbnB1dDogUHJvcFR5cGVzLmZ1bmMsXG59O1xuXG5OdW1lcmljRWxlbWVudC5kZWZhdWx0UHJvcHMgPSB7XG4gIG5hbWU6ICcnLFxuICBtaW46IG51bGwsXG4gIG1heDogbnVsbCxcbiAgbGFiZWw6ICcnLFxuICB2YWx1ZTogJycsXG4gIGlkOiBudWxsLFxuICByZXF1aXJlZDogZmFsc2UsXG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgb25Vc2VySW5wdXQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUud2Fybignb25Vc2VySW5wdXQoKSBjYWxsYmFjayBpcyBub3Qgc2V0Jyk7XG4gIH0sXG59O1xuXG4vKipcbiAqIEZpbGUgQ29tcG9uZW50XG4gKiBSZWFjdCB3cmFwcGVyIGZvciBhIHNpbXBsZSBvciAnbXVsdGlwbGUnIDxzZWxlY3Q+IGVsZW1lbnQuXG4gKi9cbmNsYXNzIEZpbGVFbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGUpIHtcbiAgICAvLyBTZW5kIGN1cnJlbnQgZmlsZSB0byBwYXJlbnQgY29tcG9uZW50XG4gICAgY29uc3QgZmlsZSA9IGUudGFyZ2V0LmZpbGVzWzBdID8gZS50YXJnZXQuZmlsZXNbMF0gOiAnJztcbiAgICB0aGlzLnByb3BzLm9uVXNlcklucHV0KHRoaXMucHJvcHMubmFtZSwgZmlsZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgcmVxdWlyZWQgPSB0aGlzLnByb3BzLnJlcXVpcmVkID8gJ3JlcXVpcmVkJyA6IG51bGw7XG4gICAgY29uc3QgZmlsZU5hbWUgPSB0aGlzLnByb3BzLnZhbHVlID8gdGhpcy5wcm9wcy52YWx1ZS5uYW1lIDogdW5kZWZpbmVkO1xuICAgIGxldCByZXF1aXJlZEhUTUwgPSBudWxsO1xuICAgIGxldCBlcnJvck1lc3NhZ2UgPSAnJztcbiAgICBsZXQgZWxlbWVudENsYXNzID0gJ3JvdyBmb3JtLWdyb3VwJztcblxuICAgIC8vIEFkZCByZXF1aXJlZCBhc3Rlcml4XG4gICAgaWYgKHJlcXVpcmVkKSB7XG4gICAgICByZXF1aXJlZEhUTUwgPSA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWRhbmdlclwiPio8L3NwYW4+O1xuICAgIH1cblxuICAgIGNvbnN0IHRydW5jYXRlRWxsaXBzaXMgPSB7XG4gICAgICBkaXNwbGF5OiAndGFibGUnLFxuICAgICAgdGFibGVMYXlvdXQ6ICdmaXhlZCcsXG4gICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCcsXG4gICAgfTtcblxuICAgIGNvbnN0IHRydW5jYXRlRWxsaXBzaXNDaGlsZCA9IHtcbiAgICAgIGRpc3BsYXk6ICd0YWJsZS1jZWxsJyxcbiAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgIHRleHRPdmVyZmxvdzogJ2VsbGlwc2lzJyxcbiAgICB9O1xuXG4gICAgLy8gQWRkIGVycm9yIG1lc3NhZ2VcbiAgICBpZiAodGhpcy5wcm9wcy5oYXNFcnJvcikge1xuICAgICAgZXJyb3JNZXNzYWdlID0gdGhpcy5wcm9wcy5lcnJvck1lc3NhZ2U7XG4gICAgICBlbGVtZW50Q2xhc3MgPSAncm93IGZvcm0tZ3JvdXAgaGFzLWVycm9yJztcbiAgICB9XG5cbiAgICAvLyBOZWVkIHRvIG1hbnVhbGx5IHJlc2V0IGZpbGUgdmFsdWUsIGJlY2F1c2UgSFRNTCBBUElcbiAgICAvLyBkb2VzIG5vdCBhbGxvdyBzZXR0aW5nIHZhbHVlIHRvIGFueXRoaW5nIHRoYW4gZW1wdHkgc3RyaW5nLlxuICAgIC8vIEhlbmNlIGNhbid0IHVzZSB2YWx1ZSBhdHRyaWJ1dGUgaW4gdGhlIGlucHV0IGVsZW1lbnQuXG4gICAgY29uc3QgZmlsZUhUTUwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmlsZVVwbG9hZCcpO1xuICAgIGlmIChmaWxlSFRNTCAmJiAhZmlsZU5hbWUpIHtcbiAgICAgIGZpbGVIVE1MLnZhbHVlID0gJyc7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuZGlzYWJsZWQpIHtcbiAgICAgIC8vIGFkZCBwYWRkaW5nIHRvIGFsaWduIHZpZGVvIHRpdGxlIG9uIGRpc2FibGVkIGZpZWxkXG4gICAgICB0cnVuY2F0ZUVsbGlwc2lzLnBhZGRpbmdUb3AgPSAnN3B4JztcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtlbGVtZW50Q2xhc3N9PlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wtc20tMyBjb250cm9sLWxhYmVsXCI+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5sYWJlbH1cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTlcIj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RydW5jYXRlRWxsaXBzaXN9PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17dHJ1bmNhdGVFbGxpcHNpc0NoaWxkfT57ZmlsZU5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2VsZW1lbnRDbGFzc30+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wtc20tMyBjb250cm9sLWxhYmVsXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgICAge3JlcXVpcmVkSFRNTH1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXBcIj5cbiAgICAgICAgICAgIDxkaXYgdGFiSW5kZXg9XCItMVwiIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbCBmaWxlLWNhcHRpb24ga3YtZmlsZWlucHV0LWNhcHRpb25cIj5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dHJ1bmNhdGVFbGxpcHNpc30+XG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3RydW5jYXRlRWxsaXBzaXNDaGlsZH0+e2ZpbGVOYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmlsZS1jYXB0aW9uLW5hbWVcIiBpZD1cInZpZGVvX2ZpbGVcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1ncm91cC1idG5cIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnkgYnRuLWZpbGVcIj5cbiAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLWZvbGRlci1vcGVuXCI+PC9pPiBCcm93c2VcbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZpbGVVcGxvYWRcIlxuICAgICAgICAgICAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ9e3JlcXVpcmVkfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPHNwYW4+e2Vycm9yTWVzc2FnZX08L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5GaWxlRWxlbWVudC5wcm9wVHlwZXMgPSB7XG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHZhbHVlOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIFByb3BUeXBlcy5vYmplY3QsXG4gIF0pLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICByZXF1aXJlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGhhc0Vycm9yOiBQcm9wVHlwZXMuYm9vbCxcbiAgZXJyb3JNZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBvblVzZXJJbnB1dDogUHJvcFR5cGVzLmZ1bmMsXG59O1xuXG5GaWxlRWxlbWVudC5kZWZhdWx0UHJvcHMgPSB7XG4gIG5hbWU6ICcnLFxuICBsYWJlbDogJ0ZpbGUgdG8gVXBsb2FkJyxcbiAgdmFsdWU6ICcnLFxuICBpZDogbnVsbCxcbiAgZGlzYWJsZWQ6IGZhbHNlLFxuICByZXF1aXJlZDogZmFsc2UsXG4gIGhhc0Vycm9yOiBmYWxzZSxcbiAgZXJyb3JNZXNzYWdlOiAnVGhlIGZpZWxkIGlzIHJlcXVpcmVkIScsXG4gIG9uVXNlcklucHV0OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uVXNlcklucHV0KCkgY2FsbGJhY2sgaXMgbm90IHNldCcpO1xuICB9LFxufTtcblxuLyoqXG4gKiBTdGF0aWMgZWxlbWVudCBjb21wb25lbnQuXG4gKiBVc2VkIHRvIGRpc3BsYXlzIHBsYWluL2Zvcm1hdHRlZCB0ZXh0IGFzIHBhcnQgb2YgYSBmb3JtXG4gKlxuICogVG8gcGFzcyBhIGZvcm1hdHRlZCB0ZXh0LCB5b3UgbmVlZCB0byB3cmFwIGl0IGluIGEgc2luZ2xlIHBhcmVudCBlbGVtZW50LlxuICogRXhhbXBsZSB1c2FnZTpcbiAqXG4gKiBgYGBcbiAqIGxldCBteVRleHQgPSAoPHNwYW4+VGhpcyBpcyBteSA8Yj50ZXh0PC9iPjwvc3Bhbj4pO1xuICogPFN0YXRpY0VsZW1lbnRcbiAqICAgIHRleHQ9e215VGV4dH1cbiAqICAgIGxhYmVsPXtub3RlfVxuICogLz5cbiAqIGBgYFxuICovXG5jbGFzcyBTdGF0aWNFbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBmb3JtLWdyb3VwXCI+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wtc20tMyBjb250cm9sLWxhYmVsXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTlcIj5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2wtc3RhdGljXCI+e3RoaXMucHJvcHMudGV4dH08L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5TdGF0aWNFbGVtZW50LnByb3BUeXBlcyA9IHtcbiAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHRleHQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgUHJvcFR5cGVzLmVsZW1lbnQsXG4gIF0pLFxufTtcblxuU3RhdGljRWxlbWVudC5kZWZhdWx0UHJvcHMgPSB7XG4gIGxhYmVsOiAnJyxcbiAgdGV4dDogbnVsbCxcbn07XG5cbi8qKlxuICogTGluayBlbGVtZW50IGNvbXBvbmVudC5cbiAqIFVzZWQgdG8gbGluayBwbGFpbi9mb3JtYXRlZCB0ZXh0IHRvIGFuIGhyZWYgZGVzdGluYXRpb24gYXMgcGFydCBvZiBhIGZvcm1cbiAqL1xuY2xhc3MgTGlua0VsZW1lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZm9ybS1ncm91cFwiPlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTMgY29udHJvbC1sYWJlbFwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS05XCI+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sLXN0YXRpY1wiPlxuICAgICAgICAgICAgPGEgaHJlZj17dGhpcy5wcm9wcy5ocmVmfT57dGhpcy5wcm9wcy50ZXh0fTwvYT5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5MaW5rRWxlbWVudC5wcm9wVHlwZXMgPSB7XG4gIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB0ZXh0OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIFByb3BUeXBlcy5lbGVtZW50LFxuICBdKSxcbiAgaHJlZjogUHJvcFR5cGVzLnN0cmluZyxcbn07XG5cbkxpbmtFbGVtZW50LmRlZmF1bHRQcm9wcyA9IHtcbiAgbGFiZWw6ICcnLFxuICB0ZXh0OiBudWxsLFxuICBocmVmOiBudWxsLFxufTtcblxuLyoqXG4gKiBDaGVja2JveCBDb21wb25lbnRcbiAqIFJlYWN0IHdyYXBwZXIgZm9yIGEgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiPiBlbGVtZW50LlxuICovXG5jbGFzcyBDaGVja2JveEVsZW1lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShlKSB7XG4gICAgdGhpcy5wcm9wcy5vblVzZXJJbnB1dCh0aGlzLnByb3BzLm5hbWUsIGUudGFyZ2V0LmNoZWNrZWQpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGRpc2FibGVkID0gdGhpcy5wcm9wcy5kaXNhYmxlZCA/ICdkaXNhYmxlZCcgOiBudWxsO1xuICAgIGNvbnN0IHJlcXVpcmVkID0gdGhpcy5wcm9wcy5yZXF1aXJlZCA/ICdyZXF1aXJlZCcgOiBudWxsO1xuICAgIGxldCBlcnJvck1lc3NhZ2UgPSBudWxsO1xuICAgIGxldCByZXF1aXJlZEhUTUwgPSBudWxsO1xuICAgIGxldCBlbGVtZW50Q2xhc3MgPSAnY2hlY2tib3gtaW5saW5lIGNvbC1zbS1vZmZzZXQtMyc7XG4gICAgY29uc3QgbGFiZWwgPSBudWxsO1xuXG4gICAgLy8gQWRkIHJlcXVpcmVkIGFzdGVyaXhcbiAgICBpZiAocmVxdWlyZWQpIHtcbiAgICAgIHJlcXVpcmVkSFRNTCA9IDxzcGFuIGNsYXNzTmFtZT1cInRleHQtZGFuZ2VyXCI+Kjwvc3Bhbj47XG4gICAgfVxuXG4gICAgLy8gQWRkIGVycm9yIG1lc3NhZ2VcbiAgICBpZiAodGhpcy5wcm9wcy5lcnJvck1lc3NhZ2UpIHtcbiAgICAgIGVycm9yTWVzc2FnZSA9IDxzcGFuPnt0aGlzLnByb3BzLmVycm9yTWVzc2FnZX08L3NwYW4+O1xuICAgICAgZWxlbWVudENsYXNzID0gJ2NoZWNrYm94LWlubGluZSBjb2wtc20tb2Zmc2V0LTMgaGFzLWVycm9yJztcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2VsZW1lbnRDbGFzc30+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPXt0aGlzLnByb3BzLmlkfT5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgICAgICBpZD17dGhpcy5wcm9wcy5pZH1cbiAgICAgICAgICAgIGNoZWNrZWQ9e3RoaXMucHJvcHMudmFsdWV9XG4gICAgICAgICAgICByZXF1aXJlZD17cmVxdWlyZWR9XG4gICAgICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7ZXJyb3JNZXNzYWdlfVxuICAgICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgICAgIHtyZXF1aXJlZEhUTUx9XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkNoZWNrYm94RWxlbWVudC5wcm9wVHlwZXMgPSB7XG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgdmFsdWU6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIHJlcXVpcmVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgZXJyb3JNZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBvblVzZXJJbnB1dDogUHJvcFR5cGVzLmZ1bmMsXG59O1xuXG5DaGVja2JveEVsZW1lbnQuZGVmYXVsdFByb3BzID0ge1xuICBpZDogbnVsbCxcbiAgZGlzYWJsZWQ6IGZhbHNlLFxuICByZXF1aXJlZDogZmFsc2UsXG4gIGVycm9yTWVzc2FnZTogJycsXG4gIG9uVXNlcklucHV0OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uVXNlcklucHV0KCkgY2FsbGJhY2sgaXMgbm90IHNldCcpO1xuICB9LFxufTtcblxuLyoqXG4gKiBCdXR0b24gY29tcG9uZW50XG4gKiBSZWFjdCB3cmFwcGVyIGZvciA8YnV0dG9uPiBlbGVtZW50LCB0eXBpY2FsbHkgdXNlZCB0byBzdWJtaXQgZm9ybXNcbiAqL1xuY2xhc3MgQnV0dG9uRWxlbWVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG4gIH1cblxuICBoYW5kbGVDbGljayhlKSB7XG4gICAgdGhpcy5wcm9wcy5vblVzZXJJbnB1dChlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZm9ybS1ncm91cFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jb2x1bW5TaXplfT5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgICAgICB0eXBlPXt0aGlzLnByb3BzLnR5cGV9XG4gICAgICAgICAgICBjbGFzc05hbWU9e3RoaXMucHJvcHMuYnV0dG9uQ2xhc3N9XG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuQnV0dG9uRWxlbWVudC5wcm9wVHlwZXMgPSB7XG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB0eXBlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBvblVzZXJJbnB1dDogUHJvcFR5cGVzLmZ1bmMsXG59O1xuXG5CdXR0b25FbGVtZW50LmRlZmF1bHRQcm9wcyA9IHtcbiAgbGFiZWw6ICdTdWJtaXQnLFxuICB0eXBlOiAnc3VibWl0JyxcbiAgYnV0dG9uQ2xhc3M6ICdidG4gYnRuLXByaW1hcnknLFxuICBjb2x1bW5TaXplOiAnY29sLXNtLTkgY29sLXNtLW9mZnNldC0zJyxcbiAgb25Vc2VySW5wdXQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUud2Fybignb25Vc2VySW5wdXQoKSBjYWxsYmFjayBpcyBub3Qgc2V0Jyk7XG4gIH0sXG59O1xuXG4vKipcbiAgKiBDYWxsIFRvIEFjdGlvbiAoQ1RBKSBjb21wb25lbnRcbiAgKiBSZWFjdCB3cmFwcGVyIGZvciA8YnV0dG9uPiBlbGVtZW50IHRoYXQgaXMgdXNlZCBmb3IgQ2FsbCB0byBBY3Rpb25zLCB1c3VhbGx5XG4gICogb3V0c2lkZSB0aGUgY29udGV4dCBvZiBmb3Jtcy5cbiAgKi9cbmNsYXNzIENUQSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvblxuICAgICAgICBjbGFzc05hbWU9e3RoaXMucHJvcHMuYnV0dG9uQ2xhc3N9XG4gICAgICAgIG9uQ2xpY2s9e3RoaXMucHJvcHMub25Vc2VySW5wdXR9XG4gICAgICA+XG4gICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxufVxuXG5DVEEucHJvcFR5cGVzID0ge1xuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgYnV0dG9uQ2xhc3M6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG9uVXNlcklucHV0OiBQcm9wVHlwZXMuZnVuYyxcbn07XG5cbkNUQS5kZWZhdWx0UHJvcHMgPSB7XG4gIGJ1dHRvbkNsYXNzOiAnYnRuIGJ0bi1wcmltYXJ5JyxcbiAgb25Vc2VySW5wdXQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUud2Fybignb25Vc2VySW5wdXQoKSBjYWxsYmFjayBpcyBub3Qgc2V0Jyk7XG4gIH0sXG59O1xuXG4vKipcbiAqIEdlbmVyaWMgZm9ybSBlbGVtZW50LlxuICovXG5jbGFzcyBMb3Jpc0VsZW1lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZWxlbWVudFByb3BzID0gdGhpcy5wcm9wcy5lbGVtZW50O1xuICAgIGVsZW1lbnRQcm9wcy5yZWYgPSBlbGVtZW50UHJvcHMubmFtZTtcbiAgICBlbGVtZW50UHJvcHMub25Vc2VySW5wdXQgPSB0aGlzLnByb3BzLm9uVXNlcklucHV0O1xuXG4gICAgbGV0IGVsZW1lbnRIdG1sID0gPGRpdj48L2Rpdj47XG5cbiAgICBzd2l0Y2ggKGVsZW1lbnRQcm9wcy50eXBlKSB7XG4gICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgZWxlbWVudEh0bWwgPSAoPFRleHRib3hFbGVtZW50IHsuLi5lbGVtZW50UHJvcHN9IC8+KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0YWdzJzpcbiAgICAgICAgZWxlbWVudEh0bWwgPSAoPFRhZ3NFbGVtZW50IHsuLi5lbGVtZW50UHJvcHN9IC8+KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgICBlbGVtZW50SHRtbCA9ICg8U2VsZWN0RWxlbWVudCB7Li4uZWxlbWVudFByb3BzfSAvPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc2VhcmNoJzpcbiAgICAgICAgZWxlbWVudEh0bWwgPSAoPFNlYXJjaGFibGVEcm9wZG93biB7Li4uZWxlbWVudFByb3BzfS8+KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgZWxlbWVudEh0bWwgPSAoPERhdGVFbGVtZW50IHsuLi5lbGVtZW50UHJvcHN9IC8+KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgZWxlbWVudEh0bWwgPSAoPFRpbWVFbGVtZW50IHsuLi5lbGVtZW50UHJvcHN9IC8+KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdudW1lcmljJzpcbiAgICAgICAgZWxlbWVudEh0bWwgPSAoPE51bWVyaWNFbGVtZW50IHsuLi5lbGVtZW50UHJvcHN9IC8+KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICAgIGVsZW1lbnRIdG1sID0gKDxUZXh0YXJlYUVsZW1lbnQgey4uLmVsZW1lbnRQcm9wc30gLz4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2ZpbGUnOlxuICAgICAgICBlbGVtZW50SHRtbCA9ICg8RmlsZUVsZW1lbnQgey4uLmVsZW1lbnRQcm9wc30gLz4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N0YXRpYyc6XG4gICAgICAgIGVsZW1lbnRIdG1sID0gKDxTdGF0aWNFbGVtZW50IHsuLi5lbGVtZW50UHJvcHN9IC8+KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsaW5rJzpcbiAgICAgICAgZWxlbWVudEh0bWwgPSAoPExpbmtFbGVtZW50IHsuLi5lbGVtZW50UHJvcHN9IC8+KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhZHZjaGVja2JveCc6XG4gICAgICAgIGVsZW1lbnRIdG1sID0gKDxDaGVja2JveEVsZW1lbnQgey4uLmVsZW1lbnRQcm9wc30gLz4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgICdFbGVtZW50IG9mIHR5cGUgJyArIGVsZW1lbnRQcm9wcy50eXBlICsgJyBpcyBub3QgY3VycmVudGx5IGltcGxlbWVudGVkISdcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW1lbnRIdG1sO1xuICB9XG59XG5cbndpbmRvdy5Gb3JtRWxlbWVudCA9IEZvcm1FbGVtZW50O1xud2luZG93LkZpZWxkc2V0RWxlbWVudCA9IEZpZWxkc2V0RWxlbWVudDtcbndpbmRvdy5TZWxlY3RFbGVtZW50ID0gU2VsZWN0RWxlbWVudDtcbndpbmRvdy5UYWdzRWxlbWVudCA9IFRhZ3NFbGVtZW50O1xud2luZG93LlNlYXJjaGFibGVEcm9wZG93biA9IFNlYXJjaGFibGVEcm9wZG93bjtcbndpbmRvdy5UZXh0YXJlYUVsZW1lbnQgPSBUZXh0YXJlYUVsZW1lbnQ7XG53aW5kb3cuVGV4dGJveEVsZW1lbnQgPSBUZXh0Ym94RWxlbWVudDtcbndpbmRvdy5EYXRlRWxlbWVudCA9IERhdGVFbGVtZW50O1xud2luZG93LlRpbWVFbGVtZW50ID0gVGltZUVsZW1lbnQ7XG53aW5kb3cuTnVtZXJpY0VsZW1lbnQgPSBOdW1lcmljRWxlbWVudDtcbndpbmRvdy5GaWxlRWxlbWVudCA9IEZpbGVFbGVtZW50O1xud2luZG93LlN0YXRpY0VsZW1lbnQgPSBTdGF0aWNFbGVtZW50O1xud2luZG93LkxpbmtFbGVtZW50ID0gTGlua0VsZW1lbnQ7XG53aW5kb3cuQ2hlY2tib3hFbGVtZW50ID0gQ2hlY2tib3hFbGVtZW50O1xud2luZG93LkJ1dHRvbkVsZW1lbnQgPSBCdXR0b25FbGVtZW50O1xud2luZG93LkNUQSA9IENUQTtcbndpbmRvdy5Mb3Jpc0VsZW1lbnQgPSBMb3Jpc0VsZW1lbnQ7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgRm9ybUVsZW1lbnQsXG4gIEZpZWxkc2V0RWxlbWVudCxcbiAgU2VsZWN0RWxlbWVudCxcbiAgVGFnc0VsZW1lbnQsXG4gIFNlYXJjaGFibGVEcm9wZG93bixcbiAgVGV4dGFyZWFFbGVtZW50LFxuICBUZXh0Ym94RWxlbWVudCxcbiAgRGF0ZUVsZW1lbnQsXG4gIFRpbWVFbGVtZW50LFxuICBOdW1lcmljRWxlbWVudCxcbiAgRmlsZUVsZW1lbnQsXG4gIFN0YXRpY0VsZW1lbnQsXG4gIExpbmtFbGVtZW50LFxuICBDaGVja2JveEVsZW1lbnQsXG4gIEJ1dHRvbkVsZW1lbnQsXG4gIENUQSxcbiAgTG9yaXNFbGVtZW50LFxufTtcbiIsIi8qKlxuICogVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBSZWFjdCBjb21wb25lbnQgZm9yIExvYWRlclxuICpcbiAqIEBhdXRob3IgSGVucmkgUmFiYWxhaXNcbiAqIEB2ZXJzaW9uIDEuMC4wXG4gKlxuICovXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuLyoqXG4gKiBMb2FkZXIgY29tcG9uZW50XG4gKi9cbmNsYXNzIExvYWRlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT0nbG9hZGVyJ1xuICAgICAgICBzdHlsZT17e3dpZHRoOiBwYXJzZUludCh0aGlzLnByb3BzLnNpemUpLCBoZWlnaHQ6IHBhcnNlSW50KHRoaXMucHJvcHMuc2l6ZSl9fVxuICAgICAgLz5cbiAgICApO1xuICB9XG59XG5cbkxvYWRlci5wcm9wVHlwZXMgPSB7c2l6ZTogUHJvcFR5cGVzLnN0cmluZ307XG5Mb2FkZXIuZGVmYXVsdFByb3BzID0ge3NpemU6ICcxMjAnfTtcblxuZXhwb3J0IGRlZmF1bHQgTG9hZGVyO1xuIiwiLyogZXhwb3J0ZWQgUlBhZ2luYXRpb25MaW5rcyAqL1xuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmNsYXNzIFBhZ2luYXRpb25MaW5rcyBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcblxuICAgIH07XG4gICAgdGhpcy5jaGFuZ2VQYWdlID0gdGhpcy5jaGFuZ2VQYWdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBjaGFuZ2VQYWdlKGkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAvLyBEb24ndCBqdW1wIHRvIHRoZSB0b3Agb2YgdGhlIHBhZ2VcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBpZiAodGhpcy5wcm9wcy5vbkNoYW5nZVBhZ2UpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZVBhZ2UoaSk7XG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCByb3dzUGVyUGFnZSA9IHRoaXMucHJvcHMuUm93c1BlclBhZ2U7XG4gICAgbGV0IHBhZ2VMaW5rcyA9IFtdO1xuICAgIGxldCBjbGFzc0xpc3Q7XG4gICAgbGV0IGxhc3RQYWdlID0gTWF0aC5jZWlsKHRoaXMucHJvcHMuVG90YWwgLyByb3dzUGVyUGFnZSk7XG4gICAgbGV0IHN0YXJ0UGFnZSA9IE1hdGgubWF4KDEsIHRoaXMucHJvcHMuQWN0aXZlIC0gMyk7XG4gICAgbGV0IGxhc3RTaG93blBhZ2UgPSBNYXRoLm1pbih0aGlzLnByb3BzLkFjdGl2ZSArIDMsIGxhc3RQYWdlKTtcblxuICAgIGlmICh0aGlzLnByb3BzLlRvdGFsID09PSAwKSB7XG4gICAgICByZXR1cm4gPGRpdiAvPjtcbiAgICB9XG4gICAgaWYgKHRoaXMucHJvcHMuVG90YWwgPCB0aGlzLnByb3BzLlJvd3NQZXJQYWdlKSB7XG4gICAgICByZXR1cm4gPGRpdiAvPjtcbiAgICB9XG5cbiAgICBpZiAoKGxhc3RTaG93blBhZ2UgLSBzdGFydFBhZ2UpIDw9IDcpIHtcbiAgICAgIGxhc3RTaG93blBhZ2UgPSBzdGFydFBhZ2UgKyA2O1xuICAgICAgaWYgKGxhc3RTaG93blBhZ2UgPiBsYXN0UGFnZSkge1xuICAgICAgICBsYXN0U2hvd25QYWdlID0gbGFzdFBhZ2U7XG4gICAgICAgIHN0YXJ0UGFnZSA9IGxhc3RQYWdlIC0gNjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3RhcnRQYWdlID4gMSkge1xuICAgICAgcGFnZUxpbmtzLnB1c2goXG4gICAgICAgIDxsaSBrZXk9eyd0YWJsZV9wYWdlX2JlZ2lubmluZ18nICsgc3RhcnRQYWdlLnRvU3RyaW5nKCl9IG9uQ2xpY2s9e3RoaXMuY2hhbmdlUGFnZSgxKX0+PGEgaHJlZj0nIyc+JmxhcXVvOzwvYT48L2xpPlxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHN0YXJ0UGFnZSA8IDEpIHtcbiAgICAgIHN0YXJ0UGFnZSA9IDE7XG4gICAgfVxuICAgIGlmIChsYXN0U2hvd25QYWdlIDwgMSkge1xuICAgICAgbGFzdFNob3duUGFnZSA9IDE7XG4gICAgfVxuXG4gICAgICAgIC8vIElmIHRoZXJlIGlzIG9ubHkgMSBwYWdlLCBkb24ndCBkaXNwbGF5IHBhZ2luYXRpb24gbGlua3NcbiAgICBpZiAoc3RhcnRQYWdlID09PSBsYXN0U2hvd25QYWdlKSB7XG4gICAgICByZXR1cm4gPGRpdiAvPjtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gc3RhcnRQYWdlOyBpIDw9IGxhc3RTaG93blBhZ2U7IGkgKz0gMSkge1xuICAgICAgY2xhc3NMaXN0ID0gJyc7XG4gICAgICBpZiAodGhpcy5wcm9wcy5BY3RpdmUgPT09IGkpIHtcbiAgICAgICAgY2xhc3NMaXN0ID0gJ2FjdGl2ZSc7XG4gICAgICB9XG4gICAgICBwYWdlTGlua3MucHVzaChcbiAgICAgICAgPGxpIGtleT17J3RhYmxlX3BhZ2VfJyArIGkudG9TdHJpbmcoKX0gb25DbGljaz17dGhpcy5jaGFuZ2VQYWdlKGkpfSBjbGFzc05hbWU9e2NsYXNzTGlzdH0+XG4gICAgICAgICAgPGEgaHJlZj1cIiNcIj57aX08L2E+XG4gICAgICAgIDwvbGk+XG4gICAgICApO1xuICAgIH1cbiAgICBpZiAobGFzdFNob3duUGFnZSAhPT0gbGFzdFBhZ2UpIHtcbiAgICAgIHBhZ2VMaW5rcy5wdXNoKFxuICAgICAgICA8bGkga2V5PXsndGFibGVfcGFnZV9tb3JlXycgKyBsYXN0U2hvd25QYWdlLnRvU3RyaW5nKCl9IG9uQ2xpY2s9e3RoaXMuY2hhbmdlUGFnZShsYXN0UGFnZSl9PlxuICAgICAgICAgIDxhIGhyZWY9JyMnPiZyYXF1bzs8L2E+XG4gICAgICAgIDwvbGk+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8dWwgY2xhc3NOYW1lPSdwYWdpbmF0aW9uIHBhZ2luYXRpb24tdGFibGUnPlxuICAgICAgICAgIHtwYWdlTGlua3N9XG4gICAgICA8L3VsPlxuICAgICk7XG4gIH1cbn1cblBhZ2luYXRpb25MaW5rcy5wcm9wVHlwZXMgPSB7XG4gIG9uQ2hhbmdlUGFnZTogUHJvcFR5cGVzLmZ1bmMsXG4gIFRvdGFsOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG59O1xuUGFnaW5hdGlvbkxpbmtzLmRlZmF1bHRQcm9wcyA9IHtcbiAgUm93c1BlclBhZ2U6IDEwLFxuICBBY3RpdmU6IDEsXG59O1xuXG5sZXQgUlBhZ2luYXRpb25MaW5rcyA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkoUGFnaW5hdGlvbkxpbmtzKTtcblxud2luZG93LlBhZ2luYXRpb25MaW5rcyA9IFBhZ2luYXRpb25MaW5rcztcbndpbmRvdy5SUGFnaW5hdGlvbkxpbmtzID0gUlBhZ2luYXRpb25MaW5rcztcblxuZXhwb3J0IGRlZmF1bHQgUGFnaW5hdGlvbkxpbmtzO1xuIiwiLyoqXG4gKiBUaGlzIGZpbGUgY29udGFpbnMgUmVhY3QgY29tcG9uZW50IGZvciBQYW5lbFxuICpcbiAqIEBhdXRob3IgQWxleCBJLlxuICogQHZlcnNpb24gMS4wLjBcbiAqXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG4vKipcbiAqIFBhbmVsIGNvbXBvbmVudFxuICogV3JhcHMgY2hpbGRyZW4gaW4gYSBjb2xsYXBzaWJsZSBib290c3RyYXAgcGFuZWxcbiAqL1xuY2xhc3MgUGFuZWwgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBjb2xsYXBzZWQ6IHRoaXMucHJvcHMuaW5pdENvbGxhcHNlZCxcbiAgICB9O1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBwYW5lbCBjbGFzcyBiYXNlZCBvbiBjb2xsYXBzZWQgc3RhdHVzXG4gICAgdGhpcy5wYW5lbENsYXNzID0gKFxuICAgICAgdGhpcy5wcm9wcy5pbml0Q29sbGFwc2VkID9cbiAgICAgICAgJ3BhbmVsLWNvbGxhcHNlIGNvbGxhcHNlJyA6XG4gICAgICAgICdwYW5lbC1jb2xsYXBzZSBjb2xsYXBzZSBpbidcbiAgICApO1xuXG4gICAgdGhpcy50b2dnbGVDb2xsYXBzZWQgPSB0aGlzLnRvZ2dsZUNvbGxhcHNlZC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgdG9nZ2xlQ29sbGFwc2VkKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2NvbGxhcHNlZDogIXRoaXMuc3RhdGUuY29sbGFwc2VkfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgLy8gQ2hhbmdlIGFycm93IGRpcmVjdGlvbiBiYXNlZCBvbiBjb2xsYXBzZSBzdGF0dXNcbiAgICBsZXQgZ2x5cGhDbGFzcyA9IChcbiAgICAgIHRoaXMuc3RhdGUuY29sbGFwc2VkID9cbiAgICAgICAgJ2dseXBoaWNvbiBwdWxsLXJpZ2h0IGdseXBoaWNvbi1jaGV2cm9uLWRvd24nIDpcbiAgICAgICAgJ2dseXBoaWNvbiBwdWxsLXJpZ2h0IGdseXBoaWNvbi1jaGV2cm9uLXVwJ1xuICAgICk7XG5cbiAgICAvLyBBZGQgcGFuZWwgaGVhZGVyLCBpZiB0aXRsZSBpcyBzZXRcbiAgICBjb25zdCBwYW5lbEhlYWRpbmcgPSB0aGlzLnByb3BzLnRpdGxlID8gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCJcbiAgICAgICAgb25DbGljaz17dGhpcy50b2dnbGVDb2xsYXBzZWR9XG4gICAgICAgIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIlxuICAgICAgICBkYXRhLXRhcmdldD17JyMnICsgdGhpcy5wcm9wcy5pZH1cbiAgICAgICAgc3R5bGU9e3tjdXJzb3I6ICdwb2ludGVyJ319XG4gICAgICA+XG4gICAgICAgIHt0aGlzLnByb3BzLnRpdGxlfVxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2dseXBoQ2xhc3N9Pjwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICkgOiAnJztcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsIHBhbmVsLXByaW1hcnlcIj5cbiAgICAgICAge3BhbmVsSGVhZGluZ31cbiAgICAgICAgPGRpdiBpZD17dGhpcy5wcm9wcy5pZH0gY2xhc3NOYW1lPXt0aGlzLnBhbmVsQ2xhc3N9IHJvbGU9XCJ0YWJwYW5lbFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keVwiIHN0eWxlPXt7aGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodH19PlxuICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5QYW5lbC5wcm9wVHlwZXMgPSB7XG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLFxufTtcblBhbmVsLmRlZmF1bHRQcm9wcyA9IHtcbiAgaW5pdENvbGxhcHNlZDogZmFsc2UsXG4gIGlkOiAnZGVmYXVsdC1wYW5lbCcsXG4gIGhlaWdodDogJzEwMCUnLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgUGFuZWw7XG4iLCJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgTG9hZGVyIGZyb20gJ0xvYWRlcic7XG5pbXBvcnQgRmlsdGVyYWJsZURhdGFUYWJsZSBmcm9tICdGaWx0ZXJhYmxlRGF0YVRhYmxlJztcblxuY2xhc3MgSW1hZ2luZ0Jyb3dzZXJJbmRleCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGRhdGE6IHt9LFxuICAgICAgZXJyb3I6IGZhbHNlLFxuICAgICAgaXNMb2FkZWQ6IGZhbHNlLFxuICAgIH07XG5cbiAgICB0aGlzLmZldGNoRGF0YSA9IHRoaXMuZmV0Y2hEYXRhLmJpbmQodGhpcyk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmZldGNoRGF0YSgpXG4gICAgICAudGhlbigoKSA9PiB0aGlzLnNldFN0YXRlKHtpc0xvYWRlZDogdHJ1ZX0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBkYXRhIGZyb20gdGhlIHByb3ZpZGVkIFVSTCBhbmQgc2F2ZSBpdCBpbiBzdGF0ZVxuICAgKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBmZXRjaERhdGEoKSB7XG4gICAgcmV0dXJuIGZldGNoKHRoaXMucHJvcHMuZGF0YVVSTCwge2NyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nfSlcbiAgICAgIC50aGVuKChyZXNwKSA9PiByZXNwLmpzb24oKSlcbiAgICAgIC50aGVuKChkYXRhKSA9PiB0aGlzLnNldFN0YXRlKHtkYXRhfSkpXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2Vycm9yOiB0cnVlfSk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTW9kaWZ5IGJlaGF2aW91ciBvZiBzcGVjaWZpZWQgY29sdW1uIGNlbGxzIGluIHRoZSBEYXRhIFRhYmxlIGNvbXBvbmVudFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29sdW1uIC0gY29sdW1uIG5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNlbGwgLSBjZWxsIGNvbnRlbnRcbiAgICogQHBhcmFtIHtvYmplY3R9IHJvdyAtIHJvdyBjb250ZW50IGluZGV4ZWQgYnkgY29sdW1uXG4gICAqXG4gICAqIEByZXR1cm4geyp9IGEgZm9ybWF0ZWQgdGFibGUgY2VsbCBmb3IgYSBnaXZlbiBjb2x1bW5cbiAgICovXG4gIGZvcm1hdENvbHVtbihjb2x1bW4sIGNlbGwsIHJvdykge1xuICAgIC8vIFNldCBjbGFzcyB0byAnYmctZGFuZ2VyJyBpZiBmaWxlIGlzIGhpZGRlbi5cbiAgICBjb25zdCBzdHlsZSA9ICcnO1xuICAgIGxldCByZXN1bHQgPSA8dGQgY2xhc3NOYW1lPXtzdHlsZX0+e2NlbGx9PC90ZD47XG4gICAgc3dpdGNoIChjb2x1bW4pIHtcbiAgICAgIGNhc2UgJ05ldyBEYXRhJzpcbiAgICAgICAgaWYgKGNlbGwgPT09ICduZXcnKSB7XG4gICAgICAgICAgcmVzdWx0ID0gKFxuICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm5ld2RhdGFcIj5ORVc8L3RkPlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdMaW5rcyc6XG4gICAgICAgIGxldCBjZWxsVHlwZXMgPSBjZWxsLnNwbGl0KCcsJyk7XG4gICAgICAgIGxldCBjZWxsTGlua3MgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjZWxsVHlwZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICBjZWxsTGlua3MucHVzaCg8YSBrZXk9e2l9IGhyZWY9e2xvcmlzLkJhc2VVUkwgK1xuICAgICAgICAgICcvaW1hZ2luZ19icm93c2VyL3ZpZXdTZXNzaW9uLz9zZXNzaW9uSUQ9JyArXG4gICAgICAgICAgcm93LlNlc3Npb25JRCArICcmb3V0cHV0VHlwZT0nICtcbiAgICAgICAgICBjZWxsVHlwZXNbaV0gKyAnJmJhY2tVUkw9L2ltYWdpbmdfYnJvd3Nlci8nfT5cbiAgICAgICAgICAgIHtjZWxsVHlwZXNbaV19XG4gICAgICAgICAgPC9hPik7XG4gICAgICAgICAgY2VsbExpbmtzLnB1c2goJyB8ICcpO1xuICAgICAgICB9XG4gICAgICAgIGNlbGxMaW5rcy5wdXNoKDxhIGtleT1cInNlbGVjdGVkXCIgaHJlZj17bG9yaXMuQmFzZVVSTCArXG4gICAgICAgICcvaW1hZ2luZ19icm93c2VyL3ZpZXdTZXNzaW9uLz9zZXNzaW9uSUQ9JyArXG4gICAgICAgIHJvdy5TZXNzaW9uSUQgK1xuICAgICAgICAnJnNlbGVjdGVkT25seT0xJmJhY2tVUkw9L2ltYWdpbmdfYnJvd3Nlci8nfT5cbiAgICAgICAgICBzZWxlY3RlZFxuICAgICAgICA8L2E+KTtcblxuICAgICAgICBjZWxsTGlua3MucHVzaCgnIHwgJyk7XG4gICAgICAgIGNlbGxMaW5rcy5wdXNoKDxhIGtleT1cImFsbFwiIGhyZWY9e2xvcmlzLkJhc2VVUkwgK1xuICAgICAgICAnL2ltYWdpbmdfYnJvd3Nlci92aWV3U2Vzc2lvbi8/c2Vzc2lvbklEPScgK1xuICAgICAgICByb3cuU2Vzc2lvbklEICtcbiAgICAgICAgJyZiYWNrVVJMPS9pbWFnaW5nX2Jyb3dzZXIvJ30+XG4gICAgICAgICAgYWxsIHR5cGVzXG4gICAgICAgIDwvYT4pO1xuICAgICAgICByZXN1bHQgPSAoPHRkPntjZWxsTGlua3N9PC90ZD4pO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIC8vIElmIGVycm9yIG9jY3VycywgcmV0dXJuIGEgbWVzc2FnZS5cbiAgICAvLyBYWFg6IFJlcGxhY2UgdGhpcyB3aXRoIGEgVUkgY29tcG9uZW50IGZvciA1MDAgZXJyb3JzLlxuICAgIGlmICh0aGlzLnN0YXRlLmVycm9yKSB7XG4gICAgICByZXR1cm4gPGgzPkFuIGVycm9yIG9jY3VyZWQgd2hpbGUgbG9hZGluZyB0aGUgcGFnZS48L2gzPjtcbiAgICB9XG5cbiAgICAvLyBXYWl0aW5nIGZvciBhc3luYyBkYXRhIHRvIGxvYWRcbiAgICBpZiAoIXRoaXMuc3RhdGUuaXNMb2FkZWQpIHtcbiAgICAgIHJldHVybiA8TG9hZGVyLz47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3VycmVudGx5LCB0aGUgb3JkZXIgb2YgdGhlc2UgZmllbGRzIE1VU1QgbWF0Y2ggdGhlIG9yZGVyIG9mIHRoZVxuICAgICAqIHF1ZXJpZWQgY29sdW1ucyBpbiBfc2V0dXBWYXJpYWJsZXMoKSBpbiBpbWFnaW5nX2Jyb3dzZXIuY2xhc3MuaW5jXG4gICAgICovXG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuc3RhdGUuZGF0YS5maWVsZE9wdGlvbnM7XG4gICAgY29uc3QgY29uZmlnTGFiZWxzID0gb3B0aW9ucy5jb25maWdMYWJlbHM7XG4gICAgY29uc3QgZmllbGRzID0gW1xuICAgICAge2xhYmVsOiAnU2l0ZScsIHNob3c6IHRydWUsIGZpbHRlcjoge1xuICAgICAgICBuYW1lOiAnc2l0ZScsXG4gICAgICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgICAgICBvcHRpb25zOiBvcHRpb25zLnNpdGVzLFxuICAgICAgfX0sXG4gICAgICB7bGFiZWw6ICdQU0NJRCcsIHNob3c6IHRydWUsIGZpbHRlcjoge1xuICAgICAgICBuYW1lOiAnUFNDSUQnLFxuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICB9fSxcbiAgICAgIHtsYWJlbDogJ0RDQ0lEJywgc2hvdzogdHJ1ZSwgZmlsdGVyOiB7XG4gICAgICAgIG5hbWU6ICdEQ0NJRCcsXG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgIH19LFxuICAgICAge2xhYmVsOiAnUHJvamVjdCcsIHNob3c6IHRydWUsIGZpbHRlcjoge1xuICAgICAgICBuYW1lOiAncHJvamVjdCcsXG4gICAgICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgICAgICBvcHRpb25zOiBvcHRpb25zLnByb2plY3RzLFxuICAgICAgfX0sXG4gICAgICB7bGFiZWw6ICdWaXN0IExhYmVsJywgc2hvdzogdHJ1ZSwgZmlsdGVyOiB7XG4gICAgICAgIG5hbWU6ICd2aXNpdExhYmVsJyxcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgfX0sXG4gICAgICB7bGFiZWw6ICdWaXNpdCBRQyBTdGF0dXMnLCBzaG93OiB0cnVlLCBmaWx0ZXI6IHtcbiAgICAgICAgbmFtZTogJ3Zpc2l0UUNTdGF0dXMnLFxuICAgICAgICB0eXBlOiAnc2VsZWN0JyxcbiAgICAgICAgb3B0aW9uczogb3B0aW9ucy52aXNpdFFDU3RhdHVzLFxuICAgICAgfX0sXG4gICAgICB7bGFiZWw6ICdGaXJzdCBBY3F1aXNpdGlvbicsIHNob3c6IHRydWV9LFxuICAgICAge2xhYmVsOiAnRmlyc3QgSW5zZXJ0aW9uJywgc2hvdzogdHJ1ZX0sXG4gICAgICB7bGFiZWw6ICdMYXN0IFFDJywgc2hvdzogdHJ1ZX0sXG4gICAgICB7bGFiZWw6ICdOZXcgRGF0YScsIHNob3c6IHRydWV9LFxuICAgICAge2xhYmVsOiAnTGlua3MnLCBzaG93OiB0cnVlfSxcbiAgICAgIHtsYWJlbDogJ1Nlc3Npb25JRCcsIHNob3c6IGZhbHNlfSxcbiAgICAgIHtsYWJlbDogJ1NlcXVlbmNlIFR5cGUnLCBzaG93OiBmYWxzZSwgZmlsdGVyOiB7XG4gICAgICAgIG5hbWU6ICdzZXF1ZW5jZVR5cGUnLFxuICAgICAgICB0eXBlOiAnbXVsdGlzZWxlY3QnLFxuICAgICAgICBvcHRpb25zOiBvcHRpb25zLnNlcXVlbmNlVHlwZXMsXG4gICAgICB9fSxcbiAgICAgIHtsYWJlbDogJ1BlbmRpbmcgTmV3Jywgc2hvdzogZmFsc2UsIGZpbHRlcjoge1xuICAgICAgICBuYW1lOiAncGVuZGluZ05ldycsXG4gICAgICAgIHR5cGU6ICdtdWx0aXNlbGVjdCcsXG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnMucGVuZGluZ05ldyxcbiAgICAgIH19LFxuICAgIF07XG4gICAgLyoqXG4gICAgICogQWRkaW5nIGNvbHVtbnMgYmFzZWQgb24gdGhlIEltYWdpbmcgQnJvd3NlciBUYWJ1bGF0ZWQgU2NhbiBUeXBlc1xuICAgICAqIGNvbmZpZ3VyZWQgYW5kIHN0b3JlZCBpbiBkYXRhYmFzZVxuICAgICAqL1xuICAgIE9iamVjdC52YWx1ZXMoY29uZmlnTGFiZWxzKS5mb3JFYWNoKChsYWJlbCk9PiB7XG4gICAgICBmaWVsZHMucHVzaCh7bGFiZWw6IGxhYmVsICsgJyBRQyBTdGF0dXMnLCBzaG93OiB0cnVlfVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHJldHVybiAoXG4gICAgICA8RmlsdGVyYWJsZURhdGFUYWJsZVxuICAgICAgICBuYW1lPVwiaW1hZ2luZ19icm93c2VyXCJcbiAgICAgICAgZGF0YT17dGhpcy5zdGF0ZS5kYXRhLkRhdGF9XG4gICAgICAgIGZpZWxkcz17ZmllbGRzfVxuICAgICAgICBnZXRGb3JtYXR0ZWRDZWxsPXt0aGlzLmZvcm1hdENvbHVtbn1cbiAgICAgIC8+XG5cbiAgICApO1xuICB9XG59XG5cbkltYWdpbmdCcm93c2VySW5kZXgucHJvcFR5cGVzID0ge1xuICBkYXRhVVJMOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG59O1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgUmVhY3RET00ucmVuZGVyKFxuICAgIDxJbWFnaW5nQnJvd3NlckluZGV4XG4gICAgICBkYXRhVVJMPXtgJHtsb3Jpcy5CYXNlVVJMfS9pbWFnaW5nX2Jyb3dzZXIvP2Zvcm1hdD1qc29uYH1cbiAgICAvPixcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9yaXN3b3Jrc3BhY2UnKVxuICApO1xufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBcbiAqL1xuXG5mdW5jdGlvbiBtYWtlRW1wdHlGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gYXJnO1xuICB9O1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gYWNjZXB0cyBhbmQgZGlzY2FyZHMgaW5wdXRzOyBpdCBoYXMgbm8gc2lkZSBlZmZlY3RzLiBUaGlzIGlzXG4gKiBwcmltYXJpbHkgdXNlZnVsIGlkaW9tYXRpY2FsbHkgZm9yIG92ZXJyaWRhYmxlIGZ1bmN0aW9uIGVuZHBvaW50cyB3aGljaFxuICogYWx3YXlzIG5lZWQgdG8gYmUgY2FsbGFibGUsIHNpbmNlIEpTIGxhY2tzIGEgbnVsbC1jYWxsIGlkaW9tIGFsYSBDb2NvYS5cbiAqL1xudmFyIGVtcHR5RnVuY3Rpb24gPSBmdW5jdGlvbiBlbXB0eUZ1bmN0aW9uKCkge307XG5cbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnMgPSBtYWtlRW1wdHlGdW5jdGlvbjtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNGYWxzZSA9IG1ha2VFbXB0eUZ1bmN0aW9uKGZhbHNlKTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNUcnVlID0gbWFrZUVtcHR5RnVuY3Rpb24odHJ1ZSk7XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbCA9IG1ha2VFbXB0eUZ1bmN0aW9uKG51bGwpO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc1RoaXMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzO1xufTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNBcmd1bWVudCA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgcmV0dXJuIGFyZztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZW1wdHlGdW5jdGlvbjsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbnZhciB2YWxpZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIHZhbGlkYXRlRm9ybWF0KGZvcm1hdCkge307XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhbGlkYXRlRm9ybWF0ID0gZnVuY3Rpb24gdmFsaWRhdGVGb3JtYXQoZm9ybWF0KSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBpbnZhcmlhbnQoY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgdmFsaWRhdGVGb3JtYXQoZm9ybWF0KTtcblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKCdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJyZWQ7IHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCAnICsgJ2ZvciB0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgICAgfSkpO1xuICAgICAgZXJyb3IubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICB9XG5cbiAgICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgaW52YXJpYW50J3Mgb3duIGZyYW1lXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7IiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW1wdHlGdW5jdGlvbiA9IHJlcXVpcmUoJy4vZW1wdHlGdW5jdGlvbicpO1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gaW52YXJpYW50IGJ1dCBvbmx5IGxvZ3MgYSB3YXJuaW5nIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IG1ldC5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbG9nIGlzc3VlcyBpbiBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMgaW4gY3JpdGljYWxcbiAqIHBhdGhzLiBSZW1vdmluZyB0aGUgbG9nZ2luZyBjb2RlIGZvciBwcm9kdWN0aW9uIGVudmlyb25tZW50cyB3aWxsIGtlZXAgdGhlXG4gKiBzYW1lIGxvZ2ljIGFuZCBmb2xsb3cgdGhlIHNhbWUgY29kZSBwYXRocy5cbiAqL1xuXG52YXIgd2FybmluZyA9IGVtcHR5RnVuY3Rpb247XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbiBwcmludFdhcm5pbmcoZm9ybWF0KSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoeCkge31cbiAgfTtcblxuICB3YXJuaW5nID0gZnVuY3Rpb24gd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCwgLi4uYXJncylgIHJlcXVpcmVzIGEgd2FybmluZyAnICsgJ21lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG5cbiAgICBpZiAoZm9ybWF0LmluZGV4T2YoJ0ZhaWxlZCBDb21wb3NpdGUgcHJvcFR5cGU6ICcpID09PSAwKSB7XG4gICAgICByZXR1cm47IC8vIElnbm9yZSBDb21wb3NpdGVDb21wb25lbnQgcHJvcHR5cGUgY2hlY2suXG4gICAgfVxuXG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4yID4gMiA/IF9sZW4yIC0gMiA6IDApLCBfa2V5MiA9IDI7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgYXJnc1tfa2V5MiAtIDJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgIH1cblxuICAgICAgcHJpbnRXYXJuaW5nLmFwcGx5KHVuZGVmaW5lZCwgW2Zvcm1hdF0uY29uY2F0KGFyZ3MpKTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gd2FybmluZzsiLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbigpIHt9O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xuICB2YXIgbG9nZ2VkVHlwZUZhaWx1cmVzID0ge307XG5cbiAgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyB0ZXh0O1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyAtLS0gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgLS0tXG4gICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKHgpIHt9XG4gIH07XG59XG5cbi8qKlxuICogQXNzZXJ0IHRoYXQgdGhlIHZhbHVlcyBtYXRjaCB3aXRoIHRoZSB0eXBlIHNwZWNzLlxuICogRXJyb3IgbWVzc2FnZXMgYXJlIG1lbW9yaXplZCBhbmQgd2lsbCBvbmx5IGJlIHNob3duIG9uY2UuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHR5cGVTcGVjcyBNYXAgb2YgbmFtZSB0byBhIFJlYWN0UHJvcFR5cGVcbiAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZXMgUnVudGltZSB2YWx1ZXMgdGhhdCBuZWVkIHRvIGJlIHR5cGUtY2hlY2tlZFxuICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uIGUuZy4gXCJwcm9wXCIsIFwiY29udGV4dFwiLCBcImNoaWxkIGNvbnRleHRcIlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbXBvbmVudE5hbWUgTmFtZSBvZiB0aGUgY29tcG9uZW50IGZvciBlcnJvciBtZXNzYWdlcy5cbiAqIEBwYXJhbSB7P0Z1bmN0aW9ufSBnZXRTdGFjayBSZXR1cm5zIHRoZSBjb21wb25lbnQgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjaGVja1Byb3BUeXBlcyh0eXBlU3BlY3MsIHZhbHVlcywgbG9jYXRpb24sIGNvbXBvbmVudE5hbWUsIGdldFN0YWNrKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgZm9yICh2YXIgdHlwZVNwZWNOYW1lIGluIHR5cGVTcGVjcykge1xuICAgICAgaWYgKHR5cGVTcGVjcy5oYXNPd25Qcm9wZXJ0eSh0eXBlU3BlY05hbWUpKSB7XG4gICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgLy8gUHJvcCB0eXBlIHZhbGlkYXRpb24gbWF5IHRocm93LiBJbiBjYXNlIHRoZXkgZG8sIHdlIGRvbid0IHdhbnQgdG9cbiAgICAgICAgLy8gZmFpbCB0aGUgcmVuZGVyIHBoYXNlIHdoZXJlIGl0IGRpZG4ndCBmYWlsIGJlZm9yZS4gU28gd2UgbG9nIGl0LlxuICAgICAgICAvLyBBZnRlciB0aGVzZSBoYXZlIGJlZW4gY2xlYW5lZCB1cCwgd2UnbGwgbGV0IHRoZW0gdGhyb3cuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gVGhpcyBpcyBpbnRlbnRpb25hbGx5IGFuIGludmFyaWFudCB0aGF0IGdldHMgY2F1Z2h0LiBJdCdzIHRoZSBzYW1lXG4gICAgICAgICAgLy8gYmVoYXZpb3IgYXMgd2l0aG91dCB0aGlzIHN0YXRlbWVudCBleGNlcHQgd2l0aCBhIGJldHRlciBtZXNzYWdlLlxuICAgICAgICAgIGlmICh0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhciBlcnIgPSBFcnJvcihcbiAgICAgICAgICAgICAgKGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJykgKyAnOiAnICsgbG9jYXRpb24gKyAnIHR5cGUgYCcgKyB0eXBlU3BlY05hbWUgKyAnYCBpcyBpbnZhbGlkOyAnICtcbiAgICAgICAgICAgICAgJ2l0IG11c3QgYmUgYSBmdW5jdGlvbiwgdXN1YWxseSBmcm9tIHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZSwgYnV0IHJlY2VpdmVkIGAnICsgdHlwZW9mIHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdICsgJ2AuJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGVyci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlcnJvciA9IHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdKHZhbHVlcywgdHlwZVNwZWNOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgbnVsbCwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgIGVycm9yID0gZXg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVycm9yICYmICEoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikpIHtcbiAgICAgICAgICBwcmludFdhcm5pbmcoXG4gICAgICAgICAgICAoY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnKSArICc6IHR5cGUgc3BlY2lmaWNhdGlvbiBvZiAnICtcbiAgICAgICAgICAgIGxvY2F0aW9uICsgJyBgJyArIHR5cGVTcGVjTmFtZSArICdgIGlzIGludmFsaWQ7IHRoZSB0eXBlIGNoZWNrZXIgJyArXG4gICAgICAgICAgICAnZnVuY3Rpb24gbXVzdCByZXR1cm4gYG51bGxgIG9yIGFuIGBFcnJvcmAgYnV0IHJldHVybmVkIGEgJyArIHR5cGVvZiBlcnJvciArICcuICcgK1xuICAgICAgICAgICAgJ1lvdSBtYXkgaGF2ZSBmb3Jnb3R0ZW4gdG8gcGFzcyBhbiBhcmd1bWVudCB0byB0aGUgdHlwZSBjaGVja2VyICcgK1xuICAgICAgICAgICAgJ2NyZWF0b3IgKGFycmF5T2YsIGluc3RhbmNlT2YsIG9iamVjdE9mLCBvbmVPZiwgb25lT2ZUeXBlLCBhbmQgJyArXG4gICAgICAgICAgICAnc2hhcGUgYWxsIHJlcXVpcmUgYW4gYXJndW1lbnQpLidcbiAgICAgICAgICApXG5cbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciAmJiAhKGVycm9yLm1lc3NhZ2UgaW4gbG9nZ2VkVHlwZUZhaWx1cmVzKSkge1xuICAgICAgICAgIC8vIE9ubHkgbW9uaXRvciB0aGlzIGZhaWx1cmUgb25jZSBiZWNhdXNlIHRoZXJlIHRlbmRzIHRvIGJlIGEgbG90IG9mIHRoZVxuICAgICAgICAgIC8vIHNhbWUgZXJyb3IuXG4gICAgICAgICAgbG9nZ2VkVHlwZUZhaWx1cmVzW2Vycm9yLm1lc3NhZ2VdID0gdHJ1ZTtcblxuICAgICAgICAgIHZhciBzdGFjayA9IGdldFN0YWNrID8gZ2V0U3RhY2soKSA6ICcnO1xuXG4gICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgJ0ZhaWxlZCAnICsgbG9jYXRpb24gKyAnIHR5cGU6ICcgKyBlcnJvci5tZXNzYWdlICsgKHN0YWNrICE9IG51bGwgPyBzdGFjayA6ICcnKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjaGVja1Byb3BUeXBlcztcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xudmFyIGNoZWNrUHJvcFR5cGVzID0gcmVxdWlyZSgnLi9jaGVja1Byb3BUeXBlcycpO1xuXG52YXIgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24oKSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyB0ZXh0O1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyAtLS0gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgLS0tXG4gICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKHgpIHt9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGwoKSB7XG4gIHJldHVybiBudWxsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGlzVmFsaWRFbGVtZW50LCB0aHJvd09uRGlyZWN0QWNjZXNzKSB7XG4gIC8qIGdsb2JhbCBTeW1ib2wgKi9cbiAgdmFyIElURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xuICB2YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSAnQEBpdGVyYXRvcic7IC8vIEJlZm9yZSBTeW1ib2wgc3BlYy5cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaXRlcmF0b3IgbWV0aG9kIGZ1bmN0aW9uIGNvbnRhaW5lZCBvbiB0aGUgaXRlcmFibGUgb2JqZWN0LlxuICAgKlxuICAgKiBCZSBzdXJlIHRvIGludm9rZSB0aGUgZnVuY3Rpb24gd2l0aCB0aGUgaXRlcmFibGUgYXMgY29udGV4dDpcbiAgICpcbiAgICogICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihteUl0ZXJhYmxlKTtcbiAgICogICAgIGlmIChpdGVyYXRvckZuKSB7XG4gICAqICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChteUl0ZXJhYmxlKTtcbiAgICogICAgICAgLi4uXG4gICAqICAgICB9XG4gICAqXG4gICAqIEBwYXJhbSB7P29iamVjdH0gbWF5YmVJdGVyYWJsZVxuICAgKiBAcmV0dXJuIHs/ZnVuY3Rpb259XG4gICAqL1xuICBmdW5jdGlvbiBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IG1heWJlSXRlcmFibGUgJiYgKElURVJBVE9SX1NZTUJPTCAmJiBtYXliZUl0ZXJhYmxlW0lURVJBVE9SX1NZTUJPTF0gfHwgbWF5YmVJdGVyYWJsZVtGQVVYX0lURVJBVE9SX1NZTUJPTF0pO1xuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yRm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbGxlY3Rpb24gb2YgbWV0aG9kcyB0aGF0IGFsbG93IGRlY2xhcmF0aW9uIGFuZCB2YWxpZGF0aW9uIG9mIHByb3BzIHRoYXQgYXJlXG4gICAqIHN1cHBsaWVkIHRvIFJlYWN0IGNvbXBvbmVudHMuIEV4YW1wbGUgdXNhZ2U6XG4gICAqXG4gICAqICAgdmFyIFByb3BzID0gcmVxdWlyZSgnUmVhY3RQcm9wVHlwZXMnKTtcbiAgICogICB2YXIgTXlBcnRpY2xlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgKiAgICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgIC8vIEFuIG9wdGlvbmFsIHN0cmluZyBwcm9wIG5hbWVkIFwiZGVzY3JpcHRpb25cIi5cbiAgICogICAgICAgZGVzY3JpcHRpb246IFByb3BzLnN0cmluZyxcbiAgICpcbiAgICogICAgICAgLy8gQSByZXF1aXJlZCBlbnVtIHByb3AgbmFtZWQgXCJjYXRlZ29yeVwiLlxuICAgKiAgICAgICBjYXRlZ29yeTogUHJvcHMub25lT2YoWydOZXdzJywnUGhvdG9zJ10pLmlzUmVxdWlyZWQsXG4gICAqXG4gICAqICAgICAgIC8vIEEgcHJvcCBuYW1lZCBcImRpYWxvZ1wiIHRoYXQgcmVxdWlyZXMgYW4gaW5zdGFuY2Ugb2YgRGlhbG9nLlxuICAgKiAgICAgICBkaWFsb2c6IFByb3BzLmluc3RhbmNlT2YoRGlhbG9nKS5pc1JlcXVpcmVkXG4gICAqICAgICB9LFxuICAgKiAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHsgLi4uIH1cbiAgICogICB9KTtcbiAgICpcbiAgICogQSBtb3JlIGZvcm1hbCBzcGVjaWZpY2F0aW9uIG9mIGhvdyB0aGVzZSBtZXRob2RzIGFyZSB1c2VkOlxuICAgKlxuICAgKiAgIHR5cGUgOj0gYXJyYXl8Ym9vbHxmdW5jfG9iamVjdHxudW1iZXJ8c3RyaW5nfG9uZU9mKFsuLi5dKXxpbnN0YW5jZU9mKC4uLilcbiAgICogICBkZWNsIDo9IFJlYWN0UHJvcFR5cGVzLnt0eXBlfSguaXNSZXF1aXJlZCk/XG4gICAqXG4gICAqIEVhY2ggYW5kIGV2ZXJ5IGRlY2xhcmF0aW9uIHByb2R1Y2VzIGEgZnVuY3Rpb24gd2l0aCB0aGUgc2FtZSBzaWduYXR1cmUuIFRoaXNcbiAgICogYWxsb3dzIHRoZSBjcmVhdGlvbiBvZiBjdXN0b20gdmFsaWRhdGlvbiBmdW5jdGlvbnMuIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiAgdmFyIE15TGluayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICogICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIG9yIFVSSSBwcm9wIG5hbWVkIFwiaHJlZlwiLlxuICAgKiAgICAgIGhyZWY6IGZ1bmN0aW9uKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSkge1xuICAgKiAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICogICAgICAgIGlmIChwcm9wVmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgcHJvcFZhbHVlICE9PSAnc3RyaW5nJyAmJlxuICAgKiAgICAgICAgICAgICEocHJvcFZhbHVlIGluc3RhbmNlb2YgVVJJKSkge1xuICAgKiAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFxuICAgKiAgICAgICAgICAgICdFeHBlY3RlZCBhIHN0cmluZyBvciBhbiBVUkkgZm9yICcgKyBwcm9wTmFtZSArICcgaW4gJyArXG4gICAqICAgICAgICAgICAgY29tcG9uZW50TmFtZVxuICAgKiAgICAgICAgICApO1xuICAgKiAgICAgICAgfVxuICAgKiAgICAgIH1cbiAgICogICAgfSxcbiAgICogICAgcmVuZGVyOiBmdW5jdGlvbigpIHsuLi59XG4gICAqICB9KTtcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuXG4gIHZhciBBTk9OWU1PVVMgPSAnPDxhbm9ueW1vdXM+Pic7XG5cbiAgLy8gSW1wb3J0YW50IVxuICAvLyBLZWVwIHRoaXMgbGlzdCBpbiBzeW5jIHdpdGggcHJvZHVjdGlvbiB2ZXJzaW9uIGluIGAuL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcy5qc2AuXG4gIHZhciBSZWFjdFByb3BUeXBlcyA9IHtcbiAgICBhcnJheTogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2FycmF5JyksXG4gICAgYm9vbDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2Jvb2xlYW4nKSxcbiAgICBmdW5jOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignZnVuY3Rpb24nKSxcbiAgICBudW1iZXI6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdudW1iZXInKSxcbiAgICBvYmplY3Q6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdvYmplY3QnKSxcbiAgICBzdHJpbmc6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzdHJpbmcnKSxcbiAgICBzeW1ib2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzeW1ib2wnKSxcblxuICAgIGFueTogY3JlYXRlQW55VHlwZUNoZWNrZXIoKSxcbiAgICBhcnJheU9mOiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIsXG4gICAgZWxlbWVudDogY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCksXG4gICAgaW5zdGFuY2VPZjogY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlcixcbiAgICBub2RlOiBjcmVhdGVOb2RlQ2hlY2tlcigpLFxuICAgIG9iamVjdE9mOiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyLFxuICAgIG9uZU9mOiBjcmVhdGVFbnVtVHlwZUNoZWNrZXIsXG4gICAgb25lT2ZUeXBlOiBjcmVhdGVVbmlvblR5cGVDaGVja2VyLFxuICAgIHNoYXBlOiBjcmVhdGVTaGFwZVR5cGVDaGVja2VyLFxuICAgIGV4YWN0OiBjcmVhdGVTdHJpY3RTaGFwZVR5cGVDaGVja2VyLFxuICB9O1xuXG4gIC8qKlxuICAgKiBpbmxpbmVkIE9iamVjdC5pcyBwb2x5ZmlsbCB0byBhdm9pZCByZXF1aXJpbmcgY29uc3VtZXJzIHNoaXAgdGhlaXIgb3duXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9pc1xuICAgKi9cbiAgLyplc2xpbnQtZGlzYWJsZSBuby1zZWxmLWNvbXBhcmUqL1xuICBmdW5jdGlvbiBpcyh4LCB5KSB7XG4gICAgLy8gU2FtZVZhbHVlIGFsZ29yaXRobVxuICAgIGlmICh4ID09PSB5KSB7XG4gICAgICAvLyBTdGVwcyAxLTUsIDctMTBcbiAgICAgIC8vIFN0ZXBzIDYuYi02LmU6ICswICE9IC0wXG4gICAgICByZXR1cm4geCAhPT0gMCB8fCAxIC8geCA9PT0gMSAvIHk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFN0ZXAgNi5hOiBOYU4gPT0gTmFOXG4gICAgICByZXR1cm4geCAhPT0geCAmJiB5ICE9PSB5O1xuICAgIH1cbiAgfVxuICAvKmVzbGludC1lbmFibGUgbm8tc2VsZi1jb21wYXJlKi9cblxuICAvKipcbiAgICogV2UgdXNlIGFuIEVycm9yLWxpa2Ugb2JqZWN0IGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5IGFzIHBlb3BsZSBtYXkgY2FsbFxuICAgKiBQcm9wVHlwZXMgZGlyZWN0bHkgYW5kIGluc3BlY3QgdGhlaXIgb3V0cHV0LiBIb3dldmVyLCB3ZSBkb24ndCB1c2UgcmVhbFxuICAgKiBFcnJvcnMgYW55bW9yZS4gV2UgZG9uJ3QgaW5zcGVjdCB0aGVpciBzdGFjayBhbnl3YXksIGFuZCBjcmVhdGluZyB0aGVtXG4gICAqIGlzIHByb2hpYml0aXZlbHkgZXhwZW5zaXZlIGlmIHRoZXkgYXJlIGNyZWF0ZWQgdG9vIG9mdGVuLCBzdWNoIGFzIHdoYXRcbiAgICogaGFwcGVucyBpbiBvbmVPZlR5cGUoKSBmb3IgYW55IHR5cGUgYmVmb3JlIHRoZSBvbmUgdGhhdCBtYXRjaGVkLlxuICAgKi9cbiAgZnVuY3Rpb24gUHJvcFR5cGVFcnJvcihtZXNzYWdlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB0aGlzLnN0YWNrID0gJyc7XG4gIH1cbiAgLy8gTWFrZSBgaW5zdGFuY2VvZiBFcnJvcmAgc3RpbGwgd29yayBmb3IgcmV0dXJuZWQgZXJyb3JzLlxuICBQcm9wVHlwZUVycm9yLnByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZTtcblxuICBmdW5jdGlvbiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXIgbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGUgPSB7fTtcbiAgICAgIHZhciBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCA9IDA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNoZWNrVHlwZShpc1JlcXVpcmVkLCBwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudE5hbWUgfHwgQU5PTllNT1VTO1xuICAgICAgcHJvcEZ1bGxOYW1lID0gcHJvcEZ1bGxOYW1lIHx8IHByb3BOYW1lO1xuXG4gICAgICBpZiAoc2VjcmV0ICE9PSBSZWFjdFByb3BUeXBlc1NlY3JldCkge1xuICAgICAgICBpZiAodGhyb3dPbkRpcmVjdEFjY2Vzcykge1xuICAgICAgICAgIC8vIE5ldyBiZWhhdmlvciBvbmx5IGZvciB1c2VycyBvZiBgcHJvcC10eXBlc2AgcGFja2FnZVxuICAgICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoXG4gICAgICAgICAgICAnQ2FsbGluZyBQcm9wVHlwZXMgdmFsaWRhdG9ycyBkaXJlY3RseSBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gJyArXG4gICAgICAgICAgICAnVXNlIGBQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMoKWAgdG8gY2FsbCB0aGVtLiAnICtcbiAgICAgICAgICAgICdSZWFkIG1vcmUgYXQgaHR0cDovL2ZiLm1lL3VzZS1jaGVjay1wcm9wLXR5cGVzJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgZXJyLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgLy8gT2xkIGJlaGF2aW9yIGZvciBwZW9wbGUgdXNpbmcgUmVhY3QuUHJvcFR5cGVzXG4gICAgICAgICAgdmFyIGNhY2hlS2V5ID0gY29tcG9uZW50TmFtZSArICc6JyArIHByb3BOYW1lO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFtYW51YWxQcm9wVHlwZUNhbGxDYWNoZVtjYWNoZUtleV0gJiZcbiAgICAgICAgICAgIC8vIEF2b2lkIHNwYW1taW5nIHRoZSBjb25zb2xlIGJlY2F1c2UgdGhleSBhcmUgb2Z0ZW4gbm90IGFjdGlvbmFibGUgZXhjZXB0IGZvciBsaWIgYXV0aG9yc1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQgPCAzXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBwcmludFdhcm5pbmcoXG4gICAgICAgICAgICAgICdZb3UgYXJlIG1hbnVhbGx5IGNhbGxpbmcgYSBSZWFjdC5Qcm9wVHlwZXMgdmFsaWRhdGlvbiAnICtcbiAgICAgICAgICAgICAgJ2Z1bmN0aW9uIGZvciB0aGUgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBwcm9wIG9uIGAnICsgY29tcG9uZW50TmFtZSAgKyAnYC4gVGhpcyBpcyBkZXByZWNhdGVkICcgK1xuICAgICAgICAgICAgICAnYW5kIHdpbGwgdGhyb3cgaW4gdGhlIHN0YW5kYWxvbmUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgICAgICAgICAnWW91IG1heSBiZSBzZWVpbmcgdGhpcyB3YXJuaW5nIGR1ZSB0byBhIHRoaXJkLXBhcnR5IFByb3BUeXBlcyAnICtcbiAgICAgICAgICAgICAgJ2xpYnJhcnkuIFNlZSBodHRwczovL2ZiLm1lL3JlYWN0LXdhcm5pbmctZG9udC1jYWxsLXByb3B0eXBlcyAnICsgJ2ZvciBkZXRhaWxzLidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZUNhbGxDYWNoZVtjYWNoZUtleV0gPSB0cnVlO1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT0gbnVsbCkge1xuICAgICAgICBpZiAoaXNSZXF1aXJlZCkge1xuICAgICAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignVGhlICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBpcyBtYXJrZWQgYXMgcmVxdWlyZWQgJyArICgnaW4gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGJ1dCBpdHMgdmFsdWUgaXMgYG51bGxgLicpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdUaGUgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGlzIG1hcmtlZCBhcyByZXF1aXJlZCBpbiAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgYnV0IGl0cyB2YWx1ZSBpcyBgdW5kZWZpbmVkYC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY2hhaW5lZENoZWNrVHlwZSA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIGZhbHNlKTtcbiAgICBjaGFpbmVkQ2hlY2tUeXBlLmlzUmVxdWlyZWQgPSBjaGVja1R5cGUuYmluZChudWxsLCB0cnVlKTtcblxuICAgIHJldHVybiBjaGFpbmVkQ2hlY2tUeXBlO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoZXhwZWN0ZWRUeXBlKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSBleHBlY3RlZFR5cGUpIHtcbiAgICAgICAgLy8gYHByb3BWYWx1ZWAgYmVpbmcgaW5zdGFuY2Ugb2YsIHNheSwgZGF0ZS9yZWdleHAsIHBhc3MgdGhlICdvYmplY3QnXG4gICAgICAgIC8vIGNoZWNrLCBidXQgd2UgY2FuIG9mZmVyIGEgbW9yZSBwcmVjaXNlIGVycm9yIG1lc3NhZ2UgaGVyZSByYXRoZXIgdGhhblxuICAgICAgICAvLyAnb2YgdHlwZSBgb2JqZWN0YCcuXG4gICAgICAgIHZhciBwcmVjaXNlVHlwZSA9IGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJlY2lzZVR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2AnICsgZXhwZWN0ZWRUeXBlICsgJ2AuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpIHtcbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIoZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbCk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdQcm9wZXJ0eSBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBoYXMgaW52YWxpZCBQcm9wVHlwZSBub3RhdGlvbiBpbnNpZGUgYXJyYXlPZi4nKTtcbiAgICAgIH1cbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBhcnJheS4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BWYWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnWycgKyBpICsgJ10nLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRUeXBlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIWlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBzaW5nbGUgUmVhY3RFbGVtZW50LicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlcihleHBlY3RlZENsYXNzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAoIShwcm9wc1twcm9wTmFtZV0gaW5zdGFuY2VvZiBleHBlY3RlZENsYXNzKSkge1xuICAgICAgICB2YXIgZXhwZWN0ZWRDbGFzc05hbWUgPSBleHBlY3RlZENsYXNzLm5hbWUgfHwgQU5PTllNT1VTO1xuICAgICAgICB2YXIgYWN0dWFsQ2xhc3NOYW1lID0gZ2V0Q2xhc3NOYW1lKHByb3BzW3Byb3BOYW1lXSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIGFjdHVhbENsYXNzTmFtZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnaW5zdGFuY2Ugb2YgYCcgKyBleHBlY3RlZENsYXNzTmFtZSArICdgLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRW51bVR5cGVDaGVja2VyKGV4cGVjdGVkVmFsdWVzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGV4cGVjdGVkVmFsdWVzKSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHByaW50V2FybmluZygnSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZiwgZXhwZWN0ZWQgYW4gaW5zdGFuY2Ugb2YgYXJyYXkuJykgOiB2b2lkIDA7XG4gICAgICByZXR1cm4gZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV4cGVjdGVkVmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpcyhwcm9wVmFsdWUsIGV4cGVjdGVkVmFsdWVzW2ldKSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciB2YWx1ZXNTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShleHBlY3RlZFZhbHVlcyk7XG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHZhbHVlIGAnICsgcHJvcFZhbHVlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIG9uZSBvZiAnICsgdmFsdWVzU3RyaW5nICsgJy4nKSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyKHR5cGVDaGVja2VyKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHR5cGVDaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignUHJvcGVydHkgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiBjb21wb25lbnQgYCcgKyBjb21wb25lbnROYW1lICsgJ2AgaGFzIGludmFsaWQgUHJvcFR5cGUgbm90YXRpb24gaW5zaWRlIG9iamVjdE9mLicpO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIG9iamVjdC4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcFZhbHVlKSB7XG4gICAgICAgIGlmIChwcm9wVmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwga2V5LCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJy4nICsga2V5LCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlVW5pb25UeXBlQ2hlY2tlcihhcnJheU9mVHlwZUNoZWNrZXJzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5T2ZUeXBlQ2hlY2tlcnMpKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gcHJpbnRXYXJuaW5nKCdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mVHlwZSwgZXhwZWN0ZWQgYW4gaW5zdGFuY2Ugb2YgYXJyYXkuJykgOiB2b2lkIDA7XG4gICAgICByZXR1cm4gZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbDtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5T2ZUeXBlQ2hlY2tlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGVja2VyID0gYXJyYXlPZlR5cGVDaGVja2Vyc1tpXTtcbiAgICAgIGlmICh0eXBlb2YgY2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwcmludFdhcm5pbmcoXG4gICAgICAgICAgJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2ZUeXBlLiBFeHBlY3RlZCBhbiBhcnJheSBvZiBjaGVjayBmdW5jdGlvbnMsIGJ1dCAnICtcbiAgICAgICAgICAncmVjZWl2ZWQgJyArIGdldFBvc3RmaXhGb3JUeXBlV2FybmluZyhjaGVja2VyKSArICcgYXQgaW5kZXggJyArIGkgKyAnLidcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5T2ZUeXBlQ2hlY2tlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBhcnJheU9mVHlwZUNoZWNrZXJzW2ldO1xuICAgICAgICBpZiAoY2hlY2tlcihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KSA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBzdXBwbGllZCB0byAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYC4nKSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVOb2RlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICghaXNOb2RlKHByb3BzW3Byb3BOYW1lXSkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBzdXBwbGllZCB0byAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBSZWFjdE5vZGUuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVTaGFwZVR5cGVDaGVja2VyKHNoYXBlVHlwZXMpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgYCcgKyBwcm9wVHlwZSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBgb2JqZWN0YC4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBrZXkgaW4gc2hhcGVUeXBlcykge1xuICAgICAgICB2YXIgY2hlY2tlciA9IHNoYXBlVHlwZXNba2V5XTtcbiAgICAgICAgaWYgKCFjaGVja2VyKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVycm9yID0gY2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlU3RyaWN0U2hhcGVUeXBlQ2hlY2tlcihzaGFwZVR5cGVzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlIGAnICsgcHJvcFR5cGUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYG9iamVjdGAuJykpO1xuICAgICAgfVxuICAgICAgLy8gV2UgbmVlZCB0byBjaGVjayBhbGwga2V5cyBpbiBjYXNlIHNvbWUgYXJlIHJlcXVpcmVkIGJ1dCBtaXNzaW5nIGZyb21cbiAgICAgIC8vIHByb3BzLlxuICAgICAgdmFyIGFsbEtleXMgPSBhc3NpZ24oe30sIHByb3BzW3Byb3BOYW1lXSwgc2hhcGVUeXBlcyk7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gYWxsS2V5cykge1xuICAgICAgICB2YXIgY2hlY2tlciA9IHNoYXBlVHlwZXNba2V5XTtcbiAgICAgICAgaWYgKCFjaGVja2VyKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKFxuICAgICAgICAgICAgJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGtleSBgJyArIGtleSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLicgK1xuICAgICAgICAgICAgJ1xcbkJhZCBvYmplY3Q6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wc1twcm9wTmFtZV0sIG51bGwsICcgICcpICtcbiAgICAgICAgICAgICdcXG5WYWxpZCBrZXlzOiAnICsgIEpTT04uc3RyaW5naWZ5KE9iamVjdC5rZXlzKHNoYXBlVHlwZXMpLCBudWxsLCAnICAnKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVycm9yID0gY2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc05vZGUocHJvcFZhbHVlKSB7XG4gICAgc3dpdGNoICh0eXBlb2YgcHJvcFZhbHVlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIHJldHVybiAhcHJvcFZhbHVlO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiBwcm9wVmFsdWUuZXZlcnkoaXNOb2RlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcFZhbHVlID09PSBudWxsIHx8IGlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihwcm9wVmFsdWUpO1xuICAgICAgICBpZiAoaXRlcmF0b3JGbikge1xuICAgICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChwcm9wVmFsdWUpO1xuICAgICAgICAgIHZhciBzdGVwO1xuICAgICAgICAgIGlmIChpdGVyYXRvckZuICE9PSBwcm9wVmFsdWUuZW50cmllcykge1xuICAgICAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgICAgICBpZiAoIWlzTm9kZShzdGVwLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJdGVyYXRvciB3aWxsIHByb3ZpZGUgZW50cnkgW2ssdl0gdHVwbGVzIHJhdGhlciB0aGFuIHZhbHVlcy5cbiAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc05vZGUoZW50cnlbMV0pKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpIHtcbiAgICAvLyBOYXRpdmUgU3ltYm9sLlxuICAgIGlmIChwcm9wVHlwZSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ10gPT09ICdTeW1ib2wnXG4gICAgaWYgKHByb3BWYWx1ZVsnQEB0b1N0cmluZ1RhZyddID09PSAnU3ltYm9sJykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gRmFsbGJhY2sgZm9yIG5vbi1zcGVjIGNvbXBsaWFudCBTeW1ib2xzIHdoaWNoIGFyZSBwb2x5ZmlsbGVkLlxuICAgIGlmICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHByb3BWYWx1ZSBpbnN0YW5jZW9mIFN5bWJvbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gRXF1aXZhbGVudCBvZiBgdHlwZW9mYCBidXQgd2l0aCBzcGVjaWFsIGhhbmRsaW5nIGZvciBhcnJheSBhbmQgcmVnZXhwLlxuICBmdW5jdGlvbiBnZXRQcm9wVHlwZShwcm9wVmFsdWUpIHtcbiAgICB2YXIgcHJvcFR5cGUgPSB0eXBlb2YgcHJvcFZhbHVlO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgIHJldHVybiAnYXJyYXknO1xuICAgIH1cbiAgICBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAvLyBPbGQgd2Via2l0cyAoYXQgbGVhc3QgdW50aWwgQW5kcm9pZCA0LjApIHJldHVybiAnZnVuY3Rpb24nIHJhdGhlciB0aGFuXG4gICAgICAvLyAnb2JqZWN0JyBmb3IgdHlwZW9mIGEgUmVnRXhwLiBXZSdsbCBub3JtYWxpemUgdGhpcyBoZXJlIHNvIHRoYXQgL2JsYS9cbiAgICAgIC8vIHBhc3NlcyBQcm9wVHlwZXMub2JqZWN0LlxuICAgICAgcmV0dXJuICdvYmplY3QnO1xuICAgIH1cbiAgICBpZiAoaXNTeW1ib2wocHJvcFR5cGUsIHByb3BWYWx1ZSkpIHtcbiAgICAgIHJldHVybiAnc3ltYm9sJztcbiAgICB9XG4gICAgcmV0dXJuIHByb3BUeXBlO1xuICB9XG5cbiAgLy8gVGhpcyBoYW5kbGVzIG1vcmUgdHlwZXMgdGhhbiBgZ2V0UHJvcFR5cGVgLiBPbmx5IHVzZWQgZm9yIGVycm9yIG1lc3NhZ2VzLlxuICAvLyBTZWUgYGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyYC5cbiAgZnVuY3Rpb24gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiBwcm9wVmFsdWUgPT09ICd1bmRlZmluZWQnIHx8IHByb3BWYWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuICcnICsgcHJvcFZhbHVlO1xuICAgIH1cbiAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgIGlmIChwcm9wVHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIHJldHVybiAnZGF0ZSc7XG4gICAgICB9IGVsc2UgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICByZXR1cm4gJ3JlZ2V4cCc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwcm9wVHlwZTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyBwb3N0Zml4ZWQgdG8gYSB3YXJuaW5nIGFib3V0IGFuIGludmFsaWQgdHlwZS5cbiAgLy8gRm9yIGV4YW1wbGUsIFwidW5kZWZpbmVkXCIgb3IgXCJvZiB0eXBlIGFycmF5XCJcbiAgZnVuY3Rpb24gZ2V0UG9zdGZpeEZvclR5cGVXYXJuaW5nKHZhbHVlKSB7XG4gICAgdmFyIHR5cGUgPSBnZXRQcmVjaXNlVHlwZSh2YWx1ZSk7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdhcnJheSc6XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICByZXR1cm4gJ2FuICcgKyB0eXBlO1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgIGNhc2UgJ3JlZ2V4cCc6XG4gICAgICAgIHJldHVybiAnYSAnICsgdHlwZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB0eXBlO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJldHVybnMgY2xhc3MgbmFtZSBvZiB0aGUgb2JqZWN0LCBpZiBhbnkuXG4gIGZ1bmN0aW9uIGdldENsYXNzTmFtZShwcm9wVmFsdWUpIHtcbiAgICBpZiAoIXByb3BWYWx1ZS5jb25zdHJ1Y3RvciB8fCAhcHJvcFZhbHVlLmNvbnN0cnVjdG9yLm5hbWUpIHtcbiAgICAgIHJldHVybiBBTk9OWU1PVVM7XG4gICAgfVxuICAgIHJldHVybiBwcm9wVmFsdWUuY29uc3RydWN0b3IubmFtZTtcbiAgfVxuXG4gIFJlYWN0UHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzID0gY2hlY2tQcm9wVHlwZXM7XG4gIFJlYWN0UHJvcFR5cGVzLlByb3BUeXBlcyA9IFJlYWN0UHJvcFR5cGVzO1xuXG4gIHJldHVybiBSZWFjdFByb3BUeXBlcztcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgIFN5bWJvbC5mb3IgJiZcbiAgICBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykpIHx8XG4gICAgMHhlYWM3O1xuXG4gIHZhciBpc1ZhbGlkRWxlbWVudCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgb2JqZWN0ICE9PSBudWxsICYmXG4gICAgICBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbiAgfTtcblxuICAvLyBCeSBleHBsaWNpdGx5IHVzaW5nIGBwcm9wLXR5cGVzYCB5b3UgYXJlIG9wdGluZyBpbnRvIG5ldyBkZXZlbG9wbWVudCBiZWhhdmlvci5cbiAgLy8gaHR0cDovL2ZiLm1lL3Byb3AtdHlwZXMtaW4tcHJvZFxuICB2YXIgdGhyb3dPbkRpcmVjdEFjY2VzcyA9IHRydWU7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9mYWN0b3J5V2l0aFR5cGVDaGVja2VycycpKGlzVmFsaWRFbGVtZW50LCB0aHJvd09uRGlyZWN0QWNjZXNzKTtcbn0gZWxzZSB7XG4gIC8vIEJ5IGV4cGxpY2l0bHkgdXNpbmcgYHByb3AtdHlwZXNgIHlvdSBhcmUgb3B0aW5nIGludG8gbmV3IHByb2R1Y3Rpb24gYmVoYXZpb3IuXG4gIC8vIGh0dHA6Ly9mYi5tZS9wcm9wLXR5cGVzLWluLXByb2RcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcycpKCk7XG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gJ1NFQ1JFVF9ET19OT1RfUEFTU19USElTX09SX1lPVV9XSUxMX0JFX0ZJUkVEJztcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdFByb3BUeXBlc1NlY3JldDtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID1cbiAgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLmZvciAmJiBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykpIHx8XG4gIDB4ZWFjNztcblxudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eUZ1bmN0aW9uJyk7XG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG52YXIgd2FybmluZyA9IHJlcXVpcmUoJ2ZianMvbGliL3dhcm5pbmcnKTtcblxudmFyIFNFUEFSQVRPUiA9ICcuJztcbnZhciBTVUJTRVBBUkFUT1IgPSAnOic7XG5cbnZhciBkaWRXYXJuQWJvdXRNYXBzID0gZmFsc2U7XG5cbnZhciBJVEVSQVRPUl9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5pdGVyYXRvcjtcbnZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9ICdAQGl0ZXJhdG9yJzsgLy8gQmVmb3JlIFN5bWJvbCBzcGVjLlxuXG5mdW5jdGlvbiBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpIHtcbiAgdmFyIGl0ZXJhdG9yRm4gPVxuICAgIG1heWJlSXRlcmFibGUgJiZcbiAgICAoKElURVJBVE9SX1NZTUJPTCAmJiBtYXliZUl0ZXJhYmxlW0lURVJBVE9SX1NZTUJPTF0pIHx8XG4gICAgICBtYXliZUl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXSk7XG4gIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBpdGVyYXRvckZuO1xuICB9XG59XG5cbmZ1bmN0aW9uIGVzY2FwZShrZXkpIHtcbiAgdmFyIGVzY2FwZVJlZ2V4ID0gL1s9Ol0vZztcbiAgdmFyIGVzY2FwZXJMb29rdXAgPSB7XG4gICAgJz0nOiAnPTAnLFxuICAgICc6JzogJz0yJ1xuICB9O1xuICB2YXIgZXNjYXBlZFN0cmluZyA9ICgnJyArIGtleSkucmVwbGFjZShlc2NhcGVSZWdleCwgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICByZXR1cm4gZXNjYXBlckxvb2t1cFttYXRjaF07XG4gIH0pO1xuXG4gIHJldHVybiAnJCcgKyBlc2NhcGVkU3RyaW5nO1xufVxuXG5mdW5jdGlvbiBnZXRDb21wb25lbnRLZXkoY29tcG9uZW50LCBpbmRleCkge1xuICAvLyBEbyBzb21lIHR5cGVjaGVja2luZyBoZXJlIHNpbmNlIHdlIGNhbGwgdGhpcyBibGluZGx5LiBXZSB3YW50IHRvIGVuc3VyZVxuICAvLyB0aGF0IHdlIGRvbid0IGJsb2NrIHBvdGVudGlhbCBmdXR1cmUgRVMgQVBJcy5cbiAgaWYgKGNvbXBvbmVudCAmJiB0eXBlb2YgY29tcG9uZW50ID09PSAnb2JqZWN0JyAmJiBjb21wb25lbnQua2V5ICE9IG51bGwpIHtcbiAgICAvLyBFeHBsaWNpdCBrZXlcbiAgICByZXR1cm4gZXNjYXBlKGNvbXBvbmVudC5rZXkpO1xuICB9XG4gIC8vIEltcGxpY2l0IGtleSBkZXRlcm1pbmVkIGJ5IHRoZSBpbmRleCBpbiB0aGUgc2V0XG4gIHJldHVybiBpbmRleC50b1N0cmluZygzNik7XG59XG5cbmZ1bmN0aW9uIHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKFxuICBjaGlsZHJlbixcbiAgbmFtZVNvRmFyLFxuICBjYWxsYmFjayxcbiAgdHJhdmVyc2VDb250ZXh0XG4pIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgY2hpbGRyZW47XG5cbiAgaWYgKHR5cGUgPT09ICd1bmRlZmluZWQnIHx8IHR5cGUgPT09ICdib29sZWFuJykge1xuICAgIC8vIEFsbCBvZiB0aGUgYWJvdmUgYXJlIHBlcmNlaXZlZCBhcyBudWxsLlxuICAgIGNoaWxkcmVuID0gbnVsbDtcbiAgfVxuXG4gIGlmIChcbiAgICBjaGlsZHJlbiA9PT0gbnVsbCB8fFxuICAgIHR5cGUgPT09ICdzdHJpbmcnIHx8XG4gICAgdHlwZSA9PT0gJ251bWJlcicgfHxcbiAgICAvLyBUaGUgZm9sbG93aW5nIGlzIGlubGluZWQgZnJvbSBSZWFjdEVsZW1lbnQuIFRoaXMgbWVhbnMgd2UgY2FuIG9wdGltaXplXG4gICAgLy8gc29tZSBjaGVja3MuIFJlYWN0IEZpYmVyIGFsc28gaW5saW5lcyB0aGlzIGxvZ2ljIGZvciBzaW1pbGFyIHB1cnBvc2VzLlxuICAgICh0eXBlID09PSAnb2JqZWN0JyAmJiBjaGlsZHJlbi4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFKVxuICApIHtcbiAgICBjYWxsYmFjayhcbiAgICAgIHRyYXZlcnNlQ29udGV4dCxcbiAgICAgIGNoaWxkcmVuLFxuICAgICAgLy8gSWYgaXQncyB0aGUgb25seSBjaGlsZCwgdHJlYXQgdGhlIG5hbWUgYXMgaWYgaXQgd2FzIHdyYXBwZWQgaW4gYW4gYXJyYXlcbiAgICAgIC8vIHNvIHRoYXQgaXQncyBjb25zaXN0ZW50IGlmIHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gZ3Jvd3MuXG4gICAgICBuYW1lU29GYXIgPT09ICcnID8gU0VQQVJBVE9SICsgZ2V0Q29tcG9uZW50S2V5KGNoaWxkcmVuLCAwKSA6IG5hbWVTb0ZhclxuICAgICk7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICB2YXIgY2hpbGQ7XG4gIHZhciBuZXh0TmFtZTtcbiAgdmFyIHN1YnRyZWVDb3VudCA9IDA7IC8vIENvdW50IG9mIGNoaWxkcmVuIGZvdW5kIGluIHRoZSBjdXJyZW50IHN1YnRyZWUuXG4gIHZhciBuZXh0TmFtZVByZWZpeCA9IG5hbWVTb0ZhciA9PT0gJycgPyBTRVBBUkFUT1IgOiBuYW1lU29GYXIgKyBTVUJTRVBBUkFUT1I7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgIG5leHROYW1lID0gbmV4dE5hbWVQcmVmaXggKyBnZXRDb21wb25lbnRLZXkoY2hpbGQsIGkpO1xuICAgICAgc3VidHJlZUNvdW50ICs9IHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKFxuICAgICAgICBjaGlsZCxcbiAgICAgICAgbmV4dE5hbWUsXG4gICAgICAgIGNhbGxiYWNrLFxuICAgICAgICB0cmF2ZXJzZUNvbnRleHRcbiAgICAgICk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihjaGlsZHJlbik7XG4gICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIC8vIFdhcm4gYWJvdXQgdXNpbmcgTWFwcyBhcyBjaGlsZHJlblxuICAgICAgICBpZiAoaXRlcmF0b3JGbiA9PT0gY2hpbGRyZW4uZW50cmllcykge1xuICAgICAgICAgIHdhcm5pbmcoXG4gICAgICAgICAgICBkaWRXYXJuQWJvdXRNYXBzLFxuICAgICAgICAgICAgJ1VzaW5nIE1hcHMgYXMgY2hpbGRyZW4gaXMgdW5zdXBwb3J0ZWQgYW5kIHdpbGwgbGlrZWx5IHlpZWxkICcgK1xuICAgICAgICAgICAgICAndW5leHBlY3RlZCByZXN1bHRzLiBDb252ZXJ0IGl0IHRvIGEgc2VxdWVuY2UvaXRlcmFibGUgb2Yga2V5ZWQgJyArXG4gICAgICAgICAgICAgICdSZWFjdEVsZW1lbnRzIGluc3RlYWQuJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgZGlkV2FybkFib3V0TWFwcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKGNoaWxkcmVuKTtcbiAgICAgIHZhciBzdGVwO1xuICAgICAgdmFyIGlpID0gMDtcbiAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgY2hpbGQgPSBzdGVwLnZhbHVlO1xuICAgICAgICBuZXh0TmFtZSA9IG5leHROYW1lUHJlZml4ICsgZ2V0Q29tcG9uZW50S2V5KGNoaWxkLCBpaSsrKTtcbiAgICAgICAgc3VidHJlZUNvdW50ICs9IHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKFxuICAgICAgICAgIGNoaWxkLFxuICAgICAgICAgIG5leHROYW1lLFxuICAgICAgICAgIGNhbGxiYWNrLFxuICAgICAgICAgIHRyYXZlcnNlQ29udGV4dFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHZhciBhZGRlbmR1bSA9ICcnO1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgYWRkZW5kdW0gPVxuICAgICAgICAgICcgSWYgeW91IG1lYW50IHRvIHJlbmRlciBhIGNvbGxlY3Rpb24gb2YgY2hpbGRyZW4sIHVzZSBhbiBhcnJheSAnICtcbiAgICAgICAgICAnaW5zdGVhZCBvciB3cmFwIHRoZSBvYmplY3QgdXNpbmcgY3JlYXRlRnJhZ21lbnQob2JqZWN0KSBmcm9tIHRoZSAnICtcbiAgICAgICAgICAnUmVhY3QgYWRkLW9ucy4nO1xuICAgICAgfVxuICAgICAgdmFyIGNoaWxkcmVuU3RyaW5nID0gJycgKyBjaGlsZHJlbjtcbiAgICAgIGludmFyaWFudChcbiAgICAgICAgZmFsc2UsXG4gICAgICAgICdPYmplY3RzIGFyZSBub3QgdmFsaWQgYXMgYSBSZWFjdCBjaGlsZCAoZm91bmQ6ICVzKS4lcycsXG4gICAgICAgIGNoaWxkcmVuU3RyaW5nID09PSAnW29iamVjdCBPYmplY3RdJ1xuICAgICAgICAgID8gJ29iamVjdCB3aXRoIGtleXMgeycgKyBPYmplY3Qua2V5cyhjaGlsZHJlbikuam9pbignLCAnKSArICd9J1xuICAgICAgICAgIDogY2hpbGRyZW5TdHJpbmcsXG4gICAgICAgIGFkZGVuZHVtXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzdWJ0cmVlQ291bnQ7XG59XG5cbmZ1bmN0aW9uIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpIHtcbiAgaWYgKGNoaWxkcmVuID09IG51bGwpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHJldHVybiB0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbChjaGlsZHJlbiwgJycsIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpO1xufVxuXG52YXIgdXNlclByb3ZpZGVkS2V5RXNjYXBlUmVnZXggPSAvXFwvKy9nO1xuZnVuY3Rpb24gZXNjYXBlVXNlclByb3ZpZGVkS2V5KHRleHQpIHtcbiAgcmV0dXJuICgnJyArIHRleHQpLnJlcGxhY2UodXNlclByb3ZpZGVkS2V5RXNjYXBlUmVnZXgsICckJi8nKTtcbn1cblxuZnVuY3Rpb24gY2xvbmVBbmRSZXBsYWNlS2V5KG9sZEVsZW1lbnQsIG5ld0tleSkge1xuICByZXR1cm4gUmVhY3QuY2xvbmVFbGVtZW50KFxuICAgIG9sZEVsZW1lbnQsXG4gICAge2tleTogbmV3S2V5fSxcbiAgICBvbGRFbGVtZW50LnByb3BzICE9PSB1bmRlZmluZWQgPyBvbGRFbGVtZW50LnByb3BzLmNoaWxkcmVuIDogdW5kZWZpbmVkXG4gICk7XG59XG5cbnZhciBERUZBVUxUX1BPT0xfU0laRSA9IDEwO1xudmFyIERFRkFVTFRfUE9PTEVSID0gb25lQXJndW1lbnRQb29sZXI7XG5cbnZhciBvbmVBcmd1bWVudFBvb2xlciA9IGZ1bmN0aW9uKGNvcHlGaWVsZHNGcm9tKSB7XG4gIHZhciBLbGFzcyA9IHRoaXM7XG4gIGlmIChLbGFzcy5pbnN0YW5jZVBvb2wubGVuZ3RoKSB7XG4gICAgdmFyIGluc3RhbmNlID0gS2xhc3MuaW5zdGFuY2VQb29sLnBvcCgpO1xuICAgIEtsYXNzLmNhbGwoaW5zdGFuY2UsIGNvcHlGaWVsZHNGcm9tKTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBLbGFzcyhjb3B5RmllbGRzRnJvbSk7XG4gIH1cbn07XG5cbnZhciBhZGRQb29saW5nVG8gPSBmdW5jdGlvbiBhZGRQb29saW5nVG8oQ29weUNvbnN0cnVjdG9yLCBwb29sZXIpIHtcbiAgLy8gQ2FzdGluZyBhcyBhbnkgc28gdGhhdCBmbG93IGlnbm9yZXMgdGhlIGFjdHVhbCBpbXBsZW1lbnRhdGlvbiBhbmQgdHJ1c3RzXG4gIC8vIGl0IHRvIG1hdGNoIHRoZSB0eXBlIHdlIGRlY2xhcmVkXG4gIHZhciBOZXdLbGFzcyA9IENvcHlDb25zdHJ1Y3RvcjtcbiAgTmV3S2xhc3MuaW5zdGFuY2VQb29sID0gW107XG4gIE5ld0tsYXNzLmdldFBvb2xlZCA9IHBvb2xlciB8fCBERUZBVUxUX1BPT0xFUjtcbiAgaWYgKCFOZXdLbGFzcy5wb29sU2l6ZSkge1xuICAgIE5ld0tsYXNzLnBvb2xTaXplID0gREVGQVVMVF9QT09MX1NJWkU7XG4gIH1cbiAgTmV3S2xhc3MucmVsZWFzZSA9IHN0YW5kYXJkUmVsZWFzZXI7XG4gIHJldHVybiBOZXdLbGFzcztcbn07XG5cbnZhciBzdGFuZGFyZFJlbGVhc2VyID0gZnVuY3Rpb24gc3RhbmRhcmRSZWxlYXNlcihpbnN0YW5jZSkge1xuICB2YXIgS2xhc3MgPSB0aGlzO1xuICBpbnZhcmlhbnQoXG4gICAgaW5zdGFuY2UgaW5zdGFuY2VvZiBLbGFzcyxcbiAgICAnVHJ5aW5nIHRvIHJlbGVhc2UgYW4gaW5zdGFuY2UgaW50byBhIHBvb2wgb2YgYSBkaWZmZXJlbnQgdHlwZS4nXG4gICk7XG4gIGluc3RhbmNlLmRlc3RydWN0b3IoKTtcbiAgaWYgKEtsYXNzLmluc3RhbmNlUG9vbC5sZW5ndGggPCBLbGFzcy5wb29sU2l6ZSkge1xuICAgIEtsYXNzLmluc3RhbmNlUG9vbC5wdXNoKGluc3RhbmNlKTtcbiAgfVxufTtcblxudmFyIGZvdXJBcmd1bWVudFBvb2xlciA9IGZ1bmN0aW9uIGZvdXJBcmd1bWVudFBvb2xlcihhMSwgYTIsIGEzLCBhNCkge1xuICB2YXIgS2xhc3MgPSB0aGlzO1xuICBpZiAoS2xhc3MuaW5zdGFuY2VQb29sLmxlbmd0aCkge1xuICAgIHZhciBpbnN0YW5jZSA9IEtsYXNzLmluc3RhbmNlUG9vbC5wb3AoKTtcbiAgICBLbGFzcy5jYWxsKGluc3RhbmNlLCBhMSwgYTIsIGEzLCBhNCk7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgS2xhc3MoYTEsIGEyLCBhMywgYTQpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBNYXBCb29rS2VlcGluZyhtYXBSZXN1bHQsIGtleVByZWZpeCwgbWFwRnVuY3Rpb24sIG1hcENvbnRleHQpIHtcbiAgdGhpcy5yZXN1bHQgPSBtYXBSZXN1bHQ7XG4gIHRoaXMua2V5UHJlZml4ID0ga2V5UHJlZml4O1xuICB0aGlzLmZ1bmMgPSBtYXBGdW5jdGlvbjtcbiAgdGhpcy5jb250ZXh0ID0gbWFwQ29udGV4dDtcbiAgdGhpcy5jb3VudCA9IDA7XG59XG5NYXBCb29rS2VlcGluZy5wcm90b3R5cGUuZGVzdHJ1Y3RvciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnJlc3VsdCA9IG51bGw7XG4gIHRoaXMua2V5UHJlZml4ID0gbnVsbDtcbiAgdGhpcy5mdW5jID0gbnVsbDtcbiAgdGhpcy5jb250ZXh0ID0gbnVsbDtcbiAgdGhpcy5jb3VudCA9IDA7XG59O1xuYWRkUG9vbGluZ1RvKE1hcEJvb2tLZWVwaW5nLCBmb3VyQXJndW1lbnRQb29sZXIpO1xuXG5mdW5jdGlvbiBtYXBTaW5nbGVDaGlsZEludG9Db250ZXh0KGJvb2tLZWVwaW5nLCBjaGlsZCwgY2hpbGRLZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGJvb2tLZWVwaW5nLnJlc3VsdDtcbiAgdmFyIGtleVByZWZpeCA9IGJvb2tLZWVwaW5nLmtleVByZWZpeDtcbiAgdmFyIGZ1bmMgPSBib29rS2VlcGluZy5mdW5jO1xuICB2YXIgY29udGV4dCA9IGJvb2tLZWVwaW5nLmNvbnRleHQ7XG5cbiAgdmFyIG1hcHBlZENoaWxkID0gZnVuYy5jYWxsKGNvbnRleHQsIGNoaWxkLCBib29rS2VlcGluZy5jb3VudCsrKTtcbiAgaWYgKEFycmF5LmlzQXJyYXkobWFwcGVkQ2hpbGQpKSB7XG4gICAgbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChcbiAgICAgIG1hcHBlZENoaWxkLFxuICAgICAgcmVzdWx0LFxuICAgICAgY2hpbGRLZXksXG4gICAgICBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zQXJndW1lbnRcbiAgICApO1xuICB9IGVsc2UgaWYgKG1hcHBlZENoaWxkICE9IG51bGwpIHtcbiAgICBpZiAoUmVhY3QuaXNWYWxpZEVsZW1lbnQobWFwcGVkQ2hpbGQpKSB7XG4gICAgICBtYXBwZWRDaGlsZCA9IGNsb25lQW5kUmVwbGFjZUtleShcbiAgICAgICAgbWFwcGVkQ2hpbGQsXG4gICAgICAgIC8vIEtlZXAgYm90aCB0aGUgKG1hcHBlZCkgYW5kIG9sZCBrZXlzIGlmIHRoZXkgZGlmZmVyLCBqdXN0IGFzXG4gICAgICAgIC8vIHRyYXZlcnNlQWxsQ2hpbGRyZW4gdXNlZCB0byBkbyBmb3Igb2JqZWN0cyBhcyBjaGlsZHJlblxuICAgICAgICBrZXlQcmVmaXggK1xuICAgICAgICAgIChtYXBwZWRDaGlsZC5rZXkgJiYgKCFjaGlsZCB8fCBjaGlsZC5rZXkgIT09IG1hcHBlZENoaWxkLmtleSlcbiAgICAgICAgICAgID8gZXNjYXBlVXNlclByb3ZpZGVkS2V5KG1hcHBlZENoaWxkLmtleSkgKyAnLydcbiAgICAgICAgICAgIDogJycpICtcbiAgICAgICAgICBjaGlsZEtleVxuICAgICAgKTtcbiAgICB9XG4gICAgcmVzdWx0LnB1c2gobWFwcGVkQ2hpbGQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWwoY2hpbGRyZW4sIGFycmF5LCBwcmVmaXgsIGZ1bmMsIGNvbnRleHQpIHtcbiAgdmFyIGVzY2FwZWRQcmVmaXggPSAnJztcbiAgaWYgKHByZWZpeCAhPSBudWxsKSB7XG4gICAgZXNjYXBlZFByZWZpeCA9IGVzY2FwZVVzZXJQcm92aWRlZEtleShwcmVmaXgpICsgJy8nO1xuICB9XG4gIHZhciB0cmF2ZXJzZUNvbnRleHQgPSBNYXBCb29rS2VlcGluZy5nZXRQb29sZWQoXG4gICAgYXJyYXksXG4gICAgZXNjYXBlZFByZWZpeCxcbiAgICBmdW5jLFxuICAgIGNvbnRleHRcbiAgKTtcbiAgdHJhdmVyc2VBbGxDaGlsZHJlbihjaGlsZHJlbiwgbWFwU2luZ2xlQ2hpbGRJbnRvQ29udGV4dCwgdHJhdmVyc2VDb250ZXh0KTtcbiAgTWFwQm9va0tlZXBpbmcucmVsZWFzZSh0cmF2ZXJzZUNvbnRleHQpO1xufVxuXG52YXIgbnVtZXJpY1Byb3BlcnR5UmVnZXggPSAvXlxcZCskLztcblxudmFyIHdhcm5lZEFib3V0TnVtZXJpYyA9IGZhbHNlO1xuXG5mdW5jdGlvbiBjcmVhdGVSZWFjdEZyYWdtZW50KG9iamVjdCkge1xuICBpZiAodHlwZW9mIG9iamVjdCAhPT0gJ29iamVjdCcgfHwgIW9iamVjdCB8fCBBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcbiAgICB3YXJuaW5nKFxuICAgICAgZmFsc2UsXG4gICAgICAnUmVhY3QuYWRkb25zLmNyZWF0ZUZyYWdtZW50IG9ubHkgYWNjZXB0cyBhIHNpbmdsZSBvYmplY3QuIEdvdDogJXMnLFxuICAgICAgb2JqZWN0XG4gICAgKTtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG4gIGlmIChSZWFjdC5pc1ZhbGlkRWxlbWVudChvYmplY3QpKSB7XG4gICAgd2FybmluZyhcbiAgICAgIGZhbHNlLFxuICAgICAgJ1JlYWN0LmFkZG9ucy5jcmVhdGVGcmFnbWVudCBkb2VzIG5vdCBhY2NlcHQgYSBSZWFjdEVsZW1lbnQgJyArXG4gICAgICAgICd3aXRob3V0IGEgd3JhcHBlciBvYmplY3QuJ1xuICAgICk7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIGludmFyaWFudChcbiAgICBvYmplY3Qubm9kZVR5cGUgIT09IDEsXG4gICAgJ1JlYWN0LmFkZG9ucy5jcmVhdGVGcmFnbWVudCguLi4pOiBFbmNvdW50ZXJlZCBhbiBpbnZhbGlkIGNoaWxkOyBET00gJyArXG4gICAgICAnZWxlbWVudHMgYXJlIG5vdCB2YWxpZCBjaGlsZHJlbiBvZiBSZWFjdCBjb21wb25lbnRzLidcbiAgKTtcblxuICB2YXIgcmVzdWx0ID0gW107XG5cbiAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBpZiAoIXdhcm5lZEFib3V0TnVtZXJpYyAmJiBudW1lcmljUHJvcGVydHlSZWdleC50ZXN0KGtleSkpIHtcbiAgICAgICAgd2FybmluZyhcbiAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAnUmVhY3QuYWRkb25zLmNyZWF0ZUZyYWdtZW50KC4uLik6IENoaWxkIG9iamVjdHMgc2hvdWxkIGhhdmUgJyArXG4gICAgICAgICAgICAnbm9uLW51bWVyaWMga2V5cyBzbyBvcmRlcmluZyBpcyBwcmVzZXJ2ZWQuJ1xuICAgICAgICApO1xuICAgICAgICB3YXJuZWRBYm91dE51bWVyaWMgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKFxuICAgICAgb2JqZWN0W2tleV0sXG4gICAgICByZXN1bHQsXG4gICAgICBrZXksXG4gICAgICBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zQXJndW1lbnRcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVSZWFjdEZyYWdtZW50O1xuIiwiLyoqIEBsaWNlbnNlIFJlYWN0IHYxNi43LjBcbiAqIHJlYWN0LmRldmVsb3BtZW50LmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5cblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBfYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xudmFyIGNoZWNrUHJvcFR5cGVzID0gcmVxdWlyZSgncHJvcC10eXBlcy9jaGVja1Byb3BUeXBlcycpO1xuXG4vLyBUT0RPOiB0aGlzIGlzIHNwZWNpYWwgYmVjYXVzZSBpdCBnZXRzIGltcG9ydGVkIGR1cmluZyBidWlsZC5cblxudmFyIFJlYWN0VmVyc2lvbiA9ICcxNi43LjAnO1xuXG4vLyBUaGUgU3ltYm9sIHVzZWQgdG8gdGFnIHRoZSBSZWFjdEVsZW1lbnQtbGlrZSB0eXBlcy4gSWYgdGhlcmUgaXMgbm8gbmF0aXZlIFN5bWJvbFxuLy8gbm9yIHBvbHlmaWxsLCB0aGVuIGEgcGxhaW4gbnVtYmVyIGlzIHVzZWQgZm9yIHBlcmZvcm1hbmNlLlxudmFyIGhhc1N5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLmZvcjtcblxudmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSA6IDB4ZWFjNztcbnZhciBSRUFDVF9QT1JUQUxfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnBvcnRhbCcpIDogMHhlYWNhO1xudmFyIFJFQUNUX0ZSQUdNRU5UX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5mcmFnbWVudCcpIDogMHhlYWNiO1xudmFyIFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5zdHJpY3RfbW9kZScpIDogMHhlYWNjO1xudmFyIFJFQUNUX1BST0ZJTEVSX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5wcm9maWxlcicpIDogMHhlYWQyO1xudmFyIFJFQUNUX1BST1ZJREVSX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5wcm92aWRlcicpIDogMHhlYWNkO1xudmFyIFJFQUNUX0NPTlRFWFRfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmNvbnRleHQnKSA6IDB4ZWFjZTtcblxudmFyIFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuY29uY3VycmVudF9tb2RlJykgOiAweGVhY2Y7XG52YXIgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmZvcndhcmRfcmVmJykgOiAweGVhZDA7XG52YXIgUkVBQ1RfU1VTUEVOU0VfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnN1c3BlbnNlJykgOiAweGVhZDE7XG52YXIgUkVBQ1RfTUVNT19UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QubWVtbycpIDogMHhlYWQzO1xudmFyIFJFQUNUX0xBWllfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmxhenknKSA6IDB4ZWFkNDtcblxudmFyIE1BWUJFX0lURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xudmFyIEZBVVhfSVRFUkFUT1JfU1lNQk9MID0gJ0BAaXRlcmF0b3InO1xuXG5mdW5jdGlvbiBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpIHtcbiAgaWYgKG1heWJlSXRlcmFibGUgPT09IG51bGwgfHwgdHlwZW9mIG1heWJlSXRlcmFibGUgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmFyIG1heWJlSXRlcmF0b3IgPSBNQVlCRV9JVEVSQVRPUl9TWU1CT0wgJiYgbWF5YmVJdGVyYWJsZVtNQVlCRV9JVEVSQVRPUl9TWU1CT0xdIHx8IG1heWJlSXRlcmFibGVbRkFVWF9JVEVSQVRPUl9TWU1CT0xdO1xuICBpZiAodHlwZW9mIG1heWJlSXRlcmF0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gbWF5YmVJdGVyYXRvcjtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxudmFyIGVuYWJsZUhvb2tzID0gZmFsc2U7XG4vLyBIZWxwcyBpZGVudGlmeSBzaWRlIGVmZmVjdHMgaW4gYmVnaW4tcGhhc2UgbGlmZWN5Y2xlIGhvb2tzIGFuZCBzZXRTdGF0ZSByZWR1Y2VyczpcblxuXG4vLyBJbiBzb21lIGNhc2VzLCBTdHJpY3RNb2RlIHNob3VsZCBhbHNvIGRvdWJsZS1yZW5kZXIgbGlmZWN5Y2xlcy5cbi8vIFRoaXMgY2FuIGJlIGNvbmZ1c2luZyBmb3IgdGVzdHMgdGhvdWdoLFxuLy8gQW5kIGl0IGNhbiBiZSBiYWQgZm9yIHBlcmZvcm1hbmNlIGluIHByb2R1Y3Rpb24uXG4vLyBUaGlzIGZlYXR1cmUgZmxhZyBjYW4gYmUgdXNlZCB0byBjb250cm9sIHRoZSBiZWhhdmlvcjpcblxuXG4vLyBUbyBwcmVzZXJ2ZSB0aGUgXCJQYXVzZSBvbiBjYXVnaHQgZXhjZXB0aW9uc1wiIGJlaGF2aW9yIG9mIHRoZSBkZWJ1Z2dlciwgd2Vcbi8vIHJlcGxheSB0aGUgYmVnaW4gcGhhc2Ugb2YgYSBmYWlsZWQgY29tcG9uZW50IGluc2lkZSBpbnZva2VHdWFyZGVkQ2FsbGJhY2suXG5cblxuLy8gV2FybiBhYm91dCBkZXByZWNhdGVkLCBhc3luYy11bnNhZmUgbGlmZWN5Y2xlczsgcmVsYXRlcyB0byBSRkMgIzY6XG5cblxuLy8gR2F0aGVyIGFkdmFuY2VkIHRpbWluZyBtZXRyaWNzIGZvciBQcm9maWxlciBzdWJ0cmVlcy5cblxuXG4vLyBUcmFjZSB3aGljaCBpbnRlcmFjdGlvbnMgdHJpZ2dlciBlYWNoIGNvbW1pdC5cblxuXG4vLyBPbmx5IHVzZWQgaW4gd3d3IGJ1aWxkcy5cbiAvLyBUT0RPOiB0cnVlPyBIZXJlIGl0IG1pZ2h0IGp1c3QgYmUgZmFsc2UuXG5cbi8vIE9ubHkgdXNlZCBpbiB3d3cgYnVpbGRzLlxuXG5cbi8vIE9ubHkgdXNlZCBpbiB3d3cgYnVpbGRzLlxuXG5cbi8vIFJlYWN0IEZpcmU6IHByZXZlbnQgdGhlIHZhbHVlIGFuZCBjaGVja2VkIGF0dHJpYnV0ZXMgZnJvbSBzeW5jaW5nXG4vLyB3aXRoIHRoZWlyIHJlbGF0ZWQgRE9NIHByb3BlcnRpZXNcblxuXG4vLyBUaGVzZSBBUElzIHdpbGwgbm8gbG9uZ2VyIGJlIFwidW5zdGFibGVcIiBpbiB0aGUgdXBjb21pbmcgMTYuNyByZWxlYXNlLFxuLy8gQ29udHJvbCB0aGlzIGJlaGF2aW9yIHdpdGggYSBmbGFnIHRvIHN1cHBvcnQgMTYuNiBtaW5vciByZWxlYXNlcyBpbiB0aGUgbWVhbndoaWxlLlxudmFyIGVuYWJsZVN0YWJsZUNvbmN1cnJlbnRNb2RlQVBJcyA9IGZhbHNlO1xuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG52YXIgdmFsaWRhdGVGb3JtYXQgPSBmdW5jdGlvbiAoKSB7fTtcblxue1xuICB2YWxpZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGludmFyaWFudChjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpO1xuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yID0gdm9pZCAwO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgKyAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KSk7XG4gICAgICBlcnJvci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG4vLyBSZWx5aW5nIG9uIHRoZSBgaW52YXJpYW50KClgIGltcGxlbWVudGF0aW9uIGxldHMgdXNcbi8vIHByZXNlcnZlIHRoZSBmb3JtYXQgYW5kIHBhcmFtcyBpbiB0aGUgd3d3IGJ1aWxkcy5cblxuLyoqXG4gKiBGb3JrZWQgZnJvbSBmYmpzL3dhcm5pbmc6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svZmJqcy9ibG9iL2U2NmJhMjBhZDViZTQzM2ViNTQ0MjNmMmIwOTdkODI5MzI0ZDlkZTYvcGFja2FnZXMvZmJqcy9zcmMvX19mb3Jrc19fL3dhcm5pbmcuanNcbiAqXG4gKiBPbmx5IGNoYW5nZSBpcyB3ZSB1c2UgY29uc29sZS53YXJuIGluc3RlYWQgb2YgY29uc29sZS5lcnJvcixcbiAqIGFuZCBkbyBub3RoaW5nIHdoZW4gJ2NvbnNvbGUnIGlzIG5vdCBzdXBwb3J0ZWQuXG4gKiBUaGlzIHJlYWxseSBzaW1wbGlmaWVzIHRoZSBjb2RlLlxuICogLS0tXG4gKiBTaW1pbGFyIHRvIGludmFyaWFudCBidXQgb25seSBsb2dzIGEgd2FybmluZyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXQuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGxvZyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzIGluIGNyaXRpY2FsXG4gKiBwYXRocy4gUmVtb3ZpbmcgdGhlIGxvZ2dpbmcgY29kZSBmb3IgcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMgd2lsbCBrZWVwIHRoZVxuICogc2FtZSBsb2dpYyBhbmQgZm9sbG93IHRoZSBzYW1lIGNvZGUgcGF0aHMuXG4gKi9cblxudmFyIGxvd1ByaW9yaXR5V2FybmluZyA9IGZ1bmN0aW9uICgpIHt9O1xuXG57XG4gIHZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9IGNhdGNoICh4KSB7fVxuICB9O1xuXG4gIGxvd1ByaW9yaXR5V2FybmluZyA9IGZ1bmN0aW9uIChjb25kaXRpb24sIGZvcm1hdCkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgbG93UHJpb3JpdHlXYXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0LCAuLi5hcmdzKWAgcmVxdWlyZXMgYSB3YXJuaW5nICcgKyAnbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgICBpZiAoIWNvbmRpdGlvbikge1xuICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAyID8gX2xlbjIgLSAyIDogMCksIF9rZXkyID0gMjsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICBhcmdzW19rZXkyIC0gMl0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgfVxuXG4gICAgICBwcmludFdhcm5pbmcuYXBwbHkodW5kZWZpbmVkLCBbZm9ybWF0XS5jb25jYXQoYXJncykpO1xuICAgIH1cbiAgfTtcbn1cblxudmFyIGxvd1ByaW9yaXR5V2FybmluZyQxID0gbG93UHJpb3JpdHlXYXJuaW5nO1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gaW52YXJpYW50IGJ1dCBvbmx5IGxvZ3MgYSB3YXJuaW5nIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IG1ldC5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbG9nIGlzc3VlcyBpbiBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMgaW4gY3JpdGljYWxcbiAqIHBhdGhzLiBSZW1vdmluZyB0aGUgbG9nZ2luZyBjb2RlIGZvciBwcm9kdWN0aW9uIGVudmlyb25tZW50cyB3aWxsIGtlZXAgdGhlXG4gKiBzYW1lIGxvZ2ljIGFuZCBmb2xsb3cgdGhlIHNhbWUgY29kZSBwYXRocy5cbiAqL1xuXG52YXIgd2FybmluZ1dpdGhvdXRTdGFjayA9IGZ1bmN0aW9uICgpIHt9O1xuXG57XG4gIHdhcm5pbmdXaXRob3V0U3RhY2sgPSBmdW5jdGlvbiAoY29uZGl0aW9uLCBmb3JtYXQpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAyID8gX2xlbiAtIDIgOiAwKSwgX2tleSA9IDI7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgd2FybmluZ1dpdGhvdXRTdGFjayhjb25kaXRpb24sIGZvcm1hdCwgLi4uYXJncylgIHJlcXVpcmVzIGEgd2FybmluZyAnICsgJ21lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gICAgaWYgKGFyZ3MubGVuZ3RoID4gOCkge1xuICAgICAgLy8gQ2hlY2sgYmVmb3JlIHRoZSBjb25kaXRpb24gdG8gY2F0Y2ggdmlvbGF0aW9ucyBlYXJseS5cbiAgICAgIHRocm93IG5ldyBFcnJvcignd2FybmluZ1dpdGhvdXRTdGFjaygpIGN1cnJlbnRseSBzdXBwb3J0cyBhdCBtb3N0IDggYXJndW1lbnRzLicpO1xuICAgIH1cbiAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHZhciBhcmdzV2l0aEZvcm1hdCA9IGFyZ3MubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiAnJyArIGl0ZW07XG4gICAgICB9KTtcbiAgICAgIGFyZ3NXaXRoRm9ybWF0LnVuc2hpZnQoJ1dhcm5pbmc6ICcgKyBmb3JtYXQpO1xuXG4gICAgICAvLyBXZSBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBzcHJlYWQgKG9yIC5hcHBseSkgZGlyZWN0bHkgYmVjYXVzZSBpdFxuICAgICAgLy8gYnJlYWtzIElFOTogaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8xMzYxMFxuICAgICAgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZS5lcnJvciwgY29uc29sZSwgYXJnc1dpdGhGb3JtYXQpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICsgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9IGNhdGNoICh4KSB7fVxuICB9O1xufVxuXG52YXIgd2FybmluZ1dpdGhvdXRTdGFjayQxID0gd2FybmluZ1dpdGhvdXRTdGFjaztcblxudmFyIGRpZFdhcm5TdGF0ZVVwZGF0ZUZvclVubW91bnRlZENvbXBvbmVudCA9IHt9O1xuXG5mdW5jdGlvbiB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgY2FsbGVyTmFtZSkge1xuICB7XG4gICAgdmFyIF9jb25zdHJ1Y3RvciA9IHB1YmxpY0luc3RhbmNlLmNvbnN0cnVjdG9yO1xuICAgIHZhciBjb21wb25lbnROYW1lID0gX2NvbnN0cnVjdG9yICYmIChfY29uc3RydWN0b3IuZGlzcGxheU5hbWUgfHwgX2NvbnN0cnVjdG9yLm5hbWUpIHx8ICdSZWFjdENsYXNzJztcbiAgICB2YXIgd2FybmluZ0tleSA9IGNvbXBvbmVudE5hbWUgKyAnLicgKyBjYWxsZXJOYW1lO1xuICAgIGlmIChkaWRXYXJuU3RhdGVVcGRhdGVGb3JVbm1vdW50ZWRDb21wb25lbnRbd2FybmluZ0tleV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCBcIkNhbid0IGNhbGwgJXMgb24gYSBjb21wb25lbnQgdGhhdCBpcyBub3QgeWV0IG1vdW50ZWQuIFwiICsgJ1RoaXMgaXMgYSBuby1vcCwgYnV0IGl0IG1pZ2h0IGluZGljYXRlIGEgYnVnIGluIHlvdXIgYXBwbGljYXRpb24uICcgKyAnSW5zdGVhZCwgYXNzaWduIHRvIGB0aGlzLnN0YXRlYCBkaXJlY3RseSBvciBkZWZpbmUgYSBgc3RhdGUgPSB7fTtgICcgKyAnY2xhc3MgcHJvcGVydHkgd2l0aCB0aGUgZGVzaXJlZCBzdGF0ZSBpbiB0aGUgJXMgY29tcG9uZW50LicsIGNhbGxlck5hbWUsIGNvbXBvbmVudE5hbWUpO1xuICAgIGRpZFdhcm5TdGF0ZVVwZGF0ZUZvclVubW91bnRlZENvbXBvbmVudFt3YXJuaW5nS2V5XSA9IHRydWU7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBhYnN0cmFjdCBBUEkgZm9yIGFuIHVwZGF0ZSBxdWV1ZS5cbiAqL1xudmFyIFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlID0ge1xuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgb3Igbm90IHRoaXMgY29tcG9zaXRlIGNvbXBvbmVudCBpcyBtb3VudGVkLlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB3ZSB3YW50IHRvIHRlc3QuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgbW91bnRlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKiBAcHJvdGVjdGVkXG4gICAqIEBmaW5hbFxuICAgKi9cbiAgaXNNb3VudGVkOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZvcmNlcyBhbiB1cGRhdGUuIFRoaXMgc2hvdWxkIG9ubHkgYmUgaW52b2tlZCB3aGVuIGl0IGlzIGtub3duIHdpdGhcbiAgICogY2VydGFpbnR5IHRoYXQgd2UgYXJlICoqbm90KiogaW4gYSBET00gdHJhbnNhY3Rpb24uXG4gICAqXG4gICAqIFlvdSBtYXkgd2FudCB0byBjYWxsIHRoaXMgd2hlbiB5b3Uga25vdyB0aGF0IHNvbWUgZGVlcGVyIGFzcGVjdCBvZiB0aGVcbiAgICogY29tcG9uZW50J3Mgc3RhdGUgaGFzIGNoYW5nZWQgYnV0IGBzZXRTdGF0ZWAgd2FzIG5vdCBjYWxsZWQuXG4gICAqXG4gICAqIFRoaXMgd2lsbCBub3QgaW52b2tlIGBzaG91bGRDb21wb25lbnRVcGRhdGVgLCBidXQgaXQgd2lsbCBpbnZva2VcbiAgICogYGNvbXBvbmVudFdpbGxVcGRhdGVgIGFuZCBgY29tcG9uZW50RGlkVXBkYXRlYC5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBzaG91bGQgcmVyZW5kZXIuXG4gICAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgY29tcG9uZW50IGlzIHVwZGF0ZWQuXG4gICAqIEBwYXJhbSB7P3N0cmluZ30gY2FsbGVyTmFtZSBuYW1lIG9mIHRoZSBjYWxsaW5nIGZ1bmN0aW9uIGluIHRoZSBwdWJsaWMgQVBJLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGVucXVldWVGb3JjZVVwZGF0ZTogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlLCBjYWxsYmFjaywgY2FsbGVyTmFtZSkge1xuICAgIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCAnZm9yY2VVcGRhdGUnKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVwbGFjZXMgYWxsIG9mIHRoZSBzdGF0ZS4gQWx3YXlzIHVzZSB0aGlzIG9yIGBzZXRTdGF0ZWAgdG8gbXV0YXRlIHN0YXRlLlxuICAgKiBZb3Ugc2hvdWxkIHRyZWF0IGB0aGlzLnN0YXRlYCBhcyBpbW11dGFibGUuXG4gICAqXG4gICAqIFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGB0aGlzLnN0YXRlYCB3aWxsIGJlIGltbWVkaWF0ZWx5IHVwZGF0ZWQsIHNvXG4gICAqIGFjY2Vzc2luZyBgdGhpcy5zdGF0ZWAgYWZ0ZXIgY2FsbGluZyB0aGlzIG1ldGhvZCBtYXkgcmV0dXJuIHRoZSBvbGQgdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHRoYXQgc2hvdWxkIHJlcmVuZGVyLlxuICAgKiBAcGFyYW0ge29iamVjdH0gY29tcGxldGVTdGF0ZSBOZXh0IHN0YXRlLlxuICAgKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIGNvbXBvbmVudCBpcyB1cGRhdGVkLlxuICAgKiBAcGFyYW0gez9zdHJpbmd9IGNhbGxlck5hbWUgbmFtZSBvZiB0aGUgY2FsbGluZyBmdW5jdGlvbiBpbiB0aGUgcHVibGljIEFQSS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBlbnF1ZXVlUmVwbGFjZVN0YXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UsIGNvbXBsZXRlU3RhdGUsIGNhbGxiYWNrLCBjYWxsZXJOYW1lKSB7XG4gICAgd2Fybk5vb3AocHVibGljSW5zdGFuY2UsICdyZXBsYWNlU3RhdGUnKTtcbiAgfSxcblxuICAvKipcbiAgICogU2V0cyBhIHN1YnNldCBvZiB0aGUgc3RhdGUuIFRoaXMgb25seSBleGlzdHMgYmVjYXVzZSBfcGVuZGluZ1N0YXRlIGlzXG4gICAqIGludGVybmFsLiBUaGlzIHByb3ZpZGVzIGEgbWVyZ2luZyBzdHJhdGVneSB0aGF0IGlzIG5vdCBhdmFpbGFibGUgdG8gZGVlcFxuICAgKiBwcm9wZXJ0aWVzIHdoaWNoIGlzIGNvbmZ1c2luZy4gVE9ETzogRXhwb3NlIHBlbmRpbmdTdGF0ZSBvciBkb24ndCB1c2UgaXRcbiAgICogZHVyaW5nIHRoZSBtZXJnZS5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBzaG91bGQgcmVyZW5kZXIuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJ0aWFsU3RhdGUgTmV4dCBwYXJ0aWFsIHN0YXRlIHRvIGJlIG1lcmdlZCB3aXRoIHN0YXRlLlxuICAgKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIGNvbXBvbmVudCBpcyB1cGRhdGVkLlxuICAgKiBAcGFyYW0gez9zdHJpbmd9IE5hbWUgb2YgdGhlIGNhbGxpbmcgZnVuY3Rpb24gaW4gdGhlIHB1YmxpYyBBUEkuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZW5xdWV1ZVNldFN0YXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UsIHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2ssIGNhbGxlck5hbWUpIHtcbiAgICB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgJ3NldFN0YXRlJyk7XG4gIH1cbn07XG5cbnZhciBlbXB0eU9iamVjdCA9IHt9O1xue1xuICBPYmplY3QuZnJlZXplKGVtcHR5T2JqZWN0KTtcbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGhlbHBlcnMgZm9yIHRoZSB1cGRhdGluZyBzdGF0ZSBvZiBhIGNvbXBvbmVudC5cbiAqL1xuZnVuY3Rpb24gQ29tcG9uZW50KHByb3BzLCBjb250ZXh0LCB1cGRhdGVyKSB7XG4gIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgLy8gSWYgYSBjb21wb25lbnQgaGFzIHN0cmluZyByZWZzLCB3ZSB3aWxsIGFzc2lnbiBhIGRpZmZlcmVudCBvYmplY3QgbGF0ZXIuXG4gIHRoaXMucmVmcyA9IGVtcHR5T2JqZWN0O1xuICAvLyBXZSBpbml0aWFsaXplIHRoZSBkZWZhdWx0IHVwZGF0ZXIgYnV0IHRoZSByZWFsIG9uZSBnZXRzIGluamVjdGVkIGJ5IHRoZVxuICAvLyByZW5kZXJlci5cbiAgdGhpcy51cGRhdGVyID0gdXBkYXRlciB8fCBSZWFjdE5vb3BVcGRhdGVRdWV1ZTtcbn1cblxuQ29tcG9uZW50LnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50ID0ge307XG5cbi8qKlxuICogU2V0cyBhIHN1YnNldCBvZiB0aGUgc3RhdGUuIEFsd2F5cyB1c2UgdGhpcyB0byBtdXRhdGVcbiAqIHN0YXRlLiBZb3Ugc2hvdWxkIHRyZWF0IGB0aGlzLnN0YXRlYCBhcyBpbW11dGFibGUuXG4gKlxuICogVGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgYHRoaXMuc3RhdGVgIHdpbGwgYmUgaW1tZWRpYXRlbHkgdXBkYXRlZCwgc29cbiAqIGFjY2Vzc2luZyBgdGhpcy5zdGF0ZWAgYWZ0ZXIgY2FsbGluZyB0aGlzIG1ldGhvZCBtYXkgcmV0dXJuIHRoZSBvbGQgdmFsdWUuXG4gKlxuICogVGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgY2FsbHMgdG8gYHNldFN0YXRlYCB3aWxsIHJ1biBzeW5jaHJvbm91c2x5LFxuICogYXMgdGhleSBtYXkgZXZlbnR1YWxseSBiZSBiYXRjaGVkIHRvZ2V0aGVyLiAgWW91IGNhbiBwcm92aWRlIGFuIG9wdGlvbmFsXG4gKiBjYWxsYmFjayB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgd2hlbiB0aGUgY2FsbCB0byBzZXRTdGF0ZSBpcyBhY3R1YWxseVxuICogY29tcGxldGVkLlxuICpcbiAqIFdoZW4gYSBmdW5jdGlvbiBpcyBwcm92aWRlZCB0byBzZXRTdGF0ZSwgaXQgd2lsbCBiZSBjYWxsZWQgYXQgc29tZSBwb2ludCBpblxuICogdGhlIGZ1dHVyZSAobm90IHN5bmNocm9ub3VzbHkpLiBJdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSB1cCB0byBkYXRlXG4gKiBjb21wb25lbnQgYXJndW1lbnRzIChzdGF0ZSwgcHJvcHMsIGNvbnRleHQpLiBUaGVzZSB2YWx1ZXMgY2FuIGJlIGRpZmZlcmVudFxuICogZnJvbSB0aGlzLiogYmVjYXVzZSB5b3VyIGZ1bmN0aW9uIG1heSBiZSBjYWxsZWQgYWZ0ZXIgcmVjZWl2ZVByb3BzIGJ1dCBiZWZvcmVcbiAqIHNob3VsZENvbXBvbmVudFVwZGF0ZSwgYW5kIHRoaXMgbmV3IHN0YXRlLCBwcm9wcywgYW5kIGNvbnRleHQgd2lsbCBub3QgeWV0IGJlXG4gKiBhc3NpZ25lZCB0byB0aGlzLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fGZ1bmN0aW9ufSBwYXJ0aWFsU3RhdGUgTmV4dCBwYXJ0aWFsIHN0YXRlIG9yIGZ1bmN0aW9uIHRvXG4gKiAgICAgICAgcHJvZHVjZSBuZXh0IHBhcnRpYWwgc3RhdGUgdG8gYmUgbWVyZ2VkIHdpdGggY3VycmVudCBzdGF0ZS5cbiAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgc3RhdGUgaXMgdXBkYXRlZC5cbiAqIEBmaW5hbFxuICogQHByb3RlY3RlZFxuICovXG5Db21wb25lbnQucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24gKHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2spIHtcbiAgISh0eXBlb2YgcGFydGlhbFN0YXRlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgcGFydGlhbFN0YXRlID09PSAnZnVuY3Rpb24nIHx8IHBhcnRpYWxTdGF0ZSA9PSBudWxsKSA/IGludmFyaWFudChmYWxzZSwgJ3NldFN0YXRlKC4uLik6IHRha2VzIGFuIG9iamVjdCBvZiBzdGF0ZSB2YXJpYWJsZXMgdG8gdXBkYXRlIG9yIGEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhbiBvYmplY3Qgb2Ygc3RhdGUgdmFyaWFibGVzLicpIDogdm9pZCAwO1xuICB0aGlzLnVwZGF0ZXIuZW5xdWV1ZVNldFN0YXRlKHRoaXMsIHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2ssICdzZXRTdGF0ZScpO1xufTtcblxuLyoqXG4gKiBGb3JjZXMgYW4gdXBkYXRlLiBUaGlzIHNob3VsZCBvbmx5IGJlIGludm9rZWQgd2hlbiBpdCBpcyBrbm93biB3aXRoXG4gKiBjZXJ0YWludHkgdGhhdCB3ZSBhcmUgKipub3QqKiBpbiBhIERPTSB0cmFuc2FjdGlvbi5cbiAqXG4gKiBZb3UgbWF5IHdhbnQgdG8gY2FsbCB0aGlzIHdoZW4geW91IGtub3cgdGhhdCBzb21lIGRlZXBlciBhc3BlY3Qgb2YgdGhlXG4gKiBjb21wb25lbnQncyBzdGF0ZSBoYXMgY2hhbmdlZCBidXQgYHNldFN0YXRlYCB3YXMgbm90IGNhbGxlZC5cbiAqXG4gKiBUaGlzIHdpbGwgbm90IGludm9rZSBgc2hvdWxkQ29tcG9uZW50VXBkYXRlYCwgYnV0IGl0IHdpbGwgaW52b2tlXG4gKiBgY29tcG9uZW50V2lsbFVwZGF0ZWAgYW5kIGBjb21wb25lbnREaWRVcGRhdGVgLlxuICpcbiAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgdXBkYXRlIGlzIGNvbXBsZXRlLlxuICogQGZpbmFsXG4gKiBAcHJvdGVjdGVkXG4gKi9cbkNvbXBvbmVudC5wcm90b3R5cGUuZm9yY2VVcGRhdGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgdGhpcy51cGRhdGVyLmVucXVldWVGb3JjZVVwZGF0ZSh0aGlzLCBjYWxsYmFjaywgJ2ZvcmNlVXBkYXRlJyk7XG59O1xuXG4vKipcbiAqIERlcHJlY2F0ZWQgQVBJcy4gVGhlc2UgQVBJcyB1c2VkIHRvIGV4aXN0IG9uIGNsYXNzaWMgUmVhY3QgY2xhc3NlcyBidXQgc2luY2VcbiAqIHdlIHdvdWxkIGxpa2UgdG8gZGVwcmVjYXRlIHRoZW0sIHdlJ3JlIG5vdCBnb2luZyB0byBtb3ZlIHRoZW0gb3ZlciB0byB0aGlzXG4gKiBtb2Rlcm4gYmFzZSBjbGFzcy4gSW5zdGVhZCwgd2UgZGVmaW5lIGEgZ2V0dGVyIHRoYXQgd2FybnMgaWYgaXQncyBhY2Nlc3NlZC5cbiAqL1xue1xuICB2YXIgZGVwcmVjYXRlZEFQSXMgPSB7XG4gICAgaXNNb3VudGVkOiBbJ2lzTW91bnRlZCcsICdJbnN0ZWFkLCBtYWtlIHN1cmUgdG8gY2xlYW4gdXAgc3Vic2NyaXB0aW9ucyBhbmQgcGVuZGluZyByZXF1ZXN0cyBpbiAnICsgJ2NvbXBvbmVudFdpbGxVbm1vdW50IHRvIHByZXZlbnQgbWVtb3J5IGxlYWtzLiddLFxuICAgIHJlcGxhY2VTdGF0ZTogWydyZXBsYWNlU3RhdGUnLCAnUmVmYWN0b3IgeW91ciBjb2RlIHRvIHVzZSBzZXRTdGF0ZSBpbnN0ZWFkIChzZWUgJyArICdodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzMyMzYpLiddXG4gIH07XG4gIHZhciBkZWZpbmVEZXByZWNhdGlvbldhcm5pbmcgPSBmdW5jdGlvbiAobWV0aG9kTmFtZSwgaW5mbykge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb21wb25lbnQucHJvdG90eXBlLCBtZXRob2ROYW1lLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbG93UHJpb3JpdHlXYXJuaW5nJDEoZmFsc2UsICclcyguLi4pIGlzIGRlcHJlY2F0ZWQgaW4gcGxhaW4gSmF2YVNjcmlwdCBSZWFjdCBjbGFzc2VzLiAlcycsIGluZm9bMF0sIGluZm9bMV0pO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBmb3IgKHZhciBmbk5hbWUgaW4gZGVwcmVjYXRlZEFQSXMpIHtcbiAgICBpZiAoZGVwcmVjYXRlZEFQSXMuaGFzT3duUHJvcGVydHkoZm5OYW1lKSkge1xuICAgICAgZGVmaW5lRGVwcmVjYXRpb25XYXJuaW5nKGZuTmFtZSwgZGVwcmVjYXRlZEFQSXNbZm5OYW1lXSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIENvbXBvbmVudER1bW15KCkge31cbkNvbXBvbmVudER1bW15LnByb3RvdHlwZSA9IENvbXBvbmVudC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ29udmVuaWVuY2UgY29tcG9uZW50IHdpdGggZGVmYXVsdCBzaGFsbG93IGVxdWFsaXR5IGNoZWNrIGZvciBzQ1UuXG4gKi9cbmZ1bmN0aW9uIFB1cmVDb21wb25lbnQocHJvcHMsIGNvbnRleHQsIHVwZGF0ZXIpIHtcbiAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAvLyBJZiBhIGNvbXBvbmVudCBoYXMgc3RyaW5nIHJlZnMsIHdlIHdpbGwgYXNzaWduIGEgZGlmZmVyZW50IG9iamVjdCBsYXRlci5cbiAgdGhpcy5yZWZzID0gZW1wdHlPYmplY3Q7XG4gIHRoaXMudXBkYXRlciA9IHVwZGF0ZXIgfHwgUmVhY3ROb29wVXBkYXRlUXVldWU7XG59XG5cbnZhciBwdXJlQ29tcG9uZW50UHJvdG90eXBlID0gUHVyZUNvbXBvbmVudC5wcm90b3R5cGUgPSBuZXcgQ29tcG9uZW50RHVtbXkoKTtcbnB1cmVDb21wb25lbnRQcm90b3R5cGUuY29uc3RydWN0b3IgPSBQdXJlQ29tcG9uZW50O1xuLy8gQXZvaWQgYW4gZXh0cmEgcHJvdG90eXBlIGp1bXAgZm9yIHRoZXNlIG1ldGhvZHMuXG5fYXNzaWduKHB1cmVDb21wb25lbnRQcm90b3R5cGUsIENvbXBvbmVudC5wcm90b3R5cGUpO1xucHVyZUNvbXBvbmVudFByb3RvdHlwZS5pc1B1cmVSZWFjdENvbXBvbmVudCA9IHRydWU7XG5cbi8vIGFuIGltbXV0YWJsZSBvYmplY3Qgd2l0aCBhIHNpbmdsZSBtdXRhYmxlIHZhbHVlXG5mdW5jdGlvbiBjcmVhdGVSZWYoKSB7XG4gIHZhciByZWZPYmplY3QgPSB7XG4gICAgY3VycmVudDogbnVsbFxuICB9O1xuICB7XG4gICAgT2JqZWN0LnNlYWwocmVmT2JqZWN0KTtcbiAgfVxuICByZXR1cm4gcmVmT2JqZWN0O1xufVxuXG4vKipcbiAqIEtlZXBzIHRyYWNrIG9mIHRoZSBjdXJyZW50IG93bmVyLlxuICpcbiAqIFRoZSBjdXJyZW50IG93bmVyIGlzIHRoZSBjb21wb25lbnQgd2hvIHNob3VsZCBvd24gYW55IGNvbXBvbmVudHMgdGhhdCBhcmVcbiAqIGN1cnJlbnRseSBiZWluZyBjb25zdHJ1Y3RlZC5cbiAqL1xudmFyIFJlYWN0Q3VycmVudE93bmVyID0ge1xuICAvKipcbiAgICogQGludGVybmFsXG4gICAqIEB0eXBlIHtSZWFjdENvbXBvbmVudH1cbiAgICovXG4gIGN1cnJlbnQ6IG51bGwsXG4gIGN1cnJlbnREaXNwYXRjaGVyOiBudWxsXG59O1xuXG52YXIgQkVGT1JFX1NMQVNIX1JFID0gL14oLiopW1xcXFxcXC9dLztcblxudmFyIGRlc2NyaWJlQ29tcG9uZW50RnJhbWUgPSBmdW5jdGlvbiAobmFtZSwgc291cmNlLCBvd25lck5hbWUpIHtcbiAgdmFyIHNvdXJjZUluZm8gPSAnJztcbiAgaWYgKHNvdXJjZSkge1xuICAgIHZhciBwYXRoID0gc291cmNlLmZpbGVOYW1lO1xuICAgIHZhciBmaWxlTmFtZSA9IHBhdGgucmVwbGFjZShCRUZPUkVfU0xBU0hfUkUsICcnKTtcbiAgICB7XG4gICAgICAvLyBJbiBERVYsIGluY2x1ZGUgY29kZSBmb3IgYSBjb21tb24gc3BlY2lhbCBjYXNlOlxuICAgICAgLy8gcHJlZmVyIFwiZm9sZGVyL2luZGV4LmpzXCIgaW5zdGVhZCBvZiBqdXN0IFwiaW5kZXguanNcIi5cbiAgICAgIGlmICgvXmluZGV4XFwuLy50ZXN0KGZpbGVOYW1lKSkge1xuICAgICAgICB2YXIgbWF0Y2ggPSBwYXRoLm1hdGNoKEJFRk9SRV9TTEFTSF9SRSk7XG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgIHZhciBwYXRoQmVmb3JlU2xhc2ggPSBtYXRjaFsxXTtcbiAgICAgICAgICBpZiAocGF0aEJlZm9yZVNsYXNoKSB7XG4gICAgICAgICAgICB2YXIgZm9sZGVyTmFtZSA9IHBhdGhCZWZvcmVTbGFzaC5yZXBsYWNlKEJFRk9SRV9TTEFTSF9SRSwgJycpO1xuICAgICAgICAgICAgZmlsZU5hbWUgPSBmb2xkZXJOYW1lICsgJy8nICsgZmlsZU5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHNvdXJjZUluZm8gPSAnIChhdCAnICsgZmlsZU5hbWUgKyAnOicgKyBzb3VyY2UubGluZU51bWJlciArICcpJztcbiAgfSBlbHNlIGlmIChvd25lck5hbWUpIHtcbiAgICBzb3VyY2VJbmZvID0gJyAoY3JlYXRlZCBieSAnICsgb3duZXJOYW1lICsgJyknO1xuICB9XG4gIHJldHVybiAnXFxuICAgIGluICcgKyAobmFtZSB8fCAnVW5rbm93bicpICsgc291cmNlSW5mbztcbn07XG5cbnZhciBSZXNvbHZlZCA9IDE7XG5cblxuZnVuY3Rpb24gcmVmaW5lUmVzb2x2ZWRMYXp5Q29tcG9uZW50KGxhenlDb21wb25lbnQpIHtcbiAgcmV0dXJuIGxhenlDb21wb25lbnQuX3N0YXR1cyA9PT0gUmVzb2x2ZWQgPyBsYXp5Q29tcG9uZW50Ll9yZXN1bHQgOiBudWxsO1xufVxuXG5mdW5jdGlvbiBnZXRXcmFwcGVkTmFtZShvdXRlclR5cGUsIGlubmVyVHlwZSwgd3JhcHBlck5hbWUpIHtcbiAgdmFyIGZ1bmN0aW9uTmFtZSA9IGlubmVyVHlwZS5kaXNwbGF5TmFtZSB8fCBpbm5lclR5cGUubmFtZSB8fCAnJztcbiAgcmV0dXJuIG91dGVyVHlwZS5kaXNwbGF5TmFtZSB8fCAoZnVuY3Rpb25OYW1lICE9PSAnJyA/IHdyYXBwZXJOYW1lICsgJygnICsgZnVuY3Rpb25OYW1lICsgJyknIDogd3JhcHBlck5hbWUpO1xufVxuXG5mdW5jdGlvbiBnZXRDb21wb25lbnROYW1lKHR5cGUpIHtcbiAgaWYgKHR5cGUgPT0gbnVsbCkge1xuICAgIC8vIEhvc3Qgcm9vdCwgdGV4dCBub2RlIG9yIGp1c3QgaW52YWxpZCB0eXBlLlxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHtcbiAgICBpZiAodHlwZW9mIHR5cGUudGFnID09PSAnbnVtYmVyJykge1xuICAgICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnUmVjZWl2ZWQgYW4gdW5leHBlY3RlZCBvYmplY3QgaW4gZ2V0Q29tcG9uZW50TmFtZSgpLiAnICsgJ1RoaXMgaXMgbGlrZWx5IGEgYnVnIGluIFJlYWN0LiBQbGVhc2UgZmlsZSBhbiBpc3N1ZS4nKTtcbiAgICB9XG4gIH1cbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHR5cGUuZGlzcGxheU5hbWUgfHwgdHlwZS5uYW1lIHx8IG51bGw7XG4gIH1cbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB0eXBlO1xuICB9XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEU6XG4gICAgICByZXR1cm4gJ0NvbmN1cnJlbnRNb2RlJztcbiAgICBjYXNlIFJFQUNUX0ZSQUdNRU5UX1RZUEU6XG4gICAgICByZXR1cm4gJ0ZyYWdtZW50JztcbiAgICBjYXNlIFJFQUNUX1BPUlRBTF9UWVBFOlxuICAgICAgcmV0dXJuICdQb3J0YWwnO1xuICAgIGNhc2UgUkVBQ1RfUFJPRklMRVJfVFlQRTpcbiAgICAgIHJldHVybiAnUHJvZmlsZXInO1xuICAgIGNhc2UgUkVBQ1RfU1RSSUNUX01PREVfVFlQRTpcbiAgICAgIHJldHVybiAnU3RyaWN0TW9kZSc7XG4gICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9UWVBFOlxuICAgICAgcmV0dXJuICdTdXNwZW5zZSc7XG4gIH1cbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnb2JqZWN0Jykge1xuICAgIHN3aXRjaCAodHlwZS4kJHR5cGVvZikge1xuICAgICAgY2FzZSBSRUFDVF9DT05URVhUX1RZUEU6XG4gICAgICAgIHJldHVybiAnQ29udGV4dC5Db25zdW1lcic7XG4gICAgICBjYXNlIFJFQUNUX1BST1ZJREVSX1RZUEU6XG4gICAgICAgIHJldHVybiAnQ29udGV4dC5Qcm92aWRlcic7XG4gICAgICBjYXNlIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEU6XG4gICAgICAgIHJldHVybiBnZXRXcmFwcGVkTmFtZSh0eXBlLCB0eXBlLnJlbmRlciwgJ0ZvcndhcmRSZWYnKTtcbiAgICAgIGNhc2UgUkVBQ1RfTUVNT19UWVBFOlxuICAgICAgICByZXR1cm4gZ2V0Q29tcG9uZW50TmFtZSh0eXBlLnR5cGUpO1xuICAgICAgY2FzZSBSRUFDVF9MQVpZX1RZUEU6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgdGhlbmFibGUgPSB0eXBlO1xuICAgICAgICAgIHZhciByZXNvbHZlZFRoZW5hYmxlID0gcmVmaW5lUmVzb2x2ZWRMYXp5Q29tcG9uZW50KHRoZW5hYmxlKTtcbiAgICAgICAgICBpZiAocmVzb2x2ZWRUaGVuYWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGdldENvbXBvbmVudE5hbWUocmVzb2x2ZWRUaGVuYWJsZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG52YXIgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSA9IHt9O1xuXG52YXIgY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQgPSBudWxsO1xuXG5mdW5jdGlvbiBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChlbGVtZW50KSB7XG4gIHtcbiAgICBjdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCA9IGVsZW1lbnQ7XG4gIH1cbn1cblxue1xuICAvLyBTdGFjayBpbXBsZW1lbnRhdGlvbiBpbmplY3RlZCBieSB0aGUgY3VycmVudCByZW5kZXJlci5cbiAgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRDdXJyZW50U3RhY2sgPSBudWxsO1xuXG4gIFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0U3RhY2tBZGRlbmR1bSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3RhY2sgPSAnJztcblxuICAgIC8vIEFkZCBhbiBleHRyYSB0b3AgZnJhbWUgd2hpbGUgYW4gZWxlbWVudCBpcyBiZWluZyB2YWxpZGF0ZWRcbiAgICBpZiAoY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQpIHtcbiAgICAgIHZhciBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZShjdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudC50eXBlKTtcbiAgICAgIHZhciBvd25lciA9IGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50Ll9vd25lcjtcbiAgICAgIHN0YWNrICs9IGRlc2NyaWJlQ29tcG9uZW50RnJhbWUobmFtZSwgY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQuX3NvdXJjZSwgb3duZXIgJiYgZ2V0Q29tcG9uZW50TmFtZShvd25lci50eXBlKSk7XG4gICAgfVxuXG4gICAgLy8gRGVsZWdhdGUgdG8gdGhlIGluamVjdGVkIHJlbmRlcmVyLXNwZWNpZmljIGltcGxlbWVudGF0aW9uXG4gICAgdmFyIGltcGwgPSBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldEN1cnJlbnRTdGFjaztcbiAgICBpZiAoaW1wbCkge1xuICAgICAgc3RhY2sgKz0gaW1wbCgpIHx8ICcnO1xuICAgIH1cblxuICAgIHJldHVybiBzdGFjaztcbiAgfTtcbn1cblxudmFyIFJlYWN0U2hhcmVkSW50ZXJuYWxzID0ge1xuICBSZWFjdEN1cnJlbnRPd25lcjogUmVhY3RDdXJyZW50T3duZXIsXG4gIC8vIFVzZWQgYnkgcmVuZGVyZXJzIHRvIGF2b2lkIGJ1bmRsaW5nIG9iamVjdC1hc3NpZ24gdHdpY2UgaW4gVU1EIGJ1bmRsZXM6XG4gIGFzc2lnbjogX2Fzc2lnblxufTtcblxue1xuICBfYXNzaWduKFJlYWN0U2hhcmVkSW50ZXJuYWxzLCB7XG4gICAgLy8gVGhlc2Ugc2hvdWxkIG5vdCBiZSBpbmNsdWRlZCBpbiBwcm9kdWN0aW9uLlxuICAgIFJlYWN0RGVidWdDdXJyZW50RnJhbWU6IFJlYWN0RGVidWdDdXJyZW50RnJhbWUsXG4gICAgLy8gU2hpbSBmb3IgUmVhY3QgRE9NIDE2LjAuMCB3aGljaCBzdGlsbCBkZXN0cnVjdHVyZWQgKGJ1dCBub3QgdXNlZCkgdGhpcy5cbiAgICAvLyBUT0RPOiByZW1vdmUgaW4gUmVhY3QgMTcuMC5cbiAgICBSZWFjdENvbXBvbmVudFRyZWVIb29rOiB7fVxuICB9KTtcbn1cblxuLyoqXG4gKiBTaW1pbGFyIHRvIGludmFyaWFudCBidXQgb25seSBsb2dzIGEgd2FybmluZyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXQuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGxvZyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzIGluIGNyaXRpY2FsXG4gKiBwYXRocy4gUmVtb3ZpbmcgdGhlIGxvZ2dpbmcgY29kZSBmb3IgcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMgd2lsbCBrZWVwIHRoZVxuICogc2FtZSBsb2dpYyBhbmQgZm9sbG93IHRoZSBzYW1lIGNvZGUgcGF0aHMuXG4gKi9cblxudmFyIHdhcm5pbmcgPSB3YXJuaW5nV2l0aG91dFN0YWNrJDE7XG5cbntcbiAgd2FybmluZyA9IGZ1bmN0aW9uIChjb25kaXRpb24sIGZvcm1hdCkge1xuICAgIGlmIChjb25kaXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIFJlYWN0RGVidWdDdXJyZW50RnJhbWUgPSBSZWFjdFNoYXJlZEludGVybmFscy5SZWFjdERlYnVnQ3VycmVudEZyYW1lO1xuICAgIHZhciBzdGFjayA9IFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0U3RhY2tBZGRlbmR1bSgpO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1pbnRlcm5hbC93YXJuaW5nLWFuZC1pbnZhcmlhbnQtYXJnc1xuXG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEuYXBwbHkodW5kZWZpbmVkLCBbZmFsc2UsIGZvcm1hdCArICclcyddLmNvbmNhdChhcmdzLCBbc3RhY2tdKSk7XG4gIH07XG59XG5cbnZhciB3YXJuaW5nJDEgPSB3YXJuaW5nO1xuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG52YXIgUkVTRVJWRURfUFJPUFMgPSB7XG4gIGtleTogdHJ1ZSxcbiAgcmVmOiB0cnVlLFxuICBfX3NlbGY6IHRydWUsXG4gIF9fc291cmNlOiB0cnVlXG59O1xuXG52YXIgc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd24gPSB2b2lkIDA7XG52YXIgc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd24gPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkUmVmKGNvbmZpZykge1xuICB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCAncmVmJykpIHtcbiAgICAgIHZhciBnZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGNvbmZpZywgJ3JlZicpLmdldDtcbiAgICAgIGlmIChnZXR0ZXIgJiYgZ2V0dGVyLmlzUmVhY3RXYXJuaW5nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbmZpZy5yZWYgIT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gaGFzVmFsaWRLZXkoY29uZmlnKSB7XG4gIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsICdrZXknKSkge1xuICAgICAgdmFyIGdldHRlciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY29uZmlnLCAna2V5JykuZ2V0O1xuICAgICAgaWYgKGdldHRlciAmJiBnZXR0ZXIuaXNSZWFjdFdhcm5pbmcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY29uZmlnLmtleSAhPT0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBkZWZpbmVLZXlQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpIHtcbiAgdmFyIHdhcm5BYm91dEFjY2Vzc2luZ0tleSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duKSB7XG4gICAgICBzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93biA9IHRydWU7XG4gICAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICclczogYGtleWAgaXMgbm90IGEgcHJvcC4gVHJ5aW5nIHRvIGFjY2VzcyBpdCB3aWxsIHJlc3VsdCAnICsgJ2luIGB1bmRlZmluZWRgIGJlaW5nIHJldHVybmVkLiBJZiB5b3UgbmVlZCB0byBhY2Nlc3MgdGhlIHNhbWUgJyArICd2YWx1ZSB3aXRoaW4gdGhlIGNoaWxkIGNvbXBvbmVudCwgeW91IHNob3VsZCBwYXNzIGl0IGFzIGEgZGlmZmVyZW50ICcgKyAncHJvcC4gKGh0dHBzOi8vZmIubWUvcmVhY3Qtc3BlY2lhbC1wcm9wcyknLCBkaXNwbGF5TmFtZSk7XG4gICAgfVxuICB9O1xuICB3YXJuQWJvdXRBY2Nlc3NpbmdLZXkuaXNSZWFjdFdhcm5pbmcgPSB0cnVlO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvcHMsICdrZXknLCB7XG4gICAgZ2V0OiB3YXJuQWJvdXRBY2Nlc3NpbmdLZXksXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkZWZpbmVSZWZQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpIHtcbiAgdmFyIHdhcm5BYm91dEFjY2Vzc2luZ1JlZiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXNwZWNpYWxQcm9wUmVmV2FybmluZ1Nob3duKSB7XG4gICAgICBzcGVjaWFsUHJvcFJlZldhcm5pbmdTaG93biA9IHRydWU7XG4gICAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICclczogYHJlZmAgaXMgbm90IGEgcHJvcC4gVHJ5aW5nIHRvIGFjY2VzcyBpdCB3aWxsIHJlc3VsdCAnICsgJ2luIGB1bmRlZmluZWRgIGJlaW5nIHJldHVybmVkLiBJZiB5b3UgbmVlZCB0byBhY2Nlc3MgdGhlIHNhbWUgJyArICd2YWx1ZSB3aXRoaW4gdGhlIGNoaWxkIGNvbXBvbmVudCwgeW91IHNob3VsZCBwYXNzIGl0IGFzIGEgZGlmZmVyZW50ICcgKyAncHJvcC4gKGh0dHBzOi8vZmIubWUvcmVhY3Qtc3BlY2lhbC1wcm9wcyknLCBkaXNwbGF5TmFtZSk7XG4gICAgfVxuICB9O1xuICB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYuaXNSZWFjdFdhcm5pbmcgPSB0cnVlO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvcHMsICdyZWYnLCB7XG4gICAgZ2V0OiB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG4vKipcbiAqIEZhY3RvcnkgbWV0aG9kIHRvIGNyZWF0ZSBhIG5ldyBSZWFjdCBlbGVtZW50LiBUaGlzIG5vIGxvbmdlciBhZGhlcmVzIHRvXG4gKiB0aGUgY2xhc3MgcGF0dGVybiwgc28gZG8gbm90IHVzZSBuZXcgdG8gY2FsbCBpdC4gQWxzbywgbm8gaW5zdGFuY2VvZiBjaGVja1xuICogd2lsbCB3b3JrLiBJbnN0ZWFkIHRlc3QgJCR0eXBlb2YgZmllbGQgYWdhaW5zdCBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykgdG8gY2hlY2tcbiAqIGlmIHNvbWV0aGluZyBpcyBhIFJlYWN0IEVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHsqfSB0eXBlXG4gKiBAcGFyYW0geyp9IGtleVxuICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSByZWZcbiAqIEBwYXJhbSB7Kn0gc2VsZiBBICp0ZW1wb3JhcnkqIGhlbHBlciB0byBkZXRlY3QgcGxhY2VzIHdoZXJlIGB0aGlzYCBpc1xuICogZGlmZmVyZW50IGZyb20gdGhlIGBvd25lcmAgd2hlbiBSZWFjdC5jcmVhdGVFbGVtZW50IGlzIGNhbGxlZCwgc28gdGhhdCB3ZVxuICogY2FuIHdhcm4uIFdlIHdhbnQgdG8gZ2V0IHJpZCBvZiBvd25lciBhbmQgcmVwbGFjZSBzdHJpbmcgYHJlZmBzIHdpdGggYXJyb3dcbiAqIGZ1bmN0aW9ucywgYW5kIGFzIGxvbmcgYXMgYHRoaXNgIGFuZCBvd25lciBhcmUgdGhlIHNhbWUsIHRoZXJlIHdpbGwgYmUgbm9cbiAqIGNoYW5nZSBpbiBiZWhhdmlvci5cbiAqIEBwYXJhbSB7Kn0gc291cmNlIEFuIGFubm90YXRpb24gb2JqZWN0IChhZGRlZCBieSBhIHRyYW5zcGlsZXIgb3Igb3RoZXJ3aXNlKVxuICogaW5kaWNhdGluZyBmaWxlbmFtZSwgbGluZSBudW1iZXIsIGFuZC9vciBvdGhlciBpbmZvcm1hdGlvbi5cbiAqIEBwYXJhbSB7Kn0gb3duZXJcbiAqIEBwYXJhbSB7Kn0gcHJvcHNcbiAqIEBpbnRlcm5hbFxuICovXG52YXIgUmVhY3RFbGVtZW50ID0gZnVuY3Rpb24gKHR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIG93bmVyLCBwcm9wcykge1xuICB2YXIgZWxlbWVudCA9IHtcbiAgICAvLyBUaGlzIHRhZyBhbGxvd3MgdXMgdG8gdW5pcXVlbHkgaWRlbnRpZnkgdGhpcyBhcyBhIFJlYWN0IEVsZW1lbnRcbiAgICAkJHR5cGVvZjogUkVBQ1RfRUxFTUVOVF9UWVBFLFxuXG4gICAgLy8gQnVpbHQtaW4gcHJvcGVydGllcyB0aGF0IGJlbG9uZyBvbiB0aGUgZWxlbWVudFxuICAgIHR5cGU6IHR5cGUsXG4gICAga2V5OiBrZXksXG4gICAgcmVmOiByZWYsXG4gICAgcHJvcHM6IHByb3BzLFxuXG4gICAgLy8gUmVjb3JkIHRoZSBjb21wb25lbnQgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoaXMgZWxlbWVudC5cbiAgICBfb3duZXI6IG93bmVyXG4gIH07XG5cbiAge1xuICAgIC8vIFRoZSB2YWxpZGF0aW9uIGZsYWcgaXMgY3VycmVudGx5IG11dGF0aXZlLiBXZSBwdXQgaXQgb25cbiAgICAvLyBhbiBleHRlcm5hbCBiYWNraW5nIHN0b3JlIHNvIHRoYXQgd2UgY2FuIGZyZWV6ZSB0aGUgd2hvbGUgb2JqZWN0LlxuICAgIC8vIFRoaXMgY2FuIGJlIHJlcGxhY2VkIHdpdGggYSBXZWFrTWFwIG9uY2UgdGhleSBhcmUgaW1wbGVtZW50ZWQgaW5cbiAgICAvLyBjb21tb25seSB1c2VkIGRldmVsb3BtZW50IGVudmlyb25tZW50cy5cbiAgICBlbGVtZW50Ll9zdG9yZSA9IHt9O1xuXG4gICAgLy8gVG8gbWFrZSBjb21wYXJpbmcgUmVhY3RFbGVtZW50cyBlYXNpZXIgZm9yIHRlc3RpbmcgcHVycG9zZXMsIHdlIG1ha2VcbiAgICAvLyB0aGUgdmFsaWRhdGlvbiBmbGFnIG5vbi1lbnVtZXJhYmxlICh3aGVyZSBwb3NzaWJsZSwgd2hpY2ggc2hvdWxkXG4gICAgLy8gaW5jbHVkZSBldmVyeSBlbnZpcm9ubWVudCB3ZSBydW4gdGVzdHMgaW4pLCBzbyB0aGUgdGVzdCBmcmFtZXdvcmtcbiAgICAvLyBpZ25vcmVzIGl0LlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50Ll9zdG9yZSwgJ3ZhbGlkYXRlZCcsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6IGZhbHNlXG4gICAgfSk7XG4gICAgLy8gc2VsZiBhbmQgc291cmNlIGFyZSBERVYgb25seSBwcm9wZXJ0aWVzLlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50LCAnX3NlbGYnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogc2VsZlxuICAgIH0pO1xuICAgIC8vIFR3byBlbGVtZW50cyBjcmVhdGVkIGluIHR3byBkaWZmZXJlbnQgcGxhY2VzIHNob3VsZCBiZSBjb25zaWRlcmVkXG4gICAgLy8gZXF1YWwgZm9yIHRlc3RpbmcgcHVycG9zZXMgYW5kIHRoZXJlZm9yZSB3ZSBoaWRlIGl0IGZyb20gZW51bWVyYXRpb24uXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQsICdfc291cmNlJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHNvdXJjZVxuICAgIH0pO1xuICAgIGlmIChPYmplY3QuZnJlZXplKSB7XG4gICAgICBPYmplY3QuZnJlZXplKGVsZW1lbnQucHJvcHMpO1xuICAgICAgT2JqZWN0LmZyZWV6ZShlbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZWxlbWVudDtcbn07XG5cbi8qKlxuICogQ3JlYXRlIGFuZCByZXR1cm4gYSBuZXcgUmVhY3RFbGVtZW50IG9mIHRoZSBnaXZlbiB0eXBlLlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNjcmVhdGVlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgY29uZmlnLCBjaGlsZHJlbikge1xuICB2YXIgcHJvcE5hbWUgPSB2b2lkIDA7XG5cbiAgLy8gUmVzZXJ2ZWQgbmFtZXMgYXJlIGV4dHJhY3RlZFxuICB2YXIgcHJvcHMgPSB7fTtcblxuICB2YXIga2V5ID0gbnVsbDtcbiAgdmFyIHJlZiA9IG51bGw7XG4gIHZhciBzZWxmID0gbnVsbDtcbiAgdmFyIHNvdXJjZSA9IG51bGw7XG5cbiAgaWYgKGNvbmZpZyAhPSBudWxsKSB7XG4gICAgaWYgKGhhc1ZhbGlkUmVmKGNvbmZpZykpIHtcbiAgICAgIHJlZiA9IGNvbmZpZy5yZWY7XG4gICAgfVxuICAgIGlmIChoYXNWYWxpZEtleShjb25maWcpKSB7XG4gICAgICBrZXkgPSAnJyArIGNvbmZpZy5rZXk7XG4gICAgfVxuXG4gICAgc2VsZiA9IGNvbmZpZy5fX3NlbGYgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjb25maWcuX19zZWxmO1xuICAgIHNvdXJjZSA9IGNvbmZpZy5fX3NvdXJjZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGNvbmZpZy5fX3NvdXJjZTtcbiAgICAvLyBSZW1haW5pbmcgcHJvcGVydGllcyBhcmUgYWRkZWQgdG8gYSBuZXcgcHJvcHMgb2JqZWN0XG4gICAgZm9yIChwcm9wTmFtZSBpbiBjb25maWcpIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgcHJvcE5hbWUpICYmICFSRVNFUlZFRF9QUk9QUy5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIHtcbiAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gY29uZmlnW3Byb3BOYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDaGlsZHJlbiBjYW4gYmUgbW9yZSB0aGFuIG9uZSBhcmd1bWVudCwgYW5kIHRob3NlIGFyZSB0cmFuc2ZlcnJlZCBvbnRvXG4gIC8vIHRoZSBuZXdseSBhbGxvY2F0ZWQgcHJvcHMgb2JqZWN0LlxuICB2YXIgY2hpbGRyZW5MZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcbiAgaWYgKGNoaWxkcmVuTGVuZ3RoID09PSAxKSB7XG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgfSBlbHNlIGlmIChjaGlsZHJlbkxlbmd0aCA+IDEpIHtcbiAgICB2YXIgY2hpbGRBcnJheSA9IEFycmF5KGNoaWxkcmVuTGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuTGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkQXJyYXlbaV0gPSBhcmd1bWVudHNbaSArIDJdO1xuICAgIH1cbiAgICB7XG4gICAgICBpZiAoT2JqZWN0LmZyZWV6ZSkge1xuICAgICAgICBPYmplY3QuZnJlZXplKGNoaWxkQXJyYXkpO1xuICAgICAgfVxuICAgIH1cbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkQXJyYXk7XG4gIH1cblxuICAvLyBSZXNvbHZlIGRlZmF1bHQgcHJvcHNcbiAgaWYgKHR5cGUgJiYgdHlwZS5kZWZhdWx0UHJvcHMpIHtcbiAgICB2YXIgZGVmYXVsdFByb3BzID0gdHlwZS5kZWZhdWx0UHJvcHM7XG4gICAgZm9yIChwcm9wTmFtZSBpbiBkZWZhdWx0UHJvcHMpIHtcbiAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBkZWZhdWx0UHJvcHNbcHJvcE5hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICB7XG4gICAgaWYgKGtleSB8fCByZWYpIHtcbiAgICAgIHZhciBkaXNwbGF5TmFtZSA9IHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nID8gdHlwZS5kaXNwbGF5TmFtZSB8fCB0eXBlLm5hbWUgfHwgJ1Vua25vd24nIDogdHlwZTtcbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgZGVmaW5lS2V5UHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZWYpIHtcbiAgICAgICAgZGVmaW5lUmVmUHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIFJlYWN0RWxlbWVudCh0eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50LCBwcm9wcyk7XG59XG5cbi8qKlxuICogUmV0dXJuIGEgZnVuY3Rpb24gdGhhdCBwcm9kdWNlcyBSZWFjdEVsZW1lbnRzIG9mIGEgZ2l2ZW4gdHlwZS5cbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjY3JlYXRlZmFjdG9yeVxuICovXG5cblxuZnVuY3Rpb24gY2xvbmVBbmRSZXBsYWNlS2V5KG9sZEVsZW1lbnQsIG5ld0tleSkge1xuICB2YXIgbmV3RWxlbWVudCA9IFJlYWN0RWxlbWVudChvbGRFbGVtZW50LnR5cGUsIG5ld0tleSwgb2xkRWxlbWVudC5yZWYsIG9sZEVsZW1lbnQuX3NlbGYsIG9sZEVsZW1lbnQuX3NvdXJjZSwgb2xkRWxlbWVudC5fb3duZXIsIG9sZEVsZW1lbnQucHJvcHMpO1xuXG4gIHJldHVybiBuZXdFbGVtZW50O1xufVxuXG4vKipcbiAqIENsb25lIGFuZCByZXR1cm4gYSBuZXcgUmVhY3RFbGVtZW50IHVzaW5nIGVsZW1lbnQgYXMgdGhlIHN0YXJ0aW5nIHBvaW50LlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNjbG9uZWVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gY2xvbmVFbGVtZW50KGVsZW1lbnQsIGNvbmZpZywgY2hpbGRyZW4pIHtcbiAgISEoZWxlbWVudCA9PT0gbnVsbCB8fCBlbGVtZW50ID09PSB1bmRlZmluZWQpID8gaW52YXJpYW50KGZhbHNlLCAnUmVhY3QuY2xvbmVFbGVtZW50KC4uLik6IFRoZSBhcmd1bWVudCBtdXN0IGJlIGEgUmVhY3QgZWxlbWVudCwgYnV0IHlvdSBwYXNzZWQgJXMuJywgZWxlbWVudCkgOiB2b2lkIDA7XG5cbiAgdmFyIHByb3BOYW1lID0gdm9pZCAwO1xuXG4gIC8vIE9yaWdpbmFsIHByb3BzIGFyZSBjb3BpZWRcbiAgdmFyIHByb3BzID0gX2Fzc2lnbih7fSwgZWxlbWVudC5wcm9wcyk7XG5cbiAgLy8gUmVzZXJ2ZWQgbmFtZXMgYXJlIGV4dHJhY3RlZFxuICB2YXIga2V5ID0gZWxlbWVudC5rZXk7XG4gIHZhciByZWYgPSBlbGVtZW50LnJlZjtcbiAgLy8gU2VsZiBpcyBwcmVzZXJ2ZWQgc2luY2UgdGhlIG93bmVyIGlzIHByZXNlcnZlZC5cbiAgdmFyIHNlbGYgPSBlbGVtZW50Ll9zZWxmO1xuICAvLyBTb3VyY2UgaXMgcHJlc2VydmVkIHNpbmNlIGNsb25lRWxlbWVudCBpcyB1bmxpa2VseSB0byBiZSB0YXJnZXRlZCBieSBhXG4gIC8vIHRyYW5zcGlsZXIsIGFuZCB0aGUgb3JpZ2luYWwgc291cmNlIGlzIHByb2JhYmx5IGEgYmV0dGVyIGluZGljYXRvciBvZiB0aGVcbiAgLy8gdHJ1ZSBvd25lci5cbiAgdmFyIHNvdXJjZSA9IGVsZW1lbnQuX3NvdXJjZTtcblxuICAvLyBPd25lciB3aWxsIGJlIHByZXNlcnZlZCwgdW5sZXNzIHJlZiBpcyBvdmVycmlkZGVuXG4gIHZhciBvd25lciA9IGVsZW1lbnQuX293bmVyO1xuXG4gIGlmIChjb25maWcgIT0gbnVsbCkge1xuICAgIGlmIChoYXNWYWxpZFJlZihjb25maWcpKSB7XG4gICAgICAvLyBTaWxlbnRseSBzdGVhbCB0aGUgcmVmIGZyb20gdGhlIHBhcmVudC5cbiAgICAgIHJlZiA9IGNvbmZpZy5yZWY7XG4gICAgICBvd25lciA9IFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQ7XG4gICAgfVxuICAgIGlmIChoYXNWYWxpZEtleShjb25maWcpKSB7XG4gICAgICBrZXkgPSAnJyArIGNvbmZpZy5rZXk7XG4gICAgfVxuXG4gICAgLy8gUmVtYWluaW5nIHByb3BlcnRpZXMgb3ZlcnJpZGUgZXhpc3RpbmcgcHJvcHNcbiAgICB2YXIgZGVmYXVsdFByb3BzID0gdm9pZCAwO1xuICAgIGlmIChlbGVtZW50LnR5cGUgJiYgZWxlbWVudC50eXBlLmRlZmF1bHRQcm9wcykge1xuICAgICAgZGVmYXVsdFByb3BzID0gZWxlbWVudC50eXBlLmRlZmF1bHRQcm9wcztcbiAgICB9XG4gICAgZm9yIChwcm9wTmFtZSBpbiBjb25maWcpIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgcHJvcE5hbWUpICYmICFSRVNFUlZFRF9QUk9QUy5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIHtcbiAgICAgICAgaWYgKGNvbmZpZ1twcm9wTmFtZV0gPT09IHVuZGVmaW5lZCAmJiBkZWZhdWx0UHJvcHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIFJlc29sdmUgZGVmYXVsdCBwcm9wc1xuICAgICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGRlZmF1bHRQcm9wc1twcm9wTmFtZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gY29uZmlnW3Byb3BOYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENoaWxkcmVuIGNhbiBiZSBtb3JlIHRoYW4gb25lIGFyZ3VtZW50LCBhbmQgdGhvc2UgYXJlIHRyYW5zZmVycmVkIG9udG9cbiAgLy8gdGhlIG5ld2x5IGFsbG9jYXRlZCBwcm9wcyBvYmplY3QuXG4gIHZhciBjaGlsZHJlbkxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGggLSAyO1xuICBpZiAoY2hpbGRyZW5MZW5ndGggPT09IDEpIHtcbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICB9IGVsc2UgaWYgKGNoaWxkcmVuTGVuZ3RoID4gMSkge1xuICAgIHZhciBjaGlsZEFycmF5ID0gQXJyYXkoY2hpbGRyZW5MZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW5MZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGRBcnJheVtpXSA9IGFyZ3VtZW50c1tpICsgMl07XG4gICAgfVxuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRBcnJheTtcbiAgfVxuXG4gIHJldHVybiBSZWFjdEVsZW1lbnQoZWxlbWVudC50eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBvd25lciwgcHJvcHMpO1xufVxuXG4vKipcbiAqIFZlcmlmaWVzIHRoZSBvYmplY3QgaXMgYSBSZWFjdEVsZW1lbnQuXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI2lzdmFsaWRlbGVtZW50XG4gKiBAcGFyYW0gez9vYmplY3R9IG9iamVjdFxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiBgb2JqZWN0YCBpcyBhIFJlYWN0RWxlbWVudC5cbiAqIEBmaW5hbFxuICovXG5mdW5jdGlvbiBpc1ZhbGlkRWxlbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdCAhPT0gbnVsbCAmJiBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbn1cblxudmFyIFNFUEFSQVRPUiA9ICcuJztcbnZhciBTVUJTRVBBUkFUT1IgPSAnOic7XG5cbi8qKlxuICogRXNjYXBlIGFuZCB3cmFwIGtleSBzbyBpdCBpcyBzYWZlIHRvIHVzZSBhcyBhIHJlYWN0aWRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IHRvIGJlIGVzY2FwZWQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBlc2NhcGVkIGtleS5cbiAqL1xuZnVuY3Rpb24gZXNjYXBlKGtleSkge1xuICB2YXIgZXNjYXBlUmVnZXggPSAvWz06XS9nO1xuICB2YXIgZXNjYXBlckxvb2t1cCA9IHtcbiAgICAnPSc6ICc9MCcsXG4gICAgJzonOiAnPTInXG4gIH07XG4gIHZhciBlc2NhcGVkU3RyaW5nID0gKCcnICsga2V5KS5yZXBsYWNlKGVzY2FwZVJlZ2V4LCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICByZXR1cm4gZXNjYXBlckxvb2t1cFttYXRjaF07XG4gIH0pO1xuXG4gIHJldHVybiAnJCcgKyBlc2NhcGVkU3RyaW5nO1xufVxuXG4vKipcbiAqIFRPRE86IFRlc3QgdGhhdCBhIHNpbmdsZSBjaGlsZCBhbmQgYW4gYXJyYXkgd2l0aCBvbmUgaXRlbSBoYXZlIHRoZSBzYW1lIGtleVxuICogcGF0dGVybi5cbiAqL1xuXG52YXIgZGlkV2FybkFib3V0TWFwcyA9IGZhbHNlO1xuXG52YXIgdXNlclByb3ZpZGVkS2V5RXNjYXBlUmVnZXggPSAvXFwvKy9nO1xuZnVuY3Rpb24gZXNjYXBlVXNlclByb3ZpZGVkS2V5KHRleHQpIHtcbiAgcmV0dXJuICgnJyArIHRleHQpLnJlcGxhY2UodXNlclByb3ZpZGVkS2V5RXNjYXBlUmVnZXgsICckJi8nKTtcbn1cblxudmFyIFBPT0xfU0laRSA9IDEwO1xudmFyIHRyYXZlcnNlQ29udGV4dFBvb2wgPSBbXTtcbmZ1bmN0aW9uIGdldFBvb2xlZFRyYXZlcnNlQ29udGV4dChtYXBSZXN1bHQsIGtleVByZWZpeCwgbWFwRnVuY3Rpb24sIG1hcENvbnRleHQpIHtcbiAgaWYgKHRyYXZlcnNlQ29udGV4dFBvb2wubGVuZ3RoKSB7XG4gICAgdmFyIHRyYXZlcnNlQ29udGV4dCA9IHRyYXZlcnNlQ29udGV4dFBvb2wucG9wKCk7XG4gICAgdHJhdmVyc2VDb250ZXh0LnJlc3VsdCA9IG1hcFJlc3VsdDtcbiAgICB0cmF2ZXJzZUNvbnRleHQua2V5UHJlZml4ID0ga2V5UHJlZml4O1xuICAgIHRyYXZlcnNlQ29udGV4dC5mdW5jID0gbWFwRnVuY3Rpb247XG4gICAgdHJhdmVyc2VDb250ZXh0LmNvbnRleHQgPSBtYXBDb250ZXh0O1xuICAgIHRyYXZlcnNlQ29udGV4dC5jb3VudCA9IDA7XG4gICAgcmV0dXJuIHRyYXZlcnNlQ29udGV4dDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdWx0OiBtYXBSZXN1bHQsXG4gICAgICBrZXlQcmVmaXg6IGtleVByZWZpeCxcbiAgICAgIGZ1bmM6IG1hcEZ1bmN0aW9uLFxuICAgICAgY29udGV4dDogbWFwQ29udGV4dCxcbiAgICAgIGNvdW50OiAwXG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWxlYXNlVHJhdmVyc2VDb250ZXh0KHRyYXZlcnNlQ29udGV4dCkge1xuICB0cmF2ZXJzZUNvbnRleHQucmVzdWx0ID0gbnVsbDtcbiAgdHJhdmVyc2VDb250ZXh0LmtleVByZWZpeCA9IG51bGw7XG4gIHRyYXZlcnNlQ29udGV4dC5mdW5jID0gbnVsbDtcbiAgdHJhdmVyc2VDb250ZXh0LmNvbnRleHQgPSBudWxsO1xuICB0cmF2ZXJzZUNvbnRleHQuY291bnQgPSAwO1xuICBpZiAodHJhdmVyc2VDb250ZXh0UG9vbC5sZW5ndGggPCBQT09MX1NJWkUpIHtcbiAgICB0cmF2ZXJzZUNvbnRleHRQb29sLnB1c2godHJhdmVyc2VDb250ZXh0KTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgY29udGFpbmVyLlxuICogQHBhcmFtIHshc3RyaW5nfSBuYW1lU29GYXIgTmFtZSBvZiB0aGUga2V5IHBhdGggc28gZmFyLlxuICogQHBhcmFtIHshZnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIHRvIGludm9rZSB3aXRoIGVhY2ggY2hpbGQgZm91bmQuXG4gKiBAcGFyYW0gez8qfSB0cmF2ZXJzZUNvbnRleHQgVXNlZCB0byBwYXNzIGluZm9ybWF0aW9uIHRocm91Z2hvdXQgdGhlIHRyYXZlcnNhbFxuICogcHJvY2Vzcy5cbiAqIEByZXR1cm4geyFudW1iZXJ9IFRoZSBudW1iZXIgb2YgY2hpbGRyZW4gaW4gdGhpcyBzdWJ0cmVlLlxuICovXG5mdW5jdGlvbiB0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbChjaGlsZHJlbiwgbmFtZVNvRmFyLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIGNoaWxkcmVuO1xuXG4gIGlmICh0eXBlID09PSAndW5kZWZpbmVkJyB8fCB0eXBlID09PSAnYm9vbGVhbicpIHtcbiAgICAvLyBBbGwgb2YgdGhlIGFib3ZlIGFyZSBwZXJjZWl2ZWQgYXMgbnVsbC5cbiAgICBjaGlsZHJlbiA9IG51bGw7XG4gIH1cblxuICB2YXIgaW52b2tlQ2FsbGJhY2sgPSBmYWxzZTtcblxuICBpZiAoY2hpbGRyZW4gPT09IG51bGwpIHtcbiAgICBpbnZva2VDYWxsYmFjayA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgaW52b2tlQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIHN3aXRjaCAoY2hpbGRyZW4uJCR0eXBlb2YpIHtcbiAgICAgICAgICBjYXNlIFJFQUNUX0VMRU1FTlRfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX1BPUlRBTF9UWVBFOlxuICAgICAgICAgICAgaW52b2tlQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGludm9rZUNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2sodHJhdmVyc2VDb250ZXh0LCBjaGlsZHJlbixcbiAgICAvLyBJZiBpdCdzIHRoZSBvbmx5IGNoaWxkLCB0cmVhdCB0aGUgbmFtZSBhcyBpZiBpdCB3YXMgd3JhcHBlZCBpbiBhbiBhcnJheVxuICAgIC8vIHNvIHRoYXQgaXQncyBjb25zaXN0ZW50IGlmIHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gZ3Jvd3MuXG4gICAgbmFtZVNvRmFyID09PSAnJyA/IFNFUEFSQVRPUiArIGdldENvbXBvbmVudEtleShjaGlsZHJlbiwgMCkgOiBuYW1lU29GYXIpO1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgdmFyIGNoaWxkID0gdm9pZCAwO1xuICB2YXIgbmV4dE5hbWUgPSB2b2lkIDA7XG4gIHZhciBzdWJ0cmVlQ291bnQgPSAwOyAvLyBDb3VudCBvZiBjaGlsZHJlbiBmb3VuZCBpbiB0aGUgY3VycmVudCBzdWJ0cmVlLlxuICB2YXIgbmV4dE5hbWVQcmVmaXggPSBuYW1lU29GYXIgPT09ICcnID8gU0VQQVJBVE9SIDogbmFtZVNvRmFyICsgU1VCU0VQQVJBVE9SO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICBuZXh0TmFtZSA9IG5leHROYW1lUHJlZml4ICsgZ2V0Q29tcG9uZW50S2V5KGNoaWxkLCBpKTtcbiAgICAgIHN1YnRyZWVDb3VudCArPSB0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbChjaGlsZCwgbmV4dE5hbWUsIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4oY2hpbGRyZW4pO1xuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAge1xuICAgICAgICAvLyBXYXJuIGFib3V0IHVzaW5nIE1hcHMgYXMgY2hpbGRyZW5cbiAgICAgICAgaWYgKGl0ZXJhdG9yRm4gPT09IGNoaWxkcmVuLmVudHJpZXMpIHtcbiAgICAgICAgICAhZGlkV2FybkFib3V0TWFwcyA/IHdhcm5pbmckMShmYWxzZSwgJ1VzaW5nIE1hcHMgYXMgY2hpbGRyZW4gaXMgdW5zdXBwb3J0ZWQgYW5kIHdpbGwgbGlrZWx5IHlpZWxkICcgKyAndW5leHBlY3RlZCByZXN1bHRzLiBDb252ZXJ0IGl0IHRvIGEgc2VxdWVuY2UvaXRlcmFibGUgb2Yga2V5ZWQgJyArICdSZWFjdEVsZW1lbnRzIGluc3RlYWQuJykgOiB2b2lkIDA7XG4gICAgICAgICAgZGlkV2FybkFib3V0TWFwcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKGNoaWxkcmVuKTtcbiAgICAgIHZhciBzdGVwID0gdm9pZCAwO1xuICAgICAgdmFyIGlpID0gMDtcbiAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgY2hpbGQgPSBzdGVwLnZhbHVlO1xuICAgICAgICBuZXh0TmFtZSA9IG5leHROYW1lUHJlZml4ICsgZ2V0Q29tcG9uZW50S2V5KGNoaWxkLCBpaSsrKTtcbiAgICAgICAgc3VidHJlZUNvdW50ICs9IHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkLCBuZXh0TmFtZSwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgdmFyIGFkZGVuZHVtID0gJyc7XG4gICAgICB7XG4gICAgICAgIGFkZGVuZHVtID0gJyBJZiB5b3UgbWVhbnQgdG8gcmVuZGVyIGEgY29sbGVjdGlvbiBvZiBjaGlsZHJlbiwgdXNlIGFuIGFycmF5ICcgKyAnaW5zdGVhZC4nICsgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRTdGFja0FkZGVuZHVtKCk7XG4gICAgICB9XG4gICAgICB2YXIgY2hpbGRyZW5TdHJpbmcgPSAnJyArIGNoaWxkcmVuO1xuICAgICAgaW52YXJpYW50KGZhbHNlLCAnT2JqZWN0cyBhcmUgbm90IHZhbGlkIGFzIGEgUmVhY3QgY2hpbGQgKGZvdW5kOiAlcykuJXMnLCBjaGlsZHJlblN0cmluZyA9PT0gJ1tvYmplY3QgT2JqZWN0XScgPyAnb2JqZWN0IHdpdGgga2V5cyB7JyArIE9iamVjdC5rZXlzKGNoaWxkcmVuKS5qb2luKCcsICcpICsgJ30nIDogY2hpbGRyZW5TdHJpbmcsIGFkZGVuZHVtKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3VidHJlZUNvdW50O1xufVxuXG4vKipcbiAqIFRyYXZlcnNlcyBjaGlsZHJlbiB0aGF0IGFyZSB0eXBpY2FsbHkgc3BlY2lmaWVkIGFzIGBwcm9wcy5jaGlsZHJlbmAsIGJ1dFxuICogbWlnaHQgYWxzbyBiZSBzcGVjaWZpZWQgdGhyb3VnaCBhdHRyaWJ1dGVzOlxuICpcbiAqIC0gYHRyYXZlcnNlQWxsQ2hpbGRyZW4odGhpcy5wcm9wcy5jaGlsZHJlbiwgLi4uKWBcbiAqIC0gYHRyYXZlcnNlQWxsQ2hpbGRyZW4odGhpcy5wcm9wcy5sZWZ0UGFuZWxDaGlsZHJlbiwgLi4uKWBcbiAqXG4gKiBUaGUgYHRyYXZlcnNlQ29udGV4dGAgaXMgYW4gb3B0aW9uYWwgYXJndW1lbnQgdGhhdCBpcyBwYXNzZWQgdGhyb3VnaCB0aGVcbiAqIGVudGlyZSB0cmF2ZXJzYWwuIEl0IGNhbiBiZSB1c2VkIHRvIHN0b3JlIGFjY3VtdWxhdGlvbnMgb3IgYW55dGhpbmcgZWxzZSB0aGF0XG4gKiB0aGUgY2FsbGJhY2sgbWlnaHQgZmluZCByZWxldmFudC5cbiAqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIG9iamVjdC5cbiAqIEBwYXJhbSB7IWZ1bmN0aW9ufSBjYWxsYmFjayBUbyBpbnZva2UgdXBvbiB0cmF2ZXJzaW5nIGVhY2ggY2hpbGQuXG4gKiBAcGFyYW0gez8qfSB0cmF2ZXJzZUNvbnRleHQgQ29udGV4dCBmb3IgdHJhdmVyc2FsLlxuICogQHJldHVybiB7IW51bWJlcn0gVGhlIG51bWJlciBvZiBjaGlsZHJlbiBpbiB0aGlzIHN1YnRyZWUuXG4gKi9cbmZ1bmN0aW9uIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpIHtcbiAgaWYgKGNoaWxkcmVuID09IG51bGwpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHJldHVybiB0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbChjaGlsZHJlbiwgJycsIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpO1xufVxuXG4vKipcbiAqIEdlbmVyYXRlIGEga2V5IHN0cmluZyB0aGF0IGlkZW50aWZpZXMgYSBjb21wb25lbnQgd2l0aGluIGEgc2V0LlxuICpcbiAqIEBwYXJhbSB7Kn0gY29tcG9uZW50IEEgY29tcG9uZW50IHRoYXQgY291bGQgY29udGFpbiBhIG1hbnVhbCBrZXkuXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggSW5kZXggdGhhdCBpcyB1c2VkIGlmIGEgbWFudWFsIGtleSBpcyBub3QgcHJvdmlkZWQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldENvbXBvbmVudEtleShjb21wb25lbnQsIGluZGV4KSB7XG4gIC8vIERvIHNvbWUgdHlwZWNoZWNraW5nIGhlcmUgc2luY2Ugd2UgY2FsbCB0aGlzIGJsaW5kbHkuIFdlIHdhbnQgdG8gZW5zdXJlXG4gIC8vIHRoYXQgd2UgZG9uJ3QgYmxvY2sgcG90ZW50aWFsIGZ1dHVyZSBFUyBBUElzLlxuICBpZiAodHlwZW9mIGNvbXBvbmVudCA9PT0gJ29iamVjdCcgJiYgY29tcG9uZW50ICE9PSBudWxsICYmIGNvbXBvbmVudC5rZXkgIT0gbnVsbCkge1xuICAgIC8vIEV4cGxpY2l0IGtleVxuICAgIHJldHVybiBlc2NhcGUoY29tcG9uZW50LmtleSk7XG4gIH1cbiAgLy8gSW1wbGljaXQga2V5IGRldGVybWluZWQgYnkgdGhlIGluZGV4IGluIHRoZSBzZXRcbiAgcmV0dXJuIGluZGV4LnRvU3RyaW5nKDM2KTtcbn1cblxuZnVuY3Rpb24gZm9yRWFjaFNpbmdsZUNoaWxkKGJvb2tLZWVwaW5nLCBjaGlsZCwgbmFtZSkge1xuICB2YXIgZnVuYyA9IGJvb2tLZWVwaW5nLmZ1bmMsXG4gICAgICBjb250ZXh0ID0gYm9va0tlZXBpbmcuY29udGV4dDtcblxuICBmdW5jLmNhbGwoY29udGV4dCwgY2hpbGQsIGJvb2tLZWVwaW5nLmNvdW50KyspO1xufVxuXG4vKipcbiAqIEl0ZXJhdGVzIHRocm91Z2ggY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhcyBgcHJvcHMuY2hpbGRyZW5gLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbmZvcmVhY2hcbiAqXG4gKiBUaGUgcHJvdmlkZWQgZm9yRWFjaEZ1bmMoY2hpbGQsIGluZGV4KSB3aWxsIGJlIGNhbGxlZCBmb3IgZWFjaFxuICogbGVhZiBjaGlsZC5cbiAqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKiwgaW50KX0gZm9yRWFjaEZ1bmNcbiAqIEBwYXJhbSB7Kn0gZm9yRWFjaENvbnRleHQgQ29udGV4dCBmb3IgZm9yRWFjaENvbnRleHQuXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2hDaGlsZHJlbihjaGlsZHJlbiwgZm9yRWFjaEZ1bmMsIGZvckVhY2hDb250ZXh0KSB7XG4gIGlmIChjaGlsZHJlbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG4gIHZhciB0cmF2ZXJzZUNvbnRleHQgPSBnZXRQb29sZWRUcmF2ZXJzZUNvbnRleHQobnVsbCwgbnVsbCwgZm9yRWFjaEZ1bmMsIGZvckVhY2hDb250ZXh0KTtcbiAgdHJhdmVyc2VBbGxDaGlsZHJlbihjaGlsZHJlbiwgZm9yRWFjaFNpbmdsZUNoaWxkLCB0cmF2ZXJzZUNvbnRleHQpO1xuICByZWxlYXNlVHJhdmVyc2VDb250ZXh0KHRyYXZlcnNlQ29udGV4dCk7XG59XG5cbmZ1bmN0aW9uIG1hcFNpbmdsZUNoaWxkSW50b0NvbnRleHQoYm9va0tlZXBpbmcsIGNoaWxkLCBjaGlsZEtleSkge1xuICB2YXIgcmVzdWx0ID0gYm9va0tlZXBpbmcucmVzdWx0LFxuICAgICAga2V5UHJlZml4ID0gYm9va0tlZXBpbmcua2V5UHJlZml4LFxuICAgICAgZnVuYyA9IGJvb2tLZWVwaW5nLmZ1bmMsXG4gICAgICBjb250ZXh0ID0gYm9va0tlZXBpbmcuY29udGV4dDtcblxuXG4gIHZhciBtYXBwZWRDaGlsZCA9IGZ1bmMuY2FsbChjb250ZXh0LCBjaGlsZCwgYm9va0tlZXBpbmcuY291bnQrKyk7XG4gIGlmIChBcnJheS5pc0FycmF5KG1hcHBlZENoaWxkKSkge1xuICAgIG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWwobWFwcGVkQ2hpbGQsIHJlc3VsdCwgY2hpbGRLZXksIGZ1bmN0aW9uIChjKSB7XG4gICAgICByZXR1cm4gYztcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChtYXBwZWRDaGlsZCAhPSBudWxsKSB7XG4gICAgaWYgKGlzVmFsaWRFbGVtZW50KG1hcHBlZENoaWxkKSkge1xuICAgICAgbWFwcGVkQ2hpbGQgPSBjbG9uZUFuZFJlcGxhY2VLZXkobWFwcGVkQ2hpbGQsXG4gICAgICAvLyBLZWVwIGJvdGggdGhlIChtYXBwZWQpIGFuZCBvbGQga2V5cyBpZiB0aGV5IGRpZmZlciwganVzdCBhc1xuICAgICAgLy8gdHJhdmVyc2VBbGxDaGlsZHJlbiB1c2VkIHRvIGRvIGZvciBvYmplY3RzIGFzIGNoaWxkcmVuXG4gICAgICBrZXlQcmVmaXggKyAobWFwcGVkQ2hpbGQua2V5ICYmICghY2hpbGQgfHwgY2hpbGQua2V5ICE9PSBtYXBwZWRDaGlsZC5rZXkpID8gZXNjYXBlVXNlclByb3ZpZGVkS2V5KG1hcHBlZENoaWxkLmtleSkgKyAnLycgOiAnJykgKyBjaGlsZEtleSk7XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKG1hcHBlZENoaWxkKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKGNoaWxkcmVuLCBhcnJheSwgcHJlZml4LCBmdW5jLCBjb250ZXh0KSB7XG4gIHZhciBlc2NhcGVkUHJlZml4ID0gJyc7XG4gIGlmIChwcmVmaXggIT0gbnVsbCkge1xuICAgIGVzY2FwZWRQcmVmaXggPSBlc2NhcGVVc2VyUHJvdmlkZWRLZXkocHJlZml4KSArICcvJztcbiAgfVxuICB2YXIgdHJhdmVyc2VDb250ZXh0ID0gZ2V0UG9vbGVkVHJhdmVyc2VDb250ZXh0KGFycmF5LCBlc2NhcGVkUHJlZml4LCBmdW5jLCBjb250ZXh0KTtcbiAgdHJhdmVyc2VBbGxDaGlsZHJlbihjaGlsZHJlbiwgbWFwU2luZ2xlQ2hpbGRJbnRvQ29udGV4dCwgdHJhdmVyc2VDb250ZXh0KTtcbiAgcmVsZWFzZVRyYXZlcnNlQ29udGV4dCh0cmF2ZXJzZUNvbnRleHQpO1xufVxuXG4vKipcbiAqIE1hcHMgY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhcyBgcHJvcHMuY2hpbGRyZW5gLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbm1hcFxuICpcbiAqIFRoZSBwcm92aWRlZCBtYXBGdW5jdGlvbihjaGlsZCwga2V5LCBpbmRleCkgd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2hcbiAqIGxlYWYgY2hpbGQuXG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCosIGludCl9IGZ1bmMgVGhlIG1hcCBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7Kn0gY29udGV4dCBDb250ZXh0IGZvciBtYXBGdW5jdGlvbi5cbiAqIEByZXR1cm4ge29iamVjdH0gT2JqZWN0IGNvbnRhaW5pbmcgdGhlIG9yZGVyZWQgbWFwIG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIG1hcENoaWxkcmVuKGNoaWxkcmVuLCBmdW5jLCBjb250ZXh0KSB7XG4gIGlmIChjaGlsZHJlbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChjaGlsZHJlbiwgcmVzdWx0LCBudWxsLCBmdW5jLCBjb250ZXh0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDb3VudCB0aGUgbnVtYmVyIG9mIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXNcbiAqIGBwcm9wcy5jaGlsZHJlbmAuXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVuY291bnRcbiAqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIG51bWJlciBvZiBjaGlsZHJlbi5cbiAqL1xuZnVuY3Rpb24gY291bnRDaGlsZHJlbihjaGlsZHJlbikge1xuICByZXR1cm4gdHJhdmVyc2VBbGxDaGlsZHJlbihjaGlsZHJlbiwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9LCBudWxsKTtcbn1cblxuLyoqXG4gKiBGbGF0dGVuIGEgY2hpbGRyZW4gb2JqZWN0ICh0eXBpY2FsbHkgc3BlY2lmaWVkIGFzIGBwcm9wcy5jaGlsZHJlbmApIGFuZFxuICogcmV0dXJuIGFuIGFycmF5IHdpdGggYXBwcm9wcmlhdGVseSByZS1rZXllZCBjaGlsZHJlbi5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW50b2FycmF5XG4gKi9cbmZ1bmN0aW9uIHRvQXJyYXkoY2hpbGRyZW4pIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKGNoaWxkcmVuLCByZXN1bHQsIG51bGwsIGZ1bmN0aW9uIChjaGlsZCkge1xuICAgIHJldHVybiBjaGlsZDtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZmlyc3QgY2hpbGQgaW4gYSBjb2xsZWN0aW9uIG9mIGNoaWxkcmVuIGFuZCB2ZXJpZmllcyB0aGF0IHRoZXJlXG4gKiBpcyBvbmx5IG9uZSBjaGlsZCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW5vbmx5XG4gKlxuICogVGhlIGN1cnJlbnQgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgYSBzaW5nbGUgY2hpbGQgZ2V0c1xuICogcGFzc2VkIHdpdGhvdXQgYSB3cmFwcGVyLCBidXQgdGhlIHB1cnBvc2Ugb2YgdGhpcyBoZWxwZXIgZnVuY3Rpb24gaXMgdG9cbiAqIGFic3RyYWN0IGF3YXkgdGhlIHBhcnRpY3VsYXIgc3RydWN0dXJlIG9mIGNoaWxkcmVuLlxuICpcbiAqIEBwYXJhbSB7P29iamVjdH0gY2hpbGRyZW4gQ2hpbGQgY29sbGVjdGlvbiBzdHJ1Y3R1cmUuXG4gKiBAcmV0dXJuIHtSZWFjdEVsZW1lbnR9IFRoZSBmaXJzdCBhbmQgb25seSBgUmVhY3RFbGVtZW50YCBjb250YWluZWQgaW4gdGhlXG4gKiBzdHJ1Y3R1cmUuXG4gKi9cbmZ1bmN0aW9uIG9ubHlDaGlsZChjaGlsZHJlbikge1xuICAhaXNWYWxpZEVsZW1lbnQoY2hpbGRyZW4pID8gaW52YXJpYW50KGZhbHNlLCAnUmVhY3QuQ2hpbGRyZW4ub25seSBleHBlY3RlZCB0byByZWNlaXZlIGEgc2luZ2xlIFJlYWN0IGVsZW1lbnQgY2hpbGQuJykgOiB2b2lkIDA7XG4gIHJldHVybiBjaGlsZHJlbjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29udGV4dChkZWZhdWx0VmFsdWUsIGNhbGN1bGF0ZUNoYW5nZWRCaXRzKSB7XG4gIGlmIChjYWxjdWxhdGVDaGFuZ2VkQml0cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY2FsY3VsYXRlQ2hhbmdlZEJpdHMgPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIHtcbiAgICAgICEoY2FsY3VsYXRlQ2hhbmdlZEJpdHMgPT09IG51bGwgfHwgdHlwZW9mIGNhbGN1bGF0ZUNoYW5nZWRCaXRzID09PSAnZnVuY3Rpb24nKSA/IHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ2NyZWF0ZUNvbnRleHQ6IEV4cGVjdGVkIHRoZSBvcHRpb25hbCBzZWNvbmQgYXJndW1lbnQgdG8gYmUgYSAnICsgJ2Z1bmN0aW9uLiBJbnN0ZWFkIHJlY2VpdmVkOiAlcycsIGNhbGN1bGF0ZUNoYW5nZWRCaXRzKSA6IHZvaWQgMDtcbiAgICB9XG4gIH1cblxuICB2YXIgY29udGV4dCA9IHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfQ09OVEVYVF9UWVBFLFxuICAgIF9jYWxjdWxhdGVDaGFuZ2VkQml0czogY2FsY3VsYXRlQ2hhbmdlZEJpdHMsXG4gICAgLy8gQXMgYSB3b3JrYXJvdW5kIHRvIHN1cHBvcnQgbXVsdGlwbGUgY29uY3VycmVudCByZW5kZXJlcnMsIHdlIGNhdGVnb3JpemVcbiAgICAvLyBzb21lIHJlbmRlcmVycyBhcyBwcmltYXJ5IGFuZCBvdGhlcnMgYXMgc2Vjb25kYXJ5LiBXZSBvbmx5IGV4cGVjdFxuICAgIC8vIHRoZXJlIHRvIGJlIHR3byBjb25jdXJyZW50IHJlbmRlcmVycyBhdCBtb3N0OiBSZWFjdCBOYXRpdmUgKHByaW1hcnkpIGFuZFxuICAgIC8vIEZhYnJpYyAoc2Vjb25kYXJ5KTsgUmVhY3QgRE9NIChwcmltYXJ5KSBhbmQgUmVhY3QgQVJUIChzZWNvbmRhcnkpLlxuICAgIC8vIFNlY29uZGFyeSByZW5kZXJlcnMgc3RvcmUgdGhlaXIgY29udGV4dCB2YWx1ZXMgb24gc2VwYXJhdGUgZmllbGRzLlxuICAgIF9jdXJyZW50VmFsdWU6IGRlZmF1bHRWYWx1ZSxcbiAgICBfY3VycmVudFZhbHVlMjogZGVmYXVsdFZhbHVlLFxuICAgIC8vIFVzZWQgdG8gdHJhY2sgaG93IG1hbnkgY29uY3VycmVudCByZW5kZXJlcnMgdGhpcyBjb250ZXh0IGN1cnJlbnRseVxuICAgIC8vIHN1cHBvcnRzIHdpdGhpbiBpbiBhIHNpbmdsZSByZW5kZXJlci4gU3VjaCBhcyBwYXJhbGxlbCBzZXJ2ZXIgcmVuZGVyaW5nLlxuICAgIF90aHJlYWRDb3VudDogMCxcbiAgICAvLyBUaGVzZSBhcmUgY2lyY3VsYXJcbiAgICBQcm92aWRlcjogbnVsbCxcbiAgICBDb25zdW1lcjogbnVsbFxuICB9O1xuXG4gIGNvbnRleHQuUHJvdmlkZXIgPSB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX1BST1ZJREVSX1RZUEUsXG4gICAgX2NvbnRleHQ6IGNvbnRleHRcbiAgfTtcblxuICB2YXIgaGFzV2FybmVkQWJvdXRVc2luZ05lc3RlZENvbnRleHRDb25zdW1lcnMgPSBmYWxzZTtcbiAgdmFyIGhhc1dhcm5lZEFib3V0VXNpbmdDb25zdW1lclByb3ZpZGVyID0gZmFsc2U7XG5cbiAge1xuICAgIC8vIEEgc2VwYXJhdGUgb2JqZWN0LCBidXQgcHJveGllcyBiYWNrIHRvIHRoZSBvcmlnaW5hbCBjb250ZXh0IG9iamVjdCBmb3JcbiAgICAvLyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS4gSXQgaGFzIGEgZGlmZmVyZW50ICQkdHlwZW9mLCBzbyB3ZSBjYW4gcHJvcGVybHlcbiAgICAvLyB3YXJuIGZvciB0aGUgaW5jb3JyZWN0IHVzYWdlIG9mIENvbnRleHQgYXMgYSBDb25zdW1lci5cbiAgICB2YXIgQ29uc3VtZXIgPSB7XG4gICAgICAkJHR5cGVvZjogUkVBQ1RfQ09OVEVYVF9UWVBFLFxuICAgICAgX2NvbnRleHQ6IGNvbnRleHQsXG4gICAgICBfY2FsY3VsYXRlQ2hhbmdlZEJpdHM6IGNvbnRleHQuX2NhbGN1bGF0ZUNoYW5nZWRCaXRzXG4gICAgfTtcbiAgICAvLyAkRmxvd0ZpeE1lOiBGbG93IGNvbXBsYWlucyBhYm91dCBub3Qgc2V0dGluZyBhIHZhbHVlLCB3aGljaCBpcyBpbnRlbnRpb25hbCBoZXJlXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoQ29uc3VtZXIsIHtcbiAgICAgIFByb3ZpZGVyOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghaGFzV2FybmVkQWJvdXRVc2luZ0NvbnN1bWVyUHJvdmlkZXIpIHtcbiAgICAgICAgICAgIGhhc1dhcm5lZEFib3V0VXNpbmdDb25zdW1lclByb3ZpZGVyID0gdHJ1ZTtcbiAgICAgICAgICAgIHdhcm5pbmckMShmYWxzZSwgJ1JlbmRlcmluZyA8Q29udGV4dC5Db25zdW1lci5Qcm92aWRlcj4gaXMgbm90IHN1cHBvcnRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluICcgKyAnYSBmdXR1cmUgbWFqb3IgcmVsZWFzZS4gRGlkIHlvdSBtZWFuIHRvIHJlbmRlciA8Q29udGV4dC5Qcm92aWRlcj4gaW5zdGVhZD8nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuUHJvdmlkZXI7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKF9Qcm92aWRlcikge1xuICAgICAgICAgIGNvbnRleHQuUHJvdmlkZXIgPSBfUHJvdmlkZXI7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBfY3VycmVudFZhbHVlOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0Ll9jdXJyZW50VmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKF9jdXJyZW50VmFsdWUpIHtcbiAgICAgICAgICBjb250ZXh0Ll9jdXJyZW50VmFsdWUgPSBfY3VycmVudFZhbHVlO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX2N1cnJlbnRWYWx1ZTI6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuX2N1cnJlbnRWYWx1ZTI7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKF9jdXJyZW50VmFsdWUyKSB7XG4gICAgICAgICAgY29udGV4dC5fY3VycmVudFZhbHVlMiA9IF9jdXJyZW50VmFsdWUyO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX3RocmVhZENvdW50OiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0Ll90aHJlYWRDb3VudDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoX3RocmVhZENvdW50KSB7XG4gICAgICAgICAgY29udGV4dC5fdGhyZWFkQ291bnQgPSBfdGhyZWFkQ291bnQ7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBDb25zdW1lcjoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIWhhc1dhcm5lZEFib3V0VXNpbmdOZXN0ZWRDb250ZXh0Q29uc3VtZXJzKSB7XG4gICAgICAgICAgICBoYXNXYXJuZWRBYm91dFVzaW5nTmVzdGVkQ29udGV4dENvbnN1bWVycyA9IHRydWU7XG4gICAgICAgICAgICB3YXJuaW5nJDEoZmFsc2UsICdSZW5kZXJpbmcgPENvbnRleHQuQ29uc3VtZXIuQ29uc3VtZXI+IGlzIG5vdCBzdXBwb3J0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiAnICsgJ2EgZnV0dXJlIG1ham9yIHJlbGVhc2UuIERpZCB5b3UgbWVhbiB0byByZW5kZXIgPENvbnRleHQuQ29uc3VtZXI+IGluc3RlYWQ/Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjb250ZXh0LkNvbnN1bWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgLy8gJEZsb3dGaXhNZTogRmxvdyBjb21wbGFpbnMgYWJvdXQgbWlzc2luZyBwcm9wZXJ0aWVzIGJlY2F1c2UgaXQgZG9lc24ndCB1bmRlcnN0YW5kIGRlZmluZVByb3BlcnR5XG4gICAgY29udGV4dC5Db25zdW1lciA9IENvbnN1bWVyO1xuICB9XG5cbiAge1xuICAgIGNvbnRleHQuX2N1cnJlbnRSZW5kZXJlciA9IG51bGw7XG4gICAgY29udGV4dC5fY3VycmVudFJlbmRlcmVyMiA9IG51bGw7XG4gIH1cblxuICByZXR1cm4gY29udGV4dDtcbn1cblxuZnVuY3Rpb24gbGF6eShjdG9yKSB7XG4gIHZhciBsYXp5VHlwZSA9IHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfTEFaWV9UWVBFLFxuICAgIF9jdG9yOiBjdG9yLFxuICAgIC8vIFJlYWN0IHVzZXMgdGhlc2UgZmllbGRzIHRvIHN0b3JlIHRoZSByZXN1bHQuXG4gICAgX3N0YXR1czogLTEsXG4gICAgX3Jlc3VsdDogbnVsbFxuICB9O1xuXG4gIHtcbiAgICAvLyBJbiBwcm9kdWN0aW9uLCB0aGlzIHdvdWxkIGp1c3Qgc2V0IGl0IG9uIHRoZSBvYmplY3QuXG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHZvaWQgMDtcbiAgICB2YXIgcHJvcFR5cGVzID0gdm9pZCAwO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGxhenlUeXBlLCB7XG4gICAgICBkZWZhdWx0UHJvcHM6IHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gZGVmYXVsdFByb3BzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdEZWZhdWx0UHJvcHMpIHtcbiAgICAgICAgICB3YXJuaW5nJDEoZmFsc2UsICdSZWFjdC5sYXp5KC4uLik6IEl0IGlzIG5vdCBzdXBwb3J0ZWQgdG8gYXNzaWduIGBkZWZhdWx0UHJvcHNgIHRvICcgKyAnYSBsYXp5IGNvbXBvbmVudCBpbXBvcnQuIEVpdGhlciBzcGVjaWZ5IHRoZW0gd2hlcmUgdGhlIGNvbXBvbmVudCAnICsgJ2lzIGRlZmluZWQsIG9yIGNyZWF0ZSBhIHdyYXBwaW5nIGNvbXBvbmVudCBhcm91bmQgaXQuJyk7XG4gICAgICAgICAgZGVmYXVsdFByb3BzID0gbmV3RGVmYXVsdFByb3BzO1xuICAgICAgICAgIC8vIE1hdGNoIHByb2R1Y3Rpb24gYmVoYXZpb3IgbW9yZSBjbG9zZWx5OlxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsYXp5VHlwZSwgJ2RlZmF1bHRQcm9wcycsIHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHByb3BUeXBlczoge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBwcm9wVHlwZXM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKG5ld1Byb3BUeXBlcykge1xuICAgICAgICAgIHdhcm5pbmckMShmYWxzZSwgJ1JlYWN0LmxhenkoLi4uKTogSXQgaXMgbm90IHN1cHBvcnRlZCB0byBhc3NpZ24gYHByb3BUeXBlc2AgdG8gJyArICdhIGxhenkgY29tcG9uZW50IGltcG9ydC4gRWl0aGVyIHNwZWNpZnkgdGhlbSB3aGVyZSB0aGUgY29tcG9uZW50ICcgKyAnaXMgZGVmaW5lZCwgb3IgY3JlYXRlIGEgd3JhcHBpbmcgY29tcG9uZW50IGFyb3VuZCBpdC4nKTtcbiAgICAgICAgICBwcm9wVHlwZXMgPSBuZXdQcm9wVHlwZXM7XG4gICAgICAgICAgLy8gTWF0Y2ggcHJvZHVjdGlvbiBiZWhhdmlvciBtb3JlIGNsb3NlbHk6XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGxhenlUeXBlLCAncHJvcFR5cGVzJywge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gbGF6eVR5cGU7XG59XG5cbmZ1bmN0aW9uIGZvcndhcmRSZWYocmVuZGVyKSB7XG4gIHtcbiAgICBpZiAocmVuZGVyICE9IG51bGwgJiYgcmVuZGVyLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEUpIHtcbiAgICAgIHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ2ZvcndhcmRSZWYgcmVxdWlyZXMgYSByZW5kZXIgZnVuY3Rpb24gYnV0IHJlY2VpdmVkIGEgYG1lbW9gICcgKyAnY29tcG9uZW50LiBJbnN0ZWFkIG9mIGZvcndhcmRSZWYobWVtbyguLi4pKSwgdXNlICcgKyAnbWVtbyhmb3J3YXJkUmVmKC4uLikpLicpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlbmRlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnZm9yd2FyZFJlZiByZXF1aXJlcyBhIHJlbmRlciBmdW5jdGlvbiBidXQgd2FzIGdpdmVuICVzLicsIHJlbmRlciA9PT0gbnVsbCA/ICdudWxsJyA6IHR5cGVvZiByZW5kZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAhKFxuICAgICAgLy8gRG8gbm90IHdhcm4gZm9yIDAgYXJndW1lbnRzIGJlY2F1c2UgaXQgY291bGQgYmUgZHVlIHRvIHVzYWdlIG9mIHRoZSAnYXJndW1lbnRzJyBvYmplY3RcbiAgICAgIHJlbmRlci5sZW5ndGggPT09IDAgfHwgcmVuZGVyLmxlbmd0aCA9PT0gMikgPyB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdmb3J3YXJkUmVmIHJlbmRlciBmdW5jdGlvbnMgYWNjZXB0IGV4YWN0bHkgdHdvIHBhcmFtZXRlcnM6IHByb3BzIGFuZCByZWYuICVzJywgcmVuZGVyLmxlbmd0aCA9PT0gMSA/ICdEaWQgeW91IGZvcmdldCB0byB1c2UgdGhlIHJlZiBwYXJhbWV0ZXI/JyA6ICdBbnkgYWRkaXRpb25hbCBwYXJhbWV0ZXIgd2lsbCBiZSB1bmRlZmluZWQuJykgOiB2b2lkIDA7XG4gICAgfVxuXG4gICAgaWYgKHJlbmRlciAhPSBudWxsKSB7XG4gICAgICAhKHJlbmRlci5kZWZhdWx0UHJvcHMgPT0gbnVsbCAmJiByZW5kZXIucHJvcFR5cGVzID09IG51bGwpID8gd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnZm9yd2FyZFJlZiByZW5kZXIgZnVuY3Rpb25zIGRvIG5vdCBzdXBwb3J0IHByb3BUeXBlcyBvciBkZWZhdWx0UHJvcHMuICcgKyAnRGlkIHlvdSBhY2NpZGVudGFsbHkgcGFzcyBhIFJlYWN0IGNvbXBvbmVudD8nKSA6IHZvaWQgMDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFLFxuICAgIHJlbmRlcjogcmVuZGVyXG4gIH07XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWRFbGVtZW50VHlwZSh0eXBlKSB7XG4gIHJldHVybiB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicgfHxcbiAgLy8gTm90ZTogaXRzIHR5cGVvZiBtaWdodCBiZSBvdGhlciB0aGFuICdzeW1ib2wnIG9yICdudW1iZXInIGlmIGl0J3MgYSBwb2x5ZmlsbC5cbiAgdHlwZSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9QUk9GSUxFUl9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1VTUEVOU0VfVFlQRSB8fCB0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgJiYgdHlwZSAhPT0gbnVsbCAmJiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTEFaWV9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9QUk9WSURFUl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0NPTlRFWFRfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFKTtcbn1cblxuZnVuY3Rpb24gbWVtbyh0eXBlLCBjb21wYXJlKSB7XG4gIHtcbiAgICBpZiAoIWlzVmFsaWRFbGVtZW50VHlwZSh0eXBlKSkge1xuICAgICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnbWVtbzogVGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBjb21wb25lbnQuIEluc3RlYWQgJyArICdyZWNlaXZlZDogJXMnLCB0eXBlID09PSBudWxsID8gJ251bGwnIDogdHlwZW9mIHR5cGUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9NRU1PX1RZUEUsXG4gICAgdHlwZTogdHlwZSxcbiAgICBjb21wYXJlOiBjb21wYXJlID09PSB1bmRlZmluZWQgPyBudWxsIDogY29tcGFyZVxuICB9O1xufVxuXG5mdW5jdGlvbiByZXNvbHZlRGlzcGF0Y2hlcigpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50RGlzcGF0Y2hlcjtcbiAgIShkaXNwYXRjaGVyICE9PSBudWxsKSA/IGludmFyaWFudChmYWxzZSwgJ0hvb2tzIGNhbiBvbmx5IGJlIGNhbGxlZCBpbnNpZGUgdGhlIGJvZHkgb2YgYSBmdW5jdGlvbiBjb21wb25lbnQuJykgOiB2b2lkIDA7XG4gIHJldHVybiBkaXNwYXRjaGVyO1xufVxuXG5mdW5jdGlvbiB1c2VDb250ZXh0KENvbnRleHQsIG9ic2VydmVkQml0cykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHtcbiAgICAvLyBUT0RPOiBhZGQgYSBtb3JlIGdlbmVyaWMgd2FybmluZyBmb3IgaW52YWxpZCB2YWx1ZXMuXG4gICAgaWYgKENvbnRleHQuX2NvbnRleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIHJlYWxDb250ZXh0ID0gQ29udGV4dC5fY29udGV4dDtcbiAgICAgIC8vIERvbid0IGRlZHVwbGljYXRlIGJlY2F1c2UgdGhpcyBsZWdpdGltYXRlbHkgY2F1c2VzIGJ1Z3NcbiAgICAgIC8vIGFuZCBub2JvZHkgc2hvdWxkIGJlIHVzaW5nIHRoaXMgaW4gZXhpc3RpbmcgY29kZS5cbiAgICAgIGlmIChyZWFsQ29udGV4dC5Db25zdW1lciA9PT0gQ29udGV4dCkge1xuICAgICAgICB3YXJuaW5nJDEoZmFsc2UsICdDYWxsaW5nIHVzZUNvbnRleHQoQ29udGV4dC5Db25zdW1lcikgaXMgbm90IHN1cHBvcnRlZCwgbWF5IGNhdXNlIGJ1Z3MsIGFuZCB3aWxsIGJlICcgKyAncmVtb3ZlZCBpbiBhIGZ1dHVyZSBtYWpvciByZWxlYXNlLiBEaWQgeW91IG1lYW4gdG8gY2FsbCB1c2VDb250ZXh0KENvbnRleHQpIGluc3RlYWQ/Jyk7XG4gICAgICB9IGVsc2UgaWYgKHJlYWxDb250ZXh0LlByb3ZpZGVyID09PSBDb250ZXh0KSB7XG4gICAgICAgIHdhcm5pbmckMShmYWxzZSwgJ0NhbGxpbmcgdXNlQ29udGV4dChDb250ZXh0LlByb3ZpZGVyKSBpcyBub3Qgc3VwcG9ydGVkLiAnICsgJ0RpZCB5b3UgbWVhbiB0byBjYWxsIHVzZUNvbnRleHQoQ29udGV4dCkgaW5zdGVhZD8nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlQ29udGV4dChDb250ZXh0LCBvYnNlcnZlZEJpdHMpO1xufVxuXG5mdW5jdGlvbiB1c2VTdGF0ZShpbml0aWFsU3RhdGUpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VTdGF0ZShpbml0aWFsU3RhdGUpO1xufVxuXG5mdW5jdGlvbiB1c2VSZWR1Y2VyKHJlZHVjZXIsIGluaXRpYWxTdGF0ZSwgaW5pdGlhbEFjdGlvbikge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZVJlZHVjZXIocmVkdWNlciwgaW5pdGlhbFN0YXRlLCBpbml0aWFsQWN0aW9uKTtcbn1cblxuZnVuY3Rpb24gdXNlUmVmKGluaXRpYWxWYWx1ZSkge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZVJlZihpbml0aWFsVmFsdWUpO1xufVxuXG5mdW5jdGlvbiB1c2VFZmZlY3QoY3JlYXRlLCBpbnB1dHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VFZmZlY3QoY3JlYXRlLCBpbnB1dHMpO1xufVxuXG5mdW5jdGlvbiB1c2VMYXlvdXRFZmZlY3QoY3JlYXRlLCBpbnB1dHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VMYXlvdXRFZmZlY3QoY3JlYXRlLCBpbnB1dHMpO1xufVxuXG5mdW5jdGlvbiB1c2VDYWxsYmFjayhjYWxsYmFjaywgaW5wdXRzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlQ2FsbGJhY2soY2FsbGJhY2ssIGlucHV0cyk7XG59XG5cbmZ1bmN0aW9uIHVzZU1lbW8oY3JlYXRlLCBpbnB1dHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VNZW1vKGNyZWF0ZSwgaW5wdXRzKTtcbn1cblxuZnVuY3Rpb24gdXNlSW1wZXJhdGl2ZU1ldGhvZHMocmVmLCBjcmVhdGUsIGlucHV0cykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUltcGVyYXRpdmVNZXRob2RzKHJlZiwgY3JlYXRlLCBpbnB1dHMpO1xufVxuXG4vKipcbiAqIFJlYWN0RWxlbWVudFZhbGlkYXRvciBwcm92aWRlcyBhIHdyYXBwZXIgYXJvdW5kIGEgZWxlbWVudCBmYWN0b3J5XG4gKiB3aGljaCB2YWxpZGF0ZXMgdGhlIHByb3BzIHBhc3NlZCB0byB0aGUgZWxlbWVudC4gVGhpcyBpcyBpbnRlbmRlZCB0byBiZVxuICogdXNlZCBvbmx5IGluIERFViBhbmQgY291bGQgYmUgcmVwbGFjZWQgYnkgYSBzdGF0aWMgdHlwZSBjaGVja2VyIGZvciBsYW5ndWFnZXNcbiAqIHRoYXQgc3VwcG9ydCBpdC5cbiAqL1xuXG52YXIgcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd24gPSB2b2lkIDA7XG5cbntcbiAgcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd24gPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCkge1xuICBpZiAoUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCkge1xuICAgIHZhciBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZShSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50LnR5cGUpO1xuICAgIGlmIChuYW1lKSB7XG4gICAgICByZXR1cm4gJ1xcblxcbkNoZWNrIHRoZSByZW5kZXIgbWV0aG9kIG9mIGAnICsgbmFtZSArICdgLic7XG4gICAgfVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuZnVuY3Rpb24gZ2V0U291cmNlSW5mb0Vycm9yQWRkZW5kdW0oZWxlbWVudFByb3BzKSB7XG4gIGlmIChlbGVtZW50UHJvcHMgIT09IG51bGwgJiYgZWxlbWVudFByb3BzICE9PSB1bmRlZmluZWQgJiYgZWxlbWVudFByb3BzLl9fc291cmNlICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgc291cmNlID0gZWxlbWVudFByb3BzLl9fc291cmNlO1xuICAgIHZhciBmaWxlTmFtZSA9IHNvdXJjZS5maWxlTmFtZS5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG4gICAgdmFyIGxpbmVOdW1iZXIgPSBzb3VyY2UubGluZU51bWJlcjtcbiAgICByZXR1cm4gJ1xcblxcbkNoZWNrIHlvdXIgY29kZSBhdCAnICsgZmlsZU5hbWUgKyAnOicgKyBsaW5lTnVtYmVyICsgJy4nO1xuICB9XG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBXYXJuIGlmIHRoZXJlJ3Mgbm8ga2V5IGV4cGxpY2l0bHkgc2V0IG9uIGR5bmFtaWMgYXJyYXlzIG9mIGNoaWxkcmVuIG9yXG4gKiBvYmplY3Qga2V5cyBhcmUgbm90IHZhbGlkLiBUaGlzIGFsbG93cyB1cyB0byBrZWVwIHRyYWNrIG9mIGNoaWxkcmVuIGJldHdlZW5cbiAqIHVwZGF0ZXMuXG4gKi9cbnZhciBvd25lckhhc0tleVVzZVdhcm5pbmcgPSB7fTtcblxuZnVuY3Rpb24gZ2V0Q3VycmVudENvbXBvbmVudEVycm9ySW5mbyhwYXJlbnRUeXBlKSB7XG4gIHZhciBpbmZvID0gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCk7XG5cbiAgaWYgKCFpbmZvKSB7XG4gICAgdmFyIHBhcmVudE5hbWUgPSB0eXBlb2YgcGFyZW50VHlwZSA9PT0gJ3N0cmluZycgPyBwYXJlbnRUeXBlIDogcGFyZW50VHlwZS5kaXNwbGF5TmFtZSB8fCBwYXJlbnRUeXBlLm5hbWU7XG4gICAgaWYgKHBhcmVudE5hbWUpIHtcbiAgICAgIGluZm8gPSAnXFxuXFxuQ2hlY2sgdGhlIHRvcC1sZXZlbCByZW5kZXIgY2FsbCB1c2luZyA8JyArIHBhcmVudE5hbWUgKyAnPi4nO1xuICAgIH1cbiAgfVxuICByZXR1cm4gaW5mbztcbn1cblxuLyoqXG4gKiBXYXJuIGlmIHRoZSBlbGVtZW50IGRvZXNuJ3QgaGF2ZSBhbiBleHBsaWNpdCBrZXkgYXNzaWduZWQgdG8gaXQuXG4gKiBUaGlzIGVsZW1lbnQgaXMgaW4gYW4gYXJyYXkuIFRoZSBhcnJheSBjb3VsZCBncm93IGFuZCBzaHJpbmsgb3IgYmVcbiAqIHJlb3JkZXJlZC4gQWxsIGNoaWxkcmVuIHRoYXQgaGF2ZW4ndCBhbHJlYWR5IGJlZW4gdmFsaWRhdGVkIGFyZSByZXF1aXJlZCB0b1xuICogaGF2ZSBhIFwia2V5XCIgcHJvcGVydHkgYXNzaWduZWQgdG8gaXQuIEVycm9yIHN0YXR1c2VzIGFyZSBjYWNoZWQgc28gYSB3YXJuaW5nXG4gKiB3aWxsIG9ubHkgYmUgc2hvd24gb25jZS5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqIEBwYXJhbSB7UmVhY3RFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgdGhhdCByZXF1aXJlcyBhIGtleS5cbiAqIEBwYXJhbSB7Kn0gcGFyZW50VHlwZSBlbGVtZW50J3MgcGFyZW50J3MgdHlwZS5cbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVFeHBsaWNpdEtleShlbGVtZW50LCBwYXJlbnRUeXBlKSB7XG4gIGlmICghZWxlbWVudC5fc3RvcmUgfHwgZWxlbWVudC5fc3RvcmUudmFsaWRhdGVkIHx8IGVsZW1lbnQua2V5ICE9IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZWxlbWVudC5fc3RvcmUudmFsaWRhdGVkID0gdHJ1ZTtcblxuICB2YXIgY3VycmVudENvbXBvbmVudEVycm9ySW5mbyA9IGdldEN1cnJlbnRDb21wb25lbnRFcnJvckluZm8ocGFyZW50VHlwZSk7XG4gIGlmIChvd25lckhhc0tleVVzZVdhcm5pbmdbY3VycmVudENvbXBvbmVudEVycm9ySW5mb10pIHtcbiAgICByZXR1cm47XG4gIH1cbiAgb3duZXJIYXNLZXlVc2VXYXJuaW5nW2N1cnJlbnRDb21wb25lbnRFcnJvckluZm9dID0gdHJ1ZTtcblxuICAvLyBVc3VhbGx5IHRoZSBjdXJyZW50IG93bmVyIGlzIHRoZSBvZmZlbmRlciwgYnV0IGlmIGl0IGFjY2VwdHMgY2hpbGRyZW4gYXMgYVxuICAvLyBwcm9wZXJ0eSwgaXQgbWF5IGJlIHRoZSBjcmVhdG9yIG9mIHRoZSBjaGlsZCB0aGF0J3MgcmVzcG9uc2libGUgZm9yXG4gIC8vIGFzc2lnbmluZyBpdCBhIGtleS5cbiAgdmFyIGNoaWxkT3duZXIgPSAnJztcbiAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC5fb3duZXIgJiYgZWxlbWVudC5fb3duZXIgIT09IFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQpIHtcbiAgICAvLyBHaXZlIHRoZSBjb21wb25lbnQgdGhhdCBvcmlnaW5hbGx5IGNyZWF0ZWQgdGhpcyBjaGlsZC5cbiAgICBjaGlsZE93bmVyID0gJyBJdCB3YXMgcGFzc2VkIGEgY2hpbGQgZnJvbSAnICsgZ2V0Q29tcG9uZW50TmFtZShlbGVtZW50Ll9vd25lci50eXBlKSArICcuJztcbiAgfVxuXG4gIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGVsZW1lbnQpO1xuICB7XG4gICAgd2FybmluZyQxKGZhbHNlLCAnRWFjaCBjaGlsZCBpbiBhbiBhcnJheSBvciBpdGVyYXRvciBzaG91bGQgaGF2ZSBhIHVuaXF1ZSBcImtleVwiIHByb3AuJyArICclcyVzIFNlZSBodHRwczovL2ZiLm1lL3JlYWN0LXdhcm5pbmcta2V5cyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4nLCBjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvLCBjaGlsZE93bmVyKTtcbiAgfVxuICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChudWxsKTtcbn1cblxuLyoqXG4gKiBFbnN1cmUgdGhhdCBldmVyeSBlbGVtZW50IGVpdGhlciBpcyBwYXNzZWQgaW4gYSBzdGF0aWMgbG9jYXRpb24sIGluIGFuXG4gKiBhcnJheSB3aXRoIGFuIGV4cGxpY2l0IGtleXMgcHJvcGVydHkgZGVmaW5lZCwgb3IgaW4gYW4gb2JqZWN0IGxpdGVyYWxcbiAqIHdpdGggdmFsaWQga2V5IHByb3BlcnR5LlxuICpcbiAqIEBpbnRlcm5hbFxuICogQHBhcmFtIHtSZWFjdE5vZGV9IG5vZGUgU3RhdGljYWxseSBwYXNzZWQgY2hpbGQgb2YgYW55IHR5cGUuXG4gKiBAcGFyYW0geyp9IHBhcmVudFR5cGUgbm9kZSdzIHBhcmVudCdzIHR5cGUuXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlQ2hpbGRLZXlzKG5vZGUsIHBhcmVudFR5cGUpIHtcbiAgaWYgKHR5cGVvZiBub2RlICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoQXJyYXkuaXNBcnJheShub2RlKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoaWxkID0gbm9kZVtpXTtcbiAgICAgIGlmIChpc1ZhbGlkRWxlbWVudChjaGlsZCkpIHtcbiAgICAgICAgdmFsaWRhdGVFeHBsaWNpdEtleShjaGlsZCwgcGFyZW50VHlwZSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzVmFsaWRFbGVtZW50KG5vZGUpKSB7XG4gICAgLy8gVGhpcyBlbGVtZW50IHdhcyBwYXNzZWQgaW4gYSB2YWxpZCBsb2NhdGlvbi5cbiAgICBpZiAobm9kZS5fc3RvcmUpIHtcbiAgICAgIG5vZGUuX3N0b3JlLnZhbGlkYXRlZCA9IHRydWU7XG4gICAgfVxuICB9IGVsc2UgaWYgKG5vZGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4obm9kZSk7XG4gICAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBFbnRyeSBpdGVyYXRvcnMgdXNlZCB0byBwcm92aWRlIGltcGxpY2l0IGtleXMsXG4gICAgICAvLyBidXQgbm93IHdlIHByaW50IGEgc2VwYXJhdGUgd2FybmluZyBmb3IgdGhlbSBsYXRlci5cbiAgICAgIGlmIChpdGVyYXRvckZuICE9PSBub2RlLmVudHJpZXMpIHtcbiAgICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKG5vZGUpO1xuICAgICAgICB2YXIgc3RlcCA9IHZvaWQgMDtcbiAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgIGlmIChpc1ZhbGlkRWxlbWVudChzdGVwLnZhbHVlKSkge1xuICAgICAgICAgICAgdmFsaWRhdGVFeHBsaWNpdEtleShzdGVwLnZhbHVlLCBwYXJlbnRUeXBlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBHaXZlbiBhbiBlbGVtZW50LCB2YWxpZGF0ZSB0aGF0IGl0cyBwcm9wcyBmb2xsb3cgdGhlIHByb3BUeXBlcyBkZWZpbml0aW9uLFxuICogcHJvdmlkZWQgYnkgdGhlIHR5cGUuXG4gKlxuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVQcm9wVHlwZXMoZWxlbWVudCkge1xuICB2YXIgdHlwZSA9IGVsZW1lbnQudHlwZTtcbiAgaWYgKHR5cGUgPT09IG51bGwgfHwgdHlwZSA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWUodHlwZSk7XG4gIHZhciBwcm9wVHlwZXMgPSB2b2lkIDA7XG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHByb3BUeXBlcyA9IHR5cGUucHJvcFR5cGVzO1xuICB9IGVsc2UgaWYgKHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSB8fFxuICAvLyBOb3RlOiBNZW1vIG9ubHkgY2hlY2tzIG91dGVyIHByb3BzIGhlcmUuXG4gIC8vIElubmVyIHByb3BzIGFyZSBjaGVja2VkIGluIHRoZSByZWNvbmNpbGVyLlxuICB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEUpKSB7XG4gICAgcHJvcFR5cGVzID0gdHlwZS5wcm9wVHlwZXM7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChwcm9wVHlwZXMpIHtcbiAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChlbGVtZW50KTtcbiAgICBjaGVja1Byb3BUeXBlcyhwcm9wVHlwZXMsIGVsZW1lbnQucHJvcHMsICdwcm9wJywgbmFtZSwgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRTdGFja0FkZGVuZHVtKTtcbiAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChudWxsKTtcbiAgfSBlbHNlIGlmICh0eXBlLlByb3BUeXBlcyAhPT0gdW5kZWZpbmVkICYmICFwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93bikge1xuICAgIHByb3BUeXBlc01pc3NwZWxsV2FybmluZ1Nob3duID0gdHJ1ZTtcbiAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdDb21wb25lbnQgJXMgZGVjbGFyZWQgYFByb3BUeXBlc2AgaW5zdGVhZCBvZiBgcHJvcFR5cGVzYC4gRGlkIHlvdSBtaXNzcGVsbCB0aGUgcHJvcGVydHkgYXNzaWdubWVudD8nLCBuYW1lIHx8ICdVbmtub3duJyk7XG4gIH1cbiAgaWYgKHR5cGVvZiB0eXBlLmdldERlZmF1bHRQcm9wcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICF0eXBlLmdldERlZmF1bHRQcm9wcy5pc1JlYWN0Q2xhc3NBcHByb3ZlZCA/IHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ2dldERlZmF1bHRQcm9wcyBpcyBvbmx5IHVzZWQgb24gY2xhc3NpYyBSZWFjdC5jcmVhdGVDbGFzcyAnICsgJ2RlZmluaXRpb25zLiBVc2UgYSBzdGF0aWMgcHJvcGVydHkgbmFtZWQgYGRlZmF1bHRQcm9wc2AgaW5zdGVhZC4nKSA6IHZvaWQgMDtcbiAgfVxufVxuXG4vKipcbiAqIEdpdmVuIGEgZnJhZ21lbnQsIHZhbGlkYXRlIHRoYXQgaXQgY2FuIG9ubHkgYmUgcHJvdmlkZWQgd2l0aCBmcmFnbWVudCBwcm9wc1xuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGZyYWdtZW50XG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlRnJhZ21lbnRQcm9wcyhmcmFnbWVudCkge1xuICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChmcmFnbWVudCk7XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhmcmFnbWVudC5wcm9wcyk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgIGlmIChrZXkgIT09ICdjaGlsZHJlbicgJiYga2V5ICE9PSAna2V5Jykge1xuICAgICAgd2FybmluZyQxKGZhbHNlLCAnSW52YWxpZCBwcm9wIGAlc2Agc3VwcGxpZWQgdG8gYFJlYWN0LkZyYWdtZW50YC4gJyArICdSZWFjdC5GcmFnbWVudCBjYW4gb25seSBoYXZlIGBrZXlgIGFuZCBgY2hpbGRyZW5gIHByb3BzLicsIGtleSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoZnJhZ21lbnQucmVmICE9PSBudWxsKSB7XG4gICAgd2FybmluZyQxKGZhbHNlLCAnSW52YWxpZCBhdHRyaWJ1dGUgYHJlZmAgc3VwcGxpZWQgdG8gYFJlYWN0LkZyYWdtZW50YC4nKTtcbiAgfVxuXG4gIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KG51bGwpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50V2l0aFZhbGlkYXRpb24odHlwZSwgcHJvcHMsIGNoaWxkcmVuKSB7XG4gIHZhciB2YWxpZFR5cGUgPSBpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSk7XG5cbiAgLy8gV2Ugd2FybiBpbiB0aGlzIGNhc2UgYnV0IGRvbid0IHRocm93LiBXZSBleHBlY3QgdGhlIGVsZW1lbnQgY3JlYXRpb24gdG9cbiAgLy8gc3VjY2VlZCBhbmQgdGhlcmUgd2lsbCBsaWtlbHkgYmUgZXJyb3JzIGluIHJlbmRlci5cbiAgaWYgKCF2YWxpZFR5cGUpIHtcbiAgICB2YXIgaW5mbyA9ICcnO1xuICAgIGlmICh0eXBlID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmIHR5cGUgIT09IG51bGwgJiYgT2JqZWN0LmtleXModHlwZSkubGVuZ3RoID09PSAwKSB7XG4gICAgICBpbmZvICs9ICcgWW91IGxpa2VseSBmb3Jnb3QgdG8gZXhwb3J0IHlvdXIgY29tcG9uZW50IGZyb20gdGhlIGZpbGUgJyArIFwiaXQncyBkZWZpbmVkIGluLCBvciB5b3UgbWlnaHQgaGF2ZSBtaXhlZCB1cCBkZWZhdWx0IGFuZCBuYW1lZCBpbXBvcnRzLlwiO1xuICAgIH1cblxuICAgIHZhciBzb3VyY2VJbmZvID0gZ2V0U291cmNlSW5mb0Vycm9yQWRkZW5kdW0ocHJvcHMpO1xuICAgIGlmIChzb3VyY2VJbmZvKSB7XG4gICAgICBpbmZvICs9IHNvdXJjZUluZm87XG4gICAgfSBlbHNlIHtcbiAgICAgIGluZm8gKz0gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCk7XG4gICAgfVxuXG4gICAgdmFyIHR5cGVTdHJpbmcgPSB2b2lkIDA7XG4gICAgaWYgKHR5cGUgPT09IG51bGwpIHtcbiAgICAgIHR5cGVTdHJpbmcgPSAnbnVsbCc7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHR5cGUpKSB7XG4gICAgICB0eXBlU3RyaW5nID0gJ2FycmF5JztcbiAgICB9IGVsc2UgaWYgKHR5cGUgIT09IHVuZGVmaW5lZCAmJiB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEUpIHtcbiAgICAgIHR5cGVTdHJpbmcgPSAnPCcgKyAoZ2V0Q29tcG9uZW50TmFtZSh0eXBlLnR5cGUpIHx8ICdVbmtub3duJykgKyAnIC8+JztcbiAgICAgIGluZm8gPSAnIERpZCB5b3UgYWNjaWRlbnRhbGx5IGV4cG9ydCBhIEpTWCBsaXRlcmFsIGluc3RlYWQgb2YgYSBjb21wb25lbnQ/JztcbiAgICB9IGVsc2Uge1xuICAgICAgdHlwZVN0cmluZyA9IHR5cGVvZiB0eXBlO1xuICAgIH1cblxuICAgIHdhcm5pbmckMShmYWxzZSwgJ1JlYWN0LmNyZWF0ZUVsZW1lbnQ6IHR5cGUgaXMgaW52YWxpZCAtLSBleHBlY3RlZCBhIHN0cmluZyAoZm9yICcgKyAnYnVpbHQtaW4gY29tcG9uZW50cykgb3IgYSBjbGFzcy9mdW5jdGlvbiAoZm9yIGNvbXBvc2l0ZSAnICsgJ2NvbXBvbmVudHMpIGJ1dCBnb3Q6ICVzLiVzJywgdHlwZVN0cmluZywgaW5mbyk7XG4gIH1cblxuICB2YXIgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAvLyBUaGUgcmVzdWx0IGNhbiBiZSBudWxsaXNoIGlmIGEgbW9jayBvciBhIGN1c3RvbSBmdW5jdGlvbiBpcyB1c2VkLlxuICAvLyBUT0RPOiBEcm9wIHRoaXMgd2hlbiB0aGVzZSBhcmUgbm8gbG9uZ2VyIGFsbG93ZWQgYXMgdGhlIHR5cGUgYXJndW1lbnQuXG4gIGlmIChlbGVtZW50ID09IG51bGwpIHtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIC8vIFNraXAga2V5IHdhcm5pbmcgaWYgdGhlIHR5cGUgaXNuJ3QgdmFsaWQgc2luY2Ugb3VyIGtleSB2YWxpZGF0aW9uIGxvZ2ljXG4gIC8vIGRvZXNuJ3QgZXhwZWN0IGEgbm9uLXN0cmluZy9mdW5jdGlvbiB0eXBlIGFuZCBjYW4gdGhyb3cgY29uZnVzaW5nIGVycm9ycy5cbiAgLy8gV2UgZG9uJ3Qgd2FudCBleGNlcHRpb24gYmVoYXZpb3IgdG8gZGlmZmVyIGJldHdlZW4gZGV2IGFuZCBwcm9kLlxuICAvLyAoUmVuZGVyaW5nIHdpbGwgdGhyb3cgd2l0aCBhIGhlbHBmdWwgbWVzc2FnZSBhbmQgYXMgc29vbiBhcyB0aGUgdHlwZSBpc1xuICAvLyBmaXhlZCwgdGhlIGtleSB3YXJuaW5ncyB3aWxsIGFwcGVhci4pXG4gIGlmICh2YWxpZFR5cGUpIHtcbiAgICBmb3IgKHZhciBpID0gMjsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFsaWRhdGVDaGlsZEtleXMoYXJndW1lbnRzW2ldLCB0eXBlKTtcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRSkge1xuICAgIHZhbGlkYXRlRnJhZ21lbnRQcm9wcyhlbGVtZW50KTtcbiAgfSBlbHNlIHtcbiAgICB2YWxpZGF0ZVByb3BUeXBlcyhlbGVtZW50KTtcbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVGYWN0b3J5V2l0aFZhbGlkYXRpb24odHlwZSkge1xuICB2YXIgdmFsaWRhdGVkRmFjdG9yeSA9IGNyZWF0ZUVsZW1lbnRXaXRoVmFsaWRhdGlvbi5iaW5kKG51bGwsIHR5cGUpO1xuICB2YWxpZGF0ZWRGYWN0b3J5LnR5cGUgPSB0eXBlO1xuICAvLyBMZWdhY3kgaG9vazogcmVtb3ZlIGl0XG4gIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodmFsaWRhdGVkRmFjdG9yeSwgJ3R5cGUnLCB7XG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICBsb3dQcmlvcml0eVdhcm5pbmckMShmYWxzZSwgJ0ZhY3RvcnkudHlwZSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdGhlIGNsYXNzIGRpcmVjdGx5ICcgKyAnYmVmb3JlIHBhc3NpbmcgaXQgdG8gY3JlYXRlRmFjdG9yeS4nKTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd0eXBlJywge1xuICAgICAgICAgIHZhbHVlOiB0eXBlXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHlwZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB2YWxpZGF0ZWRGYWN0b3J5O1xufVxuXG5mdW5jdGlvbiBjbG9uZUVsZW1lbnRXaXRoVmFsaWRhdGlvbihlbGVtZW50LCBwcm9wcywgY2hpbGRyZW4pIHtcbiAgdmFyIG5ld0VsZW1lbnQgPSBjbG9uZUVsZW1lbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgZm9yICh2YXIgaSA9IDI7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YWxpZGF0ZUNoaWxkS2V5cyhhcmd1bWVudHNbaV0sIG5ld0VsZW1lbnQudHlwZSk7XG4gIH1cbiAgdmFsaWRhdGVQcm9wVHlwZXMobmV3RWxlbWVudCk7XG4gIHJldHVybiBuZXdFbGVtZW50O1xufVxuXG52YXIgUmVhY3QgPSB7XG4gIENoaWxkcmVuOiB7XG4gICAgbWFwOiBtYXBDaGlsZHJlbixcbiAgICBmb3JFYWNoOiBmb3JFYWNoQ2hpbGRyZW4sXG4gICAgY291bnQ6IGNvdW50Q2hpbGRyZW4sXG4gICAgdG9BcnJheTogdG9BcnJheSxcbiAgICBvbmx5OiBvbmx5Q2hpbGRcbiAgfSxcblxuICBjcmVhdGVSZWY6IGNyZWF0ZVJlZixcbiAgQ29tcG9uZW50OiBDb21wb25lbnQsXG4gIFB1cmVDb21wb25lbnQ6IFB1cmVDb21wb25lbnQsXG5cbiAgY3JlYXRlQ29udGV4dDogY3JlYXRlQ29udGV4dCxcbiAgZm9yd2FyZFJlZjogZm9yd2FyZFJlZixcbiAgbGF6eTogbGF6eSxcbiAgbWVtbzogbWVtbyxcblxuICBGcmFnbWVudDogUkVBQ1RfRlJBR01FTlRfVFlQRSxcbiAgU3RyaWN0TW9kZTogUkVBQ1RfU1RSSUNUX01PREVfVFlQRSxcbiAgU3VzcGVuc2U6IFJFQUNUX1NVU1BFTlNFX1RZUEUsXG5cbiAgY3JlYXRlRWxlbWVudDogY3JlYXRlRWxlbWVudFdpdGhWYWxpZGF0aW9uLFxuICBjbG9uZUVsZW1lbnQ6IGNsb25lRWxlbWVudFdpdGhWYWxpZGF0aW9uLFxuICBjcmVhdGVGYWN0b3J5OiBjcmVhdGVGYWN0b3J5V2l0aFZhbGlkYXRpb24sXG4gIGlzVmFsaWRFbGVtZW50OiBpc1ZhbGlkRWxlbWVudCxcblxuICB2ZXJzaW9uOiBSZWFjdFZlcnNpb24sXG5cbiAgdW5zdGFibGVfQ29uY3VycmVudE1vZGU6IFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFLFxuICB1bnN0YWJsZV9Qcm9maWxlcjogUkVBQ1RfUFJPRklMRVJfVFlQRSxcblxuICBfX1NFQ1JFVF9JTlRFUk5BTFNfRE9fTk9UX1VTRV9PUl9ZT1VfV0lMTF9CRV9GSVJFRDogUmVhY3RTaGFyZWRJbnRlcm5hbHNcbn07XG5cbi8vIE5vdGU6IHNvbWUgQVBJcyBhcmUgYWRkZWQgd2l0aCBmZWF0dXJlIGZsYWdzLlxuLy8gTWFrZSBzdXJlIHRoYXQgc3RhYmxlIGJ1aWxkcyBmb3Igb3BlbiBzb3VyY2Vcbi8vIGRvbid0IG1vZGlmeSB0aGUgUmVhY3Qgb2JqZWN0IHRvIGF2b2lkIGRlb3B0cy5cbi8vIEFsc28gbGV0J3Mgbm90IGV4cG9zZSB0aGVpciBuYW1lcyBpbiBzdGFibGUgYnVpbGRzLlxuXG5pZiAoZW5hYmxlU3RhYmxlQ29uY3VycmVudE1vZGVBUElzKSB7XG4gIFJlYWN0LkNvbmN1cnJlbnRNb2RlID0gUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEU7XG4gIFJlYWN0LlByb2ZpbGVyID0gUkVBQ1RfUFJPRklMRVJfVFlQRTtcbiAgUmVhY3QudW5zdGFibGVfQ29uY3VycmVudE1vZGUgPSB1bmRlZmluZWQ7XG4gIFJlYWN0LnVuc3RhYmxlX1Byb2ZpbGVyID0gdW5kZWZpbmVkO1xufVxuXG5pZiAoZW5hYmxlSG9va3MpIHtcbiAgUmVhY3QudXNlQ2FsbGJhY2sgPSB1c2VDYWxsYmFjaztcbiAgUmVhY3QudXNlQ29udGV4dCA9IHVzZUNvbnRleHQ7XG4gIFJlYWN0LnVzZUVmZmVjdCA9IHVzZUVmZmVjdDtcbiAgUmVhY3QudXNlSW1wZXJhdGl2ZU1ldGhvZHMgPSB1c2VJbXBlcmF0aXZlTWV0aG9kcztcbiAgUmVhY3QudXNlTGF5b3V0RWZmZWN0ID0gdXNlTGF5b3V0RWZmZWN0O1xuICBSZWFjdC51c2VNZW1vID0gdXNlTWVtbztcbiAgUmVhY3QudXNlUmVkdWNlciA9IHVzZVJlZHVjZXI7XG4gIFJlYWN0LnVzZVJlZiA9IHVzZVJlZjtcbiAgUmVhY3QudXNlU3RhdGUgPSB1c2VTdGF0ZTtcbn1cblxuXG5cbnZhciBSZWFjdCQyID0gT2JqZWN0LmZyZWV6ZSh7XG5cdGRlZmF1bHQ6IFJlYWN0XG59KTtcblxudmFyIFJlYWN0JDMgPSAoIFJlYWN0JDIgJiYgUmVhY3QgKSB8fCBSZWFjdCQyO1xuXG4vLyBUT0RPOiBkZWNpZGUgb24gdGhlIHRvcC1sZXZlbCBleHBvcnQgZm9ybS5cbi8vIFRoaXMgaXMgaGFja3kgYnV0IG1ha2VzIGl0IHdvcmsgd2l0aCBib3RoIFJvbGx1cCBhbmQgSmVzdC5cbnZhciByZWFjdCA9IFJlYWN0JDMuZGVmYXVsdCB8fCBSZWFjdCQzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlYWN0O1xuICB9KSgpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LnByb2R1Y3Rpb24ubWluLmpzJyk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LmRldmVsb3BtZW50LmpzJyk7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9