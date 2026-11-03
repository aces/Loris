import React from 'react';

const classes = {
  add: 'fas fa-plus',
  cards: 'fas fa-th-large',
  chevronDown: 'fas fa-chevron-down',
  chevronLeft: 'fas fa-chevron-left',
  chevronRight: 'fas fa-chevron-right',
  chevronUp: 'fas fa-chevron-up',
  close: 'fas fa-times',
  collapse: 'fas fa-angle-double-left',
  columns: 'fas fa-columns',
  download: 'fas fa-download',
  expand: 'fas fa-chevron-down',
  filter: 'fas fa-filter',
  more: 'fas fa-ellipsis-h',
  group: 'fas fa-layer-group',
  save: 'fas fa-save',
  search: 'fas fa-search',
  sort: 'fas fa-arrow-up',
  table: 'fas fa-table',
};

export type IconName = keyof typeof classes;

/**
 * An icon from the Font Awesome set LORIS ships, hidden from assistive
 * technology since the control beside it carries the label
 *
 * @param {object} props - React props
 * @param {IconName} props.name - which icon
 * @return {JSX.Element}
 */
export function Icon(props: {name: IconName}) {
  return <i className={'rt-icon ' + classes[props.name]} aria-hidden="true" />;
}
