import React from 'react';

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
 *
 * @param props The props of the component
 * @returns The corresponding React element
 */
const Textarea: React.FC<TextareaProps> = (props) => (
  <textarea
    cols={props.cols}
    rows={props.rows}
    className="form-control"
    name={props.name}
    id={props.id}
    value={props.value}
    placeholder={props.placeholder}
    required={props.required}
    disabled={props.disabled}
    aria-invalid={props.invalid || undefined}
    aria-describedby={props.describedBy}
    onChange={(e) => props.onChange(e.target.value)}
    onBlur={(e) => props.onBlur?.(e.target.value)}
  />
);

export default Textarea;
