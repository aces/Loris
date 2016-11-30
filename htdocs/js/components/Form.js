'use strict';

/* exported FormElement, SelectElement, TextareaElement, TextboxElement, DateElement,
NumericElement, FileElement, HelpTextElement, StaticElement, ButtonElement, LorisElement
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
var FormElement = React.createClass({
  displayName: 'FormElement',


  propTypes: {
    name: React.PropTypes.string.isRequired,
    id: React.PropTypes.string,
    method: React.PropTypes.oneOf(['POST', 'GET']),
    class: React.PropTypes.string,
    columns: React.PropTypes.number,
    formElements: React.PropTypes.array,
    onSubmit: React.PropTypes.func,
    onUserInput: React.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      name: null,
      id: null,
      method: 'POST',
      class: 'form-horizontal',
      columns: 1,
      fileUpload: false,
      formElements: [],
      onSubmit: function onSubmit() {
        console.warn('onSubmit() callback is not set!');
      },
      onUserInput: function onUserInput() {
        console.warn("onUserInput() callback is not set!");
      }
    };
  },
  getFormElements: function getFormElements() {
    var formElementsHTML = [];
    var columns = this.props.columns;
    var maxColumnSize = 12;
    var colSize = Math.floor(maxColumnSize / columns);
    var colClass = "col-xs-12 col-sm-" + colSize + " col-md-" + colSize;

    // Render elements from JSON
    var filter = this.props.formElements;
    var userInput = this.props.onUserInput;

    filter.forEach(function (element) {
      formElementsHTML.push(React.createElement(
        'div',
        { className: colClass },
        React.createElement(LorisElement, {
          element: element,
          onUserInput: userInput
        })
      ));
    });

    // Render elements from React
    React.Children.forEach(this.props.children, function (child) {
      if (typeof child.type === 'function') {
        formElementsHTML.push(React.createElement(
          'div',
          { className: colClass },
          child
        ));
      } else {
        // If child is plain HTML, insert it as full size.
        // Useful for inserting <hr> to split form sections
        formElementsHTML.push(React.createElement(
          'div',
          { className: 'col-xs-12 col-sm-12 col-md-12' },
          child
        ));
      }
    });

    return formElementsHTML;
  },
  handleSubmit: function handleSubmit(e) {
    // Override default submit if property is set
    if (this.props.onSubmit) {
      e.preventDefault();
      this.props.onSubmit(e);
    }
  },
  render: function render() {
    var encType = this.props.fileUpload ? 'multipart/form-data' : null;

    // Generate form elements
    var formElements = this.getFormElements();

    // Flexbox is set to ensure that columns of different heights
    // are displayed proportionally on the screen
    var rowStyles = {
      display: "flex",
      flexWrap: "wrap"
    };

    return React.createElement(
      'form',
      {
        name: this.props.name,
        id: this.props.id,
        className: this.props.class,
        method: this.props.method,
        encType: encType,
        onSubmit: this.handleSubmit
      },
      React.createElement(
        'div',
        { className: 'row', style: rowStyles },
        formElements
      )
    );
  }
});

/**
 * Select Component
 * React wrapper for a simple or 'multiple' <select> element.
 */
var SelectElement = React.createClass({
  displayName: 'SelectElement',


  propTypes: {
    name: React.PropTypes.string.isRequired,
    options: React.PropTypes.object.isRequired,
    label: React.PropTypes.string,
    value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array]),
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

  getDefaultProps: function getDefaultProps() {
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
      onUserInput: function onUserInput() {
        console.warn('onUserInput() callback is not set');
      }
    };
  },
  componentDidMount: function componentDidMount() {
    if (this.props.value) {
      this.setState({
        value: this.props.value
      });
    }
  },
  componentWillReceiveProps: function componentWillReceiveProps() {
    if (this.props.hasError) {
      this.setState({
        hasError: this.props.hasError
      });
    }
  },
  getInitialState: function getInitialState() {
    var value = this.props.multiple ? [] : '';
    return {
      value: value,
      hasError: false
    };
  },
  handleChange: function handleChange(e) {
    var value = e.target.value;
    var options = e.target.options;
    var hasError = false;
    var isEmpty = value === "";

    // Multiple values
    if (this.props.multiple && options.length > 1) {
      value = [];
      for (var i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          value.push(options[i].value);
        }
      }
      isEmpty = value.length > 1;
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
  render: function render() {
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
      requiredHTML = React.createElement(
        'span',
        { className: 'text-danger' },
        '*'
      );
    }

    // Add empty option
    if (this.props.emptyOption) {
      emptyOptionHTML = React.createElement('option', null);
    }

    // Add error message
    if (this.state.hasError) {
      errorMessage = React.createElement(
        'span',
        null,
        this.props.errorMessage
      );
      elementClass = 'row form-group has-error';
    }

    return React.createElement(
      'div',
      { className: elementClass },
      React.createElement(
        'label',
        { className: 'col-sm-3 control-label', htmlFor: this.props.label },
        this.props.label,
        requiredHTML
      ),
      React.createElement(
        'div',
        { className: 'col-sm-9' },
        React.createElement(
          'select',
          {
            name: this.props.name,
            multiple: multiple,
            className: 'form-control',
            id: this.props.label,
            value: this.state.value,
            onChange: this.handleChange,
            required: required,
            disabled: disabled
          },
          emptyOptionHTML,
          Object.keys(options).map(function (option) {
            return React.createElement(
              'option',
              { value: option, key: option },
              options[option]
            );
          })
        ),
        errorMessage
      )
    );
  }
});

/**
 * Textarea Component
 * React wrapper for a <textarea> element.
 */
var TextareaElement = React.createClass({
  displayName: 'TextareaElement',


  propTypes: {
    name: React.PropTypes.string.isRequired,
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    id: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    required: React.PropTypes.bool,
    onUserInput: React.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      name: '',
      label: '',
      value: '',
      id: null,
      disabled: false,
      required: false,
      onUserInput: function onUserInput() {
        console.warn('onUserInput() callback is not set');
      }
    };
  },
  getInitialState: function getInitialState() {
    return {
      value: ''
    };
  },
  componentDidMount: function componentDidMount() {
    if (this.props.value) {
      this.setState({ value: this.props.value });
    }
  },
  handleChange: function handleChange(e) {
    this.setState({
      value: e.target.value
    });
    this.props.onUserInput(this.props.name, e.target.value);
  },
  render: function render() {
    var disabled = this.props.disabled ? 'disabled' : null;
    var required = this.props.required ? 'required' : null;
    var requiredHTML = null;

    // Add required asterix
    if (required) {
      requiredHTML = React.createElement(
        'span',
        { className: 'text-danger' },
        '*'
      );
    }

    return React.createElement(
      'div',
      { className: 'row form-group' },
      React.createElement(
        'label',
        { className: 'col-sm-3 control-label', htmlFor: this.props.id },
        this.props.label,
        requiredHTML
      ),
      React.createElement(
        'div',
        { className: 'col-sm-9' },
        React.createElement('textarea', {
          cols: '25',
          rows: '4',
          className: 'form-control',
          name: this.props.name,
          id: this.props.id,
          value: this.state.value,
          required: required,
          disabled: disabled,
          onChange: this.handleChange
        })
      )
    );
  }
});

/**
 * Textbox Component
 * React wrapper for a <input type="text"> element.
 */
var TextboxElement = React.createClass({
  displayName: 'TextboxElement',

  propTypes: {
    name: React.PropTypes.string.isRequired,
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    id: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    required: React.PropTypes.bool,
    onUserInput: React.PropTypes.func
  },
  getInitialState: function getInitialState() {
    return {
      value: ''
    };
  },
  getDefaultProps: function getDefaultProps() {
    return {
      name: '',
      label: '',
      value: '',
      id: null,
      disabled: false,
      required: false,
      onUserInput: function onUserInput() {
        console.warn('onUserInput() callback is not set');
      }
    };
  },
  componentDidMount: function componentDidMount() {
    if (this.props.value) {
      this.setState({
        value: this.props.value
      });
    }
  },
  handleChange: function handleChange(e) {
    this.setState({
      value: e.target.value
    });
    this.props.onUserInput(this.props.name, e.target.value);
  },
  render: function render() {
    var disabled = this.props.disabled ? 'disabled' : null;
    var required = this.props.required ? 'required' : null;
    var requiredHTML = null;

    // Add required asterix
    if (required) {
      requiredHTML = React.createElement(
        'span',
        { className: 'text-danger' },
        '*'
      );
    }

    return React.createElement(
      'div',
      { className: 'row form-group' },
      React.createElement(
        'label',
        { className: 'col-sm-3 control-label', htmlFor: this.props.id },
        this.props.label,
        requiredHTML
      ),
      React.createElement(
        'div',
        { className: 'col-sm-9' },
        React.createElement('input', {
          type: 'text',
          className: 'form-control',
          name: this.props.name,
          id: this.props.id,
          value: this.state.value,
          required: required,
          disabled: disabled,
          onChange: this.handleChange
        })
      )
    );
  }
});

/**
 * Date Component
 * React wrapper for a <input type="date"> element.
 */
var DateElement = React.createClass({
  displayName: 'DateElement',


  propTypes: {
    name: React.PropTypes.string.isRequired,
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    id: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    required: React.PropTypes.bool,
    onUserInput: React.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      name: '',
      label: '',
      value: '',
      id: null,
      disabled: false,
      required: false,
      onUserInput: function onUserInput() {
        console.warn('onUserInput() callback is not set');
      }
    };
  },
  getInitialState: function getInitialState() {
    return {
      value: ''
    };
  },
  componentDidMount: function componentDidMount() {
    if (this.props.value) {
      this.setState({ value: this.props.value });
    }
  },
  handleChange: function handleChange(e) {
    this.setState({
      value: e.target.value
    });
    this.props.onUserInput(this.props.name, e.target.value);
  },
  render: function render() {
    var disabled = this.props.disabled ? 'disabled' : null;
    var required = this.props.required ? 'required' : null;
    var requiredHTML = null;

    // Add required asterix
    if (required) {
      requiredHTML = React.createElement(
        'span',
        { className: 'text-danger' },
        '*'
      );
    }

    return React.createElement(
      'div',
      { className: 'row form-group' },
      React.createElement(
        'label',
        { className: 'col-sm-3 control-label', htmlFor: this.props.label },
        this.props.label,
        requiredHTML
      ),
      React.createElement(
        'div',
        { className: 'col-sm-9' },
        React.createElement('input', {
          type: 'date',
          className: 'form-control',
          name: this.props.name,
          id: this.props.label,
          min: this.props.minYear,
          max: this.props.maxYear,
          onChange: this.handleChange,
          value: this.state.value,
          required: required,
          disabled: disabled
        })
      )
    );
  }
});

/**
 * Numeric Component
 * React wrapper for a <input type="number"> element.
 */
var NumericElement = React.createClass({
  displayName: 'NumericElement',

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
  getInitialState: function getInitialState() {
    return {
      value: ''
    };
  },
  getDefaultProps: function getDefaultProps() {
    return {
      name: '',
      min: null,
      max: null,
      label: '',
      value: '',
      id: null,
      required: false,
      disabled: false,
      onUserInput: function onUserInput() {
        console.warn('onUserInput() callback is not set');
      }
    };
  },
  componentDidMount: function componentDidMount() {
    if (this.props.value) {
      this.setState({
        value: this.props.value
      });
    }
  },
  handleChange: function handleChange(e) {
    this.setState({
      value: e.target.value
    });
    this.props.onUserInput(this.props.name, e.target.value);
  },
  render: function render() {
    var disabled = this.props.disabled ? 'disabled' : null;
    var required = this.props.required ? 'required' : null;
    var requiredHTML = null;

    return React.createElement(
      'div',
      { className: 'row form-group' },
      React.createElement(
        'label',
        { className: 'col-sm-3 control-label', htmlFor: this.props.id },
        this.props.label,
        requiredHTML
      ),
      React.createElement(
        'div',
        { className: 'col-sm-9' },
        React.createElement('input', {
          type: 'number',
          className: 'form-control',
          name: this.props.name,
          id: this.props.id,
          min: this.props.min,
          max: this.props.max,
          value: this.props.value,
          disabled: disabled,
          required: required,
          onChange: this.handleChange
        })
      )
    );
  }
});

/**
 * File Component
 * React wrapper for a simple or 'multiple' <select> element.
 */
var FileElement = React.createClass({
  displayName: 'FileElement',

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
  getInitialState: function getInitialState() {
    return {
      value: '',
      hasError: false
    };
  },
  getDefaultProps: function getDefaultProps() {
    return {
      name: '',
      label: 'File to Upload',
      value: '',
      id: null,
      disabled: false,
      required: false,
      hasError: false,
      errorMessage: 'The field is required!',
      onUserInput: function onUserInput() {
        console.warn('onUserInput() callback is not set');
      }
    };
  },
  componentDidMount: function componentDidMount() {
    if (this.props.value) {
      this.setState({
        value: this.props.value
      });
    }
  },
  componentWillReceiveProps: function componentWillReceiveProps() {
    if (this.props.hasError) {
      this.setState({
        hasError: this.props.hasError
      });
    }
  },
  handleChange: function handleChange(e) {
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

  render: function render() {
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
      requiredHTML = React.createElement(
        'span',
        { className: 'text-danger' },
        '*'
      );
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

      return React.createElement(
        'div',
        { className: elementClass },
        React.createElement(
          'label',
          { className: 'col-sm-3 control-label' },
          this.props.label
        ),
        React.createElement(
          'div',
          { className: 'col-sm-9' },
          React.createElement(
            'div',
            { style: truncateEllipsis },
            React.createElement(
              'span',
              { style: truncateEllipsisChild },
              this.state.value
            )
          )
        )
      );
    }

    return React.createElement(
      'div',
      { className: elementClass },
      React.createElement(
        'label',
        { className: 'col-sm-3 control-label' },
        this.props.label,
        requiredHTML
      ),
      React.createElement(
        'div',
        { className: 'col-sm-9' },
        React.createElement(
          'div',
          { className: 'input-group' },
          React.createElement(
            'div',
            { tabIndex: '-1',
              className: 'form-control file-caption kv-fileinput-caption' },
            React.createElement(
              'div',
              { style: truncateEllipsis },
              React.createElement(
                'span',
                { style: truncateEllipsisChild },
                this.state.value
              )
            ),
            React.createElement('div', { className: 'file-caption-name', id: 'video_file' })
          ),
          React.createElement(
            'div',
            { className: 'input-group-btn' },
            React.createElement(
              'div',
              { className: 'btn btn-primary btn-file' },
              React.createElement('i', { className: 'glyphicon glyphicon-folder-open' }),
              ' Browse',
              React.createElement('input', {
                type: 'file',
                className: 'fileUpload',
                name: this.props.name,
                onChange: this.handleChange,
                required: required
              })
            )
          )
        ),
        React.createElement(
          'span',
          null,
          errorMessage
        )
      )
    );
  }
});

/**
 * HelpText Component
 * Used to display a block of help text in a form
 * @deprecated 08/09/2016
 */
var HelpTextElement = React.createClass({
  displayName: 'HelpTextElement',

  componentDidMount: function componentDidMount() {
    console.warn("<HelpTextElement> component is deprecated!" + "Please use <StaticElement> instead!");
  },
  getDefaultProps: function getDefaultProps() {
    return {
      html: false,
      label: '',
      text: ''
    };
  },
  render: function render() {
    if (this.props.html) {
      return React.createElement(
        'div',
        { className: 'row form-group' },
        React.createElement(
          'label',
          { className: 'col-sm-3 control-label' },
          this.props.label
        ),
        React.createElement(
          'div',
          { className: 'col-sm-9' },
          React.createElement('div', { dangerouslySetInnerHTML: { __html: this.props.text } })
        )
      );
    }
    return React.createElement(
      'div',
      { className: 'row form-group' },
      React.createElement(
        'label',
        { className: 'col-sm-3 control-label' },
        this.props.label
      ),
      React.createElement(
        'div',
        { className: 'col-sm-9' },
        React.createElement(
          'div',
          null,
          this.props.text
        )
      )
    );
  }
});

/**
 * Static element component.
 * Used to displays plain/formatted text as part of a form
 */
var StaticElement = React.createClass({
  displayName: 'StaticElement',


  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    label: React.PropTypes.string,
    text: React.PropTypes.string.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      label: '',
      text: null
    };
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'row form-group' },
      React.createElement(
        'label',
        { className: 'col-sm-3 control-label' },
        this.props.label
      ),
      React.createElement(
        'div',
        { className: 'col-sm-9' },
        React.createElement(
          'p',
          { className: 'form-control-static' },
          this.props.text
        )
      )
    );
  }
});

/**
 * Button component
 * React wrapper for <button> element, typically used to submit forms
 */
var ButtonElement = React.createClass({
  displayName: 'ButtonElement',

  propTypes: {
    label: React.PropTypes.string,
    type: React.PropTypes.string,
    onUserInput: React.PropTypes.func
  },
  getInitialState: function getInitialState() {
    return {};
  },
  getDefaultProps: function getDefaultProps() {
    return {
      label: 'Submit',
      type: 'submit',
      buttonClass: 'btn btn-primary',
      columnSize: 'col-sm-9 col-sm-offset-3',
      onUserInput: function onUserInput() {
        console.warn('onUserInput() callback is not set');
      }
    };
  },
  handleClick: function handleClick(e) {
    this.props.onUserInput(e);
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'row form-group' },
      React.createElement(
        'div',
        { className: this.props.columnSize },
        React.createElement(
          'button',
          {
            type: this.props.type,
            className: this.props.buttonClass,
            onClick: this.handleClick
          },
          this.props.label
        )
      )
    );
  }
});

/**
 * Generic form element.
 */
var LorisElement = React.createClass({
  displayName: 'LorisElement',


  render: function render() {
    var elementProps = this.props.element;
    elementProps.ref = elementProps.name;
    elementProps.onUserInput = this.props.onUserInput;

    var elementHtml = React.createElement('div', null);

    switch (elementProps.type) {
      case 'text':
        elementHtml = React.createElement(TextboxElement, elementProps);
        break;
      case 'select':
        elementHtml = React.createElement(SelectElement, elementProps);
        break;
      case 'date':
        elementHtml = React.createElement(DateElement, elementProps);
        break;
      case 'numeric':
        elementHtml = React.createElement(NumericElement, elementProps);
        break;
      case 'textarea':
        elementHtml = React.createElement(TextareaElement, elementProps);
        break;
      case 'file':
        elementHtml = React.createElement(FileElement, elementProps);
        break;
      default:
        console.warn("Element of type " + elementProps.type + " is not currently implemented!");
        break;
    }

    return elementHtml;
  }
});