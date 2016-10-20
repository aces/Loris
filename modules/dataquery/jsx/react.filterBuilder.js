/**
 *  The following file contains the components used for the filter builder tab
 *
 *  @author   Jordan Stirling <jstirling91@gmail.com>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://github.com/mohadesz/Loris-Trunk
 */

/*
 *  The following component is used for displaying operator for the group component
 */
LogicOperator = React.createClass({
	changeOperator: function(op) {
		// Wrapper function updating operator
		this.props.updateGroupOperator(op);
	},
	render: function() {
		// Renders the html for the component

		var andClass = "btn",
			orClass = "btn";

		// Set operator to OR if logicOperator is 1, AND otherwise
		if(this.props.logicOperator === 1) {
			orClass += " btn-primary";
			andClass += " switch"
		} else {
			andClass += " btn-primary";
			orClass += " switch"
		}
		return (
			<div className="btn-group" role="group">
		  		<button type="button" className={andClass} onClick={this.changeOperator.bind(this, 0)}>And</button>
		  		<button type="button" className={orClass} onClick={this.changeOperator.bind(this, 1)}>Or</button>
			</div>
		);
	}
});

/*
 *  The following component is used for displaying a filter rule
 */
FilterRule = React.createClass({
	getInitialState: function() {
		return {
			operators: {
				// "enum" : {
				"equal" : "=",
				"notEqual" : "!=",
				"lessThanEqual" : "<=",
		    	"greaterThanEqual" : ">=",
		    	"startsWith" : "startsWith",
		    	"contains" : "contains"
				// }
			}
		}
	},
	selectInstrument: function(event){
		// Update the rules instrument, getting the instruments avalible fields
		var rule = this.props.rule,
			that = this;
		if(event.target.value){
			rule.instrument = event.target.value;
			$.get(loris.BaseURL + "/AjaxHelper.php?Module=dataquery&script=datadictionary.php", { category: rule.instrument}, function(data) {
                rule.fields = data;
                that.props.updateRule(that.props.index, rule);
            }, 'json');
		}
	},
	fieldSelect: function(event) {
		// Update the rules desired field, setting the rules field and field type
		var rule = this.props.rule;
		delete rule.field;
		delete rule.fieldType;
		delete rule.operator;
		delete rule.value;
		delete rule.visit;
		delete rule.candidates;
		if(event.target.value) {
			rule.field = rule.fields[event.target.value].key[1];
			rule.fieldType = rule.fields[event.target.value].value.Type;
		}
		this.props.updateRule(this.props.index, rule);
	},
	operatorSelect: function(event) {
		// Update the desired rule operation for the selected field
		var rule = this.props.rule;
		delete rule.operator;
		delete rule.value;
		delete rule.visit;
		delete rule.candidates;
		if(event.target.value) {
			rule.operator = event.target.value;
		}
		this.props.updateRule(this.props.index, rule);
	},
	valueSet: function(event) {
		// Update the value to filter for, and runs the query for the rules parameters
		var rule = this.props.rule,
			that = this;
		delete rule.value;
		delete rule.visit;
		delete rule.candidates;
		if(event.target.value) {
			var responseHandler = function(data) {
					var i,
						allSessions = {},
						allCandiates = {};
					// Loop through data and divide into individual visits with unique PSCIDs
					// storing a master list of unique PSCIDs
					for(i = 0; i < data.length; i++){
						if(!allSessions[data[i][1]]){
							allSessions[data[i][1]] = [];
						}
						allSessions[data[i][1]].push(data[i][0]);
						if(!allCandiates[data[i][0]]){
							allCandiates[data[i][0]] = []
						}
						allCandiates[data[i][0]].push(data[i][1]);
					}
					rule.candidates = {
						"allCandiates" : allCandiates,
						"allSessions" : allSessions
					};
		            rule.session = Object.keys(allCandiates);
		            rule.visit = "All";
		            that.props.updateSessions(that.props.index, rule);
		        },
				ajaxRetrieve = function(script) {
		            $.get(loris.BaseURL + "/AjaxHelper.php?Module=dataquery&script=" + script,
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
		    	case "lessThanEqual":
		    		ajaxRetrieve("queryLessThanEqual.php");
		    		break;
		    	case "greaterThanEqual":
		    		ajaxRetrieve("queryGreaterThanEqual.php");
		    		break;
		    	case "startsWith":
		    		ajaxRetrieve("queryStartsWith.php");
		    		break;
		    	case "contains":
		    		ajaxRetrieve("queryContains.php");
		    		break;
		    	default:
		    		break;
		    }

			rule.value = event.target.value;
		}
		this.props.updateRule(this.props.index, rule);
	},
	updateVisit: function(event) {
		// Update rule to filter for specified visit
		var rule = this.props.rule;
		rule.visit = event.target.value;

		if(event.target.value === "all"){
			// If all visits, use keys of master list
			rule.session = Object.keys(rule.candidates.allCandiates);
		} else {
			// Else use list of PSCIDs for given vist
			rule.session = rule.candidates.allSessions[event.target.value];
		}
		this.props.updateSessions(this.props.index, rule);
	},
	render: function() {
		// Renders the html for the component

		var rule,
			fieldIndex,
			forVisits,
			visits,
			that = this;
		if(this.props.rule.instrument) {
			// Only display field select and etc. if instrument is selected
			var fields = this.props.rule.fields.map(function(field, index){
					if(that.props.rule.field && field.key[1] === that.props.rule.field) {
						fieldIndex = index
					}
					return (
						<option value={index}>{field.key[1]}</option>
					);
				}),
				operators = [],
				inputOptions, input, operatorKey, operatorSelect, options, value;

			if(this.props.rule.fieldType) {
				// Only display operators if field is selected
				inputType = this.props.rule.fieldType.split("(");
				operatorKey = inputType[0]
				for(var key in this.state.operators){
					operators.push(
						<option value={key} onChange={this.operatorSelect}>
							{this.state.operators[key]}
						</option>
					);
				}
				value = (this.props.rule.operator) ? this.props.rule.operator : "";
				operatorSelect = (
					<select className="input-sm col-xs-3 " onChange={this.operatorSelect} value={value}>
						<option value=""></option>
						{operators}
					</select>
				);
				if(this.props.rule.operator){
					// Only display value input if operator is selected, displaying specific
					// input type field data type
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
								<select className="input-sm col-xs-3" onChange={this.valueSet} value={value}>
									<option value=""></option>
									{options}
								</select>
							);
							break;
						default:
							input = (
								<input type="text"
									   className="input-sm col-xs-3"
									   onChange={this.valueSet}
									   value={this.props.rule.value}
								/>
							);
							break;
					}
				}
				if(this.props.rule.visit){
					// Display dropdown for visit select. This only displays after a value
					// has been inputed
					visits = Object.keys(this.props.Visits).map(function(visit){
						return (
							<option value={visit}>
								{visit}
							</option>
						);
					});
					forVisits = (
						<select className="input-sm col-xs-3" onChange={this.updateVisit} value={this.props.rule.visit}>
							<option value="all">All Visits</option>
							{visits}
						</select>
					);
				}
			}
			rule = (
				<div>
					<div className="col-xs-12">
						<label className="instrumentLabel">{this.props.rule.instrument}</label>
					</div>
					<div className="col-xs-10">
						<select className="input-sm col-xs-3" onChange={this.fieldSelect} value={fieldIndex}>
							<option value=""></option>
							{fields}
						</select>
						{operatorSelect}
						{input}
						{forVisits}
					</div>
				</div>
			);
		} else {
			// Else display dropdown for instrument select
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
						<button className="btn btn-danger btn-sm pull-right"
								onClick={this.props.deleteRule.bind(this, this.props.index)}
						>
							<span className="glyphicon glyphicon-remove"></span> Delete
						</button>
					</div>
				</div>
			</div>
		);
	}
});

/*
 *  The following component is used for displaying a filter group
 */
FilterGroup = React.createClass({
	updateChild: function(index, child) {
		// Update a specified child in the groups children

		var group = this.props.group;
		group.children[index] = child;

		if(this.props.index) {
			// If not base filter group, recursively call update child
			this.props.updateGroup(this.props.index, group);
		} else {
			// Else base filter group, update the filter in the data query component
			this.props.updateFilter(group);
		}
	},
	updateGroupOperator: function(operator) {
		// Update the group's operator
		var group = this.props.group;
		group.activeOperator = operator;

		// Update the groups sessions by calling the arrayintersect.js functions
		group.session = getSessions(group);

		if(this.props.index) {
			// If not base filter group, recursively call update child
			this.props.updateGroup(this.props.index, group);
		} else {
			// Else base filter group, update the filter in the data query component
			this.props.updateFilter(group);
		}
	},
	updateSessions: function(index, child) {
		// Computes the desired sessions of the current group
		var group = this.props.group,
		 	sessions = [],
		 	session = [];
		group.children[index] = child;

		// Update the groups sessions by calling the arrayintersect.js functions
		group.session = getSessions(group);
		if(this.props.index) {
			// If not base filter group, recursively call update parents session
			this.props.updateSessions(this.props.index, group);
		} else {
			// Else base filter group, update the filter in the data query component
			this.props.updateFilter(group)
		}
	},
	addChild: function(type) {
		// Add a child to the group
		var child,
			group = this.props.group;

		// Define the child's base data structure depending on specifed type
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
			// If not base filter group, recursively call update child
			this.props.updateGroup(this.props.index, group);
		} else {
			// Else base filter group, update the filter in the data query component
			this.props.updateFilter(group)
		}
	},
	deleteChild: function(index) {
		// Delete a child

		var group = this.props.group;
		group.children.splice(index, 1);

		// Update the groups sessions by calling the arrayintersect.js functions
		group.session = getSessions(group);


		if(this.props.index) {
			// If not base filter group, recursively call update child
			this.props.updateGroup(this.props.index, group);
		} else {
			// Else base filter group, update the filter in the data query component
			this.props.updateFilter(group);
		}
	},
	render: function() {
		// Renders the html for the component

		var logicOperator = (
				<LogicOperator logicOperator={this.props.group.activeOperator}
							   updateGroupOperator={this.updateGroupOperator}
				/>
			),
			that = this,

			// Render the children based on their type
		    children = this.props.group.children.map(function(child, index){
		    	if(child.type === "rule") {
		    		return (
		    			<li>
		    				<FilterRule rule = {child}
		    							items = {that.props.items}
		    							index = {index}
		    							updateRule = {that.updateChild}
		    							updateSessions = {that.updateSessions}
		    							deleteRule = {that.deleteChild}
		    							Visits={that.props.Visits}
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
		    							 deleteGroup = {that.deleteChild}
		    							 Visits={that.props.Visits}
		    				/>
		    			</li>
		    		);
		    	}
		    }),
			deleteButton;

		if(this.props.deleteGroup){
			// Can only delete a group that isn't the base group
			deleteButton = (
				<button className="btn btn-danger btn-sm pull-right"
										onClick={this.props.deleteGroup.bind(this, this.props.index)}
				>
					<span className="glyphicon glyphicon-remove"></span> Delete Group
				</button>
			)
		}
		return (
			<div className="tree">
				<ul className="firstUL">
					<li>
						<div className="row">
							<div className="col-xs-2">
								{logicOperator}
							</div>
							<div className="col-xs-10">
								{deleteButton}
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

/*
 *  The following component is the base componenet for the filter builder
 */
FilterBuilder = React.createClass({
    render: function() {
        return (
        	<div>
        		<h1 className="col-xs-12">Filter</h1>
        		<div className="col-xs-12">
	        		<div className="well well-primary">
	        			<FilterGroup group={this.props.filter}
	        						 items={this.props.items}
	        						 updateFilter = {this.props.updateFilter}
	        						 Visits={this.props.Visits}
	        			/>
					</div>
				</div>
        	</div>
        );
    }
});
