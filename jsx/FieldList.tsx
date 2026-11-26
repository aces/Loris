import React, {ReactNode} from 'react';
import Icon from 'jsx/Icon';
import './FieldList.css';

export type Field = {
  // A key unique within the list.
  name: string,
  label: ReactNode,
  value: ReactNode,
  // In the grid layout, the pair takes the list's full width.
  wide?: boolean,
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
        <div
          key={field.name}
          className={'loris-field' + (field.wide ? ' loris-field-wide' : '')}
        >
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

export type FieldSection = {
  // A key unique among the sections.
  name: string,
  // The section's heading. A section without one has no heading and cannot
  // be folded.
  label?: ReactNode,
  fields: Field[],
  // Whether the section starts folded.
  collapsed?: boolean,
};

/**
 * Field lists in sections, each under a heading that folds it away. A folded
 * section stays folded from one record to the next.
 *
 * @param props - React props
 * @param props.sections - the sections, in order
 * @param props.layout - how each section's pairs are laid out
 * @param props.size - "sm" for smaller text and tighter rows
 * @returns - The sections
 */
export function FieldSections(props: {
  sections: FieldSection[],
  layout?: FieldLayout,
  size?: 'md' | 'sm',
}) {
  return (
    <div className="loris-field-sections">
      {props.sections.map((section) => {
        const list = (
          <FieldList
            fields={section.fields}
            layout={props.layout}
            size={props.size}
          />
        );
        if (section.label === undefined) {
          return <div key={section.name}>{list}</div>;
        }
        return (
          <details
            key={section.name}
            className="loris-field-section"
            open={!section.collapsed}
          >
            <summary>
              <Icon name="chevronRight" />
              <h4>{section.label}</h4>
            </summary>
            {list}
          </details>
        );
      })}
    </div>
  );
}

export default FieldList;
