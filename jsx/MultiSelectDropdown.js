/* exported SelectField, SearchField, SelectDropdown */

/*
 Note this is only used in DQT
 For generic SelectDropdown, see Select in Form.js
 */

var SelectField = React.createClass({
  toggleCheckbox: function() {
    this.props.toggleCheckbox(this.props.label);
  },
  render: function() {
    var checked = (this.props.checked) ? "checked" : "";
    var input;
    if (this.props.multi) {
      input = (
        <input type="checkbox" value={this.props.label} checked={checked}/>
      );
    }
    return (
      <li>
        <div className="col-xs-12">
          <label onClick={this.toggleCheckbox}>
            {input} {this.props.label}
          </label>
        </div>
      </li>
    );
  }
});

var SearchField = React.createClass({
  clearFilter: function() {
    this.props.updateFilter("");
  },
  updateFilter: function(event) {
    this.props.updateFilter(event.target.value);
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
            value={this.props.filter}
          />
          <span className="input-group-addon" onClick={this.clearFilter}>
            <span className="glyphicon glyphicon-remove"></span>
          </span>
        </div>
      </li>
    );
  }
});

var SelectDropdown = React.createClass({
  getInitialState: function() {
    return {
      filter: "",
      open: false,
      options: {
        V01: "false",
        V02: "true"
      }
    };
  },
  toggleDropdown: function() {
    this.setState(function(state) {
      return {
        open: !state.open
      };
    });
  },
  toggleCheckbox: function(key) {
    if (this.props.multi) {
      var action = (this.props.options[key]) ? "uncheck" : "check";
      this.props.onFieldClick(key, action);
    } else {
      this.props.onFieldClick(key);
      this.toggleDropdown();
    }
  },
  selectAll: function() {
    for (var option in this.props.options) {
      if (!this.props.options[option]) {
        this.props.onFieldClick(option, "check");
      }
    }
  },
  deselectAll: function() {
    for (var option in this.props.options) {
      if (this.props.options[option]) {
        this.props.onFieldClick(option, "uncheck");
      }
    }
  },
  updateFilter: function(filter) {
    this.setState(function(state) {
      return {
        filter: filter
      };
    });
  },
  render: function() {
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
          options.push(
            <SelectField
              label={key}
              checked={this.props.options[key]}
              toggleCheckbox={this.toggleCheckbox}
              multi={this.props.multi}
            />
          );
          if (this.props.options[key]) {
            selectCount++;
          }
        }
      }
      if (selectCount === sizeCount) {
        options.unshift(
          <SelectField
            label="Select All"
            checked={true}
            toggleCheckbox={this.deselectAll}
            multi={this.props.multi}
          />
        );
      } else {
        options.unshift(
          <SelectField
            label="Select All"
            checked={false}
            toggleCheckbox={this.selectAll}
            multi={this.props.multi}
          />
        );
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
          if (key.toLowerCase().indexOf(filter) === -1 &&
            this.props.options[key].toLowerCase().indexOf(filter)) {
            continue;
          }
          options.push(
            <SelectField
              label={this.props.options[key]}
              checked={this.props.options[key]}
              toggleCheckbox={this.toggleCheckbox}
              multi={this.props.multi}
            />
          );
        }
      }
      options.unshift(
        <SearchField
          updateFilter={this.updateFilter}
          filter={this.state.filter}
        />
      );
      if (this.props.selectedCategory === "") {
        selectLabel = "Select One";
      } else {
        selectLabel = this.props.selectedCategory;
      }
    }
    return (
      <div className={parentDivClass}>
        <button type="button"
                className="btn btn-default dropdown-toggle col-xs-12"
                onClick={this.toggleDropdown}>
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
    );
  }
});

window.SelectField = SelectField;
window.SearchField = SearchField;
window.SelectDropdown = SelectDropdown;

export default {
  SelectField,
  SearchField,
  SelectDropdown
};
