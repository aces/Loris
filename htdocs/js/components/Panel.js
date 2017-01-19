"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* exported Panel */

/**
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
var Panel = function (_React$Component) {
  _inherits(Panel, _React$Component);

  function Panel(props) {
    _classCallCheck(this, Panel);

    var _this = _possibleConstructorReturn(this, (Panel.__proto__ || Object.getPrototypeOf(Panel)).call(this, props));

    _this.state = {
      collapsed: false
    };

    _this.toggleCollapsed = _this.toggleCollapsed.bind(_this);
    return _this;
  }

  _createClass(Panel, [{
    key: "toggleCollapsed",
    value: function toggleCollapsed() {
      this.setState({ collapsed: !this.state.collapsed });
    }
  }, {
    key: "render",
    value: function render() {
      // Selection filter open by default
      var glyphClass = "glyphicon pull-right glyphicon-chevron-up";
      var panelClass = "panel-collapse collapse in";

      // Change arrow direction when closed
      if (this.state.collapsed) {
        glyphClass = "glyphicon pull-right glyphicon-chevron-down";
      }

      return React.createElement(
        "div",
        { className: "panel panel-primary" },
        React.createElement(
          "div",
          { className: "panel-heading",
            onClick: this.toggleCollapsed,
            "data-toggle": "collapse",
            "data-target": '#' + this.props.id,
            style: { cursor: 'pointer' }
          },
          this.props.title,
          React.createElement("span", { className: glyphClass })
        ),
        React.createElement(
          "div",
          { id: this.props.id, className: panelClass, role: "tabpanel" },
          React.createElement(
            "div",
            { className: "panel-body", style: { height: this.props.height } },
            this.props.children
          )
        )
      );
    }
  }]);

  return Panel;
}(React.Component);

Panel.propTypes = {
  id: React.PropTypes.string,
  height: React.PropTypes.string,
  title: React.PropTypes.string
};
Panel.defaultProps = {
  id: 'default-panel',
  height: '100%',
  title: 'Selection Filter'
};