/* exported FormElement, SelectElement, SearchableDropdown, TextareaElement, TextboxElement,
DateElement, NumericElement, FileElement, StaticElement, LinkElement, ButtonElement, LorisElement
*/

/**
 * This file contains React components for Loris form elements.
 *
 * @author Loris Team
 * @version 1.0.0
 *
 */

import {Component} from 'react';
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
class FormElement extends Component {
  constructor() {
    super();
    this.getFormElements = this.getFormElements.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getFormElements() {
    const formElementsHTML = [];
    const columns = this.props.columns;
    const maxColumnSize = 12;
    const colSize = Math.floor(maxColumnSize / columns);
    const colClass = "col-xs-12 col-sm-" + colSize + " col-md-" + colSize;

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
      let elementClass = "col-xs-12 col-sm-12 col-md-12";

      // If child is form element use appropriate size
      if (React.isValidElement(child) && typeof child.type === "function") {
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
      display: "flex",
      flexWrap: "wrap"
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
      type: PropTypes.string
    })
  }),
  onSubmit: PropTypes.func,
  onUserInput: PropTypes.func
};

FormElement.defaultProps = {
  name: null,
  id: '',
  method: 'POST',
  action: undefined,
  class: 'form-horizontal',
  columns: 1,
  fileUpload: false,
  formElements: {},
  onSubmit: function() {
    console.warn('onSubmit() callback is not set!');
  }
};

/**
 * Search Component
 * React wrapper for a searchable dropdown
 */
class SearchableDropdown extends Component {
  constructor() {
    super();
    this.getKeyFromValue = this.getKeyFromValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.getTextInputValue = this.getTextInputValue.bind(this);
  }

  getKeyFromValue(value) {
    let options = this.props.options;
    return Object.keys(options).find(function(o) {
      return options[o] === value;
    });
  }

  handleChange(e) {
    let value = this.getKeyFromValue(e.target.value);
    // if not in strict mode and key value is not defined (i.e., not in options)
    // set value equal to e.target.value
    if (!this.props.strictSearch && value === undefined) {
      value = e.target.value;
    }
    this.props.onUserInput(this.props.name, value);
  }

  handleBlur(e) {
    // null out entry if not present in options in strict mode
    if (this.props.strictSearch) {
      let value = e.target.value;
      let options = this.props.options;
      if (Object.values(options).indexOf(value) === -1) {
        // empty string out both the hidden value as well as the input text
        document.querySelector(`input[name="${this.props.name + '_input'}"]`).value = '';
        this.props.onUserInput(this.props.name, '');
      }
    }
  }

  getTextInputValue() {
    return document.querySelector(`input[name="${this.props.name + '_input'}"]`).value;
  }

  render() {
    let required = this.props.required ? 'required' : null;
    let disabled = this.props.disabled ? 'disabled' : null;
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
    } else if (this.props.required && this.props.value === "") {
      let msg = 'This field is required!';
      msg += (this.props.strictSearch ? ' ' + strictMessage : '');
      errorMessage = <span>{msg}</span>;
      elementClass = 'row form-group has-error';
    } else if (this.props.strictSearch && this.props.value === "") {
      errorMessage = <span>{strictMessage}</span>;
      elementClass = 'row form-group has-error';
    }

    // determine value to place into text input
    let value;
    // use value in options if valid
    if (this.props.value !== undefined) {
      if (Object.keys(options).indexOf(this.props.value) > -1) {
        value = options[this.props.value];
        // else, use input text value
      } else {
        value = this.getTextInputValue();
      }
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
          />
          <datalist id={this.props.name + '_list'}>
            {Object.keys(options).map(function(option) {
              return (
                <option value={options[option]} key={option}/>
              );
            })}
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
    PropTypes.array
  ]),
  class: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  errorMessage: PropTypes.string,
  placeHolder: PropTypes.string,
  onUserInput: PropTypes.func
};

SearchableDropdown.defaultProps = {
  name: '',
  options: {},
  strictSearch: true,
  label: '',
  value: undefined,
  id: '',
  class: '',
  disabled: false,
  required: false,
  errorMessage: '',
  placeHolder: '',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  }
};

/**
 * Select Component
 * React wrapper for a simple or 'multiple' <select> element.
 */
class SelectElement extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    let value = e.target.value;
    let options = e.target.options;
    const numOfOptions = options.length;

    // Multiple values
    if (this.props.multiple && numOfOptions > 1) {
      value = [];
      for (let i = 0, l = numOfOptions; i < l; i++) {
        if (options[i].selected) {
          value.push(options[i].value);
        }
      }
    }

    this.props.onUserInput(this.props.name, value);
  }

  render() {
    let multiple = this.props.multiple ? 'multiple' : null;
    let required = this.props.required ? 'required' : null;
    let disabled = this.props.disabled ? 'disabled' : null;
    let options = this.props.options;
    let errorMessage = null;
    let emptyOptionHTML = null;
    let requiredHTML = null;
    let elementClass = 'row form-group';

    // Add required asterix
    if (required) {
      requiredHTML = <span className="text-danger">*</span>;
    }

    // Add empty option
    if (this.props.emptyOption) {
      emptyOptionHTML = <option></option>;
    }

    // Add error message
    if (this.props.hasError || (this.props.required && this.props.value === "")) {
      errorMessage = <span>{this.props.errorMessage}</span>;
      elementClass = 'row form-group has-error';
    }

    // Default to empty string for regular select and to empty array for 'multiple' select
    const value = this.props.value || (multiple ? [] : "");

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
            id={this.props.label}
            value={value}
            onChange={this.handleChange}
            required={required}
            disabled={disabled}
          >
            {emptyOptionHTML}
            {Object.keys(options).map(function(option) {
              return (
                <option value={option} key={option}>{options[option]}</option>
              );
            })}
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
    PropTypes.array
  ]),
  id: PropTypes.string,
  class: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  emptyOption: PropTypes.bool,
  hasError: PropTypes.bool,
  errorMessage: PropTypes.string,
  onUserInput: PropTypes.func
};

SelectElement.defaultProps = {
  name: '',
  options: {},
  label: '',
  value: undefined,
  id: '',
  class: '',
  multiple: false,
  disabled: false,
  required: false,
  emptyOption: true,
  hasError: false,
  errorMessage: 'The field is required!',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  }
};

/**
 * Textarea Component
 * React wrapper for a <textarea> element.
 */
class TextareaElement extends Component {
  constructor() {
    super();
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
            value={this.props.value || ""}
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
  onUserInput: PropTypes.func
};

TextareaElement.defaultProps = {
  name: '',
  label: '',
  value: '',
  id: '',
  disabled: false,
  required: false,
  rows: 4,
  cols: 25,
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  }
};

/**
 * Textbox Component
 * React wrapper for a <input type="text"> element.
 */
class TextboxElement extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleChange(e) {
    this.props.onUserInput(this.props.name, e.target.value);
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
            value={this.props.value || ""}
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
  onUserBlur: PropTypes.func
};

TextboxElement.defaultProps = {
  name: '',
  label: '',
  value: '',
  id: '',
  disabled: false,
  required: false,
  errorMessage: '',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
  onUserBlur: function() {
  }
};

/**
 * Date Component
 * React wrapper for a <input type="date"> element.
 */
class DateElement extends Component {
  constructor() {
    super();
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
        <label className="col-sm-3 control-label" htmlFor={this.props.label}>
          {this.props.label}
          {requiredHTML}
        </label>
        <div className="col-sm-9">
          <input
            type="date"
            className="form-control"
            name={this.props.name}
            id={this.props.label}
            min={this.props.minYear}
            max={this.props.maxYear}
            onChange={this.handleChange}
            value={this.props.value || ""}
            required={required}
            disabled={disabled}
          />
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
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  onUserInput: PropTypes.func
};

DateElement.defaultProps = {
  name: '',
  label: '',
  value: '',
  id: '',
  disabled: false,
  required: false,
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  }
};

/**
 * Numeric Component
 * React wrapper for a <input type="number"> element.
 */
class NumericElement extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onUserInput(this.props.name, e.target.value);
  }

  render() {
    let disabled = this.props.disabled ? 'disabled' : null;
    let required = this.props.required ? 'required' : null;
    let requiredHTML = null;

    return (
      <div className="row form-group">
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
  onUserInput: PropTypes.func
};

NumericElement.defaultProps = {
  name: '',
  min: null,
  max: null,
  label: '',
  value: '',
  id: '',
  required: false,
  disabled: false,
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  }
};

/**
 * File Component
 * React wrapper for a simple or 'multiple' <select> element.
 */
class FileElement extends Component {
  constructor() {
    super();
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
      whiteSpace: 'nowrap'
    };

    const truncateEllipsisChild = {
      display: 'table-cell',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    };

    // Add error message
    if (this.props.hasError) {
      errorMessage = this.props.errorMessage;
      elementClass = 'row form-group has-error';
    }

    // Need to manually reset file value, because HTML API
    // does not allow setting value to anything than empty string.
    // Hence can't use value attribute in the input element.
    const fileHTML = document.querySelector(".fileUpload");
    if (fileHTML && !fileName) {
      fileHTML.value = "";
    }

    if (this.props.disabled) {
      // add padding to align video title on disabled field
      truncateEllipsis.paddingTop = "7px";
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
    PropTypes.object
  ]),
  id: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  hasError: PropTypes.bool,
  errorMessage: PropTypes.string,
  onUserInput: PropTypes.func
};

FileElement.defaultProps = {
  name: '',
  label: 'File to Upload',
  value: '',
  id: '',
  disabled: false,
  required: false,
  hasError: false,
  errorMessage: 'The field is required!',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  }
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
    PropTypes.element
  ])
};

StaticElement.defaultProps = {
  label: '',
  text: null
};

/**
 * Link element component.
 * Used to link plain/formated text to an href destination as part of a form
 */
class LinkElement extends Component {

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
    PropTypes.element
  ]),
  href: PropTypes.string
};

LinkElement.defaultProps = {
  label: '',
  text: null,
  href: null
};

/**
 * Button component
 * React wrapper for <button> element, typically used to submit forms
 */
class ButtonElement extends Component {
  constructor() {
    super();
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
  label: PropTypes.string,
  type: PropTypes.string,
  onUserInput: PropTypes.func
};

ButtonElement.defaultProps = {
  label: 'Submit',
  type: 'submit',
  buttonClass: 'btn btn-primary',
  columnSize: 'col-sm-9 col-sm-offset-3',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  }
};

/**
 * Generic form element.
 */
class LorisElement extends Component {

  render() {
    let elementProps = this.props.element;
    elementProps.ref = elementProps.name;
    elementProps.onUserInput = this.props.onUserInput;

    let elementHtml = <div></div>;

    switch (elementProps.type) {
      case 'text':
        elementHtml = (<TextboxElement {...elementProps} />);
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
      default:
        console.warn(
          "Element of type " + elementProps.type + " is not currently implemented!"
        );
        break;
    }

    return elementHtml;
  }
}

window.FormElement = FormElement;
window.SelectElement = SelectElement;
window.SearchableDropdown = SearchableDropdown;
window.TextareaElement = TextareaElement;
window.TextboxElement = TextboxElement;
window.DateElement = DateElement;
window.NumericElement = NumericElement;
window.FileElement = FileElement;
window.StaticElement = StaticElement;
window.LinkElement = LinkElement;
window.ButtonElement = ButtonElement;
window.LorisElement = LorisElement;

export default {
  FormElement,
  SelectElement,
  SearchableDropdown,
  TextareaElement,
  TextboxElement,
  DateElement,
  NumericElement,
  FileElement,
  StaticElement,
  LinkElement,
  ButtonElement,
  LorisElement
};
