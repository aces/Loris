/**
 * This file contains React component for FilterForm
 *
 * @author Loris Team
 * @version 1.0.0
 *
 */

/**
 * FilterForm component
 * A wrapper for form elements of a selection filter
 * Passes its children to FormElement class
 */
class FilterForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
      Filter: QueryString.get()
    };

    // Bind component instance to custom methods
    this.clearFilter = this.clearFilter.bind(this);
    this.getFormElements = this.getFormElements.bind(this);
    this.getTableFilter = this.getTableFilter.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  componentDidMount() {
    let tableFilter = this.getTableFilter(null, null, this.state.Filter);
    this.props.onUpdate(tableFilter);
  }

  /**
   * Clear the Filter object, querystring and input fields
   */
  clearFilter() {
    let Filter = QueryString.clear(this.props.Module);
    this.props.onUpdate(Filter);
    this.setState({Filter});
  }

  /**
   * Itterates through FilterForm children setting necessary callback functions
   *
   * @return {Array} formElements - array of children with necessary props
   */
  getFormElements() {
    let formElements = [];

    React.Children.forEach(this.props.children, function(child, key) {
      // If child is a React component (i.e not a simple DOM element)
      if (React.isValidElement(child) && typeof child.type === "function") {
        let callbackFunc = child.props.onUserInput;
        let callbackName = callbackFunc.name;
        let elementName = child.type.displayName;
        let filterValue = this.state.Filter[child.ref];
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
      } else {
        formElements.push(React.cloneElement(child));
      }
    }.bind(this));

    return formElements;
  }

  /**
   * Itterates through Filter object and creates a new object containing filter data
   * in format required by StaticDataTable.
   * Needed to determine which filter elements need an exact match.
   *
   * @param {string} type - form element type (i.e component name)
   * @param {string} fieldName - the name of the form element
   * @param {{}} Filter - filter object
   *
   * @return {{}} tableFilter - filterData
   */
  getTableFilter(type, fieldName, Filter) {
    let tableFilter = {};
    for (let key in Filter) {
      if (Filter.hasOwnProperty(key)) {
        tableFilter[key] = {
          value: Filter[key],
          exactMatch: (type === "SelectElement" && key === fieldName)
        };
      }
    }
    return tableFilter;
  }

  /**
   * Sets Filter object and querystring to reflect values of input fields
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

    // Update query string and get new Filter object
    let Filter = QueryString.set(this.state.Filter, fieldName, fieldValue);
    let tableFilter = this.getTableFilter(type, fieldName, Filter);

    this.props.onUpdate(tableFilter);
    this.setState({Filter});
  }

  toggleCollapsed() {
    this.setState({collapsed: !this.state.collapsed});
  }

  render() {
    // Selection filter open by default
    var glyphClass = "glyphicon pull-right glyphicon-chevron-up";
    var panelClass = "panel-collapse collapse in";

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
                <FormElement
                  name={this.props.name}
                  columns={this.props.columns}
                >
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
  filterClass: "col-md-9",
  onUpdate: function() {
    console.warn('onUpdate() callback is not set!');
  }
};
FilterForm.propTypes = {
  Module: React.PropTypes.string.isRequired
};
