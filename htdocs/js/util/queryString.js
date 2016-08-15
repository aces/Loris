/* exported QueryString */

/**
 * The following class provides a simple API to manipulate browsers querystring
 *
 * For example usage, see dicom_archive
 *
 * @author Alex Ilea
 * @version 0.0.1
 * @since 08/15/2016
 *
 * @constructor
 * @return {{}} - QueryString helper object
 *
 */
var QueryString = function() {
  /**
   * Build and return an object containig querystring key/value pairs
   * based on current values inside the browser's querystring.
   *
   * @return {{}} - object with querystring key/value pairs
   */
  this.get = function() {
    var queryString = window.location.search.substring(1).split("&");
    var queryStringObj = {};

    queryString.forEach(function(param) {
      var key = param.split("=")[0];
      var value = param.split("=")[1];
      if (key !== "" && value !== "") {
        queryStringObj[key] = value;
      }
    });

    return queryStringObj;
  };

  /**
   * Appends passed key/value pair to browser's current querystring
   *
   * @param {{}} currentQuery - current query object
   * @param {string} fieldName - key
   * @param {string} fieldValue - value
   */
  this.set = function(currentQuery, fieldName, fieldValue) {
    var queryString = "?"; // always start with '?'
    var queryStringObj = currentQuery; // object representation of query

    // Add/Delete to/from query string object
    if (fieldValue === "") {
      delete queryStringObj[fieldName];
    } else {
      queryStringObj[fieldName] = fieldValue;
    }

    // Build query string
    Object.keys(queryStringObj).map(function(key, count) {
      queryString += key + "=" + queryStringObj[key];
      if (count !== Object.keys(queryStringObj).length - 1) {
        queryString += "&";
      }
    });

    window.history.replaceState({}, "", queryString);
  };

  /**
   * Clears browser querystring
   *
   * @param {string} moduleName - module used in URL
   */
  this.clear = function(moduleName) {
    if (moduleName !== undefined && moduleName !== "") {
      window.history.replaceState({}, "", "/" + moduleName + "/");
    } else {
      console.error('QueryString.clear() expects parameter `moduleName`!');
    }
  };

  return this;
};
