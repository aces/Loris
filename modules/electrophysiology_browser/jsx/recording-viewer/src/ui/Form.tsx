import React, {useState} from 'react';
import PropTypes from 'prop-types';
import type {TFunction} from 'i18next';

type InputValue = string | number | readonly string[];
type UserInputHandler<T> = (name: string, value: T) => void;

type FormElementProps = {
  name?: string;
  id?: string;
  label?: React.ReactNode;
  value?: InputValue | boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  elementClass?: string;
  inputClass?: string;
  labelClass?: string;
  labelOuterClass?: string;
  noMargins?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  placeholder?: string | number;
  readonly?: boolean;
};

type SelectOption = {
  type?: string;
  value: string | number;
  label?: string;
  optgroup?: string;
};
type SelectElementBaseProps = FormElementProps & {
  options?: SelectOption[] | Record<string, string>;
  disabledOptions?: Record<string, unknown>;
  sortByValue?: boolean;
  emptyOption?: boolean;
  emptyText?: string;
  emptyTextClass?: string;
  useOptionGroups?: boolean;
};
type SelectElementProps = SelectElementBaseProps & (
  | {multiple: true; onUserInput?: UserInputHandler<string[]>}
  | {multiple?: false; onUserInput?: UserInputHandler<string>}
);

/** Default user input. */
const defaultUserInput = () => {
  console.warn('onUserInput() callback is not set');
};

/** Select element component. */
export function SelectElement({
  name = '', options = [], disabledOptions = {}, value: suppliedValue,
  id, multiple = false, disabled = false, required = false,
  sortByValue = true, emptyOption = true, emptyText = '',
  emptyTextClass = '', hasError = false,
  errorMessage: suppliedErrorMessage = 'The field is required!',
  onUserInput = defaultUserInput, noMargins = false, placeholder = '',
  useOptionGroups = false, label, elementClass: suppliedElementClass,
}: SelectElementProps) {
  /** Handle change. */
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const options = e.target.options;
    const numOfOptions = options.length;

    // Multiple values
    if (multiple && numOfOptions > 1) {
      const values: string[] = [];
      for (let i = 0, l = numOfOptions; i < l; i++) {
        if (options[i].selected) {
          values.push(options[i].value);
        }
      }
      (onUserInput as UserInputHandler<string[]>)(name, values);
      return;
    }
    (onUserInput as UserInputHandler<string>)(name, value);
  };

  let errorMessage: React.ReactNode = null;
  let emptyOptionHTML: React.ReactNode = null;
  let requiredHTML: React.ReactNode = null;
  let elementClass = noMargins
    ? suppliedElementClass
    : 'recording-form-field form-group';

  // Add required asterisk
  if (required) {
    requiredHTML = <span className="text-danger">*</span>;
  }

  // Add empty option
  if (emptyOption) {
    emptyOptionHTML = <option key="empty">{emptyText}</option>;
  }

  // Add error message
  if (hasError) {
    errorMessage = <span>{suppliedErrorMessage}</span>;
    elementClass = elementClass + ' has-error';
  }

  const newOptions: Record<string, string> = {};
  let optionList: React.ReactElement[] = [];
  if (sortByValue) {
    for (const [key, option] of Object.entries(options)) {
      if (typeof option === 'string') {
        newOptions[option] = key;
      }
    }
    optionList = Object.keys(newOptions).sort().map(function(option) {
      const isDisabled = (newOptions[option] in disabledOptions);
      return (
        <option
          key={newOptions[option]}
          value={newOptions[option]}
          disabled={isDisabled}
        >
          {option}
        </option>
      );
    });
  } else {
    if (useOptionGroups) {
      const groupedOptions = Array.isArray(options) ? options : [];
      const optGroups = new Set(groupedOptions.map((opt) => opt.optgroup || ''));

      optionList = Array.from(optGroups).sort().map((optGroup) => {
        return (
          <optgroup key={`optgroup-${optGroup}`} label={optGroup}>
            {
              groupedOptions.filter((option) =>
                option.optgroup === optGroup
              ).map((opt) => {
                const isDisabled = opt.label ? opt.label in disabledOptions : false;
                return (
                  <option
                    value={opt.label}
                    key={opt.label}
                    disabled={isDisabled}
                  >
                    {opt.label}
                  </option>
                );
              })
            }
          </optgroup>
        );
      });
    } else {
      const listOptions = Array.isArray(options) ? options : [];
      optionList = listOptions.map(function(option) {
        const isDisabled = String(option.value) in disabledOptions;
        return (
          <option
            key={option.type}
            value={option.value}
            disabled={isDisabled}
          >
            {option.value}
          </option>
        );
      });
    }
  }

  if (placeholder !== '') {
    optionList.unshift(<option key={String(placeholder)} value="">
      {placeholder}
    </option>);
  }

  // Default to empty string for regular select and to empty array for 'multiple' select
  const value = (suppliedValue as string | readonly string[] | undefined) ||
    (multiple ? [] : '');

  // Label prop needs to be provided to render label
  // (including empty label i.e. <SelectElement label='' />)
  // and retain formatting. If label prop is not provided at all, the input
  // element will take up the whole row.
  let labelElement: React.ReactNode = null;
  const inputClass = noMargins ? '' : 'recording-form-input';
  if (label !== undefined && label !== '') {
    labelElement = (
      <label
        className={
          noMargins
            ? ''
            : 'control-label'
        }
        htmlFor={typeof label === 'string' ? label : undefined}
      >
        {label}
        {requiredHTML}
      </label>
    );
  }

  return (
    <div
      className={elementClass}
      style={{marginBottom: '5px'}}
    >
      {labelElement}
      <div className={inputClass}>
        <select
          name={name}
          multiple={multiple}
          className={
            'form-control input-sm ' + (
              (
                emptyOption && emptyTextClass.length > 0 &&
                typeof value === 'string' && [emptyText, ''].includes(value)
              )
                ? emptyTextClass
                : ''
            )
          }
          id={id}
          value={value}
          onChange={handleChange}
          required={required}
          disabled={disabled}
        >
          {emptyOptionHTML}
          {optionList}
        </select>
        {errorMessage}
      </div>
    </div>
  );
}

SelectElement.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  disabledOptions: PropTypes.object,
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  id: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  emptyOption: PropTypes.bool,
  emptyText: PropTypes.string,
  emptyTextClass: PropTypes.string,
  hasError: PropTypes.bool,
  errorMessage: PropTypes.string,
  onUserInput: PropTypes.func,
  noMargins: PropTypes.bool,
  placeholder: PropTypes.string,
  useOptionGroups: PropTypes.bool,
};

SelectElement.defaultProps = {
  name: '',
  options: [],
  disabledOptions: {},
  value: undefined,
  id: null,
  multiple: false,
  disabled: false,
  required: false,
  sortByValue: true,
  emptyOption: true,
  emptyText: '',
  emptyTextClass: '',
  hasError: false,
  errorMessage: 'The field is required!',
  /** On user input. */
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
  noMargins: false,
  placeholder: '',
  useOptionGroups: false,
};

type NumericElementProps = Omit<FormElementProps, 'value'> & {
  value?: string | number;
  min?: number;
  max?: number;
  onUserInput?: UserInputHandler<string>;
};

/** Numeric element component. */
export function NumericElement(props: NumericElementProps) {
  /** Handle change. */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    (props.onUserInput ?? defaultUserInput)(props.name ?? '', e.target.value);
  };

  const {disabled, required} = props;
  const requiredHTML = required ? <span className="text-danger">*</span> : null;
  let errorMessage = null;
  let elementClass = props.elementClass ?? 'recording-form-field form-group';

  // Add error message
  if (props.hasError) {
    errorMessage = <span>{props.errorMessage}</span>;
    elementClass = elementClass + ' has-error';
  }

  return (
    <div className={elementClass}>
      <label
        className={
          props.noMargins
            ? ''
            : 'control-label'
        }
        htmlFor={props.id}
      >
        {props.label}
        {requiredHTML}
      </label>
      <div
        className={
          props.noMargins
            ? ''
            : 'recording-form-input'
        }>
        <input
          type="number"
          className={props.inputClass ?? 'form-control input-sm'}
          name={props.name}
          id={props.id}
          min={props.min}
          max={props.max}
          value={props.value}
          disabled={disabled}
          required={required}
          onChange={handleChange}
        />
        {errorMessage}
      </div>
    </div>
  );
}

NumericElement.propTypes = {
  name: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  hasError: PropTypes.bool,
  noMargins: PropTypes.bool,
  onUserInput: PropTypes.func,
  inputClass: PropTypes.string,
};

NumericElement.defaultProps = {
  name: '',
  min: null,
  max: null,
  label: '',
  value: '',
  id: null,
  required: false,
  disabled: false,
  hasError: false,
  noMargins: false,
  /** On user input. */
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
};

type TextareaElementProps = Omit<FormElementProps, 'value'> & {
  value?: string;
  rows?: number;
  cols?: number;
  onUserInput?: UserInputHandler<string>;
};

/** Textarea element component. */
export function TextareaElement(props: TextareaElementProps) {
  /** Handle change. */
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    (props.onUserInput ?? defaultUserInput)(props.name ?? '', e.target.value);
  };

  const disabled = props.disabled ?? false;
  const required = props.required ?? false;
  let requiredHTML = null;

  // Add required asterisk
  if (required) {
    requiredHTML = <span className="text-danger">*</span>;
  }

  return (
    <div className="recording-form-field form-group">
      <label className="control-label" htmlFor={props.id}>
        {props.label}
        {requiredHTML}
      </label>
      <div className="recording-form-input">
        <textarea
          cols={props.cols}
          rows={props.rows}
          className="form-control"
          name={props.name}
          id={props.id}
          value={props.value || ''}
          required={required}
          disabled={disabled}
          onChange={handleChange}
        >
        </textarea>
      </div>
    </div>
  );
}

TextareaElement.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  rows: PropTypes.number,
  cols: PropTypes.number,
  onUserInput: PropTypes.func,
};

TextareaElement.defaultProps = {
  name: '',
  label: '',
  value: '',
  id: null,
  disabled: false,
  required: false,
  rows: 4,
  cols: 25,
  /** On user input. */
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
};

/**
 * TextboxElement - the input type='text' component.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
type TextboxElementProps = Omit<FormElementProps, 'value'> & {
  value?: string | number;
  bannedCharacters?: string[];
  help?: string;
  onUserInput?: UserInputHandler<string>;
};

/** Textbox element component. */
export function TextboxElement(props: TextboxElementProps) {
  /**
   * handleChange - input change by user.
   *
   * @param {object} event - input event
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (props.bannedCharacters) {
      for (const character of props.bannedCharacters) {
        if (value.includes(character)) {
          return;
        }
      }
    }
    (props.onUserInput ?? defaultUserInput)(props.id ?? '', value);
  };

  const {disabled, required} = props;
  const requiredHTML = required ? <span className="text-danger">*</span> : null;
  const errorMessage = null;
  const elementClass = props.elementClass
    ?? 'recording-form-field form-group';
  const labelClass = props.labelClass ?? 'control-label';
  const inputClass = props.inputClass ?? 'recording-form-input';
  const labelOuterClass = props.labelOuterClass ?? '';
  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for component.
   */
  return (
    <div className={elementClass}>
      {props.label &&
        <div className={labelOuterClass}>
          <label className={labelClass} htmlFor={props.id}>
            {props.label}
            {requiredHTML}
          </label>
        </div>
      }
      <div className={inputClass}>
        <input
          type='text'
          id={props.id}
          name={props.name}
          value={props.value}
          onChange={handleChange}
          className={props.className ?? (props.readonly ? 'readonly' : undefined)}
          placeholder={props.placeholder === undefined
            ? undefined
            : String(props.placeholder)}
          readOnly={props.readonly}
          disabled={props.disabled ?? false}
        />
        {errorMessage}
      </div>
    </div>
  );
}
TextboxElement.defaultProps = {
  readonly: false,
  required: false,
};
TextboxElement.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onUserInput: PropTypes.func,
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  bannedCharacters: PropTypes.array,
  readonly: PropTypes.bool,
  help: PropTypes.string,
  labelClass: PropTypes.string,
  elementClass: PropTypes.string,
  inputClass: PropTypes.string,
  labelOuterClass: PropTypes.string,
};

/**
 * Checkbox Component
 * React wrapper for a <input type="checkbox"> element.
 */
type CheckboxElementProps = Omit<FormElementProps, 'value'> & {
  value?: boolean;
  class?: string;
  offset?: string;
  outerStyles?: React.CSSProperties;
  innerLabelStyle?: React.CSSProperties;
  onUserInput?: UserInputHandler<boolean>;
};

/** Checkbox element component. */
export function CheckboxElement(props: CheckboxElementProps) {
  /**
   * handleChange - input change by user.
   *
   * @param {object} event - input event
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    (props.onUserInput ?? defaultUserInput)(props.name ?? '', checked);
  };

  const disabled = props.disabled ? 'disabled' : null;
  const required = props.required ? 'required' : null;
  let errorMessage = null;
  let requiredHTML = null;
  let elementClass = (props.class ?? 'checkbox-inline') + ' ' +
    (props.offset ?? 'checkbox-indented');
  const divStyle = props.class === 'checkbox-inline'
    ? {}
    : {display: 'inline-block'};
  const outerStyles = props.outerStyles ?? {};
  const innerLabelStyle = props.innerLabelStyle ?? {};

  // Add required asterix
  if (required) {
    requiredHTML = <span className="text-danger">*</span>;
  }

  // Add error message
  if (props.errorMessage) {
    errorMessage = <span>{props.errorMessage}</span>;
    elementClass = elementClass + ' has-error';
  }


  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  return (
    <div className={elementClass} style={outerStyles}>
      <div>
        <label htmlFor={props.id} className={'checkbox-flex-label'}>
          <div style={divStyle}>
            <input
              type="checkbox"
              name={props.name}
              id={props.id}
              checked={props.value}
              required={props.required}
              disabled={props.disabled}
              onChange={handleChange}
            />
          </div>
          {errorMessage}
          <div style={innerLabelStyle}>
            {props.label}
            {requiredHTML}
          </div>
        </label>
      </div>
    </div>
  );
}
CheckboxElement.defaultProps = {
  readonly: false,
  required: false,
};
CheckboxElement.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.object.isRequired,
  value: PropTypes.bool.isRequired,
  id: PropTypes.string,
  class: PropTypes.string,
  offset: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  errorMessage: PropTypes.string,
  elementClass: PropTypes.string,
  onUserInput: PropTypes.func,
};

CheckboxElement.defaultProps = {
  id: null,
  disabled: false,
  required: false,
  errorMessage: '',
  offset: 'checkbox-indented',
  class: 'checkbox-inline',
  elementClass: 'checkbox-inline checkbox-indented',
  /** On user input. */
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
};


/**
 * MultiSelect Dropdown component
 * Note this is only used in DQT
 * For generic SelectDropdown, see Select in Form.js
 */
type SelectFieldProps = {
  toggleCheckbox: (label: string) => void;
  label: string;
  checked?: boolean;
  multi?: boolean;
};

/** Select field component. */
function SelectField(props: SelectFieldProps) {
  const checked = Boolean(props.checked);
  let input: React.ReactNode;
  if (props.multi) {
    input = (
      <input
        type="checkbox"
        value={props.label}
        checked={checked}
        onChange={() => props.toggleCheckbox(props.label)}/>
    );
  }
  return (
    <li>
      <label className='select-dropdown-option'>
        {input} {props.label}
      </label>
    </li>
  );
}
/**
 * Search Field React component
 */
type SearchFieldProps = {
  updateFilter: (filter: string) => void;
  filter: string;
};

/** Search field component. */
function SearchField(props: SearchFieldProps) {
  return (
    <li className="dropdownSearch">
      <div className="input-group">
        <span className="input-group-addon">
          <span className="glyphicon glyphicon-search"></span>
        </span>
        <input
          type="text"
          className="form-control"
          onChange={(event) => props.updateFilter(event.target.value)}
          value={props.filter}
        />
        <span className="input-group-addon"
          onClick={() => props.updateFilter('')}>
          <span className="glyphicon glyphicon-remove"></span>
        </span>
      </div>
    </li>
  );
}
/**
 * Select Dropdown React component
 */
type SelectDropdownProps = {
  multi?: boolean;
  options: Record<string, string | boolean>;
  onFieldClick: (key: string, action: string) => void;
  onToggleAll: (action: 'check' | 'uncheck') => void;
  selectedCategory?: string;
  t: TFunction;
};

/** Select dropdown component. */
export function SelectDropdown(props: SelectDropdownProps) {
  const [filterValue, setFilterValue] = useState('');
  const [open, setOpen] = useState(false);

  /**
   * Toggle the checkbox
   *
   * @param {string} key - Option key to toggle.
   */
  function toggleCheckbox(key: string) {
    if (props.multi) {
      const action = props.options[key] ? 'uncheck' : 'check';
      props.onFieldClick(key, action);
    } else {
      props.onFieldClick(key, 'check');
      setOpen(false);
    }
  }

  /**
   * Select all options
   */
  function selectAll() {
    props.onToggleAll('check');
    // for (let option in this.props.options) {
    //   if (!this.props.options[option]) {
    //     this.props.onFieldClick(option, 'check');
    //   }
    // }
  }

  /**
   * Deselect all options
   */
  function deselectAll() {
    props.onToggleAll('uncheck');
    // for (let option in this.props.options) {
    //   if (this.props.options[option]) {
    //     this.props.onFieldClick(option, 'uncheck');
    //   }
    // }
  }

  const {t} = props;
  let parentDivClass = 'btn-group select-dropdown';
  let selectLabel = t('{{numSelected}} Selected', {
    ns: 'electrophysiology_browser', numSelected: 0,
  });
  let selectCount = 0;
  let sizeCount = 0;
  const options: React.ReactElement[] = [];
  let key = '';
  let filter = '';

  if (open) {
    parentDivClass += ' open';
  }
  if (props.multi) {
    for (key in props.options) {
      // Make sure inherited properties are not checked
      // See http://eslint.org/docs/rules/guard-for-in
      if ({}.hasOwnProperty.call(props.options, key)) {
        sizeCount++;
        options.push(
          <SelectField
            key={key}
            label={key}
            checked={Boolean(props.options[key])}
            toggleCheckbox={toggleCheckbox}
            multi={props.multi}
          />
        );
        if (props.options[key]) {
          selectCount++;
        }
      }
    }
    if (selectCount === sizeCount) {
      options.unshift(
        <SelectField
          key="selectAll"
          label={t('Select All', {ns: 'electrophysiology_browser'})}
          checked={true}
          toggleCheckbox={deselectAll}
          multi={props.multi}
        />
      );
    } else {
      options.unshift(
        <SelectField
          key="selectAll"
          label={t('Select All', {ns: 'electrophysiology_browser'})}
          checked={false}
          toggleCheckbox={selectAll}
          multi={props.multi}
        />
      );
    }
    if (selectCount > 0) {
      selectLabel = t('{{numSelected}} Selected', {
        ns: 'electrophysiology_browser', numSelected: selectCount,
      });
    }
  } else {
    for (key in props.options) {
      // Make sure inherited properties are not checked
      // See http://eslint.org/docs/rules/guard-for-in
      if ({}.hasOwnProperty.call(props.options, key)) {
        filter = filterValue.toLowerCase();
        const optionLabel = String(props.options[key]);
        if (key.toLowerCase().indexOf(filter) === -1 &&
            optionLabel.toLowerCase().indexOf(filter) === -1) {
          continue;
        }
        options.push(
          <SelectField
            key={key}
            label={optionLabel}
            checked={Boolean(props.options[key])}
            toggleCheckbox={toggleCheckbox}
            multi={props.multi}
          />
        );
      }
    }
    options.unshift(
      <SearchField
        updateFilter={setFilterValue}
        filter={filterValue}
      />
    );
    if (props.selectedCategory === '') {
      selectLabel = t('Select One', {
        ns: 'electrophysiology_browser',
      });
    } else {
      selectLabel = props.selectedCategory ?? '';
    }
  }
  const overlay = open ? (
    <div style={{
      top: 0,
      left: 0,
      zIndex: 100,
      position: 'fixed',
      width: 'calc(100vw)',
      height: 'calc(100vh)',
    }} onClick={() => setOpen(false)}
    />
  ) : null;
  return (
    <>
      <div className={parentDivClass}>
        <button type="button"
          className="btn btn-default dropdown-toggle btn-dropdown-toggle"
          onClick={() => setOpen((wasOpen) => !wasOpen)}>
          <span className='select-dropdown-label'>{selectLabel}</span>
          <span aria-hidden='true'>
            <span className="glyphicon glyphicon-menu-down"></span>
          </span>
        </button>
        <ul className="dropdown-menu">
          {options}
        </ul>
      </div>
      {overlay}
    </>
  );
}
