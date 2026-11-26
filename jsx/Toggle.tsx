import React from 'react';
import './Toggle.css';

/**
 * A boolean, drawn as a switch or as a checkbox. A switch takes effect when it
 * changes and is announced as a switch. A checkbox is one of several values
 * chosen, and takes effect on submit.
 *
 * This is the unwrapped control, with no form row around it.
 *
 * @param props - React props
 * @param props.name - Name given to the underlying input
 * @param props.checked - Whether the boolean is on
 * @param props.onChange - Callback given the new state
 * @param props.display - "switch" (the default) or "checkbox"
 * @param props.label - Text shown beside the control
 * @param props.value - Value submitted when checked
 * @param props.disabled - Disables the control
 * @returns - The control
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
