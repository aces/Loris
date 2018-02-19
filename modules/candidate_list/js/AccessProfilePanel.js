!function (modules) {
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {exports: {}, id: moduleId, loaded: !1};
        return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), module.loaded = !0, module.exports
    }

    var installedModules = {};
    return __webpack_require__.m = modules, __webpack_require__.c = installedModules, __webpack_require__.p = "", __webpack_require__(0)
}([function (module, exports, __webpack_require__) {
    "use strict";

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {default: obj}
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function")
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !call || "object" != typeof call && "function" != typeof call ? self : call
    }

    function _inherits(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass)
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor)
            }
        }

        return function (Constructor, protoProps, staticProps) {
            return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor
        }
    }(), _Panel = __webpack_require__(1), _Panel2 = _interopRequireDefault(_Panel);
    (function (_React$Component) {
        function AccessProfilePanel(props) {
            return _classCallCheck(this, AccessProfilePanel), _possibleConstructorReturn(this, (AccessProfilePanel.__proto__ || Object.getPrototypeOf(AccessProfilePanel)).call(this, props))
        }

        return _inherits(AccessProfilePanel, _React$Component), _createClass(AccessProfilePanel, [{
            key: "render",
            value: function () {
                return loris.userHasPermission("access_all_profiles") ? React.createElement("div", null) : React.createElement(_Panel2.default, {title: "OpenProfile"}, React.createElement("form", {
                    className: "form-horizontal",
                    id: "accessProfileForm",
                    name: "accessProfileForm",
                    method: "get",
                    action: "#"
                }, React.createElement("input", {
                    type: "hidden",
                    name: "test_name",
                    value: "timepoint_list"
                }), React.createElement("div", {className: "form-group col-sm-12"}, React.createElement("label", {className: "col-sm-12 col-md-4"}, "CandID"), React.createElement("div", {className: "col-sm-12 col-md-8"}, React.createElement("input", {type: "text"}))), React.createElement("div", {className: "form-group col-sm-12"}, React.createElement("label", {className: "col-sm-12 col-md-4"}, "PSCID"), React.createElement("div", {className: "col-sm-12 col-md-8"}, React.createElement("input", {type: "text"}))), React.createElement("input", {
                    type: "submit",
                    value: "Open Profile",
                    className: "btn btn-sm btn-primary col-md-5 col-sm-12 col-md-offset-5"
                })))
            }
        }]), AccessProfilePanel
    })(React.Component)
}, function (module, exports) {
    "use strict";

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function")
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !call || "object" != typeof call && "function" != typeof call ? self : call
    }

    function _inherits(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass)
    }

    Object.defineProperty(exports, "__esModule", {value: !0});
    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor)
            }
        }

        return function (Constructor, protoProps, staticProps) {
            return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor
        }
    }(), Panel = function (_React$Component) {
        function Panel(props) {
            _classCallCheck(this, Panel);
            var _this = _possibleConstructorReturn(this, (Panel.__proto__ || Object.getPrototypeOf(Panel)).call(this, props));
            return _this.state = {collapsed: _this.props.initCollapsed}, _this.panelClass = _this.props.initCollapsed ? "panel-collapse collapse" : "panel-collapse collapse in", _this.toggleCollapsed = _this.toggleCollapsed.bind(_this), _this
        }

        return _inherits(Panel, _React$Component), _createClass(Panel, [{
            key: "toggleCollapsed", value: function () {
                this.setState({collapsed: !this.state.collapsed})
            }
        }, {
            key: "render", value: function () {
                var glyphClass = this.state.collapsed ? "glyphicon pull-right glyphicon-chevron-down" : "glyphicon pull-right glyphicon-chevron-up",
                    panelHeading = this.props.title ? React.createElement("div", {
                        className: "panel-heading",
                        onClick: this.toggleCollapsed,
                        "data-toggle": "collapse",
                        "data-target": "#" + this.props.id,
                        style: {cursor: "pointer"}
                    }, this.props.title, React.createElement("span", {className: glyphClass})) : "";
                return React.createElement("div", {className: "panel panel-primary"}, panelHeading, React.createElement("div", {
                    id: this.props.id,
                    className: this.panelClass,
                    role: "tabpanel"
                }, React.createElement("div", {
                    className: "panel-body",
                    style: {height: this.props.height}
                }, this.props.children)))
            }
        }]), Panel
    }(React.Component);
    Panel.propTypes = {
        id: React.PropTypes.string,
        height: React.PropTypes.string,
        title: React.PropTypes.string
    }, Panel.defaultProps = {initCollapsed: !1, id: "default-panel", height: "100%"}, exports.default = Panel
}]);
//# sourceMappingURL=AccessProfilePanel.js.map