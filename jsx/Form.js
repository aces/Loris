/* exported FormElement, SelectElement, TextareaElement, TextboxElement, DateElement,
NumericElement, FileElement, HelpTextElement, StaticElement, ButtonElement
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
 */
var FormElement = React.createClass({

  propTypes: {
    name: React.PropTypes.string.isRequired,
    id: React.PropTypes.string,
    method: React.PropTypes.oneOf(['POST', 'GET']),
    class: React.PropTypes.string,
    onSubmit: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      name: null,
      id: null,
      method: 'POST',
      class: 'form-horizontal',
      fileUpload: false,
      onSubmit: function() {
        console.warn('onSubmit() callback is not set!');
      }
    };
  },
  handleSubmit: function(e) {
    // Override default submit if property is set
    if (this.props.onSubmit) {
      e.preventDefault();
      this.props.onSubmit(e);
    }
  },
  render: function() {
    var encType = this.props.fileUpload ? 'multipart/form-data' : null;

    return (
      <form
        name={this.props.name}
        id={this.props.id}
        className={this.props.class}
        method={this.props.method}
        encType={encType}
        onSubmit={this.handleSubmit}
      >
        {this.props.children}
      </form>
    );
  }
});

/**
 * Select Component
 * React wrapper for a simple or 'multiple' <select> element.
 */
var SelectElement = React.createClass({

  propTypes: {
    name: React.PropTypes.string.isRequired,
    options: React.PropTypes.object.isRequired,
    label: React.PropTypes.string,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.array
    ]),
    id: React.PropTypes.string,
    class: React.PropTypes.string,
    multiple: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    required: React.PropTypes.bool,
    emptyOption: React.PropTypes.bool,
    hasError: React.PropTypes.bool,
    errorMessage: React.PropTypes.string,
    onUserInput: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      name: '',
      options: {},
      label: '',
      value: null,
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
  },
  componentDidMount: function() {
    if (this.props.value) {
      this.setState({
        value: this.props.value
      });
    }
  },
  componentWillReceiveProps: function() {
    if (this.props.hasError) {
      this.setState({
        hasError: this.props.hasError
      });
    }
  },
  getInitialState: function() {
    var value = this.props.multiple ? [] : '';
    return {
      value: value,
      hasError: false
    };
  },
  handleChange: function(e) {
    var value = e.target.value;
    var options = e.target.options;
    var hasError = false;
    var isEmpty = (value === "");

    // Multiple values
    if (this.props.multiple && options.length > 1) {
      value = [];
      for (var i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          value.push(options[i].value);
        }
      }
      isEmpty = (value.length > 1);
    }

    // Check for errors
    if (this.props.required && isEmpty) {
      hasError = true;
    }

    this.setState({
      value: value,
      hasError: hasError
    });

    this.props.onUserInput(this.props.name, value);
  },
  render: function() {
    var multiple = this.props.multiple ? 'multiple' : null;
    var required = this.props.required ? 'required' : null;
    var disabled = this.props.disabled ? 'disabled' : null;
    var options = this.props.options;
    var errorMessage = null;
    var emptyOptionHTML = null;
    var requiredHTML = null;
    var elementClass = 'row form-group';

    // Add required asterix
    if (required) {
      requiredHTML = <span className="text-danger">*</span>;
    }

    // Add empty option
    if (this.props.emptyOption) {
      emptyOptionHTML = <option></option>;
    }

    // Add error message
    if (this.state.hasError) {
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
          <select
            name={this.props.name}
            multiple={multiple}
            className="form-control"
            id={this.props.label}
            value={this.state.value}
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
});

/**
 * Textarea Component
 * React wrapper for a <textarea> element.
 */
var TextareaElement = React.createClass({

  propTypes: {
    name: React.PropTypes.string.isRequired,
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    id: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    required: React.PropTypes.bool,
    onUserInput: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      name: '',
      label: '',
      value: '',
      id: null,
      disabled: false,
      required: false,
      onUserInput: function() {
        console.warn('onUserInput() callback is not set');
      }
    };
  },
  getInitialState: function() {
    return {
      value: ''
    };
  },
  componentDidMount: function() {
    if (this.props.value) {
      this.setState({value: this.props.value});
    }
  },
  handleChange: function(e) {
    this.setState({
      value: e.target.value
    });
    this.props.onUserInput(this.props.name, e.target.value);
  },
  render: function() {
    var disabled = this.props.disabled ? 'disabled' : null;
    var required = this.props.required ? 'required' : null;
    var requiredHTML = null;

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
            cols="25"
            rows="4"
            className="form-control"
            name={this.props.name}
            id={this.props.id}
            value={this.state.value}
            required={required}
            disabled={disabled}
            onChange={this.handleChange}
          >
          </textarea>
        </div>
      </div>
    );
  }
});

/**
 * Textbox Component
 * React wrapper for a <input type="text"> element.
 */
var TextboxElement = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    id: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    required: React.PropTypes.bool,
    onUserInput: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      value: ''
    };
  },
  getDefaultProps: function() {
    return {
      name: '',
      label: '',
      value: '',
      id: null,
      disabled: false,
      required: false,
      onUserInput: function() {
        console.warn('onUserInput() callback is not set');
      }
    };
  },
  componentDidMount: function() {
    if (this.props.value) {
      this.setState({
        value: this.props.value
      });
    }
  },
  handleChange: function(e) {
    this.setState({
      value: e.target.value
    });
    this.props.onUserInput(this.props.name, e.target.value);
  },
  render: function() {
    var disabled = this.props.disabled ? 'disabled' : null;
    var required = this.props.required ? 'required' : null;
    var requiredHTML = null;

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
          <input
            type="text"
            className="form-control"
            name={this.props.name}
            id={this.props.id}
            value={this.state.value}
            required={required}
            disabled={disabled}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
});

/**
 * Date Component
 * React wrapper for a <input type="date"> element.
 */
var DateElement = React.createClass({

  propTypes: {
    name: React.PropTypes.string.isRequired,
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    id: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    required: React.PropTypes.bool,
    onUserInput: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      name: '',
      label: '',
      value: '',
      id: null,
      disabled: false,
      required: false,
      onUserInput: function() {
        console.warn('onUserInput() callback is not set');
      }
    };
  },
  getInitialState: function() {
    return {
      value: ''
    };
  },
  componentDidMount: function() {
    if (this.props.value) {
      this.setState({value: this.props.value});
    }
  },
  handleChange: function(e) {
    this.setState({
      value: e.target.value
    });
    this.props.onUserInput(this.props.name, e.target.value);
  },
  render: function() {
    var disabled = this.props.disabled ? 'disabled' : null;
    var required = this.props.required ? 'required' : null;
    var requiredHTML = null;

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
            value={this.state.value}
            required={required}
            disabled={disabled}
          />
        </div>
      </div>
    );
  }
});

/**
 * Numeric Component
 * React wrapper for a <input type="number"> element.
 */
var NumericElement = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    min: React.PropTypes.number.isRequired,
    max: React.PropTypes.number.isRequired,
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    id: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    required: React.PropTypes.bool,
    onUserInput: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      value: ''
    };
  },
  getDefaultProps: function() {
    return {
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
      }
    };
  },
  componentDidMount: function() {
    if (this.props.value) {
      this.setState({
        value: this.props.value
      });
    }
  },
  handleChange: function(e) {
    this.setState({
      value: e.target.value
    });
    this.props.onUserInput(this.props.name, e.target.value);
  },
  render: function() {
    var disabled = this.props.disabled ? 'disabled' : null;
    var required = this.props.required ? 'required' : null;
    var requiredHTML = null;

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
});

/**
 * File Component
 * React wrapper for a simple or 'multiple' <select> element.
 */
var FileElement = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    id: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    required: React.PropTypes.bool,
    hasError: React.PropTypes.bool,
    errorMessage: React.PropTypes.string,
    onUserInput: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      value: '',
      hasError: false
    };
  },
  getDefaultProps: function() {
    return {
      name: '',
      label: 'File to Upload',
      value: '',
      id: null,
      disabled: false,
      required: false,
      hasError: false,
      errorMessage: 'The field is required!',
      onUserInput: function() {
        console.warn('onUserInput() callback is not set');
      }
    };
  },
  componentDidMount: function() {
    if (this.props.value) {
      this.setState({
        value: this.props.value
      });
    }
  },
  componentWillReceiveProps: function() {
    if (this.props.hasError) {
      this.setState({
        hasError: this.props.hasError
      });
    }
  },
  handleChange: function(e) {
    var hasError = false;
    if (this.props.required && e.target.value === "") {
      hasError = true;
    }
    this.setState({
      value: e.target.value.split(/(\\|\/)/g).pop(),
      hasError: hasError
    });
    // pass current file to parent form
    var file = e.target.files[0];
    this.props.onUserInput(this.props.name, file);
  },

  render: function() {
    var required = this.props.required ? 'required' : null;
    var requiredHTML = null;
    var errorMessage = '';
    var elementClass = 'row form-group';

    // Add error message
    if (this.state.hasError) {
      errorMessage = this.props.errorMessage;
      elementClass = 'row form-group has-error';
    }

    // Add required asterix
    if (required) {
      requiredHTML = <span className="text-danger">*</span>;
    }

    var truncateEllipsis = {
      display: 'table',
      tableLayout: 'fixed',
      width: '100%',
      whiteSpace: 'nowrap'
    };

    var truncateEllipsisChild = {
      display: 'table-cell',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    };

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
              <span style={truncateEllipsisChild}>{this.state.value}</span>
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
                <span style={truncateEllipsisChild}>{this.state.value}</span>
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
});

/**
 * HelpText Component
 * Used to display a block of help text in a form
 * @deprecated 08/09/2016
 */
var HelpTextElement = React.createClass({
  componentDidMount: function() {
    console.warn(
      "<HelpTextElement> component is deprecated!" +
      "Please use <StaticElement> instead!"
    );
  },
  getDefaultProps: function() {
    return {
      html: false,
      label: '',
      text: ''
    };
  },
  render: function() {
    if (this.props.html) {
      return (
        <div className="row form-group">
          <label className="col-sm-3 control-label">
            {this.props.label}
          </label>
          <div className="col-sm-9">
            <div dangerouslySetInnerHTML={{__html: this.props.text}}/>
          </div>
        </div>
      );
    }
    return (
      <div className="row form-group">
        <label className="col-sm-3 control-label">
          {this.props.label}
        </label>
        <div className="col-sm-9">
          <div>{this.props.text}</div>
        </div>
      </div>
    );
  }
});

/**
 * Static element component.
 * Used to displays plain/formatted text as part of a form
 */
var StaticElement = React.createClass({

  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    label: React.PropTypes.string,
    text: React.PropTypes.string.isRequired
  },

  getDefaultProps: function() {
    return {
      label: '',
      text: null
    };
  },

  render: function() {
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
});

/**
 * Button component
 * React wrapper for <button> element, typically used to submit forms
 */
var ButtonElement = React.createClass({
  propTypes: {
    label: React.PropTypes.string,
    type: React.PropTypes.string,
    onUserInput: React.PropTypes.func
  },
  getInitialState: function() {
    return {};
  },
  getDefaultProps: function() {
    return {
      label: 'Submit',
      type: 'submit',
      onUserInput: function() {
        console.warn('onUserInput() callback is not set');
      }
    };
  },
  handleClick: function(e) {
    this.props.onUserInput(e);
  },
  render: function() {
    return (
      <div className="row form-group">
        <div className="col-sm-9 col-sm-offset-3">
          <button type={this.props.type}
                  className="btn btn-primary"
                  onClick={this.handleClick}>
            {this.props.label}
          </button>
        </div>
      </div>
    );
  }
});
