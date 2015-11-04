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
	editElement: function (element) {
		alert("ksfnks");
	},
	render: function () {
		var temp = this.props.elements.map((function(element, i){
						var row;
						if(element.editing){
							row = (
								React.createElement("tr", {"data-id": i, 
					            key: i, 
					            draggable: "true", 
					            onDragEnd: this.dragEnd, 
					            onDragStart: this.dragStart}, 
									React.createElement("td", {className: "col-xs-2", colSpan: "3"}, 
										React.createElement(AddElement, {updateQuestions: this.editElement, element: element})
									)
								)
							)
						} else {
							row = (
								React.createElement("tr", {"data-id": i, 
					            key: i, 
					            draggable: "true", 
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
				React.createElement("tbody", {onDragOver: this.dragOver}, 
					temp
				)
			)
		)
	}
});

InstrumentBuilderApp = React.createClass({displayName: "InstrumentBuilderApp",
	getInitialState: function() {
	 	return {
	 		elements: [
	 		 	{
	 		 		Type: "header",
	 		 		Description: "Question Display (Front End)"
	 			}
	 		]
	 	};
	},
	editElement: function(elementIndex){
		this.setState(function(state){
			var temp = state.elements;
			temp[elementIndex].editing = temp[elementIndex].editing ? false : true;
			return {
				elements: temp
			};
		});
	},
	addQuestion: function(element){
		this.setState(function(state){
			var temp = state.elements;
			temp.push(element);
			return {
				elements: temp
			};
		});
	},
	render: function () {
		return (
			React.createElement("div", null, 
				React.createElement("div", {className: "row"}, React.createElement(LoadInstrument, null)), 
				React.createElement(DisplayElements, {
					elements: this.state.elements, 
					editElement: this.editElement}
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement(AddElement, {updateQuestions: this.addQuestion})
				), 
				React.createElement("div", {className: "row"}, React.createElement("h1", null, "HELLO WORLD"))
			)
		);
	}
});

RInstrumentBuilderApp = React.createFactory(InstrumentBuilderApp);