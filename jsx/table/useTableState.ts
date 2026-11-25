import {useState, useMemo, useEffect, useCallback} from 'react';
import {matchesFilter, Filters} from './filterMatch';
import {
  displayOf, compareValues, isEmptyFilter, filtersFromURL, filtersToURL,
  loadViews, storeViews,
} from './tableState';
import type {
  Column, SortKey, Layout, ViewState, SavedView, PresetView,
} from './RecordTable';

type Group = {key: string, label: string, count: number};

export type Row<R> =
  | {kind: 'group', key: string}
  | {kind: 'record', record: R, index: number};

/**
 * The state behind a RecordTable: filters, search, sorting, grouping, layout,
 * columns, selection and views, with the records and rows they produce.
 *
 * @param props - the table's props
 * @param props.name - the table's name, which keys its saved views
 * @param props.records - the records shown
 * @param props.columns - the table's columns
 * @param props.recordKey - gives a record's unique key
 * @param props.views - views the module defines
 * @param props.defaultSort - the sort before any is chosen
 * @param props.urlPrefix - starts the filters' URL keys, when set
 * @param props.onFiltersChange - called with the new filters
 * @param props.csv - the CSV file name, or false for none
 * @param t - the translation function
 */
export function useTableState<R>(
  props: {
    name: string,
    records: R[],
    columns: Column<R>[],
    recordKey: (record: R) => string | number,
    views?: PresetView[],
    defaultSort?: SortKey[],
    urlPrefix?: string,
    onFiltersChange?: (filters: Filters) => void,
    csv?: {filename: string} | false,
  },
  t: (key: string) => string,
) {
  const {name, records, columns, recordKey, csv = {filename: name}} = props;

  const defaultState: ViewState = useMemo(() => ({
    filters: {},
    sort: props.defaultSort || [],
    hidden: columns.filter((c) => c.hidden).map((c) => c.name),
    order: columns.map((c) => c.name),
    groupBy: '',
    layout: 'table',
  }), [columns, props.defaultSort]);

  const [filters, setFiltersState] = useState<Filters>(
    () => filtersFromURL(columns, props.urlPrefix || '')
  );
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState<SortKey[]>(defaultState.sort);
  const [groupBy, setGroupBy] = useState('');
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [layout, setLayout] = useState<Layout>('table');
  const [hidden, setHidden] = useState<string[]>(defaultState.hidden);
  const [order, setOrder] = useState<string[]>(defaultState.order);
  const [selected, setSelected] = useState<Set<string | number>>(new Set());
  const [views, setViews] = useState<SavedView[]>(() => loadViews(name));
  const [activeView, setActiveView] = useState('');

  const byName = useMemo(() => {
    const map: {[name: string]: Column<R>} = {};
    columns.forEach((c) => map[c.name] = c);
    return map;
  }, [columns]);

  const orderedColumns = [
    ...order.filter((n) => byName[n]).map((n) => byName[n]),
    ...columns.filter((c) => !order.includes(c.name)),
  ];
  const visibleColumns = orderedColumns.filter((c) => !hidden.includes(c.name));

  /**
   * Moves a column to another column's place
   *
   * @param from - the column moved
   * @param to - the column whose place it takes
   */
  const moveColumn = (from: string, to: string) => {
    if (from === to) {
      return;
    }
    const names = orderedColumns.map((c) => c.name).filter((n) => n !== from);
    names.splice(names.indexOf(to) + (
      orderedColumns.findIndex((c) => c.name === from)
        < orderedColumns.findIndex((c) => c.name === to) ? 1 : 0
    ), 0, from);
    setOrder(names);
  };

  /**
   * Moves a column one place among the visible columns
   *
   * @param columnName - the column moved
   * @param by - -1 for left, 1 for right
   */
  const nudgeColumn = (columnName: string, by: number) => {
    const i = visibleColumns.findIndex((c) => c.name === columnName);
    const target = visibleColumns[i + by];
    if (target) {
      moveColumn(columnName, target.name);
    }
  };

  const onFiltersChange = props.onFiltersChange;
  const setFilters = useCallback((next: Filters) => {
    setFiltersState(next);
    filtersToURL(
      next,
      columns.filter((c) => c.filter).map((c) => c.name),
      props.urlPrefix || ''
    );
    if (onFiltersChange) {
      onFiltersChange(next);
    }
  }, [columns, props.urlPrefix, onFiltersChange]);

  /**
   * Sets or clears the filter on one column
   *
   * @param column - the column filtered
   * @param value - the filter's new value
   */
  const setFilter = (column: Column<R>, value: any) => {
    const next = {...filters};
    if (isEmptyFilter(value)) {
      delete next[column.name];
    } else {
      next[column.name] = {
        value, exactMatch: column.filter?.type === 'select'
          || column.filter?.type === 'numeric',
      };
    }
    setFilters(next);
  };

  const currentState: ViewState = {
    filters,
    sort,
    hidden,
    order: orderedColumns.map((c) => c.name),
    groupBy,
    layout,
  };

  /**
   * Puts the table in a view's state
   *
   * @param partial - the view's state, over the default
   * @param id - the view's id, empty for the default view
   */
  const applyView = (partial: Partial<ViewState>, id: string) => {
    const state = {...defaultState, ...partial};
    setFilters(state.filters);
    setSort(state.sort);
    setHidden(state.hidden);
    setOrder(state.order || defaultState.order);
    setGroupBy(state.groupBy);
    setLayout(state.layout);
    setSelected(new Set());
    setActiveView(id);
  };

  const presets = props.views || [];
  const activePreset = presets.find((v) => v.id === activeView);
  let activeState: ViewState = defaultState;
  if (activePreset) {
    activeState = {...defaultState, ...activePreset.state};
  } else if (activeView) {
    activeState = views.find((v) => v.id === activeView)?.state
      || defaultState;
  }
  const modified = JSON.stringify(activeState) !== JSON.stringify(currentState);

  /**
   * Saves the current state as a new view
   *
   * @param label - the view's name
   */
  const saveView = (label: string) => {
    const view = {id: String(Date.now()), name: label, state: currentState};
    const next = [...views, view];
    setViews(next);
    storeViews(name, next);
    setActiveView(view.id);
  };

  /**
   * Saves the current state into the active view
   */
  const updateView = () => {
    const next = views.map((v) => v.id === activeView
      ? {...v, state: currentState} : v);
    setViews(next);
    storeViews(name, next);
  };

  /**
   * Deletes a saved view
   *
   * @param id - the view's id
   */
  const deleteView = (id: string) => {
    const next = views.filter((v) => v.id !== id);
    setViews(next);
    storeViews(name, next);
    if (activeView === id) {
      applyView(defaultState, '');
    }
  };

  /**
   * Renames a saved view
   *
   * @param id - the view's id
   * @param label - its new name
   */
  const renameView = (id: string, label: string) => {
    const next = views.map((v) => v.id === id ? {...v, name: label} : v);
    setViews(next);
    storeViews(name, next);
  };

  // Only the columns with an active filter are read.
  const filtered = useMemo(() => {
    const active = Object.keys(filters).filter((key) => byName[key]);
    const search = keyword.trim().toLowerCase();
    if (active.length === 0 && search === '') {
      return records;
    }
    return records.filter((record) => {
      for (const key of active) {
        const column = byName[key];
        if (!matchesFilter(
          filters[key], column.value(record), column.filter?.type
        )) {
          return false;
        }
      }
      if (search === '') {
        return true;
      }
      return visibleColumns.some((column) => displayOf(
        column, column.value(record), record
      ).toLowerCase().includes(search));
    });
  }, [records, filters, keyword, byName, hidden]);

  const groupOf = useCallback((record: R): {key: string, label: string} => {
    const [columnName, granularity] = groupBy.split(':');
    const column = byName[columnName];
    const value = column.value(record);
    if (column.type === 'date') {
      if (!value) {
        return {key: '', label: t('No date')};
      }
      const date = String(value);
      if (granularity === 'year') {
        return {key: date.substring(0, 4), label: date.substring(0, 4)};
      }
      if (granularity === 'day') {
        return {key: date.substring(0, 10), label: displayOf(
          column, value, record
        )};
      }
      const month = date.substring(0, 7);
      const label = new Intl.DateTimeFormat(undefined, {
        year: 'numeric', month: 'long', timeZone: 'UTC',
      }).format(new Date(month + '-01T00:00:00Z'));
      return {key: month, label};
    }
    const label = displayOf(column, value, record);
    return {key: label, label: label || t('None')};
  }, [groupBy, byName, t]);

  const sorted = useMemo(() => {
    const keys = sort.filter((s) => byName[s.name]);
    if (keys.length === 0 && groupBy === '') {
      return filtered;
    }
    const decorated = filtered.map((record, index) => ({
      record,
      index,
      group: groupBy ? groupOf(record).key : '',
      values: keys.map((s) => {
        const column = byName[s.name];
        const value = column.value(record);
        return column.type === 'number' || column.type === 'date'
          ? value : displayOf(column, value, record).toLowerCase();
      }),
    }));
    decorated.sort((a, b) => {
      if (a.group !== b.group) {
        return compareValues('text', a.group, b.group);
      }
      for (let i = 0; i < keys.length; i++) {
        const column = byName[keys[i].name];
        const result = compareValues(
          column.type || 'text', a.values[i], b.values[i]
        );
        if (result !== 0) {
          return keys[i].ascending ? result : -result;
        }
      }
      return a.index - b.index;
    });
    return decorated.map((d) => d.record);
  }, [filtered, sort, groupBy, groupOf, byName]);

  const groups = useMemo(() => {
    const counts = new Map<string, Group>();
    if (groupBy) {
      sorted.forEach((record) => {
        const {key, label} = groupOf(record);
        const group = counts.get(key) || {key, label, count: 0};
        group.count++;
        counts.set(key, group);
      });
    }
    return counts;
  }, [sorted, groupBy, groupOf]);

  useEffect(() => {
    setCollapsed(new Set());
  }, [groupBy]);

  const shown = useMemo(() => groupBy && collapsed.size > 0
    ? sorted.filter((record) => !collapsed.has(groupOf(record).key))
    : sorted, [sorted, groupBy, collapsed, groupOf]);

  // Each group's header comes before its records. Collapsed groups have no
  // records shown, so their headers come last.
  const rows = useMemo(() => {
    const result: Row<R>[] = [];
    let current: string | null = null;
    shown.forEach((record, index) => {
      if (groupBy) {
        const {key} = groupOf(record);
        if (key !== current) {
          result.push({kind: 'group', key});
          current = key;
        }
      }
      result.push({kind: 'record', record, index});
    });
    if (groupBy) {
      Array.from(groups.keys())
        .filter((key) => collapsed.has(key))
        .forEach((key) => result.push({kind: 'group', key}));
    }
    return result;
  }, [shown, groupBy, groupOf, groups, collapsed]);

  /**
   * Sorts by a column. Shift adds it as a further sort key.
   *
   * @param columnName - the column clicked
   * @param add - whether to keep the existing sort keys
   */
  const sortBy = (columnName: string, add: boolean) => {
    setSort((prev) => {
      const existing = prev.find((s) => s.name === columnName);
      if (add) {
        if (!existing) {
          return [...prev, {name: columnName, ascending: true}];
        }
        if (existing.ascending) {
          return prev.map((s) => s.name === columnName
            ? {...s, ascending: false} : s);
        }
        return prev.filter((s) => s.name !== columnName);
      }
      if (existing && prev.length === 1) {
        return existing.ascending
          ? [{name: columnName, ascending: false}]
          : [];
      }
      return [{name: columnName, ascending: true}];
    });
  };

  const selectedRecords = useMemo(
    () => records.filter((r) => selected.has(recordKey(r))),
    [records, selected, recordKey]
  );

  /**
   * Selects or unselects one record
   *
   * @param key - the record's key
   */
  const toggleRecord = (key: string | number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const shownKeys = useMemo(() => shown.map(recordKey), [shown, recordKey]);
  const {allSelected, partlySelected} = useMemo(() => {
    const count = shownKeys.filter((key) => selected.has(key)).length;
    return {
      allSelected: count > 0 && count === shownKeys.length,
      partlySelected: count > 0 && count < shownKeys.length,
    };
  }, [shownKeys, selected]);

  /**
   * Selects or unselects every record shown
   */
  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      shownKeys.forEach((key) => allSelected
        ? next.delete(key) : next.add(key));
      return next;
    });
  };

  /**
   * Saves records as a CSV of the visible columns
   *
   * @param rows - the records to save
   */
  const downloadCSV = (rows: R[]) => {
    const worker = new Worker(
      (window as any).loris.BaseURL + '/js/workers/savecsv.js'
    );
    worker.addEventListener('message', (e) => {
      if (e.data.cmd === 'SaveCSV') {
        const link = document.createElement('a');
        link.download = `${csv ? csv.filename : name}-` +
          `${new Date().toISOString()}.csv`;
        link.type = 'text/csv';
        link.href = window.URL.createObjectURL(e.data.message);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
    worker.postMessage({
      cmd: 'SaveFile',
      data: rows.map((record) => visibleColumns.map(
        (column) => displayOf(column, column.value(record), record)
      )),
      headers: visibleColumns.map((column) => column.label),
    });
  };

  return {
    defaultState,
    filters,
    setFilters,
    setFilter,
    keyword,
    setKeyword,
    sort,
    sortBy,
    groupBy,
    setGroupBy,
    collapsed,
    setCollapsed,
    layout,
    setLayout,
    hidden,
    setHidden,
    byName,
    orderedColumns,
    visibleColumns,
    moveColumn,
    nudgeColumn,
    views,
    activeView,
    presets,
    activePreset,
    modified,
    applyView,
    saveView,
    updateView,
    deleteView,
    renameView,
    filtered,
    sorted,
    groups,
    groupOf,
    shown,
    rows,
    selected,
    setSelected,
    selectedRecords,
    toggleRecord,
    allSelected,
    partlySelected,
    toggleAll,
    downloadCSV,
  };
}

export type TableState<R> = ReturnType<typeof useTableState<R>>;
