LoadInstrument = React.createClass({displayName: "LoadInstrument",
	render: function () {
		var spanDownStyle = {
			display: 'none'
		};
		return (
			React.createElement("div", {className: "col-sm-4 hidden-xs"}, 
			    React.createElement("div", {className: "panel panel-primary"}, 
			        React.createElement("div", {className: "panel-heading", onclick: "hideLoad();"}, 
			            "Load Instrument (optional)", 
			            React.createElement("span", {className: "glyphicon glyphicon-chevron-down pull-right", style: spanDownStyle, id: "down-load"}), 
			            React.createElement("span", {className: "glyphicon glyphicon-chevron-up pull-right", id: "up-load"})
			        ), 
			        React.createElement("div", {className: "panel-body", id: "panel-load"}, 
			            React.createElement("input", {className: "fileUpload", type: "file", id: "instfile"}), 
			            React.createElement("br", null), 
			            React.createElement("input", {className: "btn btn-default", type: "button", id: "load", value: "Load Instrument"})
			        )
			    )
			)
		);
	}
});

DisplayElements = React.createClass({displayName: "DisplayElements",
	render: function () {
		return (
			React.createElement("div", {className: "col-xs-12"}, 
				React.createElement("div", {className: "col-xs-2"}, 
					this.props.databaseName
				), 
				React.createElement("div", {className: "col-xs-8"}, 
					this.props.element
				), 
				React.createElement("div", {className: "col-xs-2"}, 
					"iuiuiuh"
				)
			)
		)
	}
});

AddElement = React.createClass({displayName: "AddElement",
	selectType: function (event) {
		return function(){
			alert(this);
		}
	},
	render: function () {
		return (
			React.createElement("div", {className: "col-xs-12"}, 
				React.createElement("h2", null, "Add Question"), 
			    React.createElement("form", {className: "form-horizontal", role: "form"}, 
			        React.createElement("div", {className: "form-group"}, 
			            React.createElement("label", {for: "selected-input", className: "col-sm-2 control-label"}, "Question Type:"), 
			            React.createElement("div", {className: "col-sm-4"}, 
			                React.createElement("div", {className: "btn-group"}, 
			                    React.createElement("button", {id: "selected-input", type: "button", className: "btn btn-default dropdown-toggle", "data-toggle": "dropdown"}, 
			                        React.createElement("span", {id: "search_concept"}, "Select One "), 
			                        React.createElement("span", {className: "caret"})
			                    ), 
			                    React.createElement("ul", {className: "dropdown-menu", role: "menu"}, 
			                        React.createElement("li", null, 
			                            React.createElement("div", {className: "col-sm-12"}, React.createElement("h5", {className: ""}, "Information"))
			                        ), 
			                        React.createElement("li", {onClick: this.selectType.bind(this, "f")}, 
			                            React.createElement("a", {id: "header", className: "option", title: "Centered, header information"}, "Header")
			                        ), 
			                        React.createElement("li", null, 
			                            React.createElement("a", {id: "label", className: "option", title: "Unemphasized display text"}, "Label")
			                        ), 
			                        React.createElement("li", null, 
			                            React.createElement("a", {id: "scored", className: "option", title: "Column which stores calculated data"}, "Scored Field")
			                        ), 
			                        React.createElement("li", {className: "divider"}), 
			                        React.createElement("li", null, 
			                            React.createElement("div", {className: "col-sm-12"}, React.createElement("h5", {className: ""}, "Data entry"))
			                        ), 
			                        React.createElement("li", null, 
			                            React.createElement("a", {id: "textbox", className: "option", title: "Text box for user data entry"}, "Textbox")
			                        ), 
			                        React.createElement("li", null, 
			                            React.createElement("a", {id: "textarea", className: "option", title: "Larger text area for data entry"}, "Textarea")
			                        ), 
			                        React.createElement("li", null, 
			                            React.createElement("a", {id: "dropdown", className: "option", title: "Dropdown menu for users to select data from"}, "Dropdown")
			                        ), 
			                        React.createElement("li", null, 
			                            React.createElement("a", {id: "multiselect", className: "option", title: "Data entry where multiple options may be selected"}, "Multiselect")
			                        ), 
			                        React.createElement("li", null, 
			                            React.createElement("a", {id: "date", className: "option", title: "User data entry of a date"}, "Date")
			                        ), 
			                        React.createElement("li", null, 
			                            React.createElement("a", {id: "numeric", className: "option", title: "User data entry of a number"}, "Numeric")
			                        ), 
			                        React.createElement("li", {className: "divider"}), 
			                        React.createElement("li", null, 
			                            React.createElement("div", {className: "col-sm-12"}, React.createElement("h5", {className: ""}, "Formatting"))
			                        ), 
			                        React.createElement("li", null, 
			                            React.createElement("a", {id: "line", className: "option", title: "Empty line"}, "Blank Line")
			                        ), 
			                        React.createElement("li", null, 
			                            React.createElement("a", {id: "page-break", className: "option", title: "Start a new page"}, "Page Break")
			                        )
			                    )
			                )
			            )
			        ), 
			            React.createElement("div", {className: "form-group"}, 
			                React.createElement("label", {className: "col-sm-2 control-label"}, "Question Name: "), 
			                React.createElement("div", {className: "col-sm-6"}, 
			                    React.createElement("input", {className: "form-control", type: "text", id: "questionName"})
			                )
			            ), 
			            React.createElement("div", {className: "form-group"}, 
			                React.createElement("label", {className: "col-sm-2 control-label"}, "Question Text: "), 
			                React.createElement("div", {className: "col-sm-6"}, 
			                    React.createElement("input", {className: "form-control", type: "text", id: "questionText", size: "75"})
			                )
			            ), 

			            React.createElement("div", {id: "dropdownoptions", className: "options"}, 
			                React.createElement("div", {className: "form-group"}, 
			                    React.createElement("label", {className: "col-sm-2 control-label"}, "Dropdown Option: "), 
			                    React.createElement("div", {className: "col-sm-3"}, 
			                        React.createElement("input", {className: "form-control", type: "text", id: "newSelectOption"})
			                    ), 
			                    React.createElement("input", {className: "btn btn-default", type: "button", value: "Add option", onClick: "addDropdownOption();"}), 
			                    React.createElement("input", {className: "btn btn-default", type: "button", value: "Reset", onClick: "clearDropdownOption()"})
			                ), 
			                    React.createElement("div", {className: "form-group"}, 
			                        React.createElement("label", {className: "col-sm-2 control-label"}, "Preview: "), 
			                        React.createElement("div", {className: "col-sm-2"}, 
			                            React.createElement("select", {id: "selectOptions", className: "form-control"}
			                            )
			                    )
			                )
			            ), 
			            React.createElement("div", {id: "multiselectoptions", className: "options"}, 
			                React.createElement("div", {className: "form-group"}, 
			                    React.createElement("label", {className: "col-sm-2 control-label"}, " Option: "), 
			                    React.createElement("div", {className: "col-sm-3"}, 
			                        React.createElement("input", {className: "form-control", type: "text", id: "newmultiSelectOption"})
			                    ), 
			                    React.createElement("input", {className: "btn btn-default", type: "button", value: "Add option", onClick: "addDropdownOption('multi');"}), 
			                    React.createElement("input", {className: "btn btn-default", type: "button", value: "Reset", onClick: "clearDropdownOption('multi')"})
			                ), 
			                    React.createElement("div", {className: "form-group"}, 
			                        React.createElement("label", {className: "col-sm-2 control-label"}, "Preview: "), 
			                        React.createElement("div", {className: "col-sm-2"}, 
			                            React.createElement("select", {multiple: true, id: "multiselectOptions", className: "form-control"}
			                            )
			                    )
			                )
			            ), 
			            React.createElement("div", {id: "dateoptions", className: "options form-group"}, 
			                React.createElement("label", {className: "col-sm-2 control-label"}, "Start year: "), 
			                React.createElement("div", {className: "col-sm-2"}, 
			                    React.createElement("input", {className: "form-control", type: "number", id: "datemin", min: "1900", max: "2100"})
			                ), 
			                React.createElement("label", {className: "col-sm-2 control-label"}, "End year: "), 
			                React.createElement("div", {className: "col-sm-2"}, 
			                    React.createElement("input", {className: "form-control", type: "number", id: "datemax", min: "1900", max: "2100"})
			                )
			            ), 
			            React.createElement("div", {id: "numericoptions", className: "options form-group"}, 
			                React.createElement("label", {className: "col-sm-2 control-label"}, "Min: "), 
			                React.createElement("div", {className: "col-sm-2"}, 
			                    React.createElement("input", {className: "form-control", type: "number", id: "numericmin"})
			                ), 
			                React.createElement("label", {className: "col-sm-2 control-label"}, "Max: "), 
			                React.createElement("div", {className: "col-sm-2"}, 
			                    React.createElement("input", {className: "form-control", type: "number", id: "numericmax"})
			                )
			            ), 
			        React.createElement("div", {className: "form-group"}, 
			            React.createElement("div", {className: "col-sm-offset-2 col-sm-10"}, 
			                React.createElement("input", {className: "btn btn-default", type: "button", value: "Add Row", onClick: "addQuestion();"})
			            )
			        )


			    )
			)
		)
	}
});

InstrumentBuilderApp = React.createClass({displayName: "InstrumentBuilderApp",
	render: function () {
		return (
			React.createElement("div", null, 
				React.createElement("div", {className: "row"}, React.createElement(LoadInstrument, null)), 
				React.createElement("div", {className: "row"}, 
					React.createElement(DisplayElements, {
						databaseName: "Database Name", 
						element: "Question Display (Front End)"}
					)
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement(AddElement, null)
				), 
				React.createElement("div", {className: "row"}, React.createElement("h1", null, "HELLO WORLD"))
			)
		);
	}
});

RInstrumentBuilderApp = React.createFactory(InstrumentBuilderApp);