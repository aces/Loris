/**
 *	This file contains the React classes the LORIS form
 *	elements.
 */

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
  render: function(){
    return (
      <div>
        <label className="lab col-sm-4 col-xs-12">
          {this.props.label}
        </label>
        <div className="col-sm-8">
          <div className="col-xs-12 col-sm-6 element">
            <textarea cols="25" rows="4" className="form-control input-sm user-success"></textarea>
          </div>
        </div>
      </div>
    )
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