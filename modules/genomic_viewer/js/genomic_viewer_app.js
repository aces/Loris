'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GenomicRange = function GenomicRange() {
  _classCallCheck(this, GenomicRange);
};

/* exported GenomicViewerApp */

/**
 * Genomic viewer tool
 *
 * Serves as an browser for genomic data.
 *
 * @author Xavier Lecours Boucher
 * @version 1.0.0
 *
 * */


var GenomicViewerApp = function (_React$Component) {
  _inherits(GenomicViewerApp, _React$Component);

  function GenomicViewerApp(props) {
    _classCallCheck(this, GenomicViewerApp);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GenomicViewerApp).call(this, props));

    _this.state = {
      // Create a default genomic range to show 
      genomicRange: new GenomicRange('chrY:15,012,776-15,036,313')
    };

    // Bind component instance to custom methods
    _this.setGenomicRange = _this.setGenomicRange.bind(_this);
    return _this;
  }

  /**
   * Sets a new Genomic Range
   *
   * @param {GenomicRange} genomicRange - the new genomic range
   *
   * @note This function will try to construct a genomicRange if a string is received.
   */


  _createClass(GenomicViewerApp, [{
    key: 'setGenomicRange',
    value: function setGenomicRange(genomicRange) {
      var genomicRange = new GenomicRange(genomicRange);

      if (false) {
        console.error('Invalid parameter provided');
      }

      this.setState({ genomicRange: genomicRange });
    }
  }, {
    key: 'render',
    value: function render() {

      // Defining element names here ensures that `name` and `ref`
      // properties of the element are always kept in sync
      var patientID = "patientID";
      var workspaceSize = this.getDOMNode().style.width;

      return React.createElement(
        'table',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement(
            'td',
            null,
            workspaceSize
          )
        )
      );
    }
  }]);

  return GenomicViewerApp;
}(React.Component);

/**
 * Render dicom_page on page load
 */


window.onload = function () {
  var viewer = React.createElement(GenomicViewerApp, null);

  // Create a wrapper div in which react component will be loaded
  var genomicViewerDOM = document.createElement('div');
  genomicViewerDOM.id = 'page-genomic-viewer';

  // Append wrapper div to page content
  var rootDOM = document.getElementById("lorisworkspace");
  rootDOM.appendChild(genomicViewerDOM);

  React.render(viewer, document.getElementById("page-genomic-viewer"));
};