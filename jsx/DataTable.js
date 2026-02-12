import React, {useState, useEffect, useCallback, useMemo} from 'react';
import PropTypes from 'prop-types';
import PaginationLinks from 'jsx/PaginationLinks';
import {CTA} from 'jsx/Form';
import {useTranslation} from 'react-i18next';

/**
 * Searches for the filter keyword in the column cell.
 *
 * Note: Search is case-insensitive.
 *
 * @param {string} name field name
 * @param {string|number|boolean|Array} data the cell value to search within
 * @param {object} filters the filters object
 * @return {boolean} true if it matches the filter criteria, false otherwise.
 */
const hasFilterKeyword = (name, data, filters) => {
  const filter = filters[name];
  if (!filter) return true; // Safety fallback

  const {value: filterData, exactMatch, opposite} = filter;

  // If the cell is empty but we have an active filter, it's not a match
  if (data === null || data === undefined) return false;

  // Numbers
  if (typeof filterData === 'number') {
    return filterData === Number.parseInt(data, 10);
  }

  // Strings & Arrays
  if (typeof filterData === 'string') {
    const searchKey = filterData.toLowerCase();
    const cellValues = Array.isArray(data)
      ? data.map((e) => String(e).toLowerCase())
      : [String(data).toLowerCase()];

    if (exactMatch) return cellValues.includes(searchKey);
    if (opposite) return !cellValues.includes(searchKey);
    return cellValues.some((val) => val.includes(searchKey));
  }

  // Booleans (Checkboxes)
  if (typeof filterData === 'boolean') {
    return filterData === data;
  }

  // Multi-select (filterData is an array)
  if (Array.isArray(filterData)) {
    const cellValues = String(data).toLowerCase().split(',');
    return filterData.some((val) =>
      cellValues.includes(String(val).toLowerCase())
    );
  }

  return false;
};

/**
 * Data Table component
 * Displays a set of data that it receives via props.
 *
 * @param {object} props - The component props
 * @param {Array} props.data - The table data to be displayed
 * @param {string} props.rowNumLabel - Label for the row number column
 * @param {Function} props.getFormattedCell - Custom cell formatter function
 * @param {Array} props.actions - List of actions for the table
 * @param {object} props.hide - Visibility configuration for columns/controls
 * @param {boolean} props.nullTableShow - Whether to show table if data is null
 * @param {boolean} props.noDynamicTable - Flag to disable dynamic features
 * @param {Function} props.getMappedCell - Mapper for cell values
 * @param {Array} props.fields - Column definitions and configurations
 * @param {object} props.RowNameMap - Mapping for row identifiers
 * @param {object} props.filters - Current active filters
 * @param {string} props.freezeColumn - The ID/Name of the column to freeze
 * @param {React.ReactNode} props.folder - Folder or nested element to display
 */
const DataTable = ({
  data = [],
  rowNumLabel = 'No.',
  getFormattedCell,
  actions,
  hide = {
    rowsPerPage: false,
    downloadCSV: false,
    defaultColumn: false,
  },
  nullTableShow = false,
  noDynamicTable,
  getMappedCell,
  fields,
  RowNameMap,
  filters = {},
  freezeColumn,
  folder,
}) => {
  const {t} = useTranslation(['loris']);

  const [page, setPage] = useState({
    number: 1,
    rows: 20,
  });

  const [sort, setSort] = useState({
    column: -1,
    ascending: true,
  });

  /**
   * Updates page state
   *
   * @param {number} number - Number of page
   */
  const updatePageNumber = (number) => {
    setPage((prev) => ({...prev, number}));
  };

  /**
   * Update number of rows per page
   *
   * @param {object} e - Event from which to abstract value
   */
  const updatePageRows = (e) => {
    setPage({
      rows: e.target.value,
      number: 1, // Reset to first page when changing row count
    });
  };

  /**
   * Toggle sort.ascending
   */
  const toggleSortOrder = () => {
    setSort((prev) => ({...prev, ascending: !prev.ascending}));
  };

  /**
   * Update the sort column
   *
   * @param {number} column - The column index
   */
  const updateSortColumn = (column) => {
    setSort((prev) => ({...prev, column}));
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
   *
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
   * Get the Filtered Row Indexes
   * Memoized to prevent heavy re-calculation on every render
   */
  const filteredRowIndexes = useMemo(() => {
    // Get the filter keys.
    const filterKeys = Object.keys(filters);

    // If no filters are active, return all data indexes
    if (filterKeys.length === 0) {
      return data.map((_, i) => i);
    }

    // 3. Filter the data
    return data.reduce((filteredIndexes, row, i) => {
      const matchesAll = filterKeys.every((filterName) => {
        // Find the field definition that matches this filter name
        const fieldIndex = fields.findIndex(
          (f) => f.filter && f.filter.name === filterName
        );

        // If no field is found or the row is missing data at that index,
        // we can't filter it, so we skip (return true)
        if (fieldIndex === -1 || !row) return true;

        const cellData = row[fieldIndex];
        return hasFilterKeyword(filterName, cellData, filters);
      });

      if (matchesAll) {
        filteredIndexes.push(i);
      }
      return filteredIndexes;
    }, []);
  }, [data, fields, filters]);

  /**
   * Sort the given rows according to the sort configuration
   * Memoized to avoid re-sorting unless data, filters, or sort state changes
   *
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
      const isNumber = !isNaN(parseFloat(val)) && isFinite(val);

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
      if (a.Value == null) return isAsc ? -1 : 1;
      if (b.Value == null) return isAsc ? 1 : -1;

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
  }, [noDynamicTable]);

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
  const rowsPerPage = Number(page.rows);
  const paginatedRows = useMemo(() => {
    const start = page.rows * (page.number - 1);
    const end = start + page.rows;
    return sortedRows.slice(start, end);
  }, [sortedRows, page.rows, page.number]);

  // 2. Early Return for Empty Data
  if ((!data || data.length === 0) && !nullTableShow) {
    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <div className="pull-right" style={{marginRight: '10px'}}>
              {renderActions()}
            </div>
          </div>
        </div>
        <div className='alert alert-info no-result-found-panel'>
          <strong>{t('No result found.', {ns: 'loris'})}</strong>
        </div>
      </div>
    );
  }

  // 3. Helper for the Header/Footer UI
  const tableControlStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: '5px 15px',
  };
  const tableActionsStyle = {
    order: '2',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: '5px 0',
    marginLeft: 'auto',
  };
  const renderTableControls = () => (
    <div className="row">
      <div style={tableControlStyle}>
        <div style={{order: '1', padding: '5px 0'}}>
          {t('{{pageCount}} rows displayed of {{totalCount}}.', {
            pageCount: paginatedRows.length,
            totalCount: filteredRowIndexes.length,
          })}
          <span>
            ({t('Maximum rows per page:')}
            <select
              className="input-sm perPage"
              onChange={updatePageRows}
              value={page.rows}
            >
              {[20, 50, 100, 1000, 5000, 10000].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            )
          </span>
        </div>
        <div style={tableActionsStyle}>
          {renderActions()}
          {!hide.downloadCSV && (
            <button
              className="btn btn-primary"
              onClick={() => downloadCSV(filteredRowIndexes)}
            >
              {t('Download Data as CSV')}
            </button>
          )}
          <PaginationLinks
            Total={filteredRowIndexes.length}
            onChangePage={updatePageNumber}
            RowsPerPage={rowsPerPage}
            Active={page.number}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{margin: '14px'}}>
      {!hide.rowsPerPage && (
        <div className="table-header">
          {renderTableControls()}
        </div>
      )}

      <table
        className="table table-hover table-primary table-bordered dynamictable"
        id="dynamictable"
      >
        <thead>
          <tr className="info">
            {!hide.defaultColumn && (
              <th
                key='th_col_0'
                onClick={() => setSortColumn(-1)}
              >
                {rowNumLabel}
              </th>
            )}
            {fields.map((field, index) => {
              if (!field.show) return null;
              return (
                <th
                  key={`th_col_${index + 1}`}
                  id={field.freezeColumn ? freezeColumn : undefined}
                  onClick={() => setSortColumn(index)}
                >
                  {field.label}
                </th>
              );
            })}
          </tr>
        </thead>
        {folder}
        <tbody>
          {paginatedRows.map((item, i) => {
            const rowData = data[item.RowIdx];
            const fieldLabels = fields.map((f) => f.label);

            return (
              <tr key={`tr_${item.RowIdx}`}>
                {!hide.defaultColumn && <td>{item.Content}</td>}
                {fields.map((field, j) => {
                  if (!field.show) return null;

                  if (getFormattedCell) {
                    return React.cloneElement(
                      getFormattedCell(
                        field.label,
                        rowData[j],
                        rowData,
                        fieldLabels,
                        j
                      ),
                      {key: `td_col_${j}`}
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
};

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  rowNumLabel: PropTypes.string,
  getFormattedCell: PropTypes.func,
  actions: PropTypes.array,
  hide: PropTypes.object,
  nullTableShow: PropTypes.bool,
  noDynamicTable: PropTypes.bool,
  getMappedCell: PropTypes.func,
  fields: PropTypes.array.isRequired,
  RowNameMap: PropTypes.object,
  filters: PropTypes.object,
  freezeColumn: PropTypes.string,
  folder: PropTypes.node,
};

export default DataTable;
