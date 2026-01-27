import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import Panel from 'jsx/Panel';
import DataTable from 'jsx/DataTable';
import Filter from 'jsx/Filter';
import ProgressBar from 'jsx/ProgressBar';
import {FilterableDataTableProps, FiltersState, Field} from './types';

/**
 * FilterableDataTable component.
 * A wrapper for all datatables that handles filtering logic and URL state synchronization.
 *
 * @param props - Component properties
 *
 * @param props.name
 * @param props.title
 * @param props.data
 * @param props.filterPresets
 * @param props.fields
 * @param props.columns
 * @param props.getFormattedCell
 * @param props.actions
 * @param props.updateFilterCallback
 * @param props.noDynamicTable
 * @param props.loading
 * @param props.progress
 * @param props.getMappedCell
 * @param props.folder
 * @param props.nullTableShow
 * @param props.children
 */
const FilterableDataTable: React.FC<FilterableDataTableProps> = ({
  name,
  title,
  data,
  filterPresets,
  fields,
  columns = 3,
  getFormattedCell,
  actions,
  updateFilterCallback,
  noDynamicTable = false,
  loading,
  progress,
  getMappedCell,
  folder,
  nullTableShow,
  children,
}) => {
  const {t} = useTranslation(['loris']);

  // Hydrate state from URL on load
  const [filters, setFilters] = useState<FiltersState>(() => {
    const params = new URLSearchParams(window.location.search);
    const initialFilters: FiltersState = {};

    // Iterate over the URL params to populate our starting state
    params.forEach((value, key) => {
      // If the key already exists, turn it into an array (for multi-selects)
      if (initialFilters[key]) {
        const existingValue = initialFilters[key].value;
        initialFilters[key].value = Array.isArray(existingValue)
          ? [...existingValue, value]
          : [existingValue, value];
      } else {
        initialFilters[key] = {value, exactMatch: false};
      }
    });
    return initialFilters;
  });

  /**
   * Updates the URL search parameters to reflect the current filter state.
   * Uses the native URL object for robust path and query handling.
   *
   * @param newFilters - The updated filters object
   */
  const updateQueryParams = useCallback((newFilters: FiltersState): void => {
    const url = new URL(window.location.href);

    // Clear existing params to ensure only current filters exist
    url.search = '';

    Object.entries(newFilters).forEach(([key, filter]) => {
      if (Array.isArray(filter.value)) {
        filter.value.forEach((v) => url.searchParams.append(key, String(v)));
      } else if (filter.value !== undefined && filter.value !== null && filter.value !== '') {
        url.searchParams.set(key, String(filter.value));
      }
    });

    window.history.replaceState({}, '', url.toString());
  }, []);

  /**
   * This watches 'filters' and updates the URL after 300ms of no changes.
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      updateQueryParams(filters);
    }, 300);

    // If 'filters' changes again before 300ms, clear the previous timer
    return () => clearTimeout(handler);
  }, [filters, updateQueryParams]);

  /**
   * Central handler to update state, URL, and trigger external callbacks.
   *
   * @param newFilters - The next state of filters
   */
  const handleUpdateFilters = useCallback((newFilters: FiltersState): void => {
    setFilters(newFilters);
    if (updateFilterCallback) {
      updateFilterCallback(newFilters);
    }
  }, [updateFilterCallback]);

  /**
   * Adds or updates a single filter.
   *
   * @param filterName - Key of the filter
   * @param value - Value to filter by
   * @param exactMatch - Whether to perform an exact match
   */
  const addFilter = useCallback((filterName: string, value: any, exactMatch: boolean): void => {
    const nextFilters = {...filters, [filterName]: {value, exactMatch}};
    handleUpdateFilters(nextFilters);
  }, [filters, handleUpdateFilters]);

  /**
   * Removes a specific filter by name.
   *
   * @param filterName - The name of the filter to delete
   */
  const removeFilter = useCallback((filterName: string): void => {
    const nextFilters = {...filters};
    delete nextFilters[filterName];
    handleUpdateFilters(nextFilters);
  }, [filters, handleUpdateFilters]);

  /**
   * Resets all filters to an empty state.
   */
  const clearFilters = useCallback((): void => {
    handleUpdateFilters({});
  }, [handleUpdateFilters]);

  /**
   * Derived state that filters out invalid selections (e.g., values not in options).
   * Memoized to prevent recalculation on every render.
   */
  const validFilters = useMemo((): FiltersState => {
    const validated: FiltersState = {};
    fields.forEach((field: Field) => {
      if (!field.filter) return;
      const filterName = field.filter.name;
      const filterVal = filters[filterName];
      if (!filterVal) return;

      // Type-specific validation
      if (field.filter.type !== 'select') {
        validated[filterName] = filterVal;
      } else if (filterVal.value in (field.filter.options || {})) {
        validated[filterName] = filterVal;
      }
    });
    return validated;
  }, [fields, filters]);

  // Use useMemo for the DataTable props to prevent unnecessary re-renders
  const showProgressBar = useMemo(() =>
    typeof progress === 'number' && progress < 100,
  [progress]);

  return (
    <Panel title={title}>
      <Filter
        name={`${name}_filter`}
        id={`${name}_filter`}
        columns={columns}
        filters={validFilters}
        title={t('Selection Filter')}
        filterPresets={filterPresets}
        fields={fields}
        addFilter={addFilter}
        updateFilters={handleUpdateFilters}
        removeFilter={removeFilter}
        clearFilters={clearFilters}
      />

      {children}

      {showProgressBar ? (
        <ProgressBar value={progress!} />
      ) : (
        <DataTable
          data={data}
          fields={fields}
          filters={validFilters}
          actions={actions}
          loading={loading}
          getFormattedCell={getFormattedCell}
          getMappedCell={getMappedCell}
          folder={folder}
          nullTableShow={nullTableShow}
          noDynamicTable={noDynamicTable}
        />
      )}
    </Panel>
  );
};

export default FilterableDataTable;
