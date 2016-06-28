SelectField = React.createClass({
	displayName: "SelectField",

	toggleCheckbox: function () {
		this.props.toggleCheckbox(this.props.label);
	},
	render: function () {
		var checked = this.props.checked ? "checked" : "",
		    input;
		if (this.props.multi) {
			input = React.createElement("input", { type: "checkbox",
				value: this.props.label,
				checked: checked
			});
		}
		return React.createElement(
			"li",
			null,
			React.createElement(
				"div",
				{ className: "col-xs-12" },
				React.createElement(
					"label",
					{ onClick: this.toggleCheckbox },
					input,
					" ",
					this.props.label
				)
			)
		);
	}
});

SearchField = React.createClass({
	displayName: "SearchField",

	clearFilter: function () {
		this.props.updateFilter("");
	},
	updateFilter: function (event) {
		this.props.updateFilter(event.target.value);
	},
	render: function () {
		return React.createElement(
			"li",
			{ className: "dropdownSearch" },
			React.createElement(
				"div",
				{ className: "input-group col-xs-12" },
				React.createElement(
					"span",
					{ className: "input-group-addon" },
					React.createElement("span", { className: "glyphicon glyphicon-search" })
				),
				React.createElement("input", {
					type: "text",
					className: "form-control",
					onChange: this.updateFilter,
					value: this.props.filter
				}),
				React.createElement(
					"span",
					{ className: "input-group-addon", onClick: this.clearFilter },
					React.createElement("span", { className: "glyphicon glyphicon-remove" })
				)
			)
		);
	}
});

SelectDropdown = React.createClass({
	displayName: "SelectDropdown",

	getInitialState: function () {
		return {
			filter: "",
			open: false,
			options: {
				"V01": "false",
				"V02": "true"
			}
		};
	},
	toggleDropdown: function () {
		this.setState(function (state) {
			return {
				open: !state.open
			};
		});
	},
	toggleCheckbox: function (key) {
		if (!this.props.multi) {
			//this.deselectAll();
			this.props.onFieldClick(key);
			this.toggleDropdown();
		} else {
			var action = this.props.options[key] ? "uncheck" : "check";
			this.props.onFieldClick(key, action);
		}
	},
	selectAll: function () {
		for (var option in this.props.options) {
			if (!this.props.options[option]) {
				this.props.onFieldClick(option, "check");
			}
		}
	},
	deselectAll: function () {
		for (var option in this.props.options) {
			if (this.props.options[option]) {
				this.props.onFieldClick(option, "uncheck");
			}
		}
	},
	updateFilter: function (filter) {
		this.setState(function (state) {
			return {
				filter: filter
			};
		});
	},
	render: function () {
		var parentDivClass = "btn-group col-xs-12",
		    selectLabel = "None Selected";
		selectCount = 0, sizeCount = 0, options = [], key = "", filter = "";
		if (this.state.open) {
			parentDivClass += " open";
		}
		if (this.props.multi) {
			for (key in this.props.options) {
				sizeCount++;
				options.push(React.createElement(SelectField, {
					label: key,
					checked: this.props.options[key],
					toggleCheckbox: this.toggleCheckbox,
					multi: this.props.multi
				}));
				if (this.props.options[key]) {
					selectCount++;
				}
			}
			if (selectCount == sizeCount) {
				options.unshift(React.createElement(SelectField, {
					label: "Select All",
					checked: true,
					toggleCheckbox: this.deselectAll,
					multi: this.props.multi
				}));
			} else {
				options.unshift(React.createElement(SelectField, {
					label: "Select All",
					checked: false,
					toggleCheckbox: this.selectAll,
					multi: this.props.multi
				}));
			}
			if (selectCount > 0) {
				selectLabel = selectCount + " Selected";
			}
		} else {
			for (key in this.props.options) {
				filter = this.state.filter.toLowerCase();
				if (key.toLowerCase().indexOf(filter) == -1 && this.props.options[key].toLowerCase().indexOf(filter)) {
					continue;
				}
				options.push(React.createElement(SelectField, {
					label: this.props.options[key],
					checked: this.props.options[key],
					toggleCheckbox: this.toggleCheckbox,
					multi: this.props.multi
				}));
			}
			options.unshift(React.createElement(SearchField, {
				updateFilter: this.updateFilter,
				filter: this.state.filter
			}));
			if (this.props.selectedCategory === "") {
				selectLabel = "Select One";
			} else {
				selectLabel = this.props.selectedCategory;
			}
		}
		return React.createElement(
			"div",
			{ className: parentDivClass },
			React.createElement(
				"button",
				{ type: "button", className: "btn btn-default dropdown-toggle col-xs-12", onClick: this.toggleDropdown },
				React.createElement(
					"div",
					{ className: "col-xs-10" },
					React.createElement(
						"span",
						{ className: "pull-left" },
						selectLabel
					)
				),
				React.createElement(
					"div",
					{ className: "pull-right" },
					React.createElement("span", { className: "glyphicon glyphicon-menu-down" })
				)
			),
			React.createElement(
				"ul",
				{ className: "dropdown-menu" },
				options
			)
		);
	}
});