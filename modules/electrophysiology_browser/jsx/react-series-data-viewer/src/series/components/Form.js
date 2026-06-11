import React, {Component, useEffect} from 'react';
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
  let elementClass = props.noMargins ? props.elementClass : 'row form-group';
  let useOptionGroups = props.useOptionGroups;

  // Add required asterisk
  if (required) {
    requiredHTML = <span key={`text-danger-${props.key}`} className="text-danger">*</span>;
  }

  // Add empty option
  if (props.emptyOption) {
    emptyOptionHTML = <option key={`empty-${props.key}`}>{props.emptyText}</option>;
  }

  // Add error message
  if (props.hasError) {
    errorMessage = <span key={`error-message-${props.key}`}>{props.errorMessage}</span>;
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
      const optGroups = new Set(options.map((opt) => opt.optgroup));

      optionList = Array.from(optGroups).sort().map((optGroup) => {
        return (
          <optgroup key={`optgroup-${optGroup}`} label={optGroup}>
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

  if (props.placeholder !== '') {
    optionList.unshift(<option key={props.placeholder} value={''} selected={true}>
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
  if (props.label && props.label !== '') {
    label = (
      <label
        key={`label-${props.key}`}
        className={
          props.noMargins
            ? ''
            : 'col-sm-5 control-label'
        }
        htmlFor={props.label}
      >
        {props.label}
        {requiredHTML}
      </label>
    );
    // inputClass = 'col-sm-12';

  }

  return (
    <div
      key={`opt-container-${props.name}`}
      className={elementClass}
      style={{ marginBottom: '5px' }}
    >
      {label}
      <div key={`opt-inner-${props.name}`} className={inputClass}>
        <select
          key={`opt-${props.name}`}
          name={props.name}
          multiple={multiple}
          className={
            "form-control input-sm " + (
              (
                props.emptyOption &&
                props.emptyTextClass.length > 0 &&
                [props.emptyText, ''].includes(value)
              )
                ? props.emptyTextClass
                : ''
            )
          }
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
  let elementClass = props.elementClass ?? 'row form-group';

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
            : 'col-sm-5 control-label'
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
            : 'col-sm-12'
        }>
        <input
          type="number"
          className={props.inputClass ?? "form-control input-sm"}
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

  // Add required asterisk
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
  const elementClass = props.elementClass ?? 'row form-group';
  const labelClass = props.labelClass ?? "col-sm-7 control-label";
  const inputClass = props.inputClass ?? "col-sm-12";
  const labelOuterClass = props.labelOuterClass ?? "";
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
          className={props.className ?? (props.readonly ? 'readonly' : null)}
          placeholder={props.placeholder}
          readOnly={props.readonly}
          disabled={props.disabled ?? false}
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
  labelClass: PropTypes.string,
  elementClass: PropTypes.string,
  inputClass: PropTypes.string,
  labelOuterClass: PropTypes.string,
};

/**
 * Checkbox Component
 * React wrapper for a <input type="checkbox"> element.
 */
export const CheckboxElement = (props) => {
  /**
   * handleChange - input change by user.
   *
   * @param {object} event - input event
   */
  const handleChange = (event) => {
    const checked = event.target.checked;
    props.onUserInput(props.name, checked);
  };

  let disabled = props.disabled ? 'disabled' : null;
  let required = props.required ? 'required' : null;
  let errorMessage = null;
  let requiredHTML = null;
  let elementClass = props.class + ' ' + props.offset;
  const divStyle = props.class === 'checkbox-inline'
    ? {}
    : {display: 'inline-block'};
  const outerStyles =  props.outerStyles ?? {};
  const innerLabelStyle =  props.innerLabelStyle ?? {};

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
  offset: 'col-sm-offset-3',
  class: 'checkbox-inline',
  elementClass: 'checkbox-inline col-sm-offset-3',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
};




/**
 * MultiSelect Dropdown component
 * Note this is only used in DQT
 * For generic SelectDropdown, see Select in Form.js
 */
class SelectField extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.toggleCheckbox = this.toggleCheckbox.bind(this);
  }

  /**
   * Toggle checkbox
   */
  toggleCheckbox() {
    this.props.toggleCheckbox(this.props.label);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let checked = (this.props.checked) ? 'checked' : '';
    let input;
    if (this.props.multi) {
      input = (
        <input
          type="checkbox"
          value={this.props.label}
          checked={checked}
          onChange={this.toggleCheckbox}/>
      );
    }
    return (
      <li>
        <div className="col-xs-12">
          <label>
            {input} {this.props.label}
          </label>
        </div>
      </li>
    );
  }
}
SelectField.propTypes = {
  toggleCheckbox: PropTypes.func,
  label: PropTypes.string,
  checked: PropTypes.bool,
  multi: PropTypes.bool,
};

/**
 * Search Field React component
 */
class SearchField extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.clearFilter = this.cleaFilter.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
  }

  /**
   * Clear the filter
   */
  clearFilter() {
    this.props.updateFilter('');
  }

  /**
   * Update the filter
   * with the event target value
   *
   * @param {object} event
   */
  updateFilter(event) {
    this.props.updateFilter(event.target.value);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <li className="dropdownSearch">
        <div className="input-group col-xs-12">
          <span className="input-group-addon">
            <span className="glyphicon glyphicon-search"></span>
          </span>
          <input
            type="text"
            className="form-control"
            onChange={this.updateFilter}
            value={this.props.filter}
          />
          <span className="input-group-addon" onClick={this.clearFilter}>
            <span className="glyphicon glyphicon-remove"></span>
          </span>
        </div>
      </li>
    );
  }
}
SearchField.propTypes = {
  updateFilter: PropTypes.func,
  filter: PropTypes.string,
};

/**
 * Select Dropdown React component
 */
export class SelectDropdown extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      filter: '',
      open: false,
      options: {
        V01: 'false',
        V02: 'true',
      },
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.deselectAll = this.deselectAll.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.overlayClickHandler = this.overlayClickHandler.bind(this);
  }

  /**
   * Close Dropdown if overlay clicked.
   */
  overlayClickHandler() {
    if (this.state.open) {
      this.toggleDropdown();
    }
  }

  /**
   * Toggle Dropdown
   */
  toggleDropdown() {
    let open = !this.state.open;
    this.setState({open});
  }

  /**
   * Toggle the checkbox
   *
   * @param {string} key
   */
  toggleCheckbox(key) {
    if (this.props.multi) {
      let action = (this.props.options[key]) ? 'uncheck' : 'check';
      this.props.onFieldClick(key, action);
    } else {
      this.props.onFieldClick(key);
      this.toggleDropdown();
    }
  }

  /**
   * Select all options
   */
  selectAll() {
    this.props.onToggleAll('check');
    // for (let option in this.props.options) {
    //   if (!this.props.options[option]) {
    //     this.props.onFieldClick(option, 'check');
    //   }
    // }
  }

  /**
   * Deselect all options
   */
  deselectAll() {
    this.props.onToggleAll('uncheck');
    // for (let option in this.props.options) {
    //   if (this.props.options[option]) {
    //     this.props.onFieldClick(option, 'uncheck');
    //   }
    // }
  }

  /**
   * Update the filter React component variable
   * with the given parameter
   *
   * @param {string} filter
   */
  updateFilter(filter) {
    this.setState({filter});
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    let parentDivClass = 'btn-group col-xs-12';
    let selectLabel = t("{{numSelected}} Selected", {
      ns: 'electrophysiology_browser', numSelected: 0,
    });
    let selectCount = 0;
    let sizeCount = 0;
    let options = [];
    let key = '';
    let filter = '';

    if (this.state.open) {
      parentDivClass += ' open';
    }
    if (this.props.multi) {
      for (key in this.props.options) {
        // Make sure inherited properties are not checked
        // See http://eslint.org/docs/rules/guard-for-in
        if ({}.hasOwnProperty.call(this.props.options, key)) {
          sizeCount++;
          options.push(
            <SelectField
              key={key}
              label={key}
              checked={this.props.options[key]}
              toggleCheckbox={this.toggleCheckbox}
              multi={this.props.multi}
            />
          );
          if (this.props.options[key]) {
            selectCount++;
          }
        }
      }
      if (selectCount === sizeCount) {
        options.unshift(
          <SelectField
            key="selectAll"
            label={t("Select All", {ns: 'electrophysiology_browser'})}
            checked={true}
            toggleCheckbox={this.deselectAll}
            multi={this.props.multi}
          />
        );
      } else {
        options.unshift(
          <SelectField
            key="selectAll"
            label={t("Select All", {ns: 'electrophysiology_browser'})}
            checked={false}
            toggleCheckbox={this.selectAll}
            multi={this.props.multi}
          />
        );
      }
      if (selectCount > 0) {
        selectLabel = t("{{numSelected}} Selected", {
          ns: 'electrophysiology_browser', numSelected: selectCount,
        });
      }
    } else {
      for (key in this.props.options) {
        // Make sure inherited properties are not checked
        // See http://eslint.org/docs/rules/guard-for-in
        if ({}.hasOwnProperty.call(this.props.options, key)) {
          filter = this.state.filter.toLowerCase();
          if (key.toLowerCase().indexOf(filter) === -1 &&
            this.props.options[key].toLowerCase().indexOf(filter)) {
            continue;
          }
          options.push(
            <SelectField
              key={key}
              label={this.props.options[key]}
              checked={this.props.options[key]}
              toggleCheckbox={this.toggleCheckbox}
              multi={this.props.multi}
            />
          );
        }
      }
      options.unshift(
        <SearchField
          updateFilter={this.updateFilter}
          filter={this.state.filter}
        />
      );
      if (this.props.selectedCategory === '') {
        selectLabel = t('Select One', {
          ns: 'electrophysiology_browser',
        });
      } else {
        selectLabel = this.props.selectedCategory;
      }
    }
    const overlay = this.state.open ? (
      <div style={{
        top: 0,
        left: 0,
        zIndex: 100,
        position: 'fixed',
        width: 'calc(100vw)',
        height: 'calc(100vh)',
      }} onClick={this.overlayClickHandler}
      />
    ) : null;
    return (
      <>
        <div className={parentDivClass}>
          <button type="button"
                  className="btn btn-default dropdown-toggle btn-dropdown-toggle col-xs-12"
                  onClick={this.toggleDropdown}>
            <div className="col-xs-10">
                <span className="pull-left">
                  {selectLabel}
                </span>
            </div>
            <div className="pull-right">
              <span className="glyphicon glyphicon-menu-down"></span>
            </div>
          </button>
          <ul className="dropdown-menu">
            {options}
          </ul>
        </div>
        {overlay}
      </>
    );
  }
}
SelectDropdown.propTypes = {
  multi: PropTypes.bool,
  options: PropTypes.object,
  onFieldClick: PropTypes.func,
  onToggleAll: PropTypes.func,
  selectedCategory: PropTypes.string,
  t: PropTypes.func,
};
