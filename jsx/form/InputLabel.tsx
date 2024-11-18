import React from 'react';

type InputLabelProps = {
  // The label to be displayed to the user
  label: string;
  // Whether or not the input is required, `false` by default
  required?: boolean;
};

/**
 * Input label React component
 *
 * @param props The props of the component
 * @returns The corresponding React element
 */
const InputLabel: React.FC<InputLabelProps> = ({label, required}) => (
  <label className="col-sm-3 control-label" htmlFor={label}>
    {label}
    {required && <span className="text-danger">*</span>}
  </label>
);

export default InputLabel;
