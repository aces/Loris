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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _Panel = __webpack_require__(15);

	var _Panel2 = _interopRequireDefault(_Panel);

	var _Form = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var AccessProfilePanel = function (_Component) {
	  _inherits(AccessProfilePanel, _Component);

	  function AccessProfilePanel(props) {
	    _classCallCheck(this, AccessProfilePanel);

	    var _this = _possibleConstructorReturn(this, (AccessProfilePanel.__proto__ || Object.getPrototypeOf(AccessProfilePanel)).call(this, props));

	    _this.state = {
	      error: {
	        message: '',
	        className: 'alert alert-danger text-center'
	      },
	      PSCID: '',
	      CandID: ''
	    };

	    _this.updateFormElement = _this.updateFormElement.bind(_this);
	    _this.validateAndSubmit = _this.validateAndSubmit.bind(_this);
	    return _this;
	  }

	  _createClass(AccessProfilePanel, [{
	    key: 'updateFormElement',
	    value: function updateFormElement(formElement, value) {
	      var state = this.state;
	      state[formElement] = value;
	      this.setState(state);
	    }
	  }, {
	    key: 'validateAndSubmit',
	    value: function validateAndSubmit() {
	      var state = this.state;
	      if (this.state.CandID === "") {
	        state.error = {
	          message: 'You must enter a DCCID!',
	          className: 'alert alert-danger text-center'
	        };
	        this.setState(state);
	        return;
	      }

	      if (this.state.PSCID === "") {
	        state.error = {
	          message: 'You must enter a PSCID!',
	          className: 'alert alert-danger text-center'
	        };
	        this.setState(state);
	        return;
	      }

	      // Always include a validating message.. the callback for the ajax request will
	      // update it after the ajax call returns.
	      state.error = {
	        message: "Validating...",
	        className: 'alert alert-info text-center'
	      };
	      this.setState(state);

	      $.get(loris.BaseURL + "/candidate_list/ajax/validateProfileIDs.php", {
	        CandID: state.CandID,
	        PSCID: state.PSCID
	      }, function (data) {
	        // ids are valid, submit accessProfileForm form
	        if (data === '1') {
	          state.error = {
	            message: "Opening profile...",
	            className: 'alert alert-info text-center'
	          };
	          window.location.href = loris.BaseURL + "/" + state.CandID;
	        } else {
	          // display error message
	          state.error = {
	            message: "DCCID or PSCID is not valid",
	            className: 'alert alert-danger text-center'
	          };
	        }
	        this.setState(state);
	      }.bind(this));
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var warning;
	      if (loris.userHasPermission('access_all_profiles')) {
	        return React.createElement('div', null);
	      }

	      if (this.state.error.message !== '') {
	        warning = React.createElement(
	          'div',
	          { className: this.state.error.className },
	          this.state.error.message
	        );
	      }
	      return React.createElement(
	        'div',
	        { className: 'col-sm-3' },
	        React.createElement(
	          _Panel2.default,
	          { title: 'Open Profile' },
	          React.createElement(
	            _Form.FormElement,
	            {
	              name: 'openprofile',
	              onSubmit: this.validateAndSubmit,
	              onUserInput: this.validateAndSubmit },
	            React.createElement(_Form.TextboxElement, {
	              name: 'CandID',
	              label: 'CandID',
	              value: this.state.CandID,
	              onUserInput: this.updateFormElement
	            }),
	            React.createElement(_Form.TextboxElement, {
	              name: 'PSCID',
	              label: 'PSCID',
	              value: this.state.PSCID,
	              onUserInput: this.updateFormElement
	            }),
	            warning,
	            React.createElement(ButtonElement, {
	              name: 'Open Profile',
	              label: 'Open Profile',
	              onUserInput: this.validateAndSubmit
	            })
	          )
	        )
	      );
	    }
	  }]);

	  return AccessProfilePanel;
	}(_react.Component);

	exports.default = AccessProfilePanel;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	if (process.env.NODE_ENV === 'production') {
	  module.exports = __webpack_require__(3);
	} else {
	  module.exports = __webpack_require__(8);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/** @license React v16.3.2
	 * react.production.min.js
	 *
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';var m=__webpack_require__(4),n=__webpack_require__(5),p=__webpack_require__(6),q=__webpack_require__(7),r="function"===typeof Symbol&&Symbol["for"],t=r?Symbol["for"]("react.element"):60103,u=r?Symbol["for"]("react.portal"):60106,v=r?Symbol["for"]("react.fragment"):60107,w=r?Symbol["for"]("react.strict_mode"):60108,x=r?Symbol["for"]("react.provider"):60109,y=r?Symbol["for"]("react.context"):60110,z=r?Symbol["for"]("react.async_mode"):60111,A=r?Symbol["for"]("react.forward_ref"):
	60112,B="function"===typeof Symbol&&Symbol.iterator;function C(a){for(var b=arguments.length-1,e="http://reactjs.org/docs/error-decoder.html?invariant\x3d"+a,c=0;c<b;c++)e+="\x26args[]\x3d"+encodeURIComponent(arguments[c+1]);n(!1,"Minified React error #"+a+"; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",e)}var D={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}};
	function E(a,b,e){this.props=a;this.context=b;this.refs=p;this.updater=e||D}E.prototype.isReactComponent={};E.prototype.setState=function(a,b){"object"!==typeof a&&"function"!==typeof a&&null!=a?C("85"):void 0;this.updater.enqueueSetState(this,a,b,"setState")};E.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate")};function F(){}F.prototype=E.prototype;function G(a,b,e){this.props=a;this.context=b;this.refs=p;this.updater=e||D}var H=G.prototype=new F;
	H.constructor=G;m(H,E.prototype);H.isPureReactComponent=!0;var I={current:null},J=Object.prototype.hasOwnProperty,K={key:!0,ref:!0,__self:!0,__source:!0};
	function L(a,b,e){var c=void 0,d={},g=null,h=null;if(null!=b)for(c in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(g=""+b.key),b)J.call(b,c)&&!K.hasOwnProperty(c)&&(d[c]=b[c]);var f=arguments.length-2;if(1===f)d.children=e;else if(1<f){for(var k=Array(f),l=0;l<f;l++)k[l]=arguments[l+2];d.children=k}if(a&&a.defaultProps)for(c in f=a.defaultProps,f)void 0===d[c]&&(d[c]=f[c]);return{$$typeof:t,type:a,key:g,ref:h,props:d,_owner:I.current}}
	function M(a){return"object"===typeof a&&null!==a&&a.$$typeof===t}function escape(a){var b={"\x3d":"\x3d0",":":"\x3d2"};return"$"+(""+a).replace(/[=:]/g,function(a){return b[a]})}var N=/\/+/g,O=[];function P(a,b,e,c){if(O.length){var d=O.pop();d.result=a;d.keyPrefix=b;d.func=e;d.context=c;d.count=0;return d}return{result:a,keyPrefix:b,func:e,context:c,count:0}}function Q(a){a.result=null;a.keyPrefix=null;a.func=null;a.context=null;a.count=0;10>O.length&&O.push(a)}
	function R(a,b,e,c){var d=typeof a;if("undefined"===d||"boolean"===d)a=null;var g=!1;if(null===a)g=!0;else switch(d){case "string":case "number":g=!0;break;case "object":switch(a.$$typeof){case t:case u:g=!0}}if(g)return e(c,a,""===b?"."+S(a,0):b),1;g=0;b=""===b?".":b+":";if(Array.isArray(a))for(var h=0;h<a.length;h++){d=a[h];var f=b+S(d,h);g+=R(d,f,e,c)}else if(null===a||"undefined"===typeof a?f=null:(f=B&&a[B]||a["@@iterator"],f="function"===typeof f?f:null),"function"===typeof f)for(a=f.call(a),
	h=0;!(d=a.next()).done;)d=d.value,f=b+S(d,h++),g+=R(d,f,e,c);else"object"===d&&(e=""+a,C("31","[object Object]"===e?"object with keys {"+Object.keys(a).join(", ")+"}":e,""));return g}function S(a,b){return"object"===typeof a&&null!==a&&null!=a.key?escape(a.key):b.toString(36)}function T(a,b){a.func.call(a.context,b,a.count++)}
	function U(a,b,e){var c=a.result,d=a.keyPrefix;a=a.func.call(a.context,b,a.count++);Array.isArray(a)?V(a,c,e,q.thatReturnsArgument):null!=a&&(M(a)&&(b=d+(!a.key||b&&b.key===a.key?"":(""+a.key).replace(N,"$\x26/")+"/")+e,a={$$typeof:t,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}),c.push(a))}function V(a,b,e,c,d){var g="";null!=e&&(g=(""+e).replace(N,"$\x26/")+"/");b=P(b,g,c,d);null==a||R(a,"",U,b);Q(b)}
	var W={Children:{map:function(a,b,e){if(null==a)return a;var c=[];V(a,c,null,b,e);return c},forEach:function(a,b,e){if(null==a)return a;b=P(null,null,b,e);null==a||R(a,"",T,b);Q(b)},count:function(a){return null==a?0:R(a,"",q.thatReturnsNull,null)},toArray:function(a){var b=[];V(a,b,null,q.thatReturnsArgument);return b},only:function(a){M(a)?void 0:C("143");return a}},createRef:function(){return{current:null}},Component:E,PureComponent:G,createContext:function(a,b){void 0===b&&(b=null);a={$$typeof:y,
	_calculateChangedBits:b,_defaultValue:a,_currentValue:a,_changedBits:0,Provider:null,Consumer:null};a.Provider={$$typeof:x,_context:a};return a.Consumer=a},forwardRef:function(a){return{$$typeof:A,render:a}},Fragment:v,StrictMode:w,unstable_AsyncMode:z,createElement:L,cloneElement:function(a,b,e){null===a||void 0===a?C("267",a):void 0;var c=void 0,d=m({},a.props),g=a.key,h=a.ref,f=a._owner;if(null!=b){void 0!==b.ref&&(h=b.ref,f=I.current);void 0!==b.key&&(g=""+b.key);var k=void 0;a.type&&a.type.defaultProps&&
	(k=a.type.defaultProps);for(c in b)J.call(b,c)&&!K.hasOwnProperty(c)&&(d[c]=void 0===b[c]&&void 0!==k?k[c]:b[c])}c=arguments.length-2;if(1===c)d.children=e;else if(1<c){k=Array(c);for(var l=0;l<c;l++)k[l]=arguments[l+2];d.children=k}return{$$typeof:t,type:a.type,key:g,ref:h,props:d,_owner:f}},createFactory:function(a){var b=L.bind(null,a);b.type=a;return b},isValidElement:M,version:"16.3.2",__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{ReactCurrentOwner:I,assign:m}},X=Object.freeze({default:W}),
	Y=X&&W||X;module.exports=Y["default"]?Y["default"]:Y;


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/

	'use strict';
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var validateFormat = function validateFormat(format) {};

	if (process.env.NODE_ENV !== 'production') {
	  validateFormat = function validateFormat(format) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  };
	}

	function invariant(condition, format, a, b, c, d, e, f) {
	  validateFormat(format);

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}

	module.exports = invariant;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	'use strict';

	var emptyObject = {};

	if (process.env.NODE_ENV !== 'production') {
	  Object.freeze(emptyObject);
	}

	module.exports = emptyObject;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * 
	 */

	function makeEmptyFunction(arg) {
	  return function () {
	    return arg;
	  };
	}

	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	var emptyFunction = function emptyFunction() {};

	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function () {
	  return this;
	};
	emptyFunction.thatReturnsArgument = function (arg) {
	  return arg;
	};

	module.exports = emptyFunction;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/** @license React v16.3.2
	 * react.development.js
	 *
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';



	if (process.env.NODE_ENV !== "production") {
	  (function() {
	'use strict';

	var _assign = __webpack_require__(4);
	var invariant = __webpack_require__(5);
	var emptyObject = __webpack_require__(6);
	var warning = __webpack_require__(9);
	var emptyFunction = __webpack_require__(7);
	var checkPropTypes = __webpack_require__(10);

	// TODO: this is special because it gets imported during build.

	var ReactVersion = '16.3.2';

	// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
	// nor polyfill, then a plain number is used for performance.
	var hasSymbol = typeof Symbol === 'function' && Symbol['for'];

	var REACT_ELEMENT_TYPE = hasSymbol ? Symbol['for']('react.element') : 0xeac7;
	var REACT_CALL_TYPE = hasSymbol ? Symbol['for']('react.call') : 0xeac8;
	var REACT_RETURN_TYPE = hasSymbol ? Symbol['for']('react.return') : 0xeac9;
	var REACT_PORTAL_TYPE = hasSymbol ? Symbol['for']('react.portal') : 0xeaca;
	var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol['for']('react.fragment') : 0xeacb;
	var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol['for']('react.strict_mode') : 0xeacc;
	var REACT_PROVIDER_TYPE = hasSymbol ? Symbol['for']('react.provider') : 0xeacd;
	var REACT_CONTEXT_TYPE = hasSymbol ? Symbol['for']('react.context') : 0xeace;
	var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol['for']('react.async_mode') : 0xeacf;
	var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol['for']('react.forward_ref') : 0xead0;

	var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	var FAUX_ITERATOR_SYMBOL = '@@iterator';

	function getIteratorFn(maybeIterable) {
	  if (maybeIterable === null || typeof maybeIterable === 'undefined') {
	    return null;
	  }
	  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
	  if (typeof maybeIterator === 'function') {
	    return maybeIterator;
	  }
	  return null;
	}

	// Relying on the `invariant()` implementation lets us
	// have preserve the format and params in the www builds.

	/**
	 * Forked from fbjs/warning:
	 * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
	 *
	 * Only change is we use console.warn instead of console.error,
	 * and do nothing when 'console' is not supported.
	 * This really simplifies the code.
	 * ---
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var lowPriorityWarning = function () {};

	{
	  var printWarning = function (format) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    var argIndex = 0;
	    var message = 'Warning: ' + format.replace(/%s/g, function () {
	      return args[argIndex++];
	    });
	    if (typeof console !== 'undefined') {
	      console.warn(message);
	    }
	    try {
	      // --- Welcome to debugging React ---
	      // This error was thrown as a convenience so that you can use this stack
	      // to find the callsite that caused this warning to fire.
	      throw new Error(message);
	    } catch (x) {}
	  };

	  lowPriorityWarning = function (condition, format) {
	    if (format === undefined) {
	      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
	    }
	    if (!condition) {
	      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	        args[_key2 - 2] = arguments[_key2];
	      }

	      printWarning.apply(undefined, [format].concat(args));
	    }
	  };
	}

	var lowPriorityWarning$1 = lowPriorityWarning;

	var didWarnStateUpdateForUnmountedComponent = {};

	function warnNoop(publicInstance, callerName) {
	  {
	    var _constructor = publicInstance.constructor;
	    var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
	    var warningKey = componentName + '.' + callerName;
	    if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
	      return;
	    }
	    warning(false, "Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);
	    didWarnStateUpdateForUnmountedComponent[warningKey] = true;
	  }
	}

	/**
	 * This is the abstract API for an update queue.
	 */
	var ReactNoopUpdateQueue = {
	  /**
	   * Checks whether or not this composite component is mounted.
	   * @param {ReactClass} publicInstance The instance we want to test.
	   * @return {boolean} True if mounted, false otherwise.
	   * @protected
	   * @final
	   */
	  isMounted: function (publicInstance) {
	    return false;
	  },

	  /**
	   * Forces an update. This should only be invoked when it is known with
	   * certainty that we are **not** in a DOM transaction.
	   *
	   * You may want to call this when you know that some deeper aspect of the
	   * component's state has changed but `setState` was not called.
	   *
	   * This will not invoke `shouldComponentUpdate`, but it will invoke
	   * `componentWillUpdate` and `componentDidUpdate`.
	   *
	   * @param {ReactClass} publicInstance The instance that should rerender.
	   * @param {?function} callback Called after component is updated.
	   * @param {?string} callerName name of the calling function in the public API.
	   * @internal
	   */
	  enqueueForceUpdate: function (publicInstance, callback, callerName) {
	    warnNoop(publicInstance, 'forceUpdate');
	  },

	  /**
	   * Replaces all of the state. Always use this or `setState` to mutate state.
	   * You should treat `this.state` as immutable.
	   *
	   * There is no guarantee that `this.state` will be immediately updated, so
	   * accessing `this.state` after calling this method may return the old value.
	   *
	   * @param {ReactClass} publicInstance The instance that should rerender.
	   * @param {object} completeState Next state.
	   * @param {?function} callback Called after component is updated.
	   * @param {?string} callerName name of the calling function in the public API.
	   * @internal
	   */
	  enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
	    warnNoop(publicInstance, 'replaceState');
	  },

	  /**
	   * Sets a subset of the state. This only exists because _pendingState is
	   * internal. This provides a merging strategy that is not available to deep
	   * properties which is confusing. TODO: Expose pendingState or don't use it
	   * during the merge.
	   *
	   * @param {ReactClass} publicInstance The instance that should rerender.
	   * @param {object} partialState Next partial state to be merged with state.
	   * @param {?function} callback Called after component is updated.
	   * @param {?string} Name of the calling function in the public API.
	   * @internal
	   */
	  enqueueSetState: function (publicInstance, partialState, callback, callerName) {
	    warnNoop(publicInstance, 'setState');
	  }
	};

	/**
	 * Base class helpers for the updating state of a component.
	 */
	function Component(props, context, updater) {
	  this.props = props;
	  this.context = context;
	  this.refs = emptyObject;
	  // We initialize the default updater but the real one gets injected by the
	  // renderer.
	  this.updater = updater || ReactNoopUpdateQueue;
	}

	Component.prototype.isReactComponent = {};

	/**
	 * Sets a subset of the state. Always use this to mutate
	 * state. You should treat `this.state` as immutable.
	 *
	 * There is no guarantee that `this.state` will be immediately updated, so
	 * accessing `this.state` after calling this method may return the old value.
	 *
	 * There is no guarantee that calls to `setState` will run synchronously,
	 * as they may eventually be batched together.  You can provide an optional
	 * callback that will be executed when the call to setState is actually
	 * completed.
	 *
	 * When a function is provided to setState, it will be called at some point in
	 * the future (not synchronously). It will be called with the up to date
	 * component arguments (state, props, context). These values can be different
	 * from this.* because your function may be called after receiveProps but before
	 * shouldComponentUpdate, and this new state, props, and context will not yet be
	 * assigned to this.
	 *
	 * @param {object|function} partialState Next partial state or function to
	 *        produce next partial state to be merged with current state.
	 * @param {?function} callback Called after state is updated.
	 * @final
	 * @protected
	 */
	Component.prototype.setState = function (partialState, callback) {
	  !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : void 0;
	  this.updater.enqueueSetState(this, partialState, callback, 'setState');
	};

	/**
	 * Forces an update. This should only be invoked when it is known with
	 * certainty that we are **not** in a DOM transaction.
	 *
	 * You may want to call this when you know that some deeper aspect of the
	 * component's state has changed but `setState` was not called.
	 *
	 * This will not invoke `shouldComponentUpdate`, but it will invoke
	 * `componentWillUpdate` and `componentDidUpdate`.
	 *
	 * @param {?function} callback Called after update is complete.
	 * @final
	 * @protected
	 */
	Component.prototype.forceUpdate = function (callback) {
	  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
	};

	/**
	 * Deprecated APIs. These APIs used to exist on classic React classes but since
	 * we would like to deprecate them, we're not going to move them over to this
	 * modern base class. Instead, we define a getter that warns if it's accessed.
	 */
	{
	  var deprecatedAPIs = {
	    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
	    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
	  };
	  var defineDeprecationWarning = function (methodName, info) {
	    Object.defineProperty(Component.prototype, methodName, {
	      get: function () {
	        lowPriorityWarning$1(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
	        return undefined;
	      }
	    });
	  };
	  for (var fnName in deprecatedAPIs) {
	    if (deprecatedAPIs.hasOwnProperty(fnName)) {
	      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
	    }
	  }
	}

	function ComponentDummy() {}
	ComponentDummy.prototype = Component.prototype;

	/**
	 * Convenience component with default shallow equality check for sCU.
	 */
	function PureComponent(props, context, updater) {
	  this.props = props;
	  this.context = context;
	  this.refs = emptyObject;
	  this.updater = updater || ReactNoopUpdateQueue;
	}

	var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
	pureComponentPrototype.constructor = PureComponent;
	// Avoid an extra prototype jump for these methods.
	_assign(pureComponentPrototype, Component.prototype);
	pureComponentPrototype.isPureReactComponent = true;

	// an immutable object with a single mutable value
	function createRef() {
	  var refObject = {
	    current: null
	  };
	  {
	    Object.seal(refObject);
	  }
	  return refObject;
	}

	/**
	 * Keeps track of the current owner.
	 *
	 * The current owner is the component who should own any components that are
	 * currently being constructed.
	 */
	var ReactCurrentOwner = {
	  /**
	   * @internal
	   * @type {ReactComponent}
	   */
	  current: null
	};

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	var RESERVED_PROPS = {
	  key: true,
	  ref: true,
	  __self: true,
	  __source: true
	};

	var specialPropKeyWarningShown = void 0;
	var specialPropRefWarningShown = void 0;

	function hasValidRef(config) {
	  {
	    if (hasOwnProperty.call(config, 'ref')) {
	      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
	      if (getter && getter.isReactWarning) {
	        return false;
	      }
	    }
	  }
	  return config.ref !== undefined;
	}

	function hasValidKey(config) {
	  {
	    if (hasOwnProperty.call(config, 'key')) {
	      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
	      if (getter && getter.isReactWarning) {
	        return false;
	      }
	    }
	  }
	  return config.key !== undefined;
	}

	function defineKeyPropWarningGetter(props, displayName) {
	  var warnAboutAccessingKey = function () {
	    if (!specialPropKeyWarningShown) {
	      specialPropKeyWarningShown = true;
	      warning(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
	    }
	  };
	  warnAboutAccessingKey.isReactWarning = true;
	  Object.defineProperty(props, 'key', {
	    get: warnAboutAccessingKey,
	    configurable: true
	  });
	}

	function defineRefPropWarningGetter(props, displayName) {
	  var warnAboutAccessingRef = function () {
	    if (!specialPropRefWarningShown) {
	      specialPropRefWarningShown = true;
	      warning(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
	    }
	  };
	  warnAboutAccessingRef.isReactWarning = true;
	  Object.defineProperty(props, 'ref', {
	    get: warnAboutAccessingRef,
	    configurable: true
	  });
	}

	/**
	 * Factory method to create a new React element. This no longer adheres to
	 * the class pattern, so do not use new to call it. Also, no instanceof check
	 * will work. Instead test $$typeof field against Symbol.for('react.element') to check
	 * if something is a React Element.
	 *
	 * @param {*} type
	 * @param {*} key
	 * @param {string|object} ref
	 * @param {*} self A *temporary* helper to detect places where `this` is
	 * different from the `owner` when React.createElement is called, so that we
	 * can warn. We want to get rid of owner and replace string `ref`s with arrow
	 * functions, and as long as `this` and owner are the same, there will be no
	 * change in behavior.
	 * @param {*} source An annotation object (added by a transpiler or otherwise)
	 * indicating filename, line number, and/or other information.
	 * @param {*} owner
	 * @param {*} props
	 * @internal
	 */
	var ReactElement = function (type, key, ref, self, source, owner, props) {
	  var element = {
	    // This tag allows us to uniquely identify this as a React Element
	    $$typeof: REACT_ELEMENT_TYPE,

	    // Built-in properties that belong on the element
	    type: type,
	    key: key,
	    ref: ref,
	    props: props,

	    // Record the component responsible for creating this element.
	    _owner: owner
	  };

	  {
	    // The validation flag is currently mutative. We put it on
	    // an external backing store so that we can freeze the whole object.
	    // This can be replaced with a WeakMap once they are implemented in
	    // commonly used development environments.
	    element._store = {};

	    // To make comparing ReactElements easier for testing purposes, we make
	    // the validation flag non-enumerable (where possible, which should
	    // include every environment we run tests in), so the test framework
	    // ignores it.
	    Object.defineProperty(element._store, 'validated', {
	      configurable: false,
	      enumerable: false,
	      writable: true,
	      value: false
	    });
	    // self and source are DEV only properties.
	    Object.defineProperty(element, '_self', {
	      configurable: false,
	      enumerable: false,
	      writable: false,
	      value: self
	    });
	    // Two elements created in two different places should be considered
	    // equal for testing purposes and therefore we hide it from enumeration.
	    Object.defineProperty(element, '_source', {
	      configurable: false,
	      enumerable: false,
	      writable: false,
	      value: source
	    });
	    if (Object.freeze) {
	      Object.freeze(element.props);
	      Object.freeze(element);
	    }
	  }

	  return element;
	};

	/**
	 * Create and return a new ReactElement of the given type.
	 * See https://reactjs.org/docs/react-api.html#createelement
	 */
	function createElement(type, config, children) {
	  var propName = void 0;

	  // Reserved names are extracted
	  var props = {};

	  var key = null;
	  var ref = null;
	  var self = null;
	  var source = null;

	  if (config != null) {
	    if (hasValidRef(config)) {
	      ref = config.ref;
	    }
	    if (hasValidKey(config)) {
	      key = '' + config.key;
	    }

	    self = config.__self === undefined ? null : config.__self;
	    source = config.__source === undefined ? null : config.__source;
	    // Remaining properties are added to a new props object
	    for (propName in config) {
	      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
	        props[propName] = config[propName];
	      }
	    }
	  }

	  // Children can be more than one argument, and those are transferred onto
	  // the newly allocated props object.
	  var childrenLength = arguments.length - 2;
	  if (childrenLength === 1) {
	    props.children = children;
	  } else if (childrenLength > 1) {
	    var childArray = Array(childrenLength);
	    for (var i = 0; i < childrenLength; i++) {
	      childArray[i] = arguments[i + 2];
	    }
	    {
	      if (Object.freeze) {
	        Object.freeze(childArray);
	      }
	    }
	    props.children = childArray;
	  }

	  // Resolve default props
	  if (type && type.defaultProps) {
	    var defaultProps = type.defaultProps;
	    for (propName in defaultProps) {
	      if (props[propName] === undefined) {
	        props[propName] = defaultProps[propName];
	      }
	    }
	  }
	  {
	    if (key || ref) {
	      if (typeof props.$$typeof === 'undefined' || props.$$typeof !== REACT_ELEMENT_TYPE) {
	        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
	        if (key) {
	          defineKeyPropWarningGetter(props, displayName);
	        }
	        if (ref) {
	          defineRefPropWarningGetter(props, displayName);
	        }
	      }
	    }
	  }
	  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
	}

	/**
	 * Return a function that produces ReactElements of a given type.
	 * See https://reactjs.org/docs/react-api.html#createfactory
	 */


	function cloneAndReplaceKey(oldElement, newKey) {
	  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

	  return newElement;
	}

	/**
	 * Clone and return a new ReactElement using element as the starting point.
	 * See https://reactjs.org/docs/react-api.html#cloneelement
	 */
	function cloneElement(element, config, children) {
	  !!(element === null || element === undefined) ? invariant(false, 'React.cloneElement(...): The argument must be a React element, but you passed %s.', element) : void 0;

	  var propName = void 0;

	  // Original props are copied
	  var props = _assign({}, element.props);

	  // Reserved names are extracted
	  var key = element.key;
	  var ref = element.ref;
	  // Self is preserved since the owner is preserved.
	  var self = element._self;
	  // Source is preserved since cloneElement is unlikely to be targeted by a
	  // transpiler, and the original source is probably a better indicator of the
	  // true owner.
	  var source = element._source;

	  // Owner will be preserved, unless ref is overridden
	  var owner = element._owner;

	  if (config != null) {
	    if (hasValidRef(config)) {
	      // Silently steal the ref from the parent.
	      ref = config.ref;
	      owner = ReactCurrentOwner.current;
	    }
	    if (hasValidKey(config)) {
	      key = '' + config.key;
	    }

	    // Remaining properties override existing props
	    var defaultProps = void 0;
	    if (element.type && element.type.defaultProps) {
	      defaultProps = element.type.defaultProps;
	    }
	    for (propName in config) {
	      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
	        if (config[propName] === undefined && defaultProps !== undefined) {
	          // Resolve default props
	          props[propName] = defaultProps[propName];
	        } else {
	          props[propName] = config[propName];
	        }
	      }
	    }
	  }

	  // Children can be more than one argument, and those are transferred onto
	  // the newly allocated props object.
	  var childrenLength = arguments.length - 2;
	  if (childrenLength === 1) {
	    props.children = children;
	  } else if (childrenLength > 1) {
	    var childArray = Array(childrenLength);
	    for (var i = 0; i < childrenLength; i++) {
	      childArray[i] = arguments[i + 2];
	    }
	    props.children = childArray;
	  }

	  return ReactElement(element.type, key, ref, self, source, owner, props);
	}

	/**
	 * Verifies the object is a ReactElement.
	 * See https://reactjs.org/docs/react-api.html#isvalidelement
	 * @param {?object} object
	 * @return {boolean} True if `object` is a valid component.
	 * @final
	 */
	function isValidElement(object) {
	  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
	}

	var ReactDebugCurrentFrame = {};

	{
	  // Component that is being worked on
	  ReactDebugCurrentFrame.getCurrentStack = null;

	  ReactDebugCurrentFrame.getStackAddendum = function () {
	    var impl = ReactDebugCurrentFrame.getCurrentStack;
	    if (impl) {
	      return impl();
	    }
	    return null;
	  };
	}

	var SEPARATOR = '.';
	var SUBSEPARATOR = ':';

	/**
	 * Escape and wrap key so it is safe to use as a reactid
	 *
	 * @param {string} key to be escaped.
	 * @return {string} the escaped key.
	 */
	function escape(key) {
	  var escapeRegex = /[=:]/g;
	  var escaperLookup = {
	    '=': '=0',
	    ':': '=2'
	  };
	  var escapedString = ('' + key).replace(escapeRegex, function (match) {
	    return escaperLookup[match];
	  });

	  return '$' + escapedString;
	}

	/**
	 * TODO: Test that a single child and an array with one item have the same key
	 * pattern.
	 */

	var didWarnAboutMaps = false;

	var userProvidedKeyEscapeRegex = /\/+/g;
	function escapeUserProvidedKey(text) {
	  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
	}

	var POOL_SIZE = 10;
	var traverseContextPool = [];
	function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
	  if (traverseContextPool.length) {
	    var traverseContext = traverseContextPool.pop();
	    traverseContext.result = mapResult;
	    traverseContext.keyPrefix = keyPrefix;
	    traverseContext.func = mapFunction;
	    traverseContext.context = mapContext;
	    traverseContext.count = 0;
	    return traverseContext;
	  } else {
	    return {
	      result: mapResult,
	      keyPrefix: keyPrefix,
	      func: mapFunction,
	      context: mapContext,
	      count: 0
	    };
	  }
	}

	function releaseTraverseContext(traverseContext) {
	  traverseContext.result = null;
	  traverseContext.keyPrefix = null;
	  traverseContext.func = null;
	  traverseContext.context = null;
	  traverseContext.count = 0;
	  if (traverseContextPool.length < POOL_SIZE) {
	    traverseContextPool.push(traverseContext);
	  }
	}

	/**
	 * @param {?*} children Children tree container.
	 * @param {!string} nameSoFar Name of the key path so far.
	 * @param {!function} callback Callback to invoke with each child found.
	 * @param {?*} traverseContext Used to pass information throughout the traversal
	 * process.
	 * @return {!number} The number of children in this subtree.
	 */
	function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
	  var type = typeof children;

	  if (type === 'undefined' || type === 'boolean') {
	    // All of the above are perceived as null.
	    children = null;
	  }

	  var invokeCallback = false;

	  if (children === null) {
	    invokeCallback = true;
	  } else {
	    switch (type) {
	      case 'string':
	      case 'number':
	        invokeCallback = true;
	        break;
	      case 'object':
	        switch (children.$$typeof) {
	          case REACT_ELEMENT_TYPE:
	          case REACT_PORTAL_TYPE:
	            invokeCallback = true;
	        }
	    }
	  }

	  if (invokeCallback) {
	    callback(traverseContext, children,
	    // If it's the only child, treat the name as if it was wrapped in an array
	    // so that it's consistent if the number of children grows.
	    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
	    return 1;
	  }

	  var child = void 0;
	  var nextName = void 0;
	  var subtreeCount = 0; // Count of children found in the current subtree.
	  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

	  if (Array.isArray(children)) {
	    for (var i = 0; i < children.length; i++) {
	      child = children[i];
	      nextName = nextNamePrefix + getComponentKey(child, i);
	      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
	    }
	  } else {
	    var iteratorFn = getIteratorFn(children);
	    if (typeof iteratorFn === 'function') {
	      {
	        // Warn about using Maps as children
	        if (iteratorFn === children.entries) {
	          !didWarnAboutMaps ? warning(false, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.%s', ReactDebugCurrentFrame.getStackAddendum()) : void 0;
	          didWarnAboutMaps = true;
	        }
	      }

	      var iterator = iteratorFn.call(children);
	      var step = void 0;
	      var ii = 0;
	      while (!(step = iterator.next()).done) {
	        child = step.value;
	        nextName = nextNamePrefix + getComponentKey(child, ii++);
	        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
	      }
	    } else if (type === 'object') {
	      var addendum = '';
	      {
	        addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + ReactDebugCurrentFrame.getStackAddendum();
	      }
	      var childrenString = '' + children;
	      invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum);
	    }
	  }

	  return subtreeCount;
	}

	/**
	 * Traverses children that are typically specified as `props.children`, but
	 * might also be specified through attributes:
	 *
	 * - `traverseAllChildren(this.props.children, ...)`
	 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
	 *
	 * The `traverseContext` is an optional argument that is passed through the
	 * entire traversal. It can be used to store accumulations or anything else that
	 * the callback might find relevant.
	 *
	 * @param {?*} children Children tree object.
	 * @param {!function} callback To invoke upon traversing each child.
	 * @param {?*} traverseContext Context for traversal.
	 * @return {!number} The number of children in this subtree.
	 */
	function traverseAllChildren(children, callback, traverseContext) {
	  if (children == null) {
	    return 0;
	  }

	  return traverseAllChildrenImpl(children, '', callback, traverseContext);
	}

	/**
	 * Generate a key string that identifies a component within a set.
	 *
	 * @param {*} component A component that could contain a manual key.
	 * @param {number} index Index that is used if a manual key is not provided.
	 * @return {string}
	 */
	function getComponentKey(component, index) {
	  // Do some typechecking here since we call this blindly. We want to ensure
	  // that we don't block potential future ES APIs.
	  if (typeof component === 'object' && component !== null && component.key != null) {
	    // Explicit key
	    return escape(component.key);
	  }
	  // Implicit key determined by the index in the set
	  return index.toString(36);
	}

	function forEachSingleChild(bookKeeping, child, name) {
	  var func = bookKeeping.func,
	      context = bookKeeping.context;

	  func.call(context, child, bookKeeping.count++);
	}

	/**
	 * Iterates through children that are typically specified as `props.children`.
	 *
	 * See https://reactjs.org/docs/react-api.html#react.children.foreach
	 *
	 * The provided forEachFunc(child, index) will be called for each
	 * leaf child.
	 *
	 * @param {?*} children Children tree container.
	 * @param {function(*, int)} forEachFunc
	 * @param {*} forEachContext Context for forEachContext.
	 */
	function forEachChildren(children, forEachFunc, forEachContext) {
	  if (children == null) {
	    return children;
	  }
	  var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
	  traverseAllChildren(children, forEachSingleChild, traverseContext);
	  releaseTraverseContext(traverseContext);
	}

	function mapSingleChildIntoContext(bookKeeping, child, childKey) {
	  var result = bookKeeping.result,
	      keyPrefix = bookKeeping.keyPrefix,
	      func = bookKeeping.func,
	      context = bookKeeping.context;


	  var mappedChild = func.call(context, child, bookKeeping.count++);
	  if (Array.isArray(mappedChild)) {
	    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, emptyFunction.thatReturnsArgument);
	  } else if (mappedChild != null) {
	    if (isValidElement(mappedChild)) {
	      mappedChild = cloneAndReplaceKey(mappedChild,
	      // Keep both the (mapped) and old keys if they differ, just as
	      // traverseAllChildren used to do for objects as children
	      keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
	    }
	    result.push(mappedChild);
	  }
	}

	function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
	  var escapedPrefix = '';
	  if (prefix != null) {
	    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
	  }
	  var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
	  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
	  releaseTraverseContext(traverseContext);
	}

	/**
	 * Maps children that are typically specified as `props.children`.
	 *
	 * See https://reactjs.org/docs/react-api.html#react.children.map
	 *
	 * The provided mapFunction(child, key, index) will be called for each
	 * leaf child.
	 *
	 * @param {?*} children Children tree container.
	 * @param {function(*, int)} func The map function.
	 * @param {*} context Context for mapFunction.
	 * @return {object} Object containing the ordered map of results.
	 */
	function mapChildren(children, func, context) {
	  if (children == null) {
	    return children;
	  }
	  var result = [];
	  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
	  return result;
	}

	/**
	 * Count the number of children that are typically specified as
	 * `props.children`.
	 *
	 * See https://reactjs.org/docs/react-api.html#react.children.count
	 *
	 * @param {?*} children Children tree container.
	 * @return {number} The number of children.
	 */
	function countChildren(children, context) {
	  return traverseAllChildren(children, emptyFunction.thatReturnsNull, null);
	}

	/**
	 * Flatten a children object (typically specified as `props.children`) and
	 * return an array with appropriately re-keyed children.
	 *
	 * See https://reactjs.org/docs/react-api.html#react.children.toarray
	 */
	function toArray(children) {
	  var result = [];
	  mapIntoWithKeyPrefixInternal(children, result, null, emptyFunction.thatReturnsArgument);
	  return result;
	}

	/**
	 * Returns the first child in a collection of children and verifies that there
	 * is only one child in the collection.
	 *
	 * See https://reactjs.org/docs/react-api.html#react.children.only
	 *
	 * The current implementation of this function assumes that a single child gets
	 * passed without a wrapper, but the purpose of this helper function is to
	 * abstract away the particular structure of children.
	 *
	 * @param {?object} children Child collection structure.
	 * @return {ReactElement} The first and only `ReactElement` contained in the
	 * structure.
	 */
	function onlyChild(children) {
	  !isValidElement(children) ? invariant(false, 'React.Children.only expected to receive a single React element child.') : void 0;
	  return children;
	}

	function createContext(defaultValue, calculateChangedBits) {
	  if (calculateChangedBits === undefined) {
	    calculateChangedBits = null;
	  } else {
	    {
	      !(calculateChangedBits === null || typeof calculateChangedBits === 'function') ? warning(false, 'createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits) : void 0;
	    }
	  }

	  var context = {
	    $$typeof: REACT_CONTEXT_TYPE,
	    _calculateChangedBits: calculateChangedBits,
	    _defaultValue: defaultValue,
	    _currentValue: defaultValue,
	    _changedBits: 0,
	    // These are circular
	    Provider: null,
	    Consumer: null
	  };

	  context.Provider = {
	    $$typeof: REACT_PROVIDER_TYPE,
	    _context: context
	  };
	  context.Consumer = context;

	  {
	    context._currentRenderer = null;
	  }

	  return context;
	}

	function forwardRef(render) {
	  {
	    !(typeof render === 'function') ? warning(false, 'forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render) : void 0;
	  }

	  return {
	    $$typeof: REACT_FORWARD_REF_TYPE,
	    render: render
	  };
	}

	var describeComponentFrame = function (name, source, ownerName) {
	  return '\n    in ' + (name || 'Unknown') + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
	};

	function isValidElementType(type) {
	  return typeof type === 'string' || typeof type === 'function' ||
	  // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
	  type === REACT_FRAGMENT_TYPE || type === REACT_ASYNC_MODE_TYPE || type === REACT_STRICT_MODE_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE);
	}

	function getComponentName(fiber) {
	  var type = fiber.type;

	  if (typeof type === 'function') {
	    return type.displayName || type.name;
	  }
	  if (typeof type === 'string') {
	    return type;
	  }
	  switch (type) {
	    case REACT_FRAGMENT_TYPE:
	      return 'ReactFragment';
	    case REACT_PORTAL_TYPE:
	      return 'ReactPortal';
	    case REACT_CALL_TYPE:
	      return 'ReactCall';
	    case REACT_RETURN_TYPE:
	      return 'ReactReturn';
	  }
	  if (typeof type === 'object' && type !== null) {
	    switch (type.$$typeof) {
	      case REACT_FORWARD_REF_TYPE:
	        var functionName = type.render.displayName || type.render.name || '';
	        return functionName !== '' ? 'ForwardRef(' + functionName + ')' : 'ForwardRef';
	    }
	  }
	  return null;
	}

	/**
	 * ReactElementValidator provides a wrapper around a element factory
	 * which validates the props passed to the element. This is intended to be
	 * used only in DEV and could be replaced by a static type checker for languages
	 * that support it.
	 */

	var currentlyValidatingElement = void 0;
	var propTypesMisspellWarningShown = void 0;

	var getDisplayName = function () {};
	var getStackAddendum = function () {};

	{
	  currentlyValidatingElement = null;

	  propTypesMisspellWarningShown = false;

	  getDisplayName = function (element) {
	    if (element == null) {
	      return '#empty';
	    } else if (typeof element === 'string' || typeof element === 'number') {
	      return '#text';
	    } else if (typeof element.type === 'string') {
	      return element.type;
	    } else if (element.type === REACT_FRAGMENT_TYPE) {
	      return 'React.Fragment';
	    } else {
	      return element.type.displayName || element.type.name || 'Unknown';
	    }
	  };

	  getStackAddendum = function () {
	    var stack = '';
	    if (currentlyValidatingElement) {
	      var name = getDisplayName(currentlyValidatingElement);
	      var owner = currentlyValidatingElement._owner;
	      stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner));
	    }
	    stack += ReactDebugCurrentFrame.getStackAddendum() || '';
	    return stack;
	  };
	}

	function getDeclarationErrorAddendum() {
	  if (ReactCurrentOwner.current) {
	    var name = getComponentName(ReactCurrentOwner.current);
	    if (name) {
	      return '\n\nCheck the render method of `' + name + '`.';
	    }
	  }
	  return '';
	}

	function getSourceInfoErrorAddendum(elementProps) {
	  if (elementProps !== null && elementProps !== undefined && elementProps.__source !== undefined) {
	    var source = elementProps.__source;
	    var fileName = source.fileName.replace(/^.*[\\\/]/, '');
	    var lineNumber = source.lineNumber;
	    return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
	  }
	  return '';
	}

	/**
	 * Warn if there's no key explicitly set on dynamic arrays of children or
	 * object keys are not valid. This allows us to keep track of children between
	 * updates.
	 */
	var ownerHasKeyUseWarning = {};

	function getCurrentComponentErrorInfo(parentType) {
	  var info = getDeclarationErrorAddendum();

	  if (!info) {
	    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
	    if (parentName) {
	      info = '\n\nCheck the top-level render call using <' + parentName + '>.';
	    }
	  }
	  return info;
	}

	/**
	 * Warn if the element doesn't have an explicit key assigned to it.
	 * This element is in an array. The array could grow and shrink or be
	 * reordered. All children that haven't already been validated are required to
	 * have a "key" property assigned to it. Error statuses are cached so a warning
	 * will only be shown once.
	 *
	 * @internal
	 * @param {ReactElement} element Element that requires a key.
	 * @param {*} parentType element's parent's type.
	 */
	function validateExplicitKey(element, parentType) {
	  if (!element._store || element._store.validated || element.key != null) {
	    return;
	  }
	  element._store.validated = true;

	  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
	  if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
	    return;
	  }
	  ownerHasKeyUseWarning[currentComponentErrorInfo] = true;

	  // Usually the current owner is the offender, but if it accepts children as a
	  // property, it may be the creator of the child that's responsible for
	  // assigning it a key.
	  var childOwner = '';
	  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
	    // Give the component that originally created this child.
	    childOwner = ' It was passed a child from ' + getComponentName(element._owner) + '.';
	  }

	  currentlyValidatingElement = element;
	  {
	    warning(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.%s', currentComponentErrorInfo, childOwner, getStackAddendum());
	  }
	  currentlyValidatingElement = null;
	}

	/**
	 * Ensure that every element either is passed in a static location, in an
	 * array with an explicit keys property defined, or in an object literal
	 * with valid key property.
	 *
	 * @internal
	 * @param {ReactNode} node Statically passed child of any type.
	 * @param {*} parentType node's parent's type.
	 */
	function validateChildKeys(node, parentType) {
	  if (typeof node !== 'object') {
	    return;
	  }
	  if (Array.isArray(node)) {
	    for (var i = 0; i < node.length; i++) {
	      var child = node[i];
	      if (isValidElement(child)) {
	        validateExplicitKey(child, parentType);
	      }
	    }
	  } else if (isValidElement(node)) {
	    // This element was passed in a valid location.
	    if (node._store) {
	      node._store.validated = true;
	    }
	  } else if (node) {
	    var iteratorFn = getIteratorFn(node);
	    if (typeof iteratorFn === 'function') {
	      // Entry iterators used to provide implicit keys,
	      // but now we print a separate warning for them later.
	      if (iteratorFn !== node.entries) {
	        var iterator = iteratorFn.call(node);
	        var step = void 0;
	        while (!(step = iterator.next()).done) {
	          if (isValidElement(step.value)) {
	            validateExplicitKey(step.value, parentType);
	          }
	        }
	      }
	    }
	  }
	}

	/**
	 * Given an element, validate that its props follow the propTypes definition,
	 * provided by the type.
	 *
	 * @param {ReactElement} element
	 */
	function validatePropTypes(element) {
	  var componentClass = element.type;
	  if (typeof componentClass !== 'function') {
	    return;
	  }
	  var name = componentClass.displayName || componentClass.name;
	  var propTypes = componentClass.propTypes;
	  if (propTypes) {
	    currentlyValidatingElement = element;
	    checkPropTypes(propTypes, element.props, 'prop', name, getStackAddendum);
	    currentlyValidatingElement = null;
	  } else if (componentClass.PropTypes !== undefined && !propTypesMisspellWarningShown) {
	    propTypesMisspellWarningShown = true;
	    warning(false, 'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
	  }
	  if (typeof componentClass.getDefaultProps === 'function') {
	    !componentClass.getDefaultProps.isReactClassApproved ? warning(false, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
	  }
	}

	/**
	 * Given a fragment, validate that it can only be provided with fragment props
	 * @param {ReactElement} fragment
	 */
	function validateFragmentProps(fragment) {
	  currentlyValidatingElement = fragment;

	  var keys = Object.keys(fragment.props);
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (key !== 'children' && key !== 'key') {
	      warning(false, 'Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.%s', key, getStackAddendum());
	      break;
	    }
	  }

	  if (fragment.ref !== null) {
	    warning(false, 'Invalid attribute `ref` supplied to `React.Fragment`.%s', getStackAddendum());
	  }

	  currentlyValidatingElement = null;
	}

	function createElementWithValidation(type, props, children) {
	  var validType = isValidElementType(type);

	  // We warn in this case but don't throw. We expect the element creation to
	  // succeed and there will likely be errors in render.
	  if (!validType) {
	    var info = '';
	    if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
	      info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
	    }

	    var sourceInfo = getSourceInfoErrorAddendum(props);
	    if (sourceInfo) {
	      info += sourceInfo;
	    } else {
	      info += getDeclarationErrorAddendum();
	    }

	    info += getStackAddendum() || '';

	    var typeString = void 0;
	    if (type === null) {
	      typeString = 'null';
	    } else if (Array.isArray(type)) {
	      typeString = 'array';
	    } else {
	      typeString = typeof type;
	    }

	    warning(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
	  }

	  var element = createElement.apply(this, arguments);

	  // The result can be nullish if a mock or a custom function is used.
	  // TODO: Drop this when these are no longer allowed as the type argument.
	  if (element == null) {
	    return element;
	  }

	  // Skip key warning if the type isn't valid since our key validation logic
	  // doesn't expect a non-string/function type and can throw confusing errors.
	  // We don't want exception behavior to differ between dev and prod.
	  // (Rendering will throw with a helpful message and as soon as the type is
	  // fixed, the key warnings will appear.)
	  if (validType) {
	    for (var i = 2; i < arguments.length; i++) {
	      validateChildKeys(arguments[i], type);
	    }
	  }

	  if (type === REACT_FRAGMENT_TYPE) {
	    validateFragmentProps(element);
	  } else {
	    validatePropTypes(element);
	  }

	  return element;
	}

	function createFactoryWithValidation(type) {
	  var validatedFactory = createElementWithValidation.bind(null, type);
	  validatedFactory.type = type;
	  // Legacy hook: remove it
	  {
	    Object.defineProperty(validatedFactory, 'type', {
	      enumerable: false,
	      get: function () {
	        lowPriorityWarning$1(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
	        Object.defineProperty(this, 'type', {
	          value: type
	        });
	        return type;
	      }
	    });
	  }

	  return validatedFactory;
	}

	function cloneElementWithValidation(element, props, children) {
	  var newElement = cloneElement.apply(this, arguments);
	  for (var i = 2; i < arguments.length; i++) {
	    validateChildKeys(arguments[i], newElement.type);
	  }
	  validatePropTypes(newElement);
	  return newElement;
	}

	var React = {
	  Children: {
	    map: mapChildren,
	    forEach: forEachChildren,
	    count: countChildren,
	    toArray: toArray,
	    only: onlyChild
	  },

	  createRef: createRef,
	  Component: Component,
	  PureComponent: PureComponent,

	  createContext: createContext,
	  forwardRef: forwardRef,

	  Fragment: REACT_FRAGMENT_TYPE,
	  StrictMode: REACT_STRICT_MODE_TYPE,
	  unstable_AsyncMode: REACT_ASYNC_MODE_TYPE,

	  createElement: createElementWithValidation,
	  cloneElement: cloneElementWithValidation,
	  createFactory: createFactoryWithValidation,
	  isValidElement: isValidElement,

	  version: ReactVersion,

	  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
	    ReactCurrentOwner: ReactCurrentOwner,
	    // Used by renderers to avoid bundling object-assign twice in UMD bundles:
	    assign: _assign
	  }
	};

	{
	  _assign(React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, {
	    // These should not be included in production.
	    ReactDebugCurrentFrame: ReactDebugCurrentFrame,
	    // Shim for React DOM 16.0.0 which still destructured (but not used) this.
	    // TODO: remove in React 17.0.
	    ReactComponentTreeHook: {}
	  });
	}



	var React$2 = Object.freeze({
		default: React
	});

	var React$3 = ( React$2 && React ) || React$2;

	// TODO: decide on the top-level export form.
	// This is hacky but makes it work with both Rollup and Jest.
	var react = React$3['default'] ? React$3['default'] : React$3;

	module.exports = react;
	  })();
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	'use strict';

	var emptyFunction = __webpack_require__(7);

	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var warning = emptyFunction;

	if (process.env.NODE_ENV !== 'production') {
	  var printWarning = function printWarning(format) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    var argIndex = 0;
	    var message = 'Warning: ' + format.replace(/%s/g, function () {
	      return args[argIndex++];
	    });
	    if (typeof console !== 'undefined') {
	      console.error(message);
	    }
	    try {
	      // --- Welcome to debugging React ---
	      // This error was thrown as a convenience so that you can use this stack
	      // to find the callsite that caused this warning to fire.
	      throw new Error(message);
	    } catch (x) {}
	  };

	  warning = function warning(condition, format) {
	    if (format === undefined) {
	      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
	    }

	    if (format.indexOf('Failed Composite propType: ') === 0) {
	      return; // Ignore CompositeComponent proptype check.
	    }

	    if (!condition) {
	      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	        args[_key2 - 2] = arguments[_key2];
	      }

	      printWarning.apply(undefined, [format].concat(args));
	    }
	  };
	}

	module.exports = warning;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	if (process.env.NODE_ENV !== 'production') {
	  var invariant = __webpack_require__(11);
	  var warning = __webpack_require__(12);
	  var ReactPropTypesSecret = __webpack_require__(14);
	  var loggedTypeFailures = {};
	}

	/**
	 * Assert that the values match with the type specs.
	 * Error messages are memorized and will only be shown once.
	 *
	 * @param {object} typeSpecs Map of name to a ReactPropType
	 * @param {object} values Runtime values that need to be type-checked
	 * @param {string} location e.g. "prop", "context", "child context"
	 * @param {string} componentName Name of the component for error messages.
	 * @param {?Function} getStack Returns the component stack.
	 * @private
	 */
	function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
	  if (process.env.NODE_ENV !== 'production') {
	    for (var typeSpecName in typeSpecs) {
	      if (typeSpecs.hasOwnProperty(typeSpecName)) {
	        var error;
	        // Prop type validation may throw. In case they do, we don't want to
	        // fail the render phase where it didn't fail before. So we log it.
	        // After these have been cleaned up, we'll let them throw.
	        try {
	          // This is intentionally an invariant that gets caught. It's the same
	          // behavior as without this statement except with a better message.
	          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
	          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
	        } catch (ex) {
	          error = ex;
	        }
	        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
	        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
	          // Only monitor this failure once because there tends to be a lot of the
	          // same error.
	          loggedTypeFailures[error.message] = true;

	          var stack = getStack ? getStack() : '';

	          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
	        }
	      }
	    }
	  }
	}

	module.exports = checkPropTypes;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var validateFormat = function validateFormat(format) {};

	if (process.env.NODE_ENV !== 'production') {
	  validateFormat = function validateFormat(format) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  };
	}

	function invariant(condition, format, a, b, c, d, e, f) {
	  validateFormat(format);

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}

	module.exports = invariant;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	'use strict';

	var emptyFunction = __webpack_require__(13);

	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var warning = emptyFunction;

	if (process.env.NODE_ENV !== 'production') {
	  var printWarning = function printWarning(format) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    var argIndex = 0;
	    var message = 'Warning: ' + format.replace(/%s/g, function () {
	      return args[argIndex++];
	    });
	    if (typeof console !== 'undefined') {
	      console.error(message);
	    }
	    try {
	      // --- Welcome to debugging React ---
	      // This error was thrown as a convenience so that you can use this stack
	      // to find the callsite that caused this warning to fire.
	      throw new Error(message);
	    } catch (x) {}
	  };

	  warning = function warning(condition, format) {
	    if (format === undefined) {
	      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
	    }

	    if (format.indexOf('Failed Composite propType: ') === 0) {
	      return; // Ignore CompositeComponent proptype check.
	    }

	    if (!condition) {
	      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	        args[_key2 - 2] = arguments[_key2];
	      }

	      printWarning.apply(undefined, [format].concat(args));
	    }
	  };
	}

	module.exports = warning;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * 
	 */

	function makeEmptyFunction(arg) {
	  return function () {
	    return arg;
	  };
	}

	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	var emptyFunction = function emptyFunction() {};

	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function () {
	  return this;
	};
	emptyFunction.thatReturnsArgument = function (arg) {
	  return arg;
	};

	module.exports = emptyFunction;

/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

	module.exports = ReactPropTypesSecret;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _propTypes = __webpack_require__(16);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * This file contains React component for Panel
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author Alex I.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @version 1.0.0
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	/**
	 * Panel component
	 * Wraps children in a collapsible bootstrap panel
	 */


	var Panel = function (_Component) {
	  _inherits(Panel, _Component);

	  function Panel(props) {
	    _classCallCheck(this, Panel);

	    var _this = _possibleConstructorReturn(this, (Panel.__proto__ || Object.getPrototypeOf(Panel)).call(this, props));

	    _this.state = {
	      collapsed: _this.props.initCollapsed
	    };

	    // Initialize panel class based on collapsed status
	    _this.panelClass = _this.props.initCollapsed ? "panel-collapse collapse" : "panel-collapse collapse in";

	    _this.toggleCollapsed = _this.toggleCollapsed.bind(_this);
	    return _this;
	  }

	  _createClass(Panel, [{
	    key: 'toggleCollapsed',
	    value: function toggleCollapsed() {
	      this.setState({ collapsed: !this.state.collapsed });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      // Change arrow direction based on collapse status
	      var glyphClass = this.state.collapsed ? "glyphicon pull-right glyphicon-chevron-down" : "glyphicon pull-right glyphicon-chevron-up";

	      // Add panel header, if title is set
	      var panelHeading = this.props.title ? React.createElement(
	        'div',
	        {
	          className: 'panel-heading',
	          onClick: this.toggleCollapsed,
	          'data-toggle': 'collapse',
	          'data-target': '#' + this.props.id,
	          style: { cursor: 'pointer' }
	        },
	        this.props.title,
	        React.createElement('span', { className: glyphClass })
	      ) : '';

	      return React.createElement(
	        'div',
	        { className: 'panel panel-primary' },
	        panelHeading,
	        React.createElement(
	          'div',
	          { id: this.props.id, className: this.panelClass, role: 'tabpanel' },
	          React.createElement(
	            'div',
	            { className: 'panel-body', style: { height: this.props.height } },
	            this.props.children
	          )
	        )
	      );
	    }
	  }]);

	  return Panel;
	}(_react.Component);

	Panel.propTypes = {
	  id: _propTypes2.default.string,
	  height: _propTypes2.default.string,
	  title: _propTypes2.default.string
	};

	Panel.defaultProps = {
	  initCollapsed: false,
	  id: 'default-panel',
	  height: '100%'
	};

	exports.default = Panel;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	if (process.env.NODE_ENV !== 'production') {
	  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
	    Symbol.for &&
	    Symbol.for('react.element')) ||
	    0xeac7;

	  var isValidElement = function(object) {
	    return typeof object === 'object' &&
	      object !== null &&
	      object.$$typeof === REACT_ELEMENT_TYPE;
	  };

	  // By explicitly using `prop-types` you are opting into new development behavior.
	  // http://fb.me/prop-types-in-prod
	  var throwOnDirectAccess = true;
	  module.exports = __webpack_require__(17)(isValidElement, throwOnDirectAccess);
	} else {
	  // By explicitly using `prop-types` you are opting into new production behavior.
	  // http://fb.me/prop-types-in-prod
	  module.exports = __webpack_require__(18)();
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	var emptyFunction = __webpack_require__(13);
	var invariant = __webpack_require__(11);
	var warning = __webpack_require__(12);
	var assign = __webpack_require__(4);

	var ReactPropTypesSecret = __webpack_require__(14);
	var checkPropTypes = __webpack_require__(10);

	module.exports = function(isValidElement, throwOnDirectAccess) {
	  /* global Symbol */
	  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

	  /**
	   * Returns the iterator method function contained on the iterable object.
	   *
	   * Be sure to invoke the function with the iterable as context:
	   *
	   *     var iteratorFn = getIteratorFn(myIterable);
	   *     if (iteratorFn) {
	   *       var iterator = iteratorFn.call(myIterable);
	   *       ...
	   *     }
	   *
	   * @param {?object} maybeIterable
	   * @return {?function}
	   */
	  function getIteratorFn(maybeIterable) {
	    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
	    if (typeof iteratorFn === 'function') {
	      return iteratorFn;
	    }
	  }

	  /**
	   * Collection of methods that allow declaration and validation of props that are
	   * supplied to React components. Example usage:
	   *
	   *   var Props = require('ReactPropTypes');
	   *   var MyArticle = React.createClass({
	   *     propTypes: {
	   *       // An optional string prop named "description".
	   *       description: Props.string,
	   *
	   *       // A required enum prop named "category".
	   *       category: Props.oneOf(['News','Photos']).isRequired,
	   *
	   *       // A prop named "dialog" that requires an instance of Dialog.
	   *       dialog: Props.instanceOf(Dialog).isRequired
	   *     },
	   *     render: function() { ... }
	   *   });
	   *
	   * A more formal specification of how these methods are used:
	   *
	   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
	   *   decl := ReactPropTypes.{type}(.isRequired)?
	   *
	   * Each and every declaration produces a function with the same signature. This
	   * allows the creation of custom validation functions. For example:
	   *
	   *  var MyLink = React.createClass({
	   *    propTypes: {
	   *      // An optional string or URI prop named "href".
	   *      href: function(props, propName, componentName) {
	   *        var propValue = props[propName];
	   *        if (propValue != null && typeof propValue !== 'string' &&
	   *            !(propValue instanceof URI)) {
	   *          return new Error(
	   *            'Expected a string or an URI for ' + propName + ' in ' +
	   *            componentName
	   *          );
	   *        }
	   *      }
	   *    },
	   *    render: function() {...}
	   *  });
	   *
	   * @internal
	   */

	  var ANONYMOUS = '<<anonymous>>';

	  // Important!
	  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
	  var ReactPropTypes = {
	    array: createPrimitiveTypeChecker('array'),
	    bool: createPrimitiveTypeChecker('boolean'),
	    func: createPrimitiveTypeChecker('function'),
	    number: createPrimitiveTypeChecker('number'),
	    object: createPrimitiveTypeChecker('object'),
	    string: createPrimitiveTypeChecker('string'),
	    symbol: createPrimitiveTypeChecker('symbol'),

	    any: createAnyTypeChecker(),
	    arrayOf: createArrayOfTypeChecker,
	    element: createElementTypeChecker(),
	    instanceOf: createInstanceTypeChecker,
	    node: createNodeChecker(),
	    objectOf: createObjectOfTypeChecker,
	    oneOf: createEnumTypeChecker,
	    oneOfType: createUnionTypeChecker,
	    shape: createShapeTypeChecker,
	    exact: createStrictShapeTypeChecker,
	  };

	  /**
	   * inlined Object.is polyfill to avoid requiring consumers ship their own
	   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
	   */
	  /*eslint-disable no-self-compare*/
	  function is(x, y) {
	    // SameValue algorithm
	    if (x === y) {
	      // Steps 1-5, 7-10
	      // Steps 6.b-6.e: +0 != -0
	      return x !== 0 || 1 / x === 1 / y;
	    } else {
	      // Step 6.a: NaN == NaN
	      return x !== x && y !== y;
	    }
	  }
	  /*eslint-enable no-self-compare*/

	  /**
	   * We use an Error-like object for backward compatibility as people may call
	   * PropTypes directly and inspect their output. However, we don't use real
	   * Errors anymore. We don't inspect their stack anyway, and creating them
	   * is prohibitively expensive if they are created too often, such as what
	   * happens in oneOfType() for any type before the one that matched.
	   */
	  function PropTypeError(message) {
	    this.message = message;
	    this.stack = '';
	  }
	  // Make `instanceof Error` still work for returned errors.
	  PropTypeError.prototype = Error.prototype;

	  function createChainableTypeChecker(validate) {
	    if (process.env.NODE_ENV !== 'production') {
	      var manualPropTypeCallCache = {};
	      var manualPropTypeWarningCount = 0;
	    }
	    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
	      componentName = componentName || ANONYMOUS;
	      propFullName = propFullName || propName;

	      if (secret !== ReactPropTypesSecret) {
	        if (throwOnDirectAccess) {
	          // New behavior only for users of `prop-types` package
	          invariant(
	            false,
	            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	            'Use `PropTypes.checkPropTypes()` to call them. ' +
	            'Read more at http://fb.me/use-check-prop-types'
	          );
	        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
	          // Old behavior for people using React.PropTypes
	          var cacheKey = componentName + ':' + propName;
	          if (
	            !manualPropTypeCallCache[cacheKey] &&
	            // Avoid spamming the console because they are often not actionable except for lib authors
	            manualPropTypeWarningCount < 3
	          ) {
	            warning(
	              false,
	              'You are manually calling a React.PropTypes validation ' +
	              'function for the `%s` prop on `%s`. This is deprecated ' +
	              'and will throw in the standalone `prop-types` package. ' +
	              'You may be seeing this warning due to a third-party PropTypes ' +
	              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
	              propFullName,
	              componentName
	            );
	            manualPropTypeCallCache[cacheKey] = true;
	            manualPropTypeWarningCount++;
	          }
	        }
	      }
	      if (props[propName] == null) {
	        if (isRequired) {
	          if (props[propName] === null) {
	            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
	          }
	          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
	        }
	        return null;
	      } else {
	        return validate(props, propName, componentName, location, propFullName);
	      }
	    }

	    var chainedCheckType = checkType.bind(null, false);
	    chainedCheckType.isRequired = checkType.bind(null, true);

	    return chainedCheckType;
	  }

	  function createPrimitiveTypeChecker(expectedType) {
	    function validate(props, propName, componentName, location, propFullName, secret) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== expectedType) {
	        // `propValue` being instance of, say, date/regexp, pass the 'object'
	        // check, but we can offer a more precise error message here rather than
	        // 'of type `object`'.
	        var preciseType = getPreciseType(propValue);

	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createAnyTypeChecker() {
	    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
	  }

	  function createArrayOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
	      }
	      var propValue = props[propName];
	      if (!Array.isArray(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
	      }
	      for (var i = 0; i < propValue.length; i++) {
	        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
	        if (error instanceof Error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createElementTypeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      if (!isValidElement(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createInstanceTypeChecker(expectedClass) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!(props[propName] instanceof expectedClass)) {
	        var expectedClassName = expectedClass.name || ANONYMOUS;
	        var actualClassName = getClassName(props[propName]);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createEnumTypeChecker(expectedValues) {
	    if (!Array.isArray(expectedValues)) {
	      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
	      return emptyFunction.thatReturnsNull;
	    }

	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      for (var i = 0; i < expectedValues.length; i++) {
	        if (is(propValue, expectedValues[i])) {
	          return null;
	        }
	      }

	      var valuesString = JSON.stringify(expectedValues);
	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createObjectOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
	      }
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
	      }
	      for (var key in propValue) {
	        if (propValue.hasOwnProperty(key)) {
	          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	          if (error instanceof Error) {
	            return error;
	          }
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createUnionTypeChecker(arrayOfTypeCheckers) {
	    if (!Array.isArray(arrayOfTypeCheckers)) {
	      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
	      return emptyFunction.thatReturnsNull;
	    }

	    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	      var checker = arrayOfTypeCheckers[i];
	      if (typeof checker !== 'function') {
	        warning(
	          false,
	          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
	          'received %s at index %s.',
	          getPostfixForTypeWarning(checker),
	          i
	        );
	        return emptyFunction.thatReturnsNull;
	      }
	    }

	    function validate(props, propName, componentName, location, propFullName) {
	      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	        var checker = arrayOfTypeCheckers[i];
	        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
	          return null;
	        }
	      }

	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createNodeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!isNode(props[propName])) {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createShapeTypeChecker(shapeTypes) {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	      }
	      for (var key in shapeTypes) {
	        var checker = shapeTypes[key];
	        if (!checker) {
	          continue;
	        }
	        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	        if (error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createStrictShapeTypeChecker(shapeTypes) {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	      }
	      // We need to check all keys in case some are required but missing from
	      // props.
	      var allKeys = assign({}, props[propName], shapeTypes);
	      for (var key in allKeys) {
	        var checker = shapeTypes[key];
	        if (!checker) {
	          return new PropTypeError(
	            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
	            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
	            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
	          );
	        }
	        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	        if (error) {
	          return error;
	        }
	      }
	      return null;
	    }

	    return createChainableTypeChecker(validate);
	  }

	  function isNode(propValue) {
	    switch (typeof propValue) {
	      case 'number':
	      case 'string':
	      case 'undefined':
	        return true;
	      case 'boolean':
	        return !propValue;
	      case 'object':
	        if (Array.isArray(propValue)) {
	          return propValue.every(isNode);
	        }
	        if (propValue === null || isValidElement(propValue)) {
	          return true;
	        }

	        var iteratorFn = getIteratorFn(propValue);
	        if (iteratorFn) {
	          var iterator = iteratorFn.call(propValue);
	          var step;
	          if (iteratorFn !== propValue.entries) {
	            while (!(step = iterator.next()).done) {
	              if (!isNode(step.value)) {
	                return false;
	              }
	            }
	          } else {
	            // Iterator will provide entry [k,v] tuples rather than values.
	            while (!(step = iterator.next()).done) {
	              var entry = step.value;
	              if (entry) {
	                if (!isNode(entry[1])) {
	                  return false;
	                }
	              }
	            }
	          }
	        } else {
	          return false;
	        }

	        return true;
	      default:
	        return false;
	    }
	  }

	  function isSymbol(propType, propValue) {
	    // Native Symbol.
	    if (propType === 'symbol') {
	      return true;
	    }

	    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
	    if (propValue['@@toStringTag'] === 'Symbol') {
	      return true;
	    }

	    // Fallback for non-spec compliant Symbols which are polyfilled.
	    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
	      return true;
	    }

	    return false;
	  }

	  // Equivalent of `typeof` but with special handling for array and regexp.
	  function getPropType(propValue) {
	    var propType = typeof propValue;
	    if (Array.isArray(propValue)) {
	      return 'array';
	    }
	    if (propValue instanceof RegExp) {
	      // Old webkits (at least until Android 4.0) return 'function' rather than
	      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
	      // passes PropTypes.object.
	      return 'object';
	    }
	    if (isSymbol(propType, propValue)) {
	      return 'symbol';
	    }
	    return propType;
	  }

	  // This handles more types than `getPropType`. Only used for error messages.
	  // See `createPrimitiveTypeChecker`.
	  function getPreciseType(propValue) {
	    if (typeof propValue === 'undefined' || propValue === null) {
	      return '' + propValue;
	    }
	    var propType = getPropType(propValue);
	    if (propType === 'object') {
	      if (propValue instanceof Date) {
	        return 'date';
	      } else if (propValue instanceof RegExp) {
	        return 'regexp';
	      }
	    }
	    return propType;
	  }

	  // Returns a string that is postfixed to a warning about an invalid type.
	  // For example, "undefined" or "of type array"
	  function getPostfixForTypeWarning(value) {
	    var type = getPreciseType(value);
	    switch (type) {
	      case 'array':
	      case 'object':
	        return 'an ' + type;
	      case 'boolean':
	      case 'date':
	      case 'regexp':
	        return 'a ' + type;
	      default:
	        return type;
	    }
	  }

	  // Returns class name of the object, if any.
	  function getClassName(propValue) {
	    if (!propValue.constructor || !propValue.constructor.name) {
	      return ANONYMOUS;
	    }
	    return propValue.constructor.name;
	  }

	  ReactPropTypes.checkPropTypes = checkPropTypes;
	  ReactPropTypes.PropTypes = ReactPropTypes;

	  return ReactPropTypes;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	var emptyFunction = __webpack_require__(13);
	var invariant = __webpack_require__(11);
	var ReactPropTypesSecret = __webpack_require__(14);

	module.exports = function() {
	  function shim(props, propName, componentName, location, propFullName, secret) {
	    if (secret === ReactPropTypesSecret) {
	      // It is still safe when called from React.
	      return;
	    }
	    invariant(
	      false,
	      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	      'Use PropTypes.checkPropTypes() to call them. ' +
	      'Read more at http://fb.me/use-check-prop-types'
	    );
	  };
	  shim.isRequired = shim;
	  function getShim() {
	    return shim;
	  };
	  // Important!
	  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
	  var ReactPropTypes = {
	    array: shim,
	    bool: shim,
	    func: shim,
	    number: shim,
	    object: shim,
	    string: shim,
	    symbol: shim,

	    any: shim,
	    arrayOf: getShim,
	    element: shim,
	    instanceOf: getShim,
	    node: shim,
	    objectOf: getShim,
	    oneOf: getShim,
	    oneOfType: getShim,
	    shape: getShim,
	    exact: getShim
	  };

	  ReactPropTypes.checkPropTypes = emptyFunction;
	  ReactPropTypes.PropTypes = ReactPropTypes;

	  return ReactPropTypes;
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _propTypes = __webpack_require__(16);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* exported FormElement, SelectElement, SearchableDropdown, TextareaElement, TextboxElement,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               DateElement, NumericElement, FileElement, StaticElement, LinkElement, ButtonElement, LorisElement
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

	/**
	 * This file contains React components for Loris form elements.
	 *
	 * @author Loris Team
	 * @version 1.0.0
	 *
	 */

	/**
	 * Form Component.
	 * React wrapper for <form> element that accepts children react components
	 *
	 * The form elements can be passed in two ways:
	 * 1. A `this.props.formElements` JSON object
	 * 2. Form components nested directly inside <FormElement></FormElement>
	 *
	 * Note that if both are passed `this.props.formElements` is displayed first.
	 *
	 */
	var FormElement = function (_Component) {
	  _inherits(FormElement, _Component);

	  function FormElement() {
	    _classCallCheck(this, FormElement);

	    var _this = _possibleConstructorReturn(this, (FormElement.__proto__ || Object.getPrototypeOf(FormElement)).call(this));

	    _this.getFormElements = _this.getFormElements.bind(_this);
	    _this.handleSubmit = _this.handleSubmit.bind(_this);
	    return _this;
	  }

	  _createClass(FormElement, [{
	    key: 'getFormElements',
	    value: function getFormElements() {
	      var formElementsHTML = [];
	      var columns = this.props.columns;
	      var maxColumnSize = 12;
	      var colSize = Math.floor(maxColumnSize / columns);
	      var colClass = "col-xs-12 col-sm-" + colSize + " col-md-" + colSize;

	      // Render elements from JSON
	      var filter = this.props.formElements;

	      Object.keys(filter).forEach(function (objKey, index) {
	        var userInput = this.props.onUserInput ? this.props.onUserInput : filter[objKey].onUserInput;
	        var value = filter[objKey].value ? filter[objKey].value : '';
	        formElementsHTML.push(React.createElement(
	          'div',
	          { key: 'el_' + index, className: colClass },
	          React.createElement(LorisElement, {
	            element: filter[objKey],
	            onUserInput: userInput,
	            value: value
	          })
	        ));
	      }.bind(this));

	      // Render elements from React
	      React.Children.forEach(this.props.children, function (child, key) {
	        // If child is plain HTML, insert it as full size.
	        // Useful for inserting <hr> to split form sections
	        var elementClass = "col-xs-12 col-sm-12 col-md-12";

	        // If child is form element use appropriate size
	        if (React.isValidElement(child) && typeof child.type === "function") {
	          elementClass = colClass;
	        }
	        formElementsHTML.push(React.createElement(
	          'div',
	          { key: 'el_child_' + key, className: elementClass },
	          child
	        ));
	      });

	      return formElementsHTML;
	    }
	  }, {
	    key: 'handleSubmit',
	    value: function handleSubmit(e) {
	      // Override default submit if property is set
	      if (this.props.onSubmit) {
	        e.preventDefault();
	        this.props.onSubmit(e);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var encType = this.props.fileUpload ? 'multipart/form-data' : null;

	      // Generate form elements
	      var formElements = this.getFormElements();

	      // Flexbox is set to ensure that columns of different heights
	      // are displayed proportionally on the screen
	      var rowStyles = {
	        display: "flex",
	        flexWrap: "wrap"
	      };

	      return React.createElement(
	        'form',
	        {
	          name: this.props.name,
	          id: this.props.id,
	          className: this.props.class,
	          method: this.props.method,
	          action: this.props.action,
	          encType: encType,
	          onSubmit: this.handleSubmit
	        },
	        React.createElement(
	          'div',
	          { className: 'row', style: rowStyles },
	          formElements
	        )
	      );
	    }
	  }]);

	  return FormElement;
	}(_react.Component);

	FormElement.propTypes = {
	  name: _propTypes2.default.string.isRequired,
	  id: _propTypes2.default.string,
	  method: _propTypes2.default.oneOf(['POST', 'GET']),
	  action: _propTypes2.default.string,
	  class: _propTypes2.default.string,
	  columns: _propTypes2.default.number,
	  formElements: _propTypes2.default.shape({
	    elementName: _propTypes2.default.shape({
	      name: _propTypes2.default.string,
	      type: _propTypes2.default.string
	    })
	  }),
	  onSubmit: _propTypes2.default.func,
	  onUserInput: _propTypes2.default.func
	};

	FormElement.defaultProps = {
	  name: null,
	  id: '',
	  method: 'POST',
	  action: undefined,
	  class: 'form-horizontal',
	  columns: 1,
	  fileUpload: false,
	  formElements: {},
	  onSubmit: function onSubmit() {
	    console.warn('onSubmit() callback is not set!');
	  }
	};

	/**
	 * Search Component
	 * React wrapper for a searchable dropdown
	 */

	var SearchableDropdown = function (_Component2) {
	  _inherits(SearchableDropdown, _Component2);

	  function SearchableDropdown() {
	    _classCallCheck(this, SearchableDropdown);

	    var _this2 = _possibleConstructorReturn(this, (SearchableDropdown.__proto__ || Object.getPrototypeOf(SearchableDropdown)).call(this));

	    _this2.getKeyFromValue = _this2.getKeyFromValue.bind(_this2);
	    _this2.handleChange = _this2.handleChange.bind(_this2);
	    _this2.handleBlur = _this2.handleBlur.bind(_this2);
	    _this2.getTextInputValue = _this2.getTextInputValue.bind(_this2);
	    return _this2;
	  }

	  _createClass(SearchableDropdown, [{
	    key: 'getKeyFromValue',
	    value: function getKeyFromValue(value) {
	      var options = this.props.options;
	      return Object.keys(options).find(function (o) {
	        return options[o] === value;
	      });
	    }
	  }, {
	    key: 'handleChange',
	    value: function handleChange(e) {
	      var value = this.getKeyFromValue(e.target.value);
	      // if not in strict mode and key value is not defined (i.e., not in options)
	      // set value equal to e.target.value
	      if (!this.props.strictSearch && value === undefined) {
	        value = e.target.value;
	      }
	      this.props.onUserInput(this.props.name, value);
	    }
	  }, {
	    key: 'handleBlur',
	    value: function handleBlur(e) {
	      // null out entry if not present in options in strict mode
	      if (this.props.strictSearch) {
	        var value = e.target.value;
	        var options = this.props.options;
	        if (Object.values(options).indexOf(value) === -1) {
	          // empty string out both the hidden value as well as the input text
	          document.querySelector('input[name="' + (this.props.name + '_input') + '"]').value = '';
	          this.props.onUserInput(this.props.name, '');
	        }
	      }
	    }
	  }, {
	    key: 'getTextInputValue',
	    value: function getTextInputValue() {
	      return document.querySelector('input[name="' + (this.props.name + '_input') + '"]').value;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var required = this.props.required ? 'required' : null;
	      var disabled = this.props.disabled ? 'disabled' : null;
	      var options = this.props.options;
	      var strictMessage = 'Entry must be included in provided list of options.';
	      var errorMessage = null;
	      var requiredHTML = null;
	      var elementClass = 'row form-group';

	      // Add required asterix
	      if (required) {
	        requiredHTML = React.createElement(
	          'span',
	          { className: 'text-danger' },
	          '*'
	        );
	      }

	      // Add error message
	      if (this.props.errorMessage) {
	        errorMessage = React.createElement(
	          'span',
	          null,
	          this.props.errorMessage
	        );
	        elementClass = 'row form-group has-error';
	      } else if (this.props.required && this.props.value === "") {
	        var msg = 'This field is required!';
	        msg += this.props.strictSearch ? ' ' + strictMessage : '';
	        errorMessage = React.createElement(
	          'span',
	          null,
	          msg
	        );
	        elementClass = 'row form-group has-error';
	      } else if (this.props.strictSearch && this.props.value === "") {
	        errorMessage = React.createElement(
	          'span',
	          null,
	          strictMessage
	        );
	        elementClass = 'row form-group has-error';
	      }

	      // determine value to place into text input
	      var value = void 0;
	      // use value in options if valid
	      if (this.props.value !== undefined) {
	        if (Object.keys(options).indexOf(this.props.value) > -1) {
	          value = options[this.props.value];
	          // else, use input text value
	        } else {
	          value = this.getTextInputValue();
	        }
	      }

	      return React.createElement(
	        'div',
	        { className: elementClass },
	        React.createElement(
	          'label',
	          { className: 'col-sm-3 control-label', htmlFor: this.props.label },
	          this.props.label,
	          requiredHTML
	        ),
	        React.createElement(
	          'div',
	          { className: 'col-sm-9' },
	          React.createElement('input', {
	            type: 'text',
	            name: this.props.name + '_input',
	            value: value,
	            id: this.props.id,
	            list: this.props.name + '_list',
	            className: 'form-control',
	            disabled: disabled,
	            placeholder: this.props.placeHolder,
	            onChange: this.handleChange,
	            onBlur: this.handleBlur
	          }),
	          React.createElement(
	            'datalist',
	            { id: this.props.name + '_list' },
	            Object.keys(options).map(function (option) {
	              return React.createElement('option', { value: options[option], key: option });
	            })
	          ),
	          errorMessage
	        )
	      );
	    }
	  }]);

	  return SearchableDropdown;
	}(_react.Component);

	SearchableDropdown.propTypes = {
	  name: _propTypes2.default.string.isRequired,
	  options: _propTypes2.default.object.isRequired,
	  id: _propTypes2.default.string,
	  // strictSearch, if set to true, will require that only options
	  // provided in the options prop can be submitted
	  strictSearch: _propTypes2.default.bool,
	  label: _propTypes2.default.string,
	  value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array]),
	  class: _propTypes2.default.string,
	  disabled: _propTypes2.default.bool,
	  required: _propTypes2.default.bool,
	  errorMessage: _propTypes2.default.string,
	  placeHolder: _propTypes2.default.string,
	  onUserInput: _propTypes2.default.func
	};

	SearchableDropdown.defaultProps = {
	  name: '',
	  options: {},
	  strictSearch: true,
	  label: '',
	  value: undefined,
	  id: '',
	  class: '',
	  disabled: false,
	  required: false,
	  errorMessage: '',
	  placeHolder: '',
	  onUserInput: function onUserInput() {
	    console.warn('onUserInput() callback is not set');
	  }
	};

	/**
	 * Select Component
	 * React wrapper for a simple or 'multiple' <select> element.
	 */

	var SelectElement = function (_Component3) {
	  _inherits(SelectElement, _Component3);

	  function SelectElement() {
	    _classCallCheck(this, SelectElement);

	    var _this3 = _possibleConstructorReturn(this, (SelectElement.__proto__ || Object.getPrototypeOf(SelectElement)).call(this));

	    _this3.handleChange = _this3.handleChange.bind(_this3);
	    return _this3;
	  }

	  _createClass(SelectElement, [{
	    key: 'handleChange',
	    value: function handleChange(e) {
	      var value = e.target.value;
	      var options = e.target.options;
	      var numOfOptions = options.length;

	      // Multiple values
	      if (this.props.multiple && numOfOptions > 1) {
	        value = [];
	        for (var i = 0, l = numOfOptions; i < l; i++) {
	          if (options[i].selected) {
	            value.push(options[i].value);
	          }
	        }
	      }

	      this.props.onUserInput(this.props.name, value);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var multiple = this.props.multiple ? 'multiple' : null;
	      var required = this.props.required ? 'required' : null;
	      var disabled = this.props.disabled ? 'disabled' : null;
	      var options = this.props.options;
	      var errorMessage = null;
	      var emptyOptionHTML = null;
	      var requiredHTML = null;
	      var elementClass = 'row form-group';

	      // Add required asterix
	      if (required) {
	        requiredHTML = React.createElement(
	          'span',
	          { className: 'text-danger' },
	          '*'
	        );
	      }

	      // Add empty option
	      if (this.props.emptyOption) {
	        emptyOptionHTML = React.createElement('option', null);
	      }

	      // Add error message
	      if (this.props.hasError || this.props.required && this.props.value === "") {
	        errorMessage = React.createElement(
	          'span',
	          null,
	          this.props.errorMessage
	        );
	        elementClass = 'row form-group has-error';
	      }

	      // Default to empty string for regular select and to empty array for 'multiple' select
	      var value = this.props.value || (multiple ? [] : "");

	      return React.createElement(
	        'div',
	        { className: elementClass },
	        React.createElement(
	          'label',
	          { className: 'col-sm-3 control-label', htmlFor: this.props.label },
	          this.props.label,
	          requiredHTML
	        ),
	        React.createElement(
	          'div',
	          { className: 'col-sm-9' },
	          React.createElement(
	            'select',
	            {
	              name: this.props.name,
	              multiple: multiple,
	              className: 'form-control',
	              id: this.props.label,
	              value: value,
	              onChange: this.handleChange,
	              required: required,
	              disabled: disabled
	            },
	            emptyOptionHTML,
	            Object.keys(options).map(function (option) {
	              return React.createElement(
	                'option',
	                { value: option, key: option },
	                options[option]
	              );
	            })
	          ),
	          errorMessage
	        )
	      );
	    }
	  }]);

	  return SelectElement;
	}(_react.Component);

	SelectElement.propTypes = {
	  name: _propTypes2.default.string.isRequired,
	  options: _propTypes2.default.object.isRequired,
	  label: _propTypes2.default.string,
	  value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array]),
	  id: _propTypes2.default.string,
	  class: _propTypes2.default.string,
	  multiple: _propTypes2.default.bool,
	  disabled: _propTypes2.default.bool,
	  required: _propTypes2.default.bool,
	  emptyOption: _propTypes2.default.bool,
	  hasError: _propTypes2.default.bool,
	  errorMessage: _propTypes2.default.string,
	  onUserInput: _propTypes2.default.func
	};

	SelectElement.defaultProps = {
	  name: '',
	  options: {},
	  label: '',
	  value: undefined,
	  id: '',
	  class: '',
	  multiple: false,
	  disabled: false,
	  required: false,
	  emptyOption: true,
	  hasError: false,
	  errorMessage: 'The field is required!',
	  onUserInput: function onUserInput() {
	    console.warn('onUserInput() callback is not set');
	  }
	};

	/**
	 * Textarea Component
	 * React wrapper for a <textarea> element.
	 */

	var TextareaElement = function (_Component4) {
	  _inherits(TextareaElement, _Component4);

	  function TextareaElement() {
	    _classCallCheck(this, TextareaElement);

	    var _this4 = _possibleConstructorReturn(this, (TextareaElement.__proto__ || Object.getPrototypeOf(TextareaElement)).call(this));

	    _this4.handleChange = _this4.handleChange.bind(_this4);
	    return _this4;
	  }

	  _createClass(TextareaElement, [{
	    key: 'handleChange',
	    value: function handleChange(e) {
	      this.props.onUserInput(this.props.name, e.target.value);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var disabled = this.props.disabled ? 'disabled' : null;
	      var required = this.props.required ? 'required' : null;
	      var requiredHTML = null;

	      // Add required asterix
	      if (required) {
	        requiredHTML = React.createElement(
	          'span',
	          { className: 'text-danger' },
	          '*'
	        );
	      }

	      return React.createElement(
	        'div',
	        { className: 'row form-group' },
	        React.createElement(
	          'label',
	          { className: 'col-sm-3 control-label', htmlFor: this.props.id },
	          this.props.label,
	          requiredHTML
	        ),
	        React.createElement(
	          'div',
	          { className: 'col-sm-9' },
	          React.createElement('textarea', {
	            cols: this.props.cols,
	            rows: this.props.rows,
	            className: 'form-control',
	            name: this.props.name,
	            id: this.props.id,
	            value: this.props.value || "",
	            required: required,
	            disabled: disabled,
	            onChange: this.handleChange
	          })
	        )
	      );
	    }
	  }]);

	  return TextareaElement;
	}(_react.Component);

	TextareaElement.propTypes = {
	  name: _propTypes2.default.string.isRequired,
	  label: _propTypes2.default.string,
	  value: _propTypes2.default.string,
	  id: _propTypes2.default.string,
	  disabled: _propTypes2.default.bool,
	  required: _propTypes2.default.bool,
	  rows: _propTypes2.default.number,
	  cols: _propTypes2.default.number,
	  onUserInput: _propTypes2.default.func
	};

	TextareaElement.defaultProps = {
	  name: '',
	  label: '',
	  value: '',
	  id: '',
	  disabled: false,
	  required: false,
	  rows: 4,
	  cols: 25,
	  onUserInput: function onUserInput() {
	    console.warn('onUserInput() callback is not set');
	  }
	};

	/**
	 * Textbox Component
	 * React wrapper for a <input type="text"> element.
	 */

	var TextboxElement = function (_Component5) {
	  _inherits(TextboxElement, _Component5);

	  function TextboxElement() {
	    _classCallCheck(this, TextboxElement);

	    var _this5 = _possibleConstructorReturn(this, (TextboxElement.__proto__ || Object.getPrototypeOf(TextboxElement)).call(this));

	    _this5.handleChange = _this5.handleChange.bind(_this5);
	    _this5.handleBlur = _this5.handleBlur.bind(_this5);
	    return _this5;
	  }

	  _createClass(TextboxElement, [{
	    key: 'handleChange',
	    value: function handleChange(e) {
	      this.props.onUserInput(this.props.name, e.target.value);
	    }
	  }, {
	    key: 'handleBlur',
	    value: function handleBlur(e) {
	      this.props.onUserBlur(this.props.name, e.target.value);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var disabled = this.props.disabled ? 'disabled' : null;
	      var required = this.props.required ? 'required' : null;
	      var errorMessage = null;
	      var requiredHTML = null;
	      var elementClass = 'row form-group';

	      // Add required asterix
	      if (required) {
	        requiredHTML = React.createElement(
	          'span',
	          { className: 'text-danger' },
	          '*'
	        );
	      }

	      // Add error message
	      if (this.props.errorMessage) {
	        errorMessage = React.createElement(
	          'span',
	          null,
	          this.props.errorMessage
	        );
	        elementClass = 'row form-group has-error';
	      }

	      return React.createElement(
	        'div',
	        { className: elementClass },
	        React.createElement(
	          'label',
	          { className: 'col-sm-3 control-label', htmlFor: this.props.id },
	          this.props.label,
	          requiredHTML
	        ),
	        React.createElement(
	          'div',
	          { className: 'col-sm-9' },
	          React.createElement('input', {
	            type: 'text',
	            className: 'form-control',
	            name: this.props.name,
	            id: this.props.id,
	            value: this.props.value || "",
	            required: required,
	            disabled: disabled,
	            onChange: this.handleChange,
	            onBlur: this.handleBlur
	          }),
	          errorMessage
	        )
	      );
	    }
	  }]);

	  return TextboxElement;
	}(_react.Component);

	TextboxElement.propTypes = {
	  name: _propTypes2.default.string.isRequired,
	  label: _propTypes2.default.string,
	  value: _propTypes2.default.string,
	  id: _propTypes2.default.string,
	  disabled: _propTypes2.default.bool,
	  required: _propTypes2.default.bool,
	  errorMessage: _propTypes2.default.string,
	  onUserInput: _propTypes2.default.func,
	  onUserBlur: _propTypes2.default.func
	};

	TextboxElement.defaultProps = {
	  name: '',
	  label: '',
	  value: '',
	  id: '',
	  disabled: false,
	  required: false,
	  errorMessage: '',
	  onUserInput: function onUserInput() {
	    console.warn('onUserInput() callback is not set');
	  },
	  onUserBlur: function onUserBlur() {}
	};

	/**
	 * Date Component
	 * React wrapper for a <input type="date"> element.
	 */

	var DateElement = function (_Component6) {
	  _inherits(DateElement, _Component6);

	  function DateElement() {
	    _classCallCheck(this, DateElement);

	    var _this6 = _possibleConstructorReturn(this, (DateElement.__proto__ || Object.getPrototypeOf(DateElement)).call(this));

	    _this6.handleChange = _this6.handleChange.bind(_this6);
	    return _this6;
	  }

	  _createClass(DateElement, [{
	    key: 'handleChange',
	    value: function handleChange(e) {
	      this.props.onUserInput(this.props.name, e.target.value);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var disabled = this.props.disabled ? 'disabled' : null;
	      var required = this.props.required ? 'required' : null;
	      var requiredHTML = null;

	      // Add required asterix
	      if (required) {
	        requiredHTML = React.createElement(
	          'span',
	          { className: 'text-danger' },
	          '*'
	        );
	      }

	      return React.createElement(
	        'div',
	        { className: 'row form-group' },
	        React.createElement(
	          'label',
	          { className: 'col-sm-3 control-label', htmlFor: this.props.label },
	          this.props.label,
	          requiredHTML
	        ),
	        React.createElement(
	          'div',
	          { className: 'col-sm-9' },
	          React.createElement('input', {
	            type: 'date',
	            className: 'form-control',
	            name: this.props.name,
	            id: this.props.label,
	            min: this.props.minYear,
	            max: this.props.maxYear,
	            onChange: this.handleChange,
	            value: this.props.value || "",
	            required: required,
	            disabled: disabled
	          })
	        )
	      );
	    }
	  }]);

	  return DateElement;
	}(_react.Component);

	DateElement.propTypes = {
	  name: _propTypes2.default.string.isRequired,
	  label: _propTypes2.default.string,
	  value: _propTypes2.default.string,
	  id: _propTypes2.default.string,
	  disabled: _propTypes2.default.bool,
	  required: _propTypes2.default.bool,
	  onUserInput: _propTypes2.default.func
	};

	DateElement.defaultProps = {
	  name: '',
	  label: '',
	  value: '',
	  id: '',
	  disabled: false,
	  required: false,
	  onUserInput: function onUserInput() {
	    console.warn('onUserInput() callback is not set');
	  }
	};

	/**
	 * Numeric Component
	 * React wrapper for a <input type="number"> element.
	 */

	var NumericElement = function (_Component7) {
	  _inherits(NumericElement, _Component7);

	  function NumericElement() {
	    _classCallCheck(this, NumericElement);

	    var _this7 = _possibleConstructorReturn(this, (NumericElement.__proto__ || Object.getPrototypeOf(NumericElement)).call(this));

	    _this7.handleChange = _this7.handleChange.bind(_this7);
	    return _this7;
	  }

	  _createClass(NumericElement, [{
	    key: 'handleChange',
	    value: function handleChange(e) {
	      this.props.onUserInput(this.props.name, e.target.value);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var disabled = this.props.disabled ? 'disabled' : null;
	      var required = this.props.required ? 'required' : null;
	      var requiredHTML = null;

	      return React.createElement(
	        'div',
	        { className: 'row form-group' },
	        React.createElement(
	          'label',
	          { className: 'col-sm-3 control-label', htmlFor: this.props.id },
	          this.props.label,
	          requiredHTML
	        ),
	        React.createElement(
	          'div',
	          { className: 'col-sm-9' },
	          React.createElement('input', {
	            type: 'number',
	            className: 'form-control',
	            name: this.props.name,
	            id: this.props.id,
	            min: this.props.min,
	            max: this.props.max,
	            value: this.props.value,
	            disabled: disabled,
	            required: required,
	            onChange: this.handleChange
	          })
	        )
	      );
	    }
	  }]);

	  return NumericElement;
	}(_react.Component);

	NumericElement.propTypes = {
	  name: _propTypes2.default.string.isRequired,
	  min: _propTypes2.default.number.isRequired,
	  max: _propTypes2.default.number.isRequired,
	  label: _propTypes2.default.string,
	  value: _propTypes2.default.string,
	  id: _propTypes2.default.string,
	  disabled: _propTypes2.default.bool,
	  required: _propTypes2.default.bool,
	  onUserInput: _propTypes2.default.func
	};

	NumericElement.defaultProps = {
	  name: '',
	  min: null,
	  max: null,
	  label: '',
	  value: '',
	  id: '',
	  required: false,
	  disabled: false,
	  onUserInput: function onUserInput() {
	    console.warn('onUserInput() callback is not set');
	  }
	};

	/**
	 * File Component
	 * React wrapper for a simple or 'multiple' <select> element.
	 */

	var FileElement = function (_Component8) {
	  _inherits(FileElement, _Component8);

	  function FileElement() {
	    _classCallCheck(this, FileElement);

	    var _this8 = _possibleConstructorReturn(this, (FileElement.__proto__ || Object.getPrototypeOf(FileElement)).call(this));

	    _this8.handleChange = _this8.handleChange.bind(_this8);
	    return _this8;
	  }

	  _createClass(FileElement, [{
	    key: 'handleChange',
	    value: function handleChange(e) {
	      // Send current file to parent component
	      var file = e.target.files[0] ? e.target.files[0] : '';
	      this.props.onUserInput(this.props.name, file);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var required = this.props.required ? 'required' : null;
	      var fileName = this.props.value ? this.props.value.name : undefined;
	      var requiredHTML = null;
	      var errorMessage = '';
	      var elementClass = 'row form-group';

	      // Add required asterix
	      if (required) {
	        requiredHTML = React.createElement(
	          'span',
	          { className: 'text-danger' },
	          '*'
	        );
	      }

	      var truncateEllipsis = {
	        display: 'table',
	        tableLayout: 'fixed',
	        width: '100%',
	        whiteSpace: 'nowrap'
	      };

	      var truncateEllipsisChild = {
	        display: 'table-cell',
	        overflow: 'hidden',
	        textOverflow: 'ellipsis'
	      };

	      // Add error message
	      if (this.props.hasError) {
	        errorMessage = this.props.errorMessage;
	        elementClass = 'row form-group has-error';
	      }

	      // Need to manually reset file value, because HTML API
	      // does not allow setting value to anything than empty string.
	      // Hence can't use value attribute in the input element.
	      var fileHTML = document.querySelector(".fileUpload");
	      if (fileHTML && !fileName) {
	        fileHTML.value = "";
	      }

	      if (this.props.disabled) {
	        // add padding to align video title on disabled field
	        truncateEllipsis.paddingTop = "7px";
	        return React.createElement(
	          'div',
	          { className: elementClass },
	          React.createElement(
	            'label',
	            { className: 'col-sm-3 control-label' },
	            this.props.label
	          ),
	          React.createElement(
	            'div',
	            { className: 'col-sm-9' },
	            React.createElement(
	              'div',
	              { style: truncateEllipsis },
	              React.createElement(
	                'span',
	                { style: truncateEllipsisChild },
	                fileName
	              )
	            )
	          )
	        );
	      }

	      return React.createElement(
	        'div',
	        { className: elementClass },
	        React.createElement(
	          'label',
	          { className: 'col-sm-3 control-label' },
	          this.props.label,
	          requiredHTML
	        ),
	        React.createElement(
	          'div',
	          { className: 'col-sm-9' },
	          React.createElement(
	            'div',
	            { className: 'input-group' },
	            React.createElement(
	              'div',
	              { tabIndex: '-1',
	                className: 'form-control file-caption kv-fileinput-caption' },
	              React.createElement(
	                'div',
	                { style: truncateEllipsis },
	                React.createElement(
	                  'span',
	                  { style: truncateEllipsisChild },
	                  fileName
	                )
	              ),
	              React.createElement('div', { className: 'file-caption-name', id: 'video_file' })
	            ),
	            React.createElement(
	              'div',
	              { className: 'input-group-btn' },
	              React.createElement(
	                'div',
	                { className: 'btn btn-primary btn-file' },
	                React.createElement('i', { className: 'glyphicon glyphicon-folder-open' }),
	                ' Browse',
	                React.createElement('input', {
	                  type: 'file',
	                  className: 'fileUpload',
	                  name: this.props.name,
	                  onChange: this.handleChange,
	                  required: required
	                })
	              )
	            )
	          ),
	          React.createElement(
	            'span',
	            null,
	            errorMessage
	          )
	        )
	      );
	    }
	  }]);

	  return FileElement;
	}(_react.Component);

	FileElement.propTypes = {
	  name: _propTypes2.default.string.isRequired,
	  label: _propTypes2.default.string,
	  value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]),
	  id: _propTypes2.default.string,
	  disabled: _propTypes2.default.bool,
	  required: _propTypes2.default.bool,
	  hasError: _propTypes2.default.bool,
	  errorMessage: _propTypes2.default.string,
	  onUserInput: _propTypes2.default.func
	};

	FileElement.defaultProps = {
	  name: '',
	  label: 'File to Upload',
	  value: '',
	  id: '',
	  disabled: false,
	  required: false,
	  hasError: false,
	  errorMessage: 'The field is required!',
	  onUserInput: function onUserInput() {
	    console.warn('onUserInput() callback is not set');
	  }
	};

	/**
	 * Static element component.
	 * Used to displays plain/formatted text as part of a form
	 *
	 * To pass a formatted text, you need to wrap it in a single parent element.
	 * Example usage:
	 *
	 * ```
	 * let myText = (<span>This is my <b>text</b></span>);
	 * <StaticElement
	 *    text={myText}
	 *    label={note}
	 * />
	 * ```
	 */

	var StaticElement = function (_Component9) {
	  _inherits(StaticElement, _Component9);

	  function StaticElement() {
	    _classCallCheck(this, StaticElement);

	    return _possibleConstructorReturn(this, (StaticElement.__proto__ || Object.getPrototypeOf(StaticElement)).apply(this, arguments));
	  }

	  _createClass(StaticElement, [{
	    key: 'render',
	    value: function render() {
	      return React.createElement(
	        'div',
	        { className: 'row form-group' },
	        React.createElement(
	          'label',
	          { className: 'col-sm-3 control-label' },
	          this.props.label
	        ),
	        React.createElement(
	          'div',
	          { className: 'col-sm-9' },
	          React.createElement(
	            'p',
	            { className: 'form-control-static' },
	            this.props.text
	          )
	        )
	      );
	    }
	  }]);

	  return StaticElement;
	}(_react.Component);

	StaticElement.propTypes = {
	  label: _propTypes2.default.string,
	  text: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.element])
	};

	StaticElement.defaultProps = {
	  label: '',
	  text: null
	};

	/**
	 * Link element component.
	 * Used to link plain/formated text to an href destination as part of a form
	 */

	var LinkElement = function (_Component10) {
	  _inherits(LinkElement, _Component10);

	  function LinkElement() {
	    _classCallCheck(this, LinkElement);

	    return _possibleConstructorReturn(this, (LinkElement.__proto__ || Object.getPrototypeOf(LinkElement)).apply(this, arguments));
	  }

	  _createClass(LinkElement, [{
	    key: 'render',
	    value: function render() {
	      return React.createElement(
	        'div',
	        { className: 'row form-group' },
	        React.createElement(
	          'label',
	          { className: 'col-sm-3 control-label' },
	          this.props.label
	        ),
	        React.createElement(
	          'div',
	          { className: 'col-sm-9' },
	          React.createElement(
	            'p',
	            { className: 'form-control-static' },
	            React.createElement(
	              'a',
	              { href: this.props.href },
	              this.props.text
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return LinkElement;
	}(_react.Component);

	LinkElement.propTypes = {
	  label: _propTypes2.default.string,
	  text: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.element]),
	  href: _propTypes2.default.string
	};

	LinkElement.defaultProps = {
	  label: '',
	  text: null,
	  href: null
	};

	/**
	 * Button component
	 * React wrapper for <button> element, typically used to submit forms
	 */

	var ButtonElement = function (_Component11) {
	  _inherits(ButtonElement, _Component11);

	  function ButtonElement() {
	    _classCallCheck(this, ButtonElement);

	    var _this11 = _possibleConstructorReturn(this, (ButtonElement.__proto__ || Object.getPrototypeOf(ButtonElement)).call(this));

	    _this11.handleClick = _this11.handleClick.bind(_this11);
	    return _this11;
	  }

	  _createClass(ButtonElement, [{
	    key: 'handleClick',
	    value: function handleClick(e) {
	      this.props.onUserInput(e);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return React.createElement(
	        'div',
	        { className: 'row form-group' },
	        React.createElement(
	          'div',
	          { className: this.props.columnSize },
	          React.createElement(
	            'button',
	            {
	              type: this.props.type,
	              className: this.props.buttonClass,
	              onClick: this.handleClick
	            },
	            this.props.label
	          )
	        )
	      );
	    }
	  }]);

	  return ButtonElement;
	}(_react.Component);

	ButtonElement.propTypes = {
	  label: _propTypes2.default.string,
	  type: _propTypes2.default.string,
	  onUserInput: _propTypes2.default.func
	};

	ButtonElement.defaultProps = {
	  label: 'Submit',
	  type: 'submit',
	  buttonClass: 'btn btn-primary',
	  columnSize: 'col-sm-9 col-sm-offset-3',
	  onUserInput: function onUserInput() {
	    console.warn('onUserInput() callback is not set');
	  }
	};

	/**
	 * Generic form element.
	 */

	var LorisElement = function (_Component12) {
	  _inherits(LorisElement, _Component12);

	  function LorisElement() {
	    _classCallCheck(this, LorisElement);

	    return _possibleConstructorReturn(this, (LorisElement.__proto__ || Object.getPrototypeOf(LorisElement)).apply(this, arguments));
	  }

	  _createClass(LorisElement, [{
	    key: 'render',
	    value: function render() {
	      var elementProps = this.props.element;
	      elementProps.ref = elementProps.name;
	      elementProps.onUserInput = this.props.onUserInput;

	      var elementHtml = React.createElement('div', null);

	      switch (elementProps.type) {
	        case 'text':
	          elementHtml = React.createElement(TextboxElement, elementProps);
	          break;
	        case 'select':
	          elementHtml = React.createElement(SelectElement, elementProps);
	          break;
	        case 'search':
	          elementHtml = React.createElement(SearchableDropdown, elementProps);
	          break;
	        case 'date':
	          elementHtml = React.createElement(DateElement, elementProps);
	          break;
	        case 'numeric':
	          elementHtml = React.createElement(NumericElement, elementProps);
	          break;
	        case 'textarea':
	          elementHtml = React.createElement(TextareaElement, elementProps);
	          break;
	        case 'file':
	          elementHtml = React.createElement(FileElement, elementProps);
	          break;
	        case 'static':
	          elementHtml = React.createElement(StaticElement, elementProps);
	          break;
	        case 'link':
	          elementHtml = React.createElement(LinkElement, elementProps);
	          break;
	        default:
	          console.warn("Element of type " + elementProps.type + " is not currently implemented!");
	          break;
	      }

	      return elementHtml;
	    }
	  }]);

	  return LorisElement;
	}(_react.Component);

	window.FormElement = FormElement;
	window.SelectElement = SelectElement;
	window.SearchableDropdown = SearchableDropdown;
	window.TextareaElement = TextareaElement;
	window.TextboxElement = TextboxElement;
	window.DateElement = DateElement;
	window.NumericElement = NumericElement;
	window.FileElement = FileElement;
	window.StaticElement = StaticElement;
	window.LinkElement = LinkElement;
	window.ButtonElement = ButtonElement;
	window.LorisElement = LorisElement;

	exports.default = {
	  FormElement: FormElement,
	  SelectElement: SelectElement,
	  SearchableDropdown: SearchableDropdown,
	  TextareaElement: TextareaElement,
	  TextboxElement: TextboxElement,
	  DateElement: DateElement,
	  NumericElement: NumericElement,
	  FileElement: FileElement,
	  StaticElement: StaticElement,
	  LinkElement: LinkElement,
	  ButtonElement: ButtonElement,
	  LorisElement: LorisElement
	};

/***/ }
/******/ ]);