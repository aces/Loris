QuestionText = React.createClass({displayName: "QuestionText",
	onChange: function(e){
		this.props.updateState({Description: e.target.value});
	},
	render: function () {
		return (
			React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {className: "col-sm-2 control-label"}, "Question Text: "), 
                React.createElement("div", {className: "col-sm-6"}, 
                    React.createElement("input", {
                    	className: "form-control", 
                    	type: "text", id: "questionText", 
                    	size: "75", 
                    	value: this.props.text, 
                    	onChange: this.onChange}
                    )
                )
            )
		)
	}
});
BasicOptions = React.createClass({displayName: "BasicOptions",
	onChange: function(e){
		this.props.updateState({Name: e.target.value});
	},
	render: function () {
		return (
			React.createElement("div", null, 
				React.createElement("div", {className: "form-group"}, 
	                React.createElement("label", {className: "col-sm-2 control-label"}, "Question Name: "), 
	                React.createElement("div", {className: "col-sm-6"}, 
	                    React.createElement("input", {className: "form-control", type: "text", id: "questionName", onChange: this.onChange})
	                )
	            ), 
            	React.createElement(QuestionText, {updateState: this.props.updateState})
            )
		)
	}
});
DropdownOptions = React.createClass({displayName: "DropdownOptions",
	getInitialState: function() {
		return {
			option: ''
		}
	},
	onChange: function(e){
		this.setState({option: e.target.value});
	},
	addOption: function(){
		var temp = this.props.Options,
			key = Enumize(this.state.option);
			temp.Values[key] = this.state.option;
			this.props.updateState({Options: temp});
	},
	render: function () {
		var multi = '',
			options = this.props.Options.Values;
		if(this.props.Options.AllowMultiple){
			multi = "multiple";
		}
		return (
			React.createElement("div", null, 
				React.createElement(BasicOptions, {updateState: this.props.updateState}), 
				React.createElement("div", {className: "form-group"}, 
                    React.createElement("label", {className: "col-sm-2 control-label"}, "Dropdown Option: "), 
                    React.createElement("div", {className: "col-sm-3"}, 
                        React.createElement("input", {className: "form-control", type: "text", id: "newSelectOption", onChange: this.onChange})
                    ), 
                    React.createElement("input", {className: "btn btn-default", type: "button", value: "Add option", onClick: this.addOption.bind(this, false)}), 
                    React.createElement("input", {className: "btn btn-default", type: "button", value: "Reset"}/*onClick={this.resetOptions}*/ )
                ), 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("label", {className: "col-sm-2 control-label"}, "Preview: "), 
                    React.createElement("div", {className: "col-sm-2"}, 
                        React.createElement("select", {multiple: multi, id: "selectOptions", className: "form-control"}, 
                        	Object.keys(options).map(function(option){
                        		return (
                        			React.createElement("option", null, 
                        				options[option]
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
DateOptions = React.createClass({displayName: "DateOptions",
	onChange: function(e){
		var options = this.props.Options;
		if(e.target.id === 'datemin'){
			options.MinDate = e.target.value + "-01-01";
		} else if (e.target.id === 'datemax'){
			options.MaxDate = e.target.value + "-12-31";
		}
		this.props.updateState({Options: options});
	},
	render: function () {
		var minYear = this.props.Options.MinDate.split('-')[0],
			maxYear = this.props.Options.MaxDate.split('-')[0];
		return (
			React.createElement("div", null, 
				React.createElement(BasicOptions, {updateState: this.props.updateState}), 
                React.createElement("div", {id: "dateoptions", className: "options form-group"}, 
	                React.createElement("label", {className: "col-sm-2 control-label"}, "Start year: "), 
	                React.createElement("div", {className: "col-sm-2"}, 
	                    React.createElement("input", {className: "form-control", type: "number", id: "datemin", min: "1900", max: "2100", value: minYear, onChange: this.onChange})
	                ), 
	                React.createElement("label", {className: "col-sm-2 control-label"}, "End year: "), 
	                React.createElement("div", {className: "col-sm-2"}, 
	                    React.createElement("input", {className: "form-control", type: "number", id: "datemax", min: "1900", max: "2100", onChange: this.onChange, value: maxYear})
	                )
	            )
			)
		)
	}
});
NumericOptions = React.createClass({displayName: "NumericOptions",
	onChange: function(e){
		var options = this.props.Options;
		if(e.target.id === 'numericmin'){
			options.MinValue = parseInt(e.target.value);
		} else if (e.target.id === 'numericmax'){
			options.MaxValue = parseInt(e.target.value);
		}
		this.props.updateState({Options: options});
	},
	render: function () {
		return (
			React.createElement("div", null, 
				React.createElement(BasicOptions, {updateState: this.props.updateState}), 
                React.createElement("div", {id: "numericoptions", className: "options form-group"}, 
	                React.createElement("label", {className: "col-sm-2 control-label"}, "Min: "), 
	                React.createElement("div", {className: "col-sm-2"}, 
	                    React.createElement("input", {className: "form-control", type: "number", id: "numericmin", onChange: this.onChange, value: this.props.Options.MinValue})
	                ), 
	                React.createElement("label", {className: "col-sm-2 control-label"}, "Max: "), 
	                React.createElement("div", {className: "col-sm-2"}, 
	                    React.createElement("input", {className: "form-control", type: "number", id: "numericmax", onChange: this.onChange, value: this.props.Options.MaxValue})
	                )
	            )
			)
		)
	}
});


ListElements = React.createClass({displayName: "ListElements",
	selectType: function (newId, newValue) {
		var newState = {
				selected: {
					id: newId,
					value: newValue
				}
			},
			multi = false,
			textSize = 'small';
		switch(newId){
			case 'textarea':
				textSize = 'large';
			case 'textbox':
				newState.Options = {
					Type: textSize
				};
				break;
			case 'multiselect':
	    		multi = true;
	    	case 'dropdown':
	    		newState.Options = {
	    			Values: {},
	    			AllowMultiple: multi
	    		};
	    		break;
	    	case 'date':
	    		newState.Options = {
	    			MinDate: '',
	    			MaxDate: ''
	    		};
	    		break;
	    	case 'numeric':
	    		newState.Options = {
	    			MinValue: 0,
	    			MaxValue: 0
	    		};
	    		break;
		};
		this.props.updateState(newState);
	},
	render: function () {
		return (
			React.createElement("div", {className: "form-group"}, 
			    React.createElement("label", {for: "selected-input", className: "col-sm-2 control-label"}, "Question Type:"), 
	            React.createElement("div", {className: "col-sm-4"}, 
	                React.createElement("div", {className: "btn-group"}, 
	                    React.createElement("button", {id: "selected-input", type: "button", className: "btn btn-default dropdown-toggle", "data-toggle": "dropdown"}, 
	                        React.createElement("span", {id: "search_concept"}, this.props.value, " "), 
	                        React.createElement("span", {className: "caret"})
				        ), 
				        React.createElement("ul", {className: "dropdown-menu", role: "menu"}, 
			                React.createElement("li", null, 
			                    React.createElement("div", {className: "col-sm-12"}, React.createElement("h5", {className: ""}, "Information"))
			                ), 
			                React.createElement("li", {onClick: this.selectType.bind(this, "header", "Header")}, 
			                    React.createElement("a", {id: "header", className: "option", title: "Centered, header information"}, "Header")
			                ), 
			                React.createElement("li", {onClick: this.selectType.bind(this, "label", "Label")}, 
			                    React.createElement("a", {id: "label", className: "option", title: "Unemphasized display text"}, "Label")
			                ), 
			                React.createElement("li", {onClick: this.selectType.bind(this, "scored", "Scored Field")}, 
			                    React.createElement("a", {id: "scored", className: "option", title: "Column which stores calculated data"}, "Scored Field")
			                ), 
			                React.createElement("li", {className: "divider"}), 
			                React.createElement("li", null, 
			                    React.createElement("div", {className: "col-sm-12"}, React.createElement("h5", {className: ""}, "Data entry"))
			                ), 
			                React.createElement("li", {onClick: this.selectType.bind(this, "textbox", "Textbox")}, 
			                    React.createElement("a", {id: "textbox", className: "option", title: "Text box for user data entry"}, "Textbox")
			                ), 
			                React.createElement("li", {onClick: this.selectType.bind(this, "textarea", "Textarea")}, 
			                    React.createElement("a", {id: "textarea", className: "option", title: "Larger text area for data entry"}, "Textarea")
			                ), 
			                React.createElement("li", {onClick: this.selectType.bind(this, "dropdown", "Dropdown")}, 
			                    React.createElement("a", {id: "dropdown", className: "option", title: "Dropdown menu for users to select data from"}, "Dropdown")
			                ), 
			                React.createElement("li", {onClick: this.selectType.bind(this, "multiselect", "Multiselect")}, 
			                    React.createElement("a", {id: "multiselect", className: "option", title: "Data entry where multiple options may be selected"}, "Multiselect")
			                ), 
			                React.createElement("li", {onClick: this.selectType.bind(this, "date", "Date")}, 
			                    React.createElement("a", {id: "date", className: "option", title: "User data entry of a date"}, "Date")
			                ), 
			                React.createElement("li", {onClick: this.selectType.bind(this, "numeric", "Numeric")}, 
			                    React.createElement("a", {id: "numeric", className: "option", title: "User data entry of a number"}, "Numeric")
			                ), 
			                React.createElement("li", {className: "divider"}), 
			                React.createElement("li", null, 
			                    React.createElement("div", {className: "col-sm-12"}, React.createElement("h5", {className: ""}, "Formatting"))
			                ), 
			                React.createElement("li", {onClick: this.selectType.bind(this, "line", "Blank Line")}, 
			                    React.createElement("a", {id: "line", className: "option", title: "Empty line"}, "Blank Line")
			                ), 
			                React.createElement("li", {onClick: this.selectType.bind(this, "page-break", "Page Break")}, 
			                    React.createElement("a", {id: "page-break", className: "option", title: "Start a new page"}, "Page Break")
			                )
			            )
	                )
	            )
	        )
		)
	}
});

AddElement = React.createClass({displayName: "AddElement",
	getInitialState: function() {
	 	return {
	 		Options: this.props.element ? this.props.element.Options : {},
	 		Description: this.props.element ? this.props.element.Description : '',
	 		Name: this.props.element ? this.props.element.Name : '',
	 		selected: {
	 			id: '',
	 			value: 'Select One'
	 		}
	 	};
	},
	updateState: function(newState) {
		this.setState(newState);
	},
	addQuestion: function () {
		var selected = this.state.selected.id,
			questionText = this.state.Description,
			questionName = this.state.Name,
			element;
	    if(!selected) {
	        alert("No element type selected");
	        return;
	    }

	    if(questionText == '' && selected != 'line') {
	        if(selected == 'page-break') {
	            alert("Must use question text as page header");
	        } else {
	            alert("No question text specified");
	        }
	        return;
	    }
	    if(questionName == '' && selected != "header" && selected != "label" && selected != 'line' && selected != 'page-break') {
	        alert("Must specifiy name for database to save value into");
	        return;
	    }
	    switch(selected){
	    	case 'textbox':
	    	case 'textarea':
	    		selected = 'text';
	    		break;
	    	case 'dropdown':
	     	case 'multiselect':
	     		selected = 'select';
	     		break;
	    }
	    var element = {
	    	Type: selected,
	    	Description: questionText,
	    	Name: questionName,
	    	Options: this.state.Options
	    };
	    // switch(selected){
	    // 	case 'header':
	    // 		element.Type = 'header';
	    // 		break;
	    // 	case 'label':
	    // 		element.Type = 'label';
	    // 		break;
	    // 	case 'scored':
	    // 		element.Type = 'scored';
	    // 		break;
	    // 	case 'textbox':
	    // 		element.Type = 'text';
	    // 		element.Options = {
	    // 			Type: "small"
	    // 		}
	    // 		break;
	    // 	case 'textarea':
	    // 		element.Type = 'text';
	    // 		element.Options = {
	    // 			Type: "large"
	    // 		}
	    // 		break;
	    // 	case 'dropdown':
	    // 	case 'multiselect':
	    // 		element.Type = 'select';
	    // 		element.Options = this.state.Options;
	    // 		break;
	    // 	case 'date':
	    // 		element.Type = 'date';
	    // 		element.Options = {
	    // 			MinDate: parseInt(document.getElementById('datemin').value, 10),
	    // 			MaxDate: parseInt(document.getElementById('datemax').value, 10)
	    // 		}
	    // 		break;
	    // 	case 'numeric':
	    // 		element.Type = 'numeric';
	    // 		element.Options = {
	    // 			MinValue: parseInt(document.getElementById('numericmin').value, 10),
	    // 			MaxValue: parseInt(document.getElementById('numericmax').value, 10)
	    // 		}
	    // 		break;
	    // 	case 'defualt':
	    // 		break;
	    // }

	    this.props.updateQuestions(element);
	},
	addOption: function (multi) {
		this.setState(function(state){
			var temp = state.options,
				option = multi ? $("#newmultiSelectOption").val() : $("#newSelectOption").val();
			temp.push(option);
			return {
				options: temp
			};
		});
	},
	resetOptions: function(){
		this.setState(function(state){
			return {
				options: []
			};
		});
	},
	render: function () {
		var questionInput,
			multi = false,
			options;
		switch(this.state.selected.id){
			case 'header':
			case 'label':
				questionInput = React.createElement(QuestionText, {updateState: this.updateState})
				break;
			case 'scored':
			case 'textbox':
			case 'textarea':
				questionInput = React.createElement(BasicOptions, {updateState: this.updateState})
				break;
	    	case 'multiselect':
	    	case 'dropdown':
	    		questionInput = React.createElement(DropdownOptions, {updateState: this.updateState, Options: this.state.Options})
	    		break;
	    	case 'date':
	    		questionInput = React.createElement(DateOptions, {updateState: this.updateState, Options: this.state.Options})
	    		break;
	    	case 'numeric':
	    		questionInput = React.createElement(NumericOptions, {updateState: this.updateState, Options: this.state.Options})
	    		break;
	    	case 'defualt':
	    		break;
		}
		return (
			React.createElement("div", {className: "col-xs-12"}, 
				React.createElement("h2", null, "Add Question"), 
			    React.createElement("form", {className: "form-horizontal", role: "form"}, 
			    	React.createElement(ListElements, {updateState: this.updateState, value: this.state.selected.value}), 
			    	questionInput, 
			        React.createElement("div", {className: "form-group"}, 
			            React.createElement("div", {className: "col-sm-offset-2 col-sm-10"}, 
			                React.createElement("input", {className: "btn btn-default", type: "button", value: "Add Row", onClick: this.addQuestion})
			            )
			        )
			    )
			)
		)
	}
});