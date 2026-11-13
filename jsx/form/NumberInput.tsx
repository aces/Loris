import React, {forwardRef} from 'react';
import {useFieldControl} from 'jsx/form/Field';

type NumberInputProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'type' | 'value' | 'onChange'
> & {
  // The current value, as typed
  value: string;
  // Called with the new value, as typed
  onChange: (value: string) => void;
  // Whether the input holds an invalid value
  invalid?: boolean;
};

/**
 * Number input React component
 * Takes any input attribute. Inside a Field, it takes its id, required,
 * disabled and invalid state from the Field.
 */
const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput({value, onChange, invalid, className, ...props}, ref) {
    const control = useFieldControl({...props, invalid});
    return (
      <input
        {...props}
        {...control}
        ref={ref}
        type="number"
        className={className ? 'form-control ' + className : 'form-control'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
);

export default NumberInput;
