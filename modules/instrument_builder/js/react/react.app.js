TabPane = React.createClass({
    render: function() {
        var classList = "tab-pane";
        if(this.props.Active) {
            classList += " active"
        }
        return (
            <div className={classList} id={this.props.TabId}>
                <h1>{this.props.Title}</h1>
                <br />
                {this.props.children}
            </div>
            );
    }
});
LoadPane = React.createClass({
	render: function () {
		var spanDownStyle = {
			display: 'none'
		};
		return (
			<TabPane Title="Load and Instrument"
                TabId={this.props.TabId}>
                	<div className="col-xs-4">
						<input className="fileUpload" type="file" id="instfile" />
			            <br />
			            <input className="btn btn-default" type="button" id="load" value="Load Instrument" />
			        </div>
			</TabPane>
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
					            draggable={this.props.draggable}
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
					            draggable={this.props.draggable}
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
				<thead>
					<tr className="info">
						<th className="col-xs-2">Database Name</th>
						<th>Question Display (Front End)</th>
						<th>Edit</th>
					</tr>
				</thead>
				<tbody onDragOver={this.dragOver}>
					{temp}
				</tbody>
			</table>
		)
	}
});

BuildPane = React.createClass({
	getInitialState: function() {
	 	return {
	 		elements: [],
	 		amountEditing: 0
	 	};
	},
	editElement: function(elementIndex){
		this.setState(function(state){
			var temp = state.elements,
				edit = state.amountEditing + 1;
			temp[elementIndex].editing = true;
			return {
				elements: temp,
				amountEditing: edit
			};
		});
	},
	updateElement: function(element, index){
		this.setState(function(state){
			var temp = state.elements
				edit = state.amountEditing - 1;
			temp[index] = element;
			return {
				elements: temp,
				amountEditing: edit
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
		var draggable = this.state.amountEditing === 0 ? true : false;
		return (
			<TabPane Title="Build your Instrument"
                TabId={this.props.TabId} Active={true}>
					<DisplayElements
						elements={this.state.elements}
						editElement={this.editElement}
						updateElement={this.updateElement}
						draggable = {draggable}
					/>
					<div className="row">
						<AddElement updateQuestions={this.addQuestion}/>
					</div>
			</TabPane>
		);
	}
});
InstrumentBuilderApp = React.createClass({
	render: function () {
		var tabs = [];
		tabs.push(<LoadPane
				TabId="Load"
			/>
		);
		tabs.push(<BuildPane
				TabId="Build"
			/>
		);
		return (
			<div>
				<ul className="nav nav-tabs" role="tablist">
					<li role="presentation"><a href="#Load" aria-controls="home" role="tab" data-toggle="tab">Load</a></li>
				    <li role="presentation" className="active"><a href="#Build" aria-controls="build" role="tab" data-toggle="tab">Build</a></li>
				    <li role="presentation"><a href="#Save" aria-controls="messages" role="tab" data-toggle="tab">Save</a></li>
				    <li role="presentation"><a href="#Rules" aria-controls="settings" role="tab" data-toggle="tab">Rules</a></li>
				 </ul>

			  	<div className="tab-content row">
				    {tabs}
			  	</div>
				<div className="row"><h1>HELLO WORLD</h1></div>
			</div>
		)
	}
});

RInstrumentBuilderApp = React.createFactory(InstrumentBuilderApp);