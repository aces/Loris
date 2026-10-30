import React, {
  useState, useMemo, useRef, useEffect, useLayoutEffect, useCallback,
  ReactNode,
} from 'react';
import {useTranslation} from 'react-i18next';
import Button from 'jsx/Button';
import Select from 'jsx/Select';
import Textbox from 'jsx/Textbox';
import DateRange from 'jsx/DateRange';
import Toggle from 'jsx/Toggle';
import {Icon} from './icons';
import {matchesFilter, Filters} from './filterMatch';
import {
  displayOf, compareValues, isEmptyFilter, filtersFromURL, filtersToURL,
  loadViews, storeViews,
} from './tableState';
import './RecordTable.css';

export type ColumnType = 'text' | 'number' | 'date';

export type ColumnFilter = {
  type: 'text' | 'numeric' | 'select' | 'multiselect' | 'date-range'
    | 'date' | 'checkbox',
  options?: {[key: string]: string},
};

export type Column<R> = {
  name: string,
  label: string,
  value: (record: R) => any,
  display?: (value: any, record: R) => string,
  format?: (value: any, record: R) => ReactNode,
  type?: ColumnType,
  filter?: ColumnFilter,
  hidden?: boolean,
  groupable?: boolean,
  sticky?: boolean,
  group?: string,
};

export type TableAction = {
  name: string,
  label: string,
  onClick?: () => void,
  renderForm?: (close: () => void) => ReactNode,
  title?: string,
  show?: boolean,
};

export type RecordAction<R> = {
  name: string,
  label: string,
  onClick?: (record: R) => void,
  renderForm?: (record: R, close: () => void) => ReactNode,
  title?: (record: R) => string,
  show?: (record: R) => boolean,
};

export type RowAction<R> = {
  name: string,
  label: string,
  onClick: (records: R[]) => void,
  multiple?: boolean,
  validate?: (records: R[]) => string | null,
  show?: boolean,
};

export type SortKey = {name: string, ascending: boolean};

export type Layout = 'table' | 'cards';

export type ViewState = {
  filters: Filters,
  sort: SortKey[],
  hidden: string[],
  order: string[],
  groupBy: string,
  layout: Layout,
};

export type SavedView = {id: string, name: string, state: ViewState};

export type PresetView = {
  id: string,
  name: string,
  state: Partial<ViewState>,
};

type Props<R> = {
  name: string,
  title: string,
  records: R[],
  columns: Column<R>[],
  recordKey: (record: R) => string | number,
  actions?: TableAction[],
  rowActions?: RowAction<R>[],
  recordActions?: RecordAction<R>[],
  selectable?: boolean,
  views?: PresetView[],
  onFiltersChange?: (filters: Filters) => void,
  progress?: number,
  loading?: boolean,
  renderDetail?: (record: R) => ReactNode,
  variant?: 'full' | 'compact',
  fill?: boolean,
  urlPrefix?: string,
  controls?: ReactNode,
  sections?: {[value: string]: string},
  section?: string,
  onSectionChange?: (section: string) => void,
  csv?: {filename: string} | false,
  defaultSort?: SortKey[],
  pageSizes?: number[],
  emptyMessage?: string,
};

type Group = {key: string, label: string, count: number};

/**
 * A table of records with a header, saved views, a filter bar, sorting on
 * several columns, grouping, a card layout and actions on selected rows.
 *
 * @param {Props} props - React props
 * @return {ReactNode}
 */
function RecordTable<R>(props: Props<R>) {
  const {t} = useTranslation(['loris']);
  const {
    name, title, records, columns, recordKey,
    actions = [], rowActions = [],
    csv = {filename: name},
    pageSizes = [50, 100, 500, 1000],
    emptyMessage,
  } = props;

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
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState<SortKey[]>(defaultState.sort);
  const [groupBy, setGroupBy] = useState('');
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [layout, setLayout] = useState<Layout>('table');
  const [hidden, setHidden] = useState<string[]>(defaultState.hidden);
  const [order, setOrder] = useState<string[]>(defaultState.order);
  const dragged = useRef<string>('');
  const [dropTarget, setDropTarget] = useState('');
  const [selected, setSelected] = useState<Set<string | number>>(new Set());
  // Every row shows when there are few enough; 0 means all.
  const [page, setPage] = useState({
    number: 1, size: records.length <= 1000 ? 0 : 100,
  });
  const [menu, setMenu] = useState<string | null>(null);
  const [form, setForm] = useState<
    {action: string, key?: string | number} | null
  >(null);
  const [openKey, setOpenKey] = useState<string | number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen) {
      searchRef.current?.querySelector('input')?.focus();
    }
  }, [searchOpen]);
  const [views, setViews] = useState<SavedView[]>(() => loadViews(name));
  const [activeView, setActiveView] = useState('');
  const [viewName, setViewName] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  // A full-page table measures where it starts, so it can take the rest of
  // the window and scroll only its rows.
  useLayoutEffect(() => {
    if (!props.fill || !pageRef.current) {
      return;
    }
    const el = pageRef.current;
    /**
     * Records how far down the page the table starts
     */
    const measure = () => el.style.setProperty(
      '--rt-top',
      `${el.getBoundingClientRect().top + window.scrollY}px`
    );
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [props.fill]);

  useEffect(() => {
    if (!menu) {
      return;
    }
    /**
     * Closes the open menu on a click outside it
     *
     * @param {MouseEvent} e - the click
     */
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenu(null);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menu]);

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
   * @param {string} from - the column moved
   * @param {string} to - the column whose place it takes
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
   * @param {string} columnName - the column moved
   * @param {number} by - -1 for left, 1 for right
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
    setPage((p) => ({...p, number: 1}));
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
   * @param {Column} column - the column filtered
   * @param {any} value - the filter's new value
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
   * @param {Partial<ViewState>} partial - the view's state, over the default
   * @param {string} id - the view's id, empty for the default view
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
   */
  const saveView = () => {
    const label = viewName.trim();
    if (!label) {
      return;
    }
    const view = {id: String(Date.now()), name: label, state: currentState};
    const next = [...views, view];
    setViews(next);
    storeViews(name, next);
    setActiveView(view.id);
    setViewName('');
    setMenu(null);
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
   * @param {string} id - the view's id
   */
  const deleteView = (id: string) => {
    const next = views.filter((v) => v.id !== id);
    setViews(next);
    storeViews(name, next);
    if (activeView === id) {
      applyView(defaultState, '');
    }
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

  // Collapsed groups drop out of paging so the pages stay full.
  const pageable = groupBy && collapsed.size > 0
    ? sorted.filter((record) => !collapsed.has(groupOf(record).key))
    : sorted;
  const size = page.size || Math.max(pageable.length, 1);
  const lastPage = Math.max(1, Math.ceil(pageable.length / size));
  const pageNumber = Math.min(page.number, lastPage);
  const start = (pageNumber - 1) * size;
  const pageRecords = pageable.slice(start, start + size);

  /**
   * Sorts by a column. Shift adds it as a further sort key.
   *
   * @param {string} columnName - the column clicked
   * @param {boolean} add - whether to keep the existing sort keys
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
   * @param {string|number} key - the record's key
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

  const pageKeys = pageRecords.map(recordKey);
  const pageSelected = pageKeys.length > 0 &&
    pageKeys.every((key) => selected.has(key));
  const pagePartly = !pageSelected && pageKeys.some((k) => selected.has(k));

  /**
   * Selects or unselects every record on the page
   */
  const togglePage = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      pageKeys.forEach((key) => pageSelected
        ? next.delete(key) : next.add(key));
      return next;
    });
  };

  /**
   * Saves records as a CSV of the visible columns
   *
   * @param {object[]} rows - the records to save
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

  const groupOptions: {[value: string]: string} = {'': t('None')};
  columns.filter((c) => c.groupable).forEach((c) => {
    if (c.type === 'date') {
      groupOptions[`${c.name}:day`] = `${c.label} (${t('day')})`;
      groupOptions[`${c.name}:month`] = `${c.label} (${t('month')})`;
      groupOptions[`${c.name}:year`] = `${c.label} (${t('year')})`;
    } else {
      groupOptions[c.name] = c.label;
    }
  });

  const shownActions = actions.filter((a) => a.show !== false);
  const shownRowActions = rowActions.filter((a) => a.show !== false);
  const selectable = shownRowActions.length > 0 || !!props.selectable;

  /**
   * Renders a cell's content
   *
   * @param {Column} column - the column
   * @param {object} record - the record
   * @return {ReactNode}
   */
  const cellContent = (column: Column<R>, record: R): ReactNode => {
    const value = column.value(record);
    if (column.format) {
      return column.format(value, record);
    }
    return displayOf(column, value, record);
  };

  /**
   * Renders the control that edits a column's filter
   *
   * @param {Column} column - the filtered column
   * @return {ReactNode}
   */
  const filterControl = (column: Column<R>): ReactNode => {
    const filter = column.filter as ColumnFilter;
    const value = filters[column.name]?.value;
    switch (filter.type) {
    case 'multiselect':
      return <Select
        name={column.name}
        label={column.label}
        clearable
        clearLabel={t('Clear {{label}}', {label: column.label})}
        options={filter.options || {}}
        value={Array.isArray(value) ? value : []}
        maxVisible={2}
        onChange={(values) => setFilter(column, values)}
      />;
    case 'select':
      return <Select
        name={column.name}
        label={column.label}
        multiple={false}
        clearable
        clearLabel={t('Clear {{label}}', {label: column.label})}
        options={filter.options || {}}
        value={value ? [value] : []}
        onChange={(values) => setFilter(column, values[0] || '')}
      />;
    case 'date-range':
      return <DateRange
        name={column.name}
        label={column.label}
        clearable
        value={value || {}}
        placeholder={t('Any date')}
        clearLabel={t('Clear {{label}}', {label: column.label})}
        onChange={(range) => setFilter(column, range)}
      />;
    case 'checkbox':
      return <Toggle
        display="checkbox"
        name={`${name}_filter_${column.name}`}
        label={column.label}
        checked={value === true}
        onChange={(checked) => setFilter(column, checked ? true : '')}
      />;
    default:
      return <Textbox
        name={column.name}
        label={column.label}
        clearable
        clearLabel={t('Clear {{label}}', {label: column.label})}
        value={value || ''}
        onChange={(text) => setFilter(column, text)}
      />;
    }
  };

  const filterColumns = columns.filter((c) => c.filter);
  const activeCount = Object.keys(filters).filter((k) => byName[k]).length;


  const tableActions = shownActions.length > 0 && (
    <div className="rt-actions">
      {shownActions.map((action) => (
        <span key={action.name} className={`action-${action.name}`}>
          <Button onClick={() => action.renderForm
            ? setForm({action: action.name})
            : action.onClick?.()}>
            {action.renderForm && <Icon name="add" />} {action.label}
          </Button>
        </span>
      ))}
    </div>
  );

  const viewTabs = (
    <div className="rt-tabs" role="tablist" aria-label={t('Views')}>
      <button
        type="button"
        role="tab"
        aria-selected={activeView === ''}
        className={'rt-tab' + (activeView === '' ? ' rt-tab-on' : '')}
        onClick={() => applyView(defaultState, '')}
      >
        {t('All')}
      </button>
      {presets.map((view) => (
        <button
          key={view.id}
          type="button"
          role="tab"
          aria-selected={activeView === view.id}
          className={'rt-tab' + (activeView === view.id ? ' rt-tab-on' : '')}
          onClick={() => applyView(view.state, view.id)}
        >
          {view.name}
        </button>
      ))}
      {views.map((view) => (
        <span
          key={view.id}
          className={'rt-tab'
            + (activeView === view.id ? ' rt-tab-on' : '')}
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeView === view.id}
            className="rt-tab-label"
            onClick={() => applyView(view.state, view.id)}
          >
            {view.name}
          </button>
          <button
            type="button"
            className="rt-tab-remove"
            aria-label={t('Delete view {{name}}', {name: view.name})}
            onClick={() => deleteView(view.id)}
          >
            <Icon name="close" />
          </button>
        </span>
      ))}
      {modified && (
        <div className="rt-menu-anchor" ref={menu === 'save'
          ? menuRef : undefined}>
          {activeView && !activePreset && (
            <Button display="quiet" onClick={updateView}>
              <Icon name="save" /> {t('Save')}
            </Button>
          )}
          <Button
            display="quiet"
            onClick={() => setMenu(menu === 'save' ? null : 'save')}
          >
            <Icon name="add" />
            {' '}{activeView ? t('Save as new view…') : t('Save view…')}
          </Button>
          {menu === 'save' && (
            <form
              className="rt-menu rt-menu-start"
              onSubmit={(e) => {
                e.preventDefault();
                saveView();
              }}
            >
              <Textbox
                label={t('View name')}
                value={viewName}
                onChange={setViewName}
              />
              <p className="rt-hint">
                {t('Saves the filters, sort, grouping, layout and columns'
                  + ' for you, in this browser.')}
              </p>
              <div className="rt-menu-foot">
                <Button type="submit" disabled={!viewName.trim()}>
                  {t('Save')}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );

  const columnOptions: {[name: string]: string} = {};
  orderedColumns.forEach((c) => columnOptions[c.name] = c.label);
  const layoutOptions = {table: t('Table'), cards: t('Cards')};

  const toolbar = (
    <div className="rt-toolbar">
      <div className="rt-heading">
        {props.sections && props.onSectionChange ? (
          <div className="rt-title rt-title-switch">
            <Select
              appearance="button"
              multiple={false}
              options={props.sections}
              value={[props.section || Object.keys(props.sections)[0]]}
              onChange={(values) => values[0]
                && props.onSectionChange?.(values[0])}
            />
          </div>
        ) : (
          <h2 className="rt-title">{title}</h2>
        )}
        {viewTabs}
      </div>
      {searchOpen || keyword ? (
        <div className="rt-search" ref={searchRef}>
          <Textbox
            search
            value={keyword}
            placeholder={t('Search…')}
            clearLabel={t('Clear search')}
            onBlur={() => keyword === '' && setSearchOpen(false)}
            onChange={(text) => {
              setKeyword(text);
              setPage((p) => ({...p, number: 1}));
            }}
          />
        </div>
      ) : (
        <span className="rt-search-closed">
          <Button display="quiet" onClick={() => setSearchOpen(true)}>
            <Icon name="search" /> {t('Search')}
          </Button>
        </span>
      )}
      <div className="rt-toolbar-group" role="group" aria-label={t('Display')}>
        {props.controls}
        <Select
          appearance="button"
          icon={<Icon name={layout} />}
          multiple={false}
          options={layoutOptions}
          value={[layout]}
          onChange={(values) => setLayout((values[0] || 'table') as Layout)}
        />
        <Select
          appearance="button"
          icon={<Icon name="group" />}
          label={t('Group by')}
          multiple={false}
          options={groupOptions}
          value={[groupBy]}
          onChange={(values) => {
            setGroupBy(values[0] || '');
            setPage((p) => ({...p, number: 1}));
          }}
        />
        <Select
          appearance="button"
          icon={<Icon name="columns" />}
          label={t('Columns')}
          options={columnOptions}
          value={visibleColumns.map((c) => c.name)}
          display="count"
          searchPlaceholder={t('Find a column…')}
          onChange={(values) => setHidden(
            orderedColumns.map((c) => c.name).filter((n) => !values.includes(n))
          )}
        />
      </div>
      <div className="rt-toolbar-group" role="group" aria-label={t('Actions')}>
        {csv !== false && (
          <Button display="quiet" onClick={() => downloadCSV(sorted)}>
            <Icon name="download" /> {t('Download CSV')}
          </Button>
        )}
        {tableActions}
      </div>
    </div>
  );

  const rail = filterColumns.length > 0 && !drawerOpen && (
    <aside className="rt-rail" aria-label={t('Filters')}>
      <button
        type="button"
        className="rt-rail-button"
        aria-expanded={false}
        title={t('Show filters')}
        aria-label={t('Show filters')}
        onClick={() => setDrawerOpen(true)}
      >
        <Icon name="filter" />
        {activeCount > 0 && <span className="rt-badge">{activeCount}</span>}
      </button>
    </aside>
  );

  const drawer = filterColumns.length > 0 && drawerOpen && (
    <aside className="rt-drawer" aria-label={t('Filters')}>
      <div className="rt-drawer-head">
        <h3 className="rt-drawer-title">
          {t('Filters')}
          {activeCount > 0 && <span className="rt-badge">{activeCount}</span>}
        </h3>
        <span className="rt-clear-all">
          <Button
            display="quiet"
            disabled={activeCount === 0}
            onClick={() => setFilters({})}
          >
            {t('Clear all')}
          </Button>
        </span>
        <Button display="quiet" onClick={() => setDrawerOpen(false)}>
          <Icon name="collapse" /> {t('Hide')}
        </Button>
      </div>
      <div className="rt-drawer-fields">
        {filterColumns.map((column) => (
          <div key={column.name} className="rt-drawer-field">
            {filterControl(column)}
          </div>
        ))}
      </div>
    </aside>
  );

  const rowActionStates = shownRowActions.map((action) => {
    let reason: string | null = null;
    if (selectedRecords.length === 0) {
      reason = null;
    } else if (!action.multiple && selectedRecords.length > 1) {
      reason = t('one row at a time');
    } else if (action.validate) {
      reason = action.validate(selectedRecords);
    }
    return {action, reason};
  });
  const blocked = rowActionStates.filter((s) => s.reason !== null);

  const selectionBar = selectable && selected.size > 0 && (
    <div className="rt-selection" role="region" aria-label={t('Selection')}>
      <span className="rt-selected-count">
        {t('{{count}} selected', {count: selected.size})}
      </span>
      {rowActionStates.map(({action, reason}) => {
        return (
          <span key={action.name} className={`action-${action.name}`}>
            <Button
              display="secondary"
              disabled={reason !== null}
              title={reason || undefined}
              onClick={() => action.onClick(selectedRecords)}
            >
              {action.label}
            </Button>
          </span>
        );
      })}
      {blocked.length > 0 && (
        <span className="rt-selection-note">
          {Array.from(new Set(blocked.map((s) => s.reason))).map((reason) =>
            blocked.filter((s) => s.reason === reason)
              .map((s) => s.action.label).join(', ') + ': ' + reason
          ).join(' · ')}
        </span>
      )}
      {csv !== false && (
        <Button display="quiet" onClick={() => downloadCSV(selectedRecords)}>
          <Icon name="download" /> {t('Download selected')}
        </Button>
      )}
      <span className="rt-selection-end">
        {pageSelected && selected.size < sorted.length && (
          <Button
            display="quiet"
            onClick={() => setSelected(new Set(sorted.map(recordKey)))}
          >
            {t('Select all {{count}}', {count: sorted.length})}
          </Button>
        )}
        <Button display="quiet" onClick={() => setSelected(new Set())}>
          <Icon name="close" /> {t('Clear selection')}
        </Button>
      </span>
    </div>
  );

  /**
   * Renders the header of a group
   *
   * @param {string} key - the group's key
   * @param {Function} wrap - wraps the header for the current layout
   * @return {ReactNode}
   */
  const groupHeaderFor = (
    key: string,
    wrap: (content: ReactNode, key: string) => ReactNode,
  ): ReactNode => {
    const group = groups.get(key);
    if (!group) {
      return null;
    }
    const isCollapsed = collapsed.has(key);
    return wrap(
      <button
        type="button"
        className="rt-group-toggle"
        aria-expanded={!isCollapsed}
        onClick={() => setCollapsed((prev) => {
          const next = new Set(prev);
          if (next.has(key)) {
            next.delete(key);
          } else {
            next.add(key);
          }
          return next;
        })}
      >
        <span className={'rt-caret' + (isCollapsed ? ' rt-caret-closed' : '')}>
          <Icon name="expand" />
        </span>
        {group.label}
        <span className="rt-group-count">{group.count}</span>
      </button>,
      `group_${key}`
    );
  };

  /**
   * Renders the group header shown before a record, if it starts a group
   *
   * @param {object} record - the record
   * @param {number} i - its position on the page
   * @param {Function} wrap - wraps the header for the current layout
   * @return {ReactNode}
   */
  const groupHeader = (
    record: R,
    i: number,
    wrap: (content: ReactNode, key: string) => ReactNode,
  ): ReactNode => {
    if (!groupBy) {
      return null;
    }
    const {key} = groupOf(record);
    if (i > 0 && groupOf(pageRecords[i - 1]).key === key) {
      return null;
    }
    return groupHeaderFor(key, wrap);
  };

  /**
   * Renders the headers of collapsed groups, which have no records on the
   * page and are listed after the page's records
   *
   * @param {Function} wrap - wraps the header for the current layout
   * @return {ReactNode}
   */
  const collapsedHeaders = (
    wrap: (content: ReactNode, key: string) => ReactNode,
  ) => groupBy && collapsed.size > 0
    ? Array.from(groups.keys())
      .filter((key) => collapsed.has(key))
      .map((key) => groupHeaderFor(key, wrap))
    : null;

  const recordActions = props.recordActions || [];
  const hasRecordActions = recordActions.length > 0;
  const detail = props.renderDetail;
  const columnCount = visibleColumns.length + (selectable ? 1 : 0)
    + (hasRecordActions ? 1 : 0);
  const leadCells = selectable ? 1 : 0;
  const hasGroups = visibleColumns.some((c) => c.group);
  const groupBands: {label: string, span: number}[] = [];
  visibleColumns.forEach((column) => {
    const label = column.group || '';
    const last = groupBands[groupBands.length - 1];
    if (last && last.label === label) {
      last.span++;
    } else {
      groupBands.push({label, span: 1});
    }
  });

  /**
   * Renders a record's own actions: one as a button, more as a menu
   *
   * @param {object} record - the record
   * @return {ReactNode}
   */
  const recordActionCell = (record: R): ReactNode => {
    const key = recordKey(record);
    const shown = recordActions.filter((a) => !a.show || a.show(record));
    /**
     * Runs a record action, opening its form when it has one
     *
     * @param {RecordAction} action - the action chosen
     */
    const run = (action: RecordAction<R>) => {
      setMenu(null);
      if (action.renderForm) {
        setForm({action: action.name, key});
      } else {
        action.onClick?.(record);
      }
    };
    if (shown.length === 0) {
      return null;
    }
    if (recordActions.length === 1) {
      return (
        <Button display="quiet" onClick={() => run(shown[0])}>
          {shown[0].label}
        </Button>
      );
    }
    const id = `row:${key}`;
    return (
      <div className="rt-menu-anchor" ref={menu === id ? menuRef : undefined}>
        <button
          type="button"
          className="rt-row-menu"
          aria-label={t('Actions')}
          aria-expanded={menu === id}
          onClick={() => setMenu(menu === id ? null : id)}
        >
          <Icon name="more" />
        </button>
        {menu === id && (
          <div className="rt-menu" role="menu">
            {shown.map((action) => (
              <button
                key={action.name}
                type="button"
                role="menuitem"
                className="rt-menu-item"
                onClick={() => run(action)}
              >
                {action.label}{action.renderForm ? '…' : ''}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };
  const empty = pageRecords.length === 0 && collapsed.size === 0;

  // One row is a tab stop: the open one, or else the first on the page.
  const openOnPage = openKey !== null && pageKeys.includes(openKey);

  const tableLayout = (
    <div className="rt-scroll">
      <table className="rt-table">
        <thead>
          {hasGroups && (
            <tr className="rt-band-row">
              {leadCells > 0 && <th colSpan={leadCells} />}
              {groupBands.map((band, i) => (
                <th key={i} colSpan={band.span} className="rt-band">
                  {band.label}
                </th>
              ))}
              {hasRecordActions && <th />}
            </tr>
          )}
          <tr className={hasGroups ? 'rt-under-band' : undefined}>
            {selectable && (
              <th className="rt-check-cell">
                <input
                  type="checkbox"
                  aria-label={t('Select all rows on this page')}
                  checked={pageSelected}
                  ref={(el) => {
                    if (el) {
                      el.indeterminate = pagePartly;
                    }
                  }}
                  onChange={togglePage}
                />
              </th>
            )}
            {visibleColumns.map((column) => {
              const position = sort.findIndex((s) => s.name === column.name);
              const key = sort[position];
              return (
                <th
                  key={column.name}
                  className={(column.type === 'number' ? 'rt-number' : '')
                    + (column.sticky ? ' rt-sticky' : '')
                    + (dropTarget === column.name ? ' rt-drop' : '')}
                  aria-sort={key
                    ? (key.ascending ? 'ascending' : 'descending')
                    : 'none'}
                  draggable
                  onDragStart={(e) => {
                    dragged.current = column.name;
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDropTarget(column.name);
                  }}
                  onDragLeave={() => setDropTarget('')}
                  onDrop={(e) => {
                    e.preventDefault();
                    moveColumn(dragged.current, column.name);
                    setDropTarget('');
                  }}
                  onDragEnd={() => setDropTarget('')}
                >
                  <button
                    type="button"
                    className={'rt-sort' + (key ? ' rt-sorted' : '')}
                    title={t('Click to sort, shift-click to add a sort.'
                      + ' Drag, or Alt and an arrow key, to move.')}
                    onClick={(e) => sortBy(column.name, e.shiftKey)}
                    onKeyDown={(e) => {
                      if (e.altKey && (e.key === 'ArrowLeft'
                        || e.key === 'ArrowRight')) {
                        e.preventDefault();
                        nudgeColumn(
                          column.name, e.key === 'ArrowLeft' ? -1 : 1
                        );
                      }
                    }}
                  >
                    <span>{column.label}</span>
                    <span className={'rt-sort-icon'
                      + (key && !key.ascending ? ' rt-sort-down' : '')}>
                      <Icon name="sort" />
                    </span>
                    {key && sort.length > 1 && (
                      <span className="rt-sort-order">{position + 1}</span>
                    )}
                  </button>
                </th>
              );
            })}
            {hasRecordActions && (
              <th className="rt-actions-cell">
                <span className="rt-visually-hidden">{t('Actions')}</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {props.loading && records.length === 0 && [0, 1, 2, 3, 4].map((i) => (
            <tr key={'skeleton' + i} className="rt-skeleton" aria-hidden="true">
              <td colSpan={columnCount}><span /></td>
            </tr>
          ))}
          {empty && !(props.loading && records.length === 0) && (
            <tr>
              <td colSpan={columnCount} className="rt-empty">
                {emptyMessage || t('No records match.')}
              </td>
            </tr>
          )}
          {pageRecords.map((record, i) => {
            const key = recordKey(record);
            const isSelected = selected.has(key);
            return (
              <React.Fragment key={key}>
                {groupHeader(record, i, (content, k) => (
                  <tr key={k} className="rt-group-row">
                    <td colSpan={columnCount}>{content}</td>
                  </tr>
                ))}
                <tr
                  className={(isSelected ? 'rt-selected' : '')
                    + (openKey === key ? ' rt-open' : '')}
                  data-record
                  tabIndex={(openOnPage ? openKey === key : i === 0)
                    ? 0 : -1}
                  onClick={(e) => {
                    if ((e.target as HTMLElement)
                      .closest('a, button, input, label, select')) {
                      return;
                    }
                    setOpenKey(openKey === key ? null : key);
                  }}
                  onKeyDown={(e) => {
                    if (e.target !== e.currentTarget) {
                      return;
                    }
                    if (e.key === 'Enter') {
                      setOpenKey(key);
                    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                      e.preventDefault();
                      const rows = Array.from(e.currentTarget.parentElement
                        ?.querySelectorAll<HTMLElement>('tr[data-record]')
                        || []);
                      const next = rows[rows.indexOf(e.currentTarget)
                        + (e.key === 'ArrowDown' ? 1 : -1)];
                      if (next) {
                        next.focus();
                        if (openKey !== null) {
                          next.click();
                        }
                      }
                    }
                  }}
                >
                  {selectable && (
                    <td className="rt-check-cell">
                      <input
                        type="checkbox"
                        aria-label={t('Select row')}
                        checked={isSelected}
                        onChange={() => toggleRecord(key)}
                      />
                    </td>
                  )}
                  {visibleColumns.map((column) => (
                    <td
                      key={column.name}
                      className={(column.type === 'number' ? 'rt-number' : '')
                        + (column.sticky ? ' rt-sticky' : '')}
                    >
                      {cellContent(column, record)}
                    </td>
                  ))}
                  {hasRecordActions && (
                    <td className="rt-actions-cell">
                      {recordActionCell(record)}
                    </td>
                  )}
                </tr>
              </React.Fragment>
            );
          })}
          {collapsedHeaders((content, k) => (
            <tr key={k} className="rt-group-row">
              <td colSpan={columnCount}>{content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const [titleColumn, ...detailColumns] = visibleColumns;
  const cardLayout = (
    <div className="rt-cards">
      {empty && (
        <div className="rt-empty">{emptyMessage || t('No records match.')}</div>
      )}
      {pageRecords.map((record, i) => {
        const key = recordKey(record);
        const isSelected = selected.has(key);
        return (
          <React.Fragment key={key}>
            {groupHeader(record, i, (content, k) => (
              <div key={k} className="rt-card-group">{content}</div>
            ))}
            <div className={'rt-card' + (isSelected ? ' rt-selected' : '')}>
              <div className="rt-card-title">
                {selectable && (
                  <input
                    type="checkbox"
                    aria-label={t('Select row')}
                    checked={isSelected}
                    onChange={() => toggleRecord(key)}
                  />
                )}
                {titleColumn && cellContent(titleColumn, record)}
              </div>
              <dl className="rt-card-fields">
                {detailColumns.map((column) => (
                  <React.Fragment key={column.name}>
                    <dt>{column.label}</dt>
                    <dd>{cellContent(column, record)}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </div>
          </React.Fragment>
        );
      })}
      {collapsedHeaders((content, k) => (
        <div key={k} className="rt-card-group">{content}</div>
      ))}
    </div>
  );

  const sizeOptions: {[value: string]: string} = {};
  pageSizes.forEach((n) => sizeOptions[String(n)] = String(n));
  sizeOptions['0'] = t('All');
  const first = pageable.length === 0 ? 0 : start + 1;
  const last = start + pageRecords.length;
  const footer = (
    <div className="rt-footer">
      {filtered.length < records.length && (
        <span className="rt-muted">
          {t('Filtered from {{count}}', {count: records.length})}
        </span>
      )}
      <span className="rt-footer-label">{t('Rows per page')}</span>
      <div className="rt-pagesize">
        <Select
          multiple={false}
          options={sizeOptions}
          value={[String(page.size)]}
          onChange={(values) => setPage({
            number: 1, size: parseInt(values[0], 10),
          })}
        />
      </div>
      <span className="rt-range" data-total={pageable.length}>
        {t('{{first}}–{{last}} of {{total}}', {
          first, last, total: pageable.length,
        })}
      </span>
      <Button
        display="quiet"
        title={t('Previous page')}
        disabled={pageNumber <= 1}
        onClick={() => setPage((p) => ({...p, number: pageNumber - 1}))}
      >
        <Icon name="chevronLeft" />
      </Button>
      <Button
        display="quiet"
        title={t('Next page')}
        disabled={pageNumber >= lastPage}
        onClick={() => setPage((p) => ({...p, number: pageNumber + 1}))}
      >
        <Icon name="chevronRight" />
      </Button>
    </div>
  );

  const openIndex = openKey === null
    ? -1 : pageable.findIndex((r) => recordKey(r) === openKey);
  const openRecord = openIndex >= 0 ? pageable[openIndex] : null;

  /**
   * Opens the record before or after the open one
   *
   * @param {number} by - -1 for the one before, 1 for the one after
   */
  const stepRecord = (by: number) => {
    const next = pageable[openIndex + by];
    if (next) {
      setOpenKey(recordKey(next));
      const index = openIndex + by;
      setPage((p) => ({...p, number: Math.floor(index / size) + 1}));
    }
  };

  useEffect(() => {
    if (openKey === null) {
      return;
    }
    /**
     * Moves between records with the arrow keys and closes with Escape
     *
     * @param {KeyboardEvent} e - the key pressed
     */
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(
        'input, textarea, select, [role=dialog], tr[data-record]'
      )) {
        return;
      }
      if (e.key === 'Escape') {
        setOpenKey(null);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        stepRecord(e.key === 'ArrowDown' ? 1 : -1);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const recordDrawer = openRecord !== null && (
    <aside className="rt-record" aria-label={t('Record')}>
      <div className="rt-record-head">
        <h3 className="rt-record-title">
          {visibleColumns[0] && cellContent(visibleColumns[0], openRecord)}
        </h3>
        <Button
          display="quiet"
          title={t('Previous record')}
          disabled={openIndex <= 0}
          onClick={() => stepRecord(-1)}
        >
          <Icon name="chevronUp" />
        </Button>
        <Button
          display="quiet"
          title={t('Next record')}
          disabled={openIndex >= pageable.length - 1}
          onClick={() => stepRecord(1)}
        >
          <Icon name="chevronDown" />
        </Button>
        <Button
          display="quiet"
          title={t('Close')}
          onClick={() => setOpenKey(null)}
        >
          <Icon name="close" />
        </Button>
      </div>
      {hasRecordActions && (
        <div className="rt-record-actions">
          {recordActions
            .filter((a) => !a.show || a.show(openRecord))
            .map((action) => (
              <Button
                key={action.name}
                display="secondary"
                onClick={() => action.renderForm
                  ? setForm({action: action.name, key: openKey as string})
                  : action.onClick?.(openRecord)}
              >
                {action.label}{action.renderForm ? '…' : ''}
              </Button>
            ))}
        </div>
      )}
      <dl className="rt-record-fields">
        {orderedColumns.map((column) => (
          <React.Fragment key={column.name}>
            <dt>{column.label}</dt>
            <dd>{cellContent(column, openRecord) || '—'}</dd>
          </React.Fragment>
        ))}
      </dl>
      {detail && <div className="rt-record-detail">{detail(openRecord)}</div>}
      <p className="rt-hint rt-record-keys">
        {t('↑ ↓ to move between records · Esc to close')}
      </p>
    </aside>
  );

  let formContent: ReactNode = null;
  let formTitle = '';
  if (form) {
    /**
     * Closes the form, after it saves or is cancelled
     */
    const close = () => setForm(null);
    if (form.key === undefined) {
      const action = actions.find((a) => a.name === form.action);
      formTitle = action?.title || action?.label || '';
      formContent = action?.renderForm?.(close);
    } else {
      const action = recordActions.find((a) => a.name === form.action);
      const record = records.find((r) => recordKey(r) === form.key);
      if (action && record) {
        formTitle = action.title ? action.title(record) : action.label;
        formContent = action.renderForm?.(record, close);
      }
    }
  }
  const formPanel = form !== null && (
    <aside className="rt-record rt-record-wide" aria-label={formTitle}>
      <div className="rt-record-head">
        <h3 className="rt-record-title">{formTitle}</h3>
        <Button
          display="quiet"
          title={t('Close')}
          onClick={() => setForm(null)}
        >
          <Icon name="close" />
        </Button>
      </div>
      <div className="rt-record-form">{formContent}</div>
    </aside>
  );
  const panel = formPanel || recordDrawer;

  const progressBar = (props.progress !== undefined
    && props.progress < 100) && (
    <div
      className="rt-progress"
      role="progressbar"
      aria-valuenow={Math.round(props.progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={t('Loading…')}
    >
      <span style={{transform: `scaleX(${props.progress / 100})`}} />
    </div>
  );

  if (props.variant === 'compact') {
    return (
      <div className="rt rt-compact" data-testid={`${name}-table`}>
        <div className="rt-main">
          {progressBar}
          <div className="rt-content">
            {layout === 'table' ? tableLayout : cardLayout}
            {panel}
          </div>
          {lastPage > 1 && footer}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className={'rt-page' + (props.fill ? ' rt-fill' : '')}
      data-testid={`${name}-table`}
    >
      <section className="rt" aria-label={title}>
        {drawer}
        {rail}
        <div className="rt-main">
          {toolbar}
          {progressBar}
          {selectionBar}
          <div className="rt-content">
            {visibleColumns.length === 0 ? (
              <div className="rt-empty">
                <p>{t('Every column is hidden.')}</p>
                <Button display="secondary" onClick={() => setHidden([])}>
                  <Icon name="columns" /> {t('Show all columns')}
                </Button>
              </div>
            ) : layout === 'table' ? tableLayout : cardLayout}
            {panel}
          </div>
          {footer}
        </div>
      </section>
    </div>
  );
}

export default RecordTable;
