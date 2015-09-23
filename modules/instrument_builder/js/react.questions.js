QuestionText = React.createClass({displayName: "QuestionText",
	onChange: function(e){
		this.props.updateState({Description: e.target.value});
	},
	render: function () {
		var errorMessage = '',
			errorClass = 'form-group';
		if (this.props.element.error && this.props.element.error.questionText) {
			errorMessage = (React.createElement("font", {className: "form-error"}, this.props.element.error.questionText));
			errorClass += " has-error";
		}
		return (
			React.createElement("div", {className: errorClass}, 
                React.createElement("label", {className: "col-sm-2 control-label"}, "Question Text: "), 
                React.createElement("div", {className: "col-sm-6"}, 
                    React.createElement("input", {className: "form-control col-xs-12", 
                    	type: "text", id: "questionText", 
                    	size: "75", 
                    	value: this.props.element ? this.props.element.Description : '', 
                    	onChange: this.onChange}
                    ), 
                    errorMessage
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
		var errorMessage = '',
			errorClass = 'form-group';
		if (this.props.element.error && this.props.element.error.questionName) {
			errorMessage = (React.createElement("font", {className: "form-error"}, this.props.element.error.questionName));
			errorClass += " has-error";
		}
		return (
			React.createElement("div", null, 
				React.createElement("div", {className: errorClass}, 
	                React.createElement("label", {className: "col-sm-2 control-label"}, "Question Name: "), 
	                React.createElement("div", {className: "col-sm-6"}, 
	                    React.createElement("input", {className: "form-control", 
	                    	type: "text", id: "questionName", 
	                    	onChange: this.onChange, 
	                    	value: this.props.element ? this.props.element.Name : ''}
	                    ), 
	                    errorMessage
	                )
	            ), 
            	React.createElement(QuestionText, {updateState: this.props.updateState, element: this.props.element})
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
		var temp = this.props.element.Options,
			key = Enumize(this.state.option);
			temp.Values[key] = this.state.option;
			this.props.updateState({Options: temp});
	},
	render: function () {
		var multi = '',
			options = this.props.element.Options.Values;
		if(this.props.element.Options.AllowMultiple){
			multi = "multiple";
		}
		return (
			React.createElement("div", null, 
				React.createElement(BasicOptions, {updateState: this.props.updateState, element: this.props.element}), 
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
		var options = this.props.element.Options;
		if(e.target.id === 'datemin'){
			options.MinDate = e.target.value + "-01-01";
		} else if (e.target.id === 'datemax'){
			options.MaxDate = e.target.value + "-12-31";
		}
		this.props.updateState({Options: options});
	},
	render: function () {
		var minYear = this.props.element.Options.MinDate.split('-')[0],
			maxYear = this.props.element.Options.MaxDate.split('-')[0];
		return (
			React.createElement("div", null, 
				React.createElement(BasicOptions, {updateState: this.props.updateState, element: this.props.element}), 
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
		var options = this.props.element.Options;
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
				React.createElement(BasicOptions, {updateState: this.props.updateState, element: this.props.element}), 
                React.createElement("div", {id: "numericoptions", className: "options form-group"}, 
	                React.createElement("label", {className: "col-sm-2 control-label"}, "Min: "), 
	                React.createElement("div", {className: "col-sm-2"}, 
	                    React.createElement("input", {className: "form-control", type: "number", id: "numericmin", onChange: this.onChange, value: this.props.element.Options.MinValue})
	                ), 
	                React.createElement("label", {className: "col-sm-2 control-label"}, "Max: "), 
	                React.createElement("div", {className: "col-sm-2"}, 
	                    React.createElement("input", {className: "form-control", type: "number", id: "numericmax", onChange: this.onChange, value: this.props.element.Options.MaxValue})
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
			                React.createElement("li", {onClick: this.selectType.bind(this, "score", "Scored Field")}, 
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
		var state;
		if(this.props.element){
			state = {
				Options: this.props.element.Options,
		 		Description: this.props.element.Description,
		 		Name: this.props.element.Name,
		 		selected: this.props.element.selected
			}
		} else {
			state = {
				Options: {},
		 		Description: '',
		 		Name: '',
		 		selected: {
		 			id: '',
		 			value: 'Select One'
		 		}
			}
		}
	 	return state;
	},
	updateState: function(newState) {
		this.setState(newState);
	},
	addQuestion: function () {
		var selected = this.state.selected.id,
			questionText = this.state.Description,
			questionName = this.state.Name,
			hasError = false,
			element;
	    if(!selected) {
	        alert("No element type selected");
	        return;
	    }

	    if(questionText == '' && selected != 'line') {
	        if(selected == 'page-break') {
	        	this.setState(function(state){
	        		var temp = (state.error) ? state.error : {};
	        		temp.questionText = "Must use question text as page header";
					return {
						error: temp
					};
				});
				hasError = true;
	        } else {
	        	this.setState(function(state){
	        		var temp = (state.error) ? state.error : {};
	        		temp.questionText = "No question text specified";
					return {
						error: temp
					};
				});
				hasError = true;
	        }
	    }
	    if (!hasError && this.state.error) {
	    	delete this.state.error.questionText;
	    }
	    if(questionName == '' && selected != "header" && selected != "label" && selected != 'line' && selected != 'page-break') {
	    	this.setState(function(state){
        		var temp = (state.error) ? state.error : {};
        		temp.questionName = "Must specifiy name for database to save value into";
				return {
					error: temp
				};
			});
	        hasError = true;
	    } else if (this.state.error) {
	    	delete this.state.error.questionName;
	    }
	    if (hasError) {
	    	return;
	    }
	    switch(selected){
	    	case 'header':
			case 'label':
				questionName = '';
				break;
	    	case 'textbox':
	    	case 'textarea':
	    		selected = 'text';
	    		break;
	    	case 'dropdown':
	     	case 'multiselect':
	     		selected = 'select';
	     		break;
	     	case 'page-break':
	     		this.props.addPage(questionText);
	     		return;
	    }
	    delete this.state.error;
	    var element = {
	    	Type: selected,
	    	Description: questionText,
	    	Name: questionName,
	    	Options: this.state.Options,
	    	selected: this.state.selected
	    };

	    if(typeof this.props.index !== 'undefined'){
	    	hasError = !this.props.updateQuestions(element, this.props.index);
	    } else {
	    	hasError = !this.props.updateQuestions(element);
	    }
	    if (hasError) {
	    	this.setState(function(state){
        		var temp = (state.error) ? state.error : {};
        		temp.questionName = "Duplicate question name";
				return {
					error: temp
				};
			});
	    }
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
			options,
			header = '',
			buttons;
		switch(this.state.selected.id){
			case 'header':
			case 'label':
			case 'page-break':
				questionInput = React.createElement(QuestionText, {updateState: this.updateState, element: this.state})
				break;
			case 'score':
			case 'textbox':
			case 'textarea':
				questionInput = React.createElement(BasicOptions, {updateState: this.updateState, element: this.state})
				break;
	    	case 'multiselect':
	    	case 'dropdown':
	    		questionInput = React.createElement(DropdownOptions, {updateState: this.updateState, element: this.state})
	    		break;
	    	case 'date':
	    		questionInput = React.createElement(DateOptions, {updateState: this.updateState, element: this.state})
	    		break;
	    	case 'numeric':
	    		questionInput = React.createElement(NumericOptions, {updateState: this.updateState, element: this.state})
	    		break;
	    	case 'defualt':
	    		break;
		}
		if(this.props.element){
			buttons = (
				React.createElement("input", {className: "btn btn-default", type: "button", value: "Edit Row", onClick: this.addQuestion})
			)
		} else {
			header = (
				React.createElement("h2", null, "Add Question")
			);
			buttons = (
				React.createElement("input", {className: "btn btn-default", type: "button", value: "Add Row", onClick: this.addQuestion})
			)
		}
		return (
			React.createElement("div", {className: "col-xs-12"}, 
				header, 
			    React.createElement("form", {className: "form-horizontal", role: "form"}, 
			    	React.createElement(ListElements, {updateState: this.updateState, value: this.state.selected.value}), 
			    	questionInput, 
			        React.createElement("div", {className: "form-group"}, 
			            React.createElement("div", {className: "col-sm-offset-2 col-sm-10"}, 
			                buttons
			            )
			        )
			    )
			)
		)
	}
});