/* exported FormElement, SelectElement, FileElement, HelpTextElement,
StaticElement, ButtonElement, HeaderElement, LabelElement, ScoredElement,
TextboxElement, TextareaElement, DateElement, NumericElement, LorisElement
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
 * File Component
 * React wrapper for a simple or 'multiple' <select> element.
 */
var FileElement = React.createClass({
  getInitialState: function() {
    return {
      id: '',
      value: null,
      required: '',
      hasError: false,
      onUserInput: function() {
        console.warn('onUserInput() callback is not set');
      }
    };
  },
  getDefaultProps: function() {
    return {
      label: 'File to Upload',
      name: 'file',
      class: 'fileUpload',
      value: '',
      hasError: false,
      errorMessage: 'The field is required!',
      disabled: false
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
                  name={this.props.name}
                  className={this.props.class}
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

/*
 * This is the React class for a header element
 */
var HeaderElement = React.createClass({
  render: function() {
    return (
      <h2>{this.props.header}</h2>
    );
  }
});

/*
 *This is the React class for a label element
 */
var LabelElement = React.createClass({
  render: function() {
    return (
      <p>{this.props.label}</p>
    );
  }
});

/*
 * This is the React class for a scored element
 */
var ScoredElement = React.createClass({
  render: function() {
    var score = (this.props.score) ? this.props.score : 0;
    return (
      <div className="row form-group">
        <label className="col-sm-3">
          {this.props.label}
        </label>
        <div className="col-sm-9">
          {score}
        </div>
      </div>
    );
  }
});

/*
 * This is the React class for a textbox element
 */
var TextboxElement = React.createClass({
  getInitialState: function() {
    return {
      value: ''
    };
  },
  getDefaultProps: function() {
    return {
      value: '',
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

    // Add required asterix
    if (required) {
      requiredHTML = <span className="text-danger">*</span>;
    }

    return (
      <div className="row form-group">
        <label className="col-sm-3 control-label" htmlFor="hey">
          {this.props.label}
          {requiredHTML}
        </label>
        <div className="col-sm-9">
          <input
            id="hey"
            type="text"
            className="form-control"
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

/*
 * This is the React class for a textarea element
 */
var TextareaElement = React.createClass({
  getDefaultProps: function() {
    return {
      label: '',
      name: '',
      id: null,
      class: 'form-control',
      disabled: false,
      required: false,
      value: '',
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
          <textarea
            id={this.props.label}
            name={this.props.name}
            cols="25"
            rows="4"
            className={this.props.class}
            onChange={this.handleChange}
            value={this.state.value}
            required={required}
            disabled={disabled}
          >
          </textarea>
        </div>
      </div>
    );
  }
});

/*
 * This is the React class for a date element
 */
var DateElement = React.createClass({
  getDefaultProps: function() {
    return {
      label: '',
      name: '',
      id: null,
      disabled: false,
      required: false,
      value: '',
      class: 'form-control',
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
            name={this.props.name}
            id={this.props.label}
            className={this.props.class}
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

/*
 *	This is the React class for a numeric element
 */
var NumericElement = React.createClass({
  render: function() {
    return (
      <div className="row form-group">
        <label className="col-sm-3">
          {this.props.label}
        </label>
        <div className="col-sm-9">
          <input
            type="number"
            className="form-control"
            min={this.props.min}
            max={this.props.max}
          />
        </div>
      </div>
    );
  }
});

/*
 * This is the React class for a LORIS element. It takes
 * in an element and render's the HTML based on its type
 * (Used in instrument builder)
 */
var LorisElement = React.createClass({
  render: function() {
    var element = this.props.element;
    var elementHtml = '';
    switch (element.Type) {
      case 'header':
        elementHtml = <HeaderElement header={element.Description}/>;
        break;
      case 'label':
        elementHtml = <LabelElement label={element.Description}/>;
        break;
      case 'score':
        elementHtml = <ScoredElement label={element.Description}/>;
        break;
      case 'text':
        if (element.Options.Type === 'small') {
          elementHtml = <TextboxElement label={element.Description}/>;
        } else {
          elementHtml = <TextareaElement label={element.Description}/>;
        }
        break;
      case 'select':
        if (element.Options.AllowMultiple) {
          elementHtml = <SelectElement label={element.Description}
                                       options={element.Options.Values}
                                       multiple={true}/>;
        } else {
          elementHtml = <SelectElement label={element.Description}
                                       options={element.Options.Values}/>;
        }
        break;
      case 'date':
        elementHtml = <DateElement
          label={element.Description}
          minYear={element.Options.MinDate}
          maxYear={element.Options.MaxDate}
        />;
        break;
      case 'numeric':
        elementHtml = <NumericElement
          label={element.Description}
          min={element.Options.MinValue}
          max={element.Options.MaxValue}
        />;
        break;
      default:
        break;
    }
    return (
      <div>{elementHtml}</div>
    );
  }
});
