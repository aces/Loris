import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PaginationLinks from 'jsx/PaginationLinks';
import createFragment from 'react-addons-create-fragment';

/**
 * Data Table component
 * Displays a set of data that is receives via props.
 */
class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: {
        number: 1,
        rows: 20,
      },
      sort: {
       column: 0,
       ascending: true,
      },
    };

    this.setSortColumn = this.setSortColumn.bind(this);
    this.updateSortColumn = this.updateSortColumn.bind(this);
    this.toggleSortOrder = this.toggleSortOrder.bind(this);
    this.updatePageNumber = this.updatePageNumber.bind(this);
    this.updatePageRows = this.updatePageRows.bind(this);
    this.downloadCSV = this.downloadCSV.bind(this);
    this.countFilteredRows = this.countFilteredRows.bind(this);
    this.getSortedRows = this.getSortedRows.bind(this);//
    this.hasFilterKeyword = this.hasFilterKeyword.bind(this);
    this.renderActions = this.renderActions.bind(this);
  }

  setSortColumn(column) {
    if (this.state.sort.column === column) {
      this.props.toggleSortOrder();
    } else {
      this.updateSortColumn(column);
    }
  }

  updateSortColumn(column) {
    const sort = this.state.sort;
    sort.column = column;
    this.setState({sort});
  }

  toggleSortOrder() {
    const sort = this.state.sort;
    sort.ascending = !sort.ascending;
    this.setState({sort});
  }

  /**
   * Updates page state
   *
   * @param {int} number of page
   */
  updatePageNumber(number) {
    const page = this.sate.page;
    page.number = number;
    this.setState({page});
  }

  /**
   * Update number of rows per page
   *
   * @param {object} e event from which to abstract value
   */
  updatePageRows(e) {
    const page = this.state.page;
    page.rows = e.target.value;
    this.setState({page});
  }

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
    const headerList = this.props.fields.map((field) => field.label);
    csvworker.postMessage({
      cmd: 'SaveFile',
      data: csvData,
      headers: headerList,
      identifiers: this.props.RowNameMap,
    });
  }

  countFilteredRows() {
    let useKeyword = false;
    let filterMatchCount = 0;
    let filterValuesCount = (this.props.filter ?
        Object.keys(this.props.filter).length :
        0
    );
    let tableData = this.props.data;
    let fieldData = this.props.fields;

    if (this.props.filter.keyword) {
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
        filterMatchCount++;
      }
    }

    let hasFilters = (filterValuesCount !== 0);
    if (filterMatchCount === 0 && hasFilters) {
      return 0;
    }

    return (filterMatchCount === 0) ? tableData.length : filterMatchCount;
  }

  getSortedRows() {
    const index = [];

    for (let i = 0; i < this.props.data.length; i += 1) {
      let val = this.props.data[i][this.state.sort.column] || undefined;
      // If sortColumn is equal to default No. column, set value to be
      // index + 1
      if (this.state.sort.column === -1) {
        val = i + 1;
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
      } else {
        val = undefined;
      }

      if (this.props.RowNameMap) {
        index.push({RowIdx: i, Value: val, Content: this.props.RowNameMap[i]});
      } else {
        index.push({RowIdx: i, Value: val, Content: i + 1});
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

    if (this.props.filter[name]) {
      filterData = this.props.filter[name].value;
      exactMatch = this.props.filter[name].exactMatch;
      opposite = this.props.filter[name].opposite;
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
            result = (searchArray.find((e) => (e.indexOf(searchKey) > -1))) !== undefined;
          }
          break;
        default:
            searchString = data.toLowerCase();
            if (exactMatch) {
              result = (searchString === searchKey);
            } else {
              result = (searchString.indexOf(searchKey) > -1);
            }
          break;
      }
    }

    // Handle boolean inputs
    if (typeof filterData === 'boolean') {
      result = filterData;
    }

    // Handle array inputs for multiselects
    if (typeof filterData === 'object') {
      let match = false;
      for (let i = 0; i < filterData.length; i += 1) {
        searchKey = filterData[i].toLowerCase();
        searchString = data.toLowerCase();

        match = (searchString.indexOf(searchKey) > -1);
        if (match) {
          result = true;
        }
      }
    }

    return result;
  }

  renderActions() {
    if (this.props.actions) {
      return this.props.actions.map((action, key) => {
        if (action.show !== false) {
          return (
            < CTA
              key = {key}
              label = {action.label}
              onUserInput = {action.action}
            />
          );
        }
      });
    }
  }

  render() {
    if (this.props.data === null || this.props.data.length === 0) {
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
    let curRow = [];
    let index = this.getSortedRows();
    let matchesFound = 0; // Keeps track of how many rows where displayed so far across all pages
    let filteredRows = this.countFilteredRows();
    let currentPageRow = (rowsPerPage * (this.state.page.number - 1));
    let filteredData = [];
    let useKeyword = false;

    if (this.props.filter.keyword) {
      useKeyword = true;
    }

    // Push rows to data table
    for (let i = 0;
         (i < this.props.data.length) && (rows.length < rowsPerPage);
         i++
    ) {
      curRow = [];

      // Counts filter matches
      let filterMatchCount = 0;
      let keywordMatch = 0;
      let filterLength = 0;

      // Iterates through headers to populate row columns
      // with corresponding data
      for (let j = 0; j < this.props.fields.length; j += 1) {
        let data = 'Unknown';

        // Set column data
        if (this.props.data[index[i].RowIdx]) {
          data = this.props.data[index[i].RowIdx][j];
        }

        if (this.props.fields[j].filter) {
          if (this.hasFilterKeyword(this.props.fields[j].filter.name, data)) {
            filterMatchCount++;
            filteredData.push(this.props.data[index[i].RowIdx]);
          }
        }

        if (useKeyword === true) {
          filterLength = Object.keys(this.props.filter).length - 1;
          if (this.hasFilterKeyword('keyword', data)) {
            keywordMatch++;
          }
        } else {
          filterLength = Object.keys(this.props.filter).length;
        }

        let key = 'td_col_' + j;

        // Get custom cell formatting if available
        if (this.props.getFormattedCell) {
          if (this.props.fields[j].show === false) {
            data = null;
          } else {
            // create mapping between rowHeaders and rowData in a row Object
            const row = {};
            this.props.fields.forEach((field, k) => {
              row[field.label] = this.props.data[index[i].RowIdx][k];
            });
            data = this.props.getFormattedCell(
              this.props.fields[j].label,
              data,
              row
            );
          }
          if (data !== null) {
            // Note: Can't currently pass a key, need to update columnFormatter
            // to not return a <td> node. Using createFragment instead.
            curRow.push(createFragment({data}));
          }
        } else {
          curRow.push(<td key={key}>{data}</td>);
        }
      }

      // Only display a row if all filter values have been matched
      if ((filterLength === filterMatchCount) &&
        ((useKeyword === true && keywordMatch > 0) ||
          (useKeyword === false && keywordMatch === 0))) {
        matchesFound++;
        if (matchesFound > currentPageRow) {
          const rowIndex = index[i].Content;
          rows.push(
            <tr key={'tr_' + rowIndex} colSpan={headers.length}>
              <td>{rowIndex}</td>
              {curRow}
            </tr>
          );
        }
      }
    }

    let rowsPerPageDropdown = (
      <select
        className="input-sm perPage"
        onChange={this.props.updatePageRows}
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

    // Include only filtered data if filters were applied
    let csvData = this.props.data;
    if (this.props.filter && filteredData.length > 0) {
      csvData = filteredData;
    }

    let header = this.props.hide.rowsPerPage === true ? '' : (
      <div className="table-header panel-heading">
        <div className="row">
          <div className="col-xs-12">
            <div>
              {rows.length} rows displayed of {filteredRows}.
              (Maximum rows per page: {RowsPerPageDropdown})
            </div>
            <div className="pull-right" style={{marginTop: '-43px'}}>
              {this.renderActions()}
              <button
                className="btn btn-primary"
                onClick={this.downloadCSV.bind(null, csvData)}
              >
                Download Table as CSV
              </button>
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

    let footer = this.props.hide.downloadCSV === true ? '' : (
      <div className="panel-footer table-footer">
        <div className="row">
          <div className="col-xs-12" style={{marginTop: '10px'}}>
            <div className="footerText">
              {rows.length} rows displayed of {filteredRows}.
              (Maximum rows per page: {rowsPerPageDropdown})
            </div>
            <div className="col-xs-6">
              <button
                className="btn btn-primary downloadCSV"
                onClick={this.downloadCSV.bind(null, csvData)}
              >
                Download Table as CSV
              </button>
            </div>
            <div className="pull-right" style={{marginTop: '-23px'}}>
              {pagination}
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div style={{margin: '14px'}}>
        {header}
        <table className="table table-hover table-primary table-bordered" id="dynamictable">
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
DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  rowNumLabel: PropTypes.string,
  // Function of which returns a JSX element for a table cell, takes
  // parameters of the form: func(ColumnName, CellData, EntireRowData)
  getFormattedCell: PropTypes.func,
  onSort: PropTypes.func,
  actions: PropTypes.object,
  hide: PropTypes.object,
};
DataTable.defaultProps = {
  headers: [],
  data: {},
  rowNumLabel: 'No.',
  filter: {},
  hide: {
    rowsPerPage: false,
    downloadCSV: false,
    defaultColumn: false,
  },
};

export default DataTable;
