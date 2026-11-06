import React, {useState, useRef, useEffect} from 'react';
import './Select.css';
import './DateRange.css';

type Range = {min?: string, max?: string};

/**
 * Formats a date held as YYYY-MM-DD from its parts
 *
 * @param {number} year - the year
 * @param {number} month - the month, from 0
 * @param {number} day - the day of the month
 * @return {string}
 */
function isoDate(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, '0')}-` +
    `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * A range of dates picked on one calendar: the first click sets the start and
 * the second the end. The month and year can be jumped to directly, and both
 * ends can be typed.
 *
 * This is the unwrapped control, with no label or form row around it.
 * DateRangeElement renders it inside the usual form layout.
 *
 * @param {object} props - React props
 * @param {Range} props.value - The range, as YYYY-MM-DD strings
 * @param {function} props.onChange - Callback given the new range
 * @param {string|undefined} props.label - Names the control, and rises onto the
 *                                         top edge once a range is set
 * @param {string|undefined} props.placeholder - Shown when no range is set
 * @param {number|undefined} props.minYear - First year offered
 * @param {number|undefined} props.maxYear - Last year offered
 * @param {string|undefined} props.fromLabel - Label for the start input
 * @param {string|undefined} props.toLabel - Label for the end input
 * @param {string|undefined} props.clearLabel - Label for the clear button
 * @param {string|undefined} props.name - Names hidden inputs <name>Min and
 *                                        <name>Max holding the range
 * @param {string|undefined} props.doneLabel - Label for the done button
 * @param {string|undefined} props.previousLabel - Accessible name for the
 *                                                previous month control
 * @param {string|undefined} props.nextLabel - Accessible name for the next
 *                                            month control
 * @param {boolean|undefined} props.disabled - Disables the trigger
 * @param {boolean|undefined} props.clearable - Show a control inside the field
 *                                             that clears it once a range is
 *                                             set
 * @returns {React.ReactElement} - The control
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
    doneLabel?: string,
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

  const maxYear = props.maxYear || new Date().getFullYear();
  const minYear = props.minYear || maxYear - 120;

  useEffect(() => {
    if (!open) {
      return;
    }
    /**
     * Closes the panel on a click outside the control
     *
     * @param {MouseEvent} e - the click
     */
    const close = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  /**
   * Formats a YYYY-MM-DD date for the trigger
   *
   * @param {string} iso - the date
   * @return {string}
   */
  const format = (iso: string) => new Intl.DateTimeFormat(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
  }).format(new Date(iso + 'T00:00:00Z'));

  /**
   * Sets one end of the range from a clicked day
   *
   * @param {string} day - the day clicked, as YYYY-MM-DD
   */
  const pick = (day: string) => {
    if (!start || end) {
      props.onChange({min: day, max: ''});
    } else if (day < start) {
      props.onChange({min: day, max: start});
    } else {
      props.onChange({min: start, max: day});
    }
  };

  /**
   * Moves the calendar by a number of months
   *
   * @param {number} by - months to move, negative for earlier
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
    cells.push(
      <button
        key={day}
        type="button"
        className={'loris-daterange-day'
          + (isEnd ? ' end' : '')
          + (inRange ? ' in-range' : '')
          + (day === todayIso ? ' today' : '')}
        aria-pressed={isEnd}
        onMouseEnter={() => setHover(day)}
        onClick={() => pick(day)}
      >
        {d}
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
    summary = <span className="loris-select-names">
      {(start ? format(start) : '…') + ' – ' + (end ? format(end) : '…')}
    </span>;
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
          <span className="caret" />
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
          ×
        </button> :
        null}
      {open ? <div className="loris-select-panel loris-daterange-panel">
        <div className="loris-daterange-head">
          <button type="button" className="loris-daterange-step"
            aria-label={props.previousLabel || 'Previous month'}
            onClick={() => shift(-1)}>‹</button>
          <select
            className="loris-daterange-pick"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {monthNames.map((name, m) =>
              <option key={m} value={m}>{name}</option>)}
          </select>
          <select
            className="loris-daterange-pick"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {years}
          </select>
          <button type="button" className="loris-daterange-step"
            aria-label={props.nextLabel || 'Next month'}
            onClick={() => shift(1)}>›</button>
        </div>
        <div className="loris-daterange-grid"
          onMouseLeave={() => setHover('')}>
          {weekdays.map((w, i) =>
            <span key={'w' + i} className="loris-daterange-weekday">{w}</span>)}
          {cells}
        </div>
        <div className="loris-daterange-inputs">
          <label>
            {props.fromLabel || 'From'}
            <input type="date" value={start}
              min={`${minYear}-01-01`} max={`${maxYear}-12-31`}
              onChange={(e) => props.onChange({min: e.target.value, max: end})}
            />
          </label>
          <label>
            {props.toLabel || 'To'}
            <input type="date" value={end}
              min={`${minYear}-01-01`} max={`${maxYear}-12-31`}
              onChange={(e) => props.onChange(
                {min: start, max: e.target.value}
              )}
            />
          </label>
        </div>
        <div className="loris-daterange-foot">
          <button type="button" className="loris-button quiet"
            disabled={!start && !end}
            onClick={() => props.onChange({min: '', max: ''})}>
            {props.clearLabel || 'Clear'}
          </button>
          <button type="button" className="loris-button primary"
            onClick={() => setOpen(false)}>
            {props.doneLabel || 'Done'}
          </button>
        </div>
      </div> : null}
    </div>
  );
}

export default DateRange;
