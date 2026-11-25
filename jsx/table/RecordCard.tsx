import React, {ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import FieldList from 'jsx/FieldList';
import type {Column} from './RecordTable';
import './RecordCard.css';

/**
 * One record as a card: its first column as the title, the rest as fields.
 * Clicking the card, or Enter while it has focus, opens the record.
 *
 * @param props - React props
 * @param props.record - the record
 * @param props.columns - the visible columns, the first being the title
 * @param props.cell - renders a column's value for the record
 * @param props.selectable - whether the card has a checkbox
 * @param props.selected - whether the record is selected
 * @param props.onToggle - selects or unselects the record
 * @param props.open - whether the record is open in the record panel
 * @param props.onOpen - opens the record in the record panel
 */
function RecordCard<R>(props: {
  record: R,
  columns: Column<R>[],
  cell: (column: Column<R>, record: R) => ReactNode,
  selectable: boolean,
  selected: boolean,
  onToggle: () => void,
  open?: boolean,
  onOpen?: () => void,
}) {
  const {t} = useTranslation(['loris']);
  const {record, cell, onOpen} = props;
  const [titleColumn, ...detailColumns] = props.columns;
  return (
    <div
      className={'rt-card'
        + (props.selected ? ' rt-selected' : '')
        + (props.open ? ' rt-open' : '')
        + (onOpen ? ' rt-card-openable' : '')}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen && ((e) => {
        if (!(e.target as HTMLElement)
          .closest('a, button, input, label, select')) {
          onOpen();
        }
      })}
      onKeyDown={onOpen && ((e) => {
        if (e.key === 'Enter' && e.target === e.currentTarget) {
          onOpen();
        }
      })}
    >
      <div className="rt-card-head">
        {props.selectable && (
          <label className="rt-card-check">
            <input
              type="checkbox"
              aria-label={t('Select row')}
              checked={props.selected}
              onChange={props.onToggle}
            />
          </label>
        )}
        <div className="rt-card-title">
          {titleColumn && cell(titleColumn, record)}
        </div>
      </div>
      <FieldList
        size="sm"
        fields={detailColumns.map((column) => ({
          name: column.name,
          label: column.label,
          value: cell(column, record),
        }))}
      />
    </div>
  );
}

export default RecordCard;
