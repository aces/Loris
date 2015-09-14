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
	chooseFile: function (e) {
		var value = e.target.files[0];
		this.setState(function(state){
			return {
				file: value
			};
		});
	},
	loadFile: function () {
		Instrument.load(this.state.file, this.props.loadCallback);
	},
	render: function () {
		var spanDownStyle = {
			display: 'none'
		};
		return (
			<TabPane Title="Load Instrument"
                TabId={this.props.TabId}>
                	<div className="col-sm-4 col-xs-12">
						<input className="fileUpload"
							   type="file" id="instfile"
			            	   onChange={this.chooseFile}
						/>
			            <br />
			            <input className="btn btn-primary"
			            	   type="button" id="load"
			            	   value="Load Instrument"
			            	   onClick={this.loadFile}
			            />
			        </div>
			</TabPane>
		);
	}
});
SavePane = React.createClass({
	getInitialState: function() {
	 	return {
	 		fileName: '',
	 		instrumentName: ''
	 	};
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
			<TabPane Title="Save Instrument"
                TabId={this.props.TabId}>
                	<div className="form-group">
                		<div className="col-xs-12">
			                <label className="col-sm-2 control-label">Filename: </label>
			                <div className="col-sm-4">
			                    <input className="form-control"
			                    	   type="text" id="filename"
			                    	   value={value}
			                    	   onChange={this.onChangeFile}
			                   	/>
			                </div>
			            </div>
			            <br /><br />
			            <div className="col-xs-12">
			                <label className="col-sm-2 control-label">Instrument Name: </label>
			                <div className="col-sm-4">
			                    <input className="form-control"
			                    	   type="text" id="longname"
			                    	   value={this.state.instrumentName}
			                    	   onChange={this.onChangeInst}
			                    />
			                </div>
			            </div>
			            <br /><br />
			            <br className="visible-xs" />
			            <br className="visible-xs" />
			            <br className="visible-xs" />
			            <div className="col-xs-12">
			            	<div className="col-xs-6 col-sm-2 col-sm-offset-2">
			                	<input className="btn btn-primary col-xs-12" type="button" onclick="Instrument.validate()" value="Validate" />
			                </div>
			                <div className="col-xs-6 col-sm-2">
			                	<input className="btn btn-primary col-xs-12"
			                		   type="submit" value="Save"
			                		   onClick={this.props.save}
			                	/>
			                </div>
			            </div>
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
			temp[state.currentPage].Elements.push(element);
			return {
				Elements: temp
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
			        			<li onClick={that.selectPage.bind(this, i)}>
			                    	<a>{that.state.Elements[i].Description}</a>
			                	</li>
			                );
			        	}));
		return (
			<TabPane Title="Build your Instrument"
                TabId={this.props.TabId} Active={true}>
                	<div className="form-group col-xs-12">
					    <label for="selected-input" className="col-xs-2 col-sm-1 control-label">Page:</label>
			            <div className="col-sm-4">
			                <div className="btn-group">
			                    <button id="selected-input" type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
			                        <span id="search_concept">{this.state.Elements[this.state.currentPage].Description}</span>
			                        <span className="caret"></span>
						        </button>
						        <ul className="dropdown-menu" role="menu">
						        	{pages}
						        </ul>
						    </div>
						</div>
					</div>
					<DisplayElements
						elements={this.state.Elements[this.state.currentPage].Elements}
						editElement={this.editElement}
						updateElement={this.updateElement}
						draggable = {draggable}
					/>
					<div className="row">
						<AddElement updateQuestions={this.addQuestion} addPage={this.addPage}/>
					</div>
			</TabPane>
		);
	}
});
InstrumentBuilderApp = React.createClass({
	saveInstrument: function(){
		Instrument.save(this.refs.savePane.state, this.refs.buildPane.state.Elements);
	},
	loadCallback: function(elements, info) {
		this.refs.savePane.state = info;
		this.refs.buildPane.state.Elements = elements;
	},
	render: function () {
		var tabs = [];
		tabs.push(
			<LoadPane
				TabId="Load"
				ref="loadPane"
				loadCallback={this.loadCallback}
			/>
		);
		tabs.push(
			<BuildPane
				TabId="Build"
				ref="buildPane"
			/>
		);
		tabs.push(
			<SavePane
				TabId="Save"
				ref="savePane"
				save={this.saveInstrument}
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