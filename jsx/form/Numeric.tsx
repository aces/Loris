import React from 'react';
import {useFieldControl} from 'jsx/form/Field';

type NumericProps = {
  // The current value, as typed
  value: string;
  // Called with the new value, as typed
  onChange: (value: string) => void;
  name?: string;
  id?: string;
  min?: number | null;
  max?: number | null;
  step?: string;
  disabled?: boolean;
  required?: boolean;
  // Whether the input holds an invalid value
  invalid?: boolean;
  // The id of the element describing the input
  describedBy?: string;
};

/**
 * Number input React component
 * Inside a Field, it takes its id and invalid state from the Field.
 *
 * @param props The props of the component
 * @returns The corresponding React element
 */
const Numeric: React.FC<NumericProps> = (props) => {
  const control = useFieldControl(props);
  return (
    <input
      type="number"
      className="form-control"
      name={props.name}
      id={control.id}
      min={props.min ?? undefined}
      max={props.max ?? undefined}
      step={props.step}
      value={props.value}
      disabled={props.disabled}
      required={props.required}
      aria-invalid={control.invalid || undefined}
      aria-describedby={control.describedBy}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
};

export default Numeric;
