import React from 'react';

type InputLabelProps = {
  // The label to be displayed to the user
  label: React.ReactNode;
  // Whether or not the input is required, `false` by default
  required?: boolean;
  fullWidth?: boolean;
};

/**
 * Input label React component
 *
 * @param props The props of the component
 * @param props.label The label content
 * @param props.required Whether the input is required
 * @param props.fullWidth Whether the label should span the full row
 * @returns The corresponding React element
 */
const InputLabel: React.FC<InputLabelProps> = ({
  label,
  required,
  fullWidth,
}) => (
  <label
    className={`col-sm-${fullWidth ? '12' : '3'} control-label`}
    htmlFor={typeof label === 'string' ? label : undefined}
    style={fullWidth ? {textAlign: 'left'} : {}}
  >
    {label}
    {required && <span className="text-danger">*</span>}
  </label>
);

export default InputLabel;
