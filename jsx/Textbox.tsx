import React, {useState} from 'react';
import './Textbox.css';

/**
 * A single line text input.
 *
 * With search set it gains the affordances a search deserves: a magnifier
 * while it is empty, and a control to clear it once it is not. That is the
 * only difference, so a box that narrows a list down is this component rather
 * than one of its own.
 *
 * It is the unwrapped control, with no form row or label around it, so it can
 * be placed anywhere. TextboxElement renders it inside the usual form layout.
 *
 * @param {object} props - React props
 * @param {string} props.value - The current text
 * @param {function} props.onChange - Callback given the new text
 * @param {string|undefined} props.label - Names the control. It sits where the
 *                                          text would be while the box is
 *                                          empty and unfocused, and rises onto
 *                                          the top edge otherwise, so the
 *                                          control still says what it is once
 *                                          it holds text.
 * @param {boolean|undefined} props.search - Show the search affordances
 * @param {string|undefined} props.placeholder - Placeholder for the input
 * @param {string|undefined} props.clearLabel - Accessible name for the clear control
 * @param {boolean|undefined} props.disabled - Disables the input
 * @param {boolean|undefined} props.required - Marks the input as required
 * @param {string|undefined} props.name - Name given to the input
 * @param {string|undefined} props.id - Id given to the input
 * @param {function|undefined} props.onBlur - Callback when the input loses focus
 * @param {string|undefined} props.autoComplete - Autocomplete hint for the input
 * @returns {React.ReactElement} - The input
 */
function Textbox(props: {
    value: string,
    onChange: (value: string) => void,
    label?: string,
    search?: boolean,
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
  if (props.search) {
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
    <div className={'loris-textbox' + (props.search ? ' searchable' : '')}>
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
