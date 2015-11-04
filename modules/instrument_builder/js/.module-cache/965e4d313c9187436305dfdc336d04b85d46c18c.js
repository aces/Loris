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
	render: function () {
		var spanDownStyle = {
			display: 'none'
		};
		return (
			React.createElement(TabPane, {Title: "Load and Instrument", 
                TabId: this.props.TabId}, 
                	React.createElement("div", {className: "col-xs-4"}, 
						React.createElement("input", {className: "fileUpload", type: "file", id: "instfile"}), 
			            React.createElement("br", null), 
			            React.createElement("input", {className: "btn btn-default", type: "button", id: "load", value: "Load Instrument"})
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
	editElement: function (element, index) {
		alert("ksfnks");
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
					React.createElement("tr", {className: "info"}, 
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
	 		currentPage   : 0
	 	};
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
	updateElement: function(element, index){
		this.setState(function(state){
			var temp = state.Elements
				edit = state.amountEditing - 1;
			temp[state.currentPage].Elements[index] = element;
			return {
				Elements: temp,
				amountEditing: edit
			};
		});
	},
	addQuestion: function(element){
		this.setState(function(state){
			var temp = state.Elements;
			temp[currentPage].Elements.push(element);
			return {
				Elements: temp
			};
		});
	},
	render: function () {
		var draggable = this.state.amountEditing === 0 ? true : false;
		return (
			React.createElement(TabPane, {Title: "Build your Instrument", 
                TabId: this.props.TabId, Active: true}, 
					React.createElement(DisplayElements, {
						elements: this.state.Elements.Elements, 
						editElement: this.editElement, 
						updateElement: this.updateElement, 
						draggable: draggable}
					), 
					React.createElement("div", {className: "row"}, 
						React.createElement(AddElement, {updateQuestions: this.addQuestion})
					)
			)
		);
	}
});
InstrumentBuilderApp = React.createClass({displayName: "InstrumentBuilderApp",
	render: function () {
		var tabs = [];
		tabs.push(React.createElement(LoadPane, {
				TabId: "Load"}
			)
		);
		tabs.push(React.createElement(BuildPane, {
				TabId: "Build"}
			)
		);
		return (
			React.createElement("div", null, 
				React.createElement("ul", {className: "nav nav-tabs", role: "tablist"}, 
					React.createElement("li", {role: "presentation"}, React.createElement("a", {href: "#Load", "aria-controls": "home", role: "tab", "data-toggle": "tab"}, "Load")), 
				    React.createElement("li", {role: "presentation", className: "active"}, React.createElement("a", {href: "#Build", "aria-controls": "build", role: "tab", "data-toggle": "tab"}, "Build")), 
				    React.createElement("li", {role: "presentation"}, React.createElement("a", {href: "#Save", "aria-controls": "messages", role: "tab", "data-toggle": "tab"}, "Save")), 
				    React.createElement("li", {role: "presentation"}, React.createElement("a", {href: "#Rules", "aria-controls": "settings", role: "tab", "data-toggle": "tab"}, "Rules"))
				 ), 

			  	React.createElement("div", {className: "tab-content row"}, 
				    tabs
			  	), 
				React.createElement("div", {className: "row"}, React.createElement("h1", null, "HELLO WORLD"))
			)
		)
	}
});

RInstrumentBuilderApp = React.createFactory(InstrumentBuilderApp);