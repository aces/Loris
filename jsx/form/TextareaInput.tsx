import React, {forwardRef} from 'react';
import {useFieldControl} from 'jsx/form/Field';

type TextareaInputProps = Omit<
  React.ComponentPropsWithoutRef<'textarea'>,
  'value' | 'onChange' | 'onBlur'
> & {
  // The current text
  value: string;
  // Called with the new text
  onChange: (value: string) => void;
  // Called with the text when the textarea loses focus
  onBlur?: (value: string) => void;
  // Whether the textarea holds an invalid value
  invalid?: boolean;
};

/**
 * Multiline text input React component
 * Takes any textarea attribute. Inside a Field, it takes its id, required,
 * disabled and invalid state from the Field.
 */
const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  function TextareaInput(
    {value, onChange, onBlur, invalid, className, ...props},
    ref,
  ) {
    const control = useFieldControl({...props, invalid});
    return (
      <textarea
        {...props}
        {...control}
        ref={ref}
        className={className ? 'form-control ' + className : 'form-control'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur?.(e.target.value)}
      />
    );
  }
);

export default TextareaInput;
