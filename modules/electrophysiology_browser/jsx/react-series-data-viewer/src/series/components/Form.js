import React from 'react';
import PropTypes from 'prop-types';

export const SelectElement = (props) => {
  const handleChange = (e) => {
    let value = e.target.value;
    let options = e.target.options;
    const numOfOptions = options.length;

    // Multiple values
    if (props.multiple && numOfOptions > 1) {
      value = [];
      for (let i = 0, l = numOfOptions; i < l; i++) {
        if (options[i].selected) {
          value.push(options[i].value);
        }
      }
    }

    props.onUserInput(props.name, value);
  };

  let multiple = props.multiple ? 'multiple' : null;
  let required = props.required ? 'required' : null;
  let disabled = props.disabled ? 'disabled' : null;
  let sortByValue = props.sortByValue;
  let options = props.options;
  let disabledOptions = props.disabledOptions;
  let errorMessage = null;
  let emptyOptionHTML = null;
  let requiredHTML = null;
  let elementClass = props.noMargins ? '' : 'row form-group';
  let useOptionGroups = props.useOptionGroups;

  // Add required asterisk
  if (required) {
    requiredHTML = <span className="text-danger">*</span>;
  }

  // Add empty option
  if (props.emptyOption) {
    emptyOptionHTML = <option></option>;
  }

  // Add error message
  if (props.hasError) {
    errorMessage = <span>{props.errorMessage}</span>;
    elementClass = elementClass + ' has-error';
  }

  let newOptions = {};
  let optionList = [];
  if (sortByValue) {
    for (let key in options) {
      if (options.hasOwnProperty(key)) {
        newOptions[options[key]] = key;
      }
    }
    optionList = Object.keys(newOptions).sort().map(function(option) {
      let isDisabled = (newOptions[option] in disabledOptions);
      return (
        <option
          value={newOptions[option]}
          key={newOptions[option]}
          disabled={isDisabled}
        >
          {option}
        </option>
      );
    });
  } else {
    if (useOptionGroups) {
      const optGroups = new Set(options.map((opt) => opt.optgroup));

      optionList = Array.from(optGroups).sort().map((optGroup) => {
        return (
          <optgroup label={optGroup}>
            {
              options.filter((option) =>
                option.optgroup === optGroup
              ).map((opt) => {
                let isDisabled = (opt in disabledOptions);
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
      optionList = options.map(function(option) {
        let isDisabled = (option in disabledOptions);
        return (
          <option
            value={option.value}
            key={option.label}
            disabled={isDisabled}
          >
            {option.value}
          </option>
        );
      });
    }
  }

  if (props.placeholder !== '') {
    optionList.unshift(<option value={''} selected={true}>
      {props.placeholder}
    </option>);
  }

  // Default to empty string for regular select and to empty array for 'multiple' select
  const value = props.value || (multiple ? [] : '');

  // Label prop needs to be provided to render label
  // (including empty label i.e. <SelectElement label='' />)
  // and retain formatting. If label prop is not provided at all, the input
  // element will take up the whole row.
  let label = null;
  let inputClass = props.noMargins ? '' : 'col-sm-12';
  if (props.label && props.label != '') {
    label = (
      <label className="col-sm-5 control-label" htmlFor={props.label}>
        {props.label}
        {requiredHTML}
      </label>
    );
    inputClass = 'col-sm-12';
  }

  return (
    <div
      className={elementClass}
      style={{ marginBottom: '5px' }}
    >
      {label}
      <div className={inputClass}>
        <select
          name={props.name}
          multiple={multiple}
          className="form-control input-sm"
          id={props.id}
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
};

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
  hasError: false,
  errorMessage: 'The field is required!',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
  noMargins: false,
  placeholder: '',
  useOptionGroups: false,
};

export const NumericElement = (props) => {

  const handleChange = (e) => {
    props.onUserInput(props.name, e.target.value);
  };

  const {disabled, required} = props;
  let requiredHTML = required ? <span className="text-danger">*</span> : null;
  let errorMessage = null;
  let elementClass = 'row form-group';

  // Add error message
  if (props.hasError) {
    errorMessage = <span>{props.errorMessage}</span>;
    elementClass = elementClass + ' has-error';
  }

  return (
    <div className={elementClass}>
      <label className="col-sm-5 control-label" htmlFor={props.id}>
        {props.label}
        {requiredHTML}
      </label>
      <div className="col-sm-12">
        <input
          type="number"
          className="form-control input-sm"
          name={props.name}
          id={props.id}
          min={props.min}
          max={props.max}
          value={props.value || ''}
          disabled={disabled}
          required={required}
          onChange={handleChange}
        />
        {errorMessage}
      </div>
    </div>
  );
};

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
  onUserInput: PropTypes.func,
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
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
};

export const TextareaElement = (props) => {
  const handleChange = (e) => {
    props.onUserInput(props.name, e.target.value);
  };

  let disabled = props.disabled ? 'disabled' : null;
  let required = props.required ? 'required' : null;
  let requiredHTML = null;

  // Add required asterix
  if (required) {
    requiredHTML = <span className="text-danger">*</span>;
  }

  return (
    <div className="row form-group">
      <label className="col-sm-5 control-label" htmlFor={props.id}>
        {props.label}
        {requiredHTML}
      </label>
      <div className="col-sm-12">
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
};

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
export const TextboxElement = (props) => {
  /**
   * handleChange - input change by user.
   *
   * @param {object} event - input event
   */
  const handleChange = (event) => {
    const value = event.target.value;
    if (props.bannedCharacters) {
      for (const character of props.bannedCharacters) {
        if (value.includes(character)) {
          return;
        }
      }
    }
    props.onUserInput(props.id, value);
  };

  const {disabled, required} = props;
  let requiredHTML = required ? <span className="text-danger">*</span> : null;
  let errorMessage = null;
  let elementClass = 'row form-group';

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for component.
   */
  return (
    <div className={elementClass}>
      {props.label &&
        <label className="col-sm-7 control-label" htmlFor={props.id}>
          {props.label}
          {requiredHTML}
        </label>
      }
      <div className="col-sm-12">
        <input
          type='text'
          id={props.id}
          name={props.name}
          value={props.value}
          onChange={handleChange}
          className={props.readonly ? 'readonly' : null}
          placeholder={props.placeholder}
          readOnly={props.readonly}
        />
        {errorMessage}
      </div>
    </div>
  );
};
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
};
