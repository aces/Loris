/**
 *	This file contains the React classes the LORIS form
 *	elements.
 */

/*
 *	This is the React class for a header element
 */
HeaderElement = React.createClass({
  displayName: "HeaderElement",

  render: function () {
    return React.createElement(
      "h2",
      null,
      this.props.header
    );
  }
});

/*
 *	This is the React class for a label element
 */
LabelElement = React.createClass({
  displayName: "LabelElement",

  render: function () {
    return React.createElement(
      "p",
      null,
      this.props.label
    );
  }
});

/*
 *	This is the React class for a scored element
 */
ScoredElement = React.createClass({
  displayName: "ScoredElement",

  render: function () {
    var score = this.props.score ? this.props.score : 0;
    return React.createElement(
      "div",
      null,
      React.createElement(
        "label",
        { className: "lab col-sm-4 col-xs-12" },
        this.props.label
      ),
      React.createElement(
        "div",
        { className: "col-sm-8" },
        React.createElement(
          "div",
          { className: "col-xs-12 element" },
          score
        )
      )
    );
  }
});

/*
 *	This is the React class for a textbox element
 */
TextboxElement = React.createClass({
  displayName: "TextboxElement",

  render: function () {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "label",
        { className: "lab col-sm-4 col-xs-12" },
        this.props.label
      ),
      React.createElement(
        "div",
        { className: "col-sm-8" },
        React.createElement(
          "div",
          { className: "col-xs-12 col-sm-6 element" },
          React.createElement("input", { type: "text", className: "form-control input-sm user-success" })
        )
      )
    );
  }
});

/*
 *	This is the React class for a textarea element
 */
TextareaElement = React.createClass({
  displayName: "TextareaElement",

  render: function () {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "label",
        { className: "lab col-sm-4 col-xs-12" },
        this.props.label
      ),
      React.createElement(
        "div",
        { className: "col-sm-8" },
        React.createElement(
          "div",
          { className: "col-xs-12 col-sm-6 element" },
          React.createElement("textarea", { cols: "25", rows: "4", className: "form-control input-sm user-success" })
        )
      )
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
  displayName: "DateElement",


  getDefaultProps: function () {
    return {
      'label': 'Date',
      'name': '',
      'id': '',
      'disabled': '',
      'required': '',
      'class': 'form-control',
      'onUserInput': function () {
        console.warn('onUserInput() callback is not set');
      }
    };
  },

  render: function () {
    return React.createElement(
      "div",
      { className: "form-group" },
      React.createElement(
        "label",
        { className: "col-sm-3 control-label", "for": this.props.label },
        this.props.label
      ),
      React.createElement(
        "div",
        { className: "col-sm-9" },
        React.createElement("input", {
          type: "date",
          name: this.props.name,
          id: this.props.label,
          className: this.props.class,
          min: this.props.minYear,
          max: this.props.maxYear
        })
      )
    );
  }
});

/*
 *	This is the React class for a numeric element
 */
NumericElement = React.createClass({
  displayName: "NumericElement",

  render: function () {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "label",
        { className: "lab col-sm-4 col-xs-12" },
        this.props.label
      ),
      React.createElement(
        "div",
        { className: "col-sm-8" },
        React.createElement(
          "div",
          { className: "col-xs-12 col-sm-6 element" },
          React.createElement("input", { type: "number",
            className: "form-control input-sm user-success",
            min: this.props.min,
            max: this.props.max
          })
        )
      )
    );
  }
});

/*
 *	This is the React class for a LORIS element. It takes
 * 	in an element and render's the HTML based on its type
 */
LorisElement = React.createClass({
  displayName: "LorisElement",

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
          elementHtml = React.createElement(SelectElement, { label: element.Description, options: element.Options.Values, multiple: "true" });
        } else {
          elementHtml = React.createElement(SelectElement, { label: element.Description, options: element.Options.Values });
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
      "div",
      null,
      elementHtml
    );
  }
});

RDateElement = React.createFactory(DateElement);

//# sourceMappingURL=Form.js.map