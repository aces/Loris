HeaderElement = React.createClass({displayName: "HeaderElement",
	render: function(){
		return (
			React.createElement("h2", null, this.props.header)
		)
	}
});

LabelElement = React.createClass({displayName: "LabelElement",
	render: function(){
		return (
			React.createElement("p", null, this.props.label)
		)
	}
});

ScoredElement = React.createClass({displayName: "ScoredElement",
	render: function(){
		return (
			React.createElement("div", null, 
			React.createElement("label", {className: "lab col-sm-4 col-xs-12"}, 
				this.props.label
			), 
			React.createElement("div", {className: "col-sm-8"}, 
				React.createElement("div", {className: "col-xs-12 element"}, 
					"0"
				)
			)
			)
		)
	}
});

TextboxElement = React.createClass({displayName: "TextboxElement",
	render: function(){
		return (
			React.createElement("div", null, 
			React.createElement("label", {className: "lab col-sm-4 col-xs-12"}, 
				this.props.label
			), 
			React.createElement("div", {className: "col-sm-8"}, 
				React.createElement("div", {className: "col-xs-12 col-sm-6 element"}, 
					React.createElement("input", {type: "text", className: "form-control input-sm user-success"})
				)
			)
			)
		)
	}
});

TextareaElement = React.createClass({displayName: "TextareaElement",
	render: function(){
		return (
			React.createElement("div", null, 
			React.createElement("label", {className: "lab col-sm-4 col-xs-12"}, 
				this.props.label
			), 
			React.createElement("div", {className: "col-sm-8"}, 
				React.createElement("div", {className: "col-xs-12 col-sm-6 element"}, 
					React.createElement("textarea", {cols: "25", rows: "4", className: "form-control input-sm user-success"})
				)
			)
			)
		)
	}
});

SelectElement = React.createClass({displayName: "SelectElement",
	render: function(){
		var multiple = '';
		if(this.props.multiple){
			multiple = 'multiple';
		}
		return (
			React.createElement("div", null, 
			React.createElement("label", {className: "lab col-sm-4 col-xs-12"}, 
				this.props.label
			), 
			React.createElement("div", {className: "col-sm-8"}, 
				React.createElement("div", {className: "col-xs-12 col-sm-6 element"}, 
					React.createElement("select", {multiple: multiple, className: "form-control input-sm"}, 
						Object.keys(this.props.options).map(function(option){
							return (
								React.createElement("option", null, 
									option
								)
							)
						})
					)
				)
			)
			)
		)
	}
});

DateElement = React.createClass({displayName: "DateElement",
	render: function(){
		var max = this.props.maxYear,
			min = this.props.minYear;
		return (
			React.createElement("div", null, 
			React.createElement("label", {className: "lab col-sm-4 col-xs-12"}, 
				this.props.label
			), 
			React.createElement("div", {className: "col-sm-8"}, 
				React.createElement("div", {className: "col-xs-12 col-sm-6 element"}, 
					React.createElement("input", {type: "date", 
						   className: "form-control input-sm user-success", 
						   min: min, 
						   max: max}
				    )
				)
			)
			)
		)
	}
});

NumericElement = React.createClass({displayName: "NumericElement",
	render: function(){
		return (
			React.createElement("div", null, 
			React.createElement("label", {className: "lab col-sm-4 col-xs-12"}, 
				this.props.label
			), 
			React.createElement("div", {className: "col-sm-8"}, 
				React.createElement("div", {className: "col-xs-12 col-sm-6 element"}, 
					React.createElement("input", {type: "number", 
						   className: "form-control input-sm user-success", 
						   min: this.props.min, 
						   max: this.props.max}
				    )
				)
			)
			)
		)
	}
});

LorisElement = React.createClass({displayName: "LorisElement",
	render: function (){
		var element = this.props.element,
			elementHtml = "dklfldkjf";
		switch(element.Type){
			case 'header':
				elementHtml = React.createElement(HeaderElement, {header: element.Description});
				break;
			case 'label':
				elementHtml = React.createElement(LabelElement, {label: element.Description})
				break;
			case 'scored':
	    		elementHtml = React.createElement(ScoredElement, {label: element.Description})
	    		break;
	    	case 'text':
	    		if(element.Options.Type === 'small'){
	    			elementHtml = React.createElement(TextboxElement, {label: element.Description})
	    		} else {
	    			elementHtml = React.createElement(TextareaElement, {label: element.Description})
	    		}
	    		break;
	    	case 'select':
	    		if(element.Options.AllowMultiple){
	    			elementHtml = React.createElement(SelectElement, {label: element.Description, options: element.Options.Values, multiple: "true"})
	    		} else {
	    			elementHtml = React.createElement(SelectElement, {label: element.Description, options: element.Options.Values})
	    		}
	    		break;
	    	case 'date':
	    		elementHtml = React.createElement(DateElement, {
	    							label: element.Description, 
	    							minYear: element.Options.MinDate, 
	    							maxYear: element.Options.MaxDate}
	    					   )
	    		break;
	    	case 'numeric':
	    		elementHtml = React.createElement(NumericElement, {
	    							label: element.Description, 
	    							min: element.Options.MinValue, 
	    							max: element.Options.MaxValue}
	    					   )
			default:
				break;
		}
		return (
			React.createElement("div", null, elementHtml)
		)
	}
});