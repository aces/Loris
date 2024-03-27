/**
 * This file contains React components for Loris form elements.
 *
 * @author Loris Team
 * @version 1.0.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * Form Component.
 * React wrapper for <form> element that accepts children react components
 *
 * The form elements can be passed in two ways:
 * 1. A `this.props.formElements` JSON object
 * 2. Form components nested directly inside <FormElement></FormElement>
 *
 * Note that if both are passed `this.props.formElements` is displayed first.
 *
 */
export class FormElement extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.getFormElements = this.getFormElements.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Get form elements
   *
   * @return {JSX[]} - An array of element React markup
   */
  getFormElements() {
    const formElementsHTML = [];
    const columns = this.props.columns;
    const maxColumnSize = 12;
    const colSize = Math.floor(maxColumnSize / columns);
    const colClass = 'col-xs-12 col-sm-' + colSize + ' col-md-' + colSize;

    // Render elements from JSON
    const filter = this.props.formElements;

    Object.keys(filter).forEach(function(objKey, index) {
      const userInput = this.props.onUserInput ?
        this.props.onUserInput :
        filter[objKey].onUserInput;
      const value = filter[objKey].value ? filter[objKey].value : '';
      formElementsHTML.push(
        <div key={'el_' + index} className={colClass}>
          <LorisElement
            element={filter[objKey]}
            onUserInput={userInput}
            value={value}
          />
        </div>
      );
    }.bind(this));

    // Render elements from React
    React.Children.forEach(this.props.children, function(child, key) {
      // If child is plain HTML, insert it as full size.
      // Useful for inserting <hr> to split form sections
      let elementClass = 'col-xs-12 col-sm-12 col-md-12';

      // If child is form element use appropriate size
      if (React.isValidElement(child) && typeof child.type === 'function') {
        elementClass = colClass;
      }
      formElementsHTML.push(
        <div key={'el_child_' + key} className={elementClass}>{child}</div>
      );
    });

    return formElementsHTML;
  }

  /**
   * Execute onSubmit
   *
   * @param {object} e - Event
   */
  handleSubmit(e) {
    // Override default submit if property is set
    if (this.props.onSubmit) {
      e.preventDefault();
      this.props.onSubmit(e);
    }
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let encType = this.props.fileUpload ? 'multipart/form-data' : null;

    // Generate form elements
    let formElements = this.getFormElements();

    // Flexbox is set to ensure that columns of different heights
    // are displayed proportionally on the screen
    let rowStyles = {
      display: 'flex',
      flexWrap: 'wrap',
    };

    return (
      <form
        name={this.props.name}
        id={this.props.id}
        className={this.props.class}
        method={this.props.method}
        action={this.props.action}
        encType={encType}
        onSubmit={this.handleSubmit}
      >
        <div className="row" style={rowStyles}>
          {formElements}
        </div>
      </form>
    );
  }
}

FormElement.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  method: PropTypes.oneOf(['POST', 'GET']),
  action: PropTypes.string,
  class: PropTypes.string,
  columns: PropTypes.number,
  formElements: PropTypes.shape({
    elementName: PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
    }),
  }),
  onSubmit: PropTypes.func,
  onUserInput: PropTypes.func,
  children: PropTypes.node,
  fileUpload: PropTypes.bool,
};

FormElement.defaultProps = {
  name: null,
  id: null,
  method: 'POST',
  action: undefined,
  class: 'form-horizontal',
  columns: 1,
  fileUpload: false,
  formElements: {},
  onSubmit: function() {
    console.warn('onSubmit() callback is not set!');
  },
};

/**
 * FieldsetElement Component.
 * React wrapper for <fieldset> element that is nested inside <FormElement></FormElement>,
 * and accepts child react components. A fieldset groups related elements in a form.
 *
 * The form elements can be passed by nesting Form components directly inside <FieldsetElement></FieldsetElement>.
 *
 */
export class FieldsetElement extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.getFormElements = this.getFormElements.bind(this);
  }

  /**
   * Get form elements
   *
   * @return {JSX[]} - An array of element React markup
   */
  getFormElements() {
    const formElementsHTML = [];
    const columns = this.props.columns;
    const maxColumnSize = 12;
    const colSize = Math.floor(maxColumnSize / columns);
    const colClass = 'col-xs-12 col-sm-' + colSize + ' col-md-' + colSize;

    // Render elements from React
    React.Children.forEach(this.props.children, function(child, key) {
      // If child is plain HTML, insert it as full size.
      // Useful for inserting <hr> to split form sections
      let elementClass = 'col-xs-12 col-sm-12 col-md-12';

      // If child is form element use appropriate size
      if (React.isValidElement(child) && typeof child.type === 'function') {
        elementClass = colClass;
      }
      formElementsHTML.push(
        <div key={'el_child_' + key} className={elementClass}>{child}</div>
      );
    });
    return formElementsHTML;
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    // Generate form elements
    let formElements = this.getFormElements();

    return (
      <fieldset
        name={this.props.name}
      >
        <legend>
          {this.props.legend}
        </legend>
        {formElements}
      </fieldset>
    );
  }
}

FieldsetElement.propTypes = {
  columns: PropTypes.number,
  name: PropTypes.string,
  legend: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  children: PropTypes.node,
};

FieldsetElement.defaultProps = {
  columns: 1,
  legend: 'Selection Filter',
};

/**
 * Search Component
 * React wrapper for a searchable dropdown
 */
export class SearchableDropdown extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {currentInput: ''};
    this.getKeyFromValue = this.getKeyFromValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  /**
   * Get key from value
   *
   * @param {string} value
   * @return {string}
   */
  getKeyFromValue(value) {
    let options = this.props.options;
    return Object.keys(options).find(function(o) {
      return options[o] === value;
    });
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  handleChange(e) {
    let value = this.getKeyFromValue(e.target.value);
    // if not in strict mode and key value is undefined (i.e., not in options prop)
    // set value equal to e.target.value
    if (!this.props.strictSearch && value === undefined) {
      value = e.target.value;
    }
    this.setState({currentInput: e.target.value});
    this.props.onUserInput(this.props.name, value);
  }

  /**
   * Handle blur
   *
   * @param {object} e - Event
   */
  handleBlur(e) {
    // null out entry if not present in options in strict mode
    if (this.props.strictSearch) {
      let value = e.target.value;
      let options = this.props.options;
      if (Object.values(options).indexOf(value) === -1) {
        // empty string out both the hidden value as well as the input text
        this.setState({currentInput: ''});
        this.props.onUserInput(this.props.name, '');
      }
    }
  }

  /**
   * Called by React when the component is updated.
   *
   * @param {object} prevProps - Previous React Component properties
   */
  componentDidUpdate(prevProps) {
    // need to clear out currentInput for when props.value gets wiped
    // if the previous value prop contained data and the current one doesn't
    // clear currentInput
    if (prevProps.value && !this.props.value) {
      this.setState({currentInput: ''});
    }
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let required = this.props.required ? 'required' : null;
    let disabled = this.props.disabled ? 'disabled' : null;
    let sortByValue = this.props.sortByValue;
    let options = this.props.options;
    let strictMessage = 'Entry must be included in provided list of options.';
    let errorMessage = null;
    let requiredHTML = null;
    let elementClass = 'row form-group';

    // Add required asterix
    if (required) {
      requiredHTML = <span className="text-danger">*</span>;
    }

    // Add error message
    if (this.props.errorMessage) {
      errorMessage = <span>{this.props.errorMessage}</span>;
      elementClass = 'row form-group has-error';
    } else if (this.props.required && this.props.value === '') {
      let msg = 'This field is required!';
      msg += (this.props.strictSearch ? ' ' + strictMessage : '');
      errorMessage = <span>{msg}</span>;
      elementClass = 'row form-group has-error';
    } else if (this.props.strictSearch && this.props.value === '') {
      errorMessage = <span>{strictMessage}</span>;
      elementClass = 'row form-group has-error';
    }

    // determine value to place into text input
    let value = '';
    // use value in options if valid
    if (this.props.value !== undefined &&
      Object.keys(options).indexOf(this.props.value) > -1) {
      value = options[this.props.value];
      // else, use input text value
    } else if (this.state.currentInput) {
      value = this.state.currentInput;
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
        return (
          <option value={option} key={newOptions[option]}/>
        );
      });
    } else {
      optionList = Object.keys(options).map(function(option) {
        return (
          <option value={options[option]} key={option}/>
        );
      });
    }

    return (
      <div className={elementClass}>
        <label className="col-sm-3 control-label" htmlFor={this.props.label}>
          {this.props.label}
          {requiredHTML}
        </label>
        <div className="col-sm-9">
          <input
            type="text"
            name={this.props.name + '_input'}
            value={value}
            id={this.props.id}
            list={this.props.name + '_list'}
            className="form-control"
            disabled={disabled}
            placeholder={this.props.placeHolder}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            required={required}
          />
          <datalist id={this.props.name + '_list'}>
            {optionList}
          </datalist>
          {errorMessage}
        </div>
      </div>
    );
  }
}

SearchableDropdown.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  id: PropTypes.string,
  // strictSearch, if set to true, will require that only options
  // provided in the options prop can be submitted
  strictSearch: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  class: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  errorMessage: PropTypes.string,
  placeHolder: PropTypes.string,
  onUserInput: PropTypes.func,
  sortByValue: PropTypes.bool,
};

SearchableDropdown.defaultProps = {
  name: '',
  options: {},
  strictSearch: true,
  label: '',
  value: undefined,
  id: null,
  class: '',
  disabled: false,
  required: false,
  sortByValue: true,
  errorMessage: '',
  placeHolder: '',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
};

/**
 * Select Component
 * React wrapper for a simple or 'multiple' <select> element.
 */
export class SelectElement extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Call onUserInput on component rendered to select only option
   * if autoSelect prop is set to true
   */
  componentDidMount() {
    const optionsArray = Object.keys(this.props.options);
    if (this.props.autoSelect && optionsArray.length === 1) {
      this.props.onUserInput(this.props.name, optionsArray[0]);
    }
  }

  /**
   * On component update, if number of options dynamically
   * changes to 1, call onUserInput to select only option
   * if autoSelect prop is set to true
   *
   * @param {object} prevProps - component props before component update
   */
  componentDidUpdate(prevProps) {
    const options = Object.keys(this.props.options);
    const prevOptions = Object.keys(prevProps.options);
    if (options.length !== prevOptions.length ||
        !options.every((v, i) => v === prevOptions[i])) {
      if (this.props.autoSelect && options.length === 1) {
        this.props.onUserInput(this.props.name, options[0]);
      }
    }
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  handleChange(e) {
    let value = null;
    let options = e.target.options;
    const numOfOptions = options.length;

    // Multiple values
    if (this.props.multiple) {
      value = [];
      for (let i = 0, l = numOfOptions; i < l; i++) {
        if (options[i].selected) {
          value.push(options[i].value);
        }
      }
    } else {
      value = e.target.value;
    }

    this.props.onUserInput(this.props.name, value);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let multiple = this.props.multiple ? 'multiple' : null;
    let required = this.props.required ? 'required' : null;
    let disabled = this.props.disabled ? 'disabled' : null;
    let sortByValue = this.props.sortByValue;
    let options = this.props.options;
    let disabledOptions = this.props.disabledOptions;
    let errorMessage = null;
    let emptyOptionHTML = null;
    let requiredHTML = null;
    let elementClass = this.props.noMargins ? '' : 'row form-group';

    // Add required asterisk
    if (required) {
      requiredHTML = <span className="text-danger">*</span>;
    }

    // Add empty option
    if (this.props.emptyOption) {
      emptyOptionHTML = <option></option>;
    }

    // Add error message
    if (this.props.hasError
       || (this.props.required && this.props.value === '')
    ) {
      errorMessage = <span>{this.props.errorMessage}</span>;
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
      optionList = Object.keys(options).map(function(option) {
        let isDisabled = (option in disabledOptions);
        return (
          <option
            value={option}
            key={option}
            disabled={isDisabled}
          >
            {options[option]}
          </option>
        );
      });
    }

    if (this.props.placeholder !== '') {
      optionList.unshift(<option value={''}>
        {this.props.placeholder}
      </option>);
    }

    // Default to empty string for regular select and to empty array for 'multiple' select
    const value = this.props.value || (multiple ? [] : '');

    // Label prop needs to be provided to render label
    // (including empty label i.e. <SelectElement label='' />)
    // and retain formatting. If label prop is not provided at all, the input
    // element will take up the whole row.
    let label = null;
    let inputClass = this.props.noMargins ? '' : 'col-sm-12';
    if (this.props.label && this.props.label != '') {
      label = (
        <label className="col-sm-3 control-label" htmlFor={this.props.label}>
          {this.props.label}
          {requiredHTML}
        </label>
      );
      inputClass = 'col-sm-9';
    }

    return (
      <div className={elementClass}>
        {label}
        <div className={inputClass}>
          <select
            name={this.props.name}
            multiple={multiple}
            className="form-control"
            id={this.props.id}
            value={value}
            onChange={this.handleChange}
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
}

SelectElement.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
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
  autoSelect: PropTypes.bool,
  hasError: PropTypes.bool,
  errorMessage: PropTypes.string,
  onUserInput: PropTypes.func,
  noMargins: PropTypes.bool,
  placeholder: PropTypes.string,
  sortByValue: PropTypes.bool,
};

SelectElement.defaultProps = {
  name: '',
  options: {},
  disabledOptions: {},
  value: undefined,
  id: null,
  multiple: false,
  disabled: false,
  required: false,
  sortByValue: true,
  emptyOption: true,
  autoSelect: true,
  hasError: false,
  errorMessage: 'The field is required!',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
  noMargins: false,
  placeholder: '',
};

/**
 * Tags Component
 * Allows for multiple values to be entered for a single field
 *
 * Comes in 3 flavors:
 * 1: If options are passed and useSearch = true
 *    input field is rendered as a searchable dropdown
 * 2: If only options are passed, input is rendered as
 *    a normal dropdown select
 * 3: Without options, input is a normal, free text input
 */
export class TagsElement extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.getKeyFromValue = this.getKeyFromValue.bind(this);
    this.canAddItem = this.canAddItem.bind(this);
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  handleChange(e) {
    // pendingValKey is the placeholder variable for temporarily storing
    // typed or selected items before adding them to the Tags
    this.props.onUserInput(this.props.pendingValKey, e.target.value);
  }

  /**
   * Handle key press
   *
   * @param {object} e - Event
   */
  handleKeyPress(e) {
    // also add tags if enter key is hit within input field
    if (e.keyCode === 13 || e.which === 13) {
      e.preventDefault();
      this.handleAdd();
    }
  }

  /**
   * Handle add
   */
  handleAdd() {
    let options = this.props.options;
    let value = this.props.value;
    // if using a datalist (search), set value to be the key in options
    if (this.props.useSearch && Object.values(options).indexOf(value) > -1) {
      value = this.getKeyFromValue(value);
    }
    if (this.canAddItem(value)) {
      // send pendingValKey as an argument in order to null out entered item
      this.props.onUserAdd(this.props.name, value, this.props.pendingValKey);
    }
  }

  /**
   * Handle remove
   *
   * @param {object} e -  Event
   */
  handleRemove(e) {
    let value = e.target.getAttribute('data-item');
    this.props.onUserRemove(this.props.name, value);
  }

  /**
   * Get key from value
   *
   * @param {string} value
   * @return {string}
   */
  getKeyFromValue(value) {
    let options = this.props.options;
    return Object.keys(options).find(function(o) {
      return options[o] === value;
    });
  }

  /**
   * Helper function to detect
   * if item should be added to Tags
   *
   * @param {string} value
   * @return {boolean}
   */
  canAddItem(value) {
    let result = true;
    // reject empty values
    if (!value) {
      result = false;
      // reject if allowDupl is false and item is already in array
    } else if (!this.props.allowDupl && this.props.items.indexOf(value) > -1) {
      result = false;
      // reject if using a strict datalist and value is not in options
    } else if (this.props.useSearch &&
      this.props.strictSearch &&
      Object.keys(this.props.options).indexOf(value) === -1
    ) {
      result = false;
    }

    return result;
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let disabled = this.props.disabled ? 'disabled' : null;
    let requiredHTML = null;
    let emptyOptionHTML = null;
    let errorMessage = null;
    let elementClass = 'row form-group';
    // Add required asterix
    if (this.props.required) {
      requiredHTML = <span className="text-danger">*</span>;
    }

    // Add empty option
    if (this.props.emptyOption) {
      emptyOptionHTML = <option></option>;
    }

    if (this.props.errorMessage) {
      errorMessage = <span>{this.props.errorMessage}</span>;
      elementClass = 'row form-group has-error';
    }

    let input;
    let options = this.props.options;
    // if options are given and useSearch is specified
    if (Object.keys(options).length > 0 && this.props.useSearch) {
      input = (
        <div>
          <input
            type="text"
            name={this.props.name}
            id={this.props.id}
            list={this.props.id + '_list'}
            className="form-control"
            value={this.props.value || ''}
            disabled={disabled}
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
          />
          <datalist id={this.props.id + '_list'}>
            {Object.keys(options).map(function(option) {
              return (
                <option value={options[option]} key={option}>
                  {options[option]}
                </option>
              );
            })}
          </datalist>
        </div>
      );
      // if options are present but useSearch is false, use normal dropdown
    } else if (Object.keys(options).length > 0) {
      input = <select
        name={this.props.name}
        className="form-control"
        id={this.props.id}
        value={this.props.value}
        disabled={disabled}
        onChange={this.handleChange}
        onKeyPress={this.handleKeyPress}
      >
        {emptyOptionHTML}
        {Object.keys(options).map(function(option) {
          return (
            <option value={option} key={option}>{options[option]}</option>
          );
        })}
      </select>;
      // else, use a text input by default
    } else {
      input = <input
        type="text"
        name={this.props.name}
        id={this.props.id}
        className="form-control"
        value={this.props.value || ''}
        disabled={disabled}
        onChange={this.handleChange}
        onKeyPress={this.handleKeyPress}
      />;
    }

    // iterate through added Tags items and render them
    // with deletion button
    let items = this.props.items.map(function(item) {
      let itmTxt;
      // in event that the passed item is a key of options,
      // render option value
      if (Object.keys(options).length > 0 && options[item] !== undefined) {
        itmTxt = options[item];
        // otherwise just render item as is
      } else {
        itmTxt = item;
      }
      return (
          <button
            className="btn btn-info btn-inline"
            type="button"
            onClick={this.handleRemove}
            data-item={item}
            key={item}
          >
            {itmTxt}
            &nbsp;
            <span
              className="glyphicon glyphicon-remove"
              data-item={item}
            />
          </button>
      );
    }, this);
    return (
      <div className={elementClass}>
        <label className="col-sm-3 control-label" htmlFor={this.props.id}>
          {this.props.label}
          {requiredHTML}
        </label>
        <div className="col-sm-9">
          {items}
          {input}
          {errorMessage}
          <button
            className="btn btn-success btn-add-tag"
            id={this.props.id + 'Add'}
            type="button"
            onClick={this.handleAdd}
            >
            <span className="glyphicon glyphicon-plus"/>
            {this.props.btnLabel}
          </button>
        </div>
      </div>
    );
  }
}

TagsElement.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  pendingValKey: PropTypes.string.isRequired,
  options: PropTypes.object,
  items: PropTypes.array,
  label: PropTypes.string,
  value: PropTypes.string,
  class: PropTypes.string,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  emptyOption: PropTypes.bool,
  errorMessage: PropTypes.string,
  btnLabel: PropTypes.string,
  allowDupl: PropTypes.bool,
  useSearch: PropTypes.bool,
  strictSearch: PropTypes.bool,
  onUserInput: PropTypes.func,
  onUserAdd: PropTypes.func,
  onUserRemove: PropTypes.func,
};

TagsElement.defaultProps = {
  name: '',
  options: {},
  items: [],
  label: '',
  value: undefined,
  id: null,
  class: '',
  required: false,
  disabled: false,
  emptyOption: true,
  hasError: false,
  allowDupl: false,
  useSearch: false,
  strictSearch: false, // only accept items specified in options
  errorMessage: '',
  pendingValKey: '',
  btnLabel: 'Add Tag',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
  onUserAdd: function() {
    console.warn('onUserAdd() callback is not set');
  },
  onUserRemove: function() {
    console.warn('onUserRemove() callback is not set');
  },
};

/**
 * Textarea Component
 * React wrapper for a <textarea> element.
 */
export class TextareaElement extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  handleChange(e) {
    this.props.onUserInput(this.props.name, e.target.value);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let disabled = this.props.disabled ? 'disabled' : null;
    let required = this.props.required ? 'required' : null;
    let requiredHTML = null;

    // Add required asterix
    if (required) {
      requiredHTML = <span className="text-danger">*</span>;
    }

    return (
      <div className="row form-group">
        <label className="col-sm-3 control-label" htmlFor={this.props.id}>
          {this.props.label}
          {requiredHTML}
        </label>
        <div className="col-sm-9">
          <textarea
            cols={this.props.cols}
            rows={this.props.rows}
            className="form-control"
            name={this.props.name}
            id={this.props.id}
            value={this.props.value || ''}
            placeholder={this.props.placeholder}
            required={required}
            disabled={disabled}
            onChange={this.handleChange}
          >
          </textarea>
        </div>
      </div>
    );
  }
}

TextareaElement.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
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
  placeholder: '',
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
 * Textbox Component
 * React wrapper for a <input type="text"> element.
 */
export class TextboxElement extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  handleChange(e) {
    this.props.onUserInput(
      this.props.name,
      e.target.value,
      e.target.id, 'textbox',
    );
  }

  /**
   * Handle blur
   *
   * @param {object} e - Event
   */
  handleBlur(e) {
    this.props.onUserBlur(this.props.name, e.target.value);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let disabled = this.props.disabled ? 'disabled' : null;
    let required = this.props.required ? 'required' : null;
    let errorMessage = null;
    let requiredHTML = null;
    let elementClass = 'row form-group';

    // Add required asterix
    if (required) {
      requiredHTML = <span className="text-danger">*</span>;
    }

    // Add error message
    if (this.props.errorMessage) {
      errorMessage = <span>{this.props.errorMessage}</span>;
      elementClass = 'row form-group has-error';
    }


    // Label prop needs to be provided to render label
    // (including empty label i.e. <TextboxElement label='' />)
    // and retain formatting. If label prop is not provided at all, the input
    // element will take up the whole row.
    let label = null;
    let inputClass = this.props.class;
    if (this.props.label || this.props.label == '') {
      label = (
        <label className="col-sm-3 control-label" htmlFor={this.props.id}>
          {this.props.label}
          {requiredHTML}
        </label>
      );
      inputClass = 'col-sm-9';
    }

    return (
      <div className={elementClass}>
        {label}
        <div className={inputClass}>
          <input
            type="text"
            className="form-control"
            name={this.props.name}
            id={this.props.id}
            value={this.props.value || ''}
            required={required}
            disabled={disabled}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            autoComplete={this.props.autoComplete}
            placeholder={this.props.placeholder}
          />
          {errorMessage}
        </div>
      </div>
    );
  }
}

TextboxElement.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  class: PropTypes.string,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  errorMessage: PropTypes.string,
  onUserInput: PropTypes.func,
  onUserBlur: PropTypes.func,
};

TextboxElement.defaultProps = {
  name: '',
  value: '',
  id: null,
  class: 'col-sm-12',
  placeholder: '',
  autoComplete: null,
  disabled: false,
  required: false,
  errorMessage: '',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
  onUserBlur: function() {
  },
};

/**
 * EmailElement Component
 * React wrapper for a <input type="email"> element.
 */
export class EmailElement extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  handleChange(e) {
    this.props.onUserInput(
      this.props.name,
      e.target.value,
      e.target.id, 'textbox',
    );
  }

  /**
   * Handle blur
   *
   * @param {object} e - Event
   */
  handleBlur(e) {
    this.props.onUserBlur(this.props.name, e.target.value);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let disabled = this.props.disabled ? 'disabled' : null;
    let required = this.props.required ? 'required' : null;
    let errorMessage = null;
    let requiredHTML = null;
    let elementClass = 'row form-group';

    // Add required asterix
    if (required) {
      requiredHTML = <span className="text-danger">*</span>;
    }

    // Add error message
    if (this.props.errorMessage) {
      errorMessage = <span>{this.props.errorMessage}</span>;
      elementClass = 'row form-group has-error';
    }


    // Label prop needs to be provided to render label
    // (including empty label i.e. <TextboxElement label='' />)
    // and retain formatting. If label prop is not provided at all, the input
    // element will take up the whole row.
    let label = null;
    let inputClass = this.props.class;
    if (this.props.label || this.props.label == '') {
      label = (
        <label className="col-sm-3 control-label" htmlFor={this.props.id}>
          {this.props.label}
          {requiredHTML}
        </label>
      );
      inputClass = 'col-sm-9';
    }

    return (
      <div className={elementClass}>
        {label}
        <div className={inputClass}>
          <input
            type="email"
            title="Please provide a valid email address!"
            className="form-control"
            name={this.props.name}
            id={this.props.id}
            value={this.props.value || ''}
            required={required}
            disabled={disabled}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            autoComplete={this.props.autoComplete}
            placeholder={this.props.placeholder}
          />
          {errorMessage}
        </div>
      </div>
    );
  }
}
EmailElement.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  class: PropTypes.string,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  errorMessage: PropTypes.string,
  onUserInput: PropTypes.func,
  onUserBlur: PropTypes.func,
};
EmailElement.defaultProps = {
  name: '',
  value: '',
  id: null,
  class: 'col-sm-12',
  placeholder: '',
  autoComplete: null,
  disabled: false,
  required: false,
  errorMessage: '',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
  onUserBlur: function() {
  },
};

/**
 * Password Component
 * React wrapper for a <input type="password"> element.
 */
export class PasswordElement extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      on: { // password is visible.
        icon: 'close',
        type: 'text',
      },
      off: { // password hidden.
        icon: 'open',
        type: 'password',
      },
      active: false, // is password visible.
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    // callback called to toogle the visibility
    this.toggleVisibility = this.toggleVisibility.bind(this);
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  handleChange(e) {
    this.props.onUserInput(
      this.props.name,
      e.target.value,
      e.target.id,
      this.state.active ? this.state.on.type : this.state.off.type,
    );
  }

  /**
   * Handle blur
   *
   * @param {object} e - Event
   */
  handleBlur(e) {
    this.props.onUserBlur(this.props.name, e.target.value);
  }

  /**
   * Toggle visibility
   *
   */
  toggleVisibility() {
    this.setState({active: !this.state.active});
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let disabled = this.props.disabled ? 'disabled' : null;
    let required = this.props.required ? 'required' : null;
    let errorMessage = null;
    let requiredHTML = null;
    let elementClass = 'row form-group';

    // Add required asterix
    if (required) {
      requiredHTML = <span className='text-danger'>*</span>;
    }

    // Add error message
    if (this.props.errorMessage) {
      errorMessage = <span>{this.props.errorMessage}</span>;
      elementClass = 'row form-group has-error';
    }

    let label = null;
    if (this.props.label) {
      label = (
        <label className='col-sm-3 control-label' htmlFor={this.props.id}>
          {this.props.label}
          {requiredHTML}
        </label>
      );
    }
    const passwordDisplayType = this.state.active
      ? this.state.on.type
      : this.state.off.type;
    const passwordDisplayIcon = this.state.active
      ? this.state.on.icon
      : this.state.off.icon;
    return (
      <div className={elementClass}>
        {label}
        <div className={this.props.class}>
          <input
            type={passwordDisplayType}
            className='form-control'
            name={this.props.name}
            id={this.props.id}
            value={this.props.value || ''}
            required={required}
            disabled={disabled}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            autoComplete={this.props.autoComplete}
            placeholder={this.props.placeholder}
          />
          <span
            className={'form-control-feedback glyphicon glyphicon-eye-'
            + passwordDisplayIcon}
            style={{marginRight: '15px'}}
            onClick={this.toggleVisibility}
          />
          {errorMessage}
        </div>
      </div>
    );
  }
}

PasswordElement.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  class: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  autoComplete: PropTypes.string,
  errorMessage: PropTypes.string,
  onUserInput: PropTypes.func,
  onUserBlur: PropTypes.func,
};

PasswordElement.defaultProps = {
  id: null,
  label: '',
  value: '',
  type: 'text',
  class: 'col-sm-9',
  placeholder: '',
  disabled: false,
  required: false,
  autoComplete: null,
  errorMessage: '',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
  onUserBlur: function() {
  },
};

/**
 * Date Component
 * React wrapper for a <input type="date"> element.
 */
export class DateElement extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    // Check if props minYear and maxYear are valid values if supplied
    let minYear = this.props.minYear;
    let maxYear = this.props.maxYear;
    if (this.props.minYear === '' || this.props.minYear === null) {
      minYear = '1000';
    }
    if (this.props.maxYear === '' || this.props.maxYear === null) {
      maxYear = '9999';
    }
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  handleChange(e) {
    this.props.onUserInput(
      this.props.name,
      e.target.value,
      e.target.id,
      'date',
    );
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let disabled = this.props.disabled ? 'disabled' : null;
    let required = this.props.required ? 'required' : null;
    let requiredHTML = null;
    let errorMessage = null;
    let elementClass = 'row form-group';

    // Add required asterix
    if (required) {
      requiredHTML = <span className="text-danger">*</span>;
    }

    // Add error message
    if (this.props.hasError
       || (this.props.required && this.props.value === '')
    ) {
      errorMessage = <span>{this.props.errorMessage}</span>;
      elementClass = elementClass + ' has-error';
    }

    // Check if props minYear and maxYear are valid values if supplied
    let minYear = this.props.minYear;
    let maxYear = this.props.maxYear;
    if (this.props.minYear === '' || this.props.minYear === null) {
      minYear = '1000';
    }
    if (this.props.maxYear === '' || this.props.maxYear === null) {
      maxYear = '9999';
    }

    const currentDate = new Date();
    // The added '0' is needed because getmonth and getdate return
    // values needed to be padded before saving.
    // padStart adds as many possible zeros while keeping the string
    // at a length of 2 for the following code.
    const currentDay = `${currentDate.getDate()}`.padStart(2, '0');
    const currentMonth = `${currentDate.getMonth() + 1}`.padStart(2, '0');

    // Handle date format
    let format = this.props.dateFormat;
    let inputType = 'date';
    let minFullDate = minYear + '-01-01';
    let maxFullDate = maxYear + '-' + currentMonth + '-' + currentDay;
    if (!format.match(/d/i)) {
      inputType = 'month';
      minFullDate = minYear + '-01';
      maxFullDate = maxYear + '-' + currentMonth;
    }

    let labelHTML;
    let classSz = 'col-sm-12';
    if (this.props.label) {
        labelHTML = <label
            className="col-sm-3 control-label"
            htmlFor={this.props.label}>
          {this.props.label}
          {requiredHTML}
        </label>;
        classSz = 'col-sm-9';
    }
    return (
      <div className={elementClass}>
        {labelHTML}
        <div className={classSz}>
          <input
            type={inputType}
            className="form-control"
            name={this.props.name}
            id={this.props.id}
            min={minFullDate}
            max={maxFullDate}
            onChange={this.handleChange}
            value={this.props.value || ''}
            required={required}
            disabled={disabled}
          />
          {errorMessage}
        </div>
      </div>
    );
  }
}

DateElement.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  maxYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dateFormat: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  hasError: PropTypes.bool,
  errorMessage: PropTypes.string,
  onUserInput: PropTypes.func,
};

DateElement.defaultProps = {
  name: '',
  label: '',
  value: undefined,
  id: null,
  maxYear: '9999',
  minYear: '1000',
  dateFormat: 'YMd',
  disabled: false,
  required: false,
  hasError: false,
  errorMessage: 'The field is required!',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
};

/**
 * Time Component
 * React wrapper for a <input type="time"> element.
 */
export class TimeElement extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  handleChange(e) {
    this.props.onUserInput(this.props.name, e.target.value);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let disabled = this.props.disabled ? 'disabled' : null;
    let required = this.props.required ? 'required' : null;
    let requiredHTML = null;
    let label;
    let classSz;

    // Add required asterix
    if (required) {
      requiredHTML = <span className="text-danger">*</span>;
    }
    if (this.props.label) {
        label = <label className="col-sm-3 control-label"
            htmlFor={this.props.label}>
          {this.props.label}
          {requiredHTML}
            </label>;
        classSz = 'col-sm-9';
    } else {
        classSz = 'col-sm-12';
    }

    return (
      <div className="row form-group">
        {label}
        <div className={classSz}>
          <input
            type="time"
            className="form-control"
            name={this.props.name}
            id={this.props.id}
            onChange={this.handleChange}
            value={this.props.value || ''}
            required={required}
            disabled={disabled}
            pattern="([0-1][0-9]|2[0-4]|[1-9]):([0-5][0-9])(:([0-5][0-9]))?"
            title={'Input must be in one of the following formats: '
                  + 'HH:MM or HH:MM:SS'}
          />
        </div>
      </div>
    );
  }
}

TimeElement.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  onUserInput: PropTypes.func,
};

TimeElement.defaultProps = {
  name: '',
  label: '',
  value: '',
  id: '',
  disabled: false,
  required: false,
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
};

/**
 * DateTime Component
 * React wrapper for a <input type="datetime-local"> element.
 */
export class DateTimeElement extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  handleChange(e) {
    this.props.onUserInput(this.props.name, e.target.value);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let disabled = this.props.disabled ? 'disabled' : null;
    let required = this.props.required ? 'required' : null;
    let requiredHTML = null;
    let label;
    let classSz;

    // Add required asterix
    if (required) {
      requiredHTML = <span className="text-danger">*</span>;
    }
    if (this.props.label) {
        label = <label className="col-sm-3 control-label"
            htmlFor={this.props.label}>
          {this.props.label}
          {requiredHTML}
            </label>;
        classSz = 'col-sm-9';
    } else {
        classSz = 'col-sm-12';
    }

    return (
      <div className="row form-group">
        {label}
        <div className={classSz}>
          <input
            type="datetime-local"
            className="form-control"
            name={this.props.name}
            id={this.props.id}
            onChange={this.handleChange}
            value={this.props.value || ''}
            required={required}
            disabled={disabled}
            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}(:[0-5][0-9])?"
            title={'Input must be in one of the following formats: '
                  + 'YYYY-MM-DDTHH:MM or YYYY-MM-DDTHH:MM:SS'}
          />
        </div>
      </div>
    );
  }
}

DateTimeElement.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  onUserInput: PropTypes.func,
};

DateTimeElement.defaultProps = {
  name: '',
  label: '',
  value: '',
  id: '',
  disabled: false,
  required: false,
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
};

/**
 * Numeric Component
 * React wrapper for a <input type="number"> element.
 */
export class NumericElement extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  handleChange(e) {
    this.props.onUserInput(this.props.name, e.target.value);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {disabled, required} = this.props;
    let requiredHTML = required ? <span className="text-danger">*</span> : null;
    let errorMessage = null;
    let elementClass = 'row form-group';

    // Add error message
    if (this.props.errorMessage) {
      errorMessage = <span>{this.props.errorMessage}</span>;
      elementClass = 'row form-group has-error';
    }

    let labelHTML;
    let classSz = 'col-sm-12';
    if (this.props.label) {
        labelHTML = <label
            className="col-sm-3 control-label"
            htmlFor={this.props.label}>
          {this.props.label}
          {requiredHTML}
        </label>;
        classSz = 'col-sm-9';
    }

    return (
      <div className={elementClass}>
        {labelHTML}
        <div className={classSz}>
          <input
            type="number"
            className="form-control"
            name={this.props.name}
            id={this.props.id}
            min={this.props.min}
            max={this.props.max}
            step={this.props.step}
            value={this.props.value || ''}
            disabled={disabled}
            required={required}
            onChange={this.handleChange}
          />
          {errorMessage}
        </div>
      </div>
    );
  }
}

NumericElement.propTypes = {
  name: PropTypes.string.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  onUserInput: PropTypes.func,
  errorMessage: PropTypes.string,
};

NumericElement.defaultProps = {
  name: '',
  min: null,
  max: null,
  step: '1',
  label: '',
  value: '',
  id: null,
  required: false,
  disabled: false,
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
};

/**
 * File Component
 * React wrapper for a simple or 'multiple' <input type="file"> element.
 */
export class FileElement extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  handleChange(e) {
    // Send current file to parent component
    const files = e.target.files
      ? (this.props.allowMultiple ? e.target.files : e.target.files[0])
      : '';
    this.props.onUserInput(this.props.name, files);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const required = this.props.required ? 'required' : null;

    let fileName = undefined;

    if (this.props.value) {
      switch (typeof this.props.value) {
        case 'string':
          fileName = this.props.value;
          break;

        case 'object':
          if (this.props.value instanceof FileList) {
            const files = this.props.value;
            fileName = Array.from(files).map((file) => file.name).join(', ');
          } else {
            fileName = this.props.value.name;
          }
          break;

        default:
          break;
      }
    }

    let requiredHTML = null;
    let errorMessage = '';
    let elementClass = 'row form-group';

    // Add required asterix
    if (required) {
      requiredHTML = <span className="text-danger">*</span>;
    }

    const truncateEllipsis = {
      display: 'table',
      tableLayout: 'fixed',
      width: '100%',
      whiteSpace: 'nowrap',
    };

    const truncateEllipsisChild = {
      display: 'table-cell',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    };

    // Add error message
    if (this.props.hasError) {
      errorMessage = this.props.errorMessage;
      elementClass = 'row form-group has-error';
    }

    // Need to manually reset file value, because HTML API
    // does not allow setting value to anything than empty string.
    // Hence can't use value attribute in the input element.
    const fileHTML = document.querySelector('.fileUpload');
    if (fileHTML && !fileName) {
      fileHTML.value = '';
    }

    if (this.props.disabled) {
      // add padding to align video title on disabled field
      truncateEllipsis.paddingTop = '7px';
      return (
        <div className={elementClass}>
          <label className="col-sm-3 control-label">
            {this.props.label}
          </label>
          <div className="col-sm-9">
            <div style={truncateEllipsis}>
              <span style={truncateEllipsisChild}>{fileName}</span>
            </div>
          </div>
        </div>
      );
    }

    let labelHTML;
    let classSz;
    if (this.props.label) {
        labelHTML = <label className="col-sm-3 control-label">
          {this.props.label}
          {requiredHTML}
        </label>;
        classSz = 'col-sm-9';
    } else {
        classSz = 'col-sm-12';
    }

    return (
      <div className={elementClass}>
        {labelHTML}
        <div className={classSz}>
          <div className="input-group">
            <div tabIndex="-1"
                 className="form-control file-caption kv-fileinput-caption">
              <div style={truncateEllipsis}>
                <span style={truncateEllipsisChild}>{fileName}</span>
              </div>
              <div className="file-caption-name" id="video_file"></div>
            </div>
            <div className="input-group-btn">
              <div className="btn btn-primary btn-file">
                <i className="glyphicon glyphicon-folder-open"></i> Browse
                <input
                  type="file"
                  className="fileUpload"
                  name={this.props.name}
                  onChange={this.handleChange}
                  required={required}
                  multiple={this.props.allowMultiple}
                />
              </div>
            </div>
          </div>
          <span>{errorMessage}</span>
        </div>
      </div>
    );
  }
}

FileElement.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  id: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  allowMultiple: PropTypes.bool,
  hasError: PropTypes.bool,
  errorMessage: PropTypes.string,
  onUserInput: PropTypes.func,
};

FileElement.defaultProps = {
  name: '',
  label: 'File to Upload',
  value: '',
  id: null,
  disabled: false,
  required: false,
  allowMultiple: false,
  hasError: false,
  errorMessage: 'The field is required!',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
};

/**
 * Static element component.
 * Used to displays plain/formatted text as part of a form
 *
 * To pass a formatted text, you need to wrap it in a single parent element.
 * Example usage:
 *
 * ```
 * let myText = (<span>This is my <b>text</b></span>);
 * <StaticElement
 *    text={myText}
 *    label={note}
 * />
 * ```
 */
export class StaticElement extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let label = null;
    if (this.props.label) {
      label = (
        <label className="col-sm-3 control-label">
          {this.props.label}
        </label>
      );
    }
    return (
      <div className="row form-group">
        {label}
        <div className={this.props.class}>
          <div className={this.props.textClass}>
            {this.props.text}
          </div>
        </div>
      </div>
    );
  }
}

StaticElement.propTypes = {
  label: PropTypes.string,
  class: PropTypes.string,
  textClass: PropTypes.string,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  class: PropTypes.string,
};

StaticElement.defaultProps = {
  label: '',
  text: null,
  class: 'col-sm-9',
  textClass: 'form-control-static',
};

/**
 * Header element component.
 * Used to display a header element with specific level (1-6) as part of a form
 *
 */
export class HeaderElement extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const Tag = 'h' + this.props.headerLevel;
    return (
      <div className="row form-group">
        <Tag className='col-xs-12'>
          {this.props.text}
        </Tag>
      </div>
    );
  }
}

HeaderElement.propTypes = {
  text: PropTypes.string.isRequired,
  headerLevel: PropTypes.oneOf([
    1, 2, 3, 4, 5, 6,
  ]),
};

HeaderElement.defaultProps = {
  headerLevel: 3,
};

/**
 * Link element component.
 * Used to link plain/formated text to an href destination as part of a form
 */
export class LinkElement extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <div className="row form-group">
        <label className="col-sm-3 control-label">
          {this.props.label}
        </label>
        <div className="col-sm-9">
          <p className="form-control-static">
            <a href={this.props.href}>{this.props.text}</a>
          </p>
        </div>
      </div>
    );
  }
}

LinkElement.propTypes = {
  label: PropTypes.string,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  href: PropTypes.string,
};

LinkElement.defaultProps = {
  label: '',
  text: null,
  href: null,
};

/**
 * Checkbox Component
 * React wrapper for a <input type="checkbox"> element.
 */
export class CheckboxElement extends React.Component {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  handleChange(e) {
    this.props.onUserInput(this.props.name, e.target.checked);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let disabled = this.props.disabled ? 'disabled' : null;
    let required = this.props.required ? 'required' : null;
    let errorMessage = null;
    let requiredHTML = null;
    let elementClass = this.props.class + ' ' + this.props.offset;
    const divStyle = this.props.class === 'checkbox-inline'
      ? {paddingRight: '5px'}
      : {paddingRight: '5px', display: 'inline-block'};

    // Add required asterix
    if (required) {
      requiredHTML = <span className="text-danger">*</span>;
    }

    // Add error message
    if (this.props.errorMessage) {
      errorMessage = <span>{this.props.errorMessage}</span>;
      elementClass = elementClass + ' has-error';
    }

    return (
      <div className={elementClass}>
        <div className={'col-sm-12'}>
          <label htmlFor={this.props.id}>
            <div style={divStyle}>
              <input
                type="checkbox"
                name={this.props.name}
                id={this.props.id}
                checked={this.props.value}
                required={required}
                disabled={disabled}
                onChange={this.handleChange}
              />
            </div>
            {errorMessage}
            {this.props.label}
            {requiredHTML}
          </label>
        </div>
      </div>
    );
  }
}

CheckboxElement.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
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
 * Button component
 * React wrapper for <button> element, typically used to submit forms
 */
export class ButtonElement extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Handle click
   *
   * @param {object} e - Event
   */
  handleClick(e) {
    this.props.onUserInput(e);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <div className="row form-group">
        <div className={this.props.columnSize}>
          <button
            id={this.props.id}
            name={this.props.name}
            type={this.props.type}
            className={this.props.buttonClass}
            style={this.props.style}
            onClick={this.handleClick}
            disabled={this.props.disabled}
          >
            {this.props.disabled ? 'Uploading...' : this.props.label}
          </button>
        </div>
      </div>
    );
  }
}

ButtonElement.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  onUserInput: PropTypes.func,
  columnSize: PropTypes.string,
  buttonClass: PropTypes.string,
};

ButtonElement.defaultProps = {
  label: 'Submit',
  type: 'submit',
  disabled: null,
  buttonClass: 'btn btn-primary',
  columnSize: 'col-sm-9 col-sm-offset-3',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
};

/**
 * Call To Action (CTA) component
 * React wrapper for <button> element that is used for Call to Actions, usually
 * outside the context of forms.
 */
export class CTA extends Component {
  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
   render() {
     return (
       <button
         className={this.props.buttonClass}
         onClick={this.props.onUserInput}
       >
         {this.props.label}
       </button>
     );
   }
 }

  CTA.propTypes = {
   label: PropTypes.string,
   buttonClass: PropTypes.string,
   onUserInput: PropTypes.func,
 };

  CTA.defaultProps = {
   buttonClass: 'btn btn-primary',
   onUserInput: function() {
     console.warn('onUserInput() callback is not set');
   },
 };

/**
 * Generic form element.
 */
export class LorisElement extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let elementProps = this.props.element;
    elementProps.ref = elementProps.name;
    elementProps.onUserInput = this.props.onUserInput;

    let elementHtml = <div></div>;

    switch (elementProps.type) {
      case 'text':
        elementHtml = (<TextboxElement {...elementProps} />);
        break;
      case 'email':
       elementHtml = (<EmailElement {...elementProps} />);
       break;
      case 'password':
       elementHtml = (<PasswordElement {...elementProps} />);
       break;
      case 'tags':
        elementHtml = (<TagsElement {...elementProps} />);
        break;
      case 'select':
        elementHtml = (<SelectElement {...elementProps} />);
        break;
      case 'search':
        elementHtml = (<SearchableDropdown {...elementProps}/>);
        break;
      case 'date':
        elementHtml = (<DateElement {...elementProps} />);
        break;
      case 'time':
        elementHtml = (<TimeElement {...elementProps} />);
        break;
      case 'numeric':
        elementHtml = (<NumericElement {...elementProps} />);
        break;
      case 'textarea':
        elementHtml = (<TextareaElement {...elementProps} />);
        break;
      case 'file':
        elementHtml = (<FileElement {...elementProps} />);
        break;
      case 'static':
        elementHtml = (<StaticElement {...elementProps} />);
        break;
      case 'header':
        elementHtml = (<HeaderElement {...elementProps} />);
        break;
      case 'link':
        elementHtml = (<LinkElement {...elementProps} />);
        break;
      case 'advcheckbox':
        elementHtml = (<CheckboxElement {...elementProps} />);
        break;
      default:
        console.warn(
          'Element of type ' +
          elementProps.type +
          ' is not currently implemented!'
        );
        break;
    }

    return elementHtml;
  }
}
LorisElement.propTypes = {
  element: PropTypes.object,
  onUserInput: PropTypes.string,
};

/**
 * Radio Component
 * React wrapper for a <input type='radio'> element.
 *
 * Example `options` prop:
 *   {
 *     female: 'Female',
 *     male: 'Male',
 *   }
 */
export class RadioElement extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.generateLayout = this.generateLayout.bind(this);
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  handleChange(e) {
    this.props.onUserInput(this.props.name, e.target.value);
  }

  /**
   * Generate layout
   *
   * @return {JSX[]} - An array of element React markup
   */
  generateLayout() {
    let layout = [];
    let disabled = this.props.disabled ? 'disabled' : null;
    let required = this.props.required ? 'required' : null;

    const styleRow = {
      display: 'flex',
      flexDirection: this.props.vertical ? 'column' : 'row',
      flexWrap: 'wrap',
      width: '100%',
    };
    const styleColumn = {
      display: 'flex',
      flexDirection: 'column',
      alignSelf: 'flex-start',
      marginRight: '10px',
    };
    const styleContainer = {
      paddingTop: '7px',
      cursor: 'pointer',
    };
    const styleLabel = {
      margin: 0,
      color: '#064785',
      cursor: 'pointer',
    };
    const styleInput = {
      display: 'inline-block',
      margin: '0 5px 0 5px',
      cursor: 'pointer',
    };

    let content = [];
    for (const key in this.props.options) {
      if (this.props.options.hasOwnProperty(key)) {
        const checked = this.props.checked === key;
        content.push(
          <div key={key}
               style={styleColumn}>
            <div style={styleContainer}>
              <input
                type='radio'
                name={this.props.name}
                value={key}
                id={key}
                checked={checked}
                required={required}
                disabled={disabled}
                onChange={this.handleChange}
                style={styleInput}
              />
              <label htmlFor={key}
                     style={styleLabel}
              >
                {this.props.options[key]}
              </label>
            </div>
          </div>
        );
      }
    }

    layout.push(
      <div key={this.props.name + '_key'}
           style={styleRow}>
        {content}
      </div>
    );

    return layout;
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let errorMessage = null;
    let requiredHTML = null;
    let elementClass = this.props.elementClass;
    let required = this.props.required ? 'required' : null;

    // Add required asterix
    if (required) {
      requiredHTML = <span className='text-danger'>*</span>;
    }
    // Add error message
    if (this.props.errorMessage) {
      errorMessage = <span>{this.props.errorMessage}</span>;
      elementClass = this.props.elementClass + ' has-error';
    }
    // Generate layout
    const layout = this.generateLayout();

    return (
      <div className={elementClass}>
        <label className={'col-sm-3 control-label'}>
          {this.props.label}
          {errorMessage}
          {requiredHTML}
        </label>
        <div className={'col-sm-9'}>
          {layout}
        </div>
      </div>
    );
  }
}
RadioElement.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  vertical: PropTypes.bool,
  checked: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  elementClass: PropTypes.string,
  onUserInput: PropTypes.func,
};
RadioElement.defaultProps = {
  disabled: false,
  required: false,
  vertical: false,
  errorMessage: '',
  elementClass: 'row form-group',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
};

/**
 * Slider Component
 * React wrapper for a <input type='range'> element.
 */
export class SliderElement extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Handle change
   *
   * @param {object} e - Event
   */
  handleChange(e) {
    // Handles empty, min & max cases.
    const inputValue = e.target.value
      ? parseFloat(e.target.value)
      : this.props.minValue;
    let value = inputValue > this.props.maxValue
      ? this.props.maxValue
      : inputValue;
    value = value < this.props.minValue
      ? this.props.minValue
      : value;
    this.props.onUserInput(this.props.name, value);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let errorMessage = null;
    let requiredHTML = null;
    let elementClass = this.props.elementClass;
    let disabled = this.props.disabled ? 'disabled' : null;
    let required = this.props.required ? 'required' : null;
    // Add required asterix
    if (required) {
      requiredHTML = <span className='text-danger'>*</span>;
    }
    // Add error message
    if (this.props.errorMessage) {
      errorMessage = <span>{this.props.errorMessage}</span>;
      elementClass = this.props.elementClass + ' has-error';
    }

    return (
      <div className={elementClass}>
        <label className={'col-sm-3 control-label'}
               htmlFor={this.props.id}>
          {this.props.label}
          {errorMessage}
          {requiredHTML}
        </label>
        <div className={'col-sm-9'}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
          }}>
            <div style={{
              flexGrow: 1000,
              display: 'flex',
              flexDirection: 'column',
              flexBasis: '100%',
              maxWidth: this.props.maxWidth,
              marginRight: '5px',
              flex: 2,
            }}>
              <input
                type='range'
                name={this.props.name}
                id={this.props.id}
                value={this.props.value}
                min={this.props.minValue}
                max={this.props.maxValue}
                required={required}
                disabled={disabled}
                onChange={this.handleChange}
                style={{width: '100%'}}
              />
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              flexBasis: '100%',
              maxWidth: '50px',
              flex: 1,
            }}>
              <input
                type='number'
                name={'input_' + this.props.name}
                value={this.props.value}
                min={this.props.minValue}
                max={this.props.maxValue}
                required={required}
                disabled={disabled}
                onChange={this.handleChange}
                style={{
                  width: '50px',
                  textAlign: 'center',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
SliderElement.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  minValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  maxWidth: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  errorMessage: PropTypes.string,
  elementClass: PropTypes.string,
  onUserInput: PropTypes.func,
};
SliderElement.defaultProps = {
  id: null,
  maxWidth: 'auto',
  disabled: false,
  required: false,
  errorMessage: '',
  elementClass: 'row form-group',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
};

export default {
  FormElement,
  FieldsetElement,
  SelectElement,
  TagsElement,
  SearchableDropdown,
  TextareaElement,
  TextboxElement,
  PasswordElement,
  DateElement,
  TimeElement,
  DateTimeElement,
  NumericElement,
  FileElement,
  StaticElement,
  HeaderElement,
  LinkElement,
  CheckboxElement,
  RadioElement,
  SliderElement,
  ButtonElement,
  CTA,
  LorisElement,
};
