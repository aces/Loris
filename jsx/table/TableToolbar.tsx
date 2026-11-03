import React, {useState, useRef, useEffect, ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import Button from 'jsx/Button';
import Select from 'jsx/Select';
import Textbox from 'jsx/Textbox';
import {Icon} from './icons';
import ViewTabs from './ViewTabs';
import type {Column, Layout, TableAction} from './RecordTable';
import type {TableState} from './useTableState';

/**
 * The bar above a table: its name and views, search, how the rows are shown,
 * the CSV download and the table's own actions.
 *
 * @param {object} props - React props
 * @param {string} props.title - the table's name
 * @param {object} props.sections - the module's tables, to switch between
 * @param {string} props.section - the table shown
 * @param {Function} props.onSectionChange - called with the table chosen
 * @param {ReactNode} props.controls - the module's own controls
 * @param {Column[]} props.columns - the table's columns
 * @param {boolean} props.csv - whether the CSV download is offered
 * @param {TableAction[]} props.actions - the table's own actions
 * @param {Function} props.onAction - opens the form of an action that has one
 * @param {TableState} props.state - the table's state
 * @return {JSX.Element}
 */
function TableToolbar<R>(props: {
  title: string,
  sections?: {[value: string]: string},
  section?: string,
  onSectionChange?: (section: string) => void,
  controls?: ReactNode,
  columns: Column<R>[],
  csv: boolean,
  actions: TableAction[],
  onAction: (name: string) => void,
  state: TableState<R>,
}) {
  const {t} = useTranslation(['loris']);
  const {title, columns, csv, state} = props;
  const {
    keyword, setKeyword, setPage, layout, setLayout, groupBy, setGroupBy,
    orderedColumns, visibleColumns, setHidden, sorted, downloadCSV,
  } = state;
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen) {
      searchRef.current?.querySelector('input')?.focus();
    }
  }, [searchOpen]);

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

  const columnOptions: {[name: string]: string} = {};
  orderedColumns.forEach((c) => columnOptions[c.name] = c.label);
  const layoutOptions = {table: t('Table'), cards: t('Cards')};

  const actionButtons = props.actions.length > 0 && (
    <div className="rt-actions">
      {props.actions.map((action) => (
        <span key={action.name} className={`action-${action.name}`}>
          <Button onClick={() => action.renderForm
            ? props.onAction(action.name)
            : action.onClick?.()}>
            {action.renderForm && <Icon name="add" />} {action.label}
          </Button>
        </span>
      ))}
    </div>
  );

  return (
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
        <ViewTabs state={state} />
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
        {csv && (
          <Button display="quiet" onClick={() => downloadCSV(sorted)}>
            <Icon name="download" /> {t('Download CSV')}
          </Button>
        )}
        {actionButtons}
      </div>
    </div>
  );
}

export default TableToolbar;
