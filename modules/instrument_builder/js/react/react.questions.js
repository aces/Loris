QuestionText = React.createClass({
	onChange: function(e){
		this.props.updateState({Description: e.target.value});
	},
	render: function () {
		return (
			<div className="form-group">
                <label className="col-sm-2 control-label">Question Text: </label>
                <div className="col-sm-6">
                    <input
                    	className="form-control"
                    	type="text" id="questionText"
                    	size="75"
                    	value={this.props.element ? this.props.element.Description : ''}
                    	onChange={this.onChange}
                    />
                </div>
            </div>
		)
	}
});
BasicOptions = React.createClass({
	onChange: function(e){
		this.props.updateState({Name: e.target.value});
	},
	render: function () {
		return (
			<div>
				<div className="form-group">
	                <label className="col-sm-2 control-label">Question Name: </label>
	                <div className="col-sm-6">
	                    <input className="form-control" type="text" id="questionName" onChange={this.onChange}/>
	                </div>
	            </div>
            	<QuestionText updateState={this.props.updateState} />
            </div>
		)
	}
});
DropdownOptions = React.createClass({
	getInitialState: function() {
		return {
			option: ''
		}
	},
	onChange: function(e){
		this.setState({option: e.target.value});
	},
	addOption: function(){
		var temp = this.props.Options,
			key = Enumize(this.state.option);
			temp.Values[key] = this.state.option;
			this.props.updateState({Options: temp});
	},
	render: function () {
		var multi = '',
			options = this.props.Options.Values;
		if(this.props.Options.AllowMultiple){
			multi = "multiple";
		}
		return (
			<div>
				<BasicOptions updateState={this.props.updateState}/>
				<div className="form-group">
                    <label className="col-sm-2 control-label">Dropdown Option: </label>
                    <div className="col-sm-3">
                        <input className="form-control" type="text" id="newSelectOption" onChange={this.onChange} />
                    </div>
                    <input className="btn btn-default" type="button" value="Add option" onClick={this.addOption.bind(this, false)} />
                    <input className="btn btn-default" type="button" value="Reset" /*onClick={this.resetOptions}*/ />
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label">Preview: </label>
                    <div className="col-sm-2">
                        <select multiple={multi} id="selectOptions" className="form-control">
                        	{Object.keys(options).map(function(option){
                        		return (
                        			<option>
                        				{options[option]}
                        			</option>
                        		)
                        	})}
                        </select>
                	</div>
			    </div>
			</div>
		)
	}
});
DateOptions = React.createClass({
	onChange: function(e){
		var options = this.props.Options;
		if(e.target.id === 'datemin'){
			options.MinDate = e.target.value + "-01-01";
		} else if (e.target.id === 'datemax'){
			options.MaxDate = e.target.value + "-12-31";
		}
		this.props.updateState({Options: options});
	},
	render: function () {
		var minYear = this.props.Options.MinDate.split('-')[0],
			maxYear = this.props.Options.MaxDate.split('-')[0];
		return (
			<div>
				<BasicOptions updateState={this.props.updateState}/>
                <div id="dateoptions" className="options form-group">
	                <label className="col-sm-2 control-label">Start year: </label>
	                <div className="col-sm-2">
	                    <input className="form-control" type="number" id="datemin" min="1900" max="2100" value={minYear} onChange={this.onChange} />
	                </div>
	                <label className="col-sm-2 control-label">End year: </label>
	                <div className="col-sm-2">
	                    <input className="form-control" type="number" id="datemax" min="1900" max="2100" onChange={this.onChange} value={maxYear} />
	                </div>
	            </div>
			</div>
		)
	}
});
NumericOptions = React.createClass({
	onChange: function(e){
		var options = this.props.Options;
		if(e.target.id === 'numericmin'){
			options.MinValue = parseInt(e.target.value);
		} else if (e.target.id === 'numericmax'){
			options.MaxValue = parseInt(e.target.value);
		}
		this.props.updateState({Options: options});
	},
	render: function () {
		return (
			<div>
				<BasicOptions updateState={this.props.updateState}/>
                <div id="numericoptions" className="options form-group">
	                <label className="col-sm-2 control-label">Min: </label>
	                <div className="col-sm-2">
	                    <input className="form-control" type="number" id="numericmin" onChange={this.onChange} value={this.props.Options.MinValue} />
	                </div>
	                <label className="col-sm-2 control-label">Max: </label>
	                <div className="col-sm-2">
	                    <input className="form-control" type="number" id="numericmax" onChange={this.onChange} value={this.props.Options.MaxValue} />
	                </div>
	            </div>
			</div>
		)
	}
});


ListElements = React.createClass({
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
			<div className="form-group">
			    <label for="selected-input" className="col-sm-2 control-label">Question Type:</label>
	            <div className="col-sm-4">
	                <div className="btn-group">
	                    <button id="selected-input" type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
	                        <span id="search_concept">{this.props.value} </span>
	                        <span className="caret"></span>
				        </button>
				        <ul className="dropdown-menu" role="menu">
			                <li>
			                    <div className="col-sm-12"><h5 className="">Information</h5></div>
			                </li>
			                <li onClick={this.selectType.bind(this, "header", "Header")}>
			                    <a id="header" className="option" title="Centered, header information">Header</a>
			                </li>
			                <li onClick={this.selectType.bind(this, "label", "Label")}>
			                    <a id="label" className="option" title="Unemphasized display text">Label</a>
			                </li>
			                <li onClick={this.selectType.bind(this, "scored", "Scored Field")}>
			                    <a id="scored" className="option" title="Column which stores calculated data">Scored Field</a>
			                </li>
			                <li className="divider"></li>
			                <li>
			                    <div className="col-sm-12"><h5 className="">Data entry</h5></div>
			                </li>
			                <li onClick={this.selectType.bind(this, "textbox", "Textbox")}>
			                    <a id="textbox" className="option" title="Text box for user data entry">Textbox</a>
			                </li>
			                <li onClick={this.selectType.bind(this, "textarea", "Textarea")}>
			                    <a id="textarea" className="option" title="Larger text area for data entry">Textarea</a>
			                </li>
			                <li onClick={this.selectType.bind(this, "dropdown", "Dropdown")}>
			                    <a id="dropdown" className="option" title="Dropdown menu for users to select data from">Dropdown</a>
			                </li>
			                <li onClick={this.selectType.bind(this, "multiselect", "Multiselect")}>
			                    <a id="multiselect" className="option" title="Data entry where multiple options may be selected">Multiselect</a>
			                </li>
			                <li onClick={this.selectType.bind(this, "date", "Date")}>
			                    <a id="date" className="option" title="User data entry of a date">Date</a>
			                </li>
			                <li onClick={this.selectType.bind(this, "numeric", "Numeric")}>
			                    <a id="numeric" className="option" title="User data entry of a number">Numeric</a>
			                </li>
			                <li className="divider"></li>
			                <li>
			                    <div className="col-sm-12"><h5 className="">Formatting</h5></div>
			                </li>
			                <li onClick={this.selectType.bind(this, "line", "Blank Line")}>
			                    <a id="line" className="option" title="Empty line">Blank Line</a>
			                </li>
			                <li onClick={this.selectType.bind(this, "page-break", "Page Break")}>
			                    <a id="page-break" className="option" title="Start a new page">Page Break</a>
			                </li>
			            </ul>
	                </div>
	            </div>
	        </div>
		)
	}
});

AddElement = React.createClass({
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
			element;
	    if(!selected) {
	        alert("No element type selected");
	        return;
	    }

	    if(questionText == '' && selected != 'line') {
	        if(selected == 'page-break') {
	            alert("Must use question text as page header");
	        } else {
	            alert("No question text specified");
	        }
	        return;
	    }
	    if(questionName == '' && selected != "header" && selected != "label" && selected != 'line' && selected != 'page-break') {
	        alert("Must specifiy name for database to save value into");
	        return;
	    }
	    switch(selected){
	    	case 'textbox':
	    	case 'textarea':
	    		selected = 'text';
	    		break;
	    	case 'dropdown':
	     	case 'multiselect':
	     		selected = 'select';
	     		break;
	    }
	    var element = {
	    	Type: selected,
	    	Description: questionText,
	    	Name: questionName,
	    	Options: this.state.Options,
	    	selected: this.state.selected
	    };

	    if(this.props.index){
	    	this.props.updateQuestions(element, this.props.index);
	    } else {
	    	this.props.updateQuestions(element);
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
				questionInput = <QuestionText updateState={this.updateState} element={this.state}/>
				break;
			case 'scored':
			case 'textbox':
			case 'textarea':
				questionInput = <BasicOptions updateState={this.updateState}/>
				break;
	    	case 'multiselect':
	    	case 'dropdown':
	    		questionInput = <DropdownOptions updateState={this.updateState} Options={this.state.Options}/>
	    		break;
	    	case 'date':
	    		questionInput = <DateOptions updateState={this.updateState} Options={this.state.Options}/>
	    		break;
	    	case 'numeric':
	    		questionInput = <NumericOptions updateState={this.updateState} Options={this.state.Options}/>
	    		break;
	    	case 'defualt':
	    		break;
		}
		if(this.props.element){
			buttons = (
				<input className="btn btn-default" type="button" value="Edit Row" onClick={this.addQuestion} />
			)
		} else {
			header = (
				<h2>Add Question</h2>
			);
			buttons = (
				<input className="btn btn-default" type="button" value="Add Row" onClick={this.addQuestion} />
			)
		}
		return (
			<div className="col-xs-12">
				{header}
			    <form className="form-horizontal" role="form">
			    	<ListElements updateState={this.updateState} value={this.state.selected.value}/>
			    	{questionInput}
			        <div className="form-group">
			            <div className="col-sm-offset-2 col-sm-10">
			                {buttons}
			            </div>
			        </div>
			    </form>
			</div>
		)
	}
});