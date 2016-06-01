SelectField = React.createClass({
	toggleCheckbox: function() {
		this.props.toggleCheckbox(this.props.label)
	},
	render: function() {
		var checked = (this.props.checked) ? "checked" : "",
			input;
		if(this.props.multi) {
			input = (
				<input type="checkbox"
    				   value={this.props.label}
    				   checked={checked}
    			/>
			);
		}
		return (
			<li>
		    	<div className="col-xs-12">
		    		<label className="selectFieldLabel" onClick={this.toggleCheckbox}>
		    			{input} {this.props.label}
		    		</label>
		    	</div>
		    </li>
		);
	}
});

SearchField = React.createClass({
	clearFilter: function() {
		this.props.updateFilter("");
	},
	updateFilter: function(event) {
		this.props.updateFilter(event.target.value)
	},
	render: function() {
		return (
			<li className="dropdownSearch">
				<div className="input-group col-xs-12">
					  <span className="input-group-addon">
					      <span className="glyphicon glyphicon-search"></span>
					  </span>
					  <input
					  	  type="text"
					  	  className="form-control"
					  	  onChange={this.updateFilter}
					  	  value = {this.props.filter}
					  />
					  <span className="input-group-addon" onClick={this.clearFilter}>
					  	  <span className="glyphicon glyphicon-remove"></span>
					  </span>
				</div>
			</li>
		);
	}
})

SelectDropdown = React.createClass({
	getInitialState: function() {
        return {
        	filter : "",
	       	open : false,
	       	options : {
	       		"V01" : "false",
	       		"V02" : "true"
	       	}
        };
    },
    toggleCheckbox: function(key) {
    	if(!this.props.multi) {
    		//this.deselectAll();
    		this.props.onFieldClick(key);
    		this.mouseOut();
    	} else {
    		var action = (this.props.options[key]) ? "uncheck" : "check";
    		this.props.onFieldClick(key, action);
    	}
    },
    selectAll: function() {
    	for(var option in this.props.options) {
    		if(!this.props.options[option]) {
    			this.props.onFieldClick(option, "check");
    		}
    	}
    },
    deselectAll: function() {
    	for(var option in this.props.options) {
    		if(this.props.options[option]) {
    			this.props.onFieldClick(option, "uncheck");
    		}
    	}
    },
    updateFilter: function(filter){
    	this.setState(function(state) {
    		return {
    			filter: filter
    		};
    	})
    },
    mouseOver: function() {
    	this.setState({open: true});
    },
    mouseOut: function() {
    	this.setState({open: false});
    },
	render: function() {
		var parentDivClass = "btn-group col-xs-12",
			selectLabel = "None Selected"
			selectCount = 0,
			sizeCount = 0,
			options = [],
			key = "",
			filter = "";
		if (this.state.open) {
			parentDivClass += " open";
		}
		if(this.props.multi) {
			for(key in this.props.options) {
				sizeCount++;
				options.push(
					<SelectField
						label = {key}
						checked = {this.props.options[key]}
						toggleCheckbox = {this.toggleCheckbox}
						multi = {this.props.multi}
					/>
				);
				if(this.props.options[key]) {
					selectCount++;
				}
			}
			if(selectCount == sizeCount) {
				options.unshift(
					<SelectField
						label = "Select All"
						checked = {true}
						toggleCheckbox = {this.deselectAll}
						multi = {this.props.multi}
					/>
				);
			} else {
				options.unshift(
					<SelectField
						label = "Select All"
						checked = {false}
						toggleCheckbox = {this.selectAll}
						multi = {this.props.multi}
					/>
				);
			}
			if (selectCount > 0) {
				selectLabel = selectCount + " Selected";
			}
		} else {
			for(key in this.props.options) {
				filter = this.state.filter.toLowerCase();
				if(key.toLowerCase().indexOf(filter) == -1 && this.props.options[key].toLowerCase().indexOf(filter)) {
					continue;
				}
				options.push(
					<SelectField
						label = {this.props.options[key]}
						checked = {this.props.options[key]}
						toggleCheckbox = {this.toggleCheckbox}
						multi = {this.props.multi}
					/>
				);
			}
			options.unshift(
					<SearchField
						updateFilter = {this.updateFilter}
						filter = {this.state.filter}
					/>
				);
			if(this.props.selectedCategory === "") {
				selectLabel = "Select One"
			} else {
				selectLabel = this.props.selectedCategory;
			}
		}
		return (
			<div className={parentDivClass}
				 onMouseOver={this.mouseOver}
				 onMouseOut={this.mouseOut}
			>
  				<button type="button" className="btn btn-default dropdown-toggle col-xs-12 selectDropdown">
    				<div className="col-xs-10">
    					<span className="pull-left">
    						{selectLabel}
    					</span>
    				</div>
    				<div className="pull-right">
    					<span className="glyphicon glyphicon-menu-down"></span>
    				</div>
  				</button>
  				<ul className="dropdown-menu">
				    {options}
			  	</ul>
			</div>
		)
	}
})