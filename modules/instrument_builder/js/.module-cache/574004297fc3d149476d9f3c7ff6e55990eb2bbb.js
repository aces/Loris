TabPane = React.createClass({displayName: "TabPane",
    render: function() {
        var classList = "tab-pane";
        if(this.props.Active) {
            classList += " active"
        }
        return (
            React.createElement("div", {className: classList, id: this.props.TabId}, 
                React.createElement("h1", null, this.props.Title), 
                React.createElement("br", null), 
                this.props.children
            )
            );
    }
});
LoadPane = React.createClass({displayName: "LoadPane",
	getInitialState: function() {
	 	return {
	 		alert: ''
	 	};
	},
	chooseFile: function (e) {
		var value = e.target.files[0];
		this.setState(function(state){
			return {
				file: value,
				alert: ''
			};
		});
	},
	setAlert: function (type) {
		this.setState(function(state){
			return {
				alert: type
			};
		});
	},
	resetAlert: function () {
		this.setState(function(state){
			return {
				alert: ''
			};
		});
	},
	loadFile: function () {
		var callback = {
				success: this.props.loadCallback,
				error: this.setAlert
			};
		Instrument.load(this.state.file, callback);
	},
	render: function () {
		var spanDownStyle = {
				display: 'none'
			},
			alert = '';
		switch (this.state.alert) {
			case 'success':
				alert = (
					React.createElement("div", {className: "alert alert-success alert-dismissible", role: "alert"}, 
						  React.createElement("button", {type: "button", className: "close", onClick: this.resetAlert}, React.createElement("span", {"aria-hidden": "true"}, "×")), 
						  React.createElement("strong", null, "Success!"), " Instrument Loaded"
					)
				)
				break;
			case 'typeError':
				alert = (
					React.createElement("div", {className: "alert alert-danger alert-dismissible", role: "alert"}, 
						  React.createElement("button", {type: "button", className: "close", onClick: this.resetAlert}, React.createElement("span", {"aria-hidden": "true"}, "×")), 
						  React.createElement("strong", null, "Error!"), " Wrong file format"
					)
				)
				break;
		}
		return (
			React.createElement(TabPane, {Title: "Load Instrument", 
                TabId: this.props.TabId}, 
                	React.createElement("div", {className: "col-sm-4 col-xs-12"}, 
                		alert, 
						React.createElement("input", {className: "fileUpload", 
							   type: "file", id: "instfile", 
			            	   onChange: this.chooseFile}
						), 
			            React.createElement("br", null), 
			            React.createElement("input", {className: "btn btn-primary", 
			            	   type: "button", id: "load", 
			            	   value: "Load Instrument", 
			            	   onClick: this.loadFile}
			            )
			        )
			)
		);
	}
});
SavePane = React.createClass({displayName: "SavePane",
	getInitialState: function() {
	 	return {
	 		fileName: '',
	 		instrumentName: ''
	 	};
	},
	loadState: function(newState) {
		this.setState(function(state){
			return {
				fileName: newState.fileName,
				instrumentName: newState.instrumentName
			};
		});
	},
	onChangeFile: function(e){
		var value = e.target.value;
		this.setState(function(state){
			return {
				fileName: value
			};
		});
	},
	onChangeInst: function(e){
		var value = e.target.value;
		this.setState(function(state){
			return {
				instrumentName: value
			};
		});
	},
	render: function () {
		var value = this.state.fileName;
		return (
			React.createElement(TabPane, {Title: "Save Instrument", 
                TabId: this.props.TabId}, 
                	React.createElement("div", {className: "form-group"}, 
                		React.createElement("div", {className: "col-xs-12"}, 
			                React.createElement("label", {className: "col-sm-2 control-label"}, "Filename: "), 
			                React.createElement("div", {className: "col-sm-4"}, 
			                    React.createElement("input", {className: "form-control", 
			                    	   type: "text", id: "filename", 
			                    	   value: value, 
			                    	   onChange: this.onChangeFile}
			                   	)
			                )
			            ), 
			            React.createElement("br", null), React.createElement("br", null), 
			            React.createElement("div", {className: "col-xs-12"}, 
			                React.createElement("label", {className: "col-sm-2 control-label"}, "Instrument Name: "), 
			                React.createElement("div", {className: "col-sm-4"}, 
			                    React.createElement("input", {className: "form-control", 
			                    	   type: "text", id: "longname", 
			                    	   value: this.state.instrumentName, 
			                    	   onChange: this.onChangeInst}
			                    )
			                )
			            ), 
			            React.createElement("br", null), React.createElement("br", null), 
			            React.createElement("br", {className: "visible-xs"}), 
			            React.createElement("br", {className: "visible-xs"}), 
			            React.createElement("br", {className: "visible-xs"}), 
			            React.createElement("div", {className: "col-xs-12"}, 
			            	React.createElement("div", {className: "col-xs-6 col-sm-2 col-sm-offset-2"}, 
			                	React.createElement("input", {className: "btn btn-primary col-xs-12", type: "button", onclick: "Instrument.validate()", value: "Validate"})
			                ), 
			                React.createElement("div", {className: "col-xs-6 col-sm-2"}, 
			                	React.createElement("input", {className: "btn btn-primary col-xs-12", 
			                		   type: "submit", value: "Save", 
			                		   onClick: this.props.save}
			                	)
			                )
			            )
		            )
			)
		);
	}
});

DisplayElements = React.createClass({displayName: "DisplayElements",
	getPlaceholder: function() {
	    if (!this.placeholder) {
	      var tr = document.createElement('tr');
	      tr.className = "placeholder";
	      var td = document.createElement('td');
	      td.colSpan = 2;
	      td.appendChild(document.createTextNode("Drop here"));
	      tr.appendChild(td);
	      this.placeholder = tr;
	    }
	    return this.placeholder;
	},
	getTableRow: function(element) {
	    if (element.tagName !== 'tr') {
	      return $(element).closest('tr')[0];
	    }
	    else {
	      return element;
	    }
	},
	dragStart: function(e) {
	    this.dragged = this.getTableRow(e.currentTarget);
	    e.dataTransfer.effectAllowed = 'move';
	    // Firefox requires dataTransfer data to be set
	    e.dataTransfer.setData("text/html", e.currentTarget);
	},
	dragEnd: function(e) {
	    this.dragged.style.display = "table-row";
	    this.dragged.parentNode.removeChild(this.getPlaceholder());

	    // Update data
	    var data = this.props.elements;
	    var from = Number(this.dragged.dataset.id);
	    var to = Number(this.over.dataset.id);
	    if (from < to) to--;
	    if (this.nodePlacement == "after") to++;
	    data.splice(to, 0, data.splice(from, 1)[0]);
	    this.setState({data: data});
	},
	dragOver: function(e) {
	    e.preventDefault();
	    var targetRow = this.getTableRow(e.target);

	    this.dragged.style.display = "none";
	    if (targetRow.className == "placeholder") return;
	    this.over = targetRow;
	    // Inside the dragOver method
	    var relY = e.pageY - $(this.over).offset().top;
	    var height = this.over.offsetHeight / 2;
	    var parent = targetRow.parentNode;

	    if (relY >= height) {
	      this.nodePlacement = "after";
	      parent.insertBefore(this.getPlaceholder(), targetRow.nextElementSibling);
	    }
	    else { // relY < height
	      this.nodePlacement = "before"
	      parent.insertBefore(this.getPlaceholder(), targetRow);
	    }
	},
	render: function () {
		var temp = this.props.elements.map((function(element, i){
						var row;
						if(element.editing){
							row = (
								React.createElement("tr", {"data-id": i, 
					            key: i, 
					            draggable: this.props.draggable, 
					            onDragEnd: this.dragEnd, 
					            onDragStart: this.dragStart}, 
									React.createElement("td", {className: "col-xs-2", colSpan: "3"}, 
										React.createElement(AddElement, {updateQuestions: this.props.updateElement, element: element, index: i})
									)
								)
							)
						} else {
							row = (
								React.createElement("tr", {"data-id": i, 
					            key: i, 
					            draggable: this.props.draggable, 
					            onDragEnd: this.dragEnd, 
					            onDragStart: this.dragStart}, 
									React.createElement("td", {className: "col-xs-2"}, 
										element.Name
									), 
									React.createElement("td", {className: "col-xs-8"}, 
										React.createElement(LorisElement, {element: element})
									), 
									React.createElement("td", {className: "col-xs-2"}, 
										React.createElement("button", {onClick: this.props.editElement.bind(this, i), className: "button"}, 
											"Edit"
										), 
										React.createElement("button", {onClick: this.props.deleteElement.bind(this, i), className: "button"}, 
											"Delete"
										)
									)
								)
							)
						}
						return (
							{row}
						)
					}).bind(this));
		return (
			React.createElement("table", {id: "sortable", className: "table table-hover"}, 
				React.createElement("thead", null, 
					React.createElement("tr", null, 
						React.createElement("th", {className: "col-xs-2"}, "Database Name"), 
						React.createElement("th", null, "Question Display (Front End)"), 
						React.createElement("th", null, "Edit")
					)
				), 
				React.createElement("tbody", {onDragOver: this.dragOver}, 
					temp
				)
			)
		)
	}
});

BuildPane = React.createClass({displayName: "BuildPane",
	getInitialState: function() {
	 	return {
	 		Elements: [{
	 			Type      	: "ElementGroup",
    			GroupType 	: "Page",
    			Description : "Top",
    			Elements 	: []
	 		}],
	 		amountEditing : 0,
	 		currentPage   : 0,
	 		elementDBNames : {}
	 	};
	},
	loadElements: function(elements) {
		this.setState(function(state){
			return {
				Elements: elements
			};
		});
	},
	editElement: function(elementIndex){
		this.setState(function(state){
			var temp = state.Elements,
				edit = state.amountEditing + 1;
			temp[state.currentPage].Elements[elementIndex].editing = true;
			return {
				Elements: temp,
				amountEditing: edit
			};
		});
	},
	deleteElement: function(elementIndex){
		this.setState(function(state){
			var temp = state.Elements;
			temp[state.currentPage].Elements.splice(elementIndex, 1);
			return {
				Elements: temp
			};
		});
	},
	updateElement: function(element, index){
		if (element.Name && element.Name in this.state.elementDBNames){
			return false;
		}
		this.setState(function(state){
			var temp = state.Elements
				edit = state.amountEditing - 1,
				dbNa = state.elementDBNames;
			temp[state.currentPage].Elements[index] = element;
			if (element.Name) {
				dbNa[element.Name] = '';
			}
			return {
				Elements: temp,
				amountEditing: edit,
				elementDBNames: dbNa
			};
		});
		return true;
	},
	addQuestion: function(element){
		if (element.Name && element.Name in this.state.elementDBNames){
			return false;
		}
		this.setState(function(state){
			var temp = state.Elements,
				dbNa = state.elementDBNames;
			if (element.Name) {
				dbNa[element.Name] = '';
			}
			temp[state.currentPage].Elements.push(element);
			return {
				Elements: temp,
				elementDBNames: dbNa
			};
		});
	},
	addPage: function (pageName) {
		this.setState(function(state){
			var temp = state.Elements,
				page = state.currentPage + 1;
			temp.push({
	 			Type      	: "ElementGroup",
    			GroupType 	: "Page",
    			Description : pageName,
    			Elements 	: []
	 		});
			return {
				Elements: temp,
				currentPage: page
			};
		});
	},
	selectPage: function (index) {
		this.setState(function(state){
			return {
				currentPage: index
			};
		});
	},
	render: function () {
		var draggable = this.state.amountEditing === 0 ? true : false,
			that	  = this,
			pages 	  = this.state.Elements.map((function(element, i){
			        		return (
			        			React.createElement("li", {onClick: that.selectPage.bind(this, i)}, 
			                    	React.createElement("a", null, that.state.Elements[i].Description)
			                	)
			                );
			        	}));
		return (
			React.createElement(TabPane, {Title: "Build your Instrument", 
                TabId: this.props.TabId, Active: true}, 
                	React.createElement("div", {className: "form-group col-xs-12"}, 
					    React.createElement("label", {for: "selected-input", className: "col-xs-2 col-sm-1 control-label"}, "Page:"), 
			            React.createElement("div", {className: "col-sm-4"}, 
			                React.createElement("div", {className: "btn-group"}, 
			                    React.createElement("button", {id: "selected-input", type: "button", className: "btn btn-default dropdown-toggle", "data-toggle": "dropdown"}, 
			                        React.createElement("span", {id: "search_concept"}, this.state.Elements[this.state.currentPage].Description), 
			                        React.createElement("span", {className: "caret"})
						        ), 
						        React.createElement("ul", {className: "dropdown-menu", role: "menu"}, 
						        	pages
						        )
						    )
						)
					), 
					React.createElement(DisplayElements, {
						elements: this.state.Elements[this.state.currentPage].Elements, 
						editElement: this.editElement, 
						deleteElement: this.deleteElement, 
						updateElement: this.updateElement, 
						draggable: draggable}
					), 
					React.createElement("div", {className: "row"}, 
						React.createElement(AddElement, {updateQuestions: this.addQuestion, addPage: this.addPage})
					)
			)
		);
	}
});
InstrumentBuilderApp = React.createClass({displayName: "InstrumentBuilderApp",
	saveInstrument: function(){
		Instrument.save(this.refs.savePane.state, this.refs.buildPane.state.Elements);
	},
	loadCallback: function(elements, info) {
		this.refs.savePane.loadState(info);
		this.refs.buildPane.loadElements(elements);
		this.refs.loadPane.setAlert('success');
	},
	render: function () {
		var tabs = [];
		tabs.push(
			React.createElement(LoadPane, {
				TabId: "Load", 
				ref: "loadPane", 
				loadCallback: this.loadCallback}
			)
		);
		tabs.push(
			React.createElement(BuildPane, {
				TabId: "Build", 
				ref: "buildPane"}
			)
		);
		tabs.push(
			React.createElement(SavePane, {
				TabId: "Save", 
				ref: "savePane", 
				save: this.saveInstrument}
			)
		);
		return (
			React.createElement("div", null, 
				React.createElement("ul", {className: "nav nav-tabs", role: "tablist"}, 
					React.createElement("li", {role: "presentation"}, React.createElement("a", {href: "#Load", "aria-controls": "home", role: "tab", "data-toggle": "tab"}, "Load")), 
				    React.createElement("li", {role: "presentation", className: "active"}, React.createElement("a", {href: "#Build", "aria-controls": "build", role: "tab", "data-toggle": "tab"}, "Build")), 
				    React.createElement("li", {role: "presentation"}, React.createElement("a", {href: "#Save", "aria-controls": "messages", role: "tab", "data-toggle": "tab"}, "Save"))
				 ), 

			  	React.createElement("div", {className: "tab-content col-xs-12"}, 
				    tabs
			  	)
			)
		)
	}
});

RInstrumentBuilderApp = React.createFactory(InstrumentBuilderApp);