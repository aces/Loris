import React from 'react';
import './Toggle.css';

/**
 * A boolean, drawn as a switch or as a checkbox. A switch takes effect when it
 * changes and is announced as a switch. A checkbox is one of several values
 * chosen, and takes effect on submit.
 *
 * This is the unwrapped control, with no form row around it.
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
