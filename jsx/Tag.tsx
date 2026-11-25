import React from 'react';
import './Tag.css';

export type TagTone =
  | 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'danger';

/**
 * A short label for a value from a fixed set, such as a status or a category,
 * drawn in one of the design system's colours. Colour never carries the
 * meaning alone: the label says it.
 *
 * @param props - React props
 * @param props.children - the label
 * @param props.tone - the colour, "neutral" by default
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
