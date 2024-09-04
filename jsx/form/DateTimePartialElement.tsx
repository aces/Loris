import {ChangeEvent, ReactNode, useState} from 'react';

const format = 'YYYY-MM-DD hh:mm:ss';

/**
 * Check if a character is a digit.
 *
 * @param character The character to check
 * @returns The result of the check
 */
function isDigit(character: string) {
  return character >= '0' && character <= '9';
}

/**
 * Check if a character is a letter.
 *
 * @param character A character to check
 * @returns The result of the check
 */
function isLetter(character: string) {
  return (character >= 'A' && character <= 'Z')
    || (character >= 'a' && character <= 'z');
}

/**
 * Insert a string inside another string at a given index.
 *
 * @param string The string in which the substring is to be inserted
 * @param index The index at which to insert the substring
 * @param other The substring to insert
 * @returns The new string
 */
function stringInsert(string: string, index: number, other: string) {
  return string.slice(0, index) + other + string.slice(index);
}

/**
 * Checks if a value matches the datetime format, formatting it if necessary.
 *
 * @param oldDateTime The old value of the input (which is valid)
 * @param newDateTime The new value of the input (which may be invalid)
 * @returns The formatted new value, or `null` if the new value is invalid
 */
function formatDatetime(oldDateTime: string, newDateTime: string) {
  for (let i = 0; i < newDateTime.length; i++) {
    // Check that the new value is no longer than the format.
    // This check is done inside the loop because the value might grow during
    // formatting.
    if (i >= format.length) {
      return null;
    }

    // Check that each new value character matches that expected from the
    // format.
    const valueChar = newDateTime[i];
    const formatChar = format[i];
    if (isLetter(formatChar)) {
      if (!isDigit(valueChar)) {
        return null;
      }
    } else {
      if (isDigit(valueChar)) {
        newDateTime = stringInsert(newDateTime, i, formatChar);
      } else if (valueChar !== formatChar) {
        return null;
      }
    }
  }

  // If a character was added, add a special character if it is expected from
  // the format.
  if (newDateTime.length > oldDateTime.length &&
    newDateTime.length < format.length
  ) {
    const nextChar = format[newDateTime.length];
    if (!isLetter(nextChar)) {
      newDateTime += nextChar;
    }
  }

  // If a character was removed, remove a special character if it is expected
  // from the format.
  if (newDateTime.length < oldDateTime.length && newDateTime.length > 0) {
    const prevChar = format[newDateTime.length - 1];
    if (!isLetter(prevChar)) {
      newDateTime = newDateTime.slice(0, -1);
    }
  }

  return newDateTime;
}

interface MaskProps {
  value: string;
  children: ReactNode;
}

/**
 * React component for an input datetime mask.
 *
 * @param props The props of the component
 * @returns The corresponding React element
 */
function Mask(props: MaskProps) {
  // '\u00A0' is a non-breakable space.
  return (
    <div style={{position: 'relative'}}>
      {props.children}
      <div className="form-control" style={{
        position: 'absolute',
        top: 0, left: 0,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        boxShadow: 'none',
        pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: 'monospace',
          color: '#777777',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}>
          {'\u00A0'.repeat(props.value.length)}
          {format.slice(props.value.length)}
        </div>
      </div>
    </div>
  );
}

interface DateTimePartialElementProps {
  name: string;
  label: string;
  value?: string;
  id?: string;
  dateFormat: string;
  required?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  onUserInput: (name: string, value: string) => void;
}

/**
 * Datetime input (down to the second) React component
 * Compared to the standard HTML input, this input accepts incomplete datetimes
 * (useful for filtering).
 *
 * @param props The props of the component
 * @returns The corresponding React element
 */
function DateTimePartialElement(props: DateTimePartialElementProps) {
  const onUserInput = props.onUserInput !== undefined
    ? props.onUserInput
    : () => console.warn('onUserInput() callback is not set');

  const [value, setValue] = useState(props.value ?? '');

  /**
   * Handle a change in the input.
   *
   * @param e The React event.
   */
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const rawValue = e.target.value.replace(/[- :]/g, '');
    const newValue = formatDatetime(value, rawValue);
    if (newValue === null) {
      return;
    }

    setValue(newValue);

    onUserInput(
      props.name,
      newValue,
    );
  }

  const required = props.required ?? false;
  const disabled = props.disabled ?? false;
  let errorMessage = null;
  let elementClass = 'row form-group';

  if (props.required && value == '') {
    errorMessage = <span>This field is required</span>;
    elementClass += ' has-error';
  } else if (props.hasError) {
    errorMessage = <span>{props.errorMessage}</span>;
    elementClass += ' has-error';
  }

  let labelHTML;
  let classSz = 'col-sm-12';
  if (props.label) {
    classSz = 'col-sm-9';
    labelHTML = (
      <label
        className="col-sm-3 control-label"
        htmlFor={props.label}
      >
        {props.label}
        {required
          ? (<span className="text-danger">*</span>)
          : null}
      </label>
    );
  }

  return (
    <div className={elementClass}>
      {labelHTML}
      <div className={classSz}>
        <Mask value={value}>
          <input
            className="form-control"
            name={props.name}
            id={props.id}
            onChange={handleChange}
            value={value}
            required={required}
            disabled={disabled}
            style={{fontFamily: 'monospace'}}
          />
        </Mask>
        {errorMessage}
      </div>
    </div>
  );
}

export default DateTimePartialElement;
