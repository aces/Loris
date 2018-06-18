/**
 * This file contains React component for FilterForm
 *
 * @author Loris Team
 * @version 1.1.0
 *
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'Panel';

/**
 * FilterForm component.
 * A wrapper for form elements inside a selection filter.
 *
 * Adds necessary filter callbacks to all children and passes them to FormElement
 * for proper rendering.
 *
 * Keeps track of filter object and sends it to parent on every update.
 *
 * //HACK/NOTE: Loris has special behaviour for `candID` attribute in the query string,
 * making it impossible to use it for selection filters. This components renames
 * all `candID` fields to `candidateID` automatically before appending them to URL.
 *
 */
class FilterForm extends Component {
  constructor(props) {
    super(props);

    // Bind component instance to custom methods
    this.clearFilter = this.clearFilter.bind(this);
    this.getFormChildren = this.getFormChildren.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.onElementUpdate = this.onElementUpdate.bind(this);

    // Keeps track of querystring values
    // Saved as class variable instead of keeping in state
    this.queryString = QueryString.get();
  }

  componentWillReceiveProps() {
    let filter = {};
    let queryString = this.queryString;

    // Initiaze filter using querystring value
    Object.keys(queryString).forEach(function(key) {
      let filterKey = (key === 'candidateID') ? 'candID' : key;
      filter[filterKey] = {
        value: queryString[key],
        exactMatch: false,
      };
    });

    // Update parent component
    this.props.onUpdate(filter);
  }

  /**
   * Clear the filter object, querystring and input fields
   */
  clearFilter() {
    this.queryString = QueryString.clear(this.props.Module);
    this.props.onUpdate({});
  }

  /**
   * Iterates through FilterForm children, sets necessary callback functions
   * and initializes filterTable
   *
   * @return {Array} formChildren - array of children with necessary props
   */
  getFormChildren() {
    let formChildren = [];
    React.Children.forEach(this.props.children, function(child, key) {
      // If child is a React component (i.e not a simple DOM element)
      if (React.isValidElement(child) &&
        typeof child.type === 'function' &&
        child.props.onUserInput
      ) {
        let callbackFunc = child.props.onUserInput;
        let callbackName = callbackFunc.name;
        let elementName = child.type.displayName;
        let queryFieldName = (child.props.name === 'candID') ? 'candidateID' : child.props.name;
        let filterValue = this.queryString[queryFieldName];
        // If callback function was not set, set it to onElementUpdate() for form
        // elements and to clearFilter() for <ButtonElement type='reset'/>.
        if (callbackName === 'onUserInput') {
          if (elementName === 'ButtonElement' && child.props.type === 'reset') {
            callbackFunc = this.clearFilter;
          } else {
            callbackFunc = this.onElementUpdate.bind(null, elementName);
          }
        }
        // Pass onUserInput and value props to all children
        formChildren.push(React.cloneElement(child, {
          onUserInput: callbackFunc,
          value: filterValue ? filterValue : '',
          key: key,
        }));
        // Initialize filter for StaticDataTable
        this.setFilter(elementName, child.props.name, filterValue);
      } else {
        formChildren.push(React.cloneElement(child, {key: key}));
      }
    }.bind(this));

    return formChildren;
  }

  /**
   * Appends entry to filter object or deletes it if value is
   * empty.
   *
   * Sets exactMatch to true for all SelectElements (i.e dropdowns)
   * in order to force StaticDataTable to do exact comparaison
   *
   * @param {string} type - form element type (i.e component name)
   * @param {string} key - the name of the form element
   * @param {string} value - the value of the form element
   *
   * @return {{}} filter - filterData
   */
  setFilter(type, key, value) {
    let filter = {};
    if (this.props.filter) {
      filter = JSON.parse(JSON.stringify(this.props.filter));
    }
    if (key) {
      filter[key] = {};
      if (value) { // all defined/non-null values must have some length, else empty string
        filter[key].value = Object.keys(value).length > 0 ? value : '';
      } else { // null and undefined handled here
        filter[key].value = '';
      }
      filter[key].exactMatch = (type === 'SelectElement' || type === 'select');
    }
    if (filter && key && value === '') {
      delete filter[key];
    }
    return filter;
  }

  /**
   * Sets filter object and querystring to reflect values of input fields
   *
   * @param {string} type - form element type (i.e component name)
   * @param {string} fieldName - the name of the form element
   * @param {string} fieldValue - the value of the form element
   */
  onElementUpdate(type, fieldName, fieldValue) {
    // Make sure key is of string type and value is of string or object type
    // before sending them to querystring
    if (typeof fieldName !== 'string' ||
        (typeof fieldValue !== 'string' && typeof fieldValue !== 'object')) {
      return;
    }

    // Update query string
    let queryFieldName = (fieldName === 'candID') ? 'candidateID' : fieldName;
    this.queryString = QueryString.set(this.queryString, queryFieldName, fieldValue);

    // Update filter and get new filter object
    let filter = this.setFilter(type, fieldName, fieldValue);
    this.props.onUpdate(filter);
  }

  render() {
    // Get formatted children
    let formChildren = this.getFormChildren();
    let formElements = this.props.formElements;

    if (formElements) {
      Object.keys(formElements).forEach(function(fieldName) {
        let queryFieldName = (fieldName === 'candID') ? 'candidateID' : fieldName;
        formElements[fieldName].onUserInput = this.onElementUpdate.bind(null, formElements[fieldName].type);
        formElements[fieldName].value = this.queryString[queryFieldName];
      }.bind(this));
    }

    return (
      <FormElement {...this.props}>
        {formChildren}
      </FormElement>
    );
  }
}

FilterForm.defaultProps = {
  id: 'selection-filter',
  height: '100%',
  title: 'Selection Filter',
  onUpdate: function() {
    console.warn('onUpdate() callback is not set!');
  },
};
FilterForm.propTypes = {
  Module: PropTypes.string.isRequired,
  filter: PropTypes.object.isRequired,
  id: PropTypes.string,
  height: PropTypes.string,
  title: PropTypes.string,
  onUpdate: PropTypes.func,
};

export default FilterForm;
