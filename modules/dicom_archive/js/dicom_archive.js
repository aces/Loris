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
/******/ 	return __webpack_require__(__webpack_require__.s = "./modules/dicom_archive/jsx/dicom_archive.js");
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

/***/ "./modules/dicom_archive/jsx/dicom_archive.js":
/*!****************************************************!*\
  !*** ./modules/dicom_archive/jsx/dicom_archive.js ***!
  \****************************************************/
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





/**
 * DICOM Archive Page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders DICOM Archive main page consisting of FilterTable and
 * DataTable components.
 *
 * @author LORIS Team
 * @version 1.0.0
 *
 * */

var DicomArchive =
/*#__PURE__*/
function (_Component) {
  _inherits(DicomArchive, _Component);

  function DicomArchive(props) {
    var _this;

    _classCallCheck(this, DicomArchive);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DicomArchive).call(this, props));
    _this.state = {
      data: {},
      error: false,
      isLoaded: false
    };
    _this.fetchData = _this.fetchData.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.formatColumn = _this.formatColumn.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(DicomArchive, [{
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
      var result = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, cell);

      switch (column) {
        case 'Archive Location':
          {
            var downloadURL = '/mri/jiv/get_file.php?file=' + cell;
            result = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
              href: downloadURL
            }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
              className: "glyphicon glyphicon-cloud-download"
            }), "\xA0", cell));
          }
          break;

        case 'Metadata':
          {
            var metadataURL = loris.BaseURL + '/dicom_archive/viewDetails/?tarchiveID=' + row.TarchiveID;
            result = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
              href: metadataURL
            }, cell));
          }
          break;

        case 'MRI Browser':
          {
            if (row.SessionID === null || row.SessionID === '') {
              result = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, "\xA0");
            } else {
              var mrlURL = loris.BaseURL + '/imaging_browser/viewSession/?sessionID=' + row.SessionID;
              result = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
                href: mrlURL
              }, cell));
            }

            break;
          }

        case 'INVALID - HIDDEN':
          result = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
            className: "text-danger"
          }, cell);
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
       * XXX: Currently, the order of these fields MUST match the order of the
       * queried columns in _setupVariables() in dicom_archive.class.inc
       */


      var options = this.state.data.fieldOptions;
      var fields = [{
        label: 'Patient ID',
        show: true,
        filter: {
          name: 'patientID',
          type: 'text'
        }
      }, {
        label: 'Patient Name',
        show: true,
        filter: {
          name: 'patientName',
          type: 'text'
        }
      }, {
        label: 'Sex',
        show: true,
        filter: {
          name: 'sex',
          type: 'text'
        }
      }, {
        label: 'Date of Birth',
        show: true,
        filter: {
          name: 'dateOfBirth',
          type: 'date'
        }
      }, {
        label: 'Acquisition Date',
        show: true,
        filter: {
          name: 'acquisitionDate',
          type: 'date'
        }
      }, {
        label: 'Archive Location',
        show: true,
        filter: {
          name: 'archiveLocation',
          type: 'text'
        }
      }, {
        label: 'Metadata',
        show: true
      }, {
        label: 'MRI Browser',
        show: true
      }, {
        label: 'Series UID',
        show: false,
        filter: {
          name: 'seriesUID',
          type: 'text'
        }
      }, {
        label: 'Site',
        show: false,
        filter: {
          name: 'site',
          type: 'select',
          options: options.sites
        }
      }, {
        label: 'TarchiveID',
        show: false
      }, {
        label: 'SessionID',
        show: false
      }];
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FilterableDataTable__WEBPACK_IMPORTED_MODULE_3__["default"], {
        name: "dicom_filter",
        title: "Dicom Archive",
        data: this.state.data.data,
        fields: fields,
        getFormattedCell: this.formatColumn
      });
    }
  }]);

  return DicomArchive;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

DicomArchive.propTypes = {
  dataURL: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired
};
window.addEventListener('load', function () {
  ReactDOM.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(DicomArchive, {
    dataURL: loris.BaseURL + '/dicom_archive/?format=json'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vanN4L0RhdGFUYWJsZS5qcyIsIndlYnBhY2s6Ly8vLi9qc3gvRmlsdGVyLmpzIiwid2VicGFjazovLy8uL2pzeC9GaWx0ZXJhYmxlRGF0YVRhYmxlLmpzIiwid2VicGFjazovLy8uL2pzeC9Gb3JtLmpzIiwid2VicGFjazovLy8uL2pzeC9Mb2FkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanN4L1BhZ2luYXRpb25MaW5rcy5qcyIsIndlYnBhY2s6Ly8vLi9qc3gvUGFuZWwuanMiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9kaWNvbV9hcmNoaXZlL2pzeC9kaWNvbV9hcmNoaXZlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9mYmpzL2xpYi9lbXB0eUZ1bmN0aW9uLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9mYmpzL2xpYi9pbnZhcmlhbnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZianMvbGliL3dhcm5pbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvY2hlY2tQcm9wVHlwZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvZmFjdG9yeVdpdGhUeXBlQ2hlY2tlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZWFjdC1hZGRvbnMtY3JlYXRlLWZyYWdtZW50L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZWFjdC9janMvcmVhY3QuZGV2ZWxvcG1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JlYWN0L2luZGV4LmpzIl0sIm5hbWVzIjpbIkRhdGFUYWJsZSIsInByb3BzIiwic3RhdGUiLCJQYWdlTnVtYmVyIiwiU29ydENvbHVtbiIsIlNvcnRPcmRlciIsIlJvd3NQZXJQYWdlIiwiSGlkZSIsImNoYW5nZVBhZ2UiLCJiaW5kIiwic2V0U29ydENvbHVtbiIsImNoYW5nZVJvd3NQZXJQYWdlIiwiZG93bmxvYWRDU1YiLCJjb3VudEZpbHRlcmVkUm93cyIsImdldFNvcnRlZFJvd3MiLCJoYXNGaWx0ZXJLZXl3b3JkIiwicmVuZGVyQWN0aW9ucyIsImpRdWVyeSIsImZuIiwiRHluYW1pY1RhYmxlIiwiZnJlZXplQ29sdW1uIiwiJCIsImRlZmF1bHRDb2x1bW4iLCJmaW5kIiwiaGlkZSIsIm1vZHVsZVByZWZzIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImxvcmlzIiwiVGVzdE5hbWUiLCJ1bmRlZmluZWQiLCJyb3dzUGVyUGFnZSIsInNldFN0YXRlIiwicHJldlByb3BzIiwicHJldlN0YXRlIiwib25Tb3J0IiwiaW5kZXgiLCJoZWFkZXJMaXN0IiwiZmllbGRzIiwibWFwIiwiZmllbGQiLCJsYWJlbCIsImRhdGEiLCJwYWdlTm8iLCJjb2xOdW1iZXIiLCJlIiwidmFsIiwidGFyZ2V0IiwidmFsdWUiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwiY3N2RGF0YSIsImNzdndvcmtlciIsIldvcmtlciIsIkJhc2VVUkwiLCJhZGRFdmVudExpc3RlbmVyIiwiZGF0YVVSTCIsImRhdGFEYXRlIiwibGluayIsImNtZCIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsIndpbmRvdyIsIlVSTCIsImNyZWF0ZU9iamVjdFVSTCIsIm1lc3NhZ2UiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJkb3dubG9hZCIsInR5cGUiLCJocmVmIiwiYm9keSIsImFwcGVuZENoaWxkIiwiY2xpY2siLCJyZW1vdmVDaGlsZCIsInBvc3RNZXNzYWdlIiwiaGVhZGVycyIsImlkZW50aWZpZXJzIiwiUm93TmFtZU1hcCIsInVzZUtleXdvcmQiLCJmaWx0ZXJNYXRjaENvdW50IiwiZmlsdGVyVmFsdWVzQ291bnQiLCJmaWx0ZXIiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwidGFibGVEYXRhIiwiZmllbGREYXRhIiwia2V5d29yZCIsImkiLCJoZWFkZXJDb3VudCIsImtleXdvcmRNYXRjaCIsImoiLCJuYW1lIiwiaGFzRmlsdGVycyIsImlzU3RyaW5nIiwiU3RyaW5nIiwiaXNOdW1iZXIiLCJpc05hTiIsIk51bWJlciIsInRvTG93ZXJDYXNlIiwicHVzaCIsIlJvd0lkeCIsIlZhbHVlIiwiQ29udGVudCIsInNvcnQiLCJhIiwiYiIsImZpbHRlckRhdGEiLCJleGFjdE1hdGNoIiwicmVzdWx0Iiwic2VhcmNoS2V5Iiwic2VhcmNoU3RyaW5nIiwiaW50RGF0YSIsInBhcnNlSW50Iiwic2VhcmNoQXJyYXkiLCJpbmNsdWRlcyIsImluZGV4T2YiLCJtYXRjaCIsImFjdGlvbnMiLCJhY3Rpb24iLCJrZXkiLCJSb3dOdW1MYWJlbCIsInNob3ciLCJjb2xJbmRleCIsInJvd3MiLCJjdXJSb3ciLCJtYXRjaGVzRm91bmQiLCJmaWx0ZXJlZFJvd3MiLCJjdXJyZW50UGFnZVJvdyIsImZpbHRlcmVkRGF0YSIsImZpbHRlckxlbmd0aCIsImdldEZvcm1hdHRlZENlbGwiLCJyb3ciLCJmb3JFYWNoIiwiayIsImNyZWF0ZUZyYWdtZW50Iiwicm93SW5kZXgiLCJSb3dzUGVyUGFnZURyb3Bkb3duIiwiaGVhZGVyIiwibWFyZ2luVG9wIiwiZm9vdGVyIiwibWFyZ2luIiwiQ29tcG9uZW50IiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwiYXJyYXkiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwiZnVuYyIsIm9iamVjdCIsImRlZmF1bHRQcm9wcyIsIkZpbHRlciIsIm9uRmllbGRVcGRhdGUiLCJyZW5kZXJGaWx0ZXJGaWVsZHMiLCJpZCIsInVwZGF0ZUZpbHRlciIsInJlZHVjZSIsImVsZW1lbnQiLCJvcHRpb25zIiwiUmVhY3QiLCJjbG9uZUVsZW1lbnQiLCJvblVzZXJJbnB1dCIsImNvbHVtbnMiLCJ0aXRsZSIsImNsZWFyRmlsdGVyIiwiY29uc29sZSIsIndhcm4iLCJGaWx0ZXJhYmxlRGF0YVRhYmxlIiwibnVtYmVyIiwiRm9ybUVsZW1lbnQiLCJnZXRGb3JtRWxlbWVudHMiLCJoYW5kbGVTdWJtaXQiLCJmb3JtRWxlbWVudHNIVE1MIiwibWF4Q29sdW1uU2l6ZSIsImNvbFNpemUiLCJNYXRoIiwiZmxvb3IiLCJjb2xDbGFzcyIsImZvcm1FbGVtZW50cyIsIm9iaktleSIsInVzZXJJbnB1dCIsIkNoaWxkcmVuIiwiY2hpbGRyZW4iLCJjaGlsZCIsImVsZW1lbnRDbGFzcyIsImlzVmFsaWRFbGVtZW50Iiwib25TdWJtaXQiLCJwcmV2ZW50RGVmYXVsdCIsImVuY1R5cGUiLCJmaWxlVXBsb2FkIiwicm93U3R5bGVzIiwiZGlzcGxheSIsImZsZXhXcmFwIiwiY2xhc3MiLCJtZXRob2QiLCJvbmVPZiIsInNoYXBlIiwiZWxlbWVudE5hbWUiLCJGaWVsZHNldEVsZW1lbnQiLCJsZWdlbmQiLCJTZWFyY2hhYmxlRHJvcGRvd24iLCJnZXRLZXlGcm9tVmFsdWUiLCJoYW5kbGVDaGFuZ2UiLCJoYW5kbGVCbHVyIiwiZ2V0VGV4dElucHV0VmFsdWUiLCJvIiwic3RyaWN0U2VhcmNoIiwidmFsdWVzIiwicXVlcnlTZWxlY3RvciIsInJlcXVpcmVkIiwiZGlzYWJsZWQiLCJzb3J0QnlWYWx1ZSIsInN0cmljdE1lc3NhZ2UiLCJlcnJvck1lc3NhZ2UiLCJyZXF1aXJlZEhUTUwiLCJtc2ciLCJuZXdPcHRpb25zIiwib3B0aW9uTGlzdCIsImhhc093blByb3BlcnR5Iiwib3B0aW9uIiwicGxhY2VIb2xkZXIiLCJib29sIiwib25lT2ZUeXBlIiwiU2VsZWN0RWxlbWVudCIsIm51bU9mT3B0aW9ucyIsIm11bHRpcGxlIiwibCIsInNlbGVjdGVkIiwiZW1wdHlPcHRpb25IVE1MIiwiZW1wdHlPcHRpb24iLCJoYXNFcnJvciIsIlRhZ3NFbGVtZW50IiwiaGFuZGxlS2V5UHJlc3MiLCJoYW5kbGVBZGQiLCJoYW5kbGVSZW1vdmUiLCJjYW5BZGRJdGVtIiwicGVuZGluZ1ZhbEtleSIsImtleUNvZGUiLCJ3aGljaCIsInVzZVNlYXJjaCIsIm9uVXNlckFkZCIsImdldEF0dHJpYnV0ZSIsIm9uVXNlclJlbW92ZSIsImFsbG93RHVwbCIsIml0ZW1zIiwiaW5wdXQiLCJpdGVtIiwiaXRtVHh0IiwiYnRuTGFiZWwiLCJUZXh0YXJlYUVsZW1lbnQiLCJjb2xzIiwiVGV4dGJveEVsZW1lbnQiLCJvblVzZXJCbHVyIiwiRGF0ZUVsZW1lbnQiLCJtaW5ZZWFyIiwibWF4WWVhciIsIlRpbWVFbGVtZW50IiwiTnVtZXJpY0VsZW1lbnQiLCJtaW4iLCJtYXgiLCJGaWxlRWxlbWVudCIsImZpbGUiLCJmaWxlcyIsImZpbGVOYW1lIiwidHJ1bmNhdGVFbGxpcHNpcyIsInRhYmxlTGF5b3V0Iiwid2lkdGgiLCJ3aGl0ZVNwYWNlIiwidHJ1bmNhdGVFbGxpcHNpc0NoaWxkIiwib3ZlcmZsb3ciLCJ0ZXh0T3ZlcmZsb3ciLCJmaWxlSFRNTCIsInBhZGRpbmdUb3AiLCJTdGF0aWNFbGVtZW50IiwidGV4dCIsIkxpbmtFbGVtZW50IiwiQ2hlY2tib3hFbGVtZW50IiwiY2hlY2tlZCIsIkJ1dHRvbkVsZW1lbnQiLCJoYW5kbGVDbGljayIsImNvbHVtblNpemUiLCJidXR0b25DbGFzcyIsIkNUQSIsIkxvcmlzRWxlbWVudCIsImVsZW1lbnRQcm9wcyIsInJlZiIsImVsZW1lbnRIdG1sIiwiTG9hZGVyIiwic2l6ZSIsImhlaWdodCIsIlBhZ2luYXRpb25MaW5rcyIsImV2dCIsIm9uQ2hhbmdlUGFnZSIsInBhZ2VMaW5rcyIsImNsYXNzTGlzdCIsImxhc3RQYWdlIiwiY2VpbCIsIlRvdGFsIiwic3RhcnRQYWdlIiwiQWN0aXZlIiwibGFzdFNob3duUGFnZSIsInRvU3RyaW5nIiwiUlBhZ2luYXRpb25MaW5rcyIsImNyZWF0ZUZhY3RvcnkiLCJQYW5lbCIsImNvbGxhcHNlZCIsImluaXRDb2xsYXBzZWQiLCJwYW5lbENsYXNzIiwidG9nZ2xlQ29sbGFwc2VkIiwiZ2x5cGhDbGFzcyIsInBhbmVsSGVhZGluZyIsImN1cnNvciIsIkRpY29tQXJjaGl2ZSIsImVycm9yIiwiaXNMb2FkZWQiLCJmZXRjaERhdGEiLCJmb3JtYXRDb2x1bW4iLCJ0aGVuIiwiZmV0Y2giLCJjcmVkZW50aWFscyIsInJlc3AiLCJqc29uIiwiY2F0Y2giLCJjb2x1bW4iLCJjZWxsIiwiZG93bmxvYWRVUkwiLCJtZXRhZGF0YVVSTCIsIlRhcmNoaXZlSUQiLCJTZXNzaW9uSUQiLCJtcmxVUkwiLCJmaWVsZE9wdGlvbnMiLCJzaXRlcyIsIlJlYWN0RE9NIiwicmVuZGVyIiwiZ2V0RWxlbWVudEJ5SWQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRkE7Ozs7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O0FBQ0EsU0FBUztBQUNULDRCQUE0QjtBQUM1QixPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsUUFBUSxJQUFxQztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFVBQVUsS0FBcUM7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsc0JBQXNCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FB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QUV4RDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOzs7QUFHQSxrREFBa0Q7OztBQUdsRDs7O0FBR0E7OztBQUdBO0FBQ0E7O0FBRUE7OztBQUdBOzs7QUFHQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUEsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxzRkFBc0YsYUFBYTtBQUNuRztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0RkFBNEYsZUFBZTtBQUMzRztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0Esc0ZBQXNGLGFBQWE7QUFDbkc7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFPQUFxTztBQUNyTztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxXQUFXO0FBQ3hCLGNBQWMsUUFBUTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsV0FBVztBQUN4QixhQUFhLFVBQVU7QUFDdkIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsV0FBVztBQUN4QixhQUFhLE9BQU87QUFDcEIsYUFBYSxVQUFVO0FBQ3ZCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxXQUFXO0FBQ3hCLGFBQWEsT0FBTztBQUNwQixhQUFhLFVBQVU7QUFDdkIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGdCQUFnQjtBQUMzQjtBQUNBLFdBQVcsVUFBVTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsVUFBVTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzRkFBc0YsYUFBYTtBQUNuRztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLFdBQVcsRUFBRTtBQUNiLFdBQVcsY0FBYztBQUN6QixXQUFXLEVBQUU7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsV0FBVyxFQUFFO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLG1CQUFtQixvQkFBb0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0Esd0JBQXdCOztBQUV4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFlBQVksYUFBYTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsYUFBYTtBQUN4QixXQUFXLEVBQUU7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFVBQVU7QUFDckIsV0FBVyxFQUFFO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGlCQUFpQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxhQUFhO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxhQUFhO0FBQ3hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixpQkFBaUI7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHNCQUFzQjtBQUN6QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixzQkFBc0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7Ozs7Ozs7Ozs7Ozs7QUMxMURhOztBQUViLElBQUksS0FBcUMsRUFBRSxFQUUxQztBQUNELG1CQUFtQixtQkFBTyxDQUFDLGlGQUE0QjtBQUN2RCIsImZpbGUiOiIuL21vZHVsZXMvZGljb21fYXJjaGl2ZS9qcy9kaWNvbV9hcmNoaXZlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9tb2R1bGVzL2RpY29tX2FyY2hpdmUvanN4L2RpY29tX2FyY2hpdmUuanNcIik7XG4iLCIvKipcbiAqIFRoaXMgZmlsZSBjb250YWlucyBSZWFjdCBjb21wb25lbnQgZm9yIERhdGEgVGFibGVcbiAqXG4gKiBAYXV0aG9yIExvcmlzIFRlYW1cbiAqIEB2ZXJzaW9uIDEuMC4wXG4gKlxuICovXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBQYWdpbmF0aW9uTGlua3MgZnJvbSAnLi9QYWdpbmF0aW9uTGlua3MnO1xuaW1wb3J0IGNyZWF0ZUZyYWdtZW50IGZyb20gJ3JlYWN0LWFkZG9ucy1jcmVhdGUtZnJhZ21lbnQnO1xuaW1wb3J0IENUQSBmcm9tICcuL0Zvcm0nO1xuXG4vKipcbiAqIERhdGEgVGFibGUgY29tcG9uZW50XG4gKiBEaXNwbGF5cyBhIHNldCBvZiBkYXRhIHRoYXQgaXMgcmVjZWl2ZXMgdmlhIHByb3BzLlxuICovXG5jbGFzcyBEYXRhVGFibGUgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBQYWdlTnVtYmVyOiAxLFxuICAgICAgU29ydENvbHVtbjogLTEsXG4gICAgICBTb3J0T3JkZXI6ICdBU0MnLFxuICAgICAgUm93c1BlclBhZ2U6IDIwLFxuICAgICAgSGlkZTogdGhpcy5wcm9wcy5IaWRlLFxuICAgIH07XG5cbiAgICB0aGlzLmNoYW5nZVBhZ2UgPSB0aGlzLmNoYW5nZVBhZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNldFNvcnRDb2x1bW4gPSB0aGlzLnNldFNvcnRDb2x1bW4uYmluZCh0aGlzKTtcbiAgICB0aGlzLmNoYW5nZVJvd3NQZXJQYWdlID0gdGhpcy5jaGFuZ2VSb3dzUGVyUGFnZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZG93bmxvYWRDU1YgPSB0aGlzLmRvd25sb2FkQ1NWLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jb3VudEZpbHRlcmVkUm93cyA9IHRoaXMuY291bnRGaWx0ZXJlZFJvd3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldFNvcnRlZFJvd3MgPSB0aGlzLmdldFNvcnRlZFJvd3MuYmluZCh0aGlzKTsvL1xuICAgIHRoaXMuaGFzRmlsdGVyS2V5d29yZCA9IHRoaXMuaGFzRmlsdGVyS2V5d29yZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVuZGVyQWN0aW9ucyA9IHRoaXMucmVuZGVyQWN0aW9ucy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgaWYgKGpRdWVyeS5mbi5EeW5hbWljVGFibGUpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLmZyZWV6ZUNvbHVtbikge1xuICAgICAgICAkKCcjZHluYW1pY3RhYmxlJykuRHluYW1pY1RhYmxlKHtcbiAgICAgICAgICBmcmVlemVDb2x1bW46IHRoaXMucHJvcHMuZnJlZXplQ29sdW1uLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoJyNkeW5hbWljdGFibGUnKS5EeW5hbWljVGFibGUoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnN0YXRlLkhpZGUuZGVmYXVsdENvbHVtbikge1xuICAgICAgICAkKCcjZHluYW1pY3RhYmxlJykuZmluZCgndGJvZHkgdGQ6ZXEoMCknKS5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0cmlldmUgbW9kdWxlIHByZWZlcmVuY2VzXG4gICAgbGV0IG1vZHVsZVByZWZzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbW9kdWxlUHJlZnMnKSk7XG5cbiAgICAvLyBJbml0IG1vZHVsZVByZWZzIG9iamVjdFxuICAgIGlmIChtb2R1bGVQcmVmcyA9PT0gbnVsbCkge1xuICAgICAgbW9kdWxlUHJlZnMgPSB7fTtcbiAgICB9XG5cbiAgICAvLyBJbml0IG1vZHVsZVByZWZzIGZvciBjdXJyZW50IG1vZHVsZVxuICAgIGlmIChtb2R1bGVQcmVmc1tsb3Jpcy5UZXN0TmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgbW9kdWxlUHJlZnNbbG9yaXMuVGVzdE5hbWVdID0ge307XG4gICAgICBtb2R1bGVQcmVmc1tsb3Jpcy5UZXN0TmFtZV0ucm93c1BlclBhZ2UgPSB0aGlzLnN0YXRlLlJvd3NQZXJQYWdlO1xuICAgIH1cblxuICAgIC8vIFNldCByb3dzIHBlciBwYWdlXG4gICAgY29uc3Qgcm93c1BlclBhZ2UgPSBtb2R1bGVQcmVmc1tsb3Jpcy5UZXN0TmFtZV0ucm93c1BlclBhZ2U7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBSb3dzUGVyUGFnZTogcm93c1BlclBhZ2UsXG4gICAgfSk7XG5cbiAgICAvLyBNYWtlIHByZWZzIGFjY2VzaWJsZSB3aXRoaW4gY29tcG9uZW50XG4gICAgdGhpcy5tb2R1bGVQcmVmcyA9IG1vZHVsZVByZWZzO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgaWYgKGpRdWVyeS5mbi5EeW5hbWljVGFibGUpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLmZyZWV6ZUNvbHVtbikge1xuICAgICAgICAkKCcjZHluYW1pY3RhYmxlJykuRHluYW1pY1RhYmxlKHtcbiAgICAgICAgICBmcmVlemVDb2x1bW46IHRoaXMucHJvcHMuZnJlZXplQ29sdW1uLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoJyNkeW5hbWljdGFibGUnKS5EeW5hbWljVGFibGUoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMucHJvcHMub25Tb3J0ICYmXG4gICAgICAodGhpcy5zdGF0ZS5Tb3J0Q29sdW1uICE9PSBwcmV2U3RhdGUuU29ydENvbHVtbiB8fFxuICAgICAgICB0aGlzLnN0YXRlLlNvcnRPcmRlciAhPT0gcHJldlN0YXRlLlNvcnRPcmRlcilcbiAgICApIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5nZXRTb3J0ZWRSb3dzKCk7XG4gICAgICBjb25zdCBoZWFkZXJMaXN0ID0gdGhpcy5wcm9wcy5maWVsZHMubWFwKChmaWVsZCkgPT4gZmllbGQubGFiZWwpO1xuICAgICAgdGhpcy5wcm9wcy5vblNvcnQoaW5kZXgsIHRoaXMucHJvcHMuZGF0YSwgaGVhZGVyTGlzdCk7XG4gICAgfVxuICB9XG5cbiAgY2hhbmdlUGFnZShwYWdlTm8pIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIFBhZ2VOdW1iZXI6IHBhZ2VObyxcbiAgICB9KTtcbiAgfVxuXG4gIHNldFNvcnRDb2x1bW4oY29sTnVtYmVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLlNvcnRDb2x1bW4gPT09IGNvbE51bWJlcikge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBTb3J0T3JkZXI6IHRoaXMuc3RhdGUuU29ydE9yZGVyID09PSAnQVNDJyA/ICdERVNDJyA6ICdBU0MnLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIFNvcnRDb2x1bW46IGNvbE51bWJlcixcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGNoYW5nZVJvd3NQZXJQYWdlKHZhbCkge1xuICAgIGNvbnN0IHJvd3NQZXJQYWdlID0gdmFsLnRhcmdldC52YWx1ZTtcbiAgICBjb25zdCBtb2R1bGVQcmVmcyA9IHRoaXMubW9kdWxlUHJlZnM7XG5cbiAgICAvLyBTYXZlIGN1cnJlbnQgc2VsZWN0aW9uXG4gICAgbW9kdWxlUHJlZnNbbG9yaXMuVGVzdE5hbWVdLnJvd3NQZXJQYWdlID0gcm93c1BlclBhZ2U7XG5cbiAgICAvLyBVcGRhdGUgbG9jYWxzdG9yYWdlXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ21vZHVsZVByZWZzJywgSlNPTi5zdHJpbmdpZnkobW9kdWxlUHJlZnMpKTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgUm93c1BlclBhZ2U6IHJvd3NQZXJQYWdlLFxuICAgICAgUGFnZU51bWJlcjogMSxcbiAgICB9KTtcbiAgfVxuXG4gIGRvd25sb2FkQ1NWKGNzdkRhdGEpIHtcbiAgICBjb25zdCBjc3Z3b3JrZXIgPSBuZXcgV29ya2VyKGxvcmlzLkJhc2VVUkwgKyAnL2pzL3dvcmtlcnMvc2F2ZWNzdi5qcycpO1xuXG4gICAgY3N2d29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgICBsZXQgZGF0YVVSTDtcbiAgICAgIGxldCBkYXRhRGF0ZTtcbiAgICAgIGxldCBsaW5rO1xuICAgICAgaWYgKGUuZGF0YS5jbWQgPT09ICdTYXZlQ1NWJykge1xuICAgICAgICBkYXRhRGF0ZSA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICAgICAgZGF0YVVSTCA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGUuZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgbGluay5kb3dubG9hZCA9ICdkYXRhLScgKyBkYXRhRGF0ZSArICcuY3N2JztcbiAgICAgICAgbGluay50eXBlID0gJ3RleHQvY3N2JztcbiAgICAgICAgbGluay5ocmVmID0gZGF0YVVSTDtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgICAgJChsaW5rKVswXS5jbGljaygpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGhlYWRlckxpc3QgPSB0aGlzLnByb3BzLmZpZWxkcy5tYXAoKGZpZWxkKSA9PiBmaWVsZC5sYWJlbCk7XG4gICAgY3N2d29ya2VyLnBvc3RNZXNzYWdlKHtcbiAgICAgIGNtZDogJ1NhdmVGaWxlJyxcbiAgICAgIGRhdGE6IGNzdkRhdGEsXG4gICAgICBoZWFkZXJzOiBoZWFkZXJMaXN0LFxuICAgICAgaWRlbnRpZmllcnM6IHRoaXMucHJvcHMuUm93TmFtZU1hcCxcbiAgICB9KTtcbiAgfVxuXG4gIGNvdW50RmlsdGVyZWRSb3dzKCkge1xuICAgIGxldCB1c2VLZXl3b3JkID0gZmFsc2U7XG4gICAgbGV0IGZpbHRlck1hdGNoQ291bnQgPSAwO1xuICAgIGxldCBmaWx0ZXJWYWx1ZXNDb3VudCA9ICh0aGlzLnByb3BzLmZpbHRlciA/XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMucHJvcHMuZmlsdGVyKS5sZW5ndGggOlxuICAgICAgICAwXG4gICAgKTtcbiAgICBjb25zdCB0YWJsZURhdGEgPSB0aGlzLnByb3BzLmRhdGE7XG4gICAgY29uc3QgZmllbGREYXRhID0gdGhpcy5wcm9wcy5maWVsZHM7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5maWx0ZXIua2V5d29yZCkge1xuICAgICAgdXNlS2V5d29yZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHVzZUtleXdvcmQpIHtcbiAgICAgIGZpbHRlclZhbHVlc0NvdW50IC09IDE7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJsZURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBoZWFkZXJDb3VudCA9IDA7XG4gICAgICBsZXQga2V5d29yZE1hdGNoID0gMDtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZmllbGREYXRhLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0YWJsZURhdGFbaV0gPyB0YWJsZURhdGFbaV1bal0gOiBudWxsO1xuICAgICAgICBpZiAodGhpcy5oYXNGaWx0ZXJLZXl3b3JkKChmaWVsZERhdGFbal0uZmlsdGVyIHx8IHt9KS5uYW1lLCBkYXRhKSkge1xuICAgICAgICAgIGhlYWRlckNvdW50Kys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVzZUtleXdvcmQpIHtcbiAgICAgICAgICBpZiAodGhpcy5oYXNGaWx0ZXJLZXl3b3JkKCdrZXl3b3JkJywgZGF0YSkpIHtcbiAgICAgICAgICAgIGtleXdvcmRNYXRjaCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoaGVhZGVyQ291bnQgPT09IGZpbHRlclZhbHVlc0NvdW50ICYmXG4gICAgICAgICgodXNlS2V5d29yZCA9PT0gdHJ1ZSAmJiBrZXl3b3JkTWF0Y2ggPiAwKSB8fFxuICAgICAgICAgICh1c2VLZXl3b3JkID09PSBmYWxzZSAmJiBrZXl3b3JkTWF0Y2ggPT09IDApKSkge1xuICAgICAgICBmaWx0ZXJNYXRjaENvdW50Kys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaGFzRmlsdGVycyA9IChmaWx0ZXJWYWx1ZXNDb3VudCAhPT0gMCk7XG4gICAgaWYgKGZpbHRlck1hdGNoQ291bnQgPT09IDAgJiYgaGFzRmlsdGVycykge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIChmaWx0ZXJNYXRjaENvdW50ID09PSAwKSA/IHRhYmxlRGF0YS5sZW5ndGggOiBmaWx0ZXJNYXRjaENvdW50O1xuICB9XG5cbiAgZ2V0U29ydGVkUm93cygpIHtcbiAgICBjb25zdCBpbmRleCA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByb3BzLmRhdGEubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGxldCB2YWwgPSB0aGlzLnByb3BzLmRhdGFbaV1bdGhpcy5zdGF0ZS5Tb3J0Q29sdW1uXSB8fCB1bmRlZmluZWQ7XG4gICAgICAvLyBJZiBTb3J0Q29sdW1uIGlzIGVxdWFsIHRvIGRlZmF1bHQgTm8uIGNvbHVtbiwgc2V0IHZhbHVlIHRvIGJlXG4gICAgICAvLyBpbmRleCArIDFcbiAgICAgIGlmICh0aGlzLnN0YXRlLlNvcnRDb2x1bW4gPT09IC0xKSB7XG4gICAgICAgIHZhbCA9IGkgKyAxO1xuICAgICAgfVxuICAgICAgY29uc3QgaXNTdHJpbmcgPSAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgfHwgdmFsIGluc3RhbmNlb2YgU3RyaW5nKTtcbiAgICAgIGNvbnN0IGlzTnVtYmVyID0gIWlzTmFOKHZhbCkgJiYgdHlwZW9mIHZhbCAhPT0gJ29iamVjdCc7XG5cbiAgICAgIGlmICh2YWwgPT09ICcuJykge1xuICAgICAgICAvLyBoYWNrIHRvIGhhbmRsZSBub24tZXhpc3RlbnQgaXRlbXMgaW4gRFFUXG4gICAgICAgIHZhbCA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKGlzTnVtYmVyKSB7XG4gICAgICAgIC8vIHBlcmZvcm0gdHlwZSBjb252ZXJzaW9uIChmcm9tIHN0cmluZyB0byBpbnQvZmxvYXQpXG4gICAgICAgIHZhbCA9IE51bWJlcih2YWwpO1xuICAgICAgfSBlbHNlIGlmIChpc1N0cmluZykge1xuICAgICAgICAvLyBpZiBzdHJpbmcgd2l0aCB0ZXh0IGNvbnZlcnQgdG8gbG93ZXJjYXNlXG4gICAgICAgIHZhbCA9IHZhbC50b0xvd2VyQ2FzZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5wcm9wcy5Sb3dOYW1lTWFwKSB7XG4gICAgICAgIGluZGV4LnB1c2goe1Jvd0lkeDogaSwgVmFsdWU6IHZhbCwgQ29udGVudDogdGhpcy5wcm9wcy5Sb3dOYW1lTWFwW2ldfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmRleC5wdXNoKHtSb3dJZHg6IGksIFZhbHVlOiB2YWwsIENvbnRlbnQ6IGkgKyAxfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW5kZXguc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5Tb3J0T3JkZXIgPT09ICdBU0MnKSB7XG4gICAgICAgIGlmIChhLlZhbHVlID09PSBiLlZhbHVlKSB7XG4gICAgICAgICAgLy8gSWYgYWxsIHZhbHVlcyBhcmUgZXF1YWwsIHNvcnQgYnkgcm93bnVtXG4gICAgICAgICAgaWYgKGEuUm93SWR4IDwgYi5Sb3dJZHgpIHJldHVybiAtMTtcbiAgICAgICAgICBpZiAoYS5Sb3dJZHggPiBiLlJvd0lkeCkgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2hlY2sgaWYgbnVsbCB2YWx1ZXNcbiAgICAgICAgaWYgKGEuVmFsdWUgPT09IG51bGwgfHwgdHlwZW9mIGEuVmFsdWUgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gLTE7XG4gICAgICAgIGlmIChiLlZhbHVlID09PSBudWxsIHx8IHR5cGVvZiBiLlZhbHVlID09PSAndW5kZWZpbmVkJykgcmV0dXJuIDE7XG5cbiAgICAgICAgLy8gU29ydCBieSB2YWx1ZVxuICAgICAgICBpZiAoYS5WYWx1ZSA8IGIuVmFsdWUpIHJldHVybiAtMTtcbiAgICAgICAgaWYgKGEuVmFsdWUgPiBiLlZhbHVlKSByZXR1cm4gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChhLlZhbHVlID09PSBiLlZhbHVlKSB7XG4gICAgICAgICAgLy8gSWYgYWxsIHZhbHVlcyBhcmUgZXF1YWwsIHNvcnQgYnkgcm93bnVtXG4gICAgICAgICAgaWYgKGEuUm93SWR4IDwgYi5Sb3dJZHgpIHJldHVybiAxO1xuICAgICAgICAgIGlmIChhLlJvd0lkeCA+IGIuUm93SWR4KSByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2hlY2sgaWYgbnVsbCB2YWx1ZXNcbiAgICAgICAgaWYgKGEuVmFsdWUgPT09IG51bGwgfHwgdHlwZW9mIGEuVmFsdWUgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGIuVmFsdWUgPT09IG51bGwgfHwgdHlwZW9mIGIuVmFsdWUgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gLTE7XG5cbiAgICAgICAgLy8gU29ydCBieSB2YWx1ZVxuICAgICAgICBpZiAoYS5WYWx1ZSA8IGIuVmFsdWUpIHJldHVybiAxO1xuICAgICAgICBpZiAoYS5WYWx1ZSA+IGIuVmFsdWUpIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIC8vIFRoZXkncmUgZXF1YWwuLlxuICAgICAgcmV0dXJuIDA7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICByZXR1cm4gaW5kZXg7XG4gIH1cblxuICAvKipcbiAgICogU2VhcmNoZXMgZm9yIHRoZSBmaWx0ZXIga2V5d29yZCBpbiB0aGUgY29sdW1uIGNlbGxcbiAgICpcbiAgICogTm90ZTogU2VhcmNoIGlzIGNhc2UtaW5zZW5zaXRpdmUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIGZpZWxkIG5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRhdGEgc2VhcmNoIHN0cmluZ1xuICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlLCBpZiBmaWx0ZXIgdmFsdWUgaXMgZm91bmQgdG8gYmUgYSBzdWJzdHJpbmdcbiAgICogb2Ygb25lIG9mIHRoZSBjb2x1bW4gdmFsdWVzLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBoYXNGaWx0ZXJLZXl3b3JkKG5hbWUsIGRhdGEpIHtcbiAgICBsZXQgZmlsdGVyRGF0YSA9IG51bGw7XG4gICAgbGV0IGV4YWN0TWF0Y2ggPSBmYWxzZTtcbiAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XG4gICAgbGV0IHNlYXJjaEtleSA9IG51bGw7XG4gICAgbGV0IHNlYXJjaFN0cmluZyA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5maWx0ZXJbbmFtZV0pIHtcbiAgICAgIGZpbHRlckRhdGEgPSB0aGlzLnByb3BzLmZpbHRlcltuYW1lXS52YWx1ZTtcbiAgICAgIGV4YWN0TWF0Y2ggPSB0aGlzLnByb3BzLmZpbHRlcltuYW1lXS5leGFjdE1hdGNoO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBudWxsIGlucHV0c1xuICAgIGlmIChmaWx0ZXJEYXRhID09PSBudWxsIHx8IGRhdGEgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgbnVtZXJpYyBpbnB1dHNcbiAgICBpZiAodHlwZW9mIGZpbHRlckRhdGEgPT09ICdudW1iZXInKSB7XG4gICAgICBjb25zdCBpbnREYXRhID0gTnVtYmVyLnBhcnNlSW50KGRhdGEsIDEwKTtcbiAgICAgIHJlc3VsdCA9IChmaWx0ZXJEYXRhID09PSBpbnREYXRhKTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgc3RyaW5nIGlucHV0c1xuICAgIGlmICh0eXBlb2YgZmlsdGVyRGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHNlYXJjaEtleSA9IGZpbHRlckRhdGEudG9Mb3dlckNhc2UoKTtcbiAgICAgIHN3aXRjaCAodHlwZW9mIGRhdGEpIHtcbiAgICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgICAvLyBIYW5kbGVzIHRoZSBjYXNlIHdoZXJlIHRoZSBkYXRhIGlzIGFuIGFycmF5ICh0eXBlb2YgJ29iamVjdCcpXG4gICAgICAgICAgLy8gYW5kIHlvdSB3YW50IHRvIHNlYXJjaCB0aHJvdWdoIGl0IGZvclxuICAgICAgICAgIC8vIHRoZSBzdHJpbmcgeW91IGFyZSBmaWx0ZXJpbmcgYnlcbiAgICAgICAgICBjb25zdCBzZWFyY2hBcnJheSA9IGRhdGEubWFwKChlKSA9PiBlLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgIGlmIChleGFjdE1hdGNoKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBzZWFyY2hBcnJheS5pbmNsdWRlcyhzZWFyY2hLZXkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSAoc2VhcmNoQXJyYXkuZmluZCgoZSkgPT4gKGUuaW5kZXhPZihzZWFyY2hLZXkpID4gLTEpKSkgIT09IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgc2VhcmNoU3RyaW5nID0gZGF0YS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgIGlmIChleGFjdE1hdGNoKSB7XG4gICAgICAgICAgICByZXN1bHQgPSAoc2VhcmNoU3RyaW5nID09PSBzZWFyY2hLZXkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSAoc2VhcmNoU3RyaW5nLmluZGV4T2Yoc2VhcmNoS2V5KSA+IC0xKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIGFycmF5IGlucHV0cyBmb3IgbXVsdGlzZWxlY3RzXG4gICAgaWYgKHR5cGVvZiBmaWx0ZXJEYXRhID09PSAnb2JqZWN0Jykge1xuICAgICAgbGV0IG1hdGNoID0gZmFsc2U7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbHRlckRhdGEubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgc2VhcmNoS2V5ID0gZmlsdGVyRGF0YVtpXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBzZWFyY2hTdHJpbmcgPSBkYXRhLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgbWF0Y2ggPSAoc2VhcmNoU3RyaW5nLmluZGV4T2Yoc2VhcmNoS2V5KSA+IC0xKTtcbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICByZW5kZXJBY3Rpb25zKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmFjdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmFjdGlvbnMubWFwKChhY3Rpb24sIGtleSkgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxDVEFcbiAgICAgICAgICAgIGtleT17a2V5fVxuICAgICAgICAgICAgbGFiZWw9e2FjdGlvbi5sYWJlbH1cbiAgICAgICAgICAgIG9uVXNlcklucHV0PXthY3Rpb24uYWN0aW9ufVxuICAgICAgICAgIC8+XG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuZGF0YSA9PT0gbnVsbCB8fCB0aGlzLnByb3BzLmRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYWxlcnQgYWxlcnQtaW5mbyBuby1yZXN1bHQtZm91bmQtcGFuZWwnPlxuICAgICAgICAgIDxzdHJvbmc+Tm8gcmVzdWx0IGZvdW5kLjwvc3Ryb25nPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICAgIGNvbnN0IHJvd3NQZXJQYWdlID0gdGhpcy5zdGF0ZS5Sb3dzUGVyUGFnZTtcbiAgICBjb25zdCBoZWFkZXJzID0gdGhpcy5zdGF0ZS5IaWRlLmRlZmF1bHRDb2x1bW4gPT09IHRydWUgPyBbXSA6IFtcbiAgICAgIDx0aCBrZXk9J3RoX2NvbF8wJyBvbkNsaWNrPXt0aGlzLnNldFNvcnRDb2x1bW4oLTEpLmJpbmQodGhpcyl9PlxuICAgICAgICB7dGhpcy5wcm9wcy5Sb3dOdW1MYWJlbH1cbiAgICAgIDwvdGg+LFxuICAgIF07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJvcHMuZmllbGRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5maWVsZHNbaV0uc2hvdyA9PT0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBjb2xJbmRleCA9IGkgKyAxO1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5maWVsZHNbaV0uZnJlZXplQ29sdW1uID09PSB0cnVlKSB7XG4gICAgICAgICAgaGVhZGVycy5wdXNoKFxuICAgICAgICAgICAgICA8dGgga2V5PXsndGhfY29sXycgKyBjb2xJbmRleH0gaWQ9e3RoaXMucHJvcHMuZnJlZXplQ29sdW1ufVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuc2V0U29ydENvbHVtbihpKS5iaW5kKHRoaXMpfT5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5maWVsZHNbaV0ubGFiZWx9XG4gICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBoZWFkZXJzLnB1c2goXG4gICAgICAgICAgICAgIDx0aCBrZXk9eyd0aF9jb2xfJyArIGNvbEluZGV4fSBvbkNsaWNrPXt0aGlzLnNldFNvcnRDb2x1bW4oaSkuYmluZCh0aGlzKX0+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuZmllbGRzW2ldLmxhYmVsfVxuICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3Qgcm93cyA9IFtdO1xuICAgIGxldCBjdXJSb3cgPSBbXTtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuZ2V0U29ydGVkUm93cygpO1xuICAgIGxldCBtYXRjaGVzRm91bmQgPSAwOyAvLyBLZWVwcyB0cmFjayBvZiBob3cgbWFueSByb3dzIHdoZXJlIGRpc3BsYXllZCBzbyBmYXIgYWNyb3NzIGFsbCBwYWdlc1xuICAgIGNvbnN0IGZpbHRlcmVkUm93cyA9IHRoaXMuY291bnRGaWx0ZXJlZFJvd3MoKTtcbiAgICBjb25zdCBjdXJyZW50UGFnZVJvdyA9IChyb3dzUGVyUGFnZSAqICh0aGlzLnN0YXRlLlBhZ2VOdW1iZXIgLSAxKSk7XG4gICAgY29uc3QgZmlsdGVyZWREYXRhID0gW107XG4gICAgbGV0IHVzZUtleXdvcmQgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLnByb3BzLmZpbHRlci5rZXl3b3JkKSB7XG4gICAgICB1c2VLZXl3b3JkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBQdXNoIHJvd3MgdG8gZGF0YSB0YWJsZVxuICAgIGZvciAobGV0IGkgPSAwO1xuICAgICAgKGkgPCB0aGlzLnByb3BzLmRhdGEubGVuZ3RoKSAmJiAocm93cy5sZW5ndGggPCByb3dzUGVyUGFnZSk7XG4gICAgICBpKytcbiAgICApIHtcbiAgICAgIGN1clJvdyA9IFtdO1xuXG4gICAgICAvLyBDb3VudHMgZmlsdGVyIG1hdGNoZXNcbiAgICAgIGxldCBmaWx0ZXJNYXRjaENvdW50ID0gMDtcbiAgICAgIGxldCBrZXl3b3JkTWF0Y2ggPSAwO1xuICAgICAgbGV0IGZpbHRlckxlbmd0aCA9IDA7XG5cbiAgICAgIC8vIEl0ZXJhdGVzIHRocm91Z2ggaGVhZGVycyB0byBwb3B1bGF0ZSByb3cgY29sdW1uc1xuICAgICAgLy8gd2l0aCBjb3JyZXNwb25kaW5nIGRhdGFcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5wcm9wcy5maWVsZHMubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgbGV0IGRhdGEgPSAnVW5rbm93bic7XG5cbiAgICAgICAgLy8gU2V0IGNvbHVtbiBkYXRhXG4gICAgICAgIGlmICh0aGlzLnByb3BzLmRhdGFbaW5kZXhbaV0uUm93SWR4XSkge1xuICAgICAgICAgIGRhdGEgPSB0aGlzLnByb3BzLmRhdGFbaW5kZXhbaV0uUm93SWR4XVtqXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnByb3BzLmZpZWxkc1tqXS5maWx0ZXIpIHtcbiAgICAgICAgICBpZiAodGhpcy5oYXNGaWx0ZXJLZXl3b3JkKHRoaXMucHJvcHMuZmllbGRzW2pdLmZpbHRlci5uYW1lLCBkYXRhKSkge1xuICAgICAgICAgICAgZmlsdGVyTWF0Y2hDb3VudCsrO1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhLnB1c2godGhpcy5wcm9wcy5kYXRhW2luZGV4W2ldLlJvd0lkeF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1c2VLZXl3b3JkID09PSB0cnVlKSB7XG4gICAgICAgICAgZmlsdGVyTGVuZ3RoID0gT2JqZWN0LmtleXModGhpcy5wcm9wcy5maWx0ZXIpLmxlbmd0aCAtIDE7XG4gICAgICAgICAgaWYgKHRoaXMuaGFzRmlsdGVyS2V5d29yZCgna2V5d29yZCcsIGRhdGEpKSB7XG4gICAgICAgICAgICBrZXl3b3JkTWF0Y2grKztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmlsdGVyTGVuZ3RoID0gT2JqZWN0LmtleXModGhpcy5wcm9wcy5maWx0ZXIpLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGtleSA9ICd0ZF9jb2xfJyArIGo7XG5cbiAgICAgICAgLy8gR2V0IGN1c3RvbSBjZWxsIGZvcm1hdHRpbmcgaWYgYXZhaWxhYmxlXG4gICAgICAgIGlmICh0aGlzLnByb3BzLmdldEZvcm1hdHRlZENlbGwpIHtcbiAgICAgICAgICBpZiAodGhpcy5wcm9wcy5maWVsZHNbal0uc2hvdyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGRhdGEgPSBudWxsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjcmVhdGUgbWFwcGluZyBiZXR3ZWVuIHJvd0hlYWRlcnMgYW5kIHJvd0RhdGEgaW4gYSByb3cgT2JqZWN0XG4gICAgICAgICAgICBjb25zdCByb3cgPSB7fTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuZmllbGRzLmZvckVhY2goKGZpZWxkLCBrKSA9PiB7XG4gICAgICAgICAgICAgIHJvd1tmaWVsZC5sYWJlbF0gPSB0aGlzLnByb3BzLmRhdGFbaW5kZXhbaV0uUm93SWR4XVtrXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZGF0YSA9IHRoaXMucHJvcHMuZ2V0Rm9ybWF0dGVkQ2VsbChcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmZpZWxkc1tqXS5sYWJlbCxcbiAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgIHJvd1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGRhdGEgIT09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIE5vdGU6IENhbid0IGN1cnJlbnRseSBwYXNzIGEga2V5LCBuZWVkIHRvIHVwZGF0ZSBjb2x1bW5Gb3JtYXR0ZXJcbiAgICAgICAgICAgIC8vIHRvIG5vdCByZXR1cm4gYSA8dGQ+IG5vZGUuIFVzaW5nIGNyZWF0ZUZyYWdtZW50IGluc3RlYWQuXG4gICAgICAgICAgICBjdXJSb3cucHVzaChjcmVhdGVGcmFnbWVudCh7ZGF0YX0pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3VyUm93LnB1c2goPHRkIGtleT17a2V5fT57ZGF0YX08L3RkPik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gT25seSBkaXNwbGF5IGEgcm93IGlmIGFsbCBmaWx0ZXIgdmFsdWVzIGhhdmUgYmVlbiBtYXRjaGVkXG4gICAgICBpZiAoKGZpbHRlckxlbmd0aCA9PT0gZmlsdGVyTWF0Y2hDb3VudCkgJiZcbiAgICAgICAgKCh1c2VLZXl3b3JkID09PSB0cnVlICYmIGtleXdvcmRNYXRjaCA+IDApIHx8XG4gICAgICAgICAgKHVzZUtleXdvcmQgPT09IGZhbHNlICYmIGtleXdvcmRNYXRjaCA9PT0gMCkpKSB7XG4gICAgICAgIG1hdGNoZXNGb3VuZCsrO1xuICAgICAgICBpZiAobWF0Y2hlc0ZvdW5kID4gY3VycmVudFBhZ2VSb3cpIHtcbiAgICAgICAgICBjb25zdCByb3dJbmRleCA9IGluZGV4W2ldLkNvbnRlbnQ7XG4gICAgICAgICAgcm93cy5wdXNoKFxuICAgICAgICAgICAgICA8dHIga2V5PXsndHJfJyArIHJvd0luZGV4fSBjb2xTcGFuPXtoZWFkZXJzLmxlbmd0aH0+XG4gICAgICAgICAgICAgICAgPHRkPntyb3dJbmRleH08L3RkPlxuICAgICAgICAgICAgICAgIHtjdXJSb3d9XG4gICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IFJvd3NQZXJQYWdlRHJvcGRvd24gPSAoXG4gICAgICA8c2VsZWN0XG4gICAgICAgIGNsYXNzTmFtZT1cImlucHV0LXNtIHBlclBhZ2VcIlxuICAgICAgICBvbkNoYW5nZT17dGhpcy5jaGFuZ2VSb3dzUGVyUGFnZX1cbiAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuUm93c1BlclBhZ2V9XG4gICAgICA+XG4gICAgICAgIDxvcHRpb24+MjA8L29wdGlvbj5cbiAgICAgICAgPG9wdGlvbj41MDwvb3B0aW9uPlxuICAgICAgICA8b3B0aW9uPjEwMDwvb3B0aW9uPlxuICAgICAgICA8b3B0aW9uPjEwMDA8L29wdGlvbj5cbiAgICAgICAgPG9wdGlvbj41MDAwPC9vcHRpb24+XG4gICAgICAgIDxvcHRpb24+MTAwMDA8L29wdGlvbj5cbiAgICAgIDwvc2VsZWN0PlxuICAgICk7XG5cbiAgICAvLyBJbmNsdWRlIG9ubHkgZmlsdGVyZWQgZGF0YSBpZiBmaWx0ZXJzIHdlcmUgYXBwbGllZFxuICAgIGxldCBjc3ZEYXRhID0gdGhpcy5wcm9wcy5kYXRhO1xuICAgIGlmICh0aGlzLnByb3BzLmZpbHRlciAmJiBmaWx0ZXJlZERhdGEubGVuZ3RoID4gMCkge1xuICAgICAgY3N2RGF0YSA9IGZpbHRlcmVkRGF0YTtcbiAgICB9XG5cbiAgICBjb25zdCBoZWFkZXIgPSB0aGlzLnN0YXRlLkhpZGUucm93c1BlclBhZ2UgPT09IHRydWUgPyAnJyA6IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGFibGUtaGVhZGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTJcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIHtyb3dzLmxlbmd0aH0gcm93cyBkaXNwbGF5ZWQgb2Yge2ZpbHRlcmVkUm93c30uXG4gICAgICAgICAgICAgIChNYXhpbXVtIHJvd3MgcGVyIHBhZ2U6IHtSb3dzUGVyUGFnZURyb3Bkb3dufSlcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0XCIgc3R5bGU9e3ttYXJnaW5Ub3A6ICctNDNweCd9fT5cbiAgICAgICAgICAgICAge3RoaXMucmVuZGVyQWN0aW9ucygpfVxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmRvd25sb2FkQ1NWLmJpbmQobnVsbCwgY3N2RGF0YSl9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgRG93bmxvYWQgVGFibGUgYXMgQ1NWXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8UGFnaW5hdGlvbkxpbmtzXG4gICAgICAgICAgICAgICAgVG90YWw9e2ZpbHRlcmVkUm93c31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZVBhZ2U9e3RoaXMuY2hhbmdlUGFnZX1cbiAgICAgICAgICAgICAgICBSb3dzUGVyUGFnZT17cm93c1BlclBhZ2V9XG4gICAgICAgICAgICAgICAgQWN0aXZlPXt0aGlzLnN0YXRlLlBhZ2VOdW1iZXJ9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuXG4gICAgY29uc3QgZm9vdGVyID0gdGhpcy5zdGF0ZS5IaWRlLmRvd25sb2FkQ1NWID09PSB0cnVlID8gJycgOiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCIgc3R5bGU9e3ttYXJnaW5Ub3A6ICcxMHB4J319PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb290ZXJUZXh0XCI+XG4gICAgICAgICAgICAgIHtyb3dzLmxlbmd0aH0gcm93cyBkaXNwbGF5ZWQgb2Yge2ZpbHRlcmVkUm93c30uXG4gICAgICAgICAgICAgIChNYXhpbXVtIHJvd3MgcGVyIHBhZ2U6IHtSb3dzUGVyUGFnZURyb3Bkb3dufSlcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0XCIgc3R5bGU9e3ttYXJnaW5Ub3A6ICctMjNweCd9fT5cbiAgICAgICAgICAgICAgPFBhZ2luYXRpb25MaW5rc1xuICAgICAgICAgICAgICAgIFRvdGFsPXtmaWx0ZXJlZFJvd3N9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2VQYWdlPXt0aGlzLmNoYW5nZVBhZ2V9XG4gICAgICAgICAgICAgICAgUm93c1BlclBhZ2U9e3Jvd3NQZXJQYWdlfVxuICAgICAgICAgICAgICAgIEFjdGl2ZT17dGhpcy5zdGF0ZS5QYWdlTnVtYmVyfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luOiAnMTRweCd9fT5cbiAgICAgICAge2hlYWRlcn1cbiAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInRhYmxlIHRhYmxlLWhvdmVyIHRhYmxlLXByaW1hcnkgdGFibGUtYm9yZGVyZWRcIiBpZD1cImR5bmFtaWN0YWJsZVwiPlxuICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgIDx0ciBjbGFzc05hbWU9XCJpbmZvXCI+e2hlYWRlcnN9PC90cj5cbiAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgIHtyb3dzfVxuICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgIDwvdGFibGU+XG4gICAgICAgIHtmb290ZXJ9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5EYXRhVGFibGUucHJvcFR5cGVzID0ge1xuICBkYXRhOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgUm93TnVtTGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIC8vIEZ1bmN0aW9uIG9mIHdoaWNoIHJldHVybnMgYSBKU1ggZWxlbWVudCBmb3IgYSB0YWJsZSBjZWxsLCB0YWtlc1xuICAvLyBwYXJhbWV0ZXJzIG9mIHRoZSBmb3JtOiBmdW5jKENvbHVtbk5hbWUsIENlbGxEYXRhLCBFbnRpcmVSb3dEYXRhKVxuICBnZXRGb3JtYXR0ZWRDZWxsOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Tb3J0OiBQcm9wVHlwZXMuZnVuYyxcbiAgSGlkZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgYWN0aW9uczogUHJvcFR5cGVzLm9iamVjdCxcbn07XG5EYXRhVGFibGUuZGVmYXVsdFByb3BzID0ge1xuICBSb3dOdW1MYWJlbDogJ05vLicsXG4gIGZpbHRlcjoge30sXG4gIEhpZGU6IHtcbiAgICByb3dzUGVyUGFnZTogZmFsc2UsXG4gICAgZG93bmxvYWRDU1Y6IGZhbHNlLFxuICAgIGRlZmF1bHRDb2x1bW46IGZhbHNlLFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgRGF0YVRhYmxlO1xuIiwiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG4vKipcbiAqIEZpbHRlciBjb21wb25lbnQuXG4gKiBBIHdyYXBwZXIgZm9yIGZvcm0gZWxlbWVudHMgaW5zaWRlIGEgc2VsZWN0aW9uIGZpbHRlci5cbiAqXG4gKiBDb25zdHJ1Y3RzIGZpbHRlciBmaWVsZHMgYmFzZWQgb24gdGhpcy5wcm9wcy5maWVsZHMgY29uZmlndXJhdGlvbiBvYmplY3RcbiAqXG4gKiBBbHRlcnMgdGhlIGZpbHRlciBvYmplY3QgYW5kIHNlbmRzIGl0IHRvIHBhcmVudCBvbiBldmVyeSB1cGRhdGUuXG4gKlxuICovXG5jbGFzcyBGaWx0ZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLm9uRmllbGRVcGRhdGUgPSB0aGlzLm9uRmllbGRVcGRhdGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlbmRlckZpbHRlckZpZWxkcyA9IHRoaXMucmVuZGVyRmlsdGVyRmllbGRzLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBmaWx0ZXIgb2JqZWN0IHRvIHJlZmxlY3QgdmFsdWVzIG9mIGlucHV0IGZpZWxkcy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBmb3JtIGVsZW1lbnQgdHlwZSAoaS5lIGNvbXBvbmVudCBuYW1lKVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB0aGUgbmFtZSBvZiB0aGUgZm9ybSBlbGVtZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIGlkIG9mIHRoZSBmb3JtIGVsZW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSB0eXBlIG9mIHRoZSBmb3JtIGVsZW1lbnRcbiAgICovXG4gIG9uRmllbGRVcGRhdGUobmFtZSwgdmFsdWUsIGlkLCB0eXBlKSB7XG4gICAgY29uc3QgZmlsdGVyID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLnByb3BzLmZpbHRlcikpO1xuICAgIGNvbnN0IGV4YWN0TWF0Y2ggPSB0eXBlID09PSAndGV4dGJveCcgPyBmYWxzZSA6IHRydWU7XG4gICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSAnJykge1xuICAgICAgZGVsZXRlIGZpbHRlcltuYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsdGVyW25hbWVdID0ge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGV4YWN0TWF0Y2g6IGV4YWN0TWF0Y2gsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHRoaXMucHJvcHMudXBkYXRlRmlsdGVyKGZpbHRlcik7XG4gIH1cblxuICByZW5kZXJGaWx0ZXJGaWVsZHMoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuZmllbGRzLnJlZHVjZSgocmVzdWx0LCBmaWVsZCkgPT4ge1xuICAgICAgY29uc3QgZmlsdGVyID0gZmllbGQuZmlsdGVyO1xuICAgICAgaWYgKGZpbHRlciAmJiBmaWx0ZXIuaGlkZSAhPT0gdHJ1ZSkge1xuICAgICAgICBsZXQgZWxlbWVudDtcbiAgICAgICAgc3dpdGNoIChmaWx0ZXIudHlwZSkge1xuICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICBlbGVtZW50ID0gPFRleHRib3hFbGVtZW50IGtleT17ZmlsdGVyLm5hbWV9Lz47XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICAgICAgZWxlbWVudCA9IDxTZWxlY3RFbGVtZW50IGtleT17ZmlsdGVyLm5hbWV9IG9wdGlvbnM9e2ZpbHRlci5vcHRpb25zfS8+O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdtdWx0aXNlbGVjdCc6XG4gICAgICAgICAgZWxlbWVudCA9IDxTZWxlY3RFbGVtZW50IGtleT17ZmlsdGVyLm5hbWV9IG9wdGlvbnM9e2ZpbHRlci5vcHRpb25zfSBtdWx0aXBsZT17dHJ1ZX0vPjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgICAgZWxlbWVudCA9IDxEYXRlRWxlbWVudCBrZXk9e2ZpbHRlci5uYW1lfS8+O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGVsZW1lbnQgPSA8VGV4dGJveEVsZW1lbnQga2V5PXtmaWx0ZXIubmFtZX0vPjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdC5wdXNoKFJlYWN0LmNsb25lRWxlbWVudChcbiAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IGZpbHRlci5uYW1lLFxuICAgICAgICAgICAgbGFiZWw6IGZpZWxkLmxhYmVsLFxuICAgICAgICAgICAgdmFsdWU6ICh0aGlzLnByb3BzLmZpbHRlcltmaWx0ZXIubmFtZV0gfHwge30pLnZhbHVlLFxuICAgICAgICAgICAgb25Vc2VySW5wdXQ6IHRoaXMub25GaWVsZFVwZGF0ZSxcbiAgICAgICAgICB9XG4gICAgICAgICkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sIFtdKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEZvcm1FbGVtZW50XG4gICAgICAgIGlkPXt0aGlzLnByb3BzLmlkfVxuICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICA+XG4gICAgICAgIDxGaWVsZHNldEVsZW1lbnRcbiAgICAgICAgICBjb2x1bW5zPXt0aGlzLnByb3BzLmNvbHVtbnN9XG4gICAgICAgICAgbGVnZW5kPXt0aGlzLnByb3BzLnRpdGxlfVxuICAgICAgICA+XG4gICAgICAgICAge3RoaXMucmVuZGVyRmlsdGVyRmllbGRzKCl9XG4gICAgICAgICAgPEJ1dHRvbkVsZW1lbnRcbiAgICAgICAgICAgIGxhYmVsPVwiQ2xlYXIgRmlsdGVyc1wiXG4gICAgICAgICAgICB0eXBlPVwicmVzZXRcIlxuICAgICAgICAgICAgb25Vc2VySW5wdXQ9e3RoaXMucHJvcHMuY2xlYXJGaWx0ZXJ9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9GaWVsZHNldEVsZW1lbnQ+XG4gICAgICA8L0Zvcm1FbGVtZW50PlxuICAgICk7XG4gIH1cbn1cblxuRmlsdGVyLmRlZmF1bHRQcm9wcyA9IHtcbiAgaWQ6IG51bGwsXG4gIGNsZWFyRmlsdGVyOiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uVXBkYXRlKCkgY2FsbGJhY2sgaXMgbm90IHNldCEnKTtcbiAgfSxcbiAgY29sdW1uczogMSxcbn07XG5GaWx0ZXIucHJvcFR5cGVzID0ge1xuICBmaWx0ZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgY2xlYXJGaWx0ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjb2x1bW5zOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgZmllbGRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBGaWx0ZXI7XG4iLCJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBQYW5lbCBmcm9tICcuL1BhbmVsJztcbmltcG9ydCBEYXRhVGFibGUgZnJvbSAnLi9EYXRhVGFibGUnO1xuaW1wb3J0IEZpbHRlciBmcm9tICcuL0ZpbHRlcic7XG5cbi8qKlxuICogRmlsdGVyYWJsZURhdGFUYWJsZSBjb21wb25lbnQuXG4gKiBBIHdyYXBwZXIgZm9yIGFsbCBkYXRhdGFibGVzIHRoYXQgaGFuZGxlcyBmaWx0ZXJpbmcuXG4gKlxuICogSGFuZGxlcyB0aGUgdXBkYXRpbmcgYW5kIGNsZWFyaW5nIG9mIHRoZSBmaWx0ZXIgc3RhdGUgYmFzZWQgb24gY2hhbmdlcyBzZW50XG4gKiBmcm9tIHRoZSBGaWx0ZXJGb3JtLlxuICpcbiAqIFBhc3NlcyB0aGUgRmlsdGVyIHRvIHRoZSBEYXRhdGFibGUuXG4gKlxuICogRGVwcmVjYXRlcyBGaWx0ZXIgRm9ybS5cbiAqL1xuY2xhc3MgRmlsdGVyYWJsZURhdGFUYWJsZSBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBmaWx0ZXI6IHt9LFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVGaWx0ZXIgPSB0aGlzLnVwZGF0ZUZpbHRlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2xlYXJGaWx0ZXIgPSB0aGlzLmNsZWFyRmlsdGVyLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBmaWx0ZXIgc3RhdGVcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGZpbHRlciBwYXNzZWQgZnJvbSBGaWx0ZXJGb3JtXG4gICAqL1xuICB1cGRhdGVGaWx0ZXIoZmlsdGVyKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7ZmlsdGVyfSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBGaWx0ZXIgdG8gZW1wdHkgb2JqZWN0XG4gICAqL1xuICBjbGVhckZpbHRlcigpIHtcbiAgICB0aGlzLnVwZGF0ZUZpbHRlcih7fSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxQYW5lbFxuICAgICAgICB0aXRsZT17dGhpcy5wcm9wcy50aXRsZX1cbiAgICAgID5cbiAgICAgICAgPEZpbHRlclxuICAgICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZSArICdfZmlsdGVyJ31cbiAgICAgICAgICBpZD17dGhpcy5wcm9wcy5uYW1lICsgJ19maWx0ZXInfVxuICAgICAgICAgIHRpdGxlPSdTZWxlY3Rpb24gRmlsdGVyJ1xuICAgICAgICAgIGNvbHVtbnM9e3RoaXMucHJvcHMuY29sdW1uc31cbiAgICAgICAgICBmaWx0ZXI9e3RoaXMuc3RhdGUuZmlsdGVyfVxuICAgICAgICAgIGZpZWxkcz17dGhpcy5wcm9wcy5maWVsZHN9XG4gICAgICAgICAgdXBkYXRlRmlsdGVyPXt0aGlzLnVwZGF0ZUZpbHRlcn1cbiAgICAgICAgICBjbGVhckZpbHRlcj17dGhpcy5jbGVhckZpbHRlcn1cbiAgICAgICAgLz5cbiAgICAgICAgPERhdGFUYWJsZVxuICAgICAgICAgIGRhdGE9e3RoaXMucHJvcHMuZGF0YX1cbiAgICAgICAgICBmaWVsZHM9e3RoaXMucHJvcHMuZmllbGRzfVxuICAgICAgICAgIGZpbHRlcj17dGhpcy5zdGF0ZS5maWx0ZXJ9XG4gICAgICAgICAgZ2V0Rm9ybWF0dGVkQ2VsbD17dGhpcy5wcm9wcy5nZXRGb3JtYXR0ZWRDZWxsfVxuICAgICAgICAgIGFjdGlvbnM9e3RoaXMucHJvcHMuYWN0aW9uc31cbiAgICAgICAgLz5cbiAgICAgIDwvUGFuZWw+XG4gICAgKTtcbiAgfVxufVxuXG5GaWx0ZXJhYmxlRGF0YVRhYmxlLmRlZmF1bHRQcm9wcyA9IHtcbiAgY29sdW1uczogMyxcbn07XG5cbkZpbHRlcmFibGVEYXRhVGFibGUucHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBkYXRhOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGZpbHRlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBmaWVsZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgY29sdW1uczogUHJvcFR5cGVzLm51bWJlcixcbiAgZ2V0Rm9ybWF0dGVkQ2VsbDogUHJvcFR5cGVzLmZ1bmMsXG4gIGFjdGlvbnM6IFByb3BUeXBlcy5vYmplY3QsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBGaWx0ZXJhYmxlRGF0YVRhYmxlO1xuIiwiLyogZXhwb3J0ZWQgRm9ybUVsZW1lbnQsIEZpZWxkc2V0RWxlbWVudCwgU2VsZWN0RWxlbWVudCwgVGFnc0VsZW1lbnQsIFNlYXJjaGFibGVEcm9wZG93biwgVGV4dGFyZWFFbGVtZW50LFxuVGV4dGJveEVsZW1lbnQsIERhdGVFbGVtZW50LCBOdW1lcmljRWxlbWVudCwgRmlsZUVsZW1lbnQsIFN0YXRpY0VsZW1lbnQsIExpbmtFbGVtZW50LFxuQ2hlY2tib3hFbGVtZW50LCBCdXR0b25FbGVtZW50LCBMb3Jpc0VsZW1lbnRcbiovXG5cbi8qKlxuICogVGhpcyBmaWxlIGNvbnRhaW5zIFJlYWN0IGNvbXBvbmVudHMgZm9yIExvcmlzIGZvcm0gZWxlbWVudHMuXG4gKlxuICogQGF1dGhvciBMb3JpcyBUZWFtXG4gKiBAdmVyc2lvbiAxLjAuMFxuICpcbiAqL1xuXG4vKipcbiAqIEZvcm0gQ29tcG9uZW50LlxuICogUmVhY3Qgd3JhcHBlciBmb3IgPGZvcm0+IGVsZW1lbnQgdGhhdCBhY2NlcHRzIGNoaWxkcmVuIHJlYWN0IGNvbXBvbmVudHNcbiAqXG4gKiBUaGUgZm9ybSBlbGVtZW50cyBjYW4gYmUgcGFzc2VkIGluIHR3byB3YXlzOlxuICogMS4gQSBgdGhpcy5wcm9wcy5mb3JtRWxlbWVudHNgIEpTT04gb2JqZWN0XG4gKiAyLiBGb3JtIGNvbXBvbmVudHMgbmVzdGVkIGRpcmVjdGx5IGluc2lkZSA8Rm9ybUVsZW1lbnQ+PC9Gb3JtRWxlbWVudD5cbiAqXG4gKiBOb3RlIHRoYXQgaWYgYm90aCBhcmUgcGFzc2VkIGB0aGlzLnByb3BzLmZvcm1FbGVtZW50c2AgaXMgZGlzcGxheWVkIGZpcnN0LlxuICpcbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbi8qKlxuICogRm9ybUVsZW1lbnQgQ29tcG9uZW50LlxuICogVXNlZCBmb3IgY29uc3RydWN0aW5nIGZvcm0gZWxlbWVudC5cbiAqL1xuY2xhc3MgRm9ybUVsZW1lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmdldEZvcm1FbGVtZW50cyA9IHRoaXMuZ2V0Rm9ybUVsZW1lbnRzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgZ2V0Rm9ybUVsZW1lbnRzKCkge1xuICAgIGNvbnN0IGZvcm1FbGVtZW50c0hUTUwgPSBbXTtcbiAgICBjb25zdCBjb2x1bW5zID0gdGhpcy5wcm9wcy5jb2x1bW5zO1xuICAgIGNvbnN0IG1heENvbHVtblNpemUgPSAxMjtcbiAgICBjb25zdCBjb2xTaXplID0gTWF0aC5mbG9vcihtYXhDb2x1bW5TaXplIC8gY29sdW1ucyk7XG4gICAgY29uc3QgY29sQ2xhc3MgPSAnY29sLXhzLTEyIGNvbC1zbS0nICsgY29sU2l6ZSArICcgY29sLW1kLScgKyBjb2xTaXplO1xuXG4gICAgLy8gUmVuZGVyIGVsZW1lbnRzIGZyb20gSlNPTlxuICAgIGNvbnN0IGZpbHRlciA9IHRoaXMucHJvcHMuZm9ybUVsZW1lbnRzO1xuXG4gICAgT2JqZWN0LmtleXMoZmlsdGVyKS5mb3JFYWNoKGZ1bmN0aW9uKG9iaktleSwgaW5kZXgpIHtcbiAgICAgIGNvbnN0IHVzZXJJbnB1dCA9IHRoaXMucHJvcHMub25Vc2VySW5wdXQgPyB0aGlzLnByb3BzLm9uVXNlcklucHV0IDogZmlsdGVyW29iaktleV0ub25Vc2VySW5wdXQ7XG4gICAgICBjb25zdCB2YWx1ZSA9IGZpbHRlcltvYmpLZXldLnZhbHVlID8gZmlsdGVyW29iaktleV0udmFsdWUgOiAnJztcbiAgICAgIGZvcm1FbGVtZW50c0hUTUwucHVzaChcbiAgICAgICAgICA8ZGl2IGtleT17J2VsXycgKyBpbmRleH0gY2xhc3NOYW1lPXtjb2xDbGFzc30+XG4gICAgICAgICAgICA8TG9yaXNFbGVtZW50XG4gICAgICAgICAgICAgIGVsZW1lbnQ9e2ZpbHRlcltvYmpLZXldfVxuICAgICAgICAgICAgICBvblVzZXJJbnB1dD17dXNlcklucHV0fVxuICAgICAgICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgLy8gUmVuZGVyIGVsZW1lbnRzIGZyb20gUmVhY3RcbiAgICBSZWFjdC5DaGlsZHJlbi5mb3JFYWNoKHRoaXMucHJvcHMuY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkLCBrZXkpIHtcbiAgICAgIC8vIElmIGNoaWxkIGlzIHBsYWluIEhUTUwsIGluc2VydCBpdCBhcyBmdWxsIHNpemUuXG4gICAgICAvLyBVc2VmdWwgZm9yIGluc2VydGluZyA8aHI+IHRvIHNwbGl0IGZvcm0gc2VjdGlvbnNcbiAgICAgIGxldCBlbGVtZW50Q2xhc3MgPSAnY29sLXhzLTEyIGNvbC1zbS0xMiBjb2wtbWQtMTInO1xuXG4gICAgICAvLyBJZiBjaGlsZCBpcyBmb3JtIGVsZW1lbnQgdXNlIGFwcHJvcHJpYXRlIHNpemVcbiAgICAgIGlmIChSZWFjdC5pc1ZhbGlkRWxlbWVudChjaGlsZCkgJiYgdHlwZW9mIGNoaWxkLnR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZWxlbWVudENsYXNzID0gY29sQ2xhc3M7XG4gICAgICB9XG4gICAgICBmb3JtRWxlbWVudHNIVE1MLnB1c2goXG4gICAgICAgICAgPGRpdiBrZXk9eydlbF9jaGlsZF8nICsga2V5fSBjbGFzc05hbWU9e2VsZW1lbnRDbGFzc30+e2NoaWxkfTwvZGl2PlxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBmb3JtRWxlbWVudHNIVE1MO1xuICB9XG5cbiAgaGFuZGxlU3VibWl0KGUpIHtcbiAgICAvLyBPdmVycmlkZSBkZWZhdWx0IHN1Ym1pdCBpZiBwcm9wZXJ0eSBpcyBzZXRcbiAgICBpZiAodGhpcy5wcm9wcy5vblN1Ym1pdCkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5wcm9wcy5vblN1Ym1pdChlKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZW5jVHlwZSA9IHRoaXMucHJvcHMuZmlsZVVwbG9hZCA/ICdtdWx0aXBhcnQvZm9ybS1kYXRhJyA6IG51bGw7XG5cbiAgICAvLyBHZW5lcmF0ZSBmb3JtIGVsZW1lbnRzXG4gICAgY29uc3QgZm9ybUVsZW1lbnRzID0gdGhpcy5nZXRGb3JtRWxlbWVudHMoKTtcblxuICAgIC8vIEZsZXhib3ggaXMgc2V0IHRvIGVuc3VyZSB0aGF0IGNvbHVtbnMgb2YgZGlmZmVyZW50IGhlaWdodHNcbiAgICAvLyBhcmUgZGlzcGxheWVkIHByb3BvcnRpb25hbGx5IG9uIHRoZSBzY3JlZW5cbiAgICBjb25zdCByb3dTdHlsZXMgPSB7XG4gICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICBmbGV4V3JhcDogJ3dyYXAnLFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGZvcm1cbiAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICBpZD17dGhpcy5wcm9wcy5pZH1cbiAgICAgICAgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmNsYXNzfVxuICAgICAgICBtZXRob2Q9e3RoaXMucHJvcHMubWV0aG9kfVxuICAgICAgICBhY3Rpb249e3RoaXMucHJvcHMuYWN0aW9ufVxuICAgICAgICBlbmNUeXBlPXtlbmNUeXBlfVxuICAgICAgICBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9XG4gICAgICA+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgc3R5bGU9e3Jvd1N0eWxlc30+XG4gICAgICAgICAge2Zvcm1FbGVtZW50c31cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Zvcm0+XG4gICAgKTtcbiAgfVxufVxuXG5Gb3JtRWxlbWVudC5wcm9wVHlwZXMgPSB7XG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG1ldGhvZDogUHJvcFR5cGVzLm9uZU9mKFsnUE9TVCcsICdHRVQnXSksXG4gIGFjdGlvbjogUHJvcFR5cGVzLnN0cmluZyxcbiAgY2xhc3M6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNvbHVtbnM6IFByb3BUeXBlcy5udW1iZXIsXG4gIGZvcm1FbGVtZW50czogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICBlbGVtZW50TmFtZTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICB0eXBlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIH0pLFxuICB9KSxcbiAgb25TdWJtaXQ6IFByb3BUeXBlcy5mdW5jLFxuICBvblVzZXJJbnB1dDogUHJvcFR5cGVzLmZ1bmMsXG59O1xuXG5Gb3JtRWxlbWVudC5kZWZhdWx0UHJvcHMgPSB7XG4gIG5hbWU6IG51bGwsXG4gIGlkOiBudWxsLFxuICBtZXRob2Q6ICdQT1NUJyxcbiAgYWN0aW9uOiB1bmRlZmluZWQsXG4gIGNsYXNzOiAnZm9ybS1ob3Jpem9udGFsJyxcbiAgY29sdW1uczogMSxcbiAgZmlsZVVwbG9hZDogZmFsc2UsXG4gIGZvcm1FbGVtZW50czoge30sXG4gIG9uU3VibWl0OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uU3VibWl0KCkgY2FsbGJhY2sgaXMgbm90IHNldCEnKTtcbiAgfSxcbn07XG5cbi8qKlxuICogRmllbGRzZXRFbGVtZW50IENvbXBvbmVudC5cbiAqIFJlYWN0IHdyYXBwZXIgZm9yIDxmaWVsZHNldD4gZWxlbWVudCB0aGF0IGlzIG5lc3RlZCBpbnNpZGUgPEZvcm1FbGVtZW50PjwvRm9ybUVsZW1lbnQ+LFxuICogYW5kIGFjY2VwdHMgY2hpbGQgcmVhY3QgY29tcG9uZW50cy4gQSBmaWVsZHNldCBncm91cHMgcmVsYXRlZCBlbGVtZW50cyBpbiBhIGZvcm0uXG4gKlxuICogVGhlIGZvcm0gZWxlbWVudHMgY2FuIGJlIHBhc3NlZCBieSBuZXN0aW5nIEZvcm0gY29tcG9uZW50cyBkaXJlY3RseSBpbnNpZGUgPEZpZWxkc2V0RWxlbWVudD48L0ZpZWxkc2V0RWxlbWVudD4uXG4gKlxuICovXG5jbGFzcyBGaWVsZHNldEVsZW1lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmdldEZvcm1FbGVtZW50cyA9IHRoaXMuZ2V0Rm9ybUVsZW1lbnRzLmJpbmQodGhpcyk7XG4gIH1cblxuICBnZXRGb3JtRWxlbWVudHMoKSB7XG4gICAgY29uc3QgZm9ybUVsZW1lbnRzSFRNTCA9IFtdO1xuICAgIGNvbnN0IGNvbHVtbnMgPSB0aGlzLnByb3BzLmNvbHVtbnM7XG4gICAgY29uc3QgbWF4Q29sdW1uU2l6ZSA9IDEyO1xuICAgIGNvbnN0IGNvbFNpemUgPSBNYXRoLmZsb29yKG1heENvbHVtblNpemUgLyBjb2x1bW5zKTtcbiAgICBjb25zdCBjb2xDbGFzcyA9ICdjb2wteHMtMTIgY29sLXNtLScgKyBjb2xTaXplICsgJyBjb2wtbWQtJyArIGNvbFNpemU7XG5cbiAgICAvLyBSZW5kZXIgZWxlbWVudHMgZnJvbSBSZWFjdFxuICAgIFJlYWN0LkNoaWxkcmVuLmZvckVhY2godGhpcy5wcm9wcy5jaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQsIGtleSkge1xuICAgICAgLy8gSWYgY2hpbGQgaXMgcGxhaW4gSFRNTCwgaW5zZXJ0IGl0IGFzIGZ1bGwgc2l6ZS5cbiAgICAgIC8vIFVzZWZ1bCBmb3IgaW5zZXJ0aW5nIDxocj4gdG8gc3BsaXQgZm9ybSBzZWN0aW9uc1xuICAgICAgbGV0IGVsZW1lbnRDbGFzcyA9ICdjb2wteHMtMTIgY29sLXNtLTEyIGNvbC1tZC0xMic7XG5cbiAgICAgIC8vIElmIGNoaWxkIGlzIGZvcm0gZWxlbWVudCB1c2UgYXBwcm9wcmlhdGUgc2l6ZVxuICAgICAgaWYgKFJlYWN0LmlzVmFsaWRFbGVtZW50KGNoaWxkKSAmJiB0eXBlb2YgY2hpbGQudHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBlbGVtZW50Q2xhc3MgPSBjb2xDbGFzcztcbiAgICAgIH1cbiAgICAgIGZvcm1FbGVtZW50c0hUTUwucHVzaChcbiAgICAgICAgICA8ZGl2IGtleT17J2VsX2NoaWxkXycgKyBrZXl9IGNsYXNzTmFtZT17ZWxlbWVudENsYXNzfT57Y2hpbGR9PC9kaXY+XG4gICAgICApO1xuICAgIH0pO1xuICAgIHJldHVybiBmb3JtRWxlbWVudHNIVE1MO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIC8vIEdlbmVyYXRlIGZvcm0gZWxlbWVudHNcbiAgICBjb25zdCBmb3JtRWxlbWVudHMgPSB0aGlzLmdldEZvcm1FbGVtZW50cygpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxmaWVsZHNldFxuICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICA+XG4gICAgICAgIDxsZWdlbmQ+XG4gICAgICAgICAge3RoaXMucHJvcHMubGVnZW5kfVxuICAgICAgICA8L2xlZ2VuZD5cbiAgICAgICAge2Zvcm1FbGVtZW50c31cbiAgICAgIDwvZmllbGRzZXQ+XG4gICAgKTtcbiAgfVxufVxuXG5GaWVsZHNldEVsZW1lbnQucHJvcFR5cGVzID0ge1xuICBjb2x1bW5zOiBQcm9wVHlwZXMubnVtYmVyLFxuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBsZWdlbmQ6IFByb3BUeXBlcy5zdHJpbmcsXG59O1xuXG5GaWVsZHNldEVsZW1lbnQuZGVmYXVsdFByb3BzID0ge1xuICBjb2x1bW5zOiAxLFxuICBsZWdlbmQ6ICdTZWxlY3Rpb24gRmlsdGVyJyxcbn07XG5cbi8qKlxuICogU2VhcmNoIENvbXBvbmVudFxuICogUmVhY3Qgd3JhcHBlciBmb3IgYSBzZWFyY2hhYmxlIGRyb3Bkb3duXG4gKi9cbmNsYXNzIFNlYXJjaGFibGVEcm9wZG93biBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuZ2V0S2V5RnJvbVZhbHVlID0gdGhpcy5nZXRLZXlGcm9tVmFsdWUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVCbHVyID0gdGhpcy5oYW5kbGVCbHVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRUZXh0SW5wdXRWYWx1ZSA9IHRoaXMuZ2V0VGV4dElucHV0VmFsdWUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGdldEtleUZyb21WYWx1ZSh2YWx1ZSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLnByb3BzLm9wdGlvbnM7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9wdGlvbnMpLmZpbmQoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG9wdGlvbnNbb10gPT09IHZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGUpIHtcbiAgICBsZXQgdmFsdWUgPSB0aGlzLmdldEtleUZyb21WYWx1ZShlLnRhcmdldC52YWx1ZSk7XG4gICAgLy8gaWYgbm90IGluIHN0cmljdCBtb2RlIGFuZCBrZXkgdmFsdWUgaXMgbm90IGRlZmluZWQgKGkuZS4sIG5vdCBpbiBvcHRpb25zKVxuICAgIC8vIHNldCB2YWx1ZSBlcXVhbCB0byBlLnRhcmdldC52YWx1ZVxuICAgIGlmICghdGhpcy5wcm9wcy5zdHJpY3RTZWFyY2ggJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsdWUgPSBlLnRhcmdldC52YWx1ZTtcbiAgICB9XG4gICAgdGhpcy5wcm9wcy5vblVzZXJJbnB1dCh0aGlzLnByb3BzLm5hbWUsIHZhbHVlKTtcbiAgfVxuXG4gIGhhbmRsZUJsdXIoZSkge1xuICAgIC8vIG51bGwgb3V0IGVudHJ5IGlmIG5vdCBwcmVzZW50IGluIG9wdGlvbnMgaW4gc3RyaWN0IG1vZGVcbiAgICBpZiAodGhpcy5wcm9wcy5zdHJpY3RTZWFyY2gpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gZS50YXJnZXQudmFsdWU7XG4gICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5wcm9wcy5vcHRpb25zO1xuICAgICAgaWYgKE9iamVjdC52YWx1ZXMob3B0aW9ucykuaW5kZXhPZih2YWx1ZSkgPT09IC0xKSB7XG4gICAgICAgIC8vIGVtcHR5IHN0cmluZyBvdXQgYm90aCB0aGUgaGlkZGVuIHZhbHVlIGFzIHdlbGwgYXMgdGhlIGlucHV0IHRleHRcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgaW5wdXRbbmFtZT1cIiR7dGhpcy5wcm9wcy5uYW1lICsgJ19pbnB1dCd9XCJdYCkudmFsdWUgPSAnJztcbiAgICAgICAgdGhpcy5wcm9wcy5vblVzZXJJbnB1dCh0aGlzLnByb3BzLm5hbWUsICcnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRUZXh0SW5wdXRWYWx1ZSgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgaW5wdXRbbmFtZT1cIiR7dGhpcy5wcm9wcy5uYW1lICsgJ19pbnB1dCd9XCJdYCkudmFsdWU7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgcmVxdWlyZWQgPSB0aGlzLnByb3BzLnJlcXVpcmVkID8gJ3JlcXVpcmVkJyA6IG51bGw7XG4gICAgY29uc3QgZGlzYWJsZWQgPSB0aGlzLnByb3BzLmRpc2FibGVkID8gJ2Rpc2FibGVkJyA6IG51bGw7XG4gICAgY29uc3Qgc29ydEJ5VmFsdWUgPSB0aGlzLnByb3BzLnNvcnRCeVZhbHVlO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLnByb3BzLm9wdGlvbnM7XG4gICAgY29uc3Qgc3RyaWN0TWVzc2FnZSA9ICdFbnRyeSBtdXN0IGJlIGluY2x1ZGVkIGluIHByb3ZpZGVkIGxpc3Qgb2Ygb3B0aW9ucy4nO1xuICAgIGxldCBlcnJvck1lc3NhZ2UgPSBudWxsO1xuICAgIGxldCByZXF1aXJlZEhUTUwgPSBudWxsO1xuICAgIGxldCBlbGVtZW50Q2xhc3MgPSAncm93IGZvcm0tZ3JvdXAnO1xuXG4gICAgLy8gQWRkIHJlcXVpcmVkIGFzdGVyaXhcbiAgICBpZiAocmVxdWlyZWQpIHtcbiAgICAgIHJlcXVpcmVkSFRNTCA9IDxzcGFuIGNsYXNzTmFtZT1cInRleHQtZGFuZ2VyXCI+Kjwvc3Bhbj47XG4gICAgfVxuXG4gICAgLy8gQWRkIGVycm9yIG1lc3NhZ2VcbiAgICBpZiAodGhpcy5wcm9wcy5lcnJvck1lc3NhZ2UpIHtcbiAgICAgIGVycm9yTWVzc2FnZSA9IDxzcGFuPnt0aGlzLnByb3BzLmVycm9yTWVzc2FnZX08L3NwYW4+O1xuICAgICAgZWxlbWVudENsYXNzID0gJ3JvdyBmb3JtLWdyb3VwIGhhcy1lcnJvcic7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnJlcXVpcmVkICYmIHRoaXMucHJvcHMudmFsdWUgPT09ICcnKSB7XG4gICAgICBsZXQgbXNnID0gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQhJztcbiAgICAgIG1zZyArPSAodGhpcy5wcm9wcy5zdHJpY3RTZWFyY2ggPyAnICcgKyBzdHJpY3RNZXNzYWdlIDogJycpO1xuICAgICAgZXJyb3JNZXNzYWdlID0gPHNwYW4+e21zZ308L3NwYW4+O1xuICAgICAgZWxlbWVudENsYXNzID0gJ3JvdyBmb3JtLWdyb3VwIGhhcy1lcnJvcic7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnN0cmljdFNlYXJjaCAmJiB0aGlzLnByb3BzLnZhbHVlID09PSAnJykge1xuICAgICAgZXJyb3JNZXNzYWdlID0gPHNwYW4+e3N0cmljdE1lc3NhZ2V9PC9zcGFuPjtcbiAgICAgIGVsZW1lbnRDbGFzcyA9ICdyb3cgZm9ybS1ncm91cCBoYXMtZXJyb3InO1xuICAgIH1cblxuICAgIC8vIGRldGVybWluZSB2YWx1ZSB0byBwbGFjZSBpbnRvIHRleHQgaW5wdXRcbiAgICBsZXQgdmFsdWU7XG4gICAgLy8gdXNlIHZhbHVlIGluIG9wdGlvbnMgaWYgdmFsaWRcbiAgICBpZiAodGhpcy5wcm9wcy52YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoT2JqZWN0LmtleXMob3B0aW9ucykuaW5kZXhPZih0aGlzLnByb3BzLnZhbHVlKSA+IC0xKSB7XG4gICAgICAgIHZhbHVlID0gb3B0aW9uc1t0aGlzLnByb3BzLnZhbHVlXTtcbiAgICAgICAgLy8gZWxzZSwgdXNlIGlucHV0IHRleHQgdmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gdGhpcy5nZXRUZXh0SW5wdXRWYWx1ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG5ld09wdGlvbnMgPSB7fTtcbiAgICBsZXQgb3B0aW9uTGlzdCA9IFtdO1xuICAgIGlmIChzb3J0QnlWYWx1ZSkge1xuICAgICAgZm9yIChjb25zdCBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgbmV3T3B0aW9uc1tvcHRpb25zW2tleV1dID0ga2V5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBvcHRpb25MaXN0ID0gT2JqZWN0LmtleXMobmV3T3B0aW9ucykuc29ydCgpLm1hcChmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtvcHRpb259IGtleT17bmV3T3B0aW9uc1tvcHRpb25dfS8+XG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9uTGlzdCA9IE9iamVjdC5rZXlzKG9wdGlvbnMpLm1hcChmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtvcHRpb25zW29wdGlvbl19IGtleT17b3B0aW9ufS8+XG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2VsZW1lbnRDbGFzc30+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wtc20tMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj17dGhpcy5wcm9wcy5sYWJlbH0+XG4gICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgICAge3JlcXVpcmVkSFRNTH1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOVwiPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lICsgJ19pbnB1dCd9XG4gICAgICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgICBpZD17dGhpcy5wcm9wcy5pZH1cbiAgICAgICAgICAgIGxpc3Q9e3RoaXMucHJvcHMubmFtZSArICdfbGlzdCd9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3RoaXMucHJvcHMucGxhY2VIb2xkZXJ9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICBvbkJsdXI9e3RoaXMuaGFuZGxlQmx1cn1cbiAgICAgICAgICAgIHJlcXVpcmVkPXtyZXF1aXJlZH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxkYXRhbGlzdCBpZD17dGhpcy5wcm9wcy5uYW1lICsgJ19saXN0J30+XG4gICAgICAgICAgICB7b3B0aW9uTGlzdH1cbiAgICAgICAgICA8L2RhdGFsaXN0PlxuICAgICAgICAgIHtlcnJvck1lc3NhZ2V9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5TZWFyY2hhYmxlRHJvcGRvd24ucHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIG9wdGlvbnM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIC8vIHN0cmljdFNlYXJjaCwgaWYgc2V0IHRvIHRydWUsIHdpbGwgcmVxdWlyZSB0aGF0IG9ubHkgb3B0aW9uc1xuICAvLyBwcm92aWRlZCBpbiB0aGUgb3B0aW9ucyBwcm9wIGNhbiBiZSBzdWJtaXR0ZWRcbiAgc3RyaWN0U2VhcmNoOiBQcm9wVHlwZXMuYm9vbCxcbiAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHZhbHVlOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIFByb3BUeXBlcy5hcnJheSxcbiAgXSksXG4gIGNsYXNzOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIHJlcXVpcmVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgZXJyb3JNZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBwbGFjZUhvbGRlcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgb25Vc2VySW5wdXQ6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuU2VhcmNoYWJsZURyb3Bkb3duLmRlZmF1bHRQcm9wcyA9IHtcbiAgbmFtZTogJycsXG4gIG9wdGlvbnM6IHt9LFxuICBzdHJpY3RTZWFyY2g6IHRydWUsXG4gIGxhYmVsOiAnJyxcbiAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgaWQ6IG51bGwsXG4gIGNsYXNzOiAnJyxcbiAgZGlzYWJsZWQ6IGZhbHNlLFxuICByZXF1aXJlZDogZmFsc2UsXG4gIHNvcnRCeVZhbHVlOiB0cnVlLFxuICBlcnJvck1lc3NhZ2U6ICcnLFxuICBwbGFjZUhvbGRlcjogJycsXG4gIG9uVXNlcklucHV0OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uVXNlcklucHV0KCkgY2FsbGJhY2sgaXMgbm90IHNldCcpO1xuICB9LFxufTtcblxuLyoqXG4gKiBTZWxlY3QgQ29tcG9uZW50XG4gKiBSZWFjdCB3cmFwcGVyIGZvciBhIHNpbXBsZSBvciAnbXVsdGlwbGUnIDxzZWxlY3Q+IGVsZW1lbnQuXG4gKi9cbmNsYXNzIFNlbGVjdEVsZW1lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZSkge1xuICAgIGxldCB2YWx1ZSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnN0IG9wdGlvbnMgPSBlLnRhcmdldC5vcHRpb25zO1xuICAgIGNvbnN0IG51bU9mT3B0aW9ucyA9IG9wdGlvbnMubGVuZ3RoO1xuXG4gICAgLy8gTXVsdGlwbGUgdmFsdWVzXG4gICAgaWYgKHRoaXMucHJvcHMubXVsdGlwbGUgJiYgbnVtT2ZPcHRpb25zID4gMSkge1xuICAgICAgdmFsdWUgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gbnVtT2ZPcHRpb25zOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChvcHRpb25zW2ldLnNlbGVjdGVkKSB7XG4gICAgICAgICAgdmFsdWUucHVzaChvcHRpb25zW2ldLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucHJvcHMub25Vc2VySW5wdXQodGhpcy5wcm9wcy5uYW1lLCB2YWx1ZSwgZS50YXJnZXQuaWQsICdzZWxlY3QnKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBtdWx0aXBsZSA9IHRoaXMucHJvcHMubXVsdGlwbGUgPyAnbXVsdGlwbGUnIDogbnVsbDtcbiAgICBjb25zdCByZXF1aXJlZCA9IHRoaXMucHJvcHMucmVxdWlyZWQgPyAncmVxdWlyZWQnIDogbnVsbDtcbiAgICBjb25zdCBkaXNhYmxlZCA9IHRoaXMucHJvcHMuZGlzYWJsZWQgPyAnZGlzYWJsZWQnIDogbnVsbDtcbiAgICBjb25zdCBzb3J0QnlWYWx1ZSA9IHRoaXMucHJvcHMuc29ydEJ5VmFsdWU7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMucHJvcHMub3B0aW9ucztcbiAgICBsZXQgZXJyb3JNZXNzYWdlID0gbnVsbDtcbiAgICBsZXQgZW1wdHlPcHRpb25IVE1MID0gbnVsbDtcbiAgICBsZXQgcmVxdWlyZWRIVE1MID0gbnVsbDtcbiAgICBsZXQgZWxlbWVudENsYXNzID0gJ3JvdyBmb3JtLWdyb3VwJztcblxuICAgIC8vIEFkZCByZXF1aXJlZCBhc3Rlcmlza1xuICAgIGlmIChyZXF1aXJlZCkge1xuICAgICAgcmVxdWlyZWRIVE1MID0gPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1kYW5nZXJcIj4qPC9zcGFuPjtcbiAgICB9XG5cbiAgICAvLyBBZGQgZW1wdHkgb3B0aW9uXG4gICAgaWYgKHRoaXMucHJvcHMuZW1wdHlPcHRpb24pIHtcbiAgICAgIGVtcHR5T3B0aW9uSFRNTCA9IDxvcHRpb24+PC9vcHRpb24+O1xuICAgIH1cblxuICAgIC8vIEFkZCBlcnJvciBtZXNzYWdlXG4gICAgaWYgKHRoaXMucHJvcHMuaGFzRXJyb3IgfHwgKHRoaXMucHJvcHMucmVxdWlyZWQgJiYgdGhpcy5wcm9wcy52YWx1ZSA9PT0gJycpKSB7XG4gICAgICBlcnJvck1lc3NhZ2UgPSA8c3Bhbj57dGhpcy5wcm9wcy5lcnJvck1lc3NhZ2V9PC9zcGFuPjtcbiAgICAgIGVsZW1lbnRDbGFzcyA9ICdyb3cgZm9ybS1ncm91cCBoYXMtZXJyb3InO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld09wdGlvbnMgPSB7fTtcbiAgICBsZXQgb3B0aW9uTGlzdCA9IFtdO1xuICAgIGlmIChzb3J0QnlWYWx1ZSkge1xuICAgICAgZm9yIChjb25zdCBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgbmV3T3B0aW9uc1tvcHRpb25zW2tleV1dID0ga2V5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBvcHRpb25MaXN0ID0gT2JqZWN0LmtleXMobmV3T3B0aW9ucykuc29ydCgpLm1hcChmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtuZXdPcHRpb25zW29wdGlvbl19IGtleT17bmV3T3B0aW9uc1tvcHRpb25dfT57b3B0aW9ufTwvb3B0aW9uPlxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbkxpc3QgPSBPYmplY3Qua2V5cyhvcHRpb25zKS5tYXAoZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT17b3B0aW9ufSBrZXk9e29wdGlvbn0+e29wdGlvbnNbb3B0aW9uXX08L29wdGlvbj5cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIERlZmF1bHQgdG8gZW1wdHkgc3RyaW5nIGZvciByZWd1bGFyIHNlbGVjdCBhbmQgdG8gZW1wdHkgYXJyYXkgZm9yICdtdWx0aXBsZScgc2VsZWN0XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnByb3BzLnZhbHVlIHx8IChtdWx0aXBsZSA/IFtdIDogJycpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtlbGVtZW50Q2xhc3N9PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9e3RoaXMucHJvcHMubGFiZWx9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgICAgIHtyZXF1aXJlZEhUTUx9XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTlcIj5cbiAgICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgICAgICBtdWx0aXBsZT17bXVsdGlwbGV9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgaWQ9e3RoaXMucHJvcHMuaWR9XG4gICAgICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICByZXF1aXJlZD17cmVxdWlyZWR9XG4gICAgICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2VtcHR5T3B0aW9uSFRNTH1cbiAgICAgICAgICAgIHtvcHRpb25MaXN0fVxuICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgIHtlcnJvck1lc3NhZ2V9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5TZWxlY3RFbGVtZW50LnByb3BUeXBlcyA9IHtcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBvcHRpb25zOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB2YWx1ZTogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICBQcm9wVHlwZXMuYXJyYXksXG4gIF0pLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgY2xhc3M6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG11bHRpcGxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICByZXF1aXJlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGVtcHR5T3B0aW9uOiBQcm9wVHlwZXMuYm9vbCxcbiAgaGFzRXJyb3I6IFByb3BUeXBlcy5ib29sLFxuICBlcnJvck1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG9uVXNlcklucHV0OiBQcm9wVHlwZXMuZnVuYyxcbn07XG5cblNlbGVjdEVsZW1lbnQuZGVmYXVsdFByb3BzID0ge1xuICBuYW1lOiAnJyxcbiAgb3B0aW9uczoge30sXG4gIGxhYmVsOiAnJyxcbiAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgaWQ6IG51bGwsXG4gIGNsYXNzOiAnJyxcbiAgbXVsdGlwbGU6IGZhbHNlLFxuICBkaXNhYmxlZDogZmFsc2UsXG4gIHJlcXVpcmVkOiBmYWxzZSxcbiAgc29ydEJ5VmFsdWU6IHRydWUsXG4gIGVtcHR5T3B0aW9uOiB0cnVlLFxuICBoYXNFcnJvcjogZmFsc2UsXG4gIGVycm9yTWVzc2FnZTogJ1RoZSBmaWVsZCBpcyByZXF1aXJlZCEnLFxuICBvblVzZXJJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVzZXJJbnB1dCgpIGNhbGxiYWNrIGlzIG5vdCBzZXQnKTtcbiAgfSxcbn07XG5cbi8qKlxuICogVGFncyBDb21wb25lbnRcbiAqIEFsbG93cyBmb3IgbXVsdGlwbGUgdmFsdWVzIHRvIGJlIGVudGVyZWQgZm9yIGEgc2luZ2xlIGZpZWxkXG4gKlxuICogQ29tZXMgaW4gMyBmbGF2b3JzOlxuICogMTogSWYgb3B0aW9ucyBhcmUgcGFzc2VkIGFuZCB1c2VTZWFyY2ggPSB0cnVlXG4gKiAgICBpbnB1dCBmaWVsZCBpcyByZW5kZXJlZCBhcyBhIHNlYXJjaGFibGUgZHJvcGRvd25cbiAqIDI6IElmIG9ubHkgb3B0aW9ucyBhcmUgcGFzc2VkLCBpbnB1dCBpcyByZW5kZXJlZCBhc1xuICogICAgYSBub3JtYWwgZHJvcGRvd24gc2VsZWN0XG4gKiAzOiBXaXRob3V0IG9wdGlvbnMsIGlucHV0IGlzIGEgbm9ybWFsLCBmcmVlIHRleHQgaW5wdXRcbiAqL1xuXG5jbGFzcyBUYWdzRWxlbWVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUtleVByZXNzID0gdGhpcy5oYW5kbGVLZXlQcmVzcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQWRkID0gdGhpcy5oYW5kbGVBZGQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVJlbW92ZSA9IHRoaXMuaGFuZGxlUmVtb3ZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRLZXlGcm9tVmFsdWUgPSB0aGlzLmdldEtleUZyb21WYWx1ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2FuQWRkSXRlbSA9IHRoaXMuY2FuQWRkSXRlbS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLy8gcGVuZGluZ1ZhbEtleSBpcyB0aGUgcGxhY2Vob2xkZXIgdmFyaWFibGUgZm9yIHRlbXBvcmFyaWx5IHN0b3JpbmdcbiAgLy8gdHlwZWQgb3Igc2VsZWN0ZWQgaXRlbXMgYmVmb3JlIGFkZGluZyB0aGVtIHRvIHRoZSBUYWdzXG4gIGhhbmRsZUNoYW5nZShlKSB7XG4gICAgdGhpcy5wcm9wcy5vblVzZXJJbnB1dCh0aGlzLnByb3BzLnBlbmRpbmdWYWxLZXksIGUudGFyZ2V0LnZhbHVlKTtcbiAgfVxuICAvLyBhbHNvIGFkZCB0YWdzIGlmIGVudGVyIGtleSBpcyBoaXQgd2l0aGluIGlucHV0IGZpZWxkXG4gIGhhbmRsZUtleVByZXNzKGUpIHtcbiAgICBpZiAoZS5rZXlDb2RlID09PSAxMyB8fCBlLndoaWNoID09PSAxMykge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5oYW5kbGVBZGQoKTtcbiAgICB9XG4gIH1cblxuICAvLyBzZW5kIHBlbmRpbmdWYWxLZXkgYXMgYW4gYXJndW1lbnQgaW4gb3JkZXIgdG8gbnVsbCBvdXQgZW50ZXJlZCBpdGVtXG4gIGhhbmRsZUFkZCgpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5wcm9wcy5vcHRpb25zO1xuICAgIGxldCB2YWx1ZSA9IHRoaXMucHJvcHMudmFsdWU7XG4gICAgLy8gaWYgdXNpbmcgYSBkYXRhbGlzdCAoc2VhcmNoKSwgc2V0IHZhbHVlIHRvIGJlIHRoZSBrZXkgaW4gb3B0aW9uc1xuICAgIGlmICh0aGlzLnByb3BzLnVzZVNlYXJjaCAmJiBPYmplY3QudmFsdWVzKG9wdGlvbnMpLmluZGV4T2YodmFsdWUpID4gLTEpIHtcbiAgICAgIHZhbHVlID0gdGhpcy5nZXRLZXlGcm9tVmFsdWUodmFsdWUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jYW5BZGRJdGVtKHZhbHVlKSkge1xuICAgICAgdGhpcy5wcm9wcy5vblVzZXJBZGQodGhpcy5wcm9wcy5uYW1lLCB2YWx1ZSwgdGhpcy5wcm9wcy5wZW5kaW5nVmFsS2V5KTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVSZW1vdmUoZSkge1xuICAgIGNvbnN0IHZhbHVlID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWl0ZW0nKTtcbiAgICB0aGlzLnByb3BzLm9uVXNlclJlbW92ZSh0aGlzLnByb3BzLm5hbWUsIHZhbHVlKTtcbiAgfVxuXG4gIGdldEtleUZyb21WYWx1ZSh2YWx1ZSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLnByb3BzLm9wdGlvbnM7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9wdGlvbnMpLmZpbmQoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG9wdGlvbnNbb10gPT09IHZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gaGVscGVyIGZ1bmN0aW9uIHRvIGRldGVjdCBpZiBpdGVtIHNob3VsZCBiZSBhZGRlZCB0byBUYWdzXG4gIGNhbkFkZEl0ZW0odmFsdWUpIHtcbiAgICBsZXQgcmVzdWx0ID0gdHJ1ZTtcbiAgICAvLyByZWplY3QgZW1wdHkgdmFsdWVzXG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAvLyByZWplY3QgaWYgYWxsb3dEdXBsIGlzIGZhbHNlIGFuZCBpdGVtIGlzIGFscmVhZHkgaW4gYXJyYXlcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnByb3BzLmFsbG93RHVwbCAmJiB0aGlzLnByb3BzLml0ZW1zLmluZGV4T2YodmFsdWUpID4gLTEpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgLy8gcmVqZWN0IGlmIHVzaW5nIGEgc3RyaWN0IGRhdGFsaXN0IGFuZCB2YWx1ZSBpcyBub3QgaW4gb3B0aW9uc1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy51c2VTZWFyY2ggJiZcbiAgICAgIHRoaXMucHJvcHMuc3RyaWN0U2VhcmNoICYmXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLnByb3BzLm9wdGlvbnMpLmluZGV4T2YodmFsdWUpID09PSAtMVxuICAgICkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IHRoaXMucHJvcHMuZGlzYWJsZWQgPyAnZGlzYWJsZWQnIDogbnVsbDtcbiAgICBsZXQgcmVxdWlyZWRIVE1MID0gbnVsbDtcbiAgICBsZXQgZW1wdHlPcHRpb25IVE1MID0gbnVsbDtcbiAgICBsZXQgZXJyb3JNZXNzYWdlID0gbnVsbDtcbiAgICBsZXQgZWxlbWVudENsYXNzID0gJ3JvdyBmb3JtLWdyb3VwJztcbiAgICAvLyBBZGQgcmVxdWlyZWQgYXN0ZXJpeFxuICAgIGlmICh0aGlzLnByb3BzLnJlcXVpcmVkKSB7XG4gICAgICByZXF1aXJlZEhUTUwgPSA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWRhbmdlclwiPio8L3NwYW4+O1xuICAgIH1cblxuICAgIC8vIEFkZCBlbXB0eSBvcHRpb25cbiAgICBpZiAodGhpcy5wcm9wcy5lbXB0eU9wdGlvbikge1xuICAgICAgZW1wdHlPcHRpb25IVE1MID0gPG9wdGlvbj48L29wdGlvbj47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuZXJyb3JNZXNzYWdlKSB7XG4gICAgICBlcnJvck1lc3NhZ2UgPSA8c3Bhbj57dGhpcy5wcm9wcy5lcnJvck1lc3NhZ2V9PC9zcGFuPjtcbiAgICAgIGVsZW1lbnRDbGFzcyA9ICdyb3cgZm9ybS1ncm91cCBoYXMtZXJyb3InO1xuICAgIH1cblxuICAgIGxldCBpbnB1dDtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5wcm9wcy5vcHRpb25zO1xuICAgIC8vIGlmIG9wdGlvbnMgYXJlIGdpdmVuIGFuZCB1c2VTZWFyY2ggaXMgc3BlY2lmaWVkXG4gICAgaWYgKE9iamVjdC5rZXlzKG9wdGlvbnMpLmxlbmd0aCA+IDAgJiYgdGhpcy5wcm9wcy51c2VTZWFyY2gpIHtcbiAgICAgIGlucHV0ID0gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICAgICAgaWQ9e3RoaXMucHJvcHMuaWR9XG4gICAgICAgICAgICBsaXN0PXt0aGlzLnByb3BzLmlkICsgJ19saXN0J31cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZSB8fCAnJ31cbiAgICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgIG9uS2V5UHJlc3M9e3RoaXMuaGFuZGxlS2V5UHJlc3N9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8ZGF0YWxpc3QgaWQ9e3RoaXMucHJvcHMuaWQgKyAnX2xpc3QnfT5cbiAgICAgICAgICAgIHtPYmplY3Qua2V5cyhvcHRpb25zKS5tYXAoZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17b3B0aW9uc1tvcHRpb25dfSBrZXk9e29wdGlvbn0+XG4gICAgICAgICAgICAgICAgICB7b3B0aW9uc1tvcHRpb25dfVxuICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPC9kYXRhbGlzdD5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgICAgLy8gaWYgb3B0aW9ucyBhcmUgcHJlc2VudCBidXQgdXNlU2VhcmNoIGlzIGZhbHNlLCB1c2Ugbm9ybWFsIGRyb3Bkb3duXG4gICAgfSBlbHNlIGlmIChPYmplY3Qua2V5cyhvcHRpb25zKS5sZW5ndGggPiAwKSB7XG4gICAgICBpbnB1dCA9IDxzZWxlY3RcbiAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICBpZD17dGhpcy5wcm9wcy5pZH1cbiAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMudmFsdWV9XG4gICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICBvbktleVByZXNzPXt0aGlzLmhhbmRsZUtleVByZXNzfVxuICAgICAgPlxuICAgICAgICB7ZW1wdHlPcHRpb25IVE1MfVxuICAgICAgICB7T2JqZWN0LmtleXMob3B0aW9ucykubWFwKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtvcHRpb259IGtleT17b3B0aW9ufT57b3B0aW9uc1tvcHRpb25dfTwvb3B0aW9uPlxuICAgICAgICAgICk7XG4gICAgICAgIH0pfVxuICAgICAgPC9zZWxlY3Q+O1xuICAgICAgLy8gZWxzZSwgdXNlIGEgdGV4dCBpbnB1dCBieSBkZWZhdWx0XG4gICAgfSBlbHNlIHtcbiAgICAgIGlucHV0ID0gPGlucHV0XG4gICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICBpZD17dGhpcy5wcm9wcy5pZH1cbiAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMudmFsdWUgfHwgJyd9XG4gICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICBvbktleVByZXNzPXt0aGlzLmhhbmRsZUtleVByZXNzfVxuICAgICAgLz47XG4gICAgfVxuXG4gICAgLy8gaXRlcmF0ZSB0aHJvdWdoIGFkZGVkIFRhZ3MgaXRlbXMgYW5kIHJlbmRlciB0aGVtXG4gICAgLy8gd2l0aCBkZWxldGlvbiBidXR0b25cbiAgICBjb25zdCBpdGVtcyA9IHRoaXMucHJvcHMuaXRlbXMubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIGxldCBpdG1UeHQ7XG4gICAgICAvLyBpbiBldmVudCB0aGF0IHRoZSBwYXNzZWQgaXRlbSBpcyBhIGtleSBvZiBvcHRpb25zLFxuICAgICAgLy8gcmVuZGVyIG9wdGlvbiB2YWx1ZVxuICAgICAgaWYgKE9iamVjdC5rZXlzKG9wdGlvbnMpLmxlbmd0aCA+IDAgJiYgb3B0aW9uc1tpdGVtXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGl0bVR4dCA9IG9wdGlvbnNbaXRlbV07XG4gICAgICAgIC8vIG90aGVyd2lzZSBqdXN0IHJlbmRlciBpdGVtIGFzIGlzXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpdG1UeHQgPSBpdGVtO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4taW5mbyBidG4taW5saW5lXCJcbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlbW92ZX1cbiAgICAgICAgICBkYXRhLWl0ZW09e2l0ZW19XG4gICAgICAgID5cbiAgICAgICAgICB7aXRtVHh0fVxuICAgICAgICAgICZuYnNwO1xuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZVwiXG4gICAgICAgICAgICBkYXRhLWl0ZW09e2l0ZW19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICApO1xuICAgIH0sIHRoaXMpO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17ZWxlbWVudENsYXNzfT5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC1zbS0zIGNvbnRyb2wtbGFiZWxcIiBodG1sRm9yPXt0aGlzLnByb3BzLmlkfT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5sYWJlbH1cbiAgICAgICAgICB7cmVxdWlyZWRIVE1MfVxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS05XCI+XG4gICAgICAgICAge2l0ZW1zfVxuICAgICAgICAgIHtpbnB1dH1cbiAgICAgICAgICB7ZXJyb3JNZXNzYWdlfVxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tc3VjY2VzcyBidG4tYWRkLXRhZ1wiXG4gICAgICAgICAgICBpZD17dGhpcy5wcm9wcy5pZCArICdBZGQnfVxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUFkZH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLXBsdXNcIi8+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5idG5MYWJlbH1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cblRhZ3NFbGVtZW50LnByb3BUeXBlcyA9IHtcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBwZW5kaW5nVmFsS2V5OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIG9wdGlvbnM6IFByb3BUeXBlcy5vYmplY3QsXG4gIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB2YWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgY2xhc3M6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG11bHRpcGxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgcmVxdWlyZWQ6IFByb3BUeXBlcy5ib29sLFxuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGVtcHR5T3B0aW9uOiBQcm9wVHlwZXMuYm9vbCxcbiAgZXJyb3JNZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBidG5MYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgYWxsb3dEdXBsOiBQcm9wVHlwZXMuYm9vbCxcbiAgdXNlU2VhcmNoOiBQcm9wVHlwZXMuYm9vbCxcbiAgc3RyaWN0U2VhcmNoOiBQcm9wVHlwZXMuYm9vbCxcbiAgb25Vc2VySW5wdXQ6IFByb3BUeXBlcy5mdW5jLFxuICBvblVzZXJBZGQ6IFByb3BUeXBlcy5mdW5jLFxuICBvblVzZXJSZW1vdmU6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuVGFnc0VsZW1lbnQuZGVmYXVsdFByb3BzID0ge1xuICBuYW1lOiAnJyxcbiAgb3B0aW9uczoge30sXG4gIGl0ZW1zOiBbXSxcbiAgbGFiZWw6ICcnLFxuICB2YWx1ZTogdW5kZWZpbmVkLFxuICBpZDogbnVsbCxcbiAgY2xhc3M6ICcnLFxuICByZXF1aXJlZDogZmFsc2UsXG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgZW1wdHlPcHRpb246IHRydWUsXG4gIGhhc0Vycm9yOiBmYWxzZSxcbiAgYWxsb3dEdXBsOiBmYWxzZSxcbiAgdXNlU2VhcmNoOiBmYWxzZSxcbiAgc3RyaWN0U2VhcmNoOiBmYWxzZSwgLy8gb25seSBhY2NlcHQgaXRlbXMgc3BlY2lmaWVkIGluIG9wdGlvbnNcbiAgZXJyb3JNZXNzYWdlOiAnJyxcbiAgcGVuZGluZ1ZhbEtleTogJycsXG4gIGJ0bkxhYmVsOiAnQWRkIFRhZycsXG4gIG9uVXNlcklucHV0OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uVXNlcklucHV0KCkgY2FsbGJhY2sgaXMgbm90IHNldCcpO1xuICB9LFxuICBvblVzZXJBZGQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUud2Fybignb25Vc2VyQWRkKCkgY2FsbGJhY2sgaXMgbm90IHNldCcpO1xuICB9LFxuICBvblVzZXJSZW1vdmU6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUud2Fybignb25Vc2VyUmVtb3ZlKCkgY2FsbGJhY2sgaXMgbm90IHNldCcpO1xuICB9LFxufTtcblxuLyoqXG4gKiBUZXh0YXJlYSBDb21wb25lbnRcbiAqIFJlYWN0IHdyYXBwZXIgZm9yIGEgPHRleHRhcmVhPiBlbGVtZW50LlxuICovXG5jbGFzcyBUZXh0YXJlYUVsZW1lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZSkge1xuICAgIHRoaXMucHJvcHMub25Vc2VySW5wdXQodGhpcy5wcm9wcy5uYW1lLCBlLnRhcmdldC52YWx1ZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSB0aGlzLnByb3BzLmRpc2FibGVkID8gJ2Rpc2FibGVkJyA6IG51bGw7XG4gICAgY29uc3QgcmVxdWlyZWQgPSB0aGlzLnByb3BzLnJlcXVpcmVkID8gJ3JlcXVpcmVkJyA6IG51bGw7XG4gICAgbGV0IHJlcXVpcmVkSFRNTCA9IG51bGw7XG5cbiAgICAvLyBBZGQgcmVxdWlyZWQgYXN0ZXJpeFxuICAgIGlmIChyZXF1aXJlZCkge1xuICAgICAgcmVxdWlyZWRIVE1MID0gPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1kYW5nZXJcIj4qPC9zcGFuPjtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZm9ybS1ncm91cFwiPlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9e3RoaXMucHJvcHMuaWR9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgICAgIHtyZXF1aXJlZEhUTUx9XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTlcIj5cbiAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgIGNvbHM9e3RoaXMucHJvcHMuY29sc31cbiAgICAgICAgICAgIHJvd3M9e3RoaXMucHJvcHMucm93c31cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgICAgICBpZD17dGhpcy5wcm9wcy5pZH1cbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnZhbHVlIHx8ICcnfVxuICAgICAgICAgICAgcmVxdWlyZWQ9e3JlcXVpcmVkfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgID5cbiAgICAgICAgICA8L3RleHRhcmVhPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuVGV4dGFyZWFFbGVtZW50LnByb3BUeXBlcyA9IHtcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdmFsdWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIHJlcXVpcmVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgcm93czogUHJvcFR5cGVzLm51bWJlcixcbiAgY29sczogUHJvcFR5cGVzLm51bWJlcixcbiAgb25Vc2VySW5wdXQ6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuVGV4dGFyZWFFbGVtZW50LmRlZmF1bHRQcm9wcyA9IHtcbiAgbmFtZTogJycsXG4gIGxhYmVsOiAnJyxcbiAgdmFsdWU6ICcnLFxuICBpZDogbnVsbCxcbiAgZGlzYWJsZWQ6IGZhbHNlLFxuICByZXF1aXJlZDogZmFsc2UsXG4gIHJvd3M6IDQsXG4gIGNvbHM6IDI1LFxuICBvblVzZXJJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVzZXJJbnB1dCgpIGNhbGxiYWNrIGlzIG5vdCBzZXQnKTtcbiAgfSxcbn07XG5cbi8qKlxuICogVGV4dGJveCBDb21wb25lbnRcbiAqIFJlYWN0IHdyYXBwZXIgZm9yIGEgPGlucHV0IHR5cGU9XCJ0ZXh0XCI+IGVsZW1lbnQuXG4gKi9cbmNsYXNzIFRleHRib3hFbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQmx1ciA9IHRoaXMuaGFuZGxlQmx1ci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGUpIHtcbiAgICB0aGlzLnByb3BzLm9uVXNlcklucHV0KHRoaXMucHJvcHMubmFtZSwgZS50YXJnZXQudmFsdWUsIGUudGFyZ2V0LmlkLCAndGV4dGJveCcpO1xuICB9XG5cbiAgaGFuZGxlQmx1cihlKSB7XG4gICAgdGhpcy5wcm9wcy5vblVzZXJCbHVyKHRoaXMucHJvcHMubmFtZSwgZS50YXJnZXQudmFsdWUpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGRpc2FibGVkID0gdGhpcy5wcm9wcy5kaXNhYmxlZCA/ICdkaXNhYmxlZCcgOiBudWxsO1xuICAgIGNvbnN0IHJlcXVpcmVkID0gdGhpcy5wcm9wcy5yZXF1aXJlZCA/ICdyZXF1aXJlZCcgOiBudWxsO1xuICAgIGxldCBlcnJvck1lc3NhZ2UgPSBudWxsO1xuICAgIGxldCByZXF1aXJlZEhUTUwgPSBudWxsO1xuICAgIGxldCBlbGVtZW50Q2xhc3MgPSAncm93IGZvcm0tZ3JvdXAnO1xuXG4gICAgLy8gQWRkIHJlcXVpcmVkIGFzdGVyaXhcbiAgICBpZiAocmVxdWlyZWQpIHtcbiAgICAgIHJlcXVpcmVkSFRNTCA9IDxzcGFuIGNsYXNzTmFtZT1cInRleHQtZGFuZ2VyXCI+Kjwvc3Bhbj47XG4gICAgfVxuXG4gICAgLy8gQWRkIGVycm9yIG1lc3NhZ2VcbiAgICBpZiAodGhpcy5wcm9wcy5lcnJvck1lc3NhZ2UpIHtcbiAgICAgIGVycm9yTWVzc2FnZSA9IDxzcGFuPnt0aGlzLnByb3BzLmVycm9yTWVzc2FnZX08L3NwYW4+O1xuICAgICAgZWxlbWVudENsYXNzID0gJ3JvdyBmb3JtLWdyb3VwIGhhcy1lcnJvcic7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtlbGVtZW50Q2xhc3N9PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9e3RoaXMucHJvcHMuaWR9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgICAgIHtyZXF1aXJlZEhUTUx9XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTlcIj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgICAgICBpZD17dGhpcy5wcm9wcy5pZH1cbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnZhbHVlIHx8ICcnfVxuICAgICAgICAgICAgcmVxdWlyZWQ9e3JlcXVpcmVkfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgb25CbHVyPXt0aGlzLmhhbmRsZUJsdXJ9XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7ZXJyb3JNZXNzYWdlfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuVGV4dGJveEVsZW1lbnQucHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB2YWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgcmVxdWlyZWQ6IFByb3BUeXBlcy5ib29sLFxuICBlcnJvck1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG9uVXNlcklucHV0OiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Vc2VyQmx1cjogUHJvcFR5cGVzLmZ1bmMsXG59O1xuXG5UZXh0Ym94RWxlbWVudC5kZWZhdWx0UHJvcHMgPSB7XG4gIG5hbWU6ICcnLFxuICBsYWJlbDogJycsXG4gIHZhbHVlOiAnJyxcbiAgaWQ6IG51bGwsXG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICBlcnJvck1lc3NhZ2U6ICcnLFxuICBvblVzZXJJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVzZXJJbnB1dCgpIGNhbGxiYWNrIGlzIG5vdCBzZXQnKTtcbiAgfSxcbiAgb25Vc2VyQmx1cjogZnVuY3Rpb24oKSB7XG4gIH0sXG59O1xuXG4vKipcbiAqIERhdGUgQ29tcG9uZW50XG4gKiBSZWFjdCB3cmFwcGVyIGZvciBhIDxpbnB1dCB0eXBlPVwiZGF0ZVwiPiBlbGVtZW50LlxuICovXG5jbGFzcyBEYXRlRWxlbWVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShlKSB7XG4gICAgdGhpcy5wcm9wcy5vblVzZXJJbnB1dCh0aGlzLnByb3BzLm5hbWUsIGUudGFyZ2V0LnZhbHVlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IHRoaXMucHJvcHMuZGlzYWJsZWQgPyAnZGlzYWJsZWQnIDogbnVsbDtcbiAgICBjb25zdCByZXF1aXJlZCA9IHRoaXMucHJvcHMucmVxdWlyZWQgPyAncmVxdWlyZWQnIDogbnVsbDtcbiAgICBsZXQgcmVxdWlyZWRIVE1MID0gbnVsbDtcblxuICAgIC8vIEFkZCByZXF1aXJlZCBhc3Rlcml4XG4gICAgaWYgKHJlcXVpcmVkKSB7XG4gICAgICByZXF1aXJlZEhUTUwgPSA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWRhbmdlclwiPio8L3NwYW4+O1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBmb3JtLWdyb3VwXCI+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wtc20tMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj17dGhpcy5wcm9wcy5sYWJlbH0+XG4gICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgICAge3JlcXVpcmVkSFRNTH1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOVwiPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cImRhdGVcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZX1cbiAgICAgICAgICAgIGlkPXt0aGlzLnByb3BzLmlkfVxuICAgICAgICAgICAgbWluPXt0aGlzLnByb3BzLm1pblllYXJ9XG4gICAgICAgICAgICBtYXg9e3RoaXMucHJvcHMubWF4WWVhcn1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnZhbHVlIHx8ICcnfVxuICAgICAgICAgICAgcmVxdWlyZWQ9e3JlcXVpcmVkfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5EYXRlRWxlbWVudC5wcm9wVHlwZXMgPSB7XG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgbWF4WWVhcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgbWluWWVhcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICByZXF1aXJlZDogUHJvcFR5cGVzLmJvb2wsXG4gIG9uVXNlcklucHV0OiBQcm9wVHlwZXMuZnVuYyxcbn07XG5cbkRhdGVFbGVtZW50LmRlZmF1bHRQcm9wcyA9IHtcbiAgbmFtZTogJycsXG4gIGxhYmVsOiAnJyxcbiAgdmFsdWU6ICcnLFxuICBpZDogbnVsbCxcbiAgbWF4WWVhcjogJzk5OTktMTItMzEnLFxuICBtaW5ZZWFyOiAnMTAwMC0wMS0wMScsXG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICBvblVzZXJJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVzZXJJbnB1dCgpIGNhbGxiYWNrIGlzIG5vdCBzZXQnKTtcbiAgfSxcbn07XG5cbi8qKlxuICogVGltZSBDb21wb25lbnRcbiAqIFJlYWN0IHdyYXBwZXIgZm9yIGEgPGlucHV0IHR5cGU9XCJ0aW1lXCI+IGVsZW1lbnQuXG4gKi9cbmNsYXNzIFRpbWVFbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZSkge1xuICAgIHRoaXMucHJvcHMub25Vc2VySW5wdXQodGhpcy5wcm9wcy5uYW1lLCBlLnRhcmdldC52YWx1ZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSB0aGlzLnByb3BzLmRpc2FibGVkID8gJ2Rpc2FibGVkJyA6IG51bGw7XG4gICAgY29uc3QgcmVxdWlyZWQgPSB0aGlzLnByb3BzLnJlcXVpcmVkID8gJ3JlcXVpcmVkJyA6IG51bGw7XG4gICAgbGV0IHJlcXVpcmVkSFRNTCA9IG51bGw7XG5cbiAgICAvLyBBZGQgcmVxdWlyZWQgYXN0ZXJpeFxuICAgIGlmIChyZXF1aXJlZCkge1xuICAgICAgcmVxdWlyZWRIVE1MID0gPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1kYW5nZXJcIj4qPC9zcGFuPjtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZm9ybS1ncm91cFwiPlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTMgY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9e3RoaXMucHJvcHMubGFiZWx9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgICAgIHtyZXF1aXJlZEhUTUx9XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTlcIj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJ0aW1lXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgICAgICBpZD17dGhpcy5wcm9wcy5pZH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnZhbHVlIHx8ICcnfVxuICAgICAgICAgICAgcmVxdWlyZWQ9e3JlcXVpcmVkfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgICAgcGF0dGVybj1cIihbMC0xXVswLTldfDJbMC00XXxbMS05XSk6KFswLTVdWzAtOV0pKDooWzAtNV1bMC05XSkpP1wiXG4gICAgICAgICAgICB0aXRsZT1cIklucHV0IG11c3QgYmUgaW4gb25lIG9mIHRoZSBmb2xsb3dpbmcgZm9ybWF0czogSEg6TU0gb3IgSEg6TU06U1NcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5UaW1lRWxlbWVudC5wcm9wVHlwZXMgPSB7XG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICByZXF1aXJlZDogUHJvcFR5cGVzLmJvb2wsXG4gIG9uVXNlcklucHV0OiBQcm9wVHlwZXMuZnVuYyxcbn07XG5cblRpbWVFbGVtZW50LmRlZmF1bHRQcm9wcyA9IHtcbiAgbmFtZTogJycsXG4gIGxhYmVsOiAnJyxcbiAgdmFsdWU6ICcnLFxuICBpZDogJycsXG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICBvblVzZXJJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVzZXJJbnB1dCgpIGNhbGxiYWNrIGlzIG5vdCBzZXQnKTtcbiAgfSxcbn07XG5cbi8qKlxuICogTnVtZXJpYyBDb21wb25lbnRcbiAqIFJlYWN0IHdyYXBwZXIgZm9yIGEgPGlucHV0IHR5cGU9XCJudW1iZXJcIj4gZWxlbWVudC5cbiAqL1xuY2xhc3MgTnVtZXJpY0VsZW1lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZSkge1xuICAgIHRoaXMucHJvcHMub25Vc2VySW5wdXQodGhpcy5wcm9wcy5uYW1lLCBlLnRhcmdldC52YWx1ZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSB0aGlzLnByb3BzLmRpc2FibGVkID8gJ2Rpc2FibGVkJyA6IG51bGw7XG4gICAgY29uc3QgcmVxdWlyZWQgPSB0aGlzLnByb3BzLnJlcXVpcmVkID8gJ3JlcXVpcmVkJyA6IG51bGw7XG4gICAgY29uc3QgcmVxdWlyZWRIVE1MID0gbnVsbDtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBmb3JtLWdyb3VwXCI+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjb2wtc20tMyBjb250cm9sLWxhYmVsXCIgaHRtbEZvcj17dGhpcy5wcm9wcy5pZH0+XG4gICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgICAge3JlcXVpcmVkSFRNTH1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOVwiPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICAgICAgaWQ9e3RoaXMucHJvcHMuaWR9XG4gICAgICAgICAgICBtaW49e3RoaXMucHJvcHMubWlufVxuICAgICAgICAgICAgbWF4PXt0aGlzLnByb3BzLm1heH1cbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnZhbHVlfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgICAgcmVxdWlyZWQ9e3JlcXVpcmVkfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5OdW1lcmljRWxlbWVudC5wcm9wVHlwZXMgPSB7XG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgbWluOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIG1heDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdmFsdWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIHJlcXVpcmVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgb25Vc2VySW5wdXQ6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuTnVtZXJpY0VsZW1lbnQuZGVmYXVsdFByb3BzID0ge1xuICBuYW1lOiAnJyxcbiAgbWluOiBudWxsLFxuICBtYXg6IG51bGwsXG4gIGxhYmVsOiAnJyxcbiAgdmFsdWU6ICcnLFxuICBpZDogbnVsbCxcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICBkaXNhYmxlZDogZmFsc2UsXG4gIG9uVXNlcklucHV0OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uVXNlcklucHV0KCkgY2FsbGJhY2sgaXMgbm90IHNldCcpO1xuICB9LFxufTtcblxuLyoqXG4gKiBGaWxlIENvbXBvbmVudFxuICogUmVhY3Qgd3JhcHBlciBmb3IgYSBzaW1wbGUgb3IgJ211bHRpcGxlJyA8c2VsZWN0PiBlbGVtZW50LlxuICovXG5jbGFzcyBGaWxlRWxlbWVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShlKSB7XG4gICAgLy8gU2VuZCBjdXJyZW50IGZpbGUgdG8gcGFyZW50IGNvbXBvbmVudFxuICAgIGNvbnN0IGZpbGUgPSBlLnRhcmdldC5maWxlc1swXSA/IGUudGFyZ2V0LmZpbGVzWzBdIDogJyc7XG4gICAgdGhpcy5wcm9wcy5vblVzZXJJbnB1dCh0aGlzLnByb3BzLm5hbWUsIGZpbGUpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJlcXVpcmVkID0gdGhpcy5wcm9wcy5yZXF1aXJlZCA/ICdyZXF1aXJlZCcgOiBudWxsO1xuICAgIGNvbnN0IGZpbGVOYW1lID0gdGhpcy5wcm9wcy52YWx1ZSA/IHRoaXMucHJvcHMudmFsdWUubmFtZSA6IHVuZGVmaW5lZDtcbiAgICBsZXQgcmVxdWlyZWRIVE1MID0gbnVsbDtcbiAgICBsZXQgZXJyb3JNZXNzYWdlID0gJyc7XG4gICAgbGV0IGVsZW1lbnRDbGFzcyA9ICdyb3cgZm9ybS1ncm91cCc7XG5cbiAgICAvLyBBZGQgcmVxdWlyZWQgYXN0ZXJpeFxuICAgIGlmIChyZXF1aXJlZCkge1xuICAgICAgcmVxdWlyZWRIVE1MID0gPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1kYW5nZXJcIj4qPC9zcGFuPjtcbiAgICB9XG5cbiAgICBjb25zdCB0cnVuY2F0ZUVsbGlwc2lzID0ge1xuICAgICAgZGlzcGxheTogJ3RhYmxlJyxcbiAgICAgIHRhYmxlTGF5b3V0OiAnZml4ZWQnLFxuICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgIH07XG5cbiAgICBjb25zdCB0cnVuY2F0ZUVsbGlwc2lzQ2hpbGQgPSB7XG4gICAgICBkaXNwbGF5OiAndGFibGUtY2VsbCcsXG4gICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICB0ZXh0T3ZlcmZsb3c6ICdlbGxpcHNpcycsXG4gICAgfTtcblxuICAgIC8vIEFkZCBlcnJvciBtZXNzYWdlXG4gICAgaWYgKHRoaXMucHJvcHMuaGFzRXJyb3IpIHtcbiAgICAgIGVycm9yTWVzc2FnZSA9IHRoaXMucHJvcHMuZXJyb3JNZXNzYWdlO1xuICAgICAgZWxlbWVudENsYXNzID0gJ3JvdyBmb3JtLWdyb3VwIGhhcy1lcnJvcic7XG4gICAgfVxuXG4gICAgLy8gTmVlZCB0byBtYW51YWxseSByZXNldCBmaWxlIHZhbHVlLCBiZWNhdXNlIEhUTUwgQVBJXG4gICAgLy8gZG9lcyBub3QgYWxsb3cgc2V0dGluZyB2YWx1ZSB0byBhbnl0aGluZyB0aGFuIGVtcHR5IHN0cmluZy5cbiAgICAvLyBIZW5jZSBjYW4ndCB1c2UgdmFsdWUgYXR0cmlidXRlIGluIHRoZSBpbnB1dCBlbGVtZW50LlxuICAgIGNvbnN0IGZpbGVIVE1MID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZpbGVVcGxvYWQnKTtcbiAgICBpZiAoZmlsZUhUTUwgJiYgIWZpbGVOYW1lKSB7XG4gICAgICBmaWxlSFRNTC52YWx1ZSA9ICcnO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmRpc2FibGVkKSB7XG4gICAgICAvLyBhZGQgcGFkZGluZyB0byBhbGlnbiB2aWRlbyB0aXRsZSBvbiBkaXNhYmxlZCBmaWVsZFxuICAgICAgdHJ1bmNhdGVFbGxpcHNpcy5wYWRkaW5nVG9wID0gJzdweCc7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17ZWxlbWVudENsYXNzfT5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTMgY29udHJvbC1sYWJlbFwiPlxuICAgICAgICAgICAge3RoaXMucHJvcHMubGFiZWx9XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS05XCI+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt0cnVuY2F0ZUVsbGlwc2lzfT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3RydW5jYXRlRWxsaXBzaXNDaGlsZH0+e2ZpbGVOYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtlbGVtZW50Q2xhc3N9PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTMgY29udHJvbC1sYWJlbFwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgICAgIHtyZXF1aXJlZEhUTUx9XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTlcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwXCI+XG4gICAgICAgICAgICA8ZGl2IHRhYkluZGV4PVwiLTFcIiBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2wgZmlsZS1jYXB0aW9uIGt2LWZpbGVpbnB1dC1jYXB0aW9uXCI+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RydW5jYXRlRWxsaXBzaXN9PlxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt0cnVuY2F0ZUVsbGlwc2lzQ2hpbGR9PntmaWxlTmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbGUtY2FwdGlvbi1uYW1lXCIgaWQ9XCJ2aWRlb19maWxlXCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAtYnRuXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1maWxlXCI+XG4gICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1mb2xkZXItb3BlblwiPjwvaT4gQnJvd3NlXG4gICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmaWxlVXBsb2FkXCJcbiAgICAgICAgICAgICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZX1cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgICAgICAgIHJlcXVpcmVkPXtyZXF1aXJlZH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxzcGFuPntlcnJvck1lc3NhZ2V9PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuRmlsZUVsZW1lbnQucHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB2YWx1ZTogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICBQcm9wVHlwZXMub2JqZWN0LFxuICBdKSxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgcmVxdWlyZWQ6IFByb3BUeXBlcy5ib29sLFxuICBoYXNFcnJvcjogUHJvcFR5cGVzLmJvb2wsXG4gIGVycm9yTWVzc2FnZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgb25Vc2VySW5wdXQ6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuRmlsZUVsZW1lbnQuZGVmYXVsdFByb3BzID0ge1xuICBuYW1lOiAnJyxcbiAgbGFiZWw6ICdGaWxlIHRvIFVwbG9hZCcsXG4gIHZhbHVlOiAnJyxcbiAgaWQ6IG51bGwsXG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICBoYXNFcnJvcjogZmFsc2UsXG4gIGVycm9yTWVzc2FnZTogJ1RoZSBmaWVsZCBpcyByZXF1aXJlZCEnLFxuICBvblVzZXJJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVzZXJJbnB1dCgpIGNhbGxiYWNrIGlzIG5vdCBzZXQnKTtcbiAgfSxcbn07XG5cbi8qKlxuICogU3RhdGljIGVsZW1lbnQgY29tcG9uZW50LlxuICogVXNlZCB0byBkaXNwbGF5cyBwbGFpbi9mb3JtYXR0ZWQgdGV4dCBhcyBwYXJ0IG9mIGEgZm9ybVxuICpcbiAqIFRvIHBhc3MgYSBmb3JtYXR0ZWQgdGV4dCwgeW91IG5lZWQgdG8gd3JhcCBpdCBpbiBhIHNpbmdsZSBwYXJlbnQgZWxlbWVudC5cbiAqIEV4YW1wbGUgdXNhZ2U6XG4gKlxuICogYGBgXG4gKiBsZXQgbXlUZXh0ID0gKDxzcGFuPlRoaXMgaXMgbXkgPGI+dGV4dDwvYj48L3NwYW4+KTtcbiAqIDxTdGF0aWNFbGVtZW50XG4gKiAgICB0ZXh0PXtteVRleHR9XG4gKiAgICBsYWJlbD17bm90ZX1cbiAqIC8+XG4gKiBgYGBcbiAqL1xuY2xhc3MgU3RhdGljRWxlbWVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZm9ybS1ncm91cFwiPlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTMgY29udHJvbC1sYWJlbFwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxhYmVsfVxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS05XCI+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sLXN0YXRpY1wiPnt0aGlzLnByb3BzLnRleHR9PC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuU3RhdGljRWxlbWVudC5wcm9wVHlwZXMgPSB7XG4gIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB0ZXh0OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIFByb3BUeXBlcy5lbGVtZW50LFxuICBdKSxcbn07XG5cblN0YXRpY0VsZW1lbnQuZGVmYXVsdFByb3BzID0ge1xuICBsYWJlbDogJycsXG4gIHRleHQ6IG51bGwsXG59O1xuXG4vKipcbiAqIExpbmsgZWxlbWVudCBjb21wb25lbnQuXG4gKiBVc2VkIHRvIGxpbmsgcGxhaW4vZm9ybWF0ZWQgdGV4dCB0byBhbiBocmVmIGRlc3RpbmF0aW9uIGFzIHBhcnQgb2YgYSBmb3JtXG4gKi9cbmNsYXNzIExpbmtFbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGZvcm0tZ3JvdXBcIj5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNvbC1zbS0zIGNvbnRyb2wtbGFiZWxcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5sYWJlbH1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOVwiPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbC1zdGF0aWNcIj5cbiAgICAgICAgICAgIDxhIGhyZWY9e3RoaXMucHJvcHMuaHJlZn0+e3RoaXMucHJvcHMudGV4dH08L2E+XG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuTGlua0VsZW1lbnQucHJvcFR5cGVzID0ge1xuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdGV4dDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICBQcm9wVHlwZXMuZWxlbWVudCxcbiAgXSksXG4gIGhyZWY6IFByb3BUeXBlcy5zdHJpbmcsXG59O1xuXG5MaW5rRWxlbWVudC5kZWZhdWx0UHJvcHMgPSB7XG4gIGxhYmVsOiAnJyxcbiAgdGV4dDogbnVsbCxcbiAgaHJlZjogbnVsbCxcbn07XG5cbi8qKlxuICogQ2hlY2tib3ggQ29tcG9uZW50XG4gKiBSZWFjdCB3cmFwcGVyIGZvciBhIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIj4gZWxlbWVudC5cbiAqL1xuY2xhc3MgQ2hlY2tib3hFbGVtZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZSkge1xuICAgIHRoaXMucHJvcHMub25Vc2VySW5wdXQodGhpcy5wcm9wcy5uYW1lLCBlLnRhcmdldC5jaGVja2VkKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IHRoaXMucHJvcHMuZGlzYWJsZWQgPyAnZGlzYWJsZWQnIDogbnVsbDtcbiAgICBjb25zdCByZXF1aXJlZCA9IHRoaXMucHJvcHMucmVxdWlyZWQgPyAncmVxdWlyZWQnIDogbnVsbDtcbiAgICBsZXQgZXJyb3JNZXNzYWdlID0gbnVsbDtcbiAgICBsZXQgcmVxdWlyZWRIVE1MID0gbnVsbDtcbiAgICBsZXQgZWxlbWVudENsYXNzID0gJ2NoZWNrYm94LWlubGluZSBjb2wtc20tb2Zmc2V0LTMnO1xuICAgIGNvbnN0IGxhYmVsID0gbnVsbDtcblxuICAgIC8vIEFkZCByZXF1aXJlZCBhc3Rlcml4XG4gICAgaWYgKHJlcXVpcmVkKSB7XG4gICAgICByZXF1aXJlZEhUTUwgPSA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWRhbmdlclwiPio8L3NwYW4+O1xuICAgIH1cblxuICAgIC8vIEFkZCBlcnJvciBtZXNzYWdlXG4gICAgaWYgKHRoaXMucHJvcHMuZXJyb3JNZXNzYWdlKSB7XG4gICAgICBlcnJvck1lc3NhZ2UgPSA8c3Bhbj57dGhpcy5wcm9wcy5lcnJvck1lc3NhZ2V9PC9zcGFuPjtcbiAgICAgIGVsZW1lbnRDbGFzcyA9ICdjaGVja2JveC1pbmxpbmUgY29sLXNtLW9mZnNldC0zIGhhcy1lcnJvcic7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtlbGVtZW50Q2xhc3N9PlxuICAgICAgICA8bGFiZWwgaHRtbEZvcj17dGhpcy5wcm9wcy5pZH0+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICAgICAgaWQ9e3RoaXMucHJvcHMuaWR9XG4gICAgICAgICAgICBjaGVja2VkPXt0aGlzLnByb3BzLnZhbHVlfVxuICAgICAgICAgICAgcmVxdWlyZWQ9e3JlcXVpcmVkfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgIC8+XG4gICAgICAgICAge2Vycm9yTWVzc2FnZX1cbiAgICAgICAgICB7dGhpcy5wcm9wcy5sYWJlbH1cbiAgICAgICAgICB7cmVxdWlyZWRIVE1MfVxuICAgICAgICA8L2xhYmVsPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5DaGVja2JveEVsZW1lbnQucHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHZhbHVlOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICByZXF1aXJlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGVycm9yTWVzc2FnZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgb25Vc2VySW5wdXQ6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuQ2hlY2tib3hFbGVtZW50LmRlZmF1bHRQcm9wcyA9IHtcbiAgaWQ6IG51bGwsXG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICBlcnJvck1lc3NhZ2U6ICcnLFxuICBvblVzZXJJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdvblVzZXJJbnB1dCgpIGNhbGxiYWNrIGlzIG5vdCBzZXQnKTtcbiAgfSxcbn07XG5cbi8qKlxuICogQnV0dG9uIGNvbXBvbmVudFxuICogUmVhY3Qgd3JhcHBlciBmb3IgPGJ1dHRvbj4gZWxlbWVudCwgdHlwaWNhbGx5IHVzZWQgdG8gc3VibWl0IGZvcm1zXG4gKi9cbmNsYXNzIEJ1dHRvbkVsZW1lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soZSkge1xuICAgIHRoaXMucHJvcHMub25Vc2VySW5wdXQoZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGZvcm0tZ3JvdXBcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e3RoaXMucHJvcHMuY29sdW1uU2l6ZX0+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuICAgICAgICAgICAgdHlwZT17dGhpcy5wcm9wcy50eXBlfVxuICAgICAgICAgICAgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmJ1dHRvbkNsYXNzfVxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja31cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5sYWJlbH1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkJ1dHRvbkVsZW1lbnQucHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdHlwZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgb25Vc2VySW5wdXQ6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuQnV0dG9uRWxlbWVudC5kZWZhdWx0UHJvcHMgPSB7XG4gIGxhYmVsOiAnU3VibWl0JyxcbiAgdHlwZTogJ3N1Ym1pdCcsXG4gIGJ1dHRvbkNsYXNzOiAnYnRuIGJ0bi1wcmltYXJ5JyxcbiAgY29sdW1uU2l6ZTogJ2NvbC1zbS05IGNvbC1zbS1vZmZzZXQtMycsXG4gIG9uVXNlcklucHV0OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uVXNlcklucHV0KCkgY2FsbGJhY2sgaXMgbm90IHNldCcpO1xuICB9LFxufTtcblxuLyoqXG4gICogQ2FsbCBUbyBBY3Rpb24gKENUQSkgY29tcG9uZW50XG4gICogUmVhY3Qgd3JhcHBlciBmb3IgPGJ1dHRvbj4gZWxlbWVudCB0aGF0IGlzIHVzZWQgZm9yIENhbGwgdG8gQWN0aW9ucywgdXN1YWxseVxuICAqIG91dHNpZGUgdGhlIGNvbnRleHQgb2YgZm9ybXMuXG4gICovXG5jbGFzcyBDVEEgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b25cbiAgICAgICAgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmJ1dHRvbkNsYXNzfVxuICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLm9uVXNlcklucHV0fVxuICAgICAgPlxuICAgICAgICB7dGhpcy5wcm9wcy5sYWJlbH1cbiAgICAgIDwvYnV0dG9uPlxuICAgICk7XG4gIH1cbn1cblxuQ1RBLnByb3BUeXBlcyA9IHtcbiAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGJ1dHRvbkNsYXNzOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBvblVzZXJJbnB1dDogUHJvcFR5cGVzLmZ1bmMsXG59O1xuXG5DVEEuZGVmYXVsdFByb3BzID0ge1xuICBidXR0b25DbGFzczogJ2J0biBidG4tcHJpbWFyeScsXG4gIG9uVXNlcklucHV0OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ29uVXNlcklucHV0KCkgY2FsbGJhY2sgaXMgbm90IHNldCcpO1xuICB9LFxufTtcblxuLyoqXG4gKiBHZW5lcmljIGZvcm0gZWxlbWVudC5cbiAqL1xuY2xhc3MgTG9yaXNFbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGVsZW1lbnRQcm9wcyA9IHRoaXMucHJvcHMuZWxlbWVudDtcbiAgICBlbGVtZW50UHJvcHMucmVmID0gZWxlbWVudFByb3BzLm5hbWU7XG4gICAgZWxlbWVudFByb3BzLm9uVXNlcklucHV0ID0gdGhpcy5wcm9wcy5vblVzZXJJbnB1dDtcblxuICAgIGxldCBlbGVtZW50SHRtbCA9IDxkaXY+PC9kaXY+O1xuXG4gICAgc3dpdGNoIChlbGVtZW50UHJvcHMudHlwZSkge1xuICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgIGVsZW1lbnRIdG1sID0gKDxUZXh0Ym94RWxlbWVudCB7Li4uZWxlbWVudFByb3BzfSAvPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGFncyc6XG4gICAgICAgIGVsZW1lbnRIdG1sID0gKDxUYWdzRWxlbWVudCB7Li4uZWxlbWVudFByb3BzfSAvPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgICAgZWxlbWVudEh0bWwgPSAoPFNlbGVjdEVsZW1lbnQgey4uLmVsZW1lbnRQcm9wc30gLz4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NlYXJjaCc6XG4gICAgICAgIGVsZW1lbnRIdG1sID0gKDxTZWFyY2hhYmxlRHJvcGRvd24gey4uLmVsZW1lbnRQcm9wc30vPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgIGVsZW1lbnRIdG1sID0gKDxEYXRlRWxlbWVudCB7Li4uZWxlbWVudFByb3BzfSAvPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgIGVsZW1lbnRIdG1sID0gKDxUaW1lRWxlbWVudCB7Li4uZWxlbWVudFByb3BzfSAvPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnVtZXJpYyc6XG4gICAgICAgIGVsZW1lbnRIdG1sID0gKDxOdW1lcmljRWxlbWVudCB7Li4uZWxlbWVudFByb3BzfSAvPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGV4dGFyZWEnOlxuICAgICAgICBlbGVtZW50SHRtbCA9ICg8VGV4dGFyZWFFbGVtZW50IHsuLi5lbGVtZW50UHJvcHN9IC8+KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdmaWxlJzpcbiAgICAgICAgZWxlbWVudEh0bWwgPSAoPEZpbGVFbGVtZW50IHsuLi5lbGVtZW50UHJvcHN9IC8+KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdGF0aWMnOlxuICAgICAgICBlbGVtZW50SHRtbCA9ICg8U3RhdGljRWxlbWVudCB7Li4uZWxlbWVudFByb3BzfSAvPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGluayc6XG4gICAgICAgIGVsZW1lbnRIdG1sID0gKDxMaW5rRWxlbWVudCB7Li4uZWxlbWVudFByb3BzfSAvPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYWR2Y2hlY2tib3gnOlxuICAgICAgICBlbGVtZW50SHRtbCA9ICg8Q2hlY2tib3hFbGVtZW50IHsuLi5lbGVtZW50UHJvcHN9IC8+KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAnRWxlbWVudCBvZiB0eXBlICcgKyBlbGVtZW50UHJvcHMudHlwZSArICcgaXMgbm90IGN1cnJlbnRseSBpbXBsZW1lbnRlZCEnXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50SHRtbDtcbiAgfVxufVxuXG53aW5kb3cuRm9ybUVsZW1lbnQgPSBGb3JtRWxlbWVudDtcbndpbmRvdy5GaWVsZHNldEVsZW1lbnQgPSBGaWVsZHNldEVsZW1lbnQ7XG53aW5kb3cuU2VsZWN0RWxlbWVudCA9IFNlbGVjdEVsZW1lbnQ7XG53aW5kb3cuVGFnc0VsZW1lbnQgPSBUYWdzRWxlbWVudDtcbndpbmRvdy5TZWFyY2hhYmxlRHJvcGRvd24gPSBTZWFyY2hhYmxlRHJvcGRvd247XG53aW5kb3cuVGV4dGFyZWFFbGVtZW50ID0gVGV4dGFyZWFFbGVtZW50O1xud2luZG93LlRleHRib3hFbGVtZW50ID0gVGV4dGJveEVsZW1lbnQ7XG53aW5kb3cuRGF0ZUVsZW1lbnQgPSBEYXRlRWxlbWVudDtcbndpbmRvdy5UaW1lRWxlbWVudCA9IFRpbWVFbGVtZW50O1xud2luZG93Lk51bWVyaWNFbGVtZW50ID0gTnVtZXJpY0VsZW1lbnQ7XG53aW5kb3cuRmlsZUVsZW1lbnQgPSBGaWxlRWxlbWVudDtcbndpbmRvdy5TdGF0aWNFbGVtZW50ID0gU3RhdGljRWxlbWVudDtcbndpbmRvdy5MaW5rRWxlbWVudCA9IExpbmtFbGVtZW50O1xud2luZG93LkNoZWNrYm94RWxlbWVudCA9IENoZWNrYm94RWxlbWVudDtcbndpbmRvdy5CdXR0b25FbGVtZW50ID0gQnV0dG9uRWxlbWVudDtcbndpbmRvdy5DVEEgPSBDVEE7XG53aW5kb3cuTG9yaXNFbGVtZW50ID0gTG9yaXNFbGVtZW50O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIEZvcm1FbGVtZW50LFxuICBGaWVsZHNldEVsZW1lbnQsXG4gIFNlbGVjdEVsZW1lbnQsXG4gIFRhZ3NFbGVtZW50LFxuICBTZWFyY2hhYmxlRHJvcGRvd24sXG4gIFRleHRhcmVhRWxlbWVudCxcbiAgVGV4dGJveEVsZW1lbnQsXG4gIERhdGVFbGVtZW50LFxuICBUaW1lRWxlbWVudCxcbiAgTnVtZXJpY0VsZW1lbnQsXG4gIEZpbGVFbGVtZW50LFxuICBTdGF0aWNFbGVtZW50LFxuICBMaW5rRWxlbWVudCxcbiAgQ2hlY2tib3hFbGVtZW50LFxuICBCdXR0b25FbGVtZW50LFxuICBDVEEsXG4gIExvcmlzRWxlbWVudCxcbn07XG4iLCIvKipcbiAqIFRoaXMgZmlsZSBjb250YWlucyB0aGUgUmVhY3QgY29tcG9uZW50IGZvciBMb2FkZXJcbiAqXG4gKiBAYXV0aG9yIEhlbnJpIFJhYmFsYWlzXG4gKiBAdmVyc2lvbiAxLjAuMFxuICpcbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbi8qKlxuICogTG9hZGVyIGNvbXBvbmVudFxuICovXG5jbGFzcyBMb2FkZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J2xvYWRlcidcbiAgICAgICAgc3R5bGU9e3t3aWR0aDogcGFyc2VJbnQodGhpcy5wcm9wcy5zaXplKSwgaGVpZ2h0OiBwYXJzZUludCh0aGlzLnByb3BzLnNpemUpfX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxufVxuXG5Mb2FkZXIucHJvcFR5cGVzID0ge3NpemU6IFByb3BUeXBlcy5zdHJpbmd9O1xuTG9hZGVyLmRlZmF1bHRQcm9wcyA9IHtzaXplOiAnMTIwJ307XG5cbmV4cG9ydCBkZWZhdWx0IExvYWRlcjtcbiIsIi8qIGV4cG9ydGVkIFJQYWdpbmF0aW9uTGlua3MgKi9cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5jbGFzcyBQYWdpbmF0aW9uTGlua3MgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG5cbiAgICB9O1xuICAgIHRoaXMuY2hhbmdlUGFnZSA9IHRoaXMuY2hhbmdlUGFnZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY2hhbmdlUGFnZShpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgLy8gRG9uJ3QganVtcCB0byB0aGUgdG9wIG9mIHRoZSBwYWdlXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgaWYgKHRoaXMucHJvcHMub25DaGFuZ2VQYWdlKSB7XG4gICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2VQYWdlKGkpO1xuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgcm93c1BlclBhZ2UgPSB0aGlzLnByb3BzLlJvd3NQZXJQYWdlO1xuICAgIGxldCBwYWdlTGlua3MgPSBbXTtcbiAgICBsZXQgY2xhc3NMaXN0O1xuICAgIGxldCBsYXN0UGFnZSA9IE1hdGguY2VpbCh0aGlzLnByb3BzLlRvdGFsIC8gcm93c1BlclBhZ2UpO1xuICAgIGxldCBzdGFydFBhZ2UgPSBNYXRoLm1heCgxLCB0aGlzLnByb3BzLkFjdGl2ZSAtIDMpO1xuICAgIGxldCBsYXN0U2hvd25QYWdlID0gTWF0aC5taW4odGhpcy5wcm9wcy5BY3RpdmUgKyAzLCBsYXN0UGFnZSk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5Ub3RhbCA9PT0gMCkge1xuICAgICAgcmV0dXJuIDxkaXYgLz47XG4gICAgfVxuICAgIGlmICh0aGlzLnByb3BzLlRvdGFsIDwgdGhpcy5wcm9wcy5Sb3dzUGVyUGFnZSkge1xuICAgICAgcmV0dXJuIDxkaXYgLz47XG4gICAgfVxuXG4gICAgaWYgKChsYXN0U2hvd25QYWdlIC0gc3RhcnRQYWdlKSA8PSA3KSB7XG4gICAgICBsYXN0U2hvd25QYWdlID0gc3RhcnRQYWdlICsgNjtcbiAgICAgIGlmIChsYXN0U2hvd25QYWdlID4gbGFzdFBhZ2UpIHtcbiAgICAgICAgbGFzdFNob3duUGFnZSA9IGxhc3RQYWdlO1xuICAgICAgICBzdGFydFBhZ2UgPSBsYXN0UGFnZSAtIDY7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0UGFnZSA+IDEpIHtcbiAgICAgIHBhZ2VMaW5rcy5wdXNoKFxuICAgICAgICA8bGkga2V5PXsndGFibGVfcGFnZV9iZWdpbm5pbmdfJyArIHN0YXJ0UGFnZS50b1N0cmluZygpfSBvbkNsaWNrPXt0aGlzLmNoYW5nZVBhZ2UoMSl9PjxhIGhyZWY9JyMnPiZsYXF1bzs8L2E+PC9saT5cbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChzdGFydFBhZ2UgPCAxKSB7XG4gICAgICBzdGFydFBhZ2UgPSAxO1xuICAgIH1cbiAgICBpZiAobGFzdFNob3duUGFnZSA8IDEpIHtcbiAgICAgIGxhc3RTaG93blBhZ2UgPSAxO1xuICAgIH1cblxuICAgICAgICAvLyBJZiB0aGVyZSBpcyBvbmx5IDEgcGFnZSwgZG9uJ3QgZGlzcGxheSBwYWdpbmF0aW9uIGxpbmtzXG4gICAgaWYgKHN0YXJ0UGFnZSA9PT0gbGFzdFNob3duUGFnZSkge1xuICAgICAgcmV0dXJuIDxkaXYgLz47XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0UGFnZTsgaSA8PSBsYXN0U2hvd25QYWdlOyBpICs9IDEpIHtcbiAgICAgIGNsYXNzTGlzdCA9ICcnO1xuICAgICAgaWYgKHRoaXMucHJvcHMuQWN0aXZlID09PSBpKSB7XG4gICAgICAgIGNsYXNzTGlzdCA9ICdhY3RpdmUnO1xuICAgICAgfVxuICAgICAgcGFnZUxpbmtzLnB1c2goXG4gICAgICAgIDxsaSBrZXk9eyd0YWJsZV9wYWdlXycgKyBpLnRvU3RyaW5nKCl9IG9uQ2xpY2s9e3RoaXMuY2hhbmdlUGFnZShpKX0gY2xhc3NOYW1lPXtjbGFzc0xpc3R9PlxuICAgICAgICAgIDxhIGhyZWY9XCIjXCI+e2l9PC9hPlxuICAgICAgICA8L2xpPlxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKGxhc3RTaG93blBhZ2UgIT09IGxhc3RQYWdlKSB7XG4gICAgICBwYWdlTGlua3MucHVzaChcbiAgICAgICAgPGxpIGtleT17J3RhYmxlX3BhZ2VfbW9yZV8nICsgbGFzdFNob3duUGFnZS50b1N0cmluZygpfSBvbkNsaWNrPXt0aGlzLmNoYW5nZVBhZ2UobGFzdFBhZ2UpfT5cbiAgICAgICAgICA8YSBocmVmPScjJz4mcmFxdW87PC9hPlxuICAgICAgICA8L2xpPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHVsIGNsYXNzTmFtZT0ncGFnaW5hdGlvbiBwYWdpbmF0aW9uLXRhYmxlJz5cbiAgICAgICAgICB7cGFnZUxpbmtzfVxuICAgICAgPC91bD5cbiAgICApO1xuICB9XG59XG5QYWdpbmF0aW9uTGlua3MucHJvcFR5cGVzID0ge1xuICBvbkNoYW5nZVBhZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBUb3RhbDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxufTtcblBhZ2luYXRpb25MaW5rcy5kZWZhdWx0UHJvcHMgPSB7XG4gIFJvd3NQZXJQYWdlOiAxMCxcbiAgQWN0aXZlOiAxLFxufTtcblxubGV0IFJQYWdpbmF0aW9uTGlua3MgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KFBhZ2luYXRpb25MaW5rcyk7XG5cbndpbmRvdy5QYWdpbmF0aW9uTGlua3MgPSBQYWdpbmF0aW9uTGlua3M7XG53aW5kb3cuUlBhZ2luYXRpb25MaW5rcyA9IFJQYWdpbmF0aW9uTGlua3M7XG5cbmV4cG9ydCBkZWZhdWx0IFBhZ2luYXRpb25MaW5rcztcbiIsIi8qKlxuICogVGhpcyBmaWxlIGNvbnRhaW5zIFJlYWN0IGNvbXBvbmVudCBmb3IgUGFuZWxcbiAqXG4gKiBAYXV0aG9yIEFsZXggSS5cbiAqIEB2ZXJzaW9uIDEuMC4wXG4gKlxuICovXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuLyoqXG4gKiBQYW5lbCBjb21wb25lbnRcbiAqIFdyYXBzIGNoaWxkcmVuIGluIGEgY29sbGFwc2libGUgYm9vdHN0cmFwIHBhbmVsXG4gKi9cbmNsYXNzIFBhbmVsIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgY29sbGFwc2VkOiB0aGlzLnByb3BzLmluaXRDb2xsYXBzZWQsXG4gICAgfTtcblxuICAgIC8vIEluaXRpYWxpemUgcGFuZWwgY2xhc3MgYmFzZWQgb24gY29sbGFwc2VkIHN0YXR1c1xuICAgIHRoaXMucGFuZWxDbGFzcyA9IChcbiAgICAgIHRoaXMucHJvcHMuaW5pdENvbGxhcHNlZCA/XG4gICAgICAgICdwYW5lbC1jb2xsYXBzZSBjb2xsYXBzZScgOlxuICAgICAgICAncGFuZWwtY29sbGFwc2UgY29sbGFwc2UgaW4nXG4gICAgKTtcblxuICAgIHRoaXMudG9nZ2xlQ29sbGFwc2VkID0gdGhpcy50b2dnbGVDb2xsYXBzZWQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHRvZ2dsZUNvbGxhcHNlZCgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtjb2xsYXBzZWQ6ICF0aGlzLnN0YXRlLmNvbGxhcHNlZH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIC8vIENoYW5nZSBhcnJvdyBkaXJlY3Rpb24gYmFzZWQgb24gY29sbGFwc2Ugc3RhdHVzXG4gICAgbGV0IGdseXBoQ2xhc3MgPSAoXG4gICAgICB0aGlzLnN0YXRlLmNvbGxhcHNlZCA/XG4gICAgICAgICdnbHlwaGljb24gcHVsbC1yaWdodCBnbHlwaGljb24tY2hldnJvbi1kb3duJyA6XG4gICAgICAgICdnbHlwaGljb24gcHVsbC1yaWdodCBnbHlwaGljb24tY2hldnJvbi11cCdcbiAgICApO1xuXG4gICAgLy8gQWRkIHBhbmVsIGhlYWRlciwgaWYgdGl0bGUgaXMgc2V0XG4gICAgY29uc3QgcGFuZWxIZWFkaW5nID0gdGhpcy5wcm9wcy50aXRsZSA/IChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPVwicGFuZWwtaGVhZGluZ1wiXG4gICAgICAgIG9uQ2xpY2s9e3RoaXMudG9nZ2xlQ29sbGFwc2VkfVxuICAgICAgICBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJcbiAgICAgICAgZGF0YS10YXJnZXQ9eycjJyArIHRoaXMucHJvcHMuaWR9XG4gICAgICAgIHN0eWxlPXt7Y3Vyc29yOiAncG9pbnRlcid9fVxuICAgICAgPlxuICAgICAgICB7dGhpcy5wcm9wcy50aXRsZX1cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtnbHlwaENsYXNzfT48L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICApIDogJyc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbCBwYW5lbC1wcmltYXJ5XCI+XG4gICAgICAgIHtwYW5lbEhlYWRpbmd9XG4gICAgICAgIDxkaXYgaWQ9e3RoaXMucHJvcHMuaWR9IGNsYXNzTmFtZT17dGhpcy5wYW5lbENsYXNzfSByb2xlPVwidGFicGFuZWxcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWJvZHlcIiBzdHlsZT17e2hlaWdodDogdGhpcy5wcm9wcy5oZWlnaHR9fT5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuUGFuZWwucHJvcFR5cGVzID0ge1xuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZyxcbn07XG5QYW5lbC5kZWZhdWx0UHJvcHMgPSB7XG4gIGluaXRDb2xsYXBzZWQ6IGZhbHNlLFxuICBpZDogJ2RlZmF1bHQtcGFuZWwnLFxuICBoZWlnaHQ6ICcxMDAlJyxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBhbmVsO1xuIiwiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgTG9hZGVyIGZyb20gJ0xvYWRlcic7XG5pbXBvcnQgRmlsdGVyYWJsZURhdGFUYWJsZSBmcm9tICdGaWx0ZXJhYmxlRGF0YVRhYmxlJztcblxuLyoqXG4gKiBESUNPTSBBcmNoaXZlIFBhZ2UuXG4gKlxuICogU2VydmVzIGFzIGFuIGVudHJ5LXBvaW50IHRvIHRoZSBtb2R1bGUsIHJlbmRlcmluZyB0aGUgd2hvbGUgcmVhY3RcbiAqIGNvbXBvbmVudCBwYWdlIG9uIGxvYWQuXG4gKlxuICogUmVuZGVycyBESUNPTSBBcmNoaXZlIG1haW4gcGFnZSBjb25zaXN0aW5nIG9mIEZpbHRlclRhYmxlIGFuZFxuICogRGF0YVRhYmxlIGNvbXBvbmVudHMuXG4gKlxuICogQGF1dGhvciBMT1JJUyBUZWFtXG4gKiBAdmVyc2lvbiAxLjAuMFxuICpcbiAqICovXG5jbGFzcyBEaWNvbUFyY2hpdmUgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBkYXRhOiB7fSxcbiAgICAgIGVycm9yOiBmYWxzZSxcbiAgICAgIGlzTG9hZGVkOiBmYWxzZSxcbiAgICB9O1xuXG4gICAgdGhpcy5mZXRjaERhdGEgPSB0aGlzLmZldGNoRGF0YS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZm9ybWF0Q29sdW1uID0gdGhpcy5mb3JtYXRDb2x1bW4uYmluZCh0aGlzKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuZmV0Y2hEYXRhKClcbiAgICAgIC50aGVuKCgpID0+IHRoaXMuc2V0U3RhdGUoe2lzTG9hZGVkOiB0cnVlfSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGRhdGEgZnJvbSB0aGUgcHJvdmlkZWQgVVJMIGFuZCBzYXZlIGl0IGluIHN0YXRlXG4gICAqXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIGZldGNoRGF0YSgpIHtcbiAgICByZXR1cm4gZmV0Y2godGhpcy5wcm9wcy5kYXRhVVJMLCB7Y3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbid9KVxuICAgICAgLnRoZW4oKHJlc3ApID0+IHJlc3AuanNvbigpKVxuICAgICAgLnRoZW4oKGRhdGEpID0+IHRoaXMuc2V0U3RhdGUoe2RhdGF9KSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZXJyb3I6IHRydWV9KTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb2RpZnkgYmVoYXZpb3VyIG9mIHNwZWNpZmllZCBjb2x1bW4gY2VsbHMgaW4gdGhlIERhdGEgVGFibGUgY29tcG9uZW50XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb2x1bW4gLSBjb2x1bW4gbmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2VsbCAtIGNlbGwgY29udGVudFxuICAgKiBAcGFyYW0ge29iamVjdH0gcm93IC0gcm93IGNvbnRlbnQgaW5kZXhlZCBieSBjb2x1bW5cbiAgICpcbiAgICogQHJldHVybiB7Kn0gYSBmb3JtYXRlZCB0YWJsZSBjZWxsIGZvciBhIGdpdmVuIGNvbHVtblxuICAgKi9cbiAgZm9ybWF0Q29sdW1uKGNvbHVtbiwgY2VsbCwgcm93KSB7XG4gICAgbGV0IHJlc3VsdCA9IDx0ZD57Y2VsbH08L3RkPjtcbiAgICBzd2l0Y2ggKGNvbHVtbikge1xuICAgICAgY2FzZSAnQXJjaGl2ZSBMb2NhdGlvbic6IHtcbiAgICAgICAgY29uc3QgZG93bmxvYWRVUkwgPSAnL21yaS9qaXYvZ2V0X2ZpbGUucGhwP2ZpbGU9JyArIGNlbGw7XG4gICAgICAgIHJlc3VsdCA9XG4gICAgICAgICAgPHRkPlxuICAgICAgICAgICAgPGEgaHJlZj17ZG93bmxvYWRVUkx9PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLWNsb3VkLWRvd25sb2FkXCIvPlxuICAgICAgICAgICAgICAmbmJzcDtcbiAgICAgICAgICAgICAge2NlbGx9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgPC90ZD47XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgJ01ldGFkYXRhJzoge1xuICAgICAgICBjb25zdCBtZXRhZGF0YVVSTCA9IGxvcmlzLkJhc2VVUkwgK1xuICAgICAgICAgICcvZGljb21fYXJjaGl2ZS92aWV3RGV0YWlscy8/dGFyY2hpdmVJRD0nICsgcm93LlRhcmNoaXZlSUQ7XG4gICAgICAgIHJlc3VsdCA9IDx0ZD48YSBocmVmPXttZXRhZGF0YVVSTH0+e2NlbGx9PC9hPjwvdGQ+O1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdNUkkgQnJvd3Nlcic6IHtcbiAgICAgICAgaWYgKHJvdy5TZXNzaW9uSUQgPT09IG51bGwgfHwgcm93LlNlc3Npb25JRCA9PT0gJycpIHtcbiAgICAgICAgICByZXN1bHQgPSA8dGQ+Jm5ic3A7PC90ZD47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IG1ybFVSTCA9IGxvcmlzLkJhc2VVUkwgKyAnL2ltYWdpbmdfYnJvd3Nlci92aWV3U2Vzc2lvbi8/c2Vzc2lvbklEPScgK1xuICAgICAgICAgICAgcm93LlNlc3Npb25JRDtcbiAgICAgICAgICByZXN1bHQgPSA8dGQ+PGEgaHJlZj17bXJsVVJMfT57Y2VsbH08L2E+PC90ZD47XG4gICAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnSU5WQUxJRCAtIEhJRERFTic6XG4gICAgICAgIHJlc3VsdCA9IDx0ZCBjbGFzc05hbWU9XCJ0ZXh0LWRhbmdlclwiPntjZWxsfTwvdGQ+O1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvLyBJZiBlcnJvciBvY2N1cnMsIHJldHVybiBhIG1lc3NhZ2UuXG4gICAgLy8gWFhYOiBSZXBsYWNlIHRoaXMgd2l0aCBhIFVJIGNvbXBvbmVudCBmb3IgNTAwIGVycm9ycy5cbiAgICBpZiAodGhpcy5zdGF0ZS5lcnJvcikge1xuICAgICAgcmV0dXJuIDxoMz5BbiBlcnJvciBvY2N1cmVkIHdoaWxlIGxvYWRpbmcgdGhlIHBhZ2UuPC9oMz47XG4gICAgfVxuXG4gICAgLy8gV2FpdGluZyBmb3IgYXN5bmMgZGF0YSB0byBsb2FkXG4gICAgaWYgKCF0aGlzLnN0YXRlLmlzTG9hZGVkKSB7XG4gICAgICByZXR1cm4gPExvYWRlci8+O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFhYWDogQ3VycmVudGx5LCB0aGUgb3JkZXIgb2YgdGhlc2UgZmllbGRzIE1VU1QgbWF0Y2ggdGhlIG9yZGVyIG9mIHRoZVxuICAgICAqIHF1ZXJpZWQgY29sdW1ucyBpbiBfc2V0dXBWYXJpYWJsZXMoKSBpbiBkaWNvbV9hcmNoaXZlLmNsYXNzLmluY1xuICAgICAqL1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLnN0YXRlLmRhdGEuZmllbGRPcHRpb25zO1xuICAgIGNvbnN0IGZpZWxkcyA9IFtcbiAgICAgIHtsYWJlbDogJ1BhdGllbnQgSUQnLCBzaG93OiB0cnVlLCBmaWx0ZXI6IHtcbiAgICAgICAgbmFtZTogJ3BhdGllbnRJRCcsXG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgIH19LFxuICAgICAge2xhYmVsOiAnUGF0aWVudCBOYW1lJywgc2hvdzogdHJ1ZSwgZmlsdGVyOiB7XG4gICAgICAgIG5hbWU6ICdwYXRpZW50TmFtZScsXG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgIH19LFxuICAgICAge2xhYmVsOiAnU2V4Jywgc2hvdzogdHJ1ZSwgZmlsdGVyOiB7XG4gICAgICAgIG5hbWU6ICdzZXgnLFxuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICB9fSxcbiAgICAgIHtsYWJlbDogJ0RhdGUgb2YgQmlydGgnLCBzaG93OiB0cnVlLCBmaWx0ZXI6IHtcbiAgICAgICAgbmFtZTogJ2RhdGVPZkJpcnRoJyxcbiAgICAgICAgdHlwZTogJ2RhdGUnLFxuICAgICAgfX0sXG4gICAgICB7bGFiZWw6ICdBY3F1aXNpdGlvbiBEYXRlJywgc2hvdzogdHJ1ZSwgZmlsdGVyOiB7XG4gICAgICAgIG5hbWU6ICdhY3F1aXNpdGlvbkRhdGUnLFxuICAgICAgICB0eXBlOiAnZGF0ZScsXG4gICAgICB9fSxcbiAgICAgIHtsYWJlbDogJ0FyY2hpdmUgTG9jYXRpb24nLCBzaG93OiB0cnVlLCBmaWx0ZXI6IHtcbiAgICAgICAgbmFtZTogJ2FyY2hpdmVMb2NhdGlvbicsXG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgIH19LFxuICAgICAge2xhYmVsOiAnTWV0YWRhdGEnLCBzaG93OiB0cnVlfSxcbiAgICAgIHtsYWJlbDogJ01SSSBCcm93c2VyJywgc2hvdzogdHJ1ZX0sXG4gICAgICB7bGFiZWw6ICdTZXJpZXMgVUlEJywgc2hvdzogZmFsc2UsIGZpbHRlcjoge1xuICAgICAgICBuYW1lOiAnc2VyaWVzVUlEJyxcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgfX0sXG4gICAgICB7bGFiZWw6ICdTaXRlJywgc2hvdzogZmFsc2UsIGZpbHRlcjoge1xuICAgICAgICBuYW1lOiAnc2l0ZScsXG4gICAgICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgICAgICBvcHRpb25zOiBvcHRpb25zLnNpdGVzLFxuICAgICAgfX0sXG4gICAgICB7bGFiZWw6ICdUYXJjaGl2ZUlEJywgc2hvdzogZmFsc2V9LFxuICAgICAge2xhYmVsOiAnU2Vzc2lvbklEJywgc2hvdzogZmFsc2V9LFxuICAgIF07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZpbHRlcmFibGVEYXRhVGFibGVcbiAgICAgICAgbmFtZT1cImRpY29tX2ZpbHRlclwiXG4gICAgICAgIHRpdGxlPSdEaWNvbSBBcmNoaXZlJ1xuICAgICAgICBkYXRhPXt0aGlzLnN0YXRlLmRhdGEuZGF0YX1cbiAgICAgICAgZmllbGRzPXtmaWVsZHN9XG4gICAgICAgIGdldEZvcm1hdHRlZENlbGw9e3RoaXMuZm9ybWF0Q29sdW1ufVxuICAgICAgLz5cbiAgICApO1xuICB9XG59XG5cbkRpY29tQXJjaGl2ZS5wcm9wVHlwZXMgPSB7XG4gIGRhdGFVUkw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbn07XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICBSZWFjdERPTS5yZW5kZXIoXG4gICAgPERpY29tQXJjaGl2ZSBkYXRhVVJMPXtsb3Jpcy5CYXNlVVJMICsgJy9kaWNvbV9hcmNoaXZlLz9mb3JtYXQ9anNvbid9Lz4sXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvcmlzd29ya3NwYWNlJylcbiAgKTtcbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogXG4gKi9cblxuZnVuY3Rpb24gbWFrZUVtcHR5RnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGFyZztcbiAgfTtcbn1cblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGFjY2VwdHMgYW5kIGRpc2NhcmRzIGlucHV0czsgaXQgaGFzIG5vIHNpZGUgZWZmZWN0cy4gVGhpcyBpc1xuICogcHJpbWFyaWx5IHVzZWZ1bCBpZGlvbWF0aWNhbGx5IGZvciBvdmVycmlkYWJsZSBmdW5jdGlvbiBlbmRwb2ludHMgd2hpY2hcbiAqIGFsd2F5cyBuZWVkIHRvIGJlIGNhbGxhYmxlLCBzaW5jZSBKUyBsYWNrcyBhIG51bGwtY2FsbCBpZGlvbSBhbGEgQ29jb2EuXG4gKi9cbnZhciBlbXB0eUZ1bmN0aW9uID0gZnVuY3Rpb24gZW1wdHlGdW5jdGlvbigpIHt9O1xuXG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zID0gbWFrZUVtcHR5RnVuY3Rpb247XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zRmFsc2UgPSBtYWtlRW1wdHlGdW5jdGlvbihmYWxzZSk7XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zVHJ1ZSA9IG1ha2VFbXB0eUZ1bmN0aW9uKHRydWUpO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGwgPSBtYWtlRW1wdHlGdW5jdGlvbihudWxsKTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNUaGlzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcztcbn07XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zQXJndW1lbnQgPSBmdW5jdGlvbiAoYXJnKSB7XG4gIHJldHVybiBhcmc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGVtcHR5RnVuY3Rpb247IiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG52YXIgdmFsaWRhdGVGb3JtYXQgPSBmdW5jdGlvbiB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpIHt9O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YWxpZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIHZhbGlkYXRlRm9ybWF0KGZvcm1hdCkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhcmlhbnQgcmVxdWlyZXMgYW4gZXJyb3IgbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gaW52YXJpYW50KGNvbmRpdGlvbiwgZm9ybWF0LCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIHZhbGlkYXRlRm9ybWF0KGZvcm1hdCk7XG5cbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB2YXIgZXJyb3I7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcignTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYXJncyA9IFthLCBiLCBjLCBkLCBlLCBmXTtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gYXJnc1thcmdJbmRleCsrXTtcbiAgICAgIH0pKTtcbiAgICAgIGVycm9yLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gICAgfVxuXG4gICAgZXJyb3IuZnJhbWVzVG9Qb3AgPSAxOyAvLyB3ZSBkb24ndCBjYXJlIGFib3V0IGludmFyaWFudCdzIG93biBmcmFtZVxuICAgIHRocm93IGVycm9yO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW52YXJpYW50OyIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCcuL2VtcHR5RnVuY3Rpb24nKTtcblxuLyoqXG4gKiBTaW1pbGFyIHRvIGludmFyaWFudCBidXQgb25seSBsb2dzIGEgd2FybmluZyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXQuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGxvZyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzIGluIGNyaXRpY2FsXG4gKiBwYXRocy4gUmVtb3ZpbmcgdGhlIGxvZ2dpbmcgY29kZSBmb3IgcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMgd2lsbCBrZWVwIHRoZVxuICogc2FtZSBsb2dpYyBhbmQgZm9sbG93IHRoZSBzYW1lIGNvZGUgcGF0aHMuXG4gKi9cblxudmFyIHdhcm5pbmcgPSBlbXB0eUZ1bmN0aW9uO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24gcHJpbnRXYXJuaW5nKGZvcm1hdCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICsgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgIH0pO1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyAtLS0gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgLS0tXG4gICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKHgpIHt9XG4gIH07XG5cbiAgd2FybmluZyA9IGZ1bmN0aW9uIHdhcm5pbmcoY29uZGl0aW9uLCBmb3JtYXQpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYHdhcm5pbmcoY29uZGl0aW9uLCBmb3JtYXQsIC4uLmFyZ3MpYCByZXF1aXJlcyBhIHdhcm5pbmcgJyArICdtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuXG4gICAgaWYgKGZvcm1hdC5pbmRleE9mKCdGYWlsZWQgQ29tcG9zaXRlIHByb3BUeXBlOiAnKSA9PT0gMCkge1xuICAgICAgcmV0dXJuOyAvLyBJZ25vcmUgQ29tcG9zaXRlQ29tcG9uZW50IHByb3B0eXBlIGNoZWNrLlxuICAgIH1cblxuICAgIGlmICghY29uZGl0aW9uKSB7XG4gICAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMiA+IDIgPyBfbGVuMiAtIDIgOiAwKSwgX2tleTIgPSAyOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICAgIGFyZ3NbX2tleTIgLSAyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgICB9XG5cbiAgICAgIHByaW50V2FybmluZy5hcHBseSh1bmRlZmluZWQsIFtmb3JtYXRdLmNvbmNhdChhcmdzKSk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdhcm5pbmc7IiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24oKSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gcmVxdWlyZSgnLi9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcbiAgdmFyIGxvZ2dlZFR5cGVGYWlsdXJlcyA9IHt9O1xuXG4gIHByaW50V2FybmluZyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICsgdGV4dDtcbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9IGNhdGNoICh4KSB7fVxuICB9O1xufVxuXG4vKipcbiAqIEFzc2VydCB0aGF0IHRoZSB2YWx1ZXMgbWF0Y2ggd2l0aCB0aGUgdHlwZSBzcGVjcy5cbiAqIEVycm9yIG1lc3NhZ2VzIGFyZSBtZW1vcml6ZWQgYW5kIHdpbGwgb25seSBiZSBzaG93biBvbmNlLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSB0eXBlU3BlY3MgTWFwIG9mIG5hbWUgdG8gYSBSZWFjdFByb3BUeXBlXG4gKiBAcGFyYW0ge29iamVjdH0gdmFsdWVzIFJ1bnRpbWUgdmFsdWVzIHRoYXQgbmVlZCB0byBiZSB0eXBlLWNoZWNrZWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvbiBlLmcuIFwicHJvcFwiLCBcImNvbnRleHRcIiwgXCJjaGlsZCBjb250ZXh0XCJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21wb25lbnROYW1lIE5hbWUgb2YgdGhlIGNvbXBvbmVudCBmb3IgZXJyb3IgbWVzc2FnZXMuXG4gKiBAcGFyYW0gez9GdW5jdGlvbn0gZ2V0U3RhY2sgUmV0dXJucyB0aGUgY29tcG9uZW50IHN0YWNrLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY2hlY2tQcm9wVHlwZXModHlwZVNwZWNzLCB2YWx1ZXMsIGxvY2F0aW9uLCBjb21wb25lbnROYW1lLCBnZXRTdGFjaykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGZvciAodmFyIHR5cGVTcGVjTmFtZSBpbiB0eXBlU3BlY3MpIHtcbiAgICAgIGlmICh0eXBlU3BlY3MuaGFzT3duUHJvcGVydHkodHlwZVNwZWNOYW1lKSkge1xuICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgIC8vIFByb3AgdHlwZSB2YWxpZGF0aW9uIG1heSB0aHJvdy4gSW4gY2FzZSB0aGV5IGRvLCB3ZSBkb24ndCB3YW50IHRvXG4gICAgICAgIC8vIGZhaWwgdGhlIHJlbmRlciBwaGFzZSB3aGVyZSBpdCBkaWRuJ3QgZmFpbCBiZWZvcmUuIFNvIHdlIGxvZyBpdC5cbiAgICAgICAgLy8gQWZ0ZXIgdGhlc2UgaGF2ZSBiZWVuIGNsZWFuZWQgdXAsIHdlJ2xsIGxldCB0aGVtIHRocm93LlxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFRoaXMgaXMgaW50ZW50aW9uYWxseSBhbiBpbnZhcmlhbnQgdGhhdCBnZXRzIGNhdWdodC4gSXQncyB0aGUgc2FtZVxuICAgICAgICAgIC8vIGJlaGF2aW9yIGFzIHdpdGhvdXQgdGhpcyBzdGF0ZW1lbnQgZXhjZXB0IHdpdGggYSBiZXR0ZXIgbWVzc2FnZS5cbiAgICAgICAgICBpZiAodHlwZW9mIHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgZXJyID0gRXJyb3IoXG4gICAgICAgICAgICAgIChjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycpICsgJzogJyArIGxvY2F0aW9uICsgJyB0eXBlIGAnICsgdHlwZVNwZWNOYW1lICsgJ2AgaXMgaW52YWxpZDsgJyArXG4gICAgICAgICAgICAgICdpdCBtdXN0IGJlIGEgZnVuY3Rpb24sIHVzdWFsbHkgZnJvbSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UsIGJ1dCByZWNlaXZlZCBgJyArIHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSArICdgLidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBlcnIubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZXJyb3IgPSB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSh2YWx1ZXMsIHR5cGVTcGVjTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIG51bGwsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICBlcnJvciA9IGV4O1xuICAgICAgICB9XG4gICAgICAgIGlmIChlcnJvciAmJiAhKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSB7XG4gICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgKGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJykgKyAnOiB0eXBlIHNwZWNpZmljYXRpb24gb2YgJyArXG4gICAgICAgICAgICBsb2NhdGlvbiArICcgYCcgKyB0eXBlU3BlY05hbWUgKyAnYCBpcyBpbnZhbGlkOyB0aGUgdHlwZSBjaGVja2VyICcgK1xuICAgICAgICAgICAgJ2Z1bmN0aW9uIG11c3QgcmV0dXJuIGBudWxsYCBvciBhbiBgRXJyb3JgIGJ1dCByZXR1cm5lZCBhICcgKyB0eXBlb2YgZXJyb3IgKyAnLiAnICtcbiAgICAgICAgICAgICdZb3UgbWF5IGhhdmUgZm9yZ290dGVuIHRvIHBhc3MgYW4gYXJndW1lbnQgdG8gdGhlIHR5cGUgY2hlY2tlciAnICtcbiAgICAgICAgICAgICdjcmVhdG9yIChhcnJheU9mLCBpbnN0YW5jZU9mLCBvYmplY3RPZiwgb25lT2YsIG9uZU9mVHlwZSwgYW5kICcgK1xuICAgICAgICAgICAgJ3NoYXBlIGFsbCByZXF1aXJlIGFuIGFyZ3VtZW50KS4nXG4gICAgICAgICAgKVxuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgIShlcnJvci5tZXNzYWdlIGluIGxvZ2dlZFR5cGVGYWlsdXJlcykpIHtcbiAgICAgICAgICAvLyBPbmx5IG1vbml0b3IgdGhpcyBmYWlsdXJlIG9uY2UgYmVjYXVzZSB0aGVyZSB0ZW5kcyB0byBiZSBhIGxvdCBvZiB0aGVcbiAgICAgICAgICAvLyBzYW1lIGVycm9yLlxuICAgICAgICAgIGxvZ2dlZFR5cGVGYWlsdXJlc1tlcnJvci5tZXNzYWdlXSA9IHRydWU7XG5cbiAgICAgICAgICB2YXIgc3RhY2sgPSBnZXRTdGFjayA/IGdldFN0YWNrKCkgOiAnJztcblxuICAgICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAgICdGYWlsZWQgJyArIGxvY2F0aW9uICsgJyB0eXBlOiAnICsgZXJyb3IubWVzc2FnZSArIChzdGFjayAhPSBudWxsID8gc3RhY2sgOiAnJylcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2hlY2tQcm9wVHlwZXM7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcblxudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gcmVxdWlyZSgnLi9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcbnZhciBjaGVja1Byb3BUeXBlcyA9IHJlcXVpcmUoJy4vY2hlY2tQcm9wVHlwZXMnKTtcblxudmFyIHByaW50V2FybmluZyA9IGZ1bmN0aW9uKCkge307XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHByaW50V2FybmluZyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICsgdGV4dDtcbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9IGNhdGNoICh4KSB7fVxuICB9O1xufVxuXG5mdW5jdGlvbiBlbXB0eUZ1bmN0aW9uVGhhdFJldHVybnNOdWxsKCkge1xuICByZXR1cm4gbnVsbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpc1ZhbGlkRWxlbWVudCwgdGhyb3dPbkRpcmVjdEFjY2Vzcykge1xuICAvKiBnbG9iYWwgU3ltYm9sICovXG4gIHZhciBJVEVSQVRPUl9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5pdGVyYXRvcjtcbiAgdmFyIEZBVVhfSVRFUkFUT1JfU1lNQk9MID0gJ0BAaXRlcmF0b3InOyAvLyBCZWZvcmUgU3ltYm9sIHNwZWMuXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGl0ZXJhdG9yIG1ldGhvZCBmdW5jdGlvbiBjb250YWluZWQgb24gdGhlIGl0ZXJhYmxlIG9iamVjdC5cbiAgICpcbiAgICogQmUgc3VyZSB0byBpbnZva2UgdGhlIGZ1bmN0aW9uIHdpdGggdGhlIGl0ZXJhYmxlIGFzIGNvbnRleHQ6XG4gICAqXG4gICAqICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4obXlJdGVyYWJsZSk7XG4gICAqICAgICBpZiAoaXRlcmF0b3JGbikge1xuICAgKiAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwobXlJdGVyYWJsZSk7XG4gICAqICAgICAgIC4uLlxuICAgKiAgICAgfVxuICAgKlxuICAgKiBAcGFyYW0gez9vYmplY3R9IG1heWJlSXRlcmFibGVcbiAgICogQHJldHVybiB7P2Z1bmN0aW9ufVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0SXRlcmF0b3JGbihtYXliZUl0ZXJhYmxlKSB7XG4gICAgdmFyIGl0ZXJhdG9yRm4gPSBtYXliZUl0ZXJhYmxlICYmIChJVEVSQVRPUl9TWU1CT0wgJiYgbWF5YmVJdGVyYWJsZVtJVEVSQVRPUl9TWU1CT0xdIHx8IG1heWJlSXRlcmFibGVbRkFVWF9JVEVSQVRPUl9TWU1CT0xdKTtcbiAgICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvckZuO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb2xsZWN0aW9uIG9mIG1ldGhvZHMgdGhhdCBhbGxvdyBkZWNsYXJhdGlvbiBhbmQgdmFsaWRhdGlvbiBvZiBwcm9wcyB0aGF0IGFyZVxuICAgKiBzdXBwbGllZCB0byBSZWFjdCBjb21wb25lbnRzLiBFeGFtcGxlIHVzYWdlOlxuICAgKlxuICAgKiAgIHZhciBQcm9wcyA9IHJlcXVpcmUoJ1JlYWN0UHJvcFR5cGVzJyk7XG4gICAqICAgdmFyIE15QXJ0aWNsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICogICAgIHByb3BUeXBlczoge1xuICAgKiAgICAgICAvLyBBbiBvcHRpb25hbCBzdHJpbmcgcHJvcCBuYW1lZCBcImRlc2NyaXB0aW9uXCIuXG4gICAqICAgICAgIGRlc2NyaXB0aW9uOiBQcm9wcy5zdHJpbmcsXG4gICAqXG4gICAqICAgICAgIC8vIEEgcmVxdWlyZWQgZW51bSBwcm9wIG5hbWVkIFwiY2F0ZWdvcnlcIi5cbiAgICogICAgICAgY2F0ZWdvcnk6IFByb3BzLm9uZU9mKFsnTmV3cycsJ1Bob3RvcyddKS5pc1JlcXVpcmVkLFxuICAgKlxuICAgKiAgICAgICAvLyBBIHByb3AgbmFtZWQgXCJkaWFsb2dcIiB0aGF0IHJlcXVpcmVzIGFuIGluc3RhbmNlIG9mIERpYWxvZy5cbiAgICogICAgICAgZGlhbG9nOiBQcm9wcy5pbnN0YW5jZU9mKERpYWxvZykuaXNSZXF1aXJlZFxuICAgKiAgICAgfSxcbiAgICogICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7IC4uLiB9XG4gICAqICAgfSk7XG4gICAqXG4gICAqIEEgbW9yZSBmb3JtYWwgc3BlY2lmaWNhdGlvbiBvZiBob3cgdGhlc2UgbWV0aG9kcyBhcmUgdXNlZDpcbiAgICpcbiAgICogICB0eXBlIDo9IGFycmF5fGJvb2x8ZnVuY3xvYmplY3R8bnVtYmVyfHN0cmluZ3xvbmVPZihbLi4uXSl8aW5zdGFuY2VPZiguLi4pXG4gICAqICAgZGVjbCA6PSBSZWFjdFByb3BUeXBlcy57dHlwZX0oLmlzUmVxdWlyZWQpP1xuICAgKlxuICAgKiBFYWNoIGFuZCBldmVyeSBkZWNsYXJhdGlvbiBwcm9kdWNlcyBhIGZ1bmN0aW9uIHdpdGggdGhlIHNhbWUgc2lnbmF0dXJlLiBUaGlzXG4gICAqIGFsbG93cyB0aGUgY3JlYXRpb24gb2YgY3VzdG9tIHZhbGlkYXRpb24gZnVuY3Rpb25zLiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogIHZhciBNeUxpbmsgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAqICAgIHByb3BUeXBlczoge1xuICAgKiAgICAgIC8vIEFuIG9wdGlvbmFsIHN0cmluZyBvciBVUkkgcHJvcCBuYW1lZCBcImhyZWZcIi5cbiAgICogICAgICBocmVmOiBmdW5jdGlvbihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUpIHtcbiAgICogICAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAqICAgICAgICBpZiAocHJvcFZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHByb3BWYWx1ZSAhPT0gJ3N0cmluZycgJiZcbiAgICogICAgICAgICAgICAhKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFVSSSkpIHtcbiAgICogICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcbiAgICogICAgICAgICAgICAnRXhwZWN0ZWQgYSBzdHJpbmcgb3IgYW4gVVJJIGZvciAnICsgcHJvcE5hbWUgKyAnIGluICcgK1xuICAgKiAgICAgICAgICAgIGNvbXBvbmVudE5hbWVcbiAgICogICAgICAgICAgKTtcbiAgICogICAgICAgIH1cbiAgICogICAgICB9XG4gICAqICAgIH0sXG4gICAqICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7Li4ufVxuICAgKiAgfSk7XG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cblxuICB2YXIgQU5PTllNT1VTID0gJzw8YW5vbnltb3VzPj4nO1xuXG4gIC8vIEltcG9ydGFudCFcbiAgLy8gS2VlcCB0aGlzIGxpc3QgaW4gc3luYyB3aXRoIHByb2R1Y3Rpb24gdmVyc2lvbiBpbiBgLi9mYWN0b3J5V2l0aFRocm93aW5nU2hpbXMuanNgLlxuICB2YXIgUmVhY3RQcm9wVHlwZXMgPSB7XG4gICAgYXJyYXk6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdhcnJheScpLFxuICAgIGJvb2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdib29sZWFuJyksXG4gICAgZnVuYzogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2Z1bmN0aW9uJyksXG4gICAgbnVtYmVyOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignbnVtYmVyJyksXG4gICAgb2JqZWN0OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignb2JqZWN0JyksXG4gICAgc3RyaW5nOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignc3RyaW5nJyksXG4gICAgc3ltYm9sOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignc3ltYm9sJyksXG5cbiAgICBhbnk6IGNyZWF0ZUFueVR5cGVDaGVja2VyKCksXG4gICAgYXJyYXlPZjogY3JlYXRlQXJyYXlPZlR5cGVDaGVja2VyLFxuICAgIGVsZW1lbnQ6IGNyZWF0ZUVsZW1lbnRUeXBlQ2hlY2tlcigpLFxuICAgIGluc3RhbmNlT2Y6IGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIsXG4gICAgbm9kZTogY3JlYXRlTm9kZUNoZWNrZXIoKSxcbiAgICBvYmplY3RPZjogY3JlYXRlT2JqZWN0T2ZUeXBlQ2hlY2tlcixcbiAgICBvbmVPZjogY3JlYXRlRW51bVR5cGVDaGVja2VyLFxuICAgIG9uZU9mVHlwZTogY3JlYXRlVW5pb25UeXBlQ2hlY2tlcixcbiAgICBzaGFwZTogY3JlYXRlU2hhcGVUeXBlQ2hlY2tlcixcbiAgICBleGFjdDogY3JlYXRlU3RyaWN0U2hhcGVUeXBlQ2hlY2tlcixcbiAgfTtcblxuICAvKipcbiAgICogaW5saW5lZCBPYmplY3QuaXMgcG9seWZpbGwgdG8gYXZvaWQgcmVxdWlyaW5nIGNvbnN1bWVycyBzaGlwIHRoZWlyIG93blxuICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvaXNcbiAgICovXG4gIC8qZXNsaW50LWRpc2FibGUgbm8tc2VsZi1jb21wYXJlKi9cbiAgZnVuY3Rpb24gaXMoeCwgeSkge1xuICAgIC8vIFNhbWVWYWx1ZSBhbGdvcml0aG1cbiAgICBpZiAoeCA9PT0geSkge1xuICAgICAgLy8gU3RlcHMgMS01LCA3LTEwXG4gICAgICAvLyBTdGVwcyA2LmItNi5lOiArMCAhPSAtMFxuICAgICAgcmV0dXJuIHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTdGVwIDYuYTogTmFOID09IE5hTlxuICAgICAgcmV0dXJuIHggIT09IHggJiYgeSAhPT0geTtcbiAgICB9XG4gIH1cbiAgLyplc2xpbnQtZW5hYmxlIG5vLXNlbGYtY29tcGFyZSovXG5cbiAgLyoqXG4gICAqIFdlIHVzZSBhbiBFcnJvci1saWtlIG9iamVjdCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSBhcyBwZW9wbGUgbWF5IGNhbGxcbiAgICogUHJvcFR5cGVzIGRpcmVjdGx5IGFuZCBpbnNwZWN0IHRoZWlyIG91dHB1dC4gSG93ZXZlciwgd2UgZG9uJ3QgdXNlIHJlYWxcbiAgICogRXJyb3JzIGFueW1vcmUuIFdlIGRvbid0IGluc3BlY3QgdGhlaXIgc3RhY2sgYW55d2F5LCBhbmQgY3JlYXRpbmcgdGhlbVxuICAgKiBpcyBwcm9oaWJpdGl2ZWx5IGV4cGVuc2l2ZSBpZiB0aGV5IGFyZSBjcmVhdGVkIHRvbyBvZnRlbiwgc3VjaCBhcyB3aGF0XG4gICAqIGhhcHBlbnMgaW4gb25lT2ZUeXBlKCkgZm9yIGFueSB0eXBlIGJlZm9yZSB0aGUgb25lIHRoYXQgbWF0Y2hlZC5cbiAgICovXG4gIGZ1bmN0aW9uIFByb3BUeXBlRXJyb3IobWVzc2FnZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdGhpcy5zdGFjayA9ICcnO1xuICB9XG4gIC8vIE1ha2UgYGluc3RhbmNlb2YgRXJyb3JgIHN0aWxsIHdvcmsgZm9yIHJldHVybmVkIGVycm9ycy5cbiAgUHJvcFR5cGVFcnJvci5wcm90b3R5cGUgPSBFcnJvci5wcm90b3R5cGU7XG5cbiAgZnVuY3Rpb24gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdmFyIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlID0ge307XG4gICAgICB2YXIgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQgPSAwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjaGVja1R5cGUoaXNSZXF1aXJlZCwgcHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICAgIGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnROYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgIHByb3BGdWxsTmFtZSA9IHByb3BGdWxsTmFtZSB8fCBwcm9wTmFtZTtcblxuICAgICAgaWYgKHNlY3JldCAhPT0gUmVhY3RQcm9wVHlwZXNTZWNyZXQpIHtcbiAgICAgICAgaWYgKHRocm93T25EaXJlY3RBY2Nlc3MpIHtcbiAgICAgICAgICAvLyBOZXcgYmVoYXZpb3Igb25seSBmb3IgdXNlcnMgb2YgYHByb3AtdHlwZXNgIHBhY2thZ2VcbiAgICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKFxuICAgICAgICAgICAgJ0NhbGxpbmcgUHJvcFR5cGVzIHZhbGlkYXRvcnMgZGlyZWN0bHkgaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgICAgICAgJ1VzZSBgUHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzKClgIHRvIGNhbGwgdGhlbS4gJyArXG4gICAgICAgICAgICAnUmVhZCBtb3JlIGF0IGh0dHA6Ly9mYi5tZS91c2UtY2hlY2stcHJvcC10eXBlcydcbiAgICAgICAgICApO1xuICAgICAgICAgIGVyci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIC8vIE9sZCBiZWhhdmlvciBmb3IgcGVvcGxlIHVzaW5nIFJlYWN0LlByb3BUeXBlc1xuICAgICAgICAgIHZhciBjYWNoZUtleSA9IGNvbXBvbmVudE5hbWUgKyAnOicgKyBwcm9wTmFtZTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAhbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGVbY2FjaGVLZXldICYmXG4gICAgICAgICAgICAvLyBBdm9pZCBzcGFtbWluZyB0aGUgY29uc29sZSBiZWNhdXNlIHRoZXkgYXJlIG9mdGVuIG5vdCBhY3Rpb25hYmxlIGV4Y2VwdCBmb3IgbGliIGF1dGhvcnNcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlV2FybmluZ0NvdW50IDwgM1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgICAnWW91IGFyZSBtYW51YWxseSBjYWxsaW5nIGEgUmVhY3QuUHJvcFR5cGVzIHZhbGlkYXRpb24gJyArXG4gICAgICAgICAgICAgICdmdW5jdGlvbiBmb3IgdGhlIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2AgcHJvcCBvbiBgJyArIGNvbXBvbmVudE5hbWUgICsgJ2AuIFRoaXMgaXMgZGVwcmVjYXRlZCAnICtcbiAgICAgICAgICAgICAgJ2FuZCB3aWxsIHRocm93IGluIHRoZSBzdGFuZGFsb25lIGBwcm9wLXR5cGVzYCBwYWNrYWdlLiAnICtcbiAgICAgICAgICAgICAgJ1lvdSBtYXkgYmUgc2VlaW5nIHRoaXMgd2FybmluZyBkdWUgdG8gYSB0aGlyZC1wYXJ0eSBQcm9wVHlwZXMgJyArXG4gICAgICAgICAgICAgICdsaWJyYXJ5LiBTZWUgaHR0cHM6Ly9mYi5tZS9yZWFjdC13YXJuaW5nLWRvbnQtY2FsbC1wcm9wdHlwZXMgJyArICdmb3IgZGV0YWlscy4nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGVbY2FjaGVLZXldID0gdHJ1ZTtcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlV2FybmluZ0NvdW50Kys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09IG51bGwpIHtcbiAgICAgICAgaWYgKGlzUmVxdWlyZWQpIHtcbiAgICAgICAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1RoZSAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2AgaXMgbWFya2VkIGFzIHJlcXVpcmVkICcgKyAoJ2luIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBidXQgaXRzIHZhbHVlIGlzIGBudWxsYC4nKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignVGhlICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBpcyBtYXJrZWQgYXMgcmVxdWlyZWQgaW4gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGJ1dCBpdHMgdmFsdWUgaXMgYHVuZGVmaW5lZGAuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGNoYWluZWRDaGVja1R5cGUgPSBjaGVja1R5cGUuYmluZChudWxsLCBmYWxzZSk7XG4gICAgY2hhaW5lZENoZWNrVHlwZS5pc1JlcXVpcmVkID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgdHJ1ZSk7XG5cbiAgICByZXR1cm4gY2hhaW5lZENoZWNrVHlwZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKGV4cGVjdGVkVHlwZSkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgc2VjcmV0KSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gZXhwZWN0ZWRUeXBlKSB7XG4gICAgICAgIC8vIGBwcm9wVmFsdWVgIGJlaW5nIGluc3RhbmNlIG9mLCBzYXksIGRhdGUvcmVnZXhwLCBwYXNzIHRoZSAnb2JqZWN0J1xuICAgICAgICAvLyBjaGVjaywgYnV0IHdlIGNhbiBvZmZlciBhIG1vcmUgcHJlY2lzZSBlcnJvciBtZXNzYWdlIGhlcmUgcmF0aGVyIHRoYW5cbiAgICAgICAgLy8gJ29mIHR5cGUgYG9iamVjdGAnLlxuICAgICAgICB2YXIgcHJlY2lzZVR5cGUgPSBnZXRQcmVjaXNlVHlwZShwcm9wVmFsdWUpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByZWNpc2VUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkICcpICsgKCdgJyArIGV4cGVjdGVkVHlwZSArICdgLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQW55VHlwZUNoZWNrZXIoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGwpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQXJyYXlPZlR5cGVDaGVja2VyKHR5cGVDaGVja2VyKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHR5cGVDaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignUHJvcGVydHkgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiBjb21wb25lbnQgYCcgKyBjb21wb25lbnROYW1lICsgJ2AgaGFzIGludmFsaWQgUHJvcFR5cGUgbm90YXRpb24gaW5zaWRlIGFycmF5T2YuJyk7XG4gICAgICB9XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYW4gYXJyYXkuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wVmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGVycm9yID0gdHlwZUNoZWNrZXIocHJvcFZhbHVlLCBpLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJ1snICsgaSArICddJywgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIoKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgaWYgKCFpc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgc2luZ2xlIFJlYWN0RWxlbWVudC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIoZXhwZWN0ZWRDbGFzcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKCEocHJvcHNbcHJvcE5hbWVdIGluc3RhbmNlb2YgZXhwZWN0ZWRDbGFzcykpIHtcbiAgICAgICAgdmFyIGV4cGVjdGVkQ2xhc3NOYW1lID0gZXhwZWN0ZWRDbGFzcy5uYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgICAgdmFyIGFjdHVhbENsYXNzTmFtZSA9IGdldENsYXNzTmFtZShwcm9wc1twcm9wTmFtZV0pO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBhY3R1YWxDbGFzc05hbWUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2luc3RhbmNlIG9mIGAnICsgZXhwZWN0ZWRDbGFzc05hbWUgKyAnYC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUVudW1UeXBlQ2hlY2tlcihleHBlY3RlZFZhbHVlcykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShleHBlY3RlZFZhbHVlcykpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBwcmludFdhcm5pbmcoJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2YsIGV4cGVjdGVkIGFuIGluc3RhbmNlIG9mIGFycmF5LicpIDogdm9pZCAwO1xuICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBleHBlY3RlZFZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaXMocHJvcFZhbHVlLCBleHBlY3RlZFZhbHVlc1tpXSkpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgdmFsdWVzU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZXhwZWN0ZWRWYWx1ZXMpO1xuICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB2YWx1ZSBgJyArIHByb3BWYWx1ZSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBvbmUgb2YgJyArIHZhbHVlc1N0cmluZyArICcuJykpO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlT2JqZWN0T2ZUeXBlQ2hlY2tlcih0eXBlQ2hlY2tlcikge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiB0eXBlQ2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1Byb3BlcnR5IGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgY29tcG9uZW50IGAnICsgY29tcG9uZW50TmFtZSArICdgIGhhcyBpbnZhbGlkIFByb3BUeXBlIG5vdGF0aW9uIGluc2lkZSBvYmplY3RPZi4nKTtcbiAgICAgIH1cbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBvYmplY3QuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIga2V5IGluIHByb3BWYWx1ZSkge1xuICAgICAgICBpZiAocHJvcFZhbHVlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIoYXJyYXlPZlR5cGVDaGVja2Vycykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhcnJheU9mVHlwZUNoZWNrZXJzKSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHByaW50V2FybmluZygnSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZlR5cGUsIGV4cGVjdGVkIGFuIGluc3RhbmNlIG9mIGFycmF5LicpIDogdm9pZCAwO1xuICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGw7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheU9mVHlwZUNoZWNrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hlY2tlciA9IGFycmF5T2ZUeXBlQ2hlY2tlcnNbaV07XG4gICAgICBpZiAodHlwZW9mIGNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mVHlwZS4gRXhwZWN0ZWQgYW4gYXJyYXkgb2YgY2hlY2sgZnVuY3Rpb25zLCBidXQgJyArXG4gICAgICAgICAgJ3JlY2VpdmVkICcgKyBnZXRQb3N0Zml4Rm9yVHlwZVdhcm5pbmcoY2hlY2tlcikgKyAnIGF0IGluZGV4ICcgKyBpICsgJy4nXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uVGhhdFJldHVybnNOdWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheU9mVHlwZUNoZWNrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGVja2VyID0gYXJyYXlPZlR5cGVDaGVja2Vyc1tpXTtcbiAgICAgICAgaWYgKGNoZWNrZXIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBSZWFjdFByb3BUeXBlc1NlY3JldCkgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AuJykpO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlTm9kZUNoZWNrZXIoKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAoIWlzTm9kZShwcm9wc1twcm9wTmFtZV0pKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgUmVhY3ROb2RlLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlU2hhcGVUeXBlQ2hlY2tlcihzaGFwZVR5cGVzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlIGAnICsgcHJvcFR5cGUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYG9iamVjdGAuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIga2V5IGluIHNoYXBlVHlwZXMpIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBzaGFwZVR5cGVzW2tleV07XG4gICAgICAgIGlmICghY2hlY2tlcikge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVN0cmljdFNoYXBlVHlwZUNoZWNrZXIoc2hhcGVUeXBlcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSBgJyArIHByb3BUeXBlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGBvYmplY3RgLicpKTtcbiAgICAgIH1cbiAgICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgYWxsIGtleXMgaW4gY2FzZSBzb21lIGFyZSByZXF1aXJlZCBidXQgbWlzc2luZyBmcm9tXG4gICAgICAvLyBwcm9wcy5cbiAgICAgIHZhciBhbGxLZXlzID0gYXNzaWduKHt9LCBwcm9wc1twcm9wTmFtZV0sIHNoYXBlVHlwZXMpO1xuICAgICAgZm9yICh2YXIga2V5IGluIGFsbEtleXMpIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBzaGFwZVR5cGVzW2tleV07XG4gICAgICAgIGlmICghY2hlY2tlcikge1xuICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcihcbiAgICAgICAgICAgICdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBrZXkgYCcgKyBrZXkgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYC4nICtcbiAgICAgICAgICAgICdcXG5CYWQgb2JqZWN0OiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcHNbcHJvcE5hbWVdLCBudWxsLCAnICAnKSArXG4gICAgICAgICAgICAnXFxuVmFsaWQga2V5czogJyArICBKU09OLnN0cmluZ2lmeShPYmplY3Qua2V5cyhzaGFwZVR5cGVzKSwgbnVsbCwgJyAgJylcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNOb2RlKHByb3BWYWx1ZSkge1xuICAgIHN3aXRjaCAodHlwZW9mIHByb3BWYWx1ZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICByZXR1cm4gIXByb3BWYWx1ZTtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcFZhbHVlLmV2ZXJ5KGlzTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3BWYWx1ZSA9PT0gbnVsbCB8fCBpc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4ocHJvcFZhbHVlKTtcbiAgICAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwocHJvcFZhbHVlKTtcbiAgICAgICAgICB2YXIgc3RlcDtcbiAgICAgICAgICBpZiAoaXRlcmF0b3JGbiAhPT0gcHJvcFZhbHVlLmVudHJpZXMpIHtcbiAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgaWYgKCFpc05vZGUoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSXRlcmF0b3Igd2lsbCBwcm92aWRlIGVudHJ5IFtrLHZdIHR1cGxlcyByYXRoZXIgdGhhbiB2YWx1ZXMuXG4gICAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgICAgIGlmICghaXNOb2RlKGVudHJ5WzFdKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSB7XG4gICAgLy8gTmF0aXZlIFN5bWJvbC5cbiAgICBpZiAocHJvcFR5cGUgPT09ICdzeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddID09PSAnU3ltYm9sJ1xuICAgIGlmIChwcm9wVmFsdWVbJ0BAdG9TdHJpbmdUYWcnXSA9PT0gJ1N5bWJvbCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIEZhbGxiYWNrIGZvciBub24tc3BlYyBjb21wbGlhbnQgU3ltYm9scyB3aGljaCBhcmUgcG9seWZpbGxlZC5cbiAgICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBwcm9wVmFsdWUgaW5zdGFuY2VvZiBTeW1ib2wpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIEVxdWl2YWxlbnQgb2YgYHR5cGVvZmAgYnV0IHdpdGggc3BlY2lhbCBoYW5kbGluZyBmb3IgYXJyYXkgYW5kIHJlZ2V4cC5cbiAgZnVuY3Rpb24gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKSB7XG4gICAgdmFyIHByb3BUeXBlID0gdHlwZW9mIHByb3BWYWx1ZTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ2FycmF5JztcbiAgICB9XG4gICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgLy8gT2xkIHdlYmtpdHMgKGF0IGxlYXN0IHVudGlsIEFuZHJvaWQgNC4wKSByZXR1cm4gJ2Z1bmN0aW9uJyByYXRoZXIgdGhhblxuICAgICAgLy8gJ29iamVjdCcgZm9yIHR5cGVvZiBhIFJlZ0V4cC4gV2UnbGwgbm9ybWFsaXplIHRoaXMgaGVyZSBzbyB0aGF0IC9ibGEvXG4gICAgICAvLyBwYXNzZXMgUHJvcFR5cGVzLm9iamVjdC5cbiAgICAgIHJldHVybiAnb2JqZWN0JztcbiAgICB9XG4gICAgaWYgKGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ3N5bWJvbCc7XG4gICAgfVxuICAgIHJldHVybiBwcm9wVHlwZTtcbiAgfVxuXG4gIC8vIFRoaXMgaGFuZGxlcyBtb3JlIHR5cGVzIHRoYW4gYGdldFByb3BUeXBlYC4gT25seSB1c2VkIGZvciBlcnJvciBtZXNzYWdlcy5cbiAgLy8gU2VlIGBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcmAuXG4gIGZ1bmN0aW9uIGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSkge1xuICAgIGlmICh0eXBlb2YgcHJvcFZhbHVlID09PSAndW5kZWZpbmVkJyB8fCBwcm9wVmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiAnJyArIHByb3BWYWx1ZTtcbiAgICB9XG4gICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICBpZiAocHJvcFR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICByZXR1cm4gJ2RhdGUnO1xuICAgICAgfSBlbHNlIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgcmV0dXJuICdyZWdleHAnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcHJvcFR5cGU7XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgcG9zdGZpeGVkIHRvIGEgd2FybmluZyBhYm91dCBhbiBpbnZhbGlkIHR5cGUuXG4gIC8vIEZvciBleGFtcGxlLCBcInVuZGVmaW5lZFwiIG9yIFwib2YgdHlwZSBhcnJheVwiXG4gIGZ1bmN0aW9uIGdldFBvc3RmaXhGb3JUeXBlV2FybmluZyh2YWx1ZSkge1xuICAgIHZhciB0eXBlID0gZ2V0UHJlY2lzZVR5cGUodmFsdWUpO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgcmV0dXJuICdhbiAnICsgdHlwZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICBjYXNlICdyZWdleHAnOlxuICAgICAgICByZXR1cm4gJ2EgJyArIHR5cGU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdHlwZTtcbiAgICB9XG4gIH1cblxuICAvLyBSZXR1cm5zIGNsYXNzIG5hbWUgb2YgdGhlIG9iamVjdCwgaWYgYW55LlxuICBmdW5jdGlvbiBnZXRDbGFzc05hbWUocHJvcFZhbHVlKSB7XG4gICAgaWYgKCFwcm9wVmFsdWUuY29uc3RydWN0b3IgfHwgIXByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lKSB7XG4gICAgICByZXR1cm4gQU5PTllNT1VTO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcFZhbHVlLmNvbnN0cnVjdG9yLm5hbWU7XG4gIH1cblxuICBSZWFjdFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcyA9IGNoZWNrUHJvcFR5cGVzO1xuICBSZWFjdFByb3BUeXBlcy5Qcm9wVHlwZXMgPSBSZWFjdFByb3BUeXBlcztcblxuICByZXR1cm4gUmVhY3RQcm9wVHlwZXM7XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiZcbiAgICBTeW1ib2wuZm9yICYmXG4gICAgU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpKSB8fFxuICAgIDB4ZWFjNztcblxuICB2YXIgaXNWYWxpZEVsZW1lbnQgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgIG9iamVjdCAhPT0gbnVsbCAmJlxuICAgICAgb2JqZWN0LiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEU7XG4gIH07XG5cbiAgLy8gQnkgZXhwbGljaXRseSB1c2luZyBgcHJvcC10eXBlc2AgeW91IGFyZSBvcHRpbmcgaW50byBuZXcgZGV2ZWxvcG1lbnQgYmVoYXZpb3IuXG4gIC8vIGh0dHA6Ly9mYi5tZS9wcm9wLXR5cGVzLWluLXByb2RcbiAgdmFyIHRocm93T25EaXJlY3RBY2Nlc3MgPSB0cnVlO1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZmFjdG9yeVdpdGhUeXBlQ2hlY2tlcnMnKShpc1ZhbGlkRWxlbWVudCwgdGhyb3dPbkRpcmVjdEFjY2Vzcyk7XG59IGVsc2Uge1xuICAvLyBCeSBleHBsaWNpdGx5IHVzaW5nIGBwcm9wLXR5cGVzYCB5b3UgYXJlIG9wdGluZyBpbnRvIG5ldyBwcm9kdWN0aW9uIGJlaGF2aW9yLlxuICAvLyBodHRwOi8vZmIubWUvcHJvcC10eXBlcy1pbi1wcm9kXG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9mYWN0b3J5V2l0aFRocm93aW5nU2hpbXMnKSgpO1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9ICdTRUNSRVRfRE9fTk9UX1BBU1NfVEhJU19PUl9ZT1VfV0lMTF9CRV9GSVJFRCc7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RQcm9wVHlwZXNTZWNyZXQ7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9XG4gICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5mb3IgJiYgU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpKSB8fFxuICAweGVhYzc7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnZmJqcy9saWIvZW1wdHlGdW5jdGlvbicpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG5cbnZhciBTRVBBUkFUT1IgPSAnLic7XG52YXIgU1VCU0VQQVJBVE9SID0gJzonO1xuXG52YXIgZGlkV2FybkFib3V0TWFwcyA9IGZhbHNlO1xuXG52YXIgSVRFUkFUT1JfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuaXRlcmF0b3I7XG52YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSAnQEBpdGVyYXRvcic7IC8vIEJlZm9yZSBTeW1ib2wgc3BlYy5cblxuZnVuY3Rpb24gZ2V0SXRlcmF0b3JGbihtYXliZUl0ZXJhYmxlKSB7XG4gIHZhciBpdGVyYXRvckZuID1cbiAgICBtYXliZUl0ZXJhYmxlICYmXG4gICAgKChJVEVSQVRPUl9TWU1CT0wgJiYgbWF5YmVJdGVyYWJsZVtJVEVSQVRPUl9TWU1CT0xdKSB8fFxuICAgICAgbWF5YmVJdGVyYWJsZVtGQVVYX0lURVJBVE9SX1NZTUJPTF0pO1xuICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gaXRlcmF0b3JGbjtcbiAgfVxufVxuXG5mdW5jdGlvbiBlc2NhcGUoa2V5KSB7XG4gIHZhciBlc2NhcGVSZWdleCA9IC9bPTpdL2c7XG4gIHZhciBlc2NhcGVyTG9va3VwID0ge1xuICAgICc9JzogJz0wJyxcbiAgICAnOic6ICc9MidcbiAgfTtcbiAgdmFyIGVzY2FwZWRTdHJpbmcgPSAoJycgKyBrZXkpLnJlcGxhY2UoZXNjYXBlUmVnZXgsIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgcmV0dXJuIGVzY2FwZXJMb29rdXBbbWF0Y2hdO1xuICB9KTtcblxuICByZXR1cm4gJyQnICsgZXNjYXBlZFN0cmluZztcbn1cblxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50S2V5KGNvbXBvbmVudCwgaW5kZXgpIHtcbiAgLy8gRG8gc29tZSB0eXBlY2hlY2tpbmcgaGVyZSBzaW5jZSB3ZSBjYWxsIHRoaXMgYmxpbmRseS4gV2Ugd2FudCB0byBlbnN1cmVcbiAgLy8gdGhhdCB3ZSBkb24ndCBibG9jayBwb3RlbnRpYWwgZnV0dXJlIEVTIEFQSXMuXG4gIGlmIChjb21wb25lbnQgJiYgdHlwZW9mIGNvbXBvbmVudCA9PT0gJ29iamVjdCcgJiYgY29tcG9uZW50LmtleSAhPSBudWxsKSB7XG4gICAgLy8gRXhwbGljaXQga2V5XG4gICAgcmV0dXJuIGVzY2FwZShjb21wb25lbnQua2V5KTtcbiAgfVxuICAvLyBJbXBsaWNpdCBrZXkgZGV0ZXJtaW5lZCBieSB0aGUgaW5kZXggaW4gdGhlIHNldFxuICByZXR1cm4gaW5kZXgudG9TdHJpbmcoMzYpO1xufVxuXG5mdW5jdGlvbiB0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbChcbiAgY2hpbGRyZW4sXG4gIG5hbWVTb0ZhcixcbiAgY2FsbGJhY2ssXG4gIHRyYXZlcnNlQ29udGV4dFxuKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIGNoaWxkcmVuO1xuXG4gIGlmICh0eXBlID09PSAndW5kZWZpbmVkJyB8fCB0eXBlID09PSAnYm9vbGVhbicpIHtcbiAgICAvLyBBbGwgb2YgdGhlIGFib3ZlIGFyZSBwZXJjZWl2ZWQgYXMgbnVsbC5cbiAgICBjaGlsZHJlbiA9IG51bGw7XG4gIH1cblxuICBpZiAoXG4gICAgY2hpbGRyZW4gPT09IG51bGwgfHxcbiAgICB0eXBlID09PSAnc3RyaW5nJyB8fFxuICAgIHR5cGUgPT09ICdudW1iZXInIHx8XG4gICAgLy8gVGhlIGZvbGxvd2luZyBpcyBpbmxpbmVkIGZyb20gUmVhY3RFbGVtZW50LiBUaGlzIG1lYW5zIHdlIGNhbiBvcHRpbWl6ZVxuICAgIC8vIHNvbWUgY2hlY2tzLiBSZWFjdCBGaWJlciBhbHNvIGlubGluZXMgdGhpcyBsb2dpYyBmb3Igc2ltaWxhciBwdXJwb3Nlcy5cbiAgICAodHlwZSA9PT0gJ29iamVjdCcgJiYgY2hpbGRyZW4uJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRSlcbiAgKSB7XG4gICAgY2FsbGJhY2soXG4gICAgICB0cmF2ZXJzZUNvbnRleHQsXG4gICAgICBjaGlsZHJlbixcbiAgICAgIC8vIElmIGl0J3MgdGhlIG9ubHkgY2hpbGQsIHRyZWF0IHRoZSBuYW1lIGFzIGlmIGl0IHdhcyB3cmFwcGVkIGluIGFuIGFycmF5XG4gICAgICAvLyBzbyB0aGF0IGl0J3MgY29uc2lzdGVudCBpZiB0aGUgbnVtYmVyIG9mIGNoaWxkcmVuIGdyb3dzLlxuICAgICAgbmFtZVNvRmFyID09PSAnJyA/IFNFUEFSQVRPUiArIGdldENvbXBvbmVudEtleShjaGlsZHJlbiwgMCkgOiBuYW1lU29GYXJcbiAgICApO1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgdmFyIGNoaWxkO1xuICB2YXIgbmV4dE5hbWU7XG4gIHZhciBzdWJ0cmVlQ291bnQgPSAwOyAvLyBDb3VudCBvZiBjaGlsZHJlbiBmb3VuZCBpbiB0aGUgY3VycmVudCBzdWJ0cmVlLlxuICB2YXIgbmV4dE5hbWVQcmVmaXggPSBuYW1lU29GYXIgPT09ICcnID8gU0VQQVJBVE9SIDogbmFtZVNvRmFyICsgU1VCU0VQQVJBVE9SO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICBuZXh0TmFtZSA9IG5leHROYW1lUHJlZml4ICsgZ2V0Q29tcG9uZW50S2V5KGNoaWxkLCBpKTtcbiAgICAgIHN1YnRyZWVDb3VudCArPSB0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbChcbiAgICAgICAgY2hpbGQsXG4gICAgICAgIG5leHROYW1lLFxuICAgICAgICBjYWxsYmFjayxcbiAgICAgICAgdHJhdmVyc2VDb250ZXh0XG4gICAgICApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4oY2hpbGRyZW4pO1xuICAgIGlmIChpdGVyYXRvckZuKSB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAvLyBXYXJuIGFib3V0IHVzaW5nIE1hcHMgYXMgY2hpbGRyZW5cbiAgICAgICAgaWYgKGl0ZXJhdG9yRm4gPT09IGNoaWxkcmVuLmVudHJpZXMpIHtcbiAgICAgICAgICB3YXJuaW5nKFxuICAgICAgICAgICAgZGlkV2FybkFib3V0TWFwcyxcbiAgICAgICAgICAgICdVc2luZyBNYXBzIGFzIGNoaWxkcmVuIGlzIHVuc3VwcG9ydGVkIGFuZCB3aWxsIGxpa2VseSB5aWVsZCAnICtcbiAgICAgICAgICAgICAgJ3VuZXhwZWN0ZWQgcmVzdWx0cy4gQ29udmVydCBpdCB0byBhIHNlcXVlbmNlL2l0ZXJhYmxlIG9mIGtleWVkICcgK1xuICAgICAgICAgICAgICAnUmVhY3RFbGVtZW50cyBpbnN0ZWFkLidcbiAgICAgICAgICApO1xuICAgICAgICAgIGRpZFdhcm5BYm91dE1hcHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChjaGlsZHJlbik7XG4gICAgICB2YXIgc3RlcDtcbiAgICAgIHZhciBpaSA9IDA7XG4gICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgIGNoaWxkID0gc3RlcC52YWx1ZTtcbiAgICAgICAgbmV4dE5hbWUgPSBuZXh0TmFtZVByZWZpeCArIGdldENvbXBvbmVudEtleShjaGlsZCwgaWkrKyk7XG4gICAgICAgIHN1YnRyZWVDb3VudCArPSB0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbChcbiAgICAgICAgICBjaGlsZCxcbiAgICAgICAgICBuZXh0TmFtZSxcbiAgICAgICAgICBjYWxsYmFjayxcbiAgICAgICAgICB0cmF2ZXJzZUNvbnRleHRcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICB2YXIgYWRkZW5kdW0gPSAnJztcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIGFkZGVuZHVtID1cbiAgICAgICAgICAnIElmIHlvdSBtZWFudCB0byByZW5kZXIgYSBjb2xsZWN0aW9uIG9mIGNoaWxkcmVuLCB1c2UgYW4gYXJyYXkgJyArXG4gICAgICAgICAgJ2luc3RlYWQgb3Igd3JhcCB0aGUgb2JqZWN0IHVzaW5nIGNyZWF0ZUZyYWdtZW50KG9iamVjdCkgZnJvbSB0aGUgJyArXG4gICAgICAgICAgJ1JlYWN0IGFkZC1vbnMuJztcbiAgICAgIH1cbiAgICAgIHZhciBjaGlsZHJlblN0cmluZyA9ICcnICsgY2hpbGRyZW47XG4gICAgICBpbnZhcmlhbnQoXG4gICAgICAgIGZhbHNlLFxuICAgICAgICAnT2JqZWN0cyBhcmUgbm90IHZhbGlkIGFzIGEgUmVhY3QgY2hpbGQgKGZvdW5kOiAlcykuJXMnLFxuICAgICAgICBjaGlsZHJlblN0cmluZyA9PT0gJ1tvYmplY3QgT2JqZWN0XSdcbiAgICAgICAgICA/ICdvYmplY3Qgd2l0aCBrZXlzIHsnICsgT2JqZWN0LmtleXMoY2hpbGRyZW4pLmpvaW4oJywgJykgKyAnfSdcbiAgICAgICAgICA6IGNoaWxkcmVuU3RyaW5nLFxuICAgICAgICBhZGRlbmR1bVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3VidHJlZUNvdW50O1xufVxuXG5mdW5jdGlvbiB0cmF2ZXJzZUFsbENoaWxkcmVuKGNoaWxkcmVuLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KSB7XG4gIGlmIChjaGlsZHJlbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoY2hpbGRyZW4sICcnLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KTtcbn1cblxudmFyIHVzZXJQcm92aWRlZEtleUVzY2FwZVJlZ2V4ID0gL1xcLysvZztcbmZ1bmN0aW9uIGVzY2FwZVVzZXJQcm92aWRlZEtleSh0ZXh0KSB7XG4gIHJldHVybiAoJycgKyB0ZXh0KS5yZXBsYWNlKHVzZXJQcm92aWRlZEtleUVzY2FwZVJlZ2V4LCAnJCYvJyk7XG59XG5cbmZ1bmN0aW9uIGNsb25lQW5kUmVwbGFjZUtleShvbGRFbGVtZW50LCBuZXdLZXkpIHtcbiAgcmV0dXJuIFJlYWN0LmNsb25lRWxlbWVudChcbiAgICBvbGRFbGVtZW50LFxuICAgIHtrZXk6IG5ld0tleX0sXG4gICAgb2xkRWxlbWVudC5wcm9wcyAhPT0gdW5kZWZpbmVkID8gb2xkRWxlbWVudC5wcm9wcy5jaGlsZHJlbiA6IHVuZGVmaW5lZFxuICApO1xufVxuXG52YXIgREVGQVVMVF9QT09MX1NJWkUgPSAxMDtcbnZhciBERUZBVUxUX1BPT0xFUiA9IG9uZUFyZ3VtZW50UG9vbGVyO1xuXG52YXIgb25lQXJndW1lbnRQb29sZXIgPSBmdW5jdGlvbihjb3B5RmllbGRzRnJvbSkge1xuICB2YXIgS2xhc3MgPSB0aGlzO1xuICBpZiAoS2xhc3MuaW5zdGFuY2VQb29sLmxlbmd0aCkge1xuICAgIHZhciBpbnN0YW5jZSA9IEtsYXNzLmluc3RhbmNlUG9vbC5wb3AoKTtcbiAgICBLbGFzcy5jYWxsKGluc3RhbmNlLCBjb3B5RmllbGRzRnJvbSk7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgS2xhc3MoY29weUZpZWxkc0Zyb20pO1xuICB9XG59O1xuXG52YXIgYWRkUG9vbGluZ1RvID0gZnVuY3Rpb24gYWRkUG9vbGluZ1RvKENvcHlDb25zdHJ1Y3RvciwgcG9vbGVyKSB7XG4gIC8vIENhc3RpbmcgYXMgYW55IHNvIHRoYXQgZmxvdyBpZ25vcmVzIHRoZSBhY3R1YWwgaW1wbGVtZW50YXRpb24gYW5kIHRydXN0c1xuICAvLyBpdCB0byBtYXRjaCB0aGUgdHlwZSB3ZSBkZWNsYXJlZFxuICB2YXIgTmV3S2xhc3MgPSBDb3B5Q29uc3RydWN0b3I7XG4gIE5ld0tsYXNzLmluc3RhbmNlUG9vbCA9IFtdO1xuICBOZXdLbGFzcy5nZXRQb29sZWQgPSBwb29sZXIgfHwgREVGQVVMVF9QT09MRVI7XG4gIGlmICghTmV3S2xhc3MucG9vbFNpemUpIHtcbiAgICBOZXdLbGFzcy5wb29sU2l6ZSA9IERFRkFVTFRfUE9PTF9TSVpFO1xuICB9XG4gIE5ld0tsYXNzLnJlbGVhc2UgPSBzdGFuZGFyZFJlbGVhc2VyO1xuICByZXR1cm4gTmV3S2xhc3M7XG59O1xuXG52YXIgc3RhbmRhcmRSZWxlYXNlciA9IGZ1bmN0aW9uIHN0YW5kYXJkUmVsZWFzZXIoaW5zdGFuY2UpIHtcbiAgdmFyIEtsYXNzID0gdGhpcztcbiAgaW52YXJpYW50KFxuICAgIGluc3RhbmNlIGluc3RhbmNlb2YgS2xhc3MsXG4gICAgJ1RyeWluZyB0byByZWxlYXNlIGFuIGluc3RhbmNlIGludG8gYSBwb29sIG9mIGEgZGlmZmVyZW50IHR5cGUuJ1xuICApO1xuICBpbnN0YW5jZS5kZXN0cnVjdG9yKCk7XG4gIGlmIChLbGFzcy5pbnN0YW5jZVBvb2wubGVuZ3RoIDwgS2xhc3MucG9vbFNpemUpIHtcbiAgICBLbGFzcy5pbnN0YW5jZVBvb2wucHVzaChpbnN0YW5jZSk7XG4gIH1cbn07XG5cbnZhciBmb3VyQXJndW1lbnRQb29sZXIgPSBmdW5jdGlvbiBmb3VyQXJndW1lbnRQb29sZXIoYTEsIGEyLCBhMywgYTQpIHtcbiAgdmFyIEtsYXNzID0gdGhpcztcbiAgaWYgKEtsYXNzLmluc3RhbmNlUG9vbC5sZW5ndGgpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBLbGFzcy5pbnN0YW5jZVBvb2wucG9wKCk7XG4gICAgS2xhc3MuY2FsbChpbnN0YW5jZSwgYTEsIGEyLCBhMywgYTQpO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IEtsYXNzKGExLCBhMiwgYTMsIGE0KTtcbiAgfVxufTtcblxuZnVuY3Rpb24gTWFwQm9va0tlZXBpbmcobWFwUmVzdWx0LCBrZXlQcmVmaXgsIG1hcEZ1bmN0aW9uLCBtYXBDb250ZXh0KSB7XG4gIHRoaXMucmVzdWx0ID0gbWFwUmVzdWx0O1xuICB0aGlzLmtleVByZWZpeCA9IGtleVByZWZpeDtcbiAgdGhpcy5mdW5jID0gbWFwRnVuY3Rpb247XG4gIHRoaXMuY29udGV4dCA9IG1hcENvbnRleHQ7XG4gIHRoaXMuY291bnQgPSAwO1xufVxuTWFwQm9va0tlZXBpbmcucHJvdG90eXBlLmRlc3RydWN0b3IgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5yZXN1bHQgPSBudWxsO1xuICB0aGlzLmtleVByZWZpeCA9IG51bGw7XG4gIHRoaXMuZnVuYyA9IG51bGw7XG4gIHRoaXMuY29udGV4dCA9IG51bGw7XG4gIHRoaXMuY291bnQgPSAwO1xufTtcbmFkZFBvb2xpbmdUbyhNYXBCb29rS2VlcGluZywgZm91ckFyZ3VtZW50UG9vbGVyKTtcblxuZnVuY3Rpb24gbWFwU2luZ2xlQ2hpbGRJbnRvQ29udGV4dChib29rS2VlcGluZywgY2hpbGQsIGNoaWxkS2V5KSB7XG4gIHZhciByZXN1bHQgPSBib29rS2VlcGluZy5yZXN1bHQ7XG4gIHZhciBrZXlQcmVmaXggPSBib29rS2VlcGluZy5rZXlQcmVmaXg7XG4gIHZhciBmdW5jID0gYm9va0tlZXBpbmcuZnVuYztcbiAgdmFyIGNvbnRleHQgPSBib29rS2VlcGluZy5jb250ZXh0O1xuXG4gIHZhciBtYXBwZWRDaGlsZCA9IGZ1bmMuY2FsbChjb250ZXh0LCBjaGlsZCwgYm9va0tlZXBpbmcuY291bnQrKyk7XG4gIGlmIChBcnJheS5pc0FycmF5KG1hcHBlZENoaWxkKSkge1xuICAgIG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWwoXG4gICAgICBtYXBwZWRDaGlsZCxcbiAgICAgIHJlc3VsdCxcbiAgICAgIGNoaWxkS2V5LFxuICAgICAgZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc0FyZ3VtZW50XG4gICAgKTtcbiAgfSBlbHNlIGlmIChtYXBwZWRDaGlsZCAhPSBudWxsKSB7XG4gICAgaWYgKFJlYWN0LmlzVmFsaWRFbGVtZW50KG1hcHBlZENoaWxkKSkge1xuICAgICAgbWFwcGVkQ2hpbGQgPSBjbG9uZUFuZFJlcGxhY2VLZXkoXG4gICAgICAgIG1hcHBlZENoaWxkLFxuICAgICAgICAvLyBLZWVwIGJvdGggdGhlIChtYXBwZWQpIGFuZCBvbGQga2V5cyBpZiB0aGV5IGRpZmZlciwganVzdCBhc1xuICAgICAgICAvLyB0cmF2ZXJzZUFsbENoaWxkcmVuIHVzZWQgdG8gZG8gZm9yIG9iamVjdHMgYXMgY2hpbGRyZW5cbiAgICAgICAga2V5UHJlZml4ICtcbiAgICAgICAgICAobWFwcGVkQ2hpbGQua2V5ICYmICghY2hpbGQgfHwgY2hpbGQua2V5ICE9PSBtYXBwZWRDaGlsZC5rZXkpXG4gICAgICAgICAgICA/IGVzY2FwZVVzZXJQcm92aWRlZEtleShtYXBwZWRDaGlsZC5rZXkpICsgJy8nXG4gICAgICAgICAgICA6ICcnKSArXG4gICAgICAgICAgY2hpbGRLZXlcbiAgICAgICk7XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKG1hcHBlZENoaWxkKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKGNoaWxkcmVuLCBhcnJheSwgcHJlZml4LCBmdW5jLCBjb250ZXh0KSB7XG4gIHZhciBlc2NhcGVkUHJlZml4ID0gJyc7XG4gIGlmIChwcmVmaXggIT0gbnVsbCkge1xuICAgIGVzY2FwZWRQcmVmaXggPSBlc2NhcGVVc2VyUHJvdmlkZWRLZXkocHJlZml4KSArICcvJztcbiAgfVxuICB2YXIgdHJhdmVyc2VDb250ZXh0ID0gTWFwQm9va0tlZXBpbmcuZ2V0UG9vbGVkKFxuICAgIGFycmF5LFxuICAgIGVzY2FwZWRQcmVmaXgsXG4gICAgZnVuYyxcbiAgICBjb250ZXh0XG4gICk7XG4gIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIG1hcFNpbmdsZUNoaWxkSW50b0NvbnRleHQsIHRyYXZlcnNlQ29udGV4dCk7XG4gIE1hcEJvb2tLZWVwaW5nLnJlbGVhc2UodHJhdmVyc2VDb250ZXh0KTtcbn1cblxudmFyIG51bWVyaWNQcm9wZXJ0eVJlZ2V4ID0gL15cXGQrJC87XG5cbnZhciB3YXJuZWRBYm91dE51bWVyaWMgPSBmYWxzZTtcblxuZnVuY3Rpb24gY3JlYXRlUmVhY3RGcmFnbWVudChvYmplY3QpIHtcbiAgaWYgKHR5cGVvZiBvYmplY3QgIT09ICdvYmplY3QnIHx8ICFvYmplY3QgfHwgQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XG4gICAgd2FybmluZyhcbiAgICAgIGZhbHNlLFxuICAgICAgJ1JlYWN0LmFkZG9ucy5jcmVhdGVGcmFnbWVudCBvbmx5IGFjY2VwdHMgYSBzaW5nbGUgb2JqZWN0LiBHb3Q6ICVzJyxcbiAgICAgIG9iamVjdFxuICAgICk7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuICBpZiAoUmVhY3QuaXNWYWxpZEVsZW1lbnQob2JqZWN0KSkge1xuICAgIHdhcm5pbmcoXG4gICAgICBmYWxzZSxcbiAgICAgICdSZWFjdC5hZGRvbnMuY3JlYXRlRnJhZ21lbnQgZG9lcyBub3QgYWNjZXB0IGEgUmVhY3RFbGVtZW50ICcgK1xuICAgICAgICAnd2l0aG91dCBhIHdyYXBwZXIgb2JqZWN0LidcbiAgICApO1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICBpbnZhcmlhbnQoXG4gICAgb2JqZWN0Lm5vZGVUeXBlICE9PSAxLFxuICAgICdSZWFjdC5hZGRvbnMuY3JlYXRlRnJhZ21lbnQoLi4uKTogRW5jb3VudGVyZWQgYW4gaW52YWxpZCBjaGlsZDsgRE9NICcgK1xuICAgICAgJ2VsZW1lbnRzIGFyZSBub3QgdmFsaWQgY2hpbGRyZW4gb2YgUmVhY3QgY29tcG9uZW50cy4nXG4gICk7XG5cbiAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgaWYgKCF3YXJuZWRBYm91dE51bWVyaWMgJiYgbnVtZXJpY1Byb3BlcnR5UmVnZXgudGVzdChrZXkpKSB7XG4gICAgICAgIHdhcm5pbmcoXG4gICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgJ1JlYWN0LmFkZG9ucy5jcmVhdGVGcmFnbWVudCguLi4pOiBDaGlsZCBvYmplY3RzIHNob3VsZCBoYXZlICcgK1xuICAgICAgICAgICAgJ25vbi1udW1lcmljIGtleXMgc28gb3JkZXJpbmcgaXMgcHJlc2VydmVkLidcbiAgICAgICAgKTtcbiAgICAgICAgd2FybmVkQWJvdXROdW1lcmljID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChcbiAgICAgIG9iamVjdFtrZXldLFxuICAgICAgcmVzdWx0LFxuICAgICAga2V5LFxuICAgICAgZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc0FyZ3VtZW50XG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlUmVhY3RGcmFnbWVudDtcbiIsIi8qKiBAbGljZW5zZSBSZWFjdCB2MTYuNy4wXG4gKiByZWFjdC5kZXZlbG9wbWVudC5qc1xuICpcbiAqIENvcHlyaWdodCAoYykgRmFjZWJvb2ssIEluYy4gYW5kIGl0cyBhZmZpbGlhdGVzLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuXG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgKGZ1bmN0aW9uKCkge1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2Fzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbnZhciBjaGVja1Byb3BUeXBlcyA9IHJlcXVpcmUoJ3Byb3AtdHlwZXMvY2hlY2tQcm9wVHlwZXMnKTtcblxuLy8gVE9ETzogdGhpcyBpcyBzcGVjaWFsIGJlY2F1c2UgaXQgZ2V0cyBpbXBvcnRlZCBkdXJpbmcgYnVpbGQuXG5cbnZhciBSZWFjdFZlcnNpb24gPSAnMTYuNy4wJztcblxuLy8gVGhlIFN5bWJvbCB1c2VkIHRvIHRhZyB0aGUgUmVhY3RFbGVtZW50LWxpa2UgdHlwZXMuIElmIHRoZXJlIGlzIG5vIG5hdGl2ZSBTeW1ib2xcbi8vIG5vciBwb2x5ZmlsbCwgdGhlbiBhIHBsYWluIG51bWJlciBpcyB1c2VkIGZvciBwZXJmb3JtYW5jZS5cbnZhciBoYXNTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5mb3I7XG5cbnZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykgOiAweGVhYzc7XG52YXIgUkVBQ1RfUE9SVEFMX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5wb3J0YWwnKSA6IDB4ZWFjYTtcbnZhciBSRUFDVF9GUkFHTUVOVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZnJhZ21lbnQnKSA6IDB4ZWFjYjtcbnZhciBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3Quc3RyaWN0X21vZGUnKSA6IDB4ZWFjYztcbnZhciBSRUFDVF9QUk9GSUxFUl9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QucHJvZmlsZXInKSA6IDB4ZWFkMjtcbnZhciBSRUFDVF9QUk9WSURFUl9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QucHJvdmlkZXInKSA6IDB4ZWFjZDtcbnZhciBSRUFDVF9DT05URVhUX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5jb250ZXh0JykgOiAweGVhY2U7XG5cbnZhciBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmNvbmN1cnJlbnRfbW9kZScpIDogMHhlYWNmO1xudmFyIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5mb3J3YXJkX3JlZicpIDogMHhlYWQwO1xudmFyIFJFQUNUX1NVU1BFTlNFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5zdXNwZW5zZScpIDogMHhlYWQxO1xudmFyIFJFQUNUX01FTU9fVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0Lm1lbW8nKSA6IDB4ZWFkMztcbnZhciBSRUFDVF9MQVpZX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5sYXp5JykgOiAweGVhZDQ7XG5cbnZhciBNQVlCRV9JVEVSQVRPUl9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5pdGVyYXRvcjtcbnZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9ICdAQGl0ZXJhdG9yJztcblxuZnVuY3Rpb24gZ2V0SXRlcmF0b3JGbihtYXliZUl0ZXJhYmxlKSB7XG4gIGlmIChtYXliZUl0ZXJhYmxlID09PSBudWxsIHx8IHR5cGVvZiBtYXliZUl0ZXJhYmxlICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZhciBtYXliZUl0ZXJhdG9yID0gTUFZQkVfSVRFUkFUT1JfU1lNQk9MICYmIG1heWJlSXRlcmFibGVbTUFZQkVfSVRFUkFUT1JfU1lNQk9MXSB8fCBtYXliZUl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXTtcbiAgaWYgKHR5cGVvZiBtYXliZUl0ZXJhdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIG1heWJlSXRlcmF0b3I7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbnZhciBlbmFibGVIb29rcyA9IGZhbHNlO1xuLy8gSGVscHMgaWRlbnRpZnkgc2lkZSBlZmZlY3RzIGluIGJlZ2luLXBoYXNlIGxpZmVjeWNsZSBob29rcyBhbmQgc2V0U3RhdGUgcmVkdWNlcnM6XG5cblxuLy8gSW4gc29tZSBjYXNlcywgU3RyaWN0TW9kZSBzaG91bGQgYWxzbyBkb3VibGUtcmVuZGVyIGxpZmVjeWNsZXMuXG4vLyBUaGlzIGNhbiBiZSBjb25mdXNpbmcgZm9yIHRlc3RzIHRob3VnaCxcbi8vIEFuZCBpdCBjYW4gYmUgYmFkIGZvciBwZXJmb3JtYW5jZSBpbiBwcm9kdWN0aW9uLlxuLy8gVGhpcyBmZWF0dXJlIGZsYWcgY2FuIGJlIHVzZWQgdG8gY29udHJvbCB0aGUgYmVoYXZpb3I6XG5cblxuLy8gVG8gcHJlc2VydmUgdGhlIFwiUGF1c2Ugb24gY2F1Z2h0IGV4Y2VwdGlvbnNcIiBiZWhhdmlvciBvZiB0aGUgZGVidWdnZXIsIHdlXG4vLyByZXBsYXkgdGhlIGJlZ2luIHBoYXNlIG9mIGEgZmFpbGVkIGNvbXBvbmVudCBpbnNpZGUgaW52b2tlR3VhcmRlZENhbGxiYWNrLlxuXG5cbi8vIFdhcm4gYWJvdXQgZGVwcmVjYXRlZCwgYXN5bmMtdW5zYWZlIGxpZmVjeWNsZXM7IHJlbGF0ZXMgdG8gUkZDICM2OlxuXG5cbi8vIEdhdGhlciBhZHZhbmNlZCB0aW1pbmcgbWV0cmljcyBmb3IgUHJvZmlsZXIgc3VidHJlZXMuXG5cblxuLy8gVHJhY2Ugd2hpY2ggaW50ZXJhY3Rpb25zIHRyaWdnZXIgZWFjaCBjb21taXQuXG5cblxuLy8gT25seSB1c2VkIGluIHd3dyBidWlsZHMuXG4gLy8gVE9ETzogdHJ1ZT8gSGVyZSBpdCBtaWdodCBqdXN0IGJlIGZhbHNlLlxuXG4vLyBPbmx5IHVzZWQgaW4gd3d3IGJ1aWxkcy5cblxuXG4vLyBPbmx5IHVzZWQgaW4gd3d3IGJ1aWxkcy5cblxuXG4vLyBSZWFjdCBGaXJlOiBwcmV2ZW50IHRoZSB2YWx1ZSBhbmQgY2hlY2tlZCBhdHRyaWJ1dGVzIGZyb20gc3luY2luZ1xuLy8gd2l0aCB0aGVpciByZWxhdGVkIERPTSBwcm9wZXJ0aWVzXG5cblxuLy8gVGhlc2UgQVBJcyB3aWxsIG5vIGxvbmdlciBiZSBcInVuc3RhYmxlXCIgaW4gdGhlIHVwY29taW5nIDE2LjcgcmVsZWFzZSxcbi8vIENvbnRyb2wgdGhpcyBiZWhhdmlvciB3aXRoIGEgZmxhZyB0byBzdXBwb3J0IDE2LjYgbWlub3IgcmVsZWFzZXMgaW4gdGhlIG1lYW53aGlsZS5cbnZhciBlbmFibGVTdGFibGVDb25jdXJyZW50TW9kZUFQSXMgPSBmYWxzZTtcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIHZhbGlkYXRlRm9ybWF0ID0gZnVuY3Rpb24gKCkge307XG5cbntcbiAgdmFsaWRhdGVGb3JtYXQgPSBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBpbnZhcmlhbnQoY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgdmFsaWRhdGVGb3JtYXQoZm9ybWF0KTtcblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvciA9IHZvaWQgMDtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKCdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJyZWQ7IHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCAnICsgJ2ZvciB0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgICAgfSkpO1xuICAgICAgZXJyb3IubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICB9XG5cbiAgICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgaW52YXJpYW50J3Mgb3duIGZyYW1lXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuLy8gUmVseWluZyBvbiB0aGUgYGludmFyaWFudCgpYCBpbXBsZW1lbnRhdGlvbiBsZXRzIHVzXG4vLyBwcmVzZXJ2ZSB0aGUgZm9ybWF0IGFuZCBwYXJhbXMgaW4gdGhlIHd3dyBidWlsZHMuXG5cbi8qKlxuICogRm9ya2VkIGZyb20gZmJqcy93YXJuaW5nOlxuICogaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL2ZianMvYmxvYi9lNjZiYTIwYWQ1YmU0MzNlYjU0NDIzZjJiMDk3ZDgyOTMyNGQ5ZGU2L3BhY2thZ2VzL2ZianMvc3JjL19fZm9ya3NfXy93YXJuaW5nLmpzXG4gKlxuICogT25seSBjaGFuZ2UgaXMgd2UgdXNlIGNvbnNvbGUud2FybiBpbnN0ZWFkIG9mIGNvbnNvbGUuZXJyb3IsXG4gKiBhbmQgZG8gbm90aGluZyB3aGVuICdjb25zb2xlJyBpcyBub3Qgc3VwcG9ydGVkLlxuICogVGhpcyByZWFsbHkgc2ltcGxpZmllcyB0aGUgY29kZS5cbiAqIC0tLVxuICogU2ltaWxhciB0byBpbnZhcmlhbnQgYnV0IG9ubHkgbG9ncyBhIHdhcm5pbmcgaWYgdGhlIGNvbmRpdGlvbiBpcyBub3QgbWV0LlxuICogVGhpcyBjYW4gYmUgdXNlZCB0byBsb2cgaXNzdWVzIGluIGRldmVsb3BtZW50IGVudmlyb25tZW50cyBpbiBjcml0aWNhbFxuICogcGF0aHMuIFJlbW92aW5nIHRoZSBsb2dnaW5nIGNvZGUgZm9yIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRzIHdpbGwga2VlcCB0aGVcbiAqIHNhbWUgbG9naWMgYW5kIGZvbGxvdyB0aGUgc2FtZSBjb2RlIHBhdGhzLlxuICovXG5cbnZhciBsb3dQcmlvcml0eVdhcm5pbmcgPSBmdW5jdGlvbiAoKSB7fTtcblxue1xuICB2YXIgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICsgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgIH0pO1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUud2FybihtZXNzYWdlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoeCkge31cbiAgfTtcblxuICBsb3dQcmlvcml0eVdhcm5pbmcgPSBmdW5jdGlvbiAoY29uZGl0aW9uLCBmb3JtYXQpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYGxvd1ByaW9yaXR5V2FybmluZyhjb25kaXRpb24sIGZvcm1hdCwgLi4uYXJncylgIHJlcXVpcmVzIGEgd2FybmluZyAnICsgJ21lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4yID4gMiA/IF9sZW4yIC0gMiA6IDApLCBfa2V5MiA9IDI7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgYXJnc1tfa2V5MiAtIDJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgIH1cblxuICAgICAgcHJpbnRXYXJuaW5nLmFwcGx5KHVuZGVmaW5lZCwgW2Zvcm1hdF0uY29uY2F0KGFyZ3MpKTtcbiAgICB9XG4gIH07XG59XG5cbnZhciBsb3dQcmlvcml0eVdhcm5pbmckMSA9IGxvd1ByaW9yaXR5V2FybmluZztcblxuLyoqXG4gKiBTaW1pbGFyIHRvIGludmFyaWFudCBidXQgb25seSBsb2dzIGEgd2FybmluZyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXQuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGxvZyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzIGluIGNyaXRpY2FsXG4gKiBwYXRocy4gUmVtb3ZpbmcgdGhlIGxvZ2dpbmcgY29kZSBmb3IgcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMgd2lsbCBrZWVwIHRoZVxuICogc2FtZSBsb2dpYyBhbmQgZm9sbG93IHRoZSBzYW1lIGNvZGUgcGF0aHMuXG4gKi9cblxudmFyIHdhcm5pbmdXaXRob3V0U3RhY2sgPSBmdW5jdGlvbiAoKSB7fTtcblxue1xuICB3YXJuaW5nV2l0aG91dFN0YWNrID0gZnVuY3Rpb24gKGNvbmRpdGlvbiwgZm9ybWF0KSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYHdhcm5pbmdXaXRob3V0U3RhY2soY29uZGl0aW9uLCBmb3JtYXQsIC4uLmFyZ3MpYCByZXF1aXJlcyBhIHdhcm5pbmcgJyArICdtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICAgIGlmIChhcmdzLmxlbmd0aCA+IDgpIHtcbiAgICAgIC8vIENoZWNrIGJlZm9yZSB0aGUgY29uZGl0aW9uIHRvIGNhdGNoIHZpb2xhdGlvbnMgZWFybHkuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3dhcm5pbmdXaXRob3V0U3RhY2soKSBjdXJyZW50bHkgc3VwcG9ydHMgYXQgbW9zdCA4IGFyZ3VtZW50cy4nKTtcbiAgICB9XG4gICAgaWYgKGNvbmRpdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB2YXIgYXJnc1dpdGhGb3JtYXQgPSBhcmdzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gJycgKyBpdGVtO1xuICAgICAgfSk7XG4gICAgICBhcmdzV2l0aEZvcm1hdC51bnNoaWZ0KCdXYXJuaW5nOiAnICsgZm9ybWF0KTtcblxuICAgICAgLy8gV2UgaW50ZW50aW9uYWxseSBkb24ndCB1c2Ugc3ByZWFkIChvciAuYXBwbHkpIGRpcmVjdGx5IGJlY2F1c2UgaXRcbiAgICAgIC8vIGJyZWFrcyBJRTk6IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9pc3N1ZXMvMTM2MTBcbiAgICAgIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKGNvbnNvbGUuZXJyb3IsIGNvbnNvbGUsIGFyZ3NXaXRoRm9ybWF0KTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgdmFyIG1lc3NhZ2UgPSAnV2FybmluZzogJyArIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgICAgfSk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoeCkge31cbiAgfTtcbn1cblxudmFyIHdhcm5pbmdXaXRob3V0U3RhY2skMSA9IHdhcm5pbmdXaXRob3V0U3RhY2s7XG5cbnZhciBkaWRXYXJuU3RhdGVVcGRhdGVGb3JVbm1vdW50ZWRDb21wb25lbnQgPSB7fTtcblxuZnVuY3Rpb24gd2Fybk5vb3AocHVibGljSW5zdGFuY2UsIGNhbGxlck5hbWUpIHtcbiAge1xuICAgIHZhciBfY29uc3RydWN0b3IgPSBwdWJsaWNJbnN0YW5jZS5jb25zdHJ1Y3RvcjtcbiAgICB2YXIgY29tcG9uZW50TmFtZSA9IF9jb25zdHJ1Y3RvciAmJiAoX2NvbnN0cnVjdG9yLmRpc3BsYXlOYW1lIHx8IF9jb25zdHJ1Y3Rvci5uYW1lKSB8fCAnUmVhY3RDbGFzcyc7XG4gICAgdmFyIHdhcm5pbmdLZXkgPSBjb21wb25lbnROYW1lICsgJy4nICsgY2FsbGVyTmFtZTtcbiAgICBpZiAoZGlkV2FyblN0YXRlVXBkYXRlRm9yVW5tb3VudGVkQ29tcG9uZW50W3dhcm5pbmdLZXldKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgXCJDYW4ndCBjYWxsICVzIG9uIGEgY29tcG9uZW50IHRoYXQgaXMgbm90IHlldCBtb3VudGVkLiBcIiArICdUaGlzIGlzIGEgbm8tb3AsIGJ1dCBpdCBtaWdodCBpbmRpY2F0ZSBhIGJ1ZyBpbiB5b3VyIGFwcGxpY2F0aW9uLiAnICsgJ0luc3RlYWQsIGFzc2lnbiB0byBgdGhpcy5zdGF0ZWAgZGlyZWN0bHkgb3IgZGVmaW5lIGEgYHN0YXRlID0ge307YCAnICsgJ2NsYXNzIHByb3BlcnR5IHdpdGggdGhlIGRlc2lyZWQgc3RhdGUgaW4gdGhlICVzIGNvbXBvbmVudC4nLCBjYWxsZXJOYW1lLCBjb21wb25lbnROYW1lKTtcbiAgICBkaWRXYXJuU3RhdGVVcGRhdGVGb3JVbm1vdW50ZWRDb21wb25lbnRbd2FybmluZ0tleV0gPSB0cnVlO1xuICB9XG59XG5cbi8qKlxuICogVGhpcyBpcyB0aGUgYWJzdHJhY3QgQVBJIGZvciBhbiB1cGRhdGUgcXVldWUuXG4gKi9cbnZhciBSZWFjdE5vb3BVcGRhdGVRdWV1ZSA9IHtcbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIG9yIG5vdCB0aGlzIGNvbXBvc2l0ZSBjb21wb25lbnQgaXMgbW91bnRlZC5cbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2Ugd2Ugd2FudCB0byB0ZXN0LlxuICAgKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIG1vdW50ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICogQHByb3RlY3RlZFxuICAgKiBAZmluYWxcbiAgICovXG4gIGlzTW91bnRlZDogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBGb3JjZXMgYW4gdXBkYXRlLiBUaGlzIHNob3VsZCBvbmx5IGJlIGludm9rZWQgd2hlbiBpdCBpcyBrbm93biB3aXRoXG4gICAqIGNlcnRhaW50eSB0aGF0IHdlIGFyZSAqKm5vdCoqIGluIGEgRE9NIHRyYW5zYWN0aW9uLlxuICAgKlxuICAgKiBZb3UgbWF5IHdhbnQgdG8gY2FsbCB0aGlzIHdoZW4geW91IGtub3cgdGhhdCBzb21lIGRlZXBlciBhc3BlY3Qgb2YgdGhlXG4gICAqIGNvbXBvbmVudCdzIHN0YXRlIGhhcyBjaGFuZ2VkIGJ1dCBgc2V0U3RhdGVgIHdhcyBub3QgY2FsbGVkLlxuICAgKlxuICAgKiBUaGlzIHdpbGwgbm90IGludm9rZSBgc2hvdWxkQ29tcG9uZW50VXBkYXRlYCwgYnV0IGl0IHdpbGwgaW52b2tlXG4gICAqIGBjb21wb25lbnRXaWxsVXBkYXRlYCBhbmQgYGNvbXBvbmVudERpZFVwZGF0ZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHRoYXQgc2hvdWxkIHJlcmVuZGVyLlxuICAgKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIGNvbXBvbmVudCBpcyB1cGRhdGVkLlxuICAgKiBAcGFyYW0gez9zdHJpbmd9IGNhbGxlck5hbWUgbmFtZSBvZiB0aGUgY2FsbGluZyBmdW5jdGlvbiBpbiB0aGUgcHVibGljIEFQSS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBlbnF1ZXVlRm9yY2VVcGRhdGU6IGZ1bmN0aW9uIChwdWJsaWNJbnN0YW5jZSwgY2FsbGJhY2ssIGNhbGxlck5hbWUpIHtcbiAgICB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgJ2ZvcmNlVXBkYXRlJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlcGxhY2VzIGFsbCBvZiB0aGUgc3RhdGUuIEFsd2F5cyB1c2UgdGhpcyBvciBgc2V0U3RhdGVgIHRvIG11dGF0ZSBzdGF0ZS5cbiAgICogWW91IHNob3VsZCB0cmVhdCBgdGhpcy5zdGF0ZWAgYXMgaW1tdXRhYmxlLlxuICAgKlxuICAgKiBUaGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCBgdGhpcy5zdGF0ZWAgd2lsbCBiZSBpbW1lZGlhdGVseSB1cGRhdGVkLCBzb1xuICAgKiBhY2Nlc3NpbmcgYHRoaXMuc3RhdGVgIGFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QgbWF5IHJldHVybiB0aGUgb2xkIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB0aGF0IHNob3VsZCByZXJlbmRlci5cbiAgICogQHBhcmFtIHtvYmplY3R9IGNvbXBsZXRlU3RhdGUgTmV4dCBzdGF0ZS5cbiAgICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciBjb21wb25lbnQgaXMgdXBkYXRlZC5cbiAgICogQHBhcmFtIHs/c3RyaW5nfSBjYWxsZXJOYW1lIG5hbWUgb2YgdGhlIGNhbGxpbmcgZnVuY3Rpb24gaW4gdGhlIHB1YmxpYyBBUEkuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZW5xdWV1ZVJlcGxhY2VTdGF0ZTogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlLCBjb21wbGV0ZVN0YXRlLCBjYWxsYmFjaywgY2FsbGVyTmFtZSkge1xuICAgIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCAncmVwbGFjZVN0YXRlJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldHMgYSBzdWJzZXQgb2YgdGhlIHN0YXRlLiBUaGlzIG9ubHkgZXhpc3RzIGJlY2F1c2UgX3BlbmRpbmdTdGF0ZSBpc1xuICAgKiBpbnRlcm5hbC4gVGhpcyBwcm92aWRlcyBhIG1lcmdpbmcgc3RyYXRlZ3kgdGhhdCBpcyBub3QgYXZhaWxhYmxlIHRvIGRlZXBcbiAgICogcHJvcGVydGllcyB3aGljaCBpcyBjb25mdXNpbmcuIFRPRE86IEV4cG9zZSBwZW5kaW5nU3RhdGUgb3IgZG9uJ3QgdXNlIGl0XG4gICAqIGR1cmluZyB0aGUgbWVyZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHRoYXQgc2hvdWxkIHJlcmVuZGVyLlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGFydGlhbFN0YXRlIE5leHQgcGFydGlhbCBzdGF0ZSB0byBiZSBtZXJnZWQgd2l0aCBzdGF0ZS5cbiAgICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciBjb21wb25lbnQgaXMgdXBkYXRlZC5cbiAgICogQHBhcmFtIHs/c3RyaW5nfSBOYW1lIG9mIHRoZSBjYWxsaW5nIGZ1bmN0aW9uIGluIHRoZSBwdWJsaWMgQVBJLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGVucXVldWVTZXRTdGF0ZTogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlLCBwYXJ0aWFsU3RhdGUsIGNhbGxiYWNrLCBjYWxsZXJOYW1lKSB7XG4gICAgd2Fybk5vb3AocHVibGljSW5zdGFuY2UsICdzZXRTdGF0ZScpO1xuICB9XG59O1xuXG52YXIgZW1wdHlPYmplY3QgPSB7fTtcbntcbiAgT2JqZWN0LmZyZWV6ZShlbXB0eU9iamVjdCk7XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBoZWxwZXJzIGZvciB0aGUgdXBkYXRpbmcgc3RhdGUgb2YgYSBjb21wb25lbnQuXG4gKi9cbmZ1bmN0aW9uIENvbXBvbmVudChwcm9wcywgY29udGV4dCwgdXBkYXRlcikge1xuICB0aGlzLnByb3BzID0gcHJvcHM7XG4gIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIC8vIElmIGEgY29tcG9uZW50IGhhcyBzdHJpbmcgcmVmcywgd2Ugd2lsbCBhc3NpZ24gYSBkaWZmZXJlbnQgb2JqZWN0IGxhdGVyLlxuICB0aGlzLnJlZnMgPSBlbXB0eU9iamVjdDtcbiAgLy8gV2UgaW5pdGlhbGl6ZSB0aGUgZGVmYXVsdCB1cGRhdGVyIGJ1dCB0aGUgcmVhbCBvbmUgZ2V0cyBpbmplY3RlZCBieSB0aGVcbiAgLy8gcmVuZGVyZXIuXG4gIHRoaXMudXBkYXRlciA9IHVwZGF0ZXIgfHwgUmVhY3ROb29wVXBkYXRlUXVldWU7XG59XG5cbkNvbXBvbmVudC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudCA9IHt9O1xuXG4vKipcbiAqIFNldHMgYSBzdWJzZXQgb2YgdGhlIHN0YXRlLiBBbHdheXMgdXNlIHRoaXMgdG8gbXV0YXRlXG4gKiBzdGF0ZS4gWW91IHNob3VsZCB0cmVhdCBgdGhpcy5zdGF0ZWAgYXMgaW1tdXRhYmxlLlxuICpcbiAqIFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGB0aGlzLnN0YXRlYCB3aWxsIGJlIGltbWVkaWF0ZWx5IHVwZGF0ZWQsIHNvXG4gKiBhY2Nlc3NpbmcgYHRoaXMuc3RhdGVgIGFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QgbWF5IHJldHVybiB0aGUgb2xkIHZhbHVlLlxuICpcbiAqIFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGNhbGxzIHRvIGBzZXRTdGF0ZWAgd2lsbCBydW4gc3luY2hyb25vdXNseSxcbiAqIGFzIHRoZXkgbWF5IGV2ZW50dWFsbHkgYmUgYmF0Y2hlZCB0b2dldGhlci4gIFlvdSBjYW4gcHJvdmlkZSBhbiBvcHRpb25hbFxuICogY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIHdoZW4gdGhlIGNhbGwgdG8gc2V0U3RhdGUgaXMgYWN0dWFsbHlcbiAqIGNvbXBsZXRlZC5cbiAqXG4gKiBXaGVuIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQgdG8gc2V0U3RhdGUsIGl0IHdpbGwgYmUgY2FsbGVkIGF0IHNvbWUgcG9pbnQgaW5cbiAqIHRoZSBmdXR1cmUgKG5vdCBzeW5jaHJvbm91c2x5KS4gSXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgdXAgdG8gZGF0ZVxuICogY29tcG9uZW50IGFyZ3VtZW50cyAoc3RhdGUsIHByb3BzLCBjb250ZXh0KS4gVGhlc2UgdmFsdWVzIGNhbiBiZSBkaWZmZXJlbnRcbiAqIGZyb20gdGhpcy4qIGJlY2F1c2UgeW91ciBmdW5jdGlvbiBtYXkgYmUgY2FsbGVkIGFmdGVyIHJlY2VpdmVQcm9wcyBidXQgYmVmb3JlXG4gKiBzaG91bGRDb21wb25lbnRVcGRhdGUsIGFuZCB0aGlzIG5ldyBzdGF0ZSwgcHJvcHMsIGFuZCBjb250ZXh0IHdpbGwgbm90IHlldCBiZVxuICogYXNzaWduZWQgdG8gdGhpcy5cbiAqXG4gKiBAcGFyYW0ge29iamVjdHxmdW5jdGlvbn0gcGFydGlhbFN0YXRlIE5leHQgcGFydGlhbCBzdGF0ZSBvciBmdW5jdGlvbiB0b1xuICogICAgICAgIHByb2R1Y2UgbmV4dCBwYXJ0aWFsIHN0YXRlIHRvIGJlIG1lcmdlZCB3aXRoIGN1cnJlbnQgc3RhdGUuXG4gKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIHN0YXRlIGlzIHVwZGF0ZWQuXG4gKiBAZmluYWxcbiAqIEBwcm90ZWN0ZWRcbiAqL1xuQ29tcG9uZW50LnByb3RvdHlwZS5zZXRTdGF0ZSA9IGZ1bmN0aW9uIChwYXJ0aWFsU3RhdGUsIGNhbGxiYWNrKSB7XG4gICEodHlwZW9mIHBhcnRpYWxTdGF0ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHBhcnRpYWxTdGF0ZSA9PT0gJ2Z1bmN0aW9uJyB8fCBwYXJ0aWFsU3RhdGUgPT0gbnVsbCkgPyBpbnZhcmlhbnQoZmFsc2UsICdzZXRTdGF0ZSguLi4pOiB0YWtlcyBhbiBvYmplY3Qgb2Ygc3RhdGUgdmFyaWFibGVzIHRvIHVwZGF0ZSBvciBhIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYW4gb2JqZWN0IG9mIHN0YXRlIHZhcmlhYmxlcy4nKSA6IHZvaWQgMDtcbiAgdGhpcy51cGRhdGVyLmVucXVldWVTZXRTdGF0ZSh0aGlzLCBwYXJ0aWFsU3RhdGUsIGNhbGxiYWNrLCAnc2V0U3RhdGUnKTtcbn07XG5cbi8qKlxuICogRm9yY2VzIGFuIHVwZGF0ZS4gVGhpcyBzaG91bGQgb25seSBiZSBpbnZva2VkIHdoZW4gaXQgaXMga25vd24gd2l0aFxuICogY2VydGFpbnR5IHRoYXQgd2UgYXJlICoqbm90KiogaW4gYSBET00gdHJhbnNhY3Rpb24uXG4gKlxuICogWW91IG1heSB3YW50IHRvIGNhbGwgdGhpcyB3aGVuIHlvdSBrbm93IHRoYXQgc29tZSBkZWVwZXIgYXNwZWN0IG9mIHRoZVxuICogY29tcG9uZW50J3Mgc3RhdGUgaGFzIGNoYW5nZWQgYnV0IGBzZXRTdGF0ZWAgd2FzIG5vdCBjYWxsZWQuXG4gKlxuICogVGhpcyB3aWxsIG5vdCBpbnZva2UgYHNob3VsZENvbXBvbmVudFVwZGF0ZWAsIGJ1dCBpdCB3aWxsIGludm9rZVxuICogYGNvbXBvbmVudFdpbGxVcGRhdGVgIGFuZCBgY29tcG9uZW50RGlkVXBkYXRlYC5cbiAqXG4gKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIHVwZGF0ZSBpcyBjb21wbGV0ZS5cbiAqIEBmaW5hbFxuICogQHByb3RlY3RlZFxuICovXG5Db21wb25lbnQucHJvdG90eXBlLmZvcmNlVXBkYXRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHRoaXMudXBkYXRlci5lbnF1ZXVlRm9yY2VVcGRhdGUodGhpcywgY2FsbGJhY2ssICdmb3JjZVVwZGF0ZScpO1xufTtcblxuLyoqXG4gKiBEZXByZWNhdGVkIEFQSXMuIFRoZXNlIEFQSXMgdXNlZCB0byBleGlzdCBvbiBjbGFzc2ljIFJlYWN0IGNsYXNzZXMgYnV0IHNpbmNlXG4gKiB3ZSB3b3VsZCBsaWtlIHRvIGRlcHJlY2F0ZSB0aGVtLCB3ZSdyZSBub3QgZ29pbmcgdG8gbW92ZSB0aGVtIG92ZXIgdG8gdGhpc1xuICogbW9kZXJuIGJhc2UgY2xhc3MuIEluc3RlYWQsIHdlIGRlZmluZSBhIGdldHRlciB0aGF0IHdhcm5zIGlmIGl0J3MgYWNjZXNzZWQuXG4gKi9cbntcbiAgdmFyIGRlcHJlY2F0ZWRBUElzID0ge1xuICAgIGlzTW91bnRlZDogWydpc01vdW50ZWQnLCAnSW5zdGVhZCwgbWFrZSBzdXJlIHRvIGNsZWFuIHVwIHN1YnNjcmlwdGlvbnMgYW5kIHBlbmRpbmcgcmVxdWVzdHMgaW4gJyArICdjb21wb25lbnRXaWxsVW5tb3VudCB0byBwcmV2ZW50IG1lbW9yeSBsZWFrcy4nXSxcbiAgICByZXBsYWNlU3RhdGU6IFsncmVwbGFjZVN0YXRlJywgJ1JlZmFjdG9yIHlvdXIgY29kZSB0byB1c2Ugc2V0U3RhdGUgaW5zdGVhZCAoc2VlICcgKyAnaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8zMjM2KS4nXVxuICB9O1xuICB2YXIgZGVmaW5lRGVwcmVjYXRpb25XYXJuaW5nID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUsIGluZm8pIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ29tcG9uZW50LnByb3RvdHlwZSwgbWV0aG9kTmFtZSwge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxvd1ByaW9yaXR5V2FybmluZyQxKGZhbHNlLCAnJXMoLi4uKSBpcyBkZXByZWNhdGVkIGluIHBsYWluIEphdmFTY3JpcHQgUmVhY3QgY2xhc3Nlcy4gJXMnLCBpbmZvWzBdLCBpbmZvWzFdKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgZm9yICh2YXIgZm5OYW1lIGluIGRlcHJlY2F0ZWRBUElzKSB7XG4gICAgaWYgKGRlcHJlY2F0ZWRBUElzLmhhc093blByb3BlcnR5KGZuTmFtZSkpIHtcbiAgICAgIGRlZmluZURlcHJlY2F0aW9uV2FybmluZyhmbk5hbWUsIGRlcHJlY2F0ZWRBUElzW2ZuTmFtZV0pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBDb21wb25lbnREdW1teSgpIHt9XG5Db21wb25lbnREdW1teS5wcm90b3R5cGUgPSBDb21wb25lbnQucHJvdG90eXBlO1xuXG4vKipcbiAqIENvbnZlbmllbmNlIGNvbXBvbmVudCB3aXRoIGRlZmF1bHQgc2hhbGxvdyBlcXVhbGl0eSBjaGVjayBmb3Igc0NVLlxuICovXG5mdW5jdGlvbiBQdXJlQ29tcG9uZW50KHByb3BzLCBjb250ZXh0LCB1cGRhdGVyKSB7XG4gIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgLy8gSWYgYSBjb21wb25lbnQgaGFzIHN0cmluZyByZWZzLCB3ZSB3aWxsIGFzc2lnbiBhIGRpZmZlcmVudCBvYmplY3QgbGF0ZXIuXG4gIHRoaXMucmVmcyA9IGVtcHR5T2JqZWN0O1xuICB0aGlzLnVwZGF0ZXIgPSB1cGRhdGVyIHx8IFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlO1xufVxuXG52YXIgcHVyZUNvbXBvbmVudFByb3RvdHlwZSA9IFB1cmVDb21wb25lbnQucHJvdG90eXBlID0gbmV3IENvbXBvbmVudER1bW15KCk7XG5wdXJlQ29tcG9uZW50UHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUHVyZUNvbXBvbmVudDtcbi8vIEF2b2lkIGFuIGV4dHJhIHByb3RvdHlwZSBqdW1wIGZvciB0aGVzZSBtZXRob2RzLlxuX2Fzc2lnbihwdXJlQ29tcG9uZW50UHJvdG90eXBlLCBDb21wb25lbnQucHJvdG90eXBlKTtcbnB1cmVDb21wb25lbnRQcm90b3R5cGUuaXNQdXJlUmVhY3RDb21wb25lbnQgPSB0cnVlO1xuXG4vLyBhbiBpbW11dGFibGUgb2JqZWN0IHdpdGggYSBzaW5nbGUgbXV0YWJsZSB2YWx1ZVxuZnVuY3Rpb24gY3JlYXRlUmVmKCkge1xuICB2YXIgcmVmT2JqZWN0ID0ge1xuICAgIGN1cnJlbnQ6IG51bGxcbiAgfTtcbiAge1xuICAgIE9iamVjdC5zZWFsKHJlZk9iamVjdCk7XG4gIH1cbiAgcmV0dXJuIHJlZk9iamVjdDtcbn1cblxuLyoqXG4gKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudCBvd25lci5cbiAqXG4gKiBUaGUgY3VycmVudCBvd25lciBpcyB0aGUgY29tcG9uZW50IHdobyBzaG91bGQgb3duIGFueSBjb21wb25lbnRzIHRoYXQgYXJlXG4gKiBjdXJyZW50bHkgYmVpbmcgY29uc3RydWN0ZWQuXG4gKi9cbnZhciBSZWFjdEN1cnJlbnRPd25lciA9IHtcbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBAdHlwZSB7UmVhY3RDb21wb25lbnR9XG4gICAqL1xuICBjdXJyZW50OiBudWxsLFxuICBjdXJyZW50RGlzcGF0Y2hlcjogbnVsbFxufTtcblxudmFyIEJFRk9SRV9TTEFTSF9SRSA9IC9eKC4qKVtcXFxcXFwvXS87XG5cbnZhciBkZXNjcmliZUNvbXBvbmVudEZyYW1lID0gZnVuY3Rpb24gKG5hbWUsIHNvdXJjZSwgb3duZXJOYW1lKSB7XG4gIHZhciBzb3VyY2VJbmZvID0gJyc7XG4gIGlmIChzb3VyY2UpIHtcbiAgICB2YXIgcGF0aCA9IHNvdXJjZS5maWxlTmFtZTtcbiAgICB2YXIgZmlsZU5hbWUgPSBwYXRoLnJlcGxhY2UoQkVGT1JFX1NMQVNIX1JFLCAnJyk7XG4gICAge1xuICAgICAgLy8gSW4gREVWLCBpbmNsdWRlIGNvZGUgZm9yIGEgY29tbW9uIHNwZWNpYWwgY2FzZTpcbiAgICAgIC8vIHByZWZlciBcImZvbGRlci9pbmRleC5qc1wiIGluc3RlYWQgb2YganVzdCBcImluZGV4LmpzXCIuXG4gICAgICBpZiAoL15pbmRleFxcLi8udGVzdChmaWxlTmFtZSkpIHtcbiAgICAgICAgdmFyIG1hdGNoID0gcGF0aC5tYXRjaChCRUZPUkVfU0xBU0hfUkUpO1xuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICB2YXIgcGF0aEJlZm9yZVNsYXNoID0gbWF0Y2hbMV07XG4gICAgICAgICAgaWYgKHBhdGhCZWZvcmVTbGFzaCkge1xuICAgICAgICAgICAgdmFyIGZvbGRlck5hbWUgPSBwYXRoQmVmb3JlU2xhc2gucmVwbGFjZShCRUZPUkVfU0xBU0hfUkUsICcnKTtcbiAgICAgICAgICAgIGZpbGVOYW1lID0gZm9sZGVyTmFtZSArICcvJyArIGZpbGVOYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBzb3VyY2VJbmZvID0gJyAoYXQgJyArIGZpbGVOYW1lICsgJzonICsgc291cmNlLmxpbmVOdW1iZXIgKyAnKSc7XG4gIH0gZWxzZSBpZiAob3duZXJOYW1lKSB7XG4gICAgc291cmNlSW5mbyA9ICcgKGNyZWF0ZWQgYnkgJyArIG93bmVyTmFtZSArICcpJztcbiAgfVxuICByZXR1cm4gJ1xcbiAgICBpbiAnICsgKG5hbWUgfHwgJ1Vua25vd24nKSArIHNvdXJjZUluZm87XG59O1xuXG52YXIgUmVzb2x2ZWQgPSAxO1xuXG5cbmZ1bmN0aW9uIHJlZmluZVJlc29sdmVkTGF6eUNvbXBvbmVudChsYXp5Q29tcG9uZW50KSB7XG4gIHJldHVybiBsYXp5Q29tcG9uZW50Ll9zdGF0dXMgPT09IFJlc29sdmVkID8gbGF6eUNvbXBvbmVudC5fcmVzdWx0IDogbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0V3JhcHBlZE5hbWUob3V0ZXJUeXBlLCBpbm5lclR5cGUsIHdyYXBwZXJOYW1lKSB7XG4gIHZhciBmdW5jdGlvbk5hbWUgPSBpbm5lclR5cGUuZGlzcGxheU5hbWUgfHwgaW5uZXJUeXBlLm5hbWUgfHwgJyc7XG4gIHJldHVybiBvdXRlclR5cGUuZGlzcGxheU5hbWUgfHwgKGZ1bmN0aW9uTmFtZSAhPT0gJycgPyB3cmFwcGVyTmFtZSArICcoJyArIGZ1bmN0aW9uTmFtZSArICcpJyA6IHdyYXBwZXJOYW1lKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50TmFtZSh0eXBlKSB7XG4gIGlmICh0eXBlID09IG51bGwpIHtcbiAgICAvLyBIb3N0IHJvb3QsIHRleHQgbm9kZSBvciBqdXN0IGludmFsaWQgdHlwZS5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB7XG4gICAgaWYgKHR5cGVvZiB0eXBlLnRhZyA9PT0gJ251bWJlcicpIHtcbiAgICAgIHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ1JlY2VpdmVkIGFuIHVuZXhwZWN0ZWQgb2JqZWN0IGluIGdldENvbXBvbmVudE5hbWUoKS4gJyArICdUaGlzIGlzIGxpa2VseSBhIGJ1ZyBpbiBSZWFjdC4gUGxlYXNlIGZpbGUgYW4gaXNzdWUuJyk7XG4gICAgfVxuICB9XG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB0eXBlLmRpc3BsYXlOYW1lIHx8IHR5cGUubmFtZSB8fCBudWxsO1xuICB9XG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdHlwZTtcbiAgfVxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFOlxuICAgICAgcmV0dXJuICdDb25jdXJyZW50TW9kZSc7XG4gICAgY2FzZSBSRUFDVF9GUkFHTUVOVF9UWVBFOlxuICAgICAgcmV0dXJuICdGcmFnbWVudCc7XG4gICAgY2FzZSBSRUFDVF9QT1JUQUxfVFlQRTpcbiAgICAgIHJldHVybiAnUG9ydGFsJztcbiAgICBjYXNlIFJFQUNUX1BST0ZJTEVSX1RZUEU6XG4gICAgICByZXR1cm4gJ1Byb2ZpbGVyJztcbiAgICBjYXNlIFJFQUNUX1NUUklDVF9NT0RFX1RZUEU6XG4gICAgICByZXR1cm4gJ1N0cmljdE1vZGUnO1xuICAgIGNhc2UgUkVBQ1RfU1VTUEVOU0VfVFlQRTpcbiAgICAgIHJldHVybiAnU3VzcGVuc2UnO1xuICB9XG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICBzd2l0Y2ggKHR5cGUuJCR0eXBlb2YpIHtcbiAgICAgIGNhc2UgUkVBQ1RfQ09OVEVYVF9UWVBFOlxuICAgICAgICByZXR1cm4gJ0NvbnRleHQuQ29uc3VtZXInO1xuICAgICAgY2FzZSBSRUFDVF9QUk9WSURFUl9UWVBFOlxuICAgICAgICByZXR1cm4gJ0NvbnRleHQuUHJvdmlkZXInO1xuICAgICAgY2FzZSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFOlxuICAgICAgICByZXR1cm4gZ2V0V3JhcHBlZE5hbWUodHlwZSwgdHlwZS5yZW5kZXIsICdGb3J3YXJkUmVmJyk7XG4gICAgICBjYXNlIFJFQUNUX01FTU9fVFlQRTpcbiAgICAgICAgcmV0dXJuIGdldENvbXBvbmVudE5hbWUodHlwZS50eXBlKTtcbiAgICAgIGNhc2UgUkVBQ1RfTEFaWV9UWVBFOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIHRoZW5hYmxlID0gdHlwZTtcbiAgICAgICAgICB2YXIgcmVzb2x2ZWRUaGVuYWJsZSA9IHJlZmluZVJlc29sdmVkTGF6eUNvbXBvbmVudCh0aGVuYWJsZSk7XG4gICAgICAgICAgaWYgKHJlc29sdmVkVGhlbmFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRDb21wb25lbnROYW1lKHJlc29sdmVkVGhlbmFibGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxudmFyIFJlYWN0RGVidWdDdXJyZW50RnJhbWUgPSB7fTtcblxudmFyIGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50ID0gbnVsbDtcblxuZnVuY3Rpb24gc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQoZWxlbWVudCkge1xuICB7XG4gICAgY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQgPSBlbGVtZW50O1xuICB9XG59XG5cbntcbiAgLy8gU3RhY2sgaW1wbGVtZW50YXRpb24gaW5qZWN0ZWQgYnkgdGhlIGN1cnJlbnQgcmVuZGVyZXIuXG4gIFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0Q3VycmVudFN0YWNrID0gbnVsbDtcblxuICBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldFN0YWNrQWRkZW5kdW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHN0YWNrID0gJyc7XG5cbiAgICAvLyBBZGQgYW4gZXh0cmEgdG9wIGZyYW1lIHdoaWxlIGFuIGVsZW1lbnQgaXMgYmVpbmcgdmFsaWRhdGVkXG4gICAgaWYgKGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KSB7XG4gICAgICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWUoY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQudHlwZSk7XG4gICAgICB2YXIgb3duZXIgPSBjdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudC5fb3duZXI7XG4gICAgICBzdGFjayArPSBkZXNjcmliZUNvbXBvbmVudEZyYW1lKG5hbWUsIGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50Ll9zb3VyY2UsIG93bmVyICYmIGdldENvbXBvbmVudE5hbWUob3duZXIudHlwZSkpO1xuICAgIH1cblxuICAgIC8vIERlbGVnYXRlIHRvIHRoZSBpbmplY3RlZCByZW5kZXJlci1zcGVjaWZpYyBpbXBsZW1lbnRhdGlvblxuICAgIHZhciBpbXBsID0gUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRDdXJyZW50U3RhY2s7XG4gICAgaWYgKGltcGwpIHtcbiAgICAgIHN0YWNrICs9IGltcGwoKSB8fCAnJztcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhY2s7XG4gIH07XG59XG5cbnZhciBSZWFjdFNoYXJlZEludGVybmFscyA9IHtcbiAgUmVhY3RDdXJyZW50T3duZXI6IFJlYWN0Q3VycmVudE93bmVyLFxuICAvLyBVc2VkIGJ5IHJlbmRlcmVycyB0byBhdm9pZCBidW5kbGluZyBvYmplY3QtYXNzaWduIHR3aWNlIGluIFVNRCBidW5kbGVzOlxuICBhc3NpZ246IF9hc3NpZ25cbn07XG5cbntcbiAgX2Fzc2lnbihSZWFjdFNoYXJlZEludGVybmFscywge1xuICAgIC8vIFRoZXNlIHNob3VsZCBub3QgYmUgaW5jbHVkZWQgaW4gcHJvZHVjdGlvbi5cbiAgICBSZWFjdERlYnVnQ3VycmVudEZyYW1lOiBSZWFjdERlYnVnQ3VycmVudEZyYW1lLFxuICAgIC8vIFNoaW0gZm9yIFJlYWN0IERPTSAxNi4wLjAgd2hpY2ggc3RpbGwgZGVzdHJ1Y3R1cmVkIChidXQgbm90IHVzZWQpIHRoaXMuXG4gICAgLy8gVE9ETzogcmVtb3ZlIGluIFJlYWN0IDE3LjAuXG4gICAgUmVhY3RDb21wb25lbnRUcmVlSG9vazoge31cbiAgfSk7XG59XG5cbi8qKlxuICogU2ltaWxhciB0byBpbnZhcmlhbnQgYnV0IG9ubHkgbG9ncyBhIHdhcm5pbmcgaWYgdGhlIGNvbmRpdGlvbiBpcyBub3QgbWV0LlxuICogVGhpcyBjYW4gYmUgdXNlZCB0byBsb2cgaXNzdWVzIGluIGRldmVsb3BtZW50IGVudmlyb25tZW50cyBpbiBjcml0aWNhbFxuICogcGF0aHMuIFJlbW92aW5nIHRoZSBsb2dnaW5nIGNvZGUgZm9yIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRzIHdpbGwga2VlcCB0aGVcbiAqIHNhbWUgbG9naWMgYW5kIGZvbGxvdyB0aGUgc2FtZSBjb2RlIHBhdGhzLlxuICovXG5cbnZhciB3YXJuaW5nID0gd2FybmluZ1dpdGhvdXRTdGFjayQxO1xuXG57XG4gIHdhcm5pbmcgPSBmdW5jdGlvbiAoY29uZGl0aW9uLCBmb3JtYXQpIHtcbiAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBSZWFjdERlYnVnQ3VycmVudEZyYW1lID0gUmVhY3RTaGFyZWRJbnRlcm5hbHMuUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZTtcbiAgICB2YXIgc3RhY2sgPSBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldFN0YWNrQWRkZW5kdW0oKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaW50ZXJuYWwvd2FybmluZy1hbmQtaW52YXJpYW50LWFyZ3NcblxuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5IC0gMl0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgd2FybmluZ1dpdGhvdXRTdGFjayQxLmFwcGx5KHVuZGVmaW5lZCwgW2ZhbHNlLCBmb3JtYXQgKyAnJXMnXS5jb25jYXQoYXJncywgW3N0YWNrXSkpO1xuICB9O1xufVxuXG52YXIgd2FybmluZyQxID0gd2FybmluZztcblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxudmFyIFJFU0VSVkVEX1BST1BTID0ge1xuICBrZXk6IHRydWUsXG4gIHJlZjogdHJ1ZSxcbiAgX19zZWxmOiB0cnVlLFxuICBfX3NvdXJjZTogdHJ1ZVxufTtcblxudmFyIHNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duID0gdm9pZCAwO1xudmFyIHNwZWNpYWxQcm9wUmVmV2FybmluZ1Nob3duID0gdm9pZCAwO1xuXG5mdW5jdGlvbiBoYXNWYWxpZFJlZihjb25maWcpIHtcbiAge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgJ3JlZicpKSB7XG4gICAgICB2YXIgZ2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjb25maWcsICdyZWYnKS5nZXQ7XG4gICAgICBpZiAoZ2V0dGVyICYmIGdldHRlci5pc1JlYWN0V2FybmluZykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBjb25maWcucmVmICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkS2V5KGNvbmZpZykge1xuICB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCAna2V5JykpIHtcbiAgICAgIHZhciBnZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGNvbmZpZywgJ2tleScpLmdldDtcbiAgICAgIGlmIChnZXR0ZXIgJiYgZ2V0dGVyLmlzUmVhY3RXYXJuaW5nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbmZpZy5rZXkgIT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZGVmaW5lS2V5UHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKSB7XG4gIHZhciB3YXJuQWJvdXRBY2Nlc3NpbmdLZXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93bikge1xuICAgICAgc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd24gPSB0cnVlO1xuICAgICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnJXM6IGBrZXlgIGlzIG5vdCBhIHByb3AuIFRyeWluZyB0byBhY2Nlc3MgaXQgd2lsbCByZXN1bHQgJyArICdpbiBgdW5kZWZpbmVkYCBiZWluZyByZXR1cm5lZC4gSWYgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSBzYW1lICcgKyAndmFsdWUgd2l0aGluIHRoZSBjaGlsZCBjb21wb25lbnQsIHlvdSBzaG91bGQgcGFzcyBpdCBhcyBhIGRpZmZlcmVudCAnICsgJ3Byb3AuIChodHRwczovL2ZiLm1lL3JlYWN0LXNwZWNpYWwtcHJvcHMpJywgZGlzcGxheU5hbWUpO1xuICAgIH1cbiAgfTtcbiAgd2FybkFib3V0QWNjZXNzaW5nS2V5LmlzUmVhY3RXYXJuaW5nID0gdHJ1ZTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3BzLCAna2V5Jywge1xuICAgIGdldDogd2FybkFib3V0QWNjZXNzaW5nS2V5LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVmaW5lUmVmUHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKSB7XG4gIHZhciB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFzcGVjaWFsUHJvcFJlZldhcm5pbmdTaG93bikge1xuICAgICAgc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd24gPSB0cnVlO1xuICAgICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnJXM6IGByZWZgIGlzIG5vdCBhIHByb3AuIFRyeWluZyB0byBhY2Nlc3MgaXQgd2lsbCByZXN1bHQgJyArICdpbiBgdW5kZWZpbmVkYCBiZWluZyByZXR1cm5lZC4gSWYgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSBzYW1lICcgKyAndmFsdWUgd2l0aGluIHRoZSBjaGlsZCBjb21wb25lbnQsIHlvdSBzaG91bGQgcGFzcyBpdCBhcyBhIGRpZmZlcmVudCAnICsgJ3Byb3AuIChodHRwczovL2ZiLm1lL3JlYWN0LXNwZWNpYWwtcHJvcHMpJywgZGlzcGxheU5hbWUpO1xuICAgIH1cbiAgfTtcbiAgd2FybkFib3V0QWNjZXNzaW5nUmVmLmlzUmVhY3RXYXJuaW5nID0gdHJ1ZTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3BzLCAncmVmJywge1xuICAgIGdldDogd2FybkFib3V0QWNjZXNzaW5nUmVmLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuLyoqXG4gKiBGYWN0b3J5IG1ldGhvZCB0byBjcmVhdGUgYSBuZXcgUmVhY3QgZWxlbWVudC4gVGhpcyBubyBsb25nZXIgYWRoZXJlcyB0b1xuICogdGhlIGNsYXNzIHBhdHRlcm4sIHNvIGRvIG5vdCB1c2UgbmV3IHRvIGNhbGwgaXQuIEFsc28sIG5vIGluc3RhbmNlb2YgY2hlY2tcbiAqIHdpbGwgd29yay4gSW5zdGVhZCB0ZXN0ICQkdHlwZW9mIGZpZWxkIGFnYWluc3QgU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpIHRvIGNoZWNrXG4gKiBpZiBzb21ldGhpbmcgaXMgYSBSZWFjdCBFbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7Kn0gdHlwZVxuICogQHBhcmFtIHsqfSBrZXlcbiAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gcmVmXG4gKiBAcGFyYW0geyp9IHNlbGYgQSAqdGVtcG9yYXJ5KiBoZWxwZXIgdG8gZGV0ZWN0IHBsYWNlcyB3aGVyZSBgdGhpc2AgaXNcbiAqIGRpZmZlcmVudCBmcm9tIHRoZSBgb3duZXJgIHdoZW4gUmVhY3QuY3JlYXRlRWxlbWVudCBpcyBjYWxsZWQsIHNvIHRoYXQgd2VcbiAqIGNhbiB3YXJuLiBXZSB3YW50IHRvIGdldCByaWQgb2Ygb3duZXIgYW5kIHJlcGxhY2Ugc3RyaW5nIGByZWZgcyB3aXRoIGFycm93XG4gKiBmdW5jdGlvbnMsIGFuZCBhcyBsb25nIGFzIGB0aGlzYCBhbmQgb3duZXIgYXJlIHRoZSBzYW1lLCB0aGVyZSB3aWxsIGJlIG5vXG4gKiBjaGFuZ2UgaW4gYmVoYXZpb3IuXG4gKiBAcGFyYW0geyp9IHNvdXJjZSBBbiBhbm5vdGF0aW9uIG9iamVjdCAoYWRkZWQgYnkgYSB0cmFuc3BpbGVyIG9yIG90aGVyd2lzZSlcbiAqIGluZGljYXRpbmcgZmlsZW5hbWUsIGxpbmUgbnVtYmVyLCBhbmQvb3Igb3RoZXIgaW5mb3JtYXRpb24uXG4gKiBAcGFyYW0geyp9IG93bmVyXG4gKiBAcGFyYW0geyp9IHByb3BzXG4gKiBAaW50ZXJuYWxcbiAqL1xudmFyIFJlYWN0RWxlbWVudCA9IGZ1bmN0aW9uICh0eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBvd25lciwgcHJvcHMpIHtcbiAgdmFyIGVsZW1lbnQgPSB7XG4gICAgLy8gVGhpcyB0YWcgYWxsb3dzIHVzIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IHRoaXMgYXMgYSBSZWFjdCBFbGVtZW50XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0VMRU1FTlRfVFlQRSxcblxuICAgIC8vIEJ1aWx0LWluIHByb3BlcnRpZXMgdGhhdCBiZWxvbmcgb24gdGhlIGVsZW1lbnRcbiAgICB0eXBlOiB0eXBlLFxuICAgIGtleToga2V5LFxuICAgIHJlZjogcmVmLFxuICAgIHByb3BzOiBwcm9wcyxcblxuICAgIC8vIFJlY29yZCB0aGUgY29tcG9uZW50IHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGlzIGVsZW1lbnQuXG4gICAgX293bmVyOiBvd25lclxuICB9O1xuXG4gIHtcbiAgICAvLyBUaGUgdmFsaWRhdGlvbiBmbGFnIGlzIGN1cnJlbnRseSBtdXRhdGl2ZS4gV2UgcHV0IGl0IG9uXG4gICAgLy8gYW4gZXh0ZXJuYWwgYmFja2luZyBzdG9yZSBzbyB0aGF0IHdlIGNhbiBmcmVlemUgdGhlIHdob2xlIG9iamVjdC5cbiAgICAvLyBUaGlzIGNhbiBiZSByZXBsYWNlZCB3aXRoIGEgV2Vha01hcCBvbmNlIHRoZXkgYXJlIGltcGxlbWVudGVkIGluXG4gICAgLy8gY29tbW9ubHkgdXNlZCBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMuXG4gICAgZWxlbWVudC5fc3RvcmUgPSB7fTtcblxuICAgIC8vIFRvIG1ha2UgY29tcGFyaW5nIFJlYWN0RWxlbWVudHMgZWFzaWVyIGZvciB0ZXN0aW5nIHB1cnBvc2VzLCB3ZSBtYWtlXG4gICAgLy8gdGhlIHZhbGlkYXRpb24gZmxhZyBub24tZW51bWVyYWJsZSAod2hlcmUgcG9zc2libGUsIHdoaWNoIHNob3VsZFxuICAgIC8vIGluY2x1ZGUgZXZlcnkgZW52aXJvbm1lbnQgd2UgcnVuIHRlc3RzIGluKSwgc28gdGhlIHRlc3QgZnJhbWV3b3JrXG4gICAgLy8gaWdub3JlcyBpdC5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudC5fc3RvcmUsICd2YWxpZGF0ZWQnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIHZhbHVlOiBmYWxzZVxuICAgIH0pO1xuICAgIC8vIHNlbGYgYW5kIHNvdXJjZSBhcmUgREVWIG9ubHkgcHJvcGVydGllcy5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudCwgJ19zZWxmJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHNlbGZcbiAgICB9KTtcbiAgICAvLyBUd28gZWxlbWVudHMgY3JlYXRlZCBpbiB0d28gZGlmZmVyZW50IHBsYWNlcyBzaG91bGQgYmUgY29uc2lkZXJlZFxuICAgIC8vIGVxdWFsIGZvciB0ZXN0aW5nIHB1cnBvc2VzIGFuZCB0aGVyZWZvcmUgd2UgaGlkZSBpdCBmcm9tIGVudW1lcmF0aW9uLlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50LCAnX3NvdXJjZScsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBzb3VyY2VcbiAgICB9KTtcbiAgICBpZiAoT2JqZWN0LmZyZWV6ZSkge1xuICAgICAgT2JqZWN0LmZyZWV6ZShlbGVtZW50LnByb3BzKTtcbiAgICAgIE9iamVjdC5mcmVlemUoZWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhbmQgcmV0dXJuIGEgbmV3IFJlYWN0RWxlbWVudCBvZiB0aGUgZ2l2ZW4gdHlwZS5cbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjY3JlYXRlZWxlbWVudFxuICovXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50KHR5cGUsIGNvbmZpZywgY2hpbGRyZW4pIHtcbiAgdmFyIHByb3BOYW1lID0gdm9pZCAwO1xuXG4gIC8vIFJlc2VydmVkIG5hbWVzIGFyZSBleHRyYWN0ZWRcbiAgdmFyIHByb3BzID0ge307XG5cbiAgdmFyIGtleSA9IG51bGw7XG4gIHZhciByZWYgPSBudWxsO1xuICB2YXIgc2VsZiA9IG51bGw7XG4gIHZhciBzb3VyY2UgPSBudWxsO1xuXG4gIGlmIChjb25maWcgIT0gbnVsbCkge1xuICAgIGlmIChoYXNWYWxpZFJlZihjb25maWcpKSB7XG4gICAgICByZWYgPSBjb25maWcucmVmO1xuICAgIH1cbiAgICBpZiAoaGFzVmFsaWRLZXkoY29uZmlnKSkge1xuICAgICAga2V5ID0gJycgKyBjb25maWcua2V5O1xuICAgIH1cblxuICAgIHNlbGYgPSBjb25maWcuX19zZWxmID09PSB1bmRlZmluZWQgPyBudWxsIDogY29uZmlnLl9fc2VsZjtcbiAgICBzb3VyY2UgPSBjb25maWcuX19zb3VyY2UgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjb25maWcuX19zb3VyY2U7XG4gICAgLy8gUmVtYWluaW5nIHByb3BlcnRpZXMgYXJlIGFkZGVkIHRvIGEgbmV3IHByb3BzIG9iamVjdFxuICAgIGZvciAocHJvcE5hbWUgaW4gY29uZmlnKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsIHByb3BOYW1lKSAmJiAhUkVTRVJWRURfUFJPUFMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ2hpbGRyZW4gY2FuIGJlIG1vcmUgdGhhbiBvbmUgYXJndW1lbnQsIGFuZCB0aG9zZSBhcmUgdHJhbnNmZXJyZWQgb250b1xuICAvLyB0aGUgbmV3bHkgYWxsb2NhdGVkIHByb3BzIG9iamVjdC5cbiAgdmFyIGNoaWxkcmVuTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCAtIDI7XG4gIGlmIChjaGlsZHJlbkxlbmd0aCA9PT0gMSkge1xuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIH0gZWxzZSBpZiAoY2hpbGRyZW5MZW5ndGggPiAxKSB7XG4gICAgdmFyIGNoaWxkQXJyYXkgPSBBcnJheShjaGlsZHJlbkxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbkxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGlsZEFycmF5W2ldID0gYXJndW1lbnRzW2kgKyAyXTtcbiAgICB9XG4gICAge1xuICAgICAgaWYgKE9iamVjdC5mcmVlemUpIHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZShjaGlsZEFycmF5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZEFycmF5O1xuICB9XG5cbiAgLy8gUmVzb2x2ZSBkZWZhdWx0IHByb3BzXG4gIGlmICh0eXBlICYmIHR5cGUuZGVmYXVsdFByb3BzKSB7XG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHR5cGUuZGVmYXVsdFByb3BzO1xuICAgIGZvciAocHJvcE5hbWUgaW4gZGVmYXVsdFByb3BzKSB7XG4gICAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gZGVmYXVsdFByb3BzW3Byb3BOYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAge1xuICAgIGlmIChrZXkgfHwgcmVmKSB7XG4gICAgICB2YXIgZGlzcGxheU5hbWUgPSB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJyA/IHR5cGUuZGlzcGxheU5hbWUgfHwgdHlwZS5uYW1lIHx8ICdVbmtub3duJyA6IHR5cGU7XG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIGRlZmluZUtleVByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSk7XG4gICAgICB9XG4gICAgICBpZiAocmVmKSB7XG4gICAgICAgIGRlZmluZVJlZlByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBSZWFjdEVsZW1lbnQodHlwZSwga2V5LCByZWYsIHNlbGYsIHNvdXJjZSwgUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCwgcHJvcHMpO1xufVxuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcHJvZHVjZXMgUmVhY3RFbGVtZW50cyBvZiBhIGdpdmVuIHR5cGUuXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI2NyZWF0ZWZhY3RvcnlcbiAqL1xuXG5cbmZ1bmN0aW9uIGNsb25lQW5kUmVwbGFjZUtleShvbGRFbGVtZW50LCBuZXdLZXkpIHtcbiAgdmFyIG5ld0VsZW1lbnQgPSBSZWFjdEVsZW1lbnQob2xkRWxlbWVudC50eXBlLCBuZXdLZXksIG9sZEVsZW1lbnQucmVmLCBvbGRFbGVtZW50Ll9zZWxmLCBvbGRFbGVtZW50Ll9zb3VyY2UsIG9sZEVsZW1lbnQuX293bmVyLCBvbGRFbGVtZW50LnByb3BzKTtcblxuICByZXR1cm4gbmV3RWxlbWVudDtcbn1cblxuLyoqXG4gKiBDbG9uZSBhbmQgcmV0dXJuIGEgbmV3IFJlYWN0RWxlbWVudCB1c2luZyBlbGVtZW50IGFzIHRoZSBzdGFydGluZyBwb2ludC5cbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjY2xvbmVlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIGNsb25lRWxlbWVudChlbGVtZW50LCBjb25maWcsIGNoaWxkcmVuKSB7XG4gICEhKGVsZW1lbnQgPT09IG51bGwgfHwgZWxlbWVudCA9PT0gdW5kZWZpbmVkKSA/IGludmFyaWFudChmYWxzZSwgJ1JlYWN0LmNsb25lRWxlbWVudCguLi4pOiBUaGUgYXJndW1lbnQgbXVzdCBiZSBhIFJlYWN0IGVsZW1lbnQsIGJ1dCB5b3UgcGFzc2VkICVzLicsIGVsZW1lbnQpIDogdm9pZCAwO1xuXG4gIHZhciBwcm9wTmFtZSA9IHZvaWQgMDtcblxuICAvLyBPcmlnaW5hbCBwcm9wcyBhcmUgY29waWVkXG4gIHZhciBwcm9wcyA9IF9hc3NpZ24oe30sIGVsZW1lbnQucHJvcHMpO1xuXG4gIC8vIFJlc2VydmVkIG5hbWVzIGFyZSBleHRyYWN0ZWRcbiAgdmFyIGtleSA9IGVsZW1lbnQua2V5O1xuICB2YXIgcmVmID0gZWxlbWVudC5yZWY7XG4gIC8vIFNlbGYgaXMgcHJlc2VydmVkIHNpbmNlIHRoZSBvd25lciBpcyBwcmVzZXJ2ZWQuXG4gIHZhciBzZWxmID0gZWxlbWVudC5fc2VsZjtcbiAgLy8gU291cmNlIGlzIHByZXNlcnZlZCBzaW5jZSBjbG9uZUVsZW1lbnQgaXMgdW5saWtlbHkgdG8gYmUgdGFyZ2V0ZWQgYnkgYVxuICAvLyB0cmFuc3BpbGVyLCBhbmQgdGhlIG9yaWdpbmFsIHNvdXJjZSBpcyBwcm9iYWJseSBhIGJldHRlciBpbmRpY2F0b3Igb2YgdGhlXG4gIC8vIHRydWUgb3duZXIuXG4gIHZhciBzb3VyY2UgPSBlbGVtZW50Ll9zb3VyY2U7XG5cbiAgLy8gT3duZXIgd2lsbCBiZSBwcmVzZXJ2ZWQsIHVubGVzcyByZWYgaXMgb3ZlcnJpZGRlblxuICB2YXIgb3duZXIgPSBlbGVtZW50Ll9vd25lcjtcblxuICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICBpZiAoaGFzVmFsaWRSZWYoY29uZmlnKSkge1xuICAgICAgLy8gU2lsZW50bHkgc3RlYWwgdGhlIHJlZiBmcm9tIHRoZSBwYXJlbnQuXG4gICAgICByZWYgPSBjb25maWcucmVmO1xuICAgICAgb3duZXIgPSBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50O1xuICAgIH1cbiAgICBpZiAoaGFzVmFsaWRLZXkoY29uZmlnKSkge1xuICAgICAga2V5ID0gJycgKyBjb25maWcua2V5O1xuICAgIH1cblxuICAgIC8vIFJlbWFpbmluZyBwcm9wZXJ0aWVzIG92ZXJyaWRlIGV4aXN0aW5nIHByb3BzXG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHZvaWQgMDtcbiAgICBpZiAoZWxlbWVudC50eXBlICYmIGVsZW1lbnQudHlwZS5kZWZhdWx0UHJvcHMpIHtcbiAgICAgIGRlZmF1bHRQcm9wcyA9IGVsZW1lbnQudHlwZS5kZWZhdWx0UHJvcHM7XG4gICAgfVxuICAgIGZvciAocHJvcE5hbWUgaW4gY29uZmlnKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsIHByb3BOYW1lKSAmJiAhUkVTRVJWRURfUFJPUFMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgIGlmIChjb25maWdbcHJvcE5hbWVdID09PSB1bmRlZmluZWQgJiYgZGVmYXVsdFByb3BzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAvLyBSZXNvbHZlIGRlZmF1bHQgcHJvcHNcbiAgICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBkZWZhdWx0UHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDaGlsZHJlbiBjYW4gYmUgbW9yZSB0aGFuIG9uZSBhcmd1bWVudCwgYW5kIHRob3NlIGFyZSB0cmFuc2ZlcnJlZCBvbnRvXG4gIC8vIHRoZSBuZXdseSBhbGxvY2F0ZWQgcHJvcHMgb2JqZWN0LlxuICB2YXIgY2hpbGRyZW5MZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcbiAgaWYgKGNoaWxkcmVuTGVuZ3RoID09PSAxKSB7XG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgfSBlbHNlIGlmIChjaGlsZHJlbkxlbmd0aCA+IDEpIHtcbiAgICB2YXIgY2hpbGRBcnJheSA9IEFycmF5KGNoaWxkcmVuTGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuTGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkQXJyYXlbaV0gPSBhcmd1bWVudHNbaSArIDJdO1xuICAgIH1cbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkQXJyYXk7XG4gIH1cblxuICByZXR1cm4gUmVhY3RFbGVtZW50KGVsZW1lbnQudHlwZSwga2V5LCByZWYsIHNlbGYsIHNvdXJjZSwgb3duZXIsIHByb3BzKTtcbn1cblxuLyoqXG4gKiBWZXJpZmllcyB0aGUgb2JqZWN0IGlzIGEgUmVhY3RFbGVtZW50LlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNpc3ZhbGlkZWxlbWVudFxuICogQHBhcmFtIHs/b2JqZWN0fSBvYmplY3RcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgYG9iamVjdGAgaXMgYSBSZWFjdEVsZW1lbnQuXG4gKiBAZmluYWxcbiAqL1xuZnVuY3Rpb24gaXNWYWxpZEVsZW1lbnQob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QgIT09IG51bGwgJiYgb2JqZWN0LiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEU7XG59XG5cbnZhciBTRVBBUkFUT1IgPSAnLic7XG52YXIgU1VCU0VQQVJBVE9SID0gJzonO1xuXG4vKipcbiAqIEVzY2FwZSBhbmQgd3JhcCBrZXkgc28gaXQgaXMgc2FmZSB0byB1c2UgYXMgYSByZWFjdGlkXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSB0byBiZSBlc2NhcGVkLlxuICogQHJldHVybiB7c3RyaW5nfSB0aGUgZXNjYXBlZCBrZXkuXG4gKi9cbmZ1bmN0aW9uIGVzY2FwZShrZXkpIHtcbiAgdmFyIGVzY2FwZVJlZ2V4ID0gL1s9Ol0vZztcbiAgdmFyIGVzY2FwZXJMb29rdXAgPSB7XG4gICAgJz0nOiAnPTAnLFxuICAgICc6JzogJz0yJ1xuICB9O1xuICB2YXIgZXNjYXBlZFN0cmluZyA9ICgnJyArIGtleSkucmVwbGFjZShlc2NhcGVSZWdleCwgZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgcmV0dXJuIGVzY2FwZXJMb29rdXBbbWF0Y2hdO1xuICB9KTtcblxuICByZXR1cm4gJyQnICsgZXNjYXBlZFN0cmluZztcbn1cblxuLyoqXG4gKiBUT0RPOiBUZXN0IHRoYXQgYSBzaW5nbGUgY2hpbGQgYW5kIGFuIGFycmF5IHdpdGggb25lIGl0ZW0gaGF2ZSB0aGUgc2FtZSBrZXlcbiAqIHBhdHRlcm4uXG4gKi9cblxudmFyIGRpZFdhcm5BYm91dE1hcHMgPSBmYWxzZTtcblxudmFyIHVzZXJQcm92aWRlZEtleUVzY2FwZVJlZ2V4ID0gL1xcLysvZztcbmZ1bmN0aW9uIGVzY2FwZVVzZXJQcm92aWRlZEtleSh0ZXh0KSB7XG4gIHJldHVybiAoJycgKyB0ZXh0KS5yZXBsYWNlKHVzZXJQcm92aWRlZEtleUVzY2FwZVJlZ2V4LCAnJCYvJyk7XG59XG5cbnZhciBQT09MX1NJWkUgPSAxMDtcbnZhciB0cmF2ZXJzZUNvbnRleHRQb29sID0gW107XG5mdW5jdGlvbiBnZXRQb29sZWRUcmF2ZXJzZUNvbnRleHQobWFwUmVzdWx0LCBrZXlQcmVmaXgsIG1hcEZ1bmN0aW9uLCBtYXBDb250ZXh0KSB7XG4gIGlmICh0cmF2ZXJzZUNvbnRleHRQb29sLmxlbmd0aCkge1xuICAgIHZhciB0cmF2ZXJzZUNvbnRleHQgPSB0cmF2ZXJzZUNvbnRleHRQb29sLnBvcCgpO1xuICAgIHRyYXZlcnNlQ29udGV4dC5yZXN1bHQgPSBtYXBSZXN1bHQ7XG4gICAgdHJhdmVyc2VDb250ZXh0LmtleVByZWZpeCA9IGtleVByZWZpeDtcbiAgICB0cmF2ZXJzZUNvbnRleHQuZnVuYyA9IG1hcEZ1bmN0aW9uO1xuICAgIHRyYXZlcnNlQ29udGV4dC5jb250ZXh0ID0gbWFwQ29udGV4dDtcbiAgICB0cmF2ZXJzZUNvbnRleHQuY291bnQgPSAwO1xuICAgIHJldHVybiB0cmF2ZXJzZUNvbnRleHQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3VsdDogbWFwUmVzdWx0LFxuICAgICAga2V5UHJlZml4OiBrZXlQcmVmaXgsXG4gICAgICBmdW5jOiBtYXBGdW5jdGlvbixcbiAgICAgIGNvbnRleHQ6IG1hcENvbnRleHQsXG4gICAgICBjb3VudDogMFxuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVsZWFzZVRyYXZlcnNlQ29udGV4dCh0cmF2ZXJzZUNvbnRleHQpIHtcbiAgdHJhdmVyc2VDb250ZXh0LnJlc3VsdCA9IG51bGw7XG4gIHRyYXZlcnNlQ29udGV4dC5rZXlQcmVmaXggPSBudWxsO1xuICB0cmF2ZXJzZUNvbnRleHQuZnVuYyA9IG51bGw7XG4gIHRyYXZlcnNlQ29udGV4dC5jb250ZXh0ID0gbnVsbDtcbiAgdHJhdmVyc2VDb250ZXh0LmNvdW50ID0gMDtcbiAgaWYgKHRyYXZlcnNlQ29udGV4dFBvb2wubGVuZ3RoIDwgUE9PTF9TSVpFKSB7XG4gICAgdHJhdmVyc2VDb250ZXh0UG9vbC5wdXNoKHRyYXZlcnNlQ29udGV4dCk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7IXN0cmluZ30gbmFtZVNvRmFyIE5hbWUgb2YgdGhlIGtleSBwYXRoIHNvIGZhci5cbiAqIEBwYXJhbSB7IWZ1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayB0byBpbnZva2Ugd2l0aCBlYWNoIGNoaWxkIGZvdW5kLlxuICogQHBhcmFtIHs/Kn0gdHJhdmVyc2VDb250ZXh0IFVzZWQgdG8gcGFzcyBpbmZvcm1hdGlvbiB0aHJvdWdob3V0IHRoZSB0cmF2ZXJzYWxcbiAqIHByb2Nlc3MuXG4gKiBAcmV0dXJuIHshbnVtYmVyfSBUaGUgbnVtYmVyIG9mIGNoaWxkcmVuIGluIHRoaXMgc3VidHJlZS5cbiAqL1xuZnVuY3Rpb24gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoY2hpbGRyZW4sIG5hbWVTb0ZhciwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiBjaGlsZHJlbjtcblxuICBpZiAodHlwZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgLy8gQWxsIG9mIHRoZSBhYm92ZSBhcmUgcGVyY2VpdmVkIGFzIG51bGwuXG4gICAgY2hpbGRyZW4gPSBudWxsO1xuICB9XG5cbiAgdmFyIGludm9rZUNhbGxiYWNrID0gZmFsc2U7XG5cbiAgaWYgKGNoaWxkcmVuID09PSBudWxsKSB7XG4gICAgaW52b2tlQ2FsbGJhY2sgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGludm9rZUNhbGxiYWNrID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBzd2l0Y2ggKGNoaWxkcmVuLiQkdHlwZW9mKSB7XG4gICAgICAgICAgY2FzZSBSRUFDVF9FTEVNRU5UX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9QT1JUQUxfVFlQRTpcbiAgICAgICAgICAgIGludm9rZUNhbGxiYWNrID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChpbnZva2VDYWxsYmFjaykge1xuICAgIGNhbGxiYWNrKHRyYXZlcnNlQ29udGV4dCwgY2hpbGRyZW4sXG4gICAgLy8gSWYgaXQncyB0aGUgb25seSBjaGlsZCwgdHJlYXQgdGhlIG5hbWUgYXMgaWYgaXQgd2FzIHdyYXBwZWQgaW4gYW4gYXJyYXlcbiAgICAvLyBzbyB0aGF0IGl0J3MgY29uc2lzdGVudCBpZiB0aGUgbnVtYmVyIG9mIGNoaWxkcmVuIGdyb3dzLlxuICAgIG5hbWVTb0ZhciA9PT0gJycgPyBTRVBBUkFUT1IgKyBnZXRDb21wb25lbnRLZXkoY2hpbGRyZW4sIDApIDogbmFtZVNvRmFyKTtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIHZhciBjaGlsZCA9IHZvaWQgMDtcbiAgdmFyIG5leHROYW1lID0gdm9pZCAwO1xuICB2YXIgc3VidHJlZUNvdW50ID0gMDsgLy8gQ291bnQgb2YgY2hpbGRyZW4gZm91bmQgaW4gdGhlIGN1cnJlbnQgc3VidHJlZS5cbiAgdmFyIG5leHROYW1lUHJlZml4ID0gbmFtZVNvRmFyID09PSAnJyA/IFNFUEFSQVRPUiA6IG5hbWVTb0ZhciArIFNVQlNFUEFSQVRPUjtcblxuICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgbmV4dE5hbWUgPSBuZXh0TmFtZVByZWZpeCArIGdldENvbXBvbmVudEtleShjaGlsZCwgaSk7XG4gICAgICBzdWJ0cmVlQ291bnQgKz0gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoY2hpbGQsIG5leHROYW1lLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKGNoaWxkcmVuKTtcbiAgICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHtcbiAgICAgICAgLy8gV2FybiBhYm91dCB1c2luZyBNYXBzIGFzIGNoaWxkcmVuXG4gICAgICAgIGlmIChpdGVyYXRvckZuID09PSBjaGlsZHJlbi5lbnRyaWVzKSB7XG4gICAgICAgICAgIWRpZFdhcm5BYm91dE1hcHMgPyB3YXJuaW5nJDEoZmFsc2UsICdVc2luZyBNYXBzIGFzIGNoaWxkcmVuIGlzIHVuc3VwcG9ydGVkIGFuZCB3aWxsIGxpa2VseSB5aWVsZCAnICsgJ3VuZXhwZWN0ZWQgcmVzdWx0cy4gQ29udmVydCBpdCB0byBhIHNlcXVlbmNlL2l0ZXJhYmxlIG9mIGtleWVkICcgKyAnUmVhY3RFbGVtZW50cyBpbnN0ZWFkLicpIDogdm9pZCAwO1xuICAgICAgICAgIGRpZFdhcm5BYm91dE1hcHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChjaGlsZHJlbik7XG4gICAgICB2YXIgc3RlcCA9IHZvaWQgMDtcbiAgICAgIHZhciBpaSA9IDA7XG4gICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgIGNoaWxkID0gc3RlcC52YWx1ZTtcbiAgICAgICAgbmV4dE5hbWUgPSBuZXh0TmFtZVByZWZpeCArIGdldENvbXBvbmVudEtleShjaGlsZCwgaWkrKyk7XG4gICAgICAgIHN1YnRyZWVDb3VudCArPSB0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbChjaGlsZCwgbmV4dE5hbWUsIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHZhciBhZGRlbmR1bSA9ICcnO1xuICAgICAge1xuICAgICAgICBhZGRlbmR1bSA9ICcgSWYgeW91IG1lYW50IHRvIHJlbmRlciBhIGNvbGxlY3Rpb24gb2YgY2hpbGRyZW4sIHVzZSBhbiBhcnJheSAnICsgJ2luc3RlYWQuJyArIFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0U3RhY2tBZGRlbmR1bSgpO1xuICAgICAgfVxuICAgICAgdmFyIGNoaWxkcmVuU3RyaW5nID0gJycgKyBjaGlsZHJlbjtcbiAgICAgIGludmFyaWFudChmYWxzZSwgJ09iamVjdHMgYXJlIG5vdCB2YWxpZCBhcyBhIFJlYWN0IGNoaWxkIChmb3VuZDogJXMpLiVzJywgY2hpbGRyZW5TdHJpbmcgPT09ICdbb2JqZWN0IE9iamVjdF0nID8gJ29iamVjdCB3aXRoIGtleXMgeycgKyBPYmplY3Qua2V5cyhjaGlsZHJlbikuam9pbignLCAnKSArICd9JyA6IGNoaWxkcmVuU3RyaW5nLCBhZGRlbmR1bSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHN1YnRyZWVDb3VudDtcbn1cblxuLyoqXG4gKiBUcmF2ZXJzZXMgY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhcyBgcHJvcHMuY2hpbGRyZW5gLCBidXRcbiAqIG1pZ2h0IGFsc28gYmUgc3BlY2lmaWVkIHRocm91Z2ggYXR0cmlidXRlczpcbiAqXG4gKiAtIGB0cmF2ZXJzZUFsbENoaWxkcmVuKHRoaXMucHJvcHMuY2hpbGRyZW4sIC4uLilgXG4gKiAtIGB0cmF2ZXJzZUFsbENoaWxkcmVuKHRoaXMucHJvcHMubGVmdFBhbmVsQ2hpbGRyZW4sIC4uLilgXG4gKlxuICogVGhlIGB0cmF2ZXJzZUNvbnRleHRgIGlzIGFuIG9wdGlvbmFsIGFyZ3VtZW50IHRoYXQgaXMgcGFzc2VkIHRocm91Z2ggdGhlXG4gKiBlbnRpcmUgdHJhdmVyc2FsLiBJdCBjYW4gYmUgdXNlZCB0byBzdG9yZSBhY2N1bXVsYXRpb25zIG9yIGFueXRoaW5nIGVsc2UgdGhhdFxuICogdGhlIGNhbGxiYWNrIG1pZ2h0IGZpbmQgcmVsZXZhbnQuXG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBvYmplY3QuXG4gKiBAcGFyYW0geyFmdW5jdGlvbn0gY2FsbGJhY2sgVG8gaW52b2tlIHVwb24gdHJhdmVyc2luZyBlYWNoIGNoaWxkLlxuICogQHBhcmFtIHs/Kn0gdHJhdmVyc2VDb250ZXh0IENvbnRleHQgZm9yIHRyYXZlcnNhbC5cbiAqIEByZXR1cm4geyFudW1iZXJ9IFRoZSBudW1iZXIgb2YgY2hpbGRyZW4gaW4gdGhpcyBzdWJ0cmVlLlxuICovXG5mdW5jdGlvbiB0cmF2ZXJzZUFsbENoaWxkcmVuKGNoaWxkcmVuLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KSB7XG4gIGlmIChjaGlsZHJlbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoY2hpbGRyZW4sICcnLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KTtcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZSBhIGtleSBzdHJpbmcgdGhhdCBpZGVudGlmaWVzIGEgY29tcG9uZW50IHdpdGhpbiBhIHNldC5cbiAqXG4gKiBAcGFyYW0geyp9IGNvbXBvbmVudCBBIGNvbXBvbmVudCB0aGF0IGNvdWxkIGNvbnRhaW4gYSBtYW51YWwga2V5LlxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IEluZGV4IHRoYXQgaXMgdXNlZCBpZiBhIG1hbnVhbCBrZXkgaXMgbm90IHByb3ZpZGVkLlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBnZXRDb21wb25lbnRLZXkoY29tcG9uZW50LCBpbmRleCkge1xuICAvLyBEbyBzb21lIHR5cGVjaGVja2luZyBoZXJlIHNpbmNlIHdlIGNhbGwgdGhpcyBibGluZGx5LiBXZSB3YW50IHRvIGVuc3VyZVxuICAvLyB0aGF0IHdlIGRvbid0IGJsb2NrIHBvdGVudGlhbCBmdXR1cmUgRVMgQVBJcy5cbiAgaWYgKHR5cGVvZiBjb21wb25lbnQgPT09ICdvYmplY3QnICYmIGNvbXBvbmVudCAhPT0gbnVsbCAmJiBjb21wb25lbnQua2V5ICE9IG51bGwpIHtcbiAgICAvLyBFeHBsaWNpdCBrZXlcbiAgICByZXR1cm4gZXNjYXBlKGNvbXBvbmVudC5rZXkpO1xuICB9XG4gIC8vIEltcGxpY2l0IGtleSBkZXRlcm1pbmVkIGJ5IHRoZSBpbmRleCBpbiB0aGUgc2V0XG4gIHJldHVybiBpbmRleC50b1N0cmluZygzNik7XG59XG5cbmZ1bmN0aW9uIGZvckVhY2hTaW5nbGVDaGlsZChib29rS2VlcGluZywgY2hpbGQsIG5hbWUpIHtcbiAgdmFyIGZ1bmMgPSBib29rS2VlcGluZy5mdW5jLFxuICAgICAgY29udGV4dCA9IGJvb2tLZWVwaW5nLmNvbnRleHQ7XG5cbiAgZnVuYy5jYWxsKGNvbnRleHQsIGNoaWxkLCBib29rS2VlcGluZy5jb3VudCsrKTtcbn1cblxuLyoqXG4gKiBJdGVyYXRlcyB0aHJvdWdoIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW5mb3JlYWNoXG4gKlxuICogVGhlIHByb3ZpZGVkIGZvckVhY2hGdW5jKGNoaWxkLCBpbmRleCkgd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2hcbiAqIGxlYWYgY2hpbGQuXG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCosIGludCl9IGZvckVhY2hGdW5jXG4gKiBAcGFyYW0geyp9IGZvckVhY2hDb250ZXh0IENvbnRleHQgZm9yIGZvckVhY2hDb250ZXh0LlxuICovXG5mdW5jdGlvbiBmb3JFYWNoQ2hpbGRyZW4oY2hpbGRyZW4sIGZvckVhY2hGdW5jLCBmb3JFYWNoQ29udGV4dCkge1xuICBpZiAoY2hpbGRyZW4gPT0gbnVsbCkge1xuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuICB2YXIgdHJhdmVyc2VDb250ZXh0ID0gZ2V0UG9vbGVkVHJhdmVyc2VDb250ZXh0KG51bGwsIG51bGwsIGZvckVhY2hGdW5jLCBmb3JFYWNoQ29udGV4dCk7XG4gIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIGZvckVhY2hTaW5nbGVDaGlsZCwgdHJhdmVyc2VDb250ZXh0KTtcbiAgcmVsZWFzZVRyYXZlcnNlQ29udGV4dCh0cmF2ZXJzZUNvbnRleHQpO1xufVxuXG5mdW5jdGlvbiBtYXBTaW5nbGVDaGlsZEludG9Db250ZXh0KGJvb2tLZWVwaW5nLCBjaGlsZCwgY2hpbGRLZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGJvb2tLZWVwaW5nLnJlc3VsdCxcbiAgICAgIGtleVByZWZpeCA9IGJvb2tLZWVwaW5nLmtleVByZWZpeCxcbiAgICAgIGZ1bmMgPSBib29rS2VlcGluZy5mdW5jLFxuICAgICAgY29udGV4dCA9IGJvb2tLZWVwaW5nLmNvbnRleHQ7XG5cblxuICB2YXIgbWFwcGVkQ2hpbGQgPSBmdW5jLmNhbGwoY29udGV4dCwgY2hpbGQsIGJvb2tLZWVwaW5nLmNvdW50KyspO1xuICBpZiAoQXJyYXkuaXNBcnJheShtYXBwZWRDaGlsZCkpIHtcbiAgICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKG1hcHBlZENoaWxkLCByZXN1bHQsIGNoaWxkS2V5LCBmdW5jdGlvbiAoYykge1xuICAgICAgcmV0dXJuIGM7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAobWFwcGVkQ2hpbGQgIT0gbnVsbCkge1xuICAgIGlmIChpc1ZhbGlkRWxlbWVudChtYXBwZWRDaGlsZCkpIHtcbiAgICAgIG1hcHBlZENoaWxkID0gY2xvbmVBbmRSZXBsYWNlS2V5KG1hcHBlZENoaWxkLFxuICAgICAgLy8gS2VlcCBib3RoIHRoZSAobWFwcGVkKSBhbmQgb2xkIGtleXMgaWYgdGhleSBkaWZmZXIsIGp1c3QgYXNcbiAgICAgIC8vIHRyYXZlcnNlQWxsQ2hpbGRyZW4gdXNlZCB0byBkbyBmb3Igb2JqZWN0cyBhcyBjaGlsZHJlblxuICAgICAga2V5UHJlZml4ICsgKG1hcHBlZENoaWxkLmtleSAmJiAoIWNoaWxkIHx8IGNoaWxkLmtleSAhPT0gbWFwcGVkQ2hpbGQua2V5KSA/IGVzY2FwZVVzZXJQcm92aWRlZEtleShtYXBwZWRDaGlsZC5rZXkpICsgJy8nIDogJycpICsgY2hpbGRLZXkpO1xuICAgIH1cbiAgICByZXN1bHQucHVzaChtYXBwZWRDaGlsZCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChjaGlsZHJlbiwgYXJyYXksIHByZWZpeCwgZnVuYywgY29udGV4dCkge1xuICB2YXIgZXNjYXBlZFByZWZpeCA9ICcnO1xuICBpZiAocHJlZml4ICE9IG51bGwpIHtcbiAgICBlc2NhcGVkUHJlZml4ID0gZXNjYXBlVXNlclByb3ZpZGVkS2V5KHByZWZpeCkgKyAnLyc7XG4gIH1cbiAgdmFyIHRyYXZlcnNlQ29udGV4dCA9IGdldFBvb2xlZFRyYXZlcnNlQ29udGV4dChhcnJheSwgZXNjYXBlZFByZWZpeCwgZnVuYywgY29udGV4dCk7XG4gIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIG1hcFNpbmdsZUNoaWxkSW50b0NvbnRleHQsIHRyYXZlcnNlQ29udGV4dCk7XG4gIHJlbGVhc2VUcmF2ZXJzZUNvbnRleHQodHJhdmVyc2VDb250ZXh0KTtcbn1cblxuLyoqXG4gKiBNYXBzIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW5tYXBcbiAqXG4gKiBUaGUgcHJvdmlkZWQgbWFwRnVuY3Rpb24oY2hpbGQsIGtleSwgaW5kZXgpIHdpbGwgYmUgY2FsbGVkIGZvciBlYWNoXG4gKiBsZWFmIGNoaWxkLlxuICpcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgY29udGFpbmVyLlxuICogQHBhcmFtIHtmdW5jdGlvbigqLCBpbnQpfSBmdW5jIFRoZSBtYXAgZnVuY3Rpb24uXG4gKiBAcGFyYW0geyp9IGNvbnRleHQgQ29udGV4dCBmb3IgbWFwRnVuY3Rpb24uXG4gKiBAcmV0dXJuIHtvYmplY3R9IE9iamVjdCBjb250YWluaW5nIHRoZSBvcmRlcmVkIG1hcCBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBtYXBDaGlsZHJlbihjaGlsZHJlbiwgZnVuYywgY29udGV4dCkge1xuICBpZiAoY2hpbGRyZW4gPT0gbnVsbCkge1xuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWwoY2hpbGRyZW4sIHJlc3VsdCwgbnVsbCwgZnVuYywgY29udGV4dCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ291bnQgdGhlIG51bWJlciBvZiBjaGlsZHJlbiB0aGF0IGFyZSB0eXBpY2FsbHkgc3BlY2lmaWVkIGFzXG4gKiBgcHJvcHMuY2hpbGRyZW5gLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbmNvdW50XG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBudW1iZXIgb2YgY2hpbGRyZW4uXG4gKi9cbmZ1bmN0aW9uIGNvdW50Q2hpbGRyZW4oY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSwgbnVsbCk7XG59XG5cbi8qKlxuICogRmxhdHRlbiBhIGNoaWxkcmVuIG9iamVjdCAodHlwaWNhbGx5IHNwZWNpZmllZCBhcyBgcHJvcHMuY2hpbGRyZW5gKSBhbmRcbiAqIHJldHVybiBhbiBhcnJheSB3aXRoIGFwcHJvcHJpYXRlbHkgcmUta2V5ZWQgY2hpbGRyZW4uXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVudG9hcnJheVxuICovXG5mdW5jdGlvbiB0b0FycmF5KGNoaWxkcmVuKSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChjaGlsZHJlbiwgcmVzdWx0LCBudWxsLCBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICByZXR1cm4gY2hpbGQ7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGZpcnN0IGNoaWxkIGluIGEgY29sbGVjdGlvbiBvZiBjaGlsZHJlbiBhbmQgdmVyaWZpZXMgdGhhdCB0aGVyZVxuICogaXMgb25seSBvbmUgY2hpbGQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVub25seVxuICpcbiAqIFRoZSBjdXJyZW50IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgZnVuY3Rpb24gYXNzdW1lcyB0aGF0IGEgc2luZ2xlIGNoaWxkIGdldHNcbiAqIHBhc3NlZCB3aXRob3V0IGEgd3JhcHBlciwgYnV0IHRoZSBwdXJwb3NlIG9mIHRoaXMgaGVscGVyIGZ1bmN0aW9uIGlzIHRvXG4gKiBhYnN0cmFjdCBhd2F5IHRoZSBwYXJ0aWN1bGFyIHN0cnVjdHVyZSBvZiBjaGlsZHJlbi5cbiAqXG4gKiBAcGFyYW0gez9vYmplY3R9IGNoaWxkcmVuIENoaWxkIGNvbGxlY3Rpb24gc3RydWN0dXJlLlxuICogQHJldHVybiB7UmVhY3RFbGVtZW50fSBUaGUgZmlyc3QgYW5kIG9ubHkgYFJlYWN0RWxlbWVudGAgY29udGFpbmVkIGluIHRoZVxuICogc3RydWN0dXJlLlxuICovXG5mdW5jdGlvbiBvbmx5Q2hpbGQoY2hpbGRyZW4pIHtcbiAgIWlzVmFsaWRFbGVtZW50KGNoaWxkcmVuKSA/IGludmFyaWFudChmYWxzZSwgJ1JlYWN0LkNoaWxkcmVuLm9ubHkgZXhwZWN0ZWQgdG8gcmVjZWl2ZSBhIHNpbmdsZSBSZWFjdCBlbGVtZW50IGNoaWxkLicpIDogdm9pZCAwO1xuICByZXR1cm4gY2hpbGRyZW47XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnRleHQoZGVmYXVsdFZhbHVlLCBjYWxjdWxhdGVDaGFuZ2VkQml0cykge1xuICBpZiAoY2FsY3VsYXRlQ2hhbmdlZEJpdHMgPT09IHVuZGVmaW5lZCkge1xuICAgIGNhbGN1bGF0ZUNoYW5nZWRCaXRzID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICB7XG4gICAgICAhKGNhbGN1bGF0ZUNoYW5nZWRCaXRzID09PSBudWxsIHx8IHR5cGVvZiBjYWxjdWxhdGVDaGFuZ2VkQml0cyA9PT0gJ2Z1bmN0aW9uJykgPyB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdjcmVhdGVDb250ZXh0OiBFeHBlY3RlZCB0aGUgb3B0aW9uYWwgc2Vjb25kIGFyZ3VtZW50IHRvIGJlIGEgJyArICdmdW5jdGlvbi4gSW5zdGVhZCByZWNlaXZlZDogJXMnLCBjYWxjdWxhdGVDaGFuZ2VkQml0cykgOiB2b2lkIDA7XG4gICAgfVxuICB9XG5cbiAgdmFyIGNvbnRleHQgPSB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0NPTlRFWFRfVFlQRSxcbiAgICBfY2FsY3VsYXRlQ2hhbmdlZEJpdHM6IGNhbGN1bGF0ZUNoYW5nZWRCaXRzLFxuICAgIC8vIEFzIGEgd29ya2Fyb3VuZCB0byBzdXBwb3J0IG11bHRpcGxlIGNvbmN1cnJlbnQgcmVuZGVyZXJzLCB3ZSBjYXRlZ29yaXplXG4gICAgLy8gc29tZSByZW5kZXJlcnMgYXMgcHJpbWFyeSBhbmQgb3RoZXJzIGFzIHNlY29uZGFyeS4gV2Ugb25seSBleHBlY3RcbiAgICAvLyB0aGVyZSB0byBiZSB0d28gY29uY3VycmVudCByZW5kZXJlcnMgYXQgbW9zdDogUmVhY3QgTmF0aXZlIChwcmltYXJ5KSBhbmRcbiAgICAvLyBGYWJyaWMgKHNlY29uZGFyeSk7IFJlYWN0IERPTSAocHJpbWFyeSkgYW5kIFJlYWN0IEFSVCAoc2Vjb25kYXJ5KS5cbiAgICAvLyBTZWNvbmRhcnkgcmVuZGVyZXJzIHN0b3JlIHRoZWlyIGNvbnRleHQgdmFsdWVzIG9uIHNlcGFyYXRlIGZpZWxkcy5cbiAgICBfY3VycmVudFZhbHVlOiBkZWZhdWx0VmFsdWUsXG4gICAgX2N1cnJlbnRWYWx1ZTI6IGRlZmF1bHRWYWx1ZSxcbiAgICAvLyBVc2VkIHRvIHRyYWNrIGhvdyBtYW55IGNvbmN1cnJlbnQgcmVuZGVyZXJzIHRoaXMgY29udGV4dCBjdXJyZW50bHlcbiAgICAvLyBzdXBwb3J0cyB3aXRoaW4gaW4gYSBzaW5nbGUgcmVuZGVyZXIuIFN1Y2ggYXMgcGFyYWxsZWwgc2VydmVyIHJlbmRlcmluZy5cbiAgICBfdGhyZWFkQ291bnQ6IDAsXG4gICAgLy8gVGhlc2UgYXJlIGNpcmN1bGFyXG4gICAgUHJvdmlkZXI6IG51bGwsXG4gICAgQ29uc3VtZXI6IG51bGxcbiAgfTtcblxuICBjb250ZXh0LlByb3ZpZGVyID0ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9QUk9WSURFUl9UWVBFLFxuICAgIF9jb250ZXh0OiBjb250ZXh0XG4gIH07XG5cbiAgdmFyIGhhc1dhcm5lZEFib3V0VXNpbmdOZXN0ZWRDb250ZXh0Q29uc3VtZXJzID0gZmFsc2U7XG4gIHZhciBoYXNXYXJuZWRBYm91dFVzaW5nQ29uc3VtZXJQcm92aWRlciA9IGZhbHNlO1xuXG4gIHtcbiAgICAvLyBBIHNlcGFyYXRlIG9iamVjdCwgYnV0IHByb3hpZXMgYmFjayB0byB0aGUgb3JpZ2luYWwgY29udGV4dCBvYmplY3QgZm9yXG4gICAgLy8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuIEl0IGhhcyBhIGRpZmZlcmVudCAkJHR5cGVvZiwgc28gd2UgY2FuIHByb3Blcmx5XG4gICAgLy8gd2FybiBmb3IgdGhlIGluY29ycmVjdCB1c2FnZSBvZiBDb250ZXh0IGFzIGEgQ29uc3VtZXIuXG4gICAgdmFyIENvbnN1bWVyID0ge1xuICAgICAgJCR0eXBlb2Y6IFJFQUNUX0NPTlRFWFRfVFlQRSxcbiAgICAgIF9jb250ZXh0OiBjb250ZXh0LFxuICAgICAgX2NhbGN1bGF0ZUNoYW5nZWRCaXRzOiBjb250ZXh0Ll9jYWxjdWxhdGVDaGFuZ2VkQml0c1xuICAgIH07XG4gICAgLy8gJEZsb3dGaXhNZTogRmxvdyBjb21wbGFpbnMgYWJvdXQgbm90IHNldHRpbmcgYSB2YWx1ZSwgd2hpY2ggaXMgaW50ZW50aW9uYWwgaGVyZVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKENvbnN1bWVyLCB7XG4gICAgICBQcm92aWRlcjoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIWhhc1dhcm5lZEFib3V0VXNpbmdDb25zdW1lclByb3ZpZGVyKSB7XG4gICAgICAgICAgICBoYXNXYXJuZWRBYm91dFVzaW5nQ29uc3VtZXJQcm92aWRlciA9IHRydWU7XG4gICAgICAgICAgICB3YXJuaW5nJDEoZmFsc2UsICdSZW5kZXJpbmcgPENvbnRleHQuQ29uc3VtZXIuUHJvdmlkZXI+IGlzIG5vdCBzdXBwb3J0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiAnICsgJ2EgZnV0dXJlIG1ham9yIHJlbGVhc2UuIERpZCB5b3UgbWVhbiB0byByZW5kZXIgPENvbnRleHQuUHJvdmlkZXI+IGluc3RlYWQ/Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjb250ZXh0LlByb3ZpZGVyO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChfUHJvdmlkZXIpIHtcbiAgICAgICAgICBjb250ZXh0LlByb3ZpZGVyID0gX1Byb3ZpZGVyO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX2N1cnJlbnRWYWx1ZToge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY29udGV4dC5fY3VycmVudFZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChfY3VycmVudFZhbHVlKSB7XG4gICAgICAgICAgY29udGV4dC5fY3VycmVudFZhbHVlID0gX2N1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF9jdXJyZW50VmFsdWUyOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0Ll9jdXJyZW50VmFsdWUyO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChfY3VycmVudFZhbHVlMikge1xuICAgICAgICAgIGNvbnRleHQuX2N1cnJlbnRWYWx1ZTIgPSBfY3VycmVudFZhbHVlMjtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF90aHJlYWRDb3VudDoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY29udGV4dC5fdGhyZWFkQ291bnQ7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKF90aHJlYWRDb3VudCkge1xuICAgICAgICAgIGNvbnRleHQuX3RocmVhZENvdW50ID0gX3RocmVhZENvdW50O1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgQ29uc3VtZXI6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFoYXNXYXJuZWRBYm91dFVzaW5nTmVzdGVkQ29udGV4dENvbnN1bWVycykge1xuICAgICAgICAgICAgaGFzV2FybmVkQWJvdXRVc2luZ05lc3RlZENvbnRleHRDb25zdW1lcnMgPSB0cnVlO1xuICAgICAgICAgICAgd2FybmluZyQxKGZhbHNlLCAnUmVuZGVyaW5nIDxDb250ZXh0LkNvbnN1bWVyLkNvbnN1bWVyPiBpcyBub3Qgc3VwcG9ydGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gJyArICdhIGZ1dHVyZSBtYWpvciByZWxlYXNlLiBEaWQgeW91IG1lYW4gdG8gcmVuZGVyIDxDb250ZXh0LkNvbnN1bWVyPiBpbnN0ZWFkPycpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY29udGV4dC5Db25zdW1lcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIC8vICRGbG93Rml4TWU6IEZsb3cgY29tcGxhaW5zIGFib3V0IG1pc3NpbmcgcHJvcGVydGllcyBiZWNhdXNlIGl0IGRvZXNuJ3QgdW5kZXJzdGFuZCBkZWZpbmVQcm9wZXJ0eVxuICAgIGNvbnRleHQuQ29uc3VtZXIgPSBDb25zdW1lcjtcbiAgfVxuXG4gIHtcbiAgICBjb250ZXh0Ll9jdXJyZW50UmVuZGVyZXIgPSBudWxsO1xuICAgIGNvbnRleHQuX2N1cnJlbnRSZW5kZXJlcjIgPSBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5cbmZ1bmN0aW9uIGxhenkoY3Rvcikge1xuICB2YXIgbGF6eVR5cGUgPSB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0xBWllfVFlQRSxcbiAgICBfY3RvcjogY3RvcixcbiAgICAvLyBSZWFjdCB1c2VzIHRoZXNlIGZpZWxkcyB0byBzdG9yZSB0aGUgcmVzdWx0LlxuICAgIF9zdGF0dXM6IC0xLFxuICAgIF9yZXN1bHQ6IG51bGxcbiAgfTtcblxuICB7XG4gICAgLy8gSW4gcHJvZHVjdGlvbiwgdGhpcyB3b3VsZCBqdXN0IHNldCBpdCBvbiB0aGUgb2JqZWN0LlxuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB2b2lkIDA7XG4gICAgdmFyIHByb3BUeXBlcyA9IHZvaWQgMDtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhsYXp5VHlwZSwge1xuICAgICAgZGVmYXVsdFByb3BzOiB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGRlZmF1bHRQcm9wcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmV3RGVmYXVsdFByb3BzKSB7XG4gICAgICAgICAgd2FybmluZyQxKGZhbHNlLCAnUmVhY3QubGF6eSguLi4pOiBJdCBpcyBub3Qgc3VwcG9ydGVkIHRvIGFzc2lnbiBgZGVmYXVsdFByb3BzYCB0byAnICsgJ2EgbGF6eSBjb21wb25lbnQgaW1wb3J0LiBFaXRoZXIgc3BlY2lmeSB0aGVtIHdoZXJlIHRoZSBjb21wb25lbnQgJyArICdpcyBkZWZpbmVkLCBvciBjcmVhdGUgYSB3cmFwcGluZyBjb21wb25lbnQgYXJvdW5kIGl0LicpO1xuICAgICAgICAgIGRlZmF1bHRQcm9wcyA9IG5ld0RlZmF1bHRQcm9wcztcbiAgICAgICAgICAvLyBNYXRjaCBwcm9kdWN0aW9uIGJlaGF2aW9yIG1vcmUgY2xvc2VseTpcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobGF6eVR5cGUsICdkZWZhdWx0UHJvcHMnLCB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcFR5cGVzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdQcm9wVHlwZXMpIHtcbiAgICAgICAgICB3YXJuaW5nJDEoZmFsc2UsICdSZWFjdC5sYXp5KC4uLik6IEl0IGlzIG5vdCBzdXBwb3J0ZWQgdG8gYXNzaWduIGBwcm9wVHlwZXNgIHRvICcgKyAnYSBsYXp5IGNvbXBvbmVudCBpbXBvcnQuIEVpdGhlciBzcGVjaWZ5IHRoZW0gd2hlcmUgdGhlIGNvbXBvbmVudCAnICsgJ2lzIGRlZmluZWQsIG9yIGNyZWF0ZSBhIHdyYXBwaW5nIGNvbXBvbmVudCBhcm91bmQgaXQuJyk7XG4gICAgICAgICAgcHJvcFR5cGVzID0gbmV3UHJvcFR5cGVzO1xuICAgICAgICAgIC8vIE1hdGNoIHByb2R1Y3Rpb24gYmVoYXZpb3IgbW9yZSBjbG9zZWx5OlxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsYXp5VHlwZSwgJ3Byb3BUeXBlcycsIHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGxhenlUeXBlO1xufVxuXG5mdW5jdGlvbiBmb3J3YXJkUmVmKHJlbmRlcikge1xuICB7XG4gICAgaWYgKHJlbmRlciAhPSBudWxsICYmIHJlbmRlci4kJHR5cGVvZiA9PT0gUkVBQ1RfTUVNT19UWVBFKSB7XG4gICAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdmb3J3YXJkUmVmIHJlcXVpcmVzIGEgcmVuZGVyIGZ1bmN0aW9uIGJ1dCByZWNlaXZlZCBhIGBtZW1vYCAnICsgJ2NvbXBvbmVudC4gSW5zdGVhZCBvZiBmb3J3YXJkUmVmKG1lbW8oLi4uKSksIHVzZSAnICsgJ21lbW8oZm9yd2FyZFJlZiguLi4pKS4nKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiByZW5kZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ2ZvcndhcmRSZWYgcmVxdWlyZXMgYSByZW5kZXIgZnVuY3Rpb24gYnV0IHdhcyBnaXZlbiAlcy4nLCByZW5kZXIgPT09IG51bGwgPyAnbnVsbCcgOiB0eXBlb2YgcmVuZGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgIShcbiAgICAgIC8vIERvIG5vdCB3YXJuIGZvciAwIGFyZ3VtZW50cyBiZWNhdXNlIGl0IGNvdWxkIGJlIGR1ZSB0byB1c2FnZSBvZiB0aGUgJ2FyZ3VtZW50cycgb2JqZWN0XG4gICAgICByZW5kZXIubGVuZ3RoID09PSAwIHx8IHJlbmRlci5sZW5ndGggPT09IDIpID8gd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnZm9yd2FyZFJlZiByZW5kZXIgZnVuY3Rpb25zIGFjY2VwdCBleGFjdGx5IHR3byBwYXJhbWV0ZXJzOiBwcm9wcyBhbmQgcmVmLiAlcycsIHJlbmRlci5sZW5ndGggPT09IDEgPyAnRGlkIHlvdSBmb3JnZXQgdG8gdXNlIHRoZSByZWYgcGFyYW1ldGVyPycgOiAnQW55IGFkZGl0aW9uYWwgcGFyYW1ldGVyIHdpbGwgYmUgdW5kZWZpbmVkLicpIDogdm9pZCAwO1xuICAgIH1cblxuICAgIGlmIChyZW5kZXIgIT0gbnVsbCkge1xuICAgICAgIShyZW5kZXIuZGVmYXVsdFByb3BzID09IG51bGwgJiYgcmVuZGVyLnByb3BUeXBlcyA9PSBudWxsKSA/IHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ2ZvcndhcmRSZWYgcmVuZGVyIGZ1bmN0aW9ucyBkbyBub3Qgc3VwcG9ydCBwcm9wVHlwZXMgb3IgZGVmYXVsdFByb3BzLiAnICsgJ0RpZCB5b3UgYWNjaWRlbnRhbGx5IHBhc3MgYSBSZWFjdCBjb21wb25lbnQ/JykgOiB2b2lkIDA7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSxcbiAgICByZW5kZXI6IHJlbmRlclxuICB9O1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSkge1xuICByZXR1cm4gdHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nIHx8XG4gIC8vIE5vdGU6IGl0cyB0eXBlb2YgbWlnaHQgYmUgb3RoZXIgdGhhbiAnc3ltYm9sJyBvciAnbnVtYmVyJyBpZiBpdCdzIGEgcG9seWZpbGwuXG4gIHR5cGUgPT09IFJFQUNUX0ZSQUdNRU5UX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfUFJPRklMRVJfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NVU1BFTlNFX1RZUEUgfHwgdHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmIHR5cGUgIT09IG51bGwgJiYgKHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0xBWllfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfUFJPVklERVJfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9DT05URVhUX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSk7XG59XG5cbmZ1bmN0aW9uIG1lbW8odHlwZSwgY29tcGFyZSkge1xuICB7XG4gICAgaWYgKCFpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSkpIHtcbiAgICAgIHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ21lbW86IFRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgY29tcG9uZW50LiBJbnN0ZWFkICcgKyAncmVjZWl2ZWQ6ICVzJywgdHlwZSA9PT0gbnVsbCA/ICdudWxsJyA6IHR5cGVvZiB0eXBlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfTUVNT19UWVBFLFxuICAgIHR5cGU6IHR5cGUsXG4gICAgY29tcGFyZTogY29tcGFyZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGNvbXBhcmVcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZURpc3BhdGNoZXIoKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gUmVhY3RDdXJyZW50T3duZXIuY3VycmVudERpc3BhdGNoZXI7XG4gICEoZGlzcGF0Y2hlciAhPT0gbnVsbCkgPyBpbnZhcmlhbnQoZmFsc2UsICdIb29rcyBjYW4gb25seSBiZSBjYWxsZWQgaW5zaWRlIHRoZSBib2R5IG9mIGEgZnVuY3Rpb24gY29tcG9uZW50LicpIDogdm9pZCAwO1xuICByZXR1cm4gZGlzcGF0Y2hlcjtcbn1cblxuZnVuY3Rpb24gdXNlQ29udGV4dChDb250ZXh0LCBvYnNlcnZlZEJpdHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICB7XG4gICAgLy8gVE9ETzogYWRkIGEgbW9yZSBnZW5lcmljIHdhcm5pbmcgZm9yIGludmFsaWQgdmFsdWVzLlxuICAgIGlmIChDb250ZXh0Ll9jb250ZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciByZWFsQ29udGV4dCA9IENvbnRleHQuX2NvbnRleHQ7XG4gICAgICAvLyBEb24ndCBkZWR1cGxpY2F0ZSBiZWNhdXNlIHRoaXMgbGVnaXRpbWF0ZWx5IGNhdXNlcyBidWdzXG4gICAgICAvLyBhbmQgbm9ib2R5IHNob3VsZCBiZSB1c2luZyB0aGlzIGluIGV4aXN0aW5nIGNvZGUuXG4gICAgICBpZiAocmVhbENvbnRleHQuQ29uc3VtZXIgPT09IENvbnRleHQpIHtcbiAgICAgICAgd2FybmluZyQxKGZhbHNlLCAnQ2FsbGluZyB1c2VDb250ZXh0KENvbnRleHQuQ29uc3VtZXIpIGlzIG5vdCBzdXBwb3J0ZWQsIG1heSBjYXVzZSBidWdzLCBhbmQgd2lsbCBiZSAnICsgJ3JlbW92ZWQgaW4gYSBmdXR1cmUgbWFqb3IgcmVsZWFzZS4gRGlkIHlvdSBtZWFuIHRvIGNhbGwgdXNlQ29udGV4dChDb250ZXh0KSBpbnN0ZWFkPycpO1xuICAgICAgfSBlbHNlIGlmIChyZWFsQ29udGV4dC5Qcm92aWRlciA9PT0gQ29udGV4dCkge1xuICAgICAgICB3YXJuaW5nJDEoZmFsc2UsICdDYWxsaW5nIHVzZUNvbnRleHQoQ29udGV4dC5Qcm92aWRlcikgaXMgbm90IHN1cHBvcnRlZC4gJyArICdEaWQgeW91IG1lYW4gdG8gY2FsbCB1c2VDb250ZXh0KENvbnRleHQpIGluc3RlYWQ/Jyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUNvbnRleHQoQ29udGV4dCwgb2JzZXJ2ZWRCaXRzKTtcbn1cblxuZnVuY3Rpb24gdXNlU3RhdGUoaW5pdGlhbFN0YXRlKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlU3RhdGUoaW5pdGlhbFN0YXRlKTtcbn1cblxuZnVuY3Rpb24gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsU3RhdGUsIGluaXRpYWxBY3Rpb24pIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VSZWR1Y2VyKHJlZHVjZXIsIGluaXRpYWxTdGF0ZSwgaW5pdGlhbEFjdGlvbik7XG59XG5cbmZ1bmN0aW9uIHVzZVJlZihpbml0aWFsVmFsdWUpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VSZWYoaW5pdGlhbFZhbHVlKTtcbn1cblxuZnVuY3Rpb24gdXNlRWZmZWN0KGNyZWF0ZSwgaW5wdXRzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlRWZmZWN0KGNyZWF0ZSwgaW5wdXRzKTtcbn1cblxuZnVuY3Rpb24gdXNlTGF5b3V0RWZmZWN0KGNyZWF0ZSwgaW5wdXRzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlTGF5b3V0RWZmZWN0KGNyZWF0ZSwgaW5wdXRzKTtcbn1cblxuZnVuY3Rpb24gdXNlQ2FsbGJhY2soY2FsbGJhY2ssIGlucHV0cykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUNhbGxiYWNrKGNhbGxiYWNrLCBpbnB1dHMpO1xufVxuXG5mdW5jdGlvbiB1c2VNZW1vKGNyZWF0ZSwgaW5wdXRzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlTWVtbyhjcmVhdGUsIGlucHV0cyk7XG59XG5cbmZ1bmN0aW9uIHVzZUltcGVyYXRpdmVNZXRob2RzKHJlZiwgY3JlYXRlLCBpbnB1dHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VJbXBlcmF0aXZlTWV0aG9kcyhyZWYsIGNyZWF0ZSwgaW5wdXRzKTtcbn1cblxuLyoqXG4gKiBSZWFjdEVsZW1lbnRWYWxpZGF0b3IgcHJvdmlkZXMgYSB3cmFwcGVyIGFyb3VuZCBhIGVsZW1lbnQgZmFjdG9yeVxuICogd2hpY2ggdmFsaWRhdGVzIHRoZSBwcm9wcyBwYXNzZWQgdG8gdGhlIGVsZW1lbnQuIFRoaXMgaXMgaW50ZW5kZWQgdG8gYmVcbiAqIHVzZWQgb25seSBpbiBERVYgYW5kIGNvdWxkIGJlIHJlcGxhY2VkIGJ5IGEgc3RhdGljIHR5cGUgY2hlY2tlciBmb3IgbGFuZ3VhZ2VzXG4gKiB0aGF0IHN1cHBvcnQgaXQuXG4gKi9cblxudmFyIHByb3BUeXBlc01pc3NwZWxsV2FybmluZ1Nob3duID0gdm9pZCAwO1xuXG57XG4gIHByb3BUeXBlc01pc3NwZWxsV2FybmluZ1Nob3duID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bSgpIHtcbiAgaWYgKFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQpIHtcbiAgICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWUoUmVhY3RDdXJyZW50T3duZXIuY3VycmVudC50eXBlKTtcbiAgICBpZiAobmFtZSkge1xuICAgICAgcmV0dXJuICdcXG5cXG5DaGVjayB0aGUgcmVuZGVyIG1ldGhvZCBvZiBgJyArIG5hbWUgKyAnYC4nO1xuICAgIH1cbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIGdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtKGVsZW1lbnRQcm9wcykge1xuICBpZiAoZWxlbWVudFByb3BzICE9PSBudWxsICYmIGVsZW1lbnRQcm9wcyAhPT0gdW5kZWZpbmVkICYmIGVsZW1lbnRQcm9wcy5fX3NvdXJjZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIHNvdXJjZSA9IGVsZW1lbnRQcm9wcy5fX3NvdXJjZTtcbiAgICB2YXIgZmlsZU5hbWUgPSBzb3VyY2UuZmlsZU5hbWUucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpO1xuICAgIHZhciBsaW5lTnVtYmVyID0gc291cmNlLmxpbmVOdW1iZXI7XG4gICAgcmV0dXJuICdcXG5cXG5DaGVjayB5b3VyIGNvZGUgYXQgJyArIGZpbGVOYW1lICsgJzonICsgbGluZU51bWJlciArICcuJztcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbi8qKlxuICogV2FybiBpZiB0aGVyZSdzIG5vIGtleSBleHBsaWNpdGx5IHNldCBvbiBkeW5hbWljIGFycmF5cyBvZiBjaGlsZHJlbiBvclxuICogb2JqZWN0IGtleXMgYXJlIG5vdCB2YWxpZC4gVGhpcyBhbGxvd3MgdXMgdG8ga2VlcCB0cmFjayBvZiBjaGlsZHJlbiBiZXR3ZWVuXG4gKiB1cGRhdGVzLlxuICovXG52YXIgb3duZXJIYXNLZXlVc2VXYXJuaW5nID0ge307XG5cbmZ1bmN0aW9uIGdldEN1cnJlbnRDb21wb25lbnRFcnJvckluZm8ocGFyZW50VHlwZSkge1xuICB2YXIgaW5mbyA9IGdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bSgpO1xuXG4gIGlmICghaW5mbykge1xuICAgIHZhciBwYXJlbnROYW1lID0gdHlwZW9mIHBhcmVudFR5cGUgPT09ICdzdHJpbmcnID8gcGFyZW50VHlwZSA6IHBhcmVudFR5cGUuZGlzcGxheU5hbWUgfHwgcGFyZW50VHlwZS5uYW1lO1xuICAgIGlmIChwYXJlbnROYW1lKSB7XG4gICAgICBpbmZvID0gJ1xcblxcbkNoZWNrIHRoZSB0b3AtbGV2ZWwgcmVuZGVyIGNhbGwgdXNpbmcgPCcgKyBwYXJlbnROYW1lICsgJz4uJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGluZm87XG59XG5cbi8qKlxuICogV2FybiBpZiB0aGUgZWxlbWVudCBkb2Vzbid0IGhhdmUgYW4gZXhwbGljaXQga2V5IGFzc2lnbmVkIHRvIGl0LlxuICogVGhpcyBlbGVtZW50IGlzIGluIGFuIGFycmF5LiBUaGUgYXJyYXkgY291bGQgZ3JvdyBhbmQgc2hyaW5rIG9yIGJlXG4gKiByZW9yZGVyZWQuIEFsbCBjaGlsZHJlbiB0aGF0IGhhdmVuJ3QgYWxyZWFkeSBiZWVuIHZhbGlkYXRlZCBhcmUgcmVxdWlyZWQgdG9cbiAqIGhhdmUgYSBcImtleVwiIHByb3BlcnR5IGFzc2lnbmVkIHRvIGl0LiBFcnJvciBzdGF0dXNlcyBhcmUgY2FjaGVkIHNvIGEgd2FybmluZ1xuICogd2lsbCBvbmx5IGJlIHNob3duIG9uY2UuXG4gKlxuICogQGludGVybmFsXG4gKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHRoYXQgcmVxdWlyZXMgYSBrZXkuXG4gKiBAcGFyYW0geyp9IHBhcmVudFR5cGUgZWxlbWVudCdzIHBhcmVudCdzIHR5cGUuXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlRXhwbGljaXRLZXkoZWxlbWVudCwgcGFyZW50VHlwZSkge1xuICBpZiAoIWVsZW1lbnQuX3N0b3JlIHx8IGVsZW1lbnQuX3N0b3JlLnZhbGlkYXRlZCB8fCBlbGVtZW50LmtleSAhPSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGVsZW1lbnQuX3N0b3JlLnZhbGlkYXRlZCA9IHRydWU7XG5cbiAgdmFyIGN1cnJlbnRDb21wb25lbnRFcnJvckluZm8gPSBnZXRDdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvKHBhcmVudFR5cGUpO1xuICBpZiAob3duZXJIYXNLZXlVc2VXYXJuaW5nW2N1cnJlbnRDb21wb25lbnRFcnJvckluZm9dKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIG93bmVySGFzS2V5VXNlV2FybmluZ1tjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvXSA9IHRydWU7XG5cbiAgLy8gVXN1YWxseSB0aGUgY3VycmVudCBvd25lciBpcyB0aGUgb2ZmZW5kZXIsIGJ1dCBpZiBpdCBhY2NlcHRzIGNoaWxkcmVuIGFzIGFcbiAgLy8gcHJvcGVydHksIGl0IG1heSBiZSB0aGUgY3JlYXRvciBvZiB0aGUgY2hpbGQgdGhhdCdzIHJlc3BvbnNpYmxlIGZvclxuICAvLyBhc3NpZ25pbmcgaXQgYSBrZXkuXG4gIHZhciBjaGlsZE93bmVyID0gJyc7XG4gIGlmIChlbGVtZW50ICYmIGVsZW1lbnQuX293bmVyICYmIGVsZW1lbnQuX293bmVyICE9PSBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50KSB7XG4gICAgLy8gR2l2ZSB0aGUgY29tcG9uZW50IHRoYXQgb3JpZ2luYWxseSBjcmVhdGVkIHRoaXMgY2hpbGQuXG4gICAgY2hpbGRPd25lciA9ICcgSXQgd2FzIHBhc3NlZCBhIGNoaWxkIGZyb20gJyArIGdldENvbXBvbmVudE5hbWUoZWxlbWVudC5fb3duZXIudHlwZSkgKyAnLic7XG4gIH1cblxuICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChlbGVtZW50KTtcbiAge1xuICAgIHdhcm5pbmckMShmYWxzZSwgJ0VhY2ggY2hpbGQgaW4gYW4gYXJyYXkgb3IgaXRlcmF0b3Igc2hvdWxkIGhhdmUgYSB1bmlxdWUgXCJrZXlcIiBwcm9wLicgKyAnJXMlcyBTZWUgaHR0cHM6Ly9mYi5tZS9yZWFjdC13YXJuaW5nLWtleXMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJywgY3VycmVudENvbXBvbmVudEVycm9ySW5mbywgY2hpbGRPd25lcik7XG4gIH1cbiAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQobnVsbCk7XG59XG5cbi8qKlxuICogRW5zdXJlIHRoYXQgZXZlcnkgZWxlbWVudCBlaXRoZXIgaXMgcGFzc2VkIGluIGEgc3RhdGljIGxvY2F0aW9uLCBpbiBhblxuICogYXJyYXkgd2l0aCBhbiBleHBsaWNpdCBrZXlzIHByb3BlcnR5IGRlZmluZWQsIG9yIGluIGFuIG9iamVjdCBsaXRlcmFsXG4gKiB3aXRoIHZhbGlkIGtleSBwcm9wZXJ0eS5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqIEBwYXJhbSB7UmVhY3ROb2RlfSBub2RlIFN0YXRpY2FsbHkgcGFzc2VkIGNoaWxkIG9mIGFueSB0eXBlLlxuICogQHBhcmFtIHsqfSBwYXJlbnRUeXBlIG5vZGUncyBwYXJlbnQncyB0eXBlLlxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZUNoaWxkS2V5cyhub2RlLCBwYXJlbnRUeXBlKSB7XG4gIGlmICh0eXBlb2Ygbm9kZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKEFycmF5LmlzQXJyYXkobm9kZSkpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGlsZCA9IG5vZGVbaV07XG4gICAgICBpZiAoaXNWYWxpZEVsZW1lbnQoY2hpbGQpKSB7XG4gICAgICAgIHZhbGlkYXRlRXhwbGljaXRLZXkoY2hpbGQsIHBhcmVudFR5cGUpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChpc1ZhbGlkRWxlbWVudChub2RlKSkge1xuICAgIC8vIFRoaXMgZWxlbWVudCB3YXMgcGFzc2VkIGluIGEgdmFsaWQgbG9jYXRpb24uXG4gICAgaWYgKG5vZGUuX3N0b3JlKSB7XG4gICAgICBub2RlLl9zdG9yZS52YWxpZGF0ZWQgPSB0cnVlO1xuICAgIH1cbiAgfSBlbHNlIGlmIChub2RlKSB7XG4gICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKG5vZGUpO1xuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gRW50cnkgaXRlcmF0b3JzIHVzZWQgdG8gcHJvdmlkZSBpbXBsaWNpdCBrZXlzLFxuICAgICAgLy8gYnV0IG5vdyB3ZSBwcmludCBhIHNlcGFyYXRlIHdhcm5pbmcgZm9yIHRoZW0gbGF0ZXIuXG4gICAgICBpZiAoaXRlcmF0b3JGbiAhPT0gbm9kZS5lbnRyaWVzKSB7XG4gICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChub2RlKTtcbiAgICAgICAgdmFyIHN0ZXAgPSB2b2lkIDA7XG4gICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICBpZiAoaXNWYWxpZEVsZW1lbnQoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhbGlkYXRlRXhwbGljaXRLZXkoc3RlcC52YWx1ZSwgcGFyZW50VHlwZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogR2l2ZW4gYW4gZWxlbWVudCwgdmFsaWRhdGUgdGhhdCBpdHMgcHJvcHMgZm9sbG93IHRoZSBwcm9wVHlwZXMgZGVmaW5pdGlvbixcbiAqIHByb3ZpZGVkIGJ5IHRoZSB0eXBlLlxuICpcbiAqIEBwYXJhbSB7UmVhY3RFbGVtZW50fSBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlUHJvcFR5cGVzKGVsZW1lbnQpIHtcbiAgdmFyIHR5cGUgPSBlbGVtZW50LnR5cGU7XG4gIGlmICh0eXBlID09PSBudWxsIHx8IHR5cGUgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG5hbWUgPSBnZXRDb21wb25lbnROYW1lKHR5cGUpO1xuICB2YXIgcHJvcFR5cGVzID0gdm9pZCAwO1xuICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBwcm9wVHlwZXMgPSB0eXBlLnByb3BUeXBlcztcbiAgfSBlbHNlIGlmICh0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgJiYgKHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgfHxcbiAgLy8gTm90ZTogTWVtbyBvbmx5IGNoZWNrcyBvdXRlciBwcm9wcyBoZXJlLlxuICAvLyBJbm5lciBwcm9wcyBhcmUgY2hlY2tlZCBpbiB0aGUgcmVjb25jaWxlci5cbiAgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTUVNT19UWVBFKSkge1xuICAgIHByb3BUeXBlcyA9IHR5cGUucHJvcFR5cGVzO1xuICB9IGVsc2Uge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAocHJvcFR5cGVzKSB7XG4gICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQoZWxlbWVudCk7XG4gICAgY2hlY2tQcm9wVHlwZXMocHJvcFR5cGVzLCBlbGVtZW50LnByb3BzLCAncHJvcCcsIG5hbWUsIFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0U3RhY2tBZGRlbmR1bSk7XG4gICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQobnVsbCk7XG4gIH0gZWxzZSBpZiAodHlwZS5Qcm9wVHlwZXMgIT09IHVuZGVmaW5lZCAmJiAhcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd24pIHtcbiAgICBwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93biA9IHRydWU7XG4gICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnQ29tcG9uZW50ICVzIGRlY2xhcmVkIGBQcm9wVHlwZXNgIGluc3RlYWQgb2YgYHByb3BUeXBlc2AuIERpZCB5b3UgbWlzc3BlbGwgdGhlIHByb3BlcnR5IGFzc2lnbm1lbnQ/JywgbmFtZSB8fCAnVW5rbm93bicpO1xuICB9XG4gIGlmICh0eXBlb2YgdHlwZS5nZXREZWZhdWx0UHJvcHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAhdHlwZS5nZXREZWZhdWx0UHJvcHMuaXNSZWFjdENsYXNzQXBwcm92ZWQgPyB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdnZXREZWZhdWx0UHJvcHMgaXMgb25seSB1c2VkIG9uIGNsYXNzaWMgUmVhY3QuY3JlYXRlQ2xhc3MgJyArICdkZWZpbml0aW9ucy4gVXNlIGEgc3RhdGljIHByb3BlcnR5IG5hbWVkIGBkZWZhdWx0UHJvcHNgIGluc3RlYWQuJykgOiB2b2lkIDA7XG4gIH1cbn1cblxuLyoqXG4gKiBHaXZlbiBhIGZyYWdtZW50LCB2YWxpZGF0ZSB0aGF0IGl0IGNhbiBvbmx5IGJlIHByb3ZpZGVkIHdpdGggZnJhZ21lbnQgcHJvcHNcbiAqIEBwYXJhbSB7UmVhY3RFbGVtZW50fSBmcmFnbWVudFxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZUZyYWdtZW50UHJvcHMoZnJhZ21lbnQpIHtcbiAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQoZnJhZ21lbnQpO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZnJhZ21lbnQucHJvcHMpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICBpZiAoa2V5ICE9PSAnY2hpbGRyZW4nICYmIGtleSAhPT0gJ2tleScpIHtcbiAgICAgIHdhcm5pbmckMShmYWxzZSwgJ0ludmFsaWQgcHJvcCBgJXNgIHN1cHBsaWVkIHRvIGBSZWFjdC5GcmFnbWVudGAuICcgKyAnUmVhY3QuRnJhZ21lbnQgY2FuIG9ubHkgaGF2ZSBga2V5YCBhbmQgYGNoaWxkcmVuYCBwcm9wcy4nLCBrZXkpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKGZyYWdtZW50LnJlZiAhPT0gbnVsbCkge1xuICAgIHdhcm5pbmckMShmYWxzZSwgJ0ludmFsaWQgYXR0cmlidXRlIGByZWZgIHN1cHBsaWVkIHRvIGBSZWFjdC5GcmFnbWVudGAuJyk7XG4gIH1cblxuICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChudWxsKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudFdpdGhWYWxpZGF0aW9uKHR5cGUsIHByb3BzLCBjaGlsZHJlbikge1xuICB2YXIgdmFsaWRUeXBlID0gaXNWYWxpZEVsZW1lbnRUeXBlKHR5cGUpO1xuXG4gIC8vIFdlIHdhcm4gaW4gdGhpcyBjYXNlIGJ1dCBkb24ndCB0aHJvdy4gV2UgZXhwZWN0IHRoZSBlbGVtZW50IGNyZWF0aW9uIHRvXG4gIC8vIHN1Y2NlZWQgYW5kIHRoZXJlIHdpbGwgbGlrZWx5IGJlIGVycm9ycyBpbiByZW5kZXIuXG4gIGlmICghdmFsaWRUeXBlKSB7XG4gICAgdmFyIGluZm8gPSAnJztcbiAgICBpZiAodHlwZSA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiB0eXBlICE9PSBudWxsICYmIE9iamVjdC5rZXlzKHR5cGUpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaW5mbyArPSAnIFlvdSBsaWtlbHkgZm9yZ290IHRvIGV4cG9ydCB5b3VyIGNvbXBvbmVudCBmcm9tIHRoZSBmaWxlICcgKyBcIml0J3MgZGVmaW5lZCBpbiwgb3IgeW91IG1pZ2h0IGhhdmUgbWl4ZWQgdXAgZGVmYXVsdCBhbmQgbmFtZWQgaW1wb3J0cy5cIjtcbiAgICB9XG5cbiAgICB2YXIgc291cmNlSW5mbyA9IGdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtKHByb3BzKTtcbiAgICBpZiAoc291cmNlSW5mbykge1xuICAgICAgaW5mbyArPSBzb3VyY2VJbmZvO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbmZvICs9IGdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bSgpO1xuICAgIH1cblxuICAgIHZhciB0eXBlU3RyaW5nID0gdm9pZCAwO1xuICAgIGlmICh0eXBlID09PSBudWxsKSB7XG4gICAgICB0eXBlU3RyaW5nID0gJ251bGwnO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0eXBlKSkge1xuICAgICAgdHlwZVN0cmluZyA9ICdhcnJheSc7XG4gICAgfSBlbHNlIGlmICh0eXBlICE9PSB1bmRlZmluZWQgJiYgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFKSB7XG4gICAgICB0eXBlU3RyaW5nID0gJzwnICsgKGdldENvbXBvbmVudE5hbWUodHlwZS50eXBlKSB8fCAnVW5rbm93bicpICsgJyAvPic7XG4gICAgICBpbmZvID0gJyBEaWQgeW91IGFjY2lkZW50YWxseSBleHBvcnQgYSBKU1ggbGl0ZXJhbCBpbnN0ZWFkIG9mIGEgY29tcG9uZW50Pyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHR5cGVTdHJpbmcgPSB0eXBlb2YgdHlwZTtcbiAgICB9XG5cbiAgICB3YXJuaW5nJDEoZmFsc2UsICdSZWFjdC5jcmVhdGVFbGVtZW50OiB0eXBlIGlzIGludmFsaWQgLS0gZXhwZWN0ZWQgYSBzdHJpbmcgKGZvciAnICsgJ2J1aWx0LWluIGNvbXBvbmVudHMpIG9yIGEgY2xhc3MvZnVuY3Rpb24gKGZvciBjb21wb3NpdGUgJyArICdjb21wb25lbnRzKSBidXQgZ290OiAlcy4lcycsIHR5cGVTdHJpbmcsIGluZm8pO1xuICB9XG5cbiAgdmFyIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgLy8gVGhlIHJlc3VsdCBjYW4gYmUgbnVsbGlzaCBpZiBhIG1vY2sgb3IgYSBjdXN0b20gZnVuY3Rpb24gaXMgdXNlZC5cbiAgLy8gVE9ETzogRHJvcCB0aGlzIHdoZW4gdGhlc2UgYXJlIG5vIGxvbmdlciBhbGxvd2VkIGFzIHRoZSB0eXBlIGFyZ3VtZW50LlxuICBpZiAoZWxlbWVudCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICAvLyBTa2lwIGtleSB3YXJuaW5nIGlmIHRoZSB0eXBlIGlzbid0IHZhbGlkIHNpbmNlIG91ciBrZXkgdmFsaWRhdGlvbiBsb2dpY1xuICAvLyBkb2Vzbid0IGV4cGVjdCBhIG5vbi1zdHJpbmcvZnVuY3Rpb24gdHlwZSBhbmQgY2FuIHRocm93IGNvbmZ1c2luZyBlcnJvcnMuXG4gIC8vIFdlIGRvbid0IHdhbnQgZXhjZXB0aW9uIGJlaGF2aW9yIHRvIGRpZmZlciBiZXR3ZWVuIGRldiBhbmQgcHJvZC5cbiAgLy8gKFJlbmRlcmluZyB3aWxsIHRocm93IHdpdGggYSBoZWxwZnVsIG1lc3NhZ2UgYW5kIGFzIHNvb24gYXMgdGhlIHR5cGUgaXNcbiAgLy8gZml4ZWQsIHRoZSBrZXkgd2FybmluZ3Mgd2lsbCBhcHBlYXIuKVxuICBpZiAodmFsaWRUeXBlKSB7XG4gICAgZm9yICh2YXIgaSA9IDI7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhbGlkYXRlQ2hpbGRLZXlzKGFyZ3VtZW50c1tpXSwgdHlwZSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGUgPT09IFJFQUNUX0ZSQUdNRU5UX1RZUEUpIHtcbiAgICB2YWxpZGF0ZUZyYWdtZW50UHJvcHMoZWxlbWVudCk7XG4gIH0gZWxzZSB7XG4gICAgdmFsaWRhdGVQcm9wVHlwZXMoZWxlbWVudCk7XG4gIH1cblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRmFjdG9yeVdpdGhWYWxpZGF0aW9uKHR5cGUpIHtcbiAgdmFyIHZhbGlkYXRlZEZhY3RvcnkgPSBjcmVhdGVFbGVtZW50V2l0aFZhbGlkYXRpb24uYmluZChudWxsLCB0eXBlKTtcbiAgdmFsaWRhdGVkRmFjdG9yeS50eXBlID0gdHlwZTtcbiAgLy8gTGVnYWN5IGhvb2s6IHJlbW92ZSBpdFxuICB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHZhbGlkYXRlZEZhY3RvcnksICd0eXBlJywge1xuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbG93UHJpb3JpdHlXYXJuaW5nJDEoZmFsc2UsICdGYWN0b3J5LnR5cGUgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHRoZSBjbGFzcyBkaXJlY3RseSAnICsgJ2JlZm9yZSBwYXNzaW5nIGl0IHRvIGNyZWF0ZUZhY3RvcnkuJyk7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndHlwZScsIHtcbiAgICAgICAgICB2YWx1ZTogdHlwZVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gdmFsaWRhdGVkRmFjdG9yeTtcbn1cblxuZnVuY3Rpb24gY2xvbmVFbGVtZW50V2l0aFZhbGlkYXRpb24oZWxlbWVudCwgcHJvcHMsIGNoaWxkcmVuKSB7XG4gIHZhciBuZXdFbGVtZW50ID0gY2xvbmVFbGVtZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIGZvciAodmFyIGkgPSAyOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFsaWRhdGVDaGlsZEtleXMoYXJndW1lbnRzW2ldLCBuZXdFbGVtZW50LnR5cGUpO1xuICB9XG4gIHZhbGlkYXRlUHJvcFR5cGVzKG5ld0VsZW1lbnQpO1xuICByZXR1cm4gbmV3RWxlbWVudDtcbn1cblxudmFyIFJlYWN0ID0ge1xuICBDaGlsZHJlbjoge1xuICAgIG1hcDogbWFwQ2hpbGRyZW4sXG4gICAgZm9yRWFjaDogZm9yRWFjaENoaWxkcmVuLFxuICAgIGNvdW50OiBjb3VudENoaWxkcmVuLFxuICAgIHRvQXJyYXk6IHRvQXJyYXksXG4gICAgb25seTogb25seUNoaWxkXG4gIH0sXG5cbiAgY3JlYXRlUmVmOiBjcmVhdGVSZWYsXG4gIENvbXBvbmVudDogQ29tcG9uZW50LFxuICBQdXJlQ29tcG9uZW50OiBQdXJlQ29tcG9uZW50LFxuXG4gIGNyZWF0ZUNvbnRleHQ6IGNyZWF0ZUNvbnRleHQsXG4gIGZvcndhcmRSZWY6IGZvcndhcmRSZWYsXG4gIGxhenk6IGxhenksXG4gIG1lbW86IG1lbW8sXG5cbiAgRnJhZ21lbnQ6IFJFQUNUX0ZSQUdNRU5UX1RZUEUsXG4gIFN0cmljdE1vZGU6IFJFQUNUX1NUUklDVF9NT0RFX1RZUEUsXG4gIFN1c3BlbnNlOiBSRUFDVF9TVVNQRU5TRV9UWVBFLFxuXG4gIGNyZWF0ZUVsZW1lbnQ6IGNyZWF0ZUVsZW1lbnRXaXRoVmFsaWRhdGlvbixcbiAgY2xvbmVFbGVtZW50OiBjbG9uZUVsZW1lbnRXaXRoVmFsaWRhdGlvbixcbiAgY3JlYXRlRmFjdG9yeTogY3JlYXRlRmFjdG9yeVdpdGhWYWxpZGF0aW9uLFxuICBpc1ZhbGlkRWxlbWVudDogaXNWYWxpZEVsZW1lbnQsXG5cbiAgdmVyc2lvbjogUmVhY3RWZXJzaW9uLFxuXG4gIHVuc3RhYmxlX0NvbmN1cnJlbnRNb2RlOiBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRSxcbiAgdW5zdGFibGVfUHJvZmlsZXI6IFJFQUNUX1BST0ZJTEVSX1RZUEUsXG5cbiAgX19TRUNSRVRfSU5URVJOQUxTX0RPX05PVF9VU0VfT1JfWU9VX1dJTExfQkVfRklSRUQ6IFJlYWN0U2hhcmVkSW50ZXJuYWxzXG59O1xuXG4vLyBOb3RlOiBzb21lIEFQSXMgYXJlIGFkZGVkIHdpdGggZmVhdHVyZSBmbGFncy5cbi8vIE1ha2Ugc3VyZSB0aGF0IHN0YWJsZSBidWlsZHMgZm9yIG9wZW4gc291cmNlXG4vLyBkb24ndCBtb2RpZnkgdGhlIFJlYWN0IG9iamVjdCB0byBhdm9pZCBkZW9wdHMuXG4vLyBBbHNvIGxldCdzIG5vdCBleHBvc2UgdGhlaXIgbmFtZXMgaW4gc3RhYmxlIGJ1aWxkcy5cblxuaWYgKGVuYWJsZVN0YWJsZUNvbmN1cnJlbnRNb2RlQVBJcykge1xuICBSZWFjdC5Db25jdXJyZW50TW9kZSA9IFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFO1xuICBSZWFjdC5Qcm9maWxlciA9IFJFQUNUX1BST0ZJTEVSX1RZUEU7XG4gIFJlYWN0LnVuc3RhYmxlX0NvbmN1cnJlbnRNb2RlID0gdW5kZWZpbmVkO1xuICBSZWFjdC51bnN0YWJsZV9Qcm9maWxlciA9IHVuZGVmaW5lZDtcbn1cblxuaWYgKGVuYWJsZUhvb2tzKSB7XG4gIFJlYWN0LnVzZUNhbGxiYWNrID0gdXNlQ2FsbGJhY2s7XG4gIFJlYWN0LnVzZUNvbnRleHQgPSB1c2VDb250ZXh0O1xuICBSZWFjdC51c2VFZmZlY3QgPSB1c2VFZmZlY3Q7XG4gIFJlYWN0LnVzZUltcGVyYXRpdmVNZXRob2RzID0gdXNlSW1wZXJhdGl2ZU1ldGhvZHM7XG4gIFJlYWN0LnVzZUxheW91dEVmZmVjdCA9IHVzZUxheW91dEVmZmVjdDtcbiAgUmVhY3QudXNlTWVtbyA9IHVzZU1lbW87XG4gIFJlYWN0LnVzZVJlZHVjZXIgPSB1c2VSZWR1Y2VyO1xuICBSZWFjdC51c2VSZWYgPSB1c2VSZWY7XG4gIFJlYWN0LnVzZVN0YXRlID0gdXNlU3RhdGU7XG59XG5cblxuXG52YXIgUmVhY3QkMiA9IE9iamVjdC5mcmVlemUoe1xuXHRkZWZhdWx0OiBSZWFjdFxufSk7XG5cbnZhciBSZWFjdCQzID0gKCBSZWFjdCQyICYmIFJlYWN0ICkgfHwgUmVhY3QkMjtcblxuLy8gVE9ETzogZGVjaWRlIG9uIHRoZSB0b3AtbGV2ZWwgZXhwb3J0IGZvcm0uXG4vLyBUaGlzIGlzIGhhY2t5IGJ1dCBtYWtlcyBpdCB3b3JrIHdpdGggYm90aCBSb2xsdXAgYW5kIEplc3QuXG52YXIgcmVhY3QgPSBSZWFjdCQzLmRlZmF1bHQgfHwgUmVhY3QkMztcblxubW9kdWxlLmV4cG9ydHMgPSByZWFjdDtcbiAgfSkoKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC5wcm9kdWN0aW9uLm1pbi5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC5kZXZlbG9wbWVudC5qcycpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==