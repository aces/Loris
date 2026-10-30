import type {Column, ColumnType, SavedView} from './RecordTable';
import type {Filters} from './filterMatch';

/**
 * Returns the text a column shows for a value
 *
 * @param {Column} column - the column
 * @param {any} value - the column's value for the record
 * @param {object} record - the record
 * @return {string}
 */
export function displayOf<R>(
  column: Column<R>,
  value: any,
  record: R,
): string {
  if (column.display) {
    return column.display(value, record);
  }
  if (column.filter?.options && value !== null && value !== undefined) {
    const label = column.filter.options[value];
    if (label !== undefined) {
      return label;
    }
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return value === null || value === undefined ? '' : String(value);
}

/**
 * Compares two values of a column for sorting, empty values last
 *
 * @param {ColumnType} type - the column's type
 * @param {any} a - first value
 * @param {any} b - second value
 * @return {number}
 */
export function compareValues(type: ColumnType, a: any, b: any): number {
  const emptyA = a === null || a === undefined || a === '';
  const emptyB = b === null || b === undefined || b === '';
  if (emptyA || emptyB) {
    return emptyA === emptyB ? 0 : (emptyA ? 1 : -1);
  }
  if (type === 'number') {
    return Number(a) - Number(b);
  }
  return String(a).localeCompare(String(b), undefined, {numeric: true});
}

/**
 * Whether a filter value holds nothing
 *
 * @param {any} value - the filter's value
 * @return {boolean}
 */
export function isEmptyFilter(value: any): boolean {
  if (value === null || value === undefined || value === '') {
    return true;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === 'object') {
    return (value.min || '') === '' && (value.max || '') === '';
  }
  return false;
}

/**
 * Gives the URL key for a filter: the column's name, after the table's
 * prefix when it shares the page with another table
 *
 * @param {string} name - the column's name
 * @param {string} prefix - the table's URL prefix, or empty
 * @return {string}
 */
function urlKey(name: string, prefix: string): string {
  return prefix ? `${prefix}.${name}` : name;
}

/**
 * Reads the filters set in the page's URL
 *
 * @param {Column[]} columns - the table's columns
 * @param {string} prefix - the table's URL prefix, or empty
 * @return {Filters}
 */
export function filtersFromURL<R>(
  columns: Column<R>[],
  prefix: string,
): Filters {
  const params = new URLSearchParams(window.location.search);
  const filters: Filters = {};
  columns.forEach((column) => {
    const type = column.filter?.type;
    if (!type) {
      return;
    }
    const key = urlKey(column.name, prefix);
    if (type === 'date-range') {
      const min = params.get(`${key}Min`) || '';
      const max = params.get(`${key}Max`) || '';
      if (min || max) {
        filters[column.name] = {value: {min, max}};
      }
      return;
    }
    const values = params.getAll(key);
    if (values.length === 0) {
      return;
    }
    if (type === 'checkbox') {
      filters[column.name] = {value: values[0] === 'true'};
      return;
    }
    filters[column.name] = type === 'multiselect'
      ? {value: values}
      : {
        value: values[0],
        exactMatch: type === 'select' || type === 'numeric',
      };
  });
  return filters;
}

/**
 * Writes the filters into the page's URL, keeping any other parameters
 *
 * @param {Filters} filters - the filters set
 * @param {string[]} names - every filterable column's name
 * @param {string} prefix - the table's URL prefix, or empty
 */
export function filtersToURL(
  filters: Filters,
  names: string[],
  prefix: string,
) {
  const own = new Set<string>();
  names.forEach((name) => {
    const key = urlKey(name, prefix);
    own.add(key);
    own.add(`${key}Min`);
    own.add(`${key}Max`);
  });
  const params = new URLSearchParams();
  new URLSearchParams(window.location.search).forEach((v, k) => {
    if (!own.has(k)) {
      params.append(k, v);
    }
  });
  Object.entries(filters).forEach(([name, filter]) => {
    const key = urlKey(name, prefix);
    if (Array.isArray(filter.value)) {
      filter.value.forEach((v: any) => params.append(key, String(v)));
    } else if (typeof filter.value === 'object' && filter.value !== null) {
      if (filter.value.min) {
        params.set(`${key}Min`, filter.value.min);
      }
      if (filter.value.max) {
        params.set(`${key}Max`, filter.value.max);
      }
    } else {
      params.set(key, String(filter.value));
    }
  });
  const query = params.toString();
  history.replaceState({}, '', query ? `?${query}` : location.pathname);
}

/**
 * Reads the views saved for a table in this browser
 *
 * @param {string} name - the table's name
 * @return {SavedView[]}
 */
export function loadViews(name: string): SavedView[] {
  try {
    const stored = localStorage.getItem(`recordtable.${name}.views`);
    return JSON.parse(stored || '[]');
  } catch (e) {
    return [];
  }
}

/**
 * Saves a table's views in this browser
 *
 * @param {string} name - the table's name
 * @param {SavedView[]} views - the views
 */
export function storeViews(name: string, views: SavedView[]) {
  try {
    localStorage.setItem(`recordtable.${name}.views`, JSON.stringify(views));
  } catch (e) {
    // Views last for the visit only when storage is unavailable.
  }
}
