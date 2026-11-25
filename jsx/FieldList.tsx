import React, {ReactNode} from 'react';
import './FieldList.css';

export type Field = {
  // A key unique within the list.
  name: string,
  label: ReactNode,
  value: ReactNode,
};

/**
 * Whether a value has nothing to show. Zero is a value.
 *
 * @param value - the value
 * @returns - true when it is empty
 */
function isEmpty(value: ReactNode): boolean {
  return value === null || value === undefined || value === false
    || value === '' || (Array.isArray(value) && value.length === 0);
}

export type FieldLayout = 'inline' | 'inline-end' | 'stacked' | 'grid';

/**
 * Label and value pairs. An empty value shows a dash.
 *
 * Layouts:
 * - "inline": one pair per row, labels in one column and values in the
 *   next. The label column fits the longest label, up to 40% of the width;
 *   set `--field-list-label-width` on an ancestor to give it a fixed width,
 *   so that several lists side by side line up.
 * - "inline-end": as "inline", with the labels aligned against the values.
 * - "stacked": one pair per row, the label above its value.
 * - "grid": label-above-value pairs in as many columns as fit.
 *
 * @param props - React props
 * @param props.fields - the pairs, in order
 * @param props.layout - how pairs are laid out, "inline" by default
 * @param props.size - "sm" for smaller text and tighter rows, as on a card
 * @returns - The list
 */
function FieldList(props: {
  fields: Field[],
  layout?: FieldLayout,
  size?: 'md' | 'sm',
}) {
  return (
    <dl
      className={'loris-field-list'
        + ' loris-field-list-' + (props.layout || 'inline')
        + ' loris-field-list-' + (props.size || 'md')}
    >
      {props.fields.map((field) => (
        <div key={field.name} className="loris-field">
          <dt>{field.label}</dt>
          <dd>
            {isEmpty(field.value)
              ? <span className="loris-field-empty">—</span>
              : field.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default FieldList;
