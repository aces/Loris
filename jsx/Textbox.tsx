import React, {useState} from 'react';
import './Textbox.css';

/**
 * A single line text input. With search set it gains a magnifier while it is
 * empty and a control to clear it once it is not.
 *
 * This is the unwrapped control, with no label or form row around it.
 * TextboxElement renders it inside the usual form layout.
 *
 * @param props - React props
 * @param props.value - The current text
 * @param props.onChange - Callback given the new text
 * @param props.label - Names the control, and rises onto the
 *                      top edge once it holds text
 * @param props.search - Show the search affordances
 * @param props.clearable - Show the clear control once the
 *                          input holds text, without the
 *                          magnifier
 * @param props.placeholder - Placeholder for the input
 * @param props.clearLabel - Accessible name for the clear control
 * @param props.disabled - Disables the input
 * @param props.required - Marks the input as required
 * @param props.name - Name given to the input
 * @param props.id - Id given to the input
 * @param props.onBlur - Callback when the input loses focus
 * @param props.autoComplete - Autocomplete hint for the input
 * @returns - The input
 */
function Textbox(props: {
    value: string,
    onChange: (value: string) => void,
    label?: string,
    search?: boolean,
    clearable?: boolean,
    placeholder?: string,
    clearLabel?: string,
    disabled?: boolean,
    required?: boolean,
    name?: string,
    id?: string,
    onBlur?: () => void,
    autoComplete?: string,
}): React.ReactElement {
  const [focused, setFocused] = useState<boolean>(false);
  const raised = props.value !== '' || focused;
  let affordance = null;
  if (props.clearable && !props.search && props.value !== '') {
    affordance =
      <button type="button"
        className="loris-textbox-clear"
        disabled={props.disabled}
        aria-label={props.clearLabel || 'Clear'}
        onClick={() => props.onChange('')}>
        <span className="glyphicon glyphicon-remove" aria-hidden="true" />
      </button>;
  } else if (props.search) {
    affordance = props.value === '' ?
      <span className="loris-textbox-icon" aria-hidden="true">
        <span className="glyphicon glyphicon-search" />
      </span> :
      <button type="button"
        className="loris-textbox-clear"
        disabled={props.disabled}
        aria-label={props.clearLabel || 'Clear'}
        onClick={() => props.onChange('')}>
        <span className="glyphicon glyphicon-remove" aria-hidden="true" />
      </button>;
  }
  return (
    <div className={'loris-textbox'
      + (props.search || affordance ? ' searchable' : '')}>
      {props.label ?
        <fieldset className="loris-textbox-outline" aria-hidden="true">
          <legend className={raised ? '' : 'closed'}>
            <span>{props.label}</span>
          </legend>
        </fieldset> :
        null}
      {props.label ?
        <span className={'loris-textbox-label' + (raised ? ' raised' : '')}>
          {props.label}
        </span> :
        null}
      <input type="text"
        className="loris-textbox-input"
        name={props.name}
        id={props.id}
        value={props.value}
        required={props.required}
        disabled={props.disabled}
        placeholder={props.label && !raised ? '' : props.placeholder}
        autoComplete={props.autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          if (props.onBlur) {
            props.onBlur();
          }
        }}
        onChange={(e) => props.onChange(e.target.value)} />
      {affordance}
    </div>
  );
}

export default Textbox;
