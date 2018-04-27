/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/* exported formatColumn */

	/**
	 * Modify behaviour of specified column cells in the Data Table component
	 * @param {string} column - column name
	 * @param {string} cell - cell content
	 * @param {arrray} rowData - array of cell contents for a specific row
	 * @return {*} a formated table cell for a given column
	 */
	function formatColumn(column, cell, rowData) {
	  if (column === 'PSCID') {
	    var url = loris.BaseURL + "/" + rowData[1] + "/";
	    return React.createElement(
	      "td",
	      null,
	      React.createElement(
	        "a",
	        { href: url },
	        cell
	      )
	    );
	  }
	  if (column === 'Feedback') {
	    switch (cell) {
	      case "1":
	        return React.createElement(
	          "td",
	          { style: { background: "#E4A09E" } },
	          "opened"
	        );
	      case "2":
	        return React.createElement(
	          "td",
	          { style: { background: "#EEEEAA" } },
	          "answered"
	        );
	      case "3":
	        return React.createElement(
	          "td",
	          { style: { background: "#99CC99" } },
	          "closed"
	        );
	      case "4":
	        return React.createElement(
	          "td",
	          { style: { background: "#99CCFF" } },
	          "comment"
	        );
	      default:
	        return React.createElement(
	          "td",
	          null,
	          "None"
	        );
	    }
	  }
	  if (column === 'Scan Done' && cell === 'Y') {
	    return React.createElement(
	      "td",
	      { className: "scanDoneLink" },
	      React.createElement(
	        "a",
	        { href: "#",
	          onClick: loris.loadFilteredMenuClickHandler('imaging_browser/', { pscid: rowData[2] })
	        },
	        cell
	      )
	    );
	  }
	  return React.createElement(
	    "td",
	    null,
	    cell
	  );
	}

	window.formatColumn = formatColumn;

	exports.default = formatColumn;

/***/ }
/******/ ]);