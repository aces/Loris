import React, {
  useState, useRef, useEffect, useLayoutEffect, useCallback, ReactNode,
} from 'react';
import {useTranslation} from 'react-i18next';
import Button from 'jsx/Button';
import {Icon} from './icons';
import {Filters} from './filterMatch';
import {displayOf} from './tableState';
import {useTableState} from './useTableState';
import FilterDrawer from './FilterDrawer';
import TableToolbar from './TableToolbar';
import SidePanel from './SidePanel';
import {useDismiss} from './useDismiss';
import TableFooter from './TableFooter';
import './RecordTable.css';

export type ColumnType = 'text' | 'number' | 'date';

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
};

/**
 * Checks a column's display and format against the type its value returns,
 * and lets columns of different value types share one array.
 *
 * @param {Column} column - the column
 * @return {Column}
 */
export function col<R, V>(column: Column<R, V>): Column<R, unknown> {
  return column;
}

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

  const [drawerOpen, setDrawerOpen] = useState(true);

  const dragged = useRef<string>('');
  const [dropTarget, setDropTarget] = useState('');

  const [menu, setMenu] = useState<string | null>(null);
  const [form, setForm] = useState<
    {action: string, key?: string | number} | null
  >(null);
  const [openKey, setOpenKey] = useState<string | number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
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
    sorted,
    groups,
    groupOf,
    pageable,
    setPage,
    size,
    lastPage,
    pageRecords,
    selected,
    setSelected,
    selectedRecords,
    toggleRecord,
    pageKeys,
    pageSelected,
    pagePartly,
    togglePage,
    downloadCSV,
  } = state;

  const toolbar = (
    <TableToolbar
      title={title}
      sections={props.sections}
      section={props.section}
      onSectionChange={props.onSectionChange}
      controls={props.controls}
      columns={columns}
      csv={csv !== false}
      actions={actions.filter((a) => a.show !== false)}
      onAction={(action) => setForm({action})}
      state={state}
    />
  );

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

  const footer = (
    <TableFooter
      state={state}
      total={records.length}
      pageSizes={pageSizes}
    />
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
      if (target.closest?.('input, textarea, select, [role=dialog]')) {
        return;
      }
      if (e.key === 'Escape') {
        setOpenKey(null);
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

  const recordDrawer = openRecord !== null && (
    <SidePanel
      label={t('Record')}
      title={visibleColumns[0] && cellContent(visibleColumns[0], openRecord)}
      onClose={() => setOpenKey(null)}
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
          disabled={openIndex >= pageable.length - 1}
          onClick={() => stepRecord(1)}
        >
          <Icon name="chevronDown" />
        </Button>
      </>}
    >
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
    </SidePanel>
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
    <SidePanel
      label={formTitle}
      title={formTitle}
      wide
      onClose={() => setForm(null)}
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
