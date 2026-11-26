import React, {useState, useRef, useEffect, ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import Button from 'jsx/Button';
import Select from 'jsx/Select';
import Textbox from 'jsx/Textbox';
import {Icon} from './icons';
import ViewTabs from './ViewTabs';
import Tooltip from 'jsx/Tooltip';
import type {Column, Layout, TableAction} from './RecordTable';
import type {TableState} from './useTableState';

/**
 * The menu that shows, hides and finds the table's columns
 *
 * @param props - React props
 * @param props.state - the table's state
 * @param props.iconOnly - shows the icon alone
 */
export function ColumnsMenu<R>(props: {
  state: TableState<R>,
  iconOnly?: boolean,
}) {
  const {t} = useTranslation(['loris']);
  const {orderedColumns, visibleColumns, setHidden, lead} = props.state;
  // The record's identifier is always shown, so it isn't listed.
  const listed = orderedColumns.filter((c) => c.name !== lead);
  const options: {[name: string]: string} = {};
  listed.forEach((c) => options[c.name] = c.label);
  return (
    <Select
      appearance="button"
      icon={<Icon name="columns" />}
      iconOnly={props.iconOnly}
      label={t('Columns')}
      options={options}
      value={visibleColumns.map((c) => c.name).filter((n) => n !== lead)}
      display="label"
      searchPlaceholder={t('Find a column…')}
      onChange={(values) => setHidden(
        listed.map((c) => c.name).filter((n) => !values.includes(n))
      )}
    />
  );
}

/**
 * The bar above a table: its name and views, search, how the rows are shown
 * and the table's own actions.
 *
 * @param props - React props
 * @param props.title - the table's name
 * @param props.sections - the page's tables, named beside the title to switch
 *                         between
 * @param props.section - the table shown
 * @param props.onSectionChange - called with the table chosen
 * @param props.controls - the module's own controls
 * @param props.columns - the table's columns
 * @param props.actions - the table's own actions
 * @param props.onAction - opens the form of an action that has one
 * @param props.captureFind - whether Ctrl or Cmd and F opens Search
 * @param props.filters - the Filters button, first of the display controls
 * @param props.selection - the selection and what can be done to it, shown
 *                          in place of the controls while rows are selected
 * @param props.state - the table's state
 */
function TableToolbar<R>(props: {
  title: string,
  sections?: {[value: string]: string},
  section?: string,
  onSectionChange?: (section: string) => void,
  controls?: ReactNode,
  columns: Column<R>[],
  actions: TableAction[],
  onAction: (name: string) => void,
  captureFind?: boolean,
  filters?: ReactNode,
  selection?: ReactNode,
  state: TableState<R>,
}) {
  const {t} = useTranslation(['loris']);
  const {title, columns, state} = props;
  const {keyword, setKeyword, layout, setLayout, groupBy, setGroupBy} = state;
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchClosing, setSearchClosing] = useState(false);

  /**
   * Shrinks the empty search field back into its button, then closes it
   */
  const closeSearch = () => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setSearchOpen(false);
    } else {
      setSearchClosing(true);
    }
  };
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen) {
      searchRef.current?.querySelector('input')?.focus();
    }
  }, [searchOpen]);

  // Only drawn rows are on the page, so the browser's find can't reach the
  // rest. Find goes to Search first; pressed again there, it reaches the
  // browser. While a selection holds the toolbar, Find is the browser's.
  const selecting = !!props.selection;
  useEffect(() => {
    if (!props.captureFind || selecting) {
      return;
    }
    const apple = /Mac|iPhone|iPad/.test(navigator.platform);
    /**
     * Sends Find (Cmd+F on Apple, Ctrl+F elsewhere) to Search, unless
     * Search has focus
     *
     * @param e - the key pressed
     */
    const onKey = (e: KeyboardEvent) => {
      if (!(apple ? e.metaKey : e.ctrlKey) || e.altKey || e.shiftKey
        || e.key.toLowerCase() !== 'f') {
        return;
      }
      const input = searchRef.current?.querySelector('input');
      if (input && document.activeElement === input) {
        return;
      }
      e.preventDefault();
      if (input) {
        input.focus();
      } else {
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [props.captureFind, selecting]);

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

  const layoutOptions = {table: t('Table'), cards: t('Cards')};

  const actionButtons = props.actions.length > 0 && (
    <div className="rt-actions">
      {props.actions.map((action) => (
        <span key={action.name} className={`action-${action.name}`}>
          <Button
            display={action.primary ? 'primary' : 'secondary'}
            onClick={() => action.renderForm
              ? props.onAction(action.name)
              : action.onClick?.()}
          >
            {action.icon && <Icon name={action.icon} />}
            {action.label}
          </Button>
        </span>
      ))}
    </div>
  );

  const sections = props.sections;
  const current = props.section || Object.keys(sections || {})[0];
  return (
    <>
      <div className="rt-titlebar">
        {sections && props.onSectionChange ? (
          <div
            className="rt-sections"
            role="tablist"
            aria-label={t('Tables')}
          >
            {Object.entries(sections).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={value === current}
                className={'rt-section'
                  + (value === current ? ' rt-section-on' : '')}
                onClick={() => props.onSectionChange?.(value)}
              >
                {label}
              </button>
            ))}
          </div>
        ) : (
          <h2 className="rt-title">{title}</h2>
        )}
      </div>
      <div className="rt-toolbar">
        <div className="rt-heading">
          <ViewTabs state={state} />
        </div>
        {props.selection || <>
          {searchOpen || keyword ? (
            <div
              className={'rt-search'
              + (searchClosing ? ' rt-search-closing' : '')}
              ref={searchRef}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setKeyword('');
                  closeSearch();
                }
              }}
              onTransitionEnd={(e) => {
                if (searchClosing && e.propertyName === 'flex-basis') {
                  setSearchClosing(false);
                  setSearchOpen(false);
                }
              }}
            >
              <Textbox
                search
                value={keyword}
                placeholder={t('Search…')}
                clearLabel={t('Clear search')}
                onBlur={() => keyword === '' && closeSearch()}
                onChange={setKeyword}
              />
            </div>
          ) : (
            <span className="rt-search-closed">
              <Tooltip content={t('Search')} placement="bottom">
                <Button
                  display="quiet"
                  aria-label={t('Search')}
                  onClick={() => setSearchOpen(true)}
                >
                  <Icon name="search" />
                  <span className="rt-label" aria-hidden="true">
                    {t('Search')}
                  </span>
                </Button>
              </Tooltip>
            </span>
          )}
          <div
            className="rt-toolbar-group"
            role="group"
            aria-label={t('Display')}
          >
            {props.filters}
            {props.controls}
            <span className="rt-value-menu">
              <Select
                appearance="button"
                icon={<Icon name={layout} />}
                label={t('Layout')}
                multiple={false}
                options={layoutOptions}
                value={[layout]}
                onChange={(values) => setLayout(
                (values[0] || 'table') as Layout
                )}
              />
            </span>
            <span className="rt-value-menu">
              <Select
                appearance="button"
                icon={<Icon name="group" />}
                label={t('Group by')}
                multiple={false}
                options={groupOptions}
                value={[groupBy]}
                onChange={(values) => setGroupBy(values[0] || '')}
              />
            </span>
            <ColumnsMenu state={state} />
          </div>
          {actionButtons && (
            <div
              className="rt-toolbar-group"
              role="group"
              aria-label={t('Actions')}
            >
              {actionButtons}
            </div>
          )}
        </>}
      </div>
    </>
  );
}

export default TableToolbar;
