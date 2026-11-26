import React from 'react';
import {
  ArrowUp, ArrowUpRight, Brain, Check, ChevronDown, ChevronLeft, ChevronRight,
  ChevronUp, ChevronsLeft, CircleHelp, Columns3, Download,
  EllipsisVertical,
  Funnel, Layers, LayoutGrid, MapPin, Plus, Save, Search, Table,
  UserPlus, Users, X,
} from 'lucide-react';
import './Icon.css';

const glyphs = {
  add: Plus,
  addPerson: UserPlus,
  cards: LayoutGrid,
  check: Check,
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
  help: CircleHelp,
  open: ArrowUpRight,
  study: Brain,
  people: Users,
  place: MapPin,
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
