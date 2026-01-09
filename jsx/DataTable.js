import React, {useState, useEffect, useCallback, useMemo} from 'react';
import PropTypes from 'prop-types';
import PaginationLinks from 'jsx/PaginationLinks';
import {CTA} from 'jsx/Form';
import {useTranslation} from 'react-i18next';

/**
 * Data Table component
 * Displays a set of data that it receives via props.
 */
const DataTable = ({
  data,
  rowNumLabel,
  getFormattedCell,
  onSort,
  actions,
  hide,
  nullTableShow,
  noDynamicTable,
  getMappedCell,
  fields,
  RowNameMap,
  filters,
  freezeColumn,
  loading,
  folder
}) => {
  const { t } = useTranslation(['loris']);

  const [page, setPage] = useState({
    number: 1,
    rows: 20,
  });

  const [sort, setSort] = useState({
    column: -1,
    ascending: true,
  });

  /**
   * Set the component page variable
   * to a new value
   *
   * @param {number} i - Page index
   */
  const changePage = (i) => {
    setPage(prev => ({ ...prev, number: i }));
  };

  /**
   * Updates page state
   *
   * @param {number} number - Number of page
   */
  const updatePageNumber = (number) => {
    setPage(prev => ({ ...prev, number }));
  };

  /**
   * Update number of rows per page
   *
   * @param {object} e - Event from which to abstract value
   */
  const updatePageRows = (e) => {
    setPage({
      rows: e.target.value,
      number: 1 // Reset to first page when changing row count
    });
  };

  /**
   * Toggle sort.ascending
   */
  const toggleSortOrder = () => {
    setSort(prev => ({ ...prev, ascending: !prev.ascending }));
  };

  /**
   * Update the sort column
   *
   * @param {number} column - The column index
   */
  const updateSortColumn = (column) => {
    setSort(prev => ({ ...prev, column }));
  };

  /**
   * Update the sort column
   * If component sort.column is already set to column
   * Toggle sort.ascending
   *
   * @param {number} column - The column index
   */
  const setSortColumn = (column) => {
    if (sort.column === column) {
      toggleSortOrder();
    } else {
      updateSortColumn(column);
    }
  };

  /**
   * Export the filtered rows and columns into a csv
   * @param {number[]} filteredRowIndexes - The filtered Row Indexes
   */
  const downloadCSV = useCallback((filteredRowIndexes) => {
    let csvData = filteredRowIndexes.map((id) => data[id]);

    // Map cell data if the getter exists
    if (getMappedCell) {
      csvData = csvData.map((row) =>
        fields.map((field, j) =>
          getMappedCell(
            field.label,
            row[j],
            row,
            fields.map((val) => val.label),
            j
          )
        )
      );
    }

    const csvworker = new Worker(loris.BaseURL + '/js/workers/savecsv.js');

    csvworker.addEventListener('message', (e) => {
      if (e.data.cmd === 'SaveCSV') {
        const dataDate = new Date().toISOString();
        const dataURL = window.URL.createObjectURL(e.data.message);
        const link = document.createElement('a');

        link.download = `data-${dataDate}.csv`;
        link.type = 'text/csv';
        link.href = dataURL;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(dataURL); // Cleanup memory
        csvworker.terminate();
      }
    });

    const headerList = fields.map((field) => field.label);

    csvworker.postMessage({
      cmd: 'SaveFile',
      data: csvData,
      headers: headerList,
      identifiers: RowNameMap,
    });
  }, [data, fields, getMappedCell, RowNameMap]);

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
  const hasFilterKeyword = (name, data) => {
    let filterData = null;
    let exactMatch = false;
    let opposite = false;
    let result = false;

    // Accessing filters directly from props
    if (filters[name]) {
      filterData = filters[name].value;
      exactMatch = filters[name].exactMatch;
      opposite = filters[name].opposite;
    }

    // Handle null inputs
    if (filterData === null || data === null) {
      return false;
    }

    // Handle numeric inputs
    if (typeof filterData === 'number') {
      let intData = Number.parseInt(data, 10);
      return (filterData === intData);
    }

    // Handle string inputs
    if (typeof filterData === 'string') {
      const searchKey = filterData.toLowerCase();
      
      if (Array.isArray(data)) {
        let searchArray = data.map((e) => e.toLowerCase());
        if (exactMatch) {
          return searchArray.includes(searchKey);
        }
        return searchArray.some((e) => e.indexOf(searchKey) > -1);
      }

      const searchString = (data !== null && data !== undefined) ? 
        data.toString().toLowerCase() : '';

      if (exactMatch) {
        result = (searchString === searchKey);
      } else if (opposite) {
        result = (searchString !== searchKey);
      } else {
        result = (searchString.indexOf(searchKey) > -1);
      }
      return result;
    }

    // Handle boolean inputs
    if (typeof filterData === 'boolean') {
      return (filterData === data);
    }

    // Handle array inputs for multiselects
    if (typeof filterData === 'object' && Array.isArray(filterData)) {
      const searchString = (data !== null && data !== undefined) ? 
        data.toString().toLowerCase() : '';
      let searchArray = searchString.split(',');
      
      return filterData.some(val => searchArray.includes(val.toLowerCase()));
    }

    return result;
  }


  /**
   * Get the Filtered Row Indexes
   * Memoized to prevent heavy re-calculation on every render
   */
  const filteredRowIndexes = useMemo(() => {
    let useKeyword = !!filters.keyword;
    const filterKeys = Object.keys(filters);
    let filterValuesCount = filterKeys.length;
    
    const filteredIndexes = [];

    // If there are no filters set, use all the data.
    if (filterValuesCount === 0) {
      return data.map((_, i) => i);
    }

    if (useKeyword) {
      filterValuesCount -= 1;
    }

    data.forEach((row, i) => {
      let headerCount = 0;
      let keywordMatch = 0;

      fields.forEach((field, j) => {
        const cellData = row ? row[j] : null;
        
        if (hasFilterKeyword((field.filter || {}).name, cellData)) {
          headerCount++;
        }
        
        if (useKeyword && hasFilterKeyword('keyword', cellData)) {
          keywordMatch++;
        }
      });

      const satisfiesKeyword = useKeyword ? keywordMatch > 0 : keywordMatch === 0;
      
      if (headerCount === filterValuesCount && satisfiesKeyword) {
        filteredIndexes.push(i);
      }
    });

    return filteredIndexes;
  }, [data, fields, filters, hasFilterKeyword]);

  /**
   * Sort the given rows according to the sort configuration
   * Memoized to avoid re-sorting unless data, filters, or sort state changes
   * @param {number[]} rowIndexes - The row indexes
   * @return {object[]}
   */
  const sortedRows = useMemo(() => {
    const rowIndexes = filteredRowIndexes; 
    const index = [];

    for (let i = 0; i < rowIndexes.length; i++) {
      let idx = rowIndexes[i];

      let val;
      if (sort.column === -1) {
        val = idx + 1;
      } else {
        val = data[idx][sort.column] || undefined;
      }      

      const isString = (typeof val === 'string' || val instanceof String);
      const isNumber = val !== '' && !isNaN(val) && typeof val !== 'object' && val !== null;

      if (val === '.') {
        val = null;
      } else if (isNumber) {
        val = Number(val);
      } else if (isString) {
        val = val.toLowerCase();
      } else if (Array.isArray(val)) {
        val = val.join(', ');
      } else {
        val = undefined;
      }

      index.push({
        RowIdx: idx,
        Value: val,
        Content: RowNameMap ? RowNameMap[idx] : idx + 1,
      });
    }

    index.sort((a, b) => {
      const isAsc = sort.ascending;
      
      if (a.Value === b.Value) {
        // If values are equal, sort by original row index
        return isAsc ? (a.RowIdx - b.RowIdx) : (b.RowIdx - a.RowIdx);
      }

      // Handle null/undefined values (push to end/top depending on direction)
      if (a.Value === null || typeof a.Value === 'undefined') return isAsc ? -1 : 1;
      if (b.Value === null || typeof b.Value === 'undefined') return isAsc ? 1 : -1;

      // Primary sort
      if (a.Value < b.Value) return isAsc ? -1 : 1;
      if (a.Value > b.Value) return isAsc ? 1 : -1;
      
      return 0;
    });

    return index;
  }, [filteredRowIndexes, data, RowNameMap, sort]);  

  useEffect(() => {
    if (!noDynamicTable) {
      $('.dynamictable').DynamicTable();
    }
  
    // Cleanup function
    return () => {
    };
  }, [noDynamicTable, paginatedRows]);

  /**
   * Renders the Actions buttons.
   *
   * @return {string[]|void} - Array of React Elements
   */
  const renderActions = () => {
    if (actions) {
      return actions.map((action, key) => {
        if (action.show !== false) {
          return (
            <CTA
              key={key}
              label={action.label}
              onUserInput={action.action}
            />
          );
        }
        return null;
      });
    }
    return null;
  };  

  // 1. Calculate the slice for the current page
  const rowsPerPage = page.rows;
  const currentPageStart = rowsPerPage * (page.number - 1);
  const paginatedRows = sortedRows.slice(currentPageStart, currentPageStart + rowsPerPage);
  
  // 2. Early Return for Empty Data
  if ((!data || data.length === 0) && !nullTableShow) {
    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <div className="pull-right" style={{ marginRight: '10px' }}>
              {renderActions()}
            </div>
          </div>
        </div>
        <div className='alert alert-info no-result-found-panel'>
          <strong>{t('No result found.', { ns: 'loris' })}</strong>
        </div>
      </div>
    );
  }
  
  // 3. Helper for the Header/Footer UI (to avoid repeating code)
  const renderTableControls = () => (
    <div className="row">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', padding: '5px 15px' }}>
        <div style={{ order: '1', padding: '5px 0' }}>
          {t('{{pageCount}} rows displayed of {{totalCount}}.', {
            pageCount: paginatedRows.length,
            totalCount: filteredRowIndexes.length,
          })}
          <span>
            ({t('Maximum rows per page:')}
            <select className="input-sm perPage" onChange={updatePageRows} value={page.rows}>
              {[20, 50, 100, 1000, 5000, 10000].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>              
          </span>
        </div>
        <div style={{ order: '2', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', padding: '5px 0', marginLeft: 'auto' }}>
          {renderActions()}
          {!hide.downloadCSV && (
            <button className="btn btn-primary" onClick={() => downloadCSV(filteredRowIndexes)}>
              {t('Download Data as CSV')}
            </button>
          )}
          <PaginationLinks
            Total={filteredRowIndexes.length}
            onChangePage={changePage}
            RowsPerPage={rowsPerPage}
            Active={page.number}
          />
        </div>
      </div>
    </div>
  );
  
  return (
    <div style={{ margin: '14px' }}>
      {!hide.rowsPerPage && <div className="table-header">{renderTableControls()}</div>}
  
      <table className="table table-hover table-primary table-bordered dynamictable" id="dynamictable">
        <thead>
          <tr className="info">
            {!hide.defaultColumn && (
              <th key='th_col_0' onClick={() => setSortColumn(-1)}>{rowNumLabel}</th>
            )}
            {fields.filter(f => f.show).map((field, i) => (
              <th
                key={`th_col_${i+1}`}
                id={field.freezeColumn ? freezeColumn : undefined}
                onClick={() => setSortColumn(i)}
              >
                {field.label}
              </th>
            ))}
          </tr>
        </thead>
        {folder}
        <tbody>
          {paginatedRows.map((item, i) => {
            const rowData = data[item.RowIdx];
  
            // Construct the 'row' object for the formatter
            const rowObj = {};
            fields.forEach((f, k) => rowObj[f.label] = rowData[k]);
            const fieldLabels = fields.map(f => f.label);
  
            return (
              <tr key={`tr_${item.RowIdx}`}>
                {!hide.defaultColumn && <td>{item.Content}</td>}
                {fields.map((field, j) => {
                  if (!field.show) return null;
  
                  if (getFormattedCell) {
                    return React.cloneElement(
                      getFormattedCell(field.label, rowData[j], rowObj, fieldLabels, j),
                      { key: `td_col_${j}` }
                    );
                  }
                  return <td key={`td_col_${j}`}>{rowData[j]}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
  
      <div className="table-footer">{renderTableControls()}</div>
    </div>
  );
}

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  rowNumLabel: PropTypes.string,
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
