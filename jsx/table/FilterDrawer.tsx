import React, {ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import Button from 'jsx/Button';
import Select from 'jsx/Select';
import Textbox from 'jsx/Textbox';
import DateRange from 'jsx/DateRange';
import Toggle from 'jsx/Toggle';
import {Icon} from './icons';
import type {Column, ColumnFilter} from './RecordTable';
import type {TableState} from './useTableState';

/**
 * The filters beside a table: a drawer with one control per filterable
 * column, folding to a rail at the window's edge.
 *
 * @param {object} props - React props
 * @param {string} props.name - the table's name
 * @param {Column[]} props.columns - the table's columns
 * @param {TableState} props.state - the table's state
 * @param {boolean} props.open - whether the drawer is open
 * @param {Function} props.onOpenChange - called with the drawer's new state
 * @return {ReactNode}
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

  if (filterColumns.length === 0) {
    return null;
  }
  if (!open) {
    return (
      <aside className="rt-rail" aria-label={t('Filters')}>
        <button
          type="button"
          className="rt-rail-button"
          aria-expanded={false}
          title={t('Show filters')}
          aria-label={t('Show filters')}
          onClick={() => props.onOpenChange(true)}
        >
          <Icon name="filter" />
          {activeCount > 0 && <span className="rt-badge">{activeCount}</span>}
        </button>
      </aside>
    );
  }
  return (
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
        <Button display="quiet" onClick={() => props.onOpenChange(false)}>
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
}

export default FilterDrawer;
