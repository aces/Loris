import React, {createContext, useContext, useId, useMemo} from 'react';
import InputLabel from 'jsx/form/InputLabel';

type FieldControl = {
  // The id of the control, which the label points to
  id?: string;
  // Whether the control holds an invalid value
  invalid?: boolean;
  // The id of the error message describing the control
  describedBy?: string;
};

const FieldContext = createContext<FieldControl>({});

/**
 * Resolve a control's id and invalid state, taking them from the enclosing
 * Field unless the control is given its own.
 *
 * @param props The control's own props
 * @returns The id, invalid state and description id to render
 */
export function useFieldControl(props: FieldControl): FieldControl {
  const field = useContext(FieldContext);
  return {
    id: props.id ?? field.id,
    invalid: props.invalid ?? field.invalid,
    describedBy: props.describedBy ?? field.describedBy,
  };
}

type FieldProps = {
  // The id of the control, generated when not given
  id?: string | null;
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
  // The control
  children: React.ReactNode;
};

/**
 * Form field React component
 * Lays out a control in a form row with its label and error message, and
 * gives the control its id and invalid state.
 *
 * @param props The props of the component
 * @param props.id The id of the control
 * @param props.label The label content
 * @param props.required Whether the field is required
 * @param props.errorMessage The error message
 * @param props.labelPlacementTop Whether the label sits above the control
 * @param props.noMargins Whether to render the control alone
 * @param props.children The control
 * @returns The corresponding React element
 */
const Field: React.FC<FieldProps> = ({
  id,
  label,
  required,
  errorMessage,
  labelPlacementTop,
  noMargins,
  children,
}) => {
  const generatedId = useId();
  const controlId = id || generatedId;
  const errorId = controlId + '-error';
  const invalid = !!errorMessage;
  const showLabel = !noMargins && label !== undefined;

  const control = useMemo(() => ({
    id: controlId,
    invalid,
    describedBy: invalid ? errorId : undefined,
  }), [controlId, invalid, errorId]);

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
          htmlFor={controlId}
        />
      )}
      <div className={inputClass}>
        <FieldContext.Provider value={control}>
          {children}
        </FieldContext.Provider>
        {invalid && <span id={errorId}>{errorMessage}</span>}
      </div>
    </div>
  );
};

export default Field;
