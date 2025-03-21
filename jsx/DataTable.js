import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PaginationLinks from 'jsx/PaginationLinks';
import createFragment from 'react-addons-create-fragment';
import {CTA} from 'jsx/Form';

/**
 * Data Table component
 * Displays a set of data that is receives via props.
 */
class DataTable extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      page: {
        number: 1,
        rows: 20,
      },
      sort: {
        column: -1,
        ascending: true,
      },
    };

    this.changePage = this.changePage.bind(this);
    this.setSortColumn = this.setSortColumn.bind(this);
    this.updateSortColumn = this.updateSortColumn.bind(this);
    this.toggleSortOrder = this.toggleSortOrder.bind(this);
    this.updatePageNumber = this.updatePageNumber.bind(this);
    this.updatePageRows = this.updatePageRows.bind(this);
    this.downloadCSV = this.downloadCSV.bind(this);
    this.getFilteredRowIndexes = this.getFilteredRowIndexes.bind(this);
    this.sortRows = this.sortRows.bind(this);
    this.hasFilterKeyword = this.hasFilterKeyword.bind(this);
    this.renderActions = this.renderActions.bind(this);
  }

  /**
   * Set the component page variable
   * to a new value
   *
   * @param {number} i - Page index
   */
  changePage(i) {
    const page = this.state.page;
    page.number = i;
    this.setState({page});
  }

  /**
   * Update the sort column
   * If component sort.column is already set to column
   * Toggle sort.ascending
   *
   * @param {number} column - The column index
   */
  setSortColumn(column) {
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
  updateSortColumn(column) {
    const sort = this.state.sort;
    sort.column = column;
    this.setState({sort});
  }

  /**
   * Toggle sort.ascending
   */
  toggleSortOrder() {
    const sort = this.state.sort;
    sort.ascending = !sort.ascending;
    this.setState({sort});
  }

  /**
   * Updates page state
   *
   * @param {number} number - Number of page
   */
  updatePageNumber(number) {
    const page = this.state.page;
    page.number = number;
    this.setState({page});
  }

  /**
   * Update number of rows per page
   *
   * @param {object} e - Event from which to abstract value
   */
  updatePageRows(e) {
    const page = Object.assign({}, this.state.page);
    page.rows = e.target.value;
    page.number = 1;
    this.setState({page});
  }

  /**
   * Export the filtered rows and columns into a csv
   *
   * @param {number[]} filteredRowIndexes - The filtered Row Indexes
   */

  downloadCSV(filteredRowIndexes) {
    let csvData = filteredRowIndexes.map((id) => this.props.data[id]);
    // Map cell data to proper values if applicable.
    if (this.props.getMappedCell) {
      csvData = csvData
        .map((row, i) => this.props.fields
          .flatMap((field, j) => this.props.getMappedCell(
            field.label,
            row[j],
            row,
            this.props.fields.map(
              (val) => val.label,
            ),
            j
          ))
        );
    }

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
    const headerList = this.props.fields.map((field) => field.label);
    csvworker.postMessage({
      cmd: 'SaveFile',
      data: csvData,
      headers: headerList,
      identifiers: this.props.RowNameMap,
    });
  }

  /**
   * Get the Filtered Row Indexes
   */
  getFilteredRowIndexes() {
    let useKeyword = false;
    let filterValuesCount = Object.keys(this.props.filters).length;
    let tableData = this.props.data;
    let fieldData = this.props.fields;

    let filteredIndexes = [];

    // If there are no filters set, use all the data.
    let hasFilters = (filterValuesCount !== 0);
    if (hasFilters === false) {
      for (let i = 0; i < tableData.length; i++) {
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

    for (let i = 0; i < tableData.length; i++) {
      let headerCount = 0;
      let keywordMatch = 0;
      for (let j = 0; j < fieldData.length; j++) {
        let data = tableData[i] ? tableData[i][j] : null;
        if (this.hasFilterKeyword((fieldData[j].filter || {}).name, data)) {
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
        filteredIndexes.push(i);
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
  sortRows(rowIndexes) {
    const index = [];

    for (let i = 0; i < rowIndexes.length; i++) {
      let idx = rowIndexes[i];
      let val = this.props.data[idx][this.state.sort.column] || undefined;

      // If sortColumn is equal to default No. column, set value to be
      // index + 1
      if (this.state.sort.column === -1) {
        val = idx + 1;
      }

      const isString = (typeof val === 'string' || val instanceof String);
      const isNumber = !isNaN(val) && typeof val !== 'object';

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
          Content: this.props.RowNameMap[idx],
        });
      } else {
        index.push({
          RowIdx: idx,
          Value: val,
          Content: idx + 1,
        });
      }
    }

    index.sort((a, b) => {
      if (this.state.sort.ascending) {
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
  hasFilterKeyword(name, data) {
    let filterData = null;
    let exactMatch = false;
    let opposite = false;
    let result = false;
    let searchKey = null;
    let searchString = null;

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
      let intData = Number.parseInt(data, 10);
      result = (filterData === intData);
    }

    // Handle string inputs
    if (typeof filterData === 'string') {
      searchKey = filterData.toLowerCase();
      switch (typeof data) {
      case 'object':
        // Handles the case where the data is an array (typeof 'object')
        // and you want to search through it for
        // the string you are filtering by
        let searchArray = data.map((e) => e.toLowerCase());
        if (exactMatch) {
          result = searchArray.includes(searchKey);
        } else {
          result = (
            searchArray.find(
              (e) => (e.indexOf(searchKey) > -1)
            )
          ) !== undefined;
        }
        break;
      default:
        searchString = data ? data.toString().toLowerCase() : '';
        if (exactMatch) {
          result = (searchString === searchKey);
        } else if (opposite) {
          result = searchString !== searchKey;
        } else {
          result = (searchString.indexOf(searchKey) > -1);
        }
        break;
      }
    }

    // Handle boolean inputs
    if (typeof filterData === 'boolean') {
      result = (filterData === data);
    }

    // Handle array inputs for multiselects
    if (typeof filterData === 'object') {
      let match = false;
      for (let i = 0; i < filterData.length; i += 1) {
        searchKey = filterData[i].toLowerCase();
        searchString = data ? data.toString().toLowerCase() : '';

        let searchArray = searchString.split(',');
        match = (searchArray.includes(searchKey));
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
  componentDidMount() {
    if (!this.props.noDynamicTable) {
      $('.dynamictable').DynamicTable();
    }
  }

  /**
   * Renders the Actions buttons.
   *
   * @return {string[]|void} - Array of React Elements
   */
  renderActions() {
    if (this.props.actions) {
      return this.props.actions.map((action, key) => {
        if (action.show !== false) {
          return (
            <CTA
              key = {key}
              label = {action.label}
              onUserInput = {action.action}
            />
          );
        }
      });
    }
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    if (
      (this.props.data === null || this.props.data.length === 0)
      && !this.props.nullTableShow
    ) {
      return (
        <div>
          <div className="row">
            <div className="col-xs-12">
              <div className="pull-right" style={{marginRight: '10px'}}>
                {this.renderActions()}
              </div>
            </div>
          </div>
          <div className='alert alert-info no-result-found-panel'>
            <strong>No result found.</strong>
          </div>
        </div>
      );
    }
    let rowsPerPage = this.state.page.rows;
    let headers = this.props.hide.defaultColumn === true ? [] : [
      <th key='th_col_0' onClick={() => {
        this.setSortColumn(-1);
      }}>
        {this.props.rowNumLabel}
      </th>,
    ];

    for (let i = 0; i < this.props.fields.length; i += 1) {
      if (this.props.fields[i].show === true) {
        let colIndex = i + 1;
        if (this.props.fields[i].freezeColumn === true) {
          headers.push(
            <th key={'th_col_' + colIndex} id={this.props.freezeColumn}
              onClick={() => {
                this.setSortColumn(i);
              }}>
              {this.props.fields[i].label}
            </th>
          );
        } else {
          headers.push(
            <th key={'th_col_' + colIndex} onClick={() => {
              this.setSortColumn(i);
            }}>
              {this.props.fields[i].label}
            </th>
          );
        }
      }
    }

    let rows = [];
    let filteredRowIndexes = this.getFilteredRowIndexes();
    let filteredCount = filteredRowIndexes.length;
    let index = this.sortRows(filteredRowIndexes);
    let currentPageRow = (rowsPerPage * (this.state.page.number - 1));

    // Format each cell for the data table.
    for (let i = currentPageRow;
      (i < filteredCount) && (rows.length < rowsPerPage);
      i++
    ) {
      let rowIndex = index[i].RowIdx;
      let rowData = this.props.data[rowIndex];
      let curRow = [];

      // Iterates through headers to populate row columns
      // with corresponding data
      for (let j = 0; j < this.props.fields.length; j += 1) {
        if (this.props.fields[j].show === false) {
          continue;
        }

        let celldata = rowData[j];
        let cell = null;

        let row = {};
        this.props.fields
          .forEach((field, k) => row[field.label] = rowData[k]);

        const headers = this.props.fields.map(
          (val) => val.label
        );

        // Get custom cell formatting if available
        if (this.props.getFormattedCell) {
          cell = this.props.getFormattedCell(
            this.props.fields[j].label,
            celldata,
            row,
            headers,
            j
          );
        } else {
          cell = <td>{celldata}</td>;
        }
        if (cell !== null) {
          curRow.push(React.cloneElement(cell, {key: 'td_col_' + j}));
        } else {
          curRow.push(createFragment({celldata}));
        }
      }

      const rowIndexDisplay = index[i].Content;
      rows.push(
        <tr key={'tr_' + rowIndex} colSpan={headers.length}>
          {this.props.hide.defaultColumn === true ? null : (
            <td key={'td_' + rowIndex}>{rowIndexDisplay}</td>
          )}
          {curRow}
        </tr>
      );
    }

    let rowsPerPageDropdown = (
      <select
        className="input-sm perPage"
        onChange={this.updatePageRows}
        value={this.state.page.rows}
      >
        <option>20</option>
        <option>50</option>
        <option>100</option>
        <option>1000</option>
        <option>5000</option>
        <option>10000</option>
      </select>
    );

    const loading = this.props.loading ? 'Loading...' : '';

    let header = this.props.hide.rowsPerPage === true ? '' : (
      <div className="table-header">
        <div className="row">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            padding: '5px 15px',
          }}>
            <div style={{
              order: '1',
              padding: '5px 0',
            }}>
              {rows.length} rows displayed of {filteredCount}.
              (Maximum rows per page: {rowsPerPageDropdown})
              {loading}
            </div>
            <div style={{
              order: '2',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexWrap: 'wrap',
              padding: '5px 0',
              marginLeft: 'auto',
            }}>
              {this.renderActions()}
              {this.props.hide.downloadCSV === true ? '' : (
                <button
                  className="btn btn-primary"
                  onClick={this.downloadCSV.bind(null, filteredRowIndexes)}
                >
                Download Table as CSV
                </button>)
              }
              <PaginationLinks
                Total={filteredCount}
                onChangePage={this.changePage}
                RowsPerPage={rowsPerPage}
                Active={this.state.page.number}
              />
            </div>
          </div>
        </div>
      </div>
    );

    let footer = (
      <div>
        <div className="row">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            padding: '5px 15px',
          }}>
            <div style={{
              order: '1',
              padding: '5px 0',
            }}>
              {rows.length} rows displayed of {filteredCount}.
              (Maximum rows per page: {rowsPerPageDropdown})
            </div>
            <div style={{
              order: '2',
              padding: '5px 0',
              marginLeft: 'auto',
            }}>
              <PaginationLinks
                Total={filteredCount}
                onChangePage={this.changePage}
                RowsPerPage={rowsPerPage}
                Active={this.state.page.number}
              />
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div style={{margin: '14px'}}>
        {header}
        <table
          className="table table-hover table-primary
            table-bordered dynamictable"
          id="dynamictable"
        >
          <thead>
            <tr className="info">{headers}</tr>
          </thead>
          {this.props.folder}
          <tbody>
            {rows}
          </tbody>
        </table>
        {footer}
      </div>
    );
  }
}
DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  rowNumLabel: PropTypes.string,
  // Function of which returns a JSX element for a table cell, takes
  // parameters of the form: func(ColumnName, CellData, EntireRowData)
  getFormattedCell: PropTypes.func,
  onSort: PropTypes.func,
  actions: PropTypes.array,
  hide: PropTypes.object,
  nullTableShow: PropTypes.bool,
  noDynamicTable: PropTypes.bool,
  getMappedCell: PropTypes.func,
  fields: PropTypes.array,
  RowNameMap: PropTypes.array,
  filters: PropTypes.object,
  freezeColumn: PropTypes.string,
  loading: PropTypes.element,
  folder: PropTypes.element,
};
DataTable.defaultProps = {
  headers: [],
  data: {},
  rowNumLabel: 'No.',
  filters: {},
  hide: {
    rowsPerPage: false,
    downloadCSV: false,
    defaultColumn: false,
  },
  nullTableShow: false,
  noDynamicTable: false,
};

export default DataTable;
