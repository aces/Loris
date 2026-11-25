import React from 'react';
import {
  ArrowUp, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ChevronsLeft,
  Columns3, Download, EllipsisVertical, Funnel, Layers, LayoutGrid, Plus,
  Save, Search, Table, X,
} from 'lucide-react';
import './Icon.css';

const glyphs = {
  add: Plus,
  cards: LayoutGrid,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronUp: ChevronUp,
  close: X,
  collapse: ChevronsLeft,
  columns: Columns3,
  download: Download,
  expand: ChevronDown,
  filter: Funnel,
  group: Layers,
  actions: EllipsisVertical,
  save: Save,
  search: Search,
  sort: ArrowUp,
  table: Table,
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
