import React, {useState, useRef, useEffect} from 'react';
import './Select.css';

type OptionGroup = {
    label: string,
    options: string[],
};

/**
 * A multiple selection rendered as a dropdown holding a searchable list of
 * checkboxes, with buttons to select or clear the list.
 *
 * The trigger names the first few selected values and counts the rest, so a
 * large set of options stays readable when most of it is selected. The panel
 * is absolutely positioned and does not displace the content below it.
 *
 * Rows can be marked by clicking one and shift clicking another, which marks
 * the run between them without changing what is selected. While a run is
 * marked the buttons act on it rather than on the whole list.
 *
 * This is the unwrapped control, with no label or form row around it, so it
 * can be placed anywhere. SelectElement renders it inside the usual form
 * layout when its multiple prop is set.
 *
 * Options may be split into groups to bring the most relevant values to the
 * top. Grouping changes the order they are shown in, never which ones are
 * available or selected.
 *
 * @param {object} props - React props
 * @param {object} props.options - Selectable values, keyed by value
 * @param {string[]} props.value - The currently selected values
 * @param {function} props.onChange - Callback given the new list of values
 * @param {OptionGroup[]|undefined} props.groups - Optional ordered groups. Any
 *                                                 option not named by a group
 *                                                 is listed after them.
 * @param {string[]|undefined} props.disabledOptions - Values that cannot be changed
 * @param {string|undefined} props.label - Names the control. It sits where the
 *                                          value would be while nothing is
 *                                          selected, and rises onto the top
 *                                          edge once something is, so the
 *                                          control still says what it is once
 *                                          it holds a value.
 * @param {string|undefined} props.placeholder - Shown when nothing is selected.
 *                                                Empty by default, matching an
 *                                                unset selector elsewhere.
 * @param {string|undefined} props.display - How the selection is shown on the
 *                                           trigger. "names" (the default)
 *                                           lists them as text, "tags" gives
 *                                           each one its own tag, and "count"
 *                                           only ever says how many.
 * @param {number|undefined} props.maxVisible - How many selected values to name
 *                                              before counting the rest.
 *                                              Defaults to 5.
 * @param {React.ReactNode|undefined} props.badge - Rendered in a fixed place at
 *                                                  the right of the trigger, for
 *                                                  state that stays relevant
 *                                                  while the panel is closed
 * @param {React.ReactNode|undefined} props.footer - Rendered at the foot of the
 *                                                   open panel, for controls
 *                                                   belonging with the selection
 * @param {string|undefined} props.searchPlaceholder - Placeholder for the search box
 * @param {string|undefined} props.selectLabel - Label for the select button
 * @param {string|undefined} props.deselectLabel - Label for the deselect button
 * @param {string|undefined} props.emptyMessage - Shown when the search matches nothing
 * @param {boolean|undefined} props.disabled - Disables the trigger
 * @param {boolean|undefined} props.multiple - Whether more than one option can
 *                                              be held at once. Defaults to
 *                                              true. A single selection uses
 *                                              radios and closes on choosing.
 * @param {boolean|undefined} props.mono - Set when the options are identifiers
 *                                          rather than prose, so they are set
 *                                          in the monospace and their
 *                                          characters stay apart.
 * @param {string|undefined} props.name - Name given to the checkbox inputs
 * @returns {React.ReactElement} - The dropdown
 */
function Select(props: {
    options: {[value: string]: string},
    value: string[],
    onChange: (values: string[]) => void,
    groups?: OptionGroup[],
    disabledOptions?: string[],
    label?: string,
    placeholder?: string,
    display?: 'names' | 'tags' | 'count',
    maxVisible?: number,
    badge?: React.ReactNode,
    footer?: React.ReactNode,
    searchPlaceholder?: string,
    selectLabel?: string,
    deselectLabel?: string,
    emptyMessage?: string,
    disabled?: boolean,
    multiple?: boolean,
    mono?: boolean,
    name?: string,
}): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('');
  const [marked, setMarked] = useState<string[]>([]);
  const anchor = useRef<string|null>(null);
  const dragging = useRef<boolean>(false);
  const dragged = useRef<boolean>(false);
  const list = useRef<HTMLDivElement>(null);
  const pointerY = useRef<number>(0);
  const autoScroll = useRef<number|null>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    /**
     * Close the panel when a click lands outside of it
     *
     * @param {MouseEvent} e - The click
     * @returns {void}
     */
    const onDocumentClick = (e: MouseEvent) => {
      if (wrapper.current && !wrapper.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    /**
     * Close the panel on escape
     *
     * @param {KeyboardEvent} e - The keypress
     * @returns {void}
     */
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    /**
     * Stop marking when the pointer is released
     *
     * @returns {void}
     */
    const onMouseUp = () => {
      dragging.current = false;
      if (autoScroll.current !== null) {
        cancelAnimationFrame(autoScroll.current);
        autoScroll.current = null;
      }
    };
    /**
     * Remember where the pointer is so the list can scroll towards it
     *
     * @param {MouseEvent} e - The movement
     * @returns {void}
     */
    const onMouseMove = (e: MouseEvent) => {
      pointerY.current = e.clientY;
    };
    document.addEventListener('mousedown', onDocumentClick);
    document.addEventListener('keydown', onKey);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mousedown', onDocumentClick);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
      if (autoScroll.current !== null) {
        cancelAnimationFrame(autoScroll.current);
        autoScroll.current = null;
      }
    };
  }, [open]);

  useEffect(() => {
    if (open && search.current) {
      search.current.focus();
    }
    if (!open) {
      setFilter('');
      setMarked([]);
      anchor.current = null;
    }
  }, [open]);

  const all = Object.keys(props.options);
  const selected = new Set(props.value);
  const locked = new Set(props.disabledOptions || []);
  const maxVisible = props.maxVisible === undefined ? 5 : props.maxVisible;
  const multiple = props.multiple !== false;

  /**
   * Apply a new selection, leaving disabled values as they were
   *
   * @param {Set<string>} next - The values that should now be selected
   * @returns {void}
   */
  const commit = (next: Set<string>) => {
    all.forEach((option) => {
      if (!locked.has(option)) {
        return;
      }
      if (selected.has(option)) {
        next.add(option);
      } else {
        next.delete(option);
      }
    });
    props.onChange(all.filter((option) => next.has(option)));
  };

  /**
   * Test an option against the search box
   *
   * @param {string} option - The option to test
   * @returns {boolean} - true if it should be listed
   */
  const matches = (option: string) => {
    const needle = filter.toLowerCase();
    return (props.options[option] || option).toLowerCase().includes(needle)
        || option.toLowerCase().includes(needle);
  };

  const grouped: OptionGroup[] = [];
  if (props.groups) {
    const claimed = new Set<string>();
    props.groups.forEach((group) => {
      group.options.forEach((el) => claimed.add(el));
      const options = group.options.filter(matches);
      if (options.length > 0) {
        grouped.push({label: group.label, options: options});
      }
    });
    const rest = all.filter((el) => !claimed.has(el) && matches(el));
    if (rest.length > 0) {
      grouped.push({label: '', options: rest});
    }
  } else {
    const shown = all.filter(matches);
    if (shown.length > 0) {
      grouped.push({label: '', options: shown});
    }
  }

  // The options in the order they appear on screen, so a marked run follows
  // what the user sees rather than the order the options were given in.
  const listed: string[] = [];
  grouped.forEach((group) => listed.push(...group.options));

  /**
   * Mark every row between the anchor and the given one
   *
   * @param {string} option - The row the run ends on
   * @returns {void}
   */
  const markRunTo = (option: string) => {
    if (anchor.current === null) {
      return;
    }
    const from = listed.indexOf(anchor.current);
    const to = listed.indexOf(option);
    if (from === -1 || to === -1) {
      return;
    }
    const run = listed.slice(Math.min(from, to), Math.max(from, to) + 1);
    setMarked(run.filter((el) => !locked.has(el)));
  };

  /**
   * Handle a click on a row. Shift marks a run and ctrl or command marks the
   * single row, both without changing what is selected, so a run can be set up
   * before deciding what to do with it. A plain click toggles as usual.
   *
   * @param {string} option - The row that was clicked
   * @param {React.MouseEvent} e - The click
   * @returns {void}
   */
  const onRowClick = (option: string, e: React.MouseEvent) => {
    if (locked.has(option) || !multiple) {
      return;
    }
    if (dragged.current) {
      // The click that ends a drag should not also toggle the last row.
      e.preventDefault();
      dragged.current = false;
      return;
    }
    if (e.shiftKey && anchor.current !== null) {
      e.preventDefault();
      markRunTo(option);
      return;
    }
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      anchor.current = option;
      setMarked((prev) => prev.includes(option) ?
        prev.filter((el) => el !== option) :
        [...prev, option]);
      return;
    }
    anchor.current = option;
    if (marked.length > 0) {
      setMarked([]);
    }
  };

  /**
   * Scroll the list while a drag is held near its top or bottom edge, so a run
   * can continue past what is currently visible.
   *
   * @returns {void}
   */
  const scrollTowardsPointer = () => {
    if (!dragging.current || list.current === null) {
      autoScroll.current = null;
      return;
    }
    const box = list.current.getBoundingClientRect();
    const zone = 24;
    const speed = 12;
    if (pointerY.current > box.bottom - zone) {
      list.current.scrollTop += speed;
    } else if (pointerY.current < box.top + zone) {
      list.current.scrollTop -= speed;
    }
    autoScroll.current = requestAnimationFrame(scrollTowardsPointer);
  };

  /**
   * Begin marking a run by dragging down the list
   *
   * @param {string} option - The row the drag started on
   * @param {React.MouseEvent} e - The mousedown
   * @returns {void}
   */
  const onRowMouseDown = (option: string, e: React.MouseEvent) => {
    if (locked.has(option) || !multiple
        || e.shiftKey || e.ctrlKey || e.metaKey
    ) {
      return;
    }
    dragging.current = true;
    dragged.current = false;
    anchor.current = option;
    pointerY.current = e.clientY;
    if (autoScroll.current === null) {
      autoScroll.current = requestAnimationFrame(scrollTowardsPointer);
    }
  };

  /**
   * Extend the run while the pointer is held down
   *
   * @param {string} option - The row the pointer moved onto
   * @returns {void}
   */
  const onRowMouseEnter = (option: string) => {
    if (!dragging.current || locked.has(option)) {
      return;
    }
    if (option !== anchor.current) {
      dragged.current = true;
    }
    markRunTo(option);
  };

  /**
   * Add or remove a single value from the selection
   *
   * @param {string} option - The value that was clicked
   * @returns {void}
   */
  const toggle = (option: string) => {
    if (!multiple) {
      props.onChange([option]);
      setOpen(false);
      return;
    }
    const next = new Set(selected);
    if (next.has(option)) {
      next.delete(option);
    } else {
      next.add(option);
    }
    commit(next);
  };

  /**
   * Select the marked run, or everything when nothing is marked
   *
   * @returns {void}
   */
  const selectTarget = () => {
    const next = new Set(selected);
    (marked.length > 0 ? marked : all).forEach((el) => next.add(el));
    commit(next);
    setMarked([]);
  };

  /**
   * Deselect the marked run, or everything when nothing is marked
   *
   * @returns {void}
   */
  const deselectTarget = () => {
    const next = new Set(selected);
    (marked.length > 0 ? marked : all).forEach((el) => next.delete(el));
    commit(next);
    setMarked([]);
  };

  /**
   * Render what the trigger shows for the current selection
   *
   * @returns {React.ReactElement} - The trigger contents
   */
  const renderSelection = () => {
    if (selected.size === 0) {
      return <span className="loris-select-placeholder">
        {props.label ? '' : (props.placeholder || '')}
      </span>;
    }
    if (multiple && selected.size === all.length) {
      return <span className="loris-select-count">
        {'All (' + all.length + ')'}
      </span>;
    }
    if (props.display === 'count') {
      return <span className="loris-select-count">
        {selected.size + ' of ' + all.length}
      </span>;
    }
    const shown = props.value.slice(0, maxVisible);
    const hidden = selected.size - shown.length;
    const names = shown.map((option) => props.options[option] || option);
    if (props.display === 'tags') {
      return <span className="loris-select-tags">
        {shown.map((option, i) => (
          <span key={option} className="loris-select-tag">{names[i]}</span>
        ))}
        {hidden > 0 ?
          <span className="loris-select-tag muted">
            {'+' + hidden + ' more'}
          </span> : null}
      </span>;
    }
    return <span className="loris-select-names">
      {names.join(', ')}
      {hidden > 0 ?
        <span className="loris-select-count">{' +' + hidden + ' more'}</span> :
        null}
    </span>;
  };

  /**
   * Render a single checkbox row
   *
   * @param {string} option - The option to render
   * @returns {React.ReactElement} - The row
   */
  const optionRow = (option: string) => {
    let className = 'loris-select-option';
    if (locked.has(option)) {
      className += ' disabled';
    }
    if (marked.includes(option)) {
      className += ' marked';
    }
    if (!multiple && selected.has(option)) {
      className += ' chosen';
    }
    return (
      <label key={option}
        className={className}
        onMouseDown={(e) => onRowMouseDown(option, e)}
        onMouseEnter={() => onRowMouseEnter(option)}
        onClick={(e) => onRowClick(option, e)}>
        <input type={multiple ? 'checkbox' : 'radio'}
          name={props.name}
          value={option}
          disabled={locked.has(option)}
          checked={selected.has(option)}
          onChange={() => toggle(option)} />
        {props.options[option]}
      </label>
    );
  };

  // While a run is marked these two buttons are the only things on screen that
  // will consume it, so they take the run's own colour and read as part of it
  // rather than as controls that happen to sit above it.
  const aimed = marked.length > 0 ? ' targeted' : '';
  const selectText = marked.length > 0 ?
    'Select ' + marked.length :
    (props.selectLabel || 'Select all');
  const deselectText = marked.length > 0 ?
    'Deselect ' + marked.length :
    (props.deselectLabel || 'Deselect all');

  let panel = null;
  if (open) {
    panel = <div className="loris-select-panel">
      <div className="loris-select-controls">
        <input ref={search}
          className="loris-select-search"
          type="text"
          placeholder={props.searchPlaceholder || 'Search'}
          value={filter}
          onChange={(e) => setFilter(e.target.value)} />
        {multiple ? <>
          <button type="button"
            className={'loris-button secondary' + aimed}
            onClick={selectTarget}>
            {selectText}
          </button>
          <button type="button"
            className={'loris-button secondary' + aimed}
            onClick={deselectTarget}>
            {deselectText}
          </button>
        </> : null}
      </div>
      <div className="loris-select-list" ref={list}>
        {grouped.length === 0 ?
          <div className="loris-select-empty">
            {props.emptyMessage || 'No options'}
          </div> :
          grouped.map((group) => (
            <div key={group.label}>
              {group.label === '' ? null :
                <div className="loris-select-group">{group.label}</div>}
              {group.options.map(optionRow)}
            </div>
          ))}
      </div>
      {multiple ? <div className="loris-select-counts">
        <span>{selected.size} selected</span>
        <span>{all.length} available</span>
      </div> : null}
      {props.footer ?
        <div className="loris-select-footer">{props.footer}</div> : null}
    </div>;
  }

  return (
    <div ref={wrapper}
      className={'loris-select'
        + (props.mono ? ' mono' : '')
        + (open ? ' open' : '')}>
      {props.label ?
        <fieldset className="loris-select-outline" aria-hidden="true">
          <legend className={selected.size > 0 || open ? '' : 'closed'}>
            <span>{props.label}</span>
          </legend>
        </fieldset> :
        null}
      <button type="button"
        className="loris-select-trigger"
        disabled={props.disabled}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}>
        {props.label ?
          <span className={'loris-select-label'
            + (selected.size > 0 || open ? ' raised' : '')}>
            {props.label}
          </span> :
          null}
        <span className="loris-select-value">
          {renderSelection()}
        </span>
        <span className="loris-select-indicators">
          {props.badge}
          <span className="caret" />
        </span>
      </button>
      {panel}
    </div>
  );
}

export default Select;
