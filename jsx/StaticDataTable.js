/**
 * This file contains React component for Static Data Table
 *
 * @author Loris Team
 * @version 1.0.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PaginationLinks from 'jsx/PaginationLinks';
import createFragment from 'react-addons-create-fragment';

/**
 * Static Data Table component
 * Displays a set of data that is receives via props.
 */
class StaticDataTable extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      PageNumber: 1,
      SortColumn: -1,
      SortOrder: 'ASC',
      RowsPerPage: 20,
      Hide: this.props.Hide,
    };

    this.changePage = this.changePage.bind(this);
    this.setSortColumn = this.setSortColumn.bind(this);
    this.changeRowsPerPage = this.changeRowsPerPage.bind(this);
    this.downloadCSV = this.downloadCSV.bind(this);
    this.countFilteredRows = this.countFilteredRows.bind(this);
    this.toCamelCase = this.toCamelCase.bind(this);
    this.getSortedRows = this.getSortedRows.bind(this);
    this.hasFilterKeyword = this.hasFilterKeyword.bind(this);
  }

  /**
   * shouldComponentUpdate
   *
   * @param {object} nextProps - next props
   * @param {object} nextState - next state
   * @param {object} nextContext - next context
   * @return {boolean} update component if true.
   */
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    // prevents multiple reloads of the table in the DQT module.
    return !(this.props.DisableFilter && nextProps.Data === this.props.Data
      && nextState === this.state);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    if (jQuery.fn.DynamicTable && !this.props.NoDynamicTable) {
      if (this.props.freezeColumn) {
        $('#dynamictable').DynamicTable({
          freezeColumn: this.props.freezeColumn,
        });
      } else {
        $('#dynamictable').DynamicTable();
      }
    }
    if (!this.props.DisableFilter) {
      // Retrieve module preferences
      let modulePrefs = JSON.parse(localStorage.getItem('modulePrefs'));

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
      let rowsPerPage = modulePrefs[loris.TestName].rowsPerPage;
      this.setState({
        RowsPerPage: rowsPerPage,
      });

      // Make prefs accesible within component
      this.modulePrefs = modulePrefs;
    }
  }

  /**
   * Called by React when the component is updated.
   *
   * @param {object} prevProps - Previous React Component properties
   * @param {object} prevState - Previous React Component state
   */
  componentDidUpdate(prevProps, prevState) {
    if (jQuery.fn.DynamicTable && !this.props.NoDynamicTable) {
      if (this.props.freezeColumn) {
        $('#dynamictable').DynamicTable({
          freezeColumn: this.props.freezeColumn,
        });
      } else {
        $('#dynamictable').DynamicTable();
      }
    }
    if (!this.props.DisableFilter) {
      if (this.props.onSort &&
        (this.state.SortColumn !== prevState.SortColumn ||
          this.state.SortOrder !== prevState.SortOrder)
      ) {
        let index = this.getSortedRows();
        this.props.onSort(index, this.props.Data, this.props.Headers);
      }
    }
  }

  /**
   * Set the component page variable
   * to a new value
   *
   * @param {number} pageNo - Page index
   */
  changePage(pageNo) {
    this.setState({
      PageNumber: pageNo,
    });
  }

  /**
   * Update the sort column
   * If component sortColumn is already set to colNumber
   * Toggle SortOrder ASC/DESC
   *
   * @param {number} colNumber - The column index
   * @return {Function} - onClick Event Handler
   */
  setSortColumn(colNumber) {
    return function(e) {
      if (this.state.SortColumn === colNumber) {
        this.setState({
          SortOrder: this.state.SortOrder === 'ASC' ? 'DESC' : 'ASC',
        });
      } else {
        this.setState({
          SortColumn: colNumber,
        });
      }
    }.bind(this);
  }

  /**
   * Update the number of rows per page
   *
   * @param {object} val
   */
  changeRowsPerPage(val) {
    if (!this.props.DisableFilter) {
      let modulePrefs = this.modulePrefs;

      // Save current selection
      modulePrefs[loris.TestName].rowsPerPage = val.target.value;

      // Update localstorage
      localStorage.setItem('modulePrefs', JSON.stringify(modulePrefs));
    }
    this.setState({
      RowsPerPage: val.target.value,
      PageNumber: 1,
    });
  }

  /**
   * Export the filtered rows and columns into a csv
   *
   * @param {array} csvData - The csv data
   */
  downloadCSV(csvData) {
    let csvworker = new Worker(loris.BaseURL + '/js/workers/savecsv.js');

    csvworker.addEventListener('message', function(e) {
      let dataURL;
      let dataDate;
      let link;
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

    const correctReactLinks = (csvData) => {
      for (const [index] of Object.entries(csvData)) {
        for (const [indexChild] of Object.entries(csvData[index])) {
          if (csvData[index][indexChild] == null) {
            csvData[index][indexChild] = [''];
          } else if (csvData[index][indexChild].type === 'a') {
            csvData[index][indexChild] = [
              csvData[index][indexChild].props['href'],
            ];
          }
        }
      }
      return csvData;
    };

    const csvDownload = correctReactLinks([...csvData]);
    csvworker.postMessage({
      cmd: 'SaveFile',
      data: csvDownload,
      headers: this.props.Headers,
      identifiers: this.props.RowNameMap,
    });
  }

  /**
   * Get the number of filtered rows
   *
   * @return {number}
   */
  countFilteredRows() {
    let useKeyword = false;
    let filterMatchCount = 0;
    let filterValuesCount = (this.props.Filter ?
      Object.keys(this.props.Filter).length :
      0
    );
    let tableData = this.props.Data;
    let headersData = this.props.Headers;

    if (this.props.Filter.keyword) {
      useKeyword = true;
    }

    if (useKeyword) {
      filterValuesCount -= 1;
    }

    for (let i = 0; i < tableData.length; i++) {
      let headerCount = 0;
      let keywordMatch = 0;
      for (let j = 0; j < headersData.length; j++) {
        let data = tableData[i] ? tableData[i][j] : null;
        if (this.hasFilterKeyword(headersData[j], data)) {
          headerCount++;
        }
        if (useKeyword) {
          if (this.hasFilterKeyword('keyword', data)) {
            keywordMatch++;
          }
        }
      }

      if (headerCount === filterValuesCount &&
        ((useKeyword === true && keywordMatch > 0) ||
          (useKeyword === false && keywordMatch === 0))) {
        filterMatchCount++;
      }
    }

    let hasFilters = (filterValuesCount !== 0);
    if (filterMatchCount === 0 && hasFilters) {
      return 0;
    }

    return (filterMatchCount === 0) ? tableData.length : filterMatchCount;
  }

  /**
   * Convert a string to CamelCase
   *
   * @param {string} str
   * @return {string}
   */
  toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (Number(match) === 0) return '';
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

  /**
   * Get if the current sorting column has mixed types in its values.
   *
   * @return {boolean} true if mixed types, else false.
   */
  hasMixedTypes() {
    // TODO: data column type check should probably be done once at init,
    // meaning when receiving data, to find which columns have mixed types.
    let typeFound = null;

    // not the default column
    if (this.state.SortColumn === -1) {
      return false;
    }

    // Only checks string or number types, others are considered undefined.
    // Break out of this loop once we encounter two mixed types:
    // number and string inside the sorted column.
    for (const row of this.props.Data) {
      // cell value
      let val = row[this.state.SortColumn];

      // if null or undefined, go to the next iteration
      if (val == null) {
        continue;
      }

      // check number
      if (!isNaN(val) && typeof val !== 'object') {
        // if string is found, mix of types, break
        if (typeFound === 'string') {
          return true;
        }
        // register number only if not already in
        if (typeFound == null) {
          typeFound = 'number';
        }

        // avoid string section
        continue;
      }

      // check string
      if (typeof val === 'string' || val instanceof String) {
        // if number is found, mix of types, break
        if (typeFound === 'number') {
          return true;
        }
        // register string only if not already in
        if (typeFound == null) {
          typeFound = 'string';
        }
      }
    }
    return false;
  }

  /**
   * Sort the rows according to the sort configuration
   *
   * @return {object[]}
   */
  getSortedRows() {
    const index = [];

    // is the current sorted column with mixed type?
    const isMixedType = this.hasMixedTypes();

    //
    for (let i = 0; i < this.props.Data.length; i += 1) {
      let val = this.props.Data[i][this.state.SortColumn] || undefined;
      // If SortColumn is equal to default No. column, set value to be
      // index + 1
      if (this.state.SortColumn === -1) {
        val = i + 1;
      }
      const isString = (typeof val === 'string' || val instanceof String);
      const isNumber = !isNaN(val) && typeof val !== 'object';

      if (val === '.') {
        // hack to handle non-existent items in DQT
        val = null;
      } else if (isNumber && !isMixedType) {
        // perform type conversion (from string to int/float)
        val = Number(val);
      } else if (isString || isMixedType) {
        // in case of mixed types, force values to string.
        val = String(val);
        // if string with text convert to lowercase
        val = val.toLowerCase();
      } else {
        val = undefined;
      }

      if (this.props.RowNameMap) {
        index.push({RowIdx: i, Value: val, Content: this.props.RowNameMap[i]});
      } else {
        index.push({RowIdx: i, Value: val, Content: i + 1});
      }
    }

    index.sort(function(a, b) {
      if (this.state.SortOrder === 'ASC') {
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
    }.bind(this));
    return index;
  }

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
  hasFilterKeyword(headerData, data) {
    let header = this.toCamelCase(headerData);
    let filterData = null;
    let exactMatch = false;
    let result = false;
    let searchKey = null;
    let searchString = null;

    if (this.props.Filter[header]) {
      filterData = this.props.Filter[header].value;
      exactMatch = this.props.Filter[header].exactMatch;
    }

    // Handle null inputs
    if (filterData === null || data === null) {
      return false;
    }

    // Handle numeric inputs
    if (typeof filterData === 'number') {
      let intData = Number.parseInt(data, 10);
      result = (filterData === intData);
    }

    // Handle string inputs
    if (typeof filterData === 'string') {
      searchKey = filterData.toLowerCase();
      searchString = data.toLowerCase();

      if (exactMatch) {
        result = (searchString === searchKey);
      } else {
        result = (searchString.indexOf(searchKey) > -1);
      }
    }

    // Handle array inputs for multiselects
    if (typeof filterData === 'object') {
      let match = false;
      for (let i = 0; i < filterData.length; i += 1) {
        searchKey = filterData[i].toLowerCase();
        searchString = data.toLowerCase();
        match = (searchString === searchKey);
        if (match) {
          result = true;
        }
      }
    }
    return result;
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    if (this.props.Data === null || this.props.Data.length === 0) {
      return (
        <div className='alert alert-info no-result-found-panel'>
          <strong>No result found.</strong>
        </div>
      );
    }
    let rowsPerPage = this.state.RowsPerPage;
    let headers = this.state.Hide.defaultColumn === true ? [] : [
      <th key='th_col_0' onClick={this.setSortColumn(-1).bind(this)}>
        {this.props.RowNumLabel}
      </th>,
    ];

    for (let i = 0; i < this.props.Headers.length; i += 1) {
      if (typeof loris.hiddenHeaders === 'undefined' ||
        loris.hiddenHeaders.indexOf(this.props.Headers[i]) === -1) {
        let colIndex = i + 1;
        if (this.props.Headers[i] === this.props.freezeColumn) {
          headers.push(
            <th key={'th_col_' + colIndex} id={this.props.freezeColumn}
              onClick={this.setSortColumn(i).bind(this)}>
              {this.props.Headers[i]}
            </th>
          );
        } else {
          headers.push(
            <th
              key={'th_col_' + colIndex}
              onClick={this.setSortColumn(i).bind(this)}
            >
              {this.props.Headers[i]}
            </th>
          );
        }
      }
    }
    let rows = [];
    let curRow = [];
    let index = this.getSortedRows();
    let matchesFound = 0; // Keeps track of how many rows where displayed so far across all pages
    let filteredRows = this.props.DisableFilter ?
      this.props.Data.length : this.countFilteredRows();
    let currentPageRow = (rowsPerPage * (this.state.PageNumber - 1));
    let filteredData = [];
    let useKeyword = false;

    if (this.props.Filter.keyword) {
      useKeyword = true;
    }

    // Push rows to data table
    for (let i = 0;
      (i < this.props.Data.length) && (rows.length < rowsPerPage);
      i++
    ) {
      curRow = [];

      // Counts filter matches
      let filterMatchCount = 0;
      let keywordMatch = 0;
      let filterLength = 0;

      // Iterates through headers to populate row columns
      // with corresponding data
      for (let j = 0; j < this.props.Headers.length; j += 1) {
        let data = 'Unknown';

        // Set column data
        if (this.props.Data[index[i].RowIdx]) {
          data = this.props.Data[index[i].RowIdx][j];
        }

        if (this.props.DisableFilter) {
          filterLength = Object.keys(this.props.Filter).length;
        } else {
          if (this.hasFilterKeyword(this.props.Headers[j], data)) {
            filterMatchCount++;
          }

          if (useKeyword === true) {
            filterLength = Object.keys(this.props.Filter).length - 1;
            if (this.hasFilterKeyword('keyword', data)) {
              keywordMatch++;
            }
          } else {
            filterLength = Object.keys(this.props.Filter).length;
          }
        }

        let key = 'td_col_' + j;

        // Get custom cell formatting if available
        if (this.props.getFormattedCell) {
          data = this.props.getFormattedCell(
            this.props.Headers[j],
            data,
            this.props.Data[index[i].RowIdx],
            this.props.Headers,
            j
          );
          if (data !== null) {
            // Note: Can't currently pass a key, need to update columnFormatter
            // to not return a <td> node. Using createFragment instead.
            curRow.push(createFragment({data}));
          }
        } else {
          curRow.push(<td key={key}>{data}</td>);
        }
      }

      // Only display a row in the table or csv
      // if all filter values have been matched
      if ((filterLength === filterMatchCount) &&
        ((useKeyword === true && keywordMatch > 0) ||
          (useKeyword === false && keywordMatch === 0))) {
        matchesFound++;
        if (matchesFound > currentPageRow) {
          const rowIndex = index[i].Content;
          const rowCell = this.state.Hide.defaultColumn !== true ?
            <td>{rowIndex}</td> : null;

          rows.push(
            <tr key={'tr_' + rowIndex} colSpan={headers.length}>
              {rowCell}
              {curRow}
            </tr>
          );
        }
        if (!this.props.DisableFilter) {
          filteredData.push(this.props.Data[index[i].RowIdx]);
        }
      }
    }

    let RowsPerPageDropdown = (
      <select
        className="input-sm perPage"
        onChange={this.changeRowsPerPage}
        value={this.state.RowsPerPage}
      >
        <option>20</option>
        <option>50</option>
        <option>100</option>
        <option>1000</option>
        <option>5000</option>
        <option>10000</option>
      </select>
    );

    // Include only filtered data if filters were applied
    let csvData = this.props.Data;
    if (this.props.Filter && filteredData.length > 0) {
      csvData = filteredData;
    }

    let header = this.state.Hide.rowsPerPage === true ? '' : (
      <div className="table-header panel-heading">
        <div className="row">
          <div className="col-xs-12">
            {rows.length} rows displayed of {filteredRows}.
            (Maximum rows per page: {RowsPerPageDropdown})
            <div className="pull-right">
              <PaginationLinks
                Total={filteredRows}
                onChangePage={this.changePage}
                RowsPerPage={rowsPerPage}
                Active={this.state.PageNumber}
              />
            </div>
          </div>
        </div>
      </div>
    );

    let footer = this.state.Hide.downloadCSV === true ? '' : (
      <div className="panel-footer table-footer">
        <div className="row">
          <div className="col-xs-12">
            <div className="col-xs-12 footerText">
              {rows.length} rows displayed of {filteredRows}.
              (Maximum rows per page: {RowsPerPageDropdown})
            </div>
            <div className="col-xs-6">
              <button
                className="btn btn-primary downloadCSV"
                onClick={this.downloadCSV.bind(null, csvData)}
              >
                Download Table as CSV
              </button>
            </div>
            <div className="pull-right">
              <PaginationLinks
                Total={filteredRows}
                onChangePage={this.changePage}
                RowsPerPage={rowsPerPage}
                Active={this.state.PageNumber}
              />
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="panel panel-default">
        {header}
        <table
          className="table table-hover table-primary table-bordered"
          id="dynamictable"
        >
          <thead>
            <tr className="info">{headers}</tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
        {footer}
      </div>
    );
  }
}
StaticDataTable.propTypes = {
  Headers: PropTypes.array.isRequired,
  Data: PropTypes.array.isRequired,
  RowNumLabel: PropTypes.string,
  // Function of which returns a JSX element for a table cell, takes
  // parameters of the form: func(ColumnName, CellData, EntireRowData)
  getFormattedCell: PropTypes.func,
  onSort: PropTypes.func,
  Hide: PropTypes.object,
  hiddenHeaders: PropTypes.array,
  DisableFilter: PropTypes.bool,
  NoDynamicTable: PropTypes.bool,
  freezeColumn: PropTypes.string,
  RowNameMap: PropTypes.string,
  Filter: PropTypes.object,
};

StaticDataTable.defaultProps = {
  Headers: [],
  Data: {},
  RowNumLabel: 'No.',
  Filter: {},
  Hide: {
    rowsPerPage: false,
    downloadCSV: false,
    defaultColumn: false,
  },
  DisableFilter: false,
  NoDynamicTable: false,
};

window.StaticDataTable = StaticDataTable;

export default StaticDataTable;
