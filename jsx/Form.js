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
  getDefaultProps: function() {
    return {
      'name': '',
      'id': '',
      'action': '',
      'method': 'POST',
      'class': 'form-horizontal'
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
    return (
      <form
        name={this.props.name}
        action={this.props.action}
        className={this.props.class}
        method={this.props.method}
        encType="multipart/form-data"
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
SelectElement = React.createClass({
  getDefaultProps: function() {
    return {
      'name':     '',
      'id':       '',
      'class':    '',
      'label':    'Label',
      'options':  [],
      'multiple': '',
      'emptyOption': true,
      'disabled': false,
      'hasError': false,
      'required': false,
      'value': '',
      'errorMessage': 'The field is required!',
      'onUserInput': function() {
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
      })
    }
  },
  getInitialState: function() {
    return {
      value: '',
      hasError: false
    }
  },
  handleChange: function(e) {

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
  render: function() {
    var multiple = this.props.multiple ? this.props.multiple : '';
    var options = this.props.options;
    var errorMessage = '';
    var elementClass = 'row form-group';
    var required = this.props.required ? 'required' : '';
    var disabled = this.props.disabled ? 'disabled' : '';
    var emptyOptionHTML = "";

    // Add empty option
    if (this.props.emptyOption) {
      emptyOptionHTML = "<option></option>"
    }

    if (this.state.hasError) {
      errorMessage = this.props.errorMessage;
      elementClass = 'row form-group has-error';
    }

    return (
      <div className={elementClass}>
        <label className="col-sm-3 control-label" for={this.props.label}>
          {this.props.label}
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
            <div dangerouslySetInnerHTML={{__html: emptyOptionHTML}} />
            {Object.keys(options).map(function (option) {
              return <option value={option}>{options[option]}</option>
            })}
          </select>
          <span>{errorMessage}</span>
        </div>
      </div>
    )
  }
});

/**
 * File Component
 * React wrapper for a simple or 'multiple' <select> element.
 */
FileElement = React.createClass({
  getInitialState: function() {
    return {
      'id': '',
      'value': null,
      'required': '',
      'hasError': false,
      'onUserInput': function() {
        console.warn('onUserInput() callback is not set');
      }
    }
  },
  getDefaultProps: function() {
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
      })
    }
  },
  handleChange: function(e) {
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

  render: function() {
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
      whiteSpace: 'nowrap',
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
        </label>
        <div className="col-sm-9">
          <div className="input-group">
            <div tabindex="-1"
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
 */
HelpTextElement = React.createClass({
  getDefaultProps: function() {
    return {
      'html': false,
      'label': '',
      'text': ''
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
 * Button component
 * React wrapper for <button> element, typically used to submit forms
 */
ButtonElement = React.createClass({
  getDefaultProps: function() {
    return {
      'label': 'Submit'
    };
  },
  render: function() {
    return (
      <div className="form-group">
        <div className="col-sm-9 col-sm-offset-3">
          <button type="submit"
                  className="btn btn-primary">{this.props.label}</button>
        </div>
      </div>
    );
  }
});

/*
 * This is the React class for a header element
 */
HeaderElement = React.createClass({
  render: function() {
    return (
      <h2>{this.props.header}</h2>
    )
  }
});

/*
 *This is the React class for a label element
 */
LabelElement = React.createClass({
  render: function() {
    return (
      <p>{this.props.label}</p>
    )
  }
});

/*
 * This is the React class for a scored element
 */
ScoredElement = React.createClass({
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
    )
  }
});

/*
 * This is the React class for a textbox element
 */
TextboxElement = React.createClass({
    getInitialState: function() {
        return {
            'value': ''
        }
    },
    getDefaultProps: function() {
        return {
            'onUserInput': function() {
                console.warn('onUserInput() callback is not set');
            }
        }
    },
    handleChange: function(e) {
        this.setState({
            value: e.target.value
        });
        this.props.onUserInput(this.props.name, e.target.value);
    },
    render: function() {
        return (
            <div className="row form-group">
                <label className="col-sm-3">
                    {this.props.label}
                </label>
                <div className="col-sm-9">
                    <input
                        type="text"
                        className="form-control"
                        onChange={this.handleChange}
                    />
                </div>
            </div>
        )
    }
});

/*
 * This is the React class for a textarea element
 */
TextareaElement = React.createClass({
  getDefaultProps: function() {
    return {
      'label': 'Text Area',
      'name': 'textarea',
      'id': '',
      'class': 'form-control',
      'disabled': '',
      'required': '',
      'value': '',
      'onUserInput': function() {
        console.warn('onUserInput() callback is not set');
      }
    };
  },
  getInitialState: function() {
    return {
      value: ''
    }
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
    return (
      <div className="row form-group">
        <label className="col-sm-3 control-label" for={this.props.label}>
          {this.props.label}
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
DateElement = React.createClass({
  getDefaultProps: function() {
    return {
      'label': 'Date',
      'name': '',
      'id': '',
      'disabled': '',
      'required': '',
      'value': '',
      'class': 'form-control',
      'onUserInput': function() {
        console.warn('onUserInput() callback is not set');
      }
    };
  },
  getInitialState: function() {
    return {
      value: ''
    }
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
    var required = this.props.required ? 'required' : '';
    return (
      <div className="row form-group">
        <label className="col-sm-3 control-label" for={this.props.label}>
          {this.props.label}
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
          />
        </div>
      </div>
    )
  }
});

/*
 *	This is the React class for a numeric element
 */
NumericElement = React.createClass({
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
    )
  }
});

/*
 * This is the React class for a LORIS element. It takes
 * in an element and render's the HTML based on its type
 * (Used in instrument builder)
 */
LorisElement = React.createClass({
  render: function() {
    var element = this.props.element,
      elementHtml = '';
    switch (element.Type) {
      case 'header':
        elementHtml = <HeaderElement header={element.Description}/>;
        break;
      case 'label':
        elementHtml = <LabelElement label={element.Description}/>
        break;
      case 'score':
        elementHtml = <ScoredElement label={element.Description}/>
        break;
      case 'text':
        if (element.Options.Type === 'small') {
          elementHtml = <TextboxElement label={element.Description}/>
        } else {
          elementHtml = <TextareaElement label={element.Description}/>
        }
        break;
      case 'select':
        if (element.Options.AllowMultiple) {
          elementHtml = <SelectElement label={element.Description}
                                       options={element.Options.Values}
                                       multiple="true"/>
        } else {
          elementHtml = <SelectElement label={element.Description}
                                       options={element.Options.Values}/>
        }
        break;
      case 'date':
        elementHtml = <DateElement
          label={element.Description}
          minYear={element.Options.MinDate}
          maxYear={element.Options.MaxDate}
        />
        break;
      case 'numeric':
        elementHtml = <NumericElement
          label={element.Description}
          min={element.Options.MinValue}
          max={element.Options.MaxValue}
        />
      default:
        break;
    }
    return (
      <div>{elementHtml}</div>
    )
  }
});