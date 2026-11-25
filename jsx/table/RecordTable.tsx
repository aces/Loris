import React, {
  useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo,
  ReactNode,
} from 'react';
import {useTranslation} from 'react-i18next';
import Button from 'jsx/Button';
import {Icon, IconName} from './icons';
import {Filters} from './filterMatch';
import {displayOf} from './tableState';
import {useTableState, Row} from './useTableState';
import {useRowWindow} from './useRowWindow';
import {useColumnWidths} from './useColumnWidths';
import FilterDrawer, {FiltersButton} from './FilterDrawer';
import TableToolbar from './TableToolbar';
import SidePanel from './SidePanel';
import Tooltip from 'jsx/Tooltip';
import Tag, {TagTone} from 'jsx/Tag';
import {useDismiss} from './useDismiss';
import TableFooter from './TableFooter';
import RecordCard from './RecordCard';
import RecordFields from './RecordFields';
import FitTags from './FitTags';
import './RecordTable.css';

const CARD_BATCH = 60;
const CHECK_WIDTH = 40;

// An id is an identifier: set in the monospace and never cut short.
export type ColumnType = 'text' | 'number' | 'date' | 'id';

export type ColumnFilter = {
  type: 'text' | 'numeric' | 'select' | 'multiselect' | 'date-range'
    | 'date' | 'checkbox',
  options?: {[key: string]: string},
};

export type Column<R, V = unknown> = {
  name: string,
  label: string,
  value(record: R): V,
  display?(value: V, record: R): string,
  format?(value: V, record: R): ReactNode,
  type?: ColumnType,
  filter?: ColumnFilter,
  hidden?: boolean,
  groupable?: boolean,
  sticky?: boolean,
  group?: string,
  // Shows the value as a tag: true for a neutral one, or each value's tone.
  tag?: boolean | {[value: string]: TagTone},
  // The page a value opens, when it has one
  link?(value: V, record: R): string | undefined,
  // Marks values that name other records, with the icon of their kind
  relation?: IconName,
};

/**
 * Checks a column's display and format against the type its value returns,
 * and lets columns of different value types share one array.
 *
 * @param column - the column
 */
export function defineColumn<R, V>(column: Column<R, V>): Column<R, unknown> {
  return column;
}

export type TableAction = {
  name: string,
  label: string,
  onClick?: () => void,
  renderForm?: (close: () => void) => ReactNode,
  title?: string,
  show?: boolean,
  primary?: boolean,
  // Shown before the label
  icon?: IconName,
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

// How the record panel presents a record: the column in its title, the key
// fields shown first, then sections of fields under headings. Columns left
// out follow in a last section, in column order. A key field marked wide
// takes the band's full width, for long values such as names and tag lists.
export type RecordLayout = {
  title?: string,
  key?: (string | {name: string, wide?: boolean})[],
  sections?: {label: string, fields: string[], collapsed?: boolean}[],
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
  recordLayout?: RecordLayout,
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
  emptyMessage?: string,
};

/**
 * A table of records with a header, saved views, a filter bar, sorting on
 * several columns, grouping, a card layout and actions on selected rows.
 *
 * @param props - React props
 */
function RecordTable<R>(props: Props<R>) {
  const {t} = useTranslation(['loris']);
  const {
    name, title, records, columns, recordKey,
    actions = [], rowActions = [],
    csv = {filename: name},
    emptyMessage,
  } = props;

  // On a narrow window the filters start folded away, since they cover the
  // rows there.
  const [drawerOpen, setDrawerOpen] = useState(
    () => !window.matchMedia?.('(max-width: 760px)').matches
  );

  const dragged = useRef<string>('');
  const [dropTarget, setDropTarget] = useState('');

  const [menu, setMenu] = useState<string | null>(null);
  const [form, setForm] = useState<
    {action: string, key?: string | number} | null
  >(null);
  const [openKey, setOpenKey] = useState<string | number | null>(null);

  // A side panel slides out before it closes, then the close goes through.
  const [leaving, setLeaving] = useState(false);
  const afterLeaving = useRef<() => void>(() => undefined);
  const dismissPanel = useCallback((close: () => void) => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      close();
      return;
    }
    afterLeaving.current = close;
    setLeaving(true);
  }, []);
  /**
   *
   */
  const panelLeft = () => {
    setLeaving(false);
    afterLeaving.current();
  };
  const menuRef = useRef<HTMLDivElement>(null);
  // The open record's menu closes when the panel moves to another record or
  // closes.
  useEffect(() => {
    setMenu((open) => open === 'record' ? null : open);
  }, [openKey]);
  const pageRef = useRef<HTMLDivElement>(null);
  const closeMenu = useCallback(() => setMenu(null), []);
  useDismiss(menuRef, menu !== null, closeMenu);

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


  const state = useTableState(props, t);
  const {
    sort,
    sortBy,
    groupBy,
    collapsed,
    setCollapsed,
    layout,
    setHidden,
    orderedColumns,
    visibleColumns,
    moveColumn,
    nudgeColumn,
    filters,
    keyword,
    groups,
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
  } = state;

  // Only the rows in view are drawn: a window over the table's rows, or a
  // batch of cards that grows as the last one comes into view.
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);
  const [bodyEl, setBodyEl] = useState<HTMLTableSectionElement | null>(null);
  const kinds = useMemo(() => rows.map((row) => row.kind), [rows]);
  const view = useRowWindow(scrollEl, bodyEl, kinds);
  const rowIndex = useMemo(() => {
    const map = new Map<string | number, number>();
    rows.forEach((row, i) => row.kind === 'record'
      && map.set(recordKey(row.record), i));
    return map;
  }, [rows, recordKey]);

  // Columns take their width from the rows the filters, search and sort
  // leave, and keep it while those rows scroll.
  const {widths, clipped} = useColumnWidths(
    shown, state.visibleColumns, scrollEl,
    (props.recordActions || []).length > 0 ? state.lead : undefined
  );

  // A shadow and an arrow at the right edge show there are more columns to
  // scroll to.
  const [moreRight, setMoreRight] = useState(false);
  useEffect(() => {
    if (!scrollEl) {
      return;
    }
    /**
     * Checks whether the table runs past the right edge
     */
    const check = () => setMoreRight(
      scrollEl.scrollLeft + scrollEl.clientWidth < scrollEl.scrollWidth - 1
    );
    check();
    scrollEl.addEventListener('scroll', check, {passive: true});
    const observer = new ResizeObserver(check);
    observer.observe(scrollEl);
    const table = scrollEl.querySelector('table');
    if (table) {
      observer.observe(table);
    }
    return () => {
      scrollEl.removeEventListener('scroll', check);
      observer.disconnect();
    };
  }, [scrollEl]);

  const cardsRef = useRef<HTMLDivElement>(null);
  const [cardLimit, setCardLimit] = useState(CARD_BATCH);
  // The record panel covers the cards' right side, so the cards move over to
  // its left (in CSS) and the open card is brought into view.
  useEffect(() => {
    const index = openKey === null ? undefined : rowIndex.get(openKey);
    if (layout === 'cards' && index !== undefined && index >= cardLimit) {
      setCardLimit(index + CARD_BATCH);
      return;
    }
    cardsRef.current?.querySelector('.rt-card.rt-open')
      ?.scrollIntoView({block: 'nearest'});
  }, [openKey, layout, cardLimit]);
  const [cardSentinel, setCardSentinel] = useState<HTMLDivElement | null>(
    null
  );
  useEffect(() => {
    if (!cardSentinel) {
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setCardLimit((n) => n + CARD_BATCH);
      }
    }, {root: props.fill ? cardsRef.current : null, rootMargin: '600px'});
    observer.observe(cardSentinel);
    return () => observer.disconnect();
  }, [cardSentinel, props.fill]);

  // A new filter, search, sort or grouping starts again from the top.
  useEffect(() => {
    scrollEl?.scrollTo({top: 0});
    cardsRef.current?.scrollTo({top: 0});
    setCardLimit(CARD_BATCH);
  }, [filters, keyword, sort, groupBy]);

  const recordActions = props.recordActions || [];
  const hasRecordActions = recordActions.length > 0;

  const shownRowActions = rowActions.filter((a) => a.show !== false);
  const selectable = shownRowActions.length > 0 || !!props.selectable;

  const toolbar = (
    <TableToolbar
      title={title}
      sections={props.sections}
      section={props.section}
      onSectionChange={props.onSectionChange}
      controls={props.controls}
      columns={columns}
      filters={columns.some((c) => c.filter) && (
        <FiltersButton
          state={state}
          open={drawerOpen}
          onToggle={() => setDrawerOpen(!drawerOpen)}
        />
      )}
      actions={actions.filter((a) => a.show !== false)}
      onAction={(action) => setForm({action})}
      captureFind={!!props.fill}
      state={state}
    />
  );


  /**
   * Renders a cell's content
   *
   * @param column - the column
   * @param record - the record
   * @param full - whether to show every value, as the record panel does
   */
  const valueContent = (
    column: Column<R>,
    record: R,
    full = false,
  ): ReactNode => {
    const value = column.value(record);
    if (column.format) {
      return column.format(value, record);
    }
    // In a row, the tags that fit show and a count stands for the rest; the
    // tooltip lists them all. In full, as in the record panel, every one
    // shows and they wrap. An empty value shows nothing. A list without tags
    // shows as text the same way.
    const options = column.filter?.options;
    /**
     * The label of one of the cell's values
     *
     * @param v - the value
     */
    const labelOf = (v: unknown): string => Array.isArray(value)
      ? options?.[String(v)] ?? String(v)
      : displayOf(column, v, record);
    if (column.relation) {
      const names = (Array.isArray(value) ? value : [value])
        .map(labelOf)
        .filter((n) => n !== '');
      if (names.length === 0) {
        return null;
      }
      const icon = column.relation;
      const items = names.map((n) => (
        <span key={n} className="rt-relation">
          <Icon name={icon} />{n}
        </span>
      ));
      if (full) {
        return (
          <span className="rt-tags rt-tags-wrap rt-relations">{items}</span>
        );
      }
      const row = <FitTags className="rt-relations">{items}</FitTags>;
      return names.length < 2 ? row : (
        <Tooltip content={names.join(', ')}>{row}</Tooltip>
      );
    }
    if (Array.isArray(value) && !column.tag && !full && value.length > 0) {
      const items = value.map((v) => (
        <span key={String(v)} className="rt-list-item">{labelOf(v)}</span>
      ));
      const row = <FitTags className="rt-list">{items}</FitTags>;
      return value.length < 2 ? row : (
        <Tooltip content={displayOf(column, value, record)}>{row}</Tooltip>
      );
    }
    if (column.tag) {
      const values = (Array.isArray(value) ? value : [value]).filter(
        (v) => labelOf(v) !== ''
      );
      if (values.length === 0) {
        return null;
      }
      const tones = typeof column.tag === 'object' ? column.tag : {};
      const each = values.map((v) => (
        <Tag key={String(v)} tone={tones[String(v)] || 'neutral'}>
          {labelOf(v)}
        </Tag>
      ));
      const tags = full
        ? <span className="rt-tags rt-tags-wrap">{each}</span>
        : <FitTags>{each}</FitTags>;
      return full || values.length < 2 ? tags : (
        <Tooltip content={displayOf(column, value, record)}>{tags}</Tooltip>
      );
    }
    const text = displayOf(column, value, record);
    // Free text too long for its column shows in full on hover.
    if (clipped.has(column.name) && text) {
      return (
        <Tooltip content={text}>
          <span>{text}</span>
        </Tooltip>
      );
    }
    return text;
  };

  /**
   * A cell's content, which opens the value's page when it has one
   *
   * @param column - the column
   * @param record - the row's record
   * @param full - whether the value shows in full, as in the record panel
   */
  const cellContent = (
    column: Column<R>,
    record: R,
    full = false,
  ): ReactNode => {
    const content = valueContent(column, record, full);
    const href = column.link?.(column.value(record), record);
    if (!href) {
      return content;
    }
    return full ? <a href={href}>{content}</a> : (
      <a className="rt-cell-link" href={href}>
        <span className="rt-cell-text">{content}</span>
        <Icon name="open" />
      </a>
    );
  };

  const drawer = (
    <FilterDrawer
      name={name}
      columns={columns}
      state={state}
      open={drawerOpen}
      onOpenChange={setDrawerOpen}
    />
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

  // A selection takes over the footer's start, as data grids show it: the
  // count, a way to clear it, what can be done to it and its download.
  const selection = selectable && selected.size > 0 ? (
    <div className="rt-selection" role="region" aria-label={t('Selection')}>
      <span className="rt-selected-count">
        {t('{{count}} selected', {count: selected.size})}
      </span>
      <Button display="quiet" onClick={() => setSelected(new Set())}>
        {t('Clear selection')}
      </Button>
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
    </div>
  ) : undefined;

  /**
   * Renders the header of a group
   *
   * @param key - the group's key
   */
  const groupHeader = (key: string): ReactNode => {
    const group = groups.get(key);
    if (!group) {
      return null;
    }
    const isCollapsed = collapsed.has(key);
    return (
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
      </button>
    );
  };


  const detail = props.renderDetail;
  // With every column hidden, an empty column keeps the header row's width.
  const filler = visibleColumns.length === 0;
  const columnCount = visibleColumns.length + (selectable ? 1 : 0)
    + 1 + (filler ? 1 : 0);
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
   * @param record - the record
   */
  const recordActionCell = (record: R): ReactNode => {
    const key = recordKey(record);
    const shown = recordActions.filter((a) => !a.show || a.show(record));
    /**
     * Runs a record action, opening its form when it has one
     *
     * @param action - the action chosen
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
          <Icon name="actions" />
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
  const empty = rows.length === 0;
  // The last column takes any width the table has to spare.
  const tableWidth = visibleColumns.reduce(
    (sum, column) => sum + (widths[column.name] || 0),
    selectable ? CHECK_WIDTH : 0
  );
  const headerRows = hasGroups ? 2 : 1;
  const drawn = rows.slice(view.start, view.end);

  // One drawn row is a tab stop: the last one focused, else the open one,
  // else the first.
  const [focusKey, setFocusKey] = useState<string | number | null>(null);
  const drawnKeys = new Set(drawn.flatMap((row) => row.kind === 'record'
    ? [recordKey(row.record)] : []));
  const tabKey = [focusKey, openKey].find(
    (key) => key !== null && drawnKeys.has(key)
  ) ?? drawnKeys.values().next().value;

  // A record moved to by key is focused once its row is drawn.
  const pendingFocus = useRef<string | number | null>(null);
  useLayoutEffect(() => {
    if (pendingFocus.current === null || !bodyEl) {
      return;
    }
    const row = bodyEl.querySelector<HTMLElement>(
      `tr[data-key="${CSS.escape(String(pendingFocus.current))}"]`
    );
    row?.focus({preventScroll: true});
    pendingFocus.current = null;
  });

  /**
   * Scrolls a record's row into view
   *
   * @param key - the record's key
   */
  const scrollToRecord = (key: string | number) =>
    view.scrollToItem(rowIndex.get(key) ?? -1);

  /**
   * Scrolls a record into view and focuses its row
   *
   * @param key - the record's key
   */
  const focusRecord = (key: string | number) => {
    scrollToRecord(key);
    pendingFocus.current = key;
    setFocusKey(key);
    if (openKey !== null) {
      setOpenKey(key);
    }
  };

  /**
   * Draws a blank row standing in for rows out of view
   *
   * @param height - the height of the rows it stands for
   * @param key - its React key
   */
  const spacer = (height: number, key: string) => height > 0 && (
    <tr key={key} className="rt-spacer" aria-hidden="true">
      <td colSpan={columnCount} style={{height}} />
    </tr>
  );

  /**
   * Renders one of the table's rows
   *
   * @param row - the row
   * @param index - its position among the table's rows
   */
  const tableRow = (row: Row<R>, index: number): ReactNode => {
    const rowIndexAttr = headerRows + index + 1;
    if (row.kind === 'group') {
      return (
        <tr
          key={`group_${row.key}`}
          className="rt-group-row"
          data-row-kind="group"
          aria-rowindex={rowIndexAttr}
        >
          <td colSpan={columnCount}>{groupHeader(row.key)}</td>
        </tr>
      );
    }
    const {record} = row;
    const key = recordKey(record);
    const isSelected = selected.has(key);
    return (
      <tr
        key={key}
        className={(isSelected ? 'rt-selected' : '')
          + (openKey === key ? ' rt-open' : '')}
        data-record
        data-row-kind="record"
        data-key={key}
        aria-rowindex={rowIndexAttr}
        tabIndex={tabKey === key ? 0 : -1}
        onFocus={(e) => e.target === e.currentTarget && setFocusKey(key)}
        onClick={(e) => {
          if ((e.target as HTMLElement)
            .closest('a, button, input, label, select')) {
            return;
          }
          if (openKey === key) {
            dismissPanel(() => setOpenKey(null));
          } else {
            setOpenKey(key);
          }
        }}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) {
            return;
          }
          if (e.key === 'Enter') {
            setOpenKey(key);
          } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const next = shown[row.index + (e.key === 'ArrowDown' ? 1 : -1)];
            if (next) {
              focusRecord(recordKey(next));
            }
          }
        }}
      >
        {selectable && (
          <td className="rt-check-cell">
            <label className="rt-check-hit">
              <input
                type="checkbox"
                aria-label={t('Select row')}
                checked={isSelected}
                onChange={() => toggleRecord(key)}
              />
            </label>
          </td>
        )}
        {visibleColumns.map((column) => (
          <td
            key={column.name}
            className={(column.type === 'number' ? 'rt-number' : '')
              + (column.type === 'id' ? ' rt-mono' : '')
              + (column.sticky ? ' rt-sticky' : '')
              + (column.name === state.lead ? ' rt-lead-cell' : '')}
          >
            {column.name === state.lead && hasRecordActions ? (
              <span className="rt-lead">
                <span className="rt-lead-value">
                  {cellContent(column, record)}
                </span>
                {recordActionCell(record)}
              </span>
            ) : cellContent(column, record)}
          </td>
        ))}
        <td className="rt-edge-cell" aria-hidden="true" />
      </tr>
    );
  };

  const tableLayout = (
    <div
      className={'rt-scroll' + (moreRight ? ' rt-scroll-more' : '')}
      ref={setScrollEl}
    >
      <table
        className="rt-table"
        style={{width: tableWidth}}
        aria-rowcount={empty ? undefined : headerRows + rows.length}
      >
        <colgroup>
          {selectable && <col style={{width: CHECK_WIDTH}} />}
          {visibleColumns.map((column, i) => (
            <col
              key={column.name}
              style={i < visibleColumns.length - 1
                ? {width: widths[column.name]} : undefined}
            />
          ))}
          {filler && <col />}
          <col style={{width: 0}} />
        </colgroup>
        <thead>
          {hasGroups && (
            <tr className="rt-band-row" aria-rowindex={1}>
              {leadCells > 0 && <th colSpan={leadCells} />}
              {groupBands.map((band, i) => (
                <th key={i} colSpan={band.span} className="rt-band">
                  {band.label}
                </th>
              ))}
              <th />
            </tr>
          )}
          <tr
            className={hasGroups ? 'rt-under-band' : undefined}
            aria-rowindex={headerRows}
          >
            {selectable && (
              <th className="rt-check-cell">
                <label className="rt-check-hit">
                  <input
                    type="checkbox"
                    aria-label={t('Select all rows')}
                    checked={allSelected}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = partlySelected;
                      }
                    }}
                    onChange={toggleAll}
                  />
                </label>
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
                  draggable={column.name !== state.lead}
                  onDragStart={(e) => {
                    dragged.current = column.name;
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => {
                    if (column.name === state.lead) {
                      return;
                    }
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
            {filler && <th aria-hidden="true" />}
            <th className="rt-edge-cell" aria-hidden="true" />
          </tr>
        </thead>
        <tbody ref={setBodyEl}>
          {props.loading && records.length === 0 && [0, 1, 2, 3, 4].map((i) => (
            <tr key={'skeleton' + i} className="rt-skeleton" aria-hidden="true">
              <td colSpan={columnCount}><span /></td>
            </tr>
          ))}
          {/* With every column hidden, the header stays, and the note sits
              where an empty table's does. */}
          {visibleColumns.length === 0 ? (
            <tr>
              <td colSpan={columnCount} className="rt-empty">
                <span>
                  {t('Every column is hidden.')}{' '}
                  <Button display="quiet" onClick={() => setHidden([])}>
                    {t('Show all columns')}
                  </Button>
                </span>
              </td>
            </tr>
          ) : <>
            {empty && !(props.loading && records.length === 0) && (
              <tr>
                <td colSpan={columnCount} className="rt-empty">
                  <span>{emptyMessage || t('No records match.')}</span>
                </td>
              </tr>
            )}
            {spacer(view.before, 'before')}
            {drawn.map((row, i) => tableRow(row, view.start + i))}
            {spacer(view.after, 'after')}
          </>}
        </tbody>
      </table>
    </div>
  );

  const cardRows = rows.slice(0, cardLimit);
  const cardLayout = (
    <div className="rt-cards" ref={cardsRef}>
      {empty && (
        <div className="rt-empty">{emptyMessage || t('No records match.')}</div>
      )}
      {cardRows.map((row) => {
        if (row.kind === 'group') {
          return (
            <div key={`group_${row.key}`} className="rt-card-group">
              {groupHeader(row.key)}
            </div>
          );
        }
        const key = recordKey(row.record);
        return (
          <RecordCard
            key={key}
            record={row.record}
            columns={visibleColumns}
            cell={cellContent}
            selectable={selectable}
            selected={selected.has(key)}
            onToggle={() => toggleRecord(key)}
            open={openKey === key}
            onOpen={() => setOpenKey(key)}
          />
        );
      })}
      {cardLimit < rows.length && (
        <div key={cardLimit} ref={setCardSentinel} className="rt-cards-more" />
      )}
    </div>
  );

  // The footer counts the records in view.
  const inView = (layout === 'table'
    ? rows.slice(view.firstShown, view.lastShown + 1)
    : cardRows
  ).flatMap((row) => row.kind === 'record' ? [row.index + 1] : []);

  const footer = (
    <TableFooter
      state={state}
      total={records.length}
      first={inView[0] || 0}
      last={inView[inView.length - 1] || 0}
      onDownload={csv !== false
        ? () => downloadCSV(state.sorted) : undefined}
      start={selection}
    />
  );

  const openRow = openKey === null
    ? undefined : rows[rowIndex.get(openKey) ?? -1];
  const openIndex = openRow?.kind === 'record' ? openRow.index : -1;
  const openRecord = openIndex >= 0 ? shown[openIndex] : null;

  /**
   * Opens the record before or after the open one
   *
   * @param by - -1 for the one before, 1 for the one after
   */
  const stepRecord = (by: number) => {
    const next = shown[openIndex + by];
    if (next) {
      const key = recordKey(next);
      setOpenKey(key);
      scrollToRecord(key);
    }
  };

  useEffect(() => {
    if (openKey === null) {
      return;
    }
    /**
     * Moves between records with the arrow keys and closes with Escape
     *
     * @param e - the key pressed
     */
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest?.(
        'input, textarea, select, [role=dialog], [role=menu]'
      )) {
        return;
      }
      if (e.key === 'Escape') {
        dismissPanel(() => setOpenKey(null));
      } else if (target.closest?.('tr[data-record]')) {
        // A focused row moves between records itself.
        return;
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        stepRecord(e.key === 'ArrowDown' ? 1 : -1);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const recordLayout = props.recordLayout;
  const titleCol = (recordLayout?.title
    && orderedColumns.find((c) => c.name === recordLayout.title))
    || visibleColumns[0];
  const panelActions = openRecord === null ? []
    : recordActions.filter((a) => !a.show || a.show(openRecord));
  /**
   * Runs one of the open record's actions, opening its form when it has one
   *
   * @param action - the action chosen
   */
  const runPanelAction = (action: RecordAction<R>) => {
    setMenu(null);
    if (action.renderForm) {
      setForm({action: action.name, key: openKey as string});
    } else if (openRecord !== null) {
      action.onClick?.(openRecord);
    }
  };
  const [firstAction, ...moreActions] = panelActions;

  const recordDrawer = openRecord !== null && (
    <SidePanel
      label={t('Record')}
      title={titleCol && cellContent(titleCol, openRecord)}
      leaving={leaving}
      onLeft={panelLeft}
      onClose={() => dismissPanel(() => setOpenKey(null))}
      actions={firstAction && <>
        <Button
          display="secondary"
          onClick={() => runPanelAction(firstAction)}
        >
          {firstAction.label}{firstAction.renderForm ? '…' : ''}
        </Button>
        {moreActions.length > 0 && (
          <div
            className="rt-menu-anchor"
            ref={menu === 'record' ? menuRef : undefined}
          >
            <Button
              display="quiet"
              aria-label={t('More actions')}
              aria-expanded={menu === 'record'}
              onClick={() => setMenu(menu === 'record' ? null : 'record')}
            >
              <Icon name="actions" />
            </Button>
            {menu === 'record' && (
              <div className="rt-menu rt-record-menu" role="menu">
                {moreActions.map((action) => (
                  <button
                    key={action.name}
                    type="button"
                    role="menuitem"
                    className="rt-menu-item"
                    onClick={() => runPanelAction(action)}
                  >
                    {action.label}{action.renderForm ? '…' : ''}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </>}
      tools={<>
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
          disabled={openIndex >= shown.length - 1}
          onClick={() => stepRecord(1)}
        >
          <Icon name="chevronDown" />
        </Button>
      </>}
    >
      <RecordFields
        record={openRecord}
        columns={orderedColumns}
        title={titleCol?.name}
        layout={recordLayout}
        cell={(column, record) => cellContent(column, record, true)}
      />
      {detail && <div className="rt-record-detail">{detail(openRecord)}</div>}
      <p className="rt-hint rt-record-keys">
        {t('↑ ↓ to move between records · Esc to close')}
      </p>
    </SidePanel>
  );

  let formContent: ReactNode = null;
  let formTitle = '';
  if (form) {
    /**
     * Closes the form, after it saves or is cancelled
     */
    const close = () => dismissPanel(() => setForm(null));
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
    <SidePanel
      label={formTitle}
      title={formTitle}
      wide
      leaving={leaving}
      onLeft={panelLeft}
      onClose={() => dismissPanel(() => setForm(null))}
    >
      <div className="rt-record-form">{formContent}</div>
    </SidePanel>
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
        {toolbar}
        <div className="rt-body">
          {drawer}
          <div className="rt-main">
            {progressBar}
            <div className="rt-content">
              {layout === 'table' || visibleColumns.length === 0
                ? tableLayout : cardLayout}
              {layout === 'table' && (
                <div
                  className={'rt-more-right'
                  + (moreRight ? ' rt-more-right-on' : '')}
                  aria-hidden="true"
                >
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => scrollEl?.scrollBy({
                      left: scrollEl.clientWidth * 0.6, behavior: 'smooth',
                    })}
                  >
                    <Icon name="chevronRight" />
                  </button>
                </div>
              )}
              {panel}
            </div>
            {footer}
          </div>
        </div>
      </section>
    </div>
  );
}

export default RecordTable;
