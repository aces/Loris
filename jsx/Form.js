/**
 *	This file contains the React classes the LORIS form
 *	elements.
 */

FormElement = React.createClass({
  getDefaultProps: function() {
    return {
      'name':   '',
      'id':     '',
      'action': '',
      'method': 'POST',
      'class':  'form-horizontal'
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

SelectElement = React.createClass({
  getDefaultProps: function() {
    return {
      'label':    'Label',
      'options':  [],
      'multiple': '',
      'name':     '',
      'id':       '',
      'disabled': '',
      'required': '',
      'class':    '',
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
  handleChange: function(e) {
    this.setState({
      value: e.target.value
    });
    this.props.onUserInput(this.props.name, e.target.value);
  },
  render: function() {
    var multiple = this.props.multiple ? 'multiple' : '';
    var options = this.props.options;

    return (
      <div className="form-group">
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
          >
            <option></option>
            {Object.keys(options).map(function (option) {
              return <option value={option}>{options[option]}</option>
            })}
          </select>
        </div>
      </div>
    )
  }
});

FileElement = React.createClass({

  getInitialState: function() {
    return {
      'id': '',
      'value': null,
      'onUserInput': function() {
        console.warn('onUserInput() callback is not set');
      }
    }
  },

  getDefaultProps: function() {
    return {
      'label': 'File to Upload',
      'name':  'file',
      'class': 'fileUpload'
    };
  },

  handleChange: function(e) {
    this.setState({
      value: e.target.value.split(/(\\|\/)/g).pop()
    });
    // pass current file to parent form
    var file = e.target.files[0];
    this.props.onUserInput(this.props.name, file);
  },

  render: function() {
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label">
          {this.props.label}
        </label>
        <div className="col-sm-9">
          <div className="input-group">
            <div tabindex="-1" className="form-control file-caption kv-fileinput-caption" title="">
              {this.state.value}
              <div className="file-caption-name" id="video_file"></div>
            </div>
            <div className="input-group-btn">
              <div className="btn btn-primary btn-file">
                <i className="glyphicon glyphicon-folder-open"></i> Browse
                <input type="file" name={this.props.name} className={this.props.class} ref="file" onChange={this.handleChange}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

HelpTextElement = React.createClass({
  getDefaultProps: function() {
    return {
      'html': false,
      'label': '',
      'text':  ''
    };
  },
  render: function() {
    if (this.props.html) {
      return (
        <div className="form-group">
          <label className="col-sm-3 control-label">
            {this.props.label}
          </label>
          <div className="col-sm-9">
            <div dangerouslySetInnerHTML={{__html: this.props.text}} />
          </div>
        </div>
      );
    }
    return (
      <div className="form-group">
        <label className="col-sm-2 control-label">
          {this.props.label}
        </label>
        <div className="col-sm-10">
          <div>{this.props.text}</div>
        </div>
      </div>
    );
  }
});

ButtonElement = React.createClass({
  render: function() {
    return (
      <div className="form-group">
        <div className="col-sm-9 col-sm-offset-3">
          <button type="submit" className="btn btn-primary">Upload</button>
        </div>
      </div>
    );
  }
});


/*
 *	This is the React class for a header element
 */
HeaderElement = React.createClass({
  render: function(){
    return (
      <h2>{this.props.header}</h2>
    )
  }
});

/*
 *	This is the React class for a label element
 */
LabelElement = React.createClass({
  render: function(){
    return (
      <p>{this.props.label}</p>
    )
  }
});

/*
 *	This is the React class for a scored element
 */
ScoredElement = React.createClass({
  render: function(){
    var score = (this.props.score) ? this.props.score : 0;
    return (
      <div>
        <label className="lab col-sm-4 col-xs-12">
          {this.props.label}
        </label>
        <div className="col-sm-8">
          <div className="col-xs-12 element">
            {score}
          </div>
        </div>
      </div>
    )
  }
});

/*
 *	This is the React class for a textbox element
 */
TextboxElement = React.createClass({
  render: function(){
    return (
      <div>
        <label className="lab col-sm-4 col-xs-12">
          {this.props.label}
        </label>
        <div className="col-sm-8">
          <div className="col-xs-12 col-sm-6 element">
            <input type="text" className="form-control input-sm user-success" />
          </div>
        </div>
      </div>
    )
  }
});

/*
 *	This is the React class for a textarea element
 */
TextareaElement = React.createClass({
  getDefaultProps: function() {
    return {
      'label':    'Text Area',
      'name':     'textarea',
      'id':       '',
      'class':    'form-control',
      'disabled': '',
      'required': '',
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
  handleChange: function(e) {
    this.setState({
      value: e.target.value
    });
    this.props.onUserInput(this.props.name, e.target.value);
  },
  render: function() {
    return (
      <div className="form-group">
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

// /*
//  *	This is the React class for a select element
//  */
// SelectElement = React.createClass({
//   render: function(){
//     var multiple = '';
//     if(this.props.multiple){
//       // Set select type as mutiple
//       multiple = 'multiple';
//     }
//     return (
//       <div>
//         <label className="lab col-sm-4 col-xs-12">
//           {this.props.label}
//         </label>
//         <div className="col-sm-8">
//           <div className="col-xs-12 col-sm-6 element">
//             <select multiple={multiple} className="form-control input-sm">
//               {Object.keys(this.props.options).map(function(option){
//                 return (
//                   <option>
//                     {option}
//                   </option>
//                 )
//               })}
//             </select>
//           </div>
//         </div>
//       </div>
//     )
//   }
// });

/*
 *	This is the React class for a date element
 */
DateElement = React.createClass({

  getDefaultProps: function() {
    return {
      'label':    'Date',
      'name':     '',
      'id':       '',
      'disabled': '',
      'required': '',
      'class':    'form-control',
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
  handleChange: function(e) {
    this.setState({
      value: e.target.value
    });
    this.props.onUserInput(this.props.name, e.target.value);
  },

  render: function() {
    return (
      <div className="form-group">
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
  render: function(){
    return (
      <div>
        <label className="lab col-sm-4 col-xs-12">
          {this.props.label}
        </label>
        <div className="col-sm-8">
          <div className="col-xs-12 col-sm-6 element">
            <input type="number"
                   className="form-control input-sm user-success"
                   min={this.props.min}
                   max={this.props.max}
            />
          </div>
        </div>
      </div>
    )
  }
});

/*
 *	This is the React class for a LORIS element. It takes
 * 	in an element and render's the HTML based on its type
 */
LorisElement = React.createClass({
  render: function (){
    var element = this.props.element,
      elementHtml = '';
    switch(element.Type){
      case 'header':
        elementHtml = <HeaderElement header={element.Description} />;
        break;
      case 'label':
        elementHtml = <LabelElement label={element.Description} />
        break;
      case 'score':
        elementHtml = <ScoredElement label={element.Description}/>
        break;
      case 'text':
        if(element.Options.Type === 'small'){
          elementHtml = <TextboxElement label={element.Description} />
        } else {
          elementHtml = <TextareaElement label={element.Description} />
        }
        break;
      case 'select':
        if(element.Options.AllowMultiple){
          elementHtml = <SelectElement label={element.Description} options={element.Options.Values} multiple="true" />
        } else {
          elementHtml = <SelectElement label={element.Description} options={element.Options.Values} />
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

RDateElement = React.createFactory(DateElement);