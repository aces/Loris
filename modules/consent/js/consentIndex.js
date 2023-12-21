/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./jsx/DataTable.js":
/*!**************************!*\
  !*** ./jsx/DataTable.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var jsx_PaginationLinks__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! jsx/PaginationLinks */ "./jsx/PaginationLinks.js");
/* harmony import */ var react_addons_create_fragment__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-addons-create-fragment */ "./node_modules/react-addons-create-fragment/index.js");
/* harmony import */ var react_addons_create_fragment__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_addons_create_fragment__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var jsx_Form__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");







function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }






/**
 * Data Table component
 * Displays a set of data that is receives via props.
 */
var DataTable = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(DataTable, _Component);
  var _super = _createSuper(DataTable);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function DataTable(props) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, DataTable);
    _this = _super.call(this, props);
    _this.state = {
      page: {
        number: 1,
        rows: 20
      },
      sort: {
        column: -1,
        ascending: true
      }
    };
    _this.changePage = _this.changePage.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.setSortColumn = _this.setSortColumn.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.updateSortColumn = _this.updateSortColumn.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.toggleSortOrder = _this.toggleSortOrder.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.updatePageNumber = _this.updatePageNumber.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.updatePageRows = _this.updatePageRows.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.downloadCSV = _this.downloadCSV.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.getFilteredRowIndexes = _this.getFilteredRowIndexes.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.sortRows = _this.sortRows.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.hasFilterKeyword = _this.hasFilterKeyword.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.renderActions = _this.renderActions.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    return _this;
  }

  /**
   * Set the component page variable
   * to a new value
   *
   * @param {number} i - Page index
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(DataTable, [{
    key: "changePage",
    value: function changePage(i) {
      var page = this.state.page;
      page.number = i;
      this.setState({
        page: page
      });
    }

    /**
     * Update the sort column
     * If component sort.column is already set to column
     * Toggle sort.ascending
     *
     * @param {number} column - The column index
     */
  }, {
    key: "setSortColumn",
    value: function setSortColumn(column) {
      if (this.state.sort.column === column) {
        this.toggleSortOrder();
      } else {
        this.updateSortColumn(column);
      }
    }

    /**
     * Update the sort column
     *
     * @param {number} column - The column index
     */
  }, {
    key: "updateSortColumn",
    value: function updateSortColumn(column) {
      var sort = this.state.sort;
      sort.column = column;
      this.setState({
        sort: sort
      });
    }

    /**
     * Toggle sort.ascending
     */
  }, {
    key: "toggleSortOrder",
    value: function toggleSortOrder() {
      var sort = this.state.sort;
      sort.ascending = !sort.ascending;
      this.setState({
        sort: sort
      });
    }

    /**
     * Updates page state
     *
     * @param {number} number - Number of page
     */
  }, {
    key: "updatePageNumber",
    value: function updatePageNumber(number) {
      var page = this.state.page;
      page.number = number;
      this.setState({
        page: page
      });
    }

    /**
     * Update number of rows per page
     *
     * @param {object} e - Event from which to abstract value
     */
  }, {
    key: "updatePageRows",
    value: function updatePageRows(e) {
      var page = Object.assign({}, this.state.page);
      page.rows = e.target.value;
      page.number = 1;
      this.setState({
        page: page
      });
    }

    /**
     * Export the filtered rows and columns into a csv
     *
     * @param {number[]} filteredRowIndexes - The filtered Row Indexes
     */
  }, {
    key: "downloadCSV",
    value: function downloadCSV(filteredRowIndexes) {
      var _this2 = this;
      var csvData = filteredRowIndexes.map(function (id) {
        return _this2.props.data[id];
      });
      // Map cell data to proper values if applicable.
      if (this.props.getMappedCell) {
        csvData = csvData.map(function (row, i) {
          return _this2.props.fields.flatMap(function (field, j) {
            return _this2.props.getMappedCell(field.label, row[j], row, _this2.props.fields.map(function (val) {
              return val.label;
            }), j);
          });
        });
      }
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

    /**
     * Get the Filtered Row Indexes
     */
  }, {
    key: "getFilteredRowIndexes",
    value: function getFilteredRowIndexes() {
      var useKeyword = false;
      var filterValuesCount = Object.keys(this.props.filters).length;
      var tableData = this.props.data;
      var fieldData = this.props.fields;
      var filteredIndexes = [];

      // If there are no filters set, use all the data.
      var hasFilters = filterValuesCount !== 0;
      if (hasFilters === false) {
        for (var i = 0; i < tableData.length; i++) {
          filteredIndexes.push(i);
        }
        return filteredIndexes;
      }
      if (this.props.filters.keyword) {
        useKeyword = true;
      }
      if (useKeyword) {
        filterValuesCount -= 1;
      }
      for (var _i = 0; _i < tableData.length; _i++) {
        var headerCount = 0;
        var keywordMatch = 0;
        for (var j = 0; j < fieldData.length; j++) {
          var data = tableData[_i] ? tableData[_i][j] : null;
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
          filteredIndexes.push(_i);
        }
      }
      return filteredIndexes;
    }

    /**
     * Sort the given rows according to the sort configuration
     *
     * @param {number[]} rowIndexes - The row indexes
     * @return {object[]}
     */
  }, {
    key: "sortRows",
    value: function sortRows(rowIndexes) {
      var _this3 = this;
      var index = [];
      for (var i = 0; i < rowIndexes.length; i++) {
        var idx = rowIndexes[i];
        var val = this.props.data[idx][this.state.sort.column] || undefined;

        // If sortColumn is equal to default No. column, set value to be
        // index + 1
        if (this.state.sort.column === -1) {
          val = idx + 1;
        }
        var isString = typeof val === 'string' || val instanceof String;
        var isNumber = !isNaN(val) && (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(val) !== 'object';
        if (val === '.') {
          // hack to handle non-existent items in DQT
          val = null;
        } else if (isNumber) {
          // perform type conversion (from string to int/float)
          val = Number(val);
        } else if (isString) {
          // if string with text convert to lowercase
          val = val.toLowerCase();
        } else if (Array.isArray(val)) {
          val = val.join(', ');
        } else {
          val = undefined;
        }
        if (this.props.RowNameMap) {
          index.push({
            RowIdx: idx,
            Value: val,
            Content: this.props.RowNameMap[idx]
          });
        } else {
          index.push({
            RowIdx: idx,
            Value: val,
            Content: idx + 1
          });
        }
      }
      index.sort(function (a, b) {
        if (_this3.state.sort.ascending) {
          if (a.Value === b.Value) {
            // If all values are equal, sort by rownum
            if (a.RowIdx < b.RowIdx) return -1;
            if (a.RowIdx > b.RowIdx) return 1;
          }
          // Check if null values
          if (a.Value === null || typeof a.Value === 'undefined') return -1;
          if (b.Value === null || typeof b.Value === 'undefined') return 1;

          // Sort by value
          if (a.Value < b.Value) return -1;
          if (a.Value > b.Value) return 1;
        } else {
          if (a.Value === b.Value) {
            // If all values are equal, sort by rownum
            if (a.RowIdx < b.RowIdx) return 1;
            if (a.RowIdx > b.RowIdx) return -1;
          }
          // Check if null values
          if (a.Value === null || typeof a.Value === 'undefined') return 1;
          if (b.Value === null || typeof b.Value === 'undefined') return -1;

          // Sort by value
          if (a.Value < b.Value) return 1;
          if (a.Value > b.Value) return -1;
        }
        // They're equal..
        return 0;
      });
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
      var opposite = false;
      var result = false;
      var searchKey = null;
      var searchString = null;
      if (this.props.filters[name]) {
        filterData = this.props.filters[name].value;
        exactMatch = this.props.filters[name].exactMatch;
        opposite = this.props.filters[name].opposite;
      }

      // Handle null inputs
      if (filterData === null || data === null) {
        return false;
      }

      // Handle numeric inputs
      if (typeof filterData === 'number') {
        var intData = Number.parseInt(data, 10);
        result = filterData === intData;
      }

      // Handle string inputs
      if (typeof filterData === 'string') {
        searchKey = filterData.toLowerCase();
        switch ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(data)) {
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
            searchString = data ? data.toString().toLowerCase() : '';
            if (exactMatch) {
              result = searchString === searchKey;
            } else if (opposite) {
              result = searchString !== searchKey;
            } else {
              result = searchString.indexOf(searchKey) > -1;
            }
            break;
        }
      }

      // Handle boolean inputs
      if (typeof filterData === 'boolean') {
        result = filterData === data;
      }

      // Handle array inputs for multiselects
      if ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(filterData) === 'object') {
        var match = false;
        for (var i = 0; i < filterData.length; i += 1) {
          searchKey = filterData[i].toLowerCase();
          searchString = data ? data.toString().toLowerCase() : '';
          var _searchArray = searchString.split(',');
          match = _searchArray.includes(searchKey);
          if (match) {
            result = true;
          }
        }
      }
      return result;
    }

    /**
     * Called by React when the component has been rendered on the page.
     */
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!this.props.noDynamicTable) {
        $('.dynamictable').DynamicTable();
      }
    }

    /**
     * Renders the Actions buttons.
     *
     * @return {string[]|void} - Array of React Elements
     */
  }, {
    key: "renderActions",
    value: function renderActions() {
      if (this.props.actions) {
        return this.props.actions.map(function (action, key) {
          if (action.show !== false) {
            return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_10__.CTA, {
              key: key,
              label: action.label,
              onUserInput: action.action
            });
          }
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
      var _this4 = this;
      if ((this.props.data === null || this.props.data.length === 0) && !this.props.nullTableShow) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("div", {
          className: "row"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("div", {
          className: "col-xs-12"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("div", {
          className: "pull-right",
          style: {
            marginRight: '10px'
          }
        }, this.renderActions()))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("div", {
          className: "alert alert-info no-result-found-panel"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("strong", null, "No result found.")));
      }
      var rowsPerPage = this.state.page.rows;
      var headers = this.props.hide.defaultColumn === true ? [] : [/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("th", {
        key: "th_col_0",
        onClick: function onClick() {
          _this4.setSortColumn(-1);
        }
      }, this.props.rowNumLabel)];
      var _loop = function _loop(i) {
        if (_this4.props.fields[i].show === true) {
          var colIndex = i + 1;
          if (_this4.props.fields[i].freezeColumn === true) {
            headers.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("th", {
              key: 'th_col_' + colIndex,
              id: _this4.props.freezeColumn,
              onClick: function onClick() {
                _this4.setSortColumn(i);
              }
            }, _this4.props.fields[i].label));
          } else {
            headers.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("th", {
              key: 'th_col_' + colIndex,
              onClick: function onClick() {
                _this4.setSortColumn(i);
              }
            }, _this4.props.fields[i].label));
          }
        }
      };
      for (var i = 0; i < this.props.fields.length; i += 1) {
        _loop(i);
      }
      var rows = [];
      var filteredRowIndexes = this.getFilteredRowIndexes();
      var filteredCount = filteredRowIndexes.length;
      var index = this.sortRows(filteredRowIndexes);
      var currentPageRow = rowsPerPage * (this.state.page.number - 1);

      // Format each cell for the data table.
      var _loop2 = function _loop2(_i2) {
        var rowIndex = index[_i2].RowIdx;
        var rowData = _this4.props.data[rowIndex];
        var curRow = [];

        // Iterates through headers to populate row columns
        // with corresponding data
        var _loop3 = function _loop3(j) {
          if (_this4.props.fields[j].show === false) {
            return "continue";
          }
          var celldata = rowData[j];
          var cell = null;
          var row = {};
          _this4.props.fields.forEach(function (field, k) {
            return row[field.label] = rowData[k];
          });
          var headers = _this4.props.fields.map(function (val) {
            return val.label;
          });

          // Get custom cell formatting if available
          if (_this4.props.getFormattedCell) {
            cell = _this4.props.getFormattedCell(_this4.props.fields[j].label, celldata, row, headers, j);
          } else {
            cell = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("td", null, celldata);
          }
          if (cell !== null) {
            curRow.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().cloneElement(cell, {
              key: 'td_col_' + j
            }));
          } else {
            curRow.push(react_addons_create_fragment__WEBPACK_IMPORTED_MODULE_9___default()({
              celldata: celldata
            }));
          }
        };
        for (var j = 0; j < _this4.props.fields.length; j += 1) {
          var _ret = _loop3(j);
          if (_ret === "continue") continue;
        }
        var rowIndexDisplay = index[_i2].Content;
        rows.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("tr", {
          key: 'tr_' + rowIndex,
          colSpan: headers.length
        }, _this4.props.hide.defaultColumn === true ? null : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("td", {
          key: 'td_' + rowIndex
        }, rowIndexDisplay), curRow));
      };
      for (var _i2 = currentPageRow; _i2 < filteredCount && rows.length < rowsPerPage; _i2++) {
        _loop2(_i2);
      }
      var rowsPerPageDropdown = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("select", {
        className: "input-sm perPage",
        onChange: this.updatePageRows,
        value: this.state.page.rows
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("option", null, "20"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("option", null, "50"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("option", null, "100"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("option", null, "1000"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("option", null, "5000"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("option", null, "10000"));
      var loading = this.props.loading ? 'Loading...' : '';
      var header = this.props.hide.rowsPerPage === true ? '' : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("div", {
        className: "table-header"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("div", {
        className: "row"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '5px 15px'
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("div", {
        style: {
          order: '1',
          padding: '5px 0'
        }
      }, rows.length, " rows displayed of ", filteredCount, ". (Maximum rows per page: ", rowsPerPageDropdown, ")", loading), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("div", {
        style: {
          order: '2',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '5px 0',
          marginLeft: 'auto'
        }
      }, this.renderActions(), this.props.hide.downloadCSV === true ? '' : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("button", {
        className: "btn btn-primary",
        onClick: this.downloadCSV.bind(null, filteredRowIndexes)
      }, "Download Table as CSV"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement(jsx_PaginationLinks__WEBPACK_IMPORTED_MODULE_8__["default"], {
        Total: filteredCount,
        onChangePage: this.changePage,
        RowsPerPage: rowsPerPage,
        Active: this.state.page.number
      })))));
      var footer = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("div", {
        className: "row"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '5px 15px'
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("div", {
        style: {
          order: '1',
          padding: '5px 0'
        }
      }, rows.length, " rows displayed of ", filteredCount, ". (Maximum rows per page: ", rowsPerPageDropdown, ")"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("div", {
        style: {
          order: '2',
          padding: '5px 0',
          marginLeft: 'auto'
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement(jsx_PaginationLinks__WEBPACK_IMPORTED_MODULE_8__["default"], {
        Total: filteredCount,
        onChangePage: this.changePage,
        RowsPerPage: rowsPerPage,
        Active: this.state.page.number
      })))));
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("div", {
        style: {
          margin: '14px'
        }
      }, header, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("table", {
        className: "table table-hover table-primary table-bordered dynamictable",
        id: "dynamictable"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("thead", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("tr", {
        className: "info"
      }, headers)), this.props.folder, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("tbody", null, rows)), footer);
    }
  }]);
  return DataTable;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);
DataTable.propTypes = {
  data: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().array.isRequired),
  rowNumLabel: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().string),
  // Function of which returns a JSX element for a table cell, takes
  // parameters of the form: func(ColumnName, CellData, EntireRowData)
  getFormattedCell: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().func),
  onSort: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().func),
  actions: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().array),
  hide: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().object),
  nullTableShow: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().bool),
  noDynamicTable: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().bool),
  getMappedCell: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().func),
  fields: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().array),
  RowNameMap: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().array),
  filters: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().object),
  freezeColumn: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().string),
  loading: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().element),
  folder: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().element)
};
DataTable.defaultProps = {
  headers: [],
  data: {},
  rowNumLabel: 'No.',
  filters: {},
  hide: {
    rowsPerPage: false,
    downloadCSV: false,
    defaultColumn: false
  },
  nullTableShow: false,
  noDynamicTable: false
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DataTable);

/***/ }),

/***/ "./jsx/Filter.js":
/*!***********************!*\
  !*** ./jsx/Filter.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var jsx_Form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");




/**
 * Filter component
 * A wrapper for form elements inside a selection filter.
 *
 * Constructs filter fields based on this.props.fields configuration object
 *
 * Alters the filter object and sends it to parent on every update.
 *
 * @param {props} props
 * @return {JSX}
 */
function Filter(props) {
  /**
   * Takes query params from url and triggers an update of the fields that are
   * associated with those params, if they exist.
   */
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var searchParams = new URLSearchParams(location.search);
    searchParams.forEach(function (value, name) {
      // This checks to make sure the filter actually exists
      if (props.fields.find(function (field) {
        return (field.filter || {}).name == name;
      })) {
        onFieldUpdate(name, searchParams.getAll(name));
      }
    });
  }, []);

  /**
   * Sets filter object to reflect values of input fields.
   *
   * @param {string} name - form element type (i.e component name)
   * @param {string} value - the name of the form element
   */
  var onFieldUpdate = function onFieldUpdate(name, value) {
    var _JSON$parse = JSON.parse(JSON.stringify(props)),
      fields = _JSON$parse.fields;
    var type = fields.find(function (field) {
      return (field.filter || {}).name == name;
    }).filter.type;
    var exactMatch = !(type === 'text' || type === 'date');
    if (value === null || value === '' || value.constructor === Array && value.length === 0 || type === 'checkbox' && value === false) {
      props.removeFilter(name);
    } else {
      props.addFilter(name, value, exactMatch);
    }
  };

  /**
   * Renders the filters based on the defined fields.
   *
   * @return {array}
   */
  var renderFilterFields = function renderFilterFields() {
    return props.fields.reduce(function (result, field) {
      var filter = field.filter;
      if (filter && filter.hide !== true) {
        var element;
        switch (filter.type) {
          case 'text':
            element = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_1__.TextboxElement, null);
            break;
          case 'select':
            element = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_1__.SelectElement, {
              options: filter.options,
              sortByValue: filter.sortByValue,
              autoSelect: false
            });
            break;
          case 'multiselect':
            element = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_1__.SelectElement, {
              options: filter.options,
              sortByValue: filter.sortByValue,
              multiple: true,
              emptyOption: false
            });
            break;
          case 'numeric':
            element = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(NumericElement, {
              options: filter.options
            });
            break;
          case 'date':
            element = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_1__.DateElement, null);
            break;
          case 'checkbox':
            element = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_1__.CheckboxElement, null);
            break;
          default:
            element = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_1__.TextboxElement, null);
        }

        // The value prop has to default to false if the first two options
        // are undefined so that the checkbox component is a controlled input
        // element with a starting default value
        result.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().cloneElement(element, {
          key: filter.name,
          name: filter.name,
          label: field.label,
          value: (props.filters[filter.name] || {}).value || null,
          onUserInput: onFieldUpdate
        }));
      }
      return result;
    }, []);
  };
  var filterPresets = function filterPresets() {
    if (props.filterPresets) {
      var presets = props.filterPresets.map(function (preset) {
        var handleClick = function handleClick() {
          return props.updateFilters(preset.filter);
        };
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
          onClick: handleClick
        }, preset.label));
      });
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
        className: "dropdown"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
        className: "dropdown-toggle",
        "data-toggle": "dropdown",
        role: "button"
      }, "Load Filter Preset ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "caret"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
        className: "dropdown-menu",
        role: "menu"
      }, presets));
    }
  };
  var filterActions = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
    className: "nav nav-tabs navbar-right",
    style: {
      borderBottom: 'none'
    }
  }, filterPresets(), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    role: "button",
    name: "reset",
    onClick: props.clearFilters
  }, "Clear Filter")));
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_1__.FormElement, {
    id: props.id,
    name: props.name
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_1__.FieldsetElement, {
    columns: props.columns,
    legend: props.title
  }, filterActions, renderFilterFields()));
}
Filter.defaultProps = {
  id: null,
  clearFilter: function clearFilter() {
    console.warn('onUpdate() callback is not set!');
  },
  columns: 1
};
Filter.propTypes = {
  filters: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().object.isRequired),
  clearFilter: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func.isRequired),
  id: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
  name: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
  columns: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().number),
  title: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
  fields: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().array.isRequired),
  removeFilter: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func),
  addFilter: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func),
  filterPresets: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().array),
  updateFilters: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func),
  clearFilters: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func)
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Filter);

/***/ }),

/***/ "./jsx/FilterableDataTable.js":
/*!************************************!*\
  !*** ./jsx/FilterableDataTable.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var jsx_Panel__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! jsx/Panel */ "./jsx/Panel.js");
/* harmony import */ var jsx_DataTable__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! jsx/DataTable */ "./jsx/DataTable.js");
/* harmony import */ var jsx_Filter__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! jsx/Filter */ "./jsx/Filter.js");







function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }






/**
 * FilterableDataTable component.
 * A wrapper for all datatables that handles filtering.
 *
 * Handles the updating and clearing of the filter state based on changes sent
 * from the FitlerForm.
 *
 * Passes the Filter to the Datatable.
 *
 * Deprecates Filter Form.
 */
var FilterableDataTable = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(FilterableDataTable, _Component);
  var _super = _createSuper(FilterableDataTable);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function FilterableDataTable(props) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, FilterableDataTable);
    _this = _super.call(this, props);
    _this.state = {
      filters: {}
    };
    _this.updateFilters = _this.updateFilters.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.clearFilters = _this.clearFilters.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.validFilters = _this.validFilters.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.addFilter = _this.addFilter.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.removeFilter = _this.removeFilter.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    return _this;
  }

  /**
   * Updates filter state
   *
   * @param {object} filters
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(FilterableDataTable, [{
    key: "updateFilters",
    value: function updateFilters(filters) {
      this.updateQueryParams(filters);
      this.setState({
        filters: filters
      });
      if (this.props.updateFilterCallback) {
        this.props.updateFilterCallback(filters);
      }
    }

    /**
     * Updates URL Query Params
     *
     * @param {object} filters
     */
  }, {
    key: "updateQueryParams",
    value: function updateQueryParams(filters) {
      var searchParams = new URLSearchParams();
      Object.entries(filters).forEach(function (_ref) {
        var _ref2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_ref, 2),
          name = _ref2[0],
          filter = _ref2[1];
        if (filter.value.constructor === Array) {
          filter.value.forEach(function (v) {
            return searchParams.append(name, v);
          });
        } else {
          searchParams.set(name, filter.value);
        }
      });
      history.replaceState({}, '', "?".concat(searchParams.toString()));
    }

    /**
     * Add new filter to the filter object
     *
     * @param {string} name
     * @param {*}      value
     * @param {boolean}   exactMatch
     */
  }, {
    key: "addFilter",
    value: function addFilter(name, value, exactMatch) {
      var filters = this.state.filters;
      filters[name] = {
        value: value,
        exactMatch: exactMatch
      };
      this.updateFilters(filters);
    }

    /**
     * Remove filter from the filter object
     *
     * @param {string} name
     */
  }, {
    key: "removeFilter",
    value: function removeFilter(name) {
      var filters = this.state.filters;
      delete filters[name];
      this.updateFilters(filters);
    }

    /**
     * Sets Filter to empty object
     */
  }, {
    key: "clearFilters",
    value: function clearFilters() {
      this.updateFilters({});
    }

    /**
     * Returns the filter state, with filters that are
     * set to an invalid option removed from the returned
     * filters
     *
     * @return {object}
     */
  }, {
    key: "validFilters",
    value: function validFilters() {
      var _this2 = this;
      var filters = {};
      this.props.fields.forEach(function (field) {
        if (!field.filter) {
          return;
        }
        var filtername = field.filter.name;
        var filterval = _this2.state.filters[filtername];
        if (!filterval) {
          return;
        }
        if (field.filter.type !== 'select') {
          filters[filtername] = filterval;
          return;
        }
        if (!(filterval.value in field.filter.options)) {
          return;
        }
        filters[filtername] = filterval;
      });
      return filters;
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var filters = this.validFilters();
      var filter = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement(jsx_Filter__WEBPACK_IMPORTED_MODULE_10__["default"], {
        name: this.props.name + '_filter',
        id: this.props.name + '_filter',
        columns: this.props.columns,
        filters: filters,
        filterPresets: this.props.filterPresets,
        fields: this.props.fields,
        addFilter: this.addFilter,
        updateFilters: this.updateFilters,
        removeFilter: this.removeFilter,
        clearFilters: this.clearFilters
      });
      var dataTable = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement(jsx_DataTable__WEBPACK_IMPORTED_MODULE_9__["default"], {
        data: this.props.data,
        fields: this.props.fields,
        filters: filters,
        actions: this.props.actions,
        loading: this.props.loading,
        getFormattedCell: this.props.getFormattedCell,
        getMappedCell: this.props.getMappedCell,
        folder: this.props.folder,
        nullTableShow: this.props.nullTableShow,
        noDynamicTable: this.props.noDynamicTable
      });
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement(jsx_Panel__WEBPACK_IMPORTED_MODULE_8__["default"], {
        title: this.props.title
      }, filter, this.props.children, dataTable);
    }
  }]);
  return FilterableDataTable;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);
FilterableDataTable.defaultProps = {
  columns: 3,
  noDynamicTable: false
};
FilterableDataTable.propTypes = {
  name: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().string.isRequired),
  title: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().string),
  data: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().array.isRequired),
  filterPresets: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().object),
  fields: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().array.isRequired),
  columns: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().number),
  getFormattedCell: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().func),
  actions: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().array),
  updateFilterCallback: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().func),
  noDynamicTable: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().bool),
  loading: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().element),
  getMappedCell: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().func),
  folder: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().element),
  nullTableShow: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().element),
  children: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().node)
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FilterableDataTable);

/***/ }),

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

/***/ "./jsx/PaginationLinks.js":
/*!********************************!*\
  !*** ./jsx/PaginationLinks.js ***!
  \********************************/
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
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_7__);






function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



/**
 * Pagination component
 */
var PaginationLinks = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__["default"])(PaginationLinks, _Component);
  var _super = _createSuper(PaginationLinks);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function PaginationLinks(props) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, PaginationLinks);
    _this = _super.call(this, props);
    _this.state = {};
    _this.changePage = _this.changePage.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    return _this;
  }

  /**
   * Called by React when the component is updated.
   *
   * @param {object} prevProps - Previous React Component properties
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(PaginationLinks, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.Total < prevProps.Total) {
        this.props.onChangePage(1);
      }
    }

    /**
     * Creates an onClick Event Handler
     * execyting this.props.onChangePage(i)
     *
     * @param {number} i - Page index
     * @return {function(event)} - onClick Event Handler
     */
  }, {
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

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
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
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null);
      }
      if (this.props.Total < this.props.RowsPerPage) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null);
      }
      if (lastShownPage - startPage <= 7) {
        lastShownPage = startPage + 6;
        if (lastShownPage > lastPage) {
          lastShownPage = lastPage;
          startPage = lastPage - 6;
        }
      }
      if (startPage > 1) {
        pageLinks.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("li", {
          key: 'table_page_beginning_' + startPage.toString(),
          onClick: this.changePage(1)
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("a", {
          href: "#"
        }, "\xAB")));
      }
      if (startPage < 1) {
        startPage = 1;
      }
      if (lastShownPage < 1) {
        lastShownPage = 1;
      }

      // If there is only 1 page, don't display pagination links
      if (startPage === lastShownPage) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null);
      }
      for (var i = startPage; i <= lastShownPage; i += 1) {
        classList = '';
        if (this.props.Active === i) {
          classList = 'active';
        }
        pageLinks.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("li", {
          key: 'table_page_' + i.toString(),
          onClick: this.changePage(i),
          className: classList
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("a", {
          href: "#"
        }, i)));
      }
      if (lastShownPage !== lastPage) {
        pageLinks.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("li", {
          key: 'table_page_more_' + lastShownPage.toString(),
          onClick: this.changePage(lastPage)
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("a", {
          href: "#"
        }, "\xBB")));
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("ul", {
        className: "pagination pagination-table"
      }, pageLinks);
    }
  }]);
  return PaginationLinks;
}(react__WEBPACK_IMPORTED_MODULE_6__.Component);
PaginationLinks.propTypes = {
  onChangePage: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().func),
  Total: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().number.isRequired),
  RowsPerPage: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().number),
  Active: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().number)
};
PaginationLinks.defaultProps = {
  RowsPerPage: 10,
  Active: 1
};
window.PaginationLinks = PaginationLinks;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PaginationLinks);

/***/ }),

/***/ "./jsx/Panel.js":
/*!**********************!*\
  !*** ./jsx/Panel.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__);


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



/**
 * Panel - a collapsible panel component with optional multiple views.
 *
 * @author Alex I.
 * @version 2.0.0
 * @param {object} props
 * @return {JSX.Element}
 */
var Panel = function Panel(props) {
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false),
    _useState2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState, 2),
    collapsed = _useState2[0],
    setCollapsed = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(0),
    _useState4 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState3, 2),
    activeView = _useState4[0],
    setActiveView = _useState4[1];

  /**
   * Similar to componentDidMount and componentDidUpdate.
   */
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
    setCollapsed(props.initCollapsed);
  }, []);

  /**
   * Toggle whether panel is displayed as collapsed
   */
  var toggleCollapsed = function toggleCollapsed() {
    if (props.collapsing) {
      setCollapsed(!collapsed);
    }
  };

  /**
   * User clicked a view to display.
   *
   * @param {number} index
   */
  var viewClicked = function viewClicked(index) {
    setActiveView(index);
  };

  // Panel Views (START)
  var views = [];
  var content = [];
  var panelViews;
  if (props.views) {
    var _iterator = _createForOfIteratorHelper(props.views.entries()),
      _step;
    try {
      var _loop = function _loop() {
        var _step$value = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_step.value, 2),
          index = _step$value[0],
          view = _step$value[1];
        views.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("li", {
          key: index,
          onClick: function onClick() {
            return viewClicked(index);
          },
          className: index === activeView ? 'active' : null
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("a", {
          "data-target": "".concat(index, "_panel_content")
        }, view['title'])));
        content.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", {
          key: index,
          id: "".concat(index, "_panel_content_").concat(props.id),
          className: index === activeView ? "".concat(index, "_panel_content") : "".concat(index, "_panel_content hidden")
        }, view['content']));
      };
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _loop();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    panelViews = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", {
      className: "btn-group views"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("button", {
      type: "button",
      className: "btn btn-default btn-xs dropdown-toggle",
      "data-toggle": "dropdown"
    }, "Views", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("span", {
      className: "caret"
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("ul", {
      className: "dropdown-menu pull-right",
      role: "menu"
    }, views));
  }
  // Panel Views (END)

  // Add panel header, if title is set
  var panelHeading = props.title || props.views ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", {
    className: "panel-heading",
    "data-parent": props.parentId ? "#".concat(props.parentId) : null
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("h3", {
    className: "panel-title"
  }, props.views && props.views[activeView]['title'] ? props.views[activeView]['title'] : props.title), panelViews, props.collapsing ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("span", {
    className: collapsed ? 'glyphicon glyphicon-chevron-down' : 'glyphicon glyphicon-chevron-up',
    onClick: toggleCollapsed,
    "data-toggle": "collapse",
    "data-target": "#".concat(props.id),
    style: {
      cursor: 'pointer'
    }
  }) : null) : '';

  /**
   * Renders the React component.
   *
   * @return {JSX.Element} - React markup for component.
   */
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", {
    className: "panel ".concat(props["class"]),
    style: {
      height: props.panelSize
    }
  }, panelHeading, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", {
    id: props.id,
    className: props.collapsed ? 'panel-collapse collapse' : 'panel-collapse collapse in',
    role: "tabpanel",
    style: {
      height: 'calc(100% - 3em)'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", {
    className: "panel-body",
    style: _objectSpread(_objectSpread({}, props.style), {}, {
      height: props.height
    })
  }, content.length > 0 ? content : props.children)));
};
Panel.propTypes = (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({
  initCollapsed: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
  collapsed: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
  parentId: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
  id: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
  height: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
  title: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
  "class": (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
  children: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().node),
  views: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().array),
  collapsing: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
  bold: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
  panelSize: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
  style: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().object)
}, "children", (prop_types__WEBPACK_IMPORTED_MODULE_3___default().node));
Panel.defaultProps = {
  initCollapsed: false,
  parentId: null,
  id: 'default-panel',
  height: '100%',
  "class": 'panel-primary',
  collapsing: true
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Panel);

/***/ }),

/***/ "./jsx/Tabs.js":
/*!*********************!*\
  !*** ./jsx/Tabs.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TabPane": () => (/* binding */ TabPane),
/* harmony export */   "Tabs": () => (/* binding */ Tabs),
/* harmony export */   "VerticalTabs": () => (/* binding */ VerticalTabs)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_7__);






function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
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
var Tabs = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__["default"])(Tabs, _Component);
  var _super = _createSuper(Tabs);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function Tabs(props) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Tabs);
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
    _this.handleClick = _this.handleClick.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.getTabs = _this.getTabs.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.getTabPanes = _this.getTabPanes.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
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
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Tabs, [{
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
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("li", {
          role: "presentation",
          className: tabClass,
          key: tab.id
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("a", {
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
      var tabPanes = react__WEBPACK_IMPORTED_MODULE_6___default().Children.map(this.props.children, function (child, key) {
        if (child) {
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().cloneElement(child, {
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
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("ul", {
        className: "nav nav-tabs",
        role: "tablist",
        style: tabStyle
      }, tabs), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", {
        className: "tab-content"
      }, tabPanes));
    }
  }]);
  return Tabs;
}(react__WEBPACK_IMPORTED_MODULE_6__.Component);
Tabs.propTypes = {
  tabs: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().array.isRequired),
  defaultTab: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().string),
  updateURL: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().bool),
  onTabChange: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().func),
  children: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().node)
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
var VerticalTabs = /*#__PURE__*/function (_Component2) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__["default"])(VerticalTabs, _Component2);
  var _super2 = _createSuper(VerticalTabs);
  /**
   * Construct the Component
   *
   * @param {array} props - array of React props
   */
  function VerticalTabs(props) {
    var _this2;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, VerticalTabs);
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
    _this2.handleClick = _this2.handleClick.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this2));
    _this2.getTabs = _this2.getTabs.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this2));
    _this2.getTabPanes = _this2.getTabPanes.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this2));
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
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(VerticalTabs, [{
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
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("li", {
          role: "presentation",
          className: tabClass,
          key: tab.id
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("a", {
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
      var tabPanes = react__WEBPACK_IMPORTED_MODULE_6___default().Children.map(this.props.children, function (child, key) {
        if (child) {
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().cloneElement(child, {
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
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", {
        className: "tabbable col-md-3 col-sm-3"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("ul", {
        className: "nav nav-pills nav-stacked",
        role: "tablist",
        style: tabStyle
      }, tabs)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", {
        className: "tab-content col-md-9 col-sm-9"
      }, tabPanes));
    }
  }]);
  return VerticalTabs;
}(react__WEBPACK_IMPORTED_MODULE_6__.Component);
VerticalTabs.propTypes = {
  tabs: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().array.isRequired),
  defaultTab: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().string),
  updateURL: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().bool),
  onTabChange: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().func),
  children: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().node)
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
var TabPane = /*#__PURE__*/function (_Component3) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__["default"])(TabPane, _Component3);
  var _super3 = _createSuper(TabPane);
  function TabPane() {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, TabPane);
    return _super3.apply(this, arguments);
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(TabPane, [{
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
        title = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("h1", null, this.props.Title);
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", {
        role: "tabpanel",
        className: classList,
        id: this.props.TabId
      }, title, this.props.children);
    }
  }]);
  return TabPane;
}(react__WEBPACK_IMPORTED_MODULE_6__.Component);
TabPane.propTypes = {
  TabId: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().string.isRequired),
  Title: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().string),
  activeTab: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().string),
  children: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().node)
};


/***/ }),

/***/ "./jsx/TriggerableModal.js":
/*!*********************************!*\
  !*** ./jsx/TriggerableModal.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var Modal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! Modal */ "./jsx/Modal.js");
/* harmony import */ var jsx_Form__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");







function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * This file contains the React Component for a Triggerable Modal Window.
 *
 * @author Henri Rabalais
 * @version 1.1.0
 */





/**
 * Triggerable Modal Component.
 * React wrapper for a Triggerable Modal Window.
 * Allows to dynamically toggle a Modal window through a rendered trigger.
 *
 * ================================================
 * Usage:
 * - Wrap the contents to be displayed by the Modal Window by the
 *   Triggerable Modal Component.
 * - Use the 'title' prop to set a title for the Modal Component.
 * - Use the 'trigger' prop to set the component that will act as a trigger to
 *   open the Modal window.
 * - Use the 'onSubmit' prop to set a submission promise object for the Modal's contents.
 * - Use the 'onClose' prop to set a function to be triggered when the Modal is
 *   closed.
 * - Use the 'throwWarning' prop to throw a warning upon closure of the Modal Window.
 * =================================================
 *
 */
var TriggerableModal = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(TriggerableModal, _Component);
  var _super = _createSuper(TriggerableModal);
  /**
   * @constructor
   */
  function TriggerableModal() {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, TriggerableModal);
    _this = _super.call(this);
    _this.state = {
      open: false
    };
    _this.close = _this.close.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    return _this;
  }

  /**
   * Close the modal
   * and trigger onClose
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(TriggerableModal, [{
    key: "close",
    value: function close() {
      this.setState({
        open: false
      });
      if (this.props.onClose instanceof Function) this.props.onClose();
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
      var _this$props = this.props,
        label = _this$props.label,
        _onUserInput = _this$props.onUserInput;
      var trigger = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_9__.CTA, {
        label: label,
        onUserInput: function onUserInput() {
          if (_onUserInput instanceof Function) _onUserInput();
          _this2.setState({
            open: true
          });
        }
      });
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement("div", null, trigger, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement(Modal__WEBPACK_IMPORTED_MODULE_8__["default"], (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, this.props, {
        show: this.state.open,
        onClose: this.close
      })));
    }
  }]);
  return TriggerableModal;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);
TriggerableModal.propTypes = {
  label: (prop_types__WEBPACK_IMPORTED_MODULE_10___default().string.isRequired),
  onClose: (prop_types__WEBPACK_IMPORTED_MODULE_10___default().func),
  onUserInput: (prop_types__WEBPACK_IMPORTED_MODULE_10___default().func)
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TriggerableModal);

/***/ }),

/***/ "./modules/candidate_parameters/jsx/ConsentStatus.js":
/*!***********************************************************!*\
  !*** ./modules/candidate_parameters/jsx/ConsentStatus.js ***!
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
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var Tabs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! Tabs */ "./jsx/Tabs.js");
/* harmony import */ var Loader__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! Loader */ "./jsx/Loader.js");
/* harmony import */ var jsx_Form__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");






function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }







/**
 * Consent Status Component.
 *
 * Renders the contents of the Consent Status tab, consisting of the FormElement component
 */
var ConsentStatus = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__["default"])(ConsentStatus, _Component);
  var _super = _createSuper(ConsentStatus);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function ConsentStatus(props) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, ConsentStatus);
    _this = _super.call(this, props);
    _this.state = {
      consentOptions: {
        yes: 'Yes',
        no: 'No'
      },
      Data: [],
      formData: {},
      error: false,
      isLoaded: false,
      submitDisabled: false,
      showHistory: false
    };

    /**
     * Bind component instance to custom methods
     */
    _this.fetchData = _this.fetchData.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.setFormData = _this.setFormData.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.handleSubmit = _this.handleSubmit.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.showHistory = _this.showHistory.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.renderFormattedHistory = _this.renderFormattedHistory.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.renderConsent = _this.renderConsent.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    return _this;
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(ConsentStatus, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetchData();
    }

    /**
     * Retrieve data from the provided URL and save it in state
     */
  }, {
    key: "fetchData",
    value: function fetchData() {
      var _this2 = this;
      $.ajax(this.props.dataURL, {
        method: 'GET',
        dataType: 'json',
        success: function success(data) {
          var formData = {};
          var consents = data.consents;
          for (var cStatus in consents) {
            if (consents.hasOwnProperty(cStatus)) {
              var cDate = cStatus + '_date';
              var cDate2 = cStatus + '_date2';
              var cWithdrawal = cStatus + '_withdrawal';
              var cWithdrawal2 = cStatus + '_withdrawal2';
              var cComment = cStatus + '_comment';
              formData[cStatus] = data.consentStatuses[cStatus];
              formData[cDate] = data.consentDates[cStatus];
              formData[cDate2] = data.consentDates[cStatus];
              formData[cWithdrawal] = data.withdrawals[cStatus];
              formData[cWithdrawal2] = data.withdrawals[cStatus];
              formData[cComment] = data.comments[cStatus];
            }
          }
          _this2.setState({
            Data: data,
            formData: formData,
            isLoaded: true
          });
        },
        error: function error(_error) {
          console.error(_error);
          _this2.setState({
            error: true
          });
        }
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
      for (var consent in this.state.Data.consents) {
        if (this.state.Data.consents.hasOwnProperty(consent)) {
          var oldConsent = this.state.Data.consentStatuses[consent];
          var newConsent = this.state.formData[consent];
          if (formElement === consent) {
            // Clear withdrawal date if consent status changes from no
            // (or empty if uncleaned data) to yes
            if (newConsent === 'yes' && oldConsent !== 'yes' || newConsent === 'no' && (oldConsent === null || oldConsent === '')) {
              formData[consent + '_withdrawal'] = '';
              formData[consent + '_withdrawal2'] = '';
            }
            // Clear date if response set back to null
            if (newConsent === '' && oldConsent !== null) {
              formData[consent + '_date'] = '';
              formData[consent + '_date2'] = '';
              formData[consent + '_withdrawal'] = '';
              formData[consent + '_withdrawal2'] = '';
            }
          }
        }
      }
      this.setState({
        formData: formData
      });
    }

    /**
     * Handles form submission
     *
     * @param {event} e - Form submission event
     */
  }, {
    key: "handleSubmit",
    value: function handleSubmit(e) {
      var _this3 = this;
      e.preventDefault();
      var myFormData = this.state.formData;
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1; // January is 0!
      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      today = yyyy + '-' + mm + '-' + dd;
      for (var consentStatus in this.state.Data.consents) {
        if (this.state.Data.consents.hasOwnProperty(consentStatus)) {
          var label = this.state.Data.consents[consentStatus];
          var consentDate = consentStatus + '_date';
          var consentDate2 = consentStatus + '_date2';
          var date1 = myFormData[consentDate] ? myFormData[consentDate] : null;
          var date2 = myFormData[consentDate2] ? myFormData[consentDate2] : null;
          if (date1 !== date2) {
            alert(label + ' dates do not match!');
            return;
          }
          if (date1 > today) {
            alert(label + ' date cannot be later than today!');
            return;
          }
          var consentWithdrawal = consentStatus + '_withdrawal';
          var consentWithdrawal2 = consentStatus + '_withdrawal2';
          var withdrawDate1 = myFormData[consentWithdrawal] ? myFormData[consentWithdrawal] : null;
          var withdrawDate2 = myFormData[consentWithdrawal2] ? myFormData[consentWithdrawal2] : null;
          if (withdrawDate1 !== withdrawDate2) {
            alert(label + ' withdrawal dates do not match!');
            return;
          }
          if (withdrawDate1 > today) {
            alert(label + ' withdrawal date cannot be later than today!');
            return;
          }
          if (withdrawDate1 < date1) {
            alert(label + ' withdrawal date cannot be earlier than response date!');
            return;
          }
        }
      }
      // Set form data
      var formData = new FormData();
      for (var key in myFormData) {
        // Does not submit data with empty string
        if (myFormData[key] !== '') {
          formData.append(key, myFormData[key]);
        }
      }
      formData.append('tab', this.props.tabName);
      formData.append('candID', this.state.Data.candID);

      // Disable submit button to prevent form resubmission
      this.setState({
        submitDisabled: true
      });
      $.ajax({
        type: 'POST',
        url: this.props.action,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function success(data) {
          sweetalert2__WEBPACK_IMPORTED_MODULE_7___default().fire('Success!', 'Update successful.', 'success').then(function (result) {
            if (result.value) {
              _this3.setState({
                submitDisabled: false
              });
              _this3.fetchData();
            }
          });
          _this3.fetchData();
        },
        error: function error(_error2) {
          console.error(_error2);
          // Enable submit button for form resubmission
          _this3.setState({
            submitDisabled: false
          });
          var errorMessage = _error2.responseText || 'Update failed.';
          sweetalert2__WEBPACK_IMPORTED_MODULE_7___default().fire('Error!', errorMessage, 'error');
        }
      });
    }

    /**
     * Show history
     */
  }, {
    key: "showHistory",
    value: function showHistory() {
      this.setState({
        showHistory: !this.state.showHistory
      });
    }

    /**
     * Render formatted history
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "renderFormattedHistory",
    value: function renderFormattedHistory() {
      var _this4 = this;
      var historyBtnLabel = this.state.showHistory ? 'Hide Consent History' : 'Show Consent History';
      var formattedHistory = this.state.Data.history.map(function (info, key) {
        var label = info.label;
        var dataEntry = info.data_entry_date;
        var user = info.entry_staff;
        var consentStatus = info.consentStatus;
        var consentDate = info.date;
        var withdrawal = info.withdrawal;
        var requestStatus = info.requestStatus;
        var version = info.version;
        var comment = info.Comment;
        var dateHistory = consentDate ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("span", null, ", ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("b", null, "Date of Consent"), " to ", consentDate) : null;
        var withdrawalHistory = withdrawal ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("span", null, ", ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("b", null, "Date of Consent Withdrawal"), " to ", withdrawal) : null;
        var requestStatusHistory = requestStatus ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("span", null, ", ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("b", null, "Request Status"), " to ", requestStatus) : null;
        var versionHistory = version ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("span", null, ", ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("b", null, "Version"), " to ", version) : null;
        var commentHistory = comment ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("span", null, ", ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("b", null, "Comment"), " to ", comment) : null;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", {
          key: key
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("hr", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("b", null, dataEntry, " - ", user), " updated for ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("i", null, label), ":", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("b", null, " Status"), " to ", ' ', _this4.state.consentOptions[consentStatus], dateHistory, withdrawalHistory, requestStatusHistory, versionHistory, commentHistory));
      });
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", {
        style: {
          margin: '20px'
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("button", {
        className: "btn btn-primary",
        onClick: this.showHistory,
        "data-toggle": "collapse",
        "data-target": "#consent-history",
        style: {
          margin: '10px 0'
        }
      }, historyBtnLabel), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", {
        id: "consent-history",
        className: "collapse ".concat(this.state.showHistory ? 'show' : '')
      }, formattedHistory));
    }

    /**
     * Render Consent
     *
     * @param {string} consentName
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "renderConsent",
    value: function renderConsent(consentName) {
      // Allow editing if user has permission
      var disabled = loris.userHasPermission('candidate_parameter_edit') ? false : true;

      // Set up props for front-end validation
      var oldConsent = this.state.Data.consentStatuses[consentName];
      var newConsent = this.state.formData[consentName];
      var withdrawalDate = this.state.Data.withdrawals[consentName];
      // Define defaults
      var dateRequired = false;
      var responseDateDisabled = true;
      var withdrawalRequired = false;
      // Let date of withdrawal field be disabled until it is needed
      var withdrawalDisabled = true;

      // If answer to consent is 'yes', require date of consent
      if (newConsent === 'yes') {
        responseDateDisabled = false;
        dateRequired = true;
      }
      // If answer to consent is 'no', require date of consent
      if (newConsent === 'no') {
        responseDateDisabled = false;
        dateRequired = true;
        // If answer was previously 'yes' and consent is now being withdrawn, enable and require withdrawal date
        // If consent was previously withdrawn and stays withdrawn, enable and require withdrawal date
        if (oldConsent === 'yes' || oldConsent === 'no' && withdrawalDate) {
          withdrawalDisabled = false;
          withdrawalRequired = true;
        }
      }

      // Set up elements
      var label = this.state.Data.consents[consentName];
      var statusLabel = 'Response';
      var consentDate = consentName + '_date';
      var consentDate2 = consentName + '_date2';
      var consentDateLabel = 'Date of Response';
      var consentDateConfirmationLabel = 'Confirmation Date of Response';
      var consentWithdrawal = consentName + '_withdrawal';
      var consentWithdrawal2 = consentName + '_withdrawal2';
      var consentComment = consentName + '_comment';
      var consentWithdrawalLabel = 'Date of Withdrawal of Consent';
      var consentWithdrawalConfirmationLabel = 'Confirmation Date of Withdrawal of Consent';
      if (withdrawalDisabled) {
        this.state.formData[consentWithdrawal] = null;
        this.state.formData[consentWithdrawal2] = null;
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", {
        key: consentName
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_10__.HeaderElement, {
        text: label
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_10__.SelectElement, {
        label: statusLabel,
        name: consentName,
        options: this.state.consentOptions,
        value: this.state.formData[consentName],
        onUserInput: this.setFormData,
        disabled: disabled,
        required: false
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_10__.DateElement, {
        label: consentDateLabel,
        name: consentDate,
        value: this.state.formData[consentDate],
        onUserInput: this.setFormData,
        disabled: disabled || responseDateDisabled,
        required: dateRequired
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_10__.DateElement, {
        label: consentDateConfirmationLabel,
        name: consentDate2,
        value: this.state.formData[consentDate2],
        onUserInput: this.setFormData,
        disabled: disabled || responseDateDisabled,
        required: dateRequired
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_10__.DateElement, {
        label: consentWithdrawalLabel,
        name: consentWithdrawal,
        value: this.state.formData[consentWithdrawal],
        onUserInput: this.setFormData,
        disabled: disabled || withdrawalDisabled,
        required: withdrawalRequired
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_10__.DateElement, {
        label: consentWithdrawalConfirmationLabel,
        name: consentWithdrawal2,
        value: this.state.formData[consentWithdrawal2],
        onUserInput: this.setFormData,
        disabled: disabled || withdrawalDisabled,
        required: withdrawalRequired
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_10__.TextareaElement, {
        label: "Comments",
        name: consentComment,
        value: this.state.formData[consentComment],
        onUserInput: this.setFormData,
        disabled: disabled,
        required: false
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("hr", null));
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;
      // If error occurs, return a message.
      // XXX: Replace this with a UI component for 500 errors.
      if (this.state.error) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("h3", null, "An error occurred while loading the page.");
      }
      if (!this.state.isLoaded) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(Loader__WEBPACK_IMPORTED_MODULE_9__["default"], null);
      }

      // Allow editing if user has permission
      var updateButton = loris.userHasPermission('candidate_parameter_edit') ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_10__.ButtonElement, {
        label: "Update",
        disabled: this.state.submitDisabled
      }) : null;

      // Set up vertical tabs to group consent by consent groups
      var tabList = [];
      var tabPanes = Object.keys(this.state.Data.consentGroups).map(function (consentID) {
        if (_this5.state.Data.consentGroups[consentID].Children) {
          tabList.push({
            id: consentID,
            label: _this5.state.Data.consentGroups[consentID].Label
          });
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(Tabs__WEBPACK_IMPORTED_MODULE_8__.TabPane, {
            key: consentID,
            TabId: consentID
          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_10__.FormElement, {
            name: "consentStatus",
            onSubmit: _this5.handleSubmit,
            "class": _this5.props.adjustCol ? 'col-md-15' : 'col-md-9'
          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_10__.StaticElement, {
            label: "PSCID",
            text: _this5.state.Data.pscid
          }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_10__.StaticElement, {
            label: "DCCID",
            text: _this5.state.Data.candID
          }), _this5.state.Data.consentGroups[consentID].Children.map(function (consentName) {
            return _this5.renderConsent(consentName);
          }), updateButton));
        }
      });
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", {
        className: "row"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(Tabs__WEBPACK_IMPORTED_MODULE_8__.VerticalTabs, {
        tabs: tabList,
        defaultTab: tabList[0].id,
        updateURL: false
      }, tabPanes), this.renderFormattedHistory());
    }
  }]);
  return ConsentStatus;
}(react__WEBPACK_IMPORTED_MODULE_6__.Component);
ConsentStatus.propTypes = {
  dataURL: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().string.isRequired),
  action: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().string.isRequired),
  tabName: (prop_types__WEBPACK_IMPORTED_MODULE_11___default().string)
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ConsentStatus);

/***/ }),

/***/ "./modules/consent/jsx/consent_index_forms/addConsent.js":
/*!***************************************************************!*\
  !*** ./modules/consent/jsx/consent_index_forms/addConsent.js ***!
  \***************************************************************/
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
/* harmony import */ var jsx_Form__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");






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
var AddConsentForm = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__["default"])(AddConsentForm, _Component);
  var _super = _createSuper(AddConsentForm);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function AddConsentForm(props) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, AddConsentForm);
    _this = _super.call(this, props);
    _this.state = {
      isLoaded: false,
      formData: {
        pscid: null,
        candID: null,
        email1: null,
        email2: null,
        consent_group: null,
        eConsent: false,
        centerID: null
      }
    };
    _this.setFormData = _this.setFormData.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.createConsent = _this.createConsent.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.createSendConsent = _this.createSendConsent.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.close = _this.close.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.clear = _this.clear.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    return _this;
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(AddConsentForm, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        isLoaded: true
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
     * Submit the formdata to add consent row
     */
  }, {
    key: "createConsent",
    value: function createConsent() {
      this.props.submitData(this.state.formData, 'Create', 'Consent created.', this.clear);
    }

    /**
     * Submit the formdata to add consent row and send
     */
  }, {
    key: "createSendConsent",
    value: function createSendConsent() {
      this.props.submitData(this.state.formData, 'CreateSend', 'Consent created and sent.', this.clear);
    }

    /**
     * Close modal window and reset formData
     */
  }, {
    key: "close",
    value: function close() {
      this.props.closeAddForm();
      this.clear();
    }

    /**
     * Reset blank formData
     */
  }, {
    key: "clear",
    value: function clear() {
      this.setState({
        formData: {}
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

      // When candidate & consent group are entered
      // Check if eConsent compatible
      var eConsentAvailable = false;
      if (this.state.formData['candID'] && this.state.formData['consent_group']) {
        eConsentAvailable = this.props.eConsentCompatible(this.state.formData.consent_group, this.state.formData['candID']);
      }

      // Add eConsent checkbox if eConsent compatible
      var eConsentOption = eConsentAvailable ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_8__.CheckboxElement, {
        name: "eConsent",
        label: "Add as eConsent?",
        id: "eConsent",
        value: this.state.formData.eConsent,
        onUserInput: this.setFormData
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("br", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("br", null)) : null;

      // Add email fields and send button if eConsent selected
      var email1 = this.state.formData.eConsent ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_8__.TextboxElement, {
        name: "email1",
        label: "Participant email",
        value: this.state.formData.email1,
        required: false,
        onUserInput: this.setFormData
      }) : null;
      var email2 = this.state.formData.eConsent ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_8__.TextboxElement, {
        name: "email2",
        label: "Please re-enter participant email",
        value: this.state.formData.email2,
        required: false,
        onUserInput: this.setFormData
      }) : null;
      var sendButton = this.state.formData.eConsent ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_8__.ButtonElement, {
        name: "fire_away",
        label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("span", {
          className: "glyphicon glyphicon-envelope"
        }), " Send"),
        type: "submit",
        buttonClass: "btn btn-sm btn-success",
        onUserInput: this.createSendConsent
      }) : null;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(Modal__WEBPACK_IMPORTED_MODULE_7__["default"], {
        title: "Add Consent",
        onClose: this.close,
        show: this.props.openAddConsent
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_8__.FormElement, {
        Module: "consent",
        name: "addConsent",
        id: "addConsentForm",
        method: "POST"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_8__.TextboxElement, {
        name: "candID",
        label: "CandID",
        value: this.state.formData.candID,
        required: true,
        onUserInput: this.setFormData
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_8__.TextboxElement, {
        name: "pscid",
        label: "PSCID",
        value: this.state.formData.pscid,
        required: true,
        onUserInput: this.setFormData
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_8__.SelectElement, {
        name: "consent_group",
        options: this.props.data.fieldOptions.consentGroupOptions,
        label: "Consent Form",
        value: this.state.formData.consent_group,
        required: true,
        onUserInput: this.setFormData
      }), eConsentOption, email1, email2, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_8__.ButtonElement, {
        name: "fire_away",
        label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("span", {
          className: "glyphicon glyphicon-plus"
        }), " Create"),
        type: "submit",
        buttonClass: "btn btn-sm btn-success",
        onUserInput: this.createConsent
      }), sendButton));
    }
  }]);
  return AddConsentForm;
}(react__WEBPACK_IMPORTED_MODULE_6__.Component);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AddConsentForm);

/***/ }),

/***/ "./modules/consent/jsx/consent_index_forms/addEConsent.js":
/*!****************************************************************!*\
  !*** ./modules/consent/jsx/consent_index_forms/addEConsent.js ***!
  \****************************************************************/
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
/* harmony import */ var jsx_Form__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");






function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * Add eConsent form
 * Renders the form to add consent as eConsent
 *
 * @author Camille Beaudoin
 *
 * */



/**
 * Add eConsent Form
 *
 * Component for form creating eConsent row
 *
 * @author Camille Beaudoin
 */
var AddEConsentForm = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__["default"])(AddEConsentForm, _Component);
  var _super = _createSuper(AddEConsentForm);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function AddEConsentForm(props) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, AddEConsentForm);
    _this = _super.call(this, props);
    _this.state = {
      isLoaded: false
    };
    _this.addEConsent = _this.addEConsent.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    return _this;
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(AddEConsentForm, [{
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
      // Waiting for data to load
      if (!this.state.isLoaded) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("button", {
          className: "btn-info has-spinner"
        }, "Loading", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("span", {
          className: "glyphicon glyphicon-refresh glyphicon-refresh-animate"
        }));
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_7__.FormElement, {
        Module: "consent",
        name: "sendConsent",
        id: "sendConsentForm",
        method: "POST"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, "Please click below to add '", this.props.data['Consent Form'], "' for candidate ", this.props.data['PSCID'], " as an eConsent form"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("br", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("br", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_7__.ButtonElement, {
        label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, "Add as eConsent"),
        buttonClass: "btn btn-sm btn-success",
        onUserInput: this.addEConsent
      })));
    }

    /**
     * Submit for eConsent to be added
     */
  }, {
    key: "addEConsent",
    value: function addEConsent() {
      var sendData = [];
      sendData['pscid'] = this.props.data['PSCID'];
      sendData['candID'] = this.props.data['CandID'];
      sendData['consent_group'] = this.props.data['Consent Form'];
      this.props.submitData(sendData, 'CreateEConsent', 'Form added as eConsent');
    }
  }]);
  return AddEConsentForm;
}(react__WEBPACK_IMPORTED_MODULE_6__.Component);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AddEConsentForm);

/***/ }),

/***/ "./modules/consent/jsx/consent_index_forms/expireConsent.js":
/*!******************************************************************!*\
  !*** ./modules/consent/jsx/consent_index_forms/expireConsent.js ***!
  \******************************************************************/
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
/* harmony import */ var jsx_Form__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");






function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * Expire Consent form
 *
 * Renders form for deleting expired consents /
 * setting participant to inactive
 *
 * @author Camille Beaudoin
 *
 * */



/**
 * Expire Consent Form
 *
 * Component for form expiring eConsent row
 *
 * @author Camille Beaudoin
 */
var ExpireConsentForm = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__["default"])(ExpireConsentForm, _Component);
  var _super = _createSuper(ExpireConsentForm);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function ExpireConsentForm(props) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, ExpireConsentForm);
    _this = _super.call(this, props);
    _this.state = {
      isLoaded: false,
      formData: {
        pscid: null,
        candID: null,
        consent_group: null
      }
    };
    _this.expireConsent = _this.expireConsent.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.expireAndInactivate = _this.expireAndInactivate.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    return _this;
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(ExpireConsentForm, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        isLoaded: true,
        formData: {
          pscid: this.props.data['PSCID'],
          candID: this.props.data['CandID'],
          consent_group: this.props.data['Consent Form']
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
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_7__.FormElement, {
        Module: "consent",
        name: "sendConsent",
        id: "sendConsentForm",
        method: "POST"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("p", null, "To set the eConsent form ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("b", null, this.state.formData.consent_group, " "), "to expired for ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("b", null, this.state.formData.pscid), ", please click \"Expire\". If you also wish to set the participant to inactive, please click \"Expire and Inactivate\"."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_7__.ButtonElement, {
        label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, "Expire"),
        buttonClass: "btn btn-sm btn-primary",
        onUserInput: this.expireConsent
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_7__.ButtonElement, {
        label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, "Expire and Inactivate"),
        buttonClass: "btn btn-sm btn-primary",
        onUserInput: this.expireAndInactivate
      })));
    }

    /**
     * Submit data to be expired
     */
  }, {
    key: "expireConsent",
    value: function expireConsent() {
      this.props.submitData(this.state.formData, 'Expire', 'E-Consent form set to "expired"');
    }

    /**
     * Submit data to be expired and inactivated
     */
  }, {
    key: "expireAndInactivate",
    value: function expireAndInactivate() {
      this.props.submitData(this.state.formData, 'ExpireAndInactivate', 'E-Consent form set to "expired" and candidate inactivated');
    }
  }]);
  return ExpireConsentForm;
}(react__WEBPACK_IMPORTED_MODULE_6__.Component);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ExpireConsentForm);

/***/ }),

/***/ "./modules/consent/jsx/consent_index_forms/shareConsent.js":
/*!*****************************************************************!*\
  !*** ./modules/consent/jsx/consent_index_forms/shareConsent.js ***!
  \*****************************************************************/
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
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var jsx_Form__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");






function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * Share Consent form
 *
 * Renders form for copying eConsent link or sending eConsent
 *
 * @author Camille Beaudoin
 *
 * */




/**
 * Share Consent Form
 *
 * Component for form to share eConsent
 *
 * @author Camille Beaudoin
 */
var ShareConsentForm = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__["default"])(ShareConsentForm, _Component);
  var _super = _createSuper(ShareConsentForm);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function ShareConsentForm(props) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, ShareConsentForm);
    _this = _super.call(this, props);
    _this.state = {
      formData: {
        email1: null,
        email2: null,
        pscid: null,
        candID: null,
        consent_group: null
      },
      isLoaded: false,
      showEmails: false,
      showSend: false
    };
    _this.setFormData = _this.setFormData.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.copyLink = _this.copyLink.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.sendConsent = _this.sendConsent.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.showSend = _this.showSend.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    return _this;
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(ShareConsentForm, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        isLoaded: true,
        formData: {
          email1: null,
          email2: null,
          pscid: this.props.data['PSCID'],
          candID: this.props.data['CandID'],
          consent_group: this.props.data['Consent Form']
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
      var emails;
      var submitButton;
      var startingButtons = [];

      // Show emails if user clicks "Send consent"
      if (this.state.showEmails) {
        emails = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_8__.TextboxElement, {
          name: "email1",
          label: "Participant email",
          value: this.state.formData.email1,
          required: true,
          onUserInput: this.setFormData
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_8__.TextboxElement, {
          name: "email2",
          label: "Please re-enter participant email",
          value: this.state.formData.email2,
          required: true,
          onUserInput: this.setFormData
        }));
        if (this.state.showSend) {
          submitButton = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("p", {
            className: "has-error"
          }, "Please Note: By clicking \"Send\", any email password or link that existed previously will be updated for this eConsent form."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_8__.ButtonElement, {
            label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, "Send"),
            buttonClass: "btn btn-sm btn-success",
            onUserInput: this.sendConsent
          }));
        }
      } else {
        // Show share options to start
        startingButtons.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_8__.ButtonElement, {
          label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, "Copy Link"),
          buttonClass: "btn btn-sm btn-primary",
          onUserInput: this.copyLink
        })));

        // Add button for sending
        startingButtons.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_8__.ButtonElement, {
          label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, "Send"),
          buttonClass: "btn btn-sm btn-primary",
          onUserInput: this.showSend
        })));
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(jsx_Form__WEBPACK_IMPORTED_MODULE_8__.FormElement, {
        Module: "consent",
        name: "sendConsent",
        id: "sendConsentForm",
        method: "POST"
      }, startingButtons, emails, submitButton));
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
     * Copy eConsent form link for user
     */
  }, {
    key: "copyLink",
    value: function copyLink() {
      var el = document.createElement('input');
      el.value = this.props.BaseURL + '/consent/consent_page/?key=' + this.props.data['OneTimeKey'];
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      sweetalert2__WEBPACK_IMPORTED_MODULE_7___default().fire('Success!', 'E-Consent form link copied!', 'success');
    }

    /**
     * Submit form data & send eConsent to participant
     */
  }, {
    key: "sendConsent",
    value: function sendConsent() {
      this.props.submitData(this.state.formData, 'Send', 'E-Consent form sent.');
    }

    /**
     * Display "Send consent" form elements
     */
  }, {
    key: "showSend",
    value: function showSend() {
      this.setState({
        showEmails: true,
        showSend: true
      });
    }
  }]);
  return ShareConsentForm;
}(react__WEBPACK_IMPORTED_MODULE_6__.Component);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ShareConsentForm);

/***/ }),

/***/ "./node_modules/fbjs/lib/emptyFunction.js":
/*!************************************************!*\
  !*** ./node_modules/fbjs/lib/emptyFunction.js ***!
  \************************************************/
/***/ ((module) => {

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
/***/ ((module) => {

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
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

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

/***/ "./node_modules/react-addons-create-fragment/index.js":
/*!************************************************************!*\
  !*** ./node_modules/react-addons-create-fragment/index.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var React = __webpack_require__(/*! react */ "react");

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

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayLikeToArray)
/* harmony export */ });
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayWithHoles)
/* harmony export */ });
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

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

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
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

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _iterableToArrayLimit)
/* harmony export */ });
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _nonIterableRest)
/* harmony export */ });
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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

/***/ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _slicedToArray)
/* harmony export */ });
/* harmony import */ var _arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js");
/* harmony import */ var _iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArrayLimit.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableRest.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js");




function _slicedToArray(arr, i) {
  return (0,_arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || (0,_iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arr, i) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arr, i) || (0,_nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
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

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _unsupportedIterableToArray)
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
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
  !*** ./modules/consent/jsx/consentIndex.js ***!
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
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var Loader__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! Loader */ "./jsx/Loader.js");
/* harmony import */ var FilterableDataTable__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! FilterableDataTable */ "./jsx/FilterableDataTable.js");
/* harmony import */ var TriggerableModal__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! TriggerableModal */ "./jsx/TriggerableModal.js");
/* harmony import */ var _consent_index_forms_addConsent__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./consent_index_forms/addConsent */ "./modules/consent/jsx/consent_index_forms/addConsent.js");
/* harmony import */ var _consent_index_forms_addEConsent__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./consent_index_forms/addEConsent */ "./modules/consent/jsx/consent_index_forms/addEConsent.js");
/* harmony import */ var _consent_index_forms_shareConsent__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./consent_index_forms/shareConsent */ "./modules/consent/jsx/consent_index_forms/shareConsent.js");
/* harmony import */ var _consent_index_forms_expireConsent__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./consent_index_forms/expireConsent */ "./modules/consent/jsx/consent_index_forms/expireConsent.js");
/* harmony import */ var _candidate_parameters_jsx_ConsentStatus__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./../../candidate_parameters/jsx/ConsentStatus */ "./modules/candidate_parameters/jsx/ConsentStatus.js");






function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }











/**
 * Consent Module Page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders Consent main page consisting of FilterableDataTable and FormElement.
 *
 * @author Camille Beaudoin
 *
 */
var ConsentIndex = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__["default"])(ConsentIndex, _Component);
  var _super = _createSuper(ConsentIndex);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function ConsentIndex(props) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, ConsentIndex);
    _this = _super.call(this, props);
    _this.state = {
      data: {},
      error: false,
      isLoaded: false,
      openAddConsent: false
    };
    _this.fetchData = _this.fetchData.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.formatColumn = _this.formatColumn.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.renderAddConsentForm = _this.renderAddConsentForm.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.openAddForm = _this.openAddForm.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.closeAddForm = _this.closeAddForm.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.submitData = _this.submitData.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    _this.eConsentCompatible = _this.eConsentCompatible.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    return _this;
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(ConsentIndex, [{
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
      })["catch"](function (error) {
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
     * @return {*} a formatted table cell for a given column
     */
  }, {
    key: "formatColumn",
    value: function formatColumn(column, cell, row) {
      if (column === 'PSCID') {
        // Link to candidate
        var url = this.props.BaseURL + '/' + row['CandID'] + '/';
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("a", {
          href: url
        }, cell));
      } else if (column === 'Consent Form' && this.props.hasPermission('consent_edit')) {
        // Link to eConsent
        var _url;
        if (row['OneTimeKey'] !== 'NA') {
          _url = this.props.BaseURL + '/consent/consent_page/?key=' + row['OneTimeKey'];
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("a", {
            href: _url
          }, cell));
        }
      } else if ((column === 'Request Status' || column === 'Consent Status') && cell) {
        // Format casing

        var text = cell.charAt(0).toUpperCase() + cell.slice(1);
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("td", null, text);
      } else if (column === 'Actions') {
        var editButton = '';
        if (this.props.hasPermission('consent_edit') && (this.props.hasPermission('candidate_parameter_edit') || this.props.hasPermission('access_all_profiles') || this.props.hasPermission('candidate_parameter_view'))) {
          // Set up action buttons in action column
          var editActionURL = this.props.BaseURL + '/candidate_parameters/ajax/formHandler.php';
          var editDataURL = this.props.BaseURL + '/candidate_parameters/ajax/getData.php?candID=' + row['CandID'] + '&data=consentStatus&consent=' + row['consentID'];

          // Add edit button for all rows
          editButton = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(TriggerableModal__WEBPACK_IMPORTED_MODULE_10__["default"], {
            title: "Edit Consent",
            label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("span", {
              className: "glyphicon glyphicon-edit"
            })
          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(_candidate_parameters_jsx_ConsentStatus__WEBPACK_IMPORTED_MODULE_15__["default"], {
            action: editActionURL,
            dataURL: editDataURL,
            tabName: "consentStatus",
            adjustCol: true
          }));
        }
        // Add Send button if eConsent created
        if (row['OneTimeKey'] !== 'NA') {
          var shareButton = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(TriggerableModal__WEBPACK_IMPORTED_MODULE_10__["default"], {
            title: "Send Consent",
            label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("span", {
              className: "glyphicon glyphicon-share"
            })
          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(_consent_index_forms_shareConsent__WEBPACK_IMPORTED_MODULE_13__["default"], {
            submitData: this.submitData,
            data: row,
            BaseURL: this.props.BaseURL
          }));
          if (row['Request Status'] != 'expired' && this.props.hasPermission('candidate_parameter_edit')) {
            var expireButton = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(TriggerableModal__WEBPACK_IMPORTED_MODULE_10__["default"], {
              title: "Expire Consent",
              label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("span", {
                className: "glyphicon glyphicon-remove-circle"
              })
            }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(_consent_index_forms_expireConsent__WEBPACK_IMPORTED_MODULE_14__["default"], {
              submitData: this.submitData,
              data: row,
              BaseURL: this.props.BaseURL
            }));
            return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", {
              "class": "action-cell"
            }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("td", null, editButton), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("td", null, shareButton), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("td", null, expireButton));
          } else {
            return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", {
              "class": "action-cell"
            }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("td", null, editButton), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("td", null, shareButton));
          }
        } else if (this.eConsentCompatible(row['consent_group_name'], row['CandID']) && row['OneTimeKey'] === 'NA') {
          // Button to add as eConsent if eConsent compatible & not yet added
          var addEConsentButton = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(TriggerableModal__WEBPACK_IMPORTED_MODULE_10__["default"], {
            title: "Add eConsent",
            label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("span", {
              className: "glyphicon glyphicon-globe"
            })
          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(_consent_index_forms_addEConsent__WEBPACK_IMPORTED_MODULE_12__["default"], {
            submitData: this.submitData,
            data: row,
            BaseURL: this.props.BaseURL
          }));
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", {
            "class": "action-cell"
          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("td", null, editButton), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("td", null, addEConsentButton));
        } else {
          // Add only editButton if not eConsent compatible
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", {
            "class": "action-cell"
          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("td", null, editButton));
        }
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("td", null, cell);
    }

    /**
     * Render form to add consent row
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "renderAddConsentForm",
    value: function renderAddConsentForm() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(_consent_index_forms_addConsent__WEBPACK_IMPORTED_MODULE_11__["default"], {
        data: this.state.data,
        closeAddForm: this.closeAddForm,
        openAddConsent: this.state.openAddConsent,
        submitData: this.submitData,
        eConsentCompatible: this.eConsentCompatible
      });
    }

    /**
     * open add consent form
     */
  }, {
    key: "openAddForm",
    value: function openAddForm() {
      this.setState({
        openAddConsent: true
      });
    }

    /**
     * close add conent form
     */
  }, {
    key: "closeAddForm",
    value: function closeAddForm() {
      this.setState({
        openAddConsent: false
      });
    }

    /**
     * Submit formData to add / update consent rows in DB
     * This submit function functions with all forms accessible from
     * consent index.
     * @param {array} values - Values to be submitted
     * @param {string} action - Action to take
     * @param {string} successMessage - message to display upon submission
     * @param {function} successFn - additional function for successs
     *
     */
  }, {
    key: "submitData",
    value: function submitData(values, action, successMessage) {
      var _this4 = this;
      var successFn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      // create formObject for submit values
      var formObject = new FormData();
      for (var key in values) {
        if (values[key] !== '') {
          formObject.append(key, values[key]);
        }
      }
      formObject.append('action', action);

      // POST data
      fetch(this.props.submitURL, {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
        body: formObject
      }).then(function (resp) {
        // give success message if successful
        if (resp.ok && resp.status === 200) {
          sweetalert2__WEBPACK_IMPORTED_MODULE_7___default().fire('Success!', successMessage, 'success').then(function (result) {
            if (result.value) {
              _this4.closeAddForm();
              _this4.fetchData();
            }
          });
          // call on success function if given
          if (successFn !== null) {
            successFn();
          }
        } else {
          // give error if unsuccessful
          resp.text().then(function (message) {
            var msg = JSON.parse(message);
            sweetalert2__WEBPACK_IMPORTED_MODULE_7___default().fire('Error!', msg.error, 'error');
          });
        }
      })["catch"](function (error) {
        console.error(error);
      });
    }

    /**
     * Checks if consent form is eConsent compatible
     * @param {array} consentGroupName
     * @param {string} CandID
     *
     * @return {bool} - true if compatible
     */
  }, {
    key: "eConsentCompatible",
    value: function eConsentCompatible(consentGroupName, CandID) {
      // Get Candidate CenterID
      var CenterID = this.state.data.fieldOptions.centerIDs[CandID];
      var eConsentForms = this.state.data.fieldOptions.eConsentForms;
      // eConsent compatible if centerID exists in rel table for
      // consent form, or null centerID (default) exists in rel table
      for (var i = 0; i < eConsentForms.length; i++) {
        if (eConsentForms[i].Name == consentGroupName && (eConsentForms[i].CenterID == CenterID || !eConsentForms[i].CenterID)) {
          return true;
        }
      }
      return false;
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
  }, {
    key: "render",
    value: function render() {
      // If error occurs, return a message.
      if (this.state.error) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("h3", null, "An error occured while loading the page.");
      }

      // Waiting for async data to load
      if (!this.state.isLoaded) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(Loader__WEBPACK_IMPORTED_MODULE_8__["default"], null);
      }
      var options = this.state.data.fieldOptions;
      var fields = [{
        label: 'PSCID',
        show: true,
        filter: {
          name: 'PSCID',
          type: 'text'
        }
      }, {
        label: 'CandID',
        show: true,
        filter: {
          name: 'CandID',
          type: 'text'
        }
      }, {
        label: 'Consent Form',
        show: true,
        filter: {
          name: 'Consent_group',
          type: 'select',
          options: options.consentGroupLabels
        }
      }, {
        label: 'Consent Code',
        show: true,
        filter: {
          name: 'Consent_form',
          type: 'select',
          options: options.consentLabels
        }
      }, {
        label: 'Request Status',
        show: true,
        filter: {
          name: 'RequestStatus',
          type: 'select',
          options: options.requestStatus
        }
      }, {
        label: 'Consent Status',
        show: true,
        filter: {
          name: 'ConsentStatus',
          type: 'select',
          options: options.consentStatus
        }
      }, {
        label: 'Date Given',
        show: true,
        filter: {
          name: 'DateGiven',
          type: 'date'
        }
      }, {
        label: 'Date Withdrawn',
        show: true,
        filter: {
          name: 'DateWithdrawn',
          type: 'date'
        }
      }, {
        label: 'Date Sent',
        show: true,
        filter: {
          name: 'Date_sent',
          type: 'date'
        }
      }, {
        label: 'Version',
        show: true
      }, {
        label: 'Actions',
        show: this.props.hasPermission('consent_edit')
      }, {
        label: 'consent_group_name',
        show: false
      }, {
        label: 'OneTimeKey',
        show: false
      }, {
        label: 'consentID',
        show: false
      }];

      // Add edit consent action
      var actions = this.props.hasPermission('consent_edit') ? [{
        name: 'addConsent',
        label: 'Add Consent',
        action: this.openAddForm
      }] : null;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement("div", null, this.renderAddConsentForm(), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(FilterableDataTable__WEBPACK_IMPORTED_MODULE_9__["default"], {
        name: "consent",
        title: "Consent",
        data: this.state.data.Data,
        fields: fields,
        getFormattedCell: this.formatColumn,
        actions: actions
      }));
    }
  }]);
  return ConsentIndex;
}(react__WEBPACK_IMPORTED_MODULE_6__.Component);
ConsentIndex.propTypes = {
  dataURL: (prop_types__WEBPACK_IMPORTED_MODULE_16___default().string.isRequired),
  hasPermission: (prop_types__WEBPACK_IMPORTED_MODULE_16___default().func.isRequired)
};
window.addEventListener('load', function () {
  ReactDOM.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default().createElement(ConsentIndex, {
    dataURL: "".concat(loris.BaseURL, "/consent/?format=json"),
    submitURL: "".concat(loris.BaseURL, "/consent/consentdatahandler"),
    BaseURL: loris.BaseURL,
    hasPermission: loris.userHasPermission
  }), document.getElementById('lorisworkspace'));
});
})();

((window.lorisjs = window.lorisjs || {}).consent = window.lorisjs.consent || {}).consentIndex = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=consentIndex.js.map