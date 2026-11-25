import {useMemo} from 'react';
import {displayOf} from './tableState';
import type {Column} from './RecordTable';

const MIN_WIDTH = 64;
// Free text stops here and ends in an ellipsis. Identifiers, dates and
// numbers are never cut; option values and lists fit up to the larger bound.
const TEXT_WIDTH = 320;
const OPTION_WIDTH = 320;
const LIST_WIDTH = 280;
const SHOWN_TAGS = 3;
// The cell's side padding, and a pixel or two of slack.
const CELL_PADDING = 24;
// The arrow a linked cell shows on hover
const LINK_EXTRA = 20;
// The header's sort icon and its gap.
const HEADER_EXTRA = 44;
// Enough records to find each column's long values without reading them all.
const SAMPLE = 5000;
// How many of a column's longest values are measured.
const CANDIDATES = 3;

/**
 * Gives each visible column a width from the records given, the ones in view,
 * so one long value elsewhere in the table does not widen a column for every
 * row. A column is as wide as its label or its widest value. Identifiers,
 * dates and numbers always show in full; lists, option values and free text
 * stop at a bound, past which the cell shows the rest on hover. Values are measured in a hidden
 * element inside the table, so they take the table's own fonts. The columns
 * whose widest value does not fit are listed as clipped.
 *
 * @param records - the records to fit, those in view
 * @param columns - the visible columns
 * @param container - an element inside the table to measure in
 */
export function useColumnWidths<R>(
  records: R[],
  columns: Column<R>[],
  container: HTMLElement | null,
): {widths: {[name: string]: number}, clipped: Set<string>} {
  const names = columns.map((c) => c.name).join('|');
  return useMemo(() => {
    const widths: {[name: string]: number} = {};
    const clipped = new Set<string>();
    if (!container) {
      return {widths, clipped};
    }
    const probe = document.createElement('span');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:absolute;left:-9999px;top:0;'
      + 'visibility:hidden;white-space:nowrap;';
    container.appendChild(probe);

    /**
     * Measures a piece of content as the table draws it
     *
     * @param build - fills the probe
     */
    const measure = (build: (el: HTMLElement) => void): number => {
      probe.className = '';
      probe.style.fontWeight = '';
      probe.style.fontSize = '';
      probe.replaceChildren();
      build(probe);
      return probe.getBoundingClientRect().width;
    };

    const step = Math.max(1, Math.floor(records.length / SAMPLE));
    columns.forEach((column) => {
      const options = column.filter?.options;
      const exact = column.type === 'id' || column.type === 'date'
        || column.type === 'number';
      const list = !!column.tag || records.some(
        (record) => Array.isArray(column.value(record))
      );
      let limit = TEXT_WIDTH;
      if (exact) {
        limit = Infinity;
      } else if (list) {
        limit = LIST_WIDTH;
      } else if (options) {
        limit = OPTION_WIDTH;
      }
      const longest: {text: string, value: unknown}[] = [];
      for (let i = 0; i < records.length; i += step) {
        const record = records[i];
        const value = column.value(record);
        const text = displayOf(column, value, record);
        if (longest.length < CANDIDATES
          || text.length > longest[longest.length - 1].text.length) {
          if (!longest.some((l) => l.text === text)) {
            longest.push({text, value});
            longest.sort((a, b) => b.text.length - a.text.length);
            longest.length = Math.min(longest.length, CANDIDATES);
          }
        }
      }
      const content = Math.max(0, ...longest.map(({text, value}) => measure(
        (el) => {
          if (column.tag) {
            el.className = 'rt-tags';
            const values = Array.isArray(value) ? value : [value];
            const shown = values.length > SHOWN_TAGS
              ? values.slice(0, SHOWN_TAGS - 1) : values;
            const labels = Array.isArray(value)
              ? shown.map((v) => options?.[String(v)] ?? String(v))
              : [text].filter((label) => label !== '');
            if (shown.length < values.length) {
              labels.push('+' + (values.length - shown.length));
            }
            labels.forEach((label) => {
              const tag = document.createElement('span');
              tag.className = 'loris-tag';
              tag.textContent = label;
              el.appendChild(tag);
            });
          } else {
            el.className = column.type === 'id' ? 'rt-mono' : '';
            el.textContent = text;
          }
        }
      ))) + (column.link ? LINK_EXTRA : 0);
      const header = measure((el) => {
        el.style.fontWeight = '500';
        el.style.fontSize = 'var(--font-size-sm)';
        el.textContent = column.label;
      }) + HEADER_EXTRA;
      widths[column.name] = Math.ceil(Math.min(
        limit, Math.max(MIN_WIDTH, content + CELL_PADDING, header)
      ));
      if (content + CELL_PADDING > limit) {
        clipped.add(column.name);
      }
    });
    probe.remove();
    return {widths, clipped};
  }, [records, names, container]);
}
