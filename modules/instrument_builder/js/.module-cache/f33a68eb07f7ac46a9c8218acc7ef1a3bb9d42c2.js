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
		return (
			React.createElement("div", null, 
			React.createElement("label", {className: "lab col-sm-4 col-xs-12"}, 
				this.props.label
			), 
			React.createElement("div", {className: "col-sm-8"}, 
				React.createElement("div", {className: "col-xs-12 col-sm-6 element"}, 
					React.createElement("select", {className: "form-control input-sm"}, 
						this.props.options.map(function(option){
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
