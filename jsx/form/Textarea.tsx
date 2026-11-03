import React from 'react';
import {useFieldControl} from 'jsx/form/Field';

type TextareaProps = {
  // The current text
  value: string;
  // Called with the new text
  onChange: (value: string) => void;
  // Called with the text when the textarea loses focus
  onBlur?: (value: string) => void;
  name?: string;
  id?: string;
  placeholder?: string;
  rows?: number;
  cols?: number;
  disabled?: boolean;
  required?: boolean;
  // Whether the textarea holds an invalid value
  invalid?: boolean;
  // The id of the element describing the textarea
  describedBy?: string;
};

/**
 * Multiline text input React component
 * Inside a Field, it takes its id and invalid state from the Field.
 *
 * @param props The props of the component
 * @returns The corresponding React element
 */
const Textarea: React.FC<TextareaProps> = (props) => {
  const control = useFieldControl(props);
  return (
    <textarea
      cols={props.cols}
      rows={props.rows}
      className="form-control"
      name={props.name}
      id={control.id}
      value={props.value}
      placeholder={props.placeholder}
      required={props.required}
      disabled={props.disabled}
      aria-invalid={control.invalid || undefined}
      aria-describedby={control.describedBy}
      onChange={(e) => props.onChange(e.target.value)}
      onBlur={(e) => props.onBlur?.(e.target.value)}
    />
  );
};

export default Textarea;
