/* global LorisPage */
/* global QueryString  */

const propTypes = {};
const defaultProps = {};

/**
 * Base class for all Loris pages rendered in react.
 *
 * LorisPage provides basic page functionality, such as loading data from server.
 *
 * @author Alex Ilea <ailea.mcin@gmail.com>
 * @version 1.0.0
 * @since 2016/11/01
 *
 */
class LorisPage extends React.Component {

  /**
   * Default React lifecycle method.
   *
   * Initializes default properties and state, and bound class function to the
   * component scope.
   *
   * @param {object} props - component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      Filter: {}
    };

    // Bind component instance to custom methods
    this.clearFilter = this.clearFilter.bind(this);
    this.loadData = this.loadData.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.showSpinner = this.showSpinner.bind(this);
  }

  /**
   * Default React lifecycle method.
   *
   * Populates input fields from query string and loads data from the server.
   */
  componentDidMount() {
    var formRefs = this.refs;

    // Populate input fields from query string
    var queryString = new QueryString();
    var queryStringObj = queryString.get();
    Object.keys(queryStringObj).map(function(key) {
      if (queryStringObj[key] && formRefs[key] && formRefs[key].state) {
        formRefs[key].state.value = queryStringObj[key];
      }
    });

    this.QueryString = queryString;

    this.setState({
      Filter: queryStringObj,
      QueryString: queryString
    });
  }

  /**
   * Clear filter object with values from querystring
   */
  clearFilter() {
    var queryString = this.state.QueryString;
    var formRefs = this.refs;

    // Clear query string
    queryString.clear(this.props.Module);

    // Reset state of child components of FilterTable
    Object.keys(formRefs).map(function(ref) {
      if (formRefs[ref].state && formRefs[ref].state.value) {
        formRefs[ref].state.value = "";
      }
    });

    // Clear filter
    this.setState({Filter: {}});
  }

  /**
   * Loads the data from specified URL.
   *
   * By default, sets Data, FilterFrom and isLoaded state.
   * Success and error functions can be overriden to customize behaviour.
   *
   * @param {string} url - request URL
   * @param {function} success - callback function executed if request was succesful
   * @param {function} error - callback function executed if request failed
   */
  loadData(url, success, error) {
    var successFn = success ? success : function(data) {
      this.setState({
        Data: data,
        FilterForm: data.FilterForm,
        isLoaded: true
      });
    };
    var errorFn = error ? error : function(error) {
      console.error(error);
      // Output custom error message
      var responseText = error.responseText ?
        error.responseText :
        "An error occurred when loading the form!";
      this.setState({error: responseText});
    };

    $.ajax(url, {
      method: "GET",
      dataType: 'json',
      success: successFn.bind(this),
      error: errorFn.bind(this)
    });
  }

  /**
   * Set filter object with values from querystring
   *
   * @param {string} fieldName - querystring key
   * @param {(number|string)} fieldValue - querystring value
   */
  setFilter(fieldName, fieldValue) {
    // Create deep copy of a current filter
    var Filter = JSON.parse(JSON.stringify(this.state.Filter));
    var queryString = this.state.QueryString;
    var formRefs = this.refs;

    // If fieldName is part of the form, add to querystring
    if (formRefs.hasOwnProperty(fieldName)) {
      queryString.set(Filter, fieldName, fieldValue);
    } else {
      queryString.clear(this.props.Module);
    }

    // Set/clear query string value
    if (fieldValue === "") {
      delete Filter[fieldName];
    } else {
      Filter[fieldName] = fieldValue;
    }

    this.setState({Filter: Filter});
  }

  /**
   * Loading spinner.
   * Displayed while waiting for response on JSON request.
   *
   * @return {HTMLElement} - html of the spinner
   */
  showSpinner() {
    return (
      <button className="btn-info has-spinner">
        Loading
        <span
          className="glyphicon glyphicon-refresh glyphicon-refresh-animate">
          </span>
      </button>
    );
  }

}

LorisPage.propTypes = propTypes;
LorisPage.defaultProps = defaultProps;
