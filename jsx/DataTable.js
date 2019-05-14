/**
 * This file contains React component for Data Table
 *
 * @author Loris Team
 * @version 1.0.0
 *
 */

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
    this.getSortedRows = this.getSortedRows.bind(this);//
    this.hasFilterKeyword = this.hasFilterKeyword.bind(this);
    this.renderActions = this.renderActions.bind(this);
  }

  componentDidMount() {
    if (jQuery.fn.DynamicTable) {
      if (this.props.freezeColumn) {
        $('#dynamictable').DynamicTable({
          freezeColumn: this.props.freezeColumn,
        });
      } else {
        $('#dynamictable').DynamicTable();
      }
      if (this.state.Hide.defaultColumn) {
        $('#dynamictable').find('tbody td:eq(0)').hide();
      }
    }

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

  componentDidUpdate(prevProps, prevState) {
    if (jQuery.fn.DynamicTable) {
      if (this.props.freezeColumn) {
        $('#dynamictable').DynamicTable({
          freezeColumn: this.props.freezeColumn,
        });
      } else {
        $('#dynamictable').DynamicTable();
      }
    }
    if (this.props.onSort &&
      (this.state.SortColumn !== prevState.SortColumn ||
        this.state.SortOrder !== prevState.SortOrder)
    ) {
      let index = this.getSortedRows();
      const headerList = this.props.fields.map((field) => field.label);
      this.props.onSort(index, this.props.data, headerList);
    }
  }

  changePage(pageNo) {
    this.setState({
      PageNumber: pageNo,
    });
  }

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
    };
  }

  changeRowsPerPage(val) {
    let rowsPerPage = val.target.value;
    let modulePrefs = this.modulePrefs;

    // Save current selection
    modulePrefs[loris.TestName].rowsPerPage = rowsPerPage;

    // Update localstorage
    localStorage.setItem('modulePrefs', JSON.stringify(modulePrefs));

    this.setState({
      RowsPerPage: rowsPerPage,
      PageNumber: 1,
    });
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
      let val = this.props.data[i][this.state.SortColumn] || undefined;
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
   * @param {string} name field name
   * @param {string} data search string
   * @return {boolean} true, if filter value is found to be a substring
   * of one of the column values, false otherwise.
   */
  hasFilterKeyword(name, data) {
    let filterData = null;
    let exactMatch = false;
    let result = false;
    let searchKey = null;
    let searchString = null;

    if (this.props.filter[name]) {
      filterData = this.props.filter[name].value;
      exactMatch = this.props.filter[name].exactMatch;
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
    let rowsPerPage = this.state.RowsPerPage;
    let headers = this.state.Hide.defaultColumn === true ? [] : [
      <th key='th_col_0' onClick={this.setSortColumn(-1).bind(this)}>
        {this.props.RowNumLabel}
      </th>,
    ];

    for (let i = 0; i < this.props.fields.length; i += 1) {
      if (this.props.fields[i].show === true) {
        let colIndex = i + 1;
        if (this.props.fields[i].freezeColumn === true) {
          headers.push(
            <th key={'th_col_' + colIndex} id={this.props.freezeColumn}
                onClick={this.setSortColumn(i).bind(this)}>
              {this.props.fields[i].label}
            </th>
          );
        } else {
          headers.push(
            <th key={'th_col_' + colIndex} onClick={this.setSortColumn(i).bind(this)}>
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
    let currentPageRow = (rowsPerPage * (this.state.PageNumber - 1));
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
    let csvData = this.props.data;
    if (this.props.filter && filteredData.length > 0) {
      csvData = filteredData;
    }

    let header = this.state.Hide.rowsPerPage === true ? '' : (
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
              {rows.length} rows displayed of {filteredRows}.
              (Maximum rows per page: {RowsPerPageDropdown})
            </div>
            <div style={{
              order: '2',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexWrap: 'nowrap',
              padding: '5px 0',
              marginLeft: 'auto',
            }}>
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

    let footer = this.state.Hide.downloadCSV === true ? '' : (
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
              {rows.length} rows displayed of {filteredRows}.
              (Maximum rows per page: {RowsPerPageDropdown})
            </div>
            <div style={{
              order: '2',
              padding: '5px 0',
              marginLeft: 'auto',
            }}>
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
  RowNumLabel: PropTypes.string,
  // Function of which returns a JSX element for a table cell, takes
  // parameters of the form: func(ColumnName, CellData, EntireRowData)
  getFormattedCell: PropTypes.func,
  onSort: PropTypes.func,
  Hide: PropTypes.object,
  actions: PropTypes.object,
};
DataTable.defaultProps = {
  RowNumLabel: 'No.',
  filter: {},
  Hide: {
    rowsPerPage: false,
    downloadCSV: false,
    defaultColumn: false,
  },
};

export default DataTable;
