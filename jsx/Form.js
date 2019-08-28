/* exported FormElement, FieldsetElement, SelectElement, TagsElement, SearchableDropdown, TextareaElement,
TextboxElement, DateElement, NumericElement, FileElement, StaticElement, LinkElement,
CheckboxElement, ButtonElement, LorisElement
*/

/**
 * This file contains React components for Loris form elements.
 *
 * @author Loris Team
 * @version 1.0.0
 *
 */

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

import React, {Component} from 'react';
import PropTypes from 'prop-types';

class FormElement extends Component {
  constructor(props) {
    super(props);
    this.getFormElements = this.getFormElements.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getFormElements() {
    const formElementsHTML = [];
    const columns = this.props.columns;
    const maxColumnSize = 12;
    const colSize = Math.floor(maxColumnSize / columns);
    const colClass = 'col-xs-12 col-sm-' + colSize + ' col-md-' + colSize;

    // Render elements from JSON
    const filter = this.props.formElements;

    Object.keys(filter).forEach(function(objKey, index) {
      const userInput = this.props.onUserInput ? this.props.onUserInput : filter[objKey].onUserInput;
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

  handleSubmit(e) {
    // Override default submit if property is set
    if (this.props.onSubmit) {
      e.preventDefault();
      this.props.onSubmit(e);
    }
  }

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
class FieldsetElement extends Component {
  constructor(props) {
    super(props);
    this.getFormElements = this.getFormElements.bind(this);
  }

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
  legend: PropTypes.string,
};

FieldsetElement.defaultProps = {
  columns: 1,
  legend: 'Selection Filter',
};

/**
 * Search Component
 * React wrapper for a searchable dropdown
 */
class SearchableDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {currentInput: ''};
    this.getKeyFromValue = this.getKeyFromValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  getKeyFromValue(value) {
    let options = this.props.options;
    return Object.keys(options).find(function(o) {
      return options[o] === value;
    });
  }

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

  componentDidUpdate(prevProps) {
    // need to clear out currentInput for when props.value gets wiped
    // if the previous value prop contained data and the current one doesn't
    // clear currentInput.
    if (prevProps.value && !this.props.value) {
      this.setState({currentInput: ''});
    } else if (this.props.value !== prevProps.value && this.props.value) {
      this.setState({currentInput: this.props.options[this.props.value]});
    }
  }

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
class SelectElement extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    let value = e.target.value;
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
    }

    this.props.onUserInput(this.props.name, value, e.target.id, 'select');
  }

  render() {
    let multiple = this.props.multiple ? 'multiple' : null;
    let required = this.props.required ? 'required' : null;
    let disabled = this.props.disabled ? 'disabled' : null;
    let sortByValue = this.props.sortByValue;
    let options = this.props.options;
    let errorMessage = null;
    let emptyOptionHTML = null;
    let requiredHTML = null;
    let elementClass = 'row form-group';

    // Add required asterisk
    if (required) {
      requiredHTML = <span className="text-danger">*</span>;
    }

    // Add empty option
    if (this.props.emptyOption) {
      emptyOptionHTML = <option></option>;
    }

    // Add error message
    if (this.props.errorMessage || (this.props.required && this.props.value === '')) {
      errorMessage = <span>{this.props.errorMessagei || 'The field is required!'}</span>;
      elementClass = 'row form-group has-error';
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
          <option value={newOptions[option]} key={newOptions[option]}>{option}</option>
        );
      });
    } else {
      optionList = Object.keys(options).map(function(option) {
        return (
          <option value={option} key={option}>{options[option]}</option>
        );
      });
    }

    // Default to empty string for regular select and to empty array for 'multiple' select
    const value = this.props.value || (multiple ? [] : '');

    return (
      <div className={elementClass}>
        <label className="col-sm-3 control-label" htmlFor={this.props.label}>
          {this.props.label}
          {requiredHTML}
        </label>
        <div className="col-sm-9">
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
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  id: PropTypes.string,
  class: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  emptyOption: PropTypes.bool,
  errorMessage: PropTypes.string,
  onUserInput: PropTypes.func,
};

SelectElement.defaultProps = {
  name: '',
  options: {},
  label: '',
  value: undefined,
  id: null,
  class: '',
  multiple: false,
  disabled: false,
  required: false,
  sortByValue: true,
  emptyOption: true,
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
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

class TagsElement extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.getKeyFromValue = this.getKeyFromValue.bind(this);
    this.canAddItem = this.canAddItem.bind(this);
  }

  // pendingValKey is the placeholder variable for temporarily storing
  // typed or selected items before adding them to the Tags
  handleChange(e) {
    this.props.onUserInput(this.props.pendingValKey, e.target.value);
  }
  // also add tags if enter key is hit within input field
  handleKeyPress(e) {
    if (e.keyCode === 13 || e.which === 13) {
      e.preventDefault();
      this.handleAdd();
    }
  }

  // send pendingValKey as an argument in order to null out entered item
  handleAdd() {
    let options = this.props.options;
    let value = this.props.value;
    // if using a datalist (search), set value to be the key in options
    if (this.props.useSearch && Object.values(options).indexOf(value) > -1) {
      value = this.getKeyFromValue(value);
    }
    if (this.canAddItem(value)) {
      this.props.onUserAdd(this.props.name, value, this.props.pendingValKey);
    }
  }

  handleRemove(e) {
    let value = e.target.getAttribute('data-item');
    this.props.onUserRemove(this.props.name, value);
  }

  getKeyFromValue(value) {
    let options = this.props.options;
    return Object.keys(options).find(function(o) {
      return options[o] === value;
    });
  }

  // helper function to detect if item should be added to Tags
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
                <option value={options[option]} key={option}>{options[option]}</option>
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
class TextareaElement extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onUserInput(this.props.name, e.target.value);
  }

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
 * Textbox Component
 * React wrapper for a <input type="text"> element.
 */
class TextboxElement extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleChange(e) {
    this.props.onUserInput(this.props.name, e.target.value, e.target.id, 'textbox');
  }

  handleBlur(e) {
    this.props.onUserBlur(this.props.name, e.target.value);
  }

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

    return (
      <div className={elementClass}>
        <label className="col-sm-3 control-label" htmlFor={this.props.id}>
          {this.props.label}
          {requiredHTML}
        </label>
        <div className="col-sm-9">
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
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  errorMessage: PropTypes.string,
  onUserInput: PropTypes.func,
  onUserBlur: PropTypes.func,
};

TextboxElement.defaultProps = {
  name: '',
  label: '',
  value: '',
  id: null,
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
 * Date Component
 * React wrapper for a <input type="date"> element.
 */
class DateElement extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleButton = this.handleButton.bind(this);
  }

  handleChange(e) {
    this.props.onUserInput(this.props.name, e.target.value);
  }

  handleButton(e) {
    let date = new Date();
    let dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
                        .toISOString()
                        .split('T')[0];
    this.props.onUserInput(this.props.name, dateString);
  }

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
    if (this.props.errorMessage) {
      errorMessage = <span>{this.props.errorMessage}</span>;
      elementClass = 'row form-group has-error';
    }

    return (
      <div className={elementClass}>
        <label className="col-sm-3 control-label" htmlFor={this.props.label}>
          {this.props.label}
          {requiredHTML}
        </label>
        <div className="col-sm-9">
          <div style={{display: 'flex'}}>
            <div style={{flexGrow: 3}}>
              <input
                type="date"
                className="form-control"
                name={this.props.name}
                id={this.props.id}
                min={this.props.minYear}
                max={this.props.maxYear}
                onChange={this.handleChange}
                value={this.props.value}
                required={required}
                disabled={disabled}
              />
              {errorMessage}
            </div>
            <div style={{flexGrow: 1}}>
              <button
                type="button"
                onClick={this.handleButton}
                className= "btn btn-primary"
              >
                Today
              </button>
            </div>
          </div>
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
  maxYear: PropTypes.string,
  minYear: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  onUserInput: PropTypes.func,
};

DateElement.defaultProps = {
  name: '',
  label: '',
  value: '',
  id: null,
  maxYear: '9999-12-31',
  minYear: '1000-01-01',
  disabled: false,
  required: false,
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
};

/**
 * Time Component
 * React wrapper for a <input type="time"> element.
 */
class TimeElement extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleButton = this.handleButton.bind(this);
  }

  handleChange(e) {
    this.props.onUserInput(this.props.name, e.target.value);
  }

  handleButton(e) {
    let date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeString = ('0'+hours).slice(-2)+':'+('0'+minutes).slice(-2);
    this.props.onUserInput(this.props.name, timeString);
  }

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
    if (this.props.errorMessage) {
      errorMessage = <span>{this.props.errorMessage}</span>;
      elementClass = 'row form-group has-error';
    }

    return (
      <div className={elementClass}>
        <label className="col-sm-3 control-label" htmlFor={this.props.label}>
          {this.props.label}
          {requiredHTML}
        </label>
        <div className="col-sm-9">
          <div
            style={{display: 'flex'}}
          >
            <div style={{flexGrow: 3}}>
              <input
                type="time"
                className="form-control"
                name={this.props.name}
                id={this.props.id}
                onChange={this.handleChange}
                value={this.props.value || ''}
                required={required}
                disabled={disabled}
                pattern="([0-1][0-9]|2[0-4]|[1-9]):([0-5][0-9])?"
                title="Input must be in one of the following formats: HH:MM or HH:MM:SS"
              />
              {errorMessage}
            </div>
            <div style={{flexGrow: 1}}>
              <button
                type="button"
                onClick={this.handleButton}
                className= "btn btn-primary"
              >
                Now
              </button>
            </div>
          </div>
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
 * Numeric Component
 * React wrapper for a <input type="number"> element.
 */
class NumericElement extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onUserInput(this.props.name, e.target.value);
  }

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
    if (this.props.errorMessage) {
      errorMessage = <span>{this.props.errorMessage}</span>;
      elementClass = 'row form-group has-error';
    }

    return (
      <div className={elementClass}>
        <label className="col-sm-3 control-label" htmlFor={this.props.id}>
          {this.props.label}
          {requiredHTML}
        </label>
        <div className="col-sm-9">
          <input
            type="number"
            className="form-control"
            name={this.props.name}
            id={this.props.id}
            min={this.props.min}
            max={this.props.max}
            value={this.props.value}
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
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
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
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
};

/**
 * File Component
 * React wrapper for a simple or 'multiple' <select> element.
 */
class FileElement extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    // Send current file to parent component
    const file = e.target.files[0] ? e.target.files[0] : '';
    this.props.onUserInput(this.props.name, file);
  }

  render() {
    const required = this.props.required ? 'required' : null;
    const fileName = this.props.value ? this.props.value.name : undefined;
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
    if (this.props.errorMessage) {
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

    return (
      <div className={elementClass}>
        <label className="col-sm-3 control-label">
          {this.props.label}
          {requiredHTML}
        </label>
        <div className="col-sm-9">
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
class StaticElement extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="row form-group">
        <label className="col-sm-3 control-label">
          {this.props.label}
        </label>
        <div className="col-sm-9">
          <p className="form-control-static">{this.props.text}</p>
        </div>
      </div>
    );
  }
}

StaticElement.propTypes = {
  label: PropTypes.string,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
};

StaticElement.defaultProps = {
  label: '',
  text: null,
};

/**
 * Link element component.
 * Used to link plain/formated text to an href destination as part of a form
 */
class LinkElement extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row form-group">
        <label className="col-sm-3 control-label">
          {this.props.label}
        </label>
        <div className="col-sm-9">
          <p className="form-control-static"><a href={this.props.href}>{this.props.text}</a></p>
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
class CheckboxElement extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onUserInput(this.props.name, e.target.checked);
  }

  render() {
    let disabled = this.props.disabled ? 'disabled' : null;
    let required = this.props.required ? 'required' : null;
    let errorMessage = null;
    let requiredHTML = null;
    let elementClass = 'checkbox-inline col-sm-offset-3';
    let label = null;

    // Add required asterix
    if (required) {
      requiredHTML = <span className="text-danger">*</span>;
    }

    // Add error message
    if (this.props.errorMessage) {
      errorMessage = <span>{this.props.errorMessage}</span>;
      elementClass = 'checkbox-inline col-sm-offset-3 has-error';
    }

    return (
      <div className={elementClass}>
        <label htmlFor={this.props.id}>
          <input
            type="checkbox"
            name={this.props.name}
            id={this.props.id}
            checked={this.props.value}
            required={required}
            disabled={disabled}
            onChange={this.handleChange}
          />
          {errorMessage}
          {this.props.label}
          {requiredHTML}
        </label>
      </div>
    );
  }
}

CheckboxElement.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  errorMessage: PropTypes.string,
  onUserInput: PropTypes.func,
};

CheckboxElement.defaultProps = {
  id: null,
  disabled: false,
  required: false,
  errorMessage: '',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
};

/**
 * Button component
 * React wrapper for <button> element, typically used to submit forms
 */
class ButtonElement extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.onUserInput(e);
  }

  render() {
    return (
      <div className="row form-group">
        <div className={this.props.columnSize}>
          <button
            name={this.props.name}
            type={this.props.type}
            className={this.props.buttonClass}
            onClick={this.handleClick}
          >
            {this.props.label}
          </button>
        </div>
      </div>
    );
  }
}

ButtonElement.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  onUserInput: PropTypes.func,
};

ButtonElement.defaultProps = {
  label: 'Submit',
  type: 'submit',
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
 class CTA extends Component {
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
class LorisElement extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let elementProps = this.props.element;
    elementProps.ref = elementProps.name;
    elementProps.onUserInput = this.props.onUserInput;

    let elementHtml = <div></div>;

    switch (elementProps.type) {
      case 'text':
        elementHtml = (<TextboxElement {...elementProps} />);
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
      case 'link':
        elementHtml = (<LinkElement {...elementProps} />);
        break;
      case 'advcheckbox':
        elementHtml = (<CheckboxElement {...elementProps} />);
        break;
      default:
        console.warn(
          'Element of type ' + elementProps.type + ' is not currently implemented!'
        );
        break;
    }

    return elementHtml;
  }
}

window.FormElement = FormElement;
window.FieldsetElement = FieldsetElement;
window.SelectElement = SelectElement;
window.TagsElement = TagsElement;
window.SearchableDropdown = SearchableDropdown;
window.TextareaElement = TextareaElement;
window.TextboxElement = TextboxElement;
window.DateElement = DateElement;
window.TimeElement = TimeElement;
window.NumericElement = NumericElement;
window.FileElement = FileElement;
window.StaticElement = StaticElement;
window.LinkElement = LinkElement;
window.CheckboxElement = CheckboxElement;
window.ButtonElement = ButtonElement;
window.CTA = CTA;
window.LorisElement = LorisElement;

export default {
  FormElement,
  FieldsetElement,
  SelectElement,
  TagsElement,
  SearchableDropdown,
  TextareaElement,
  TextboxElement,
  DateElement,
  TimeElement,
  NumericElement,
  FileElement,
  StaticElement,
  LinkElement,
  CheckboxElement,
  ButtonElement,
  CTA,
  LorisElement,
};
