/**
 * This file contains React component for FilterForm
 *
 * @author Loris Team
 * @version 1.1.0
 *
 */

/**
 * FilterForm component.
 * A wrapper for form elements inside a selection filter.
 *
 * Adds necessary filter callbacks to all children and passes them to FormElement
 * for proper rendering.
 *
 * Keeps track of filter object and sends it to parent on every update.
 */
class FilterForm extends React.Component {

  constructor(props) {
    super(props);

    // Bind component instance to custom methods
    this.clearFilter = this.clearFilter.bind(this);
    this.getFormElements = this.getFormElements.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.onElementUpdate = this.onElementUpdate.bind(this);

    // Keeps track of querystring values
    // Saved as class variable instead of keeping in state
    this.queryString = QueryString.get();
  }

  componentDidMount() {
    let filter = {};
    let queryString = this.queryString;

    // Initiaze filter using querystring value
    Object.keys(queryString).forEach(function(key) {
      filter[key] = {
        value: queryString[key],
        exactMatch: false
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
   * Itterates through FilterForm children, sets necessary callback functions
   * and initializes filterTable
   *
   * @return {Array} formElements - array of children with necessary props
   */
  getFormElements() {
    let formElements = [];
    React.Children.forEach(this.props.children, function(child, key) {
      // If child is a React component (i.e not a simple DOM element)
      if (React.isValidElement(child) &&
        typeof child.type === "function" &&
        child.props.onUserInput
      ) {
        let callbackFunc = child.props.onUserInput;
        let callbackName = callbackFunc.name;
        let elementName = child.type.displayName;
        let filterValue = this.queryString[child.props.name];
        // If callback function was not set, set it to onElementUpdate() for form elements
        // and to clearFilter() for <ButtonElement type='reset'/>.
        if (callbackName === "onUserInput") {
          if (elementName === "ButtonElement" && child.props.type === "reset") {
            callbackFunc = this.clearFilter;
          } else {
            callbackFunc = this.onElementUpdate.bind(null, elementName);
          }
        }
        // Pass onUserInput and value props to all children
        formElements.push(React.cloneElement(child, {
          onUserInput: callbackFunc,
          value: filterValue ? filterValue : '',
          key: key
        }));
        // Initialize filter for StaticDataTable
        this.setFilter(elementName, child.props.name, filterValue);
      } else {
        formElements.push(React.cloneElement(child, {key: key}));
      }
    }.bind(this));

    return formElements;
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

    if (key && value) {
      filter[key] = {};
      filter[key].value = value;
      filter[key].exactMatch = (type === "SelectElement");
    } else if (filter && key && value === '') {
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
    // Make sure both key/value are string before sending them to querystring
    if (typeof fieldName !== "string" || typeof fieldValue !== "string") {
      return;
    }

    // Update query string
    this.queryString = QueryString.set(this.queryString, fieldName, fieldValue);

    // Update filter and get new filter object
    let filter = this.setFilter(type, fieldName, fieldValue);
    this.props.onUpdate(filter);
  }

  render() {
    // Get formatted children
    let formElements = this.getFormElements();
    return (
      <Panel id="selection-filter" title="Selection Filter">
        <FormElement {...this.props}>
          {formElements}
        </FormElement>
      </Panel>
    );
  }
}

FilterForm.defaultProps = {
  id: 'selection-filter',
  filterClass: "col-md-9",
  onUpdate: function() {
    console.warn('onUpdate() callback is not set!');
  }
};
FilterForm.propTypes = {
  Module: React.PropTypes.string.isRequired,
  filter: React.PropTypes.object.isRequired
};

window.FilterForm = FilterForm;

export default FilterForm;
