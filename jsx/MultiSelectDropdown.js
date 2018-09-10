/* exported SelectField, SearchField, SelectDropdown */

/*
 Note this is only used in DQT
 For generic SelectDropdown, see Select in Form.js
 */

import React, {Component} from 'react';

class SelectField extends Component {
  constructor(props) {
    super(props);

    this.toggleCheckbox = this.toggleCheckbox.bind(this);
  }

  toggleCheckbox() {
    this.props.toggleCheckbox(this.props.label);
  }

  render() {
    let checked = (this.props.checked) ? 'checked' : '';
    let input;
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
}

class SearchField extends Component {
  constructor(props) {
    super(props);
  }

  clearFilter() {
    this.props.updateFilter('');
  }
  updateFilter(event) {
    this.props.updateFilter(event.target.value);
  }

  render() {
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
}

class SelectDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: '',
      open: false,
      options: {
        V01: 'false',
        V02: 'true',
      },
    };
  }

  toggleDropdown() {
    this.setState(function(state) {
      return {
        open: !state.open,
      };
    });
  }

  toggleCheckbox(key) {
    if (this.props.multi) {
      let action = (this.props.options[key]) ? 'uncheck' : 'check';
      this.props.onFieldClick(key, action);
    } else {
      this.props.onFieldClick(key);
      this.toggleDropdown();
    }
  }

  selectAll() {
    for (let option in this.props.options) {
      if (!this.props.options[option]) {
        this.props.onFieldClick(option, 'check');
      }
    }
  }

  deselectAll() {
    for (let option in this.props.options) {
      if (this.props.options[option]) {
        this.props.onFieldClick(option, 'uncheck');
      }
    }
  }

  updateFilter(filter) {
    this.setState(function(state) {
      return {
        filter: filter,
      };
    });
  }

  render() {
    let parentDivClass = 'btn-group col-xs-12';
    let selectLabel = 'None Selected';
    let selectCount = 0;
    let sizeCount = 0;
    let options = [];
    let key = '';
    let filter = '';

    if (this.state.open) {
      parentDivClass += ' open';
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
        selectLabel = selectCount + ' Selected';
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
      if (this.props.selectedCategory === '') {
        selectLabel = 'Select One';
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
}

window.SelectField = SelectField;
window.SearchField = SearchField;
window.SelectDropdown = SelectDropdown;

export default {
  SelectField,
  SearchField,
  SelectDropdown,
};
