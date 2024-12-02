/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./jsx/DataTable.js":
/*!**************************!*\
  !*** ./jsx/DataTable.js ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof3 = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js"));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _PaginationLinks = _interopRequireDefault(__webpack_require__(/*! jsx/PaginationLinks */ "./jsx/PaginationLinks.js"));
var _reactAddonsCreateFragment = _interopRequireDefault(__webpack_require__(/*! react-addons-create-fragment */ "./node_modules/react-addons-create-fragment/index.js"));
var _Form = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof3(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * Data Table component
 * Displays a set of data that is receives via props.
 */
var DataTable = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(DataTable, _Component);
  var _super = _createSuper(DataTable);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function DataTable(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, DataTable);
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
    _this.changePage = _this.changePage.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setSortColumn = _this.setSortColumn.bind((0, _assertThisInitialized2["default"])(_this));
    _this.updateSortColumn = _this.updateSortColumn.bind((0, _assertThisInitialized2["default"])(_this));
    _this.toggleSortOrder = _this.toggleSortOrder.bind((0, _assertThisInitialized2["default"])(_this));
    _this.updatePageNumber = _this.updatePageNumber.bind((0, _assertThisInitialized2["default"])(_this));
    _this.updatePageRows = _this.updatePageRows.bind((0, _assertThisInitialized2["default"])(_this));
    _this.downloadCSV = _this.downloadCSV.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getFilteredRowIndexes = _this.getFilteredRowIndexes.bind((0, _assertThisInitialized2["default"])(_this));
    _this.sortRows = _this.sortRows.bind((0, _assertThisInitialized2["default"])(_this));
    _this.hasFilterKeyword = _this.hasFilterKeyword.bind((0, _assertThisInitialized2["default"])(_this));
    _this.renderActions = _this.renderActions.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  /**
   * Set the component page variable
   * to a new value
   *
   * @param {number} i - Page index
   */
  (0, _createClass2["default"])(DataTable, [{
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
        var isNumber = !isNaN(val) && (0, _typeof2["default"])(val) !== 'object';
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
        switch ((0, _typeof2["default"])(data)) {
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
      if ((0, _typeof2["default"])(filterData) === 'object') {
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
            return /*#__PURE__*/_react["default"].createElement(_Form.CTA, {
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
        return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
          className: "row"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "col-xs-12"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "pull-right",
          style: {
            marginRight: '10px'
          }
        }, this.renderActions()))), /*#__PURE__*/_react["default"].createElement("div", {
          className: "alert alert-info no-result-found-panel"
        }, /*#__PURE__*/_react["default"].createElement("strong", null, "No result found.")));
      }
      var rowsPerPage = this.state.page.rows;
      var headers = this.props.hide.defaultColumn === true ? [] : [/*#__PURE__*/_react["default"].createElement("th", {
        key: "th_col_0",
        onClick: function onClick() {
          _this4.setSortColumn(-1);
        }
      }, this.props.rowNumLabel)];
      var _loop = function _loop(i) {
        if (_this4.props.fields[i].show === true) {
          var colIndex = i + 1;
          if (_this4.props.fields[i].freezeColumn === true) {
            headers.push( /*#__PURE__*/_react["default"].createElement("th", {
              key: 'th_col_' + colIndex,
              id: _this4.props.freezeColumn,
              onClick: function onClick() {
                _this4.setSortColumn(i);
              }
            }, _this4.props.fields[i].label));
          } else {
            headers.push( /*#__PURE__*/_react["default"].createElement("th", {
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
            cell = /*#__PURE__*/_react["default"].createElement("td", null, celldata);
          }
          if (cell !== null) {
            curRow.push( /*#__PURE__*/_react["default"].cloneElement(cell, {
              key: 'td_col_' + j
            }));
          } else {
            curRow.push((0, _reactAddonsCreateFragment["default"])({
              celldata: celldata
            }));
          }
        };
        for (var j = 0; j < _this4.props.fields.length; j += 1) {
          var _ret = _loop3(j);
          if (_ret === "continue") continue;
        }
        var rowIndexDisplay = index[_i2].Content;
        rows.push( /*#__PURE__*/_react["default"].createElement("tr", {
          key: 'tr_' + rowIndex,
          colSpan: headers.length
        }, _this4.props.hide.defaultColumn === true ? null : /*#__PURE__*/_react["default"].createElement("td", {
          key: 'td_' + rowIndex
        }, rowIndexDisplay), curRow));
      };
      for (var _i2 = currentPageRow; _i2 < filteredCount && rows.length < rowsPerPage; _i2++) {
        _loop2(_i2);
      }
      var rowsPerPageDropdown = /*#__PURE__*/_react["default"].createElement("select", {
        className: "input-sm perPage",
        onChange: this.updatePageRows,
        value: this.state.page.rows
      }, /*#__PURE__*/_react["default"].createElement("option", null, "20"), /*#__PURE__*/_react["default"].createElement("option", null, "50"), /*#__PURE__*/_react["default"].createElement("option", null, "100"), /*#__PURE__*/_react["default"].createElement("option", null, "1000"), /*#__PURE__*/_react["default"].createElement("option", null, "5000"), /*#__PURE__*/_react["default"].createElement("option", null, "10000"));
      var loading = this.props.loading ? 'Loading...' : '';
      var header = this.props.hide.rowsPerPage === true ? '' : /*#__PURE__*/_react["default"].createElement("div", {
        className: "table-header"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '5px 15px'
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          order: '1',
          padding: '5px 0'
        }
      }, rows.length, " rows displayed of ", filteredCount, ". (Maximum rows per page: ", rowsPerPageDropdown, ")", loading), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          order: '2',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '5px 0',
          marginLeft: 'auto'
        }
      }, this.renderActions(), this.props.hide.downloadCSV === true ? '' : /*#__PURE__*/_react["default"].createElement("button", {
        className: "btn btn-primary",
        onClick: this.downloadCSV.bind(null, filteredRowIndexes)
      }, "Download Table as CSV"), /*#__PURE__*/_react["default"].createElement(_PaginationLinks["default"], {
        Total: filteredCount,
        onChangePage: this.changePage,
        RowsPerPage: rowsPerPage,
        Active: this.state.page.number
      })))));
      var footer = /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '5px 15px'
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          order: '1',
          padding: '5px 0'
        }
      }, rows.length, " rows displayed of ", filteredCount, ". (Maximum rows per page: ", rowsPerPageDropdown, ")"), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          order: '2',
          padding: '5px 0',
          marginLeft: 'auto'
        }
      }, /*#__PURE__*/_react["default"].createElement(_PaginationLinks["default"], {
        Total: filteredCount,
        onChangePage: this.changePage,
        RowsPerPage: rowsPerPage,
        Active: this.state.page.number
      })))));
      return /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          margin: '14px'
        }
      }, header, /*#__PURE__*/_react["default"].createElement("table", {
        className: "table table-hover table-primary table-bordered dynamictable",
        id: "dynamictable"
      }, /*#__PURE__*/_react["default"].createElement("thead", null, /*#__PURE__*/_react["default"].createElement("tr", {
        className: "info"
      }, headers)), this.props.folder, /*#__PURE__*/_react["default"].createElement("tbody", null, rows)), footer);
    }
  }]);
  return DataTable;
}(_react.Component);
DataTable.propTypes = {
  data: _propTypes["default"].array.isRequired,
  rowNumLabel: _propTypes["default"].string,
  // Function of which returns a JSX element for a table cell, takes
  // parameters of the form: func(ColumnName, CellData, EntireRowData)
  getFormattedCell: _propTypes["default"].func,
  onSort: _propTypes["default"].func,
  actions: _propTypes["default"].array,
  hide: _propTypes["default"].object,
  nullTableShow: _propTypes["default"].bool,
  noDynamicTable: _propTypes["default"].bool,
  getMappedCell: _propTypes["default"].func,
  fields: _propTypes["default"].array,
  RowNameMap: _propTypes["default"].array,
  filters: _propTypes["default"].object,
  freezeColumn: _propTypes["default"].string,
  loading: _propTypes["default"].element,
  folder: _propTypes["default"].element
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
var _default = exports["default"] = DataTable;

/***/ }),

/***/ "./jsx/Filter.js":
/*!***********************!*\
  !*** ./jsx/Filter.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _Form = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");
var _DateTimePartialElement = _interopRequireDefault(__webpack_require__(/*! jsx/form/DateTimePartialElement */ "./jsx/form/DateTimePartialElement.tsx"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
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
  (0, _react.useEffect)(function () {
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
    var exactMatch = !(type === 'text' || type === 'date' || type === 'datetime' || type === 'multiselect');
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
            element = /*#__PURE__*/_react["default"].createElement(_Form.TextboxElement, null);
            break;
          case 'select':
            element = /*#__PURE__*/_react["default"].createElement(_Form.SelectElement, {
              options: filter.options,
              sortByValue: filter.sortByValue,
              autoSelect: false
            });
            break;
          case 'multiselect':
            element = /*#__PURE__*/_react["default"].createElement(_Form.SelectElement, {
              options: filter.options,
              sortByValue: filter.sortByValue,
              multiple: true,
              emptyOption: false
            });
            break;
          case 'numeric':
            element = /*#__PURE__*/_react["default"].createElement(_Form.NumericElement, {
              options: filter.options
            });
            break;
          case 'date':
            element = /*#__PURE__*/_react["default"].createElement(_Form.DateElement, null);
            break;
          case 'datetime':
            element = /*#__PURE__*/_react["default"].createElement(_DateTimePartialElement["default"], null);
            break;
          case 'checkbox':
            element = /*#__PURE__*/_react["default"].createElement(_Form.CheckboxElement, null);
            break;
          case 'time':
            element = /*#__PURE__*/_react["default"].createElement(_Form.TimeElement, null);
            break;
          default:
            element = /*#__PURE__*/_react["default"].createElement(_Form.TextboxElement, null);
        }

        // The value prop has to default to false if the first two options
        // are undefined so that the checkbox component is a controlled input
        // element with a starting default value
        result.push( /*#__PURE__*/_react["default"].cloneElement(element, {
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
        return /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement("a", {
          onClick: handleClick
        }, preset.label));
      });
      return /*#__PURE__*/_react["default"].createElement("li", {
        className: "dropdown"
      }, /*#__PURE__*/_react["default"].createElement("a", {
        className: "dropdown-toggle",
        "data-toggle": "dropdown",
        role: "button"
      }, "Load Filter Preset ", /*#__PURE__*/_react["default"].createElement("span", {
        className: "caret"
      })), /*#__PURE__*/_react["default"].createElement("ul", {
        className: "dropdown-menu",
        role: "menu"
      }, presets));
    }
  };
  var filterActions = /*#__PURE__*/_react["default"].createElement("ul", {
    className: "nav nav-tabs navbar-right",
    style: {
      borderBottom: 'none'
    }
  }, filterPresets(), /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement("a", {
    role: "button",
    name: "reset",
    onClick: props.clearFilters
  }, "Clear Filter")));
  return /*#__PURE__*/_react["default"].createElement(_Form.FormElement, {
    id: props.id,
    name: props.name
  }, /*#__PURE__*/_react["default"].createElement(_Form.FieldsetElement, {
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
  filters: _propTypes["default"].object.isRequired,
  clearFilter: _propTypes["default"].func.isRequired,
  id: _propTypes["default"].string,
  name: _propTypes["default"].string,
  columns: _propTypes["default"].number,
  title: _propTypes["default"].string,
  fields: _propTypes["default"].array.isRequired,
  removeFilter: _propTypes["default"].func,
  addFilter: _propTypes["default"].func,
  filterPresets: _propTypes["default"].array,
  updateFilters: _propTypes["default"].func,
  clearFilters: _propTypes["default"].func
};
var _default = exports["default"] = Filter;

/***/ }),

/***/ "./jsx/FilterableDataTable.js":
/*!************************************!*\
  !*** ./jsx/FilterableDataTable.js ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _Panel = _interopRequireDefault(__webpack_require__(/*! jsx/Panel */ "./jsx/Panel.js"));
var _DataTable = _interopRequireDefault(__webpack_require__(/*! jsx/DataTable */ "./jsx/DataTable.js"));
var _Filter = _interopRequireDefault(__webpack_require__(/*! jsx/Filter */ "./jsx/Filter.js"));
var _ProgressBar = _interopRequireDefault(__webpack_require__(/*! jsx/ProgressBar */ "./jsx/ProgressBar.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
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
  (0, _inherits2["default"])(FilterableDataTable, _Component);
  var _super = _createSuper(FilterableDataTable);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function FilterableDataTable(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, FilterableDataTable);
    _this = _super.call(this, props);
    _this.state = {
      filters: {}
    };
    _this.updateFilters = _this.updateFilters.bind((0, _assertThisInitialized2["default"])(_this));
    _this.clearFilters = _this.clearFilters.bind((0, _assertThisInitialized2["default"])(_this));
    _this.validFilters = _this.validFilters.bind((0, _assertThisInitialized2["default"])(_this));
    _this.addFilter = _this.addFilter.bind((0, _assertThisInitialized2["default"])(_this));
    _this.removeFilter = _this.removeFilter.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  /**
   * Updates filter state
   *
   * @param {object} filters
   */
  (0, _createClass2["default"])(FilterableDataTable, [{
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
        var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
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
      var filter = /*#__PURE__*/_react["default"].createElement(_Filter["default"], {
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
      var progress = this.props.progress;
      var dataTable = !isNaN(progress) && progress < 100 ? /*#__PURE__*/_react["default"].createElement(_ProgressBar["default"], {
        value: progress
      }) : /*#__PURE__*/_react["default"].createElement(_DataTable["default"], {
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
      return /*#__PURE__*/_react["default"].createElement(_Panel["default"], {
        title: this.props.title
      }, filter, this.props.children, dataTable);
    }
  }]);
  return FilterableDataTable;
}(_react.Component);
FilterableDataTable.defaultProps = {
  columns: 3,
  noDynamicTable: false
};
FilterableDataTable.propTypes = {
  name: _propTypes["default"].string.isRequired,
  title: _propTypes["default"].string,
  data: _propTypes["default"].array.isRequired,
  filterPresets: _propTypes["default"].object,
  fields: _propTypes["default"].array.isRequired,
  columns: _propTypes["default"].number,
  getFormattedCell: _propTypes["default"].func,
  actions: _propTypes["default"].array,
  updateFilterCallback: _propTypes["default"].func,
  noDynamicTable: _propTypes["default"].bool,
  loading: _propTypes["default"].element,
  progress: _propTypes["default"].number,
  getMappedCell: _propTypes["default"].func,
  folder: _propTypes["default"].element,
  nullTableShow: _propTypes["default"].element,
  children: _propTypes["default"].node
};
var _default = exports["default"] = FilterableDataTable;

/***/ }),

/***/ "./jsx/Form.js":
/*!*********************!*\
  !*** ./jsx/Form.js ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

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
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof3(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } } /**
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
        formElementsHTML.push( /*#__PURE__*/_react["default"].createElement("div", {
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
        if ( /*#__PURE__*/_react["default"].isValidElement(child) && typeof child.type === 'function') {
          elementClass = colClass;
        }
        formElementsHTML.push( /*#__PURE__*/_react["default"].createElement("div", {
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
        if ( /*#__PURE__*/_react["default"].isValidElement(child) && typeof child.type === 'function') {
          elementClass = colClass;
        }
        formElementsHTML.push( /*#__PURE__*/_react["default"].createElement("div", {
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
          var isDisabled = (newOptions[option] in disabledOptions);
          return /*#__PURE__*/_react["default"].createElement("option", {
            value: newOptions[option],
            key: newOptions[option],
            disabled: isDisabled
          }, option);
        });
      } else {
        optionList = Object.keys(options).map(function (option) {
          var isDisabled = (option in disabledOptions);
          return /*#__PURE__*/_react["default"].createElement("option", {
            value: option,
            key: option,
            disabled: isDisabled
          }, options[option]);
        });
      }
      if (this.props.placeholder !== '') {
        optionList.unshift( /*#__PURE__*/_react["default"].createElement("option", {
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
        inputClass = 'col-sm-9';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: elementClass
      }, this.props.label && /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label,
        required: this.props.required
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
        disabled: this.props.disabled
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
  sortByValue: _propTypes["default"].bool
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
        onChange: this.handleChange
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
  onUserBlur: _propTypes["default"].func
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
  onUserBlur: function onUserBlur() {}
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
    var _this10;
    (0, _classCallCheck2["default"])(this, PasswordElement);
    _this10 = _super9.call(this, props);
    _this10.state = {
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

    _this10.handleChange = _this10.handleChange.bind((0, _assertThisInitialized2["default"])(_this10));
    _this10.handleBlur = _this10.handleBlur.bind((0, _assertThisInitialized2["default"])(_this10));
    // callback called to toogle the visibility
    _this10.toggleVisibility = _this10.toggleVisibility.bind((0, _assertThisInitialized2["default"])(_this10));
    return _this10;
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
var DateElement = exports.DateElement = /*#__PURE__*/function (_Component10) {
  (0, _inherits2["default"])(DateElement, _Component10);
  var _super10 = _createSuper(DateElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function DateElement(props) {
    var _this11;
    (0, _classCallCheck2["default"])(this, DateElement);
    _this11 = _super10.call(this, props);
    _this11.handleChange = _this11.handleChange.bind((0, _assertThisInitialized2["default"])(_this11));
    return _this11;
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
      var wrapperClass = this.props.label ? 'col-sm-9' : 'col-sm-12';
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: elementClass
      }, this.props.label && /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label,
        required: this.props.required
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
  onUserInput: _propTypes["default"].func
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
  }
};

/**
 * Time Component
 * React wrapper for a <input type="time"> element.
 */
var TimeElement = exports.TimeElement = /*#__PURE__*/function (_Component11) {
  (0, _inherits2["default"])(TimeElement, _Component11);
  var _super11 = _createSuper(TimeElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function TimeElement(props) {
    var _this12;
    (0, _classCallCheck2["default"])(this, TimeElement);
    _this12 = _super11.call(this, props);
    _this12.handleChange = _this12.handleChange.bind((0, _assertThisInitialized2["default"])(_this12));
    return _this12;
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
      var wrapperClass = this.props.label ? 'col-sm-9' : 'col-sm-12';
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "row form-group"
      }, this.props.label && /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label,
        required: this.props.required
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
  onUserInput: _propTypes["default"].func
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
var DateTimeElement = exports.DateTimeElement = /*#__PURE__*/function (_Component12) {
  (0, _inherits2["default"])(DateTimeElement, _Component12);
  var _super12 = _createSuper(DateTimeElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function DateTimeElement(props) {
    var _this13;
    (0, _classCallCheck2["default"])(this, DateTimeElement);
    _this13 = _super12.call(this, props);
    _this13.handleChange = _this13.handleChange.bind((0, _assertThisInitialized2["default"])(_this13));
    return _this13;
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
var NumericElement = exports.NumericElement = /*#__PURE__*/function (_Component13) {
  (0, _inherits2["default"])(NumericElement, _Component13);
  var _super13 = _createSuper(NumericElement);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function NumericElement(props) {
    var _this14;
    (0, _classCallCheck2["default"])(this, NumericElement);
    _this14 = _super13.call(this, props);
    _this14.handleChange = _this14.handleChange.bind((0, _assertThisInitialized2["default"])(_this14));
    return _this14;
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
      var wrapperClass = this.props.label ? 'col-sm-9' : 'col-sm-12';

      // Add error message
      if (this.props.errorMessage) {
        errorMessage = /*#__PURE__*/_react["default"].createElement("span", null, this.props.errorMessage);
        elementClass = 'row form-group has-error';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: elementClass
      }, this.props.label && /*#__PURE__*/_react["default"].createElement(_InputLabel["default"], {
        label: this.props.label,
        required: this.props.required
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
  errorMessage: _propTypes["default"].string
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
var FileElement = exports.FileElement = /*#__PURE__*/function (_Component14) {
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
      }), " Browse", /*#__PURE__*/_react["default"].createElement("input", {
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
  onUserInput: _propTypes["default"].func
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
      }, this.props.disabled ? 'Uploading...' : this.props.label)));
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
  style: _propTypes["default"].object,
  onUserInput: _propTypes["default"].func,
  columnSize: _propTypes["default"].string,
  buttonClass: _propTypes["default"].string
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
          content.push( /*#__PURE__*/_react["default"].createElement("div", {
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
      layout.push( /*#__PURE__*/_react["default"].createElement("div", {
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
};

/***/ }),

/***/ "./jsx/PaginationLinks.js":
/*!********************************!*\
  !*** ./jsx/PaginationLinks.js ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * Pagination component
 */
var PaginationLinks = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(PaginationLinks, _Component);
  var _super = _createSuper(PaginationLinks);
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  function PaginationLinks(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, PaginationLinks);
    _this = _super.call(this, props);
    _this.state = {};
    _this.changePage = _this.changePage.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  /**
   * Called by React when the component is updated.
   *
   * @param {object} prevProps - Previous React Component properties
   */
  (0, _createClass2["default"])(PaginationLinks, [{
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
        return /*#__PURE__*/_react["default"].createElement("div", null);
      }
      if (this.props.Total < this.props.RowsPerPage) {
        return /*#__PURE__*/_react["default"].createElement("div", null);
      }
      if (lastShownPage - startPage <= 7) {
        lastShownPage = startPage + 6;
        if (lastShownPage > lastPage) {
          lastShownPage = lastPage;
          startPage = lastPage - 6;
        }
      }
      if (startPage > 1) {
        pageLinks.push( /*#__PURE__*/_react["default"].createElement("li", {
          key: 'table_page_beginning_' + startPage.toString(),
          onClick: this.changePage(1)
        }, /*#__PURE__*/_react["default"].createElement("a", {
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
        return /*#__PURE__*/_react["default"].createElement("div", null);
      }
      for (var i = startPage; i <= lastShownPage; i += 1) {
        classList = '';
        if (this.props.Active === i) {
          classList = 'active';
        }
        pageLinks.push( /*#__PURE__*/_react["default"].createElement("li", {
          key: 'table_page_' + i.toString(),
          onClick: this.changePage(i),
          className: classList
        }, /*#__PURE__*/_react["default"].createElement("a", {
          href: "#"
        }, i)));
      }
      if (lastShownPage !== lastPage) {
        pageLinks.push( /*#__PURE__*/_react["default"].createElement("li", {
          key: 'table_page_more_' + lastShownPage.toString(),
          onClick: this.changePage(lastPage)
        }, /*#__PURE__*/_react["default"].createElement("a", {
          href: "#"
        }, "\xBB")));
      }
      return /*#__PURE__*/_react["default"].createElement("ul", {
        className: "pagination pagination-table"
      }, pageLinks);
    }
  }]);
  return PaginationLinks;
}(_react.Component);
PaginationLinks.propTypes = {
  onChangePage: _propTypes["default"].func,
  Total: _propTypes["default"].number.isRequired,
  RowsPerPage: _propTypes["default"].number,
  Active: _propTypes["default"].number
};
PaginationLinks.defaultProps = {
  RowsPerPage: 10,
  Active: 1
};
window.PaginationLinks = PaginationLinks;
var _default = exports["default"] = PaginationLinks;

/***/ }),

/***/ "./jsx/Panel.js":
/*!**********************!*\
  !*** ./jsx/Panel.js ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
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
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    collapsed = _useState2[0],
    setCollapsed = _useState2[1];
  var _useState3 = (0, _react.useState)(0),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    activeView = _useState4[0],
    setActiveView = _useState4[1];

  /**
   * Similar to componentDidMount and componentDidUpdate.
   */
  (0, _react.useEffect)(function () {
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
        var _step$value = (0, _slicedToArray2["default"])(_step.value, 2),
          index = _step$value[0],
          view = _step$value[1];
        views.push( /*#__PURE__*/_react["default"].createElement("li", {
          key: index,
          onClick: function onClick() {
            return viewClicked(index);
          },
          className: index === activeView ? 'active' : null
        }, /*#__PURE__*/_react["default"].createElement("a", {
          "data-target": "".concat(index, "_panel_content")
        }, view['title'])));
        content.push( /*#__PURE__*/_react["default"].createElement("div", {
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
    panelViews = /*#__PURE__*/_react["default"].createElement("div", {
      className: "btn-group views"
    }, /*#__PURE__*/_react["default"].createElement("button", {
      type: "button",
      className: "btn btn-default btn-xs dropdown-toggle",
      "data-toggle": "dropdown"
    }, "Views", /*#__PURE__*/_react["default"].createElement("span", {
      className: "caret"
    })), /*#__PURE__*/_react["default"].createElement("ul", {
      className: "dropdown-menu pull-right",
      role: "menu"
    }, views));
  }
  // Panel Views (END)

  // Add panel header, if title is set
  var panelHeading = props.title || props.views ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "panel-heading",
    "data-parent": props.parentId ? "#".concat(props.parentId) : null
  }, /*#__PURE__*/_react["default"].createElement("h3", {
    className: "panel-title"
  }, props.views && props.views[activeView]['title'] ? props.views[activeView]['title'] : props.title), panelViews, props.collapsing ? /*#__PURE__*/_react["default"].createElement("span", {
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
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "panel ".concat(props["class"]),
    style: {
      height: props.panelSize
    }
  }, panelHeading, /*#__PURE__*/_react["default"].createElement("div", {
    id: props.id,
    className: props.collapsed ? 'panel-collapse collapse' : 'panel-collapse collapse in',
    role: "tabpanel",
    style: {
      height: 'calc(100% - 3em)'
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "panel-body",
    style: _objectSpread(_objectSpread({}, props.style), {}, {
      height: props.height
    })
  }, content.length > 0 ? content : props.children)));
};
Panel.propTypes = (0, _defineProperty2["default"])({
  initCollapsed: _propTypes["default"].bool,
  collapsed: _propTypes["default"].bool,
  parentId: _propTypes["default"].string,
  id: _propTypes["default"].string,
  height: _propTypes["default"].string,
  title: _propTypes["default"].string,
  "class": _propTypes["default"].string,
  children: _propTypes["default"].node,
  views: _propTypes["default"].array,
  collapsing: _propTypes["default"].bool,
  bold: _propTypes["default"].bool,
  panelSize: _propTypes["default"].string,
  style: _propTypes["default"].object
}, "children", _propTypes["default"].node);
Panel.defaultProps = {
  initCollapsed: false,
  parentId: null,
  id: 'default-panel',
  height: '100%',
  "class": 'panel-primary',
  collapsing: true
};
var _default = exports["default"] = Panel;

/***/ }),

/***/ "./jsx/ProgressBar.js":
/*!****************************!*\
  !*** ./jsx/ProgressBar.js ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * React ProgressBar.
 *
 * Updates UI automatically when passed a progress value between 0 and 100.
 * To hide progress bar before/after upload, set value to -1.
 *
 * Note: This component relies on Bootstrap 3 progress-bar classes
 * (http://getbootstrap.com/components/#progress)
 */
var ProgressBar = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(ProgressBar, _Component);
  var _super = _createSuper(ProgressBar);
  function ProgressBar() {
    (0, _classCallCheck2["default"])(this, ProgressBar);
    return _super.apply(this, arguments);
  }
  (0, _createClass2["default"])(ProgressBar, [{
    key: "render",
    value:
    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
    function render() {
      var progressStyle = {
        display: this.props.value < 0 ? 'none' : 'block',
        backgroundColor: '#d3d3d3',
        height: '30px',
        position: 'relative'
      };
      var labelStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1000,
        width: '100%',
        color: '#fff',
        textAlign: 'center',
        lineHeight: '30px',
        fontWeight: '600'
      };
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "progress",
        style: progressStyle
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "progress-bar progress-bar-striped active",
        role: "progressbar",
        "aria-valuemin": "0",
        "aria-valuemax": "100",
        "aria-valuenow": this.props.value,
        style: {
          width: this.props.value + '%'
        }
      }), /*#__PURE__*/_react["default"].createElement("span", {
        style: labelStyle
      }, this.props.value, "%"));
    }
  }]);
  return ProgressBar;
}(_react.Component);
ProgressBar.propTypes = {
  value: _propTypes["default"].number
};
ProgressBar.defaultProps = {
  value: 0
};
var _default = exports["default"] = ProgressBar;

/***/ }),

/***/ "./jsx/Tabs.js":
/*!*********************!*\
  !*** ./jsx/Tabs.js ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

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
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } } /**
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

/***/ }),

/***/ "./modules/biobank/jsx/Shipment.js":
/*!*****************************************!*\
  !*** ./modules/biobank/jsx/Shipment.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.UseShipment = UseShipment;
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js"));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/toConsumableArray.js"));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js"));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _react = __webpack_require__(/*! react */ "react");
var _helpers = __webpack_require__(/*! ./helpers.js */ "./modules/biobank/jsx/helpers.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
/**
 * React effect for creating a request to create a new
 * shipment
 *
 * @param {object} initShipment - the initial value for the shipment
 * @return {Shipment}
 */
function UseShipment() {
  var _this = this;
  var initShipment = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _useState = (0, _react.useState)(initShipment),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    init = _useState2[0],
    setInit = _useState2[1];
  var _useState3 = (0, _react.useState)(new Shipment(init)),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    shipment = _useState4[0],
    setShipment = _useState4[1];
  var _useState5 = (0, _react.useState)(new Shipment({})),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    errors = _useState6[0],
    setErrors = _useState6[1];
  this.set = function (name, value) {
    return setShipment(shipment.set(name, value));
  };
  this.setContainerIds = function (value) {
    return _this.set('containerIds', value);
  };
  this.addLog = function (log) {
    return _this.setLogs(shipment.addLog(log));
  };
  this.setLogs = function (value) {
    return _this.set('logs', value);
  };
  this.setLog = function (name, value, index) {
    return _this.setLogs(shipment.setLog(name, value, index));
  };
  this.remove = function (name) {
    return setShipment(shipment.remove(name));
  };
  this.clear = function () {
    setShipment(new Shipment(init));
    setErrors(new Shipment({}));
  };
  this.post = /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _helpers.post)(shipment, "".concat(loris.BaseURL, "/biobank/shipments/"), 'POST')["catch"](function (e) {
              return Promise.reject(setErrors(new Shipment(e)));
            });
          case 2:
            return _context.abrupt("return", _context.sent);
          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  this.put = /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _helpers.post)(shipment, "".concat(loris.BaseURL, "/biobank/shipments/"), 'PUT').then(function (shipments) {
              setInit(new Shipment(shipments[0]));
              setShipment(new Shipment(shipments[0]));
              return shipments;
            })["catch"](function (e) {
              return Promise.reject(setErrors(new Shipment(e)));
            });
          case 2:
            return _context2.abrupt("return", _context2.sent);
          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  this.getShipment = function () {
    return shipment;
  };
  this.getErrors = function () {
    return errors;
  };
  return this;
}

/**
 * A Shipment of a container
 */
var Shipment = /*#__PURE__*/function () {
  /**
   * Constructor
   *
   * @param {object} params - The shipment parameters
   * @param {string} params.id - Shipment ID
   * @param {string} params.barcode - Shipment barcode
   * @param {string} params.type - Shipment type
   * @param {number} params.destinationCenterId - Destination center ID
   * @param {Array} params.logs - Logs for this shipment
   * @param {Array} params.containerIds - Container IDs in this shipment
   */
  function Shipment(_ref3) {
    var _ref3$id = _ref3.id,
      id = _ref3$id === void 0 ? null : _ref3$id,
      _ref3$barcode = _ref3.barcode,
      barcode = _ref3$barcode === void 0 ? null : _ref3$barcode,
      _ref3$type = _ref3.type,
      type = _ref3$type === void 0 ? null : _ref3$type,
      _ref3$destinationCent = _ref3.destinationCenterId,
      destinationCenterId = _ref3$destinationCent === void 0 ? null : _ref3$destinationCent,
      _ref3$logs = _ref3.logs,
      logs = _ref3$logs === void 0 ? [] : _ref3$logs,
      _ref3$containerIds = _ref3.containerIds,
      containerIds = _ref3$containerIds === void 0 ? [] : _ref3$containerIds;
    (0, _classCallCheck2["default"])(this, Shipment);
    this.id = id;
    this.barcode = barcode;
    this.type = type;
    this.destinationCenterId = destinationCenterId;
    this.logs = logs.map(function (log) {
      return new Log(log);
    });
    this.containerIds = containerIds;
  }

  /**
   * Sets name to value in this shipment
   *
   * @param {string} name - the key
   * @param {object} value - the value
   * @return {Shipment}
   */
  (0, _createClass2["default"])(Shipment, [{
    key: "set",
    value: function set(name, value) {
      return new Shipment(_objectSpread(_objectSpread({}, this), {}, (0, _defineProperty2["default"])({}, name, value)));
    }

    /**
     * Remove attribuet from shipment
     *
     * @param {object} name - attribute to be removed
     * @return {Shipment}
     */
  }, {
    key: "remove",
    value: function remove(name) {
      return new Shipment(_objectSpread({
        name: name
      }, this));
    }

    /**
     * Load a shipment from the server
     *
     * @param {string} id - the id of the shipment
     * @return {Shipment}
     */
  }, {
    key: "load",
    value: function () {
      var _load = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(id) {
        var shipment;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return (0, _helpers.get)("".concat(loris.BaseURL, "/biobank/shipments/").concat(id));
              case 2:
                shipment = _context3.sent;
                return _context3.abrupt("return", new Shipment(shipment));
              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));
      function load(_x) {
        return _load.apply(this, arguments);
      }
      return load;
    }()
    /**
     * Adds a new log to this shipment
     *
     * @param {object} log - the log values
     * @return {array}
     */
  }, {
    key: "addLog",
    value: function addLog(log) {
      return [].concat((0, _toConsumableArray2["default"])(this.logs), [new Log(log)]);
    }

    /**
     * Sets the log at index i to name/value
     *
     * @param {string} name - the log name
     * @param {any} value - the log value
     * @param {number} index - the index
     * @return {array}
     */
  }, {
    key: "setLog",
    value: function setLog(name, value, index) {
      return this.logs.map(function (log, i) {
        if (i !== index) {
          return log;
        }
        return new Log(_objectSpread(_objectSpread({}, log), {}, (0, _defineProperty2["default"])({}, name, value)));
      });
    }
  }]);
  return Shipment;
}();
/**
 * A log of shipments
 */
var Log = /*#__PURE__*/function () {
  /**
   * Constructor
   *
   * @param {object} props - React props
   */
  function Log() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, Log);
    this.barcode = props.barcode || null;
    this.centerId = props.centerId || null;
    this.status = props.status || null;
    this.user = props.user || null;
    this.temperature = props.temperature || null;
    this.date = props.date || null;
    this.time = props.time || null;
    this.comments = props.comments || null;
  }

  /**
   * Set a value
   *
   * @param {string} name - the key
   * @param {any} value - the value
   * @return {Log} - A new log object with the key set to value
   */
  (0, _createClass2["default"])(Log, [{
    key: "set",
    value: function set(name, value) {
      return new Log(_objectSpread(_objectSpread({}, this), {}, (0, _defineProperty2["default"])({}, name, value)));
    }
  }]);
  return Log;
}();
var _default = exports["default"] = Shipment;

/***/ }),

/***/ "./modules/biobank/jsx/barcodePage.js":
/*!********************************************!*\
  !*** ./modules/biobank/jsx/barcodePage.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
var _helpers = __webpack_require__(/*! ./helpers.js */ "./modules/biobank/jsx/helpers.js");
var _globals = _interopRequireDefault(__webpack_require__(/*! ./globals */ "./modules/biobank/jsx/globals.js"));
var _header = _interopRequireDefault(__webpack_require__(/*! ./header */ "./modules/biobank/jsx/header.js"));
var _specimen = _interopRequireDefault(__webpack_require__(/*! ./specimen */ "./modules/biobank/jsx/specimen.js"));
var _container = _interopRequireDefault(__webpack_require__(/*! ./container */ "./modules/biobank/jsx/container.js"));
var _ProgressBar = _interopRequireDefault(__webpack_require__(/*! jsx/ProgressBar */ "./jsx/ProgressBar.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var initialState = {
  loading: false,
  current: {
    files: {},
    list: {},
    coordinate: null,
    sequential: false,
    count: null,
    multiplier: 1,
    specimen: {},
    container: {}
  },
  errors: {
    container: {},
    specimen: {}
  },
  editable: {
    aliquotForm: false,
    containerParentForm: false,
    loadContainer: false,
    containerCheckout: false,
    containerType: false,
    temperature: false,
    quantity: false,
    status: false,
    center: false,
    collection: false,
    preparation: false,
    analysis: false
  }
};

/**
 * The Barcode Page is the entry-point for both Specimen and Container Page data.
 */
var BarcodePage = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(BarcodePage, _Component);
  var _super = _createSuper(BarcodePage);
  /**
   * constructor
   */
  function BarcodePage() {
    var _this;
    (0, _classCallCheck2["default"])(this, BarcodePage);
    _this = _super.call(this);
    _this.state = initialState;
    _this.getParentContainerBarcodes = _this.getParentContainerBarcodes.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getCoordinateLabel = _this.getCoordinateLabel.bind((0, _assertThisInitialized2["default"])(_this));
    _this.edit = _this.edit.bind((0, _assertThisInitialized2["default"])(_this));
    _this.clearEditable = _this.clearEditable.bind((0, _assertThisInitialized2["default"])(_this));
    _this.clearAll = _this.clearAll.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setCheckoutList = _this.setCheckoutList.bind((0, _assertThisInitialized2["default"])(_this));
    _this.editSpecimen = _this.editSpecimen.bind((0, _assertThisInitialized2["default"])(_this));
    _this.editContainer = _this.editContainer.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setSpecimen = _this.setSpecimen.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setContainer = _this.setContainer.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setCurrent = _this.setCurrent.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setErrors = _this.setErrors.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getBarcodePathDisplay = _this.getBarcodePathDisplay.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  /**
   * Get the barcodes from a parent container recursively
   *
   * @param {object} container - the container with siblings
   * @param {array} barcodes - the initial list of barcodes
   * @return {array}
   */
  (0, _createClass2["default"])(BarcodePage, [{
    key: "getParentContainerBarcodes",
    value: function getParentContainerBarcodes(container) {
      var barcodes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      barcodes.push(container.barcode);
      var parent = Object.values(this.props.data.containers).find(function (c) {
        return container.parentContainerId == c.id;
      });
      parent && this.getParentContainerBarcodes(parent, barcodes);
      return barcodes.slice(0).reverse();
    }

    /**
     * Get the label for a coordinate in a container
     *
     * @param {object} container
     * @return {string}
     */
  }, {
    key: "getCoordinateLabel",
    value: function getCoordinateLabel(container) {
      var optcontainer = this.props.options.container;
      var datacontainers = this.props.data.containers;
      var parentContainer = datacontainers[container.parentContainerId];
      // if parentContainer is not accessible, this means the user doesn't have access
      if (parentContainer) {
        var dimensions = optcontainer.dimensions[parentContainer.dimensionId];
        var coordinate;
        var j = 1;
        outerloop: for (var y = 1; y <= dimensions.y; y++) {
          for (var x = 1; x <= dimensions.x; x++) {
            if (j == container.coordinate) {
              if (dimensions.xNum == 1 && dimensions.yNum == 1) {
                coordinate = x + dimensions.x * (y - 1);
              } else {
                var xVal = dimensions.xNum == 1 ? x : String.fromCharCode(64 + x);
                var yVal = dimensions.yNum == 1 ? y : String.fromCharCode(64 + y);
                coordinate = yVal + '' + xVal;
              }
              break outerloop;
            }
            j++;
          }
        }
        return coordinate;
      }
    }

    /**
     * Set a key as editable
     *
     * @param {string} stateKey - the key to edit
     * @return {Promise}
     */
  }, {
    key: "edit",
    value: function edit(stateKey) {
      var _this2 = this;
      return new Promise(function (resolve) {
        _this2.clearEditable().then(function () {
          var editable = (0, _helpers.clone)(_this2.state.editable);
          editable[stateKey] = true;
          _this2.setState({
            editable: editable
          }, resolve());
        });
      });
    }

    /**
     * Reset the editable state of the page
     *
     * @return {Promise}
     */
  }, {
    key: "clearEditable",
    value: function clearEditable() {
      var _this3 = this;
      var state = (0, _helpers.clone)(this.state);
      state.editable = initialState.editable;
      return new Promise(function (res) {
        return _this3.setState(state, res());
      });
    }

    /**
     * Reset the state of the page
     *
     * @return {Promise}
     */
  }, {
    key: "clearAll",
    value: function clearAll() {
      var _this4 = this;
      return new Promise(function (res) {
        return _this4.setState(initialState, res());
      });
    }

    /**
     * Set a list of containers to checkout
     *
     * @param {object} container - a container to checkout?
     */
  }, {
    key: "setCheckoutList",
    value: function setCheckoutList(container) {
      var _this5 = this;
      // Clear current container field.
      this.setCurrent('containerId', 1).then(function () {
        return _this5.setCurrent('containerId', null);
      });
      var list = this.state.current.list;
      list[container.coordinate] = container;
      this.setCurrent('list', list);
    }

    /**
     * Edit a specimen
     *
     * @param {object} specimen - specimen
     * @return {Promise}
     */
  }, {
    key: "editSpecimen",
    value: function editSpecimen(specimen) {
      specimen = (0, _helpers.clone)(specimen);
      return this.setCurrent('specimen', specimen);
    }

    /**
     * Edit a container
     *
     * @param {object} container - container
     * @return {Promise}
     */
  }, {
    key: "editContainer",
    value: function editContainer(container) {
      container = (0, _helpers.clone)(container);
      return this.setCurrent('container', container);
    }

    /**
     * Update the 'current' object which holds generic state of this component.
     *
     * @param {string} name - the name to display
     * @param {object} value - the error message
     * @return {Promise}
     */
  }, {
    key: "setCurrent",
    value: function setCurrent(name, value) {
      var _this6 = this;
      var current = (0, _helpers.clone)(this.state.current);
      current[name] = value;
      return new Promise(function (res) {
        return _this6.setState({
          current: current
        }, res());
      });
    }

    /**
     * Set active errors to display
     *
     * @param {string} name - the key with an error
     * @param {string} value - the error message
     */
  }, {
    key: "setErrors",
    value: function setErrors(name, value) {
      var errors = (0, _helpers.clone)(this.state.errors);
      errors[name] = value;
      this.setState({
        errors: errors
      });
    }

    /**
     * Get the path to display for a barcode
     *
     * @param {array} parentBarcodes - parent barcodes
     * @return {JSX}
     */
  }, {
    key: "getBarcodePathDisplay",
    value: function getBarcodePathDisplay(parentBarcodes) {
      var _this7 = this;
      return Object.keys(parentBarcodes).map(function (i) {
        var container = Object.values(_this7.props.data.containers).find(function (container) {
          return container.barcode == parentBarcodes[parseInt(i) + 1];
        });
        var coordinateDisplay;
        if (container) {
          var coordinate = _this7.getCoordinateLabel(container);
          coordinateDisplay = /*#__PURE__*/_react["default"].createElement("b", null, '-' + (coordinate || 'UAS'));
        }
        return /*#__PURE__*/_react["default"].createElement("span", {
          className: "barcodePath"
        }, i != 0 && ': ', /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Link, {
          key: i,
          to: "/barcode=".concat(parentBarcodes[i])
        }, parentBarcodes[i]), coordinateDisplay);
      });
    }

    /**
     * Sets the current specimen
     *
     * @param {string} name - the specimen name
     * @param {string} value - the specimen value
     * @return {Promise}
     */
  }, {
    key: "setSpecimen",
    value: function setSpecimen(name, value) {
      var _this8 = this;
      return new Promise(function (resolve) {
        var specimen = (0, _helpers.clone)(_this8.state.current.specimen);
        specimen[name] = value;
        _this8.setCurrent('specimen', specimen).then(function () {
          return resolve();
        });
      });
    }

    /**
     * Sets the current container
     *
     * @param {string} name - the container name
     * @param {string} value - the container value
     * @return {Promise}
     */
  }, {
    key: "setContainer",
    value: function setContainer(name, value) {
      var _this9 = this;
      return new Promise(function (resolve) {
        var container = (0, _helpers.clone)(_this9.state.current.container);
        value ? container[name] = value : delete container[name];
        _this9.setCurrent('container', container).then(function () {
          return resolve();
        });
      });
    }

    /**
     * Render the React component
     *
     * @return {JSX}
     */
  }, {
    key: "render",
    value: function render() {
      var _this10 = this;
      var _clone = (0, _helpers.clone)(this.state),
        current = _clone.current,
        editable = _clone.editable,
        errors = _clone.errors;
      var _this$props = this.props,
        specimen = _this$props.specimen,
        container = _this$props.container,
        data = _this$props.data,
        options = _this$props.options;

      // THIS IS A PLACE HOLDER FOR BETTER LAZY LOADING
      if ((0, _helpers.isEmpty)(data.containers) || (0, _helpers.isEmpty)(data.specimens) || (0, _helpers.isEmpty)(data.pools)) {
        return /*#__PURE__*/_react["default"].createElement(_ProgressBar["default"], {
          value: this.props.loading
        });
      }
      var updateContainer = function updateContainer(container) {
        var close = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        _this10.setErrors('container', {});
        return new Promise(function (resolve) {
          return _this10.setState({
            loading: true
          }, function () {
            if (options.container.stati[container.statusId].label === 'Shipped') {
              container.parentContainerId = null;
              container.coordinate = null;
            }
            return _this10.props.updateContainer(container).then(function () {
              return close && _this10.clearEditable();
            }, function (errors) {
              return errors.container && _this10.setErrors('container', errors.container);
            }).then(function () {
              return _this10.setState({
                loading: false
              }, resolve());
            });
          });
        });
      };
      var updateSpecimen = function updateSpecimen(specimen) {
        _this10.setErrors('specimen', {});
        return _this10.setState({
          loading: true
        }, function () {
          return _this10.props.updateSpecimen(specimen).then(function () {
            return _this10.clearEditable();
          }, function (errors) {
            return errors.specimen && _this10.setErrors('specimen', errors.specimen);
          }).then(function () {
            return _this10.setState({
              loading: false
            });
          });
        });
      };
      var renderMain = function renderMain() {
        if (_this10.props.specimen) {
          return /*#__PURE__*/_react["default"].createElement(_specimen["default"], {
            specimen: specimen,
            container: container,
            options: options,
            errors: _this10.state.errors,
            current: _this10.state.current,
            editable: _this10.state.editable,
            setCurrent: _this10.setCurrent,
            edit: _this10.edit,
            clearAll: _this10.clearAll,
            setSpecimen: _this10.setSpecimen,
            editSpecimen: _this10.editSpecimen,
            updateSpecimen: updateSpecimen
          });
        } else {
          return /*#__PURE__*/_react["default"].createElement(_container["default"], {
            history: _this10.props.history,
            container: container,
            data: data,
            options: options,
            current: _this10.state.current,
            editable: _this10.state.editable,
            editContainer: _this10.editContainer,
            updateContainer: updateContainer,
            setCurrent: _this10.setCurrent,
            setCheckoutList: _this10.setCheckoutList,
            edit: _this10.edit,
            clearAll: _this10.clearAll,
            getCoordinateLabel: _this10.getCoordinateLabel,
            getParentContainerBarcodes: _this10.getParentContainerBarcodes,
            getBarcodePathDisplay: _this10.getBarcodePathDisplay
          });
        }
      };
      return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Link, {
        to: "/"
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "glyphicon glyphicon-chevron-left"
      }), "Return to Filter"), /*#__PURE__*/_react["default"].createElement(_header["default"], {
        data: data,
        current: current,
        editable: editable,
        options: options,
        editContainer: this.editContainer,
        edit: this.edit,
        specimen: this.props.specimen,
        container: this.props.container,
        clearAll: this.clearAll,
        setContainer: this.setContainer,
        setSpecimen: this.setSpecimen,
        createSpecimens: this.props.createSpecimens,
        updateContainer: updateContainer,
        getParentContainerBarcodes: this.getParentContainerBarcodes,
        getBarcodePathDisplay: this.getBarcodePathDisplay,
        increaseCoordinate: this.props.increaseCoordinate,
        printLabel: this.props.printLabel
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "summary"
      }, /*#__PURE__*/_react["default"].createElement(_globals["default"], {
        loading: this.state.loading,
        current: current,
        errors: errors,
        editable: editable,
        data: data,
        options: options,
        specimen: specimen,
        container: container,
        edit: this.edit,
        clearAll: this.clearAll,
        editContainer: this.editContainer,
        editSpecimen: this.editSpecimen,
        setContainer: this.setContainer,
        setSpecimen: this.setSpecimen,
        uC: function uC() {
          return _this10.props.updateContainer(current.container);
        },
        updateContainer: updateContainer,
        updateSpecimen: updateSpecimen,
        getCoordinateLabel: this.getCoordinateLabel,
        setCurrent: this.setCurrent
      }), renderMain()));
    }
  }]);
  return BarcodePage;
}(_react.Component);
BarcodePage.propTypes = {
  data: _propTypes["default"].shape({
    containers: _propTypes["default"].array,
    specimens: _propTypes["default"].array,
    pools: _propTypes["default"].array
  }),
  options: _propTypes["default"].shape({
    container: _propTypes["default"].shape({
      dimensions: _propTypes["default"].object,
      stati: _propTypes["default"].object
    })
  }),
  updateContainer: _propTypes["default"].func,
  updateSpecimen: _propTypes["default"].func,
  printLabel: _propTypes["default"].func,
  increaseCoordinate: _propTypes["default"].func,
  createSpecimens: _propTypes["default"].func,
  loading: _propTypes["default"].bool,
  history: _propTypes["default"].object,
  specimen: _propTypes["default"].object,
  container: _propTypes["default"].shape({
    statusId: _propTypes["default"].number,
    parentContainerId: _propTypes["default"].number,
    coordinate: _propTypes["default"].string
  })
};
var _default = exports["default"] = BarcodePage;

/***/ }),

/***/ "./modules/biobank/jsx/batchEditForm.js":
/*!**********************************************!*\
  !*** ./modules/biobank/jsx/batchEditForm.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js"));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _processForm = _interopRequireDefault(__webpack_require__(/*! ./processForm */ "./modules/biobank/jsx/processForm.js"));
var _Tabs = __webpack_require__(/*! Tabs */ "./jsx/Tabs.js");
var _Modal = _interopRequireDefault(__webpack_require__(/*! Modal */ "./jsx/Modal.tsx"));
var _Loader = _interopRequireDefault(__webpack_require__(/*! Loader */ "./jsx/Loader.tsx"));
var _helpers = __webpack_require__(/*! ./helpers.js */ "./modules/biobank/jsx/helpers.js");
var _Form = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");
var _sweetalert = _interopRequireDefault(__webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var initialState = {
  specimen: {},
  container: {},
  collection: {},
  preparation: {},
  list: {},
  count: 0,
  current: {},
  errors: {
    specimen: {},
    container: {}
  },
  loading: false,
  editable: {
    global: true
  },
  show: {
    collection: false,
    preparation: false
  }
};

/**
 * Biobank Batch Edit Specimen Form
 */
var BatchEditForm = /*#__PURE__*/function (_React$PureComponent) {
  (0, _inherits2["default"])(BatchEditForm, _React$PureComponent);
  var _super = _createSuper(BatchEditForm);
  /**
   * Constructor
   */
  function BatchEditForm() {
    var _this;
    (0, _classCallCheck2["default"])(this, BatchEditForm);
    _this = _super.call(this);
    _this.state = initialState;
    _this.setSpecimen = _this.setSpecimen.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setContainer = _this.setContainer.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setCurrent = _this.setCurrent.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setProcess = _this.setProcess.bind((0, _assertThisInitialized2["default"])(_this));
    _this.validateListItem = _this.validateListItem.bind((0, _assertThisInitialized2["default"])(_this));
    _this.addListItem = _this.addListItem.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setPool = _this.setPool.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  /**
   * Add a new list item to a container
   *
   * @param {number} containerId - the container to add an item to
   */
  (0, _createClass2["default"])(BatchEditForm, [{
    key: "addListItem",
    value: function addListItem(containerId) {
      var _clone = (0, _helpers.clone)(this.state),
        list = _clone.list,
        current = _clone.current,
        collection = _clone.collection,
        preparation = _clone.preparation,
        count = _clone.count,
        show = _clone.show;

      // Increase count.
      count++;

      // Set Specimen and Container.
      var container = this.props.data.containers[containerId];
      var specimen = this.props.data.specimens[container.specimenId];

      // Set current global values.
      current.typeId = specimen.typeId;

      // Set list values.
      list[count] = {
        specimen: specimen,
        container: container
      };

      // This determines if every specimen in the list has the same collection
      // protocol.
      show.collection = Object.keys(list).length > 1 && Object.values(list).every(function (item, i, listArray) {
        return item.specimen.collection && item.specimen.collection.protocolId === listArray[0].specimen.collection.protocolId;
      });

      // If so, set the collection protocolId.
      if (show.collection) {
        collection.protocolId = list[Object.keys(list)[0]].specimen.collection.protocolId;
      }

      // This determines if every specimen in the list has the same preparation
      // protocol.
      show.preparation = Object.keys(list).length > 1 && Object.values(list).every(function (item, i, listArray) {
        return item.specimen.preparation && item.specimen.preparation.protocolId === listArray[0].specimen.preparation.protocolId;
      });

      // If so, set the preparation protocolId.
      if (show.preparation) {
        preparation.protocolId = list[Object.keys(list)[0]].specimen.preparation.protocolId;
      }
      this.setState({
        list: list,
        current: current,
        collection: collection,
        preparation: preparation,
        count: count,
        show: show
      });
    }

    /**
     * Remove a list item from a container
     *
     * @param {string} key - the key to remove
     */
  }, {
    key: "removeListItem",
    value: function removeListItem(key) {
      var _clone2 = (0, _helpers.clone)(this.state),
        list = _clone2.list,
        current = _clone2.current;
      delete list[key];
      current = (0, _helpers.isEmpty)(list) ? {} : current;
      this.setState({
        list: list,
        current: current
      });
    }

    /**
     * Set the current specimen being edited
     *
     * @param {string} name - process name
     * @param {object} value - value to set
     */
  }, {
    key: "setSpecimen",
    value: function setSpecimen(name, value) {
      var specimen = (0, _helpers.clone)(this.state.specimen);
      specimen[name] = value;
      // if (!value) delete specimen[name];
      this.setState({
        specimen: specimen
      });
    }

    /**
     * Set the current container being edited
     *
     * @param {string} name - process name
     * @param {object} value - value to set
     */
  }, {
    key: "setContainer",
    value: function setContainer(name, value) {
      var container = (0, _helpers.clone)(this.state.container);
      container[name] = value;
      this.setState({
        container: container
      });
    }

    /**
     * Update the current state object, which acts as a generic state holder for this
     * component.
     *
     * @param {string} name - process name
     * @param {object} value - value to set
     * @return {Promise}
     */
  }, {
    key: "setCurrent",
    value: function setCurrent(name, value) {
      var _this2 = this;
      var current = (0, _helpers.clone)(this.state.current);
      current[name] = value;
      return new Promise(function (res) {
        return _this2.setState({
          current: current
        }, res());
      });
    }

    /**
     * Sets the process being edited
     *
     * @param {string} name - process name
     * @param {object} value - value to set
     */
  }, {
    key: "setProcess",
    value: function setProcess(name, value) {
      this.setState((0, _defineProperty2["default"])({}, name, value));
    }

    /**
     * From the selected pool, add all related speciments into the list.
     *
     * @param {string} name - the pool name
     * @param {number} poolId - the pool id
     */
  }, {
    key: "setPool",
    value: function setPool(name, poolId) {
      var _this3 = this;
      var pool = (0, _helpers.clone)(this.props.data.pools[poolId]);

      // This struture is what allows pools to be loaded and then have the pool
      // label disappear once the barcodes have been added to the list.
      this.setState({
        loading: true
      });
      this.setCurrent('poolId', poolId).then(function () {
        return Promise.all(pool.specimenIds.map(function (specimenId) {
          return Object.values(_this3.state.list).find(function (item) {
            return item.specimen.id === specimenId;
          }) || _this3.addListItem(_this3.props.data.specimens[specimenId].containerId);
        }).map(function (p) {
          return p instanceof Promise ? p : Promise.resolve(p);
        }));
      }).then(function () {
        return _this3.setCurrent('poolId', null);
      }).then(function () {
        return _this3.setState({
          loading: false
        });
      });
    }

    /**
     * Validate the list items for a container
     *
     * @param {number} containerId - the container to validate
     * @return {Promise}
     */
  }, {
    key: "validateListItem",
    value: function validateListItem(containerId) {
      var _clone3 = (0, _helpers.clone)(this.state),
        current = _clone3.current,
        list = _clone3.list;
      var container = this.props.data.containers[containerId];
      var specimen = this.props.data.specimens[container.specimenId];
      if (!(0, _helpers.isEmpty)(list) && specimen.typeId !== current.typeId) {
        _sweetalert["default"].fire('Oops!', 'Specimens must be of the same Type and Center', 'warning');
        return Promise.reject();
      }
      return Promise.resolve();
    }

    /**
     * Render the react component
     *
     * @return {JSX}
     */
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;
      if (this.state.loading) {
        return /*#__PURE__*/React.createElement(_Loader["default"], null);
      }
      var _this$props = this.props,
        data = _this$props.data,
        options = _this$props.options;
      var _this$state = this.state,
        poolId = _this$state.poolId,
        collection = _this$state.collection,
        preparation = _this$state.preparation,
        list = _this$state.list,
        current = _this$state.current,
        errors = _this$state.errors;
      var units = current.typeId ? (0, _helpers.mapFormOptions)(options.specimen.typeUnits[current.typeId], 'label') : {};
      var stati = (0, _helpers.mapFormOptions)(options.container.stati, 'label');
      var containerTypesPrimary = (0, _helpers.mapFormOptions)(options.container.typesPrimary, 'label');
      var containerTypes = {};
      if (current.typeId && options.specimen.typeContainerTypes[current.typeId]) {
        Object.keys(containerTypesPrimary).forEach(function (id) {
          options.specimen.typeContainerTypes[current.typeId].forEach(function (i) {
            if (id == i) {
              containerTypes[id] = containerTypesPrimary[id];
            }
          });
        });
      }
      var globalForm = current.typeId ? /*#__PURE__*/React.createElement(EditForm, null, /*#__PURE__*/React.createElement(_Form.TextboxElement, {
        name: "quantity",
        label: "Quantity",
        value: this.state.specimen.quantity,
        errorMessage: errors.specimen.quantity,
        onUserInput: this.setSpecimen
      }), /*#__PURE__*/React.createElement(_Form.SelectElement, {
        name: "unitId",
        label: "Unit",
        value: this.state.specimen.unitId,
        options: units,
        errorMessage: errors.specimen.unitId,
        onUserInput: this.setSpecimen
      }), options.specimen.types[current.typeId].freezeThaw == 1 ? /*#__PURE__*/React.createElement(_Form.TextboxElement, {
        name: "fTCycle",
        label: "Freeze-Thaw Cycle",
        value: this.state.specimen.fTCycle,
        onUserInput: this.setSpecimen,
        errorMessage: errors.specimen.fTCycle,
        min: 0
      }) : null, /*#__PURE__*/React.createElement(_Form.SelectElement, {
        name: "typeId",
        label: "Container Type",
        value: this.state.container.typeId,
        options: containerTypes,
        errorMessage: errors.container.typeId,
        onUserInput: this.setContainer
      }), /*#__PURE__*/React.createElement(_Form.TextboxElement, {
        name: "lotNumber",
        label: "Lot Number",
        value: this.state.container.lotNumber,
        errorMessage: errors.container.lotNumber,
        onUserInput: this.setContainer
      }), /*#__PURE__*/React.createElement(_Form.SelectElement, {
        name: "statusId",
        label: "Status",
        value: this.state.container.statusId,
        options: stati,
        errorMessage: errors.container.statusId,
        onUserInput: this.setContainer
      }), /*#__PURE__*/React.createElement(_Form.SelectElement, {
        name: "projectIds",
        label: "Project",
        value: this.state.specimen.projectIds,
        options: options.projects,
        multiple: true,
        emptyOption: false,
        errorMessage: errors.specimen.projectIds,
        onUserInput: this.setSpecimen
      })) : null;
      var collectionForm = this.state.editable.collection ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_Form.StaticElement, {
        label: "Protocol",
        text: options.specimen.protocols[collection.protocolId].label
      }), /*#__PURE__*/React.createElement(EditForm, null, /*#__PURE__*/React.createElement(_processForm["default"], {
        edit: true,
        errors: errors.specimen.collection || {},
        options: options,
        process: collection,
        processStage: "collection",
        setParent: this.setProcess,
        setCurrent: this.setCurrent,
        typeId: current.typeId,
        hideProtocol: true
      }))) : null;
      var preparationForm = this.state.editable.preparation ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_Form.StaticElement, {
        label: "Protocol",
        text: options.specimen.protocols[preparation.protocolId].label
      }), /*#__PURE__*/React.createElement(EditForm, null, /*#__PURE__*/React.createElement(_processForm["default"], {
        edit: true,
        errors: errors.specimen.preparation || {},
        options: options,
        process: preparation,
        processStage: "preparation",
        setParent: this.setProcess,
        setCurrent: this.setCurrent,
        typeId: current.typeId,
        hideProtocol: true
      }))) : null;

      // TODO: This should likely be filtered so that only pools that match the
      // proper criteria are left in the list.
      var pools = (0, _helpers.mapFormOptions)(data.pools, 'label');
      var glyphStyle = {
        color: '#DDDDDD',
        marginLeft: 10,
        cursor: 'pointer'
      };
      var barcodeList = Object.entries(list).map(function (_ref) {
        var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
          key = _ref2[0],
          item = _ref2[1];
        var handleRemoveItem = function handleRemoveItem() {
          return _this4.removeListItem(key);
        };
        return /*#__PURE__*/React.createElement("div", {
          key: key,
          className: "preparation-item"
        }, /*#__PURE__*/React.createElement("div", null, item.container.barcode), /*#__PURE__*/React.createElement("div", {
          className: "glyphicon glyphicon-remove",
          style: glyphStyle,
          onClick: handleRemoveItem
        }));
      });
      var tabList = [{
        id: 'global',
        label: 'Global',
        error: !(0, _helpers.isEmpty)(errors.specimen) || !(0, _helpers.isEmpty)(errors.container),
        content: globalForm
      }];
      if (this.state.show.collection) {
        tabList.push({
          id: 'collection',
          label: 'Collection',
          error: !(0, _helpers.isEmpty)(errors.specimen.collection),
          content: collectionForm
        });
      }
      if (this.state.show.preparation) {
        tabList.push({
          id: 'preparation',
          label: 'Preparation',
          content: preparationForm
        });
      }
      var tabContent = tabList.map(function (tab, i) {
        return /*#__PURE__*/React.createElement(_Tabs.TabPane, {
          key: i,
          TabId: tab.id
        }, tab.content);
      });
      var handlePoolInput = function handlePoolInput(name, value) {
        return value && _this4.setPool(name, value);
      };
      var handleClose = function handleClose() {
        return _this4.setState(initialState, _this4.props.onClose);
      };
      var handleSubmit = function handleSubmit() {
        _this4.setState({
          errors: {
            container: {},
            specimen: {}
          }
        });
        var prepList = Object.values(list).map(function (item) {
          var specimen = (0, _helpers.clone)(item.specimen);
          var container = (0, _helpers.clone)(item.container);

          // Clone values from global specimen.
          Object.keys(_this4.state.specimen).forEach(function (name) {
            if (_this4.state.specimen[name] != null) {
              specimen[name] = _this4.state.specimen[name];
            }
          });

          // Clone values from global container.
          Object.keys(_this4.state.container).forEach(function (name) {
            if (_this4.state.container[name] != null) {
              container[name] = _this4.state.container[name];
            }
          });

          // Clone collection values to specimen.
          Object.keys(collection).forEach(function (name) {
            if ((0, _typeof2["default"])(specimen.collection[name]) === 'object' && specimen.collection[name] !== null) {
              Object.keys(collection[name]).forEach(function (index) {
                if (collection[name][index] != null) {
                  specimen.collection[name][index] = collection[name][index];
                }
              });
            } else {
              if (collection[name] != null) {
                specimen.collection[name] = collection[name];
              }
            }
          });

          // Clone specimen values to specimen.
          Object.keys(preparation).forEach(function (name) {
            if ((0, _typeof2["default"])(specimen.preparation[name]) === 'object' && specimen.preparation[name] !== null) {
              Object.keys(preparation[name]).forEach(function (index) {
                if (preparation[name][index] != null) {
                  specimen.preparation[name][index] = preparation[name][index];
                }
              });
            } else {
              if (preparation[name] != null) {
                specimen.preparation[name] = preparation[name];
              }
            }
          });
          return {
            specimen: specimen,
            container: container
          };
        });
        return new Promise(function (resolve, reject) {
          _this4.props.onSubmit(prepList).then(function () {
            return resolve();
          }, function (errors) {
            return _this4.setState({
              errors: errors
            }, reject());
          });
        });
      };
      var editForms = Object.keys(list).length > 1 ? /*#__PURE__*/React.createElement("div", {
        className: "form-top"
      }, /*#__PURE__*/React.createElement(_Form.StaticElement, {
        label: "Editing Note",
        text: "Select a form for the list to edit the specimen values. Any previous value associated with a Specimen for a given field will be overwritten if one is added on this form."
      }), /*#__PURE__*/React.createElement(_Tabs.VerticalTabs, {
        tabs: tabList,
        onTabChange: function onTabChange(id) {
          return _this4.setState({
            editable: (0, _defineProperty2["default"])({}, id, true)
          });
        },
        updateURL: false
      }, tabContent)) : null;
      return /*#__PURE__*/React.createElement(_Modal["default"], {
        title: "Edit Specimens",
        show: this.props.show,
        onClose: handleClose,
        onSubmit: Object.keys(list).length > 1 && handleSubmit,
        throwWarning: true
      }, /*#__PURE__*/React.createElement(_Form.FormElement, null, /*#__PURE__*/React.createElement("div", {
        className: "row"
      }, /*#__PURE__*/React.createElement("div", {
        className: "col-sm-10 col-sm-offset-1"
      }, /*#__PURE__*/React.createElement(_Form.StaticElement, {
        label: "Editing Note",
        text: "Select or Scan the specimens to be edited. Specimens must share the same Type."
      }), /*#__PURE__*/React.createElement(_Form.StaticElement, {
        label: "Specimen Type",
        text: (options.specimen.types[current.typeId] || {}).label || '—'
      }), /*#__PURE__*/React.createElement("div", {
        className: "row"
      }, /*#__PURE__*/React.createElement("div", {
        className: "col-xs-6"
      }, /*#__PURE__*/React.createElement("h4", null, "Barcode Input"), /*#__PURE__*/React.createElement("div", {
        className: "form-top"
      }), /*#__PURE__*/React.createElement(BarcodeInput, {
        data: data,
        options: options,
        list: list,
        validateListItem: this.validateListItem,
        addListItem: this.addListItem
      }), /*#__PURE__*/React.createElement(_Form.SearchableDropdown, {
        name: 'poolId',
        label: 'Pool',
        onUserInput: handlePoolInput,
        options: pools,
        value: poolId
      })), /*#__PURE__*/React.createElement("div", {
        className: "col-xs-6"
      }, /*#__PURE__*/React.createElement("h4", null, "Barcode List"), /*#__PURE__*/React.createElement("div", {
        className: "form-top"
      }), /*#__PURE__*/React.createElement("div", {
        className: "preparation-list"
      }, barcodeList))), editForms))));
    }
  }]);
  return BatchEditForm;
}(React.PureComponent);
BatchEditForm.propTypes = {
  data: _propTypes["default"].shape({
    containers: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      specimenId: _propTypes["default"].number.isRequired
    })).isRequired,
    specimens: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      containerId: _propTypes["default"].number.isRequired
    })).isRequired,
    pools: _propTypes["default"].array.isRequired
  }).isRequired,
  options: _propTypes["default"].shape({
    specimen: _propTypes["default"].shape({
      typeUnits: _propTypes["default"].string,
      types: _propTypes["default"].arrayOf(_propTypes["default"].string),
      protocols: _propTypes["default"].arrayOf(_propTypes["default"].string),
      typeContainerTypes: _propTypes["default"].arrayOf(_propTypes["default"].string)
    }).isRequired,
    container: _propTypes["default"].shape({
      stati: _propTypes["default"].object,
      typesPrimary: _propTypes["default"].arrayOf(_propTypes["default"].string),
      types: _propTypes["default"].arrayOf(_propTypes["default"].string)
    }).isRequired,
    projects: _propTypes["default"].array.isRequired
  }).isRequired,
  onClose: _propTypes["default"].func.isRequired,
  onSubmit: _propTypes["default"].func.isRequired,
  show: _propTypes["default"].bool.isRequired,
  list: _propTypes["default"].array.isRequired,
  addListItem: _propTypes["default"].func.isRequired,
  validateListItem: _propTypes["default"].func.isRequired
};

/**
 * Input form to enter a barcode
 */
var BarcodeInput = /*#__PURE__*/function (_React$PureComponent2) {
  (0, _inherits2["default"])(BarcodeInput, _React$PureComponent2);
  var _super2 = _createSuper(BarcodeInput);
  /**
   * Constructor
   *
   * @param {object} props - React props
   */
  function BarcodeInput(props) {
    var _this5;
    (0, _classCallCheck2["default"])(this, BarcodeInput);
    _this5 = _super2.call(this, props);
    var barcodesPrimary = Object.values(props.data.containers).reduce(function (result, container) {
      if (props.options.container.types[container.typeId].primary == 1) {
        var inList = Object.values(props.list).find(function (i) {
          return i.container.id == container.id;
        });
        if (!inList) {
          result[container.id] = container.barcode;
        }
      }
      return result;
    }, {});
    _this5.state = {
      barcodesPrimary: barcodesPrimary,
      barcode: null
    };
    return _this5;
  }

  /**
   * Render the React component
   *
   * @return {JSX}
   */
  (0, _createClass2["default"])(BarcodeInput, [{
    key: "render",
    value: function render() {
      var _this6 = this;
      var addListItem = this.props.addListItem;
      var handleInput = function handleInput(name, value) {
        _this6.setState({
          barcode: value
        });
        var containerId = Object.keys(_this6.state.barcodesPrimary).find(function (id) {
          return _this6.state.barcodesPrimary[id] == value;
        });
        containerId && _this6.props.validateListItem(containerId).then(function () {
          return addListItem(containerId);
        }).then(function () {
          return _this6.setState({
            barcode: null
          });
        });
      };
      return /*#__PURE__*/React.createElement(_Form.TextboxElement, {
        name: 'barcode',
        label: 'Specimen',
        value: this.state.barcode,
        onUserInput: handleInput
      });
      // <SearchableDropdown
      //   name={'containerId'}
      //   label={'Search Specimen'}
      //   onUserInput={onSearch}
      //   options={this.state.barcodesPrimary}
      //   value={containerId}
      // />
    }
  }]);
  return BarcodeInput;
}(React.PureComponent);
BarcodeInput.propTypes = {
  data: _propTypes["default"].shape({
    containers: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      specimenId: _propTypes["default"].number.isRequired
    })).isRequired,
    specimens: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      containerId: _propTypes["default"].number.isRequired
    })).isRequired,
    pools: _propTypes["default"].array.isRequired
  }).isRequired,
  options: _propTypes["default"].shape({
    container: _propTypes["default"].shape({
      types: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired
    }).isRequired
  }).isRequired,
  list: _propTypes["default"].array.isRequired,
  addListItem: _propTypes["default"].func.isRequired,
  validateListItem: _propTypes["default"].func.isRequired
};

/**
 * Adds a checkbox to all the children components.
 *
 * @param {object} props
 * @return {JSX}
 */
function EditForm(props) {
  return React.Children.map(props.children, function (child) {
    var handleClick = function handleClick(name, value) {
      if (!value) {
        child.props.onUserInput(name, null);
      }
      if (value && child.props.value == null) {
        child.props.onUserInput(name, '');
      }
    };
    return React.isValidElement(child) && typeof child.type === 'function' && /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-xs-12"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-xs-10"
    }, React.cloneElement(child, {
      required: false
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-xs-2"
    }, /*#__PURE__*/React.createElement(_Form.CheckboxElement, {
      name: child.props.name,
      value: child.props.value != null,
      onUserInput: handleClick
    })))));
  });
}
var _default = exports["default"] = BatchEditForm;

/***/ }),

/***/ "./modules/biobank/jsx/batchProcessForm.js":
/*!*************************************************!*\
  !*** ./modules/biobank/jsx/batchProcessForm.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js"));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _react = __webpack_require__(/*! react */ "react");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _processForm = _interopRequireDefault(__webpack_require__(/*! ./processForm */ "./modules/biobank/jsx/processForm.js"));
var _Tabs = __webpack_require__(/*! Tabs */ "./jsx/Tabs.js");
var _Modal = _interopRequireDefault(__webpack_require__(/*! Modal */ "./jsx/Modal.tsx"));
var _Loader = _interopRequireDefault(__webpack_require__(/*! Loader */ "./jsx/Loader.tsx"));
var _helpers = __webpack_require__(/*! ./helpers.js */ "./modules/biobank/jsx/helpers.js");
var _Form = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");
var _sweetalert = _interopRequireDefault(__webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var initialState = {
  preparation: {},
  list: {},
  count: 0,
  current: {},
  errors: {
    specimen: {}
  },
  loading: false,
  editable: {
    preparation: true
  }
};

/**
 * Biobank Bath Process Specimen Form
 */
var BatchProcessForm = /*#__PURE__*/function (_React$PureComponent) {
  (0, _inherits2["default"])(BatchProcessForm, _React$PureComponent);
  var _super = _createSuper(BatchProcessForm);
  /**
   * Constructor
   */
  function BatchProcessForm() {
    var _this;
    (0, _classCallCheck2["default"])(this, BatchProcessForm);
    _this = _super.call(this);
    _this.state = initialState;
    _this.setCurrent = _this.setCurrent.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setProcess = _this.setProcess.bind((0, _assertThisInitialized2["default"])(_this));
    _this.validateListItem = _this.validateListItem.bind((0, _assertThisInitialized2["default"])(_this));
    _this.addListItem = _this.addListItem.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setPool = _this.setPool.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  /**
   * Sets a process
   *
   * @param {string} name - a name
   * @param {any} value - the value
   * @return {Promise}
   */
  (0, _createClass2["default"])(BatchProcessForm, [{
    key: "setProcess",
    value: function setProcess(name, value) {
      var _this2 = this;
      return new Promise(function (res) {
        return _this2.setState((0, _defineProperty2["default"])({}, name, value), res());
      });
    }

    /**
     * Add a list item to a container.
     *
     * @param {number} containerId - the container to add an item to
     */
  }, {
    key: "addListItem",
    value: function addListItem(containerId) {
      var _clone = (0, _helpers.clone)(this.state),
        list = _clone.list,
        current = _clone.current,
        count = _clone.count;

      // Increase count.
      count++;

      // Set Specimen and Container.
      var container = this.props.data.containers[containerId];
      var specimen = this.props.data.specimens[container.specimenId];

      // Set current global values.
      current.typeId = specimen.typeId;

      // Set list values.
      list[count] = {
        specimen: specimen,
        container: container
      };
      this.setState({
        list: list,
        current: current,
        count: count,
        containerId: containerId
      }, this.setState({
        containerId: null
      }));
    }

    /**
     * Set the current pool to display
     *
     * @param {string} name - the name to display
     * @param {number} poolId - the pool to display
     */
  }, {
    key: "setPool",
    value: function setPool(name, poolId) {
      var _this3 = this;
      var pool = (0, _helpers.clone)(this.props.data.pools[poolId]);
      this.setState({
        loading: true
      });
      this.setCurrent('poolId', poolId).then(function () {
        return Promise.all(pool.specimenIds.map(function (specimenId) {
          return Object.values(_this3.state.list).find(function (item) {
            return item.specimen.id === specimenId;
          }) || _this3.addListItem(_this3.props.data.specimens[specimenId].containerId);
        }).map(function (p) {
          return p instanceof Promise ? p : Promise.resolve(p);
        }));
      }).then(function () {
        return _this3.setCurrent('poolId', null);
      }).then(function () {
        return _this3.setState({
          loading: false
        });
      });
    }

    /**
     * Remove a key from the list.
     *
     * @param {string} key - the key to remove
     */
  }, {
    key: "removeListItem",
    value: function removeListItem(key) {
      var _clone2 = (0, _helpers.clone)(this.state),
        list = _clone2.list,
        current = _clone2.current;
      delete list[key];
      current = (0, _helpers.isEmpty)(list) ? {} : current;
      var containerId = null;
      this.setState({
        list: list,
        current: current,
        containerId: containerId
      });
    }

    /**
     * Validate a container in a list
     *
     * @param {number} containerId - the container to validate
     * @return {Promise}
     */
  }, {
    key: "validateListItem",
    value: function validateListItem(containerId) {
      var _clone3 = (0, _helpers.clone)(this.state),
        current = _clone3.current,
        list = _clone3.list;
      var container = this.props.data.containers[containerId];
      var specimen = this.props.data.specimens[container.specimenId];
      if (!(0, _helpers.isEmpty)(list) && specimen.typeId !== current.typeId) {
        _sweetalert["default"].fire('Oops!', 'Specimens must be of the same Type', 'warning');
        return Promise.reject();
      }
      return Promise.resolve();
    }

    /**
     * Validate a list of specimens
     *
     * @param {array} list - the list of specimens to validate
     * @return {Promise}
     */
  }, {
    key: "validateList",
    value: function validateList(list) {
      return new Promise(function (resolve, reject) {
        var barcodes = Object.values(list).filter(function (item) {
          return !!item.specimen.preparation;
        }).map(function (item) {
          return item.container.barcode;
        });
        if (barcodes.length > 0) {
          return _sweetalert["default"].fire({
            title: 'Warning!',
            html: "Preparation for specimen(s) <b>".concat(barcodes.join(', '), "</b> ") + "already exists. By completing this form, the previous " + "preparation will be overwritten.",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Proceed'
          }).then(function (result) {
            return result.value ? resolve(list) : reject();
          });
        } else {
          return resolve(list);
        }
      });
    }

    /**
     * Update the current state object, which acts as a generic state holder for this
     * component.
     *
     * @param {string} name - the name
     * @param {string} value - the value
     * @return {Promise}
     */
  }, {
    key: "setCurrent",
    value: function setCurrent(name, value) {
      var _this4 = this;
      var current = (0, _helpers.clone)(this.state.current);
      current[name] = value;
      return new Promise(function (res) {
        return _this4.setState({
          current: current
        }, res());
      });
    }

    /**
     * Render the React element
     *
     * @return {JSX}
     */
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;
      if (this.state.loading) {
        return /*#__PURE__*/React.createElement(_Loader["default"], null);
      }
      var _this$props = this.props,
        data = _this$props.data,
        options = _this$props.options;
      var _this$state = this.state,
        containerId = _this$state.containerId,
        poolId = _this$state.poolId,
        preparation = _this$state.preparation,
        list = _this$state.list,
        current = _this$state.current,
        errors = _this$state.errors;
      var preparationForm = this.state.editable.preparation ? /*#__PURE__*/React.createElement(_processForm["default"], {
        edit: true,
        errors: errors.specimen.preparation || {},
        options: options,
        process: preparation,
        processStage: "preparation",
        setParent: this.setProcess,
        setCurrent: this.setCurrent,
        typeId: current.typeId
      }) : null;

      // TODO: This should likely be filtered so that only pools that match the
      // proper criteria are left in the list.
      var pools = (0, _helpers.mapFormOptions)(data.pools, 'label');
      var glyphStyle = {
        color: '#DDDDDD',
        marginLeft: 10,
        cursor: 'pointer'
      };
      var barcodeList = Object.entries(list).map(function (_ref) {
        var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
          key = _ref2[0],
          item = _ref2[1];
        var handleRemoveItem = function handleRemoveItem() {
          return _this5.removeListItem(key);
        };
        return /*#__PURE__*/React.createElement("div", {
          key: key,
          className: "preparation-item"
        }, /*#__PURE__*/React.createElement("div", null, item.container.barcode), /*#__PURE__*/React.createElement("div", {
          className: "glyphicon glyphicon-remove",
          style: glyphStyle,
          onClick: handleRemoveItem
        }));
      });
      var editForms = Object.keys(list).length > 1 && /*#__PURE__*/React.createElement("div", {
        className: "form-top"
      }, /*#__PURE__*/React.createElement(_Tabs.VerticalTabs, {
        tabs: [{
          id: 'preparation',
          label: 'Preparation'
        }],
        onTabChange: function onTabChange(id) {
          return _this5.setState({
            editable: (0, _defineProperty2["default"])({}, id, true)
          });
        },
        updateURL: false
      }, /*#__PURE__*/React.createElement(_Tabs.TabPane, {
        TabId: "preparation"
      }, preparationForm)));
      var handlePoolInput = function handlePoolInput(name, value) {
        return value && _this5.setPool(name, value);
      };
      var form = /*#__PURE__*/React.createElement(_Form.FormElement, null, /*#__PURE__*/React.createElement("div", {
        className: "row"
      }, /*#__PURE__*/React.createElement("div", {
        className: "col-sm-10 col-sm-offset-1"
      }, /*#__PURE__*/React.createElement(_Form.StaticElement, {
        label: "Processing Note",
        text: "Select or Scan the specimens to be prepared. Specimens must have a Status of 'Available', and share the same Type. Any previous value associated with a Specimen will be overwritten if one is added on this form."
      }), /*#__PURE__*/React.createElement(_Form.StaticElement, {
        label: "Specimen Type",
        text: (options.specimen.types[current.typeId] || {}).label || '—'
      }), /*#__PURE__*/React.createElement("div", {
        className: "row"
      }, /*#__PURE__*/React.createElement("div", {
        className: "col-xs-6"
      }, /*#__PURE__*/React.createElement("h4", null, "Barcode Input"), /*#__PURE__*/React.createElement("div", {
        className: "form-top"
      }), /*#__PURE__*/React.createElement(BarcodeInput, {
        data: data,
        options: options,
        list: list,
        containerId: containerId,
        validateListItem: this.validateListItem,
        addListItem: this.addListItem
      }), /*#__PURE__*/React.createElement(_Form.SearchableDropdown, {
        name: 'poolId',
        label: 'Pool',
        onUserInput: handlePoolInput,
        options: pools,
        value: poolId
      })), /*#__PURE__*/React.createElement("div", {
        className: "col-xs-6"
      }, /*#__PURE__*/React.createElement("h4", null, "Barcode List"), /*#__PURE__*/React.createElement("div", {
        className: "form-top"
      }), /*#__PURE__*/React.createElement("div", {
        className: "preparation-list"
      }, barcodeList))), editForms)));
      var handleClose = function handleClose() {
        return _this5.setState(initialState, _this5.props.onClose);
      };
      var handleSubmit = function handleSubmit() {
        var prepList = Object.values(list).map(function (item) {
          var specimen = (0, _helpers.clone)(item.specimen);
          specimen.preparation = (0, _helpers.clone)(preparation);
          specimen.preparation.centerId = item.container.centerId;
          return specimen;
        });
        return new Promise(function (resolve, reject) {
          _this5.validateList(list).then(function () {
            return _this5.props.onSubmit(prepList);
          }, function () {
            return reject();
          }).then(function () {
            return resolve();
          }, function (errors) {
            return _this5.setState({
              errors: errors
            }, reject());
          });
        });
      };
      return /*#__PURE__*/React.createElement(_Modal["default"], {
        title: "Process Specimens",
        show: this.props.show,
        onClose: handleClose,
        onSubmit: handleSubmit,
        throwWarning: true
      }, form);
    }
  }]);
  return BatchProcessForm;
}(React.PureComponent); // BatchProcessForm.propTypes
BatchProcessForm.propTypes = {
  data: _propTypes["default"].shape({
    containers: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      specimenId: _propTypes["default"].number.isRequired
    })).isRequired,
    specimens: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      containerId: _propTypes["default"].number.isRequired
    })).isRequired,
    pools: _propTypes["default"].array.isRequired
  }).isRequired,
  options: _propTypes["default"].shape({
    specimen: _propTypes["default"].shape({
      typeUnits: _propTypes["default"].string,
      types: _propTypes["default"].arrayOf(_propTypes["default"].string)
    }).isRequired,
    container: _propTypes["default"].shape({
      stati: _propTypes["default"].object,
      types: _propTypes["default"].arrayOf(_propTypes["default"].string)
    }).isRequired
  }).isRequired,
  onClose: _propTypes["default"].func.isRequired,
  onSubmit: _propTypes["default"].func.isRequired,
  show: _propTypes["default"].bool.isRequired
};

/**
 * Component to read a barcode from the barcode scanner
 */
var BarcodeInput = /*#__PURE__*/function (_PureComponent) {
  (0, _inherits2["default"])(BarcodeInput, _PureComponent);
  var _super2 = _createSuper(BarcodeInput);
  function BarcodeInput() {
    (0, _classCallCheck2["default"])(this, BarcodeInput);
    return _super2.apply(this, arguments);
  }
  (0, _createClass2["default"])(BarcodeInput, [{
    key: "render",
    value:
    /**
     * Render the React component
     *
     * @return {JSX}
     */
    function render() {
      var _this6 = this;
      var _this$props2 = this.props,
        data = _this$props2.data,
        options = _this$props2.options,
        list = _this$props2.list,
        containerId = _this$props2.containerId,
        addListItem = _this$props2.addListItem;
      // Create options for barcodes based on match typeId
      var barcodesPrimary = Object.values(data.containers).reduce(function (result, container) {
        // Check if container is of type primary
        if (options.container.types[container.typeId].primary == 1) {
          var specimen = data.specimens[container.specimenId];

          // Check if specimen is accessible before proceeding
          if (specimen) {
            var availableId = Object.keys(options.container.stati).find(function (key) {
              return options.container.stati[key].label == 'Available';
            });
            var protocolExists = Object.values(options.specimen.protocols).find(function (protocol) {
              return protocol.typeId == specimen.typeId;
            });
            var inList = Object.values(list).find(function (i) {
              return i.container.id == container.id;
            });
            if (container.statusId == availableId && protocolExists && !inList) {
              result[container.id] = container.barcode;
            }
          }
        }
        return result;
      }, {});
      var handleInput = function handleInput(name, containerId) {
        containerId && _this6.props.validateListItem(containerId).then(function () {
          return addListItem(containerId);
        });
      };
      return /*#__PURE__*/React.createElement(_Form.SearchableDropdown, {
        name: 'containerId',
        label: 'Specimen',
        onUserInput: handleInput,
        options: barcodesPrimary,
        value: containerId
      });
    }
  }]);
  return BarcodeInput;
}(_react.PureComponent); // BarcodeInput.propTypes
BarcodeInput.propTypes = {
  data: _propTypes["default"].shape({
    containers: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      specimenId: _propTypes["default"].number.isRequired
    })).isRequired,
    specimens: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      containerId: _propTypes["default"].number.isRequired
    })).isRequired,
    pools: _propTypes["default"].array.isRequired
  }).isRequired,
  options: _propTypes["default"].shape({
    container: _propTypes["default"].shape({
      types: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
      stati: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      }))
    }).isRequired,
    specimen: _propTypes["default"].shape({
      types: _propTypes["default"].arrayOf(_propTypes["default"].string),
      protocols: _propTypes["default"].arrayOf(_propTypes["default"].string)
    }).isRequired
  }).isRequired,
  list: _propTypes["default"].array.isRequired,
  containerId: _propTypes["default"].number.isRequired,
  addListItem: _propTypes["default"].func.isRequired,
  validateListItem: _propTypes["default"].func.isRequired
};
var _default = exports["default"] = BatchProcessForm;

/***/ }),

/***/ "./modules/biobank/jsx/container.js":
/*!******************************************!*\
  !*** ./modules/biobank/jsx/container.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
var _helpers = __webpack_require__(/*! ./helpers.js */ "./modules/biobank/jsx/helpers.js");
var _containerDisplay = _interopRequireDefault(__webpack_require__(/*! ./containerDisplay */ "./modules/biobank/jsx/containerDisplay.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * Biobank Container
 *
 * Fetches data corresponding to a given Container from Loris backend and
 * displays a page allowing viewing of meta information of the container
 */
var BiobankContainer = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(BiobankContainer, _Component);
  var _super = _createSuper(BiobankContainer);
  /**
   * Constructor
   */
  function BiobankContainer() {
    var _this;
    (0, _classCallCheck2["default"])(this, BiobankContainer);
    _this = _super.call(this);
    _this.drag = _this.drag.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  /**
   * Handle dragging of a container
   *
   * @param {Event} e - the drag event
   */
  (0, _createClass2["default"])(BiobankContainer, [{
    key: "drag",
    value: function drag(e) {
      var container = JSON.stringify(this.props.data.containers[e.target.id]);
      e.dataTransfer.setData('text/plain', container);
    }

    /**
     * Render React component
     *
     * @return {JSX}
     */
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$props = this.props,
        current = _this$props.current,
        data = _this$props.data,
        editable = _this$props.editable,
        options = _this$props.options,
        container = _this$props.container;
      var checkoutButton = function checkoutButton() {
        if (!loris.userHasPermission('biobank_container_edit') || data.containers[container.id].childContainerIds.length == 0) {
          return;
        }
        return /*#__PURE__*/_react["default"].createElement("div", {
          style: {
            marginLeft: 'auto',
            height: '10%',
            marginRight: '10%'
          }
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: !editable.containerCheckout && !editable.loadContainer ? 'action-button update open' : 'action-button update closed',
          title: "Checkout Child Containers",
          onClick: function onClick() {
            return _this2.props.edit('containerCheckout');
          }
        }, /*#__PURE__*/_react["default"].createElement("span", {
          className: "glyphicon glyphicon-share"
        })));
      };
      var parentBarcodes = this.props.getParentContainerBarcodes(container);
      var barcodes = (0, _helpers.mapFormOptions)(data.containers, 'barcode');
      // delete values that are parents of the container
      Object.keys(parentBarcodes).forEach(function (key) {
        return Object.keys(barcodes).forEach(function (i) {
          return parentBarcodes[key] == barcodes[i] && delete barcodes[i];
        });
      });
      var barcodePathDisplay = this.props.getBarcodePathDisplay(parentBarcodes);
      var coordinates = data.containers[container.id].childContainerIds.reduce(function (result, id) {
        var container = data.containers[id];
        if (container.coordinate) {
          result[container.coordinate] = id;
        }
        return result;
      }, {});
      var containerDisplay = /*#__PURE__*/_react["default"].createElement("div", {
        className: "display-container"
      }, checkoutButton(), /*#__PURE__*/_react["default"].createElement(_containerDisplay["default"], {
        history: this.props.history,
        data: data,
        container: container,
        barcodes: barcodes,
        current: current,
        options: options,
        dimensions: options.container.dimensions[container.dimensionId],
        coordinates: coordinates,
        editable: editable,
        edit: this.props.edit,
        clearAll: this.props.clearAll,
        setCurrent: this.props.setCurrent,
        setCheckoutList: this.props.setCheckoutList,
        editContainer: this.props.editContainer,
        updateContainer: this.props.updateContainer
      }), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          display: 'inline'
        }
      }, barcodePathDisplay));
      var containerList = function containerList() {
        if (!container.childContainerIds) {
          return /*#__PURE__*/_react["default"].createElement("div", {
            className: "title"
          }, "This Container is Empty!");
        }
        var childIds = container.childContainerIds;
        var listAssigned = [];
        var coordinateList = [];
        var listUnassigned = [];
        childIds.forEach(function (childId) {
          if (!loris.userHasPermission('biobank_specimen_view')) {
            return;
          }
          var child = data.containers[childId];
          if (child.coordinate) {
            listAssigned.push( /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Link, {
              key: childId,
              to: "/barcode=".concat(child.barcode)
            }, child.barcode)));
            var coordinate = _this2.props.getCoordinateLabel(child);
            coordinateList.push( /*#__PURE__*/_react["default"].createElement("div", null, "at ", coordinate));
          } else {
            listUnassigned.push( /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Link, {
              key: childId,
              to: "/barcode=".concat(child.barcode),
              id: child.id,
              draggable: true,
              onDragStart: _this2.drag
            }, child.barcode), /*#__PURE__*/_react["default"].createElement("br", null)));
          }
        });
        return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
          className: "title"
        }, listAssigned.length !== 0 ? 'Assigned Containers' : null), /*#__PURE__*/_react["default"].createElement("div", {
          className: "container-coordinate"
        }, /*#__PURE__*/_react["default"].createElement("div", null, listAssigned), /*#__PURE__*/_react["default"].createElement("div", {
          style: {
            paddingLeft: 10
          }
        }, coordinateList)), listAssigned.length !== 0 ? /*#__PURE__*/_react["default"].createElement("br", null) : null, /*#__PURE__*/_react["default"].createElement("div", {
          className: "title"
        }, listUnassigned.length !== 0 ? 'Unassigned Containers' : null), listUnassigned);
      };
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "container-display"
      }, containerDisplay, /*#__PURE__*/_react["default"].createElement("div", {
        className: "container-list"
      }, containerList()));
    }
  }]);
  return BiobankContainer;
}(_react.Component);
BiobankContainer.propTypes = {
  data: _propTypes["default"].shape({
    containers: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      specimenId: _propTypes["default"].number.isRequired,
      coordinate: _propTypes["default"].string,
      barcode: _propTypes["default"].string.isRequired,
      id: _propTypes["default"].number.isRequired,
      childContainerIds: _propTypes["default"].arrayOf(_propTypes["default"].number),
      dimensionId: _propTypes["default"].number
    })).isRequired,
    specimens: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      containerId: _propTypes["default"].number.isRequired
    })).isRequired,
    pools: _propTypes["default"].array.isRequired
  }).isRequired,
  current: _propTypes["default"].number.isRequired,
  editable: _propTypes["default"].shape({
    containerCheckout: _propTypes["default"].func.isRequired,
    loadContainer: _propTypes["default"].func.isRequired
  }).isRequired,
  options: _propTypes["default"].shape({
    container: _propTypes["default"].shape({
      dimensions: _propTypes["default"].object,
      stati: _propTypes["default"].object,
      types: _propTypes["default"].arrayOf(_propTypes["default"].string)
    }).isRequired
  }).isRequired,
  container: _propTypes["default"].shape({
    id: _propTypes["default"].number.isRequired,
    coordinate: _propTypes["default"].string,
    barcode: _propTypes["default"].string.isRequired,
    childContainerIds: _propTypes["default"].arrayOf(_propTypes["default"].number),
    dimensionId: _propTypes["default"].number
  }).isRequired,
  edit: _propTypes["default"].func.isRequired,
  getParentContainerBarcodes: _propTypes["default"].func.isRequired,
  getBarcodePathDisplay: _propTypes["default"].func.isRequired,
  history: _propTypes["default"].object.isRequired,
  clearAll: _propTypes["default"].func.isRequired,
  setCurrent: _propTypes["default"].func.isRequired,
  setCheckoutList: _propTypes["default"].func.isRequired,
  editContainer: _propTypes["default"].func.isRequired,
  updateContainer: _propTypes["default"].func.isRequired,
  getCoordinateLabel: _propTypes["default"].func.isRequired
};
var _default = exports["default"] = BiobankContainer;

/***/ }),

/***/ "./modules/biobank/jsx/containerDisplay.js":
/*!*************************************************!*\
  !*** ./modules/biobank/jsx/containerDisplay.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _sweetalert = _interopRequireDefault(__webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js"));
var _Form = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");
var _helpers = __webpack_require__(/*! ./helpers.js */ "./modules/biobank/jsx/helpers.js");
/**
 * React component to display a container
 *
 * @param {object} props - React props
 * @return {JSX}
 */
function ContainerDisplay(props) {
  var barcodes = props.barcodes,
    coordinates = props.coordinates,
    _props$current = props.current,
    current = _props$current === void 0 ? {} : _props$current,
    data = props.data,
    dimensions = props.dimensions,
    editable = props.editable,
    options = props.options;
  var history = props.history,
    select = props.select,
    container = props.container,
    selectedCoordinate = props.selectedCoordinate;
  var clearAll = props.clearAll,
    editContainer = props.editContainer,
    setContainer = props.setContainer,
    updateContainer = props.updateContainer,
    setCurrent = props.setCurrent,
    setCheckoutList = props.setCheckoutList,
    edit = props.edit;
  var redirectURL = function redirectURL(e) {
    var coordinate = e.target.id;
    if (coordinates[coordinate]) {
      var barcode = data.containers[coordinates[coordinate]].barcode;
      history.push("/barcode=".concat(barcode));
    }
  };
  var allowDrop = function allowDrop(e) {
    return e.preventDefault();
  };
  var drag = function drag(e) {
    var container = JSON.stringify(data.containers[coordinates[e.target.id]]);
    e.dataTransfer.setData('text/plain', container);
  };
  var drop = function drop(e) {
    e.preventDefault();
    var container = JSON.parse(e.dataTransfer.getData('text/plain'));
    var newCoordinate = parseInt(e.target.id);
    container.coordinate = newCoordinate;
    updateContainer(container, false);
  };
  var increaseCoordinate = function increaseCoordinate(coordinate) {
    var capacity = dimensions.x * dimensions.y * dimensions.z;
    coordinate++;
    Object.keys(coordinates).forEach(function (c) {
      if (coordinate > capacity) {
        clearAll();
      } else if (c == coordinate) {
        coordinate++;
      }
    });
    setCurrent('coordinate', coordinate);
  };
  var setBarcode = function setBarcode(name, barcode) {
    return setCurrent('barcode', barcode);
  };
  var loadContainer = function loadContainer() {
    var barcode = current.barcode;
    var containerId = Object.keys(barcodes).find(function (id) {
      return barcodes[id] === barcode;
    });
    if (!containerId) {
      return;
    }
    var newContainer = data.containers[containerId];
    newContainer.parentContainerId = container.id;
    newContainer.coordinate = current.coordinate;
    updateContainer(newContainer, false).then(function () {
      if (current.sequential) {
        var _coordinate = current.coordinate;
        increaseCoordinate(_coordinate);
        setCurrent('barcode', null);
      } else {
        clearAll();
      }
    });
    setCurrent('prevCoordinate', newContainer.coordinate);
  };
  var checkoutContainers = function checkoutContainers() {
    var checkoutList = current.list;
    var checkoutPromises = Object.values(checkoutList).map(function (container) {
      container.parentContainerId = null;
      container.coordinate = null;
      return updateContainer(container, false);
    });
    Promise.all(checkoutPromises).then(function () {
      return clearAll();
    }).then(function () {
      return _sweetalert["default"].fire('Containers Successfully Checked Out!', '', 'success');
    });
  };
  var barcodeField;
  if ((editable || {}).loadContainer) {
    barcodeField = /*#__PURE__*/React.createElement(_Form.TextboxElement, {
      name: "barcode",
      label: "Barcode",
      onUserInput: setBarcode,
      value: current.barcode,
      placeHolder: "Please Scan or Type Barcode",
      autoFocus: true
    });
  }
  var load = /*#__PURE__*/React.createElement("div", {
    className: (editable || {}).loadContainer ? 'open' : 'closed'
  }, /*#__PURE__*/React.createElement(_Form.FormElement, null, /*#__PURE__*/React.createElement(_Form.StaticElement, {
    label: "Note",
    text: "Scan Containers to be Loaded. If Sequential is checked, the Coordinate will Auto-Increment after each Load."
  }), /*#__PURE__*/React.createElement(_Form.CheckboxElement, {
    name: "sequential",
    label: "Sequential",
    value: current.sequential,
    onUserInput: setCurrent
  }), barcodeField, /*#__PURE__*/React.createElement(_Form.ButtonElement, {
    label: "Load",
    onUserInput: loadContainer
  }), /*#__PURE__*/React.createElement(_Form.StaticElement, {
    text: /*#__PURE__*/React.createElement("a", {
      onClick: clearAll,
      style: {
        cursor: 'pointer'
      }
    }, "Cancel")
  })));

  // place container children in an object
  var children = {};
  if ((container || {}).childContainerIds) {
    Object.values(data.containers).map(function (c) {
      container.childContainerIds.forEach(function (id) {
        if (c.id == id) {
          children[id] = c;
        }
      });
    });
  }
  if ((editable || {}).containerCheckout) {
    // Only children of the current container can be checked out.
    var _barcodes = (0, _helpers.mapFormOptions)(children, 'barcode');
    barcodeField = /*#__PURE__*/React.createElement(_Form.SearchableDropdown, {
      name: "barcode",
      label: "Barcode",
      options: _barcodes,
      onUserInput: function onUserInput(name, value) {
        value && setCheckoutList(children[value]);
      },
      value: current.containerId,
      placeHolder: "Please Scan or Select Barcode",
      autoFocus: true
    });
  }
  var checkout = /*#__PURE__*/React.createElement("div", {
    className: (editable || {}).containerCheckout ? 'open' : 'closed'
  }, /*#__PURE__*/React.createElement(_Form.FormElement, null, /*#__PURE__*/React.createElement(_Form.StaticElement, {
    label: "Note",
    text: "Click, Select or Scan Containers to be Unloaded and Press 'Confirm'"
  }), barcodeField, /*#__PURE__*/React.createElement(_Form.ButtonElement, {
    label: "Confirm",
    type: "button",
    onUserInput: checkoutContainers
  }), /*#__PURE__*/React.createElement(_Form.StaticElement, {
    text: /*#__PURE__*/React.createElement("a", {
      onClick: clearAll,
      style: {
        cursor: 'pointer'
      }
    }, "Cancel")
  })));
  var display;
  var column = [];
  var row = [];
  var coordinate = 1;
  if (dimensions) {
    for (var y = 1; y <= dimensions.y; y++) {
      column = [];
      for (var x = 1; x <= dimensions.x; x++) {
        var nodeWidth = 500 / dimensions.x - 500 / dimensions.x * 0.08;
        var nodeStyle = {
          width: nodeWidth
        };
        var nodeClass = 'node';
        var tooltipTitle = null;
        var title = null;
        var dataHtml = 'false';
        var dataToggle = null;
        var dataPlacement = null;
        var draggable = 'false';
        var onDragStart = null;
        var onDragOver = allowDrop;
        var onDrop = drop;
        var onClick = null;
        var optcon = options.container;
        if (!select) {
          if ((coordinates || {})[coordinate]) {
            onClick = redirectURL;
            if (coordinate in current.list) {
              nodeClass = 'node checkout';
            } else if (coordinate == current.prevCoordinate) {
              nodeClass = 'node new';
            } else {
              nodeClass = 'node occupied';
            }
            dataHtml = 'true';
            dataToggle = 'tooltip';
            dataPlacement = 'top';
            // This is to avoid a console error
            if (children[coordinates[coordinate]]) {
              var coord = coordinates[coordinate];
              tooltipTitle = '<h5>' + children[coord].barcode + '</h5>' + '<h5>' + optcon.types[children[coord].typeId].label + '</h5>' + '<h5>' + optcon.stati[children[coord].statusId].label + '</h5>';
            }
            draggable = !loris.userHasPermission('biobank_container_edit') || editable.loadContainer || editable.containerCheckout ? 'false' : 'true';
            onDragStart = drag;
            if (editable.containerCheckout) {
              onClick = function onClick(e) {
                var container = data.containers[coordinates[e.target.id]];
                setCheckoutList(container);
              };
            }
            if (editable.loadContainer) {
              onClick = null;
            }
            onDragOver = null;
            onDrop = null;
          } else if (loris.userHasPermission('biobank_container_edit') && !editable.containerCheckout) {
            nodeClass = coordinate == current.coordinate ? 'node selected' : 'node load';
            title = 'Load...';
            onClick = function onClick(e) {
              var containerId = e.target.id;
              edit('loadContainer').then(function () {
                return editContainer(container);
              }).then(function () {
                return setCurrent('coordinate', containerId);
              });
            };
          }
        }
        if (select) {
          if (coordinate == selectedCoordinate) {
            nodeClass = 'node occupied';
          } else if (selectedCoordinate instanceof Array && selectedCoordinate.includes(coordinate)) {
            nodeClass = 'node occupied';
          } else if (!coordinates) {
            nodeClass = 'node available';
            onClick = function onClick(e) {
              return setContainer('coordinate', e.target.id);
            };
          } else if (coordinates) {
            if (!coordinates[coordinate]) {
              nodeClass = 'node available';
              onClick = function onClick(e) {
                return setContainer('coordinate', e.target.id);
              };
            } else if (coordinates[coordinate]) {
              (function () {
                var childContainer = data.containers[coordinates[coordinate]];
                var specimen = Object.values(data.specimens).find(function (specimen) {
                  return specimen.containerId == childContainer.id;
                });
                var quantity = '';
                if (specimen) {
                  quantity = "<h5>".concat(specimen.quantity + ' ' + options.specimen.units[specimen.unitId].label, "</h5>");
                }
                dataHtml = 'true';
                dataToggle = 'tooltip';
                dataPlacement = 'top';
                tooltipTitle = "<h5>".concat(childContainer.barcode, "</h5>") + "<h5>".concat(optcon.types[childContainer.typeId].label, "</h5>") + quantity + "<h5>".concat(optcon.stati[childContainer.statusId].label, "</h5>");
              })();
            }
          }
        }
        var coordinateDisplay = void 0;
        if (dimensions.xNum == 1 && dimensions.yNum == 1) {
          coordinateDisplay = x + dimensions.x * (y - 1);
        } else {
          var xVal = dimensions.xNum == 1 ? x : String.fromCharCode(64 + x);
          var yVal = dimensions.yNum == 1 ? y : String.fromCharCode(64 + y);
          coordinateDisplay = yVal + '' + xVal;
        }
        column.push( /*#__PURE__*/React.createElement("div", {
          key: x,
          id: coordinate,
          title: title,
          className: nodeClass,
          "data-html": dataHtml,
          "data-toggle": dataToggle,
          "data-placement": dataPlacement,
          "data-original-title": tooltipTitle,
          style: nodeStyle,
          onClick: onClick,
          draggable: draggable,
          onDragStart: onDragStart,
          onDragOver: onDragOver,
          onDrop: onDrop
        }, coordinateDisplay));
        coordinate++;
      }
      var rowHeight = 500 / dimensions.y - 500 / dimensions.y * 0.08;
      // let rowMargin = (500/dimensions.y * 0.04);
      var rowStyle = {
        height: rowHeight
      };
      row.push( /*#__PURE__*/React.createElement("div", {
        key: y,
        className: "row",
        style: rowStyle
      }, column));
    }
    display = row;
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 500
    }
  }, checkout, load), /*#__PURE__*/React.createElement("div", {
    className: "display"
  }, display));
}

// containerDisplay.propTypes
ContainerDisplay.propTypes = {
  barcodes: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
  coordinates: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
  current: _propTypes["default"].shape({
    barcode: _propTypes["default"].string.isRequired,
    containerId: _propTypes["default"].number.isRequired,
    coordinate: _propTypes["default"].string.isRequired,
    sequential: _propTypes["default"].number,
    list: _propTypes["default"].array.isRequired,
    prevCoordinate: _propTypes["default"].string
  }).isRequired,
  data: _propTypes["default"].shape({
    containers: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      specimenId: _propTypes["default"].number.isRequired,
      parentContainerId: _propTypes["default"].number,
      coordinate: _propTypes["default"].string.isRequired,
      childContainerIds: _propTypes["default"].arrayOf(_propTypes["default"].number)
    })).isRequired,
    specimens: _propTypes["default"].array.isRequired,
    pools: _propTypes["default"].array.isRequired
  }).isRequired,
  dimensions: _propTypes["default"].shape({
    x: _propTypes["default"].number.isRequired,
    y: _propTypes["default"].number.isRequired,
    z: _propTypes["default"].number,
    xNum: _propTypes["default"].number,
    yNum: _propTypes["default"].number
  }).isRequired,
  editable: _propTypes["default"].shape({
    loadContainer: _propTypes["default"].func.isRequired,
    containerCheckout: _propTypes["default"].bool.isRequired
  }).isRequired,
  options: _propTypes["default"].shape({
    container: _propTypes["default"].shape({
      types: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
      stati: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })).isRequired,
      dimensions: _propTypes["default"].object.isRequired
    }).isRequired,
    specimen: _propTypes["default"].shape({
      units: _propTypes["default"].string,
      protocols: _propTypes["default"].arrayOf(_propTypes["default"].string)
    }).isRequired
  }).isRequired,
  history: _propTypes["default"].object.isRequired,
  select: _propTypes["default"].func.isRequired,
  container: _propTypes["default"].shape({
    id: _propTypes["default"].number.isRequired,
    parentContainerId: _propTypes["default"].number,
    childContainerIds: _propTypes["default"].array,
    coordinate: _propTypes["default"].string.isRequired
  }).isRequired,
  selectedCoordinate: _propTypes["default"].string.isRequired,
  clearAll: _propTypes["default"].func.isRequired,
  editContainer: _propTypes["default"].func.isRequired,
  setContainer: _propTypes["default"].func.isRequired,
  updateContainer: _propTypes["default"].func.isRequired,
  setCurrent: _propTypes["default"].func.isRequired,
  setCheckoutList: _propTypes["default"].func.isRequired,
  edit: _propTypes["default"].func.isRequired,
  getParentContainerBarcodes: _propTypes["default"].func.isRequired,
  getBarcodePathDisplay: _propTypes["default"].func.isRequired
};
var _default = exports["default"] = ContainerDisplay;

/***/ }),

/***/ "./modules/biobank/jsx/containerForm.js":
/*!**********************************************!*\
  !*** ./modules/biobank/jsx/containerForm.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _Modal = _interopRequireDefault(__webpack_require__(/*! Modal */ "./jsx/Modal.tsx"));
var _listForm = __webpack_require__(/*! ./listForm.js */ "./modules/biobank/jsx/listForm.js");
var _Form = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");
var _helpers = __webpack_require__(/*! ./helpers.js */ "./modules/biobank/jsx/helpers.js");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var initialState = {
  current: {},
  list: {},
  errors: {
    list: {}
  }
};

/**
 * A Form for adding Containers
 */
var ContainerForm = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(ContainerForm, _Component);
  var _super = _createSuper(ContainerForm);
  /**
   * Constructor
   */
  function ContainerForm() {
    var _this;
    (0, _classCallCheck2["default"])(this, ContainerForm);
    _this = _super.call(this);
    _this.state = initialState;
    _this.setCurrent = _this.setCurrent.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setList = _this.setList.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleSubmit = _this.handleSubmit.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  /**
   * Set the current container being displayed
   *
   * @param {string} name - the name of the container
   * @param {string} value - the value
   */
  (0, _createClass2["default"])(ContainerForm, [{
    key: "setCurrent",
    value: function setCurrent(name, value) {
      var _clone = (0, _helpers.clone)(this.state),
        current = _clone.current;
      current[name] = value;
      this.setState({
        current: current
      });
    }

    /**
     * Sets a list in the container state
     *
     * @param {object} list - the state to set
     */
  }, {
    key: "setList",
    value: function setList(list) {
      this.setState({
        list: list
      });
    }

    /**
     * Handle submission of a form by calling onSubmit callback
     *
     * @return {Promise}
     */
  }, {
    key: "handleSubmit",
    value: function handleSubmit() {
      var _this2 = this;
      var _this$state = this.state,
        list = _this$state.list,
        current = _this$state.current,
        errors = _this$state.errors;
      return new Promise(function (resolve, reject) {
        _this2.props.onSubmit(list, current, errors).then(function () {
          return resolve();
        }, function (errors) {
          return _this2.setState({
            errors: errors
          }, reject());
        });
      });
    }

    /**
     * Render React component
     *
     * @return {JSX}
     */
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      var _this$state2 = this.state,
        current = _this$state2.current,
        errors = _this$state2.errors,
        list = _this$state2.list;
      var _this$props = this.props,
        options = _this$props.options,
        show = _this$props.show;
      var handleClose = function handleClose() {
        return _this3.setState(initialState, _this3.props.onClose);
      };
      return /*#__PURE__*/_react["default"].createElement(_Modal["default"], {
        title: "Add New Container",
        show: show,
        onClose: handleClose,
        onSubmit: this.handleSubmit,
        throwWarning: true
      }, /*#__PURE__*/_react["default"].createElement(_Form.FormElement, null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-xs-11"
      }, /*#__PURE__*/_react["default"].createElement(_Form.SelectElement, {
        name: "centerId",
        label: "Site",
        options: options.centers,
        onUserInput: this.setCurrent,
        required: true,
        value: current.centerId,
        errorMessage: (errors.container || {}).centerId
      }))), /*#__PURE__*/_react["default"].createElement(_listForm.ListForm, {
        list: list,
        errors: errors.list,
        setList: this.setList,
        listItem: {}
      }, /*#__PURE__*/_react["default"].createElement(ContainerSubForm, {
        options: options
      }))));
    }
  }]);
  return ContainerForm;
}(_react.Component); // ContainerForm.propTypes
ContainerForm.propTypes = {
  onSubmit: _propTypes["default"].func.isRequired,
  options: _propTypes["default"].shape({
    centers: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
    container: _propTypes["default"].shape({
      typesNonPrimary: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired
    }).isRequired
  }).isRequired,
  show: _propTypes["default"].bool.isRequired,
  onClose: _propTypes["default"].func.isRequired
};

/**
 * Container Barcode Form
 *
 * Acts a subform for ContainerForm
 */
var ContainerSubForm = /*#__PURE__*/function (_Component2) {
  (0, _inherits2["default"])(ContainerSubForm, _Component2);
  var _super2 = _createSuper(ContainerSubForm);
  /**
   * Constructor
   */
  function ContainerSubForm() {
    var _this4;
    (0, _classCallCheck2["default"])(this, ContainerSubForm);
    _this4 = _super2.call(this);
    _this4.setContainer = _this4.setContainer.bind((0, _assertThisInitialized2["default"])(_this4));
    return _this4;
  }

  /**
   * Set a value in the container
   *
   * @param {string} name - key name in list
   * @param {string} value - value in list
   */
  (0, _createClass2["default"])(ContainerSubForm, [{
    key: "setContainer",
    value: function setContainer(name, value) {
      this.props.setListItem(name, value, this.props.itemKey);
    }

    /**
     * Render React component
     *
     * @return {JSX}
     */
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
        item = _this$props2.item,
        errors = _this$props2.errors,
        options = _this$props2.options;
      var containerTypesNonPrimary = (0, _helpers.mapFormOptions)(options.container.typesNonPrimary, 'label');
      return /*#__PURE__*/_react["default"].createElement(_listForm.ListItem, this.props, /*#__PURE__*/_react["default"].createElement(_Form.TextboxElement, {
        name: "barcode",
        label: "Barcode",
        onUserInput: this.setContainer,
        required: true,
        value: item.barcode,
        errorMessage: errors.barcode
      }), /*#__PURE__*/_react["default"].createElement(_Form.SelectElement, {
        name: "typeId",
        label: "Container Type",
        options: containerTypesNonPrimary,
        onUserInput: this.setContainer,
        required: true,
        value: item.typeId,
        errorMessage: errors.typeId
      }), /*#__PURE__*/_react["default"].createElement(_Form.TextboxElement, {
        name: "lotNumber",
        label: "Lot Number",
        onUserInput: this.setContainer,
        value: item.lotNumber,
        errorMessage: errors.lotNumber
      }), /*#__PURE__*/_react["default"].createElement(_Form.DateElement, {
        name: "expirationDate",
        label: "Expiration Date",
        onUserInput: this.setContainer,
        value: item.expirationDate,
        errorMessage: errors.expirationDate
      }));
    }
  }]);
  return ContainerSubForm;
}(_react.Component); // ContainerSubForm.propTypes
ContainerSubForm.propTypes = {
  setListItem: _propTypes["default"].func.isRequired,
  itemKey: _propTypes["default"].string.isRequired,
  item: _propTypes["default"].shape({
    barcode: _propTypes["default"].string.isRequired,
    typeId: _propTypes["default"].number.isRequired,
    lotNumber: _propTypes["default"].string.isRequired,
    expirationDate: _propTypes["default"].string
  }).isRequired,
  errors: _propTypes["default"].shape({
    barcode: _propTypes["default"].string,
    typeId: _propTypes["default"].string,
    lotNumber: _propTypes["default"].string,
    expirationDate: _propTypes["default"].string
  }).isRequired,
  options: _propTypes["default"].shape({
    container: _propTypes["default"].shape({
      typesNonPrimary: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired
    }).isRequired
  }).isRequired
};
var _default = exports["default"] = ContainerForm;

/***/ }),

/***/ "./modules/biobank/jsx/containerParentForm.js":
/*!****************************************************!*\
  !*** ./modules/biobank/jsx/containerParentForm.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _Form = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");
var _containerDisplay = _interopRequireDefault(__webpack_require__(/*! ./containerDisplay */ "./modules/biobank/jsx/containerDisplay.js"));
var _helpers = __webpack_require__(/*! ./helpers */ "./modules/biobank/jsx/helpers.js");
/**
 * Biobank Container Parent Form
 *
 * Fetches data from Loris backend and displays a form allowing
 * to specimen a biobank file attached to a specific instrument
 *
 * @param {object} props The component's props
 */
function ContainerParentForm(props) {
  var data = props.data,
    current = props.current,
    options = props.options;
  var setInheritedProperties = function setInheritedProperties(name, containerId) {
    if (!containerId) {
      return;
    }
    var parentContainer = data.containers[containerId];
    var container = (0, _helpers.clone)(current.container);
    container.parentContainerId = parentContainer.id;
    container.coordinate = null;
    container.temperature = parentContainer.temperature;
    container.centerId = parentContainer.centerId;
    container.statusId = parentContainer.statusId;
    props.setCurrent('container', container);
  };
  var removeChildContainers = function removeChildContainers(object, id) {
    delete object[id];
    for (var key in data.containers) {
      if (id == data.containers[key].parentContainerId) {
        object = removeChildContainers(object, key);
      }
    }
    return object;
  };
  var containerBarcodesNonPrimary = Object.values(data.containers).reduce(function (result, container) {
    if (options.container.types[container.typeId].primary == 0) {
      var dimensions = options.container.dimensions[data.containers[container.id].dimensionId];
      var capacity = dimensions.x * dimensions.y * dimensions.z;
      var available = capacity - container.childContainerIds.length;
      result[container.id] = container.barcode + ' (' + available + ' Available Spots)';
    }
    return result;
  }, {});

  // Delete child containers from options if a container is being placed in a
  // another container.
  if (props.container) {
    containerBarcodesNonPrimary = removeChildContainers(containerBarcodesNonPrimary, props.container.id);
  }
  var renderContainerDisplay = function renderContainerDisplay() {
    if (!(current.container.parentContainerId && props.display)) {
      return;
    }
    var coordinates = data.containers[current.container.parentContainerId].childContainerIds.reduce(function (result, id) {
      var container = data.containers[id];
      if (container.coordinate) {
        result[container.coordinate] = id;
      }
      return result;
    }, {});
    return /*#__PURE__*/_react["default"].createElement(_containerDisplay["default"], {
      container: props.container,
      data: data,
      dimensions: options.container.dimensions[data.containers[current.container.parentContainerId].dimensionId],
      coordinates: coordinates,
      parentContainerId: current.container.parentContainerId,
      options: options,
      select: true,
      selectedCoordinate: current.container.coordinate,
      setContainer: props.setContainer
    });
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "row"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "col-lg-11"
  }, /*#__PURE__*/_react["default"].createElement(_Form.SearchableDropdown, {
    name: "parentContainerId",
    label: "Parent Container Barcode",
    options: containerBarcodesNonPrimary,
    onUserInput: setInheritedProperties,
    value: current.container.parentContainerId
  })), renderContainerDisplay());
}
ContainerParentForm.propTypes = {
  setContainer: _propTypes["default"].func.isRequired,
  data: _propTypes["default"].object,
  container: _propTypes["default"].object.isRequired,
  options: _propTypes["default"].object.isRequired,
  current: _propTypes["default"].shape({
    container: _propTypes["default"].shape({
      parentContainerId: _propTypes["default"].number,
      coordinate: _propTypes["default"].string,
      id: _propTypes["default"].number.isRequired
    }).isRequired
  }).isRequired,
  setCurrent: _propTypes["default"].func.isRequired,
  display: _propTypes["default"].string.isRequired
};
var _default = exports["default"] = ContainerParentForm;

/***/ }),

/***/ "./modules/biobank/jsx/containerTab.js":
/*!*********************************************!*\
  !*** ./modules/biobank/jsx/containerTab.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _FilterableDataTable = _interopRequireDefault(__webpack_require__(/*! FilterableDataTable */ "./jsx/FilterableDataTable.js"));
var _search = _interopRequireDefault(__webpack_require__(/*! ./search */ "./modules/biobank/jsx/search.js"));
var _containerForm = _interopRequireDefault(__webpack_require__(/*! ./containerForm */ "./modules/biobank/jsx/containerForm.js"));
var _helpers = __webpack_require__(/*! ./helpers.js */ "./modules/biobank/jsx/helpers.js");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * React component for the Container tab in the Biobank module
 */
var ContainerTab = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(ContainerTab, _Component);
  var _super = _createSuper(ContainerTab);
  /**
   * Constructor
   */
  function ContainerTab() {
    var _this;
    (0, _classCallCheck2["default"])(this, ContainerTab);
    _this = _super.call(this);
    _this.state = {
      editable: {}
    };
    _this.edit = _this.edit.bind((0, _assertThisInitialized2["default"])(_this));
    _this.clearEditable = _this.clearEditable.bind((0, _assertThisInitialized2["default"])(_this));
    _this.mapContainerColumns = _this.mapContainerColumns.bind((0, _assertThisInitialized2["default"])(_this));
    _this.formatContainerColumns = _this.formatContainerColumns.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  /**
   * Mark a key as editable
   *
   * @param {string} stateKey - the key
   * @return {Promise}
   */
  (0, _createClass2["default"])(ContainerTab, [{
    key: "edit",
    value: function edit(stateKey) {
      var _this2 = this;
      var _clone = (0, _helpers.clone)(this.state),
        editable = _clone.editable;
      editable[stateKey] = true;
      return new Promise(function (res) {
        return _this2.setState({
          editable: editable
        }, res());
      });
    }

    /**
     * Clear the editable state of this form.
     */
  }, {
    key: "clearEditable",
    value: function clearEditable() {
      this.setState({
        editable: {}
      });
    }

    /**
     * Map the columns for this container
     *
     * @param {string} column - the column name
     * @param {string} value - the column value
     * @return {string}
     */
  }, {
    key: "mapContainerColumns",
    value: function mapContainerColumns(column, value) {
      switch (column) {
        case 'Type':
          return this.props.options.container.types[value].label;
        case 'Status':
          return this.props.options.container.stati[value].label;
        case 'Site':
          return this.props.options.centers[value];
        default:
          return value;
      }
    }

    /**
     * Format the cells for a column in the container
     *
     * @param {string} column - the column name to format
     * @param {string} value - the value of the column
     * @param {object} row - the rest of the row
     * @return {JSX} a table cell
     */
  }, {
    key: "formatContainerColumns",
    value: function formatContainerColumns(column, value, row) {
      value = this.mapContainerColumns(column, value);
      switch (column) {
        case 'Barcode':
          return /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Link, {
            to: "/barcode=".concat(value)
          }, value));
        case 'Status':
          var style = {};
          switch (value) {
            case 'Available':
              style.color = 'green';
              break;
            case 'Reserved':
              style.color = 'orange';
              break;
            case 'Dispensed':
              style.color = 'red';
              break;
            case 'Discarded':
              style.color = 'red';
              break;
          }
          return /*#__PURE__*/_react["default"].createElement("td", {
            style: style
          }, value);
        case 'Parent Barcode':
          return /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Link, {
            to: "/barcode=".concat(value)
          }, value));
        default:
          return /*#__PURE__*/_react["default"].createElement("td", null, value);
      }
    }

    /**
     * Render React component
     *
     * @return {JSX}
     */
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      var editable = this.state.editable;
      var stati = (0, _helpers.mapFormOptions)(this.props.options.container.stati, 'label');
      var containerTypesNonPrimary = (0, _helpers.mapFormOptions)(this.props.options.container.typesNonPrimary, 'label');
      var containersNonPrimary = Object.values(this.props.data.containers).reduce(function (result, container) {
        // TODO: this check is necessary or else the page will go blank when the
        // first specimen is added.
        if (container) {
          var tprops = _this3.props.options.container.types;
          if (tprops[container.typeId].primary == 0) {
            result[container.id] = container;
          }
          return result;
        }
      }, {});
      var barcodesNonPrimary = (0, _helpers.mapFormOptions)(containersNonPrimary, 'barcode');
      var data = Object.values(containersNonPrimary).map(function (container) {
        return [container.barcode, container.typeId, container.statusId, container.centerId, container.parentContainerBarcode];
      });
      var fields = [{
        label: 'Barcode',
        show: true,
        filter: {
          name: 'barcode',
          type: 'text'
        }
      }, {
        label: 'Type',
        show: true,
        filter: {
          name: 'type',
          type: 'select',
          options: containerTypesNonPrimary
        }
      }, {
        label: 'Status',
        show: true,
        filter: {
          name: 'status',
          type: 'select',
          options: stati
        }
      }, {
        label: 'Site',
        show: true,
        filter: {
          name: 'currentSite',
          type: 'select',
          options: this.props.options.centers
        }
      }, {
        label: 'Parent Barcode',
        show: true,
        filter: {
          name: 'parentBarcode',
          type: 'text'
        }
      }];
      var openSearchContainer = function openSearchContainer() {
        return _this3.edit('searchContainer');
      };
      var openContainerForm = function openContainerForm() {
        return _this3.edit('containerForm');
      };
      var actions = [{
        name: 'goToContainer',
        label: 'Go To Container',
        action: openSearchContainer
      }, {
        name: 'addContainer',
        label: 'Add Container',
        action: openContainerForm,
        show: loris.userHasPermission('biobank_container_create')
      }];
      return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_FilterableDataTable["default"], {
        name: "container",
        data: data,
        fields: fields,
        actions: actions,
        getFormattedCell: this.formatContainerColumns,
        getMappedCell: this.mapContainerColumns,
        progress: this.props.loading
      }), /*#__PURE__*/_react["default"].createElement(_search["default"], {
        title: "Go To Container",
        show: editable.searchContainer,
        onClose: this.clearEditable,
        barcodes: barcodesNonPrimary,
        history: this.props.history
      }), loris.userHasPermission('biobank_container_create') ? /*#__PURE__*/_react["default"].createElement(_containerForm["default"], {
        options: this.props.options,
        show: editable.containerForm,
        onClose: this.clearEditable,
        onSubmit: this.props.createContainers
      }) : null);
    }
  }]);
  return ContainerTab;
}(_react.Component); // ContainerTab.propTypes
ContainerTab.propTypes = {
  options: _propTypes["default"].shape({
    container: _propTypes["default"].shape({
      types: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })).isRequired,
      stati: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })),
      typesNonPrimary: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired
    }).isRequired,
    centers: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired
  }).isRequired,
  data: _propTypes["default"].shape({
    containers: _propTypes["default"].array.isRequired
  }).isRequired,
  loading: _propTypes["default"].bool.isRequired,
  history: _propTypes["default"].object.isRequired,
  createContainers: _propTypes["default"].func.isRequired
};
var _default = exports["default"] = ContainerTab;

/***/ }),

/***/ "./modules/biobank/jsx/customFields.js":
/*!*********************************************!*\
  !*** ./modules/biobank/jsx/customFields.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
/**
 * Biobank Custom Attribute Fields
 *
 * @param {object} props The component's props.
 */
function CustomFields(props) {
  var options = props.options,
    errors = props.errors,
    fields = props.fields,
    object = props.object;
  return Object.keys(fields).map(function (attribute, key) {
    var datatype = options.specimen.attributeDatatypes[fields[attribute]['datatypeId']].datatype;
    if (datatype === 'text' || datatype === 'number') {
      return /*#__PURE__*/_react["default"].createElement(TextboxElement, {
        key: key,
        name: attribute,
        label: fields[attribute].label,
        onUserInput: props.setData,
        required: fields[attribute].required,
        value: object[attribute],
        errorMessage: errors[attribute]
      });
    }
    if (datatype === 'date') {
      return /*#__PURE__*/_react["default"].createElement(DateElement, {
        key: key,
        name: attribute,
        label: fields[attribute].label,
        onUserInput: props.setData,
        required: fields[attribute].required,
        value: object[attribute],
        errorMessage: errors[attribute]
      });
    }
    if (datatype === 'time') {
      return /*#__PURE__*/_react["default"].createElement(TimeElement, {
        key: key,
        name: attribute,
        label: fields[attribute].label,
        onUserInput: props.setData,
        required: fields[attribute].required,
        value: object[attribute],
        errorMessage: errors[attribute]
      });
    }
    if (datatype === 'boolean') {
      // TODO: delete the following line.
      // object[attribute] == null && props.setData(attribute, false);
      return /*#__PURE__*/_react["default"].createElement(CheckboxElement, {
        key: key,
        name: attribute,
        label: fields[attribute].label,
        onUserInput: props.setData,
        required: fields[attribute].required,
        value: object[attribute],
        errorMessage: errors[attribute]
      });
    }
    // Do not present the possibility of uploading if file is already set
    // File must instead be deleted or overwritten.
    if (datatype === 'file' && !(props.data || {})[attribute]) {
      return /*#__PURE__*/_react["default"].createElement(FileElement, {
        key: key,
        name: attribute,
        label: fields[attribute].label,
        onUserInput: props.setData,
        required: fields[attribute].required,
        value: props.current.files[object[attribute]],
        errorMessage: errors[attribute]
      });
    }
  });
}
CustomFields.propTypes = {
  fields: _propTypes["default"].object.isRequired,
  options: _propTypes["default"].object.isRequired,
  object: _propTypes["default"].object.isRequired,
  setData: _propTypes["default"].func.isRequired,
  errors: _propTypes["default"].object
};
CustomFields.defaultProps = {
  errors: {}
};
var _default = exports["default"] = CustomFields;

/***/ }),

/***/ "./modules/biobank/jsx/filter.js":
/*!***************************************!*\
  !*** ./modules/biobank/jsx/filter.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _Tabs = __webpack_require__(/*! Tabs */ "./jsx/Tabs.js");
var _specimenTab = _interopRequireDefault(__webpack_require__(/*! ./specimenTab */ "./modules/biobank/jsx/specimenTab.js"));
var _containerTab = _interopRequireDefault(__webpack_require__(/*! ./containerTab */ "./modules/biobank/jsx/containerTab.js"));
var _poolTab = _interopRequireDefault(__webpack_require__(/*! ./poolTab */ "./modules/biobank/jsx/poolTab.js"));
var _shipmentTab = _interopRequireDefault(__webpack_require__(/*! ./shipmentTab */ "./modules/biobank/jsx/shipmentTab.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * Render a filter in the biobank.
 */
var BiobankFilter = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(BiobankFilter, _Component);
  var _super = _createSuper(BiobankFilter);
  function BiobankFilter() {
    (0, _classCallCheck2["default"])(this, BiobankFilter);
    return _super.apply(this, arguments);
  }
  (0, _createClass2["default"])(BiobankFilter, [{
    key: "render",
    value:
    /**
     * Render the component
     *
     * @return {JSX}
     */
    function render() {
      var specimenTab = /*#__PURE__*/_react["default"].createElement(_specimenTab["default"], {
        data: this.props.data,
        options: this.props.options,
        saveBatchEdit: this.props.saveBatchEdit,
        createPool: this.props.createPool,
        createSpecimens: this.props.createSpecimens,
        updateSpecimens: this.props.updateSpecimens,
        editSpecimens: this.props.editSpecimens,
        history: this.props.history,
        increaseCoordinate: this.props.increaseCoordinate,
        loading: this.props.loading
      });
      var containerTab = /*#__PURE__*/_react["default"].createElement(_containerTab["default"], {
        data: this.props.data,
        options: this.props.options,
        createContainers: this.props.createContainers,
        history: this.props.history,
        loading: this.props.loading
      });
      var poolTab = /*#__PURE__*/_react["default"].createElement(_poolTab["default"], {
        data: this.props.data,
        options: this.props.options,
        createSpecimens: this.props.createSpecimens,
        increaseCoordinate: this.props.increaseCoordinate,
        loading: this.props.loading
      });
      var shipmentTab = /*#__PURE__*/_react["default"].createElement(_shipmentTab["default"], {
        data: this.props.data,
        setData: this.props.setData,
        options: this.props.options
      });
      var tabInfo = [];
      var tabList = [];
      if (loris.userHasPermission('biobank_specimen_view')) {
        tabInfo.push({
          id: 'specimens',
          content: specimenTab
        });
        tabList.push({
          id: 'specimens',
          label: 'Specimens'
        });
      }
      if (loris.userHasPermission('biobank_container_view')) {
        tabInfo.push({
          id: 'containers',
          content: containerTab
        });
        tabList.push({
          id: 'containers',
          label: 'Containers'
        });
      }
      if (loris.userHasPermission('biobank_pool_view')) {
        tabInfo.push({
          id: 'pools',
          content: poolTab
        });
        tabList.push({
          id: 'pools',
          label: 'Pools'
        });
      }
      tabInfo.push({
        id: 'shipments',
        content: shipmentTab
      });
      tabList.push({
        id: 'shipments',
        label: 'Shipments'
      });
      var tabContent = Object.keys(tabInfo).map(function (key) {
        return /*#__PURE__*/_react["default"].createElement(_Tabs.TabPane, {
          key: key,
          TabId: tabInfo[key].id
        }, tabInfo[key].content);
      });
      return /*#__PURE__*/_react["default"].createElement("div", {
        id: "biobank-page"
      }, /*#__PURE__*/_react["default"].createElement(_Tabs.Tabs, {
        tabs: tabList,
        defaultTab: tabList[0].id,
        updateURL: true
      }, tabContent));
    }
  }]);
  return BiobankFilter;
}(_react.Component);
BiobankFilter.propTypes = {
  data: _propTypes["default"].object,
  options: _propTypes["default"].object,
  saveBatchEdit: _propTypes["default"].func,
  createPool: _propTypes["default"].func,
  createSpecimens: _propTypes["default"].func,
  updateSpecimens: _propTypes["default"].func,
  editSpecimens: _propTypes["default"].func,
  history: _propTypes["default"].object,
  increaseCoordinate: _propTypes["default"].func,
  loading: _propTypes["default"].bool,
  createContainers: _propTypes["default"].func,
  setData: _propTypes["default"].func
};
var _default = exports["default"] = BiobankFilter;

/***/ }),

/***/ "./modules/biobank/jsx/globals.js":
/*!****************************************!*\
  !*** ./modules/biobank/jsx/globals.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
var _helpers = __webpack_require__(/*! ./helpers.js */ "./modules/biobank/jsx/helpers.js");
var _Modal = _interopRequireDefault(__webpack_require__(/*! Modal */ "./jsx/Modal.tsx"));
var _Loader = _interopRequireDefault(__webpack_require__(/*! Loader */ "./jsx/Loader.tsx"));
var _Form = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");
var _containerParentForm = _interopRequireDefault(__webpack_require__(/*! ./containerParentForm */ "./modules/biobank/jsx/containerParentForm.js"));
/**
 * Biobank Globals Component
 *
 * @param {object} props - The component's props
 */
function Globals(props) {
  var _options$sessionCente;
  var current = props.current,
    data = props.data,
    editable = props.editable,
    options = props.options,
    specimen = props.specimen,
    container = props.container;
  var updateContainer = function updateContainer() {
    return props.updateContainer(current.container);
  };
  var editContainer = function editContainer() {
    return props.editContainer(container);
  };
  var specimenTypeField = specimen && /*#__PURE__*/_react["default"].createElement(InlineField, {
    label: "Specimen Type",
    value: options.specimen.types[specimen.typeId].label
  });
  var edit = loris.userHasPermission('biobank_specimen_edit') && specimen && function () {
    props.edit('containerType');
    editContainer();
  };
  var containerTypes = (0, _helpers.mapFormOptions)(options.container.typesPrimary, 'label');
  var containerTypeField = /*#__PURE__*/_react["default"].createElement(InlineField, {
    loading: props.loading,
    label: 'Container Type',
    updateValue: updateContainer,
    clearAll: props.clearAll,
    pencil: true,
    value: options.container.types[container.typeId].label,
    edit: edit,
    editable: editable.containerType
  }, /*#__PURE__*/_react["default"].createElement(_Form.SelectElement, {
    name: "typeId",
    onUserInput: props.setContainer,
    options: containerTypes,
    value: current.container.typeId,
    errorMessage: props.errors.container.typeId
  }));
  var poolField = (specimen || {}).poolId ? /*#__PURE__*/_react["default"].createElement(InlineField, {
    label: "Pool",
    value: data.pools[specimen.poolId].label
  }) : null;
  var units = specimen ? (0, _helpers.mapFormOptions)(options.specimen.typeUnits[specimen.typeId], 'label') : null;
  var quantityField = specimen ? /*#__PURE__*/_react["default"].createElement(InlineField, {
    loading: props.loading,
    label: "Quantity",
    clearAll: props.clearAll,
    updateValue: function updateValue() {
      return props.updateSpecimen(current.specimen);
    },
    edit: function edit() {
      return props.edit('quantity');
    },
    editValue: function editValue() {
      return props.editSpecimen(specimen);
    },
    value: Math.round(specimen.quantity * 100) / 100 + ' ' + options.specimen.units[specimen.unitId].label,
    editable: editable.quantity
  }, /*#__PURE__*/_react["default"].createElement(_Form.TextboxElement, {
    name: "quantity",
    onUserInput: props.setSpecimen,
    value: props.current.specimen.quantity,
    errorMessage: props.errors.specimen.quantity
  }), /*#__PURE__*/_react["default"].createElement(_Form.SelectElement, {
    name: "unitId",
    options: units,
    onUserInput: props.setSpecimen,
    value: props.current.specimen.unitId,
    errorMessage: props.errors.specimen.unitId
  })) : null;
  var fTCycleField = function fTCycleField() {
    if (specimen && options.specimen.types[specimen.typeId].freezeThaw == 1) {
      // const changeCycle = (value) => {
      //   props.editSpecimen(specimen)
      //   .then(() => {
      //     let cycle = specimen.fTCycle;
      //     cycle = cycle+value;
      //     props.setSpecimen('fTCycle', cycle);
      //   })
      //   .then(()=>props.updateSpecimen(props.current.specimen));
      // };
      // const increaseCycle = () => changeCycle(1);
      // const decreaseCycle = () => changeCycle(-1);
      // const updateFTCycle = loris.userHasPermission('biobank_specimen_edit') ? (
      //   <div>
      //     {specimen.fTCycle > 0 ? (
      //       <div className='action' title='Remove Cycle'>
      //         <span
      //           className='action-button update'
      //           onClick={decreaseCycle}
      //         >
      //           <span className='glyphicon glyphicon-minus'/>
      //         </span>
      //       </div>
      //     ) : null}
      //     <div className='action' title='Add Cycle'>
      //       <span className='action-button update' onClick={increaseCycle}>
      //         <span className='glyphicon glyphicon-plus'/>
      //       </span>
      //     </div>
      //   </div>
      // ) : null;

      var editFTCycle = function editFTCycle() {
        return props.edit('fTCycle');
      };
      return /*#__PURE__*/_react["default"].createElement(InlineField, {
        loading: props.loading,
        label: 'Freeze-Thaw Cycle',
        clearAll: props.clearAll,
        updateValue: function updateValue() {
          return props.updateSpecimen(props.current.specimen);
        },
        edit: editFTCycle,
        editValue: function editValue() {
          return props.editSpecimen(specimen);
        },
        value: specimen.fTCycle || 0,
        editable: editable.fTCycle
      }, /*#__PURE__*/_react["default"].createElement(_Form.NumericElement, {
        name: "fTCycle",
        onUserInput: props.setSpecimen,
        value: props.current.specimen.fTCycle,
        errorMessage: props.errors.specimen.fTCycle
      }));
    }
  };
  var editTemperature = function editTemperature() {
    return props.edit('temperature');
  };
  var temperatureField = /*#__PURE__*/_react["default"].createElement(InlineField, {
    loading: props.loading,
    label: 'Temperature',
    clearAll: props.clearAll,
    updateValue: updateContainer,
    edit: !container.parentContainerId && editTemperature,
    editValue: editContainer,
    value: container.temperature + '°',
    editable: editable.temperature
  }, /*#__PURE__*/_react["default"].createElement(_Form.TextboxElement, {
    name: "temperature",
    onUserInput: props.setContainer,
    value: props.current.container.temperature,
    errorMessage: props.errors.container.temperature
  }));
  var stati = (0, _helpers.mapFormOptions)(options.container.stati, 'label');
  var renderCommentsField = function renderCommentsField() {
    if (stati[props.current.container.statusId] !== 'Discarded' && stati[props.current.container.statusId] !== 'Reserved' && stati[props.current.container.statusId] !== 'Dispensed' && stati[props.current.container.statusId] !== 'Shipped') {
      return [];
    }
    return /*#__PURE__*/_react["default"].createElement(_Form.TextareaElement, {
      name: "comments",
      onUserInput: props.setContainer,
      value: props.current.container.comments,
      required: true
    });
  };
  var statusField = /*#__PURE__*/_react["default"].createElement(InlineField, {
    loading: props.loading,
    label: 'Status',
    clearAll: props.clearAll,
    updateValue: updateContainer,
    edit: function edit() {
      return props.edit('status');
    },
    editValue: editContainer,
    value: options.container.stati[container.statusId].label,
    subValue: container.comments,
    editable: editable.status
  }, /*#__PURE__*/_react["default"].createElement(_Form.SelectElement, {
    name: "statusId",
    options: stati,
    onUserInput: props.setContainer,
    value: props.current.container.statusId,
    errorMessage: props.errors.container.statusId
  }), renderCommentsField());
  var projectField = function projectField() {
    return specimen && /*#__PURE__*/_react["default"].createElement(InlineField, {
      loading: props.loading,
      label: "Projects",
      clearAll: props.clearAll,
      updateValue: function updateValue() {
        return props.updateSpecimen(current.specimen);
      },
      edit: function edit() {
        return props.edit('project');
      },
      editValue: function editValue() {
        return props.editSpecimen(specimen);
      },
      value: specimen.projectIds.length !== 0 ? specimen.projectIds.map(function (id) {
        return options.projects[id];
      }).join(', ') : 'None',
      editable: editable.project
    }, /*#__PURE__*/_react["default"].createElement(_Form.SelectElement, {
      name: "projectIds",
      options: props.options.projects,
      onUserInput: props.setSpecimen,
      multiple: true,
      emptyOption: false,
      value: props.current.specimen.projectIds,
      errorMessage: props.errors.specimen.projectIds
    }));
  };
  var drawField = specimen && /*#__PURE__*/_react["default"].createElement(InlineField, {
    label: "Draw Site",
    value: options.centers[(_options$sessionCente = options.sessionCenters[specimen.sessionId]) === null || _options$sessionCente === void 0 ? void 0 : _options$sessionCente.centerId]
  });
  var centerField = /*#__PURE__*/_react["default"].createElement(InlineField, {
    label: "Current Site",
    value: options.centers[container.centerId]
  });
  var shipmentField = function shipmentField() {
    if (container.shipmentBarcodes.length !== 0) {
      return /*#__PURE__*/_react["default"].createElement(InlineField, {
        label: "Shipment",
        value: container.shipmentBarcodes.slice(-1)[0]
      });
    }
  };
  var parentSpecimenField = function parentSpecimenField() {
    if (!specimen) {
      return null;
    }
    var parentSpecimenIds = specimen.parentSpecimenIds,
      parentSpecimenBarcodes = specimen.parentSpecimenBarcodes;
    var value = parentSpecimenIds.length === 0 ? 'None' : parentSpecimenBarcodes.map(function (barcode) {
      return /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Link, {
        to: "/barcode=".concat(barcode)
      }, barcode);
    }).reduce(function (prev, curr, index) {
      return [prev, index == 0 ? '' : ', ', curr];
    });
    return /*#__PURE__*/_react["default"].createElement(InlineField, {
      label: "Parent Specimen",
      value: value
    });
  };
  var parentContainerField = function parentContainerField() {
    if (loris.userHasPermission('biobank_container_view')) {
      // Set Parent Container Barcode Value if it exists
      var parentContainerBarcodeValue = function parentContainerBarcodeValue() {
        if (container.parentContainerId) {
          var barcode = container.parentContainerBarcode;
          if (data.containers[container.parentContainerId]) {
            return /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Link, {
              to: "/barcode=".concat(barcode)
            }, barcode);
          }
          return /*#__PURE__*/_react["default"].createElement("div", null, barcode);
        }
      };
      var updateParentContainer = function updateParentContainer() {
        if (loris.userHasPermission('biobank_container_edit')) {
          return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
            className: "action",
            title: "Move Container"
          }, /*#__PURE__*/_react["default"].createElement("span", {
            className: "action-button update",
            onClick: function onClick() {
              props.edit('containerParentForm');
              editContainer();
            }
          }, /*#__PURE__*/_react["default"].createElement("span", {
            className: "glyphicon glyphicon-chevron-right"
          }))), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_Modal["default"], {
            title: "Update Parent Container",
            onClose: props.clearAll,
            show: editable.containerParentForm,
            onSubmit: props.uC
          }, /*#__PURE__*/_react["default"].createElement(_containerParentForm["default"], {
            display: true,
            current: current,
            container: container,
            options: options,
            data: data,
            setContainer: props.setContainer,
            setCurrent: props.setCurrent
          }))));
        }
      };
      var coordinate;
      if (container.coordinate) {
        coordinate = props.getCoordinateLabel(container);
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "item"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "field"
      }, "Parent Container", /*#__PURE__*/_react["default"].createElement("div", {
        className: "value"
      }, parentContainerBarcodeValue() || 'None'), parentContainerBarcodeValue && container.coordinate ? 'Coordinate ' + coordinate : null), updateParentContainer());
    }
  };
  var candidateSessionField = specimen ? /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(InlineField, {
    label: "PSCID",
    value: options.candidates[specimen.candidateId].pscid,
    link: loris.BaseURL + '/' + specimen.candidateId
  }), /*#__PURE__*/_react["default"].createElement(InlineField, {
    label: "Visit Label",
    value: options.sessions[specimen.sessionId].label,
    link: loris.BaseURL + '/instrument_list/?candID=' + specimen.candidateId + '&sessionID=' + specimen.sessionId
  })) : null;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "globals"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "list"
  }, specimenTypeField, containerTypeField, poolField, quantityField, fTCycleField(), temperatureField, statusField, projectField(), drawField, centerField, shipmentField(), parentSpecimenField(), parentContainerField(), candidateSessionField));
}

// Globals.propTypes
Globals.propTypes = {
  current: _propTypes["default"].shape({
    container: _propTypes["default"].shape({
      parentContainerId: _propTypes["default"].number,
      typeId: _propTypes["default"].number.isRequired,
      coordinate: _propTypes["default"].string,
      statusId: _propTypes["default"].number,
      temperature: _propTypes["default"].number,
      lotNumber: _propTypes["default"].string,
      expirationDate: _propTypes["default"].string,
      comments: _propTypes["default"].string
    }).isRequired,
    specimen: _propTypes["default"].shape({
      poolId: _propTypes["default"].number,
      typeId: _propTypes["default"].number.isRequired,
      fTCycle: _propTypes["default"].string,
      projectIds: _propTypes["default"].arrayOf(_propTypes["default"].number),
      sessionId: _propTypes["default"].number,
      candidateId: _propTypes["default"].number,
      quantity: _propTypes["default"].number,
      unitId: _propTypes["default"].number,
      parentSpecimenIds: _propTypes["default"].arrayOf(_propTypes["default"].number),
      parentSpecimenBarcodes: _propTypes["default"].arrayOf(_propTypes["default"].string)
    }).isRequired
  }).isRequired,
  data: _propTypes["default"].shape({
    pools: _propTypes["default"].array.isRequired,
    containers: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      parentContainerId: _propTypes["default"].number,
      coordinate: _propTypes["default"].string,
      typeId: _propTypes["default"].number.isRequired,
      shipmentBarcodes: _propTypes["default"].arrayOf(_propTypes["default"].string),
      centerId: _propTypes["default"].number,
      parentContainerBarcode: _propTypes["default"].string,
      statusId: _propTypes["default"].number,
      // Added
      temperature: _propTypes["default"].number,
      // Added
      comments: _propTypes["default"].string // Added
    })).isRequired
  }).isRequired,
  editable: _propTypes["default"].shape({
    containerType: _propTypes["default"].func.isRequired,
    fTCycle: _propTypes["default"].func.isRequired,
    project: _propTypes["default"].func.isRequired,
    quantity: _propTypes["default"].func.isRequired,
    containerParentForm: _propTypes["default"].func.isRequired,
    temperature: _propTypes["default"].func.isRequired,
    // Added
    status: _propTypes["default"].func.isRequired // Added
  }).isRequired,
  options: _propTypes["default"].shape({
    specimen: _propTypes["default"].shape({
      typeUnits: _propTypes["default"].string,
      units: _propTypes["default"].string,
      // Added
      types: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })),
      attributes: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })),
      protocols: _propTypes["default"].arrayOf(_propTypes["default"].string),
      protocolAttributes: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      }))
    }).isRequired,
    container: _propTypes["default"].shape({
      typesPrimary: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
      types: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })).isRequired,
      typesNonPrimary: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
      stati: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })).isRequired,
      candidates: _propTypes["default"].arrayOf(_propTypes["default"].string),
      sessions: _propTypes["default"].arrayOf(_propTypes["default"].string)
    }).isRequired,
    projects: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
    centers: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
    sessionCenters: _propTypes["default"].arrayOf(_propTypes["default"].string),
    candidates: _propTypes["default"].arrayOf(_propTypes["default"].string),
    sessions: _propTypes["default"].arrayOf(_propTypes["default"].string),
    candidateSessions: _propTypes["default"].arrayOf(_propTypes["default"].string),
    // Added
    attributes: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      label: _propTypes["default"].string.isRequired
    })) // Assuming based on errors
  }).isRequired,
  specimen: _propTypes["default"].shape({
    typeId: _propTypes["default"].number.isRequired,
    poolId: _propTypes["default"].number,
    fTCycle: _propTypes["default"].string,
    projectIds: _propTypes["default"].arrayOf(_propTypes["default"].number),
    sessionId: _propTypes["default"].number,
    candidateId: _propTypes["default"].number,
    quantity: _propTypes["default"].number,
    unitId: _propTypes["default"].number,
    parentSpecimenIds: _propTypes["default"].arrayOf(_propTypes["default"].number),
    parentSpecimenBarcodes: _propTypes["default"].arrayOf(_propTypes["default"].string)
  }).isRequired,
  container: _propTypes["default"].shape({
    centerId: _propTypes["default"].number,
    shipmentBarcodes: _propTypes["default"].arrayOf(_propTypes["default"].string),
    parentContainerId: _propTypes["default"].number,
    coordinate: _propTypes["default"].string,
    typeId: _propTypes["default"].number.isRequired,
    parentContainerBarcode: _propTypes["default"].string,
    statusId: _propTypes["default"].number,
    // Added
    temperature: _propTypes["default"].number,
    // Added
    comments: _propTypes["default"].string // Added
  }).isRequired,
  updateContainer: _propTypes["default"].func.isRequired,
  editContainer: _propTypes["default"].func.isRequired,
  setContainer: _propTypes["default"].func.isRequired,
  setCurrent: _propTypes["default"].func.isRequired,
  edit: _propTypes["default"].func.isRequired,
  editSpecimen: _propTypes["default"].func.isRequired,
  updateSpecimen: _propTypes["default"].func.isRequired,
  getCoordinateLabel: _propTypes["default"].func.isRequired,
  loading: _propTypes["default"].bool.isRequired,
  clearAll: _propTypes["default"].func.isRequired,
  setCheckoutList: _propTypes["default"].func.isRequired,
  setListItem: _propTypes["default"].func.isRequired,
  createSpecimens: _propTypes["default"].func.isRequired,
  increaseCoordinate: _propTypes["default"].func.isRequired,
  getParentContainerBarcodes: _propTypes["default"].func.isRequired,
  getBarcodePathDisplay: _propTypes["default"].func.isRequired,
  setSpecimen: _propTypes["default"].func.isRequired,
  uC: _propTypes["default"].any.isRequired,
  // Added based on error

  errors: _propTypes["default"].shape({
    container: _propTypes["default"].shape({
      typeId: _propTypes["default"].string,
      temperature: _propTypes["default"].string,
      // Added
      statusId: _propTypes["default"].string,
      // Added
      comments: _propTypes["default"].string // Added
    }),

    specimen: _propTypes["default"].shape({
      quantity: _propTypes["default"].string,
      unitId: _propTypes["default"].string,
      fTCycle: _propTypes["default"].string,
      projectIds: _propTypes["default"].string,
      candidateId: _propTypes["default"].string,
      sessionId: _propTypes["default"].string
    })
  }).isRequired
};

/**
 * Item of the Inline Field
 *
 * @param  {object} props
 * @return {JSX}
 */
function Item(props) {
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "item"
  }, props.children);
}
Item.propTypes = {
  children: _propTypes["default"].node.isRequired
};

/**
 * Inline Field
 *
 * @param  {object} props
 * @return {JSX}
 */
function InlineField(props) {
  var fields = _react["default"].Children.map(props.children, function (child) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        flex: '1 0 25%',
        minWidth: '90px'
      }
    }, /*#__PURE__*/_react["default"].cloneElement(child, {
      inputClass: 'col-lg-11'
    }));
  });

  // loris.userHasPermission('biobank_container_update') should determine if 'edit'
  // can be passed in the first place.
  var editButton = props.edit instanceof Function && !props.editable && /*#__PURE__*/_react["default"].createElement("div", {
    className: "action",
    title: 'Update ' + props.label
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: props.pencil ? 'glyphicon glyphicon-pencil' : 'action-button update',
    onClick: function onClick() {
      props.edit();
      props.editValue();
    }
  }, !props.pencil && /*#__PURE__*/_react["default"].createElement("span", {
    className: "glyphicon glyphicon-chevron-right"
  })));
  var loader = props.loading && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      flex: '0 1 15%',
      margin: '0 1%'
    }
  }, /*#__PURE__*/_react["default"].createElement(_Loader["default"], {
    size: 20
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      flex: '0 1 15%',
      margin: '0 1%'
    }
  }, /*#__PURE__*/_react["default"].createElement("h5", {
    className: "animate-flicker"
  }, "Saving...")));
  var submitButton = !props.loading && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      flex: '0 1 15%',
      margin: '0 1%'
    }
  }, /*#__PURE__*/_react["default"].createElement(_Form.CTA, {
    label: "Update",
    onUserInput: props.updateValue
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      flex: '0 1 15%',
      margin: '0 1%'
    }
  }, /*#__PURE__*/_react["default"].createElement("a", {
    onClick: props.clearAll,
    style: {
      cursor: 'pointer'
    }
  }, "Cancel")));
  var value = props.link ? /*#__PURE__*/_react["default"].createElement("a", {
    href: props.link
  }, props.value) : props.value;
  var renderField = props.editable ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "field"
  }, props.label, /*#__PURE__*/_react["default"].createElement("div", {
    className: "inline-field"
  }, fields, submitButton, loader)) : /*#__PURE__*/_react["default"].createElement("div", {
    className: "field"
  }, props.label, props.pencil && editButton, /*#__PURE__*/_react["default"].createElement("div", {
    className: "value"
  }, value), props.subValue);
  return /*#__PURE__*/_react["default"].createElement(Item, null, renderField, !props.pencil && editButton);
}

// InlineField.propTypes
InlineField.propTypes = {
  clearAll: _propTypes["default"].func,
  updateValue: _propTypes["default"].func,
  subValue: _propTypes["default"].string,
  children: _propTypes["default"].node.isRequired,
  edit: _propTypes["default"].func.isRequired,
  editable: _propTypes["default"].bool.isRequired,
  label: _propTypes["default"].string.isRequired,
  pencil: _propTypes["default"].node.isRequired,
  editValue: _propTypes["default"].func.isRequired,
  loading: _propTypes["default"].bool.isRequired,
  link: _propTypes["default"].string.isRequired,
  value: _propTypes["default"].string.isRequired
};
var _default = exports["default"] = Globals;

/***/ }),

/***/ "./modules/biobank/jsx/header.js":
/*!***************************************!*\
  !*** ./modules/biobank/jsx/header.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _Form = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");
var _Modal = _interopRequireDefault(__webpack_require__(/*! Modal */ "./jsx/Modal.tsx"));
var _lifeCycle = _interopRequireDefault(__webpack_require__(/*! ./lifeCycle.js */ "./modules/biobank/jsx/lifeCycle.js"));
var _specimenForm = _interopRequireDefault(__webpack_require__(/*! ./specimenForm.js */ "./modules/biobank/jsx/specimenForm.js"));
var _sweetalert = _interopRequireDefault(__webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * React component to display a header.
 */
var Header = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Header, _Component);
  var _super = _createSuper(Header);
  function Header() {
    (0, _classCallCheck2["default"])(this, Header);
    return _super.apply(this, arguments);
  }
  (0, _createClass2["default"])(Header, [{
    key: "render",
    value:
    /**
     * Render react component
     *
     * @return {JSX}
     */
    function render() {
      var _this = this;
      var _this$props = this.props,
        options = _this$props.options,
        container = _this$props.container,
        specimen = _this$props.specimen,
        editable = _this$props.editable,
        current = _this$props.current;
      var updateContainer = function updateContainer() {
        return Promise.resolve(_this.props.updateContainer(current.container));
      };
      var status = options.container.stati[container.statusId].label;
      var renderActionButton = function renderActionButton() {
        if (status == 'Available' && specimen.quantity > 0 && !specimen.poolId) {
          var openAliquotForm = function openAliquotForm() {
            return _this.props.edit('aliquotForm');
          };
          return /*#__PURE__*/_react["default"].createElement("div", {
            className: "action-button add",
            onClick: openAliquotForm
          }, "+");
        } else {
          return /*#__PURE__*/_react["default"].createElement("div", {
            className: "action-button disabled"
          }, "+");
        }
      };
      var addAliquotForm = function addAliquotForm() {
        if (specimen && loris.userHasPermission('biobank_specimen_create')) {
          return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
            className: "action",
            title: "Make Aliquots"
          }, renderActionButton()), /*#__PURE__*/_react["default"].createElement(_specimenForm["default"], {
            title: "Add Aliquots",
            parent: [{
              specimen: specimen,
              container: container
            }],
            options: _this.props.options,
            data: _this.props.data,
            current: _this.props.current,
            increaseCoordinate: _this.props.increaseCoordinate,
            show: editable.aliquotForm,
            onClose: _this.props.clearAll,
            setSpecimen: _this.props.setSpecimen,
            onSubmit: _this.props.createSpecimens
          }));
        }
      };
      var alterLotNumber = function alterLotNumber() {
        if (loris.userHasPermission('biobank_specimen_edit')) {
          return /*#__PURE__*/_react["default"].createElement("div", {
            className: "action",
            title: "Alter Lot Number"
          }, /*#__PURE__*/_react["default"].createElement("span", {
            style: {
              color: 'grey'
            },
            className: "glyphicon glyphicon-pencil",
            onClick: function onClick() {
              _this.props.edit('lotForm');
              _this.props.editContainer(_this.props.container);
            }
          }));
        }
      };
      var alterExpirationDate = function alterExpirationDate() {
        if (loris.userHasPermission('biobank_specimen_edit')) {
          return /*#__PURE__*/_react["default"].createElement("div", {
            className: "action",
            title: "Alter Expiration Date"
          }, /*#__PURE__*/_react["default"].createElement("span", {
            style: {
              color: 'grey'
            },
            className: "glyphicon glyphicon-pencil",
            onClick: function onClick() {
              _this.props.edit('expirationForm');
              _this.props.editContainer(_this.props.container);
            }
          }));
        }
      };
      var lotForm = /*#__PURE__*/_react["default"].createElement(_Modal["default"], {
        title: "Edit Lot Number",
        onClose: this.props.clearAll,
        show: editable.lotForm,
        onSubmit: updateContainer
      }, /*#__PURE__*/_react["default"].createElement(_Form.FormElement, null, /*#__PURE__*/_react["default"].createElement(_Form.TextboxElement, {
        name: "lotNumber",
        label: "Lot Number",
        onUserInput: this.props.setContainer,
        value: current.container.lotNumber
      })));
      var expirationForm = /*#__PURE__*/_react["default"].createElement(_Modal["default"], {
        title: "Edit Expiration Date",
        onClose: this.props.clearAll,
        show: editable.expirationForm,
        onSubmit: updateContainer
      }, /*#__PURE__*/_react["default"].createElement(_Form.FormElement, null, /*#__PURE__*/_react["default"].createElement(_Form.DateElement, {
        name: "expirationDate",
        label: "Expiration Date",
        onUserInput: this.props.setContainer,
        value: current.container.expirationDate
      })));
      var parentBarcodes = this.props.getParentContainerBarcodes(container);
      var barcodePathDisplay = this.props.getBarcodePathDisplay(parentBarcodes);
      var printBarcode = function printBarcode() {
        var labelParams = [{
          barcode: specimen.barcode,
          type: options.specimen.types[specimen.typeId].label,
          pscid: specimen.candidatePSCID,
          sampleNumber: specimen.sampleNumber
        }];
        _this.props.printLabel(labelParams).then(function () {
          return _sweetalert["default"].fire('Print Barcode Number: ' + container.barcode);
        });
      };
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "specimen-header"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "specimen-title"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "barcode"
      }, "Barcode", /*#__PURE__*/_react["default"].createElement("div", {
        className: "value"
      }, /*#__PURE__*/_react["default"].createElement("strong", null, container.barcode)), /*#__PURE__*/_react["default"].createElement("span", {
        className: "barcodePath"
      }, "Address: ", barcodePathDisplay, " ", /*#__PURE__*/_react["default"].createElement("br", null), "Lot Number: ", container.lotNumber, " ", alterLotNumber(), /*#__PURE__*/_react["default"].createElement("br", null), "Expiration Date: ", container.expirationDate, alterExpirationDate()), lotForm, expirationForm), /*#__PURE__*/_react["default"].createElement("div", {
        className: "action",
        title: "Print Barcode"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "action-button update",
        onClick: printBarcode
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "glyphicon glyphicon-print"
      }))), addAliquotForm(), /*#__PURE__*/_react["default"].createElement(ContainerCheckout, {
        container: container,
        current: current,
        editContainer: this.props.editContainer,
        setContainer: this.props.setContainer,
        updateContainer: updateContainer
      })), /*#__PURE__*/_react["default"].createElement(_lifeCycle["default"], {
        specimen: specimen,
        centers: options.centers
      }));
    }
  }]);
  return Header;
}(_react.Component); // Header.propTypes
Header.propTypes = {
  options: _propTypes["default"].shape({
    container: _propTypes["default"].shape({
      stati: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })).isRequired,
      types: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })).isRequired,
      typesNonPrimary: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired
    }).isRequired,
    centers: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
    specimen: _propTypes["default"].shape({
      typeUnits: _propTypes["default"].string,
      types: _propTypes["default"].arrayOf(_propTypes["default"].string)
    }).isRequired
  }).isRequired,
  container: _propTypes["default"].shape({
    statusId: _propTypes["default"].number.isRequired,
    barcode: _propTypes["default"].string.isRequired,
    lotNumber: _propTypes["default"].string,
    expirationDate: _propTypes["default"].string,
    parentContainerId: _propTypes["default"].number,
    coordinate: _propTypes["default"].string
  }).isRequired,
  specimen: _propTypes["default"].shape({
    barcode: _propTypes["default"].string,
    candidatePSCID: _propTypes["default"].string,
    sampleNumber: _propTypes["default"].string,
    quantity: _propTypes["default"].number,
    poolId: _propTypes["default"].number,
    typeId: _propTypes["default"].number.isRequired
  }).isRequired,
  editable: _propTypes["default"].shape({
    aliquotForm: _propTypes["default"].func.isRequired,
    lotForm: _propTypes["default"].func.isRequired,
    expirationForm: _propTypes["default"].func.isRequired
  }).isRequired,
  current: _propTypes["default"].shape({
    container: _propTypes["default"].shape({
      parentContainerId: _propTypes["default"].number,
      coordinate: _propTypes["default"].string,
      lotNumber: _propTypes["default"].string,
      expirationDate: _propTypes["default"].string
    }).isRequired,
    specimen: _propTypes["default"].shape({
      typeId: _propTypes["default"].number.isRequired
    }).isRequired
  }).isRequired,
  data: _propTypes["default"].obj,
  setContainer: _propTypes["default"].func.isRequired,
  updateContainer: _propTypes["default"].func.isRequired,
  edit: _propTypes["default"].func.isRequired,
  increaseCoordinate: _propTypes["default"].func.isRequired,
  clearAll: _propTypes["default"].func.isRequired,
  setSpecimen: _propTypes["default"].func.isRequired,
  createSpecimens: _propTypes["default"].func.isRequired,
  editContainer: _propTypes["default"].func.isRequired,
  printLabel: _propTypes["default"].func.isRequired,
  getParentContainerBarcodes: _propTypes["default"].func.isRequired,
  getBarcodePathDisplay: _propTypes["default"].func.isRequired
};

/**
 * Biobank Container Checkout
 *
 * @param  {object} props
 * @return {JSX}
 */
function ContainerCheckout(props) {
  var checkoutContainer = function checkoutContainer() {
    props.editContainer(props.container).then(function () {
      return props.setContainer('parentContainerId', null);
    }).then(function () {
      return props.setContainer('coordinate', null);
    }).then(function () {
      return props.updateContainer();
    });
  };
  return loris.userHasPermission('biobank_container_edit') && props.container.parentContainerId ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "action"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "action-button update",
    title: "Checkout Container",
    onClick: checkoutContainer
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "glyphicon glyphicon-share"
  }))) : null;
}

// ContainerCheckout.propTypes
ContainerCheckout.propTypes = {
  editContainer: _propTypes["default"].func.isRequired,
  container: _propTypes["default"].shape({
    parentContainerId: _propTypes["default"].number
  }).isRequired,
  setContainer: _propTypes["default"].func.isRequired,
  updateContainer: _propTypes["default"].func.isRequired
};
var _default = exports["default"] = Header;

/***/ }),

/***/ "./modules/biobank/jsx/helpers.js":
/*!****************************************!*\
  !*** ./modules/biobank/jsx/helpers.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.clone = clone;
exports.get = get;
exports.getStream = getStream;
exports.isEmpty = isEmpty;
exports.mapFormOptions = mapFormOptions;
exports.padBarcode = padBarcode;
exports.post = post;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js"));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js"));
var _sweetalert = _interopRequireDefault(__webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js"));
/**
 * Clone an object
 *
 * @param {object} object - the object to clone
 * @return {object}
 */
function clone(object) {
  return JSON.parse(JSON.stringify(object));
}

/**
 * Maps an object values
 *
 * @param {object} object - the object to map
 * @param {any} attribute - the mapping
 * @return {object}
 */
function mapFormOptions(object, attribute) {
  return Object.keys(object).reduce(function (result, id) {
    result[id] = object[id][attribute];
    return result;
  }, {});
}

/**
 * Check if an object is either null or an empty object
 *
 * @param {object} object - the variable to check
 * @return {boolean}
 */
function isEmpty(object) {
  if (object == null) {
    return true;
  }
  for (var prop in object) {
    if (object.hasOwnProperty(prop)) {
      return false;
    }
  }
  return JSON.stringify(object) === JSON.stringify({});
}

/**
 * Pad a barcode
 *
 * @param {string} pscid - a pscid
 * @param {string} increment - the amount of padding
 * @return {string}
 */
function padBarcode(pscid, increment) {
  return pscid + padLeft(increment, 3);
}

/**
 * Left pad. Without a library.
 *
 * @param {number} nr - the existing string
 * @param {number} n  - the number to pad to
 * @param {string} str - the string for padding
 * @return {string}
 */
function padLeft(nr, n, str) {
  return Array(n - String(nr).length + 1).join(str || '0') + nr;
}

/**
 * Get data from a stream
 *
 * @param {string} url - the url
 * @param {function} setProgress - a callback for each chunk
 */
function getStream(_x, _x2) {
  return _getStream.apply(this, arguments);
}
/**
 * Post a GET request to a URL and call a callback on success
 *
 * @param {string} url - the url
 * @param {function} callBack - the success callback
 */
function _getStream() {
  _getStream = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(url, setProgress) {
    var response, reader, contentLength, receivedLength, chunks, count, done, _yield$reader$read, _done, value, result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetch(url, {
              credentials: 'same-origin',
              method: 'GET'
            })["catch"](function (error, errorCode, errorMsg) {
              return console.error(error, errorCode, errorMsg);
            });
          case 2:
            response = _context.sent;
            reader = response.body.getReader();
            contentLength = response.headers.get('Content-Length'); // Step 3: read the data
            receivedLength = 0; // received that many bytes at the moment
            chunks = ''; // array of received binary chunks (comprises the body)
            count = 0;
            done = false;
          case 9:
            if (done) {
              _context.next = 24;
              break;
            }
            _context.next = 12;
            return reader.read();
          case 12:
            _yield$reader$read = _context.sent;
            _done = _yield$reader$read.done;
            value = _yield$reader$read.value;
            if (!_done) {
              _context.next = 17;
              break;
            }
            return _context.abrupt("break", 24);
          case 17:
            result = new TextDecoder('utf-8').decode(value);
            chunks += result;
            receivedLength += value.length;
            count++;

            // Subtract 1 from the loading calculation to make sure the loading bar
            // only disappears when the data is completely loaded (not only specimens)
            if (setProgress instanceof Function && (count % 25 == 0 || receivedLength == contentLength)) {
              setProgress(Math.round(receivedLength / contentLength * 100) - 1);
            }
            _context.next = 9;
            break;
          case 24:
            return _context.abrupt("return", JSON.parse(chunks));
          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getStream.apply(this, arguments);
}
function get(_x3, _x4) {
  return _get.apply(this, arguments);
} // function parsePartialJson(str) {
//   let parsed = '';
//   try {
//       parsed = JSON.parse(str+'}}');
//   } catch (e) {
//     str = str.slice(0, -1);
//     parsed = parsePartialJson(str);
//   }
//
//   return parsed;
// }
/**
 * Post a request to a URL, and call a callback on success or
 * raise a swal on error.
 *
 * @param {object} data - the data to post
 * @param {string} url - the url
 * @param {string} method - the method to use
 * @param {function} onSuccess - the success callback
 * @return {Promise}
 */
function _get() {
  _get = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(url, callBack) {
    var response, values;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return fetch(url, {
              credientials: 'same-origin',
              method: 'GET'
            })["catch"](function (error, errorCode, errorMsg) {
              return console.error(error, errorCode, errorMsg);
            });
          case 2:
            response = _context2.sent;
            values = response.json();
            if (callBack) {
              callBack(values);
            }
            return _context2.abrupt("return", values);
          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _get.apply(this, arguments);
}
function post(_x5, _x6, _x7, _x8) {
  return _post.apply(this, arguments);
}
function _post() {
  _post = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(data, url, method, onSuccess) {
    var response, _data;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return fetch(url, {
              credentials: 'same-origin',
              method: method,
              body: JSON.stringify(clone(data))
            })["catch"](function (error) {
              return console.error(error);
            });
          case 2:
            response = _context3.sent;
            if (!response.ok) {
              _context3.next = 8;
              break;
            }
            onSuccess instanceof Function && onSuccess();
            // both then and catch resolve in case the returned data is not in
            // json format.
            return _context3.abrupt("return", response.json()["catch"](function (data) {
              return data;
            }));
          case 8:
            _context3.next = 10;
            return response.json();
          case 10:
            _data = _context3.sent;
            if (!(response.status == 403)) {
              _context3.next = 15;
              break;
            }
            _sweetalert["default"].fire('Action is forbidden or session has timed out.', '', 'error');
            _context3.next = 21;
            break;
          case 15:
            if (!(response.status === 422)) {
              _context3.next = 19;
              break;
            }
            return _context3.abrupt("return", Promise.reject(_data));
          case 19:
            _sweetalert["default"].fire(_data.error, '', 'error');
            return _context3.abrupt("return", Promise.reject(_data.error));
          case 21:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _post.apply(this, arguments);
}

/***/ }),

/***/ "./modules/biobank/jsx/lifeCycle.js":
/*!******************************************!*\
  !*** ./modules/biobank/jsx/lifeCycle.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * LifeCycle component.
 */
var LifeCycle = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(LifeCycle, _React$Component);
  var _super = _createSuper(LifeCycle);
  function LifeCycle() {
    (0, _classCallCheck2["default"])(this, LifeCycle);
    return _super.apply(this, arguments);
  }
  (0, _createClass2["default"])(LifeCycle, [{
    key: "render",
    value:
    /**
     * Render the React component
     *
     * @return {JSX}
     */
    function render() {
      // Create Collection Node
      var collectionNode;
      if ((this.props.specimen || {}).collection || this.props.container) {
        collectionNode = /*#__PURE__*/React.createElement("div", {
          className: "lifecycle-node collection"
        }, /*#__PURE__*/React.createElement("div", {
          className: "letter"
        }, "C"));
      }

      // Create Preparation Node
      var preparationNode;
      if ((this.props.specimen || {}).preparation) {
        preparationNode = /*#__PURE__*/React.createElement("div", {
          className: "lifecycle-node preparation"
        }, /*#__PURE__*/React.createElement("div", {
          className: "letter"
        }, "P"));
      }

      // Create Analysis Node
      var analysisNode;
      if ((this.props.specimen || {}).analysis) {
        analysisNode = /*#__PURE__*/React.createElement("div", {
          className: "lifecycle-node-container"
        }, /*#__PURE__*/React.createElement("div", {
          className: "lifecycle-node"
        }, /*#__PURE__*/React.createElement("div", {
          className: "letter"
        }, "A")));
      }

      // Create Lines
      var line;
      var nodes = 0;
      for (var i in this.props.specimen) {
        if (i === 'collection' || i === 'preparation' || i === 'analysis') {
          nodes++;
        }
      }
      var lineWidth = nodes > 1 ? 60 / (nodes - 1) : 0;
      var lineStyle = {
        width: lineWidth + '%'
      };
      line = /*#__PURE__*/React.createElement("div", {
        className: "lifecycle-line",
        style: lineStyle
      });
      return /*#__PURE__*/React.createElement("div", {
        className: "lifecycle"
      }, /*#__PURE__*/React.createElement("div", {
        className: "lifecycle-graphic"
      }, collectionNode, preparationNode ? line : null, preparationNode, analysisNode ? line : null, analysisNode));
    }
  }]);
  return LifeCycle;
}(React.Component);
LifeCycle.propTypes = {
  specimen: _propTypes["default"].shape({
    typeId: _propTypes["default"].number.isRequired,
    quantity: _propTypes["default"].number,
    poolId: _propTypes["default"].number,
    fTCycle: _propTypes["default"].string,
    projectIds: _propTypes["default"].arrayOf(_propTypes["default"].number),
    sessionId: _propTypes["default"].number,
    candidateId: _propTypes["default"].number,
    unitId: _propTypes["default"].number,
    parentSpecimenIds: _propTypes["default"].arrayOf(_propTypes["default"].number),
    parentSpecimenBarcodes: _propTypes["default"].arrayOf(_propTypes["default"].string)
  }).isRequired,
  container: _propTypes["default"].shape({
    statusId: _propTypes["default"].number.isRequired,
    barcode: _propTypes["default"].string.isRequired,
    lotNumber: _propTypes["default"].string,
    expirationDate: _propTypes["default"].string,
    parentContainerId: _propTypes["default"].number,
    coordinate: _propTypes["default"].string
  }).isRequired
};
var _default = exports["default"] = LifeCycle;

/***/ }),

/***/ "./modules/biobank/jsx/listForm.js":
/*!*****************************************!*\
  !*** ./modules/biobank/jsx/listForm.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ListItem = exports.ListForm = void 0;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _helpers = __webpack_require__(/*! ./helpers.js */ "./modules/biobank/jsx/helpers.js");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * A form containing a list
 */
var ListForm = exports.ListForm = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(ListForm, _React$Component);
  var _super = _createSuper(ListForm);
  /**
   * Constructor
   */
  function ListForm() {
    var _this;
    (0, _classCallCheck2["default"])(this, ListForm);
    _this = _super.call(this);
    _this.state = {
      count: 0,
      multiplier: 1,
      collapsed: {}
    };
    _this.setListItem = _this.setListItem.bind((0, _assertThisInitialized2["default"])(_this));
    _this.addListItem = _this.addListItem.bind((0, _assertThisInitialized2["default"])(_this));
    _this.copyListItem = _this.copyListItem.bind((0, _assertThisInitialized2["default"])(_this));
    _this.removeListItem = _this.removeListItem.bind((0, _assertThisInitialized2["default"])(_this));
    _this.toggleCollapse = _this.toggleCollapse.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  /**
   * React lifecycle method
   */
  (0, _createClass2["default"])(ListForm, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.addListItem();
    }

    /**
     * React lifecycle method
     */
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this2 = this;
      Object.keys(this.props.list).forEach(function (key) {
        if (!(0, _helpers.isEmpty)(_this2.props.errors[key]) && _this2.state.collapsed[key]) {
          _this2.toggleCollapse(key);
        }
      });
    }

    /**
     * Set the value of a list item
     *
     * @param {string} name - the item name
     * @param {string} value - the item value
     * @param {string} key - the key with the item
     */
  }, {
    key: "setListItem",
    value: function setListItem(name, value, key) {
      var list = (0, _helpers.clone)(this.props.list);
      list[key][name] = value;
      this.props.setList(list);
    }

    /**
     * Add an empty list item
     */
  }, {
    key: "addListItem",
    value: function addListItem() {
      var _clone = (0, _helpers.clone)(this.state),
        count = _clone.count,
        collapsed = _clone.collapsed;
      var list = (0, _helpers.clone)(this.props.list);
      count++;
      collapsed[count] = false;
      list[count] = this.props.listItem;
      this.setState({
        count: count,
        collapsed: collapsed
      });
      this.props.setList(list);
    }

    /**
     * Copy an item in a list
     *
     * @param {string} key - the key to copy
     */
  }, {
    key: "copyListItem",
    value: function copyListItem(key) {
      var _clone2 = (0, _helpers.clone)(this.state),
        collapsed = _clone2.collapsed,
        count = _clone2.count,
        multiplier = _clone2.multiplier;
      var list = (0, _helpers.clone)(this.props.list);
      for (var i = 1; i <= multiplier; i++) {
        count++;
        list[count] = (0, _helpers.clone)(list[key]);
        // TODO: find a way to exempt certain elements from being copied.
        (list[count].container || {}).barcode && delete list[count].container.barcode;
        list[count].barcode && delete list[count].barcode;
        collapsed[count] = true;
      }
      this.setState({
        collapsed: collapsed,
        count: count,
        multiplier: multiplier
      });
      this.props.setList(list);
    }

    /**
     * Remove a list item from the list
     *
     * @param {string} key - the key to remove
     */
  }, {
    key: "removeListItem",
    value: function removeListItem(key) {
      var list = (0, _helpers.clone)(this.props.list);
      delete list[key];
      this.props.setList(list);
    }

    /**
     * Toggle whether a key is collapsed
     *
     * @param {string} key - the key to toggle
     */
  }, {
    key: "toggleCollapse",
    value: function toggleCollapse(key) {
      var collapsed = (0, _helpers.clone)(this.state.collapsed);
      collapsed[key] = !collapsed[key];
      this.setState({
        collapsed: collapsed
      });
    }

    /**
     * Render the React component
     *
     * @return {JSX}
     */
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      var _this$state = this.state,
        collapsed = _this$state.collapsed,
        multiplier = _this$state.multiplier;
      var _this$props = this.props,
        errors = _this$props.errors,
        list = _this$props.list;
      return Object.entries(list).map(function (_ref, i, list) {
        var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
          key = _ref2[0],
          item = _ref2[1];
        var handleRemoveItem = list.length > 1 ? function () {
          return _this3.removeListItem(key);
        } : null;
        var handleCopyItem = function handleCopyItem() {
          return _this3.copyListItem(key);
        };
        var handleCollapse = function handleCollapse() {
          return _this3.toggleCollapse(key);
        };
        return React.Children.map(_this3.props.children, function (child) {
          var form = React.cloneElement(child, {
            key: key,
            itemKey: key,
            id: i + 1,
            collapsed: collapsed[key],
            handleCollapse: handleCollapse,
            item: item || {},
            removeItem: handleRemoveItem,
            setListItem: _this3.setListItem,
            errors: errors[key] || {}
          });
          var renderAddButtons = function renderAddButtons() {
            if (i + 1 == list.length) {
              return /*#__PURE__*/React.createElement("div", {
                className: "row"
              }, /*#__PURE__*/React.createElement("div", {
                className: "col-xs-12"
              }, /*#__PURE__*/React.createElement("div", {
                className: "col-xs-3"
              }), /*#__PURE__*/React.createElement("div", {
                className: "col-xs-4 action"
              }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
                className: "action"
              }, /*#__PURE__*/React.createElement("div", {
                className: "action-button add",
                onClick: _this3.addListItem
              }, "+")), /*#__PURE__*/React.createElement("span", {
                className: "action-title"
              }, "New Entry"))), /*#__PURE__*/React.createElement("div", {
                className: "col-xs-5 action"
              }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
                className: "action"
              }, /*#__PURE__*/React.createElement("div", {
                className: "action-button add",
                onClick: handleCopyItem
              }, /*#__PURE__*/React.createElement("span", {
                className: "glyphicon glyphicon-duplicate"
              }))), /*#__PURE__*/React.createElement("span", {
                className: "action-title"
              }, /*#__PURE__*/React.createElement("input", {
                className: "form-control input-sm",
                type: "number",
                min: "1",
                max: "50",
                style: {
                  width: 50,
                  display: 'inline'
                },
                onChange: function onChange(e) {
                  _this3.setState({
                    multiplier: e.target.value
                  });
                },
                value: multiplier
              }), "Copies")))));
            }
          };
          return /*#__PURE__*/React.createElement("div", null, form, renderAddButtons());
        });
      });
    }
  }]);
  return ListForm;
}(React.Component); // ListForm.propTypes
ListForm.propTypes = {
  list: _propTypes["default"].arrayOf(_propTypes["default"].shape({
    id: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]).isRequired
    // Add other list item-specific properties if necessary
  })).isRequired,
  errors: _propTypes["default"].object.isRequired,
  setList: _propTypes["default"].func.isRequired,
  listItem: _propTypes["default"].shape({
    // Define listItem-specific properties if necessary
  }).isRequired,
  children: _propTypes["default"].node.isRequired
};

/**
 * Display a list item
 */
var ListItem = exports.ListItem = /*#__PURE__*/function (_React$Component2) {
  (0, _inherits2["default"])(ListItem, _React$Component2);
  var _super2 = _createSuper(ListItem);
  function ListItem() {
    (0, _classCallCheck2["default"])(this, ListItem);
    return _super2.apply(this, arguments);
  }
  (0, _createClass2["default"])(ListItem, [{
    key: "render",
    value:
    /**
     * Render the component
     *
     * @return {JSX}
     */
    function render() {
      var children = React.Children.toArray(this.props.children);
      var firstChild = React.cloneElement(children[0], {
        label: children[0].props.label + ' ' + this.props.id
      });
      var remainingChildren = children.slice(1);
      var glyphStyle = {
        color: '#808080',
        marginLeft: 10,
        cursor: 'pointer',
        fontSize: 15
      };
      var removeItemButton = /*#__PURE__*/React.createElement("span", {
        className: "glyphicon glyphicon-remove",
        onClick: this.props.removeItem,
        style: glyphStyle
      });
      return /*#__PURE__*/React.createElement("div", {
        className: "row"
      }, /*#__PURE__*/React.createElement("div", {
        className: "col-xs-11"
      }, firstChild), /*#__PURE__*/React.createElement("div", {
        className: "col-xs-1",
        style: {
          paddingLeft: 0,
          marginTop: 10
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: this.props.collapsed ? 'glyphicon glyphicon-chevron-down' : 'glyphicon glyphicon-chevron-up',
        style: {
          cursor: 'pointer',
          fontSize: 15,
          position: 'relative',
          right: 40
        },
        onClick: this.props.handleCollapse
      }), this.props.removeItem ? removeItemButton : null), /*#__PURE__*/React.createElement("div", {
        className: "col-xs-9 col-xs-offset-2"
      }, /*#__PURE__*/React.createElement("div", {
        id: 'item-' + this.props.itemKey,
        className: this.props.collapsed ? 'closed' : 'open'
      }, remainingChildren)));
    }
  }]);
  return ListItem;
}(React.Component); // ListItem.propTypes
ListItem.propTypes = {
  children: _propTypes["default"].node.isRequired,
  id: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]).isRequired,
  removeItem: _propTypes["default"].func.isRequired,
  collapsed: _propTypes["default"].bool.isRequired,
  handleCollapse: _propTypes["default"].func.isRequired,
  itemKey: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]).isRequired
};

/***/ }),

/***/ "./modules/biobank/jsx/poolSpecimenForm.js":
/*!*************************************************!*\
  !*** ./modules/biobank/jsx/poolSpecimenForm.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _Modal = _interopRequireDefault(__webpack_require__(/*! Modal */ "./jsx/Modal.tsx"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _helpers = __webpack_require__(/*! ./helpers.js */ "./modules/biobank/jsx/helpers.js");
var _Form = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");
var _sweetalert = _interopRequireDefault(__webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var initialState = {
  pool: {},
  list: {},
  filter: {
    candidateId: null,
    sessionid: null,
    typeId: null,
    centerId: null
  },
  poolId: null,
  count: 0,
  errors: {},
  containerId: null
};

/**
 * React component with form for entering pool specimens
 */
var PoolSpecimenForm = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(PoolSpecimenForm, _React$Component);
  var _super = _createSuper(PoolSpecimenForm);
  /**
   * Constructor
   */
  function PoolSpecimenForm() {
    var _this;
    (0, _classCallCheck2["default"])(this, PoolSpecimenForm);
    _this = _super.call(this);
    _this.state = initialState;
    _this.setPool = _this.setPool.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setFilter = _this.setFilter.bind((0, _assertThisInitialized2["default"])(_this));
    _this.validateListItem = _this.validateListItem.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setPoolList = _this.setPoolList.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  /**
   * Set the current pool.
   *
   * @param {string} name  - the pool name
   * @param {string} value - the pool value
   */
  (0, _createClass2["default"])(PoolSpecimenForm, [{
    key: "setPool",
    value: function setPool(name, value) {
      var pool = (0, _helpers.clone)(this.state.pool);
      pool[name] = value;
      this.setState({
        pool: pool
      });
    }

    /**
     * Set the current filter on specimens to be selected.
     *
     * @param {string} name  - the filter name
     * @param {string} value - the filter values
     */
  }, {
    key: "setFilter",
    value: function setFilter(name, value) {
      var _clone = (0, _helpers.clone)(this.state),
        filter = _clone.filter;
      if (name == 'candidateId') {
        filter.sessionId = null;
      }
      filter[name] = value;
      this.setState({
        filter: filter
      });
    }

    /**
     * Sets the current pool list
     *
     * @param {number} containerId - specimen to be added to pool via containerId
     */
  }, {
    key: "setPoolList",
    value: function setPoolList(containerId) {
      var _clone2 = (0, _helpers.clone)(this.state),
        filter = _clone2.filter,
        list = _clone2.list,
        pool = _clone2.pool,
        count = _clone2.count;

      // Increase count
      count++;

      // Set specimen and container
      var container = this.props.data.containers[containerId];
      var specimen = this.props.data.specimens[container.specimenId];

      // Set current global values
      if ((0, _helpers.isEmpty)(list)) {
        filter.candidateId = specimen.candidateId;
        filter.sessionId = specimen.sessionId;
        filter.typeId = specimen.typeId;
        filter.centerId = container.centerId;
      }

      // Set list values
      list[count] = {
        container: container,
        specimen: specimen
      };

      // Set current pool values
      var specimenIds = pool.specimenIds || [];
      specimenIds.push(specimen.id);
      pool.specimenIds = specimenIds;
      this.setState({
        pool: pool,
        list: list,
        count: count,
        filter: filter
      }, this.setState({
        containerId: null
      }));
    }

    /**
     * Remove a list item
     *
     * @param {string} key - the key to be removed
     */
  }, {
    key: "removeListItem",
    value: function removeListItem(key) {
      var _this2 = this;
      var _clone3 = (0, _helpers.clone)(this.state),
        pool = _clone3.pool,
        list = _clone3.list,
        filter = _clone3.filter;
      // remove specimenId from pool.
      pool.specimenIds = pool.specimenIds.filter(function (id) {
        return id != _this2.state.list[key].specimen.id;
      });

      // delete list at key.
      delete list[key];

      // remove center if list is empty.
      filter = (0, _helpers.isEmpty)(list) ? {} : filter;

      // empty barcode input.
      var containerId = null;
      this.setState({
        pool: pool,
        list: list,
        containerId: containerId,
        filter: filter
      });
    }

    /**
     * Validate a list item for a container
     *
     * @param {number} containerId - the container being validated
     * @return {Promise} - a resolved or rejected promise
     */
  }, {
    key: "validateListItem",
    value: function validateListItem(containerId) {
      var _clone4 = (0, _helpers.clone)(this.state),
        list = _clone4.list,
        filter = _clone4.filter;
      var container = this.props.data.containers[containerId];
      var specimen = this.props.data.specimens[container.specimenId];

      // Throw error if new list item does not meet requirements.
      if (!(0, _helpers.isEmpty)(list) && (specimen.candidateId != filter.candidateId || specimen.sessionId != filter.sessionId || specimen.typeId != filter.typeId || container.centerId !== filter.centerId)) {
        _sweetalert["default"].fire({
          title: 'Oops!',
          text: 'Specimens must be of the same PSCID, ' + 'Visit Label, Type and Center',
          type: 'warning'
        });
        return Promise.reject();
      }
      return Promise.resolve();
    }

    /**
     * {@inheritDoc}
     *
     * @return {JSX}
     */
  }, {
    key: "render",
    value: function render() {
      var _this3 = this,
        _options$candidateSes;
      var _this$props = this.props,
        data = _this$props.data,
        options = _this$props.options;
      var _this$state = this.state,
        pool = _this$state.pool,
        list = _this$state.list,
        filter = _this$state.filter,
        containerId = _this$state.containerId,
        errors = _this$state.errors;

      // generate barcode list from list object.
      var barcodeList = Object.entries(list).map(function (_ref) {
        var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
          key = _ref2[0],
          item = _ref2[1];
        var removeItem = function removeItem() {
          return _this3.removeListItem(key);
        };
        // I cannot get this to work in the css file.
        var style = {
          color: '#DDDDDD',
          marginLeft: 10,
          cursor: 'pointer'
        };
        return /*#__PURE__*/_react["default"].createElement("div", {
          key: key,
          className: "preparation-item"
        }, /*#__PURE__*/_react["default"].createElement("div", null, item.container.barcode), /*#__PURE__*/_react["default"].createElement("div", {
          className: "glyphicon glyphicon-remove",
          onClick: removeItem,
          style: style
        }));
      });

      // Generate Pool form.
      var specimenUnits = (0, _helpers.mapFormOptions)(options.specimen.units, 'label');
      var form = /*#__PURE__*/_react["default"].createElement(_Form.FormElement, {
        name: "poolSpecimenForm"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-10 col-sm-offset-1"
      }, /*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
        label: "Pooling Note",
        text: "Select or Scan the specimens to be pooled. Specimens must have a Status of 'Available', have a Quantity of greater than 0, and share the same Type, PSCID, Visit Label and Current Site. Pooled specimens cannot already belong to a pool. Once pooled, the Status of specimen will be changed to 'Dispensed' and there Quantity set to '0'"
      }), /*#__PURE__*/_react["default"].createElement(_Form.SearchableDropdown, {
        name: "typeId",
        label: "Specimen Type",
        onUserInput: this.setFilter,
        disabled: !(0, _helpers.isEmpty)(list),
        value: filter.typeId,
        options: (0, _helpers.mapFormOptions)(options.specimen.types, 'label')
      }), /*#__PURE__*/_react["default"].createElement(_Form.SearchableDropdown, {
        name: "candidateId",
        label: "PSCID",
        onUserInput: this.setFilter,
        disabled: !(0, _helpers.isEmpty)(list),
        value: filter.candidateId,
        options: (0, _helpers.mapFormOptions)(options.candidates, 'pscid')
      }), /*#__PURE__*/_react["default"].createElement(_Form.SearchableDropdown, {
        name: "sessionId",
        label: "Visit Label",
        onUserInput: this.setFilter,
        disabled: !(0, _helpers.isEmpty)(list) || !filter.candidateId,
        value: filter.sessionId,
        options: (0, _helpers.mapFormOptions)((options === null || options === void 0 ? void 0 : (_options$candidateSes = options.candidateSessions) === null || _options$candidateSes === void 0 ? void 0 : _options$candidateSes[filter.candidateId]) || {}, 'label')
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-xs-6"
      }, /*#__PURE__*/_react["default"].createElement("h4", null, "Barcode Input"), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-top"
      }), /*#__PURE__*/_react["default"].createElement(BarcodeInput, {
        list: list,
        data: data,
        filter: filter,
        options: options,
        errors: errors,
        containerId: containerId,
        validateListItem: this.validateListItem,
        setPoolList: this.setPoolList
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-xs-6"
      }, /*#__PURE__*/_react["default"].createElement("h4", null, "Barcode List"), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-top"
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "preparation-list"
      }, barcodeList))), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-top"
      }), /*#__PURE__*/_react["default"].createElement(_Form.TextboxElement, {
        name: "label",
        label: "Label",
        onUserInput: this.setPool,
        required: true,
        value: pool.label,
        errorMessage: errors.label
      }), /*#__PURE__*/_react["default"].createElement(_Form.TextboxElement, {
        name: "quantity",
        label: "Quantity",
        onUserInput: this.setPool,
        required: true,
        value: pool.quantity,
        errorMessage: errors.quantity
      }), /*#__PURE__*/_react["default"].createElement(_Form.SelectElement, {
        name: "unitId",
        label: "Unit",
        options: specimenUnits,
        onUserInput: this.setPool,
        required: true,
        value: pool.unitId,
        errorMessage: errors.unitId
      }), /*#__PURE__*/_react["default"].createElement(_Form.DateElement, {
        name: "date",
        label: "Date",
        onUserInput: this.setPool,
        required: true,
        value: pool.date,
        errorMessage: errors.date
      }), /*#__PURE__*/_react["default"].createElement(_Form.TimeElement, {
        name: "time",
        label: "Time",
        onUserInput: this.setPool,
        required: true,
        value: pool.time,
        errorMessage: errors.time
      }))));
      var handleClose = function handleClose() {
        return _this3.setState(initialState, _this3.props.onClose);
      };
      var handleSubmit = function handleSubmit() {
        return new Promise(function (resolve, reject) {
          _this3.props.onSubmit(pool, list).then(function () {
            return resolve();
          }, function (errors) {
            return _this3.setState({
              errors: errors
            }, reject());
          });
        });
      };
      return /*#__PURE__*/_react["default"].createElement(_Modal["default"], {
        title: "Pool Specimens",
        show: this.props.show,
        onClose: handleClose,
        onSubmit: handleSubmit,
        throwWarning: true
      }, form);
    }
  }]);
  return PoolSpecimenForm;
}(_react["default"].Component); // PoolSpecimenForm.propTypes
PoolSpecimenForm.propTypes = {
  data: _propTypes["default"].shape({
    containers: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      specimenId: _propTypes["default"].number.isRequired,
      centerId: _propTypes["default"].number.isRequired
    })).isRequired,
    specimens: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      specimenId: _propTypes["default"].number.isRequired
    })).isRequired
  }).isRequired,
  options: _propTypes["default"].shape({
    candidateSessions: _propTypes["default"].obj,
    specimen: _propTypes["default"].shape({
      units: _propTypes["default"].string,
      types: _propTypes["default"].arrayOf(_propTypes["default"].string)
    }).isRequired,
    candidates: _propTypes["default"].arrayOf(_propTypes["default"].string),
    sessions: _propTypes["default"].arrayOf(_propTypes["default"].string)
  }).isRequired,
  onClose: _propTypes["default"].func.isRequired,
  onSubmit: _propTypes["default"].func.isRequired,
  show: _propTypes["default"].bool.isRequired
};

/**
 * React component to read input from a barcode
 */
var BarcodeInput = /*#__PURE__*/function (_PureComponent) {
  (0, _inherits2["default"])(BarcodeInput, _PureComponent);
  var _super2 = _createSuper(BarcodeInput);
  function BarcodeInput() {
    (0, _classCallCheck2["default"])(this, BarcodeInput);
    return _super2.apply(this, arguments);
  }
  (0, _createClass2["default"])(BarcodeInput, [{
    key: "render",
    value:
    /**
     * Render react component
     *
     * @return {JSX}
     */
    function render() {
      var _this4 = this;
      var _this$props2 = this.props,
        list = _this$props2.list,
        data = _this$props2.data,
        filter = _this$props2.filter,
        options = _this$props2.options,
        errors = _this$props2.errors,
        containerId = _this$props2.containerId;

      // Restrict list of barcodes to only those that would be valid.
      var barcodesPrimary = Object.values(data.containers).reduce(function (result, container) {
        if (options.container.types[container.typeId].primary == 1) {
          var specimen = data.specimens[container.specimenId] || {};
          var availableId = Object.keys(options.container.stati).find(function (key) {
            return options.container.stati[key].label === 'Available';
          });
          var inList = Object.values(list).find(function (i) {
            return i.container.id == container.id;
          });
          var candidateMatch = !filter.candidateId || specimen.candidateId == filter.candidateId;
          var sessionMatch = !filter.sessionId || specimen.sessionId == filter.sessionId;
          var typeMatch = !filter.typeId || specimen.typeId == filter.typeId;
          if (specimen.quantity > 0 && container.statusId == availableId && specimen.poolId == null && !inList && candidateMatch && sessionMatch && typeMatch) {
            result[container.id] = container.barcode;
          }
        }
        return result;
      }, {});
      var handleInput = function handleInput(name, containerId) {
        containerId && _this4.props.validateListItem(containerId).then(function () {
          return _this4.props.setPoolList(containerId);
        });
      };
      return /*#__PURE__*/_react["default"].createElement(_Form.SearchableDropdown, {
        name: 'containerId',
        label: 'Specimen',
        onUserInput: handleInput,
        options: barcodesPrimary,
        value: containerId,
        errorMessage: errors.total
      });
    }
  }]);
  return BarcodeInput;
}(_react.PureComponent); // BarcodeInput.propTypes
BarcodeInput.propTypes = {
  list: _propTypes["default"].array.isRequired,
  data: _propTypes["default"].shape({
    containers: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      specimenId: _propTypes["default"].number.isRequired
    })).isRequired,
    specimens: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      // Define specimen-specific properties if necessary
    })).isRequired
  }).isRequired,
  filter: _propTypes["default"].shape({
    candidateId: _propTypes["default"].string,
    sessionId: _propTypes["default"].string,
    typeId: _propTypes["default"].string
  }).isRequired,
  options: _propTypes["default"].shape({
    container: _propTypes["default"].shape({
      types: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })).isRequired,
      stati: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })).isRequired
    }).isRequired
  }).isRequired,
  errors: _propTypes["default"].shape({
    total: _propTypes["default"].string
  }).isRequired,
  containerId: _propTypes["default"].number.isRequired,
  validateListItem: _propTypes["default"].func.isRequired,
  setPoolList: _propTypes["default"].func.isRequired
};
var _default = exports["default"] = PoolSpecimenForm;

/***/ }),

/***/ "./modules/biobank/jsx/poolTab.js":
/*!****************************************!*\
  !*** ./modules/biobank/jsx/poolTab.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _FilterableDataTable = _interopRequireDefault(__webpack_require__(/*! FilterableDataTable */ "./jsx/FilterableDataTable.js"));
var _Form = __webpack_require__(/*! jsx/Form.js */ "./jsx/Form.js");
var _specimenForm = _interopRequireDefault(__webpack_require__(/*! ./specimenForm */ "./modules/biobank/jsx/specimenForm.js"));
var _helpers = __webpack_require__(/*! ./helpers.js */ "./modules/biobank/jsx/helpers.js");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * React component for the Pool tab of the Biobank module.
 */
var PoolTab = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(PoolTab, _Component);
  var _super = _createSuper(PoolTab);
  /**
   * Constructor
   */
  function PoolTab() {
    var _this;
    (0, _classCallCheck2["default"])(this, PoolTab);
    _this = _super.call(this);
    _this.state = {
      editable: {},
      poolId: null
    };
    _this.edit = _this.edit.bind((0, _assertThisInitialized2["default"])(_this));
    _this.clearEditable = _this.clearEditable.bind((0, _assertThisInitialized2["default"])(_this));
    _this.openAliquotForm = _this.openAliquotForm.bind((0, _assertThisInitialized2["default"])(_this));
    _this.mapPoolColumns = _this.mapPoolColumns.bind((0, _assertThisInitialized2["default"])(_this));
    _this.formatPoolColumns = _this.formatPoolColumns.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  /**
   * Make the form editable
   *
   * @param {string} stateKey - name of form that will be editable
   * @return {Promise}
   */
  (0, _createClass2["default"])(PoolTab, [{
    key: "edit",
    value: function edit(stateKey) {
      var _this2 = this;
      var _clone = (0, _helpers.clone)(this.state),
        editable = _clone.editable;
      editable[stateKey] = true;
      return new Promise(function (res) {
        return _this2.setState({
          editable: editable
        }, res());
      });
    }

    /**
     * Clear the editable state of this form.
     */
  }, {
    key: "clearEditable",
    value: function clearEditable() {
      this.setState({
        editable: {}
      });
    }

    /**
     * Open the aliquot form for a pool
     *
     * @param {number} poolId - the pool id
     */
  }, {
    key: "openAliquotForm",
    value: function openAliquotForm(poolId) {
      var _this3 = this;
      this.setState({
        poolId: poolId
      }, function () {
        return _this3.edit('aliquotForm');
      });
    }

    /**
     * Map IDs in the pool columns to a string value.
     *
     * @param {string} column - the column name being mapped
     * @param {string} value - the column value being mapped
     * @return {string}
     */
  }, {
    key: "mapPoolColumns",
    value: function mapPoolColumns(column, value) {
      var options = this.props.options;
      switch (column) {
        case 'Type':
          return options.specimen.types[value].label;
        case 'Site':
          return options.centers[value];
        default:
          return value;
      }
    }

    /**
     * Format a row of columns for the pooled specimen.
     *
     * @param {string} column - the column name
     * @param {string} value - the column value
     * @param {object} row - all the values from the row
     * @return {JSX}
     */
  }, {
    key: "formatPoolColumns",
    value: function formatPoolColumns(column, value, row) {
      var _Object$values$find,
        _this4 = this;
      var options = this.props.options;
      value = this.mapPoolColumns(column, value);
      var candId = (_Object$values$find = Object.values(options.candidates).find(function (cand) {
        return (cand === null || cand === void 0 ? void 0 : cand.pscid) == row['PSCID'];
      })) === null || _Object$values$find === void 0 ? void 0 : _Object$values$find.id;

      // If candId is defined, then the user has access to the candidate and a
      // hyperlink can be established.
      var candidatePermission = candId !== undefined;
      switch (column) {
        case 'Pooled Specimens':
          var barcodes = value.map(function (barcode, i) {
            return /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Link, {
              key: i,
              to: "/barcode=".concat(barcode)
            }, barcode);
          }).reduce(function (prev, curr) {
            return [prev, ', ', curr];
          });
          return /*#__PURE__*/_react["default"].createElement("td", null, barcodes);
        case 'PSCID':
          if (candidatePermission) {
            return /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement("a", {
              href: loris.BaseURL + '/' + candId
            }, value));
          }
          return /*#__PURE__*/_react["default"].createElement("td", null, value);
        case 'Visit Label':
          if (candidatePermission) {
            var _Object$values$find2;
            var sessId = (_Object$values$find2 = Object.values(options.candidateSessions[candId]).find(function (sess) {
              return sess.label == value;
            })) === null || _Object$values$find2 === void 0 ? void 0 : _Object$values$find2.id;
            var sessionPermission = sessId !== undefined;
            if (sessionPermission) {
              var visitLabelURL = loris.BaseURL + '/instrument_list/?candID=' + candId + '&sessionID=' + sessId;
              return /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement("a", {
                href: visitLabelURL
              }, value));
            }
          }
          return /*#__PURE__*/_react["default"].createElement("td", null, value);
        case 'Aliquot':
          var onClick = function onClick() {
            return _this4.openAliquotForm(row['ID']);
          };
          return /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement(_Form.CTA, {
            label: "Aliquot",
            onUserInput: onClick
          }));
        default:
          return /*#__PURE__*/_react["default"].createElement("td", null, value);
      }
    }

    /**
     * Render the aliquot form
     *
     * @return {JSX}
     */
  }, {
    key: "renderAliquotForm",
    value: function renderAliquotForm() {
      var _this5 = this;
      // TODO: This should be fixed. A lot of hacks are being used to initialize
      // this form and there's definitely better ways to be doing it.
      var _this$props = this.props,
        data = _this$props.data,
        options = _this$props.options;
      if (!(loris.userHasPermission('biobank_specimen_create') && this.state.poolId)) {
        return;
      }
      var specimens = Object.values(data.specimens).filter(function (specimen) {
        return specimen.poolId == _this5.state.poolId;
      });
      var parents = specimens.map(function (specimen) {
        return {
          specimen: specimen,
          container: data.containers[specimen.containerId]
        };
      });
      return /*#__PURE__*/_react["default"].createElement(_specimenForm["default"], {
        title: "Aliquot Pool",
        parent: parents,
        options: options,
        data: data,
        increaseCoordinate: this.props.increaseCoordinate,
        show: this.state.editable.aliquotForm,
        onClose: this.clearEditable,
        onSubmit: this.props.createSpecimens
      });
    }

    /**
     * Render the react component
     *
     * @return {JSX}
     */
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
        data = _this$props2.data,
        options = _this$props2.options;
      var specimenTypes = (0, _helpers.mapFormOptions)(options.specimen.types, 'label');
      var poolData = Object.values(data.pools).map(function (pool) {
        return [pool.id, pool.label, Math.round(pool.quantity * 100) / 100 + ' ' + options.specimen.units[pool.unitId].label, pool.specimenBarcodes, pool.candidatePSCID, options.sessions[pool.sessionId].label, pool.typeId, pool.centerId, pool.date, pool.time];
      });
      var fields = [{
        label: 'ID',
        show: false
      }, {
        label: 'Label',
        show: true,
        filter: {
          name: 'barcode',
          type: 'text'
        }
      }, {
        label: 'Quantity',
        show: true
      }, {
        label: 'Pooled Specimens',
        show: true
      }, {
        label: 'PSCID',
        show: true,
        filter: {
          name: 'pscid',
          type: 'text'
        }
      }, {
        label: 'Visit Label',
        show: true,
        filter: {
          name: 'session',
          type: 'text'
        }
      }, {
        label: 'Type',
        show: true,
        filter: {
          name: 'type',
          type: 'select',
          options: specimenTypes
        }
      }, {
        label: 'Site',
        show: true,
        filter: {
          name: 'site',
          type: 'select',
          options: options.centers
        }
      }, {
        label: 'Date',
        show: true
      }, {
        label: 'Time',
        show: true
      }, {
        label: 'Aliquot',
        show: true
      }];
      return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_FilterableDataTable["default"], {
        name: "pool",
        data: poolData,
        fields: fields,
        getFormattedCell: this.formatPoolColumns,
        getMappedCell: this.mapPoolColumns,
        progress: this.props.loading
      }), this.renderAliquotForm());
    }
  }]);
  return PoolTab;
}(_react.Component); // PoolTab.propTypes
PoolTab.propTypes = {
  data: _propTypes["default"].shape({
    containers: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      specimenId: _propTypes["default"].number.isRequired
    })).isRequired,
    specimens: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      specimenId: _propTypes["default"].number.isRequired
    })).isRequired,
    pools: _propTypes["default"].array.isRequired
  }).isRequired,
  options: _propTypes["default"].shape({
    specimen: _propTypes["default"].shape({
      units: _propTypes["default"].array,
      types: _propTypes["default"].array
    }).isRequired,
    centers: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
    candidates: _propTypes["default"].arrayOf(_propTypes["default"].string),
    candidateSessions: _propTypes["default"].arrayOf(_propTypes["default"].string),
    projects: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
    sessions: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired
  }).isRequired,
  increaseCoordinate: _propTypes["default"].func.isRequired,
  createSpecimens: _propTypes["default"].func.isRequired,
  onClose: _propTypes["default"].func.isRequired,
  onSubmit: _propTypes["default"].func.isRequired,
  show: _propTypes["default"].bool.isRequired,
  loading: _propTypes["default"].bool.isRequired
};
var _default = exports["default"] = PoolTab;

/***/ }),

/***/ "./modules/biobank/jsx/processForm.js":
/*!********************************************!*\
  !*** ./modules/biobank/jsx/processForm.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _Form = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");
var _helpers = __webpack_require__(/*! ./helpers.js */ "./modules/biobank/jsx/helpers.js");
var _customFields = _interopRequireDefault(__webpack_require__(/*! ./customFields */ "./modules/biobank/jsx/customFields.js"));
/**
 * Biobank Specimen Process Form
 *
 * @param  {object} props
 * @return {JSX}
 */
var SpecimenProcessForm = function SpecimenProcessForm(props) {
  var setProcess = function setProcess(name, value) {
    var process = (0, _helpers.clone)(props.process);
    process[name] = value;
    props.setParent(props.processStage, process);
  };
  var setProtocol = function setProtocol(name, value) {
    var process = (0, _helpers.clone)(props.process);
    process[name] = value;
    process.data = {};
    props.setParent(props.processStage, process);
  };
  var setData = function setData(name, value) {
    var data = (0, _helpers.clone)(props.process.data);
    if (value instanceof File) {
      data[name] = value.name;
      var files = (0, _helpers.clone)(props.current.files);
      files[value.name] = value;
      props.setCurrent('files', files);
    } else {
      data[name] = value;
    }
    setProcess('data', data);
  };
  var specimen = props.specimen,
    process = props.process,
    processStage = props.processStage,
    typeId = props.typeId,
    options = props.options,
    _props$errors = props.errors,
    errors = _props$errors === void 0 ? {} : _props$errors,
    edit = props.edit;
  var updateButton = specimen && /*#__PURE__*/_react["default"].createElement(_Form.ButtonElement, {
    label: "Update",
    onUserInput: function onUserInput() {
      return props.updateSpecimen(specimen);
    }
  });
  var specimenProtocols = {};
  var specimenProtocolAttributes = {};
  Object.entries(options.specimen.protocols).forEach(function (_ref) {
    var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
      id = _ref2[0],
      protocol = _ref2[1];
    // FIXME: I really don't like 'toLowerCase()' function, but it's the
    // only way I can get it to work at the moment.
    var process = options.specimen.processes[protocol.processId].label.toLowerCase();
    if (typeId == protocol.typeId && process == processStage) {
      specimenProtocols[id] = protocol.label;
      var attribute = options.specimen.protocolAttributes[id];
      specimenProtocolAttributes[id] = attribute;
    }
  });
  var renderProtocolFields = function renderProtocolFields() {
    if (specimenProtocolAttributes[process.protocolId]) {
      if (process.data) {
        return /*#__PURE__*/_react["default"].createElement(_customFields["default"], {
          options: options,
          errors: errors.data || {},
          fields: specimenProtocolAttributes[process.protocolId],
          object: process.data,
          setData: setData
        });
      } else {
        setProcess('data', {});
      }
    }
  };
  var specimenTypeUnits = Object.keys(options.specimen.typeUnits[typeId] || {}).reduce(function (result, id) {
    result[id] = options.specimen.typeUnits[typeId][id].label;
    return result;
  }, {});
  var collectionFields = processStage === 'collection' && [/*#__PURE__*/_react["default"].createElement(_Form.TextboxElement, {
    name: "quantity",
    label: "Quantity",
    onUserInput: setProcess,
    required: true,
    value: process.quantity,
    errorMessage: errors.quantity
  }), /*#__PURE__*/_react["default"].createElement(_Form.SelectElement, {
    name: "unitId",
    label: "Unit",
    options: specimenTypeUnits,
    onUserInput: setProcess,
    required: true,
    value: process.unitId,
    errorMessage: errors.unitId,
    autoSelect: true
  })];
  var protocolField = !props.hideProtocol && /*#__PURE__*/_react["default"].createElement(_Form.SelectElement, {
    name: "protocolId",
    label: "Protocol",
    options: specimenProtocols,
    onUserInput: setProtocol,
    required: true,
    value: process.protocolId,
    errorMessage: errors.protocolId,
    autoSelect: true
  });
  var examiners = (0, _helpers.mapFormOptions)(options.examiners, 'label');
  if (typeId && edit === true) {
    return [protocolField, /*#__PURE__*/_react["default"].createElement(_Form.SelectElement, {
      name: "examinerId",
      label: "Done By",
      options: examiners,
      onUserInput: setProcess,
      required: true,
      value: process.examinerId,
      errorMessage: errors.examinerId,
      autoSelect: true
    }), /*#__PURE__*/_react["default"].createElement(_Form.DateElement, {
      name: "date",
      label: "Date",
      onUserInput: setProcess,
      required: true,
      value: process.date,
      errorMessage: errors.date
    }), /*#__PURE__*/_react["default"].createElement(_Form.TimeElement, {
      name: "time",
      label: "Time",
      onUserInput: setProcess,
      required: true,
      value: process.time,
      errorMessage: errors.time
    }), collectionFields, /*#__PURE__*/_react["default"].createElement("div", {
      className: "form-top"
    }), renderProtocolFields(), /*#__PURE__*/_react["default"].createElement(_Form.TextareaElement, {
      name: "comments",
      label: "Comments",
      onUserInput: setProcess,
      value: process.comments,
      errorMessage: errors.comments
    }), updateButton];
  } else if (edit === false) {
    var protocolStaticFields = process.data && Object.keys(process.data).map(function (key) {
      var value = process.data[key];
      if (process.data[key] === true) {
        value = 'Yes';
      } else if (process.data[key] === false) {
        value = 'No';
      }
      // FIXME: The label used to be produced in the following way:
      // label={options.specimen.protocolAttributes[process.protocolId][key].label}
      // However, causes issues when there is data in the data
      // object, but the protocolId is not associated with any attributes.
      // This is a configuration/importing issue that should be fixed.
      return /*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
        key: key,
        label: options.specimen.attributes[key].label,
        text: value
      });
    });
    var collectionStaticFields = processStage === 'collection' && /*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
      label: "Quantity",
      text: process.quantity + ' ' + options.specimen.units[process.unitId].label
    });
    return [/*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
      label: "Protocol",
      text: options.specimen.protocols[process.protocolId].label
    }), /*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
      label: "Site",
      text: options.centers[process.centerId]
    }), /*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
      label: "Done By",
      text: options.examiners[process.examinerId].label
    }), /*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
      label: "Date",
      text: process.date
    }), /*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
      label: "Time",
      text: process.time
    }), collectionStaticFields, protocolStaticFields, /*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
      label: "Comments",
      text: process.comments
    })];
  }
  return null;
};

// ProcessForm.propTypes
SpecimenProcessForm.propTypes = {
  edit: _propTypes["default"].bool,
  process: _propTypes["default"].shape({
    data: _propTypes["default"].object,
    protocolId: _propTypes["default"].number,
    quantity: _propTypes["default"].number,
    unitId: _propTypes["default"].number,
    examinerId: _propTypes["default"].number,
    date: _propTypes["default"].string,
    time: _propTypes["default"].string,
    comments: _propTypes["default"].string,
    centerId: _propTypes["default"].number
  }).isRequired,
  processStage: _propTypes["default"].string.isRequired,
  current: _propTypes["default"].shape({
    files: _propTypes["default"].array
  }).isRequired,
  setCurrent: _propTypes["default"].func.isRequired,
  typeId: _propTypes["default"].number.isRequired,
  options: _propTypes["default"].shape({
    specimen: _propTypes["default"].shape({
      typeUnits: _propTypes["default"].string,
      types: _propTypes["default"].arrayOf(_propTypes["default"].string),
      attributes: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })),
      units: _propTypes["default"].obj,
      protocols: _propTypes["default"].arrayOf(_propTypes["default"].string),
      processes: _propTypes["default"].arrayOf(_propTypes["default"].string),
      protocolAttributes: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      }))
    }).isRequired,
    centers: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
    candidates: _propTypes["default"].arrayOf(_propTypes["default"].string),
    candidateSessions: _propTypes["default"].arrayOf(_propTypes["default"].string),
    sessions: _propTypes["default"].arrayOf(_propTypes["default"].string),
    examiners: _propTypes["default"].arrayOf(_propTypes["default"].string)
  }).isRequired,
  specimen: _propTypes["default"].object.isRequired,
  errors: _propTypes["default"].shape({
    data: _propTypes["default"].obj,
    quantity: _propTypes["default"].string,
    unitId: _propTypes["default"].string,
    protocolId: _propTypes["default"].string,
    examinerId: _propTypes["default"].string,
    date: _propTypes["default"].string,
    time: _propTypes["default"].string,
    comments: _propTypes["default"].string,
    container: _propTypes["default"].shape({
      typeId: _propTypes["default"].string
    })
  }).isRequired,
  hideProtocol: _propTypes["default"].bool,
  increaseCoordinate: _propTypes["default"].func.isRequired,
  createSpecimens: _propTypes["default"].func.isRequired,
  printLabel: _propTypes["default"].func.isRequired,
  getParentContainerBarcodes: _propTypes["default"].func.isRequired,
  getBarcodePathDisplay: _propTypes["default"].func.isRequired,
  setParent: _propTypes["default"].func.isRequired,
  updateSpecimen: _propTypes["default"].func.isRequired
};
var _default = exports["default"] = SpecimenProcessForm;

/***/ }),

/***/ "./modules/biobank/jsx/search.js":
/*!***************************************!*\
  !*** ./modules/biobank/jsx/search.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _Modal = _interopRequireDefault(__webpack_require__(/*! Modal */ "./jsx/Modal.tsx"));
var _Form = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * Provides a modal window that can be used to search barcodes
 */
var Search = /*#__PURE__*/function (_PureComponent) {
  (0, _inherits2["default"])(Search, _PureComponent);
  var _super = _createSuper(Search);
  /**
   * Constructor
   */
  function Search() {
    var _this;
    (0, _classCallCheck2["default"])(this, Search);
    _this = _super.call(this);
    _this.state = {
      barcode: null
    };
    return _this;
  }

  /**
   * Render React component
   *
   * @return {JSX}
   */
  (0, _createClass2["default"])(Search, [{
    key: "render",
    value: function render() {
      var _this2 = this;
      var onInput = function onInput(name, value) {
        _this2.setState({
          barcode: value
        });
        if (Object.values(_this2.props.barcodes).find(function (barcode) {
          return barcode == value;
        })) {
          _this2.props.history.push("/barcode=".concat(value));
          _this2.props.onClose();
        }
      };
      return /*#__PURE__*/_react["default"].createElement(_Modal["default"], {
        title: this.props.title,
        show: this.props.show,
        onClose: this.props.onClose,
        throwWarning: false
      }, /*#__PURE__*/_react["default"].createElement(_Form.FormElement, null, /*#__PURE__*/_react["default"].createElement(_Form.TextboxElement, {
        name: "barcode",
        label: "Barcode",
        value: this.state.barcode,
        options: this.props.barcodes,
        onUserInput: onInput,
        placeHolder: "Please Scan or Type Barcode",
        autoFocus: true
      })));
    }
  }]);
  return Search;
}(_react.PureComponent); // Search.propTypes
Search.propTypes = {
  barcodes: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
  history: _propTypes["default"].shape({
    push: _propTypes["default"].func.isRequired
  }).isRequired,
  onClose: _propTypes["default"].func.isRequired,
  title: _propTypes["default"].string.isRequired,
  show: _propTypes["default"].bool.isRequired
};
var _default = exports["default"] = Search;

/***/ }),

/***/ "./modules/biobank/jsx/shipmentTab.js":
/*!********************************************!*\
  !*** ./modules/biobank/jsx/shipmentTab.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js"));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js"));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
var _FilterableDataTable = _interopRequireDefault(__webpack_require__(/*! FilterableDataTable */ "./jsx/FilterableDataTable.js"));
var _Shipment = __webpack_require__(/*! ./Shipment */ "./modules/biobank/jsx/Shipment.js");
var _Modal = _interopRequireDefault(__webpack_require__(/*! Modal */ "./jsx/Modal.tsx"));
var _Form = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");
var _helpers = __webpack_require__(/*! ./helpers.js */ "./modules/biobank/jsx/helpers.js");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; } // import Container from './Container';
/**
 * Returns a JSX component for the shipment tab of the module
 *
 * @param {object} props - the parameters
 * @param {object} props.data - the data to display
 * @param {function} props.setData - a callback to set data
 * @param {object} props.options - values for select options?
 * @return {JSX}
 */
function ShipmentTab(_ref) {
  var data = _ref.data,
    setData = _ref.setData,
    options = _ref.options;
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    show = _useState2[0],
    setShow = _useState2[1];
  var _useState3 = (0, _react.useState)({}),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    shipments = _useState4[0],
    setShipments = _useState4[1];
  var users = {};

  // TODO: There has to be a better way to query this.
  Object.values(options.users).forEach(function (user) {
    users[user.label] = user.label;
  });

  // TODO: Look into this for standardization:
  // https://www.robinwieruch.de/react-hooks-fetch-data
  (0, _react.useEffect)(function () {
    var fetchData = /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.t0 = setShipments;
                _context.next = 3;
                return (0, _helpers.get)("".concat(loris.BaseURL, "/biobank/shipments/"));
              case 3:
                _context.t1 = _context.sent;
                (0, _context.t0)(_context.t1);
              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return function fetchData() {
        return _ref2.apply(this, arguments);
      };
    }();
    fetchData();
  }, []);
  var updateShipments = function updateShipments(updatedShipments) {
    updatedShipments.forEach(function (shipment) {
      setShipments(_objectSpread(_objectSpread({}, shipments), {}, (0, _defineProperty2["default"])({}, shipment.barcode, shipment)));
    });
  };
  var mapShipmentColumns = function mapShipmentColumns(column, value) {
    switch (column) {
      case 'Origin Center':
        return options.centers[value];
      case 'Destination Center':
        return options.centers[value];
      default:
        return value;
    }
  };
  var formatShipmentColumns = function formatShipmentColumns(column, value, row) {
    value = mapShipmentColumns(column, value);
    switch (column) {
      case 'Barcode':
        return /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement(TriggerableModal, {
          label: value,
          title: value + ' Information'
        }, /*#__PURE__*/_react["default"].createElement(ShipmentInformation, {
          shipment: shipments[value],
          centers: options.centers
        })));
      case 'Actions':
        if (row['Status'] !== 'received') {
          return /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement(ReceiveShipment, {
            shipment: shipments[row['Barcode']],
            users: users,
            updateShipments: updateShipments,
            setData: setData
          }));
        }
        return /*#__PURE__*/_react["default"].createElement("td", null);
      default:
        return /*#__PURE__*/_react["default"].createElement("td", null, value);
    }
  };
  var shipmentData = Object.values(shipments).map(function (shipment) {
    return [shipment.id, shipment.barcode, shipment.type, shipment.status, shipment.originCenterId, shipment.destinationCenterId];
  });
  var fields = [{
    label: 'ID',
    show: false
  }, {
    label: 'Barcode',
    show: true,
    filter: {
      name: 'barcode',
      type: 'text'
    }
  }, {
    label: 'Type',
    show: true,
    filter: {
      name: 'type',
      type: 'select',
      options: options.shipment.types
    }
  }, {
    label: 'Status',
    show: true,
    filter: {
      name: 'status',
      type: 'select',
      options: options.shipment.statuses
    }
  }, {
    label: 'Origin Center',
    show: true,
    filter: {
      name: 'originCenterId',
      type: 'select',
      options: options.centers
    }
  }, {
    label: 'Destination Center',
    show: true,
    filter: {
      name: 'destinationCenterId',
      type: 'select',
      options: options.centers
    }
  }, {
    label: 'Actions',
    show: true
  }];
  var actions = [{
    name: 'addShipment',
    label: 'Add Shipment',
    action: function action() {
      return setShow(true);
    }
  }];
  var forms = [/*#__PURE__*/_react["default"].createElement(CreateShipment, {
    show: show,
    setShow: setShow,
    data: data,
    centers: options.centers,
    types: options.shipment.types,
    users: users,
    updateShipments: updateShipments,
    setData: setData
  })];
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, forms, /*#__PURE__*/_react["default"].createElement(_FilterableDataTable["default"], {
    data: shipmentData,
    fields: fields,
    actions: actions,
    getMappedCell: mapShipmentColumns,
    getFormattedCell: formatShipmentColumns
  }));
}

// ShipmentTab.propTypes
ShipmentTab.propTypes = {
  // Data prop: Contains nested data objects
  data: _propTypes["default"].shape({
    data: _propTypes["default"].object.isRequired,
    // Define more specific shape if possible
    containers: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      specimenId: _propTypes["default"].number.isRequired
      // Add other container-specific properties if necessary
    })).isRequired,
    specimens: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      specimenId: _propTypes["default"].number.isRequired
      // Add other specimen-specific properties if necessary
    })).isRequired,
    pools: _propTypes["default"].array.isRequired
  }).isRequired,
  // Function to set data
  setData: _propTypes["default"].func.isRequired,
  // Options prop: Configuration options for shipment, specimen, container, etc.
  options: _propTypes["default"].shape({
    shipment: _propTypes["default"].shape({
      statuses: _propTypes["default"].object,
      types: _propTypes["default"].object
    }),
    specimen: _propTypes["default"].shape({
      units: _propTypes["default"].string.isRequired,
      // Added based on error
      types: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })).isRequired
    }).isRequired,
    container: _propTypes["default"].shape({
      typesPrimary: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })).isRequired,
      stati: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })).isRequired
    }).isRequired,
    diagnoses: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      label: _propTypes["default"].string.isRequired
    })),
    centers: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
    projects: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
    candidates: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
    users: _propTypes["default"].object,
    sessions: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
    candidateSessions: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired
  }).isRequired,
  // Functional props
  increaseCoordinate: _propTypes["default"].func.isRequired,
  createSpecimens: _propTypes["default"].func.isRequired,
  // Other props (ensure these are actually used in the component)
  loading: _propTypes["default"].bool.isRequired,
  // History prop: For navigation
  history: _propTypes["default"].shape({
    push: _propTypes["default"].func.isRequired
  }).isRequired,
  // UI Control props
  title: _propTypes["default"].string.isRequired,
  show: _propTypes["default"].bool.isRequired
};

/**
 * Returns some dom elements with information about a shipment
 *
 * @param {object} props - The parameters
 * @param {object} props.shipment - the shipment
 * @param {object} props.centers - centers
 * @return {JSX}
 */
function ShipmentInformation(_ref3) {
  var shipment = _ref3.shipment,
    centers = _ref3.centers;
  var logs = shipment.logs.map(function (log, i) {
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("h4", null, "Shipment Log ", i + 1), /*#__PURE__*/_react["default"].createElement(HorizontalRule, null), /*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
      label: "Center",
      text: centers[log.centerId]
    }), /*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
      label: "Status",
      text: log.status
    }), /*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
      label: "Temperature",
      text: log.temperature
    }), /*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
      label: "Date",
      text: log.date
    }), /*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
      label: "Time",
      text: log.time
    }), /*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
      label: "User",
      text: log.user
    }), /*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
      label: "Comments",
      text: log.comments
    }));
  });
  var containerBarcodes = shipment.containerBarcodes.map(function (barcode, i) {
    return /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Link, {
      key: i,
      to: "/barcode=".concat(barcode)
    }, barcode);
  }).reduce(function (prev, curr) {
    return [prev, ', ', curr];
  });
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
    label: "Barcode",
    text: shipment.barcode
  }), /*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
    label: "Type",
    text: shipment.type
  }), /*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
    label: "Containers",
    text: containerBarcodes
  }), /*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
    label: "Origin Center",
    text: centers[shipment.logs[0].centerId]
  }), /*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
    label: "Destination Center",
    text: centers[shipment.destinationCenterId]
  }), logs);
}
ShipmentInformation.propTypes = {
  // Shipment prop: Contains shipment details
  shipment: _propTypes["default"].shape({
    barcode: _propTypes["default"].string.isRequired,
    type: _propTypes["default"].string.isRequired,
    logs: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      centerId: _propTypes["default"].number,
      temperature: _propTypes["default"].number,
      date: _propTypes["default"].string,
      time: _propTypes["default"].string,
      user: _propTypes["default"].string,
      comments: _propTypes["default"].string
    })).isRequired,
    containerBarcodes: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
    destinationCenterId: _propTypes["default"].number.isRequired
  }).isRequired,
  // Centers prop: Array of centers
  centers: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired
};

/**
 * Modal form to create a shipment
 *
 * @param {object} props all the properties
 * @param {boolean} props.show
 * @param {object} props.data - the default data
 * @param {object} props.centers - the centers
 * @param {object} props.types - the types of shipments
 * @param {object} props.users - a list of selectable users
 * @param {function} props.updateShipments - an update callback
 * @param {function} props.setData - an update callback
 * @param {function} props.setShow
 * @return {JSX}
 */
function CreateShipment(_ref4) {
  var show = _ref4.show,
    setShow = _ref4.setShow,
    data = _ref4.data,
    centers = _ref4.centers,
    types = _ref4.types,
    users = _ref4.users,
    updateShipments = _ref4.updateShipments,
    setData = _ref4.setData;
  var logIndex = 0;
  var handler = new _Shipment.UseShipment();
  var shipment = handler.getShipment();
  var errors = handler.getErrors();
  var onSubmit = /*#__PURE__*/function () {
    var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var entities;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return handler.post();
            case 2:
              entities = _context2.sent;
              updateShipments(entities.shipments);
              _context2.next = 6;
              return setData('containers', entities.containers);
            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return function onSubmit() {
      return _ref5.apply(this, arguments);
    };
  }();
  var onClose = function onClose() {
    handler.clear();
    setShow(false);
  };

  // Use a ref to keep track of the previous value of 'show'
  var prevShowRef = (0, _react.useRef)();
  (0, _react.useEffect)(function () {
    var prevShow = prevShowRef.current;

    // Check if 'show' has changed from false to true
    if (!prevShow && show) {
      handler.addLog({
        status: 'created'
      });
    }

    // Update the ref with the current value of 'show' for the next render
    prevShowRef.current = show;
  }, [show]);

  // If the associated shipments containers change, update the site of the log.
  (0, _react.useEffect)(function () {
    if (shipment.containerIds.length === 1) {
      var container = data.containers[shipment.containerIds[0]];
      handler.setLog('centerId', container.centerId, logIndex);
    }
  }, [shipment.containerIds]);
  return /*#__PURE__*/_react["default"].createElement(_Modal["default"], {
    show: show,
    title: "Create Shipment",
    onSubmit: onSubmit,
    onClose: onClose
  }, /*#__PURE__*/_react["default"].createElement(_Form.StaticElement, {
    label: "Note",
    text: "Any container or specimen added to this form will be dissassociated from its parent. Any children of the containers listed will also be added to the shipment."
  }), /*#__PURE__*/_react["default"].createElement(_Form.TextboxElement, {
    name: "barcode",
    label: "Barcode",
    onUserInput: handler.set,
    value: shipment.barcode,
    errorMessage: errors.barcode,
    required: true
  }), /*#__PURE__*/_react["default"].createElement(_Form.SelectElement, {
    name: "type",
    label: "Container Type",
    onUserInput: handler.set,
    value: shipment.type,
    options: types,
    errorMessage: errors.type,
    required: true
  }), /*#__PURE__*/_react["default"].createElement(_Form.TagsElement, {
    name: "barcode",
    label: "Container",
    items: shipment.containerIds,
    handleAdd: handler.setContainerIds,
    options: data.containers,
    useSearch: true,
    errorMessage: errors.containerIds
  }), /*#__PURE__*/_react["default"].createElement(_Form.SelectElement, {
    name: "destinationCenterId",
    label: "Destination Center",
    onUserInput: handler.set,
    value: shipment.destinationCenterId,
    options: centers,
    errorMessage: errors.destinationCenter,
    required: true
  }), /*#__PURE__*/_react["default"].createElement(ShipmentLogForm, {
    log: shipment.logs[logIndex],
    setLog: function setLog(name, value) {
      return handler.setLog(name, value, logIndex);
    },
    errors: errors.logs[logIndex],
    users: users
  }));
}
CreateShipment.propTypes = {
  // UI Control props
  show: _propTypes["default"].bool.isRequired,
  setShow: _propTypes["default"].func.isRequired,
  // Data prop: Contains containers and other data
  data: _propTypes["default"].shape({
    containers: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      specimenId: _propTypes["default"].number.isRequired
      // Add other container-specific properties if necessary
    })).isRequired
    // Add other data-specific properties if necessary
  }).isRequired,
  // Centers prop: Array of centers
  centers: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
  // Types prop: Array of shipment types
  types: _propTypes["default"].arrayOf(_propTypes["default"].shape({
    label: _propTypes["default"].string.isRequired
  })).isRequired,
  // Users prop: Array of users
  users: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
  // Functional props
  updateShipments: _propTypes["default"].func.isRequired,
  setData: _propTypes["default"].func.isRequired

  // Additional props based on errors
  // Ensure all necessary props are included
};

/**
 * React Component for a received shipment
 *
 * @param {object} props - The parameters
 * @param {object} props.shipment - the shipment
 * @param {object} props.users - the users for the dropdown
 * @param {function} props.updateShipments - an update callback
 * @param {function} props.setData - a callback for setting data
 * @return {JSX}
 */
function ReceiveShipment(_ref6) {
  var shipment = _ref6.shipment,
    users = _ref6.users,
    updateShipments = _ref6.updateShipments,
    setData = _ref6.setData;
  var handler = new _Shipment.UseShipment(shipment);
  var logIndex = handler.getShipment().logs.length - 1;
  var onSuccess = function onSuccess(_ref7) {
    var shipments = _ref7.shipments,
      containers = _ref7.containers;
    updateShipments(shipments);
    setData('containers', containers);
  };
  var onOpen = function onOpen() {
    handler.addLog({
      status: 'received',
      centerId: shipment.destinationCenterId
    });
  };

  // TODO: At the top of this form, it wouldn't hurt to have a ShipmentSummary
  // to display the pertinent information from the shipment!
  return /*#__PURE__*/_react["default"].createElement(TriggerableModal, {
    label: "Receive Shipment",
    title: 'Receive Shipment ' + shipment.barcode,
    onUserInput: onOpen,
    onSubmit: handler.post,
    onSuccess: onSuccess,
    onClose: handler.clear
  }, /*#__PURE__*/_react["default"].createElement(ShipmentLogForm, {
    log: handler.getShipment().logs[logIndex],
    setLog: function setLog(name, value) {
      return handler.setLog(name, value, logIndex);
    },
    errors: handler.getErrors().logs[logIndex],
    users: users
  }));
}
ReceiveShipment.propTypes = {
  // Shipment prop: Contains shipment details
  shipment: _propTypes["default"].shape({
    barcode: _propTypes["default"].string.isRequired,
    type: _propTypes["default"].string.isRequired,
    destinationCenterId: _propTypes["default"].number.isRequired,
    logs: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      centerId: _propTypes["default"].number,
      temperature: _propTypes["default"].number,
      date: _propTypes["default"].string,
      time: _propTypes["default"].string,
      user: _propTypes["default"].string,
      comments: _propTypes["default"].string
    })).isRequired
  }).isRequired,
  // Users prop: Array of users
  users: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
  // Functional props
  updateShipments: _propTypes["default"].func.isRequired,
  setData: _propTypes["default"].func.isRequired
};

/**
 * Return a form for the shipment log
 *
 * @param {object} props - the parameters
 * @param {object} props.log - the log
 * @param {function} props.setLog - a callback for when the log is set
 * @param {object} props.errors - a list of errors
 * @param {object} props.users - a list of selectable users
 * @return {JSX}
 */
function ShipmentLogForm(_ref8) {
  var log = _ref8.log,
    setLog = _ref8.setLog,
    _ref8$errors = _ref8.errors,
    errors = _ref8$errors === void 0 ? {} : _ref8$errors,
    users = _ref8.users;
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_Form.TextboxElement, {
    name: "temperature",
    label: "Temperature",
    onUserInput: setLog,
    value: log.temperature,
    errorMessage: errors.temperature,
    required: true
  }), /*#__PURE__*/_react["default"].createElement(_Form.DateElement, {
    name: "date",
    label: "Date",
    onUserInput: setLog,
    value: log.date,
    errorMessage: errors.date,
    required: true
  }), /*#__PURE__*/_react["default"].createElement(_Form.TimeElement, {
    name: "time",
    label: "Time",
    onUserInput: setLog,
    value: log.time,
    errorMessage: errors.time,
    required: true
  }), /*#__PURE__*/_react["default"].createElement(_Form.SelectElement, {
    name: "user",
    label: "Done by",
    onUserInput: setLog,
    value: log.user,
    options: users,
    errorMessage: errors.user,
    required: true
  }), /*#__PURE__*/_react["default"].createElement(_Form.TextareaElement, {
    name: "comments",
    label: "Comments",
    onUserInput: setLog,
    value: log.comments,
    errorMessage: errors.comments
  }));
}
ShipmentLogForm.propTypes = {
  // Log prop: Contains log details
  log: _propTypes["default"].shape({
    temperature: _propTypes["default"].number.isRequired,
    date: _propTypes["default"].string.isRequired,
    time: _propTypes["default"].string.isRequired,
    user: _propTypes["default"].string.isRequired,
    comments: _propTypes["default"].string
    // Add other log-specific properties if necessary
  }).isRequired,
  // Function to set log
  setLog: _propTypes["default"].func.isRequired,
  // Errors prop: Validation errors for log
  errors: _propTypes["default"].shape({
    temperature: _propTypes["default"].string,
    date: _propTypes["default"].string,
    time: _propTypes["default"].string,
    user: _propTypes["default"].string,
    comments: _propTypes["default"].string
    // Add other error-specific properties if necessary
  }).isRequired,
  // Users prop: Array of users
  users: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired
};
var _default = exports["default"] = ShipmentTab;

/***/ }),

/***/ "./modules/biobank/jsx/specimen.js":
/*!*****************************************!*\
  !*** ./modules/biobank/jsx/specimen.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js"));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js"));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _processForm = _interopRequireDefault(__webpack_require__(/*! ./processForm */ "./modules/biobank/jsx/processForm.js"));
var _Form = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");
var _helpers = __webpack_require__(/*! ./helpers.js */ "./modules/biobank/jsx/helpers.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
/**
 * Biobank Specimen
 *
 * @param  {object} props the props!
 * @return {JSX}
 */
function BiobankSpecimen(props) {
  var current = props.current,
    editable = props.editable,
    errors = props.errors,
    options = props.options,
    specimen = props.specimen,
    container = props.container;
  var addProcess = /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(process) {
      var newSpecimen;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              newSpecimen = (0, _helpers.clone)(specimen);
              newSpecimen[process] = {
                centerId: container.centerId
              };
              _context.next = 4;
              return props.editSpecimen(newSpecimen);
            case 4:
              props.edit(process);
            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return function addProcess(_x) {
      return _ref.apply(this, arguments);
    };
  }();
  var alterProcess = function alterProcess(process) {
    props.editSpecimen(specimen).then(function () {
      return props.edit(process);
    });
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "processing"
  }, /*#__PURE__*/_react["default"].createElement(Processes, {
    addProcess: addProcess,
    alterProcess: alterProcess,
    specimen: specimen,
    editable: editable,
    clearAll: props.clearAll,
    current: current,
    errors: errors,
    options: options,
    setCurrent: props.setCurrent,
    setSpecimen: props.setSpecimen,
    updateSpecimen: props.updateSpecimen
  }, /*#__PURE__*/_react["default"].createElement(ProcessPanel, {
    process: "collection"
  }), /*#__PURE__*/_react["default"].createElement(ProcessPanel, {
    process: "preparation"
  }), /*#__PURE__*/_react["default"].createElement(ProcessPanel, {
    process: "analysis"
  })));
}

// Specimen.propTypes
BiobankSpecimen.propTypes = {
  current: _propTypes["default"].shape({
    container: _propTypes["default"].shape({
      centerId: _propTypes["default"].number
    }).isRequired,
    specimen: _propTypes["default"].shape({
      // Define specimen-specific properties as needed
    }).isRequired
  }).isRequired,
  editable: _propTypes["default"].shape({
    // Define editable-specific properties as needed
  }).isRequired,
  errors: _propTypes["default"].shape({
    // Define errors-specific properties as needed
  }).isRequired,
  options: _propTypes["default"].shape({
    // Define options-specific properties as needed
  }).isRequired,
  specimen: _propTypes["default"].shape({
    // Define specimen-specific properties as needed
  }).isRequired,
  container: _propTypes["default"].shape({
    centerId: _propTypes["default"].number
  }).isRequired,
  editSpecimen: _propTypes["default"].func.isRequired,
  edit: _propTypes["default"].func.isRequired,
  clearAll: _propTypes["default"].func.isRequired,
  setCurrent: _propTypes["default"].func.isRequired,
  setSpecimen: _propTypes["default"].func.isRequired,
  updateSpecimen: _propTypes["default"].func.isRequired
};

/**
 * React component to display processes
 *
 * @param {object} props - React props
 * @return {JSX}
 */
function Processes(props) {
  return _react["default"].Children.map(props.children, function (child) {
    return /*#__PURE__*/_react["default"].cloneElement(child, _objectSpread({}, props));
  });
}

/**
 * React component to display a panel of processes
 *
 * @param {object} props - React props
 * @return {JSX}
 */
function ProcessPanel(props) {
  var editable = props.editable,
    process = props.process,
    current = props.current,
    specimen = props.specimen,
    options = props.options;
  var alterProcess = function alterProcess() {
    if (loris.userHasPermission('biobank_specimen_alter')) {
      return /*#__PURE__*/_react["default"].createElement("span", {
        className: editable[process] ? null : 'glyphicon glyphicon-pencil',
        onClick: editable[process] ? null : function () {
          return props.alterProcess(process);
        }
      });
    }
  };
  var cancelAlterProcess = function cancelAlterProcess() {
    if (editable[process]) {
      return /*#__PURE__*/_react["default"].createElement("a", {
        className: "pull-right",
        style: {
          cursor: 'pointer'
        },
        onClick: props.clearAll
      }, "Cancel");
    }
  };
  var protocolExists = Object.values(options.specimen.protocols).find(function (protocol) {
    return protocol.typeId == specimen.typeId && options.specimen.processes[protocol.processId].label == process.replace(/^\w/, function (c) {
      return c.toUpperCase();
    });
  });
  var panel = null;
  if (protocolExists && !specimen[process] && !editable[process] && loris.userHasPermission('biobank_specimen_edit')) {
    var addProcess = function addProcess() {
      return props.addProcess(process);
    };
    panel = /*#__PURE__*/_react["default"].createElement("div", {
      className: "panel specimen-panel inactive"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "add-process",
      onClick: addProcess
    }, /*#__PURE__*/_react["default"].createElement("span", {
      className: "glyphicon glyphicon-plus"
    })), /*#__PURE__*/_react["default"].createElement("div", null, "ADD ", process.toUpperCase()));
  }
  var form = /*#__PURE__*/_react["default"].createElement(_Form.FormElement, null, /*#__PURE__*/_react["default"].createElement(_processForm["default"], {
    current: current,
    errors: props.errors.specimen[process],
    edit: editable[process],
    specimen: current.specimen,
    options: options,
    process: editable[process] ? current.specimen[process] : specimen[process],
    processStage: process,
    setCurrent: props.setCurrent,
    setParent: props.setSpecimen,
    typeId: editable[process] ? current.specimen.typeId : specimen.typeId,
    updateSpecimen: props.updateSpecimen
  }));
  if (specimen[process] || editable[process]) {
    panel = /*#__PURE__*/_react["default"].createElement("div", {
      className: "panel specimen-panel panel-default"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "panel-heading"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: 'lifecycle-node ' + process
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "letter"
    }, process.charAt(0).toUpperCase())), /*#__PURE__*/_react["default"].createElement("div", {
      className: "title"
    }, process.replace(/^\w/, function (c) {
      return c.toUpperCase();
    })), alterProcess()), /*#__PURE__*/_react["default"].createElement("div", {
      className: "panel-body"
    }, form, cancelAlterProcess()));
  }
  return panel;
}
var _default = exports["default"] = BiobankSpecimen;

/***/ }),

/***/ "./modules/biobank/jsx/specimenForm.js":
/*!*********************************************!*\
  !*** ./modules/biobank/jsx/specimenForm.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js"));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/toConsumableArray.js"));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js"));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _processForm = _interopRequireDefault(__webpack_require__(/*! ./processForm */ "./modules/biobank/jsx/processForm.js"));
var _containerParentForm = _interopRequireDefault(__webpack_require__(/*! ./containerParentForm */ "./modules/biobank/jsx/containerParentForm.js"));
var _listForm = __webpack_require__(/*! ./listForm */ "./modules/biobank/jsx/listForm.js");
var _Modal = _interopRequireDefault(__webpack_require__(/*! Modal */ "./jsx/Modal.tsx"));
var _helpers = __webpack_require__(/*! ./helpers.js */ "./modules/biobank/jsx/helpers.js");
var _Form = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var initialState = {
  list: {},
  current: {
    container: {}
  },
  printBarcodes: false,
  errors: {
    specimen: {},
    container: {},
    list: {}
  }
};

/**
 * Biobank Collection Form
 *
 * Fetches data from Loris backend and displays a form allowing
 * to specimen a biobank file attached to a specific instrument
 */
var SpecimenForm = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(SpecimenForm, _React$Component);
  var _super = _createSuper(SpecimenForm);
  /**
   * Constructor
   */
  function SpecimenForm() {
    var _this;
    (0, _classCallCheck2["default"])(this, SpecimenForm);
    _this = _super.call(this);
    _this.state = initialState;
    _this.setList = _this.setList.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setCurrent = _this.setCurrent.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setContainer = _this.setContainer.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setProject = _this.setProject.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setSession = _this.setSession.bind((0, _assertThisInitialized2["default"])(_this));
    _this.generateBarcodes = _this.generateBarcodes.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleSubmit = _this.handleSubmit.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  /**
   * React lifecycle method
   *
   * @param {object} prevProps - the prior react props
   */
  (0, _createClass2["default"])(SpecimenForm, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      // If a parent specimen is provided, set the current global values.
      if (this.props.parent !== prevProps.parent) {
        var current = (0, _helpers.clone)(this.state.current);
        var specimen = this.props.parent[0].specimen;
        var container = this.props.parent[0].container;
        current.parentSpecimenIds = Object.values(this.props.parent).map(function (item) {
          return item.specimen.id;
        });
        current.candidateId = specimen.candidateId;
        current.sessionId = specimen.sessionId;
        current.typeId = specimen.typeId;
        current.originId = container.originId;
        current.centerId = container.centerId;
        if (this.props.parent > 1) {
          current.quantity = 0;
        }
        this.setState({
          current: current
        });
      }
    }

    /**
     * Set the current specimen
     *
     * @param {string} name - the name
     * @param {string} value - the value
     * @return {Promise}
     */
  }, {
    key: "setCurrent",
    value: function setCurrent(name, value) {
      var _this2 = this;
      var _clone = (0, _helpers.clone)(this.state),
        current = _clone.current;
      current[name] = value;
      return new Promise(function (res) {
        return _this2.setState({
          current: current
        }, res());
      });
    }

    /**
     * Set the current container
     *
     * @param {string} name - container name
     * @param {string} value - container value
     * @return {Promise}
     */
  }, {
    key: "setContainer",
    value: function setContainer(name, value) {
      var _this3 = this;
      var _clone2 = (0, _helpers.clone)(this.state),
        current = _clone2.current;
      current.container[name] = value;
      return new Promise(function (res) {
        return _this3.setState({
          current: current
        }, res());
      });
    }

    /**
     * Set a list in the object state?
     *
     * @param {object} list - a list of properties to set
     */
  }, {
    key: "setList",
    value: function setList(list) {
      this.setState({
        list: list
      });
    }

    /**
     * Set the current project
     *
     * @param {string} name - project name
     * @param {string} value - project value
     * @return {Promise}
     */
  }, {
    key: "setProject",
    value: function setProject(name, value) {
      var _this4 = this;
      var _clone3 = (0, _helpers.clone)(this.state),
        current = _clone3.current;
      current[name] = [value];
      return new Promise(function (res) {
        return _this4.setState({
          current: current
        }, res());
      });
    }

    /**
     * When a session is selected, set the sessionId, centerId and originId.
     *
     * @param {object} session
     * @param {number} sessionId
     */
  }, {
    key: "setSession",
    value: function setSession(session, sessionId) {
      var _clone4 = (0, _helpers.clone)(this.state),
        current = _clone4.current;
      current.centerId = this.props.options.sessionCenters[sessionId].centerId;
      current.originId = current.centerId;
      current.sessionId = sessionId;
      this.setState({
        current: current
      });
    }

    /**
     * Increment the current barcode
     *
     * @param {string} pscid - the PSCID
     * @param {number} increment - the amount to increment
     * @return {number}
     */
  }, {
    key: "incrementBarcode",
    value: function incrementBarcode(pscid) {
      var increment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      increment++;
      var barcode = (0, _helpers.padBarcode)(pscid, increment);
      if (Object.values(this.props.data.containers).some(function (container) {
        return container.barcode === barcode;
      })) {
        increment = this.incrementBarcode(pscid, increment);
      }
      if (Object.values(this.state.list).some(function (specimen) {
        return specimen.container.barcode === barcode;
      })) {
        increment = this.incrementBarcode(pscid, increment);
      }
      return increment;
    }

    /**
     * Fetch Barcodes from the backend.
     *
     * @param {number} limit - the number of barcodes to be generated
     * @return {array} an array of barcodes
     */
  }, {
    key: "fetchBarcodes",
    value: function () {
      var _fetchBarcodes = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(limit) {
        var response, data;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return fetch("".concat(loris.BaseURL, "/biobank/barcodes?limit=").concat(limit));
              case 3:
                response = _context.sent;
                _context.next = 6;
                return response.json();
              case 6:
                data = _context.sent;
                return _context.abrupt("return", data.barcodes);
              case 10:
                _context.prev = 10;
                _context.t0 = _context["catch"](0);
                console.error('Error fetching barcodes:', _context.t0);
                return _context.abrupt("return", []);
              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 10]]);
      }));
      function fetchBarcodes(_x) {
        return _fetchBarcodes.apply(this, arguments);
      }
      return fetchBarcodes;
    }()
    /**
     * Generate barcodes and store in the component state.
     */
  }, {
    key: "generateBarcodes",
    value: function () {
      var _generateBarcodes = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var list, limit, barcodes;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                list = this.state.list;
                limit = Object.keys(list).length;
                _context2.next = 4;
                return this.fetchBarcodes(limit);
              case 4:
                barcodes = _context2.sent;
                list = Object.keys(list).reduce(function (result, key, index) {
                  var specimen = list[key];
                  specimen.container.barcode = barcodes[index];
                  result[key] = specimen;
                  return result;
                }, {});
                this.setState({
                  list: list
                });
              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));
      function generateBarcodes() {
        return _generateBarcodes.apply(this, arguments);
      }
      return generateBarcodes;
    }()
    /**
     * Handle the submission of a form
     *
     * @return {Promise}
     */
  }, {
    key: "handleSubmit",
    value: function handleSubmit() {
      var _this5 = this;
      var _this$state = this.state,
        list = _this$state.list,
        current = _this$state.current,
        printBarcodes = _this$state.printBarcodes;
      return new Promise(function (resolve, reject) {
        _this5.props.onSubmit(list, current, printBarcodes).then(function () {
          return resolve();
        }, function (errors) {
          return _this5.setState({
            errors: errors
          }, reject());
        });
      });
    }

    /**
     * Render the React component
     *
     * @return {JSX}
     */
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;
      var _this$state2 = this.state,
        errors = _this$state2.errors,
        current = _this$state2.current,
        list = _this$state2.list;
      var _this$props = this.props,
        options = _this$props.options,
        data = _this$props.data,
        parent = _this$props.parent;
      var renderNote = function renderNote() {
        if (parent) {
          return /*#__PURE__*/React.createElement(_Form.StaticElement, {
            label: "Note",
            text: "To create new aliquots, enter a Barcode, fill out the coresponding sub-form and press Submit. Press \"New Entry\" button to add another barcode field, or press for the \"Copy\" button to duplicate the previous entry."
          });
        } else {
          return /*#__PURE__*/React.createElement(_Form.StaticElement, {
            label: "Note",
            text: "To create new specimens, first select a PSCID and Visit Label. Then, enter a Barcode, fill out the coresponding sub-form and press submit. Press \"New Entry\" button to add another barcode field, or press for the \"Copy\" button to duplicate the previous entry."
          });
        }
      };
      var renderGlobalFields = function renderGlobalFields() {
        if (parent && current.candidateId && current.sessionId) {
          var parentBarcodes = Object.values(parent).map(function (item) {
            return item.container.barcode;
          });
          var parentBarcodesString = parentBarcodes.join(', ');
          return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_Form.StaticElement, {
            label: "Parent Specimen(s)",
            text: parentBarcodesString
          }), /*#__PURE__*/React.createElement(_Form.StaticElement, {
            label: "PSCID",
            text: options.candidates[current.candidateId].pscid
          }), /*#__PURE__*/React.createElement(_Form.StaticElement, {
            label: "Visit Label",
            text: options.sessions[current.sessionId].label
          }));
        } else {
          var sessions = current.candidateId ? (0, _helpers.mapFormOptions)(options.candidateSessions[current.candidateId], 'label') : {};
          var candidates = (0, _helpers.mapFormOptions)(_this6.props.options.candidates, 'pscid');
          return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_Form.SearchableDropdown, {
            name: "candidateId",
            label: "PSCID",
            options: candidates,
            onUserInput: _this6.setCurrent,
            required: true,
            value: current.candidateId,
            placeHolder: "Search for a PSCID",
            errorMessage: errors.specimen.candidateId
          }), /*#__PURE__*/React.createElement(_Form.SelectElement, {
            name: "sessionId",
            label: "Visit Label",
            options: sessions,
            onUserInput: _this6.setSession,
            required: true,
            value: current.sessionId,
            disabled: current.candidateId ? false : true,
            errorMessage: errors.specimen.sessionId,
            autoSelect: true
          }));
        }
      };
      var renderRemainingQuantityFields = function renderRemainingQuantityFields() {
        if (parent) {
          if (loris.userHasPermission('biobank_specimen_edit') && parent.length === 1) {
            var specimenUnits = (0, _helpers.mapFormOptions)(_this6.props.options.specimen.units, 'label');
            return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_Form.TextboxElement, {
              name: "quantity",
              label: "Remaining Quantity",
              onUserInput: _this6.props.setSpecimen,
              required: true,
              value: _this6.props.current.specimen.quantity
            }), /*#__PURE__*/React.createElement(_Form.SelectElement, {
              name: "unitId",
              label: "Unit",
              options: specimenUnits,
              onUserInput: _this6.props.setSpecimen,
              required: true,
              value: _this6.props.current.specimen.unitId,
              autoSelect: true
            }));
          }
        }
      };

      // Container to be passed to the ContainerParentForm to generate displayed
      // placeholders for the position of the specimens to be created.
      var container = (0, _helpers.clone)(current.container);
      if (container.parentContainerId) {
        container.coordinate = [];
        Object.keys(list).reduce(function (coord, key) {
          coord = _this6.props.increaseCoordinate(coord, container.parentContainerId);
          var coordinates = [].concat((0, _toConsumableArray2["default"])(container.coordinate), [parseInt(coord)]);
          container.coordinate = coordinates;
          return coord;
        }, 0);
      }
      var placeHolder = {
        container: container
      };
      var handleClose = function handleClose() {
        return _this6.setState(initialState, _this6.props.onClose);
      };
      return /*#__PURE__*/React.createElement(_Modal["default"], {
        title: this.props.title,
        show: this.props.show,
        onClose: handleClose,
        onSubmit: this.handleSubmit,
        throwWarning: true
      }, /*#__PURE__*/React.createElement(_Form.FormElement, null, /*#__PURE__*/React.createElement("div", {
        className: "row"
      }, /*#__PURE__*/React.createElement("div", {
        className: "col-xs-11"
      }, renderNote(), renderGlobalFields(), /*#__PURE__*/React.createElement(_Form.SelectElement, {
        name: "projectIds",
        label: "Project",
        options: this.props.options.projects,
        onUserInput: this.setProject,
        required: true,
        value: current.projectIds,
        disabled: current.candidateId ? false : true,
        errorMessage: errors.specimen.projectIds
      }), renderRemainingQuantityFields())), /*#__PURE__*/React.createElement(_listForm.ListForm, {
        list: list,
        errors: errors.list,
        setList: this.setList,
        listItem: {
          container: {},
          collection: {}
        }
      }, /*#__PURE__*/React.createElement(SpecimenBarcodeForm, {
        typeId: current.typeId,
        options: options
      })), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", {
        className: "form-top"
      }), /*#__PURE__*/React.createElement(_containerParentForm["default"], {
        display: true,
        data: data,
        setContainer: this.setContainer,
        setCurrent: this.setCurrent,
        current: placeHolder,
        options: options
      }), /*#__PURE__*/React.createElement("div", {
        className: "form-top"
      }), /*#__PURE__*/React.createElement(_Form.ButtonElement, {
        name: "generate",
        label: "Generate Barcodes",
        type: "button",
        onUserInput: this.generateBarcodes,
        disabled: current.candidateId ? false : true
      }), /*#__PURE__*/React.createElement(_Form.CheckboxElement, {
        name: "printBarcodes",
        label: "Print Barcodes",
        onUserInput: function onUserInput(name, value) {
          return _this6.setState((0, _defineProperty2["default"])({}, name, value));
        },
        value: this.state.printBarcodes
      })));
    }
  }]);
  return SpecimenForm;
}(React.Component); // SpecimenForm.propTypes
SpecimenForm.propTypes = {
  // Parent prop: Array of parent objects containing specimen and container
  parent: _propTypes["default"].arrayOf(_propTypes["default"].shape({
    specimen: _propTypes["default"].shape({
      candidateId: _propTypes["default"].number,
      sessionId: _propTypes["default"].number,
      typeId: _propTypes["default"].number.isRequired
    }).isRequired,
    container: _propTypes["default"].shape({
      originId: _propTypes["default"].number,
      centerId: _propTypes["default"].number
    }).isRequired
  })).isRequired,
  // Options prop: Configuration options for specimen, containers, etc.
  options: _propTypes["default"].shape({
    sessionCenters: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      centerId: _propTypes["default"].number.isRequired
    })).isRequired,
    candidates: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
    sessions: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
    candidateSessions: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
    projects: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
    specimen: _propTypes["default"].shape({
      typeUnits: _propTypes["default"].string,
      units: _propTypes["default"].string.isRequired,
      types: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })).isRequired,
      typeContainerTypes: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
      protocols: _propTypes["default"].arrayOf(_propTypes["default"].string),
      protocolAttributes: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })),
      attributes: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      }))
    }).isRequired
  }).isRequired,
  // Data prop: Contains containers and specimens data
  data: _propTypes["default"].shape({
    containers: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      specimenId: _propTypes["default"].number.isRequired
    })).isRequired,
    specimens: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      specimenId: _propTypes["default"].number.isRequired
    })).isRequired,
    pools: _propTypes["default"].array.isRequired
  }).isRequired,
  // Functional props
  onSubmit: _propTypes["default"].func.isRequired,
  increaseCoordinate: _propTypes["default"].func.isRequired,
  createSpecimens: _propTypes["default"].func.isRequired,
  onClose: _propTypes["default"].func.isRequired,
  // UI Control props
  title: _propTypes["default"].string.isRequired,
  show: _propTypes["default"].bool.isRequired,
  // Current state props
  current: _propTypes["default"].shape({
    container: _propTypes["default"].shape({
      temperature: _propTypes["default"].number,
      statusId: _propTypes["default"].number.isRequired,
      comments: _propTypes["default"].string
    }).isRequired,
    specimen: _propTypes["default"].shape({
      quantity: _propTypes["default"].number,
      unitId: _propTypes["default"].number
    }).isRequired
  }).isRequired,
  // Setter and updater functions
  setSpecimen: _propTypes["default"].func.isRequired,
  setCurrent: _propTypes["default"].func.isRequired,
  clearAll: _propTypes["default"].func.isRequired,
  updateSpecimen: _propTypes["default"].func.isRequired,
  // Editable actions
  edit: _propTypes["default"].func.isRequired,
  editSpecimen: _propTypes["default"].func.isRequired,
  // Error handling props
  errors: _propTypes["default"].shape({
    container: _propTypes["default"].shape({
      typeId: _propTypes["default"].string,
      temperature: _propTypes["default"].string,
      statusId: _propTypes["default"].string,
      comments: _propTypes["default"].string
    }),
    specimen: _propTypes["default"].shape({
      quantity: _propTypes["default"].string,
      unitId: _propTypes["default"].string
      // Add other specimen-specific error properties if necessary
    })
  }).isRequired
};

/**
 * Biobank Barcode Form
 *
 * Acts a subform for BiobankSpecimenForm
 */
var SpecimenBarcodeForm = /*#__PURE__*/function (_React$Component2) {
  (0, _inherits2["default"])(SpecimenBarcodeForm, _React$Component2);
  var _super2 = _createSuper(SpecimenBarcodeForm);
  /**
   * Constructor
   */
  function SpecimenBarcodeForm() {
    var _this7;
    (0, _classCallCheck2["default"])(this, SpecimenBarcodeForm);
    _this7 = _super2.call(this);
    _this7.setContainer = _this7.setContainer.bind((0, _assertThisInitialized2["default"])(_this7));
    _this7.setSpecimen = _this7.setSpecimen.bind((0, _assertThisInitialized2["default"])(_this7));
    return _this7;
  }

  /**
   * Set the current container.
   *
   * @param {string} name - the name
   * @param {string} value - the value
   */
  (0, _createClass2["default"])(SpecimenBarcodeForm, [{
    key: "setContainer",
    value: function setContainer(name, value) {
      var container = this.props.item.container;
      container[name] = value;
      this.props.setListItem('container', container, this.props.itemKey);
    }

    /**
     * Set the specimen
     *
     * @param {string} name - a name
     * @param {string} value - a value
     */
  }, {
    key: "setSpecimen",
    value: function setSpecimen(name, value) {
      this.props.setListItem(name, value, this.props.itemKey);
    }

    /**
     * Render the React component
     *
     * @return {JSX}
     */
  }, {
    key: "render",
    value: function render() {
      var _this8 = this;
      var _this$props2 = this.props,
        options = _this$props2.options,
        errors = _this$props2.errors,
        item = _this$props2.item;

      // XXX: Only allow the selection of child types
      var renderSpecimenTypes = function renderSpecimenTypes() {
        var specimenTypes;
        if (_this8.props.typeId) {
          specimenTypes = Object.entries(options.specimen.types).reduce(function (result, _ref) {
            var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
              id = _ref2[0],
              type = _ref2[1];
            if (id == _this8.props.typeId) {
              result[id] = type;
            }
            if (type.parentTypeIds) {
              type.parentTypeIds.forEach(function (i) {
                if (i == _this8.props.typeId) {
                  result[id] = type;
                }
              });
            }
            return result;
          }, {});
        } else {
          specimenTypes = options.specimen.types;
        }
        return (0, _helpers.mapFormOptions)(specimenTypes, 'label');
      };
      var containerTypesPrimary = (0, _helpers.mapFormOptions)(options.container.typesPrimary, 'label');
      var validContainers = {};
      if (item.typeId && options.specimen.typeContainerTypes[item.typeId]) {
        Object.keys(containerTypesPrimary).forEach(function (id) {
          options.specimen.typeContainerTypes[item.typeId].forEach(function (i) {
            if (id == i) {
              validContainers[id] = containerTypesPrimary[id];
            }
          });
        });
      }
      return /*#__PURE__*/React.createElement(_listForm.ListItem, this.props, /*#__PURE__*/React.createElement(_Form.TextboxElement, {
        name: "barcode",
        label: "Barcode",
        onUserInput: this.setContainer,
        required: true,
        value: item.container.barcode,
        errorMessage: (errors.container || {}).barcode
      }), /*#__PURE__*/React.createElement(_Form.SelectElement, {
        name: "typeId",
        label: "Specimen Type",
        options: renderSpecimenTypes(),
        onUserInput: this.setSpecimen,
        required: true,
        value: item.typeId,
        errorMessage: (errors.specimen || {}).typeId
      }), /*#__PURE__*/React.createElement(_Form.SelectElement, {
        name: "typeId",
        label: "Container Type",
        options: item.typeId ? validContainers : containerTypesPrimary,
        onUserInput: this.setContainer,
        required: true,
        value: item.container.typeId,
        errorMessage: (errors.container || {}).typeId,
        autoSelect: true
      }), /*#__PURE__*/React.createElement(_Form.TextboxElement, {
        name: "lotNumber",
        label: "Lot Number",
        onUserInput: this.setContainer,
        value: item.container.lotNumber,
        errorMessage: (errors.container || {}).lotNumber
      }), /*#__PURE__*/React.createElement(_Form.DateElement, {
        name: "expirationDate",
        label: "Expiration Date",
        onUserInput: this.setContainer,
        value: item.container.expirationDate,
        errorMessage: (errors.container || {}).expirationDate
      }), /*#__PURE__*/React.createElement(_processForm["default"], {
        edit: true,
        errors: (errors.specimen || {}).collection,
        options: options,
        process: item.collection,
        processStage: "collection",
        setParent: this.setSpecimen,
        typeId: item.typeId
      }));
    }
  }]);
  return SpecimenBarcodeForm;
}(React.Component); // SpecimenBarcodeForm.propTypes
SpecimenBarcodeForm.propTypes = {
  typeId: _propTypes["default"].number,
  // Item prop: Contains container and specimen information
  item: _propTypes["default"].shape({
    container: _propTypes["default"].shape({
      barcode: _propTypes["default"].string.isRequired,
      typeId: _propTypes["default"].number.isRequired,
      lotNumber: _propTypes["default"].string,
      expirationDate: _propTypes["default"].string
    }).isRequired,
    typeId: _propTypes["default"].number.isRequired,
    collection: _propTypes["default"].string
  }).isRequired,
  // Functional props
  setListItem: _propTypes["default"].func.isRequired,
  validateListItem: _propTypes["default"].func.isRequired,
  // Key prop for list items
  itemKey: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]).isRequired,
  // Options prop: Configuration options for container and specimen
  options: _propTypes["default"].shape({
    container: _propTypes["default"].shape({
      typesPrimary: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired
    }).isRequired,
    specimen: _propTypes["default"].shape({
      typeContainerTypes: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
      types: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })).isRequired
    }).isRequired
  }).isRequired,
  // Errors prop: Handles validation errors for container and specimen
  errors: _propTypes["default"].shape({
    container: _propTypes["default"].shape({}),
    specimen: _propTypes["default"].shape({})
  }).isRequired
};
var _default = exports["default"] = SpecimenForm;

/***/ }),

/***/ "./modules/biobank/jsx/specimenTab.js":
/*!********************************************!*\
  !*** ./modules/biobank/jsx/specimenTab.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _helpers = __webpack_require__(/*! ./helpers.js */ "./modules/biobank/jsx/helpers.js");
var _FilterableDataTable = _interopRequireDefault(__webpack_require__(/*! FilterableDataTable */ "./jsx/FilterableDataTable.js"));
var _specimenForm = _interopRequireDefault(__webpack_require__(/*! ./specimenForm */ "./modules/biobank/jsx/specimenForm.js"));
var _poolSpecimenForm = _interopRequireDefault(__webpack_require__(/*! ./poolSpecimenForm */ "./modules/biobank/jsx/poolSpecimenForm.js"));
var _batchProcessForm = _interopRequireDefault(__webpack_require__(/*! ./batchProcessForm */ "./modules/biobank/jsx/batchProcessForm.js"));
var _batchEditForm = _interopRequireDefault(__webpack_require__(/*! ./batchEditForm */ "./modules/biobank/jsx/batchEditForm.js"));
var _search = _interopRequireDefault(__webpack_require__(/*! ./search */ "./modules/biobank/jsx/search.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * JSX Component representing the specimen tab of the biobank
 * module.
 */
var SpecimenTab = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(SpecimenTab, _Component);
  var _super = _createSuper(SpecimenTab);
  /**
   * Constructor for SpecimenTab
   */
  function SpecimenTab() {
    var _this;
    (0, _classCallCheck2["default"])(this, SpecimenTab);
    _this = _super.call(this);
    _this.state = {
      editable: {}
    };
    _this.edit = _this.edit.bind((0, _assertThisInitialized2["default"])(_this));
    _this.clearEditable = _this.clearEditable.bind((0, _assertThisInitialized2["default"])(_this));
    _this.mapSpecimenColumns = _this.mapSpecimenColumns.bind((0, _assertThisInitialized2["default"])(_this));
    _this.formatSpecimenColumns = _this.formatSpecimenColumns.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  /**
   * Make the form editable
   *
   * @param {object} stateKey - the key holding the state
   * @return {Promise}
   */
  (0, _createClass2["default"])(SpecimenTab, [{
    key: "edit",
    value: function edit(stateKey) {
      var _this2 = this;
      var _clone = (0, _helpers.clone)(this.state),
        editable = _clone.editable;
      editable[stateKey] = true;
      return new Promise(function (res) {
        return _this2.setState({
          editable: editable
        }, res());
      });
    }

    /**
     * Clear the editable state of this tab.
     */
  }, {
    key: "clearEditable",
    value: function clearEditable() {
      this.setState({
        editable: {}
      });
    }

    /**
     * Map a specimen id to a string value for display.
     *
     * @param {string} column - the column name being mapped
     * @param {string} value - the value being mapped
     * @return {string}
     */
  }, {
    key: "mapSpecimenColumns",
    value: function mapSpecimenColumns(column, value) {
      var options = this.props.options;
      switch (column) {
        case 'Type':
          return options.specimen.types[value].label;
        case 'Container Type':
          return options.container.typesPrimary[value].label;
        case 'Diagnosis':
          if (value) {
            return value.map(function (id) {
              return options.diagnoses[id].label;
            });
          }
          break;
        case 'Status':
          return options.container.stati[value].label;
        case 'Current Site':
          return options.centers[value];
        case 'Draw Site':
          return options.centers[value];
        case 'Projects':
          return value.map(function (id) {
            return options.projects[id];
          });
        default:
          return value;
      }
    }

    /**
     * Format columns for a specimen row
     *
     * @param {string} column - the column name being mapped
     * @param {string} value - the value being mapped
     * @param {array} row - an array of the row values
     * @return {JSX}
     */
  }, {
    key: "formatSpecimenColumns",
    value: function formatSpecimenColumns(column, value, row) {
      var _this$props = this.props,
        data = _this$props.data,
        options = _this$props.options;
      value = this.mapSpecimenColumns(column, value);
      var candidate = Object.values(options.candidates).find(function (cand) {
        return (cand === null || cand === void 0 ? void 0 : cand.pscid) == row['PSCID'];
      });
      var candidatePermission = candidate !== undefined;
      switch (column) {
        case 'Barcode':
          return /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Link, {
            to: "/barcode=".concat(value)
          }, value));
        case 'Parent Specimens':
          // TODO: if the user doesn't have access then these shouldn't be hyperlinked
          var barcodes = value && value.map(function (id, key) {
            return /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Link, {
              key: key,
              to: "/barcode=".concat(value)
            }, value);
          }).reduce(function (prev, curr) {
            return [prev, ', ', curr];
          });
          return /*#__PURE__*/_react["default"].createElement("td", null, barcodes);
        case 'PSCID':
          if (candidatePermission) {
            return /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement("a", {
              href: loris.BaseURL + '/' + candidate.id
            }, value));
          }
          return /*#__PURE__*/_react["default"].createElement("td", null, value);
        case 'Visit Label':
          if (candidatePermission) {
            var ses = Object.values(options.candidateSessions[candidate.id]).find(function (sess) {
              return sess.label == value;
            }).id;
            var visitLabelURL = loris.BaseURL + '/instrument_list/?candID=' + candidate.id + '&sessionID=' + ses;
            return /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement("a", {
              href: visitLabelURL
            }, value));
          }
          return /*#__PURE__*/_react["default"].createElement("td", null, value);
        case 'Status':
          var style = {};
          switch (value) {
            case 'Available':
              style.color = 'green';
              break;
            case 'Reserved':
              style.color = 'orange';
              break;
            case 'Dispensed':
              style.color = 'red';
              break;
            case 'Discarded':
              style.color = 'red';
              break;
          }
          return /*#__PURE__*/_react["default"].createElement("td", {
            style: style
          }, value);
        case 'Projects':
          return /*#__PURE__*/_react["default"].createElement("td", null, value.join(', '));
        case 'Container Barcode':
          // check if container has be queried
          if (Object.values(data.containers).find(function (container) {
            return container.barcode == value;
          })) {
            return /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Link, {
              to: "/barcode=".concat(value)
            }, value));
          }
          return /*#__PURE__*/_react["default"].createElement("td", null, value);
        default:
          return /*#__PURE__*/_react["default"].createElement("td", null, value);
      }
    }

    /**
     * Render the React component
     *
     * @return {JSX}
     */
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      var editable = this.state.editable;
      var _this$props2 = this.props,
        data = _this$props2.data,
        options = _this$props2.options;
      var barcodesPrimary = Object.values(data.containers).reduce(function (result, container) {
        if (options.container.types[container.typeId].primary == 1) {
          result[container.id] = container.barcode;
        }
        return result;
      }, {});
      var specimenTypes = (0, _helpers.mapFormOptions)(options.specimen.types, 'label');
      var containerTypesPrimary = (0, _helpers.mapFormOptions)(options.container.typesPrimary, 'label');
      var stati = (0, _helpers.mapFormOptions)(options.container.stati, 'label');
      var diagnoses = (0, _helpers.mapFormOptions)(options.diagnoses, 'label');
      var specimenData = Object.values(data.specimens).map(function (specimen) {
        var _options$sessionCente;
        var container = data.containers[specimen.containerId];
        var specimenAttributeData = [];
        Object.keys(options.specimen.processAttributes).forEach(function (processId) {
          Object.keys(options.specimen.processAttributes[processId]).forEach(function (attributeId) {
            var sopt = options.specimen;
            var process = sopt.processes[processId].label.toLowerCase();
            if ((specimen[process] || {}).data) {
              var processIdStr = specimen[process].protocolId.toString();
              var attrs = options.specimen.processAttributes;
              var protocols = attrs[processId][attributeId].protocolIds;
              if (protocols.includes(processIdStr)) {
                var _data = specimen[process].data[attributeId];
                specimenAttributeData.push(_data);
              } else {
                specimenAttributeData.push(null);
              }
            }
          });
        });
        var candidate = options.candidates[specimen.candidateId];
        return [specimen.barcode, specimen.typeId, container.typeId, specimen.quantity + ' ' + options.specimen.units[specimen.unitId].label, specimen.fTCycle || null, specimen.parentSpecimenBarcodes, specimen.candidatePSCID, (candidate === null || candidate === void 0 ? void 0 : candidate.sex) || null, specimen.candidateAge, (candidate === null || candidate === void 0 ? void 0 : candidate.diagnosisIds) || null, options.sessions[specimen.sessionId].label, specimen.poolId ? (data.pools[specimen.poolId] || {}).label : null, container.statusId, specimen.projectIds, specimen.centerId, (_options$sessionCente = options.sessionCenters[specimen.sessionId]) === null || _options$sessionCente === void 0 ? void 0 : _options$sessionCente.centerId, specimen.collection.date, specimen.collection.time, (specimen.preparation || {}).time, container.parentContainerBarcode, container.coordinate].concat(specimenAttributeData);
      });
      var specimenAttributeFields = [];
      Object.keys(options.specimen.processAttributes).forEach(function (processId) {
        Object.keys(options.specimen.processAttributes[processId]).forEach(function (attributeId) {
          specimenAttributeFields.push({
            label: options.specimen.attributes[attributeId].label,
            show: true
          });
        });
      });
      var fields = [{
        label: 'Barcode',
        show: true,
        filter: {
          name: 'barcode',
          type: 'text'
        }
      }, {
        label: 'Type',
        show: true,
        filter: {
          name: 'type',
          type: 'select',
          options: specimenTypes
        }
      }, {
        label: 'Container Type',
        show: true,
        filter: {
          name: 'containerType',
          type: 'select',
          options: containerTypesPrimary
        }
      }, {
        label: 'Quantity',
        show: true
      }, {
        label: 'F/T Cycle',
        show: false,
        filter: {
          name: 'fTCycle',
          type: 'text',
          hide: true
        }
      }, {
        label: 'Parent Specimen(s)',
        show: false,
        filter: {
          name: 'parentSpecimens',
          type: 'text',
          hide: true
        }
      }, {
        label: 'PSCID',
        show: true,
        filter: {
          name: 'pscid',
          type: 'text'
        }
      }, {
        label: 'Sex',
        show: true,
        filter: {
          name: 'sex',
          type: 'select',
          options: {
            Male: 'Male',
            Female: 'Female'
          }
        }
      }, {
        label: 'Age at Collection',
        show: true,
        filter: {
          name: 'age',
          type: 'number'
        }
      }, {
        label: 'Diagnosis',
        show: true,
        filter: {
          name: 'diagnosis',
          type: 'multiselect',
          options: diagnoses
        }
      }, {
        label: 'Visit Label',
        show: true,
        filter: {
          name: 'session',
          type: 'text'
        }
      }, {
        label: 'Pool',
        show: false,
        filter: {
          name: 'pool',
          type: 'text',
          hide: true
        }
      }, {
        label: 'Status',
        show: true,
        filter: {
          name: 'status',
          type: 'select',
          options: stati
        }
      }, {
        label: 'Projects',
        show: true,
        filter: {
          name: 'projects',
          type: 'multiselect',
          options: options.projects
        }
      }, {
        label: 'Current Site',
        show: true,
        filter: {
          name: 'currentSite',
          type: 'select',
          options: options.centers
        }
      }, {
        label: 'Draw Site',
        show: true,
        filter: {
          name: 'drawSite',
          type: 'select',
          options: options.centers
        }
      }, {
        label: 'Collection Date',
        show: true,
        filter: {
          name: 'collectionDate',
          type: 'date'
        }
      }, {
        label: 'Collection Time',
        show: true,
        filter: {
          name: 'collectionTime',
          type: 'text'
        }
      }, {
        label: 'Preparation Time',
        show: true,
        filter: {
          name: 'preparationTime',
          type: 'text'
        }
      }, {
        label: 'Container Barcode',
        show: true,
        filter: {
          name: 'containerBarcode',
          type: 'text'
        }
      }, {
        label: 'Coordinate',
        show: true
      }].concat(specimenAttributeFields);
      var openSearchSpecimen = function openSearchSpecimen() {
        return _this3.edit('searchSpecimen');
      };
      var openSpecimenForm = function openSpecimenForm() {
        return _this3.edit('specimenForm');
      };
      var openPoolForm = function openPoolForm() {
        return _this3.edit('poolSpecimenForm');
      };
      var openBatchProcessForm = function openBatchProcessForm() {
        return _this3.edit('batchProcessForm');
      };
      var openBatchEditForm = function openBatchEditForm() {
        return _this3.edit('batchEditForm');
      };
      var actions = [{
        name: 'goToSpecimen',
        label: 'Go To Specimen',
        action: openSearchSpecimen
      }, {
        name: 'addSpecimen',
        label: 'Add Specimen',
        action: openSpecimenForm
      }, {
        name: 'poolSpecimen',
        label: 'Pool Specimens',
        action: openPoolForm
      }, {
        name: 'batchProcess',
        label: 'Process Specimens',
        action: openBatchProcessForm
      }, {
        name: 'batchEdit',
        label: 'Edit Specimens',
        action: openBatchEditForm
      }];
      return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_FilterableDataTable["default"], {
        name: "specimen",
        data: specimenData,
        fields: fields,
        actions: actions,
        getFormattedCell: this.formatSpecimenColumns,
        getMappedCell: this.mapSpecimenColumns,
        progress: this.props.loading
      }), /*#__PURE__*/_react["default"].createElement(_search["default"], {
        title: "Go To Specimen",
        show: editable.searchSpecimen,
        onClose: this.clearEditable,
        barcodes: barcodesPrimary,
        history: this.props.history
      }), loris.userHasPermission('biobank_specimen_create') ? /*#__PURE__*/_react["default"].createElement(_specimenForm["default"], {
        title: "Add New Specimen",
        options: options,
        data: data,
        increaseCoordinate: this.props.increaseCoordinate,
        show: editable.specimenForm,
        onClose: this.clearEditable,
        onSubmit: this.props.createSpecimens
      }) : null, loris.userHasPermission('biobank_pool_create') ? /*#__PURE__*/_react["default"].createElement(_poolSpecimenForm["default"], {
        options: this.props.options,
        data: this.props.data,
        show: editable.poolSpecimenForm,
        onClose: this.clearEditable,
        onSubmit: this.props.createPool
      }) : null, loris.userHasPermission('biobank_specimen_edit') ? /*#__PURE__*/_react["default"].createElement(_batchProcessForm["default"], {
        show: editable.batchProcessForm,
        onClose: this.clearEditable,
        onSubmit: this.props.updateSpecimens,
        options: this.props.options,
        data: this.props.data
      }) : null, loris.userHasPermission('biobank_specimen_edit') ? /*#__PURE__*/_react["default"].createElement(_batchEditForm["default"], {
        show: editable.batchEditForm,
        onClose: this.clearEditable,
        onSubmit: this.props.editSpecimens,
        options: this.props.options,
        data: this.props.data
      }) : null);
    }
  }]);
  return SpecimenTab;
}(_react.Component);
SpecimenTab.propTypes = {
  options: _propTypes["default"].shape({
    specimen: _propTypes["default"].shape({
      attributes: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })),
      units: _propTypes["default"].string,
      // Added based on errors
      types: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })).isRequired,
      processes: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })),
      processAttributes: _propTypes["default"].arrayOf(_propTypes["default"].arrayOf(_propTypes["default"].shape({
        protocolIds: _propTypes["default"].arrayOf(_propTypes["default"].number)
      }))),
      typeContainerTypes: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired // Added based on previous propTypes
    }).isRequired,
    container: _propTypes["default"].shape({
      types: _propTypes["default"].obj,
      typesPrimary: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })).isRequired,
      stati: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        label: _propTypes["default"].string.isRequired
      })).isRequired
    }).isRequired,
    diagnoses: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      label: _propTypes["default"].string.isRequired
    })),
    centers: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
    projects: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
    candidates: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
    sessions: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
    sessionCenters: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      centerId: _propTypes["default"].number.isRequired
    })),
    candidateSessions: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired
  }).isRequired,
  // Data prop: Contains containers, specimens, and pools data
  data: _propTypes["default"].shape({
    containers: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      specimenId: _propTypes["default"].number.isRequired,
      statusId: _propTypes["default"].number,
      // Added based on error
      temperature: _propTypes["default"].number,
      // Added based on error
      comments: _propTypes["default"].string // Added based on error
      // Add other container-specific properties if necessary
    })).isRequired,
    specimens: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      specimenId: _propTypes["default"].number.isRequired
      // Add other specimen-specific properties if necessary
    })).isRequired,
    pools: _propTypes["default"].array.isRequired
  }).isRequired,
  // Functional props
  onSubmit: _propTypes["default"].func.isRequired,
  increaseCoordinate: _propTypes["default"].func.isRequired,
  createSpecimens: _propTypes["default"].func.isRequired,
  createPool: _propTypes["default"].func.isRequired,
  updateSpecimens: _propTypes["default"].func.isRequired,
  editSpecimens: _propTypes["default"].func.isRequired,
  // UI Control props
  title: _propTypes["default"].string.isRequired,
  show: _propTypes["default"].bool.isRequired,
  // History prop: For navigation
  history: _propTypes["default"].shape({
    push: _propTypes["default"].func.isRequired
  }).isRequired,
  // Current state props
  current: _propTypes["default"].shape({
    specimen: _propTypes["default"].shape({
      quantity: _propTypes["default"].number,
      unitId: _propTypes["default"].number
      // Add other specimen-specific properties if necessary
    }).isRequired,
    container: _propTypes["default"].shape({
      statusId: _propTypes["default"].number.isRequired,
      temperature: _propTypes["default"].number,
      comments: _propTypes["default"].string
      // Add other container-specific properties if necessary
    }).isRequired
  }).isRequired,
  // Errors prop: Handles validation errors
  errors: _propTypes["default"].shape({
    container: _propTypes["default"].shape({
      typeId: _propTypes["default"].string,
      temperature: _propTypes["default"].string,
      statusId: _propTypes["default"].string,
      comments: _propTypes["default"].string
    }),
    specimen: _propTypes["default"].shape({
      quantity: _propTypes["default"].string,
      unitId: _propTypes["default"].string
      // Add other specimen-specific error properties if necessary
    })
  }).isRequired,
  // Additional props based on errors
  loading: _propTypes["default"].bool.isRequired
};
var _default = exports["default"] = SpecimenTab;

/***/ }),

/***/ "./jsx/Loader.tsx":
/*!************************!*\
  !*** ./jsx/Loader.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {

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

/***/ }),

/***/ "./jsx/Modal.tsx":
/*!***********************!*\
  !*** ./jsx/Modal.tsx ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

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
var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var react_1 = __webpack_require__(/*! react */ "react");
var sweetalert2_1 = __importDefault(__webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js"));
var Loader_1 = __importDefault(__webpack_require__(/*! ./Loader */ "./jsx/Loader.tsx"));
var Form_1 = __webpack_require__(/*! jsx/Form */ "./jsx/Form.js");
/**
 * Modal Component
 *
 * A React functional component that renders a modal dialog with optional
 * form submission and loading indicators. Supports asynchronous form submission
 * with loading and success feedback.
 *
 * @param {ModalProps} props - Properties for the modal component
 * @returns {JSX.Element} - A modal dialog box w/ optional submit functionality
 */
var Modal = function Modal(_a) {
  var _b = _a.throwWarning,
    throwWarning = _b === void 0 ? false : _b,
    _c = _a.show,
    show = _c === void 0 ? false : _c,
    onClose = _a.onClose,
    onSubmit = _a.onSubmit,
    onSuccess = _a.onSuccess,
    title = _a.title,
    children = _a.children;
  var _d = __read((0, react_1.useState)(false), 2),
    loading = _d[0],
    setLoading = _d[1]; // Tracks loading during submit
  var _e = __read((0, react_1.useState)(false), 2),
    success = _e[0],
    setSuccess = _e[1]; // Tracks success after submit
  /**
   * Handles modal close event. Shows a confirmation if `throwWarning` is true.
   */
  var handleClose = function handleClose() {
    if (throwWarning) {
      // Display warning if enabled
      sweetalert2_1["default"].fire({
        title: 'Are You Sure?',
        text: 'Leaving the form will result in the loss of any information ' + 'entered.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Proceed',
        cancelButtonText: 'Cancel'
      }).then(function (result) {
        return result.value && onClose();
      });
    } else {
      onClose(); // Close immediately if no warning
    }
  };
  /**
   * Manages form submission with loading and success states, calling
   * `onSubmit` and handling modal state based on success or failure.
   */
  var handleSubmit = function handleSubmit() {
    return __awaiter(void 0, void 0, void 0, function () {
      var data, _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            if (!onSubmit) return [2 /*return*/]; // Ensure onSubmit exists
            setLoading(true); // Show loader
            _b.label = 1;
          case 1:
            _b.trys.push([1, 4,, 5]);
            return [4 /*yield*/, onSubmit()];
          case 2:
            data = _b.sent();
            setLoading(false);
            setSuccess(true); // Show success
            return [4 /*yield*/, new Promise(function (resolve) {
              return setTimeout(resolve, 2000);
            })];
          case 3:
            _b.sent(); // Close delay
            setSuccess(false); // Reset success state
            onClose(); // Close modal
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(data); // call onSuccess if defined
            return [3 /*break*/, 5];
          case 4:
            _a = _b.sent();
            setLoading(false);
            return [3 /*break*/, 5];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  /**
   * Renders submit button if `onSubmit` is provided and no loading or success.
   *
   * @returns {JSX.Element | undefined} - The submit button if conditions are met
   */
  var submitButton = function submitButton() {
    if (onSubmit && !(loading || success)) {
      // Show button if conditions met
      return /*#__PURE__*/React.createElement("div", {
        style: submitStyle
      }, /*#__PURE__*/React.createElement(Form_1.ButtonElement, {
        onUserInput: handleSubmit
      }));
    }
  };
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
    padding: success ? 0 : '15px 15px',
    maxHeight: success ? 0 : '75vh',
    overflow: 'scroll',
    opacity: success ? 0 : 1,
    transition: '1s ease, opacity 0.3s'
  };
  var modalContainer = {
    display: 'block',
    position: 'fixed',
    zIndex: 9999,
    paddingTop: '100px',
    paddingBottom: '100px',
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
    width: '700px',
    boxShadow: '0 4px 8px 0 rbga(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)',
    transition: '0.4s ease'
  };
  var footerStyle = {
    borderTop: '1px solid #DDDDDD',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: '40px',
    padding: '35px',
    backgroundColor: success ? '#e0ffec' : undefined
  };
  var submitStyle = {
    marginLeft: 'auto',
    marginRight: '20px'
  };
  var processStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    margin: '0px auto',
    width: '90px'
  };
  /**
   * Loader element displayed during form submission.
   */
  var loader = loading && /*#__PURE__*/React.createElement("div", {
    style: processStyle
  }, /*#__PURE__*/React.createElement(Loader_1["default"], {
    size: 20
  }), /*#__PURE__*/React.createElement("h5", {
    className: "animate-flicker"
  }, "Saving"));
  /**
   * Success display element shown after successful form submission.
   */
  var successDisplay = success && /*#__PURE__*/React.createElement("div", {
    style: processStyle
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'green',
      marginBottom: '2px'
    },
    className: "glyphicon glyphicon-ok-circle"
  }), /*#__PURE__*/React.createElement("h5", null, "Success!"));
  return /*#__PURE__*/React.createElement("div", {
    style: modalContainer,
    onClick: handleClose
  }, /*#__PURE__*/React.createElement("div", {
    style: modalContent,
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: headerStyle
  }, title, /*#__PURE__*/React.createElement("span", {
    style: glyphStyle,
    onClick: handleClose
  }, "\xD7")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: bodyStyle
  }, show && children), /*#__PURE__*/React.createElement("div", {
    style: footerStyle
  }, loader, successDisplay, submitButton()))));
};
exports["default"] = Modal;

/***/ }),

/***/ "./jsx/form/DateTimePartialElement.tsx":
/*!*********************************************!*\
  !*** ./jsx/form/DateTimePartialElement.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


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
var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var react_1 = __webpack_require__(/*! react */ "react");
var InputLabel_1 = __importDefault(__webpack_require__(/*! jsx/form/InputLabel */ "./jsx/form/InputLabel.tsx"));
var format = 'YYYY-MM-DD hh:mm:ss';
/**
 * Check if a character is a digit.
 *
 * @param character The character to check
 * @returns The result of the check
 */
function isDigit(character) {
  return character >= '0' && character <= '9';
}
/**
 * Check if a character is a letter.
 *
 * @param character A character to check
 * @returns The result of the check
 */
function isLetter(character) {
  return character >= 'A' && character <= 'Z' || character >= 'a' && character <= 'z';
}
/**
 * Insert a string inside another string at a given index.
 *
 * @param string The string in which the substring is to be inserted
 * @param index The index at which to insert the substring
 * @param other The substring to insert
 * @returns The new string
 */
function stringInsert(string, index, other) {
  return string.slice(0, index) + other + string.slice(index);
}
/**
 * Checks if a value matches the datetime format, formatting it if necessary.
 *
 * @param oldDateTime The old value of the input (which is valid)
 * @param newDateTime The new value of the input (which may be invalid)
 * @returns The formatted new value, or `null` if the new value is invalid
 */
function formatDatetime(oldDateTime, newDateTime) {
  for (var i = 0; i < newDateTime.length; i++) {
    // Check that the new value is no longer than the format.
    // This check is done inside the loop because the value might grow during
    // formatting.
    if (i >= format.length) {
      return null;
    }
    // Check that each new value character matches that expected from the
    // format.
    var valueChar = newDateTime[i];
    var formatChar = format[i];
    if (isLetter(formatChar)) {
      if (!isDigit(valueChar)) {
        return null;
      }
    } else {
      if (isDigit(valueChar)) {
        newDateTime = stringInsert(newDateTime, i, formatChar);
      } else if (valueChar !== formatChar) {
        return null;
      }
    }
  }
  // If a character was added, add a special character if it is expected from
  // the format.
  if (newDateTime.length > oldDateTime.length && newDateTime.length < format.length) {
    var nextChar = format[newDateTime.length];
    if (!isLetter(nextChar)) {
      newDateTime += nextChar;
    }
  }
  // If a character was removed, remove a special character if it is expected
  // from the format.
  if (newDateTime.length < oldDateTime.length && newDateTime.length > 0) {
    var prevChar = format[newDateTime.length - 1];
    if (!isLetter(prevChar)) {
      newDateTime = newDateTime.slice(0, -1);
    }
  }
  return newDateTime;
}
/**
 * React component for an input datetime mask.
 *
 * @param props The props of the component
 * @param props.value
 * @param props.children
 * @returns The corresponding React element
 */
var Mask = function Mask(_a) {
  var value = _a.value,
    children = _a.children;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, children, /*#__PURE__*/React.createElement("div", {
    className: "form-control",
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      boxShadow: 'none',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'monospace',
      color: '#777777',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    }
  }, "\xA0".repeat(value.length), format.slice(value.length))));
};
/**
 * Datetime input (down to the second) React component
 * Compared to the standard HTML input, this input accepts incomplete datetimes
 * (useful for filtering).
 *
 * @param props The props of the component
 * @returns The corresponding React element
 */
var DateTimePartialElement = function DateTimePartialElement(props) {
  var _a;
  var onUserInput = props.onUserInput !== undefined ? props.onUserInput : function () {
    return console.warn('onUserInput() callback is not set');
  };
  var _b = __read((0, react_1.useState)((_a = props.value) !== null && _a !== void 0 ? _a : ''), 2),
    value = _b[0],
    setValue = _b[1];
  /**
   * Handle a change in the input.
   *
   * @param e The React event.
   */
  function handleChange(e) {
    var rawValue = e.target.value.replace(/[- :]/g, '');
    var newValue = formatDatetime(value, rawValue);
    if (newValue === null) {
      return;
    }
    setValue(newValue);
    onUserInput(props.name, newValue);
  }
  var errorMessage = null;
  var elementClass = 'row form-group';
  if (props.required && value == '') {
    errorMessage = /*#__PURE__*/React.createElement("span", null, "This field is required");
    elementClass += ' has-error';
  } else if (props.errorMessage) {
    errorMessage = /*#__PURE__*/React.createElement("span", null, props.errorMessage);
    elementClass += ' has-error';
  }
  var wrapperClass = props.label ? 'col-sm-9' : 'col-sm-12';
  return /*#__PURE__*/React.createElement("div", {
    className: elementClass
  }, props.label && /*#__PURE__*/React.createElement(InputLabel_1["default"], {
    label: props.label,
    required: props.required
  }), /*#__PURE__*/React.createElement("div", {
    className: wrapperClass
  }, /*#__PURE__*/React.createElement(Mask, {
    value: value
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    name: props.name,
    id: props.id,
    onChange: handleChange,
    value: value,
    required: props.required,
    disabled: props.disabled,
    style: {
      fontFamily: 'monospace'
    }
  })), errorMessage));
};
exports["default"] = DateTimePartialElement;

/***/ }),

/***/ "./jsx/form/InputLabel.tsx":
/*!*********************************!*\
  !*** ./jsx/form/InputLabel.tsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
/**
 * Input label React component
 *
 * @param props The props of the component
 * @param props.label
 * @param props.required
 * @returns The corresponding React element
 */
var InputLabel = function InputLabel(_a) {
  var label = _a.label,
    required = _a.required;
  return /*#__PURE__*/React.createElement("label", {
    className: "col-sm-3 control-label",
    htmlFor: label
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*"));
};
exports["default"] = InputLabel;

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

/***/ "./node_modules/history/esm/history.js":
/*!*********************************************!*\
  !*** ./node_modules/history/esm/history.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createBrowserHistory: () => (/* binding */ createBrowserHistory),
/* harmony export */   createHashHistory: () => (/* binding */ createHashHistory),
/* harmony export */   createLocation: () => (/* binding */ createLocation),
/* harmony export */   createMemoryHistory: () => (/* binding */ createMemoryHistory),
/* harmony export */   createPath: () => (/* binding */ createPath),
/* harmony export */   locationsAreEqual: () => (/* binding */ locationsAreEqual),
/* harmony export */   parsePath: () => (/* binding */ parsePath)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var resolve_pathname__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! resolve-pathname */ "./node_modules/resolve-pathname/esm/resolve-pathname.js");
/* harmony import */ var value_equal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! value-equal */ "./node_modules/value-equal/esm/value-equal.js");
/* harmony import */ var tiny_warning__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! tiny-warning */ "./node_modules/tiny-warning/dist/tiny-warning.esm.js");
/* harmony import */ var tiny_invariant__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tiny-invariant */ "./node_modules/tiny-invariant/dist/esm/tiny-invariant.js");






function addLeadingSlash(path) {
  return path.charAt(0) === '/' ? path : '/' + path;
}
function stripLeadingSlash(path) {
  return path.charAt(0) === '/' ? path.substr(1) : path;
}
function hasBasename(path, prefix) {
  return path.toLowerCase().indexOf(prefix.toLowerCase()) === 0 && '/?#'.indexOf(path.charAt(prefix.length)) !== -1;
}
function stripBasename(path, prefix) {
  return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
}
function stripTrailingSlash(path) {
  return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
}
function parsePath(path) {
  var pathname = path || '/';
  var search = '';
  var hash = '';
  var hashIndex = pathname.indexOf('#');

  if (hashIndex !== -1) {
    hash = pathname.substr(hashIndex);
    pathname = pathname.substr(0, hashIndex);
  }

  var searchIndex = pathname.indexOf('?');

  if (searchIndex !== -1) {
    search = pathname.substr(searchIndex);
    pathname = pathname.substr(0, searchIndex);
  }

  return {
    pathname: pathname,
    search: search === '?' ? '' : search,
    hash: hash === '#' ? '' : hash
  };
}
function createPath(location) {
  var pathname = location.pathname,
      search = location.search,
      hash = location.hash;
  var path = pathname || '/';
  if (search && search !== '?') path += search.charAt(0) === '?' ? search : "?" + search;
  if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : "#" + hash;
  return path;
}

function createLocation(path, state, key, currentLocation) {
  var location;

  if (typeof path === 'string') {
    // Two-arg form: push(path, state)
    location = parsePath(path);
    location.state = state;
  } else {
    // One-arg form: push(location)
    location = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, path);
    if (location.pathname === undefined) location.pathname = '';

    if (location.search) {
      if (location.search.charAt(0) !== '?') location.search = '?' + location.search;
    } else {
      location.search = '';
    }

    if (location.hash) {
      if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash;
    } else {
      location.hash = '';
    }

    if (state !== undefined && location.state === undefined) location.state = state;
  }

  try {
    location.pathname = decodeURI(location.pathname);
  } catch (e) {
    if (e instanceof URIError) {
      throw new URIError('Pathname "' + location.pathname + '" could not be decoded. ' + 'This is likely caused by an invalid percent-encoding.');
    } else {
      throw e;
    }
  }

  if (key) location.key = key;

  if (currentLocation) {
    // Resolve incomplete/relative pathname relative to current location.
    if (!location.pathname) {
      location.pathname = currentLocation.pathname;
    } else if (location.pathname.charAt(0) !== '/') {
      location.pathname = (0,resolve_pathname__WEBPACK_IMPORTED_MODULE_1__["default"])(location.pathname, currentLocation.pathname);
    }
  } else {
    // When there is no prior location and pathname is empty, set it to /
    if (!location.pathname) {
      location.pathname = '/';
    }
  }

  return location;
}
function locationsAreEqual(a, b) {
  return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && (0,value_equal__WEBPACK_IMPORTED_MODULE_2__["default"])(a.state, b.state);
}

function createTransitionManager() {
  var prompt = null;

  function setPrompt(nextPrompt) {
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_4__["default"])(prompt == null, 'A history supports only one prompt at a time') : 0;
    prompt = nextPrompt;
    return function () {
      if (prompt === nextPrompt) prompt = null;
    };
  }

  function confirmTransitionTo(location, action, getUserConfirmation, callback) {
    // TODO: If another transition starts while we're still confirming
    // the previous one, we may end up in a weird state. Figure out the
    // best way to handle this.
    if (prompt != null) {
      var result = typeof prompt === 'function' ? prompt(location, action) : prompt;

      if (typeof result === 'string') {
        if (typeof getUserConfirmation === 'function') {
          getUserConfirmation(result, callback);
        } else {
           true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_4__["default"])(false, 'A history needs a getUserConfirmation function in order to use a prompt message') : 0;
          callback(true);
        }
      } else {
        // Return false from a transition hook to cancel the transition.
        callback(result !== false);
      }
    } else {
      callback(true);
    }
  }

  var listeners = [];

  function appendListener(fn) {
    var isActive = true;

    function listener() {
      if (isActive) fn.apply(void 0, arguments);
    }

    listeners.push(listener);
    return function () {
      isActive = false;
      listeners = listeners.filter(function (item) {
        return item !== listener;
      });
    };
  }

  function notifyListeners() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    listeners.forEach(function (listener) {
      return listener.apply(void 0, args);
    });
  }

  return {
    setPrompt: setPrompt,
    confirmTransitionTo: confirmTransitionTo,
    appendListener: appendListener,
    notifyListeners: notifyListeners
  };
}

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
function getConfirmation(message, callback) {
  callback(window.confirm(message)); // eslint-disable-line no-alert
}
/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
 */

function supportsHistory() {
  var ua = window.navigator.userAgent;
  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) return false;
  return window.history && 'pushState' in window.history;
}
/**
 * Returns true if browser fires popstate on hash change.
 * IE10 and IE11 do not.
 */

function supportsPopStateOnHashChange() {
  return window.navigator.userAgent.indexOf('Trident') === -1;
}
/**
 * Returns false if using go(n) with hash history causes a full page reload.
 */

function supportsGoWithoutReloadUsingHash() {
  return window.navigator.userAgent.indexOf('Firefox') === -1;
}
/**
 * Returns true if a given popstate event is an extraneous WebKit event.
 * Accounts for the fact that Chrome on iOS fires real popstate events
 * containing undefined state when pressing the back button.
 */

function isExtraneousPopstateEvent(event) {
  return event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
}

var PopStateEvent = 'popstate';
var HashChangeEvent = 'hashchange';

function getHistoryState() {
  try {
    return window.history.state || {};
  } catch (e) {
    // IE 11 sometimes throws when accessing window.history.state
    // See https://github.com/ReactTraining/history/pull/289
    return {};
  }
}
/**
 * Creates a history object that uses the HTML5 history API including
 * pushState, replaceState, and the popstate event.
 */


function createBrowserHistory(props) {
  if (props === void 0) {
    props = {};
  }

  !canUseDOM ?  true ? (0,tiny_invariant__WEBPACK_IMPORTED_MODULE_3__["default"])(false, 'Browser history needs a DOM') : 0 : void 0;
  var globalHistory = window.history;
  var canUseHistory = supportsHistory();
  var needsHashChangeListener = !supportsPopStateOnHashChange();
  var _props = props,
      _props$forceRefresh = _props.forceRefresh,
      forceRefresh = _props$forceRefresh === void 0 ? false : _props$forceRefresh,
      _props$getUserConfirm = _props.getUserConfirmation,
      getUserConfirmation = _props$getUserConfirm === void 0 ? getConfirmation : _props$getUserConfirm,
      _props$keyLength = _props.keyLength,
      keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;
  var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';

  function getDOMLocation(historyState) {
    var _ref = historyState || {},
        key = _ref.key,
        state = _ref.state;

    var _window$location = window.location,
        pathname = _window$location.pathname,
        search = _window$location.search,
        hash = _window$location.hash;
    var path = pathname + search + hash;
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_4__["default"])(!basename || hasBasename(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".') : 0;
    if (basename) path = stripBasename(path, basename);
    return createLocation(path, state, key);
  }

  function createKey() {
    return Math.random().toString(36).substr(2, keyLength);
  }

  var transitionManager = createTransitionManager();

  function setState(nextState) {
    (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])(history, nextState);

    history.length = globalHistory.length;
    transitionManager.notifyListeners(history.location, history.action);
  }

  function handlePopState(event) {
    // Ignore extraneous popstate events in WebKit.
    if (isExtraneousPopstateEvent(event)) return;
    handlePop(getDOMLocation(event.state));
  }

  function handleHashChange() {
    handlePop(getDOMLocation(getHistoryState()));
  }

  var forceNextPop = false;

  function handlePop(location) {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      var action = 'POP';
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (ok) {
          setState({
            action: action,
            location: location
          });
        } else {
          revertPop(location);
        }
      });
    }
  }

  function revertPop(fromLocation) {
    var toLocation = history.location; // TODO: We could probably make this more reliable by
    // keeping a list of keys we've seen in sessionStorage.
    // Instead, we just default to 0 for keys we don't know.

    var toIndex = allKeys.indexOf(toLocation.key);
    if (toIndex === -1) toIndex = 0;
    var fromIndex = allKeys.indexOf(fromLocation.key);
    if (fromIndex === -1) fromIndex = 0;
    var delta = toIndex - fromIndex;

    if (delta) {
      forceNextPop = true;
      go(delta);
    }
  }

  var initialLocation = getDOMLocation(getHistoryState());
  var allKeys = [initialLocation.key]; // Public interface

  function createHref(location) {
    return basename + createPath(location);
  }

  function push(path, state) {
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_4__["default"])(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' + 'argument is a location-like object that already has state; it is ignored') : 0;
    var action = 'PUSH';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var href = createHref(location);
      var key = location.key,
          state = location.state;

      if (canUseHistory) {
        globalHistory.pushState({
          key: key,
          state: state
        }, null, href);

        if (forceRefresh) {
          window.location.href = href;
        } else {
          var prevIndex = allKeys.indexOf(history.location.key);
          var nextKeys = allKeys.slice(0, prevIndex + 1);
          nextKeys.push(location.key);
          allKeys = nextKeys;
          setState({
            action: action,
            location: location
          });
        }
      } else {
         true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_4__["default"])(state === undefined, 'Browser history cannot push state in browsers that do not support HTML5 history') : 0;
        window.location.href = href;
      }
    });
  }

  function replace(path, state) {
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_4__["default"])(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' + 'argument is a location-like object that already has state; it is ignored') : 0;
    var action = 'REPLACE';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var href = createHref(location);
      var key = location.key,
          state = location.state;

      if (canUseHistory) {
        globalHistory.replaceState({
          key: key,
          state: state
        }, null, href);

        if (forceRefresh) {
          window.location.replace(href);
        } else {
          var prevIndex = allKeys.indexOf(history.location.key);
          if (prevIndex !== -1) allKeys[prevIndex] = location.key;
          setState({
            action: action,
            location: location
          });
        }
      } else {
         true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_4__["default"])(state === undefined, 'Browser history cannot replace state in browsers that do not support HTML5 history') : 0;
        window.location.replace(href);
      }
    });
  }

  function go(n) {
    globalHistory.go(n);
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  var listenerCount = 0;

  function checkDOMListeners(delta) {
    listenerCount += delta;

    if (listenerCount === 1 && delta === 1) {
      window.addEventListener(PopStateEvent, handlePopState);
      if (needsHashChangeListener) window.addEventListener(HashChangeEvent, handleHashChange);
    } else if (listenerCount === 0) {
      window.removeEventListener(PopStateEvent, handlePopState);
      if (needsHashChangeListener) window.removeEventListener(HashChangeEvent, handleHashChange);
    }
  }

  var isBlocked = false;

  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }

    var unblock = transitionManager.setPrompt(prompt);

    if (!isBlocked) {
      checkDOMListeners(1);
      isBlocked = true;
    }

    return function () {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(-1);
      }

      return unblock();
    };
  }

  function listen(listener) {
    var unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);
    return function () {
      checkDOMListeners(-1);
      unlisten();
    };
  }

  var history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    block: block,
    listen: listen
  };
  return history;
}

var HashChangeEvent$1 = 'hashchange';
var HashPathCoders = {
  hashbang: {
    encodePath: function encodePath(path) {
      return path.charAt(0) === '!' ? path : '!/' + stripLeadingSlash(path);
    },
    decodePath: function decodePath(path) {
      return path.charAt(0) === '!' ? path.substr(1) : path;
    }
  },
  noslash: {
    encodePath: stripLeadingSlash,
    decodePath: addLeadingSlash
  },
  slash: {
    encodePath: addLeadingSlash,
    decodePath: addLeadingSlash
  }
};

function stripHash(url) {
  var hashIndex = url.indexOf('#');
  return hashIndex === -1 ? url : url.slice(0, hashIndex);
}

function getHashPath() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var hashIndex = href.indexOf('#');
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
}

function pushHashPath(path) {
  window.location.hash = path;
}

function replaceHashPath(path) {
  window.location.replace(stripHash(window.location.href) + '#' + path);
}

function createHashHistory(props) {
  if (props === void 0) {
    props = {};
  }

  !canUseDOM ?  true ? (0,tiny_invariant__WEBPACK_IMPORTED_MODULE_3__["default"])(false, 'Hash history needs a DOM') : 0 : void 0;
  var globalHistory = window.history;
  var canGoWithoutReload = supportsGoWithoutReloadUsingHash();
  var _props = props,
      _props$getUserConfirm = _props.getUserConfirmation,
      getUserConfirmation = _props$getUserConfirm === void 0 ? getConfirmation : _props$getUserConfirm,
      _props$hashType = _props.hashType,
      hashType = _props$hashType === void 0 ? 'slash' : _props$hashType;
  var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';
  var _HashPathCoders$hashT = HashPathCoders[hashType],
      encodePath = _HashPathCoders$hashT.encodePath,
      decodePath = _HashPathCoders$hashT.decodePath;

  function getDOMLocation() {
    var path = decodePath(getHashPath());
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_4__["default"])(!basename || hasBasename(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".') : 0;
    if (basename) path = stripBasename(path, basename);
    return createLocation(path);
  }

  var transitionManager = createTransitionManager();

  function setState(nextState) {
    (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])(history, nextState);

    history.length = globalHistory.length;
    transitionManager.notifyListeners(history.location, history.action);
  }

  var forceNextPop = false;
  var ignorePath = null;

  function locationsAreEqual$$1(a, b) {
    return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash;
  }

  function handleHashChange() {
    var path = getHashPath();
    var encodedPath = encodePath(path);

    if (path !== encodedPath) {
      // Ensure we always have a properly-encoded hash.
      replaceHashPath(encodedPath);
    } else {
      var location = getDOMLocation();
      var prevLocation = history.location;
      if (!forceNextPop && locationsAreEqual$$1(prevLocation, location)) return; // A hashchange doesn't always == location change.

      if (ignorePath === createPath(location)) return; // Ignore this change; we already setState in push/replace.

      ignorePath = null;
      handlePop(location);
    }
  }

  function handlePop(location) {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      var action = 'POP';
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (ok) {
          setState({
            action: action,
            location: location
          });
        } else {
          revertPop(location);
        }
      });
    }
  }

  function revertPop(fromLocation) {
    var toLocation = history.location; // TODO: We could probably make this more reliable by
    // keeping a list of paths we've seen in sessionStorage.
    // Instead, we just default to 0 for paths we don't know.

    var toIndex = allPaths.lastIndexOf(createPath(toLocation));
    if (toIndex === -1) toIndex = 0;
    var fromIndex = allPaths.lastIndexOf(createPath(fromLocation));
    if (fromIndex === -1) fromIndex = 0;
    var delta = toIndex - fromIndex;

    if (delta) {
      forceNextPop = true;
      go(delta);
    }
  } // Ensure the hash is encoded properly before doing anything else.


  var path = getHashPath();
  var encodedPath = encodePath(path);
  if (path !== encodedPath) replaceHashPath(encodedPath);
  var initialLocation = getDOMLocation();
  var allPaths = [createPath(initialLocation)]; // Public interface

  function createHref(location) {
    var baseTag = document.querySelector('base');
    var href = '';

    if (baseTag && baseTag.getAttribute('href')) {
      href = stripHash(window.location.href);
    }

    return href + '#' + encodePath(basename + createPath(location));
  }

  function push(path, state) {
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_4__["default"])(state === undefined, 'Hash history cannot push state; it is ignored') : 0;
    var action = 'PUSH';
    var location = createLocation(path, undefined, undefined, history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var path = createPath(location);
      var encodedPath = encodePath(basename + path);
      var hashChanged = getHashPath() !== encodedPath;

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a PUSH, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path;
        pushHashPath(encodedPath);
        var prevIndex = allPaths.lastIndexOf(createPath(history.location));
        var nextPaths = allPaths.slice(0, prevIndex + 1);
        nextPaths.push(path);
        allPaths = nextPaths;
        setState({
          action: action,
          location: location
        });
      } else {
         true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_4__["default"])(false, 'Hash history cannot PUSH the same path; a new entry will not be added to the history stack') : 0;
        setState();
      }
    });
  }

  function replace(path, state) {
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_4__["default"])(state === undefined, 'Hash history cannot replace state; it is ignored') : 0;
    var action = 'REPLACE';
    var location = createLocation(path, undefined, undefined, history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var path = createPath(location);
      var encodedPath = encodePath(basename + path);
      var hashChanged = getHashPath() !== encodedPath;

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a REPLACE, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path;
        replaceHashPath(encodedPath);
      }

      var prevIndex = allPaths.indexOf(createPath(history.location));
      if (prevIndex !== -1) allPaths[prevIndex] = path;
      setState({
        action: action,
        location: location
      });
    });
  }

  function go(n) {
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_4__["default"])(canGoWithoutReload, 'Hash history go(n) causes a full page reload in this browser') : 0;
    globalHistory.go(n);
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  var listenerCount = 0;

  function checkDOMListeners(delta) {
    listenerCount += delta;

    if (listenerCount === 1 && delta === 1) {
      window.addEventListener(HashChangeEvent$1, handleHashChange);
    } else if (listenerCount === 0) {
      window.removeEventListener(HashChangeEvent$1, handleHashChange);
    }
  }

  var isBlocked = false;

  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }

    var unblock = transitionManager.setPrompt(prompt);

    if (!isBlocked) {
      checkDOMListeners(1);
      isBlocked = true;
    }

    return function () {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(-1);
      }

      return unblock();
    };
  }

  function listen(listener) {
    var unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);
    return function () {
      checkDOMListeners(-1);
      unlisten();
    };
  }

  var history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    block: block,
    listen: listen
  };
  return history;
}

function clamp(n, lowerBound, upperBound) {
  return Math.min(Math.max(n, lowerBound), upperBound);
}
/**
 * Creates a history object that stores locations in memory.
 */


function createMemoryHistory(props) {
  if (props === void 0) {
    props = {};
  }

  var _props = props,
      getUserConfirmation = _props.getUserConfirmation,
      _props$initialEntries = _props.initialEntries,
      initialEntries = _props$initialEntries === void 0 ? ['/'] : _props$initialEntries,
      _props$initialIndex = _props.initialIndex,
      initialIndex = _props$initialIndex === void 0 ? 0 : _props$initialIndex,
      _props$keyLength = _props.keyLength,
      keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;
  var transitionManager = createTransitionManager();

  function setState(nextState) {
    (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])(history, nextState);

    history.length = history.entries.length;
    transitionManager.notifyListeners(history.location, history.action);
  }

  function createKey() {
    return Math.random().toString(36).substr(2, keyLength);
  }

  var index = clamp(initialIndex, 0, initialEntries.length - 1);
  var entries = initialEntries.map(function (entry) {
    return typeof entry === 'string' ? createLocation(entry, undefined, createKey()) : createLocation(entry, undefined, entry.key || createKey());
  }); // Public interface

  var createHref = createPath;

  function push(path, state) {
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_4__["default"])(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' + 'argument is a location-like object that already has state; it is ignored') : 0;
    var action = 'PUSH';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var prevIndex = history.index;
      var nextIndex = prevIndex + 1;
      var nextEntries = history.entries.slice(0);

      if (nextEntries.length > nextIndex) {
        nextEntries.splice(nextIndex, nextEntries.length - nextIndex, location);
      } else {
        nextEntries.push(location);
      }

      setState({
        action: action,
        location: location,
        index: nextIndex,
        entries: nextEntries
      });
    });
  }

  function replace(path, state) {
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_4__["default"])(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' + 'argument is a location-like object that already has state; it is ignored') : 0;
    var action = 'REPLACE';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      history.entries[history.index] = location;
      setState({
        action: action,
        location: location
      });
    });
  }

  function go(n) {
    var nextIndex = clamp(history.index + n, 0, history.entries.length - 1);
    var action = 'POP';
    var location = history.entries[nextIndex];
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (ok) {
        setState({
          action: action,
          location: location,
          index: nextIndex
        });
      } else {
        // Mimic the behavior of DOM histories by
        // causing a render after a cancelled POP.
        setState();
      }
    });
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  function canGo(n) {
    var nextIndex = history.index + n;
    return nextIndex >= 0 && nextIndex < history.entries.length;
  }

  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }

    return transitionManager.setPrompt(prompt);
  }

  function listen(listener) {
    return transitionManager.appendListener(listener);
  }

  var history = {
    length: entries.length,
    action: 'POP',
    location: entries[index],
    index: index,
    entries: entries,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    canGo: canGo,
    block: block,
    listen: listen
  };
  return history;
}




/***/ }),

/***/ "./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var reactIs = __webpack_require__(/*! react-is */ "./node_modules/react-is/index.js");

/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
var REACT_STATICS = {
  childContextTypes: true,
  contextType: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  getDerivedStateFromError: true,
  getDerivedStateFromProps: true,
  mixins: true,
  propTypes: true,
  type: true
};
var KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
};
var FORWARD_REF_STATICS = {
  '$$typeof': true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
};
var MEMO_STATICS = {
  '$$typeof': true,
  compare: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true
};
var TYPE_STATICS = {};
TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;

function getStatics(component) {
  // React v16.11 and below
  if (reactIs.isMemo(component)) {
    return MEMO_STATICS;
  } // React v16.12 and above


  return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
}

var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = Object.prototype;
function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
  if (typeof sourceComponent !== 'string') {
    // don't hoist over string (html) components
    if (objectPrototype) {
      var inheritedComponent = getPrototypeOf(sourceComponent);

      if (inheritedComponent && inheritedComponent !== objectPrototype) {
        hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
      }
    }

    var keys = getOwnPropertyNames(sourceComponent);

    if (getOwnPropertySymbols) {
      keys = keys.concat(getOwnPropertySymbols(sourceComponent));
    }

    var targetStatics = getStatics(targetComponent);
    var sourceStatics = getStatics(sourceComponent);

    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];

      if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
        var descriptor = getOwnPropertyDescriptor(sourceComponent, key);

        try {
          // Avoid failures from read-only properties
          defineProperty(targetComponent, key, descriptor);
        } catch (e) {}
      }
    }
  }

  return targetComponent;
}

module.exports = hoistNonReactStatics;


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

/***/ "./node_modules/path-to-regexp/index.js":
/*!**********************************************!*\
  !*** ./node_modules/path-to-regexp/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isarray = __webpack_require__(/*! isarray */ "./node_modules/path-to-regexp/node_modules/isarray/index.js")

/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp
module.exports.parse = parse
module.exports.compile = compile
module.exports.tokensToFunction = tokensToFunction
module.exports.tokensToRegExp = tokensToRegExp

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = []
  var key = 0
  var index = 0
  var path = ''
  var defaultDelimiter = options && options.delimiter || '/'
  var res

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0]
    var escaped = res[1]
    var offset = res.index
    path += str.slice(index, offset)
    index = offset + m.length

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1]
      continue
    }

    var next = str[index]
    var prefix = res[2]
    var name = res[3]
    var capture = res[4]
    var group = res[5]
    var modifier = res[6]
    var asterisk = res[7]

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path)
      path = ''
    }

    var partial = prefix != null && next != null && next !== prefix
    var repeat = modifier === '+' || modifier === '*'
    var optional = modifier === '?' || modifier === '*'
    var delimiter = prefix || defaultDelimiter
    var pattern = capture || group
    var prevText = prefix || (typeof tokens[tokens.length - 1] === 'string' ? tokens[tokens.length - 1] : '')

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : restrictBacktrack(delimiter, prevText))
    })
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index)
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path)
  }

  return tokens
}

function restrictBacktrack(delimiter, prevText) {
  if (!prevText || prevText.indexOf(delimiter) > -1) {
    return '[^' + escapeString(delimiter) + ']+?'
  }

  return escapeString(prevText) + '|(?:(?!' + escapeString(prevText) + ')[^' + escapeString(delimiter) + '])+?'
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options), options)
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens, options) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length)

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$', flags(options))
    }
  }

  return function (obj, opts) {
    var path = ''
    var data = obj || {}
    var options = opts || {}
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]

      if (typeof token === 'string') {
        path += token

        continue
      }

      var value = data[token.name]
      var segment

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j])

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value)

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options && options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g)

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      })
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = []

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source)
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options)
    keys = []
  }

  options = options || {}

  var strict = options.strict
  var end = options.end !== false
  var route = ''

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]

    if (typeof token === 'string') {
      route += escapeString(token)
    } else {
      var prefix = escapeString(token.prefix)
      var capture = '(?:' + token.pattern + ')'

      keys.push(token)

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*'
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?'
        } else {
          capture = prefix + '(' + capture + ')?'
        }
      } else {
        capture = prefix + '(' + capture + ')'
      }

      route += capture
    }
  }

  var delimiter = escapeString(options.delimiter || '/')
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?'
  }

  if (end) {
    route += '$'
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)'
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options)
    keys = []
  }

  options = options || {}

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}


/***/ }),

/***/ "./node_modules/path-to-regexp/node_modules/isarray/index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/path-to-regexp/node_modules/isarray/index.js ***!
  \*******************************************************************/
/***/ ((module) => {

module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
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

/***/ "./node_modules/react-router-dom/esm/react-router-dom.js":
/*!***************************************************************!*\
  !*** ./node_modules/react-router-dom/esm/react-router-dom.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BrowserRouter: () => (/* binding */ BrowserRouter),
/* harmony export */   HashRouter: () => (/* binding */ HashRouter),
/* harmony export */   Link: () => (/* binding */ Link),
/* harmony export */   MemoryRouter: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_0__.MemoryRouter),
/* harmony export */   NavLink: () => (/* binding */ NavLink),
/* harmony export */   Prompt: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_0__.Prompt),
/* harmony export */   Redirect: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_0__.Redirect),
/* harmony export */   Route: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_0__.Route),
/* harmony export */   Router: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_0__.Router),
/* harmony export */   StaticRouter: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_0__.StaticRouter),
/* harmony export */   Switch: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_0__.Switch),
/* harmony export */   generatePath: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_0__.generatePath),
/* harmony export */   matchPath: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_0__.matchPath),
/* harmony export */   useHistory: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_0__.useHistory),
/* harmony export */   useLocation: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_0__.useLocation),
/* harmony export */   useParams: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_0__.useParams),
/* harmony export */   useRouteMatch: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_0__.useRouteMatch),
/* harmony export */   withRouter: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_0__.withRouter)
/* harmony export */ });
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-router */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var history__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! history */ "./node_modules/history/esm/history.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var tiny_warning__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! tiny-warning */ "./node_modules/tiny-warning/dist/tiny-warning.esm.js");
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_helpers_esm_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectWithoutPropertiesLoose */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js");
/* harmony import */ var tiny_invariant__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tiny-invariant */ "./node_modules/tiny-invariant/dist/esm/tiny-invariant.js");











/**
 * The public API for a <Router> that uses HTML5 history.
 */

var BrowserRouter = /*#__PURE__*/function (_React$Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(BrowserRouter, _React$Component);

  function BrowserRouter() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.history = (0,history__WEBPACK_IMPORTED_MODULE_6__.createBrowserHistory)(_this.props);
    return _this;
  }

  var _proto = BrowserRouter.prototype;

  _proto.render = function render() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement(react_router__WEBPACK_IMPORTED_MODULE_0__.Router, {
      history: this.history,
      children: this.props.children
    });
  };

  return BrowserRouter;
}((react__WEBPACK_IMPORTED_MODULE_2___default().Component));

if (true) {
  BrowserRouter.propTypes = {
    basename: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().string),
    children: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().node),
    forceRefresh: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().bool),
    getUserConfirmation: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().func),
    keyLength: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().number)
  };

  BrowserRouter.prototype.componentDidMount = function () {
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_8__["default"])(!this.props.history, "<BrowserRouter> ignores the history prop. To use a custom history, " + "use `import { Router }` instead of `import { BrowserRouter as Router }`.") : 0;
  };
}

/**
 * The public API for a <Router> that uses window.location.hash.
 */

var HashRouter = /*#__PURE__*/function (_React$Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(HashRouter, _React$Component);

  function HashRouter() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.history = (0,history__WEBPACK_IMPORTED_MODULE_6__.createHashHistory)(_this.props);
    return _this;
  }

  var _proto = HashRouter.prototype;

  _proto.render = function render() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement(react_router__WEBPACK_IMPORTED_MODULE_0__.Router, {
      history: this.history,
      children: this.props.children
    });
  };

  return HashRouter;
}((react__WEBPACK_IMPORTED_MODULE_2___default().Component));

if (true) {
  HashRouter.propTypes = {
    basename: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().string),
    children: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().node),
    getUserConfirmation: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().func),
    hashType: prop_types__WEBPACK_IMPORTED_MODULE_7___default().oneOf(["hashbang", "noslash", "slash"])
  };

  HashRouter.prototype.componentDidMount = function () {
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_8__["default"])(!this.props.history, "<HashRouter> ignores the history prop. To use a custom history, " + "use `import { Router }` instead of `import { HashRouter as Router }`.") : 0;
  };
}

var resolveToLocation = function resolveToLocation(to, currentLocation) {
  return typeof to === "function" ? to(currentLocation) : to;
};
var normalizeToLocation = function normalizeToLocation(to, currentLocation) {
  return typeof to === "string" ? (0,history__WEBPACK_IMPORTED_MODULE_6__.createLocation)(to, null, null, currentLocation) : to;
};

var forwardRefShim = function forwardRefShim(C) {
  return C;
};

var forwardRef = (react__WEBPACK_IMPORTED_MODULE_2___default().forwardRef);

if (typeof forwardRef === "undefined") {
  forwardRef = forwardRefShim;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

var LinkAnchor = forwardRef(function (_ref, forwardedRef) {
  var innerRef = _ref.innerRef,
      navigate = _ref.navigate,
      _onClick = _ref.onClick,
      rest = (0,_babel_runtime_helpers_esm_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_4__["default"])(_ref, ["innerRef", "navigate", "onClick"]);

  var target = rest.target;

  var props = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_3__["default"])({}, rest, {
    onClick: function onClick(event) {
      try {
        if (_onClick) _onClick(event);
      } catch (ex) {
        event.preventDefault();
        throw ex;
      }

      if (!event.defaultPrevented && // onClick prevented default
      event.button === 0 && ( // ignore everything but left clicks
      !target || target === "_self") && // let browser handle "target=_blank" etc.
      !isModifiedEvent(event) // ignore clicks with modifier keys
      ) {
          event.preventDefault();
          navigate();
        }
    }
  }); // React 15 compat


  if (forwardRefShim !== forwardRef) {
    props.ref = forwardedRef || innerRef;
  } else {
    props.ref = innerRef;
  }
  /* eslint-disable-next-line jsx-a11y/anchor-has-content */


  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("a", props);
});

if (true) {
  LinkAnchor.displayName = "LinkAnchor";
}
/**
 * The public API for rendering a history-aware <a>.
 */


var Link = forwardRef(function (_ref2, forwardedRef) {
  var _ref2$component = _ref2.component,
      component = _ref2$component === void 0 ? LinkAnchor : _ref2$component,
      replace = _ref2.replace,
      to = _ref2.to,
      innerRef = _ref2.innerRef,
      rest = (0,_babel_runtime_helpers_esm_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_4__["default"])(_ref2, ["component", "replace", "to", "innerRef"]);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement(react_router__WEBPACK_IMPORTED_MODULE_0__.__RouterContext.Consumer, null, function (context) {
    !context ?  true ? (0,tiny_invariant__WEBPACK_IMPORTED_MODULE_5__["default"])(false, "You should not use <Link> outside a <Router>") : 0 : void 0;
    var history = context.history;
    var location = normalizeToLocation(resolveToLocation(to, context.location), context.location);
    var href = location ? history.createHref(location) : "";

    var props = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_3__["default"])({}, rest, {
      href: href,
      navigate: function navigate() {
        var location = resolveToLocation(to, context.location);
        var isDuplicateNavigation = (0,history__WEBPACK_IMPORTED_MODULE_6__.createPath)(context.location) === (0,history__WEBPACK_IMPORTED_MODULE_6__.createPath)(normalizeToLocation(location));
        var method = replace || isDuplicateNavigation ? history.replace : history.push;
        method(location);
      }
    }); // React 15 compat


    if (forwardRefShim !== forwardRef) {
      props.ref = forwardedRef || innerRef;
    } else {
      props.innerRef = innerRef;
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement(component, props);
  });
});

if (true) {
  var toType = prop_types__WEBPACK_IMPORTED_MODULE_7___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_7___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_7___default().object), (prop_types__WEBPACK_IMPORTED_MODULE_7___default().func)]);
  var refType = prop_types__WEBPACK_IMPORTED_MODULE_7___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_7___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_7___default().func), prop_types__WEBPACK_IMPORTED_MODULE_7___default().shape({
    current: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().any)
  })]);
  Link.displayName = "Link";
  Link.propTypes = {
    innerRef: refType,
    onClick: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().func),
    replace: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().bool),
    target: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().string),
    to: toType.isRequired
  };
}

var forwardRefShim$1 = function forwardRefShim(C) {
  return C;
};

var forwardRef$1 = (react__WEBPACK_IMPORTED_MODULE_2___default().forwardRef);

if (typeof forwardRef$1 === "undefined") {
  forwardRef$1 = forwardRefShim$1;
}

function joinClassnames() {
  for (var _len = arguments.length, classnames = new Array(_len), _key = 0; _key < _len; _key++) {
    classnames[_key] = arguments[_key];
  }

  return classnames.filter(function (i) {
    return i;
  }).join(" ");
}
/**
 * A <Link> wrapper that knows if it's "active" or not.
 */


var NavLink = forwardRef$1(function (_ref, forwardedRef) {
  var _ref$ariaCurrent = _ref["aria-current"],
      ariaCurrent = _ref$ariaCurrent === void 0 ? "page" : _ref$ariaCurrent,
      _ref$activeClassName = _ref.activeClassName,
      activeClassName = _ref$activeClassName === void 0 ? "active" : _ref$activeClassName,
      activeStyle = _ref.activeStyle,
      classNameProp = _ref.className,
      exact = _ref.exact,
      isActiveProp = _ref.isActive,
      locationProp = _ref.location,
      sensitive = _ref.sensitive,
      strict = _ref.strict,
      styleProp = _ref.style,
      to = _ref.to,
      innerRef = _ref.innerRef,
      rest = (0,_babel_runtime_helpers_esm_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_4__["default"])(_ref, ["aria-current", "activeClassName", "activeStyle", "className", "exact", "isActive", "location", "sensitive", "strict", "style", "to", "innerRef"]);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement(react_router__WEBPACK_IMPORTED_MODULE_0__.__RouterContext.Consumer, null, function (context) {
    !context ?  true ? (0,tiny_invariant__WEBPACK_IMPORTED_MODULE_5__["default"])(false, "You should not use <NavLink> outside a <Router>") : 0 : void 0;
    var currentLocation = locationProp || context.location;
    var toLocation = normalizeToLocation(resolveToLocation(to, currentLocation), currentLocation);
    var path = toLocation.pathname; // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202

    var escapedPath = path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
    var match = escapedPath ? (0,react_router__WEBPACK_IMPORTED_MODULE_0__.matchPath)(currentLocation.pathname, {
      path: escapedPath,
      exact: exact,
      sensitive: sensitive,
      strict: strict
    }) : null;
    var isActive = !!(isActiveProp ? isActiveProp(match, currentLocation) : match);
    var className = typeof classNameProp === "function" ? classNameProp(isActive) : classNameProp;
    var style = typeof styleProp === "function" ? styleProp(isActive) : styleProp;

    if (isActive) {
      className = joinClassnames(className, activeClassName);
      style = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_3__["default"])({}, style, activeStyle);
    }

    var props = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_3__["default"])({
      "aria-current": isActive && ariaCurrent || null,
      className: className,
      style: style,
      to: toLocation
    }, rest); // React 15 compat


    if (forwardRefShim$1 !== forwardRef$1) {
      props.ref = forwardedRef || innerRef;
    } else {
      props.innerRef = innerRef;
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement(Link, props);
  });
});

if (true) {
  NavLink.displayName = "NavLink";
  var ariaCurrentType = prop_types__WEBPACK_IMPORTED_MODULE_7___default().oneOf(["page", "step", "location", "date", "time", "true", "false"]);
  NavLink.propTypes = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_3__["default"])({}, Link.propTypes, {
    "aria-current": ariaCurrentType,
    activeClassName: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().string),
    activeStyle: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().object),
    className: prop_types__WEBPACK_IMPORTED_MODULE_7___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_7___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_7___default().func)]),
    exact: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().bool),
    isActive: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().func),
    location: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().object),
    sensitive: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().bool),
    strict: (prop_types__WEBPACK_IMPORTED_MODULE_7___default().bool),
    style: prop_types__WEBPACK_IMPORTED_MODULE_7___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_7___default().object), (prop_types__WEBPACK_IMPORTED_MODULE_7___default().func)])
  });
}


//# sourceMappingURL=react-router-dom.js.map


/***/ }),

/***/ "./node_modules/react-router/esm/react-router.js":
/*!*******************************************************!*\
  !*** ./node_modules/react-router/esm/react-router.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MemoryRouter: () => (/* binding */ MemoryRouter),
/* harmony export */   Prompt: () => (/* binding */ Prompt),
/* harmony export */   Redirect: () => (/* binding */ Redirect),
/* harmony export */   Route: () => (/* binding */ Route),
/* harmony export */   Router: () => (/* binding */ Router),
/* harmony export */   StaticRouter: () => (/* binding */ StaticRouter),
/* harmony export */   Switch: () => (/* binding */ Switch),
/* harmony export */   __HistoryContext: () => (/* binding */ historyContext),
/* harmony export */   __RouterContext: () => (/* binding */ context),
/* harmony export */   generatePath: () => (/* binding */ generatePath),
/* harmony export */   matchPath: () => (/* binding */ matchPath),
/* harmony export */   useHistory: () => (/* binding */ useHistory),
/* harmony export */   useLocation: () => (/* binding */ useLocation),
/* harmony export */   useParams: () => (/* binding */ useParams),
/* harmony export */   useRouteMatch: () => (/* binding */ useRouteMatch),
/* harmony export */   withRouter: () => (/* binding */ withRouter)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var history__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! history */ "./node_modules/history/esm/history.js");
/* harmony import */ var tiny_warning__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! tiny-warning */ "./node_modules/tiny-warning/dist/tiny-warning.esm.js");
/* harmony import */ var tiny_invariant__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tiny-invariant */ "./node_modules/tiny-invariant/dist/esm/tiny-invariant.js");
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var path_to_regexp__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! path-to-regexp */ "./node_modules/path-to-regexp/index.js");
/* harmony import */ var path_to_regexp__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(path_to_regexp__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_is__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-is */ "./node_modules/react-is/index.js");
/* harmony import */ var _babel_runtime_helpers_esm_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectWithoutPropertiesLoose */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js");
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! hoist-non-react-statics */ "./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js");
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_7__);












var MAX_SIGNED_31_BIT_INT = 1073741823;
var commonjsGlobal = typeof globalThis !== "undefined" // 'global proper'
? // eslint-disable-next-line no-undef
globalThis : typeof window !== "undefined" ? window // Browser
: typeof __webpack_require__.g !== "undefined" ? __webpack_require__.g // node.js
: {};

function getUniqueId() {
  var key = "__global_unique_id__";
  return commonjsGlobal[key] = (commonjsGlobal[key] || 0) + 1;
} // Inlined Object.is polyfill.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is


function objectIs(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    // eslint-disable-next-line no-self-compare
    return x !== x && y !== y;
  }
}

function createEventEmitter(value) {
  var handlers = [];
  return {
    on: function on(handler) {
      handlers.push(handler);
    },
    off: function off(handler) {
      handlers = handlers.filter(function (h) {
        return h !== handler;
      });
    },
    get: function get() {
      return value;
    },
    set: function set(newValue, changedBits) {
      value = newValue;
      handlers.forEach(function (handler) {
        return handler(value, changedBits);
      });
    }
  };
}

function onlyChild(children) {
  return Array.isArray(children) ? children[0] : children;
}

function createReactContext(defaultValue, calculateChangedBits) {
  var _Provider$childContex, _Consumer$contextType;

  var contextProp = "__create-react-context-" + getUniqueId() + "__";

  var Provider = /*#__PURE__*/function (_React$Component) {
    (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Provider, _React$Component);

    function Provider() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
      _this.emitter = createEventEmitter(_this.props.value);
      return _this;
    }

    var _proto = Provider.prototype;

    _proto.getChildContext = function getChildContext() {
      var _ref;

      return _ref = {}, _ref[contextProp] = this.emitter, _ref;
    };

    _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      if (this.props.value !== nextProps.value) {
        var oldValue = this.props.value;
        var newValue = nextProps.value;
        var changedBits;

        if (objectIs(oldValue, newValue)) {
          changedBits = 0; // No change
        } else {
          changedBits = typeof calculateChangedBits === "function" ? calculateChangedBits(oldValue, newValue) : MAX_SIGNED_31_BIT_INT;

          if (true) {
             true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_8__["default"])((changedBits & MAX_SIGNED_31_BIT_INT) === changedBits, "calculateChangedBits: Expected the return value to be a " + "31-bit integer. Instead received: " + changedBits) : 0;
          }

          changedBits |= 0;

          if (changedBits !== 0) {
            this.emitter.set(nextProps.value, changedBits);
          }
        }
      }
    };

    _proto.render = function render() {
      return this.props.children;
    };

    return Provider;
  }((react__WEBPACK_IMPORTED_MODULE_1___default().Component));

  Provider.childContextTypes = (_Provider$childContex = {}, _Provider$childContex[contextProp] = (prop_types__WEBPACK_IMPORTED_MODULE_9___default().object).isRequired, _Provider$childContex);

  var Consumer = /*#__PURE__*/function (_React$Component2) {
    (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Consumer, _React$Component2);

    function Consumer() {
      var _this2;

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      _this2 = _React$Component2.call.apply(_React$Component2, [this].concat(args)) || this;
      _this2.observedBits = void 0;
      _this2.state = {
        value: _this2.getValue()
      };

      _this2.onUpdate = function (newValue, changedBits) {
        var observedBits = _this2.observedBits | 0;

        if ((observedBits & changedBits) !== 0) {
          _this2.setState({
            value: _this2.getValue()
          });
        }
      };

      return _this2;
    }

    var _proto2 = Consumer.prototype;

    _proto2.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      var observedBits = nextProps.observedBits;
      this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT // Subscribe to all changes by default
      : observedBits;
    };

    _proto2.componentDidMount = function componentDidMount() {
      if (this.context[contextProp]) {
        this.context[contextProp].on(this.onUpdate);
      }

      var observedBits = this.props.observedBits;
      this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT // Subscribe to all changes by default
      : observedBits;
    };

    _proto2.componentWillUnmount = function componentWillUnmount() {
      if (this.context[contextProp]) {
        this.context[contextProp].off(this.onUpdate);
      }
    };

    _proto2.getValue = function getValue() {
      if (this.context[contextProp]) {
        return this.context[contextProp].get();
      } else {
        return defaultValue;
      }
    };

    _proto2.render = function render() {
      return onlyChild(this.props.children)(this.state.value);
    };

    return Consumer;
  }((react__WEBPACK_IMPORTED_MODULE_1___default().Component));

  Consumer.contextTypes = (_Consumer$contextType = {}, _Consumer$contextType[contextProp] = (prop_types__WEBPACK_IMPORTED_MODULE_9___default().object), _Consumer$contextType);
  return {
    Provider: Provider,
    Consumer: Consumer
  };
}

// MIT License
var createContext = (react__WEBPACK_IMPORTED_MODULE_1___default().createContext) || createReactContext;

// TODO: Replace with React.createContext once we can assume React 16+

var createNamedContext = function createNamedContext(name) {
  var context = createContext();
  context.displayName = name;
  return context;
};

var historyContext = /*#__PURE__*/createNamedContext("Router-History");

var context = /*#__PURE__*/createNamedContext("Router");

/**
 * The public API for putting history on context.
 */

var Router = /*#__PURE__*/function (_React$Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Router, _React$Component);

  Router.computeRootMatch = function computeRootMatch(pathname) {
    return {
      path: "/",
      url: "/",
      params: {},
      isExact: pathname === "/"
    };
  };

  function Router(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {
      location: props.history.location
    }; // This is a bit of a hack. We have to start listening for location
    // changes here in the constructor in case there are any <Redirect>s
    // on the initial render. If there are, they will replace/push when
    // they mount and since cDM fires in children before parents, we may
    // get a new location before the <Router> is mounted.

    _this._isMounted = false;
    _this._pendingLocation = null;

    if (!props.staticContext) {
      _this.unlisten = props.history.listen(function (location) {
        _this._pendingLocation = location;
      });
    }

    return _this;
  }

  var _proto = Router.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this2 = this;

    this._isMounted = true;

    if (this.unlisten) {
      // Any pre-mount location changes have been captured at
      // this point, so unregister the listener.
      this.unlisten();
    }

    if (!this.props.staticContext) {
      this.unlisten = this.props.history.listen(function (location) {
        if (_this2._isMounted) {
          _this2.setState({
            location: location
          });
        }
      });
    }

    if (this._pendingLocation) {
      this.setState({
        location: this._pendingLocation
      });
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten();
      this._isMounted = false;
      this._pendingLocation = null;
    }
  };

  _proto.render = function render() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(context.Provider, {
      value: {
        history: this.props.history,
        location: this.state.location,
        match: Router.computeRootMatch(this.state.location.pathname),
        staticContext: this.props.staticContext
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(historyContext.Provider, {
      children: this.props.children || null,
      value: this.props.history
    }));
  };

  return Router;
}((react__WEBPACK_IMPORTED_MODULE_1___default().Component));

if (true) {
  Router.propTypes = {
    children: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().node),
    history: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().object).isRequired,
    staticContext: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().object)
  };

  Router.prototype.componentDidUpdate = function (prevProps) {
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_8__["default"])(prevProps.history === this.props.history, "You cannot change <Router history>") : 0;
  };
}

/**
 * The public API for a <Router> that stores location in memory.
 */

var MemoryRouter = /*#__PURE__*/function (_React$Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(MemoryRouter, _React$Component);

  function MemoryRouter() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.history = (0,history__WEBPACK_IMPORTED_MODULE_10__.createMemoryHistory)(_this.props);
    return _this;
  }

  var _proto = MemoryRouter.prototype;

  _proto.render = function render() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(Router, {
      history: this.history,
      children: this.props.children
    });
  };

  return MemoryRouter;
}((react__WEBPACK_IMPORTED_MODULE_1___default().Component));

if (true) {
  MemoryRouter.propTypes = {
    initialEntries: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().array),
    initialIndex: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().number),
    getUserConfirmation: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func),
    keyLength: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().number),
    children: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().node)
  };

  MemoryRouter.prototype.componentDidMount = function () {
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_8__["default"])(!this.props.history, "<MemoryRouter> ignores the history prop. To use a custom history, " + "use `import { Router }` instead of `import { MemoryRouter as Router }`.") : 0;
  };
}

var Lifecycle = /*#__PURE__*/function (_React$Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Lifecycle, _React$Component);

  function Lifecycle() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Lifecycle.prototype;

  _proto.componentDidMount = function componentDidMount() {
    if (this.props.onMount) this.props.onMount.call(this, this);
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (this.props.onUpdate) this.props.onUpdate.call(this, this, prevProps);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this.props.onUnmount) this.props.onUnmount.call(this, this);
  };

  _proto.render = function render() {
    return null;
  };

  return Lifecycle;
}((react__WEBPACK_IMPORTED_MODULE_1___default().Component));

/**
 * The public API for prompting the user before navigating away from a screen.
 */

function Prompt(_ref) {
  var message = _ref.message,
      _ref$when = _ref.when,
      when = _ref$when === void 0 ? true : _ref$when;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(context.Consumer, null, function (context) {
    !context ?  true ? (0,tiny_invariant__WEBPACK_IMPORTED_MODULE_2__["default"])(false, "You should not use <Prompt> outside a <Router>") : 0 : void 0;
    if (!when || context.staticContext) return null;
    var method = context.history.block;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(Lifecycle, {
      onMount: function onMount(self) {
        self.release = method(message);
      },
      onUpdate: function onUpdate(self, prevProps) {
        if (prevProps.message !== message) {
          self.release();
          self.release = method(message);
        }
      },
      onUnmount: function onUnmount(self) {
        self.release();
      },
      message: message
    });
  });
}

if (true) {
  var messageType = prop_types__WEBPACK_IMPORTED_MODULE_9___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_9___default().func), (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string)]);
  Prompt.propTypes = {
    when: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
    message: messageType.isRequired
  };
}

var cache = {};
var cacheLimit = 10000;
var cacheCount = 0;

function compilePath(path) {
  if (cache[path]) return cache[path];
  var generator = path_to_regexp__WEBPACK_IMPORTED_MODULE_4___default().compile(path);

  if (cacheCount < cacheLimit) {
    cache[path] = generator;
    cacheCount++;
  }

  return generator;
}
/**
 * Public API for generating a URL pathname from a path and parameters.
 */


function generatePath(path, params) {
  if (path === void 0) {
    path = "/";
  }

  if (params === void 0) {
    params = {};
  }

  return path === "/" ? path : compilePath(path)(params, {
    pretty: true
  });
}

/**
 * The public API for navigating programmatically with a component.
 */

function Redirect(_ref) {
  var computedMatch = _ref.computedMatch,
      to = _ref.to,
      _ref$push = _ref.push,
      push = _ref$push === void 0 ? false : _ref$push;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(context.Consumer, null, function (context) {
    !context ?  true ? (0,tiny_invariant__WEBPACK_IMPORTED_MODULE_2__["default"])(false, "You should not use <Redirect> outside a <Router>") : 0 : void 0;
    var history = context.history,
        staticContext = context.staticContext;
    var method = push ? history.push : history.replace;
    var location = (0,history__WEBPACK_IMPORTED_MODULE_10__.createLocation)(computedMatch ? typeof to === "string" ? generatePath(to, computedMatch.params) : (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_3__["default"])({}, to, {
      pathname: generatePath(to.pathname, computedMatch.params)
    }) : to); // When rendering in a static context,
    // set the new location immediately.

    if (staticContext) {
      method(location);
      return null;
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(Lifecycle, {
      onMount: function onMount() {
        method(location);
      },
      onUpdate: function onUpdate(self, prevProps) {
        var prevLocation = (0,history__WEBPACK_IMPORTED_MODULE_10__.createLocation)(prevProps.to);

        if (!(0,history__WEBPACK_IMPORTED_MODULE_10__.locationsAreEqual)(prevLocation, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_3__["default"])({}, location, {
          key: prevLocation.key
        }))) {
          method(location);
        }
      },
      to: to
    });
  });
}

if (true) {
  Redirect.propTypes = {
    push: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
    from: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
    to: prop_types__WEBPACK_IMPORTED_MODULE_9___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_9___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_9___default().object)]).isRequired
  };
}

var cache$1 = {};
var cacheLimit$1 = 10000;
var cacheCount$1 = 0;

function compilePath$1(path, options) {
  var cacheKey = "" + options.end + options.strict + options.sensitive;
  var pathCache = cache$1[cacheKey] || (cache$1[cacheKey] = {});
  if (pathCache[path]) return pathCache[path];
  var keys = [];
  var regexp = path_to_regexp__WEBPACK_IMPORTED_MODULE_4___default()(path, keys, options);
  var result = {
    regexp: regexp,
    keys: keys
  };

  if (cacheCount$1 < cacheLimit$1) {
    pathCache[path] = result;
    cacheCount$1++;
  }

  return result;
}
/**
 * Public API for matching a URL pathname to a path.
 */


function matchPath(pathname, options) {
  if (options === void 0) {
    options = {};
  }

  if (typeof options === "string" || Array.isArray(options)) {
    options = {
      path: options
    };
  }

  var _options = options,
      path = _options.path,
      _options$exact = _options.exact,
      exact = _options$exact === void 0 ? false : _options$exact,
      _options$strict = _options.strict,
      strict = _options$strict === void 0 ? false : _options$strict,
      _options$sensitive = _options.sensitive,
      sensitive = _options$sensitive === void 0 ? false : _options$sensitive;
  var paths = [].concat(path);
  return paths.reduce(function (matched, path) {
    if (!path && path !== "") return null;
    if (matched) return matched;

    var _compilePath = compilePath$1(path, {
      end: exact,
      strict: strict,
      sensitive: sensitive
    }),
        regexp = _compilePath.regexp,
        keys = _compilePath.keys;

    var match = regexp.exec(pathname);
    if (!match) return null;
    var url = match[0],
        values = match.slice(1);
    var isExact = pathname === url;
    if (exact && !isExact) return null;
    return {
      path: path,
      // the path used to match
      url: path === "/" && url === "" ? "/" : url,
      // the matched portion of the URL
      isExact: isExact,
      // whether or not we matched exactly
      params: keys.reduce(function (memo, key, index) {
        memo[key.name] = values[index];
        return memo;
      }, {})
    };
  }, null);
}

function isEmptyChildren(children) {
  return react__WEBPACK_IMPORTED_MODULE_1___default().Children.count(children) === 0;
}

function evalChildrenDev(children, props, path) {
  var value = children(props);
   true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_8__["default"])(value !== undefined, "You returned `undefined` from the `children` function of " + ("<Route" + (path ? " path=\"" + path + "\"" : "") + ">, but you ") + "should have returned a React element or `null`") : 0;
  return value || null;
}
/**
 * The public API for matching a single path and rendering.
 */


var Route = /*#__PURE__*/function (_React$Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Route, _React$Component);

  function Route() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Route.prototype;

  _proto.render = function render() {
    var _this = this;

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(context.Consumer, null, function (context$1) {
      !context$1 ?  true ? (0,tiny_invariant__WEBPACK_IMPORTED_MODULE_2__["default"])(false, "You should not use <Route> outside a <Router>") : 0 : void 0;
      var location = _this.props.location || context$1.location;
      var match = _this.props.computedMatch ? _this.props.computedMatch // <Switch> already computed the match for us
      : _this.props.path ? matchPath(location.pathname, _this.props) : context$1.match;

      var props = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_3__["default"])({}, context$1, {
        location: location,
        match: match
      });

      var _this$props = _this.props,
          children = _this$props.children,
          component = _this$props.component,
          render = _this$props.render; // Preact uses an empty array as children by
      // default, so use null if that's the case.

      if (Array.isArray(children) && isEmptyChildren(children)) {
        children = null;
      }

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(context.Provider, {
        value: props
      }, props.match ? children ? typeof children === "function" ?  true ? evalChildrenDev(children, props, _this.props.path) : 0 : children : component ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(component, props) : render ? render(props) : null : typeof children === "function" ?  true ? evalChildrenDev(children, props, _this.props.path) : 0 : null);
    });
  };

  return Route;
}((react__WEBPACK_IMPORTED_MODULE_1___default().Component));

if (true) {
  Route.propTypes = {
    children: prop_types__WEBPACK_IMPORTED_MODULE_9___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_9___default().func), (prop_types__WEBPACK_IMPORTED_MODULE_9___default().node)]),
    component: function component(props, propName) {
      if (props[propName] && !(0,react_is__WEBPACK_IMPORTED_MODULE_5__.isValidElementType)(props[propName])) {
        return new Error("Invalid prop 'component' supplied to 'Route': the prop is not a valid React component");
      }
    },
    exact: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
    location: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().object),
    path: prop_types__WEBPACK_IMPORTED_MODULE_9___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_9___default().string), prop_types__WEBPACK_IMPORTED_MODULE_9___default().arrayOf((prop_types__WEBPACK_IMPORTED_MODULE_9___default().string))]),
    render: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func),
    sensitive: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
    strict: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool)
  };

  Route.prototype.componentDidMount = function () {
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_8__["default"])(!(this.props.children && !isEmptyChildren(this.props.children) && this.props.component), "You should not use <Route component> and <Route children> in the same route; <Route component> will be ignored") : 0;
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_8__["default"])(!(this.props.children && !isEmptyChildren(this.props.children) && this.props.render), "You should not use <Route render> and <Route children> in the same route; <Route render> will be ignored") : 0;
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_8__["default"])(!(this.props.component && this.props.render), "You should not use <Route component> and <Route render> in the same route; <Route render> will be ignored") : 0;
  };

  Route.prototype.componentDidUpdate = function (prevProps) {
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_8__["default"])(!(this.props.location && !prevProps.location), '<Route> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.') : 0;
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_8__["default"])(!(!this.props.location && prevProps.location), '<Route> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.') : 0;
  };
}

function addLeadingSlash(path) {
  return path.charAt(0) === "/" ? path : "/" + path;
}

function addBasename(basename, location) {
  if (!basename) return location;
  return (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_3__["default"])({}, location, {
    pathname: addLeadingSlash(basename) + location.pathname
  });
}

function stripBasename(basename, location) {
  if (!basename) return location;
  var base = addLeadingSlash(basename);
  if (location.pathname.indexOf(base) !== 0) return location;
  return (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_3__["default"])({}, location, {
    pathname: location.pathname.substr(base.length)
  });
}

function createURL(location) {
  return typeof location === "string" ? location : (0,history__WEBPACK_IMPORTED_MODULE_10__.createPath)(location);
}

function staticHandler(methodName) {
  return function () {
      true ? (0,tiny_invariant__WEBPACK_IMPORTED_MODULE_2__["default"])(false, "You cannot %s with <StaticRouter>", methodName) : 0 ;
  };
}

function noop() {}
/**
 * The public top-level API for a "static" <Router>, so-called because it
 * can't actually change the current location. Instead, it just records
 * location changes in a context object. Useful mainly in testing and
 * server-rendering scenarios.
 */


var StaticRouter = /*#__PURE__*/function (_React$Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(StaticRouter, _React$Component);

  function StaticRouter() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _this.handlePush = function (location) {
      return _this.navigateTo(location, "PUSH");
    };

    _this.handleReplace = function (location) {
      return _this.navigateTo(location, "REPLACE");
    };

    _this.handleListen = function () {
      return noop;
    };

    _this.handleBlock = function () {
      return noop;
    };

    return _this;
  }

  var _proto = StaticRouter.prototype;

  _proto.navigateTo = function navigateTo(location, action) {
    var _this$props = this.props,
        _this$props$basename = _this$props.basename,
        basename = _this$props$basename === void 0 ? "" : _this$props$basename,
        _this$props$context = _this$props.context,
        context = _this$props$context === void 0 ? {} : _this$props$context;
    context.action = action;
    context.location = addBasename(basename, (0,history__WEBPACK_IMPORTED_MODULE_10__.createLocation)(location));
    context.url = createURL(context.location);
  };

  _proto.render = function render() {
    var _this$props2 = this.props,
        _this$props2$basename = _this$props2.basename,
        basename = _this$props2$basename === void 0 ? "" : _this$props2$basename,
        _this$props2$context = _this$props2.context,
        context = _this$props2$context === void 0 ? {} : _this$props2$context,
        _this$props2$location = _this$props2.location,
        location = _this$props2$location === void 0 ? "/" : _this$props2$location,
        rest = (0,_babel_runtime_helpers_esm_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_6__["default"])(_this$props2, ["basename", "context", "location"]);

    var history = {
      createHref: function createHref(path) {
        return addLeadingSlash(basename + createURL(path));
      },
      action: "POP",
      location: stripBasename(basename, (0,history__WEBPACK_IMPORTED_MODULE_10__.createLocation)(location)),
      push: this.handlePush,
      replace: this.handleReplace,
      go: staticHandler("go"),
      goBack: staticHandler("goBack"),
      goForward: staticHandler("goForward"),
      listen: this.handleListen,
      block: this.handleBlock
    };
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(Router, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_3__["default"])({}, rest, {
      history: history,
      staticContext: context
    }));
  };

  return StaticRouter;
}((react__WEBPACK_IMPORTED_MODULE_1___default().Component));

if (true) {
  StaticRouter.propTypes = {
    basename: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string),
    context: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().object),
    location: prop_types__WEBPACK_IMPORTED_MODULE_9___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_9___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_9___default().object)])
  };

  StaticRouter.prototype.componentDidMount = function () {
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_8__["default"])(!this.props.history, "<StaticRouter> ignores the history prop. To use a custom history, " + "use `import { Router }` instead of `import { StaticRouter as Router }`.") : 0;
  };
}

/**
 * The public API for rendering the first <Route> that matches.
 */

var Switch = /*#__PURE__*/function (_React$Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Switch, _React$Component);

  function Switch() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Switch.prototype;

  _proto.render = function render() {
    var _this = this;

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(context.Consumer, null, function (context) {
      !context ?  true ? (0,tiny_invariant__WEBPACK_IMPORTED_MODULE_2__["default"])(false, "You should not use <Switch> outside a <Router>") : 0 : void 0;
      var location = _this.props.location || context.location;
      var element, match; // We use React.Children.forEach instead of React.Children.toArray().find()
      // here because toArray adds keys to all child elements and we do not want
      // to trigger an unmount/remount for two <Route>s that render the same
      // component at different URLs.

      react__WEBPACK_IMPORTED_MODULE_1___default().Children.forEach(_this.props.children, function (child) {
        if (match == null && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().isValidElement(child)) {
          element = child;
          var path = child.props.path || child.props.from;
          match = path ? matchPath(location.pathname, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_3__["default"])({}, child.props, {
            path: path
          })) : context.match;
        }
      });
      return match ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().cloneElement(element, {
        location: location,
        computedMatch: match
      }) : null;
    });
  };

  return Switch;
}((react__WEBPACK_IMPORTED_MODULE_1___default().Component));

if (true) {
  Switch.propTypes = {
    children: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().node),
    location: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().object)
  };

  Switch.prototype.componentDidUpdate = function (prevProps) {
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_8__["default"])(!(this.props.location && !prevProps.location), '<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.') : 0;
     true ? (0,tiny_warning__WEBPACK_IMPORTED_MODULE_8__["default"])(!(!this.props.location && prevProps.location), '<Switch> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.') : 0;
  };
}

/**
 * A public higher-order component to access the imperative API
 */

function withRouter(Component) {
  var displayName = "withRouter(" + (Component.displayName || Component.name) + ")";

  var C = function C(props) {
    var wrappedComponentRef = props.wrappedComponentRef,
        remainingProps = (0,_babel_runtime_helpers_esm_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_6__["default"])(props, ["wrappedComponentRef"]);

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(context.Consumer, null, function (context) {
      !context ?  true ? (0,tiny_invariant__WEBPACK_IMPORTED_MODULE_2__["default"])(false, "You should not use <" + displayName + " /> outside a <Router>") : 0 : void 0;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(Component, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_3__["default"])({}, remainingProps, context, {
        ref: wrappedComponentRef
      }));
    });
  };

  C.displayName = displayName;
  C.WrappedComponent = Component;

  if (true) {
    C.propTypes = {
      wrappedComponentRef: prop_types__WEBPACK_IMPORTED_MODULE_9___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_9___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func), (prop_types__WEBPACK_IMPORTED_MODULE_9___default().object)])
    };
  }

  return hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_7___default()(C, Component);
}

var useContext = (react__WEBPACK_IMPORTED_MODULE_1___default().useContext);
function useHistory() {
  if (true) {
    !(typeof useContext === "function") ?  true ? (0,tiny_invariant__WEBPACK_IMPORTED_MODULE_2__["default"])(false, "You must use React >= 16.8 in order to use useHistory()") : 0 : void 0;
  }

  return useContext(historyContext);
}
function useLocation() {
  if (true) {
    !(typeof useContext === "function") ?  true ? (0,tiny_invariant__WEBPACK_IMPORTED_MODULE_2__["default"])(false, "You must use React >= 16.8 in order to use useLocation()") : 0 : void 0;
  }

  return useContext(context).location;
}
function useParams() {
  if (true) {
    !(typeof useContext === "function") ?  true ? (0,tiny_invariant__WEBPACK_IMPORTED_MODULE_2__["default"])(false, "You must use React >= 16.8 in order to use useParams()") : 0 : void 0;
  }

  var match = useContext(context).match;
  return match ? match.params : {};
}
function useRouteMatch(path) {
  if (true) {
    !(typeof useContext === "function") ?  true ? (0,tiny_invariant__WEBPACK_IMPORTED_MODULE_2__["default"])(false, "You must use React >= 16.8 in order to use useRouteMatch()") : 0 : void 0;
  }

  var location = useLocation();
  var match = useContext(context).match;
  return path ? matchPath(location.pathname, path) : match;
}

if (true) {
  if (typeof window !== "undefined") {
    var global$1 = window;
    var key = "__react_router_build__";
    var buildNames = {
      cjs: "CommonJS",
      esm: "ES modules",
      umd: "UMD"
    };

    if (global$1[key] && global$1[key] !== "esm") {
      var initialBuildName = buildNames[global$1[key]];
      var secondaryBuildName = buildNames["esm"]; // TODO: Add link to article that explains in detail how to avoid
      // loading 2 different builds.

      throw new Error("You are loading the " + secondaryBuildName + " build of React Router " + ("on a page that is already running the " + initialBuildName + " ") + "build, so things won't work right.");
    }

    global$1[key] = "esm";
  }
}


//# sourceMappingURL=react-router.js.map


/***/ }),

/***/ "./node_modules/resolve-pathname/esm/resolve-pathname.js":
/*!***************************************************************!*\
  !*** ./node_modules/resolve-pathname/esm/resolve-pathname.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function isAbsolute(pathname) {
  return pathname.charAt(0) === '/';
}

// About 1.5x faster than the two-arg version of Array#splice()
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
    list[i] = list[k];
  }

  list.pop();
}

// This implementation is based heavily on node's url.parse
function resolvePathname(to, from) {
  if (from === undefined) from = '';

  var toParts = (to && to.split('/')) || [];
  var fromParts = (from && from.split('/')) || [];

  var isToAbs = to && isAbsolute(to);
  var isFromAbs = from && isAbsolute(from);
  var mustEndAbs = isToAbs || isFromAbs;

  if (to && isAbsolute(to)) {
    // to is absolute
    fromParts = toParts;
  } else if (toParts.length) {
    // to is relative, drop the filename
    fromParts.pop();
    fromParts = fromParts.concat(toParts);
  }

  if (!fromParts.length) return '/';

  var hasTrailingSlash;
  if (fromParts.length) {
    var last = fromParts[fromParts.length - 1];
    hasTrailingSlash = last === '.' || last === '..' || last === '';
  } else {
    hasTrailingSlash = false;
  }

  var up = 0;
  for (var i = fromParts.length; i >= 0; i--) {
    var part = fromParts[i];

    if (part === '.') {
      spliceOne(fromParts, i);
    } else if (part === '..') {
      spliceOne(fromParts, i);
      up++;
    } else if (up) {
      spliceOne(fromParts, i);
      up--;
    }
  }

  if (!mustEndAbs) for (; up--; up) fromParts.unshift('..');

  if (
    mustEndAbs &&
    fromParts[0] !== '' &&
    (!fromParts[0] || !isAbsolute(fromParts[0]))
  )
    fromParts.unshift('');

  var result = fromParts.join('/');

  if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';

  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (resolvePathname);


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

/***/ "./node_modules/tiny-warning/dist/tiny-warning.esm.js":
/*!************************************************************!*\
  !*** ./node_modules/tiny-warning/dist/tiny-warning.esm.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var isProduction = "development" === 'production';
function warning(condition, message) {
  if (!isProduction) {
    if (condition) {
      return;
    }

    var text = "Warning: " + message;

    if (typeof console !== 'undefined') {
      console.warn(text);
    }

    try {
      throw Error(text);
    } catch (x) {}
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (warning);


/***/ }),

/***/ "./node_modules/value-equal/esm/value-equal.js":
/*!*****************************************************!*\
  !*** ./node_modules/value-equal/esm/value-equal.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function valueOf(obj) {
  return obj.valueOf ? obj.valueOf() : Object.prototype.valueOf.call(obj);
}

function valueEqual(a, b) {
  // Test for strict equality first.
  if (a === b) return true;

  // Otherwise, if either of them == null they are not equal.
  if (a == null || b == null) return false;

  if (Array.isArray(a)) {
    return (
      Array.isArray(b) &&
      a.length === b.length &&
      a.every(function(item, index) {
        return valueEqual(item, b[index]);
      })
    );
  }

  if (typeof a === 'object' || typeof b === 'object') {
    var aValue = valueOf(a);
    var bValue = valueOf(b);

    if (aValue !== a || bValue !== b) return valueEqual(aValue, bValue);

    return Object.keys(Object.assign({}, a, b)).every(function(key) {
      return valueEqual(a[key], b[key]);
    });
  }

  return false;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (valueEqual);


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = window["React"];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/arrayLikeToArray.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayLikeToArray.js ***!
  \*****************************************************************/
/***/ ((module) => {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/arrayWithHoles.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithHoles.js ***!
  \***************************************************************/
/***/ ((module) => {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/arrayLikeToArray.js");

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

module.exports = _arrayWithoutHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/assertThisInitialized.js ***!
  \**********************************************************************/
/***/ ((module) => {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/asyncToGenerator.js ***!
  \*****************************************************************/
/***/ ((module) => {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/classCallCheck.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/classCallCheck.js ***!
  \***************************************************************/
/***/ ((module) => {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/createClass.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/createClass.js ***!
  \************************************************************/
/***/ ((module) => {

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

/***/ "./node_modules/@babel/runtime/helpers/defineProperty.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/***/ ((module) => {

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

module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/getPrototypeOf.js ***!
  \***************************************************************/
/***/ ((module) => {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/inherits.js":
/*!*********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/inherits.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/setPrototypeOf.js");

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

/***/ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \**********************************************************************/
/***/ ((module) => {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/iterableToArray.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArray.js ***!
  \****************************************************************/
/***/ ((module) => {

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

module.exports = _iterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js ***!
  \*********************************************************************/
/***/ ((module) => {

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

module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/nonIterableRest.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableRest.js ***!
  \****************************************************************/
/***/ ((module) => {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/nonIterableSpread.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableSpread.js ***!
  \******************************************************************/
/***/ ((module) => {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/typeof.js")["default"]);

var assertThisInitialized = __webpack_require__(/*! ./assertThisInitialized.js */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js");

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

/***/ "./node_modules/@babel/runtime/helpers/regeneratorRuntime.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/regeneratorRuntime.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/typeof.js")["default"]);

function _regeneratorRuntime() {
  "use strict";
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */

  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return exports;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var exports = {},
      Op = Object.prototype,
      hasOwn = Op.hasOwnProperty,
      $Symbol = "function" == typeof Symbol ? Symbol : {},
      iteratorSymbol = $Symbol.iterator || "@@iterator",
      asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
      toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }

  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
        generator = Object.create(protoGenerator.prototype),
        context = new Context(tryLocsList || []);
    return generator._invoke = function (innerFn, self, context) {
      var state = "suspendedStart";
      return function (method, arg) {
        if ("executing" === state) throw new Error("Generator is already running");

        if ("completed" === state) {
          if ("throw" === method) throw arg;
          return doneResult();
        }

        for (context.method = method, context.arg = arg;;) {
          var delegate = context.delegate;

          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);

            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
            if ("suspendedStart" === state) throw state = "completed", context.arg;
            context.dispatchException(context.arg);
          } else "return" === context.method && context.abrupt("return", context.arg);
          state = "executing";
          var record = tryCatch(innerFn, self, context);

          if ("normal" === record.type) {
            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
            return {
              value: record.arg,
              done: context.done
            };
          }

          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
        }
      };
    }(innerFn, self, context), generator;
  }

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  exports.wrap = wrap;
  var ContinueSentinel = {};

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {}

  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
      NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if ("throw" !== record.type) {
        var result = record.arg,
            value = result.value;
        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }

      reject(record.arg);
    }

    var previousPromise;

    this._invoke = function (method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    };
  }

  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (undefined === method) {
      if (context.delegate = null, "throw" === context.method) {
        if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel;
        context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }

  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          for (; ++i < iterable.length;) {
            if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
          }

          return next.value = undefined, next.done = !0, next;
        };

        return next.next = next;
      }
    }

    return {
      next: doneResult
    };
  }

  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }

  return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (object) {
    var keys = [];

    for (var key in object) {
      keys.push(key);
    }

    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }

      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) {
        "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
      }
    },
    stop: function stop() {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) throw exception;
      var context = this;

      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
            record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
              hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      }

      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}

module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/setPrototypeOf.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/setPrototypeOf.js ***!
  \***************************************************************/
/***/ ((module) => {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/slicedToArray.js":
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/slicedToArray.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayWithHoles = __webpack_require__(/*! ./arrayWithHoles.js */ "./node_modules/@babel/runtime/helpers/arrayWithHoles.js");

var iterableToArrayLimit = __webpack_require__(/*! ./iterableToArrayLimit.js */ "./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js");

var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js");

var nonIterableRest = __webpack_require__(/*! ./nonIterableRest.js */ "./node_modules/@babel/runtime/helpers/nonIterableRest.js");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/toConsumableArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toConsumableArray.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayWithoutHoles = __webpack_require__(/*! ./arrayWithoutHoles.js */ "./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js");

var iterableToArray = __webpack_require__(/*! ./iterableToArray.js */ "./node_modules/@babel/runtime/helpers/iterableToArray.js");

var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js");

var nonIterableSpread = __webpack_require__(/*! ./nonIterableSpread.js */ "./node_modules/@babel/runtime/helpers/nonIterableSpread.js");

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/typeof.js":
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/***/ ((module) => {

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

/***/ "./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(/*! ../helpers/regeneratorRuntime */ "./node_modules/@babel/runtime/helpers/regeneratorRuntime.js")();
module.exports = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
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

/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inheritsLoose)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _objectWithoutPropertiesLoose)
/* harmony export */ });
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
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

/***/ "./node_modules/tiny-invariant/dist/esm/tiny-invariant.js":
/*!****************************************************************!*\
  !*** ./node_modules/tiny-invariant/dist/esm/tiny-invariant.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ invariant)
/* harmony export */ });
var isProduction = "development" === 'production';
var prefix = 'Invariant failed';
function invariant(condition, message) {
    if (condition) {
        return;
    }
    if (isProduction) {
        throw new Error(prefix);
    }
    var provided = typeof message === 'function' ? message() : message;
    var value = provided ? "".concat(prefix, ": ").concat(provided) : prefix;
    throw new Error(value);
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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
  !*** ./modules/biobank/jsx/biobankIndex.js ***!
  \*********************************************/


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js"));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/toConsumableArray.js"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js"));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js"));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _react = __webpack_require__(/*! react */ "react");
var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));
var _sweetalert = _interopRequireDefault(__webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js"));
var _filter = _interopRequireDefault(__webpack_require__(/*! ./filter */ "./modules/biobank/jsx/filter.js"));
var _barcodePage = _interopRequireDefault(__webpack_require__(/*! ./barcodePage */ "./modules/biobank/jsx/barcodePage.js"));
var _helpers = __webpack_require__(/*! ./helpers.js */ "./modules/biobank/jsx/helpers.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * The main React entrypoint for the biobank module. This component
 * renders the index page.
 */
var BiobankIndex = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(BiobankIndex, _Component);
  var _super = _createSuper(BiobankIndex);
  /**
   * Constructor
   */
  function BiobankIndex() {
    var _this;
    (0, _classCallCheck2["default"])(this, BiobankIndex);
    _this = _super.call(this);
    _this.state = {
      data: {
        containers: {},
        pools: {},
        specimens: {}
      },
      loading: 0,
      options: {
        candidatesSessions: {},
        candidates: {},
        centers: {},
        container: {
          types: {},
          typesPrimary: {},
          typesNonPrimary: {},
          dimensions: {},
          stati: {}
        },
        diagnoses: {},
        examiners: {},
        users: {},
        projects: {},
        sessionCenters: {},
        sessions: {},
        specimen: {
          types: {},
          typeUnits: {},
          typeContainerTypes: {},
          protocols: {},
          protocolAttributes: {},
          protocolContainers: {},
          processes: {},
          processAttributes: {},
          attributes: {},
          attributeDatatypes: {},
          attributesOptions: {},
          units: {}
        },
        shipment: {
          statuses: {},
          types: {}
        }
      }
    };
    _this.printLabel = _this.printLabel.bind((0, _assertThisInitialized2["default"])(_this));
    _this.routeBarcode = _this.routeBarcode.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setData = _this.setData.bind((0, _assertThisInitialized2["default"])(_this));
    _this.increaseCoordinate = _this.increaseCoordinate.bind((0, _assertThisInitialized2["default"])(_this));
    _this.updateSpecimen = _this.updateSpecimen.bind((0, _assertThisInitialized2["default"])(_this));
    _this.updateSpecimens = _this.updateSpecimens.bind((0, _assertThisInitialized2["default"])(_this));
    _this.editSpecimens = _this.editSpecimens.bind((0, _assertThisInitialized2["default"])(_this));
    _this.updateContainer = _this.updateContainer.bind((0, _assertThisInitialized2["default"])(_this));
    _this.createPool = _this.createPool.bind((0, _assertThisInitialized2["default"])(_this));
    _this.saveBatchEdit = _this.saveBatchEdit.bind((0, _assertThisInitialized2["default"])(_this));
    _this.createSpecimens = _this.createSpecimens.bind((0, _assertThisInitialized2["default"])(_this));
    _this.createContainers = _this.createContainers.bind((0, _assertThisInitialized2["default"])(_this));
    _this.validateSpecimen = _this.validateSpecimen.bind((0, _assertThisInitialized2["default"])(_this));
    _this.validateProcess = _this.validateProcess.bind((0, _assertThisInitialized2["default"])(_this));
    _this.validateContainer = _this.validateContainer.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  /**
   * React lifecycle method
   */
  (0, _createClass2["default"])(BiobankIndex, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var _this2 = this;
        var updateProgress, specimens, containers, pools, options, data;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                updateProgress = function updateProgress(loading) {
                  return _this2.setState({
                    loading: loading
                  });
                };
                specimens = (0, _helpers.getStream)(this.props.specimenAPI, updateProgress);
                containers = (0, _helpers.get)(this.props.containerAPI);
                pools = (0, _helpers.get)(this.props.poolAPI);
                _context.next = 6;
                return (0, _helpers.get)(this.props.optionsAPI);
              case 6:
                options = _context.sent;
                this.setState({
                  options: options
                });
                data = this.state.data;
                _context.next = 11;
                return containers;
              case 11:
                data.containers = _context.sent;
                _context.next = 14;
                return specimens;
              case 14:
                data.specimens = _context.sent;
                _context.next = 17;
                return pools;
              case 17:
                data.pools = _context.sent;
                this.setState({
                  data: data
                });
                updateProgress(100);
              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }
      return componentDidMount;
    }()
    /**
     * Sets data for entities
     *
     * @param {string} type - the type of entity
     * @param {object} entities - the entities to set
     * @return {Promise}
     */
  }, {
    key: "setData",
    value: function setData(type, entities) {
      var _this3 = this;
      return new Promise(function (resolve) {
        var data = (0, _helpers.clone)(_this3.state.data);
        entities.forEach(function (entity) {
          return data[type][entity.id] = entity;
        });
        _this3.setState({
          data: data
        }, resolve());
      });
    }

    /**
     * Send a request to a server to print a label
     *
     * @param {object} labelParams - the properties of the label to print
     * @return {Promise}
     */
  }, {
    key: "printLabel",
    value: function printLabel(labelParams) {
      return (0, _helpers.post)(labelParams, this.props.labelAPI, 'POST');
    }

    /**
     * Find the appropriate container for a barcode.
     *
     * @param {string} barcode - the value to route
     * @return {object}
     */
  }, {
    key: "routeBarcode",
    value: function routeBarcode(barcode) {
      var container = Object.values(this.state.data.containers).find(function (container) {
        return container.barcode == barcode;
      });
      var specimen = Object.values(this.state.data.specimens).find(function (specimen) {
        return specimen.containerId == container.id;
      });
      return {
        container: container,
        specimen: specimen
      };
    }

    /**
     * Send a request to update a single specimen on the server after
     * validating it
     *
     * @param {object} specimen - the specimen to update
     * @return {Promise}
     */
  }, {
    key: "updateSpecimen",
    value: function updateSpecimen(specimen) {
      var _this4 = this;
      var errors = this.validateSpecimen(specimen);
      if (!(0, _helpers.isEmpty)(errors)) {
        return Promise.reject({
          specimen: errors
        });
      }
      return (0, _helpers.post)(specimen, this.props.specimenAPI, 'PUT').then(function (specimens) {
        return _this4.setData('specimens', specimens);
      });
    }

    /**
     * Update multiple specimens at once
     *
     * @param {array} list - the list of specimens to update
     * @return {Promise}
     */
  }, {
    key: "updateSpecimens",
    value: function updateSpecimens(list) {
      var _this5 = this;
      var updateList = list.map(function (specimen) {
        return function () {
          return _this5.updateSpecimen(specimen);
        };
      });
      return Promise.all(updateList.map(function (updateSpecimen) {
        return updateSpecimen();
      }));
    }

    /**
     * Edit a list of specimens
     *
     * @param {array} list - a list of specimens
     * @return {Promise}
     */
  }, {
    key: "editSpecimens",
    value: function editSpecimens(list) {
      var _this6 = this;
      var errors = {};
      errors.specimen = this.validateSpecimen(list[0].specimen);
      errors.container = this.validateContainer(list[0].container);
      if (!(0, _helpers.isEmpty)(errors.specimen) || !(0, _helpers.isEmpty)(errors.container)) {
        return Promise.reject(errors);
      }
      var specimenList = list.map(function (item) {
        return function () {
          return _this6.updateSpecimen(item.specimen);
        };
      });
      var containerList = list.map(function (item) {
        return function () {
          return _this6.updateContainer(item.container);
        };
      });
      return Promise.all(specimenList.map(function (item) {
        return item();
      })).then(function () {
        return Promise.all(containerList.map(function (item) {
          return item();
        }));
      });
    }

    /**
     * Sends a request to update a container on the server
     *
     * @param {object} container - the container to update
     * @return {Promise}
     */
  }, {
    key: "updateContainer",
    value: function updateContainer(container) {
      var _this7 = this;
      var errors = this.validateContainer(container);
      if (!(0, _helpers.isEmpty)(errors)) {
        return Promise.reject({
          container: errors
        });
      }
      return (0, _helpers.post)(container, this.props.containerAPI, 'PUT').then(function (containers) {
        return _this7.setData('containers', containers);
      });
    }

    /**
     * Increase the coordinates of a container to put it in the
     * next available slot.
     *
     * @param {object} coordinate - the coordinate to increment
     * @param {number} parentContainerId - the parent container
     * @return {number}
     */
  }, {
    key: "increaseCoordinate",
    value: function increaseCoordinate(coordinate, parentContainerId) {
      var containers = this.state.data.containers;
      var childCoordinates = containers[parentContainerId].childContainerIds.reduce(function (result, id) {
        var container = containers[id];
        if (container.coordinate) {
          result[container.coordinate] = id;
        }
        return result;
      }, {});
      var increment = function increment(coord) {
        coord++;
        if (childCoordinates.hasOwnProperty(coord)) {
          coord = increment(coord);
        }
        return coord;
      };
      return increment(coordinate);
    }

    /**
     * Create a batch of specimens
     *
     * @param {object} list - list of specimens
     * @param {object} current - holds current state for specific values
     * @param {boolean} print - whether the barcodes should be printed
     * @return {Promise}
     */
  }, {
    key: "createSpecimens",
    value: function createSpecimens(list, current, print) {
      var _this8 = this;
      var _this$state = this.state,
        options = _this$state.options,
        data = _this$state.data;
      var projectIds = current.projectIds;
      var centerId = current.centerId;
      var availableId = Object.keys(options.container.stati).find(function (key) {
        return options.container.stati[key].label === 'Available';
      });
      var errors = {
        specimen: {},
        container: {},
        list: {}
      };
      var isError = false;
      Object.keys(list).reduce(function (coord, key) {
        // set specimen values
        var specimen = list[key];
        specimen.candidateId = current.candidateId;
        specimen.sessionId = current.sessionId;
        specimen.projectIds = projectIds;
        specimen.quantity = specimen.collection.quantity;
        specimen.unitId = specimen.collection.unitId;
        specimen.collection.centerId = centerId;
        if ((options.specimen.types[specimen.typeId] || {}).freezeThaw == 1) {
          specimen.fTCycle = 0;
        }
        specimen.parentSpecimenIds = current.parentSpecimenIds || null;

        // set container values
        var container = specimen.container;
        container.statusId = availableId;
        container.temperature = 20;
        container.centerId = centerId;
        container.originId = centerId;

        // If the container is assigned to a parent, place it sequentially in the
        // parent container and inherit the status, temperature and centerId.
        if (current.container.parentContainerId) {
          var containerParentId = current.container.parentContainerId;
          container.parentContainerId = current.container.parentContainerId;
          var parentContainer = data.containers[containerParentId];
          var dims = options.container.dimensions;
          var dimensions = dims[parentContainer.dimensionId];
          var capacity = dimensions.x * dimensions.y * dimensions.z;
          coord = _this8.increaseCoordinate(coord, current.container.parentContainerId);
          if (coord <= capacity) {
            container.coordinate = parseInt(coord);
          } else {
            container.coordinate = null;
          }
          container.statusId = parentContainer.statusId;
          container.temperature = parentContainer.temperature;
          container.centerId = parentContainer.centerId;
        }

        // if specimen type id is not set yet, this will throw an error
        if (specimen.typeId) {}
        specimen.container = container;
        list[key] = specimen;

        // this is so the global params (sessionId, candidateId, etc.) show errors
        // as well.
        errors.container = _this8.validateContainer(container, key);
        errors.specimen = _this8.validateSpecimen(specimen, key);
        if (!(0, _helpers.isEmpty)(errors.container)) {
          errors.list[key] = {
            container: errors.container
          };
        }
        if (!(0, _helpers.isEmpty)(errors.specimen)) {
          errors.list[key] = _objectSpread(_objectSpread({}, errors.list[key]), {}, {
            specimen: errors.specimen
          });
        }
        if (!(0, _helpers.isEmpty)(errors.list[key])) {
          isError = true;
        }
        return coord;
      }, 0);
      if (isError) {
        return Promise.reject(errors);
      }
      var printBarcodes = function printBarcodes(entities) {
        return new Promise(function (resolve) {
          if (print) {
            _sweetalert["default"].fire({
              title: 'Print Barcodes?',
              type: 'question',
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
              showCancelButton: true
            }).then(function (result) {
              if (result.value) {
                var labelParams = [];
                Object.values(entities.specimens).forEach(function (specimen) {
                  labelParams.push({
                    barcode: specimen.barcode,
                    type: options.specimen.types[specimen.typeId].label,
                    pscid: specimen.candidatePSCID,
                    sampleNumber: specimen.sampleNumber
                  });
                });
                return _this8.printLabel(labelParams);
              }
            }).then(function () {
              return resolve();
            })["catch"](function (error) {
              console.error('Printing error:', error);
              resolve();
            });
          } else {
            resolve();
          }
        });
      };
      return (0, _helpers.post)(list, this.props.specimenAPI, 'POST').then(function (entities) {
        return printBarcodes(entities).then(function () {
          _this8.setData('containers', entities.containers);
          _this8.setData('specimens', entities.specimens);
        });
      }).then(function () {
        return Promise.resolve();
      });
    }

    /**
     * Create containers
     *
     * @param {object} list - list of containers
     * @param {object} current - values held in current state
     * @param {object} errors - list of errors
     * @return {Promise}
     */
  }, {
    key: "createContainers",
    value: function createContainers(list, current, errors) {
      var _this9 = this;
      var stati = this.state.options.container.stati;
      var availableId = Object.keys(stati).find(function (key) {
        return stati[key].label === 'Available';
      });
      var isError = false;
      Object.entries(list).forEach(function (_ref) {
        var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
          key = _ref2[0],
          container = _ref2[1];
        container.statusId = availableId;
        container.temperature = 20;
        container.originId = current.centerId;
        container.centerId = current.centerId;
        errors.container = _this9.validateContainer(container, key);
        errors.list[key] = _this9.validateContainer(container, key);
        if (!(0, _helpers.isEmpty)(errors.list[key])) {
          isError = true;
        }
      });
      if (isError) {
        return Promise.reject(errors);
      }
      return (0, _helpers.post)(list, this.props.containerAPI, 'POST').then(function (containers) {
        return _this9.setData('containers', containers);
      }).then(function () {
        return Promise.resolve();
      });
    }

    /**
     * Create a new pool
     *
     * @param {object} pool - the pool to create
     * @param {object} list - the specimens to add to the pool
     * @return {Promise}
     */
  }, {
    key: "createPool",
    value: function createPool(pool, list) {
      var _this10 = this;
      var stati = this.state.options.container.stati;
      var dispensedId = Object.keys(stati).find(function (key) {
        return stati[key].label === 'Dispensed';
      });
      var update = Object.values(list).reduce(function (result, item) {
        item.container.statusId = dispensedId;
        item.specimen.quantity = '0';

        // XXX: By updating the container and specimen after, it's causing issues
        // if they don't meet validation. The error is being thrown only after the
        // pool has already been saved to the database! Not sure how to resolve this.
        return [].concat((0, _toConsumableArray2["default"])(result), [function () {
          return _this10.updateContainer(item.container, false);
        }, function () {
          return _this10.updateSpecimen(item.specimen, false);
        }]);
      }, []);
      var errors = this.validatePool(pool);
      if (!(0, _helpers.isEmpty)(errors)) {
        return Promise.reject(errors);
      }
      return (0, _helpers.post)(pool, this.props.poolAPI, 'POST').then(function (pools) {
        return _this10.setData('pools', pools);
      }).then(function () {
        return Promise.all(update.map(function (update) {
          return update();
        }));
      });
    }

    /**
     * Save a batch of edits
     *
     * @param {object} list - a list of edits
     * @return {Promise}
     */
  }, {
    key: "saveBatchEdit",
    value: function saveBatchEdit(list) {
      var _this11 = this;
      var saveList = list.map(function (specimen) {
        return function () {
          return (0, _helpers.post)(specimen, _this11.props.specimenAPI, 'PUT');
        };
      });
      var errors = this.validateSpecimen(list[0]);
      if (!(0, _helpers.isEmpty)(errors)) {
        return Promise.reject(errors);
      }
      return Promise.all(saveList.map(function (item) {
        return item();
      })).then(function (data) {
        return Promise.all(data.map(function (item) {
          return _this11.setData('specimens', item);
        }));
      }).then(function () {
        return _sweetalert["default"].fire('Batch Preparation Successful!', '', 'success');
      });
    }

    /**
     * Validate a specimen
     *
     * @param {object} specimen - the specimen to validate
     * @return {object} an object of errors
     */
  }, {
    key: "validateSpecimen",
    value: function validateSpecimen(specimen) {
      var errors = {};
      var required = ['typeId', 'quantity', 'unitId', 'candidateId', 'sessionId', 'projectIds', 'collection'];
      var _float = ['quantity'];
      var positive = ['quantity', 'fTCycle'];
      var integer = ['fTCycle'];
      required.map(function (field) {
        // TODO: seems like for certain cases it needs to be !== null
        if (!specimen[field]) {
          errors[field] = 'This field is required! ';
        }
      });
      _float.map(function (field) {
        if (isNaN(parseInt(specimen[field])) || !isFinite(specimen[field])) {
          errors[field] = 'This field must be a number! ';
        }
      });
      positive.map(function (field) {
        if (specimen[field] != null && specimen[field] < 0) {
          errors[field] = 'This field must not be negative!';
        }
      });
      integer.map(function (field) {
        if (specimen[field] != null && !/^\+?(0|[1-9]\d*)$/.test(specimen[field])) {
          errors[field] = 'This field must be an integer!';
        }
      });
      var optspecimen = this.state.options.specimen;
      errors.collection = this.validateProcess(specimen.collection, optspecimen.protocolAttributes[specimen.collection.protocolId], ['protocolId', 'examinerId', 'quantity', 'unitId', 'centerId', 'date', 'time'], ['quantity']);

      // collection should only be set if there are errors associated with it.
      if ((0, _helpers.isEmpty)(errors.collection)) {
        delete errors.collection;
      }
      if (specimen.preparation) {
        errors.preparation = this.validateProcess(specimen.preparation, optspecimen.protocolAttributes[specimen.preparation.protocolId], ['protocolId', 'examinerId', 'centerId', 'date', 'time']);
      }
      if ((0, _helpers.isEmpty)(errors.preparation)) {
        delete errors.preparation;
      }
      if (specimen.analysis) {
        errors.analysis = this.validateProcess(specimen.analysis, optspecimen.protocolAttributes[specimen.analysis.protocolId], ['protocolId', 'examinerId', 'centerId', 'date', 'time']);
      }
      if ((0, _helpers.isEmpty)(errors.analysis)) {
        delete errors.analysis;
      }
      return errors;
    }

    /**
     * Validate a process
     *
     * @param {object} process - the process to validate
     * @param {object} attributes - the attributes of the process
     * @param {array} required - the required fields
     * @param {array} number - an array of fields that must be numbers
     * @return {object} errors
     */
  }, {
    key: "validateProcess",
    value: function validateProcess(process, attributes, required, number) {
      var errors = {};
      var regex;

      // validate required fields
      required && required.map(function (field) {
        if (!process[field]) {
          errors[field] = 'This field is required! ';
        }
      });

      // validate floats
      number && number.map(function (field) {
        if (isNaN(parseInt(process[field])) || !isFinite(process[field])) {
          errors[field] = 'This field must be a number! ';
        }
      });

      // validate date
      regex = /^[12]\d{3}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
      if (regex.test(process.date) === false) {
        errors.date = 'This field must be a valid date! ';
      }

      // validate time
      regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (regex.test(process.time) === false) {
        errors.time = 'This field must be a valid time! ';
      }

      // validate custom attributes
      if (!(0, _helpers.isEmpty)(process.data)) {
        errors.data = {};
        var specimenopts = this.state.options.specimen;
        var datatypes = specimenopts.attributeDatatypes;
        var protocolId = process.protocolId;
        var protocolAttributes = specimenopts.protocolAttributes[protocolId];
        // FIXME: This if statement was introduced because certain processes have
        // a data object even though their protocol isn't associated with attributes.
        // This is a sign of bad importing/configuration and should be fixed in
        // configuration rather than here.
        if (protocolAttributes) {
          Object.keys(protocolAttributes).forEach(function (attributeId) {
            // validate required
            if (protocolAttributes[attributeId].required == 1 && !process.data[attributeId]) {
              errors.data[attributeId] = 'This field is required!';
            }
            var dataTypeId = attributes[attributeId].datatypeId;
            // validate number
            if (datatypes[dataTypeId].datatype === 'number') {
              if (isNaN(parseInt(process.data[attributeId])) || !isFinite(process.data[attributeId])) {
                errors.data[attributeId] = 'This field must be a number!';
              }
            }

            // validate date
            if (datatypes[dataTypeId].datatype === 'date') {
              regex = /^[12]\d{3}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
              if (regex.test(process.data[attributeId]) === false) {
                errors.data[attributeId] = 'This field must be a valid date! ';
              }
            }

            // validate time
            if (datatypes[dataTypeId].datatype === 'time') {
              regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
              if (regex.test(process.data[attributeId]) === false) {
                errors.data[attributeId] = 'This field must be a valid time! ';
              }
            }

            // TODO: Eventually introduce file validation.
          });
        }

        if ((0, _helpers.isEmpty)(errors.data)) {
          delete errors.data;
        }
      }
      return errors;
    }

    /**
     * Validate a container object
     *
     * @param {object} container - the container to validate
     * @return {object} - an object full of errors
     */
  }, {
    key: "validateContainer",
    value: function validateContainer(container) {
      var errors = {};
      var required = ['barcode', 'typeId', 'temperature', 'statusId', 'centerId'];
      var _float2 = ['temperature'];
      required.map(function (field) {
        if (!container[field]) {
          errors[field] = 'This field is required! ';
        }
      });
      _float2.map(function (field) {
        if (isNaN(parseInt(container[field])) || !isFinite(container[field])) {
          errors[field] = 'This field must be a number! ';
        }
      });
      Object.values(this.state.data.containers).map(function (c) {
        if (container.barcode === c.barcode && container.id !== c.id) {
          errors.barcode = 'Barcode must be unique.';
        }
      });

      // TODO: Regex barcode check will eventually go here.
      // The regex is not currently in the schema and should be implemented here
      // when it is.

      return errors;
    }

    /**
     * Validate a pool of speciments
     *
     * @param {object} pool - The pool to validate
     * @return {object} an object of any errors
     */
  }, {
    key: "validatePool",
    value: function validatePool(pool) {
      var regex;
      var errors = {};
      var required = ['label', 'quantity', 'unitId', 'date', 'time'];
      required.forEach(function (field) {
        if (!pool[field]) {
          errors[field] = 'This field is required! ';
        }
      });
      if (isNaN(parseInt(pool.quantity)) || !isFinite(pool.quantity)) {
        errors.quantity = 'This field must be a number! ';
      }

      // validate date
      regex = /^[12]\d{3}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
      if (regex.test(pool.date) === false) {
        errors.date = 'This field must be a valid date! ';
      }

      // validate time
      regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (regex.test(pool.time) === false) {
        errors.time = 'This field must be a valid time! ';
      }
      if (pool.specimenIds == null || pool.specimenIds.length < 2) {
        errors.total = 'Pooling requires at least 2 specimens';
      }
      return errors;
    }

    /**
     * Render React component
     *
     * @return {JSX}
     */
  }, {
    key: "render",
    value: function render() {
      var _this12 = this;
      var barcode = function barcode(props) {
        var target = _this12.routeBarcode(props.match.params.barcode);
        return /*#__PURE__*/React.createElement(_barcodePage["default"], {
          history: props.history,
          specimen: target.specimen,
          container: target.container,
          data: _this12.state.data,
          options: _this12.state.options,
          updateSpecimen: _this12.updateSpecimen,
          updateContainer: _this12.updateContainer,
          createSpecimens: _this12.createSpecimens,
          createContainers: _this12.createContainers,
          printLabel: _this12.printLabel,
          increaseCoordinate: _this12.increaseCoordinate,
          loading: _this12.state.loading
        });
      };
      var filter = function filter(props) {
        return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_filter["default"], {
          history: props.history,
          data: _this12.state.data,
          setData: _this12.setData,
          options: _this12.state.options,
          increaseCoordinate: _this12.increaseCoordinate,
          createPool: _this12.createPool,
          createContainers: _this12.createContainers,
          createSpecimens: _this12.createSpecimens,
          editSpecimens: _this12.editSpecimens,
          updateSpecimens: _this12.updateSpecimens,
          loading: _this12.state.loading
        }));
      };
      return /*#__PURE__*/React.createElement(_reactRouterDom.BrowserRouter, {
        basename: "/biobank"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_reactRouterDom.Switch, null, /*#__PURE__*/React.createElement(_reactRouterDom.Route, {
        exact: true,
        path: "/",
        render: filter
      }), /*#__PURE__*/React.createElement(_reactRouterDom.Route, {
        exact: true,
        path: "/barcode=:barcode",
        render: barcode
      }))));
    }
  }]);
  return BiobankIndex;
}(_react.Component); // biobankIndex.propTypes
BiobankIndex.propTypes = {
  specimenAPI: _propTypes["default"].object.isRequired,
  containerAPI: _propTypes["default"].object.isRequired,
  poolAPI: _propTypes["default"].object.isRequired,
  optionsAPI: _propTypes["default"].object.isRequired,
  labelAPI: _propTypes["default"].object.isRequired
};
window.addEventListener('load', function () {
  var biobank = "".concat(loris.BaseURL, "/biobank/");
  ReactDOM.render( /*#__PURE__*/React.createElement(BiobankIndex, {
    specimenAPI: "".concat(biobank, "specimenendpoint/"),
    containerAPI: "".concat(biobank, "containerendpoint/"),
    poolAPI: "".concat(biobank, "poolendpoint/"),
    optionsAPI: "".concat(biobank, "optionsendpoint/"),
    labelAPI: "".concat(biobank, "labelendpoint/")
  }), document.getElementById('lorisworkspace'));
});
})();

((window.lorisjs = window.lorisjs || {}).biobank = window.lorisjs.biobank || {}).biobankIndex = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=biobankIndex.js.map