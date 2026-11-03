import React, {useId} from 'react';
import InputLabel from 'jsx/form/InputLabel';

type FieldControlProps = {
  // Whether the control holds an invalid value
  invalid: boolean;
  // The id of the error message describing the control
  describedBy?: string;
};

type FieldProps = {
  // The label, shown in its own column when given, even if empty
  label?: React.ReactNode;
  // Whether the field is required, `false` by default
  required?: boolean;
  // The error message shown under the control
  errorMessage?: string | null;
  // Whether the label sits above the control rather than beside it
  labelPlacementTop?: boolean;
  // Whether to render the control without the form row and label
  noMargins?: boolean;
  // Renders the control, given its invalid state and error message id
  children: (control: FieldControlProps) => React.ReactNode;
};

/**
 * Form field React component
 * Lays out a control in a form row with its label and error message.
 *
 * @param props The props of the component
 * @param props.label The label content
 * @param props.required Whether the field is required
 * @param props.errorMessage The error message
 * @param props.labelPlacementTop Whether the label sits above the control
 * @param props.noMargins Whether to render the control alone
 * @param props.children Renders the control
 * @returns The corresponding React element
 */
const Field: React.FC<FieldProps> = ({
  label,
  required,
  errorMessage,
  labelPlacementTop,
  noMargins,
  children,
}) => {
  const errorId = useId();
  const invalid = !!errorMessage;
  const showLabel = !noMargins && label !== undefined;

  let elementClass = noMargins ? '' : 'row form-group';
  if (invalid) {
    elementClass = noMargins ? 'has-error' : 'row form-group has-error';
  }

  let inputClass = noMargins ? '' : 'col-sm-12';
  if (showLabel) {
    inputClass = `col-sm-${labelPlacementTop ? '12' : '9'}`;
  }

  return (
    <div
      className={elementClass}
      style={labelPlacementTop ? {
        display: 'flex',
        flexDirection: 'column',
      } : {}}
    >
      {showLabel && (
        <InputLabel
          label={label}
          required={required}
          fullWidth={labelPlacementTop}
        />
      )}
      <div className={inputClass}>
        {children({
          invalid,
          describedBy: invalid ? errorId : undefined,
        })}
        {invalid && <span id={errorId}>{errorMessage}</span>}
      </div>
    </div>
  );
};

export default Field;
