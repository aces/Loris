import React, {createContext, useContext, useId, useMemo} from 'react';
import InputLabel from 'jsx/form/InputLabel';

type FieldState = {
  // The id of the control, which the label points to
  id?: string;
  // Whether the control holds an invalid value
  invalid?: boolean;
  // Whether the control must be filled in
  required?: boolean;
  // Whether the control is disabled
  disabled?: boolean;
  // The id of the error message describing the control
  describedBy?: string;
};

const FieldContext = createContext<FieldState>({});

type ControlProps = {
  id?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  'aria-describedby'?: string;
};

/**
 * Resolve the attributes a control renders, taking each from the enclosing
 * Field unless the control is given its own.
 *
 * @param props The control's own props
 * @returns The id, required, disabled and aria attributes to spread on the
 *          control's input
 */
export function useFieldControl(props: ControlProps) {
  const field = useContext(FieldContext);
  const invalid = props.invalid ?? field.invalid;
  const describedBy = [props['aria-describedby'], field.describedBy]
    .filter(Boolean)
    .join(' ');
  return {
    'id': props.id ?? field.id,
    'required': props.required ?? field.required,
    'disabled': props.disabled ?? field.disabled,
    'aria-invalid': invalid || undefined,
    'aria-describedby': describedBy || undefined,
  };
}

type FieldProps = {
  // The id of the control, generated when not given
  id?: string | null;
  // The label, shown in its own column when given, even if empty
  label?: React.ReactNode;
  // Whether the control must be filled in, `false` by default
  required?: boolean;
  // Whether the control is disabled, `false` by default
  disabled?: boolean;
  // The error message shown under the control
  errorMessage?: string | null;
  // Whether the label sits above the control rather than beside it
  labelPlacementTop?: boolean;
  // Whether to render the control without the form row and label
  noMargins?: boolean;
  // The control
  children: React.ReactNode;
};

/**
 * Form field React component
 * Lays out a control in a form row with its label and error message, and
 * gives the control its id, required, disabled and invalid state.
 *
 * @param props The props of the component
 * @returns The corresponding React element
 */
function Field(props: FieldProps) {
  const generatedId = useId();
  const id = props.id || generatedId;
  const errorId = id + '-error';
  const invalid = !!props.errorMessage;
  const showLabel = !props.noMargins && props.label !== undefined;

  const state = useMemo(() => ({
    id,
    invalid,
    required: props.required,
    disabled: props.disabled,
    describedBy: invalid ? errorId : undefined,
  }), [id, invalid, props.required, props.disabled, errorId]);

  let elementClass = props.noMargins ? '' : 'row form-group';
  if (invalid) {
    elementClass = props.noMargins ? 'has-error' : 'row form-group has-error';
  }

  let inputClass = props.noMargins ? '' : 'col-sm-12';
  if (showLabel) {
    inputClass = `col-sm-${props.labelPlacementTop ? '12' : '9'}`;
  }

  return (
    <div
      className={elementClass}
      style={props.labelPlacementTop ? {
        display: 'flex',
        flexDirection: 'column',
      } : {}}
    >
      {showLabel && (
        <InputLabel
          label={props.label}
          required={props.required}
          fullWidth={props.labelPlacementTop}
          htmlFor={id}
        />
      )}
      <div className={inputClass}>
        <FieldContext.Provider value={state}>
          {props.children}
        </FieldContext.Provider>
        {invalid && <span id={errorId}>{props.errorMessage}</span>}
      </div>
    </div>
  );
}

export default Field;
