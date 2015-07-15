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
	    var data = this.state.elements;
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
						return (
							<tr data-id={i}
					            key={i}
					            draggable="true"
					            onDragEnd={this.dragEnd}
					            onDragStart={this.dragStart}>
									<td className="col-xs-2">
										{element.databaseName}
									</td>
									<td className="col-xs-8">
										{element.elementType}
									</td>
									<td className="col-xs-2">
										<button onClick={this.editElement.bind(this, element)} className="button">
											Edit
										</button>
									</td>
							</tr>
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

AddElement = React.createClass({
	getInitialState: function() {
	 	return {
	 		options: []
	 	};
	},
	selectType: function (id) {
		$(".options").hide();
        $(".option").removeClass("selected");
        $("#" + id).addClass("selected");
        // id = $(this).attr("id");
        $("#" + id + "options").toggle();
        $('#search_concept').text($("#" + id).text());
	},
	addQuestion: function () {
		selected = $(".selected").attr("id");
	    if(!selected) {
	        alert("No element type selected");
	        return;
	    }

	    questionText = document.getElementById("questionText");
	    questionName = document.getElementById("questionName");
	    if(questionText.value == '' && selected != 'line') {
	        if(selected == 'page-break') {
	            alert("Must use question text as page header");
	        } else {
	            alert("No question text specified");
	        }
	        return;
	    }
	    if(questionName.value == '' && selected != "header" && selected != "label" && selected != 'line' && selected != 'page-break') {
	        alert("Must specifiy name for database to save value into");
	        return;
	    }
	    var elementType;
	    switch(selected){
	    	case 'header':
	    		elementType = <HeaderElement header={questionText.value} />
	    		break;
	    	case 'label':
	    		elementType = <LabelElement label={questionText.value} />
	    		break;
	    	case 'scored':
	    		elementType = <ScoredElement label={questionText.value} />
	    		break;
	    	case 'textbox':
	    		elementType = <TextboxElement label={questionText.value} />
	    		break;
	    	case 'textarea':
	    		elementType = <TextareaElement label={questionText.value} />
	    		break;
	    	case 'dropdown':
	    		elementType = <SelectElement label={questionText.value} options={this.state.options} />
	    		break;
	    	case 'multiselect':
	    		elementType = <SelectElement
	    							label={questionText.value}
	    							options={this.state.options}
	    							multiple='true'
	    					   />
	    		break;
	    	case 'date':
	    		min = parseInt(document.getElementById('datemin').value, 10);
		        max = parseInt(document.getElementById('datemax').value, 10);
	    		elementType = <DateElement
	    							label={questionText.value}
	    							minYear={min}
	    							maxYear={max}
	    					   />
	    		break;
	    	case 'numeric':
	    		min = parseInt(document.getElementById('numericmin').value, 10);
		        max = parseInt(document.getElementById('numericmax').value, 10);
	    		elementType = <NumericElement
	    							label={questionText.value}
	    							min={min}
	    							max={max}
	    					   />
	    		break;
	    	case 'defualt':
	    		break;
	    }

	    this.props.updateQuestions(questionName.value, elementType);

	    question = document.createElement("span");
	    question.innerHTML = questionText.value;
	    question.setAttribute("contenteditable", "true");

	    switch(selected){
	    	case 'textbox':
	    	case 'textarea':
	    		addTextQuestion(question);
	    		break;
	    	case 'dropdown':
	    		q  = addDropdownQuestion(question);
	    		break;
	    	case 'multiselect':
	    		q  = addDropdownQuestion(question, 'multi');
	    		break;
	    	case 'date':
	    		min = parseInt(document.getElementById('datemin').value, 10);
		        max = parseInt(document.getElementById('datemax').value, 10);
		        q = addDateQuestion(question, min, max);
		        break;
	    	case 'numeric':
	    		min = parseInt(document.getElementById('numericmin').value, 10);
		        max = document.getElementById('numericmax').value;
		        q = addNumericQuestion(question, min, max);
		        break;
	    	case 'scored':
	    	case 'header':
	    	case 'label':
	    	case 'page-break':
	    		q = addStaticQuestion(selected, question);
	    		break;
	    	case 'defualt':
	    		q = [];
	    }

	    display = document.createElement("td");
	    for(e in q) {
	        if(q[e]) {
	            display.appendChild(q[e]);
	        }
	    }
	    row = document.createElement("tr");
	    $(row).addClass("_moveable");
	    dbname = document.createElement("td");
	    if(selected != "header" && selected != "label" && selected != "line" && selected != "page-break") {
	        dbname.innerHTML = questionName.value;
	        dbname.setAttribute("contenteditable", "true");
	        $(dbname).bind("change", function() { Rules.rebuildMenu("rule_q", "workspace"); Rules.rebuildMenu("rule_depends", "workspace", { dropdownOnly: true }); });
	    }
	    dbtype = document.createElement("td");
	    dbtype.innerHTML = selected;

	    actions = document.createElement("td");
	    actions.innerHTML = '(<a onclick="return moveUp(this);" href="javascript:return 0;">up</a>) (<a onclick="return moveDown(this);" href="javascript:return 0;">down</a>) (<a onclick="removeRow(this);" href="javascript:return 0;">delete</a>)';

	    row.appendChild(dbname);
	    row.appendChild(dbtype);
	    row.appendChild(display);
	    row.appendChild(actions);
	    document.getElementById("workspace").appendChild(row);

	    // Add the question to the rules dropdowns too
	    if(questionName.value) {
	        select = document.createElement("option");
	        select.setAttribute("value", questionName.value);
	        select.innerHTML = questionName.value;
	        document.getElementById("rule_q").appendChild(select);
	        document.getElementById("rule_depends").appendChild(select.cloneNode(true));
	    }
	    Rules.rebuildMenu("rule_q", "workspace");
	    Rules.rebuildMenu("rule_depends", "workspace", { dropdownOnly: true });
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
		return (
			<div className="col-xs-12">
				<h2>Add Question</h2>
			    <form className="form-horizontal" role="form">
			        <div className="form-group">
			            <label for="selected-input" className="col-sm-2 control-label">Question Type:</label>
			            <div className="col-sm-4">
			                <div className="btn-group">
			                    <button id="selected-input" type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
			                        <span id="search_concept">Select One </span>
			                        <span className="caret"></span>
			                    </button>
			                    <ul className="dropdown-menu" role="menu">
			                        <li>
			                            <div className="col-sm-12"><h5 className="">Information</h5></div>
			                        </li>
			                        <li onClick={this.selectType.bind(this, "header")}>
			                            <a id="header" className="option" title="Centered, header information">Header</a>
			                        </li>
			                        <li onClick={this.selectType.bind(this, "label")}>
			                            <a id="label" className="option" title="Unemphasized display text">Label</a>
			                        </li>
			                        <li onClick={this.selectType.bind(this, "scored")}>
			                            <a id="scored" className="option" title="Column which stores calculated data">Scored Field</a>
			                        </li>
			                        <li className="divider"></li>
			                        <li>
			                            <div className="col-sm-12"><h5 className="">Data entry</h5></div>
			                        </li>
			                        <li onClick={this.selectType.bind(this, "textbox")}>
			                            <a id="textbox" className="option" title="Text box for user data entry">Textbox</a>
			                        </li>
			                        <li onClick={this.selectType.bind(this, "textarea")}>
			                            <a id="textarea" className="option" title="Larger text area for data entry">Textarea</a>
			                        </li>
			                        <li onClick={this.selectType.bind(this, "dropdown")}>
			                            <a id="dropdown" className="option" title="Dropdown menu for users to select data from">Dropdown</a>
			                        </li>
			                        <li onClick={this.selectType.bind(this, "multiselect")}>
			                            <a id="multiselect" className="option" title="Data entry where multiple options may be selected">Multiselect</a>
			                        </li>
			                        <li onClick={this.selectType.bind(this, "date")}>
			                            <a id="date" className="option" title="User data entry of a date">Date</a>
			                        </li>
			                        <li onClick={this.selectType.bind(this, "numeric")}>
			                            <a id="numeric" className="option" title="User data entry of a number">Numeric</a>
			                        </li>
			                        <li className="divider"></li>
			                        <li>
			                            <div className="col-sm-12"><h5 className="">Formatting</h5></div>
			                        </li>
			                        <li onClick={this.selectType.bind(this, "line")}>
			                            <a id="line" className="option" title="Empty line">Blank Line</a>
			                        </li>
			                        <li onClick={this.selectType.bind(this, "page-break")}>
			                            <a id="page-break" className="option" title="Start a new page">Page Break</a>
			                        </li>
			                    </ul>
			                </div>
			            </div>
			        </div>
			            <div className="form-group">
			                <label className="col-sm-2 control-label">Question Name: </label>
			                <div className="col-sm-6">
			                    <input className="form-control" type="text" id="questionName" />
			                </div>
			            </div>
			            <div className="form-group">
			                <label className="col-sm-2 control-label">Question Text: </label>
			                <div className="col-sm-6">
			                    <input className="form-control" type="text" id="questionText" size="75"/>
			                </div>
			            </div>

			            <div id="dropdownoptions" className="options">
			                <div className="form-group">
			                    <label className="col-sm-2 control-label">Dropdown Option: </label>
			                    <div className="col-sm-3">
			                        <input className="form-control" type="text" id="newSelectOption" />
			                    </div>
			                    <input className="btn btn-default" type="button" value="Add option" onClick={this.addOption.bind(this, false)} />
			                    <input className="btn btn-default" type="button" value="Reset" onClick={this.resetOptions} />
			                </div>
			                    <div className="form-group">
			                        <label className="col-sm-2 control-label">Preview: </label>
			                        <div className="col-sm-2">
			                            <select id="selectOptions" className="form-control">
			                            	{this.state.options.map(function(option){
			                            		return (
			                            			<option>
			                            				{option}
			                            			</option>
			                            		)
			                            	})}
			                            </select>
			                    </div>
			                </div>
			            </div>
			            <div id="multiselectoptions" className="options">
			                <div className="form-group">
			                    <label className="col-sm-2 control-label"> Option: </label>
			                    <div className="col-sm-3">
			                        <input className="form-control" type="text" id="newmultiSelectOption" />
			                    </div>
			                    <input className="btn btn-default" type="button" value="Add option" onClick={this.addOption.bind(this, true)} />
			                    <input className="btn btn-default" type="button" value="Reset" onClick={this.resetOptions} />
			                </div>
			                    <div className="form-group">
			                        <label className="col-sm-2 control-label">Preview: </label>
			                        <div className="col-sm-2">
			                            <select multiple id="multiselectOptions" className="form-control">
			                            	{this.state.options.map(function(option){
			                            		return (
			                            			<option>
			                            				{option}
			                            			</option>
			                            		)
			                            	})}
			                            </select>
			                    </div>
			                </div>
			            </div>
			            <div id="dateoptions" className="options form-group">
			                <label className="col-sm-2 control-label">Start year: </label>
			                <div className="col-sm-2">
			                    <input className="form-control" type="number" id="datemin" min="1900" max="2100" />
			                </div>
			                <label className="col-sm-2 control-label">End year: </label>
			                <div className="col-sm-2">
			                    <input className="form-control" type="number" id="datemax" min="1900" max="2100" />
			                </div>
			            </div>
			            <div id="numericoptions" className="options form-group">
			                <label className="col-sm-2 control-label">Min: </label>
			                <div className="col-sm-2">
			                    <input className="form-control" type="number" id="numericmin" />
			                </div>
			                <label className="col-sm-2 control-label">Max: </label>
			                <div className="col-sm-2">
			                    <input className="form-control" type="number" id="numericmax" />
			                </div>
			            </div>
			        <div className="form-group">
			            <div className="col-sm-offset-2 col-sm-10">
			                <input className="btn btn-default" type="button" value="Add Row" onClick={this.addQuestion} />
			            </div>
			        </div>


			    </form>
			</div>
		)
	}
});

InstrumentBuilderApp = React.createClass({
	getInitialState: function() {
	 	return {
	 		elements: [
	 		 	{
	 		 		databaseName: "Database Name",
	 		 		elementType: "Question Display (Front End)"
	 			}
	 		]
	 	};
	},
	addQuestion: function(dbName, elmType){
		this.setState(function(state){
			var temp = state.elements,
				element = {
					databaseName: dbName,
					elementType: elmType
				};
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