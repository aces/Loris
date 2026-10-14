import React, {useState, useEffect, useCallback, useMemo} from 'react';
import PropTypes from 'prop-types';
import PaginationLinks from 'jsx/PaginationLinks';
import {CTA} from 'jsx/Form';
import TriggerableModal from './TriggerableModal';
import {useTranslation} from 'react-i18next';

/**
 * Searches for the filter keyword in the column cell
 *
 * Note: Search is case-insensitive.
 *
 * @param {string} name field name
 * @param {string} data search string
 * @param {object} filters to be matched agains
 * @param {object} filter the field's filter configuration
 * @return {boolean} true, if filter value is found to be a substring
 * of one of the column values, false otherwise.
 */
const hasFilterKeyword = (name, data, filters, filter = {}) => {
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

  // Handle date range inputs.
  if (filter.type === 'date-range' &&
    typeof filterData === 'object' &&
    !Array.isArray(filterData)) {
    const dateData = (data !== null && data !== undefined) ?
      data.toString() : '';
    const min = filterData.min || '';
    const max = filterData.max || '';

    return dateData !== '' &&
      (min === '' || dateData >= min) &&
      (max === '' || dateData <= max);
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

  // Handle numeric range inputs
  if (filter.type === 'number-range' &&
    typeof filterData === 'object' &&
    !Array.isArray(filterData)) {
    const numericData = Number.parseFloat(data);
    const min = Number.parseFloat(filterData.min);
    const max = Number.parseFloat(filterData.max);
    return !Number.isNaN(numericData) &&
      (Number.isNaN(min) || numericData >= min) &&
      (Number.isNaN(max) || numericData <= max);
  }

  // Handle array inputs for multiselects
  if (typeof filterData === 'object' && Array.isArray(filterData)) {
    const searchString = (data !== null && data !== undefined) ?
      data.toString().toLowerCase() : '';
    let searchArray = searchString.split(',');

    return filterData.some((val) => searchArray.includes(val.toLowerCase()));
  }

  return result;
};


/**
 * Data Table component
 * Displays a set of data that it receives via props.
 *
 * @param {object}    props                  - Component props
 * @param {array}     props.data             - The data to display
 * @param {string}    props.rowNumLabel      - Label for the row number column
 * @param {function}  props.getFormattedCell - Function to format cell content
 * @param {array}     props.actions          - Action buttons to render
 * @param {array}     props.rowActions       - Row-based bulk action configs
 * @param {object}    props.hide             - Configuration to hide specific UI elements
 * @param {boolean}   props.nullTableShow    - Whether to show table if data is null
 * @param {boolean}   props.noDynamicTable   - Whether to disable jQuery DynamicTable
 * @param {function}  props.getMappedCell    - Function to map cell data for CSV
 * @param {array}     props.fields           - Field configurations
 * @param {array}     props.RowNameMap       - Mapping for row identifiers
 * @param {object}    props.filters          - Active filters
 * @param {string}    props.freezeColumn     - Column ID to freeze
 * @param {React.JSX} props.folder           - Optional React element to render
 */
const DataTable = ({
  data = [],
  rowNumLabel = 'No.',
  getFormattedCell,
  actions,
  rowActions,
  hide = {
    rowsPerPage: false,
    downloadCSV: false,
    defaultColumn: false,
  },
  nullTableShow = false,
  noDynamicTable = false,
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

  const [selectedRows, setSelectedRows] = useState(new Set());

  /**
   * Toggle selection of a single row by its data index.
   *
   * @param {number} idx - The row's index into `data`
   */
  const toggleRow = (idx) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  /**
   * Toggle selection of every row on the current page.
   */
  const toggleAllPageRows = () => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      const allSelected = paginatedRows.every((r) => prev.has(r.RowIdx));
      paginatedRows.forEach((r) => {
        if (allSelected) {
          next.delete(r.RowIdx);
        } else {
          next.add(r.RowIdx);
        }
      });
      return next;
    });
  };

  const filterKey = JSON.stringify(filters);

  // Row indexes stop pointing at the same rows when the data or the filters
  // change, so the selection is cleared.
  useEffect(() => {
    setSelectedRows(new Set());
  }, [data.length, filterKey]);

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
      rows: parseInt(e.target.value, 10),
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
    const indexedFields = fields.map((field, index) => ({field, index}));
    const visibleFields = indexedFields.filter(
      ({field}) => field.show !== false
    );
    const headers = fields.map((field) => field.label);
    let csvData = filteredRowIndexes.map((id) => data[id]);

    // Map cell data to proper values if applicable.
    if (getMappedCell) {
      csvData = csvData
        .map((row) => visibleFields
          .map(({field, index}) => getMappedCell(
            field.label,
            row[index],
            row,
            headers,
            index
          ))
        );
    } else {
      csvData = csvData.map(
        (row) => visibleFields.map(({index}) => row[index])
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
      }
    });

    const headerList = visibleFields.map(({field}) => field.label);

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

        if (hasFilterKeyword(
          (field.filter || {}).name, cellData, filters, field.filter || {}
        )) {
          headerCount++;
        }

        if (useKeyword && hasFilterKeyword('keyword', cellData, filters)) {
          keywordMatch++;
        }
      });

      const satisfiesKeyword = useKeyword
        ? keywordMatch > 0 : keywordMatch === 0;

      if (headerCount === filterValuesCount && satisfiesKeyword) {
        filteredIndexes.push(i);
      }
    });

    return filteredIndexes;
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
      const isNumber = !isNaN(val) && typeof val !== 'object';

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
    // Runs once when the table is first rendered.
  }, []);

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
              buttonClass={
                'btn btn-primary' +
                (action.name ? ` action-${action.name}` : '')
              }
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

  // Calculate the slice for the current page
  const rowsPerPage = page.rows;
  const currentPageStart = rowsPerPage * (page.number - 1);
  const currentPageEnd = currentPageStart + rowsPerPage;
  const paginatedRows = sortedRows.slice(currentPageStart, currentPageEnd);

  // Helper for the Header/Footer UI
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
  const footerActionsStyle = {
    order: '2',
    padding: '5px 0',
    marginLeft: 'auto',
  };

  const rowActionsStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    marginRight: '15px',
    paddingRight: '15px',
    borderRight: '1px solid #ddd',
  };

  const visibleRowActions = (rowActions || []).filter(
    (action) => action.show !== false
  );
  const hasRowActions = visibleRowActions.length > 0;

  /**
   * Renders the bulk action buttons for the currently selected rows.
   *
   * @return {JSX.Element[]}
   */
  const renderRowActions = () => {
    const selectedData = Array.from(selectedRows).map((idx) => data[idx]);
    const count = selectedData.length;
    const clearSelection = () => setSelectedRows(new Set());

    return visibleRowActions.map((action) => {
      let reason = null;
      if (count === 0) {
        reason = t('Please select at least one row.');
      } else if (!action.isMulti && count > 1) {
        reason = t('This action only supports a single row.');
      } else if (action.validate) {
        reason = action.validate(selectedData);
      }

      const content = action.renderForm ? (
        <TriggerableModal
          label={action.label}
          disabled={!!reason}
          title={action.title}
          throwWarning={action.throwWarning}
          onUserInput={() => action.onUserInput?.(selectedData)}
          onSubmit={action.onSubmit}
          onSuccess={clearSelection}
          onClose={action.onClose}
        >
          {count > 0 ? action.renderForm(selectedData) : null}
        </TriggerableModal>
      ) : (
        <CTA
          label={action.label}
          disabled={!!reason}
          onUserInput={() => {
            action.onUserInput?.(selectedData);
            clearSelection();
          }}
        />
      );

      return (
        <span
          key={action.name || action.label}
          className={action.name ? `action-${action.name}` : undefined}
          title={reason || undefined}
        >
          {content}
        </span>
      );
    });
  };

  const renderTableControls = (showActions) => (
    <div className="row">
      <div style={tableControlStyle}>
        <div style={{order: '1', padding: '5px 0'}}>
          {showActions && hasRowActions && (
            <span style={rowActionsStyle}>
              {renderRowActions()}
              {selectedRows.size > 0 && (
                <span>
                  <strong>{selectedRows.size}</strong> {t('selected')}
                </span>
              )}
            </span>
          )}
          {t('{{pageCount}} rows displayed of {{totalCount}}.', {
            pageCount: paginatedRows.length,
            totalCount: filteredRowIndexes.length,
          })}
          {' '}
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
        <div style={showActions ? tableActionsStyle : footerActionsStyle}>
          {showActions && renderActions()}
          {showActions && hide.downloadCSV !== true && (
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

  const isEmpty = (!data || data.length === 0) && !nullTableShow;

  if (isEmpty) {
    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <div className="pull-right" style={{marginRight: '10px'}}>
              {renderActions()}
            </div>
          </div>
        </div>
        <div className="alert alert-info no-result-found-panel">
          <strong>{t('No result found.')}</strong>
        </div>
      </div>
    );
  }

  return (
    <div style={{margin: '14px'}}>
      {(hide.rowsPerPage !== true || hasRowActions) && (
        <div className="table-header">
          {renderTableControls(true)}
        </div>
      )}

      <table
        className="table table-hover table-primary table-bordered dynamictable"
        id="dynamictable"
      >
        <thead>
          <tr className="info">
            {hasRowActions && (
              <th style={{width: '40px', textAlign: 'center'}}>
                <input
                  type="checkbox"
                  aria-label={t('Select all rows on this page')}
                  onChange={toggleAllPageRows}
                  checked={
                    paginatedRows.length > 0 &&
                    paginatedRows.every((r) => selectedRows.has(r.RowIdx))
                  }
                />
              </th>
            )}
            {hide.defaultColumn !== true && (
              <th
                key='th_col_0'
                onClick={() => setSortColumn(-1)}
              >
                {rowNumLabel}
              </th>
            )}
            {fields.map((field, i) => {
              if (field.show !== true) return null;
              return (
                <th
                  key={`th_col_${i+1}`}
                  id={field.freezeColumn === true ? freezeColumn : undefined}
                  onClick={() => setSortColumn(i)}
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

            // Construct the 'row' object for the formatter
            const rowObj = {};
            fields.forEach((f, k) => rowObj[f.label] = rowData[k]);
            const fieldLabels = fields.map((f) => f.label);
            const isSelected = selectedRows.has(item.RowIdx);

            return (
              <tr
                key={`tr_${item.RowIdx}`}
                className={isSelected ? 'table-row-selected' : ''}
              >
                {hasRowActions && (
                  <td style={{textAlign: 'center'}}>
                    <input
                      type="checkbox"
                      aria-label={t('Select row')}
                      checked={isSelected}
                      onChange={() => toggleRow(item.RowIdx)}
                    />
                  </td>
                )}
                {hide.defaultColumn !== true && (
                  <td key={`td_${item.RowIdx}`}>{item.Content}</td>
                )}
                {fields.map((field, j) => {
                  if (field.show === false) return null;

                  if (getFormattedCell) {
                    const cell = getFormattedCell(
                      field.label, rowData[j],
                      rowObj,
                      fieldLabels,
                      j
                    );
                    if (cell === null) {
                      return (
                        <React.Fragment key={`td_col_${j}`}>
                          {rowData[j]}
                        </React.Fragment>
                      );
                    }
                    return React.cloneElement(cell, {key: `td_col_${j}`});
                  }
                  return <td key={`td_col_${j}`}>{rowData[j]}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div>{renderTableControls(false)}</div>
    </div>
  );
};

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  rowNumLabel: PropTypes.string,
  getFormattedCell: PropTypes.func,
  actions: PropTypes.array,
  rowActions: PropTypes.array,
  hide: PropTypes.object,
  nullTableShow: PropTypes.bool,
  noDynamicTable: PropTypes.bool,
  getMappedCell: PropTypes.func,
  fields: PropTypes.array,
  RowNameMap: PropTypes.array,
  filters: PropTypes.object,
  freezeColumn: PropTypes.string,
  folder: PropTypes.element,
};

export default DataTable;
