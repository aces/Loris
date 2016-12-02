'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * The control panel is used to input the genomic location to view.
 * It also provide ways to navigate namely zomming and scrolling.
 */
var ControlPanel = function (_React$Component) {
  _inherits(ControlPanel, _React$Component);

  function ControlPanel(props) {
    _classCallCheck(this, ControlPanel);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ControlPanel).call(this, props));

    _this.state = {
      genomicRange: props.genomicRange
    };

    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    _this.handleNavigation = _this.handleNavigation.bind(_this);
    return _this;
  }

  _createClass(ControlPanel, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.hasOwnProperty('genomicRange')) {
        this.setState({ genomicRange: nextProps.genomicRange });
      }
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      this.setState({ genomicRange: event.target.value });
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(event) {
      event.preventDefault();
      this.props.setGenomicRange(this.state.genomicRange);
    }
  }, {
    key: 'handleNavigation',
    value: function handleNavigation(event) {
      event.preventDefault();

      var newGenomicRange, newFrom, newTo, rangeSpan;

      var _state$genomicRange$m = this.state.genomicRange.match(/(^chr|^Chr|^CHR|^)([0-9]|[1][0-9]|[2][0-2]|[xXyYmM]):([0-9, ]+)-([0-9, ]+)/i);

      var _state$genomicRange$m2 = _slicedToArray(_state$genomicRange$m, 5);

      var oldRange = _state$genomicRange$m2[0];
      var prefix = _state$genomicRange$m2[1];
      var chr = _state$genomicRange$m2[2];
      var from = _state$genomicRange$m2[3];
      var to = _state$genomicRange$m2[4];


      from = parseInt(from);
      to = parseInt(to);
      rangeSpan = to - from;

      switch (event.target.id) {
        case 'control-chevron-left':
          // Move 90% of the viewer's span toward 5' (left)
          newFrom = from - Math.round(rangeSpan * 0.9);
          newTo = to - Math.round(rangeSpan * 0.9);
          break;
        case 'control-chevron-zoom-out':
          // Increase the viewer' span 2 times keeping center
          newFrom = from - Math.round(rangeSpan * 0.5);
          newTo = to + Math.round(rangeSpan * 0.5);
          break;
        case 'control-chevron-zoom-in':
          // Reduce the viewer' span by 50% keeping center
          newFrom = from + Math.round(rangeSpan * 0.25);
          newTo = to - Math.round(rangeSpan * 0.25);
          break;
        case 'control-chevron-right':
          // Move 90% of the viewer's span toward 3' (right)
          newFrom = from + Math.round(rangeSpan * 0.9);
          newTo = to + Math.round(rangeSpan * 0.9);
          break;
      }

      newGenomicRange = 'chr'.concat(chr, ':', newFrom, '-', newTo);
      this.props.setGenomicRange(newGenomicRange);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'center',
          null,
          React.createElement(
            'form',
            { onSubmit: this.handleSubmit },
            React.createElement(
              'div',
              { className: 'searche-input' },
              React.createElement('input', {
                type: 'text',
                size: '30',
                value: this.state.genomicRange,
                onChange: this.handleChange,
                placeholder: 'Ex: chrY:15012776-15036313',
                pattern: '(^chr|^Chr|^CHR|^)([0-9]|[1][0-9]|[2][0-2]|[xXyYmM]):([0-9, ]+)-([0-9, ]+)'
              }),
              React.createElement('span', {
                id: 'control-glyphicon-search',
                className: 'glyphicon glyphicon-search',
                onClick: this.handleSubmit })
            ),
            React.createElement(
              'div',
              { className: 'navigation-buttons' },
              React.createElement('span', {
                id: 'control-chevron-left',
                className: 'glyphicon glyphicon-chevron-left',
                onClick: this.handleNavigation
              }),
              React.createElement('span', {
                id: 'control-chevron-zoom-out',
                className: 'glyphicon glyphicon-zoom-out',
                onClick: this.handleNavigation
              }),
              React.createElement('span', {
                id: 'control-chevron-zoom-in',
                className: 'glyphicon glyphicon-zoom-in',
                onClick: this.handleNavigation
              }),
              React.createElement('span', {
                id: 'control-chevron-right',
                className: 'glyphicon glyphicon-chevron-right',
                onClick: this.handleNavigation
              })
            )
          )
        )
      );
    }
  }]);

  return ControlPanel;
}(React.Component);

ControlPanel.propTypes = {
  genomicRange: React.PropTypes.string,
  setGenomicRange: React.PropTypes.func.isRequired
};

ControlPanel.defaultProps = {
  genomicRange: ""
};

var Track = function (_React$Component2) {
  _inherits(Track, _React$Component2);

  function Track(props) {
    _classCallCheck(this, Track);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Track).call(this, props));

    _this2.state = {};
    return _this2;
  }

  _createClass(Track, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          this.props.title
        ),
        React.createElement(
          'td',
          null,
          this.props.children
        )
      );
    }
  }]);

  return Track;
}(React.Component);

var Gene = function (_React$Component3) {
  _inherits(Gene, _React$Component3);

  function Gene(props) {
    _classCallCheck(this, Gene);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Gene).call(this, props));

    _this3.state = {};

    _this3.showGeneDetails = _this3.showGeneDetails.bind(_this3);
    return _this3;
  }

  _createClass(Gene, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var ctx = this.refs.thisCanvas.getDOMNode().getContext('2d');
      ctx.rect(0, 0, 120, 17);
      ctx.stroke();
    }
  }, {
    key: 'showGeneDetails',
    value: function showGeneDetails() {
      alert('Bob');
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('canvas', { ref: 'thisCanvas', width: '800', height: '20', onClick: this.showGeneDetails });
    }
  }]);

  return Gene;
}(React.Component);

var GeneTrack = function (_React$Component4) {
  _inherits(GeneTrack, _React$Component4);

  function GeneTrack(props) {
    _classCallCheck(this, GeneTrack);

    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(GeneTrack).call(this, props));

    _this4.state = {};
    return _this4;
  }

  _createClass(GeneTrack, [{
    key: 'render',
    value: function render() {
      var genes = [React.createElement(Gene, null), React.createElement(Gene, null)];
      return React.createElement(
        Track,
        {
          title: 'refGenes' },
        genes
      );
    }
  }]);

  return GeneTrack;
}(React.Component);

var CPGTrack = function (_React$Component5) {
  _inherits(CPGTrack, _React$Component5);

  function CPGTrack() {
    _classCallCheck(this, CPGTrack);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(CPGTrack).apply(this, arguments));
  }

  _createClass(CPGTrack, [{
    key: 'render',
    value: function render() {
      return React.createElement('div', null);
    }
  }]);

  return CPGTrack;
}(React.Component);

var SNPTrack = function (_React$Component6) {
  _inherits(SNPTrack, _React$Component6);

  function SNPTrack() {
    _classCallCheck(this, SNPTrack);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(SNPTrack).apply(this, arguments));
  }

  _createClass(SNPTrack, [{
    key: 'render',
    value: function render() {
      return React.createElement('div', null);
    }
  }]);

  return SNPTrack;
}(React.Component);

var ChIPPeakTrack = function (_React$Component7) {
  _inherits(ChIPPeakTrack, _React$Component7);

  function ChIPPeakTrack() {
    _classCallCheck(this, ChIPPeakTrack);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ChIPPeakTrack).apply(this, arguments));
  }

  _createClass(ChIPPeakTrack, [{
    key: 'render',
    value: function render() {
      return React.createElement('div', null);
    }
  }]);

  return ChIPPeakTrack;
}(React.Component);

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


var GenomicViewerApp = function (_React$Component8) {
  _inherits(GenomicViewerApp, _React$Component8);

  function GenomicViewerApp(props) {
    _classCallCheck(this, GenomicViewerApp);

    var _this8 = _possibleConstructorReturn(this, Object.getPrototypeOf(GenomicViewerApp).call(this, props));

    _this8.state = {
      // Create a default genomic range to show 
      genomicRange: null
    };

    // Bind component instance to custom methods
    _this8.setGenomicRange = _this8.setGenomicRange.bind(_this8);
    return _this8;
  }

  /**
   * Update the state with the browser info.
   */


  _createClass(GenomicViewerApp, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      console.log(React.findDOMNode(this));
    }

    /**
     * Sets a new Genomic Range
     *
     * @param {GenomicRange} genomicRange - the new genomic range
     *
     * @note This function will try to construct a genomicRange if a string is received.
     */

  }, {
    key: 'setGenomicRange',
    value: function setGenomicRange(genomicRange) {
      var genomicRange = genomicRange;

      //  Do some regexp validation
      //  console.error('Invalid parameter provided');

      this.setState({ genomicRange: genomicRange });
    }
  }, {
    key: 'render',
    value: function render() {

      // Defining element names here ensures that `name` and `ref`
      // properties of the element are always kept in sync
      var patientID = "patientID";

      var genomicRange = this.state.genomicRange;

      // Create the tracks according to state
      return React.createElement(
        'table',
        { className: 'col-md-12' },
        React.createElement(
          'tbody',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement('th', { className: 'col-md-2' }),
            React.createElement('th', { className: 'col-md-10' })
          ),
          React.createElement(
            'tr',
            null,
            React.createElement(
              'td',
              { colSpan: '2' },
              React.createElement(ControlPanel, { genomicRange: genomicRange, setGenomicRange: this.setGenomicRange })
            )
          ),
          React.createElement(GeneTrack, null),
          React.createElement(CPGTrack, null),
          React.createElement(SNPTrack, null),
          React.createElement(ChIPPeakTrack, null)
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