/**
 *	This file contains the React classes for instrument builder
 * 	module.
 */

/**
 *	Base class for tabs within the UI of the instrument builder
 */
TabPane = React.createClass({
    render: function() {
        var classList = "tab-pane";
        if(this.props.Active) {
            classList += " active"
        }
        // Render the HTML
        return (
            <div className={classList} id={this.props.TabId}>
                <h1 className="tabHeader">{this.props.Title}</h1>
                	{this.props.children}
            </div>
        );
    }
});

/**
 *	This is the React class for loading in a previously
 *	made instrument.
 */
LoadPane = React.createClass({
	getInitialState: function() {
	 	return {
	 		// This is used to alert the user if the file was
	 		// loaded successfully or there was an error with
	 		// the loading.
	 		alert: ''
	 	};
	},
	// Indicates to the state which file has been choosen
	chooseFile: function (e) {
		var value = e.target.files[0];
		this.setState({
			file: value,
			alert: ''
		});
	},
	// Sets the alert to the specified type.
	setAlert: function (type) {
		this.setState({
			alert: type
		});
	},
	// Reset the alert to empty.
	resetAlert: function () {
		this.setState({
			alert: ''
		});
	},
	// Loads the specified file into builder tab.
	loadFile: function () {
		// Declare the success and error callbacks
		var callback = {
				success: this.props.loadCallback,
				error: this.setAlert
			};
		Instrument.load(this.state.file, callback);
	},
	// Render the HTML
	render: function () {
		var alert = '';
		// Set up declared alerts, if there is any.
		switch (this.state.alert) {
			case 'success':
				alert = (
					<div className="alert alert-success alert-dismissible" role="alert">
						  <button type="button" className="close" onClick={this.resetAlert}><span aria-hidden="true">&times;</span></button>
						  <strong>Success!</strong> Instrument Loaded
					</div>
				)
				break;
			case 'typeError':
				alert = (
					<div className="alert alert-danger alert-dismissible" role="alert">
						  <button type="button" className="close" onClick={this.resetAlert}><span aria-hidden="true">&times;</span></button>
						  <strong>Error!</strong> Wrong file format
					</div>
				)
				break;
		}
		return (
			<TabPane Title="Load Instrument" TabId={this.props.TabId}>
                	<div className="col-sm-6 col-xs-12">
                		{alert}
						<input className="fileUpload"
							   type="file" id="instfile"
			            	   onChange={this.chooseFile}
						/>
			            <input className="btn btn-primary spacingTop"
			            	   type="button" id="load"
			            	   value="Load Instrument"
			            	   onClick={this.loadFile}
			            />
			        </div>
			</TabPane>
		);
	}
});

/**
 *	This is the React class for saving the instrument
 */
SavePane = React.createClass({
	getInitialState: function() {
	 	return {
	 		fileName: '',
	 		instrumentName: ''
	 	};
	},
	// Used to set the state when a file is loaded
	// using the load tab.
	loadState: function(newState) {
		this.setState({
			fileName: newState.fileName,
			instrumentName: newState.instrumentName
		});
	},
	// Keep track of the file name, saving it in the state
	onChangeFile: function(e){
		var value = e.target.value;
		this.setState({
			fileName: value
		});
	},
	// Keep track of the instrument name, saving it in the state
	onChangeInst: function(e){
		var value = e.target.value;
		this.setState({
			instrumentName: value
		});
	},
	// Render the HTML
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
			            <div className="col-xs-12 spacingTop">
			                <label className="col-sm-2 control-label">Instrument Name: </label>
			                <div className="col-sm-4">
			                    <input className="form-control"
			                    	   type="text" id="longname"
			                    	   value={this.state.instrumentName}
			                    	   onChange={this.onChangeInst}
			                    />
			                </div>
			            </div>
			            <div className="col-xs-12 spacingTop">
			            	<div className="col-xs-12 col-sm-4 col-sm-offset-2">
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

/**
 *  This is the React class displaying the questions
 *  in the table.
 */
DisplayElements = React.createClass({
  // Used for the drag and drop rows
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
  // Used for the drag and drop rows
  getTableRow: function(element) {
    if (element.tagName !== 'tr') {
      return $(element).closest('tr')[0];
    }
    else {
      return element;
    }
  },
  // Used for the drag and drop rows
  dragStart: function(e) {
    this.dragged = this.getTableRow(e.currentTarget);
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires dataTransfer data to be set
    e.dataTransfer.setData("text/html", e.currentTarget);
  },
  // Used for the drag and drop rows
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
    this.setState({
      data: data
    });
  },
  // Used for the drag and drop rows
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
  // Render the HTML
  render: function() {
    var temp = this.props.elements.map((function(element, i) {
      var row;
      var colStyles = {'wordWrap': 'break-word'};
      if (element.editing) {
        // If you are editing an element, show element as an AddElement object
        row = (
          <tr data-id={i}
              key={i}
              draggable={this.props.draggable}
              onDragEnd={this.dragEnd}
              onDragStart={this.dragStart}>
            <td className="col-xs-2" colSpan="3">
              <AddElement updateQuestions={this.props.updateElement}
                          element={element} index={i}/>
            </td>
          </tr>
        )
      } else {
        // Else display element in regular way
        row = (
          <tr data-id={i}
              key={i}
              draggable={this.props.draggable}
              onDragEnd={this.dragEnd}
              onDragStart={this.dragStart}>
            <td style={colStyles}>
              {element.Name}
            </td>
            <td style={colStyles}>
              <LorisElement element={element}/>
            </td>
            <td style={colStyles}>
              <button onClick={this.props.editElement.bind(this, i)} className="button">
                Edit
              </button>
              <button onClick={this.props.deleteElement.bind(this, i)} className="button">
                Delete
              </button>
            </td>
          </tr>
        )
      }
      return (
      {row}
      )
    }).bind(this));

    // Set fixed layout to force column widths to be based on first row
    var tableStyles = {
      tableLayout: 'fixed'
    };

    return (
      <table id="sortable" className="table table-hover" style={tableStyles}>
        <thead>
        <tr>
          <th className="col-xs-2">Database Name</th>
          <th className="col-xs-6">Question Display (Front End)</th>
          <th className="col-xs-4">Edit</th>
        </tr>
        </thead>
        <tbody onDragOver={this.dragOver}>
          {temp}
        </tbody>
      </table>
    )
  }
});

/**
 *	This is the React class for building the instrument
 */
BuildPane = React.createClass({
	getInitialState: function() {
	 	return {
	 		// Keep track of the page groups
	 		Elements: [{
	 			Type      	: "ElementGroup",
    			GroupType 	: "Page",
    			Description : "Top",
    			// Keep track of the elements on the page
    			Elements 	: []
	 		}],
	 		// Keep track if elements are being edited to ensure
	 		// that drag and drop is not usable if any are being
	 		// edited
	 		amountEditing : 0,
	 		// Keep track of which page you are on
	 		currentPage   : 0,
	 		// Keep track of elements DB names to ensure no doubles
	 		// are added
	 		elementDBNames : {}
	 	};
	},
	// Load in a group of elements, replacing any that
	// were already present
	loadElements: function(elements) {
		this.setState({
			Elements: elements
		});
	},
	// Set the element editing flag to true to render the element
	// as an AddQuestion object. Increase the number of editing to
	// disable drag and drop
	editElement: function(elementIndex){
		// Use a function to update the state to enqueue an atomic
		// update that consults the previous value of state before
		// setting any values
		this.setState(function(state){
			var temp = state.Elements,
				edit = state.amountEditing + 1,
				dbNames = state.elementDBNames;
			delete dbNames[temp[state.currentPage].Elements[elementIndex].Name];
			temp[state.currentPage].Elements[elementIndex].editing = true;
			return {
				Elements: temp,
				amountEditing: edit,
				elementDBNames: dbNames
			};
		});
	},
	// Remove an element from the current page's elements.
	deleteElement: function(elementIndex){
		// Use a function to update the state to enqueue an atomic
		// update that consults the previous value of state before
		// setting any values
		this.setState(function(state){
			var temp = state.Elements;
			temp[state.currentPage].Elements.splice(elementIndex, 1);
			return {
				Elements: temp
			};
		});
	},
	// Update an element. Returns true on success, false otherwise
	updateElement: function(element, index){
		if (element.Name && element.Name in this.state.elementDBNames){
			// If the DB name already exists return false.
			return false;
		}
		// Use a function to update the state to enqueue an atomic
		// update that consults the previous value of state before
		// setting any values
		this.setState(function(state){
			var temp = state.Elements,
				// Decriment the editing count
				edit = state.amountEditing - 1,
				dbNa = state.elementDBNames;
			temp[state.currentPage].Elements[index] = element;
			if (element.Name) {
				// Add the DB name to the list of current names
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
	// Add a new question to the page's elements
	addQuestion: function(element){
		if (element.Name && element.Name in this.state.elementDBNames){
			// If the DB name already exists return false.
			return false;
		}
		// Use a function to update the state to enqueue an atomic
		// update that consults the previous value of state before
		// setting any values
		this.setState(function(state){
			var temp = state.Elements,
				dbNa = state.elementDBNames;
			if (element.Name) {
				// Add the DB name to the list of current names
				dbNa[element.Name] = '';
			}
			temp[state.currentPage].Elements.push(element);
			return {
				Elements: temp,
				elementDBNames: dbNa
			};
		});
		return true;
	},
	// Add a new page
	addPage: function (pageName) {
		// Use a function to update the state to enqueue an atomic
		// update that consults the previous value of state before
		// setting any values
		this.setState(function(state){
			var temp = state.Elements,
				// change the current page to the new one
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
	// Change to a page
	selectPage: function (index) {
		this.setState({
			currentPage: index
		});
	},
	// Render the HTML
	render: function () {
		var draggable = this.state.amountEditing === 0 ? true : false,
			that	  = this,
			// List the pages
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
						deleteElement={this.deleteElement}
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

/**
 *	This is the React class for the instrument builder
 */
InstrumentBuilderApp = React.createClass({
	// Save the instrument
	saveInstrument: function(){
		// Call to external function, passing it the save information and the elements
		// to save
		Instrument.save(this.refs.savePane.state, this.refs.buildPane.state.Elements);
	},
	// Load an instrument
	loadCallback: function(elements, info) {
		// Set the savePane state to that extracted from the file
		this.refs.savePane.loadState(info);
		// Set the buildPane elements to the rendered elements
		this.refs.buildPane.loadElements(elements);
		// Set the alert state to success in the loadPane
		this.refs.loadPane.setAlert('success');
	},
	// Render the HTML
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
				 </ul>

				<div className="row">
					<div className="tab-content col-xs-12">
						{tabs}
					</div>
				</div>
			</div>
		)
	}
});

RInstrumentBuilderApp = React.createFactory(InstrumentBuilderApp);