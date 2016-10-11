"use strict";

/* exported SelectField, SearchField, SelectDropdown */

/*
 Note this is only used in DQT
 For generic SelectDropdown, see Select in Form.js
 */

var SelectField = React.createClass({
  displayName: "SelectField",

  toggleCheckbox: function toggleCheckbox() {
    this.props.toggleCheckbox(this.props.label);
  },
  render: function render() {
    var checked = this.props.checked ? "checked" : "";
    var input;
    if (this.props.multi) {
      input = React.createElement("input", { type: "checkbox", value: this.props.label, checked: checked });
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

var SearchField = React.createClass({
  displayName: "SearchField",

  clearFilter: function clearFilter() {
    this.props.updateFilter("");
  },
  updateFilter: function updateFilter(event) {
    this.props.updateFilter(event.target.value);
  },
  render: function render() {
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

var SelectDropdown = React.createClass({
  displayName: "SelectDropdown",

  getInitialState: function getInitialState() {
    return {
      filter: "",
      open: false,
      options: {
        V01: "false",
        V02: "true"
      }
    };
  },
  toggleDropdown: function toggleDropdown() {
    this.setState(function (state) {
      return {
        open: !state.open
      };
    });
  },
  toggleCheckbox: function toggleCheckbox(key) {
    if (this.props.multi) {
      var action = this.props.options[key] ? "uncheck" : "check";
      this.props.onFieldClick(key, action);
    } else {
      this.props.onFieldClick(key);
      this.toggleDropdown();
    }
  },
  selectAll: function selectAll() {
    for (var option in this.props.options) {
      if (!this.props.options[option]) {
        this.props.onFieldClick(option, "check");
      }
    }
  },
  deselectAll: function deselectAll() {
    for (var option in this.props.options) {
      if (this.props.options[option]) {
        this.props.onFieldClick(option, "uncheck");
      }
    }
  },
  updateFilter: function updateFilter(filter) {
    this.setState(function (state) {
      return {
        filter: filter
      };
    });
  },
  render: function render() {
    var parentDivClass = "btn-group col-xs-12";
    var selectLabel = "None Selected";
    var selectCount = 0;
    var sizeCount = 0;
    var options = [];
    var key = "";
    var filter = "";

    if (this.state.open) {
      parentDivClass += " open";
    }
    if (this.props.multi) {
      for (key in this.props.options) {
        // Make sure inherited properties are not checked
        // See http://eslint.org/docs/rules/guard-for-in
        if ({}.hasOwnProperty.call(this.props.options, key)) {
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
      }
      if (selectCount === sizeCount) {
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
        // Make sure inherited properties are not checked
        // See http://eslint.org/docs/rules/guard-for-in
        if ({}.hasOwnProperty.call(this.props.options, key)) {
          filter = this.state.filter.toLowerCase();
          if (key.toLowerCase().indexOf(filter) === -1 && this.props.options[key].toLowerCase().indexOf(filter)) {
            continue;
          }
          options.push(React.createElement(SelectField, {
            label: this.props.options[key],
            checked: this.props.options[key],
            toggleCheckbox: this.toggleCheckbox,
            multi: this.props.multi
          }));
        }
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
        { type: "button",
          className: "btn btn-default dropdown-toggle col-xs-12",
          onClick: this.toggleDropdown },
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