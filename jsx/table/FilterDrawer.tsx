import React, {ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import Button from 'jsx/Button';
import Select from 'jsx/Select';
import Textbox from 'jsx/Textbox';
import DateRange from 'jsx/DateRange';
import Toggle from 'jsx/Toggle';
import Tooltip from 'jsx/Tooltip';
import {Icon} from './icons';
import type {Column, ColumnFilter} from './RecordTable';
import type {TableState} from './useTableState';

/**
 * The filters beside a table: a drawer with one control per filterable
 * column, folding to a rail at the window's edge.
 *
 * @param props - React props
 * @param props.name - the table's name
 * @param props.columns - the table's columns
 * @param props.state - the table's state
 * @param props.open - whether the drawer is open
 * @param props.onOpenChange - called with the drawer's new state
 */
function FilterDrawer<R>(props: {
  name: string,
  columns: Column<R>[],
  state: TableState<R>,
  open: boolean,
  onOpenChange: (open: boolean) => void,
}) {
  const {t} = useTranslation(['loris']);
  const {name, columns, open} = props;
  const {filters, setFilter, setFilters, byName} = props.state;

  /**
   * Renders the control that edits a column's filter
   *
   * @param column - the filtered column
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
        display="tags"
        maxVisible={1}
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
        resetLabel={t('Clear')}
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

  if (filterColumns.length === 0) {
    return null;
  }
  // The drawer stays in the page while folded, at no width, so it can grow
  // and shrink rather than appear and vanish.
  return (
    <aside
      className={'rt-drawer' + (open ? ' rt-drawer-open' : '')}
      aria-label={t('Filters')}
      aria-hidden={!open}
      {...(open ? {} : {inert: ''})}
    >
      <div className="rt-drawer-inner">
        <div className="rt-drawer-head">
          <h3 className="rt-drawer-title">
            {t('Filters')}
            {activeCount > 0 && <span className="rt-badge">{activeCount}</span>}
          </h3>
          {activeCount > 0 && (
            <Button display="quiet" onClick={() => setFilters({})}>
              {t('Clear all')}
            </Button>
          )}
          <Tooltip content={t('Hide filters')} placement="bottom">
            <Button
              display="quiet"
              aria-label={t('Hide filters')}
              onClick={() => props.onOpenChange(false)}
            >
              <Icon name="collapse" />
            </Button>
          </Tooltip>
        </div>
        <div className="rt-drawer-fields">
          {filterColumns.map((column) => (
            <div key={column.name} className="rt-drawer-field">
              {filterControl(column)}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

/**
 * The toolbar's Filters button, which shows or folds the filters and counts
 * the ones set
 *
 * @param props - React props
 * @param props.state - the table's state
 * @param props.open - whether the filters are shown
 * @param props.onToggle - shows or folds the filters
 */
export function FiltersButton<R>(props: {
  state: TableState<R>,
  open: boolean,
  onToggle: () => void,
}) {
  const {t} = useTranslation(['loris']);
  const {filters, byName} = props.state;
  const activeCount = Object.keys(filters).filter((k) => byName[k]).length;
  const label = props.open ? t('Hide filters') : t('Show filters');
  return (
    <Tooltip content={label} placement="bottom">
      <Button
        display="quiet"
        aria-label={label}
        aria-expanded={props.open}
        onClick={props.onToggle}
      >
        <Icon name="filter" />
        <span className="rt-label" aria-hidden="true">{t('Filters')}</span>
        {activeCount > 0 && <span className="rt-badge">{activeCount}</span>}
      </Button>
    </Tooltip>
  );
}

export default FilterDrawer;
