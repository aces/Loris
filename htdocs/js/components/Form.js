/**
 * This file contains React components for Loris form elements.
 *
 * @author Loris Team
 * @version 1.0.0
 *
 */

/**
 * Form Component
 * React wrapper for <form> element that accepts children react components
 */
FormElement = React.createClass({
  displayName: 'FormElement',

  getDefaultProps: function () {
    return {
      'name': '',
      'id': '',
      'action': '',
      'method': 'POST',
      'class': 'form-horizontal'
    };
  },
  handleSubmit: function (e) {
    // Override default submit if property is set
    if (this.props.onSubmit) {
      e.preventDefault();
      this.props.onSubmit(e);
    }
  },
  render: function () {
    return React.createElement(
      'form',
      {
        name: this.props.name,
        action: this.props.action,
        className: this.props.class,
        method: this.props.method,
        encType: 'multipart/form-data',
        onSubmit: this.handleSubmit
      },
      this.props.children
    );
  }
});

/**
 * Select Component
 * React wrapper for a simple or 'multiple' <select> element.
 */
SelectElement = React.createClass({
  displayName: 'SelectElement',

  getDefaultProps: function () {
    return {
      'name': '',
      'id': '',
      'class': '',
      'label': 'Label',
      'options': [],
      'multiple': '',
      'emptyOption': true,
      'disabled': false,
      'hasError': false,
      'required': false,
      'value': '',
      'errorMessage': 'The field is required!',
      'onUserInput': function () {
        console.warn('onUserInput() callback is not set');
      }
    };
  },
  componentDidMount: function () {
    if (this.props.value) {
      this.setState({
        value: this.props.value
      });
    }
  },
  componentWillReceiveProps: function () {
    if (this.props.hasError) {
      this.setState({
        hasError: this.props.hasError
      });
    }
  },
  getInitialState: function () {
    return {
      value: '',
      hasError: false
    };
  },
  handleChange: function (e) {

    var hasError = false;
    if (this.props.required && e.target.value == "") {
      hasError = true;
    }

    this.setState({
      value: e.target.value,
      hasError: hasError
    });

    this.props.onUserInput(this.props.name, e.target.value);
  },
  render: function () {
    var multiple = this.props.multiple ? this.props.multiple : '';
    var options = this.props.options;
    var errorMessage = '';
    var elementClass = 'row form-group';
    var required = this.props.required ? 'required' : '';
    var disabled = this.props.disabled ? 'disabled' : '';
    var emptyOptionHTML = "";

    // Add empty option
    if (this.props.emptyOption) {
      emptyOptionHTML = "<option></option>";
    }

    if (this.state.hasError) {
      errorMessage = this.props.errorMessage;
      elementClass = 'row form-group has-error';
    }

    return React.createElement(
      'div',
      { className: elementClass },
      React.createElement(
        'label',
        { className: 'col-sm-3 control-label', 'for': this.props.label },
        this.props.label
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
          React.createElement('div', { dangerouslySetInnerHTML: { __html: emptyOptionHTML } }),
          Object.keys(options).map(function (option) {
            return React.createElement(
              'option',
              { value: option },
              options[option]
            );
          })
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
 * File Component
 * React wrapper for a simple or 'multiple' <select> element.
 */
FileElement = React.createClass({
  displayName: 'FileElement',

  getInitialState: function () {
    return {
      'id': '',
      'value': null,
      'required': '',
      'hasError': false,
      'onUserInput': function () {
        console.warn('onUserInput() callback is not set');
      }
    };
  },
  getDefaultProps: function () {
    return {
      'label': 'File to Upload',
      'name': 'file',
      'class': 'fileUpload',
      'value': '',
      'hasError': false,
      'errorMessage': 'The field is required!',
      'disabled': false
    };
  },
  componentDidMount: function () {
    if (this.props.value) {
      this.setState({
        value: this.props.value
      });
    }
  },
  componentWillReceiveProps: function () {
    if (this.props.hasError) {
      this.setState({
        hasError: this.props.hasError
      });
    }
  },
  handleChange: function (e) {
    var hasError = false;
    if (this.props.required && e.target.value == "") {
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

  render: function () {
    var required = this.props.required ? 'required' : '';
    var errorMessage = '';
    var elementClass = 'row form-group';

    if (this.state.hasError) {
      errorMessage = this.props.errorMessage;
      elementClass = 'row form-group has-error';
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
        this.props.label
      ),
      React.createElement(
        'div',
        { className: 'col-sm-9' },
        React.createElement(
          'div',
          { className: 'input-group' },
          React.createElement(
            'div',
            { tabindex: '-1',
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
                name: this.props.name,
                className: this.props.class,
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
 */
HelpTextElement = React.createClass({
  displayName: 'HelpTextElement',

  getDefaultProps: function () {
    return {
      'html': false,
      'label': '',
      'text': ''
    };
  },
  render: function () {
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
 * Button component
 * React wrapper for <button> element, typically used to submit forms
 */
ButtonElement = React.createClass({
  displayName: 'ButtonElement',

  getDefaultProps: function () {
    return {
      'label': 'Submit'
    };
  },
  render: function () {
    return React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement(
        'div',
        { className: 'col-sm-9 col-sm-offset-3' },
        React.createElement(
          'button',
          { type: 'submit',
            className: 'btn btn-primary' },
          this.props.label
        )
      )
    );
  }
});

/*
 * This is the React class for a header element
 */
HeaderElement = React.createClass({
  displayName: 'HeaderElement',

  render: function () {
    return React.createElement(
      'h2',
      null,
      this.props.header
    );
  }
});

/*
 *This is the React class for a label element
 */
LabelElement = React.createClass({
  displayName: 'LabelElement',

  render: function () {
    return React.createElement(
      'p',
      null,
      this.props.label
    );
  }
});

/*
 * This is the React class for a scored element
 */
ScoredElement = React.createClass({
  displayName: 'ScoredElement',

  render: function () {
    var score = this.props.score ? this.props.score : 0;
    return React.createElement(
      'div',
      { className: 'row form-group' },
      React.createElement(
        'label',
        { className: 'col-sm-3' },
        this.props.label
      ),
      React.createElement(
        'div',
        { className: 'col-sm-9' },
        score
      )
    );
  }
});

/*
 * This is the React class for a textbox element
 */
TextboxElement = React.createClass({
  displayName: 'TextboxElement',

  getInitialState: function () {
    return {
      'value': ''
    };
  },
  getDefaultProps: function () {
    return {
      'onUserInput': function () {
        console.warn('onUserInput() callback is not set');
      }
    };
  },
  handleChange: function (e) {
    this.setState({
      value: e.target.value
    });
    this.props.onUserInput(this.props.name, e.target.value);
  },
  render: function () {
    return React.createElement(
      'div',
      { className: 'row form-group' },
      React.createElement(
        'label',
        { className: 'col-sm-3' },
        this.props.label
      ),
      React.createElement(
        'div',
        { className: 'col-sm-9' },
        React.createElement('input', {
          type: 'text',
          className: 'form-control',
          onChange: this.handleChange
        })
      )
    );
  }
});

/*
 * This is the React class for a textarea element
 */
TextareaElement = React.createClass({
  displayName: 'TextareaElement',

  getDefaultProps: function () {
    return {
      'label': 'Text Area',
      'name': 'textarea',
      'id': '',
      'class': 'form-control',
      'disabled': '',
      'required': '',
      'value': '',
      'onUserInput': function () {
        console.warn('onUserInput() callback is not set');
      }
    };
  },
  getInitialState: function () {
    return {
      value: ''
    };
  },
  componentDidMount: function () {
    if (this.props.value) {
      this.setState({ value: this.props.value });
    }
  },
  handleChange: function (e) {
    this.setState({
      value: e.target.value
    });
    this.props.onUserInput(this.props.name, e.target.value);
  },
  render: function () {
    return React.createElement(
      'div',
      { className: 'row form-group' },
      React.createElement(
        'label',
        { className: 'col-sm-3 control-label', 'for': this.props.label },
        this.props.label
      ),
      React.createElement(
        'div',
        { className: 'col-sm-9' },
        React.createElement('textarea', {
          id: this.props.label,
          name: this.props.name,
          cols: '25',
          rows: '4',
          className: this.props.class,
          onChange: this.handleChange,
          value: this.state.value
        })
      )
    );
  }
});

/*
 * This is the React class for a date element
 */
DateElement = React.createClass({
  displayName: 'DateElement',

  getDefaultProps: function () {
    return {
      'label': 'Date',
      'name': '',
      'id': '',
      'disabled': '',
      'required': '',
      'value': '',
      'class': 'form-control',
      'onUserInput': function () {
        console.warn('onUserInput() callback is not set');
      }
    };
  },
  getInitialState: function () {
    return {
      value: ''
    };
  },
  componentDidMount: function () {
    if (this.props.value) {
      this.setState({ value: this.props.value });
    }
  },
  handleChange: function (e) {
    this.setState({
      value: e.target.value
    });
    this.props.onUserInput(this.props.name, e.target.value);
  },
  render: function () {
    var required = this.props.required ? 'required' : '';
    return React.createElement(
      'div',
      { className: 'row form-group' },
      React.createElement(
        'label',
        { className: 'col-sm-3 control-label', 'for': this.props.label },
        this.props.label
      ),
      React.createElement(
        'div',
        { className: 'col-sm-9' },
        React.createElement('input', {
          type: 'date',
          name: this.props.name,
          id: this.props.label,
          className: this.props.class,
          min: this.props.minYear,
          max: this.props.maxYear,
          onChange: this.handleChange,
          value: this.state.value,
          required: required
        })
      )
    );
  }
});

/*
 *	This is the React class for a numeric element
 */
NumericElement = React.createClass({
  displayName: 'NumericElement',

  render: function () {
    return React.createElement(
      'div',
      { className: 'row form-group' },
      React.createElement(
        'label',
        { className: 'col-sm-3' },
        this.props.label
      ),
      React.createElement(
        'div',
        { className: 'col-sm-9' },
        React.createElement('input', {
          type: 'number',
          className: 'form-control',
          min: this.props.min,
          max: this.props.max
        })
      )
    );
  }
});

/*
 * This is the React class for a LORIS element. It takes
 * in an element and render's the HTML based on its type
 * (Used in instrument builder)
 */
LorisElement = React.createClass({
  displayName: 'LorisElement',

  render: function () {
    var element = this.props.element,
        elementHtml = '';
    switch (element.Type) {
      case 'header':
        elementHtml = React.createElement(HeaderElement, { header: element.Description });
        break;
      case 'label':
        elementHtml = React.createElement(LabelElement, { label: element.Description });
        break;
      case 'score':
        elementHtml = React.createElement(ScoredElement, { label: element.Description });
        break;
      case 'text':
        if (element.Options.Type === 'small') {
          elementHtml = React.createElement(TextboxElement, { label: element.Description });
        } else {
          elementHtml = React.createElement(TextareaElement, { label: element.Description });
        }
        break;
      case 'select':
        if (element.Options.AllowMultiple) {
          elementHtml = React.createElement(SelectElement, { label: element.Description,
            options: element.Options.Values,
            multiple: 'true' });
        } else {
          elementHtml = React.createElement(SelectElement, { label: element.Description,
            options: element.Options.Values });
        }
        break;
      case 'date':
        elementHtml = React.createElement(DateElement, {
          label: element.Description,
          minYear: element.Options.MinDate,
          maxYear: element.Options.MaxDate
        });
        break;
      case 'numeric':
        elementHtml = React.createElement(NumericElement, {
          label: element.Description,
          min: element.Options.MinValue,
          max: element.Options.MaxValue
        });
      default:
        break;
    }
    return React.createElement(
      'div',
      null,
      elementHtml
    );
  }
});