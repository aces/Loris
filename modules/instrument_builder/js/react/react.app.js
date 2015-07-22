LoadInstrument = React.createClass({
	render: function () {
		var spanDownStyle = {
			display: 'none'
		};
		return (
			<div className="col-sm-4 hidden-xs">
			    <div className="panel panel-primary">
			        <div className="panel-heading" onclick="hideLoad();">
			            Load Instrument (optional)
			            <span className="glyphicon glyphicon-chevron-down pull-right" style={spanDownStyle} id="down-load"></span>
			            <span className="glyphicon glyphicon-chevron-up pull-right" id="up-load"></span> 
			        </div>
			        <div className="panel-body" id="panel-load">
			            <input className="fileUpload" type="file" id="instfile" />
			            <br />
			            <input className="btn btn-default" type="button" id="load" value="Load Instrument" />
			        </div>
			    </div>
			</div>
		);
	}
});

DisplayElements = React.createClass({
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
								<tr data-id={i}
					            key={i}
					            draggable="true"
					            onDragEnd={this.dragEnd}
					            onDragStart={this.dragStart}>
									<td className="col-xs-2" colSpan="3">
										<AddElement updateQuestions={this.props.updateElement} element={element} index={i}/>
									</td>
								</tr>
							)
						} else {
							row = (
								<tr data-id={i}
					            key={i}
					            draggable="true"
					            onDragEnd={this.dragEnd}
					            onDragStart={this.dragStart}>
									<td className="col-xs-2">
										{element.Name}
									</td>
									<td className="col-xs-8">
										<LorisElement element={element} />
									</td>
									<td className="col-xs-2">
										<button onClick={this.props.editElement.bind(this, i)} className="button">
											Edit
										</button>
									</td>
								</tr>
							)
						}
						return (
							{row}
						)
					}).bind(this));
		return (
			<table id="sortable" className="table table-hover">
				<tbody onDragOver={this.dragOver}>
					{temp}
				</tbody>
			</table>
		)
	}
});

InstrumentBuilderApp = React.createClass({
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
	updateElement: function(element, index){
		this.setState(function(state){
			var temp = state.elements;
			temp[index] = element;
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
			<div>
				<div className="row"><LoadInstrument /></div>
				<DisplayElements
					elements={this.state.elements}
					editElement={this.editElement}
					updateElement={this.updateElement}
				/>
				<div className="row">
					<AddElement updateQuestions={this.addQuestion}/>
				</div>
				<div className="row"><h1>HELLO WORLD</h1></div>
			</div>
		);
	}
});

RInstrumentBuilderApp = React.createFactory(InstrumentBuilderApp);