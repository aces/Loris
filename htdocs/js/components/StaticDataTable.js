"use strict";

/* exported RStaticDataTable */

/**
 * This file contains React component for Static Data Table
 *
 * @author Loris Team
 * @version 1.0.0
 *
 */

/**
 * Static Data Table component
 * Displays a set of data that is receives via props.
 */
var StaticDataTable = React.createClass({
  displayName: "StaticDataTable",

  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    Headers: React.PropTypes.array.isRequired,
    Data: React.PropTypes.array.isRequired,
    RowNumLabel: React.PropTypes.string,
    // Function of which returns a JSX element for a table cell, takes
    // parameters of the form: func(ColumnName, CellData, EntireRowData)
    getFormattedCell: React.PropTypes.func
  },
  componentDidMount: function componentDidMount() {
    if (jQuery.fn.DynamicTable) {
      if (this.props.freezeColumn) {
        $("#dynamictable").DynamicTable({
          freezeColumn: this.props.freezeColumn
        });
      } else {
        $("#dynamictable").DynamicTable();
      }
    }

    // Retrieve module preferences
    var modulePrefs = JSON.parse(localStorage.getItem('modulePrefs'));

    // Init modulePrefs object
    if (modulePrefs === null) {
      modulePrefs = {};
    }

    // Init modulePrefs for current module
    if (modulePrefs[loris.TestName] === undefined) {
      modulePrefs[loris.TestName] = {};
      modulePrefs[loris.TestName].rowsPerPage = this.state.RowsPerPage;
    }

    // Set rows per page
    var rowsPerPage = modulePrefs[loris.TestName].rowsPerPage;
    this.setState({
      RowsPerPage: rowsPerPage
    });

    // Make prefs accesible within component
    this.modulePrefs = modulePrefs;
  },
  componentDidUpdate: function componentDidUpdate() {
    if (jQuery.fn.DynamicTable) {
      if (this.props.freezeColumn) {
        $("#dynamictable").DynamicTable({
          freezeColumn: this.props.freezeColumn
        });
      } else {
        $("#dynamictable").DynamicTable();
      }
    }
  },
  getInitialState: function getInitialState() {
    return {
      PageNumber: 1,
      SortColumn: -1,
      SortOrder: 'ASC',
      RowsPerPage: 20
    };
  },
  getDefaultProps: function getDefaultProps() {
    return {
      Headers: [],
      Data: {},
      RowNumLabel: 'No.',
      Filter: {}
    };
  },
  changePage: function changePage(pageNo) {
    this.setState({
      PageNumber: pageNo
    });
  },
  setSortColumn: function setSortColumn(colNumber) {
    var that = this;
    return function (e) {
      if (that.state.SortColumn === colNumber) {
        that.setState({
          SortOrder: that.state.SortOrder === 'ASC' ? 'DESC' : 'ASC'
        });
      } else {
        that.setState({
          SortColumn: colNumber
        });
      }
    };
  },
  changeRowsPerPage: function changeRowsPerPage(val) {
    var rowsPerPage = val.target.value;
    var modulePrefs = this.modulePrefs;

    // Save current selection
    modulePrefs[loris.TestName].rowsPerPage = rowsPerPage;

    // Update localstorage
    localStorage.setItem('modulePrefs', JSON.stringify(modulePrefs));

    this.setState({
      RowsPerPage: rowsPerPage,
      PageNumber: 1
    });
  },
  downloadCSV: function downloadCSV() {
    var csvworker = new Worker(loris.BaseURL + '/js/workers/savecsv.js');

    csvworker.addEventListener('message', function (e) {
      var dataURL;
      var dataDate;
      var link;
      if (e.data.cmd === 'SaveCSV') {
        dataDate = new Date().toISOString();
        dataURL = window.URL.createObjectURL(e.data.message);
        link = document.createElement("a");
        link.download = "data-" + dataDate + ".csv";
        link.type = "text/csv";
        link.href = dataURL;
        document.body.appendChild(link);
        $(link)[0].click();
        document.body.removeChild(link);
      }
    });
    csvworker.postMessage({
      cmd: 'SaveFile',
      data: this.props.Data,
      headers: this.props.Headers,
      identifiers: this.props.RowNameMap
    });
  },
  countFilteredRows: function countFilteredRows() {
    var filterMatchCount = 0;
    var filterValuesCount = this.props.Filter ? Object.keys(this.props.Filter).length : 0;
    var tableData = this.props.Data;
    var headersData = this.props.Headers;

    for (var i = 0; i < tableData.length; i++) {
      var headerCount = 0;

      for (var j = 0; j < headersData.length; j++) {
        var data = tableData[i] ? tableData[i][j] : null;
        if (this.hasFilterKeyword(headersData[j], data)) {
          headerCount++;
        }
      }

      if (headerCount === filterValuesCount) {
        filterMatchCount++;
      }
    }

    var hasFilters = filterValuesCount !== 0;
    if (filterMatchCount === 0 && hasFilters) {
      return 0;
    }

    return filterMatchCount === 0 ? tableData.length : filterMatchCount;
  },
  toCamelCase: function toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (Number(match) === 0) return "";
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  },
  /**
   * Searches for the filter keyword in the column cell
   *
   * Note: Search is case-insensitive.
   *
   * @param {string} headerData column name
   * @param {string} data search string
   * @return {boolean} true, if filter value is found to be a substring
   * of one of the column values, false otherwise.
   */
  hasFilterKeyword: function hasFilterKeyword(headerData, data) {
    var header = this.toCamelCase(headerData);
    var filterData = this.props.Filter[header] ? this.props.Filter[header] : null;

    // Handle nullinputs
    if (filterData === null || data === null) {
      return false;
    }

    // Handle numeric inputs
    if (typeof filterData === 'number') {
      var intData = Number.parseInt(data, 10);
      return filterData === intData;
    }

    // Handle string inputs
    if (typeof filterData === 'string') {
      var searchKey = filterData.toLowerCase();
      var searchString = data.toLowerCase();
      return searchString.indexOf(searchKey) > -1;
    }

    return false;
  },
  render: function render() {
    if (this.props.Data === null || this.props.Data.length === 0) {
      return React.createElement(
        "div",
        { className: "alert alert-info no-result-found-panel" },
        React.createElement(
          "strong",
          null,
          "No result found."
        )
      );
    }
    var rowsPerPage = this.state.RowsPerPage;
    var headers = [React.createElement(
      "th",
      { key: "th_col_0", onClick: this.setSortColumn(-1) },
      this.props.RowNumLabel
    )];
    for (var _i = 0; _i < this.props.Headers.length; _i += 1) {
      if (typeof loris.hiddenHeaders === "undefined" || loris.hiddenHeaders.indexOf(this.props.Headers[_i]) === -1) {
        var colIndex = _i + 1;
        if (this.props.Headers[_i] === this.props.freezeColumn) {
          headers.push(React.createElement(
            "th",
            { key: "th_col_" + colIndex, id: this.props.freezeColumn,
              onClick: this.setSortColumn(_i) },
            this.props.Headers[_i]
          ));
        } else {
          headers.push(React.createElement(
            "th",
            { key: "th_col_" + colIndex, onClick: this.setSortColumn(_i) },
            this.props.Headers[_i]
          ));
        }
      }
    }
    var rows = [];
    var curRow = [];
    var index = [];
    var that = this;

    for (var i = 0; i < this.props.Data.length; i += 1) {
      var val = this.props.Data[i][this.state.SortColumn];

      if (parseInt(val, 10) === val) {
        val = parseInt(val, 10);
      } else if (parseFloat(val) === val) {
        val = parseFloat(val);
      } else if (val === '.') {
        val = null;
      }

      // if string - convert to lowercase to make sort algorithm work
      var isString = typeof val === 'string' || val instanceof String;
      if (val !== undefined && isString) {
        val = val.toLowerCase();
      }

      if (this.props.RowNameMap) {
        index.push({ RowIdx: i, Value: val, Content: this.props.RowNameMap[i] });
      } else {
        index.push({ RowIdx: i, Value: val, Content: i + 1 });
      }
    }

    index.sort(function (a, b) {
      if (that.state.SortOrder === 'ASC') {
        // Check if null values
        if (a.Value === null) return -1;
        if (b.Value === null) return 1;

        // Sort by value
        if (a.Value < b.Value) return -1;
        if (a.Value > b.Value) return 1;

        // If all values are equal, sort by rownum
        if (a.RowIdx < b.RowIdx) {
          return -1;
        }
        if (a.RowIdx > b.RowIdx) return 1;
      } else {
        // Check if null values
        if (a.Value === null) return 1;
        if (b.Value === null) return -1;

        // Sort by value
        if (a.Value < b.Value) return 1;
        if (a.Value > b.Value) return -1;

        // If all values are equal, sort by rownum
        if (a.RowIdx < b.RowIdx) return 1;
        if (a.RowIdx > b.RowIdx) return -1;
      }
      // They're equal..
      return 0;
    });

    var matchesFound = 0; // Keeps track of how many rows where displayed so far across all pages
    var filteredRows = this.countFilteredRows();
    var currentPageRow = rowsPerPage * (this.state.PageNumber - 1);

    // Push rows to data table
    for (var _i2 = 0; _i2 < this.props.Data.length && rows.length < rowsPerPage; _i2++) {
      curRow = [];

      // Counts filter matches
      var filterMatchCount = 0;

      // Itterates through headers to populate row columns
      // with corresponding data
      for (var j = 0; j < this.props.Headers.length; j += 1) {
        var data = "Unknown";

        // Set column data
        if (this.props.Data[index[_i2].RowIdx]) {
          data = this.props.Data[index[_i2].RowIdx][j];
        }

        if (this.hasFilterKeyword(this.props.Headers[j], data)) {
          filterMatchCount++;
        }

        var key = 'td_col_' + j;

        // Get custom cell formatting if available
        if (this.props.getFormattedCell) {
          data = this.props.getFormattedCell(this.props.Headers[j], data, this.props.Data[index[_i2].RowIdx], this.props.Headers);
          if (data !== null) {
            // Note: Can't currently pass a key, need to update columnFormatter
            // to not return a <td> node
            curRow.push(data);
          }
        } else {
          curRow.push(React.createElement(
            "td",
            { key: key },
            data
          ));
        }
      }

      // Only display a row if all filter values have been matched
      if (Object.keys(this.props.Filter).length === filterMatchCount) {
        matchesFound++;
        if (matchesFound > currentPageRow) {
          var rowIndex = index[_i2].Content;
          rows.push(React.createElement(
            "tr",
            { key: 'tr_' + rowIndex, colSpan: headers.length },
            React.createElement(
              "td",
              null,
              rowIndex
            ),
            curRow
          ));
        }
      }
    }

    var RowsPerPageDropdown = React.createElement(
      "select",
      {
        className: "input-sm perPage",
        onChange: this.changeRowsPerPage,
        value: this.state.RowsPerPage
      },
      React.createElement(
        "option",
        null,
        "20"
      ),
      React.createElement(
        "option",
        null,
        "50"
      ),
      React.createElement(
        "option",
        null,
        "100"
      ),
      React.createElement(
        "option",
        null,
        "1000"
      ),
      React.createElement(
        "option",
        null,
        "5000"
      ),
      React.createElement(
        "option",
        null,
        "10000"
      )
    );

    return React.createElement(
      "div",
      { className: "panel panel-default" },
      React.createElement(
        "div",
        { className: "table-header panel-heading" },
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "div",
            { className: "col-xs-12" },
            rows.length,
            " rows displayed of ",
            filteredRows,
            ". (Maximum rows per page: ",
            RowsPerPageDropdown,
            ")",
            React.createElement(
              "div",
              { className: "pull-right" },
              React.createElement(PaginationLinks, {
                Total: filteredRows,
                onChangePage: this.changePage,
                RowsPerPage: rowsPerPage,
                Active: this.state.PageNumber
              })
            )
          )
        )
      ),
      React.createElement(
        "table",
        { className: "table table-hover table-primary table-bordered",
          id: "dynamictable"
        },
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            { className: "info" },
            headers
          )
        ),
        React.createElement(
          "tbody",
          null,
          rows
        )
      ),
      React.createElement(
        "div",
        { className: "panel-footer table-footer" },
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "div",
            { className: "col-xs-12" },
            React.createElement(
              "div",
              { className: "col-xs-12 footerText" },
              rows.length,
              " rows displayed of ",
              filteredRows,
              ". (Maximum rows per page: ",
              RowsPerPageDropdown,
              ")"
            ),
            React.createElement(
              "div",
              { className: "col-xs-6" },
              React.createElement(
                "button",
                {
                  className: "btn btn-primary downloadCSV",
                  onClick: this.downloadCSV
                },
                "Download Table as CSV"
              )
            ),
            React.createElement(
              "div",
              { className: "pull-right" },
              React.createElement(PaginationLinks, {
                Total: filteredRows,
                onChangePage: this.changePage,
                RowsPerPage: rowsPerPage,
                Active: this.state.PageNumber
              })
            )
          )
        )
      )
    );
  }
});

var RStaticDataTable = React.createFactory(StaticDataTable);