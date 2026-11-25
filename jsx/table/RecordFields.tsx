import React, {ReactNode} from 'react';
import FieldList from 'jsx/FieldList';
import type {Column} from './RecordTable';
import './RecordFields.css';

/**
 * A record's fields for the record panel, each label above its value, as in
 * a form
 *
 * @param props - React props
 * @param props.record - the record
 * @param props.columns - the columns shown, hidden ones included
 * @param props.cell - renders a column's value for the record
 */
function RecordFields<R>(props: {
  record: R,
  columns: Column<R>[],
  cell: (column: Column<R>, record: R) => ReactNode,
}) {
  const {record, cell} = props;
  return (
    <div className="rt-record-fields">
      <FieldList
        layout="stacked"
        fields={props.columns.map((column) => ({
          name: column.name,
          label: column.label,
          value: cell(column, record),
        }))}
      />
    </div>
  );
}

export default RecordFields;
