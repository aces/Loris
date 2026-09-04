import React from 'react';
import './Toggle.css';

/**
 * A boolean, drawn either as a switch or as a checkbox.
 *
 * Both are the same control over the same input, and differ only in how they
 * are drawn and in what they say to a screen reader. Choose between them by
 * what the boolean does:
 *
 *   switch    the setting takes effect the moment it changes. Announced as a
 *             switch, which tells a screen reader user the same thing.
 *   checkbox  the value is one of several being chosen, and takes effect when
 *             something else is submitted.
 *
 * It is the unwrapped control, with no form row or offset around it, so it can
 * be placed anywhere.
 *
 * @param {object} props - React props
 * @param {string} props.name - Name given to the underlying input
 * @param {boolean} props.checked - Whether the boolean is on
 * @param {function} props.onChange - Callback given the new state
 * @param {string|undefined} props.display - "switch" (the default) or "checkbox"
 * @param {string|undefined} props.label - Text shown beside the control
 * @param {string|undefined} props.value - Value submitted when checked
 * @param {boolean|undefined} props.disabled - Disables the control
 * @returns {React.ReactElement} - The control
 */
function Toggle(props: {
    name: string,
    checked: boolean,
    onChange: (checked: boolean) => void,
    display?: 'switch' | 'checkbox',
    label?: string,
    value?: string,
    disabled?: boolean,
}): React.ReactElement {
  const asSwitch = props.display !== 'checkbox';
  return (
    <label className={'loris-toggle'
      + (asSwitch ? ' as-switch' : ' as-checkbox')
      + (props.disabled ? ' disabled' : '')}>
      <input type="checkbox"
        role={asSwitch ? 'switch' : undefined}
        name={props.name}
        value={props.value}
        checked={props.checked}
        disabled={props.disabled}
        onChange={(e) => props.onChange(e.target.checked)} />
      {asSwitch ?
        <span className="loris-toggle-track" aria-hidden="true">
          <span className="loris-toggle-thumb" />
        </span> :
        null}
      {props.label ? <span>{props.label}</span> : null}
    </label>
  );
}

export default Toggle;
