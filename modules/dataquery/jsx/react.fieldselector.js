/**
 *  The following file contains the components used for the field select tab
 *
 *  @author   Jordan Stirling <jstirling91@gmail.com>
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://github.com/aces/Loris
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';


/**
 * Category Item component
 *
 * The following component is used for displaying
 * individual categories in the categories list
 */
class CategoryItem extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let classList = 'list-group-item';
    let badge = '';
    if (this.props.selected) {
      classList += ' active';
    }
    if (this.props.count >= 0) {
      badge = <span className='badge'>{this.props.count}</span>;
    }
    return (
      <a href='#' className={classList} onClick={this.props.onClick}>
        {this.props.name}
        {badge}
      </a>
    );
  }
}


/**
 * Category List component
 *
 * The following component is used
 * for displaying the list of available categories
 */
class CategoryList extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: '',
    };
    this.selectCategoryHandler = this.selectCategoryHandler.bind(this);
  }

  /**
   * select category handler
   * @param {string} category
   * @return {function} - A callback executed when the event is triggered
   */
  selectCategoryHandler(category) {
    return ((evt) => {
      if (this.props.onCategorySelect) {
        this.props.onCategorySelect(category);
      }
      this.setState({
        selectedCategory: category,
      });
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let items = [];
    for (i = 0; i < this.props.items.length; i += 1) {
      let selected = false;
      if (this.props.items[i].category == this.state.selectedCategory) {
        selected = true;
      }
      items.push(<CategoryItem
        key={this.props.items[i].category}
        name={this.props.items[i].category}
        count={this.props.items[i].numFields}
        selected={selected}
        onClick={this.selectCategoryHandler(this.props.items[i].category)}/>);
    }
    return (
      <div className='list-group col-md-3 col-sm-12'>{items}</div>
    );
  }
}

/**
 * Field Item component
 * The following component is used for displaying individual fields
 */
class FieldItem extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {};
    this.visitSelect = this.visitSelect.bind(this);
  }

  /**
   * Selects and deselects visits
   * @param {object} evt - An event
   */
  visitSelect(evt) {
    let field = {
      instrument: this.props.Category,
      field: this.props.FieldName,
    };
    if (evt.target.checked) {
      this.props.fieldVisitSelect('check', evt.target.value, field);
    } else {
      this.props.fieldVisitSelect('uncheck', evt.target.value, field);
    }
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let classList = 'list-group-item row';
    let downloadIcon = '';
    let criteria;
    let multiselect;

    if (this.props.selected) {
      // If field is selected, add active class and visits
      classList += ' active';
      multiselect = Object.keys(this.props.Visits).map((visit) => {
        let checked = false;
        if (this.props.selectedVisits[visit]) {
          checked = true;
        }
        return (
          <div key={visit} className='checkbox'>
            <label>
              <input
                type='checkbox'
                value={visit}
                checked={checked}
                onChange={this.visitSelect}
              />
              {visit}
            </label>
          </div>
        );
      });
    }

    if (this.props.downloadable) {
      // Add download icon if field is downloadable
      downloadIcon = <span
        className='glyphicon glyphicon-download-alt pull-right'
        title='Downloadable File'
      ></span>;
    }
    // Don't display the category in the field selector
    let displayName = this.props.FieldName;

    return (
      <div className={classList}>
        <div className='col-xs-8' onClick={this.props.onClick}>
          <h4 className='list-group-item-heading col-xs-12'>
            {displayName}{criteria}{downloadIcon}
          </h4>
          <span className='col-xs-12'>{this.props.Description}</span>
        </div>
        <div className='col-xs-4'>
          {multiselect}
        </div>
      </div>
    );
  }
}

/**
 * Field List component
 * The following component is used for displaying the list of availible fields for
 * the selected category
 */
class FieldList extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {};
    this.onFieldClick = this.onFieldClick.bind(this);
  }

  /**
   * On field clicked
   * Wrapper function used to update field
   *
   * @param {string} fieldName
   * @param {boolean} downloadable
   */
  onFieldClick(fieldName, downloadable) {
    this.props.onFieldSelect(fieldName, this.props.category, downloadable);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let fields = [];
    let items = this.props.items || [];
    let fieldName; let desc; let isFile; let type; let selected;
    let rowsPerPage = this.props.FieldsPerPage || 20;

    let start = (this.props.PageNumber - 1) * rowsPerPage;
    let filter = this.props.Filter.toLowerCase();
    let selectedFields;
    if (filter > 0) {
      start = 0;
    }

    let filteredItems = items.filter((item) => {
        fieldName = item.key[1];
        desc = item.value.Description;
        return (fieldName.toLowerCase().indexOf(filter) != -1 ||
            desc.toLowerCase().indexOf(filter) != -1);
    });

    // Display the fields using the FieldItem component
    for (let i = start; i < filteredItems.length; i += 1) {
      fieldName = filteredItems[i].key[1];
      type = filteredItems[i].value.Type || 'varchar(255)';

      // Check if field is a file, if so set flag to true
      isFile = false;
      if (filteredItems[i].value.IsFile) {
        isFile = true;
      }

      // Check if field is selected, if so set flag to true
      selected = false;
      if (this.props.selected && this.props.selected[fieldName]) {
        selected = true;
      }

      // Get the fields selected visits, set to empty object if none
      if (this.props.selected && this.props.selected[fieldName]) {
        selectedFields = this.props.selected[fieldName];
      } else {
        selectedFields = {};
      }

      fields.push(<FieldItem key={fieldName}
                             FieldName={fieldName}
                             Category={this.props.category}
                             Description={desc}
                             ValueType={type}
                             onClick={this.onFieldClick.bind(
                               this,
                               fieldName,
                               isFile
                             )}
                             selected={selected}
                             downloadable={isFile}
                             Visits={this.props.Visits}
                             selectedVisits={selectedFields}
                             fieldVisitSelect={this.props.fieldVisitSelect}
      />);
      if (fields.length > rowsPerPage) {
        break;
      }
    }

    return (
      <div className='list-group col-md-9 col-sm-12'>
        {fields}
        <PaginationLinks
          Total={filteredItems.length}
          Active={this.props.PageNumber}
          onChangePage={this.props.changePage}
          RowsPerPage={rowsPerPage}
        />
      </div>
    );
  }
}


/**
 * Field Selector component
 */
class FieldSelector extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    let instruments = {};
    for (let i = 0; i < this.props.items.length; i++) {
      instruments[this.props.items[i].category] = this.props.items[i].category;
    }
    this.state = {
      filter: '',
      selectedCategory: '',
      categoryFields: {},
      instruments: instruments,
      PageNumber: 1,
    };
    this.onFieldSelect = this.onFieldSelect.bind(this);
    this.onCategorySelect = this.onCategorySelect.bind(this);
    this.filterChange = this.filterChange.bind(this);
    this.addAll = this.addAll.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
    this.modifyCategoryFieldVists = this.modifyCategoryFieldVists.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  /**
   * Wrapper function for field changes
   * @param {string} fieldName
   * @param {string} category
   * @param {boolean} downloadable
   */
  onFieldSelect(fieldName, category, downloadable) {
    this.props.onFieldChange(fieldName, category, downloadable);
  }

  /**
   * Use the cached version if it exists
   * @param {string} elementName
   * @param {string} category
   */
  onCategorySelect(elementName, category) {
    if (this.state.categoryFields[category]) {
    } else {
      // Retrieve the data dictionary
      $.get(
        loris.BaseURL
        + '/AjaxHelper.php?Module=dataquery&script=datadictionary.php',
        {category: category},
        (data) => {
          let cf = this.state.categoryFields;
          cf[category] = data;
          this.setState({
            categoryFields: cf,
          });
        },
        'json'
      );
    }
    this.setState({
      selectedCategory: category,
      PageNumber: 1,
    });
  }

  /**
   * filter change event.
   * @param {object} evt - An event
   */
  filterChange(evt) {
    this.setState({
      filter: evt.currentTarget.value,
    });
  }

  /**
   * Adds all fields the currently selected category
   */
  addAll() {
    let i; let isFile; let fieldName; let category;
    for (i in this.state.categoryFields[this.state.selectedCategory]) {
      if (this.state.categoryFields[this.state.selectedCategory]
          .hasOwnProperty(i)
      ) {
        fieldName = this.state.categoryFields[
          this.state.selectedCategory
        ][i].key[1];
        category = this.state.categoryFields[
          this.state.selectedCategory
        ][i].key[0];
        if (this.props.selectedFields[category]
            && this.props.selectedFields[category][fieldName]
        ) {
          // Do nothing, already added
        } else {
          isFile = (this.state.categoryFields[category][i].value.isFile) ?
            true :
            false;
          this.props.onFieldChange(fieldName, category, isFile);
        }
      }
    }
  }

  /**
   * Deletes all fields the currently selected category
   */
  deleteAll() {
    let i; let fieldName; let category; let isFile;
    for (i in this.state.categoryFields[this.state.selectedCategory]) {
      if (this.state.categoryFields[this.state.selectedCategory]
          .hasOwnProperty(i)
      ) {
        fieldName = this.state.categoryFields[
          this.state.selectedCategory
        ][i].key[1];
        category = this.state.categoryFields[
          this.state.selectedCategory
        ][i].key[0];
        if (this.props.selectedFields[category]
            && this.props.selectedFields[category][fieldName]
        ) {
          isFile = (this.state.categoryFields[category][i].value.isFile) ?
            true :
            false;
          this.props.onFieldChange(fieldName, category, isFile);
        }
      }
    }
  }

  /**
   * Modify category field visits.
   * @param {string} visit
   * @param {string} action
   */
  modifyCategoryFieldVists(visit, action) {
    if (this.state.selectedCategory && this.props.selectedFields[
        this.state.selectedCategory
      ]
    ) {
      for (let field in this.props.selectedFields[
        this.state.selectedCategory
      ]) {
        if (field === 'allVisits') {
          continue;
        }
        if (action === 'check' && !this.props.selectedFields[
            this.state.selectedCategory
          ][field][visit]
        ) {
          this.props.fieldVisitSelect(
            action,
            visit,
            {instrument: this.state.selectedCategory, field: field}
          );
        } else if (action === 'uncheck' && this.props.selectedFields[
            this.state.selectedCategory
          ][field][visit]
        ) {
          this.props.fieldVisitSelect(
            action,
            visit,
            {instrument: this.state.selectedCategory, field: field}
          );
        }
      }
    }
  }

  /**
   * Change page
   * @param {number} i
   */
  changePage(i) {
    this.setState({
      PageNumber: i,
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let categoryVisits = {};
    let selectedFieldsCount;
    if (this.state.selectedCategory != '') {
      if (this.props.selectedFields[this.state.selectedCategory]) {
        selectedFieldsCount = Object.keys(
          this.props.selectedFields[this.state.selectedCategory]
        ).length - 1;
      }
      for (let key in this.props.Visits) {
        if (this.props.selectedFields[this.state.selectedCategory]
          && this.props.selectedFields[this.state.selectedCategory]
             .allVisits[key]
          && this.props.selectedFields[this.state.selectedCategory]
             .allVisits[key] == selectedFieldsCount
        ) {
          categoryVisits[key] = true;
        } else {
          categoryVisits[key] = false;
        }
      }
    }

    return (
      <div>
        <div className='row'>
          <h1 className='col-md-8'>{this.props.title}</h1>
          <div className='form-group col-sm-4 search'>
            <label className='col-sm-12 col-md-4'>
              Search within instrument:
            </label>
            <div className='col-sm-12 col-md-8'>
              <input
                type='text'
                onChange={this.filterChange}
                className='form-control input-sm'
              />
            </div>
          </div>
        </div>
        <div className='row form-group'>
          <div className='col-md-8'>
            <button
              type='button'
              className='btn btn-primary'
              onClick={this.addAll}
            >Add All</button>
            <button
              type='button'
              className='btn btn-primary'
              onClick={this.deleteAll}
            >Remove All</button>
          </div>
        </div>
        <div className='row form-group'>
          <div className='form-group col-sm-8 search'>
            <label className='col-sm-12 col-md-2'>Instrument:</label>
            <div className='col-sm-12 col-md-8'>
              <SearchableDropdown
                name="fieldsDropdown"
                options={this.state.instruments}
                onUserInput={this.onCategorySelect}
                placeHolder="Select One"
              />
            </div>
          </div>
          <div className='form-group col-sm-4 search'>
            <label className='col-sm-12 col-md-4'>Visits:</label>
            <div className='col-sm-12 col-md-8'>
              <SelectDropdown
                multi={true}
                options={categoryVisits}
                onFieldClick={this.modifyCategoryFieldVists}
              />
            </div>
          </div>
        </div>
        <div className='row'>
          <FieldList
            items={this.state.categoryFields[this.state.selectedCategory]}
            category={this.state.selectedCategory}
            Criteria={this.props.Criteria}
            onFieldSelect={this.onFieldSelect}
            FieldsPerPage='15'
            selected={this.props.selectedFields[this.state.selectedCategory]}
            Filter={this.state.filter}
            Visits={this.props.Visits}
            fieldVisitSelect={this.props.fieldVisitSelect}
            changePage={this.changePage}
            PageNumber={this.state.PageNumber}
          />
        </div>
      </div>
    );
  }
}

FieldSelector.propTypes = {
  selectedFields: PropTypes.object,
};

window.CategoryItem = CategoryItem;
window.CategoryList = CategoryList;
window.FieldItem = FieldItem;
window.FieldList = FieldList;
window.FieldSelector = FieldSelector;

export default {
  CategoryItem,
  CategoryList,
  FieldItem,
  FieldList,
  FieldSelector,
};
