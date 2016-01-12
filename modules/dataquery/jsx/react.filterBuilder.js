LogicOperator = React.createClass({
	changeOperator: function(op) {
		this.props.updateGroupOperator(op);
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
			<div className="btn-group" role="group">
		  		<button type="button" className={andClass} onClick={this.changeOperator.bind(this, 0)}>And</button>
		  		<button type="button" className={orClass} onClick={this.changeOperator.bind(this, 1)}>Or</button>
			</div>
		);
	}
});

FilterRule = React.createClass({
	getInitialState: function() {
		return {
			operators: {
				"enum" : {
					"equal" : "=",
					"notEqual" : "!="
				}
			}
		}
	},
	selectInstrument: function(event){
		var rule = this.props.rule,
			that = this;
		if(event.target.value){
			rule.instrument = event.target.value;
			$.get("AjaxHelper.php?Module=dataquery&script=datadictionary.php", { category: rule.instrument}, function(data) {
                rule.fields = data;
                that.props.updateRule(that.props.index, rule);
            }, 'json');
		}
	},
	fieldSelect: function() {
		var rule = this.props.rule;
		delete rule.field;
		delete rule.fieldType;
		delete rule.operator;
		delete rule.value;
		if(event.target.value) {
			rule.field = rule.fields[event.target.value].key[1];
			rule.fieldType = rule.fields[event.target.value].value.Type;
		}
		this.props.updateRule(that.props.index, rule);
	},
	operatorSelect: function() {
		var rule = this.props.rule;
		delete rule.operator;
		delete rule.value;
		if(event.target.value) {
			rule.operator = event.target.value;
		}
		this.props.updateRule(that.props.index, rule);
	},
	valueSet: function() {
		var rule = this.props.rule,
			that = this;
		delete rule.value;
		if(event.target.value) {
			var responseHandler = function(data) {
		            rule.session = data;
		            that.props.updateSessions(rule);
		        },
				ajaxRetrieve = function(script) {
		            $.get("AjaxHelper.php?Module=dataquery&script=" + script,
		                  {
		                    category: rule.instrument,
		                    field: rule.field,
		                    value: event.target.value
		                  },
		                  responseHandler,
		                  'json'
		            );
		        };
		    switch(rule.operator) {
		    	case "equal":
		    		ajaxRetrieve("queryEqual.php");
		    		break;
		    	case "notEqual":
		    		ajaxRetrieve("queryNotEqual.php");
		    		break;
		    	default:
		    		break;
		    }
			rule.value = event.target.value;
		}
		this.props.updateRule(that.props.index, rule);
	},
	render: function() {
		var rule;
		if(this.props.rule.instrument) {
			var fields = this.props.rule.fields.map(function(field, index){
					return (
						<option value={index}>{field.key[1]}</option>
					);
				}),
				operators = [],
				inputOptions, input, operatorKey, operatorSelect, options, value;
			if(this.props.rule.fieldType) {
				inputType = this.props.rule.fieldType.split("(");
				operatorKey = inputType[0]
				for(var key in this.state.operators[operatorKey]){
					operators.push(
						<option value={key} onChange={this.operatorSelect}>
							{this.state.operators[operatorKey][key]}
						</option>
					);
				}
				value = (this.props.rule.operator) ? this.props.rule.operator : "";
				operatorSelect = (
					<select className="input-sm col-xs-4" onChange={this.operatorSelect} value={value}>
						<option value=""></option>
						{operators}
					</select>
				);
				if(this.props.rule.operator){
					switch(operatorKey){
						case "enum":
							inputOptions = enumToArray(this.props.rule.fieldType);
							options = inputOptions.map(function(option){
								return (
									<option value={option}>
										{option}
									</option>
								);
							});
							value = (this.props.rule.value) ? this.props.rule.value : "";
							input = (
								<select className="input-sm col-xs-4" onChange={this.valueSet} value={value}>
									<option value=""></option>
									{options}
								</select>
							);
						default:
							break;
					}
				}
			}
			rule = (
				<div className="col-xs-10">
					<select className="input-sm col-xs-4" onChange={this.fieldSelect}>
						<option value=""></option>
						{fields}
					</select>
					{operatorSelect}
					{input}
				</div>
			);
		} else {
			var options = this.props.items.map(function(item){
				return (
					<option value={item.category}>{item.category}</option>
				);
			});
			rule = (
				<select onChange={this.selectInstrument} className="input-sm col-xs-10">
					<option value=""></option>
					{options}
				</select>
			)
		}
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					{rule}
					<div className="col-xs-2">
						<button className="btn btn-danger btn-sm pull-right">
							<span className="glyphicon glyphicon-remove"></span> Delete
						</button>
					</div>
				</div>
			</div>
		);
	}
});

FilterGroup = React.createClass({
	updateChild: function(index, child) {
		var group = this.props.group;
		group.children[index] = child;
		if(this.props.index) {
			this.props.updateGroup(this.props.index, group);
		} else {
			this.props.updateFilter(group);
		}
	},
	updateGroupOperator: function(operator) {
		var group = this.props.group;
		group.activeOperator = operator;
		if(this.props.index) {
			this.props.updateGroup(this.props.index, group);
		} else {
			this.props.updateFilter(group);
		}
	},
	updateSessions: function(index, child) {
		var group = this.props.group,
		 	sessions = [],
		 	session = [];
		group.children[index] = child;
		for(var i = 0; i < group.children.length; i++) {
			sessions.push(group.children[i].session);
		}
		if(group.activeOperator === 0) {
			session = arrayIntersect(sessions);
		} else {
			// TODO: create a arrayUnion function and pass
			//       the sessions to it
		}
		group.session = session;
		if(this.props.index) {
			this.props.updateSessions(this.props.index, group);
		} else {
			this.props.updateFilter(group)
		}
	},
	addChild: function(type) {
		var child,
			group = this.props.group;
		if(type === "rule") {
			child = {
				type: "rule"
			}
		} else {
			child = {
				type: "group",
				activeOperator: 0,
				children: [
					{
						type: "rule"
					}
				]
			}
		}
		group.children.push(child);
		if(this.props.index) {
			this.props.updateGroup(this.props.index, group);
		} else {
			this.props.updateFilter(group)
		}
	},
	render: function() {
		var logicOperator = (
				<LogicOperator logicOperator={this.props.group.activeOperator}
							   updateGroupOperator={this.updateGroupOperator}
				/>
			),
			that = this,
		    children = this.props.group.children.map(function(child, index){
		    	if(child.type === "rule") {
		    		return (
		    			<li>
		    				<FilterRule rule = {child}
		    							items = {that.props.items}
		    							index = {index}
		    							updateRule = {that.updateChild}
		    							updateSessions = {that.updateSessions}
		    				/>
		    			</li>
		    		);
		    	} else if(child.type === "group") {
		    		return (
		    			<li>
		    				<FilterGroup group={child}
		    							 items={that.props.items}
		    							 index = {index}
		    							 updateGroup = {that.updateChild}
		    							 updateSessions = {that.updateSessions}
		    				/>
		    			</li>
		    		);
		    	}
		    });

		return (
			<div className="tree">
				<ul className="firstUL">
					<li>
						<div className="row">
							<div className="col-xs-2">
								{logicOperator}
							</div>
							<div className="col-xs-10">
								<button className="btn btn-primary btn-sm pull-right"
										onClick={this.addChild.bind(this, "group")}
								>
									<span className="glyphicon glyphicon-add"></span> Add Group
								</button>
								<button className="btn btn-primary btn-sm pull-right"
										onClick={this.addChild.bind(this, "rule")}
								>
									<span className="glyphicon glyphicon-add"></span> Add Rule
								</button>
							</div>
						</div>
						<ul>
							{children}
						</ul>
					</li>
				</ul>
			</div>
		)
	}
});

FilterBuilder = React.createClass({
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
        	<div>
        		<h1 className="col-xs-12">Filter</h1>
        		<div className="col-xs-12">
	        		<div className="well well-primary">
	        			<FilterGroup group={this.state.filter}
	        						 items={this.props.items}
	        						 updateFilter = {this.updateFilter}
	        			/>
					</div>
				</div>
        	</div>
        );
    }
});