import React, {useState, useRef, useEffect} from 'react';
import useFloatingPanel from './useFloatingPanel';
import Icon from './Icon';
import './Select.css';
import './DateRange.css';

type Range = {min?: string, max?: string};

/**
 * Formats a date held as YYYY-MM-DD from its parts
 *
 * @param year - the year
 * @param month - the month, from 0
 * @param day - the day of the month
 */
function isoDate(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, '0')}-` +
    `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * A date typed as YYYY-MM-DD. It is plain text rather than the browser's date
 * input, which would open a second calendar inside the range's own. The range
 * changes once the text is a whole date, or empty.
 *
 * @param props - React props
 * @param props.label - names the field
 * @param props.value - the date, as YYYY-MM-DD
 * @param props.onChange - called with a whole date, or '' when cleared
 * @returns - The field
 */
function DateText(props: {
  label: string,
  value: string,
  onChange: (day: string) => void,
}): React.ReactElement {
  const [text, setText] = useState(props.value);
  useEffect(() => setText(props.value), [props.value]);
  return (
    <label>
      {props.label}
      <input
        type="text"
        inputMode="numeric"
        placeholder="YYYY-MM-DD"
        maxLength={10}
        value={text}
        onChange={(e) => {
          const next = e.target.value;
          setText(next);
          if (next === '' || (/^\d{4}-\d{2}-\d{2}$/.test(next)
            && !Number.isNaN(Date.parse(next + 'T00:00:00Z')))) {
            props.onChange(next);
          }
        }}
      />
    </label>
  );
}

/**
 * A range of dates picked on one calendar: the first click sets the start and
 * the second the end, which closes the calendar. The month and year can be jumped to directly, and both
 * ends can be typed.
 *
 * This is the unwrapped control, with no label or form row around it.
 * DateRangeElement renders it inside the usual form layout.
 *
 * @param props - React props
 * @param props.value - The range, as YYYY-MM-DD strings
 * @param props.onChange - Callback given the new range
 * @param props.label - Names the control, and rises onto the
 *                      top edge once a range is set
 * @param props.placeholder - Shown when no range is set
 * @param props.minYear - First year offered
 * @param props.maxYear - Last year offered
 * @param props.fromLabel - Label for the start input
 * @param props.toLabel - Label for the end input
 * @param props.clearLabel - Label for the clear button
 * @param props.name - Names hidden inputs <name>Min and
 *                     <name>Max holding the range
 * @param props.resetLabel - Text on the calendar's own clear button,
 *                           shorter than clearLabel since the field
 *                           already names what it clears
 * @param props.previousLabel - Accessible name for the
 *                              previous month control
 * @param props.nextLabel - Accessible name for the next
 *                          month control
 * @param props.disabled - Disables the trigger
 * @param props.clearable - Show a control inside the field
 *                          that clears it once a range is
 *                          set
 * @returns - The control
 */
function DateRange(props: {
    value: Range,
    onChange: (value: Range) => void,
    label?: string,
    placeholder?: string,
    minYear?: number,
    maxYear?: number,
    fromLabel?: string,
    toLabel?: string,
    clearLabel?: string,
    disabled?: boolean,
    clearable?: boolean,
    name?: string,
    resetLabel?: string,
    previousLabel?: string,
    nextLabel?: string,
}): React.ReactElement {
  const value = props.value || {};
  const start = value.min || '';
  const end = value.max || '';
  const initial = start ? new Date(start + 'T00:00:00Z') : new Date();
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(initial.getUTCMonth());
  const [year, setYear] = useState(initial.getUTCFullYear());
  const [hover, setHover] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const panelBox = useRef<HTMLDivElement>(null);
  const place = useFloatingPanel(root, panelBox, open);

  const maxYear = props.maxYear || new Date().getFullYear();
  const minYear = props.minYear || maxYear - 120;

  useEffect(() => {
    if (!open) {
      return;
    }
    /**
     * Closes the panel on a click outside the control
     *
     * @param e - the click
     */
    const close = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const dateFormat = new Intl.DateTimeFormat(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
  }) as Intl.DateTimeFormat & {formatRange(a: Date, b: Date): string};

  /**
   * Turns a YYYY-MM-DD date into a Date
   *
   * @param iso - the date
   */
  const asDate = (iso: string) => new Date(iso + 'T00:00:00Z');

  /**
   * Sets one end of the range from a clicked day
   *
   * @param day - the day clicked, as YYYY-MM-DD
   */
  const pick = (day: string) => {
    if (!start || end) {
      props.onChange({min: day, max: ''});
    } else if (day < start) {
      props.onChange({min: day, max: start});
      setOpen(false);
    } else {
      props.onChange({min: start, max: day});
      setOpen(false);
    }
  };

  /**
   * Moves the calendar by a number of months
   *
   * @param by - months to move, negative for earlier
   */
  const shift = (by: number) => {
    const next = new Date(Date.UTC(year, month + by, 1));
    setMonth(next.getUTCMonth());
    setYear(next.getUTCFullYear());
  };

  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const rangeEnd = end || (start && hover > start ? hover : '');
  const today = new Date();
  const todayIso = isoDate(
    today.getFullYear(), today.getMonth(), today.getDate()
  );

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) {
    cells.push(<span key={'blank' + i} />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const day = isoDate(year, month, d);
    const isEnd = day === start || day === end;
    const inRange = start && rangeEnd && day > start && day < rangeEnd;
    const joined = start && rangeEnd && start !== rangeEnd;
    cells.push(
      <button
        key={day}
        type="button"
        className={'loris-daterange-day'
          + (isEnd ? ' end' : '')
          + (inRange ? ' in-range' : '')
          + (joined && day === start ? ' range-start' : '')
          + (joined && day === rangeEnd ? ' range-end' : '')
          + (day === todayIso ? ' today' : '')}
        aria-pressed={isEnd}
        onMouseEnter={() => setHover(day)}
        onClick={() => pick(day)}
      >
        <span>{d}</span>
      </button>
    );
  }

  const monthNames = Array.from({length: 12}, (_, m) =>
    new Intl.DateTimeFormat(undefined, {month: 'long', timeZone: 'UTC'})
      .format(new Date(Date.UTC(2000, m, 1)))
  );
  const weekdays = Array.from({length: 7}, (_, d) =>
    new Intl.DateTimeFormat(undefined, {weekday: 'narrow', timeZone: 'UTC'})
      .format(new Date(Date.UTC(2000, 0, 2 + d)))
  );
  const years = [];
  for (let y = maxYear; y >= minYear; y--) {
    years.push(<option key={y} value={y}>{y}</option>);
  }

  const raised = !!(start || end) || open;
  const canClear = props.clearable && !props.disabled && !!(start || end);
  let summary: React.ReactNode = props.label && !raised ? null :
    <span className="loris-select-placeholder">{props.placeholder}</span>;
  if (start || end) {
    // A range names its shared month and year once: "Nov 9 – 19, 2026".
    const text = start && end
      ? dateFormat.formatRange(asDate(start), asDate(end))
      : (start ? dateFormat.format(asDate(start)) : '…') + ' – '
        + (end ? dateFormat.format(asDate(end)) : '…');
    summary = <span className="loris-select-names">{text}</span>;
  }

  return (
    <div ref={root} className={'loris-select loris-daterange'
      + (open ? ' open' : '')
      + (canClear ? ' has-clear' : '')}>
      {props.label ?
        <fieldset className="loris-select-outline" aria-hidden="true">
          <legend className={raised ? '' : 'closed'}>
            <span>{props.label}</span>
          </legend>
        </fieldset> :
        null}
      <button
        type="button"
        className="loris-select-trigger"
        disabled={props.disabled}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {props.label ?
          <span className={'loris-select-label' + (raised ? ' raised' : '')}>
            {props.label}
          </span> :
          null}
        <span className="loris-select-value">{summary}</span>
        <span className="loris-select-indicators">
          <Icon name="chevronDown" className="loris-select-caret" />
        </span>
      </button>
      {props.name ? <>
        <input type="hidden" name={`${props.name}Min`} value={start} />
        <input type="hidden" name={`${props.name}Max`} value={end} />
      </> : null}
      {canClear ?
        <button type="button"
          className="loris-field-clear"
          aria-label={props.clearLabel || 'Clear'}
          title={props.clearLabel || 'Clear'}
          onClick={() => props.onChange({min: '', max: ''})}>
          <Icon name="close" />
        </button> :
        null}
      {open ? <div ref={panelBox} style={place}
        className="loris-select-panel loris-daterange-panel">
        <div className="loris-daterange-head">
          <button type="button" className="loris-daterange-step"
            aria-label={props.previousLabel || 'Previous month'}
            onClick={() => shift(-1)}>
            <Icon name="chevronLeft" />
          </button>
          <span className="loris-daterange-pick">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {monthNames.map((name, m) =>
                <option key={m} value={m}>{name}</option>)}
            </select>
            <Icon name="chevronDown" className="loris-select-caret" />
          </span>
          <span className="loris-daterange-pick">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {years}
            </select>
            <Icon name="chevronDown" className="loris-select-caret" />
          </span>
          <button type="button" className="loris-daterange-step"
            aria-label={props.nextLabel || 'Next month'}
            onClick={() => shift(1)}>
            <Icon name="chevronRight" />
          </button>
        </div>
        <div className="loris-daterange-grid"
          onMouseLeave={() => setHover('')}>
          {weekdays.map((w, i) =>
            <span key={'w' + i} className="loris-daterange-weekday">{w}</span>)}
          {cells}
        </div>
        <div className="loris-daterange-inputs">
          <DateText
            label={props.fromLabel || 'From'}
            value={start}
            onChange={(day) => props.onChange({min: day, max: end})}
          />
          <DateText
            label={props.toLabel || 'To'}
            value={end}
            onChange={(day) => props.onChange({min: start, max: day})}
          />
        </div>
        {/* A clearable field has its own control to clear it, so the
            calendar only offers one when the field does not. */}
        {props.clearable ? null : <div className="loris-daterange-foot">
          <button type="button" className="loris-button quiet"
            disabled={!start && !end}
            aria-label={props.clearLabel || 'Clear'}
            onClick={() => props.onChange({min: '', max: ''})}>
            {props.resetLabel || 'Clear'}
          </button>
        </div>}
      </div> : null}
    </div>
  );
}

export default DateRange;
