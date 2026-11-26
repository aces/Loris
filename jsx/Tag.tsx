import React from 'react';
import './Tag.css';

export type TagRole =
  | 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'danger';
export type TagHue =
  | 'red' | 'orange' | 'brown' | 'yellow' | 'green' | 'teal' | 'blue'
  | 'purple' | 'pink' | 'grey';
export type TagTone = TagRole | TagHue;

/**
 * A short label for a value from a fixed set, such as a status or a category,
 * drawn in one of the design system's colours. Colour never carries the
 * meaning alone: the label says it.
 *
 * @param props - React props
 * @param props.children - the label
 * @param props.tone - a role for a value that is a state, a hue for a
 *                     category; "neutral" by default
 * @param props.title - text for the tag's tooltip
 * @returns - The tag
 */
function Tag(props: {
  children: React.ReactNode,
  tone?: TagTone,
  title?: string,
} & Omit<React.HTMLAttributes<HTMLSpanElement>, 'className'>) {
  const {children, tone = 'neutral', ...rest} = props;
  return (
    <span {...rest} className={'loris-tag loris-tag-' + tone}>
      {children}
    </span>
  );
}

export default Tag;
