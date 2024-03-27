/* exported SelectField, SearchField, SelectDropdown */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * MultiSelect Dropdown component
 * Note this is only used in DQT
 * For generic SelectDropdown, see Select in Form.js
 */
export class SelectField extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.toggleCheckbox = this.toggleCheckbox.bind(this);
  }

  /**
   * Toggle checkbox
   */
  toggleCheckbox() {
    this.props.toggleCheckbox(this.props.label);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let checked = (this.props.checked) ? 'checked' : '';
    let input;
    if (this.props.multi) {
      input = (
        <input
          type="checkbox"
          value={this.props.label}
          checked={checked}
          onChange={this.toggleCheckbox}/>
      );
    }
    return (
      <li>
        <div className="col-xs-12">
          <label>
            {input} {this.props.label}
          </label>
        </div>
      </li>
    );
  }
}
SelectField.propTypes = {
  toggleCheckbox: PropTypes.func,
  label: PropTypes.string,
  checked: PropTypes.bool,
  multi: PropTypes.bool,
};

/**
 * Search Field React component
 */
export class SearchField extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.clearFilter = this.cleaFilter.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
  }

  /**
   * Clear the filter
   */
  clearFilter() {
    this.props.updateFilter('');
  }

  /**
   * Update the filter
   * with the event target value
   *
   * @param {object} event
   */
  updateFilter(event) {
    this.props.updateFilter(event.target.value);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
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
SearchField.propTypes = {
  updateFilter: PropTypes.func,
  filter: PropTypes.string,
};

/**
 * Select Dropdown React component
 */
export class SelectDropdown extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
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
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.deselectAll = this.deselectAll.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.overlayClickHandler = this.overlayClickHandler.bind(this);
  }

  /**
   * Close Dropdown if overlay clicked.
   */
  overlayClickHandler() {
    if (this.state.open) {
      this.toggleDropdown();
    }
  }

  /**
   * Toggle Dropdown
   */
  toggleDropdown() {
    let open = !this.state.open;
    this.setState({open});
  }

  /**
   * Toggle the checkbox
   *
   * @param {string} key
   */
  toggleCheckbox(key) {
    if (this.props.multi) {
      let action = (this.props.options[key]) ? 'uncheck' : 'check';
      this.props.onFieldClick(key, action);
    } else {
      this.props.onFieldClick(key);
      this.toggleDropdown();
    }
  }

  /**
   * Select all options
   */
  selectAll() {
    for (let option in this.props.options) {
      if (!this.props.options[option]) {
        this.props.onFieldClick(option, 'check');
      }
    }
  }

  /**
   * Deselect all options
   */
  deselectAll() {
    for (let option in this.props.options) {
      if (this.props.options[option]) {
        this.props.onFieldClick(option, 'uncheck');
      }
    }
  }

  /**
   * Update the filter React component variable
   * with the given parameter
   *
   * @param {string} filter
   */
  updateFilter(filter) {
    this.setState({filter});
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
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
              key={key}
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
            key="selectAll"
            label="Select All"
            checked={true}
            toggleCheckbox={this.deselectAll}
            multi={this.props.multi}
          />
        );
      } else {
        options.unshift(
          <SelectField
            key="selectAll"
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
              key={key}
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
    const overlay = this.state.open ? (
       <div style={{
         top: 0,
         left: 0,
         zIndex: 100,
         position: 'fixed',
         width: 'calc(100vw)',
         height: 'calc(100vh)',
        }} onClick={this.overlayClickHandler}
       />
     ) : null;
    return (
      <>
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
        {overlay}
      </>
    );
  }
}
SelectDropdown.propTypes = {
  multi: PropTypes.bool,
  options: PropTypes.array,
  onFieldClick: PropTypes.func,
  selectedCategory: PropTypes.string,
};

window.SelectField = SelectField;
window.SearchField = SearchField;
window.SelectDropdown = SelectDropdown;

export default {
  SelectField,
  SearchField,
  SelectDropdown,
};
