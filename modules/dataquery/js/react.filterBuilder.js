LogicOperator = React.createClass({displayName: "LogicOperator",
	getInitialState: function() {
		return {
			activeOperator: 0
		}
	},
	changeOperator: function(op) {
		this.setState({
			activeOperator: op
		});
	},
	render: function() {
		var andClass = "btn btn-primary",
			orClass = "btn btn-primary";
		if(this.props.logicOperator === 0) {
			andClass += " active";
		} else {
			orClass += " active";
		}
		return (
			React.createElement("div", {className: "btn-group", role: "group"}, 
		  		React.createElement("button", {type: "button", className: andClass, onClick: this.changeOperator.bind(this, 0)}, "And"), 
		  		React.createElement("button", {type: "button", className: orClass, onClick: this.changeOperator.bind(this, 1)}, "Or")
			)
		);
	}
});

FilterRule = React.createClass({displayName: "FilterRule",
	selectInstrument: function(event){
		var rule = this.props.rule;
		if(event.target.value){
			rule.instrument = event.target.value;
			this.props.updateRule(this.props.index, rule)
		}
	},
	render: function() {
		var rule;
		if(this.props.rule.instrument) {
			rule = "yes";
		} else {
			var options = this.props.items.map(function(item){
				return (
					React.createElement("option", {value: item.category}, item.category)
				);
			});
			rule = (
				React.createElement("select", {onChange: this.selectInstrument, className: "input-sm col-xs-10"}, 
					React.createElement("option", {value: ""}), 
					options
				)
			)
		}
		return (
			React.createElement("div", {className: "panel panel-default"}, 
				React.createElement("div", {className: "panel-body"}, 
					rule, 
					React.createElement("div", {className: "col-xs-2"}, 
						React.createElement("button", {className: "btn btn-danger btn-sm pull-right"}, 
							React.createElement("span", {className: "glyphicon glyphicon-remove"}), " Delete"
						)
					)
				)
			)
		);
	}
});

FilterGroup = React.createClass({displayName: "FilterGroup",
	updateChild: function(index, child) {
		var group = this.props.group;
		group.children[index] = child;
		if(this.props.index) {
			this.props.updateGroup(index, group);
		} else {
			this.props.updateFilter(group);
		}
	},
	render: function() {
		var logicOperator = React.createElement(LogicOperator, {logicOperator: this.props.logicOperator}),
			that = this,
		    children = this.props.group.children.map(function(child, index){
		    	if(child.type === "rule") {
		    		return (
		    			React.createElement("li", null, 
		    				React.createElement(FilterRule, {rule: child, 
		    							items: that.props.items, 
		    							index: index, 
		    							updateRule: that.updateChild}
		    				)
		    			)
		    		);
		    	} else if(child.type === "group") {
		    		return (
		    			React.createElement("li", null, 
		    				React.createElement(FilterGroup, {group: child, 
		    							 items: that.props.items, 
		    							 index: index, 
		    							 updateRule: that.updateChild}
		    				)
		    			)
		    		);
		    	}
		    });

		return (
			React.createElement("div", {className: "tree"}, 
				React.createElement("ul", {className: "firstUL"}, 
					React.createElement("li", null, 
						logicOperator, 
						React.createElement("ul", null, 
							children
						)
					)
				)
			)
		)
	}
});

FilterBuilder = React.createClass({displayName: "FilterBuilder",
	getInitialState: function() {
		return {
			filter: {
				type: "group",
				activeOperator: 0,
				children: [
					{
						type: "rule"
					}
				]
			}
		}
	},
	updateFilter: function(filter) {
		this.setState({
			filter: filter
		});
	},
    render: function() {
        return (
        	React.createElement("div", null, 
        		React.createElement("h1", {className: "col-xs-12"}, "Filter"), 
        		React.createElement("div", {className: "col-xs-12"}, 
	        		React.createElement("div", {className: "well well-primary"}, 
	        			React.createElement(FilterGroup, {group: this.state.filter, 
	        						 items: this.props.items, 
	        						 updateFilter: this.updateFilter}
	        			)
					)
				)
        	)
        );
    }
});