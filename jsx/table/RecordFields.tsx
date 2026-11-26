import React, {ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import FieldList, {FieldSections, FieldSection} from 'jsx/FieldList';
import type {Column, RecordLayout} from './RecordTable';
import './RecordFields.css';

/**
 * A record's fields for the record panel: its key fields first, in a band
 * of label-above-value pairs, then its sections, one label and value a row.
 * Without a layout, every column after the title shows in column order.
 * Columns a layout leaves out follow in a last section.
 *
 * @param props - React props
 * @param props.record - the record
 * @param props.columns - the columns, in order, hidden ones included
 * @param props.title - the name of the column in the panel's title
 * @param props.layout - the table's record layout
 * @param props.cell - renders a column's value for the record
 */
function RecordFields<R>(props: {
  record: R,
  columns: Column<R>[],
  title?: string,
  layout?: RecordLayout,
  cell: (column: Column<R>, record: R) => ReactNode,
}) {
  const {t} = useTranslation(['loris']);
  const {record, columns, layout, cell} = props;

  const byName = new Map(columns.map((c) => [c.name, c]));
  const placed = new Set([props.title]);
  /**
   * The fields for the named columns, skipping unknown and placed ones
   *
   * @param names - the columns' names
   * @param wide - the names of those that take the full width
   */
  const fieldsOf = (names: string[], wide: string[] = []) => names
    .map((name) => byName.get(name))
    .filter((c): c is Column<R> => !!c && !placed.has(c.name))
    .map((column) => {
      placed.add(column.name);
      return {
        name: column.name,
        label: column.label,
        value: cell(column, record),
        wide: wide.includes(column.name),
      };
    });

  const keyFields = (layout?.key || []).map(
    (k) => typeof k === 'string' ? {name: k, wide: false} : k
  );
  const key = fieldsOf(
    keyFields.map((k) => k.name),
    keyFields.filter((k) => k.wide).map((k) => k.name),
  );
  const sections: FieldSection[] = (layout?.sections || []).map(
    (section, i) => ({
      name: 'section-' + i,
      label: section.label,
      collapsed: section.collapsed,
      fields: fieldsOf(section.fields),
    })
  ).filter((section) => section.fields.length > 0);
  const rest = fieldsOf(columns.map((c) => c.name));
  if (rest.length > 0) {
    sections.push({
      name: 'rest',
      label: layout?.sections ? t('More fields') : undefined,
      collapsed: false,
      fields: rest,
    });
  }

  return (
    <div className="rt-record-fields">
      {key.length > 0 && (
        <div className="rt-record-key">
          <FieldList fields={key} layout="grid" />
        </div>
      )}
      <FieldSections sections={sections} />
    </div>
  );
}

export default RecordFields;
