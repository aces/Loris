import React from 'react';
import {
  ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Search, X,
} from 'lucide-react';
import './Icon.css';

const glyphs = {
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  close: X,
  help: CircleHelp,
  search: Search,
};

export type IconName = keyof typeof glyphs;

/**
 * An icon from the Lucide set, sized to the text around it and hidden from
 * assistive technology, since the control it sits in carries the label.
 *
 * @param props - React props
 * @param props.name - which icon
 * @param props.className - more classes for the icon
 * @returns - The icon
 */
function Icon(props: {name: IconName, className?: string}) {
  const Glyph = glyphs[props.name];
  return (
    <Glyph
      className={'loris-icon' + (props.className ? ' ' + props.className : '')}
      aria-hidden="true"
      focusable="false"
    />
  );
}

export default Icon;
