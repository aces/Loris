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

    this.state = {
      collapsed: false,
      filter: QueryString.get()
    };

    // Bind component instance to custom methods
    this.clearFilter = this.clearFilter.bind(this);
    this.getFormElements = this.getFormElements.bind(this);
    this.setTableFilter = this.setTableFilter.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.toggleCollapsed = this.toggleCollapsed.bind(this);

    // Used to store filter format accepted by StaticDataTable
    // Saved as class variable instead of keeping in state
    this.tableFilter = {};
  }

  componentDidMount() {
    // Pass initial filter values to parent component
    this.props.onUpdate(this.tableFilter);
  }

  /**
   * Clear the filter object, querystring and input fields
   */
  clearFilter() {
    let filter = QueryString.clear(this.props.Module);
    this.props.onUpdate(filter);
    this.setState({filter});
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
        let filterValue = this.state.filter[child.ref];
        // If callback function was not set, set it to setFilter() for form elements
        // and to clearFilter() for <ButtonElement type='reset'/>.
        if (callbackName === "onUserInput") {
          if (elementName === "ButtonElement" && child.props.type === "reset") {
            callbackFunc = this.clearFilter;
          } else {
            callbackFunc = this.setFilter.bind(null, elementName);
          }
        }
        // Pass onUserInput and value props to all children
        formElements.push(React.cloneElement(child, {
          onUserInput: callbackFunc,
          value: filterValue ? filterValue : '',
          key: key
        }));
        // Initialize filter for StaticDataTable
        this.setTableFilter(elementName, child.ref, filterValue);
      } else {
        formElements.push(React.cloneElement(child, {key: key}));
      }
    }.bind(this));

    return formElements;
  }

  /**
   * Appends entry to tableFilter object or deletes it if value is
   * empty.
   *
   * Sets exactMatch to true for all SelectElements (i.e dropdowns)
   * in order to force StaticDataTable to do exact comparaison
   *
   * @param {string} type - form element type (i.e component name)
   * @param {string} key - the name of the form element
   * @param {string} value - the value of the form element
   *
   * @return {{}} tableFilter - filterData
   */
  setTableFilter(type, key, value) {
    // Deep copy of tableFilter object
    let tableFilter = JSON.parse(JSON.stringify(this.tableFilter));

    if (key && value) {
      tableFilter[key] = {};
      tableFilter[key].value = value;
      tableFilter[key].exactMatch = (type === "SelectElement");
    } else if (key && value === '') {
      delete tableFilter[key];
    }

    // Update class variable
    this.tableFilter = tableFilter;

    return tableFilter;
  }

  /**
   * Sets filter object and querystring to reflect values of input fields
   *
   * @param {string} type - form element type (i.e component name)
   * @param {string} fieldName - the name of the form element
   * @param {string} fieldValue - the value of the form element
   */
  setFilter(type, fieldName, fieldValue) {
    // Make sure both key/value are string before sending them to querystring
    if (typeof fieldName !== "string" || typeof fieldValue !== "string") {
      return;
    }

    // Update query string and get new filter object
    let filter = QueryString.set(this.state.filter, fieldName, fieldValue);

    // Update tableFilter and get new tableFilter object
    let tableFilter = this.setTableFilter(type, fieldName, fieldValue);

    this.props.onUpdate(tableFilter);
    this.setState({filter});
  }

  toggleCollapsed() {
    this.setState({collapsed: !this.state.collapsed});
  }

  render() {
    // Selection filter open by default
    let glyphClass = "glyphicon pull-right glyphicon-chevron-up";
    let panelClass = "panel-collapse collapse in";

    // Change arrow direction when closed
    if (this.state.collapsed) {
      glyphClass = "glyphicon pull-right glyphicon-chevron-down";
    }

    // Get formatted children
    let formElements = this.getFormElements();

    return (
      <div className="panel panel-primary">
        <div className="panel-heading"
             onClick={this.toggleCollapsed}
             data-toggle="collapse"
             data-target="#selection-filter"
        >
          Selection Filter
          <span className={glyphClass}></span>
        </div>
        <div id="selection-filter" className={panelClass} role="tabpanel">
          <div className="panel-body">
            <div className="row">
              <div className={this.props.filterClass}>
                <FormElement {...this.props}>
                  {formElements}
                </FormElement>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  Module: React.PropTypes.string.isRequired
};
