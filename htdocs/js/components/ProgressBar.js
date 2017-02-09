'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* exported ProgressBar */

/**
 * React ProgressBar.
 *
 * Updates UI automatically when passed a progress value between 0 and 100.
 * To hide progress bar before/after upload, set value to -1.
 *
 * Note: This component relies on Bootstrap 3 progress-bar classes
 * (http://getbootstrap.com/components/#progress)
 */
var ProgressBar = function (_React$Component) {
  _inherits(ProgressBar, _React$Component);

  function ProgressBar() {
    _classCallCheck(this, ProgressBar);

    return _possibleConstructorReturn(this, (ProgressBar.__proto__ || Object.getPrototypeOf(ProgressBar)).apply(this, arguments));
  }

  _createClass(ProgressBar, [{
    key: 'render',
    value: function render() {
      var progressStyle = {
        display: this.props.value < 0 ? 'none' : 'block',
        backgroundColor: '#d3d3d3',
        height: '30px',
        position: 'relative'
      };

      var labelStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1000,
        width: '100%',
        color: '#fff',
        textAlign: 'center',
        lineHeight: '30px',
        fontWeight: '600'
      };

      return React.createElement(
        'div',
        { className: 'progress', style: progressStyle },
        React.createElement('div', {
          className: 'progress-bar progress-bar-striped active',
          role: 'progressbar',
          'aria-valuemin': '0',
          'aria-valuemax': '100',
          'aria-valuenow': this.props.value,
          style: { width: this.props.value + '%' }
        }),
        React.createElement(
          'span',
          { style: labelStyle },
          this.props.value,
          '%'
        )
      );
    }
  }]);

  return ProgressBar;
}(React.Component);

ProgressBar.propTypes = {
  value: React.PropTypes.number
};
ProgressBar.defaultProps = {
  value: 0
};